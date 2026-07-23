const { SHARED_CSS, navHTML, footerHTML, MODAL_HTML, sharedScript, CHECK_SVG } = require('../templates');

const PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
const MAIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2z"/></svg>';
const CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2.5"/></svg>';

const PAGE_CSS = `
.page-hero{padding:170px 0 90px;background:var(--cream);}
.page-hero h1{font-size:clamp(2.6rem,4.5vw,3.8rem);color:var(--ink);max-width:680px;margin-bottom:20px;}
.page-hero p{font-size:17px;color:var(--text-muted);max-width:520px;}

.contact-section{padding:0 0 120px;}
.contact-grid{display:grid;grid-template-columns:1fr 1.3fr;gap:64px;align-items:start;}
.contact-details{display:flex;flex-direction:column;gap:28px;}
.contact-item{display:flex;gap:16px;align-items:flex-start;}
.contact-item svg{width:24px;height:24px;color:var(--green);flex-shrink:0;margin-top:2px;}
.contact-item h4{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:4px;}
.contact-item p{font-size:15px;color:var(--text-muted);}

.contact-form-card{border:1px solid var(--border);border-radius:14px;padding:44px;background:#fff;}
.contact-form-card h3{font-size:1.5rem;color:var(--ink);margin-bottom:8px;}
.contact-form-card .modal-sub{margin-bottom:30px;}
.page-thankyou{display:none;text-align:center;padding:40px 0;}
.page-thankyou.show{display:block;}
.page-thankyou svg{width:54px;height:54px;color:var(--green);margin:0 auto 20px;}
.page-thankyou h3{margin-bottom:10px;}
.page-thankyou p{color:var(--text-muted);font-size:15px;}
.contact-form-body.hide{display:none;}

@media (max-width:980px){
  .contact-grid{grid-template-columns:1fr;gap:48px;}
}
@media (max-width:768px){
  .contact-form-card{padding:32px 24px;}
}
`;

function buildContactHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact FineBites — Wholesale Inquiries</title>
<meta name="description" content="Get in touch with FineBites for wholesale confectionery pricing, lead times and minimum order sizes across the UAE and GCC.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>${SHARED_CSS}${PAGE_CSS}</style>
</head>
<body>

${navHTML(0, false)}

<header class="page-hero">
  <div class="wrap">
    <span class="label">Contact</span>
    <h1>Get in Touch.</h1>
    <p>Tell us what you're looking to stock and how much — we reply with pricing and lead times within 24 hours.</p>
  </div>
</header>

<section class="contact-section">
  <div class="wrap contact-grid">
    <div class="contact-details reveal">
      <div class="contact-item">${PIN_SVG}<div><h4>Address</h4><p>Dubai, United Arab Emirates</p></div></div>
      <div class="contact-item">${MAIL_SVG}<div><h4>Email</h4><p>hello@finebites.com</p></div></div>
      <div class="contact-item">${PHONE_SVG}<div><h4>Phone / WhatsApp</h4><p>+971 4 000 0000</p></div></div>
      <div class="contact-item">${CLOCK_SVG}<div><h4>Hours</h4><p>Sunday – Thursday, 9:00 – 18:00 GST</p></div></div>
    </div>

    <div class="contact-form-card reveal">
      <div class="contact-form-body" id="pageFormBody">
        <h3>Request a Wholesale Quote</h3>
        <p class="modal-sub">Fields marked with an asterisk are required.</p>
        <form id="pageInquiryForm" novalidate>
          <div class="form-grid">
            <div class="form-field">
              <label>Full Name <span class="req">*</span></label>
              <input type="text" name="fullName" autocomplete="name">
              <span class="field-error" data-err="fullName"></span>
            </div>
            <div class="form-field">
              <label>Company Name <span class="req">*</span></label>
              <input type="text" name="companyName" autocomplete="organization">
              <span class="field-error" data-err="companyName"></span>
            </div>
            <div class="form-field">
              <label>Email Address <span class="req">*</span></label>
              <input type="email" name="email" autocomplete="email">
              <span class="field-error" data-err="email"></span>
            </div>
            <div class="form-field">
              <label>Phone / WhatsApp <span class="req">*</span></label>
              <input type="tel" name="phone" autocomplete="tel">
              <span class="field-error" data-err="phone"></span>
            </div>
            <div class="form-field">
              <label>Country <span class="req">*</span></label>
              <select name="country">
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Qatar">Qatar</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Oman">Oman</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-field">
              <label>Quantity / Order Size</label>
              <input type="text" name="quantity" placeholder="e.g. 500 units / 10 cartons">
            </div>
            <div class="form-field full">
              <label>Product of Interest</label>
              <input type="text" name="product" placeholder="e.g. Rainbow Swirl Lollipop">
            </div>
            <div class="form-field full">
              <label>Additional Notes</label>
              <textarea name="notes" placeholder="Anything else we should know"></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary modal-submit">Send Inquiry</button>
        </form>
      </div>
      <div class="page-thankyou" id="pageThankYou">
        ${CHECK_SVG}
        <h3>Thank you.</h3>
        <p id="pageThankYouText">We'll review your inquiry and get back to you within 24 hours.</p>
      </div>
    </div>
  </div>
</section>

${footerHTML(0)}
${MODAL_HTML}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
${sharedScript()}

var pageForm = document.getElementById('pageInquiryForm');
var pageFormBody = document.getElementById('pageFormBody');
var pageThankYou = document.getElementById('pageThankYou');
var pageThankYouText = document.getElementById('pageThankYouText');
wireForm(pageForm, function(name){
  pageThankYouText.textContent = "Thank you, " + name + ". We'll review your inquiry and get back to you within 24 hours.";
  pageFormBody.classList.add('hide');
  pageThankYou.classList.add('show');
  gsap.fromTo(pageThankYou, {opacity:0, y:10}, {opacity:1, y:0, duration:0.4, ease:'power3.out'});
});
</script>
</body>
</html>`;
}

module.exports = { buildContactHTML };
