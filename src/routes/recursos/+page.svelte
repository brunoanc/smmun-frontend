<script lang="ts">
    import { registroConfig } from "$lib/data/registro";
</script>

<section class="resources-coming-soon">
    <div class="orbit orbit-one"></div>
    <div class="orbit orbit-two"></div>
    <img class="star star-one" src="/assets/img/stars/1.svg" alt="" />
    <img class="star star-two" src="/assets/img/stars/6.svg" alt="" />
    <img class="star star-three" src="/assets/img/stars/10.svg" alt="" />

    <div class="content">
        <span class="eyebrow">{registroConfig.edicion}</span>
        <h1>Comités y manuales</h1>
        <p>Próximamente encontrarás los manuales y otros recursos necesarios para que llegues preparado al debate.</p>

        <div class="coming-soon">
            <span>Próximamente</span>
            <div aria-hidden="true"><i></i><i></i><i></i></div>
        </div>

        <a href="/">Volver al inicio <span aria-hidden="true">→</span></a>
    </div>
</section>

<style>
    .resources-coming-soon {
        position: relative;
        min-height: min(78rem, calc(100svh - var(--nav-height)));
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: clamp(5rem, 10vw, 10rem) 7vw;
        color: #ffffff;
        background:
            linear-gradient(rgba(10, 7, 45, 0.76), rgba(25, 15, 91, 0.8)),
            var(--navy) url("/assets/img/hero.webp") center / cover;
    }

    .content {
        position: relative;
        z-index: 2;
        width: min(52rem, 100%);
        text-align: center;
    }

    .eyebrow {
        color: var(--yellow);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.26em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0.65rem 0 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(3.2rem, 8.2vw, 8.6rem);
        line-height: 0.9;
    }

    p {
        max-width: 42rem;
        margin: 1.8rem auto 0;
        color: rgba(255, 255, 255, 0.84);
        font-size: clamp(1rem, 1.4vw, 1.22rem);
        line-height: 1.72;
    }

    .coming-soon {
        width: fit-content;
        margin: 2.5rem auto 0;
        padding: 0.9rem 1.4rem;
        display: flex;
        align-items: center;
        gap: 0.9rem;
        border: 1px solid rgba(255, 255, 255, 0.46);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.09);
        backdrop-filter: blur(8px);
    }

    .coming-soon > span {
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.15em;
        text-transform: uppercase;
    }

    .coming-soon > div {
        display: flex;
        gap: 0.28rem;
    }

    .coming-soon i {
        display: block;
        width: 0.35rem;
        height: 0.35rem;
        border-radius: 50%;
        background: var(--yellow);
        animation: pulse 1.2s ease-in-out infinite;
    }

    .coming-soon i:nth-child(2) { animation-delay: 0.15s; }
    .coming-soon i:nth-child(3) { animation-delay: 0.3s; }

    @keyframes pulse {
        50% { opacity: 0.3; transform: translateY(-0.15rem); }
    }

    .content > a {
        display: inline-block;
        margin-top: 2.7rem;
        padding-bottom: 0.25rem;
        border-bottom: 2px solid var(--pink);
        color: #ffffff;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-decoration: none;
        text-transform: uppercase;
    }

    .orbit {
        position: absolute;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 50%;
        transform: rotate(-18deg);
    }

    .orbit::after {
        content: "";
        position: absolute;
        top: 48%;
        left: -0.4rem;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background: var(--cyan);
        box-shadow: 0 0 1.2rem var(--cyan);
    }

    .orbit-one {
        width: min(88vw, 78rem);
        aspect-ratio: 2 / 1;
    }

    .orbit-two {
        width: min(62vw, 56rem);
        aspect-ratio: 2 / 1;
        transform: rotate(23deg);
    }

    .star {
        position: absolute;
        width: clamp(3rem, 7vw, 7rem);
        opacity: 0.74;
    }

    .star-one { top: 13%; left: 8%; }
    .star-two { right: 8%; bottom: 12%; }
    .star-three { top: 18%; right: 13%; width: clamp(2.2rem, 4vw, 4rem); }

    @media (max-width: 700px) {
        .resources-coming-soon {
            min-height: calc(100svh - 4.75rem);
        }

        .orbit-one { width: 145vw; }
        .orbit-two { width: 105vw; }
    }
</style>
