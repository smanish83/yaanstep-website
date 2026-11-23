// Bugs and minibeasts, and friendly dinosaurs, for the Yaanstep Sprouts coloring pages.
// Every shape is drawn by this code.
import { C, E, P, R, poly, curve, line, blob, smooth, smoothD, eye, dotEye, dark, smile, g, star, heart, ring, mirrorX, rot, r1 } from '../lib.mjs';

// ---------- small helpers of our own ----------
const rad = (d) => (d * Math.PI) / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const pt = (p) => `${r1(p[0])} ${r1(p[1])}`;
const T = (x, y, s = 1, extra = '') => `translate(${r1(x)} ${r1(y)})${s !== 1 ? ` scale(${s})` : ''}${extra ? ' ' + extra : ''}`;

/** A tube (leg, arm, neck, tail) along a line of points, its width going from w0 to w1. Closed, so it can be colored. */
function limb(pts, w0, w1 = w0, a = '') {
  const n = pts.length, L = [], Rr = [];
  const tan = (i) => {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(n - 1, i + 1)];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  for (let i = 0; i < n; i++) {
    const [tx, ty] = tan(i), w = lerp(w0, w1, i / (n - 1)) / 2;
    L.push([pts[i][0] - ty * w, pts[i][1] + tx * w]);
    Rr.push([pts[i][0] + ty * w, pts[i][1] - tx * w]);
  }
  const [sx, sy] = tan(0), [ex, ey] = tan(n - 1);
  const cs = [pts[0][0] - sx * w0 * 0.45, pts[0][1] - sy * w0 * 0.45];
  const ce = [pts[n - 1][0] + ex * w1 * 0.45, pts[n - 1][1] + ey * w1 * 0.45];
  return blob([cs, ...L, ce, ...Rr.reverse()], a);
}

/** Stripes across an ellipse as closed bands (bee stripes). spans: [[a,b],...] along x (or y when vertical). */
function bands(cx, cy, rx, ry, spans, bend = 10, vertical = false) {
  let s = '';
  for (const [a, b] of spans) {
    if (!vertical) {
      const h = (x) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
      const ha = h(a), hb = h(b);
      s += P(`M${r1(a)} ${r1(cy - ha)}A${rx} ${ry} 0 0 1 ${r1(b)} ${r1(cy - hb)}Q${r1(b + bend)} ${r1(cy)} ${r1(b)} ${r1(cy + hb)}A${rx} ${ry} 0 0 1 ${r1(a)} ${r1(cy + ha)}Q${r1(a + bend)} ${r1(cy)} ${r1(a)} ${r1(cy - ha)}Z`);
    } else {
      const h = (y) => rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2));
      const ha = h(a), hb = h(b);
      s += P(`M${r1(cx + ha)} ${r1(a)}A${rx} ${ry} 0 0 1 ${r1(cx + hb)} ${r1(b)}Q${r1(cx)} ${r1(b + bend)} ${r1(cx - hb)} ${r1(b)}A${rx} ${ry} 0 0 1 ${r1(cx - ha)} ${r1(a)}Q${r1(cx)} ${r1(a + bend)} ${r1(cx + ha)} ${r1(a)}Z`);
    }
  }
  return s;
}

/** A leaf with a middle vein, from base (x,y) pointing at angle a (degrees), length len. */
function leaf(x, y, len, a, ctx, wide = 0.38) {
  const w = len * wide;
  return g(blob([[0, 0], [len * 0.3, -w * 0.5], [len * 0.65, -w * 0.42], [len, 0], [len * 0.65, w * 0.42], [len * 0.3, w * 0.5]]) +
    curve(`M${r1(len * 0.06)} 0Q${r1(len * 0.5)} ${r1(-w * 0.08)} ${r1(len * 0.88)} 0`, ctx.thin), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
}

/** A daisy: petals round a centre. */
function daisy(x, y, r, n = 8, ctx) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360;
    s += g(E(r * 1.05, 0, r * 0.62, r * 0.36), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
  }
  return s + C(x, y, r * 0.55);
}

const rosy = (x, y, r, ctx) => E(x, y, r, r * 0.65, ctx.thin);
const closedEye = (x, y, w, ctx) => curve(`M${r1(x - w)} ${r1(y)}Q${r1(x)} ${r1(y + w * 0.9)} ${r1(x + w)} ${r1(y)}`);
const antenna = (x0, y0, x1, y1, bend, tipR, ctx) =>
  curve(`M${r1(x0)} ${r1(y0)}Q${r1((x0 + x1) / 2 + bend)} ${r1((y0 + y1) / 2)} ${r1(x1)} ${r1(y1)}`) + C(x1, y1, tipR);

// =====================================================================================
// BUGS
// =====================================================================================

// ---- Butterfly: wings are drawn "radially" from a root point so patterns can follow them ----
function wingPts(root, a0, a1, R, f, n = 18, sx = 1, sy = 1, k = 1) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = 0.03 + (i / n) * 0.94, a = rad(lerp(a0, a1, t)), r = R * f(t) * k;
    out.push([root[0] + Math.cos(a) * r * sx, root[1] + Math.sin(a) * r * sy]);
  }
  return [root, ...out];
}
const wingAt = (root, a0, a1, R, f, t, k, sx = 1, sy = 1) => {
  const a = rad(lerp(a0, a1, t)), r = R * f(t) * k;
  return [root[0] + Math.cos(a) * r * sx, root[1] + Math.sin(a) * r * sy];
};
const lobe = (p = 0.5) => (t) => Math.pow(Math.sin(Math.PI * t), p);

function butterflyBody(ctx, face = true) {
  let s = antenna(-8, -78, -55, -165, -10, 10, ctx) + antenna(8, -78, 55, -165, 10, 10, ctx);
  s += blob([[0, -50], [17, -30], [16, 40], [10, 110], [0, 128], [-10, 110], [-16, 40], [-17, -30]]);
  s += curve('M-14 0Q0 8 14 0M-13 35Q0 43 13 35M-11 70Q0 78 11 70', ctx.thin);
  s += C(0, -62, 30);
  if (face) s += dotEye(-11, -66, 5.5) + dotEye(11, -66, 5.5) + smile(0, -52, 14, 0.45);
  return s;
}

function butterfly(style, rand, ctx) {
  const U = { root: [6, -14], a0: -112, a1: 4, R: 192, sx: 1.08, sy: 1 };
  const D = { root: [6, 12], a0: 8, a1: 104, R: 140, sx: 1, sy: 1 };
  const both = (inner) => inner + mirrorX(inner);
  let s = '';
  if (style === 0) { // round wings with big spots
    const fu = lobe(0.45), fd = lobe(0.5);
    let w = blob(wingPts(D.root, D.a0, D.a1, D.R, fd));
    w += C(...wingAt(D.root, D.a0, D.a1, D.R, fd, 0.5, 0.55), 30) + C(...wingAt(D.root, D.a0, D.a1, D.R, fd, 0.7, 0.85), 11);
    w += blob(wingPts(U.root, U.a0, U.a1, U.R, fu, 18, U.sx));
    w += C(...wingAt(U.root, U.a0, U.a1, U.R, fu, 0.52, 0.55, U.sx), 38) + C(...wingAt(U.root, U.a0, U.a1, U.R, fu, 0.3, 0.82, U.sx), 16) + C(...wingAt(U.root, U.a0, U.a1, U.R, fu, 0.78, 0.8, U.sx), 14);
    s += both(w);
  } else if (style === 1) { // stained-glass wings with dots round the edge
    const fu = lobe(0.42), fd = lobe(0.48);
    const cells = (W, f, m, tA, tB, inner, outer, dots, dotR) => {
      let c = blob(wingPts(W.root, W.a0, W.a1, W.R, f, 18, W.sx));
      for (let i = 0; i < m; i++) {
        const t0 = lerp(tA, tB, i / m) + 0.022, t1 = lerp(tA, tB, (i + 1) / m) - 0.022;
        const outerPts = [];
        for (let j = 0; j <= 4; j++) outerPts.push(wingAt(W.root, W.a0, W.a1, W.R, f, lerp(t0, t1, j / 4), outer, W.sx));
        const a = [W.root[0] + Math.cos(rad(lerp(W.a0, W.a1, t0))) * W.R * inner * W.sx, W.root[1] + Math.sin(rad(lerp(W.a0, W.a1, t0))) * W.R * inner];
        const b = [W.root[0] + Math.cos(rad(lerp(W.a0, W.a1, t1))) * W.R * inner * W.sx, W.root[1] + Math.sin(rad(lerp(W.a0, W.a1, t1))) * W.R * inner];
        const mid = (t0 + t1) / 2;
        const mi = [W.root[0] + Math.cos(rad(lerp(W.a0, W.a1, mid))) * W.R * inner * 1.05 * W.sx, W.root[1] + Math.sin(rad(lerp(W.a0, W.a1, mid))) * W.R * inner * 1.05];
        const arc = smoothD(outerPts, false).replace(/^M[^C]*/, '');
        c += P(`M${pt(a)}L${pt(outerPts[0])}${arc}L${pt(b)}Q${pt(mi)} ${pt(a)}Z`);
      }
      for (let i = 0; i < dots; i++) c += C(...wingAt(W.root, W.a0, W.a1, W.R, f, lerp(tA + 0.04, tB - 0.04, i / (dots - 1)), 0.9, W.sx), dotR);
      return c;
    };
    s += both(cells(D, fd, 3, 0.16, 0.86, 0.3, 0.74, 4, 8) + cells(U, fu, 4, 0.14, 0.88, 0.3, 0.76, 6, 8.5));
  } else if (style === 2) { // scalloped wings with hearts
    const sc = (base, k) => (t) => base(t) * (1 - 0.06 * (1 - Math.abs(Math.sin(Math.PI * t * k))));
    const fu = sc(lobe(0.45), 6), fd = sc(lobe(0.5), 4);
    let w = blob(wingPts(D.root, D.a0, D.a1, D.R, fd, 40));
    let p = wingAt(D.root, D.a0, D.a1, D.R, fd, 0.5, 0.55);
    w += heart(p[0], p[1] + 6, 58);
    w += blob(wingPts(U.root, U.a0, U.a1, U.R, fu, 48, U.sx));
    p = wingAt(U.root, U.a0, U.a1, U.R, fu, 0.5, 0.55, U.sx);
    w += heart(p[0], p[1] + 4, 74);
    p = wingAt(U.root, U.a0, U.a1, U.R, fu, 0.82, 0.78, U.sx);
    w += heart(p[0], p[1], 28);
    p = wingAt(U.root, U.a0, U.a1, U.R, fu, 0.2, 0.8, U.sx);
    w += heart(p[0], p[1], 28);
    s += both(w);
  } else if (style === 3) { // swallowtail: tails and rainbow bands
    const fu = lobe(0.45);
    const fd = (t) => 0.72 * Math.pow(Math.sin(Math.PI * t), 0.55) + 0.42 * Math.exp(-(((t - 0.62) / 0.1) ** 2));
    const nest = (W, f, n, ks) => {
      let c = '';
      for (const k of ks) c += blob(wingPts(W.root, W.a0, W.a1, W.R, f, n, W.sx, W.sy, k));
      return c;
    };
    const D2 = { root: [6, 14], a0: 14, a1: 104, R: 170, sx: 1, sy: 1 };
    s += both(nest(D2, fd, 30, [1, 0.62, 0.32]) + nest(U, fu, 18, [1, 0.7, 0.42]));
  } else { // side view, wings up
    let w = '';
    const fu = lobe(0.5), fd = lobe(0.55);
    const far = (inner) => g(inner, 'translate(34 -6)');
    const fore = { root: [-5, 40], a0: -158, a1: -62, R: 230, sx: 1 };
    const hind = { root: [5, 46], a0: -92, a1: -18, R: 165, sx: 1 };
    w += far(blob(wingPts(fore.root, fore.a0, fore.a1, fore.R, fu)) + blob(wingPts(hind.root, hind.a0, hind.a1, hind.R, fd)));
    w += blob(wingPts(hind.root, hind.a0, hind.a1, hind.R, fd));
    w += C(...wingAt(hind.root, hind.a0, hind.a1, hind.R, fd, 0.55, 0.6), 24);
    w += blob(wingPts(fore.root, fore.a0, fore.a1, fore.R, fu));
    w += C(...wingAt(fore.root, fore.a0, fore.a1, fore.R, fu, 0.5, 0.58), 36) + C(...wingAt(fore.root, fore.a0, fore.a1, fore.R, fu, 0.25, 0.84), 15) + C(...wingAt(fore.root, fore.a0, fore.a1, fore.R, fu, 0.75, 0.8), 15);
    s += w;
    // body lying along, head on the left
    s += curve('M-110 20Q-150 -20 -160 -60') + C(-160, -60, 10) + curve('M-90 15Q-105 -35 -100 -75') + C(-100, -75, 10);
    s += blob([[-80, 50], [-40, 32], [40, 38], [120, 52], [140, 64], [120, 76], [40, 84], [-40, 80]]);
    s += curve('M0 38Q-6 60 0 82M40 40Q34 60 40 82M80 46Q74 63 80 79', ctx.thin);
    s += C(-95, 55, 42) + dotEye(-110, 50, 6.5) + dotEye(-84, 50, 6.5) + smile(-97, 70, 18, 0.45);
    return g(s, 'translate(0 20)');
  }
  return s + butterflyBody(ctx);
}

// ---- Ladybug ----
function ladybugTop(ctx, rand, spots = 3) {
  // seen from above, head at the top. About -120..120 x, -170..120 y.
  let s = '';
  for (const y of [-40, 15, 70]) s += mirrorX(limb([[90, y], [122, y - 6], [134, y + 10]], 18, 16)) + limb([[90, y], [122, y - 6], [134, y + 10]], 18, 16);
  s += antenna(-18, -125, -48, -175, -8, 9, ctx) + antenna(18, -125, 48, -175, 8, 9, ctx);
  s += C(0, -105, 50);
  s += eye(-18, -112, 13, [0, -0.3]) + eye(18, -112, 13, [0, -0.3]) + smile(0, -88, 22, 0.4);
  const half = P('M-3 -78A112 112 0 0 0 -110 20A112 108 0 0 0 -3 125Z');
  s += half + mirrorX(half);
  const sp = [[-50, -25, 20], [-70, 45, 17], [-30, 85, 15]];
  for (const [x, y, r] of sp) s += C(x, y, r) + C(-x, y, r);
  s += C(-40, 30, 12) + C(40, 30, 12);
  return s;
}

function ladybug(style, rand, ctx) {
  let s = '';
  if (style === 0) { // side view, walking
    s += limb([[-120, 140], [-150, 170], [-140, 196]], 16, 13) + limb([[-20, 150], [-40, 178], [-28, 196]], 16, 13) + limb([[70, 140], [95, 170], [112, 196]], 16, 13);
    s += E(-30, 140, 150, 26);
    s += P('M-185 140A150 175 0 0 1 115 140Z');
    s += P('M115 140A150 175 0 0 0 64 25Q85 85 82 140Z');
    s += curve('M-35 -35Q-60 40 -80 140', ctx.thin);
    for (const [x, y, r] of [[-120, 60, 24], [-45, 70, 20], [-10, 0, 24], [-110, -10, 17], [30, 85, 18], [-70, 115, 13]]) s += C(x, y, r);
    s += antenna(130, 25, 120, -60, -25, 10, ctx) + antenna(160, 30, 180, -45, 10, 10, ctx);
    s += C(145, 85, 58);
    s += eye(128, 72, 14, [0.3, 0]) + eye(165, 72, 14, [0.3, 0]) + smile(150, 105, 30, 0.45) + rosy(118, 100, 9, ctx) + rosy(185, 98, 7, ctx);
    return g(s, 'translate(5 0)');
  }
  if (style === 1) { // on a big leaf, seen from above
    s += blob([[0, 198], [-95, 140], [-150, 40], [-145, -70], [-80, -150], [0, -198], [80, -150], [145, -70], [150, 40], [95, 140]]);
    s += curve('M0 196Q-6 0 0 -190', ctx.thin);
    for (const [y, w] of [[140, 70], [60, 115], [-30, 115], [-110, 60]]) s += curve(`M0 ${y}Q${-w * 0.5} ${y - 20} ${-w} ${y - 60}M0 ${y}Q${w * 0.5} ${y - 20} ${w} ${y - 60}`, ctx.thin);
    s += g(ladybugTop(ctx, rand), 'translate(0 30) scale(0.95) rotate(-12)');
    return s;
  }
  if (style === 2) { // front view, waving, holding a flower
    s += E(-55, 188, 45, 14) + E(55, 188, 45, 14);
    // shell behind
    const half = P('M-2 -60A150 150 0 0 0 -150 70A150 120 0 0 0 -2 182Z');
    s += half + mirrorX(half);
    for (const [x, y, r] of [[-95, 10, 22], [-110, 105, 19], [-55, 135, 17], [-50, 55, 16]]) s += C(x, y, r) + C(-x, y, r);
    // arms
    s += limb([[-60, 70], [-120, 40], [-150, -10]], 22, 20) + C(-152, -22, 18);
    s += curve('M120 110Q118 30 140 -40') + leaf(124, 50, 40, -60, ctx) + daisy(140, -60, 26, 8, ctx);
    s += limb([[60, 75], [100, 95], [125, 90]], 22, 20) + C(128, 88, 18);
    // head
    s += antenna(-25, -150, -60, -195, -8, 9, ctx) + antenna(25, -150, 60, -195, 8, 9, ctx);
    s += C(0, -90, 72);
    s += eye(-26, -98, 17) + eye(26, -98, 17) + smile(0, -58, 40, 0.45) + rosy(-50, -66, 11, ctx) + rosy(50, -66, 11, ctx);
    return s;
  }
  // style 3: flying over a flower
  s += curve('M0 200C-10 160 12 130 0 90') + leaf(-3, 175, 70, 205, ctx) + leaf(3, 150, 65, -30, ctx);
  s += daisy(0, 85, 50, 10, ctx);
  let f = '';
  const wingM = g(E(0, 0, 48, 110) + curve('M0 -95Q-10 0 0 95', ctx.thin), 'translate(-75 40) rotate(40)');
  f += wingM + mirrorX(wingM);
  for (const y of [-30, 25, 75]) f += mirrorX(limb([[60, y], [92, y + 4], [104, y + 20]], 18, 16)) + limb([[60, y], [92, y + 4], [104, y + 20]], 18, 16);
  f += E(0, 20, 70, 95);
  const half = P('M-3 -78A112 112 0 0 0 -110 20A112 108 0 0 0 -3 125Z') + C(-50, -20, 19) + C(-65, 50, 16) + C(-28, 88, 13);
  f += g(half, 'rotate(28 -3 -78)') + mirrorX(g(half, 'rotate(28 -3 -78)'));
  f += antenna(-18, -125, -48, -175, -8, 9, ctx) + antenna(18, -125, 48, -175, 8, 9, ctx);
  f += C(0, -105, 50) + eye(-18, -112, 13) + eye(18, -112, 13) + smile(0, -86, 24, 0.45);
  s += g(f, 'translate(0 -72) scale(0.68)');
  return s;
}

// ---- Bee ----
function beeSide(ctx, opts = {}) {
  let s = '';
  s += g(E(0, 0, 44, 84), 'translate(-25 -112) rotate(-22)') + g(E(0, 0, 40, 78), 'translate(32 -116) rotate(16)');
  s += curve('M-14 -60Q-32 -110 -50 -160M30 -64Q38 -110 46 -158', ctx.thin);
  s += limb([[-45, 90], [-55, 125], [-48, 145]], 13, 11) + limb([[0, 100], [0, 135], [8, 152]], 13, 11) + limb([[45, 92], [55, 125], [68, 140]], 13, 11);
  s += poly([[-100, 8], [-152, 26], [-100, 44]]);
  s += E(0, 22, 115, 90);
  s += bands(0, 22, 115, 90, [[-82, -50], [-18, 14]], 12);
  s += antenna(100, -78, 80, -138, -20, 9, ctx) + antenna(138, -80, 160, -134, 8, 9, ctx);
  s += C(115, -12, 70);
  s += eye(96, -28, 15, [0.35, 0]) + eye(140, -28, 15, [0.35, 0]) + smile(122, 8, 36, 0.45) + rosy(80, 4, 9, ctx) + rosy(165, 2, 8, ctx);
  return s;
}

function bee(style, rand, ctx) {
  if (style === 0) {
    let s = beeSide(ctx);
    s += curve('M-160 -10q-30 -40 -10 -70q25 -30 25 10q0 40 -40 70', 'stroke-dasharray="14 16"');
    return g(s, 'translate(14 10)');
  }
  if (style === 1) { // front view, waving
    let s = '';
    const wing = g(E(0, 0, 78, 52), 'translate(-118 -40) rotate(-28)') + curve('M-70 -20Q-120 -40 -165 -70', ctx.thin);
    s += wing + mirrorX(wing);
    s += poly([[-16, 168], [0, 198], [16, 168]]);
    s += limb([[-100, 50], [-140, 10], [-150, -30]], 24, 20) + C(-150, -40, 17);
    s += limb([[100, 60], [140, 95], [160, 120]], 24, 20) + C(165, 128, 17);
    s += E(0, 65, 112, 112);
    s += bands(0, 65, 112, 112, [[20, 52], [92, 124]], 14, true);
    s += antenna(-30, -140, -65, -185, -10, 10, ctx) + antenna(30, -140, 65, -185, 10, 10, ctx);
    s += C(0, -72, 80);
    s += eye(-28, -82, 18) + eye(28, -82, 18) + smile(0, -42, 44, 0.45) + rosy(-55, -48, 12, ctx) + rosy(55, -48, 12, ctx);
    return s;
  }
  // style 2: carrying a honey pot
  let s = '';
  s += line(-30, 10, -62, 82, ctx.thin) + line(28, 12, 66, 82, ctx.thin);
  s += g(beeSide(ctx), 'translate(0 -72) scale(0.62)');
  s += blob([[-70, 100], [-108, 140], [-100, 186], [0, 199], [100, 186], [108, 140], [70, 100]]);
  s += R(-80, 76, 160, 28, 12);
  s += P('M-72 76Q-70 52 0 48Q70 52 72 76Q72 92 62 92Q54 116 44 92Q30 92 24 104Q14 124 4 100Q-10 92 -22 92Q-32 118 -44 92Q-72 92 -72 76Z');
  s += heart(0, 150, 46);
  return s;
}

// ---- Snail ----
function spiral(cx, cy, rmax, turns, start = 0, attrs = '') {
  const pts = [], n = Math.round(turns * 18);
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = start + t * turns * Math.PI * 2, r = rmax * (0.12 + 0.88 * t);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return smooth(pts, attrs);
}
function crescentShell(cx, cy, r0) {
  let s = C(cx, cy, r0), c = [cx, cy], r = r0, ang = 90;
  for (const k of [0.78, 0.6, 0.44, 0.3, 0.17]) {
    const rn = r0 * k, d = [Math.cos(rad(ang)), Math.sin(rad(ang))];
    c = [c[0] + (r - rn) * d[0], c[1] + (r - rn) * d[1]];
    r = rn; ang -= 90;
    s += C(c[0], c[1], r);
  }
  return s;
}
function snailBody(ctx, shell = 'spiral', look = [0.3, 0], happy = true) {
  let s = '';
  s += limb([[132, -5], [118, -60], [110, -98]], 15, 12) + limb([[166, -5], [178, -55], [186, -92]], 15, 12);
  s += blob([[-190, 196], [-178, 176], [-60, 168], [70, 158], [108, 110], [112, 30], [135, -12], [175, -10], [198, 30], [196, 120], [178, 185], [140, 199], [0, 200]]);
  s += C(110, -104, 20) + dark(C(110 + look[0] * 7, -104 + look[1] * 7, 10)) + C(186, -98, 20) + dark(C(186 + look[0] * 7, -98 + look[1] * 7, 10));
  if (happy) s += smile(156, 50, 38, 0.45) + rosy(130, 40, 10, ctx) + rosy(186, 38, 9, ctx);
  if (shell === 'spiral') s += C(-40, 40, 128) + spiral(-40, 40, 108, 2.3, Math.PI * 0.5);
  else s += crescentShell(-40, 40, 128);
  return s;
}
function snail(style, rand, ctx) {
  if (style === 0) return snailBody(ctx, 'spiral');
  if (style === 1) {
    let s = snailBody(ctx, 'crescent', [0, -0.4]);
    s += curve('M-60 -86Q-66 -120 -55 -150') + leaf(-60, -110, 40, 200, ctx) + daisy(-55, -165, 24, 7, ctx);
    return s;
  }
  if (style === 2) { // mother and baby
    let s = g(snailBody(ctx, 'spiral'), 'translate(-55 50) scale(0.75)');
    s += g(snailBody(ctx, 'crescent', [-0.4, -0.2]), 'translate(128 140) scale(0.3)');
    return s;
  }
  // style 3: under a mushroom
  let s = '';
  s += P('M-150 200Q-140 60 -120 -20L-60 -20Q-45 60 -40 200Z');
  s += P('M-200 -10Q-205 -140 -90 -165Q30 -150 30 -10Q-85 10 -200 -10Z');
  s += C(-140, -90, 22) + C(-60, -115, 18) + C(-20, -50, 15) + C(-110, -40, 13);
  s += g(snailBody(ctx, 'spiral', [-0.3, -0.4]), 'translate(70 60) scale(0.7)');
  return s;
}

// ---- Caterpillar ----
function catHead(x, y, r, ctx, opts = {}) {
  let s = antenna(x - r * 0.35, y - r * 0.85, x - r * 0.7, y - r * 1.65, -10, r * 0.14, ctx) + antenna(x + r * 0.3, y - r * 0.88, x + r * 0.6, y - r * 1.7, 8, r * 0.14, ctx);
  s += C(x, y, r);
  const L = opts.look || [0.3, 0];
  if (opts.sleep) s += closedEye(x - r * 0.3, y - r * 0.15, r * 0.2, ctx) + closedEye(x + r * 0.32, y - r * 0.15, r * 0.2, ctx);
  else s += eye(x - r * 0.28, y - r * 0.18, r * 0.24, L) + eye(x + r * 0.32, y - r * 0.18, r * 0.24, L);
  if (opts.munch) s += C(x + r * 0.1, y + r * 0.45, r * 0.18);
  else s += smile(x + r * 0.03, y + r * 0.35, r * 0.6, 0.45);
  s += rosy(x - r * 0.6, y + r * 0.25, r * 0.15, ctx) + rosy(x + r * 0.65, y + r * 0.25, r * 0.13, ctx);
  return s;
}
function segs(pts, r0, r1v, ctx, feet = true, ground = 200) {
  let s = '';
  pts.forEach(([x, y], i) => {
    const r = lerp(r0, r1v, i / Math.max(1, pts.length - 1));
    if (feet && y + r > ground - 40) s += limb([[x - 4, y + r * 0.6], [x - 2, ground - 8]], 14, 16);
  });
  pts.forEach(([x, y], i) => {
    const r = lerp(r0, r1v, i / Math.max(1, pts.length - 1));
    s += C(x, y, r);
  });
  return s;
}
function caterpillar(style, rand, ctx) {
  if (style === 0) {
    const pts = [];
    for (let i = 0; i < 7; i++) { const x = -165 + i * 44; pts.push([x, 150 - 34 * Math.max(0, Math.sin((i / 6) * Math.PI * 1.6 + 0.4))]); }
    let s = segs(pts, 36, 44, ctx);
    for (const [x, y] of pts.slice(1)) s += C(x, y - 6, 9, ctx.thin);
    s += catHead(130, 55, 66, ctx);
    return s;
  }
  if (style === 1) { // munching a leaf
    let s = '';
    const bites = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = Math.PI * 2 * t;
      let x = Math.cos(a) * 195, y = Math.sin(a) * 92;
      const bite = (ta, depth, width) => { const d = Math.abs(((t - ta + 1.5) % 1) - 0.5); if (d < width) { const k = Math.sqrt(1 - (d / width) ** 2) * depth; x *= 1 - k; y *= 1 - k; } };
      bite(0.86, 0.22, 0.035); bite(0.92, 0.18, 0.03);
      bites.push([x, y + 102]);
    }
    s += blob(bites);
    s += curve('M-185 102Q0 92 175 100', ctx.thin);
    for (const x of [-120, -40, 40, 110]) s += curve(`M${x} 100Q${x + 30} 70 ${x + 55} 40M${x} 102Q${x + 30} 132 ${x + 55} 160`, ctx.thin);
    const pts = [];
    for (let i = 0; i < 6; i++) pts.push([-150 + i * 42, 40 - 30 * Math.sin((i / 5) * Math.PI)]);
    s += segs(pts, 34, 40, ctx, false);
    s += catHead(105, -20, 60, ctx, { munch: true, look: [0.4, 0.4] });
    return s;
  }
  if (style === 2) { // peeking out of an apple
    let s = '';
    s += curve('M0 -120Q5 -160 25 -180') + leaf(10, -150, 80, -30, ctx);
    s += blob([[0, -120], [80, -150], [170, -90], [185, 30], [130, 170], [40, 196], [0, 182], [-40, 196], [-130, 170], [-185, 30], [-170, -90], [-80, -150]]);
    s += curve('M-120 -40Q-140 30 -110 100', ctx.thin);
    s += E(70, 20, 48, 40);
    s += C(80, 5, 34) + C(105, -35, 38);
    s += catHead(130, -95, 58, ctx, { look: [-0.2, 0] });
    return s;
  }
  // style 3: standing up tall, waving
  const pts = [[-150, 165], [-105, 168], [-60, 160], [-20, 140], [5, 100], [15, 55], [10, 10], [0, -30]];
  let s = segs(pts, 34, 42, ctx);
  s += limb([[15, 20], [70, 0], [100, -30]], 16, 14) + C(105, -38, 14);
  s += limb([[-20, 30], [-60, 10], [-80, -10]], 16, 14) + C(-85, -16, 14);
  s += catHead(0, -100, 68, ctx, { look: [0, 0.1] });
  return s;
}

// ---- Dragonfly ----
function dragonTop(ctx) {
  let s = '';
  const wing = (cx, cy, rx, ry, a) => g(E(0, 0, rx, ry) + curve(`M${-rx * 0.85} 0Q0 ${-ry * 0.25} ${rx * 0.85} 0`, ctx.thin) + curve(`M${-rx * 0.4} ${ry * 0.1}Q${rx * 0.1} ${ry * 0.55} ${rx * 0.6} ${ry * 0.3}`, ctx.thin) + E(rx * 0.72, -ry * 0.25, 13, 7, ctx.thin), `translate(${cx} ${cy}) rotate(${a})`);
  const wings = wing(102, -92, 96, 30, -14) + wing(98, -28, 90, 28, 14);
  s += wings + mirrorX(wings);
  // tail segments
  for (let i = 0; i < 7; i++) { const y = -35 + i * 31, w = lerp(30, 20, i / 6); s += R(-w / 2, y, w, 32, 9); }
  s += E(0, -66, 30, 36);
  s += E(0, -108, 40, 32);
  s += C(-28, -132, 27) + C(28, -132, 27);
  s += dark(C(-24, -128, 12)) + C(-28, -133, 4, 'fill="#fff" stroke="none"') + dark(C(24, -128, 12)) + C(20, -133, 4, 'fill="#fff" stroke="none"');
  s += smile(0, -96, 22, 0.45);
  return s;
}
function dragonfly(style, rand, ctx) {
  if (style === 0) return g(dragonTop(ctx), 'translate(0 -5)');
  if (style === 1) { // side view, flying
    let s = '';
    const wing = (x, y, a, rx = 110, ry = 32) => g(E(0, 0, rx, ry) + curve(`M${-rx * 0.85} 0Q0 ${-ry * 0.25} ${rx * 0.85} 0`, ctx.thin) + E(rx * 0.72, -ry * 0.2, 12, 7, ctx.thin), `translate(${x} ${y}) rotate(${a})`);
    s += wing(38, -82, -78, 112, 32);
    s += limb([[70, 25], [60, 60], [75, 80]], 10, 9) + limb([[95, 25], [95, 62], [110, 78]], 10, 9);
    for (let i = 0; i < 7; i++) { const x = 25 - (i + 1) * 30, w = lerp(30, 20, i / 6); s += R(x, 5 - w / 2 + i * 2, 32, w, 9); }
    s += E(65, 5, 45, 35);
    s += wing(88, -86, -62, 112, 34);
    s += C(140, -15, 48);
    s += C(150, -40, 26) + dark(C(156, -40, 12)) + C(152, -45, 4, 'fill="#fff" stroke="none"');
    s += smile(150, 10, 30, 0.45) + rosy(118, 0, 9, ctx);
    return g(s, 'translate(0 40)');
  }
  // style 2: chubby dragonfly with spotted wings, flying up and to the side
  let s = '';
  const wing = (cx, cy, rx, ry, a, spots) => {
    let w = E(0, 0, rx, ry);
    for (const [x, y, r] of spots) w += C(x, y, r);
    return g(w, `translate(${cx} ${cy}) rotate(${a})`);
  };
  const ws = wing(-100, -50, 92, 46, 20, [[-30, 0, 16], [20, -10, 12], [50, 12, 10]]) + wing(-95, 35, 82, 40, -15, [[-25, 0, 14], [25, 5, 11]]);
  s += ws + mirrorX(ws);
  s += limb([[0, 80], [0, 140], [-15, 178], [-30, 190]], 34, 20);
  s += curve('M-15 110Q0 118 15 110M-14 140Q0 148 14 140M-18 165Q-4 172 10 167', ctx.thin);
  s += E(0, 30, 40, 55);
  s += C(0, -70, 62);
  s += C(-34, -110, 30) + C(34, -110, 30) + dark(C(-30, -106, 13)) + dark(C(30, -106, 13)) + C(-34, -111, 4.5, 'fill="#fff" stroke="none"') + C(26, -111, 4.5, 'fill="#fff" stroke="none"');
  s += smile(0, -48, 40, 0.5) + rosy(-38, -55, 10, ctx) + rosy(38, -55, 10, ctx);
  return s;
}

// ---- Ant ----
function antSide(ctx, opts = {}) {
  let s = '';
  const legs = (dx, k = 1) => limb([[-20 + dx, 85], [-75 + dx, 135], [-95 + dx, 198 - (1 - k) * 60]], 17, 15) + limb([[0 + dx, 90], [-5 + dx, 145], [5 + dx, 198 - (1 - k) * 60]], 17, 15) + limb([[20 + dx, 85], [65 + dx, 135], [85 + dx, 198 - (1 - k) * 60]], 17, 15);
  s += E(-115, 75, 72, 58);
  s += curve('M-150 30Q-130 75 -150 120M-110 22Q-90 75 -108 130', ctx.thin);
  s += legs(0);
  s += E(-38, 88, 18, 14);
  s += E(5, 80, 48, 28);
  if (!opts.noAntennae) s += antenna(95, -20, 70, -100, -20, 10, ctx) + antenna(125, -18, 155, -95, 10, 10, ctx);
  s += C(105, 35, 62);
  s += eye(88, 22, 15, opts.look || [0.3, 0]) + eye(128, 22, 15, opts.look || [0.3, 0]) + smile(112, 58, 36, 0.45) + rosy(75, 50, 10, ctx) + rosy(150, 48, 9, ctx);
  return s;
}
function ant(style, rand, ctx) {
  if (style === 0) return antSide(ctx);
  if (style === 1) { // carrying a leaf
    let s = g(antSide(ctx, { look: [0.1, -0.4] }), 'translate(0 25) scale(0.85)');
    s += limb([[20, 80], [40, 20], [30, -50]], 12, 10);
    s += line(30, -40, 15, -100, ctx.thin);
    s += g(blob([[0, 0], [-90, -40], [-170, -10], [-60, 30]]) + curve('M-10 2Q-90 -8 -160 -8', ctx.thin), 'translate(30 -100) rotate(12)');
    s += g(blob([[0, 0], [70, -50], [170, -40], [80, 20]]) + curve('M5 -2Q80 -25 160 -38', ctx.thin), 'translate(15 -100) rotate(-5)');
    return s;
  }
  if (style === 2) { // carrying a strawberry on its back
    let s = antSide(ctx, { look: [0.2, -0.2] });
    s = g(s, 'scale(0.9) translate(0 22)');
    let b = blob([[-150, -40], [-80, -95], [10, -90], [60, -55], [30, 20], [-40, 60], [-120, 30], [-160, -5]]);
    for (const [x, y] of [[-110, -40], [-60, -55], [-10, -45], [-80, -5], [-30, 0], [10, -15], [-120, 0], [-50, 30]]) b += E(x, y, 4, 7, ctx.thin);
    b += P('M-100 -85L-80 -120L-60 -92L-40 -125L-20 -88L5 -110L-5 -78Z');
    s += g(b, 'translate(15 -10) rotate(-8)');
    s += limb([[0, 80], [-10, 30], [-25, 0]], 12, 10);
    return s;
  }
  // style 3: standing up, waving, holding a flower
  let s = '';
  s += limb([[-30, 110], [-55, 160], [-60, 196]], 16, 14) + limb([[30, 110], [55, 160], [60, 196]], 16, 14);
  s += E(-62, 194, 22, 8) + E(62, 194, 22, 8);
  s += E(0, 105, 70, 80);
  s += curve('M-55 80Q0 100 55 80M-60 120Q0 140 60 120', ctx.thin);
  s += limb([[-25, 0], [-75, 10], [-95, 40]], 14, 12);
  s += limb([[25, 0], [75, 10], [95, 40]], 14, 12);
  s += E(0, 5, 36, 42);
  s += limb([[-25, -20], [-90, -50], [-120, -100]], 15, 13) + C(-124, -110, 13);
  s += curve('M110 30Q118 -40 104 -90') + leaf(112, -20, 40, -50, ctx) + daisy(104, -110, 26, 8, ctx);
  s += limb([[25, -20], [80, -10], [108, 2]], 15, 13) + C(112, 5, 13);
  s += antenna(-25, -125, -55, -190, -10, 10, ctx) + antenna(25, -125, 55, -190, 10, 10, ctx);
  s += C(0, -72, 62);
  s += eye(-22, -80, 16) + eye(22, -80, 16) + smile(0, -45, 36, 0.45) + rosy(-44, -52, 10, ctx) + rosy(44, -52, 10, ctx);
  return s;
}

// ---- Firefly ----
function glow(cx, cy, r, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, k = i % 2 ? 0.9 : 1.04; pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]); }
  return blob(pts);
}
function fireflySide(ctx, opts = {}) {
  let s = '';
  // glow
  s += glow(-115, 40, 80, 11);
  for (let i = 0; i < 7; i++) { const a = rad(110 + i * 30); s += line(-115 + Math.cos(a) * 98, 40 + Math.sin(a) * 98, -115 + Math.cos(a) * 120, 40 + Math.sin(a) * 120, ctx.thin); }
  // wings
  s += g(E(0, 0, 40, 92) + curve('M0 -80Q-8 0 0 80', ctx.thin), 'translate(-5 -80) rotate(-28)');
  s += g(E(0, 0, 36, 84) + curve('M0 -72Q8 0 0 72', ctx.thin), 'translate(50 -78) rotate(18)');
  s += limb([[0, 70], [-5, 110], [8, 128]], 12, 10) + limb([[40, 68], [45, 105], [60, 118]], 12, 10);
  s += E(-60, 40, 100, 45);
  s += P('M-110 1Q-128 40 -110 79A100 45 0 0 1 -110 1Z');
  s += curve('M-70 3Q-84 40 -70 77M-30 0Q-44 40 -30 80', ctx.thin);
  s += g(E(0, 0, 70, 30), 'translate(5 0) rotate(-8)');
  s += antenna(85, -40, 60, -110, -15, 9, ctx) + antenna(110, -40, 138, -102, 8, 9, ctx);
  s += C(95, 5, 55);
  if (opts.sleep) s += closedEye(80, 0, 10, ctx) + closedEye(115, 0, 10, ctx) + smile(98, 26, 22, 0.35);
  else s += eye(80, -5, 13, [0.3, 0]) + eye(115, -5, 13, [0.3, 0]) + smile(98, 24, 28, 0.45);
  s += rosy(70, 20, 8, ctx) + rosy(130, 18, 7, ctx);
  return s;
}
function firefly(style, rand, ctx) {
  if (style === 0) return g(fireflySide(ctx), 'translate(30 10)');
  if (style === 1) { // front view with a glowing tail
    let s = '';
    s += glow(0, 118, 82, 12);
    for (let i = 0; i < 7; i++) { const a = rad(-10 + i * 33); s += line(Math.cos(a) * 98, 118 + Math.sin(a) * 98, Math.cos(a) * 120, 118 + Math.sin(a) * 120, ctx.thin); }
    const w = g(E(0, 0, 44, 100) + curve('M0 -88Q-8 0 0 88', ctx.thin), 'translate(-85 -40) rotate(-38)');
    s += w + mirrorX(w);
    s += limb([[-45, 30], [-95, 50], [-120, 20]], 15, 13) + limb([[45, 30], [95, 50], [120, 20]], 15, 13);
    s += E(0, 55, 60, 90);
    s += P('M-55 88Q0 108 55 88A60 90 0 0 1 -55 88Z');
    s += curve('M-58 30Q0 48 58 30', ctx.thin);
    s += antenna(-25, -140, -60, -192, -8, 9, ctx) + antenna(25, -140, 60, -192, 8, 9, ctx);
    s += C(0, -78, 68);
    s += eye(-24, -86, 16) + eye(24, -86, 16) + smile(0, -50, 36, 0.45) + rosy(-46, -55, 10, ctx) + rosy(46, -55, 10, ctx);
    return s;
  }
  // style 2: asleep on the moon
  let s = '';
  s += P('M-165 -50A170 170 0 1 0 165 -50A175.6 175.6 0 0 1 -165 -50Z');
  s += closedEye(-90, 98, 13, ctx) + closedEye(-40, 112, 13, ctx) + smile(-58, 130, 22, 0.4) + rosy(-110, 120, 9, ctx);
  s += g(fireflySide(ctx, { sleep: true }), 'translate(30 -40) scale(0.78)');
  s += star(-150, -150, 26, 11) + star(140, -170, 20, 9) + star(-80, -185, 14, 6);
  return s;
}

const BUGS = {
  id: 'bugs', name: 'Bugs and minibeasts', order: 17,
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'garden', 'hills', 'forest', 'rain'],
  pairScenes: ['meadow', 'garden'],
  icon: 'butterfly',
  kind: 'ground',
  subjects: [
    { id: 'butterfly', name: 'Butterfly', styles: 5, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'meadow', 'garden', 'hills', 'sky', 'forest'], draw: butterfly },
    { id: 'ladybug', name: 'Ladybug', styles: 4, draw: ladybug },
    { id: 'bee', name: 'Bee', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'meadow', 'garden', 'hills', 'sky'], draw: bee },
    { id: 'snail', name: 'Snail', styles: 4, scenes: ['plain', 'hearts', 'stars', 'garden', 'rain', 'meadow', 'forest', 'hills'], draw: snail },
    { id: 'caterpillar', name: 'Caterpillar', styles: 4, draw: caterpillar },
    { id: 'dragonfly', name: 'Dragonfly', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'pond', 'meadow', 'sky', 'hills'], draw: dragonfly },
    { id: 'ant', name: 'Ant', styles: 4, draw: ant },
    { id: 'firefly', name: 'Firefly', styles: 3, kind: 'float', scenes: ['plain', 'stars', 'hearts', 'night', 'forest'], draw: firefly },
  ],
};


// =====================================================================================
// DINOSAURS (friendly)
// =====================================================================================

/** A rounded horn or spike: base centre (x,y), pointing at angle a (degrees), length len, base width w. */
function horn(x, y, len, a, w) {
  return g(P(`M0 ${r1(-w / 2)}Q${r1(len * 0.55)} ${r1(-w * 0.4)} ${r1(len)} 0Q${r1(len * 0.55)} ${r1(w * 0.4)} 0 ${r1(w / 2)}Z`), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
}
/** A stout dinosaur leg standing on the ground, with toenails. */
function column(x, top, w, ctx, ground = 200) {
  let s = P(`M${r1(x)} ${r1(top)}L${r1(x)} ${r1(ground - 14)}Q${r1(x)} ${r1(ground)} ${r1(x + 14)} ${r1(ground)}L${r1(x + w - 14)} ${r1(ground)}Q${r1(x + w)} ${r1(ground)} ${r1(x + w)} ${r1(ground - 14)}L${r1(x + w)} ${r1(top)}Z`);
  const n = 3, tw = w / (n + 0.6);
  for (let i = 0; i < n; i++) { const cx = x + w * 0.2 + i * tw + tw / 2 - 2; s += curve(`M${r1(cx - tw * 0.4)} ${r1(ground)}Q${r1(cx - tw * 0.4)} ${r1(ground - tw * 0.55)} ${r1(cx)} ${r1(ground - tw * 0.55)}Q${r1(cx + tw * 0.4)} ${r1(ground - tw * 0.55)} ${r1(cx + tw * 0.4)} ${r1(ground)}`, ctx.thin); }
  return s;
}
const spots = (list) => list.map(([x, y, r]) => C(x, y, r)).join('');
function scallop(cx, cy, r, n, depth = 0.08, a0 = 0) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) { const a = a0 + (i / (n * 2)) * Math.PI * 2, k = i % 2 ? 1 - depth : 1 + depth * 0.3; pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]); }
  return blob(pts);
}

// ---- T. rex ----
function trexFoot(x, ctx, y = 200) {
  return blob([[x - 34, y], [x - 36, y - 22], [x + 10, y - 30], [x + 48, y - 20], [x + 58, y - 4], [x + 50, y]]) +
    curve(`M${x + 18} ${y}Q${x + 20} ${y - 10} ${x + 14} ${y - 18}M${x + 36} ${y}Q${x + 38} ${y - 8} ${x + 34} ${y - 14}`, ctx.thin);
}
function trex(ctx, o = {}) {
  let s = '';
  const pose = o.pose || 'stand';
  // far leg
  s += limb([[-5, 80], [10, 140], [15, 180]], 44, 36) + trexFoot(15, ctx, 200);
  // body, tail and neck
  s += blob([[-198, 112], [-150, 58], [-95, 8], [-35, -22], [15, -42], [45, -72], [62, -108], [112, -72], [100, -30], [100, 25], [80, 92], [20, 126], [-50, 118], [-110, 100], [-165, 112]]);
  // belly with stripes
  s += blob([[96, -45], [104, 5], [90, 68], [48, 112], [28, 106], [62, 60], [76, 0], [80, -45]]);
  s += curve('M80 -20L101 -18M76 15L102 18M68 50L95 56M50 82L76 92', ctx.thin);
  s += spots([[-45, 10, 15], [5, -15, 11], [-100, 50, 13], [-150, 85, 9], [-5, 30, 9]]);
  // arms
  if (o.arms === 'up') s += limb([[85, 20], [118, 0], [130, -25]], 18, 15) + limb([[95, 30], [128, 12], [145, -8]], 18, 15);
  else s += limb([[88, 25], [118, 42], [132, 30]], 18, 15);
  // near leg
  if (pose === 'ball') {
    s += C(132, 162, 38) + curve('M100 140Q132 150 166 140M98 182Q132 172 168 184', ctx.thin) + curve('M132 124Q120 162 132 200', ctx.thin);
    s += E(-20, 70, 58, 70) + limb([[-5, 110], [50, 120], [85, 118]], 42, 36) + g(trexFoot(0, ctx, 0), 'translate(96 132) rotate(-20)');
  } else {
    s += E(-30, 72, 58, 72) + limb([[-25, 115], [-15, 150], [-10, 180]], 44, 38) + trexFoot(-10, ctx, 200);
  }
  // head
  if (o.mouth === 'open') {
    s += blob([[50, -120], [65, -165], [110, -185], [165, -178], [196, -150], [198, -115], [182, -82], [130, -72], [80, -80]]);
    s += P('M108 -116Q150 -108 194 -126Q192 -88 158 -84Q122 -88 108 -116Z');
    s += P('M128 -91Q146 -108 170 -90Q150 -82 128 -91Z');
    s += eye(115, -145, 17, [0.3, -0.2]) + dark(E(182, -150, 4, 3)) + rosy(150, -125, 10, ctx);
  } else {
    s += blob([[50, -120], [65, -165], [110, -185], [165, -178], [196, -150], [198, -118], [180, -98], [130, -90], [80, -88]]);
    s += curve('M190 -114Q160 -98 118 -108') + curve('M123 -112Q115 -106 118 -100', ctx.thin);
    s += eye(115, -145, 17, [0.3, 0]) + dark(E(182, -150, 4, 3)) + rosy(145, -122, 10, ctx);
  }
  return s;
}
function tRex(style, rand, ctx) {
  if (style === 0) return trex(ctx);
  if (style === 1) return trex(ctx, { mouth: 'open', arms: 'up' });
  return trex(ctx, { pose: 'ball' });
}

// ---- Long neck (brachiosaurus-style) ----
function brachio(ctx, o = {}) {
  let s = '';
  if (o.lying) {
    s += limb([[-90, 150], [-150, 175], [-198, 185]], 60, 14);
    s += E(-10, 135, 130, 66);
    s += spots([[-60, 110, 16], [0, 100, 12], [-100, 140, 11], [40, 130, 10]]);
    s += E(-70, 186, 50, 16) + E(70, 186, 50, 16);
    s += limb([[80, 120], [125, 60], [120, -20], [135, -70]], 66, 44);
    s += curve('M140 40Q120 45 105 40M150 0Q130 5 112 -2', ctx.thin);
  } else {
    s += limb([[-80, 60], [-150, 92], [-198, 122]], 70, 14);
    s += column(-90, 80, 42, ctx, 196) + column(25, 80, 42, ctx, 196);
    s += column(-68, 95, 46, ctx) + column(45, 90, 46, ctx);
    s += limb([[60, 30], [100, -40], [113, -115], [116, -150]], 72, 44);
    s += E(-10, 50, 125, 82);
    s += spots([[-60, 25, 17], [0, 10, 13], [-100, 65, 12], [40, 45, 11], [-30, 75, 9]]);
    s += curve('M98 -20Q115 -18 125 -28M100 -70Q115 -68 123 -78', ctx.thin);
  }
  const hy = o.lying ? 60 : 0;
  s += blob([[96, -168 + hy], [112, -195 + hy], [150, -197 + hy], [185, -178 + hy], [196, -155 + hy], [180, -137 + hy], [130, -132 + hy], [98, -145 + hy]]);
  if (o.sleep) s += closedEye(140, -170 + hy, 12, ctx);
  else s += eye(140, -172 + hy, 13, [0.3, 0]);
  s += curve(`M190 ${-150 + hy}Q172 ${-142 + hy} 156 ${-148 + hy}`) + dark(E(186, -170 + hy, 3.5, 2.5)) + rosy(160, -152 + hy, 8, ctx);
  if (o.leafInMouth) s += leaf(188, -150, 42, 60, ctx);
  return s;
}
function longNeck(style, rand, ctx) {
  if (style === 0) return brachio(ctx);
  if (style === 1) { // eating leaves from a tall tree
    let s = P('M128 200Q140 120 138 -90L178 -90Q174 120 192 200Z');
    s += scallop(150, -128, 70, 9, 0.1);
    s += curve('M128 -150q10 -8 20 0M160 -110q10 -8 20 0M158 -165q10 -8 20 0', ctx.thin);
    s += g(brachio(ctx, { leafInMouth: true }), 'translate(-28 0) scale(0.92) translate(0 17)');
    return s;
  }
  if (style === 2) { // mother and baby
    let s = g(brachio(ctx), 'translate(-42 46) scale(0.77)');
    s += g(mirrorX(brachio(ctx)), 'translate(140 124) scale(0.38)');
    return s;
  }
  // resting, asleep
  let s = brachio(ctx, { lying: true, sleep: true });
  s += g(butterfly(0, rand, ctx), 'translate(-80 -60) scale(0.3)');
  return s;
}

// ---- Triceratops ----
function trikeHead(ctx, x, y, o = {}) {
  let s = '';
  s += scallop(x - 32, y - 35, 92, 9, 0.1, 0.3);
  s += spots([[x - 75, y - 70, 14], [x - 40, y - 100, 12], [x - 95, y - 25, 11], [x - 20, y - 70, 9]]);
  s += horn(x - 5, y - 40, 82, -62, 26);
  s += blob([[x - 50, y - 30], [x, y - 52], [x + 50, y - 34], [x + 78, y + 2], [x + 70, y + 36], [x + 25, y + 52], [x - 30, y + 42], [x - 52, y + 8]]);
  s += horn(x + 18, y - 42, 86, -55, 28) + horn(x + 60, y - 22, 34, -70, 20);
  s += eye(x + 10, y - 10, 15, [0.3, 0]) + dark(E(x + 66, y + 4, 3.5, 2.5)) + rosy(x + 30, y + 20, 9, ctx);
  s += curve(`M${x + 74} ${y + 18}Q${x + 55} ${y + 34} ${x + 32} ${y + 28}`);
  return s;
}
function triceratops(style, rand, ctx) {
  if (style === 0 || style === 2) {
    const lying = style === 2;
    let s = '';
    if (lying) {
      s += limb([[-100, 150], [-160, 175], [-198, 186]], 56, 12);
      s += E(-30, 135, 125, 66);
      s += spots([[-70, 112, 15], [-10, 100, 12], [-110, 140, 11]]);
      s += E(-90, 186, 50, 15) + E(50, 186, 50, 15);
      s += trikeHead(ctx, 122, 105);
      s += g(butterfly(2, rand, ctx), 'translate(-40 -20) scale(0.32)');
      return s;
    }
    s += limb([[-100, 60], [-160, 92], [-198, 112]], 60, 12);
    s += column(-120, 90, 44, ctx, 196) + column(15, 90, 44, ctx, 196);
    s += column(-98, 105, 50, ctx) + column(32, 100, 50, ctx);
    s += E(-30, 70, 125, 86);
    s += spots([[-70, 35, 16], [-10, 20, 12], [-110, 75, 12], [-40, 85, 10]]);
    s += trikeHead(ctx, 112, 20);
    return s;
  }
  // style 1: front view, big friendly face
  let s = '';
  s += column(-115, 120, 62, ctx) + column(53, 120, 62, ctx);
  s += E(0, 105, 112, 62);
  s += scallop(0, -60, 138, 12, 0.07, -Math.PI / 2);
  for (let i = 0; i < 7; i++) { const a = rad(-180 + 15 + i * 25); s += C(Math.cos(a) * 112, -60 + Math.sin(a) * 112, 14); }
  s += horn(-48, -95, 85, -118, 30) + horn(48, -95, 85, -62, 30);
  s += blob([[-85, -50], [-70, -105], [0, -122], [70, -105], [85, -50], [70, 20], [0, 50], [-70, 20]]);
  s += E(0, 40, 62, 44);
  s += horn(0, 6, 46, -90, 30);
  s += eye(-36, -55, 19) + eye(36, -55, 19) + dark(E(-15, 34, 5, 4)) + dark(E(15, 34, 5, 4)) + smile(0, 56, 50, 0.35) + rosy(-58, -12, 11, ctx) + rosy(58, -12, 11, ctx);
  return s;
}

// ---- Stegosaurus ----
function stego(ctx, o = {}) {
  let s = '';
  const plate = (x, y, h, a) => g(blob([[-h * 0.42, 0], [-h * 0.3, -h * 0.55], [0, -h], [h * 0.3, -h * 0.55], [h * 0.42, 0]]), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
  const cx = -20, cy = 70, rx = 135, ry = 88;
  const onBack = (t) => { const a = rad(lerp(200, 340, t)); return [cx + Math.cos(a) * rx * 0.92, cy + Math.sin(a) * ry * 0.92, lerp(-55, 55, t)]; };
  for (let i = 0; i < 5; i++) { const [x, y, a] = onBack((i + 0.5) / 5.2 + 0.04); s += plate(x + 10, y - 2, lerp(70, 100, Math.sin(Math.PI * (i + 0.5) / 5)), a); }
  for (let i = 0; i < 6; i++) { const [x, y, a] = onBack(i / 5.2 + 0.04); s += plate(x, y, lerp(60, 92, Math.sin(Math.PI * (i + 0.3) / 6)), a); }
  // tail with friendly spikes
  s += horn(-178, 62, 52, -150, 18) + horn(-172, 54, 54, -118, 18) + horn(-190, 80, 46, 175, 16);
  s += limb([[-110, 90], [-160, 80], [-190, 60]], 60, 22);
  s += column(-115, 100, 44, ctx, 196) + column(25, 105, 42, ctx, 196);
  s += column(-92, 115, 50, ctx) + column(42, 115, 46, ctx);
  s += E(cx, cy, rx, ry);
  s += o.stripes ? curve('M-80 0Q-95 70 -80 140M-20 -15Q-35 70 -20 155M40 -5Q25 70 40 145', ctx.thin) : spots([[-70, 50, 16], [-10, 30, 13], [40, 65, 12], [-40, 100, 10], [-110, 85, 11]]);
  // neck and head
  const hx = o.headDown ? 150 : 145, hy = o.headDown ? 135 : 70;
  s += limb([[90, 60], [125, hy - 10]], 60, 46);
  s += blob([[hx - 35, hy - 20], [hx, hy - 38], [hx + 40, hy - 25], [hx + 52, hy], [hx + 40, hy + 20], [hx, hy + 26], [hx - 30, hy + 15]]);
  s += eye(hx + 4, hy - 10, 12, [0.3, 0]) + dark(E(hx + 45, hy - 6, 3, 2.5)) + rosy(hx + 22, hy + 8, 7, ctx);
  s += curve(`M${hx + 50} ${hy + 6}Q${hx + 38} ${hy + 18} ${hx + 24} ${hy + 14}`);
  return s;
}
function stegosaurus(style, rand, ctx) {
  if (style === 0) return stego(ctx);
  if (style === 1) { // munching a little fern
    let s = stego(ctx, { headDown: true, stripes: true });
    s += leaf(172, 200, 60, -80, ctx, 0.3) + leaf(185, 198, 50, -45, ctx, 0.3) + leaf(160, 198, 46, -120, ctx, 0.3);
    s = g(s, 'translate(0 10) scale(0.95)');
    return s;
  }
  // mother and baby
  let s = g(stego(ctx), 'translate(-62 56) scale(0.72)');
  s += g(mirrorX(stego(ctx)), 'translate(138 136) scale(0.32)');
  return s;
}

// ---- Flying reptile (pterosaur) ----
/** Head in profile facing right: long crest behind, long pointed beak in front. About -115..165 x, -60..35 y. */
function pteroHead(ctx, x, y, sc = 1, sleep = false) {
  let d = P('M-115 -62Q-62 -40 -22 -40Q12 -52 38 -28L160 0Q170 8 160 14L40 28Q2 44 -28 22Q-44 8 -42 -10Z');
  d += curve('M48 12Q100 14 150 7');
  d += sleep ? closedEye(2, -10, 11, ctx) : eye(2, -10, 14, [0.3, 0]);
  d += rosy(28, 4, 8, ctx) + dark(E(120, -4, 3, 2));
  return g(d, `translate(${r1(x)} ${r1(y)}) scale(${sc})`);
}
function pteroWing(ctx) {
  return P('M10 -10Q70 -70 118 -58L198 -8Q130 2 80 34Q50 52 18 48Z') + curve('M24 -8Q70 -45 115 -50L180 -12', ctx.thin) +
    limb([[116, -60], [124, -78], [134, -80]], 9, 8) + limb([[112, -58], [110, -78], [118, -86]], 9, 8);
}
function pteroBody(ctx) {
  let s = limb([[-14, 60], [-18, 92]], 16, 14) + limb([[14, 60], [18, 92]], 16, 14) + E(-22, 98, 16, 7) + E(22, 98, 16, 7);
  s += E(0, 15, 44, 60) + E(0, 25, 26, 38) + curve('M-24 15Q0 22 24 15M-24 40Q0 47 24 40', ctx.thin);
  return s;
}
function pterosaur(style, rand, ctx) {
  if (style === 0) { // soaring, wings spread wide
    const w = pteroWing(ctx);
    return g(w + mirrorX(w) + pteroBody(ctx) + pteroHead(ctx, 8, -62, 1.05), 'translate(0 25)');
  }
  if (style === 1) { // wings up, flapping
    const w = g(pteroWing(ctx), 'rotate(-48 10 0)');
    return g(w + mirrorX(w) + pteroBody(ctx) + pteroHead(ctx, 8, -60, 1.05), 'translate(0 60)');
  }
  // style 2: side view, gliding past
  let s = '';
  s += limb([[-110, 40], [-150, 52], [-172, 50]], 16, 13) + E(-180, 50, 14, 8) + limb([[-100, 50], [-140, 70], [-160, 72]], 16, 13) + E(-168, 74, 14, 8);
  s += P('M-30 10Q-10 -40 0 -60L-60 -20Q-90 10 -80 40Z');
  s += blob([[-130, 35], [-80, 5], [0, 0], [45, 15], [20, 55], [-60, 65], [-115, 55]]);
  s += curve('M-60 8Q-68 35 -60 62M-25 4Q-33 30 -25 58', ctx.thin);
  s += P('M-40 8Q-30 -55 -8 -112L-198 -160Q-150 -80 -118 30Z') + curve('M-35 -10Q-24 -60 -12 -100L-170 -148', ctx.thin) + limb([[-8, -112], [8, -126], [16, -120]], 9, 8);
  s += pteroHead(ctx, 40, -8, 0.88);
  return g(s, 'translate(10 45)');
}

// ---- Baby dinosaur hatching ----
function babyFace(x, y, r, ctx, o = {}) {
  let s = '';
  if (o.spikes !== false) for (const [dx, a, h] of [[-0.45, -120, 0.4], [0, -90, 0.48], [0.45, -60, 0.4]]) s += horn(x + dx * r, y - r * 0.82, r * h, a, r * 0.32);
  s += E(x, y, r, r * 0.88);
  s += eye(x - r * 0.38, y - r * 0.2, r * 0.24) + eye(x + r * 0.38, y - r * 0.2, r * 0.24);
  s += dark(E(x - r * 0.12, y + r * 0.22, r * 0.05, r * 0.04)) + dark(E(x + r * 0.12, y + r * 0.22, r * 0.05, r * 0.04));
  s += smile(x, y + r * 0.42, r * 0.7, 0.4) + rosy(x - r * 0.65, y + r * 0.25, r * 0.13, ctx) + rosy(x + r * 0.65, y + r * 0.25, r * 0.13, ctx);
  return s;
}
function zig(x0, x1, y, n, h) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([lerp(x0, x1, i / n), y + (i % 2 ? -h : 0)]);
  return pts;
}
function eggBottom(cx, cy, rx, ry, cutY, n = 8, h = 26) {
  const dy = cutY - cy, x = rx * Math.sqrt(1 - (dy / ry) ** 2);
  const z = zig(cx - x, cx + x, cutY, n, h);
  return P(`M${z.map(pt).join('L')}A${rx} ${ry} 0 1 1 ${pt([cx - x, cutY])}Z`);
}
function eggTop(cx, cy, rx, ry, cutY, n = 6, h = 22) {
  const dy = cutY - cy, x = rx * Math.sqrt(1 - (dy / ry) ** 2);
  const z = zig(cx - x, cx + x, cutY, n, -h);
  return P(`M${z.map(pt).join('L')}A${rx} ${ry} 0 0 0 ${pt([cx - x, cutY])}Z`);
}
function babyDino(style, rand, ctx) {
  if (style === 0) { // peeking out of the egg, shell on its head
    let s = '';
    s += blob([[-55, 60], [-60, -60], [0, -80], [60, -60], [55, 60]]);
    s += eggBottom(0, 40, 155, 160, -15, 8, 28);
    s += spots([[-90, 70, 18], [40, 110, 22], [90, 40, 13], [-30, 150, 12], [-20, 45, 10]]);
    s += E(-62, -20, 24, 18) + E(62, -20, 24, 18);
    s += babyFace(0, -95, 70, ctx, { spikes: false });
    s += g(eggTop(0, 0, 70, 80, 0, 6, 16), 'translate(18 -150) rotate(14)');
    return s;
  }
  if (style === 1) { // walking egg: feet and head poking out
    let s = '';
    s += limb([[-45, 150], [-50, 190]], 34, 32) + limb([[45, 150], [50, 190]], 34, 32);
    s += E(-55, 192, 30, 10) + E(55, 192, 30, 10);
    s += limb([[110, 80], [160, 60], [190, 30]], 34, 12);
    s += blob([[-40, -40], [-45, -110], [45, -110], [40, -40]]);
    s += babyFace(0, -125, 62, ctx);
    s += eggBottom(0, 50, 125, 145, -45, 8, 22);
    s += spots([[-60, 30, 16], [50, 90, 20], [-20, 130, 12], [70, 10, 11]]);
    s += limb([[-100, 40], [-140, 20], [-150, -5]], 24, 20);
    s += limb([[100, 40], [140, 55]], 24, 20);
    return s;
  }
  if (style === 2) { // nest of eggs, one hatching
    let s = '';
    s += E(-105, 50, 62, 78) + spots([[-120, 25, 13], [-85, 70, 11]]);
    s += E(108, 55, 60, 75) + spots([[95, 30, 12], [125, 80, 10]]);
    s += blob([[-30, 30], [-34, -50], [30, -50], [30, 30]]);
    s += babyFace(0, -82, 56, ctx);
    s += eggBottom(0, 50, 80, 100, -10, 6, 18);
    s += E(-36, -12, 15, 12) + E(36, -12, 15, 12);
    s += blob([[-198, 110], [-120, 95], [0, 100], [120, 95], [198, 110], [175, 175], [90, 200], [-90, 200], [-175, 175]]);
    s += curve('M-180 130Q-90 150 0 135T180 130M-160 160Q-80 178 0 165T160 160', ctx.thin);
    s += curve('M-150 112l30 30M-60 108l-25 40M40 108l30 35M130 110l-20 35M-110 170l30 22M70 168l-25 26', ctx.thin);
    return s;
  }
  // style 3: hatched, sitting by the broken shell, waving
  let s = '';
  s += limb([[40, 150], [110, 170], [160, 150], [180, 120]], 46, 12);
  s += E(-10, 105, 78, 85);
  s += E(-10, 125, 48, 55);
  s += curve('M-50 100Q-10 110 30 100M-55 135Q-10 145 35 135M-48 165Q-10 175 28 165', ctx.thin);
  s += E(-55, 188, 34, 13) + E(35, 188, 34, 13);
  s += limb([[-70, 60], [-115, 30], [-125, -5]], 24, 20) + C(-127, -12, 14);
  s += limb([[50, 60], [80, 85]], 24, 20);
  s += babyFace(-10, -25, 78, ctx);
  s += eggBottom(130, 160, 62, 70, 135, 5, 16) + g(eggTop(0, 0, 55, 64, 0, 4, 14), 'translate(-150 185) rotate(-160)');
  return s;
}

const DINOS = {
  id: 'dinosaurs', name: 'Dinosaurs', order: 18,
  scenes: ['plain', 'hearts', 'stars', 'hills', 'forest', 'meadow', 'night', 'party'],
  pairScenes: ['hills', 'meadow'],
  icon: 't-rex',
  kind: 'ground',
  subjects: [
    { id: 't-rex', name: 'T. rex', styles: 3, draw: tRex },
    { id: 'long-neck', name: 'Long neck dinosaur', styles: 4, draw: longNeck },
    { id: 'triceratops', name: 'Triceratops', styles: 3, draw: triceratops },
    { id: 'stegosaurus', name: 'Stegosaurus', styles: 3, draw: stegosaurus },
    { id: 'pterosaur', name: 'Flying reptile', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'sky', 'hills', 'meadow', 'night'], draw: pterosaur },
    { id: 'baby-dino', name: 'Baby dinosaur', styles: 4, draw: babyDino },
  ],
};

export default [BUGS, DINOS];
