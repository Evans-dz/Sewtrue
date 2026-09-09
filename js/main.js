/* ============================================================================
   SEW TRUE — rendering + motion
   ========================================================================= */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '$' + Number(n).toFixed(2).replace(/\.00$/, '');
  const fabric = (id) => FABRICS.find((f) => f.id === id) || { name: id, pattern: 'chambray' };

  /* ======================================================================
     THE PRODUCT TILE

     No photographs exist for this drop yet, so every bow is DRAWN from its
     own cloth — the same SVG bow filled with the fabric's pattern. The moment
     a row in catalog.js gains a `photo`, the picture takes over instead.
     ====================================================================== */
  const priceOf = (p) => p.price;

  /* Nothing is photographed yet. These are OUTLINES on purpose: a bow drawn
     in a named print tells the customer which cloth they are buying, and on a
     final-sale one-of-one that is a promise we cannot keep. The shape is
     honest; the cloth is named when the piece is shot. */
  window.bowMarkup = function (p, height, opts) {
    const o = opts || {};
    if (p.photo && !o.drawn) {
      const b = 'assets/photos/bow-' + p.photo;
      return `<img src="${b}-560.jpg" srcset="${b}-560.jpg 420w, ${b}.jpg 900w"
        sizes="${o.sizes || '(max-width:760px) 46vw, 300px'}" width="900" height="1200"
        alt="${p.name}" loading="lazy" decoding="async"
        onerror="window.bowFallback(this,'${p.sku}')">`;
    }
    if (p.category === 'sweatshirts') return sweatMarkup(p);
    return `<svg class="bow bow-outline" viewBox="0 0 400 470"${height ? ' height="' + height + '"' : ''}
      role="img" aria-label="${p.name}"><use href="#bow-line"/></svg>`;
  };
  window.bowFallback = function (img, sku) {
    const p = PRODUCTS.find((x) => x.sku === sku); if (!p) return;
    img.outerHTML = window.bowMarkup(p, null, { drawn: true });
  };

  /* Sweatshirts are not bows — a plain folded shape in the garment's colour
     rather than a drawn bow, so the two never read as the same thing. */
  function sweatMarkup(p) {
    const dark = /black/i.test(p.colour || '');
    const body = dark ? '#241f1d' : '#a9a29a';
    const shade = dark ? '#15110f' : '#8d867e';
    return `<svg class="bow sweat" viewBox="0 0 400 470" role="img" aria-label="${p.name}, ${p.colour}">
      <path d="M136 96 L100 118 L64 176 L104 206 L128 176 L128 392 L272 392 L272 176 L296 206 L336 176 L300 118 L264 96
               C250 124, 226 136, 200 136 C174 136, 150 124, 136 96 Z" fill="${body}"/>
      <path d="M128 176 L128 392 L200 392 L200 136 C174 136, 150 124, 136 96 L100 118 L64 176 L104 206 L128 176 Z"
            fill="${shade}" opacity=".45"/>
      <path d="M136 96 C150 124, 174 136, 200 136 C226 136, 250 124, 264 96"
            fill="none" stroke="rgba(255,252,246,.42)" stroke-width="3" stroke-dasharray="6 5"/>
      <path d="M128 384 L272 384" stroke="rgba(255,252,246,.3)" stroke-width="3" stroke-dasharray="6 5"/>
    </svg>`;
  }

  /* ======================================================================
     THE SEASON — one drop dresses the whole site.
     Colour tokens are written onto <html> from config.js, so a new season
     never means touching CSS.
     ====================================================================== */
  let SEASON = null;
  function applySeason() {
    const d = nextDrop();
    const id = (d && d.season) || SEASON_BETWEEN;
    SEASON = (id && SEASONS[id]) ? Object.assign({ id }, SEASONS[id]) : null;
    if (!SEASON) return;
    const root = document.documentElement;
    root.setAttribute('data-season', SEASON.id);
    const tint = SEASON.tint || {};
    Object.keys(tint).forEach((k) => root.style.setProperty(k, tint[k]));
  }

  /* ======================================================================
     SITE FACTS
     ====================================================================== */
  function fillSite() {
    $$('[data-site="tagline"]').forEach((el) => { el.textContent = SITE.tagline; });
    $$('[data-site="shipping"]').forEach((el) => { el.textContent = SITE.shipping; });
    $$('[data-site="turnaround"]').forEach((el) => { el.textContent = SITE.turnaround; });
    $$('[data-site="taxnote"]').forEach((el) => { el.textContent = CHECKOUT.taxNote; });
    $$('[data-site="ig-link"]').forEach((el) => { el.href = SITE.instagramUrl; el.rel = 'noopener'; });
    $$('[data-site="mail-link"]').forEach((el) => { el.href = 'mailto:' + SITE.email; });
    $$('[data-site="credit"]').forEach((el) => { el.textContent = SITE.credit.label; el.href = SITE.credit.url; });
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    const note = $('#basket-mode-note');
    if (note) note.textContent = CHECKOUT.mode === 'stripe'
      ? 'Card payment, secured by Stripe.'
      : 'No card needed here — the order comes straight to the shop.';
  }

  /* ======================================================================
     THE SEASON REEL — the hero.

     Plays the current drop in order and loops. It can be dragged, tapped,
     arrowed or tabbed through, and it stops the moment anyone touches it or
     looks away from the tab. Every frame is a photograph; a piece that has
     not been shot yet gets an honest "on the machine" card instead of a
     stand-in image of something else.
     ====================================================================== */
  const REEL = { i: 0, items: [], timer: null, dwell: 5200, held: false };

  /* Stand-in badges are a working aid, not something a customer should read.
     They show while the site is being built locally and never in production. */
  const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
                location.protocol === 'file:';

  function reelItems() {
    if (SEASON && SEASON.reel && SEASON.reel.length) return SEASON.reel;
    /* No season reel configured — never leave the hero empty. Fall back to
       whatever is actually in the shop. */
    return PRODUCTS.filter((p) => p.stock > 0 && p.photo).slice(0, 5).map((p) => ({
      name: p.name, tag: topLabel(p), meta: money(p.price),
      photo: 'assets/photos/bow-' + p.photo + '.jpg', href: '#shop',
    }));
  }

  function buildReel() {
    const stage = $('#reel-stage'); if (!stage) return;
    const items = REEL.items = reelItems();
    if (!items.length) { $('#reel').hidden = true; return; }

    stage.innerHTML = items.map((it, i) => {
      const body = it.photo
        ? `<img src="${it.photo}" alt="${it.name} — ${it.tag || ''}" width="900" height="1200"
             ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">` +
          (it.standin && LOCAL ? '<span class="reel-standin">Stand-in photo</span>' : '')
        : `<div class="reel-blank"><span>${it.tag || ''}</span><b>${it.name}</b>
             <em>Still on the machine</em></div>`;
      return `<div class="reel-frame${i ? '' : ' on'}" data-i="${i}">${body}</div>`;
    }).join('');

    const track = $('#reel-track');
    track.innerHTML = items.map((it, i) =>
      `<button class="reel-tick" type="button" data-reel="${i}"
        aria-label="${it.name}${it.meta ? ' — ' + it.meta : ''}"><i></i></button>`).join('');
    track.style.setProperty('--dwell', (REEL.dwell / 1000) + 's');

    const season = $('#reel-season');
    if (season) season.textContent = SEASON ? SEASON.name : SITE.name;

    show(0);
    if (!REDUCED) play();

    /* A note for whoever is updating the site, not for the page. */
    if (LOCAL) {
      const left = items.filter((x) => x.standin || !x.photo).map((x) => x.name);
      if (left.length) console.info('[Sew True] reel photos still to replace: ' + left.join(', '));
    }
  }

  function show(i) {
    const items = REEL.items;
    if (!items.length) return;
    i = ((i % items.length) + items.length) % items.length;
    REEL.i = i;
    const it = items[i];

    $$('.reel-frame').forEach((f) => f.classList.toggle('on', +f.dataset.i === i));
    $$('.reel-tick').forEach((t, n) => {
      t.classList.remove('run');
      t.classList.toggle('on', n === i);
      t.classList.toggle('done', n < i);
      t.setAttribute('aria-current', n === i ? 'true' : 'false');
    });

    const tag = $('#reel-tag'); if (tag) tag.textContent = it.tag || '';
    const meta = $('#reel-meta'); if (meta) meta.textContent = it.meta || '';
    const name = $('#reel-name');
    if (name) name.innerHTML = it.href
      ? `<a href="${it.href}">${it.name}</a>` : it.name;
    const cap = $('#reel-cap');
    if (cap) cap.textContent = it.photo
      ? (SEASON ? 'In the ' + SEASON.name + ' drop.' : 'In the shop now.')
      : 'Not photographed yet — it goes up with the drop.';
  }

  function play() {
    stop();
    const tick = $$('.reel-tick')[REEL.i];
    if (tick) { void tick.offsetWidth; tick.classList.add('run'); }
    REEL.timer = setTimeout(() => { show(REEL.i + 1); play(); }, REEL.dwell);
  }
  function stop() {
    clearTimeout(REEL.timer); REEL.timer = null;
    const tick = $$('.reel-tick')[REEL.i];
    if (tick) tick.classList.remove('run');
  }
  function goto(i, hold) {
    show(i);
    if (hold || REDUCED) stop(); else play();
  }

  function wireReel() {
    const plate = $('#reel'); if (!plate) return;
    const track = $('#reel-track');

    /* hover, focus and a hidden tab all pause it */
    plate.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') stop(); });
    plate.addEventListener('pointerleave', () => { if (!REEL.held && !REDUCED) play(); });
    plate.addEventListener('focusin', stop);
    plate.addEventListener('focusout', (e) => {
      if (!plate.contains(e.relatedTarget) && !REDUCED) play();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else if (!REDUCED && !REEL.held) play();
    });

    /* tap a stitch */
    track.addEventListener('click', (e) => {
      const t = e.target.closest('[data-reel]');
      if (t) goto(+t.getAttribute('data-reel'));
    });

    /* drag the track to scrub */
    const at = (x) => {
      const r = track.getBoundingClientRect();
      return Math.floor(((x - r.left) / r.width) * REEL.items.length);
    };
    track.addEventListener('pointerdown', (e) => {
      REEL.held = true; stop();
      track.setPointerCapture(e.pointerId);
      goto(at(e.clientX), true);
    });
    track.addEventListener('pointermove', (e) => {
      if (!REEL.held) return;
      const i = at(e.clientX);
      if (i !== REEL.i) goto(i, true);
    });
    const release = () => { REEL.held = false; if (!REDUCED) play(); };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);

    /* arrow through it */
    track.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const i = REEL.i + (e.key === 'ArrowRight' ? 1 : -1);
      goto(i, true);
      const t = $$('.reel-tick')[REEL.i]; if (t) t.focus();
    });

    /* the picture itself is a link to the thing */
    $('#reel-stage').addEventListener('click', () => {
      const it = REEL.items[REEL.i];
      if (it && it.href) {
        const el = document.querySelector(it.href);
        if (el && window.lenisInstance) window.lenisInstance.scrollTo(el, { offset: -70 });
        else if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
      }
    });
  }

  /* ======================================================================
     IS THE SHOP OPEN?

     The pieces are on show before the drop, but none of them can be bought.
     The server enforces the same hour from the same line of config — this is
     only what the customer sees, not what stops them.
     ====================================================================== */
  function dropOpensAt() {
    if (!CHECKOUT.holdUntilDrop) return null;
    const now = Date.now();
    const ts = DROPS.map((d) => new Date(d.opens).getTime())
      .filter((t) => !isNaN(t) && t > now);
    return ts.length ? Math.min.apply(null, ts) : null;
  }
  const shopOpen = () => !dropOpensAt();
  function opensLabel() {
    const t = dropOpensAt(); if (!t) return '';
    const d = new Date(t);
    return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) +
           ' at ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  }
  window.SewTrueShopOpen = shopOpen;

  /* ======================================================================
     WHAT IS LEFT

     Stripe is the inventory. /api/stock says what has sold and what is being
     paid for right now; `made` is what she cut, so `stock` is simply what is
     left of it. Re-derived from `made` every time rather than decremented,
     so a second sync can never double-count.
     ====================================================================== */
  PRODUCTS.forEach((p) => { p.made = p.stock; });
  let stockReady = false;

  async function syncStock(opts) {
    try {
      const who = window.SewTrueClient ? window.SewTrueClient() : '';
      const r = await fetch('/api/stock' + (who ? '?client=' + encodeURIComponent(who) : ''),
        { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const inv = await r.json();
      if (!inv || !inv.ok) {
        /* The shop stays open on its own figures rather than showing a wall
           of false "sold out". */
        if (LOCAL) console.warn('[Sew True] inventory unavailable (' + ((inv && inv.reason) || '?') + ') — showing the catalogue as cut.');
        return false;
      }
      PRODUCTS.forEach((p) => {
        const sold = inv.sold[p.sku] || 0;
        const held = inv.held[p.sku] || 0;
        p.stock = Math.max(0, p.made - sold - held);
        p.sold = sold >= p.made;          /* gone for good, not just held */
      });
      stockReady = true;
      if (!opts || !opts.quiet) {
        renderCats(); renderShop();
        /* The open drawer is looking at the same stock — redraw it too, or a
           stepper click works off numbers that are no longer true. */
        if (window.SewTrue && window.SewTrue.render) window.SewTrue.render();
      }
      return true;
    } catch (err) {
      if (LOCAL) console.warn('[Sew True] /api/stock unreachable —', err.message);
      return false;
    }
  }

  /* the basket asks for a re-read when a piece is refused at the till */
  window.SewTrueSyncStock = syncStock;

  /* Someone may have bought the last one while this tab sat open. Retry
     whether or not the first read succeeded — gating this on a successful
     first sync meant one blip at load and the tab never checked again. */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncStock();
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) syncStock(); });

  /* ======================================================================
     SHOP
     ====================================================================== */
  const state = { cat: 'bows', size: 'all', fab: null };

  function matches(p) {
    if (p.category !== state.cat) return false;
    if (state.size !== 'all' && p.size !== state.size) return false;
    return true;
  }

  /* Sizes that actually have something in them, in order. */
  const sizesInStock = () => Object.keys(SIZES)
    .filter((k) => PRODUCTS.some((p) => p.size === k && p.stock > 0))
    .sort((a, b) => SIZES[a].order - SIZES[b].order);

  /* The size pills follow the drop rather than a hard-coded list, so a size
     with nothing in it never offers an empty filter. */
  function renderSizeFilters() {
    const el = $('#size-filters'); if (!el) return;
    el.innerHTML = '<button type="button" class="pill is-on" data-filter="all">All bows</button>' +
      sizesInStock().map((k) =>
        `<button type="button" class="pill" data-filter="${k}">${SIZES[k].label}</button>`).join('');
  }

  const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  const inStock = (id) => PRODUCTS.filter((p) => p.category === id && p.stock > 0).length;

  /* The whole line is on show from day one. A category with nothing in it yet
     says so plainly instead of rendering an empty grid. */
  function renderCats() {
    const el = $('#cats'); if (!el) return;
    el.innerHTML = CATEGORIES.map((c) => {
      const n = inStock(c.id);
      const on = c.id === state.cat;
      /* "Coming soon" means not made yet. A line that sold out has to say so,
         or the customer is told the opposite of what happened. */
      const made = PRODUCTS.some((p) => p.category === c.id);
      const label = n ? n + ' ready' : (c.live && made ? 'All gone' : 'Coming soon');
      return `<button class="cat${on ? ' is-on' : ''}" type="button" role="tab"
        aria-selected="${on}" data-cat="${c.id}">${c.label}
        <small>${label}</small></button>`;
    }).join('');
  }

  /* What the little line under the title says about this piece. */
  function subtitleOf(p) {
    if (p.category === 'sweatshirts') return p.colour + ' · ' + APPAREL[p.apparel].label;
    const s = SIZES[p.size];
    return s.w + '\u2033 across, ' + s.drop + '\u2033 drop' + (s.bound ? ', bound edge' : '');
  }
  function topLabel(p) {
    if (p.category === 'sweatshirts') return APPAREL[p.apparel].label;
    return SIZES[p.size].label;
  }

  function cardMarkup(p) {
    const sold = p.stock < 1;
    /* Gone for good and "someone is at the till with it" are different
       things, and a customer deserves to know which. */
    const held = sold && !p.sold;
    const stockNote = sold ? (held ? 'In a basket' : 'Sold')
      : (p.category === 'bows' ? 'No. ' + p.edition : p.stock + ' left');
    return `<article class="card${sold ? ' sold' : ''}" data-sku="${p.sku}" data-size="${p.size}">
      ${sold ? `<span class="tag">${held ? 'Held' : 'Sold'}</span>` : ''}
      <div class="card-top"><span>${topLabel(p)}</span><span>${stockNote}</span></div>
      <button class="card-open" type="button" data-qv="${p.sku}" aria-label="Look closer at ${p.name}">
        <span class="card-art"><span class="card-door" aria-hidden="true"></span>${window.bowMarkup(p, null, { strap: false })}</span>
        <span class="card-bot">
          <span class="card-name">${p.name}</span>
          <span class="card-price">${money(p.price)}</span>
        </span>
        <span class="card-meta">${subtitleOf(p)}</span>
      </button>
      ${sold
        ? `<p class="note card-add">${held ? 'Someone is paying for it. Check back in half an hour.' : 'Gone. There was only ever one.'}</p>`
        : (shopOpen()
          ? `<button class="btn btn-quiet card-add" type="button" data-add="${p.sku}">Add to basket</button>`
          : `<p class="note card-add">Opens ${opensLabel()}</p>`)}
    </article>`;
  }

  function renderShop() {
    const grid = $('#shop-grid'); if (!grid) return;
    const cat = catOf(state.cat);
    const soon = $('#shop-soon');
    const sizes = $('#size-filters');
    const count = $('#shop-count');
    const live = cat.live && inStock(cat.id) > 0;
    const soldOut = cat.live && !inStock(cat.id) && PRODUCTS.some((p) => p.category === cat.id);

    /* Announced but not stocked — a shelf, not an empty grid. */
    if (!live) {
      grid.innerHTML = '';
      grid.hidden = true;
      if (sizes) sizes.hidden = true;
      if (count) count.textContent = '';
      if (soon) {
        soon.hidden = false;
        soon.innerHTML = `<p class="eyebrow">${cat.label}</p>
          <h3>${soldOut ? 'All gone.' : 'Coming soon.'}</h3>
          <p>${soldOut ? 'Every one of these has sold. There is never a second run.' : cat.note}</p>
          <a class="btn btn-quiet" href="#drops">Tell me about the next drop</a>`;
      }
      return;
    }

    if (soon) { soon.hidden = true; soon.innerHTML = ''; }
    grid.hidden = false;
    if (sizes) sizes.hidden = cat.id !== 'bows';

    const list = PRODUCTS.filter(matches);
    grid.innerHTML = list.map(cardMarkup).join('');

    const lede = document.querySelector('#shop .lede');
    if (lede) lede.textContent = shopOpen()
      ? 'What is here is what exists. Nothing is reprinted, nothing is backordered.'
      : 'This is the whole drop, laid out before it opens. Nothing can be bought until '
        + opensLabel() + '.';

    const n = list.length;
    const unit = cat.id === 'bows' ? (n === 1 ? ' bow' : ' bows')
                                   : ' ' + cat.label.toLowerCase();
    let label = n + unit;
    if (state.fab) label += ' in ' + fabric(state.fab).name;
    else if (state.size !== 'all') label += ' · ' + SIZES[state.size].label;
    count.innerHTML = label + ((state.fab || state.size !== 'all')
      ? ' &nbsp;·&nbsp; <button type="button" class="linkish" data-clear>Show everything</button>' : '');

    if (!REDUCED && window.gsap) {
      gsap.fromTo(grid.children, { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power2.out', overwrite: true });
    }
  }

  const NUMBER = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
    'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen'];

  /* ------------------------------------------------------------------------
     THE CLOTH WALL

     No bow in this drop has a named fabric yet, so the wall cannot honestly
     claim "three bows in this cloth" or filter by it. Until the pieces are
     photographed and their cloth recorded, it shows the prints in rotation
     and nothing more. Give products a `fabrics` array and it becomes a filter
     again on its own.
  ------------------------------------------------------------------------- */
  const clothIsAssigned = () => PRODUCTS.some((p) => Array.isArray(p.fabrics) && p.fabrics.length);

  function renderQuilt() {
    const q = $('#quilt'); if (!q) return;

    let ids = FABRICS.map((f) => f.id);
    if (SEASON && SEASON.cloth && SEASON.cloth.length) {
      const known = (id) => FABRICS.some((f) => f.id === id);
      if (LOCAL) SEASON.cloth.filter((id) => !known(id)).forEach((id) =>
        console.warn('[Sew True] season cloth "' + id + '" is not in FABRICS (catalog.js) — tile skipped.'));
      ids = SEASON.cloth.filter(known);
    }

    const head = document.querySelector('#fabrics .wipe');
    if (head) head.textContent = (NUMBER[ids.length] || ids.length) + ' fabrics in rotation.';
    const lede = document.querySelector('#fabrics .lede');
    const live = clothIsAssigned();
    if (lede) lede.textContent = live
      ? 'Tap one to see every bow cut from it.'
      : 'The prints on the machine for this drop. Each bow is named for its cloth once it is photographed.';

    q.innerHTML = ids.map((id) => {
      const f = fabric(id);
      const art = `<svg viewBox="0 0 210 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="210" height="210" fill="url(#${f.pattern})"/></svg>`;
      if (!live) {
        return `<div class="swatch still" role="img" aria-label="${f.name}">${art}
          <span>${f.name}</span></div>`;
      }
      const n = PRODUCTS.filter((p) => (p.fabrics || []).indexOf(id) > -1 && p.stock > 0).length;
      return `<button class="swatch" type="button" data-fab="${id}"
        aria-label="${f.name} — ${n} in the shop">${art}<span>${f.name}</span></button>`;
    }).join('');
  }

  /* ======================================================================
     SIZES
     ====================================================================== */
  /* The same size costs different money in the two halves of this drop, so
     the table shows what it actually ranges between rather than one number. */
  function priceRange(sizeKey) {
    const ps = PRODUCTS.filter((p) => p.size === sizeKey && p.stock > 0).map((p) => p.price);
    if (!ps.length) return '&mdash;';
    const lo = Math.min.apply(null, ps), hi = Math.max.apply(null, ps);
    return lo === hi ? money(lo) : money(lo) + '&ndash;' + money(hi);
  }

  function renderSizes() {
    const order = Object.keys(SIZES).sort((a, b) => SIZES[a].order - SIZES[b].order);

    /* The eyebrow counts the sizes rather than asserting a number that was
       true when it was typed. */
    const eyebrow = document.querySelector('#sizes .eyebrow');
    if (eyebrow) eyebrow.textContent = (NUMBER[order.length] || order.length) + ' sizes';
    const body = $('#spec-body');
    if (body) body.innerHTML = order.map((k) => {
      const s = SIZES[k];
      return `<tr><td>${s.label}</td><td>${s.w}&#8243;</td><td>${s.drop}&#8243;</td>
        <td>${s.bound ? 'Bound edge' : (s.layers === 2 ? 'Two fabrics' : 'One fabric')}</td>
        <td>${priceRange(k)}</td></tr>`;
    }).join('');

    /* Each bow is drawn exactly as wide as it really is next to the others.
       Line art rather than a photograph until the drop is shot — it still
       answers the size question honestly, which is the whole job here. */
    const row = $('#scale-row');
    if (row) row.innerHTML = order.map((k) => {
      const s = SIZES[k];
      return `<div class="scale-item" style="--w:calc(var(--u) * ${s.w})">
        <svg class="scale-bow" viewBox="0 0 400 470" aria-hidden="true"><use href="#bow-line"/></svg>
        <b>${s.label}</b><i>${s.w}&#8243;</i></div>`;
    }).join('');
  }

  /* ======================================================================
     THE DOOR — five real bows on one door, crossfaded by scroll
     ====================================================================== */
  /* The door sequence is five photographs of real bows on a real door. There
     is nothing honest to put in its place while the drop is unshot, so the
     section stands down and returns by itself once SIZE_SHOTS exists again. */
  function buildDoor() {
    const shots = (typeof SIZE_SHOTS !== 'undefined' && SIZE_SHOTS)
      ? Object.keys(SIZES).sort((a, b) => SIZES[a].order - SIZES[b].order)
          .map((k) => ({ key: k, size: SIZES[k], photo: SIZE_SHOTS[k] }))
          .filter((x) => x.photo)
      : [];

    const section = $('#door-seq');
    if (!shots.length) { if (section) section.hidden = true; return null; }
    if (section) section.hidden = false;

    const frame = $('#door-frame'); if (!frame) return null;
    frame.innerHTML = shots.map((x, i) =>
      `<img class="door-shot" data-i="${i}" src="assets/photos/bow-${x.photo}.jpg"
        alt="A ${x.size.label.toLowerCase()} bow hanging on a front door"
        ${i ? 'loading="lazy"' : ''} decoding="async">`).join('');
    const ticks = $('#door-ticks');
    if (ticks) ticks.innerHTML = shots.map(() => '<li></li>').join('');
    return shots;
  }

  /* ======================================================================
     DROPS + COUNTDOWN
     ====================================================================== */
  const toDate = (s) => new Date(s.replace(' ', 'T'));
  const nextDrop = () => {
    const now = Date.now();
    return DROPS.filter((d) => toDate(d.opens).getTime() > now)
                .sort((a, b) => toDate(a.opens) - toDate(b.opens))[0] || null;
  };
  const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtTime = (d) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).toLowerCase();

  function renderDrops() {
    const next = nextDrop();
    const card = $('#countdown-card');

    /* Between drops: no date, no clock, just what is actually happening. */
    if (!next) {
      card.classList.add('no-drop');
      $('#cd-label').textContent = BETWEEN_DROPS.label;
      $('#cd-name').textContent = BETWEEN_DROPS.title;
      $('#cd-when').textContent = BETWEEN_DROPS.note;
      const chip = $('#hero-drop-chip');
      if (chip) chip.textContent = 'in progress';
      const nl = $('#notify-form label');
      if (nl) nl.textContent = 'Hear about the next one first';
      return;
    }

    card.classList.remove('no-drop');
    const dt = toDate(next.opens);
    $('#cd-label').textContent = 'Next drop';
    $('#cd-name').textContent = next.name + ' ' + next.year;
    $('#cd-when').textContent = fmtDate(dt) + ' at ' + fmtTime(dt);
    const made = PRODUCTS.reduce((n, p) => n + (p.made || p.stock || 0), 0);
    const count = next.pieces || made;
    $('#cd-blurb').textContent = next.blurb +
      (count ? '  ' + count + ' pieces, and that is the whole run.' : '');
    tickClock(dt);
    setInterval(() => tickClock(dt), 1000);
  }

  const pad = (n) => String(n).padStart(2, '0');
  let openedLive = false;
  let lastTick = {};
  function tickClock(target) {
    let ms = target.getTime() - Date.now();
    if (ms < 0) ms = 0;
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    setNum('cd-d', pad(d)); setNum('cd-h', pad(h)); setNum('cd-m', pad(m)); setNum('cd-s', pad(s));

    const chip = $('#hero-drop-chip');
    if (chip) chip.textContent = d > 0 ? 'in ' + d + (d === 1 ? ' day' : ' days') : 'today';

    /* The moment the hour arrives, open the shop where it stands rather than
       making anyone reload to find out. */
    if (ms <= 0 && !openedLive) {
      openedLive = true;
      renderShop(); renderCats();
      if (window.SewTrue && window.SewTrue.render) window.SewTrue.render();
    }
    const sr = $('#cd-sr');
    if (sr && s === 0) sr.textContent = `${d} days, ${h} hours until the drop opens.`;
  }
  function setNum(id, val) {
    const el = document.getElementById(id); if (!el || lastTick[id] === val) return;
    lastTick[id] = val; el.textContent = val;
    if (REDUCED) return;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
  }

  /* -- notify -------------------------------------------------------------- */
  function wireNotify() {
    const form = $('#notify-form'); if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#notify-email');
      const msg = $('#notify-msg');
      const email = input.value.trim();
      msg.classList.remove('bad');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = 'That email looks off — check it once more.';
        msg.classList.add('bad'); input.focus(); return;
      }
      const drop = nextDrop();
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Adding…';

      const done = (text) => { btn.disabled = false; btn.textContent = 'Notify me'; msg.textContent = text; form.reset(); };
      const fail = (why) => {
        btn.disabled = false; btn.textContent = 'Notify me';
        msg.classList.add('bad');
        msg.innerHTML = `That didn't go through (${why}). <a href="mailto:${SITE.email}?subject=${encodeURIComponent('Add me to the drop list')}">Email us instead</a> and we'll add you by hand.`;
      };

      /* No list endpoint wired yet → hand it to the mail client instead of
         pretending. TODO(client): set NOTIFY.endpoint. */
      if (!NOTIFY.endpoint) {
        const sub = encodeURIComponent('Notify me — ' + (drop ? drop.name + ' ' + drop.year + ' drop' : 'next drop'));
        window.location.href = `mailto:${SITE.email}?subject=${sub}&body=${encodeURIComponent('Please add ' + email + ' to the drop list.')}`;
        done('Opening your email — send that and you are on the list.');
        return;
      }
      fetch(NOTIFY.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, drop: drop ? drop.id : null }),
      }).then((r) => r.ok ? done(NOTIFY.successNote) : Promise.reject(new Error('HTTP ' + r.status)))
        .catch((err) => fail(err.message));
    });
  }

  /* ======================================================================
     QUICK VIEW
     ====================================================================== */
  let qvLast = null;
  function openQV(sku) {
    const p = PRODUCTS.find((x) => x.sku === sku); if (!p) return;
    const s = SIZES[p.size];
    qvLast = document.activeElement;
    $('#qv-art').innerHTML = window.bowMarkup(p, null, { sizes: '(max-width:1000px) 88vw, 400px' });
    $('#qv-no').textContent = p.sku + ' · ' + topLabel(p);
    $('#qv-name').textContent = p.name;
    $('#qv-price').textContent = money(p.price);
    $('#qv-fab').textContent = p.category === 'sweatshirts'
      ? p.colour + ' · ' + APPAREL[p.apparel].label
      : 'Cloth is chosen as it is cut. This one is ' + p.edition + ' at this size.';
    $('#qv-spec').innerHTML = p.category === 'sweatshirts'
      ? `<dt>Size</dt><dd>${APPAREL[p.apparel].label}</dd>` +
        `<dt>Colour</dt><dd>${p.colour}</dd>` +
        `<dt>Made</dt><dd>Two of this size in this colour, and no more</dd>`
      : `<dt>Size</dt><dd>${s.label}</dd>` +
        `<dt>Across</dt><dd>${s.w}&#8243;</dd>` +
        `<dt>Drop</dt><dd>${s.drop}&#8243; with tails</dd>` +
        `<dt>Make</dt><dd>${s.bound ? 'Single layer, edge bound by hand' : (s.layers === 2 ? 'Two fabrics, sewn back to back' : 'Single fabric')}</dd>` +
        `<dt>Hanger</dt><dd>Leather strap, fits a standard wreath hook</dd>`;
    const stock = $('#qv-stock');
    stock.textContent = p.stock < 1
      ? (p.sold ? 'Sold. That one is finished for good.' : 'In someone\'s basket right now.')
      : p.stock === 1 ? 'One of one. When it goes, it is gone.'
      : p.stock + ' left.';
    stock.classList.toggle('low', p.stock > 0 && p.stock <= 2);
    const add = $('#qv-add');
    add.setAttribute('data-add', p.sku);
    const shut = !shopOpen();
    add.disabled = p.stock < 1 || shut;
    add.textContent = p.stock < 1 ? (p.sold ? 'Sold' : 'In a basket')
      : (shut ? 'Opens ' + opensLabel() : 'Add to basket');

    $('#qv').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lenisInstance) window.lenisInstance.stop();
    setTimeout(() => $('.qv-close').focus(), 60);
  }
  function closeQV() {
    $('#qv').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.lenisInstance) window.lenisInstance.start();
    if (qvLast && qvLast.focus) qvLast.focus();
  }

  /* ======================================================================
     FLY TO BASKET
     ====================================================================== */
  window.SewTrueFly = function (fromEl) {
    if (REDUCED) return bump();
    const card = fromEl.closest('.card') || fromEl.closest('.qv-card');
    const art = card && card.querySelector('img');
    const target = $('.basket-btn');
    if (!art || !target) return bump();
    const a = art.getBoundingClientRect(), b = target.getBoundingClientRect();
    const fly = art.cloneNode(true);
    fly.classList.add('fly');
    fly.removeAttribute('height');
    fly.style.left = a.left + a.width / 2 - 22 + 'px';
    fly.style.top = a.top + a.height / 2 - 22 + 'px';
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px,
        ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.24) rotate(14deg)`;
      fly.style.opacity = '0';
    });
    setTimeout(() => { fly.remove(); bump(); }, 720);
  };
  function bump() {
    const c = $('.basket-count'); if (!c) return;
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    setTimeout(() => c.classList.remove('bump'), 340);
  }

  /* ======================================================================
     MOTION — thread drawn on scroll, ribbon wipes, progress
     ====================================================================== */
  function motion() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    if (!REDUCED && window.Lenis) {
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: .95 });
      window.lenisInstance = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -70 });
      });
    }

    if (REDUCED) return;

    /* ribbon wipe — headings unfurl left to right */
    $$('.wipe').forEach((el) => {
      gsap.to(el, {
        clipPath: 'inset(-.28em -1% -.3em 0)', duration: 1.05, ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    $$('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .85, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    /* the thread — clip-wipes so the running stitch appears to be sewn */
    const sew = (sel, trig, from) => {
      $$(sel).forEach((el) => {
        gsap.fromTo(el,
          { clipPath: from === 'right' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0 0 0)', ease: 'none',
            scrollTrigger: { trigger: el.closest(trig) || el, start: 'top 92%', end: 'bottom 55%', scrub: .6 },
          });
      });
    };
    sew('.hero-thread', '.hero');
    sew('.seam-line', '.noir');

    /* the footer must finish drawing before the document runs out of scroll */
    gsap.fromTo('#foot-thread', { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0 0 0)', ease: 'none',
        scrollTrigger: { trigger: '.foot', start: 'top 95%', end: 'top 35%', scrub: .6 } });
    gsap.fromTo('#foot-thread-2', { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0 0 0)', ease: 'none',
        scrollTrigger: { trigger: '.foot', start: 'top 95%', end: 'top 35%', scrub: .6 } });

    /* plate drifts a little as the hero leaves */
    gsap.to('.plate', {
      yPercent: -8, rotate: .4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
    });

    /* ---- Idea 9: the spool unwinds ------------------------------------ */
    const bar = $('.head-progress i');
    const rail = $('.head-progress');
    const spool = $('.spool');
    const spin = $('.spool-spin');
    if (bar) ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const pct = (self.progress * 100).toFixed(2);
        bar.style.width = pct + '%';
        if (spool) spool.style.left = pct + '%';
        if (spin) spin.style.transform = 'rotate(' + (self.progress * 1440).toFixed(1) + 'deg)';
        if (rail) rail.classList.toggle('live', self.progress > 0.004);
      },
    });

    /* ---- Idea 2: the door --------------------------------------------- */
    const shots = window.__doorShots;
    if (shots && shots.length) {
      const imgs = $$('.door-shot');
      const ticks = $$('#door-ticks li');
      const frame = $('#door-frame');
      const n = shots.length;
      let shown = -1;
      const apply = (prog) => {
        const t = prog * (n - 1);
        imgs.forEach((im, i) => { im.style.opacity = Math.max(0, 1 - Math.abs(t - i)).toFixed(3); });
        frame.style.transform = 'scale(' + (1 + prog * 0.11).toFixed(4) + ')';
        const idx = Math.min(n - 1, Math.max(0, Math.round(t)));
        if (idx === shown) return;
        shown = idx;
        ticks.forEach((li, i) => li.classList.toggle('on', i === idx));
        const sz = shots[idx].size;
        $('#door-size').textContent = sz.label;
        $('#door-meta').textContent = sz.w + '\u2033 across · ' + money(sz.price);
      };
      apply(0);
      ScrollTrigger.create({
        trigger: '#door-seq', start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => apply(self.progress),
      });
    }
  }

  /* ======================================================================
     WIRING
     ====================================================================== */
  document.addEventListener('click', (e) => {
    const cat = e.target.closest('[data-cat]');
    if (cat) {
      state.cat = cat.getAttribute('data-cat');
      state.size = 'all'; state.fab = null;
      $$('.pill').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-filter') === 'all'));
      $$('.swatch').forEach((sw) => sw.classList.remove('is-on'));
      renderCats();
      renderShop();
      return;
    }
    const pill = e.target.closest('.pill');
    if (pill) {
      state.size = pill.getAttribute('data-filter');
      state.fab = null;
      $$('.pill').forEach((b) => b.classList.toggle('is-on', b === pill));
      $$('.swatch').forEach((s) => s.classList.remove('is-on'));
      renderShop();
      return;
    }
    const sw = e.target.closest('.swatch[data-fab]');
    if (sw) {
      const id = sw.getAttribute('data-fab');
      state.fab = state.fab === id ? null : id;
      state.size = 'all';
      state.cat = 'bows';
      renderCats();
      $$('.pill').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-filter') === 'all'));
      $$('.swatch').forEach((s) => s.classList.toggle('is-on', s === sw && state.fab));
      renderShop();
      const shop = $('#shop');
      if (window.lenisInstance) window.lenisInstance.scrollTo(shop, { offset: -70 });
      else shop.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
      return;
    }
    if (e.target.closest('[data-clear]')) {
      state.size = 'all'; state.fab = null;
      $$('.pill').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-filter') === 'all'));
      $$('.swatch').forEach((s) => s.classList.remove('is-on'));
      renderShop();
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { openQV(qv.getAttribute('data-qv')); return; }
    if (e.target.closest('[data-qv-close]')) { closeQV(); return; }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('#qv').getAttribute('aria-hidden') === 'false') closeQV();
  });

  document.addEventListener('DOMContentLoaded', () => {
    fillSite();
    applySeason();      /* must run first — the shop and the wall read from it */
    renderCats();
    renderSizeFilters();
    renderShop();
    renderQuilt();
    renderSizes();
    renderDrops();
    wireNotify();
    buildReel();
    wireReel();
    syncStock();   /* Stripe has the last word on what is left */
    window.__doorShots = buildDoor();
    motion();
  });
})();
