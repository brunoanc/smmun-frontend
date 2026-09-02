import type { Action } from "svelte/action";
import intlTelInput from "intl-tel-input";
import { es } from "intl-tel-input/locale";

// Acción para validar celulares con intl
export const intlPhone: Action<HTMLInputElement> = (node, name) => {
    // Inicializar intl
    const intl = intlTelInput(node, {
        loadUtils: () => import("intl-tel-input/utils"),
        initialCountry: "mx",
        countryNameLocale: "es",
        uiTranslations: es,
        hiddenInputs: function() {
            return {
                phone: node.dataset.name ?? node.name
            };
        }
    });

    // Función para validar
    function validarCelular() {
        node.value = node.value.replace(/[^\d\(\)\s\+\-]/gi, "");
        let validity = intl.isValidNumber();

        if (validity === null || validity) {
            node.setCustomValidity("");
            node.classList.remove("is-invalid");
        }
        else if (node.value) {
            node.setCustomValidity("El número de celular no es válido.");
            node.classList.add("is-invalid");
        }
    };

    // Agregar como event handler y validar de una vez
    node.addEventListener("input", validarCelular);
    validarCelular();

    // Agregar estilos CSS con form-control focus-ring focus-ring-danger al search input
    for (const el of node.parentElement!.getElementsByClassName("iti__search-input")) {
        el.classList.add("form-control", "focus-ring", "focus-ring-danger");
    }

    // Agregar feedback cuando el celular no es válido
    const invalidFeedbackCelular = document.createElement("div");
    invalidFeedbackCelular.innerHTML = "El número de celular no es válido.";
    invalidFeedbackCelular.classList.add("invalid-feedback");

    for (const el of node.parentElement!.getElementsByClassName("iti__tel-input")) {
        el.parentNode?.insertBefore(invalidFeedbackCelular, el.nextSibling);
    }

    // Destruir
    return {
        destroy() {
            node.removeEventListener("input", validarCelular);
            intl.destroy();
        }
    };
};
