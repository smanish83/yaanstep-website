/* Yaanstep maths: tens and ones (place value with pictures, ages 6 to 8). Three games, all our own:
   read the blocks (how many?), build a number with rods and cubes, and compare two numbers.
   A rod is ten cubes joined together. Things first, then a picture, then the numbers.
   Every round is made fresh. The pictures are drawn by this script. Plain script, no build step.
   Nothing is stored or sent. No timers. Everything waits for a tap. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, attrs, text) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text != null) e.textContent = text; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function svg(w, h, label, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '">' +
      '<style>.n{font:800 20px system-ui,sans-serif;fill:#17332c}</style>' + body + '</svg>';
  }
  /** "1 ten", "3 tens", "1 one", "0 ones". */
  function pl(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
  var ROUNDS = 8;
  var TEAL = '#1F7A6D', ORANGE = '#C2410C';

  /* ---------- the pictures ---------- */
  /** Rods and cubes at x0: t rods (each ten little squares), then o cubes in columns of five. */
  function blocks(t, o, x0, y0, s) {
    var out = [], w = Math.round(s * 1.1), gap = Math.round(s * 1.35), x = x0;
    for (var i = 0; i < t; i++) {
      var segs = '';
      for (var k = 1; k < 10; k++) segs += '<line x1="' + x + '" y1="' + (y0 + k * s) + '" x2="' + (x + w) + '" y2="' + (y0 + k * s) + '" stroke="#fff" stroke-width="1"/>';
      out.push('<g class="rod"><rect x="' + x + '" y="' + y0 + '" width="' + w + '" height="' + (10 * s) + '" fill="' + TEAL + '" stroke="#17332c" stroke-width="1"/>' + segs + '</g>');
      x += gap;
    }
    if (t) x += Math.round(s * 0.6);
    for (var j = 0; j < o; j++) {
      var col = Math.floor(j / 5), row = j % 5;
      out.push('<rect class="cube" x="' + (x + col * gap) + '" y="' + (y0 + (9 - row) * s) + '" width="' + w + '" height="' + s + '" fill="' + ORANGE + '" stroke="#17332c" stroke-width="1"/>');
    }
    return out.join('');
  }
  function words(t, o) { return pl(t, 'rod') + ' of ten and ' + pl(o, 'single cube'); }
  function onePic(t, o) {
    var body = (t || o) ? blocks(t, o, 12, 10, 10) : '<text class="n" x="170" y="66" text-anchor="middle">No blocks yet</text>';
    return svg(340, 120, (t || o) ? words(t, o) + '.' : 'No blocks yet.', body);
  }
  /** Two numbers side by side, each with its number on top. */
  function twoPics(a, b) {
    function side(n, x) {
      return '<g class="side" data-n="' + n + '"><text class="n" x="' + (x + 80) + '" y="22" text-anchor="middle">' + n + '</text>' +
        blocks(Math.floor(n / 10), n % 10, x + 6, 34, 9) + '</g>';
    }
    var label = a + ' is ' + words(Math.floor(a / 10), a % 10) + '. ' + b + ' is ' + words(Math.floor(b / 10), b % 10) + '.';
    return svg(340, 130, label, side(a, 0) + '<line x1="170" y1="6" x2="170" y2="124" stroke="#c6e3da" stroke-width="2"/>' + side(b, 172));
  }

  /** Three answer choices for a number from 10 to 99: the answer, often the digits swapped, and ten or one more or less. */
  function choices(n) {
    var t = Math.floor(n / 10), o = n % 10, picks = [];
    var swap = o * 10 + t;
    if (o >= 1 && swap !== n) picks.push(swap);
    shuffle([n + 10, n - 10, n + 1, n - 1]).forEach(function (v) {
      if (v >= 10 && v <= 99 && picks.indexOf(v) < 0 && picks.length < 2) picks.push(v);
    });
    return shuffle([n].concat(picks.slice(0, 2)));
  }

  /* ---------- the rounds: one maker per game ---------- */
  function make(n) { return { n: n, t: Math.floor(n / 10), o: n % 10 }; }
  var MAKE = {
    read: function () {
      var r = make(rnd(11, 99));
      return { game: 'read', n: r.n, t: r.t, o: r.o, ans: r.n,
        say: 'Each rod is ten. Each cube is one. How many in all?',
        right: pl(r.t, 'ten') + ' and ' + pl(r.o, 'one') + ' make ' + r.n + '.' };
    },
    build: function () {
      var r = make(rnd(11, 99));
      return { game: 'build', n: r.n, t: r.t, o: r.o, ans: r.n,
        say: 'Make ' + r.n + ' with rods and cubes.',
        right: pl(r.t, 'ten') + ' and ' + pl(r.o, 'one') + ' make ' + r.n + '.' };
    },
    compare: function () {
      var a = rnd(11, 99), b;
      if (Math.random() < 0.4) { do { b = Math.floor(a / 10) * 10 + rnd(0, 9); } while (b === a || b < 11); }
      else { do { b = rnd(11, 99); } while (Math.floor(b / 10) === Math.floor(a / 10)); }
      var more = Math.random() < 0.6, word = more ? 'more' : 'less';
      var x = more ? Math.max(a, b) : Math.min(a, b), y = x === a ? b : a;
      var tx = Math.floor(x / 10), ty = Math.floor(y / 10);
      var why = tx !== ty ? x + ' has ' + pl(tx, 'ten') + ', and ' + y + ' has ' + pl(ty, 'ten') + '.'
        : 'Both have ' + pl(tx, 'ten') + ', so look at the ones: ' + pl(x % 10, 'one') + ' and ' + pl(y % 10, 'one') + '.';
      return { game: 'compare', a: a, b: b, more: more, ans: x,
        say: 'Which number is ' + word + ', ' + a + ' or ' + b + '?',
        right: x + ' is ' + word + ' than ' + y + '. ' + why };
    }
  };

  /* ---------- "Show me how": a short moving lesson after a miss (SCRUM-495) ----------
     A new example with a different number, so it teaches the idea without giving this answer away.
     The rods and cubes appear one at a time; with calm mode or reduced motion the last picture shows at once. */
  function delay(i) { return ' style="animation-delay:' + (0.3 + i * 0.45).toFixed(2) + 's"'; }
  function movingBlocks(t, o, x0, y0, s, from) {
    var out = [], w = Math.round(s * 1.1), gap = Math.round(s * 1.35), x = x0, i;
    for (i = 0; i < t; i++) {
      out.push('<g class="mv-in"' + delay(from + i) + '><rect x="' + x + '" y="' + y0 + '" width="' + w + '" height="' + (10 * s) + '" fill="' + TEAL + '" stroke="#17332c" stroke-width="1"/></g>');
      x += gap;
    }
    if (t) x += Math.round(s * 0.6);
    for (i = 0; i < o; i++) {
      var col = Math.floor(i / 5), row = i % 5;
      out.push('<rect class="mv-in"' + delay(from + t + i) + ' x="' + (x + col * gap) + '" y="' + (y0 + (9 - row) * s) + '" width="' + w + '" height="' + s + '" fill="' + ORANGE + '" stroke="#17332c" stroke-width="1"/>');
    }
    return out.join('');
  }
  function countWords(n) {
    var t = Math.floor(n / 10), o = n % 10, tens = [], ones = [];
    for (var i = 1; i <= t; i++) tens.push(i * 10);
    for (var j = 1; j <= o; j++) ones.push(t * 10 + j);
    return 'Count the rods in tens: ' + tens.join(', ') + '.' + (o ? ' Then count on the cubes: ' + ones.join(', ') + '.' : '') + ' That makes ' + n + '.';
  }
  function lessonArt(ex) {
    if (ex.game === 'compare') {
      var side = function (n, x, from) { return '<text class="n" x="' + (x + 80) + '" y="22" text-anchor="middle">' + n + '</text>' + movingBlocks(Math.floor(n / 10), n % 10, x + 6, 34, 9, from); };
      return svg(340, 130, ex.a + ' and ' + ex.b + ' built from rods and cubes, one at a time.',
        side(ex.a, 0, 0) + '<line x1="170" y1="6" x2="170" y2="124" stroke="#c6e3da" stroke-width="2"/>' + side(ex.b, 172, Math.floor(ex.a / 10) + ex.a % 10));
    }
    return svg(340, 120, ex.n + ' built from ' + words(ex.t, ex.o) + ', one at a time.', movingBlocks(ex.t, ex.o, 12, 10, 10, 0));
  }
  var HOW = {
    read: 'Count the rods first, in tens. Then count on the single cubes.',
    build: 'Put down one rod for each ten. Then one cube for each one.',
    compare: 'Look at the tens first. The number with more tens is more. If the tens are the same, look at the ones.'
  };
  function shows(e, avoid) {
    var used = e.game === 'compare' ? [e.a, e.b] : [e.n];
    return used.some(function (v) { return avoid.indexOf(v) > -1; });
  }
  function lessonFor(game) {
    var ex, tries = 0, avoid = r.game === 'compare' ? [r.a, r.b] : [r.n];
    do { ex = MAKE[game](); tries++; } while (shows(ex, avoid) && tries < 50);
    var box = el('section', { 'class': 'how-panel', id: 'lesson', 'aria-labelledby': 'lesson-h' });
    box.appendChild(el('h3', { id: 'lesson-h', 'class': 'how-title', tabindex: '-1' }, 'Short lesson'));
    box.appendChild(el('p', {}, HOW[game]));
    var pic = el('div', { 'class': 'moving' });
    pic.innerHTML = lessonArt(ex);
    box.appendChild(pic);
    box.appendChild(el('p', { id: 'lesson-say' }, ex.game === 'compare' ? ex.right : countWords(ex.n)));
    var again = el('button', { type: 'button', id: 'watch-again' }, 'Watch again');
    again.addEventListener('click', function () { pic.innerHTML = lessonArt(ex); });
    box.appendChild(again);
    box.appendChild(el('p', { 'class': 'muted' }, game === 'build' ? 'Now build the number above again.' : 'Now try the question above again.'));
    return box;
  }
  /* The lesson lives under the tip, outside the panel, so building blocks does not close it. */
  function howHolder() {
    var h = $('howbox');
    if (!h) { h = el('div', { id: 'howbox' }); $('tip').insertAdjacentElement('afterend', h); }
    return h;
  }
  function offerHow() {
    var h = howHolder();
    if (h.firstChild) return;
    var how = el('button', { type: 'button', id: 'howbtn' }, 'Show me how');
    how.addEventListener('click', function () {
      h.innerHTML = '';
      h.appendChild(lessonFor(r.game));
      $('lesson-h').focus();
    });
    h.appendChild(how);
  }
  var TITLES = { read: 'How many?', build: 'Build the number', compare: 'More or less?' };
  var TRY = { read: 'Not yet. Count the rods in tens, then count on the cubes.', build: 'Not yet. Count the tens, then the ones.', compare: 'Not yet. Look at the tens first.' };

  /* ---------- the game ---------- */
  var game = null, idx = 0, r = null, solved = false, have = { t: 0, o: 0 };
  function show(id) { ['menu', 'game', 'alldone'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function start(g) { game = g; idx = 0; $('title').textContent = TITLES[g]; show('game'); round(); }
  function round() {
    r = MAKE[game](); solved = false; have = { t: 0, o: 0 };
    howHolder().innerHTML = '';
    $('count').textContent = 'Round ' + (idx + 1) + ' of ' + ROUNDS;
    $('say').textContent = r.say;
    render();
    var first = document.querySelector('#panel button'); if (first) first.focus();
  }
  function setTip(text, tryIt) { var tip = $('tip'); tip.className = tryIt ? 'tip try' : 'tip'; tip.textContent = text; }
  function render(keepTip) {
    var art = $('art'), panel = $('panel'), go = $('go');
    panel.innerHTML = ''; if (!keepTip) setTip('', false);
    go.hidden = !solved; go.textContent = idx < ROUNDS - 1 ? 'Next round' : 'Finish';
    if (r.game === 'read') art.innerHTML = onePic(r.t, r.o);
    if (r.game === 'compare') art.innerHTML = twoPics(r.a, r.b);
    if (r.game === 'build') {
      art.innerHTML = onePic(have.t, have.o);
      var n = have.t * 10 + have.o;
      panel.appendChild(el('p', { id: 'have', 'class': 'sentence' }, pl(have.t, 'ten') + ' and ' + pl(have.o, 'one') + ' make ' + n + '.'));
      if (!solved) {
        var row = el('div', { 'class': 'row builders', id: 'builders' });
        [['add-ten', '+ Ten', function () { if (have.t < 9) { have.t += 1; return ''; } return 'That is 9 tens already. 10 tens would be 100.'; }],
         ['add-one', '+ One', function () { if (have.o < 9) { have.o += 1; return ''; } return '10 ones make a ten. Use a rod instead.'; }],
         ['take-ten', '− Ten', function () { if (have.t > 0) { have.t -= 1; return ''; } return 'There are no rods to take away.'; }],
         ['take-one', '− One', function () { if (have.o > 0) { have.o -= 1; return ''; } return 'There are no cubes to take away.'; }]
        ].forEach(function (b) {
          var btn = el('button', { type: 'button', id: b[0] }, b[1]);
          btn.addEventListener('click', function () { var msg = b[2](); render(true); setTip(msg, !!msg); $(b[0]).focus(); });
          row.appendChild(btn);
        });
        panel.appendChild(row);
        var check = el('button', { type: 'button', id: 'check', 'class': 'primary' }, 'Check');
        check.addEventListener('click', function () {
          if (have.t * 10 + have.o === r.n) { solved = true; howHolder().innerHTML = ''; render(); $('go').focus(); }
          else { setTip(TRY.build, true); offerHow(); }
        });
        panel.appendChild(el('div', { 'class': 'row' })).appendChild(check);
        return;
      }
    }
    if (solved) {
      panel.appendChild(el('p', { id: 'right', 'class': 'ask' }, r.right));
      setTip('Well done!', false);
      return;
    }
    panel.appendChild(el('p', { 'class': 'ask' }, r.game === 'read' ? 'How many?' : 'Tap the number.'));
    var opts = r.game === 'compare' ? [r.a, r.b] : choices(r.ans);
    var row2 = el('div', { 'class': 'row', id: 'choices' });
    opts.forEach(function (v) {
      var b = el('button', { type: 'button', 'data-v': String(v) }, String(v));
      b.addEventListener('click', function () {
        if (v === r.ans) { solved = true; howHolder().innerHTML = ''; render(); $('go').focus(); }
        else { b.classList.add('wrong'); b.disabled = true; setTip(TRY[r.game], true); offerHow(); }
      });
      row2.appendChild(b);
    });
    panel.appendChild(row2);
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
  window.YS_TENS = { make: MAKE, choices: choices, current: function () { return r; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
