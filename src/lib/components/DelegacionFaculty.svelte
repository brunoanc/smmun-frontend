<script lang="ts">
    import { onMount } from "svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import { intlPhone } from "$lib/actions/intlPhone";
    import { registroConfig } from "$lib/data/registro";
    import { onChangeSaveCookie, resetValuesFromCookies, validateNumInput } from "$lib/util";
    import { paises } from "$lib/data/paises.json";
    import "intl-tel-input/build/css/intlTelInput.css";
    import "bootstrap/dist/css/bootstrap.min.css";
    import "$lib/styles/registro-form.css";

    let { index } = $props();

    // Elementos del DOM
    let delegacionFieldSet: HTMLFieldSetElement;

    // Variables reactivas
    let edadValue: string | undefined = $state();
    let escolaridadValue = $state("");
    let paisValue = $state("México");
    let correoValidity = $state(true);
    let loadedCookies = $state(false);
    const paisOptions = paises.map((pais) => ({ value: pais, label: pais }));
    const escolaridadOptions = ["Secundaria", "Preparatoria", "Universidad", "Egresado", "No estudio"].map((escolaridad) => ({
        value: escolaridad,
        label: escolaridad
    }));

    // Event handlers
    function onChangeEdad(ev: Event) {
        let input = ev.target as HTMLInputElement;
        edadValue = input.value.replace(/[^\d]/gi, "");

        if (!validateNumInput(input.value, registroConfig.participantes.edadMinima, registroConfig.participantes.edadMaxima)) {
            input.setCustomValidity("Edad inválida.");
        }
        else {
            input.setCustomValidity("");
        }

        onChangeSaveCookie(ev);
    }

    function onChangeCorreo(ev: Event) {
        let input = ev.target as HTMLInputElement;
        correoValidity = input.checkValidity();
        onChangeSaveCookie(ev);
    }

    onMount(() => {
        // Reestablecer los valores de los inputs en las cookies
        resetValuesFromCookies(delegacionFieldSet.elements);
        loadedCookies = true;
    });
</script>

<style>
    fieldset {
        border: none;
    }

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

    .mb-3 {
        margin: 0 7vw;
    }

    input {
        margin-bottom: 1.5vh;
        border: var(--bs-border-width) solid var(--pink);
        border-radius: var(--bs-border-radius);
    }

    label {
        color: var(--ink);
    }
</style>

<fieldset bind:this={delegacionFieldSet}>
    <article class="titulo">
        <h2>Datos de la persona #{index + 1}</h2>
    </article>
    <div class="mb-3">
        <label class="form-label" for="nombre_d{index}">Nombre completo <span style="color: red">*</span></label>
        <div class="g-3 row">
            <div class="col">
                <input oninput={onChangeSaveCookie} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger" maxlength="150" name="nombre_d{index}" placeholder="Nombre(s)" required>
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>

            <div class="col">
                <input oninput={onChangeSaveCookie} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger" maxlength="150" name="apellido_d{index}" placeholder="Apellidos" required>
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>
        </div>

        <div>
            <label class="form-label" for="edad_d{index}">Edad <span style="color: red">*</span></label>
            <input oninput={(ev) => onChangeEdad(ev)} bind:value={edadValue} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger input-edad" maxlength="2" name="edad_d{index}" placeholder={`${registroConfig.participantes.edadMinima}-${registroConfig.participantes.edadMaxima} años`} required inputmode="numeric" class:is-invalid={!validateNumInput(edadValue, registroConfig.participantes.edadMinima, registroConfig.participantes.edadMaxima)}>
            <div class="invalid-feedback">La edad no es válida.</div>
        </div>

        <div>
            <label class="form-label" for="celular_d{index}">Número de celular <span style="color: red">*</span></label>
            <input oninput={onChangeSaveCookie} use:intlPhone autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger" maxlength="30" name="celular_d{index}" data-name="celular_d{index}" placeholder="999 123 4567" required type="tel">
            <div class="invalid-feedback">Debes llenar este campo.</div>
        </div>

        <div>
            <label class="form-label" for="correo_d{index}">Correo electrónico <span style="color: red">*</span></label>
            <input oninput={(ev) => onChangeCorreo(ev)} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger input-correo" maxlength="150" name="correo_d{index}" placeholder="ejemplo@dominio.com" required type="email" class:is-invalid={!correoValidity}>
            <div class="invalid-feedback">El correo no es válido.</div>
        </div>

        <label class="form-label" for="pais_d{index}">País, estado y ciudad de residencia <span style="color: red">*</span></label>
        <div class="g-3 row">
            <div class="col">
                <SearchSelect
                    name="pais_d{index}"
                    options={paisOptions}
                    bind:value={paisValue}
                    searchable
                    searchPlaceholder="Buscar país…"
                    ariaLabel="País de residencia"
                    required
                    onchange={onChangeSaveCookie}
                />
                <div class="invalid-feedback">Debes seleccionar una opción.</div>
            </div>

            <div class="col">
                <input oninput={onChangeSaveCookie} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger" maxlength="150" name="ciudad_estado_d{index}" placeholder="Ciudad y estado" required>
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>
        </div>

        <div>
            <label class="form-label" for="escolaridad_d{index}">Escolaridad <span style="color: red">*</span></label>
            <SearchSelect
                name="escolaridad_d{index}"
                options={escolaridadOptions}
                bind:value={escolaridadValue}
                ariaLabel="Escolaridad"
                required
                onchange={onChangeSaveCookie}
            />
            <div class="invalid-feedback">Debes seleccionar una opción.</div>
        </div>

        {#if escolaridadValue != "No estudio" || !loadedCookies} <!-- No mostrar si se eligió "no estudio" -->
            <div>
                <label class="form-label" for="escuela_d{index}">Nombre completo de su escuela de procedencia (en caso de ser egresado, de donde se graduó) <span style="color: red">*</span></label> <input oninput={onChangeSaveCookie} autocomplete="off" class="form-control focus-ring focus-ring-danger focus-ring focus-ring-danger" maxlength="150" name="escuela_d{index}" placeholder="Ejemplo: Escuela Modelo" required>
                <div class="invalid-feedback">Debes llenar este campo.</div>
            </div>
        {/if}
    </div>
</fieldset>
