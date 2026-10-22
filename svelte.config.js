import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        csp: {
            directives: {
                "default-src": ["self"],
                "base-uri": ["self"],
                "object-src": ["none"],
                "script-src": ["self", "https://w.behold.so", "https://static.cloudflareinsights.com"],
                "style-src": ["self", "unsafe-inline"],
                "img-src": ["self", "data:", "https:"],
                "font-src": ["self", "data:"],
                "connect-src": ["self", "https://*.behold.so", "https://cloudflareinsights.com"],
                "frame-src": ["https://script.google.com", "https://*.googleusercontent.com"]
            }
        },
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: "build",
            assets: "build",
            fallback: undefined,
            precompress: false,
            strict: true
        })
    }
};

export default config;
