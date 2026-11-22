/* Yaanstep learning page: two sample lessons.
   Runs in the browser only. Nothing is stored or sent: no cookies, no
   localStorage, no network requests. All state lives in variables and is
   gone when the page is closed.
   There is no list of questions. Each lesson is built from random numbers,
   names and things when it starts, so it is different every time. */
(function () {
  'use strict';
  var root = document.getElementById('learn');
  if (!root) return;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var player = document.getElementById('player');
  var kickerEl = document.getElementById('player-kicker');
  var titleEl = document.getElementById('player-title');
  var progressEl = document.getElementById('player-progress');
  var sayEl = document.getElementById('player-say');
  var stageEl = document.getElementById('player-stage');
  var feedbackEl = document.getElementById('player-feedback');
  var nextBtn = document.getElementById('player-next');
  var closeBtn = document.getElementById('player-close');
  var staticBox = document.getElementById('static-lessons');

  var INK = '#17312D';
  var RED = '#C8402F';
  var BLUE = '#2F6FBF';
  var TEAL = '#1F7A6D';

  /* ---------- small helpers ---------- */
  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    var k;
    for (k in (attrs || {})) node.setAttribute(k, attrs[k]);
    (kids || []).forEach(function (kid) {
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return node;
  }
  function svg(tag, attrs, kids) {
    var node = document.createElementNS(SVGNS, tag);
    var k;
    for (k in (attrs || {})) node.setAttribute(k, attrs[k]);
    (kids || []).forEach(function (kid) {
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function text(x, y, str, size, weight, fill, anchor) {
    return svg('text', {
      x: x, y: y, 'font-size': size || 16, 'font-weight': weight || 400,
      fill: fill || INK, 'text-anchor': anchor || 'middle',
      'font-family': 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    }, [String(str)]);
  }

  /* ---------- pictures (all drawn here; original shapes, no images) ---------- */
  function pic(viewBox, px, kids) {
    return svg('svg', { viewBox: viewBox, width: px, height: px, 'aria-hidden': 'true', focusable: 'false' }, kids);
  }
  function patternMarks(pattern, spots) {
    var out = [];
    if (pattern === 'stripes') spots.stripes.forEach(function (r) { out.push(svg('rect', { x: r[0], y: r[1], width: r[2], height: 5, fill: '#fff' })); });
    if (pattern === 'dots') spots.dots.forEach(function (p) { out.push(svg('circle', { cx: p[0], cy: p[1], r: 3.5, fill: '#fff' })); });
    return out;
  }
  /* Things that come in pairs: each can be plain, striped or dotted. */
  var PAIR_THINGS = {
    sock: function (color, pattern) {
      return pic('0 0 80 86', 72, [svg('path', {
        d: 'M22 6 h24 v40 q0 6 6 8 l10 4 q10 4 8 14 q-2 8 -12 8 h-26 q-12 0 -12 -12 z',
        fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round'
      })].concat(patternMarks(pattern, { stripes: [[22, 14, 24], [22, 26, 24]], dots: [[30, 16], [40, 26], [30, 36]] })));
    },
    mitten: function (color, pattern) {
      return pic('0 0 80 86', 72, [svg('path', {
        d: 'M24 78 v-14 q-10 -6 -12 -22 q-2 -14 8 -16 q6 -1 8 6 v-16 q0 -12 14 -12 q14 0 14 14 v30 q0 12 -10 16 v14 z',
        fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round'
      })].concat(patternMarks(pattern, { stripes: [[30, 30, 26], [30, 44, 26]], dots: [[38, 22], [48, 34], [38, 46]] }),
        [svg('rect', { x: 22, y: 70, width: 30, height: 9, rx: 3, fill: '#fff', stroke: INK, 'stroke-width': 2 })]));
    },
    cup: function (color, pattern) {
      return pic('0 0 80 80', 72, [
        svg('path', { d: 'M58 30 q14 0 14 12 q0 12 -14 12', fill: 'none', stroke: INK, 'stroke-width': 5 }),
        svg('path', { d: 'M12 18 h48 l-5 46 q-1 8 -9 8 h-20 q-8 0 -9 -8 z', fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })
      ].concat(patternMarks(pattern, { stripes: [[16, 30, 40], [18, 46, 36]], dots: [[26, 32], [44, 40], [30, 54]] })));
    },
    hat: function (color, pattern) {
      return pic('0 0 80 80', 72, [
        svg('path', { d: 'M16 60 q0 -44 24 -44 q24 0 24 44 z', fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })
      ].concat(patternMarks(pattern, { stripes: [[22, 34, 36], [18, 46, 44]], dots: [[32, 30], [48, 38], [34, 48]] }), [
        svg('rect', { x: 8, y: 58, width: 64, height: 10, rx: 5, fill: color, stroke: INK, 'stroke-width': 2 }),
        svg('circle', { cx: 40, cy: 13, r: 6, fill: '#fff', stroke: INK, 'stroke-width': 2 })
      ]));
    }
  };
  /* Shapes for "find the different one" and sorting. Each draws in any color, at any size. */
  var SHAPES = {
    ball: function (c, px) { return pic('0 0 80 80', px, [svg('circle', { cx: 40, cy: 40, r: 30, fill: c, stroke: INK, 'stroke-width': 2 }), svg('path', { d: 'M22 30 q18 -16 36 0', fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' })]); },
    star: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M40 8 l9.5 20 22 3 -16 15.5 4 22 -19.5 -10.5 -19.5 10.5 4 -22 -16 -15.5 22 -3 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })]); },
    block: function (c, px) { return pic('0 0 60 60', px, [svg('rect', { x: 6, y: 6, width: 48, height: 48, rx: 8, fill: c, stroke: INK, 'stroke-width': 2 }), svg('rect', { x: 14, y: 14, width: 14, height: 8, rx: 3, fill: '#fff', opacity: 0.6 })]); },
    heart: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M40 70 q-30 -20 -30 -40 q0 -16 15 -16 q10 0 15 10 q5 -10 15 -10 q15 0 15 16 q0 20 -30 40 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })]); },
    triangle: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M40 10 l32 58 h-64 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })]); },
    moon: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M50 8 a32 32 0 1 0 22 52 a26 26 0 1 1 -22 -52 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' })]); },
    flower: function (c, px) {
      var kids = [];
      for (var i = 0; i < 6; i++) {
        var a = i * Math.PI / 3;
        kids.push(svg('circle', { cx: (40 + Math.cos(a) * 18).toFixed(1), cy: (40 + Math.sin(a) * 18).toFixed(1), r: 12, fill: c, stroke: INK, 'stroke-width': 2 }));
      }
      kids.push(svg('circle', { cx: 40, cy: 40, r: 10, fill: '#FFE08A', stroke: INK, 'stroke-width': 2 }));
      return pic('0 0 80 80', px, kids);
    },
    fish: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M10 40 q20 -24 44 -10 l16 -12 v44 l-16 -12 q-24 14 -44 -10 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }), svg('circle', { cx: 24, cy: 37, r: 3, fill: INK })]); },
    leaf: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M12 68 q0 -52 56 -56 q0 52 -56 56 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }), svg('path', { d: 'M14 66 l50 -50', stroke: INK, 'stroke-width': 2 })]); },
    kite: function (c, px) { return pic('0 0 80 80', px, [svg('path', { d: 'M40 6 l24 26 -24 42 -24 -42 z', fill: c, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }), svg('path', { d: 'M16 32 h48 M40 6 v68', stroke: '#fff', 'stroke-width': 2 })]); }
  };
  function block(color, size) { return SHAPES.block(color, size || 56); }

  /* Part-and-whole bar picture.
     spec: { whole: number, wholeUnknown: bool, parts: [{ v, label, unknown }] } */
  function barPartWhole(spec, reveal) {
    var x0 = 10, W = 320, y = 44, h = 46;
    var fills = ['#BFE0D8', '#F6E3A1'];
    var kids = [];
    var wholeShown = (spec.wholeUnknown && !reveal) ? '?' : String(spec.whole);
    var desc = 'Bar picture. Whole bar: ' + (wholeShown === '?' ? 'unknown' : wholeShown) + '. Parts: ';
    kids.push(svg('path', {
      d: 'M' + x0 + ' 30 v-8 h' + W + ' v8', fill: 'none', stroke: INK, 'stroke-width': 2
    }));
    kids.push(text(x0 + W / 2, 16, wholeShown, 20, 700, (spec.wholeUnknown && reveal) ? TEAL : INK));
    var x = x0;
    spec.parts.forEach(function (p, i) {
      var w = W * p.v / spec.whole;
      var hidden = p.unknown && !reveal;
      kids.push(svg('rect', {
        x: x, y: y, width: w, height: h,
        fill: hidden ? '#fff' : fills[i % 2], stroke: INK, 'stroke-width': 2,
        'stroke-dasharray': hidden ? '6 5' : 'none'
      }));
      kids.push(text(x + w / 2, y + h / 2 + 7, hidden ? '?' : p.v, 20, 700, (p.unknown && reveal) ? TEAL : INK));
      if (p.label) kids.push(text(x + w / 2, y + h + 20, p.label, 13, 400, '#4F615E'));
      desc += (hidden ? 'unknown' : p.v) + (p.label ? ' ' + p.label : '') + (i < spec.parts.length - 1 ? ', ' : '.');
      x += w;
    });
    return svg('svg', { viewBox: '0 0 340 122', width: 340, height: 122, role: 'img', 'aria-label': desc }, kids);
  }

  /* Comparison bar picture: two bars, the gap is the difference. */
  function barCompare(spec, reveal) {
    var x0 = 70, unit = 250 / spec.a.v, h = 34;
    var gap = spec.a.v - spec.b.v;
    var desc = 'Two bars. ' + spec.a.name + ': ' + spec.a.v + '. ' + spec.b.name + ': ' + spec.b.v +
      '. The gap between them is ' + (reveal ? gap : 'unknown') + '.';
    var kids = [
      text(62, 36, spec.a.name, 15, 600, INK, 'end'),
      svg('rect', { x: x0, y: 14, width: spec.a.v * unit, height: h, fill: '#BFE0D8', stroke: INK, 'stroke-width': 2 }),
      text(x0 + spec.a.v * unit / 2, 37, spec.a.v, 20, 700),
      text(62, 86, spec.b.name, 15, 600, INK, 'end'),
      svg('rect', { x: x0, y: 64, width: spec.b.v * unit, height: h, fill: '#F6E3A1', stroke: INK, 'stroke-width': 2 }),
      text(x0 + spec.b.v * unit / 2, 87, spec.b.v, 20, 700),
      svg('rect', {
        x: x0 + spec.b.v * unit, y: 64, width: gap * unit, height: h, fill: '#fff',
        stroke: INK, 'stroke-width': 2, 'stroke-dasharray': reveal ? 'none' : '6 5'
      }),
      text(x0 + spec.b.v * unit + gap * unit / 2, 87, reveal ? gap : '?', 20, 700, reveal ? TEAL : INK)
    ];
    return svg('svg', { viewBox: '0 0 340 112', width: 340, height: 112, role: 'img', 'aria-label': desc }, kids);
  }

  /* ---------- step builders ---------- */
  function info(buildExtra) {
    return function (ctx) {
      if (buildExtra) buildExtra(ctx);
      ctx.done(false);
    };
  }

  /* ---------- drag and drop (mouse, touch and pen) ----------
     A thing can be dragged onto any element marked data-drop. Tapping and the
     keyboard still work, because a press without movement stays a click. */
  function makeDraggable(btn, onDrop) {
    var start = null, ghost = null, dragged = false;
    btn.style.touchAction = 'none';
    btn.classList.add('draggable');
    function stop() {
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      ghost = null; start = null;
      btn.classList.remove('dragging');
    }
    btn.addEventListener('pointerdown', function (e) {
      if (btn.disabled) return;
      start = { x: e.clientX, y: e.clientY };
      dragged = false;
      if (btn.setPointerCapture) { try { btn.setPointerCapture(e.pointerId); } catch (err) { /* not captured */ } }
    });
    btn.addEventListener('pointermove', function (e) {
      if (!start) return;
      if (!ghost) {
        if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < 8) return;
        var box = btn.getBoundingClientRect();
        ghost = btn.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.className = 'item-ghost';
        ghost.style.width = box.width + 'px';
        ghost.style.height = box.height + 'px';
        document.body.appendChild(ghost);
        btn.classList.add('dragging');
        dragged = true;
      }
      ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + 'px';
      ghost.style.top = (e.clientY - ghost.offsetHeight / 2) + 'px';
    });
    btn.addEventListener('pointerup', function (e) {
      var wasDragging = !!ghost;
      stop();
      if (!wasDragging) return;
      var under = document.elementFromPoint(e.clientX, e.clientY);
      var target = under && under.closest ? under.closest('[data-drop]') : null;
      if (target && target !== btn) onDrop(target);
    });
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('click', function (e) {
      if (dragged) { dragged = false; e.stopImmediatePropagation(); e.preventDefault(); }
    });
  }

  function hintLine(ctx, words) { ctx.stage.appendChild(el('p', { 'class': 'muted how' }, [words])); }

  function pickTwo(items, kind) {
    var plural = kind + 's';
    return function (ctx) {
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': plural.charAt(0).toUpperCase() + plural.slice(1) });
      var chosen = [];
      var buttons = [];
      var misses = 0;
      function judge(b1, b2) {
        var same = items[buttons.indexOf(b1)].key === items[buttons.indexOf(b2)].key;
        if (same) {
          buttons.forEach(function (x) { x.disabled = true; x.setAttribute('aria-pressed', 'false'); });
          b1.classList.add('done'); b2.classList.add('done');
          ctx.tell('Yes! Those two ' + plural + ' are the same.', 'yes');
          ctx.done(false);
        } else {
          buttons.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          misses += 1;
          nudge(b1); nudge(b2);
          ctx.tell(misses < 2 ? 'Not yet. Those two are different. Try two others.'
            : 'Not yet. Look at the color first. Then look for stripes or dots.', 'try');
        }
        chosen = [];
      }
      items.forEach(function (it) {
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-pressed': 'false', 'aria-label': it.name, 'data-drop': 'pair' });
        b.appendChild(PAIR_THINGS[kind](it.color, it.pattern));
        makeDraggable(b, function (target) {
          if (buttons.indexOf(target) > -1 && !target.disabled) judge(b, target);
        });
        b.addEventListener('click', function () {
          var at = chosen.indexOf(b);
          if (at > -1) { chosen.splice(at, 1); b.setAttribute('aria-pressed', 'false'); return; }
          chosen.push(b);
          b.setAttribute('aria-pressed', 'true');
          if (chosen.length < 2) { ctx.tell('Now find one more that is the same.'); return; }
          judge(chosen[0], chosen[1]);
        });
        tray.appendChild(b);
        buttons.push(b);
      });
      ctx.stage.appendChild(tray);
      hintLine(ctx, 'Drag one ' + kind + ' onto its match, or tap both.');
    };
  }

  function pickOdd(items, oddIndex, rightMsg, hint) {
    return function (ctx) {
      var misses = 0;
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Four things' });
      var buttons = items.map(function (it, i) {
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-label': it.name });
        b.appendChild(it.draw());
        b.addEventListener('click', function () {
          if (i === oddIndex) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('done');
            ctx.tell(rightMsg, 'yes');
            ctx.done(false);
          } else {
            misses += 1;
            nudge(b);
            ctx.tell(misses < 2 ? 'Not yet. That one has friends that look the same.' : 'Not yet. ' + hint, 'try');
          }
        });
        tray.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(tray);
    };
  }

  /* ---------- random helpers: every lesson is made fresh each time ---------- */
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(list) { return list[rnd(list.length)]; }
  function between(lo, hi) { return lo + rnd(hi - lo + 1); }
  function shuffle(list) {
    var a = list.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = rnd(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var COLORS = [
    { name: 'Red', word: 'red', fill: RED },
    { name: 'Blue', word: 'blue', fill: BLUE },
    { name: 'Green', word: 'green', fill: '#3E9B6B' },
    { name: 'Yellow', word: 'yellow', fill: '#E0B93B' },
    { name: 'Purple', word: 'purple', fill: '#7B4FB8' },
    { name: 'Orange', word: 'orange', fill: '#E07B2A' }
  ];
  /* Two colors that are easy to tell apart, also for children who see red and green alike. */
  var CLOSE = ['red green', 'green red', 'red orange', 'orange red', 'green orange', 'orange green', 'blue purple', 'purple blue'];
  function twoColors() {
    var a, b;
    do { a = pick(COLORS); b = pick(COLORS); } while (a === b || CLOSE.indexOf(a.word + ' ' + b.word) > -1);
    return [a, b];
  }
  var SHAPE_NAMES = Object.keys(SHAPES);

  /* Sort six things into two baskets. groups: two of { word, item, basket, wrong, draw(px) }. */
  function sortThings(groups, order) {
    return function (ctx) {
      var selected = null;
      var left = order.length;
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Things to sort' });
      var basketRow = el('div', { 'class': 'baskets' });
      var baskets = {};

      function place(word) {
        var into = baskets[word];
        if (!selected) { ctx.tell('Pick one to move first.'); return; }
        if (selected.group.word !== word) {
          selected.btn.setAttribute('aria-pressed', 'false');
          nudge(selected.btn);
          nudge(baskets[selected.group.word].basket);
          ctx.tell('Not yet. ' + selected.group.wrong + '. Try the ' + selected.group.word + ' basket.', 'try');
          selected = null;
          return;
        }
        tray.removeChild(selected.btn);
        into.box.appendChild(selected.group.small());
        into.basket.setAttribute('aria-label', selected.group.basket + ', ' + into.box.childNodes.length + ' inside');
        selected = null;
        left -= 1;
        if (left === 0) {
          ctx.tell('All sorted! Well done.', 'yes');
          ctx.done(false);
        } else {
          ctx.tell('Yes! ' + left + ' to go.', 'yes');
          var nextOne = tray.querySelector('button');
          if (nextOne) nextOne.focus();
        }
      }

      order.forEach(function (which, i) {
        var g = groups[which];
        var b = el('button', {
          type: 'button', 'class': 'item-btn', 'aria-pressed': 'false', 'data-group': g.word,
          'aria-label': g.item + ' ' + (i + 1)
        });
        b.appendChild(g.big());
        makeDraggable(b, function (target) {
          if (!target.classList.contains('basket')) return;
          if (selected) selected.btn.setAttribute('aria-pressed', 'false');
          selected = { btn: b, group: g };
          place(target.getAttribute('data-group'));
        });
        b.addEventListener('click', function () {
          if (selected) selected.btn.setAttribute('aria-pressed', 'false');
          if (selected && selected.btn === b) { selected = null; return; }
          selected = { btn: b, group: g };
          b.setAttribute('aria-pressed', 'true');
          ctx.tell(g.item + '. Now tap the ' + g.word + ' basket.');
        });
        tray.appendChild(b);
      });

      groups.forEach(function (g) {
        var box = el('div', { 'class': 'held' });
        var basket = el('button', {
          type: 'button', 'class': 'basket', 'data-group': g.word, 'data-drop': 'basket', style: 'border-color:' + g.edge
        }, [g.basket, box]);
        baskets[g.word] = { basket: basket, box: box };
        basket.addEventListener('click', function () { place(g.word); });
        basketRow.appendChild(basket);
      });

      ctx.stage.appendChild(tray);
      ctx.stage.appendChild(basketRow);
      hintLine(ctx, 'Drag with the mouse or a finger. Or tap one, then tap a basket.');
    };
  }

  function question(o) {
    return function (ctx) {
      var first = true;
      var misses = 0;
      var help = el('div', { 'class': 'hint-pic' });
      var holder = el('div', { 'class': 'drop-pic', 'data-drop': 'answer' });
      holder.appendChild(o.draw(false));
      var row = el('div', { 'class': 'num-row', role: 'group', 'aria-label': 'Choose the answer' });
      var buttons = o.options.map(function (n) {
        var b = el('button', { type: 'button', 'class': 'num-btn' }, [String(n)]);
        makeDraggable(b, function (target) { if (target === holder && !b.disabled) b.click(); });
        b.addEventListener('click', function () {
          if (n === o.answer) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('right');
            clear(holder);
            holder.appendChild(o.draw(true));
            holder.classList.remove('look');
            ctx.tell((first ? 'Yes! ' : 'You worked it out! ') + o.explain, 'yes');
            ctx.done(first);
          } else {
            first = false;
            misses += 1;
            b.classList.add('wrong');
            b.disabled = true;
            nudge(b);
            if (misses === 1) {
              holder.classList.add('look');
              ctx.tell('Not yet. ' + o.hint, 'try');
            } else if (o.spec) {
              clear(help);
              help.appendChild(hintDots(o.spec));
              ctx.tell('Not yet. Here are dots to help. ' + dotsCaption(o.spec), 'try');
            }
          }
        });
        row.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(holder);
      ctx.stage.appendChild(help);
      ctx.stage.appendChild(row);
      hintLine(ctx, 'Drag a number onto the picture, or tap it.');
    };
  }

  function playAgain(ctx, label) {
    var again = el('button', { type: 'button', 'class': 'btn' }, [label]);
    again.addEventListener('click', function () { ctx.restart(); });
    ctx.stage.appendChild(el('p', {}, [again]));
  }

  /* ---------- question maker: nothing here is a stored question ----------
     Each call builds a new story, numbers, picture and answer choices. */
  var NAMES = ['Mia', 'Tom', 'Asha', 'Ben', 'Lena', 'Sam', 'Zoe', 'Omar', 'Ivy', 'Leo'];
  var THINGS = ['stickers', 'marbles', 'shells', 'crayons', 'toy cars', 'beads'];
  var AWAY = [
    { thing: 'birds', place: 'on a fence', verb: 'fly away' },
    { thing: 'apples', place: 'in a bowl', verb: 'are eaten' },
    { thing: 'balloons', place: 'at a party', verb: 'pop' },
    { thing: 'ducks', place: 'on a pond', verb: 'swim away' },
    { thing: 'cookies', place: 'on a plate', verb: 'are eaten' }
  ];
  var KINDS = ['add', 'take', 'more'];

  /** Fewer choices (a comfort setting in the child's profile): keeps the right answer and one wrong one. */
  function fewer(list, right) { return window.YSComfort ? window.YSComfort.fewer(list, right) : list; }
  function choices(answer) {
    var near = shuffle([answer - 2, answer - 1, answer + 1, answer + 2]).filter(function (n) { return n >= 0; });
    return fewer([answer, near[0], near[1]].sort(function (a, b) { return a - b; }), answer);
  }

  function makeQuestion(kind, max) {
    var a, b, whole, left, thing, t, n1, n2, names;
    if (kind === 'add') {
      a = between(2, max - 2); b = between(2, max - a); whole = a + b;
      n1 = pick(NAMES); thing = pick(THINGS);
      return {
        kind: kind, answer: whole, options: choices(whole),
        say: [n1 + ' has ' + a + ' ' + thing + '.', n1 + ' gets ' + b + ' more.', 'How many ' + thing + ' now?'],
        hint: 'Start at ' + a + '. Count on ' + b + ' more.',
        explain: a + ' and ' + b + ' make ' + whole + '.',
        spec: { type: 'parts', whole: whole, wholeUnknown: true, parts: [{ v: a, label: 'had' }, { v: b, label: 'more' }] }
      };
    }
    if (kind === 'take') {
      whole = between(5, max); a = between(2, whole - 2); left = whole - a;
      t = pick(AWAY);
      return {
        kind: kind, answer: left, options: choices(left),
        say: ['There are ' + whole + ' ' + t.thing + ' ' + t.place + '.', a + ' ' + t.verb + '.', 'How many are left?'],
        hint: 'What goes with ' + a + ' to make ' + whole + '?',
        explain: a + ' and ' + left + ' make ' + whole + '. So ' + left + ' are left.',
        spec: { type: 'parts', whole: whole, parts: [{ v: a, label: 'gone' }, { v: left, label: 'left', unknown: true }] }
      };
    }
    b = between(2, max - 2); a = between(b + 2, max);
    names = shuffle(NAMES); n1 = names[0]; n2 = names[1]; thing = pick(THINGS);
    return {
      kind: 'more', answer: a - b, options: choices(a - b),
      say: [n1 + ' has ' + a + ' ' + thing + '.', n2 + ' has ' + b + '.', 'How many more does ' + n1 + ' have?'],
      hint: 'Look at the gap. What goes with ' + b + ' to make ' + a + '?',
      explain: b + ' and ' + (a - b) + ' make ' + a + '. So ' + n1 + ' has ' + (a - b) + ' more.',
      spec: { type: 'compare', a: { name: n1, v: a }, b: { name: n2, v: b } }
    };
  }

  /* Second hint for a maths question: the same story as dots to count. */
  function hintDots(spec) {
    var kids = [], step = 16, r = 6.5;
    function x(i) { return 14 + i * step + (i >= 10 ? 6 : 0); }
    function dot(i, y, fill, style) {
      var attrs = { cx: x(i), cy: y, r: r, fill: fill, stroke: INK, 'stroke-width': 1.5 };
      if (style === 'empty') attrs['stroke-dasharray'] = '3 3';
      kids.push(svg('circle', attrs));
      if (style === 'gone') kids.push(svg('path', { d: 'M' + (x(i) - 6) + ' ' + (y + 6) + ' l12 -12', stroke: INK, 'stroke-width': 2 }));
    }
    var i, a, b, h = 30;
    if (spec.type === 'compare') {
      h = 56;
      for (i = 0; i < spec.a.v; i++) dot(i, 14, '#BFE0D8');
      for (i = 0; i < spec.a.v; i++) dot(i, 40, i < spec.b.v ? '#F6E3A1' : '#fff', i < spec.b.v ? '' : 'empty');
    } else if (spec.wholeUnknown) {
      a = spec.parts[0].v; b = spec.parts[1].v;
      for (i = 0; i < a + b; i++) dot(i, 14, i < a ? '#BFE0D8' : '#F6E3A1');
    } else {
      a = spec.parts[0].v;
      for (i = 0; i < spec.whole; i++) dot(i, 14, i < a ? '#E3E3E3' : '#F6E3A1', i < a ? 'gone' : '');
    }
    return svg('svg', { viewBox: '0 0 344 ' + h, width: 344, height: h, role: 'img', 'aria-label': 'Dots to count. ' + dotsCaption(spec) }, kids);
  }
  function dotsCaption(spec) {
    if (spec.type === 'compare') return 'Count the empty circles.';
    return spec.wholeUnknown ? 'Count all the dots.' : 'Some are crossed out. Count the rest.';
  }

  function drawSpec(spec, reveal) {
    return spec.type === 'compare' ? barCompare(spec, reveal) : barPartWhole(spec, reveal);
  }

  /* ---------- number facts for the games (made fresh each round) ---------- */
  function makeFact(kind, max) {
    var a, b, whole;
    if (kind === 'add') {
      a = between(1, max - 1); b = between(1, max - a);
      return {
        text: a + ' + ' + b, answer: a + b, start: a, hop: b,
        hint: 'Start at ' + a + '. Count on ' + b + ' more.',
        spec: { type: 'parts', whole: a + b, wholeUnknown: true, parts: [{ v: a }, { v: b }] }
      };
    }
    whole = between(3, max); a = between(1, whole - 1);
    if (kind === 'take') {
      return {
        text: whole + ' − ' + a, answer: whole - a, start: whole, hop: -a,
        hint: 'Start at ' + whole + '. Count back ' + a + '.',
        spec: { type: 'parts', whole: whole, parts: [{ v: a }, { v: whole - a, unknown: true }] }
      };
    }
    return {
      text: whole + ' − ' + a, answer: whole - a, start: a, hop: whole - a, more: true,
      hint: 'Start at ' + a + '. Count up to ' + whole + '.',
      spec: { type: 'compare', a: { name: '', v: whole }, b: { name: '', v: a } }
    };
  }

  /* One place decides what a miss looks like: words first, then dots. */
  function missHelp(ctx, misses, fact, helpBox, firstHint) {
    if (misses === 1) { ctx.tell('Not yet. ' + (firstHint || fact.hint), 'try'); return; }
    clear(helpBox);
    helpBox.appendChild(hintDots(fact.spec));
    ctx.tell('Not yet. Here are dots to help. ' + dotsCaption(fact.spec), 'try');
  }

  function die(n) {
    var spots = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }[n] || [];
    var kids = [svg('rect', { x: 3, y: 3, width: 66, height: 66, rx: 12, fill: '#fff', stroke: INK, 'stroke-width': 2.5 })];
    spots.forEach(function (p) {
      kids.push(svg('circle', { cx: 18 + ((p - 1) % 3) * 18, cy: 18 + Math.floor((p - 1) / 3) * 18, r: 6, fill: TEAL }));
    });
    if (!n) kids.push(text(36, 46, '?', 30, 700, '#7A8B87'));
    return svg('svg', { viewBox: '0 0 72 72', width: 72, height: 72, role: 'img', 'aria-label': n ? 'Die showing ' + n : 'Die, not rolled yet' }, kids);
  }

  /* Dice game: roll two dice, then add them, take one away, or find how many more.
     With "Up to 10" the dice show 1 to 5, so two dice never add up to more than 10 (SCRUM-419). */
  function diceRound(kind, max) {
    var top = Math.max(2, Math.min(6, Math.floor((max || 12) / 2)));
    return function (ctx) {
      var table = el('div', { 'class': 'dice-table' });
      var ask = el('p', { 'class': 'ask' }, ['Roll the dice!']);
      var help = el('div', { 'class': 'hint-pic' });
      var row = el('div', { 'class': 'num-row', role: 'group', 'aria-label': 'Choose the answer' });
      var roll = el('button', { type: 'button', 'class': 'btn' }, ['Roll']);
      function show(a, b, sign) {
        clear(table);
        table.appendChild(die(a));
        table.appendChild(el('span', { 'class': 'dice-sign' }, [sign]));
        table.appendChild(die(b));
      }
      show(0, 0, kind === 'add' ? '+' : '−');
      roll.addEventListener('click', function () {
        var a = between(1, top), b = between(1, top), t, fact, first = true, misses = 0, buttons;
        if (kind !== 'add') { if (a === b) { if (a > 1) b = a - 1; else a = 2; } if (b > a) { t = a; a = b; b = t; } }
        fact = kind === 'add'
          ? { answer: a + b, spec: { type: 'parts', whole: a + b, wholeUnknown: true, parts: [{ v: a }, { v: b }] } }
          : kind === 'take'
            ? { answer: a - b, spec: { type: 'parts', whole: a, parts: [{ v: b }, { v: a - b, unknown: true }] } }
            : { answer: a - b, spec: { type: 'compare', a: { name: '', v: a }, b: { name: '', v: b } } };
        show(a, b, kind === 'add' ? '+' : '−');
        ask.textContent = kind === 'add' ? 'How many dots altogether?' : kind === 'take' ? 'Take the second die away from the first. How many dots are left?' : 'How many more dots on the first die?';
        roll.disabled = true;
        ctx.tell('');
        buttons = choices(fact.answer).map(function (n) {
          var bn = el('button', { type: 'button', 'class': 'num-btn' }, [String(n)]);
          bn.addEventListener('click', function () {
            if (n === fact.answer) {
              buttons.forEach(function (x) { x.disabled = true; });
              bn.classList.add('right');
              ctx.tell((first ? 'Yes! ' : 'You worked it out! ') + (kind === 'add' ? a + ' and ' + b + ' make ' + (a + b) + '.' : kind === 'take' ? a + ' take away ' + b + ' leaves ' + (a - b) + '.' : a + ' is ' + (a - b) + ' more than ' + b + '.'), 'yes');
              ctx.done(first);
            } else {
              first = false; misses += 1;
              bn.classList.add('wrong'); bn.disabled = true; nudge(bn);
              missHelp(ctx, misses, fact, help, kind === 'add' ? 'Count the dots on both dice.' : kind === 'take' ? 'Count the dots on the first die. Count back the dots on the second.' : 'Match the dots. Count the ones left over.');
            }
          });
          row.appendChild(bn);
          return bn;
        });
        if (buttons[0]) buttons[0].focus();
      });
      ctx.stage.appendChild(table);
      ctx.stage.appendChild(el('p', {}, [roll]));
      ctx.stage.appendChild(ask);
      ctx.stage.appendChild(help);
      ctx.stage.appendChild(row);
    };
  }

  /* Number hunt: find the tile that answers the card. */
  function huntRound(fact, max) {
    return function (ctx) {
      var first = true, misses = 0;
      var pool = [], n;
      for (n = 0; n <= max; n++) if (n !== fact.answer) pool.push(n);
      var tiles = shuffle(shuffle(pool).slice(0, 8).concat([fact.answer]));
      var help = el('div', { 'class': 'hint-pic' });
      var grid = el('div', { 'class': 'hunt-grid', role: 'group', 'aria-label': 'Number tiles' });
      var buttons = tiles.map(function (v) {
        var b = el('button', { type: 'button', 'class': 'tile' }, [String(v)]);
        b.addEventListener('click', function () {
          if (v === fact.answer) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('right');
            ctx.tell((first ? 'Found it! ' : 'You worked it out! ') + fact.text + ' = ' + fact.answer + '.', 'yes');
            ctx.done(first);
          } else {
            first = false; misses += 1;
            b.classList.add('wrong'); b.disabled = true; nudge(b);
            missHelp(ctx, misses, fact, help);
          }
        });
        grid.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(el('p', { 'class': 'fact-card' }, [fact.text + ' = ?']));
      ctx.stage.appendChild(help);
      ctx.stage.appendChild(grid);
    };
  }

  /* Cards and number line: tap the answer on the line. Hints show the hops. */
  function lineRound(fact, max) {
    return function (ctx) {
      var first = true, misses = 0, n;
      var line = el('div', { 'class': 'num-line', role: 'group', 'aria-label': 'Number line from 0 to ' + max });
      var buttons = [];
      function mark() {
        var lo = Math.min(fact.start, fact.start + fact.hop), hi = Math.max(fact.start, fact.start + fact.hop);
        buttons.forEach(function (b, i) {
          if (i === fact.start) b.classList.add('start');
          if (misses > 1 && i > lo && i <= hi && i !== fact.start) b.classList.add('hop');
          if (misses > 1 && fact.hop < 0 && i >= lo && i < hi) b.classList.add('hop');
        });
      }
      for (n = 0; n <= max; n++) (function (v) {
        var b = el('button', { type: 'button', 'class': 'line-btn' }, [String(v)]);
        b.addEventListener('click', function () {
          if (v === fact.answer) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('right');
            ctx.tell((first ? 'Yes! ' : 'You worked it out! ') + fact.text + ' = ' + fact.answer + '.', 'yes');
            ctx.done(first);
          } else {
            first = false; misses += 1;
            nudge(b);
            mark();
            ctx.tell(misses === 1 ? 'Not yet. ' + fact.hint + ' The start is marked.'
              : 'Not yet. ' + fact.hint + ' The hops are colored. Count them.', 'try');
          }
        });
        line.appendChild(b);
        buttons.push(b);
      }(n));
      ctx.stage.appendChild(el('p', { 'class': 'fact-card' }, [fact.text + ' = ?']));
      ctx.stage.appendChild(line);
      hintLine(ctx, 'Tap the answer on the number line.');
    };
  }

  /* Race: each answer moves the runner one square toward the flag. */
  function track(at, total) {
    var kids = [], i, x;
    for (i = 0; i <= total; i++) {
      x = 8 + i * 52;
      kids.push(svg('rect', { x: x, y: 14, width: 46, height: 40, rx: 8, fill: i < at ? '#BFE0D8' : '#fff', stroke: INK, 'stroke-width': 2 }));
      if (i === total) {
        kids.push(svg('path', { d: 'M' + (x + 16) + ' 46 v-26 l18 7 -18 7', fill: '#E0B93B', stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      }
    }
    x = 8 + at * 52 + 23;
    kids.push(svg('circle', { cx: x, cy: 34, r: 13, fill: TEAL, stroke: INK, 'stroke-width': 2 }));
    kids.push(svg('circle', { cx: x - 4, cy: 31, r: 2, fill: '#fff' }));
    kids.push(svg('circle', { cx: x + 4, cy: 31, r: 2, fill: '#fff' }));
    kids.push(svg('path', { d: 'M' + (x - 5) + ' 38 q5 5 10 0', fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }));
    return svg('svg', { viewBox: '0 0 ' + (16 + (total + 1) * 52) + ' 68', width: 16 + (total + 1) * 52, height: 68, role: 'img', 'aria-label': 'Race track. You are on square ' + (at + 1) + ' of ' + (total + 1) + '.' }, kids);
  }

  var READ = 'Read aloud';
  var GROWNUP = 'Grown-up';
  var QUESTIONS = 5;
  var STYLE_NAMES = { questions: 'Story questions', dice: 'Dice game', hunt: 'Number hunt', race: 'Race to the flag', line: 'Cards and number line' };
  var KIND_WORDS = { add: 'Adding means putting two groups together.', take: 'Taking away means some go away.', more: 'How many more? Line them up and look at the extra ones.' };

  /* A short lesson before the game: dots, then the bar picture, then one try. */
  function lessonSteps(kind) {
    var demo = makeQuestion(kind, 10);
    var tryOne = makeQuestion(kind, 10);
    return [
      {
        name: 'Lesson: see it with dots', who: READ,
        say: [KIND_WORDS[kind]].concat(demo.say),
        build: function (ctx) {
          ctx.stage.appendChild(movingPanel(demo.spec));
          ctx.stage.appendChild(el('p', { 'class': 'ask' }, [dotsCaption(demo.spec)]));
          var show = el('button', { type: 'button', 'class': 'btn ghost' }, ['Show me']);
          show.addEventListener('click', function () { show.disabled = true; ctx.tell(demo.explain, 'yes'); });
          ctx.stage.appendChild(el('p', {}, [show]));
          ctx.done(false);
        }
      },
      {
        name: 'Lesson: the bar picture', who: READ,
        say: ['A bar picture shows the same story.', 'The ? is the number we need to find.'],
        build: function (ctx) {
          var holder = el('div');
          holder.appendChild(drawSpec(demo.spec, false));
          var show = el('button', { type: 'button', 'class': 'btn ghost' }, ['Show the answer']);
          show.addEventListener('click', function () {
            clear(holder); holder.appendChild(drawSpec(demo.spec, true));
            show.disabled = true; ctx.tell(demo.explain, 'yes');
          });
          ctx.stage.appendChild(holder);
          ctx.stage.appendChild(el('p', {}, [show]));
          ctx.done(false);
        }
      },
      {
        name: 'Lesson: your turn', who: READ, say: tryOne.say,
        build: question({
          options: tryOne.options, answer: tryOne.answer, hint: tryOne.hint, explain: tryOne.explain, spec: tryOne.spec,
          draw: function (r) { return drawSpec(tryOne.spec, r); }
        })
      }
    ];
  }

  function buildPractice(kind, max, style, lesson) {
    var order = shuffle(KINDS);
    var steps = lesson ? lessonSteps(kind === 'mixed' ? order[0] : kind) : [];
    function kindAt(i) { return kind === 'mixed' ? order[i % order.length] : kind; }
    function addRound(i) {
      var k = kindAt(i), q, fact, label = (style === 'questions' || style === 'race' ? 'Question ' : 'Round ') + (i + 1) + ' of ' + QUESTIONS;
      if (style === 'dice') {
        steps.push({ name: label, who: READ, scored: true, say: ['Roll the dice. Then choose the answer.'], build: diceRound(k, max) });
      } else if (style === 'hunt') {
        fact = makeFact(k, max);
        steps.push({ name: label, who: READ, scored: true, say: ['Hunt for the answer. Tap the right tile.'], build: huntRound(fact, max) });
      } else if (style === 'line') {
        fact = makeFact(k, max);
        steps.push({ name: label, who: READ, scored: true, say: ['Look at the card. Find the answer on the number line.'], build: lineRound(fact, max) });
      } else {
        q = makeQuestion(k, max);
        steps.push({
          name: label, who: READ, scored: true, say: q.say,
          build: function (ctx) {
            if (style === 'race') ctx.stage.appendChild(el('div', { 'class': 'track' }, [track(i, QUESTIONS)]));
            question({
              options: q.options, answer: q.answer, hint: q.hint, explain: q.explain, spec: q.spec,
              draw: function (r) { return drawSpec(q.spec, r); }
            })(ctx);
          }
        });
      }
    }
    var i;
    for (i = 0; i < QUESTIONS; i++) { addRound(i); steps[steps.length - 1].kind = kindAt(i); }
    steps.push({
      name: style === 'race' ? 'You reached the flag!' : 'Well done!', who: GROWNUP, end: true,
      say: ['Ask about one round: “How did you know?”',
        'Then count two groups of things at home and draw a bar for each.'],
      build: info(function (ctx) {
        var n = ctx.stars(), total = ctx.scoredCount();
        if (style === 'race') ctx.stage.appendChild(el('div', { 'class': 'track' }, [track(QUESTIONS, QUESTIONS)]));
        ctx.stage.appendChild(el('p', {}, ['You worked out all ' + total + ' questions. Right on the first try: ' + n + '.']));
        ctx.stage.appendChild(el('p', { 'class': 'stars', 'aria-hidden': 'true' },
          [new Array(n + 1).join('★') + new Array(total - n + 1).join('☆')]));
        playAgain(ctx, 'Keep going');
        ctx.stage.appendChild(el('p', { 'class': 'muted' }, ['Keep going gives five new rounds. Nothing is saved.']));
      })
    });
    return { kicker: 'Maths · ' + STYLE_NAMES[style], steps: steps };
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* Same and different: every part is made fresh each time from many things, colors, shapes and sizes (SCRUM-493). */
  function buildSorting() {
    // 1. Find the same: socks, mittens, cups or hats, in 6 colors and 3 patterns.
    var kind = pick(Object.keys(PAIR_THINGS));
    var designs = [];
    COLORS.forEach(function (c) {
      ['stripes', 'dots', 'plain'].forEach(function (p) {
        designs.push({ key: c.word + p, name: c.name + ' ' + kind + ', ' + p, color: c.fill, pattern: p });
      });
    });
    var three = shuffle(designs).slice(0, 3);
    var pairs = shuffle([three[0], three[1], three[2], three[0]]);

    // 2. Find the different one: by shape, by color or by size.
    var oddAt = rnd(4);
    var how = pick(['shape', 'color', 'size']);
    var shapes = shuffle(SHAPE_NAMES).slice(0, 2);
    var cols = twoColors();
    var bigOdd = rnd(2) === 0;
    var things = [0, 1, 2, 3].map(function (i) {
      var odd = i === oddAt;
      var shape = how === 'shape' && odd ? shapes[1] : shapes[0];
      var color = how === 'color' && odd ? cols[1] : cols[0];
      var big = how === 'size' ? (odd ? bigOdd : !bigOdd) : true;
      var name = (how === 'size' ? (big ? 'Big ' : 'Small ') + color.word : color.name) + ' ' + shape;
      return { name: name, draw: function () { return SHAPES[shape](color.fill, big ? 72 : 40); } };
    });
    var oddWord = how === 'shape' ? shapes[1] : how === 'color' ? cols[1].word + ' ' + shapes[0] : (bigOdd ? 'big ' : 'small ') + shapes[0];
    var oddHint = {
      shape: 'Look at the shapes. Three are the same shape. Which shape is alone?',
      color: 'Look at the colors. Three are the same color. Which color is alone?',
      size: 'Look at the sizes. Three are the same size. Which one is a different size?'
    }[how];

    // 3. Sort into two baskets: by color, by shape or by size.
    var by = pick(['color', 'shape', 'size']);
    var groups;
    if (by === 'color') {
      groups = twoColors().map(function (c) {
        return {
          word: c.word, item: c.name + ' block', basket: c.name + ' basket', wrong: 'That block is ' + c.word, edge: c.fill,
          big: function () { return block(c.fill); }, small: function () { return block(c.fill, 34); }
        };
      });
    } else if (by === 'shape') {
      var c1 = pick(COLORS);
      groups = shuffle(SHAPE_NAMES).slice(0, 2).map(function (s) {
        return {
          word: s, item: cap(s), basket: cap(s) + ' basket', wrong: 'That is a ' + s, edge: INK,
          big: function () { return SHAPES[s](c1.fill, 56); }, small: function () { return SHAPES[s](c1.fill, 34); }
        };
      });
    } else {
      var s1 = pick(SHAPE_NAMES), c2 = pick(COLORS);
      groups = [['big', 60, 34], ['small', 32, 20]].map(function (z) {
        return {
          word: z[0], item: cap(z[0]) + ' ' + s1, basket: cap(z[0]) + ' basket', wrong: 'That ' + s1 + ' is ' + z[0], edge: INK,
          big: function () { return SHAPES[s1](c2.fill, z[1]); }, small: function () { return SHAPES[s1](c2.fill, z[2]); }
        };
      });
    }
    var sortSay = {
      color: 'Drag each block to the basket with the same color.',
      shape: 'Drag each one to the basket with the same shape.',
      size: 'Put the big ones in one basket and the small ones in the other.'
    }[by];
    var order = shuffle([0, 0, 0, 1, 1, 1]);
    var real = pick([
      ['Pair up real socks together.', 'Then share a picture book and name three things in it.'],
      ['Pair up real socks together.', 'Then find three things at home that are the same color.'],
      ['Pair up real socks together.', 'Then sort some spoons: big ones and small ones.']
    ]);

    return {
      kicker: 'Same and different · age 3, with a grown-up',
      steps: [
        { name: 'Find the same', who: READ, say: ['Two ' + kind + 's are the same. Put them together.'], build: pickTwo(pairs, kind) },
        {
          name: 'Find the different one', who: READ, say: ['One is different. Tap it.'],
          build: pickOdd(things, oddAt, 'Yes! The ' + oddWord + ' is different.', oddHint)
        },
        { name: 'Sort by ' + by, who: READ, say: [sortSay], build: sortThings(groups, order) },
        {
          name: 'Now do it for real', who: GROWNUP, end: true,
          say: real,
          build: info(function (ctx) {
            playAgain(ctx, 'Play again');
            ctx.stage.appendChild(el('p', { 'class': 'muted' }, ['Nothing was saved. The game changes each time.']));
          })
        }
      ]
    };
  }

  /* ---------- moving pictures (SCRUM-495): dots that arrive, join, leave or stand out ----------
     The movement is CSS only. With "reduce motion" the final picture shows at once. */
  function movingDots(spec) {
    var kids = [], step = 18, r = 7, t = 0;
    function x(i) { return 16 + i * step + (i >= 10 ? 8 : 0); }
    function dot(i, y, fill, cls, delay, dx) {
      var style = 'animation-delay:' + delay.toFixed(2) + 's' + (dx ? ';--dx:' + dx + 'px' : '');
      kids.push(svg('circle', { cx: x(i), cy: y, r: r, fill: fill, stroke: INK, 'stroke-width': 1.5, 'class': 'mv ' + cls, style: style }));
    }
    var i, a, b, h = 34, label;
    if (spec.type === 'compare') {
      h = 60; a = spec.a.v; b = spec.b.v;
      for (i = 0; i < a; i++) dot(i, 16, '#BFE0D8', 'mv-in', (t = i * 0.12));
      for (i = 0; i < b; i++) dot(i, 44, '#F6E3A1', 'mv-in', 0.3 + i * 0.12);
      for (i = b; i < a; i++) dot(i, 16, '#BFE0D8', 'mv-pulse', t + 0.8);
      label = 'Moving dots. Top row: ' + a + '. Bottom row: ' + b + '. The ' + (a - b) + ' extra in the top row light up.';
    } else if (spec.wholeUnknown) {
      a = spec.parts[0].v; b = spec.parts[1].v;
      for (i = 0; i < a; i++) dot(i, 17, '#BFE0D8', 'mv-in', i * 0.12);
      for (i = a; i < a + b; i++) dot(i, 17, '#F6E3A1', 'mv-slide', a * 0.12 + 0.4, 60);
      label = 'Moving dots. ' + a + ' dots, then ' + b + ' more slide in to join them: ' + (a + b) + ' in all.';
    } else {
      a = spec.parts[0].v;
      for (i = 0; i < spec.whole; i++) dot(i, 17, i < a ? '#E3E3E3' : '#F6E3A1', i < a ? 'mv-away' : 'mv-in', i < a ? 1 + i * 0.15 : i * 0.08);
      label = 'Moving dots. ' + spec.whole + ' dots. ' + a + ' fade away. ' + (spec.whole - a) + ' are left.';
    }
    var w = x(Math.max(spec.whole || 0, spec.a ? spec.a.v : 0, spec.parts ? spec.parts[0].v + spec.parts[1].v : 0)) + 12;
    return svg('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'img', 'class': 'moving', 'aria-label': label }, kids);
  }
  /* A moving picture with a "Watch again" button. */
  function movingPanel(spec) {
    var box = el('div', { 'class': 'moving-box' });
    box.appendChild(movingDots(spec));
    var again = el('button', { type: 'button', 'class': 'btn ghost small-btn' }, ['Watch again']);
    again.addEventListener('click', function () { box.replaceChild(movingDots(spec), box.firstChild); });
    box.appendChild(el('p', {}, [again]));
    return box;
  }
  /* "Show me how": a short visual lesson that opens under any question once the child misses (SCRUM-494). */
  function howPanel(kind) {
    var k = kind === 'mixed' ? 'add' : kind;
    var demo = makeQuestion(k, 10);
    var box = el('section', { 'class': 'how-panel', 'aria-label': 'Short lesson' });
    box.appendChild(el('p', { 'class': 'how-title' }, ['Short lesson']));
    box.appendChild(el('p', {}, [KIND_WORDS[k]]));
    box.appendChild(movingPanel(demo.spec));
    box.appendChild(drawSpec(demo.spec, true));
    box.appendChild(el('p', {}, [demo.explain]));
    box.appendChild(el('p', { 'class': 'muted' }, ['Now try the question above again.']));
    return box;
  }

  /* ---------- Sprouts picks the game (SCRUM-494) ----------
     Easiest first: number hunt, then number line, dice, race, and story questions last (the hardest to read).
     Adding, then taking away, then how many more, then mixed. Up to 10, then up to 20.
     One harder story question is mixed into every set to see if the child can already do it.
     The level moves up after a strong set and down after a hard one. It is kept only on this device. */
  var LADDER = [
    { kind: 'add', max: 10, style: 'hunt' }, { kind: 'add', max: 10, style: 'line' }, { kind: 'add', max: 10, style: 'dice' },
    { kind: 'take', max: 10, style: 'hunt' }, { kind: 'take', max: 10, style: 'line' }, { kind: 'add', max: 20, style: 'hunt' },
    { kind: 'take', max: 20, style: 'dice' }, { kind: 'more', max: 10, style: 'line' }, { kind: 'mixed', max: 20, style: 'race' },
    { kind: 'mixed', max: 20, style: 'questions' }
  ];
  var LEVEL_KEY = 'sprouts:maths-level';
  function childAge() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); return p && +p.age || 0; } catch (e) { return 0; }
  }
  function startLevelFor(age) { return age >= 10 ? 8 : age === 9 ? 7 : age === 8 ? 5 : age === 7 ? 3 : 0; }
  function loadLevel() {
    try {
      var s = JSON.parse(window.localStorage.getItem(LEVEL_KEY) || 'null');
      if (s && s.level >= 0 && s.level < LADDER.length) return s;
    } catch (e) { /* nothing saved */ }
    return { level: startLevelFor(childAge()), kind: null };
  }
  function saveLevel(s) { try { window.localStorage.setItem(LEVEL_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } }
  var STYLE_SAY = {
    dice: 'Roll the dice. Then choose the answer.', hunt: 'Hunt for the answer. Tap the right tile.',
    line: 'Look at the card. Find the answer on the number line.'
  };

  function buildAuto() {
    var saved = loadLevel();
    var live = { level: saved.level, missRun: 0, eased: false, stretch: null };
    var start = LADDER[live.level];
    var firstKind = start.kind === 'mixed' ? 'add' : start.kind;
    var steps = saved.kind !== start.kind ? lessonSteps(firstKind) : [];
    function round(i) {
      var step = { name: 'Question ' + (i + 1) + ' of ' + QUESTIONS, who: READ, scored: true, say: [] };
      step.prepare = function () {
        var stretch = i === 3;
        var lv = stretch ? LADDER[Math.min(live.level + 2, LADDER.length - 1)] : LADDER[live.level];
        var style = stretch ? 'questions' : lv.style;
        var k = lv.kind === 'mixed' ? pick(KINDS) : lv.kind;
        step.kind = k;
        step.stretch = stretch;
        if (style === 'questions' || style === 'race') {
          var q = makeQuestion(k, lv.max);
          step.say = q.say;
          step.build = function (ctx) {
            if (style === 'race') ctx.stage.appendChild(el('div', { 'class': 'track' }, [track(i, QUESTIONS)]));
            question({ options: q.options, answer: q.answer, hint: q.hint, explain: q.explain, spec: q.spec, draw: function (r) { return drawSpec(q.spec, r); } })(ctx);
          };
        } else if (style === 'dice') {
          step.say = [STYLE_SAY.dice]; step.build = diceRound(k, lv.max);
        } else {
          var fact = makeFact(k, lv.max);
          step.say = [STYLE_SAY[style]];
          step.build = style === 'hunt' ? huntRound(fact, lv.max) : lineRound(fact, lv.max);
        }
      };
      step.onResult = function (firstTry) {
        if (step.stretch) { live.stretch = firstTry; return; }
        live.missRun = firstTry ? 0 : live.missRun + 1;
        if (live.missRun >= 2 && live.level > 0) { live.level -= 1; live.missRun = 0; live.eased = true; }
      };
      return step;
    }
    for (var i = 0; i < QUESTIONS; i++) steps.push(round(i));
    steps.push({
      name: 'Well done!', who: GROWNUP, end: true,
      say: ['Ask about one question: “How did you know?”', 'Then count two groups of things at home and draw a bar for each.'],
      build: info(function (ctx) {
        var n = ctx.stars(), total = ctx.scoredCount(), was = live.level, next = was, note;
        if (n >= 4) next = Math.min(was + (n === 5 && live.stretch ? 2 : 1), LADDER.length - 1);
        else if (n <= 2 && !live.eased) next = Math.max(was - 1, 0);
        note = next > was ? 'Next time: a little harder.' : next < was || live.eased ? 'Next time: a little easier.' : 'Next time: about the same, with new questions.';
        saveLevel({ level: next, kind: start.kind });
        ctx.stage.appendChild(el('p', {}, ['You worked out all ' + total + ' questions. Right on the first try: ' + n + '.']));
        ctx.stage.appendChild(el('p', { 'class': 'stars', 'aria-hidden': 'true' }, [new Array(n + 1).join('★') + new Array(total - n + 1).join('☆')]));
        ctx.stage.appendChild(el('p', { id: 'auto-next' }, [note]));
        playAgain(ctx, 'Keep going');
        ctx.stage.appendChild(el('p', { 'class': 'muted' }, ['Yaanstep Sprouts picks the next game from these answers. Only the level is kept, on this device.']));
      })
    });
    return { kicker: 'Maths · picked for you', steps: steps };
  }
  window.yaanstepMathsLadder = LADDER;

  /* ---------- the player ---------- */
  var current = null;   // { maker, lesson, index, stars, opener }

  /* Feedback always comes with a small picture. A mistake is shown as
     "not yet" with a light bulb and a hint, never as a red cross. */
  function moodIcon(mood) {
    var kids = mood === 'yes'
      ? [svg('path', { d: 'M12 2 l2.9 6.2 6.6 .9 -4.8 4.7 1.2 6.7 -5.9 -3.2 -5.9 3.2 1.2 -6.7 -4.8 -4.7 6.6 -.9 z', fill: '#E0B93B', stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' })]
      : [svg('path', { d: 'M12 2.5 a6.5 6.5 0 0 1 3.6 11.9 v2.1 h-7.2 v-2.1 A6.5 6.5 0 0 1 12 2.5 z', fill: '#FFE08A', stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }),
        svg('path', { d: 'M9 19 h6 M10 21.5 h4', fill: 'none', stroke: INK, 'stroke-width': 1.4, 'stroke-linecap': 'round' })];
    return svg('svg', { viewBox: '0 0 24 24', width: 30, height: 30, 'aria-hidden': 'true', focusable: 'false' }, kids);
  }
  function tell(msg, mood) {
    clear(feedbackEl);
    feedbackEl.className = 'feedback' + (mood ? ' ' + mood : '');
    if (!msg) return;
    if (mood) feedbackEl.appendChild(moodIcon(mood));
    feedbackEl.appendChild(el('span', {}, [msg]));
  }
  function nudge(node) {
    if (!node) return;
    node.classList.remove('nudge');
    void node.offsetWidth;
    node.classList.add('nudge');
    setTimeout(function () { node.classList.remove('nudge'); }, 600);
  }

  function render() {
    var lesson = current.lesson;
    var step = lesson.steps[current.index];
    var stepDone = false;
    var offered = false;
    if (step.prepare) step.prepare();
    kickerEl.textContent = lesson.kicker;
    titleEl.textContent = step.name;
    progressEl.textContent = 'Step ' + (current.index + 1) + ' of ' + lesson.steps.length;
    clear(sayEl);
    sayEl.appendChild(el('p', { 'class': 'who' }, [step.who + ':']));
    step.say.forEach(function (line) { sayEl.appendChild(el('p', {}, [line])); });
    clear(stageEl);
    tell('');
    nextBtn.hidden = !!step.end;
    nextBtn.disabled = true;
    step.build({
      stage: stageEl,
      // After a first miss in a scored question, a short visual lesson is always one tap away (SCRUM-494).
      tell: function (msg, mood) {
        tell(msg, mood);
        if (mood === 'try' && step.scored && !offered && !stepDone) {
          offered = true;
          var how = el('button', { type: 'button', 'class': 'btn ghost', id: 'show-how' }, ['Show me how']);
          var slot = el('div', { 'class': 'how-slot' }, [el('p', {}, [how])]);
          how.addEventListener('click', function () {
            clear(slot);
            slot.appendChild(howPanel(step.kind || 'add'));
            var t = slot.querySelector('.how-title'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
          });
          stageEl.appendChild(slot);
        }
      },
      stars: function () { return current.stars; },
      restart: function () { open(current.maker, current.opener); },
      scoredCount: function () {
        return lesson.steps.filter(function (s) { return s.scored; }).length;
      },
      done: function (firstTry) {
        if (stepDone) return;
        stepDone = true;
        if (step.scored && firstTry) current.stars += 1;
        if (step.onResult) step.onResult(!!firstTry);
        nextBtn.disabled = false;
      }
    });
    titleEl.focus();
  }

  function open(maker, opener) {
    current = { maker: maker, lesson: maker(), index: 0, stars: 0, opener: opener };
    player.hidden = false;
    document.body.classList.add('playing');
    render();
    window.scrollTo(0, 0);
  }

  function close() {
    var opener = current && current.opener;
    current = null;
    document.body.classList.remove('playing');
    player.hidden = true;
    clear(stageEl);
    tell('');
    if (opener) opener.focus();
  }

  nextBtn.addEventListener('click', function () {
    if (!current || nextBtn.disabled) return;
    if (current.index < current.lesson.steps.length - 1) {
      current.index += 1;
      render();
    }
  });
  closeBtn.addEventListener('click', close);

  function checked(name, fallback) {
    var box = root.querySelector('input[name="' + name + '"]:checked');
    return box ? box.value : fallback;
  }
  var sortBtn = document.getElementById('start-sorting');
  var mathsBtn = document.getElementById('start-maths');
  if (sortBtn) sortBtn.addEventListener('click', function () { open(buildSorting, sortBtn); });
  var autoBtn = document.getElementById('start-maths-auto');
  if (autoBtn) autoBtn.addEventListener('click', function () { open(buildAuto, autoBtn); });
  if (mathsBtn) mathsBtn.addEventListener('click', function () {
    var kind = checked('kind', 'mixed');
    var max = parseInt(checked('size', '20'), 10);
    var style = checked('style', 'questions');
    var lessonBox = document.getElementById('with-lesson');
    var lesson = lessonBox ? lessonBox.checked : true;
    open(function () { return buildPractice(kind, max, style, lesson); }, mathsBtn);
  });

  /* Used only by the automated test that checks generated questions. */
  window.yaanstepMakeQuestion = makeQuestion;
  window.yaanstepMakeFact = makeFact;

  root.hidden = false;
  if (staticBox) staticBox.hidden = true;
}());
