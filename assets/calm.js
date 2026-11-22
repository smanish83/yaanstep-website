/* Yaanstep Sprouts: the calm corner (SCRUM-498, 22 Nov 2026).
   Quiet play for any child: slow bubbles, a breathing circle, a picture to color and a "First, then" picture plan.
   No score, no timer, no losing, no sound except the device's own voice on a Hear it button. Tap only.
   Nothing is kept in localStorage. The picture plan is kept in sessionStorage only, so it is gone when the tab closes.
   All pictures are drawn here. */
(function () {
  'use strict';

  var PLAN_KEY = 'ys-first-then';
  var MAX_PLAN = 4;

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function sr(text) { return el('span', { 'class': 'sr' }, text); }
  function svg(inner, vb, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', vb || '0 0 64 64');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = inner;
    return s;
  }
  /** Calm mode (from the profile) or reduce motion on the device: nothing moves, the breathing circle goes step by step. */
  function still() {
    if (document.documentElement.classList.contains('ys-calm')) return true;
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  /* ---------- voice: the device's own voice, only when a Hear it button is tapped ---------- */
  function hasVoice() {
    try { return window.speechSynthesis.getVoices().some(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; }); } catch (e) { return false; }
  }
  function say(text) { if (window.YSComfort) window.YSComfort.say(text); }
  function setUpVoice() {
    var ok = hasVoice();
    $('novoice').hidden = ok;
    Array.prototype.forEach.call(document.querySelectorAll('.hear'), function (b) { b.hidden = !ok; });
  }

  /* ---------- slow bubbles ---------- */
  var BUBBLE_COLORS = [
    { name: 'blue', c: '#8cc8ec' }, { name: 'green', c: '#9fd8b5' }, { name: 'purple', c: '#c9b6ec' },
    { name: 'pink', c: '#f3b9cf' }, { name: 'yellow', c: '#f5df8f' }, { name: 'teal', c: '#8fd3c8' }
  ];
  var bubbleTurn = 0;
  function bubbleArt(c) {
    return '<g class="b-ball"><circle cx="32" cy="32" r="26" fill="' + c + '" fill-opacity=".55" stroke="#4d7f99" stroke-width="2"/>' +
      '<path d="M18 24 A16 16 0 0 1 30 14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="40" cy="20" r="3" fill="#fff"/></g>' +
      '<g class="b-ring"><circle cx="32" cy="32" r="6" fill="none" stroke="#4d7f99" stroke-width="2" stroke-dasharray="3 4"/></g>';
  }
  function fillBubble(b) {
    var col = BUBBLE_COLORS[bubbleTurn++ % BUBBLE_COLORS.length];
    b.innerHTML = '';
    b.setAttribute('data-color', col.name);
    b.appendChild(sr('Pop the ' + col.name + ' bubble'));
    b.appendChild(svg(bubbleArt(col.c)));
    b.classList.remove('popped');
    if (!still()) {
      b.classList.add('rising');
      setTimeout(function () { b.classList.remove('rising'); }, 2000);
    }
  }
  function drawBubbles() {
    var field = $('bubble-field');
    for (var i = 0; i < 6; i++) {
      var b = el('button', { type: 'button', 'class': 'bubble' });
      fillBubble(b);
      b.addEventListener('click', pop);
      field.appendChild(b);
    }
  }
  function pop(e) {
    var b = e.currentTarget;
    if (b.classList.contains('popped')) return;
    b.classList.add('popped');
    b.querySelector('.sr').textContent = 'Popped. A new bubble is coming';
    $('bubble-status').textContent = 'Pop! The ' + b.getAttribute('data-color') + ' bubble popped softly.';
    setTimeout(function () { fillBubble(b); }, still() ? 800 : 1600);
  }

  /* ---------- breathing circle ---------- */
  var pace = 4, breathing = false, phase = 0, timer = 0;
  var BREATHS = 5;
  function breathOne() { return $('breath'); }
  function setPace(e) {
    pace = +e.currentTarget.getAttribute('data-pace');
    Array.prototype.forEach.call(document.querySelectorAll('#pace button'), function (b) { b.setAttribute('aria-pressed', String(b === e.currentTarget)); });
  }
  /** Steps: 0 breathe in, 1 breathe out, 2 in, ... until BREATHS breaths are done. */
  function showStep() {
    var inStep = phase % 2 === 0, n = Math.floor(phase / 2) + 1;
    breathOne().classList.toggle('big', inStep);
    $('breath-word').textContent = inStep ? 'Breathe in…' : 'Breathe out…';
    $('breath-count').textContent = 'Breath ' + n + ' of ' + BREATHS + (stepByStep() ? '. Count slowly to 4, then tap Next step.' : '');
  }
  function stepByStep() { return pace === 0 || still(); }
  function startBreath() {
    breathing = true; phase = 0;
    $('pace').hidden = true;
    $('breath-start').hidden = true;
    $('breath-stop').hidden = false;
    $('breath-next').hidden = !stepByStep();
    breathOne().style.setProperty('--pace', pace + 's');
    showStep();
    if (stepByStep()) $('breath-next').focus(); else { $('breath-stop').focus(); timer = setTimeout(tick, pace * 1000); }
  }
  function advance() {
    phase++;
    if (phase >= BREATHS * 2) { endBreath('All done. Well done. You can start again any time.'); return; }
    showStep();
  }
  function tick() { if (!breathing) return; advance(); if (breathing) timer = setTimeout(tick, pace * 1000); }
  function endBreath(text) {
    breathing = false;
    clearTimeout(timer);
    breathOne().classList.remove('big');
    $('breath-word').textContent = text;
    $('breath-count').textContent = '';
    $('pace').hidden = still();
    $('breath-next').hidden = true;
    $('breath-stop').hidden = true;
    $('breath-start').hidden = false;
    $('breath-start').textContent = 'Start again';
    $('breath-start').focus();
  }

  /* ---------- color a picture ---------- */
  var PAINTS = [
    { name: 'red', c: '#e05a4f' }, { name: 'orange', c: '#f29a3a' }, { name: 'yellow', c: '#f6d34a' }, { name: 'green', c: '#5fb86b' },
    { name: 'blue', c: '#5b9bd8' }, { name: 'purple', c: '#9b7bd0' }, { name: 'pink', c: '#ef9ac0' }, { name: 'brown', c: '#9a6a43' }, { name: 'white', c: '#ffffff' }
  ];
  /* A house, a tree and the sun: our own simple drawing. Each part is big enough to tap (at least 34 units, drawn at 1.4 times or more). */
  var PARTS = [
    { id: 'sky', name: 'the sky', shape: '<rect x="1" y="1" width="178" height="104"/>' },
    { id: 'grass', name: 'the grass', shape: '<rect x="1" y="105" width="178" height="44"/>' },
    { id: 'sun', name: 'the sun', shape: '<circle cx="150" cy="28" r="20"/>' },
    { id: 'tree', name: 'the tree top', shape: '<circle cx="147" cy="74" r="22"/>' },
    { id: 'roof', name: 'the roof', shape: '<polygon points="6,64 62,22 118,64"/>' },
    { id: 'wall', name: 'the wall', shape: '<rect x="14" y="64" width="96" height="62"/>' },
    { id: 'door', name: 'the door', shape: '<rect x="24" y="82" width="38" height="44"/>' },
    { id: 'window', name: 'the window', shape: '<rect x="70" y="74" width="36" height="36"/>' }
  ];
  var paint = 0, colored = {};
  function drawPalette() {
    var box = $('palette');
    PAINTS.forEach(function (p, i) {
      var b = el('button', { type: 'button', 'data-paint': p.name, 'aria-pressed': String(i === paint) });
      b.appendChild(sr(p.name.charAt(0).toUpperCase() + p.name.slice(1)));
      var dot = el('span', { 'class': 'sw', 'aria-hidden': 'true' });
      dot.style.background = p.c;
      b.appendChild(dot);
      b.addEventListener('click', function () {
        paint = i;
        Array.prototype.forEach.call(box.querySelectorAll('button'), function (x, j) { x.setAttribute('aria-pressed', String(j === paint)); });
      });
      box.appendChild(b);
    });
  }
  function drawPicture() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 180 150');
    s.setAttribute('role', 'group');
    s.setAttribute('aria-labelledby', 'color-h');
    var g = '';
    PARTS.forEach(function (p) {
      if (p.id === 'tree') g += '<rect x="142" y="82" width="10" height="40" fill="#9a6a43" stroke="#17332c" stroke-width="2" aria-hidden="true"/>';
      g += '<g class="part" data-part="' + p.id + '" role="button" tabindex="0" aria-label="Color ' + p.name + '" fill="' + (colored[p.id] || '#fff') + '">' + p.shape + '</g>';
    });
    s.innerHTML = g;
    $('picture').innerHTML = '';
    $('picture').appendChild(s);
    Array.prototype.forEach.call(s.querySelectorAll('.part'), function (part) {
      part.addEventListener('click', function () { color(part); });
      part.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); color(part); }
      });
    });
  }
  function color(part) {
    var p = PAINTS[paint], id = part.getAttribute('data-part'), name = PARTS.filter(function (x) { return x.id === id; })[0].name;
    colored[id] = p.c;
    part.setAttribute('fill', p.c);
    part.setAttribute('data-color', p.name);
    $('color-status').textContent = name.charAt(0).toUpperCase() + name.slice(1) + ' is ' + p.name + ' now.';
  }

  /* ---------- First, then: a picture plan in this tab only ---------- */
  var CARDS = [
    { id: 'maths', name: 'Maths game', art: '<rect x="8" y="8" width="48" height="48" rx="8" fill="#e6f6ea" stroke="#1F7A6D" stroke-width="3"/><path d="M20 22h12M26 16v12M36 22h10M20 42h12M36 38h10M36 46h10" stroke="#17332c" stroke-width="3" stroke-linecap="round"/>' },
    { id: 'story', name: 'Story', art: '<path d="M8 14q12-6 24 2v38q-12-8-24-2z" fill="#fff4d6" stroke="#9a6a43" stroke-width="3"/><path d="M56 14q-12-6-24 2v38q12-8 24-2z" fill="#fff4d6" stroke="#9a6a43" stroke-width="3"/>' },
    { id: 'break', name: 'Break', art: '<circle cx="32" cy="14" r="7" fill="#f5c9a3" stroke="#17332c" stroke-width="2"/><path d="M32 22v20M32 28l-14-10M32 28l14-10M32 42l-9 14M32 42l9 14" stroke="#17332c" stroke-width="4" stroke-linecap="round"/>' },
    { id: 'drawing', name: 'Drawing', art: '<rect x="8" y="10" width="40" height="44" rx="4" fill="#fff" stroke="#17332c" stroke-width="3"/><path d="M16 42q8-14 16-4t12-8" stroke="#5b9bd8" stroke-width="3" fill="none"/><path d="M44 50l14-30 4 2-14 30z" fill="#f6d34a" stroke="#17332c" stroke-width="2"/>' },
    { id: 'reading', name: 'Reading game', art: '<rect x="8" y="12" width="48" height="40" rx="6" fill="#fff" stroke="#2F6FBF" stroke-width="3"/><text x="32" y="40" text-anchor="middle" font-size="20" font-weight="700" font-family="sans-serif" fill="#17332c">abc</text>' },
    { id: 'snack', name: 'Snack', art: '<circle cx="30" cy="36" r="18" fill="#e05a4f" stroke="#17332c" stroke-width="2"/><path d="M30 18q2-8 8-10" stroke="#5a3d22" stroke-width="3" fill="none"/><path d="M34 14q10-4 14 4q-10 4-14-4z" fill="#5fb86b"/>' },
    { id: 'outside', name: 'Outside play', art: '<circle cx="48" cy="14" r="8" fill="#f6d34a"/><path d="M4 54h56" stroke="#5fb86b" stroke-width="6"/><path d="M18 52V30M18 30l-8 10M18 30l8 10" stroke="#9a6a43" stroke-width="3"/><circle cx="18" cy="24" r="10" fill="#5fb86b"/>' },
    { id: 'tidy', name: 'Tidy up', art: '<rect x="10" y="30" width="44" height="26" rx="4" fill="#c9b6ec" stroke="#17332c" stroke-width="3"/><rect x="16" y="18" width="12" height="12" fill="#f29a3a" stroke="#17332c" stroke-width="2"/><circle cx="40" cy="22" r="7" fill="#5b9bd8" stroke="#17332c" stroke-width="2"/>' }
  ];
  var TICK = '<circle cx="24" cy="24" r="22" fill="#1b7a3d"/><path d="M13 25l7 7 15-16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  function card(id) { return CARDS.filter(function (c) { return c.id === id; })[0]; }
  function readPlan() {
    try {
      var p = JSON.parse(window.sessionStorage.getItem(PLAN_KEY) || '[]');
      return (Array.isArray(p) ? p : []).filter(function (x) { return x && card(x.id); }).slice(0, MAX_PLAN).map(function (x) { return { id: x.id, done: !!x.done }; });
    } catch (e) { return []; }
  }
  var plan = [];
  function keepPlan() {
    try {
      if (plan.length) window.sessionStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      else window.sessionStorage.removeItem(PLAN_KEY);
    } catch (e) { /* private mode: works for this visit */ }
  }
  function order(i, n) {
    var words = n === 1 ? ['First'] : n === 2 ? ['First', 'Then'] : n === 3 ? ['First', 'Then', 'Last'] : ['First', 'Then', 'Next', 'Last'];
    return words[i];
  }
  function drawCards() {
    var box = $('plan-cards');
    CARDS.forEach(function (c) {
      var b = el('button', { type: 'button', 'data-card': c.id });
      b.appendChild(svg(c.art));
      b.appendChild(sr('Add '));
      b.appendChild(el('span', {}, c.name));
      b.addEventListener('click', function () {
        if (plan.length >= MAX_PLAN) return;
        plan.push({ id: c.id, done: false });
        keepPlan();
        drawPlan();
        $('plan-status').textContent = c.name + ' is in the plan, number ' + plan.length + '.' + (plan.length >= MAX_PLAN ? ' The plan is full.' : '');
      });
      box.appendChild(b);
    });
  }
  function drawPlan() {
    var list = $('plan');
    list.innerHTML = '';
    plan.forEach(function (item, i) {
      var c = card(item.id), li = el('li', { 'data-card': item.id });
      li.classList.toggle('is-done', item.done);
      li.appendChild(svg(c.art, '0 0 64 64', 'pic'));
      var what = el('span', { 'class': 'what' });
      what.appendChild(el('b', {}, order(i, plan.length)));
      what.appendChild(document.createTextNode(c.name));
      li.appendChild(what);
      li.appendChild(svg(TICK, '0 0 48 48', 'tick'));
      var done = el('button', { type: 'button', 'class': 'done-btn', 'aria-pressed': String(item.done) });
      done.appendChild(document.createTextNode('Done'));
      done.appendChild(sr(': ' + c.name));
      done.addEventListener('click', function () {
        item.done = !item.done;
        keepPlan();
        drawPlan();
        var again = document.querySelectorAll('#plan .done-btn')[i];
        if (again) again.focus();
        var left = plan.filter(function (x) { return !x.done; }).length;
        $('plan-status').textContent = item.done ? (left ? c.name + ' is done. ' + left + ' more, then finished.' : 'All finished!') : c.name + ' is not done yet.';
      });
      li.appendChild(done);
      list.appendChild(li);
    });
    var old = $('plan-all');
    if (old) old.remove();
    if (plan.length && plan.every(function (x) { return x.done; })) {
      list.parentNode.insertBefore(el('p', { 'class': 'all-done', id: 'plan-all' }, 'All finished! Well done.'), list.nextSibling);
    }
    Array.prototype.forEach.call(document.querySelectorAll('#plan-cards button'), function (b) { b.disabled = plan.length >= MAX_PLAN; });
    $('plan-clear').hidden = !plan.length;
  }

  /* ---------- wiring ---------- */
  function init() {
    setUpVoice();
    try { window.speechSynthesis.addEventListener('voiceschanged', setUpVoice); } catch (e) { /* no voices */ }
    Array.prototype.forEach.call(document.querySelectorAll('.hear'), function (b) {
      b.addEventListener('click', function () { say($(b.getAttribute('data-say')).textContent); });
    });
    drawBubbles();
    Array.prototype.forEach.call(document.querySelectorAll('#pace button'), function (b) { b.addEventListener('click', setPace); });
    $('breath-start').addEventListener('click', startBreath);
    $('breath-next').addEventListener('click', function () { advance(); if (breathing) $('breath-next').focus(); });
    $('breath-stop').addEventListener('click', function () { endBreath('Stopped. You can start again any time.'); });
    // With calm mode or reduce motion, there is no pace to pick: one step for each tap.
    setTimeout(function () { $('pace').hidden = still(); }, 0);
    drawPalette();
    drawPicture();
    $('color-clear').addEventListener('click', function () { colored = {}; drawPicture(); $('color-status').textContent = 'A fresh picture to color.'; });
    plan = readPlan();
    drawCards();
    drawPlan();
    $('plan-clear').addEventListener('click', function () {
      plan = []; keepPlan(); drawPlan();
      $('plan-status').textContent = 'The plan is empty. Tap pictures to make a new one.';
      var first = document.querySelector('#plan-cards button'); if (first) first.focus();
    });
  }
  // Test hook: the plan in this tab.
  window.YS_CALM = { plan: function () { return plan.slice(); }, still: still };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
