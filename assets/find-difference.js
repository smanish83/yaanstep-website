/* Yaanstep Sprouts: Find the difference (ages 3 to 8; Manish, 23 Nov 2026: "Also add games like find a different.
   Make sure present the difficulties based on the kids age and how they are solving the puzzles.").
   Learn: a moving lesson in 5 parts. Games: Odd one out (a group where exactly one drawing differs) and
   Spot the differences (two made-up scenes; the second has 1 to 5 changes).
   The level starts from the child's age (profile key "ys-profile", read only, never written), then moves while they play:
   a round with no missed taps makes the next one trickier, 3 or more missed taps or a clue makes it easier.
   The level lives in memory only, for this visit. A soft clue shows after a quiet pause; there is no clock and no score.
   Original drawings only. Nothing is stored or sent. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle;
  var INK = '#17332c', RING = '#c4302b';
  var ST = ' stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"';
  var MAX = 6, HINT_MS = 12000;

  /* ---------- the child's age and comfort settings, read from the profile ---------- */
  function profile() { try { return JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); } catch (e) { return null; } }
  function age() { var p = profile(), a = p && +p.age; return a >= 3 && a <= 12 ? a : 0; }
  function comfortOn(id) { var p = profile(); return !!(p && Array.isArray(p.comfort) && p.comfort.indexOf(id) > -1); }
  /** The first level for an age: 1 for ages 3 and 4, 2 for 5 and 6 (and with no profile), 3 from age 7. */
  function startLevel(a) { return !a ? 2 : a <= 4 ? 1 : a <= 6 ? 2 : 3; }

  /* ---------- the level: per game, in memory only ---------- */
  var levels = { odd: null, spot: null };
  function getLevel(g) { if (levels[g] == null) levels[g] = startLevel(age()); return levels[g]; }
  /** After a won round: no missed taps and no clue, one step trickier; 3 or more missed taps, or a clue, one step easier. */
  function adjust(g, r) {
    var before = getLevel(g);
    if (r.hinted || r.wrong >= 3) levels[g] = Math.max(1, before - 1);
    else if (r.wrong === 0) levels[g] = Math.min(MAX, before + 1);
    r.next = levels[g];
    return levels[g] > before ? ' Getting trickier.' : levels[g] < before ? ' A bit easier now.' : '';
  }

  /* ---------- colors: a change of color always goes from a light color to a dark one, or back ---------- */
  var COLORS = { red: '#d6453d', blue: '#2f6fbf', yellow: '#f2c230', green: '#3f9d4a', purple: '#7c4dbd', orange: '#e8812a', pink: '#f19ac0', brown: '#8a5a33', white: '#ffffff', gray: '#8f9b97' };
  var LIGHT = ['yellow', 'pink', 'orange', 'white'];
  function light(c) { return LIGHT.indexOf(c) > -1; }
  /** Another color from the list, from the other side (light or dark) when there is one. */
  function otherColor(c, list) {
    var far = list.filter(function (x) { return x !== c && light(x) !== light(c); });
    var near = list.filter(function (x) { return x !== c; });
    var pool = far.length ? far : near;
    return pool.length ? pool[rnd(pool.length)] : null;
  }
  function f1(n) { return Math.round(n * 100) / 100; }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- the drawings for the scenes (each in a 64 by 64 box, c is the fill) ---------- */
  var KINDS = {
    sun: { colors: ['yellow'], draw: function (c) { return '<path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6" stroke="#c98a10" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="32" r="15" fill="' + c + '"' + ST + '/>'; } },
    cloud: { colors: ['white', 'gray'], draw: function (c) { return '<path d="M14 46a10 10 0 0 1 2-20a14 14 0 0 1 26-4a11 11 0 0 1 10 24z" fill="' + c + '"' + ST + '/>'; } },
    bird: { colors: ['blue', 'red', 'yellow', 'purple'], draw: function (c) { return birdArt({ color: c, facing: 1, wing: true }, true); } },
    butterfly: { colors: ['purple', 'orange', 'blue', 'pink'], draw: function (c) {
      return '<ellipse cx="20" cy="24" rx="13" ry="11" fill="' + c + '"' + ST + '/><ellipse cx="44" cy="24" rx="13" ry="11" fill="' + c + '"' + ST + '/><ellipse cx="22" cy="42" rx="9" ry="8" fill="' + c + '"' + ST + '/><ellipse cx="42" cy="42" rx="9" ry="8" fill="' + c + '"' + ST + '/><rect x="29.5" y="16" width="5" height="34" rx="2.5" fill="' + INK + '"/><path d="M31 17l-5-9M33 17l5-9" stroke="' + INK + '" stroke-width="2"/>'; } },
    kite: { colors: ['red', 'blue', 'yellow', 'green'], draw: function (c) { return '<polygon points="32,4 52,26 32,50 12,26" fill="' + c + '"' + ST + '/><path d="M32 4V50M12 26H52" stroke="' + INK + '" stroke-width="1.5"/><path d="M32 50q-6 4 0 7t0 6" stroke="' + INK + '" fill="none" stroke-width="1.5"/>'; } },
    balloon: { colors: ['red', 'blue', 'yellow', 'purple', 'pink'], draw: function (c) { return '<path d="M32 47q-5 8 0 15" stroke="' + INK + '" fill="none" stroke-width="1.5"/><ellipse cx="32" cy="24" rx="16" ry="19" fill="' + c + '"' + ST + '/><path d="M29 43h6l-3 4z" fill="' + c + '"' + ST + '/>'; } },
    house: { colors: ['yellow', 'blue', 'pink', 'white'], draw: function (c) { return houseArt({ color: c, windows: 2, chimney: true }, true); } },
    tree: { colors: ['green', 'orange'], draw: function (c) { return '<rect x="28" y="36" width="8" height="24" fill="#8a5a33"' + ST + '/><circle cx="32" cy="26" r="20" fill="' + c + '"' + ST + '/>'; } },
    cat: { colors: ['orange', 'gray', 'white', 'brown'], draw: function (c) {
      return '<path d="M46 52q12-4 9-16" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="46" rx="15" ry="14" fill="' + c + '"' + ST + '/><polygon points="22,20 21,6 30,14" fill="' + c + '"' + ST + '/><polygon points="42,20 43,6 34,14" fill="' + c + '"' + ST + '/><circle cx="32" cy="24" r="12" fill="' + c + '"' + ST + '/><circle cx="28" cy="23" r="1.8" fill="' + INK + '"/><circle cx="36" cy="23" r="1.8" fill="' + INK + '"/><path d="M30 28h4l-2 2z" fill="' + INK + '"/>'; } },
    flower: { colors: ['red', 'pink', 'yellow', 'purple', 'blue'], draw: function (c) {
      var out = '<path d="M32 34V62" stroke="#2f7d3a" stroke-width="4"/><path d="M32 52q-10-2-12-10q10 0 12 10z" fill="#3f9d4a"/>';
      for (var i = 0; i < 5; i++) { var a = (-90 + i * 72) * Math.PI / 180; out += '<circle cx="' + f1(32 + 10 * Math.cos(a)) + '" cy="' + f1(24 + 10 * Math.sin(a)) + '" r="7.5" fill="' + c + '"' + ST + '/>'; }
      return out + '<circle cx="32" cy="24" r="6" fill="#f2c230"' + ST + '/>'; } },
    bush: { colors: ['green'], draw: function (c) { return '<path d="M8 56a12 12 0 0 1 6-20a13 13 0 0 1 22-8a12 12 0 0 1 20 10a10 10 0 0 1 0 18z" fill="' + c + '"' + ST + '/>'; } },
    ball: { colors: ['red', 'blue', 'yellow', 'purple', 'orange'], draw: function (c) { return '<circle cx="32" cy="38" r="20" fill="' + c + '"' + ST + '/><path d="M12 38h40M32 18q-12 20 0 40" stroke="' + INK + '" stroke-width="1.5" fill="none"/>'; } },
    mushroom: { colors: ['red', 'brown'], draw: function (c) { return '<rect x="25" y="32" width="14" height="24" rx="5" fill="#f3e6cc"' + ST + '/><path d="M8 36a24 22 0 0 1 48 0z" fill="' + c + '"' + ST + '/><circle cx="24" cy="26" r="3.5" fill="#fff"/><circle cx="38" cy="21" r="3" fill="#fff"/><circle cx="45" cy="31" r="2.5" fill="#fff"/>'; } },
    snail: { colors: ['orange', 'brown', 'pink'], draw: function (c) { return '<path d="M12 50l-4-12M17 50l0-12" stroke="' + INK + '" stroke-width="2"/><path d="M6 56q0-6 8-6h40q6 0 6 6z" fill="#d9c49a"' + ST + '/><circle cx="36" cy="36" r="15" fill="' + c + '"' + ST + '/><path d="M28 36a8 8 0 1 1 8 8" fill="none" stroke="' + INK + '" stroke-width="2"/>'; } },
    duck: { colors: ['yellow', 'white'], draw: function (c) { return '<ellipse cx="30" cy="44" rx="20" ry="12" fill="' + c + '"' + ST + '/><circle cx="44" cy="26" r="10" fill="' + c + '"' + ST + '/><path d="M53 26l9 2-9 4z" fill="#e8812a"' + ST + '/><circle cx="46" cy="24" r="1.8" fill="' + INK + '"/>'; } },
    bench: { colors: ['brown', 'blue', 'red'], draw: function (c) { return '<path d="M12 44v14M52 44v14" stroke="' + INK + '" stroke-width="4"/><rect x="6" y="22" width="52" height="8" rx="2" fill="' + c + '"' + ST + '/><rect x="6" y="36" width="52" height="8" rx="2" fill="' + c + '"' + ST + '/>'; } },
    dog: { colors: ['brown', 'white', 'gray'], draw: function (c) {
      return '<path d="M16 44v12M24 44v12M36 44v12M42 44v12" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><path d="M12 34q-8-6-6-14" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="10" y="30" width="36" height="16" rx="8" fill="' + c + '"' + ST + '/><circle cx="48" cy="26" r="10" fill="' + c + '"' + ST + '/><ellipse cx="44" cy="28" rx="4" ry="8" fill="#5b3a1e"/><circle cx="51" cy="24" r="1.8" fill="' + INK + '"/><circle cx="58" cy="28" r="2" fill="' + INK + '"/>'; } },
    slide: { colors: ['red', 'blue', 'yellow'], draw: function (c) { return '<path d="M10 58V18M18 58V18" stroke="' + INK + '" stroke-width="3"/><path d="M10 26h8M10 36h8M10 46h8" stroke="' + INK + '" stroke-width="2"/><path d="M18 18h6q8 0 14 14l12 26h-8L30 34q-4-8-12-8z" fill="' + c + '"' + ST + '/>'; } },
    apple: { colors: ['red', 'green', 'yellow'], draw: function (c) { return '<path d="M32 18q0-8 6-12" stroke="#5b3a1e" stroke-width="3" fill="none"/><path d="M32 18c-6-6-24-4-22 16c2 18 14 26 22 22c8 4 20-4 22-22c2-20-16-22-22-16z" fill="' + c + '"' + ST + '/><path d="M34 14q8-6 14 0q-8 6-14 0z" fill="#3f9d4a"/>'; } },
    banana: { colors: ['yellow'], draw: function (c) { return '<path d="M10 20l-2-6" stroke="#5b3a1e" stroke-width="3"/><path d="M8 22q6 32 46 26q4-2 2-6q-30 6-40-24z" fill="' + c + '"' + ST + '/>'; } },
    pear: { colors: ['green', 'yellow'], draw: function (c) { return '<path d="M32 12V5" stroke="#5b3a1e" stroke-width="3"/><path d="M32 12c-8 0-8 12-10 18c-6 6-10 26 10 28c20-2 16-22 10-28c-2-6-2-18-10-18z" fill="' + c + '"' + ST + '/>'; } },
    cup: { colors: ['blue', 'red', 'yellow', 'white', 'purple'], draw: function (c) { return cupArt({ color: c, facing: 1, pattern: 'plain', handle: true }, true); } },
    bowl: { colors: ['blue', 'orange', 'white', 'green'], draw: function (c) { return '<path d="M6 30h52q-2 26-26 26T6 30z" fill="' + c + '"' + ST + '/><ellipse cx="32" cy="30" rx="26" ry="5" fill="#f3e6cc"' + ST + '/>'; } },
    cake: { colors: ['pink', 'white', 'brown'], draw: function (c) { return '<rect x="12" y="32" width="40" height="24" rx="3" fill="' + c + '"' + ST + '/><path d="M12 39q5 5 10 0t10 0t10 0t10 0" stroke="' + INK + '" stroke-width="1.5" fill="none"/><rect x="30" y="18" width="4" height="14" fill="#7c4dbd"' + ST + '/><path d="M32 8q-4 6 0 9q4-3 0-9z" fill="#f2c230"' + ST + '/>'; } },
    carrot: { colors: ['orange'], draw: function (c) { return '<path d="M20 20l-8-12M22 18l0-12M24 20l8-10" stroke="#3f9d4a" stroke-width="3" stroke-linecap="round"/><path d="M18 20q10-6 18 2L52 58q1 3-3 1L18 28q-4-4 0-8z" fill="' + c + '"' + ST + '/>'; } },
    grapes: { colors: ['purple', 'green'], draw: function (c) {
      var out = '<path d="M32 14V5" stroke="#5b3a1e" stroke-width="3"/>';
      [[20, 20], [32, 20], [44, 20], [26, 31], [38, 31], [20, 42], [32, 42], [44, 42], [32, 53]].forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6.5" fill="' + c + '"' + ST + '/>'; });
      return out; } },
    teapot: { colors: ['blue', 'white', 'red', 'yellow'], draw: function (c) { return '<path d="M48 32q12 2 8 14q-2 4-8 4" fill="none" stroke="' + INK + '" stroke-width="3"/><path d="M16 40L4 28l4-3 12 9z" fill="' + c + '"' + ST + '/><ellipse cx="32" cy="42" rx="18" ry="14" fill="' + c + '"' + ST + '/><path d="M22 30q10-8 20 0z" fill="' + c + '"' + ST + '/><circle cx="32" cy="22" r="3" fill="' + c + '"' + ST + '/>'; } },
    clock: { colors: ['red', 'blue', 'yellow', 'green'], draw: function (c) { return '<circle cx="32" cy="32" r="24" fill="' + c + '"' + ST + '/><circle cx="32" cy="32" r="17" fill="#fff"' + ST + '/><path d="M32 32V20M32 32l8 5" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>'; } },
    frame: { colors: ['blue', 'red', 'yellow', 'purple'], name: 'picture frame', draw: function (c) { return '<rect x="8" y="12" width="48" height="40" fill="' + c + '"' + ST + '/><rect x="14" y="18" width="36" height="28" fill="#cfe8f5"' + ST + '/><path d="M15 45l11-13 8 8 6-6 9 11z" fill="#3f9d4a"/><circle cx="42" cy="26" r="4" fill="#f2c230"/>'; } },
    lamp: { colors: ['yellow', 'orange', 'blue'], draw: function (c) { return '<path d="M32 2v12" stroke="' + INK + '" stroke-width="2"/><circle cx="32" cy="38" r="5" fill="#fff3b0"' + ST + '/><path d="M18 34l6-20h16l6 20z" fill="' + c + '"' + ST + '/>'; } },
    window: { colors: ['blue', 'red', 'yellow'], draw: function (c) { return '<rect x="12" y="10" width="40" height="44" fill="#cfe8f5"' + ST + '/><path d="M32 10v44M12 32h40" stroke="' + INK + '" stroke-width="2"/><path d="M8 8h14q-4 22 0 48H8z" fill="' + c + '"' + ST + '/><path d="M56 8H42q4 22 0 48h14z" fill="' + c + '"' + ST + '/>'; } }
  };
  function kindName(k) { return KINDS[k].name || k; }

  /* ---------- the scenes: 15 places, 5 across and 3 down; the top row is the sky (or the wall) ---------- */
  var THEMES = {
    garden: { name: 'a garden', top: ['sun', 'cloud', 'bird', 'butterfly', 'kite'], low: ['house', 'tree', 'cat', 'flower', 'bush', 'ball', 'mushroom', 'snail', 'duck', 'dog'], bg: ['#dff1fb', '#cdebc9'] },
    park: { name: 'a park', top: ['sun', 'cloud', 'bird', 'kite', 'balloon'], low: ['tree', 'bench', 'ball', 'dog', 'flower', 'duck', 'bush', 'slide', 'mushroom', 'cat'], bg: ['#e3f3fb', '#d6eec0'] },
    table: { name: 'a kitchen table', top: ['clock', 'frame', 'lamp', 'window'], low: ['apple', 'banana', 'pear', 'cup', 'bowl', 'cake', 'carrot', 'grapes', 'teapot', 'flower'], bg: ['#f6ead2', '#e9c08f'] }
  };
  /** Parts in a scene and changes in the second picture, for levels 1 to 6. */
  var SPOT_PARTS = [5, 6, 7, 8, 9, 10], SPOT_DIFFS = [1, 2, 3, 3, 4, 5];
  var ROWS = ['Top', 'Middle', 'Bottom'];
  function slotXY(s) { return [(s % 5) * 80 + 40, Math.floor(s / 5) * 80 + 40]; }
  function place(s) { return ROWS[Math.floor(s / 5)] + ', place ' + (s % 5 + 1); }
  function isTop(s) { return s < 5; }
  function sizeScale(size) { return size === 'small' ? 0.62 : 1.15; }
  /** One part drawn in its place. */
  function partArt(p) {
    var xy = slotXY(p.slot), s = sizeScale(p.size);
    return '<g transform="translate(' + f1(xy[0] - 32 * s) + ' ' + f1(xy[1] - 32 * s) + ') scale(' + s + ')">' + KINDS[p.kind].draw(COLORS[p.color]) + '</g>';
  }
  /** What a place in a picture shows ('' when it is empty): tests compare the two pictures place by place with this. */
  function slotArt(parts, s) { var p = parts.filter(function (x) { return x.slot === s; })[0]; return p ? partArt(p) : ''; }
  function partWords(p) { return 'a ' + p.size + ' ' + p.color + ' ' + kindName(p.kind); }
  function sceneSvg(theme, parts) {
    var t = THEMES[theme];
    var out = '<rect width="400" height="80" fill="' + t.bg[0] + '"/><rect y="80" width="400" height="160" fill="' + t.bg[1] + '"/>';
    if (theme === 'table') out += '<path d="M0 80h400" stroke="#b07a45" stroke-width="4"/>';
    parts.slice().sort(function (a, b) { return a.slot - b.slot; }).forEach(function (p) { out += partArt(p); });
    return out + '<g class="rings"></g>';
  }
  function sceneLabel(which, theme, parts) {
    var list = parts.slice().sort(function (a, b) { return a.slot - b.slot; }).map(function (p) { return place(p.slot) + ': ' + partWords(p); });
    return which + ', ' + THEMES[theme].name + '. ' + list.join('. ') + '.';
  }
  function ringAt(s) { var xy = slotXY(s); return '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="37" fill="none" stroke="' + RING + '" stroke-width="5"/>'; }

  /** A new scene and its changed copy. Every change is one of: color, missing, extra, size, position.
      No two changes touch the same part or the same place, so nothing else differs. */
  function makeSpot(lv, theme) {
    lv = Math.max(1, Math.min(MAX, lv));
    theme = theme || Object.keys(THEMES)[rnd(3)];
    var t = THEMES[theme], n = SPOT_PARTS[lv - 1], want = SPOT_DIFFS[lv - 1];
    var nTop = between(1, Math.min(3, t.top.length - 1)), nLow = n - nTop;
    var kinds = shuffle(t.top).slice(0, nTop).concat(shuffle(t.low).slice(0, nLow));
    var slots = shuffle([0, 1, 2, 3, 4]).slice(0, nTop).concat(shuffle([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).slice(0, nLow));
    var left = kinds.map(function (k, i) { var cs = KINDS[k].colors; return { kind: k, color: cs[rnd(cs.length)], size: rnd(4) ? 'big' : 'small', slot: slots[i] }; });
    var right = left.map(function (p) { return { kind: p.kind, color: p.color, size: p.size, slot: p.slot }; });
    var touched = {}, diffs = [], used = {};
    left.forEach(function (p) { used[p.slot] = true; });
    function freeSlot(top) {
      var list = (top ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).filter(function (s) { return !used[s]; });
      return list.length ? list[rnd(list.length)] : null;
    }
    function untouched() { return shuffle(right.filter(function (p) { return !touched[p.kind]; })); }
    var tries = {
      color: function () {
        var p = untouched().filter(function (x) { return KINDS[x.kind].colors.length > 1; })[0];
        if (!p) return null;
        var from = p.color; p.color = otherColor(from, KINDS[p.kind].colors);
        return { type: 'color', kind: p.kind, slots: [p.slot], text: 'The ' + kindName(p.kind) + ' is ' + p.color + ' here, and ' + from + ' in the first picture.' };
      },
      size: function () {
        var p = untouched()[0];
        if (!p) return null;
        var from = p.size; p.size = from === 'big' ? 'small' : 'big';
        return { type: 'size', kind: p.kind, slots: [p.slot], text: 'The ' + kindName(p.kind) + ' is ' + p.size + ' here, and ' + from + ' in the first picture.' };
      },
      missing: function () {
        // Keep at least three parts in the picture.
        if (right.length <= 3) return null;
        var p = untouched()[0];
        if (!p) return null;
        right.splice(right.indexOf(p), 1);
        return { type: 'missing', kind: p.kind, slots: [p.slot], text: 'The ' + kindName(p.kind) + ' is missing from this picture.' };
      },
      extra: function () {
        var have = right.map(function (p) { return p.kind; }).concat(Object.keys(touched));
        var options = shuffle(t.top.concat(t.low).filter(function (k) { return have.indexOf(k) < 0; }));
        for (var i = 0; i < options.length; i++) {
          var k = options[i], s = freeSlot(t.top.indexOf(k) > -1);
          if (s == null) continue;
          used[s] = true;
          var cs = KINDS[k].colors;
          right.push({ kind: k, color: cs[rnd(cs.length)], size: 'big', slot: s });
          return { type: 'extra', kind: k, slots: [s], text: 'There is a new ' + kindName(k) + ' in this picture.' };
        }
        return null;
      },
      position: function () {
        var list = untouched();
        for (var i = 0; i < list.length; i++) {
          var p = list[i], s = freeSlot(isTop(p.slot));
          if (s == null) continue;
          used[s] = true;
          var from = p.slot; p.slot = s;
          return { type: 'position', kind: p.kind, slots: [s, from], text: 'The ' + kindName(p.kind) + ' moved to a new place.' };
        }
        return null;
      }
    };
    var order = shuffle(Object.keys(tries));
    for (var k = 0; diffs.length < want && k < 40; k++) {
      // Different kinds of change first, then repeats.
      var type = k < order.length ? order[k] : order[rnd(order.length)];
      var d = tries[type]();
      if (!d) continue;
      touched[d.kind] = true;
      d.id = 'd' + (diffs.length + 1);
      diffs.push(d);
    }
    return { theme: theme, level: lv, left: left, right: right, diffs: diffs };
  }

  /* ---------- the drawings for Odd one out ---------- */
  function mirror(out, facing) { return facing < 0 ? '<g transform="matrix(-1 0 0 1 64 0)">' + out + '</g>' : out; }
  function hex(c) { return COLORS[c] || c; }
  function fishArt(f) {
    var c = hex(f.color), out = '<polygon points="16,32 4,21 4,43" fill="' + c + '"' + ST + '/>';
    if (f.fin) out += '<path d="M25 23L33 8L45 22Z" fill="' + c + '"' + ST + '/>';
    out += '<ellipse cx="34" cy="32" rx="22" ry="13" fill="' + c + '"' + ST + '/>';
    [23, 30, 37].slice(0, f.stripes).forEach(function (x) { var h = f1(13 * Math.sqrt(1 - Math.pow((x - 34) / 22, 2)) - 1.5); out += '<path d="M' + x + ' ' + f1(32 - h) + 'V' + f1(32 + h) + '" stroke="' + INK + '" stroke-width="2.5"/>'; });
    out += '<circle cx="47" cy="29" r="2.6" fill="' + INK + '"/><path d="M55 35q-3 2-6 0" stroke="' + INK + '" fill="none" stroke-width="1.5"/>';
    return mirror(out, f.facing);
  }
  function birdArt(f, raw) {
    var c = raw ? f.color : hex(f.color);
    var out = '<path d="M6 30l12 4-12 7z" fill="' + c + '"' + ST + '/><ellipse cx="31" cy="38" rx="17" ry="13" fill="' + c + '"' + ST + '/><circle cx="46" cy="26" r="10" fill="' + c + '"' + ST + '/><path d="M55 24l8 3-8 4z" fill="#e8812a"' + ST + '/><circle cx="48" cy="24" r="2.2" fill="' + INK + '"/>';
    if (f.wing) out += '<path d="M19 37q10-14 22-2q-11 11-22 2z" fill="#fff" fill-opacity=".6"' + ST + '/>';
    return mirror(out + '<path d="M27 51v8M35 51v8" stroke="' + INK + '" stroke-width="2"/>', f.facing);
  }
  function cupArt(f, raw) {
    var c = raw ? f.color : hex(f.color), out = '';
    if (f.handle) out += '<path d="M44 25q14 0 12 13t-14 10" fill="none" stroke="' + INK + '" stroke-width="5"/>';
    out += '<path d="M12 16h34l-4 40H16z" fill="' + c + '"' + ST + '/>';
    if (f.pattern === 'stripes') out += '<path d="M14.6 26h28.8l-.5 6H15.1zM15.8 40h26.4l-.5 6H16.3z" fill="#fff" stroke="' + INK + '" stroke-width="1"/>';
    if (f.pattern === 'dots') [[22, 28], [36, 28], [29, 40], [22, 50], [36, 50]].forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#fff" stroke="' + INK + '" stroke-width="1"/>'; });
    return mirror(out, f.facing);
  }
  function shirtArt(f) {
    var c = hex(f.color), out = '<path d="M22 10L8 18L14 30L20 27V58H44V27L50 30L56 18L42 10Q32 18 22 10Z" fill="' + c + '"' + ST + '/>';
    if (f.pattern === 'stripes') out += '<path d="M20 33h24v5H20zM20 45h24v5H20z" fill="#fff" stroke="' + INK + '" stroke-width="1"/>';
    if (f.pattern === 'dots') [[25, 36], [39, 36], [25, 49], [39, 49]].forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff" stroke="' + INK + '" stroke-width="1"/>'; });
    if (f.pocket) out += '<rect x="35" y="20" width="7" height="8" fill="' + c + '" stroke="' + INK + '" stroke-width="1.5"/>';
    for (var i = 0; i < f.buttons; i++) out += '<circle cx="32" cy="' + (22 + i * 9) + '" r="2.6" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    return out;
  }
  function ladybugArt(f) {
    var c = hex(f.color), out = '';
    if (f.feelers) out += '<path d="M28 10L21 2M36 10L43 2" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>';
    out += '<circle cx="32" cy="16" r="9" fill="' + INK + '"/><circle cx="32" cy="38" r="21" fill="' + c + '"' + ST + '/><path d="M32 18V59" stroke="' + INK + '" stroke-width="2"/>';
    [[24, 28], [40, 28], [21, 40], [43, 40], [26, 51], [38, 51]].slice(0, f.spots).forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.8" fill="' + INK + '"/>'; });
    return out;
  }
  function houseArt(f, raw) {
    var c = raw ? f.color : hex(f.color), out = '';
    if (f.chimney) out += '<rect x="40" y="10" width="7" height="16" fill="#b5523b"' + ST + '/>';
    out += '<rect x="12" y="28" width="40" height="30" fill="' + c + '"' + ST + '/><polygon points="8,30 32,8 56,30" fill="#b5523b"' + ST + '/><rect x="27" y="42" width="10" height="16" fill="#8a5a33"' + ST + '/>';
    [[15, 32], [41, 32], [15, 45], [41, 45]].slice(0, f.windows).forEach(function (p) { out += '<rect x="' + p[0] + '" y="' + p[1] + '" width="8" height="8" fill="#cfe8f5"' + ST + '/>'; });
    return out;
  }
  var SUBJECTS = {
    fish: { colors: ['orange', 'blue', 'yellow', 'purple', 'red'], art: fishArt, facing: true, part: 'fin', count: ['stripes', 0, 3, 'stripe', 'stripes'],
      base: function () { return { stripes: between(1, 3), fin: true }; } },
    bird: { colors: ['blue', 'red', 'yellow', 'purple'], art: function (f) { return birdArt(f); }, facing: true, part: 'wing',
      base: function () { return { wing: true }; } },
    cup: { colors: ['blue', 'red', 'yellow', 'green', 'purple'], art: function (f) { return cupArt(f); }, facing: true, part: 'handle', pattern: true,
      base: function () { return { pattern: ['plain', 'stripes', 'dots'][rnd(3)], handle: true }; } },
    shirt: { colors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'], art: shirtArt, part: 'pocket', pattern: true, count: ['buttons', 1, 4, 'button', 'buttons'],
      base: function () { return { pattern: ['plain', 'stripes', 'dots'][rnd(3)], buttons: between(2, 4), pocket: true }; } },
    ladybug: { colors: ['red', 'yellow', 'orange'], art: ladybugArt, part: 'feelers', count: ['spots', 1, 6, 'spot', 'spots'],
      base: function () { return { spots: between(2, 6), feelers: true }; } },
    house: { colors: ['yellow', 'blue', 'pink', 'green'], art: function (f) { return houseArt(f); }, part: 'chimney', count: ['windows', 1, 4, 'window', 'windows'],
      base: function () { return { windows: between(1, 4), chimney: true }; } }
  };
  var PLURALS = { fish: 'fish', bird: 'birds', cup: 'cups', shirt: 'shirts', ladybug: 'ladybugs', house: 'houses' };
  /** Group size and the kinds of change for levels 1 to 6: from a whole new color to one small detail. */
  var ODD_N = [3, 4, 5, 6, 8, 9];
  var ODD_TYPES = [['color', 'shape'], ['color', 'shape', 'size'], ['size', 'facing', 'pattern'], ['facing', 'pattern', 'part'], ['pattern', 'part', 'count'], ['part', 'count']];
  function oddArt(f) {
    var a = SUBJECTS[f.kind].art(f);
    return f.size === 'small' ? '<g transform="translate(32 32) scale(.62) translate(-32 -32)">' + a + '</g>' : a;
  }
  function dir(f) { return f.facing < 0 ? 'left' : 'right'; }
  function patWords(p) { return p === 'plain' ? 'no pattern' : p; }
  /** Words for one drawing, with every feature that can change, so a screen reader can compare them too. */
  function oddWords(f) {
    var s = 'a ' + f.size + ' ' + f.color + ' ' + f.kind, bits = [];
    if (f.kind === 'fish') { s += ' facing ' + dir(f); bits.push(f.stripes ? plural(f.stripes, 'stripe', 'stripes') : 'no stripes', f.fin ? 'a fin' : 'no fin'); }
    if (f.kind === 'bird') { s += ' facing ' + dir(f); bits.push(f.wing ? 'a wing' : 'no wing'); }
    if (f.kind === 'cup') { bits.push(patWords(f.pattern), f.handle ? 'a handle on the ' + dir(f) : 'no handle'); }
    if (f.kind === 'shirt') { bits.push(patWords(f.pattern), plural(f.buttons, 'button', 'buttons'), f.pocket ? 'a pocket' : 'no pocket'); }
    if (f.kind === 'ladybug') { bits.push(plural(f.spots, 'spot', 'spots'), f.feelers ? 'feelers' : 'no feelers'); }
    if (f.kind === 'house') { bits.push(plural(f.windows, 'window', 'windows'), f.chimney ? 'a chimney' : 'no chimney'); }
    return s + ', with ' + bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1];
  }
  function baseOf(kind, color, size, facing) {
    var sub = SUBJECTS[kind], f = sub.base();
    f.kind = kind; f.color = color; f.size = size;
    if (sub.facing) f.facing = facing;
    return f;
  }
  function makeOdd(lv, n, mode) {
    lv = Math.max(1, Math.min(MAX, lv));
    n = n || ODD_N[lv - 1];
    var types = ODD_TYPES[lv - 1];
    mode = mode || types[rnd(types.length)];
    var names = Object.keys(SUBJECTS).filter(function (k) {
      var s = SUBJECTS[k];
      return mode === 'facing' ? s.facing : mode === 'pattern' ? s.pattern : mode === 'count' ? s.count : true;
    });
    var kind = names[rnd(names.length)], sub = SUBJECTS[kind];
    var base = baseOf(kind, sub.colors[rnd(sub.colors.length)], mode === 'size' && rnd(2) ? 'small' : 'big', rnd(2) ? 1 : -1);
    if (mode === 'count') { var c0 = sub.count; if (base[c0[0]] <= c0[1]) base[c0[0]] = c0[1] + 1; }
    var odd = JSON.parse(JSON.stringify(base)), reason = '', k = kind;
    if (mode === 'color') { odd.color = otherColor(base.color, sub.colors); reason = 'This ' + k + ' is ' + odd.color + '. The others are ' + base.color + '.'; }
    if (mode === 'shape') {
      var others = Object.keys(SUBJECTS).filter(function (x) { return x !== kind; }), k2 = others[rnd(others.length)];
      odd = baseOf(k2, base.color, base.size, base.facing || 1);
      reason = 'This one is a ' + k2 + '. The others are ' + PLURALS[kind] + '.';
    }
    if (mode === 'size') { odd.size = base.size === 'big' ? 'small' : 'big'; reason = 'This ' + k + ' is ' + odd.size + '. The others are ' + base.size + '.'; }
    if (mode === 'facing') { odd.facing = -base.facing; reason = 'This ' + k + ' faces ' + dir(odd) + '. The others face ' + dir(base) + '.'; }
    if (mode === 'pattern') {
      var pats = ['plain', 'stripes', 'dots'].filter(function (p) { return p !== base.pattern; });
      odd.pattern = pats[rnd(2)];
      reason = 'This ' + k + ' has ' + patWords(odd.pattern) + '. The others have ' + patWords(base.pattern) + '.';
    }
    if (mode === 'part') { odd[sub.part] = false; reason = 'This ' + k + ' has no ' + sub.part + '. The others ' + (sub.part === 'feelers' ? 'have feelers.' : 'each have a ' + sub.part + '.'); }
    if (mode === 'count') {
      var c = sub.count, v = base[c[0]];
      odd[c[0]] = v - 1 >= c[1] && (rnd(2) || v + 1 > c[2]) ? v - 1 : v + 1;
      reason = 'This ' + k + ' has ' + plural(odd[c[0]], c[3], c[4]) + '. The others have ' + plural(v, c[3], c[4]) + '.';
    }
    var spot = rnd(n), items = [];
    for (var i = 0; i < n; i++) items.push({ id: String(i + 1), f: JSON.parse(JSON.stringify(i === spot ? odd : base)) });
    return { mode: mode, level: lv, items: items, ans: String(spot + 1), reason: reason, kind: kind };
  }
  function oddMovie(q, ringDelay) {
    var n = q.items.length, w = 70, out = '';
    q.items.forEach(function (it, i) { out += '<svg x="' + (i * w + 3) + '" y="6" width="64" height="64" viewBox="0 0 64 64">' + oddArt(it.f) + '</svg>'; });
    var i0 = +q.ans - 1;
    out += '<rect x="' + (i0 * w) + '" y="2" width="70" height="72" rx="12" fill="none" stroke="' + RING + '" stroke-width="4"' + at(ringDelay || 1.2) + '/>';
    return { svg: out, vb: '0 0 ' + (n * w) + ' 78', label: 'Pictures: ' + q.items.map(function (it) { return oddWords(it.f); }).join('; ') + '. A ring goes around picture ' + q.ans + '. ' + q.reason };
  }
  function spotMovie(q) {
    var out = '<svg x="0" y="0" width="156" height="94" viewBox="0 0 400 240">' + sceneSvg(q.theme, q.left) + '</svg>' +
      '<svg x="164" y="0" width="156" height="94" viewBox="0 0 400 240">' + sceneSvg(q.theme, q.right);
    q.diffs.forEach(function (d, i) { out += '<g' + at(1 + i * 0.9) + '>' + d.slots.map(ringAt).join('') + '</g>'; });
    out += '</svg>';
    return { svg: out, vb: '0 0 320 94', label: 'Two pictures of ' + THEMES[q.theme].name + '. In the second picture, rings show each change: ' + q.diffs.map(function (d) { return d.text; }).join(' ') };
  }

  /* ---------- the clue after a quiet pause ---------- */
  var hintTimer = null, hintFn = null;
  function stopHint() { if (hintTimer) clearTimeout(hintTimer); hintTimer = null; }
  /** Waits for a quiet pause, then gives a clue, only while this round (node) is still on screen. */
  function armHint(fn, node) {
    stopHint();
    hintFn = function () { if (node.isConnected && !document.getElementById('game').hidden) fn(); };
    hintTimer = setTimeout(function () { hintTimer = null; hintFn(); }, HINT_MS);
  }
  /** Marks one answer softly: a still outline, with a soft glow only when moving pictures are allowed. */
  function glow(node) {
    clearGlow();
    if (!node) return;
    node.classList.add('hint');
    if (!comfortOn('calm')) node.classList.add('glow');
  }
  function clearGlow() { [].forEach.call(document.querySelectorAll('#area .hint'), function (n) { n.classList.remove('hint', 'glow'); }); }

  /* ---------- 1. Odd one out ---------- */
  function refocus() { var n = document.querySelector('#choices button:not([disabled])'); if (n) n.focus(); }
  function odd(area, ctx) {
    var lv = getLevel('odd'), n = ODD_N[lv - 1];
    if (comfortOn('fewer')) n = Math.min(n, 3);
    var q = makeOdd(lv, n), byId = {};
    q.items.forEach(function (it) { byId[it.id] = it; });
    var r = { game: 'odd', level: lv, mode: q.mode, items: q.items, ans: q.ans, right: [q.ans], choices: q.items.map(function (it) { return it.id; }), reason: q.reason, wrong: 0, hinted: false };
    ctx.set(r);
    ctx.ask(area, n === 3 ? 'One of these is different. Which one?' : 'Look at all ' + n + '. One is different. Which one?');
    var cls = n === 4 ? 'tiles two' : n > 6 ? 'tiles many' : 'tiles';
    var row = area.appendChild(ctx.tiles(r.choices, function (id) { return svgEl(oddArt(byId[id].f), '0 0 64 64'); }, function (id, b) {
      clearGlow();
      if (id === q.ans) {
        stopHint();
        b.classList.add('right');
        ctx.win('Yes! ' + q.reason + adjust('odd', r), 'Yes! ' + q.reason);
        return;
      }
      r.wrong++;
      ctx.miss(b, 'You tapped picture ' + id + ', ' + oddWords(byId[id].f) + '. It matches the others. Look at each part: color, size, which way it faces, and the small details.', function (box) {
        var o = makeOdd(lv, 4, q.mode);
        box.appendChild(el('p', {}, 'You tapped picture ' + id + '. Here is another group like this one.'));
        box.appendChild(ctx.moviePanel(function () { return oddMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'Look closely at the first picture. Then check each of the others against it, one at a time. Here, ' + o.reason.charAt(0).toLowerCase() + o.reason.slice(1)));
      });
      refocus();
      armHint(hint, row);
    }, function (id) { return 'Picture ' + id + ': ' + oddWords(byId[id].f); }, cls));
    function hint() {
      if (ctx.solved()) return;
      r.hinted = true;
      glow(document.querySelector('#choices button[data-v="' + q.ans + '"]'));
      ctx.setSub('Here is a little clue. Look at the picture with the outline.');
    }
    armHint(hint, row);
  }

  /* ---------- 2. Spot the differences ---------- */
  function spot(area, ctx) {
    var lv = getLevel('spot'), q = makeSpot(lv), total = q.diffs.length, found = [];
    var r = { game: 'spot', level: lv, theme: q.theme, left: q.left, right: q.right, diffs: q.diffs, ans: q.diffs.map(function (d) { return d.slots[0]; }), found: found, wrong: 0, hinted: false };
    ctx.set(r);
    ctx.ask(area, total === 1 ? 'One thing changed in the second picture. Can you find it?' : total + ' things changed in the second picture. Can you find them?');
    var wrap = area.appendChild(el('div', { 'class': 'spot-wrap' }));
    var f1g = wrap.appendChild(el('figure', { 'class': 'pic-fig' }));
    f1g.appendChild(el('figcaption', {}, 'First picture'));
    var leftBox = f1g.appendChild(el('div', { 'class': 'pic', id: 'spot-left' }));
    var leftSvg = leftBox.appendChild(svgEl(sceneSvg(q.theme, q.left), '0 0 400 240', sceneLabel('First picture', q.theme, q.left)));
    leftBox.addEventListener('click', function () { if (!ctx.solved()) ctx.setSub('Tap the changes on the second picture.'); });
    var f2g = wrap.appendChild(el('figure', { 'class': 'pic-fig' }));
    f2g.appendChild(el('figcaption', {}, 'Second picture: tap what changed'));
    var rightBox = f2g.appendChild(el('div', { 'class': 'pic', id: 'spot-right', role: 'group', 'aria-label': 'Second picture' }));
    var rightSvg = rightBox.appendChild(svgEl(sceneSvg(q.theme, q.right), '0 0 400 240'));
    var counter = area.appendChild(el('p', { 'class': 'found-count', id: 'found-count' }, 'Found 0 of ' + total));
    // A button for every place that holds something in either picture, in reading order.
    var places = {};
    q.left.concat(q.right).forEach(function (p) { places[p.slot] = true; });
    var btns = {};
    Object.keys(places).map(Number).sort(function (a, b) { return a - b; }).forEach(function (s) {
      var p = q.right.filter(function (x) { return x.slot === s; })[0];
      var b = el('button', { type: 'button', 'class': 'spot', 'data-slot': String(s), style: 'left:' + (s % 5) * 20 + '%;top:' + f1(Math.floor(s / 5) * 100 / 3) + '%;width:20%;height:' + f1(100 / 3) + '%' });
      b.appendChild(el('span', { 'class': 'sr' }, place(s) + ': ' + (p ? partWords(p) : 'nothing here')));
      b.addEventListener('click', function () { tap(s, b, p); });
      rightBox.appendChild(b);
      btns[s] = b;
    });
    function addRings(d) {
      [leftSvg, rightSvg].forEach(function (svg) {
        var g = svg.querySelector('.rings');
        d.slots.forEach(function (s) {
          var xy = slotXY(s), c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('cx', xy[0]); c.setAttribute('cy', xy[1]); c.setAttribute('r', 37);
          c.setAttribute('fill', 'none'); c.setAttribute('stroke', RING); c.setAttribute('stroke-width', 5);
          g.appendChild(c);
        });
      });
    }
    function tap(s, b, p) {
      if (ctx.solved()) return;
      clearGlow();
      var d = q.diffs.filter(function (x) { return x.slots.indexOf(s) > -1; })[0];
      if (d && found.indexOf(d.id) > -1) { ctx.setSub('You found that one already. Look for another.'); armHint(hint, rightBox); return; }
      if (d) {
        found.push(d.id);
        addRings(d);
        d.slots.forEach(function (x) { var bb = btns[x]; bb.classList.add('found'); bb.classList.remove('missed'); var sr = bb.querySelector('.sr'); sr.textContent += ', found'; });
        counter.textContent = 'Found ' + found.length + ' of ' + total;
        if (found.length === total) {
          stopHint();
          var head = total === 1 ? 'Yes! You found it. ' : total === 2 ? 'Yes! You found both. ' : 'Yes! You found all ' + total + '. ';
          ctx.win(head + d.text + adjust('spot', r), head + d.text);
          return;
        }
        ctx.setSub('Yes! ' + d.text + ' Found ' + found.length + ' of ' + total + '.', 'yes');
        ctx.say('Yes! ' + d.text);
        armHint(hint, rightBox);
        return;
      }
      r.wrong++;
      b.classList.add('missed');
      var name = p ? 'the ' + kindName(p.kind) : 'that spot';
      ctx.miss(null, 'You tapped ' + name + '. It looks the same in both pictures. Look at one thing in the first picture, then find it in the second.', function (box) {
        var o = makeSpot(1);
        box.appendChild(el('p', {}, 'You tapped ' + name + '. Here are two more pictures with one change.'));
        box.appendChild(ctx.moviePanel(function () { return spotMovie(o); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'Look at one thing in the first picture. Then find it in the second picture. Is it the same color? The same size? Is it in the same place? Is it there at all? Here, ' + o.diffs[0].text.charAt(0).toLowerCase() + o.diffs[0].text.slice(1)));
      });
      armHint(hint, rightBox);
    }
    function hint() {
      if (ctx.solved()) return;
      var d = q.diffs.filter(function (x) { return found.indexOf(x.id) < 0; })[0];
      if (!d) return;
      r.hinted = true;
      glow(btns[d.slots[0]]);
      ctx.setSub('Here is a little clue. Look at the place with the outline.');
    }
    armHint(hint, rightBox);
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'What is different?', text: 'Two pictures can look almost the same. Look at one thing in the first picture, then find it in the second. Is it the same color? The same size? Is it still there?',
      movie: function () {
        var left = [{ kind: 'sun', color: 'yellow', size: 'big', slot: 1 }, { kind: 'tree', color: 'green', size: 'big', slot: 6 }, { kind: 'ball', color: 'red', size: 'big', slot: 13 }];
        var right = left.map(function (p) { return { kind: p.kind, color: p.kind === 'ball' ? 'blue' : p.color, size: p.size, slot: p.slot }; });
        return spotMovie({ theme: 'garden', left: left, right: right, diffs: [{ slots: [13], text: 'The ball is blue here, and red in the first picture.' }] });
      } },
    { title: 'Odd one out', text: 'In a group, most things match and one is different. Here three fish swim one way, and one fish swims the other way. That fish is the odd one out.',
      movie: function () {
        var f = { kind: 'fish', color: 'orange', size: 'big', facing: 1, stripes: 2, fin: true }, g = JSON.parse(JSON.stringify(f)); g.facing = -1;
        return oddMovie({ items: [f, f, g, f].map(function (x, i) { return { id: String(i + 1), f: x }; }), ans: '3', reason: 'This fish faces left. The others face right.' });
      } },
    { title: 'Small details', text: 'Sometimes the change is small: a missing pocket, one button fewer, or dots instead of stripes. Look slowly at each part of each picture.',
      movie: function () {
        var f = { kind: 'shirt', color: 'blue', size: 'big', pattern: 'stripes', buttons: 3, pocket: true }, g = JSON.parse(JSON.stringify(f)); g.buttons = 2;
        return oddMovie({ items: [f, f, f, g].map(function (x, i) { return { id: String(i + 1), f: x }; }), ans: '4', reason: 'This shirt has 2 buttons. The others have 3.' }, 1.6);
      } },
    { title: 'Spot the differences', text: 'Something can change color, change size, go missing, move to a new place, or appear. Tap each change on the second picture, and a ring shows you found it.',
      movie: function () {
        var left = [{ kind: 'cloud', color: 'white', size: 'big', slot: 0 }, { kind: 'sun', color: 'yellow', size: 'big', slot: 3 }, { kind: 'house', color: 'yellow', size: 'big', slot: 6 }, { kind: 'cat', color: 'orange', size: 'big', slot: 12 }, { kind: 'flower', color: 'red', size: 'big', slot: 9 }];
        var right = [{ kind: 'cloud', color: 'white', size: 'big', slot: 0 }, { kind: 'sun', color: 'yellow', size: 'small', slot: 3 }, { kind: 'house', color: 'blue', size: 'big', slot: 6 }, { kind: 'flower', color: 'red', size: 'big', slot: 9 }, { kind: 'ball', color: 'red', size: 'big', slot: 14 }];
        return spotMovie({ theme: 'garden', left: left, right: right, diffs: [{ slots: [6], text: 'The house is blue here, and yellow in the first picture.' }, { slots: [3], text: 'The sun is small here.' }, { slots: [12], text: 'The cat is missing.' }, { slots: [14], text: 'There is a new ball.' }] });
      } },
    { title: 'Take your time', text: 'There is no clock. If you wait a little, a soft outline shows one place to look. When you find things easily, the puzzles get a little trickier. When they feel hard, they get a bit easier.',
      movie: function () {
        var parts = [{ kind: 'apple', color: 'red', size: 'big', slot: 6 }, { kind: 'cup', color: 'blue', size: 'big', slot: 8 }, { kind: 'clock', color: 'yellow', size: 'big', slot: 2 }];
        return { svg: '<svg x="80" y="0" width="160" height="96" viewBox="0 0 400 240">' + sceneSvg('table', parts) + '<rect x="166" y="86" width="68" height="68" rx="10" fill="none" stroke="#9a4a00" stroke-width="5" stroke-dasharray="10 6"' + at(1) + '/></svg>', vb: '0 0 320 96',
          label: 'A kitchen table with an apple, a cup and a clock. A dashed outline appears around one place, as a clue.' };
      } }
  ];

  /* ---------- how the games fit the age ---------- */
  function $(id) { return document.getElementById(id); }
  function showLevel() {
    var a = age(), note = $('level-note');
    if (!note) return;
    var t = (a ? 'Set for age ' + a + ', from your child\'s profile: the puzzles start at level ' + startLevel(a) + ' of ' + MAX + '.'
      : 'No age picked, so the puzzles start in the middle, at level 2 of ' + MAX + '. A grown-up can pick an age on the Yaanstep Sprouts page.') +
      ' They get trickier when things are found easily, and easier after a few tries or a clue.';
    if (note.textContent !== t) note.textContent = t;
  }
  // Each round starts with the question in focus, so it is read first and Tab goes on to the pictures.
  function focusPrompt(fn) {
    return function (area, ctx) {
      stopHint();
      fn(area, ctx);
      var p = $('prompt');
      if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
    };
  }

  S.run({
    area: 'world',
    names: { learn: 'Learn to look closely', odd: 'Odd one out', spot: 'Spot the differences' },
    rounds: { spot: 6 },
    // Every drawing is needed to see which one is different; this page keeps groups to 3 itself with Fewer choices.
    allChoices: { odd: true },
    learn: LEARN,
    games: { odd: focusPrompt(odd), spot: focusPrompt(spot) },
    init: function () {
      showLevel();
      window.addEventListener('storage', showLevel);
      // Leaving a game stops the clue from waiting.
      ['exit', 'stop'].forEach(function (id) { var b = $(id); if (b) b.addEventListener('click', stopHint); });
    }
  });

  // Test hook: the level of each game, a clue at once (instead of waiting), and the makers and drawings the games use.
  window.YS_FIND = {
    level: function (g) { return levels[g] == null ? startLevel(age()) : levels[g]; },
    startLevel: startLevel, max: MAX, hintDelay: HINT_MS,
    hintNow: function () { if (hintFn) hintFn(); },
    sizes: ODD_N, changes: SPOT_DIFFS, parts: SPOT_PARTS,
    make: { odd: makeOdd, spot: makeSpot },
    art: { odd: oddArt, slot: slotArt }
  };
})();
