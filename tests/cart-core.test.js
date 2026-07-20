const test = require('node:test');
const assert = require('node:assert/strict');
const {
  formatCOP, lineTotal, cartTotal, cartCount,
  addItem, changeQty, buildOrderMessage, waLink,
} = require('../js/cart-core.js');

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
  assert.match(msg, /Hola, Surco Coffee/);
  assert.match(msg, /• Proceso Tradicional — Ritual Diario \(250 g\) x1 = \$25\.000/);
  assert.match(msg, /Total: \$25\.000/);
  assert.match(msg, /pago/);
});

test('waLink codifica el mensaje', () => {
  const url = waLink('573332485064', 'Hola mundo');
  assert.equal(url, 'https://wa.me/573332485064?text=Hola%20mundo');
});
