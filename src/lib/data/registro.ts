import delegacionesUntyped from "./delegaciones.json";
import { comites, getComitePorSiglas } from "./comites";

export interface Delegacion {
    nombre: string;
    abreviacion: string;
    emoji: string;
    descripcion?: string;
}

export interface DelegacionGrupo {
    [tipo: string]: Delegacion[];
}

export type Delegaciones = Record<string, Delegacion[] | DelegacionGrupo>;

export const delegaciones = delegacionesUntyped as Delegaciones;

const delegacionTiposLabels: Record<string, string> = {
    sponsors: "Sponsors",
    escuderias: "Escuderías",
    pilotos: "Pilotos",
    casas: "Casas de Alta Costura",
    sindicatos: "Sindicatos",
    disenadores_emergentes: "Diseñadoras y empresas emergentes",
    activistas: "Activistas",
    ongs: "Organizaciones No Gubernamentales",
    agencias_onu: "Agencias de las Naciones Unidas",
    jefes_estado: "Jefes de Estado"
};

const whatsappMessage = `Hola, mi *nombre* es:

*Tengo dudas sobre:*
[] Delegación oficial
[] Datos personales
[] Comités y/o países
[] Proceso de pago
`;

const comprobanteMimeTypesByExtension: Record<string, readonly string[]> = {
    ".pdf": ["application/pdf"],
    ".png": ["image/png"],
    ".jpg": ["image/jpeg", "image/jpg", "image/pjpeg"],
    ".jpeg": ["image/jpeg", "image/jpg", "image/pjpeg"],
    ".webp": ["image/webp"],
    ".heic": ["", "application/octet-stream", "image/heic", "image/heif", "image/heic-sequence"],
    ".heif": ["", "application/octet-stream", "image/heif", "image/heic", "image/heif-sequence"]
};

const whatsappNumber = "529999033025";

// Fuente única para los datos que cambian entre convocatorias y ediciones.
export const registroConfig = {
    edicion: "SMMUN 2027",
    anio: 2027,
    lema: "Our Spark",
    nombreOrganizacion: "Modelo de Naciones Unidas del Sureste Mexicano",

    costos: {
        individual: 320,
        codelegacionPersona: 300,
        delegacionOficialPersona: 280,
        moneda: "MXN"
    },

    pago: {
        banco: "Mifel",
        clabe: "042 180 01004083209 6",
        imagen: "/assets/img/registro/mifel.png"
    },

    participantes: {
        edadMinima: 11,
        edadMaxima: 26,
        minimoDelegacionOficial: 4
    },

    comprobante: {
        maximoMB: 5,
        maximoBytes: 5 * 1024 * 1024,
        formatos: "PDF, PNG, JPG, WEBP, HEIC o HEIF",
        accept: ".pdf,.png,.jpg,.jpeg,.webp,.heic,.heif",
        mimeTypesPorExtension: comprobanteMimeTypesByExtension
    },

    contactos: {
        secretariaGeneral: "secretariageneral@smmun.com",
        contacto: "contacto@smmun.com",
        finanzas: "secretariadefinanzas@smmun.com",
        reglamento: "secretariageneral.smmun@gmail.com",
        whatsapp: {
            numero: whatsappNumber,
            visible: "+52 999 903 3025",
            mensaje: whatsappMessage,
            url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
        }
    },

    endpoints: {
        delegaciones: "https://api.smmun.com/registro/delegaciones",
        faculty: "https://api.smmun.com/registro/faculty"
    }
} as const;

export const nombreEdicion = `${registroConfig.edicion} — ${registroConfig.lema}`;
export const etiquetaEdicion = `${registroConfig.edicion} · ${registroConfig.lema}`;

export function formatoPrecio(cantidad: number) {
    return `$${cantidad.toLocaleString()} ${registroConfig.costos.moneda}`;
}

export function getClaveRegistroComite(siglas: string) {
    return getComitePorSiglas(siglas)?.claveRegistro ?? "";
}

export function getComitePorClaveRegistro(claveRegistro: string) {
    return comites.find((comite) => comite.claveRegistro === claveRegistro);
}

export function getDelegacionTipoLabel(claveRegistro: string, tipo: string, modalidad?: string) {
    const baseLabel = delegacionTiposLabels[tipo] ?? tipo;

    if (modalidad === "pareja" && getComitePorClaveRegistro(claveRegistro)?.tiposSoloIndividual?.includes(tipo)) {
        return `${baseLabel} (solo disponible en individual)`;
    }

    return baseLabel;
}

export function isDelegacionTipoDisponibleEnModalidad(claveRegistro: string, tipo: string, modalidad?: string) {
    return !(modalidad === "pareja" && getComitePorClaveRegistro(claveRegistro)?.tiposSoloIndividual?.includes(tipo));
}

export function obtenerTipoDelegacion(claveRegistro: string, nombreDelegacion: string) {
    if (!getComitePorClaveRegistro(claveRegistro)?.delegacionesAgrupadas) {
        return undefined;
    }

    const grupos = delegaciones[claveRegistro] as DelegacionGrupo | undefined;

    if (!grupos) {
        return undefined;
    }

    for (const [tipo, lista] of Object.entries(grupos)) {
        if (lista.some((delegacion) => delegacion.nombre === nombreDelegacion)) {
            return tipo;
        }
    }

    return undefined;
}

export function permiteModalidadComite(siglas: string, modalidad: string | undefined) {
    if (!modalidad) return true;
    return getComitePorSiglas(siglas)?.modalidades.includes(modalidad as "individual" | "pareja") ?? false;
}
