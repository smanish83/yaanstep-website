/* Yaanstep Sprouts: Brain games, puzzles and games for thinking (ages 3 to 8; Manish, 22 Nov 2026).
   Learn: a moving lesson in 6 parts. Games: Find the pairs, What comes next?, Odd one out, Shape puzzles, Look closely.
   Each game fits the child's age from the profile (assets/profile.js, key "ys-profile"), read only, never written.
   With no profile the games are set in the middle. No timers, no scores. Original drawings only. Nothing is stored or sent. */
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
  /** Pairs on the memory board: 4 at ages 3 and 4, then 5, 6, and 8 from age 7. 6 with no profile. */
  function pairs(a) { return !a ? 6 : a <= 4 ? 4 : a === 5 ? 5 : a === 6 ? 6 : 8; }

  /* ---------- shapes and colors: every item differs by shape, never by color alone ---------- */
  var COLORS = { red: '#d6453d', blue: '#2f6fbf', yellow: '#f2c230', green: '#3f9d4a', purple: '#7c4dbd', orange: '#e8812a' };
  var CNAMES = Object.keys(COLORS);
  var SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
  var PLURAL = { circle: 'circles', square: 'squares', triangle: 'triangles', star: 'stars', heart: 'hearts', diamond: 'diamonds' };
  function f1(n) { return Math.round(n * 10) / 10; }
  function shape(k, cx, cy, r, fill, extra) {
    var st = ' fill="' + fill + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"' + (extra || ''), pts = [];
    if (k === 'circle') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + f1(r * 0.9) + '"' + st + '/>';
    if (k === 'square') return '<rect x="' + f1(cx - r * 0.8) + '" y="' + f1(cy - r * 0.8) + '" width="' + f1(r * 1.6) + '" height="' + f1(r * 1.6) + '"' + st + '/>';
    if (k === 'triangle') pts = [[cx, cy - r], [cx + r * 0.95, cy + r * 0.75], [cx - r * 0.95, cy + r * 0.75]];
    if (k === 'diamond') pts = [[cx, cy - r], [cx + r * 0.75, cy], [cx, cy + r], [cx - r * 0.75, cy]];
    if (k === 'star') for (var i = 0; i < 10; i++) { var a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r; pts.push([cx + rr * Math.cos(a), cy + 0.08 * r + rr * Math.sin(a)]); }
    if (k === 'heart') {
      return '<path d="M' + cx + ' ' + f1(cy + r * 0.85) + 'C' + f1(cx - r * 1.5) + ' ' + f1(cy - r * 0.1) + ' ' + f1(cx - r * 0.6) + ' ' + f1(cy - r * 1.15) + ' ' + cx + ' ' + f1(cy - r * 0.4) +
        'C' + f1(cx + r * 0.6) + ' ' + f1(cy - r * 1.15) + ' ' + f1(cx + r * 1.5) + ' ' + f1(cy - r * 0.1) + ' ' + cx + ' ' + f1(cy + r * 0.85) + 'Z"' + st + '/>';
    }
    return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '"' + st + '/>';
  }
  /** A pattern item: "red-circle". */
  function sym(id, cx, cy, r) { var p = id.split('-'); return shape(p[1], cx, cy, r, COLORS[p[0]]); }
  function symName(id) { return id.replace('-', ' '); }
  function pick(list, n) { return shuffle(list).slice(0, n); }
  function the(name) { return 'the ' + name; }
  function list3(names) { return names.length < 3 ? names.join(' and ') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }

  /* ---------- 1. Find the pairs ---------- */
  var MEMO = ['cat', 'dog', 'sun', 'ball', 'moon', 'star', 'hat', 'bus', 'cup', 'pig', 'fish', 'frog', 'tree', 'book', 'car', 'cow', 'duck', 'apple', 'carrot', 'rocket', 'banana', 'umbrella', 'boat', 'bee'];
  function makeMemory(n) {
    var ids = pick(MEMO.filter(function (k) { return PICS[k]; }), n);
    return { pairs: n, cards: shuffle(ids.concat(ids)) };
  }
  function cardBack() {
    return '<rect x="3" y="3" width="58" height="58" rx="9" fill="#1F7A6D" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M32 46c-8-4-12-12-6-22 6 4 9 12 6 22zM32 46c8-4 12-12 6-22-6 4-9 12-6 22z" fill="#9fd8c9"/><path d="M32 46v10" stroke="#9fd8c9" stroke-width="2.5"/>';
  }
  function cardFace(k) {
    return '<rect x="3" y="3" width="58" height="58" rx="9" fill="#fff" stroke="' + INK + '" stroke-width="2"/><svg x="8" y="8" width="48" height="48" viewBox="0 0 64 64">' + (PICS[k] || '') + '</svg>';
  }
  function plural(k) { return k === 'fish' ? 'fish' : /(s|sh|ch)$/.test(k) ? k + 'es' : k + 's'; }
  function memoryMovie(a, b) {
    // Two cards turn over and do not match; then two that match get a green ring.
    var out = '', xs = [30, 100, 190, 260];
    xs.forEach(function (x) { out += '<svg x="' + (x - 28) + '" y="8" width="56" height="56" viewBox="0 0 64 64">' + cardBack() + '</svg>'; });
    [[0, a, 0.4], [1, b, 1.2], [2, a, 2.6], [3, a, 3.4]].forEach(function (c) {
      out += '<g' + at(c[2]) + '><svg x="' + (xs[c[0]] - 28) + '" y="8" width="56" height="56" viewBox="0 0 64 64">' + cardFace(c[1]) + '</svg></g>';
    });
    out += '<text x="65" y="88" text-anchor="middle" font-size="14" font-weight="700" fill="#7a5a00"' + at(1.8) + '>not a pair</text>';
    out += '<g' + at(4.2) + '><rect x="158" y="4" width="134" height="64" rx="12" fill="none" stroke="#1b7a3d" stroke-width="4"/><text x="225" y="88" text-anchor="middle" font-size="14" font-weight="700" fill="#1b7a3d">a pair!</text></g>';
    return { svg: out, vb: '0 0 320 96', label: 'Four cards. A ' + a + ' and a ' + b + ' turn over: not a pair. Then two cards turn over, a ' + a + ' and a ' + a + ': a pair, with a green ring around them.' };
  }
  var MEMORY_WORDS = 'Turn over one card and say its name. Then think: where did I see one like it? If you are not sure, turn another card and remember where it is. A pair stays face up.';

  function memory(area, ctx) {
    var q = makeMemory(pairs(age())), found = [], open = [], back = null;
    ctx.set({ game: 'memory', pairs: q.pairs, cards: q.cards, found: found });
    ctx.ask(area, 'Find the pairs. Tap a card to turn it over.');
    var board = area.appendChild(el('div', { 'class': 'board', id: 'board' }));
    var btns = q.cards.map(function (k, i) {
      var b = el('button', { type: 'button', 'class': 'mcard', 'data-i': String(i) });
      b.appendChild(el('span', { 'class': 'sr' }, ''));
      b.addEventListener('click', function () { tap(i); });
      board.appendChild(b);
      return b;
    });
    function paint(i, up) {
      var b = btns[i], k = q.cards[i], done = found.indexOf(i) >= 0;
      b.querySelector('.sr').textContent = 'Card ' + (i + 1) + ': ' + (up ? k + (done ? ', found' : '') : 'face down');
      var old = b.querySelector('svg'); if (old) b.removeChild(old);
      b.appendChild(svgEl(up ? cardFace(k) : cardBack(), '0 0 64 64'));
      b.classList.toggle('up', up);
      b.classList.toggle('flip', up && !done);
      b.classList.toggle('found', done);
      if (done) b.disabled = true;
    }
    function turnBack() {
      if (back) { clearTimeout(back); back = null; }
      open.forEach(function (j) { paint(j, false); });
      open = [];
    }
    function tap(i) {
      if (ctx.solved() || found.indexOf(i) >= 0) return;
      if (open.length === 2) turnBack();
      if (open.indexOf(i) >= 0) return;
      open.push(i); paint(i, true);
      if (open.length < 2) { ctx.say(q.cards[i]); return; }
      var a = open[0], b = open[1], ka = q.cards[a], kb = q.cards[b];
      if (ka === kb) {
        found.push(a, b); open = [];
        paint(a, true); paint(b, true);
        if (found.length === q.cards.length) { ctx.win('Yes! You found all ' + q.pairs + ' pairs.'); return; }
        ctx.setSub('Two ' + plural(ka) + '! That is a pair.', 'yes');
        ctx.say('Two ' + plural(ka) + '. A pair!');
        // The pair stays face up and cannot be pressed, so move on to the next card still face down.
        for (var s = 1; s <= btns.length; s++) { var n = (b + s) % btns.length; if (found.indexOf(n) < 0) { btns[n].focus(); break; } }
        return;
      }
      ctx.miss(null, 'You turned over ' + (/^[aeiou]/.test(ka) ? 'an ' : 'a ') + ka + ' and ' + (/^[aeiou]/.test(kb) ? 'an ' : 'a ') + kb + '. Not a pair this time. Try to remember where they are.', function (box) {
        var others = MEMO.filter(function (k) { return PICS[k] && k !== ka && k !== kb; }), x = others[rnd(others.length)], y = others.filter(function (k) { return k !== x; })[rnd(others.length - 1)];
        box.appendChild(el('p', {}, 'You turned over these two: ' + the(ka) + ' and ' + the(kb) + '. Watch how to find a pair.'));
        box.appendChild(ctx.moviePanel(function () { return memoryMovie(x, y); }));
        box.appendChild(el('p', { id: 'lesson-say' }, MEMORY_WORDS));
      });
      // Both stay face up for a moment, then turn back. A new tap turns them back at once.
      back = setTimeout(function () { back = null; if (board.isConnected) turnBack(); }, 1600);
    }
    btns.forEach(function (b, i) { paint(i, false); });
  }

  /* ---------- 2. What comes next? ---------- */
  var UNITS = { AB: [0, 1], AAB: [0, 0, 1], ABB: [0, 1, 1], ABC: [0, 1, 2], AABB: [0, 0, 1, 1], ABBC: [0, 1, 1, 2] };
  var NEXT_LEVELS = [['AB', 'AAB'], ['AB', 'AAB', 'ABB', 'ABC'], ['ABC', 'AABB', 'grow', 'ABBC']];
  /** Symbols with different shapes and different colors, so color is never the only clue. */
  function symbols(n) { var sh = pick(SHAPES, n), co = pick(CNAMES, n); return sh.map(function (s, i) { return co[i] + '-' + s; }); }
  function makeNext(lv, round, kind) {
    var list = NEXT_LEVELS[lv];
    kind = kind || list[round % list.length];
    if (kind === 'grow') {
      var start = between(1, 2), n = between(3, 4), h = [];
      for (var i = 0; i < n; i++) h.push(start + i);
      var ans = start + n;
      return { kind: 'grow', unit: 'grow', heights: h, ans: 'tower-' + ans, choices: shuffle([ans - 1, ans, ans + 1]).map(function (v) { return 'tower-' + v; }) };
    }
    var unit = UNITS[kind], len = unit.length, k = rnd(len), shown = Math.min(2 * len + k, 9);
    var syms = symbols(Math.max.apply(null, unit) + 2), seq = [];
    for (var j = 0; j < shown; j++) seq.push(syms[unit[j % len]]);
    var right = syms[unit[shown % len]];
    // The right one, plus two others: from the pattern first, then a new one.
    var others = syms.filter(function (s) { return s !== right; }).slice(0, 2);
    return { kind: 'repeat', unit: kind, seq: seq, ans: right, choices: shuffle([right].concat(others)) };
  }
  /** A tower of n blocks standing on base. Each block is bh tall (11 in the pattern, 8 in a choice so 7 blocks still fit). */
  function tower(n, x, base, color, bh) {
    var out = '', h = bh || 11;
    for (var i = 0; i < n; i++) out += '<rect x="' + (x - 9) + '" y="' + (base - (i + 1) * h) + '" width="18" height="' + (h - 1) + '" rx="2" fill="' + color + '" stroke="' + INK + '" stroke-width="1.5"/>';
    return out;
  }
  function towerName(id) { var n = +id.split('-')[1]; return 'a tower of ' + n + (n === 1 ? ' block' : ' blocks'); }
  function nextName(id) { return /^tower-/.test(id) ? towerName(id) : symName(id); }
  function nextIcon(id) { return /^tower-/.test(id) ? tower(+id.split('-')[1], 32, 61, COLORS.orange, 8) : sym(id, 32, 32, 22); }
  function nextScene(q, withAns, movie) {
    var out = '', w = 38;
    if (q.kind === 'grow') {
      var base = 96, n = q.heights.length;
      q.heights.forEach(function (h, i) {
        out += '<g' + (movie ? at(0.2 + i * 0.7) : '') + '>' + tower(h, 24 + i * w, base, COLORS.orange) + '<text x="' + (24 + i * w) + '" y="' + (base + 16) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + INK + '">' + h + '</text></g>';
      });
      var last = 24 + n * w, a = +q.ans.split('-')[1];
      out += withAns ? '<g' + (movie ? ' class="mv-in" style="animation-delay:' + (0.4 + n * 0.7).toFixed(2) + 's"' : '') + '>' + tower(a, last, base, COLORS.green) + '<text x="' + last + '" y="' + (base + 16) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1b7a3d">' + a + '</text></g>'
        : '<rect x="' + (last - 14) + '" y="' + (base - 34) + '" width="28" height="34" rx="5" fill="#fff" stroke="' + INK + '" stroke-dasharray="4 3" stroke-width="2"/><text x="' + last + '" y="' + (base - 11) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + INK + '">?</text>';
      return { svg: out, vb: '0 0 ' + (last + 24) + ' 118', label: 'Towers of blocks, growing: ' + q.heights.join(', ') + (withAns ? ', then ' + a + '.' : ', then a question mark.') };
    }
    var len = UNITS[q.unit].length, x0 = 22;
    if (movie) {
      // A box around each time the pattern repeats.
      for (var r = 0; r + len <= q.seq.length; r += len) {
        out += '<rect x="' + (x0 + r * w - 17) + '" y="6" width="' + (len * w - 4) + '" height="44" rx="10" fill="#e6f6ea" stroke="#1b7a3d" stroke-width="1.5"' + at(0.3 + (r / len) * 0.8) + '/>';
      }
    }
    q.seq.forEach(function (s, i) { out += sym(s, x0 + i * w, 28, 15); });
    var x = x0 + q.seq.length * w;
    out += withAns ? '<g' + (movie ? ' class="mv-pulse" style="animation-delay:' + (0.6 + q.seq.length / len * 0.8).toFixed(2) + 's"' : '') + '>' + sym(q.ans, x, 28, 15) + '</g>'
      : '<rect x="' + (x - 16) + '" y="12" width="32" height="32" rx="6" fill="#fff" stroke="' + INK + '" stroke-dasharray="4 3" stroke-width="2"/><text x="' + x + '" y="35" text-anchor="middle" font-size="20" font-weight="800" fill="' + INK + '">?</text>';
    return { svg: out, vb: '0 0 ' + (x + 22) + ' 58', label: 'The pattern: ' + q.seq.map(symName).join(', ') + (withAns ? ', then ' + symName(q.ans) + '.' : ', then a question mark.') };
  }
  function nextWords(q) {
    if (q.kind === 'grow') return 'Each tower has one more block than the one before: ' + q.heights.join(', ') + '. So next comes ' + q.ans.split('-')[1] + '.';
    var len = UNITS[q.unit].length, part = q.seq.slice(0, len).map(symName);
    return 'Say the pattern out loud. This part repeats: ' + part.join(', ') + '. Then it starts again. So next comes the ' + symName(q.ans) + '.';
  }
  function next(area, ctx) {
    var q = makeNext(level(age()), ctx.round());
    ctx.set({ game: 'next', q: q, ans: q.ans, right: [q.ans], choices: q.choices });
    ctx.ask(area, q.kind === 'grow' ? 'The towers grow. Which tower comes next?' : 'What comes next in the pattern?');
    var sc = nextScene(q, false, false);
    area.appendChild(el('div', { 'class': 'scene', id: 'pattern' })).appendChild(svgEl(sc.svg, sc.vb, sc.label));
    area.appendChild(ctx.tiles(q.choices, function (id) { return svgEl(nextIcon(id), '0 0 64 64'); }, function (id, b) {
      if (id === q.ans) { b.classList.add('right'); ctx.win('Yes! ' + nextWords(q)); return; }
      ctx.miss(b, 'You tapped ' + the(nextName(id)) + '. ' + (q.kind === 'grow' ? 'Count the blocks in each tower.' : 'Say the pattern out loud, then try again.'), function (box) {
        var o = makeNext(level(age()), ctx.round(), q.unit);
        box.appendChild(el('p', {}, 'You tapped ' + the(nextName(id)) + '. Here is another pattern like this one.'));
        box.appendChild(ctx.moviePanel(function () { return nextScene(o, true, true); }));
        box.appendChild(el('p', { id: 'lesson-say' }, nextWords(o)));
      });
      refocus();
    }, nextName));
  }

  /* ---------- 3. Odd one out ---------- */
  var KINDS = {
    animals: { all: ['cat', 'dog', 'pig', 'fish', 'frog', 'cow', 'duck', 'bee', 'goat', 'octopus'], one: 'an animal', many: 'animals' },
    food: { all: ['apple', 'banana', 'carrot', 'egg', 'bun'], one: 'something to eat', many: 'things to eat' },
    vehicles: { all: ['bus', 'car', 'boat', 'ship', 'truck', 'rocket'], one: 'something that goes', many: 'things that go' }
  };
  var ODD_LEVELS = [['colorshape', 'kind'], ['kind', 'shape', 'colorshape', 'number'], ['kind', 'shape', 'number']];
  var SPOTS = { 1: [[32, 32]], 2: [[20, 20], [44, 44]], 3: [[16, 16], [32, 32], [48, 48]], 4: [[20, 20], [44, 20], [20, 44], [44, 44]], 5: [[18, 18], [46, 18], [32, 32], [18, 46], [46, 46]], 6: [[20, 14], [44, 14], [20, 32], [44, 32], [20, 50], [44, 50]] };
  function group(k, color, n) { var r = n <= 4 ? 9 : 7; return SPOTS[n].map(function (p) { return shape(k, p[0], p[1], r, COLORS[color]); }).join(''); }
  function groupName(k, color, n) { return n + ' ' + color + ' ' + (n === 1 ? k : PLURAL[k]); }
  function makeOdd(lv, round, mode) {
    var list = ODD_LEVELS[lv];
    mode = mode || list[round % list.length];
    var items = [], odd, reason;
    if (mode === 'kind') {
      var cats = pick(Object.keys(KINDS), 2), same = pick(KINDS[cats[0]].all.filter(function (k) { return PICS[k]; }), 3), o = pick(KINDS[cats[1]].all.filter(function (k) { return PICS[k]; }), 1)[0];
      same.forEach(function (k) { items.push({ id: k, name: k, art: PICS[k], f: { kind: cats[0] } }); });
      odd = { id: o, name: o, art: PICS[o], f: { kind: cats[1] } };
      reason = cap(the(o)) + ' is not ' + KINDS[cats[0]].one + '. ' + cap(list3(same.map(the))) + ' are all ' + KINDS[cats[0]].many + '.';
    } else if (mode === 'shape') {
      var sh = pick(SHAPES, 2), co = pick(CNAMES, 4);
      for (var i = 0; i < 3; i++) items.push({ id: co[i] + '-' + sh[0], name: co[i] + ' ' + sh[0], art: shape(sh[0], 32, 32, 22, COLORS[co[i]]), f: { shape: sh[0], color: co[i], count: 1 } });
      odd = { id: co[3] + '-' + sh[1], name: co[3] + ' ' + sh[1], art: shape(sh[1], 32, 32, 22, COLORS[co[3]]), f: { shape: sh[1], color: co[3], count: 1 } };
      reason = 'The others are all ' + PLURAL[sh[0]] + '. This one is a ' + sh[1] + '.';
    } else if (mode === 'colorshape') {
      var s2 = pick(SHAPES, 2), c2 = pick(CNAMES, 2);
      for (var j = 0; j < 3; j++) items.push({ id: c2[0] + '-' + s2[0] + '-' + (j + 1), name: c2[0] + ' ' + s2[0], art: shape(s2[0], 32, 32, 22, COLORS[c2[0]]), f: { shape: s2[0], color: c2[0], count: 1 } });
      odd = { id: c2[1] + '-' + s2[1], name: c2[1] + ' ' + s2[1], art: shape(s2[1], 32, 32, 22, COLORS[c2[1]]), f: { shape: s2[1], color: c2[1], count: 1 } };
      reason = 'The others are all ' + c2[0] + ' ' + PLURAL[s2[0]] + '. This one is a ' + c2[1] + ' ' + s2[1] + '.';
    } else {
      // Number: at level 1 everything else is the same; at level 2 every card has a different shape and color.
      var n = lv < 2 ? between(1, 3) : between(2, 5), m = n === 1 ? 2 : rnd(2) ? n + 1 : n - 1;
      var shs = lv < 2 ? [0, 0, 0, 0].map(function () { return null; }) : pick(SHAPES, 4), cos = lv < 2 ? [] : pick(CNAMES, 4);
      var one = { s: pick(SHAPES, 1)[0], c: pick(CNAMES, 1)[0] };
      for (var t = 0; t < 4; t++) {
        var s3 = shs[t] || one.s, c3 = cos[t] || one.c, cnt = t < 3 ? n : m;
        var it = { id: cnt + '-' + c3 + '-' + s3 + (lv < 2 && t < 3 ? '-' + (t + 1) : ''), name: groupName(s3, c3, cnt), art: group(s3, c3, cnt), f: { shape: s3, color: c3, count: cnt } };
        if (t < 3) items.push(it); else odd = it;
      }
      reason = 'The others have ' + n + ' each. This one has ' + m + '.';
    }
    var all = shuffle(items.concat([odd]));
    return { mode: mode, items: all.map(function (x) { return { id: x.id, name: x.name, f: x.f }; }), art: all.reduce(function (o, x) { o[x.id] = x.art; return o; }, {}), ans: odd.id, reason: reason };
  }
  function oddMovie(q) {
    var out = '';
    q.items.forEach(function (it, i) {
      out += '<g' + at(0.2 + i * 0.5) + '><svg x="' + (8 + i * 78) + '" y="8" width="64" height="64" viewBox="0 0 64 64">' + q.art[it.id] + '</svg></g>';
      if (it.id === q.ans) out += '<circle cx="' + (40 + i * 78) + '" cy="40" r="37" fill="none" stroke="#C2410C" stroke-width="4"' + at(2.6) + '/>';
    });
    var oddIt = q.items.filter(function (it) { return it.id === q.ans; })[0];
    return { svg: out, vb: '0 0 320 82', label: 'Four pictures: ' + q.items.map(function (it) { return it.name; }).join(', ') + '. A ring goes around the odd one out: ' + oddIt.name + '.' };
  }
  function odd(area, ctx) {
    var q = makeOdd(level(age()), ctx.round());
    var byId = {}; q.items.forEach(function (it) { byId[it.id] = it; });
    ctx.set({ game: 'odd', q: { mode: q.mode, items: q.items, ans: q.ans }, ans: q.ans, right: [q.ans], choices: q.items.map(function (it) { return it.id; }) });
    ctx.ask(area, 'Which one does not belong?');
    area.appendChild(ctx.tiles(q.items.map(function (it) { return it.id; }), function (id) { return svgEl(q.art[id], '0 0 64 64'); }, function (id, b) {
      if (id === q.ans) { b.classList.add('right'); ctx.win('Yes! ' + q.reason); return; }
      ctx.miss(b, 'You tapped ' + the(byId[id].name) + '. It goes with some of the others. Look for the one that is not like the rest.', function (box) {
        var o = makeOdd(level(age()), ctx.round(), q.mode);
        box.appendChild(el('p', {}, 'You tapped ' + the(byId[id].name) + '. Here is another one to look at.'));
        box.appendChild(ctx.moviePanel(function () { return oddMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'Find what three of them share. ' + o.reason));
      });
      refocus();
    }, function (id) { return byId[id].name; }, 'tiles two'));
  }

  /* ---------- 4. Shape puzzles ---------- */
  var HOLES = ['circle', 'square', 'triangle', 'star', 'heart'];
  // Block shapes, each named once whatever way it is turned or flipped.
  var POLY = {
    I3: [[0, 0], [1, 0], [2, 0]], L3: [[0, 0], [0, 1], [1, 1]],
    I4: [[0, 0], [1, 0], [2, 0], [3, 0]], O4: [[0, 0], [1, 0], [0, 1], [1, 1]], T4: [[0, 0], [1, 0], [2, 0], [1, 1]], S4: [[1, 0], [2, 0], [0, 1], [1, 1]], L4: [[0, 0], [0, 1], [0, 2], [1, 2]],
    F5: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], P5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], N5: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], Y5: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
    L5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], T5: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]], U5: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]], V5: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
    W5: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], Z5: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]]
  };
  var CHIRAL = ['L4', 'F5', 'P5', 'N5', 'Y5', 'L5'];
  function norm(cells) {
    var mx = Math.min.apply(null, cells.map(function (c) { return c[0]; })), my = Math.min.apply(null, cells.map(function (c) { return c[1]; }));
    return cells.map(function (c) { return [c[0] - mx, c[1] - my]; }).sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; });
  }
  function key(cells) { return norm(cells).map(function (c) { return c.join(','); }).join(' '); }
  function turn(cells, q) { var c = cells; for (var i = 0; i < q; i++) c = c.map(function (p) { return [-p[1], p[0]]; }); return norm(c); }
  function flip(cells) { return norm(cells.map(function (p) { return [-p[0], p[1]]; })); }
  function size(cells) { var n = norm(cells); return [1 + Math.max.apply(null, n.map(function (c) { return c[0]; })), 1 + Math.max.apply(null, n.map(function (c) { return c[1]; }))]; }
  function anyWay(name) { return turn(rnd(2) ? flip(POLY[name]) : POLY[name], rnd(4)); }
  var SHAPE_LEVELS = [['hole'], ['hole', 'gap'], ['turn', 'gapturn']];
  function makeShapes(lv, round, mode) {
    var list = SHAPE_LEVELS[lv];
    mode = mode || list[round % list.length];
    if (mode === 'hole') {
      var hs = pick(HOLES, 3);
      return { mode: 'hole', hole: hs[0], ans: hs[0], choices: shuffle(hs) };
    }
    if (mode === 'turn') {
      var nm = CHIRAL[rnd(CHIRAL.length)], orig = turn(POLY[nm], rnd(4)), qs = shuffle([1, 2, 3]), mir = flip(orig), ws = shuffle([0, 1, 2, 3]);
      var right = { id: 'a', cells: turn(orig, qs[0]) }, w1 = { id: 'b', cells: turn(mir, ws[0]) }, w2 = { id: 'c', cells: turn(mir, ws[1]) };
      var ch = shuffle([right, w1, w2]); ch.forEach(function (c, i) { c.id = 'p' + (i + 1); });
      return { mode: 'turn', shape: orig, ans: right.id, choices: ch };
    }
    // A gap in a wall of blocks, and pieces to fill it. Wrong pieces are other shapes, so they never fit, even turned or flipped.
    var turned = mode === 'gapturn', names = turned ? ['L4', 'T4', 'S4', 'I4', 'F5', 'P5', 'N5', 'Y5', 'L5', 'T5', 'U5', 'V5', 'W5', 'Z5'] : ['I3', 'L3', 'O4', 'T4', 'S4', 'L4', 'I4'];
    var W = turned ? 5 : 4, H = turned ? 4 : 3, gname, cells, wh;
    do { gname = names[rnd(names.length)]; cells = anyWay(gname); wh = size(cells); } while (wh[0] > W || wh[1] > H);
    var ox = rnd(W - wh[0] + 1), oy = rnd(H - wh[1] + 1), gap = cells.map(function (c) { return [c[0] + ox, c[1] + oy]; });
    var piece = cells;
    if (turned) { var opts = [1, 2, 3].filter(function (t) { return key(turn(cells, t)) !== key(cells); }); piece = turn(cells, opts[rnd(opts.length)]); }
    var n = cells.length, sameSize = names.filter(function (x) { return x !== gname && POLY[x].length === n; }), wrong = pick(sameSize, 2);
    if (wrong.length < 2) wrong = wrong.concat(pick(names.filter(function (x) { return x !== gname && wrong.indexOf(x) < 0 && POLY[x].length !== n; }), 2 - wrong.length));
    var ch2 = shuffle([{ cells: piece, right: true }].concat(wrong.map(function (x) { return { cells: anyWay(x) }; })));
    var ansId = '';
    ch2.forEach(function (c, i) { c.id = 'p' + (i + 1); if (c.right) ansId = c.id; delete c.right; });
    return { mode: mode, grid: [W, H], gap: gap, ans: ansId, choices: ch2 };
  }
  function cellsArt(cells, x, y, s, fill) {
    return cells.map(function (c) { return '<rect x="' + (x + c[0] * s) + '" y="' + (y + c[1] * s) + '" width="' + s + '" height="' + s + '" rx="2" fill="' + fill + '" stroke="' + INK + '" stroke-width="1.5"/>'; }).join('');
  }
  function pieceIcon(cells, fill) { var wh = size(cells), s = Math.min(13, Math.floor(56 / Math.max(wh[0], wh[1]))); return cellsArt(norm(cells), 32 - wh[0] * s / 2, 32 - wh[1] * s / 2, s, fill); }
  function cellsWords(cells) { var n = cells.length; return n + ' blocks'; }
  function holeScene(q, movie) {
    var out = '<rect x="30" y="10" width="140" height="100" rx="12" fill="#c9965a" stroke="' + INK + '" stroke-width="2"/>' + shape(q.hole, 100, 60, 32, '#4a3b2a');
    if (movie) out += '<g class="mv-slide" style="--dx:110px;animation-delay:.6s">' + shape(q.hole, 100, 60, 31, COLORS.orange) + '</g>';
    return { svg: out, vb: '0 0 200 120', label: 'A board with a hole shaped like a ' + q.hole + (movie ? '. A ' + q.hole + ' piece slides into it and fits.' : '.') };
  }
  function gapScene(q, movie) {
    var s = 22, W = q.grid[0], H = q.grid[1], out = '', isGap = {};
    q.gap.forEach(function (c) { isGap[c.join(',')] = true; });
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      out += isGap[x + ',' + y] ? '<rect x="' + (10 + x * s) + '" y="' + (10 + y * s) + '" width="' + s + '" height="' + s + '" fill="#fff" stroke="#8aa49b" stroke-dasharray="3 2" stroke-width="1.5"/>'
        : '<rect x="' + (10 + x * s) + '" y="' + (10 + y * s) + '" width="' + s + '" height="' + s + '" rx="2" fill="#9fd8c9" stroke="' + INK + '" stroke-width="1.5"/>';
    }
    if (movie) out += '<g class="mv-slide" style="--dx:' + (W * s + 30) + 'px;animation-delay:.6s">' + cellsArt(q.gap, 10, 10, s, COLORS.orange) + '</g>';
    var w = W * s + 20;
    return { svg: out, vb: '0 0 ' + (movie ? w + W * s + 20 : w) + ' ' + (H * s + 20), label: 'A wall of blocks with a gap ' + q.gap.length + ' blocks big' + (movie ? '. A piece the same shape slides in and fills it.' : '.') };
  }
  function turnScene(q, movie) {
    var out = '<g' + (movie ? at(0.2) : '') + '><svg x="4" y="4" width="64" height="64" viewBox="0 0 64 64">' + pieceIcon(q.shape, COLORS.blue) + '</svg></g>', label = 'A shape made of ' + cellsWords(q.shape) + '.';
    if (movie) {
      [1, 2, 3].forEach(function (t, i) { out += '<g' + at(0.9 + i * 0.8) + '><svg x="' + (84 + i * 58) + '" y="8" width="56" height="56" viewBox="0 0 64 64">' + pieceIcon(turn(q.shape, t), COLORS.blue) + '</svg></g>'; });
      out += '<text x="141" y="82" text-anchor="middle" font-size="13" font-weight="700" fill="#1b7a3d"' + at(3.2) + '>turned: the same</text>';
      out += '<g' + at(3.8) + '><svg x="262" y="8" width="56" height="56" viewBox="0 0 64 64">' + pieceIcon(flip(q.shape), COLORS.purple) + '</svg><text x="290" y="82" text-anchor="middle" font-size="13" font-weight="700" fill="#7a5a00">flipped</text></g>';
      label = 'A blue shape, then the same shape turned three times: still the same shape. Last, the shape flipped like in a mirror: that is not the same, however you turn it.';
    }
    return { svg: out, vb: movie ? '0 0 320 92' : '0 0 72 72', label: label };
  }
  function shapesWords(q) {
    if (q.mode === 'hole') return 'Look at the shape of the hole. It is a ' + q.hole + '. Only a ' + q.hole + ' piece fits it.';
    if (q.mode === 'turn') return 'Turn the shape in your head, like turning a page around on the table. A turned shape is still the same shape. A flipped one, like in a mirror, is not.';
    return 'Count the empty squares and look at how they join. The piece must have the same number of blocks, in the same shape.' + (q.mode === 'gapturn' ? ' You may need to turn it.' : '');
  }
  function shapesMovie(q) { return q.mode === 'hole' ? holeScene(q, true) : q.mode === 'turn' ? turnScene(q, true) : gapScene(q, true); }
  function shapes(area, ctx) {
    var q = makeShapes(level(age()), ctx.round()), byId = {};
    (q.mode === 'hole' ? [] : q.choices).forEach(function (c) { byId[c.id] = c; });
    ctx.set({ game: 'shapes', q: q, ans: q.ans, right: [q.ans], choices: q.mode === 'hole' ? q.choices : q.choices.map(function (c) { return c.id; }) });
    var ask = { hole: 'Which piece fits the hole?', gap: 'Which piece fills the gap?', gapturn: 'Which piece fills the gap? You may need to turn it.', turn: 'Which one is the same shape, just turned around?' }[q.mode];
    ctx.ask(area, ask);
    var sc = q.mode === 'hole' ? holeScene(q) : q.mode === 'turn' ? turnScene(q) : gapScene(q);
    area.appendChild(el('div', { 'class': 'scene' + (q.mode === 'turn' ? ' small' : ''), id: 'puzzle' })).appendChild(svgEl(sc.svg, sc.vb, sc.label));
    function name(id) {
      if (q.mode === 'hole') return 'a ' + id + ' piece';
      var c = byId[id].cells, wh = size(c);
      return 'Piece ' + id.slice(1) + ': ' + cellsWords(c) + ', ' + wh[0] + ' wide and ' + wh[1] + ' tall';
    }
    var ids = q.mode === 'hole' ? q.choices : q.choices.map(function (c) { return c.id; });
    area.appendChild(ctx.tiles(ids, function (id) { return svgEl(q.mode === 'hole' ? shape(id, 32, 32, 22, COLORS.orange) : pieceIcon(byId[id].cells, COLORS.orange), '0 0 64 64'); }, function (id, b) {
      if (id === q.ans) {
        b.classList.add('right');
        ctx.win('Yes! ' + (q.mode === 'hole' ? 'The ' + id + ' fits the ' + id + ' hole.' : q.mode === 'turn' ? 'It is the same shape, turned around.' : 'It fills the gap exactly.'));
        return;
      }
      var why = q.mode === 'hole' ? 'You tapped the ' + id + '. The hole is a different shape.'
        : q.mode === 'turn' ? 'You tapped piece ' + id.slice(1) + '. That one is flipped over, like in a mirror. Turning it will not make it match.'
        : 'You tapped piece ' + id.slice(1) + '. ' + (byId[id].cells.length !== q.gap.length ? 'It has ' + byId[id].cells.length + ' blocks, and the gap needs ' + q.gap.length + '.' : 'It has the right number of blocks, but a different shape.');
      ctx.miss(b, why + ' Try again.', function (box) {
        var o = makeShapes(level(age()), ctx.round(), q.mode);
        box.appendChild(el('p', {}, why));
        box.appendChild(ctx.moviePanel(function () { return shapesMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, shapesWords(o)));
      });
      refocus();
    }, name));
  }

  /* ---------- 5. Look closely ---------- */
  var LOOKS = {
    ladybug: { name: function (v) { return 'ladybug with ' + (v ? v + (v === 1 ? ' spot' : ' spots') : 'no spots'); }, pair: [[4, 0], [4, 2], [4, 3]],
      art: function (v) {
        var sp = [[24, 32], [40, 32], [22, 44], [42, 44], [28, 54], [36, 54]].slice(0, v).map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.6" fill="' + INK + '"/>'; }).join('');
        return '<circle cx="32" cy="16" r="9" fill="' + INK + '"/><circle cx="32" cy="40" r="21" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M32 20v41" stroke="' + INK + '" stroke-width="2"/>' + sp;
      } },
    face: { name: function (v) { return v ? 'smiling face' : 'face that is not smiling'; }, pair: [[1, 0], [1, 0], [1, 0]],
      art: function (v) { return '<circle cx="32" cy="32" r="24" fill="#f7c948" stroke="' + INK + '" stroke-width="2"/><circle cx="24" cy="27" r="3" fill="' + INK + '"/><circle cx="40" cy="27" r="3" fill="' + INK + '"/>' + (v ? '<path d="M21 38q11 11 22 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' : '<path d="M22 42h20" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>'); } },
    house: { name: function (v) { return v ? 'house with a door' : 'house with no door'; }, pair: [[1, 0], [1, 0], [1, 0]],
      art: function (v) { return '<rect x="14" y="30" width="36" height="28" fill="#f3dcc0" stroke="' + INK + '" stroke-width="2"/><polygon points="9,32 32,10 55,32" fill="#d6453d" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><rect x="19" y="36" width="10" height="10" fill="#9fd8ef" stroke="' + INK + '" stroke-width="1.5"/>' + (v ? '<rect x="35" y="40" width="10" height="18" fill="#8a5a33" stroke="' + INK + '" stroke-width="1.5"/>' : ''); } },
    fish: { name: function (v) { return v ? 'fish facing right' : 'fish facing left'; }, pair: [[0, 1], [0, 1], [0, 1]],
      art: function (v) { var f = '<polygon points="44,32 58,20 58,44" fill="#e8812a" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><ellipse cx="28" cy="32" rx="19" ry="12" fill="#f2a65a" stroke="' + INK + '" stroke-width="2"/><circle cx="18" cy="29" r="2.8" fill="' + INK + '"/><path d="M30 22q4 10 0 20" fill="none" stroke="' + INK + '" stroke-width="1.5"/>'; return v ? '<g transform="translate(64 0) scale(-1 1)">' + f + '</g>' : f; } },
    flower: { name: function (v) { return 'flower with ' + v + ' petals'; }, pair: [[6, 3], [6, 4], [6, 5]],
      art: function (v) {
        var p = '';
        for (var i = 0; i < v; i++) { var a = (i * 360 / v - 90) * Math.PI / 180; p += '<circle cx="' + f1(32 + 11 * Math.cos(a)) + '" cy="' + f1(25 + 11 * Math.sin(a)) + '" r="7" fill="#f08fb8" stroke="' + INK + '" stroke-width="1.5"/>'; }
        return '<path d="M32 36v26" stroke="#3f9d4a" stroke-width="3"/>' + p + '<circle cx="32" cy="25" r="6" fill="#f7c948" stroke="' + INK + '" stroke-width="1.5"/>';
      } }
  };
  var LOOK_COUNT = [4, 6, 9];
  var STAR_LEVELS = [{ stars: [1, 4], others: 3, cols: 4, rows: 2 }, { stars: [2, 6], others: 5, cols: 5, rows: 3 }, { stars: [4, 9], others: 8, cols: 6, rows: 3 }];
  function makeLook(lv, round, mode) {
    mode = mode || (round % 2 ? 'stars' : 'diff');
    if (mode === 'diff') {
      var types = Object.keys(LOOKS), t = types[rnd(types.length)], L = LOOKS[t], pr = L.pair[lv], n = LOOK_COUNT[lv], at2 = rnd(n), items = [];
      if (t === 'fish' && rnd(2)) pr = [pr[1], pr[0]];
      for (var i = 0; i < n; i++) { var v = i === at2 ? pr[1] : pr[0]; items.push({ id: String(i + 1), v: v, name: L.name(v) }); }
      return { mode: 'diff', type: t, items: items, ans: String(at2 + 1), same: L.name(pr[0]), odd: L.name(pr[1]) };
    }
    var cfg = STAR_LEVELS[lv], k = between(cfg.stars[0], cfg.stars[1]), cells = shuffle(Array.apply(null, Array(cfg.cols * cfg.rows)).map(function (x, j) { return j; }));
    var others = ['circle', 'triangle', 'heart', 'square', 'diamond'], list = [];
    for (var s = 0; s < k + cfg.others; s++) {
      var c = cells[s], kind = s < k ? 'star' : others[rnd(others.length)];
      list.push({ kind: kind, color: CNAMES[rnd(CNAMES.length)], col: c % cfg.cols, row: Math.floor(c / cfg.cols), dx: rnd(9) - 4, dy: rnd(9) - 4 });
    }
    list.sort(function (a, b) { return a.row - b.row || a.col - b.col; });
    var opts = shuffle([k - 2, k - 1, k + 1, k + 2].filter(function (x) { return x >= 1; })).slice(0, 2).concat([k]).sort(function (a, b) { return a - b; });
    return { mode: 'stars', cols: cfg.cols, rows: cfg.rows, shapes: list, ans: String(k), choices: opts.map(String) };
  }
  function starScene(q, movie) {
    var out = '', n = 0;
    q.shapes.forEach(function (s) {
      var x = 26 + s.col * 46 + s.dx, y = 26 + s.row * 46 + s.dy;
      out += shape(s.kind, x, y, 16, COLORS[s.color]);
      if (movie && s.kind === 'star') { n++; out += '<g' + at(0.4 + n * 0.6) + '><circle cx="' + x + '" cy="' + (y - 20) + '" r="9" fill="#fff" stroke="#1b7a3d" stroke-width="2"/><text x="' + x + '" y="' + (y - 15) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1b7a3d">' + n + '</text></g>'; }
    });
    var label = 'Shapes in rows: ' + q.shapes.map(function (s) { return s.color + ' ' + s.kind; }).join(', ') + '.';
    if (movie) label = 'The same kind of picture. A number appears on each star in turn: 1 to ' + q.ans + '. There are ' + q.ans + ' stars.';
    return { svg: out, vb: '0 -12 ' + (q.cols * 46 + 6) + ' ' + (q.rows * 46 + 18), label: label };
  }
  function diffScene(q, movie) {
    var L = LOOKS[q.type], per = Math.min(q.items.length, 5), out = '', idx = +q.ans - 1;
    q.items.forEach(function (it, i) {
      var x = 6 + (i % per) * 62, y = 6 + Math.floor(i / per) * 62;
      out += '<svg x="' + x + '" y="' + y + '" width="56" height="56" viewBox="0 0 64 64">' + L.art(it.v) + '</svg>';
      if (movie && i === idx) out += '<circle cx="' + (x + 28) + '" cy="' + (y + 28) + '" r="30" fill="none" stroke="#C2410C" stroke-width="4"' + at(1.6) + '/>';
    });
    return { svg: out, vb: '0 0 ' + (per * 62 + 8) + ' ' + (Math.ceil(q.items.length / per) * 62 + 8), label: q.items.length + ' pictures. ' + cap(q.odd) + ' is circled. The others are each a ' + q.same + '.' };
  }
  function look(area, ctx) {
    var q = makeLook(level(age()), ctx.round());
    if (q.mode === 'stars') {
      ctx.set({ game: 'look', q: q, ans: q.ans, right: [q.ans], choices: q.choices });
      ctx.ask(area, 'How many stars can you find?', 'How many stars can you find? Only count the stars.');
      var sc = starScene(q);
      area.appendChild(el('div', { 'class': 'scene', id: 'stars' })).appendChild(svgEl(sc.svg, sc.vb, sc.label));
      area.appendChild(ctx.tiles(q.choices, function (v) { return ctx.word(v); }, function (v, b) {
        if (v === q.ans) { b.classList.add('right'); ctx.win('Yes! There are ' + q.ans + ' stars.'); return; }
        ctx.miss(b, 'You tapped ' + v + '. Count again: touch each star as you count, and skip the other shapes.', function (box) {
          var o = makeLook(level(age()), ctx.round(), 'stars');
          box.appendChild(el('p', {}, 'You tapped ' + v + '. Watch how to count the stars in this picture.'));
          box.appendChild(ctx.moviePanel(function () { return starScene(o, true); }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Go along each row, like reading. Count only the stars: 1, 2, 3 and on. Here there are ' + o.ans + ' stars.'));
        });
        refocus();
      }, function (v) { return v + (v === '1' ? ' star' : ' stars'); }));
      return;
    }
    var L = LOOKS[q.type], byId = {};
    q.items.forEach(function (it) { byId[it.id] = it; });
    ctx.set({ game: 'look', q: q, ans: q.ans, right: [q.ans], choices: q.items.map(function (it) { return it.id; }) });
    ctx.ask(area, 'One picture is different. Can you find it?');
    area.appendChild(ctx.tiles(q.items.map(function (it) { return it.id; }), function (id) { return svgEl(L.art(byId[id].v), '0 0 64 64'); }, function (id, b) {
      if (id === q.ans) { b.classList.add('right'); ctx.win('Yes! This one is a ' + q.odd + '. The others are each a ' + q.same + '.'); return; }
      ctx.miss(b, 'You tapped a ' + byId[id].name + ', like most of the others. Look again, one picture at a time.', function (box) {
        var o = makeLook(level(age()), ctx.round(), 'diff');
        box.appendChild(el('p', {}, 'You tapped a ' + byId[id].name + '. Here is another set to look at.'));
        box.appendChild(ctx.moviePanel(function () { return diffScene(o, true); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'Look at the first picture closely. Then check each of the others against it. Here, one is a ' + o.odd + ', and the others are each a ' + o.same + '.'));
      });
      refocus();
    }, function (id) { return 'Picture ' + id + ': ' + byId[id].name; }, q.items.length > 6 ? 'tiles many' : 'tiles'));
  }

  /* After a miss the tapped choice is switched off, so move to the first choice still open. */
  function refocus() { var n = document.querySelector('#choices button:not([disabled])'); if (n) n.focus(); }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'Puzzles for thinking', text: 'Here are five kinds of puzzles: find the pairs, what comes next, odd one out, shape puzzles and look closely. Take your time. There is no clock and no score. If a try does not work, we look again together.',
      movie: function () {
        var icons = [cardBack(), sym('red-circle', 18, 32, 11) + sym('blue-square', 46, 32, 11), PICS.cat ? '<svg x="4" y="4" width="56" height="56" viewBox="0 0 64 64">' + PICS.cat + '</svg>' : '', pieceIcon(POLY.T4, COLORS.orange), shape('star', 32, 32, 22, COLORS.yellow)];
        var out = '';
        icons.forEach(function (ic, i) { out += '<g' + at(0.2 + i * 0.6) + '><svg x="' + (4 + i * 63) + '" y="6" width="56" height="56" viewBox="0 0 64 64">' + ic + '</svg></g>'; });
        return { svg: out, vb: '0 0 320 68', label: 'Five little pictures appear, one for each kind of puzzle: a card, a pattern, a cat, a puzzle piece and a star.' };
      } },
    { title: 'Find the pairs', text: 'Turn over two cards. If the pictures are the same, you found a pair, and they stay face up. If not, they turn back over. Try to remember where each picture is.',
      movie: function () { return memoryMovie('cat', 'dog'); } },
    { title: 'What comes next', text: 'A pattern repeats. Say it out loud: red circle, blue square, red circle, blue square. Then it starts again, so next comes the red circle.',
      movie: function () { return nextScene({ kind: 'repeat', unit: 'AB', seq: ['red-circle', 'blue-square', 'red-circle', 'blue-square'], ans: 'red-circle' }, true, true); } },
    { title: 'Odd one out', text: 'Three things go together and one does not. The cat, the dog and the cow are all animals. The bus is not an animal, so the bus is the odd one out.',
      movie: function () {
        var it = ['cat', 'dog', 'bus', 'cow'].map(function (k) { return { id: k, name: k }; });
        return oddMovie({ items: it, ans: 'bus', art: { cat: PICS.cat, dog: PICS.dog, bus: PICS.bus, cow: PICS.cow } });
      } },
    { title: 'Shape puzzles', text: 'Look at the shape of the gap, then find the piece that fits it. A shape that is turned around is still the same shape. A shape flipped like in a mirror is not.',
      movie: function () {
        var h = holeScene({ hole: 'star' }, true), t = turnScene({ shape: POLY.L4 }, true);
        return { svg: '<svg x="0" y="0" width="120" height="72" viewBox="0 0 200 120">' + h.svg + '</svg><svg x="0" y="76" width="320" height="92" viewBox="0 0 320 92">' + t.svg + '</svg>', vb: '0 0 320 170', label: h.label + ' ' + t.label };
      } },
    { title: 'Look closely', text: 'Look slowly, one picture at a time. Here one ladybug has fewer spots than the others. To count stars, go along each row and count only the stars.',
      movie: function () {
        var items = [4, 4, 3, 4].map(function (v, i) { return { id: String(i + 1), v: v, name: LOOKS.ladybug.name(v) }; });
        return diffScene({ type: 'ladybug', items: items, ans: '3', odd: 'ladybug with 3 spots', same: 'ladybug with 4 spots' }, true);
      } }
  ];

  /* ---------- how the games fit the age ---------- */
  function $(id) { return document.getElementById(id); }
  function showLevel() {
    var a = age(), note = $('level-note');
    if (!note) return;
    var t = a ? 'Set for age ' + a + ', from your child\'s profile. Find the pairs uses ' + pairs(a) + ' pairs.'
      : 'No age picked, so the puzzles are set in the middle, for about ages 5 and 6. A grown-up can pick an age on the Yaanstep Sprouts page.';
    if (note.textContent !== t) note.textContent = t;
  }

  // Each round starts with the question in focus, so it is read first and Tab goes on to the answers.
  function focusPrompt(fn) {
    return function (area, ctx) {
      fn(area, ctx);
      var p = $('prompt');
      if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
      showLevel();
    };
  }

  S.run({
    area: 'world',
    names: { learn: 'Learn the puzzles', memory: 'Find the pairs', next: 'What comes next?', odd: 'Odd one out', shapes: 'Shape puzzles', look: 'Look closely' },
    // Rounds per game, for a shell that reads it: a memory board takes longer than one question.
    rounds: { memory: 3 },
    // Every picture is needed to see which one is different, so Fewer choices leaves these two alone.
    allChoices: { odd: true, look: true },
    learn: LEARN,
    games: { memory: focusPrompt(memory), next: focusPrompt(next), odd: focusPrompt(odd), shapes: focusPrompt(shapes), look: focusPrompt(look) },
    init: function () {
      showLevel();
      document.addEventListener('click', showLevel);
      window.addEventListener('storage', showLevel);
    }
  });
  // Test hook, read only: the question makers and the shape helpers the games use.
  window.YS_BRAIN = {
    age: age, level: level, pairs: pairs,
    make: { memory: makeMemory, next: makeNext, odd: makeOdd, shapes: makeShapes, look: makeLook },
    units: UNITS, poly: POLY, norm: norm, turn: turn, flip: flip
  };
})();
