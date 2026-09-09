/* ============================================================================
   SEW TRUE — CATALOG

   Every piece in the current drop. There are no photographs yet, so the shop
   draws each bow from its own cloth; add a `photo` to any row and the picture
   takes over with nothing else to change.

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
  { id: 'small-goods', label: 'Small goods', live: false,
    note: 'Keyrings, scrunchies and ornaments, made from the offcuts.' },
];

/* -- The drop -------------------------------------------------------------
   `half` puts each piece on the Fall or the Halloween side of the one
   combined drop. Bows are numbered within their group because they are
   genuinely individual — "No. 3 of 8" is a fact, not decoration.
-------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------- Halloween · Mini · $35 ---------- */
  { sku: 'HW-MIN-1', category: 'bows', size: 'mini', half: 'halloween',
    name: 'Halloween Mini', edition: '1 of 1', price: 35, stock: 1 },

  /* ---------- Halloween · Regular · $50 ---------- */
  { sku: 'HW-REG-1', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '1 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-2', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '2 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-3', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '3 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-4', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '4 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-5', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '5 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-6', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '6 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-7', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '7 of 8', price: 50, stock: 1 },
  { sku: 'HW-REG-8', category: 'bows', size: 'regular', half: 'halloween',
    name: 'Halloween Regular', edition: '8 of 8', price: 50, stock: 1 },

  /* ---------- Halloween · Mega · $75 ---------- */
  { sku: 'HW-MEG-1', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '1 of 6', price: 75, stock: 1 },
  { sku: 'HW-MEG-2', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '2 of 6', price: 75, stock: 1 },
  { sku: 'HW-MEG-3', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '3 of 6', price: 75, stock: 1 },
  { sku: 'HW-MEG-4', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '4 of 6', price: 75, stock: 1 },
  { sku: 'HW-MEG-5', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '5 of 6', price: 75, stock: 1 },
  { sku: 'HW-MEG-6', category: 'bows', size: 'mega', half: 'halloween',
    name: 'Halloween Mega', edition: '6 of 6', price: 75, stock: 1 },

  /* ---------- Halloween · Mega Bound · $90 ---------- */
  { sku: 'HW-MBD-1', category: 'bows', size: 'mega-bound', half: 'halloween',
    name: 'Halloween Mega Bound', edition: '1 of 2', price: 90, stock: 1 },
  { sku: 'HW-MBD-2', category: 'bows', size: 'mega-bound', half: 'halloween',
    name: 'Halloween Mega Bound', edition: '2 of 2', price: 90, stock: 1 },

  /* ---------- Fall · Regular · $75 ---------- */
  { sku: 'FA-REG-1', category: 'bows', size: 'regular', half: 'fall',
    name: 'Fall Regular', edition: '1 of 3', price: 75, stock: 1 },
  { sku: 'FA-REG-2', category: 'bows', size: 'regular', half: 'fall',
    name: 'Fall Regular', edition: '2 of 3', price: 75, stock: 1 },
  { sku: 'FA-REG-3', category: 'bows', size: 'regular', half: 'fall',
    name: 'Fall Regular', edition: '3 of 3', price: 75, stock: 1 },

  /* ---------- Fall · Mega · $90 ---------- */
  { sku: 'FA-MEG-1', category: 'bows', size: 'mega', half: 'fall',
    name: 'Fall Mega', edition: '1 of 5', price: 90, stock: 1 },
  { sku: 'FA-MEG-2', category: 'bows', size: 'mega', half: 'fall',
    name: 'Fall Mega', edition: '2 of 5', price: 90, stock: 1 },
  { sku: 'FA-MEG-3', category: 'bows', size: 'mega', half: 'fall',
    name: 'Fall Mega', edition: '3 of 5', price: 90, stock: 1 },
  { sku: 'FA-MEG-4', category: 'bows', size: 'mega', half: 'fall',
    name: 'Fall Mega', edition: '4 of 5', price: 90, stock: 1 },
  { sku: 'FA-MEG-5', category: 'bows', size: 'mega', half: 'fall',
    name: 'Fall Mega', edition: '5 of 5', price: 90, stock: 1 },

  /* ---------- Fall · Mega Double · $80 ---------- */
  { sku: 'FA-MDB-1', category: 'bows', size: 'mega-double', half: 'fall',
    name: 'Fall Mega Double', edition: '1 of 1', price: 80, stock: 1 },

  /* ---------- Halloween · Sweatshirts · $45 ----------
     Two of every size in every colour. Not one-of-one — these restock
     only if she cuts more, so stock is a real count. */
  { sku: 'HW-SW-BLK-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Black', price: 45, stock: 2 },
  { sku: 'HW-SW-BLK-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Black', price: 45, stock: 2 },
  { sku: 'HW-SW-BLK-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Black', price: 45, stock: 2 },
  { sku: 'HW-SW-BLK-XL', category: 'sweatshirts', apparel: 'xl', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Black', price: 45, stock: 2 },
  { sku: 'HW-SW-GRY-S', category: 'sweatshirts', apparel: 's', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Grey', price: 45, stock: 2 },
  { sku: 'HW-SW-GRY-M', category: 'sweatshirts', apparel: 'm', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Grey', price: 45, stock: 2 },
  { sku: 'HW-SW-GRY-L', category: 'sweatshirts', apparel: 'l', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Grey', price: 45, stock: 2 },
  { sku: 'HW-SW-GRY-XL', category: 'sweatshirts', apparel: 'xl', half: 'halloween',
    name: 'Halloween Sweatshirt', colour: 'Grey', price: 45, stock: 2 },
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
