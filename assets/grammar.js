/* Yaanstep Sprouts: grammar, how sentences work (Manish, 23 Nov 2026; SCRUM-516).
   Topics live in assets/grammar/*.js (window.YS_GRAMMAR): naming words, doing words, describing words, plurals, pronouns,
   tenses, how words, capitals and periods, ? and !, building sentences, whole sentences and pieces (fragments), joining
   words, commas and quotes, subject and predicate. All text is the Yaanstep team's own.
   Each topic has a short lesson, one part at a time, with the words colored by what they do, and practice.
   Practice starts at the child's age and moves up after two right answers in a row, down after a miss. English points with
   a child profile only (YSPoints, through the shared shell). Speech uses the device's own voice. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle;
  var ALL = (window.YS_GRAMMAR || []).slice();
  function minAge(t) { return +t.ages.split('-')[0]; }
  function maxAge(t) { return +t.ages.split('-')[1]; }
  ALL.sort(function (a, b) { return minAge(a) - minAge(b); });
  var LABEL = { noun: 'naming', verb: 'doing', adjective: 'describing', adverb: 'how', pronoun: 'stands for', joining: 'joining',
    mark: 'mark', capital: 'capital', subject: 'who or what', predicate: 'what happens', piece: 'a piece', whole: 'whole' };
  var COLOR = { noun: '#2F6FBF', verb: '#C2410C', adjective: '#6D28D9', adverb: '#BE185D', pronoun: '#1F7A6D', joining: '#B7791F',
    mark: '#B7791F', capital: '#B7791F', subject: '#2F6FBF', predicate: '#C2410C', piece: '#B91C1C', whole: '#1b7a3d' };
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
  function optTile(o) { return el('span', { 'class': o.length > 12 ? 'optext' : 'wordtile small-word' }, o); }
  function long(opts) { return opts.some(function (o) { return o.length > 12; }); }
  var DRAW = {
    pick: function (area, ctx, q) {
      ctx.ask(area, q.q, q.q + (q.s ? ' ' + q.s.replace(/_{2,}/g, 'blank') : '') + ' ' + q.opts.join(', or ') + '?');
      if (q.s) area.appendChild(el('p', { 'class': 'gap', id: 'gap' }, q.s));
      var row = ctx.tiles(shuffle(q.opts), optTile, function (o, b) {
        if (o === q.ans) { b.classList.add('right'); right(ctx, 'Yes! ' + q.why); }
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
