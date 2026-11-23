/* Yaanstep Sprouts: "Learn about the world" topics (ages 3 to 8; Manish, 22 Nov 2026).
   Each topic pack in assets/topics/ adds itself to window.YS_TOPICS. This page lists them; for each one there is
   a moving lesson (one picture at a time) and a game. Original drawings only. Nothing is stored or sent.
   A link like topics.html#food opens that topic. A pack with a scene also gets "See them all together": one picture of
   the whole topic, where tapping a thing shows and says what it is (styles in assets/topics-scene.css). */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, shuffle = S.shuffle, cap = S.cap;
  var ALL = window.YS_TOPICS || {};
  var ORDER = ['food', 'body', 'feelings', 'family', 'vehicles', 'healthy', 'seasons', 'opposites', 'jobs', 'plants', 'habitats', 'flags', 'space'];
  var IDS = ORDER.filter(function (k) { return ALL[k]; }).concat(Object.keys(ALL).filter(function (k) { return ORDER.indexOf(k) < 0; }));
  // How the simple "find it" question is asked, per topic.
  var FIND = { flags: 'Find the flag of {name}.', feelings: 'Who looks {name}?', opposites: 'Find {name}.', seasons: 'Find {name}.', healthy: 'Find: {name}.', body: 'Find the {name}.', space: 'Find {the}{name}.', habitats: 'Find the {name}.' };
  // Faces that look alike are never shown together in a "find it" question.
  var NEAR = { surprised: ['scared'], scared: ['surprised', 'worried'], worried: ['scared'], calm: ['tired', 'shy'], tired: ['calm'], shy: ['calm'] };
  var topic = null, learn = [], names = { learn: 'Learn', play: 'Play' }, shell = null;

  function item(id) { return topic.items.filter(function (i) { return i.id === id; })[0]; }
  function art(it, extra) { return '<svg x="0" y="0" width="64" height="64" viewBox="' + (it.vb || '0 0 64 64') + '"' + (extra || '') + '>' + it.art + '</svg>'; }
  function moveClass(it) { return it.move ? ' class="mv-' + it.move + '"' : ''; }
  function itemEl(it, label) { return svgEl(art(it), '0 0 64 64', label); }
  // "the flag of the United States", "the flag of Japan".
  function country(it) { return (/^(United |Netherlands|Philippines|Czech Republic|Dominican Republic|Bahamas|Gambia)/.test(it.name) ? 'the ' : '') + it.name; }
  function findText(it) { return (FIND[topic.id] || 'Find the {name}.').replace('{name}', topic.id === 'flags' ? country(it) : it.name).replace('{the}', /^[a-z]/.test(it.name) ? 'the ' : ''); }
  function called(it) { return topic.id === 'flags' ? 'the flag of ' + country(it) : it.name; }

  /* ---------- the lesson: an overview, then one picture at a time ---------- */
  function buildLearn() {
    learn.length = 0;
    learn.push({ title: topic.name, text: topic.intro || topic.blurb, movie: function () {
      var out = '', per = 6, list = topic.items.slice(0, 12);
      list.forEach(function (it, i) {
        out += '<g class="mv-in" style="animation-delay:' + (0.15 * i).toFixed(2) + 's"><svg x="' + ((i % per) * 52 + 4) + '" y="' + (Math.floor(i / per) * 52 + 4) + '" width="48" height="48" viewBox="0 0 64 64">' + art(it) + '</svg></g>';
      });
      return { svg: out, vb: '0 0 316 ' + (Math.ceil(list.length / per) * 52 + 8), label: topic.name + ': ' + list.map(function (it) { return it.name; }).join(', ') + '.' };
    } });
    topic.items.forEach(function (it) {
      learn.push({ title: cap(it.name), text: it.say, movie: function () {
        return { svg: '<g class="mv-in"><g' + moveClass(it) + ' style="animation-delay:.5s"><svg x="40" y="4" width="120" height="120" viewBox="0 0 64 64">' + art(it) + '</svg></g></g>', vb: '0 0 200 128', label: cap(it.name) + '. ' + it.say };
      } });
    });
  }

  /* ---------- the game ---------- */
  var asked = [];
  function questions() {
    var qs = (topic.questions || []).slice();
    // Mix in simple "find it" questions, one for each item.
    topic.items.forEach(function (it) {
      var near = NEAR[it.id] || [];
      var others = topic.items.filter(function (o) { return o.name !== it.name && near.indexOf(o.id) < 0; }).map(function (o) { return o.id; });
      qs.push({ q: findText(it), ans: [it.id], pool: others, find: true });
    });
    return qs;
  }
  function play(area, ctx) {
    var qs = questions(), custom = (topic.questions || []).length, q, tries = 0;
    do {
      // Every other round is one of the topic's own questions, when it has them.
      var pickCustom = custom && (ctx.round() % 2 === 0);
      var idx = pickCustom ? rnd(custom) : custom + rnd(qs.length - custom);
      q = qs[idx];
      tries++;
    } while (asked.indexOf(q.q) >= 0 && tries < 30);
    asked.push(q.q); if (asked.length > 5) asked.shift();
    var ans = q.ans[rnd(q.ans.length)], pool = (q.pool || topic.items.map(function (i) { return i.id; })).filter(function (id) { return q.ans.indexOf(id) < 0; });
    var opts = shuffle([ans].concat(shuffle(pool).slice(0, 2)));
    ctx.set({ topic: topic.id, q: q.q, ans: ans, right: q.ans, find: !!q.find });
    ctx.ask(area, q.q);
    area.appendChild(ctx.tiles(opts, function (id) {
      var it = item(id), s = el('span', { 'class': 'w' });
      s.appendChild(itemEl(it));
      if (!q.find) s.appendChild(el('span', {}, it.name));
      return s;
    }, function (id, b) {
      var it = item(id);
      if (q.ans.indexOf(id) >= 0) { b.classList.add('right'); ctx.win('Yes! ' + it.say); return; }
      ctx.miss(b, 'You tapped ' + called(it) + '. ' + (q.hint ? q.hint + ' ' : '') + 'Try again.', function (box) {
        box.appendChild(el('p', {}, 'You tapped this one: ' + called(it) + '.'));
        box.appendChild(ctx.moviePanel(function () {
          return { svg: '<g class="mv-in"><g' + moveClass(it) + '><svg x="50" y="4" width="100" height="100" viewBox="0 0 64 64">' + art(it) + '</svg></g></g>', vb: '0 0 200 108', label: cap(it.name) + '.' };
        }));
        box.appendChild(el('p', { id: 'lesson-say' }, it.say + (q.hint ? ' ' + q.hint : '')));
      });
    }, function (id) { var it = item(id); return topic.id === 'flags' ? cap(called(it)) : it.name; }));
  }

  /* ---------- "See them all together": the whole topic in one picture (Manish, 23 Nov 2026) ----------
     A pack may add scene: { button, small, title, hint, prompt, note, label, vb, back, objects: [{ id, x, w, art, compare, name? }] }.
     The picture is drawn at its own size and scrolls sideways inside its box on a narrow screen. Each object has an
     HTML button over its strip (x to x + w, and y to y + h when the object gives y and h; full height otherwise):
     tapping it shows the item's sentence and the compare line, and says them. An object may carry its own say line
     instead of a pack item. Looking at every part once in a visit earns one World point (with a child profile). */
  var sceneSaid = '';
  function hush() { try { window.speechSynthesis.cancel(); } catch (e) { /* no voice */ } }
  function speak(text) { sceneSaid = text; if (shell) shell.say(text); }
  function buildScene() {
    if (!document.querySelector('link[href$="topics-scene.css"]')) document.head.appendChild(el('link', { rel: 'stylesheet', href: 'assets/topics-scene.css' }));
    var go = el('button', { type: 'button', 'class': 'step', id: 'play-scene' }, 'See them all together');
    go.appendChild(el('small', {}, ''));
    go.hidden = true; go.style.display = 'none'; // .step sets display, which would beat the hidden attribute
    go.addEventListener('click', openScene);
    $('other-topic').parentNode.insertBefore(go, $('other-topic'));
    var view = el('section', { id: 'scene-view' });
    view.hidden = true;
    view.innerHTML = '<div class="card"><div class="top"><h2 class="topic-title" id="scene-title" tabindex="-1"></h2><button type="button" id="scene-exit" class="small">Back</button></div>' +
      '<p class="muted" id="scene-hint"></p><div class="sky-box" id="sky-box"><div class="sky" id="sky"></div></div><p class="muted" id="scene-note"></p>' +
      '<div class="sky-panel" id="scene-panel" aria-live="polite"></div><div class="row"><button type="button" class="small" id="scene-again">Hear it again</button></div></div>';
    $('game').parentNode.insertBefore(view, $('game'));
    $('scene-exit').addEventListener('click', closeScene);
    $('scene-again').addEventListener('click', function () { speak(sceneSaid); });
  }
  function sceneName(o) { var it = item(o.item || o.id); return o.name || cap(it ? it.name : o.id); }
  function openScene() {
    var sc = topic && topic.scene;
    if (!sc) return;
    var vb = sc.vb.split(/\s+/).map(Number), W = vb[2], H = vb[3], sky = $('sky');
    $('menu').hidden = true; $('game').hidden = true; $('scene-view').hidden = false;
    $('scene-title').textContent = sc.title;
    $('scene-hint').textContent = sc.hint;
    $('scene-note').textContent = sc.note;
    sky.innerHTML = '';
    sky.style.width = W + 'px'; sky.style.height = H + 'px';
    var pic = (sc.back || '') + sc.objects.map(function (o) { return '<g data-obj="' + o.id + '">' + o.art + '</g>'; }).join('');
    sky.appendChild(svgEl(pic, sc.vb, sc.label));
    sc.objects.forEach(function (o) {
      var box = 'left:' + (100 * o.x / W).toFixed(3) + '%;width:' + (100 * o.w / W).toFixed(3) + '%' +
        (o.h ? ';top:' + (100 * (o.y || 0) / H).toFixed(3) + '%;height:' + (100 * o.h / H).toFixed(3) + '%;bottom:auto' : '');
      var b = el('button', { type: 'button', 'class': 'sky-btn' + (o.h ? ' part' : ''), 'data-obj': o.id, style: box });
      b.appendChild(el('span', { 'class': 'sky-name' }, sceneName(o)));
      b.addEventListener('click', function () { showObject(o, b); });
      sky.appendChild(b);
    });
    $('sky-box').scrollLeft = 0;
    seen = {}; rewarded = false;
    var panel = $('scene-panel');
    panel.innerHTML = '';
    panel.appendChild(el('p', { 'class': 'muted' }, sc.prompt));
    speak(sc.title + '. ' + sc.prompt);
    $('scene-title').focus();
  }
  var seen = {}, rewarded = false;
  function showObject(o, b) {
    var it = item(o.item || o.id), name = sceneName(o), panel = $('scene-panel'), say = o.say || (it ? it.say : '');
    Array.prototype.forEach.call($('sky').querySelectorAll('.sky-btn'), function (x) { x.classList.toggle('on', x === b); });
    panel.innerHTML = '';
    panel.appendChild(el('p', { 'class': 'sky-head', id: 'scene-name' }, name));
    if (say) panel.appendChild(el('p', { id: 'scene-say' }, say));
    if (o.compare) panel.appendChild(el('p', { id: 'scene-compare' }, o.compare));
    var line = name + '. ' + [say, o.compare || ''].join(' ').trim();
    seen[o.id] = true;
    var sc = topic.scene;
    if (!rewarded && sc.objects.every(function (x) { return seen[x.id]; })) {
      rewarded = true;
      if (window.YSPoints) window.YSPoints.add('world', 1);
      var done = 'You looked at every part of the picture. Well done!';
      panel.appendChild(el('p', { 'class': 'sky-done', id: 'scene-done' }, done));
      line += ' ' + done;
    }
    speak(line);
  }
  function closeScene() {
    hush();
    $('scene-view').hidden = true; $('menu').hidden = false;
    $('play-scene').focus();
  }

  /* ---------- picking a topic ---------- */
  function $(id) { return document.getElementById(id); }
  function choose(id, focus) {
    topic = ALL[id]; asked = [];
    if (!topic) return;
    buildLearn();
    names.learn = 'Learn: ' + topic.name; names.play = 'Play: ' + topic.name;
    $('topic-name').textContent = topic.name;
    $('topic-ages').textContent = 'Ages ' + topic.ages.replace('-', ' to ') + '. ' + topic.blurb;
    $('play-learn').firstChild.textContent = 'Learn about ' + topic.name.toLowerCase().replace(/^the /, '');
    var go = $('play-scene'), sc = topic.scene;
    go.hidden = !sc; go.style.display = sc ? '' : 'none';
    if (sc) { go.firstChild.textContent = sc.button; go.lastChild.textContent = sc.small; }
    $('scene-view').hidden = true;
    $('picker').hidden = true; $('menu').hidden = false; $('game').hidden = true;
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file pages */ }
    if (focus) $('topic-name').focus();
  }
  function showPicker() {
    $('picker').hidden = false; $('menu').hidden = true; $('game').hidden = true; $('scene-view').hidden = true;
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* nothing */ }
    var b = topic && $('topic-' + topic.id); if (b) b.focus();
  }
  function buildPicker() {
    var list = $('topic-list');
    IDS.forEach(function (id) {
      var t = ALL[id], first = t.items[0];
      var b = el('button', { type: 'button', 'class': 'step topic', id: 'topic-' + id, 'data-range': t.ages });
      var head = el('span', { 'class': 'topic-head' });
      head.appendChild(svgEl(art(first), '0 0 64 64'));
      head.appendChild(el('span', {}, t.name));
      b.appendChild(head);
      b.appendChild(el('small', {}, 'Ages ' + t.ages.replace('-', ' to ') + '. ' + t.blurb));
      b.addEventListener('click', function () { choose(id, true); });
      list.appendChild(b);
    });
    $('topic-count').textContent = IDS.length + ' topics';
  }

  S.run({
    area: 'world',
    names: names,
    learn: learn,
    games: { play: play },
    init: function (ctx) {
      shell = ctx;
      buildPicker();
      buildScene();
      $('other-topic').addEventListener('click', showPicker);
      // After the shell shows the menu: open the topic in the link, or the list.
      setTimeout(function () {
        var want = (location.hash || '').slice(1);
        if (ALL[want]) choose(want, false); else showPicker();
      }, 0);
    }
  });
  window.YS_TOPIC_PAGE = { topics: ALL, ids: IDS, current: function () { return topic; } };
})();
