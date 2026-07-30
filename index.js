const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

/* ── helper: send a file ─────────────────────────────────────── */
function sendFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 – Page Not Found</h1>');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

/* ── helper: send JSON ───────────────────────────────────────── */
function sendJSON(res, data) {
  const body = JSON.stringify(data);
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

/* ── server ──────────────────────────────────────────────────── */
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  /* ── API: full catalog ──────────────────────────────────────── */
  if (urlPath === '/api/catalog') {
    const catalogPath = path.join(ROOT, 'data', 'catalog.json');
    fs.readFile(catalogPath, 'utf8', (err, raw) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not load catalog' }));
        return;
      }
      sendJSON(res, JSON.parse(raw));
    });
    return;
  }

  /* ── API: single category (brands list) ────────────────────── */
  // GET /api/category/biscuits
  const catMatch = urlPath.match(/^\/api\/category\/([^/]+)$/);
  if (catMatch) {
    const catId = catMatch[1];
    const catalogPath = path.join(ROOT, 'data', 'catalog.json');
    fs.readFile(catalogPath, 'utf8', (err, raw) => {
      if (err) { res.writeHead(500); res.end('{}'); return; }
      const catalog = JSON.parse(raw);
      const cat = catalog.categories.find(c => c.id === catId);
      if (!cat) { res.writeHead(404); res.end(JSON.stringify({ error: 'Category not found' })); return; }
      // return category meta + brands (without nested products to keep payload light)
      sendJSON(res, {
        id:          cat.id,
        name:        cat.name,
        description: cat.description,
        color:       cat.color,
        brands:      cat.brands.map(b => ({
          id:          b.id,
          name:        b.name,
          description: b.description,
          logo:        b.logo,
          productCount: b.products.length,
        })),
      });
    });
    return;
  }

  /* ── API: single brand (products list) ─────────────────────── */
  // GET /api/brand/lu?cat=biscuits
  const brandMatch = urlPath.match(/^\/api\/brand\/([^/]+)$/);
  if (brandMatch) {
    const brandId = brandMatch[1];
    const catId   = new URLSearchParams(req.url.split('?')[1] || '').get('cat');
    const catalogPath = path.join(ROOT, 'data', 'catalog.json');
    fs.readFile(catalogPath, 'utf8', (err, raw) => {
      if (err) { res.writeHead(500); res.end('{}'); return; }
      const catalog = JSON.parse(raw);
      // search across all categories (or narrow by catId if provided)
      let brand = null;
      let parentCat = null;
      for (const cat of catalog.categories) {
        if (catId && cat.id !== catId) continue;
        const found = cat.brands.find(b => b.id === brandId);
        if (found) { brand = found; parentCat = cat; break; }
      }
      if (!brand) { res.writeHead(404); res.end(JSON.stringify({ error: 'Brand not found' })); return; }
      sendJSON(res, {
        id:          brand.id,
        name:        brand.name,
        description: brand.description,
        logo:        brand.logo,
        category: {
          id:   parentCat.id,
          name: parentCat.name,
        },
        products: brand.products,
      });
    });
    return;
  }

  /* ── static files ───────────────────────────────────────────── */
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);

  // security: prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    sendFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`FineBites server → http://localhost:${PORT}`);
});
