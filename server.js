/* Minimal static server for the Sew True site.
   Mirrors Vercel: /privacy and /terms resolve to their .html files (the
   vercel.json rewrites), and anything missing gets the site's own 404.html
   with a real 404 status. */
const http = require('http');
const fs = require('fs');
const path = require('path');

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
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  send(res, filePath, 200);
}).listen(PORT, () => console.log(`Sew True → http://localhost:${PORT}`));
