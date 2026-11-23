/* Yaanstep Sprouts: Opposites (ages 3 to 8; Manish, 23 Nov 2026: "Also add opposites along with the graphical
   representation. In between give the example of the words which are not properties, like Plastic. There is no
   opposite of word Plastic. Explain why like that.").
   Learn: a moving lesson in 5 parts. Games: Find the opposite, Opposites or not?
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
    off: { w: 'off', art: bulb('#e4e8ea', '#8a989c'), pic: 'a light bulb that is off' }
  };
  var PAIRS = [['big', 'small'], ['hot', 'cold'], ['full', 'empty'], ['tall', 'short-h'], ['fast', 'slow'], ['happy', 'sad'], ['up', 'down'], ['open', 'closed'], ['wet', 'dry'],
    ['day', 'night'], ['long', 'short-l'], ['heavy', 'light'], ['loud', 'quiet'], ['in', 'out'], ['old', 'new'], ['clean', 'dirty'], ['on', 'off']];
  /** Ages 3 and 4 start with the pairs that are easiest to see. */
  var EASY = ['big', 'hot', 'full', 'happy', 'up', 'open', 'wet', 'day', 'in', 'on', 'fast'];
  var OPP = {};
  PAIRS.forEach(function (p) { OPP[p[0]] = p[1]; OPP[p[1]] = p[0]; });
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
    var pool = shuffle(Object.keys(W).filter(function (id) { return lv > 0 || EASY.indexOf(id) > -1 || EASY.indexOf(OPP[id]) > -1; })), out = [];
    pool.forEach(function (id) {
      var w = W[id].w;
      if (out.length >= n || id === word || said.indexOf(w) > -1 || bad.indexOf(w) > -1) return;
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
      q = makeFind(lv, n, 'none', ctx.fresh(nones));
    } else {
      var pairIds = PAIRS.filter(function (p) { return lv > 0 || EASY.indexOf(p[0]) > -1; }).map(function (p) { return p[0]; });
      var p0 = ctx.fresh(pairIds), w = rnd(2) ? p0 : OPP[p0];
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
    var q = makePair(lv, rnd(2) === 1, ctx.fresh(ids));
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
      ' Find the opposite shows ' + choiceCount(a) + ' pictures to pick from.';
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
    names: { learn: 'Learn opposites', find: 'Find the opposite', pairs: 'Opposites or not?' },
    learn: LEARN,
    games: { find: focusPrompt(find), pairs: focusPrompt(pairsGame) },
    init: function () {
      showLevel();
      document.addEventListener('click', showLevel);
      window.addEventListener('storage', showLevel);
    }
  });
  // Test hook, read only: the question makers, the words and the plan of rounds with no opposite.
  window.YS_OPPOSITES = {
    age: age, level: level, choiceCount: choiceCount, pairs: PAIRS, none: Object.keys(NONE), easy: EASY, whyNone: whyNone,
    labels: Object.keys(W).reduce(function (o, k) { o[k] = W[k].w; return o; }, {}),
    make: { find: makeFind, pairs: makePair }, planNone: planNone, plan: function () { return plan.slice(); }
  };
})();
