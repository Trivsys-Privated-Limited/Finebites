/* FineBites: forward every enquiry / quote form to WhatsApp.
   Runs after each page's own validation handler (document-level, bubble phase). */
(function () {
  var WA = '971527097123';
  var LABELS = { fullName: 'Name', companyName: 'Company', email: 'Email', phone: 'Phone',
    productInterest: 'Product', product: 'Product', message: 'Message' };
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    setTimeout(function () {
      var errs = form.querySelectorAll('.field-error');
      for (var i = 0; i < errs.length; i++) if (errs[i].textContent.trim()) return; // invalid, stay
      var lines = ['*New enquiry from finebitesllc.com*'];
      var els = form.querySelectorAll('input[name], textarea[name], select[name]');
      for (var j = 0; j < els.length; j++) {
        var el = els[j], v = (el.value || '').trim();
        if (!v || el.type === 'hidden' && !LABELS[el.name]) continue;
        lines.push((LABELS[el.name] || el.name) + ': ' + v);
      }
      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
      var w = window.open(url, '_blank');
      if (!w) window.location.href = url;
    }, 0);
  });
})();
