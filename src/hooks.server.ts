import { minify } from "html-minifier-terser";
import { dev, building } from "$app/environment";

const minification_options = {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    useShortDocType: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
}

export async function handle({ event, resolve }) {
    let response = resolve(event)

    if (!dev && building) {
        response = await resolve(event, {
            transformPageChunk: ({ html }) => minify(html, minification_options)
        });
    }

    return response;
}
