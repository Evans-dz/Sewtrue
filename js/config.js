/* ============================================================================
   SEW TRUE — SITE CONFIG
   Everything the client can change without touching the rest of the site.
   Anything marked TODO is a PLACEHOLDER and must be confirmed before launch.
   ========================================================================= */

const SITE = {
  name: 'Sew True',
  tagline: 'Bows sewn true, one at a time.',

  /* No location anywhere on this site by design — these ship everywhere. */

  /* TODO(client): confirm these three. */
  email: 'sewtrue26@gmail.com',    // the Stripe profile's business email
  instagram: 'sewtrue',            // TODO — handle without the @
  instagramUrl: 'https://instagram.com/sewtrue', // TODO

  /* TODO(client): confirm fulfilment copy. */
  shipping: 'Flat $6 shipping anywhere in the US. Local pickup can be arranged.', // TODO
  turnaround: 'Ready-to-ship bows post within 2 business days.',                  // TODO

  credit: { label: 'Created and designed by EZHD', url: 'https://ez-hd.co' },
};

/* ---------------------------------------------------------------------------
   SEASONS

   A season is the whole face of the site: the reel that plays in the hero,
   the colours, and which cloth is in rotation. The drop below points at one
   of these by id, and everything follows from that. Nothing else to change.

   To dress the site for a new season:
     1. add a season here,
     2. point the drop at it with `season: 'your-id'`.

   `tint`  — the handful of colours the season is allowed to move. Leave any
             line out and the site keeps its year-round bone-and-ink value.
   `reel`  — the hero. Plays in order, loops, and can be scrubbed by hand.
             Every entry is one thing in the drop, and it does NOT have to be
             a bow — this is where the hoodies, blankets and small goods show.
             An entry with no `photo` renders as an honest "on the machine"
             frame rather than a fake one. Add the photo and it becomes real.
   `cloth` — fabric ids in rotation this season, in the order they should hang
             on the fabric wall. Ids come from FABRICS in catalog.js.
------------------------------------------------------------------------------ */
const SEASONS = {

  'fall-halloween': {
    name: 'Fall & Halloween',
    /* Harvest first, spooky second. The season warms the paper and swaps the
       accent to ember; the bones of the site stay black, bone and grain. */
    tint: {
      '--accent':  '#a8481c',
      '--accent-2':'#7d3413',
      '--paper':   '#f2e9d9',
      '--paper-2': '#e9dfcb',
      '--paper-3': '#dbcfb6',
      '--noir':    '#131010',
      '--noir-2':  '#1d1917',
    },

    /* The hero reel. Order is the order it plays.
       TODO(client): every photo below is a STAND-IN pulled from the bows you
       already sent — they are your real bows, but they are not the Fall &
       Halloween pieces. Replace `photo` on each row as the real shots come in,
       and delete the `standin: true` line when you do. */
    reel: [
      { name: 'Harvest Border',  tag: 'Bow',          meta: 'Regular double · $50',
        photo: 'assets/photos/bow-0721.jpg', href: '#shop', standin: true },

      { name: 'Wheat Field',     tag: 'Bow',          meta: 'Mega · $65',
        photo: 'assets/photos/bow-0733.jpg', href: '#shop', standin: true },

      { name: 'Cider House',     tag: 'Bow',          meta: 'Regular · $35',
        photo: 'assets/photos/bow-0729.jpg', href: '#shop', standin: true },

      /* No photo yet — these render as "on the machine" frames on purpose.
         Add a `photo` line to any of them and it turns into a real frame. */
      { name: 'The fall hoodie', tag: 'Sweatshirt',   meta: 'Cut and sewn for this drop',
        href: '#shop' },

      { name: 'Porch blanket',   tag: 'Blanket',      meta: 'First one ever made',
        href: '#shop' },

      { name: 'Pumpkin keyring', tag: 'Small goods',  meta: 'Made from the offcuts',
        href: '#shop' },
    ],

    /* Cloth on the fabric wall this season, in hanging order.
       TODO(client): swap these for the real Fall & Halloween bolts. Any id
       listed here that has no bow photographed in it yet shows as an honest
       "cut and coming" tile instead of a made-up swatch. */
    cloth: [
      'gingham-tan', 'check-cider', 'dot-wheat', 'patchwork',
      'border-indigo', 'bandana-navy', 'buffalo-red', 'chambray',
    ],
  },

};

/* Which season the site wears when no drop is running. Set to null to keep
   the plain year-round bone-and-ink look between drops. */
const SEASON_BETWEEN = 'fall-halloween';

/* ---------------------------------------------------------------------------
   DROPS

   ONLY ONE DROP IS EVER ON THE SITE. This list holds drops that have been
   announced — the page shows the next one whose `opens` is still in the
   future and nothing else. No calendar of what is coming later.

   When that date passes and nothing else is announced, the section flips
   itself to the "new designs in progress" state. To announce the next drop,
   add a row here. To take the countdown down early, delete the row.

   `season` points at a key in SEASONS above and dresses the whole site.

   Dates are LOCAL time: 'YYYY-MM-DDTHH:MM'.

   The cadence, for reference — Spring, Summer and Fall plus Valentine's,
   Fourth of July, Halloween and Christmas. Do not paste them all in here;
   add each one only when it is ready to be announced.
------------------------------------------------------------------------------ */
const DROPS = [
  {
    id: 'fall-halloween-26', name: 'Fall & Halloween', year: 2026,
    opens: '2026-09-18T19:00',
    season: 'fall-halloween',
    blurb: 'Rust, wheat and flannel, and a spooky half for the porch. Bows, the first hoodie, blankets and small goods.',
    pieces: 24,   // TODO(client): confirm the real count once the drop is cut.
  },
];

/* Copy for the between-drops state. */
const BETWEEN_DROPS = {
  label: 'On the machine',
  title: 'New designs in progress',
  note: 'The next drop is being cut and sewn. It goes up the moment it is finished.',
};

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
  mode: 'stripe',             // 'request' | 'stripe'
  currency: 'USD',
  orderEndpoint: null,        // TODO(client): e.g. 'https://formspree.io/f/xxxxxxx'
  stripeEndpoint: '/api/checkout',   // the Vercel function in api/checkout.js
  taxNote: 'Utah sales tax added at invoice.',  // TODO
};

/* Notify-me signups for drops. Same deal: endpoint or email fallback. */
const NOTIFY = {
  endpoint: null,             // TODO(client): mailing-list or form endpoint
  successNote: "You're on the list. We'll email the morning it opens.",
};

window.SITE = SITE; window.SEASONS = SEASONS; window.SEASON_BETWEEN = SEASON_BETWEEN;
window.DROPS = DROPS; window.BETWEEN_DROPS = BETWEEN_DROPS;
window.CHECKOUT = CHECKOUT; window.NOTIFY = NOTIFY;
