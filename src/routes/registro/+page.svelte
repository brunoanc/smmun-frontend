<script lang="ts">
    import { registroConfig } from "$lib/data/registro";

    const convocatorias = [
        {
            title: "Convocatoria de delegaciones",
            image: "/assets/img/registro-delegaciones.webp",
            alt: "Delegaciones participantes de SMMUN",
            color: "#ff57b6",
            text: "Existen dos modalidades de participación: individual y en codelegación (dos personas). Dependiendo del comité, la participación podrá ser individual, en pareja o en ambas modalidades.",
            callout: "¿Quieres cambiar al mundo? Este es tu lugar."
        },
        {
            title: "Convocatoria de faculty",
            image: "/assets/img/registro-faculty.webp",
            alt: "Faculty advisors de SMMUN",
            color: "#00608a",
            text: "Una Delegación Oficial es un grupo de participantes que representa a una misma institución dentro del SMMUN y cuenta con el acompañamiento de una persona Faculty Advisor, responsable de orientar, apoyar y dar seguimiento a sus delegaciones durante el Modelo.",
            callout: "¿Quieres representar a tu institución? Este es el primer paso."
        },
        {
            title: "Convocatoria de staff",
            image: "/assets/img/registro-staff.webp",
            alt: "Equipo de staff de SMMUN",
            color: "#ff6b6b",
            text: "¿Quieres conocer un poco de la magia que se vive formando parte de la Secretaría de Logística y Eventos?",
            callout: "¡Anímate a formar parte del equipo que hace realidad nuestros sueños!"
        }
    ];
</script>

<section class="registration-hero">
    <img class="hero-star star-left" src="/assets/img/stars/3.svg" alt="" />
    <img class="hero-star star-right" src="/assets/img/stars/8.svg" alt="" />
    <span>¡Forma parte del SMMUN!</span>
    <h1>Registro {registroConfig.anio}</h1>
    <p>Muy pronto podrás encontrar aquí las convocatorias para encender tu chispa.</p>
</section>

<section class="registration-options" aria-label="Próximas convocatorias">
    {#each convocatorias as convocatoria, index}
        <article class:reverse={index % 2 === 1} style="--card-color: {convocatoria.color}">
            <figure>
                <img src={convocatoria.image} alt={convocatoria.alt} loading={index === 0 ? "eager" : "lazy"} />
                <span>Próximamente</span>
            </figure>

            <div class="card-copy">
                <span class="number">0{index + 1}</span>
                <h2>{convocatoria.title}</h2>
                <p>{convocatoria.text}</p>
                <strong>{convocatoria.callout}</strong>
                <button type="button" disabled aria-disabled="true">
                    Inscripciones próximamente
                </button>
            </div>
        </article>
    {/each}
</section>

<style>
    .registration-hero {
        position: relative;
        overflow: hidden;
        padding: clamp(5rem, 10vw, 10rem) 7vw;
        color: #ffffff;
        text-align: center;
        background:
            linear-gradient(rgba(16, 10, 67, 0.68), rgba(16, 10, 67, 0.78)),
            var(--navy) url("/assets/img/hero.webp") center / cover;
    }

    .registration-hero > span {
        color: var(--yellow);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.24em;
        text-transform: uppercase;
    }

    .registration-hero h1 {
        margin: 0.7rem 0 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(3.3rem, 8vw, 8rem);
        line-height: 0.92;
    }

    .registration-hero p {
        max-width: 42rem;
        margin: clamp(2.25rem, 3vw, 3rem) auto 0;
        color: rgba(255, 255, 255, 0.86);
        font-size: clamp(1rem, 1.35vw, 1.2rem);
        line-height: 1.65;
    }

    .hero-star {
        position: absolute;
        width: clamp(4rem, 9vw, 9rem);
        opacity: 0.62;
    }

    .star-left {
        left: 7%;
        bottom: 12%;
    }

    .star-right {
        top: 10%;
        right: 8%;
    }

    .registration-options {
        padding: clamp(5rem, 8vw, 9rem) 6vw;
        background: linear-gradient(180deg, #ffffff, #f8f7ff);
    }

    article {
        width: min(88vw, 1380px);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: clamp(2.5rem, 7vw, 8rem);
        align-items: center;
    }

    article + article {
        margin-top: clamp(6rem, 11vw, 12rem);
    }

    article.reverse figure {
        order: 2;
    }

    article.reverse .card-copy {
        order: 1;
    }

    figure {
        position: relative;
        aspect-ratio: 1;
    }

    figure::before {
        content: "";
        position: absolute;
        inset: 5% -5% -5% 5%;
        z-index: 0;
        border-radius: 50% 45% 48% 42%;
        background: color-mix(in srgb, var(--card-color), #ffffff 68%);
    }

    figure img {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 47% 53% 44% 56% / 54% 43% 57% 46%;
        object-fit: cover;
        box-shadow: 0 2rem 4rem rgba(25, 15, 91, 0.17);
    }

    figure span {
        position: absolute;
        right: -1rem;
        bottom: 8%;
        z-index: 2;
        padding: 0.7rem 1.1rem;
        border-radius: 999px;
        color: #ffffff;
        background: var(--card-color);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        transform: rotate(-4deg);
    }

    .number {
        color: var(--card-color);
        font-family: "Caveat", cursive;
        font-size: 2rem;
        font-weight: 700;
    }

    .card-copy h2 {
        margin: 0.3rem 0 1.4rem;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.6rem, 5.8vw, 6rem);
        line-height: 0.95;
    }

    .card-copy p {
        margin: 0;
        color: #484165;
        font-size: clamp(0.98rem, 1.25vw, 1.1rem);
        line-height: 1.75;
    }

    .card-copy strong {
        display: block;
        margin-top: 1.5rem;
        color: var(--card-color);
        font-family: "Caveat", cursive;
        font-size: clamp(1.55rem, 2.7vw, 2.5rem);
        line-height: 1.15;
    }

    button {
        margin-top: 2rem;
        padding: 0.95rem 1.4rem;
        border: 0;
        border-radius: 999px;
        color: #ffffff;
        background: var(--navy);
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: not-allowed;
        opacity: 0.62;
    }

    @media (max-width: 850px) {
        article {
            width: min(90vw, 40rem);
            grid-template-columns: 1fr;
            gap: 3.5rem;
        }

        article.reverse figure,
        article.reverse .card-copy {
            order: initial;
        }

        figure span {
            right: 0;
        }
    }

    @media (max-width: 520px) {
        .registration-hero {
            padding-inline: 6vw;
        }

        .star-left {
            bottom: 0.5rem;
            left: 1rem;
            width: 4rem;
            opacity: 0.4;
        }

        .star-right {
            top: 1rem;
            right: 1rem;
            width: 3.5rem;
            opacity: 0.52;
        }

        .registration-options {
            padding-inline: 8vw;
        }

        article {
            width: 100%;
        }

        figure::before {
            inset: 4% -2% -4% 2%;
        }

        .card-copy h2 {
            font-size: 2.7rem;
        }
    }
</style>
