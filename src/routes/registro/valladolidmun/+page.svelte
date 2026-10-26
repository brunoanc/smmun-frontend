<script lang="ts">
    import TituloRegistro from "$lib/components/TituloRegistro.svelte";
</script>

<TituloRegistro text="ValladolidMUN 2026" edition="Inscripciones cerradas" tagline="El derecho a imaginar" />

<section class="registration-closed" aria-labelledby="closure-title">
    <h2 id="closure-title">Las inscripciones a ValladolidMUN 2026 han cerrado.</h2>
    <p>Gracias por tu interés en formar parte de ValladolidMUN.</p>
    <a class="back" href="/">Volver al inicio →</a>
</section>

<style>
    .registration-closed {
        max-width: 760px;
        margin: auto;
        padding: clamp(2.5rem, 6vw, 5rem) 1.25rem;
        color: var(--navy);
    }

    h2 {
        margin: 0 0 1.5rem;
        font-size: clamp(1.5rem, 4vw, 2.25rem);
        line-height: 1.2;
    }

    p {
        margin: 0 0 1.25rem;
        line-height: 1.7;
    }

    a {
        color: inherit;
        text-underline-offset: 0.2em;
        overflow-wrap: anywhere;
    }

    .back {
        display: inline-block;
        margin-top: 1rem;
        font-weight: 700;
    }
</style>
