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
- `js/cart-core.js` — lógica del carrito (con pruebas en `tests/`).
- `assets/img/` — imágenes.

## Ver en local

Abre una terminal en la carpeta y corre `npx --yes serve` (o abre `index.html`).
Pruebas de la lógica del carrito: `npm test`.
