/* Yaanstep Sprouts: Opposites (ages 3 to 12; Manish, 23 Nov 2026: "Also add opposites along with the graphical
   representation. In between give the example of the words which are not properties, like Plastic. There is no
   opposite of word Plastic. Explain why like that." Later the same day he found the words too few, so the word games
   and the big word list in assets/opposites-words.js were added).
   Learn: a moving lesson in 5 parts. Picture games: Find the opposite, Opposites or not? (31 drawn pairs).
   Word games: Word opposites (a word read aloud, word tiles; 3 up to age 6, 4 from 7; 2 of 10 rounds have no opposite)
   and Make the opposite (un, dis, in, im, ir, il; for ages 7 and up). No word comes back in a visit until its list is used up.
   Some words have no opposite: words for what a thing is made of (plastic, wood, glass, paper, metal, wool) and
   names of things (apple, chair, dog, tree). About 1 round in 4 of Find the opposite is one of these, never two in a row.
   Each game fits the child's age from the profile ("ys-profile"), read only. Original drawings only.
   Nothing is stored or sent; points go to English through the shell. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle, cap = S.cap;
  var PICS = window.YS_PICTURES || {};
  var INK = '#17332c';

  function age() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'), a = p && +p.age; return a >= 3 && a <= 12 ? a : 0; } catch (e) { return 0; }
  }
  /** 0 for ages 3 and 4, 1 for 5 and 6 (and with no profile), 2 for 7 and up. */
  function level(a) { return !a ? 1 : a <= 4 ? 0 : a <= 6 ? 1 : 2; }
  /** Picture choices in Find the opposite: 3, or 4 from age 6. */
  function choiceCount(a) { return a >= 6 ? 4 : 3; }
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }
  function an(w) { return (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w; }
  function inBox(svg, x, y, w) { return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" viewBox="0 0 64 64">' + svg + '</svg>'; }
  function scaledPic(k, s) { return '<g transform="translate(' + (32 - 32 * s) + ' ' + (62 - 64 * s) + ') scale(' + s + ')">' + (PICS[k] || '') + '</g>'; }

  /* ---------- our own drawings (64 x 64) ---------- */
  var glass = '<path d="M16 8h32l-4 50H20z" fill="#eef7fc" stroke="#3a8fd6" stroke-width="2"/>';
  var shirt = function (fill, stroke) { return '<path d="M22 8L8 16l6 12 6-3v31h24V25l6 3 6-12-14-8q-10 8-20 0z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"/>'; };
  var face = function (mouth) { return '<circle cx="32" cy="32" r="26" fill="#f7c948" stroke="' + INK + '" stroke-width="2"/><circle cx="23" cy="26" r="3" fill="' + INK + '"/><circle cx="41" cy="26" r="3" fill="' + INK + '"/>' + mouth; };
  var plate = '<circle cx="32" cy="34" r="26" fill="#fff" stroke="#6f8796" stroke-width="2"/><circle cx="32" cy="34" r="17" fill="#f1f7f5" stroke="#c6e3da" stroke-width="2"/>';
  var sparkle = function (x, y, r) { return '<path d="M' + x + ' ' + (y - r) + 'q1 ' + (r - 1) + ' ' + r + ' ' + r + 'q-' + (r - 1) + ' 1-' + r + ' ' + r + 'q-1-' + (r - 1) + '-' + r + '-' + r + 'q' + (r - 1) + '-1 ' + r + '-' + r + 'z" fill="#f2c230" stroke="#a87800" stroke-width="1"/>'; };
  var bulb = function (fill, stroke) { return '<path d="M32 6a16 16 0 0 0-9 29v8h18v-8a16 16 0 0 0-9-29z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/><rect x="24" y="44" width="16" height="8" rx="2" fill="#8a989c"/><path d="M28 57h8" stroke="#8a989c" stroke-width="3" stroke-linecap="round"/>'; };
  var door = '<path d="M6 61h52" stroke="#8aa49b" stroke-width="2"/>';
  var box = function (front) { return '<path d="M10 30l6-8h32l6 8" fill="#a8743f" stroke="' + INK + '" stroke-width="2"/>' + front; };
  function tower(n) { var o = ''; for (var i = 0; i < n; i++) o += '<rect x="23" y="' + (52 - i * 9) + '" width="18" height="8" rx="2" fill="#e8812a" stroke="' + INK + '" stroke-width="1.5"/>'; return o + '<path d="M8 61h48" stroke="#8aa49b" stroke-width="2"/>'; }
  function pencil(x1, x2) { return '<rect x="' + (x1 + 9) + '" y="26" width="' + (x2 - x1 - 16) + '" height="12" fill="#f7c948" stroke="#a87800" stroke-width="2"/><path d="M' + (x1 + 9) + ' 26L' + x1 + ' 32l' + 9 + ' 6z" fill="#f3dcc0" stroke="#a87800" stroke-width="2" stroke-linejoin="round"/><path d="M' + x1 + ' 32l3-1.5v3z" fill="' + INK + '"/><rect x="' + (x2 - 7) + '" y="26" width="7" height="12" rx="2" fill="#f4a3b6" stroke="#a87800" stroke-width="2"/>'; }
  function table() { return '<rect x="8" y="30" width="48" height="6" rx="2" fill="#a8743f" stroke="' + INK + '" stroke-width="2"/><path d="M14 36v24M50 36v24" stroke="#8a5a33" stroke-width="4" stroke-linecap="round"/>'; }
  var sky = '<rect x="2" y="2" width="60" height="60" rx="8" fill="#bfe3f7"/><rect x="2" y="54" width="60" height="8" rx="3" fill="#4fb36a"/>';
  function bird(x, y) { return '<path d="M' + (x - 15) + ' ' + y + 'q7.5-10 15 0q7.5-10 15 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function shelves(cy) { return '<rect x="12" y="6" width="40" height="54" fill="#c9965a" stroke="#8a5a33" stroke-width="2"/><path d="M12 24h40M12 42h40" stroke="#8a5a33" stroke-width="2"/><circle cx="32" cy="' + cy + '" r="6" fill="#d6453d" stroke="' + INK + '" stroke-width="1.5"/>'; }
  function dots(xy) { return xy.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6.5" fill="#d6453d" stroke="' + INK + '" stroke-width="1.5"/>'; }).join(''); }
  function lights(lit) {
    var on = ['#e23b2e', '#f2c230', '#2fbf5a'], o = '<rect x="20" y="4" width="24" height="56" rx="6" fill="#33413d" stroke="' + INK + '" stroke-width="2"/>';
    for (var i = 0; i < 3; i++) o += '<circle cx="32" cy="' + (16 + i * 16) + '" r="6" fill="' + (i === lit ? on[i] : '#6b7772') + '"' + (i === lit ? ' stroke="#fff" stroke-width="2"' : '') + '/>';
    return o;
  }
  var water = '<rect x="6" y="18" width="52" height="42" rx="3" fill="#cfeefb" stroke="#3a8fd6" stroke-width="2"/><path d="M6 28h52" stroke="#3a8fd6" stroke-width="2"/>';
  function arrow(up) {
    return up ? '<circle cx="32" cy="12" r="9" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M32 60V28M20 38l12-12 12 12" stroke="#1F7A6D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<circle cx="32" cy="52" r="9" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M32 4v32M20 26l12 12 12-12" stroke="#1F7A6D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  /** Every word: what it says, its picture, and what the picture shows (for screen readers). */
  var W = {
    big: { w: 'big', art: scaledPic('ball', 0.95), pic: 'a big ball' },
    small: { w: 'small', art: scaledPic('ball', 0.34), pic: 'a small ball' },
    hot: { w: 'hot', art: '<path d="M14 26h30v22a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z" fill="#d6453d" stroke="#8f2a24" stroke-width="2"/><path d="M44 32h4a6 6 0 0 1 0 12h-4" stroke="#8f2a24" stroke-width="3.5" fill="none"/><path d="M22 20q-4-4 0-8t0-8M30 20q-4-4 0-8t0-8M38 20q-4-4 0-8t0-8" stroke="#e8781f" stroke-width="2.5" fill="none" stroke-linecap="round"/>', pic: 'a hot drink with steam' },
    cold: { w: 'cold', art: '<rect x="8" y="24" width="34" height="34" rx="6" fill="#cfeefb" stroke="#3a8fd6" stroke-width="2"/><path d="M14 31h8M14 31v8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><g stroke="#3a8fd6" stroke-width="2.5" stroke-linecap="round"><path d="M50 4v20M41 9l18 10M41 19l18-10"/></g>', pic: 'an ice cube and a snowflake' },
    full: { w: 'full', art: glass + '<path d="M16.8 12H47.2L44.1 57H19.9z" fill="#5aaee8"/>', pic: 'a full glass of water' },
    empty: { w: 'empty', art: glass + '<path d="M22 14l2 36" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', pic: 'an empty glass' },
    tall: { w: 'tall', art: tower(6), pic: 'a tall tower of blocks' },
    'short-h': { w: 'short', art: tower(2), pic: 'a short tower of blocks' },
    long: { w: 'long', art: pencil(2, 62), pic: 'a long pencil' },
    'short-l': { w: 'short', art: pencil(20, 44), pic: 'a short pencil' },
    fast: { w: 'fast', art: '<g transform="translate(12 8) scale(.8)">' + (PICS.car || '') + '</g><path d="M2 28h12M0 36h10M4 44h10" stroke="#51675f" stroke-width="3" stroke-linecap="round"/>', pic: 'a fast car' },
    slow: { w: 'slow', art: '<path d="M6 56q0-8 8-8h38q8 0 8 8z" fill="#c9a37a" stroke="#8a6a4a" stroke-width="2"/><path d="M11 44l-3-10M15 44l2-10" stroke="#8a6a4a" stroke-width="2"/><circle cx="8" cy="33" r="2.4" fill="' + INK + '"/><circle cx="17" cy="33" r="2.4" fill="' + INK + '"/><circle cx="13" cy="48" r="6" fill="#c9a37a"/><circle cx="38" cy="36" r="15" fill="#e8a24a" stroke="#8a5a33" stroke-width="2"/><path d="M38 36a3 3 0 0 1 6 0a6 6 0 0 1-12 0a9 9 0 0 1 18 0" stroke="#8a5a33" stroke-width="2" fill="none"/>', pic: 'a slow snail' },
    happy: { w: 'happy', art: face('<path d="M20 38q12 12 24 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>'), pic: 'a happy face' },
    sad: { w: 'sad', art: face('<path d="M20 47q12-10 24 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M22 32q-3 5 0 7q3-2 0-7z" fill="#3a8fd6"/>'), pic: 'a sad face' },
    up: { w: 'up', art: arrow(true), pic: 'a ball at the top of an arrow pointing up' },
    down: { w: 'down', art: arrow(false), pic: 'a ball at the bottom of an arrow pointing down' },
    open: { w: 'open', art: door + '<rect x="18" y="6" width="34" height="54" fill="#f7e7b4" stroke="' + INK + '" stroke-width="2"/><path d="M18 6L6 11v52l12-3z" fill="#8a5a33" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><circle cx="10" cy="36" r="2" fill="#f2c230"/>', pic: 'an open door' },
    closed: { w: 'closed', art: door + '<rect x="18" y="6" width="34" height="54" rx="2" fill="#8a5a33" stroke="' + INK + '" stroke-width="2"/><rect x="23" y="12" width="24" height="18" rx="2" fill="#a8743f"/><rect x="23" y="34" width="24" height="20" rx="2" fill="#a8743f"/><circle cx="45" cy="34" r="2.6" fill="#f2c230"/>', pic: 'a closed door' },
    wet: { w: 'wet', art: shirt('#3a8fd6', '#1f4f99') + '<g fill="#3a8fd6" stroke="#1f4f99" stroke-width="1"><path d="M8 36q-3 5 0 7q3-2 0-7z"/><path d="M56 38q-3 5 0 7q3-2 0-7z"/><path d="M26 58q-2 3 0 5q2-2 0-5z"/><path d="M38 58q-2 3 0 5q2-2 0-5z"/></g>', pic: 'a wet shirt, dripping' },
    dry: { w: 'dry', art: shirt('#f3dcc0', '#a8743f') + '<circle cx="56" cy="6" r="5" fill="#f7c948" stroke="#e8a21c" stroke-width="1.5"/>', pic: 'a dry shirt in the sun' },
    day: { w: 'day', art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#bfe3f7"/><rect x="2" y="46" width="60" height="16" rx="4" fill="#4fb36a"/><circle cx="32" cy="24" r="11" fill="#f7c948" stroke="#e8a21c" stroke-width="2"/>', pic: 'the sun in a blue sky' },
    night: { w: 'night', art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#1d2b4f"/><rect x="2" y="46" width="60" height="16" rx="4" fill="#24553a"/><path d="M38 10A14 14 0 1 0 38 38A17 17 0 0 1 38 10z" fill="#f2d675"/><g fill="#fff"><circle cx="12" cy="12" r="1.6"/><circle cx="52" cy="16" r="1.6"/><circle cx="18" cy="32" r="1.4"/><circle cx="54" cy="34" r="1.4"/></g>', pic: 'the moon and stars in a dark sky' },
    heavy: { w: 'heavy', art: '<path d="M4 60h56" stroke="#8aa49b" stroke-width="2"/><path d="M8 59c-4-14 6-30 22-32 16-2 28 8 28 22 0 6-2 10-6 10z" fill="#8e9aa6" stroke="#5b6670" stroke-width="2"/><path d="M24 36l6 6M40 34l-4 8" stroke="#5b6670" stroke-width="2"/>', pic: 'a big heavy rock' },
    light: { w: 'light', art: '<path d="M12 56C20 30 36 12 56 8 52 28 36 46 12 56z" fill="#e6f0f7" stroke="#6f8796" stroke-width="2"/><path d="M12 56L50 14" stroke="#6f8796" stroke-width="2"/>', pic: 'a light feather' },
    loud: { w: 'loud', art: '<path d="M8 30v20a16 6 0 0 0 32 0V30" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M8 34l8 12 8-12 8 12 8-12" stroke="#fff" stroke-width="2" fill="none"/><ellipse cx="24" cy="30" rx="16" ry="6" fill="#f3dcc0" stroke="' + INK + '" stroke-width="2"/><path d="M46 20q5 6 0 12M51 15q9 11 0 22M56 10q12 16 0 32" stroke="#e8781f" stroke-width="2.5" fill="none" stroke-linecap="round"/>', pic: 'a loud drum' },
    quiet: { w: 'quiet', art: '<path d="M50 50q10 4 4 10" stroke="#a8743f" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="48" rx="22" ry="11" fill="#f0b05a" stroke="#a8743f" stroke-width="2"/><polygon points="10,38 11,28 17,34" fill="#f0b05a" stroke="#a8743f" stroke-width="1.5"/><polygon points="19,34 25,28 25,38" fill="#f0b05a" stroke="#a8743f" stroke-width="1.5"/><circle cx="17" cy="44" r="10" fill="#f0b05a" stroke="#a8743f" stroke-width="2"/><path d="M11 44q2 2 4 0M19 44q2 2 4 0" stroke="' + INK + '" stroke-width="1.5" fill="none"/><text x="40" y="26" font-size="13" font-weight="700" fill="#2f6fbf">z</text><text x="49" y="16" font-size="10" font-weight="700" fill="#2f6fbf">z</text>', pic: 'a quiet cat, asleep' },
    'in': { w: 'in', art: box('<circle cx="32" cy="28" r="10" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M10 30h44v28H10z" fill="#c9965a" stroke="' + INK + '" stroke-width="2"/>'), pic: 'a ball in a box' },
    out: { w: 'out', art: '<path d="M6 30l6-8h20l6 8" fill="#a8743f" stroke="' + INK + '" stroke-width="2"/><path d="M6 30h32v28H6z" fill="#c9965a" stroke="' + INK + '" stroke-width="2"/><circle cx="51" cy="49" r="9" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/>', pic: 'a ball out of the box' },
    old: { w: 'old', art: '<rect x="8" y="10" width="48" height="44" rx="4" fill="#a08870" stroke="#6b5a48" stroke-width="2"/><rect x="14" y="10" width="42" height="40" fill="#e8dcc0"/><polygon points="44,10 56,10 56,22" fill="#fff" stroke="#6b5a48" stroke-width="1.5"/><rect x="22" y="26" width="14" height="12" fill="#c9b28a" stroke="#6b5a48" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M40 40l6 6M20 44l4-3" stroke="#6b5a48" stroke-width="1.5"/>', pic: 'an old book, torn and patched' },
    'new': { w: 'new', art: '<g transform="translate(4 8) scale(.84)">' + (PICS.book || '') + '</g>' + sparkle(56, 10, 6) + sparkle(10, 56, 5), pic: 'a new shiny book' },
    clean: { w: 'clean', art: plate + sparkle(50, 14, 6) + sparkle(20, 40, 4), pic: 'a clean plate' },
    dirty: { w: 'dirty', art: plate + '<g fill="#8a5a33"><circle cx="24" cy="30" r="4"/><ellipse cx="40" cy="40" rx="6" ry="3.5"/><circle cx="36" cy="24" r="2.5"/><circle cx="20" cy="44" r="3"/><circle cx="46" cy="28" r="2"/></g>', pic: 'a dirty plate' },
    on: { w: 'on', art: bulb('#f7d34a', '#a87800') + '<g stroke="#e8a21c" stroke-width="3" stroke-linecap="round"><path d="M4 22h6M54 22h6M9 6l5 4M55 6l-5 4"/></g>', pic: 'a light bulb that is on' },
    off: { w: 'off', art: bulb('#e4e8ea', '#8a989c'), pic: 'a light bulb that is off' },
    /* 23 Nov 2026: 14 more picture pairs, so the youngest have more to play with. */
    awake: { w: 'awake', art: '<circle cx="32" cy="32" r="26" fill="#f7c948" stroke="' + INK + '" stroke-width="2"/><circle cx="23" cy="27" r="6.5" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/><circle cx="41" cy="27" r="6.5" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/><circle cx="23" cy="27" r="3" fill="' + INK + '"/><circle cx="41" cy="27" r="3" fill="' + INK + '"/><circle cx="32" cy="44" r="4" fill="#8f2a24"/>', pic: 'a face with eyes wide open' },
    asleep: { w: 'asleep', art: '<circle cx="30" cy="34" r="25" fill="#f7c948" stroke="' + INK + '" stroke-width="2"/><path d="M15 31q6 5 12 0M33 31q6 5 12 0" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M25 45q5 3 10 0" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="47" y="15" font-size="13" font-weight="700" fill="#2f6fbf">z</text><text x="55" y="7" font-size="9" font-weight="700" fill="#2f6fbf">z</text>', pic: 'a face with eyes closed, asleep' },
    thick: { w: 'thick', art: door + '<rect x="12" y="10" width="40" height="50" rx="3" fill="#2f6fbf" stroke="' + INK + '" stroke-width="2"/><path d="M17 14v42M47 14v42" stroke="#bcd3f0" stroke-width="2"/><rect x="22" y="22" width="20" height="8" rx="1" fill="#f7c948"/>', pic: 'a thick book' },
    thin: { w: 'thin', art: door + '<rect x="28" y="10" width="8" height="50" rx="2" fill="#2f6fbf" stroke="' + INK + '" stroke-width="2"/><rect x="30" y="22" width="4" height="8" fill="#f7c948"/>', pic: 'a thin book' },
    over: { w: 'over', art: door + table() + '<circle cx="32" cy="16" r="9" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/>', pic: 'a ball over a table' },
    under: { w: 'under', art: door + table() + '<circle cx="32" cy="51" r="9" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/>', pic: 'a ball under a table' },
    sweet: { w: 'sweet', art: '<path d="M16 34h32l-5 24H21z" fill="#f4a3b6" stroke="#a8436a" stroke-width="2"/><path d="M22 36l2 20M32 36v20M42 36l-2 20" stroke="#a8436a" stroke-width="1.2" opacity=".6"/><path d="M12 35q0-16 20-18q20 2 20 18z" fill="#fff4e0" stroke="#a87800" stroke-width="2"/><circle cx="32" cy="12" r="5" fill="#d6453d" stroke="#8f2a24" stroke-width="1.5"/><g fill="#2f6fbf"><rect x="20" y="26" width="4" height="2" rx="1"/><rect x="36" y="23" width="4" height="2" rx="1"/><rect x="42" y="29" width="4" height="2" rx="1"/></g>', pic: 'a sweet cupcake' },
    sour: { w: 'sour', art: '<path d="M40 19q6-9 14-7" stroke="#3f9d4a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="24" ry="17" fill="#f7e04a" stroke="#a89000" stroke-width="2"/><path d="M8 36H4M56 36h4" stroke="#a89000" stroke-width="3" stroke-linecap="round"/><path d="M20 30q4-3 8 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>', pic: 'a sour lemon' },
    straight: { w: 'straight', art: '<path d="M8 56L56 8" stroke="#e8812a" stroke-width="7" stroke-linecap="round"/>', pic: 'a straight line' },
    curved: { w: 'curved', art: '<path d="M8 54Q32-6 56 54" stroke="#e8812a" stroke-width="7" fill="none" stroke-linecap="round"/>', pic: 'a curved line' },
    high: { w: 'high', art: sky + bird(32, 14), pic: 'a bird flying high in the sky' },
    low: { w: 'low', art: sky + bird(32, 48), pic: 'a bird flying low, near the grass' },
    hard: { w: 'hard', art: '<rect x="6" y="22" width="52" height="26" rx="2" fill="#c0563b" stroke="#7a2e1d" stroke-width="2"/><path d="M6 35h52M24 22v13M42 35v13" stroke="#7a2e1d" stroke-width="1.5"/>', pic: 'a hard brick' },
    soft: { w: 'soft', art: '<path d="M10 20q22-8 44 0q4 14 0 28q-22 8-44 0q-4-14 0-28z" fill="#e6f0f7" stroke="#6f8796" stroke-width="2"/><path d="M18 28q14 6 28 0M18 40q14-6 28 0" stroke="#b8c8d4" stroke-width="2" fill="none"/>', pic: 'a soft pillow' },
    top: { w: 'top', art: shelves(18), pic: 'a ball on the top shelf' },
    bottom: { w: 'bottom', art: shelves(54), pic: 'a ball on the bottom shelf' },
    many: { w: 'many', art: dots([[12, 12], [32, 12], [52, 12], [12, 32], [32, 32], [52, 32], [12, 52], [32, 52], [52, 52], [22, 22], [42, 22], [22, 42], [42, 42]]), pic: 'many red dots' },
    few: { w: 'few', art: dots([[22, 34], [42, 34]]), pic: 'a few red dots' },
    same: { w: 'same', art: '<polygon points="16,14 28,40 4,40" fill="#3f9d4a" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><polygon points="48,14 60,40 36,40" fill="#3f9d4a" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M4 54h56" stroke="#8aa49b" stroke-width="2"/>', pic: 'two green triangles that are the same' },
    different: { w: 'different', art: '<polygon points="16,14 28,40 4,40" fill="#3f9d4a" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><circle cx="48" cy="28" r="12" fill="#e8812a" stroke="' + INK + '" stroke-width="2"/><path d="M4 54h56" stroke="#8aa49b" stroke-width="2"/>', pic: 'a green triangle and an orange circle that are different' },
    left: { w: 'left', art: '<circle cx="10" cy="32" r="8" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M60 32H26M36 20L24 32l12 12" stroke="#1F7A6D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', pic: 'an arrow pointing left to a ball' },
    right: { w: 'right', art: '<circle cx="54" cy="32" r="8" fill="#d6453d" stroke="' + INK + '" stroke-width="2"/><path d="M4 32h34M28 20l12 12-12 12" stroke="#1F7A6D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', pic: 'an arrow pointing right to a ball' },
    stop: { w: 'stop', art: lights(0), pic: 'a traffic light with the top red light on' },
    go: { w: 'go', art: lights(2), pic: 'a traffic light with the bottom green light on' },
    narrow: { w: 'narrow', art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#bfe3a7"/><rect x="27" y="2" width="10" height="60" fill="#c9b28a" stroke="#8a6a4a" stroke-width="1.5"/>', pic: 'a narrow path through the grass' },
    wide: { w: 'wide', art: '<rect x="2" y="2" width="60" height="60" rx="8" fill="#bfe3a7"/><rect x="10" y="2" width="44" height="60" fill="#8e9aa6" stroke="#5b6670" stroke-width="1.5"/><path d="M32 6v10M32 26v10M32 46v10" stroke="#fff" stroke-width="3"/>', pic: 'a wide road through the grass' },
    float: { w: 'float', art: water + '<path d="M18 21h28l-5 8H23z" fill="#d6453d" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M32 21V6l10 11z" fill="#fff" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>', pic: 'a toy boat floating on the water' },
    sink: { w: 'sink', art: water + '<ellipse cx="32" cy="53" rx="12" ry="6" fill="#8e9aa6" stroke="#5b6670" stroke-width="2"/><circle cx="30" cy="40" r="2" fill="none" stroke="#3a8fd6" stroke-width="1.5"/><circle cx="35" cy="33" r="1.6" fill="none" stroke="#3a8fd6" stroke-width="1.5"/>', pic: 'a stone sinking to the bottom of the water' }
  };
  var PAIRS = [['big', 'small'], ['hot', 'cold'], ['full', 'empty'], ['tall', 'short-h'], ['fast', 'slow'], ['happy', 'sad'], ['up', 'down'], ['open', 'closed'], ['wet', 'dry'],
    ['day', 'night'], ['long', 'short-l'], ['heavy', 'light'], ['loud', 'quiet'], ['in', 'out'], ['old', 'new'], ['clean', 'dirty'], ['on', 'off'],
    ['awake', 'asleep'], ['thick', 'thin'], ['over', 'under'], ['sweet', 'sour'], ['straight', 'curved'], ['high', 'low'], ['hard', 'soft'],
    ['top', 'bottom'], ['many', 'few'], ['same', 'different'], ['left', 'right'], ['stop', 'go'], ['narrow', 'wide'], ['float', 'sink']];
  /** What each picture pair is about. Words that share one are never choices together, so a round has one right answer
      and never offers a word that means nearly the same as the answer (high and up, soft and quiet, few and empty). */
  var PSENSE = { big: 'size', hot: 'temp', full: 'full', tall: 'height', fast: 'speed move', happy: 'happy', up: 'vert', open: 'open', wet: 'wet',
    day: 'day light sleep', long: 'length', heavy: 'weight', loud: 'vol sleep', 'in': 'inout', old: 'age', clean: 'clean', on: 'light',
    awake: 'sleep', thick: 'width size', over: 'vert', sweet: 'taste', straight: 'straight', high: 'vert height', hard: 'hard vol',
    top: 'vert', many: 'more full', same: 'same', left: 'left', stop: 'move', narrow: 'width size', float: 'vert' };
  /** Ages 3 and 4 start with the pairs that are easiest to see. */
  var EASY = ['big', 'hot', 'full', 'happy', 'up', 'open', 'wet', 'day', 'in', 'on', 'fast', 'awake', 'over', 'sweet', 'hard', 'stop', 'many'];
  var OPP = {}, SENSES = {};
  PAIRS.forEach(function (p) {
    OPP[p[0]] = p[1]; OPP[p[1]] = p[0];
    p.forEach(function (id) { SENSES[id] = PSENSE[p[0]].split(' '); });
  });
  /** Senses of a word by what it says ("short" is about height and length). */
  function sensesOf(word) {
    var out = [];
    Object.keys(W).forEach(function (id) { if (W[id].w === word) SENSES[id].forEach(function (s) { if (out.indexOf(s) < 0) out.push(s); }); });
    return out;
  }
  /** The words each word is the opposite of, by what they say: "short" has two (tall and long). */
  function oppWords(word) {
    var out = [];
    Object.keys(OPP).forEach(function (id) { if (W[id].w === word && out.indexOf(W[OPP[id]].w) < 0) out.push(W[OPP[id]].w); });
    return out;
  }

  /* ---------- words with no opposite: what a thing is made of, and names of things ---------- */
  var NONE = {
    plastic: { kind: 'made', thing: 'cup', art: '<rect x="14" y="8" width="36" height="5" rx="2" fill="#7fd6cc" stroke="#1F7A6D" stroke-width="2"/><path d="M16 13h32l-5 45H21z" fill="#4fc1b5" stroke="#1F7A6D" stroke-width="2"/><path d="M18 22h28M19 32h26M20 42h24" stroke="#1F7A6D" stroke-width="1.5" opacity=".6"/>', pic: 'a plastic cup' },
    wood: { kind: 'made', thing: 'block', art: '<rect x="8" y="18" width="48" height="34" rx="3" fill="#c9965a" stroke="#8a5a33" stroke-width="2"/><path d="M12 26q20-4 40 0M12 34q18 4 40-2M12 44q20-3 40 1" stroke="#8a5a33" stroke-width="1.5" fill="none"/><ellipse cx="42" cy="37" rx="4" ry="2.5" fill="none" stroke="#8a5a33" stroke-width="1.5"/>', pic: 'a wooden block' },
    glass: { kind: 'made', thing: 'jar', art: '<rect x="16" y="16" width="32" height="42" rx="7" fill="#e6f4fa" stroke="#6fa9c9" stroke-width="2"/><rect x="18" y="8" width="28" height="9" rx="2" fill="#9aa9b0" stroke="#6b7a80" stroke-width="2"/><path d="M22 24v24" stroke="#fff" stroke-width="4" stroke-linecap="round"/>', pic: 'a glass jar' },
    paper: { kind: 'made', thing: 'plane', art: '<path d="M4 30L60 10 36 54 28 38z" fill="#fff" stroke="#6f8796" stroke-width="2" stroke-linejoin="round"/><path d="M28 38L60 10" stroke="#6f8796" stroke-width="2"/>', pic: 'a paper plane' },
    metal: { kind: 'made', thing: 'key', art: '<circle cx="18" cy="32" r="11" fill="none" stroke="#8a989c" stroke-width="6"/><path d="M29 32h28M51 32v10M43 32v8" stroke="#8a989c" stroke-width="6" stroke-linecap="round"/>', pic: 'a metal key' },
    wool: { kind: 'made', thing: 'hat', art: '<path d="M10 46a22 26 0 0 1 44 0z" fill="#d6453d" stroke="#8f2a24" stroke-width="2"/><path d="M20 30v14M28 24v20M36 24v20M44 30v14" stroke="#8f2a24" stroke-width="1.5" opacity=".5"/><rect x="8" y="44" width="48" height="12" rx="4" fill="#f7c948" stroke="#a87800" stroke-width="2"/><circle cx="32" cy="16" r="7" fill="#f7c948" stroke="#a87800" stroke-width="2"/>', pic: 'a wool hat' },
    apple: { kind: 'thing', can: 'big or small', art: PICS.apple || '', pic: 'an apple' },
    chair: { kind: 'thing', can: 'old or new', art: PICS.chair || '', pic: 'a chair' },
    dog: { kind: 'thing', can: 'happy or sad', art: PICS.dog || '', pic: 'a dog' },
    tree: { kind: 'thing', can: 'tall or short', art: PICS.tree || '', pic: 'a tree' }
  };
  var NONE_EASY = ['plastic', 'wood', 'apple', 'chair', 'dog', 'tree'];
  /** Why a word has no opposite, in the words the brief asks for. */
  function whyNone(k) {
    var n = NONE[k];
    if (n.kind === 'made') return cap(k) + ' tells us what the ' + n.thing + ' is made of. It is not a way the ' + n.thing + ' can be, like hot or cold, so it has no opposite.';
    return cap(k) + ' is the name of a thing. It tells us what something is, not how it is. ' + cap(an(k)) + ' can be ' + n.can + ', but the word ' + k + ' has no opposite.';
  }
  function label(id) { return id === 'none' ? 'No opposite!' : W[id] ? W[id].w : id; }
  function artOf(id) { return W[id] ? W[id].art : NONE[id] ? NONE[id].art : ''; }
  function picOf(id) { return W[id] ? W[id].pic : NONE[id] ? NONE[id].pic : ''; }

  /* ---------- making a round of Find the opposite ---------- */
  /** Wrong choices: words that are not the word, not its opposite, and not the same word as any other choice. */
  function wrongWords(word, n, lv) {
    var said = [word === 'none' ? '' : label(word)], bad = W[word] ? oppWords(W[word].w) : [];
    // Never a word about the same thing as the word or its opposite (no second right answer, no near-twin of the answer).
    var banned = [];
    if (W[word]) [W[word].w].concat(bad).forEach(function (w) { banned = banned.concat(sensesOf(w)); });
    var pool = shuffle(Object.keys(W).filter(function (id) { return lv > 0 || EASY.indexOf(id) > -1 || EASY.indexOf(OPP[id]) > -1; })), out = [];
    pool.forEach(function (id) {
      var w = W[id].w;
      if (out.length >= n || id === word || said.indexOf(w) > -1 || bad.indexOf(w) > -1) return;
      if (sensesOf(w).some(function (s) { return banned.indexOf(s) > -1; })) return;
      out.push(id); said.push(w);
    });
    return out;
  }
  /** A word with an opposite (kind "pair"), or one with none (kind "none"). withNone offers the "No opposite!" tile in a pair round. */
  function makeFind(lv, n, kind, word, withNone) {
    if (kind === 'none') {
      var nk = word || (lv === 0 ? NONE_EASY : Object.keys(NONE))[rnd(lv === 0 ? NONE_EASY.length : Object.keys(NONE).length)];
      var pics = wrongWords(nk, n, lv);
      return { game: 'find', kind: 'none', word: nk, label: nk, choices: shuffle(pics).concat(['none']), ans: 'none', why: whyNone(nk) };
    }
    var ids = Object.keys(OPP).filter(function (id) { return lv > 0 || EASY.indexOf(id) > -1 || EASY.indexOf(OPP[id]) > -1; });
    var wd = word || ids[rnd(ids.length)], right = OPP[wd];
    var ch = shuffle([right].concat(wrongWords(wd, n - 1, lv).filter(function (id) { return W[id].w !== W[right].w; }).slice(0, n - 1)));
    if (withNone) ch.push('none');
    return { game: 'find', kind: 'pair', word: wd, label: W[wd].w, choices: ch, ans: right };
  }
  /** Which rounds of a game have no opposite: 2 of rounds 2 to 8 (about 1 in 4), never two in a row, never the first. */
  function planNone(total) {
    var r;
    do { r = shuffle(Array.apply(null, Array(total - 1)).map(function (x, i) { return i + 1; })).slice(0, 2).sort(function (a, b) { return a - b; }); } while (r[1] - r[0] < 2);
    return r;
  }

  /* ---------- no repeats within a visit: each game keeps its own list of what it has asked (in memory only) ---------- */
  var USED = {}, LAST = {};
  /** A pick from list that this game has not asked yet in this visit. Once the list is used up it starts again (never the last one twice). */
  function freshIn(key, list) {
    var u = USED[key] = USED[key] || {};
    var pool = list.filter(function (x) { return !u[x]; });
    if (!pool.length) {
      u = USED[key] = {};
      pool = list.filter(function (x) { return x !== LAST[key]; });
      if (!pool.length) pool = list.slice();
    }
    var pick = pool[rnd(pool.length)];
    u[pick] = 1; LAST[key] = pick;
    return pick;
  }

  /* ---------- pictures for the lesson and the games ---------- */
  function pairMovie(a, b) {
    // A word and its opposite, with an arrow both ways between them.
    var out = '<g' + at(0.2) + '>' + inBox(artOf(a), 14, 6, 84) + '<text x="56" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="' + INK + '">' + label(a) + '</text></g>';
    out += '<g' + at(1.6) + '>' + inBox(artOf(b), 222, 6, 84) + '<text x="264" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="' + INK + '">' + label(b) + '</text></g>';
    out += '<g' + at(0.9) + '><path d="M112 48h96M122 38l-10 10 10 10M198 38l10 10-10 10" stroke="#1F7A6D" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="#1b7a3d">opposites</text></g>';
    return { svg: out, vb: '0 0 320 120', label: cap(picOf(a)) + ', and ' + picOf(b) + '. An arrow both ways joins them: ' + label(a) + ' and ' + label(b) + ' are opposites.' };
  }
  function noneMovie(k) {
    // The thing, then a label saying what it is (or what it is made of), and a crossed-out arrow: no opposite.
    var n = NONE[k], out = '<g' + at(0.2) + '>' + inBox(n.art, 14, 6, 84) + '<text x="56" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="' + INK + '">' + k + '</text></g>';
    out += '<g' + at(1.0) + '><path d="M112 48h80M122 38l-10 10 10 10M182 38l10 10-10 10" stroke="#8aa49b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 30l24 36M164 30l-24 36" stroke="#C2410C" stroke-width="5" stroke-linecap="round"/></g>';
    out += '<g' + at(1.8) + '><rect x="200" y="24" width="112" height="48" rx="10" fill="#fff7e0" stroke="#b07d00" stroke-width="2"/><text x="256" y="54" text-anchor="middle" font-size="16" font-weight="800" fill="' + INK + '">No opposite!</text></g>';
    out += '<text x="256" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#7a5a00"' + at(2.4) + '>' + (n.kind === 'made' ? 'what it is made of' : 'what it is') + '</text>';
    return { svg: out, vb: '0 0 320 120', label: cap(n.pic) + ', with the word ' + k + '. An arrow to an opposite is crossed out, and a card says: No opposite!' };
  }
  function wordCard(id) {
    var c = el('div', { 'class': 'wordcard', id: 'word' });
    c.appendChild(svgEl(artOf(id), '0 0 64 64', cap(picOf(id))));
    c.appendChild(el('b', {}, label(id)));
    return c;
  }
  function tileLook(id) {
    if (id === 'none') return el('span', { 'class': 'wordtile' }, 'No opposite!');
    var b = el('span', { 'class': 'pic' });
    b.appendChild(svgEl(artOf(id), '0 0 64 64'));
    b.appendChild(el('span', { 'class': 'w' }, label(id)));
    return b;
  }
  function markNone(row) { var t = row.querySelector('button[data-v="none"]'); if (t) t.classList.add('none-tile'); return row; }
  /* After a miss the tapped choice is switched off, so move to the first choice still open. */
  function refocus() { var n = document.querySelector('#choices button:not([disabled])'); if (n) n.focus(); }

  /* ---------- 1. Find the opposite ---------- */
  var plan = [];
  function find(area, ctx) {
    var a = age(), lv = level(a), n = choiceCount(a), round = ctx.round();
    if (round === 0) plan = planNone(ctx.rounds);
    var q;
    if (plan.indexOf(round) > -1) {
      var nones = lv === 0 ? NONE_EASY : Object.keys(NONE);
      q = makeFind(lv, n, 'none', freshIn('find-none', nones));
    } else {
      var pairIds = PAIRS.filter(function (p) { return lv > 0 || EASY.indexOf(p[0]) > -1; }).map(function (p) { return p[0]; });
      var p0 = freshIn('find', pairIds), w = rnd(2) ? p0 : OPP[p0];
      q = makeFind(lv, n, 'pair', w, rnd(2) === 1);
    }
    var labels = {};
    q.choices.forEach(function (id) { labels[id] = label(id); });
    ctx.set({ game: 'find', q: q, kind: q.kind, word: q.word, label: q.label, labels: labels, ans: q.ans, right: [q.ans], choices: q.choices });
    ctx.ask(area, 'What is the opposite of ' + q.label + '?');
    area.appendChild(wordCard(q.word));
    var row = ctx.tiles(q.choices, tileLook, function (id, b) {
      if (id === q.ans) {
        b.classList.add('right');
        if (q.kind === 'none') ctx.win('Yes! ' + q.why);
        else ctx.win('Yes! ' + cap(q.label) + ' and ' + label(id) + ' are opposites.');
        return;
      }
      var why;
      if (id === 'none') why = 'You tapped No opposite! But ' + q.label + ' does have an opposite: ' + label(q.ans) + '. ' + cap(q.label) + ' is a way a thing can be.';
      else if (q.kind === 'none') why = 'You tapped ' + label(id) + '. ' + cap(label(id)) + ' is the opposite of ' + oppWords(label(id))[0] + '. But ' + q.label + ' is not ' + label(id) + ' or ' + oppWords(label(id))[0] + '. ' + (NONE[q.word].kind === 'made' ? cap(q.label) + ' tells us what the ' + NONE[q.word].thing + ' is made of.' : cap(q.label) + ' is the name of a thing.');
      else why = 'You tapped ' + label(id) + '. ' + cap(label(id)) + ' is the opposite of ' + oppWords(label(id))[0] + ', not of ' + q.label + '.';
      ctx.miss(b, why, function (box) {
        box.appendChild(el('p', {}, why));
        if (q.kind === 'none') {
          var others = Object.keys(NONE).filter(function (k) { return k !== q.word; }), k = others[rnd(others.length)];
          box.appendChild(ctx.moviePanel(function () { return noneMovie(k); }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Ask: is this word a way something can be, like hot or cold? If not, it has no opposite. ' + whyNone(k)));
        } else if (id === 'none') {
          box.appendChild(ctx.moviePanel(function () { return pairMovie(q.word, q.ans); }));
          box.appendChild(el('p', { id: 'lesson-say' }, cap(q.label) + ' is a way a thing can be, so it has an opposite. The opposite of ' + q.label + ' is ' + label(q.ans) + '.'));
        } else {
          var ex = PAIRS.filter(function (p) { return p[0] !== q.word && p[1] !== q.word; })[rnd(PAIRS.length - 1)];
          box.appendChild(ctx.moviePanel(function () { return pairMovie(ex[0], ex[1]); }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Opposites are as different as they can be. ' + cap(label(ex[0])) + ' is the opposite of ' + label(ex[1]) + '. So think: what is as different from ' + q.label + ' as it can be?'));
        }
      });
      refocus();
    }, label, q.choices.length - (q.choices.indexOf('none') > -1 ? 1 : 0) === 4 ? 'tiles two' : 'tiles');
    area.appendChild(markNone(row));
  }

  /* ---------- 2. Opposites or not? Two words: are they opposites? ---------- */
  function makePair(lv, yes, first) {
    var ids = Object.keys(OPP).filter(function (id) { return lv > 0 || EASY.indexOf(id) > -1 || EASY.indexOf(OPP[id]) > -1; });
    var a = first || ids[rnd(ids.length)], b;
    if (yes) b = OPP[a];
    else if (lv > 0 && rnd(3) === 0) { var nk = Object.keys(NONE); b = nk[rnd(nk.length)]; }
    else b = wrongWords(a, 1, lv)[0];
    var sw = rnd(2) === 1;
    return { game: 'pairs', a: sw ? b : a, b: sw ? a : b, la: label(sw ? b : a), lb: label(sw ? a : b), ans: yes ? 'yes' : 'no' };
  }
  function pairsGame(area, ctx) {
    var lv = level(age()), ids = Object.keys(OPP).filter(function (id) { return lv > 0 || EASY.indexOf(id) > -1 || EASY.indexOf(OPP[id]) > -1; });
    var q = makePair(lv, rnd(2) === 1, freshIn('pairs', ids));
    ctx.set({ game: 'pairs', q: q, ans: q.ans, right: [q.ans], choices: ['yes', 'no'] });
    ctx.ask(area, 'Are ' + q.la + ' and ' + q.lb + ' opposites?');
    var show = el('div', { 'class': 'pairshow', id: 'pair' });
    show.appendChild(wordCard(q.a)); show.lastChild.removeAttribute('id');
    show.appendChild(el('span', { 'class': 'and', 'aria-hidden': 'true' }, '+'));
    show.appendChild(wordCard(q.b)); show.lastChild.removeAttribute('id');
    area.appendChild(show);
    var names = { yes: 'Yes, opposites', no: 'No, not opposites' };
    function explain() {
      if (q.ans === 'yes') return cap(q.la) + ' and ' + q.lb + ' are as different as they can be. They are opposites.';
      var noneWord = NONE[q.a] ? q.a : NONE[q.b] ? q.b : null;
      if (noneWord) return cap(noneWord) + ' has no opposite at all. ' + whyNone(noneWord);
      return 'The opposite of ' + q.la + ' is ' + oppWords(q.la)[0] + ', not ' + q.lb + '.';
    }
    area.appendChild(ctx.tiles(['yes', 'no'], function (v) { return el('span', { 'class': 'wordtile yn' }, names[v]); }, function (v, b) {
      if (v === q.ans) { b.classList.add('right'); ctx.win('Yes! ' + explain()); return; }
      var why = 'You tapped ' + names[v] + '. ' + explain();
      ctx.miss(b, why, function (box) {
        box.appendChild(el('p', {}, why));
        var ex = PAIRS[rnd(PAIRS.length)];
        box.appendChild(ctx.moviePanel(function () { return pairMovie(ex[0], ex[1]); }));
        box.appendChild(el('p', { id: 'lesson-say' }, 'Opposites are a pair of words that are as different as they can be, like ' + label(ex[0]) + ' and ' + label(ex[1]) + '. Ask: is one the very other way from the other?'));
      });
      refocus();
    }, function (v) { return names[v]; }, 'tiles two'));
  }

  /* ---------- the word list (assets/opposites-words.js) ---------- */
  var DATA = window.YS_OPPOSITES || {};
  var WP = DATA.wordPairs || [], PRE = DATA.prefixes || [], NW = DATA.noneWords || [], GROUPS = DATA.groups || {};
  var NOPE = 'no-opposite'; // the value of the "No opposite!" tile in the word games
  /** Each word: its opposites, what it is about (its senses) and its groups. */
  var WX = {};
  WP.forEach(function (p) {
    [[p.a, p.b], [p.b, p.a]].forEach(function (x) {
      var e = WX[x[0]] = WX[x[0]] || { opp: [], sense: [], groups: [] };
      if (e.opp.indexOf(x[1]) < 0) e.opp.push(x[1]);
      p.sense.forEach(function (s) { if (e.sense.indexOf(s) < 0) e.sense.push(s); });
      if (e.groups.indexOf(p.group) < 0) e.groups.push(p.group);
    });
  });
  var NONEW = {};
  NW.forEach(function (n) { NONEW[n.w] = n; });
  /** The hardest pair a child sees in the word games: up to age 4 for ages 3 and 4, up to 6 for ages 5 and 6 and with no profile,
      then one year above the child's age from 7 (so ages 11 and 12 get the whole list). */
  function wordMax(a) { return !a ? 6 : a <= 4 ? 4 : a <= 6 ? 6 : a + 1; }
  /** Word choices: 3 up to age 6, 4 from age 7. */
  function wordChoices(a) { return a >= 7 ? 4 : 3; }
  function shareSense(a, b) { return a.some(function (s) { return b.indexOf(s) > -1; }); }
  /** One is the other with a bit added (quick and quickly, light and lighter): too close to be a fair wrong choice. */
  function related(a, b) { var n = Math.min(a.length, b.length); return n >= 3 && (a.indexOf(b) === 0 || b.indexOf(a) === 0); }
  /** n wrong words for a round: from the same group first, never about the same thing as the word or its answer, each about something different. */
  function wrongWordList(words, n, maxAge, group) {
    var banned = [];
    words.forEach(function (w) { if (WX[w]) banned = banned.concat(WX[w].sense, [].concat.apply([], WX[w].opp.map(function (o) { return WX[o].sense; }))); });
    var out = [], used = banned.slice();
    function take(list) {
      shuffle(list).forEach(function (p) {
        shuffle([p.a, p.b]).forEach(function (w) {
          if (out.length >= n || out.indexOf(w) > -1 || words.indexOf(w) > -1 || NONEW[w]) return;
          if (shareSense(WX[w].sense, used)) return;
          if (words.some(function (x) { return related(x, w) || (WX[x] && WX[x].opp.some(function (o) { return related(o, w); })); })) return;
          out.push(w); used = used.concat(WX[w].sense);
        });
      });
    }
    var young = WP.filter(function (p) { return p.age <= maxAge; });
    take(young.filter(function (p) { return p.group === group; }));
    if (out.length < n) take(young);
    if (out.length < n) take(WP);
    return out;
  }
  /** A word round. kind "pair": pair i, shown from side (0: a, 1: b). kind "none": a word with no opposite. */
  function makeWord(maxAge, n, kind, pick, side, withNone) {
    if (kind === 'none') {
      var nw = NONEW[pick] || NW[rnd(NW.length)];
      return { game: 'words', kind: 'none', word: nw.w, choices: shuffle(wrongWordList([], n, maxAge, '')).concat([NOPE]), ans: NOPE, why: whyNoneWord(nw) };
    }
    var p = WP[pick != null ? pick : rnd(WP.length)], s = side != null ? side : rnd(2);
    var word = s ? p.b : p.a, ans = s ? p.a : p.b;
    var ch = shuffle([ans].concat(wrongWordList([word, ans], n - 1, Math.max(maxAge, p.age), p.group)));
    if (withNone) ch.push(NOPE);
    return { game: 'words', kind: 'pair', word: word, ans: ans, group: p.group, groupName: GROUPS[p.group] || '', pair: [p.a, p.b], choices: ch };
  }
  function whyNoneWord(n) {
    if (n.kind === 'made') return cap(n.w) + ' tells us what ' + an(n.thing) + ' can be made of. It is not a way the ' + n.thing + ' can be, like hot or cold, so it has no opposite.';
    return cap(n.w) + ' is the name of a thing. It tells us what something is, not how it is. ' + cap(an(n.w)) + ' can be ' + n.can[0] + ' or ' + n.can[1] + ', but the word ' + n.w + ' has no opposite.';
  }
  function wordLabel(v) { return v === NOPE ? 'No opposite!' : v; }

  /* A word card with no picture, and lesson pictures drawn with words. */
  function bigWord(text, id) {
    var c = el('div', { 'class': 'wordcard words-only' });
    if (id) c.id = id;
    c.appendChild(el('b', {}, text));
    return c;
  }
  function wordBox(x, w, fill) { return '<rect x="' + (x - 62) + '" y="26" width="124" height="44" rx="10" fill="' + (fill || '#f1f7f5') + '" stroke="#1F7A6D" stroke-width="2"/><text x="' + x + '" y="55" text-anchor="middle" font-size="' + (w.length > 10 ? 15 : 19) + '" font-weight="800" fill="' + INK + '">' + w + '</text>'; }
  function wordPairMovie(a, b) {
    var out = '<g' + at(0.2) + '>' + wordBox(66, a) + '</g><g' + at(1.6) + '>' + wordBox(254, b) + '</g>';
    out += '<g' + at(0.9) + '><path d="M132 48h56M140 40l-8 8 8 8M180 40l8 8-8 8" stroke="#1F7A6D" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="94" text-anchor="middle" font-size="14" font-weight="700" fill="#1b7a3d">opposites</text></g>';
    return { svg: out, vb: '0 0 320 104', label: 'The word ' + a + ', and the word ' + b + '. An arrow both ways joins them: ' + a + ' and ' + b + ' are opposites.' };
  }
  function wordNoneMovie(w) {
    var out = '<g' + at(0.2) + '>' + wordBox(66, w) + '</g>';
    out += '<g' + at(1.0) + '><path d="M132 48h56M140 40l-8 8 8 8M180 40l8 8-8 8" stroke="#8aa49b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M148 32l24 32M172 32l-24 32" stroke="#C2410C" stroke-width="5" stroke-linecap="round"/></g>';
    out += '<g' + at(1.8) + '>' + wordBox(254, 'No opposite!', '#fff7e0') + '</g>';
    return { svg: out, vb: '0 0 320 104', label: 'The word ' + w + '. An arrow to an opposite is crossed out, and a card says: No opposite!' };
  }
  /* Tiles in the word games say their word when they get focus with the keyboard (not when the game moves focus itself). */
  var quietFocus = false;
  function speakOnFocus(row, ctx, sayOf) {
    [].forEach.call(row.querySelectorAll('button'), function (b) {
      b.addEventListener('focus', function () { if (!quietFocus) ctx.say(sayOf(b.getAttribute('data-v'))); });
    });
    return row;
  }
  function refocusQuiet() { quietFocus = true; refocus(); quietFocus = false; }
  function markNope(row) { var t = row.querySelector('button[data-v="' + NOPE + '"]'); if (t) t.classList.add('none-tile'); return row; }

  /* ---------- 3. Word opposites: a word, read aloud; pick its opposite from word tiles ---------- */
  var wordPlan = [];
  function wordsGame(area, ctx) {
    var a = age(), max = wordMax(a), n = wordChoices(a), round = ctx.round();
    if (round === 0) wordPlan = planNone(ctx.rounds);
    var q;
    if (wordPlan.indexOf(round) > -1) {
      q = makeWord(max, n, 'none', freshIn('words-none', NW.map(function (x) { return x.w; })));
    } else {
      // A pair not asked yet in this visit, shown from a side whose word has not been asked yet either.
      var shown = USED['words-shown'] = USED['words-shown'] || {};
      var ok = [];
      WP.forEach(function (p, i) { if (p.age <= max && (!shown[p.a] || !shown[p.b])) ok.push(String(i)); });
      if (!ok.length) { shown = USED['words-shown'] = {}; WP.forEach(function (p, i) { if (p.age <= max) ok.push(String(i)); }); }
      var i = +freshIn('words', ok), p = WP[i];
      var side = shown[p.a] ? 1 : shown[p.b] ? 0 : rnd(2);
      q = makeWord(max, n, 'pair', i, side, rnd(2) === 1);
      shown[q.word] = 1;
    }
    var labels = {};
    q.choices.forEach(function (v) { labels[v] = wordLabel(v); });
    ctx.set({ game: 'words', q: q, kind: q.kind, word: q.word, label: q.word, labels: labels, ans: q.ans, right: [q.ans], choices: q.choices, maxAge: max });
    ctx.ask(area, 'What is the opposite of ' + q.word + '?');
    area.appendChild(bigWord(q.word, 'word'));
    if (q.kind === 'pair' && q.groupName) area.appendChild(el('p', { 'class': 'muted center', id: 'word-group' }, q.groupName));
    var row = ctx.tiles(q.choices, function (v) { return el('span', { 'class': 'wordtile' }, wordLabel(v)); }, function (v, b) {
      if (v === q.ans) {
        b.classList.add('right');
        if (q.kind === 'none') ctx.win('Yes! ' + q.why);
        else ctx.win('Yes! ' + cap(q.word) + ' and ' + q.ans + ' are opposites.');
        return;
      }
      var why;
      if (v === NOPE) why = 'You tapped No opposite! But ' + q.word + ' does have an opposite: ' + q.ans + '.';
      else if (q.kind === 'none') why = 'You tapped ' + v + '. ' + cap(v) + ' is the opposite of ' + WX[v].opp[0] + '. But ' + q.word + ' is not ' + v + ' or ' + WX[v].opp[0] + '. ' + (NONEW[q.word].kind === 'made' ? cap(q.word) + ' tells us what a thing is made of.' : cap(q.word) + ' is the name of a thing.');
      else why = 'You tapped ' + v + '. ' + cap(v) + ' is the opposite of ' + WX[v].opp[0] + ', not of ' + q.word + '.';
      ctx.miss(b, why, function (box) {
        box.appendChild(el('p', {}, why));
        if (q.kind === 'none') {
          var others = NW.filter(function (x) { return x.w !== q.word; }), k = others[rnd(others.length)];
          box.appendChild(ctx.moviePanel(function () { return wordNoneMovie(k.w); }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Ask: is this word a way something can be, or something we do? If not, it has no opposite. ' + whyNoneWord(k)));
        } else if (v === NOPE) {
          box.appendChild(ctx.moviePanel(function () { return wordPairMovie(q.word, q.ans); }));
          box.appendChild(el('p', { id: 'lesson-say' }, cap(q.word) + ' is a way a thing can be, or something we can do, so it has an opposite. The opposite of ' + q.word + ' is ' + q.ans + '.'));
        } else {
          var ex = WP.filter(function (p) { return p.group === q.group && p.age <= 6 && p.a !== q.word && p.b !== q.word && p.a !== q.ans && p.b !== q.ans; });
          var e = ex.length ? ex[rnd(ex.length)] : WP[0];
          box.appendChild(ctx.moviePanel(function () { return wordPairMovie(e.a, e.b); }));
          box.appendChild(el('p', { id: 'lesson-say' }, 'Opposites are as different as they can be. ' + cap(e.a) + ' is the opposite of ' + e.b + '. So think: what is as different from ' + q.word + ' as it can be?'));
        }
      });
      refocusQuiet();
    }, wordLabel, 'tiles two words');
    area.appendChild(speakOnFocus(markNope(row), ctx, wordLabel));
  }

  /* ---------- 4. Make the opposite: pick the beginning (un, dis, in, im, ir, il) that turns a word into its opposite ---------- */
  var BEGIN = ['un', 'dis', 'in', 'im'], MORE_BEGIN = ['ir', 'il'];
  /** How the voice says a beginning: the short ones are spelled out, so "im" is not read as "I'm". */
  var SAYPRE = { un: 'un', dis: 'dis', 'in': 'in', im: 'i, m', ir: 'i, r', il: 'i, l' };
  /** Prefix roots for an age: the age 7 words under 7 (with a gentle note), then up to a year above the child's age. */
  function prefixMax(a) { return !a || a < 7 ? 7 : a + 1; }
  function prefixChoices(a) { return a >= 7 ? 4 : 3; }
  function makePrefix(n, root) {
    var it = PRE.filter(function (x) { return x.root === root; })[0] || PRE[rnd(PRE.length)];
    var wrong = shuffle(BEGIN.filter(function (b) { return b !== it.pre && it.avoid.indexOf(b) < 0; }));
    var spare = MORE_BEGIN.filter(function (b) { return b !== it.pre && it.avoid.indexOf(b) < 0; });
    // ir and il only come before r and l: they are a wrong choice first for a word that starts with that letter, otherwise only when more are needed.
    wrong = spare.filter(function (b) { return it.root.charAt(0) === b.charAt(1); }).concat(wrong, spare.filter(function (b) { return it.root.charAt(0) !== b.charAt(1); }));
    return { game: 'prefix', root: it.root, ans: it.pre, word: it.word, pos: it.pos, ex: it.ex, choices: shuffle([it.pre].concat(wrong.slice(0, n - 1))) };
  }
  function meaning(it) { return it.pos === 'adj' ? cap(it.word) + ' means not ' + it.root + '.' : cap(it.word) + ' is the opposite of ' + it.root + '.'; }
  function prefixMovie(pre, root) {
    var out = '<g' + at(0.2) + '><rect x="10" y="22" width="70" height="44" rx="10" fill="#fff7e0" stroke="#b07d00" stroke-width="2"/><text x="45" y="51" text-anchor="middle" font-size="20" font-weight="800" fill="' + INK + '">' + pre + '</text></g>';
    out += '<text x="94" y="52" text-anchor="middle" font-size="24" font-weight="800" fill="#1F7A6D"' + at(0.6) + '>+</text>';
    out += '<g' + at(0.9) + '><rect x="108" y="22" width="96" height="44" rx="10" fill="#f1f7f5" stroke="#1F7A6D" stroke-width="2"/><text x="156" y="51" text-anchor="middle" font-size="' + (root.length > 8 ? 13 : 17) + '" font-weight="800" fill="' + INK + '">' + root + '</text></g>';
    out += '<text x="216" y="52" text-anchor="middle" font-size="24" font-weight="800" fill="#1F7A6D"' + at(1.4) + '>=</text>';
    out += '<g' + at(1.9) + '><rect x="228" y="22" width="86" height="44" rx="10" fill="#e6f6ea" stroke="#1b7a3d" stroke-width="2"/><text x="271" y="51" text-anchor="middle" font-size="' + ((pre + root).length > 9 ? 11 : 15) + '" font-weight="800" fill="' + INK + '">' + pre + root + '</text></g>';
    return { svg: out, vb: '0 0 320 88', label: 'The beginning ' + pre + ' and the word ' + root + ' join to make ' + pre + root + '.' };
  }
  function prefixGame(area, ctx) {
    var a = age(), max = prefixMax(a), n = prefixChoices(a);
    var roots = PRE.filter(function (x) { return x.age <= max; }).map(function (x) { return x.root; });
    var q = makePrefix(n, freshIn('prefix', roots)), it = PRE.filter(function (x) { return x.root === q.root; })[0];
    ctx.set({ game: 'prefix', q: q, word: q.root, label: q.root, built: q.word, ans: q.ans, right: [q.ans], choices: q.choices });
    if (!a || a < 7) area.appendChild(el('p', { 'class': 'muted', id: 'older-note' }, 'This game is for ages 7 and up, but anyone can have a go. A grown-up can help.'));
    ctx.ask(area, 'Which beginning makes the opposite of ' + q.root + '?');
    var card = bigWord('', 'word'), shown = card.querySelector('b');
    shown.appendChild(el('span', { 'class': 'sr' }, 'a gap, then '));
    shown.appendChild(el('span', { 'class': 'blank', 'aria-hidden': 'true' }, '?'));
    shown.appendChild(document.createTextNode(q.root));
    area.appendChild(card);
    var row = ctx.tiles(q.choices, function (v) { return el('span', { 'class': 'wordtile' }, v + '-'); }, function (v, b) {
      if (v === q.ans) {
        b.classList.add('right');
        shown.innerHTML = '';
        shown.appendChild(el('span', { 'class': 'pre' }, q.ans));
        shown.appendChild(document.createTextNode(q.root));
        var text = 'Yes! ' + cap(q.ans) + ' and ' + q.root + ' make ' + q.word + '. ' + meaning(it) + ' ' + q.ex;
        ctx.win(text, 'Yes! ' + cap(q.word) + '. ' + meaning(it) + ' ' + q.ex);
        return;
      }
      var why = 'You tapped ' + v + '. ' + cap(v) + ' and ' + q.root + ' do not make a word we use. Try saying each one out loud.';
      ctx.miss(b, why, function (box) {
        box.appendChild(el('p', {}, why));
        var others = PRE.filter(function (x) { return x.pre === q.ans && x.root !== q.root; }), e = others.length ? others[rnd(others.length)] : it;
        box.appendChild(ctx.moviePanel(function () { return prefixMovie(e.pre, e.root); }));
        var rule = { im: 'Im often goes before words that start with p, b or m.', ir: 'Ir goes before some words that start with r.', il: 'Il goes before some words that start with l.' }[q.ans] || 'Un, dis and in all can mean not, or the opposite of.';
        box.appendChild(el('p', { id: 'lesson-say' }, 'A beginning can turn a word into its opposite. ' + cap(e.pre) + ' and ' + e.root + ' make ' + e.word + '. ' + rule + ' Say each choice with ' + q.root + ': which one sounds like a real word?'));
      });
      refocusQuiet();
    }, function (v) { return v; }, 'tiles two words');
    area.appendChild(speakOnFocus(row, ctx, function (v) { return SAYPRE[v] || v; }));
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'What is an opposite?', text: 'Opposites are two words that are as different as they can be. This drink is hot. This ice is cold. Hot and cold are opposites.',
      movie: function () { return pairMovie('hot', 'cold'); } },
    { title: 'More opposites', text: 'Big and small. Happy and sad. Up and down. Each word tells us how something is, and its opposite is the other way.',
      movie: function () {
        var out = '';
        [['big', 'small'], ['happy', 'sad'], ['up', 'down']].forEach(function (p, i) {
          var y = 4 + i * 66;
          out += '<g' + at(0.3 + i * 1.0) + '>' + inBox(artOf(p[0]), 30, y, 56) + '<text x="100" y="' + (y + 34) + '" font-size="16" font-weight="800" fill="' + INK + '">' + p[0] + '</text>' +
            '<path d="M150 ' + (y + 28) + 'h40M158 ' + (y + 20) + 'l-8 8 8 8M182 ' + (y + 20) + 'l8 8-8 8" stroke="#1F7A6D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
            inBox(artOf(p[1]), 206, y, 56) + '<text x="268" y="' + (y + 34) + '" font-size="16" font-weight="800" fill="' + INK + '">' + p[1] + '</text></g>';
        });
        return { svg: out, vb: '0 0 320 200', label: 'Three pairs appear one after another: a big ball and a small ball, a happy face and a sad face, a ball up high and a ball down low.' };
      } },
    { title: 'Words with no opposite', text: 'Some words have no opposite. Look at this cup. ' + whyNone('plastic') + ' Wood, glass, paper, metal and wool are the same: they tell us what a thing is made of.',
      movie: function () { return noneMovie('plastic'); } },
    { title: 'Names of things', text: 'Apple, chair and dog are names of things. They tell us what something is, not how it is. So they have no opposite. But an apple can be big or small, and a dog can be happy or sad!',
      movie: function () {
        var out = '';
        ['apple', 'chair', 'dog'].forEach(function (k, i) { out += '<g' + at(0.3 + i * 0.7) + '>' + inBox(NONE[k].art, 16 + i * 100, 4, 72) + '<text x="' + (52 + i * 100) + '" y="94" text-anchor="middle" font-size="16" font-weight="800" fill="' + INK + '">' + k + '</text></g>'; });
        out += '<g' + at(2.6) + '><rect x="96" y="104" width="128" height="34" rx="10" fill="#fff7e0" stroke="#b07d00" stroke-width="2"/><text x="160" y="126" text-anchor="middle" font-size="15" font-weight="800" fill="' + INK + '">No opposite!</text></g>';
        return { svg: out, vb: '0 0 320 144', label: 'An apple, a chair and a dog appear. Then a card says: No opposite!' };
      } },
    { title: 'How to tell', text: 'Ask: is the word a way something can be? Hot, big, happy, wet: yes, so look for the opposite. Plastic, wood, apple, dog: no, they say what a thing is or what it is made of. Then tap No opposite!',
      movie: function () {
        var out = '<text x="80" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#1b7a3d">has an opposite</text><text x="240" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#7a5a00">no opposite</text><path d="M160 26v128" stroke="#c6e3da" stroke-width="2"/>';
        ['hot', 'big', 'happy', 'wet'].forEach(function (k, i) { out += '<g' + at(0.3 + i * 0.6) + '>' + inBox(artOf(k), 18 + (i % 2) * 70, 28 + Math.floor(i / 2) * 64, 52) + '</g>'; });
        ['plastic', 'wood', 'apple', 'dog'].forEach(function (k, i) { out += '<g' + at(0.6 + i * 0.6) + '>' + inBox(NONE[k].art, 178 + (i % 2) * 70, 28 + Math.floor(i / 2) * 64, 52) + '</g>'; });
        return { svg: out, vb: '0 0 320 160', label: 'Two groups. Words that have an opposite: hot, big, happy and wet. Words with no opposite: plastic, wood, apple and dog.' };
      } }
  ];

  function $(id) { return document.getElementById(id); }
  function showLevel() {
    var a = age(), note = $('level-note');
    if (!note) return;
    var t = (a ? 'Set for age ' + a + ', from your child\'s profile.' : 'No age picked, so the games are set in the middle, for about ages 5 and 6. A grown-up can pick an age on the Yaanstep Sprouts page.') +
      ' Find the opposite shows ' + choiceCount(a) + ' pictures to pick from. Word opposites shows ' + wordChoices(a) + ' words, ' +
      (a && a < 5 ? 'with the easiest words (it suits ages 5 and up best).' : a >= 7 ? 'with harder words as your child grows.' : 'with common words.') +
      (a >= 7 ? ' Make the opposite fits age ' + a + '.' : ' Make the opposite is for ages 7 and up, but anyone can have a go.');
    if (note.textContent !== t) note.textContent = t;
  }
  function focusPrompt(fn) {
    return function (area, ctx) {
      fn(area, ctx);
      var p = $('prompt');
      if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
      showLevel();
    };
  }

  S.run({
    area: 'english',
    names: { learn: 'Learn opposites', find: 'Find the opposite', pairs: 'Opposites or not?', words: 'Word opposites', prefix: 'Make the opposite' },
    learn: LEARN,
    games: { find: focusPrompt(find), pairs: focusPrompt(pairsGame), words: focusPrompt(wordsGame), prefix: focusPrompt(prefixGame) },
    // About 1 round in 5 of Word opposites has no opposite: 2 of 10.
    rounds: { words: 10 },
    init: function () {
      showLevel();
      document.addEventListener('click', showLevel);
      window.addEventListener('storage', showLevel);
    }
  });
  // Test hook, read only: the question makers, the words and the plan of rounds with no opposite.
  // It is added to the word list's own object (assets/opposites-words.js), which keeps its groups, wordPairs, prefixes and noneWords.
  var hook = {
    age: age, level: level, choiceCount: choiceCount, pairs: PAIRS, none: Object.keys(NONE), easy: EASY, whyNone: whyNone, senses: SENSES,
    labels: Object.keys(W).reduce(function (o, k) { o[k] = W[k].w; return o; }, {}),
    make: { find: makeFind, pairs: makePair, words: makeWord, prefix: makePrefix }, planNone: planNone, plan: function () { return plan.slice(); },
    wordPlan: function () { return wordPlan.slice(); }, wordMax: wordMax, wordChoices: wordChoices, prefixMax: prefixMax, prefixChoices: prefixChoices,
    noOpposite: NOPE, whyNoneWord: whyNoneWord
  };
  Object.keys(hook).forEach(function (k) { DATA[k] = hook[k]; });
  window.YS_OPPOSITES = DATA;
})();
