/* Yaanstep maths: bar models (SCRUM-488). Word problems the child can see.
   The problems are our own, made fresh each time from the templates below, using the bar model method
   that many schools teach: read, find who and what, draw a bar for each, change the bars one sentence at a time,
   place the question mark, work it out, answer in a full sentence.
   Plain script, no build step. Nothing is stored or sent. No timers. Everything waits for a tap. */
(function () {
  'use strict';

  /* ---------- small helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var NAMES = ['Mia', 'Leo', 'Ava', 'Sam', 'Noor', 'Kai', 'Zoe', 'Ben', 'Ivy', 'Raj', 'Lily', 'Omar'];
  var THINGS = ['shells', 'stickers', 'marbles', 'books', 'apples', 'crayons', 'stamps', 'cards'];
  var BAGS = ['balloons', 'beads', 'blocks'];
  function names(n) { return shuffle(NAMES).slice(0, n); }

  /* ---------- the problems: one function per kind ----------
     Each returns: sentences (the last one asks the question), who, what, rows of bars, marks (labels and
     the question mark), the steps to work it out, and the answer sentence.
     "show" says when a part of the picture appears: a sentence number (0 = first sentence),
     "q" once the question mark is placed, or "c0", "c1"... once that step is worked out. */

  function calc(a, op, b, ans, say, hint) {
    return { a: a, op: op, b: b, ans: ans, say: say, hint: hint || '' };
  }

  var KINDS = {
    // Two parts make a whole: how many altogether?
    join: function (big) {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var a = big ? rnd(12, 60) : rnd(2, 9), b = big ? rnd(12, 39) : rnd(2, 9), t = a + b;
      return {
        kind: 'join',
        sentences: [A + ' has ' + a + ' ' + T + '.', B + ' has ' + b + ' ' + T + '.', 'How many ' + T + ' do they have altogether?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: [{ v: a }] }, { name: B, show: 1, segs: [{ v: b }] }],
        marks: [{ type: 'top', row: 0, from: 0, to: 0, text: a, show: 0 }, { type: 'top', row: 1, from: 0, to: 0, text: b, show: 1 }],
        q: { type: 'brace', from: 0, to: 1 },
        options: [['total', 'Next to both bars, for the total'], ['a', 'Over all of ' + A + "'s bar"], ['b', 'Over all of ' + B + "'s bar"]],
        right: 'total',
        calcs: [calc(a, '+', b, t, A + ' and ' + B + ' have ' + t + ' ' + T + ' altogether.')],
        wrong: A + ' and ' + B + ' have ' + Math.max(a, b) + ' ' + T + ' altogether.'
      };
    },
    // A whole and one part: find the part that is left.
    rest: function (big) {
      var T = pick(BAGS);
      var t = big ? rnd(30, 99) : rnd(8, 20), a = big ? rnd(10, t - 10) : rnd(2, t - 2), r = t - a;
      return {
        kind: 'rest',
        sentences: ['There are ' + t + ' ' + T + ' in a bag.', a + ' of them are red.', 'The rest are blue.', 'How many ' + T + ' are blue?'],
        who: 'A bag of ' + T, what: 'red ' + T + ' and blue ' + T,
        rows: [{ name: 'Bag', show: 0, segs: [{ v: a, show: 1, fill: 'red' }, { v: r, show: 2, fill: 'blue' }] }],
        marks: [{ type: 'top', row: 0, from: 0, to: 1, text: t, show: 0, high: true }, { type: 'top', row: 0, from: 0, to: 0, text: a, show: 1 }],
        q: { type: 'top', row: 0, from: 1, to: 1 },
        options: [['blue', 'Over the blue part of the bar'], ['red', 'Over the red part of the bar'], ['whole', 'Over the whole bar']],
        right: 'blue',
        calcs: [calc(t, '−', a, r, r + ' ' + T + ' are blue.')],
        wrong: t + ' ' + T + ' are blue.'
      };
    },
    // Compare: how many does the one with more have?
    more: function () {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var a = rnd(12, 50), d = rnd(5, 30), b = a + d;
      return {
        kind: 'more',
        sentences: [A + ' has ' + a + ' ' + T + '.', B + ' has ' + d + ' more ' + T + ' than ' + A + '.', 'How many ' + T + ' does ' + B + ' have?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: [{ v: a }] }, { name: B, show: 1, segs: [{ v: a }, { v: d, fill: 'extra' }] }],
        marks: [{ type: 'top', row: 0, from: 0, to: 0, text: a, show: 0 }, { type: 'top', row: 1, from: 1, to: 1, text: d, show: 1 }],
        q: { type: 'top', row: 1, from: 0, to: 1, high: true },
        options: [['b', 'Over all of ' + B + "'s bar"], ['extra', 'Over the extra part of ' + B + "'s bar"], ['total', 'Next to both bars, for the total']],
        right: 'b',
        calcs: [calc(a, '+', d, b, B + ' has ' + b + ' ' + T + '.')],
        wrong: B + ' has ' + d + ' ' + T + '.'
      };
    },
    // Compare: how many more?
    diff: function (big) {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var b = big ? rnd(40, 300) : rnd(10, 50), d = big ? rnd(12, 99) : rnd(3, 30), a = b + d;
      return {
        kind: 'diff',
        sentences: [A + ' has ' + a + ' ' + T + '.', B + ' has ' + b + ' ' + T + '.', 'How many more ' + T + ' does ' + A + ' have than ' + B + '?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: [{ v: b, show: 1 }, { v: d, show: 1, fill: 'extra' }] }, { name: B, show: 1, segs: [{ v: b }] }],
        marks: [{ type: 'top', row: 0, from: 0, to: 1, text: a, show: 0, high: true }, { type: 'top', row: 1, from: 0, to: 0, text: b, show: 1 }],
        q: { type: 'top', row: 0, from: 1, to: 1 },
        options: [['extra', 'Over the extra part of ' + A + "'s bar"], ['a', 'Over all of ' + A + "'s bar"], ['total', 'Next to both bars, for the total']],
        right: 'extra',
        calcs: [calc(a, '−', b, d, A + ' has ' + d + ' more ' + T + ' than ' + B + '.')],
        wrong: A + ' has ' + (a + b) + ' more ' + T + ' than ' + B + '.'
      };
    },
    // Times as many.
    times: function (big) {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var a = big ? rnd(12, 60) : rnd(3, 12), k = big ? rnd(3, 6) : rnd(2, 5), p = a * k;
      var segs = [];
      for (var i = 0; i < k; i++) segs.push({ v: a });
      return {
        kind: 'times',
        sentences: [A + ' has ' + a + ' ' + T + '.', B + ' has ' + k + ' times as many ' + T + ' as ' + A + '.', 'How many ' + T + ' does ' + B + ' have?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: [{ v: a }] }, { name: B, show: 1, segs: segs }],
        marks: [{ type: 'top', row: 0, from: 0, to: 0, text: a, show: 0 }],
        q: { type: 'top', row: 1, from: 0, to: k - 1, high: true },
        options: [['b', 'Over all of ' + B + "'s bar"], ['a', 'Over all of ' + A + "'s bar"], ['total', 'Next to both bars, for the total']],
        right: 'b',
        calcs: [calc(a, '×', k, p, B + ' has ' + p + ' ' + T + '.', B + "'s bar is " + k + ' units, and each unit is ' + a + '.')],
        wrong: B + ' has ' + (a + k) + ' ' + T + '.'
      };
    },
    // Fewer, then the total: two steps.
    fewerTotal: function (big) {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var a = big ? rnd(100, 400) : rnd(30, 99), d = big ? rnd(20, 90) : rnd(5, a - 10), b = a - d, t = a + b;
      return {
        kind: 'fewerTotal',
        sentences: [A + ' has ' + a + ' ' + T + '.', B + ' has ' + d + ' fewer ' + T + ' than ' + A + '.', 'How many ' + T + ' do they have altogether?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: [{ v: a }] }, { name: B, show: 1, segs: [{ v: b }, { v: d, missing: true }] }],
        marks: [
          { type: 'top', row: 0, from: 0, to: 0, text: a, show: 0 },
          { type: 'top', row: 1, from: 1, to: 1, text: d, show: 1 },
          { type: 'top', row: 1, from: 0, to: 0, text: b, show: 'c0' }
        ],
        q: { type: 'brace', from: 0, to: 1 },
        options: [['total', 'Next to both bars, for the total'], ['b', 'Over ' + B + "'s bar"], ['gap', 'Over the dotted part of ' + B + "'s bar"]],
        right: 'total',
        calcs: [
          calc(a, '−', d, b, B + ' has ' + b + ' ' + T + '.', 'First find how many ' + B + ' has.'),
          calc(a, '+', b, t, A + ' and ' + B + ' have ' + t + ' ' + T + ' altogether.', 'Now add the two bars.')
        ],
        wrong: A + ' and ' + B + ' have ' + (a + a + d) + ' ' + T + ' altogether.'
      };
    },
    // Share a total into equal units.
    share: function () {
      var n = names(2), A = n[0], B = n[1], T = pick(THINGS);
      var u = rnd(12, 80), k = rnd(2, 5), t = u * (k + 1);
      var segs = [];
      for (var i = 0; i < k; i++) segs.push({ v: u, show: 1 });
      return {
        kind: 'share',
        sentences: [A + ' and ' + B + ' have ' + t + ' ' + T + ' altogether.', A + ' has ' + k + ' times as many ' + T + ' as ' + B + '.', 'How many ' + T + ' does ' + B + ' have?'],
        who: A + ' and ' + B, what: T,
        rows: [{ name: A, show: 0, segs: segs }, { name: B, show: 0, segs: [{ v: u }] }],
        marks: [{ type: 'brace', from: 0, to: 1, text: t, show: 0 }],
        q: { type: 'top', row: 1, from: 0, to: 0 },
        options: [['b', 'Over ' + B + "'s bar"], ['a', 'Over all of ' + A + "'s bar"], ['total', 'Next to both bars, for the total']],
        right: 'b',
        calcs: [calc(t, '÷', k + 1, u, B + ' has ' + u + ' ' + T + '.', 'There are ' + (k + 1) + ' equal units in all: ' + k + ' for ' + A + ' and 1 for ' + B + '.')],
        wrong: B + ' has ' + (u * k) + ' ' + T + '.'
      };
    },
    // Three people, three steps.
    three: function () {
      var n = names(3), A = n[0], B = n[1], C = n[2], T = pick(THINGS);
      var b = rnd(30, 200), k = rnd(2, 4), x = b * k, d = rnd(15, 80), c = b + d, t = x + b + c;
      var segs = [];
      for (var i = 0; i < k; i++) segs.push({ v: b });
      return {
        kind: 'three',
        sentences: [A + ' has ' + k + ' times as many ' + T + ' as ' + B + '.', C + ' has ' + d + ' more ' + T + ' than ' + B + '.', A + ' has ' + x + ' ' + T + '.', 'How many ' + T + ' do the three of them have altogether?'],
        who: A + ', ' + B + ' and ' + C, what: T,
        rows: [{ name: A, show: 0, segs: segs }, { name: B, show: 0, segs: [{ v: b }] }, { name: C, show: 1, segs: [{ v: b }, { v: d, fill: 'extra' }] }],
        marks: [
          { type: 'top', row: 2, from: 1, to: 1, text: d, show: 1 },
          { type: 'top', row: 0, from: 0, to: k - 1, text: x, show: 2, high: true },
          { type: 'top', row: 1, from: 0, to: 0, text: b, show: 'c0' },
          { type: 'top', row: 2, from: 0, to: 1, text: c, show: 'c1', high: true }
        ],
        q: { type: 'brace', from: 0, to: 2 },
        options: [['total', 'Next to all three bars, for the total'], ['a', 'Over all of ' + A + "'s bar"], ['c', 'Over all of ' + C + "'s bar"]],
        right: 'total',
        calcs: [
          calc(x, '÷', k, b, B + ' has ' + b + ' ' + T + '.', A + "'s bar is " + k + ' units. Each unit is the same as ' + B + "'s bar."),
          calc(b, '+', d, c, C + ' has ' + c + ' ' + T + '.', 'Now find how many ' + C + ' has.'),
          calc(x + ' + ' + b, '+', c, t, 'The three of them have ' + t + ' ' + T + ' altogether.', 'Now add all three bars.')
        ],
        wrong: 'The three of them have ' + (x + b) + ' ' + T + ' altogether.'
      };
    }
  };

  var BANDS = [
    { id: '5-6', label: 'Ages 5 to 6', make: [function () { return KINDS.join(false); }, function () { return KINDS.rest(false); }] },
    { id: '7-8', label: 'Ages 7 to 8', make: [function () { return KINDS.join(true); }, function () { return KINDS.rest(true); }, function () { return KINDS.more(); }, function () { return KINDS.diff(false); }] },
    { id: '9-10', label: 'Ages 9 to 10', make: [function () { return KINDS.diff(true); }, function () { return KINDS.times(false); }, function () { return KINDS.fewerTotal(false); }] },
    { id: '11-12', label: 'Ages 11 to 12', make: [function () { return KINDS.times(true); }, function () { return KINDS.fewerTotal(true); }, function () { return KINDS.share(); }, function () { return KINDS.three(); }] }
  ];
  var SET = 5;

  function makeSet(band) {
    var out = [], order = shuffle(band.make);
    for (var i = 0; i < SET; i++) out.push(order[i % order.length]());
    return out;
  }

  /* ---------- drawing the bars ---------- */

  var X0 = 74, W = 190, H = 26, PITCH = 74, TOP = 44;
  var FILL = { base: '#F4B266', extra: '#FBE0B6', red: '#E4685D', blue: '#6C9BE0' };
  var STROKE = '#6B3E14';

  function visible(show, st, rowShow) {
    if (show == null) show = rowShow;
    if (show == null) return true;
    if (typeof show === 'number') return st.r > show;
    if (show === 'q') return st.q;
    return st.c > +show.slice(1);
  }
  function draw(p, st) {
    var max = 0;
    p.rows.forEach(function (r) { var s = 0; r.segs.forEach(function (g) { s += g.v; }); if (s > max) max = s; });
    var px = W / max;
    var hgt = TOP + (p.rows.length - 1) * PITCH + H + 8;
    var out = [], said = [];
    var xs = p.rows.map(function (r) { var x = X0, a = []; r.segs.forEach(function (g) { a.push(x); x += g.v * px; }); a.push(x); return a; });
    function rowY(i) { return TOP + i * PITCH; }
    // Before the first bar: a short box with a line of text, not a tall empty space.
    if (st.r < 0) return '<svg viewBox="0 0 340 44" role="img" aria-label="Bar model. No bars yet."><text x="170" y="27" text-anchor="middle" style="font:600 14px system-ui,sans-serif;fill:#51675f">The bars will appear here.</text></svg>';

    if (st.r >= 0) p.rows.forEach(function (r, i) {
      var y = rowY(i);
      out.push('<text x="4" y="' + (y + 18) + '" class="nm">' + esc(r.name) + '</text>');
      if (!visible(r.show, st)) {
        out.push('<rect class="unitbar" x="' + X0 + '" y="' + y + '" width="60" height="' + H + '" rx="3" fill="none" stroke="' + STROKE + '" stroke-dasharray="5 4" stroke-width="2"/>');
        said.push(r.name + ': a bar, not drawn to size yet.');
        return;
      }
      var len = 0, end = X0;
      r.segs.forEach(function (g, j) {
        var on = visible(g.show, st, r.show);
        var x = xs[i][j], w = g.v * px;
        if (g.missing) {
          if (on) out.push('<rect class="seg missing" data-v="' + g.v + '" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + H + '" fill="none" stroke="' + STROKE + '" stroke-dasharray="4 3" stroke-width="2"/>');
          return;
        }
        len += g.v; end = x + w;
        out.push('<rect class="seg" data-v="' + g.v + '" data-fill="' + (on ? (g.fill || 'base') : 'base') + '" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + H + '" fill="' + FILL[on ? (g.fill || 'base') : 'base'] + '"/>');
      });
      out.push('<rect class="outline" x="' + X0 + '" y="' + y + '" width="' + (end - X0).toFixed(1) + '" height="' + H + '" fill="none" stroke="' + STROKE + '" stroke-width="2"/>');
      r.segs.forEach(function (g, j) {
        if (j === 0 || g.missing || !visible(g.show, st, r.show)) return;
        out.push('<line class="cut" x1="' + xs[i][j].toFixed(1) + '" x2="' + xs[i][j].toFixed(1) + '" y1="' + y + '" y2="' + (y + H) + '" stroke="' + STROKE + '" stroke-width="2"/>');
      });
      out.push('<g class="rowlen" data-row="' + i + '" data-len="' + len + '"></g>');
      said.push(r.name + ': a bar.');
    });

    var marks = p.marks.filter(function (m) { return visible(m.show, st); });
    if (st.q) marks.push({ type: p.q.type, row: p.q.row, from: p.q.from, to: p.q.to, high: p.q.high, text: st.c >= p.calcs.length ? p.calcs[p.calcs.length - 1].ans : '?', isQ: true });
    marks.forEach(function (m) {
      var cls = m.isQ ? 'mark qmark' : 'mark';
      var txt = esc(m.text);
      if (m.type === 'top') {
        var y = rowY(m.row) - (m.high ? 24 : 6), x1 = xs[m.row][m.from], x2 = xs[m.row][m.to + 1];
        out.push('<path d="M' + (x1 + 1).toFixed(1) + ' ' + (y + 4) + ' V' + y + ' H' + (x2 - 1).toFixed(1) + ' V' + (y + 4) + '" fill="none" stroke="#17312D" stroke-width="1.5"/>');
        out.push('<text class="' + cls + '" data-row="' + m.row + '" data-from="' + m.from + '" data-to="' + m.to + '" x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (y - 3) + '" text-anchor="middle">' + txt + '</text>');
        said.push(p.rows[m.row].name + ': ' + (m.text === '?' ? 'a question mark' : m.text) + '.');
      } else {
        var bx = X0 + W + 8, y1 = rowY(m.from), y2 = rowY(m.to) + H, mid = (y1 + y2) / 2;
        out.push('<path d="M' + bx + ' ' + y1 + ' h6 V' + y2 + ' h-6 M' + (bx + 6) + ' ' + mid + ' h6" fill="none" stroke="#17312D" stroke-width="1.5"/>');
        out.push('<text class="' + cls + '" data-brace="' + m.from + '-' + m.to + '" x="' + (bx + 16) + '" y="' + (mid + 5) + '">' + txt + '</text>');
        said.push('Total: ' + (m.text === '?' ? 'a question mark' : m.text) + '.');
      }
    });
    if (st.r < 0) said.push('No bars yet.');
    return '<svg viewBox="0 0 340 ' + hgt + '" role="img" aria-label="' + esc('Bar model. ' + said.join(' ')) + '">' +
      '<style>.nm{font:700 14px system-ui,sans-serif;fill:#17312D}.mark{font:700 14px system-ui,sans-serif;fill:#17312D}.qmark{fill:#B3261E;font-size:17px}</style>' +
      out.join('') + '</svg>';
  }

  /* ---------- the game ---------- */

  var band = null, set = [], idx = 0, p = null, stages = [], at = 0, st = null, done = {};

  function show(id) { ['menu', 'game', 'alldone'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function facts() { return p.sentences.length - 1; }
  function startSet(b) {
    band = b; set = makeSet(b); idx = 0;
    $('title').textContent = b.label;
    show('game');
    startProblem();
    $('go').focus();
  }
  function startProblem() {
    p = set[idx];
    stages = ['read', 'who', 'bars'];
    for (var i = 1; i <= facts(); i++) stages.push('sent' + i);
    stages.push('q');
    for (var c = 0; c < p.calcs.length; c++) stages.push('calc' + c);
    stages.push('say');
    at = 0; st = { r: -1, q: false, c: 0 }; done = {};
    $('count').textContent = 'Problem ' + (idx + 1) + ' of ' + set.length;
    var prob = $('problem');
    prob.innerHTML = '';
    p.sentences.forEach(function (s, i) { prob.appendChild(el('span', { 'class': 'sent', 'data-i': String(i) }, s)); prob.appendChild(document.createTextNode(' ')); });
    render();
  }

  var STEPS = { read: [1, 'Read the problem.'], who: [2, 'Who and what?'], bars: [3, 'Draw a bar for each one.'], sent: [4, 'Read one sentence at a time and change the bars.'], q: [5, 'Where does the question mark go?'], calc: [6, 'Work it out.'], say: [7, 'Say the answer in a full sentence.'] };

  function render() {
    var s = stages[at], kind = s.replace(/\d+$/, '');
    var n = +(s.match(/\d+$/) || [0])[0];
    $('stepline').textContent = 'Step ' + STEPS[kind][0] + ' of 7: ' + STEPS[kind][1];
    Array.prototype.forEach.call(document.querySelectorAll('#problem .sent'), function (sp) {
      var i = +sp.getAttribute('data-i');
      sp.classList.toggle('now', (kind === 'sent' && i === n - 1) || (kind === 'q' && i === facts()));
    });
    if (kind === 'bars') st.r = 0;
    if (kind === 'sent') st.r = n;
    $('model').innerHTML = draw(p, st);
    var panel = $('panel'), tip = $('tip'), go = $('go');
    panel.innerHTML = ''; tip.textContent = ''; tip.className = 'tip';
    go.hidden = false;
    if (kind === 'read') { tip.textContent = 'Read it together, one sentence at a time.'; go.textContent = 'Next: who and what?'; }
    if (kind === 'who') {
      var dl = el('dl', { 'class': 'who', id: 'whowhat' });
      dl.appendChild(el('dt', {}, 'Who:')); dl.appendChild(el('dd', { id: 'who' }, p.who));
      dl.appendChild(el('dt', {}, 'What:')); dl.appendChild(el('dd', { id: 'what' }, p.what));
      panel.appendChild(dl);
      go.textContent = 'Draw the bars';
    }
    if (kind === 'bars') { tip.textContent = 'All the bars are the same size for now. The sentences will change them.'; go.textContent = 'Read the first sentence'; }
    if (kind === 'sent') { tip.textContent = 'What do the bars show now?'; go.textContent = n < facts() ? 'Next sentence' : 'Where does the ? go?'; }
    if (kind === 'q') {
      go.hidden = !st.q; go.textContent = 'Work it out';
      if (!st.q) {
        panel.appendChild(el('p', {}, 'Read the question. Where does the answer go?'));
        var box = el('div', { 'class': 'opts', id: 'qopts' });
        shuffle(p.options).forEach(function (o) {
          var b = el('button', { type: 'button', 'data-q': o[0] }, o[1]);
          b.addEventListener('click', function () {
            if (o[0] === p.right) { st.q = true; render(); $('go').focus(); }
            else { b.classList.add('wrong'); b.disabled = true; tip.className = 'tip try'; tip.textContent = 'Not yet. Read the question again: what does it ask for?'; }
          });
          box.appendChild(b);
        });
        panel.appendChild(box);
      } else { tip.textContent = 'The question mark shows where the answer goes.'; }
    }
    if (kind === 'calc' || kind === 'say') panel.appendChild(workList());
    if (kind === 'calc') {
      var c = p.calcs[n], solved = st.c > n;
      go.hidden = !solved;
      go.textContent = n < p.calcs.length - 1 ? 'Next step' : 'Say the answer';
      if (!solved) {
        if (c.hint) panel.appendChild(el('p', { id: 'hint' }, c.hint));
        panel.appendChild(el('p', { id: 'calcq', 'class': 'ask' }, 'What is ' + c.a + ' ' + c.op + ' ' + c.b + '?'));
        var row = el('div', { 'class': 'row', id: 'calcopts' });
        choices(c).forEach(function (v) {
          var b = el('button', { type: 'button', 'data-v': String(v) }, String(v));
          b.addEventListener('click', function () {
            if (v === c.ans) { st.c = n + 1; render(); $('go').focus(); }
            else { b.classList.add('wrong'); b.disabled = true; tip.className = 'tip try'; tip.textContent = 'Not yet. Look at the bars again.'; }
          });
          row.appendChild(b);
        });
        panel.appendChild(row);
      }
    }
    if (kind === 'say') {
      go.hidden = !done.say;
      go.textContent = idx < set.length - 1 ? 'Next problem' : 'Finish';
      if (!done.say) {
        panel.appendChild(el('p', {}, 'Which sentence answers the question?'));
        var sb = el('div', { 'class': 'opts', id: 'sayopts' });
        shuffle([[p.calcs[p.calcs.length - 1].say, true], [p.wrong, false]]).forEach(function (o) {
          var b = el('button', { type: 'button', 'data-right': String(o[1]) }, o[0]);
          b.addEventListener('click', function () {
            if (o[1]) { done.say = true; render(); $('go').focus(); }
            else { b.classList.add('wrong'); b.disabled = true; tip.className = 'tip try'; tip.textContent = 'Not yet. Look at the question mark on the bars.'; }
          });
          sb.appendChild(b);
        });
        panel.appendChild(sb);
      } else {
        panel.appendChild(el('p', { id: 'answer', 'class': 'ask' }, p.calcs[p.calcs.length - 1].say));
        tip.textContent = 'Well done!';
      }
    }
  }
  function workList() {
    var ul = el('ul', { 'class': 'work', id: 'work' });
    for (var i = 0; i < st.c; i++) {
      var c = p.calcs[i], li = el('li', {});
      li.appendChild(el('span', { 'class': 'eq' }, c.a + ' ' + c.op + ' ' + c.b + ' = ' + c.ans));
      if (i < p.calcs.length - 1) li.appendChild(el('span', {}, c.say));
      ul.appendChild(li);
    }
    return ul;
  }
  function choices(c) {
    var a = typeof c.a === 'number' ? c.a : c.ans - c.b;
    var alts = { '+': [Math.abs(a - c.b), c.ans + 10, c.ans - 10], '−': [a + c.b, c.ans + 10, c.ans - 10], '×': [a + c.b, c.ans + a, c.ans - a], '÷': [a - c.b, c.ans + 1, c.ans * 2] }[c.op] || [];
    alts = alts.concat([c.ans + 1, c.ans - 1, c.ans + 2]);
    var picks = [];
    alts.forEach(function (v) { if (v > 0 && v !== c.ans && picks.indexOf(v) < 0 && picks.length < 2) picks.push(v); });
    return shuffle([c.ans].concat(picks));
  }

  function next() {
    if (at < stages.length - 1) { at += 1; render(); $('go').focus(); return; }
    if (idx < set.length - 1) { idx += 1; startProblem(); $('go').focus(); return; }
    show('alldone');
    $('again').focus();
  }

  function init() {
    var list = $('bandlist');
    BANDS.forEach(function (b) {
      var btn = el('button', { type: 'button', 'class': 'step', id: 'band-' + b.id, 'data-ages': b.id });
      btn.appendChild(document.createTextNode(b.label));
      btn.appendChild(el('small', {}, SET + ' problems'));
      btn.addEventListener('click', function () { startSet(b); });
      list.appendChild(btn);
    });
    $('go').addEventListener('click', next);
    $('exit').addEventListener('click', function () { show('menu'); });
    $('again').addEventListener('click', function () { startSet(band); });
    $('other').addEventListener('click', function () { show('menu'); });
    show('menu');
  }

  // Test hooks: the problem kinds and the band list, so automated tests can make problems and check them.
  window.YS_BARS = { kinds: KINDS, draw: draw, bands: BANDS.map(function (b) { return b.id; }), current: function () { return p; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
