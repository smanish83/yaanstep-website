/* Yaanstep Sprouts: Big and small (ages 3 to 8; Manish, 23 Nov 2026: "Add the compare like small / big numbers,
   small balloon vs big balloon like questions or which one is smaller. a cup or a bucket like graphical questions.").
   Learn: a moving lesson in 5 parts. Games: Big or small?, Which is smaller?, More or fewer?, Bigger number.
   Each game fits the child's age from the profile ("ys-profile"), read only, and sits in the middle with none.
   Within a game, a few right answers in a row make the next ones a little closer, and a miss makes them easier again.
   That lives in memory only, for this visit. Every round has exactly one right answer: no two sizes, groups or
   numbers are ever the same. Original drawings only. Nothing is stored or sent; points go to maths through the shell. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle, cap = S.cap;
  var PICS = window.YS_PICTURES || {};
  var INK = '#17332c';

  /* ---------- the child's age, read from the profile ---------- */
  function age() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'), a = p && +p.age; return a >= 3 && a <= 12 ? a : 0; } catch (e) { return 0; }
  }
  /** 0 for ages 3 and 4, 1 for 5 and 6 (and with no profile), 2 for 7 and up. */
  function level(a) { return !a ? 1 : a <= 4 ? 0 : a <= 6 ? 1 : 2; }
  /** The most things in a group (More or fewer?) and the biggest number (Bigger number), by level. */
  var GROUP_MAX = [5, 10, 20], NUMBER_MAX = [10, 20, 100];

  /* ---------- a little harder after three right in a row, easier after a miss (memory only) ---------- */
  var stretch = { size: 0, real: 0, count: 0, number: 0 }, streak = { size: 0, real: 0, count: 0, number: 0 }, missed = false;
  function gotIt(g) {
    if (missed) return;
    streak[g]++;
    if (streak[g] >= 3) { streak[g] = 0; stretch[g] = Math.min(2, stretch[g] + 1); }
  }
  function slipped(g) {
    if (missed) return;
    missed = true; streak[g] = 0; stretch[g] = Math.max(0, stretch[g] - 1);
  }

  function an(w) { return (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w; }
  function f1(n) { return Math.round(n * 100) / 100; }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }
  function list3(names) { return names.length < 3 ? names.join(' and ') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }

  /* ---------- our own drawings (64 x 64), with the shared ones from pictures.js ---------- */
  var ART = {
    balloon: '<path d="M32 46c-11 0-18-10-18-21a18 18 0 0 1 36 0c0 11-7 21-18 21z" fill="#d6453d" stroke="#8f2a24" stroke-width="2"/><path d="M29 46h6l-3 4z" fill="#8f2a24"/><path d="M32 50q-4 4 0 7t0 7" stroke="' + INK + '" stroke-width="1.5" fill="none"/><ellipse cx="25" cy="20" rx="3" ry="6" fill="#fff" opacity=".6"/>',
    house: '<rect x="12" y="30" width="40" height="30" fill="#f3dcc0" stroke="' + INK + '" stroke-width="2"/><polygon points="6,32 32,8 58,32" fill="#d6453d" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="17" y="37" width="11" height="10" fill="#9fd8ef" stroke="' + INK + '" stroke-width="1.5"/><rect x="35" y="42" width="11" height="18" fill="#8a5a33" stroke="' + INK + '" stroke-width="1.5"/>',
    bucket: '<path d="M10 20C10 2 54 2 54 20" stroke="' + INK + '" stroke-width="2.5" fill="none"/><path d="M10 20h44l-5 38a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z" fill="#3a8fd6" stroke="#1f4f99" stroke-width="2"/><ellipse cx="32" cy="20" rx="22" ry="5" fill="#cfe8f5" stroke="#1f4f99" stroke-width="2"/>',
    mouse: '<path d="M50 46q12 0 12 12" stroke="#d9778f" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="44" rx="20" ry="13" fill="#a9a9b3" stroke="#6d6d78" stroke-width="2"/><circle cx="18" cy="30" r="8" fill="#a9a9b3" stroke="#6d6d78" stroke-width="2"/><circle cx="18" cy="30" r="4" fill="#f4a3b6"/><circle cx="17" cy="42" r="2.4" fill="' + INK + '"/><circle cx="11" cy="48" r="2.2" fill="#d9778f"/>',
    elephant: '<rect x="18" y="40" width="9" height="20" rx="3" fill="#8e9aa6"/><rect x="42" y="40" width="9" height="20" rx="3" fill="#8e9aa6"/><path d="M57 30q5 4 3 11" stroke="#6b7884" stroke-width="2" fill="none"/><ellipse cx="36" cy="34" rx="22" ry="16" fill="#a3afba" stroke="#6b7884" stroke-width="2"/><path d="M8 32q-5 12 2 24" stroke="#a3afba" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="16" cy="27" r="12" fill="#a3afba" stroke="#6b7884" stroke-width="2"/><ellipse cx="23" cy="27" rx="7" ry="11" fill="#8e9aa6" stroke="#6b7884" stroke-width="1.5"/><circle cx="11" cy="23" r="2.4" fill="' + INK + '"/>',
    ant: '<g stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"><path d="M28 34l-8 16M31 36v16M34 34l8 16M12 24q-2-10-8-12M17 24q2-10 8-12"/></g><circle cx="14" cy="30" r="7" fill="#3b2a20"/><ellipse cx="31" cy="32" rx="8" ry="5" fill="#3b2a20"/><ellipse cx="49" cy="33" rx="12" ry="9" fill="#3b2a20"/><circle cx="12" cy="28" r="1.6" fill="#fff"/>',
    bathtub: '<path d="M10 30V12a6 6 0 0 1 12 0" stroke="#8a989c" stroke-width="3" fill="none"/><path d="M14 54l-4 7M50 54l4 7" stroke="#6f93c9" stroke-width="3" stroke-linecap="round"/><path d="M4 30h56v8a16 16 0 0 1-16 16H20A16 16 0 0 1 4 38z" fill="#fff" stroke="#6f93c9" stroke-width="2.5"/><path d="M6 31h52v4H6z" fill="#9fd0f0"/><circle cx="40" cy="24" r="4" fill="#e6f4fa" stroke="#6f93c9" stroke-width="1.5"/><circle cx="49" cy="20" r="3" fill="#e6f4fa" stroke="#6f93c9" stroke-width="1.5"/>',
    watermelon: '<ellipse cx="32" cy="36" rx="28" ry="20" fill="#3f9d4a" stroke="#226b2e" stroke-width="2"/><path d="M14 22q-4 14 0 28M25 17q-4 19 0 38M39 17q4 19 0 38M50 22q4 14 0 28" stroke="#226b2e" stroke-width="3" fill="none"/>'
  };
  function art(k) { return ART[k] || PICS[k] || ''; }
  /** A picture drawn at a scale, standing on the bottom of its 64 x 64 box. */
  function scaled(k, s) { return '<g transform="translate(' + f1(32 - 32 * s) + ' ' + f1(64 - 64 * s) + ') scale(' + s + ')">' + art(k) + '</g>'; }
  /** A picture with its word under it, for a tile. */
  function picTile(svg, word) {
    var box = el('span', { 'class': 'pic' });
    box.appendChild(svgEl(svg, '0 0 64 64'));
    if (word) box.appendChild(el('span', { 'class': 'w' }, word));
    return box;
  }

  /* After a miss the tapped choice is switched off, so move to the first choice still open. */
  function refocus() { var n = document.querySelector('#choices button:not([disabled])'); if (n) n.focus(); }

  /* ---------- 1. Big or small? The same thing at different sizes ---------- */
  var SIZE_THINGS = ['balloon', 'ball', 'dog', 'tree', 'fish', 'house', 'apple', 'star', 'cat', 'duck', 'car'];
  var SIZE_WORD3 = ['small', 'middle-sized', 'big'];
  function sizeScales(n, st) {
    // Never two the same: at least 0.15 apart, closer as the stretch grows.
    if (n === 2) return [f1(0.45 + 0.1 * st), f1(1 - 0.05 * st)];
    return [[0.4, 0.7, 1], [0.5, 0.72, 0.95], [0.6, 0.76, 0.92]][st];
  }
  function makeSize(lv, st, thing) {
    var n = lv === 2 ? 3 : 2, sc = sizeScales(n, st || 0), k = thing || SIZE_THINGS[rnd(SIZE_THINGS.length)];
    var big = rnd(2) === 1, ask = n === 2 ? (big ? 'bigger' : 'smaller') : (big ? 'biggest' : 'smallest');
    var order = shuffle(sc.map(function (s, i) { return i; }));
    var items = order.map(function (i, p) { return { id: 'p' + (p + 1), scale: sc[i], size: n === 2 ? (i ? 'big' : 'small') : SIZE_WORD3[i] }; });
    var pickIt = items.slice().sort(function (a, b) { return big ? b.scale - a.scale : a.scale - b.scale; })[0];
    return { game: 'size', thing: k, ask: ask, items: items, ans: pickIt.id };
  }
  function sizeName(q, it) { return 'the ' + it.size + ' ' + q.thing; }
  function sizeMovie(q) {
    // The pictures stand side by side; a green ring goes around the one asked for.
    var out = '<path d="M4 84h' + (q.items.length * 80) + '" stroke="#8aa49b" stroke-width="2"/>';
    q.items.forEach(function (it, i) {
      out += '<g' + at(0.2 + i * 0.6) + '><svg x="' + (8 + i * 80) + '" y="12" width="72" height="72" viewBox="0 0 64 64">' + scaled(q.thing, it.scale) + '</svg></g>';
      if (it.id === q.ans) out += '<rect x="' + (4 + i * 80) + '" y="6" width="80" height="84" rx="12" fill="none" stroke="#1b7a3d" stroke-width="4"' + at(0.6 + q.items.length * 0.6) + '/>';
    });
    var right = q.items.filter(function (it) { return it.id === q.ans; })[0];
    return { svg: out, vb: '0 0 ' + (q.items.length * 80 + 8) + ' 96', label: q.items.map(function (it) { return an(it.size) + ' ' + q.thing; }).join(', ') + ', side by side. A green ring goes around ' + sizeName(q, right) + '.' };
  }
  function sizeWords(q) {
    var w = { bigger: 'bigger', smaller: 'smaller', biggest: 'biggest', smallest: 'smallest' }[q.ask];
    var big = /^big/.test(q.ask);
    return 'Put them side by side and look. The ' + w + ' one ' + (big ? 'takes up the most space: it is taller and wider.' : 'takes up the least space: it is shorter and thinner.');
  }
  function sizeGame(area, ctx) {
    var lv = level(age()), q = makeSize(lv, stretch.size, ctx.fresh(SIZE_THINGS)), byId = {};
    q.items.forEach(function (it) { byId[it.id] = it; });
    ctx.set({ game: 'size', q: q, ans: q.ans, right: [q.ans], choices: q.items.map(function (it) { return it.id; }) });
    var askText = q.items.length === 2 ? 'Which ' + q.thing + ' is ' + q.ask + '?' : 'Which ' + q.thing + ' is the ' + q.ask + '?';
    ctx.ask(area, askText);
    area.appendChild(ctx.tiles(q.items.map(function (it) { return it.id; }), function (id) { return picTile(scaled(q.thing, byId[id].scale)); }, function (id, b) {
      if (id === q.ans) { b.classList.add('right'); gotIt('size'); ctx.win('Yes! That is the ' + q.ask + ' ' + q.thing + '.'); return; }
      slipped('size');
      var why = 'You tapped ' + sizeName(q, byId[id]) + '. Look for the one that is ' + (q.items.length === 2 ? q.ask : 'the ' + q.ask) + '.';
      ctx.miss(b, why, function (box) {
        var o = makeSize(lv, 0, SIZE_THINGS.filter(function (k) { return k !== q.thing; })[rnd(SIZE_THINGS.length - 1)]);
        o.ask = q.ask; o.ans = o.items.slice().sort(function (a, c) { return /^big/.test(q.ask) ? c.scale - a.scale : a.scale - c.scale; })[0].id;
        box.appendChild(el('p', {}, 'You tapped ' + sizeName(q, byId[id]) + '. Here is another one to look at.'));
        box.appendChild(ctx.moviePanel(function () { return sizeMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, sizeWords(o)));
      });
      refocus();
    }, function (id) { return sizeName(q, byId[id]); }, q.items.length === 2 ? 'tiles two sizes' : 'tiles sizes'));
  }

  /* ---------- 2. Which is smaller? Real things, drawn at any size ---------- */
  // About how big each thing is in real life, in centimeters. Pairs and threes are always far apart.
  var REAL = { ant: 0.5, bee: 1.5, egg: 6, apple: 8, mouse: 9, cup: 10, spoon: 16, pencil: 18, ball: 22, bucket: 30, watermelon: 35, cat: 45, dog: 60, chair: 90, bathtub: 160, cow: 220, bed: 200, car: 400, elephant: 600, house: 1000, bus: 1100 };
  var REAL_PAIRS = [['cup', 'bucket'], ['mouse', 'elephant'], ['ant', 'dog'], ['spoon', 'bathtub'], ['car', 'bus'], ['apple', 'watermelon'], ['bee', 'cow'], ['ball', 'house'], ['pencil', 'bed'], ['egg', 'chair']];
  var FACTS = {
    'cup|bucket': 'A bucket holds many cups of water.', 'mouse|elephant': 'An elephant is one of the biggest animals on land.', 'ant|dog': 'Many ants could walk along a dog\'s back.',
    'spoon|bathtub': 'You can sit in a bathtub, but not in a spoon!', 'car|bus': 'A bus carries lots of people. A car carries just a few.', 'apple|watermelon': 'A watermelon is so heavy you need two hands.',
    'bee|cow': 'A bee could sit on a cow\'s nose.', 'ball|house': 'A ball fits in your hands. A house fits a whole family.', 'pencil|bed': 'A pencil fits in your hand. You lie down in a bed.',
    'egg|chair': 'An egg fits in your hand. You sit on a chair.'
  };
  var REAL_KEYS = REAL_PAIRS.map(function (p) { return p.join('|'); });
  var REAL_MODES = [['true', 'same'], ['same', 'same', 'true', 'flip'], ['same', 'flip', 'flip', 'true']];
  function makeReal(lv, st, key) {
    var things;
    if (lv < 2) things = (key || REAL_KEYS[rnd(REAL_KEYS.length)]).split('|');
    else {
      // Three things, each at least 2.5 times as big as the one before.
      var all = Object.keys(REAL), tries = 0;
      do { things = shuffle(all).slice(0, 3).sort(function (a, b) { return REAL[a] - REAL[b]; }); tries++; }
      while ((REAL[things[1]] < 2.5 * REAL[things[0]] || REAL[things[2]] < 2.5 * REAL[things[1]]));
    }
    var modes = REAL_MODES[lv], mode = st > 0 && lv > 0 && rnd(2) ? 'flip' : modes[rnd(modes.length)];
    // Small to big in real life; the scale on screen depends on the mode.
    var n = things.length, sc = n === 2 ? [0.5, 1] : [0.45, 0.72, 1];
    var items = things.map(function (k, i) { return { id: k, real: REAL[k], scale: mode === 'same' ? 1 : mode === 'true' ? sc[i] : sc[n - 1 - i] }; });
    var big = rnd(2) === 1;
    var ask = n === 2 ? (big ? 'bigger' : 'smaller') : (big ? 'biggest' : 'smallest');
    return { game: 'real', mode: mode, ask: ask, items: shuffle(items), ans: big ? things[n - 1] : things[0], order: things };
  }
  function realMovie(q, labels) {
    // The things as they are in real life, side by side; the bigger they are, the bigger they are drawn (but never too tiny to see).
    var order = q.order, top = REAL[order[order.length - 1]], out = '<path d="M4 92h' + (order.length * 92) + '" stroke="#8aa49b" stroke-width="2"/>';
    order.forEach(function (k, i) {
      var s = f1(Math.max(0.3, Math.pow(REAL[k] / top, 0.35)));
      out += '<g' + at(0.3 + i * 0.8) + '><svg x="' + (10 + i * 92) + '" y="12" width="80" height="80" viewBox="0 0 64 64">' + scaled(k, s) + '</svg>' +
        (labels !== false ? '<text x="' + (50 + i * 92) + '" y="110" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '">' + k + '</text>' : '') + '</g>';
    });
    return { svg: out, vb: '0 0 ' + (order.length * 92 + 8) + ' 118', label: 'In real life: ' + order.map(function (k, i) { return an(k) + (i === 0 ? ' is small' : i === order.length - 1 ? ' is big' : ' is in the middle'); }).join(', ') + '.' };
  }
  function realWin(q) {
    var o = q.order;
    if (o.length === 2) {
      return 'Yes! In real life, ' + (q.ask === 'smaller' ? an(o[0]) + ' is smaller than ' + an(o[1]) : an(o[1]) + ' is bigger than ' + an(o[0])) + '. ' + (FACTS[o.join('|')] || '');
    }
    return 'Yes! In real life, the ' + (q.ask === 'smallest' ? o[0] + ' is the smallest.' : o[2] + ' is the biggest.') + ' From small to big: ' + list3(o.map(function (k) { return 'the ' + k; })) + '.';
  }
  function realGame(area, ctx) {
    var lv = level(age()), q = makeReal(lv, stretch.real, lv < 2 ? ctx.fresh(REAL_KEYS) : null), byId = {};
    q.items.forEach(function (it) { byId[it.id] = it; });
    ctx.set({ game: 'real', q: q, ans: q.ans, right: [q.ans], choices: q.items.map(function (it) { return it.id; }) });
    var names = q.items.map(function (it) { return 'the ' + it.id; });
    var askText = q.items.length === 2 ? 'Which is ' + q.ask + ' in real life: ' + names.join(' or ') + '?' : 'Which is the ' + q.ask + ' in real life?';
    ctx.ask(area, askText);
    if (q.mode !== 'true') area.appendChild(el('p', { 'class': 'hint', id: 'real-hint' }, q.mode === 'same' ? 'The pictures are drawn the same size. Think about the real things!' : 'The pictures are not drawn at their real sizes. Think about the real things!'));
    area.appendChild(ctx.tiles(q.items.map(function (it) { return it.id; }), function (id) { return picTile(scaled(id, byId[id].scale), id); }, function (id, b) {
      if (id === q.ans) { b.classList.add('right'); gotIt('real'); ctx.win(realWin(q)); return; }
      slipped('real');
      var big = /^big/.test(q.ask), why = 'You tapped the ' + id + '. In real life, ' + an(q.ans) + ' is ' + (big ? 'bigger' : 'smaller') + ' than ' + an(id) + '.';
      ctx.miss(b, why + ' Try again.', function (box) {
        var o = makeReal(lv, 0, REAL_KEYS.filter(function (k) { return k !== q.order.join('|'); })[rnd(REAL_KEYS.length - 1)]);
        if (lv === 2) o = makeReal(lv, 0);
        box.appendChild(el('p', {}, why));
        box.appendChild(ctx.moviePanel(function () { return realMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'A picture can be drawn any size. So imagine the real things next to each other. ' + (o.order.length === 2
          ? 'The real ' + o.order[0] + ' is smaller than the real ' + o.order[1] + '.' : 'The ' + o.order[0] + ' is the smallest and the ' + o.order[2] + ' is the biggest.')));
      });
      refocus();
    }, function (id) { return 'the ' + id; }, q.items.length === 2 ? 'tiles two sizes' : 'tiles sizes'));
  }

  /* ---------- 3. More or fewer? Two groups of the same thing ---------- */
  var COUNTERS = ['apple', 'star', 'fish', 'ball', 'duck', 'bee', 'egg', 'carrot'];
  var PLURALS = { apple: 'apples', star: 'stars', fish: 'fish', ball: 'balls', duck: 'ducks', bee: 'bees', egg: 'eggs', carrot: 'carrots' };
  function minGap(max, st, k) { return Math.max(1, Math.round(max * (k - (k / 2.2) * st))); }
  function makeCount(lv, st, thing) {
    var max = GROUP_MAX[lv], gap = minGap(max, st || 0, 0.3), a, b;
    do { a = between(1, max); b = between(1, max); } while (Math.abs(a - b) < gap);
    var more = rnd(2) === 1, g = [{ id: 'g1', n: a }, { id: 'g2', n: b }];
    // Ages 7 and up: the things are spread out, not in neat rows.
    g.forEach(function (x) { x.spots = lv === 2 ? shuffle(Array.apply(null, Array(20)).map(function (v, i) { return i; })).slice(0, x.n).sort(function (p, r) { return p - r; }) : null; });
    var ans = (more ? (a > b) : (a < b)) ? 'g1' : 'g2';
    return { game: 'count', thing: thing || COUNTERS[rnd(COUNTERS.length)], ask: more ? 'more' : 'fewer', groups: g, ans: ans, max: max };
  }
  /** A group drawn in rows of 5 (or spread over a 5 by 4 grid), each one marked so it can be counted. */
  function groupArt(thing, x) {
    var out = '', rows = Math.ceil(x.n / 5), y0 = x.spots ? 2 : 46 - rows * 11;
    for (var i = 0; i < x.n; i++) {
      var cell = x.spots ? x.spots[i] : i, cx = 2 + (cell % 5) * 21, cy = y0 + Math.floor(cell / 5) * 22;
      out += '<svg class="it" x="' + cx + '" y="' + cy + '" width="20" height="20" viewBox="0 0 64 64">' + art(thing) + '</svg>';
    }
    return out;
  }
  function groupName(q, x) { return 'the group of ' + x.n + ' ' + (x.n === 1 ? q.thing : PLURALS[q.thing]); }
  function matchMovie(thing, a, b) {
    // Two rows; a line joins one from each row, and the ones left over get a ring.
    var out = '', w = 30, n = Math.max(a, b);
    for (var i = 0; i < n; i++) {
      var x = 8 + i * w;
      if (i < a) out += '<svg x="' + x + '" y="4" width="26" height="26" viewBox="0 0 64 64">' + art(thing) + '</svg>';
      if (i < b) out += '<svg x="' + x + '" y="62" width="26" height="26" viewBox="0 0 64 64">' + art(thing) + '</svg>';
      if (i < a && i < b) out += '<path d="M' + (x + 13) + ' 32V60" stroke="#1F7A6D" stroke-width="2.5"' + at(0.3 + i * 0.4) + '/>';
      else out += '<circle cx="' + (x + 13) + '" cy="' + (i < a ? 17 : 75) + '" r="15" fill="none" stroke="#C2410C" stroke-width="3"' + at(0.5 + Math.min(a, b) * 0.4) + '/>';
    }
    return { svg: out, vb: '0 0 ' + (n * w + 16) + ' 92', label: 'A row of ' + a + ' ' + PLURALS[thing] + ' over a row of ' + b + '. Lines join one from each row. ' + (a > b ? 'The top row has some left over, so it has more.' : 'The bottom row has some left over, so it has more.') };
  }
  function countWords(a, b) {
    var big = Math.max(a, b), small = Math.min(a, b);
    return 'Match them up: one from this group with one from that group. The group with some left over has more. Here ' + big + ' is more than ' + small + ', and ' + small + ' is fewer than ' + big + '.';
  }
  function countGame(area, ctx) {
    var lv = level(age()), q = makeCount(lv, stretch.count, ctx.fresh(COUNTERS)), byId = {};
    q.groups.forEach(function (x) { byId[x.id] = x; });
    ctx.set({ game: 'count', q: q, ans: q.ans, right: [q.ans], choices: ['g1', 'g2'] });
    ctx.ask(area, 'Which group has ' + q.ask + ' ' + PLURALS[q.thing] + '?');
    area.appendChild(ctx.tiles(['g1', 'g2'], function (id) {
      var box = el('span', { 'class': 'pic' });
      box.appendChild(svgEl(groupArt(q.thing, byId[id]), '0 0 108 92'));
      return box;
    }, function (id, b) {
      var me = byId[id], other = byId[id === 'g1' ? 'g2' : 'g1'];
      if (id === q.ans) {
        b.classList.add('right'); gotIt('count');
        ctx.win('Yes! ' + me.n + ' is ' + q.ask + ' than ' + other.n + '.');
        return;
      }
      slipped('count');
      var why = 'You tapped ' + groupName(q, me) + '. ' + me.n + ' is ' + (me.n > other.n ? 'more' : 'fewer') + ' than ' + other.n + '.';
      ctx.miss(b, why + ' Try again.', function (box) {
        var o = makeCount(Math.min(lv, 1), 0, q.thing), a = o.groups[0].n, c = o.groups[1].n;
        box.appendChild(el('p', {}, why));
        box.appendChild(ctx.moviePanel(function () { return matchMovie(q.thing, a, c); }));
        box.appendChild(el('p', { id: 'lesson-say' }, countWords(a, c)));
      });
      refocus();
    }, function (id) { return groupName(q, byId[id]); }, 'tiles two groups'));
  }

  /* ---------- 4. Bigger number ---------- */
  function makeNumber(lv, st) {
    var max = NUMBER_MAX[lv], n = lv === 2 ? 3 : 2, gap = minGap(max, st || 0, 0.2), vals, tries = 0;
    do {
      vals = [];
      for (var i = 0; i < n; i++) vals.push(between(1, max));
      tries++;
    } while (vals.some(function (v, i) { return vals.some(function (w, j) { return i !== j && Math.abs(v - w) < gap; }); }));
    var big = rnd(2) === 1, sorted = vals.slice().sort(function (a, b) { return a - b; });
    var ask = n === 2 ? (big ? 'bigger' : 'smaller') : (big ? 'biggest' : 'smallest');
    return { game: 'number', ask: ask, values: vals, ans: String(big ? sorted[n - 1] : sorted[0]), counters: sorted[n - 1] <= 10, max: max };
  }
  function numberArt(v, counters) {
    var out = '<text x="50" y="' + (counters ? 42 : 58) + '" text-anchor="middle" font-size="' + (counters ? 40 : 50) + '" font-weight="800" fill="' + INK + '">' + v + '</text>';
    if (counters) for (var i = 0; i < 10; i++) {
      // A ten frame: two rows of five; the filled dots are the number.
      var cx = 18 + (i % 5) * 16, cy = 58 + Math.floor(i / 5) * 15;
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + (i < v ? '#1F7A6D' : '#fff') + '" stroke="' + INK + '" stroke-width="1.5"' + (i < v ? ' class="it"' : '') + '/>';
    }
    return out;
  }
  function lineMovie(vals, max) {
    // A number line: further along means bigger. Each number drops onto its place.
    var x0 = 16, w = 288, step = max <= 20 ? 1 : 10, out = '<path d="M' + x0 + ' 60H' + (x0 + w) + '" stroke="' + INK + '" stroke-width="2.5"/>';
    for (var t = 0; t <= max; t += step) {
      var x = x0 + w * t / max, label = max <= 10 || t % (max <= 20 ? 5 : 20) === 0;
      out += '<path d="M' + f1(x) + ' ' + (label ? 52 : 55) + 'V' + (label ? 68 : 65) + '" stroke="' + INK + '" stroke-width="1.5"/>';
      if (label) out += '<text x="' + f1(x) + '" y="84" text-anchor="middle" font-size="12" fill="' + INK + '">' + t + '</text>';
    }
    vals.slice().sort(function (a, b) { return a - b; }).forEach(function (v, i) {
      var x = f1(x0 + w * v / max);
      out += '<g' + at(0.4 + i * 0.8) + '><circle cx="' + x + '" cy="60" r="7" fill="#C2410C"/><text x="' + x + '" y="' + (38 - (i % 2) * 18) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#9a3412">' + v + '</text></g>';
    });
    out += '<path d="M' + (x0 + w - 30) + ' 100h30m-8-6 8 6-8 6" stroke="#1F7A6D" stroke-width="2.5" fill="none"' + at(0.6 + vals.length * 0.8) + '/><text x="' + (x0 + w - 36) + '" y="105" text-anchor="end" font-size="13" font-weight="700" fill="#1b7a3d"' + at(0.6 + vals.length * 0.8) + '>bigger this way</text>';
    return { svg: out, vb: '0 0 320 112', label: 'A number line from 0 to ' + max + '. The numbers ' + list3(vals.slice().sort(function (a, b) { return a - b; }).map(String)) + ' are marked on it. Further along the line means bigger.' };
  }
  function numberWords(vals) {
    var s = vals.slice().sort(function (a, b) { return a - b; }), hi = s[s.length - 1], lo = s[0];
    var tens = hi >= 10 && lo >= 10 && Math.floor(hi / 10) !== Math.floor(lo / 10) ? ' With two digits, look at the tens first: ' + Math.floor(hi / 10) + ' tens is more than ' + Math.floor(lo / 10) + ' tens.' : '';
    return 'On a number line, the numbers get bigger as you go along. ' + hi + ' is further along than ' + lo + ', so ' + hi + ' is bigger and ' + lo + ' is smaller.' + tens;
  }
  var lastNumbers = '';
  function numberGame(area, ctx) {
    var lv = level(age()), q, guard = 0;
    do { q = makeNumber(lv, stretch.number); guard++; } while (q.values.slice().sort().join() === lastNumbers && guard < 20);
    lastNumbers = q.values.slice().sort().join();
    var ids = q.values.map(String);
    ctx.set({ game: 'number', q: q, ans: q.ans, right: [q.ans], choices: ids });
    ctx.ask(area, q.values.length === 2 ? 'Which number is ' + q.ask + '?' : 'Which number is the ' + q.ask + '?');
    area.appendChild(ctx.tiles(ids, function (v) {
      var box = el('span', { 'class': 'pic' });
      box.appendChild(svgEl(numberArt(+v, q.counters), '0 0 100 ' + (q.counters ? 82 : 72)));
      return box;
    }, function (v, b) {
      if (v === q.ans) {
        b.classList.add('right'); gotIt('number');
        var others = q.values.filter(function (x) { return String(x) !== v; });
        ctx.win(q.values.length === 2 ? 'Yes! ' + v + ' is ' + q.ask + ' than ' + others[0] + '.' : 'Yes! ' + v + ' is the ' + q.ask + '. It is ' + (q.ask === 'biggest' ? 'bigger' : 'smaller') + ' than ' + list3(others.map(String)) + '.');
        return;
      }
      slipped('number');
      var why = 'You tapped ' + v + '. ' + v + ' is ' + (+v > +q.ans ? 'bigger' : 'smaller') + ' than ' + q.ans + '.';
      ctx.miss(b, why + ' Try again.', function (box) {
        var o = makeNumber(lv, 0);
        box.appendChild(el('p', {}, why + ' Here is how to tell.'));
        box.appendChild(ctx.moviePanel(function () { return lineMovie(o.values, o.max); }));
        box.appendChild(el('p', { id: 'lesson-say' }, numberWords(o.values)));
      });
      refocus();
    }, function (v) { return v; }, q.values.length === 2 ? 'tiles two nums' : 'tiles nums'));
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'Big and small', text: 'Here are two balloons. One is small, and one is big. The big balloon takes up more space. We can say: the big balloon is bigger, and the small balloon is smaller.',
      movie: function () {
        var out = '<path d="M10 104h220" stroke="#8aa49b" stroke-width="2"/>';
        out += '<g' + at(0.2) + '><svg x="20" y="58" width="46" height="46" viewBox="0 0 64 64">' + art('balloon') + '</svg><text x="43" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '">small</text></g>';
        out += '<g' + at(1.0) + '><svg x="110" y="8" width="96" height="96" viewBox="0 0 64 64">' + art('balloon') + '</svg><text x="158" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '">big</text></g>';
        return { svg: out, vb: '0 0 240 130', label: 'A small balloon appears, then a big balloon next to it.' };
      } },
    { title: 'Smallest and biggest', text: 'With three trees, we can say more. This one is the smallest. This one is in the middle. This one is the biggest: it is bigger than both of the others.',
      movie: function () {
        var out = '<path d="M6 104h300" stroke="#8aa49b" stroke-width="2"/>', s = [[34, 'smallest'], [62, 'middle'], [96, 'biggest']];
        s.forEach(function (t, i) { var x = 14 + i * 100; out += '<g' + at(0.2 + i * 0.8) + '><svg x="' + (x + (96 - t[0]) / 2) + '" y="' + (104 - t[0]) + '" width="' + t[0] + '" height="' + t[0] + '" viewBox="0 0 64 64">' + art('tree') + '</svg><text x="' + (x + 48) + '" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '">' + t[1] + '</text></g>'; });
        return { svg: out, vb: '0 0 316 130', label: 'Three trees appear: the smallest, a middle one and the biggest.' };
      } },
    { title: 'Pictures and real life', text: 'A picture can be drawn any size. Here the cup and the bucket are drawn the same size. But in real life a bucket is much bigger: it holds many cups of water. So in some games, think about the real things, not the size of the picture.',
      movie: function () {
        var out = '<text x="8" y="16" font-size="14" font-weight="700" fill="' + INK + '">In the picture:</text>';
        out += '<g' + at(0.2) + '><svg x="40" y="22" width="64" height="64" viewBox="0 0 64 64">' + art('cup') + '</svg><svg x="150" y="22" width="64" height="64" viewBox="0 0 64 64">' + art('bucket') + '</svg></g>';
        out += '<text x="8" y="112" font-size="14" font-weight="700" fill="' + INK + '"' + at(1.4) + '>In real life:</text><path d="M8 190h300" stroke="#8aa49b" stroke-width="2"' + at(1.4) + '/>';
        out += '<g' + at(1.8) + '><svg x="150" y="114" width="76" height="76" viewBox="0 0 64 64">' + art('bucket') + '</svg></g>';
        // Little cups line up beside the bucket: it takes many of them to fill it.
        for (var i = 0; i < 6; i++) out += '<g' + at(2.4 + i * 0.3) + '><svg x="' + (20 + (i % 3) * 30) + '" y="' + (i < 3 ? 166 : 142) + '" width="24" height="24" viewBox="0 0 64 64">' + art('cup') + '</svg></g>';
        return { svg: out, vb: '0 0 316 196', label: 'In the picture, a cup and a bucket are drawn the same size. Below, in real life, the bucket is big and the cups are small: six little cups stand next to one bucket.' };
      } },
    { title: 'More and fewer', text: 'Two groups of apples. Match them up, one from each group. The top group has some left over, so it has more. The bottom group has fewer.',
      movie: function () { return matchMovie('apple', 5, 3); } },
    { title: 'Bigger and smaller numbers', text: 'Numbers have sizes too. On a number line, the numbers get bigger as you go along. 7 is further along than 3, so 7 is bigger than 3, and 3 is smaller than 7.',
      movie: function () { return lineMovie([3, 7], 10); } }
  ];

  /* ---------- how the games fit the age ---------- */
  function $(id) { return document.getElementById(id); }
  function showLevel() {
    var a = age(), note = $('level-note'), lv = level(a);
    if (!note) return;
    var t = (a ? 'Set for age ' + a + ', from your child\'s profile.' : 'No age picked, so the games are set in the middle, for about ages 5 and 6. A grown-up can pick an age on the Yaanstep Sprouts page.') +
      ' Groups go up to ' + GROUP_MAX[lv] + ', and numbers up to ' + NUMBER_MAX[lv] + '.';
    if (note.textContent !== t) note.textContent = t;
  }
  // Each round starts with the question in focus, so it is read first and Tab goes on to the answers.
  function focusPrompt(fn) {
    return function (area, ctx) {
      missed = false;
      fn(area, ctx);
      var p = $('prompt');
      if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
      showLevel();
    };
  }

  S.run({
    area: 'maths',
    names: { learn: 'Learn big and small', size: 'Big or small?', real: 'Which is smaller?', count: 'More or fewer?', number: 'Bigger number' },
    learn: LEARN,
    games: { size: focusPrompt(sizeGame), real: focusPrompt(realGame), count: focusPrompt(countGame), number: focusPrompt(numberGame) },
    init: function () {
      showLevel();
      document.addEventListener('click', showLevel);
      window.addEventListener('storage', showLevel);
    }
  });
  // Test hook, read only: the question makers and the age levels.
  window.YS_COMPARE = {
    age: age, level: level, groupMax: GROUP_MAX, numberMax: NUMBER_MAX, real: REAL,
    make: { size: makeSize, real: makeReal, count: makeCount, number: makeNumber },
    stretch: function () { return { size: stretch.size, real: stretch.real, count: stretch.count, number: stretch.number }; }
  };
})();
