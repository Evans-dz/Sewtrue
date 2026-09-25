/* ============================================================================
   SEW TRUE · the small pages (privacy, terms, 404)

   These pages do not load the shop, only js/config.js. This fills in the
   business facts from the same SITE block the shop reads, so an email or a
   shipping line is only ever changed in one place. The markup carries the
   current values too, so the page still reads right without JavaScript.
   ========================================================================= */
(function () {
  'use strict';
  if (typeof SITE === 'undefined') return;

  /* Wear the same season as the shop. Mirrors applySeason() in main.js. */
  if (typeof DROPS !== 'undefined' && typeof SEASONS !== 'undefined') {
    const now = Date.now();
    const next = DROPS.filter((d) => new Date(d.opens).getTime() > now)
      .sort((a, b) => new Date(a.opens) - new Date(b.opens))[0];
    const id = (next && next.season) || (typeof SEASON_BETWEEN !== 'undefined' ? SEASON_BETWEEN : null);
    const tint = id && SEASONS[id] && SEASONS[id].tint;
    if (tint) Object.keys(tint).forEach((k) => document.documentElement.style.setProperty(k, tint[k]));
  }

  const each = (key, fn) => document.querySelectorAll('[data-site="' + key + '"]').forEach(fn);
  each('tagline', (el) => { el.textContent = SITE.tagline; });
  each('shipping', (el) => { el.textContent = SITE.shipping; });
  each('email', (el) => { el.textContent = SITE.email; });
  each('mail-link', (el) => { el.href = 'mailto:' + SITE.email; });
  each('ig-link', (el) => { el.href = SITE.instagramUrl; el.rel = 'noopener'; });
  each('credit', (el) => { el.textContent = SITE.credit.label; el.href = SITE.credit.url; });
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
