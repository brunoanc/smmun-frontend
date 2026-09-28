export const MODELO_SCHOOL = 'Universidad Modelo Valladolid';

export type Participant = Record<string, string>;
export type Preference = { comite: string; paises: string[] };
export type Registration = {
    requestId: string;
    folio: string;
    participante: Participant;
    preferencias: Preference[];
    pago: { monto: string; archivoBase64?: string; nombreArchivo?: string; mimeType?: string };
};

export function generateFolio(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    return 'V26-' + Array.from(bytes, byte => alphabet[byte & 31]).join('');
}

// HtmlService runs inside a Google sandbox. The bridge announces its actual
// window, so requests target that window instead of the outer Google iframe.
export function connectAppsScript(url: string) {
    const endpoint = new URL(url);
    if (endpoint.origin !== 'https://script.google.com' || !endpoint.pathname.endsWith('/exec')) {
        throw new Error('La conexión de registro no está configurada correctamente.');
    }
    const channel = crypto.randomUUID();
    endpoint.searchParams.set('bridge', '1');
    endpoint.searchParams.set('origin', location.origin);
    endpoint.searchParams.set('channel', channel);
    let peer: Window | null = null;
    let peerOrigin = '';
    let resolveReady: () => void;
    let rejectReady: (error: Error) => void;
    const pending = new Map<string, { resolve: (value: unknown) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>();
    const ready = new Promise<void>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
    const timer = setTimeout(() => rejectReady(new Error('No se pudo conectar con el registro. Intenta cargar de nuevo.')), 30000);
    function receive(event: MessageEvent) {
        const trusted = event.origin === 'https://script.google.com' || /^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(event.origin);
        const message = event.data;
        if (!trusted || !message || message.channel !== channel) return;
        if (message.type === 'ready' && !peer) {
            peer = event.source as Window;
            peerOrigin = event.origin;
            clearTimeout(timer);
            resolveReady();
        }
        if (event.source !== peer || message.type !== 'result') return;
        const request = pending.get(message.id);
        if (!request) return;
        clearTimeout(request.timer);
        pending.delete(message.id);
        if (message.error) request.reject(new Error(message.error));
        else request.resolve(message.result);
    }
    window.addEventListener('message', receive);
    const iframe = document.createElement('iframe');
    iframe.title = 'Conexión de registro';
    iframe.hidden = true;
    iframe.src = endpoint.href;
    document.body.appendChild(iframe);
    return {
        async call<T>(action: 'countries' | 'register', payload?: Registration, receipt?: File): Promise<T> {
            await ready;
            if (action === 'register') {
                if (!payload) throw new Error('Registro incompleto.');
                if (payload.participante.escuela !== MODELO_SCHOOL) {
                    if (!receipt) throw new Error('Adjunta tu comprobante de pago.');
                    payload = { ...payload, pago: { ...payload.pago,
                        archivoBase64: await readReceipt(receipt), nombreArchivo: receipt.name, mimeType: receipt.type
                    } };
                }
            }
            const id = crypto.randomUUID();
            return new Promise<T>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error('No se recibió confirmación. Puedes intentar nuevamente con el mismo registro.'));
                }, 120000);
                pending.set(id, { resolve: (value) => resolve(value as T), reject, timer: timeout });
                peer!.postMessage({ channel, id, action, payload }, peerOrigin);
            });
        },
        destroy() {
            clearTimeout(timer);
            rejectReady(new Error('Conexión cerrada.'));
            window.removeEventListener('message', receive);
            iframe.remove();
            for (const request of pending.values()) {
                clearTimeout(request.timer);
                request.reject(new Error('Conexión cerrada.'));
            }
            pending.clear();
        }
    };
}

// Send a plain data object through Google's RPC rather than its postform upload.
export function readReceipt(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string'
            ? resolve(reader.result) : reject(new Error('No se pudo leer el comprobante.'));
        reader.onerror = () => reject(new Error('No se pudo leer el comprobante. Selecciónalo nuevamente.'));
        reader.onabort = () => reject(new Error('Se canceló la lectura del comprobante.'));
        reader.readAsDataURL(file);
    });
}
