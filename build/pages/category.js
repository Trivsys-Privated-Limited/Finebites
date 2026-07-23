const { CATEGORIES, CATEGORY_ICONS, PASTELS } = require('../data');
const { SHARED_CSS, navHTML, footerHTML, MODAL_HTML, sharedScript, ARROW_SVG } = require('../templates');

const PAGE_CSS = `
.cat-hero{padding:170px 0 80px;color:#fff;}
.cat-hero .label{color:var(--gold);}
.cat-hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,5vw,4.2rem);line-height:1.15;color:#fff;max-width:640px;margin-bottom:20px;white-space:pre-line;}
.cat-hero p{font-size:16px;color:rgba(255,255,255,0.78);max-width:460px;margin-bottom:34px;}
.cat-hero .btn-primary{background:#fff;color:var(--ink);}
.cat-hero .btn-primary:hover{background:var(--cream);}

.cat-main{padding:0 0 100px;}
.cat-layout{display:grid;grid-template-columns:240px 1fr;gap:40px;align-items:start;}
.cat-sidebar{border:1px solid var(--border);border-radius:12px;padding:28px 24px;position:sticky;top:110px;}
.cat-sidebar svg{width:36px;height:36px;color:var(--green);margin-bottom:16px;}
.cat-sidebar h4{font-size:1.1rem;color:var(--ink);margin-bottom:10px;}
.cat-sidebar p{font-size:13.5px;color:var(--text-muted);margin-bottom:20px;}
.cat-sidebar .count{font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:18px;display:block;}
.cat-sidebar .btn-quote{width:100%;justify-content:center;}

.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
.product-card{border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff;display:flex;flex-direction:column;opacity:0;transform:translateY(24px);}
.product-card-top{height:150px;display:flex;align-items:center;justify-content:center;}
.product-card-top svg{width:54px;height:54px;color:var(--green);}
.product-card-body{padding:22px;display:flex;flex-direction:column;gap:10px;flex:1;}
.product-name{font-size:1.05rem;font-weight:600;color:var(--ink);font-family:'Playfair Display',serif;}
.product-desc{font-size:14px;color:var(--text-muted);flex:1;}
.product-tags{display:flex;flex-wrap:wrap;gap:6px;}
.tag-chip{font-size:11px;font-weight:500;color:var(--green);background:var(--cream);border:1px solid var(--border);border-radius:5px;padding:4px 9px;}
.product-card .btn-quote{align-self:flex-start;margin-top:4px;}

.related{padding:90px 0 110px;background:#fff;}
.related-head{max-width:560px;margin-bottom:40px;}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.cat-card{position:relative;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;color:#fff;min-height:230px;transition:transform .2s var(--ease-enter), filter .2s var(--ease-enter);}
.cat-card:hover{transform:scale(1.02);filter:brightness(1.08);}
.cat-card h3{font-size:1.3rem;color:#fff;margin-bottom:8px;}
.cat-card p{font-size:13px;color:rgba(255,255,255,0.75);}
.cat-card .arrow-corner{position:absolute;bottom:20px;right:20px;width:32px;height:32px;border:1px solid rgba(255,255,255,0.35);border-radius:50%;display:flex;align-items:center;justify-content:center;}
.cat-card .arrow-corner svg{width:13px;height:13px;color:#fff;}

@media (max-width:980px){
  .cat-layout{grid-template-columns:1fr;}
  .cat-sidebar{position:static;}
  .related-grid{grid-template-columns:1fr 1fr;}
}
@media (max-width:480px){
  .related-grid{grid-template-columns:1fr;}
}
`;

function buildProductGrid(cat) {
  const icon = CATEGORY_ICONS[cat.name];
  const pastel = PASTELS[cat.name];
  return cat.products.map(p => `
    <div class="product-card">
      <div class="product-card-top" style="background:${pastel}">${icon}</div>
      <div class="product-card-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-tags">${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>
        <button class="btn-quote js-open-modal" data-product="${p.name}">Request Quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:14px;height:14px;"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>`).join('');
}

function buildRelated(cat) {
  const others = CATEGORIES.filter(c => c.slug !== cat.slug);
  // pick 3 spaced out through the list for variety across pages
  const idx = CATEGORIES.findIndex(c => c.slug === cat.slug);
  const picks = [others[(idx + 1) % others.length], others[(idx + 3) % others.length], others[(idx + 5) % others.length]];
  return picks.map(c => `
    <a href="${c.slug}.html" class="cat-card reveal" style="background:${c.bg}">
      <h3>${c.name}</h3>
      <p>${c.gridDescriptor}</p>
      <span class="arrow-corner">${ARROW_SVG}</span>
    </a>`).join('');
}

function buildCategoryHTML(cat) {
  const icon = CATEGORY_ICONS[cat.name];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cat.name} — Wholesale Supply | FineBites</title>
<meta name="description" content="Wholesale ${cat.name.toLowerCase()} supply from FineBites — ${cat.descriptor}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>${SHARED_CSS}${PAGE_CSS}</style>
</head>
<body>

${navHTML(1, true)}

<header class="cat-hero" style="background:${cat.bg}">
  <div class="wrap">
    <span class="label">FINEBITES · ${cat.name.toUpperCase()}</span>
    <h1>${cat.headline.join('\n')}</h1>
    <p>${cat.descriptor}</p>
    <button class="btn btn-primary js-open-modal" data-product="${cat.name}">Request Wholesale Quote</button>
  </div>
</header>

<div class="wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="../index.html">Home</a><span class="sep">/</span><a href="../index.html#range">Products</a><span class="sep">/</span><span class="current">${cat.name}</span>
  </nav>
</div>

<section class="cat-main">
  <div class="wrap cat-layout">
    <aside class="cat-sidebar reveal">
      ${icon}
      <span class="count">${cat.products.length} Products</span>
      <h4>${cat.name}</h4>
      <p>${cat.gridDescriptor}</p>
      <button class="btn-quote js-open-modal" data-product="${cat.name}">Request a Quote</button>
    </aside>
    <div class="product-grid">${buildProductGrid(cat)}</div>
  </div>
</section>

<section class="related">
  <div class="wrap">
    <div class="related-head reveal">
      <span class="label">Explore More Categories</span>
      <h2 class="section-title">Round Out\nYour Order.</h2>
    </div>
    <div class="related-grid">${buildRelated(cat)}</div>
  </div>
</section>

${footerHTML(1)}
${MODAL_HTML}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
${sharedScript()}
ScrollTrigger.batch('.product-card', {
  start:'top 90%', once:true,
  onEnter:function(batch){ gsap.fromTo(batch, {opacity:0, y:24}, {opacity:1, y:0, duration:0.5, stagger:0.05, ease:'power3.out'}); }
});
</script>
</body>
</html>`;
}

module.exports = { buildCategoryHTML };
