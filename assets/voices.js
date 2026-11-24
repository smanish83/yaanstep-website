/* Yaanstep: pick the most natural English voice the device offers (Manish, 23 Nov 2026: "Voice feel like artificial,
   are there any option to make it better?" ... "Yes please" to using the browsers' natural voices).
   Best first: natural voices (Edge and Windows "Natural"/"Neural", Apple "Enhanced"/"Premium" and Siri voices), then
   Chrome's Google voices, then the device's own basic voices. Natural voices in Edge and Google voices in Chrome run
   online: the words being read go to Microsoft or Google, never anything about the child (see privacy.html#voices).
   english() returns only the best group the device has, so every page picks from the same natural voices. */
(function () {
  'use strict';
  function score(v) {
    var n = v.name || '';
    if (/\b(Natural|Neural)\b|\((Enhanced|Premium)\)|\bSiri\b/i.test(n)) return 3;
    if (/^Google\b/i.test(n)) return 2;
    return v.localService ? 1 : 0;
  }
  function english(list) {
    var all;
    try { all = list || window.speechSynthesis.getVoices(); } catch (e) { return []; }
    var en = Array.prototype.filter.call(all || [], function (v) { return v && v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
    var best = en.reduce(function (m, v) { return Math.max(m, score(v)); }, -1);
    if (best < 1) return [];
    return en.filter(function (v) { return score(v) === best; });
  }
  window.YSVoice = { english: english, score: score };
})();
