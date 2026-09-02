<script lang="ts">
    let {
        year,
        edition,
        color = "#ffffff",
        bgColor,
        imageDimensions,
        text,
        reverse = false
    }: {
        year: number;
        edition: string;
        color?: string;
        bgColor: string;
        imageDimensions: number[][];
        text: string;
        reverse?: boolean;
    } = $props();

    const hasImages = $derived(imageDimensions[0]?.[0] !== 0);
    const imageIndexes = [0, 1, 2];
</script>

<article class:reverse style="--edition-color: {bgColor}; --heading-color: {color}">
    <header>
        <span>SMMUN {year}</span>
        <h2>{edition}</h2>
    </header>

    <div class="edition-content">
        <div class="copy">
            <p>{text}</p>
        </div>

        {#if hasImages}
            <div class="gallery">
                {#each imageIndexes as index}
                    <figure class:wide={index === 0}>
                        <img
                            src="/assets/img/ediciones/{year}/img{index + 1}.webp"
                            alt="Edición {year} del SMMUN"
                            loading="lazy"
                        />
                    </figure>
                {/each}
            </div>
        {/if}
    </div>
</article>

<style>
    article {
        background: #ffffff;
    }

    header {
        position: relative;
        overflow: hidden;
        padding: clamp(2rem, 4.5vw, 4.5rem) 6vw;
        color: var(--heading-color);
        background:
            linear-gradient(100deg, var(--edition-color), color-mix(in srgb, var(--edition-color), var(--pink) 36%), color-mix(in srgb, var(--edition-color), var(--yellow) 44%)),
            var(--edition-color);
    }

    header::after {
        content: "";
        position: absolute;
        top: -6rem;
        right: 6vw;
        width: 14rem;
        aspect-ratio: 1;
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 50%;
        box-shadow: 0 0 0 2.5rem rgba(255, 255, 255, 0.05);
    }

    header span {
        display: block;
        font-size: clamp(0.75rem, 1.2vw, 1rem);
        font-weight: 800;
        letter-spacing: 0.26em;
    }

    header h2 {
        margin: 0.35rem 0 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.1rem, 5vw, 5.2rem);
        line-height: 0.98;
        text-transform: uppercase;
    }

    .edition-content {
        width: min(88vw, 1450px);
        margin: 0 auto;
        padding: clamp(3rem, 6vw, 6.5rem) 0;
        display: grid;
        grid-template-columns: minmax(18rem, 0.86fr) minmax(25rem, 1.14fr);
        gap: clamp(2.5rem, 6vw, 7rem);
        align-items: stretch;
    }

    article.reverse .copy {
        order: 2;
    }

    article.reverse .gallery {
        order: 1;
    }

    .copy {
        position: relative;
        align-self: center;
        padding-left: 1.5rem;
    }

    .copy::before {
        content: "";
        position: absolute;
        top: 0.2rem;
        bottom: 0.2rem;
        left: 0;
        width: 0.28rem;
        border-radius: 1rem;
        background: var(--edition-color);
    }

    p {
        margin: 0;
        color: #302a50;
        font-size: clamp(0.92rem, 1.2vw, 1.05rem);
        line-height: 1.75;
        white-space: pre-line;
    }

    .gallery {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: minmax(8rem, 0.74fr) minmax(10rem, 1fr);
        gap: 0.8rem;
        min-height: clamp(22rem, 30vw, 29rem);
        contain: size;
    }

    figure {
        overflow: hidden;
        border-radius: 1.4rem;
        background: #eceaf3;
        box-shadow: 0 1.2rem 2.7rem rgba(25, 15, 91, 0.14);
    }

    figure.wide {
        grid-column: 1 / -1;
    }

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        transition: transform 360ms ease;
    }

    figure:hover img {
        transform: scale(1.025);
    }

    @media (max-width: 900px) {
        .edition-content {
            width: min(90vw, 44rem);
            grid-template-columns: 1fr;
            gap: 2.5rem;
        }

        article.reverse .copy,
        article.reverse .gallery {
            order: initial;
        }

        .gallery {
            min-height: min(86vw, 29rem);
        }
    }

    @media (max-width: 520px) {
        header {
            padding-inline: 7vw;
        }

        .edition-content {
            padding-block: 3.5rem;
        }

        .gallery {
            grid-template-rows: 10rem 9rem;
            height: 19.55rem;
            min-height: 0;
            gap: 0.55rem;
        }

        figure {
            border-radius: 0.8rem;
        }
    }
</style>
