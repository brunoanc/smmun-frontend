import type { PageLoad } from "./$types";
import { registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `Error de registro | ${registroConfig.edicion}`,
        description: `No fue posible completar el registro para ${registroConfig.edicion}.`
    };
};
