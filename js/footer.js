/* FineBites footer (all pages): entrance animation, newsletter signup, back-to-top, current year. */
/* floating WhatsApp button */
(function(){
  if(document.querySelector(".wa-float")) return;
  var a = document.createElement("a");
  a.className = "wa-float";
  a.href = "https://wa.me/971527097123?text=" + encodeURIComponent("Hello FineBites, I would like to know more about your products.");
  a.target = "_blank"; a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with FineBites on WhatsApp");
  a.innerHTML = '<span class="wa-float-tip">Chat with us<small>We reply within 24 hours</small></span>' +
    '<span class="wa-float-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg><span class="wa-dot">1</span></span>';
  document.body.appendChild(a);

  var seen = false;
  try { seen = sessionStorage.getItem("fbWaSeen") === "1"; } catch(_) {}
  if(seen){ a.classList.add("seen"); }
  else {
    // show the "Chat with us" bubble once per visit
    setTimeout(function(){ a.classList.add("tip-on"); }, 3500);
    setTimeout(function(){ a.classList.remove("tip-on"); }, 9500);
  }
  a.addEventListener("click", function(){ a.classList.add("seen"); a.classList.remove("tip-on"); try { sessionStorage.setItem("fbWaSeen","1"); } catch(_) {} });

  // move up so it never covers the footer back-to-top button
  var bottom = document.querySelector(".fbf-bottom");
  if(bottom && "IntersectionObserver" in window){
    new IntersectionObserver(function(es){ a.classList.toggle("lift", es[0].isIntersecting); }).observe(bottom);
  }
})();

(function(){
  var foot = document.querySelector('.fb-footer');
  if(!foot) return;

  var y = foot.querySelector('.fbf-year');
  if(y) y.textContent = new Date().getFullYear();

  // staggered entrance once the footer scrolls into view
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    foot.classList.add('fbf-js');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ foot.classList.add('fbf-in'); io.disconnect(); } });
    }, { threshold:0.08 });
    io.observe(foot);
  } else {
    foot.classList.add('fbf-in');
  }

  // back to top
  var top = foot.querySelector('.fbf-top');
  if(top) top.addEventListener('click', function(){ window.scrollTo({ top:0, behavior:'smooth' }); });

  // newsletter -> /send.php (emailed to the FineBites inbox)
  var form = document.getElementById('newsletterForm');
  if(!form) return;
  var input = form.elements['email'];
  var btn = form.querySelector('button[type=submit]');
  var label = btn.querySelector('span');
  var msg = form.querySelector('.fbf-news-msg');
  function say(text, cls){ msg.textContent = text; msg.className = 'fbf-news-msg' + (cls ? ' ' + cls : ''); }
  function shake(){ var f = form.querySelector('.fbf-field'); f.classList.remove('fbf-shake'); void f.offsetWidth; f.classList.add('fbf-shake'); }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = input.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ say('Please enter a valid email address.', 'err'); shake(); input.focus(); return; }
    var fd = new FormData(form);
    fd.set('form', 'Newsletter');
    fd.set('page', location.href);
    btn.disabled = true; label.textContent = 'Subscribing...'; say('');
    fetch('/send.php', { method:'POST', body:fd, keepalive:true, headers:{ 'Accept':'application/json' } })
      .then(function(r){ return r.ok ? r.json() : { ok:false }; })
      .then(function(j){
        if(j && j.ok){
          form.classList.add('done'); form.reset();
          label.textContent = 'Subscribed';
          say("You're on the list. Fresh stock updates will land in your inbox.", 'ok');
        } else { throw 0; }
      })
      .catch(function(){
        btn.disabled = false; label.textContent = 'Subscribe';
        say("Couldn't sign you up right now. Please try again or email info@finebitesllc.com.", 'err');
      });
  });
})();
