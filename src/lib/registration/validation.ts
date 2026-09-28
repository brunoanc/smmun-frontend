import { MODELO_SCHOOL, type Participant } from './apps-script';

export type ValidationIssue = { field: string; message: string; step: number };

export function isValidEmail(value: string): boolean {
    const email = value.trim();
    if (email.length > 254) return false;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    return local.length <= 64 && /^[A-Z0-9_%+.-]+$/i.test(local) && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..')
        && domain.includes('.') && domain.split('.').every(label => /^[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i.test(label) && label.length <= 63)
        && /^[A-Z]{2,}$/i.test(domain.split('.').slice(-1)[0] || '');
}

export function isValidPhone(value: string): boolean {
    const phone = value.trim();
    const digits = phone.replace(/\D/g, '');
    return /^\+?[0-9 ().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15 && phone.length <= 40;
}

export function validateParticipant(participant: Participant, onlyStep?: number): ValidationIssue | undefined {
    const groups: [number, string, string][] = [
        [0, 'nombres', 'Nombres'], [0, 'primerApellido', 'Primer apellido'], [0, 'pronombres', 'Pronombres'],
        [0, 'correo', 'Correo electrónico'], [0, 'edad', 'Edad'], [0, 'telefono', 'Número telefónico'], [0, 'escuela', 'Escuela o institución'],
        [1, 'contactoEmergencia', 'Contacto de emergencia'], [1, 'parentesco', 'Parentesco'], [1, 'telefonoEmergencia', 'Teléfono de emergencia'],
        [2, 'delegacionOficial', 'Delegación oficial']
    ];
    if (participant.delegacionOficial === 'Sí') groups.push([2, 'faculty', 'Nombre del Faculty'], [2, 'correoFaculty', 'Correo del Faculty']);
    if (participant.escuela === MODELO_SCHOOL) {
        groups.push([0, 'matricula', 'Matrícula']);
        if ((onlyStep === undefined || onlyStep === 2) && participant.delegacionOficial !== 'No')
            return { field: 'escuela', step: 0, message: 'Estudiantes de Universidad Modelo Valladolid no pueden registrarse como delegación oficial.' };
    }
    const value = (field: string) => String(participant[field] ?? '').trim();
    for (const [step, field, label] of groups) {
        if (onlyStep !== undefined && onlyStep !== step) continue;
        let message = '';
        if (!value(field)) message = `Completa el campo ${label}.`;
        else if (['correo', 'correoFaculty'].includes(field) && !isValidEmail(value(field))) message = `Introduce un correo válido en ${label}, por ejemplo nombre@dominio.com.`;
        else if (['telefono', 'telefonoEmergencia'].includes(field) && !isValidPhone(value(field))) message = `${label} debe contener entre 7 y 15 dígitos, con código de país si corresponde.`;
        else if (field === 'matricula' && !/^[A-Z0-9-]{1,50}$/i.test(value(field))) message = 'La matrícula debe contener hasta 50 letras, números o guiones.';
        else if (field === 'edad' && (!/^\d+$/.test(value(field)) || Number(value(field)) < 10 || Number(value(field)) > 100)) message = 'Introduce una edad entera entre 10 y 100 años.';
        else if (field === 'pronombres' && !['Él', 'Ella', 'Elle', 'Prefiero no decirlo'].includes(value(field))) message = 'Selecciona una opción de pronombres válida.';
        else if (field === 'delegacionOficial' && !['Sí', 'No'].includes(value(field))) message = 'Selecciona si formas parte de una delegación oficial.';
        else if (value(field).length > (['correo', 'correoFaculty'].includes(field) ? 254 : 200)) message = `${label} es demasiado largo.`;
        if (message) return { field, message, step };
    }
    for (const [field, step, limit] of [['segundoApellido', 0, 200], ['alergias', 1, 2000]] as const) {
        if ((onlyStep === undefined || onlyStep === step) && value(field).length > limit) return { field, step, message: 'El texto ingresado es demasiado largo.' };
    }
}

export function validateReceipt(file: File | null): string {
    if (!file) return 'Adjunta tu comprobante de pago.';
    if (file.size === 0 || file.size > 5 * 1024 * 1024) return 'El comprobante debe tener contenido y pesar como máximo 5 MB.';
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) return 'Selecciona un archivo PDF, JPG o PNG.';
    return '';
}
