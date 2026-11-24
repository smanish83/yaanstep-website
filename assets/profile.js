/* Yaanstep learning pages: the child's age, a drawn avatar that grows with the age, and the points (SCRUM-487).
   Kept only in this browser, under one key ("ys-profile"): the age in years, a color number and an optional nickname.
   Nothing is saved until a grown-up picks an age. Nothing is sent. No photos: the avatar is drawn here.
   Pages mark items that fit an age range with data-ages="3-7"; once an age is picked, items that do not fit are hidden,
   and "Show everything" brings them back for this visit. */
(function () {
  'use strict';

  var KEY = 'ys-profile';
  var AGES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var COLORS = [
    { name: 'Teal', c: '#1F7A6D' },
    { name: 'Blue', c: '#2F6FBF' },
    { name: 'Purple', c: '#6D28D9' },
    { name: 'Orange', c: '#C2410C' },
    { name: 'Green', c: '#3F7D20' },
    { name: 'Pink', c: '#BE185D' }
  ];
  var STAGES = ['seed', 'sprout', 'small plant', 'plant with a bud', 'plant in flower'];

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- storage: one key, this browser only ---------- */

  function raw() { try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function load() {
    var p = raw();
    if (!p || AGES.indexOf(+p.age) < 0) return null;
    return { age: +p.age, color: COLORS[+p.color] ? +p.color : 0, nick: cleanNick(p.nick || ''), comfort: cleanComfort(p.comfort) };
  }
  /* Comfort settings can be kept without an age: { comfort: [...] } in the same key. Nothing else is asked for. */
  function comfortList() { var p = raw(); return p ? cleanComfort(p.comfort) : []; }
  function comfortOn(id) { return comfortList().indexOf(id) > -1; }
  function save(p) { try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* private mode: works for this visit */ } }
  function forget() { try { window.localStorage.removeItem(KEY); } catch (e) { /* nothing */ } }
  /* Comfort settings (SCRUM-498): chosen by need, never by a diagnosis. Kept inside the same profile key. */
  var COMFORT = [
    { id: 'easy', name: 'Easy reading', hint: 'Bigger text with more space between letters, words and lines, on a cream background.' },
    { id: 'calm', name: 'Calm mode', hint: 'No moving pictures, bouncing, extra sounds or countdowns. Lessons show their last picture straight away.' },
    { id: 'big', name: 'Bigger buttons', hint: 'Buttons and answer tiles at least 64 pixels, with more space between them.' },
    { id: 'contrast', name: 'Strong contrast', hint: 'Black text on white, thick dark edges on buttons, and underlined links.' },
    { id: 'rest', name: 'Break reminders', hint: 'After 10 minutes of play, a short break to stretch and look far away.' },
    { id: 'fewer', name: 'Fewer choices', hint: 'Two answers to pick from instead of three or more, in most games. One of them is always right.' },
    { id: 'read', name: 'Read questions aloud', hint: 'Each new question is spoken once with this device\'s own voice, and a Hear it button says it again.' },
    { id: 'quiet', name: 'Quiet rewards', hint: 'No moving celebrations. A right answer gets a plain tick and words.' },
    { id: 'font', name: 'Easy-reading font', hint: 'Plain, wide letters (Verdana or a similar font already on this device).' }
  ];
  function cleanComfort(list) {
    return (Array.isArray(list) ? list : []).filter(function (c, i, all) {
      return all.indexOf(c) === i && COMFORT.some(function (x) { return x.id === c; });
    });
  }
  function applyComfort() {
    var on = comfortList(), root = document.documentElement;
    COMFORT.forEach(function (c) { root.classList.toggle('ys-' + c.id, on.indexOf(c.id) > -1); });
    if (on.indexOf('calm') > -1) quietMedia();
    reader.set(on.indexOf('read') > -1);
  }
  /** Keeps only what is right and one wrong choice: never drops a right answer. right: one value or a list. */
  function fewer(list, right) {
    if (!comfortOn('fewer') || !list || list.length <= 2 || right == null) return list;
    var good = [].concat(right).map(String), wrongKept = false;
    if (!list.some(function (o) { return good.indexOf(String(o)) > -1; })) return list;
    return list.filter(function (o) {
      if (good.indexOf(String(o)) > -1) return true;
      if (wrongKept) return false;
      wrongKept = true;
      return true;
    });
  }

  /* ---------- calm mode: no sound but speech ----------
     The games make no sound of their own today; this keeps it so if a page ever plays audio or video. */
  function quietMedia() {
    Array.prototype.forEach.call(document.querySelectorAll('audio,video'), function (m) { try { m.pause(); m.muted = true; } catch (e) { /* nothing */ } });
  }
  try {
    var mediaPlay = window.HTMLMediaElement && HTMLMediaElement.prototype.play;
    if (mediaPlay) HTMLMediaElement.prototype.play = function () { if (comfortOn('calm')) { this.muted = true; return Promise.resolve(); } return mediaPlay.apply(this, arguments); };
  } catch (e) { /* no media */ }

  /* ---------- read questions aloud ----------
     Speaks each new question once, with an on-device voice only, on pages that do not already speak it themselves,
     and adds a "Hear it" button where the page has none. */
  var reader = (function () {
    var on = false, obs = null, lastCount = null, lastText = '', since = 0, pageSpoke = 0, ours = false, timer = 0, wrapped = false;
    var SAY = ['#say:not(button)', '#q', '#stepline', '#player-say', '#prompt'];
    function shown(n) { return !!(n && n.getClientRects().length && !n.closest('[hidden]')); }
    function voice() {
      try {
        var local = window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
        var wanted = null;
        try { wanted = window.localStorage.getItem('voice-name'); } catch (e) { /* nothing */ }
        return local.filter(function (v) { return v.name === wanted; })[0] || local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
      } catch (e) { return null; }
    }
    function speak(text) {
      var v = voice();
      if (!v || !text) return;
      var rate = 0.9;
      try { var r = parseFloat(window.localStorage.getItem('rd-speed')); if (r >= 0.5 && r <= 1.5) rate = r; } catch (e) { /* default */ }
      try {
        ours = true;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.voice = v; u.lang = v.lang; u.rate = rate;
        window.speechSynthesis.speak(u);
      } catch (e) { /* silent */ }
      ours = false;
    }
    function watchSpeech() {
      if (wrapped) return;
      wrapped = true;
      try {
        var ss = window.speechSynthesis, orig = ss.speak;
        ss.speak = function () { if (!ours) pageSpoke = Date.now(); return orig.apply(ss, arguments); };
      } catch (e) { /* no speech */ }
    }
    function anchor() {
      for (var i = 0; i < SAY.length; i++) { var n = document.querySelector('main ' + SAY[i]); if (shown(n) && n.textContent.trim()) return n; }
      return null;
    }
    function question() {
      var parts = [];
      SAY.forEach(function (s) { var n = document.querySelector('main ' + s); if (shown(n) && n.textContent.trim()) parts.push(n.textContent.trim()); });
      var ask = Array.prototype.filter.call(document.querySelectorAll('main .ask'), function (n) {
        return shown(n) && n.id !== 'right' && n.id !== 'answer' && n.id !== 'prompt' && n.tagName !== 'H2' && n.textContent.trim();
      })[0];
      if (ask && parts.indexOf(ask.textContent.trim()) < 0) parts.push(ask.textContent.trim());
      return { text: parts.join(' '), at: anchor() || ask || null };
    }
    function counter() {
      var c = ['#count', '#player-progress', '#prog'].map(function (s) { return document.querySelector('main ' + s); }).filter(shown)[0];
      return c ? c.textContent.trim() : '';
    }
    function hearButton(q) {
      var mine = $('ys-hear');
      var own = Array.prototype.some.call(document.querySelectorAll('main button'), function (b) { return b.id !== 'ys-hear' && shown(b) && /\bhear\b/i.test(b.textContent); });
      if (own || !q.at || !voice()) { if (mine) mine.remove(); return; }
      if (mine && mine.previousElementSibling === q.at) return;
      if (!mine) {
        mine = el('button', { type: 'button', id: 'ys-hear', 'class': 'ys-hear' });
        mine.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg><span>Hear it</span>';
        mine.addEventListener('click', function () { speak(question().text); });
      }
      q.at.parentNode.insertBefore(mine, q.at.nextSibling);
    }
    function look() {
      timer = 0;
      if (!on) return;
      var q = question();
      hearButton(q);
      if (!q.text) return;
      var count = counter(), text = q.text, same = count === lastCount;
      // A right answer takes the question away and leaves the words above it: nothing new to say.
      if (same && lastText.indexOf(text) > -1) return;
      var fresh = same && text.indexOf(lastText) === 0 ? text.slice(lastText.length).trim() : text;
      lastCount = count; lastText = text;
      // The page said it already (the learn pages, reading and first learning do): do not say it twice.
      if (pageSpoke >= since - 150) return;
      speak(fresh);
    }
    function changed(list) {
      if (list && list.every(function (m) { return m.target.id === 'ys-hear' || (m.target.closest && m.target.closest('#ys-hear')) || Array.prototype.every.call(m.addedNodes, function (n) { return n.id === 'ys-hear'; }) && m.type === 'childList' && !m.removedNodes.length; })) return;
      if (!timer) { since = Date.now(); timer = setTimeout(look, 250); }
    }
    return {
      set: function (want) {
        if (want === on) return;
        on = want;
        if (on) {
          watchSpeech();
          obs = new MutationObserver(changed);
          obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
          lastCount = null; lastText = '';
          changed();
        } else {
          if (obs) obs.disconnect();
          obs = null;
          var b = $('ys-hear'); if (b) b.remove();
        }
      },
      speak: speak
    };
  })();
  function cleanNick(s) { return String(s).replace(/[^A-Za-z '\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12); }
  /* Game progress: points, garden, stars and finished chapters. Settings, the profile and the theme are kept. */
  var PROGRESS_KEYS = ['demo-ch', 'demo-garden'];
  function wipeProgress() {
    try {
      var ls = window.localStorage, gone = [];
      for (var i = 0; i < ls.length; i++) {
        var k = ls.key(i);
        if (k && (k.indexOf('sprouts:') === 0 || PROGRESS_KEYS.indexOf(k) > -1)) gone.push(k);
      }
      gone.forEach(function (k) { ls.removeItem(k); });
    } catch (e) { /* nothing stored */ }
  }
  /* ---------- points: one store for every game, split by subject ----------
     Each game calls YSPoints.add(area, n) when a question is answered right. Kept under "sprouts:points"
     as { maths, english, world }, so "Delete progress" wipes it with the other "sprouts:" keys.
     The maths bundle (maths.html) keeps its own points in "sprouts:demo"; they count as maths. */
  var PTS_KEY = 'sprouts:points';
  var AREAS = ['maths', 'english', 'world'];
  function whole(n) { return n > 0 ? Math.floor(n) : 0; }
  function mathsBundle() {
    try { var s = JSON.parse(window.localStorage.getItem('sprouts:demo') || 'null'); return s ? whole(s.points) : 0; } catch (e) { return 0; }
  }
  function ownPoints() {
    var s = null, o = {};
    try { s = JSON.parse(window.localStorage.getItem(PTS_KEY) || 'null'); } catch (e) { s = null; }
    AREAS.forEach(function (a) { o[a] = s && typeof s === 'object' ? whole(+s[a]) : 0; });
    return o;
  }
  function totals() {
    var o = ownPoints();
    o.maths += mathsBundle();
    o.total = o.maths + o.english + o.world;
    return o;
  }
  function ptsWord(n) { return n + (n === 1 ? ' point' : ' points'); }
  /** What the eyes see under the total: "Maths 3 · English 2", and "· World 1" only when there are world points. */
  function splitText(t) { return 'Maths ' + t.maths + ' \u00b7 English ' + t.english + (t.world > 0 ? ' \u00b7 World ' + t.world : ''); }
  /** What a screen reader hears: "5 points: 3 maths, 2 English, 0 world". */
  function splitWords(t) { return ptsWord(t.total) + ': ' + t.maths + ' maths, ' + t.english + ' English, ' + t.world + ' world'; }
  /** Adds n points (1 by default) to a subject. Does nothing without a child profile: nothing is stored then. */
  function addPoints(area, n) {
    if (!load()) return false;
    if (AREAS.indexOf(area) < 0) area = 'world';
    n = n == null ? 1 : Math.floor(+n);
    if (!(n > 0)) return false;
    var o = ownPoints();
    o[area] += n;
    try { window.localStorage.setItem(PTS_KEY, JSON.stringify(o)); } catch (e) { return false; }
    showPoints();
    return true;
  }
  /** Writes the points into the badge, if it is on the page. */
  function showPoints() {
    var n = $('ys-pts'); if (!n) return;
    var t = totals(), want = [ptsWord(t.total), splitText(t), splitWords(t) + '.'];
    [n, $('ys-split'), $('ys-pts-sr')].forEach(function (node, i) { if (node && node.textContent !== want[i]) node.textContent = want[i]; });
  }

  /* ---------- the avatar: drawn from the age ---------- */

  function stage(age) { return age <= 4 ? 0 : age <= 6 ? 1 : age <= 8 ? 2 : age <= 10 ? 3 : 4; }
  function leaf(x, y, flip) {
    var r = flip ? -35 : 35;
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="3.6" fill="#3BA55C" transform="rotate(' + r + ' ' + x + ' ' + y + ')"/>';
  }
  function face(cx, cy) {
    return '<circle cx="' + (cx - 6) + '" cy="' + cy + '" r="3" fill="#fff"/><circle cx="' + (cx + 6) + '" cy="' + cy + '" r="3" fill="#fff"/>' +
      '<circle cx="' + (cx - 6) + '" cy="' + (cy + .6) + '" r="1.5" fill="#17312D"/><circle cx="' + (cx + 6) + '" cy="' + (cy + .6) + '" r="1.5" fill="#17312D"/>' +
      '<path d="M' + (cx - 5) + ' ' + (cy + 6) + ' Q' + cx + ' ' + (cy + 10) + ' ' + (cx + 5) + ' ' + (cy + 6) + '" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }
  /** Returns the avatar as an SVG string. The picture grows with the age: a seed, a sprout, a small plant, a bud, a flower. */
  function avatar(age, color) {
    var c = (COLORS[color] || COLORS[0]).c, s = stage(age), g = '';
    if (s === 0) {
      g = '<path d="M32 26 C32 20 34 17 37 15" stroke="#3BA55C" stroke-width="3" fill="none" stroke-linecap="round"/>' + leaf(38, 15, false) +
        '<ellipse cx="32" cy="42" rx="18" ry="16" fill="' + c + '"/>' + face(32, 40);
    } else {
      var top = [0, 30, 22, 14, 12][s];
      g = '<rect x="30.5" y="' + top + '" width="3" height="' + (38 - top) + '" rx="1.5" fill="#2E8B4E"/>';
      g += leaf(25, 32, true) + leaf(39, 32, false);
      if (s >= 2) g += leaf(25, 24, true) + leaf(39, 24, false);
      if (s >= 3) g += leaf(25, 17, true) + leaf(39, 17, false);
      if (s === 3) g += '<ellipse cx="32" cy="' + (top - 1) + '" rx="4" ry="5.5" fill="#E8A33D"/>';
      if (s === 4) {
        for (var i = 0; i < 6; i++) {
          var a = i * Math.PI / 3, x = (32 + Math.cos(a) * 6).toFixed(1), y = (top - 2 + Math.sin(a) * 6).toFixed(1);
          g += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#F4B6C2"/>';
        }
        g += '<circle cx="32" cy="' + (top - 2) + '" r="3.5" fill="#E8A33D"/>';
      }
      g += '<path d="M14 38 H50 L46 60 H18 Z" fill="' + c + '"/><rect x="12" y="36" width="40" height="6" rx="2" fill="' + c + '"/>' + face(32, 48);
    }
    return '<svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true" focusable="false" data-stage="' + STAGES[s] + '">' + g + '</svg>';
  }

  /* ---------- styles (fixed colors, so they read well on every page and theme) ---------- */

  var CSS = '' +
    '.ys-hidden{display:none!important}' +
    '.ys-badge{position:fixed;right:10px;bottom:10px;z-index:40;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:76px;min-height:48px;padding:6px 8px;' +
    'background:#fff;color:#17312D;border:2px solid #17312D;border-radius:16px;font:600 14px/1.2 system-ui,Segoe UI,Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18)}' +
    '.ys-badge:focus-visible,.ys-dlg button:focus-visible,.ys-dlg input:focus-visible,.ys-ask button:focus-visible,.ys-filter button:focus-visible{outline:4px solid #f0a500;outline-offset:2px}' +
    '.ys-badge svg{width:48px;height:48px}.ys-nick{max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.ys-split{font-size:11px;font-weight:500;max-width:140px;text-align:center;line-height:1.25}' +
    'body.ys-has-badge{padding-bottom:150px}' +
    '.ys-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}' +
    '.ys-ask{background:#fff;color:#17312D;border:3px solid #1F7A6D;border-radius:16px;padding:16px;margin:16px 0}' +
    '.ys-ask h2{margin:0 0 6px;font-size:1.25rem;color:#17312D}.ys-ask p{margin:0 0 10px}' +
    '.ys-ages{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:8px;margin:8px 0 12px}' +
    '.ys-ask button,.ys-dlg button,.ys-filter button{font:inherit;font-weight:600;min-height:48px;min-width:48px;border-radius:12px;border:2px solid #1F7A6D;background:#fff;color:#17312D;padding:6px 12px;cursor:pointer}' +
    '.ys-ages button{font-size:1.2rem}.ys-ask .ys-plain,.ys-dlg .ys-plain{border-color:#7a8c86}' +
    '.ys-ask button[aria-pressed="true"],.ys-dlg button[aria-pressed="true"],.ys-dlg .ys-save{background:#1F7A6D;color:#fff}' +
    '.ys-filter{background:#E8F4F0;color:#17312D;border-radius:12px;padding:8px 12px;margin:8px 0;display:flex;flex-wrap:wrap;align-items:center;gap:8px}' +
    '.ys-dlg{box-sizing:border-box;max-width:min(440px,calc(100vw - 24px));width:100%;border:3px solid #1F7A6D;border-radius:18px;padding:16px;background:#fff;color:#17312D;font:16px/1.4 system-ui,Segoe UI,Arial,sans-serif;max-height:calc(100vh - 24px);overflow:auto}' +
    '.ys-dlg::backdrop{background:rgba(0,0,0,.45)}.ys-dlg h2{margin:0 0 8px;font-size:1.2rem}.ys-dlg fieldset{border:0;padding:0;margin:0 0 12px}.ys-dlg legend{font-weight:600;margin-bottom:6px;padding:0}' +
    '.ys-preview{display:flex;align-items:center;gap:10px;margin:0 0 10px}.ys-preview svg{width:64px;height:64px}' +
    '.ys-colors{display:flex;flex-wrap:wrap;gap:8px}.ys-colors button{width:48px;padding:0;display:flex;align-items:center;justify-content:center}.ys-colors span{width:28px;height:28px;border-radius:50%;display:block}' +
    '.ys-dlg label{display:block;font-weight:600;margin-bottom:4px}.ys-dlg input{box-sizing:border-box;font:inherit;width:100%;min-height:48px;padding:6px 10px;border:2px solid #5d716a;border-radius:10px;color:#17312D;background:#fff}' +
    '.ys-progress{border-top:1px solid #c8d6d1;margin-top:14px;padding-top:6px}.ys-dlg .ys-danger{background:#a3271c;border-color:#a3271c;color:#fff}' +
    '.ys-hint{font-size:.85rem;color:#3f554d;margin:4px 0 12px}.ys-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}' +
    '.ys-comfort button{display:flex;flex-direction:column;align-items:flex-start;text-align:left;width:100%;margin:0 0 8px}.ys-comfort small{font-weight:400;font-size:.85rem}' +
    '.ys-comfort button[aria-pressed="true"] small{color:#fff}' +
    /* Easy reading: British Dyslexia Association style guide values. */
    'html.ys-easy{--bg:#FBF5E6;--card:#FFFDF7}html.ys-easy body{background:#FBF5E6!important}' +
    'html.ys-easy main{font-size:1.12em;letter-spacing:.05em;word-spacing:.16em;line-height:1.6;text-align:left}' +
    'html.ys-easy main *{font-style:normal!important;text-transform:none!important}' +
    'html.ys-easy main .card,html.ys-easy main .lesson-cards li{background:#FFFDF7}' +
    /* Calm mode: nothing moves. */
    'html.ys-calm *,html.ys-calm *::before,html.ys-calm *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' +
    /* Bigger buttons: 64px targets, 12px gaps. */
    'html.ys-big main button,html.ys-big main a.btn,html.ys-big main [role=button]{min-height:64px;min-width:64px;font-size:1.08em}' +
    'html.ys-big main .row,html.ys-big main .num-row,html.ys-big main .hunt-grid,html.ys-big main .tiles,html.ys-big main .words,html.ys-big main .ys-row{gap:12px}' +
    /* Strong contrast: black on white, dark edges, underlined links, thick focus ring. */
    'html.ys-contrast body{background:#fff!important;color:#000}' +
    'html.ys-contrast main :is(p,li,h1,h2,h3,h4,label,legend,small,summary,figcaption,dt,dd,td,th,.meta,.hint,.note,.notice):not(button *,a.btn *,[role=button] *){color:#000!important}' +
    'html.ys-contrast main :is(.card,.notice,.note,.lesson-cards li,section){border-color:#000!important}' +
    'html.ys-contrast main :is(button,a.btn,[role=button],input,select){border:3px solid #000!important}' +
    'html.ys-contrast a{text-decoration:underline!important}' +
    'html.ys-contrast :focus-visible{outline:4px solid #000!important;outline-offset:3px!important}' +
    '.ys-rest p{margin:0 0 10px}.ys-rest .ys-big-ico{font-size:2.4rem;line-height:1;margin:0 0 6px}' +
    /* Fewer choices: two tiles sit side by side. */
    'html.ys-fewer main .tiles:has(> :nth-child(2):last-child){grid-template-columns:repeat(2,minmax(0,1fr))}' +
    /* Read questions aloud: the Hear it button the reader adds where a page has none. */
    '.ys-hear{display:inline-flex;align-items:center;gap:6px;font:inherit;font-weight:600;min-height:48px;min-width:48px;padding:6px 14px;margin:4px 0;border-radius:12px;border:2px solid #1F7A6D;background:#fff;color:#17312D;cursor:pointer}' +
    '.ys-hear:focus-visible{outline:4px solid #f0a500;outline-offset:2px}' +
    /* Quiet rewards: nothing moves when an answer is right; a plain tick and the words stay. */
    'html.ys-quiet main :is(.right,.good,.yes,.done,.tick,.garden,.stars),html.ys-quiet main :is(.right,.good,.yes,.done,.tick,.garden,.stars) *{animation:none!important;transition:none!important}' +
    'html.ys-quiet main .right::after{content:"\\2713";display:block;font-size:1.3rem;font-weight:800;line-height:1;color:#1b5e33}' +
    'html.ys-quiet main .yes::before{content:"\\2713  ";font-weight:800}' +
    /* Easy-reading font: fonts already on the device, nothing is downloaded. */
    'html.ys-font body,html.ys-font body *:not(svg):not(svg *){font-family:Verdana,Tahoma,"Trebuchet MS",sans-serif!important}';

  /* ---------- break reminders (SCRUM-498) ----------
     Counts time while a Sprouts page is open and visible, across pages in this visit (sessionStorage only).
     After 10 minutes, a calm break screen; the button to go back waits 20 seconds. */
  var REST_KEY = 'ys-rest-ms';
  function restMs() { return +window.YS_REST_MS || 600000; }
  function restWait() { return window.YS_REST_WAIT === undefined ? 20 : +window.YS_REST_WAIT; }
  function played(v) {
    try {
      if (v === undefined) return +window.sessionStorage.getItem(REST_KEY) || 0;
      window.sessionStorage.setItem(REST_KEY, String(v));
    } catch (e) { /* private mode */ }
    return v || 0;
  }
  var lastTick = Date.now();
  function restOn() { var p = load(); return !!(p && p.comfort.indexOf('rest') > -1); }
  function tickRest() {
    var now = Date.now(), dt = Math.min(now - lastTick, 5000);
    lastTick = now;
    if (!restOn() || document.hidden || $('ys-rest')) return;
    var t = played() + dt;
    if (t >= restMs()) { played(0); showRest(); } else played(t);
  }
  function showRest() {
    var d = el('dialog', { id: 'ys-rest', 'class': 'ys-dlg ys-rest', 'aria-labelledby': 'ys-rest-h' });
    d.innerHTML = '<p class="ys-big-ico" aria-hidden="true">&#127775;</p><h2 id="ys-rest-h">Time for a little break</h2>' +
      '<p>Stand up and stretch your arms up high. Look at something far away, like a window. Have a drink of water.</p>' +
      '<p class="ys-hint">A grown-up turned on break reminders in the profile.</p>';
    var go = el('button', { type: 'button', id: 'ys-rest-go' });
    d.appendChild(go);
    document.body.appendChild(d);
    var left = restWait();
    function draw() {
      go.disabled = left > 0;
      // Calm mode shows no countdown: the button just waits.
      go.textContent = left > 0 ? (comfortOn('calm') ? 'Back to play soon' : 'Back to play in ' + left) : 'Back to play';
    }
    draw();
    var iv = setInterval(function () { left--; draw(); if (left <= 0) { clearInterval(iv); go.focus(); } }, 1000);
    go.addEventListener('click', function () { clearInterval(iv); d.close(); d.remove(); lastTick = Date.now(); });
    d.addEventListener('cancel', function (e) { if (left > 0) e.preventDefault(); });
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    if (left <= 0) go.focus();
  }

  /* ---------- filtering by age ---------- */

  var showAll = false;
  function fits(elm, age) {
    var m = /^(\d+)-(\d+)$/.exec(elm.getAttribute('data-ages') || '');
    return !m || (age >= +m[1] && age <= +m[2]);
  }
  function applyFilter() {
    var p = load();
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-ages]'));
    var groups = [];
    // Cards inside one [data-age-group] (the Sprouts frames) count as one list. Hidden by age: a frame with no card left hides too.
    function groupOf(i) { return (i.closest && i.closest('[data-age-group]')) || i.parentElement; }
    items.forEach(function (i) { if (groups.indexOf(groupOf(i)) < 0) groups.push(groupOf(i)); });
    var anyHidden = false;
    groups.forEach(function (g) {
      var kids = items.filter(function (i) { return groupOf(i) === g; });
      var some = p && kids.some(function (i) { return fits(i, p.age); });
      kids.forEach(function (i) {
        var hide = !!(p && !showAll && some && !fits(i, p.age));
        if (hide) anyHidden = true;
        i.hidden = hide;
        i.classList.toggle('ys-hidden', hide);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-frame]'), function (f) {
      var cards = f.querySelectorAll('[data-ages]');
      f.hidden = cards.length > 0 && Array.prototype.every.call(cards, function (c) { return c.classList.contains('ys-hidden'); });
    });
    var bar = $('ys-filter');
    if (!p || !groups.length || (!anyHidden && !showAll)) { if (bar) bar.remove(); return; }
    if (!bar) {
      bar = el('p', { id: 'ys-filter', 'class': 'ys-filter' });
      var first = groups[0];
      first.parentNode.insertBefore(bar, first);
    }
    bar.innerHTML = '';
    bar.appendChild(el('span', { id: 'ys-filter-text' }, showAll ? 'Showing everything.' : 'Showing what fits age ' + p.age + '.'));
    var b = el('button', { type: 'button', id: 'ys-showall' }, showAll ? 'Only age ' + p.age : 'Show everything');
    b.addEventListener('click', function () { showAll = !showAll; applyFilter(); var n = $('ys-showall'); if (n) n.focus(); });
    bar.appendChild(b);
  }

  /* ---------- the badge: avatar with points below ---------- */

  function drawBadge() {
    var p = load();
    var b = $('ys-badge');
    if (!p) { if (b) b.remove(); document.body.classList.remove('ys-has-badge'); return; }
    if (!b) {
      b = el('button', { type: 'button', id: 'ys-badge', 'class': 'ys-badge', 'aria-haspopup': 'dialog' });
      b.addEventListener('click', openProfile);
      (document.querySelector('main') || document.body).appendChild(b);
    }
    document.body.classList.add('ys-has-badge');
    b.setAttribute('data-age', String(p.age));
    // The total and the split are drawn for the eyes; a screen reader hears one sentence instead.
    b.innerHTML = avatar(p.age, p.color) +
      (p.nick ? '<span class="ys-nick" id="ys-nick"></span>' : '') +
      '<span class="ys-sr">Profile, age ' + p.age + '. </span><span id="ys-pts" aria-hidden="true"></span>' +
      '<span id="ys-split" class="ys-split" aria-hidden="true"></span><span class="ys-sr" id="ys-pts-sr"></span>';
    if (p.nick) $('ys-nick').textContent = p.nick;
    showPoints();
  }

  /* ---------- first visit: ask the age ---------- */

  var skipped = false;
  function drawAsk() {
    var old = $('ys-ask');
    if (load() || skipped || !document.body.hasAttribute('data-ask-age')) { if (old) old.remove(); return; }
    if (old) return;
    var box = el('section', { id: 'ys-ask', 'class': 'ys-ask', 'aria-labelledby': 'ys-ask-h' });
    box.appendChild(el('h2', { id: 'ys-ask-h' }, 'How old is your child?'));
    box.appendChild(el('p', {}, 'Pick an age in years to see the games that fit. You can change it any time by tapping the picture in the corner. The age is kept only on this device; when we count visits, we count only the age group, never who you are.'));
    var row = el('div', { 'class': 'ys-ages', role: 'group', 'aria-label': 'Age in years' });
    AGES.forEach(function (a) {
      var b = el('button', { type: 'button', 'data-age': String(a) }, String(a));
      b.addEventListener('click', function () {
        var keep = { age: a, color: 0, nick: '' }, c = comfortList();
        if (c.length) keep.comfort = c;
        save(keep); refresh(); var bd = $('ys-badge'); if (bd) bd.focus();
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    var skip = el('button', { type: 'button', id: 'ys-skip', 'class': 'ys-plain' }, 'Show everything');
    skip.addEventListener('click', function () { skipped = true; drawAsk(); });
    box.appendChild(skip);
    var lead = document.querySelector('main .lead') || document.querySelector('main h1');
    lead.parentNode.insertBefore(box, lead.nextSibling);
  }

  /* ---------- the profile dialog ---------- */

  var draft = null;
  function openProfile() {
    var p = load();
    if (!p) return;
    draft = { age: p.age, color: p.color, nick: p.nick, comfort: p.comfort.slice() };
    var d = $('ys-profile');
    if (!d) d = buildDialog();
    fillDialog();
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    var cur = d.querySelector('.ys-dages button[aria-pressed="true"]');
    if (cur) cur.focus();
  }
  function closeProfile() {
    var d = $('ys-profile');
    if (d) { if (d.close) d.close(); else d.removeAttribute('open'); }
    var b = $('ys-badge');
    if (b) b.focus();
  }
  function buildDialog() {
    var d = el('dialog', { id: 'ys-profile', 'class': 'ys-dlg', 'aria-labelledby': 'ys-ph' });
    d.innerHTML =
      '<h2 id="ys-ph">Your child\'s profile</h2>' +
      '<div class="ys-preview"><span id="ys-pv"></span><span id="ys-pvtext"></span></div>' +
      '<fieldset><legend>Age in years</legend><div class="ys-ages ys-dages"></div></fieldset>' +
      '<fieldset><legend>Color</legend><div class="ys-colors"></div></fieldset>' +
      '<label for="ys-nickin">Nickname (you can leave this empty)</label>' +
      '<input id="ys-nickin" maxlength="12" autocomplete="off" spellcheck="false">' +
      '<p class="ys-hint">Please use a nickname, not a full name. Letters only, up to 12. The age, color and nickname are kept only on this device. The nickname and color are never sent; when we count visits, we count only the age group, never who you are.</p>' +
      '<fieldset class="ys-comfort"><legend>Comfort settings</legend><p class="ys-hint">For any child who reads, sees or moves more easily this way. Turn on what helps. You do not need to tell us why.</p></fieldset>' +
      '<div class="ys-row"><button type="button" class="ys-save" id="ys-save">Save</button><button type="button" id="ys-cancel">Close</button><button type="button" class="ys-plain" id="ys-remove">Remove profile</button></div>' +
      '<div class="ys-progress"><p class="ys-hint" id="ys-ptext"></p><button type="button" class="ys-plain" id="ys-reset">Reset progress…</button>' +
      '<div id="ys-confirm" role="alertdialog" aria-labelledby="ys-confirm-q" hidden><p id="ys-confirm-q"><b>Delete all points, garden, stars and finished chapters on this device?</b> This cannot be undone. The age, color and nickname stay.</p>' +
      '<div class="ys-row"><button type="button" class="ys-save" id="ys-keep">No, keep progress</button><button type="button" class="ys-danger" id="ys-wipe">Yes, delete progress</button></div></div></div>';
    var ages = d.querySelector('.ys-dages');
    AGES.forEach(function (a) {
      var b = el('button', { type: 'button', 'data-age': String(a) }, String(a));
      b.addEventListener('click', function () { draft.age = a; fillDialog(); });
      ages.appendChild(b);
    });
    var cols = d.querySelector('.ys-colors');
    COLORS.forEach(function (c, i) {
      var b = el('button', { type: 'button', 'data-color': String(i), 'aria-label': c.name });
      var dot = el('span', {});
      dot.style.background = c.c;
      b.appendChild(dot);
      b.addEventListener('click', function () { draft.color = i; fillDialog(); });
      cols.appendChild(b);
    });
    comfortButtons(d.querySelector('.ys-comfort'), fillDialog);
    d.querySelector('#ys-nickin').addEventListener('input', function (e) { draft.nick = e.target.value; });
    d.querySelector('#ys-save').addEventListener('click', function () {
      var keep = { age: draft.age, color: draft.color, nick: cleanNick(draft.nick) };
      if (draft.comfort.length) keep.comfort = cleanComfort(draft.comfort);
      save(keep);
      showAll = false;
      closeProfile();
      refresh();
    });
    d.querySelector('#ys-cancel').addEventListener('click', closeProfile);
    d.querySelector('#ys-reset').addEventListener('click', function () { $('ys-confirm').hidden = false; $('ys-keep').focus(); });
    d.querySelector('#ys-keep').addEventListener('click', function () { $('ys-confirm').hidden = true; $('ys-reset').focus(); });
    d.querySelector('#ys-wipe').addEventListener('click', function () {
      wipeProgress();
      $('ys-confirm').hidden = true;
      fillDialog();
      drawBadge();
      $('ys-ptext').textContent = 'Progress deleted. The games start fresh.';
      $('ys-reset').focus();
      // Pages that hold progress in memory (maths) start fresh when the dialog closes.
      d.setAttribute('data-wiped', '');
    });
    d.addEventListener('close', function () { if (d.hasAttribute('data-wiped') && document.getElementById('menu') && document.getElementById('pts')) location.reload(); });
    d.querySelector('#ys-remove').addEventListener('click', function () {
      forget();
      showAll = false; skipped = false;
      var dd = $('ys-profile'); if (dd) { if (dd.close) dd.close(); dd.remove(); }
      refresh();
      var first = document.querySelector('#ys-ask button') || document.querySelector('main h1');
      if (first) { if (!first.matches('button')) first.setAttribute('tabindex', '-1'); first.focus(); }
    });
    d.addEventListener('cancel', function () { setTimeout(function () { var b = $('ys-badge'); if (b) b.focus(); }, 0); });
    document.body.appendChild(d);
    return d;
  }
  function comfortButtons(box, after) {
    COMFORT.forEach(function (c) {
      var b = el('button', { type: 'button', 'data-comfort': c.id });
      b.appendChild(el('span', {}, c.name));
      b.appendChild(el('small', {}, c.hint));
      b.addEventListener('click', function () {
        var i = draft.comfort.indexOf(c.id);
        if (i > -1) draft.comfort.splice(i, 1); else draft.comfort.push(c.id);
        after();
      });
      box.appendChild(b);
    });
  }
  function markComfort(box) {
    Array.prototype.forEach.call(box.querySelectorAll('button[data-comfort]'), function (b) { b.setAttribute('aria-pressed', String(draft.comfort.indexOf(b.getAttribute('data-comfort')) > -1)); });
  }

  /* ---------- comfort settings without a profile ----------
     A grown-up can choose comfort settings without giving an age. With a profile, the profile dialog opens instead. */
  var opener = null;
  function openComfort(e) {
    opener = e && e.currentTarget || null;
    if (load()) {
      openProfile();
      var f = document.querySelector('#ys-profile .ys-comfort button');
      if (f) f.focus();
      return;
    }
    draft = { comfort: comfortList() };
    var d = $('ys-comfort-dlg');
    if (!d) {
      d = el('dialog', { id: 'ys-comfort-dlg', 'class': 'ys-dlg', 'aria-labelledby': 'ys-ch' });
      d.innerHTML = '<h2 id="ys-ch">Comfort settings</h2>' +
        '<fieldset class="ys-comfort"><legend>Turn on what helps</legend><p class="ys-hint">For any child. You do not need to tell us why, and no age is needed. These settings are kept only on this device and are never sent.</p></fieldset>' +
        '<div class="ys-row"><button type="button" class="ys-save" id="ys-csave">Save</button><button type="button" id="ys-cclose">Close</button></div>';
      var box = d.querySelector('.ys-comfort');
      comfortButtons(box, function () { markComfort(box); });
      d.querySelector('#ys-csave').addEventListener('click', function () {
        var p = raw(), list = cleanComfort(draft.comfort);
        if (load()) { p.comfort = list; if (!list.length) delete p.comfort; save(p); }
        else if (list.length) save({ comfort: list });
        else forget();
        closeComfort();
        refresh();
      });
      d.querySelector('#ys-cclose').addEventListener('click', closeComfort);
      d.addEventListener('cancel', function () { setTimeout(function () { if (opener) opener.focus(); }, 0); });
      document.body.appendChild(d);
    }
    markComfort(d);
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    d.querySelector('button[data-comfort]').focus();
  }
  function closeComfort() {
    var d = $('ys-comfort-dlg');
    if (d) { if (d.close) d.close(); else d.removeAttribute('open'); }
    if (opener) opener.focus();
  }
  function wireComfortLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ys-comfort]'), function (b) {
      if (b.hasAttribute('data-ys-wired')) return;
      b.setAttribute('data-ys-wired', '');
      b.hidden = false;
      var row = b.closest('[data-ys-comfort-row]');
      if (row) row.hidden = false;
      b.addEventListener('click', openComfort);
    });
  }

  function fillDialog() {
    var d = $('ys-profile');
    d.querySelector('#ys-pv').innerHTML = avatar(draft.age, draft.color);
    d.querySelector('#ys-pvtext').textContent = 'Age ' + draft.age + ': a ' + STAGES[stage(draft.age)] + '.';
    Array.prototype.forEach.call(d.querySelectorAll('.ys-dages button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-age') === draft.age)); });
    Array.prototype.forEach.call(d.querySelectorAll('.ys-colors button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-color') === draft.color)); });
    markComfort(d);
    var t = totals();
    d.querySelector('#ys-ptext').textContent = 'Progress on this device: ' + ptsWord(t.total) + ' (' + t.maths + ' maths, ' + t.english + ' English, ' + t.world + ' world).';
    d.querySelector('#ys-confirm').hidden = true;
    var input = d.querySelector('#ys-nickin');
    if (input.value !== draft.nick) input.value = draft.nick;
  }

  /* ---------- maths: its age bands come from the page, so mark them as they appear ---------- */

  function watchMathsBands() {
    var bands = $('bands');
    if (!bands) return;
    var mark = function () {
      Array.prototype.forEach.call(bands.querySelectorAll('button[data-b]'), function (b) {
        if (!b.hasAttribute('data-ages')) b.setAttribute('data-ages', b.getAttribute('data-b'));
      });
      applyFilter();
    };
    new MutationObserver(mark).observe(bands, { childList: true });
    mark();
  }

  /* ---------- wiring ---------- */

  /* Reset lives in the profile once there is one; the maths page keeps its own button only without a profile. */
  function placeReset() {
    var old = $('reset');
    if (!old) return;
    var has = !!load();
    old.hidden = has;
    var note = $('ys-reset-note');
    if (has && !note) {
      note = el('p', { id: 'ys-reset-note', 'class': 'ys-hint' }, 'To reset progress, open your child\'s profile: tap the picture in the corner.');
      old.parentNode.insertBefore(note, old);
    } else if (!has && note) note.remove();
  }
  function refresh() { applyComfort(); drawAsk(); drawBadge(); applyFilter(); placeReset(); wireComfortLinks(); }
  function init() {
    var st = el('style', { id: 'ys-profile-css' });
    st.textContent = CSS;
    document.head.appendChild(st);
    watchMathsBands();
    refresh();
    // Points can change while a game is played (maths), and the profile can change in another tab.
    window.addEventListener('storage', refresh);
    setInterval(tickRest, 1000);
    document.addEventListener('visibilitychange', function () { lastTick = Date.now(); });
    // The maths bundle writes its own points, so look again every second.
    setInterval(showPoints, 1000);
  }

  // Test hook: lets automated tests draw an avatar and compare it with the badge.
  window.YS_PROFILE = { comfort: COMFORT.map(function (c) { return c.id; }), avatar: avatar, stage: function (age) { return STAGES[stage(age)]; }, refresh: refresh };
  // Shared hook for the game pages: which comfort settings are on, fewer choices, and the device voice.
  window.YSComfort = { on: comfortOn, fewer: fewer, say: function (t) { reader.speak(t); }, open: openComfort };
  // Shared hook for the game pages: a point for each question answered right, by subject (maths, english, world).
  window.YSPoints = { add: addPoints, totals: totals };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
