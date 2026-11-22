/* Yaanstep maths: fractions with pictures (ages 7 to 9). Three games, all our own:
   name the shaded part, find the shape cut into equal parts, and shade a fraction yourself.
   Halves, thirds, quarters, sixths and eighths. Things first, then a picture, then the numbers.
   Every round is made fresh. The pictures are drawn by this script. Plain script, no build step.
   Nothing is stored or sent. No timers. Everything waits for a tap. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, attrs, text) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text != null) e.textContent = text; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function svg(w, h, label, body) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '">' + body + '</svg>'; }
  var ROUNDS = 8;
  var TEAL = '#1F7A6D';
  var WORDS = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'] };
  /** "1 quarter", "3 quarters". */
  function fw(k, d) { return k + ' ' + WORDS[d][k === 1 ? 0 : 1]; }
  function frac(k, d) { return k + '/' + d; }

  /* ---------- the pictures ---------- */
  /** A bar cut at the given points (fractions of its width, between 0 and 1). */
  function bar(cuts, shaded, w, h) {
    var edges = [0].concat(cuts, [1]), out = [];
    for (var i = 0; i < edges.length - 1; i++) {
      var x = 4 + edges[i] * w, pw = (edges[i + 1] - edges[i]) * w, on = shaded.indexOf(i) >= 0;
      out.push('<rect class="part" data-shaded="' + (on ? 1 : 0) + '" x="' + x.toFixed(1) + '" y="4" width="' + pw.toFixed(1) + '" height="' + h + '" fill="' + (on ? TEAL : '#fff') + '" stroke="#17332c" stroke-width="2"/>');
    }
    return out.join('');
  }
  function evenCuts(d) { var c = []; for (var i = 1; i < d; i++) c.push(i / d); return c; }
  /** A circle cut into d equal slices, like a pizza. */
  function pie(d, shaded) {
    var cx = 170, cy = 70, R = 62, out = [];
    for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = a0 + 2 * Math.PI / d, on = shaded.indexOf(i) >= 0;
      var p = 'M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a0)).toFixed(1) + ' ' + (cy + R * Math.sin(a0)).toFixed(1) +
        ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy + R * Math.sin(a1)).toFixed(1) + ' Z';
      out.push('<path class="part" data-shaded="' + (on ? 1 : 0) + '" d="' + p + '" fill="' + (on ? TEAL : '#fff') + '" stroke="#17332c" stroke-width="2"/>');
    }
    return out.join('');
  }
  /** k of d parts, at random places. */
  function someParts(k, d) { return shuffle(Array.apply(null, Array(d)).map(function (_, i) { return i; })).slice(0, k); }

  /* Uneven cuts for the "equal parts?" game: clearly not the same size, but the same number of parts. */
  var UNEVEN = { 2: [[0.3], [0.68]], 3: [[0.18, 0.5], [0.4, 0.82], [0.25, 0.75]], 4: [[0.1, 0.4, 0.75], [0.3, 0.45, 0.8], [0.15, 0.3, 0.6]] };

  /** Three choices for "what fraction is shaded": the answer, the part left white, and the same count over another size. */
  function choices(k, d) {
    var ans = frac(k, d), picks = [];
    if (d - k !== k) picks.push(frac(d - k, d));
    shuffle([2, 3, 4, 6, 8].filter(function (x) { return x !== d && x > k; })).forEach(function (x) { picks.push(frac(k, x)); });
    if (k > 1) picks.push(frac(1, d));
    shuffle([k - 1, k + 1]).forEach(function (x) { if (x >= 1 && x < d) picks.push(frac(x, d)); });
    var out = [];
    picks.forEach(function (p) { if (p !== ans && out.indexOf(p) < 0 && out.length < 2) out.push(p); });
    return shuffle([ans].concat(out));
  }

  /* ---------- the rounds: one maker per game ---------- */
  var MAKE = {
    name: function () {
      var d = pick([2, 3, 4, 6, 8]), k = rnd(1, d - 1), shape = d === 2 || Math.random() < 0.5 ? 'bar' : 'pie';
      return { game: 'name', d: d, k: k, shape: shape, parts: someParts(k, d), ans: frac(k, d),
        say: 'The ' + (shape === 'bar' ? 'bar' : 'circle') + ' is cut into equal parts. What fraction is shaded?',
        right: k + ' of the ' + d + ' equal parts ' + (k === 1 ? 'is' : 'are') + ' shaded. That is ' + fw(k, d) + ', ' + frac(k, d) + '.' };
    },
    equal: function () {
      var d = pick([2, 3, 4]), other = pick([2, 3, 4].filter(function (x) { return x !== d; }));
      var tiles = shuffle([
        { kind: 'right', parts: d, cuts: evenCuts(d) },
        { kind: 'uneven', parts: d, cuts: pick(UNEVEN[d]) },
        { kind: 'count', parts: other, cuts: evenCuts(other) }
      ]);
      return { game: 'equal', d: d, tiles: tiles, ans: tiles.map(function (t) { return t.kind; }).indexOf('right'),
        say: 'Which bar is cut into ' + WORDS[d][1] + '?',
        right: 'That bar has ' + d + ' equal parts, so each part is ' + fw(1, d) + '.' };
    },
    shade: function () {
      var d = pick([2, 3, 4, 6, 8]), k = rnd(1, d - 1);
      return { game: 'shade', d: d, k: k, ans: k,
        say: 'Shade ' + fw(k, d) + ' of the shape.',
        right: k + ' of the ' + d + ' equal parts ' + (k === 1 ? 'is' : 'are') + ' shaded. That is ' + fw(k, d) + ', ' + frac(k, d) + '.' };
    }
  };
  var TITLES = { name: 'Name the fraction', equal: 'Equal parts', shade: 'Shade it' };
  var TRY = { name: 'Not yet. Count all the parts, then the shaded ones.', uneven: 'Not yet. Those parts are not all the same size.', count: 'Not yet. Count the parts.', more: 'Not yet. Shade some more parts.', less: 'Not yet. That is too many parts.' };

  /* ---------- the game ---------- */
  var game = null, idx = 0, r = null, solved = false, on = [];
  function show(id) { ['menu', 'game', 'alldone'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function start(g) { game = g; idx = 0; $('title').textContent = TITLES[g]; show('game'); round(); }
  function round() {
    r = MAKE[game](); solved = false; on = [];
    $('count').textContent = 'Round ' + (idx + 1) + ' of ' + ROUNDS;
    $('say').textContent = r.say;
    render();
    var first = document.querySelector('#panel button'); if (first) first.focus();
  }
  function setTip(text, tryIt) { var tip = $('tip'); tip.className = tryIt ? 'tip try' : 'tip'; tip.textContent = text; }
  function namePic() {
    var label = (r.shape === 'bar' ? 'A bar' : 'A circle') + ' cut into ' + r.d + ' equal parts. ' + r.k + (r.k === 1 ? ' part is' : ' parts are') + ' shaded.';
    return r.shape === 'bar' ? svg(340, 72, label, bar(evenCuts(r.d), r.parts, 330, 62)) : svg(340, 140, label, pie(r.d, r.parts));
  }
  function render(keepTip) {
    var art = $('art'), panel = $('panel'), go = $('go');
    panel.innerHTML = ''; art.innerHTML = ''; if (!keepTip) setTip('', false);
    go.hidden = !solved; go.textContent = idx < ROUNDS - 1 ? 'Next round' : 'Finish';
    art.hidden = r.game !== 'name';
    if (r.game === 'name') art.innerHTML = namePic();
    if (r.game === 'equal') {
      var tiles = el('div', { 'class': 'bars', id: 'choices' });
      r.tiles.forEach(function (t, i) {
        var lbl = t.kind === 'uneven' ? 'A bar cut into ' + t.parts + ' parts that are not the same size.' : 'A bar cut into ' + t.parts + ' equal parts.';
        var b = el('button', { type: 'button', 'class': 'barpick', 'data-v': String(i), 'data-kind': t.kind, 'data-parts': String(t.parts), 'aria-label': lbl });
        b.innerHTML = svg(340, 56, lbl, bar(t.cuts, [], 330, 46)).replace('role="img"', 'aria-hidden="true" focusable="false"');
        if (solved && i === r.ans) b.classList.add('right');
        b.disabled = solved;
        b.addEventListener('click', function () {
          if (i === r.ans) { solved = true; render(); $('go').focus(); }
          else { b.classList.add('wrong'); b.disabled = true; setTip(TRY[t.kind], true); }
        });
        tiles.appendChild(b);
      });
      panel.appendChild(tiles);
      if (solved) { panel.appendChild(el('p', { id: 'right', 'class': 'ask' }, r.right)); setTip('Well done!', false); }
      return;
    }
    if (r.game === 'shade') {
      var cols = r.d <= 4 ? r.d : r.d / 2;
      var grid = el('div', { 'class': 'fgrid', id: 'fgrid', style: 'grid-template-columns:repeat(' + cols + ',minmax(0,1fr))', role: 'group', 'aria-label': 'A shape cut into ' + r.d + ' equal parts' });
      for (var i = 0; i < r.d; i++) {
        (function (i) {
          var lit = on.indexOf(i) >= 0;
          var b = el('button', { type: 'button', 'class': 'fpart' + (lit ? ' lit' : ''), 'data-i': String(i), 'aria-pressed': lit ? 'true' : 'false', 'aria-label': 'Part ' + (i + 1) + ' of ' + r.d });
          b.disabled = solved;
          b.addEventListener('click', function () {
            var at = on.indexOf(i); if (at >= 0) on.splice(at, 1); else on.push(i);
            render(true); setTip('', false); var me = document.querySelector('.fpart[data-i="' + i + '"]'); if (me) me.focus();
          });
          grid.appendChild(b);
        })(i);
      }
      panel.appendChild(grid);
      panel.appendChild(el('p', { id: 'have', 'class': 'sentence' }, 'Shaded: ' + on.length + ' of ' + r.d + ' parts'));
      if (solved) { panel.appendChild(el('p', { id: 'right', 'class': 'ask' }, r.right)); setTip('Well done!', false); return; }
      var check = el('button', { type: 'button', id: 'check', 'class': 'primary' }, 'Check');
      check.addEventListener('click', function () {
        if (on.length === r.k) { solved = true; render(); $('go').focus(); }
        else setTip(on.length < r.k ? TRY.more : TRY.less, true);
      });
      panel.appendChild(el('div', { 'class': 'row' })).appendChild(check);
      return;
    }
    if (solved) { panel.appendChild(el('p', { id: 'right', 'class': 'ask' }, r.right)); setTip('Well done!', false); return; }
    panel.appendChild(el('p', { 'class': 'ask' }, 'Tap the fraction.'));
    var row = el('div', { 'class': 'row', id: 'choices' });
    choices(r.k, r.d).forEach(function (v) {
      var p = v.split('/').map(Number);
      var b = el('button', { type: 'button', 'class': 'fracbtn', 'data-v': v });
      b.appendChild(el('span', { 'class': 'big' }, v));
      b.appendChild(el('span', { 'class': 'small2' }, fw(p[0], p[1])));
      b.addEventListener('click', function () {
        if (v === r.ans) { solved = true; render(); $('go').focus(); }
        else { b.classList.add('wrong'); b.disabled = true; setTip(TRY.name, true); }
      });
      row.appendChild(b);
    });
    panel.appendChild(row);
  }
  function next() { if (idx < ROUNDS - 1) { idx += 1; round(); return; } show('alldone'); $('again').focus(); }
  function init() {
    Object.keys(MAKE).forEach(function (g) { $('play-' + g).addEventListener('click', function () { start(g); }); });
    $('go').addEventListener('click', next);
    $('exit').addEventListener('click', function () { show('menu'); });
    $('again').addEventListener('click', function () { start(game); });
    $('other').addEventListener('click', function () { show('menu'); });
    show('menu');
  }
  // Test hooks: the round makers, so automated tests can check many rounds; and the round on screen.
  window.YS_FRACTIONS = { make: MAKE, choices: choices, current: function () { return r; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
