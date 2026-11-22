/* Yaanstep Sprouts story library (SCRUM-497). Complete picture books under open licences
   (CC BY or public domain), kept on this site with the credits each licence asks for.
   Plain script, no build step. Nothing is stored or sent: the page only reads the voice and
   speed a parent chose on the reading page, and the profile age. The voice speaks only when tapped.
   While the voice reads, the word it is on lights up (read-along marker, SCRUM-496).
   "Read the whole story to me" reads each page and turns to the next by itself (Manish, 22 Nov 2026),
   at a speed that starts slow for young children and can be changed in the reader (not saved). */
(function () {
  'use strict';

  var BASE = 'stories/';
  var catalog = [], book = null, page = 0, filters = { ages: 'all', length: 'all', q: '' };

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function read(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function childAge() { try { var p = JSON.parse(read('ys-profile') || 'null'); return p && p.age ? +p.age : 0; } catch (e) { return 0; } }
  function band(age) { return age <= 4 ? '3-5' : age <= 6 ? '5-7' : age <= 8 ? '7-9' : '9-12'; }
  var BANDS = { '3-5': 'Ages 3 to 5', '5-7': 'Ages 5 to 7', '7-9': 'Ages 7 to 9', '9-12': 'Ages 9 to 12' };

  /* ---------- voice: on-device voices only, with a marker on the word being read ---------- */

  var voice = null, rate = 0.8, markTimer = null, reading = 0;
  // Reading speeds; the start depends on the child's age: younger children hear it slower.
  var SPEEDS = [{ v: '0.6', name: 'Very slow' }, { v: '0.7', name: 'Slow' }, { v: '0.8', name: 'Gentle' }, { v: '0.95', name: 'Normal' }];
  function startRate() {
    var r = parseFloat(read('rd-speed')), age = childAge();
    var byAge = !age ? 0.8 : age <= 5 ? 0.7 : age <= 7 ? 0.8 : 0.95;
    // A speed a grown-up chose on the reading page counts only when it is slower than the age speed.
    return r >= 0.5 && r <= 1.5 ? Math.min(r, byAge) : byAge;
  }
  function setUpVoice() {
    voice = null;
    if ('speechSynthesis' in window) {
      var local = window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
      var wanted = read('voice-name');
      voice = local.filter(function (v) { return v.name === wanted; })[0] || local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
    }
    $('novoice').hidden = !!voice;
    if (book) { $('readit').hidden = !voice || auto || page < 0 || page >= book.pages.length; showAuto(); }
  }
  function spans() { return document.querySelectorAll('#ltext .w'); }
  function mark(i) { var s = spans(); for (var k = 0; k < s.length; k++) s[k].className = k === i ? 'w now' : 'w'; }
  function unmark() { clearInterval(markTimer); markTimer = null; mark(-1); }
  function hush() { reading++; unmark(); try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }
  function wordsInto(p, text) {
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) p.appendChild(document.createTextNode(part.indexOf('\n') > -1 ? ' ' : part));
      else p.appendChild(el('span', { 'class': 'w' }, part));
    });
  }
  // The marker follows the voice. Where the voice reports each word, the marker jumps to it; between reports, and on
  // voices that report nothing, it moves on by time. The time per letter is learnt from each page the voice has read,
  // so the marker keeps up with this device's voice at the chosen speed instead of falling behind it.
  var paceAt1 = 62; // ms per letter at speed 1, counting a space as a letter and a pause after . ! ? or , as several
  function plan(words) {
    var at = [], t = 0;
    words.forEach(function (w) { at.push(t); t += w.length + 1 + (/[.!?]["”’']?$/.test(w) ? 6 : /[,;:]["”’']?$/.test(w) ? 3 : 0); });
    return { at: at, total: t };
  }
  function readAlong(text, done) {
    if (!voice) return;
    hush();
    var starts = [], re = /\S+/g, m, me = ++reading, over = false, guard = null;
    while ((m = re.exec(text))) starts.push(m.index);
    var words = text.match(/\S+/g) || [], p = plan(words), cur = -1, began = 0, anchorT = 0, anchorW = 0, myRate = rate;
    function tick() {
      if (me !== reading || !words.length) return;
      var pos = p.at[anchorW] + (Date.now() - anchorT) * myRate / paceAt1, i = anchorW;
      while (i + 1 < words.length && p.at[i + 1] <= pos) i++;
      if (i !== cur) { cur = i; mark(i); }
    }
    function begin(at) { anchorT = at; anchorW = 0; tick(); clearInterval(markTimer); markTimer = setInterval(tick, 50); }
    function finish(e) {
      if (over || me !== reading) return;
      over = true; clearTimeout(guard);
      var took = Date.now() - began;
      if (e && e.type === 'end' && began && took > 400 && p.total > 20) {
        var seen = took * myRate / p.total;
        if (seen > 25 && seen < 160) paceAt1 = paceAt1 * 0.3 + seen * 0.7;
      }
      unmark();
      if (done) done();
    }
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = myRate;
      // Some voices never say they have started, so the marker starts when asked to speak and is reset on start.
      u.onstart = function () { if (me === reading) { began = Date.now(); begin(began); } };
      u.onboundary = function (e) {
        if ((e.name && e.name !== 'word') || me !== reading) return;
        var i = 0;
        while (i + 1 < starts.length && starts[i + 1] <= e.charIndex) i++;
        anchorW = i; anchorT = Date.now(); cur = -1; tick();
      };
      u.onend = function (e) { finish(e && e.type ? e : { type: 'end' }); };
      u.onerror = function () { finish(null); };
      window.speechSynthesis.speak(u);
      began = Date.now(); begin(began);
      // Some voices never say they have finished: move on after about twice the time the page should take.
      guard = setTimeout(finish, 2 * p.total * paceAt1 / myRate + 4000);
    } catch (e) { unmark(); }
  }
  window.YS_READ = { pace: function () { return paceAt1; } };

  /* ---------- the shelf ---------- */

  function lengthOf(b) { return b.minutes <= 4 ? 'short' : b.minutes <= 9 ? 'medium' : 'long'; }
  function shown() {
    var q = filters.q.trim().toLowerCase();
    return catalog.filter(function (b) {
      return (filters.ages === 'all' || b.ages === filters.ages) &&
        (filters.length === 'all' || lengthOf(b) === filters.length) &&
        (!q || b.title.toLowerCase().indexOf(q) > -1);
    });
  }
  var PAGE_SIZE = 24, limit = PAGE_SIZE, cards = {};
  function drawShelf() {
    var list = shown(), shelf = $('shelf');
    shelf.innerHTML = '';
    $('found').textContent = list.length === 1 ? '1 book' : list.length + ' books';
    list.slice(0, limit).forEach(function (b) {
      // Keep each card once made, so a cover that is still loading is not thrown away when the shelf is redrawn.
      if (cards[b.id]) { shelf.appendChild(cards[b.id]); return; }
      var li = el('li', {});
      cards[b.id] = li;
      var btn = el('button', { type: 'button', 'class': 'bookbtn', 'data-id': b.id });
      var img = el('img', { src: BASE + b.cover, alt: '', width: '160', height: '120', loading: 'lazy', decoding: 'async' });
      btn.appendChild(img);
      btn.appendChild(el('span', { 'class': 'bt' }, b.title));
      btn.appendChild(el('small', {}, BANDS[b.ages] + ' · about ' + b.minutes + (b.minutes === 1 ? ' minute' : ' minutes') + ' · ' + b.pages + ' pages'));
      btn.addEventListener('click', function () { openBook(b.id, btn); });
      li.appendChild(btn);
      shelf.appendChild(li);
    });
    $('more').hidden = list.length <= limit;
  }

  /* ---------- the reader ---------- */

  var opener = null;
  function openBook(id, from) {
    opener = from || null;
    fetch(BASE + 'books/' + id + '.json').then(function (r) { if (!r.ok) throw new Error('missing'); return r.json(); }).then(function (b) {
      book = b; page = -1;
      $('btitle').textContent = b.title;
      $('library').hidden = true; $('reader').hidden = false;
      render();
      $('rexit').focus();
    }).catch(function () { $('loaderr').hidden = false; });
  }
  function credits(c) {
    var box = el('div', { 'class': 'credits', id: 'credits' });
    var line = function (label, names) { if (names && names.length) box.appendChild(el('p', {}, label + ': ' + names.join(', '))); };
    line('Story', c.authors); line('Pictures', c.illustrators); line('Translation', c.translators);
    if (c.publisher) box.appendChild(el('p', {}, 'Publisher: ' + c.publisher));
    var src = el('p', {});
    src.appendChild(document.createTextNode('From '));
    var a = el('a', { href: c.source, rel: 'noopener', target: '_blank' }, c.platform);
    src.appendChild(a);
    src.appendChild(document.createTextNode(', shared under '));
    src.appendChild(el('a', { href: c.licenceUrl, rel: 'license noopener', target: '_blank' }, c.licence));
    src.appendChild(document.createTextNode('. ' + (c.changes || '')));
    box.appendChild(src);
    return box;
  }
  function render() {
    hush(); clearTimeout(turnTimer);
    var area = $('rpage'), n = book.pages.length;
    area.innerHTML = '';
    $('rprev').hidden = page < 0;
    $('rnext').hidden = page >= n;
    $('readit').hidden = page < 0 || page >= n || !voice || auto;
    if (page >= n) auto = false;
    showAuto();
    if (page < 0) {
      $('rcount').textContent = 'Cover';
      if (book.pages[0] && book.pages[0].img) area.appendChild(el('img', { 'class': 'pg', src: BASE + book.pages[0].img, alt: '', width: '800', height: '600' }));
      area.appendChild(el('p', { 'class': 'cover-t' }, book.title));
      area.appendChild(el('p', { 'class': 'meta' }, BANDS[book.ages] + ' · about ' + book.minutes + (book.minutes === 1 ? ' minute' : ' minutes') + ' · ' + n + ' pages'));
      area.appendChild(credits(book.credits));
      $('rnext').textContent = 'Start reading';
      return;
    }
    if (page >= n) {
      $('rcount').textContent = 'The end';
      area.appendChild(el('p', { 'class': 'theend', id: 'ltheend' }, 'The end.'));
      area.appendChild(el('p', {}, 'Ask: what was your favourite page? Why?'));
      area.appendChild(credits(book.credits));
      var row = el('div', { 'class': 'row' });
      var again = el('button', { type: 'button', id: 'lagain' }, 'Read it again');
      again.addEventListener('click', function () { page = 0; render(); $('rnext').focus(); });
      var other = el('button', { type: 'button', 'class': 'primary', id: 'lother' }, 'Choose another book');
      other.addEventListener('click', closeBook);
      row.appendChild(again); row.appendChild(other);
      area.appendChild(row);
      return;
    }
    var p = book.pages[page];
    $('rcount').textContent = 'Page ' + (page + 1) + ' of ' + n;
    if (p.img) area.appendChild(el('img', { 'class': 'pg', src: BASE + p.img, alt: '', width: '800', height: '600', decoding: 'async' }));
    var t = el('p', { 'class': 'ltext', id: 'ltext' });
    wordsInto(t, p.text);
    area.appendChild(t);
    $('rnext').textContent = page === n - 1 ? 'Finish the book' : 'Next page';
    var nx = book.pages[page + 1];
    if (nx && nx.img) { var pre = new Image(); pre.src = BASE + nx.img; }
  }
  /* ---------- reading the whole story: each page is read, then the next page turns by itself ---------- */

  var auto = false, turnTimer = null;
  function pauseMs() { return (window.YS_TURN_MS != null ? window.YS_TURN_MS : 1500) / rate; }
  function showAuto() {
    var have = !!voice && !!book && page < book.pages.length;
    $('readall').hidden = !have || auto;
    $('pauseread').hidden = !auto;
    $('speedrow').hidden = !voice || !book || page >= book.pages.length;
  }
  function readOn() {
    if (!auto || !book) return;
    if (page < 0) { page = 0; render(); }
    if (page >= book.pages.length) { stopAuto(); return; }
    readAlong(book.pages[page].text, function () {
      if (!auto) return;
      turnTimer = setTimeout(function () {
        if (!auto) return;
        page += 1; render();
        if (page < book.pages.length) readOn(); else { stopAuto(); var a = $('lagain'); if (a) a.focus(); }
      }, pauseMs());
    });
  }
  function startAuto() { if (!voice || !book) return; auto = true; showAuto(); $('readit').hidden = true; readOn(); $('pauseread').focus(); }
  function stopAuto() {
    var was = auto;
    auto = false; clearTimeout(turnTimer); hush();
    if (book) { showAuto(); $('readit').hidden = page < 0 || page >= book.pages.length || !voice; }
    if (was && !$('readall').hidden && document.activeElement && document.activeElement.id === 'pauseread') $('readall').focus();
  }

  function closeBook() {
    auto = false; clearTimeout(turnTimer);
    hush();
    $('reader').hidden = true; $('library').hidden = false;
    book = null;
    if (opener && document.body.contains(opener)) opener.focus(); else $('q').focus();
  }

  /* ---------- wiring ---------- */

  function init() {
    var age = childAge();
    if (age) { filters.ages = band(age); $('ages').value = filters.ages; }
    $('ages').addEventListener('change', function (e) { filters.ages = e.target.value; limit = PAGE_SIZE; drawShelf(); });
    $('length').addEventListener('change', function (e) { filters.length = e.target.value; limit = PAGE_SIZE; drawShelf(); });
    $('q').addEventListener('input', function (e) { filters.q = e.target.value; limit = PAGE_SIZE; drawShelf(); });
    $('more').addEventListener('click', function () {
      var first = limit; limit += PAGE_SIZE; drawShelf();
      var b = $('shelf').querySelectorAll('.bookbtn')[first]; if (b) b.focus();
    });
    $('rnext').addEventListener('click', function () { page += 1; render(); if (auto) readOn(); ($('lagain') || $('rnext')).focus(); });
    $('rprev').addEventListener('click', function () { page = Math.max(-1, page - 1); render(); if (auto) readOn(); });
    $('readall').addEventListener('click', startAuto);
    $('pauseread').addEventListener('click', stopAuto);
    var sp = $('rspeed');
    SPEEDS.forEach(function (o) { sp.appendChild(el('option', { value: o.v }, o.name)); });
    rate = startRate();
    sp.value = (SPEEDS.filter(function (o) { return +o.v <= rate + 0.001; }).pop() || SPEEDS[0]).v;
    rate = +sp.value;
    sp.addEventListener('change', function () { rate = +sp.value; if (auto) { clearTimeout(turnTimer); readOn(); } });
    $('rexit').addEventListener('click', closeBook);
    $('readit').addEventListener('click', function () { if (book && page >= 0 && page < book.pages.length) readAlong(book.pages[page].text); });
    setUpVoice();
    if ('speechSynthesis' in window && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', setUpVoice);
    fetch(BASE + 'catalog.json').then(function (r) { if (!r.ok) throw new Error('missing'); return r.json(); }).then(function (c) {
      catalog = c; $('total').textContent = String(c.length); drawShelf();
    }).catch(function () { $('loaderr').hidden = false; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
