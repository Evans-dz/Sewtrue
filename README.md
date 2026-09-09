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
| `index.html` | The whole page. No SVG artwork library any more — see *Nothing is drawn* |
| `css/main.css` | Design system and every component |
| `js/config.js` | **Client-editable.** Business facts, **seasons + hero reel**, drop calendar, checkout mode |
| `js/catalog.js` | **Client-editable.** Categories, fabrics, sizes, products, stock |
| `js/main.js` | Rendering (reel, shop, cloth wall, sizes, drops, quick view) and scroll motion |
| `js/store.js` | Basket: state, persistence, drawer, checkout |
| `assets/fonts/` | Bodoni Moda + Jost, subset to latin |
| `assets/photos/` | Her photography. Everything on the site comes from here |

## Motion

Three interactions on top of the base scroll grammar:

- **The season reel** (hero). The drop plays as a loop of real photographs —
  bows, hoodies, blankets, small goods, whatever is in it — cross-dissolving
  with a slow push-in. The thread track underneath is one stitch per piece:
  tap one, drag across them, or arrow through with the keyboard. It pauses on
  hover, on focus, while you are dragging, and whenever the tab is hidden.
  Everything in it comes from `SEASONS[...].reel` in `js/config.js`.
- **The door** (`#door-seq`). One sticky stage, five real bows on the same door,
  crossfaded and pushed into as you scroll, captioned with size and price.
  *Caveat: her five shots were taken from slightly different camera distances,
  so this reads as atmosphere, not as a true scale comparison. If she reshoots
  the five from one fixed tripod position it becomes a real size demo.* The
  accurate comparison lives in the Sizes section — her own photographs in
  frames set to each bow's true width against the others, plus the spec table.
- **The spool** (header). The scroll progress line is thread coming off a spool
  that rotates as it unwinds and rewinds when you scroll back up.

All three are native CSS/JS — no library beyond the GSAP/Lenis already vendored
— and all three switch off under `prefers-reduced-motion`.

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

## Nothing is drawn

There is no illustrated artwork left on this site. Every bow, swatch and hero
frame is her own photography. The old SVG bow library and the twelve drawn
fabric patterns have been deleted outright, not just hidden.

Where a photograph does not exist yet, the site **says so** instead of
substituting a drawing:

- a reel entry with no `photo` renders an "on the machine" card,
- a fabric in the drop with nothing sewn in it yet renders "cut and coming",
- a product photo that 404s renders the product name, not a fake bow.

That is deliberate. A drawing standing in for a product is a promise the
photograph has to keep, and hers never quite did.

## Seasons

**A season is the whole face of the site.** `SEASONS` in `js/config.js` holds,
per season: a `tint` (the handful of colour tokens the season may move), a
`reel` (the hero), and `cloth` (which fabrics hang on the wall). A drop points
at one with `season: 'fall-halloween'` and everything follows — hero, palette
and cloth wall together.

Dressing the site for the next season is two edits:

1. add a season block to `SEASONS`,
2. point the new drop row at it.

No markup, no CSS. The tint is written onto `<html>` as custom properties at
load, so a colour change is a hex in the config.

The reel is **not bows-only** — it is the whole line. Each entry is one piece
with a `name`, a `tag` (Bow, Sweatshirt, Blanket, Small goods), a `meta` line
and optionally a `photo`. Leave `photo` off until the shot exists.

While you are working locally the reel logs which photos are still stand-ins,
and the cloth wall warns about any fabric id in a season that is not in
`FABRICS`. Neither appears in production.

## The whole line

`CATEGORIES` in `js/catalog.js` drives the shop tabs: Bows, Sweatshirts,
Blankets, Small goods. A category with `live: false`, or with nothing in stock,
shows a coming-soon shelf rather than an empty grid — so the shop reads as the
full range from day one.

Opening a line is: add products carrying that `category`, then flip `live`.

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

Each drop also names its `season`, which is what dresses the rest of the site.
The live one is **Fall & Halloween, 18 September 2026 at 7pm** — one combined
drop, harvest and spooky together, covering bows, the first hoodie, blankets
and small goods.

The cadence is Spring, Summer and Fall plus Valentine's, Fourth of July,
Halloween and Christmas — but they go in one at a time, when they are ready.

---

## BEFORE THIS GOES LIVE

Everything below is invented or estimated. Search the source for `TODO(client)`.

**Facts we do not have yet** (`js/config.js`)
- Email address, Instagram handle
- Shipping policy, pickup, turnaround times
- Sales tax note
- Piece count for the Fall & Halloween drop (currently 24)

**Photography we do not have yet** — the reel is built and working, but every
frame in it is a stand-in pulled from the summer bows. Nothing here blocks the
site; each one is a single line in `js/config.js`.
- Fall & Halloween bow shots — replace `photo` on the first three reel entries
- The fall hoodie, the porch blanket, the small goods — add a `photo` line to
  those three entries and they stop reading "still on the machine"
- The real Fall & Halloween fabric ids in `SEASONS['fall-halloween'].cloth`,
  and those fabrics added to `FABRICS` in `js/catalog.js`

Run the site locally and the console lists exactly which of these are still
outstanding.

**The logo is hers.** `assets/logo.png` is her supplied artwork, un-matted from
the white JPEG background into a transparent PNG and trimmed to the artwork —
the mark itself is untouched. `logo@2x.png`, `favicon.png`, `favicon.ico` and
`apple-touch-icon.png` are all generated from that same file.

TODO(client): the favicon uses the sewing-machine portion of the lockup, because
the full lockup is unreadable at 32px. Confirm that is acceptable, or supply a
dedicated icon. Also worth asking whether a **horizontal** version of the lockup
exists — the stacked one works but sets the header height.

There is deliberately no other sewing-machine illustration anywhere on the site
— the only mark should be hers.

**Photography is in.** All 21 of her door photographs are wired to products in
`js/catalog.js` (`photo: '0731'` → `assets/photos/bow-0731.jpg` plus a 560px
variant for the grid). Originals were 5712×4284 with EXIF rotation; the web
copies have the rotation baked in and the tag cleared, so they cannot come out
sideways in any pipeline.

**SIZES TO CONFIRM.** Sizes came from her own size-labelled collages, and the
counts match her photos exactly — 4 mini, 4 regular, 6 regular double, 2 mega,
5 mega double. All eleven doubles are certain, because each fabric pairing
appears in only one size. Five singles are a judgement call, because the same
cloth was made in more than one size and the camera distance changes between
shots. They are marked `CHECK` in the catalog:

| Photo | Assigned | Price |
|---|---|---|
| bow-0724 (cider check) | Mini | $25 |
| bow-0729 (cider check) | Regular | $35 |
| bow-0727 (patchwork) | Mini | $25 |
| bow-0732 (patchwork) | Regular | $35 |
| bow-0728 (patchwork) | Mega | $65 |

Five seconds each to confirm; a wrong call is a wrong price.

**Stock** is set to one of one on every piece. Correct any that were made in a run.

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
