<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import TituloRegistro from "$lib/components/TituloRegistro.svelte";
    import ComiteCarousel from "$lib/components/ComiteCarousel.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import { intlPhone } from "$lib/actions/intlPhone";
    import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
    import { onChangeSaveCookie, resetValuesFromCookies, validateNumInput } from "$lib/util";
    import { registroTitleNav } from "$lib/stores/registro-title-nav";
    import {
        comites,
        getComitePorSiglas,
        getHorarioComite
    } from "$lib/data/comites";
    import {
        delegaciones,
        formatoPrecio,
        getClaveRegistroComite,
        getComitePorClaveRegistro,
        getDelegacionTipoLabel,
        isDelegacionTipoDisponibleEnModalidad,
        obtenerTipoDelegacion,
        permiteModalidadComite,
        registroConfig,
        type Delegacion,
        type DelegacionGrupo
    } from "$lib/data/registro";
    import { paises } from "$lib/data/paises.json";
    import "intl-tel-input/build/css/intlTelInput.css";
    import "bootstrap/dist/css/bootstrap.min.css";
    import "$lib/styles/registro-form.css";

    // Workaround para emojis de banderas en algunos navegadores
    polyfillCountryFlagEmojis();

    // Observador para cambiar el nav
    let navObserver: IntersectionObserver;

    // Elementos del DOM
    let formDelegaciones: HTMLFormElement;
    let correoValidity = $state([true, true]);
    let comprobanteToastDiv: HTMLDivElement;
    let enviarToastDiv: HTMLDivElement;
    let whatsappToastDiv: HTMLDivElement;
    let sentinel: HTMLDivElement;

    // Variables reactivas
    let modalidadValue = $state("");
    let delegacionOficialValue = $state("");
    let edadValues: string[] = $state(Array(2).fill(""));
    let escolaridadValues: string[] = $state(Array(2).fill(""));
    let comiteValues: string[] = $state(Array(3).fill(""));
    let comitePaisValues: string[][] = $state(Array.from({ length: 3 }, () => Array(3).fill("")));
    let loadedCookies = $state(false);
    let idempotencyKey = $state("");
    let isSubmitting = $state(false);
    const IDEMPOTENCY_STORAGE_KEY = "registro-delegaciones-idempotency-key";
    const IDEMPOTENCY_TAB_NAME_PREFIX = "smmun-registro-tab:";
    const SUBMIT_FALLBACK_TIMEOUT_MS = 10000;
    let pageShowHandler: ((event: Event) => void) | undefined;
    let submitFallbackTimeout: ReturnType<typeof setTimeout> | undefined;
    const modalidadOptions = [
        { value: "individual", label: "Delegación (individual)" },
        { value: "pareja", label: "Codelegación (bina)" }
    ];
    const delegacionOficialOptions = [
        { value: "si", label: "Sí" },
        { value: "no", label: "No" }
    ];
    const escolaridadOptions = ["Secundaria", "Preparatoria", "Universidad", "Egresado", "No estudio"].map((escolaridad) => ({
        value: escolaridad,
        label: escolaridad
    }));
    const paisOptions = paises.map((pais) => ({ value: pais, label: pais }));

    function getComiteOptions(index: number) {
        return comites.map(({ nombre, siglas }) => ({
            value: siglas,
            label: nombre,
            searchText: siglas,
            disabled: !permiteModalidadComite(siglas, modalidadValue)
                || (index >= 1 && comiteValues[0] === siglas)
                || (index === 2 && comiteValues[1] === siglas)
        }));
    }

    function getDelegacionOptions(comiteIndex: number, delegacionIndex: number) {
        const siglas = comiteValues[comiteIndex];

        if (!siglas) {
            return comites.flatMap((comite) => getDelegacionOptionsForComite(comite.siglas, delegacionIndex, true));
        }

        return getDelegacionOptionsForComite(siglas, delegacionIndex, false, comiteIndex);
    }

    function getDelegacionOptionsForComite(siglas: string, delegacionIndex: number, hidden: boolean, comiteIndex = 0) {
        const claveRegistro = getClaveRegistroComite(siglas);
        const source = delegaciones[claveRegistro];

        if (!source) return [];

        const isAlreadySelected = (nombre: string) => {
            const optionValue = `${siglas}:${nombre}`;
            return (delegacionIndex >= 1 && comitePaisValues[comiteIndex][0] === optionValue)
                || (delegacionIndex === 2 && comitePaisValues[comiteIndex][1] === optionValue);
        };

        const toOption = (delegacion: Delegacion, group?: string) => ({
            value: `${siglas}:${delegacion.nombre}`,
            label: delegacion.nombre,
            icon: delegacion.emoji,
            searchText: delegacion.abreviacion,
            group,
            hidden,
            disabled: !hidden && isAlreadySelected(delegacion.nombre)
        });

        if (Array.isArray(source)) {
            return source.map((delegacion) => toOption(delegacion));
        }

        return Object.entries(source as DelegacionGrupo).flatMap(([tipo, lista]) => {
            if (!hidden && !isDelegacionTipoDisponibleEnModalidad(claveRegistro, tipo, modalidadValue)) {
                return [];
            }

            const group = getDelegacionTipoLabel(claveRegistro, tipo, modalidadValue);
            return lista.map((delegacion) => toOption(delegacion, group));
        });
    }

    function createIdempotencyKey() {
        if (crypto.randomUUID) {
            return crypto.randomUUID().replace(/-/g, "");
        }

        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);
        return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    function ensureIdempotencyTabKey() {
        if (!window.name || !window.name.startsWith(IDEMPOTENCY_TAB_NAME_PREFIX)) {
            window.name = `${IDEMPOTENCY_TAB_NAME_PREFIX}${createIdempotencyKey()}`;
        }

        return `${IDEMPOTENCY_STORAGE_KEY}:${window.name.slice(IDEMPOTENCY_TAB_NAME_PREFIX.length)}`;
    }

    function ensureIdempotencyKey() {
        const storageKey = ensureIdempotencyTabKey();
        const storedKey = sessionStorage.getItem(storageKey);

        if (storedKey) {
            idempotencyKey = storedKey;
            return idempotencyKey;
        }

        const legacyStoredKey = sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY);

        if (legacyStoredKey) {
            idempotencyKey = legacyStoredKey;
            sessionStorage.setItem(storageKey, idempotencyKey);
            sessionStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
            return idempotencyKey;
        }

        idempotencyKey = createIdempotencyKey();
        sessionStorage.setItem(storageKey, idempotencyKey);
        return idempotencyKey;
    }

    // Event handlers
    function onChangeModalidad(ev: Event) {
        const select = ev.target as HTMLSelectElement;
        const nuevaModalidad = select.value;

        for (let i = 0; i < 3; i++) {
            if (!permiteModalidadComite(comiteValues[i], nuevaModalidad)) {
                comiteValues[i] = "";

                for (let j = 0; j < 3; j++) {
                    comitePaisValues[i][j] = "";
                }
            }
        }

        for (let i = 0; i < 3; i++) {
            const comiteSiglas = comiteValues[i];

            if (!comiteSiglas) continue;

            const comiteKey = getClaveRegistroComite(comiteSiglas);

            if (!getComitePorClaveRegistro(comiteKey)?.delegacionesAgrupadas) continue;

            for (let j = 0; j < 3; j++) {
                const valor = comitePaisValues[i][j];

                if (!valor) continue;

                const indiceDosPuntos = valor.indexOf(":");
                const nombreDelegacion =
                    indiceDosPuntos === -1 ? valor : valor.slice(indiceDosPuntos + 1);

                const tipoDelegacion = obtenerTipoDelegacion(comiteKey, nombreDelegacion);

                if (tipoDelegacion && !isDelegacionTipoDisponibleEnModalidad(comiteKey, tipoDelegacion, nuevaModalidad)) {
                    comitePaisValues[i][j] = "";
                }
            }
        }

        onChangeSaveCookie(ev);
    }

    function onChangeEdad(ev: Event, index: number) {
        let input = ev.target as HTMLInputElement;
        edadValues[index] = input.value.replace(/[^\d]/gi, "");

        if (!validateNumInput(input.value, registroConfig.participantes.edadMinima, registroConfig.participantes.edadMaxima)) {
            input.setCustomValidity("Edad inválida.");
        }
        else {
            input.setCustomValidity("");
        }

        onChangeSaveCookie(ev);
    }

    function onChangeCorreo(ev: Event, index: number) {
        let input = ev.target as HTMLInputElement;
        correoValidity[index] = input.checkValidity();
        onChangeSaveCookie(ev);
    }

    function onChangeComite(ev: Event, index: number) {
        if (index <= 1 && comiteValues[2] == comiteValues[index]) {
            comiteValues[2] = "";
        }

        if (index == 0 && comiteValues[1] == comiteValues[index]) {
            comiteValues[1] = "";
        }

        for (let i = 0; i < 3; i++) {
            comitePaisValues[index][i] = "";
        }

        onChangeSaveCookie(ev);
    }

    function onChangePais(ev: Event, comite_index: number, pais_index: number) {
        if (pais_index <= 1 && comitePaisValues[comite_index][2] == comitePaisValues[comite_index][pais_index]) {
            comitePaisValues[comite_index][2] = ""; 
        }

        if (pais_index == 0 && comitePaisValues[comite_index][1] == comitePaisValues[comite_index][pais_index]) {
            comitePaisValues[comite_index][1] = "";
        }

        onChangeSaveCookie(ev);
    }

    function onChangeComprobante(ev: Event) {
        let input = ev.target as HTMLInputElement;
        let comprobanteToast = window.bootstrap.Toast.getOrCreateInstance(comprobanteToastDiv);
        let file = input.files?.[0];

        if (!file) {
            return;
        }

        const extensionStart = file.name.lastIndexOf(".");
        const extension = extensionStart === -1 ? "" : file.name.slice(extensionStart).toLowerCase();
        const allowedMimeTypes = registroConfig.comprobante.mimeTypesPorExtension[extension];

        if (!allowedMimeTypes || !allowedMimeTypes.includes(file.type) || file.size > registroConfig.comprobante.maximoBytes) {
            comprobanteToast.show();
            input.value = "";
        }
    }

    function onSubmitForm(ev: Event) {
        let form = ev.target as HTMLFormElement;

        if (!form.checkValidity()) {
            if (submitFallbackTimeout) {
                clearTimeout(submitFallbackTimeout);
                submitFallbackTimeout = undefined;
            }
            ev.preventDefault();
            ev.stopPropagation();
            isSubmitting = false;

            // Mostrar error
            window.bootstrap.Toast.getOrCreateInstance(enviarToastDiv).show();
        }
        else if (isSubmitting) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        else {
            if (submitFallbackTimeout) {
                clearTimeout(submitFallbackTimeout);
                submitFallbackTimeout = undefined;
            }
            ensureIdempotencyKey();
            isSubmitting = true;
            submitFallbackTimeout = setTimeout(() => {
                isSubmitting = false;
                submitFallbackTimeout = undefined;
            }, SUBMIT_FALLBACK_TIMEOUT_MS);
        }

        form.classList.add("was-validated");
    }

    onMount(async () => {
        ensureIdempotencyKey();

        // Importar Bootstrap para carruseles y avisos.
        window.bootstrap = await import("bootstrap");

        // Inicializar toast de contacto en WhatsApp
        window.bootstrap.Toast.getOrCreateInstance(whatsappToastDiv).show();

        pageShowHandler = () => {
            isSubmitting = false;
            ensureIdempotencyKey();
        };
        window.addEventListener("pageshow", pageShowHandler);
        resetValuesFromCookies(formDelegaciones.elements);
        loadedCookies = true;

        // Actualizar navbar al hacer scroll
        navObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                registroTitleNav.set(false);
            } else {
                registroTitleNav.set(true);
            }
        }, {
            root: null,
            threshold: 0
        });

        navObserver.observe(sentinel);
    });

    onDestroy(() => {
        if (pageShowHandler) {
            window.removeEventListener("pageshow", pageShowHandler);
        }
        if (submitFallbackTimeout) {
            clearTimeout(submitFallbackTimeout);
        }
        if (navObserver) {
            navObserver.disconnect();
        }
    });
</script>

<!-- Ajustes globales del selector internacional de teléfonos. -->
<svelte:head>
    <style>
        .iti {
            width: 100%;
            margin-bottom: 1.5vh;
        }

        .iti__search-input {
            height: 2rem;
        }

        .iti__country-container {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .iti__country {
            margin: 1rem 0;
        }

        .iti__selected-country-primary {
            height: 100%;
            display: flex;
            align-items: center;
            margin: 0 0.5vw;
        }

        .iti__dropdown-content {
            border-radius: var(--bs-border-radius);
            padding: 2vh 1.5vw !important;
        }

    </style>
</svelte:head>

<style>
    :global(body:has(main.registro-delegaciones)) {
        background-color: #f7f5ff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E"),
        linear-gradient(
            to bottom,
            rgba(0,0,0,0.05) 1px,
            transparent 1px
        );
        background-size: 200px 200px, 100% 28px;
        background-position: 0 0, 0 5px;
    }

    /*:global(body:has(main.registro-delegaciones))::before {
        content: "";
        position: fixed;
        top: 0;
        left: 64px;
        width: 2px;
        height: 100vh;
        background-color: rgba(200, 0, 0, 0.35);
        pointer-events: none;
        z-index: -1;
    }*/

    .titulo {
        background-color: var(--pink);
        padding: 2vh 0 2vh 0;
        color: #ffffff;
        font-family: "Binate", "Raleway", sans-serif;
        margin-bottom: 2vh;
    }

    .titulo h2 {
        margin: 0;
        padding: 0.5vh 3vw;
        font-size: 2.3rem;
        text-align: center;
        font-weight: bold;
    }

    form {
        display: flex;
        flex-direction: column;
        font-family: "Binate", "Raleway", sans-serif;
    }

    form a {
        color: var(--ink);
    }

    .modality-guide {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-self: center;
        justify-self: center;
    }

    #img-modalidad {
        width: 100%;
        height: auto;
        margin: 0;
        border-radius: 12px;
    }

    div:has(#img-pago) {
        display: flex;
        flex-direction: column;
    }

    #img-pago {
        width: 30rem;
        height: auto;
        align-self: center;
        justify-self: center;
        margin: 1vh 0;
        border-radius: 12px;
    }

    .mb-3 {
        margin: 0 7vw;
    }

    form > div {
        margin-bottom: 3vh;
    }

    form input {
        margin-bottom: 1.5vh;
        border: var(--bs-border-width) solid var(--pink);
        border-radius: var(--bs-border-radius);
    }

    form input:focus {
        border: none;
    }

    label {
        color: var(--ink);
        font-weight: bold;
    }

    .comite-topico-div {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .comite-horario {
        margin: 0;
        color: var(--ink);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: 1rem;
        line-height: 1.4;
    }
</style>

<!-- Sentinel para cambiar el navbar -->
<div id="nav-sentinel" bind:this={sentinel}></div>

<!-- Título -->
<TituloRegistro text="Registro de delegaciones"></TituloRegistro>

<!-- Forms -->
<form bind:this={formDelegaciones} method="POST" action={registroConfig.endpoints.delegaciones} name="registro-delegaciones" enctype="multipart/form-data" class="col g-3" novalidate onsubmit={onSubmitForm}>
    <input type="hidden" name="idempotency_key" bind:value={idempotencyKey}>
    <!-- Selección de modalidad -->
    <article class="titulo">
        <div class="oval">
            <h2>
                Modalidad
            </h2>
        </div>
    </article>

    <div class="modality-guide">
        <img id="img-modalidad" src="/assets/img/registro/modalidad.png" alt="Modalidades permitidas para cada comité." />
    </div>

    <div class="mb-3">
        <div>
            <label for="modalidad" class="form-label">Selecciona tu modalidad de participación <span style="color: red;">*</span></label>
            <SearchSelect
                name="modalidad"
                options={modalidadOptions}
                bind:value={modalidadValue}
                ariaLabel="Modalidad de participación"
                required
                onchange={onChangeModalidad}
            />
            <div class="invalid-feedback">Debes seleccionar una opción.</div>
        </div>

        {#if modalidadValue == "pareja"}
            <p>
                <strong>Nota:</strong> El registro de una codelegación solo deberá llenarse una vez con la información de las dos participantes.
            </p>
        {/if}
    </div>

    <!-- Selección de delegación oficial -->
    <article class="titulo">
        <h2>Delegación oficial</h2>
    </article>

    <div class="mb-3">
        <p>Una delegación oficial es un grupo que representa a una agrupación y tiene a una persona que lo asesora, el cual recibe el nombre de Faculty Advisor.</p>

        <div>
            <label for="delegacion_oficial" class="form-label">¿Perteneces a una delegación oficial? <span style="color: red;">*</span></label>
            <SearchSelect
                name="delegacion_oficial"
                options={delegacionOficialOptions}
                bind:value={delegacionOficialValue}
                ariaLabel="Pertenencia a delegación oficial"
                required
                onchange={onChangeSaveCookie}
            />
            <div class="invalid-feedback">Debes seleccionar una opción.</div>
        </div>

        {#if delegacionOficialValue == "si" || !loadedCookies}
            <p>
                <strong>Nota:</strong> Para inscribirte como parte de una Delegación Oficial, primero se debe <a href="/registro/faculty">registrar el Faculty Advisor</a> y pagar la cuota de recuperación. Una vez confirmado el pago, ya se podrán registrar las personas integrantes de la Delegación Oficial.
            </p>

            <div style="margin-top: 1.5vh;">
                <input oninput={onChangeSaveCookie} class="form-control focus-ring focus-ring-danger" autocomplete="off" name="nombre_delegacion_oficial" placeholder="Nombre completo de la agrupación (sin siglas o abreviaturas)" type="text" maxlength="150">
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>

            <div>
                <input oninput={onChangeSaveCookie} class="form-control focus-ring focus-ring-danger" autocomplete="off" name="responsable_delegacion_oficial" placeholder="Nombre completo de la persona responsable de la delegación oficial" type="text" maxlength="150">
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>
        {/if}
    </div>

    <!-- Sección de datos personales de la delegación y codelegación -->
    {#each { length: 2 }, i}
        {#if i == 0 || modalidadValue == "pareja" || !loadedCookies} <!-- No mostrar la segunda sección si no se eligió codelegación -->
            <article class="titulo">
                <div class="oval">
                    <h2>
                        {#if i == 0}
                            {#if modalidadValue == "pareja"}
                                Datos personales (codelegación #1)
                            {:else}
                                Datos personales
                            {/if}
                        {:else}
                            Datos personales (codelegación #2)
                        {/if}
                    </h2>
                </div>
            </article>

            <div class="mb-3">
                <label for="nombre_{i}" class="form-label">Nombre completo <span style="color: red;">*</span></label>
                <div class="row g-3">
                    <div class="col">
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="nombre_{i}" placeholder="Nombre(s)" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                    <div class="col">
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="apellido_{i}" placeholder="Apellidos" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                </div>

                <div>
                    <label for="edad_{i}" class="form-label">Edad <span style="color: red;">*</span></label>
                    <input oninput={(ev) => onChangeEdad(ev, i)} bind:value={edadValues[i]} class="form-control" required autocomplete="off" name="edad_{i}" placeholder={`${registroConfig.participantes.edadMinima}-${registroConfig.participantes.edadMaxima} años`} type="text" maxlength="2" inputmode="numeric" class:is-invalid={!validateNumInput(edadValues[i], registroConfig.participantes.edadMinima, registroConfig.participantes.edadMaxima)}>
                    <div class="invalid-feedback">La edad no es válida.</div>
                </div>

                <div>
                    <label for="celular_{i}" class="form-label">Número de celular <span style="color: red;">*</span></label>
                    <input oninput={onChangeSaveCookie} use:intlPhone class="form-control" name="celular_{i}" data-name="celular_{i}" required autocomplete="off" placeholder="999 123 4567" type="tel" maxlength="30">
                </div>

                <div>
                    <label for="correo_{i}" class="form-label">Correo electrónico <span style="color: red;">*</span></label>
                    <input oninput={(ev) => onChangeCorreo(ev, i)} class="form-control" required autocomplete="off" name="correo_{i}" placeholder="ejemplo@dominio.com" type="email" maxlength="150" class:is-invalid={!correoValidity[i]}>
                    <div class="invalid-feedback">El correo no es válido.</div>
                </div>

                <label for="pais_{i}" class="form-label">País, estado y ciudad de residencia <span style="color: red;">*</span></label>
                <div class="row g-3">
                    <div class="col">
                        <SearchSelect
                            name="pais_{i}"
                            options={paisOptions}
                            value="México"
                            searchable
                            searchPlaceholder="Buscar país…"
                            ariaLabel="País de residencia"
                            required
                            onchange={onChangeSaveCookie}
                        />
                        <div class="invalid-feedback">Debes seleccionar una opción.</div>
                    </div>
                    <div class="col">
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="ciudad_estado_{i}" placeholder="Ciudad y estado" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                </div>

                <div>
                    <label for="escolaridad_{i}" class="form-label">Escolaridad <span style="color: red;">*</span></label>
                    <SearchSelect
                        name="escolaridad_{i}"
                        options={escolaridadOptions}
                        bind:value={escolaridadValues[i]}
                        ariaLabel="Escolaridad"
                        required
                        onchange={onChangeSaveCookie}
                    />
                    <div class="invalid-feedback">Debes seleccionar una opción.</div>
                </div>

                {#if escolaridadValues[i] != "No estudio" || !loadedCookies} <!-- No mostrar si se eligió "no estudio" -->
                    <div>
                        <label for="escuela_{i}" class="form-label">Nombre completo de tu escuela de procedencia (en caso de ser egresado, de donde te graduaste) <span style="color: red;">*</span></label>
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="escuela_{i}" placeholder="Ejemplo: Facultad de Derecho UADY" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                {/if}

                <label for="nombre_contacto_{i}" class="form-label">En caso de emergencia, ¿a quién podemos contactar? <span style="color: red;">*</span></label>
                <div class="row g-3">
                    <div class="col">
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="nombre_contacto_{i}" placeholder="Nombre completo" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                    <div class="col">
                        <input oninput={onChangeSaveCookie} use:intlPhone class="form-control" required autocomplete="off" name="celular_contacto_{i}" data-name="celular_contacto_{i}" placeholder="Celular" type="tel" maxlength="30">
                    </div>
                    <div class="col">
                        <input oninput={onChangeSaveCookie} class="form-control" required autocomplete="off" name="relacion_contacto_{i}" placeholder="Parentesco" type="text" maxlength="150">
                        <div class="invalid-feedback">Debes llenar este campo.</div>
                    </div>
                </div>

                <div>
                    <label for="info_extra_{i}" class="form-label">¿Tienes alguna necesidad específica que debamos conocer?</label>
                    <input oninput={onChangeSaveCookie} class="form-control" autocomplete="off" name="info_extra_{i}" placeholder="Ejemplo: padecimientos, alergias, tratamientos en curso u otros" type="text" maxlength="150">
                    <div class="invalid-feedback">Debes llenar este campo.</div>
                </div>
            </div>
        {/if}
    {/each}

    <!-- Selección de comités y países -->
    {#each { length: 3 }, i}
        <article class="titulo">
            <h2>
                {#if i == 0}
                    Primera opción de comité
                {:else if i == 1}
                    Segunda opción de comité
                {:else}
                    Tercera opción de comité
                {/if}
            </h2>
        </article>

        <div class="mb-3">
            <!-- Comité -->
            <div>
                {#if i == 0}
                    <label for="comite_{i}" class="form-label">Selecciona tu primera opción de comité <span style="color: red;">*</span></label>
                {:else if i == 1}
                    <label for="comite_{i}" class="form-label">Selecciona tu segunda opción de comité <span style="color: red;">*</span></label>
                {:else}
                    <label for="comite_{i}" class="form-label">Selecciona tu tercera opción de comité <span style="color: red;">*</span></label>
                {/if}

                <SearchSelect
                    name="comite_{i}"
                    options={getComiteOptions(i)}
                    bind:value={comiteValues[i]}
                    searchable
                    searchPlaceholder="Buscar comité…"
                    ariaLabel="Opción de comité"
                    required
                    onchange={(ev) => onChangeComite(ev, i)}
                />
                <div class="invalid-feedback">Debes seleccionar una opción.</div>

                {#if comiteValues[i]}
                    <div class="comite-topico-div">
                        <ComiteCarousel
                            comite={getClaveRegistroComite(comiteValues[i])}
                            index={i}
                            cantidadImagenes={getComitePorSiglas(comiteValues[i])?.cantidadImagenes ?? 0}
                        ></ComiteCarousel>
                        <p class="comite-horario">
                            <strong>Horario:</strong> {getHorarioComite(comiteValues[i])}
                        </p>
                    </div>
                {/if}
            </div>

            <!-- Países -->
            {#each { length: 3 }, j}
                <div>
                    {#if j == 0}
                        <label for="comite_{i}_pais_{j}" class="form-label">Primera opción de delegación <span style="color: red;">*</span></label>
                    {:else if j == 1}
                        <label for="comite_{i}_pais_{j}" class="form-label">Segunda opción de delegación <span style="color: red;">*</span></label>
                    {:else}
                        <label for="comite_{i}_pais_{j}" class="form-label">Tercera opción de delegación <span style="color: red;">*</span></label>
                    {/if}


                    <SearchSelect
                        name="comite_{i}_pais_{j}"
                        options={getDelegacionOptions(i, j)}
                        bind:value={comitePaisValues[i][j]}
                        searchable
                        searchPlaceholder="Buscar país, organización o abreviación…"
                        ariaLabel="Opción de delegación"
                        required
                        disabled={!comiteValues[i]}
                        onchange={(ev) => onChangePais(ev, i, j)}
                    />

                    <div class="invalid-feedback">Debes seleccionar una opción.</div>
                </div>
            {/each}

            {#if i == 2}
                <p>
                    <strong>NOTA:</strong> Si ninguna de las opciones seleccionadas está disponible, queda a consideración del Modelo la asignación, alineada a las opciones que escogió.
                </p>
            {/if}
        </div>
    {/each}

    <!-- Subir pago -->
    <article class="titulo">
        <h2>Pago</h2>
    </article>

    <div class="mb-3">
        {#if delegacionOficialValue != "si"}
        <img id="img-pago" src={registroConfig.pago.imagen} alt="Datos bancarios. CLABE: {registroConfig.pago.clabe}; Banco: {registroConfig.pago.banco}" />
        {/if}

        <p>
            {#if delegacionOficialValue == "si"}
                <strong>Delegación oficial:</strong> como comprobante de pago, solamente se aceptará la imagen que se compartió a su Faculty después de su inscripción. Si no la tiene aún, por favor <a href={registroConfig.contactos.whatsapp.url} target="_blank" rel="noopener noreferrer">contáctenos</a>.
            {:else if modalidadValue == "pareja"}
                <strong>Costo de inscripción:</strong> {formatoPrecio(registroConfig.costos.codelegacionPersona * 2)} ({formatoPrecio(registroConfig.costos.codelegacionPersona)} por persona)
            {:else}
                <strong>Costo de inscripción:</strong> {formatoPrecio(registroConfig.costos.individual)}
            {/if}
        </p>

        {#if delegacionOficialValue != "si"}
            <p>
                <strong>Concepto:</strong> Nombre y apellido
            </p>

            <p>
                <i>
                    Una vez realizado el pago, no se emite reembolso alguno.
                    <br>
                    En caso de que exista algún error con el pago, nos pondremos en contacto contigo.
                </i>
            </p>
        {/if}

        <div>
            <label for="comprobante" class="form-label">Sube tu comprobante de pago (máx {registroConfig.comprobante.maximoMB} MB)<span style="color: red;">*</span></label>
            <input oninput={onChangeComprobante} class="form-control focus-ring focus-ring-danger" required autocomplete="off" name="comprobante" type="file" id="input-comprobante" accept={registroConfig.comprobante.accept}>
            <div class="invalid-feedback">Debes subir un archivo.</div>
        </div>
    </div>

    <article class="titulo">
        <h2>Reglamento</h2>
    </article>

    <div class="mb-3">
        <div class="form-check">
            <input required class="form-check-input" autocomplete="off" name="aceptar_reglamento" type="checkbox">
            <label for="aceptar-reglamento" class="form-check-label">Al dar click en la casilla, se comparte el compromiso por respeto y mostrar conformidad con el reglamento y protocolo del SMMUN.</label>
            <div class="invalid-feedback">Debes aceptar el reglamento.</div>
        </div>
    </div>

    <div class="mb-3">
        <!-- Enviar -->
        <button class="form-control focus-ring focus-ring-danger" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
    </div>
</form>

<!-- Toasts para errores y contacto -->
<div style="position: fixed; bottom: 1%; right: 2%;">
    <div class="toast align-items-center text-bg-primary border-0 bg-danger bg-gradient position-relative bottom-0 end-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: relative; z-index: 1; width: auto; margin: 1vh 0;" bind:this={comprobanteToastDiv}>
        <div class="d-flex">
          <div class="toast-body">
            El archivo debe ser {registroConfig.comprobante.formatos} y pesar máximo {registroConfig.comprobante.maximoMB} MB.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>

    <div class="toast align-items-center text-bg-primary border-0 bg-danger bg-gradient position-relative bottom-0 end-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: relative; z-index: 1; width: auto; margin: 1vh 0;" bind:this={enviarToastDiv}>
        <div class="d-flex">
          <div class="toast-body">
            Existen errores en el formulario.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>

    <a target="_blank" rel="noopener noreferrer" href={registroConfig.contactos.whatsapp.url} style="text-decoration: none;">
        <div class="toast align-items-center text-bg-primary border-0 position-relative bottom-0 end-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style="position: relative; z-index: 1; width: auto; margin: 1vh 0; cursor: pointer; border-radius: 16px;" bind:this={whatsappToastDiv}>
            <div class="d-flex" style="background-color: var(--pink); border-radius: 12px;">
              <div class="toast-body">
                <i class="fa-brands fa-whatsapp fa-xl" style="font-size: 1.5rem;"></i>
                &ensp;
                ¿Dudas? ¡Contáctanos!
              </div>

              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </a>
</div>
