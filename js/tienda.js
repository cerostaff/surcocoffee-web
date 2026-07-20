/* Interactividad de la tienda: catálogo, carrusel y carrito.
   Script clásico (no módulo) para que funcione también abriendo el archivo
   directamente. Usa window.CartCore (js/cart-core.js) y window.SURCO (js/config.js). */
(function () {
  'use strict';

  const { formatCOP, lineTotal, cartTotal, cartCount, addItem, changeQty, buildOrderMessage, waLink } = window.CartCore;
  const CFG = window.SURCO;
  const $ = (id) => document.getElementById(id);

  // ============ IDIOMA (i18n) ============
  const TX = window.TEXTOS || { es: { ui: {}, pedido: {} } };
  let lang = 'es';
  try { const saved = localStorage.getItem('surco-lang'); if (saved === 'en' || saved === 'es') lang = saved; } catch (e) {}
  // Texto de interfaz por clave
  const tr = (k) => (TX[lang] && TX[lang].ui[k]) || (TX.es.ui[k]) || '';
  // Contenido de producto localizado (el español vive en config.js; inglés en i18n.js)
  function locProd(p) {
    const ov = lang !== 'es' && TX[lang] && TX[lang].productos && TX[lang].productos[p.id];
    return {
      nombre: (ov && ov.nombre) || p.nombre,
      descripcion: (ov && ov.descripcion) || p.descripcion,
    };
  }
  function locProceso(v) {
    const map = lang !== 'es' && TX[lang] && TX[lang].proceso;
    return (map && map[v]) || v;
  }
  function locSize(s) {
    const ov = lang !== 'es' && TX[lang] && TX[lang].tamanos && TX[lang].tamanos[s.id];
    return { id: s.id, peso: s.peso, etiqueta: (ov && ov.etiqueta) || s.etiqueta, nota: (ov && ov.nota) || s.nota };
  }

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
  function productCard(p, idx) {
    const sizes = CFG.tamanos;
    const sel = state.sel[p.id];
    const price = p.precios[sizes[sel].id] ?? 0;

    const media = p.imagen
      ? `<img src="${p.imagen}" alt="Bolsa Surco ${p.titulo}" style="width:100%; height:100%; object-fit:cover; object-position:${p.imagenPos || 'center'};">`
      : `<div style="width:100%; height:100%; display:grid; place-content:center; text-align:center; padding:16px; color:color-mix(in srgb, var(--color-text) 55%, transparent); font-size:13px; background:var(--color-accent-2-100);">${tr('card.fotoDe')} ${p.titulo}<br>${tr('card.proximamente')}</div>`;
    const badge = p.badge
      ? `<span style="position:absolute; top:10px; left:10px; z-index:2; font-family:var(--font-heading); font-size:12px; padding:5px 12px; border-radius:999px; background:var(--color-accent); color:#fff;">${p.badge}</span>`
      : '';

    const chips = sizes.map((s, i) => {
      const ls = locSize(s);
      return `
      <button type="button" data-add-size data-prod="${p.id}" data-size="${i}"
        style="cursor:pointer; text-align:left; padding:8px 12px; border-radius:14px; transition:transform .12s ease, background .18s ease; ${i === sel ? chipSel : chipUnsel}">
        <span style="display:block; font-family:var(--font-heading); font-size:13px; line-height:1.15;">${ls.etiqueta}</span>
        <span style="display:block; font-size:11px; opacity:.8;">${ls.peso}</span>
      </button>`;
    }).join('');

    const f = p.ficha || {};
    const loc = locProd(p);
    const fichaCell = (label, val) =>
      `<div><div style="font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--color-accent-2-800); margin-bottom:2px;">${label}</div><div style="font-family:var(--font-heading); font-size:15px;">${val || '—'}</div></div>`;

    return `
    <div class="producto-card" data-aos="fade-up" data-aos-delay="${(idx || 0) * 100}" style="flex:1 1 300px; min-width:0; background:#fff; border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:15px;">
      <figure style="position:relative; margin:0; border-radius:var(--radius-md); overflow:hidden; aspect-ratio:1/1; background:#1b1b1b;">
        ${media}${badge}
      </figure>
      <div>
        <h3 style="font-family:var(--font-heading); font-weight:400; font-size:22px; margin:10px 0 4px;">${p.titulo}</h3>
        <p style="font-size:13.5px; line-height:1.5; margin:0; color:color-mix(in srgb, var(--color-text) 66%, transparent);">${loc.descripcion}</p>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 14px; padding:14px 0; border-top:1px solid var(--color-divider); border-bottom:1px solid var(--color-divider);">
        ${fichaCell(tr('card.variedad'), f.variedad)}${fichaCell(tr('card.altura'), f.altura)}${fichaCell(tr('card.proceso'), locProceso(f.proceso))}${fichaCell(tr('card.sca'), f.sca)}
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${chips}</div>
      <p style="margin:0; font-size:12.5px; font-style:italic; color:color-mix(in srgb, var(--color-text) 62%, transparent);">${locSize(sizes[sel]).nota}</p>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:auto;">
        <span style="font-family:var(--font-heading); font-size:24px; color:var(--color-accent-700);">${formatCOP(price)}</span>
        <button type="button" data-add data-prod="${p.id}" class="btn-agregar" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:999px; border:0; background:var(--color-accent-2-600); color:#fff; font-family:var(--font-heading); font-size:14px; transition:transform .12s ease, background .18s ease;">${tr('card.agregar')}</button>
      </div>
    </div>`;
  }

  let catalogoAnimado = false;
  function renderCatalogo() {
    const el = $('catalogo');
    el.innerHTML = CFG.productos.map(productCard).join('');
    // En re-renders (p. ej. al cambiar tamaño) revela las tarjetas de inmediato
    // para que AOS no las deje ocultas; la animación de entrada es solo la primera vez.
    if (catalogoAnimado) el.querySelectorAll('[data-aos]').forEach((n) => n.removeAttribute('data-aos'));
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
        <span style="font-size:13px; letter-spacing:0.06em; text-transform:uppercase; color:color-mix(in srgb, var(--color-text) 65%, transparent);">${tr('cart.total')}</span>
        <span style="font-family:var(--font-heading); font-size:26px; color:var(--color-accent-700);">${formatCOP(cartTotal(state.cart))}</span>
      </div>
      <button type="button" id="cart-checkout" style="cursor:pointer; width:100%; margin-top:14px; padding:12px; border-radius:999px; border:0; background:#25d366; color:#fff; font-family:var(--font-heading); font-size:15px; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:transform .12s ease, filter .18s ease;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.1-1.3A10 10 0 1 0 12 2z"></path></svg>${tr('cart.finalizar')}</button>
      ${state.done ? `<p style="text-align:center; font-size:13px; color:var(--color-accent-2-700); margin:12px 0 0;">${tr('cart.hecho')}</p>` : ''}
    ` : `<p style="font-size:14px; color:color-mix(in srgb, var(--color-text) 55%, transparent); margin:0;">${tr('cart.vacio')}</p>`;

    panel.innerHTML = `
      <div class="cart-pop" style="position:absolute; top:calc(100% + 12px); right:0; width:min(370px,86cqw); background:#fff; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); padding:20px; z-index:60; color:var(--color-text); text-align:left;">
        <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:14px;">
          <h3 style="font-family:var(--font-heading); font-weight:400; font-size:20px; margin:0;">${tr('cart.titulo')}</h3>
          <button type="button" id="cart-close" style="cursor:pointer; border:0; background:transparent; color:color-mix(in srgb, var(--color-text) 55%, transparent); font-size:20px; line-height:1;">×</button>
        </div>
        ${body}
      </div>`;
  }

  // ============ CARRUSEL (con fundido) ============
  function renderDots() {
    $('hero-dots').innerHTML = CFG.hero.slides.map((_, i) =>
      `<button type="button" data-dot="${i}" aria-label="Ir a foto ${i + 1}" style="cursor:pointer; width:10px; height:10px; padding:0; border-radius:50%; border:0; transition:background .3s ease, transform .3s ease; ${i === state.slide ? 'background:#fff; transform:scale(1.25);' : 'background:rgba(255,255,255,0.45);'}"></button>`
    ).join('');
  }
  function renderSlide() {
    const img = $('hero-img');
    const src = CFG.hero.slides[state.slide];
    const reveal = () => { img.src = src; img.style.opacity = '0'; requestAnimationFrame(() => { img.style.opacity = '1'; }); };
    const pre = new Image();
    pre.onload = reveal;
    pre.onerror = () => { img.src = src; img.style.opacity = '1'; };
    pre.src = src;
    renderDots();
  }
  function goSlide(i) { state.slide = (i + CFG.hero.slides.length) % CFG.hero.slides.length; renderSlide(); }

  // ============ CONTACTO ============
  function initContacts() {
    const wa = `https://wa.me/${CFG.whatsapp}`;
    document.querySelectorAll('[data-wa-link]').forEach((a) => { a.href = wa; });
    const set = (id, fn) => { const el = $(id); if (el) fn(el); };
    set('link-ig', (el) => { el.href = CFG.instagram; });
    set('link-fb', (el) => { el.href = CFG.facebook; });
    set('footer-wa', (el) => { el.href = wa; el.textContent = 'WhatsApp ' + CFG.whatsappDisplay; });
    set('footer-email', (el) => { el.textContent = CFG.email; });
    set('footer-ubicacion', (el) => { el.textContent = CFG.ubicacion; });
  }

  // ============ ANIMACIONES ============
  function initAnimations() {
    if (window.AOS && typeof window.AOS.init === 'function') {
      window.AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 90 });
    } else {
      // Si la librería no cargó, revela todo (evita contenido invisible).
      document.querySelectorAll('[data-aos]').forEach((el) => el.removeAttribute('data-aos'));
    }
    catalogoAnimado = true;
  }

  // ============ ACCIONES ============
  function refreshAll() { renderCatalogo(); renderCartBadge(); renderCartPanel(); }

  function onAdd(prodId) {
    const p = CFG.productos.find((x) => x.id === prodId);
    const size = CFG.tamanos[state.sel[prodId]];
    const lp = locProd(p);
    const ls = locSize(size);
    const prodForCart = { id: p.id, nombre: lp.nombre, price: p.precios[size.id] ?? 0 };
    state.cart = addItem(state.cart, prodForCart, ls);
    state.done = false;
    state.cartOpen = true;
    refreshAll();
  }
  function onSelectSize(prodId, i) { state.sel[prodId] = i; renderCatalogo(); }
  function onQty(key, delta) { state.cart = changeQty(state.cart, key, delta); state.done = false; renderCartBadge(); renderCartPanel(); }
  function onToggleCart() { state.cartOpen = !state.cartOpen; renderCartPanel(); }
  function closeCart() { if (state.cartOpen) { state.cartOpen = false; renderCartPanel(); } }
  function onCheckout() {
    if (!state.cart.length) return;
    const textos = (TX[lang] && TX[lang].pedido) || TX.es.pedido;
    window.open(waLink(CFG.whatsapp, buildOrderMessage(state.cart, textos)), '_blank');
    state.done = true;
    renderCartPanel();
  }

  // ============ APLICAR IDIOMA ============
  function applyLanguage(l) {
    lang = (l === 'en') ? 'en' : 'es';
    try { localStorage.setItem('surco-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = tr(el.getAttribute('data-i18n'));
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll('#lang-switch [data-lang]').forEach((b) => {
      const on = b.getAttribute('data-lang') === lang;
      b.style.filter = on ? 'none' : 'grayscale(0.7)';
      b.style.opacity = on ? '1' : '0.5';
      b.style.transform = on ? 'scale(1.06)' : 'none';
    });
    renderCatalogo();
    renderCartBadge();
    renderCartPanel();
  }

  // ============ EVENTOS (delegación) ============
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-add],[data-add-size],[data-qty],[data-dot]');
    const btn = $('cart-btn');
    if (btn && (e.target === btn || btn.contains(e.target))) { onToggleCart(); return; }
    if ($('cart-close') && ($('cart-close') === e.target || $('cart-close').contains(e.target))) { onToggleCart(); return; }
    if ($('cart-checkout') && ($('cart-checkout') === e.target || $('cart-checkout').contains(e.target))) { onCheckout(); return; }
    if (state.cartOpen) {
      const panel = $('cart-panel');
      const insidePanel = panel && panel.contains(e.target);
      if (!insidePanel) closeCart();
    }
    if (!t) return;
    if (t.hasAttribute('data-add')) onAdd(t.getAttribute('data-prod'));
    else if (t.hasAttribute('data-add-size')) onSelectSize(t.getAttribute('data-prod'), Number(t.getAttribute('data-size')));
    else if (t.hasAttribute('data-qty')) onQty(t.getAttribute('data-qty'), Number(t.getAttribute('data-delta')));
    else if (t.hasAttribute('data-dot')) goSlide(Number(t.getAttribute('data-dot')));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
  $('hero-prev').addEventListener('click', () => goSlide(state.slide - 1));
  $('hero-next').addEventListener('click', () => goSlide(state.slide + 1));
  document.querySelectorAll('#lang-switch [data-lang]').forEach((b) => {
    b.addEventListener('click', () => applyLanguage(b.getAttribute('data-lang')));
  });

  // ============ INICIO ============
  applyLanguage(lang);   // pinta textos + catálogo + carrito en el idioma guardado
  renderSlide();
  initContacts();
  initAnimations();
  setInterval(() => goSlide(state.slide + 1), CFG.hero.intervaloMs);
})();
