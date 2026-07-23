const { CATEGORIES, CATEGORY_ICONS } = require('../data');
const { SHARED_CSS, navHTML, footerHTML, MODAL_HTML, sharedScript, ARROW_SVG, LEAF_SVG, CHECK_SVG } = require('../templates');

function img(id, w, q) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 1600}&q=${q || 80}`;
}

const HERO_IMG = img('1606312619070-d48b4c652a52', 2200, 80);
const STORY_IMG = img('1598188080888-42dfffa02287', 1200, 80);

const PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
const MAIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2z"/></svg>';
const CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2.5"/></svg>';

const PAGE_CSS = `
/* ============ HERO ============ */
.hero{position:relative;min-height:100dvh;overflow:hidden;display:flex;align-items:center;}
.hero-img{position:absolute;inset:0;background-image:url('${HERO_IMG}');background-size:cover;background-position:center;transform:scale(1.12);animation:heroZoom 22s ease-in-out infinite alternate;}
@keyframes heroZoom{from{transform:scale(1.12);}to{transform:scale(1.0);}}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg, rgba(10,8,4,0.68) 0%, rgba(10,8,4,0.42) 45%, rgba(10,8,4,0.78) 100%);}
.hero-inner{position:relative;z-index:2;width:100%;}
.hero-content{max-width:680px;color:#fff;}
.hero-eyebrow{display:block;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:24px;opacity:0;}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,6.5vw,5.2rem);line-height:1.08;color:#fff;margin-bottom:26px;}
.hero-title span{display:block;overflow:hidden;}
.hero-title span b{display:block;font-weight:600;font-style:normal;transform:translateY(110%);}
.hero-desc{font-size:17px;color:rgba(255,255,255,0.82);max-width:480px;margin-bottom:36px;opacity:0;}
.hero-ctas{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-bottom:54px;opacity:0;}
.hero-ctas .btn-outline{border-color:rgba(255,255,255,0.5);color:#fff;}
.hero-ctas .btn-outline:hover{background:#fff;color:var(--ink);border-color:#fff;}
.hero-trust{display:flex;gap:28px;flex-wrap:wrap;opacity:0;}
.hero-trust-item{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.85);}
.hero-trust-item svg{width:18px;height:18px;color:var(--gold);flex-shrink:0;}
.hero-scroll{position:absolute;left:50%;bottom:36px;transform:translateX(-50%);z-index:2;display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,0.75);}
.hero-scroll span{font-size:10px;letter-spacing:2px;text-transform:uppercase;}
.hero-scroll svg{width:18px;height:18px;animation:scrollBounce 2s ease-in-out infinite;}
@keyframes scrollBounce{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(8px);opacity:1;}}

/* ============ STORY ============ */
.story{padding:130px 0;background:#fff;overflow:hidden;}
.story-grid{display:grid;grid-template-columns:0.95fr 1.05fr;gap:72px;align-items:center;}
.story-img-wrap{position:relative;}
.story-img-frame{position:absolute;inset:18px -18px -18px 18px;border:1px solid var(--gold);border-radius:14px;z-index:0;}
.story-img-box{position:relative;border-radius:14px;overflow:hidden;aspect-ratio:4/5;z-index:1;box-shadow:0 30px 60px -20px rgba(0,0,0,0.25);}
.story-img-box img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s var(--ease-enter);}
.story-img-wrap:hover .story-img-box img{transform:scale(1.06);}
.story-badge{position:absolute;left:-28px;bottom:36px;background:#fff;border-radius:12px;padding:18px 22px;box-shadow:0 18px 40px -10px rgba(0,0,0,0.18);z-index:2;display:flex;align-items:center;gap:14px;animation:floatY 4s ease-in-out infinite;}
.story-badge svg{width:30px;height:30px;color:var(--green);flex-shrink:0;}
.story-badge .num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--ink);line-height:1;}
.story-badge .lbl{font-size:11px;color:var(--text-muted);margin-top:2px;}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.story-text-inner p{color:var(--text-muted);margin-bottom:18px;font-size:16px;}
.story-mini-stats{display:flex;gap:30px;margin:28px 0 34px;flex-wrap:wrap;}
.story-mini-stats div{display:flex;flex-direction:column;}
.story-mini-stats .n{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:var(--green);}
.story-mini-stats .l{font-size:12px;color:var(--text-muted);margin-top:2px;}

/* ============ CATEGORY SLIDER ============ */
.cat-slider-section{padding:130px 0 110px;background:var(--cream);overflow:hidden;}
.cat-slider-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:44px;flex-wrap:wrap;}
.cat-slider-nav{display:flex;gap:10px;}
.cat-slider-arrow{width:48px;height:48px;border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink);background:#fff;transition:background .15s var(--ease-enter), color .15s var(--ease-enter), border-color .15s var(--ease-enter);}
.cat-slider-arrow:hover{background:var(--green);color:#fff;border-color:var(--green);}
.cat-slider-arrow svg{width:18px;height:18px;}
.cat-slider-arrow.prev svg{transform:rotate(180deg);}
.cat-slider-viewport{overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -32px;padding:0 32px;}
.cat-slider-viewport::-webkit-scrollbar{display:none;}
.cat-slider-track{display:flex;gap:24px;}
.cat-slide-card{position:relative;flex:0 0 300px;scroll-snap-align:start;border-radius:14px;overflow:hidden;min-height:400px;display:flex;flex-direction:column;justify-content:space-between;padding:30px;color:#fff;transition:transform .25s var(--ease-enter);}
.cat-slide-card:hover{transform:translateY(-6px);}
.cat-slide-card .cat-icon{width:40px;height:40px;color:rgba(255,255,255,0.85);}
.cat-slide-card h3{font-size:1.5rem;color:#fff;margin-bottom:8px;}
.cat-slide-card p{font-size:13px;color:rgba(255,255,255,0.75);}
.cat-slide-card .arrow-corner{position:absolute;bottom:24px;right:24px;width:36px;height:36px;border:1px solid rgba(255,255,255,0.35);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .15s var(--ease-enter), border-color .15s var(--ease-enter);}
.cat-slide-card:hover .arrow-corner{background:#fff;border-color:#fff;}
.cat-slide-card .arrow-corner svg{width:14px;height:14px;color:#fff;transition:color .15s var(--ease-enter);}
.cat-slide-card:hover .arrow-corner svg{color:var(--green);}
.cat-slider-dots{display:flex;justify-content:center;gap:10px;margin-top:36px;}
.cat-slider-dot{width:8px;height:8px;border-radius:50%;background:var(--border);transition:background .2s var(--ease-enter), transform .2s var(--ease-enter);}
.cat-slider-dot.active{background:var(--green);transform:scale(1.25);}

/* ============ CTA BANNER ============ */
.cta-banner{position:relative;background:var(--green);padding:100px 0;overflow:hidden;}
.cta-banner .blob{position:absolute;border-radius:50%;background:rgba(255,255,255,0.06);}
.cta-banner .blob-1{width:340px;height:340px;top:-120px;right:-80px;animation:floatY 7s ease-in-out infinite;}
.cta-banner .blob-2{width:220px;height:220px;bottom:-100px;right:18%;animation:floatY 5s ease-in-out infinite reverse;}
.cta-inner{position:relative;z-index:1;max-width:560px;}
.cta-inner h2{color:#fff;font-size:clamp(1.8rem,3vw,2.6rem);margin-bottom:18px;}
.cta-inner p{color:rgba(255,255,255,0.8);margin-bottom:36px;font-size:16px;}
.cta-banner .btn-primary{background:#fff;color:var(--green);}
.cta-banner .btn-primary:hover{background:var(--cream);}

/* ============ HOME CONTACT ============ */
.home-contact{padding:130px 0;background:#fff;}
.home-contact-grid{display:grid;grid-template-columns:1fr 1.25fr;gap:64px;align-items:start;}
.home-contact-info p{color:var(--text-muted);font-size:16px;margin:18px 0 36px;max-width:420px;}
.home-contact-details{display:flex;flex-direction:column;gap:26px;}
.contact-item{display:flex;gap:16px;align-items:flex-start;}
.contact-item svg{width:24px;height:24px;color:var(--green);flex-shrink:0;margin-top:2px;}
.contact-item h4{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:4px;}
.contact-item p{font-size:15px;color:var(--text-muted);}
.home-contact-form-card{border:1px solid var(--border);border-radius:14px;padding:44px;background:var(--cream);}
.home-contact-form-card h3{font-size:1.4rem;color:var(--ink);margin-bottom:8px;}
.home-contact-form-card .modal-sub{margin-bottom:28px;}
.home-form-field{display:flex;flex-direction:column;gap:6px;margin-bottom:18px;}
.home-form-field label{font-size:13px;font-weight:500;color:var(--text);}
.home-form-field .req{color:var(--green);}
.home-form-field input, .home-form-field textarea{border:1px solid var(--border);border-radius:6px;padding:11px 14px;font-family:'Inter',sans-serif;font-size:14px;color:var(--text);background:#fff;transition:border-color .15s var(--ease-enter);}
.home-form-field input:focus, .home-form-field textarea:focus{outline:none;border-color:var(--green);}
.home-form-field textarea{resize:vertical;min-height:90px;}
.home-thankyou{display:none;text-align:center;padding:30px 0;}
.home-thankyou.show{display:block;}
.home-thankyou svg{width:50px;height:50px;color:var(--green);margin:0 auto 18px;}
.home-form-body.hide{display:none;}
.home-contact-note{font-size:13px;color:var(--text-muted);margin-top:16px;}
.home-contact-note a{color:var(--green);font-weight:500;}

@media (max-width:980px){
  .story-grid{grid-template-columns:1fr;gap:48px;}
  .story-badge{left:18px;}
  .home-contact-grid{grid-template-columns:1fr;}
}
@media (max-width:768px){
  .hero-ctas{margin-bottom:36px;}
  .cat-slide-card{flex:0 0 78vw;min-height:340px;}
  .home-contact-form-card{padding:32px 24px;}
}
@media (max-width:480px){
  .story-img-frame{display:none;}
  .story-badge{position:static;margin-top:18px;animation:none;}
  .hero-trust{gap:16px;}
}
`;

function buildHero() {
  return `
<header class="hero" id="hero">
  <div class="hero-img"></div>
  <div class="hero-overlay"></div>
  <div class="wrap hero-inner">
    <div class="hero-content">
      <span class="hero-eyebrow" data-hero="eyebrow">FineBites · Wholesale Confectionery</span>
      <h1 class="hero-title">
        <span><b data-hero="line1">Sweetness,</b></span>
        <span><b data-hero="line2">Supplied at Scale.</b></span>
      </h1>
      <p class="hero-desc" data-hero="desc">Premium lollipops, biscuits, chocolates, gummies and more — wholesale-ready for retailers, supermarkets and distributors across the UAE.</p>
      <div class="hero-ctas" data-hero="ctas">
        <a href="#range" class="btn btn-primary">Explore Our Range</a>
        <button class="btn btn-outline js-open-modal">Request a Quote</button>
      </div>
      <div class="hero-trust" data-hero="trust">
        <div class="hero-trust-item">${LEAF_SVG}<span>UAE Origin</span></div>
        <div class="hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z"/><path d="M9 12l2.5 2.5L16 9.5"/></svg><span>Halal Certified</span></div>
        <div class="hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg><span>Wholesale Ready</span></div>
      </div>
    </div>
  </div>
  <div class="hero-scroll"><span>Scroll</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v16M6 14l6 6 6-6"/></svg></div>
</header>`;
}

function buildStory() {
  return `
<section class="story">
  <div class="wrap story-grid">
    <div class="story-img-wrap reveal">
      <div class="story-img-frame"></div>
      <div class="story-img-box"><img src="${STORY_IMG}" alt="FineBites confectionery"></div>
      <div class="story-badge">
        ${LEAF_SVG}
        <div><div class="num">9</div><div class="lbl">Categories Supplied</div></div>
      </div>
    </div>
    <div class="story-text-inner reveal">
      <span class="label">Who We Are</span>
      <h2 class="section-title" style="margin-bottom:20px;">Confectionery Built\nfor the UAE Market.</h2>
      <p>FineBites supplies bakeries, supermarkets and distributors across the UAE with confectionery made to a consistent standard, order after order. Every line is sourced, checked and documented before it reaches your shelf.</p>
      <p>We work with standing orders, not one-off drops — which means lead times you can plan around and a catalogue that doesn't change shape every season.</p>
      <div class="story-mini-stats">
        <div><span class="n">50+</span><span class="l">Products</span></div>
        <div><span class="n">9</span><span class="l">Categories</span></div>
        <div><span class="n">Halal</span><span class="l">Certified</span></div>
      </div>
      <a href="about.html" class="btn btn-primary">Read Our Story ${ARROW_SVG}</a>
    </div>
  </div>
</section>`;
}

function buildCatSlider() {
  const cards = CATEGORIES.map(c => `
      <a href="category/${c.slug}.html" class="cat-slide-card reveal" style="background:${c.bg};">
        <span class="cat-icon">${CATEGORY_ICONS[c.name]}</span>
        <div>
          <h3>${c.name}</h3>
          <p>${c.gridDescriptor}</p>
        </div>
        <span class="arrow-corner">${ARROW_SVG}</span>
      </a>`).join('');
  const dots = CATEGORIES.map((c, i) => `<button class="cat-slider-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to ${c.name}"></button>`).join('');
  return `
<section class="cat-slider-section" id="range">
  <div class="wrap">
    <div class="cat-slider-head">
      <div class="range-head" style="margin-bottom:0;">
        <span class="label">Our Range</span>
        <h2 class="section-title reveal">Nine Categories.\nOne Trusted Supplier.</h2>
      </div>
      <div class="cat-slider-nav">
        <button class="cat-slider-arrow prev" id="catPrev" aria-label="Previous">${ARROW_SVG}</button>
        <button class="cat-slider-arrow next" id="catNext" aria-label="Next">${ARROW_SVG}</button>
      </div>
    </div>
  </div>
  <div class="wrap">
    <div class="cat-slider-viewport" id="catViewport">
      <div class="cat-slider-track" id="catTrack">${cards}</div>
    </div>
    <div class="cat-slider-dots" id="catDots">${dots}</div>
  </div>
</section>`;
}

function buildCtaBanner() {
  return `
<section class="cta-banner">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="wrap">
    <div class="cta-inner reveal">
      <h2>Stocking a UAE Store? Let's Talk Wholesale.</h2>
      <p>Tell us what you need and how much, and we'll come back with a quote and lead time within a day.</p>
      <button class="btn btn-primary js-open-modal">Send Us an Inquiry</button>
    </div>
  </div>
</section>`;
}

function buildHomeContact() {
  return `
<section class="home-contact" id="contact-section">
  <div class="wrap home-contact-grid">
    <div class="home-contact-info reveal">
      <span class="label">Get In Touch</span>
      <h2 class="section-title">Let's Start\nYour Order.</h2>
      <p>Send us a few details about your business and what you'd like to stock — we typically reply with pricing and lead times within 24 hours.</p>
      <div class="home-contact-details">
        <div class="contact-item">${PIN_SVG}<div><h4>Address</h4><p>Dubai, United Arab Emirates</p></div></div>
        <div class="contact-item">${MAIL_SVG}<div><h4>Email</h4><p>hello@finebites.com</p></div></div>
        <div class="contact-item">${PHONE_SVG}<div><h4>Phone / WhatsApp</h4><p>+971 4 000 0000</p></div></div>
        <div class="contact-item">${CLOCK_SVG}<div><h4>Hours</h4><p>Sunday – Thursday, 9:00 – 18:00 GST</p></div></div>
      </div>
    </div>
    <div class="home-contact-form-card reveal">
      <div class="home-form-body" id="homeFormBody">
        <h3>Quick Inquiry</h3>
        <p class="modal-sub">Prefer more detail? Use our full inquiry form instead.</p>
        <form id="homeInquiryForm" novalidate>
          <div class="home-form-field">
            <label>Full Name <span class="req">*</span></label>
            <input type="text" name="fullName" autocomplete="name">
            <span class="field-error" data-err="homeFullName"></span>
          </div>
          <div class="home-form-field">
            <label>Email Address <span class="req">*</span></label>
            <input type="email" name="email" autocomplete="email">
            <span class="field-error" data-err="homeEmail"></span>
          </div>
          <div class="home-form-field">
            <label>Phone / WhatsApp <span class="req">*</span></label>
            <input type="tel" name="phone" autocomplete="tel">
            <span class="field-error" data-err="homePhone"></span>
          </div>
          <div class="home-form-field">
            <label>Message</label>
            <textarea name="message" placeholder="What would you like to stock?"></textarea>
          </div>
          <button type="submit" class="btn btn-primary modal-submit">Send Message</button>
        </form>
        <p class="home-contact-note">Need to specify quantities and product lines? <a href="contact.html">Open the full quote form</a>.</p>
      </div>
      <div class="home-thankyou" id="homeThankYou">
        ${CHECK_SVG}
        <h3>Thank you.</h3>
        <p id="homeThankYouText">We'll review your message and get back to you within 24 hours.</p>
      </div>
    </div>
  </div>
</section>`;
}

function buildIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FineBites — Premium Wholesale Confectionery, UAE</title>
<meta name="description" content="FineBites supplies premium lollipops, biscuits, chocolates, gummies, wafers, toffees, jelly beans, marshmallows and candy to wholesalers across the UAE.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>${SHARED_CSS}${PAGE_CSS}</style>
</head>
<body>

${navHTML(0, true)}

${buildHero()}
${buildStory()}
${buildCatSlider()}
${buildCtaBanner()}
${buildHomeContact()}

${footerHTML(0)}
${MODAL_HTML}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
${sharedScript()}

/* ---- hero entrance ---- */
window.addEventListener('DOMContentLoaded', function(){
  var tl = gsap.timeline({delay:0.2});
  tl.to('[data-hero="eyebrow"]', {opacity:1, duration:0.6, ease:'power3.out'})
    .to('.hero-title b', {y:0, duration:0.9, stagger:0.12, ease:'power4.out'}, '-=0.3')
    .to('[data-hero="desc"]', {opacity:1, duration:0.7, ease:'power3.out'}, '-=0.5')
    .to('[data-hero="ctas"]', {opacity:1, duration:0.7, ease:'power3.out'}, '-=0.5')
    .to('[data-hero="trust"]', {opacity:1, duration:0.7, ease:'power3.out'}, '-=0.5');
});

/* ---- category slider ---- */
(function(){
  var viewport = document.getElementById('catViewport');
  var track = document.getElementById('catTrack');
  var cards = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('.cat-slider-dot'));
  var prevBtn = document.getElementById('catPrev');
  var nextBtn = document.getElementById('catNext');
  var timer = null;

  function cardStep(){
    return cards[0].getBoundingClientRect().width + 24;
  }
  function activeIndex(){
    return Math.round(viewport.scrollLeft / cardStep());
  }
  function setDots(){
    var i = Math.min(activeIndex(), dots.length - 1);
    dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
  }
  function goTo(index){
    var max = cards.length - 1;
    if(index < 0) index = max;
    if(index > max) index = 0;
    viewport.scrollTo({left: index * cardStep(), behavior:'smooth'});
  }
  function next(){ goTo(activeIndex() + 1); }
  function prevSlide(){ goTo(activeIndex() - 1); }
  function resetTimer(){
    if(timer) clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  nextBtn.addEventListener('click', function(){ next(); resetTimer(); });
  prevBtn.addEventListener('click', function(){ prevSlide(); resetTimer(); });
  dots.forEach(function(d){ d.addEventListener('click', function(){ goTo(parseInt(d.dataset.index,10)); resetTimer(); }); });
  viewport.addEventListener('scroll', function(){
    window.requestAnimationFrame(setDots);
  }, {passive:true});
  viewport.addEventListener('mouseenter', function(){ if(timer) clearInterval(timer); });
  viewport.addEventListener('mouseleave', resetTimer);

  resetTimer();
})();

/* ---- home contact quick form ---- */
(function(){
  var form = document.getElementById('homeInquiryForm');
  var formBody = document.getElementById('homeFormBody');
  var thankYou = document.getElementById('homeThankYou');
  var thankYouText = document.getElementById('homeThankYouText');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    function setErr(name, msg){ var el = form.querySelector('[data-err="'+name+'"]'); if(el) el.textContent = msg || ''; }
    setErr('homeFullName',''); setErr('homeEmail',''); setErr('homePhone','');
    function val(n){ return form.elements[n] ? form.elements[n].value.trim() : ''; }
    var name = val('fullName');
    if(!name){ setErr('homeFullName','Please enter your name.'); valid = false; }
    var email = val('email');
    if(!email){ setErr('homeEmail','Please enter your email.'); valid = false; }
    else if(!isValidEmail(email)){ setErr('homeEmail','Please enter a valid email address.'); valid = false; }
    if(!val('phone')){ setErr('homePhone','Please enter a phone or WhatsApp number.'); valid = false; }
    if(!valid) return;
    thankYouText.textContent = "Thank you, " + name + ". We'll review your message and get back to you within 24 hours.";
    formBody.classList.add('hide');
    thankYou.classList.add('show');
    gsap.fromTo(thankYou, {opacity:0, y:10}, {opacity:1, y:0, duration:0.4, ease:'power3.out'});
  });
})();
</script>
</body>
</html>`;
}

module.exports = { buildIndexHTML };
