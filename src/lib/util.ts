// Funciones para manejar cookies
let today = new Date();
let expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000);

function setCookie(name: string, value: string) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; SameSite=Strict; path=/; expires=" + expiry.toUTCString();
}

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop()!.split(";").shift()!);
    }
}

// Actualizar valor guardado en cookies
export function onChangeSaveCookie(ev: Event) {
    let input = ev.target as HTMLInputElement;
    setCookie(input.name, input.value);
}

// Reestablecer los valores de los inputs en las cookies
export function resetValuesFromCookies(elements: HTMLFormControlsCollection) {
    for (const el of elements) {
        if (!["INPUT", "SELECT"].includes(el.nodeName)) continue;

        const input = el as HTMLInputElement;
        if (!input.name) continue;

        const saved = getCookie(input.name);
        if (saved) {
            input.value = saved;

            if (el.nodeName == "INPUT") {
                el.dispatchEvent(new Event("input", { bubbles: true }));
            }
            else {
                el.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }
}

// Validación de edad
export function validateNumInput(edad: string | undefined, min: number, max: number) {
    if (!edad || edad.length == 0) {
        return true;
    }

    try {
        let num = parseInt(edad);
        if (num >= min && num <= max) {
            return true;
        }
        else {
            return false;
        }
    }
    catch {
        return false;
    }
}
