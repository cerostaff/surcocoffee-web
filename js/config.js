/* ============================================================================
   CONFIGURACIÓN DE SURCO COFFEE  —  EDITA AQUÍ
   Cambia precios, textos, productos, tamaños, contactos e imágenes.
   No necesitas tocar ningún otro archivo. Guarda y recarga la página.
   ============================================================================ */
window.SURCO = {
  /* --- Contacto y redes --- */
  whatsapp: "573332485064",                                   // número de pedidos (sin +)
  whatsappDisplay: "(+57) 333 2485064",                       // texto legible que se muestra en la página
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
      imagen: "assets/img/bag-tradicional.jpg",
      badge: null,
      ficha: { variedad: "Castillo · Caturra", altura: "1.800–2.200", proceso: "Lavado", sca: "84+" },
      precios: { "250": 25000, "500": 45000, "1000": 85000, "2500": 210000 },
    },
    {
      id: "honey",
      titulo: "Honey",
      nombre: "Proceso Honey",
      descripcion: "Dulzor a panela y fruta madura, cuerpo sedoso. Un perfil redondo y envolvente.",
      imagen: "assets/img/bag-honey.jpg",
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
      precios: { "250": 40000, "500": 75000, "1000": 145000, "2500": 320000 },
    },
  ],
};
