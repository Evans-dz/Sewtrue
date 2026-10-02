/* Minimal static server for the Sew True site.
   Mirrors Vercel: /privacy and /terms resolve to their .html files (the
   vercel.json rewrites), and anything missing gets the site's own 404.html
   with a real 404 status. */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

/* /api/* is Vercel functions and does not run here. Stock is the one worth
   having locally, or every piece sold through Stripe shows as for sale, so it
   is read from the live site. Read-only: checkout is never passed through. */
const LIVE = 'https://sewtrue.shop';

const ROOT = __dirname;
const PORT = process.env.PORT || 4178;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

function send(res, filePath, status) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (status === 404) { res.writeHead(404); res.end('Not found'); return; }
      send(res, path.join(ROOT, '404.html'), 404);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(status, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/api/stock' && req.method === 'GET') {
    https.get(LIVE + req.url, (live) => {
      res.writeHead(live.statusCode, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      live.pipe(res);
    }).on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end('{"ok":false,"reason":"live stock unreachable"}');
    });
    return;
  }
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  send(res, filePath, 200);
}).listen(PORT, () => console.log(`Sew True → http://localhost:${PORT}`));
