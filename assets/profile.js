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

  function load() {
    try {
      var p = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      if (!p || AGES.indexOf(+p.age) < 0) return null;
      return { age: +p.age, color: COLORS[+p.color] ? +p.color : 0, nick: cleanNick(p.nick || '') };
    } catch (e) { return null; }
  }
  function save(p) { try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* private mode: works for this visit */ } }
  function forget() { try { window.localStorage.removeItem(KEY); } catch (e) { /* nothing */ } }
  function cleanNick(s) { return String(s).replace(/[^A-Za-z '\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12); }
  function points() {
    try { var s = JSON.parse(window.localStorage.getItem('sprouts:demo') || 'null'); return s && s.points > 0 ? Math.floor(s.points) : 0; } catch (e) { return 0; }
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
    'body.ys-has-badge{padding-bottom:120px}' +
    '.ys-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}' +
    '.ys-ask{background:#fff;color:#17312D;border:3px solid #1F7A6D;border-radius:16px;padding:16px;margin:16px 0}' +
    '.ys-ask h2{margin:0 0 6px;font-size:1.25rem;color:#17312D}.ys-ask p{margin:0 0 10px}' +
    '.ys-ages{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:8px;margin:8px 0 12px}' +
    '.ys-ask button,.ys-dlg button,.ys-filter button{font:inherit;font-weight:600;min-height:48px;min-width:48px;border-radius:12px;border:2px solid #1F7A6D;background:#fff;color:#17312D;padding:6px 12px;cursor:pointer}' +
    '.ys-ages button{font-size:1.2rem}.ys-ask .ys-plain,.ys-dlg .ys-plain{border-color:#7a8c86}' +
    '.ys-ask button[aria-pressed="true"],.ys-dlg button[aria-pressed="true"],.ys-dlg .ys-save{background:#1F7A6D;color:#fff}' +
    '.ys-filter{background:#E8F4F0;color:#17312D;border-radius:12px;padding:8px 12px;margin:8px 0;display:flex;flex-wrap:wrap;align-items:center;gap:8px}' +
    '.ys-dlg{box-sizing:border-box;max-width:min(440px,calc(100vw - 24px));width:100%;border:3px solid #1F7A6D;border-radius:18px;padding:16px;background:#fff;color:#17312D;font:16px/1.4 system-ui,Segoe UI,Arial,sans-serif}' +
    '.ys-dlg::backdrop{background:rgba(0,0,0,.45)}.ys-dlg h2{margin:0 0 8px;font-size:1.2rem}.ys-dlg fieldset{border:0;padding:0;margin:0 0 12px}.ys-dlg legend{font-weight:600;margin-bottom:6px;padding:0}' +
    '.ys-preview{display:flex;align-items:center;gap:10px;margin:0 0 10px}.ys-preview svg{width:64px;height:64px}' +
    '.ys-colors{display:flex;flex-wrap:wrap;gap:8px}.ys-colors button{width:48px;padding:0;display:flex;align-items:center;justify-content:center}.ys-colors span{width:28px;height:28px;border-radius:50%;display:block}' +
    '.ys-dlg label{display:block;font-weight:600;margin-bottom:4px}.ys-dlg input{box-sizing:border-box;font:inherit;width:100%;min-height:48px;padding:6px 10px;border:2px solid #5d716a;border-radius:10px;color:#17312D;background:#fff}' +
    '.ys-hint{font-size:.85rem;color:#3f554d;margin:4px 0 12px}.ys-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}';

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
    items.forEach(function (i) { if (groups.indexOf(i.parentElement) < 0) groups.push(i.parentElement); });
    var anyHidden = false;
    groups.forEach(function (g) {
      var kids = items.filter(function (i) { return i.parentElement === g; });
      var some = p && kids.some(function (i) { return fits(i, p.age); });
      kids.forEach(function (i) {
        var hide = !!(p && !showAll && some && !fits(i, p.age));
        if (hide) anyHidden = true;
        i.hidden = hide;
        i.classList.toggle('ys-hidden', hide);
      });
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
    var pts = points();
    b.setAttribute('data-age', String(p.age));
    b.innerHTML = avatar(p.age, p.color) +
      (p.nick ? '<span class="ys-nick" id="ys-nick"></span>' : '') +
      '<span class="ys-sr">Profile, age ' + p.age + '. </span><span id="ys-pts">' + pts + (pts === 1 ? ' point' : ' points') + '</span>';
    if (p.nick) $('ys-nick').textContent = p.nick;
  }

  /* ---------- first visit: ask the age ---------- */

  var skipped = false;
  function drawAsk() {
    var old = $('ys-ask');
    if (load() || skipped || !document.body.hasAttribute('data-ask-age')) { if (old) old.remove(); return; }
    if (old) return;
    var box = el('section', { id: 'ys-ask', 'class': 'ys-ask', 'aria-labelledby': 'ys-ask-h' });
    box.appendChild(el('h2', { id: 'ys-ask-h' }, 'How old is your child?'));
    box.appendChild(el('p', {}, 'Pick an age in years to see the games that fit. You can change it any time by tapping the picture in the corner. The age is kept only on this device.'));
    var row = el('div', { 'class': 'ys-ages', role: 'group', 'aria-label': 'Age in years' });
    AGES.forEach(function (a) {
      var b = el('button', { type: 'button', 'data-age': String(a) }, String(a));
      b.addEventListener('click', function () { save({ age: a, color: 0, nick: '' }); refresh(); var bd = $('ys-badge'); if (bd) bd.focus(); });
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
    draft = { age: p.age, color: p.color, nick: p.nick };
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
      '<p class="ys-hint">Please use a nickname, not a full name. Letters only, up to 12. The age, color and nickname are kept only on this device. Nothing is sent.</p>' +
      '<div class="ys-row"><button type="button" class="ys-save" id="ys-save">Save</button><button type="button" id="ys-cancel">Close</button><button type="button" class="ys-plain" id="ys-remove">Remove profile</button></div>';
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
    d.querySelector('#ys-nickin').addEventListener('input', function (e) { draft.nick = e.target.value; });
    d.querySelector('#ys-save').addEventListener('click', function () {
      save({ age: draft.age, color: draft.color, nick: cleanNick(draft.nick) });
      showAll = false;
      closeProfile();
      refresh();
    });
    d.querySelector('#ys-cancel').addEventListener('click', closeProfile);
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
  function fillDialog() {
    var d = $('ys-profile');
    d.querySelector('#ys-pv').innerHTML = avatar(draft.age, draft.color);
    d.querySelector('#ys-pvtext').textContent = 'Age ' + draft.age + ': a ' + STAGES[stage(draft.age)] + '.';
    Array.prototype.forEach.call(d.querySelectorAll('.ys-dages button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-age') === draft.age)); });
    Array.prototype.forEach.call(d.querySelectorAll('.ys-colors button'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-color') === draft.color)); });
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

  function refresh() { drawAsk(); drawBadge(); applyFilter(); }
  function init() {
    var st = el('style', { id: 'ys-profile-css' });
    st.textContent = CSS;
    document.head.appendChild(st);
    watchMathsBands();
    refresh();
    // Points can change while a game is played (maths), and the profile can change in another tab.
    window.addEventListener('storage', refresh);
    setInterval(function () {
      var n = $('ys-pts'); if (!n) return;
      var pts = points(), t = pts + (pts === 1 ? ' point' : ' points');
      if (n.textContent !== t) n.textContent = t;
    }, 1000);
  }

  // Test hook: lets automated tests draw an avatar and compare it with the badge.
  window.YS_PROFILE = { avatar: avatar, stage: function (age) { return STAGES[stage(age)]; }, refresh: refresh };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
