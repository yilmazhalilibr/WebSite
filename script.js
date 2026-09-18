/* EN/TR language toggle + email copy. No dependencies. */
(function () {
  'use strict';

  var EMAIL = 'yilmazhalilibr@gmail.com';

  var TR = {
    title: 'Halil İbrahim Yılmaz — Gameplay Programcısı',
    desc: 'Unreal Engine ve C++ odaklı gameplay programcısı. SpaceBourne 2 üzerinde çalıştım — gameplay sistemleri, multiplayer networking ve performans kritik oyun kodu.',

    nav_work: 'Çalışmalar',
    nav_projects: 'İncelemeler',
    nav_experience: 'Deneyim',
    nav_about: 'Hakkımda',
    nav_contact: 'İletişim',

    hero_role: 'Gameplay / Sistem Programcısı',
    hero_tech: 'Unreal Engine · C++ · Multiplayer',
    hero_bio: '<strong>SpaceBourne 2</strong> üzerinde çalıştım. Gameplay sistemleri, multiplayer mimarisi ve performans kritik oyun kodu geliştiriyorum.',
    cta_work: 'Çalışmaları Gör',
    cta_resume: 'Özgeçmiş',

    sec_work: 'Öne Çıkan İşler',
    sb2_meta: 'Gameplay / Sistem Programlama · DBK Games · 2023–2025',
    sb2_engine_l: 'Motor',
    sb2_released_l: 'Çıkış',
    sb2_released_v: 'Kas 2025 · Steam',
    sb2_link: "Steam'de Gör",
    sb2_contrib_head: 'Katkım',
    sb2_c1: 'SpaceBourne 2 için gameplay sistemleri geliştirdim (Steam, Mostly Positive)',
    sb2_c2: 'Temel mekanikler: combat, envanter, UI ve multiplayer networking',
    sb2_c3: "SpaceBourne 3'e aktif katkı (geliştirme aşamasında)",

    also_head: "Steam'de ayrıca",
    ims_meta: 'Velovis Games Studio · Geliştirmede · Co-op tamirci simülasyonu',
    mvsm_meta: 'Mania Interactive · Geliştirmede · 1–8 oyuncu için çizgi film tarzı co-op PvE',
    tts_meta: 'Mania Interactive · Geliştirmede · Absürt tuvalet işletme simülasyonu',

    sec_cases: 'Teknik İncelemeler',
    cases_intro: "Geliştirdiğim sistemlerden bir seçki — çoğunlukla Unreal Engine'de gameplay, networking ve araçlar.",
    case_cat_1: 'Multiplayer MOBA prototipi',
    case_d1: 'Unreal Engine 5.6 üzerinde multiplayer MOBA prototipi. GAS tabanlı yetenekler, oyun içi mağaza ve envanter sistemleri, AWS üzerinde çalışan dedicated server altyapısı.',
    case_cat_2: 'Aksiyon roguelike prototipi',
    case_d2: 'Üçüncü şahıs aksiyon roguelike: yetenek tabanlı combat, prosedürel zorluk döngüleri ve veri odaklı ilerleme sistemi.',
    case_cat_3: 'İnşa sistemi',
    case_d3: "Fortnite'ın inşa mekaniklerinden ilham alan parça parça inşa sistemi: yerleştirme, düzenleme ve gerçek zamanlı yıkım.",
    case_cat_4: 'Temel sistem',
    case_d4: 'Unreal Engine için modüler envanter altyapısı: yığma, donatma, bırakma ve UI entegrasyonu — başka projelere taşınabilir şekilde.',
    more_label: "GitHub'da ayrıca:",
    more_1: 'Üretim Sistemi',
    more_2: 'Tasarım Desenleri C#',
    more_all: 'Tüm depolar',

    sec_xp: 'Deneyim',
    xp1_when: 'Tem 2026 — Devam',
    xp1_role: 'Unreal Engine Geliştirici',
    xp1_org: 'Velovis Games Studio',
    xp1_desc: "Illegal Mechanic Simulator üzerinde çalışıyorum — co-op tamirci simülasyonu, Steam'de yakında.",
    xp2_when: 'May 2025 — Devam',
    xp2_role: 'MMORPG Sunucu Geliştirici (Serbest)',
    xp2_org: 'M2 Private Server',
    xp2_desc: 'Metin2 private server: Lua ve C ile oyun sistemleri, içerik ve araçlar.',
    xp3_when: 'Haz 2025 — Eyl 2026',
    xp3_role: 'Unreal Engine Geliştirici',
    xp3_org: 'Mania Interactive — bağımsız stüdyo',
    xp3_desc: 'MvsM ve Terminal Toilet Simulator — ikisi de Steam\u2019de geliştirme aşamasında.',
    xp4_when: 'Kas 2023 — May 2025',
    xp4_role: 'Unreal Engine Geliştirici',
    xp4_org: 'DBK Games',
    xp4_desc: "SpaceBourne 2 (2025'te çıktı) ve SpaceBourne 3.",
    xp5_role: 'Unity Geliştirici',
    xp5_org: 'ELA Game Studio',
    xp5_desc: 'Stajdan tam zamana geçiş. Mobil oyun geliştirme, gameplay prototipleme ve UI.',
    xp6_when: '3 aylık proje',
    xp6_role: 'Geliştirici',
    xp6_org: 'ARC Savunma Yazılım',
    xp6_desc: 'Savunma uygulamaları için simülasyon ve görselleştirme araçları; üniversite mentorluğunda gerçek sistemler üzerinde çalışma.',
    xp_edu_when: 'Eğitim',
    xp_edu_role: 'Ege Üniversitesi — Bilgisayar Programcılığı',
    xp_edu_desc: 'Bölüm birincisi olarak mezun oldum.',

    sec_stack: 'Teknolojiler',
    stack_lang: 'Diller',
    stack_engine: 'Motor',
    stack_gameplay: 'Gameplay',
    stack_net: 'Networking',
    stack_mmo: 'MMO Sunucu',
    stack_db: 'Veritabanları',
    stack_backend: 'Backend',
    stack_infra: 'Altyapı',
    stack_tools: 'Araçlar',

    sec_about: 'Hakkımda',
    about_p1: 'İzmir\u2019de yaşayan bir gameplay programcısıyım. Ağırlıklı olarak Unreal Engine ve C++ ile çalışıyorum — gameplay sistemleri, multiplayer networking ve performans kritik oyun kodu.',
    about_p2: '2022\u2019den beri oyun sektöründeyim: önce Unity mobil projeleri, ardından ticari Unreal Engine oyunları. Ege Üniversitesi Bilgisayar Programcılığı bölümünden bölüm birincisi olarak mezun oldum.',
    about_p3: 'Stüdyo işlerinin yanında bir Metin2 private server projesi yürütüyorum (Lua / C) ve GitHub\u2019da açık kaynak Unreal Engine sistemleri geliştiriyorum.',

    sec_contact: 'İletişim',
    contact_intro: 'Gameplay programcılığı / Unreal Engine fırsatlarına açığım.',
    contact_email: 'E-posta',
    copy_btn: 'Kopyala',
    contact_resume: 'Özgeçmiş',
    resume_val: 'PDF · İndir'
  };

  var HTML_KEYS = { hero_bio: true };

  var nodes = document.querySelectorAll('[data-i18n]');
  var enCache = [];
  for (var i = 0; i < nodes.length; i++) enCache.push(nodes[i].innerHTML);

  var titleEl = document.querySelector('title');
  var descEl = document.querySelector('meta[name="description"]');
  var enTitle = titleEl ? titleEl.textContent : '';
  var enDesc = descEl ? descEl.getAttribute('content') : '';

  function applyLang(lang) {
    var isTr = lang === 'tr';
    document.documentElement.lang = lang;

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!isTr) { el.innerHTML = enCache[i]; continue; }
      var key = el.getAttribute('data-i18n');
      if (TR[key] === undefined) continue;
      if (HTML_KEYS[key]) el.innerHTML = TR[key];
      else el.textContent = TR[key];
    }

    if (titleEl) titleEl.textContent = isTr ? TR.title : enTitle;
    if (descEl) descEl.setAttribute('content', isTr ? TR.desc : enDesc);

    var buttons = document.querySelectorAll('[data-lang]');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.toggle('active', buttons[j].getAttribute('data-lang') === lang);
    }

    try { localStorage.setItem('lang', lang); } catch (e) { /* file:// or private mode */ }
  }

  var langButtons = document.querySelectorAll('[data-lang]');
  for (var b = 0; b < langButtons.length; b++) {
    langButtons[b].addEventListener('click', function () {
      applyLang(this.getAttribute('data-lang'));
    });
  }

  var saved = 'en';
  try { saved = localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore */ }
  if (saved === 'tr') applyLang('tr');

  /* Email copy */
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      var btn = this;
      navigator.clipboard.writeText(EMAIL).then(function () {
        var isTr = document.documentElement.lang === 'tr';
        btn.textContent = isTr ? 'Kopyalandı' : 'Copied';
        btn.classList.add('done');
        setTimeout(function () {
          btn.textContent = isTr ? 'Kopyala' : 'Copy';
          btn.classList.remove('done');
        }, 1600);
      });
    });
  }
})();
