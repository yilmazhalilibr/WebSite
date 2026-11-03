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
  /* Crosshair click animation. The cursor itself is native CSS (zero latency); on each mouse press a
     short-lived element spreads four ticks, a ring and a hit marker at the pointer, then removes itself. */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      var s = document.createElement('div');
      s.className = 'shot';
      s.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      s.innerHTML = '<i class="t"></i><i class="r"></i><i class="b"></i><i class="l"></i><u class="ring"></u><u class="hm"></u>';
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 480);
    }, { passive: true });
  }
})();
