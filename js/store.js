/* ============================================================================
   SEW TRUE — BASKET
   Cart state, persistence, drawer UI and checkout.

   Checkout is deliberately payment-agnostic: CHECKOUT.mode decides whether a
   basket becomes an order request or a Stripe session. Nothing else in the
   site knows or cares which one is switched on.
   ========================================================================= */
(function () {
  'use strict';

  const KEY = 'sewtrue.cart.v1';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const money = (n) => '$' + Number(n).toFixed(2).replace(/\.00$/, '');

  /* -- state -------------------------------------------------------------- */
  let lines = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      // Drop anything that no longer exists in the catalog.
      return raw.filter((l) => l && PRODUCTS.some((p) => p.sku === l.sku))
                .map((l) => ({ sku: l.sku, qty: Math.max(1, Math.min(99, +l.qty || 1)) }));
    } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* private mode */ }
    window.dispatchEvent(new CustomEvent('cart:change'));
  }

  const product = (sku) => PRODUCTS.find((p) => p.sku === sku);
  const count = () => lines.reduce((n, l) => n + l.qty, 0);
  /* How a line describes itself — a bow by its size and number, a sweatshirt
     by its colour and size. */
  function lineMeta(p) {
    if (p.category === 'sweatshirts') return p.colour + ' · ' + APPAREL[p.apparel].label;
    const s = SIZES[p.size];
    return s.label + (p.edition ? ' · No. ' + p.edition : '');
  }
  const subtotal = () => lines.reduce((n, l) => n + product(l.sku).price * l.qty, 0);

  function add(sku, qty) {
    const p = product(sku); if (!p || p.stock < 1) return false;
    const line = lines.find((l) => l.sku === sku);
    const want = (line ? line.qty : 0) + (qty || 1);
    if (want > p.stock) {
      if (!line) return false;
      line.qty = p.stock; save(); return 'capped';
    }
    if (line) line.qty = want; else lines.push({ sku, qty: qty || 1 });
    save(); return true;
  }
  function setQty(sku, qty) {
    const p = product(sku); const line = lines.find((l) => l.sku === sku); if (!line || !p) return;
    if (qty <= 0) { lines = lines.filter((l) => l.sku !== sku); }
    else { line.qty = Math.min(qty, p.stock); }
    save();
  }
  const remove = (sku) => setQty(sku, 0);
  function clear() { lines = []; save(); }

  /* -- drawer ------------------------------------------------------------- */
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add('drawer-open');
    $('#basket').setAttribute('aria-hidden', 'false');
    if (window.lenisInstance) window.lenisInstance.stop();
    setTimeout(() => { const b = $('#basket-close'); if (b) b.focus(); }, 60);
  }
  function close() {
    document.body.classList.remove('drawer-open');
    $('#basket').setAttribute('aria-hidden', 'true');
    if (window.lenisInstance) window.lenisInstance.start();
    resetCheckout();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function render() {
    const body = $('#basket-lines');
    const n = count();
    $$('.basket-count').forEach((el) => {
      el.textContent = n;
      el.classList.toggle('is-empty', n === 0);
    });
    $$('.basket-btn').forEach((b) => b.setAttribute('aria-label', `Basket, ${n} ${n === 1 ? 'item' : 'items'}`));

    if (!body) return;
    if (!lines.length) {
      body.innerHTML = '<p class="basket-empty">Your basket is empty.<span>Every bow is sewn one at a time, so what you see is what exists.</span></p>';
      $('#basket-foot').hidden = true;
      return;
    }
    $('#basket-foot').hidden = false;
    body.innerHTML = lines.map((l) => {
      const p = product(l.sku); const s = SIZES[p.size];
      return `<article class="line" data-sku="${p.sku}">
        <div class="line-thumb">${window.bowMarkup(p, 84)}</div>
        <div class="line-body">
          <h4>${p.name}</h4>
          <p class="line-meta">${lineMeta(p)}</p>
          <div class="line-controls">
            <div class="stepper" role="group" aria-label="Quantity for ${p.name}">
              <button type="button" data-step="-1" aria-label="One fewer">–</button>
              <span aria-live="polite">${l.qty}</span>
              <button type="button" data-step="1" aria-label="One more" ${l.qty >= p.stock ? 'disabled' : ''}>+</button>
            </div>
            <button type="button" class="line-remove" data-remove>Remove</button>
          </div>
        </div>
        <p class="line-price">${money(p.price * l.qty)}</p>
      </article>`;
    }).join('');
    $('#basket-subtotal').textContent = money(subtotal());
  }

  const fabricName = (id) => (FABRICS.find((f) => f.id === id) || { name: id }).name;

  /* -- checkout ----------------------------------------------------------- */
  function orderCode() {
    return 'ST' + Date.now().toString(36).slice(-5).toUpperCase();
  }
  function orderSummary() {
    return lines.map((l) => {
      const p = product(l.sku); const s = SIZES[p.size];
      return `${l.qty} × ${p.name} — ${lineMeta(p)} — ${p.sku} — ${money(p.price * l.qty)}`;
    }).join('\n');
  }
  function resetCheckout() {
    const w = $('#basket-checkout'); if (!w) return;
    w.hidden = true; $('#basket-main').hidden = false;
    const done = $('#basket-done'); if (done) done.hidden = true;
    const err = $('#checkout-error'); if (err) err.hidden = true;
  }

  function startCheckout() {
    if (!lines.length) return;
    if (CHECKOUT.mode === 'stripe' && CHECKOUT.stripeEndpoint) return stripeCheckout();
    $('#basket-main').hidden = true;
    $('#basket-checkout').hidden = false;
    setTimeout(() => { const f = $('#co-name'); if (f) f.focus(); }, 60);
  }

  /* Anonymous, per-browser, never leaves as anything but an opaque string.
     Its only job is so a shopper's own unfinished Stripe session does not
     lock them out of the piece they are trying to buy. */
  function clientId() {
    let id = null;
    try { id = localStorage.getItem('sewtrue.client'); } catch (e) { /* private mode */ }
    if (!id || !/^[a-z0-9]{6,40}$/.test(id)) {
      id = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 24);
      try { localStorage.setItem('sewtrue.client', id); } catch (e) { /* fine */ }
    }
    return id;
  }
  window.SewTrueClient = clientId;

  function stripeCheckout() {
    const btn = $('#basket-checkout-btn'); btn.disabled = true; btn.textContent = 'Opening checkout…';
    fetch(CHECKOUT.stripeEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: clientId(), lines: lines.map((l) => ({ sku: l.sku, qty: l.qty })) }),
    })
      .then((r) => r.json().catch(() => ({})).then((d) => ({ ok: r.ok, status: r.status, d })))
      .then(({ ok, status, d }) => {
        if (ok && d && d.url) { window.location.href = d.url; return; }
        btn.disabled = false; btn.textContent = 'Checkout';

        /* 409 is the one that matters: something in the basket went while
           they were deciding. Say which, take it out, and let the shop
           catch up — do not offer to email an order for a bow that is gone. */
        if (status === 409) {
          if (d && d.sku) remove(d.sku);
          const err = $('#checkout-error');
          if (err) {
            err.hidden = false;
            err.innerHTML = `<p>${(d && d.error) || 'One of those has just gone.'}</p>
              <p>It has been taken out of your basket. Everything else is still yours.</p>`;
          }
          if (window.SewTrueSyncStock) window.SewTrueSyncStock();
          return;
        }
        showError((d && d.error) || 'Card checkout is not responding.');
      })
      .catch((err) => {
        btn.disabled = false; btn.textContent = 'Checkout';
        showError('Card checkout is not responding. ' + err.message);
      });
  }

  function showError(msg) {
    const err = $('#checkout-error'); if (!err) return;
    const body = encodeURIComponent(`Order ${orderCode()}\n\n${orderSummary()}\n\nSubtotal ${money(subtotal())}`);
    err.hidden = false;
    err.innerHTML = `<p>${msg}</p><p>Nothing was lost — <a href="mailto:${SITE.email}?subject=${encodeURIComponent('Bow order')}&body=${body}">send this basket by email instead</a> and we'll pick it up from there.</p>`;
  }

  function submitOrder(e) {
    e.preventDefault();
    const form = e.target;
    const btn = $('#co-submit');
    const data = {
      code: orderCode(),
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      note: form.note.value.trim(),
      fulfilment: form.fulfilment.value,
      items: lines.map((l) => {
        const p = product(l.sku);
        return { sku: p.sku, name: p.name, size: lineMeta(p), qty: l.qty, price: p.price };
      }),
      subtotal: subtotal(),
      summary: orderSummary(),
      placed: new Date().toISOString(),
    };

    $('#checkout-error').hidden = true;
    btn.disabled = true; btn.textContent = 'Sending…';

    const finish = () => {
      btn.disabled = false; btn.textContent = 'Send order';
      $('#basket-checkout').hidden = true;
      const done = $('#basket-done');
      done.hidden = false;
      $('#done-code').textContent = data.code;
      $('#done-total').textContent = money(data.subtotal);
      clear();
    };

    /* No endpoint configured yet → hand the order to the mail client rather
       than pretending it sent. A form that quietly eats an order is worse
       than no form. */
    if (!CHECKOUT.orderEndpoint) {
      const body = encodeURIComponent(
        `Order ${data.code}\n\n${data.summary}\n\nSubtotal ${money(data.subtotal)}\n\n` +
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
        `Fulfilment: ${data.fulfilment}\nNotes: ${data.note || '—'}`
      );
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Bow order ' + data.code)}&body=${body}`;
      finish();
      return;
    }

    fetch(CHECKOUT.orderEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then((r) => r.ok ? r : Promise.reject(new Error('HTTP ' + r.status)))
      .then(finish)
      .catch((err) => {
        btn.disabled = false; btn.textContent = 'Send order';
        showError("That didn't send. " + err.message);
      });
  }

  /* -- wiring ------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.basket-btn');
    if (openBtn) { e.preventDefault(); open(); return; }
    if (e.target.closest('#basket-close') || e.target.closest('.basket-scrim')) { close(); return; }
    if (e.target.closest('#basket-checkout-btn')) { startCheckout(); return; }
    if (e.target.closest('#co-back')) { resetCheckout(); return; }
    if (e.target.closest('#done-close')) { close(); return; }

    const add = e.target.closest('[data-add]');
    if (add) {
      const sku = add.getAttribute('data-add');
      const ok = window.SewTrue.add(sku);
      if (ok) {
        add.classList.add('added');
        const was = add.getAttribute('data-label') || add.textContent;
        add.setAttribute('data-label', was);
        add.textContent = ok === 'capped' ? 'That’s all of them' : 'In the basket';
        setTimeout(() => { add.classList.remove('added'); add.textContent = was; }, 1400);
        if (!e.target.closest('#basket') && window.SewTrueFly) window.SewTrueFly(add);
      }
      return;
    }

    const line = e.target.closest('.line');
    if (line) {
      const sku = line.getAttribute('data-sku');
      const step = e.target.closest('[data-step]');
      if (step) { const l = lines.find((x) => x.sku === sku); setQty(sku, l.qty + Number(step.getAttribute('data-step'))); return; }
      if (e.target.closest('[data-remove]')) { remove(sku); return; }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) close();
  });

  /* ------------------------------------------------------------------------
     COMING BACK FROM STRIPE

     Stripe returns the customer to success_url once the card clears. Nothing
     else on the site knows that happened — so without this the basket would
     still be holding the bow they just bought, which reads as a failed order
     and invites them to pay for it twice.
  ------------------------------------------------------------------------- */
  function handleReturn() {
    const q = new URLSearchParams(location.search);
    const paid = q.get('paid') === '1';
    const cancelled = q.get('checkout') === 'cancelled';
    if (!paid && !cancelled) return;

    /* Out of the address bar first, so a refresh or a forwarded link does not
       replay the confirmation. */
    history.replaceState(null, '', location.pathname + location.hash);

    /* Backed out at Stripe — basket untouched, just show it to them again.
       And give the piece straight back to the shop rather than leaving their
       own abandoned session sitting on a one-of-one for half an hour. */
    if (cancelled) {
      const sid = q.get('session_id');
      if (sid) {
        fetch('/api/release', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sid }),
          keepalive: true,
        }).then(() => { if (window.SewTrueSyncStock) window.SewTrueSyncStock(); })
          .catch(() => { /* it expires on its own within the half hour */ });
      }
      open();
      return;
    }

    const session = q.get('session_id') || '';
    clear();

    const done = $('#basket-done');
    if (!done) return;
    $('#basket-main').hidden = true;
    const co = $('#basket-checkout'); if (co) co.hidden = true;
    done.hidden = false;
    $('#done-code').textContent = session ? session.slice(-8).toUpperCase() : 'received';
    $('#done-total').textContent = 'paid by card';
    const note = done.querySelector('.note');
    if (note) note.textContent = 'Stripe has emailed your receipt. We will follow up with a ship date.';
    open();
  }

  /* Back-navigating out of Stripe restores this page from the bfcache with
     the button still disabled and reading "Opening checkout…". */
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    const btn = $('#basket-checkout-btn');
    if (btn) { btn.disabled = false; btn.textContent = 'Checkout'; }
  });

  window.addEventListener('cart:change', render);
  document.addEventListener('DOMContentLoaded', () => {
    const form = $('#checkout-form');
    if (form) form.addEventListener('submit', submitOrder);
    render();
    handleReturn();   /* after render, so the drawer is populated first */
  });

  window.SewTrue = { add, setQty, remove, clear, count, subtotal, lines: () => lines.slice(), open, close, render, money, fabricName };
})();
