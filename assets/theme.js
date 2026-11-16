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
    var label = document.createElement("label");
    label.setAttribute("for", "theme-select");
    label.textContent = "Theme";
    var sel = document.createElement("select");
    sel.id = "theme-select";
    THEMES.forEach(function (t) { var o = document.createElement("option"); o.value = t[0]; o.textContent = t[1]; sel.appendChild(o); });
    sel.value = get();
    sel.addEventListener("change", function () { apply(sel.value); set(sel.value); });
    wrap.appendChild(label); wrap.appendChild(sel); bar.appendChild(wrap);
  });
})();
