/* Yaanstep Sprouts: Weather and temperature (ages 3 to 8; Manish, 22 Nov 2026).
   Learn: a moving lesson in 6 parts. Games: Find the weather, Dress for the weather, Read the thermometer, Warmer or colder?
   Degrees in °F (used in the US) or °C, chosen on the menu for this visit only. Our own drawings. Nothing is stored or sent. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle, cap = S.cap;
  var PICS = window.YS_PICTURES || {};
  var INK = '#17332c', RED = '#D7263D';

  /* ---------- weather scenes (120 x 90) ---------- */
  function cloud(x, y, s, fill) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M10 30a12 12 0 0 1 4-23a16 16 0 0 1 29-3a12 12 0 0 1 17 9a10 10 0 0 1-2 20H12a10 10 0 0 1-2-3z" fill="' + fill + '" stroke="' + INK + '" stroke-width="2"/></g>';
  }
  function drops(color, cls) {
    var out = '';
    for (var i = 0; i < 9; i++) {
      var x = 22 + i * 9 + (i % 2) * 3, y = 52 + (i % 3) * 8;
      out += '<line class="' + (i % 2 ? cls + '2' : cls) + '" x1="' + x + '" y1="' + y + '" x2="' + (x - 3) + '" y2="' + (y + 8) + '" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round"/>';
    }
    return out;
  }
  var WEATHER = {
    sunny: { sky: '#BFE4FF', say: 'It is sunny. The sun shines and the sky is blue.',
      art: function () {
        var rays = '';
        for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; rays += '<line x1="' + (60 + 22 * Math.cos(a)).toFixed(1) + '" y1="' + (42 + 22 * Math.sin(a)).toFixed(1) + '" x2="' + (60 + 32 * Math.cos(a)).toFixed(1) + '" y2="' + (42 + 32 * Math.sin(a)).toFixed(1) + '" stroke="#E8A317" stroke-width="4" stroke-linecap="round"/>'; }
        return '<g class="mv-spin">' + rays + '</g><circle cx="60" cy="42" r="17" fill="#F7C948" stroke="' + INK + '" stroke-width="2"/>';
      } },
    cloudy: { sky: '#d5dde3', say: 'It is cloudy. Gray clouds cover the sun.',
      art: function () { return '<g class="mv-blow">' + cloud(8, 14, 0.9, '#f4f6f8') + '</g><g class="mv-blow" style="animation-delay:.4s">' + cloud(50, 34, 0.95, '#c3ccd4') + '</g>'; } },
    rainy: { sky: '#c7d3dc', say: 'It is rainy. Rain falls from the clouds.',
      art: function () { return cloud(24, 6, 1.1, '#aab6c1') + drops('#1F5FD0', 'mv-fall'); } },
    snowy: { sky: '#e6eef5', say: 'It is snowy. Snowflakes fall and it is very cold.',
      art: function () {
        var out = cloud(24, 4, 1.1, '#f4f6f8');
        for (var i = 0; i < 8; i++) out += '<circle class="mv-snow" style="animation-delay:' + (i * 0.3).toFixed(1) + 's" cx="' + (24 + i * 10) + '" cy="' + (54 + (i % 3) * 7) + '" r="3" fill="#fff" stroke="#8aa0b4" stroke-width="1"/>';
        return out + '<rect x="0" y="80" width="120" height="10" fill="#fff"/>';
      } },
    windy: { sky: '#cfe9ff', say: 'It is windy. The wind blows leaves and kites.',
      art: function () {
        return '<g class="mv-blow"><path d="M8 30h60a10 10 0 1 0-10-10M8 46h82a10 10 0 1 1-10 10M14 62h40" fill="none" stroke="#6a8aa3" stroke-width="4" stroke-linecap="round"/></g>' +
          '<g class="mv-wiggle"><path d="M98 22l14 10-14 10-8-10z" fill="#D7263D" stroke="' + INK + '" stroke-width="2"/><path d="M98 42q-6 14 2 26" fill="none" stroke="' + INK + '" stroke-width="1.5"/></g>' +
          '<g class="mv-blow" style="animation-delay:.3s"><ellipse cx="86" cy="76" rx="7" ry="4" fill="#4caf50" transform="rotate(-25 86 76)"/></g>';
      } },
    stormy: { sky: '#8c97a6', say: 'It is stormy. There is thunder, lightning and heavy rain. Stay inside.',
      art: function () { return cloud(20, 4, 1.2, '#5d6875') + '<polygon class="mv-flash" points="62,40 52,60 60,60 54,80 72,54 63,54 70,40" fill="#F7C948" stroke="' + INK + '" stroke-width="1.5"/>' + drops('#1F5FD0', 'mv-fall'); } }
  };
  var KINDS = Object.keys(WEATHER);
  function scene(kind) { return '<rect x="0" y="0" width="120" height="90" rx="10" fill="' + WEATHER[kind].sky + '" stroke="' + INK + '" stroke-width="2"/>' + WEATHER[kind].art(); }
  function sceneEl(kind, label) { return svgEl(scene(kind), '0 0 120 90', label === false ? null : (label || cap(kind) + ' weather. ' + WEATHER[kind].say)); }

  /* ---------- things to wear (64 x 64) ---------- */
  var WEAR = {
    sunhat: { name: 'sun hat', for: 'sunny', art: '<ellipse cx="32" cy="40" rx="28" ry="9" fill="#F4D58D" stroke="' + INK + '" stroke-width="2"/><path d="M18 40c0-14 6-22 14-22s14 8 14 22z" fill="#F4D58D" stroke="' + INK + '" stroke-width="2"/><rect x="18" y="33" width="28" height="5" fill="#D7263D"/>' },
    sunglasses: { name: 'sunglasses', for: 'sunny', art: '<path d="M6 26h52" stroke="' + INK + '" stroke-width="3"/><rect x="8" y="26" width="20" height="14" rx="6" fill="#26323b" stroke="' + INK + '" stroke-width="2"/><rect x="36" y="26" width="20" height="14" rx="6" fill="#26323b" stroke="' + INK + '" stroke-width="2"/><path d="M28 30q4-3 8 0" fill="none" stroke="' + INK + '" stroke-width="2"/>' },
    umbrella: { name: 'umbrella', for: 'rainy', art: PICS.umbrella || '<path d="M6 32a26 22 0 0 1 52 0z" fill="#1F5FD0" stroke="' + INK + '" stroke-width="2"/><path d="M32 32v20a5 5 0 0 1-10 0" fill="none" stroke="' + INK + '" stroke-width="3"/>' },
    boots: { name: 'rain boots', for: 'rainy', art: '<path d="M10 14h14v30h10v12H10z" fill="#F7C948" stroke="' + INK + '" stroke-width="2"/><path d="M34 14h14v30h10v12H34z" fill="#F7C948" stroke="' + INK + '" stroke-width="2"/>' },
    woollyhat: { name: 'warm hat', for: 'snowy', art: '<path d="M12 46c0-20 9-30 20-30s20 10 20 30z" fill="#D7263D" stroke="' + INK + '" stroke-width="2"/><rect x="10" y="44" width="44" height="10" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><circle cx="32" cy="13" r="6" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' },
    mittens: { name: 'mittens', for: 'snowy', art: '<path d="M8 50V26a8 8 0 0 1 16 0v4a4 4 0 0 1 4 4v8a6 6 0 0 1-6 6v2z" fill="#1F7A6D" stroke="' + INK + '" stroke-width="2"/><path d="M36 50V26a8 8 0 0 1 16 0v4a4 4 0 0 1 4 4v8a6 6 0 0 1-6 6v2z" fill="#1F7A6D" stroke="' + INK + '" stroke-width="2"/><rect x="8" y="50" width="16" height="6" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/><rect x="36" y="50" width="16" height="6" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>' }
  };
  var WEAR_SAY = { sunny: 'On a sunny day, a sun hat and sunglasses protect you from the sun.', rainy: 'On a rainy day, an umbrella and rain boots keep you dry.', snowy: 'On a snowy day, a warm hat and mittens keep you warm.' };

  /* ---------- thermometer ---------- */
  var UNITS = {
    F: { min: 0, max: 100, label: 10, tick: 5, sym: '°F', name: 'degrees Fahrenheit' },
    C: { min: -10, max: 40, label: 10, tick: 2, sym: '°C', name: 'degrees Celsius' }
  };
  var unit = 'F';
  function U() { return UNITS[unit]; }
  function y(v) { var u = U(); return 200 - (v - u.min) / (u.max - u.min) * 180; }
  function deg(v) { return v + U().sym; }
  function degWords(v) { return (v < 0 ? 'minus ' + (-v) : v) + ' ' + U().name; }
  /** A thermometer at x (90 wide, 240 tall). from: animate the red line rising. */
  function thermo(v, x, animate, delay) {
    var u = U(), out = '<g transform="translate(' + (x || 0) + ' 0)">';
    out += '<rect x="30" y="10" width="16" height="196" rx="8" fill="#fff" stroke="' + INK + '" stroke-width="2"/>';
    for (var t = u.min; t <= u.max; t += u.tick) {
      var big = t % u.label === 0;
      out += '<line x1="46" y1="' + y(t).toFixed(1) + '" x2="' + (big ? 56 : 51) + '" y2="' + y(t).toFixed(1) + '" stroke="' + INK + '" stroke-width="' + (big ? 2 : 1) + '"/>';
      if (big) out += '<text x="58" y="' + (y(t) + 4).toFixed(1) + '" font-size="11" font-weight="700" fill="' + INK + '">' + t + '</text>';
    }
    out += '<rect' + (animate ? ' class="mv-rise" style="animation-delay:' + (delay || 0.3) + 's"' : '') + ' x="34" y="' + y(v).toFixed(1) + '" width="8" height="' + (214 - y(v)).toFixed(1) + '" fill="' + RED + '"/>';
    out += '<circle cx="38" cy="216" r="15" fill="' + RED + '" stroke="' + INK + '" stroke-width="2"/><text x="10" y="18" font-size="12" font-weight="800" fill="' + INK + '">' + u.sym + '</text></g>';
    return out;
  }
  function thermoEl(v, label) { return svgEl(thermo(v), '0 0 90 236', label || 'A thermometer marked in ' + U().name + '. The red line goes up to ' + degWords(v) + '.'); }
  function readWords(v) {
    var u = U(), base = Math.floor((v - u.min) / u.label) * u.label + u.min, extra = v - base;
    if (!extra) return 'Find the top of the red line. It stops right at a big number: ' + v + '. So it is ' + deg(v) + '.';
    var marks = extra / u.tick, steps = [];
    for (var i = 1; i <= marks; i++) steps.push(base + i * u.tick);
    return 'Find the top of the red line. The last big number below it is ' + base + '. Each small mark is ' + u.tick + ' degrees, so count on: ' + steps.join(', ') + '. So it is ' + deg(v) + '.';
  }
  function pickTemp(round) {
    var u = U(), step = round < 4 ? u.label : u.tick, n = Math.floor((u.max - u.min) / step);
    return u.min + between(1, n - 1) * step;
  }

  /* ---------- the lesson ---------- */
  function pair(a, b) { return { svg: '<g class="mv-in">' + scene(a) + '</g><g class="mv-in" style="animation-delay:.8s" transform="translate(130 0)">' + scene(b) + '</g>', vb: '0 0 250 90', label: cap(a) + ' weather and ' + b + ' weather. ' + WEATHER[a].say + ' ' + WEATHER[b].say }; }
  var LEARN = [
    { title: 'Sunny and cloudy', text: WEATHER.sunny.say + ' ' + WEATHER.cloudy.say, movie: function () { return pair('sunny', 'cloudy'); } },
    { title: 'Rainy and stormy', text: WEATHER.rainy.say + ' ' + WEATHER.stormy.say, movie: function () { return pair('rainy', 'stormy'); } },
    { title: 'Snowy and windy', text: WEATHER.snowy.say + ' ' + WEATHER.windy.say, movie: function () { return pair('snowy', 'windy'); } },
    { title: 'What to wear', text: WEAR_SAY.sunny + ' ' + WEAR_SAY.rainy + ' ' + WEAR_SAY.snowy,
      movie: function () {
        var out = '';
        ['sunny', 'rainy', 'snowy'].forEach(function (k, i) {
          var x = i * 110, items = Object.keys(WEAR).filter(function (w) { return WEAR[w].for === k; });
          out += '<g class="mv-in" style="animation-delay:' + (i * 1.1).toFixed(1) + 's"><svg x="' + x + '" y="0" width="100" height="75" viewBox="0 0 120 90">' + scene(k) + '</svg></g>';
          items.forEach(function (w, j) { out += '<g class="mv-in" style="animation-delay:' + (i * 1.1 + 0.5 + j * 0.3).toFixed(1) + 's"><svg x="' + (x + j * 50) + '" y="80" width="48" height="48" viewBox="0 0 64 64">' + WEAR[w].art + '</svg></g>'; });
        });
        return { svg: out, vb: '0 0 320 130', label: 'A sunny day with a sun hat and sunglasses. A rainy day with an umbrella and rain boots. A snowy day with a warm hat and mittens.' };
      } },
    { title: 'A thermometer', text: 'A thermometer tells us how hot or cold it is. When it is hot, the red line goes up. When it is cold, the red line goes down.',
      movie: function () {
        var u = U(), hot = u.max - 2 * u.label, cold = u.min + u.label;
        return { svg: thermo(hot, 20, true, 0.3) + '<svg x="110" y="20" width="60" height="45" viewBox="0 0 120 90">' + scene('sunny') + '</svg>' +
          thermo(cold, 180, true, 1.4) + '<svg x="250" y="20" width="60" height="45" viewBox="0 0 120 90">' + scene('snowy') + '</svg>',
          vb: '0 0 320 236', label: 'Two thermometers. On the hot sunny day the red line rises high, to ' + degWords(hot) + '. On the cold snowy day it stays low, at ' + degWords(cold) + '.' };
      } },
    { title: 'Degrees',
      text: function () {
        return unit === 'F' ? 'We measure how hot or cold it is in degrees. In the United States we use degrees Fahrenheit, °F. Water freezes into ice at 32°F. A warm room is about 70°F. A hot summer day can be 90°F or more.'
          : 'We measure how hot or cold it is in degrees. Most countries use degrees Celsius, °C. Water freezes into ice at 0°C. A warm room is about 21°C. A hot summer day can be 32°C or more.';
      },
      movie: function () {
        var marks = unit === 'F' ? [[32, 'ice'], [70, 'warm room'], [90, 'hot day']] : [[0, 'ice'], [21, 'warm room'], [32, 'hot day']], out = thermo(marks[2][0], 60, true, 0.2);
        marks.forEach(function (m, i) {
          var yy = y(m[0]);
          out += '<g class="mv-in" style="animation-delay:' + (1.2 + i * 0.8).toFixed(1) + 's"><line x1="135" y1="' + yy.toFixed(1) + '" x2="170" y2="' + yy.toFixed(1) + '" stroke="#C2410C" stroke-width="2"/><text x="175" y="' + (yy + 5).toFixed(1) + '" font-size="15" font-weight="700" fill="' + INK + '">' + deg(m[0]) + ' ' + m[1] + '</text></g>';
        });
        return { svg: out, vb: '0 0 320 236', label: 'A thermometer in ' + U().name + ' with three marks: ' + marks.map(function (m) { return m[1] + ' at ' + deg(m[0]); }).join(', ') + '.' };
      } }
  ];

  /* ---------- games ---------- */
  function find(area, ctx) {
    var ans = ctx.fresh(KINDS);
    ctx.set({ game: 'find', ans: ans });
    ctx.ask(area, 'Find the ' + ans + ' day.');
    var opts = shuffle([ans].concat(shuffle(KINDS.filter(function (k) { return k !== ans && !(ans === 'rainy' && k === 'stormy') && !(ans === 'stormy' && k === 'rainy'); })).slice(0, 2)));
    area.appendChild(ctx.tiles(opts, function (k) { var s = el('span', { 'class': 'w' }); s.appendChild(sceneEl(k, false)); return s; }, function (k, b) {
      if (k === ans) { b.classList.add('right'); ctx.win('Yes! ' + WEATHER[ans].say); }
      else ctx.miss(b, 'That day is ' + k + '. ' + WEATHER[k].say + ' Find the ' + ans + ' day.', function (box) {
        box.appendChild(el('p', {}, 'Look at this ' + ans + ' day.'));
        box.appendChild(ctx.moviePanel(function () { return { svg: scene(ans), vb: '0 0 120 90', label: cap(ans) + ' weather. ' + WEATHER[ans].say }; }));
        box.appendChild(el('p', { id: 'lesson-say' }, WEATHER[ans].say));
      });
    }, function (k) { return k + ' day'; }));
  }

  function dress(area, ctx) {
    var kind = ctx.fresh(['sunny', 'rainy', 'snowy']), right = Object.keys(WEAR).filter(function (w) { return WEAR[w].for === kind; });
    var ans = right[rnd(2)], wrongs = shuffle(Object.keys(WEAR).filter(function (w) { return WEAR[w].for !== kind; })).slice(0, 2);
    ctx.set({ game: 'dress', weather: kind, ans: ans, right: right });
    ctx.ask(area, 'It is ' + kind + '. What should you wear?');
    area.appendChild(el('div', { 'class': 'scene', id: 'weather' })).appendChild(sceneEl(kind));
    area.appendChild(ctx.tiles(shuffle([ans].concat(wrongs)), function (w) {
      var s = el('span', { 'class': 'w' }); s.appendChild(svgEl(WEAR[w].art)); s.appendChild(el('span', {}, WEAR[w].name)); return s;
    }, function (w, b) {
      if (right.indexOf(w) >= 0) { b.classList.add('right'); ctx.win('Yes! ' + WEAR_SAY[kind]); }
      else ctx.miss(b, cap(WEAR[w].name) + (WEAR[w].name === 'mittens' || /s$/.test(WEAR[w].name) ? ' are' : ' is') + ' for a ' + WEAR[w].for + ' day. It is ' + kind + ' today.', function (box) {
        var other = WEAR[w].for;
        box.appendChild(el('p', {}, 'Each kind of weather needs different things.'));
        box.appendChild(ctx.moviePanel(function () {
          var items = Object.keys(WEAR).filter(function (k) { return WEAR[k].for === other; });
          return { svg: '<g class="mv-in">' + scene(other) + '</g>' + items.map(function (k, j) { return '<g class="mv-in" style="animation-delay:' + (0.6 + j * 0.4) + 's"><svg x="' + (130 + j * 60) + '" y="15" width="56" height="56" viewBox="0 0 64 64">' + WEAR[k].art + '</svg></g>'; }).join(''),
            vb: '0 0 250 90', label: cap(other) + ' weather, with ' + items.map(function (k) { return WEAR[k].name; }).join(' and ') + '.' };
        }));
        box.appendChild(el('p', { id: 'lesson-say' }, WEAR_SAY[other] + ' Now look at the weather in the picture above again.'));
      });
    }, function (w) { return WEAR[w].name; }));
  }

  function read(area, ctx) {
    var round = ctx.round(), u = U(), v = pickTemp(round);
    ctx.set({ game: 'read', ans: v, unit: unit });
    ctx.ask(area, 'How hot or cold is it? Read the thermometer.');
    area.appendChild(el('div', { 'class': 'scene', id: 'thermo' })).appendChild(thermoEl(v, 'A thermometer marked in ' + u.name + ', with big numbers every ' + u.label + ' and small marks every ' + u.tick + '. Read where the red line stops.'));
    var pool = [v + u.tick, v - u.tick, v + u.label, v - u.label].filter(function (t) { return t >= u.min && t <= u.max && t !== v; });
    area.appendChild(ctx.tiles(shuffle([v].concat(shuffle(pool).slice(0, 2))), function (t) { return ctx.word(deg(t)); }, function (t, b) {
      if (t === v) { b.classList.add('right'); ctx.win('Yes! It is ' + deg(v) + '.', 'Yes! It is ' + degWords(v) + '.'); }
      else ctx.miss(b, 'Not ' + deg(t) + '. Find the top of the red line, then the big number just below it.', function (box) {
        var o; do { o = pickTemp(round); } while (o === v);
        box.appendChild(el('p', {}, 'Here is another thermometer.'));
        box.appendChild(ctx.moviePanel(function () { return { svg: thermo(o, 0, true, 0.3), vb: '0 0 90 236', label: 'The red line rises to ' + degWords(o) + '.' }; }));
        box.appendChild(el('p', { id: 'lesson-say' }, readWords(o)));
      });
    }, function (t) { return degWords(t); }));
  }

  function pickPos(level) { var t; do { t = pickTemp(level); } while (t < 0); return t; }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  function compare(area, ctx) {
    var round = ctx.round(), u = U(), i = rnd(6), d1 = DAYS[i], d2 = DAYS[i + 1];
    var a = pickPos(round < 4 ? 0 : 4), b;
    do { b = pickPos(round < 4 ? 0 : 4); } while (Math.abs(a - b) < (round < 4 ? 2 * u.label : u.tick * 2));
    var pic = svgEl(thermo(a, 10) + thermo(b, 140) + '<text x="55" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">' + d1 + '</text><text x="185" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">' + d2 + '</text>' +
      (round >= 4 ? '' : ''), '0 0 250 244', 'Two thermometers. ' + d1 + ': ' + degWords(a) + '. ' + d2 + ': ' + degWords(b) + '.');
    if (round < 4) {
      var want = round % 2 ? 'colder' : 'warmer', ans = (want === 'warmer') === (a > b) ? d1 : d2;
      ctx.set({ game: 'compare', ans: ans, a: a, b: b });
      ctx.ask(area, 'Which day was ' + want + '?');
      area.appendChild(el('div', { 'class': 'scene' })).appendChild(pic);
      area.appendChild(ctx.tiles([d1, d2], function (d) { return ctx.word(d); }, function (d, btn) {
        if (d === ans) { btn.classList.add('right'); ctx.win('Yes! ' + ans + ' was ' + want + '. Its red line is ' + (want === 'warmer' ? 'higher' : 'lower') + '.'); }
        else ctx.miss(btn, 'Not ' + d + '. Look at how high each red line goes.', function (box) {
          var hi = u.max - 2 * u.label, lo = u.min + 2 * u.label;
          box.appendChild(el('p', {}, 'The higher the red line goes, the warmer it is. The lower it is, the colder.'));
          box.appendChild(ctx.moviePanel(function () { return { svg: thermo(hi, 20, true, 0.3) + thermo(lo, 150, true, 1.2) + '<text x="65" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">warmer</text><text x="195" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">colder</text>', vb: '0 0 260 244', label: 'Two red lines rise. The higher one, at ' + degWords(hi) + ', is warmer. The lower one, at ' + degWords(lo) + ', is colder.' }; }));
          box.appendChild(el('p', { id: 'lesson-say' }, deg(hi) + ' is warmer than ' + deg(lo) + ' because its red line goes higher.'));
        });
      }, function (d) { return d; }, 'tiles two'));
    } else {
      var hiDay = a > b ? d1 : d2, loDay = a > b ? d2 : d1, diff = Math.abs(a - b);
      ctx.set({ game: 'compare', ans: diff, a: a, b: b });
      ctx.ask(area, d1 + ' was ' + deg(a) + '. ' + d2 + ' was ' + deg(b) + '. How many degrees warmer was ' + hiDay + ' than ' + loDay + '?',
        d1 + ' was ' + degWords(a) + '. ' + d2 + ' was ' + degWords(b) + '. How many degrees warmer was ' + hiDay + '?');
      area.appendChild(el('div', { 'class': 'scene' })).appendChild(pic);
      var pool = [diff + u.tick, diff - u.tick, diff + u.label, diff - u.label, Math.max(a, b)].filter(function (t) { return t > 0 && t !== diff; });
      area.appendChild(ctx.tiles(shuffle([diff].concat(shuffle(pool.filter(function (t, k, l) { return l.indexOf(t) === k; })).slice(0, 2))), function (t) { return ctx.word(t + '°'); }, function (t, btn) {
        if (t === diff) { btn.classList.add('right'); ctx.win('Yes! ' + Math.max(a, b) + ' − ' + Math.min(a, b) + ' = ' + diff + '. ' + hiDay + ' was ' + diff + ' degrees warmer.'); }
        else ctx.miss(btn, 'Not ' + t + '. Take the smaller number away from the bigger one.', function (box) {
          var p, q; do { p = pickPos(4); q = pickPos(4); } while (p <= q || p - q === diff);
          box.appendChild(el('p', {}, 'Here is another one: ' + deg(p) + ' and ' + deg(q) + '.'));
          box.appendChild(ctx.moviePanel(function () {
            return { svg: thermo(p, 10, true, 0.3) + thermo(q, 140, true, 0.9) + '<g class="mv-in" style="animation-delay:1.8s"><line x1="110" y1="' + y(p).toFixed(1) + '" x2="240" y2="' + y(p).toFixed(1) + '" stroke="#C2410C" stroke-width="2" stroke-dasharray="4 3"/><line x1="235" y1="' + y(p).toFixed(1) + '" x2="235" y2="' + y(q).toFixed(1) + '" stroke="#C2410C" stroke-width="3"/><text x="244" y="' + ((y(p) + y(q)) / 2 + 5).toFixed(1) + '" font-size="15" font-weight="800" fill="#C2410C">' + (p - q) + '°</text></g>',
              vb: '0 0 290 236', label: 'Two thermometers at ' + degWords(p) + ' and ' + degWords(q) + '. A mark shows the gap between the red lines: ' + (p - q) + ' degrees.' };
          }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Take the smaller number away from the bigger one: ' + p + ' − ' + q + ' = ' + (p - q) + '. So it is ' + (p - q) + ' degrees warmer.'));
        });
      }, function (t) { return t + ' degrees'; }));
    }
  }

  S.run({
    names: { learn: 'Learn about weather', find: 'Find the weather', dress: 'Dress for the weather', read: 'Read the thermometer', compare: 'Warmer or colder?' },
    learn: LEARN,
    games: { find: find, dress: dress, read: read, compare: compare },
    init: function () {
      ['F', 'C'].forEach(function (k) {
        var b = document.getElementById('unit-' + k.toLowerCase());
        b.addEventListener('click', function () {
          unit = k;
          ['f', 'c'].forEach(function (x) { document.getElementById('unit-' + x).setAttribute('aria-pressed', x === k.toLowerCase() ? 'true' : 'false'); });
        });
      });
    }
  });
  window.YS_WEATHER = { kinds: KINDS, wear: WEAR, units: UNITS, unit: function () { return unit; }, readWords: readWords };
})();
