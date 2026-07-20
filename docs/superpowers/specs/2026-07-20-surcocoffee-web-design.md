# Surco Coffee — Sitio web (diseño / spec)

**Fecha:** 2026-07-20
**Repo:** `cerostaff/surcocoffee-web` (rama `main`)
**Dominio:** `surcocoffee.com` (Porkbun) → hosting en GitHub Pages
**Fuente de diseño:** proyecto Claude Design `Organic`, archivo `ProposalMarket.dc.html`

## 1. Objetivo

Publicar la landing/tienda de Surco Coffee replicando fielmente el diseño
`ProposalMarket.dc.html`, pero convertido a **HTML/CSS/JS estático puro** (sin
framework ni paso de build) para que:

1. Se pueda hostear directamente en GitHub Pages desde la rama `main`.
2. El cliente pueda cambiar productos, precios, textos, número de WhatsApp e
   imágenes editando **un solo archivo** (`js/config.js`), sin tocar el resto.

## 2. Alcance (una sola página)

El diseño es one-page. Secciones, en orden:

1. **Hero** — carrusel de fotos de finca con auto-avance (5 s), flechas y dots;
   logo arriba-izquierda; botón de carrito arriba-derecha con contador y total.
   Título "El mercado de Surco" + subtítulo.
2. **Nuestra Fórmula Secreta** — 4 pasos (recolección → tostión → molienda →
   empaque) con foto al lado. **Mejora pedida:** imagen y texto en columnas
   **paralelas de la misma altura** (hoy la foto sobresale respecto al texto).
3. **Catálogo** — 3 cafés (Tradicional, Honey, Chiroso). Cada tarjeta: foto,
   nombre, descripción, ficha técnica (variedad, altura, proceso, puntaje SCA),
   selector de tamaño (250 g / 500 g / 1 kg / 2.5 kg), precio dinámico y botón
   "Agregar". Chiroso lleva badge "Edición especial".
4. **¿Por qué elegirnos?** — 3 tarjetas (01/02/03).
5. **Footer** — logo, descripción, redes (Instagram, Facebook, WhatsApp),
   columnas Tienda / Origen / Contacto, línea de copyright.
6. **Botón flotante de WhatsApp** ("¿Hablamos?") fijo abajo-derecha.

### Carrito + checkout
- Estado en memoria (sin backend). Agregar/quitar unidades, total en COP.
- **Checkout por WhatsApp:** arma un mensaje con las líneas del pedido y el
  total y abre `wa.me/<numero>?text=...`. Mismo comportamiento que el diseño.

## 3. Sistema de diseño (tokens "Organic")

Se replican los tokens del `styles.css` original:
- Colores: fondo `#f5ead8`, superficie `#ebddc5`, texto `#201e1d`,
  acento terracota `#c67139`, acento-2 verde oliva `#7a8a5e`, más las rampas
  tonales (neutral / accent / accent-2, pasos 100–900).
- Tipografías (Google Fonts): **Caprasimo** (títulos), **Figtree** (texto).
- Radios (8/16/28 px, controles tipo píldora), sombras suaves, espaciados.

Los tokens viven como variables CSS en `:root` dentro de `css/styles.css`.

## 4. Arquitectura de archivos

```
surcocoffee/
├── index.html            # markup semántico de la página
├── css/
│   └── styles.css        # tokens Organic + estilos de todas las secciones
├── js/
│   ├── config.js         # ← EL CLIENTE EDITA AQUÍ (datos y textos)
│   └── tienda.js         # lógica: render de catálogo, carrito y carrusel
├── assets/
│   └── img/              # imágenes optimizadas
├── CNAME                 # surcocoffee.com
├── README.md             # guía breve "cómo editar" (en español)
└── .gitignore
```

**Separación de responsabilidades:**
- `config.js` — **datos**: no tiene lógica. Un objeto global `window.SURCO`.
- `tienda.js` — **comportamiento**: lee `window.SURCO` y pinta/actualiza el DOM.
  El cliente normalmente no lo toca.
- `styles.css` — **apariencia**: tokens + estilos.
- `index.html` — estructura y contenido estático (textos de secciones fijas).

### Forma de `config.js` (borrador)
```js
window.SURCO = {
  whatsapp: "573332485064",                 // número para pedidos (formato intl., sin +)
  email: "surcocoffeealmadefinca@gmail.com",
  instagram: "https://instagram.com/surcocoffee",
  facebook: "https://www.facebook.com/profile.php?id=61585849805519",
  ubicacion: "Versalles, Antioquia",

  hero: {
    intervaloMs: 5000,
    slides: ["assets/img/hero-1.jpg", "assets/img/hero-2.jpg", /* ... */],
  },

  // Tamaños compartidos por todos los cafés
  tamanos: [
    { id: "250",  etiqueta: "Ritual Diario",    peso: "250 g", nota: "Perfecto para disfrutar cada día." },
    { id: "500",  etiqueta: "Alma de Casa",     peso: "500 g", nota: "..." },
    { id: "1000", etiqueta: "Reserva Familiar", peso: "1 kg",  nota: "..." },
    { id: "2500", etiqueta: "Surco Abundante",  peso: "2.5 kg", nota: "..." },
  ],

  productos: [
    {
      id: "tradicional",
      nombre: "Tradicional",
      descripcion: "Chocolate, caramelo y sutiles matices frutales...",
      imagen: "assets/img/bag-tradicional.png",
      badge: null,
      ficha: { variedad: "Castillo · Caturra", altura: "1.800–2.200", proceso: "Lavado", sca: "84+" },
      precios: { "250": 25000, "500": 45000, "1000": 85000, "2500": 210000 },
    },
    // honey, chiroso...
  ],
};
```
El cliente cambia precios en `precios`, textos en `descripcion`/`ficha`, o el
número en `whatsapp`, y el sitio se actualiza solo. Formato de precio COP
(`$25.000`) lo calcula `tienda.js`.

## 5. Imágenes

- **Fotos grandes (hero + Fórmula):** vienen de las carpetas locales
  `Imagenes hero/` (fotos -48, -22, -37, -4) y `Imagen Seccion Receta/` (-52).
  Están en full-res (10–17 MB) → se **optimizan** (redimensionar a ~1600 px de
  ancho, comprimir) y se guardan en `assets/img/`.
- **Assets de marca** (bolsas Tradicional/Honey, logos `logo-16`/`logo-06`,
  `surco-icon.png`): se bajan del proyecto Claude Design vía el conector.
- **Chiroso:** placeholder visible hasta tener la foto real.
- Las carpetas locales originales se retiran del repo tras optimizar (no se
  suben los pesados full-res).

## 6. Despliegue (GitHub Pages + Porkbun)

- **Pages:** servir desde rama `main`, carpeta raíz (`/`). Sin build.
- **CNAME:** archivo `CNAME` con `surcocoffee.com`.
- **DNS en Porkbun:**
  - 4 registros **A** de `surcocoffee.com` (apex) → IPs de GitHub Pages:
    `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  - Registro **CNAME** de `www` → `cerostaff.github.io`.
  - Activar **Enforce HTTPS** en Pages una vez propague el DNS.

## 7. Fuera de alcance (YAGNI)

- Sin backend, base de datos, pasarela de pago ni carrito persistente.
- Sin panel de administración: la edición es por `config.js`.
- Sin páginas adicionales (blog, etc.) por ahora.

## 8. Criterios de éxito

1. El sitio se ve fiel al diseño `ProposalMarket.dc.html` en desktop y móvil.
2. Carrusel, selector de tamaño, carrito y checkout por WhatsApp funcionan.
3. La sección "Fórmula Secreta" tiene imagen y texto a la misma altura.
4. Cambiar un precio/texto/imagen se hace solo en `config.js`.
5. Publicado en `https://surcocoffee.com` vía GitHub Pages con HTTPS.
