/* Theme switcher (SCRUM-400). Stores only the theme name in this browser. No cookies, no tracking. */
(function () {
  var KEY = "yaanstep-theme";
  var THEMES = [["", "Calm Teal"], ["sunrise", "Sunrise"], ["midnight", "Midnight Focus"], ["bloom", "Playful Bloom"]];
  function get() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
  function set(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  function apply(v) { if (v) document.documentElement.setAttribute("data-theme", v); else document.documentElement.removeAttribute("data-theme"); }
  apply(get());
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector("header.site .bar");
    if (!bar) return;
    var wrap = document.createElement("div");
    wrap.className = "theme-pick";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Colour theme");
    var COL = { "": "#1F7A6D", sunrise: "#B93A0B", midnight: "#0B1220", bloom: "#6D28D9" };
    var btns = [];
    function mark() { var cur = get(); btns.forEach(function (x) { x.b.setAttribute("aria-pressed", String(x.v === cur)); }); }
    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "swatch"; b.style.setProperty("--sw", COL[t[0]]);
      b.setAttribute("aria-label", "Theme: " + t[1]); b.title = t[1];
      b.addEventListener("click", function () { apply(t[0]); set(t[0]); mark(); });
      wrap.appendChild(b); btns.push({ b: b, v: t[0] });
    });
    mark(); bar.appendChild(wrap);
  });
})();
