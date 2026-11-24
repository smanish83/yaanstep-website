/* Yaanstep reading foundations: "First sounds" and "Word beats" (SCRUM-472, doc 25).
   Plain script, no build step. Nothing is stored or sent: the page only reads the voice
   choice and speed that a parent set on the reading page (if any). No microphone. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES;
  var ROUNDS = 8; // rounds before the "All done for now" screen

  /* ---------- content ---------- */

  // First sounds: the letter, an example word that is never on screen, and the picture words
  // that start with that sound. c and k make the same first sound, so a c round never offers
  // another c or k word as a wrong choice.
  var FIRST = [
    { l: 's', anchor: 'sock', words: ['sun'] },
    { l: 'c', anchor: 'cap', words: ['cat', 'car', 'cow', 'cup'] },
    { l: 'd', anchor: 'door', words: ['dog', 'duck'] },
    { l: 'b', anchor: 'bag', words: ['ball', 'bus', 'bed', 'book'] },
    { l: 'h', anchor: 'hen', words: ['hat'] },
    { l: 'm', anchor: 'map', words: ['moon', 'milk'] },
    { l: 'f', anchor: 'fox', words: ['fish'] },
    { l: 'p', anchor: 'pen', words: ['pig'] }
  ];
  var FIRST_POOL = ['cat', 'dog', 'sun', 'ball', 'moon', 'star', 'hat', 'bus', 'cup', 'pig', 'fish', 'frog',
    'tree', 'book', 'bed', 'car', 'egg', 'cow', 'duck', 'milk'];
  var SAME_SOUND = { c: 'ck', k: 'ck' };

  // Word beats (syllables). Splits are shown after the answer; the voice says only whole words.
  var BEATS = {
    1: ['cat', 'dog', 'sun', 'bus', 'cup', 'pig', 'hat', 'fish', 'ball', 'moon', 'book', 'bed', 'egg', 'duck', 'milk'],
    2: ['ap-ple', 'ig-loo', 'car-rot', 'rock-et', 'pen-cil', 'tea-pot'],
    3: ['ba-na-na', 'um-brel-la', 'oc-to-pus']
  };

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(list) { return list[rnd(list.length)]; }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function picture(word) {
    return '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">' + PICS[word] + '</svg>';
  }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function sameSound(a, b) {
    var x = SAME_SOUND[a] || a, y = SAME_SOUND[b] || b;
    return x === y || x.indexOf(b) >= 0 || y.indexOf(a) >= 0;
  }

  /* ---------- voice: on-device voices only ---------- */

  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function chooseVoice() {
    if (!('speechSynthesis' in window)) return null;
    var local = (window.YSVoice ? window.YSVoice.english() : window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; }));
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
  }
  function say(text, slow) {
    if (!voice) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = slow ? Math.max(0.5, rate * 0.65) : rate;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silent fallback */ }
  }

  /* ---------- game shell ---------- */

  var game = null, round = 0, firstTry = true;

  function show(id) {
    ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; });
  }
  function start(name) {
    game = name; round = 0;
    $('title').textContent = name === 'first' ? 'First sounds' : 'Word beats';
    $('alldone').hidden = true;
    show('game');
    next();
    $('exit').focus();
  }
  function next() {
    if (round >= ROUNDS) {
      $('area').innerHTML = ''; $('sub').textContent = ''; $('again').hidden = true; $('more').hidden = true;
      $('alldone').hidden = false; $('keep').focus();
      return;
    }
    round += 1; firstTry = true; scored = false;
    $('count').textContent = 'Round ' + round + ' of ' + ROUNDS;
    $('more').hidden = true; $('again').hidden = false;
    if (game === 'first') firstRound(); else beatsRound();
  }
  /** A right answer: one English point per round, kept only with a child profile (YSPoints, in profile.js). */
  var scored = false;
  function right(message, speech) {
    if (!scored && window.YSPoints) window.YSPoints.add('english', 1);
    scored = true;
    $('sub').textContent = message;
    $('sub').className = 'sub yes';
    say(speech || message);
    Array.prototype.forEach.call($('area').querySelectorAll('button.choice'), function (b) { b.disabled = true; });
    $('more').hidden = false; $('more').focus();
  }
  function notYet(button, message, speech) {
    firstTry = false;
    button.disabled = true; button.classList.add('wrong');
    $('sub').textContent = message;
    $('sub').className = 'sub try';
    say(speech || message);
  }

  /* ---------- First sounds ---------- */

  /** Fewer choices (a comfort setting in the child's profile): keeps the right answer and one wrong one. */
  function fewer(list, right) { return window.YSComfort ? window.YSComfort.fewer(list, right) : list; }
  function firstRound() {
    var item = pick(FIRST);
    var answer = pick(item.words);
    var others = shuffle(FIRST_POOL.filter(function (w) { return !sameSound(w[0], item.l); })).slice(0, 2);
    var choices = fewer(shuffle([answer].concat(others)), answer);
    var ask = 'Which picture starts with ' + item.l + ', as in ' + item.anchor + '?';
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('p', { 'class': 'letter', id: 'letter', 'aria-hidden': 'true' }, item.l));
    area.appendChild(el('p', { 'class': 'ask', id: 'ask' }, ask));
    var row = el('div', { 'class': 'tiles', role: 'group', 'aria-label': 'Pictures' });
    choices.forEach(function (w) {
      var b = el('button', { type: 'button', 'class': 'tile choice', 'data-word': w, 'aria-label': w },
        picture(w) + '<span class="w" hidden>' + w + '</span>');
      b.addEventListener('click', function () {
        b.querySelector('.w').hidden = false;
        if (w === answer) {
          b.classList.add('right');
          right((firstTry ? 'Yes! ' : 'You found it! ') + cap(w) + ' starts with ' + item.l + '.');
        } else {
          notYet(b, 'Not yet. That is ' + w + '. Listen again: ' + item.l + ', as in ' + item.anchor + '.');
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
    $('sub').textContent = ''; $('sub').className = 'sub';
    $('again').onclick = function () { say(ask); };
    say(ask);
  }

  /* ---------- Word beats ---------- */

  function beatsRound() {
    var n = 1 + rnd(3);
    var split = pick(BEATS[n]);
    var parts = split.split('-');
    var word = parts.join('');
    var ask = 'How many beats in ' + word + '?';
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('div', { 'class': 'beatpic', id: 'beatpic', 'data-word': word }, picture(word) + '<span class="word">' + word + '</span>'));
    area.appendChild(el('p', { 'class': 'ask', id: 'ask' }, ask + ' Say it slowly and clap.'));
    var row = el('div', { 'class': 'beatbtns', role: 'group', 'aria-label': 'Number of beats' });
    [1, 2, 3].forEach(function (k) {
      var b = el('button', { type: 'button', 'class': 'choice', 'data-beats': String(k) },
        '<span class="claps" aria-hidden="true">' + new Array(k + 1).join('&#x1F44F;') + '</span>' + k + (k === 1 ? ' beat' : ' beats'));
      b.addEventListener('click', function () {
        if (k === n) {
          b.classList.add('right');
          var shown = parts.join(' &middot; ');
          area.appendChild(el('p', { 'class': 'split', id: 'split' }, shown));
          right((firstTry ? 'Yes! ' : 'You got it! ') + cap(word) + ' has ' + n + (n === 1 ? ' beat.' : ' beats.'));
        } else {
          notYet(b, 'Not yet. Listen to ' + word + ' slowly, and clap once for each beat.', 'Not yet. Listen: ' + word + '.');
          window.setTimeout(function () { say(word, true); }, 1400);
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
    $('sub').textContent = ''; $('sub').className = 'sub';
    $('again').onclick = function () { say(word, true); };
    say(ask);
  }

  /* ---------- wiring ---------- */

  function init() {
    setUpVoice();
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', setUpVoice);
    }
    $('play-first').addEventListener('click', function () { start('first'); });
    $('play-beats').addEventListener('click', function () { start('beats'); });
    $('more').addEventListener('click', next);
    $('exit').addEventListener('click', function () { window.speechSynthesis && window.speechSynthesis.cancel(); show('menu'); });
    $('keep').addEventListener('click', function () { round = 0; $('alldone').hidden = true; next(); });
    $('stop').addEventListener('click', function () { show('menu'); });
    show('menu');
  }

  // Test hooks: the word lists, so automated tests can check every possible round.
  window.YS_SOUNDS = { FIRST: FIRST, FIRST_POOL: FIRST_POOL, BEATS: BEATS, sameSound: sameSound };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
