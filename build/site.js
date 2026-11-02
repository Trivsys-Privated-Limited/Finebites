/*
 * FineBites site build.
 *
 * The hand-edited HTML pages in the project root are the source of truth.
 * This script does not overwrite their design. It only:
 *   1. refreshes the SEO <head> block (canonical, Open Graph, Twitter, favicon, JSON-LD)
 *      between <!--SEO:START--> and <!--SEO:END--> markers,
 *   2. converts old query-string links to clean static URLs,
 *   3. links form <label>s to their inputs (accessibility),
 *   4. fills the generated home-page blocks (category tiles, bestsellers, stats),
 *   5. generates one static, crawlable page per category (category/<id>.html)
 *      and per product (products/<id>.html) from brand-products.html / product.html,
 *   6. writes sitemap.xml, robots.txt and 404.html.
 *
 * Run with:  npm run build      (safe to run any number of times)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = {
  url: 'https://finebitesllc.com',
  name: 'FineBites',
  legalName: 'Fine Bites LLC',
  email: 'info@finebitesllc.com',
  phone: '+971527097123',
  phoneOffice: '+97145828085',
  street: 'Office 103, 1st Floor, Al Ras 112 Building, Al Ras',
  locality: 'Deira, Dubai',
  region: 'Dubai',
  country: 'AE',
  ogImage: 'images/og-image.jpg',
};

/* Home-page category tiles: cover photo + bright colours per category. */
const CAT_STYLE = {
  lollipops:  { img: 'images/saara/big-bom-xl.webp',             tile: '#FFE0EA', accent: '#E8335A' },
  biscuits:   { img: 'images/saara/creamfist.webp',              tile: '#FFF1C9', accent: '#C98600' },
  chocolates: { img: 'images/saara/premium-truffle.webp',        tile: '#FFE6D2', accent: '#9A4A12' },
  gummies:    { img: 'images/saara/fresh-olive-bubble-gum.webp', tile: '#DDF5E8', accent: '#1FA866' },
  wafers:     { img: 'images/saara/choco-bites.webp',            tile: '#FFF0D9', accent: '#D46A00' },
  toffees:    { img: 'images/saara/eclairs-toffee.webp',         tile: '#FFE7CC', accent: '#C2570C' },
  candy:      { img: 'images/saara/fruit-bon-bon.webp',          tile: '#EEE7FF', accent: '#7C4DFF' },
};
/* Order categories appear in menus / tiles. */
const CAT_ORDER = ['lollipops', 'biscuits', 'chocolates', 'gummies', 'wafers', 'toffees', 'candy'];

const today = new Date().toISOString().slice(0, 10);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); };
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = p => SITE.url + '/' + String(p || '').replace(/^\/+/, '');
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,.;:—-]+\S*$/, '') + '…');
const jsonld = o => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, '\\u003c') + '</script>';

/* ---------- catalog ---------- */
const catalog = JSON.parse(read('data/catalog.json'));
const cats = CAT_ORDER.map(id => catalog.categories.find(c => c.id === id)).filter(Boolean)
  .concat(catalog.categories.filter(c => !CAT_ORDER.includes(c.id)));
const productsOf = c => c.brands.flatMap(b => b.products.map(p => ({ ...p, brand: b, cat: c })));
const allProducts = cats.flatMap(productsOf);
const productUrl = p => 'products/' + p.id + '.html';
const catUrl = c => 'category/' + c.id + '.html';
const ogImage = p => (p && fs.existsSync(path.join(ROOT, 'images/og/' + p.id + '.jpg'))) ? 'images/og/' + p.id + '.jpg' : SITE.ogImage;
const productImage = p => p.image || (p.variants || []).map(v => v && v.image).find(Boolean) || SITE.ogImage;

/* ---------- shared structured data ---------- */
const ORG = {
  '@type': ['Organization', 'WholesaleStore'],
  '@id': SITE.url + '/#org',
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url + '/',
  logo: abs('images/apple-touch-icon.png'),
  image: abs(SITE.ogImage),
  email: SITE.email,
  telephone: SITE.phone,
  description: 'UAE wholesale confectionery supplier of Saara chocolates, biscuits, lollipops, candy, toffees, gummies and wafers.',
  address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.locality, addressRegion: SITE.region, addressCountry: SITE.country },
  areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '18:00' }],
  contactPoint: [{ '@type': 'ContactPoint', telephone: SITE.phone, contactType: 'sales', areaServed: 'AE', availableLanguage: ['en', 'ar'] }],
};
const crumbs = list => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: list.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })),
});

/* ---------- <head> SEO block ---------- */
function seoBlock({ title, desc, url, image, type = 'website', ld = [], noindex = false }) {
  const canonical = url == null ? null : abs(url);
  const img = abs(image || SITE.ogImage);
  return [
    '<!--SEO:START-->',
    noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    canonical ? `<link rel="canonical" href="${esc(canonical)}">` : '',
    '<meta name="theme-color" content="#1C0721">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">',
    `<meta property="og:site_name" content="${SITE.name}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}">` : '',
    `<meta property="og:image" content="${esc(img)}">`,
    '<meta property="og:locale" content="en_AE">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
    ...ld.map(jsonld),
    '<!--SEO:END-->',
  ].filter(Boolean).join('\n');
}

function applyHead(html, { title, desc, base = false, preset = null, ...seo }) {
  html = html.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->\n?/g, '');
  html = html.replace(/<link rel="canonical"[^>]*>\n?/g, '').replace(/<meta name="robots"[^>]*>\n?/g, '');
  html = html.replace(/<base href="[^"]*">\n?/g, '').replace(/<script>window\.FB_PRESET=[^<]*<\/script>\n?/g, '');
  html = html.replace(/<title([^>]*)>[\s\S]*?<\/title>/, (m, a) => `<title${a}>${esc(title)}</title>`);
  const descTag = `<meta name="description" content="${esc(desc)}">`;
  if (/<meta name="description"[^>]*>/.test(html)) html = html.replace(/<meta name="description"[^>]*>/, descTag);
  else html = html.replace(/<\/title>/, '</title>\n' + descTag);
  html = html.replace(descTag, descTag + '\n' + seoBlock({ title, desc, ...seo }));
  let early = '';
  if (base) early += '\n<base href="/">';
  if (preset) early += '\n<script>window.FB_PRESET=' + JSON.stringify(preset) + '</script>';
  if (early) html = html.replace(/<meta charset="[^"]*">/i, m => m + early);
  return html;
}

/* Old query-string links -> clean static URLs. */
function rewriteLinks(html) {
  return html
    .replace(/(?:brand-products|category-brands)\.html\?brand=saara&(?:amp;)?cat=([a-z0-9-]+)/g, 'category/$1.html')
    .replace(/(?:brand-products|category-brands)\.html\?cat=([a-z0-9-]+)/g, 'category/$1.html');
}

/* <label>Text</label><input name="x"> -> <label for="..">..</label><input id=".." name="x"> */
function linkLabels(html) {
  let n = 0;
  return html.replace(/<label>([\s\S]*?)<\/label>(\s*)<(input|select|textarea)\b([^>]*)>/g, (m, text, ws, tag, attrs) => {
    let id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
    const name = (attrs.match(/\bname="([^"]+)"/) || [])[1] || 'field';
    if (!id) { id = 'f-' + name + '-' + (++n); attrs = ` id="${id}"` + attrs; }
    return `<label for="${id}">${text}</label>${ws}<${tag}${attrs}>`;
  });
}

/* Replace the contents between <!--NAME:START--> and <!--NAME:END--> (or a bare <!--NAME--> placeholder). */
function fill(html, name, content) {
  const open = `<!--${name}:START-->`, close = `<!--${name}:END-->`;
  html = html.split(`<!--${name}-->`).join(open + close);
  const re = new RegExp(open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  return html.replace(re, open + content + close);
}

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ---------- home page generated blocks ---------- */
function buildHome(html) {
  const nWord = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][cats.length] || String(cats.length);
  html = fill(html, 'STAT:PRODUCTS', allProducts.length + '+');
  html = fill(html, 'STAT:CATEGORIES', String(cats.length));
  html = fill(html, 'STAT:CATEGORIES-WORD', nWord);
  const names = cats.map(c => `<span>${esc(c.name)}</span>`).join('');
  html = fill(html, 'MARQUEE', names + names + names + names);
  const tiles = cats.map(c => {
    const st = CAT_STYLE[c.id] || { img: productImage(productsOf(c)[0] || {}), tile: '#FFF1C9', accent: '#E8335A' };
    const n = productsOf(c).length;
    return `
      <a href="${catUrl(c)}" class="cat-tile reveal" style="--tile:${st.tile};--accent:${st.accent}">
        <div class="ph"><img src="${st.img}" alt="Saara ${esc(c.name.toLowerCase())} wholesale" loading="lazy" width="600" height="450"></div>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.description || '')}</p>
        <div class="meta"><span class="count">${n} product${n === 1 ? '' : 's'}</span><span class="go">${ARROW}</span></div>
      </a>`;
  }).join('') + `
      <div class="cat-tile cta-tile reveal">
        <h3>Need a mixed carton?</h3>
        <p>Combine lines across categories in one wholesale order. We'll put a quote together within 24 hours.</p>
        <button class="btn js-open-modal">Request a Quote</button>
      </div>
`;
  html = fill(html, 'CATS', tiles);
  // Bestsellers: first product of every category, then top up from chocolates/biscuits.
  const picks = [];
  cats.forEach(c => { const p = productsOf(c)[0]; if (p) picks.push(p); });
  for (const p of allProducts) { if (picks.length >= 8) break; if (!picks.some(q => q.id === p.id)) picks.push(p); }
  html = fill(html, 'FEATURED', picks.slice(0, 8).map(p => `
      <a href="${productUrl(p)}" class="feat-card reveal">
        <div class="ph"><img src="${productImage(p)}" alt="${esc(p.brand.name + ' ' + p.name)}" loading="lazy" width="400" height="400"></div>
        <div class="bd"><span class="cat">${esc(p.cat.name)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc || '')}</p></div>
      </a>`).join('') + '\n');
  return html;
}

/* ---------- static category pages ---------- */
function categoryCard(p) {
  return `
      <div class="product-card" style="opacity:1;transform:none">
        <div class="product-card-top" style="display:flex;align-items:center;justify-content:center;"><img src="${productImage(p)}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="product-card-body">
          <a class="product-name-link" href="${productUrl(p)}"><h3 class="product-name">${esc(p.name)}</h3></a>
          <p class="product-desc">${esc(p.desc || '')}</p>
          ${(p.variants || []).length ? `<span class="variant-label">${p.variants.length} variants: ${esc(p.variants.map(v => typeof v === 'string' ? v : v.name).join(', '))}</span>` : ''}
          <div class="card-actions"><a class="btn-details" href="${productUrl(p)}">View details</a></div>
        </div>
      </div>`;
}

function buildCategoryPage(tpl, c) {
  const list = productsOf(c);
  const brand = c.brands[0];
  const title = `Saara ${c.name} Wholesale in UAE (${list.length} Products) | FineBites`;
  const catOptions = [3, 2, 1].map(k => `Buy Saara ${c.name.toLowerCase()} wholesale in the UAE from FineBites, Dubai. ${list.length} products incl. ${list.slice(0, k).map(p => p.name).join(', ')}. Request a bulk quote.`);
  const desc = clip(catOptions.find(o => o.length <= 160) || catOptions[2], 160);
  let html = applyHead(tpl, {
    title, desc, url: catUrl(c), image: ogImage(list.find(p => productImage(p) === (CAT_STYLE[c.id] || {}).img) || list[0]), base: true,
    preset: { brand: brand.id, cat: c.id },
    ld: [
      crumbs([['Home', ''], ['Products', 'categories.html'], [c.name, catUrl(c)]]),
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Saara ${c.name}`, url: abs(catUrl(c)), description: desc,
        isPartOf: { '@id': SITE.url + '/#website' },
        mainEntity: { '@type': 'ItemList', numberOfItems: list.length,
          itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: abs(productUrl(p)), image: abs(productImage(p)) })) } },
    ],
  });
  html = html
    .replace(/<span class="label" id="heroLabel">[\s\S]*?<\/span>/, `<span class="label" id="heroLabel">FINEBITES · ${esc(brand.name.toUpperCase())} · ${list.length} PRODUCTS</span>`)
    .replace(/<h1 id="heroTitle">[\s\S]*?<\/h1>/, `<h1 id="heroTitle">${esc(brand.name + ' ' + c.name)}</h1>`)
    .replace(/<p id="heroDesc">[\s\S]*?<\/p>/, `<p id="heroDesc">${esc(c.description || brand.description)}</p>`)
    .replace(/<span class="current" id="breadcrumbBrand">[\s\S]*?<\/span>/, `<span class="current" id="breadcrumbBrand">${esc(c.name)}</span>`)
    .replace(/<h4 id="sidebarName">[\s\S]*?<\/h4>/, `<h4 id="sidebarName">${esc(brand.name + ' ' + c.name)}</h4>`)
    .replace(/<p id="sidebarDesc">[\s\S]*?<\/p>/, `<p id="sidebarDesc">${esc(brand.description)}</p>`)
    .replace(/(<div class="product-grid" id="productGrid">)[\s\S]*?(\n    <\/div>\n\n  <\/div>\n<\/section>)/, (m, a, b) => a + list.map(categoryCard).join('') + b);
  if (c.color) html = html.replace(/(<header[^>]*id="brandHero"[^>]*style=")background:[^;"]*;?/, `$1background:${c.color};`);
  return html;
}

/* ---------- static product pages ---------- */
function buildProductPage(tpl, p, idx, list) {
  const c = p.cat;
  const variants = (p.variants || []).map(v => typeof v === 'string' ? v : v.name);
  const titleOptions = [`${p.name} | Saara ${c.name} Wholesale UAE | FineBites`, `${p.name} | Saara Wholesale UAE | FineBites`, `${p.name} | FineBites`];
  const title = titleOptions.find(t => t.length <= 66) || titleOptions[2];
  const lead = (p.desc || '').trim().replace(/([^.!?])$/, '$1.');
  const options = [
    `${lead} Saara ${p.name}${variants.length ? ' in ' + variants.slice(0, 3).join(', ') : ''}, wholesale in the UAE from FineBites, Dubai.`,
    `${lead} Saara ${p.name}, wholesale in the UAE from FineBites, Dubai.`,
    `${lead} Wholesale in the UAE from FineBites, Dubai.`,
  ];
  const desc = clip(options.find(o => o.length <= 160) || options[options.length - 1], 160);
  const img = productImage(p);
  let html = applyHead(tpl, {
    title, desc, url: productUrl(p), image: ogImage(p), base: true,
    preset: { cat: c.id, id: p.id },
    ld: [crumbs([['Home', ''], ['Products', 'categories.html'], [c.name, catUrl(c)], [p.name, productUrl(p)]])],
  });
  html = html
    .replace(/<span class="label" id="heroLabel">[\s\S]*?<\/span>/, `<span class="label" id="heroLabel">FINEBITES · ${esc(p.brand.name.toUpperCase())} · ${esc(c.name.toUpperCase())}</span>`)
    .replace(/<h1 id="heroTitle">[\s\S]*?<\/h1>/, `<h1 id="heroTitle">${esc(p.name)}</h1>`)
    .replace(/<a href="[^"]*" id="bcCat">[\s\S]*?<\/a>/, `<a href="${catUrl(c)}" id="bcCat">${esc(c.name)}</a>`)
    .replace(/<span class="current" id="bcProd">[\s\S]*?<\/span>/, `<span class="current" id="bcProd">${esc(p.name)}</span>`)
    .replace(/(<div class="wrap" id="pdRoot">)[\s\S]*?(\n  <\/div>\n<\/section>)/, (m, a, b) => a + `
    <div class="pd">
      <div class="pd-media"><div class="pd-main" id="pdMain"><img id="pdImg" src="${img}" alt="${esc(p.brand.name + ' ' + p.name)}"></div></div>
      <div>
        <span class="pd-brand">${esc(p.brand.name)} · ${esc(c.name)}</span>
        <h2>${esc(p.name)}</h2>
        <p class="pd-desc">${esc(p.desc || '')}</p>
        ${variants.length ? `<div class="pd-block"><h4>Flavours / Variants</h4><p>${esc(variants.join(', '))}</p></div>` : ''}
        ${(p.details || []).length ? `<div class="pd-block"><h4>Highlights</h4><ul class="pd-list">${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>` : ''}
        <p><a href="${catUrl(c)}">More Saara ${esc(c.name)} →</a></p>
      </div>
    </div>` + b);
  if (c.color) html = html.replace(/(<header[^>]*id="brandHero"[^>]*style=")background:[^;"]*;?/, `$1background:${c.color};`);
  return html;
}

/* ---------- 404 ---------- */
function build404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Not Found | FineBites</title>
<meta name="description" content="This page could not be found. Browse FineBites wholesale Saara confectionery.">
${seoBlock({ title: 'Page Not Found | FineBites', desc: 'This page could not be found.', url: null, noindex: true })}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:32px;color:#fff;
background:radial-gradient(38% 50% at 92% 0%,rgba(224,20,76,.7),transparent 70%),radial-gradient(34% 50% at 0% 100%,rgba(106,31,216,.65),transparent 70%),radial-gradient(120% 90% at 50% 0%,#43124F 0%,#1C0721 60%)}
.big{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(5rem,18vw,9rem);line-height:1;background:linear-gradient(100deg,#E59400 0%,#FFB800 30%,#FFF1C4 50%,#FFB800 70%,#E59400 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sh 5s linear infinite}
@keyframes sh{to{background-position:-250% 0}}
h1{font-family:'Playfair Display',serif;font-weight:900;font-size:2rem;margin:10px 0 12px}
p{color:rgba(255,255,255,.75);max-width:440px;margin:0 auto 28px}
.links{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
a{display:inline-block;padding:14px 26px;border-radius:999px;font-weight:700;text-decoration:none}
.a1{background:#FFB800;color:#1C0721;border:2px solid #1C0721;box-shadow:5px 5px 0 rgba(0,0,0,.45)}.a2{background:rgba(255,255,255,.08);color:#fff;border:2px solid rgba(255,255,255,.35)}
.cats{margin-top:34px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.cats a{padding:8px 16px;background:#E0144C;color:#fff;font-size:14px;border:2px solid #1C0721}
@media (prefers-reduced-motion:reduce){.big{animation:none}}
</style>
</head>
<body>
<main>
  <div class="big">404</div>
  <h1>Oops, this treat is gone!</h1>
  <p>The page you were looking for has moved or no longer exists. Try one of our categories instead.</p>
  <div class="links"><a class="a1" href="index.html">Back to Home</a><a class="a2" href="categories.html">All Products</a></div>
  <div class="cats">${cats.map(c => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join('')}</div>
</main>
</body>
</html>
`;
}

/* ---------- root pages config ---------- */
const PAGES = {
  'index.html': {
    title: 'FineBites | Wholesale Confectionery Supplier in Dubai, UAE',
    desc: `FineBites supplies Saara chocolates, biscuits, lollipops, candy, toffees, gummies and wafers wholesale to retailers and distributors across the UAE. ${allProducts.length}+ products.`,
    url: '',
    ld: [{ '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: SITE.name, publisher: { '@id': SITE.url + '/#org' }, inLanguage: 'en' }] }],
  },
  'about.html': {
    title: 'About FineBites | UAE Wholesale Confectionery Supplier',
    desc: 'FineBites is a Dubai-based wholesale confectionery supplier serving distributors, supermarkets and bakeries across the UAE and the Gulf with Saara sweets.',
    url: 'about.html',
    ld: [crumbs([['Home', ''], ['About', 'about.html']]), { '@context': 'https://schema.org', '@type': 'AboutPage', url: abs('about.html'), about: { '@id': SITE.url + '/#org' } }],
  },
  'contact.html': {
    title: 'Contact FineBites | Wholesale Confectionery Inquiries, Dubai',
    desc: 'Contact FineBites in Al Ras, Deira, Dubai for wholesale confectionery pricing, lead times and minimum order sizes. WhatsApp +971 52 709 7123.',
    url: 'contact.html',
    ld: [crumbs([['Home', ''], ['Contact', 'contact.html']]), { '@context': 'https://schema.org', ...ORG }],
  },
  'categories.html': {
    title: 'All Products & Categories | FineBites Wholesale Confectionery',
    desc: clip(`Browse all ${allProducts.length}+ wholesale Saara products from FineBites: ${cats.map(c => c.name).join(', ')}. Bulk supply across the UAE.`, 160),
    url: 'categories.html',
    ld: [crumbs([['Home', ''], ['Products', 'categories.html']]), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'FineBites product categories',
      itemListElement: cats.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: abs(catUrl(c)) })) }],
  },
  'brand-products.html': { title: 'Products | FineBites', desc: 'Wholesale Saara products from FineBites.', url: null, noindex: true },
  'product.html':        { title: 'Product | FineBites',  desc: 'Wholesale Saara product details from FineBites.', url: null, noindex: true },
  'category-brands.html':{ title: 'Category | FineBites', desc: 'Wholesale Saara products from FineBites.', url: null, noindex: true },
  'coming-soon.html':    { title: 'Coming Soon | FineBites', desc: 'FineBites — Premium Wholesale Confectionery, UAE. Something sweet is on the way.', url: null, noindex: true },
};

/* ---------- run ---------- */
for (const [file, cfg] of Object.entries(PAGES)) {
  if (!fs.existsSync(path.join(ROOT, file))) continue;
  let html = linkLabels(rewriteLinks(read(file)));
  if (file === 'index.html') html = buildHome(html);
  write(file, applyHead(html, cfg));
}

const catTpl = read('brand-products.html');
const prodTpl = read('product.html');
for (const dir of ['category', 'products']) {
  const d = path.join(ROOT, dir);
  if (fs.existsSync(d)) fs.readdirSync(d).filter(f => f.endsWith('.html')).forEach(f => fs.unlinkSync(path.join(d, f)));
}
cats.forEach(c => write(catUrl(c), buildCategoryPage(catTpl, c)));
cats.forEach(c => { const list = productsOf(c); list.forEach((p, i) => write(productUrl(p), buildProductPage(prodTpl, p, i, list))); });
write('404.html', build404());

/* sitemap + robots */
const img = (u, t) => `<image:image><image:loc>${esc(abs(u))}</image:loc><image:title>${esc(t)}</image:title></image:image>`;
const urls = [
  ['', '1.0', img(SITE.ogImage, 'FineBites wholesale confectionery')],
  ['categories.html', '0.9', ''],
  ...cats.map(c => [catUrl(c), '0.8', img((CAT_STYLE[c.id] || {}).img || SITE.ogImage, 'Saara ' + c.name)]),
  ...allProducts.map(p => [productUrl(p), '0.7', img(productImage(p), 'Saara ' + p.name)]),
  ['about.html', '0.5', ''],
  ['contact.html', '0.6', ''],
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr, im]) => `  <url><loc>${esc(abs(u))}</loc><lastmod>${today}</lastmod><priority>${pr}</priority>${im}</url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`);

console.log(`Built: ${Object.keys(PAGES).length} root pages, ${cats.length} category pages, ${allProducts.length} product pages, 404.html, sitemap.xml (${urls.length} URLs), robots.txt.`);
