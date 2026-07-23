const { SHARED_CSS, navHTML, footerHTML, MODAL_HTML, sharedScript } = require('../templates');

const STAR_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M24 6l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z"/></svg>';
const SHIELD_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M24 6l16 7v9c0 12-7 19-16 22-9-3-16-10-16-22v-9z"/><path d="M18 24l5 5 9-10"/></svg>';
const COMPASS_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="24" cy="24" r="18"/><path d="M24 12v6M24 30v6M12 24h6M30 24h6"/></svg>';
const CLOCK_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="24" cy="24" r="18"/><path d="M24 14v10l8 5"/></svg>';
const LEAF_VISUAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 20C4 11 11 4 20 4C20 13 13 20 4 20Z"/><path d="M4.5 19.5C9 15 13 11 18.5 5.5"/></svg>';
const CRATE_VISUAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 8l9-5 9 5M7 8v13M17 8v13"/></svg>';

const PAGE_CSS = `
.page-hero{padding:170px 0 90px;background:var(--cream);}
.page-hero h1{font-size:clamp(2.6rem,4.5vw,3.8rem);color:var(--ink);max-width:680px;margin-bottom:20px;}
.page-hero p{font-size:17px;color:var(--text-muted);max-width:520px;}

.zigzag-section{padding:90px 0;}
.zigzag-section.alt{background:#fff;}
.zigzag{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
.zigzag.reverse .zz-text{order:2;}
.zigzag.reverse .zz-visual{order:1;}
.zz-text p{color:var(--text-muted);margin-bottom:18px;font-size:16px;}
.zz-bullets{margin-top:22px;display:flex;flex-direction:column;gap:14px;}
.zz-bullets li{display:flex;align-items:flex-start;gap:12px;font-size:15px;}
.zz-dot{width:8px;height:8px;border-radius:50%;background:var(--green);margin-top:7px;flex-shrink:0;}
.zz-visual{position:relative;aspect-ratio:4/3;border-radius:14px;background:linear-gradient(135deg,#E7DCD2,#FBEFE0);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;}
.zz-visual svg{width:110px;height:110px;color:var(--green);opacity:.7;}

.values{padding:100px 0;background:#fff;}
.values-head{max-width:560px;margin-bottom:48px;}
.values-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.value-card{border:1px solid var(--border);border-radius:10px;padding:32px 26px;}
.value-card svg{width:34px;height:34px;color:var(--green);margin-bottom:20px;}
.value-card h3{font-size:1.15rem;margin-bottom:10px;color:var(--ink);}
.value-card p{font-size:14px;color:var(--text-muted);}

.team{padding:100px 0;}
.team-inner{max-width:680px;}
.team-inner p{color:var(--text-muted);font-size:16px;margin-bottom:18px;}

@media (max-width:980px){
  .zigzag{grid-template-columns:1fr;gap:40px;}
  .zigzag .zz-text{order:1 !important;}
  .zigzag .zz-visual{order:2 !important;}
  .values-grid{grid-template-columns:1fr 1fr;}
}
@media (max-width:480px){
  .values-grid{grid-template-columns:1fr;}
}
`;

function buildAboutHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About FineBites — UAE Wholesale Confectionery Supplier</title>
<meta name="description" content="FineBites is a UAE-based wholesale confectionery supplier serving distributors, supermarkets and bakeries across the Gulf.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>${SHARED_CSS}${PAGE_CSS}</style>
</head>
<body>

${navHTML(0, false)}

<header class="page-hero">
  <div class="wrap">
    <span class="label">About FineBites</span>
    <h1>Confectionery built for the UAE's wholesale shelf.</h1>
    <p>We supply distributors, supermarkets and bakeries across the UAE and wider Gulf — with a catalogue built around consistency, not novelty.</p>
  </div>
</header>

<section class="zigzag-section">
  <div class="wrap zigzag">
    <div class="zz-text reveal">
      <span class="label">Our Story</span>
      <h2 class="section-title" style="margin-bottom:20px;">Rooted in the UAE.\nLoved Across the Region.</h2>
      <p>FineBites started as a small confectionery trading desk in Dubai, supplying corner shops and bakeries with reliable stock. Over time the same relationships grew into standing orders with supermarkets and distributors across the Gulf.</p>
      <p>We still run the business the same way: clear specifications, consistent batches, and orders that arrive when we say they will. Every product on our list is something we'd put on our own shelf.</p>
      <ul class="zz-bullets">
        <li><span class="zz-dot"></span>Direct sourcing relationships with manufacturers across the region</li>
        <li><span class="zz-dot"></span>Batch consistency checked before every dispatch</li>
        <li><span class="zz-dot"></span>Packaging built around carton and pallet efficiency</li>
      </ul>
    </div>
    <div class="zz-visual reveal">${LEAF_VISUAL}</div>
  </div>
</section>

<section class="zigzag-section alt">
  <div class="wrap zigzag reverse">
    <div class="zz-text reveal">
      <span class="label">What This Means</span>
      <h2 class="section-title" style="margin-bottom:20px;">A Range Built for\nRepeat Ordering.</h2>
      <p>Wholesale buyers don't need novelty every month — they need the same product to arrive the same way, every time. That's the standard we hold ourselves to across the full catalogue.</p>
      <p>Every line is Halal certified and documented for import across the GCC, so your paperwork moves as fast as your stock does.</p>
      <ul class="zz-bullets">
        <li><span class="zz-dot"></span>Halal certification documented for every category</li>
        <li><span class="zz-dot"></span>Standing orders prioritised over one-off requests</li>
        <li><span class="zz-dot"></span>Lead times confirmed before dispatch, not after</li>
      </ul>
    </div>
    <div class="zz-visual reveal">${CRATE_VISUAL}</div>
  </div>
</section>

<section class="values">
  <div class="wrap">
    <div class="values-head reveal">
      <span class="label">What We Hold To</span>
      <h2 class="section-title">Four Things We\nDon't Compromise On.</h2>
    </div>
    <div class="values-grid">
      <div class="value-card reveal">${STAR_SVG}<h3>Quality</h3><p>Every batch checked against spec before it ships, not after a complaint.</p></div>
      <div class="value-card reveal">${SHIELD_SVG}<h3>Halal</h3><p>Full certification on every category, documented and ready for customs.</p></div>
      <div class="value-card reveal">${COMPASS_SVG}<h3>UAE Heritage</h3><p>Built in Dubai, with sourcing relationships across the region.</p></div>
      <div class="value-card reveal">${CLOCK_SVG}<h3>Reliability</h3><p>Lead times we quote are lead times we hold to, season after season.</p></div>
    </div>
  </div>
</section>

<section class="team">
  <div class="wrap team-inner reveal">
    <span class="label">The People Behind FineBites</span>
    <h2 class="section-title" style="margin-bottom:20px;">A Small Team,\nA Direct Line.</h2>
    <p>FineBites is run by a small trading and logistics team based in Dubai, with direct relationships across sourcing, quality checks and dispatch. When you place an order, you're dealing with the same people who packed the last one — not a call centre.</p>
    <p>That's deliberate. It's what lets us hold lead times and catch problems before they reach your shelf.</p>
  </div>
</section>

<section class="cta-banner" style="background:var(--green);padding:100px 0;">
  <div class="wrap">
    <div class="cta-inner reveal" style="max-width:560px;">
      <h2 style="color:#fff;font-size:clamp(1.8rem,3vw,2.6rem);margin-bottom:18px;">Want to Talk Through Your Order?</h2>
      <p style="color:rgba(255,255,255,0.8);margin-bottom:36px;font-size:16px;">Reach out and we'll walk through products, lead times and minimum order sizes.</p>
      <a href="contact.html" class="btn btn-primary" style="background:#fff;color:var(--green);">Go to Contact</a>
    </div>
  </div>
</section>

${footerHTML(0)}
${MODAL_HTML}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>${sharedScript()}</script>
</body>
</html>`;
}

module.exports = { buildAboutHTML };
