(function () {
  'use strict';
  var demo = document.getElementById('demo');
  if (!demo) return;

  var STEPS = {
    student: [
      'Open your notebook or laptop to today\'s page.',
      'Write the title of the assignment at the top.',
      'Read only the first question.'
    ],
    seeker: [
      'Sit at your work spot and open your resume file.',
      'Write one job title you\'d be happy to get.',
      'Open one job posting and read the first three lines.'
    ],
    desk: [
      'Write your one top task for today on a sticky note.',
      'Close one browser tab you don\'t need.',
      'Stand up and refill your water.'
    ],
    manager: [
      'Write down one person on your team who deserves a thank-you.',
      'Send them one line of thanks.',
      'Answer one waiting question with a one-line reply.'
    ],
    teen: [
      'Flip your phone over for 2 minutes. Just 2.'
    ]
  };

  var COUNT_SECONDS = 10;
  var tinyEl = document.getElementById('tiny');
  var startBtn = document.getElementById('start');
  var anotherBtn = document.getElementById('another');
  var cancelBtn = document.getElementById('cancel');
  var countBox = document.getElementById('countdown');
  var countText = document.getElementById('count-text');
  var barFill = document.getElementById('bar-fill');
  var resultEl = document.getElementById('result');
  var staticList = document.getElementById('static-list');
  var radios = demo.querySelectorAll('input[name="profile"]');

  var index = 0;
  var timer = null;
  var endAt = 0;

  function profile() {
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value;
    return 'student';
  }

  function show() {
    var list = STEPS[profile()];
    tinyEl.textContent = list[index % list.length];
    anotherBtn.hidden = list.length < 2;
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
    countBox.hidden = true;
    startBtn.disabled = false;
    anotherBtn.disabled = false;
    for (var i = 0; i < radios.length; i++) radios[i].disabled = false;
  }

  function tick() {
    var left = Math.max(0, endAt - Date.now());
    var secs = Math.ceil(left / 1000);
    countText.textContent = String(secs);
    barFill.style.width = (100 - (left / (COUNT_SECONDS * 1000)) * 100) + '%';
    if (left <= 0) {
      stopTimer();
      var step = STEPS[profile()][index % STEPS[profile()].length].replace(/\.$/, '');
      resultEl.textContent = 'Go! ' + step + '. That is the whole job. If you want to keep going afterwards, great. If not, you still started.';
      resultEl.hidden = false;
    }
  }

  startBtn.addEventListener('click', function () {
    resultEl.hidden = true;
    startBtn.disabled = true;
    anotherBtn.disabled = true;
    for (var i = 0; i < radios.length; i++) radios[i].disabled = true;
    countBox.hidden = false;
    endAt = Date.now() + COUNT_SECONDS * 1000;
    countText.textContent = String(COUNT_SECONDS);
    barFill.style.width = '0%';
    timer = setInterval(tick, 200);
    cancelBtn.focus();
  });

  cancelBtn.addEventListener('click', function () {
    stopTimer();
    resultEl.textContent = 'No problem. Come back when you are ready. Skipping once costs nothing.';
    resultEl.hidden = false;
    startBtn.focus();
  });

  anotherBtn.addEventListener('click', function () {
    index += 1;
    resultEl.hidden = true;
    show();
  });

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function () {
      index = 0;
      resultEl.hidden = true;
      show();
    });
  }

  show();
  demo.hidden = false;
  if (staticList) staticList.querySelector('h2').textContent = 'More examples of tiny steps';
})();
