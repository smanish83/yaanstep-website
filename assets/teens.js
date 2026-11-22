/* Yaanstep Teens planner, first slice (SCRUM-500: 501, 502, 503, 504, 506, 507).
   Everything is kept in this browser under one localStorage key, and only after the user adds something.
   Nothing is sent. No cookies. The storage functions are the one place to change for cloud backup later (SCRUM-514). */
(function () {
  "use strict";
  var KEY = "yaanstep-teens";
  var DAY = 86400000;

  /* ---------- storage layer ---------- */
  function emptyState() { return { v: 1, events: [], todos: {}, notes: {} }; }
  var store = {
    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (!raw) return emptyState();
        var s = JSON.parse(raw);
        if (!s || s.v !== 1 || !Array.isArray(s.events)) return emptyState();
        s.todos = s.todos || {}; s.notes = s.notes || {};
        return s;
      } catch (e) { return emptyState(); }
    },
    save: function (s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } },
    wipe: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };

  /* ---------- dates ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseYmd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function at(day, hm) { var d = parseYmd(day); var p = (hm || "00:00").split(":"); d.setHours(+p[0], +p[1], 0, 0); return d; }
  function addDays(day, n) { var d = parseYmd(day); d.setDate(d.getDate() + n); return ymd(d); }
  /** Whole calendar days from a to b (both YYYY-MM-DD), safe across daylight saving changes. */
  function daysBetween(a, b) { return Math.round((Date.UTC.apply(null, ymdParts(b)) - Date.UTC.apply(null, ymdParts(a))) / DAY); }
  function ymdParts(s) { var p = s.split("-"); return [+p[0], +p[1] - 1, +p[2]]; }
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function longDate(day) { var d = parseYmd(day); return DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate(); }
  function clock(hm) {
    var p = hm.split(":"), h = +p[0], m = p[1];
    var ampm = h < 12 ? "AM" : "PM"; h = h % 12; if (h === 0) h = 12;
    return h + ":" + m + " " + ampm;
  }

  /* ---------- recurrence ---------- */
  function occursOn(ev, day) {
    var r = ev.repeat || { kind: "none" };
    if (r.kind === "none" || !r.kind) return ev.date === day;
    if (day < ev.date) return false;
    if (r.until && day > r.until) return false;
    if (r.kind === "daily") return true;
    if (r.kind === "weekly") {
      var days = r.days && r.days.length ? r.days : [parseYmd(ev.date).getDay()];
      return days.indexOf(parseYmd(day).getDay()) !== -1;
    }
    return false;
  }
  function endOf(ev, day) {
    var s = at(day, ev.start);
    if (ev.end && ev.end > ev.start) return at(day, ev.end);
    return new Date(s.getTime() + 60000 * 60); // no end time: treat as one hour
  }
  /** The next time this event starts, or is still going on, from now. null when it is over. */
  function nextOccurrence(ev, now) {
    var today = ymd(now);
    var first = ev.date > today ? ev.date : today;
    var limit = (ev.repeat && ev.repeat.kind && ev.repeat.kind !== "none") ? 400 : 1;
    if (!ev.repeat || ev.repeat.kind === "none" || !ev.repeat.kind) {
      if (ev.date < today) return null;
      first = ev.date;
    }
    for (var i = 0; i < limit + 1; i++) {
      var day = addDays(first, i);
      if (!occursOn(ev, day)) continue;
      var s = at(day, ev.start), e = endOf(ev, day);
      if (e.getTime() > now.getTime()) return { day: day, start: s, end: e };
    }
    return null;
  }

  /* ---------- countdown ---------- */
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  /** Time left before an event starts, in words. ms is start minus now. */
  function formatCountdown(ms) {
    if (ms <= 0) return "now";
    var min = Math.ceil(ms / 60000);
    if (min < 60) return "in " + min + " min";
    var days = Math.floor(ms / DAY);
    if (days >= 7) return "in " + plural(days, "day");
    if (days >= 1) {
      var hrs = Math.floor((ms - days * DAY) / 3600000);
      return "in " + plural(days, "day") + (hrs ? " " + plural(hrs, "hour") : "");
    }
    var h = Math.floor(min / 60), m = min - h * 60;
    return "in " + h + " h" + (m ? " " + m + " min" : "");
  }
  function countdownFor(ev, now) {
    var o = nextOccurrence(ev, now);
    if (!o) return { text: "over", occ: null };
    if (o.start.getTime() <= now.getTime()) return { text: "happening now", occ: o };
    return { text: formatCountdown(o.start.getTime() - now.getTime()), occ: o };
  }

  /* ---------- category rules (kept as data, SCRUM-506) ---------- */
  var CATEGORY_RULES = [
    ["test", /\b(test|tests|exam|exams|quiz|quizzes|midterms?|finals?|sat|psat|act|assessment|olympiad)\b/i],
    ["assignment", /\b(homework|assignment|project|essay|report|due|worksheet|lab report)\b/i],
    ["health", /\b(doctor|dentist|orthodontist|checkup|check-up|appointment|clinic|eye exam|physio)\b/i],
    ["sport", /\b(practice|training|match|tournament|game day|soccer|football|basketball|baseball|volleyball|swim|swimming|tennis|cricket|hockey|track|gym|run|race|dance class|karate|martial arts)\b/i],
    ["social", /\b(party|birthday|movie|movies|hangout|hang out|concert|prom|homecoming|dance|trip|outing|sleepover|mall|picnic|festival|wedding)\b/i],
    ["family", /\b(family|grandma|grandpa|grandparents|cousin|cousins|aunt|uncle|mom|dad|brother|sister)\b/i],
    ["study", /\b(study|revise|revision|review session|tutor|tutoring)\b/i],
    ["school", /\b(class|school|club|lesson|lecture|orchestra|band|choir|assembly|field trip)\b/i]
  ];
  var SUBJECT_RULES = [
    ["Maths", /\b(maths?|algebra|geometry|calculus|trig|trigonometry|statistics|stats|arithmetic|pre-?calc)\b/i],
    ["Science", /\b(science|biology|bio|chemistry|chem|physics|earth science)\b/i],
    ["English", /\b(english|reading|writing|literature|grammar|spelling|vocab|vocabulary|essay)\b/i],
    ["History", /\b(history|social studies|civics|government|geography|economics)\b/i],
    ["Languages", /\b(spanish|french|german|hindi|chinese|mandarin|japanese|latin|language)\b/i],
    ["Computing", /\b(computer|computing|coding|programming|cs)\b/i]
  ];
  var CAT_LABEL = { test: "Test", assignment: "Assignment", school: "School", sport: "Sport", social: "Outing", family: "Family", health: "Appointment", study: "Study", other: "Other" };
  function detectCategory(title) {
    var t = String(title || "");
    var cat = "other", subject = "";
    for (var i = 0; i < CATEGORY_RULES.length; i++) if (CATEGORY_RULES[i][1].test(t)) { cat = CATEGORY_RULES[i][0]; break; }
    for (var j = 0; j < SUBJECT_RULES.length; j++) if (SUBJECT_RULES[j][1].test(t)) { subject = SUBJECT_RULES[j][0]; break; }
    // "lab report" or "maths project" stays an assignment; a subject alone (for example "Maths") is a class
    if (cat === "other" && subject) cat = "school";
    return { cat: cat, subject: subject };
  }

  /* ---------- test preparation guide (SCRUM-507) ---------- */
  var HOW = {
    practice: "Practice problems", notes: "Review your notes", flashcards: "Flashcards",
    friend: "Study with a friend", teacher: "Ask your teacher, then practise"
  };
  /**
   * Builds a day-by-day plan from today to the day before the test, at most 14 days.
   * Weaker topics (lower confidence, 1 to 5) come first and get more blocks. The last block is a full review.
   * A test today gets one short review block.
   */
  function buildStudyPlan(opts) {
    var today = opts.today, testDay = opts.testDay;
    var how = HOW[opts.how] || HOW.practice;
    var subject = opts.subject ? opts.subject + ": " : "";
    var time = opts.time || "17:00";
    var topics = (opts.topics || []).filter(function (t) { return t && t.name && t.name.trim(); })
      .map(function (t) { return { name: t.name.trim(), conf: Math.min(5, Math.max(1, +t.conf || 3)) }; })
      .sort(function (a, b) { return a.conf - b.conf; });
    var n = daysBetween(today, testDay);
    if (n < 0) return [];
    if (n === 0) return [{ date: today, start: time, minutes: 20, title: "Quick review: " + subject + (topics.length ? topics.map(function (t) { return t.name; }).join(", ") : "key points"), how: how }];
    var start = n > 14 ? addDays(testDay, -14) : today;
    var count = daysBetween(start, testDay);
    var seq = [];
    if (topics.length) {
      var w = topics.map(function (t) { return 6 - t.conf; });
      // fill the days before the final review, round by round, weakest first; each topic gets slots by its weight
      var left = w.slice();
      while (seq.length < count - 1) {
        var added = false;
        for (var k = 0; k < topics.length && seq.length < count - 1; k++) {
          if (left[k] > 0) { seq.push(topics[k]); left[k]--; added = true; }
        }
        if (!added) left = w.slice();
      }
    } else {
      for (var z = 0; z < count - 1; z++) seq.push({ name: "Topic review " + (z + 1), conf: 3 });
    }
    var plan = [];
    for (var i = 0; i < count; i++) {
      var day = addDays(start, i);
      if (i === count - 1) {
        plan.push({ date: day, start: time, minutes: 45, title: "Final review: " + subject + (topics.length ? "all topics" : "everything"), how: "Go over every topic and the questions you missed" });
      } else {
        var t = seq[i];
        plan.push({ date: day, start: time, minutes: t.conf <= 2 ? 40 : 30, title: "Study " + subject + t.name, how: how });
      }
    }
    return plan;
  }

  /* ---------- event help shown on the event card (templates; outing and others come in SCRUM-508) ---------- */
  function helpFor(ev) {
    if (ev.cat === "test") return ev.prep ? "You have a preparation plan with " + plural(ev.prep.blocks, "study block") + "." : "No preparation plan yet.";
    if (ev.cat === "social") return "Outfit ideas and a what-to-bring list are coming soon.";
    if (ev.cat === "sport") return "Pack your kit and water bottle the night before.";
    if (ev.cat === "assignment") return "Tip: split it into small steps with mini deadlines before it is due.";
    if (ev.cat === "health" || ev.cat === "family") return "Check when you need to leave, and tell a parent.";
    return "";
  }

  window.YS_TEENS = {
    formatCountdown: formatCountdown, detectCategory: detectCategory, buildStudyPlan: buildStudyPlan,
    occursOn: occursOn, nextOccurrence: function (ev, now) { return nextOccurrence(ev, now || new Date()); },
    daysBetween: daysBetween, KEY: KEY
  };

  /* ---------- page ---------- */
  var app = document.getElementById("app");
  if (!app) return;
  app.hidden = false;
  var about = document.getElementById("static-about");
  if (about) about.hidden = true;

  var state = store.load();
  var viewDay = ymd(new Date());
  var openId = null, prepFor = null;
  function $(id) { return document.getElementById(id); }
  function persist() { store.save(state); }
  function uid() { return "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function find(id) { for (var i = 0; i < state.events.length; i++) if (state.events[i].id === id) return state.events[i]; return null; }
  function el(tag, cls, text) { var x = document.createElement(tag); if (cls) x.className = cls; if (text != null) x.textContent = text; return x; }

  function eventRow(ev, now, day, showDay) {
    var li = el("li", "ev cat-" + ev.cat);
    var cd = countdownFor(ev, now);
    var occDay = day || (cd.occ && cd.occ.day) || ev.date;
    li.appendChild(el("span", "time", (showDay ? shortDay(occDay) + " " : "") + clock(ev.start)));
    var b = el("button", "title", ev.title); b.type = "button";
    b.addEventListener("click", function () { openDetail(ev.id); });
    li.appendChild(b);
    li.appendChild(el("span", "tag", CAT_LABEL[ev.cat] + (ev.subject ? " · " + ev.subject : "")));
    var c = el("span", "count", rowCount(ev, occDay, now)); c.setAttribute("data-count", ev.id); c.setAttribute("data-day", occDay);
    li.appendChild(c);
    return li;
  }
  function rowCount(ev, day, now) {
    var s = at(day, ev.start);
    if (s.getTime() > now.getTime()) return formatCountdown(s.getTime() - now.getTime());
    return endOf(ev, day).getTime() > now.getTime() ? "happening now" : "done";
  }
  function shortDay(day) { var d = parseYmd(day); return DAYS[d.getDay()].slice(0, 3) + " " + d.getDate(); }

  function render() {
    var now = new Date();
    var today = ymd(now);
    renderBanner(now);
    renderDay(now, today);
  }
  function renderBanner(now) {
    var today = ymd(now);
    var best = null;
    state.events.forEach(function (ev) {
      var o = nextOccurrence(ev, now);
      if (o && (!best || o.start < best.o.start)) best = { ev: ev, o: o };
    });
    var banner = $("next-banner");
    if (best) {
      var when = best.o.start.getTime() <= now.getTime() ? "happening now" : formatCountdown(best.o.start.getTime() - now.getTime());
      banner.textContent = "Next up: " + best.ev.title + ", " + when + (best.o.day === today ? " (today at " + clock(best.ev.start) + ")" : " (" + longDate(best.o.day) + " at " + clock(best.ev.start) + ")");
    } else banner.textContent = "Nothing coming up yet. Add your first event below.";
  }
  function renderDay(now, today) {
    $("day-title").textContent = (viewDay === today ? "Today, " : "") + longDate(viewDay);
    var list = $("day-events"); list.textContent = "";
    var todays = state.events.filter(function (ev) { return occursOn(ev, viewDay); }).sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; });
    todays.forEach(function (ev) { list.appendChild(eventRow(ev, now, viewDay, false)); });
    $("day-empty").hidden = todays.length > 0;

    var todos = $("todos"); todos.textContent = "";
    (state.todos[viewDay] || []).forEach(function (t, i) {
      var li = el("li", t.done ? "done" : "");
      var id = "todo-" + i;
      var cb = el("input"); cb.type = "checkbox"; cb.id = id; cb.checked = !!t.done;
      cb.addEventListener("change", function () { t.done = cb.checked; persist(); render(); });
      var lab = el("label", "", t.text); lab.htmlFor = id;
      var rm = el("button", "remove", "×"); rm.type = "button"; rm.setAttribute("aria-label", "Remove to-do: " + t.text);
      rm.addEventListener("click", function () { state.todos[viewDay].splice(i, 1); if (!state.todos[viewDay].length) delete state.todos[viewDay]; persist(); render(); });
      li.appendChild(cb); li.appendChild(lab); li.appendChild(rm); todos.appendChild(li);
    });
    var note = $("day-note");
    if (document.activeElement !== note) note.value = state.notes[viewDay] || "";

    // coming up
    var up = $("upcoming"); up.textContent = "";
    var items = [];
    state.events.forEach(function (ev) { var o = nextOccurrence(ev, now); if (o) items.push({ ev: ev, o: o }); });
    items.sort(function (a, b) { return a.o.start - b.o.start; });
    items.slice(0, 6).forEach(function (it) { up.appendChild(eventRow(it.ev, now, it.o.day, true)); });
    $("up-empty").hidden = items.length > 0;

    if (openId) fillDetail();
  }

  /* day navigation */
  $("prev-day").addEventListener("click", function () { viewDay = addDays(viewDay, -1); render(); });
  $("next-day").addEventListener("click", function () { viewDay = addDays(viewDay, 1); render(); });
  $("today").addEventListener("click", function () { viewDay = ymd(new Date()); render(); });

  /* to-dos and note */
  function addTodo() {
    var t = $("todo-text").value.trim(); if (!t) return;
    (state.todos[viewDay] = state.todos[viewDay] || []).push({ text: t, done: false });
    $("todo-text").value = ""; persist(); render(); $("todo-text").focus();
  }
  $("todo-add").addEventListener("click", addTodo);
  $("todo-text").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addTodo(); } });
  $("day-note").addEventListener("change", function () {
    var v = $("day-note").value.trim();
    if (v) state.notes[viewDay] = v; else delete state.notes[viewDay];
    persist();
  });

  /* add event form */
  $("ev-date").value = viewDay;
  function guess() {
    var t = $("ev-title").value.trim();
    if (!t || $("ev-cat").value !== "auto") { $("ev-guess").textContent = ""; return; }
    var g = detectCategory(t);
    $("ev-guess").textContent = "Looks like: " + CAT_LABEL[g.cat] + (g.subject ? " in " + g.subject : "") + ". You can change the type.";
  }
  $("ev-title").addEventListener("input", guess);
  $("ev-cat").addEventListener("change", guess);
  $("ev-repeat").addEventListener("change", function () {
    var k = $("ev-repeat").value;
    $("until-wrap").hidden = k === "none";
    $("ev-days").hidden = k !== "weekly";
    if (k === "weekly") {
      var dow = String(parseYmd($("ev-date").value || viewDay).getDay());
      var boxes = $("ev-days").querySelectorAll("input");
      var any = false; boxes.forEach(function (b) { if (b.checked) any = true; });
      if (!any) boxes.forEach(function (b) { b.checked = b.value === dow; });
    }
  });
  $("add-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("add-msg");
    var title = $("ev-title").value.trim(), date = $("ev-date").value, start = $("ev-start").value;
    if (!title) { msg.textContent = "Please say what the event is."; $("ev-title").focus(); return; }
    if (!date) { msg.textContent = "Please pick a date."; $("ev-date").focus(); return; }
    if (!start) { msg.textContent = "Please pick a start time."; $("ev-start").focus(); return; }
    var g = detectCategory(title);
    var cat = $("ev-cat").value === "auto" ? g.cat : $("ev-cat").value;
    var kind = $("ev-repeat").value;
    var days = [];
    if (kind === "weekly") $("ev-days").querySelectorAll("input:checked").forEach(function (b) { days.push(+b.value); });
    var until = kind === "none" ? "" : $("ev-until").value;
    if (until && until < date) { msg.textContent = "The repeat end date is before the event date."; $("ev-until").focus(); return; }
    var ev = { id: uid(), title: title, cat: cat, subject: g.subject, date: date, start: start, end: $("ev-end").value || "", place: $("ev-place").value.trim(), repeat: { kind: kind, days: days, until: until }, prep: null };
    state.events.push(ev); persist();
    msg.textContent = "Added " + title + " (" + CAT_LABEL[cat] + "), " + countdownFor(ev, new Date()).text + ".";
    $("ev-title").value = ""; $("ev-place").value = ""; $("ev-end").value = ""; $("ev-guess").textContent = "";
    $("ev-repeat").value = "none"; $("until-wrap").hidden = true; $("ev-days").hidden = true; $("ev-until").value = "";
    $("ev-days").querySelectorAll("input").forEach(function (b) { b.checked = false; });
    $("ev-cat").value = "auto";
    viewDay = date; render();
    if (cat === "test") openPrep(ev.id);
  });

  /* event detail */
  function openDetail(id) { openId = id; closePrep(); fillDetail(); $("detail").hidden = false; $("detail").focus(); }
  function fillDetail() {
    var ev = find(openId); if (!ev) { $("detail").hidden = true; openId = null; return; }
    var now = new Date(), cd = countdownFor(ev, now);
    $("detail-title").textContent = ev.title;
    $("detail-count").textContent = cd.text === "over" ? "This event is over." : (cd.text === "happening now" ? "Happening now" : "Starts " + cd.text);
    var day = cd.occ ? cd.occ.day : ev.date;
    var rep = ev.repeat && ev.repeat.kind === "daily" ? ", every day" : ev.repeat && ev.repeat.kind === "weekly" ? ", every week" : "";
    $("detail-when").textContent = CAT_LABEL[ev.cat] + (ev.subject ? " · " + ev.subject : "") + ". " + longDate(day) + " at " + clock(ev.start) + (ev.end ? " to " + clock(ev.end) : "") + rep + ".";
    $("detail-where").textContent = ev.place ? "Where: " + ev.place : "";
    var help = $("detail-help"); help.textContent = "";
    var h = helpFor(ev);
    if (h) help.appendChild(el("p", "", h));
    if (ev.cat === "test" && cd.occ) {
      var b = el("button", "btn ghost", ev.prep ? "Make a new plan" : "Make a preparation guide"); b.type = "button";
      b.addEventListener("click", function () { openPrep(ev.id); });
      help.appendChild(b);
    }
  }
  $("detail-close").addEventListener("click", function () { $("detail").hidden = true; openId = null; });
  $("detail-delete").addEventListener("click", function () {
    var ev = find(openId); if (!ev) return;
    if (!window.confirm("Delete " + ev.title + "?" + (ev.prep ? " Its study blocks are deleted too." : ""))) return;
    state.events = state.events.filter(function (x) { return x.id !== ev.id && x.parent !== ev.id; });
    persist(); openId = null; $("detail").hidden = true; render();
  });

  /* test preparation */
  function openPrep(id) {
    var ev = find(id); if (!ev) return;
    prepFor = id; $("detail").hidden = true; openId = null;
    $("prep-title").textContent = "Get ready for: " + ev.title;
    var cd = countdownFor(ev, new Date());
    $("prep-intro").textContent = "Your " + (ev.subject ? ev.subject + " " : "") + "test is " + (cd.text === "over" ? "over" : cd.text) + ". Tell us how you like to prepare and we can plan the days before it.";
    $("prep-plan").textContent = "";
    for (var i = 1; i <= 3; i++) { $("topic-" + i).value = ""; $("conf-" + i).value = "3"; }
    $("prep").hidden = false; $("prep").focus();
  }
  function closePrep() { $("prep").hidden = true; prepFor = null; }
  $("prep-no").addEventListener("click", function () { closePrep(); $("add-msg").textContent = "No plan made. You can make one later from the test's card."; });
  $("prep-yes").addEventListener("click", function () {
    var ev = find(prepFor); if (!ev) return;
    var topics = [];
    for (var i = 1; i <= 3; i++) topics.push({ name: $("topic-" + i).value, conf: $("conf-" + i).value });
    var how = (document.querySelector("input[name=prep-how]:checked") || {}).value || "practice";
    var occ = nextOccurrence(ev, new Date());
    var plan = buildStudyPlan({ today: ymd(new Date()), testDay: occ ? occ.day : ev.date, topics: topics, how: how, subject: ev.subject, time: $("prep-time").value || "17:00" });
    // replace an older plan for this test
    state.events = state.events.filter(function (x) { return x.parent !== ev.id; });
    plan.forEach(function (b) {
      var p = b.start.split(":"), endMin = +p[0] * 60 + +p[1] + b.minutes;
      var end = endMin < 1440 ? pad(Math.floor(endMin / 60)) + ":" + pad(endMin % 60) : "23:59";
      state.events.push({ id: uid(), title: b.title, cat: "study", subject: ev.subject, date: b.date, start: b.start, end: end, place: "", repeat: { kind: "none", days: [], until: "" }, prep: null, parent: ev.id, how: b.how });
    });
    ev.prep = { how: how, topics: topics.filter(function (t) { return t.name.trim(); }), blocks: plan.length };
    persist();
    var ol = $("prep-plan"); ol.textContent = "";
    plan.forEach(function (b) { ol.appendChild(el("li", "", longDate(b.date) + ", " + clock(b.start) + ", " + b.minutes + " min: " + b.title + ". " + b.how + ".")); });
    $("add-msg").textContent = "Added " + plural(plan.length, "study block") + " to your planner for " + ev.title + ".";
    render();
  });

  /* delete everything */
  $("wipe").addEventListener("click", function () {
    if (!window.confirm("Delete all your events, to-dos and notes from this browser? This cannot be undone.")) return;
    store.wipe(); state = emptyState(); openId = null; $("detail").hidden = true; closePrep();
    $("wipe-msg").textContent = "Everything was deleted from this browser.";
    render();
  });

  /* live countdowns: update the words only, so nothing moves under the keyboard or a finger */
  function tick() {
    var now = new Date();
    if (ymd(now) !== lastToday) { lastToday = ymd(now); render(); return; }
    renderBanner(now);
    document.querySelectorAll("[data-count]").forEach(function (c) {
      var ev = find(c.getAttribute("data-count")); if (!ev) return;
      c.textContent = rowCount(ev, c.getAttribute("data-day"), now);
    });
    if (openId) fillDetail();
  }
  var lastToday = ymd(new Date());
  render();
  setInterval(tick, 15000);
})();
