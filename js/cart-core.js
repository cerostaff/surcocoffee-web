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
