/* ============================================================================
   SEW TRUE — SITE CONFIG
   Everything the client can change without touching the rest of the site.
   Anything marked TODO is a PLACEHOLDER and must be confirmed before launch.
   ========================================================================= */

const SITE = {
  name: 'Sew True',
  url: 'https://sewtrue.shop',     // the canonical domain: schema, share links
  tagline: 'Bows sewn true, one at a time.',

  /* No location anywhere on this site by design — these ship everywhere. */

  /* TODO(client): confirm these three. */
  email: 'sewtrue26@gmail.com',    // the Stripe profile's business email
  instagram: 'sewtrue',            // TODO — handle without the @
  instagramUrl: 'https://instagram.com/sewtrue', // TODO

  /* TODO(client): confirm fulfilment copy. */
  /* Checkout collects a US shipping address and charges the flat rate, so
     pickup is not offered here. TODO(client): if you want local pickup, say
     so and we add it as a second shipping option at $0. */
  shipping: 'Flat $6 shipping anywhere in the US.',
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
    /* The label on the hero plate and in the reel caption. Fall is the drop
       being launched and the reel is all Fall, so that is what it says.
       Halloween is still in the shop below it. */
    name: 'Fall',
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

    /* The hero reel — her own photographs, whole door for every bow. All
       Fall for the launch; Halloween stays in the shop grid.

       KEEP THIS IN STEP WITH WHAT IS UNSOLD. The reel does not know what has
       sold, so a piece that goes should be swapped out for one that has not,
       or the hero advertises something nobody can buy.

       `meta` is the price, copied from catalog.js. Change both together. */
    reel: [
      { name: 'Hayride',     tag: 'Bow', meta: '$80',
        photo: 'assets/photos/fall/fa-01.jpg', href: '#shop' },
      { name: 'Goldenrod',   tag: 'Bow', meta: '$120',
        photo: 'assets/photos/fall/fa-04.jpg', href: '#shop' },
      { name: 'Prairie',     tag: 'Bow', meta: '$100',
        photo: 'assets/photos/fall/fa-08.jpg', href: '#shop' },
      { name: 'Doe',         tag: 'Bow', meta: '$100',
        photo: 'assets/photos/fall/fa-11.jpg', href: '#shop' },
      { name: 'Cobblestone', tag: 'Bow', meta: '$80',
        photo: 'assets/photos/fall/fa-09.jpg', href: '#shop' },
      { name: 'Fireside',    tag: 'Bow', meta: '$120',
        photo: 'assets/photos/fall/fa-05.jpg', href: '#shop' },
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
/* Fall is listed first because the shop lede reads these in order, and Fall
   is the drop being launched. "Next drop" is worked out by date, not order. */
const DROPS = [
  {
    id: 'fall-26', half: 'fall', name: 'Fall', year: 2026,
    /* Confirmed by the client: noon on Friday 2 October. -06:00 is Mountain
       Daylight Time, which is what Utah is still on in early October — DST
       does not end until 1 November. */
    opens: '2026-10-02T12:00:00-06:00',
    season: 'fall-halloween',
    blurb: 'Rust, wheat and flannel. Warm checks for a cooling porch.',
    pieces: null,
  },
  {
    id: 'halloween-26', half: 'halloween', name: 'Halloween', year: 2026,
    /* ALWAYS carry the offset. A bare '2026-09-18T19:00' means 19:00 wherever
       the code happens to run — the shop would open at 1pm Utah because Vercel
       runs on UTC. -06:00 is Mountain Daylight Time, which is what Utah is on
       in September. */
    opens: '2026-09-18T12:00:00-06:00',
    season: 'fall-halloween',
    blurb: 'Checks, cobwebs and candy corn. Every bow one of one, and no second run.',
    pieces: null,
  },
];

/* --------------------------------------------------------------------------
   Each piece belongs to a half, and each half opens on its own night. A bow
   is not for sale until ITS drop opens, so Halloween can be selling while
   Fall is still shut. Enforced in api/checkout.js, not just on the page.
-------------------------------------------------------------------------- */

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
/* --------------------------------------------------------------------------
   WHAT THE SHOP LISTS

   Only these halves appear. Fall is on show ahead of its drop so people can
   look; its buttons stay shut until noon on 2 October (CHECKOUT.holdUntilDrop
   below). Halloween stays open and buyable alongside it.

   Enforced in api/checkout.js too, so an unlisted piece cannot be bought by
   posting straight at the endpoint.
-------------------------------------------------------------------------- */
const SHOP = { halves: ['fall', 'halloween'] };

/* --------------------------------------------------------------------------
   EARLY ACCESS

   A short window when the shop opens BEFORE the drop — for a friend, a test,
   a photograph. It closes itself at `to`; nobody has to remember to shut it,
   and if this session ends the site still locks on time.

   Both times carry an offset so they mean the same instant on the server as
   in the browser. Set to null to remove it.
-------------------------------------------------------------------------- */
const EARLY_ACCESS = null;

const CHECKOUT = {
  mode: 'stripe',             // 'request' | 'stripe'

  /* CARD CHECKOUT PAUSED (5 Oct 2026, while Stripe reviews the account).
     While true nothing is sent to Stripe: every buy button becomes an email
     to SITE.email with the piece named in it, the basket sends its order by
     email, and api/checkout.js refuses too. `{email}` in the note becomes a
     link to SITE.email. Set paused back to false to sell by card again. */
  paused: true,
  pausedNote: 'Card checkout is paused for now. To order, email Sew True at {email} with the name of the bow you want.',

  /* NOTHING CAN BE BOUGHT until the drop opens. The shop is still on show —
     people can look at what is coming — but every buy button is shut and the
     server refuses a checkout before the hour.

     This is enforced in api/checkout.js as well as in the page, because a
     disabled button is a suggestion and a shop full of one-of-ones needs a
     rule. Set false to sell the moment the site is up. */
  holdUntilDrop: true,
  currency: 'USD',
  orderEndpoint: null,        // TODO(client): e.g. 'https://formspree.io/f/xxxxxxx'
  stripeEndpoint: '/api/checkout',   // the Vercel function in api/checkout.js
  /* No sales tax is charged today — Stripe Tax stays off until a Utah
     registration exists. Do not promise tax handling the checkout does not do.
     TODO(client): once registered, turn on Stripe Tax and say so here. */
  taxNote: 'Price is what you pay. Shipping is added at checkout.',
};

/* Notify-me signups for drops. Same deal: endpoint or email fallback. */
const NOTIFY = {
  endpoint: null,             // TODO(client): mailing-list or form endpoint
  successNote: "You're on the list. We'll email the morning it opens.",
};

/* The browser reads these as globals; the checkout function on the server
   requires this same file, so the page and the till open at the same instant. */
if (typeof window !== 'undefined') {
  window.SITE = SITE; window.SEASONS = SEASONS; window.SEASON_BETWEEN = SEASON_BETWEEN;
  window.DROPS = DROPS; window.BETWEEN_DROPS = BETWEEN_DROPS; window.SHOP = SHOP;
  window.EARLY_ACCESS = EARLY_ACCESS;
  window.CHECKOUT = CHECKOUT; window.NOTIFY = NOTIFY;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SITE, SEASONS, SEASON_BETWEEN, DROPS, BETWEEN_DROPS, SHOP, EARLY_ACCESS, CHECKOUT, NOTIFY };
}
