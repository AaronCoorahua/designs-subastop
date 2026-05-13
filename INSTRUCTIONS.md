# designs-subastop — Instrucciones

## Estructura

```
designs-subastop/
├── index.html              ← landing (no editar salvo nuevo destino)
├── components/             ← un folder por componente
│   ├── variant-filter.js   ← script compartido de variantes
│   └── <nombre>/
│       ├── claude.html           ← componente sin variantes (o variante por defecto)
│       └── <nombre-variante>/    ← variante visual: el componente en otro contexto
│           └── claude.html       ← misma API, distinto estado/estilo
└── pages/
    ├── catalog/            ← grid del catálogo
    │   ├── index.html
    │   └── grouped.html
    └── previews/           ← páginas completas que componen componentes
        └── <pagina>/
            └── index.html
```

---

## Qué es una variante

Una **variante** es el mismo componente en un contexto visual distinto: otro estado de subasta,
otra paleta, otra configuración de datos. Se implementa de dos formas:

### A) Variante como subcarpeta (separación total de HTML)
Cuando la variante es tan diferente que tiene su propio HTML completo:
```
components/detail-card/
├── en vivo/claude.html     ← variante "en vivo"
├── cerrada/claude.html     ← variante "cerrada"
└── negociable/claude.html  ← variante "negociable"
```
Cada `claude.html` es standalone. El catálogo apunta a cada sub-ruta por separado.

### B) Variante como toggle interno (un solo HTML, múltiples vistas)
Cuando las variantes comparten estructura base y se alternan via JS:
```
components/sidebar/claude.html   ← contiene variante A, B, C internamente
```
El `variant-filter.js` lee `?variant=Nombre` de la URL y muestra/oculta secciones con `data-variant`.
El catálogo registra el path una sola vez y lista los nombres de variantes en `DESIGN_VARIANTS`.

**Regla de elección:** si el HTML cambiaría más del 40% entre variantes → subcarpeta. Si es una prop o toggle → interno.

---

## Crear un componente nuevo

1. **Carpeta:** `components/<nombre>/claude.html`  
   Con variante-subcarpeta: `components/<nombre>/<variante>/claude.html`

2. **variant-filter.js** — incluir al final del `<body>`:
   ```html
   <!-- componente a 1 nivel: components/<nombre>/claude.html -->
   <script src="../variant-filter.js"></script>

   <!-- componente a 2 niveles: components/<nombre>/<variante>/claude.html -->
   <script src="../../variant-filter.js"></script>
   ```

3. **Registrar en el catálogo** — editar `pages/catalog/index.html`:

   a. Añadir `<article class="preview-card">` en el `<main>`:
   ```html
   <article class="preview-card">
     <div class="preview-header">
       <div>
         <h2 class="preview-title">Nombre Visible</h2>
         <p class="preview-path">../../components/<nombre>/claude.html</p>
       </div>
     </div>
     <iframe class="preview-frame"
             src="../../components/<nombre>/claude.html"
             loading="lazy" title="Nombre Visible"></iframe>
   </article>
   ```
   > `preview-path` debe ser **idéntico** al `src` del iframe — el JS lo usa como índice.

   b. Si tiene variantes internas (tipo B), añadir en `DESIGN_VARIANTS`:
   ```js
   "../../components/<nombre>/claude.html": [
     "Variante A",
     "Variante B"
   ],
   ```
   > Para variantes-subcarpeta (tipo A): registrar una entrada por subcarpeta, sin entradas en `DESIGN_VARIANTS`.

---

## Crear una página nueva

Las páginas en `pages/previews/<pagina>/index.html` ensamblan componentes via `<iframe>`.

**Ruta desde `pages/previews/<pagina>/index.html` a un componente:**
```
../../../components/<nombre>/claude.html
```

Pasar variante por query string: `?variant=Nombre%20Variante`

```html
<iframe src="../../../components/consola/header/claude.html?variant=Vault%20status"
        scrolling="no" loading="lazy" title="Header"></iframe>
```

Registrar la nueva página en `pages/previews/index.html`:
```html
<a class="preview-card" href="./<pagina>/index.html">...</a>
```

---

## Navegación entre secciones

| Desde | Hacia | Ruta |
|---|---|---|
| `pages/catalog/index.html` | Inicio | `../../index.html` |
| `pages/previews/index.html` | Inicio | `../../index.html` |
| `pages/previews/consola/index.html` | Previews | `../index.html` |
| `pages/catalog/index.html` | Previews | `../previews/index.html` |

---

## Reglas invariables

| Regla | Detalle |
|---|---|
| `preview-path` = `iframe.src` | El texto visible debe ser idéntico al src |
| No HEX en componentes | Todo color via `var(--token)` OKLCH |
| `variant-filter.js` siempre al final del `<body>` | Ruta relativa según profundidad (1 o 2 niveles) |
| Rutas en pages: `../../../components/` | Desde `pages/previews/<sub>/index.html` |
| Rutas en catalog: `../../components/` | Desde `pages/catalog/index.html` |
