# DESIGN.md · Sew True

> Reverse-derived from the shipped code on 2026-09-25 (`/ezhd-adopt`), not
> designed from scratch. Where the code states the answer it is recorded as
> fact; where it had to be inferred it says so. Read this before touching
> markup or CSS.

---

## 1. Motion language

**Name:** Running stitch *(inferred from the code and the README; confirm)*

**Where it comes from:** her trade is sewing by machine. A dashed thread being
sewn across the page, and a spool paying out thread, are the two physical
things every bow starts with.

**How it shows up:**
1. **The seam.** Dashed threads (`.hero-thread`, `.seam-line`) are clip-wiped
   onto the page as you scroll, so each section looks sewn to the next. In the
   footer, two threads come in from both edges toward the drawn bow.
2. **The spool.** The header progress line is thread coming off a spool that
   turns as it unwinds and rewinds on the way back up (`.head-progress`).
3. **The reel track.** The hero reel's scrubber is one stitch per piece; the
   running stitch fills in while that piece is on screen (`.reel-tick`).

**What it must never do:** stitch every element. Threads belong between
sections and nowhere inside them. No drawn bow ever stands in for a
photograph of one.

**Easing token:** scrubbed stitches run `ease: 'none'` (they track the scroll
exactly, like fabric under a presser foot). Everything else uses
`--ease: cubic-bezier(.22,.61,.36,1)`.

**Mechanism:** GSAP ScrollTrigger scrub for the seams and the spool, Lenis for
smooth scroll (both vendored in `js/vendor/`). Native CSS transition for the
reel track. Everything switches off under `prefers-reduced-motion`.

**Finding (2026-09-25):** the build also runs ribbon wipes on every heading,
fade-up reveals on most paragraphs, a plate drift in the hero, a card hover
lift and a fly-to-basket. That is more motion than one language in two or
three places. Candidates to cut next time the site is touched: the plate drift
and the per-paragraph reveals.

## 2. Palette & roles

Black, bone and grain. **The only colour on the site is the fabric.**

| Role | Token | Value | Used for |
|---|---|---|---|
| surface | `--paper` | `#f1ece2` | page ground |
| raised | `--paper-2` / `--paper-3` | `#e7e0d2` / `#dbd2c1` | plates, cards, quiet buttons |
| ink | `--ink` | `#14110f` | body copy, solid buttons |
| muted ink | `--ink-2` | `#3a3430` | ledes, FAQ answers |
| muted | `--muted` | `#7c7268` | eyebrows, notes, card labels |
| noir | `--noir` / `--noir-2` | `#141110` / `#1e1a18` | the manifesto and drops sections |
| bone | `--bone` / `--bone-dim` | `#ece4d6` / `#a89f92` | type on noir |
| accent | `--accent` | ink year-round; season sets it | one job: the live thread (reel tick, active tab underline, reel tag) |
| line | `--rule` / `--rule-2` | ink at 16% / 32% | hairlines, the double rules on plates |

A season may move `--accent`, `--accent-2`, the three papers and the two
noirs, and nothing else. Values live in `SEASONS[...].tint` in `js/config.js`
and are written onto `<html>` at load. Fall & Halloween 2026 warms the paper
(`#f2e9d9`) and sets the accent to ember `#a8481c`.

**Contrast finding (2026-09-25):** `--muted` on `--paper` is about 4.0:1, under
the 4.5:1 body floor. It is used at small sizes (notes, eyebrows). Darkening it
to about `#6e655c` clears 4.5:1 without changing the look. Not yet changed:
needs the owner's OK.

## 3. Type

- **Display:** Bodoni Moda 400, italic for the second line (`.display em`),
  tracking -0.015em, line-height 0.98. Stops scaling at 4.9rem (`.display`),
  5.5rem (`h1`), 7.2rem (`.display.xl`).
- **Body:** Jost 300 at `clamp(15px, 1.03vw, 17px)`, line-height 1.62, ledes
  capped at 52ch, FAQ answers at 62ch.
- **Labels:** Jost 500, uppercase, 0.16 to 0.26em tracking, 0.6 to 0.84rem.
  This is the letterpress voice of a pattern envelope.
- **Loading:** self-hosted woff2 in `assets/fonts/`, `font-display: swap`,
  Bodoni 400 and Jost 400 preloaded. No CDN.

## 4. Components: what is different here

The reference object is a **vintage sewing-pattern envelope**: double-ruled
plates, letterpress caps, a spec table on the back.

| Element | The decision | The reason |
|---|---|---|
| `.plate` | Paper-2 panel, two inset hairline rules, turned -1.1deg | the front of a pattern envelope |
| `.noir` pinked edges | Sections meet on a zigzag (`::before`/`::after` SVG) | pinking shears, not a straight cut |
| `.selvedge` | Vertical strip of tiny caps down the left of noir sections | the printed selvedge edge of a bolt |
| `.tape` | Uppercase facts between hairlines | a measuring tape / label strip |
| `.card` | Flat paper-2 with one inset rule, square corners | a swatch card |
| `.btn` | Square-cornered (2px), Jost 500. Solid ink or quiet paper-3 | letterpress blocks, never pills |
| `.tag` "Sold" | Square ink label | a price ticket |
| `.basket` | Running-stitch rule down the drawer's left edge | the basket is sewn in too |
| Reel | Photographs only; a piece with no photo says "Still on the machine" | a drawing standing in for a product is a promise the photo has to keep |

## 5. Layout

- Content max-width 1320px, side padding `--pad: clamp(20px, 5vw, 72px)`.
- Breakpoints that exist: 1000px (hero and splits stack, reel above the type),
  760px (nav becomes a scrolling strip under the logo, 2-up grid), 420px.
- Shop grid `repeat(auto-fill, minmax(248px, 1fr))`, 160px minimum on phones.
- Sticky header: 98px desktop, 130px phone. Anchor targets carry
  `scroll-margin-top: var(--head-h)`, which Lenis also reads.

## 6. Depth

Hairlines over elevation. Plates get one long soft shadow; cards are flat
until hover. No shadow ramp.

## 7. Do / Don't

**Do**
- Use her photographs for every product, reel frame and share image.
- Say honestly when something does not exist yet ("Still on the machine").
- Keep square corners on anything clickable.

**Don't**
- Name a location anywhere on the site (they ship everywhere). The one
  exception is the governing-law line in `terms.html`, confirmed 2026-09-25.
- Recolour or reshape her logo, or add any other sewing-machine drawing.
- Use em dashes in copy, titles, meta, alt text or JSON-LD.

## 8. Responsive

Phone first: logo left, basket right, nav as a strip underneath; the reel sits
above the headline. Tap targets are 44px on phones (reel stitches, nav, basket,
footer links). Desktop adds the side-by-side hero and the selvedge strip.

## 9. Data source of truth

**Files:** `js/config.js` (business facts, seasons, drops, checkout) and
`js/catalog.js` (products, prices, stock). Both are read by the page **and**
required by `api/checkout.js`, so the price shown and the price charged come
from one line. Stripe is the inventory (`api/stock.js`); there is no database.

Sub-pages (`404.html`, `privacy.html`, `terms.html`) load `js/config.js` and
`js/page.js`, which fills the email, Instagram, tagline and shipping line from
`SITE`. Their markup carries the same values as a no-JS fallback.

## 10. Launch checklist

- [x] Live on sewtrue.shop, Stripe checkout in live mode
- [x] Custom 404, privacy, terms, robots, sitemap, llms.txt
- [x] Canonical, share image, OnlineStore + Product schema
- [ ] Owner confirms: turnaround time, Instagram handle, care and outdoor copy (`TODO(client)` in source)
- [ ] `node ezhd-lab/verify/audit.mjs --url https://sewtrue.shop` clean
- [ ] Skill pass: `/web-design-guidelines index.html css/main.css`
