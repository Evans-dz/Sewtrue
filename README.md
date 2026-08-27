# Sew True

Handmade fabric door bows. Ready-to-ship shop, seasonal drops with a countdown,
and a basket that checks out today without a payment processor and switches to
Stripe the day the client is ready.

## Run it

```bash
node server.js
```

Then open **http://localhost:4178**. No internet needed — fonts, GSAP and Lenis
are all bundled locally. There is no build step and no framework.

## Shape of it

| | |
|---|---|
| `index.html` | The whole page, plus the fabric + bow SVG library in `<defs>` |
| `css/main.css` | Design system and every component |
| `js/config.js` | **Client-editable.** Business facts, drop calendar, checkout mode |
| `js/catalog.js` | **Client-editable.** Fabrics, sizes, products, stock |
| `js/main.js` | Rendering (shop, quilt, sizes, drops, quick view) and scroll motion |
| `js/store.js` | Basket: state, persistence, drawer, checkout |
| `assets/fonts/` | Bodoni Moda + Jost, subset to latin |
| `assets/photos/` | Empty. Real product photography goes here |

## The design

Black, bone and grain — **the only colour on the site is the fabric.** The
reference language is a vintage sewing-pattern envelope: double-ruled plates,
letterpress caps, a spec table on the back, technical line drawings.

Its scroll grammar is deliberately unlike the other EZHD builds. No preloader,
no pinned horizontal gallery, no crossfading sticky imagery, no tilt cards.
Instead:

- **A running stitch that gets sewn as you scroll.** Dashed threads draw
  themselves between sections and, in the footer, two threads come in from both
  edges and tie into a bow.
- **Pinked seams.** Sections meet on a zigzag cut, like pinking shears.
- **Ribbon wipes.** Headings unfurl left to right instead of masking per character.
- **A quilt wall** of fabric swatches that filters the shop, vertical, not a carousel.
- **Stitch-in countdown digits** rather than a flip clock.

## The bows are drawn, not photographed

Every product renders as an SVG bow filled with an SVG *fabric pattern* —
gingham, bandana paisley, star plaid, homespun check, chambray, patchwork — with
fold shading and inset topstitching. Doubles draw a full-size bow underneath in
the second fabric and a smaller one on top.

**This is a stand-in that also happens to be a feature.** When real photography
arrives, add `photo: 'assets/photos/whatever.jpg'` to a product in
`js/catalog.js` and it takes over. If the file is missing or misnamed, the
drawing comes back automatically — the shop never shows a broken frame.

## Checkout

`CHECKOUT.mode` in `js/config.js` decides everything:

- `'request'` (current) — the basket collects an itemised order and posts it to
  `CHECKOUT.orderEndpoint`. **With no endpoint set it opens a pre-filled email
  instead of pretending to send.** A form that quietly eats an order is worse
  than no form.
- `'stripe'` — POSTs the basket to `CHECKOUT.stripeEndpoint`, which returns
  `{ url }` for a Stripe Checkout Session. Nothing else in the site changes.

Same pattern for drop signups via `NOTIFY.endpoint`.

## Drops

**Only one drop is ever on the site.** `DROPS` in `js/config.js` holds drops that
have been *announced*; the page renders the next one whose `opens` is still in
the future and nothing else. There is no calendar of what is coming later.

When that date passes and nothing else is announced, the section flips itself to
the "new designs in progress" state — copy for it lives in `BETWEEN_DROPS`. To
announce the next drop, add a row. To pull the countdown early, delete the row.

The cadence is Spring, Summer and Fall plus Valentine's, Fourth of July,
Halloween and Christmas — but they go in one at a time, when they are ready.

---

## BEFORE THIS GOES LIVE

Everything below is invented or estimated. Search the source for `TODO(client)`.

**Facts we do not have yet** (`js/config.js`)
- City and state — currently St. George, Utah
- Email address, Instagram handle
- Shipping policy, pickup, turnaround times
- Sales tax note

**THE LOGO — the one blocking item.** The header loads `assets/logo.svg`, then
falls back to `assets/logo.png`, then to a clearly-marked stand-in drawing. That
stand-in is NOT the brand mark and must not ship. Drop her real file in as
`assets/logo.svg` (preferred) or `assets/logo.png` and it appears with no code
change. `assets/favicon.svg` needs replacing from the same file.

There is deliberately no other sewing-machine illustration anywhere on the site
— the only mark should be hers.

**Photography** — `assets/photos/` is empty because macOS blocks reading
`~/Library/Messages/Attachments`. Export the originals into a folder and they
can be wired in.

**Measurements** (`js/catalog.js` → `SIZES`) — the widths and drops are read off
the door photos, not a tape measure. Prices are hers and are correct:
25 / 35 / 50 / 65 / 80.

**Product names, stock counts and SKUs** are ours. The fabrics and sizes are
real; the twenty-one specific bows are a plausible shop, not her inventory.

**Drop dates** are placeholders on sensible weekdays.

**Sweatshirts** — we know they exist and nothing else. Blank, decoration
method, colours, size run and price all need confirming; the section currently
renders honestly as announced-but-not-live.

**About copy** is generic. Needs her actual story, and the section wants one
real photograph — her machine, her table, her hands working.

**No location anywhere.** These sell everywhere, so no city or state appears on
the site by design. Don't reintroduce one.

**Not built yet** — an `og.png` for link previews, and separate `/shop` and
`/drops` routes if SEO wants them (it is one page with anchors today).
