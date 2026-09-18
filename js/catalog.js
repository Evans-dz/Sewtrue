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
   size in every colour, so those carry a real count.
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
     carried over from the Mega and are the only invented figures in here. */
  'mega-bound':     { label: 'Mega Bound',   w: 18, drop: 28, layers: 1, bound: true, order: 5 },
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
  { id: 'blankets',    label: 'Blankets',    live: false,
    note: 'Pieced and quilted. First ones land with a later drop.' },
  { id: 'small-goods', label: 'Small goods', live: true,
    note: 'Garland, keyrings and ornaments, made from the offcuts.' },
];

/* -- The drop -------------------------------------------------------------
   `half` puts each piece on the Fall or the Halloween side of the one
   combined drop. Bows are numbered within their group because they are
   genuinely individual — "No. 3 of 8" is a fact, not decoration.
-------------------------------------------------------------------------- */
const PRODUCTS = [
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
     Two designs: the appliqued BOO and the appliqued Ghost. Colour and hat
     tell one Ghost from the next, so the name carries them. */
  { sku: 'HW-SW-BOO-CHAR-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'BOO Sweatshirt', colour: 'Charcoal', photo: 'hoodies/boo-charcoal', price: 60, stock: 1 },
  { sku: 'HW-SW-BOO-GREY-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'BOO Sweatshirt', colour: 'Grey', photo: 'hoodies/boo-grey', price: 60, stock: 1 },
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
  { sku: 'HW-SW-GH-STRSPD-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Ghost, Striped with Spotted Hat', colour: 'Charcoal', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 0 },
  { sku: 'HW-SW-GH-PSTR-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-XL', category: 'sweatshirts', apparel: 'xl', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PSTR-2XL', category: 'sweatshirts', apparel: '2xl', half: 'halloween',
    name: 'Ghost, Purple Striped Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pstripe', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PDCHK-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 2 },
  { sku: 'HW-SW-GH-PDCHK-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 1 },
  { sku: 'HW-SW-GH-PDCHK-XL', category: 'sweatshirts', apparel: 'xl', half: 'halloween',
    name: 'Ghost, Polka Dot with Checkered Hat', colour: 'Charcoal', photo: 'hoodies/ghost-pd-chk', price: 50, stock: 2 },

  /* ---------- Halloween garland ----------
     Three made, all the same, so this is one listing with a count of three
     rather than three one-of-ones. */
  { sku: 'HW-GAR-1', category: 'small-goods', half: 'halloween',
    name: 'Halloween Garland', photo: 'garland/garland', price: 25, stock: 3 },
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
