/* Yaanstep Sprouts story library (SCRUM-497). Complete picture books under open licences
   (CC BY or public domain), kept on this site with the credits each licence asks for.
   Plain script, no build step. Nothing is stored or sent: the page only reads the voice and
   speed a parent chose on the reading page, and the profile age. The voice speaks only when tapped.
   While the voice reads, the word it is on lights up (read-along marker, SCRUM-496). */
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

  var voice = null, rate = 0.9, markTimer = null, reading = 0;
  function setUpVoice() {
    var r = parseFloat(read('rd-speed'));
    if (r >= 0.5 && r <= 1.5) rate = r;
    voice = null;
    if ('speechSynthesis' in window) {
      var local = window.speechSynthesis.getVoices().filter(function (v) { return v.localService && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
      var wanted = read('voice-name');
      voice = local.filter(function (v) { return v.name === wanted; })[0] || local.filter(function (v) { return v.lang === 'en-US'; })[0] || local[0] || null;
    }
    $('novoice').hidden = !!voice;
    if (book) $('readit').hidden = !voice || page >= book.pages.length;
  }
  function spans() { return document.querySelectorAll('#ltext .w'); }
  function mark(i) { var s = spans(); for (var k = 0; k < s.length; k++) s[k].className = k === i ? 'w now' : 'w'; }
  function unmark() { clearTimeout(markTimer); markTimer = null; mark(-1); }
  function hush() { reading++; unmark(); try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }
  function wordsInto(p, text) {
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) p.appendChild(document.createTextNode(part.indexOf('\n') > -1 ? ' ' : part));
      else p.appendChild(el('span', { 'class': 'w' }, part));
    });
  }
  function readAlong(text) {
    if (!voice) return;
    hush();
    var starts = [], re = /\S+/g, m, me = ++reading, heard = false;
    while ((m = re.exec(text))) starts.push(m.index);
    var words = text.match(/\S+/g) || [];
    function onTimer(i) {
      if (heard || me !== reading) return;
      if (i >= words.length) { unmark(); return; }
      mark(i);
      markTimer = setTimeout(function () { onTimer(i + 1); }, (220 + 45 * words[i].length + (/[.!?,]["”']?$/.test(words[i]) ? 260 : 0)) / rate);
    }
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = rate;
      u.onstart = function () { if (!heard) onTimer(0); };
      u.onboundary = function (e) {
        if ((e.name && e.name !== 'word') || me !== reading) return;
        heard = true; clearTimeout(markTimer);
        var i = 0;
        while (i + 1 < starts.length && starts[i + 1] <= e.charIndex) i++;
        mark(i);
      };
      u.onend = u.onerror = function () { if (me === reading) unmark(); };
      window.speechSynthesis.speak(u);
    } catch (e) { unmark(); }
  }

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
  var PAGE_SIZE = 24, limit = PAGE_SIZE;
  function drawShelf() {
    var list = shown(), shelf = $('shelf');
    shelf.innerHTML = '';
    $('found').textContent = list.length === 1 ? '1 book' : list.length + ' books';
    list.slice(0, limit).forEach(function (b) {
      var li = el('li', {});
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
    hush();
    var area = $('rpage'), n = book.pages.length;
    area.innerHTML = '';
    $('rprev').hidden = page < 0;
    $('rnext').hidden = page >= n;
    $('readit').hidden = page < 0 || page >= n || !voice;
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
  function closeBook() {
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
    $('rnext').addEventListener('click', function () { page += 1; render(); ($('lagain') || $('rnext')).focus(); });
    $('rprev').addEventListener('click', function () { page = Math.max(-1, page - 1); render(); });
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
