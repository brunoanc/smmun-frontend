import type { PageLoad } from "./$types";
import { nombreEdicion, registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `Registro confirmado | ${registroConfig.edicion}`,
        description: `Confirmación de registro para ${nombreEdicion}.`
    };
};
