/* FineBites inquiry delivery (all pages).
   Each page's own script validates the form and shows its "Thank you" box.
   This runs after that (document-level listener), and only when the form passed validation:
     1. emails the inquiry through /send.php
     2. opens WhatsApp in a new tab with the details already typed in,
        and adds a "Send on WhatsApp" button in case the browser blocks that tab
   (This replaces the old js/fb-forms.js.) */
(function(){
  var WA = '971527097123';
  var THANKS = { inquiryForm:'thankYou', pageInquiryForm:'pageThankYou', homeInquiryForm:'homeThankYou' };
  var LABELS = { inquiryForm:'Quote popup', pageInquiryForm:'Contact page form', homeInquiryForm:'Home quick inquiry' };

  var css = document.createElement('style');
  css.textContent =
    '.inq-extra{margin-top:18px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;}' +
    '.inq-status{font-size:13px;line-height:1.5;opacity:.85;margin:0;}' +
    '.inq-status.err{opacity:1;font-weight:600;}' +
    '.inq-wa{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:999px;' +
      'background:#25D366;color:#fff !important;font-family:Inter,sans-serif;font-size:15px;font-weight:700;text-decoration:none;' +
      'box-shadow:0 8px 20px -10px rgba(37,211,102,.8);transition:filter .2s;}' +
    '.inq-wa:hover{filter:brightness(1.07);}' +
    '.inq-extra .inq-wa svg{width:18px !important;height:18px !important;margin:0 !important;color:#fff !important;display:block;flex-shrink:0;}';
  document.head.appendChild(css);

  // hidden honeypot field for spam bots
  Object.keys(THANKS).forEach(function(id){
    var f = document.getElementById(id);
    if(!f || f.elements['website']) return;
    var hp = document.createElement('input');
    hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    f.appendChild(hp);
  });

  function waText(d){
    var rows = [
      ['Name', d.fullName], ['Company', d.companyName], ['Email', d.email], ['Phone', d.phone],
      ['Country', d.country], ['Quantity', d.quantity], ['Product', d.product || d.productInterest],
      ['Message', d.message], ['Notes', d.notes]
    ];
    var t = 'Hello FineBites, I would like a wholesale quote.\n';
    rows.forEach(function(r){ if(r[1]) t += '\n' + r[0] + ': ' + r[1]; });
    return t;
  }

  document.addEventListener('submit', function(e){
    var form = e.target;
    if(!form || !THANKS[form.id]) return;
    // the page's validation runs first; if it flagged any field, do nothing
    var errs = form.querySelectorAll('.field-error');
    for(var i = 0; i < errs.length; i++) if(errs[i].textContent.trim()) return;

    var fd = new FormData(form);
    var d = {};
    fd.forEach(function(v, k){ d[k] = String(v).trim(); });
    if(!d.fullName || !d.email || !d.phone) return;
    fd.set('form', LABELS[form.id]);
    fd.set('page', location.href);

    var waUrl = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(waText(d));
    var box = document.getElementById(THANKS[form.id]) || (form.id === 'inquiryForm' && document.getElementById('thankyou'));
    var extra = null, status = null;
    if(box){
      var old = box.querySelector('.inq-extra'); if(old) old.remove();
      extra = document.createElement('div');
      extra.className = 'inq-extra';
      status = document.createElement('p');
      status.className = 'inq-status';
      status.textContent = 'Sending your inquiry...';
      var wa = document.createElement('a');
      wa.className = 'inq-wa';
      wa.href = waUrl;
      wa.target = '_blank'; wa.rel = 'noopener';
      wa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>Send on WhatsApp';
      extra.appendChild(status);
      extra.appendChild(wa);
      box.appendChild(extra);
    }

    function done(ok){
      if(!status) return;
      if(ok){
        status.className = 'inq-status';
        status.textContent = 'Your inquiry has been emailed to our team. WhatsApp opens with your details too: just tap Send there for a faster reply.';
      } else {
        status.className = 'inq-status err';
        status.textContent = "We couldn't send it by email. Please tap below to send it on WhatsApp instead.";
      }
    }

    // keepalive lets the email request finish even if the visitor leaves the page
    fetch('/send.php', { method:'POST', body:fd, keepalive:true, headers:{ 'Accept':'application/json' } })
      .then(function(r){ return r.ok ? r.json() : { ok:false }; })
      .then(function(j){ done(!!(j && j.ok)); })
      .catch(function(){ done(false); });

    // open WhatsApp in a new tab with the details typed in (still inside the click, so it isn't blocked);
    // if the browser blocks it anyway, the "Send on WhatsApp" button in the thank-you box is there
    try { window.open(waUrl, '_blank', 'noopener'); } catch(_) {}
  });
})();
