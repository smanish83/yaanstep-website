/* Yaanstep reading mode B: Story time with a parent (SCRUM-486, doc 14).
   Short original stories written by the team. Plain script, no build step.
   Nothing is stored or sent: the page only reads the voice choice and speed that a parent
   set on the reading page (if any). No microphone. The voice speaks only when a button is tapped. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES;

  /* ---------- content: our own words ---------- */
  // Each page: a picture, the text, and one prompt for the grown-up to ask.
  var STORIES = [
    {
      id: 'ball', title: 'Where is the ball?', band: 'Ages 3 to 4',
      pages: [
        { pic: 'ball', text: 'Dog has a red ball.', ask: 'Can you point to the ball?' },
        { pic: 'bed', text: 'The ball rolls under the bed.', ask: 'Where did the ball go?' },
        { pic: 'cat', text: 'Cat looks under the chair. No ball!', ask: 'Where else could the ball be?' },
        { pic: 'dog', text: 'Dog looks under the bed. There it is!', ask: 'How do you think Dog feels now?' }
      ],
      words: ['dog', 'ball', 'bed', 'cat', 'chair', 'red']
    },
    {
      id: 'rain', title: 'Duck likes the rain', band: 'Ages 3 to 4',
      pages: [
        { pic: 'rain', text: 'Drip, drop. Here comes the rain.', ask: 'What is falling from the sky?' },
        { pic: 'pig', text: 'Pig runs inside. Cow runs inside.', ask: 'Why do you think they run inside?' },
        { pic: 'duck', text: 'Duck stays out. Duck likes the rain!', ask: 'Do you like the rain? Why?' },
        { pic: 'sun', text: 'Then the sun comes out. Hello, sun!', ask: 'What can you see after the rain?' }
      ],
      words: ['rain', 'pig', 'cow', 'duck', 'sun', 'out']
    },
    {
      id: 'boat', title: 'Goat and the little boat', band: 'Ages 5 to 7',
      pages: [
        { pic: 'goat', text: 'Goat had a little brown boat. She always wore her life jacket in it.', ask: 'What did Goat always wear in her boat?' },
        { pic: 'frog', text: 'One day, Frog hopped up. "Can I come too?" he asked.', ask: 'What do you think Goat will say?' },
        { pic: 'boat', text: '"Yes," said Goat. "There is room for two." Off they went.', ask: 'Why do you think Goat said yes?' },
        { pic: 'fish', text: 'A fish swam by. A bee buzzed past. The sun was warm on their backs.', ask: 'What did they see on the pond?' },
        { pic: 'sun', text: 'When the sun went down, they went home. "Can we go again tomorrow?" said Frog.', ask: 'What would you take on a boat trip?' }
      ],
      words: ['goat', 'boat', 'frog', 'room', 'fish', 'jacket']
    },
    {
      id: 'bun', title: 'Half a bun', band: 'Ages 5 to 7',
      pages: [
        { pic: 'bun', text: 'Sam had one bun for the bus ride to the farm.', ask: 'Where is Sam going?' },
        { pic: 'bus', text: 'On the bus, Mo sat next to Sam. Mo had no snack.', ask: 'How do you think Mo feels?' },
        { pic: 'bun', text: 'Sam looked at the bun. Then Sam broke it in two.', ask: 'What do you think Sam will do next?' },
        { pic: 'bun', text: '"Half for you and half for me," said Sam. Mo smiled a big smile.', ask: 'Why did Sam share the bun?' },
        { pic: 'cow', text: 'At the farm, a cow said, "Moo!" It was the best half of a bun ever.', ask: 'Can you think of a time you shared something?' }
      ],
      words: ['bun', 'bus', 'snack', 'half', 'smile', 'farm']
    }
  ];

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function picture(word) {
    return '<svg viewBox="0 0 64 64" width="120" height="120" aria-hidden="true" focusable="false">' + PICS[word] + '</svg>';
  }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- voice: on-device voices only ---------- */

  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function chooseVoice() {
    if (!('speechSynthesis' in window)) return null;
    var local = window.speechSynthesis.getVoices().filter(function (v) {
      return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0;
    });
    if (!local.length) return null;
    var wanted = readSetting('voice-name');
    return local.filter(function (v) { return v.name === wanted; })[0] ||
      local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0];
  }
  function setUpVoice() {
    var r = parseFloat(readSetting('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = chooseVoice();
    $('novoice').hidden = !!voice;
    Array.prototype.forEach.call(document.querySelectorAll('.needsvoice'), function (b) { b.hidden = !voice; });
  }
  function say(text) {
    if (!voice) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silent fallback */ }
  }
  function hush() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }

  /* ---------- reader ---------- */

  var story = null, page = 0;

  function show(id) {
    ['menu', 'reader'].forEach(function (s) { $(s).hidden = s !== id; });
  }
  function open(s) {
    story = s; page = 0;
    $('stitle').textContent = s.title;
    show('reader');
    render();
    $('exit').focus();
  }
  function render() {
    hush();
    var area = $('page');
    area.innerHTML = '';
    var last = page >= story.pages.length;
    $('count').textContent = last ? 'The end' : 'Page ' + (page + 1) + ' of ' + story.pages.length;
    $('prev').hidden = page === 0;
    $('next').hidden = last;
    $('readit').hidden = last || !voice;
    if (!last) {
      var p = story.pages[page];
      area.appendChild(el('div', { 'class': 'pic', id: 'pic', 'data-word': p.pic })).innerHTML = picture(p.pic);
      area.appendChild(el('p', { 'class': 'text', id: 'text' }, p.text));
      var ask = el('p', { 'class': 'ask', id: 'ask' });
      ask.appendChild(el('strong', {}, 'Grown-up, ask: '));
      ask.appendChild(document.createTextNode(p.ask));
      area.appendChild(ask);
      $('next').textContent = page === story.pages.length - 1 ? 'Finish the story' : 'Next page';
    } else {
      area.appendChild(el('p', { 'class': 'theend', id: 'theend' }, 'The end.'));
      area.appendChild(el('p', { 'class': 'wordshead' }, voice ? 'Words from the story. Tap a word to hear it:' : 'Words from the story. Read them together:'));
      var row = el('div', { 'class': 'words', id: 'words', role: 'group', 'aria-label': 'Words from the story' });
      story.words.forEach(function (w) {
        var b = el('button', { type: 'button', 'class': 'wordbtn', 'data-word': w }, w);
        b.addEventListener('click', function () { say(w); });
        row.appendChild(b);
      });
      area.appendChild(row);
      var again = el('div', { 'class': 'row endrow' });
      var re = el('button', { type: 'button', id: 'reread' }, 'Read it again');
      re.addEventListener('click', function () { page = 0; render(); });
      var other = el('button', { type: 'button', id: 'another', 'class': 'primary' }, 'Choose another story');
      other.addEventListener('click', function () { hush(); show('menu'); });
      again.appendChild(re); again.appendChild(other);
      area.appendChild(again);
    }
  }

  /* ---------- wiring ---------- */

  function init() {
    var list = $('storylist');
    STORIES.forEach(function (s) {
      var b = el('button', { type: 'button', 'class': 'step', id: 'story-' + s.id });
      b.appendChild(document.createTextNode(s.title));
      b.appendChild(el('small', {}, s.band + '. ' + s.pages.length + ' pages.'));
      b.addEventListener('click', function () { open(s); });
      list.appendChild(b);
    });
    setUpVoice();
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', function () { setUpVoice(); if (story && !$('reader').hidden) $('readit').hidden = page >= story.pages.length || !voice; });
    }
    $('readit').addEventListener('click', function () { if (story && page < story.pages.length) say(story.pages[page].text); });
    $('next').addEventListener('click', function () { page += 1; render(); $(page >= story.pages.length ? 'reread' : 'next').focus(); });
    $('prev').addEventListener('click', function () { page = Math.max(0, page - 1); render(); });
    $('exit').addEventListener('click', function () { hush(); show('menu'); });
    show('menu');
  }

  // Test hook: the stories, so automated tests can compare them with their own copy.
  window.YS_STORIES = STORIES;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
