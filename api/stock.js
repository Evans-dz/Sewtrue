/* ============================================================================
   GET /api/stock

   What is still available. Stripe is the inventory — there is no database.

   Every Checkout Session we open records its SKUs in metadata, so:
     a COMPLETED session  → those pieces are SOLD, for good
     an OPEN session      → those pieces are HELD while someone is paying

   Sessions are opened with a 30-minute expiry, so an abandoned basket
   releases its hold on its own and nothing gets stuck.

   The restricted key needs Checkout Sessions: READ as well as Write. Without
   it this returns ok:false and the shop shows everything as available rather
   than falling over — losing a sale to a false "sold out" on drop night is
   worse than the rare double-sale this is guarding against.
   ========================================================================= */

const STRIPE = 'https://api.stripe.com/v1';

/* One page is 100 sessions. Ten pages is a thousand orders, which is far
   beyond one drop; past that she has outgrown counting this way. */
const MAX_PAGES = 10;

/* Stripe is the truth, but it does not need asking on every page view. */
const CACHE_MS = 12000;
let cache = { at: 0, value: null };

async function listSessions(key, status) {
  const found = [];
  let after = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const q = new URLSearchParams({ limit: '100', status });
    if (after) q.set('starting_after', after);
    const r = await fetch(STRIPE + '/checkout/sessions?' + q.toString(), {
      headers: { Authorization: 'Bearer ' + key },
    });
    const body = await r.json();
    if (!r.ok) {
      const msg = body && body.error && body.error.message;
      const err = new Error(msg || ('Stripe ' + r.status));
      err.status = r.status;
      throw err;
    }
    const rows = body.data || [];
    found.push.apply(found, rows);
    if (!body.has_more || !rows.length) break;
    after = rows[rows.length - 1].id;
  }
  return found;
}

/* "HW-REG-1,HW-REG-2" → counts, so a sweatshirt with two made can sell one
   and still be on the shelf. */
function tally(sessions, into, exclude) {
  for (const s of sessions) {
    const meta = s.metadata || {};
    /* A shopper's own unfinished session must not lock them out of the very
       thing they are trying to buy — backing out of Stripe and trying again
       is an ordinary thing to do. */
    if (exclude && meta.client && meta.client === exclude) continue;
    for (const sku of (meta.skus || '').split(',')) {
      const id = sku.trim();
      if (id) into[id] = (into[id] || 0) + 1;
    }
  }
  return into;
}

/* `fresh` skips the cache — checkout uses it so a sale is never approved
   against a stale reading. */
async function readInventory(key, opts) {
  const fresh = opts && opts.fresh;
  const exclude = opts && opts.exclude;
  /* The cache is shared by everyone, so it can only be used when the answer
     is the same for everyone. */
  const cacheable = !exclude;
  if (!fresh && cacheable && cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;

  let value;
  try {
    /* Sold is read AFTER open. A session that completes between the two reads
       then appears in both rather than in neither — held is a soft block that
       expires, so double-counting is safe where missing it is not. */
    const open = await listSessions(key, 'open');
    const complete = await listSessions(key, 'complete');
    value = { ok: true, sold: tally(complete, {}), held: tally(open, {}, exclude) };
  } catch (err) {
    /* Most likely the key is missing Checkout Sessions: Read. */
    console.error('[stock] could not read Stripe inventory:', err.status || '', err.message);
    value = { ok: false, sold: {}, held: {}, reason: 'unavailable' };
  }

  if (cacheable) cache = { at: Date.now(), value };
  return value;
}

module.exports = async function handler(req, res) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error('[stock] STRIPE_SECRET_KEY is not set on this deployment');
    return res.status(200).json({ ok: false, sold: {}, held: {}, reason: 'unconfigured' });
  }
  const client = typeof req.query === 'object' && req.query ? req.query.client : null;
  const inv = await readInventory(key, { exclude: client || null });
  inv.mode = key.indexOf('_test_') > -1 ? 'test' : 'live';
  /* Short cache at the edge too — a drop rush is a lot of people asking the
     same question in the same few seconds. */
  res.setHeader('Cache-Control', 'public, max-age=5, s-maxage=10, stale-while-revalidate=30');
  return res.status(200).json(inv);
};

module.exports.readInventory = readInventory;
