/* Yaanstep Sprouts Drawing (SCRUM-515, 23 Nov 2026): coloring pages and step-by-step drawing.
   Coloring pages are SVG files made by our own build script (src/coloring/build.mjs) and listed in coloring/index.json.
   A child can color them on screen (pick a color, tap a space), print them, or download a PNG or a PDF made here
   on the device. Step-by-step drawings come from assets/steps-data.js. Speech uses the device's own voice only.
   Nothing is sent and nothing is stored: there are no points here, and drawings are gone when the page closes. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (id) { return document.getElementById(id); };
  var VIEWS = ['home', 'cats', 'subs', 'vars', 'page', 'steps', 'step'];
  var SAFE = /^[a-z0-9-]{1,40}$/;
  var index = null, indexWait = null;
  var userNav = false;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function svgEl(inner, viewBox, label) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', viewBox);
    s.setAttribute('focusable', 'false');
    if (label) { s.setAttribute('role', 'img'); s.setAttribute('aria-label', label); } else s.setAttribute('aria-hidden', 'true');
    s.innerHTML = inner;
    return s;
  }

  /* ---------- voice: on-device voices only, same settings as the reading page ---------- */
  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function setUpVoice() {
    var r = parseFloat(readSetting('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = null;
    try {
      var local = window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
      var wanted = readSetting('voice-name');
      voice = local.filter(function (v) { return v.name === wanted; })[0] || local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
    } catch (e) { voice = null; }
    $('novoice').hidden = !!voice;
  }
  function say(text) {
    if (!voice || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch (e) { /* words stay on screen */ }
  }
  function hush() { try { window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }
  function calm() { return document.documentElement.classList.contains('ys-calm'); }

  /* ---------- the coloring index ---------- */
  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!indexWait) {
      indexWait = fetch('coloring/index.json').then(function (r) { if (!r.ok) throw new Error('index'); return r.json(); })
        .then(function (j) { index = j; return j; });
      indexWait.catch(function () { indexWait = null; });
    }
    return indexWait;
  }
  function findCat(id) { return index && index.categories.filter(function (c) { return c.id === id; })[0]; }
  function findSub(cat, id) { return cat && cat.subjects.filter(function (s) { return s.id === id; })[0]; }
  function pageUrl(cat, sub, n) { return 'coloring/' + cat + '/' + sub + '-' + n + '.svg'; }
  function pagesWord(n) { return n + (n === 1 ? ' page' : ' pages'); }

  /* ---------- how hard: Easy, Medium, Hard for every page and every step-by-step drawing ---------- */
  // 0 shows everything. The choice stays while the page is open; it is not stored on the device.
  var LV_NAMES = ['All', 'Easy', 'Medium', 'Hard'];
  var level = 0;
  function lvOf(sub, n) { var v = parseInt((sub.lv || '').charAt(n - 1), 10); return v >= 1 && v <= 3 ? v : 2; }
  function pagesAt(sub) {
    var out = [];
    for (var n = 1; n <= sub.n; n++) if (!level || lvOf(sub, n) === level) out.push(n);
    return out;
  }
  function lvTag(v) { return el('span', { class: 'tag lv' + v }, LV_NAMES[v]); }
  function syncBars() {
    Array.prototype.forEach.call(document.querySelectorAll('.lvbar button'), function (b) {
      b.setAttribute('aria-pressed', String(+b.getAttribute('data-lv') === level));
    });
  }
  function buildBars() {
    Array.prototype.forEach.call(document.querySelectorAll('.lvbar'), function (bar) {
      LV_NAMES.forEach(function (name, v) {
        var b = el('button', { type: 'button', class: 'lvchip lvc' + v, 'data-lv': String(v), 'aria-pressed': 'false' });
        if (v) b.appendChild(el('span', { class: 'dots', 'aria-hidden': 'true' }, ['', '\u25CF', '\u25CF\u25CF', '\u25CF\u25CF\u25CF'][v]));
        b.appendChild(el('span', { class: 'lw' }, name));
        b.addEventListener('click', function () {
          if (level === v) return;
          level = v;
          syncBars();
          userNav = false;
          route();
          say(v ? name : 'Everything');
        });
        bar.appendChild(b);
      });
    });
    syncBars();
  }
  function noneHere(box, what) {
    box.appendChild(el('p', { class: 'muted none' }, 'No ' + LV_NAMES[level].toLowerCase() + ' ' + what + ' here. Tap All to see everything.'));
  }

  /* ---------- views ---------- */
  function show(name) {
    VIEWS.forEach(function (v) { $('v-' + v).hidden = v !== name; });
    $('topnote').hidden = name !== 'home';
    if (name !== 'step') hush();
    if (userNav) {
      var h = $('v-' + name).querySelector('.vh') || $('h1');
      try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); }
      window.scrollTo(0, 0);
    }
  }
  function tile(href, img, word, sub, alt) {
    var a = el('a', { class: 'tile-a', href: href });
    var i = el('img', { src: img, alt: alt || '', loading: 'lazy', decoding: 'async', width: '170', height: '220' });
    a.appendChild(i);
    a.appendChild(el('span', { class: 'w' }, word));
    if (sub) a.appendChild(el('span', { class: 'n' }, sub));
    return a;
  }
  function failed(where) {
    where.textContent = '';
    where.appendChild(el('p', { class: 'note' }, 'The coloring pages could not be loaded just now. Check the internet connection and try again.'));
  }

  function viewCats() {
    show('cats');
    var box = $('cats');
    loadIndex().then(function (ix) {
      box.textContent = '';
      var shown = 0;
      ix.categories.forEach(function (c) {
        var n = c.subjects.reduce(function (t, s) { return t + pagesAt(s).length; }, 0);
        if (!n) return;
        shown += n;
        box.appendChild(tile('#color/' + c.id, 'coloring/' + c.id + '/' + c.icon, c.name, level ? n + ' ' + LV_NAMES[level].toLowerCase() : pagesWord(n)));
      });
      $('total').textContent = level ? shown + ' ' + LV_NAMES[level].toLowerCase() + ' coloring pages, out of ' + ix.total + ' in all.' : ix.total + ' coloring pages in all, drawn by Yaanstep.';
      if (userNav) say('Pick a picture.');
    }, function () { failed(box); });
  }
  function viewSubs(catId) {
    show('subs');
    var box = $('subs');
    loadIndex().then(function () {
      var cat = findCat(catId);
      if (!cat) { location.hash = '#color'; return; }
      $('subs-h').textContent = cat.name;
      box.textContent = '';
      cat.subjects.forEach(function (s) {
        var ns = pagesAt(s);
        if (!ns.length) return;
        box.appendChild(tile('#color/' + cat.id + '/' + s.id, pageUrl(cat.id, s.id, ns[0]), s.name, level ? ns.length + ' ' + LV_NAMES[level].toLowerCase() : pagesWord(s.n)));
      });
      if (!box.childNodes.length) noneHere(box, 'pages');
      if (userNav) say(cat.name);
    }, function () { failed(box); });
  }
  function viewVars(catId, subId) {
    show('vars');
    var box = $('vars');
    loadIndex().then(function () {
      var cat = findCat(catId), sub = findSub(cat, subId);
      if (!sub) { location.hash = cat ? '#color/' + catId : '#color'; return; }
      $('vars-h').textContent = sub.name;
      $('vars-back').setAttribute('href', '#color/' + cat.id);
      box.textContent = '';
      pagesAt(sub).forEach(function (n) {
        var v = lvOf(sub, n);
        var t = tile('#page/' + cat.id + '/' + sub.id + '/' + n, pageUrl(cat.id, sub.id, n), 'Page ' + n, null, sub.name + ', page ' + n + ', ' + LV_NAMES[v]);
        t.appendChild(lvTag(v));
        box.appendChild(t);
      });
      if (!box.childNodes.length) noneHere(box, 'pages');
      if (userNav) say(sub.name + '. Pick a page.');
    }, function () { failed(box); });
  }

  /* ---------- coloring a page ---------- */
  var COLORS = [
    ['Red', '#E53935'], ['Orange', '#FB8C00'], ['Yellow', '#FDD835'], ['Light green', '#9CCC65'], ['Green', '#2E7D32'],
    ['Light blue', '#4FC3F7'], ['Blue', '#1E63C4'], ['Purple', '#8E44AD'], ['Pink', '#F48FB1'], ['Peach', '#FFD7B5'],
    ['Tan', '#E0AC69'], ['Brown', '#8D5524'], ['Dark brown', '#4E342E'], ['Grey', '#9E9E9E'], ['Dark grey', '#555555'], ['White', '#FFFFFF']
  ];
  var pen = COLORS[0][1], undo = [], cur = null;

  function buildPalette() {
    var box = $('palette');
    COLORS.forEach(function (c, i) {
      var b = el('button', { type: 'button', 'aria-label': c[0], 'aria-pressed': i === 0 ? 'true' : 'false', 'data-c': c[1], title: c[0] });
      b.style.background = c[1];
      if (c[0] === 'White') { b.className = 'eraser'; b.textContent = 'Rub out'; b.setAttribute('aria-label', 'White, to rub out'); }
      b.addEventListener('click', function () {
        pen = c[1];
        Array.prototype.forEach.call(box.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        say(c[0] === 'White' ? 'Rub out' : c[0]);
      });
      box.appendChild(b);
    });
  }
  function isWhite(fill) { return /^(rgb\(255, ?255, ?255\)|#fff(fff)?|white)$/i.test(String(fill).trim()); }
  function markFillable(svg) {
    var n = 0;
    Array.prototype.forEach.call(svg.querySelectorAll('path,circle,ellipse,rect,polygon,text'), function (e) {
      if (e.closest('#ys-badge')) return;
      var f = window.getComputedStyle(e).fill;
      if (isWhite(f)) { e.setAttribute('data-f', ''); n++; }
    });
    return n;
  }
  function viewPage(catId, subId, n) {
    show('page');
    var sheet = $('sheet');
    $('page-msg').textContent = '';
    loadIndex().then(function () {
      var cat = findCat(catId), sub = findSub(cat, subId);
      n = parseInt(n, 10);
      if (!sub || !(n >= 1 && n <= sub.n)) { location.hash = '#color'; return; }
      cur = { cat: cat, sub: sub, n: n, url: pageUrl(cat.id, sub.id, n) };
      $('page-h').textContent = sub.name + ', page ' + n + ' (' + LV_NAMES[lvOf(sub, n)] + ')';
      $('page-back').setAttribute('href', '#color/' + cat.id + '/' + sub.id);
      $('page-count').textContent = 'Page ' + n + ' of ' + sub.n;
      // Page before and Next page stay within the level that is picked
      var list = pagesAt(sub), before = list.filter(function (x) { return x < n; }), after = list.filter(function (x) { return x > n; });
      var p = before.length ? before[before.length - 1] : 0, q = after.length ? after[0] : 0;
      var prev = $('prev'), next = $('next');
      prev.setAttribute('href', '#page/' + cat.id + '/' + sub.id + '/' + (p || n));
      next.setAttribute('href', '#page/' + cat.id + '/' + sub.id + '/' + (q || n));
      prev.setAttribute('aria-disabled', p ? 'false' : 'true');
      next.setAttribute('aria-disabled', q ? 'false' : 'true');
      if (!p) prev.setAttribute('tabindex', '-1'); else prev.removeAttribute('tabindex');
      if (!q) next.setAttribute('tabindex', '-1'); else next.removeAttribute('tabindex');
      return loadSheet();
    }).catch(function () { failed(sheet); });
  }
  function loadSheet() {
    var sheet = $('sheet'), want = cur.url;
    undo = [];
    return fetch(want).then(function (r) { if (!r.ok) throw new Error('page'); return r.text(); }).then(function (txt) {
      if (!cur || cur.url !== want) return;
      var doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      var svg = doc.documentElement;
      if (svg.nodeName !== 'svg') throw new Error('page');
      sheet.textContent = '';
      sheet.appendChild(document.importNode(svg, true));
      var live = sheet.querySelector('svg');
      live.setAttribute('aria-label', cur.sub.name + ' coloring page from Yaanstep Sprouts. Pick a color, then tap a space to color it.');
      cur.fillable = markFillable(live);
      if (userNav) say(cur.sub.name);
    });
  }
  function paint(e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-f]') : null;
    if (!t || !$('sheet').contains(t)) return;
    var before = t.getAttribute('fill');
    if (before === pen) return;
    undo.push([t, before]);
    if (undo.length > 300) undo.shift();
    t.setAttribute('fill', pen);
  }
  function undoOne() {
    var u = undo.pop();
    if (!u) { $('page-msg').textContent = 'Nothing to undo yet.'; return; }
    if (u[1] == null) u[0].removeAttribute('fill'); else u[0].setAttribute('fill', u[1]);
  }

  /** Draws the page as it looks now (with the child's colors) onto a canvas. */
  function toCanvas(scale) {
    return new Promise(function (resolve, reject) {
      var live = $('sheet').querySelector('svg');
      if (!live) { reject(new Error('none')); return; }
      var copy = live.cloneNode(true);
      Array.prototype.forEach.call(copy.querySelectorAll('[data-f]'), function (e) { e.removeAttribute('data-f'); });
      copy.setAttribute('width', '850'); copy.setAttribute('height', '1100');
      var blob = new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob), img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = Math.round(850 * scale); c.height = Math.round(1100 * scale);
        var x = c.getContext('2d');
        x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('draw')); };
      img.src = url;
    });
  }
  function fileName(ext) { return 'yaanstep-sprouts-' + cur.sub.id + '-' + cur.n + '.' + ext; }
  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob), a = el('a', { href: url, download: name });
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }
  function downloadPng() {
    $('page-msg').textContent = 'Making the picture...';
    toCanvas(2).then(function (c) {
      c.toBlob(function (b) { saveBlob(b, fileName('png')); $('page-msg').textContent = 'Saved as a picture: ' + fileName('png') + '.'; }, 'image/png');
    }, function () { $('page-msg').textContent = 'Sorry, the picture could not be made on this device. Try Print instead.'; });
  }

  /** A one-page US letter PDF holding the page as a JPEG, written here without any library. */
  function makePdf(jpegBytes, w, h) {
    var enc = new TextEncoder(), parts = [], offsets = [], size = 0;
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); size += b.length; }
    function obj(n, body, stream) {
      offsets[n] = size;
      add(n + ' 0 obj\n' + body);
      if (stream) { add('\nstream\n'); add(stream); add('\nendstream'); }
      add('\nendobj\n');
    }
    var pw = 612, ph = 792, iw = 576, ih = iw * h / w;
    if (ih > 756) { ih = 756; iw = ih * w / h; }
    var x = (pw - iw) / 2, y = (ph - ih) / 2;
    var draw = 'q ' + iw.toFixed(2) + ' 0 0 ' + ih.toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' cm /Im0 Do Q';
    add('%PDF-1.4\n%âãÏÓ\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    obj(4, '<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>', jpegBytes);
    obj(5, '<< /Length ' + draw.length + ' >>', draw);
    obj(6, '<< /Title (Yaanstep Sprouts coloring page) /Creator (yaanstep.com) >>');
    var xref = size;
    var t = 'xref\n0 7\n0000000000 65535 f \n';
    for (var i = 1; i <= 6; i++) t += ('0000000000' + offsets[i]).slice(-10) + ' 00000 n \n';
    add(t + 'trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    return new Blob(parts, { type: 'application/pdf' });
  }
  function downloadPdf() {
    $('page-msg').textContent = 'Making the PDF...';
    toCanvas(2).then(function (c) {
      var data = c.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(data), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      saveBlob(makePdf(bytes, c.width, c.height), fileName('pdf'));
      $('page-msg').textContent = 'Saved as a PDF: ' + fileName('pdf') + '.';
    }, function () { $('page-msg').textContent = 'Sorry, the PDF could not be made on this device. Try Print instead.'; });
  }

  /* ---------- step-by-step drawing ---------- */
  var STEPS = (window.YS_STEPS || []).filter(function (d) { return d && SAFE.test(d.id) && Array.isArray(d.steps) && d.steps.length; });
  var LEVELS = [[1, 'Easy, ages 3 to 5'], [2, 'Medium, ages 5 to 8'], [3, 'Hard, ages 8 to 12']];
  var drawing = null, at = 0;

  function pathsUpTo(d, upto, now) {
    var out = '';
    d.steps.slice(0, upto + 1).forEach(function (s, i) {
      (s.d || []).forEach(function (p, j) {
        var mine = now && i === upto;
        out += '<path d="' + p + '"' + (mine ? ' class="now draw" pathLength="1" style="animation-delay:' + (j * 0.9).toFixed(1) + 's"' : '') + '/>';
      });
    });
    return out;
  }
  function viewSteps() {
    show('steps');
    var box = $('steplist');
    box.textContent = '';
    LEVELS.forEach(function (lv) {
      if (level && lv[0] !== level) return;
      var list = STEPS.filter(function (d) { return d.level === lv[0]; });
      if (!list.length) return;
      box.appendChild(el('h3', { class: 'lvl' }, lv[1]));
      var grid = el('div', { class: 'grid' });
      list.forEach(function (d) {
        var a = el('a', { class: 'tile-a steptile', href: '#steps/' + d.id });
        a.appendChild(svgEl(pathsUpTo(d, d.steps.length - 1, false), '0 0 400 400'));
        a.appendChild(el('span', { class: 'w' }, d.name));
        a.appendChild(el('span', { class: 'n' }, (d.steps.length - 1) + ' steps'));
        a.appendChild(lvTag(d.level));
        grid.appendChild(a);
      });
      box.appendChild(grid);
    });
    if (userNav) say('What shall we draw?');
  }
  function viewStep(id) {
    var d = STEPS.filter(function (x) { return x.id === id; })[0];
    if (!d) { location.hash = '#steps'; return; }
    show('step');
    if (!drawing || drawing.id !== d.id) { drawing = d; at = 0; clearPad(); }
    var w = d.name.toLowerCase();
    $('step-h').textContent = 'Draw ' + (/s$/.test(w) ? '' : /^[aeiou]/.test(w) ? 'an ' : 'a ') + w;
    renderStep(true);
  }
  function renderStep(speak) {
    var d = drawing, last = d.steps.length - 1, s = d.steps[at];
    $('stepsvg').textContent = '';
    $('stepsvg').appendChild(svgEl(pathsUpTo(d, at, !calm()), '0 0 400 400', d.name + ', step ' + (at + 1) + ' of ' + d.steps.length + ': ' + s.say));
    $('say').textContent = s.say;
    $('step-count').textContent = 'Step ' + (at + 1) + ' of ' + d.steps.length;
    $('sback').disabled = at === 0;
    $('snext').textContent = at === last ? 'Draw something else' : 'Next step →';
    $('ghost').textContent = '';
    $('ghost').appendChild(svgEl(pathsUpTo(d, at, false), '0 0 400 400'));
    if (speak) say(s.say);
  }

  /* the drawing box */
  var PENS = [['Black', '#222222'], ['Blue', '#1E63C4'], ['Red', '#E53935'], ['Green', '#2E7D32'], ['Orange', '#FB8C00'], ['Purple', '#8E44AD']];
  var ink = PENS[0][1], drawingNow = false, lastPt = null;
  function ctx2d() { return $('canvas').getContext('2d'); }
  function clearPad() { var c = $('canvas'); ctx2d().clearRect(0, 0, c.width, c.height); }
  function point(e) {
    var c = $('canvas'), r = c.getBoundingClientRect();
    return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height];
  }
  function setUpPad() {
    var c = $('canvas'), box = $('pens');
    PENS.forEach(function (p, i) {
      var b = el('button', { type: 'button', 'aria-label': p[0] + ' pen', 'aria-pressed': i === 0 ? 'true' : 'false', title: p[0] });
      b.style.background = p[1];
      b.addEventListener('click', function () {
        ink = p[1];
        Array.prototype.forEach.call(box.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      });
      box.appendChild(b);
    });
    c.addEventListener('pointerdown', function (e) {
      drawingNow = true; lastPt = point(e);
      try { c.setPointerCapture(e.pointerId); } catch (x) { /* fine */ }
      var g = ctx2d(); g.fillStyle = ink; g.beginPath(); g.arc(lastPt[0], lastPt[1], 7, 0, Math.PI * 2); g.fill();
      e.preventDefault();
    });
    c.addEventListener('pointermove', function (e) {
      if (!drawingNow) return;
      var p = point(e), g = ctx2d();
      g.strokeStyle = ink; g.lineWidth = 14; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(lastPt[0], lastPt[1]); g.lineTo(p[0], p[1]); g.stroke();
      lastPt = p;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { c.addEventListener(t, function () { drawingNow = false; }); });
    $('clear').addEventListener('click', clearPad);
    $('guide').addEventListener('click', function () {
      var on = $('guide').getAttribute('aria-pressed') !== 'true';
      $('guide').setAttribute('aria-pressed', on ? 'true' : 'false');
      $('ghost').hidden = !on;
    });
    $('savepad').addEventListener('click', function () {
      var out = document.createElement('canvas'); out.width = c.width; out.height = c.height + 60;
      var g = out.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, out.width, out.height);
      g.drawImage(c, 0, 0);
      g.fillStyle = '#1F7A6D'; g.font = 'bold 26px Verdana, Arial, sans-serif'; g.textAlign = 'right';
      g.fillText('Drawn with Yaanstep Sprouts · yaanstep.com', out.width - 20, out.height - 22);
      out.toBlob(function (b) { saveBlob(b, 'my-drawing-' + (drawing ? drawing.id : 'yaanstep') + '.png'); }, 'image/png');
    });
  }

  /* ---------- hub pictures (our own drawings) ---------- */
  var PIC_COLOR = '<rect x="22" y="14" width="90" height="116" rx="8" fill="#fff" stroke="#222" stroke-width="4"/>' +
    '<path d="M67 98V66" stroke="#222" stroke-width="4" fill="none"/><path d="M67 86q-14 -12 -24 -2q12 10 24 2z" fill="#9CCC65" stroke="#222" stroke-width="3"/>' +
    '<g stroke="#222" stroke-width="3"><circle cx="67" cy="38" r="12" fill="#F48FB1"/><circle cx="85" cy="50" r="12" fill="#F48FB1"/><circle cx="78" cy="70" r="12" fill="#fff"/><circle cx="56" cy="70" r="12" fill="#fff"/><circle cx="49" cy="50" r="12" fill="#F48FB1"/><circle cx="67" cy="54" r="10" fill="#FDD835"/></g>' +
    '<g transform="rotate(35 118 96)"><rect x="110" y="40" width="20" height="80" rx="3" fill="#E53935" stroke="#222" stroke-width="3"/><path d="M110 120l10 22l10 -22z" fill="#FFD7B5" stroke="#222" stroke-width="3"/><path d="M117 136l3 6l3 -6z" fill="#E53935"/></g>';
  var PIC_STEPS = '<rect x="10" y="14" width="120" height="116" rx="10" fill="#fff" stroke="#222" stroke-width="4"/>' +
    '<g fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"><path d="M40 92c-6 -22 22 -30 40 -18c14 -2 22 6 20 16c-2 14 -20 18 -36 18c-14 0 -22 -6 -24 -16z"/><circle cx="92" cy="58" r="13"/></g>' +
    '<path d="M104 56l12 4l-12 4z" fill="none" stroke="#1F7A6D" stroke-width="4" stroke-linejoin="round" stroke-dasharray="4 5"/><circle cx="95" cy="54" r="2.6" fill="#222"/>' +
    '<g transform="rotate(-40 120 40)"><rect x="112" y="6" width="16" height="64" rx="3" fill="#FDD835" stroke="#222" stroke-width="3"/><path d="M112 70l8 16l8 -16z" fill="#FFD7B5" stroke="#222" stroke-width="3"/></g>';

  /* ---------- router ---------- */
  function route() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    var p = h.split('/');
    var ok = p.every(function (x, i) { return i === 0 || SAFE.test(x); });
    if (!ok) p = [''];
    if (p[0] === 'color' && p.length === 1) viewCats();
    else if (p[0] === 'color' && p.length === 2) viewSubs(p[1]);
    else if (p[0] === 'color' && p.length === 3) viewVars(p[1], p[2]);
    else if (p[0] === 'page' && p.length === 4) viewPage(p[1], p[2], p[3]);
    else if (p[0] === 'steps' && p.length === 1) viewSteps();
    else if (p[0] === 'steps' && p.length === 2) viewStep(p[1]);
    else show('home');
  }

  function start() {
    $('pic-color').appendChild(svgEl(PIC_COLOR, '0 0 150 150'));
    $('pic-steps').appendChild(svgEl(PIC_STEPS, '0 0 150 150'));
    buildPalette();
    buildBars();
    setUpPad();
    setUpVoice();
    try { window.speechSynthesis.onvoiceschanged = setUpVoice; } catch (e) { /* no voices */ }
    $('sheet').addEventListener('click', paint);
    $('undo').addEventListener('click', undoOne);
    $('restart').addEventListener('click', function () { if (cur) loadSheet(); });
    $('print').addEventListener('click', function () { window.print(); });
    $('png').addEventListener('click', downloadPng);
    $('pdf').addEventListener('click', downloadPdf);
    $('hear').addEventListener('click', function () { if (drawing) say(drawing.steps[at].say); });
    $('sback').addEventListener('click', function () { if (at > 0) { at--; renderStep(true); } });
    $('snext').addEventListener('click', function () {
      if (at < drawing.steps.length - 1) { at++; renderStep(true); } else { userNav = true; location.hash = '#steps'; }
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      if (a.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      userNav = true;
    });
    window.addEventListener('hashchange', route);
    route();
  }

  /* test hooks: read-only views of what is on screen */
  window.YS_DRAW = {
    steps: function () { return STEPS.map(function (d) { return { id: d.id, name: d.name, level: d.level, n: d.steps.length }; }); },
    step: function () { return drawing ? { id: drawing.id, at: at, say: drawing.steps[at].say } : null; },
    page: function () { return cur ? { cat: cur.cat.id, sub: cur.sub.id, n: cur.n, fillable: cur.fillable || 0, level: lvOf(cur.sub, cur.n) } : null; },
    level: function () { return level; },
    pdf: makePdf
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
