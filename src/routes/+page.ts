import type { PageLoad } from "./$types";
import { registroConfig } from "$lib/data/registro";

export const load: PageLoad = () => {
    return {
        title: `${registroConfig.edicion} | ${registroConfig.lema}`,
        description: `${registroConfig.edicion}, el ${registroConfig.nombreOrganizacion}. Descubre ${registroConfig.lema} y enciende tu voz.`
    };
};
