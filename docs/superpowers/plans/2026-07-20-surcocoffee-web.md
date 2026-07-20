# Sitio web Surco Coffee — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar la landing/tienda de Surco Coffee (réplica de `ProposalMarket.dc.html`) como sitio estático editable, hosteado en GitHub Pages con dominio `surcocoffee.com`.

**Architecture:** HTML/CSS/JS estático sin build. `js/config.js` (global `window.SURCO`) contiene todos los datos editables por el cliente. `js/cart-core.js` (módulo ES) contiene la lógica pura del carrito (probada con `node --test`). `js/tienda.js` (módulo ES) lee `window.SURCO`, importa `cart-core` y pinta/actualiza el DOM (catálogo, carrito, carrusel). `index.html` tiene la estructura y las secciones estáticas. `css/styles.css` tiene los tokens del sistema "Organic" + estilos.

**Tech Stack:** HTML5, CSS3 (custom properties, container queries), JavaScript ES modules (vanilla, sin dependencias en runtime). Node.js 24 + `node --test` para pruebas (solo desarrollo). `sharp-cli` vía `npx` para optimizar imágenes. GitHub Pages para hosting.

## Global Constraints

- **Sin framework ni paso de build** en el sitio publicado. Solo archivos estáticos servidos tal cual.
- **Sin dependencias de runtime** (nada de `node_modules` requerido para que el sitio funcione). Dependencias solo para dev (test + optimización de imágenes) vía `npx`.
- **Todo dato de negocio editable** (productos, precios, tamaños, contactos, imágenes del hero) vive en `js/config.js`. La lógica (`tienda.js`, `cart-core.js`) no se edita para cambios de contenido.
- **Idioma:** español (Colombia). Precios en COP con formato `$25.000` (`toLocaleString('es-CO')`).
- **Número de WhatsApp de pedidos:** `573332485064` (formato internacional, sin `+`), tomado de `config.js`.
- **Fidelidad visual:** el sitio debe verse igual a `ProposalMarket.dc.html`. Fuente de verdad del markup/estilos: `<scratchpad>/ProposalMarket.dc.html` y los tokens en la Tarea 1.
- **Ruta scratchpad de referencia:** `C:\Users\Ed\AppData\Local\Temp\claude\c--Users-Ed-Dev-surcocoffee\c4404886-34e6-4df7-96ff-a334374cd22a\scratchpad\ProposalMarket.dc.html`
- **Proyecto Claude Design (para imágenes):** `projectId=03881f96-d6cf-4f04-8645-8d2eb6927294`, carpeta `assets/` (herramienta `DesignSync method=get_file`).

---

### Task 1: Andamiaje del proyecto + tokens CSS + datos de configuración

**Files:**
- Create: `css/styles.css`
- Create: `js/config.js`
- Create: `.gitignore`
- Create: `package.json`

**Interfaces:**
- Produces: variable global `window.SURCO` con la forma:
  ```
  SURCO.whatsapp: string            // "573332485064"
  SURCO.email: string
  SURCO.instagram: string           // URL
  SURCO.facebook: string            // URL
  SURCO.ubicacion: string
  SURCO.hero.intervaloMs: number    // 5000
  SURCO.hero.slides: string[]       // rutas img
  SURCO.tamanos: Array<{ id:string, etiqueta:string, peso:string, nota:string }>
  SURCO.productos: Array<{
    id:string, titulo:string, nombre:string, descripcion:string,
    imagen:string|null, badge:string|null,
    ficha:{ variedad:string, altura:string, proceso:string, sca:string },
    precios: Record<string, number>   // clave = tamano.id
  }>
  ```
- Produces: `css/styles.css` con todos los tokens `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--space-*` en `:root` (usados por estilos inline en `index.html` y por `tienda.js`).

- [ ] **Step 1: Crear `.gitignore`**

```gitignore
node_modules/
.DS_Store
Thumbs.db
*.log
# Carpetas de imágenes originales full-res (se optimizan a assets/img/)
/Imagenes hero/
/Imagen Seccion Receta/
```

- [ ] **Step 2: Crear `package.json` (solo para dev)**

```json
{
  "name": "surcocoffee-web",
  "version": "1.0.0",
  "private": true,
  "description": "Sitio web estatico de Surco Coffee",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 3: Crear `css/styles.css` con los tokens del sistema Organic**

Copiar exactamente este bloque (tokens + base). Es el `styles.css` de "Organic" reducido a lo que el sitio usa (tokens completos + reset + tipografía base). Los componentes se estilizan con estilos inline en `index.html` (igual que el diseño original).

```css
/* Surco Coffee — tokens del sistema "Organic" + base.
   Cambia colores/tipografías aquí; el contenido se edita en js/config.js. */
@import url('https://fonts.googleapis.com/css2?family=Caprasimo:wght@400&family=Figtree:wght@400;600;700&display=swap');

:root {
  --color-bg: #f5ead8;
  --color-surface: #ebddc5;
  --color-text: #201e1d;
  --color-accent: #c67139;
  --color-accent-2: #7a8a5e;
  --color-divider: color-mix(in srgb, #201e1d 16%, transparent);

  --color-neutral-100: #f9f4ed; --color-neutral-200: #eee7db; --color-neutral-300: #dcd3c4;
  --color-neutral-400: #c0b6a5; --color-neutral-500: #a19786; --color-neutral-600: #82796a;
  --color-neutral-700: #645c50; --color-neutral-800: #474238; --color-neutral-900: #2e2b25;

  --color-accent-100: #fff2eb; --color-accent-200: #ffe1d0; --color-accent-300: #ffc6a5;
  --color-accent-400: #f6a06b; --color-accent-500: #d67f48; --color-accent-600: #b2622d;
  --color-accent-700: #8c491a; --color-accent-800: #643312; --color-accent-900: #402310;

  --color-accent-2-100: #f0fae1; --color-accent-2-200: #e1eecc; --color-accent-2-300: #ccdbb2;
  --color-accent-2-400: #aebf92; --color-accent-2-500: #8fa073; --color-accent-2-600: #728157;
  --color-accent-2-700: #56633f; --color-accent-2-800: #3d472b; --color-accent-2-900: #272e1b;

  --font-heading: "Caprasimo", system-ui, sans-serif;
  --font-heading-weight: 400;
  --font-body: "Figtree", system-ui, sans-serif;

  --space-1: 4.4px; --space-2: 8.8px; --space-3: 13.2px;
  --space-4: 17.6px; --space-6: 26.4px; --space-8: 35.2px;

  --radius-sm: 8px; --radius-md: 16px; --radius-lg: 28px;

  --shadow-sm: 0 1px 2px color-mix(in srgb, #2e2b25 14%, transparent);
  --shadow-md: 0 3px 10px color-mix(in srgb, #2e2b25 16%, transparent);
  --shadow-lg: 0 12px 32px color-mix(in srgb, #2e2b25 22%, transparent);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 15px; line-height: 1.55; font-weight: 400;
}
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading); font-weight: var(--font-heading-weight);
  line-height: 1.12; letter-spacing: -0.015em; margin: 0;
}
p { margin: 0; }
img { display: block; max-width: 100%; }
figure { margin: 0; }
a { color: var(--color-accent); text-underline-offset: 3px; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
::selection { background: color-mix(in srgb, var(--color-accent) 30%, transparent); }
button { font-family: inherit; }
```

- [ ] **Step 4: Crear `js/config.js` con los datos reales del diseño**

```js
/* ============================================================================
   CONFIGURACIÓN DE SURCO COFFEE  —  EDITA AQUÍ
   Cambia precios, textos, productos, tamaños, contactos e imágenes.
   No necesitas tocar ningún otro archivo. Guarda y recarga la página.
   ============================================================================ */
window.SURCO = {
  /* --- Contacto y redes --- */
  whatsapp: "573332485064",                                   // número de pedidos (sin +)
  email: "surcocoffeealmadefinca@gmail.com",
  instagram: "https://instagram.com/surcocoffee",
  facebook: "https://www.facebook.com/profile.php?id=61585849805519",
  ubicacion: "Versalles, Antioquia",

  /* --- Carrusel del inicio (hero) --- */
  hero: {
    intervaloMs: 5000,                                        // tiempo entre fotos (ms)
    slides: [
      "assets/img/finca-48.jpg",
      "assets/img/finca-22.jpg",
      "assets/img/finca-37.jpg",
      "assets/img/finca-04.jpg",
    ],
  },

  /* --- Tamaños (compartidos por todos los cafés) --- */
  tamanos: [
    { id: "250",  etiqueta: "Ritual Diario",    peso: "250 g",  nota: "Perfecto para disfrutar cada día." },
    { id: "500",  etiqueta: "Alma de Casa",     peso: "500 g",  nota: "Tu café favorito para compartir momentos únicos." },
    { id: "1000", etiqueta: "Reserva Familiar", peso: "1 kg",   nota: "Rinde más para quienes aman el buen café." },
    { id: "2500", etiqueta: "Surco Abundante",  peso: "2.5 kg", nota: "Ideal para los verdaderos amantes del café." },
  ],

  /* --- Catálogo de cafés ---
     titulo    = nombre en la tarjeta
     nombre    = nombre que aparece en el pedido de WhatsApp
     imagen    = ruta de la foto de la bolsa (null = muestra placeholder)
     badge     = etiqueta especial (null = sin etiqueta)
     precios   = precio por tamaño; la clave debe coincidir con tamanos[].id  */
  productos: [
    {
      id: "tradicional",
      titulo: "Tradicional",
      nombre: "Proceso Tradicional",
      descripcion: "Chocolate, caramelo y sutiles matices frutales. Acidez brillante, final limpio y persistente.",
      imagen: "assets/img/bag-tradicional.png",
      badge: null,
      ficha: { variedad: "Castillo · Caturra", altura: "1.800–2.200", proceso: "Lavado", sca: "84+" },
      precios: { "250": 25000, "500": 45000, "1000": 85000, "2500": 210000 },
    },
    {
      id: "honey",
      titulo: "Honey",
      nombre: "Proceso Honey",
      descripcion: "Dulzor a panela y fruta madura, cuerpo sedoso. Un perfil redondo y envolvente.",
      imagen: "assets/img/bag-honey.png",
      badge: null,
      ficha: { variedad: "Castillo · Caturra", altura: "1.800–2.200", proceso: "Honey", sca: "85+" },
      precios: { "250": 35000, "500": 65000, "1000": 120000, "2500": 250000 },
    },
    {
      id: "chiroso",
      titulo: "Chiroso",
      nombre: "Chiroso",
      descripcion: "Notas florales y cítricas con recuerdos a jazmín. Acidez vibrante y taza delicada.",
      imagen: null,                                           // placeholder hasta tener la foto
      badge: "Edición especial",
      ficha: { variedad: "Chiroso", altura: "1.800–2.200", proceso: "Lavado", sca: "86+" },
      precios: { "250": 40000, "500": 75000, "1000": 140000, "2500": 300000 },
    },
  ],
};
```

- [ ] **Step 5: Verificar que `config.js` es JS válido**

Run: `node --check js/config.js && node -e "global.window={}; require('./js/config.js'); const p=window.SURCO.productos; if(p.length!==3) throw new Error('esperaba 3 productos'); console.log('config OK:', p.map(x=>x.id).join(','))"`
Expected: imprime `config OK: tradicional,honey,chiroso` sin errores.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json css/styles.css js/config.js
git commit -m "feat: andamiaje, tokens Organic y config editable"
```

---

### Task 2: Lógica pura del carrito (`cart-core.js`) con TDD

Módulo ES sin dependencias del DOM, probable con `node --test`. Reglas tomadas del `DCLogic` original (ver comentario al final de `<scratchpad>/ProposalMarket.dc.html`).

**Files:**
- Create: `js/cart-core.js`
- Test: `tests/cart-core.test.mjs`

**Interfaces:**
- Produces (todas exportadas de `js/cart-core.js`):
  - `formatCOP(n: number): string` → `"$25.000"`
  - `lineTotal(item): number` → `item.price * item.qty`
  - `cartTotal(cart: Item[]): number`
  - `cartCount(cart: Item[]): number`
  - `addItem(cart: Item[], product, size): Item[]` (inmutable; `key = product.id + "-" + size.id`; si existe, +1 qty; si no, agrega qty 1)
  - `changeQty(cart: Item[], key: string, delta: number): Item[]` (inmutable; elimina si qty ≤ 0)
  - `buildOrderMessage(cart: Item[]): string`
  - `waLink(phone: string, message: string): string`
  - Tipo `Item`: `{ key, id, prod, sizeName, sizeWeight, price, qty }`
    - `prod` = `product.nombre`; `sizeName` = `size.etiqueta`; `sizeWeight` = `size.peso`.

- [ ] **Step 1: Escribir la prueba que falla (`tests/cart-core.test.mjs`)**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCOP, lineTotal, cartTotal, cartCount,
  addItem, changeQty, buildOrderMessage, waLink,
} from '../js/cart-core.js';

const P = { id: 'tradicional', nombre: 'Proceso Tradicional', precios: { '250': 25000, '500': 45000 } };
const S250 = { id: '250', etiqueta: 'Ritual Diario', peso: '250 g' };
const S500 = { id: '500', etiqueta: 'Alma de Casa', peso: '500 g' };

// addItem debe leer el precio del tamaño elegido
const mkProd = (p, size) => ({ ...p, price: p.precios[size.id] });

test('formatCOP formatea en pesos colombianos', () => {
  assert.equal(formatCOP(25000), '$25.000');
  assert.equal(formatCOP(210000), '$210.000');
});

test('addItem agrega un ítem nuevo con qty 1', () => {
  const cart = addItem([], mkProd(P, S250), S250);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].key, 'tradicional-250');
  assert.equal(cart[0].prod, 'Proceso Tradicional');
  assert.equal(cart[0].sizeName, 'Ritual Diario');
  assert.equal(cart[0].sizeWeight, '250 g');
  assert.equal(cart[0].price, 25000);
  assert.equal(cart[0].qty, 1);
});

test('addItem del mismo producto+tamaño incrementa qty (no duplica)', () => {
  let cart = addItem([], mkProd(P, S250), S250);
  cart = addItem(cart, mkProd(P, S250), S250);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, 2);
});

test('addItem de distinto tamaño crea una segunda línea', () => {
  let cart = addItem([], mkProd(P, S250), S250);
  cart = addItem(cart, mkProd(P, S500), S500);
  assert.equal(cart.length, 2);
});

test('addItem no muta el carrito original', () => {
  const original = [];
  addItem(original, mkProd(P, S250), S250);
  assert.equal(original.length, 0);
});

test('changeQty +1 / -1 y elimina al llegar a 0', () => {
  let cart = addItem([], mkProd(P, S250), S250);
  cart = changeQty(cart, 'tradicional-250', 1);
  assert.equal(cart[0].qty, 2);
  cart = changeQty(cart, 'tradicional-250', -1);
  assert.equal(cart[0].qty, 1);
  cart = changeQty(cart, 'tradicional-250', -1);
  assert.equal(cart.length, 0);
});

test('cartTotal y cartCount suman correctamente', () => {
  let cart = addItem([], mkProd(P, S250), S250);   // 25000 x1
  cart = addItem(cart, mkProd(P, S500), S500);      // 45000 x1
  cart = changeQty(cart, 'tradicional-500', 1);     // 45000 x2
  assert.equal(cartCount(cart), 3);
  assert.equal(cartTotal(cart), 25000 + 45000 * 2); // 115000
  assert.equal(lineTotal(cart[1]), 90000);
});

test('buildOrderMessage arma el texto del pedido', () => {
  let cart = addItem([], mkProd(P, S250), S250);
  const msg = buildOrderMessage(cart);
  assert.match(msg, /^Hola Surco Coffee/);
  assert.match(msg, /• Proceso Tradicional — Ritual Diario \(250 g\) x1 = \$25\.000/);
  assert.match(msg, /Total: \$25\.000/);
});

test('waLink codifica el mensaje', () => {
  const url = waLink('573332485064', 'Hola mundo');
  assert.equal(url, 'https://wa.me/573332485064?text=Hola%20mundo');
});
```

- [ ] **Step 2: Correr la prueba y verificar que falla**

Run: `node --test tests/cart-core.test.mjs`
Expected: FAIL — `Cannot find module '../js/cart-core.js'` (aún no existe).

- [ ] **Step 3: Implementar `js/cart-core.js` (mínimo para pasar)**

```js
/* Lógica pura del carrito. Sin DOM: probable con `node --test`.
   Importado por js/tienda.js en el navegador (ES module). */

export function formatCOP(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

export function lineTotal(item) {
  return item.price * item.qty;
}

export function cartTotal(cart) {
  return cart.reduce((sum, x) => sum + lineTotal(x), 0);
}

export function cartCount(cart) {
  return cart.reduce((sum, x) => sum + x.qty, 0);
}

export function addItem(cart, product, size) {
  const key = product.id + '-' + size.id;
  const next = cart.map((x) => ({ ...x }));
  const found = next.find((x) => x.key === key);
  if (found) {
    found.qty += 1;
  } else {
    next.push({
      key,
      id: product.id,
      prod: product.nombre,
      sizeName: size.etiqueta,
      sizeWeight: size.peso,
      price: product.price,
      qty: 1,
    });
  }
  return next;
}

export function changeQty(cart, key, delta) {
  return cart
    .map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : { ...x }))
    .filter((x) => x.qty > 0);
}

export function buildOrderMessage(cart) {
  const lines = cart
    .map((x) => `• ${x.prod} — ${x.sizeName} (${x.sizeWeight}) x${x.qty} = ${formatCOP(lineTotal(x))}`)
    .join('\n');
  const total = cartTotal(cart);
  return `Hola Surco Coffee 👋 Quiero hacer este pedido:\n\n${lines}\n\nTotal: ${formatCOP(total)}`;
}

export function waLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Correr las pruebas y verificar que pasan**

Run: `node --test tests/cart-core.test.mjs`
Expected: PASS — todas las pruebas en verde (`# pass 9`, `# fail 0`).

- [ ] **Step 5: Commit**

```bash
git add js/cart-core.js tests/cart-core.test.mjs
git commit -m "feat: logica pura del carrito con pruebas"
```

---

### Task 3: Imágenes (bajar marca + optimizar fotos)

Objetivo: dejar en `assets/img/` todas las imágenes que referencian `config.js` e `index.html`, optimizadas.

**Files:**
- Create: `assets/img/finca-48.jpg`, `finca-22.jpg`, `finca-37.jpg`, `finca-04.jpg`, `finca-52.jpg` (fotos, optimizadas)
- Create: `assets/img/bag-tradicional.png`, `bag-honey.png`, `logo-16.png`, `logo-06.png`, `surco-icon.png` (marca, desde Claude Design)

**Interfaces:**
- Consumes: rutas de imagen definidas en `config.js` (hero) e `index.html` (logos, íconos, foto de la Fórmula, bolsas).
- Produces: archivos de imagen en `assets/img/` con esos nombres exactos.

- [ ] **Step 1: Optimizar las fotos grandes locales a `assets/img/`**

Mapeo (origen → destino): `Imagenes hero/…-48.jpg → finca-48.jpg`, `…-22.jpg → finca-22.jpg`, `…-37.jpg → finca-37.jpg`, `…-4.jpg → finca-04.jpg`, `Imagen Seccion Receta/…-52.jpg → finca-52.jpg`.

Redimensionar a máx. 1600 px de ancho y comprimir (calidad ~80). Usar `sharp-cli` vía `npx`:

```bash
mkdir -p assets/img
npx --yes sharp-cli --input "Imagenes hero/Los Naranjos 2200 Session 2025 Oficial-48.jpg"  --output assets/img resize 1600 --withoutEnlargement -f jpeg -q 80 && mv "assets/img/Los Naranjos 2200 Session 2025 Oficial-48.jpg" assets/img/finca-48.jpg
npx --yes sharp-cli --input "Imagenes hero/Los Naranjos 2200 Session 2025 Oficial-22.jpg"  --output assets/img resize 1600 --withoutEnlargement -f jpeg -q 80 && mv "assets/img/Los Naranjos 2200 Session 2025 Oficial-22.jpg" assets/img/finca-22.jpg
npx --yes sharp-cli --input "Imagenes hero/Los Naranjos 2200 Session 2025 Oficial-37.jpg"  --output assets/img resize 1600 --withoutEnlargement -f jpeg -q 80 && mv "assets/img/Los Naranjos 2200 Session 2025 Oficial-37.jpg" assets/img/finca-37.jpg
npx --yes sharp-cli --input "Imagenes hero/Los Naranjos 2200 Session 2025 Oficial-4.jpg"   --output assets/img resize 1600 --withoutEnlargement -f jpeg -q 80 && mv "assets/img/Los Naranjos 2200 Session 2025 Oficial-4.jpg" assets/img/finca-04.jpg
npx --yes sharp-cli --input "Imagen Seccion Receta/Los Naranjos 2200 Session 2025 Oficial-52.jpg" --output assets/img resize 1600 --withoutEnlargement -f jpeg -q 80 && mv "assets/img/Los Naranjos 2200 Session 2025 Oficial-52.jpg" assets/img/finca-52.jpg
```

Nota (fallback): si `sharp-cli` no corre en el entorno, usar ImageMagick: `magick "<origen>" -resize 1600x -quality 80 assets/img/<destino>.jpg`. Si tampoco está, copiar los originales tal cual como último recurso y anotarlo.

- [ ] **Step 2: Bajar los assets de marca desde Claude Design**

Estos archivos son binarios. Usar la herramienta `DesignSync` con `method=get_file`, `projectId=03881f96-d6cf-4f04-8645-8d2eb6927294`, y cada `path`; el resultado viene en base64 (`isBase64:true`). Decodificar a disco. Assets y destino:

| path en Claude Design      | destino                       |
|----------------------------|-------------------------------|
| `assets/bag-tradicional.png` | `assets/img/bag-tradicional.png` |
| `assets/bag-honey.png`     | `assets/img/bag-honey.png`    |
| `assets/logo-16.png`       | `assets/img/logo-16.png`      |
| `assets/logo-06.png`       | `assets/img/logo-06.png`      |
| `assets/surco-icon.png`    | `assets/img/surco-icon.png`   |

Para cada uno: guardar el string base64 devuelto en un archivo temporal y decodificar:
```bash
# ejemplo para un asset (repetir por archivo):
# (pegar el base64 en /scratchpad/asset.b64 primero)
base64 -d "<scratchpad>/asset.b64" > assets/img/bag-tradicional.png
```

**Importante:** `get_file` corta binarios a 256 KiB (`truncated:true`). Tras bajar cada uno, verificar en el Step 3 que la imagen es válida. Si un archivo llega truncado, pedir al cliente que exporte ese asset específico del proyecto de Claude Design y colocarlo en `assets/img/`.

- [ ] **Step 3: Verificar que todas las imágenes existen y son válidas**

Run:
```bash
node -e "const fs=require('fs'); const need=['finca-48.jpg','finca-22.jpg','finca-37.jpg','finca-04.jpg','finca-52.jpg','bag-tradicional.png','bag-honey.png','logo-16.png','logo-06.png','surco-icon.png']; let bad=[]; for(const f of need){const p='assets/img/'+f; if(!fs.existsSync(p)){bad.push(f+' (falta)');continue;} const b=fs.readFileSync(p); const jpg=b[0]===0xFF&&b[1]===0xD8; const png=b[0]===0x89&&b[1]===0x50; if(!(jpg||png))bad.push(f+' (no es imagen valida)'); if(b.length<1000)bad.push(f+' (sospechosamente pequena)');} if(bad.length){console.error('PROBLEMAS:',bad);process.exit(1);} console.log('Todas las imagenes OK');"
```
Expected: `Todas las imagenes OK`. Si falla, resolver el/los archivo(s) señalados antes de continuar.

- [ ] **Step 4: Commit**

```bash
git add assets/img
git commit -m "assets: imagenes optimizadas de finca y marca"
```

---

### Task 4: `index.html` — estructura y secciones estáticas (con mejora de "Fórmula")

Portar el markup del diseño a HTML estático real. Reemplazar el runtime `x-dc`/`sc-if`/`sc-for`/`{{}}` por HTML plano + puntos de montaje (`id`) que `tienda.js` rellenará en la Tarea 5. Conservar los estilos inline del diseño (referencian `var(--...)`), para fidelidad 1:1.

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `css/styles.css` (tokens), imágenes en `assets/img/` (Tarea 3).
- Produces: contenedores con estos `id` que `tienda.js` (Tarea 5) usará:
  - `#hero-img` (el `<img>` de fondo del carrusel)
  - `#hero-dots` (contenedor de los puntos)
  - `#hero-prev`, `#hero-next` (flechas)
  - `#cart-btn` (botón del carrito en el header del hero), `#cart-count`, `#cart-total-badge`
  - `#cart-panel` (contenedor del panel desplegable del carrito)
  - `#catalogo` (contenedor flex donde se inyectan las tarjetas de producto)

- [ ] **Step 1: Crear `index.html`**

Estructura completa. Copiar desde `<scratchpad>/ProposalMarket.dc.html` el markup de cada sección **conservando los estilos inline**, con estas transformaciones:

1. `<head>`: doctype/meta estándar + `<title>Surco Coffee · Alma de finca</title>`, `<meta name="description" content="Café de origen colombiano, directo de la finca a tu pedido.">`, `<link rel="stylesheet" href="css/styles.css">`, y al final del `<body>`: `<script src="js/config.js"></script>` seguido de `<script type="module" src="js/tienda.js"></script>`. Quitar `support.js`, `_ds_bundle.js`, `image-slot.js`, `<x-dc>`, `<helmet>`.
2. Envolver todo en `<div class="page" style="container-type:inline-size; width:100%; background:var(--color-neutral-100); color:var(--color-text); font-family:var(--font-body); overflow:clip;">`.
3. **Hero:** el `<img src="{{ slideImg }}">` → `<img id="hero-img" src="assets/img/finca-48.jpg" alt="Café de la finca Los Naranjos 2200" style="…(igual)…">`. El botón del carrito → añadir `id="cart-btn"`; el `{{ count }}` → `<span id="cart-count">0</span>`; el `<sc-if hasItems>… {{ totalFmt }}</sc-if>` → `<span id="cart-total-badge" style="opacity:.88; display:none;"></span>`. Quitar el bloque `<sc-if cartOpen>…</sc-if>` y en su lugar dejar un contenedor vacío: `<div id="cart-panel"></div>` (mismo posicionamiento relativo del padre). Flechas → `id="hero-prev"` / `id="hero-next"`. El bloque de dots `<sc-for>` → `<div id="hero-dots" style="…(igual)…"></div>` (vacío; lo llena JS).
4. **Fórmula Secreta:** copiar la sección, con **la mejora**: reemplazar el `<div>` contenedor `display:flex; flex-wrap:wrap; … align-items:stretch;` por un **grid de 2 columnas iguales que colapsa en móvil**, y hacer que la figura ocupe el 100% del alto de la fila. Usar exactamente:
   ```html
   <div style="background:var(--color-accent-2-100); border-radius:calc(1.4 * var(--radius-lg)); padding:clamp(24px,3.5cqw,52px); display:grid; grid-template-columns:1fr 1fr; gap:clamp(24px,4cqw,56px); align-items:stretch;">
     <figure style="margin:0; height:100%; min-height:300px; border-radius:calc(1.4 * var(--radius-lg)); overflow:hidden; box-shadow:var(--shadow-md);">
       <img src="assets/img/finca-52.jpg" alt="Recolección de café a mano" style="width:100%; height:100%; object-fit:cover;">
     </figure>
     <div>… (los 4 pasos + frase final, igual que el diseño) …</div>
   </div>
   ```
   Y añadir a `css/styles.css` una regla responsive para colapsar a una columna en móvil (contenedor usa container queries; usar `@container`):
   ```css
   /* Fórmula: 2 columnas iguales; una sola columna en pantallas angostas */
   @container (max-width: 720px) {
     .formula-grid { grid-template-columns: 1fr !important; }
   }
   ```
   (Añadir `class="formula-grid"` al `<div>` del grid anterior.)
5. **Catálogo:** copiar la sección, pero el contenedor de tarjetas queda **vacío** con `id="catalogo"`: `<div id="catalogo" style="display:flex; flex-wrap:wrap; gap:clamp(16px,2cqw,24px);"></div>`. Mantener el `<h2>Catálogo</h2>`, el párrafo introductorio y la nota final de precios de ejemplo.
6. **¿Por qué elegirnos?**, **footer** y **botón flotante de WhatsApp:** copiar tal cual del diseño (son estáticos). En el footer y el flotante las URLs (WhatsApp/IG/FB) pueden quedar escritas directamente (coinciden con `config.js`); `tienda.js` no necesita tocarlas.

- [ ] **Step 2: Verificar HTML bien formado y montajes presentes**

Run:
```bash
node -e "const h=require('fs').readFileSync('index.html','utf8'); for(const id of ['hero-img','hero-dots','hero-prev','hero-next','cart-btn','cart-count','cart-panel','catalogo']){ if(!h.includes('id=\"'+id+'\"')) throw new Error('falta #'+id); } if(!h.includes('css/styles.css')) throw new Error('falta link a styles.css'); if(!h.includes('js/config.js')||!h.includes('js/tienda.js')) throw new Error('faltan scripts'); if(/x-dc|sc-if|sc-for|{{/.test(h)) throw new Error('quedaron restos del runtime de Claude Design'); console.log('index.html OK');"
```
Expected: `index.html OK`.

- [ ] **Step 3: Verificación visual con Playwright**

Servir el sitio y abrirlo:
```bash
# terminal aparte / background:
npx --yes serve -l 5099 . 
```
Con Playwright MCP: navegar a `http://localhost:5099/`, tomar screenshot desktop (1280px) y móvil (390px). Comparar contra la referencia del diseño: hero con foto y logo, sección Fórmula con imagen y texto a la misma altura, secciones y footer presentes. El catálogo aún estará vacío (se llena en la Tarea 5) — es esperado.
Expected: layout fiel; en Fórmula la imagen NO sobresale del texto (misma altura); sin errores de consola salvo (posible) 404 de imágenes si Tarea 3 quedó incompleta.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: estructura de la pagina y mejora de seccion Formula"
```

---

### Task 5: `tienda.js` — render de catálogo, carrusel y carrito

Módulo ES que da vida a la página: lee `window.SURCO`, usa `cart-core.js`, y maneja DOM/eventos. Reemplaza el `DCLogic` del diseño.

**Files:**
- Create: `js/tienda.js`

**Interfaces:**
- Consumes: `window.SURCO` (Tarea 1); `cart-core.js` (Tarea 2); los `id` de `index.html` (Tarea 4).
- Produces: comportamiento interactivo (sin exports nuevos consumidos por otras tareas).

- [ ] **Step 1: Implementar `js/tienda.js`**

```js
import { formatCOP, lineTotal, cartTotal, cartCount, addItem, changeQty, buildOrderMessage, waLink }
  from './cart-core.js';

const CFG = window.SURCO;
const $ = (id) => document.getElementById(id);

// --- Estado ---
const state = {
  cart: [],
  sel: {},            // { [productId]: sizeIndex }
  slide: 0,
  cartOpen: false,
  done: false,
};
CFG.productos.forEach((p) => { state.sel[p.id] = 0; });

// Estilos de chip (tomados del diseño)
const chipSel = 'background:var(--color-accent-2-600);color:#fff;border:1px solid var(--color-accent-2-600);';
const chipUnsel = 'background:#fff;color:var(--color-text);border:1px solid var(--color-divider);';

// ============ CATÁLOGO ============
function productCard(p) {
  const sizes = CFG.tamanos;
  const sel = state.sel[p.id];
  const price = p.precios[sizes[sel].id];

  const media = p.imagen
    ? `<img src="${p.imagen}" alt="Bolsa Surco ${p.titulo}" style="width:100%; height:100%; object-fit:cover;">`
    : `<div style="width:100%; height:100%; display:grid; place-content:center; text-align:center; padding:16px; color:color-mix(in srgb, var(--color-text) 55%, transparent); font-size:13px; background:var(--color-accent-2-100);">Foto de ${p.titulo}<br>(próximamente)</div>`;
  const badge = p.badge
    ? `<span style="position:absolute; top:10px; left:10px; z-index:2; font-family:var(--font-heading); font-size:12px; padding:5px 12px; border-radius:999px; background:var(--color-accent); color:#fff;">${p.badge}</span>`
    : '';

  const chips = sizes.map((s, i) => `
    <button type="button" data-add-size data-prod="${p.id}" data-size="${i}"
      style="cursor:pointer; text-align:left; padding:8px 12px; border-radius:14px; ${i === sel ? chipSel : chipUnsel}">
      <span style="display:block; font-family:var(--font-heading); font-size:13px; line-height:1.15;">${s.etiqueta}</span>
      <span style="display:block; font-size:11px; opacity:.8;">${s.peso}</span>
    </button>`).join('');

  const f = p.ficha;
  const fichaCell = (label, val) =>
    `<div><div style="font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--color-accent-2-800); margin-bottom:2px;">${label}</div><div style="font-family:var(--font-heading); font-size:15px;">${val}</div></div>`;

  return `
  <div style="flex:1 1 300px; min-width:0; background:#fff; border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:15px;">
    <figure style="position:relative; margin:0; border-radius:var(--radius-md); overflow:hidden; aspect-ratio:1/1; background:#1b1b1b;">
      ${media}${badge}
    </figure>
    <div>
      <h3 style="font-family:var(--font-heading); font-weight:400; font-size:22px; margin:10px 0 4px;">${p.titulo}</h3>
      <p style="font-size:13.5px; line-height:1.5; margin:0; color:color-mix(in srgb, var(--color-text) 66%, transparent);">${p.descripcion}</p>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 14px; padding:14px 0; border-top:1px solid var(--color-divider); border-bottom:1px solid var(--color-divider);">
      ${fichaCell('Variedad', f.variedad)}${fichaCell('Altura', f.altura)}${fichaCell('Proceso', f.proceso)}${fichaCell('Puntaje SCA', f.sca)}
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${chips}</div>
    <p style="margin:0; font-size:12.5px; font-style:italic; color:color-mix(in srgb, var(--color-text) 62%, transparent);">${sizes[sel].nota}</p>
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:auto;">
      <span style="font-family:var(--font-heading); font-size:24px; color:var(--color-accent-700);">${formatCOP(price)}</span>
      <button type="button" data-add data-prod="${p.id}" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:999px; border:0; background:var(--color-accent-2-600); color:#fff; font-family:var(--font-heading); font-size:14px;">Agregar</button>
    </div>
  </div>`;
}

function renderCatalogo() {
  $('catalogo').innerHTML = CFG.productos.map(productCard).join('');
}

// ============ CARRITO ============
function renderCartBadge() {
  $('cart-count').textContent = String(cartCount(state.cart));
  const badge = $('cart-total-badge');
  if (state.cart.length) {
    badge.style.display = '';
    badge.textContent = '· ' + formatCOP(cartTotal(state.cart));
  } else {
    badge.style.display = 'none';
  }
}

function cartItemsHtml() {
  return state.cart.map((it) => `
    <div style="display:flex; align-items:center; gap:10px; padding-bottom:11px; border-bottom:1px solid var(--color-divider);">
      <div style="flex:1; min-width:0;">
        <div style="font-family:var(--font-heading); font-size:15px;">${it.prod}</div>
        <div style="font-size:12px; color:color-mix(in srgb, var(--color-text) 55%, transparent);">${it.sizeName} · ${it.sizeWeight}</div>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button type="button" data-qty="${it.key}" data-delta="-1" style="cursor:pointer; width:26px; height:26px; border-radius:50%; border:1px solid var(--color-divider); background:transparent; color:var(--color-text); font-size:15px; line-height:1;">−</button>
        <span style="font-family:var(--font-heading); min-width:16px; text-align:center;">${it.qty}</span>
        <button type="button" data-qty="${it.key}" data-delta="1" style="cursor:pointer; width:26px; height:26px; border-radius:50%; border:1px solid var(--color-divider); background:transparent; color:var(--color-text); font-size:15px; line-height:1;">+</button>
      </div>
      <div style="font-family:var(--font-heading); font-size:13px; min-width:66px; text-align:right; color:var(--color-accent-700);">${formatCOP(lineTotal(it))}</div>
    </div>`).join('');
}

function renderCartPanel() {
  const panel = $('cart-panel');
  if (!state.cartOpen) { panel.innerHTML = ''; return; }
  const hasItems = state.cart.length > 0;
  const body = hasItems ? `
    <div style="display:flex; flex-direction:column; gap:11px; max-height:280px; overflow:auto;">${cartItemsHtml()}</div>
    <div style="display:flex; align-items:baseline; justify-content:space-between; margin-top:16px;">
      <span style="font-size:13px; letter-spacing:0.06em; text-transform:uppercase; color:color-mix(in srgb, var(--color-text) 65%, transparent);">Total</span>
      <span style="font-family:var(--font-heading); font-size:26px; color:var(--color-accent-700);">${formatCOP(cartTotal(state.cart))}</span>
    </div>
    <button type="button" id="cart-checkout" style="cursor:pointer; width:100%; margin-top:14px; padding:12px; border-radius:999px; border:0; background:#25d366; color:#fff; font-family:var(--font-heading); font-size:15px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.1-1.3A10 10 0 1 0 12 2z"></path></svg>Finalizar por WhatsApp</button>
    ${state.done ? '<p style="text-align:center; font-size:13px; color:var(--color-accent-2-700); margin:12px 0 0;">Abrimos WhatsApp con tu pedido listo para enviar.</p>' : ''}
  ` : `<p style="font-size:14px; color:color-mix(in srgb, var(--color-text) 55%, transparent); margin:0;">Aún no has agregado café. Elige un tamaño y toca “Agregar”.</p>`;

  panel.innerHTML = `
    <div style="position:absolute; top:calc(100% + 12px); right:0; width:min(370px,86cqw); background:#fff; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); padding:20px; z-index:60; color:var(--color-text); text-align:left;">
      <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:14px;">
        <h3 style="font-family:var(--font-heading); font-weight:400; font-size:20px; margin:0;">Tu pedido</h3>
        <button type="button" id="cart-close" style="cursor:pointer; border:0; background:transparent; color:color-mix(in srgb, var(--color-text) 55%, transparent); font-size:20px; line-height:1;">×</button>
      </div>
      ${body}
    </div>`;
}

// ============ CARRUSEL ============
function renderSlide() {
  $('hero-img').src = CFG.hero.slides[state.slide];
  $('hero-dots').innerHTML = CFG.hero.slides.map((_, i) =>
    `<button type="button" data-dot="${i}" aria-label="Ir a foto ${i + 1}" style="cursor:pointer; width:10px; height:10px; padding:0; border-radius:50%; border:0; ${i === state.slide ? 'background:#fff;' : 'background:rgba(255,255,255,0.45);'}"></button>`
  ).join('');
}
function goSlide(i) { state.slide = (i + CFG.hero.slides.length) % CFG.hero.slides.length; renderSlide(); }

// ============ ACCIONES ============
function refreshAll() { renderCatalogo(); renderCartBadge(); renderCartPanel(); }

function onAdd(prodId) {
  const p = CFG.productos.find((x) => x.id === prodId);
  const size = CFG.tamanos[state.sel[prodId]];
  const withPrice = { ...p, price: p.precios[size.id] };
  state.cart = addItem(state.cart, withPrice, size);
  state.done = false;
  state.cartOpen = true;
  refreshAll();
}
function onSelectSize(prodId, i) { state.sel[prodId] = i; renderCatalogo(); }
function onQty(key, delta) { state.cart = changeQty(state.cart, key, delta); state.done = false; renderCartBadge(); renderCartPanel(); }
function onToggleCart() { state.cartOpen = !state.cartOpen; renderCartPanel(); }
function onCheckout() {
  if (!state.cart.length) return;
  window.open(waLink(CFG.whatsapp, buildOrderMessage(state.cart)), '_blank');
  state.done = true;
  renderCartPanel();
}

// ============ EVENTOS (delegación) ============
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-add],[data-add-size],[data-qty],[data-dot]');
  const btn = $('cart-btn');
  if (btn && (e.target === btn || btn.contains(e.target))) { onToggleCart(); return; }
  if ($('cart-close') && ($('cart-close') === e.target || $('cart-close').contains(e.target))) { onToggleCart(); return; }
  if ($('cart-checkout') && ($('cart-checkout') === e.target || $('cart-checkout').contains(e.target))) { onCheckout(); return; }
  if (!t) return;
  if (t.hasAttribute('data-add')) onAdd(t.getAttribute('data-prod'));
  else if (t.hasAttribute('data-add-size')) onSelectSize(t.getAttribute('data-prod'), Number(t.getAttribute('data-size')));
  else if (t.hasAttribute('data-qty')) onQty(t.getAttribute('data-qty'), Number(t.getAttribute('data-delta')));
  else if (t.hasAttribute('data-dot')) goSlide(Number(t.getAttribute('data-dot')));
});
$('hero-prev').addEventListener('click', () => goSlide(state.slide - 1));
$('hero-next').addEventListener('click', () => goSlide(state.slide + 1));

// ============ INICIO ============
refreshAll();
renderSlide();
setInterval(() => goSlide(state.slide + 1), CFG.hero.intervaloMs);
```

- [ ] **Step 2: Verificación funcional con Playwright**

Con el sitio servido (`npx --yes serve -l 5099 .`), usar Playwright MCP en `http://localhost:5099/`:
1. Verificar que el `#catalogo` tiene 3 tarjetas.
2. Click en el segundo chip de tamaño de "Tradicional" → el precio de esa tarjeta cambia a `$45.000`.
3. Click en "Agregar" de "Tradicional" → `#cart-count` muestra `1`, aparece el badge de total, y el panel del carrito se abre.
4. Click en "+" dentro del carrito → qty 2, total `$90.000`.
5. Verificar que el botón "Finalizar por WhatsApp" existe y (sin abrir pestaña real) que `waLink` se construiría; revisar la consola sin errores.
6. Esperar ~6 s y confirmar que la foto del hero cambió (o click en flecha derecha) y que el dot activo se mueve.
Expected: todo lo anterior se cumple; sin errores en consola.

- [ ] **Step 3: Commit**

```bash
git add js/tienda.js
git commit -m "feat: catalogo, carrusel y carrito por WhatsApp"
```

---

### Task 6: README de edición + despliegue en GitHub Pages + DNS

**Files:**
- Create: `README.md`
- Create: `CNAME`

**Interfaces:**
- Consumes: repo `cerostaff/surcocoffee-web`, dominio `surcocoffee.com`.
- Produces: sitio en vivo + guía para el cliente.

- [ ] **Step 1: Crear `CNAME`**

Contenido (una línea, sin espacios):
```
surcocoffee.com
```

- [ ] **Step 2: Crear `README.md` (guía en español para el cliente)**

```markdown
# Surco Coffee — sitio web

Sitio estático (HTML/CSS/JS) hosteado en GitHub Pages: https://surcocoffee.com

## Cómo cambiar el contenido (sin saber programar)

Casi todo lo editable está en **`js/config.js`**. Ábrelo, cambia el valor, guarda
y sube el cambio (o pídelo). Ejemplos:

- **Precios:** en `productos` → `precios`. Ej. `"250": 25000` (sin puntos ni `$`).
- **Textos de un café:** `descripcion` y `ficha` (variedad, altura, proceso, sca).
- **Número de WhatsApp:** `whatsapp` (formato internacional, sin `+`, ej. `573332485064`).
- **Redes y correo:** `instagram`, `facebook`, `email`, `ubicacion`.
- **Fotos del inicio (carrusel):** `hero.slides` (rutas dentro de `assets/img/`).

Para cambiar **fotos**: sube la imagen a `assets/img/` y pon su nombre en
`config.js` (o reemplaza el archivo existente con el mismo nombre).

Los textos largos de las secciones "Fórmula Secreta" y "¿Por qué elegirnos?"
están en `index.html` (busca el texto y edítalo).

## Estructura

- `index.html` — la página.
- `css/styles.css` — colores y tipografías (tokens al inicio).
- `js/config.js` — **datos editables** (productos, precios, textos, contacto).
- `js/tienda.js` — funcionamiento (carrito, carrusel). No hace falta editarlo.
- `assets/img/` — imágenes.

## Ver en local

Abre una terminal en la carpeta y corre `npx --yes serve` (o abre `index.html`).
Pruebas de la lógica del carrito: `npm test`.
```

- [ ] **Step 3: Publicar (push) a `main`**

```bash
git add README.md CNAME
git commit -m "chore: CNAME y guia de edicion"
git push -u origin main
```
Expected: push exitoso al repo `cerostaff/surcocoffee-web`.

- [ ] **Step 4: Activar GitHub Pages (servir desde `main` / raíz)**

```bash
gh api -X POST repos/cerostaff/surcocoffee-web/pages -f "source[branch]=main" -f "source[path]=/" 2>&1 || \
gh api -X PUT  repos/cerostaff/surcocoffee-web/pages -f "source[branch]=main" -f "source[path]=/"
gh api repos/cerostaff/surcocoffee-web/pages --jq '{status:.status, url:.html_url, cname:.cname}'
```
Expected: Pages queda habilitado con `cname: surcocoffee.com`. (Si el CNAME en el repo ya existe, el `build_type` será legacy/branch.)

- [ ] **Step 5: Configurar DNS en Porkbun (acción del usuario)**

Indicar al usuario que en Porkbun (DNS de `surcocoffee.com`) cree:
- **A** `@` → `185.199.108.153`
- **A** `@` → `185.199.109.153`
- **A** `@` → `185.199.110.153`
- **A** `@` → `185.199.111.153`
- **CNAME** `www` → `cerostaff.github.io`
Quitar cualquier registro A/ALIAS previo del apex que apunte a otro sitio.

- [ ] **Step 6: Verificar el sitio en vivo + HTTPS**

Tras propagar el DNS (minutos a horas):
```bash
gh api repos/cerostaff/surcocoffee-web/pages --jq '{status:.status, https:.https_enforced, cname:.cname}'
```
Luego (con WebFetch o navegador) abrir `https://surcocoffee.com` y confirmar que carga el sitio. En Pages, activar **Enforce HTTPS** cuando esté disponible:
```bash
gh api -X PUT repos/cerostaff/surcocoffee-web/pages -F "https_enforced=true" 2>&1 || echo "activar Enforce HTTPS manualmente cuando el certificado este listo"
```
Expected: `https://surcocoffee.com` sirve el sitio con candado (HTTPS).

---

## Self-Review (cobertura del spec)

- Hero + carrusel → Tareas 4 (estructura) + 5 (lógica). ✅
- Fórmula Secreta + mejora misma altura → Tarea 4, Step 1.4. ✅
- Catálogo (3 cafés, ficha, tamaños, precio, agregar) → config (T1) + T4 (contenedor) + T5 (render). ✅
- Carrito + checkout WhatsApp → T2 (lógica probada) + T5 (UI). ✅
- ¿Por qué elegirnos? + footer + flotante WhatsApp → Tarea 4. ✅
- Tokens Organic (colores/fuentes) → Tarea 1. ✅
- Editabilidad por `config.js` → Tarea 1 + README (T6). ✅
- Imágenes (locales optimizadas + marca + placeholder Chiroso) → Tarea 3 (placeholder resuelto por `imagen:null` en config + render en T5). ✅
- Deploy Pages + CNAME + DNS Porkbun + HTTPS → Tarea 6. ✅

Consistencia de tipos: `addItem(cart, product, size)` usa `product.price` (inyectado en T5 `onAdd`/tests como `{...p, price}`), `product.nombre`, `size.etiqueta`, `size.peso`, `product.id`, `size.id` — coherente entre T2 (impl+tests) y T5 (uso). `formatCOP`, `cartTotal`, `cartCount`, `lineTotal`, `changeQty`, `buildOrderMessage`, `waLink` usados con las mismas firmas en T5 y T2. IDs de montaje de T4 coinciden con los `$()` de T5.
