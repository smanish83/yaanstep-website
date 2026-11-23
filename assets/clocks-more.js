/* Yaanstep Sprouts: Clocks and time, two more games (23 Nov 2026, Manish: "Add world time in Clocks and time,
   also add a games like I am backing a bread, i have to set timer for 45 minutes or seconds, set the timer for it").
   - Time around the world: a row of city cards, each with its flag, its own clock, and a sun or a moon. The times
     come from this device's clock and the browser's own time zone data (Intl), nothing from the internet.
     Tapping a card says the time there. Questions: day or night, where is it night, what time is it, how many hours ahead.
   - Kitchen timer: an everyday job ("I am baking bread") needs a timer. The child sets it with + and − buttons.
     When it is right, the timer runs down in about 3 seconds (at once with reduced motion or the calm setting),
     rings with a picture only, and the job is done. There is never a real wait.
   Each game fits the child's age from the profile ("ys-profile", read only). With no profile: the middle level.
   Pictures are our own drawings. Nothing is stored or sent. clocks.js adds these games to the page. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle;
  var INK = '#17332c', TEAL = '#1F7A6D', ORANGE = '#C2410C', NIGHT = '#1f2a52';

  /* ---------- the child's age and comfort settings, read only ---------- */
  function profile() { try { return JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); } catch (e) { return null; } }
  function age() { var p = profile(), a = p && +p.age; return a >= 3 && a <= 12 ? a : 0; }
  /** 0 for ages 3 to 5, 1 for 6 and 7 (and with no profile), 2 for 8 and up. */
  function level(a) { if (a === undefined) a = age(); return !a ? 1 : a <= 5 ? 0 : a <= 7 ? 1 : 2; }
  function calm() { var p = profile(); return !!(p && Array.isArray(p.comfort) && p.comfort.indexOf('calm') > -1); }
  function still() {
    if (calm()) return true;
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }

  /* =====================================================================
     Time around the world
     ===================================================================== */
  var CITIES = [
    { id: 'los-angeles', name: 'Los Angeles', country: 'the United States', flag: 'united-states', zone: 'America/Los_Angeles' },
    { id: 'new-york', name: 'New York', country: 'the United States', flag: 'united-states', zone: 'America/New_York' },
    { id: 'london', name: 'London', country: 'the United Kingdom', flag: 'united-kingdom', zone: 'Europe/London' },
    { id: 'lagos', name: 'Lagos', country: 'Nigeria', flag: 'nigeria', zone: 'Africa/Lagos' },
    { id: 'delhi', name: 'Delhi', country: 'India', flag: 'india', zone: 'Asia/Kolkata' },
    { id: 'bangkok', name: 'Bangkok', country: 'Thailand', flag: 'thailand', zone: 'Asia/Bangkok' },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: 'japan', zone: 'Asia/Tokyo' },
    { id: 'sydney', name: 'Sydney', country: 'Australia', flag: 'australia', zone: 'Australia/Sydney' }
  ];
  function hereZone() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }

  /** The time in a zone at a moment: hour (0 to 23), minute, offset from UTC in minutes, and day (6 a.m. to 6 p.m.). */
  function timeIn(zone, now) {
    var o = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' };
    if (zone) o.timeZone = zone;
    var p = {};
    new Intl.DateTimeFormat('en-US', o).formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var h = (+p.hour) % 24, m = +p.minute, base = Math.floor(now.getTime() / 60000) * 60000;
    var off = Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, h, m) - base) / 60000);
    return { h: h, m: m, off: off, day: h >= 6 && h < 18 };
  }
  function partNoun(h) { return h < 5 || h >= 21 ? 'night' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }
  function partPhrase(h) { var n = partNoun(h); return n === 'night' ? 'at night' : 'in the ' + n; }
  /** "9:42 p.m.", the label on a card and on time choices. */
  function label(t) { return (t.h % 12 || 12) + ':' + pad(t.m) + (t.h < 12 ? ' a.m.' : ' p.m.'); }
  /** "9 o'clock at night", for speaking. */
  function timeWords(t) {
    var base = t.m === 0 ? (t.h % 12 || 12) + " o'clock" : (t.h % 12 || 12) + ':' + pad(t.m);
    if (t.m === 0 && t.h === 12) return base + ', midday';
    if (t.m === 0 && t.h === 0) return base + ', midnight';
    return base + ' ' + partPhrase(t.h);
  }
  function hoursWord(n) { return n + (n === 1 ? ' hour' : ' hours'); }

  /** Every city card's time now (and "here", from this device's own time zone). */
  function worldNow(now) {
    var zones = CITIES.map(function (c) {
      var t = timeIn(c.zone, now);
      return { id: c.id, name: c.name, country: c.country, flag: c.flag, zone: c.zone, h: t.h, m: t.m, off: t.off, day: t.day, label: label(t) };
    });
    var hz = hereZone(), ht = timeIn(hz, now);
    return { now: Math.floor(now.getTime() / 60000) * 60000, zones: zones, here: { id: 'here', name: 'Here', zone: hz, h: ht.h, m: ht.m, off: ht.off, day: ht.day, label: label(ht) } };
  }

  /* ---------- drawings: flags, sky, a small clock, the Earth ---------- */
  function star(cx, cy, r, points, inner) {
    var out = [];
    for (var i = 0; i < points * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / points, rr = i % 2 ? r * inner : r;
      out.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
    }
    return '<polygon points="' + out.join(' ') + '" fill="#ffffff"/>';
  }
  /** Our own drawing of the flag of Australia (the topics page has no Australia yet); the corner reuses our UK flag. */
  function australia() {
    var uk = flagOf('united-kingdom');
    return { vb: '0 0 60 30', art: '<rect x="0" y="0" width="60" height="30" fill="#012169"/>' +
      (uk ? '<svg x="0" y="0" width="30" height="15" viewBox="' + uk.vb + '" preserveAspectRatio="none">' + uk.art + '</svg>' : '') +
      star(15, 22.5, 4.5, 7, 0.44) + star(45, 25.5, 2.1, 7, 0.44) + star(45, 5, 2.1, 7, 0.44) + star(37.5, 12.5, 2.1, 7, 0.44) +
      star(52.6, 10.9, 2.1, 7, 0.44) + star(49.2, 15.1, 1.2, 5, 0.4) +
      '<rect x="0.3" y="0.3" width="59.4" height="29.4" fill="none" stroke="' + INK + '" stroke-width="0.6"/>' };
  }
  function flagOf(id) {
    if (id === 'australia') return australia();
    var T = window.YS_TOPICS && window.YS_TOPICS.flags, items = (T && T.items) || [];
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return { vb: items[i].vb, art: items[i].art };
    return null;
  }
  function house() {
    return { vb: '0 0 30 20', art: '<path d="M15 2 4 10h3v8h16v-8h3z" fill="#f6c96b" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/><rect x="13" y="12" width="4" height="6" fill="' + ORANGE + '"/>' };
  }
  var SUN = '<circle cx="12" cy="12" r="5.5" fill="#F7C948" stroke="' + INK + '" stroke-width="1"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2 2M17.4 17.4l2 2M4.6 19.4l2-2M17.4 6.6l2-2" stroke="#b7791f" stroke-width="1.6" stroke-linecap="round"/>';
  var MOON = '<circle cx="12" cy="12" r="11.5" fill="' + NIGHT + '"/><path d="M14 4.5a7.5 7.5 0 1 0 5 12.5A6 6 0 1 1 14 4.5z" fill="#f4efc8"/>';
  function sky(day) { return svgEl(day ? SUN : MOON, '0 0 24 24'); }
  /** A small clock face with no numbers, for the city cards. */
  function miniClock(h, m) {
    var out = '<circle cx="50" cy="50" r="45" fill="#fff" stroke="' + INK + '" stroke-width="5"/>';
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      out += '<line x1="' + (50 + 34 * Math.sin(a)).toFixed(1) + '" y1="' + (50 - 34 * Math.cos(a)).toFixed(1) + '" x2="' + (50 + 40 * Math.sin(a)).toFixed(1) + '" y2="' + (50 - 40 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="' + (i % 3 ? 2 : 4) + '"/>';
    }
    var ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    out += '<g transform="rotate(' + ha.toFixed(1) + ' 50 50)"><line x1="50" y1="54" x2="50" y2="26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>';
    out += '<g transform="rotate(' + ma + ' 50 50)"><line x1="50" y1="56" x2="50" y2="13" stroke="' + TEAL + '" stroke-width="4" stroke-linecap="round"/></g><circle cx="50" cy="50" r="4" fill="' + INK + '"/>';
    return out;
  }
  /** The Earth seen from above the North Pole, with the Sun on the left. A city's place on it follows its own clock. */
  function earthMovie(cities) {
    var cx = 200, cy = 105, r = 62;
    var out = '<g' + at(0.1) + '><circle cx="46" cy="105" r="24" fill="#F7C948" stroke="' + INK + '" stroke-width="2"/>';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; out += '<line x1="' + (46 + 29 * Math.cos(a)).toFixed(1) + '" y1="' + (105 + 29 * Math.sin(a)).toFixed(1) + '" x2="' + (46 + 37 * Math.cos(a)).toFixed(1) + '" y2="' + (105 + 37 * Math.sin(a)).toFixed(1) + '" stroke="#b7791f" stroke-width="3" stroke-linecap="round"/>'; }
    out += '<text x="46" y="160" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">Sun</text></g>';
    out += '<g' + at(0.5) + '><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + NIGHT + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M' + cx + ' ' + (cy - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (cy + r) + 'z" fill="#bfe4ff"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      '<text x="' + (cx - 30) + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + INK + '">day</text>' +
      '<text x="' + (cx + 30) + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">night</text></g>';
    var used = [];
    cities.forEach(function (c, k) {
      var phi = (180 + (c.h + c.m / 60 - 12) * 15) * Math.PI / 180;
      var x = cx + (r - 8) * Math.cos(phi), y = cy - (r - 8) * Math.sin(phi);
      var lx = cx + (r + 14) * Math.cos(phi), ly = cy - (r + 14) * Math.sin(phi) + 5;
      used.forEach(function (u) { if (Math.abs(u - ly) < 16) ly += 18; });
      used.push(ly);
      var anchor = Math.cos(phi) > 0.3 ? 'start' : Math.cos(phi) < -0.3 ? 'end' : 'middle';
      out += '<g' + at(1 + k * 0.5) + '><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" fill="' + ORANGE + '" stroke="#fff" stroke-width="2"/>' +
        '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + anchor + '" font-size="14" font-weight="800" fill="' + INK + '">' + c.name + '</text></g>';
    });
    var said = cities.map(function (c) { return c.name + ' is on the ' + (c.day ? 'day' : 'night') + ' side, where it is ' + timeWords(c); }).join('. ');
    return { svg: out, vb: '0 0 380 210', label: 'The Earth seen from above, with the Sun on the left. The side facing the Sun has day, the other side has night. ' + said + '.' };
  }

  /** The row of city cards. Tapping one says its time. */
  function cityRow(w, ctx, line) {
    var row = el('div', { 'class': 'cities', id: 'cities' });
    w.zones.concat([w.here]).forEach(function (c) {
      var b = el('button', { type: 'button', 'class': 'city ' + (c.day ? 'day' : 'night'), 'data-city': c.id });
      var top = el('span', { 'class': 'top2' }), f = c.id === 'here' ? house() : flagOf(c.flag);
      if (f) top.appendChild(svgEl(f.art, f.vb));
      top.appendChild(sky(c.day));
      b.appendChild(top);
      var face = svgEl(miniClock(c.h, c.m), '0 0 100 100'); face.setAttribute('class', 'face');
      b.appendChild(face);
      b.appendChild(el('b', {}, c.name));
      b.appendChild(el('span', { 'class': 't' }, c.label));
      b.appendChild(el('span', { 'class': 'sr' }, ', ' + (c.day ? 'day, ' : 'night, ') + partPhrase(c.h)));
      b.addEventListener('click', function () {
        var text = c.id === 'here' ? 'Here it is ' + timeWords(c) + '.' : 'In ' + c.name + ' it is ' + timeWords(c) + '.';
        line.textContent = text;
        ctx.say(text);
      });
      row.appendChild(b);
    });
    return row;
  }
  function compareHere(c, here) {
    var a = partNoun(c.h), b = partNoun(here.h);
    return a === b ? 'It is ' + a + ' in ' + c.name + ', and ' + b + ' here too.' : 'It is ' + a + ' in ' + c.name + ' while it is ' + b + ' here.';
  }
  function skyWords(c) {
    var n = partNoun(c.h);
    return c.day ? 'day: the sun is up.' : n === 'morning' ? 'still night: the sun is not up yet.' : n === 'evening' ? 'night: the sun has gone down.' : 'night: the moon is out.';
  }
  function byId(w, id) { for (var i = 0; i < w.zones.length; i++) if (w.zones[i].id === id) return w.zones[i]; return null; }

  /** One question about the world clocks now. kinds by level: 0 day or night, where; 1 adds what time; 2 where, what time, hours ahead. */
  var KINDS = [['daynight', 'where'], ['daynight', 'where', 'time'], ['where', 'time', 'ahead']];
  function makeWorld(lv, round, now, pick) {
    pick = pick || function (list) { return list[rnd(list.length)]; };
    var w = worldNow(now), kinds = KINDS[lv], kind = kinds[round % kinds.length], q = { game: 'world', level: lv, kind: kind, now: w.now, zones: w.zones, here: w.here };
    var Z = w.zones;
    if (kind === 'daynight') {
      var c = byId(w, pick(Z.map(function (z) { return z.id; })));
      q.city = c.id; q.choices = ['day', 'night']; q.ans = c.day ? 'day' : 'night';
      q.text = 'Is it day or night in ' + c.name + ' now?';
    } else if (kind === 'where') {
      var days = Z.filter(function (z) { return z.day; }), nights = Z.filter(function (z) { return !z.day; });
      // Ask for the side that has at least two cities on the other side, so there are two other choices.
      var want = nights.length && days.length >= 2 && (nights.length < 2 || rnd(2)) ? 'night' : 'day';
      var yes = want === 'night' ? nights : days, no = want === 'night' ? days : nights;
      var t = byId(w, pick(yes.map(function (z) { return z.id; })));
      q.want = want; q.city = t.id; q.ans = t.id;
      q.choices = shuffle([t.id].concat(shuffle(no).slice(0, 2).map(function (z) { return z.id; })));
      q.text = want === 'night' ? 'Where is it night now? Look for the moon.' : 'Where is it daytime now? Look for the sun.';
    } else if (kind === 'time') {
      var tc = byId(w, pick(Z.map(function (z) { return z.id; })));
      var others = shuffle(Z.filter(function (z) { return z.label !== tc.label; }).map(function (z) { return z.label; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      q.city = tc.id; q.ans = tc.label; q.choices = shuffle([tc.label].concat(others.slice(0, 2)));
      q.text = 'What time is it in ' + tc.name + ' now? Find its clock.';
    } else {
      var pairs = [];
      Z.forEach(function (a) { Z.forEach(function (b) { var d = (b.off - a.off) / 60; if (d >= 1 && d <= 12 && d === Math.round(d)) pairs.push([a, b, d]); }); });
      var p = pairs[rnd(pairs.length)], d = p[2];
      var wrong = [d - 2, d - 1, d + 1, d + 2].filter(function (v) { return v >= 1; });
      q.city = p[1].id; q.from = p[0].id; q.hours = d; q.ans = hoursWord(d);
      q.choices = shuffle([q.ans].concat(shuffle(wrong).slice(0, 2).map(hoursWord)));
      q.text = 'How many hours ahead of ' + p[0].name + ' is ' + p[1].name + '?';
    }
    return q;
  }

  function world(area, ctx) {
    var lv = level(), q = makeWorld(lv, ctx.round(), new Date(), ctx.fresh), w = { zones: q.zones, here: q.here };
    var c = byId(w, q.city);
    ctx.set(q);
    ctx.ask(area, q.text);
    var line = el('p', { 'class': 'cityline', id: 'cityline', 'aria-live': 'polite' }, 'Tap a city to hear its time.');
    area.appendChild(cityRow(w, ctx, line));
    area.appendChild(line);
    function draw1(v) {
      var box = el('span', { 'class': 'pick' });
      if (q.kind === 'daynight') { box.appendChild(sky(v === 'day')).setAttribute('class', 'skyicon' + (v === 'day' ? '' : ' moonicon')); box.appendChild(el('span', { 'class': 'w' }, v === 'day' ? 'Day' : 'Night')); return box; }
      if (q.kind === 'where') { var z = byId(w, v), f = flagOf(z.flag); if (f) box.appendChild(svgEl(f.art, f.vb)); box.appendChild(el('span', { 'class': 'w' }, z.name)); return box; }
      return ctx.word(v);
    }
    function name1(v) {
      if (q.kind === 'daynight') return v === 'day' ? 'Day' : 'Night';
      if (q.kind === 'where') { var z = byId(w, v); return z.name + ', ' + z.country; }
      return v;
    }
    area.appendChild(ctx.tiles(q.choices, draw1, function (v, b) {
      if (v === q.ans) {
        b.classList.add('right');
        var text;
        if (q.kind === 'ahead') text = 'Yes! ' + c.name + ' is ' + q.ans + ' ahead of ' + byId(w, q.from).name + '. It is ' + c.label + ' in ' + c.name + ' and ' + byId(w, q.from).label + ' in ' + byId(w, q.from).name + '.';
        else text = 'Yes! In ' + c.name + ' it is ' + c.label + ', ' + skyWords(c) + ' ' + compareHere(c, q.here);
        ctx.win(text, text.replace(c.label, timeWords(c)));
        return;
      }
      var say;
      if (q.kind === 'daynight') say = 'Not ' + v + '. Look at the sky on the card for ' + c.name + ': is there a sun or a moon?';
      else if (q.kind === 'where') { var z = byId(w, v); say = 'Not ' + z.name + ': it is ' + (z.day ? 'day there, the sun is out.' : 'night there, the moon is out.') + ' Look for a card with ' + (q.want === 'night' ? 'the moon.' : 'the sun.'); }
      else if (q.kind === 'time') { var o = w.zones.filter(function (x) { return x.label === v; })[0]; say = 'Not ' + v + (o ? ': that is the time in ' + o.name : '') + '. Find the card for ' + c.name + '.'; }
      else say = 'Not ' + v + '. Count the hours from the time in ' + byId(w, q.from).name + ' on to the time in ' + c.name + '.';
      ctx.miss(b, say, function (box) {
        var pair = q.kind === 'ahead' ? [byId(w, q.from), c] : [c, q.here];
        if (q.kind === 'where') { var other = w.zones.filter(function (z) { return z.day !== c.day; })[0]; if (other) pair = [c, other]; }
        box.appendChild(el('p', {}, 'The Earth turns round once every day. Here it is from above.'));
        box.appendChild(ctx.moviePanel(function () { return earthMovie(pair); }));
        var words;
        if (q.kind === 'time') words = 'Every city has its own clock, because the Sun reaches each place at a different time. Find the card for ' + c.name + ' and read its clock: it shows ' + timeWords(c) + ', which we write ' + c.label + '.';
        else if (q.kind === 'ahead') words = c.name + ' turns into the sunshine before ' + pair[0].name + ', so its clocks are ahead. Count the hours from ' + pair[0].label + ' in ' + pair[0].name + ' on to ' + c.label + ' in ' + c.name + ': that is ' + q.ans + '.';
        else words = 'The side of the Earth that faces the Sun has day, and the other side has night. ' + pair.map(function (z) { return (z.id === 'here' ? 'Here' : z.name) + ' is on the ' + (z.day ? 'day' : 'night') + ' side: it is ' + timeWords(z) + (z.id === 'here' ? '' : ' there'); }).join('. ') + '.';
        box.appendChild(el('p', { id: 'lesson-say' }, words));
      });
    }, name1));
  }

  /* =====================================================================
     Kitchen timer
     ===================================================================== */
  /** Jobs that need a timer. s: seconds. lv: the levels that use it. as: how the time is said at level 2. */
  var TASKS = [
    { key: 'teeth', pic: 'teeth', job: 'I am brushing my teeth.', done: 'My teeth are clean and shiny.', s: 120, lv: [0, 1, 2] },
    { key: 'egg', pic: 'egg', job: 'We are boiling an egg.', done: 'The egg is ready to eat.', s: 360, lv: [0, 1] },
    { key: 'toys', pic: 'toys', job: 'We are tidying up the toys.', done: 'All the toys are put away.', s: 300, lv: [0] },
    { key: 'popcorn', pic: 'popcorn', job: 'We are making popcorn.', done: 'Pop, pop! The popcorn is ready.', s: 180, lv: [0, 1] },
    { key: 'story', pic: 'story', job: 'We are reading a story.', done: 'The end. What a good story!', s: 600, lv: [0] },
    { key: 'cocoa', pic: 'cocoa', job: 'The hot cocoa is cooling down.', done: 'The cocoa is cool enough to drink.', s: 240, lv: [0, 1] },
    { key: 'flowers1', pic: 'flowers', job: 'I am watering the flowers.', done: 'The flowers have had a good drink.', s: 60, lv: [0] },
    { key: 'bread', pic: 'bread', job: 'I am baking bread.', done: 'The bread is baked, golden and warm.', s: 2700, lv: [1] },
    { key: 'cookies', pic: 'cookies', job: 'We are baking cookies.', done: 'The cookies are golden brown.', s: 720, lv: [1] },
    { key: 'pizza', pic: 'pizza', job: 'We are baking a pizza.', done: 'The pizza is ready. Yum!', s: 900, lv: [1] },
    { key: 'pasta', pic: 'pasta', job: 'We are cooking pasta.', done: 'The pasta is soft and ready.', s: 600, lv: [1, 2] },
    { key: 'cake', pic: 'cake', job: 'We are baking a cake.', done: 'The cake has risen. It smells lovely!', s: 1800, lv: [1] },
    { key: 'hands', pic: 'hands', job: 'I am washing my hands.', done: 'Clean hands!', s: 20, lv: [1, 2] },
    { key: 'flowers', pic: 'flowers', job: 'I am watering the flowers.', done: 'The flowers have had a good drink.', s: 50, lv: [1] },
    { key: 'song', pic: 'song', job: 'We are dancing to a song.', done: 'The song is over. Great dancing!', s: 180, lv: [1] },
    { key: 'bread2', pic: 'bread', job: 'I am baking bread.', done: 'The bread is baked, golden and warm.', s: 2700, lv: [2], as: 'three quarters of an hour' },
    { key: 'cake2', pic: 'cake', job: 'We are baking a cake.', done: 'The cake has risen. It smells lovely!', s: 1800, lv: [2], as: 'half an hour' },
    { key: 'pizza2', pic: 'pizza', job: 'We are baking a pizza.', done: 'The pizza is ready. Yum!', s: 900, lv: [2], as: 'a quarter of an hour' },
    { key: 'cocoa2', pic: 'cocoa', job: 'The hot cocoa is cooling down.', done: 'The cocoa is cool enough to drink.', s: 90, lv: [2] },
    { key: 'egg2', pic: 'egg', job: 'We are boiling an egg.', done: 'The egg is ready to eat.', s: 390, lv: [2] },
    { key: 'song2', pic: 'song', job: 'We are dancing to a song.', done: 'The song is over. Great dancing!', s: 200, lv: [2] },
    { key: 'cookies2', pic: 'cookies', job: 'We are baking cookies.', done: 'The cookies are golden brown.', s: 750, lv: [2] },
    { key: 'pie', pic: 'pie', job: 'We are baking an apple pie.', done: 'The apple pie is baked.', s: 3600, lv: [2], as: 'an hour' }
  ];
  /** "1 minute and 30 seconds". */
  function amount(s) {
    var m = Math.floor(s / 60), sec = s % 60, out = [];
    if (m) out.push(m + (m === 1 ? ' minute' : ' minutes'));
    if (sec) out.push(sec + ' seconds');
    return out.length ? out.join(' and ') : '0 minutes';
  }
  function asked(t) { return t.as || amount(t.s); }
  function display(s) { return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
  function maxSeconds(lv) { return lv === 0 ? 600 : 3600; }

  /* ---------- drawings for the jobs: before, and done ---------- */
  var BR = '#8a5a2b';
  function stroke(w) { return ' stroke="' + INK + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"'; }
  var STEAM = '<path d="M46 26c-4-6 4-10 0-16M60 24c-4-6 4-10 0-16M74 26c-4-6 4-10 0-16" fill="none" stroke="#7d8f99" stroke-width="2.5" stroke-linecap="round"/>';
  var SPARK = function (x, y) { return '<path d="M' + x + ' ' + (y - 7) + 'l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#F7C948"' + stroke(1) + '/>'; };
  var POT = '<path d="M28 44h64v30a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8z" fill="#9aa5ad"' + stroke() + '/><rect x="20" y="44" width="10" height="5" rx="2" fill="#5d6b73"/><rect x="90" y="44" width="10" height="5" rx="2" fill="#5d6b73"/>';
  var PICS = {
    bread: { before: 'Bread dough in a tin, waiting to bake.', after: 'A golden loaf of bread, warm from the oven.', art: function (d) {
      return '<path d="M22 54h76l-6 26H28z" fill="#9aa5ad"' + stroke() + '/>' + (d ? '<path d="M24 56c0-28 72-28 72 0z" fill="#c9852f"' + stroke() + '/><path d="M44 40l6 8M58 36l6 8M72 40l6 8" stroke="' + BR + '" stroke-width="2.5"/>' + STEAM :
        '<ellipse cx="60" cy="54" rx="34" ry="9" fill="#f6ead2"' + stroke() + '/>'); } },
    cookies: { before: 'A tray of pale cookie dough.', after: 'A tray of golden cookies with chocolate chips.', art: function (d) {
      var out = '<rect x="12" y="34" width="96" height="44" rx="4" fill="#9aa5ad"' + stroke() + '/>';
      [[32, 48], [60, 48], [88, 48], [32, 66], [60, 66], [88, 66]].forEach(function (p) {
        out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="' + (d ? '#c98a3c' : '#f3e0b5') + '"' + stroke(1.5) + '/>';
        if (d) out += '<circle cx="' + (p[0] - 3) + '" cy="' + (p[1] - 2) + '" r="1.8" fill="#4a2c17"/><circle cx="' + (p[0] + 3) + '" cy="' + (p[1] + 3) + '" r="1.8" fill="#4a2c17"/>';
      });
      return out + (d ? STEAM : ''); } },
    pizza: { before: 'A round pizza base, not baked yet.', after: 'A baked pizza with sauce, cheese and toppings.', art: function (d) {
      var out = '<circle cx="60" cy="54" r="32" fill="' + (d ? '#d9a35a' : '#f3dfb0') + '"' + stroke() + '/>';
      if (d) out += '<circle cx="60" cy="54" r="26" fill="#c0392b"/><circle cx="60" cy="54" r="23" fill="#f7d36b"/>' + [[50, 46], [70, 48], [56, 64], [72, 62], [46, 60]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.5" fill="#a93226"/>'; }).join('') + STEAM.replace(/M(\d+) (2\d)/g, function (s, x, y) { return 'M' + x + ' ' + (y - 10); });
      return out; } },
    cake: { before: 'A cake tin with runny cake mix in it.', after: 'A tall cake with cream and a cherry on top.', art: function (d) {
      return '<rect x="28" y="66" width="64" height="14" rx="3" fill="#9aa5ad"' + stroke() + '/>' + (d ? '<rect x="32" y="40" width="56" height="28" rx="4" fill="#c98a3c"' + stroke() + '/><path d="M32 46c6 6 10-4 16 2s10-4 16 2 10-4 16 2 6-2 8-2v-6H32z" fill="#fff8ec"' + stroke(1.5) + '/><circle cx="60" cy="33" r="5" fill="#c0392b"' + stroke(1.5) + '/>' :
        '<rect x="32" y="60" width="56" height="8" rx="2" fill="#f6e6c8"' + stroke(1.5) + '/>'); } },
    egg: { before: 'An egg in a pot of bubbling water.', after: 'A boiled egg in an egg cup.', art: function (d) {
      if (d) return '<path d="M44 66h32l-4 14H48z" fill="' + TEAL + '"' + stroke() + '/><ellipse cx="60" cy="48" rx="14" ry="19" fill="#fffaf0"' + stroke() + '/><path d="M47 44l4-4 4 4 4-4 4 4 4-4 4 4" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
      return POT + '<rect x="30" y="50" width="60" height="22" fill="#a8d8f0"/><ellipse cx="60" cy="54" rx="9" ry="12" fill="#fffaf0"' + stroke(1.5) + '/><circle cx="42" cy="46" r="3" fill="#fff"' + stroke(1) + '/><circle cx="78" cy="44" r="3" fill="#fff"' + stroke(1) + '/>'; } },
    pasta: { before: 'Hard, straight pasta going into a pot.', after: 'A plate of soft pasta with sauce.', art: function (d) {
      if (d) return '<ellipse cx="60" cy="66" rx="44" ry="14" fill="#fff"' + stroke() + '/><path d="M32 62c6-10 10 8 16-2s10 8 16-2 10 8 16-2 6 6 8 4" fill="none" stroke="#e0b84a" stroke-width="4" stroke-linecap="round"/><path d="M38 58c6-8 10 6 16-2s10 6 16-2 10 6 14 0" fill="none" stroke="#e0b84a" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="56" r="7" fill="#c0392b"/>';
      return POT + '<path d="M50 52 58 18M58 52 62 16M66 52 70 20M74 52 76 22" stroke="#e0b84a" stroke-width="3.5" stroke-linecap="round"/>'; } },
    popcorn: { before: 'Popcorn seeds in a pan.', after: 'A bowl full of popcorn.', art: function (d) {
      if (d) {
        var out = '';
        [[42, 36], [54, 30], [66, 30], [78, 36], [48, 42], [60, 38], [72, 42]].forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#fffbe8"' + stroke(1.5) + '/>'; });
        return out + '<path d="M32 44h56l-8 36H40z" fill="#fff"' + stroke() + '/><path d="M44 44l4 36M60 44v36M76 44l-4 36" stroke="#c0392b" stroke-width="5"/>';
      }
      return '<path d="M26 58h68v14a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6z" fill="#5d6b73"' + stroke() + '/><rect x="94" y="62" width="20" height="5" rx="2" fill="#5d6b73"/>' +
        [40, 50, 60, 70, 80].map(function (x, i) { return '<circle cx="' + x + '" cy="' + (60 + (i % 2) * 3) + '" r="3" fill="#F7C948"' + stroke(1) + '/>'; }).join(''); } },
    cocoa: { before: 'A very hot mug of cocoa, steaming.', after: 'A mug of cocoa with marshmallows, cool enough to drink.', art: function (d) {
      return '<path d="M34 40h46v32a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8z" fill="' + TEAL + '"' + stroke() + '/><path d="M80 48h6a8 8 0 0 1 0 16h-6" fill="none"' + stroke(4) + '/><ellipse cx="57" cy="41" rx="21" ry="4" fill="#6b3e1f"/>' +
        (d ? '<rect x="46" y="35" width="8" height="7" rx="2" fill="#fff"' + stroke(1) + '/><rect x="58" y="34" width="8" height="7" rx="2" fill="#fde7f0"' + stroke(1) + '/>' : STEAM.replace(/stroke="#7d8f99"/, 'stroke="#c0392b"')); } },
    teeth: { before: 'A toothbrush with toothpaste bubbles.', after: 'A clean, shiny tooth.', art: function (d) {
      if (d) return '<path d="M40 30c8-6 14 2 20 0s12-6 20 0c6 8 0 20-4 26-2 14-4 24-8 24-4 0-4-16-8-16s-4 16-8 16c-4 0-6-10-8-24-4-6-10-18-4-26z" fill="#fff"' + stroke() + '/>' + SPARK(90, 30) + SPARK(30, 60) + SPARK(88, 70);
      return '<rect x="14" y="56" width="70" height="10" rx="5" fill="' + TEAL + '"' + stroke() + '/><rect x="74" y="44" width="28" height="14" rx="3" fill="#fff"' + stroke() + '/>' +
        '<path d="M78 44v-4M84 44v-4M90 44v-4M96 44v-4" stroke="' + INK + '" stroke-width="2"/>' + [[82, 30], [94, 24], [100, 34], [88, 18]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#dff3ff"' + stroke(1) + '/>'; }).join(''); } },
    hands: { before: 'Soapy hands with bubbles.', after: 'Clean, sparkly hands.', art: function (d) {
      var hand = '<path d="M44 82V46c0-4 7-4 7 0v-14c0-4 7-4 7 0v-4c0-4 7-4 7 0v4c0-4 7-4 7 0v22l6-8c3-3 8 0 6 4l-10 20c-3 8-8 12-16 12z" fill="#e9b98f"' + stroke() + '/>';
      if (d) return hand + SPARK(30, 30) + SPARK(92, 26) + SPARK(30, 66);
      return hand + [[40, 40], [80, 34], [56, 22], [86, 60], [36, 60], [70, 70]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#dff3ff"' + stroke(1) + '/>'; }).join(''); } },
    flowers: { before: 'A thirsty flower and a watering can.', after: 'A happy flower standing up straight, with water drops.', art: function (d) {
      var can = '<path d="M68 52h30v26H68z" fill="' + TEAL + '"' + stroke() + '/><path d="M68 58 52 46" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><path d="M98 58a8 10 0 0 0 0-14" fill="none"' + stroke(3) + '/>';
      var pot = '<path d="M18 66h28l-4 14H22z" fill="' + ORANGE + '"' + stroke() + '/>';
      if (d) return can + pot + '<path d="M32 66V34" stroke="#2e7d32" stroke-width="3"/><circle cx="32" cy="28" r="9" fill="#F7C948"' + stroke() + '/><circle cx="32" cy="28" r="3.5" fill="' + ORANGE + '"/><path d="M46 40l-2 5M42 50l-2 5M50 50l-2 5" stroke="#3b82c4" stroke-width="2.5" stroke-linecap="round"/>';
      return can + pot + '<path d="M32 66c0-14 0-20 10-24" fill="none" stroke="#2e7d32" stroke-width="3"/><circle cx="44" cy="48" r="7" fill="#e6c96b"' + stroke() + '/>'; } },
    toys: { before: 'Toys all over the floor.', after: 'A toy box with the lid shut and every toy inside.', art: function (d) {
      if (d) return '<rect x="26" y="40" width="68" height="40" rx="4" fill="' + ORANGE + '"' + stroke() + '/><rect x="22" y="34" width="76" height="10" rx="3" fill="#e58a5a"' + stroke() + '/><path d="M50 60h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' + SPARK(102, 28);
      return '<circle cx="28" cy="70" r="10" fill="#3b82c4"' + stroke() + '/><rect x="50" y="58" width="20" height="20" fill="#F7C948"' + stroke() + '/><text x="60" y="73" text-anchor="middle" font-size="13" font-weight="800" fill="' + INK + '">A</text><path d="M82 78l10-22 10 22z" fill="' + TEAL + '"' + stroke() + '/><rect x="36" y="38" width="24" height="10" rx="3" fill="#c0392b"' + stroke() + '/>'; } },
    story: { before: 'An open storybook.', after: 'The storybook closed, with a star for the end.', art: function (d) {
      if (d) return '<rect x="34" y="28" width="52" height="52" rx="4" fill="' + TEAL + '"' + stroke() + '/><rect x="34" y="28" width="8" height="52" fill="#165c52"/>' + SPARK(64, 54).replace('#F7C948', '#F7C948');
      return '<path d="M60 36c-10-6-26-6-40-2v44c14-4 30-4 40 2z" fill="#fff"' + stroke() + '/><path d="M60 36c10-6 26-6 40-2v44c-14-4-30-4-40 2z" fill="#fff"' + stroke() + '/><path d="M28 46h22M28 54h22M28 62h18M70 46h22M70 54h22M70 62h18" stroke="#7d8f99" stroke-width="2"/>'; } },
    song: { before: 'Music notes: a song is playing.', after: 'The song is over: a star for great dancing.', art: function (d) {
      var notes = '<path d="M36 70V34l28-8v36" fill="none"' + stroke(3) + '/><ellipse cx="31" cy="70" rx="7" ry="5" fill="' + (d ? '#9aa5ad' : TEAL) + '"' + stroke(1.5) + '/><ellipse cx="59" cy="62" rx="7" ry="5" fill="' + (d ? '#9aa5ad' : TEAL) + '"' + stroke(1.5) + '/>';
      return notes + (d ? '<polygon points="88,30 93,42 106,43 96,51 99,64 88,57 77,64 80,51 70,43 83,42" fill="#F7C948"' + stroke(1.5) + '/>' : '<path d="M84 50v20" ' + stroke(3) + '/><ellipse cx="79" cy="70" rx="7" ry="5" fill="' + ORANGE + '"' + stroke(1.5) + '/>'); } },
    pie: { before: 'An apple pie with pale pastry, ready for the oven.', after: 'A golden apple pie, warm from the oven.', art: function (d) {
      return '<path d="M20 58h80l-8 20H28z" fill="#9aa5ad"' + stroke() + '/><path d="M22 58c4-20 72-20 76 0z" fill="' + (d ? '#d39a4a' : '#f6e6c8') + '"' + stroke() + '/><path d="M46 46l4 6M60 44v7M74 46l-4 6" stroke="' + (d ? BR : '#c9a77a') + '" stroke-width="2.5"/>' + (d ? STEAM.replace(/M(\d+) (2\d)/g, function (s, x, y) { return 'M' + x + ' ' + (y - 4); }) : ''); } }
  };
  function picture(t, done) { var p = PICS[t.pic]; return svgEl(p.art(done), '0 0 120 90', done ? p.after : p.before); }

  /** The kitchen timer: a round dial that fills for the time set, and the time in big numbers. */
  function timerArt(s, ringing) {
    var scale = s > 60 || s === 0 ? 3600 : 60, frac = Math.min(1, s / scale), out = '';
    out += '<rect x="88" y="6" width="24" height="14" rx="4" fill="' + TEAL + '"' + stroke() + '/>';
    out += '<circle cx="100" cy="108" r="86" fill="#ffffff"' + stroke(5) + '/>';
    if (frac >= 1) out += '<circle cx="100" cy="108" r="70" fill="#fbd3bd"/>';
    else if (frac > 0) {
      var a = frac * 2 * Math.PI, x = 100 + 70 * Math.sin(a), y = 108 - 70 * Math.cos(a);
      out += '<path d="M100 108V38A70 70 0 ' + (frac > 0.5 ? 1 : 0) + ' 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + 'z" fill="#fbd3bd"/>';
    }
    for (var i = 0; i < 12; i++) { var b = i * Math.PI / 6; out += '<line x1="' + (100 + 74 * Math.sin(b)).toFixed(1) + '" y1="' + (108 - 74 * Math.cos(b)).toFixed(1) + '" x2="' + (100 + 82 * Math.sin(b)).toFixed(1) + '" y2="' + (108 - 82 * Math.cos(b)).toFixed(1) + '" stroke="' + INK + '" stroke-width="3"/>'; }
    out += '<rect x="44" y="86" width="112" height="44" rx="8" fill="' + NIGHT + '"/><text x="100" y="119" text-anchor="middle" font-size="30" font-weight="800" fill="#ffffff" font-family="system-ui,Arial,sans-serif">' + display(s) + '</text>';
    if (ringing) out += '<g' + (still() ? '' : ' class="mv-wiggle"') + '><path d="M22 30l-14-10M178 30l14-10M14 70H0M186 70h14" stroke="' + ORANGE + '" stroke-width="5" stroke-linecap="round"/><text x="100" y="168" text-anchor="middle" font-size="22" font-weight="800" fill="' + ORANGE + '">Ding! Ding!</text></g>';
    return out;
  }
  function timerLabel(s, ringing) { return ringing ? 'The kitchen timer is at 0 and ringing: Ding! Ding!' : 'A kitchen timer showing ' + display(s) + ', that is ' + amount(s) + '.'; }

  /** How to set a time with the buttons, in words. */
  function howWords(t, lv) {
    var m = Math.floor(t.s / 60), sec = t.s % 60, out = t.as ? capital(t.as) + ' is ' + amount(t.s) + '. ' : '';
    function times(n) { return n + (n === 1 ? ' time' : ' times'); }
    if (lv === 0) return out + 'To set ' + amount(t.s) + ', press + 1 minute ' + times(m) + '. Count as you press: ' + countUp(m) + '.';
    var steps = [], tens = Math.floor(m / 10), ones = m % 10;
    if (tens) steps.push('press + 10 minutes ' + times(tens) + ', that makes ' + tens * 10 + ' minutes');
    if (ones) steps.push((steps.length ? 'then ' : '') + 'press + 1 minute ' + times(ones) + ', that makes ' + amount(m * 60));
    if (sec) steps.push((steps.length ? 'then ' : '') + 'press + 10 seconds ' + times(sec / 10) + ' for ' + sec + ' seconds');
    out += 'To set ' + amount(t.s) + ': ' + steps.join(', ') + '.';
    if (lv === 2) out += ' Remember: a quarter of an hour is 15 minutes, half an hour is 30 minutes, and three quarters of an hour is 45 minutes.';
    return out;
  }
  function capital(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function countUp(n) { var a = []; for (var i = 1; i <= n; i++) a.push(i); return a.join(', '); }
  /** A picture of the presses: tens of minutes, single minutes, and tens of seconds, one by one. */
  function howMovie(t) {
    var m = Math.floor(t.s / 60), sec = t.s % 60, tens = Math.floor(m / 10), ones = m % 10, k = 0, out = '', y = 8;
    function rowLabel(text) { out += '<text x="4" y="' + (y + 22) + '" font-size="13" font-weight="700" fill="' + INK + '">' + text + '</text>'; }
    if (tens) { rowLabel('+10 min'); for (var i = 0; i < tens; i++) out += '<g' + at(0.3 + 0.35 * k++) + '><rect x="' + (70 + i * 40) + '" y="' + y + '" width="34" height="30" rx="5" fill="#fbd3bd"' + stroke() + '/><text x="' + (87 + i * 40) + '" y="' + (y + 21) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + INK + '">10</text></g>'; y += 40; }
    if (ones) { rowLabel(tens || sec ? '+1 min' : '+1 minute'); for (var j = 0; j < ones; j++) out += '<g' + at(0.3 + 0.35 * k++) + '><rect x="' + (70 + j * 26) + '" y="' + (y + 4) + '" width="22" height="22" rx="4" fill="#cfeee6"' + stroke() + '/><text x="' + (81 + j * 26) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + INK + '">1</text></g>'; y += 40; }
    if (sec) { rowLabel('+10 sec'); for (var q = 0; q < sec / 10; q++) out += '<g' + at(0.3 + 0.35 * k++) + '><circle cx="' + (84 + q * 32) + '" cy="' + (y + 15) + '" r="13" fill="#e3f1fb"' + stroke() + '/><text x="' + (84 + q * 32) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="11" font-weight="800" fill="' + INK + '">10s</text></g>'; y += 40; }
    out += '<text x="160" y="' + (y + 18) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + TEAL + '"' + at(0.4 + 0.35 * k) + '>' + display(t.s) + ' = ' + amount(t.s) + '</text>';
    return { svg: out, vb: '0 0 330 ' + (y + 30), label: 'How to set ' + amount(t.s) + ': ' + [tens ? tens + ' presses of + 10 minutes' : '', ones ? ones + ' presses of + 1 minute' : '', sec ? sec / 10 + ' presses of + 10 seconds' : ''].filter(Boolean).join(', ') + '. The timer shows ' + display(t.s) + '.' };
  }

  function makeTimer(lv, pick) {
    var pool = TASKS.filter(function (t) { return t.lv.indexOf(lv) > -1; });
    var key = (pick || function (l) { return l[rnd(l.length)]; })(pool.map(function (t) { return t.key; }));
    var t = pool.filter(function (x) { return x.key === key; })[0];
    return { game: 'timer', level: lv, task: t.key, pic: t.pic, job: t.job, seconds: t.s, said: asked(t), ans: display(t.s), max: maxSeconds(lv),
      text: t.job + ' Set the timer for ' + asked(t) + '.' };
  }

  function timer(area, ctx) {
    var lv = level(), q = makeTimer(lv, ctx.fresh), t = TASKS.filter(function (x) { return x.key === q.task; })[0];
    var s = 0, busy = false, max = q.max;
    q.now = function () { return s; };
    ctx.set(q);
    ctx.ask(area, q.text);
    var box = area.appendChild(el('div', { 'class': 'timerbox' }));
    var pic = box.appendChild(el('div', { 'class': 'job', id: 'job' }));
    pic.appendChild(picture(t, false));
    var dial = box.appendChild(el('div', { 'class': 'dial', id: 'timer' }));
    var now = el('p', { 'class': 'timenow', id: 'timer-now', 'aria-live': 'polite' });
    function show(ringing) {
      dial.innerHTML = '';
      dial.appendChild(svgEl(timerArt(s, ringing), '0 0 200 200', timerLabel(s, ringing)));
      now.textContent = ringing ? 'Ding! Ding! The timer has rung.' : 'The timer is set to ' + amount(s) + '.';
    }
    show(false);
    area.appendChild(now);
    var pad1 = area.appendChild(el('div', { 'class': 'timerpad', id: 'timerpad' })), buttons = [];
    function lab(text) { pad1.appendChild(el('p', { 'class': 'lab' }, text)); }
    function btn(id, text, delta) {
      var b = el('button', { type: 'button', id: id }, text);
      b.addEventListener('click', function () {
        if (busy || ctx.solved()) return;
        s = Math.max(0, Math.min(max, s + delta));
        show(false); ctx.setSub('', '');
      });
      pad1.appendChild(b); buttons.push(b);
    }
    lab('Minutes');
    if (lv > 0) { btn('min-down10', '− 10 minutes', -600); btn('min-up10', '+ 10 minutes', 600); }
    btn('min-down', '− 1 minute', -60); btn('min-up', '+ 1 minute', 60);
    if (lv > 0) { lab('Seconds'); btn('sec-down', '− 10 seconds', -10); btn('sec-up', '+ 10 seconds', 10); }
    var start = el('button', { type: 'button', id: 'start', 'class': 'primary' }, 'Start the timer');
    area.appendChild(el('div', { 'class': 'row center' })).appendChild(start);
    buttons.push(start);

    function finish() {
      if (!dial.isConnected) return;
      s = 0; show(true);
      pic.innerHTML = ''; pic.appendChild(picture(t, true));
      var nice = t.as ? capital(t.as) + ' is ' + amount(t.s) + '. ' : '';
      ctx.win('Yes! You set the timer for ' + amount(t.s) + '. ' + nice + 'Ding! ' + t.done);
    }
    start.addEventListener('click', function () {
      if (busy || ctx.solved()) return;
      if (s === t.s) {
        busy = true;
        buttons.forEach(function (b) { b.disabled = true; });
        if (still()) { finish(); return; }
        ctx.setSub('The timer is running. We skip ahead, so there is no waiting.', '');
        var steps = 30, k = 0;
        (function tick() {
          if (!dial.isConnected) return;
          k++;
          s = Math.round(t.s * (1 - k / steps));
          if (k >= steps) { finish(); return; }
          dial.innerHTML = ''; dial.appendChild(svgEl(timerArt(s, false), '0 0 200 200', 'The kitchen timer is going down.'));
          window.setTimeout(tick, 100);
        })();
        return;
      }
      var text = s === 0 ? 'The timer is at 0. Press the + buttons to set it to ' + amount(t.s) + '.' :
        'Your timer is set to ' + amount(s) + '. We need ' + amount(t.s) + (t.as ? ', that is ' + t.as : '') + '. Use + and − to change it.';
      ctx.miss(null, text, function (box2) {
        var pool = TASKS.filter(function (x) { return x.lv.indexOf(lv) > -1 && x.s !== t.s; });
        var withAs = pool.filter(function (x) { return !!x.as; }), o = (t.as && withAs.length ? withAs : pool)[rnd((t.as && withAs.length ? withAs : pool).length)];
        box2.appendChild(el('p', {}, 'Here is another one. ' + o.job + ' Set the timer for ' + asked(o) + '.'));
        box2.appendChild(ctx.moviePanel(function () { return howMovie(o); }));
        box2.appendChild(el('p', { id: 'lesson-say' }, howWords(o, lv)));
      });
    });
  }

  window.YS_CLOCKS_MORE = {
    names: { world: 'Time around the world', timer: 'Set the kitchen timer' },
    games: { world: world, timer: timer },
    // For tests and the clocks page: the cities, the time maths, and the round makers.
    cities: CITIES, timeIn: timeIn, worldNow: worldNow, makeWorld: makeWorld, makeTimer: makeTimer, tasks: TASKS,
    level: level, amount: amount, label: label, timeWords: timeWords, partNoun: partNoun, howWords: howWords, flagOf: flagOf
  };
})();
