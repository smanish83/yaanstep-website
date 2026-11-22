/* Yaanstep reading pages: the "All done for now" screen offers a movement break and
   something different to play next (SCRUM-474 items 1 and 2: a change of game and a stretch
   break, with no timers, no streaks and no rewards for time spent). Nothing is stored or sent. */
(function () {
  'use strict';

  var MOVES = [
    'Stand up and reach up high, like a tall tree.',
    'Hop like a frog: three small hops.',
    'Wiggle your fingers, then wiggle your toes.',
    'March on the spot and count to ten.',
    'Shrug your shoulders up and down three times.',
    'Clap your hands above your head, then by your knees.'
  ];
  var PAGES = [
    { href: 'sounds.html', name: 'Sounds and beats' },
    { href: 'rhymes.html', name: 'Rhymes and letter teams' },
    { href: 'sentences.html', name: 'Parts of a sentence' },
    { href: 'stories.html', name: 'Story time' }
  ];

  function $(id) { return document.getElementById(id); }
  function label(button) {
    var copy = button.cloneNode(true);
    Array.prototype.forEach.call(copy.querySelectorAll('small'), function (s) { s.remove(); });
    return copy.textContent.trim();
  }

  var current = null, lastMove = -1;

  function fill() {
    var done = $('alldone');
    if (!done || done.hidden) return;
    var old = $('afterdone');
    if (old) old.remove();
    var box = document.createElement('div');
    box.id = 'afterdone';

    var m;
    do { m = Math.floor(Math.random() * MOVES.length); } while (MOVES.length > 1 && m === lastMove);
    lastMove = m;
    var move = document.createElement('p');
    move.id = 'moveit';
    move.className = 'moveit';
    move.innerHTML = '<strong>Move break:</strong> ' + MOVES[m] + ' Grown-up: you can do it together.';
    move.setAttribute('data-move', String(m));
    box.appendChild(move);

    var others = Array.prototype.filter.call(document.querySelectorAll('#menu button[id^="play-"]'), function (b) {
      var title = ($('title') && $('title').textContent.trim()) || '';
      return b.id !== current && label(b).replace(/^\d+\.\s*/, '') !== title;
    });
    var here = location.pathname.split('/').pop() || '';
    var pages = PAGES.filter(function (p) { return p.href !== here; });
    if (others.length || pages.length) {
      var h = document.createElement('p');
      h.className = 'nexthead';
      h.textContent = 'Or try something different:';
      box.appendChild(h);
      var row = document.createElement('div');
      row.className = 'row nextgames';
      row.id = 'nextgames';
      others.forEach(function (b) {
        var go = document.createElement('button');
        go.type = 'button';
        go.className = 'nextgame';
        go.setAttribute('data-play', b.id);
        go.textContent = label(b);
        go.addEventListener('click', function () { done.hidden = true; b.click(); });
        row.appendChild(go);
      });
      pages.forEach(function (p) {
        var a = document.createElement('a');
        a.className = 'nextpage';
        a.href = p.href;
        a.textContent = p.name;
        row.appendChild(a);
      });
      box.appendChild(row);
    }
    done.appendChild(box);
  }

  function init() {
    var done = $('alldone');
    if (!done) return;
    Array.prototype.forEach.call(document.querySelectorAll('#menu button[id^="play-"]'), function (b) {
      b.addEventListener('click', function () { current = b.id; });
    });
    new MutationObserver(fill).observe(done, { attributes: true, attributeFilter: ['hidden'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
