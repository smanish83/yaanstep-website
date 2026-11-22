/* Yaanstep reading: "Parts of a sentence" (mode D1, SCRUM-429, doc 19 as updated 16 Nov 2026).
   A 3-screen lesson, then 5 fill-in-the-blank rounds: who or what, what is it doing, where, what is it like.
   Every sentence is built from the small lists below. In every round exactly one choice makes sense;
   the wrong choices are chosen so they cannot fit (an animal sound another animal makes, a place
   something cannot be, a colour the drawing does not have). Nothing is stored or sent. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES;
  var ROUNDS = 5;

  /* ---------- content ---------- */

  // Who or what: the picture shows the answer; the other choices are things that cannot do the action.
  var WHO = [
    { word: 'frog', rest: 'hops.' }, { word: 'fish', rest: 'swims.' }, { word: 'dog', rest: 'barks.' },
    { word: 'cow', rest: 'moos.' }, { word: 'duck', rest: 'quacks.' }, { word: 'pig', rest: 'oinks.' }
  ];
  var THINGS = ['cup', 'bed', 'book', 'egg', 'hat', 'milk']; // no ball (a ball can bounce) and no tree (a tree has bark)

  // What is it doing: each animal and the sound or move only it makes in this list.
  var DOING = { dog: 'barks', cow: 'moos', duck: 'quacks', pig: 'oinks', cat: 'meows' };
  var MOVES = { frog: 'hops', fish: 'swims' };
  var SOUNDS = ['barks', 'moos', 'quacks', 'oinks', 'meows'];

  // Where: the right place and places the thing cannot be.
  var WHERE = [
    { word: 'sun', sentence: ['The sun is in the', 'sky'], wrong: ['cup', 'egg', 'hat'] },
    { word: 'moon', sentence: ['The moon is in the', 'sky'], wrong: ['cup', 'egg', 'hat'] },
    { word: 'star', sentence: ['The star is in the', 'sky'], wrong: ['cup', 'egg', 'hat'] },
    { word: 'cat', sentence: ['The cat sleeps on the', 'bed'], wrong: ['sun', 'moon', 'star'] },
    { word: 'car', sentence: ['The car is on the', 'road'], wrong: ['cup', 'egg', 'hat'] },
    { word: 'fish', sentence: ['The fish swims in the', 'water'], wrong: ['bed', 'hat', 'book'] },
    { word: 'cow', sentence: ['The cow eats grass in the', 'field'], wrong: ['cup', 'egg', 'hat'] }
  ];

  // What is it like: the main colour of each drawing, and colours that also show in it (never offered as wrong).
  var COLOUR = [
    { word: 'frog', colour: 'green', also: [] }, { word: 'ball', colour: 'red', also: [] },
    { word: 'hat', colour: 'blue', also: [] }, { word: 'fish', colour: 'orange', also: [] },
    { word: 'pig', colour: 'pink', also: [] }, { word: 'duck', colour: 'yellow', also: ['orange'] },
    { word: 'cup', colour: 'blue', also: [] }, { word: 'car', colour: 'red', also: ['blue'] },
    { word: 'sun', colour: 'yellow', also: ['orange'] }
  ];
  var COLOURS = ['red', 'blue', 'green', 'yellow', 'pink', 'orange'];

  var LESSON = [
    {
      say: 'A sentence tells a whole idea. It starts with a capital letter and ends with a full stop.',
      pic: 'cat',
      parts: [['The cat', 'who'], ['naps', 'doing'], ['.', 'stop']],
      note: 'Capital letter at the start. Full stop at the end.'
    },
    {
      say: 'Every sentence says who or what, and what it is doing. The dog is who. Runs is what it is doing.',
      pic: 'dog',
      parts: [['The dog', 'who'], ['runs', 'doing'], ['.', 'stop']],
      note: 'Who or what: the dog. What it is doing: runs.'
    },
    {
      say: 'We can add more. Big tells what the dog is like. To the tree tells where it runs.',
      pic: 'dog',
      parts: [['The', 'who'], ['big', 'like'], ['dog', 'who'], ['runs', 'doing'], ['to the tree', 'where'], ['.', 'stop']],
      note: 'What it is like: big. Where: to the tree.'
    }
  ];
  var LABEL = { who: 'who or what', doing: 'what it is doing', where: 'where', like: 'what it is like', stop: 'full stop' };

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(list) { return list[rnd(list.length)]; }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function picture(word) {
    return '<svg viewBox="0 0 64 64" width="96" height="96" aria-hidden="true" focusable="false">' + PICS[word] + '</svg>';
  }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------- voice: on-device voices only ---------- */

  var voice = null, rate = 0.9;
  function readSetting(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function setUpVoice() {
    var r = parseFloat(readSetting('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = null;
    if ('speechSynthesis' in window) {
      var local = window.speechSynthesis.getVoices().filter(function (v) {
        return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0;
      });
      var wanted = readSetting('voice-name');
      voice = local.filter(function (v) { return v.name === wanted; })[0] ||
        local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
    }
    $('novoice').hidden = !!voice;
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

  /* ---------- rounds ---------- */

  // Each maker returns { kind, pic, before, after, answer, choices, hint }.
  function whoRound() {
    var item = pick(WHO);
    return {
      kind: 'who', pic: item.word, before: 'The', after: item.rest, answer: item.word,
      choices: shuffle([item.word].concat(shuffle(THINGS).slice(0, 2))),
      hint: 'Look at the picture. Who is it?'
    };
  }
  function doingRound() {
    var animals = Object.keys(DOING).concat(Object.keys(MOVES)).filter(function (a) { return PICS[a]; });
    var who = pick(animals);
    var answer = DOING[who] || MOVES[who];
    var wrong = shuffle(SOUNDS.filter(function (s) { return s !== answer; })).slice(0, 2);
    return {
      kind: 'doing', pic: who, before: 'The ' + who, after: '.', answer: answer,
      choices: shuffle([answer].concat(wrong)),
      hint: 'What does a ' + who + ' do?'
    };
  }
  function whereRound() {
    var item = pick(WHERE);
    return {
      kind: 'where', pic: item.word, before: item.sentence[0], after: '.', answer: item.sentence[1],
      choices: shuffle([item.sentence[1]].concat(shuffle(item.wrong).slice(0, 2))),
      hint: 'Where can a ' + item.word + ' be?'
    };
  }
  function likeRound() {
    var item = pick(COLOUR);
    var wrong = shuffle(COLOURS.filter(function (c) { return c !== item.colour && item.also.indexOf(c) < 0; })).slice(0, 2);
    return {
      kind: 'like', pic: item.word, before: 'The ' + item.word + ' is', after: '.', answer: item.colour,
      choices: shuffle([item.colour].concat(wrong)),
      hint: 'Look at the picture. What colour is the ' + item.word + '?'
    };
  }
  var MAKERS = [whoRound, doingRound, whereRound, likeRound];
  var KIND_LABEL = { who: 'Who or what?', doing: 'What is it doing?', where: 'Where?', like: 'What is it like?' };

  /* ---------- screens ---------- */

  var plan = [], round = 0, firstTry = true, lessonAt = 0;

  function show(id) { ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; }); }

  function startLesson() {
    lessonAt = 0;
    $('title').textContent = 'Parts of a sentence';
    $('alldone').hidden = true;
    show('game');
    lessonScreen();
    $('exit').focus();
  }
  function lessonScreen() {
    var s = LESSON[lessonAt];
    $('count').textContent = 'Lesson ' + (lessonAt + 1) + ' of ' + LESSON.length;
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('div', { 'class': 'pic' }, picture(s.pic)));
    var line = el('p', { 'class': 'parts', id: 'parts' });
    s.parts.forEach(function (p) {
      line.appendChild(el('span', { 'class': 'part ' + p[1], title: LABEL[p[1]] }, p[0]));
    });
    area.appendChild(line);
    area.appendChild(el('p', { 'class': 'ask', id: 'lessonsay' }, s.say));
    area.appendChild(el('p', { 'class': 'keyline' }, s.note));
    $('sub').textContent = ''; $('sub').className = 'sub';
    $('again').hidden = false; $('again').onclick = function () { say(s.say); };
    $('more').hidden = false;
    $('more').textContent = lessonAt < LESSON.length - 1 ? 'Next' : 'Start the game';
    say(s.say);
  }
  function startGame() {
    // one round of each kind, then one more at random, in a shuffled order
    plan = shuffle(MAKERS.concat([pick(MAKERS)]));
    round = 0;
    $('title').textContent = 'Fill the gap';
    $('alldone').hidden = true;
    show('game');
    nextRound();
  }
  function nextRound() {
    if (round >= ROUNDS) {
      $('area').innerHTML = ''; $('sub').textContent = ''; $('again').hidden = true; $('more').hidden = true;
      $('count').textContent = '';
      $('alldone').hidden = false; $('keep').focus();
      return;
    }
    var r = plan[round]();
    round += 1; firstTry = true;
    $('count').textContent = 'Round ' + round + ' of ' + ROUNDS;
    $('more').hidden = true; $('more').textContent = 'Next';
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('p', { 'class': 'kind', id: 'kind' }, KIND_LABEL[r.kind]));
    area.appendChild(el('div', { 'class': 'pic', id: 'pic', 'data-word': r.pic }, picture(r.pic)));
    var line = el('p', { 'class': 'gapline', id: 'gapline', 'data-kind': r.kind });
    line.appendChild(document.createTextNode(r.before + ' '));
    var gap = el('span', { 'class': 'gap', id: 'gap' }, '&nbsp;?&nbsp;');
    line.appendChild(gap);
    line.appendChild(document.createTextNode(r.after === '.' ? '.' : ' ' + r.after));
    area.appendChild(line);
    var row = el('div', { 'class': 'words', role: 'group', 'aria-label': 'Choose a word for the gap' });
    var asked = r.before + ' ... ' + (r.after === '.' ? '' : r.after);
    r.choices.forEach(function (w) {
      var b = el('button', { type: 'button', 'class': 'choice', 'data-word': w }, w);
      b.addEventListener('click', function () {
        if (w === r.answer) {
          gap.textContent = w; gap.classList.add('filled');
          var full = r.before + ' ' + w + (r.after === '.' ? '.' : ' ' + r.after);
          Array.prototype.forEach.call(row.querySelectorAll('button'), function (x) { x.disabled = true; });
          b.classList.add('right');
          $('sub').textContent = (firstTry ? 'Yes! ' : 'You got it! ') + full;
          $('sub').className = 'sub yes';
          say(full);
          $('more').hidden = false; $('more').focus();
        } else {
          firstTry = false;
          b.disabled = true; b.classList.add('wrong');
          $('sub').textContent = 'Not yet. ' + r.hint;
          $('sub').className = 'sub try';
          say('Not yet. ' + r.hint);
        }
      });
      row.appendChild(b);
    });
    area.appendChild(row);
    $('sub').textContent = ''; $('sub').className = 'sub';
    $('again').hidden = false; $('again').onclick = function () { say(asked); };
    say(KIND_LABEL[r.kind] + ' ' + asked);
  }

  var mode = 'lesson';
  function onMore() {
    if (mode === 'lesson') {
      if (lessonAt < LESSON.length - 1) { lessonAt += 1; lessonScreen(); }
      else { mode = 'game'; startGame(); }
    } else nextRound();
  }

  function init() {
    setUpVoice();
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', setUpVoice);
    }
    $('play-lesson').addEventListener('click', function () { mode = 'lesson'; startLesson(); });
    $('play-game').addEventListener('click', function () { mode = 'game'; startGame(); });
    $('more').addEventListener('click', onMore);
    $('exit').addEventListener('click', function () { if (window.speechSynthesis) window.speechSynthesis.cancel(); show('menu'); });
    $('keep').addEventListener('click', function () { mode = 'game'; startGame(); });
    $('stop').addEventListener('click', function () { show('menu'); });
    show('menu');
  }

  window.YS_SENTENCES = { WHO: WHO, THINGS: THINGS, DOING: DOING, MOVES: MOVES, SOUNDS: SOUNDS, WHERE: WHERE, COLOUR: COLOUR, COLOURS: COLOURS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
