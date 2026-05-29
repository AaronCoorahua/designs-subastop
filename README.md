# designs-subastop

Bocetos y previews visuales del upgrade de UI de VMC Subastas (Voyager). Son archivos **HTML estáticos** — se abren en el navegador, no necesitan build.

## Carpeta `pages/upgrade/`

Es el **catálogo de componentes del upgrade**. Así está dividida:

```
pages/upgrade/
├── index.html        ← el catálogo: junta todos los componentes en una sola página
├── desktop/          ← cada componente en versión escritorio (1 archivo = 1 componente)
└── mobile/           ← los mismos componentes pero en versión móvil
```

### `index.html` — el catálogo
La página principal. Lista cada componente dentro de un `<iframe>` que carga el HTML real desde `desktop/` o `mobile/`. Aquí ves todo junto, en orden, con su título y un link a la fuente.

### `desktop/` — un archivo por componente
Cada `.html` es un componente **autocontenido** (su propio HTML + CSS + JS, sin dependencias). Por ejemplo:

- `header.html`, `sidebar.html`, `login-form.html`, `wallet.html`, `recommended.html`…
- `consola.html`, `consola_v2.html`, `consola_v3.html` … `consola_v7.html` → **iteraciones** del mismo componente "Consola". El número es la versión; la más alta es la más reciente. Cada `vN` explora una idea distinta (cards, gamificación, mecánica de subasta, etc.).

Dos helpers compartidos:
- `_iframe-resize.js` → hace que el iframe del catálogo se ajuste solo a la altura del componente.
- `variant-filter.js` → filtra entre variantes (cinematic vault / iridescent) dentro de un componente.

### `mobile/`
La versión móvil de los componentes que ya tienen adaptación (header, login, register, forgot-password).

## Cómo agregar un componente nuevo
1. Crea el `.html` en `desktop/` (o `mobile/`).
2. Registra una tarjeta nueva en `index.html` apuntando a ese archivo, y sube el contador de la pestaña.

> Las imágenes de referencia viven en `images/` y `*/original.png`; los iconos/logos en la raíz (`logo-preview.png`).
