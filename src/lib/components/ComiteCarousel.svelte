<script lang="ts">
    import type { Carousel } from "bootstrap";
    import { onMount } from "svelte";

    let { comite, index, cantidadImagenes } = $props();

    let carouselDiv: HTMLDivElement;
    let carousel: Carousel;

    // Inicializar carrusel
    onMount(() => {
        carousel = window.bootstrap.Carousel.getOrCreateInstance(carouselDiv);
    });

    // Regresar a imagen 0 antes de cambiar de comité
    $effect.pre(() => {
        comite.length;
        if (carousel) carousel.to(0);
    });
</script>

<style>
    #comite-topico-div {
        overflow: hidden;
        border: 1px solid rgba(25, 15, 91, 0.1);
        border-radius: 1.25rem;
        flex-direction: column;
        margin-bottom: 1rem;
        background: #f7f5ff;
        box-shadow: 0 1rem 2.5rem rgba(25, 15, 91, 0.09);
    }

    .carousel-item img {
        border-radius: 1rem;
        width: min(100%, 28rem);
        height: auto;
        cursor: pointer;
        margin: 1.25rem;
    }

    .carousel-item img:hover {
        opacity: 0.9;
    }

    .carousel .carousel-control-prev-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23190f5b'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e");
    }

    .carousel .carousel-control-next-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23190f5b'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
    }

    @media screen and (max-width: 820px) {
        .carousel .carousel-control-prev-icon, .carousel .carousel-control-next-icon {
            display: none;
        }

        #comite-topico-div {
            border-radius: 1rem;
        }

        .carousel-item img {
            margin: 0.75rem;
        }
    }
</style>

<div id="comite-topico-div">
    <div id="carousel-comite-{index}-{comite}" class="carousel slide" data-bs-ride="carousel" data-bs-touch="true" bind:this={carouselDiv}>
        <div class="carousel-inner">
            {#each { length: cantidadImagenes }, i}
                <div class="carousel-item" class:active={i == 0} data-bs-interval="8000">
                    <div class="d-flex justify-content-center">
                        <img src="/assets/img/comites/{comite}/{i + 1}.webp" class="d-block" width="1080" height="1080" alt="Foto del comité {comite.toUpperCase()} del SMMUN.">
                    </div>
                </div>
            {/each}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-comite-{index}-{comite}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel-comite-{index}-{comite}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</div>
