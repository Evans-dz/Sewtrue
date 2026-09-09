/* ============================================================================
   SEW TRUE — CATALOG

   Built from the client's own photography (Bows.zip, 26 Aug 2026). Each product
   is one real bow, shot on her door. Sizes come from her size-labelled collages,
   which match the photo count exactly: 4 mini, 4 regular, 6 regular double,
   2 mega, 5 mega double = 21.

   Five singles could not be pinned by fabric alone because the same cloth was
   made in more than one size — they are marked CHECK below and want a
   confirming glance. Everything else is certain.
   ========================================================================= */

/* -- Fabrics --------------------------------------------------------------
   Only cloth that actually appears in the photos. `pattern` maps to an
   <svg><pattern> in index.html, used for the swatch wall and as the drawn
   fallback if a photo ever goes missing.
-------------------------------------------------------------------------- */
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

/* -- Sizes ----------------------------------------------------------------
   Prices are the client's own and are correct.
   TODO(client): the width/drop numbers are read off the door photos and want
   a tape measure before launch.
-------------------------------------------------------------------------- */
const SIZES = {
  'mini':          { label: 'Mini',           price: 25, w: 8,  drop: 14, layers: 1, order: 1 },
  'regular':       { label: 'Regular',        price: 35, w: 12, drop: 20, layers: 1, order: 2 },
  'regular-double':{ label: 'Regular Double', price: 50, w: 14, drop: 22, layers: 2, order: 3 },
  'mega':          { label: 'Mega',           price: 65, w: 18, drop: 28, layers: 1, order: 4 },
  'mega-double':   { label: 'Mega Double',    price: 80, w: 20, drop: 30, layers: 2, order: 5 },
};


/* -- Categories -----------------------------------------------------------
   The whole line, not just bows. Only `live: true` categories have stock and
   render a grid; the rest show a coming-soon shelf so the shop reads as the
   full range from day one.

   To open a category: add products with that `category` id, then flip `live`.
-------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: 'bows',        label: 'Bows',        live: true,
    note: 'Five sizes, cut on the grain and sewn, never glued.' },
  { id: 'sweatshirts', label: 'Sweatshirts', live: false,
    note: 'The first hoodie is cut for the Fall & Halloween drop.' },
  { id: 'blankets',    label: 'Blankets',    live: false,
    note: 'Pieced and quilted. First ones land with the drop.' },
  { id: 'small-goods', label: 'Small goods', live: false,
    note: 'Keyrings, scrunchies and ornaments, made from the offcuts.' },
];

/* -- The shop -------------------------------------------------------------
   `fabrics` is [outer, inner] as the bow is actually built — the inner cloth
   is the one you read first, so the site names it first.
   TODO(client): stock is set to one of one throughout. Correct any that were
   made in a run.
-------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------- Mini · $25 ---------- */
  { sku: 'ST-101', category: 'bows', name: 'Cider Mini',       size: 'mini', fabrics: ['check-cider'], photo: '0724', stock: 1 }, // CHECK: mini or regular
  { sku: 'ST-102', category: 'bows', name: 'Sunday Mini',      size: 'mini', fabrics: ['bandana-red'], photo: '0725', stock: 1 },
  { sku: 'ST-103', category: 'bows', name: 'Homestead Mini',   size: 'mini', fabrics: ['patchwork'],   photo: '0727', stock: 1 }, // CHECK: mini / regular / mega
  { sku: 'ST-104', category: 'bows', name: 'Picnic Mini',      size: 'mini', fabrics: ['gingham-red'], photo: '0739', stock: 1 },

  /* ---------- Regular · $35 ---------- */
  { sku: 'ST-111', category: 'bows', name: 'Cider House',      size: 'regular', fabrics: ['check-cider'], photo: '0729', stock: 1 }, // CHECK
  { sku: 'ST-112', category: 'bows', name: 'Sunday Best',      size: 'regular', fabrics: ['bandana-red'], photo: '0730', stock: 1 },
  { sku: 'ST-113', category: 'bows', name: 'Wheat Field',      size: 'regular', fabrics: ['dot-wheat'],   photo: '0731', stock: 1 },
  { sku: 'ST-114', category: 'bows', name: 'Homestead',        size: 'regular', fabrics: ['patchwork'],   photo: '0732', stock: 1 }, // CHECK

  /* ---------- Regular Double · $50 ---------- */
  { sku: 'ST-121', category: 'bows', name: 'Chambray Picnic',  size: 'regular-double', fabrics: ['chambray', 'gingham-red'],    photo: '0720', stock: 1 },
  { sku: 'ST-122', category: 'bows', name: 'Harvest Border',   size: 'regular-double', fabrics: ['border-indigo', 'gingham-tan'], photo: '0721', stock: 1 },
  { sku: 'ST-123', category: 'bows', name: 'Star Route',       size: 'regular-double', fabrics: ['gingham-red', 'star-plaid'],  photo: '0723', stock: 1 },
  { sku: 'ST-124', category: 'bows', name: 'Double Picnic',    size: 'regular-double', fabrics: ['gingham-red', 'buffalo-red'], photo: '0726', stock: 1 },
  { sku: 'ST-125', category: 'bows', name: 'Paisley Picnic',   size: 'regular-double', fabrics: ['buffalo-red', 'bandana-navy'], photo: '0737', stock: 1 },
  { sku: 'ST-126', category: 'bows', name: 'Chambray & Wheat', size: 'regular-double', fabrics: ['chambray', 'dot-wheat'],      photo: '0738', stock: 1 },

  /* ---------- Mega · $65 ---------- */
  { sku: 'ST-131', category: 'bows', name: 'Homestead Mega',   size: 'mega', fabrics: ['patchwork'], photo: '0728', stock: 1 }, // CHECK
  { sku: 'ST-132', category: 'bows', name: 'Wheat Field Mega', size: 'mega', fabrics: ['dot-wheat'], photo: '0733', stock: 1 },

  /* ---------- Mega Double · $80 ---------- */
  { sku: 'ST-141', category: 'bows', name: 'Sunday Chambray',  size: 'mega-double', fabrics: ['chambray', 'dot-wheat'],       photo: '0719', stock: 1 },
  { sku: 'ST-142', category: 'bows', name: 'Front Porch',      size: 'mega-double', fabrics: ['bandana-navy', 'buffalo-red'], photo: '0722', stock: 1 },
  { sku: 'ST-143', category: 'bows', name: 'Night Porch',      size: 'mega-double', fabrics: ['bandana-navy', 'gingham-red'], photo: '0734', stock: 1 },
  { sku: 'ST-144', category: 'bows', name: 'Border Town',      size: 'mega-double', fabrics: ['border-indigo', 'buffalo-red'], photo: '0736', stock: 1 },
  { sku: 'ST-145', category: 'bows', name: 'Old Glory',        size: 'mega-double', fabrics: ['star-plaid', 'gingham-red'],   photo: '0740', stock: 1 },
];

/* One representative photo per size, for the door sequence in Sizes.
   These five are the ones her own size graphic labels, so they are certain. */
const SIZE_SHOTS = {
  'mini': '0725', 'regular': '0731', 'regular-double': '0723',
  'mega': '0728', 'mega-double': '0722',
};

window.FABRICS = FABRICS; window.CATEGORIES = CATEGORIES; window.SIZES = SIZES; window.PRODUCTS = PRODUCTS;
window.SIZE_SHOTS = SIZE_SHOTS;
