/* ============================================================================
   POST /api/checkout

   Turns a basket into a Stripe Checkout Session and hands back its URL. The
   cart then redirects the customer to Stripe, which takes the card. No card
   detail ever touches this site.

   THE RULE THAT MATTERS: the browser sends SKUs and counts, nothing else.
   Every price is looked up here, from js/catalog.js. A price that arrives
   from a browser is a price a customer can edit before sending it.

   Needs one environment variable, set in the Vercel dashboard:
     STRIPE_SECRET_KEY — a restricted key with Checkout Sessions: Write
   ========================================================================= */

const { PRODUCTS, SIZES, APPAREL } = require('../js/catalog.js');
const { readInventory } = require('./stock.js');

const CURRENCY = 'usd';
const SHIPPING_CENTS = 600;   /* flat $6 anywhere in the US — SITE.shipping */
/* A real basket is small. Keeping this tight also means one anonymous
   request cannot put a hold on the entire drop. */
const MAX_LINES = 6;

/* Stripe has to be able to fetch product images itself, and every deployment
   except the custom domain sits behind Vercel SSO. So images are always
   addressed on the public domain, whichever deployment is serving. */
const PUBLIC_ORIGIN = 'https://sewtrue.shop';

/* --------------------------------------------------------------------------
   Stripe's API is form-encoded and nests with brackets, so an object like
   { line_items: [{ quantity: 1 }] } has to go out as
   line_items[0][quantity]=1. Arrays work here too — Object.keys gives the
   indices, which is exactly the shape Stripe wants.
-------------------------------------------------------------------------- */
function form(obj, prefix, out) {
  out = out || new URLSearchParams();
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined || val === null) continue;
    const name = prefix ? prefix + '[' + key + ']' : key;
    if (typeof val === 'object') form(val, name, out);
    else out.append(name, String(val));
  }
  return out;
}

/* Vercel usually parses JSON for us, but not on every runtime path — fall
   back to reading the stream rather than failing on an empty body. */
async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw); } catch { return null; }
}

/* What the line says on the Stripe page and on her receipt. */
function describe(p, size) {
  if (p.category === 'sweatshirts') return p.colour + ' · ' + APPAREL[p.apparel].label;
  if (!size) return p.name;
  return size.label + (p.edition ? ' · No. ' + p.edition : '') +
         ' · ' + size.w + '" across, ' + size.drop + '" drop';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only.' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    /* Loud in the logs, vague to the customer. */
    console.error('[checkout] STRIPE_SECRET_KEY is not set on this deployment');
    return res.status(500).json({ error: 'Checkout is not configured yet.' });
  }

  /* ---- read the basket ------------------------------------------------- */
  const body = await readJson(req);
  const lines = body && Array.isArray(body.lines) ? body.lines : null;
  if (!lines || !lines.length) return res.status(400).json({ error: 'The basket is empty.' });
  if (lines.length > MAX_LINES) return res.status(400).json({ error: 'That is too many items.' });

  /* ---- price it from our own catalogue, never from theirs -------------- */
  const items = [];
  const seen = new Set();
  for (const line of lines) {
    const product = PRODUCTS.find((p) => p.sku === line.sku);
    if (!product) return res.status(400).json({ error: 'We no longer have ' + line.sku + '.' });

    /* Price comes off the product now — the same size is priced differently
       in the two halves of the drop. */
    if (!Number.isFinite(product.price) || product.price <= 0) {
      console.error('[checkout] ' + product.sku + ' has no usable price');
      return res.status(500).json({ error: 'That item is misconfigured.' });
    }
    const size = SIZES[product.size] || null;

    /* One SKU cannot appear twice, or the stock check below is meaningless. */
    if (seen.has(product.sku)) return res.status(400).json({ error: 'Duplicate item in the basket.' });
    seen.add(product.sku);

    /* One of one means one of one. */
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1) return res.status(400).json({ error: 'Bad quantity.' });
    if (qty > product.stock) {
      return res.status(409).json({
        error: product.stock < 1
          ? product.name + ' has sold.'
          : 'Only ' + product.stock + ' of ' + product.name + ' exists.',
      });
    }

    items.push({ product, size, qty });
  }

  /* ---- has any of it already gone? -------------------------------------
     Read Stripe fresh, never the cache: this is the moment that decides
     whether a one-of-one gets sold twice. If the reading is unavailable we
     let the sale through and shout in the logs — a shop that cannot sell is
     a worse failure than the rare double-sale this is preventing. */
  const client = typeof body.client === 'string' && /^[a-z0-9]{6,40}$/.test(body.client)
    ? body.client : null;
  const inv = await readInventory(key, { fresh: true, exclude: client });
  if (inv.ok) {
    for (const i of items) {
      const gone = (inv.sold[i.product.sku] || 0) + (inv.held[i.product.sku] || 0);
      const left = i.product.stock - gone;
      if (left < i.qty) {
        return res.status(409).json({
          error: left < 1
            ? i.product.name + ' has just gone.'
            : 'Only ' + left + ' of ' + i.product.name + ' is left.',
          sku: i.product.sku,
        });
      }
    }
  } else {
    console.error('[checkout] selling without an inventory check — ' + inv.reason);
  }

  /* ---- where Stripe sends them back ------------------------------------ */
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = proto + '://' + host;

  const params = {
    mode: 'payment',
    /* Stripe's minimum. An abandoned basket stops holding its pieces after
       half an hour rather than sitting on a one-of-one for a day. */
    expires_at: Math.floor(Date.now() / 1000) + 1800,
    success_url: origin + '/?paid=1&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: origin + '/?checkout=cancelled&session_id={CHECKOUT_SESSION_ID}',

    /* These ship, so Stripe collects the address and the flat rate. */
    shipping_address_collection: { allowed_countries: ['US'] },
    shipping_options: [{
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: 'US shipping',
        fixed_amount: { amount: SHIPPING_CENTS, currency: CURRENCY },
      },
    }],
    phone_number_collection: { enabled: true },

    /* So she can read an order off the payment without opening the site. */
    metadata: {
      /* /api/stock reads this back to work out what has sold. Keep it a
         plain comma-separated list — it is parsed, not just read. */
      skus: items.map((i) => Array(i.qty).fill(i.product.sku).join(',')).join(','),
      /* Anonymous, per-browser. Only used so a shopper's own unfinished
         session does not block their retry. */
      client: client || '',
      basket: items.map((i) => i.product.sku + ' x' + i.qty).join(', '),
    },

    line_items: items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: CURRENCY,
        unit_amount: i.product.price * 100,       /* catalogue is in dollars */
        product_data: {
          name: i.product.name,
          description: describe(i.product, i.size),
          images: i.product.photo
            ? [PUBLIC_ORIGIN + '/assets/photos/bow-' + i.product.photo + '-560.jpg']
            : undefined,
          metadata: { sku: i.product.sku },
        },
      },
    })),

    /* Sales tax stays off until a Utah registration exists in Stripe. Turning
       it on is `automatic_tax: { enabled: true }` here, and the restricted key
       then also needs Tax: Read. */
  };

  /* ---- open the session ------------------------------------------------ */
  let session;
  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form(params).toString(),
    });
    session = await r.json();
    if (!r.ok) {
      /* Stripe's message can echo request detail — log it, never return it. */
      console.error('[checkout] Stripe ' + r.status + ':', session && session.error && session.error.message);
      return res.status(502).json({ error: 'Stripe could not open a checkout.' });
    }
  } catch (err) {
    console.error('[checkout] could not reach Stripe:', err.message);
    return res.status(502).json({ error: 'Could not reach Stripe.' });
  }

  if (!session.url) {
    console.error('[checkout] session came back with no url');
    return res.status(502).json({ error: 'Stripe returned no checkout URL.' });
  }

  return res.status(200).json({ url: session.url });
};

/* Exposed so the pricing and validation can be exercised offline, with no
   key and no network call. */
module.exports.__test = { form, describe, PRODUCTS, SIZES, SHIPPING_CENTS, MAX_LINES };
