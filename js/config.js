/* ============================================================================
   SEW TRUE — SITE CONFIG
   Everything the client can change without touching the rest of the site.
   Anything marked TODO is a PLACEHOLDER and must be confirmed before launch.
   ========================================================================= */

const SITE = {
  name: 'Sew True',
  tagline: 'Bows sewn true, one at a time.',

  /* TODO(client): confirm all five of these. */
  city: 'St. George',              // TODO
  state: 'Utah',                   // TODO
  email: 'hello@sewtrue.co',       // TODO
  instagram: 'sewtrue',            // TODO — handle without the @
  instagramUrl: 'https://instagram.com/sewtrue', // TODO

  /* TODO(client): confirm fulfilment copy. */
  shipping: 'Flat $6 shipping in the US. Free local pickup in ' + 'St. George.', // TODO
  turnaround: 'Ready-to-ship bows post within 2 business days.',                 // TODO

  credit: { label: 'Digital experience by EZHD', url: 'https://ez-hd.co' },
};

/* ---------------------------------------------------------------------------
   DROP CALENDAR
   The countdown always targets the next drop whose `opens` is in the future,
   so this list maintains itself — just keep adding rows.
   Dates are LOCAL time, ISO-ish: 'YYYY-MM-DDTHH:MM'.
   TODO(client): every date below is a placeholder. Confirm real drop dates.
------------------------------------------------------------------------------ */
const DROPS = [
  {
    id: 'fall-26', name: 'Fall', year: 2026, opens: '2026-09-18T19:00',
    blurb: 'Rust, wheat and flannel. Warm checks for a cooling porch.',
    pieces: 24, fabrics: ['check-cider', 'dot-wheat', 'gingham-tan', 'star-plaid'],
  },
  {
    id: 'halloween-26', name: 'Halloween', year: 2026, opens: '2026-10-09T19:00',
    blurb: 'Black, bone and a little candy stripe. Small batch, one weekend only.',
    pieces: 16, fabrics: ['bandana-green', 'check-cider', 'star-plaid'],
  },
  {
    id: 'christmas-26', name: 'Christmas', year: 2026, opens: '2026-11-13T19:00',
    blurb: 'The big one. Red gingham, green paisley, and the mega doubles.',
    pieces: 40, fabrics: ['gingham-red', 'bandana-green', 'patchwork', 'bandana-red'],
  },
  {
    id: 'valentines-27', name: "Valentine's", year: 2027, opens: '2027-01-15T19:00',
    blurb: 'Everything sweet and nothing loud.',
    pieces: 18, fabrics: ['gingham-red', 'pincheck-cream', 'bandana-red'],
  },
  {
    id: 'spring-27', name: 'Spring', year: 2027, opens: '2027-03-05T19:00',
    blurb: 'Chambray, cream and the first light checks of the year.',
    pieces: 24, fabrics: ['chambray', 'pincheck-cream', 'gingham-tan'],
  },
  {
    id: 'summer-27', name: 'Summer', year: 2027, opens: '2027-05-14T19:00',
    blurb: 'Bandana season.',
    pieces: 24, fabrics: ['bandana-red', 'bandana-navy', 'chambray'],
  },
  {
    id: 'july4-27', name: 'Fourth of July', year: 2027, opens: '2027-06-11T19:00',
    blurb: 'Stars, stripes, patchwork. Ships before the parade.',
    pieces: 30, fabrics: ['star-plaid', 'patchwork', 'border-indigo', 'gingham-red'],
  },
];

/* ---------------------------------------------------------------------------
   CHECKOUT
   mode: 'request' — cart collects the order and sends it to the shop. No card.
   mode: 'stripe'  — cart POSTs to `endpoint`, which returns { url } to redirect
                     to a Stripe Checkout Session. Flip the mode, add the
                     endpoint, and every other line of cart code stays put.

   `orderEndpoint` (request mode): any form backend that accepts JSON POST —
   Formspree, Netlify Forms, a Vercel function, whatever. Leave it null and the
   cart falls back to opening a pre-filled email. It never fails silently.
------------------------------------------------------------------------------ */
const CHECKOUT = {
  mode: 'request',            // 'request' | 'stripe'
  currency: 'USD',
  orderEndpoint: null,        // TODO(client): e.g. 'https://formspree.io/f/xxxxxxx'
  stripeEndpoint: null,       // TODO(client): e.g. '/api/checkout'
  taxNote: 'Utah sales tax added at invoice.',  // TODO
};

/* Notify-me signups for drops. Same deal: endpoint or email fallback. */
const NOTIFY = {
  endpoint: null,             // TODO(client): mailing-list or form endpoint
  successNote: "You're on the list. We'll email the morning it opens.",
};

window.SITE = SITE; window.DROPS = DROPS; window.CHECKOUT = CHECKOUT; window.NOTIFY = NOTIFY;
