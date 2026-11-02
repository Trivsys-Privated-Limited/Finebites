/* FineBites mobile menu helpers (all pages).
   - adds html.menu-open while the overlay is open (see css/menu.css)
   - marks the current page link, adds WhatsApp / Call buttons
   - closes on Escape and when the screen grows past the mobile breakpoint */
(function(){
  var overlay = document.getElementById('mobileOverlay');
  var burger = document.getElementById('hamburger');
  if(!overlay || !burger) return;
  var root = document.documentElement;

  var here = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '/') ;
  overlay.querySelectorAll('.mobile-links > a').forEach(function(a){
    var p = new URL(a.getAttribute('href'), location.href).pathname.replace(/\/index\.html$/, '/');
    if(p === here) a.setAttribute('aria-current', 'page');
  });

  var links = overlay.querySelector('.mobile-links');
  if(links && !overlay.querySelector('.mobile-contact')){
    var strip = document.createElement('div');
    strip.className = 'mobile-contact';
    strip.innerHTML =
      '<a class="wa" href="https://wa.me/971527097123" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>WhatsApp</a>' +
      '<a href="tel:+971527097123"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>Call us</a>';
    links.appendChild(strip);
  }

  function sync(){ root.classList.toggle('menu-open', overlay.classList.contains('open')); }
  new MutationObserver(sync).observe(overlay, {attributes:true, attributeFilter:['class']});
  sync();

  function close(){ overlay.classList.remove('open'); burger.classList.remove('open'); }
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 768 && overlay.classList.contains('open')) close(); });
})();
