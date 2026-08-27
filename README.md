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

## Motion

Three interactions on top of the base scroll grammar:

- **The bow turns** (hero). Tails, loops and knot are three SVG layers on
  separate Z planes inside one perspective. Rotating the stack parallaxes them
  against each other, so it reads as turning a real bow rather than skewing a
  picture. Driven by pointer position and by scroll through the hero.
- **The door** (`#door-seq`). One sticky stage, five real bows on the same door,
  crossfaded and pushed into as you scroll, captioned with size and price.
  *Caveat: her five shots were taken from slightly different camera distances,
  so this reads as atmosphere, not as a true scale comparison. If she reshoots
  the five from one fixed tripod position it becomes a real size demo.* The
  accurate comparison lives in the Sizes section — line drawings at true
  relative scale, plus the spec table.
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
