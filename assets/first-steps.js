/* Yaanstep Sprouts: "Shapes, colors, numbers and animals" for ages 3 to 5 (Manish, 22 Nov 2026).
   Five parts: Shapes, Colors, Numbers, Animal sounds (a game) and Tap and listen (free play).
   Every game teaches first: a miss names what was tapped and opens a short moving lesson.
   Original drawings only. The animal sounds are said by the device's own voice ("The cow says moo"):
   no recordings are used. Nothing is stored or sent. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES || {};
  var ROUNDS = 8;

  /* ---------- content ---------- */

  var SHAPES = {
    circle: { svg: '<circle cx="32" cy="32" r="24"/>', corners: [], say: 'A circle is round. It has no corners.' },
    square: { svg: '<rect x="10" y="10" width="44" height="44"/>', corners: [[10, 10], [54, 10], [54, 54], [10, 54]], say: 'A square has 4 sides, all the same length, and 4 corners.' },
    triangle: { svg: '<polygon points="32,8 58,54 6,54"/>', corners: [[32, 8], [58, 54], [6, 54]], say: 'A triangle has 3 sides and 3 corners.' },
    rectangle: { svg: '<rect x="4" y="18" width="56" height="28"/>', corners: [[4, 18], [60, 18], [60, 46], [4, 46]], say: 'A rectangle has 4 sides and 4 corners. Two sides are long and two are short.' },
    oval: { svg: '<ellipse cx="32" cy="32" rx="27" ry="17"/>', corners: [], say: 'An oval is like a stretched circle. It has no corners.' },
    star: { svg: '<polygon points="32,5 39,24 59,24 43,37 49,57 32,45 15,57 21,37 5,24 25,24"/>', corners: [[32, 5], [59, 24], [49, 57], [15, 57], [5, 24]], say: 'A star has 5 points.' },
    heart: { svg: '<path d="M32 55C12 40 5 28 12 17C19 8 29 11 32 19C35 11 45 8 52 17C59 28 52 40 32 55Z"/>', corners: [], say: 'A heart is round at the top and has a point at the bottom.' },
    diamond: { svg: '<polygon points="32,5 57,32 32,59 7,32"/>', corners: [[32, 5], [57, 32], [32, 59], [7, 32]], say: 'A diamond has 4 sides and 4 corners. It stands on one corner.' }
  };
  var SHAPE_FILL = { circle: '#F7C948', square: '#4b8be8', triangle: '#6cc66c', rectangle: '#f29a45', oval: '#f4a3b6', star: '#F7C948', heart: '#D7263D', diamond: '#9b6bd1' };
  var COLORS = {
    red: '#D7263D', blue: '#1F5FD0', yellow: '#F7C948', green: '#2E9C57', orange: '#F28C28',
    purple: '#7B3FA0', pink: '#F48FB1', brown: '#8A5A33', black: '#222222', white: '#FFFFFF'
  };
  // Pictures that are mostly that color, to show in the color lesson.
  var COLOR_THINGS = { red: ['ball', 'car'], blue: ['hat', 'cup'], yellow: ['sun', 'duck'], green: ['frog', 'tree'], orange: ['carrot', 'fish'], pink: ['pig'], brown: ['dog'], white: ['egg'], purple: [], black: [] };
  var MIXES = [['yellow', 'blue', 'green'], ['red', 'yellow', 'orange'], ['red', 'blue', 'purple'], ['red', 'white', 'pink']];
  // Our own simple drawings for animals that are not in the shared pictures.
  var MORE = {
    sheep: '<circle cx="20" cy="30" r="10" fill="#f4f4f4" stroke="#bbb"/><circle cx="32" cy="24" r="11" fill="#f4f4f4" stroke="#bbb"/><circle cx="44" cy="30" r="10" fill="#f4f4f4" stroke="#bbb"/><circle cx="32" cy="36" r="13" fill="#f4f4f4" stroke="#bbb"/><rect x="22" y="44" width="4" height="12" fill="#333"/><rect x="38" y="44" width="4" height="12" fill="#333"/><ellipse cx="52" cy="26" rx="7" ry="9" fill="#333"/><circle cx="54" cy="24" r="1.6" fill="#fff"/>',
    hen: '<ellipse cx="30" cy="38" rx="20" ry="16" fill="#c9965a"/><circle cx="46" cy="22" r="9" fill="#c9965a"/><path d="M42 12q2-6 5-1q2-6 5 1" fill="#D7263D"/><polygon points="54,22 62,25 54,28" fill="#F28C28"/><circle cx="48" cy="20" r="1.8" fill="#17332c"/><path d="M14 30q-8-6-6 8" fill="#8a5a33"/><path d="M26 54v6M34 54v6" stroke="#F28C28" stroke-width="3"/>',
    lion: '<circle cx="32" cy="32" r="26" fill="#c9762a"/><circle cx="32" cy="34" r="17" fill="#f2b45a"/><circle cx="26" cy="31" r="2.4" fill="#17332c"/><circle cx="38" cy="31" r="2.4" fill="#17332c"/><polygon points="32,37 28,41 36,41" fill="#6b3a1a"/><path d="M28 45q4 3 8 0" stroke="#6b3a1a" stroke-width="2" fill="none"/>',
    owl: '<ellipse cx="32" cy="36" rx="20" ry="24" fill="#8a5a33"/><ellipse cx="32" cy="42" rx="12" ry="14" fill="#e8c99a"/><circle cx="24" cy="26" r="8" fill="#fff"/><circle cx="40" cy="26" r="8" fill="#fff"/><circle cx="24" cy="26" r="3.5" fill="#17332c"/><circle cx="40" cy="26" r="3.5" fill="#17332c"/><polygon points="32,30 29,36 35,36" fill="#F28C28"/><polygon points="14,14 20,20 12,22" fill="#8a5a33"/><polygon points="50,14 44,20 52,22" fill="#8a5a33"/>',
    horse: '<rect x="12" y="28" width="34" height="16" rx="8" fill="#8a5a33"/><path d="M40 30l8-18 8 4-4 16z" fill="#8a5a33"/><circle cx="51" cy="18" r="1.8" fill="#17332c"/><path d="M42 12l-6 14" stroke="#3b2414" stroke-width="4"/><path d="M16 44v14M24 44v14M36 44v14M42 44v14" stroke="#8a5a33" stroke-width="4"/><path d="M12 32q-8 2-6 12" stroke="#3b2414" stroke-width="3" fill="none"/>'
  };
  var ANIMALS = [
    { a: 'cow', s: 'moo' }, { a: 'dog', s: 'woof' }, { a: 'cat', s: 'meow' }, { a: 'duck', s: 'quack' },
    { a: 'pig', s: 'oink' }, { a: 'sheep', s: 'baa' }, { a: 'hen', s: 'cluck' }, { a: 'frog', s: 'ribbit' },
    { a: 'bee', s: 'buzz' }, { a: 'lion', s: 'roar' }, { a: 'owl', s: 'hoot' }, { a: 'horse', s: 'neigh' }
  ];
  var COUNT_THINGS = ['apple', 'star', 'ball', 'cup', 'duck', 'car', 'egg', 'moon'];
  var NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function svgEl(inner, viewBox, label) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', viewBox || '0 0 64 64');
    if (label) { s.setAttribute('role', 'img'); s.setAttribute('aria-label', label); } else { s.setAttribute('aria-hidden', 'true'); }
    s.setAttribute('focusable', 'false');
    s.innerHTML = inner;
    return s;
  }
  function pic(name) { return PICS[name] || MORE[name] || ''; }
  function shapeSvg(name) { return '<g fill="' + SHAPE_FILL[name] + '" stroke="#17332c" stroke-width="2.5" stroke-linejoin="round">' + SHAPES[name].svg + '</g>'; }
  function blob(color) { return '<path d="M32 6C46 6 58 14 58 30C58 46 48 58 32 58C16 58 6 47 6 31C6 15 18 6 32 6Z" fill="' + COLORS[color] + '" stroke="#17332c" stroke-width="2"/>'; }
  function a(word) { return (/^[aeiou]/.test(word) ? 'an ' : 'a ') + word; }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function d(s) { return 'animation-delay:' + s.toFixed(2) + 's'; }

  /* ---------- voice: on-device voices only ---------- */

  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function setUpVoice() {
    var r = parseFloat(readSetting('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = null;
    try {
      var local = (window.YSVoice ? window.YSVoice.english() : window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; }));
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

  /* ---------- moving lessons ----------
     Each one builds its picture step by step. With calm mode or reduced motion the last picture shows at once. */
  function shapeMovie(name) {
    var s = SHAPES[name], out = ['<g fill="' + SHAPE_FILL[name] + '" fill-opacity=".35" class="mv-in" style="' + d(1.4) + '">' + s.svg + '</g>',
      '<g fill="none" stroke="#17332c" stroke-width="3" stroke-linejoin="round" class="mv-draw">' + s.svg.replace(/\/>$/, ' pathLength="1"/>') + '</g>'];
    s.corners.forEach(function (c, i) {
      out.push('<g class="mv-in" style="' + d(1.8 + i * 0.6) + '"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="3.5" fill="#C2410C"/></g>');
    });
    var label = cap(a(name)) + ' is drawn' + (s.corners.length ? ', then a dot appears on each of its ' + s.corners.length + (name === 'star' ? ' points' : ' corners') : '') + '.';
    return { svg: out.join(''), label: label, say: s.say };
  }
  function countMovie(n, thing) {
    var out = [], per = n > 5 ? 5 : n, size = 44;
    for (var i = 0; i < n; i++) {
      var col = i % per, row = Math.floor(i / per), x = 10 + col * (size + 12) + (5 - per) * (size + 12) / 2, y = 8 + row * (size + 28);
      out.push('<g class="mv-in" style="' + d(0.3 + i * 0.6) + '"><svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 64 64">' + pic(thing) + '</svg>' +
        '<text x="' + (x + size / 2) + '" y="' + (y + size + 18) + '" text-anchor="middle" class="num">' + (i + 1) + '</text></g>');
    }
    var h = n > 5 ? 2 * (size + 28) + 8 : size + 36;
    return { svg: out.join(''), vb: '0 0 300 ' + h, label: 'Counting ' + n + ' ' + thing + (n === 1 ? '' : 's') + ', one at a time: ' + Array.apply(null, Array(n)).map(function (_, i) { return i + 1; }).join(', ') + '.' };
  }
  function mixMovie(m) {
    var out = '<circle class="mv-slide" style="--dx:-40px;' + d(0.3) + '" cx="130" cy="44" r="30" fill="' + COLORS[m[0]] + '" stroke="#17332c" stroke-width="2"/>' +
      '<circle class="mv-slide" style="--dx:40px;' + d(0.3) + '" cx="170" cy="44" r="30" fill="' + COLORS[m[1]] + '" stroke="#17332c" stroke-width="2"/>' +
      '<g class="mv-in" style="' + d(1.4) + '"><text x="150" y="100" text-anchor="middle" class="num">=</text><circle cx="150" cy="140" r="30" fill="' + COLORS[m[2]] + '" stroke="#17332c" stroke-width="2"/></g>';
    return { svg: out, vb: '0 0 300 176', label: cap(m[0]) + ' and ' + m[1] + ' slide together and make ' + m[2] + '.' };
  }
  function soundMovie(an) {
    return { svg: '<g class="mv-bounce"><svg x="20" y="20" width="120" height="120" viewBox="0 0 64 64">' + pic(an.a) + '</svg></g>' +
      '<g class="mv-in" style="' + d(0.6) + '"><path d="M160 30h120a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14h-90l-24 20 6-20h-12a14 14 0 0 1-14-14v-40a14 14 0 0 1 14-14z" fill="#fff" stroke="#17332c" stroke-width="2.5"/>' +
      '<text x="220" y="74" text-anchor="middle" class="num">' + cap(an.s) + '!</text></g>', vb: '0 0 300 150', label: 'The ' + an.a + ' says ' + an.s + '.' };
  }
  function moviePanel(make) {
    var m = make(), box = el('div', { 'class': 'moving' });
    function put() { m = make(); box.innerHTML = ''; box.appendChild(svgEl(m.svg, m.vb, m.label)); }
    put();
    var wrap = el('div');
    wrap.appendChild(box);
    var again = el('button', { type: 'button', 'class': 'small watch-again' }, 'Watch again');
    again.addEventListener('click', put);
    wrap.appendChild(again);
    return wrap;
  }

  /* ---------- game shell ---------- */

  var game = null, round = 0, r = null, solved = false, lastAns = [];
  var NAMES = { shapes: 'Shapes', colors: 'Colors', numbers: 'Numbers', animals: 'Animal sounds', listen: 'Tap and listen' };
  function show(id) { ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; }); }
  function setSub(text, kind) { var s = $('sub'); s.className = 'sub' + (kind ? ' ' + kind : ''); s.textContent = text; }
  function fresh(list) {
    var pool = list.filter(function (x) { return lastAns.indexOf(x) < 0; });
    var pick = (pool.length ? pool : list)[rnd((pool.length ? pool : list).length)];
    lastAns.push(pick); if (lastAns.length > 3) lastAns.shift();
    return pick;
  }
  function start(g) {
    game = g; round = 0; lastAns = [];
    $('title').textContent = NAMES[g];
    $('alldone').hidden = true; $('game').querySelector('.card').hidden = false;
    show('game');
    draw();
  }
  function draw() {
    solved = false;
    $('area').innerHTML = ''; $('howbox').innerHTML = ''; setSub('');
    $('more').hidden = true;
    $('count').textContent = game === 'listen' ? '' : 'Round ' + (round + 1) + ' of ' + ROUNDS;
    $('again').hidden = game === 'listen';
    ({ shapes: drawShapes, colors: drawColors, numbers: drawNumbers, animals: drawAnimals, listen: drawListen })[game]($('area'));
  }
  function win(text, speak) {
    if (!solved) point(game);
    solved = true;
    setSub(text, 'yes');
    $('howbox').innerHTML = '';
    var more = $('more');
    more.textContent = round < ROUNDS - 1 ? 'Next' : 'Finish';
    more.hidden = false;
    more.focus();
    say(speak || text);
  }
  function next() {
    hush();
    if (round < ROUNDS - 1) { round++; draw(); return; }
    $('game').querySelector('.card').hidden = true;
    $('alldone').hidden = false;
    $('keep').focus();
  }
  // A miss names what was tapped, kindly, and offers a short moving lesson about what was asked for.
  function miss(btn, text, lesson) {
    btn.classList.add('wrong'); btn.disabled = true;
    setSub(text, 'try');
    say(text);
    var h = $('howbox');
    if (h.firstChild) return;
    var b = el('button', { type: 'button', id: 'howbtn' }, 'Show me how');
    b.addEventListener('click', function () {
      var box = el('section', { 'class': 'how-panel', id: 'lesson', 'aria-labelledby': 'lesson-h' });
      box.appendChild(el('h3', { id: 'lesson-h', tabindex: '-1' }, 'Short lesson'));
      lesson(box);
      box.appendChild(el('p', { 'class': 'muted' }, 'Now try again.'));
      h.innerHTML = ''; h.appendChild(box);
      $('lesson-h').focus();
    });
    h.appendChild(b);
  }
  /** A point for a question answered right, kept only with a child profile (YSPoints, in profile.js).
      Counting and shapes are maths; colors and animal sounds are about the world. Tap and listen is free play, with no questions. */
  var AREA = { shapes: 'maths', numbers: 'maths', colors: 'world', animals: 'world' };
  function point(g) { if (window.YSPoints && AREA[g]) window.YSPoints.add(AREA[g], 1); }
  /** Fewer choices (a comfort setting in the child's profile): keeps the right answer and one wrong one. */
  function fewer(list, right) { return window.YSComfort ? window.YSComfort.fewer(list, right) : list; }
  function tiles(options, draw1, onPick, labelOf) {
    options = fewer(options, r && r.ans);
    var row = el('div', { 'class': 'tiles', id: 'choices' });
    options.forEach(function (o) {
      var b = el('button', { type: 'button', 'class': 'tile', 'data-v': String(o), 'aria-label': labelOf(o) });
      b.appendChild(draw1(o));
      b.addEventListener('click', function () { if (!solved) onPick(o, b); });
      row.appendChild(b);
    });
    return row;
  }
  function others(list, ans, n) { return shuffle(list.filter(function (x) { return x !== ans; })).slice(0, n); }

  /* ---------- Shapes ---------- */

  function drawShapes(area) {
    var names = Object.keys(SHAPES), ans = fresh(round < 3 ? names.slice(0, 4) : names);
    r = { ans: ans, prompt: 'Find the ' + ans + '.' };
    area.appendChild(el('p', { 'class': 'ask' }, r.prompt));
    area.appendChild(tiles(shuffle([ans].concat(others(round < 3 ? names.slice(0, 4) : names, ans, 2))),
      function (o) { return svgEl(shapeSvg(o)); },
      function (o, b) {
        if (o === ans) { b.classList.add('right'); win('Yes! That is ' + a(ans) + '. ' + SHAPES[ans].say); }
        else miss(b, 'That is ' + a(o) + '. Find the ' + ans + '.', function (box) {
          box.appendChild(el('p', {}, 'Here is ' + a(ans) + '. Watch it being drawn.'));
          box.appendChild(moviePanel(function () { var m = shapeMovie(ans); return { svg: m.svg, label: m.label }; }));
          box.appendChild(el('p', { id: 'lesson-say' }, SHAPES[ans].say));
        });
      }, function (o) { return o; }));
    say(r.prompt);
  }

  /* ---------- Colors ---------- */

  function drawColors(area) {
    var names = Object.keys(COLORS), basic = names.slice(0, 6), ans = fresh(round < 4 ? basic : names);
    r = { ans: ans, prompt: 'Find ' + ans + '.' };
    area.appendChild(el('p', { 'class': 'ask' }, r.prompt));
    // Choices never put two colors side by side that are hard to tell apart for many children with color blindness.
    var clash = { red: ['green', 'brown'], green: ['red', 'brown'], brown: ['red', 'green'], pink: ['purple'], purple: ['pink', 'blue'], blue: ['purple'] };
    var pool = (round < 4 ? basic : names).filter(function (c) { return c !== ans && (clash[ans] || []).indexOf(c) < 0; });
    var picks = [];
    shuffle(pool).forEach(function (c) { if (picks.length < 2 && picks.every(function (p) { return (clash[p] || []).indexOf(c) < 0; })) picks.push(c); });
    area.appendChild(tiles(shuffle([ans].concat(picks)), function (o) { return svgEl(blob(o)); },
      function (o, b) {
        if (o === ans) { b.classList.add('right'); win('Yes! That is ' + ans + '.'); }
        else miss(b, 'That is ' + o + '. Find ' + ans + '.', function (box) {
          var mix = MIXES.filter(function (m) { return m[2] === ans; })[0];
          var things = COLOR_THINGS[ans] || [];
          box.appendChild(el('p', {}, 'This is ' + ans + '.'));
          var row = el('div', { 'class': 'colorrow' });
          row.appendChild(svgEl('<g class="mv-pulse">' + blob(ans) + '</g>', '0 0 64 64', cap(ans)));
          things.forEach(function (t) { row.appendChild(svgEl(pic(t), '0 0 64 64', a(t))); });
          box.appendChild(row);
          if (things.length) box.appendChild(el('p', {}, 'Look: ' + things.map(function (t) { return a(t); }).join(' and ') + (things.length > 1 ? ' are ' : ' is ') + ans + '.'));
          if (mix) {
            box.appendChild(moviePanel(function () { return mixMovie(mix); }));
            box.appendChild(el('p', { id: 'lesson-say' }, cap(mix[0]) + ' and ' + mix[1] + ' mixed together make ' + ans + '.'));
          } else box.appendChild(el('p', { id: 'lesson-say' }, 'Point to something ' + ans + ' around you.'));
        });
      }, function (o) { return o; }));
    say(r.prompt);
  }

  /* ---------- Numbers ---------- */

  function rowOf(n, thing) {
    var per = n > 5 ? 5 : n, inner = '';
    for (var i = 0; i < n; i++) inner += '<svg x="' + ((i % per) * 58 + (5 - per) * 29) + '" y="' + (Math.floor(i / 5) * 58) + '" width="50" height="50" viewBox="0 0 64 64">' + pic(thing) + '</svg>';
    return svgEl(inner, '0 0 290 ' + (n > 5 ? 108 : 50), n + ' ' + thing + (n === 1 ? '' : 's'));
  }
  function drawNumbers(area) {
    var max = round < 3 ? 5 : 10, ans = fresh(Array.apply(null, Array(max)).map(function (_, i) { return i + 1; })), thing = COUNT_THINGS[rnd(COUNT_THINGS.length)];
    var howMany = round % 2 === 0;
    r = { ans: ans, thing: thing, prompt: howMany ? 'How many ' + thing + 's? Count them.' : 'Find the number ' + ans + '.' };
    area.appendChild(el('p', { 'class': 'ask' }, r.prompt));
    if (howMany) area.appendChild(el('div', { 'class': 'countpic', id: 'countpic' })).appendChild(rowOf(ans, thing));
    var near = [ans - 1, ans + 1, ans + 2, ans - 2].filter(function (v) { return v >= 1 && v <= 10; });
    area.appendChild(tiles(shuffle([ans].concat(shuffle(near).slice(0, 2))), function (o) {
      var s = el('span', { 'class': 'numtile' }); s.textContent = String(o); return s;
    }, function (o, b) {
      if (o === ans) { b.classList.add('right'); win('Yes! ' + cap(NUMBER_WORDS[ans]) + '.' + (howMany ? ' There are ' + ans + ' ' + thing + (ans === 1 ? '' : 's') + '.' : '')); }
      else miss(b, 'That is ' + NUMBER_WORDS[o] + '. ' + (howMany ? 'Touch each one and count again.' : 'Find ' + NUMBER_WORDS[ans] + '.'), function (box) {
        // Counting another number of things, so the lesson teaches counting without giving this answer away.
        var n = ans === 3 ? 4 : 3;
        if (!howMany) n = ans;
        var other = COUNT_THINGS.filter(function (t) { return t !== thing; })[rnd(COUNT_THINGS.length - 1)];
        box.appendChild(el('p', {}, howMany ? 'Count with me. Touch each one and say the next number. The last number you say is how many.' : 'This is the number ' + ans + '. Watch me count ' + ans + (ans === 1 ? ' thing.' : ' things.')));
        box.appendChild(moviePanel(function () { return countMovie(n, other); }));
        box.appendChild(el('p', { id: 'lesson-say' }, Array.apply(null, Array(n)).map(function (_, i) { return i + 1; }).join(', ') + '. That makes ' + NUMBER_WORDS[n] + '.'));
      });
    }, function (o) { return String(o); }));
    say(r.prompt);
  }

  /* ---------- Animal sounds ---------- */

  function animalTile(an) {
    var s = el('span', { 'class': 'animal' });
    s.appendChild(svgEl(pic(an.a)));
    s.appendChild(el('span', { 'class': 'w' }, an.a));
    return s;
  }
  function drawAnimals(area) {
    var ans = fresh(ANIMALS.map(function (x) { return x.a; })), an = ANIMALS.filter(function (x) { return x.a === ans; })[0];
    r = { ans: ans, prompt: 'Who says ' + an.s + '?' };
    area.appendChild(el('p', { 'class': 'ask' }, r.prompt));
    var opts = shuffle([an].concat(others(ANIMALS, an, 2)));
    area.appendChild(tiles(opts.map(function (x) { return x.a; }), function (o) { return animalTile(ANIMALS.filter(function (x) { return x.a === o; })[0]); },
      function (o, b) {
        if (o === ans) {
          b.classList.add('right');
          area.appendChild(moviePanel(function () { return soundMovie(an); }));
          win('Yes! The ' + ans + ' says ' + an.s + '.', 'Yes! The ' + ans + ' says ' + an.s + '! ' + cap(an.s) + '!');
        } else {
          var other = ANIMALS.filter(function (x) { return x.a === o; })[0];
          miss(b, 'The ' + o + ' says ' + other.s + '. Who says ' + an.s + '?', function (box) {
            box.appendChild(el('p', {}, 'Listen to each animal. Then find the one that says ' + an.s + '.'));
            box.appendChild(moviePanel(function () { return soundMovie(other); }));
            box.appendChild(el('p', { id: 'lesson-say' }, 'The ' + o + ' says ' + other.s + '. Tap Hear it again to hear the question.'));
          });
        }
      }, function (o) { return o; }));
    say(r.prompt);
  }

  /* ---------- Tap and listen: free play, no questions ---------- */

  function drawListen(area) {
    r = null;
    area.appendChild(el('p', { 'class': 'ask' }, 'Tap an animal to hear what it says.'));
    var grid = el('div', { 'class': 'tiles listen', id: 'listen' });
    ANIMALS.forEach(function (an) {
      var b = el('button', { type: 'button', 'class': 'tile', 'data-v': an.a });
      b.appendChild(animalTile(an));
      var bubble = el('span', { 'class': 'bubble', 'aria-hidden': 'true' }, cap(an.s) + '!');
      b.appendChild(bubble);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(grid.querySelectorAll('.tile.talking'), function (t) { t.classList.remove('talking'); });
        b.classList.add('talking');
        setSub('The ' + an.a + ' says ' + an.s + '!', 'yes');
        say('The ' + an.a + ' says ' + an.s + '! ' + cap(an.s) + '!');
      });
      grid.appendChild(b);
    });
    area.appendChild(grid);
  }

  /* ---------- wiring ---------- */

  function init() {
    setUpVoice();
    try { window.speechSynthesis.addEventListener('voiceschanged', setUpVoice); } catch (e) { /* no voices */ }
    Object.keys(NAMES).forEach(function (g) { $('play-' + g).addEventListener('click', function () { start(g); }); });
    $('more').addEventListener('click', next);
    $('again').addEventListener('click', function () { if (r) say(r.prompt); });
    function back() { hush(); $('game').querySelector('.card').hidden = false; $('alldone').hidden = true; show('menu'); $('play-' + game).focus(); }
    $('exit').addEventListener('click', back);
    $('stop').addEventListener('click', back);
    $('keep').addEventListener('click', function () { start(game); });
    show('menu');
  }
  // Test hooks: the content, and the round on screen.
  window.YS_FIRST = { shapes: SHAPES, colors: COLORS, animals: ANIMALS, mixes: MIXES, current: function () { return r; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
