/* i18n (10 languages, picked before first paint), hero media, scroll and pointer effects, mobile tab bar,
   contact composer. No dependencies. */
(function () {
  'use strict';

  var EMAIL = 'yilmazhalilibr@gmail.com';
  var LANGS = ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'tr'];
  var HTML_KEYS = { hero_bio: true };
  var EN_UI = { vid_pause: 'Pause video', vid_play: 'Play video', copy_btn: 'Copy address', f_err: 'Please write a message first.',
    f_note: 'Your email app opens with the message prepared. Nothing is stored on this site.' };

  var root = document.documentElement;
  var nodes = document.querySelectorAll('[data-i18n]');
  var enCache = [];
  for (var i = 0; i < nodes.length; i++) enCache.push(nodes[i].innerHTML);

  var titleEl = document.querySelector('title');
  var descEl = document.querySelector('meta[name="description"]');
  var enTitle = titleEl.textContent;
  var enDesc = descEl.getAttribute('content');
  var select = document.getElementById('lang-select');
  var dict = null; // null = English (HTML source)

  function t(key) {
    var v = dict ? dict[key] : undefined;
    return v !== undefined ? v : EN_UI[key];
  }

  function apply(lang, d) {
    dict = d;
    root.lang = lang;
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (!d) { nodes[i].innerHTML = enCache[i]; continue; }
      if (d[key] === undefined) continue;
      if (HTML_KEYS[key]) nodes[i].innerHTML = d[key];
      else nodes[i].textContent = d[key];
    }
    titleEl.textContent = d ? d.title : enTitle;
    descEl.setAttribute('content', d ? d.desc : enDesc);
    select.value = lang;
    if (toggleVideoLabel) toggleVideoLabel();
    root.classList.remove('i18n-wait');
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) < 0 || lang === 'en') return apply('en', null);
    if (window.I18N && window.I18N[lang]) return apply(lang, window.I18N[lang]);
    var s = document.createElement('script');
    s.src = 'lang/' + lang + '.js';
    s.onload = function () { if (select.value === lang) apply(lang, window.I18N[lang]); };
    s.onerror = function () { apply('en', null); };
    document.head.appendChild(s);
  }

  select.addEventListener('change', function () {
    setLang(select.value);
    try { localStorage.setItem('lang', select.value); } catch (e) { /* file:// or private mode */ }
  });

  /* Initial language was resolved in <head> (window.__lang) and its dictionary is already loaded. */
  var initial = window.__lang || 'en';
  select.value = initial;
  if (initial !== 'en') setLang(initial); else root.classList.remove('i18n-wait');

  /* Hero background: shuffled mix of trailers (video) and screenshots (stills, slow zoom), crossfaded.
     Runs only on wide screens without reduced-motion / data-saver; user-pausable; paused while
     off-screen. Otherwise the static poster frame is shown. */
  var video = document.getElementById('hero-video');
  var vidBtn = document.getElementById('vid-toggle');
  var stills = document.querySelectorAll('.bg-still');
  var toggleVideoLabel = null;
  var conn = navigator.connection;
  if (video && vidBtn && stills.length === 2 &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      matchMedia('(min-width: 721px)').matches &&
      !(conn && conn.saveData)) {
    var STILL_MS = 6000;
    /* Order: both trailers first, then shuffled screenshots, then the cycle repeats with the trailers. */
    /* Pick quality by physical pixels: 1080p trailers and 4K (AI upscaled) stills on large or HiDPI screens. */
    var px = Math.max(screen.width, window.innerWidth) * (window.devicePixelRatio || 1);
    var vq = px >= 1900 ? 'hd' : 'sd', sq = px >= 2300 ? '4k/' : '';
    var list = [{ v: 'assets/sb2-trailer-' + vq + '.mp4' }, { v: 'assets/ims-trailer-' + vq + '.mp4' }];
    var shots = [
      'spacebourne2-1', 'spacebourne2-2', 'spacebourne2-3', 'ims-1', 'ims-2', 'ims-3', 'ims-4', 'ims-5'
    ];
    for (var s = shots.length - 1; s > 0; s--) { // Fisher-Yates shuffle
      var r = Math.floor(Math.random() * (s + 1)), tmp = shots[s]; shots[s] = shots[r]; shots[r] = tmp;
    }
    shots.forEach(function (n) { list.push({ i: 'assets/projects/' + sq + n + '.jpg' }); });
    var layers = [stills[0], stills[1], video];
    var pos = -1, timer = 0, userPaused = false, hidden = false, fails = 0, curIsVideo = false;

    var show = function (el) { layers.forEach(function (l) { l.classList.toggle('on', l === el); }); };
    var next = function () {
      clearTimeout(timer);
      var item = list[++pos % list.length];
      curIsVideo = !!item.v;
      if (item.v) {
        video.src = item.v;
        video.play().catch(function () {});
      } else {
        var el = stills[0].classList.contains('on') ? stills[1] : stills[0];
        el.onload = function () {
          el.onload = null; fails = 0;
          el.classList.remove('kb'); void el.offsetWidth; el.classList.add('kb');
          show(el);
          clearTimeout(timer);
          if (!userPaused && !hidden) timer = setTimeout(next, STILL_MS);
        };
        el.onerror = function () { if (++fails < list.length) next(); };
        el.src = item.i;
      }
    };
    video.addEventListener('playing', function () { fails = 0; show(video); toggleVideoLabel(); });
    video.addEventListener('ended', next);
    video.addEventListener('error', function () { if (video.getAttribute('src') && ++fails < list.length) next(); });

    var pauseAll = function () { clearTimeout(timer); if (curIsVideo) video.pause(); };
    var resumeAll = function () {
      if (curIsVideo) video.play().catch(function () {});
      else { clearTimeout(timer); timer = setTimeout(next, STILL_MS); }
    };
    toggleVideoLabel = function () { vidBtn.textContent = userPaused ? t('vid_play') : t('vid_pause'); };

    vidBtn.hidden = false;
    toggleVideoLabel();
    vidBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      if (userPaused) pauseAll(); else if (!hidden) resumeAll();
      toggleVideoLabel();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        hidden = !es[0].isIntersecting;
        if (hidden) pauseAll(); else if (!userPaused) resumeAll();
      }).observe(document.querySelector('.hero-bg'));
    }
    next();
  }

  /* Scroll progress bar */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    bar.style.transform = 'scaleX(' + (root.scrollTop / ((root.scrollHeight - root.clientHeight) || 1)) + ')';
  }, { passive: true });

  /* Motion & pointer effects: hero parallax, custom cursor, cursor spotlight, magnetic buttons, card tilt.
     All off for reduced-motion; cursor/tilt only for fine pointers (mouse). */
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm) {
    var heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', function () {
      if (root.scrollTop < 1400) heroBg.style.transform = 'translate3d(0,' + (root.scrollTop * 0.3).toFixed(1) + 'px,0)';
    }, { passive: true });

    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      root.classList.add('has-cursor');
      var mk = function (c) { var d = document.createElement('div'); d.className = c; document.body.appendChild(d); return d; };
      var dot = mk('cursor-dot out'), ring = mk('cursor-ring out');
      var spot = mk('spot');
      var mx = 0, my = 0, rx = 0, ry = 0, seen = false, raf = 0;
      var loop = function () { // runs only while the ring is still catching up to the pointer
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
        spot.style.setProperty('--mx', rx.toFixed(0) + 'px'); // on the spot element only: no document-wide restyle
        spot.style.setProperty('--my', ry.toFixed(0) + 'px');
        raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
      };
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!seen) { seen = true; rx = mx; ry = my; dot.classList.remove('out'); ring.classList.remove('out'); }
        dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
        if (!raf) raf = requestAnimationFrame(loop);
      });
      document.addEventListener('mouseover', function (e) {
        ring.classList.toggle('big', !!e.target.closest('a, button, select, label, .snapshot'));
      });
      document.addEventListener('mousedown', function () { ring.classList.add('down'); });
      document.addEventListener('mouseup', function () { ring.classList.remove('down'); });
      document.documentElement.addEventListener('mouseleave', function () { dot.classList.add('out'); ring.classList.add('out'); });
      document.documentElement.addEventListener('mouseenter', function () { dot.classList.remove('out'); ring.classList.remove('out'); });

      document.querySelectorAll('.btn').forEach(function (b) { // magnetic buttons
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' +
            ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
      });

      var snap = document.querySelector('.snapshot'); // subtle 3D tilt
      if (snap) {
        snap.addEventListener('mousemove', function (e) {
          var r = snap.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          snap.style.transform = 'perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg)';
        });
        snap.addEventListener('mouseleave', function () { snap.style.transform = ''; });
      }
    }
  }

  if ('IntersectionObserver' in window) {
    /* Reveal-on-scroll (hidden state is CSS: .js .section .container > *) */
    var revealIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.section .container > *').forEach(function (el) { revealIO.observe(el); });

    /* Active nav link (desktop nav and mobile tab bar) */
    var links = {};
    document.querySelectorAll('.site-nav a, .tabbar a').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      (links[id] = links[id] || []).push(a);
    });
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) {
          links[k].forEach(function (a) { a.classList.toggle('active', k === e.target.id); });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { navIO.observe(s); });
  } else {
    root.classList.remove('js'); // no IO: never leave content hidden
  }

  /* Mobile tab bar: light haptic tick where supported */
  document.querySelectorAll('.tabbar a').forEach(function (a) {
    a.addEventListener('click', function () { if (navigator.vibrate) navigator.vibrate(8); });
  });

  /* Contact: copy address, and a composer that opens the visitor's own mail app or Gmail with the
     message prepared. Nothing is sent to or stored on this site. */
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var btn = this;
      var done = function () {
        btn.textContent = '✓';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = t('copy_btn'); btn.classList.remove('done'); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done);
      else window.prompt('', EMAIL);
    });
  }

  var form = document.getElementById('composer');
  if (form) {
    var fName = document.getElementById('f-name'), fSub = document.getElementById('f-subject'), fMsg = document.getElementById('f-msg');
    var note = document.getElementById('f-note');
    var build = function () {
      var msg = fMsg.value.trim();
      if (!msg) { note.textContent = t('f_err'); note.classList.add('err'); fMsg.focus(); return null; }
      note.classList.remove('err');
      var name = fName.value.trim();
      return {
        subject: fSub.value.trim() || 'Hello Halil',
        body: msg + (name ? '\n\n' + name : '')
      };
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = build();
      if (m) location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
    });
    document.getElementById('f-gmail').addEventListener('click', function () {
      var m = build();
      if (m) window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) +
        '&su=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body), '_blank', 'noopener');
    });
    fMsg.addEventListener('input', function () { note.classList.remove('err'); note.textContent = t('f_note'); });
  }
})();
