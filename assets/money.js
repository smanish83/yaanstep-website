/* Yaanstep Sprouts: Money and coins (ages 5 to 9; Manish, 22 Nov 2026).
   US dollars and cents. Coins are our own simple drawings with the value written on them, not pictures of real coins.
   Learn: a moving lesson in 6 parts. Games: How much money?, Pay the price, Change please.
   Nothing is stored or sent. */
(function () {
  'use strict';
  var S = window.YSShell, el = S.el, svgEl = S.svgEl, rnd = S.rnd, between = S.between, shuffle = S.shuffle;
  var PICS = window.YS_PICTURES || {};
  var INK = '#17332c';

  var COINS = {
    penny: { v: 1, r: 13, fill: '#c9824f', name: 'penny' },
    nickel: { v: 5, r: 14.5, fill: '#c5cbd0', name: 'nickel' },
    dime: { v: 10, r: 12, fill: '#dde1e5', name: 'dime' },
    quarter: { v: 25, r: 16.5, fill: '#cfd5da', name: 'quarter' },
    dollar: { v: 100, bill: true, fill: '#d6ead0', name: 'dollar bill' },
    five: { v: 500, bill: true, fill: '#d6ead0', name: 'five-dollar bill' }
  };
  var BY_VALUE = ['five', 'dollar', 'quarter', 'dime', 'nickel', 'penny'];
  var THINGS = ['apple', 'ball', 'book', 'pencil', 'banana', 'car', 'boat', 'cup', 'hat', 'rocket', 'teapot', 'truck', 'duck', 'carrot'];

  /* ---------- words and numbers ---------- */
  function fmt(c) { return c < 100 ? c + '¢' : '$' + (c / 100).toFixed(2); }
  function words(c) {
    if (c < 100) return c + (c === 1 ? ' cent' : ' cents');
    var d = Math.floor(c / 100), r = c % 100;
    return d + (d === 1 ? ' dollar' : ' dollars') + (r ? ' and ' + r + (r === 1 ? ' cent' : ' cents') : '');
  }
  function sum(list) { return list.reduce(function (t, k) { return t + COINS[k].v; }, 0); }
  function byValue(list) { return list.slice().sort(function (a, b) { return COINS[b].v - COINS[a].v; }); }
  function runs(list) { var t = 0; return byValue(list).map(function (k) { t += COINS[k].v; return t; }); }
  /** Fewest coins for an amount, biggest first, from the coins allowed. */
  function makeAmount(c, allowed) {
    var out = [];
    BY_VALUE.filter(function (k) { return allowed.indexOf(k) >= 0; }).forEach(function (k) {
      while (c >= COINS[k].v) { out.push(k); c -= COINS[k].v; }
    });
    return out;
  }

  /* ---------- drawings ---------- */
  /** One coin or bill centred at x, y. extra is put on the group (class and style for animation). */
  function money(k, x, y, extra) {
    var c = COINS[k], g = '<g' + (extra || '') + '>';
    if (c.bill) {
      g += '<rect x="' + (x - 30) + '" y="' + (y - 14) + '" width="60" height="28" rx="3" fill="' + c.fill + '" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<rect x="' + (x - 26) + '" y="' + (y - 10) + '" width="52" height="20" rx="2" fill="none" stroke="#5b8a52" stroke-width=".8"/>' +
        '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="' + INK + '">$' + c.v / 100 + '</text>';
    } else {
      g += '<circle cx="' + x + '" cy="' + y + '" r="' + c.r + '" fill="' + c.fill + '" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + (c.r - 2.5) + '" fill="none" stroke="#7d868c" stroke-width=".8"/>' +
        '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="' + (c.v >= 10 ? 10 : 11) + '" font-weight="800" fill="' + INK + '">' + c.v + '¢</text>';
    }
    return g + '</g>';
  }
  function coinIcon(k) { var c = COINS[k]; return svgEl(money(k, c.bill ? 32 : 20, 20), c.bill ? '0 0 64 40' : '0 0 40 40'); }
  /** Coins laid out in rows (not sorted), for a question. */
  function coinsPicture(list) {
    var per = 6, out = '', w = 50;
    list.forEach(function (k, i) {
      var col = i % per, row = Math.floor(i / per), wide = COINS[k].bill ? 1 : 0;
      out += money(k, 30 + col * w + wide * 6, 26 + row * 46);
    });
    var label = list.length + ' pieces of money: ' + list.map(function (k) { return 'a ' + COINS[k].name; }).join(', ') + '.';
    return svgEl(out, '0 0 320 ' + (Math.ceil(list.length / per) * 46 + 8), label);
  }
  function itemArt(thing, price) {
    return '<svg x="10" y="6" width="70" height="70" viewBox="0 0 64 64">' + (PICS[thing] || '') + '</svg>' +
      '<path d="M90 30h56l10 12-10 12H90z" fill="#FFF1C2" stroke="' + INK + '" stroke-width="2"/><circle cx="96" cy="42" r="3" fill="' + INK + '"/>' +
      '<text x="124" y="49" text-anchor="middle" font-size="18" font-weight="800" fill="' + INK + '">' + fmt(price) + '</text>';
  }

  /* ---------- moving lessons ---------- */
  function at(s) { return ' class="mv-in" style="animation-delay:' + s.toFixed(2) + 's"'; }
  /** Coins move into order from the most to the least, and the running total appears under each. */
  function countMovie(list) {
    var sorted = byValue(list), totals = runs(list), out = '', step = Math.min(52, 300 / sorted.length);
    sorted.forEach(function (k, i) {
      var x = 26 + i * step;
      out += money(k, x, 30, at(0.2 + i * 0.7));
      out += '<text x="' + x + '" y="76" text-anchor="middle" font-size="15" font-weight="800" fill="#1F7A6D"' + at(0.5 + i * 0.7) + '>' + totals[i] + '</text>';
    });
    var total = totals[totals.length - 1];
    out += '<text x="160" y="110" text-anchor="middle" font-size="22" font-weight="800" fill="' + INK + '"' + at(0.6 + sorted.length * 0.7) + '>' + fmt(total) + '</text>';
    return { svg: out, vb: '0 0 320 120', label: 'The coins in order from the most to the least: ' + sorted.map(function (k) { return fmt(COINS[k].v); }).join(', ') + '. Counting on: ' + totals.join(', ') + '. That is ' + words(total) + '.' };
  }
  function countWords(list) {
    var t = runs(list), total = t[t.length - 1];
    return 'Put the coins in order, from the most to the least. Start with the biggest and count on: ' + t.join(', ') + '. That is ' + fmt(total) + '.';
  }
  function payMovie(price, allowed) { return countMovie(makeAmount(price, allowed)); }
  function payWords(price, allowed) {
    return 'To pay ' + fmt(price) + ', take the biggest coin that still fits, again and again, and count on: ' + runs(makeAmount(price, allowed)).join(', ') + '. That is exactly ' + fmt(price) + '.';
  }
  /** The stops when counting up from the price to what was paid. */
  function stops(price, paid) {
    var s = [price], c = price;
    if (c % 10) { c = Math.min(paid, Math.ceil(c / 10) * 10); s.push(c); }
    if (c % 100 && c < paid) { c = Math.min(paid, Math.ceil(c / 100) * 100); s.push(c); }
    if (c < paid) s.push(paid);
    return s;
  }
  function changeMovie(price, paid) {
    var s = stops(price, paid), gap = 280 / (s.length - 1), out = '<line x1="20" y1="70" x2="300" y2="70" stroke="' + INK + '" stroke-width="2"/>';
    s.forEach(function (v, i) {
      var x = 20 + i * gap;
      out += '<line x1="' + x + '" y1="62" x2="' + x + '" y2="78" stroke="' + INK + '" stroke-width="2"/><text x="' + x + '" y="98" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">' + fmt(v) + '</text>';
      if (i) {
        var x0 = x - gap, mid = (x0 + x) / 2;
        out += '<g class="mv-draw"><path d="M' + x0 + ' 60 Q' + mid + ' 14 ' + x + ' 60" fill="none" stroke="#C2410C" stroke-width="3" pathLength="1" style="animation-delay:' + (0.3 + (i - 1) * 1.2).toFixed(2) + 's"/></g>' +
          '<text x="' + mid + '" y="30" text-anchor="middle" font-size="14" font-weight="800" fill="#C2410C"' + at(0.9 + (i - 1) * 1.2) + '>+' + fmt(v - s[i - 1]) + '</text>';
      }
    });
    out += '<text x="160" y="126" text-anchor="middle" font-size="18" font-weight="800" fill="#1F7A6D"' + at(0.6 + (s.length - 1) * 1.2) + '>Change: ' + fmt(paid - price) + '</text>';
    return { svg: out, vb: '0 0 320 136', label: 'Counting up from ' + fmt(price) + ' to ' + fmt(paid) + ' in jumps: ' + s.slice(1).map(function (v, i) { return '+' + fmt(v - s[i]); }).join(', ') + '. The change is ' + words(paid - price) + '.' };
  }
  function changeWords(price, paid) {
    var s = stops(price, paid), jumps = s.slice(1).map(function (v, i) { return fmt(s[i]) + ' to ' + fmt(v) + ' is ' + fmt(v - s[i]); });
    if (jumps.length === 1) return 'Count up from the price to what you paid. ' + jumps[0] + '. So the change is ' + fmt(paid - price) + '.';
    return 'Count up from the price to what you paid. ' + jumps.join(', ') + '. Add the jumps: ' + s.slice(1).map(function (v, i) { return fmt(v - s[i]); }).join(' + ') + ' = ' + fmt(paid - price) + ' change.';
  }

  /* ---------- the lesson ---------- */
  var LEARN = [
    { title: 'Meet the coins', text: 'A penny is 1 cent. A nickel is 5 cents. A dime is 10 cents. A quarter is 25 cents. We write cents with this sign: ¢.',
      movie: function () {
        var out = '';
        ['penny', 'nickel', 'dime', 'quarter'].forEach(function (k, i) {
          var x = 44 + i * 78;
          out += money(k, x, 34, at(0.2 + i * 0.8)) + '<text x="' + x + '" y="76" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '"' + at(0.4 + i * 0.8) + '>' + COINS[k].name + '</text>';
        });
        return { svg: out, vb: '0 0 320 90', label: 'Four coins appear one by one: a penny, 1 cent; a nickel, 5 cents; a dime, 10 cents; a quarter, 25 cents.' };
      } },
    { title: 'Size is not what a coin is worth', text: 'The dime is smaller than the nickel, but a dime is worth more: 10¢ is more than 5¢. Look at what a coin is worth, not how big it is.',
      movie: function () {
        return { svg: money('nickel', 90, 40, at(0.2)) + money('dime', 230, 40, ' class="mv-pulse" style="animation-delay:1s"') +
          '<text x="160" y="48" text-anchor="middle" font-size="26" font-weight="800" fill="#C2410C"' + at(1.2) + '>&lt;</text>' +
          '<text x="90" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">nickel, 5¢</text><text x="230" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="' + INK + '">dime, 10¢</text>',
          vb: '0 0 320 96', label: 'A bigger nickel and a smaller dime. The dime grows and shrinks: it is worth more, 10 cents, than the nickel, 5 cents.' };
      } },
    { title: 'Count coins', text: countWords(['dime', 'quarter', 'penny', 'nickel', 'dime']), movie: function () { return countMovie(['dime', 'quarter', 'penny', 'nickel', 'dime']); } },
    { title: '100 cents make a dollar', text: '4 quarters make 100 cents, and 100 cents is 1 dollar. We write it $1.00. The dot splits the dollars from the cents.',
      movie: function () {
        var out = '';
        for (var i = 0; i < 4; i++) out += money('quarter', 40 + i * 40, 40, ' class="mv-slide" style="--dx:' + (i * 30 - 45) + 'px;animation-delay:' + (0.2 + i * 0.3).toFixed(2) + 's"');
        out += '<text x="210" y="47" text-anchor="middle" font-size="24" font-weight="800" fill="' + INK + '"' + at(1.8) + '>=</text>' + money('dollar', 270, 40, at(2.2)) +
          '<text x="160" y="90" text-anchor="middle" font-size="16" font-weight="800" fill="#1F7A6D"' + at(2.6) + '>25 + 25 + 25 + 25 = 100¢ = $1.00</text>';
        return { svg: out, vb: '0 0 320 100', label: 'Four quarters slide together. They make 100 cents, the same as one dollar bill.' };
      } },
    { title: 'Pay the price', text: payWords(42, ['quarter', 'dime', 'nickel', 'penny']), movie: function () { return payMovie(42, ['quarter', 'dime', 'nickel', 'penny']); } },
    { title: 'Change', text: 'You pay more than the price, so you get money back. That is your change. ' + changeWords(65, 100), movie: function () { return changeMovie(65, 100); } }
  ];

  /* ---------- games ---------- */
  function setFor(round, withBills) {
    if (round < 3) return ['dime', 'nickel', 'penny'];
    if (round < 6 || !withBills) return ['quarter', 'dime', 'nickel', 'penny'];
    return ['dollar', 'quarter', 'dime', 'nickel', 'penny'];
  }
  function count(area, ctx) {
    var round = ctx.round(), allowed = setFor(round, true), list, total;
    do {
      var n = round < 3 ? between(2, 4) : between(3, 6);
      list = [];
      for (var i = 0; i < n; i++) list.push(allowed[rnd(allowed.length)]);
      if (round >= 6 && list.indexOf('dollar') < 0) list[0] = 'dollar';
      total = sum(list);
    } while (round < 3 && total > 40);
    ctx.set({ game: 'count', coins: list, ans: total });
    ctx.ask(area, 'How much money is here?');
    area.appendChild(el('div', { 'class': 'scene', id: 'coins' })).appendChild(coinsPicture(shuffle(list)));
    var wrong = shuffle([total + 5, total - 5, total + 10, total - 10, total + 1, total - 1].filter(function (v) { return v > 0 && v !== total; })).slice(0, 2);
    area.appendChild(ctx.tiles(shuffle([total].concat(wrong)), function (v) { return ctx.word(fmt(v)); }, function (v, b) {
      if (v === total) { b.classList.add('right'); ctx.win('Yes! ' + runs(list).join(', ') + '. That makes ' + fmt(total) + '.', 'Yes! That makes ' + words(total) + '.'); }
      else ctx.miss(b, 'That is ' + fmt(v) + '. Count again, starting with the coin worth the most.', function (box) {
        var other; do { other = list.map(function () { return allowed[rnd(allowed.length)]; }); } while (sum(other) === total);
        box.appendChild(el('p', {}, 'Here is another set of coins. Watch how to count them.'));
        box.appendChild(ctx.moviePanel(function () { return countMovie(other); }));
        box.appendChild(el('p', { id: 'lesson-say' }, countWords(other)));
      });
    }, function (v) { return words(v); }));
  }

  function pay(area, ctx) {
    var round = ctx.round(), allowed = setFor(round, false);
    var price = round < 3 ? between(6, 30) : round < 6 ? between(31, 75) : between(76, 99);
    var thing = THINGS[rnd(THINGS.length)], tray = [];
    ctx.set({ game: 'pay', price: price, tray: tray });
    ctx.ask(area, 'The ' + thing + ' costs ' + fmt(price) + '. Put in the exact amount, then tap Pay.', 'The ' + thing + ' costs ' + words(price) + '. Put in the exact amount, then tap Pay.');
    area.appendChild(el('div', { 'class': 'scene' })).appendChild(svgEl(itemArt(thing, price), '0 0 170 84', 'A ' + thing + ' with a price tag: ' + words(price) + '.'));
    area.appendChild(el('p', { 'class': 'muted', style: 'text-align:center;margin:4px 0' }, 'Tap a coin to put it in:'));
    var purse = area.appendChild(el('div', { 'class': 'purse', id: 'purse' }));
    area.appendChild(el('p', { 'class': 'muted', style: 'text-align:center;margin:4px 0' }, 'Your coins (tap one to take it back):'));
    var trayEl = area.appendChild(el('div', { 'class': 'tray', id: 'tray', role: 'group', 'aria-label': 'Coins you put in' }));
    var paid = area.appendChild(el('p', { 'class': 'paid', id: 'paid', 'aria-live': 'polite' }));
    var payBtn = el('button', { type: 'button', id: 'pay', 'class': 'primary' }, 'Pay');
    area.appendChild(el('div', { 'class': 'row center' })).appendChild(payBtn);
    function show() {
      trayEl.innerHTML = '';
      tray.forEach(function (k, i) {
        var b = el('button', { type: 'button', 'class': 'small', 'data-c': k, 'aria-label': 'Take back the ' + COINS[k].name });
        b.appendChild(coinIcon(k));
        b.addEventListener('click', function () { if (ctx.solved()) return; tray.splice(i, 1); show(); var first = trayEl.querySelector('button') || purse.querySelector('button'); first.focus(); });
        trayEl.appendChild(b);
      });
      paid.textContent = 'You put in ' + fmt(sum(tray)) + '. The price is ' + fmt(price) + '.';
    }
    allowed.forEach(function (k) {
      var b = el('button', { type: 'button', id: 'add-' + k });
      b.appendChild(el('span', { 'class': 'sr' }, 'Put in a ' + COINS[k].name + ', ' + words(COINS[k].v)));
      b.appendChild(coinIcon(k));
      b.appendChild(el('span', { 'aria-hidden': 'true' }, fmt(COINS[k].v)));
      b.addEventListener('click', function () { if (ctx.solved() || tray.length >= 12) return; tray.push(k); show(); ctx.setSub('', ''); });
      purse.appendChild(b);
    });
    show();
    payBtn.addEventListener('click', function () {
      if (ctx.solved()) return;
      var t = sum(tray);
      if (t === price) { payBtn.disabled = true; ctx.win('Yes! ' + runs(tray).join(', ') + '. You paid exactly ' + fmt(price) + '.', 'Yes! You paid exactly ' + words(price) + '.'); return; }
      ctx.miss(null, t < price ? 'Not enough yet. You need ' + fmt(price - t) + ' more.' : 'That is too much: ' + fmt(t) + '. Take a coin back.', function (box) {
        var other; do { other = between(Math.max(6, price - 20), price + 20); } while (other === price || other > 99);
        box.appendChild(el('p', {}, 'Here is how to pay ' + fmt(other) + '.'));
        box.appendChild(ctx.moviePanel(function () { return payMovie(other, allowed); }));
        box.appendChild(el('p', { id: 'lesson-say' }, payWords(other, allowed)));
      });
    });
  }

  function change(area, ctx) {
    var round = ctx.round(), paidWith = round < 4 ? 100 : 500;
    var price = round < 4 ? between(1, 19) * 5 : between(21, 99) * 5;
    var thing = THINGS[rnd(THINGS.length)], ans = paidWith - price;
    ctx.set({ game: 'change', price: price, paid: paidWith, ans: ans });
    ctx.ask(area, 'The ' + thing + ' costs ' + fmt(price) + '. You pay with a ' + fmt(paidWith) + ' bill. How much change do you get?',
      'The ' + thing + ' costs ' + words(price) + '. You pay with ' + words(paidWith) + '. How much change do you get?');
    area.appendChild(el('div', { 'class': 'scene' })).appendChild(svgEl(itemArt(thing, price) + money(paidWith === 100 ? 'dollar' : 'five', 205, 42), '0 0 245 84', 'A ' + thing + ' costing ' + words(price) + ', and a ' + COINS[paidWith === 100 ? 'dollar' : 'five'].name + '.'));
    var wrong = shuffle([ans + 5, ans - 5, ans + 10, ans - 10, ans + 100, ans - 100].filter(function (v) { return v > 0 && v !== ans && v < paidWith; })).slice(0, 2);
    area.appendChild(ctx.tiles(shuffle([ans].concat(wrong)), function (v) { return ctx.word(fmt(v)); }, function (v, b) {
      if (v === ans) { b.classList.add('right'); ctx.win('Yes! ' + fmt(paidWith) + ' − ' + fmt(price) + ' = ' + fmt(ans) + ' change.', 'Yes! Your change is ' + words(ans) + '.'); }
      else ctx.miss(b, 'Not ' + fmt(v) + '. Count up from the price to ' + fmt(paidWith) + '.', function (box) {
        var other; do { other = (round < 4 ? between(1, 9) : between(10, 49)) * 10 + 5; } while (other === price || other >= paidWith);
        box.appendChild(el('p', {}, 'Here is another one: the price is ' + fmt(other) + ' and you pay ' + fmt(paidWith) + '.'));
        box.appendChild(ctx.moviePanel(function () { return changeMovie(other, paidWith); }));
        box.appendChild(el('p', { id: 'lesson-say' }, changeWords(other, paidWith)));
      });
    }, function (v) { return words(v); }));
  }

  S.run({
    names: { learn: 'Learn about money', count: 'How much money?', pay: 'Pay the price', change: 'Change, please' },
    learn: LEARN,
    games: { count: count, pay: pay, change: change }
  });
  // Test hook: the coin values and the helpers the games use.
  window.YS_MONEY = { coins: COINS, fmt: fmt, words: words, stops: stops, makeAmount: makeAmount };
})();
