/*
 * Image pipeline (needs the `sharp` dev dependency: run `npm install` once).
 *
 *   npm run images
 *
 * 1. Converts any .jpg/.jpeg/.png under images/saara/ to an optimised .webp
 *    (max 1200px, quality 80) and updates data/catalog.json to point at it.
 *    The original is moved to ../finebites-backup/ so nothing is lost.
 * 2. Creates a 1200x630 JPEG share image (WhatsApp / Facebook / LinkedIn preview)
 *    for every product and category in images/og/.
 *
 * Then run `npm run build` to regenerate the pages.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const BACKUP = path.join(ROOT, '..', 'finebites-backup');
const OG_DIR = path.join(ROOT, 'images', 'og');

(async () => {
  /* 1. new photos -> webp */
  const srcDir = path.join(ROOT, 'images', 'saara');
  const catalogPath = path.join(ROOT, 'data', 'catalog.json');
  let catalogText = fs.readFileSync(catalogPath, 'utf8');
  let converted = 0;
  for (const f of fs.readdirSync(srcDir)) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const from = path.join(srcDir, f);
    const webpName = f.replace(/\.(jpe?g|png)$/i, '.webp');
    await sharp(from).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 }).toFile(path.join(srcDir, webpName));
    fs.mkdirSync(path.join(BACKUP, 'images', 'saara'), { recursive: true });
    fs.renameSync(from, path.join(BACKUP, 'images', 'saara', f));
    catalogText = catalogText.split('images/saara/' + f).join('images/saara/' + webpName);
    converted++;
  }
  if (converted) fs.writeFileSync(catalogPath, catalogText);

  /* 2. share images */
  const catalog = JSON.parse(catalogText);
  fs.mkdirSync(OG_DIR, { recursive: true });
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".55" stop-color="#FFE3EC"/><stop offset="1" stop-color="#FFD9B8"/></linearGradient></defs><rect width="1200" height="630" fill="url(#b)"/><circle cx="1130" cy="60" r="110" fill="#FFC53D" opacity=".45"/><circle cx="70" cy="590" r="120" fill="#3CC99A" opacity=".25"/></svg>`);
  const make = async (imgRel, out) => {
    const src = path.join(ROOT, imgRel);
    if (!fs.existsSync(src)) return false;
    const dest = path.join(OG_DIR, out + '.jpg');
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs > fs.statSync(src).mtimeMs) return false;
    const photo = await sharp(src).resize(1100, 570, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    await sharp(bg).composite([{ input: photo, left: 50, top: 30 }]).jpeg({ quality: 80, mozjpeg: true }).toFile(dest);
    return true;
  };
  let og = 0;
  for (const c of catalog.categories) {
    for (const b of c.brands) for (const p of b.products) {
      const img = p.image || (p.variants || []).map(v => v && v.image).find(Boolean);
      if (img && await make(img, p.id)) og++;
    }
  }
  console.log(`Converted ${converted} new photo(s) to WebP; wrote ${og} share image(s) to images/og/.`);
})();
