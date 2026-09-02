import type { PageLoad } from "./$types";
import { registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `¿Quiénes somos? | ${registroConfig.edicion}`,
        description: "Conoce la misión, visión e historia del Modelo de Naciones Unidas del Sureste Mexicano."
    };
};
