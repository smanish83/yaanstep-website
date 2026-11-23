/* Yaanstep Sprouts: Word of the day and a picture dictionary for children (Manish, 23 Nov 2026; SCRUM-516).
   The words live in assets/words/*.js (window.YS_WORDS). Every meaning, origin line and sentence was written by the
   Yaanstep team. Only words on that list are ever shown: the search looks inside the list and never shows back what was
   typed, so nothing a child types can appear on the page (kid-safe allowlist).
   The word of the day is the same for everyone of an age group on a date: ages 3 to 5, 6 to 8 and 9 to 12.
   "Play with words" uses the shared shell (learn-shell.js): English points with a child profile, difficulty starts at the
   child's age and moves up after two right answers in a row, down after a miss. Speech uses the device's own voice. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle, cap = S.cap;
  var LIST = (window.YS_WORDS || []).slice().sort(function (a, b) { return a.w < b.w ? -1 : a.w > b.w ? 1 : 0; });
  var BY = {};
  LIST.forEach(function (e) { BY[e.w] = e; });

  var CATS = [
    { id: 'animals', name: 'Animals' }, { id: 'nature', name: 'Nature and weather' }, { id: 'food', name: 'Food' },
    { id: 'home', name: 'At home' }, { id: 'people', name: 'People' }, { id: 'feelings', name: 'Feelings and kindness' },
    { id: 'actions', name: 'Doing words' }, { id: 'describing', name: 'Describing words' }, { id: 'school', name: 'School' },
    { id: 'science', name: 'Science and space' }, { id: 'places', name: 'Places and travel' }, { id: 'time', name: 'Time' },
    { id: 'bigwords', name: 'Word builders' }
  ];
  var POS = { noun: 'naming word (noun)', verb: 'doing word (verb)', adjective: 'describing word (adjective)', adverb: 'how word (adverb)', other: 'word' };
  var KIND = { pre: 'prefix', root: 'root', suf: 'suffix', syl: 'part' };
  var BANDS = [{ id: 'small', from: 3, to: 5 }, { id: 'middle', from: 6, to: 8 }, { id: 'big', from: 9, to: 12 }];

  /* ---------- pictures: our own drawings from the topic packs, where a word has one ---------- */
  var PICS = {};
  Object.keys(window.YS_TOPICS || {}).forEach(function (k) {
    (window.YS_TOPICS[k].items || []).forEach(function (it) {
      if (k === 'flags') return;
      var n = it.name.toLowerCase();
      if (!PICS[n]) PICS[n] = it;
    });
  });
  function pic(w) { return PICS[w] || PICS[w + 's'] || null; }
  function picSvg(w, label) {
    var it = pic(w);
    if (!it) return null;
    return svgEl('<svg x="0" y="0" width="64" height="64" viewBox="' + (it.vb || '0 0 64 64') + '">' + it.art + '</svg>', '0 0 64 64', label);
  }
  /* Category pictures, drawn here. */
  var ICON = {
    animals: '<circle cx="32" cy="40" r="12" fill="#C2410C"/><circle cx="18" cy="24" r="6" fill="#C2410C"/><circle cx="28" cy="16" r="6" fill="#C2410C"/><circle cx="38" cy="16" r="6" fill="#C2410C"/><circle cx="47" cy="24" r="6" fill="#C2410C"/>',
    nature: '<path d="M32 56V30" stroke="#3F7D20" stroke-width="4"/><path d="M32 34C14 34 10 16 12 10c14 0 22 8 20 24zM32 30c4-14 14-18 22-16-2 12-10 18-22 16z" fill="#4CA64C"/>',
    food: '<circle cx="32" cy="38" r="18" fill="#D93B3B"/><path d="M32 20c0-6 3-10 8-12" stroke="#5B3A1A" stroke-width="3" fill="none"/><path d="M33 18c6-6 14-4 16 0-6 4-12 4-16 0z" fill="#4CA64C"/>',
    home: '<path d="M10 30L32 10l22 20" fill="none" stroke="#2F6FBF" stroke-width="5" stroke-linejoin="round"/><rect x="16" y="28" width="32" height="26" fill="#2F6FBF"/><rect x="28" y="38" width="8" height="16" fill="#FDE68A"/>',
    people: '<circle cx="22" cy="22" r="8" fill="#6D28D9"/><path d="M8 54c0-12 6-20 14-20s14 8 14 20z" fill="#6D28D9"/><circle cx="44" cy="24" r="7" fill="#BE185D"/><path d="M32 54c0-10 5-18 12-18s12 8 12 18z" fill="#BE185D"/>',
    feelings: '<circle cx="32" cy="32" r="22" fill="#F5C518"/><circle cx="24" cy="27" r="3" fill="#17332c"/><circle cx="40" cy="27" r="3" fill="#17332c"/><path d="M21 38c6 8 16 8 22 0" stroke="#17332c" stroke-width="3" fill="none" stroke-linecap="round"/>',
    actions: '<circle cx="36" cy="12" r="6" fill="#1F7A6D"/><path d="M34 20l-6 14 10 6-4 14M28 34l-12 6M34 22l12 8 8-4" stroke="#1F7A6D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    describing: '<path d="M32 8C16 8 8 20 8 32c0 14 12 24 22 24 6 0 6-6 2-10-3-4 0-8 6-8h8c8 0 10-6 10-12C56 16 46 8 32 8z" fill="#E8D5B5"/><circle cx="20" cy="28" r="4" fill="#D93B3B"/><circle cx="30" cy="18" r="4" fill="#2F6FBF"/><circle cx="42" cy="20" r="4" fill="#3F7D20"/><circle cx="46" cy="32" r="4" fill="#F5C518"/>',
    school: '<path d="M8 14c8-4 16-4 24 2v38c-8-6-16-6-24-2z" fill="#2F6FBF"/><path d="M56 14c-8-4-16-4-24 2v38c8-6 16-6 24-2z" fill="#5B8FD6"/>',
    science: '<path d="M32 6c8 6 12 16 12 28l-6 10H26l-6-10C20 22 24 12 32 6z" fill="#E5E7EB" stroke="#475569" stroke-width="2"/><circle cx="32" cy="26" r="5" fill="#2F6FBF"/><path d="M26 44l-6 10M38 44l6 10M32 44v12" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>',
    places: '<path d="M32 58S14 36 14 24a18 18 0 0 1 36 0c0 12-18 34-18 34z" fill="#D93B3B"/><circle cx="32" cy="24" r="7" fill="#fff"/>',
    time: '<circle cx="32" cy="32" r="22" fill="#fff" stroke="#1F7A6D" stroke-width="5"/><path d="M32 18v14l10 6" stroke="#17332c" stroke-width="4" fill="none" stroke-linecap="round"/>',
    bigwords: '<rect x="6" y="34" width="18" height="18" rx="3" fill="#7C3AED"/><rect x="24" y="34" width="18" height="18" rx="3" fill="#1F7A6D"/><rect x="42" y="34" width="16" height="18" rx="3" fill="#C2410C"/><rect x="15" y="14" width="18" height="18" rx="3" fill="#2F6FBF"/><rect x="33" y="14" width="18" height="18" rx="3" fill="#F5C518"/>'
  };
  function catIcon(id) { return svgEl(ICON[id] || ICON.school, '0 0 64 64'); }

  /* ---------- voice ---------- */
  var sayNow = function (t) { if (shellCtx) shellCtx.say(t); };
  var shellCtx = null;

  /* ---------- word of the day: the same for everyone of an age group on a date ---------- */
  function todayKey() {
    var o = window.YS_TODAY; // test hook: 'YYYY-MM-DD'
    if (o && /^\d{4}-\d{2}-\d{2}$/.test(o)) return o;
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function dayNumber(key) { var p = key.split('-'); return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function bandOf(age) { return BANDS.filter(function (b) { return age >= b.from && age <= b.to; })[0] || BANDS[1]; }
  function bandWords(b) { return LIST.filter(function (e) { return e.age >= b.from && e.age <= b.to; }); }
  /** Steps through every word of the group before any word comes back (a step that shares no factor with the count). */
  function wordOfDay(key, b) {
    var pool = bandWords(b), n = pool.length;
    if (!n) return LIST[0];
    var step = Math.max(1, Math.round(n * 0.618));
    while (gcd(step, n) !== 1) step++;
    var i = ((dayNumber(key) * step) % n + n) % n;
    return pool[i];
  }
  function childAge() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); return p && +p.age >= 3 && +p.age <= 12 ? +p.age : 0; } catch (e) { return 0; }
  }
  function niceDate(key) {
    var p = key.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    try { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); } catch (e) { return key; }
  }

  /* ---------- one word, drawn ---------- */
  function forms(e) {
    var w = e.w, out = [w, w + 's', w + 'es', w + 'ed', w + 'd', w + 'ing', w + 'er', w + 'est', w + 'ly'];
    if (/e$/.test(w)) out.push(w.slice(0, -1) + 'ing');
    if (/y$/.test(w)) out.push(w.slice(0, -1) + 'ies', w.slice(0, -1) + 'ied');
    if (/[^aeiou][aeiou][bdgmnprt]$/.test(w)) out.push(w + w.slice(-1) + 'ed', w + w.slice(-1) + 'ing');
    return out.concat(e.family || []);
  }
  /** A sentence with the word (and its forms) marked. Built from text nodes only. */
  function sentenceEl(s, e) {
    var p = el('p', { 'class': 'ex' }), set = forms(e).map(function (x) { return x.toLowerCase(); });
    var multi = e.w.indexOf(' ') > -1 ? new RegExp('(' + e.w.replace(/[-]/g, '\\-') + ')', 'i') : null;
    if (multi) {
      s.split(multi).forEach(function (part) { p.appendChild(multi.test(part) && part.toLowerCase() === e.w ? el('mark', {}, part) : document.createTextNode(part)); });
      return p;
    }
    s.split(/(\b[A-Za-z']+\b)/).forEach(function (part) {
      if (part && set.indexOf(part.toLowerCase()) > -1) p.appendChild(el('mark', {}, part));
      else p.appendChild(document.createTextNode(part));
    });
    return p;
  }
  function splitEl(e, big) {
    var box = el('div', { 'class': 'split' + (big ? ' big' : '') });
    var syl = 0;
    e.split.forEach(function (part, i) {
      var k = part.k === 'syl' ? 'syl s' + (syl++ % 2) : part.k;
      var b = el('button', { type: 'button', 'class': 'block ' + k, style: S.delay(0.25 * i) });
      b.appendChild(el('span', { 'class': 'bt' }, part.t));
      b.appendChild(el('span', { 'class': 'bk' }, part.k === 'syl' ? 'part ' + (i + 1) : KIND[part.k]));
      if (part.m) b.appendChild(el('span', { 'class': 'bm' }, part.m));
      b.addEventListener('click', function () { sayNow(part.t + (part.m ? '. ' + KIND[part.k] + ', it means ' + part.m : '')); });
      box.appendChild(b);
      if (i < e.split.length - 1) box.appendChild(el('span', { 'class': 'plus', 'aria-hidden': 'true' }, '+'));
    });
    box.appendChild(el('span', { 'class': 'plus', 'aria-hidden': 'true' }, '='));
    box.appendChild(el('span', { 'class': 'whole', style: S.delay(0.25 * e.split.length) }, e.w));
    return box;
  }
  function chip(w, cls) {
    if (BY[w] && w !== shown) {
      var b = el('button', { type: 'button', 'class': 'chip ' + cls }, w);
      b.addEventListener('click', function () { openWord(w, true); });
      return b;
    }
    return el('span', { 'class': 'chip ' + cls }, w);
  }
  function familyEl(e) {
    var box = el('div', { 'class': 'tree' });
    var root = e.split.filter(function (p) { return p.k === 'root'; })[0];
    var top = el('div', { 'class': 'treetop' });
    top.appendChild(el('span', { 'class': 'chip root' }, e.w));
    if (root && root.t !== e.w && e.split.length > 1 && e.split[0].k !== 'syl') top.appendChild(el('span', { 'class': 'treeroot' }, 'root: ' + root.t + (root.m ? ' (' + root.m + ')' : '')));
    box.appendChild(top);
    var kids = el('div', { 'class': 'branches' });
    (e.family || []).forEach(function (w) { kids.appendChild(chip(w, 'fam')); });
    box.appendChild(kids);
    return box;
  }
  function section(title, cls) {
    var s = el('section', { 'class': 'part ' + (cls || '') });
    s.appendChild(el('h3', {}, title));
    return s;
  }
  var shown = '';
  /** The full card for one word. */
  function wordCard(e, opts) {
    opts = opts || {};
    shown = e.w;
    var card = el('article', { 'class': 'card word', id: opts.id || 'word-card', 'data-word': e.w });
    if (opts.kicker) {
      var kr = el('div', { 'class': 'kickrow' });
      kr.appendChild(el('p', { 'class': 'kicker' }, opts.kicker));
      (opts.tools || []).forEach(function (t) { kr.appendChild(t); });
      card.appendChild(kr);
    }
    var head = el('div', { 'class': 'wordhead' });
    var p = picSvg(e.w);
    if (p) { var pb = el('span', { 'class': 'wpic mv-pop' }); pb.appendChild(p); head.appendChild(pb); }
    var hw = el('div');
    hw.appendChild(el(opts.h || 'h2', { 'class': 'headword', id: (opts.id || 'word-card') + '-h', tabindex: '-1' }, e.w));
    hw.appendChild(el('p', { 'class': 'pos' }, POS[e.pos] || 'word'));
    head.appendChild(hw);
    var hear = el('button', { type: 'button', 'class': 'primary hear', id: (opts.id || 'word-card') + '-hear' }, 'Hear it');
    hear.addEventListener('click', function () { sayNow(e.w + '. ' + e.mean); });
    head.appendChild(hear);
    card.appendChild(head);

    var mean = section('What it means', 'mean');
    mean.appendChild(el('p', { 'class': 'meaning' }, e.mean));
    card.appendChild(mean);

    var sp = section(e.split.length > 1 ? 'How the word splits' : 'One beat', 'splitpart');
    sp.appendChild(splitEl(e, true));
    sp.appendChild(el('p', { 'class': 'muted' }, e.split[0].k === 'syl' ? 'Clap it: one clap for each part. Tap a part to hear it.' : 'Tap a block to hear what it means.'));
    card.appendChild(sp);

    var ex = section('Use it in a sentence', 'examples');
    var list = el('div', { 'class': 'exlist' });
    e.ex.forEach(function (s, i) {
      var row = el('div', { 'class': 'exrow' + (i > 2 ? ' later' : '') });
      if (i > 2) row.hidden = true;
      row.appendChild(sentenceEl(s, e));
      var h = el('button', { type: 'button', 'class': 'small exhear' }, 'Hear');
      h.appendChild(el('span', { 'class': 'sr' }, ' sentence ' + (i + 1)));
      h.addEventListener('click', function () { sayNow(s); });
      row.appendChild(h);
      list.appendChild(row);
    });
    ex.appendChild(list);
    if (e.ex.length > 3) {
      var more = el('button', { type: 'button', 'class': 'small more-ex', id: (opts.id || 'word-card') + '-more' }, 'More sentences');
      more.addEventListener('click', function () {
        Array.prototype.forEach.call(list.querySelectorAll('.later'), function (r) { r.hidden = false; });
        more.remove();
      });
      ex.appendChild(more);
    }
    card.appendChild(ex);

    var fam = section('Word family', 'family');
    if ((e.family || []).length) { fam.appendChild(familyEl(e)); fam.appendChild(el('p', { 'class': 'muted' }, 'These words grow from the same root.')); }
    else fam.appendChild(el('p', {}, 'This word has no family words in our list yet.'));
    card.appendChild(fam);

    var so = section('Same and opposite', 'synopp');
    var grid = el('div', { 'class': 'pairs' });
    var same = el('div', { 'class': 'pair same' });
    same.appendChild(el('p', { 'class': 'pairhead' }, 'Means the same'));
    if (e.syn.length) e.syn.forEach(function (w) { same.appendChild(chip(w, 'syn')); });
    else same.appendChild(el('p', { 'class': 'muted' }, 'No word means quite the same.'));
    var opp = el('div', { 'class': 'pair opp' });
    opp.appendChild(el('p', { 'class': 'pairhead' }, 'Opposite'));
    if (e.opp.length) e.opp.forEach(function (w) { opp.appendChild(chip(w, 'opp')); });
    else opp.appendChild(el('p', { 'class': 'muted' }, e.pos === 'noun' ? 'Things like this have no opposite.' : 'This word has no opposite.'));
    grid.appendChild(same); grid.appendChild(opp);
    so.appendChild(grid);
    card.appendChild(so);

    var from = section('Where the word comes from', 'from');
    from.appendChild(el('p', {}, e.from));
    card.appendChild(from);
    return card;
  }

  /* ---------- views ---------- */
  function $(id) { return document.getElementById(id); }
  var VIEWS = ['menu', 'browse', 'entry', 'game'];
  function view(id) { VIEWS.forEach(function (v) { if ($(v)) $(v).hidden = v !== id; }); window.scrollTo(0, 0); }
  var band = null;
  /* "Another word": a random word for the same age group, never the same word twice in one visit. */
  var extra = null, seenWords = [];
  function anotherWord() {
    var today = wordOfDay(todayKey(), band), pool = bandWords(band);
    if (seenWords.indexOf(today.w) < 0) seenWords.push(today.w);
    var left = pool.filter(function (e) { return seenWords.indexOf(e.w) < 0; });
    if (!left.length) { seenWords = [today.w]; if (extra) seenWords.push(extra.w); left = pool.filter(function (e) { return seenWords.indexOf(e.w) < 0; }); }
    if (!left.length) return today;
    var e = left[Math.floor(Math.random() * left.length)];
    seenWords.push(e.w);
    return e;
  }
  function drawToday(focusId) {
    var key = todayKey(), age = childAge();
    if (!band) band = bandOf(age || 6);
    var today = wordOfDay(key, band), e = extra || today, box = $('today');
    box.innerHTML = '';
    var tools = [];
    var next = el('button', { type: 'button', 'class': 'primary next-word', id: 'next-word' }, extra ? 'One more word' : 'Another word');
    next.addEventListener('click', function () { extra = anotherWord(); drawToday('wotd-h'); });
    tools.push(next);
    if (extra) {
      var back = el('button', { type: 'button', 'class': 'small', id: 'back-today' }, "Today's word");
      back.addEventListener('click', function () { extra = null; drawToday('wotd-h'); });
      tools.push(back);
    }
    box.appendChild(wordCard(e, { id: 'wotd', kicker: extra ? 'Another word for ages ' + band.from + ' to ' + band.to : 'Word of the day: ' + niceDate(key), h: 'h2', tools: tools }));
    var row = el('div', { 'class': 'row center bands' });
    row.appendChild(el('span', { 'class': 'muted' }, 'Word for ages:'));
    BANDS.forEach(function (b) {
      var btn = el('button', { type: 'button', 'class': 'small', id: 'band-' + b.id, 'aria-pressed': String(b === band) }, b.from + ' to ' + b.to);
      btn.addEventListener('click', function () { band = b; extra = null; drawToday('band-' + b.id); });
      row.appendChild(btn);
    });
    box.appendChild(row);
    if (focusId && $(focusId)) $(focusId).focus();
  }
  var backTo = 'menu';
  function openWord(w, focus) {
    var e = BY[w];
    if (!e) return;
    if (!$('entry').hidden) { /* from word to word: back goes to where we came from */ } else backTo = !$('browse').hidden ? 'browse' : 'menu';
    var box = $('entry-body');
    box.innerHTML = '';
    box.appendChild(wordCard(e));
    view('entry');
    try { history.replaceState(null, '', '#' + encodeURIComponent(w)); } catch (err) { /* file pages */ }
    if (focus) $('word-card-h').focus();
  }
  function listOf(words, label) {
    var out = $('results');
    out.innerHTML = '';
    $('results-head').textContent = label;
    if (!words.length) { out.appendChild(el('p', { id: 'nothing' }, "We don't have that word in our list yet. Try another word, or pick a picture.")); return; }
    words.forEach(function (e) {
      var b = el('button', { type: 'button', 'class': 'wbtn', 'data-w': e.w });
      var p = picSvg(e.w); if (p) b.appendChild(p);
      b.appendChild(el('span', {}, e.w));
      b.addEventListener('click', function () { openWord(e.w, true); });
      out.appendChild(b);
    });
  }
  /** Search inside the word list only. What was typed is never shown back. */
  function search(q) {
    q = String(q || '').toLowerCase().replace(/[^a-z -]/g, '').trim();
    if (!q) return [];
    var hits = LIST.filter(function (e) { return e.w.indexOf(q) === 0; });
    LIST.forEach(function (e) {
      if (hits.indexOf(e) > -1) return;
      var fam = forms(e).map(function (x) { return x.toLowerCase(); });
      if (fam.indexOf(q) > -1 || (q.length > 2 && fam.some(function (x) { return x.indexOf(q) === 0; }))) hits.push(e);
    });
    return hits.slice(0, 40);
  }
  function buildBrowse() {
    var cats = $('cats');
    CATS.forEach(function (c) {
      var n = LIST.filter(function (e) { return e.cat === c.id; }).length;
      if (!n) return;
      var b = el('button', { type: 'button', 'class': 'cat', id: 'cat-' + c.id });
      b.appendChild(catIcon(c.id));
      b.appendChild(el('span', { 'class': 'cn' }, c.name));
      b.appendChild(el('small', {}, n + ' words'));
      b.addEventListener('click', function () {
        var age = childAge();
        var words = LIST.filter(function (e) { return e.cat === c.id; });
        if (age) words = words.slice().sort(function (a, z) { return (a.age > age) - (z.age > age) || (a.w < z.w ? -1 : 1); });
        listOf(words, c.name); $('results-head').focus();
      });
      cats.appendChild(b);
    });
    var abc = $('abc');
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (L) {
      var words = LIST.filter(function (e) { return e.w.charAt(0) === L; });
      var b = el('button', { type: 'button', 'class': 'letter', id: 'letter-' + L }, L.toUpperCase());
      if (!words.length) b.disabled = true;
      b.addEventListener('click', function () { listOf(words, 'Words that start with ' + L.toUpperCase()); $('results-head').focus(); });
      abc.appendChild(b);
    });
    $('find').addEventListener('submit', function (ev) {
      ev.preventDefault();
      listOf(search($('q').value), 'Words we found');
      $('results-head').focus();
    });
    $('word-count').textContent = LIST.length + ' words';
  }

  /* ---------- Play with words ---------- */
  var level = 6, streak = 0, missed = false, recent = [];
  function startLevel() { level = childAge() || 6; streak = 0; }
  function poolFor(test) {
    var lo = Math.max(3, level - 3);
    var p = LIST.filter(function (e) { return e.age <= level && e.age >= lo && test(e) && recent.indexOf(e.w) < 0; });
    if (p.length < 4) p = LIST.filter(function (e) { return e.age <= Math.max(level, 5) && test(e) && recent.indexOf(e.w) < 0; });
    if (p.length < 4) p = LIST.filter(test);
    return p;
  }
  function remember(w) { recent.push(w); if (recent.length > 12) recent.shift(); }
  function related(a, b) {
    var la = [a.w].concat(a.syn, a.opp, a.family), lb = [b.w].concat(b.syn, b.opp, b.family);
    return la.indexOf(b.w) > -1 || lb.indexOf(a.w) > -1 || la.some(function (x) { return lb.indexOf(x) > -1; });
  }
  /** Two other words from the list that are not linked to e (and are not in avoid). */
  function others(e, n, test, avoid) {
    avoid = avoid || [];
    var p = LIST.filter(function (o) { return o !== e && !related(o, e) && (!test || test(o)) && avoid.indexOf(o.w) < 0 && o.age <= Math.max(level, e.age) + 1; });
    if (p.length < n) p = LIST.filter(function (o) { return o !== e && !related(o, e) && avoid.indexOf(o.w) < 0; });
    return shuffle(p).slice(0, n);
  }
  function blankable(e) {
    var re = new RegExp('\\b' + e.w + '\\b', 'i');
    return e.ex.filter(function (s) { return re.test(s); });
  }
  var KINDS = {
    picture: function (e) { return !!pic(e.w); },
    meaning: function () { return true; },
    same: function (e) { return e.syn.some(function (s) { return s.indexOf(' ') < 0; }); },
    opposite: function (e) { return e.opp.some(function (s) { return s.indexOf(' ') < 0; }); },
    fill: function (e) { return blankable(e).length > 0; },
    build: function (e) { return e.split.length > 1; }
  };
  function kindsForLevel() {
    if (level <= 4) return ['picture', 'picture', 'build', 'fill'];
    if (level <= 6) return ['picture', 'meaning', 'build', 'fill', 'opposite'];
    if (level <= 8) return ['meaning', 'same', 'opposite', 'fill', 'build'];
    return ['meaning', 'same', 'opposite', 'fill', 'build', 'build'];
  }
  function result(ctx, e, text) {
    if (!missed) { streak++; if (streak >= 2) { level = Math.min(12, level + 1); streak = 0; } }
    ctx.win(text, text);
  }
  function wrong(ctx, b, text, e) {
    if (!missed) { missed = true; streak = 0; level = Math.max(3, level - 1); }
    ctx.miss(b, text, function (box) {
      box.appendChild(el('p', {}, e.w + ': ' + e.mean));
      box.appendChild(splitEl(e));
      box.appendChild(sentenceEl(e.ex[0], e));
    });
  }
  function wordTile(o) { return el('span', { 'class': 'wordtile small-word' }, o); }
  function play(area, ctx) {
    missed = false;
    if (ctx.round() === 0) startLevel();
    var kinds = kindsForLevel(), kind, pool, tries = 0;
    do { kind = kinds[rnd(kinds.length)]; pool = poolFor(KINDS[kind]); tries++; } while (pool.length < 3 && tries < 20);
    var e = pool[rnd(pool.length)];
    remember(e.w);
    if (kind === 'picture') {
      var opts = shuffle([e].concat(others(e, 2, KINDS.picture)));
      ctx.set({ kind: kind, w: e.w, ans: e.w, level: level });
      ctx.ask(area, 'Find: ' + e.w + '.', 'Find the picture of: ' + e.w + '.');
      area.appendChild(ctx.tiles(opts.map(function (o) { return o.w; }), function (w) { var s = el('span', { 'class': 'w' }); s.appendChild(picSvg(w)); return s; }, function (w, b) {
        if (w === e.w) { b.classList.add('right'); result(ctx, e, 'Yes! That is ' + e.w + '. ' + e.mean); }
        else wrong(ctx, b, 'You tapped ' + w + '. Try again.', BY[w]);
      }, function (w) { return w; }));
      return;
    }
    if (kind === 'build') {
      var parts = e.split.map(function (p) { return p.t; }), got = 0, order = shuffle(parts.map(function (p, i) { return i; }));
      if (order.every(function (v, i) { return v === i; }) && parts.length > 1) order.reverse();
      ctx.set({ kind: kind, w: e.w, parts: parts, level: level });
      ctx.ask(area, 'Build the word: ' + e.w, 'Build the word ' + e.w + '. Tap the parts in order.');
      var tray = el('div', { 'class': 'split built', id: 'built', 'aria-live': 'polite' });
      area.appendChild(tray);
      var row = el('div', { 'class': 'row center', id: 'parts' });
      order.forEach(function (i) {
        var p = e.split[i], b = el('button', { type: 'button', 'class': 'block ' + (p.k === 'syl' ? 'syl s' + (i % 2) : p.k), 'data-i': String(i) });
        b.appendChild(el('span', { 'class': 'bt' }, p.t));
        b.addEventListener('click', function () {
          if (ctx.solved()) return;
          // Two parts can look the same (ba-na-na): either copy counts.
          if (p.t === e.split[got].t) {
            got++; b.remove();
            var placed = el('span', { 'class': 'block placed ' + (p.k === 'syl' ? 'syl s' + (i % 2) : p.k) });
            placed.appendChild(el('span', { 'class': 'bt' }, p.t));
            tray.appendChild(placed);
            ctx.say(p.t);
            if (got === parts.length) result(ctx, e, 'Yes! ' + parts.join(' + ') + ' makes ' + e.w + '.');
          } else {
            b.classList.add('nudge');
            setTimeout(function () { b.classList.remove('nudge'); }, 600);
            wrong(ctx, null, '"' + p.t + '" comes later. Which part comes first?', e);
          }
        });
        row.appendChild(b);
      });
      area.appendChild(row);
      return;
    }
    if (kind === 'meaning') {
      var o2 = shuffle([e].concat(others(e, 2, function (o) { return o.pos === e.pos; })));
      ctx.set({ kind: kind, w: e.w, ans: e.w, level: level });
      ctx.ask(area, 'Which word means: ' + e.mean);
      area.appendChild(ctx.tiles(o2.map(function (o) { return o.w; }), wordTile, function (w, b) {
        if (w === e.w) { b.classList.add('right'); result(ctx, e, 'Yes! ' + cap(e.w) + ': ' + e.mean); }
        else wrong(ctx, b, '"' + w + '" means: ' + BY[w].mean + ' Try again.', BY[w]);
      }, function (w) { return w; }, 'tiles stack'));
      return;
    }
    if (kind === 'same' || kind === 'opposite') {
      var list = (kind === 'same' ? e.syn : e.opp).filter(function (s) { return s.indexOf(' ') < 0; });
      var ans = list[rnd(list.length)];
      var avoid = [].concat(e.syn, e.opp, e.family, [e.w]);
      var dist = others(e, 2, function (o) { return o.pos === e.pos; }, avoid).map(function (o) { return o.w; });
      var o3 = shuffle([ans].concat(dist));
      ctx.set({ kind: kind, w: e.w, ans: ans, level: level });
      ctx.ask(area, kind === 'same' ? 'Which word means the same as "' + e.w + '"?' : 'Which word is the opposite of "' + e.w + '"?');
      area.appendChild(ctx.tiles(o3, wordTile, function (w, b) {
        if (w === ans) { b.classList.add('right'); result(ctx, e, 'Yes! ' + cap(ans) + (kind === 'same' ? ' means the same as ' : ' is the opposite of ') + e.w + '.'); }
        else wrong(ctx, b, '"' + w + '" ' + (BY[w] ? 'means: ' + BY[w].mean : 'is not it.') + ' Try again.', e);
      }, function (w) { return w; }));
      return;
    }
    // fill: a sentence with a gap
    var sents = blankable(e), s = sents[rnd(sents.length)];
    var gap = s.replace(new RegExp('\\b' + e.w + '\\b', 'i'), '___');
    var o4 = shuffle([e].concat(others(e, 2, function (o) { return o.pos === e.pos && o.cat !== e.cat; }))).map(function (o) { return o.w; });
    ctx.set({ kind: 'fill', w: e.w, ans: e.w, level: level });
    ctx.ask(area, 'Which word fits?', 'Which word fits? ' + gap.replace('___', 'blank'));
    area.appendChild(el('p', { 'class': 'gap', id: 'gap' }, gap));
    area.appendChild(ctx.tiles(o4, wordTile, function (w, b) {
      if (w === e.w) { b.classList.add('right'); result(ctx, e, s); }
      else wrong(ctx, b, '"' + w + '" does not fit here. Try again.', e);
    }, function (w) { return w; }));
  }

  function init(ctx) {
    shellCtx = ctx;
    buildBrowse();
    drawToday();
    $('go-browse').addEventListener('click', function () { view('browse'); $('browse-h').focus(); });
    $('browse-back').addEventListener('click', function () { view('menu'); $('go-browse').focus(); });
    $('entry-back').addEventListener('click', function () {
      view(backTo);
      try { history.replaceState(null, '', location.pathname); } catch (err) { /* nothing */ }
      var f = backTo === 'browse' ? $('results-head') : $('go-browse'); if (f) f.focus();
    });
    $('play-play').addEventListener('click', function () { VIEWS.forEach(function (v) { if (v !== 'game' && v !== 'menu' && $(v)) $(v).hidden = true; }); });
  }
  /** After the shell has set up (it shows its menu last): words.html#tiger opens that word, words.html#browse the look-up. */
  function afterShell() {
    var h = '';
    try { h = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { h = ''; }
    if (h && BY[h]) openWord(h, true);
    else if (h === 'browse') view('browse');
  }

  window.YS_WORDS_PAGE = { list: LIST, wordOfDay: function (key, age) { return wordOfDay(key, bandOf(age || 6)).w; }, search: function (q) { return search(q).map(function (e) { return e.w; }); }, level: function () { return level; } };
  S.run({ names: { play: 'Play with words' }, learn: [], games: { play: play }, area: 'english', init: init });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterShell); else afterShell();
})();
