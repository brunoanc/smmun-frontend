import { sveltekit } from "@sveltejs/kit/vite";
import { svelteSitemap } from 'svelte-sitemap/vite';
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        sveltekit(),
        svelteSitemap({ domain: 'https://smmun.com', resetTime: true, changeFreq: 'monthly' })
    ]
});
