/* Yaanstep Sprouts: shared shell for the "learn, then play" pages (money, clocks, weather; 22 Nov 2026).
   A page calls YSShell.run({ names, learn, games }) where
   - names: { learn: 'Learn ...', <game id>: 'Title', ... } (the menu buttons are #play-<id>),
   - learn: a list of parts { title, text, movie: function () { return { svg, vb, label }; } },
   - games: { <id>: function (area, ctx) { ... } } drawing one round,
   - area: the subject the points go to ('maths', 'english' or 'world'; world when left out).
   Every game teaches first: a miss says what was tapped and offers a short moving lesson with another example.
   Speech uses the device's own voice only. Nothing is sent. With a child profile, a right answer adds a point
   (YSPoints, in profile.js); without one, nothing is stored. */
(function () {
  'use strict';
  var ROUNDS = 8;

  function $(id) { return document.getElementById(id); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function between(a, b) { return a + rnd(b - a + 1); }
  function shuffle(list) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function svgEl(inner, viewBox, label) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', viewBox || '0 0 64 64');
    if (label) { s.setAttribute('role', 'img'); s.setAttribute('aria-label', label); } else { s.setAttribute('aria-hidden', 'true'); }
    s.setAttribute('focusable', 'false');
    s.innerHTML = inner;
    return s;
  }
  function delay(s) { return 'animation-delay:' + s.toFixed(2) + 's'; }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

  /* ---------- voice: on-device voices only ---------- */
  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function setUpVoice() {
    var r = parseFloat(readSetting('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = null;
    try {
      var local = window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
      var wanted = readSetting('voice-name');
      voice = local.filter(function (v) { return v.name === wanted; })[0] || local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
    } catch (e) { voice = null; }
    $('novoice').hidden = !!voice;
  }
  function say(text) {
    if (!voice || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silent fallback */ }
  }
  /** A comfort setting from the child's profile (SCRUM-498), read from this browser only. */
  function comfortOn(id) {
    try { var p = JSON.parse(window.localStorage.getItem('ys-profile') || 'null'); return !!(p && Array.isArray(p.comfort) && p.comfort.indexOf(id) > -1); } catch (e) { return false; }
  }
  function hush() { try { window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }

  /** A picture that plays again on "Watch again". make() returns { svg, vb, label }. */
  function moviePanel(make) {
    var box = el('div', { 'class': 'moving' });
    function put() { var m = make(); box.innerHTML = ''; box.appendChild(svgEl(m.svg, m.vb, m.label)); }
    put();
    var wrap = el('div');
    wrap.appendChild(box);
    var again = el('button', { type: 'button', 'class': 'small watch-again' }, 'Watch again');
    again.addEventListener('click', put);
    wrap.appendChild(again);
    return wrap;
  }

  function run(cfg) {
    var game = null, round = 0, part = 0, solved = false, lastAns = [], spoken = '', current = null;
    /** Rounds in the game on screen: a page may set its own per game with cfg.rounds. */
    function total() { return (cfg.rounds && cfg.rounds[game]) || ROUNDS; }
    function show(id) { ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; }); }
    function setSub(text, kind) { var s = $('sub'); s.className = 'sub' + (kind ? ' ' + kind : ''); s.textContent = text; }
    function start(g) {
      game = g; round = 0; part = 0; lastAns = [];
      $('title').textContent = cfg.names[g];
      $('alldone').hidden = true; $('game').querySelector('.card').hidden = false;
      show('game');
      draw();
    }
    function draw() {
      solved = false; spoken = ''; current = null;
      $('area').innerHTML = ''; $('howbox').innerHTML = ''; setSub('');
      $('more').hidden = true;
      if (game === 'learn') { drawLearn(); return; }
      $('again').hidden = false;
      $('count').textContent = 'Round ' + (round + 1) + ' of ' + total();
      cfg.games[game]($('area'), ctx);
    }
    /* Learn: the lesson, one part at a time. */
    function drawLearn() {
      var p = cfg.learn[part], area = $('area'), text = typeof p.text === 'function' ? p.text() : p.text;
      $('again').hidden = false;
      $('count').textContent = 'Part ' + (part + 1) + ' of ' + cfg.learn.length;
      area.appendChild(el('h2', { 'class': 'ask', id: 'lesson-title', tabindex: '-1' }, p.title));
      area.appendChild(moviePanel(p.movie));
      area.appendChild(el('p', { 'class': 'explain', id: 'lesson-text' }, text));
      var row = el('div', { 'class': 'row center' });
      if (part > 0) {
        var back = el('button', { type: 'button', id: 'prevpart' }, 'Back a step');
        back.addEventListener('click', function () { part--; draw(); $('lesson-title').focus(); });
        row.appendChild(back);
      }
      if (part < cfg.learn.length - 1) {
        var on = el('button', { type: 'button', id: 'nextpart', 'class': 'primary' }, 'Next part');
        on.addEventListener('click', function () { part++; draw(); $('lesson-title').focus(); });
        row.appendChild(on);
      }
      area.appendChild(row);
      if (part === cfg.learn.length - 1) {
        area.appendChild(el('p', { 'class': 'nexthead' }, 'Now play:'));
        var games = el('div', { 'class': 'row center' });
        Object.keys(cfg.games).forEach(function (g) {
          var b = el('button', { type: 'button', 'data-go': g }, cfg.names[g]);
          b.addEventListener('click', function () { start(g); var f = $('area').querySelector('button'); if (f) f.focus(); });
          games.appendChild(b);
        });
        area.appendChild(games);
      }
      spoken = p.title + '. ' + text;
      say(spoken);
    }
    function win(text, speak) {
      // One point per round: only the first win of a round counts.
      if (!solved && window.YSPoints) window.YSPoints.add(cfg.area || 'world', 1);
      solved = true;
      setSub(text, 'yes');
      $('howbox').innerHTML = '';
      var more = $('more');
      more.textContent = round < total() - 1 ? 'Next' : 'Finish';
      more.hidden = false;
      more.focus();
      say(speak || text);
    }
    function next() {
      hush();
      if (round < total() - 1) { round++; draw(); return; }
      $('game').querySelector('.card').hidden = true;
      $('alldone').hidden = false;
      $('keep').focus();
    }
    /** A miss: say what happened kindly, and offer a short lesson. lesson(box) fills the lesson panel. */
    function miss(btn, text, lesson) {
      if (btn) { btn.classList.add('wrong'); btn.disabled = true; }
      setSub(text, 'try');
      say(text);
      var h = $('howbox');
      if (h.firstChild) return;
      var b = el('button', { type: 'button', id: 'howbtn' }, 'Show me how');
      b.addEventListener('click', function () {
        var box = el('section', { 'class': 'how-panel', id: 'lesson', 'aria-labelledby': 'lesson-h' });
        box.appendChild(el('h3', { id: 'lesson-h', tabindex: '-1' }, 'Short lesson'));
        lesson(box);
        box.appendChild(el('p', { 'class': 'muted' }, 'Now try again.'));
        h.innerHTML = ''; h.appendChild(box);
        $('lesson-h').focus();
      });
      h.appendChild(b);
    }
    /** Choice tiles. draw1(o) returns an element; labelOf(o) is its accessible name.
        With "Fewer choices" on, only the right answer and one wrong answer are kept (the round's ans, or its list of right answers). */
    function tiles(options, draw1, onPick, labelOf, cls) {
      // A game where every choice is needed (for example "odd one out") opts out with cfg.allChoices: { <game id>: true }.
      if (current && options.length > 2 && comfortOn('fewer') && !(cfg.allChoices && cfg.allChoices[game])) {
        var good = [].concat(current.right || [], current.ans != null ? [current.ans] : []).map(String), wrongKept = false;
        if (good.length && options.some(function (o) { return good.indexOf(String(o)) > -1; })) {
          options = options.filter(function (o) {
            if (good.indexOf(String(o)) > -1) return true;
            if (wrongKept) return false;
            wrongKept = true;
            return true;
          });
          if (!cls || cls === 'tiles') cls = 'tiles two';
        }
      }
      var row = el('div', { 'class': cls || 'tiles', id: 'choices' });
      options.forEach(function (o) {
        // The name is spoken from a hidden line; what is drawn is for the eyes only.
        var b = el('button', { type: 'button', 'class': 'tile', 'data-v': String(o) });
        b.appendChild(el('span', { 'class': 'sr' }, labelOf(o)));
        var look = draw1(o); look.setAttribute('aria-hidden', 'true');
        b.appendChild(look);
        b.addEventListener('click', function () { if (!solved) onPick(o, b); });
        row.appendChild(b);
      });
      return row;
    }
    /** A word choice tile, for times, amounts and temperatures. */
    function word(o) { return el('span', { 'class': 'wordtile' }, String(o)); }
    function fresh(list) {
      var pool = list.filter(function (x) { return lastAns.indexOf(x) < 0; });
      var pick = (pool.length ? pool : list)[rnd((pool.length ? pool : list).length)];
      lastAns.push(pick); if (lastAns.length > 3) lastAns.shift();
      return pick;
    }
    function ask(area, text, speak) { area.appendChild(el('p', { 'class': 'ask', id: 'prompt' }, text)); spoken = speak || text; say(spoken); }
    var ctx = {
      round: function () { return round; }, get rounds() { return total(); }, solved: function () { return solved; },
      ask: ask, win: win, miss: miss, tiles: tiles, word: word, fresh: fresh, setSub: setSub, say: say,
      moviePanel: moviePanel, el: el, svgEl: svgEl, set: function (r) { current = r; }
    };
    function init() {
      setUpVoice();
      try { window.speechSynthesis.addEventListener('voiceschanged', setUpVoice); } catch (e) { /* no voices */ }
      Object.keys(cfg.names).forEach(function (g) { $('play-' + g).addEventListener('click', function () { start(g); }); });
      $('more').addEventListener('click', next);
      $('again').addEventListener('click', function () { say(spoken); });
      function back() { hush(); $('game').querySelector('.card').hidden = false; $('alldone').hidden = true; show('menu'); $('play-' + game).focus(); }
      $('exit').addEventListener('click', back);
      $('stop').addEventListener('click', back);
      $('keep').addEventListener('click', function () { start(game); });
      if (cfg.init) cfg.init(ctx);
      show('menu');
    }
    // Test hook: the round on screen (whatever the page's game stored with ctx.set).
    window.YS_SHELL = { current: function () { return current; }, learn: cfg.learn };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  }

  window.YSShell = { run: run, el: el, svgEl: svgEl, shuffle: shuffle, rnd: rnd, between: between, delay: delay, cap: cap };
})();
