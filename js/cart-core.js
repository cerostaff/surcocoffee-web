/* Lógica pura del carrito. Sin DOM: probable con `node --test`.
   Se carga como script clásico en el navegador (expone window.CartCore) y
   también funciona como módulo de Node para las pruebas (module.exports). */
(function (global, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.CartCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function formatCOP(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  function lineTotal(item) {
    return item.price * item.qty;
  }

  function cartTotal(cart) {
    return cart.reduce((sum, x) => sum + lineTotal(x), 0);
  }

  function cartCount(cart) {
    return cart.reduce((sum, x) => sum + x.qty, 0);
  }

  function addItem(cart, product, size) {
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

  function changeQty(cart, key, delta) {
    return cart
      .map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : { ...x }))
      .filter((x) => x.qty > 0);
  }

  function buildOrderMessage(cart, textos) {
    const t = textos || {};
    const intro = t.intro || '¡Hola, Surco Coffee! 🌱\n\nMe encantaría llevar este pedido:';
    const totalLabel = t.total || 'Total';
    const outro = t.outro || '¿Me confirman disponibilidad y cómo puedo realizar el pago? ¡Mil gracias! ☕';
    const lines = cart
      .map((x) => `• ${x.prod} — ${x.sizeName} (${x.sizeWeight}) x${x.qty} = ${formatCOP(lineTotal(x))}`)
      .join('\n');
    return `${intro}\n\n${lines}\n\n${totalLabel}: ${formatCOP(cartTotal(cart))}\n\n${outro}`;
  }

  function waLink(phone, message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  return { formatCOP, lineTotal, cartTotal, cartCount, addItem, changeQty, buildOrderMessage, waLink };
});
