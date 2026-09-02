import type { PageLoad } from "./$types";
import { registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `Recursos | ${registroConfig.edicion}`,
        description: `Los comités, manuales y recursos para participantes del ${registroConfig.edicion} estarán disponibles próximamente.`
    };
};
