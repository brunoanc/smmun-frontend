# SMMUN 2027 - Our Spark

[🌐 smmun.com](https://smmun.com)

Página web oficial del Modelo de Naciones Unidas del Sureste Mexicano para la edición 2027, desarrollado con SvelteKit.

## Plataforma

Este repositorio contiene únicamente el frontend estático.

La infraestructura, backend, CI/CD y servicios en la nube se administran en [`brunoanc/smmun-gcp`](https://github.com/brunoanc/smmun-gcp).

## Desarrollo

Requiere Node.js `^20.19.0` o `>=22.12.0`.

```bash
npm ci
npm run dev
```

Antes de publicar cambios:

```bash
npm run check
npm run build
```

Para revisar la compilación:

```bash
npm run preview
```

## Estructura

```text
src/
├── lib/
│   ├── components/
│   ├── data/
│   └── styles/
└── routes/

static/
└── assets/
    ├── fonts/
    ├── img/
    └── pdf/
```

## Configuración

La configuración general de la edición se encuentra en:

* `src/lib/data/registro.ts`: edición, precios, contactos y registro.
* `src/lib/data/comites.ts`: comités, tópicos, horarios y recursos.
* `src/lib/data/delegaciones.json`: delegaciones disponibles.

## Formularios de registro

Los antiguos formularios de registro permanecen bajo `src/routes/registro/` como `page.old.svelte`.
