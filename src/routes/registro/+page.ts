import type { PageLoad } from "./$types";
import { registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `Registro | ${registroConfig.edicion}`,
        description: `Consulta próximamente las convocatorias de delegaciones, faculty y staff de ${registroConfig.edicion}.`
    };
};
