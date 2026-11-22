/* Yaanstep maths: number bonds (picture maths for ages 5 to 7).
   Three games, all our own: number bonds (two parts make a whole), take away (how many are left), and
   hopping on a number track (count on to add, count back to take away). Things first, then a picture,
   then the numbers. Every round is made fresh. The counters and pictures are drawn by this script.
   Plain script, no build step. Nothing is stored or sent. No timers. Everything waits for a tap. */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
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
  function svg(w, h, label, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '">' +
      '<style>.n{font:700 18px system-ui,sans-serif;fill:#17332c}.q{fill:#B3261E}.s{font:600 13px system-ui,sans-serif;fill:#17332c}</style>' +
      body + '</svg>';
  }

  var ROUNDS = 8;
  var TEAL = '#1F7A6D', ORANGE = '#C2410C';

  /** Three answer choices: the answer and two near it, all 0 to 20 and all different. */
  function choices(ans) {
    var picks = [];
    shuffle([ans - 1, ans + 1, ans - 2, ans + 2]).forEach(function (v) {
      if (v >= 0 && v <= 20 && picks.length < 2) picks.push(v);
    });
    return shuffle([ans].concat(picks));
  }

  /* ---------- the pictures ---------- */

  /** A number bond: the whole on top, the two parts below. A missing number shows as "?". */
  function bond(whole, a, b) {
    function circ(x, y, v, part) {
      var q = v === '?';
      return '<g class="bnode" data-part="' + part + '" data-v="' + v + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="24" fill="' + (q ? '#fff2b3' : '#fff') + '" stroke="#17332c" stroke-width="2"/>' +
        '<text class="n' + (q ? ' q' : '') + '" x="' + x + '" y="' + (y + 6) + '" text-anchor="middle">' + v + '</text></g>';
    }
    var label = 'Number bond. Whole: ' + say(whole) + '. Parts: ' + say(a) + ' and ' + say(b) + '.';
    return svg(340, 128, label,
      '<line x1="170" y1="30" x2="110" y2="96" stroke="#17332c" stroke-width="2"/>' +
      '<line x1="170" y1="30" x2="230" y2="96" stroke="#17332c" stroke-width="2"/>' +
      circ(170, 30, whole, 'whole') + circ(110, 98, a, 'a') + circ(230, 98, b, 'b'));
  }
  function say(v) { return v === '?' ? 'a question mark' : String(v); }

  /** Counters in a row: a teal circles, then a gap, then b orange squares (shape and color both differ). */
  function counters(a, b) {
    var out = [], x = 170 - ((a + b) * 28 + 16) / 2 + 14;
    for (var i = 0; i < a; i++) { out.push('<circle class="ctr" data-c="teal" cx="' + x + '" cy="30" r="12" fill="' + TEAL + '"/>'); x += 28; }
    x += 16;
    for (var j = 0; j < b; j++) { out.push('<rect class="ctr" data-c="orange" x="' + (x - 12) + '" y="18" width="24" height="24" rx="4" fill="' + ORANGE + '"/>'); x += 28; }
    return svg(340, 60, (a + b) + ' counters: ' + a + ' teal circles and ' + b + ' orange squares.', out.join(''));
  }

  /** Balloons: t in a row, the last k float away (drawn faint and crossed out). */
  function balloons(t, k) {
    var out = [], x = 170 - (t * 32) / 2 + 16;
    for (var i = 0; i < t; i++) {
      var gone = i >= t - k;
      out.push('<g class="bln" data-gone="' + (gone ? 1 : 0) + '"' + (gone ? ' opacity=".45"' : '') + '>' +
        '<ellipse cx="' + x + '" cy="' + (gone ? 22 : 36) + '" rx="12" ry="15" fill="' + (gone ? '#fff' : (i % 2 ? ORANGE : TEAL)) + '" stroke="' + (i % 2 ? ORANGE : TEAL) + '" stroke-width="2"/>' +
        '<path d="M' + x + ' ' + (gone ? 37 : 51) + ' q -5 10 0 20" fill="none" stroke="#51675f" stroke-width="1.5"/>' +
        (gone ? '<line x1="' + (x - 10) + '" y1="12" x2="' + (x + 10) + '" y2="32" stroke="#B3261E" stroke-width="2.5"/>' : '') +
        '</g>');
      x += 32;
    }
    return svg(340, 80, t + ' balloons. ' + k + ' floated away, so they are crossed out.', out.join(''));
  }

  /** A number track window of 11 squares, the frog on "at", the hops so far drawn as arcs. */
  function track(r, at, hopped) {
    var lo = Math.max(0, Math.min(Math.min(r.start, r.end) - 2, 20 - 10)), out = [];
    function cx(n) { return 5 + (n - lo) * 30 + 15; }
    for (var n = lo; n <= lo + 10; n++) {
      out.push('<g class="sq" data-n="' + n + '"><rect x="' + (cx(n) - 15) + '" y="70" width="30" height="34" fill="' + (n === r.start ? '#e6f6ea' : '#fff') + '" stroke="#17332c" stroke-width="1.5"/>' +
        '<text class="s" x="' + cx(n) + '" y="92" text-anchor="middle">' + n + '</text></g>');
    }
    var step = r.op === '+' ? 1 : -1;
    for (var h = 0; h < hopped; h++) {
      var f = r.start + h * step, t = f + step;
      out.push('<path class="arc" d="M' + cx(f) + ' 66 Q ' + ((cx(f) + cx(t)) / 2) + ' 40 ' + cx(t) + ' 66" fill="none" stroke="' + ORANGE + '" stroke-width="2.5"/>');
    }
    var fx = cx(at);
    out.push('<g class="frog" data-at="' + at + '"><ellipse cx="' + fx + '" cy="56" rx="12" ry="9" fill="#3F7D20"/>' +
      '<circle cx="' + (fx - 5) + '" cy="48" r="3.5" fill="#fff" stroke="#3F7D20"/><circle cx="' + (fx + 5) + '" cy="48" r="3.5" fill="#fff" stroke="#3F7D20"/>' +
      '<circle cx="' + (fx - 5) + '" cy="48" r="1.5" fill="#17332c"/><circle cx="' + (fx + 5) + '" cy="48" r="1.5" fill="#17332c"/></g>');
    return svg(340, 112, 'Number track from ' + lo + ' to ' + (lo + 10) + '. The frog is on ' + at + '.', out.join(''));
  }

  /* ---------- the rounds: one maker per game ---------- */

  var MAKE = {
    bonds: function () {
      var whole = rnd(3, 10), a = rnd(1, whole - 1), b = whole - a, hideWhole = Math.random() < 0.4;
      return {
        game: 'bonds', whole: whole, a: a, b: b, hide: hideWhole ? 'whole' : 'b', ans: hideWhole ? whole : b,
        say: hideWhole ? 'There are ' + a + ' teal counters and ' + b + ' orange counters. How many counters in all?'
          : 'There are ' + whole + ' counters. ' + a + ' are teal. How many are orange?',
        right: a + ' and ' + b + ' make ' + whole + '.'
      };
    },
    take: function () {
      var t = rnd(4, 10), k = rnd(1, t - 1);
      return {
        game: 'take', t: t, k: k, ans: t - k,
        say: 'There were ' + t + ' balloons. ' + k + ' floated away. How many are left?',
        sum: t + ' − ' + k + ' = ?',
        right: t + ' − ' + k + ' = ' + (t - k) + '. ' + (t - k) + (t - k === 1 ? ' balloon is' : ' balloons are') + ' left.'
      };
    },
    track: function () {
      var h = rnd(1, 3), add = Math.random() < 0.5, start = add ? rnd(0, 20 - h) : rnd(h, 20), end = add ? start + h : start - h;
      return {
        game: 'track', start: start, hops: h, op: add ? '+' : '−', end: end, ans: end,
        say: 'The frog starts on ' + start + '. It hops ' + h + (add ? ' on' : ' back') + '. Where does it land?',
        sum: start + ' ' + (add ? '+' : '−') + ' ' + h + ' = ?',
        right: start + ' ' + (add ? '+' : '−') + ' ' + h + ' = ' + end + '. The frog lands on ' + end + '.'
      };
    }
  };
  var TITLES = { bonds: 'Number bonds', take: 'Take away', track: 'Hop on the number track' };
  var TRY = { bonds: 'Not yet. Count the counters again.', take: 'Not yet. Count the balloons that are still here.', track: 'Not yet. Look where the frog is now.' };

  /* ---------- the game ---------- */

  var game = null, idx = 0, r = null, solved = false, hopped = 0;

  function show(id) { ['menu', 'game', 'alldone'].forEach(function (s) { $(s).hidden = s !== id; }); }

  function start(g) {
    game = g; idx = 0;
    $('title').textContent = TITLES[g];
    show('game');
    round();
  }

  function round() {
    r = MAKE[game](); solved = false; hopped = 0;
    $('count').textContent = 'Round ' + (idx + 1) + ' of ' + ROUNDS;
    $('say').textContent = r.say;
    render();
    var first = document.querySelector('#panel button');
    if (first) first.focus();
  }

  function render() {
    var art = $('art'), panel = $('panel'), tip = $('tip'), go = $('go');
    panel.innerHTML = ''; tip.textContent = ''; tip.className = 'tip';
    go.hidden = !solved; go.textContent = idx < ROUNDS - 1 ? 'Next round' : 'Finish';

    if (r.game === 'bonds') {
      art.innerHTML = counters(r.a, r.b) +
        (solved ? bond(r.whole, r.a, r.b) : bond(r.hide === 'whole' ? '?' : r.whole, r.a, r.hide === 'b' ? '?' : r.b));
    }
    if (r.game === 'take') {
      art.innerHTML = balloons(r.t, r.k) + bond(r.t, r.k, solved ? r.ans : '?');
      panel.appendChild(el('p', { id: 'sum', 'class': 'sentence' }, solved ? r.right.split('. ')[0] : r.sum));
    }
    if (r.game === 'track') {
      art.innerHTML = track(r, r.start + (r.op === '+' ? hopped : -hopped), hopped);
      panel.appendChild(el('p', { id: 'sum', 'class': 'sentence' }, solved ? r.right.split('. ')[0] : r.sum));
      var landed = [];
      for (var h = 1; h <= hopped; h++) landed.push(r.start + (r.op === '+' ? h : -h));
      panel.appendChild(el('p', { id: 'hops', 'class': 'hops' }, hopped ? 'Hops: ' + landed.join(', ') : 'Hops: none yet'));
      if (hopped < r.hops) {
        var hop = el('button', { type: 'button', id: 'hop', 'class': 'primary' }, r.op === '+' ? 'Hop on' : 'Hop back');
        hop.addEventListener('click', function () { hopped += 1; render(); var n = $('hop') || document.querySelector('#choices button'); if (n) n.focus(); });
        panel.appendChild(hop);
        tip.textContent = 'Tap once for each hop.';
        return;
      }
    }

    if (solved) {
      panel.appendChild(el('p', { id: 'right', 'class': 'ask' }, r.right));
      tip.textContent = 'Well done!';
      return;
    }
    panel.appendChild(el('p', { 'class': 'ask' }, r.game === 'track' ? 'Where did the frog land?' : 'What number goes in the "?"'));
    var row = el('div', { 'class': 'row', id: 'choices' });
    choices(r.ans).forEach(function (v) {
      var b = el('button', { type: 'button', 'data-v': String(v) }, String(v));
      b.addEventListener('click', function () {
        if (v === r.ans) { solved = true; render(); $('go').focus(); }
        else { b.classList.add('wrong'); b.disabled = true; tip.className = 'tip try'; tip.textContent = TRY[r.game]; }
      });
      row.appendChild(b);
    });
    panel.appendChild(row);
  }

  function next() {
    if (idx < ROUNDS - 1) { idx += 1; round(); return; }
    show('alldone');
    $('again').focus();
  }

  function init() {
    Object.keys(MAKE).forEach(function (g) { $('play-' + g).addEventListener('click', function () { start(g); }); });
    $('go').addEventListener('click', next);
    $('exit').addEventListener('click', function () { show('menu'); });
    $('again').addEventListener('click', function () { start(game); });
    $('other').addEventListener('click', function () { show('menu'); });
    show('menu');
  }

  // Test hooks: the round makers, so automated tests can check many rounds; and the round on screen.
  window.YS_BONDS = { make: MAKE, choices: choices, current: function () { return r; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
