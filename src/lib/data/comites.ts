export type Comite = {
    slug: string;
    claveRegistro: string;
    siglas: string;
    nombre: string;
    nombreTarjeta?: string;
    nombreModal?: string;
    idiomaTarjeta: string;
    idiomaModal: string;
    topicos: string[];
    horario: string;
    imagen: string;
    manual: string;
    modalidades: ("individual" | "pareja")[];
    cantidadImagenes: number;
    delegacionesAgrupadas?: boolean;
    tiposSoloIndividual?: string[];
};

export const comites: Comite[] = [
    {
        slug: "sochum",
        claveRegistro: "sochum",
        siglas: "SOCHUM",
        nombre: "Tercera Comisión de la Asamblea General referente a lo Social, Cultural, Humanitario y de Derechos Humanos",
        nombreTarjeta: "Tercera Comisión de la Asamblea General",
        idiomaTarjeta: "Bilingue",
        idiomaModal: "Español/Inglés",
        topicos: [
            "Medidas para reducir los casos de apatridia, un seguimiento al Plan de Acción Mundial 2014-2024 adoptado por ACNUR.",
            "Estrategias para promover el derecho a la privacidad en la era digital, un seguimiento a la Resolución 68/167 adoptada por la Asamblea General."
        ],
        horario: "Matutino (9 am a 2 pm)",
        imagen: "/assets/img/comites/sochum/bg.webp",
        manual: "/assets/manuales/sochum.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 5
    },
    {
        slug: "onu-sida",
        claveRegistro: "onu_sida",
        siglas: "ONU SIDA",
        nombre: "Programa Conjunto de las Naciones Unidas para el VIH-SIDA",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Estrategias para brindar un acceso justo a los servicios de salud a las personas trabajadoras sexuales seropositivas.",
            "Estrategias para garantizar a mujeres seropositivas la terapia antirretroviral durante y después del embarazo."
        ],
        horario: "Matutino (9 am a 2 pm)",
        imagen: "/assets/img/comites/onu_sida/bg.webp",
        manual: "/assets/manuales/onu-sida.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 5
    },
    {
        slug: "onu-habitat",
        claveRegistro: "onu_habitat",
        siglas: "ONU-Hábitat",
        nombre: "Programa de las Naciones Unidas para los Asentamientos Humanos",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Estrategias de prevención para la urbanización acelerada con el fin de mejorar la calidad de vida en los asentamientos humanos.",
            "Acciones para combatir la falta de accesibilidad, seguridad y adaptación en la infraestructura urbana para la autonomía de las personas con discapacidad."
        ],
        horario: "Matutino (9 am a 2 pm)",
        imagen: "/assets/img/comites/onu_habitat/bg.webp",
        manual: "/assets/manuales/onu-habitat.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 5
    },
    {
        slug: "unrwa",
        claveRegistro: "unrwa",
        siglas: "UNRWA",
        nombre: "Agencia de las Naciones Unidas para los Refugiados de Palestina en Oriente Próximo",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Medidas para la protección de las garantías humanitarias y civiles en los Territorios Palestinos Ocupados derivada de la privación de recursos esenciales."
        ],
        horario: "Vespertino (3 pm a 8 pm)",
        imagen: "/assets/img/comites/unrwa/bg.webp",
        manual: "/assets/manuales/unrwa.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 4
    },
    {
        slug: "cumbre-del-futuro",
        claveRegistro: "cumbre_futuro",
        siglas: "Cumbre",
        nombre: "Cumbre del Futuro",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Consolidación de un nuevo Pacto para el Futuro para responder a los desafíos globales del siglo XX."
        ],
        horario: "Vespertino (3 pm a 8 pm)",
        imagen: "/assets/img/comites/cumbre_futuro/bg.webp",
        manual: "/assets/manuales/cumbre-del-futuro.pdf",
        modalidades: ["individual"],
        cantidadImagenes: 4,
        delegacionesAgrupadas: true
    },
    {
        slug: "wwf",
        claveRegistro: "wwf",
        siglas: "WWF",
        nombre: "World Wildlife Fund for Nature",
        idiomaTarjeta: "English",
        idiomaModal: "English",
        topicos: [
            "Measures to strengthen the regulation and traceability of wildlife trade and its biological derivatives.",
            "Actions to safeguard genetic diversity and ensure equitable access to genetic resources, addressing the accelerating loss of ecological variety."
        ],
        horario: "Vespertino (3 pm a 8 pm)",
        imagen: "/assets/img/comites/wwf/bg.webp",
        manual: "/assets/manuales/wwf.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 5
    },
    {
        slug: "crisis",
        claveRegistro: "crisis",
        siglas: "Crisis",
        nombre: "Crisis Futura",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Año 2076: evitar un conflicto armado en una sociedad que empieza a renacer."
        ],
        horario: "Vespertino (3 pm a 8 pm)",
        imagen: "/assets/img/comites/crisis/bg.webp",
        manual: "/assets/manuales/crisis.pdf",
        modalidades: ["individual"],
        cantidadImagenes: 4
    },
    {
        slug: "fia",
        claveRegistro: "fia",
        siglas: "FIA",
        nombre: "Federación Internacional del Automóvil",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Medidas para garantizar la participación de las mujeres en deportes automovilísticos para la promoción de la igualdad y eliminación de la brecha de género."
        ],
        horario: "Vespertino (3 pm a 8 pm)",
        imagen: "/assets/img/comites/fia/bg.webp",
        manual: "/assets/manuales/fia.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 4,
        delegacionesAgrupadas: true,
        tiposSoloIndividual: ["pilotos"]
    },
    {
        slug: "fhcm",
        claveRegistro: "fhcm",
        siglas: "FHCM",
        nombre: "Federación de Alta Costura y Moda",
        idiomaTarjeta: "Español",
        idiomaModal: "Español",
        topicos: [
            "Estrategias para mitigar los efectos sociales y económicos derivados de las condiciones laborales en la industria de la moda."
        ],
        horario: "Matutino (9 am a 2 pm)",
        imagen: "/assets/img/comites/fhcm/bg.webp",
        manual: "/assets/manuales/fhcm.pdf",
        modalidades: ["individual", "pareja"],
        cantidadImagenes: 4,
        delegacionesAgrupadas: true,
        tiposSoloIndividual: ["disenadores_emergentes"]
    }
];

export function getHorarioComite(siglas: string) {
    return comites.find((comite) => comite.siglas === siglas)?.horario ?? "";
}

export function getComitePorSiglas(siglas: string) {
    return comites.find((comite) => comite.siglas === siglas);
}

export function getComitePorSlug(slug: string) {
    return comites.find((comite) => comite.slug === slug);
}

export function getNombreTarjetaComite(comite: Comite) {
    return comite.nombreTarjeta ?? comite.nombre;
}

export function getNombreModalComite(comite: Comite) {
    return comite.nombreModal ?? comite.nombre;
}
