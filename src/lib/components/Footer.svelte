<script lang="ts">
    import { registroConfig } from "$lib/data/registro";
</script>

<footer>
    <img class="decor decor-left" src="/assets/img/stars/5.svg" alt="" />
    <img class="decor decor-right" src="/assets/img/stars/10.svg" alt="" />

    <div class="footer-main">
        <div class="identity">
            <img src="/assets/img/logos/principal.svg" alt="Logo del SMMUN" />
            <div>
                <p>Modelo de Naciones Unidas<br />del Sureste Mexicano</p>
                <span>{registroConfig.edicion} · <em>{registroConfig.lema}</em></span>
            </div>
        </div>

        <div class="contact">
            <h2>¡Ponte en contacto!</h2>
            <a href={`mailto:${registroConfig.contactos.secretariaGeneral}`}>{registroConfig.contactos.secretariaGeneral}</a>
            <a href={`mailto:${registroConfig.contactos.contacto}`}>{registroConfig.contactos.contacto}</a>
            <a href={`mailto:${registroConfig.contactos.finanzas}`}>{registroConfig.contactos.finanzas}</a>
        </div>

        <div class="social">
            <h2>¡Síguenos!</h2>
            <div>
                <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/smmunoficial" aria-label="Instagram">
                    <i class="fa-brands fa-instagram"></i>
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://facebook.com/smmunoficial" aria-label="Facebook">
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
            </div>
        </div>
    </div>

    <p class="copyright">© 2016 – {new Date().getFullYear()} SMMUN</p>
</footer>

<style>
    footer {
        position: relative;
        overflow: hidden;
        padding: clamp(3rem, 6vw, 6rem) 5vw 1.4rem;
        color: #ffffff;
        background: var(--navy);
        border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    .footer-main {
        position: relative;
        z-index: 1;
        width: min(90vw, 1500px);
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(18rem, 1.5fr) minmax(16rem, 1fr) auto;
        gap: clamp(2rem, 6vw, 7rem);
        align-items: center;
    }

    .identity {
        display: flex;
        align-items: center;
        gap: 1.4rem;
    }

    .identity > img {
        width: clamp(5rem, 8vw, 8rem);
        height: clamp(5rem, 8vw, 8rem);
        object-fit: contain;
    }

    .identity p {
        margin: 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(1.25rem, 2.15vw, 2rem);
        line-height: 1.08;
    }

    .identity span {
        display: block;
        margin-top: 0.8rem;
        color: var(--cyan);
        font-size: 0.84rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .identity em {
        color: var(--pink);
        font-family: "Caveat", cursive;
        font-size: 1.35rem;
        font-style: normal;
        letter-spacing: 0;
        text-transform: none;
    }

    h2 {
        margin: 0 0 0.8rem;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: 1.25rem;
    }

    .contact {
        display: flex;
        flex-direction: column;
        gap: 0.38rem;
    }

    .contact a {
        width: fit-content;
        color: var(--cyan);
        font-size: clamp(0.75rem, 1vw, 0.92rem);
        text-decoration: none;
    }

    .contact a:hover,
    .contact a:focus-visible {
        color: var(--pink);
        text-decoration: underline;
    }

    .social > div {
        display: flex;
        gap: 0.7rem;
    }

    .social a {
        display: grid;
        width: 2.7rem;
        height: 2.7rem;
        place-items: center;
        border-radius: 50%;
        color: #ffffff;
        background: linear-gradient(135deg, var(--pink), var(--coral), var(--yellow));
        font-size: 1.25rem;
        text-decoration: none;
        transition: transform 180ms ease;
    }

    .social a:hover,
    .social a:focus-visible {
        transform: translateY(-0.2rem);
    }

    .copyright {
        position: relative;
        z-index: 1;
        margin: 3.5rem 0 0;
        text-align: center;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.08em;
    }

    .decor {
        position: absolute;
        width: clamp(4rem, 9vw, 9rem);
        opacity: 0.18;
    }

    .decor-left {
        bottom: -2rem;
        left: -1.5rem;
    }

    .decor-right {
        top: -2rem;
        right: -1rem;
    }

    @media (max-width: 900px) {
        .footer-main {
            grid-template-columns: 1fr 1fr;
        }

        .identity {
            grid-column: 1 / -1;
        }
    }

    @media (max-width: 600px) {
        footer {
            padding-inline: 7vw;
        }

        .footer-main {
            width: 100%;
            grid-template-columns: 1fr;
            gap: 2.2rem;
        }

        .identity {
            grid-column: auto;
            align-items: flex-start;
        }

        .identity > img {
            width: 5rem;
            height: 5rem;
        }

        .contact a {
            overflow-wrap: anywhere;
        }

        .copyright {
            margin-top: 2.8rem;
        }
    }
</style>
