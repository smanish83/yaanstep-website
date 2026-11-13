(function () {
  'use strict';
  var demo = document.getElementById('demo');
  if (!demo) return;

  var STEPS = {
    student: [
      { goal: 'Study for the exam', tiny: 'Open the notes and read one page' },
      { goal: 'Finish the essay', tiny: 'Write one sentence, even a bad one' },
      { goal: 'Catch up on reading', tiny: 'Put the book on your desk, open to the right page' }
    ],
    seeker: [
      { goal: 'Apply for jobs', tiny: 'Open one job post and read the title' },
      { goal: 'Update your resume', tiny: 'Open the file and fix one line' },
      { goal: 'Reach out to someone', tiny: 'Write the first line of a short message' }
    ],
    manager: [
      { goal: 'Plan the week', tiny: 'Write down the top task for tomorrow' },
      { goal: 'Give feedback to a teammate', tiny: 'Jot down one thing they did well' },
      { goal: 'Clear the inbox', tiny: 'Answer one email that takes under a minute' }
    ],
    desk: [
      { goal: 'Move more', tiny: 'Stand up and walk to the door' },
      { goal: 'Drink more water', tiny: 'Fill your glass and put it next to the keyboard' },
      { goal: 'Rest your eyes', tiny: 'Look out of a window for twenty seconds' }
    ],
    teen: [
      { goal: 'Get homework started', tiny: 'Take out your homework and open it' },
      { goal: 'Get ready for a test', tiny: 'Write down one thing you already know about it' },
      { goal: 'Put the phone down for a bit', tiny: 'Leave your phone in another room for five minutes' }
    ],
    parent: [
      { goal: 'Tidy up', tiny: 'Put one thing back where it belongs' },
      { goal: 'Plan the meals', tiny: 'Write down one dinner for tomorrow' },
      { goal: 'Take a moment for yourself', tiny: 'Sit down and take three slow breaths' }
    ],
    freelance: [
      { goal: 'Finish a client project', tiny: 'Open the file and write the next line' },
      { goal: 'Send an invoice', tiny: 'Open last month\'s invoice and change the date' },
      { goal: 'Find new work', tiny: 'Write the first line of a short message to one person' }
    ],
    retired: [
      { goal: 'Stay active', tiny: 'Put on your shoes and step outside' },
      { goal: 'Stay in touch', tiny: 'Pick one person and open their message' },
      { goal: 'Learn something new', tiny: 'Open the book or lesson to the first page' }
    ]
  };

  var COUNT_SECONDS = 10;
  var goalEl = document.getElementById('goal');
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
    var s = list[index % list.length];
    goalEl.textContent = s.goal;
    tinyEl.textContent = s.tiny;
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
      var s = STEPS[profile()][index % STEPS[profile()].length];
      resultEl.textContent = 'Go! ' + s.tiny + '. That is the whole job. If you want to keep going afterwards, great. If not, you still started.';
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
