// Topics transcribed from Comites ValladolidMUN.pdf, pages 4–9.
const committeeTopics: Record<string, string> = {
    UNESCO: 'Estrategias para garantizar el acceso a la educación de las mujeres en medio oriente mediante mecanismos internacionales de protección y educación alternativa',
    CPAZ: 'Consolidación de la participación juvenil en procesos de mediación política y la creación de marcos de gobernanza en la transición posconflicto.',
    CPI: 'El Fiscal VS. Benjamin Netanyahu',
    MESECVI: 'Estrategias para fortalecer la implementación y seguimiento de la Ley Modelo Interamericana para Prevenir, Sancionar y Erradicar la Muerte Violenta de Mujeres y Niñas (Femicidio/Feminicidio).',
    OIT: 'Acciones para fortalecer el acceso a oportunidades laborales dignas, seguras y compatibles con el desarrollo profesional en la juventud.',
    ONUSIDA: 'Estrategias para garantizar el acceso equitativo a herramientas de prevención y tratamiento del VIH en adolescencias y juventudes en situación de vulnerabilidad.'
};

export function getValladolidCommitteeTopic(committee: string): string | undefined {
    const key = committee.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return committeeTopics[key];
}
