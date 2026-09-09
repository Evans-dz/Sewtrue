/* ============================================================================
   POST /api/release   { session_id }

   Hands a piece back to the shop the moment someone walks away from paying.

   Stripe does NOT close a Checkout Session when the shopper hits cancel or
   shuts the tab — it stays `open` until it expires. Since an open session is
   what marks a piece HELD, an abandoned one would keep a one-of-one off the
   shelf for the full thirty minutes. Expiring it here gives it straight back.

   Safe to call by anyone holding the session id: expiring a session only ever
   releases stock, can never take money, and Stripe refuses to expire one that
   has already been paid.
   ========================================================================= */

const STRIPE = 'https://api.stripe.com/v1';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only.' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(200).json({ released: false });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try { body = JSON.parse(raw); } catch { body = null; }
  }

  const id = body && body.session_id;
  /* Shape-check before spending a call on it. */
  if (typeof id !== 'string' || !/^cs_[A-Za-z0-9_]{10,80}$/.test(id)) {
    return res.status(400).json({ error: 'Bad session id.' });
  }

  try {
    const r = await fetch(STRIPE + '/checkout/sessions/' + id + '/expire', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key },
    });
    /* A session that was already paid, already expired, or never existed is
       not an error worth troubling anyone with — the shelf is correct either
       way, which is the only thing this endpoint is for. */
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      console.warn('[release] could not expire ' + id + ':', d && d.error && d.error.message);
      return res.status(200).json({ released: false });
    }
  } catch (err) {
    console.warn('[release] Stripe unreachable:', err.message);
    return res.status(200).json({ released: false });
  }

  return res.status(200).json({ released: true });
};
