/* Yaanstep Sprouts: Fractions, decimals and percent (ages 7 to 12; Manish, 23 Nov 2026: "Also add another section under
   maths where it can help to understand decimals, %, what is 2/3 of 100, tip calculation like things, portions along with
   graphics also explain realistic examples like pizza, pie etc.").
   Learn: a moving lesson in 7 parts. Games: Pizza and pie portions, A fraction of a number (bar models), Decimals,
   Percent, Same amount, three ways, and Real life (tips, sales, splitting a bill). Money is US dollars and cents.
   Every picture is our own drawing. A right answer fills in the "?" and says why. A miss draws the child's answer on the
   same picture as the answer we want ("You said 60. That is this much of the bar."), and offers a short moving lesson.
   Each game fits the child's age from the profile ("ys-profile"), read only: ages 7 and 8 friendly numbers, halves,
   quarters and tenths; 9 and 10 thirds, fifths, hundredths, 10, 25 and 50 percent and tips; 11 and 12 any common fraction,
   15, 18 and 35 percent and sales in two steps. No profile sits in the middle (about ages 8 and 9). Under 7, a gentle note
   and the easiest rounds. Two right answers in a row step up a little, a miss steps back; in memory only, for this visit.
   No question comes back in a visit. Nothing is stored or sent; points go to maths through the shell. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle, cap = S.cap;
  var INK = '#17332c', TEAL = '#1F7A6D', DTEAL = '#0f5a4f', ORANGE = '#C2410C', DORANGE = '#9a3412', SHADE = '#8fd3c3';

  /* ---------- the child's age, read from the profile ---------- */
  function age() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'), a = p && +p.age; return a >= 3 && a <= 12 ? a : 0; } catch (e) { return 0; }
  }
  /** Where each age starts, from 0 (easiest) to 4: 8 and under 0, no profile 1, 9 and 10 at 2, 11 and 12 at 3. */
  function base(a) { return !a ? 1 : a <= 8 ? 0 : a <= 10 ? 2 : 3; }
  /** Under 7 the rounds stay at the easiest step. */
  function topStep(a) { return a && a < 7 ? 0 : 4; }
  /** Choice tiles: 3 up to age 8, 4 from age 9 and with no profile. */
  function choiceCount(a) { return a && a <= 8 ? 3 : 4; }

  /* ---------- a step up after two right answers in a row, a step back after a miss (memory only) ---------- */
  var adj = {}, streak = {}, missed = false;
  function stepFor(g, a) { return Math.max(0, Math.min(topStep(a), base(a) + (adj[g] || 0))); }
  function gotIt(g) {
    if (missed) return;
    streak[g] = (streak[g] || 0) + 1;
    if (streak[g] >= 2) { streak[g] = 0; adj[g] = Math.min(1, (adj[g] || 0) + 1); }
  }
  function slipped(g) {
    if (missed) return;
    missed = true; streak[g] = 0; adj[g] = Math.max(-1, (adj[g] || 0) - 1);
  }

  /* ---------- small helpers ---------- */
  function pick(list) { return list[rnd(list.length)]; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function fr(n, d) { return n + '/' + d; }
  /** The value of "3/8", or NaN. */
  function fv(s) { var m = /^(\d+)\/(\d+)$/.exec(String(s)); return m ? +m[1] / +m[2] : NaN; }
  function low(n, d) { var g = gcd(n, d); return fr(n / g, d / g); }
  var ORD = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'],
    8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 11: ['eleventh', 'elevenths'], 12: ['twelfth', 'twelfths'], 20: ['twentieth', 'twentieths'],
    25: ['twenty-fifth', 'twenty-fifths'], 50: ['fiftieth', 'fiftieths'], 100: ['hundredth', 'hundredths'] };
  /** "3 eighths", "one half". */
  function fracWords(n, d) {
    if (n === d) return '1 whole';
    var o = ORD[d];
    if (!o) return n + ' over ' + d;
    return (n === 1 && d === 2) ? 'one half' : n + ' ' + o[n === 1 ? 0 : 1];
  }
  function fw(s) { var m = /^(\d+)\/(\d+)$/.exec(s); return m ? fracWords(+m[1], +m[2]) : s; }
  /** Money, kept in whole cents. */
  function money(c) { return '$' + Math.floor(c / 100) + '.' + ('0' + (c % 100)).slice(-2); }
  function moneyWords(c) {
    var d = Math.floor(c / 100), k = c % 100, out = [];
    if (d) out.push(d + (d === 1 ? ' dollar' : ' dollars'));
    if (k || !d) out.push(k + (k === 1 ? ' cent' : ' cents'));
    return out.join(' and ');
  }
  /** Decimals, kept in whole thousandths: 450 is "0.45". */
  function dec(t) {
    var w = Math.floor(t / 1000), r = t % 1000, s = String(w);
    if (r) s += '.' + ('00' + r).slice(-3).replace(/0+$/, '');
    return s;
  }
  function th(s) { return Math.round(parseFloat(s) * 1000); }
  /** A number that may have a part after the point: 0.5, 12, 7.2. */
  function num(n) { return String(Math.round(n * 1000) / 1000); }
  /** Words the voice can read: fractions, percent and money. */
  function speakable(t) {
    return String(t).replace(/\$(\d+)\.(\d\d)/g, function (m, d, c) { return moneyWords(+d * 100 + +c); })
      .replace(/(\d+)\/(\d+)/g, function (m, n, d) { return fracWords(+n, +d); })
      .replace(/(\d+(?:\.\d+)?)%/g, '$1 percent').replace(/÷/g, 'divided by').replace(/×/g, 'times').replace(/−/g, 'minus');
  }
  /** Choice tiles: the answer and n-1 others, each with a different value. must first, then good (shuffled), then spare. */
  function choose(ans, good, spare, n, val, must) {
    var out = [String(ans)], vs = [val(String(ans))];
    function add(c) {
      c = String(c);
      if (out.length >= n) return;
      var v = val(c);
      if (!isFinite(v) || v <= 0) return;
      if (vs.some(function (x) { return Math.abs(x - v) < 1e-9; }) || out.indexOf(c) > -1) return;
      out.push(c); vs.push(v);
    }
    (must || []).forEach(add);
    shuffle(good).forEach(add);
    shuffle(spare).forEach(add);
    return shuffle(out);
  }
  /** "1 square", "25 squares", "about 1.4 squares". */
  function squares(n) { return (Math.abs(n - Math.round(n)) > 1e-9 ? 'about ' + f1(n) : String(Math.round(n))) + (Math.abs(n - 1) < 1e-9 ? ' square' : ' squares'); }
  function range(a, b, step) { var o = []; for (var i = a; i <= b; i += (step || 1)) o.push(i); return o; }
  var NAMES = ['Maya', 'Leo', 'Aisha', 'Diego', 'Mei', 'Kofi', 'Priya', 'Sam', 'Noor', 'Lucas', 'Hana', 'Omar', 'Zara', 'Ravi', 'Ana', 'Jin',
    'Amara', 'Mateo', 'Yuki', 'Ella', 'Tariq', 'Sofia', 'Kwame', 'Lena'];
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }
  function mv(s, inner) { return '<g' + at(s) + '>' + inner + '</g>'; }
  function txt(x, y, t, o) {
    o = o || {};
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + (o.size || 14) + '" font-weight="' + (o.weight || 700) + '" fill="' + (o.fill || INK) + '">' + esc(t) + '</text>';
  }
  function stack(pics, gap) {
    var y = 0, out = '';
    pics.forEach(function (p) { var h = +p.vb.split(' ')[3]; out += '<g transform="translate(0 ' + y + ')">' + p.svg + '</g>'; y += h + (gap || 6); });
    return { svg: out, vb: '0 0 320 ' + (y - (gap || 6)), label: pics.map(function (p) { return p.label; }).join(' ') };
  }

  /* ---------- drawings: pizza, pie and chocolate ---------- */
  function ptA(cx, cy, r, t) { var a = t * 2 * Math.PI; return [f1(cx + r * Math.sin(a)), f1(cy - r * Math.cos(a))]; }
  /** A slice from turn a0 to turn a1 (0 is 12 o'clock, going clockwise). */
  function wedge(cx, cy, r, a0, a1) {
    if (a1 - a0 >= 0.9999) return 'M' + cx + ' ' + (cy - r) + 'A' + r + ' ' + r + ' 0 1 1 ' + cx + ' ' + (cy + r) + 'A' + r + ' ' + r + ' 0 1 1 ' + cx + ' ' + (cy - r) + 'Z';
    var p0 = ptA(cx, cy, r, a0), p1 = ptA(cx, cy, r, a1);
    return 'M' + cx + ' ' + cy + 'L' + p0.join(' ') + 'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 0.5 ? 1 : 0) + ' 1 ' + p1.join(' ') + 'Z';
  }
  var FOOD = {
    pizza: { name: 'pizza', unit: 'slices', one: 'slice', crust: '#d99a4e', fill: '#f6c945', edge: '#8a5a2b', top: '#c0392b' },
    pie: { name: 'pie', unit: 'slices', one: 'slice', crust: '#c98a4b', fill: '#a33a5e', edge: '#6e3f1c', top: '#f3d9a8' },
    bar: { name: 'chocolate bar', unit: 'squares', one: 'square', fill: '#7b4a2a', edge: '#3f2414', top: '#9a6240' }
  };
  var FRIEND = ['#9fd8cb', '#f6b48b', '#c9b6ef', '#a9cdf2', '#f5b3cf', '#d6e89a'];
  /** A round pizza or pie cut into d equal slices. gone: slices eaten (drawn as an empty plate). tint: a fill for each slice. */
  function roundFood(kind, cx, cy, r, d, gone, tint) {
    var F = FOOD[kind], out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" fill="#fff" stroke="#b9c7c2" stroke-width="2"/>';
    for (var i = 0; i < d; i++) {
      var a0 = i / d, a1 = (i + 1) / d, m = ptA(cx, cy, r * 0.55, (a0 + a1) / 2);
      if (gone && gone.indexOf(i) > -1) {
        out += '<path d="' + wedge(cx, cy, r, a0, a1) + '" fill="#f4f1ea" stroke="#a8977d" stroke-width="1.5" stroke-dasharray="4 3"/>';
        out += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="1.8" fill="#a8977d"/>';
        continue;
      }
      out += '<path d="' + wedge(cx, cy, r, a0, a1) + '" fill="' + F.crust + '" stroke="' + F.edge + '" stroke-width="1.5" stroke-linejoin="round"/>';
      out += '<path d="' + wedge(cx, cy, r * 0.84, a0, a1) + '" fill="' + ((tint && tint[i]) || F.fill) + '" stroke="' + F.edge + '" stroke-width="1"/>';
      var s = Math.max(2.2, Math.min(r * 0.1, r * 1.6 / d));
      out += kind === 'pizza' ? '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="' + f1(s) + '" fill="' + F.top + '"/>'
        : '<path d="M' + (m[0] - s) + ' ' + m[1] + 'h' + f1(2 * s) + 'M' + m[0] + ' ' + (m[1] - s) + 'v' + f1(2 * s) + '" stroke="' + F.top + '" stroke-width="2" stroke-linecap="round"/>';
    }
    return out;
  }
  /** Squares of a chocolate bar, counted down each column: 1 row up to 8 squares, 2 rows for 10 and 12. */
  function barGrid(d) { var rows = d >= 10 ? 2 : 1; return { rows: rows, cols: d / rows }; }
  function chocBar(x, y, w, h, d, gone, tint) {
    var G = barGrid(d), cw = w / G.cols, ch = h / G.rows, out = '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="' + (w + 8) + '" height="' + (h + 8) + '" rx="6" fill="#fff" stroke="#b9c7c2" stroke-width="2"/>';
    for (var i = 0; i < d; i++) {
      var c = Math.floor(i / G.rows), r = i % G.rows, sx = f1(x + c * cw), sy = f1(y + r * ch);
      if (gone && gone.indexOf(i) > -1) {
        out += '<rect x="' + sx + '" y="' + sy + '" width="' + f1(cw) + '" height="' + f1(ch) + '" fill="#f4f1ea" stroke="#a8977d" stroke-width="1.5" stroke-dasharray="4 3"/>';
        continue;
      }
      out += '<rect x="' + sx + '" y="' + sy + '" width="' + f1(cw) + '" height="' + f1(ch) + '" fill="' + ((tint && tint[i]) || FOOD.bar.fill) + '" stroke="' + FOOD.bar.edge + '" stroke-width="1.5"/>';
      out += '<rect x="' + f1(+sx + 5) + '" y="' + f1(+sy + 5) + '" width="' + f1(cw - 10) + '" height="' + f1(ch - 10) + '" rx="2" fill="none" stroke="' + FOOD.bar.top + '" stroke-width="1.5"/>';
    }
    return out;
  }
  /** One food, drawn in a box: { svg body, place(start, frac, who) } so a part can be outlined. */
  function food(kind, d, gone, box, tint) {
    box = box || { x: 0, y: 0, w: 320, h: kind === 'bar' ? barGrid(d).rows * 46 + 24 : 170 };
    if (kind === 'bar') {
      var G = barGrid(d), bw = Math.min(box.w - 20, G.cols * 46), bh = G.rows * 46, bx = box.x + (box.w - bw) / 2, by = box.y + (box.h - bh) / 2;
      return {
        h: box.h, svg: chocBar(bx, by, bw, bh, d, gone, tint),
        place: function (start, frac, who) {
          if (frac <= 0) return '';
          var span = Math.min(frac, 1 - start + 0.0001), x0 = bx + start * bw, w = span * bw;
          return who === 'target' ? '<rect x="' + f1(x0 - 3) + '" y="' + (by - 3) + '" width="' + f1(w + 6) + '" height="' + (bh + 6) + '" fill="none" stroke="' + TEAL + '" stroke-width="5"/>'
            : '<rect x="' + f1(x0 + 6) + '" y="' + (by + 6) + '" width="' + f1(Math.max(4, w - 12)) + '" height="' + (bh - 12) + '" fill="' + ORANGE + '" fill-opacity=".35" stroke="' + ORANGE + '" stroke-width="3" stroke-dasharray="6 4"/>';
        }
      };
    }
    var r = Math.min(box.w, box.h) / 2 - 10, cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    return {
      h: box.h, svg: roundFood(kind, cx, cy, r, d, gone, tint),
      place: function (start, frac, who) {
        if (frac <= 0) return '';
        var span = Math.min(frac, 1);
        return who === 'target' ? '<path d="' + wedge(cx, cy, r + 3, start, start + span) + '" fill="none" stroke="' + TEAL + '" stroke-width="5" stroke-linejoin="round"/>'
          : '<path d="' + wedge(cx, cy, r - 12, start, start + span) + '" fill="' + ORANGE + '" fill-opacity=".5" stroke="' + ORANGE + '" stroke-width="3" stroke-dasharray="6 4" stroke-linejoin="round"/>';
      }
    };
  }
  function firstN(n) { return range(0, n - 1); }

  /* ---------- drawings: bars, number lines, grids, a battery, money ---------- */
  /** A bar model. o: parts, top (text over the whole), regions [{from, len, kind: shade|off}], unit(i) (text in a part),
      brace {from, len, text} under the bar, guess {frac, text} (an orange bar under it, the child's answer). */
  function barPic(o) {
    var X = 10, W = 300, Y = 30, H = 40, p = o.parts, uw = W / p, out = '';
    if (o.top) out += '<path d="M' + X + ' 26v-8h' + W + 'v8" fill="none" stroke="' + INK + '" stroke-width="1.5"/>' + txt(X + W / 2, 13, o.top, { size: 14 });
    (o.regions || []).forEach(function (r) {
      if (r.len <= 0) return;
      var x0 = f1(X + r.from * uw), w = f1(r.len * uw);
      out += '<rect x="' + x0 + '" y="' + Y + '" width="' + w + '" height="' + H + '" fill="' + (r.kind === 'off' ? '#f6d0bf' : SHADE) + '"/>';
      if (r.kind === 'off') out += '<path d="M' + x0 + ' ' + (Y + H) + 'l' + w + ' -' + H + '" stroke="' + DORANGE + '" stroke-width="2"/>';
    });
    for (var i = 0; i < p; i++) {
      out += '<rect x="' + f1(X + i * uw) + '" y="' + Y + '" width="' + f1(uw) + '" height="' + H + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
      var t = o.unit ? o.unit(i) : '';
      if (t) out += txt(X + i * uw + uw / 2, Y + H / 2 + 5, t, { size: uw < 32 ? 10 : 13 });
    }
    var h = Y + H + 8;
    if (o.brace) {
      var b0 = X + o.brace.from * uw, b1 = b0 + o.brace.len * uw;
      out += '<path d="M' + f1(b0) + ' ' + (Y + H + 4) + 'v8h' + f1(b1 - b0) + 'v-8" fill="none" stroke="' + DTEAL + '" stroke-width="2"/>';
      var est = String(o.brace.text).length * 5;
      out += txt(Math.min(Math.max((b0 + b1) / 2, 8 + est), 312 - est), Y + H + 32, o.brace.text, { size: 17, fill: DTEAL, weight: 800 });
      h = Y + H + 40;
    }
    if (o.guess) {
      var gf = Math.max(0, o.guess.frac), gw = Math.min(gf, 1.03) * W;
      out += '<rect x="' + X + '" y="' + (h + 4) + '" width="' + f1(Math.max(gw, 3)) + '" height="20" rx="3" fill="#fbd5bd" stroke="' + ORANGE + '" stroke-width="2.5" stroke-dasharray="6 4"/>';
      if (gf > 1.03) out += '<path d="M' + (X + W + 2) + ' ' + (h + 14) + 'h6m-5-5 5 5-5 5" stroke="' + ORANGE + '" stroke-width="2.5" fill="none"/>';
      out += txt(X, h + 42, o.guess.text, { anchor: 'start', fill: DORANGE });
      h += 50;
    }
    return { svg: out, vb: '0 0 320 ' + h, label: o.label || '' };
  }
  /** A number line (or a measuring tape) from lo to hi, in thousandths. marks: [{v, who: arrow|target|guess, text}]. */
  function linePic(o) {
    var X = 26, W = 268, Y = o.tape ? 90 : 60, GY = o.tape ? 52 : 40, lo = o.lo, hi = o.hi, out = '', n = Math.round((hi - lo) / o.tick);
    function pos(v) { return X + (v - lo) / (hi - lo) * W; }
    if (o.tape) out += '<rect x="' + (X - 8) + '" y="' + (Y - 14) + '" width="' + (W + 16) + '" height="36" rx="4" fill="#f7e08a" stroke="#9a7a00" stroke-width="1.5"/>';
    else out += '<path d="M' + (X - 8) + ' ' + Y + 'H' + (X + W + 8) + '" stroke="' + INK + '" stroke-width="2"/>';
    if (o.ribbon != null) out += '<rect x="' + X + '" y="' + (Y - 70) + '" width="' + f1(pos(o.ribbon) - X) + '" height="14" rx="3" fill="#d6453d" stroke="#8f2a24" stroke-width="1.5"/><path d="M' + f1(pos(o.ribbon)) + ' ' + (Y - 56) + 'V' + (Y - 14) + '" stroke="#8f2a24" stroke-width="1.5" stroke-dasharray="3 2"/>';
    var every = o.labelEvery || o.tick;
    for (var i = 0; i <= n; i++) {
      var v = lo + i * o.tick, x = f1(pos(v)), big = (v - lo) % every === 0, mid = !big && o.midEvery && (v - lo) % o.midEvery === 0;
      out += '<path d="M' + x + ' ' + (o.tape ? Y - 14 : Y - (big ? 9 : mid ? 7 : 5)) + 'V' + (Y + (big ? 10 : mid ? 6 : 4)) + '" stroke="' + INK + '" stroke-width="' + (big ? 1.6 : 1) + '"/>';
      if (big) out += txt(x, Y + 26 + (o.tape ? 4 : 0), o.fmt ? o.fmt(v) : dec(v) + (o.unit && i === n ? ' ' + o.unit : ''), { size: n > 12 ? 11 : 12, weight: 600 });
    }
    (o.marks || []).forEach(function (m) {
      var inside = m.v >= lo && m.v <= hi, x = f1(pos(Math.max(lo, Math.min(hi, m.v))));
      if (m.who === 'arrow') out += '<path d="M' + x + ' ' + (Y - 40) + 'V' + (Y - 12) + 'm-7-8 7 8 7-8" stroke="' + TEAL + '" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      if (m.who === 'target') out += '<path d="M' + x + ' ' + (Y - 6) + 'l-8 -14h16z" fill="' + TEAL + '"/>' + txt(x, Y - 26, m.text, { fill: DTEAL, size: 13 });
      if (m.who === 'guess') {
        out += inside ? '<circle cx="' + x + '" cy="' + (Y + GY) + '" r="7" fill="' + ORANGE + '"/><path d="M' + x + ' ' + (Y + GY - 7) + 'V' + (Y + 12) + '" stroke="' + ORANGE + '" stroke-width="2.5" stroke-dasharray="4 3"/>'
          : '<path d="M' + x + ' ' + (Y + GY) + 'h' + (m.v > hi ? 10 : -10) + 'm' + (m.v > hi ? -6 : 6) + ' -6 ' + (m.v > hi ? 6 : -6) + ' 6 ' + (m.v > hi ? -6 : 6) + ' 6" stroke="' + ORANGE + '" stroke-width="3" fill="none"/>';
        out += txt(Math.min(Math.max(+x, 60), 260), Y + GY + 24, m.text, { fill: DORANGE, size: 13 });
      }
    });
    var hasGuess = (o.marks || []).some(function (m) { return m.who === 'guess'; });
    return { svg: out, vb: '0 0 320 ' + (Y + (hasGuess ? GY + 32 : o.tape ? 40 : 36)), label: o.label || '' };
  }
  /** A grid of 100 squares. shade: how many are shaded (a half square is allowed); dots: the child's answer, as orange dots. */
  function gridPic(shade, dots, cell, x0, y0) {
    cell = cell || 14; x0 = x0 || 0; y0 = y0 || 0;
    var out = '<rect x="' + x0 + '" y="' + y0 + '" width="' + cell * 10 + '" height="' + cell * 10 + '" fill="#fff"/>';
    for (var i = 0; i < 100; i++) {
      var x = x0 + (i % 10) * cell, y = y0 + Math.floor(i / 10) * cell, part = Math.max(0, Math.min(1, shade - i));
      if (part > 0) out += '<rect x="' + x + '" y="' + y + '" width="' + f1(cell * part) + '" height="' + cell + '" fill="#4fa894"/>';
      if (dots && i < Math.round(dots)) out += '<circle cx="' + f1(x + cell / 2) + '" cy="' + f1(y + cell / 2) + '" r="' + f1(cell * 0.24) + '" fill="' + ORANGE + '" stroke="#fff" stroke-width="1"/>';
    }
    for (var k = 0; k <= 10; k++) {
      var w = k === 5 || k === 0 || k === 10 ? 1.6 : 0.8;
      out += '<path d="M' + (x0 + k * cell) + ' ' + y0 + 'v' + cell * 10 + 'M' + x0 + ' ' + (y0 + k * cell) + 'h' + cell * 10 + '" stroke="' + INK + '" stroke-width="' + w + '"/>';
    }
    return out;
  }
  /** A phone battery, p percent full, with a teal line at mark (0 to 1) when given. */
  function batteryPic(p, mark, markText) {
    var X = 20, W = 250, out = '<rect x="' + X + '" y="20" width="' + W + '" height="70" rx="12" fill="#fff" stroke="' + INK + '" stroke-width="3"/><rect x="' + (X + W) + '" y="40" width="14" height="30" rx="4" fill="' + INK + '"/>';
    out += '<rect x="' + (X + 5) + '" y="25" width="' + f1((W - 10) * p / 100) + '" height="60" rx="8" fill="' + (p <= 20 ? '#e8a21c' : '#3f9d4a') + '"/>';
    var h = 100;
    if (mark != null) {
      var mx = f1(X + 5 + (W - 10) * mark);
      out += '<path d="M' + mx + ' 12V100" stroke="' + TEAL + '" stroke-width="3" stroke-dasharray="6 4"/>' + txt(Math.min(Math.max(+mx, 50), 270), 118, markText, { fill: DTEAL });
      h = 126;
    }
    return { svg: out, vb: '0 0 300 ' + h };
  }
  /** Bills and coins for an amount in cents (our own simple drawings, the value written on each). */
  function moneyPic(c) {
    var d = Math.floor(c / 100), k = c % 100, items = [];
    for (var i = 0; i < Math.floor(d / 5); i++) items.push({ bill: '$5' });
    for (i = 0; i < d % 5; i++) items.push({ bill: '$1' });
    [[25, 17], [10, 12.5], [5, 14.5], [1, 12]].forEach(function (cn) { while (k >= cn[0]) { items.push({ coin: cn[0], r: cn[1] }); k -= cn[0]; } });
    var x = 6, y = 6, rowH = 40, out = '';
    items.forEach(function (it) {
      var w = it.bill ? 72 : it.r * 2 + 6;
      if (x + w > 316) { x = 6; y += rowH + 6; }
      if (it.bill) out += '<rect x="' + x + '" y="' + (y + 2) + '" width="68" height="36" rx="4" fill="#d6ead0" stroke="#3f6b3a" stroke-width="2"/><rect x="' + (x + 4) + '" y="' + (y + 6) + '" width="60" height="28" rx="3" fill="none" stroke="#3f6b3a" stroke-width="1"/>' + txt(x + 34, y + 26, it.bill, { size: 15, weight: 800, fill: '#22421f' });
      else out += '<circle cx="' + (x + it.r + 2) + '" cy="' + (y + 20) + '" r="' + it.r + '" fill="' + (it.coin === 1 ? '#c9824f' : '#d5dbe0') + '" stroke="#5b6670" stroke-width="2"/>' + txt(x + it.r + 2, y + 24, it.coin + '¢', { size: it.coin === 25 ? 11 : 9, weight: 800, fill: it.coin === 1 ? '#3b2410' : INK });
      x += w + 4;
    });
    return { svg: out, vb: '0 0 320 ' + (y + rowH + 4) };
  }
  /** Bars of the same length, each showing an amount from 0 to 1: compare them by looking. mine: the child's pick, outlined orange. */
  function stripsPic(items, parts) {
    var X = 70, W = 236, out = '', best = Math.max.apply(null, items.map(function (i) { return i.v; }));
    items.forEach(function (it, j) {
      var y = 10 + j * 50, p = it.parts || parts || 10;
      out += txt(X - 10, y + 24, it.label, { anchor: 'end', size: 16, weight: 800 });
      out += '<rect x="' + X + '" y="' + y + '" width="' + W + '" height="34" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
      out += '<rect x="' + X + '" y="' + y + '" width="' + f1(W * Math.min(it.v, 1)) + '" height="34" fill="' + SHADE + '"/>';
      for (var i = 1; i < p; i++) out += '<path d="M' + f1(X + W * i / p) + ' ' + y + 'v34" stroke="' + INK + '" stroke-width="' + (p > 20 && i % 10 ? 0.4 : 1) + '"/>';
      if (it.mine) out += '<rect x="' + (X - 4) + '" y="' + (y - 4) + '" width="' + (W + 8) + '" height="42" fill="none" stroke="' + ORANGE + '" stroke-width="3" stroke-dasharray="6 4"/>';
    });
    var bx = f1(X + W * Math.min(best, 1));
    out += '<path d="M' + bx + ' 4V' + (items.length * 50 + 6) + '" stroke="' + TEAL + '" stroke-width="3" stroke-dasharray="5 4"/>';
    return { svg: out, vb: '0 0 320 ' + (items.length * 50 + 10) };
  }
  /** Counters in groups: total things, and the child's guess for each of n friends, under them. */
  function groupsPic(total, n, each, guess, unit) {
    var out = '', R = 8, S = 21, y = 24;
    function row(count, size, color, top, label) {
      var o = txt(6, top - 8, label, { anchor: 'start', size: 13 }), x = 10, yy = top;
      for (var i = 0; i < count; i++) {
        if (size && i && i % size === 0) x += 10;
        if (x > 300) { x = 10; yy += S; }
        o += '<circle cx="' + (x + R) + '" cy="' + (yy + R) + '" r="' + R + '" fill="' + (color === 'mix' ? FRIEND[Math.floor(i / size) % FRIEND.length] : color) + '" stroke="' + INK + '" stroke-width="1.2"/>';
        x += S;
      }
      return { svg: o, bottom: yy + S };
    }
    var a = row(total, each, 'mix', y, 'The ' + unit + ': ' + total + ', ' + each + ' for each friend');
    var b = row(guess * n, guess, '#fbd5bd', a.bottom + 26, 'Your answer: ' + n + ' friends with ' + guess + ' each = ' + guess * n);
    out = a.svg + b.svg.replace(/stroke="#17332c"/g, 'stroke="' + ORANGE + '"');
    return { svg: out, vb: '0 0 320 ' + (b.bottom + 6) };
  }

  /* ======================================================================
     1. Pizza and pie portions
     ====================================================================== */
  var PIZZA_D = [
    { pizza: [4, 8], pie: [4, 8], bar: [8, 10] },
    { pizza: [4, 6, 8], pie: [4, 6, 8], bar: [6, 8, 10] },
    { pizza: [6, 8, 10, 12], pie: [5, 6, 8, 10], bar: [8, 10, 12] }
  ];
  var MORE_FR = [
    ['1/2', '1/4', '3/4', '1/8', '3/8', '5/8', '7/8', '2/4', '4/8', '2/8', '6/8'],
    ['1/3', '2/3', '1/6', '5/6', '2/6', '4/6', '3/6'],
    ['1/5', '2/5', '3/5', '4/5', '3/10', '7/10', '4/10', '6/10', '9/10'],
    ['5/12', '7/12', '11/12', '3/12', '9/12', '5/6', '7/10']
  ];
  function moreSet(st) { var o = []; for (var i = 0; i <= Math.min(st, 3); i++) o = o.concat(MORE_FR[i]); return o.filter(function (x, i, a) { return a.indexOf(x) === i; }); }
  function foodName(kind) { return FOOD[kind].name; }
  function slicesOf(kind) { return FOOD[kind].unit; }

  function makePizza(kind, st, n) {
    var T = PIZZA_D[Math.min(st, 2)], kindFood = pick(['pizza', 'pie', 'bar']), who = pick(NAMES);
    if (kind === 'left' || kind === 'eaten') {
      var d = pick(T[kindFood]), e = between(1, d - 1), left = d - e, ans = fr(kind === 'left' ? left : e, d);
      var other = fr(kind === 'left' ? e : left, d), cn = Math.min(n, d - 1);
      var choices = choose(ans, [other], range(1, d - 1).map(function (k) { return fr(k, d); }), cn, fv);
      var F = FOOD[kindFood], lowAns = low(kind === 'left' ? left : e, d);
      return {
        game: 'pizza', kind: kind, key: 'pizza-' + kind + '-' + kindFood + '-' + d + '-' + e, data: { food: kindFood, d: d, e: e },
        text: who + '\'s ' + F.name + ' is cut into ' + d + ' equal ' + F.unit + '. ' + who + ' ate ' + e + ' of them. What fraction of the ' + F.name + ' is ' + (kind === 'left' ? 'left?' : 'eaten?'),
        line: ['Part ' + (kind === 'left' ? 'left' : 'eaten') + ': ', ''], ans: ans, choices: choices, tile: 'frac',
        why: d + ' equal ' + F.unit + ', ' + e + ' eaten, so ' + left + ' ' + (left === 1 ? 'is' : 'are') + ' left. ' + (kind === 'left' ? left : e) + ' of ' + d + ' equal ' + F.unit + ' is ' + ans + ' of the ' + F.name + '.' + (lowAns !== ans ? ' That is the same as ' + lowAns + '.' : ''),
        pic: function (done) {
          var f = food(kindFood, d, firstN(e));
          return { svg: f.svg + (done ? f.place(kind === 'left' ? e / d : 0, (kind === 'left' ? left : e) / d, 'target') : ''), vb: '0 0 320 ' + f.h,
            label: 'A ' + F.name + ' cut into ' + d + ' equal ' + F.unit + '. ' + e + ' ' + (e === 1 ? F.one + ' has' : F.unit + ' have') + ' been eaten.' };
        },
        wrong: function (v) {
          var g = fv(v), f = food(kindFood, d, firstN(e)), start = kind === 'left' ? e / d : 0;
          return { text: 'You said ' + v + '. That is this much of the ' + F.name + ', shaded orange. We want the part ' + (kind === 'left' ? 'left' : 'eaten') + ', ' + ans + ', this much, inside the teal line.' + (v === other ? ' You counted the ' + F.unit + ' ' + (kind === 'left' ? 'eaten' : 'left') + '.' : ''),
            svg: f.svg + f.place(start, kind === 'left' ? left / d : e / d, 'target') + f.place(start, g, 'guess'), vb: '0 0 320 ' + f.h,
            label: 'The ' + F.name + ' again. Orange shading shows ' + fw(v) + ', your answer. A teal line goes round ' + fw(ans) + ', the part ' + (kind === 'left' ? 'left' : 'eaten') + '.' };
        },
        lesson: function () {
          var k2 = pick(['pizza', 'pie']), d2 = pick([4, 6, 8].filter(function (x) { return x !== d; })), e2 = between(1, d2 - 1);
          return { movie: function () { return pizzaMovie(k2, d2, e2); },
            text: 'Count all the equal ' + FOOD[k2].unit + ': that is the bottom number. Count the ' + FOOD[k2].unit + ' you want: that is the top number. This ' + FOOD[k2].name + ' has ' + d2 + ' ' + FOOD[k2].unit + ' and ' + e2 + ' are eaten, so ' + (d2 - e2) + ' are left: ' + fracWords(d2 - e2, d2) + ' of the ' + FOOD[k2].name + ' is left.' };
        }
      };
    }
    if (kind === 'share') {
      var fr2 = st >= 2 && rnd(2) === 0, friends, d2, ok = [];
      (st >= 1 ? [2, 3, 4, 5, 6] : [2, 3, 4]).forEach(function (f) { T[kindFood].concat(kindFood === 'bar' ? [12] : []).forEach(function (dd) { if (dd % f === 0 && dd > f) ok.push([f, dd]); }); });
      var pr = pick(ok); friends = pr[0]; d2 = pr[1];
      var each = d2 / friends, Fd = FOOD[kindFood];
      var sAns = fr2 ? fr(1, friends) : String(each);
      var sChoices = fr2 ? choose(sAns, [fr(1, d2), fr(friends, d2), fr(1, friends + 1), fr(1, Math.max(2, friends - 1)), fr(2, friends + 2)], [fr(1, 8), fr(1, 10), fr(1, 3), fr(1, 2), fr(3, 4)], n, fv)
        : choose(sAns, [d2, friends, d2 - friends, each + 1, each - 1, each * 2], range(1, 12), n, Number);
      return {
        game: 'pizza', kind: 'share', key: 'pizza-share-' + kindFood + '-' + d2 + '-' + friends + '-' + (fr2 ? 'f' : 'n'), data: { food: kindFood, d: d2, n: friends, ask: fr2 ? 'frac' : 'count' },
        text: friends + ' friends share a ' + Fd.name + ' cut into ' + d2 + ' equal ' + Fd.unit + '. Each friend gets the same amount. ' + (fr2 ? 'What fraction of the ' + Fd.name + ' does each friend get?' : 'How many ' + Fd.unit + ' does each friend get?'),
        line: fr2 ? ['Each friend gets ', ' of the ' + Fd.name] : [d2 + ' ' + Fd.unit + ' shared by ' + friends + ' = ', ' each'],
        ans: sAns, choices: sChoices, tile: fr2 ? 'frac' : 'word',
        labels: fr2 ? null : sChoices.reduce(function (o, c) { o[c] = c; return o; }, {}),
        why: d2 + ' ' + Fd.unit + ' shared by ' + friends + ' is ' + each + ' ' + (each === 1 ? Fd.one : Fd.unit) + ' each, because ' + friends + ' × ' + each + ' = ' + d2 + '.' + (fr2 ? ' ' + each + ' of ' + d2 + ' ' + Fd.unit + ' is ' + fr(each, d2) + (each > 1 ? ', the same as ' + sAns : '') + ': the ' + Fd.name + ' is shared into ' + friends + ' equal parts.' : ''),
        pic: function (done) {
          var tint = done ? range(0, d2 - 1).map(function (i) { return FRIEND[Math.floor(i / each) % FRIEND.length]; }) : null, f = food(kindFood, d2, [], null, tint);
          return { svg: f.svg, vb: '0 0 320 ' + f.h, label: 'A ' + Fd.name + ' cut into ' + d2 + ' equal ' + Fd.unit + (done ? ', coloured in ' + friends + ' groups of ' + each + '.' : '.') };
        },
        wrong: function (v) {
          if (fr2) {
            var f = food(kindFood, d2, []), g = fv(v);
            return { text: 'You said ' + v + '. That is this much of the ' + Fd.name + ', shaded orange. We want one friend\'s share, ' + sAns + ', this much, inside the teal line.',
              svg: f.svg + f.place(0, 1 / friends, 'target') + f.place(0, g, 'guess'), vb: '0 0 320 ' + f.h,
              label: 'The ' + Fd.name + ' again. Orange shading shows ' + fw(v) + ', your answer. A teal line goes round ' + fw(sAns) + ', one friend\'s share.' };
          }
          var gN = +v, pic = groupsPic(d2, friends, each, gN, Fd.unit);
          return { text: 'You said ' + gN + '. ' + friends + ' friends with ' + gN + ' each need ' + gN * friends + ' ' + Fd.unit + ', shown in orange. The ' + Fd.name + ' has ' + d2 + '.' + (gN * friends > d2 ? ' That is too many.' : ' Some would be left over.'),
            svg: pic.svg, vb: pic.vb, label: 'Top: ' + d2 + ' ' + Fd.unit + ' coloured in ' + friends + ' groups of ' + each + '. Below, in orange, your answer: ' + friends + ' groups of ' + gN + ', which make ' + gN * friends + '.' };
        },
        lesson: function () {
          var n2 = pick([2, 3, 4].filter(function (x) { return x !== friends; })), dd = n2 * pick([2, 3]);
          return { movie: function () { return shareMovie(dd, n2); },
            text: 'Share the ' + FOOD.pizza.unit + ' out one at a time, like dealing cards, until none are left. ' + dd + ' slices shared by ' + n2 + ' friends: each friend gets ' + dd / n2 + ', because ' + n2 + ' × ' + dd / n2 + ' = ' + dd + '. Each friend gets 1 of ' + n2 + ' equal parts: ' + fracWords(1, n2) + ' of the pizza.' };
        }
      };
    }
    // kind "more": which is more of the pizza?
    var set = moreSet(st), a, b, same = rnd(5) === 0, guard = 0;
    do {
      a = pick(set); b = pick(set); guard++;
      var eq = Math.abs(fv(a) - fv(b)) < 1e-9;
    } while ((a === b || eq !== same || (st >= 3 && !same && Math.abs(fv(a) - fv(b)) > 0.2) || (same && (a.split('/')[1] === b.split('/')[1]))) && guard < 400);
    if (a === b || guard >= 400) { a = '3/8'; b = '1/2'; }
    var va = fv(a), vb = fv(b), mAns = Math.abs(va - vb) < 1e-9 ? 'same' : va > vb ? a : b, mk = rnd(2) ? 'pizza' : 'pie';
    var rel = function (x, y) { return Math.abs(fv(x) - fv(y)) < 1e-9 ? 'the same as' : fv(x) > fv(y) ? 'more than' : 'less than'; };
    function two(mine) {
      var da = +a.split('/')[1], db = +b.split('/')[1], na = +a.split('/')[0], nb = +b.split('/')[0];
      var A = food(mk, da, range(na, da - 1), { x: 0, y: 0, w: 160, h: 150 }), B = food(mk, db, range(nb, db - 1), { x: 160, y: 0, w: 160, h: 150 });
      return A.svg + B.svg + txt(80, 166, a, { size: 17, weight: 800 }) + txt(240, 166, b, { size: 17, weight: 800 }) +
        (mine === a ? '<rect x="4" y="2" width="152" height="172" rx="10" fill="none" stroke="' + ORANGE + '" stroke-width="3" stroke-dasharray="6 4"/>' : '') +
        (mine === b ? '<rect x="164" y="2" width="152" height="172" rx="10" fill="none" stroke="' + ORANGE + '" stroke-width="3" stroke-dasharray="6 4"/>' : '');
    }
    return {
      game: 'pizza', kind: 'more', key: 'pizza-more-' + [a, b].sort().join('-'), data: { a: a, b: b },
      text: 'Which is more of the ' + FOOD[mk].name + ': ' + a + ' or ' + b + '?', line: [a + ' is ', ' ' + b], ans: mAns, fill: rel(a, b),
      choices: [a, b, 'same'], tile: 'frac', labels: { same: 'The same' }, cls: 'tiles',
      why: mAns === 'same' ? a + ' and ' + b + ' cover the same amount of the ' + FOOD[mk].name + ', so they are the same.' : mAns + ' covers more of the ' + FOOD[mk].name + '. Put both on bars of the same length: ' + mAns + ' reaches further.',
      pic: function () { return { svg: two(null), vb: '0 0 320 174', label: 'Two ' + FOOD[mk].name + 's the same size. The first shows ' + fw(a) + ' still there, the second shows ' + fw(b) + ' still there.' }; },
      wrong: function (v) {
        var p = stripsPic([{ v: va, label: a, parts: +a.split('/')[1], mine: v === a }, { v: vb, label: b, parts: +b.split('/')[1], mine: v === b }]);
        return { text: v === 'same' ? 'You said they are the same. Look at the bars: ' + a + ' is this much, and ' + b + ' is this much. ' + mAns + ' reaches further, so it is more.'
          : 'You said ' + v + '. On bars of the same length, ' + v + ' is the one with the orange outline. ' + (mAns === 'same' ? a + ' and ' + b + ' reach the same place, so they are the same.' : mAns + ' reaches further, to the teal line, so ' + mAns + ' is more.'),
          svg: p.svg, vb: p.vb, label: 'Two bars the same length. One is ' + fw(a) + ' shaded, the other ' + fw(b) + ' shaded. A teal line marks where the longer shading ends.' + (v === 'same' ? ' Your answer was that they are the same.' : ' Your pick, ' + fw(v) + ', has an orange outline.') };
      },
      lesson: function () {
        var x = pick([['1/2', '3/8'], ['3/4', '5/8'], ['1/4', '3/8'], ['2/3', '1/2']]);
        return { movie: function () { return moreMovie(x[0], x[1]); },
          text: 'To compare parts of the same thing, draw them on bars of the same length. The part that reaches further is more. Here ' + fw(x[0]) + ' and ' + fw(x[1]) + ': ' + (fv(x[0]) > fv(x[1]) ? fw(x[0]) : fw(x[1])) + ' reaches further, so it is more. The top number alone does not tell you.' };
      }
    };
  }

  /* ======================================================================
     2. A fraction of a number, with a bar model
     ====================================================================== */
  var OF_D = [[2, 4, 10], [2, 3, 4, 5, 10], [3, 4, 5, 6, 8, 10], [3, 4, 5, 6, 8, 9, 10, 12], [3, 5, 6, 7, 8, 9, 12]];
  var OF_U = [[1, 10], [2, 12], [3, 20], [5, 40], [8, 50]];
  var STORY = [
    function (N, f) { return { t: N + ' stickers are on a page. ' + f + ' of them are stars. How many are stars?', w: 'stickers' }; },
    function (N, f, who) { return { t: who + ' has ' + N + ' beads. ' + f + ' of the beads are red. How many beads are red?', w: 'beads' }; },
    function (N, f) { return { t: 'A bike trail is ' + N + ' km long. ' + f + ' of it goes along the river. How many km go along the river?', w: 'km' }; },
    function (N, f) { return { t: 'A box holds ' + N + ' crayons. ' + f + ' of them are blue. How many are blue?', w: 'crayons' }; },
    function (N, f, who) { return { t: 'A book has ' + N + ' pages. ' + who + ' has read ' + f + ' of them. How many pages has ' + who + ' read?', w: 'pages' }; },
    function (N, f) { return { t: 'A farm has ' + N + ' animals. ' + f + ' of them are sheep. How many are sheep?', w: 'animals' }; }
  ];
  function makeOf(st, n, story) {
    var d = pick(OF_D[st]), k = 1;
    if (st === 0) k = d === 4 ? pick([1, 1, 3]) : 1;
    else { var ks = range(1, d - 1).filter(function (x) { return gcd(x, d) === 1; }); k = st >= 2 && ks.length > 1 && rnd(3) ? pick(ks.slice(1)) : pick(ks); }
    var u = between(OF_U[st][0], OF_U[st][1]), N = d * u, ans = k * u, f = fr(k, d);
    var s = story ? pick(STORY)(N, f, pick(NAMES)) : null;
    var choices = choose(ans, [u, N - ans, (k + 1) * u, (k - 1) * u, N, ans + 10, ans - 10], [ans + 1, ans - 1, ans + 2, ans + 5, ans * 2, ans + u * 2, Math.round(N / 2) + 1], n, Number);
    function pic(done) {
      return barPic({ parts: d, top: String(N), regions: [{ from: 0, len: k, kind: 'shade' }], unit: done && d <= 10 ? function () { return String(u); } : null,
        brace: { from: 0, len: k, text: done ? String(ans) : '?' },
        label: 'A bar model. The whole bar is ' + N + '. It is split into ' + d + ' equal parts. ' + k + (k === 1 ? ' part is' : ' parts are') + ' shaded, with ' + (done ? ans : 'a question mark') + ' under ' + (k === 1 ? 'it' : 'them') + '.' });
    }
    return {
      game: 'of', kind: 'of', key: 'of-' + k + '-' + d + '-' + N, data: { k: k, d: d, N: N },
      text: s ? s.t : 'What is ' + f + ' of ' + N + '?', line: [f + ' of ' + N + ' = ', ''], ans: String(ans), choices: choices, tile: 'word',
      why: N + ' split into ' + d + ' equal parts is ' + u + ' in each part (' + N + ' ÷ ' + d + ' = ' + u + '). ' + (k === 1 ? 'One part is ' + u + '.' : k + ' parts are ' + k + ' × ' + u + ' = ' + ans + '.'),
      pic: pic,
      wrong: function (v) {
        var g = +v, p = barPic({ parts: d, top: String(N), regions: [{ from: 0, len: k, kind: 'shade' }], brace: { from: 0, len: k, text: 'We want ' + f }, guess: { frac: g / N, text: 'You said ' + g } });
        var hint = g === u && k > 1 ? ' That is one part. We want ' + k + ' parts.' : g === N - ans ? ' That is the part that is not shaded.' : g === N ? ' That is the whole bar.' : '';
        return { text: 'You said ' + g + '. That is this much of the bar, in orange. We want ' + f + ', this much, in teal.' + hint, svg: p.svg, vb: p.vb,
          label: 'The bar model again: the whole is ' + N + ', split into ' + d + ' equal parts, with ' + k + ' shaded for ' + fw(f) + '. Under it, an orange bar shows your answer, ' + g + (g > N ? ', longer than the whole bar.' : '.') };
      },
      lesson: function () {
        var d2 = pick([2, 3, 4, 5]), k2 = d2 === 2 ? 1 : between(1, d2 - 1), u2 = between(2, 6);
        if (gcd(k2, d2) > 1) k2 = 1;
        return { movie: function () { return ofMovie(k2, d2, d2 * u2); },
          text: 'First split the whole into ' + d2 + ' equal parts: ' + d2 * u2 + ' ÷ ' + d2 + ' = ' + u2 + '. That is one part. Then count the parts you want: ' + (k2 === 1 ? 'one part is ' + u2 : k2 + ' parts are ' + k2 + ' × ' + u2 + ' = ' + k2 * u2) + '. So ' + fracWords(k2, d2) + ' of ' + d2 * u2 + ' is ' + k2 * u2 + '.' };
      }
    };
  }

  /* ======================================================================
     3. Decimals: money, measuring, the number line, which is bigger
     ====================================================================== */
  function makeMoney(st, n) {
    var D, C;
    if (st === 0) { D = between(1, 5); C = pick([25, 50, 75, 10, 20]); }
    else if (st === 1) { D = between(0, 9); C = between(1, 19) * 5; }
    else { D = between(0, 12); C = rnd(3) === 0 ? pick([between(1, 9), between(1, 9) * 10]) : between(1, 99); }
    if (D === 0 && C < 10) C += 10;
    var c = D * 100 + C, words = moneyWords(c);
    var good = [C % 10 === 0 ? D * 100 + C / 10 : D * 100 + (C % 10) * 10 + Math.floor(C / 10), C < 10 ? D * 100 + C * 10 : c + 900, c * 100, C * 100 + D, c + 100, c - 100, c + 10, c - 10];
    var choices = choose(c, good, [c + 1, c + 5, c + 50, c + 200, c - 50], n, Number, [good[0]]);
    var labels = {}; choices.forEach(function (x) { labels[x] = money(+x); });
    return {
      game: 'dec', kind: 'money', key: 'dec-money-' + c, data: { cents: c },
      text: 'How do we write ' + words + '?', line: [cap(words) + ' = ', ''], ans: String(c), choices: choices, labels: labels, tile: 'word',
      why: money(c) + ' is ' + words + '. Whole dollars go before the point. Cents go after it, always with two digits: ' + C + (C === 1 ? ' cent is ' : ' cents is ') + '.' + ('0' + C).slice(-2) + '.',
      pic: function () { var p = moneyPic(c); return { svg: p.svg, vb: p.vb, label: 'Money: ' + words + ', drawn as ' + (D ? D + ' dollar' + (D === 1 ? '' : 's') + ' in bills' : 'no bills') + ' and coins for ' + C + ' cents.' }; },
      wrong: function (v) {
        var g = +v, lo = Math.min(Math.floor(c / 100), Math.floor(g / 100)), hi = Math.max(Math.ceil((c + 1) / 100), Math.ceil((g + 1) / 100));
        if (hi - lo > 3) { lo = Math.floor(c / 100); hi = lo + 1; }
        var p = linePic({ lo: lo * 1000, hi: hi * 1000, tick: 100, labelEvery: hi - lo > 1 ? 1000 : 500, fmt: function (t) { return money(t / 10); }, marks: [{ v: c * 10, who: 'target', text: money(c) }, { v: g * 10, who: 'guess', text: 'You said ' + money(g) }] });
        return { text: 'You said ' + money(g) + '. That is ' + moneyWords(g) + ', here on the line in orange. We want ' + words + ', ' + money(c) + ', at the teal mark.', svg: p.svg, vb: p.vb,
          label: 'A number line in dollars with tenths of a dollar marked. A teal mark shows ' + moneyWords(c) + '. An orange dot shows your answer, ' + moneyWords(g) + (g * 10 > hi * 1000 ? ', further along than this part of the line.' : '.') };
      },
      lesson: function () { var c2 = pick([125, 240, 305, 150, 260]); return { movie: function () { return moneyMovie(c2); }, text: moneyLesson(c2) }; }
    };
  }
  function moneyLesson(c) { var d = Math.floor(c / 100), k = c % 100; return 'Count the dollars first: ' + d + '. They go before the point. Then count the cents: ' + k + '. They go after the point, always with two digits. So ' + moneyWords(c) + ' is written ' + money(c) + '. 10 cents is a tenth of a dollar, so ' + money(c) + ' has ' + Math.floor(k / 10) + ' tenths and ' + k % 10 + ' hundredths.'; }

  /** Decimal choices near v (thousandths): ten times, a tenth, and a step either side. */
  function decChoices(v, tick, n) {
    return choose(dec(v), [dec(v * 10), dec(Math.round(v / 10)), dec(v + tick), dec(v - tick), dec(v + 10 * tick), dec(v - 10 * tick)].filter(function (x) { return x !== '0'; }),
      [dec(v + 2 * tick), dec(v - 2 * tick), dec(v + 3 * tick), dec(v + 1000)], n, function (s) { return th(s); });
  }
  function makeRuler(st, n) {
    var lo = 0, hi = 1000, tick = 100, v, every = 100, mid = 0;
    if (st === 0) v = between(1, 9) * 100;
    else if (st === 1) { hi = 2000; v = pick(range(1, 19).filter(function (x) { return x !== 10; })) * 100; every = 500; }
    else { tick = 10; every = 100; mid = 50; v = between(1, 9) * 100 + between(1, 9) * 10; if (st >= 3 && rnd(2)) { hi = 2000; v += 1000 * rnd(2); every = 200; } }
    var choices = decChoices(v, tick, n), labels = {};
    choices.forEach(function (x) { labels[x] = x + ' m'; });
    function pic(marks) { return linePic({ lo: lo, hi: hi, tick: tick, labelEvery: every, midEvery: mid, tape: true, ribbon: v, unit: 'm', marks: marks }); }
    return {
      game: 'dec', kind: 'ruler', key: 'dec-ruler-' + hi + '-' + tick + '-' + v, data: { t: v, hi: hi, tick: tick },
      text: 'A red ribbon lies on a measuring tape. How long is the ribbon?', line: ['The ribbon is ', ' m long'], ans: dec(v), choices: choices, labels: labels, tile: 'word',
      why: 'The ribbon ends at ' + dec(v) + ' m. ' + (tick === 100 ? 'Each small step on this tape is 0.1 m, a tenth of a metre.' : 'Each small step on this tape is 0.01 m, a hundredth of a metre, like 1 cm.') + (v === 500 ? ' 0.5 m is half a metre.' : ''),
      pic: function (done) { var p = pic(done ? [{ v: v, who: 'target', text: dec(v) + ' m' }] : []); p.label = 'A measuring tape from 0 to ' + dec(hi) + ' m, marked in ' + (tick === 100 ? 'tenths' : 'hundredths') + ' of a metre. A red ribbon starts at 0 and ends at one of the marks.'; return p; },
      wrong: function (x) {
        var g = th(x), p = pic([{ v: v, who: 'target', text: dec(v) + ' m' }, { v: g, who: 'guess', text: 'You said ' + x + ' m' }]);
        return { text: 'You said ' + x + ' m. ' + (g > hi ? 'That is further than the end of this tape.' : 'That is here on the tape, at the orange dot.') + ' The ribbon ends at the teal mark: ' + dec(v) + ' m.', svg: p.svg, vb: p.vb,
          label: 'The tape again. A teal mark shows where the ribbon ends, ' + dec(v) + ' m. An orange dot shows your answer, ' + x + ' m' + (g > hi ? ', past the end of the tape.' : '.') };
      },
      lesson: function () { return { movie: function () { return tenthsMovie(500); }, text: 'A metre split into 10 equal steps: each step is a tenth, 0.1 m. Count the steps to the end of the ribbon. 5 steps is 0.5 m, half a metre. When each tenth is split into 10 again, each tiny step is a hundredth, 0.01 m.' }; }
    };
  }
  function makeLine(st, n) {
    var lo, tick, v;
    if (st === 0) { lo = 0; tick = 100; v = between(1, 9) * 100; }
    else if (st === 1) { lo = between(0, 3) * 1000; tick = 100; v = lo + between(1, 9) * 100; }
    else { lo = (st >= 3 ? between(10, 39) : between(1, 9)) * 100; tick = 10; v = lo + between(1, 9) * 10; }
    var hi = lo + tick * 10, choices = decChoices(v, tick, n);
    function pic(marks) { return linePic({ lo: lo, hi: hi, tick: tick, labelEvery: tick === 10 ? 50 : tick, midEvery: 0, marks: marks }); }
    return {
      game: 'dec', kind: 'line', key: 'dec-line-' + lo + '-' + tick + '-' + v, data: { t: v, lo: lo, tick: tick },
      text: 'What number is the arrow pointing to?', line: ['The arrow is at ', ''], ans: dec(v), choices: choices, tile: 'word',
      why: 'The line goes from ' + dec(lo) + ' to ' + dec(hi) + ' in 10 equal steps, so each step is ' + dec(tick) + '. The arrow is ' + Math.round((v - lo) / tick) + ' steps along: ' + dec(v) + '.',
      pic: function (done) { var p = pic(done ? [{ v: v, who: 'target', text: dec(v) }] : [{ v: v, who: 'arrow' }]); p.label = 'A number line from ' + dec(lo) + ' to ' + dec(hi) + ', split into 10 equal steps of ' + dec(tick) + '. An arrow points ' + Math.round((v - lo) / tick) + ' steps along from ' + dec(lo) + '.'; return p; },
      wrong: function (x) {
        var g = th(x), p = pic([{ v: v, who: 'target', text: dec(v) }, { v: g, who: 'guess', text: 'You said ' + x }]);
        return { text: 'You said ' + x + '. ' + (g > hi || g < lo ? 'That is not on this part of the line.' : 'That is here, at the orange dot.') + ' The arrow is at ' + dec(v) + ', the teal mark.', svg: p.svg, vb: p.vb,
          label: 'The number line again. A teal mark is where the arrow pointed, at ' + dec(v) + '. An orange dot shows your answer, ' + x + (g > hi || g < lo ? ', off this part of the line.' : '.') };
      },
      lesson: function () { return { movie: function () { return tenthsMovie(300); }, text: 'Find how big each step is: the line from 0 to 1 has 10 equal steps, so each step is 0.1. Then count the steps to the arrow. 3 steps is 0.3, three tenths.' }; }
    };
  }
  function makeBigger(st) {
    var a, b, same = rnd(5) === 0;
    if (same) { var t = between(1, 9); a = '0.' + t; b = '0.' + t + '0'; if (st >= 2 && rnd(2)) { a = t + '.5'; b = t + '.50'; } }
    else if (st <= 1) {
      var x = between(1, 9), y = between(1, 9);
      while (y === x) y = between(1, 9);
      var form = rnd(3);
      if (form === 0) { a = '0.' + x; b = '0.' + y; }
      else if (form === 1) { a = '1.' + x; b = '0.' + y; }
      else { a = '0.' + x; b = '0.0' + y; }
    } else {
      var tt = between(1, 9), h = tt * 10 + pick([-8, -5, -3, -1, 1, 2, 5, 9].filter(function (z) { return tt * 10 + z > 0 && tt * 10 + z < 100; }));
      a = '0.' + tt; b = '0.' + ('0' + h).slice(-2);
      if (st >= 3 && rnd(2)) { var w = between(1, 4); a = w + '.' + tt; b = w + '.' + ('0' + h).slice(-2); }
    }
    if (rnd(2)) { var sw = a; a = b; b = sw; }
    var va = th(a), vb = th(b), ans = va === vb ? 'same' : va > vb ? a : b;
    var rel = va === vb ? 'the same as' : va > vb ? 'more than' : 'less than';
    function chart() {
      // A place value chart: ones, tenths, hundredths.
      var out = '', cols = ['ones', 'tenths', 'hundredths'], X = [96, 168, 240];
      cols.forEach(function (c, i) { out += txt(X[i], 16, c, { size: 12, weight: 600 }); });
      out += '<path d="M60 22h220M132 22v86M204 22v86" stroke="#8aa49b" stroke-width="1.5"/>';
      [a, b].forEach(function (s, j) {
        var y = 54 + j * 40, parts = s.split('.'), digs = [parts[0], (parts[1] || '')[0] || '', (parts[1] || '')[1] || ''];
        digs.forEach(function (dg, i) { if (dg !== '') out += txt(X[i], y, dg, { size: 22, weight: 800 }); });
        out += '<circle cx="132" cy="' + (y - 6) + '" r="3" fill="' + INK + '"/>';
      });
      return out;
    }
    return {
      game: 'dec', kind: 'bigger', key: 'dec-bigger-' + [a, b].sort().join('-'), data: { a: a, b: b },
      text: 'Which is bigger: ' + a + ' or ' + b + '?', line: [a + ' is ', ' ' + b], ans: ans, fill: rel, choices: [a, b, 'same'], labels: { same: 'The same' }, tile: 'word',
      why: ans === 'same' ? a + ' and ' + b + ' are the same: a 0 at the end does not change a decimal.' : 'Look at the biggest place first. ' + (Math.floor(va / 1000) !== Math.floor(vb / 1000) ? 'The ones are different, so the one with more ones is bigger.' : Math.floor(va / 100) !== Math.floor(vb / 100) ? 'The tenths are different: ' + Math.floor((Math.max(va, vb) % 1000) / 100) + ' tenths is more than ' + Math.floor((Math.min(va, vb) % 1000) / 100) + ' tenths. More digits does not mean bigger.' : 'The tenths are the same, so look at the hundredths.') + ' ' + (ans) + ' is bigger.',
      pic: function () { return { svg: chart(), vb: '0 0 320 110', label: 'A place value chart with columns for ones, tenths and hundredths. ' + a + ' is on the first row and ' + b + ' on the second.' }; },
      wrong: function (v) {
        var top = Math.max(1, Math.ceil(Math.max(va, vb) / 1000)), parts = top > 1 ? 10 * top : 10;
        var p = stripsPic([{ v: va / 1000 / top, label: a, parts: parts, mine: v === a }, { v: vb / 1000 / top, label: b, parts: parts, mine: v === b }]);
        return { text: (v === 'same' ? 'You said they are the same.' : 'You said ' + v + '.') + ' Here both are drawn on bars ' + (top > 1 ? 'from 0 to ' + top : 'from 0 to 1') + ', split into tenths. ' + (ans === 'same' ? 'They reach the same place: they are the same.' : ans + ' reaches further, to the teal line, so ' + ans + ' is bigger.'),
          svg: p.svg, vb: p.vb, label: 'Two bars the same length, from 0 to ' + top + ', split into tenths. One is shaded to ' + a + ', the other to ' + b + '. A teal line marks the longer one.' + (v === 'same' ? ' Your answer was that they are the same.' : ' Your pick, ' + v + ', has an orange outline.') };
      },
      lesson: function () { return { movie: function () { return decCompareMovie(); }, text: '0.5 is 5 tenths, the same as 0.50, 50 hundredths. 0.45 is 45 hundredths. 50 hundredths is more than 45 hundredths, so 0.5 is bigger than 0.45, even though 0.45 has more digits.' }; }
    };
  }
  function makeDec(kind, st, n) { return kind === 'money' ? makeMoney(st, n) : kind === 'ruler' ? makeRuler(st, n) : kind === 'line' ? makeLine(st, n) : makeBigger(st); }

  /* ======================================================================
     4. Percent: the 100 grid, a phone battery, percent of a number
     ====================================================================== */
  function pctOf(st) {
    return [[10, 20, 30, 40, 50, 60, 70, 80, 90, 25, 75], [10, 20, 30, 40, 50, 60, 70, 80, 90, 25, 75, 5, 15, 35, 45, 55, 65, 85, 95],
      range(5, 95, 5), range(1, 99), range(1, 99)][st];
  }
  function gridChoices(s, n) { return choose(String(s), [100 - s, (s % 10) * 10 + Math.floor(s / 10), s + 10, s - 10, s + 5, s - 5], [s + 1, s - 1, s + 20, s - 20, s + 2], n, function (x) { return +x <= 100 ? +x : NaN; }); }
  function makeGrid(kind, st, n) {
    var s = pick(pctOf(st));
    var choices = gridChoices(s, n), labels = {};
    choices.forEach(function (x) { labels[x] = kind === 'pick' ? 'A grid with ' + x + ' of 100 squares shaded' : x + '%'; });
    function g(shade, dots) { return gridPic(shade, dots, 14, 90, 4); }
    return {
      game: 'pct', kind: kind, key: 'pct-' + kind + '-' + s, data: { s: s },
      text: kind === 'pick' ? 'Which grid shows ' + s + '%?' : 'Each grid has 100 squares. What percent of this grid is shaded?',
      line: kind === 'pick' ? [s + '% means ', ' squares out of 100'] : ['Shaded: ', ''], ans: String(s), fill: kind === 'pick' ? String(s) : s + '%',
      choices: choices, labels: labels, tile: kind === 'pick' ? 'grid' : 'word', cls: kind === 'pick' ? 'tiles two grids' : null,
      why: 'Percent means out of 100. ' + s + ' of the 100 squares are shaded, so it is ' + s + '%. ' + (s >= 10 ? 'Count the full rows of 10 first: ' + Math.floor(s / 10) + ' rows' + (s % 10 ? ' and ' + s % 10 + ' more.' : '.') : ''),
      pic: function () { return kind === 'pick' ? { svg: gridPic(0, 0, 14, 90, 4), vb: '0 0 320 148', label: 'An empty grid of 100 squares, 10 rows of 10.' } : { svg: g(s, 0), vb: '0 0 320 148', label: 'A grid of 100 squares, 10 rows of 10. ' + squares(s) + (s === 1 ? ' is' : ' are') + ' shaded.' }; },
      wrong: function (v) {
        var gv = +v;
        return { text: kind === 'pick' ? 'You picked the grid with ' + squares(gv) + ' shaded: that is ' + gv + '%, the orange dots. We want ' + s + '%: ' + squares(s) + ' out of 100, shaded here.' : 'You said ' + gv + '%. That is ' + squares(gv) + ' out of 100, the orange dots. We want the shaded part: ' + squares(s) + ', ' + s + '%.',
          svg: g(s, gv), vb: '0 0 320 148', label: 'The grid of 100 squares with ' + s + ' shaded. Orange dots are on ' + squares(gv) + ', your answer.' };
      },
      lesson: function () { var p2 = pick([30, 45, 60, 25]); return { movie: function () { return gridMovie(p2); }, text: 'Percent means out of 100. A grid of 100 squares fills up a row of 10 at a time. ' + Math.floor(p2 / 10) + ' rows' + (p2 % 10 ? ' and ' + p2 % 10 + ' more squares' : '') + ' make ' + p2 + ' squares: ' + p2 + '%.' }; }
    };
  }
  var BATT_F = [['1/2', '1/4', '3/4', '1/10'], ['1/2', '1/4', '3/4', '1/10', '1/5', '2/5', '3/5'], ['1/2', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/3', '2/3'], ['1/3', '2/3', '1/8', '3/8', '5/8', '7/8', '4/5', '3/4'], ['1/3', '2/3', '1/8', '3/8', '5/8', '7/8', '3/5']];
  function makeBattery(st) {
    var f = pick(BATT_F[st]), exact = fv(f) * 100, p;
    var near = st <= 1 ? pick([0, 0, 10, -10, 20, -20]) : pick([0, 3, -3, 5, -5, 10, -10, 1, -1]);
    p = Math.round(exact) + near;
    if (st <= 1 && p % 5) p = Math.round(p / 10) * 10;
    p = Math.max(5, Math.min(100, p));
    var exS = Math.abs(exact - Math.round(exact * 10) / 10) < 1e-9 ? num(exact) : 'about ' + f1(exact);
    var nn = +f.split('/')[0], dd = +f.split('/')[1], ans = p * dd === nn * 100 ? 'same' : p * dd > nn * 100 ? 'more' : 'less';
    var rel = { same: 'the same as', more: 'more than', less: 'less than' };
    var choices = ['more', 'less', 'same'], labels = { more: 'More than ' + f, less: 'Less than ' + f, same: 'The same as ' + f };
    return {
      game: 'pct', kind: 'battery', key: 'pct-battery-' + p + '-' + f, data: { p: p, f: f },
      text: 'A phone battery is at ' + p + '%. Is that more or less than ' + f + ' full?', line: [p + '% is ', ' ' + f], ans: ans, fill: rel[ans], choices: choices, labels: labels, tile: 'word', cls: 'tiles two words',
      why: f + ' is ' + exS + '%. ' + p + '% is ' + rel[ans] + ' ' + exS + '%, so ' + p + '% is ' + rel[ans] + ' ' + f + '.',
      pic: function (done) { var b = batteryPic(p, done ? fv(f) : null, f + ' = ' + exS + '%'); return { svg: b.svg, vb: b.vb, label: 'A phone battery, ' + p + '% full.' + (done ? ' A teal line marks ' + fw(f) + '.' : '') }; },
      wrong: function (v) {
        var b = batteryPic(p, fv(f), f + ' = ' + exS + '%');
        return { text: 'You said ' + labels[v].toLowerCase() + '. Look: ' + f + ' of the battery is ' + exS + '%, at the teal line. ' + (ans === 'same' ? 'The battery fills up exactly to the line.' : ans === 'more' ? 'The green goes past the line, so ' + p + '% is more.' : 'The green stops before the line, so ' + p + '% is less.'),
          svg: b.svg, vb: b.vb, label: 'The battery, ' + p + '% full, with a teal line at ' + fw(f) + ', which is ' + exS + '%. Your answer was ' + labels[v].toLowerCase() + '.' };
      },
      lesson: function () { return { movie: function () { return batteryMovie(); }, text: 'Turn the fraction into a percent first. A whole battery is 100%. Half is 50%, a quarter is 25%, three quarters is 75%. Then compare: 80% is more than 75%, so 80% is more than 3/4 full.' }; }
    };
  }
  var POF = [[50, 10, 25], [10, 25, 50], [10, 20, 25, 50, 75], [5, 15, 18, 30, 35, 45, 60], [15, 18, 35, 45, 65, 85]];
  function makePctOf(st, n) {
    var p = pick(POF[st]), N, guard = 0;
    do {
      N = st === 0 ? (p === 25 ? between(1, 10) * 4 : between(1, 10) * 10) : st === 1 ? between(1, 20) * 10 : st === 2 ? between(1, 20) * 10 : between(1, 30) * 10;
      guard++;
    } while ((p * N) % 100 && guard < 100);
    if ((p * N) % 100) { p = 50; N = 40; }
    var ans = p * N / 100, ten = N / 10;
    var choices = choose(String(ans), [p, ten, N - ans, ans * 10, ans + ten, ans - ten, N / 2, N / 4].filter(function (x) { return x % 1 === 0; }), [ans + 1, ans + 2, ans - 1, ans + 5], n, Number);
    function bar(done, guess) {
      return barPic({ parts: 10, top: '100% = ' + N, regions: [{ from: 0, len: p / 10, kind: 'shade' }], unit: function () { return '10%'; },
        brace: { from: 0, len: p / 10, text: guess ? 'We want ' + p + '%' : done ? p + '% = ' + ans : p + '% = ?' }, guess: guess });
    }
    return {
      game: 'pct', kind: 'of', key: 'pct-of-' + p + '-' + N, data: { p: p, N: N },
      text: 'What is ' + p + '% of ' + N + '?', line: [p + '% of ' + N + ' = ', ''], ans: String(ans), choices: choices, tile: 'word',
      why: pctSteps(p, N, num),
      pic: function (done) { var b = bar(done); b.label = 'A bar for ' + N + ', which is 100%, split into 10 equal parts of 10%. ' + p + '% of the bar is shaded, with ' + (done ? ans : 'a question mark') + ' under it.'; return b; },
      wrong: function (v) {
        var g = +v, b = bar(false, { frac: g / N, text: 'You said ' + g });
        return { text: 'You said ' + g + '. That is this much of ' + N + ', in orange. We want ' + p + '%, the shaded part.' + (g === p ? ' The percent is not the answer: find ' + p + ' out of every 100.' : ''), svg: b.svg, vb: b.vb,
          label: 'The bar for ' + N + ' again, with ' + p + '% shaded. An orange bar under it shows your answer, ' + g + '.' };
      },
      lesson: function () { return { movie: function () { return pctOfMovie(30, 80); }, text: 'Find 10% first: split the whole into 10 equal parts. 10% of 80 is 8. Then build the percent you want from parts: 30% is 3 parts, 3 × 8 = 24. 5% is half of 10%, so 35% would be 24 + 4 = 28.' }; }
    };
  }
  /** How to find p% of W, with 10% first. show writes a value (money or a number). */
  function pctSteps(p, W, show) {
    var ten = W / 10;
    if (p === 50) return '50% is half. Half of ' + show(W) + ' is ' + show(W / 2) + '.';
    if (p === 25) return '25% is a quarter. Half of ' + show(W) + ' is ' + show(W / 2) + ', and half of that is ' + show(W / 4) + '.';
    if (p === 75) return '75% is three quarters. A quarter of ' + show(W) + ' is ' + show(W / 4) + ', and 3 × ' + show(W / 4) + ' = ' + show(W * 3 / 4) + '.';
    var out = '10% is ' + show(W) + ' ÷ 10 = ' + show(ten) + '.';
    if (p === 10) return out;
    if (p === 18) return out + ' So 20% is ' + show(2 * ten) + '. 1% is ' + show(W / 100) + ', so 2% is ' + show(W / 50) + '. 18% = ' + show(2 * ten) + ' − ' + show(W / 50) + ' = ' + show(W * 18 / 100) + '.';
    var tens = Math.floor(p / 10), five = p % 10 === 5;
    if (tens > 1) out += ' ' + tens * 10 + '% is ' + tens + ' × ' + show(ten) + ' = ' + show(tens * ten) + '.';
    if (five) {
      out += ' 5% is half of 10%: ' + show(ten / 2) + '.';
      if (tens) out += ' ' + p + '% = ' + show(tens * ten) + ' + ' + show(ten / 2) + ' = ' + show(W * p / 100) + '.';
    }
    return out;
  }
  function makePct(kind, st, n) { return kind === 'battery' ? makeBattery(st) : kind === 'of' ? makePctOf(st, n) : makeGrid(kind, st, n); }

  /* ======================================================================
     5. Same amount, three ways: fraction, decimal, percent
     ====================================================================== */
  var THREE = [
    [[1, 2], [1, 4], [3, 4], [1, 10], [3, 10], [7, 10], [9, 10]],
    [[1, 5], [2, 5], [3, 5], [4, 5]],
    [[1, 20], [7, 100], [11, 100], [1, 100], [9, 100]],
    [[3, 20], [7, 20], [9, 20], [11, 20], [1, 8], [3, 8], [5, 8], [7, 8], [1, 25], [3, 25], [6, 25], [9, 50]]
  ];
  function threeSet(st) { var o = []; for (var i = 0; i <= Math.min(st, 3); i++) o = o.concat(THREE[i]); return o; }
  function makeMatch(st, n, miss) {
    var f = pick(threeSet(st)), nn = f[0], dd = f[1], pc = nn * 100 / dd, tv = nn * 1000 / dd, F = fr(nn, dd), D = dec(tv), P = num(pc);
    miss = miss || pick(['pct', 'dec', 'frac']);
    var ans, choices, labels = {};
    if (miss === 'pct') {
      ans = P;
      choices = choose(ans, [nn * 10, 100 - pc, pc / 10, nn, pc + 5], [pc + 10, pc - 10, pc + 1, pc + 20], n, function (x) { return +x <= 100 ? +x : NaN; }, [dd]);
      choices.forEach(function (x) { labels[x] = x + '%'; });
    } else if (miss === 'dec') {
      ans = D;
      choices = choose(ans, [dec(tv * 10), dec(Math.round(tv / 10)), '0.' + nn + dd, '1.' + dd, dec(1000 - tv), dec(pc * 1000), dec(nn * 100)].map(function (s) { return dec(th(s)); }), [dec(tv + 100), dec(tv + 50), dec(tv + 10)], n, function (s) { return th(s); });
      choices.forEach(function (x) { labels[x] = x; });
    } else {
      ans = F;
      var cand = [fr(1, Math.round(pc)), fr(Math.round(pc), 10), fr(nn + 1, dd), fr(nn, dd + 1), fr(dd - nn, dd), fr(1, nn + 1), fr(dd, 100)].map(function (s) { var a = s.split('/'); return +a[0] > 0 && +a[0] < +a[1] ? low(+a[0], +a[1]) : ''; })
        .filter(function (s) { return s && ORD[+s.split('/')[1]]; });
      choices = choose(ans, cand, [fr(1, 3), fr(2, 3), fr(1, 6), fr(5, 6)], n, fv);
    }
    var blanks = { frac: miss === 'frac', dec: miss === 'dec', pct: miss === 'pct' };
    var parts = [blanks.frac ? null : F, blanks.dec ? null : D, blanks.pct ? null : P + '%'];
    var lineText = parts.map(function (x) { return x == null ? '?' : x; }).join(' = '), cut = lineText.indexOf('?');
    var what = { pct: 'percent', dec: 'decimal', frac: 'fraction' }[miss];
    return {
      game: 'match', kind: miss, key: 'match-' + miss + '-' + F, data: { n: nn, d: dd, missing: miss },
      text: 'The grid has 100 squares. Find the missing ' + what + ': the same amount, written another way.', line: [lineText.slice(0, cut), lineText.slice(cut + 1)],
      ans: ans, choices: choices, labels: miss === 'frac' ? null : labels, tile: miss === 'frac' ? 'frac' : 'word', fill: miss === 'pct' ? P + '%' : ans,
      why: F + ' of the grid is ' + squares(pc) + ' out of 100. Out of 100 is percent: ' + P + '%. As a decimal, ' + num(pc) + ' hundredths is ' + D + '. So ' + F + ' = ' + D + ' = ' + P + '%.',
      pic: function () { return { svg: gridPic(pc, 0, 14, 90, 4), vb: '0 0 320 148', label: 'A grid of 100 squares with ' + squares(pc) + ' shaded, ' + fw(F) + ' of the grid.' }; },
      wrong: function (v) {
        var gv = miss === 'pct' ? +v : miss === 'dec' ? th(v) / 10 : fv(v) * 100, said = miss === 'pct' ? v + '%' : v;
        return { text: 'You said ' + said + '. That is ' + squares(gv) + ' out of 100, the orange dots' + (gv > 100 ? ', more than the whole grid' : '') + '. We want the shaded part, ' + squares(pc) + '.',
          svg: gridPic(pc, Math.min(gv, 100), 14, 90, 4), vb: '0 0 320 148', label: 'The grid with ' + squares(pc) + ' shaded. Orange dots are on ' + squares(Math.min(gv, 100)) + ', your answer.' };
      },
      lesson: function () { return { movie: function () { return threeMovie(1, 4); }, text: 'One amount, three ways. A quarter of the grid is 25 squares out of 100. Out of 100 is percent: 25%. 25 hundredths as a decimal is 0.25. So one quarter, 0.25 and 25% are the same amount.' }; }
    };
  }

  /* ======================================================================
     6. Real life: tips, sales and splitting a bill
     ====================================================================== */
  var TIP_P = [[10], [10, 20], [10, 15, 20], [15, 18, 20], [15, 18, 20]];
  var MEALS = ['dinner', 'lunch', 'breakfast'], THINGS = ['kite', 'puzzle', 'board game', 'paint set', 'soccer ball', 'backpack', 'book', 'bike helmet', 'jacket', 'skateboard'];
  function moneyChoices(c, good, n) {
    var ch = choose(String(c), good.map(function (x) { return Math.round(x); }).filter(function (x) { return x > 0 && x % 1 === 0; }), [c + 100, c + 50, c - 50, c + 200, c - 100, c + 25], n, Number);
    var labels = {}; ch.forEach(function (x) { labels[x] = money(+x); });
    return { choices: ch, labels: labels };
  }
  function makeTip(st, n) {
    var p = pick(TIP_P[st]), bill = (st <= 1 ? between(2, 6) : between(2, 12)) * 1000, who = pick(NAMES), meal = pick(MEALS);
    if (st >= 4 && rnd(2)) bill = between(41, 89) * 100;
    var total = st >= 3 && rnd(2), tip = bill * p / 100, ans = total ? bill + tip : tip;
    var others = TIP_P[4].concat([10]).filter(function (q) { return q !== p; }).map(function (q) { return bill * q / 100; });
    var good = (total ? [tip, bill + bill / 10, bill + bill / 5] : others.concat([bill + tip, p * 100, tip * 10])).concat([tip / 10]);
    var mc = moneyChoices(ans, good, n);
    function bar(done, guess) {
      var len = p / 10;
      return barPic({ parts: 10, top: 'Bill: ' + money(bill), regions: [{ from: 0, len: len, kind: 'shade' }], unit: function () { return '10%'; },
        brace: { from: 0, len: len, text: guess ? 'The ' + p + '% tip' : done ? p + '% tip = ' + money(tip) : p + '% tip = ?' }, guess: guess });
    }
    return {
      game: 'life', kind: total ? 'tip-total' : 'tip', key: 'life-tip-' + bill + '-' + p + (total ? '-t' : ''), data: { bill: bill, p: p, ask: total ? 'total' : 'tip' },
      text: who + '\'s family has ' + meal + ' out. The bill is ' + money(bill) + '. They leave ' + (p === 18 || p === 8 || p === 11 ? 'an ' : 'a ') + p + '% tip. ' + (total ? 'What do they pay altogether, with the tip?' : 'How much is the tip?'),
      line: total ? ['Bill + tip = ', ''] : [p + '% of ' + money(bill) + ' = ', ''], ans: String(ans), choices: mc.choices, labels: mc.labels, tile: 'word',
      why: pctSteps(p, bill, money) + (total ? ' Bill + tip = ' + money(bill) + ' + ' + money(tip) + ' = ' + money(ans) + '.' : ''),
      pic: function (done) { var b = bar(done); b.label = 'A bar for the bill, ' + money(bill) + ', split into 10 equal parts of 10%. The tip, ' + p + '%, is shaded' + (done ? ': ' + money(tip) + '.' : ', with a question mark.'); return b; },
      wrong: function (v) {
        var g = +v, b = bar(false, { frac: g / bill, text: 'You said ' + money(g) });
        return { text: 'You said ' + money(g) + '. That is this much of the bill, in orange. ' + (total ? 'We want the bill and the tip together: ' + money(bill) + ' and ' + money(tip) + ' more.' : 'The tip is ' + p + '% of the bill, the shaded part.'), svg: b.svg, vb: b.vb,
          label: 'The bar for the bill again, with the ' + p + '% tip shaded. An orange bar under it shows your answer, ' + money(g) + (g > bill ? ', longer than the whole bill.' : '.') };
      },
      lesson: function () { return { movie: function () { return tipMovie(4000, 15); }, text: 'Find 10% first: move the point one place. 10% of $40.00 is $4.00. 5% is half of that: $2.00. So a 15% tip is $4.00 + $2.00 = $6.00. 20% is double 10%: $8.00.' }; }
    };
  }
  function makeSale(st, n) {
    var thing = pick(THINGS), two = st >= 3 && rnd(2), p, p2 = 0, price, ask = pick(['off', 'pay']);
    var P = [[50, 10], [10, 50, 25], [10, 20, 25, 50], [15, 20, 25, 30, 35], [15, 20, 30, 35, 40]][st];
    var guard = 0;
    do {
      p = pick(P); price = (st <= 1 ? between(1, 6) * 10 : between(2, 12) * 5) * 100;
      if (st === 0 && p === 50) price = between(2, 10) * 200;
      if (two) { p = pick([20, 25, 50]); p2 = pick([10, 20]); ask = 'pay'; }
      guard++;
    } while (((price * p) % 100 || (two && ((price * (100 - p) / 100) * p2) % 100)) && guard < 200);
    var off = price * p / 100, after = price - off, off2 = two ? after * p2 / 100 : 0, pay = after - off2;
    var ans = ask === 'off' ? off : pay;
    var good = two ? [price - price * (p + p2) / 100, after, off + off2, price - p * 100] : [ask === 'off' ? pay : off, price - p * 100, p * 100, price + off];
    var mc = moneyChoices(ans, good, n);
    function pic(done, guess) {
      var a = barPic({ parts: 10, top: cap(thing) + ': ' + money(price), regions: [{ from: 0, len: p / 10, kind: 'off' }, { from: p / 10, len: 10 - p / 10, kind: 'shade' }], unit: function (i) { return i < p / 10 - 0.5 ? '10%' : ''; },
        brace: two ? { from: p / 10, len: 10 - p / 10, text: 'New price: ' + money(after) } : ask === 'off' ? { from: 0, len: p / 10, text: done ? p + '% off: ' + money(off) : p + '% off: ?' } : { from: p / 10, len: 10 - p / 10, text: done ? 'You pay ' + money(pay) : 'You pay ?' },
        guess: two ? null : guess });
      if (!two) return a;
      var b = barPic({ parts: 10, top: 'New price: ' + money(after), regions: [{ from: 0, len: p2 / 10, kind: 'off' }, { from: p2 / 10, len: 10 - p2 / 10, kind: 'shade' }], unit: function (i) { return i < p2 / 10 ? '10%' : ''; },
        brace: { from: p2 / 10, len: 10 - p2 / 10, text: done ? 'You pay ' + money(pay) : 'You pay ?' }, guess: guess ? { frac: guess.frac * price / after, text: guess.text } : null });
      return stack([a, b], 10);
    }
    return {
      game: 'life', kind: two ? 'sale-two' : 'sale', key: 'life-sale-' + price + '-' + p + '-' + p2 + '-' + ask, data: { price: price, p: p, p2: p2, ask: ask },
      text: 'A ' + thing + ' costs ' + money(price) + '. It is on sale for ' + p + '% off' + (two ? ', and then ' + p2 + '% off the new price' : '') + '. ' + (ask === 'off' ? 'How much money comes off?' : 'How much does it cost now?'),
      line: ask === 'off' ? [p + '% off ' + money(price) + ' = ', ' off'] : ['It costs ', ' now'], ans: String(ans), choices: mc.choices, labels: mc.labels, tile: 'word',
      why: pctSteps(p, price, money) + (ask === 'pay' ? ' The new price is ' + money(price) + ' − ' + money(off) + ' = ' + money(after) + '.' : '') + (two ? ' Then ' + p2 + '% of ' + money(after) + ' is ' + money(off2) + ', so it costs ' + money(after) + ' − ' + money(off2) + ' = ' + money(pay) + '. That is not the same as ' + (p + p2) + '% off, because the second ' + p2 + '% is of a smaller price.' : ''),
      pic: function (done) { var b = pic(done); b.label = 'A bar for the price, ' + money(price) + ', split into 10 equal parts of 10%. ' + p + '% is crossed out: the part that comes off.' + (two ? ' Under it, a second bar for the new price, ' + money(after) + ', with ' + p2 + '% crossed out.' : '') + (done ? ' The answer is ' + money(ans) + '.' : ''); return b; },
      wrong: function (v) {
        var g = +v, b = pic(false, { frac: g / price, text: 'You said ' + money(g) });
        return { text: 'You said ' + money(g) + '. That is this much of the price, in orange. We want ' + (ask === 'off' ? 'the part that comes off, crossed out.' : 'what is left to pay, shaded.') + (g === price - p * 100 ? ' ' + p + '% off is not $' + p + ' off: find ' + p + ' out of every 100.' : ''), svg: b.svg, vb: b.vb,
          label: 'The price bar again. An orange bar shows your answer, ' + money(g) + '.' };
      },
      lesson: function () { return { movie: function () { return saleMovie(3000, 20); }, text: '20% off $30.00: 10% of $30.00 is $3.00, so 20% is $6.00. That is how much comes off. What you pay is the rest: $30.00 − $6.00 = $24.00. You pay 80% of the price.' }; }
    };
  }
  function makeSplit(st, n) {
    var friends, bill, tipP = 0, guard = 0;
    do {
      friends = st === 0 ? between(2, 4) : between(2, 6);
      if (st <= 1) bill = friends * between(3, 15) * 100;
      else if (st === 2) bill = friends * (between(8, 20) * 100 + pick([0, 25, 50, 75]));
      else { bill = between(3, 12) * 1000; tipP = pick([15, 20]); }
      guard++;
    } while ((((bill + bill * tipP / 100) % friends) || (st === 2 && bill % 100 === 0 && rnd(2))) && guard < 200);
    if ((bill + bill * tipP / 100) % friends) { friends = 4; bill = 4000; tipP = 15; }
    var total = bill + bill * tipP / 100, each = total / friends, meal = pick(MEALS);
    var good = [total / (friends + 1), total / Math.max(1, friends - 1), total, bill / friends, each + 100, each * 2].filter(function (x) { return x % 1 === 0; });
    var mc = moneyChoices(each, good, n);
    function bar(done, guess) {
      return barPic({ parts: friends, top: (tipP ? 'Bill and tip: ' : 'Bill: ') + money(total), regions: [{ from: 0, len: 1, kind: 'shade' }],
        unit: function () { return done && friends <= 5 ? money(each) : ''; }, brace: { from: 0, len: 1, text: guess ? 'One friend' : done ? money(each) : '?' }, guess: guess });
    }
    return {
      game: 'life', kind: tipP ? 'split-tip' : 'split', key: 'life-split-' + bill + '-' + friends + '-' + tipP, data: { bill: bill, n: friends, tip: tipP },
      text: 'The bill for ' + meal + ' is ' + money(bill) + '.' + (tipP ? ' They add a ' + tipP + '% tip.' : '') + ' ' + friends + ' friends split ' + (tipP ? 'the total' : 'it') + ' evenly. How much does each friend pay?',
      line: [money(total) + ' ÷ ' + friends + ' = ', ' each'], ans: String(each), choices: mc.choices, labels: mc.labels, tile: 'word',
      why: (tipP ? pctSteps(tipP, bill, money) + ' The total is ' + money(bill) + ' + ' + money(total - bill) + ' = ' + money(total) + '. ' : '') + 'Split ' + money(total) + ' into ' + friends + ' equal parts: ' + money(total) + ' ÷ ' + friends + ' = ' + money(each) + '. Check: ' + friends + ' × ' + money(each) + ' = ' + money(total) + '.',
      pic: function (done) { var b = bar(done); b.label = 'A bar for ' + (tipP ? 'the bill and tip' : 'the bill') + ', ' + money(total) + ', split into ' + friends + ' equal parts, one for each friend. One part is shaded' + (done ? ': ' + money(each) + '.' : ', with a question mark.'); return b; },
      wrong: function (v) {
        var g = +v, b = bar(false, { frac: g * friends / total, text: friends + ' × ' + money(g) + ' = ' + money(g * friends) });
        return { text: 'You said ' + money(g) + '. ' + friends + ' friends paying ' + money(g) + ' each make ' + money(g * friends) + ', the orange bar. The ' + (tipP ? 'total' : 'bill') + ' is ' + money(total) + '.', svg: b.svg, vb: b.vb,
          label: 'The bar for ' + money(total) + ' split into ' + friends + ' parts. An orange bar shows ' + friends + ' times your answer, ' + money(g * friends) + '.' };
      },
      lesson: function () { return { movie: function () { return splitMovie(3600, 4); }, text: 'Split the bill into equal parts, one for each friend. $36.00 ÷ 4 = $9.00. Check by putting the parts back together: 4 × $9.00 = $36.00.' }; }
    };
  }
  function makeLife(kind, st, n) { return kind === 'tip' ? makeTip(st, n) : kind === 'sale' ? makeSale(st, n) : makeSplit(st, n); }

  /* ======================================================================
     The moving pictures (lessons)
     ====================================================================== */
  function pizzaMovie(kind, d, e) {
    var A = food(kind, d, [], { x: 0, y: 0, w: 160, h: 150 }), B = food(kind, d, firstN(e), { x: 160, y: 0, w: 160, h: 150 });
    var out = mv(0.2, A.svg + txt(80, 168, d + ' equal ' + FOOD[kind].unit, { size: 13 })) + mv(1.4, B.svg + B.place(e / d, (d - e) / d, 'target') + txt(240, 168, e + ' eaten, ' + (d - e) + ' left', { size: 13 }));
    out += mv(2.6, txt(240, 190, fr(d - e, d) + ' left', { size: 18, weight: 800, fill: DTEAL }));
    return { svg: out, vb: '0 0 320 196', label: 'A ' + FOOD[kind].name + ' cut into ' + d + ' equal ' + FOOD[kind].unit + '. Then ' + e + ' are eaten and ' + (d - e) + ' are left, with a teal line round them: ' + fracWords(d - e, d) + ' left.' };
  }
  function shareMovie(d, n) {
    var each = d / n, out = mv(0.1, food('pizza', d, []).svg);
    for (var k = 0; k < n; k++) {
      var tint = range(0, d - 1).map(function (i) { return Math.floor(i / each) === k ? FRIEND[k] : null; });
      out += mv(0.8 + k * 0.8, roundFood('pizza', 160, 85, 75, d, range(0, d - 1).filter(function (i) { return Math.floor(i / each) !== k; }), tint));
    }
    return { svg: out, vb: '0 0 320 170', label: 'A pizza cut into ' + d + ' slices. One by one, ' + n + ' groups of ' + each + ' slices light up in different colours, one group for each friend.' };
  }
  function moreMovie(a, b) {
    var p = stripsPic([{ v: fv(a), label: a, parts: +a.split('/')[1] }, { v: fv(b), label: b, parts: +b.split('/')[1] }]);
    return { svg: mv(0.2, p.svg), vb: p.vb, label: 'Two bars of the same length. One shows ' + fw(a) + ', the other ' + fw(b) + '. A teal line shows which reaches further.' };
  }
  function ofMovie(k, d, N) {
    var u = N / d;
    var whole = barPic({ parts: 1, top: String(N), regions: [] });
    var split = barPic({ parts: d, top: String(N), regions: [], unit: function () { return String(u); } });
    var done = barPic({ parts: d, top: String(N), regions: [{ from: 0, len: k, kind: 'shade' }], unit: function () { return String(u); }, brace: { from: 0, len: k, text: fr(k, d) + ' of ' + N + ' = ' + k * u } });
    var out = mv(0.2, whole.svg) + mv(1.4, split.svg) + mv(2.8, done.svg);
    return { svg: out, vb: done.vb, label: 'A bar for ' + N + '. It splits into ' + d + ' equal parts of ' + u + '. Then ' + k + (k === 1 ? ' part is' : ' parts are') + ' shaded: ' + fracWords(k, d) + ' of ' + N + ' is ' + k * u + '.' };
  }
  function moneyMovie(c) {
    var p = moneyPic(c), h = +p.vb.split(' ')[3];
    var out = mv(0.2, p.svg) + mv(1.6, txt(160, h + 34, money(c), { size: 30, weight: 800, fill: DTEAL })) +
      mv(2.4, txt(110, h + 58, 'dollars', { size: 12, fill: INK }) + txt(200, h + 58, 'cents', { size: 12, fill: INK }));
    return { svg: out, vb: '0 0 320 ' + (h + 64), label: 'Bills and coins for ' + moneyWords(c) + '. Then it is written ' + money(c) + ': dollars before the point, cents after.' };
  }
  function tenthsMovie(v) {
    var p = linePic({ lo: 0, hi: 1000, tick: 100, tape: true, ribbon: v, unit: 'm', marks: [{ v: v, who: 'target', text: dec(v) + ' m' }] });
    var base = linePic({ lo: 0, hi: 1000, tick: 100, tape: true, unit: 'm' });
    return { svg: mv(0.2, base.svg) + mv(1.4, p.svg), vb: p.vb, label: 'A 1 metre tape split into 10 equal steps of 0.1 m. A ribbon appears, reaching ' + dec(v) + ' m.' };
  }
  function decCompareMovie() {
    var p = stripsPic([{ v: 0.5, label: '0.5', parts: 100 }, { v: 0.45, label: '0.45', parts: 100 }]);
    return { svg: mv(0.2, p.svg), vb: p.vb, label: 'Two bars split into 100 hundredths. 0.5 fills 50 hundredths, 0.45 fills 45. The teal line shows 0.5 reaches further.' };
  }
  function gridMovie(pc) {
    var out = mv(0.1, gridPic(0, 0, 14, 90, 4)), rows = Math.floor(pc / 10);
    for (var r = 1; r <= rows; r++) out += mv(0.3 + r * 0.5, gridPic(r * 10, 0, 14, 90, 4));
    if (pc % 10) out += mv(0.3 + (rows + 1) * 0.5, gridPic(pc, 0, 14, 90, 4));
    out += mv(0.6 + (rows + 1) * 0.5, txt(160, 172, pc + ' out of 100 = ' + pc + '%', { size: 17, weight: 800, fill: DTEAL }));
    return { svg: out, vb: '0 0 320 180', label: 'A grid of 100 squares fills a row of 10 at a time, until ' + pc + ' squares are shaded: ' + pc + ' out of 100 is ' + pc + '%.' };
  }
  function batteryMovie() {
    var a = batteryPic(80), b = batteryPic(80, 0.75, '3/4 = 75%');
    return { svg: mv(0.2, a.svg) + mv(1.4, b.svg), vb: '0 0 300 126', label: 'A battery 80% full. Then a teal line appears at three quarters, 75%. The green goes past the line.' };
  }
  function pctOfMovie(p, N) {
    var a = barPic({ parts: 10, top: '100% = ' + N, regions: [], unit: function () { return String(N / 10); } });
    var b = barPic({ parts: 10, top: '100% = ' + N, regions: [{ from: 0, len: p / 10, kind: 'shade' }], unit: function () { return String(N / 10); }, brace: { from: 0, len: p / 10, text: p + '% = ' + p * N / 100 } });
    return { svg: mv(0.2, a.svg) + mv(1.6, b.svg), vb: b.vb, label: 'A bar for ' + N + ' splits into 10 parts of ' + N / 10 + ', each 10%. Then ' + p / 10 + ' parts are shaded: ' + p + '% of ' + N + ' is ' + p * N / 100 + '.' };
  }
  function threeMovie(n, d) {
    var pc = n * 100 / d;
    var out = mv(0.1, gridPic(0, 0, 13, 6, 6)) + mv(0.8, gridPic(pc, 0, 13, 6, 6));
    out += mv(1.8, txt(230, 40, fr(n, d), { size: 24, weight: 800 })) + mv(2.5, txt(230, 82, dec(n * 1000 / d), { size: 24, weight: 800 })) + mv(3.2, txt(230, 124, num(pc) + '%', { size: 24, weight: 800, fill: DTEAL }));
    return { svg: out, vb: '0 0 320 142', label: 'A grid of 100 squares with ' + num(pc) + ' shaded. Next to it appear ' + fracWords(n, d) + ', ' + dec(n * 1000 / d) + ' and ' + num(pc) + ' percent: the same amount three ways.' };
  }
  function tipMovie(bill, p) {
    var a = barPic({ parts: 10, top: 'Bill: ' + money(bill), regions: [{ from: 0, len: 1, kind: 'shade' }], unit: function (i) { return i ? '' : '10%'; }, brace: { from: 0, len: 1, text: '10% = ' + money(bill / 10) } });
    var b = barPic({ parts: 10, top: 'Bill: ' + money(bill), regions: [{ from: 0, len: p / 10, kind: 'shade' }], unit: function (i) { return i < p / 10 - 0.5 ? '10%' : i < p / 10 ? '5%' : ''; }, brace: { from: 0, len: p / 10, text: p + '% = ' + money(bill * p / 100) } });
    var ha = +a.vb.split(' ')[3];
    return { svg: mv(0.2, a.svg) + mv(1.8, '<g transform="translate(0 ' + (ha + 8) + ')">' + b.svg + '</g>'), vb: '0 0 320 ' + (ha + 8 + +b.vb.split(' ')[3]), label: 'Two bars for a ' + money(bill) + ' bill in 10 parts. First one part, 10%, is ' + money(bill / 10) + '. Then half a part more, 5%: ' + p + '% is ' + money(bill * p / 100) + '.' };
  }
  function saleMovie(price, p) {
    var a = barPic({ parts: 10, top: 'Price: ' + money(price), regions: [], unit: function () { return '10%'; } });
    var b = barPic({ parts: 10, top: 'Price: ' + money(price), regions: [{ from: 0, len: p / 10, kind: 'off' }, { from: p / 10, len: 10 - p / 10, kind: 'shade' }], unit: function (i) { return i < p / 10 ? '10%' : ''; }, brace: { from: p / 10, len: 10 - p / 10, text: 'You pay ' + money(price - price * p / 100) } });
    return { svg: mv(0.2, a.svg) + mv(1.6, b.svg), vb: b.vb, label: 'A bar for ' + money(price) + ' in 10 parts. ' + p / 10 + ' parts, ' + p + '%, are crossed out. The rest is what you pay: ' + money(price - price * p / 100) + '.' };
  }
  function splitMovie(bill, n) {
    var a = barPic({ parts: 1, top: 'Bill: ' + money(bill), regions: [] });
    var b = barPic({ parts: n, top: 'Bill: ' + money(bill), regions: [{ from: 0, len: 1, kind: 'shade' }], unit: function () { return money(bill / n); }, brace: { from: 0, len: 1, text: 'Each pays ' + money(bill / n) } });
    return { svg: mv(0.2, a.svg) + mv(1.4, b.svg), vb: b.vb, label: 'A bar for a ' + money(bill) + ' bill splits into ' + n + ' equal parts of ' + money(bill / n) + ', one for each friend.' };
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'Parts of a pizza', text: 'This pizza is cut into 8 equal slices. 3 slices are eaten, so 5 of the 8 slices are left. We write five eighths as 5/8: the bottom number is how many equal slices, the top number is how many we mean.',
      movie: function () { return pizzaMovie('pizza', 8, 3); } },
    { title: 'A fraction of a number', text: 'What is two thirds of 99? Draw a bar for 99 and split it into 3 equal parts: 99 ÷ 3 = 33 in each part. Two thirds is 2 parts: 2 × 33 = 66.',
      movie: function () { return ofMovie(2, 3, 99); } },
    { title: 'Decimals and money', text: '$1.25 is 1 dollar and 25 cents. Whole dollars go before the point, cents after it. A dime is a tenth of a dollar and a penny is a hundredth, so the point splits wholes from parts.',
      movie: function () { return moneyMovie(125); } },
    { title: 'Tenths on a tape', text: 'Split 1 metre into 10 equal steps: each step is a tenth, 0.1 m. Half a metre is 5 steps: 0.5 m. Which is bigger, 0.5 or 0.45? 0.5 is 50 hundredths and 0.45 is 45 hundredths, so 0.5 is bigger.',
      movie: function () { return tenthsMovie(500); } },
    { title: 'Percent means out of 100', text: 'This grid has 100 squares. 35 of them are shaded: 3 rows of 10 and 5 more. 35 out of 100 is 35 percent, written 35%.',
      movie: function () { return gridMovie(35); } },
    { title: 'Same amount, three ways', text: 'A quarter of the grid is 25 squares out of 100. As a fraction it is one quarter, 1/4. As a decimal it is 0.25. As a percent it is 25%. They are the same amount.',
      movie: function () { return threeMovie(1, 4); } },
    { title: 'Tips and sales', text: 'Dinner costs $40. For a 15% tip, find 10% first: $4. Half of that is 5%: $2. So 15% is $4 + $2 = $6. For 20% off a $30 toy, 10% is $3, so $6 comes off and the toy costs $24.',
      movie: function () { return tipMovie(4000, 15); } }
  ];

  /* ---------- playing a round ---------- */
  var KINDS = {
    pizza: function (st) { return ['left', 'eaten', 'share', 'more']; },
    dec: function () { return ['money', 'ruler', 'line', 'bigger']; },
    pct: function () { return ['grid', 'pick', 'battery', 'of']; },
    life: function () { return ['tip', 'sale', 'split']; },
    of: function () { return ['plain', 'story']; },
    match: function () { return ['pct', 'dec', 'frac']; }
  };
  function make(g, kind, st, n) {
    if (g === 'pizza') return makePizza(kind, st, n);
    if (g === 'of') return makeOf(st, n, kind === 'story');
    if (g === 'dec') return makeDec(kind, st, n);
    if (g === 'pct') return makePct(kind, st, n);
    if (g === 'match') return makeMatch(st, n, kind);
    return makeLife(kind, st, n);
  }
  /** Questions already asked in this visit (memory only): none comes back. */
  var SEEN = {}, PLAN = {};
  function fresh(g, st, n, round) {
    if (round === 0 || !PLAN[g] || !PLAN[g].length) {
      var ks = KINDS[g](st), list = [];
      while (list.length < 8) list = list.concat(shuffle(ks));
      PLAN[g] = list;
    }
    var kind = PLAN[g][round % PLAN[g].length], q = null;
    for (var i = 0; i < 80; i++) {
      var k = i < 50 ? kind : pick(KINDS[g](st));
      q = make(g, k, st, n);
      if (!SEEN[q.key]) break;
    }
    SEEN[q.key] = 1;
    return q;
  }
  function $(id) { return document.getElementById(id); }
  function refocus() { var b = document.querySelector('#choices button:not([disabled])'); if (b) b.focus(); }
  function labelOf(q, v) {
    if (q.labels && q.labels[v] != null) return q.labels[v];
    return fv(v) === fv(v) ? fw(v) : String(v);
  }
  function seenOf(q, v) {
    if (q.labels && q.labels[v] != null) return q.labels[v];
    return String(v);
  }
  function tileLook(q) {
    return function (v) {
      if (q.tile === 'grid') { var box = el('span', { 'class': 'pic' }); box.appendChild(svgEl(gridPic(+v, 0, 7, 2, 2), '0 0 74 74')); return box; }
      var m = /^(\d+)\/(\d+)$/.exec(v);
      if (q.tile === 'frac' && m) {
        var f = el('span', { 'class': 'frac' });
        f.appendChild(el('span', { 'class': 'top' }, m[1]));
        f.appendChild(el('span', { 'class': 'bot' }, m[2]));
        return f;
      }
      return el('span', { 'class': 'wordtile' }, seenOf(q, v));
    };
  }
  /* Tiles say their words when the keyboard moves to them (not when the game moves focus itself). */
  var quiet = false;
  function play(g) {
    return function (area, ctx) {
      missed = false;
      var a = age(), st = stepFor(g, a), n = choiceCount(a), q = fresh(g, st, n, ctx.round());
      var labels = {};
      q.choices.forEach(function (v) { labels[v] = labelOf(q, v); });
      var fill = q.fill || seenOf(q, q.ans);
      ctx.set({ game: g, kind: q.kind, step: st, key: q.key, data: q.data, ans: q.ans, right: [q.ans], choices: q.choices.slice(), labels: labels, line: q.line, fill: fill, text: q.text });
      if (a && a < 7) area.appendChild(el('p', { 'class': 'muted', id: 'older-note' }, 'This page is made for ages 7 and up, so these are the easiest rounds. A grown-up can help.'));
      ctx.ask(area, q.text, speakable(q.text));
      var scene = el('div', { 'class': 'scene', id: 'qpic' });
      function drawPic(done) { var p = q.pic(done); scene.innerHTML = ''; scene.appendChild(svgEl(p.svg, p.vb, p.label)); }
      drawPic(false);
      area.appendChild(scene);
      var line = el('p', { 'class': 'qline', id: 'qline' });
      line.appendChild(document.createTextNode(q.line[0]));
      var gap = el('span', { 'class': 'gap', id: 'gap' }, '?');
      line.appendChild(gap);
      line.appendChild(document.createTextNode(q.line[1]));
      area.appendChild(line);
      var tryBox = el('div', { 'class': 'try-pic', id: 'try-pic' });
      tryBox.hidden = true;
      var cls = q.cls || (q.choices.length === 4 || q.tile === 'grid' ? 'tiles two' : 'tiles');
      var row = ctx.tiles(q.choices, tileLook(q), function (v, b) {
        if (v === q.ans) {
          b.classList.add('right'); gotIt(g);
          gap.textContent = fill; gap.classList.add('filled');
          tryBox.hidden = true; tryBox.innerHTML = '';
          drawPic(true);
          ctx.win('Yes! ' + q.why, speakable('Yes! ' + q.why));
          return;
        }
        slipped(g);
        var w = q.wrong(v);
        tryBox.innerHTML = '';
        tryBox.appendChild(el('p', { id: 'try-text' }, w.text));
        tryBox.appendChild(svgEl(w.svg, w.vb, w.label));
        tryBox.hidden = false;
        ctx.miss(b, w.text, function (box) {
          var L = q.lesson();
          box.appendChild(ctx.moviePanel(L.movie));
          box.appendChild(el('p', { id: 'lesson-say' }, L.text));
          ctx.say(speakable(L.text));
        });
        ctx.say(speakable(w.text));
        quiet = true; refocus(); quiet = false;
      }, function (v) { return labels[v]; }, cls);
      [].forEach.call(row.querySelectorAll('button'), function (b) {
        b.addEventListener('focus', function () { if (!quiet) ctx.say(speakable(labels[b.getAttribute('data-v')] || '')); });
      });
      area.appendChild(row);
      area.appendChild(tryBox);
      var p = $('prompt');
      if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
      showLevel();
    };
  }

  /* ---------- how the games fit the age ---------- */
  var BANDS = ['ages 7 and 8: friendly numbers, halves, quarters and tenths', 'about ages 8 and 9', 'ages 9 and 10: thirds, fifths, hundredths, 10, 25 and 50 percent, and tips',
    'ages 11 and 12: any common fraction, 15, 18 and 35 percent, and sales in two steps', 'a little past age 12'];
  function showLevel() {
    var a = age(), note = $('level-note');
    if (!note) return;
    var t = a ? (a < 7 ? 'Set for age ' + a + ', from your child\'s profile. This page is made for ages 7 and up, so the games keep to the easiest rounds. A grown-up can help.'
      : 'Set for age ' + a + ', from your child\'s profile: ' + BANDS[base(a)] + '.')
      : 'No age picked, so the games are set in the middle, for about ages 8 and 9. A grown-up can pick an age on the Yaanstep Sprouts page.';
    t += ' Each round shows ' + choiceCount(a) + ' answers to pick from.';
    if (note.textContent !== t) note.textContent = t;
  }

  S.run({
    area: 'maths',
    names: { learn: 'Learn fractions, decimals and percent', pizza: 'Pizza and pie portions', of: 'A fraction of a number', dec: 'Decimals', pct: 'Percent', match: 'Same amount, three ways', life: 'Real life: tips, sales and sharing' },
    learn: LEARN,
    games: { pizza: play('pizza'), of: play('of'), dec: play('dec'), pct: play('pct'), match: play('match'), life: play('life') },
    init: function () {
      showLevel();
      document.addEventListener('click', showLevel);
      window.addEventListener('storage', showLevel);
    }
  });
  // Test hook, read only: the question makers, the age steps and the step each game is on now.
  window.YS_PARTS = {
    age: age, base: base, topStep: topStep, choiceCount: choiceCount, kinds: KINDS,
    make: function (g, kind, st, n) { var q = make(g, kind, st, n || 4); return { key: q.key, kind: q.kind, data: q.data, ans: q.ans, choices: q.choices, line: q.line, fill: q.fill, text: q.text, why: q.why }; },
    step: function (g) { return stepFor(g, age()); },
    seen: function () { return Object.keys(SEEN); },
    pctSteps: pctSteps, money: money, dec: dec
  };
})();
