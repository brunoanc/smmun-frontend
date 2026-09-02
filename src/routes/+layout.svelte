<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import Footer from "$lib/components/Footer.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { nombreEdicion } from "$lib/data/registro";

    let { children } = $props();
    let prefersReducedMotion = $state(false);

    const isHome = $derived(page.url.pathname === "/");
    const pageName = $derived(page.url.pathname === "/" ? "index" : page.url.pathname.replaceAll("/", "").replaceAll(" ", "-"));
    const canonicalUrl = $derived(`https://smmun.com${page.url.pathname}`);
    const socialImage = "https://smmun.com/assets/img/og_image.png";

    onMount(() => {
        prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
</script>

<svelte:head>
    <title>{page.data.title}</title>
    <link rel="canonical" href={canonicalUrl}>
    <meta name="description" content={page.data.description}>
    <meta name="theme-color" content="#190f5b">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_MX">
    <meta property="og:url" content={canonicalUrl}>
    <meta property="og:title" content={page.data.title}>
    <meta property="og:description" content={page.data.description}>
    <meta property="og:image" content={socialImage}>
    <meta property="og:image:secure_url" content={socialImage}>
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content={nombreEdicion}>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={page.data.title}>
    <meta name="twitter:description" content={page.data.description}>
    <meta name="twitter:image" content={socialImage}>
    <meta name="twitter:image:alt" content={nombreEdicion}>
</svelte:head>

<Navbar home={isHome} />

<main class={pageName} class:with-nav={!isHome}>
    {#key page.url.pathname}
        <div
            class="page-transition"
            transition:fly={{
                y: prefersReducedMotion ? 0 : 10,
                duration: prefersReducedMotion ? 0 : 260,
                easing: cubicOut
            }}
        >
            {@render children()}
        </div>
    {/key}
</main>

<Footer />

<style>
    main {
        min-height: 70vh;
        overflow: hidden;
    }

    main.with-nav {
        padding-top: var(--nav-height);
    }

    .page-transition {
        min-height: inherit;
    }

    @media (max-width: 820px) {
        main.with-nav {
            padding-top: 4.75rem;
        }
    }
</style>
