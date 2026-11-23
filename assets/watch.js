/* Yaanstep Sprouts: slow things to watch (23 Nov 2026, for Manish).
   Calm moving pictures for any child: a fan, soft lights, a lava lamp, fish, falling snow, sea waves, a pinwheel and balloons.
   A picture moves only after a tap, has no sound and no flashing (brightness changes over several seconds), and stops on Stop.
   Everything is drawn here on a canvas. Nothing is stored and nothing is sent. No points: there is nothing to win. */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function icon(inner) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 64 64');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    s.innerHTML = inner;
    return s;
  }
  /** The same "random" picture every time, so the scenes look settled and tests can repeat them. */
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function still() {
    if (document.documentElement.classList.contains('ys-calm')) return true;
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  var TAU = Math.PI * 2;
  function sky(c, w, h, top, bottom) {
    var g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function glow(c, x, y, r, color, alpha) {
    var g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = alpha; c.fillStyle = g;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.globalAlpha = 1;
  }

  /* ---------- the scenes: draw(c, w, h, t) with t in seconds of movement ---------- */
  var SCENES = [
    {
      id: 'fan', name: 'Turning fan', label: 'A ceiling fan with five pale blue blades turning slowly round.',
      icon: '<circle cx="32" cy="32" r="28" fill="#eaf1f7"/><g fill="#a9c4dc" stroke="#17312D" stroke-width="1.5"><path d="M32 32C26 22 28 10 34 8c4 6 2 16-2 24z"/><path d="M32 32c11-1 21 6 21 12c-7 2-15-4-21-12z"/><path d="M32 32c-5 10-16 15-21 11c2-7 12-11 21-11z"/></g><circle cx="32" cy="32" r="5" fill="#17312D"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#dfe9f1', '#c7d6e3');
        var cx = w / 2, cy = h / 2 + 10, a = t * 0.9;
        c.fillStyle = '#9fb3c4'; c.fillRect(cx - 6, 0, 12, cy - 30);
        for (var i = 0; i < 5; i++) {
          c.save(); c.translate(cx, cy); c.rotate(a + i * TAU / 5);
          c.fillStyle = i % 2 ? '#a9c4dc' : '#b6cfe3';
          c.strokeStyle = '#5f7a91'; c.lineWidth = 3;
          c.beginPath(); c.ellipse(0, -130, 46, 120, 0, 0, TAU); c.fill(); c.stroke();
          c.restore();
        }
        c.fillStyle = '#4e6275'; c.beginPath(); c.arc(cx, cy, 34, 0, TAU); c.fill();
        c.fillStyle = '#e9eef3'; c.beginPath(); c.arc(cx - 8, cy - 8, 9, 0, TAU); c.fill();
      }
    },
    {
      id: 'lights', name: 'Soft lights', label: 'A string of round lights in soft colors that slowly glow brighter and dimmer, one after another, like a wave.',
      icon: '<rect width="64" height="64" rx="10" fill="#22303f"/><path d="M4 18q28 22 56 0" fill="none" stroke="#6b7c8c" stroke-width="2"/><circle cx="12" cy="25" r="5" fill="#f6d488"/><circle cx="24" cy="31" r="5" fill="#9fd3c5"/><circle cx="40" cy="31" r="5" fill="#f4b6a4"/><circle cx="52" cy="25" r="5" fill="#b9c9f2"/><circle cx="20" cy="48" r="7" fill="#f6d488" opacity=".5"/><circle cx="44" cy="50" r="6" fill="#9fd3c5" opacity=".5"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#1f2b38', '#2a3a4a');
        var cols = ['#f6d488', '#9fd3c5', '#f4b6a4', '#b9c9f2', '#d9b8e8'];
        var rand = seeded(7);
        for (var k = 0; k < 9; k++) {
          var bx = (rand() * w + t * (8 + rand() * 10)) % (w + 200) - 100, by = h * 0.55 + rand() * h * 0.4 + Math.sin(t * 0.3 + k) * 20;
          glow(c, bx, by, 60 + rand() * 50, cols[k % cols.length], 0.25);
        }
        for (var row = 0; row < 2; row++) {
          var y0 = 90 + row * 150, n = 12;
          c.strokeStyle = '#5c6d7e'; c.lineWidth = 3; c.beginPath();
          for (var x = 0; x <= w; x += 20) { var yy = y0 + Math.sin(x / w * Math.PI) * 70; if (x === 0) c.moveTo(x, yy); else c.lineTo(x, yy); }
          c.stroke();
          for (var i = 0; i < n; i++) {
            var lx = (i + 0.5) * w / n, ly = y0 + Math.sin(lx / w * Math.PI) * 70 + 18;
            var b = 0.55 + 0.45 * Math.sin(t * 0.8 - i * 0.55 + row * 1.3);
            var col = cols[(i + row * 2) % cols.length];
            glow(c, lx, ly, 46, col, 0.25 + 0.35 * b);
            c.globalAlpha = 0.55 + 0.45 * b; c.fillStyle = col;
            c.beginPath(); c.arc(lx, ly, 15, 0, TAU); c.fill(); c.globalAlpha = 1;
          }
        }
      }
    },
    {
      id: 'lava', name: 'Lava lamp', label: 'A tall lava lamp with soft orange blobs that slowly float up, change shape and sink down again.',
      icon: '<path d="M24 6h16l8 44H16z" fill="#f6c3a6" stroke="#17312D" stroke-width="2"/><circle cx="30" cy="22" r="5" fill="#e07b2a"/><circle cx="36" cy="36" r="7" fill="#e07b2a"/><path d="M14 50h36l-4 10H18z" fill="#6b7c8c"/><path d="M22 2h20l2 4H20z" fill="#6b7c8c"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#2b2433', '#3a2f3f');
        var cx = w / 2, top = 70, bot = h - 110, tw = 90, bw = 170;
        glow(c, cx, h / 2, 330, '#f0a36b', 0.18);
        c.save();
        c.beginPath(); c.moveTo(cx - tw, top); c.lineTo(cx + tw, top); c.lineTo(cx + bw, bot); c.lineTo(cx - bw, bot); c.closePath();
        var g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, '#f7c9a3'); g.addColorStop(1, '#f2a679');
        c.fillStyle = g; c.fill(); c.clip();
        for (var i = 0; i < 7; i++) {
          var ph = i * 1.7, sp = 0.12 + i * 0.015;
          var y = (top + bot) / 2 + Math.sin(t * sp + ph) * (bot - top) * 0.38;
          var x = cx + Math.sin(t * 0.2 + ph * 2) * 50;
          var r = 34 + 12 * Math.sin(t * 0.3 + ph);
          c.fillStyle = '#d9662f';
          c.beginPath(); c.ellipse(x, y, r, r * (1.15 + 0.15 * Math.sin(t * 0.4 + ph)), 0, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,220,180,.35)'; c.beginPath(); c.arc(x - r / 3, y - r / 3, r / 4, 0, TAU); c.fill();
        }
        c.restore();
        c.fillStyle = '#6b7c8c';
        c.beginPath(); c.moveTo(cx - tw - 10, top); c.lineTo(cx + tw + 10, top); c.lineTo(cx + 60, top - 40); c.lineTo(cx - 60, top - 40); c.fill();
        c.beginPath(); c.moveTo(cx - bw - 6, bot); c.lineTo(cx + bw + 6, bot); c.lineTo(cx + bw - 30, h - 20); c.lineTo(cx - bw + 30, h - 20); c.fill();
      }
    },
    {
      id: 'fish', name: 'Fish tank', label: 'A blue fish tank with five fish swimming slowly across, plants swaying and small bubbles rising.',
      icon: '<rect x="4" y="8" width="56" height="48" rx="6" fill="#8cc7ea"/><path d="M14 30q10-10 22 0l8-6v16l-8-6q-12 10-22 0z" fill="#f2a679"/><path d="M48 56q-4-14 2-26M54 56q4-10-2-20" stroke="#3e9b6b" stroke-width="3" fill="none"/><circle cx="40" cy="18" r="2.5" fill="#fff"/><circle cx="44" cy="12" r="2" fill="#fff"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#a9d7ef', '#4f93bf');
        c.fillStyle = '#e8d8b0'; c.beginPath(); c.moveTo(0, h); c.lineTo(0, h - 50);
        for (var x = 0; x <= w; x += 40) c.lineTo(x, h - 50 - Math.sin(x / 90) * 12);
        c.lineTo(w, h); c.fill();
        var rand = seeded(3);
        for (var p = 0; p < 7; p++) {
          var px = 60 + p * 140 + rand() * 40, ph = rand() * 6;
          c.strokeStyle = p % 2 ? '#3e9b6b' : '#5bb07f'; c.lineWidth = 7; c.lineCap = 'round';
          c.beginPath(); c.moveTo(px, h - 40);
          c.quadraticCurveTo(px + Math.sin(t * 0.5 + ph) * 30, h - 160, px + Math.sin(t * 0.5 + ph + 1) * 40, h - 230 - rand() * 60);
          c.stroke();
        }
        var cols = ['#f2a679', '#f6d488', '#d9b8e8', '#f4b6a4', '#ffffff'];
        for (var f = 0; f < 5; f++) {
          var dir = f % 2 ? -1 : 1, speed = 30 + f * 6, span = w + 240;
          var fx = dir > 0 ? (t * speed + f * 230) % span - 120 : w + 120 - (t * speed + f * 190) % span;
          var fy = 110 + f * 75 + Math.sin(t * 0.6 + f) * 18;
          c.save(); c.translate(fx, fy); c.scale(dir, 1);
          c.fillStyle = cols[f];
          c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-10, -32, 30, 0); c.quadraticCurveTo(-10, 32, -50, 0); c.fill();
          var flap = Math.sin(t * 2 + f) * 6;
          c.beginPath(); c.moveTo(-46, 0); c.lineTo(-72, -18 + flap); c.lineTo(-72, 18 + flap); c.closePath(); c.fill();
          c.fillStyle = '#17312D'; c.beginPath(); c.arc(16, -5, 4, 0, TAU); c.fill();
          c.restore();
        }
        c.fillStyle = 'rgba(255,255,255,.75)';
        for (var b = 0; b < 14; b++) {
          var bx = 120 + (b % 5) * 180 + Math.sin(t + b) * 8, by = h - ((t * (18 + b % 4 * 6) + b * 60) % (h + 40));
          c.beginPath(); c.arc(bx, by, 4 + b % 3 * 2, 0, TAU); c.fill();
        }
      }
    },
    {
      id: 'snow', name: 'Falling snow', label: 'Snowflakes falling slowly and drifting from side to side over a quiet snowy hill with a little house.',
      icon: '<rect width="64" height="64" rx="10" fill="#2f4660"/><path d="M0 50q32-14 64 0v14H0z" fill="#eef4f9"/><rect x="36" y="36" width="14" height="12" fill="#c8a27a"/><path d="M34 37l9-8 9 8z" fill="#8a5a2b"/><g fill="#fff"><circle cx="12" cy="14" r="2.5"/><circle cx="28" cy="22" r="2"/><circle cx="46" cy="12" r="2.5"/><circle cx="20" cy="34" r="2"/><circle cx="54" cy="28" r="2"/></g>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#2c4058', '#4a6584');
        glow(c, w * 0.8, 110, 70, '#fff6d6', 0.5);
        c.fillStyle = '#f5f1e3'; c.beginPath(); c.arc(w * 0.8, 110, 34, 0, TAU); c.fill();
        c.fillStyle = '#eef4f9'; c.beginPath(); c.moveTo(0, h);
        c.quadraticCurveTo(w * 0.3, h - 200, w * 0.6, h - 120); c.quadraticCurveTo(w * 0.85, h - 70, w, h - 110); c.lineTo(w, h); c.fill();
        var hx = w * 0.62, hy = h - 210;
        c.fillStyle = '#c8a27a'; c.fillRect(hx, hy, 110, 80);
        c.fillStyle = '#8a5a2b'; c.beginPath(); c.moveTo(hx - 14, hy + 4); c.lineTo(hx + 55, hy - 50); c.lineTo(hx + 124, hy + 4); c.fill();
        c.fillStyle = '#f6d488'; c.fillRect(hx + 20, hy + 22, 26, 22);
        var rand = seeded(11);
        c.fillStyle = '#ffffff';
        for (var i = 0; i < 90; i++) {
          var size = 2 + rand() * 5, fall = 14 + size * 5, x0 = rand() * w, y0 = rand() * h;
          var y = (y0 + t * fall) % (h + 20) - 10;
          var x = (x0 + Math.sin(t * 0.4 + i) * 30 + w) % w;
          c.globalAlpha = 0.6 + size / 15;
          c.beginPath(); c.arc(x, y, size, 0, TAU); c.fill();
        }
        c.globalAlpha = 1;
      }
    },
    {
      id: 'waves', name: 'Sea waves', label: 'Soft blue sea waves rolling slowly in front of a low sun, with a small sailing boat rocking gently.',
      icon: '<rect width="64" height="64" rx="10" fill="#f8e3c4"/><circle cx="42" cy="26" r="10" fill="#f2a679"/><path d="M0 40q8-6 16 0t16 0 16 0 16 0v24H0z" fill="#6aa9cf"/><path d="M0 50q8-6 16 0t16 0 16 0 16 0v14H0z" fill="#3f7fae"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#fbe9cf', '#f3cfa8');
        glow(c, w * 0.65, h * 0.42, 160, '#ffd9a8', 0.6);
        c.fillStyle = '#f2a679'; c.beginPath(); c.arc(w * 0.65, h * 0.42, 60, 0, TAU); c.fill();
        var layers = [['#9cc8e3', 0.5, 18, 0.25], ['#6aa9cf', 0.6, 22, 0.35], ['#4b8fbd', 0.72, 26, 0.45], ['#3a78a6', 0.85, 30, 0.55]];
        layers.forEach(function (L, k) {
          var base = h * L[1];
          c.fillStyle = L[0]; c.beginPath(); c.moveTo(0, h);
          for (var x = 0; x <= w; x += 12) c.lineTo(x, base + Math.sin(x / (110 + k * 20) + t * L[3] + k) * L[2]);
          c.lineTo(w, h); c.fill();
          if (k === 1) {
            var bx = w * 0.3 + Math.sin(t * 0.1) * 60, by = base + Math.sin(bx / 130 + t * L[3] + k) * L[2] - 6;
            c.save(); c.translate(bx, by); c.rotate(Math.sin(t * 0.7) * 0.08);
            c.fillStyle = '#8a5a2b'; c.beginPath(); c.moveTo(-50, 0); c.lineTo(50, 0); c.lineTo(36, 22); c.lineTo(-36, 22); c.fill();
            c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(-4, -6); c.lineTo(-4, -96); c.lineTo(46, -10); c.fill();
            c.restore();
          }
        });
      }
    },
    {
      id: 'pinwheel', name: 'Pinwheel', label: 'A pinwheel with four soft colored sails turning slowly on a stick in a garden.',
      icon: '<rect width="64" height="64" rx="10" fill="#e3f2ea"/><path d="M32 30v32" stroke="#8a5a2b" stroke-width="3"/><path d="M32 30L32 8 44 20z" fill="#f4b6a4"/><path d="M32 30L54 30 42 42z" fill="#b9c9f2"/><path d="M32 30L32 52 20 40z" fill="#f6d488"/><path d="M32 30L10 30 22 18z" fill="#9fd3c5"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#e6f3f7', '#e3f2ea');
        c.fillStyle = '#bfe0c9'; c.fillRect(0, h - 90, w, 90);
        var rand = seeded(5);
        for (var i = 0; i < 18; i++) {
          var fx = rand() * w, fy = h - 30 - rand() * 50;
          c.fillStyle = ['#f4b6a4', '#f6d488', '#d9b8e8'][i % 3];
          c.beginPath(); c.arc(fx, fy + Math.sin(t * 0.6 + i) * 3, 7, 0, TAU); c.fill();
        }
        var cx = w / 2, cy = h / 2 - 20;
        c.strokeStyle = '#8a5a2b'; c.lineWidth = 12; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, h - 40); c.stroke();
        var cols = ['#f4b6a4', '#b9c9f2', '#f6d488', '#9fd3c5'];
        c.save(); c.translate(cx, cy); c.rotate(t * 0.7);
        for (var k = 0; k < 4; k++) {
          c.rotate(TAU / 4);
          c.fillStyle = cols[k]; c.strokeStyle = '#5f7a91'; c.lineWidth = 2;
          c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -170); c.lineTo(110, -60); c.closePath(); c.fill(); c.stroke();
        }
        c.restore();
        c.fillStyle = '#4e6275'; c.beginPath(); c.arc(cx, cy, 14, 0, TAU); c.fill();
      }
    },
    {
      id: 'balloons', name: 'Floating balloons', label: 'Balloons in soft colors floating slowly up into a pale sky and swaying a little on their strings.',
      icon: '<rect width="64" height="64" rx="10" fill="#e6f1f8"/><ellipse cx="22" cy="24" rx="9" ry="11" fill="#f4b6a4"/><ellipse cx="42" cy="18" rx="8" ry="10" fill="#b9c9f2"/><ellipse cx="40" cy="42" rx="7" ry="9" fill="#f6d488"/><path d="M22 35q-2 10 2 20M42 28q2 8-2 16M40 51q-2 6 0 10" stroke="#6b7c8c" stroke-width="1.5" fill="none"/>',
      draw: function (c, w, h, t) {
        sky(c, w, h, '#dceaf4', '#f2f7fa');
        var rand = seeded(21);
        c.fillStyle = 'rgba(255,255,255,.9)';
        for (var k = 0; k < 4; k++) {
          var cx = (rand() * w + t * 6) % (w + 300) - 150, cy = 80 + rand() * 300;
          c.beginPath(); c.ellipse(cx, cy, 90, 30, 0, 0, TAU); c.ellipse(cx + 40, cy - 18, 50, 26, 0, 0, TAU); c.fill();
        }
        var cols = ['#f4b6a4', '#b9c9f2', '#f6d488', '#9fd3c5', '#d9b8e8'];
        for (var i = 0; i < 9; i++) {
          var x = 60 + rand() * (w - 120), speed = 16 + rand() * 12, span = h + 260;
          var y = h + 130 - ((t * speed + rand() * span) % span);
          var sway = Math.sin(t * 0.5 + i) * 18;
          c.strokeStyle = '#6b7c8c'; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x + sway, y + 58); c.quadraticCurveTo(x + sway - 14, y + 100, x + sway + 6, y + 140); c.stroke();
          c.fillStyle = cols[i % cols.length];
          c.beginPath(); c.ellipse(x + sway, y, 42, 52, 0, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(x + sway - 14, y - 18, 9, 14, -0.4, 0, TAU); c.fill();
        }
      }
    }
  ];

  /* ---------- the page ---------- */
  var canvas = $('scene'), ctx = canvas && canvas.getContext && canvas.getContext('2d');
  var picks = $('picks'), viewer = $('viewer'), title = $('scene-h'), status = $('scene-status');
  if (!canvas || !picks) return;
  var current = -1, running = false, last = 0, t = 0, speed = still() ? 0.5 : 1, raf = 0, frames = 0, opener = null;

  function frame(now) {
    if (!running) return;
    if (last) t += Math.min(0.1, (now - last) / 1000) * speed;
    last = now;
    SCENES[current].draw(ctx, canvas.width, canvas.height, t);
    frames += 1;
    raf = window.requestAnimationFrame(frame);
  }
  function stop(quietly) {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0; last = 0;
    if (!quietly) {
      status.textContent = 'Stopped.';
      viewer.hidden = true;
      Array.prototype.forEach.call(picks.children, function (b) { b.removeAttribute('aria-current'); });
      if (opener) opener.focus();
    }
  }
  function show(i, from) {
    stop(true);
    current = (i + SCENES.length) % SCENES.length;
    var s = SCENES[current];
    opener = from || picks.children[current];
    Array.prototype.forEach.call(picks.children, function (b, k) { if (k === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    title.textContent = s.name;
    canvas.setAttribute('aria-label', s.label);
    viewer.hidden = false;
    t = 0; frames = 0; running = true;
    s.draw(ctx, canvas.width, canvas.height, 0);
    raf = window.requestAnimationFrame(frame);
    status.textContent = s.name + ' is moving slowly. Tap Stop to stop.';
    title.focus();
    viewer.scrollIntoView({ block: 'nearest' });
  }

  SCENES.forEach(function (s, i) {
    var b = el('button', { type: 'button', 'data-scene': s.id });
    b.appendChild(icon(s.icon));
    b.appendChild(el('span', {}, s.name));
    b.addEventListener('click', function () { show(i, b); });
    picks.appendChild(b);
  });
  $('stop').addEventListener('click', function () { stop(false); });
  $('next').addEventListener('click', function () { show(current + 1, picks.children[(current + 1) % SCENES.length]); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-speed]'), function (b) {
    b.setAttribute('aria-pressed', String(+b.getAttribute('data-speed') === speed));
    b.addEventListener('click', function () {
      speed = +b.getAttribute('data-speed');
      Array.prototype.forEach.call(document.querySelectorAll('[data-speed]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  var screen = $('screen'), full = $('full');
  if (screen.requestFullscreen) {
    full.hidden = false;
    full.addEventListener('click', function () { screen.requestFullscreen().catch(function () { /* not allowed here */ }); });
  }
  // Stop drawing while the tab is hidden; carry on when it comes back.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && running) { window.cancelAnimationFrame(raf); raf = 0; last = 0; }
    else if (!document.hidden && running && !raf) raf = window.requestAnimationFrame(frame);
  });

  /* Used only by the automated tests. */
  window.YS_WATCH = {
    ids: SCENES.map(function (s) { return s.id; }),
    state: function () { return { scene: current > -1 ? SCENES[current].id : null, running: running, t: t, frames: frames, speed: speed }; },
    drawAt: function (id, at) { var i = this.ids.indexOf(id); SCENES[i].draw(ctx, canvas.width, canvas.height, at); }
  };
}());
