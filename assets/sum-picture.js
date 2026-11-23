/* Yaanstep Sprouts: pictures for a missing-number sum (23 Nov 2026, for Manish).
   "After answering 7 + ? = 10 the question mark should be replaced with the right answer. If user give wrong answer,
   lets say user input is 2, then show 7 + 2 = 9 ... or graphical representation so user can guess how much they are off."
   YSSum.solved('7 + ? = 10', 3)          -> '7 + 3 = 10'
   YSSum.showWrong(box, '7 + ? = 10', 2)  -> puts "7 + 2 = 9. We want 10." and a counters picture in box:
     adding:      one frame with 10 places; 7 teal counters and the child's 2 orange ones; the empty place shows the gap,
                  and counters past the frame show going over;
     taking away: the child's take-away crossed out, with what is left next to a row of the places we want;
     answer "?":  the counters of the sum, with the child's number as a row of grey counters under it.
   Counters come in rows of ten with a gap after five, the way ten frames look. Original drawings. Numbers up to 20 get a
   picture; bigger numbers get the sentence only. Nothing is stored or sent. */
(function () {
  'use strict';
  var TEAL = '#1F7A6D', ORANGE = '#E07B2A', GREY = '#9AA7A4', INK = '#17312D', SLOT = '#7A8B87';
  var CELL = 26, GAP = 4, FIVE = 10, MAX = 20;

  function parse(text) {
    var m = /^\s*(\d+|\?)\s*([+\-−])\s*(\d+|\?)\s*=\s*(\d+|\?)\s*$/.exec(String(text));
    if (!m) return null;
    var parts = [m[1], m[3], m[4]];
    if (parts.filter(function (p) { return p === '?'; }).length !== 1) return null;
    return { a: m[1], op: m[2] === '+' ? '+' : '−', b: m[3], c: m[4], at: parts.indexOf('?') };
  }
  function solved(text, ans) { return String(text).replace('?', String(ans)); }

  function x(i) { var k = i % 10; return 4 + k * (CELL + GAP) + (k >= 5 ? FIVE : 0); }
  function y(i, top) { return top + Math.floor(i / 10) * (CELL + GAP); }
  function rows(n) { return Math.max(1, Math.ceil(n / 10)); }
  var WIDTH = x(9) + CELL + 4;

  /** One row group of counters. cells: [{ fill, crossed, slot, empty }] */
  function draw(cells, top) {
    var out = '';
    cells.forEach(function (c, i) {
      var cx = x(i) + CELL / 2, cy = y(i, top) + CELL / 2;
      if (c.slot) out += '<rect x="' + x(i) + '" y="' + y(i, top) + '" width="' + CELL + '" height="' + CELL + '" rx="5" fill="#fff" stroke="' + SLOT + '" stroke-width="1.5"' + (c.empty ? ' stroke-dasharray="4 3"' : '') + '/>';
      if (c.fill) out += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + c.fill + '" stroke="' + INK + '" stroke-width="1.5"' + (c.crossed ? ' opacity=".45"' : '') + '/>';
      if (c.crossed) out += '<path d="M' + (cx - 9) + ' ' + (cy - 9) + 'l18 18M' + (cx + 9) + ' ' + (cy - 9) + 'l-18 18" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
      if (c.over) out += '<rect x="' + (x(i) - 1) + '" y="' + (y(i, top) - 1) + '" width="' + (CELL + 2) + '" height="' + (CELL + 2) + '" rx="6" fill="none" stroke="#C8402F" stroke-width="1.5" stroke-dasharray="3 3"/>';
    });
    return out;
  }
  function label(t, top) { return '<text x="4" y="' + (top - 6) + '" font-size="14" font-weight="700" fill="' + INK + '" font-family="system-ui,sans-serif">' + t + '</text>'; }
  function svgOf(body, height, said) {
    return '<svg class="sum-pic" viewBox="0 0 ' + WIDTH + ' ' + height + '" width="' + WIDTH + '" role="img" aria-label="' + said.replace(/"/g, '&quot;') + '">' + body + '</svg>';
  }
  function many(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /** The sentence and picture for a wrong try, or null when the sum is not one we can draw. */
  function picture(text, guess) {
    var p = parse(text);
    guess = +guess;
    if (!p || !isFinite(guess)) return null;
    var nums = [p.a, p.b, p.c].map(function (v) { return v === '?' ? guess : +v; });
    var a = nums[0], b = nums[1], c = nums[2];
    var sentence, said, body, height, cells, made;

    if (p.at < 2) {
      // A missing part: work out what the child's number makes, and compare it with the number we want.
      made = p.op === '+' ? a + b : a - b;
      var shown = (p.at === 0 ? '<b>' + a + '</b>' : a) + ' ' + p.op + ' ' + (p.at === 1 ? '<b>' + b + '</b>' : b);
      if (made < 0) return { html: '<p>' + a + ' is less than ' + b + ', so we cannot take ' + b + ' away. We want ' + c + '.</p>' };
      sentence = shown + ' = ' + made + '. We want ' + c + '.';
      if (Math.max(a, b, c, made) > MAX) return { html: '<p>' + sentence + '</p>' };
      if (p.op === '+') {
        // One frame with c places. The known part is teal, the child's part orange.
        var first = p.at === 0 ? ORANGE : TEAL, second = p.at === 0 ? TEAL : ORANGE, n = Math.max(made, c);
        cells = [];
        for (var i = 0; i < n; i++) cells.push({ slot: i < c, empty: i >= made, over: i >= c, fill: i < a ? first : i < made ? second : null });
        height = 24 + rows(n) * (CELL + GAP);
        said = 'A frame with ' + many(c, 'place') + ' for ' + c + '. ' + a + ' and ' + b + ' make ' + many(made, 'counter') + '. ' +
          (made < c ? many(c - made, 'place') + (c - made === 1 ? ' is' : ' are') + ' still empty.' : many(made - c, 'counter') + ' did not fit in the frame.');
        body = label('Your try: ' + a + ' + ' + b, 20) + draw(cells, 24);
      } else {
        // Taking away: the child's take-away crossed out, then a row of the places we want left.
        var start = a, gone = b;
        cells = [];
        for (var j = 0; j < start; j++) cells.push({ fill: j < start - gone ? TEAL : ORANGE, crossed: j >= start - gone });
        var top2 = 24 + rows(start) * (CELL + GAP) + 26, want = [];
        for (var k = 0; k < c; k++) want.push({ slot: true, empty: true });
        height = top2 + rows(c) * (CELL + GAP);
        said = 'Your try: ' + start + ' counters with ' + gone + ' crossed out leaves ' + many(made, 'counter') + '. We want ' + many(c, 'counter') + ' left, shown as ' + many(c, 'empty place') + '.';
        body = label('Your try: ' + start + ' − ' + gone + ' leaves ' + made, 20) + draw(cells, 24) + label('We want ' + c + ' left', top2) + draw(want, top2);
      }
    } else {
      // The answer is missing: show the sum as counters, and the child's number under it.
      made = p.op === '+' ? a + b : a - b;
      sentence = 'You said ' + guess + '. Count the counters that are left to check.';
      if (p.op === '+') sentence = 'You said ' + guess + '. Count all the counters to check.';
      if (Math.max(a, b, guess) > MAX || made < 0) return { html: '<p>' + sentence + '</p>' };
      cells = [];
      var n2 = p.op === '+' ? a + b : a;
      for (var q = 0; q < n2; q++) cells.push(p.op === '+' ? { fill: q < a ? TEAL : ORANGE } : { fill: q < a - b ? TEAL : ORANGE, crossed: q >= a - b });
      var top3 = 24 + rows(n2) * (CELL + GAP) + 26, yours = [];
      for (var g = 0; g < guess; g++) yours.push({ fill: GREY });
      height = top3 + rows(guess) * (CELL + GAP);
      said = (p.op === '+' ? a + ' teal counters and ' + b + ' orange counters.' : a + ' counters with ' + b + ' crossed out.') + ' Under them, your ' + many(guess, 'counter') + '.';
      body = label(a + ' ' + p.op + ' ' + b, 20) + draw(cells, 24) + label('You said ' + guess, top3) + draw(yours, top3);
    }
    return { html: '<p>' + sentence + '</p>' + svgOf(body, height + 4, said) };
  }

  function showWrong(box, text, guess) {
    if (!box) return null;
    var old = box.querySelector('.sum-try');
    if (old) old.remove();
    var pic = picture(text, guess);
    if (!pic) return null;
    var div = document.createElement('div');
    div.className = 'sum-try';
    div.innerHTML = pic.html;
    box.appendChild(div);
    return div;
  }

  if (!document.getElementById('ys-sum-css')) {
    var st = document.createElement('style');
    st.id = 'ys-sum-css';
    st.textContent = '.sum-try{margin:8px 0;padding:8px 10px;background:#fffbea;border:1px solid #e3cf7d;border-radius:12px;color:#17312D;font-weight:400}' +
      '.sum-try p{margin:0 0 6px;font-size:1.1rem}.sum-try b{color:#B4531A}.sum-try svg{display:block;max-width:100%;height:auto}';
    (document.head || document.documentElement).appendChild(st);
  }
  window.YSSum = { parse: parse, solved: solved, picture: picture, showWrong: showWrong };
}());
