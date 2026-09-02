<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { registroConfig } from "$lib/data/registro";

    let { home = false }: { home?: boolean } = $props();

    let menuOpen = $state(false);
    let scrolled = $state(false);

    const pages = [
        { href: "/", label: "Inicio", star: "1.svg", color: "#fdca40" },
        { href: "/quienes-somos/", label: "¿Quiénes somos?", star: "3.svg", color: "#67e3ff" },
        { href: "/registro/", label: "Registro", star: "7.svg", color: "#ff57b6" },
        { href: "/recursos/", label: "Recursos", star: "11.svg", color: "#ff6b6b" }
    ];

    onMount(() => {
        const updateNavbar = () => {
            scrolled = !home || window.scrollY > 48;
        };

        updateNavbar();
        window.addEventListener("scroll", updateNavbar, { passive: true });

        return () => window.removeEventListener("scroll", updateNavbar);
    });

    function isActive(href: string) {
        return href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);
    }

    function closeMenu() {
        menuOpen = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeMenu();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<nav class:home class:scrolled class:menu-open={menuOpen} aria-label="Navegación principal">
    <div class="nav-inner">
        <a class="brand" href="/" aria-label={`${registroConfig.edicion}, inicio`} onclick={closeMenu}>
            <img src="/assets/img/logos/principal.svg" alt="" />
            <span>
                <strong>{registroConfig.edicion}</strong>
                <em>{registroConfig.lema}</em>
            </span>
        </a>

        <div class="desktop-links">
            {#each pages as item}
                <a class:active={isActive(item.href)} href={item.href} style="--item-color: {item.color}">
                    <img src="/assets/img/stars/{item.star}" alt="" />
                    <span>{item.label}</span>
                </a>
            {/each}
        </div>

        <button
            class="hamburger"
            class:active={menuOpen}
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onclick={() => menuOpen = !menuOpen}
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <div id="mobile-menu" class="mobile-menu" class:active={menuOpen} aria-hidden={!menuOpen}>
        <img class="menu-star star-one" src="/assets/img/stars/4.svg" alt="" />
        <img class="menu-star star-two" src="/assets/img/stars/9.svg" alt="" />
        <div class="mobile-brand">
            <img src="/assets/img/logos/principal.svg" alt="Logo SMMUN" />
            <p>{registroConfig.edicion}</p>
            <span>{registroConfig.lema}</span>
        </div>

        <div class="mobile-links">
            {#each pages as item, index}
                <a
                    class:active={isActive(item.href)}
                    href={item.href}
                    style="--item-color: {item.color}; --delay: {index * 55}ms"
                    tabindex={menuOpen ? 0 : -1}
                    onclick={closeMenu}
                >
                    <img src="/assets/img/stars/{item.star}" alt="" />
                    {item.label}
                </a>
            {/each}
        </div>
    </div>
</nav>

<style>
    nav {
        position: fixed;
        inset: 0 0 auto;
        z-index: 50;
        height: var(--nav-height);
        color: #ffffff;
        background: var(--navy);
        box-shadow: 0 0.75rem 2.2rem rgba(8, 4, 40, 0.14);
        transition: background 280ms ease, box-shadow 280ms ease;
    }

    nav.home:not(.scrolled) {
        background: linear-gradient(180deg, rgba(5, 7, 30, 0.68), transparent);
        box-shadow: none;
    }

    nav.scrolled {
        background: rgba(25, 15, 91, 0.96);
    }

    .nav-inner {
        width: min(92vw, 1560px);
        height: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: clamp(1.4rem, 4vw, 5rem);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        flex: 0 0 auto;
        color: #ffffff;
        text-decoration: none;
        transition: opacity 220ms ease, transform 220ms ease, width 220ms ease;
    }

    .brand > img {
        width: 3.2rem;
        height: 3.2rem;
        object-fit: contain;
    }

    .brand span {
        display: grid;
        line-height: 1;
    }

    .brand strong {
        font-size: 0.82rem;
        letter-spacing: 0.12em;
    }

    .brand em {
        margin-top: 0.18rem;
        color: var(--yellow);
        font-family: "Caveat", cursive;
        font-size: 1.35rem;
        font-style: normal;
    }

    nav.home:not(.scrolled) .brand {
        width: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
        transform: translateY(-0.5rem);
    }

    .desktop-links {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: clamp(1.5rem, 4.2vw, 5.2rem);
        width: 100%;
        margin-left: auto;
    }

    .desktop-links a {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.5rem 0;
        color: #ffffff;
        font-size: clamp(0.78rem, 1vw, 1rem);
        font-weight: 600;
        letter-spacing: 0.1em;
        text-decoration: none;
        white-space: nowrap;
    }

    .desktop-links a::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        left: 2rem;
        height: 2px;
        background: var(--item-color);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 180ms ease;
    }

    .desktop-links a:hover::after,
    .desktop-links a:focus-visible::after,
    .desktop-links a.active::after {
        transform: scaleX(1);
    }

    .desktop-links img {
        width: 1.45rem;
        height: 1.45rem;
        object-fit: contain;
    }

    .hamburger,
    .mobile-menu {
        display: none;
    }

    @media (max-width: 820px) {
        nav {
            height: 4.75rem;
        }

        .nav-inner {
            width: 90vw;
            justify-content: space-between;
        }

        nav.home:not(.scrolled) .brand {
            width: auto;
        }

        nav.home:not(.scrolled) .brand > *,
        nav.home:not(.scrolled) .brand span {
            visibility: hidden;
        }

        .desktop-links {
            display: none;
        }

        .hamburger {
            position: relative;
            z-index: 3;
            display: grid;
            width: 3rem;
            height: 3rem;
            padding: 0.72rem 0.6rem;
            border: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            cursor: pointer;
        }

        .hamburger span {
            display: block;
            width: 100%;
            height: 2px;
            margin: auto;
            border-radius: 4px;
            background: #ffffff;
            transition: transform 220ms ease, opacity 160ms ease;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(0.5rem) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-0.5rem) rotate(-45deg);
        }

        .mobile-menu {
            position: fixed;
            inset: 0;
            z-index: 2;
            display: grid;
            grid-template-rows: auto 1fr;
            overflow: hidden;
            padding: 5.4rem 7vw 3rem;
            background:
                radial-gradient(circle at 85% 20%, rgba(255, 87, 182, 0.22), transparent 30%),
                radial-gradient(circle at 10% 85%, rgba(103, 227, 255, 0.18), transparent 32%),
                var(--navy) url("/assets/img/hero.webp") center / cover;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-1rem);
            transition: opacity 220ms ease, visibility 220ms ease, transform 220ms ease;
        }

        .mobile-menu::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background: rgba(13, 8, 54, 0.72);
        }

        .mobile-menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .mobile-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #ffffff;
        }

        .mobile-brand img {
            width: 5rem;
            height: 5rem;
            object-fit: contain;
        }

        .mobile-brand p {
            margin: 0.4rem 0 0;
            font-weight: 700;
            letter-spacing: 0.2em;
        }

        .mobile-brand span {
            color: var(--yellow);
            font-family: "Caveat", cursive;
            font-size: 2rem;
        }

        .mobile-links {
            align-self: center;
            display: grid;
            width: min(100%, 25rem);
        }

        .mobile-links a {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.18);
            color: #ffffff;
            font-family: "Binate", "Raleway", sans-serif;
            font-size: clamp(1.5rem, 7vw, 2.15rem);
            text-decoration: none;
            opacity: 0;
            transform: translateX(-1rem);
            transition: color 180ms ease, opacity 220ms ease var(--delay), transform 220ms ease var(--delay);
        }

        .mobile-menu.active .mobile-links a {
            opacity: 1;
            transform: translateX(0);
        }

        .mobile-links a.active {
            color: var(--item-color);
        }

        .mobile-links img {
            width: 2rem;
            height: 2rem;
        }

        .menu-star {
            position: absolute;
            width: 3.5rem;
            opacity: 0.72;
        }

        .star-one {
            top: 18%;
            left: 7%;
        }

        .star-two {
            right: 8%;
            bottom: 8%;
        }
    }
</style>
