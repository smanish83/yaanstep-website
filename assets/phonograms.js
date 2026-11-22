/* Yaanstep Sprouts: "Phonogram games" (Manish, 22 Nov 2026).
   A phonogram is a letter, or a team of letters, that writes one sound: c, sh, ee, air.
   Four parts: a short moving lesson on what phonograms are, Split the word, Build the word (spelling)
   and Read and match (blending). Original words and drawings only. Plain script, no build step.
   Nothing is stored or sent: the page only reads the voice and speed a parent chose on the reading page.
   A computer voice cannot say a sound on its own well, so each phonogram is said with an example word
   that is never the word on screen ("sh, as in shoe"), the same way as Letter teams. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES || {};
  var ROUNDS = 8;

  /* ---------- content ---------- */

  // The example word said with each phonogram. Teams use words that are not in the games below.
  var AS = {
    a: 'apple', b: 'ball', c: 'cat', d: 'dog', e: 'egg', f: 'fan', g: 'gate', h: 'hat', i: 'igloo', k: 'kite',
    l: 'lion', m: 'map', n: 'nest', o: 'octopus', p: 'pan', r: 'red', s: 'sock', t: 'tiger', u: 'umbrella',
    sh: 'shoe', ch: 'cheese', th: 'three', ck: 'sack', ng: 'king', ai: 'snail', ee: 'feet', oa: 'coat',
    oo: 'food', ar: 'farm', or: 'corn', ow: 'owl', air: 'hair', ea: 'sea'
  };
  // Every word has a picture. Level 1: one letter for each sound. Level 2: consonant teams. Level 3: vowel teams.
  var WORDS = [
    { w: 'cat', p: ['c', 'a', 't'], lv: 1 }, { w: 'dog', p: ['d', 'o', 'g'], lv: 1 }, { w: 'sun', p: ['s', 'u', 'n'], lv: 1 },
    { w: 'pig', p: ['p', 'i', 'g'], lv: 1 }, { w: 'bus', p: ['b', 'u', 's'], lv: 1 }, { w: 'cup', p: ['c', 'u', 'p'], lv: 1 },
    { w: 'hat', p: ['h', 'a', 't'], lv: 1 }, { w: 'bed', p: ['b', 'e', 'd'], lv: 1 }, { w: 'frog', p: ['f', 'r', 'o', 'g'], lv: 1 },
    { w: 'milk', p: ['m', 'i', 'l', 'k'], lv: 1 },
    { w: 'ship', p: ['sh', 'i', 'p'], lv: 2 }, { w: 'fish', p: ['f', 'i', 'sh'], lv: 2 }, { w: 'duck', p: ['d', 'u', 'ck'], lv: 2 },
    { w: 'truck', p: ['t', 'r', 'u', 'ck'], lv: 2 }, { w: 'ring', p: ['r', 'i', 'ng'], lv: 2 }, { w: 'rocket', p: ['r', 'o', 'ck', 'e', 't'], lv: 2 },
    { w: 'rain', p: ['r', 'ai', 'n'], lv: 3 }, { w: 'tree', p: ['t', 'r', 'ee'], lv: 3 }, { w: 'bee', p: ['b', 'ee'], lv: 3 },
    { w: 'boat', p: ['b', 'oa', 't'], lv: 3 }, { w: 'goat', p: ['g', 'oa', 't'], lv: 3 }, { w: 'moon', p: ['m', 'oo', 'n'], lv: 3 },
    { w: 'spoon', p: ['s', 'p', 'oo', 'n'], lv: 3 }, { w: 'car', p: ['c', 'ar'], lv: 3 }, { w: 'star', p: ['s', 't', 'ar'], lv: 3 },
    { w: 'fork', p: ['f', 'or', 'k'], lv: 3 }, { w: 'cow', p: ['c', 'ow'], lv: 3 }, { w: 'chair', p: ['ch', 'air'], lv: 3 },
    { w: 'teapot', p: ['t', 'ea', 'p', 'o', 't'], lv: 3 }
  ];
  // Teams that look or sound alike, used as the wrong tiles in Build the word.
  var NEAR = {
    sh: ['ch', 'th', 's'], ch: ['sh', 'th', 'c'], th: ['sh', 'ch', 't'], ck: ['c', 'k', 'ch'], ng: ['n', 'g', 'nk'],
    ai: ['a', 'ee', 'oa'], ee: ['e', 'ea', 'ai'], oa: ['o', 'ow', 'ai'], oo: ['o', 'ow', 'oa'], ar: ['a', 'or', 'r'],
    or: ['o', 'ar', 'r'], ow: ['o', 'oa', 'oo'], air: ['ai', 'ar', 'ear'], ea: ['ee', 'e', 'ai']
  };
  var SINGLE = 'abcdefghiklmnoprstu'.split('');

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function picture(word) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 64 64'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    s.innerHTML = PICS[word] || '';
    return s;
  }
  function teams(item) { return item.p.filter(function (x) { return x.length > 1; }); }
  function sayPh(ph) { return ph + ', as in ' + AS[ph]; }
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function explain(item) {
    var t = teams(item), letters = item.w.length, n = item.p.length;
    var line = item.w + ' has ' + n + ' phonograms: ' + item.p.join(', ') + '.';
    if (t.length) line += ' ' + t.map(function (x) { return list(x.split('')) + ' team up to write one sound, ' + x; }).join('. ') + '. So ' + letters + ' letters, ' + n + ' sounds.';
    else line += ' One letter for each sound.';
    return line;
  }

  /* ---------- voice: on-device voices only ---------- */

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
    if (!voice) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silent fallback */ }
  }
  function hush() { try { window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }

  /* ---------- the moving picture ----------
     The letters arrive one at a time. Letters in a team slide together. A box closes round each phonogram,
     a dot appears under each one as it is said, and an arrow sweeps under the word to blend it.
     With calm mode or reduced motion the last picture shows straight away. */
  var LW = 26, PAD = 7, GAP = 12;
  function d(s) { return 'animation-delay:' + s.toFixed(2) + 's'; }
  function movie(item, opts) {
    opts = opts || {};
    var widths = item.p.map(function (x) { return x.length * LW + PAD * 2; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + GAP * (item.p.length - 1);
    var x = (340 - total) / 2, out = [], k = 0, letters = item.w.length;
    var slideAt = 0.25 + letters * 0.3, boxAt = slideAt + (teams(item).length ? 0.9 : 0.1);
    item.p.forEach(function (ph, gi) {
      var w = widths[gi];
      out.push('<rect class="mv-in" style="' + d(boxAt + gi * 0.15) + '" x="' + x + '" y="12" width="' + w + '" height="52" rx="10" fill="' + (ph.length > 1 ? '#FFF1C2' : '#fff') + '" stroke="' + (ph.length > 1 ? '#C2410C' : '#1F7A6D') + '" stroke-width="3"/>');
      ph.split('').forEach(function (ch, ci) {
        var cx = x + PAD + LW * ci + LW / 2;
        var dx = ph.length > 1 ? (ci - (ph.length - 1) / 2) * 16 : 0;
        out.push('<g class="mv-slide" style="--dx:' + dx + 'px;' + d(slideAt) + '"><text class="mv-in lt" style="' + d(0.25 + k * 0.3) + '" x="' + cx + '" y="50" text-anchor="middle">' + ch + '</text></g>');
        k++;
      });
      if (!opts.noDots) out.push('<circle class="mv-in" style="' + d(boxAt + item.p.length * 0.15 + 0.3 + gi * 0.55) + '" cx="' + (x + w / 2) + '" cy="80" r="6" fill="#1F7A6D"/>');
      x += w + GAP;
    });
    var left = (340 - total) / 2, right = left + total, sweepAt = boxAt + item.p.length * 0.7 + 0.5;
    if (!opts.noDots) out.push('<path class="mv-in" style="' + d(sweepAt) + '" d="M' + left + ' 96 H' + (right - 6) + '" stroke="#1F7A6D" stroke-width="3" fill="none"/><polygon class="mv-in" style="' + d(sweepAt) + '" points="' + (right - 8) + ',90 ' + right + ',96 ' + (right - 8) + ',102" fill="#1F7A6D"/>');
    var label = item.w + ', split into its phonograms: ' + item.p.join(', ') + '.' + (teams(item).length ? ' The letters of ' + list(teams(item)) + ' slide together into one box.' : '') + (opts.noDots ? '' : ' A dot under each sound, then an arrow under the whole word.');
    return '<svg class="phmovie" viewBox="0 0 340 108" role="img" aria-label="' + label + '"><style>.lt{font:800 32px system-ui,Segoe UI,Arial,sans-serif;fill:#17332c}</style>' + out.join('') + '</svg>';
  }
  function moviePanel(item, opts) {
    var box = el('div', { 'class': 'moving' });
    box.innerHTML = movie(item, opts);
    var again = el('button', { type: 'button', 'class': 'small watch-again' }, 'Watch again');
    again.addEventListener('click', function () { box.firstChild.outerHTML = movie(item, opts); });
    var wrap = el('div');
    wrap.appendChild(box);
    wrap.appendChild(again);
    return wrap;
  }

  /* ---------- the lesson: what is a phonogram? ---------- */

  function find(w) { return WORDS.filter(function (x) { return x.w === w; })[0]; }
  var LESSON = [
    { h: 'One letter, one sound', t: 'A phonogram is a letter, or a team of letters, that writes one sound. In cat, each letter writes one sound: c, a, t.', w: 'cat', noDots: true },
    { h: 'Letters can team up', t: 'Sometimes two letters team up to write one sound. In ship, s and h team up to write sh. So ship has 4 letters but only 3 sounds: sh, i, p.', w: 'ship', noDots: true },
    { h: 'Vowels team up too', t: 'In boat, o and a team up to write oa. Boat has 3 phonograms: b, oa, t. Some teams have three letters, like air in chair.', w: 'boat', noDots: true },
    { h: 'Split a word', t: 'To split a word, look for the letter teams first and put each team in one box. Then every other letter gets its own box.', w: 'truck', noDots: true },
    { h: 'Read with phonograms', t: 'To read a word, say the sound of each phonogram, one dot at a time. Then slide your finger along the arrow and blend them: m, oo, n, moon.', w: 'moon' },
    { h: 'Spell with phonograms', t: 'To spell a word, say it slowly. Write one phonogram for each sound you hear: s, t, ar, star.', w: 'star' }
  ];

  /* ---------- game shell ---------- */

  var game = null, round = 0, r = null, solved = false;
  var NAMES = { learn: 'What is a phonogram?', split: 'Split the word', build: 'Build the word', read: 'Read and match' };
  function show(id) { ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function setSub(text, kind) { var s = $('sub'); s.className = 'sub' + (kind ? ' ' + kind : ''); s.textContent = text; }
  // Rounds 1 to 2 easy, 3 to 5 letter teams, 6 to 8 vowel teams. Split the word starts with teams.
  function levelFor(i) { return game === 'split' ? (i < 4 ? 2 : 3) : (i < 2 ? 1 : i < 5 ? 2 : 3); }
  var used = [];
  function pickWord(level, avoid) {
    var pool = WORDS.filter(function (x) { return x.lv === level && used.indexOf(x.w) < 0 && avoid.indexOf(x.w) < 0; });
    if (!pool.length) { used = []; pool = WORDS.filter(function (x) { return x.lv === level && avoid.indexOf(x.w) < 0; }); }
    var it = pool[rnd(pool.length)];
    used.push(it.w);
    return it;
  }

  function start(g) {
    game = g; round = 0; used = [];
    $('title').textContent = NAMES[g];
    $('alldone').hidden = true;
    show('game');
    draw();
  }
  function draw() {
    solved = false;
    var area = $('area');
    area.innerHTML = ''; setSub('');
    $('more').hidden = true;
    $('howbox').innerHTML = '';
    if (game === 'learn') return drawLesson(area);
    $('count').textContent = 'Round ' + (round + 1) + ' of ' + ROUNDS;
    r = pickWord(levelFor(round), []);
    ({ split: drawSplit, build: drawBuild, read: drawRead })[game](area);
  }
  function win(text) {
    solved = true;
    setSub(text, 'yes');
    $('howbox').innerHTML = '';
    var more = $('more');
    more.textContent = game === 'learn' ? 'Next' : (round < ROUNDS - 1 ? 'Next word' : 'Finish');
    more.hidden = false;
    more.focus();
  }
  function next() {
    hush();
    if (game === 'learn') { round++; draw(); return; }
    if (round < ROUNDS - 1) { round++; draw(); return; }
    $('game').querySelector('.card').hidden = true;
    $('alldone').hidden = false;
    $('keep').focus();
  }
  function miss(hint) {
    setSub(hint, 'try');
    offerHow();
  }

  /* "Show me how": the moving picture for a different word of the same kind, so it never gives this answer away. */
  function offerHow() {
    var h = $('howbox');
    if (h.firstChild) return;
    var b = el('button', { type: 'button', id: 'howbtn' }, 'Show me how');
    b.addEventListener('click', function () {
      var ex = pickWord(r.lv === 1 ? 2 : r.lv, [r.w]);
      used.pop(); // the lesson word may still come up as a round later
      var box = el('section', { 'class': 'how-panel', id: 'lesson', 'aria-labelledby': 'lesson-h' });
      box.appendChild(el('h3', { id: 'lesson-h', tabindex: '-1' }, 'Short lesson'));
      box.appendChild(el('p', {}, ({
        split: 'Look for the letter teams first. Each team goes in one box. Every other letter gets its own box.',
        build: 'Say the word slowly. Find one phonogram for each sound, from the start of the word to the end.',
        read: 'Say each phonogram, one dot at a time. Then slide along the arrow and blend the sounds into a word.'
      })[game]));
      box.appendChild(moviePanel(ex, { noDots: game === 'split' }));
      box.appendChild(el('p', { id: 'lesson-say' }, explain(ex)));
      box.appendChild(el('p', { 'class': 'muted' }, 'Now try your word again.'));
      h.innerHTML = '';
      h.appendChild(box);
      $('lesson-h').focus();
    });
    h.appendChild(b);
  }

  /* ---------- What is a phonogram? ---------- */

  function drawLesson(area) {
    var c = LESSON[round % LESSON.length];
    $('count').textContent = 'Part ' + (round % LESSON.length + 1) + ' of ' + LESSON.length;
    area.appendChild(el('h2', { 'class': 'ask', id: 'lesson-title' }, c.h));
    area.appendChild(moviePanel(find(c.w), { noDots: c.noDots }));
    area.appendChild(el('p', { 'class': 'explain', id: 'lesson-text' }, c.t));
    r = { prompt: c.t };
    var more = $('more');
    more.textContent = round % LESSON.length < LESSON.length - 1 ? 'Next' : 'Start again';
    more.hidden = false;
    if (round % LESSON.length === LESSON.length - 1) {
      var row = el('p', { 'class': 'row' });
      ['split', 'build', 'read'].forEach(function (g) {
        var b = el('button', { type: 'button', 'class': 'small', 'data-go': g }, 'Play ' + NAMES[g]);
        b.addEventListener('click', function () { start(g); });
        row.appendChild(b);
      });
      area.appendChild(el('p', { 'class': 'hint' }, 'Now try a game:'));
      area.appendChild(row);
    }
  }

  /* ---------- Split the word ---------- */

  // Wrong ways to split: every letter alone, or a team broken with one letter joined to its neighbour.
  function wrongSplits(item) {
    var out = [], key = item.p.join('|');
    function add(p) { var k = p.join('|'); if (k !== key && out.every(function (o) { return o.join('|') !== k; })) out.push(p); }
    add(item.w.split(''));
    item.p.forEach(function (ph, i) {
      if (ph.length < 2) return;
      var head = ph.slice(0, -1), tail = ph.slice(-1);
      if (i + 1 < item.p.length) add(item.p.slice(0, i).concat([head, tail + item.p[i + 1]], item.p.slice(i + 2)));
      if (i > 0) add(item.p.slice(0, i - 1).concat([item.p[i - 1] + ph.charAt(0), ph.slice(1)], item.p.slice(i + 1)));
      else add([ph.charAt(0)].concat([ph.slice(1) + (item.p[1] || '')], item.p.slice(2)).filter(Boolean));
    });
    return shuffle(out).slice(0, 2);
  }
  function boxes(parts, cls) {
    var span = el('span', { 'class': 'pboxes' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true' });
    parts.forEach(function (p) { span.appendChild(el('span', { 'class': 'pbox' + (p.length > 1 ? ' team' : '') }, p)); });
    return span;
  }
  function drawSplit(area) {
    r.prompt = 'Which one shows the phonograms in ' + r.w + '?';
    var pic = el('div', { 'class': 'bigpic' });
    pic.appendChild(picture(r.w));
    pic.appendChild(el('span', { 'class': 'word', id: 'theword' }, r.w));
    area.appendChild(pic);
    area.appendChild(el('p', { 'class': 'ask' }, r.prompt));
    var opts = shuffle([r.p].concat(wrongSplits(r)));
    var col = el('div', { 'class': 'choices', id: 'choices' });
    opts.forEach(function (o) {
      var b = el('button', { type: 'button', 'class': 'choice', 'data-split': o.join('|'), 'aria-label': o.join(', ') });
      b.appendChild(boxes(o));
      b.addEventListener('click', function () {
        if (solved) return;
        if (o.join('|') === r.p.join('|')) {
          b.classList.add('right');
          area.appendChild(moviePanel(r));
          win('Yes! ' + explain(r));
          say(r.w);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          miss('Not yet. Look for letters that team up to write one sound, like sh, ck, ee or ar.');
        }
      });
      col.appendChild(b);
    });
    area.appendChild(col);
    say(r.prompt);
  }

  /* ---------- Build the word (spelling) ---------- */

  function tilesFor(item) {
    var wrong = [];
    item.p.forEach(function (ph) { (NEAR[ph] || []).forEach(function (n) { if (item.p.indexOf(n) < 0 && wrong.indexOf(n) < 0) wrong.push(n); }); });
    wrong = shuffle(wrong);
    var singles = shuffle(SINGLE.filter(function (s) { return item.p.indexOf(s) < 0; }));
    while (wrong.length < 2) wrong.push(singles.pop());
    return shuffle(item.p.concat(wrong.slice(0, 2)));
  }
  function drawBuild(area) {
    r.prompt = 'Spell ' + r.w + '. Tap the phonograms in order.';
    r.at = 0;
    var top = el('div', { 'class': 'bigpic' });
    top.appendChild(picture(r.w));
    var hear = el('button', { type: 'button', 'class': 'small', id: 'hearword' }, 'Hear the word');
    hear.addEventListener('click', function () { say(r.w); });
    top.appendChild(hear);
    area.appendChild(top);
    area.appendChild(el('p', { 'class': 'ask' }, 'Spell the word. Tap the phonograms in order.'));
    var slots = el('div', { 'class': 'pboxes slots', id: 'slots', 'aria-label': 'Your word so far: empty', role: 'group' });
    r.p.forEach(function () { slots.appendChild(el('span', { 'class': 'pbox empty' }, ' ')); });
    area.appendChild(slots);
    var row = el('div', { 'class': 'tilesrow', id: 'tiles' });
    tilesFor(r).forEach(function (t) {
      var b = el('button', { type: 'button', 'class': 'ptile', 'data-ph': t }, t);
      b.addEventListener('click', function () {
        if (solved) return;
        if (t === r.p[r.at]) {
          var slot = slots.children[r.at];
          slot.textContent = t; slot.className = 'pbox placed' + (t.length > 1 ? ' team' : '');
          b.disabled = true; b.classList.add('used');
          r.at++;
          slots.setAttribute('aria-label', 'Your word so far: ' + r.p.slice(0, r.at).join(', '));
          say(sayPh(t));
          if (r.at === r.p.length) { area.appendChild(moviePanel(r)); win('Yes! ' + r.w + ': ' + r.p.join(', ') + '.'); say(r.w); }
          else setSub('');
        } else {
          b.classList.add('shake');
          setTimeout(function () { b.classList.remove('shake'); }, 500);
          miss('Not yet. Say the word slowly. Which sound comes next?');
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
    say(r.prompt);
  }

  /* ---------- Read and match (blending) ---------- */

  function drawRead(area) {
    r.prompt = 'Tap each phonogram to hear it. Then find the picture.';
    area.appendChild(el('p', { 'class': 'ask' }, 'Tap each phonogram. Then blend them.'));
    var row = el('div', { 'class': 'pboxes readrow', id: 'readrow' });
    r.p.forEach(function (ph, i) {
      var b = el('button', { type: 'button', 'class': 'pbox' + (ph.length > 1 ? ' team' : ''), 'data-i': String(i), 'aria-label': 'phonogram ' + ph }, ph);
      b.addEventListener('click', function () { b.classList.add('heard'); say(sayPh(ph)); });
      row.appendChild(b);
    });
    area.appendChild(row);
    var blend = el('button', { type: 'button', id: 'blend' }, 'Blend it');
    blend.addEventListener('click', function () {
      Array.prototype.forEach.call(row.children, function (b) { b.classList.add('heard'); });
      row.classList.add('swept');
      say(r.w);
    });
    area.appendChild(el('p', { 'class': 'row center' })).appendChild(blend);
    area.appendChild(el('p', { 'class': 'ask' }, 'Which picture is it?'));
    var others = shuffle(WORDS.filter(function (x) { return x.w !== r.w; })).slice(0, 2);
    var tiles = el('div', { 'class': 'tiles', id: 'pics' });
    shuffle([r].concat(others)).forEach(function (o) {
      var b = el('button', { type: 'button', 'class': 'tile', 'data-w': o.w, 'aria-label': o.w });
      b.appendChild(picture(o.w));
      b.addEventListener('click', function () {
        if (solved) return;
        if (o.w === r.w) { b.classList.add('right'); area.appendChild(moviePanel(r)); win('Yes! ' + r.p.join(', ') + ' makes ' + r.w + '.'); say(r.w); }
        else { b.classList.add('wrong'); b.disabled = true; miss('Not yet. Say each phonogram, then blend them together.'); }
      });
      tiles.appendChild(b);
    });
    area.appendChild(tiles);
    say(r.prompt);
  }

  /* ---------- wiring ---------- */

  function init() {
    setUpVoice();
    try { window.speechSynthesis.addEventListener('voiceschanged', setUpVoice); } catch (e) { /* no voices */ }
    Object.keys(NAMES).forEach(function (g) { $('play-' + g).addEventListener('click', function () { start(g); }); });
    $('more').addEventListener('click', next);
    $('again').addEventListener('click', function () { if (r) say(r.prompt); });
    $('exit').addEventListener('click', function () { hush(); $('game').querySelector('.card').hidden = false; show('menu'); $('play-' + game).focus(); });
    $('keep').addEventListener('click', function () { $('game').querySelector('.card').hidden = false; start(game); });
    $('stop').addEventListener('click', function () { $('game').querySelector('.card').hidden = false; show('menu'); $('play-' + game).focus(); });
    show('menu');
  }
  // Test hooks: the word list, and the round on screen.
  window.YS_PHONOGRAMS = { words: WORDS, as: AS, current: function () { return r; }, wrongSplits: wrongSplits, tilesFor: tilesFor };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
