<script lang="ts">
    import { onMount, tick } from 'svelte';
    import type { HTMLInputAttributes } from 'svelte/elements';
    import TituloRegistro from '$lib/components/TituloRegistro.svelte';
    import { connectAppsScript, generateFolio, MODELO_SCHOOL, type Participant, type Preference } from '$lib/registration/apps-script';

    import { privacidad } from '$lib/data/privacidad';
    import { getValladolidCommitteeTopic } from '$lib/data/valladolidmun';

    import { validateParticipant, validateReceipt } from '$lib/registration/validation';

    const preferenceLabels = ['Primera opción', 'Segunda opción', 'Tercera opción'];
    const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxAKN-f-sBQnpreabCM4OyqLUw2uFCwILW_m9uwNx_fZLbT8KY5yeXIn4Etba-JpINf/exec';
    const steps = ['Tus datos', 'Emergencia', 'Tu delegación', 'Comités', 'Pago'];
    const fields: { key: string; label: string; type?: string; required?: boolean; autocomplete?: HTMLInputAttributes["autocomplete"] }[][] = [
        [
            { key: 'nombres', label: 'Nombres', required: true, autocomplete: 'given-name' },
            { key: 'primerApellido', label: 'Primer apellido', required: true, autocomplete: 'family-name' },
            { key: 'segundoApellido', label: 'Segundo apellido' },
            { key: 'correo', label: 'Correo electrónico', type: 'email', required: true, autocomplete: 'email' },
            { key: 'edad', label: 'Edad', type: 'number', required: true },
            { key: 'telefono', label: 'Número telefónico', type: 'tel', required: true, autocomplete: 'tel' }
        ],
        [
            { key: 'contactoEmergencia', label: 'Nombre de tu contacto de emergencia', required: true },
            { key: 'parentesco', label: 'Parentesco', required: true },
            { key: 'telefonoEmergencia', label: 'Teléfono de emergencia', type: 'tel', required: true }
        ]
    ];
    let participant = $state<Participant>(Object.fromEntries([
        'nombres', 'primerApellido', 'segundoApellido', 'pronombres', 'correo', 'edad', 'telefono', 'escuela',
        'contactoEmergencia', 'parentesco', 'telefonoEmergencia', 'alergias', 'delegacionOficial', 'faculty', 'correoFaculty'
    ].map(key => [key, ''])));
    let preferences = $state<Preference[]>(Array.from({ length: 3 }, () => ({ comite: '', paises: ['', '', ''] })));
    let countries = $state<Record<string, string[]>>({});
    let step = $state(0);
    let form = $state<HTMLFormElement>();
    let heading = $state<HTMLHeadingElement>();
    let receipt = $state<File | null>(null);
    let error = $state('');
    let connectionError = $state('');
    let loading = $state(true);
    let sending = $state(false);
    let folio = $state('');
    let requestId = '';
    let pendingFolio = '';
    const draftKey = 'valladolidmun-2026-draft';
    let initialized = $state(false);
    let bridge: ReturnType<typeof connectAppsScript> | undefined;
    let schoolChoice = $state('');
    const isModelo = $derived(participant.escuela === MODELO_SCHOOL);
    const visibleSteps = $derived(steps.map((label, index) => ({ label, index })).filter(item => !isModelo || item.index !== 2));
    const amount = $derived(isModelo || participant.delegacionOficial === 'Sí' ? '$90 MXN' : '$110 MXN');
    const isCPI = (committee: string) => committee.trim().toUpperCase() === 'CPI';

    onMount(() => {
        requestId = crypto.randomUUID();
        pendingFolio = generateFolio();
        try {
            const stored = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
            if (stored) {
                for (const key of Object.keys(participant)) {
                    if (typeof stored.participant?.[key] === 'string') participant[key] = stored.participant[key];
                }
                if (Array.isArray(stored.preferences) && stored.preferences.length === 3 && stored.preferences.every((option: Preference) => typeof option.comite === 'string' && Array.isArray(option.paises) && option.paises.length === 3 && option.paises.every(value => typeof value === 'string'))) preferences = stored.preferences;
                if (typeof stored.requestId === 'string' && /^[a-zA-Z0-9-]{36}$/.test(stored.requestId)) requestId = stored.requestId;
                if (typeof stored.pendingFolio === 'string' && /^V26-(?:[0-9A-HJKMNP-TV-Z]{8}|[A-F0-9]{16})$/.test(stored.pendingFolio)) pendingFolio = stored.pendingFolio;
            }
        } catch { /* Storage can be unavailable; the form still works. */ }
        schoolChoice = participant.escuela === MODELO_SCHOOL ? MODELO_SCHOOL : participant.escuela ? 'Otra' : '';
        if (participant.escuela === MODELO_SCHOOL) {
            participant.delegacionOficial = 'No';
            participant.faculty = '';
            participant.correoFaculty = '';
        }
        initialized = true;
        void loadCountries();
        return () => bridge?.destroy();
    });

    $effect(() => {
        if (!initialized || folio) return;
        const draft = JSON.stringify({ participant: Object.fromEntries(Object.entries(participant).map(([key, value]) => [key, String(value)])), preferences, requestId, pendingFolio });
        try { sessionStorage.setItem(draftKey, draft); } catch { /* Optional draft storage. */ }
    });

    async function loadCountries() {
        loading = true;
        connectionError = '';
        try {
            if (!endpoint) throw new Error('El registro estará disponible próximamente.');
            bridge?.destroy();
            bridge = connectAppsScript(endpoint);
            countries = await bridge.call<Record<string, string[]>>('countries');
            if (Object.keys(countries).length < 3) throw new Error('Aún no están disponibles todos los comités. Intenta más tarde.');
        } catch (cause) {
            connectionError = cause instanceof Error ? cause.message : 'No se pudieron cargar los comités.';
        } finally { loading = false; }
    }

    async function move(target: number) {
        step = target;
        error = '';
        await tick();
        heading?.focus();
    }

    function validatePreferences() {
        if (new Set(preferences.map(option => option.comite)).size !== 3) {
            throw new Error('Elige tres comités diferentes.');
        }
        for (const [index, option] of preferences.entries()) {
            const selected = option.paises.slice(0, isCPI(option.comite) ? 2 : 3);
            if (!countries[option.comite] || selected.some(value => !countries[option.comite].includes(value)) || new Set(selected).size !== selected.length) {
                throw new Error(`Revisa las delegaciones de tu opción ${index + 1}. Deben ser diferentes y pertenecer al comité.`);
            }
        }
    }

    async function advance(event: SubmitEvent) {
        event.preventDefault();
        if (sending || !form?.reportValidity()) return;
        error = '';
        try {
            const issue = validateParticipant(participant, step < 3 ? step : step === 4 ? undefined : -1);
            if (issue) {
                if (issue.step !== step) await move(issue.step);
                error = issue.message;
                await tick();
                (form?.elements.namedItem(issue.field) as HTMLElement | null)?.focus();
                return;
            }
            if (step === 3) validatePreferences();
            if (step < 4) { await move(isModelo && step === 1 ? 3 : step + 1); return; }
            validatePreferences();
            const receiptError = validateReceipt(receipt);
            if (receiptError) throw new Error(receiptError);
            if (!bridge || loading || connectionError) throw new Error('Espera a que se conecte el registro antes de enviar.');
            sending = true;
            const result = await bridge.call<{ exito: boolean; folio: string }>('register', {
                requestId,
                folio: pendingFolio,
                participante: Object.fromEntries(Object.entries(participant).map(([key, value]) => [key, String(value).trim()])),
                preferencias: preferences.map(option => ({ comite: option.comite, paises: isCPI(option.comite) ? [...option.paises.slice(0, 2), 'N/A'] : [...option.paises] })),
                pago: { monto: amount }
            }, receipt!);
            if (!result.exito || !result.folio) throw new Error('No se recibió un folio de confirmación. Intenta nuevamente.');
            folio = result.folio;
            try { sessionStorage.removeItem(draftKey); } catch { /* Optional draft storage. */ }
            await tick();
            heading?.focus();
        } catch (cause) {
            error = cause instanceof Error ? cause.message : 'No se pudo enviar el registro. Intenta nuevamente.';
        } finally {
            sending = false;
        }
    }
</script>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<TituloRegistro text="ValladolidMUN 2026" edition="Registro de participantes" tagline="El derecho a imaginar" />
<div class="registration-shell">
    {#if folio}
        <section class="success" aria-live="polite">
            <span class="spark" aria-hidden="true">✦</span>
            <h2 bind:this={heading} tabindex="-1">¡Muchas gracias!</h2>
            <p>Tu registro se guardó correctamente. Tu pago está pendiente de verificación.</p>
            <span>Tu folio de registro</span>
            <strong class="folio">{folio}</strong>
            <p>Guarda este folio para futuras comunicaciones relacionadas con tu registro.</p>
            <a class="primary" href="/">Volver al inicio</a>
        </section>
    {:else}
        <ol class="steps" aria-label="Pasos del registro">
            {#each visibleSteps as { label, index }, position}
                <li class:active={step === index} class:complete={step > index} aria-current={step === index ? 'step' : undefined}><span>{position + 1}</span>{label}</li>
            {/each}
        </ol>
        {#if loading}<p role="status" class="notice">Conectando con el registro…</p>{/if}
        {#if connectionError}<div class="notice" role="alert">{connectionError}{#if endpoint}<button type="button" onclick={loadCountries}>Volver a conectar</button>{/if}</div>{/if}
        <form bind:this={form} onsubmit={advance}>
            <fieldset disabled={sending}>
                <header><span class="eyebrow">Paso {visibleSteps.findIndex(item => item.index === step) + 1} de {visibleSteps.length}</span><h2 bind:this={heading} tabindex="-1">{steps[step]}</h2></header>
                {#if step < 2}
                    <div class="fields">
                        {#each fields[step] as field}
                            <div class="field"><label for={field.key}>{field.label}{field.required ? ' *' : ''}</label><input id={field.key} type={field.type || 'text'} bind:value={participant[field.key]} required={field.required} autocomplete={field.autocomplete} maxlength={field.type === 'email' ? 254 : field.type === 'tel' ? 40 : field.type === 'number' ? undefined : 200} min={field.type === 'number' ? 10 : undefined} max={field.type === 'number' ? 100 : undefined} step={field.type === 'number' ? 1 : undefined} /></div>
                        {/each}
                        {#if step === 0}
                            <div class="field full"><label for="escuela">Escuela o institución *</label><select id="escuela" value={schoolChoice} required onchange={(event) => {
                                schoolChoice = event.currentTarget.value;
                                participant.escuela = schoolChoice === MODELO_SCHOOL ? MODELO_SCHOOL : '';
                                participant.delegacionOficial = schoolChoice === MODELO_SCHOOL ? 'No' : '';
                                participant.faculty = '';
                                participant.correoFaculty = '';
                                receipt = null;
                            }}><option value="">Selecciona una opción</option><option value={MODELO_SCHOOL}>{MODELO_SCHOOL}</option><option value="Otra">Otra</option></select></div>
                            {#if schoolChoice === 'Otra'}
                                <div class="field full"><label for="otraEscuela">Nombre de tu escuela o institución *</label><input id="otraEscuela" bind:value={participant.escuela} required maxlength="200" /></div>
                            {/if}
                            <div class="field"><label for="pronombres">Pronombres *</label><select id="pronombres" bind:value={participant.pronombres} required><option value="">Selecciona una opción</option>{#each ['Él', 'Ella', 'Elle', 'Prefiero no decirlo'] as value}<option>{value}</option>{/each}</select></div>
                        {:else}
                            <div class="field full"><label for="alergias">Alergias o condiciones médicas</label><textarea id="alergias" bind:value={participant.alergias} placeholder="Si no tienes, escribe Ninguna." rows="3" maxlength="2000"></textarea></div>
                        {/if}
                    </div>
                {:else if step === 2}
                    <p>Una delegación oficial representa a una institución y cuenta con una persona Faculty o asesora.</p>
                    <div class="field"><label for="delegacionOficial">¿Formas parte de una delegación oficial? *</label><select id="delegacionOficial" bind:value={participant.delegacionOficial} required onchange={() => { participant.faculty = ''; participant.correoFaculty = ''; }}><option value="">Selecciona una opción</option><option>Sí</option><option>No</option></select></div>
                    {#if participant.delegacionOficial === 'Sí'}
                        <div class="fields faculty"><div class="field"><label for="faculty">Nombre del Faculty o asesor *</label><input id="faculty" maxlength="200" bind:value={participant.faculty} required /></div><div class="field"><label for="correoFaculty">Correo del Faculty *</label><input id="correoFaculty" type="email" maxlength="254" bind:value={participant.correoFaculty} required /></div></div>
                    {/if}
                {:else if step === 3}
                    <p>Elige tres comités distintos en orden de preferencia y sus posibles delegaciones. Para CPI, ordena las dos posturas.</p>
                    {#each preferences as option, index}
                        {@const topic = getValladolidCommitteeTopic(option.comite)}
                        <section class="preference"><h3>0{index + 1} <span>Opción de comité</span></h3><div class="field"><label for={`comite-${index}`}>Comité *</label><select id={`comite-${index}`} aria-describedby={topic ? `topic-${index}` : undefined} bind:value={option.comite} required onchange={() => { option.paises = ['', '', '']; }}><option value="">Selecciona un comité</option>{#each Object.keys(countries) as committee}<option value={committee} disabled={preferences.some((other, otherIndex) => otherIndex !== index && other.comite === committee)}>{committee}</option>{/each}</select></div>
                        {#if topic}
                            <div class="committee-topic" id={`topic-${index}`} aria-live="polite"><span>Tópico</span><p>{topic}</p></div>
                        {/if}
                        <div class="fields countries">{#each Array.from({ length: isCPI(option.comite) ? 2 : 3 }) as _, position}<div class="field"><label for={`pais-${index}-${position}`}>{preferenceLabels[position]} *</label><select id={`pais-${index}-${position}`} bind:value={option.paises[position]} required disabled={!option.comite}><option value="">Selecciona una opción</option>{#each countries[option.comite] || [] as country}<option disabled={option.paises.some((other, otherPosition) => otherPosition !== position && other === country)}>{country}</option>{/each}</select></div>{/each}</div></section>
                    {/each}
                {:else}
                    <p>Revisa tu registro y adjunta tu comprobante para finalizar.</p>
                    <div class="review"><strong>{participant.nombres} {participant.primerApellido} {participant.segundoApellido}</strong><p>{participant.correo} · {participant.escuela}</p><ol>{#each preferences as option}<li>{option.comite}: {option.paises.filter(Boolean).join(', ')}</li>{/each}</ol></div>
                    <div class="payment"><span>Cuota de recuperación</span><strong>{amount}</strong><dl><dt>Banco</dt><dd>BBVA</dd><dt>Titular</dt><dd>Ariel Damian Puerto Puerto</dd><dt>CLABE interbancaria</dt><dd class="clabe">012 180 01575060013 2</dd><dt>Concepto / referencia</dt><dd>Tu nombre completo</dd></dl></div>
                    <div class="upload"><label for="comprobante">Comprobante de pago *</label><p>PDF, JPG o PNG · Máximo 5 MB</p><input id="comprobante" type="file" accept=".pdf,.jpg,.jpeg,.png" required onchange={(event) => { receipt = event.currentTarget.files?.[0] || null; error = validateReceipt(receipt); }} /></div>
                {/if}
            </fieldset>
            {#if error}<p class="error" role="alert">{error}</p>{/if}
            <div class="actions">{#if step > 0}<button class="secondary" type="button" disabled={sending} onclick={() => move(isModelo && step === 3 ? 1 : step - 1)}>← Atrás</button>{/if}<button class="primary" type="submit" disabled={sending || (step >= 3 && (loading || !!connectionError))}>{sending ? 'Guardando tu registro…' : step === 4 ? 'Finalizar registro →' : 'Continuar →'}</button></div>
            {#if sending}<p role="status">Estamos guardando tu registro. Mantén esta página abierta.</p>{/if}
        </form>
        <details class="privacy-summary">
            <summary>Aviso de privacidad simplificado</summary>
            <p>{privacidad.responsable} es responsable del tratamiento de los datos de este registro. Recogemos datos de identificación, contacto, escuela, contacto de emergencia, delegación y preferencias para gestionar tu inscripción, asignar comités, verificar el pago y atender emergencias. Cuando corresponde, el comprobante incluye datos financieros.</p>
            <p>La información de salud que decidas proporcionar es sensible y opcional; se utiliza para prever necesidades de atención y actuar ante emergencias. Puedes dejar ese campo vacío.</p>
            <p>Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, revocar tu consentimiento o limitar el uso o divulgación de tus datos, escribe a <a href={`mailto:${privacidad.correo}`}>{privacidad.correo}</a>. Consulta los detalles en el <a href="/privacidad/" target="_blank" rel="nofollow noopener noreferrer" data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">aviso de privacidad integral</a> antes de completar el formulario.</p>
        </details>
    {/if}
</div>

<style>
    .registration-shell { max-width: 1040px; margin: auto; padding: clamp(2rem, 6vw, 5rem) 1.25rem 6rem; color: var(--navy); }
    .eyebrow { font-size: .75rem; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #a82b76; }
    h2 { font-family: 'Binate', 'Raleway', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.05; margin: .65rem 0 1.25rem; }
    p { line-height: 1.7; color: #484165; }
    .steps { display: flex; padding: 0; list-style: none; gap: .6rem; margin: 2rem 0; }
    .steps li { flex: 1; display: flex; align-items: center; gap: .5rem; font-size: .8rem; font-weight: 750; padding: .8rem; border-bottom: 3px solid #e7e3f1; }
    .steps li span { display: grid; place-items: center; border-radius: 50%; background: #efedf7; width: 1.75rem; height: 1.75rem; flex-shrink: 0; }
    .steps li.active { border-color: var(--pink); }.steps li.active span { background: var(--yellow); }.steps li.complete { border-color: var(--navy); }
    form, .success { background: white; border: 1px solid #e7e3f1; border-radius: 2rem; padding: clamp(1.5rem, 5vw, 3.5rem); box-shadow: 0 1.5rem 4rem #190f5b0c; }
    fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }header { margin-bottom: 2rem; }
    .privacy-summary { line-height: 1.6; font-size: .78rem; margin: 1.25rem 0 0; overflow-wrap: anywhere; }
    .privacy-summary summary { cursor: pointer; font-weight: 700; padding: .5rem 0; }
    .privacy-summary summary:focus-visible { outline: 2px solid var(--navy); outline-offset: 4px; }
    .privacy-summary p { margin: .6rem 0; }
    .privacy-summary a { color: #86235f; text-decoration: underline; text-underline-offset: .2em; }
    .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }.full { grid-column: 1 / -1; }.faculty { margin-top: 1.5rem; }
    .field { display: flex; flex-direction: column; gap: .55rem; }label { font-size: .85rem; font-weight: 800; }
    input, select, textarea { width: 100%; min-height: 3.4rem; padding: .8rem 1rem; border: 1px solid #d7d2e8; border-radius: .8rem; background: #fcfbff; color: var(--navy); font: inherit; }
    input:focus, select:focus, textarea:focus { outline: 3px solid #ff57b633; border-color: var(--pink); }h2:focus { outline: none; }
    .preference { border-top: 1px solid #e7e3f1; padding: 1.5rem 0; }.preference h3 { color: #a82b76; font-size: 1.3rem; font-weight: 850; }.preference h3 span { color: var(--navy); margin-left: .5rem; font-size: 1rem; }.countries { margin-top: 1rem; grid-template-columns: repeat(3, 1fr); }
    .committee-topic { margin-top: 1rem; padding: 1rem 1.2rem; border-left: 3px solid var(--pink); border-radius: .6rem; background: #f7f5ff; overflow-wrap: anywhere; }
    .committee-topic span { color: #a82b76; font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .committee-topic p { margin: .4rem 0 0; font-size: .95rem; line-height: 1.65; }
    .actions { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; margin-top: 2.5rem; }
    button, .primary { border: 0; padding: 1rem 1.6rem; border-radius: 999px; font: inherit; font-size: .85rem; font-weight: 800; cursor: pointer; text-decoration: none; }.primary { color: white; background: var(--navy); margin-left: auto; }.primary:hover { background: #a82b76; }.secondary { color: var(--navy); background: #f0edf8; }button:disabled { opacity: .6; cursor: wait; }
    .notice, .error { padding: 1rem 1.2rem; border-radius: 1rem; background: #fff5d7; margin: 1rem 0; }.error { background: #fff0f4; color: #9a1648; }.notice button { margin-left: .5rem; }
    .review { background: #f7f5ff; padding: 1.25rem; border-radius: 1rem; overflow-wrap: anywhere; }.review p { margin: .5rem 0; }.review ol { padding-left: 1.5rem; margin-bottom: 0; }
    .payment { border: 1px solid #d7d2e8; border-radius: 1.2rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(130deg, #fff9df, #fff); }.payment > strong { display: block; font-size: 2rem; margin: .5rem 0; }dl { display: grid; grid-template-columns: 1fr 2fr; gap: .7rem; margin: 1.5rem 0 0; }dt { font-size: .8rem; }dd { margin: 0; font-weight: 750; overflow-wrap: anywhere; }.clabe { font-variant-numeric: tabular-nums; }
    .upload { border: 2px dashed #d7d2e8; padding: 1.5rem; border-radius: 1rem; }.upload p { margin: .5rem 0 1rem; font-size: .85rem; }.success { margin-top: 2rem; text-align: center; }.spark { font-size: 3rem; color: #a82b76; }.folio { display: block; margin: 1rem; font-size: clamp(1rem, 4vw, 2.5rem); overflow-wrap: anywhere; }.success .primary { display: inline-block; margin: 1rem 0; }
    @media(max-width: 680px) { .fields, .countries { grid-template-columns: 1fr; }.steps { gap: .2rem; }.steps li { flex-direction: column; padding: .5rem .15rem; font-size: .65rem; text-align: center; }dl { grid-template-columns: 1fr; gap: .3rem; }dd { margin-bottom: .7rem; }.actions button { flex: 1; }form { border-radius: 1.2rem; } }
</style>
