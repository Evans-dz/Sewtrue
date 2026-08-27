/* ============================================================================
   SEW TRUE — CATALOG
   Fabrics, sizes and the fixed ready-to-ship shop.

   PHOTOS: every product may carry `photo: 'assets/photos/name.jpg'`. When the
   file exists it is used. When it doesn't, the site draws the bow itself from
   the fabric pattern — so the shop is never broken and never shows a grey box.
   Drop real photos into assets/photos/ and add the filename. That's the whole
   migration.
   ========================================================================= */

/* -- Fabrics -------------------------------------------------------------- */
/* `pattern` maps to an <svg><pattern id="..."> defined in index.html.        */
const FABRICS = [
  { id: 'gingham-red',    name: 'Picnic Gingham',   pattern: 'gingham-red',    note: 'Cotton gingham, quarter-inch check.' },
  { id: 'gingham-tan',    name: 'Harvest Gingham',  pattern: 'gingham-tan',    note: 'Homespun tan and barn red.' },
  { id: 'check-cider',    name: 'Cider Check',      pattern: 'check-cider',    note: 'Micro check, woven not printed.' },
  { id: 'dot-wheat',      name: 'Wheat Dot',        pattern: 'dot-wheat',      note: 'Wheat ground, pin-dot repeat.' },
  { id: 'pincheck-cream', name: 'Cream Pin Check',  pattern: 'pincheck-cream', note: 'The quietest one we make.' },
  { id: 'bandana-red',    name: 'Sunday Bandana',   pattern: 'bandana-red',    note: 'True bandana paisley.' },
  { id: 'bandana-navy',   name: 'Indigo Bandana',   pattern: 'bandana-navy',   note: 'Deep indigo, cream motif.' },
  { id: 'bandana-green',  name: 'Cellar Paisley',   pattern: 'bandana-green',  note: 'Bottle green, near-black in low light.' },
  { id: 'border-indigo',  name: 'Indigo Border',    pattern: 'border-indigo',  note: 'Banded border print, cut on the edge.' },
  { id: 'star-plaid',     name: 'Old Glory Plaid',  pattern: 'star-plaid',     note: 'Burgundy plaid, printed stars.' },
  { id: 'patchwork',      name: 'Homestead Patch',  pattern: 'patchwork',      note: 'Pieced by hand before it is cut.' },
  { id: 'chambray',       name: 'Chambray',         pattern: 'chambray',       note: 'Soft-washed shirting chambray.' },
];

/* -- Sizes ---------------------------------------------------------------- */
/* TODO(client): confirm the width/drop measurements — these are estimates
   read off the door photos and MUST be replaced with real tape numbers. */
const SIZES = {
  'mini':          { label: 'Mini',          price: 25, w: 8,  drop: 14, layers: 1, order: 1 },
  'regular':       { label: 'Regular',       price: 35, w: 12, drop: 20, layers: 1, order: 2 },
  'regular-double':{ label: 'Regular Double',price: 50, w: 14, drop: 22, layers: 2, order: 3 },
  'mega':          { label: 'Mega',          price: 65, w: 18, drop: 28, layers: 1, order: 4 },
  'mega-double':   { label: 'Mega Double',   price: 80, w: 20, drop: 30, layers: 2, order: 5 },
};

/* -- The shop ------------------------------------------------------------- */
/* `stock` is a real number. 1 = one of one. 0 = sold out (still shown, greyed).
   TODO(client): stock counts below are placeholders. */
const PRODUCTS = [
  /* ---- Mega Double ---- */
  { sku: 'ST-140', no: 140, name: 'Front Porch',      size: 'mega-double',   fabrics: ['bandana-navy', 'gingham-red'],   stock: 1, tag: 'One of one' },
  { sku: 'ST-141', no: 141, name: 'Cellar Door',      size: 'mega-double',   fabrics: ['bandana-green', 'gingham-red'],  stock: 1, tag: 'One of one' },
  { sku: 'ST-142', no: 142, name: 'Chambray & Wheat', size: 'mega-double',   fabrics: ['chambray', 'dot-wheat'],         stock: 2 },
  { sku: 'ST-143', no: 143, name: 'Old Glory',        size: 'mega-double',   fabrics: ['star-plaid', 'gingham-tan'],     stock: 1, tag: 'One of one' },
  { sku: 'ST-144', no: 144, name: 'Border Town',      size: 'mega-double',   fabrics: ['border-indigo', 'gingham-red'],  stock: 0 },

  /* ---- Mega ---- */
  { sku: 'ST-130', no: 130, name: 'Homestead',        size: 'mega',          fabrics: ['patchwork'],                     stock: 1, tag: 'One of one' },
  { sku: 'ST-131', no: 131, name: 'Sunday Best',      size: 'mega',          fabrics: ['bandana-red'],                   stock: 2 },

  /* ---- Regular Double ---- */
  { sku: 'ST-120', no: 120, name: 'Picnic Double',    size: 'regular-double',fabrics: ['gingham-red', 'gingham-red'],    stock: 3 },
  { sku: 'ST-121', no: 121, name: 'Star Route',       size: 'regular-double',fabrics: ['star-plaid', 'gingham-tan'],     stock: 2 },
  { sku: 'ST-122', no: 122, name: 'Harvest & Indigo', size: 'regular-double',fabrics: ['border-indigo', 'gingham-tan'],  stock: 2 },
  { sku: 'ST-123', no: 123, name: 'Chambray Wheat',   size: 'regular-double',fabrics: ['chambray', 'dot-wheat'],         stock: 2 },
  { sku: 'ST-124', no: 124, name: 'Chambray Picnic',  size: 'regular-double',fabrics: ['chambray', 'gingham-red'],       stock: 3 },
  { sku: 'ST-125', no: 125, name: 'Cellar Picnic',    size: 'regular-double',fabrics: ['bandana-green', 'gingham-red'],  stock: 1, tag: 'One of one' },

  /* ---- Regular ---- */
  { sku: 'ST-110', no: 110, name: 'Cider House',      size: 'regular',       fabrics: ['check-cider'],                   stock: 4 },
  { sku: 'ST-111', no: 111, name: 'Homestead',        size: 'regular',       fabrics: ['patchwork'],                     stock: 2 },
  { sku: 'ST-112', no: 112, name: 'Sunday Bandana',   size: 'regular',       fabrics: ['bandana-red'],                   stock: 3 },
  { sku: 'ST-113', no: 113, name: 'Wheat Field',      size: 'regular',       fabrics: ['dot-wheat'],                     stock: 3 },

  /* ---- Mini ---- */
  { sku: 'ST-100', no: 100, name: 'Homestead Mini',   size: 'mini',          fabrics: ['patchwork'],                     stock: 5 },
  { sku: 'ST-101', no: 101, name: 'Picnic Mini',      size: 'mini',          fabrics: ['gingham-red'],                   stock: 6 },
  { sku: 'ST-102', no: 102, name: 'Sunday Mini',      size: 'mini',          fabrics: ['bandana-red'],                   stock: 4 },
  { sku: 'ST-103', no: 103, name: 'Cider Mini',       size: 'mini',          fabrics: ['check-cider'],                   stock: 0 },
];

/* -- Sweatshirts ----------------------------------------------------------
   TODO(client): everything here is a placeholder. Need: what the sweatshirt
   actually is (embroidered? bow appliqué? printed?), blank brand, colours,
   size run, price, and photos. Until then this renders as an announced-but-
   not-yet-live line, which is the honest state.
-------------------------------------------------------------------------- */
const SWEATSHIRTS = {
  live: false,
  price: 58,                                   // TODO
  sizes: ['S', 'M', 'L', 'XL', '2XL'],         // TODO
  blurb: 'Heavyweight crewnecks with a bow stitched on, cut from the same fabrics as the bows. Joining the next drop.', // TODO
};

window.FABRICS = FABRICS; window.SIZES = SIZES; window.PRODUCTS = PRODUCTS; window.SWEATSHIRTS = SWEATSHIRTS;
