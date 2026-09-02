import type { PageLoad } from "./$types";
import { nombreEdicion, registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `Registro de Faculty | ${registroConfig.edicion}`,
        description: `Formulario de registro de Faculty Advisors para ${nombreEdicion}.`
    };
};
