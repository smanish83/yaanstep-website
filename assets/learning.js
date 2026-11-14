/* Yaanstep learning page: two sample lessons.
   Runs in the browser only. Nothing is stored or sent: no cookies, no
   localStorage, no network requests. All state lives in variables and is
   gone when the page is closed. */
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

  function pickTwo(items) {
    return function (ctx) {
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Socks' });
      var chosen = [];
      var buttons = items.map(function (it) {
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-pressed': 'false', 'aria-label': it.name });
        b.appendChild(sock(it.color, it.pattern));
        b.addEventListener('click', function () {
          var at = chosen.indexOf(b);
          if (at > -1) { chosen.splice(at, 1); b.setAttribute('aria-pressed', 'false'); return; }
          chosen.push(b);
          b.setAttribute('aria-pressed', 'true');
          if (chosen.length < 2) { ctx.tell('Now find one more that is the same.'); return; }
          var same = items[buttons.indexOf(chosen[0])].key === items[buttons.indexOf(chosen[1])].key;
          if (same) {
            buttons.forEach(function (x) { x.disabled = true; });
            chosen.forEach(function (x) { x.classList.add('done'); });
            ctx.tell('Yes! Those two socks are the same.');
            ctx.done(false);
          } else {
            chosen.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            chosen = [];
            ctx.tell('Those two are different. Look again and try two others.');
          }
        });
        tray.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(tray);
    };
  }

  function pickOdd(items, oddIndex, rightMsg) {
    return function (ctx) {
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Four things' });
      var buttons = items.map(function (it, i) {
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-label': it.name });
        b.appendChild(it.draw());
        b.addEventListener('click', function () {
          if (i === oddIndex) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('done');
            ctx.tell(rightMsg);
            ctx.done(false);
          } else {
            ctx.tell('That one has friends that look the same. Which one is not like the others?');
          }
        });
        tray.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(tray);
    };
  }

  function sortBlocks(colors) {
    return function (ctx) {
      var names = { red: 'Red', blue: 'Blue' };
      var fills = { red: RED, blue: BLUE };
      var selected = null;
      var left = colors.length;
      var tray = el('div', { 'class': 'tray', role: 'group', 'aria-label': 'Blocks to sort' });
      var held = {};
      var basketRow = el('div', { 'class': 'baskets' });

      colors.forEach(function (c, i) {
        var b = el('button', {
          type: 'button', 'class': 'item-btn', 'aria-pressed': 'false',
          'aria-label': names[c] + ' block ' + (i + 1)
        });
        b.appendChild(block(fills[c]));
        b.addEventListener('click', function () {
          if (selected) selected.btn.setAttribute('aria-pressed', 'false');
          if (selected && selected.btn === b) { selected = null; return; }
          selected = { btn: b, color: c };
          b.setAttribute('aria-pressed', 'true');
          ctx.tell(names[c] + ' block picked. Which basket does it go in?');
        });
        tray.appendChild(b);
      });

      ['red', 'blue'].forEach(function (c) {
        var box = el('div', { 'class': 'held' });
        var basket = el('button', { type: 'button', 'class': 'basket ' + c }, [names[c] + ' basket', box]);
        held[c] = box;
        basket.addEventListener('click', function () {
          if (!selected) { ctx.tell('Pick a block first, then a basket.'); return; }
          if (selected.color !== c) {
            ctx.tell('That block is ' + selected.color + '. Try the ' + selected.color + ' basket.');
            return;
          }
          tray.removeChild(selected.btn);
          box.appendChild(block(fills[c], 34));
          basket.setAttribute('aria-label', names[c] + ' basket, ' + box.childNodes.length + ' inside');
          selected = null;
          left -= 1;
          if (left === 0) {
            ctx.tell('All sorted! Red with red, blue with blue.');
            ctx.done(false);
          } else {
            ctx.tell('In it goes. ' + left + ' left.');
            var nextBlock = tray.querySelector('button');
            if (nextBlock) nextBlock.focus();
          }
        });
        basketRow.appendChild(basket);
      });

      ctx.stage.appendChild(tray);
      ctx.stage.appendChild(basketRow);
    };
  }

  function observe(choices) {
    return function (ctx) {
      var row = el('div', { 'class': 'observe', role: 'group', 'aria-label': 'How did it go?' });
      var buttons = choices.map(function (c) {
        var b = el('button', { type: 'button', 'aria-pressed': 'false' }, [c.label]);
        b.addEventListener('click', function () {
          buttons.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          ctx.tell(c.reply);
        });
        row.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(row);
      ctx.stage.appendChild(el('p', { 'class': 'muted' }, ['Your answer is not saved. In the full program it would choose tomorrow’s lesson.']));
      ctx.done(false);
    };
  }

  function question(o) {
    return function (ctx) {
      var first = true;
      var holder = el('div');
      holder.appendChild(o.draw(false));
      var row = el('div', { 'class': 'num-row', role: 'group', 'aria-label': 'Choose the answer' });
      var buttons = o.options.map(function (n) {
        var b = el('button', { type: 'button', 'class': 'num-btn' }, [String(n)]);
        b.addEventListener('click', function () {
          if (n === o.answer) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('right');
            clear(holder);
            holder.appendChild(o.draw(true));
            ctx.tell((first ? 'Yes! ' : 'That is it. ') + o.explain);
            ctx.done(first);
          } else {
            first = false;
            b.classList.add('wrong');
            b.disabled = true;
            ctx.tell('Not yet. ' + o.hint);
          }
        });
        row.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(holder);
      ctx.stage.appendChild(row);
    };
  }

  function pickPicture(o) {
    return function (ctx) {
      var first = true;
      var row = el('div', { 'class': 'pick-row', role: 'group', 'aria-label': 'Two bar pictures' });
      var buttons = o.pictures.map(function (p, i) {
        var b = el('button', { type: 'button', 'class': 'item-btn', 'aria-label': 'Picture ' + (i + 1) + '. ' + p.say });
        b.appendChild(p.draw());
        b.addEventListener('click', function () {
          if (i === o.answer) {
            buttons.forEach(function (x) { x.disabled = true; });
            b.classList.add('done');
            ctx.tell((first ? 'Yes! ' : 'That is it. ') + o.explain);
            ctx.done(first);
          } else {
            first = false;
            ctx.tell('Not yet. ' + o.hint);
          }
        });
        row.appendChild(b);
        return b;
      });
      ctx.stage.appendChild(row);
    };
  }

  /* ---------- the two sample lessons ---------- */
  var READ = 'Read this aloud';
  var GROWNUP = 'For the grown-up';

  var LESSONS = {
    sorting: {
      kicker: 'Sample lesson · age 3, with a parent',
      steps: [
        {
          name: 'Before you start', who: GROWNUP,
          say: ['Sit side by side. You read the words in this box aloud and your child taps the pictures.',
            'It takes about four minutes on the screen. Then you share a book and do one small job together.'],
          build: info()
        },
        {
          name: 'Find the same', who: READ,
          say: ['Look at the socks. Can you find two socks that are the same?'],
          build: pickTwo([
            { key: 'a', name: 'Red sock with stripes', color: RED, pattern: 'stripes' },
            { key: 'b', name: 'Blue sock with dots', color: BLUE, pattern: 'dots' },
            { key: 'c', name: 'Plain yellow sock', color: '#E0B93B', pattern: 'plain' },
            { key: 'a', name: 'Red sock with stripes', color: RED, pattern: 'stripes' }
          ])
        },
        {
          name: 'Which one is different?', who: READ,
          say: ['Three of these are the same. One is different. Which one is different?'],
          build: pickOdd([
            { name: 'Green ball', draw: function () { return ball('#3E9B6B'); } },
            { name: 'Green ball', draw: function () { return ball('#3E9B6B'); } },
            { name: 'Orange star', draw: function () { return star('#E58A2B'); } },
            { name: 'Green ball', draw: function () { return ball('#3E9B6B'); } }
          ], 2, 'Yes! The star is different. The others are all balls.')
        },
        {
          name: 'Sort the blocks', who: READ,
          say: ['Red blocks go in the red basket. Blue blocks go in the blue basket.',
            'Tap a block, then tap its basket.'],
          build: sortBlocks(['red', 'blue', 'blue', 'red', 'blue', 'red'])
        },
        {
          name: 'Now a book, away from the screen', who: GROWNUP,
          say: ['Put the screen down and pick any picture book.',
            'Name three things on a page and ask your child to point to each one. Then let your child name one for you to find.',
            'Come back when you have finished.'],
          build: info()
        },
        {
          name: 'How did the sorting go?', who: GROWNUP,
          say: ['This is the check for today. It is not a test. Choose what you saw.'],
          build: observe([
            { label: 'Did it alone', reply: 'Lovely. The next lesson would add a third color.' },
            { label: 'Did it with help', reply: 'That is normal at this age. The next lesson would repeat sorting with new things.' },
            { label: 'Not yet', reply: 'No problem. The next lessons would go back to matching pairs for a few days.' }
          ])
        },
        {
          name: 'One small job together', who: GROWNUP, end: true,
          say: ['Pair up the clean socks together. Hold one up and ask: where is the one that is the same?'],
          build: info(function (ctx) {
            ctx.stage.appendChild(el('p', { 'class': 'offscreen-task' }, ['The lesson is finished. Nothing was saved. Close the screen and go find those socks.']));
          })
        }
      ]
    },

    bars: {
      kicker: 'Sample lesson · age 6',
      steps: [
        {
          name: 'A picture for a problem', who: READ,
          say: ['Mia has 8 stickers. Sam gives her 5 more. How many stickers does Mia have now?',
            'The long line on top is all the stickers. Under it are the two parts: 8 and 5. We need to find the whole.'],
          build: function (ctx) {
            var spec = { whole: 13, wholeUnknown: true, parts: [{ v: 8, label: 'Mia had' }, { v: 5, label: 'Sam gave' }] };
            var holder = el('div');
            holder.appendChild(barPartWhole(spec, false));
            var show = el('button', { type: 'button', 'class': 'btn ghost' }, ['Show the whole']);
            show.addEventListener('click', function () {
              clear(holder);
              holder.appendChild(barPartWhole(spec, true));
              show.disabled = true;
              ctx.tell('8 and 5 make 13. Count on from 8: 9, 10, 11, 12, 13.');
            });
            ctx.stage.appendChild(holder);
            ctx.stage.appendChild(el('p', {}, [show]));
            ctx.done(false);
          }
        },
        {
          name: 'Find the whole', who: READ, scored: true,
          say: ['Tom has 7 red cars and 6 blue cars. How many cars does Tom have?'],
          build: question({
            draw: function (r) { return barPartWhole({ whole: 13, wholeUnknown: true, parts: [{ v: 7, label: 'red cars' }, { v: 6, label: 'blue cars' }] }, r); },
            options: [12, 13, 14], answer: 13,
            hint: 'Put the two parts together. Start at 7 and count on 6 more.',
            explain: '7 and 6 make 13.'
          })
        },
        {
          name: 'Find the missing part', who: READ, scored: true,
          say: ['There are 15 birds on a fence. 9 fly away. How many birds are left?'],
          build: question({
            draw: function (r) { return barPartWhole({ whole: 15, parts: [{ v: 9, label: 'flew away' }, { v: 6, label: 'left', unknown: true }] }, r); },
            options: [5, 6, 7], answer: 6,
            hint: '15 is the whole bar. 9 is one part. What goes with 9 to make 15?',
            explain: '9 and 6 make 15, so 6 birds are left.'
          })
        },
        {
          name: 'Which picture fits?', who: READ, scored: true,
          say: ['Lena has 14 grapes. She eats 5. How many grapes are left?',
            'Do not work it out yet. Which bar picture fits this story?'],
          build: pickPicture({
            pictures: [
              { say: 'Whole bar unknown. Parts 14 and 5.', draw: function () { return barPartWhole({ whole: 19, wholeUnknown: true, parts: [{ v: 14 }, { v: 5 }] }, false); } },
              { say: 'Whole bar 14. Parts 5 and unknown.', draw: function () { return barPartWhole({ whole: 14, parts: [{ v: 5 }, { v: 9, unknown: true }] }, false); } }
            ],
            answer: 1,
            hint: 'Lena starts with 14 grapes. Is 14 the whole, or only a part?',
            explain: '14 is all the grapes, so 14 is the whole bar. 5 is the part she eats.'
          })
        },
        {
          name: 'Now work it out', who: READ, scored: true,
          say: ['Lena has 14 grapes. She eats 5. How many grapes are left?'],
          build: question({
            draw: function (r) { return barPartWhole({ whole: 14, parts: [{ v: 5, label: 'eaten' }, { v: 9, label: 'left', unknown: true }] }, r); },
            options: [8, 9, 10], answer: 9,
            hint: 'What goes with 5 to make 14?',
            explain: '5 and 9 make 14, so 9 grapes are left.'
          })
        },
        {
          name: 'How many more?', who: READ, scored: true,
          say: ['Asha has 12 stickers. Ben has 7 stickers. How many more stickers does Asha have?'],
          build: question({
            draw: function (r) { return barCompare({ a: { name: 'Asha', v: 12 }, b: { name: 'Ben', v: 7 } }, r); },
            options: [4, 5, 6], answer: 5,
            hint: 'Look at the gap after Ben’s bar. What goes with 7 to make 12?',
            explain: '7 and 5 make 12, so Asha has 5 more.'
          })
        },
        {
          name: 'One small job away from the screen', who: READ, end: true,
          say: ['Find two groups of things at home, like spoons and forks. Count each group.',
            'Draw a bar for each group on paper. Then find how many there are altogether.'],
          build: info(function (ctx) {
            var n = ctx.stars(), total = ctx.scoredCount();
            var stars = el('p', { 'class': 'stars', 'aria-hidden': 'true' }, [new Array(n + 1).join('★') + new Array(total - n + 1).join('☆')]);
            ctx.stage.appendChild(el('p', {}, ['Right on the first try: ' + n + ' of ' + total + '.']));
            ctx.stage.appendChild(stars);
            ctx.stage.appendChild(el('p', {}, ['Grown-up: pick one problem and ask, “How did you know?” Explaining matters more than the score.']));
            ctx.stage.appendChild(el('p', { 'class': 'offscreen-task' }, ['The lesson is finished. Nothing was saved.']));
          })
        }
      ]
    }
  };

  /* ---------- the player ---------- */
  var current = null;   // { id, lesson, index, stars, opener }

  function tell(msg) { feedbackEl.textContent = msg; }

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

  function open(id, opener) {
    current = { id: id, lesson: LESSONS[id], index: 0, stars: 0, opener: opener };
    player.hidden = false;
    render();
    if (player.scrollIntoView) player.scrollIntoView({ block: 'start' });
  }

  function close() {
    var opener = current && current.opener;
    current = null;
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

  Array.prototype.forEach.call(root.querySelectorAll('[data-start]'), function (btn) {
    btn.addEventListener('click', function () { open(btn.getAttribute('data-start'), btn); });
  });

  root.hidden = false;
  if (staticBox) staticBox.hidden = true;
}());
