<script lang="ts">
    import { etiquetaEdicion } from "$lib/data/registro";

    let { text }: { text: string } = $props();
</script>

<section class="registration-title">
    <img class="registration-title__star registration-title__star--left" src="/assets/img/stars/4.svg" alt="" />
    <img class="registration-title__star registration-title__star--right" src="/assets/img/stars/9.svg" alt="" />

    <div class="registration-title__inner">
        <img class="registration-title__logo" src="/assets/img/logos/principal.svg" alt="Logo del SMMUN" />

        <div class="registration-title__copy">
            <span>{etiquetaEdicion}</span>
            <h1>{text}</h1>
            <p>Enciende tu voz. Comparte lo que te mueve.</p>
        </div>
    </div>
</section>

<style>
    .registration-title {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: clamp(18rem, 34vw, 28rem);
        display: grid;
        place-items: center;
        padding: clamp(3.5rem, 7vw, 6.5rem) 6vw;
        color: #ffffff;
        background:
            radial-gradient(circle at 25% 85%, rgba(255, 87, 182, 0.22), transparent 34%),
            radial-gradient(circle at 80% 12%, rgba(103, 227, 255, 0.14), transparent 28%),
            rgba(18, 10, 76, 0.86) url("/assets/img/hero.webp") 58% center / cover;
    }

    .registration-title::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: rgba(10, 6, 52, 0.42);
    }

    .registration-title__inner {
        width: min(88vw, 1040px);
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: clamp(1.5rem, 4vw, 4rem);
    }

    .registration-title__logo {
        width: clamp(7rem, 14vw, 11rem);
        height: auto;
        filter: drop-shadow(0 1.2rem 2rem rgba(5, 3, 28, 0.3));
    }

    .registration-title__copy span {
        color: var(--yellow);
        font-size: clamp(0.68rem, 1vw, 0.82rem);
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
    }

    .registration-title h1 {
        max-width: 16ch;
        margin: 0.55rem 0 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.8rem, 7vw, 6.7rem);
        font-weight: 700;
        line-height: 0.9;
        text-wrap: balance;
    }

    .registration-title p {
        margin: 1.9rem 0 0;
        color: rgba(255, 255, 255, 0.76);
        font-size: clamp(0.95rem, 1.4vw, 1.1rem);
    }

    .registration-title__star {
        position: absolute;
        width: clamp(3rem, 7vw, 6rem);
        opacity: 0.6;
    }

    .registration-title__star--left {
        bottom: 10%;
        left: 4%;
    }

    .registration-title__star--right {
        top: 12%;
        right: 5%;
    }

    @media (max-width: 680px) {
        .registration-title {
            min-height: 22rem;
            padding: 3.25rem 7vw;
            background-position: 64% center;
        }

        .registration-title__inner {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 1.15rem;
            text-align: center;
        }

        .registration-title__logo {
            width: 6.7rem;
        }

        .registration-title h1 {
            max-width: 11ch;
            font-size: clamp(2.7rem, 13vw, 4rem);
        }

        .registration-title p {
            margin-top: 1.5rem;
        }

        .registration-title__star--left {
            bottom: 4%;
            left: -0.5rem;
        }
    }
</style>
