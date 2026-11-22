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

  /** A point for a question answered right, kept only with a child profile (YSPoints, in profile.js). */
  function point(area) { if (window.YSPoints) window.YSPoints.add(area, 1); }
  /** Fewer choices (a comfort setting in the child's profile): keeps the right answer and one wrong one. */
  function fewer(list, right) { return window.YSComfort ? window.YSComfort.fewer(list, right) : list; }
  /** Three choices for "what fraction is shaded": the answer, the part left white, and the same count over another size. */
  function choices(k, d) {
    var ans = frac(k, d), picks = [];
    if (d - k !== k) picks.push(frac(d - k, d));
    shuffle([2, 3, 4, 6, 8].filter(function (x) { return x !== d && x > k; })).forEach(function (x) { picks.push(frac(k, x)); });
    if (k > 1) picks.push(frac(1, d));
    shuffle([k - 1, k + 1]).forEach(function (x) { if (x >= 1 && x < d) picks.push(frac(x, d)); });
    var out = [];
    picks.forEach(function (p) { if (p !== ans && out.indexOf(p) < 0 && out.length < 2) out.push(p); });
    return fewer(shuffle([ans].concat(out)), ans);
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

  /* ---------- Show me how: a short moving lesson with a different example ---------- */
  var HOW = {
    name: 'Count all the equal parts first: that is the bottom number. Then count the shaded parts: that is the top number.',
    equal: 'Halves, thirds and quarters are parts that are all the same size. Count the parts, then check they match.',
    shade: 'The bottom number says how many equal parts there are. The top number says how many to shade.'
  };
  function at(i) { return ' style="animation-delay:' + (i * 0.45).toFixed(2) + 's"'; }
  function num(x, y, n, i) { return '<text class="mv-in" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-size="16" font-weight="700" fill="#17332c"' + at(i) + '>' + n + '</text>'; }
  /** Parts appear one by one with their numbers, then the shaded ones fill in, then the fraction shows. */
  function nameArt(ex) {
    var d = ex.d, k = ex.k, body = '', t = 0, shaded = ex.parts.slice().sort(function (a, b) { return a - b; });
    if (ex.shape === 'bar') {
      var w = 330 / d;
      for (var i = 0; i < d; i++) body += '<rect class="mv-in" x="' + (4 + i * w).toFixed(1) + '" y="4" width="' + w.toFixed(1) + '" height="62" fill="#fff" stroke="#17332c" stroke-width="2"' + at(t) + '/>' + num(4 + i * w + w / 2, 30, i + 1, t++);
      shaded.forEach(function (i, n) { body += '<rect class="mv-fade" x="' + (4 + i * w + 2).toFixed(1) + '" y="6" width="' + (w - 4).toFixed(1) + '" height="58" fill="' + TEAL + '" opacity=".85"' + at(t + 1 + n) + '/>' + '<text class="mv-in" x="' + (4 + i * w + w / 2).toFixed(1) + '" y="56" text-anchor="middle" font-size="14" font-weight="700" fill="#fff"' + at(t + 1 + n) + '>' + (n + 1) + '</text>'; });
      t += k + 1;
      return svg(340, 110, 'A bar cut into ' + d + ' equal parts, counted 1 to ' + d + '. Then ' + (k === 1 ? '1 shaded part is counted' : k + ' shaded parts are counted') + '. That is ' + frac(k, d) + '.',
        body + '<text class="mv-in" x="170" y="100" text-anchor="middle" font-size="22" font-weight="800" fill="' + TEAL + '"' + at(t + 1) + '>' + frac(k, d) + '</text>');
    }
    var cx = 120, cy = 72, R = 62;
    for (var j = 0; j < d; j++) {
      var a0 = -Math.PI / 2 + 2 * Math.PI * j / d, a1 = a0 + 2 * Math.PI / d, am = (a0 + a1) / 2;
      var p = 'M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a0)).toFixed(1) + ' ' + (cy + R * Math.sin(a0)).toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy + R * Math.sin(a1)).toFixed(1) + ' Z';
      var on = shaded.indexOf(j);
      body += '<path class="mv-in" d="' + p + '" fill="#fff" stroke="#17332c" stroke-width="2"' + at(t) + '/>';
      if (on >= 0) body += '<path class="mv-fade" d="' + p + '" fill="' + TEAL + '" opacity=".85"' + at(d + 1 + on) + '/>';
      body += num(cx + R * 0.62 * Math.cos(am), cy + R * 0.62 * Math.sin(am) + 6, j + 1, t++);
    }
    t += k + 1;
    return svg(340, 144, 'A circle cut into ' + d + ' equal parts, counted 1 to ' + d + '. Then ' + (k === 1 ? '1 shaded part is counted' : k + ' shaded parts are counted') + '. That is ' + frac(k, d) + '.',
      body + '<text class="mv-in" x="270" y="82" text-anchor="middle" font-size="30" font-weight="800" fill="' + TEAL + '"' + at(t + 1) + '>' + frac(k, d) + '</text>');
  }
  /** An uneven bar gets a cross; an even bar's parts pop in one by one and each gets a tick. */
  function equalArt(ex) {
    var d = ex.d, w = 300 / d, body = '<text x="4" y="16" font-size="14" fill="#17332c">Not the same size</text>', cuts = [0].concat(UNEVEN[d][0], [1]);
    for (var i = 0; i < d; i++) body += '<rect x="' + (4 + cuts[i] * 300).toFixed(1) + '" y="22" width="' + ((cuts[i + 1] - cuts[i]) * 300).toFixed(1) + '" height="34" fill="#fff" stroke="#17332c" stroke-width="2"/>';
    body += '<text class="mv-in" x="322" y="47" text-anchor="middle" font-size="24" font-weight="800" fill="#a33"' + at(1) + '>✗</text>';
    body += '<text x="4" y="86" font-size="14" fill="#17332c">All the same size</text>';
    for (var j = 0; j < d; j++) body += '<rect class="mv-in" x="' + (4 + j * w).toFixed(1) + '" y="92" width="' + w.toFixed(1) + '" height="34" fill="#e6f6ea" stroke="#17332c" stroke-width="2"' + at(2 + j) + '/>' + num(4 + j * w + w / 2, 115, 1 + '/' + d, 2 + j);
    body += '<text class="mv-in" x="322" y="117" text-anchor="middle" font-size="24" font-weight="800" fill="#1b7a3d"' + at(3 + d) + '>✓</text>';
    return svg(340, 134, 'Two bars with ' + d + ' parts each. The top bar\'s parts are not the same size. The bottom bar\'s ' + d + ' parts are all the same size, so each part is ' + fw(1, d) + '.', body);
  }
  /** The shape's equal parts appear, then the parts to shade fill one at a time with a count. */
  function shadeArt(ex) {
    var d = ex.d, k = ex.k, cols = d <= 4 ? d : d / 2, rows = d / cols, cw = 300 / cols, ch = 44, body = '';
    for (var i = 0; i < d; i++) {
      var x = 4 + (i % cols) * cw, y = 4 + Math.floor(i / cols) * ch;
      body += '<rect class="mv-in" x="' + x.toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="' + ch + '" fill="#fff" stroke="#17332c" stroke-width="2"' + at(0) + '/>';
      if (i < k) body += '<rect class="mv-fade" x="' + (x + 2).toFixed(1) + '" y="' + (y + 2) + '" width="' + (cw - 4).toFixed(1) + '" height="' + (ch - 4) + '" fill="' + TEAL + '"' + at(1 + i) + '/><text class="mv-in" x="' + (x + cw / 2).toFixed(1) + '" y="' + (y + 28) + '" text-anchor="middle" font-size="16" font-weight="700" fill="#fff"' + at(1 + i) + '>' + (i + 1) + '</text>';
    }
    return svg(340, rows * ch + 12, 'A shape cut into ' + d + ' equal parts. ' + k + (k === 1 ? ' part is' : ' parts are') + ' shaded one at a time. That is ' + frac(k, d) + '.', body);
  }
  function lessonWords(ex) {
    var parts = Array.apply(null, Array(ex.k)).map(function (_, i) { return i + 1; }).join(', ');
    if (ex.game === 'name') return 'Count all the parts: there are ' + ex.d + ', so the bottom number is ' + ex.d + '. Count the shaded parts' + (ex.k === 1 ? ': just 1' : ': ' + parts) + '. So the top number is ' + ex.k + '. That is ' + fw(ex.k, ex.d) + ', ' + frac(ex.k, ex.d) + '.';
    if (ex.game === 'equal') return WORDS[ex.d][1][0].toUpperCase() + WORDS[ex.d][1].slice(1) + ' means ' + ex.d + ' parts that are all the same size. The top bar has ' + ex.d + ' parts, but they are not the same size. The bottom bar has ' + ex.d + ' equal parts, so each part is ' + fw(1, ex.d) + '.';
    return 'To shade ' + fw(ex.k, ex.d) + ', the shape has ' + ex.d + ' equal parts. Shade ' + ex.k + ' of them: ' + parts + '. That is ' + frac(ex.k, ex.d) + '.';
  }
  function lessonFor(g) {
    var ex, tries = 0;
    do { ex = MAKE[g](); tries++; } while (ex.d === r.d && tries < 50);
    var box = el('section', { 'class': 'how-panel', id: 'lesson', 'aria-labelledby': 'lesson-h' });
    box.appendChild(el('h3', { id: 'lesson-h', tabindex: '-1' }, 'Short lesson'));
    box.appendChild(el('p', {}, HOW[g]));
    var pic = el('div', { 'class': 'moving' });
    var art = function () { return g === 'name' ? nameArt(ex) : g === 'equal' ? equalArt(ex) : shadeArt(ex); };
    pic.innerHTML = art();
    box.appendChild(pic);
    box.appendChild(el('p', { id: 'lesson-say' }, lessonWords(ex)));
    var again = el('button', { type: 'button', id: 'watch-again', 'class': 'small' }, 'Watch again');
    again.addEventListener('click', function () { pic.innerHTML = art(); });
    box.appendChild(again);
    box.appendChild(el('p', { 'class': 'muted' }, g === 'shade' ? 'Now shade the shape above again.' : 'Now try the question above again.'));
    return box;
  }
  /* The lesson lives under the tip, outside the panel, so tapping parts does not close it. */
  function howHolder() {
    var h = $('howbox');
    if (!h) { h = el('div', { id: 'howbox' }); $('tip').insertAdjacentElement('afterend', h); }
    return h;
  }
  function offerHow() {
    var h = howHolder();
    if (h.firstChild) return;
    var how = el('button', { type: 'button', id: 'howbtn' }, 'Show me how');
    how.addEventListener('click', function () { h.innerHTML = ''; h.appendChild(lessonFor(r.game)); $('lesson-h').focus(); });
    h.appendChild(how);
  }

  /* ---------- the game ---------- */
  var game = null, idx = 0, r = null, solved = false, on = [];
  function show(id) { ['menu', 'game', 'alldone'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function start(g) { game = g; idx = 0; $('title').textContent = TITLES[g]; show('game'); round(); }
  function round() {
    r = MAKE[game](); solved = false; on = []; howHolder().innerHTML = '';
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
    panel.innerHTML = ''; art.innerHTML = ''; if (!keepTip) setTip('', false); if (solved) howHolder().innerHTML = '';
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
          if (i === r.ans) { if (!solved) point('maths'); solved = true; render(); $('go').focus(); }
          else { b.classList.add('wrong'); b.disabled = true; setTip(TRY[t.kind], true); offerHow(); }
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
        if (on.length === r.k) { if (!solved) point('maths'); solved = true; render(); $('go').focus(); }
        else { setTip(on.length < r.k ? TRY.more : TRY.less, true); offerHow(); }
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
        if (v === r.ans) { if (!solved) point('maths'); solved = true; render(); $('go').focus(); }
        else { b.classList.add('wrong'); b.disabled = true; setTip(TRY.name, true); offerHow(); }
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
