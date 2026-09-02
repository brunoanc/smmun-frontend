<script lang="ts">
    import BeholdWidget from "@behold/svelte";
    import { nombreEdicion, registroConfig } from "$lib/data/registro";

    const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SMMUN",
        alternateName: nombreEdicion,
        url: "https://smmun.com/"
    };

    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        image: "https://smmun.com/assets/img/og_image.png",
        url: "https://smmun.com/",
        logo: "https://smmun.com/assets/img/logos/principal.svg",
        name: nombreEdicion,
        description: "El Modelo de Naciones Unidas donde cada voz enciende una chispa.",
        email: registroConfig.contactos.secretariaGeneral
    };
</script>

<svelte:head>
    <link rel="preload" href="/assets/img/hero.webp" as="image" type="image/webp">
    <script type="application/ld+json">{JSON.stringify(websiteStructuredData)}</script>
    <script type="application/ld+json">{JSON.stringify(organizationStructuredData)}</script>
</svelte:head>

<section class="hero">
    <div class="hero-glow"></div>
    <img class="floating-star star-one" src="/assets/img/stars/2.svg" alt="" />
    <img class="floating-star star-two" src="/assets/img/stars/8.svg" alt="" />
    <img class="floating-star star-three" src="/assets/img/stars/12.svg" alt="" />

    <div class="hero-content">
        <img class="hero-logo" src="/assets/img/logos/principal.svg" alt="Logo del Modelo de Naciones Unidas del Sureste Mexicano" />
        <p>{registroConfig.edicion}</p>
        <h1>{registroConfig.lema}</h1>
    </div>

    <div class="planet-stage">
        <div class="planet">
            <img class="planet-art" src="/assets/img/semicircle.png" alt="" />
            <a class="scroll-cue" href="#bienvenida" aria-label="Descubrir más">
                <span>Descubre</span>
                <i class="fa-solid fa-chevron-down"></i>
            </a>
        </div>
    </div>
</section>

<section id="bienvenida" class="quote-section">
    <img src="/assets/img/stars/6.svg" alt="" />
    <blockquote>
        “We are stardust brought to life,<br />
        then empowered by the universe to figure itself out<br />
        — and we have only just begun.”
        <cite>Neil deGrasse Tyson</cite>
    </blockquote>
    <a href="/quienes-somos/">Conoce nuestra chispa <span aria-hidden="true">→</span></a>
</section>

<section class="instagram-section">
    <div class="section-heading">
        <span class="eyebrow">@smmunoficial</span>
        <h2>Conecta con nuestra comunidad</h2>
    </div>
    <div class="behold-container">
        <BeholdWidget feedId="Lf9sgrB1b0m8PfiPiGH1" />
    </div>
</section>

<style>
    .hero {
        position: relative;
        display: grid;
        min-height: 100svh;
        place-items: center;
        overflow: hidden;
        color: #ffffff;
        background: #080822 url("/assets/img/hero.webp") 94% center / 145% auto no-repeat;
        isolation: isolate;
    }

    .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
            linear-gradient(180deg, rgba(4, 5, 27, 0.24), rgba(13, 7, 45, 0.15) 50%, rgba(12, 5, 43, 0.72)),
            radial-gradient(circle at center, transparent 20%, rgba(2, 4, 21, 0.38) 100%);
    }

    .hero-glow {
        position: absolute;
        top: 44%;
        left: 50%;
        width: min(52vw, 48rem);
        aspect-ratio: 1;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.07);
        filter: blur(4rem);
        transform: translate(-50%, -50%);
    }

    .hero-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: clamp(-0.9rem, -1svh, -0.5rem);
        text-align: center;
    }

    .hero-logo {
        width: clamp(11rem, 23vw, 22rem);
        height: clamp(11rem, 23vw, 22rem);
        object-fit: contain;
        filter: drop-shadow(0 1.5rem 2rem rgba(0, 0, 0, 0.28));
    }

    .hero-content p {
        margin: 0.7rem 0 0;
        font-size: clamp(1rem, 1.6vw, 1.45rem);
        font-weight: 700;
        letter-spacing: 0.34em;
        text-transform: uppercase;
    }

    .hero-content h1 {
        margin: -0.15rem 0 0;
        color: #ffffff;
        font-family: "Caveat", cursive;
        font-size: clamp(3.2rem, 7vw, 6.8rem);
        font-weight: 500;
        line-height: 1;
        text-shadow: 0 0 1.8rem rgba(255, 87, 182, 0.46);
        transform: translateX(-0.09em);
    }

    .planet-stage {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        height: clamp(9rem, 20svh, 12rem);
        overflow: hidden;
        pointer-events: none;
    }

    .planet {
        position: absolute;
        top: clamp(0.6rem, 1svh, 1rem);
        left: 50%;
        width: min(60vw, 62rem);
        aspect-ratio: 1476 / 444;
        transform: translateX(-50%);
    }

    .planet-art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        clip-path: ellipse(46.55% 154% at 50% 159.5%);
        pointer-events: none;
    }

    .floating-star {
        position: absolute;
        width: clamp(2.5rem, 5vw, 5rem);
        opacity: 0.84;
        animation: drift 6s ease-in-out infinite;
    }

    .star-one {
        top: 26%;
        left: 12%;
    }

    .star-two {
        top: 18%;
        right: 15%;
        animation-delay: -2s;
    }

    .star-three {
        right: 9%;
        bottom: 24%;
        width: clamp(2rem, 3.8vw, 4rem);
        animation-delay: -4s;
    }

    @keyframes drift {
        50% { transform: translateY(-0.8rem) rotate(5deg); }
    }

    .scroll-cue {
        position: absolute;
        top: clamp(5rem, 11svh, 6.5rem);
        left: 50%;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.45rem;
        color: #ffffff;
        font-size: clamp(1rem, 1vw, 1.15rem);
        font-weight: 700;
        letter-spacing: 0.18em;
        text-decoration: none;
        text-transform: uppercase;
        transform: translateX(-50%);
        pointer-events: auto;
    }

    .scroll-cue i {
        letter-spacing: 0;
        animation: cue-bounce 1.4s ease-in-out infinite;
    }

    .scroll-cue span {
        text-indent: 0.18em;
    }

    @keyframes cue-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(0.4rem); }
    }

    @media (prefers-reduced-motion: reduce) {
        .scroll-cue i {
            animation: none;
        }
    }

    .quote-section {
        position: relative;
        min-height: 58vh;
        padding: clamp(5rem, 9vw, 9rem) 7vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: var(--paper);
    }

    .quote-section > img {
        position: absolute;
        top: 12%;
        left: 7%;
        width: clamp(3rem, 7vw, 7rem);
        opacity: 0.42;
    }

    blockquote {
        margin: 0;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(1.6rem, 3.1vw, 3.2rem);
        line-height: 1.25;
    }

    cite {
        display: block;
        margin-top: 1.4rem;
        color: var(--coral);
        font-family: "Caveat", cursive;
        font-size: clamp(1.6rem, 2.5vw, 2.5rem);
        font-style: normal;
    }

    .quote-section > a {
        margin-top: 2.5rem;
        padding-bottom: 0.25rem;
        border-bottom: 2px solid var(--pink);
        color: var(--navy);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-decoration: none;
        text-transform: uppercase;
    }

    .instagram-section {
        padding: clamp(5rem, 8vw, 8rem) 5vw;
        background:
            radial-gradient(circle at 10% 0%, rgba(103, 227, 255, 0.14), transparent 30%),
            linear-gradient(180deg, #f7f8ff, #ffffff);
    }

    .section-heading {
        max-width: 53rem;
        margin: 0 auto 3.5rem;
        text-align: center;
    }

    .eyebrow {
        color: var(--pink);
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .section-heading h2 {
        margin: 0.6rem 0 0;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.2rem, 5vw, 4.8rem);
        line-height: 1;
    }

    .behold-container {
        width: min(100%, 1480px);
        min-height: 16rem;
        margin: 0 auto;
    }

    @media (max-width: 820px) {
        .hero {
            min-height: 100svh;
            background-size: cover;
            background-position: 58% center;
        }

        .hero-content {
            margin-top: -6vh;
        }

        .hero-logo {
            width: min(52vw, 14rem);
            height: min(52vw, 14rem);
        }

        .planet-stage {
            height: clamp(7rem, 18svh, 9rem);
        }

        .planet {
            top: 1rem;
            width: 110vw;
        }

        .scroll-cue {
            top: clamp(4rem, 8.5svh, 4.75rem);
        }

        .star-one {
            top: 24%;
            left: 5%;
        }

        .star-two {
            top: 16%;
            right: 5%;
        }

        .star-three {
            bottom: 27%;
            right: 6%;
        }

        .quote-section {
            min-height: auto;
        }

        blockquote br {
            display: none;
        }
    }
</style>
