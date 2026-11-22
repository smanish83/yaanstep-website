/* Yaanstep Sprouts: Clocks and time (ages 5 to 9; Manish, 22 Nov 2026).
   Learn: a moving lesson in 7 parts. Games: Read the clock, Set the clock, How long?
   The clock face is our own drawing. Nothing is stored or sent. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle;
  var INK = '#17332c', TEAL = '#1F7A6D', ORANGE = '#C2410C';

  /* ---------- time words ---------- */
  function norm(h) { h = ((h - 1) % 12 + 12) % 12 + 1; return h; }
  function fmt(h, m) { return norm(h) + ':' + (m < 10 ? '0' : '') + m; }
  function named(h, m) {
    if (m === 0) return norm(h) + " o'clock";
    if (m === 30) return 'half past ' + norm(h);
    if (m === 15) return 'quarter past ' + norm(h);
    if (m === 45) return 'quarter to ' + norm(h + 1);
    return '';
  }
  function fives(m) { var out = []; for (var v = 5; v <= m; v += 5) out.push(v); return out.join(', '); }
  function dur(d) {
    var h = Math.floor(d / 60), m = d % 60, out = [];
    if (h) out.push(h + (h === 1 ? ' hour' : ' hours'));
    if (m) out.push(m + ' minutes');
    return out.join(' ');
  }
  function handsSay(h, m) {
    var hh = norm(h);
    var hour = m === 0 ? 'points at the ' + hh : m === 30 ? 'is halfway between the ' + hh + ' and the ' + norm(h + 1) : 'is between the ' + hh + ' and the ' + norm(h + 1);
    var min = m === 0 ? 'points straight up at the 12' : 'points at the ' + m / 5;
    return 'The short hand ' + hour + '. The long hand ' + min + '.';
  }
  function readWords(h, m) {
    var hh = norm(h), n = named(h, m);
    var hour = m === 0 ? 'The short hand points at the ' + hh + ', so the hour is ' + hh + '.' :
      'The short hand has gone past the ' + hh + (m >= 30 ? ' and is on its way to the ' + norm(h + 1) : '') + ', so the hour is still ' + hh + '.';
    var min = m === 0 ? " The long hand points straight up at the 12, so it is " + hh + " o'clock, " + fmt(h, 0) + '.' :
      ' The long hand points at the ' + m / 5 + '. Count by fives: ' + fives(m) + '. So it is ' + fmt(h, m) + (n ? ', ' + n : '') + '.';
    return hour + min;
  }

  /* ---------- the clock ---------- */
  function face() {
    var out = '<circle cx="100" cy="100" r="94" fill="#fff" stroke="' + INK + '" stroke-width="5"/>';
    for (var i = 0; i < 60; i++) {
      var a = i * Math.PI / 30, big = i % 5 === 0, r1 = big ? 80 : 85;
      out += '<line x1="' + (100 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (100 - r1 * Math.cos(a)).toFixed(1) + '" x2="' + (100 + 89 * Math.sin(a)).toFixed(1) + '" y2="' + (100 - 89 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="' + (big ? 3 : 1) + '"/>';
    }
    for (var n = 1; n <= 12; n++) {
      var b = n * Math.PI / 6;
      out += '<text x="' + (100 + 66 * Math.sin(b)).toFixed(1) + '" y="' + (107 - 66 * Math.cos(b)).toFixed(1) + '" text-anchor="middle" font-size="20" font-weight="700" fill="' + INK + '">' + n + '</text>';
    }
    return out;
  }
  function angles(h, m) { return { h: ((h % 12) + m / 60) * 30, m: m * 6 }; }
  /** A hand. from (degrees) makes it turn from there to its place in lessons. */
  function hand(kind, deg, from, delay) {
    var long = kind === 'm', style = 'transform:rotate(' + deg + 'deg)';
    if (from != null) style += ';--from:' + from + 'deg;--to:' + deg + 'deg' + (delay ? ';animation-delay:' + delay + 's' : '');
    return '<g class="hand' + (from != null ? ' mv-turn' : '') + '" style="' + style + '"><line x1="100" y1="' + (long ? 112 : 108) + '" x2="100" y2="' + (long ? 24 : 50) + '" stroke="' + (long ? TEAL : INK) + '" stroke-width="' + (long ? 5 : 9) + '" stroke-linecap="round"/></g>';
  }
  /** The whole clock as markup in a 200 x 200 box. from: { h, m } to turn the hands from there. */
  function clock(h, m, from, delay) {
    var a = angles(h, m), f = from ? angles(from.h, from.m) : null;
    if (f && from.spins) f.m -= 360 * from.spins;
    return face() + hand('h', a.h, f ? f.h : null, delay) + hand('m', a.m, f ? f.m : null, delay) + '<circle cx="100" cy="100" r="6" fill="' + INK + '"/>';
  }
  function clockAt(x, y, size, inner) { return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 200 200">' + inner + '</svg>'; }
  function clockEl(h, m, label) { return svgEl(clock(h, m), '0 0 200 200', label || 'A clock. ' + handsSay(h, m)); }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }

  /* ---------- moving lessons ---------- */
  function readMovie(h, m) {
    var out = clock(h, m, { h: h, m: 0 }, 0.6);
    var count = m / 5;
    for (var i = 1; i <= count; i++) {
      var b = i * Math.PI / 6;
      out += '<text x="' + (100 + 46 * Math.sin(b)).toFixed(1) + '" y="' + (104 - 46 * Math.cos(b)).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + ORANGE + '"' + at(0.8 + i * 0.25) + '>' + i * 5 + '</text>';
    }
    return { svg: out, vb: '0 0 200 200', label: 'A clock. The long hand turns from the 12 to its place' + (m ? ', counting by fives: ' + fives(m) : '') + '. ' + handsSay(h, m) + ' It is ' + fmt(h, m) + '.' };
  }
  function setWords(h, m) {
    if (m === 0) return 'For ' + fmt(h, 0) + ", the long hand points straight up at the 12 and the short hand points at the " + norm(h) + '.';
    return 'For ' + fmt(h, m) + ', move the long hand to the ' + m / 5 + ', because ' + m / 5 + (m === 5 ? ' five makes ' : ' fives make ') + m + '. The short hand moves a little too: it is ' + (m === 30 ? 'halfway' : 'part of the way') + ' from the ' + norm(h) + ' to the ' + norm(h + 1) + '.';
  }
  function setMovie(h, m) { return { svg: clock(h, m, { h: 12, m: 0, spins: 0 }, 0.3), vb: '0 0 200 200', label: 'Both hands turn from 12 o\'clock to ' + fmt(h, m) + '. ' + handsSay(h, m) };
  }
  function howLongStops(sh, sm, d) {
    var t = sh * 60 + sm, end = t + d, s = [t];
    while (t + 60 <= end) { t += 60; s.push(t); }
    if (t < end) s.push(end);
    return s;
  }
  function tFmt(t) { return fmt(Math.floor(t / 60), t % 60); }
  function howLongMovie(sh, sm, d) {
    var s = howLongStops(sh, sm, d), gap = 280 / (s.length - 1), out = '<line x1="20" y1="70" x2="300" y2="70" stroke="' + INK + '" stroke-width="2"/>';
    s.forEach(function (v, i) {
      var x = 20 + i * gap;
      out += '<line x1="' + x + '" y1="62" x2="' + x + '" y2="78" stroke="' + INK + '" stroke-width="2"/><text x="' + x + '" y="98" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">' + tFmt(v) + '</text>';
      if (i) {
        var x0 = x - gap, mid = (x0 + x) / 2, step = v - s[i - 1];
        out += '<g class="mv-draw"><path d="M' + x0 + ' 60 Q' + mid + ' 14 ' + x + ' 60" fill="none" stroke="' + ORANGE + '" stroke-width="3" pathLength="1" style="animation-delay:' + (0.3 + (i - 1) * 1.1).toFixed(2) + 's"/></g>' +
          '<text x="' + mid + '" y="30" text-anchor="middle" font-size="13" font-weight="800" fill="' + ORANGE + '"' + at(0.9 + (i - 1) * 1.1) + '>' + (step === 60 ? '1 hour' : step + ' min') + '</text>';
      }
    });
    out += '<text x="160" y="126" text-anchor="middle" font-size="17" font-weight="800" fill="' + TEAL + '"' + at(0.6 + (s.length - 1) * 1.1) + '>' + dur(d) + '</text>';
    return { svg: out, vb: '0 0 320 136', label: 'A time line from ' + tFmt(s[0]) + ' to ' + tFmt(s[s.length - 1]) + ', in jumps of one hour' + (d % 60 ? ' and then ' + d % 60 + ' minutes' : '') + '. It takes ' + dur(d) + '.' };
  }
  function howLongWords(sh, sm, d) {
    var s = howLongStops(sh, sm, d), parts = [], hours = 0;
    for (var i = 1; i < s.length; i++) {
      if (s[i] - s[i - 1] === 60) { hours++; parts.push(tFmt(s[i]) + ' is ' + hours + (hours === 1 ? ' hour' : ' hours')); }
      else parts.push('then ' + tFmt(s[i - 1]) + ' to ' + tFmt(s[i]) + ' is ' + (s[i] - s[i - 1]) + ' minutes more');
    }
    return 'Start at ' + tFmt(s[0]) + ' and count on in hours: ' + parts.join(', ') + '. So it takes ' + dur(d) + '.';
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'A clock has two hands', text: 'The short hand shows the hour. The long hand shows the minutes. Both hands turn the same way, round and round.',
      movie: function () {
        var a = angles(3, 0);
        return { svg: face() + '<g' + at(0.4) + '>' + hand('h', a.h) + '</g><g' + at(1.4) + '>' + hand('m', a.m) + '</g><circle cx="100" cy="100" r="6" fill="' + INK + '"/>', vb: '0 0 200 200',
          label: 'A clock. First the short hand appears, then the long hand.' };
      } },
    { title: "O'clock", text: "When the long hand goes all the way round, one hour has passed, and the short hand moves from the 2 to the 3. When the long hand points straight up at the 12, we say o'clock. This is 3 o'clock. We write it 3:00.",
      movie: function () { return { svg: clock(3, 0, { h: 2, m: 0, spins: 1 }, 0.3), vb: '0 0 200 200', label: "The long hand turns all the way round while the short hand moves from the 2 to the 3. It is 3 o'clock." }; } },
    { title: 'Count by fives', text: 'Each number on the clock is 5 more minutes for the long hand: 5, 10, 15, 20, and on to 60. 60 minutes make 1 hour.',
      movie: function () { var m = readMovie(12, 55); m.label = 'Around the clock, the minutes appear by fives: 5, 10, 15, up to 55, and back at the 12 makes 60.'; return m; } },
    { title: 'Half past', text: 'Half past 4 is 4:30. The long hand has gone half way round, to the 6: that is 30 minutes. The short hand is halfway between the 4 and the 5.',
      movie: function () { return readMovie(4, 30); } },
    { title: 'Quarter past and quarter to', text: 'A quarter of an hour is 15 minutes. Quarter past 7 is 7:15: the long hand points at the 3. Quarter to 8 is 7:45: the long hand points at the 9, and 15 minutes are left before 8.',
      movie: function () {
        return { svg: clockAt(0, 0, 150, clock(7, 15, { h: 7, m: 0 }, 0.3)) + clockAt(170, 0, 150, clock(7, 45, { h: 7, m: 0 }, 1.4)) +
          '<text x="75" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="' + INK + '">7:15</text><text x="245" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="' + INK + '">7:45</text>',
          vb: '0 0 320 180', label: 'Two clocks. On the first the long hand turns to the 3: quarter past 7, 7:15. On the second it turns to the 9: quarter to 8, 7:45.' };
      } },
    { title: 'Morning, afternoon and night', text: 'The short hand goes round the clock twice every day. Times from midnight to noon are a.m., like 7:00 a.m. at breakfast. Times after noon are p.m., like 1:00 p.m. after lunch and 8:00 p.m. near bedtime.',
      movie: function () {
        function sky(x, fill, sun, label, delay) {
          return '<g' + at(delay) + '><rect x="' + x + '" y="0" width="100" height="70" rx="10" fill="' + fill + '" stroke="' + INK + '" stroke-width="2"/>' + sun +
            '<text x="' + (x + 50) + '" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">' + label + '</text></g>';
        }
        return { svg: sky(5, '#FFE7B8', '<circle cx="55" cy="58" r="14" fill="#F7C948" stroke="' + INK + '"/><rect x="5" y="58" width="100" height="12" fill="#9ccf8a"/>', '7:00 a.m.', 0.2) +
          sky(110, '#BFE4FF', '<circle cx="160" cy="22" r="14" fill="#F7C948" stroke="' + INK + '"/>', '1:00 p.m.', 1) +
          sky(215, '#24305e', '<path d="M272 14a14 14 0 1 0 10 24a11 11 0 1 1-10-24z" fill="#f4efc8"/><circle cx="235" cy="18" r="2" fill="#fff"/><circle cx="295" cy="44" r="2" fill="#fff"/><circle cx="250" cy="50" r="1.6" fill="#fff"/>', '8:00 p.m.', 1.8),
          vb: '0 0 320 100', label: 'Three skies: the sun coming up at 7:00 a.m., the sun high at 1:00 p.m., and the moon and stars at 8:00 p.m.' };
      } },
    { title: 'How long?', text: howLongWords(2, 0, 150), movie: function () { return howLongMovie(2, 0, 150); } }
  ];

  /* ---------- games ---------- */
  function levelTime(round) {
    var h = between(1, 12);
    if (round < 2) return { h: h, m: 0 };
    if (round < 4) return { h: h, m: round === 2 ? 30 : [0, 30][rnd(2)] };
    if (round < 6) return { h: h, m: [15, 45][rnd(2)] };
    return { h: h, m: between(1, 11) * 5 };
  }
  function read(area, ctx) {
    var round = ctx.round(), t = levelTime(round), ans = fmt(t.h, t.m);
    ctx.set({ game: 'read', h: t.h, m: t.m, ans: ans });
    ctx.ask(area, 'What time does the clock show?');
    area.appendChild(el('div', { 'class': 'scene', id: 'clock' })).appendChild(clockEl(t.h, t.m));
    var swapped = t.m ? fmt(t.m / 5, (t.h % 12) * 5) : null;
    var pool = [fmt(t.h + 1, t.m), fmt(t.h - 1, t.m), swapped, fmt(t.h, (t.m + 30) % 60), fmt(t.h + 1, (t.m + 15) % 60)].filter(function (v, i, a) { return v && v !== ans && a.indexOf(v) === i; });
    var opts = shuffle([ans].concat(shuffle(pool).slice(0, 2)));
    area.appendChild(ctx.tiles(opts, function (v) { return ctx.word(v); }, function (v, b) {
      if (v === ans) { b.classList.add('right'); var n = named(t.h, t.m); ctx.win('Yes! It is ' + ans + (n ? ', ' + n : '') + '.'); }
      else ctx.miss(b, 'Not ' + v + '. Look at the short hand for the hour, then the long hand for the minutes.', function (box) {
        var o; do { o = levelTime(round); } while (o.h === t.h && o.m === t.m);
        box.appendChild(el('p', {}, 'Here is another clock. Watch the long hand count the minutes.'));
        box.appendChild(ctx.moviePanel(function () { return readMovie(o.h, o.m); }));
        box.appendChild(el('p', { id: 'lesson-say' }, readWords(o.h, o.m)));
      });
    }, function (v) { return v; }));
  }

  function set(area, ctx) {
    var round = ctx.round(), t = levelTime(round), step = round < 2 ? 0 : round < 4 ? 30 : round < 6 ? 15 : 5, now = 0;
    if (t.h === 12 && t.m === 0) t.h = between(1, 11);
    var target = fmt(t.h, t.m), n = named(t.h, t.m);
    var r = { game: 'set', h: t.h, m: t.m, ans: target, now: function () { return now; } };
    ctx.set(r);
    ctx.ask(area, 'Set the clock to ' + target + (n ? ', ' + n : '') + '.', 'Set the clock to ' + (n || target) + '.');
    var holder = area.appendChild(el('div', { 'class': 'scene', id: 'clock' }));
    function hm() { var hh = Math.floor(now / 60) % 12, mm = now % 60; return { h: hh === 0 ? 12 : hh, m: mm }; }
    function show() { var c = hm(); holder.innerHTML = ''; holder.appendChild(clockEl(c.h, c.m)); }
    show();
    var pad = area.appendChild(el('div', { 'class': 'setclock', id: 'setclock' }));
    function btn(id, text, delta) {
      var b = el('button', { type: 'button', id: id }, text);
      b.addEventListener('click', function () { if (ctx.solved()) return; now = ((now + delta) % 720 + 720) % 720; show(); ctx.setSub('', ''); });
      pad.appendChild(b);
    }
    btn('hour-back', 'Hour back', -60); btn('hour-on', 'Hour forward', 60);
    if (step) { btn('min-back', step + ' minutes back', -step); btn('min-on', step + ' minutes forward', step); }
    var check = el('button', { type: 'button', id: 'check', 'class': 'primary' }, 'Check');
    area.appendChild(el('div', { 'class': 'row center' })).appendChild(check);
    check.addEventListener('click', function () {
      if (ctx.solved()) return;
      var c = hm();
      if (c.h === t.h && c.m === t.m) { check.disabled = true; ctx.win('Yes! The clock shows ' + target + (n ? ', ' + n : '') + '.'); return; }
      ctx.miss(null, 'Not yet. Your clock shows ' + fmt(c.h, c.m) + '. Make it ' + target + '.', function (box) {
        var o; do { o = levelTime(round); } while (o.h === t.h && o.m === t.m);
        box.appendChild(el('p', {}, 'Watch the hands move to ' + fmt(o.h, o.m) + '.'));
        box.appendChild(ctx.moviePanel(function () { return setMovie(o.h, o.m); }));
        box.appendChild(el('p', { id: 'lesson-say' }, setWords(o.h, o.m)));
      });
    });
  }

  function howlong(area, ctx) {
    var round = ctx.round(), sh = between(1, 8), sm = round < 4 ? 0 : [0, 30][rnd(2)];
    var d = round < 4 ? between(1, 4) * 60 : between(0, 3) * 60 + [15, 30, 45][rnd(3)];
    var end = sh * 60 + sm + d, eh = Math.floor(end / 60), em = end % 60, ans = dur(d);
    ctx.set({ game: 'howlong', start: fmt(sh, sm), end: fmt(eh, em), ans: ans, minutes: d });
    ctx.ask(area, 'A game starts at ' + fmt(sh, sm) + ' and ends at ' + fmt(eh, em) + '. How long is it?');
    area.appendChild(el('div', { 'class': 'scene', id: 'clocks' })).appendChild(svgEl(clockAt(0, 0, 150, clock(sh, sm)) + clockAt(170, 0, 150, clock(eh, em)) +
      '<text x="75" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="' + INK + '">Start ' + fmt(sh, sm) + '</text><text x="245" y="172" text-anchor="middle" font-size="16" font-weight="700" fill="' + INK + '">End ' + fmt(eh, em) + '</text>',
      '0 0 320 180', 'Two clocks. Start: ' + fmt(sh, sm) + '. End: ' + fmt(eh, em) + '.'));
    var pool = [d + 60, d - 60, d + 120, d - 120, d + 30, d - 30, d + 15, d - 15].filter(function (v) { return v > 0 && v !== d && (round >= 4 || v % 60 === 0); }).map(dur);
    var opts = shuffle([ans].concat(shuffle(pool.filter(function (v, i, a) { return a.indexOf(v) === i; })).slice(0, 2)));
    area.appendChild(ctx.tiles(opts, function (v) { var s = ctx.word(v); s.style.fontSize = '1.1rem'; return s; }, function (v, b) {
      if (v === ans) { b.classList.add('right'); ctx.win('Yes! From ' + fmt(sh, sm) + ' to ' + fmt(eh, em) + ' is ' + ans + '.'); }
      else ctx.miss(b, 'Not ' + v + '. Count the hours first, then the minutes.', function (box) {
        var o; do { o = { h: between(1, 8), m: round < 4 ? 0 : 30, d: round < 4 ? between(1, 4) * 60 : between(1, 3) * 60 + 30 }; } while (o.d === d);
        box.appendChild(el('p', {}, 'Here is another one: from ' + fmt(o.h, o.m) + ' to ' + tFmt(o.h * 60 + o.m + o.d) + '.'));
        box.appendChild(ctx.moviePanel(function () { return howLongMovie(o.h, o.m, o.d); }));
        box.appendChild(el('p', { id: 'lesson-say' }, howLongWords(o.h, o.m, o.d)));
      });
    }, function (v) { return v; }));
  }

  S.run({
    area: 'maths',
    names: { learn: 'Learn to tell the time', read: 'Read the clock', set: 'Set the clock', howlong: 'How long?' },
    learn: LEARN,
    games: { read: read, set: set, howlong: howlong }
  });
  window.YS_CLOCKS = { fmt: fmt, named: named, dur: dur, angles: angles };
})();
