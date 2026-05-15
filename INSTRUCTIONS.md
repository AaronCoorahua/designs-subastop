# designs-subastop — Instrucciones

## Estructura

```
designs-subastop/
├── index.html              ← landing (no editar salvo nuevo destino)
├── components/
│   ├── variant-filter.js   ← script compartido (vive en la raíz de components/)
│   ├── desktop/            ← componentes de vistas desktop
│   │   └── <nombre>/
│   │       ├── claude.html           ← componente sin variantes (o variante por defecto)
│   │       └── <nombre-variante>/    ← variante visual: el componente en otro contexto
│   │           └── claude.html       ← misma API, distinto estado/estilo
│   └── mobile/             ← componentes de vistas mobile (misma estructura)
│       └── <nombre>/
│           └── claude.html
└── pages/
    ├── catalog/            ← grid del catálogo con tabs Desktop | Mobile
    │   ├── index.html
    │   └── grouped.html
    └── previews/
        ├── index.html      ← landing de previews con tabs Desktop | Mobile
        ├── desktop/        ← páginas completas armadas con componentes desktop
        │   └── <pagina>/
        │       └── index.html
        └── mobile/         ← páginas completas armadas con componentes mobile
            └── <pagina>/
                └── index.html
```

> `variant-filter.js` permanece en `components/` (no se duplica). Desde
> `components/desktop/<nombre>/claude.html` se referencia con `../../variant-filter.js`
> y desde `components/desktop/<nombre>/<variante>/claude.html` con `../../../variant-filter.js`
> (los paths para `mobile/` son análogos).

---

## Plataforma — Desktop vs Mobile

Voyager separa los diseños por plataforma. Cada componente y cada preview vive bajo
`desktop/` o `mobile/`. El catálogo y el listado de previews tienen un **tab Desktop | Mobile**
que filtra las tarjetas en pantalla y persiste la selección en la URL (`?platform=mobile`).

| ¿Dónde colocar el archivo? | ¿Cómo lo detecta el tab? |
|---|---|
| `components/desktop/<nombre>/claude.html` | El path contiene `/components/desktop/` → tab **Desktop** |
| `components/mobile/<nombre>/claude.html` | El path contiene `/components/mobile/` → tab **Mobile** |
| `pages/previews/desktop/<pagina>/index.html` | El href contiene `/desktop/` → tab **Desktop** |
| `pages/previews/mobile/<pagina>/index.html` | El href contiene `/mobile/` → tab **Mobile** |

**Regla de oro:** un componente mobile NUNCA va a `components/desktop/`, ni viceversa.
Si una vista necesita versión desktop y mobile separadas → dos carpetas, dos `claude.html`.

---

## Qué es una variante

Una **variante** es el mismo componente en un contexto visual distinto: otro estado de subasta,
otra paleta, otra configuración de datos. Se implementa de dos formas:

### A) Variante como subcarpeta (separación total de HTML)
Cuando la variante es tan diferente que tiene su propio HTML completo:
```
components/desktop/detail-card/
├── en vivo/claude.html     ← variante "en vivo"
├── cerrada/claude.html     ← variante "cerrada"
└── negociable/claude.html  ← variante "negociable"
```
Cada `claude.html` es standalone. El catálogo apunta a cada sub-ruta por separado.

### B) Variante como toggle interno (un solo HTML, múltiples vistas)
Cuando las variantes comparten estructura base y se alternan via JS:
```
components/desktop/sidebar/claude.html   ← contiene variante A, B, C internamente
```
El `variant-filter.js` lee `?variant=Nombre` de la URL y muestra/oculta secciones con `data-variant`.
El catálogo registra el path una sola vez y lista los nombres de variantes en `DESIGN_VARIANTS`.

**Regla de elección:** si el HTML cambiaría más del 40% entre variantes → subcarpeta. Si es una prop o toggle → interno.

---

## Crear un componente nuevo

1. **Elegir plataforma:** `components/desktop/<nombre>/` o `components/mobile/<nombre>/`.

2. **Carpeta:** `components/<plataforma>/<nombre>/claude.html`
   Con variante-subcarpeta: `components/<plataforma>/<nombre>/<variante>/claude.html`

3. **variant-filter.js** — incluir al final del `<body>` (paths idénticos para `desktop` y `mobile`):
   ```html
   <!-- componente a 2 niveles: components/<plataforma>/<nombre>/claude.html -->
   <script src="../../variant-filter.js"></script>

   <!-- componente a 3 niveles: components/<plataforma>/<nombre>/<variante>/claude.html -->
   <script src="../../../variant-filter.js"></script>
   ```

4. **Registrar en el catálogo** — editar `pages/catalog/index.html`:

   a. Añadir `<article class="preview-card">` en el `<main>`:
   ```html
   <article class="preview-card">
     <div class="preview-header">
       <div>
         <h2 class="preview-title">Nombre Visible</h2>
         <p class="preview-path">../../components/desktop/<nombre>/claude.html</p>
       </div>
     </div>
     <iframe class="preview-frame"
             src="../../components/desktop/<nombre>/claude.html"
             loading="lazy" title="Nombre Visible"></iframe>
   </article>
   ```
   > `preview-path` debe ser **idéntico** al `src` del iframe — el JS lo usa como índice.
   > El tab Desktop/Mobile se infiere automáticamente del segmento `desktop` o `mobile` en la ruta.

   b. Si tiene variantes internas (tipo B), añadir en `DESIGN_VARIANTS`:
   ```js
   "../../components/desktop/<nombre>/claude.html": [
     "Variante A",
     "Variante B"
   ],
   ```
   > Para variantes-subcarpeta (tipo A): registrar una entrada por subcarpeta, sin entradas en `DESIGN_VARIANTS`.

---

## Crear una página nueva

Las páginas en `pages/previews/<plataforma>/<pagina>/index.html` ensamblan componentes via `<iframe>`.

**Ruta desde `pages/previews/desktop/<pagina>/index.html` a un componente desktop:**
```
../../../../components/desktop/<nombre>/claude.html
```

**Ruta desde `pages/previews/mobile/<pagina>/index.html` a un componente mobile:**
```
../../../../components/mobile/<nombre>/claude.html
```

Pasar variante por query string: `?variant=Nombre%20Variante`

```html
<iframe src="../../../../components/desktop/consola/header/claude.html?variant=Vault%20status"
        scrolling="no" loading="lazy" title="Header"></iframe>
```

Registrar la nueva página en `pages/previews/index.html`:
```html
<a class="preview-card" href="./desktop/<pagina>/index.html">...</a>
<!-- o para mobile -->
<a class="preview-card" href="./mobile/<pagina>/index.html">...</a>
```
> El tab Desktop/Mobile se infiere automáticamente del segmento `desktop` o `mobile` en el href.

---

## Navegación entre secciones

| Desde | Hacia | Ruta |
|---|---|---|
| `pages/catalog/index.html` | Inicio | `../../index.html` |
| `pages/previews/index.html` | Inicio | `../../index.html` |
| `pages/previews/desktop/<pagina>/index.html` | Previews | `../../index.html` |
| `pages/previews/mobile/<pagina>/index.html` | Previews | `../../index.html` |
| `pages/catalog/index.html` | Previews | `../previews/index.html` |

---

## Reglas invariables

| Regla | Detalle |
|---|---|
| `preview-path` = `iframe.src` | El texto visible debe ser idéntico al src |
| No HEX en componentes | Todo color via `var(--token)` OKLCH |
| `variant-filter.js` siempre al final del `<body>` | Ruta relativa según profundidad (2 ó 3 niveles desde la nueva estructura `desktop/`-`mobile/`) |
| Rutas en previews: `../../../../components/<plataforma>/` | Desde `pages/previews/<plataforma>/<pagina>/index.html` |
| Rutas en catalog: `../../components/<plataforma>/` | Desde `pages/catalog/index.html` |
| Plataforma se infiere del path | El segmento `desktop` o `mobile` determina el tab — NO añadir `data-platform` manual |
| Un componente desktop NUNCA vive en `mobile/` | Si una vista necesita ambas, dos carpetas separadas |
| **Variantes apiladas en vertical** | Dentro de cada `claude.html`, las `.preview-cell` se renderizan en una sola columna (`.preview-grid { grid-template-columns: auto; }`). El catálogo embebe el iframe completo, por lo que cada variante aparece **debajo** de la anterior, nunca al costado. |
