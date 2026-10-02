/* ============================================================================
   SEW TRUE — CATALOG

   Every piece in the current drop. There are no photographs yet, so the shop
   draws each bow from its own cloth; add a `photo` to any row and the picture
   takes over with nothing else to change.

   Every bow carries its own name and its number within its size — "Cobweb,
   No. 2 of 8". The name is the bow; the number says how few there were.

   `listed: false` keeps a piece out of the shop without deleting it. Used for
   bows that have not been photographed — the shop shows what exists, not what
   was planned. Give it a photo and drop the flag to list it.

   ONE OF ONE. Every bow is a different bow — no two are the same, and when one
   sells it is finished for good. That is why each has its own SKU and a stock
   of 1 rather than a quantity. Sweatshirts are the exception: two of every
   size in every colour, so those carry a real count. So are the two Fall bows
   she made twice (Fawn, Doe); the shop says "2 made" for those, not "one of
   one".
   ========================================================================= */

/* -- Bow sizes ------------------------------------------------------------
   Price lives on the PRODUCT, not here — the same size is priced differently
   in the Fall and Halloween halves of this drop.
-------------------------------------------------------------------------- */
const SIZES = {
  'mini':           { label: 'Mini',         w: 8,  drop: 14, layers: 1, order: 1 },
  'regular':        { label: 'Regular',      w: 12, drop: 20, layers: 1, order: 2 },
  'regular-double': { label: 'Regular Double', w: 14, drop: 22, layers: 2, order: 3 },
  'mega':           { label: 'Mega',         w: 18, drop: 28, layers: 1, order: 4 },
  /* A bound edge rather than a second layer — a different make, not a double.
     TODO(client): confirm the width and drop. These two numbers are guesses
     carried over from the Mega and are the only invented figures in here.
     `unconfirmed` keeps them off the Stripe page and receipt until they are
     real; delete it once she has measured one. */
  'mega-bound':     { label: 'Mega Bound',   w: 18, drop: 28, layers: 1, bound: true, order: 5, unconfirmed: true },
  'mega-double':    { label: 'Mega Double',  w: 20, drop: 30, layers: 2, order: 6 },
};

/* -- Sweatshirt sizes ----------------------------------------------------- */
const APPAREL = {
  's':  { label: 'Small',  order: 1 },
  'm':  { label: 'Medium', order: 2 },
  'l':  { label: 'Large',  order: 3 },
  'xl': { label: 'XL',     order: 4 },
  '2xl':{ label: '2XL',    order: 5 },
};

/* -- Categories -----------------------------------------------------------
   A category with `live: false`, or with nothing in stock, shows a
   coming-soon shelf instead of an empty grid.
-------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: 'bows',        label: 'Bows',        live: true,
    note: 'Five sizes, cut on the grain and sewn, never glued.' },
  { id: 'sweatshirts', label: 'Sweatshirts', live: true,
    note: 'Two of every size in every colour.' },
  { id: 'small-goods', label: 'Small goods', live: true,
    note: 'Garland, keyrings and ornaments, made from the offcuts.' },
];

/* -- The drop -------------------------------------------------------------
   `half` puts each piece on the Fall or the Halloween side of the one
   combined drop. Bows are numbered within their group because they are
   genuinely individual — "No. 3 of 8" is a fact, not decoration.
-------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------- Fall bows ----------
     First in the list, so first in the grid: Fall is the drop being launched.
     Photographed on the same door and wreath as Halloween, cropped the same.
     Names, sizes and prices confirmed by the shop on the review sheet,
     2 October 2026.

     Fawn and Doe were made twice each, identical, so like the garland they
     are one listing with a count of 2 rather than two cards of the same bow.
     No `edition` on these: she never numbered them, and "No. 2 of 2" on both
     of Doe's receipts would not be true. The basket and receipt show the size. */
  { sku: 'FA-REG-1', category: 'bows', size: 'regular', half: 'fall',
    name: 'Hayride', photo: 'fall/fa-01', price: 80, stock: 1 },
  { sku: 'FA-REG-2', category: 'bows', size: 'regular', half: 'fall',
    name: 'Homespun', photo: 'fall/fa-02', price: 60, stock: 1 },
  { sku: 'FA-REG-3', category: 'bows', size: 'regular', half: 'fall',
    name: 'Farmhouse', photo: 'fall/fa-03', price: 100, stock: 1 },
  { sku: 'FA-REG-4', category: 'bows', size: 'regular', half: 'fall',
    name: 'Goldenrod', photo: 'fall/fa-04', price: 120, stock: 1 },
  { sku: 'FA-MBD-1', category: 'bows', size: 'mega-bound', half: 'fall',
    name: 'Fireside', photo: 'fall/fa-05', price: 120, stock: 1 },
  { sku: 'FA-REG-5', category: 'bows', size: 'regular', half: 'fall',
    name: 'Fawn', photo: 'fall/fa-06', price: 80, stock: 2 },
  { sku: 'FA-REG-6', category: 'bows', size: 'regular', half: 'fall',
    name: 'Flannel', photo: 'fall/fa-07', price: 100, stock: 1 },
  { sku: 'FA-REG-7', category: 'bows', size: 'regular', half: 'fall',
    name: 'Prairie', photo: 'fall/fa-08', price: 100, stock: 1 },
  { sku: 'FA-REG-8', category: 'bows', size: 'regular', half: 'fall',
    name: 'Cobblestone', photo: 'fall/fa-09', price: 80, stock: 1 },
  { sku: 'FA-MIN-1', category: 'bows', size: 'mini', half: 'fall',
    name: 'Pebble', photo: 'fall/fa-10', price: 50, stock: 1 },
  { sku: 'FA-MBD-2', category: 'bows', size: 'mega-bound', half: 'fall',
    name: 'Doe', photo: 'fall/fa-11', price: 100, stock: 2 },

  /* ---------- Halloween bows ---------- */
  { sku: 'HW-REG-1', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Harlequin', edition: '1 of 8', photo: 'halloween/hw-04', price: 80, stock: 1 },
  { sku: 'HW-REG-2', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Cobweb', edition: '2 of 8', photo: 'halloween/hw-13', price: 120, stock: 1 },
  { sku: 'HW-REG-3', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Candy Corn', edition: '3 of 8', photo: 'halloween/hw-11', price: 120, stock: 1 },
  { sku: 'HW-REG-4', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Black Cat', edition: '4 of 8', photo: 'halloween/hw-07', price: 60, stock: 1 },
  { sku: 'HW-REG-5', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Goblin', edition: '5 of 8', photo: 'halloween/hw-06', price: 60, stock: 1 },
  { sku: 'HW-REG-6', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Jester', edition: '6 of 8', photo: 'halloween/hw-09', price: 100, stock: 1 },
  { sku: 'HW-REG-7', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Nightshade', edition: '7 of 8', photo: 'halloween/hw-01', price: 80, stock: 1 },
  { sku: 'HW-REG-8', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Hallow\'s Eve', edition: '8 of 8', photo: 'halloween/hw-08', price: 60, stock: 1 },
  { sku: 'HW-MEG-1', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Midnight', edition: '1 of 6', photo: 'halloween/hw-03', price: 100, stock: 1 },
  { sku: 'HW-MEG-2', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Witching Hour', edition: '2 of 6', photo: 'halloween/hw-05', price: 60, stock: 0 },
  { sku: 'HW-MEG-4', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Beetle Stripe', edition: '4 of 6', photo: 'halloween/hw-10', price: 100, stock: 1 },
  { sku: 'HW-MEG-5', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Sugar Skull', edition: '5 of 6', photo: 'halloween/hw-02', price: 80, stock: 1 },
  { sku: 'HW-MBD-2', category: 'bows', size: 'mega-bound', half: 'halloween',
    name: 'Spellbound', edition: '2 of 2', photo: 'halloween/hw-12', price: 120, stock: 0 },

  /* ---------- Halloween sweatshirts ----------
     `group` makes several SKUs share one card: one photograph, one price,
     and a size to choose. A size that has gone greys out and cannot be
     picked, which is also how the scarcity shows.
     Two designs: the appliqued BOO and the appliqued Ghost. Colour and hat
     tell one Ghost from the next, so the name carries them. */
  { sku: 'HW-SW-BOO-CHAR-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'BOO Sweatshirt', colour: 'Charcoal', photo: 'hoodies/boo-charcoal', price: 60, stock: 1 },
  { sku: 'HW-SW-BOO-GREY-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'BOO Sweatshirt', colour: 'Grey', photo: 'hoodies/boo-grey', price: 60, stock: 0 },
  { sku: 'HW-SW-BOO-PURP-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'BOO Sweatshirt', colour: 'Charcoal, purple O', photo: 'hoodies/boo-black', price: 60, stock: 1 },
  { sku: 'HW-SW-BOO-HOOD-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'BOO Hoodie', colour: 'Grey', photo: 'hoodies/boo-hoodie', price: 65, stock: 1 },
  { sku: 'HW-SW-GH-STR-XL', category: 'sweatshirts', apparel: 'xl', half: 'halloween',
    name: 'Ghost, Striped', colour: 'Charcoal', photo: 'hoodies/ghost-stripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-STRPD-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Ghost, Striped with Polka Dot Hat', colour: 'Charcoal', photo: 'hoodies/ghost-str-pd', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-CHKP-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'Ghost, Checkered with Purple Hat', colour: 'Charcoal', photo: 'hoodies/ghost-chk-purp', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-STRPPD-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Ghost, Striped with Purple Polka Dot Hat', colour: 'Charcoal', photo: 'hoodies/ghost-str-ppd', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-S', category: 'sweatshirts', group: 'gh-pstripe', apparel: 's', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-M', category: 'sweatshirts', group: 'gh-pstripe', apparel: 'm', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 0 },
  { sku: 'HW-SW-GH-PSTR-L', category: 'sweatshirts', group: 'gh-pstripe', apparel: 'l', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-XL', category: 'sweatshirts', group: 'gh-pstripe', apparel: 'xl', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-2XL', category: 'sweatshirts', group: 'gh-pstripe', apparel: '2xl', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PDCHK-M', category: 'sweatshirts', group: 'gh-pdchk', apparel: 'm', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 2 },
  { sku: 'HW-SW-GH-PDCHK-L', category: 'sweatshirts', group: 'gh-pdchk', apparel: 'l', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 0 },
  { sku: 'HW-SW-GH-PDCHK-XL', category: 'sweatshirts', group: 'gh-pdchk', apparel: 'xl', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 2 },

  /* ---------- Halloween garland ----------
     All the same, so this is one listing with a count rather than a row each.
     The count is what is left: three were made, one has sold away from the
     site, so Stripe has no record of it and this number carries it instead. */
  { sku: 'HW-GAR-1', category: 'small-goods', half: 'halloween',
    name: 'Halloween Garland', photo: 'garland/garland', price: 25, stock: 2 },
];

/* Cloth in rotation, drawn as SVG patterns until the real photographs exist.
   TODO(client): these are the summer prints. Replace with the Fall and
   Halloween cloth once it is cut. */
const FABRICS = [
  { id: 'buffalo-red',   name: 'Picnic Check',    pattern: 'buffalo-red',   note: 'Big red buffalo check.' },
  { id: 'gingham-red',   name: 'Picnic Gingham',  pattern: 'gingham-red',   note: 'The small check, quarter inch.' },
  { id: 'gingham-tan',   name: 'Harvest Gingham', pattern: 'gingham-tan',   note: 'Homespun rust and tan.' },
  { id: 'check-cider',   name: 'Cider Check',     pattern: 'check-cider',   note: 'Micro check, woven not printed.' },
  { id: 'dot-wheat',     name: 'Wheat Dot',       pattern: 'dot-wheat',     note: 'Cream ground, pin-dot repeat.' },
  { id: 'bandana-red',   name: 'Sunday Bandana',  pattern: 'bandana-red',   note: 'True bandana paisley.' },
  { id: 'bandana-navy',  name: 'Indigo Paisley',  pattern: 'bandana-navy',  note: 'Fine allover paisley, near black in low light.' },
  { id: 'border-indigo', name: 'Indigo Border',   pattern: 'border-indigo', note: 'Banded border print, cut along the edge.' },
  { id: 'star-plaid',    name: 'Old Glory Plaid', pattern: 'star-plaid',    note: 'Burgundy plaid, printed stars.' },
  { id: 'patchwork',     name: 'Homestead Patch', pattern: 'patchwork',     note: 'Pieced by hand before it is cut.' },
  { id: 'chambray',      name: 'Chambray',        pattern: 'chambray',      note: 'Soft-washed shirting chambray.' },
];

/* The browser reads these as globals. The checkout function on the server
   requires this same file, so a price has exactly one source — if these ever
   disagreed, the shop would show one number and charge another. */
if (typeof window !== 'undefined') {
  window.FABRICS = FABRICS; window.CATEGORIES = CATEGORIES; window.SIZES = SIZES;
  window.APPAREL = APPAREL; window.PRODUCTS = PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FABRICS, CATEGORIES, SIZES, APPAREL, PRODUCTS };
}
