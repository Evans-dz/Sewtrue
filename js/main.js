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
     THE BOW — draws a product from its own cloth.
     If the product carries a photo, the photo wins; if the photo 404s we
     fall back to the drawing rather than showing a broken frame.
     ====================================================================== */
  window.bowMarkup = function (p, height, opts) {
    const o = opts || {};
    if (p.photo) {
      return `<img src="${p.photo}" alt="${p.name}" loading="lazy" decoding="async"
              onerror="window.bowFallback(this,'${p.sku}')">`;
    }
    const size = SIZES[p.size];
    const a = fabric(p.fabrics[0]).pattern;
    const b = fabric(p.fabrics[1] || p.fabrics[0]).pattern;
    const style = `--fab-a:url(#${a});--fab-b:url(#${b});` +
                  `--back:${size.layers === 2 ? 'block' : 'none'};` +
                  `--strap:${o.strap === false ? 'none' : 'block'}`;
    return `<svg class="bow" viewBox="0 0 400 470"${height ? ' height="' + height + '"' : ''}
            style="${style}" role="img" aria-label="${p.name}"><use href="#${size.layers === 2 ? 'bow2' : 'bow'}"/></svg>`;
  };
  window.bowFallback = function (img, sku) {
    const p = PRODUCTS.find((x) => x.sku === sku); if (!p) return;
    const clone = Object.assign({}, p); delete clone.photo;
    img.outerHTML = window.bowMarkup(clone);
  };

  /* ======================================================================
     SITE FACTS
     ====================================================================== */
  function fillSite() {
    const cityline = SITE.city + ', ' + SITE.state;
    $$('[data-site="cityline"]').forEach((el) => { el.textContent = cityline; });
    $$('[data-site="shipping"]').forEach((el) => { el.textContent = SITE.shipping; });
    $$('[data-site="turnaround"]').forEach((el) => { el.textContent = SITE.turnaround; });
    $$('[data-site="taxnote"]').forEach((el) => { el.textContent = CHECKOUT.taxNote; });
    $$('[data-site="ig-link"]').forEach((el) => { el.href = SITE.instagramUrl; el.rel = 'noopener'; });
    $$('[data-site="mail-link"]').forEach((el) => { el.href = 'mailto:' + SITE.email; });
    $$('[data-site="credit"]').forEach((el) => { el.textContent = SITE.credit.label; el.href = SITE.credit.url; });
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    const sw = $('#sweat-blurb'); if (sw) sw.textContent = SWEATSHIRTS.blurb;
    const sm = $('#sweat-meta');
    if (sm) sm.textContent = SWEATSHIRTS.live
      ? money(SWEATSHIRTS.price) + ' · ' + SWEATSHIRTS.sizes.join(' · ')
      : 'Sizes ' + SWEATSHIRTS.sizes.join(', ') + ' · ' + money(SWEATSHIRTS.price) + ' · not live yet';
    const note = $('#basket-mode-note');
    if (note) note.textContent = CHECKOUT.mode === 'stripe'
      ? 'Card payment, secured by Stripe.'
      : 'No card needed here — the order comes straight to the shop.';
  }

  /* ======================================================================
     SHOP
     ====================================================================== */
  const state = { size: 'all', fab: null };

  function matches(p) {
    if (state.fab && p.fabrics.indexOf(state.fab) === -1) return false;
    if (state.size !== 'all' && p.size !== state.size) return false;
    return true;
  }

  function cardMarkup(p) {
    const s = SIZES[p.size];
    const fabs = p.fabrics.slice().reverse().map((f) => fabric(f).name).join(' over ');
    const sold = p.stock < 1;
    const tag = sold ? 'Sold out' : (p.tag || (p.stock <= 2 ? p.stock + ' left' : ''));
    return `<article class="card${sold ? ' sold' : ''}" data-sku="${p.sku}" data-size="${p.size}">
      ${tag ? `<span class="tag">${tag}</span>` : ''}
      <div class="card-top"><span>No. ${p.no}</span><span>${s.label}</span></div>
      <button class="card-open" type="button" data-qv="${p.sku}" aria-label="Look closer at ${p.name}">
        <span class="card-art"><span class="card-door" aria-hidden="true"></span>${window.bowMarkup(p, null, { strap: false })}</span>
        <span class="card-bot">
          <span class="card-name">${p.name}</span>
          <span class="card-price">${money(s.price)}</span>
        </span>
        <span class="card-meta">${fabs}</span>
      </button>
      ${sold
        ? '<p class="note card-add">Gone. That fabric is finished.</p>'
        : `<button class="btn btn-quiet card-add" type="button" data-add="${p.sku}">Add to basket</button>`}
    </article>`;
  }

  function renderShop() {
    const grid = $('#shop-grid'); if (!grid) return;
    const list = PRODUCTS.filter(matches);
    grid.innerHTML = list.map(cardMarkup).join('');

    const count = $('#shop-count');
    const n = list.length;
    let label = n + (n === 1 ? ' bow' : ' bows');
    if (state.fab) label += ' in ' + fabric(state.fab).name;
    else if (state.size !== 'all') label += ' · ' + SIZES[state.size].label;
    count.innerHTML = label + ((state.fab || state.size !== 'all')
      ? ' &nbsp;·&nbsp; <button type="button" class="linkish" data-clear>Show everything</button>' : '');

    if (!REDUCED && window.gsap) {
      gsap.fromTo(grid.children, { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power2.out', overwrite: true });
    }
  }

  function renderQuilt() {
    const q = $('#quilt'); if (!q) return;
    q.innerHTML = FABRICS.map((f) => {
      const n = PRODUCTS.filter((p) => p.fabrics.indexOf(f.id) > -1 && p.stock > 0).length;
      return `<button class="swatch" type="button" data-fab="${f.id}"
        aria-label="${f.name} — ${n} in the shop">
        <svg viewBox="0 0 210 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="210" height="210" fill="url(#${f.pattern})"/></svg>
        <span>${f.name}</span></button>`;
    }).join('');
  }

  /* ======================================================================
     SIZES
     ====================================================================== */
  function renderSizes() {
    const order = Object.keys(SIZES).sort((a, b) => SIZES[a].order - SIZES[b].order);
    const body = $('#spec-body');
    if (body) body.innerHTML = order.map((k) => {
      const s = SIZES[k];
      return `<tr><td>${s.label}</td><td>${s.w}&#8243;</td><td>${s.drop}&#8243;</td>
        <td>${s.layers === 2 ? 'Two fabrics' : 'One fabric'}</td><td>${money(s.price)}</td></tr>`;
    }).join('');

    const row = $('#scale-row');
    if (row) row.innerHTML = order.map((k) => {
      const s = SIZES[k];
      const h = Math.round(s.w * 8.6);
      return `<div class="scale-item"><svg viewBox="0 0 400 470" height="${h}" aria-hidden="true">
        <use href="#bow-line"/></svg><b>${s.label}</b></div>`;
    }).join('');
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
    const list = $('#drop-list');
    const next = nextDrop();
    if (list) list.innerHTML = DROPS.map((d) => {
      const dt = toDate(d.opens);
      const past = dt.getTime() < Date.now();
      const isNext = next && next.id === d.id;
      return `<li class="drop-row${isNext ? ' is-next' : ''}${past ? ' is-past' : ''}">
        <span class="drop-when">${dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <div><h3 class="drop-name">${d.name} ${d.year}</h3><p class="drop-blurb">${d.blurb}</p></div>
        <span class="drop-pieces">${past ? 'Closed' : d.pieces + ' pieces'}</span>
      </li>`;
    }).join('');

    if (!next) {
      $('#cd-name').textContent = 'To be announced';
      $('#cd-when').textContent = 'The calendar is between drops — join the list and you will hear first.';
      $('#countdown-card').classList.add('no-drop');
      const chip = $('#hero-drop-chip'); if (chip) chip.textContent = 'coming';
      return;
    }
    const dt = toDate(next.opens);
    $('#cd-name').textContent = next.name + ' ' + next.year;
    $('#cd-when').textContent = fmtDate(dt) + ' at ' + fmtTime(dt);
    $('#cd-blurb').textContent = next.blurb;
    tickClock(dt);
    setInterval(() => tickClock(dt), 1000);
  }

  const pad = (n) => String(n).padStart(2, '0');
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
    $('#qv-art').innerHTML = window.bowMarkup(p);
    $('#qv-no').textContent = 'Pattern No. ' + p.no + ' · ' + p.sku;
    $('#qv-name').textContent = p.name;
    $('#qv-price').textContent = money(s.price);
    const front = p.fabrics[p.fabrics.length - 1];
    $('#qv-fab').textContent = p.fabrics.slice().reverse().map((f) => fabric(f).name).join(' over ') +
      ' — ' + fabric(front).note;
    $('#qv-spec').innerHTML =
      `<dt>Size</dt><dd>${s.label}</dd>` +
      `<dt>Across</dt><dd>${s.w}&#8243;</dd>` +
      `<dt>Drop</dt><dd>${s.drop}&#8243; with tails</dd>` +
      `<dt>Layers</dt><dd>${s.layers === 2 ? 'Two fabrics, sewn back to back' : 'Single fabric'}</dd>` +
      `<dt>Hanger</dt><dd>Leather strap, fits a standard wreath hook</dd>`;
    const stock = $('#qv-stock');
    stock.textContent = p.stock < 1 ? 'Sold out — that fabric is finished.'
      : p.stock === 1 ? 'One of one. When it goes, it is gone.'
      : p.stock + ' ready to ship.';
    stock.classList.toggle('low', p.stock > 0 && p.stock <= 2);
    const add = $('#qv-add');
    add.setAttribute('data-add', p.sku);
    add.disabled = p.stock < 1;
    add.textContent = p.stock < 1 ? 'Sold out' : 'Add to basket';

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
    const art = card && card.querySelector('.bow, img');
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
        clipPath: 'inset(0 -1% 0 0)', duration: 1.05, ease: 'power3.inOut',
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

    gsap.fromTo('.foot-bow-art', { opacity: 0, scale: .8, rotate: -8 },
      { opacity: 1, scale: 1, rotate: 0, duration: .9, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.foot', start: 'top 55%' } });

    /* plate drifts a little as the hero leaves */
    gsap.to('.plate', {
      yPercent: -8, rotate: .4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
    });

    /* header progress */
    const bar = $('.head-progress i');
    if (bar) ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { bar.style.width = (self.progress * 100).toFixed(2) + '%'; },
    });
  }

  /* ======================================================================
     WIRING
     ====================================================================== */
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (pill) {
      state.size = pill.getAttribute('data-filter');
      state.fab = null;
      $$('.pill').forEach((b) => b.classList.toggle('is-on', b === pill));
      $$('.swatch').forEach((s) => s.classList.remove('is-on'));
      renderShop();
      return;
    }
    const sw = e.target.closest('.swatch');
    if (sw) {
      const id = sw.getAttribute('data-fab');
      state.fab = state.fab === id ? null : id;
      state.size = 'all';
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
    renderShop();
    renderQuilt();
    renderSizes();
    renderDrops();
    wireNotify();
    motion();
  });
})();
