(function () {
  'use strict';
  var form = document.getElementById('calc');
  if (!form) return;
  var hoursEl = document.getElementById('hours');
  var backEl = document.getElementById('back');
  var out = document.getElementById('out');
  var example = document.getElementById('static-example');
  var WAKING = 16;

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function update() {
    var h = parseFloat(hoursEl.value);
    if (isNaN(h) || h < 0 || h > 24) {
      out.textContent = 'Enter a number of hours between 0 and 24.';
      return;
    }
    var yearHours = h * 365;
    var yearDays = yearHours / WAKING;
    var back = parseInt(backEl.value, 10);
    var backHours = (back * 365) / 60;
    var backDays = backHours / WAKING;
    out.innerHTML = '';
    var p1 = document.createElement('p');
    p1.textContent = 'At ' + h + ' hours a day, a year adds up to about ' + fmt(yearHours) +
      ' hours, or about ' + fmt(yearDays) + ' whole waking days (counting ' + WAKING + ' waking hours a day).';
    var p2 = document.createElement('p');
    p2.textContent = 'Winning back ' + back + ' minutes a day is about ' + fmt(backHours) +
      ' hours a year, or around ' + fmt(backDays) + ' waking days.';
    if (back / 60 > h && h > 0) {
      p2.textContent += ' That is more than you entered, so try a smaller amount.';
    }
    out.appendChild(p1);
    out.appendChild(p2);
  }

  hoursEl.addEventListener('input', update);
  backEl.addEventListener('change', update);
  update();
  form.hidden = false;
  if (example) example.querySelector('h2').textContent = 'Another example';
})();
