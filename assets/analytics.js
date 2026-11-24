/* Yaanstep visit counting (Manish, 24 Nov 2026). Counts visits, new or returning, which pages and games are opened and
   finished, and the age band of the child profile (3-4, 5-6, 7-8, 9-10, 11-12 or none). Never a name, an answer, an id,
   a cookie or anything typed. It sends nothing when:
   - the site code in analytics-config.js is not filled in, or counting is turned off there;
   - the browser asks sites not to track (Do Not Track or Global Privacy Control);
   - this browser was set to not be counted on the analytics page ("ys-analytics-off");
   - the page is driven by automated tests (navigator.webdriver);
   - the page is for teens (analytics are off for ages 13 to 17, see privacy.html) or is the analytics page itself.
   Two small flags are kept to tell new from returning visits: "ys-seen" (this browser has visited before, localStorage)
   and "ys-visit" (this visit is already counted, sessionStorage). Both are written only when counting is on. */
(function () {
  'use strict';
  var cfg = window.YS_ANALYTICS_CONFIG || {}, queue = [], ready = false;
  function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function put(store, k, v) { try { window[store].setItem(k, v); } catch (e) { /* storage blocked: still counted, as new */ } }
  function off() {
    var path = location.pathname;
    return !cfg.enabled || !cfg.websiteId || /PLACEHOLDER/.test(cfg.websiteId) || !cfg.scriptSrc ||
      navigator.webdriver || navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true ||
      get('localStorage', 'ys-analytics-off') === '1' || /teens|analytics/.test(path);
  }
  function band() {
    try {
      var p = JSON.parse(get('localStorage', 'ys-profile') || 'null'), a = p && +p.age;
      if (!(a >= 3 && a <= 12)) return 'none';
      var lo = a % 2 ? a : a - 1;
      return lo + '-' + (lo + 1);
    } catch (e) { return 'none'; }
  }
  function page() { return (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index'; }
  function send(name, data) {
    if (ready && window.umami && window.umami.track) window.umami.track(name, data);
    else queue.push([name, data]);
  }
  /** Count one thing. Only short labels from the site itself go in: never text a person typed. */
  function track(name, data) {
    if (off()) return;
    var d = { page: page(), age: band() };
    if (data) Object.keys(data).forEach(function (k) { d[k] = String(data[k]).slice(0, 60); });
    send(String(name).slice(0, 50), d);
  }
  window.YSAnalytics = { track: track, isOn: function () { return !off(); }, band: band };
  if (off()) return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = cfg.scriptSrc;
  s.setAttribute('data-website-id', cfg.websiteId);
  s.setAttribute('data-do-not-track', 'true');
  s.onload = function () {
    ready = true;
    var q = queue; queue = [];
    q.forEach(function (e) { send(e[0], e[1]); });
  };
  document.head.appendChild(s);
  if (get('sessionStorage', 'ys-visit') !== '1') {
    var returning = get('localStorage', 'ys-seen') === '1';
    put('sessionStorage', 'ys-visit', '1');
    put('localStorage', 'ys-seen', '1');
    track('visit', { returning: returning ? 'yes' : 'no' });
  }
})();
