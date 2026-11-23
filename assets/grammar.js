/* Yaanstep Sprouts: grammar, how sentences work (Manish, 23 Nov 2026; SCRUM-516).
   Topics live in assets/grammar/*.js (window.YS_GRAMMAR): naming words, doing words, describing words, plurals, pronouns,
   tenses, how words, capitals and periods, ? and !, building sentences, whole sentences and pieces (fragments), joining
   words, commas and quotes, subject and predicate. All text is the Yaanstep team's own.
   Each topic has a short lesson, one part at a time, with the words colored by what they do, and practice.
   Practice starts at the child's age and moves up after two right answers in a row, down after a miss. English points with
   a child profile only (YSPoints, through the shared shell). Speech uses the device's own voice.
   Games (Manish, 23 Nov 2026): mixed-up words (then or than?), fill in the blanks for every topic (each blank also joins its
   own topic's practice), and Punctuation detective (tap the gap where a mark goes, and see and hear how marks change
   what a sentence means). */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle;
  var ALL = (window.YS_GRAMMAR || []).slice();
  // Each fill-in-the-blank question names its topic (t); it is played in "Fill in the blanks" and in that topic's practice too.
  ALL.forEach(function (t) {
    t.q.forEach(function (q) {
      if (!q.t || q.t === t.id) return;
      var home = ALL.filter(function (x) { return x.id === q.t; })[0];
      if (home && home.q.indexOf(q) < 0) home.q.push(q);
    });
  });
  function minAge(t) { return +t.ages.split('-')[0]; }
  function maxAge(t) { return +t.ages.split('-')[1]; }
  ALL.sort(function (a, b) { return minAge(a) - minAge(b); });
  var LABEL = { noun: 'naming', verb: 'doing', adjective: 'describing', adverb: 'how', pronoun: 'stands for', joining: 'joining',
    mark: 'mark', capital: 'capital', subject: 'who or what', predicate: 'what happens', piece: 'a piece', whole: 'whole', mixup: 'tricky word', blank: 'the gap' };
  var COLOR = { noun: '#2F6FBF', verb: '#C2410C', adjective: '#6D28D9', adverb: '#BE185D', pronoun: '#1F7A6D', joining: '#B7791F',
    mark: '#B7791F', capital: '#B7791F', subject: '#2F6FBF', predicate: '#C2410C', piece: '#B91C1C', whole: '#1b7a3d', mixup: '#0E7490', blank: '#475569' };
  var topic = null, cfg = { rounds: { lesson: 1, play: 8 } }, ctxRef = null;
  var level = 6, streak = 0, missed = false, asked = [];

  function $(id) { return document.getElementById(id); }
  function words(s) { return s.split(/\s+/).filter(Boolean); }
  function childAge() {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); return p && +p.age >= 3 && +p.age <= 12 ? +p.age : 0; } catch (e) { return 0; }
  }
  /** A small picture for a topic: three word blocks, the middle one in the topic's color. */
  function icon(tag) {
    var c = COLOR[tag] || '#1F7A6D';
    return svgEl('<rect x="2" y="22" width="18" height="20" rx="4" fill="#fff" stroke="#8aa49b" stroke-width="2"/><rect x="23" y="16" width="20" height="32" rx="5" fill="' + c + '"/><rect x="46" y="22" width="16" height="20" rx="4" fill="#fff" stroke="#8aa49b" stroke-width="2"/>', '0 0 64 64');
  }
  /** A sentence as word blocks; words at the indexes in hi are colored with tag. */
  function sentenceEl(s, hi, tag, cls) {
    var box = el('div', { 'class': cls || 'sentence' });
    words(s).forEach(function (w, i) {
      var on = (hi || []).indexOf(i) > -1;
      var b = el('span', { 'class': 'wb' + (on && tag ? ' ' + tag : ''), style: S.delay(0.12 * i) });
      b.appendChild(el('span', {}, w));
      if (on && tag) b.appendChild(el('small', {}, LABEL[tag] || tag));
      box.appendChild(b);
    });
    return box;
  }
  function changeEl(pair) {
    var a = pair[0], b = pair[1], same = 0;
    while (same < a.length && same < b.length && a[same] === b[same]) same++;
    var box = el('div', { 'class': 'change' });
    box.appendChild(el('span', { 'class': 'wb' }, a));
    box.appendChild(el('span', { 'class': 'arrow', 'aria-hidden': 'true' }, '→'));
    var after = el('span', { 'class': 'wb', style: S.delay(0.4) });
    after.appendChild(document.createTextNode(b.slice(0, same)));
    if (b.slice(same)) after.appendChild(el('span', { 'class': 'new' }, b.slice(same)));
    box.appendChild(after);
    return box;
  }

  /* ---------- the lesson: one part per step ---------- */
  function lesson(area, ctx) {
    var i = ctx.round(), p = topic.learn[i];
    $('count').textContent = 'Part ' + (i + 1) + ' of ' + topic.learn.length;
    ctx.set({ part: i });
    ctx.ask(area, p.title, p.title + '. ' + p.text + (p.s ? ' For example: ' + p.s : p.change ? ' ' + p.change[0] + ' becomes ' + p.change[1] + '.' : ''));
    if (p.s) area.appendChild(sentenceEl(p.s, p.hi, p.tag || topic.tag));
    if (p.change) area.appendChild(changeEl(p.change));
    area.appendChild(el('p', { 'class': 'explain', id: 'lesson-text' }, p.text));
    if (p.more && p.more.length) {
      area.appendChild(el('p', { 'class': 'nexthead' }, 'More examples'));
      var ul = el('ul', { 'class': 'moreex' });
      p.more.forEach(function (m) {
        var li = el('li', {});
        var b = el('button', { type: 'button', 'class': 'small' }, 'Hear');
        b.appendChild(el('span', { 'class': 'sr' }, ': ' + m));
        b.addEventListener('click', function () { ctx.say(m); });
        li.appendChild(document.createTextNode(m + ' '));
        li.appendChild(b);
        ul.appendChild(li);
      });
      area.appendChild(ul);
    }
    var more = $('more');
    if (i < topic.learn.length - 1) { more.textContent = 'Next part'; more.hidden = false; }
    else {
      more.hidden = true;
      var go = el('button', { type: 'button', 'class': 'primary', id: 'to-practice' }, 'Now practice');
      go.addEventListener('click', function () { $('play-play').click(); var f = $('area').querySelector('button'); if (f) f.focus(); });
      var row = el('div', { 'class': 'row center' }); row.appendChild(go); area.appendChild(row);
    }
    if (i > 0) {
      var back = el('button', { type: 'button', 'class': 'small', id: 'prevpart' }, 'Back a step');
      back.addEventListener('click', function () { lessonFrom = i - 1; $('play-lesson').click(); });
      area.appendChild(back);
    }
  }
  var lessonFrom = 0;

  /* ---------- practice ---------- */
  function choose() {
    var qs = topic.q, lo = Math.max(minAge(topic), level - 2);
    var pool = qs.filter(function (q) { return q.age <= level && q.age >= lo && asked.indexOf(q) < 0; });
    if (pool.length < 2) pool = qs.filter(function (q) { return q.age <= Math.max(level, minAge(topic)) && asked.indexOf(q) < 0; });
    if (!pool.length) pool = qs.filter(function (q) { return asked.indexOf(q) < 0; });
    if (!pool.length) { asked = []; pool = qs; }
    var q = pool[rnd(pool.length)];
    asked.push(q); if (asked.length > Math.min(12, qs.length - 1)) asked.shift();
    return q;
  }
  /** Where practice starts: the child's age (6 without a profile), kept inside the topic's ages. */
  function startAt() { return Math.min(maxAge(topic), Math.max(minAge(topic), childAge() || 6)); }
  function right(ctx, text) {
    if (!missed) { streak++; if (streak >= 2) { level = Math.min(maxAge(topic), level + 1); streak = 0; } }
    ctx.win(text);
  }
  function wrong(ctx, b, text, q) {
    if (!missed) { missed = true; streak = 0; level = Math.max(minAge(topic), level - 1); }
    ctx.miss(b, text, function (box) {
      box.appendChild(el('p', { id: 'lesson-say' }, q.why));
      var parts = topic.learn.filter(function (p) { return p.s || p.change; });
      var p = parts[rnd(parts.length)];
      box.appendChild(el('p', { 'class': 'muted' }, p.text));
      if (p.s) box.appendChild(sentenceEl(p.s, p.hi, p.tag || topic.tag));
      else box.appendChild(changeEl(p.change));
    });
  }
  function gapped(q) { return !!q.s && q.s.indexOf('___') > -1; }
  /** After a right answer, the gap shows the word that fits, so the child reads the whole sentence. */
  function fillGap(q) {
    var g = $('gap'); if (!g || !gapped(q)) return;
    var at = q.s.indexOf('___');
    g.textContent = q.s.slice(0, at);
    g.appendChild(el('mark', { 'class': 'filled' }, q.ans));
    g.appendChild(document.createTextNode(q.s.slice(at + 3)));
  }
  /* Small pictures for Punctuation detective: what the right sentence does. */
  var PIC = {
    ask: '<path d="M8 10h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H26l-12 10v-10H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#E3EEFB" stroke="#2F6FBF" stroke-width="3"/><text x="32" y="38" font-size="26" font-weight="800" text-anchor="middle" fill="#1E4F8F">?</text>',
    tell: '<path d="M8 10h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H26l-12 10v-10H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#E2F4EF" stroke="#1F7A6D" stroke-width="3"/><circle cx="32" cy="32" r="4" fill="#0B4F46"/>',
    wow: '<path d="M32 4l7 14 15-5-6 15 13 7-14 6 5 15-15-6-5 14-5-14-15 6 5-15-14-6 13-7-6-15 15 5z" fill="#FFF6D6" stroke="#B7791F" stroke-width="3"/><text x="32" y="42" font-size="26" font-weight="800" text-anchor="middle" fill="#7a5a00">!</text>',
    talkto: '<circle cx="14" cy="38" r="8" fill="#F1E8FF" stroke="#6D28D9" stroke-width="3"/><path d="M4 60c2-8 18-8 20 0" fill="#F1E8FF" stroke="#6D28D9" stroke-width="3"/><circle cx="50" cy="38" r="8" fill="#FFEDE0" stroke="#C2410C" stroke-width="3"/><path d="M40 60c2-8 18-8 20 0" fill="#FFEDE0" stroke="#C2410C" stroke-width="3"/><path d="M12 6h30a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H26l-8 6v-6h-6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" fill="#fff" stroke="#6D28D9" stroke-width="3"/><path d="M44 16l10 10" stroke="#6D28D9" stroke-width="3" stroke-linecap="round"/>',
    list: '<circle cx="12" cy="16" r="5" fill="#2F6FBF"/><circle cx="12" cy="32" r="5" fill="#C2410C"/><circle cx="12" cy="48" r="5" fill="#1F7A6D"/><path d="M24 16h32M24 32h32M24 48h32" stroke="#8aa49b" stroke-width="5" stroke-linecap="round"/>',
    own: '<rect x="10" y="24" width="36" height="32" rx="6" fill="#FFEDE0" stroke="#C2410C" stroke-width="3"/><path d="M20 24v-6a8 8 0 0 1 16 0v6" fill="none" stroke="#C2410C" stroke-width="3"/><path d="M44 30l14-6 4 10-14 6z" fill="#FFF6D6" stroke="#B7791F" stroke-width="3"/><circle cx="50" cy="31" r="2" fill="#7a5a00"/>',
    short: '<rect x="4" y="22" width="22" height="22" rx="4" fill="#E3EEFB" stroke="#2F6FBF" stroke-width="3"/><rect x="38" y="22" width="22" height="22" rx="4" fill="#E3EEFB" stroke="#2F6FBF" stroke-width="3"/><text x="32" y="30" font-size="30" font-weight="800" text-anchor="middle" fill="#B7791F">\u2019</text>',
    says: '<path d="M8 10h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H26l-12 10v-10H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#F1E8FF" stroke="#6D28D9" stroke-width="3"/><text x="32" y="42" font-size="30" font-weight="800" text-anchor="middle" fill="#5B21B6">\u201C \u201D</text>',
    pause: '<circle cx="32" cy="30" r="22" fill="#FFF6D6" stroke="#B7791F" stroke-width="3"/><text x="32" y="44" font-size="40" font-weight="800" text-anchor="middle" fill="#7a5a00">,</text>'
  };
  /** The sentence for "place": full with one copy of the mark taken off the end of a word. */
  function placeParts(q) {
    var ws = words(q.full), hits = [];
    ws.forEach(function (w, i) { if (w.slice(-1) === q.mark && !(q.mark === '.' && /\.\.$/.test(w))) hits.push(i); });
    var at = hits[q.nth || 0];
    var bare = ws.slice(); bare[at] = bare[at].slice(0, -1);
    return { words: bare, at: at };
  }
  var MARKNAME = { '.': 'period', ',': 'comma', '?': 'question mark', '!': 'exclamation mark' };
  function optTile(o) { return el('span', { 'class': o.length > 12 ? 'optext' : 'wordtile small-word' }, o); }
  function long(opts) { return opts.some(function (o) { return o.length > 12; }); }
  var DRAW = {
    pick: function (area, ctx, q) {
      ctx.ask(area, q.q, q.q + (q.s ? ' ' + q.s.replace(/_{2,}/g, 'blank') : '') + ' ' + q.opts.join(', or ') + '?');
      if (q.s) area.appendChild(el('p', { 'class': 'gap', id: 'gap' }, q.s));
      var row = ctx.tiles(shuffle(q.opts), optTile, function (o, b) {
        if (o === q.ans) { b.classList.add('right'); fillGap(q); right(ctx, 'Yes! ' + (gapped(q) ? q.s.replace('___', q.ans) + ' ' : '') + q.why); }
        else wrong(ctx, b, 'Not that one. Try again.', q);
      }, function (o) { return o; }, long(q.opts) ? 'tiles stack' : 'tiles');
      area.appendChild(row);
      ctx.set({ k: 'pick', ans: q.ans, right: [q.ans], level: level });
    },
    tap: function (area, ctx, q) {
      var ws = words(q.s);
      ctx.ask(area, q.q, q.q + ' ' + q.s);
      // Every word stays on screen: the sentence must be whole, so these tiles are not cut down.
      var row = ctx.tiles(ws.map(function (w, i) { return i; }), function (i) { return el('span', { 'class': 'wordtile' }, ws[i]); }, function (i, b) {
        if (q.ans.indexOf(i) > -1) { b.classList.add('right'); right(ctx, 'Yes! ' + q.why); }
        else wrong(ctx, b, 'You tapped "' + ws[i].replace(/[.,!?"]/g, '') + '". Try again.', q);
      }, function (i) { return ws[i]; }, 'tapline');
      area.appendChild(row);
      ctx.set({ k: 'tap', ans: q.ans[0], right: q.ans, level: level });
    },
    build: function (area, ctx, q) {
      var got = 0, list = q.words, order = shuffle(list.map(function (w, i) { return i; }));
      if (order.every(function (v, i) { return v === i; })) order.reverse();
      ctx.ask(area, 'Put the words in order to make a sentence.', 'Put the words in order to make a sentence: ' + list.join(' '));
      var tray = el('div', { 'class': 'sentence built split', id: 'built' });
      area.appendChild(tray);
      var row = el('div', { 'class': 'tapline', id: 'pool' });
      order.forEach(function (i) {
        var b = el('button', { type: 'button', 'class': 'tile', 'data-w': list[i] }, list[i]);
        b.addEventListener('click', function () {
          if (ctx.solved()) return;
          if (list[i] === list[got]) {
            got++; b.remove();
            tray.appendChild(el('span', { 'class': 'wb' }, list[i]));
            if (got === list.length) right(ctx, 'Yes! ' + list.join(' ') + ' ' + q.why);
            else { var f = row.querySelector('button'); if (f) f.focus(); }
          } else wrong(ctx, null, '"' + list[i] + '" comes later. Which word comes next?', q);
        });
        row.appendChild(b);
      });
      area.appendChild(row);
      ctx.set({ k: 'build', words: list, level: level });
    },
    whole: function (area, ctx, q) {
      ctx.ask(area, 'Is this a whole sentence, or a piece?', 'Is this a whole sentence, or a piece? ' + q.s);
      area.appendChild(el('p', { 'class': 'gap', id: 'gap' }, q.s));
      var pics = {
        whole: '<circle cx="32" cy="32" r="24" fill="#E6F6EA" stroke="#1b7a3d" stroke-width="4"/><path d="M20 33l8 8 16-18" stroke="#1b7a3d" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
        piece: '<path d="M32 8A24 24 0 0 1 56 32H32z" fill="#FFF1F1" stroke="#B91C1C" stroke-width="4" stroke-dasharray="6 4"/><path d="M28 12A22 22 0 1 0 52 36H28z" fill="none" stroke="#c4b5b5" stroke-width="3" stroke-dasharray="3 5"/>'
      };
      var names = { whole: 'A whole sentence', piece: 'A piece of a sentence' };
      var ans = q.whole ? 'whole' : 'piece';
      var row = ctx.tiles(['whole', 'piece'], function (k) {
        var s = el('span', { 'class': 'w' }); s.appendChild(svgEl(pics[k], '0 0 64 64')); s.appendChild(el('span', {}, names[k])); return s;
      }, function (k, b) {
        if (k !== ans) { wrong(ctx, b, q.whole ? 'It is whole: it says who or what, and what happens. Try again.' : 'Something is missing. Try again.', q); return; }
        b.classList.add('right');
        if (q.whole) { right(ctx, 'Yes, a whole sentence! ' + q.why); return; }
        // A piece: now fix it.
        ctx.setSub('Yes, it is a piece. ' + q.why + ' Which one fixes it?', 'yes');
        ctx.say('Yes, it is a piece. ' + q.why + ' Which one fixes it?');
        Array.prototype.forEach.call(row.querySelectorAll('button'), function (x) { x.disabled = true; });
        var fix = ctx.tiles(shuffle(q.opts), optTile, function (o, b2) {
          if (o === q.fix) { b2.classList.add('right'); right(ctx, 'Yes! ' + q.fix); }
          else wrong(ctx, b2, 'That is still not a whole sentence. Try again.', q);
        }, function (o) { return o; }, 'tiles stack');
        fix.id = 'fixes';
        area.appendChild(fix);
        ctx.set({ k: 'whole', step: 'fix', ans: q.fix, right: [q.fix], level: level });
        var f = fix.querySelector('button'); if (f) f.focus();
      }, function (k) { return names[k]; }, 'tiles two');
      area.appendChild(row);
      ctx.set({ k: 'whole', step: 'which', ans: ans, right: [ans], whole: q.whole, level: level });
    }
  };
  DRAW.place = function (area, ctx, q) {
    var pp = placeParts(q), done = false;
    ctx.ask(area, q.q, q.q + ' ' + pp.words.join(' '));
    var row = el('div', { 'class': 'placeline', id: 'choices' });
    pp.words.forEach(function (w, i) {
      row.appendChild(el('span', { 'class': 'pw' }, w));
      var g = el('button', { type: 'button', 'class': 'gapbtn', 'data-v': String(i) });
      g.appendChild(el('span', { 'class': 'sr' }, (i === pp.words.length - 1 ? 'At the end, after ' : 'After ') + w.replace(/[.,!?"]/g, '')));
      g.appendChild(el('span', { 'class': 'mk', 'aria-hidden': 'true' }, ''));
      g.addEventListener('click', function () {
        if (done || ctx.solved()) return;
        if (i === pp.at) {
          done = true;
          g.classList.add('right'); g.querySelector('.mk').textContent = q.mark;
          right(ctx, 'Yes! The ' + MARKNAME[q.mark] + ' goes there. ' + q.full + ' ' + q.why);
        } else wrong(ctx, g, 'Not there. Read it aloud and listen for where it fits.', q);
      });
      row.appendChild(g);
    });
    area.appendChild(row);
    ctx.set({ k: 'place', ans: String(pp.at), right: [String(pp.at)], mark: q.mark, level: level });
  };
  DRAW.meaning = function (area, ctx, q) {
    ctx.set({ k: 'meaning', ans: q.ans, right: [q.ans], level: level });
    ctx.ask(area, q.q, q.q + ' ' + q.opts.join(' Or: '));
    var pic = el('div', { 'class': 'mpic' }); pic.appendChild(svgEl(PIC[q.pic] || PIC.tell, '0 0 64 64')); area.appendChild(pic);
    var hear = el('button', { type: 'button', 'class': 'small', id: 'hear-each' }, 'Hear each one');
    hear.addEventListener('click', function () { ctx.say(q.opts.join('  ...  ')); });
    area.appendChild(hear);
    var row = ctx.tiles(shuffle(q.opts), function (o) { return el('span', { 'class': 'optext big' }, o); }, function (o, b) {
      if (o === q.ans) { b.classList.add('right'); right(ctx, 'Yes! ' + q.why); }
      else wrong(ctx, b, 'Look at the marks again. Try the other one.', q);
    }, function (o) { return o; }, 'tiles stack');
    area.appendChild(row);
  };
  function practice(area, ctx) {
    missed = false;
    if (ctx.round() === 0) { level = startAt(); streak = 0; }
    var q = choose();
    DRAW[q.k](area, ctx, q);
  }

  /* ---------- picking a topic ---------- */
  function setTopic(id, focus) {
    topic = ALL.filter(function (t) { return t.id === id; })[0];
    if (!topic) return;
    cfg.rounds.lesson = topic.learn.length;
    level = startAt();
    streak = 0; asked = [];
    $('topic-name').textContent = topic.name;
    $('topic-ages').textContent = 'Ages ' + topic.ages.replace('-', ' to ') + '. ' + topic.blurb;
    $('picker').hidden = true; $('menu').hidden = false; $('game').hidden = true;
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file pages */ }
    if (focus) $('topic-name').focus();
  }
  function showPicker() {
    $('picker').hidden = false; $('menu').hidden = true; $('game').hidden = true;
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* nothing */ }
    var b = topic && $('topic-' + topic.id); if (b) b.focus();
  }
  function buildPicker() {
    var list = $('topic-list'), age = childAge();
    var order = ALL.slice();
    if (age) order.sort(function (a, b) { var fa = age >= minAge(a) && age <= maxAge(a), fb = age >= minAge(b) && age <= maxAge(b); return (fb - fa) || (minAge(a) - minAge(b)); });
    order.forEach(function (t) {
      var b = el('button', { type: 'button', 'class': 'step topic', id: 'topic-' + t.id, 'data-range': t.ages });
      var head = el('span', { 'class': 'topic-head' });
      head.appendChild(icon(t.tag));
      head.appendChild(el('span', {}, t.name));
      b.appendChild(head);
      b.appendChild(el('small', {}, 'Ages ' + t.ages.replace('-', ' to ') + '. ' + t.blurb));
      b.addEventListener('click', function () { setTopic(t.id, true); });
      list.appendChild(b);
    });
    $('topic-count').textContent = ALL.length + ' topics';
  }
  function init(ctx) {
    ctxRef = ctx;
    buildPicker();
    $('other-topic').addEventListener('click', showPicker);
    // "Learn" starts at the first part; "Back a step" restarts the lesson one part earlier.
    $('play-lesson').addEventListener('click', function () {
      var from = lessonFrom; lessonFrom = 0;
      for (var i = 0; i < from; i++) $('more').click();
    });
  }
  /** Runs after the shell has set up (the shell shows its menu last), so a link like grammar.html#fragments opens that topic. */
  function afterShell() {
    var h = (location.hash || '').slice(1);
    if (h && ALL.some(function (t) { return t.id === h; })) setTopic(h, false);
    else showPicker();
  }

  cfg.names = { lesson: 'Learn', play: 'Practice' };
  cfg.learn = [];
  cfg.games = { lesson: lesson, play: practice };
  cfg.area = 'english';
  cfg.init = init;
  window.YS_GRAMMAR_PAGE = { topics: ALL.map(function (t) { return t.id; }), level: function () { return level; }, topic: function () { return topic && topic.id; } };
  S.run(cfg);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterShell); else afterShell();
})();
