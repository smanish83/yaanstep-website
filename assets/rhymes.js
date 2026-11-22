/* Yaanstep reading foundations: "Rhymes", "Rhyme time" and "Letter teams" (SCRUM-472, doc 25 items 3 and 4).
   Plain script, no build step. Nothing is stored or sent: the page only reads the voice
   choice and speed that a parent set on the reading page (if any). No microphone.
   Letter teams use doc 25 option A ("sh, as in shoe" with the built-in voice) plus prompt C
   (a grown-up says the sound with the child). All rhymes are our own words. */
(function () {
  'use strict';

  var PICS = window.YS_PICTURES;
  var ROUNDS = 8; // rounds before the "All done for now" screen

  /* ---------- content ---------- */

  // Rhyme groups: words in a group rhyme with each other and with no word outside it.
  var RHYMES = [['cat', 'hat'], ['dog', 'frog'], ['star', 'car'], ['sun', 'bun'],
    ['tree', 'bee'], ['boat', 'goat'], ['duck', 'truck'], ['moon', 'spoon']];
  // Other pictures that rhyme with none of the words above, used only as wrong choices.
  var RHYME_EXTRA = ['ball', 'pig', 'fish', 'cup', 'bus', 'bed', 'egg'];

  // Original rhymes for a grown-up to read with the child. *word* marks a rhyming word.
  var POEMS = [
    { title: 'Little cat', lines: ['Clap, clap, little *cat*,', 'Find your coat and find your *hat*.', 'Off you go, the sun is *out*,', 'Skip and hop and run *about*!'] },
    { title: 'Frog on a log', lines: ['Hop, hop, the little *frog*', 'Jumps up on a big brown *log*.', 'Splish and splash, and in he *goes*,', 'Water up to froggy\'s *toes*!'] },
    { title: 'Goat in a boat', lines: ['A goat in a boat went out to *sea*,', 'He waved to a fish and he waved to a *bee*.', 'The fish said "Hello!" and the bee said "*Hum*!"', 'Then the goat sailed home to the beat of a *drum*.'] },
    { title: 'The big red bus', lines: ['Bump, bump, goes the big red *bus*,', 'There is room for you and room for *us*.', 'Round the tree and past the *shop*,', 'Ding, ding, ding, and now we *stop*!'] }
  ];

  // Letter teams: the letters, an example word that is never on screen, and the picture
  // words that have that sound spelled with those letters.
  var TEAMS = [
    { t: 'sh', anchor: 'shoe', words: ['ship', 'fish'] },
    { t: 'ch', anchor: 'cheese', words: ['chair'] },
    { t: 'th', anchor: 'three', words: ['thumb'] },
    { t: 'ck', anchor: 'sock', words: ['duck', 'truck', 'rocket'] },
    { t: 'ng', anchor: 'king', words: ['ring'] },
    { t: 'ai', anchor: 'snail', words: ['rain'] },
    { t: 'ee', anchor: 'feet', words: ['tree', 'bee'] },
    { t: 'oa', anchor: 'coat', words: ['boat', 'goat'] },
    { t: 'oo', anchor: 'food', words: ['moon', 'spoon', 'igloo'] },
    { t: 'ar', anchor: 'farm', words: ['car', 'star'] },
    { t: 'or', anchor: 'corn', words: ['fork'] },
    { t: 'ow', anchor: 'owl', words: ['cow'] }
  ];
  // The team sounds heard in each picture word (ck is the k sound). A word is never a wrong
  // choice for a team whose sound it has, or whose letters it contains. Accents differ, so a
  // sound some speakers would hear (dog and ball with "or", banana with "ar") counts too.
  var HEARD = {
    cat: 'ck', dog: 'or', sun: '', ball: 'or', moon: 'oo', star: 'ar', hat: '', bus: '', cup: 'ck',
    pig: '', fish: 'sh', frog: 'or', tree: 'ee', book: 'ck', bed: '', car: 'ck ar', egg: '',
    cow: 'ck ow', duck: 'ck', milk: 'ck', apple: '', igloo: 'oo', carrot: 'ck ar', rocket: 'ck',
    pencil: '', teapot: 'ee', banana: 'ar', umbrella: '', octopus: 'ck', bun: '', bee: 'ee',
    boat: 'oa', goat: 'oa', truck: 'ck', spoon: 'oo', ship: 'sh', chair: 'ch', thumb: 'th',
    ring: 'ng', rain: 'ai', fork: 'ck or'
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
  function groupOf(word) { return RHYMES.filter(function (g) { return g.indexOf(word) >= 0; })[0] || [word]; }
  function rhymeWrongs(word) {
    var g = groupOf(word);
    return [].concat.apply([], RHYMES).concat(RHYME_EXTRA).filter(function (w) { return g.indexOf(w) < 0; });
  }
  function teamWrongs(team) {
    return Object.keys(HEARD).filter(function (w) {
      return w.indexOf(team) < 0 && HEARD[w].split(' ').indexOf(team) < 0;
    });
  }
  function marked(word, team) { // the word with its letter team in bold
    var i = word.indexOf(team);
    return word.slice(0, i) + '<b>' + team + '</b>' + word.slice(i + team.length);
  }
  function plain(line) { return line.replace(/\*/g, ''); }

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

  /* ---------- game shell ---------- */

  var game = null, round = 0, firstTry = true;
  var NAMES = { rhyme: 'Rhymes', poems: 'Rhyme time', teams: 'Letter teams' };

  function show(id) {
    ['menu', 'game'].forEach(function (s) { $(s).hidden = s !== id; });
  }
  function total() { return game === 'poems' ? POEMS.length : ROUNDS; }
  function start(name) {
    game = name; round = 0;
    $('title').textContent = NAMES[name];
    $('alldone').hidden = true;
    show('game');
    next();
    $('exit').focus();
  }
  function next() {
    if (round >= total()) {
      $('area').innerHTML = ''; $('sub').textContent = ''; $('again').hidden = true; $('more').hidden = true;
      $('alldone').hidden = false; $('keep').focus();
      return;
    }
    round += 1; firstTry = true; scored = false;
    $('count').textContent = (game === 'poems' ? 'Rhyme ' : 'Round ') + round + ' of ' + total();
    $('more').hidden = true; $('again').hidden = false;
    $('again').textContent = 'Hear it again';
    $('sub').textContent = ''; $('sub').className = 'sub';
    if (game === 'rhyme') rhymeRound(); else if (game === 'teams') teamRound(); else poem();
  }
  /** A right answer: one English point per round, kept only with a child profile (YSPoints, in profile.js). */
  var scored = false;
  function right(message) {
    if (!scored && window.YSPoints) window.YSPoints.add('english', 1);
    scored = true;
    $('sub').textContent = message;
    $('sub').className = 'sub yes';
    say(message);
    Array.prototype.forEach.call($('area').querySelectorAll('button.choice'), function (b) { b.disabled = true; });
    $('more').hidden = false; $('more').focus();
  }
  function notYet(button, message) {
    firstTry = false;
    button.disabled = true; button.classList.add('wrong');
    $('sub').textContent = message;
    $('sub').className = 'sub try';
    say(message);
  }
  /** Fewer choices (a comfort setting in the child's profile): keeps the right answer and one wrong one. */
  function fewer(list, right) { return window.YSComfort ? window.YSComfort.fewer(list, right) : list; }
  function tiles(choices, onTap) {
    var row = el('div', { 'class': 'tiles', role: 'group', 'aria-label': 'Pictures' });
    choices.forEach(function (w) {
      var b = el('button', { type: 'button', 'class': 'tile choice', 'data-word': w, 'aria-label': w },
        picture(w) + '<span class="w" hidden>' + w + '</span>');
      b.addEventListener('click', function () { b.querySelector('.w').hidden = false; onTap(w, b); });
      row.appendChild(b);
    });
    return row;
  }

  /* ---------- Rhymes ---------- */

  function rhymeRound() {
    var group = pick(RHYMES);
    var target = pick(group);
    var answer = pick(group.filter(function (w) { return w !== target; }));
    var choices = fewer(shuffle([answer].concat(shuffle(rhymeWrongs(target)).slice(0, 2))), answer);
    var ask = 'Which picture rhymes with ' + target + '?';
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('div', { 'class': 'beatpic', id: 'target', 'data-word': target }, picture(target) + '<span class="word">' + target + '</span>'));
    area.appendChild(el('p', { 'class': 'ask', id: 'ask' }, ask));
    area.appendChild(tiles(choices, function (w, b) {
      if (w === answer) {
        b.classList.add('right');
        right((firstTry ? 'Yes! ' : 'You found it! ') + cap(target) + ' and ' + w + ' rhyme.');
      } else {
        notYet(b, 'Not yet. That is ' + w + '. Say ' + target + ', then find a word that ends the same way.');
      }
    }));
    $('again').onclick = function () { say(ask); };
    say(ask);
  }

  /* ---------- Rhyme time ---------- */

  function poem() {
    var p = POEMS[round - 1];
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('p', { 'class': 'ask', id: 'poemtitle' }, p.title));
    var html = p.lines.map(function (l) {
      return l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*([^*]+)\*/g, '<b>$1</b>');
    }).join('<br>');
    area.appendChild(el('p', { 'class': 'poem', id: 'poem' }, html));
    area.appendChild(el('p', { 'class': 'hint' }, 'Grown-up: read it with a bouncy beat and clap along. Can your child say the rhyming words in bold?'));
    $('again').textContent = 'Read it to me';
    $('again').onclick = function () { say(p.lines.map(plain).join(' ')); };
    $('more').hidden = false;
  }

  /* ---------- Letter teams ---------- */

  function teamRound() {
    var item = pick(TEAMS);
    var answer = pick(item.words);
    var choices = fewer(shuffle([answer].concat(shuffle(teamWrongs(item.t)).slice(0, 2))), answer);
    var ask = 'Which picture has ' + item.t + ', as in ' + item.anchor + '?';
    var area = $('area');
    area.innerHTML = '';
    area.appendChild(el('p', { 'class': 'letter', id: 'letter', 'data-team': item.t }, item.t));
    area.appendChild(el('p', { 'class': 'ask', id: 'ask' }, ask));
    area.appendChild(el('p', { 'class': 'hint' }, 'Grown-up: say the sound together, then listen for it in each picture word.'));
    area.appendChild(tiles(choices, function (w, b) {
      if (w === answer) {
        b.classList.add('right');
        b.querySelector('.w').innerHTML = marked(w, item.t);
        right((firstTry ? 'Yes! ' : 'You found it! ') + cap(w) + ' has ' + item.t + '.');
      } else {
        notYet(b, 'Not yet. That is ' + w + '. Listen again: ' + item.t + ', as in ' + item.anchor + '.');
      }
    }));
    $('again').onclick = function () { say(ask); };
    say(ask);
  }

  /* ---------- wiring ---------- */

  function init() {
    setUpVoice();
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', setUpVoice);
    }
    $('play-rhyme').addEventListener('click', function () { start('rhyme'); });
    $('play-poems').addEventListener('click', function () { start('poems'); });
    $('play-teams').addEventListener('click', function () { start('teams'); });
    $('more').addEventListener('click', next);
    $('exit').addEventListener('click', function () { window.speechSynthesis && window.speechSynthesis.cancel(); show('menu'); });
    $('keep').addEventListener('click', function () { round = 0; $('alldone').hidden = true; next(); });
    $('stop').addEventListener('click', function () { show('menu'); });
    show('menu');
  }

  // Test hooks: the word lists, so automated tests can check every possible round.
  window.YS_RHYMES = { RHYMES: RHYMES, RHYME_EXTRA: RHYME_EXTRA, POEMS: POEMS, TEAMS: TEAMS, HEARD: HEARD };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
