<script lang="ts">
    import { tick } from "svelte";

    type SelectOption = {
        value: string;
        label: string;
        searchText?: string;
        detail?: string;
        icon?: string;
        group?: string;
        disabled?: boolean;
        hidden?: boolean;
    };

    let {
        name,
        options = [],
        value = $bindable(""),
        placeholder = "Selecciona una opción",
        searchPlaceholder = "Buscar…",
        ariaLabel = placeholder,
        searchable = false,
        required = false,
        disabled = false,
        onchange
    }: {
        name: string;
        options?: SelectOption[];
        value?: string;
        placeholder?: string;
        searchPlaceholder?: string;
        ariaLabel?: string;
        searchable?: boolean;
        required?: boolean;
        disabled?: boolean;
        onchange?: (event: Event) => void;
    } = $props();

    let open = $state(false);
    let query = $state("");
    let container: HTMLDivElement;
    let nativeSelect: HTMLSelectElement;
    let trigger: HTMLButtonElement;
    let searchInput = $state<HTMLInputElement>();

    const selectedOption = $derived(options.find((option) => option.value === value));
    const visibleOptions = $derived.by(() => {
        const normalizedQuery = normalize(query);

        return options.filter((option) => {
            if (option.hidden) return false;
            if (!normalizedQuery) return true;

            return normalize(`${option.label} ${option.searchText ?? ""} ${option.detail ?? ""}`).includes(normalizedQuery);
        });
    });
    const groupedOptions = $derived.by(() => {
        const groups = new Map<string, SelectOption[]>();

        for (const option of visibleOptions) {
            const group = option.group ?? "";
            groups.set(group, [...(groups.get(group) ?? []), option]);
        }

        return [...groups.entries()];
    });

    function normalize(text: string) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
    }

    async function toggle() {
        if (disabled) return;
        open = !open;
        query = "";

        if (open && searchable) {
            await tick();
            searchInput?.focus();
        }
    }

    async function choose(option: SelectOption) {
        if (option.disabled) return;

        value = option.value;
        open = false;
        query = "";
        await tick();
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        trigger.focus();
    }

    function handleNativeChange(event: Event) {
        value = (event.currentTarget as HTMLSelectElement).value;
        onchange?.(event);
    }

    async function handleInvalid(event: Event) {
        event.preventDefault();
        open = true;
        await tick();
        trigger.focus();
    }

    function handleWindowClick(event: MouseEvent) {
        if (open && !container.contains(event.target as Node)) {
            open = false;
            query = "";
        }
    }

    function handleWindowKeydown(event: KeyboardEvent) {
        if (open && event.key === "Escape") {
            open = false;
            query = "";
            trigger.focus();
        }
    }

    function handleTriggerKeydown(event: KeyboardEvent) {
        if (["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            if (!open) toggle();
        }
    }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div class="search-select" class:open bind:this={container}>
    <select
        class="native-select"
        bind:this={nativeSelect}
        bind:value
        id="{name}__native"
        {name}
        {required}
        {disabled}
        tabindex="-1"
        aria-hidden="true"
        onchange={handleNativeChange}
        oninvalid={handleInvalid}
    >
        <option value="" disabled>{placeholder}</option>
        {#each options as option}
            <option value={option.value} disabled={option.disabled} hidden={option.hidden}>{option.label}</option>
        {/each}
    </select>

    <button
        class="select-trigger"
        class:placeholder={!selectedOption}
        bind:this={trigger}
        id={name}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        {disabled}
        onclick={toggle}
        onkeydown={handleTriggerKeydown}
    >
        <span class="selected-value">
            {#if selectedOption?.icon}<span class="option-icon">{selectedOption.icon}</span>{/if}
            <span>{selectedOption?.label ?? placeholder}</span>
        </span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>

    {#if open}
        <div class="select-popover">
            {#if searchable}
                <label class="search-box">
                    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <span class="visually-hidden">Buscar opciones</span>
                    <input bind:this={searchInput} bind:value={query} type="search" placeholder={searchPlaceholder} autocomplete="off" />
                </label>
            {/if}

            <div class="option-list" role="listbox" aria-label={ariaLabel}>
                {#if visibleOptions.length === 0}
                    <p class="empty-state">No encontramos resultados.</p>
                {:else}
                    {#each groupedOptions as [group, groupOptions]}
                        {#if group}<div class="option-group">{group}</div>{/if}
                        {#each groupOptions as option}
                            <button
                                class="select-option"
                                class:selected={option.value === value}
                                type="button"
                                role="option"
                                aria-selected={option.value === value}
                                disabled={option.disabled}
                                onclick={() => choose(option)}
                            >
                                {#if option.icon}<span class="option-icon">{option.icon}</span>{/if}
                                <span class="option-copy">
                                    <strong>{option.label}</strong>
                                    {#if option.detail}<small>{option.detail}</small>{/if}
                                </span>
                                {#if option.value === value}<i class="fa-solid fa-check" aria-hidden="true"></i>{/if}
                            </button>
                        {/each}
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .search-select {
        position: relative;
        width: 100%;
        margin-bottom: 1.15rem;
    }

    .native-select {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: 0;
        padding: 0;
        opacity: 0;
        pointer-events: none;
    }

    .select-trigger {
        width: 100%;
        min-height: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.72rem 1rem;
        border: 1.5px solid #d8d3e9;
        border-radius: 0.85rem;
        color: var(--ink);
        text-align: left;
        background: #fcfbff;
        font-size: 0.95rem;
        box-shadow: none;
        transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .select-trigger:hover,
    .select-trigger:focus-visible,
    .open .select-trigger {
        border-color: var(--pink);
        outline: 0;
        background: #ffffff;
        box-shadow: 0 0 0 0.24rem rgba(255, 87, 182, 0.13);
    }

    :global(.was-validated) .native-select:invalid + .select-trigger {
        border-color: var(--coral);
    }

    .select-trigger.placeholder {
        color: #777287;
    }

    .selected-value {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 0.65rem;
    }

    .selected-value > span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .select-trigger > i {
        color: var(--navy);
        font-size: 0.75rem;
        transition: transform 160ms ease;
    }

    .open .select-trigger > i {
        transform: rotate(180deg);
    }

    .select-popover {
        position: absolute;
        top: calc(100% + 0.45rem);
        right: 0;
        left: 0;
        z-index: 40;
        overflow: hidden;
        border: 1px solid rgba(25, 15, 91, 0.12);
        border-radius: 1rem;
        background: #ffffff;
        box-shadow: 0 1.25rem 3rem rgba(25, 15, 91, 0.18);
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        margin: 0;
        padding: 0.8rem;
        border-bottom: 1px solid rgba(25, 15, 91, 0.09);
        color: var(--navy);
    }

    .search-box input {
        width: 100%;
        min-height: 2.65rem;
        margin: 0;
        padding: 0.55rem 0.7rem;
        border: 0;
        border-radius: 0.65rem;
        outline: 0;
        color: var(--ink);
        background: #f7f5ff;
        font: inherit;
    }

    .option-list {
        max-height: min(20rem, 48vh);
        overflow-y: auto;
        padding: 0.45rem;
        overscroll-behavior: contain;
    }

    .option-group {
        padding: 0.75rem 0.75rem 0.4rem;
        color: var(--pink);
        font-size: 0.67rem;
        font-weight: 850;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    .select-option {
        width: 100%;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.75rem;
        padding: 0.78rem;
        border: 0;
        border-radius: 0.75rem;
        color: var(--ink);
        text-align: left;
        background: transparent;
        font: inherit;
        cursor: pointer;
    }

    .select-option:hover,
    .select-option:focus-visible {
        outline: 0;
        background: #f3f0ff;
    }

    .select-option.selected {
        color: var(--navy);
        background: rgba(253, 202, 64, 0.18);
    }

    .select-option:disabled {
        color: #a29dad;
        cursor: not-allowed;
        opacity: 0.64;
    }

    .option-icon {
        flex: 0 0 auto;
        font-family: "Twemoji Country Flags", "Raleway", sans-serif;
        font-size: 1.15rem;
    }

    .option-copy {
        min-width: 0;
        display: grid;
        gap: 0.15rem;
    }

    .option-copy strong {
        overflow-wrap: anywhere;
        font-size: 0.9rem;
        font-weight: 700;
    }

    .option-copy small {
        color: #716b86;
        font-size: 0.75rem;
    }

    .select-option > i {
        color: var(--pink);
        font-size: 0.75rem;
    }

    .empty-state {
        margin: 0;
        padding: 1.35rem;
        color: #716b86;
        text-align: center;
        font-size: 0.88rem;
    }

    @media (max-width: 680px) {
        .select-popover {
            position: fixed;
            top: auto;
            right: 0.75rem;
            bottom: 0.75rem;
            left: 0.75rem;
            z-index: 70;
            border-radius: 1.25rem;
            box-shadow: 0 1.5rem 4rem rgba(8, 4, 40, 0.32);
        }

        .option-list {
            max-height: min(24rem, 58vh);
        }

        .select-option {
            min-height: 3.2rem;
        }
    }
</style>
