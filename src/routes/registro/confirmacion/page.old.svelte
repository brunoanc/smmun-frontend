<script lang="ts">
    import { onMount } from "svelte";
    import { etiquetaEdicion, registroConfig } from "$lib/data/registro";
    const IDEMPOTENCY_TAB_NAME_PREFIX = "smmun-registro-tab:";

    function getStorageKeyFromForm(form: string | null) {
        if (form === "delegaciones") {
            return "registro-delegaciones-idempotency-key";
        }

        if (form === "faculty") {
            return "registro-faculty-idempotency-key";
        }

        return null;
    }

    function getTabScopedStorageKey(storageKey: string) {
        if (!window.name || !window.name.startsWith(IDEMPOTENCY_TAB_NAME_PREFIX)) {
            return null;
        }

        return `${storageKey}:${window.name.slice(IDEMPOTENCY_TAB_NAME_PREFIX.length)}`;
    }

    onMount(() => {
        const params = new URLSearchParams(window.location.search);

        // Eliminar cookies
        document.cookie.split(";").forEach(cookie_untrimmed => {
            let cookie = cookie_untrimmed.trim();
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        });

        const storageKey = getStorageKeyFromForm(params.get("form"));
        if (storageKey) {
            const tabScopedStorageKey = getTabScopedStorageKey(storageKey);
            sessionStorage.removeItem(storageKey);

            if (tabScopedStorageKey) {
                sessionStorage.removeItem(tabScopedStorageKey);
            }
        }
    })
</script>

<section class="registration-result registration-result--success">
    <img class="result-star result-star--one" src="/assets/img/stars/3.svg" alt="" />
    <img class="result-star result-star--two" src="/assets/img/stars/8.svg" alt="" />

    <article class="result-card">
        <span class="result-eyebrow">{etiquetaEdicion}</span>
        <span class="result-icon" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
        <h1>¡Muchas gracias!</h1>
        <div class="result-copy">
            <p>Tu registro fue enviado correctamente.</p>
            <div class="result-details">
                <span>Te invitamos a estar pendiente de tu correo; en máximo una semana recibirás tu confirmación.</span>
                <span>En caso de tener alguna duda, puedes contactarnos a través de:</span>
                <span class="contacto">
                    <i class="fa-regular fa-envelope"></i>&ensp;<strong>Correo:</strong> <a href={`mailto:${registroConfig.contactos.finanzas}`}>{registroConfig.contactos.finanzas}</a>
                    <br>
                    <i class="fa-brands fa-whatsapp"></i>&ensp;<strong>WhatsApp:</strong> <a target="_blank" rel="noopener noreferrer" href={registroConfig.contactos.whatsapp.url}>{registroConfig.contactos.whatsapp.visible}</a>
                </span>
            </div>
        </div>
        <a class="result-action" href="/">Volver al inicio</a>
    </article>
</section>

<style>
    .registration-result {
        position: relative;
        isolation: isolate;
        min-height: calc(100svh - var(--nav-height));
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: clamp(3rem, 8vw, 7rem) 1rem;
        background:
            radial-gradient(circle at 20% 80%, rgba(255, 87, 182, 0.22), transparent 30%),
            radial-gradient(circle at 85% 15%, rgba(103, 227, 255, 0.17), transparent 27%),
            var(--navy) url("/assets/img/hero.webp") center / cover;
    }

    .registration-result::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: rgba(12, 7, 58, 0.62);
    }

    .result-card {
        width: min(92vw, 720px);
        padding: clamp(2rem, 6vw, 4.5rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 2rem;
        text-align: center;
        background: rgba(255, 253, 248, 0.96);
        box-shadow: 0 2rem 5rem rgba(4, 2, 28, 0.34);
    }

    .result-eyebrow {
        display: block;
        margin: 0 0 1.5rem;
        color: var(--pink);
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .result-icon {
        width: 5rem;
        height: 5rem;
        display: grid;
        place-items: center;
        margin: 0 0 1.5rem;
        border-radius: 50%;
        color: var(--navy);
        background: var(--yellow);
        font-size: 2rem;
        box-shadow: 0 0.8rem 2rem rgba(253, 202, 64, 0.28);
    }

    h1 {
        margin: 0;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.8rem, 7vw, 5rem);
        line-height: 0.95;
    }

    .result-copy {
        width: 100%;
        margin-top: 2rem;
        display: grid;
        gap: 1.25rem;
        color: #514b6d;
        font-size: 1rem;
        line-height: 1.6;
    }

    .result-copy > p {
        margin: 0;
    }

    .result-details {
        width: 100%;
        display: grid;
        gap: 1.25rem;
    }

    .contacto {
        margin-top: 0.35rem;
        color: var(--navy);
    }

    .contacto a {
        color: var(--blue);
        overflow-wrap: anywhere;
    }

    .result-action {
        display: inline-block;
        margin-top: 2rem;
        padding: 0.9rem 1.4rem;
        border-radius: 999px;
        color: #ffffff;
        background: var(--navy);
        font-size: 0.75rem;
        font-weight: 850;
        letter-spacing: 0.11em;
        text-decoration: none;
        text-transform: uppercase;
    }

    .result-star {
        position: absolute;
        width: clamp(3.5rem, 8vw, 7rem);
        opacity: 0.58;
    }

    .result-star--one { left: 5%; bottom: 10%; }
    .result-star--two { top: 8%; right: 5%; }
</style>
