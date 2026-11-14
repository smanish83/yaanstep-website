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

  /* ---------- pictures ---------- */
  function sock(color, pattern) {
    var kids = [svg('path', {
      d: 'M22 6 h24 v40 q0 6 6 8 l10 4 q10 4 8 14 q-2 8 -12 8 h-26 q-12 0 -12 -12 z',
      fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round'
    })];
    if (pattern === 'stripes') {
      kids.push(svg('rect', { x: 22, y: 14, width: 24, height: 5, fill: '#fff' }));
      kids.push(svg('rect', { x: 22, y: 26, width: 24, height: 5, fill: '#fff' }));
    } else if (pattern === 'dots') {
      [[30, 16], [40, 26], [30, 36]].forEach(function (p) {
        kids.push(svg('circle', { cx: p[0], cy: p[1], r: 3.5, fill: '#fff' }));
      });
    }
    return svg('svg', { viewBox: '0 0 80 86', width: 72, height: 78, 'aria-hidden': 'true', focusable: 'false' }, kids);
  }
  function ball(color) {
    return svg('svg', { viewBox: '0 0 80 80', width: 72, height: 72, 'aria-hidden': 'true', focusable: 'false' }, [
      svg('circle', { cx: 40, cy: 40, r: 30, fill: color, stroke: INK, 'stroke-width': 2 }),
      svg('path', { d: 'M22 30 q18 -16 36 0', fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' })
    ]);
  }
  function star(color) {
    return svg('svg', { viewBox: '0 0 80 80', width: 72, height: 72, 'aria-hidden': 'true', focusable: 'false' }, [
      svg('path', {
        d: 'M40 8 l9.5 20 22 3 -16 15.5 4 22 -19.5 -10.5 -19.5 10.5 4 -22 -16 -15.5 22 -3 z',
        fill: color, stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round'
      })
    ]);
  }
  function block(color, size) {
    var s = size || 56;
    return svg('svg', { viewBox: '0 0 60 60', width: s, height: s, 'aria-hidden': 'true', focusable: 'false' }, [
      svg('rect', { x: 6, y: 6, width: 48, height: 48, rx: 8, fill: color, stroke: INK, 'stroke-width': 2 }),
      svg('rect', { x: 14, y: 14, width: 14, height: 8, rx: 3, fill: '#fff', opacity: 0.6 })
    ]);
  }

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

  function pickTwo(items) {
    return function (ctx) {
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Socks' });
      var chosen = [];
      var buttons = [];
      var misses = 0;
      function judge(b1, b2) {
        var same = items[buttons.indexOf(b1)].key === items[buttons.indexOf(b2)].key;
        if (same) {
          buttons.forEach(function (x) { x.disabled = true; x.setAttribute('aria-pressed', 'false'); });
          b1.classList.add('done'); b2.classList.add('done');
          ctx.tell('Yes! Those two socks are the same.', 'yes');
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
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-pressed': 'false', 'aria-label': it.name, 'data-drop': 'sock' });
        b.appendChild(sock(it.color, it.pattern));
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
      hintLine(ctx, 'Drag one sock onto its match, or tap both.');
    };
  }

  function pickOdd(items, oddIndex, rightMsg) {
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
            ctx.tell(misses < 2 ? 'Not yet. That one has friends that look the same.'
              : 'Not yet. Look at the shapes. Three are the same shape. Which shape is alone?', 'try');
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
    { name: 'Yellow', word: 'yellow', fill: '#E0B93B' }
  ];

  function sortBlocks(pair, order) {
    return function (ctx) {
      var selected = null;
      var left = order.length;
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Blocks to sort' });
      var basketRow = el('div', { 'class': 'baskets' });
      var baskets = {};

      function place(word) {
        var into = baskets[word];
        if (!selected) { ctx.tell('Pick a block first.'); return; }
        if (selected.color.word !== word) {
          selected.btn.setAttribute('aria-pressed', 'false');
          nudge(selected.btn);
          nudge(baskets[selected.color.word].basket);
          ctx.tell('Not yet. That block is ' + selected.color.word + '. Try the ' + selected.color.word + ' basket.', 'try');
          selected = null;
          return;
        }
        tray.removeChild(selected.btn);
        into.box.appendChild(block(selected.color.fill, 34));
        into.basket.setAttribute('aria-label', selected.color.name + ' basket, ' + into.box.childNodes.length + ' inside');
        selected = null;
        left -= 1;
        if (left === 0) {
          ctx.tell('All sorted! Well done.', 'yes');
          ctx.done(false);
        } else {
          ctx.tell('Yes! ' + left + ' to go.', 'yes');
          var nextBlock = tray.querySelector('button');
          if (nextBlock) nextBlock.focus();
        }
      }

      order.forEach(function (which, i) {
        var c = pair[which];
        var b = el('button', {
          type: 'button', 'class': 'item-btn', 'aria-pressed': 'false', 'data-color': c.word,
          'aria-label': c.name + ' block ' + (i + 1)
        });
        b.appendChild(block(c.fill));
        makeDraggable(b, function (target) {
          var word = target.getAttribute('data-color');
          if (!target.classList.contains('basket')) return;
          if (selected) selected.btn.setAttribute('aria-pressed', 'false');
          selected = { btn: b, color: c };
          place(word);
        });
        b.addEventListener('click', function () {
          if (selected) selected.btn.setAttribute('aria-pressed', 'false');
          if (selected && selected.btn === b) { selected = null; return; }
          selected = { btn: b, color: c };
          b.setAttribute('aria-pressed', 'true');
          ctx.tell(c.name + ' block. Now tap the ' + c.word + ' basket.');
        });
        tray.appendChild(b);
      });

      pair.forEach(function (c) {
        var box = el('div', { 'class': 'held' });
        var basket = el('button', {
          type: 'button', 'class': 'basket', 'data-color': c.word, 'data-drop': 'basket', style: 'border-color:' + c.fill
        }, [c.name + ' basket', box]);
        baskets[c.word] = { basket: basket, box: box };
        basket.addEventListener('click', function () { place(c.word); });
        basketRow.appendChild(basket);
      });

      ctx.stage.appendChild(tray);
      ctx.stage.appendChild(basketRow);
      hintLine(ctx, 'Drag with the mouse or a finger. Or tap a block, then tap a basket.');
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

  function choices(answer) {
    var near = shuffle([answer - 2, answer - 1, answer + 1, answer + 2]).filter(function (n) { return n >= 0; });
    return [answer, near[0], near[1]].sort(function (a, b) { return a - b; });
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

  /* Dice game: roll two dice, then add them or find how many more. */
  function diceRound(kind) {
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
        var a = between(1, 6), b = between(1, 6), t, fact, first = true, misses = 0, buttons;
        if (kind !== 'add') { while (a === b) b = between(1, 6); if (b > a) { t = a; a = b; b = t; } }
        fact = kind === 'add'
          ? { answer: a + b, spec: { type: 'parts', whole: a + b, wholeUnknown: true, parts: [{ v: a }, { v: b }] } }
          : { answer: a - b, spec: { type: 'compare', a: { name: '', v: a }, b: { name: '', v: b } } };
        show(a, b, kind === 'add' ? '+' : '−');
        ask.textContent = kind === 'add' ? 'How many dots altogether?' : 'How many more dots on the first die?';
        roll.disabled = true;
        ctx.tell('');
        buttons = choices(fact.answer).map(function (n) {
          var bn = el('button', { type: 'button', 'class': 'num-btn' }, [String(n)]);
          bn.addEventListener('click', function () {
            if (n === fact.answer) {
              buttons.forEach(function (x) { x.disabled = true; });
              bn.classList.add('right');
              ctx.tell((first ? 'Yes! ' : 'You worked it out! ') + (kind === 'add' ? a + ' and ' + b + ' make ' + (a + b) + '.' : a + ' is ' + (a - b) + ' more than ' + b + '.'), 'yes');
              ctx.done(first);
            } else {
              first = false; misses += 1;
              bn.classList.add('wrong'); bn.disabled = true; nudge(bn);
              missHelp(ctx, misses, fact, help, kind === 'add' ? 'Count the dots on both dice.' : 'Match the dots. Count the ones left over.');
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
          ctx.stage.appendChild(hintDots(demo.spec));
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
        steps.push({ name: label, who: READ, scored: true, say: ['Roll the dice. Then choose the answer.'], build: diceRound(k === 'add' ? 'add' : 'more') });
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
    for (i = 0; i < QUESTIONS; i++) addRound(i);
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

  function buildSorting() {
    var patterns = ['stripes', 'dots', 'plain'];
    var designs = [];
    COLORS.forEach(function (c) {
      patterns.forEach(function (p) {
        designs.push({ key: c.word + p, name: c.name + ' sock, ' + p, color: c.fill, pattern: p });
      });
    });
    var three = shuffle(designs).slice(0, 3);
    var socks = shuffle([three[0], three[1], three[2], three[0]]);

    var shapes = shuffle([
      { word: 'ball', draw: ball }, { word: 'star', draw: star }, { word: 'block', draw: function (f) { return block(f, 72); } }
    ]);
    var two = shuffle(COLORS);
    var oddAt = rnd(4);
    var things = [0, 1, 2, 3].map(function (i) {
      var shape = i === oddAt ? shapes[1] : shapes[0];
      var color = i === oddAt ? two[1] : two[0];
      return { name: color.name + ' ' + shape.word, draw: function () { return shape.draw(color.fill); } };
    });

    var pair = shuffle(COLORS).slice(0, 2);
    var order = shuffle([0, 0, 0, 1, 1, 1]);

    return {
      kicker: 'Same and different · age 3, with a grown-up',
      steps: [
        { name: 'Find the same', who: READ, say: ['Two socks are the same. Put them together.'], build: pickTwo(socks) },
        {
          name: 'Find the different one', who: READ, say: ['One is different. Tap it.'],
          build: pickOdd(things, oddAt, 'Yes! The ' + shapes[1].word + ' is different.')
        },
        {
          name: 'Sort by color', who: READ,
          say: ['Drag each block to the basket with the same color.'],
          build: sortBlocks(pair, order)
        },
        {
          name: 'Now do it for real', who: GROWNUP, end: true,
          say: ['Pair up real socks together.', 'Then share a picture book and name three things in it.'],
          build: info(function (ctx) {
            playAgain(ctx, 'Play again');
            ctx.stage.appendChild(el('p', { 'class': 'muted' }, ['Nothing was saved. The game changes each time.']));
          })
        }
      ]
    };
  }

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
      tell: tell,
      stars: function () { return current.stars; },
      restart: function () { open(current.maker, current.opener); },
      scoredCount: function () {
        return lesson.steps.filter(function (s) { return s.scored; }).length;
      },
      done: function (firstTry) {
        if (stepDone) return;
        stepDone = true;
        if (step.scored && firstTry) current.stars += 1;
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
