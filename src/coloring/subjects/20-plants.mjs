// Flowers, trees and plants for the Yaanstep Sprouts coloring pages (SCRUM-515).
// Every shape here is drawn by this code. Nothing is traced or downloaded.
import { C, E, P, R, poly, curve, line, blob, smooth, smoothD, eye, dotEye, dark, smile, g, star, heart, ring, cloud, sun, littleFlower, mirrorX, rot, r1 } from '../lib.mjs';

// ---------------------------------------------------------------- small geometry helpers
const PI = Math.PI, D = PI / 180;
/** Move and scale an absolute path made only of x,y pairs (M L Q C S T). No transforms, so line weight stays even. */
const tps = (d, x, y, kx, ky) => d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (m, a, b) => `${r1(x + +a * kx)} ${r1(y + +b * ky)}`);
const tp = (d, x, y, k) => tps(d, x, y, k, k);
const mp = (pts, x, y, k) => pts.map(([a, b]) => [x + a * k, y + b * k]);
/** Rotate points about cx,cy. */
const rp = (pts, deg, cx = 0, cy = 0) => pts.map(([a, b]) => {
  const c = Math.cos(deg * D), s = Math.sin(deg * D);
  return [cx + (a - cx) * c - (b - cy) * s, cy + (a - cx) * s + (b - cy) * c];
});
const pathOf = (pts, close = true) => 'M' + pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L') + (close ? 'Z' : '');

/** Sample a Catmull-Rom line through pts. */
function cr(pts, per = 10) {
  const out = [], n = pts.length, at = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[n - 1]);
  return out;
}
/** A stem or trunk as a closed, colorable band along a smooth centre line. Width goes from w0 to w1. */
function tube(pts, w0, w1 = w0, a = '') {
  const s = cr(pts, 12), L = [], Rr = [];
  s.forEach((p, i) => {
    const q = s[Math.min(i + 1, s.length - 1)], o = s[Math.max(i - 1, 0)];
    const dx = q[0] - o[0], dy = q[1] - o[1], m = Math.hypot(dx, dy) || 1;
    const w = (w0 + ((w1 - w0) * i) / (s.length - 1)) / 2;
    L.push([p[0] - (dy / m) * w, p[1] + (dx / m) * w]);
    Rr.push([p[0] + (dy / m) * w, p[1] - (dx / m) * w]);
  });
  return P(pathOf([...L, ...Rr.reverse()]), a);
}
/** A point along a smooth line at fraction t. */
const along = (pts, t) => { const s = cr(pts, 12); return s[Math.min(s.length - 1, Math.round(t * (s.length - 1)))]; };

/**
 * A pointed leaf from its base at x,y towards angle ang (degrees, 0 = right, -90 = up).
 * o.teeth: serrated edge; o.veins: side veins per side; o.bend: how much the leaf curls (+ down).
 */
function leaf(x, y, len, wid, ang, ctx, o = {}) {
  const { teeth = 0, veins = 3, bend = 0, round = 0.8, base = 0 } = o;
  const n = teeth ? teeth * 2 : 9;
  const f = (t) => Math.pow(Math.sin(PI * Math.pow(t, round)), 0.9);
  const up = [], lo = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, bb = bend * len * t * t;
    let w = wid * f(t) + (t < 0.05 ? base : 0);
    const tw = teeth && i % 2 && i < n ? wid * 0.12 : 0;
    up.push([len * t, -w - tw + bb]);
    lo.push([len * t, w + tw + bb]);
  }
  const U = rp(up, ang).map(([a, b]) => [x + a, y + b]);
  const Lo = rp(lo, ang).map(([a, b]) => [x + a, y + b]).reverse();
  let d;
  if (teeth) d = pathOf([...U, ...Lo.slice(1)]);
  else d = smoothD(U, false) + smoothD(Lo, false).replace(/^M[^C]*/, '') + 'Z';
  let s = P(d);
  const mid = rp([0.04, 0.3, 0.6, 0.86].map((t) => [len * t, bend * len * t * t]), ang).map(([a, b]) => [x + a, y + b]);
  s += smooth(mid, ctx.thin);
  for (let i = 1; i <= veins; i++) {
    const t = 0.12 + (i / (veins + 1)) * 0.68;
    for (const sd of [-1, 1]) {
      const v = rp([[len * t, bend * len * t * t], [len * (t + 0.13), sd * wid * f(t + 0.1) * 0.62 + bend * len * (t + 0.13) ** 2]], ang).map(([a, b]) => [x + a, y + b]);
      s += line(v[0][0], v[0][1], v[1][0], v[1][1], ctx.hair);
    }
  }
  return s;
}
/** A long grass-like blade leaf (tulip, lily), from base x,y, curving to tip tx,ty. */
function blade(x, y, tx, ty, wid, side, ctx) {
  const mx = (x + tx) / 2 + side * wid * 1.2, my = (y + ty) / 2;
  const d = `M${r1(x - wid / 2)} ${r1(y)}Q${r1(mx - wid * 0.9)} ${r1(my)} ${r1(tx)} ${r1(ty)}Q${r1(mx + wid * 0.9)} ${r1(my + wid * 0.3)} ${r1(x + wid / 2)} ${r1(y)}Z`;
  return P(d) + curve(`M${r1(x)} ${r1(y - 4)}Q${r1(mx)} ${r1(my)} ${r1(tx + (x - tx) * 0.12)} ${r1(ty + (y - ty) * 0.12)}`, ctx.hair);
}

// ---------------------------------------------------------------- little friends
function bee(x, y, k, ang = 0, ctx) {
  let s = g(g(E(0, 0, 13, 21), 'translate(-6 -22) rotate(-25)') + g(E(0, 0, 12, 19), 'translate(10 -21) rotate(20)'), '');
  s += E(0, 0, 30, 21);
  const band = (x0, x1) => {
    const h = (xx) => 21 * Math.sqrt(Math.max(0, 1 - (xx / 30) ** 2));
    return P(`M${x0} ${-h(x0)}Q${(x0 + x1) / 2} ${-h((x0 + x1) / 2) - 2} ${x1} ${-h(x1)}L${x1} ${h(x1)}Q${(x0 + x1) / 2} ${h((x0 + x1) / 2) + 2} ${x0} ${h(x0)}Z`);
  };
  s += band(-14, -4) + band(4, 13);
  s += P('M-29 -4L-40 0L-29 4Z');
  s += C(34, -6, 15) + dotEye(38, -9, 3) + curve('M33 1Q38 5 43 1', ctx.thin);
  s += curve('M34 -20Q34 -32 26 -38', ctx.thin) + C(26, -38, 3.5) + curve('M40 -19Q44 -31 40 -40', ctx.thin) + C(40, -40, 3.5);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang}) scale(${k})`);
}
function butterfly(x, y, k, ang = 0, ctx, rand) {
  let s = '';
  const wingT = [[0, -4], [-20, -40], [-55, -52], [-62, -24], [-40, 0]];
  const wingB = [[0, 2], [-36, 6], [-48, 30], [-26, 44], [-6, 26]];
  const half = blob(wingT) + blob(wingB) + C(-38, -28, 9) + C(-28, 24, 7);
  s += half + mirrorX(half, 0);
  s += E(0, 4, 7, 30) + C(0, -30, 9);
  s += curve('M-3 -37Q-10 -55 -20 -58', ctx.thin) + curve('M3 -37Q10 -55 20 -58', ctx.thin) + dark(C(-20, -58, 3)) + dark(C(20, -58, 3));
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang}) scale(${k})`);
}
function ladybug(x, y, k, ang = 0, ctx) {
  let s = C(0, -26, 14) + dotEye(-6, -30, 2.5) + dotEye(6, -30, 2.5);
  s += E(0, 4, 26, 28) + line(0, -24, 0, 32, ctx.thin);
  s += dark(C(-12, -6, 5)) + dark(C(12, -6, 5)) + dark(C(-13, 15, 4.5)) + dark(C(13, 15, 4.5));
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang}) scale(${k})`);
}
function dragonfly(x, y, k, ang = 0, ctx) {
  let s = '';
  s += g(E(0, 0, 48, 14), 'translate(-48 -14) rotate(-10)') + g(E(0, 0, 48, 14), 'translate(48 -14) rotate(10)');
  s += g(E(0, 0, 42, 13), 'translate(-42 12) rotate(14)') + g(E(0, 0, 42, 13), 'translate(42 12) rotate(-14)');
  s += P('M-6 0L-5 84Q0 94 5 84L6 0Z') + E(0, -4, 10, 18) + C(0, -28, 13) + dotEye(-6, -31, 3.5) + dotEye(6, -31, 3.5);
  s += curve('M-8 30L8 30M-7 48L7 48M-6 66L6 66', ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang}) scale(${k})`);
}
function hummingbird(x, y, k, ctx) {
  let s = '';
  s += P('M-34 6L-82 22L-74 10L-86 -2L-38 -6Z');
  s += blob([[-44, 4], [-20, -12], [14, -14], [32, -2], [24, 18], [-6, 24], [-34, 16]]);
  s += C(34, -16, 17) + P('M48 -21L104 -16L48 -11Z') + dotEye(39, -20, 3.5);
  s += P('M-4 -8C-20 -50 0 -88 34 -100C28 -64 22 -34 14 -8Z') + curve('M4 -14Q4 -50 22 -82M-4 -18Q-8 -40 0 -60', ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}
function frog(x, y, k, ctx) {
  let s = '';
  s += P('M-52 30C-80 30 -84 0 -60 -6C-40 -10 -30 10 -26 30Z') + P('M52 30C80 30 84 0 60 -6C40 -10 30 10 26 30Z');
  s += blob([[-56, 20], [-50, -20], [-30, -46], [30, -46], [50, -20], [56, 20], [0, 34]]);
  s += C(-26, -48, 18) + C(26, -48, 18) + eye(-26, -49, 11, [0.2, 0.1]) + eye(26, -49, 11, [-0.2, 0.1]);
  s += smile(0, -20, 50, 0.35) + E(0, 10, 28, 18, ctx.thin);
  s += P('M-26 30C-30 18 -24 6 -16 6C-8 6 -6 20 -8 30Z') + P('M26 30C30 18 24 6 16 6C8 6 6 20 8 30Z');
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}

// ---------------------------------------------------------------- containers
/** A classic clay pot standing on y = yb. */
function pot(x, yb, w, h, ctx, deco = 'none') {
  const rimH = h * 0.22, top = yb - h;
  let s = P(`M${r1(x - w * 0.44)} ${r1(top + rimH)}L${r1(x + w * 0.44)} ${r1(top + rimH)}L${r1(x + w * 0.33)} ${r1(yb)}L${r1(x - w * 0.33)} ${r1(yb)}Z`);
  s += R(x - w / 2, top, w, rimH, 6);
  const cy = top + rimH + (h - rimH) * 0.48;
  if (deco === 'heart') s += heart(x, cy, w * 0.3);
  if (deco === 'dots') for (const dx of [-0.2, 0, 0.2]) s += C(x + dx * w, cy + (dx ? 0 : 0), w * 0.055);
  if (deco === 'band') s += P(`M${r1(x - w * 0.41)} ${r1(cy - h * 0.1)}L${r1(x + w * 0.41)} ${r1(cy - h * 0.1)}L${r1(x + w * 0.39)} ${r1(cy + h * 0.06)}L${r1(x - w * 0.39)} ${r1(cy + h * 0.06)}Z`);
  if (deco === 'star') s += star(x, cy, w * 0.14, w * 0.06);
  return s;
}
/** A round-bellied vase standing on y = yb; neck top at yb - h. */
function vase(x, yb, w, h, ctx, deco = 'none') {
  const t = yb - h;
  let s = P(tps('M-30 6C-30 31 -50 51 -50 76C-50 101 -30 106 0 106C30 106 50 101 50 76C50 51 30 31 30 6Z', x, t, w / 100, h / 106));
  s += R(x - w * 0.36, t, w * 0.72, h * 0.08, 5);
  const cy = t + h * 0.68;
  if (deco === 'heart') s += heart(x, cy, w * 0.32);
  if (deco === 'band') s += curve(`M${r1(x - w * 0.46)} ${r1(cy - h * 0.1)}Q${r1(x)} ${r1(cy - h * 0.02)} ${r1(x + w * 0.46)} ${r1(cy - h * 0.1)}M${r1(x - w * 0.49)} ${r1(cy + h * 0.06)}Q${r1(x)} ${r1(cy + h * 0.14)} ${r1(x + w * 0.49)} ${r1(cy + h * 0.06)}`);
  if (deco === 'dots') for (const dx of [-0.22, 0, 0.22]) s += C(x + dx * w, cy, w * 0.06);
  return s;
}
/** A bow: two loops and two tails, centred at x,y. */
function bow(x, y, k, ctx) {
  let s = P('M0 0C-20 -30 -60 -30 -60 -5C-60 20 -20 15 0 0Z') + P('M0 0C20 -30 60 -30 60 -5C60 20 20 15 0 0Z');
  s += P('M-4 4L-30 50L-18 46L-10 58L4 6Z') + P('M4 4L30 50L18 46L10 58L-4 6Z') + E(0, 0, 11, 13);
  s += curve('M-14 -6Q-35 -16 -48 -6', ctx.hair) + curve('M14 -6Q35 -16 48 -6', ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}

// ---------------------------------------------------------------- flower heads
/** A rose seen from the side, bloom centre x,y, size k (1 = about 220 wide). */
function roseSide(x, y, k, ctx) {
  const T = (d, a = '') => tp(d, 0, 0, k);
  const half = (sh) => sh + mirrorX(sh, 0);
  let s = '';
  // sepals hanging under the bloom
  s += half(P(T('M-24 56C-50 72 -76 84 -98 82C-80 66 -58 48 -36 38Z')));
  s += P(T('M-10 76C-8 94 -2 106 4 114C10 98 14 86 12 74Z'));
  // outer back petals with curled tips
  s += P(T('M-20 -40C-40 -82 -80 -104 -110 -94C-100 -70 -114 -30 -98 0C-72 20 -40 10 -20 -10Z'));
  s += P(T('M20 -50C40 -92 80 -108 106 -86C96 -60 112 -20 94 6C72 22 40 12 20 -10Z'));
  s += curve(T('M-102 -84C-80 -86 -56 -76 -40 -58'), ctx.thin) + curve(T('M98 -78C78 -86 58 -78 42 -64'), ctx.thin);
  // the bud, tipped a little towards us, with its spiral
  s += P(T('M-52 -50C-58 -92 -10 -114 28 -102C60 -92 64 -60 50 -40C20 -24 -32 -26 -52 -50Z'));
  s += curve(T('M-32 -66C-26 -94 30 -96 34 -72C36 -56 12 -52 2 -60C-6 -68 4 -78 14 -74'));
  // the cup petal hugging the bud
  s += P(T('M-64 -62C-74 0 -44 86 0 86C44 86 72 0 62 -58C48 -38 22 -30 0 -32C-24 -32 -50 -40 -64 -62Z'));
  s += curve(T('M-50 -44C-48 -6 -34 30 -14 50'), ctx.thin);
  // petals wrapping round the cup, their tops rolled outwards
  s += P(T('M-102 -52C-82 -42 -68 -30 -62 -10C-54 20 -42 50 -12 70C-52 76 -92 60 -106 26C-116 0 -112 -30 -102 -52Z'));
  s += curve(T('M-98 -42C-82 -36 -72 -26 -68 -12'), ctx.thin);
  s += P(T('M100 -46C82 -38 70 -26 66 -8C60 20 46 52 16 70C56 76 94 58 106 24C114 0 110 -24 100 -46Z'));
  s += curve(T('M96 -38C82 -32 74 -22 71 -8'), ctx.thin);
  return g(s, `translate(${r1(x)} ${r1(y)})`);
}
/** A rose seen from above: petals wrapping in a spiral round the bud. */
function roseTop(x, y, rr, ctx, rand) {
  let s = '';
  const lobe = (a0, span, ro, ri) => {
    const pts = [];
    pts.push([x + Math.cos(a0 + span / 2) * ri, y + Math.sin(a0 + span / 2) * ri]);
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, a = a0 + t * span, rad = ro * (0.86 + 0.14 * Math.sin(PI * t));
      pts.push([x + Math.cos(a) * rad, y + Math.sin(a) * rad]);
    }
    return pts;
  };
  const small = rr < 70;
  const layers = small ? [[5, 1.0, 0], [4, 0.7, 0.5]] : [[5, 1.0, 0], [5, 0.78, 0.5], [4, 0.58, 0.2], [3, 0.4, 0.7]];
  for (const [n, f, off] of layers) {
    const step = (2 * PI) / n;
    for (let i = 0; i < n; i++) {
      const a0 = (i + off) * step - step * 0.2 + (rand ? rand.range(-0.08, 0.08) : 0);
      const pts = lobe(a0, step * 1.4, rr * f, rr * f * 0.15);
      s += blob(pts, '', 0.9);
    }
  }
  // the bud in the middle and its spiral
  const br = small ? 0.4 : 0.26, turns = small ? 2.2 : 3.2;
  s += C(x, y, rr * br);
  const sp = [];
  for (let i = 0; i <= 22; i++) { const t = i / 22, a = t * turns * PI, rad = rr * br * 0.85 * (1 - t * 0.85); sp.push([x + Math.cos(a) * rad, y + Math.sin(a) * rad]); }
  s += smooth(sp);
  return s;
}
function sunflowerHead(x, y, rc, L, ctx, o = {}) {
  const { n = 18, face = false, rows = 2 } = o;
  let s = '';
  const petal = (a, len, wd) => {
    const p = [[rc * 0.85, 0], [rc + len * 0.35, -wd], [rc + len, 0], [rc + len * 0.35, wd]];
    const q = rp(p, a).map(([u, v]) => [x + u, y + v]);
    return P(`M${r1(q[0][0])} ${r1(q[0][1])}Q${r1(q[1][0])} ${r1(q[1][1])} ${r1(q[2][0])} ${r1(q[2][1])}Q${r1(q[3][0])} ${r1(q[3][1])} ${r1(q[0][0])} ${r1(q[0][1])}Z`);
  };
  const wd = ((2 * PI * rc) / n) * 0.75;
  if (rows > 1) for (let i = 0; i < n; i++) s += petal((i + 0.5) * (360 / n), L * 0.88, wd);
  for (let i = 0; i < n; i++) s += petal(i * (360 / n), L, wd);
  s += C(x, y, rc);
  if (face) {
    s += C(x, y, rc * 0.84, ctx.thin);
    s += eye(x - rc * 0.32, y - rc * 0.15, rc * 0.17, [0, 0.2]) + eye(x + rc * 0.32, y - rc * 0.15, rc * 0.17, [0, 0.2]);
    s += P(`M${r1(x - rc * 0.38)} ${r1(y + rc * 0.2)}Q${r1(x)} ${r1(y + rc * 0.7)} ${r1(x + rc * 0.38)} ${r1(y + rc * 0.2)}Q${r1(x)} ${r1(y + rc * 0.33)} ${r1(x - rc * 0.38)} ${r1(y + rc * 0.2)}Z`);
    s += C(x - rc * 0.55, y + rc * 0.15, rc * 0.1, ctx.hair) + C(x + rc * 0.55, y + rc * 0.15, rc * 0.1, ctx.hair);
  } else {
    // the seed pattern: a criss-cross of curved lines inside the centre
    const ri = rc * 0.84, sp = Math.max(rc / 4.2, 9);
    s += C(x, y, ri, ctx.thin);
    for (let dir = -1; dir <= 1; dir += 2) {
      for (let c = -ri + sp * 0.6; c < ri; c += sp) {
        const h = Math.sqrt(ri * ri - c * c);
        const a = rp([[c, -h], [c + dir * sp * 0.4, 0], [c, h]], dir * 45).map(([u, v]) => [x + u, y + v]);
        s += curve(`M${r1(a[0][0])} ${r1(a[0][1])}Q${r1(a[1][0])} ${r1(a[1][1])} ${r1(a[2][0])} ${r1(a[2][1])}`, ctx.hair);
      }
    }
  }
  return s;
}
function daisyHead(x, y, rc, L, ctx, o = {}) {
  const { n = 20, face = false, tilt = 0 } = o;
  let s = '';
  const wd = Math.max(((2 * PI * (rc + L * 0.5)) / n) * 0.42, 6);
  for (let i = 0; i < n; i++) {
    const a = i * (360 / n) + tilt;
    s += g(P(`M${r1(rc * 0.6)} 0Q${r1(rc + L * 0.2)} ${r1(-wd)} ${r1(rc + L * 0.85)} ${r1(-wd * 0.8)}Q${r1(rc + L * 1.04)} 0 ${r1(rc + L * 0.85)} ${r1(wd * 0.8)}Q${r1(rc + L * 0.2)} ${r1(wd)} ${r1(rc * 0.6)} 0Z`), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
  }
  s += C(x, y, rc);
  if (face) {
    s += dotEye(x - rc * 0.33, y - rc * 0.12, rc * 0.12) + dotEye(x + rc * 0.33, y - rc * 0.12, rc * 0.12) + smile(x, y + rc * 0.22, rc * 0.5, 0.45);
  } else {
    for (const [a, rad] of [[0, 0], [30, 0.45], [100, 0.5], [170, 0.42], [240, 0.5], [310, 0.47]]) s += C(x + Math.cos(a * D) * rc * rad, y + Math.sin(a * D) * rc * rad, rc * 0.09, ctx.hair);
  }
  return s;
}
/** A tulip cup with its base at x,y (stem joins there), height about 150*k. */
function tulipHead(x, y, k, ctx, lean = 0) {
  let s = '';
  s += P(tp('M-34 -60C-40 -100 -30 -130 -6 -150C6 -130 30 -110 30 -70Z', 0, 0, 1));
  s += P(tp('M34 -60C40 -100 30 -130 6 -150C-6 -130 -30 -110 -30 -70Z', 0, 0, 1));
  s += P('M-2 0C-40 0 -62 -22 -62 -60C-62 -95 -56 -118 -46 -134C-30 -112 -8 -92 -2 -62Z');
  s += P('M2 0C40 0 62 -22 62 -60C62 -95 56 -118 46 -134C30 -112 8 -92 2 -62Z');
  s += P('M0 2C-30 2 -44 -24 -42 -56C-40 -82 -22 -104 0 -122C22 -104 40 -82 42 -56C44 -24 30 2 0 2Z');
  s += curve('M0 -14C-6 -40 -6 -70 0 -100', ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${lean}) scale(${k})`);
}
/** Lotus seen from the side: base at x,y. */
function lotusHead(x, y, k, ctx) {
  const pet = (ang, len, wid, lift = 0) => {
    const q = rp([[0, 0], [len * 0.45, -wid], [len, 0], [len * 0.45, wid]], ang).map(([u, v]) => [x + u * k, y + (v - lift) * k]);
    return P(`M${r1(q[0][0])} ${r1(q[0][1])}C${r1(q[1][0])} ${r1(q[1][1])} ${r1(q[2][0] - (q[2][0] - q[1][0]) * 0.25)} ${r1(q[2][1] - (q[2][1] - q[1][1]) * 0.25)} ${r1(q[2][0])} ${r1(q[2][1])}C${r1(q[2][0] - (q[2][0] - q[3][0]) * 0.25)} ${r1(q[2][1] - (q[2][1] - q[3][1]) * 0.25)} ${r1(q[3][0])} ${r1(q[3][1])} ${r1(q[0][0])} ${r1(q[0][1])}Z`)
      + curve(`M${r1(q[0][0] + (q[2][0] - q[0][0]) * 0.2)} ${r1(q[0][1] + (q[2][1] - q[0][1]) * 0.2)}L${r1(q[0][0] + (q[2][0] - q[0][0]) * 0.78)} ${r1(q[0][1] + (q[2][1] - q[0][1]) * 0.78)}`, ctx.hair);
  };
  let s = '';
  // back row, middle row, front row
  for (const a of [-148, -32]) s += pet(a, 125, 30, 4);
  for (const a of [-122, -58]) s += pet(a, 145, 34, 6);
  s += pet(-90, 160, 38, 8);
  for (const a of [-108, -72]) s += pet(a, 140, 36, 0);
  for (const a of [-168, -12]) s += pet(a, 108, 28, -6);
  for (const a of [-138, -42]) s += pet(a, 118, 36, -8);
  s += pet(-90, 120, 40, -10);
  return s;
}
function hibiscusHead(x, y, rr, ctx, ang = 0) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = ang + i * 72 - 90;
    const pts = rp([[0, 0], [rr * 0.35, -rr * 0.5], [rr * 0.78, -rr * 0.62], [rr * 1.0, -rr * 0.3], [rr * 0.94, 0], [rr * 1.02, rr * 0.3], [rr * 0.76, rr * 0.6], [rr * 0.35, rr * 0.48]], a).map(([u, v]) => [x + u, y + v]);
    s += blob(pts, '', 0.9);
    for (const dv of [-0.25, 0, 0.25]) {
      const v = rp([[rr * 0.22, dv * rr * 0.3], [rr * 0.7, dv * rr * 1.1]], a).map(([u, w]) => [x + u, y + w]);
      s += line(v[0][0], v[0][1], v[1][0], v[1][1], ctx.hair);
    }
  }
  s += C(x, y, rr * 0.2);
  // the long stamen with pollen dots
  const ea = (ang - 40) * D, ex = x + Math.cos(ea) * rr * 1.05, ey = y + Math.sin(ea) * rr * 1.05;
  s += P(`M${r1(x - 4)} ${r1(y)}Q${r1((x + ex) / 2 - 6)} ${r1((y + ey) / 2 + 4)} ${r1(ex - 3)} ${r1(ey)}L${r1(ex + 3)} ${r1(ey + 2)}Q${r1((x + ex) / 2 + 6)} ${r1((y + ey) / 2 + 8)} ${r1(x + 4)} ${r1(y + 4)}Z`);
  for (let i = 0; i < 5; i++) s += C(ex + Math.cos(ea + (i - 2) * 0.7) * rr * 0.1, ey + Math.sin(ea + (i - 2) * 0.7) * rr * 0.1, rr * 0.05);
  return s;
}
/** A pointed petal from x,y towards ang: smooth sides, sharp tip. bend curls the tip sideways. */
function petal(x, y, ang, len, wid, ctx, o = {}) {
  const { bend = 0, widest = 0.4, vein = true } = o;
  const up = [[0, 0], [len * widest * 0.6, -wid * 0.85], [len * widest, -wid], [len * 0.75, -wid * 0.62], [len, bend * len]];
  const lo = [[len, bend * len], [len * 0.75, wid * 0.62 + bend * len * 0.5], [len * widest, wid], [len * widest * 0.6, wid * 0.85], [0, 0]];
  const U = rp(up, ang).map(([a, b]) => [x + a, y + b]), L = rp(lo, ang).map(([a, b]) => [x + a, y + b]);
  let s = P(smoothD(U, false, 0.8) + smoothD(L, false, 0.8).replace(/^M[^C]*/, '') + 'Z');
  if (vein) {
    const v = rp([[len * 0.12, 0], [len * 0.5, bend * len * 0.15], [len * 0.82, bend * len * 0.6]], ang).map(([a, b]) => [x + a, y + b]);
    s += smooth(v, ctx.hair);
  }
  return s;
}
/** A lily seen from the front: six broad pointed petals, spots and long stamens. */
function lilyHead(x, y, rr, ctx, ang = 0) {
  let s = '';
  for (let i = 0; i < 3; i++) s += petal(x, y, ang + i * 120 - 30, rr, rr * 0.22, ctx, { bend: 0.08, widest: 0.45 });
  for (let i = 0; i < 3; i++) s += petal(x, y, ang + i * 120 + 30, rr * 0.95, rr * 0.2, ctx, { bend: 0.08, widest: 0.45 });
  for (let i = 0; i < 6; i++) {
    const a = (ang + i * 60 - 30) * D;
    for (const [f, o] of [[0.3, -0.12], [0.42, 0.1], [0.36, 0.02]]) s += C(x + Math.cos(a + o) * rr * f, y + Math.sin(a + o) * rr * f, rr * 0.025, ctx.hair);
  }
  s += C(x, y, rr * 0.1);
  for (let i = 0; i < 6; i++) {
    const a = (ang + i * 60) * D, len = rr * (0.52 + (i % 2) * 0.08);
    const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
    s += curve(`M${r1(x + Math.cos(a) * rr * 0.1)} ${r1(y + Math.sin(a) * rr * 0.1)}Q${r1(x + Math.cos(a + 0.15) * len * 0.6)} ${r1(y + Math.sin(a + 0.15) * len * 0.6)} ${r1(ex)} ${r1(ey)}`, ctx.thin);
    s += g(E(0, 0, rr * 0.075, rr * 0.035), `translate(${r1(ex)} ${r1(ey)}) rotate(${r1(a / D + 90)})`);
  }
  return s;
}
/** A lily seen from the side: a trumpet with curled petal tips. Base at x,y, pointing at ang. */
function lilyTrumpet(x, y, k, ang, ctx) {
  let s = '';
  s += petal(40, -4, -16, 100, 18, ctx, { bend: -0.1, widest: 0.5 }) + petal(40, 4, 16, 100, 18, ctx, { bend: 0.1, widest: 0.5 });
  s += P('M0 -7C30 -9 52 -16 72 -30L74 30C52 16 30 9 0 7Z');
  s += curve('M50 -4Q100 -8 130 -18M50 4Q100 8 132 16', ctx.thin) + E(132, -19, 8, 4) + E(134, 16, 8, 4);
  s += petal(44, -10, -34, 105, 20, ctx, { bend: -0.18, widest: 0.5 }) + petal(44, 10, 34, 105, 20, ctx, { bend: 0.18, widest: 0.5 });
  s += petal(46, 0, 2, 104, 18, ctx, { bend: 0.06, widest: 0.5 });
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang}) scale(${k})`);
}
/** A closed bud (lily, lotus) from base x,y towards angle. */
function bud(x, y, len, wid, ang, ctx) {
  const q = rp([[0, 0], [len * 0.4, -wid], [len, 0], [len * 0.4, wid]], ang).map(([u, v]) => [x + u, y + v]);
  return P(`M${r1(q[0][0])} ${r1(q[0][1])}C${r1(q[1][0])} ${r1(q[1][1])} ${r1(q[2][0])} ${r1(q[2][1])} ${r1(q[2][0])} ${r1(q[2][1])}C${r1(q[2][0])} ${r1(q[2][1])} ${r1(q[3][0])} ${r1(q[3][1])} ${r1(q[0][0])} ${r1(q[0][1])}Z`)
    + curve(`M${r1(x + (q[2][0] - x) * 0.15)} ${r1(y + (q[2][1] - y) * 0.15)}Q${r1((q[1][0] + q[2][0]) / 2)} ${r1((q[1][1] + q[2][1]) / 2)} ${r1(q[2][0])} ${r1(q[2][1])}`, ctx.hair);
}
/** Rose leaf: a stalk with three serrated leaflets. */
function roseLeaves(x, y, ang, len, ctx) {
  const tip = rp([[len, 0]], ang)[0];
  const mid = rp([[len * 0.45, 0]], ang)[0];
  let s = curve(`M${r1(x)} ${r1(y)}L${r1(x + tip[0] * 0.75)} ${r1(y + tip[1] * 0.75)}`);
  s += leaf(x + mid[0], y + mid[1], len * 0.45, len * 0.17, ang - 50, ctx, { teeth: 6, veins: 2 });
  s += leaf(x + mid[0], y + mid[1], len * 0.45, len * 0.17, ang + 50, ctx, { teeth: 6, veins: 2 });
  s += leaf(x + tip[0] * 0.72, y + tip[1] * 0.72, len * 0.55, len * 0.2, ang, ctx, { teeth: 7, veins: 3 });
  return s;
}

// ---------------------------------------------------------------- the flower subjects
const rose = {
  id: 'rose', name: 'Rose', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    const thorn = (x, y, side) => P(`M${x} ${y - 7}L${x + side * 14} ${y - 10}L${x} ${y + 5}Z`);
    if (style === 0) {
      const st = [[0, 200], [8, 120], [-6, 40], [0, -20]];
      s += tube(st, 16, 13);
      s += roseLeaves(2, 110, -25, 120, ctx) + roseLeaves(-2, 30, 200, 110, ctx);
      s += thorn(8, 150, 1) + thorn(-6, 70, -1) + thorn(-2, 0, -1);
      s += roseSide(0, -100, 0.95, ctx);
      return s;
    }
    if (style === 1) {
      const stems = [[[-30, 200], [-60, 80], [-110, -10], [-120, -40]], [[0, 200], [4, 60], [0, -60], [0, -90]], [[30, 200], [70, 90], [115, 0], [120, -20]]];
      for (const st of stems) s += tube(st, 12, 10);
      s += roseLeaves(-55, 90, 200, 90, ctx) + roseLeaves(4, 30, -40, 90, ctx) + roseLeaves(70, 100, -10, 85, ctx) + roseLeaves(-2, 120, 210, 80, ctx);
      s += roseSide(-118, -95, 0.58, ctx) + roseSide(118, -75, 0.58, ctx) + roseSide(0, -140, 0.62, ctx);
      s += P('M-60 200C-58 175 -40 170 -30 185C-20 165 20 165 30 185C40 170 58 175 60 200Z');
      return s;
    }
    if (style === 2) {
      s += tube([[0, 70], [-4, 20], [0, -40]], 13);
      s += roseLeaves(-2, 40, 205, 95, ctx) + roseLeaves(0, 0, -25, 95, ctx);
      s += roseTop(0, -95, 105, ctx, rand);
      s += pot(0, 200, 210, 140, ctx, 'heart');
      return s;
    }
    // close-up rose head with leaves and a butterfly friend
    s += tube([[0, 200], [-10, 120], [0, 40]], 18);
    s += leaf(-20, 60, 150, 52, 200, ctx, { teeth: 9, veins: 4 }) + leaf(20, 50, 150, 52, -20, ctx, { teeth: 9, veins: 4 });
    s += leaf(-10, 130, 110, 40, 160, ctx, { teeth: 7, veins: 3 });
    s += roseTop(0, -40, 140, ctx, rand);
    s += butterfly(140, -160, 0.55, 20, ctx, rand);
    return s;
  },
};

const sunflower = {
  id: 'sunflower', name: 'Sunflower', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    const bigLeaf = (x, y, ang, len) => leaf(x, y, len, len * 0.42, ang, ctx, { teeth: 8, veins: 3, round: 0.6, bend: ang > 90 || ang < -90 ? -0.12 : 0.12 });
    if (style === 0) {
      s += tube([[0, 200], [10, 100], [-6, 0], [0, -60]], 20, 16);
      s += bigLeaf(6, 120, -20, 130) + bigLeaf(0, 50, 200, 120) + bigLeaf(2, -10, -30, 90);
      s += sunflowerHead(0, -95, 55, 52, ctx, { n: 18 });
      return s;
    }
    if (style === 1) {
      const heads = [[-120, -40, 32, 30], [0, -120, 40, 36], [118, -10, 30, 28]];
      s += tube([[-60, 200], [-90, 80], [-120, -10]], 13) + tube([[0, 200], [6, 60], [0, -80]], 14) + tube([[55, 200], [100, 90], [118, 20]], 13);
      s += bigLeaf(-80, 110, 200, 80) + bigLeaf(4, 60, -30, 85) + bigLeaf(2, 120, 210, 80) + bigLeaf(98, 100, -20, 70);
      for (const [x, y, rc, L] of heads) s += sunflowerHead(x, y, rc, L, ctx, { n: 14 });
      return s;
    }
    if (style === 2) {
      s += tube([[0, 80], [6, 20], [0, -40]], 16);
      s += bigLeaf(4, 40, -20, 110) + bigLeaf(0, 10, 200, 100);
      s += sunflowerHead(0, -90, 48, 46, ctx, { n: 16 });
      s += pot(0, 200, 200, 130, ctx, 'dots');
      s += bee(135, -150, 0.8, 10, ctx);
      return s;
    }
    // smiling close-up head
    s += tube([[0, 200], [-6, 120], [0, 60]], 22);
    s += bigLeaf(-4, 150, 205, 120) + bigLeaf(4, 120, -25, 120);
    s += sunflowerHead(0, -50, 72, 70, ctx, { n: 20, face: true });
    return s;
  },
};

const tulip = {
  id: 'tulip', name: 'Tulip', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += tube([[0, 200], [4, 80], [0, -30]], 16, 14);
      s += blade(-6, 200, -110, -20, 46, -1, ctx) + blade(6, 200, 95, 30, 42, 1, ctx);
      s += tulipHead(0, -20, 1.2, ctx);
      return s;
    }
    if (style === 1) {
      s += tube([[-20, 200], [-50, 60], [-100, -20]], 12) + tube([[0, 200], [6, 40], [0, -80]], 12) + tube([[20, 200], [60, 70], [100, 0]], 12);
      s += blade(-30, 200, -150, 40, 36, -1, ctx) + blade(30, 200, 150, 60, 36, 1, ctx) + blade(-10, 200, -40, -10, 30, 1, ctx);
      s += tulipHead(-100, -20, 0.8, ctx, -14) + tulipHead(100, 0, 0.78, ctx, 12) + tulipHead(0, -80, 0.85, ctx);
      return s;
    }
    if (style === 2) {
      s += tube([[0, 80], [4, 20], [0, -40]], 14);
      s += blade(-4, 80, -100, -20, 34, -1, ctx) + blade(4, 80, 100, 0, 34, 1, ctx);
      s += tulipHead(0, -40, 1.0, ctx);
      s += pot(0, 200, 200, 135, ctx, 'band');
      s += butterfly(-130, -160, 0.6, -15, ctx, rand);
      return s;
    }
    // three tulips in a glass vase
    s += curve('M-10 120C-20 40 -60 -10 -90 -50') + curve('M0 120C0 40 4 -20 0 -90') + curve('M10 120C20 40 60 -10 90 -40');
    s += leaf(-10, 50, 90, 22, 220, ctx, { veins: 0 }) + leaf(10, 50, 90, 22, -40, ctx, { veins: 0 });
    s += tulipHead(-90, -50, 0.7, ctx, -20) + tulipHead(90, -40, 0.7, ctx, 18) + tulipHead(0, -90, 0.75, ctx);
    s += vase(0, 200, 170, 150, ctx, 'heart');
    return s;
  },
};

const daisy = {
  id: 'daisy', name: 'Daisy', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    const dleaf = (x, y, a, l) => leaf(x, y, l, l * 0.22, a, ctx, { teeth: 5, veins: 0 });
    if (style === 0) {
      s += tube([[0, 200], [-10, 80], [6, -20], [0, -60]], 13);
      s += dleaf(-6, 140, 210, 110) + dleaf(0, 60, -30, 100);
      s += daisyHead(0, -95, 38, 80, ctx, { n: 20 });
      return s;
    }
    if (style === 1) {
      const fl = [[-120, -20, 24, 48, [[-70, 200], [-100, 80], [-120, -10]]], [-20, -110, 28, 56, [[-20, 200], [-30, 50], [-20, -100]]], [90, -60, 26, 52, [[20, 200], [70, 60], [90, -50]]], [150, 70, 18, 36, [[70, 200], [130, 120], [150, 80]]]];
      for (const f of fl) s += tube(f[4], 10);
      s += dleaf(-80, 140, 220, 70) + dleaf(-28, 80, -40, 70) + dleaf(60, 110, -30, 60);
      s += curve('M-150 200Q-140 160 -160 130M-130 200Q-128 165 -120 150M150 200Q140 170 155 150M175 200Q170 180 185 165');
      for (const [x, y, rc, L] of fl) s += daisyHead(x, y, rc, L, ctx, { n: 16, tilt: x });
      return s;
    }
    if (style === 2) {
      s += tube([[-30, 80], [-50, 20], [-80, -40]], 11) + tube([[20, 80], [40, 10], [70, -80]], 11);
      s += dleaf(-40, 40, 200, 70) + dleaf(40, 30, -20, 70);
      s += daisyHead(-80, -50, 30, 56, ctx, { n: 18 }) + daisyHead(70, -100, 32, 60, ctx, { n: 18, tilt: 9 });
      s += pot(0, 200, 210, 135, ctx, 'star');
      s += ladybug(-60, 120, 0.8, -20, ctx);
      return s;
    }
    // close-up smiling daisy with a bee
    s += tube([[0, 200], [8, 120], [0, 60]], 20);
    s += dleaf(4, 150, -30, 120) + dleaf(0, 120, 210, 120);
    s += daisyHead(0, -40, 55, 100, ctx, { n: 22, face: true });
    s += bee(-140, -165, 0.75, -10, ctx);
    return s;
  },
};

const lotus = {
  id: 'lotus', name: 'Lotus', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'pond', 'water', 'rain', 'night', 'hills'],
  pairScenes: ['pond'],
  draw(style, rand, ctx) {
    let s = '';
    // a lily pad: a flat oval with a notch cut in, and veins
    const pad = (x, y, rx, ry, turn = 0) => {
      const pts = [];
      for (let i = 0; i <= 26; i++) { const t = (turn - 74 + 20 + i * 12.8) * D; pts.push([x + Math.cos(t) * rx, y + Math.sin(t) * ry]); }
      let v = '';
      for (const t of [40, 100, 160, 220]) v += line(x, y, x + Math.cos((turn - 74 + t) * D) * rx * 0.78, y + Math.sin((turn - 74 + t) * D) * ry * 0.78, ctx.hair);
      return P(smoothD(pts, false) + `L${r1(x)} ${r1(y)}Z`) + v;
    };
    const ripples = (y) => curve(`M-195 ${y}Q-160 ${y - 12} -125 ${y}M-60 ${y + 6}Q-15 ${y - 6} 30 ${y + 6}M110 ${y}Q150 ${y - 12} 190 ${y}`, ctx.thin);
    if (style === 0) {
      s += pad(0, 150, 200, 46);
      s += lotusHead(0, 128, 1.38, ctx);
      s += butterfly(130, -150, 0.6, 15, ctx, rand);
      s += ripples(196);
      return s;
    }
    if (style === 1) {
      // lotus and a bud, a dragonfly visiting
      s += pad(95, 170, 100, 26, 180);
      s += tube([[110, 175], [118, 60], [110, -40]], 11);
      s += bud(110, -30, 105, 34, -92, ctx);
      s += pad(-50, 160, 150, 38);
      s += lotusHead(-50, 140, 1.05, ctx);
      s += dragonfly(-40, -150, 0.9, -15, ctx);
      s += ripples(198);
      return s;
    }
    if (style === 2) {
      // a frog friend sitting on a lily pad beside the lotus
      s += pad(-60, 140, 140, 36);
      s += lotusHead(-60, 120, 1.0, ctx);
      s += pad(110, 172, 90, 24, 200);
      s += frog(110, 140, 0.95, ctx);
      s += ripples(196);
      return s;
    }
    // lotus flower, bud and seed pod on tall stems, with a big round leaf
    s += tube([[-125, 200], [-115, 60], [-120, -40]], 11) + tube([[120, 200], [110, 40], [118, -70]], 11) + tube([[0, 200], [6, 120], [0, 60]], 12);
    s += tube([[-60, 200], [-70, 80], [-80, 0]], 9);
    s += P('M-170 -10C-170 -60 10 -60 10 -10C10 6 -20 16 -80 16C-140 16 -170 6 -170 -10Z') + curve('M-80 10L-80 -36M-80 10L-140 -30M-80 10L-20 -30', ctx.hair);
    // the seed pod: a cone with holes on top
    s += P('M90 -76L146 -76L134 -40Q118 -28 102 -40Z') + E(118, -82, 34, 13);
    for (const [dx, dy] of [[-16, -2], [0, -4], [16, -2], [-8, 4], [8, 4]]) s += C(118 + dx, -82 + dy, 4, ctx.thin);
    s += bud(-120, -30, 120, 36, -95, ctx);
    s += lotusHead(10, 90, 1.0, ctx);
    s += ripples(198);
    return s;
  },
};

const hibiscus = {
  id: 'hibiscus', name: 'Hibiscus', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    const hleaf = (x, y, a, l) => leaf(x, y, l, l * 0.36, a, ctx, { teeth: 7, veins: 3, round: 0.7 });
    if (style === 0) {
      s += tube([[0, 200], [-10, 100], [0, 0]], 16);
      s += hleaf(-6, 120, 200, 120) + hleaf(-2, 60, -20, 120);
      s += hibiscusHead(0, -70, 120, ctx, 0);
      return s;
    }
    if (style === 1) {
      s += tube([[-20, 200], [-30, 80], [10, -40], [60, -110]], 14) + tube([[-26, 100], [-80, 40], [-110, 0]], 10);
      s += hleaf(-20, 150, 200, 90) + hleaf(-10, 20, -40, 90) + hleaf(30, -60, 200, 70);
      s += bud(60, -110, 70, 22, -60, ctx);
      s += hibiscusHead(-110, -10, 78, ctx, 20) + hibiscusHead(60, -60, 70, ctx, -10);
      return s;
    }
    if (style === 2) {
      s += tube([[0, 80], [-20, 0], [-60, -80]], 12) + tube([[0, 70], [40, 0], [70, -60]], 12);
      s += hleaf(-20, 20, 200, 80) + hleaf(30, 10, -20, 80) + hleaf(0, 60, -90, 70);
      s += hibiscusHead(-60, -90, 72, ctx, 0) + hibiscusHead(75, -60, 62, ctx, 30);
      s += pot(0, 200, 210, 135, ctx, 'band');
      return s;
    }
    // close-up bloom with a hummingbird
    s += tube([[0, 200], [10, 120], [0, 60]], 18);
    s += hleaf(4, 140, 200, 120) + hleaf(6, 100, -20, 120);
    s += hibiscusHead(-20, -10, 135, ctx, 0);
    s += hummingbird(110, -150, 0.75, ctx);
    return s;
  },
};

const lily = {
  id: 'lily', name: 'Lily', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += tube([[0, 200], [6, 80], [0, -40]], 14);
      s += blade(-4, 200, -120, 40, 34, -1, ctx) + blade(4, 160, 120, 20, 30, 1, ctx) + blade(0, 90, -90, -10, 24, -1, ctx);
      s += lilyHead(0, -85, 115, ctx, 0);
      return s;
    }
    if (style === 1) {
      // a tall stem with trumpet lilies and buds
      s += tube([[0, 200], [-4, 60], [6, -60], [0, -150]], 13);
      s += tube([[2, 40], [50, 20], [80, 0]], 9) + tube([[2, -30], [-40, -50], [-70, -60]], 9) + tube([[4, -100], [40, -120], [60, -130]], 8);
      s += blade(-4, 200, -120, 80, 30, -1, ctx) + blade(4, 150, 120, 70, 26, 1, ctx) + blade(0, 100, -100, 30, 22, -1, ctx);
      s += bud(0, -145, 70, 18, -90, ctx) + bud(58, -128, 66, 17, -40, ctx);
      s += lilyTrumpet(78, 0, 0.85, -15, ctx) + lilyTrumpet(-68, -60, 0.85, 195, ctx);
      return s;
    }
    if (style === 2) {
      s += curve('M-10 110C-20 40 -60 -20 -90 -60') + curve('M10 110C20 30 60 -40 85 -90') + curve('M0 110C0 60 -6 10 -10 -20');
      s += leaf(-10, 60, 100, 18, 215, ctx, { veins: 0 }) + leaf(8, 50, 100, 18, -35, ctx, { veins: 0 });
      s += bud(-10, -20, 60, 16, -100, ctx);
      s += lilyHead(-90, -70, 70, ctx, 0) + lilyHead(85, -100, 70, ctx, 20);
      s += vase(0, 200, 160, 160, ctx, 'band');
      return s;
    }
    // close-up lily face with a butterfly
    s += tube([[0, 200], [-6, 120], [0, 60]], 16);
    s += blade(-4, 200, -160, 60, 34, -1, ctx) + blade(4, 200, 160, 80, 34, 1, ctx);
    s += lilyHead(0, -40, 165, ctx, 0);
    s += butterfly(150, -170, 0.5, 15, ctx, rand);
    return s;
  },
};

const bouquet = {
  id: 'bouquet', name: 'Flower bouquet', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'table', 'room', 'party', 'garden', 'meadow'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // wrapped bouquet with a bow
      s += leaf(-40, -20, 110, 30, 215, ctx, { veins: 2 }) + leaf(40, -20, 110, 30, -35, ctx, { veins: 2 }) + leaf(0, -40, 100, 26, -90, ctx, { veins: 2 });
      s += tulipHead(-95, -50, 0.55, ctx, -30) + tulipHead(95, -50, 0.55, ctx, 30);
      s += daisyHead(-55, -120, 22, 34, ctx, { n: 14 }) + daisyHead(65, -130, 22, 34, ctx, { n: 14 });
      s += roseTop(0, -70, 58, ctx, rand) + roseTop(-70, -40, 44, ctx, rand) + roseTop(70, -40, 44, ctx, rand);
      s += P('M-130 -30L-20 200L20 200L130 -30Q60 0 0 -10Q-60 0 -130 -30Z');
      s += curve('M-60 0L-6 190M60 0L6 190', ctx.thin);
      s += bow(0, 110, 1.1, ctx);
      return s;
    }
    if (style === 1) {
      // round bouquet in a vase
      s += leaf(-60, 0, 90, 26, 200, ctx, { veins: 2 }) + leaf(60, 0, 90, 26, -20, ctx, { veins: 2 });
      s += lilyHead(-100, -70, 55, ctx, 0) + sunflowerHead(95, -80, 26, 30, ctx, { n: 14 });
      s += daisyHead(-30, -150, 24, 36, ctx, { n: 14 }) + tulipHead(50, -110, 0.5, ctx, 10);
      s += roseTop(-20, -70, 52, ctx, rand) + roseTop(45, -20, 40, ctx, rand) + roseTop(-70, -10, 40, ctx, rand);
      s += vase(0, 200, 170, 170, ctx, 'dots');
      return s;
    }
    if (style === 2) {
      // a basket of flowers
      s += P('M-120 70C-120 -190 120 -190 120 70L102 70C102 -165 -102 -165 -102 70Z');
      s += leaf(-90, 40, 100, 28, 200, ctx, { veins: 2 }) + leaf(90, 40, 100, 28, -20, ctx, { veins: 2 }) + leaf(10, 0, 90, 26, -70, ctx, { veins: 2 });
      s += tulipHead(-40, 0, 0.62, ctx, -12) + daisyHead(-95, 10, 30, 44, ctx, { n: 14 }) + daisyHead(95, 0, 28, 42, ctx, { n: 14 });
      s += roseTop(-10, 30, 56, ctx, rand) + tulipHead(55, 30, 0.6, ctx, 14) + roseTop(-80, 66, 42, ctx, rand) + roseTop(85, 64, 42, ctx, rand);
      s += P('M-150 80L150 80L124 200L-124 200Z');
      for (const y of [110, 140, 170]) s += curve(`M${-150 + (y - 80) * 0.22} ${y}L${150 - (y - 80) * 0.22} ${y}`, ctx.thin);
      for (let x = -110; x <= 110; x += 44) s += curve(`M${x} 80L${x * 0.83} 200`, ctx.thin);
      s += R(-162, 66, 324, 26, 12);
      return s;
    }
    // a watering can full of flowers
    s += leaf(-40, -10, 110, 30, 215, ctx, { veins: 2 }) + leaf(40, -10, 110, 30, -35, ctx, { veins: 2 });
    s += tulipHead(-75, -10, 0.75, ctx, -20) + daisyHead(70, -110, 34, 52, ctx, { n: 16 }) + daisyHead(-95, -150, 26, 40, ctx, { n: 14 });
    s += roseTop(-10, -80, 62, ctx, rand) + tulipHead(75, -5, 0.68, ctx, 15);
    // spout and its sprinkler
    s += P('M80 110L172 0L186 12L94 140Z') + P('M158 -16L204 24L194 36L148 -4Z');
    // handle at the back
    s += P('M-90 40C-185 30 -185 170 -90 170L-90 144C-150 144 -150 64 -90 66Z');
    s += R(-100, 30, 200, 170, 28) + R(-112, 18, 224, 30, 14);
    s += heart(0, 120, 64);
    return s;
  },
};

// ---------------------------------------------------------------- tree and plant helpers
/** A cloud-like scalloped outline round an ellipse: n bumps, depth = how far each bump bulges. */
function bumpy(cx, cy, rx, ry, n, depth = 0.18, start = -90, rand = null) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (start + (i * 360) / n + (rand ? rand.range(-6, 6) : 0)) * D;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % n];
    const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
    const k = 1 + depth * 2.2;
    d += `Q${r1(cx + (mx - cx) * k)} ${r1(cy + (my - cy) * k)} ${r1(p1[0])} ${r1(p1[1])}`;
  }
  return P(d + 'Z');
}
/** A tree trunk standing on yb, top at yt, with root flares. */
function trunk(x, yb, yt, wt, wb, ctx, bark = true) {
  const f = wb * 0.45;
  let s = P(`M${r1(x - wb / 2 - f)} ${r1(yb)}C${r1(x - wb / 2)} ${r1(yb - 10)} ${r1(x - wb / 2)} ${r1(yb - 30)} ${r1(x - wb / 2 + 2)} ${r1(yb - 50)}C${r1(x - wt / 2)} ${r1((yb + yt) / 2)} ${r1(x - wt / 2)} ${r1(yt + 20)} ${r1(x - wt / 2)} ${r1(yt)}L${r1(x + wt / 2)} ${r1(yt)}C${r1(x + wt / 2)} ${r1(yt + 20)} ${r1(x + wt / 2)} ${r1((yb + yt) / 2)} ${r1(x + wb / 2 - 2)} ${r1(yb - 50)}C${r1(x + wb / 2)} ${r1(yb - 30)} ${r1(x + wb / 2)} ${r1(yb - 10)} ${r1(x + wb / 2 + f)} ${r1(yb)}Q${r1(x + wb * 0.3)} ${r1(yb - 12)} ${r1(x + wb * 0.1)} ${r1(yb)}Q${r1(x)} ${r1(yb - 16)} ${r1(x - wb * 0.15)} ${r1(yb)}Q${r1(x - wb * 0.35)} ${r1(yb - 12)} ${r1(x - wb / 2 - f)} ${r1(yb)}Z`);
  if (bark) {
    const h = yb - yt;
    s += curve(`M${r1(x - wt * 0.15)} ${r1(yt + h * 0.35)}Q${r1(x - wt * 0.25)} ${r1(yt + h * 0.5)} ${r1(x - wt * 0.12)} ${r1(yt + h * 0.62)}M${r1(x + wt * 0.18)} ${r1(yt + h * 0.6)}Q${r1(x + wt * 0.26)} ${r1(yt + h * 0.72)} ${r1(x + wt * 0.15)} ${r1(yt + h * 0.84)}`, ctx.thin);
  }
  return s;
}
function apple(x, y, r, ctx, leafy = true) {
  const pts = [[0, -0.72], [0.5, -1], [0.98, -0.45], [0.92, 0.45], [0.45, 0.98], [0, 0.86], [-0.45, 0.98], [-0.92, 0.45], [-0.98, -0.45], [-0.5, -1]].map(([a, b]) => [x + a * r, y + b * r]);
  let s = blob(pts) + curve(`M${r1(x)} ${r1(y - r * 0.7)}Q${r1(x + r * 0.05)} ${r1(y - r * 1.1)} ${r1(x + r * 0.25)} ${r1(y - r * 1.3)}`, ctx.thin);
  if (leafy) s += leaf(x + r * 0.08, y - r * 1.0, r * 0.85, r * 0.3, -30, ctx, { veins: 0 });
  s += curve(`M${r1(x - r * 0.55)} ${r1(y - r * 0.3)}Q${r1(x - r * 0.6)} ${r1(y - r * 0.05)} ${r1(x - r * 0.48)} ${r1(y + r * 0.15)}`, ctx.hair);
  return s;
}
/** An acorn hanging from its cap, centre x,y, size r. */
function acorn(x, y, r, ang, ctx, face = false) {
  let s = P(`M${-r * 0.78} 0C${-r * 0.82} ${r * 0.9} ${-r * 0.2} ${r * 1.45} 0 ${r * 1.55}C${r * 0.2} ${r * 1.45} ${r * 0.82} ${r * 0.9} ${r * 0.78} 0Z`);
  s += P(`M${-r * 0.95} ${r * 0.08}C${-r * 1.0} ${-r * 0.7} ${r * 1.0} ${-r * 0.7} ${r * 0.95} ${r * 0.08}Q0 ${r * 0.3} ${-r * 0.95} ${r * 0.08}Z`);
  s += P(`M${-r * 0.1} ${-r * 0.45}Q${-r * 0.12} ${-r * 0.8} ${r * 0.08} ${-r * 0.92}L${r * 0.22} ${-r * 0.82}Q${r * 0.08} ${-r * 0.7} ${r * 0.12} ${-r * 0.45}Z`);
  s += curve(`M${-r * 0.6} ${-r * 0.08}L${-r * 0.3} ${-r * 0.42}M${-r * 0.3} ${r * 0.1}L${r * 0.15} ${-r * 0.48}M${r * 0.15} ${r * 0.14}L${r * 0.6} ${-r * 0.3}M${-r * 0.75} ${-r * 0.3}L${-r * 0.2} ${r * 0.12}M${-r * 0.15} ${-r * 0.48}L${r * 0.4} ${r * 0.08}`, ctx.hair);
  if (face) s += dotEye(-r * 0.3, r * 0.55, r * 0.11) + dotEye(r * 0.3, r * 0.55, r * 0.11) + smile(0, r * 0.82, r * 0.4, 0.5);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang})`);
}
function pinecone(x, y, r, ang, ctx) {
  let s = P(`M0 ${-r * 1.4}C${r * 0.9} ${-r * 1.2} ${r * 1.05} ${r * 0.2} 0 ${r * 1.4}C${-r * 1.05} ${r * 0.2} ${-r * 0.9} ${-r * 1.2} 0 ${-r * 1.4}Z`);
  for (const [yy, w, n] of [[-0.9, 0.55, 2], [-0.35, 0.82, 3], [0.2, 0.85, 3], [0.75, 0.6, 2]]) {
    let d = `M${r1(-w * r)} ${r1(yy * r)}`;
    for (let i = 0; i < n; i++) { const x0 = -w * r + (i * 2 * w * r) / n, x1 = x0 + (2 * w * r) / n; d += `Q${r1((x0 + x1) / 2)} ${r1(yy * r + r * 0.42)} ${r1(x1)} ${r1(yy * r)}`; }
    s += curve(d, ctx.thin);
  }
  s += P(`M${-r * 0.12} ${-r * 1.36}L${-r * 0.08} ${-r * 1.75}L${r * 0.1} ${-r * 1.75}L${r * 0.12} ${-r * 1.36}Z`);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang})`);
}
function owl(x, y, k, ctx) {
  let s = '';
  s += P('M-34 -40L-40 -66L-16 -48Z') + P('M34 -40L40 -66L16 -48Z');
  s += blob([[-40, -30], [-30, -56], [0, -60], [30, -56], [40, -30], [42, 20], [24, 50], [0, 56], [-24, 50], [-42, 20]]);
  s += E(0, 22, 24, 26, ctx.thin);
  s += curve('M-10 12Q-6 18 -2 12M2 12Q6 18 10 12M-14 26Q-10 32 -6 26M-4 26Q0 32 4 26M6 26Q10 32 14 26', ctx.hair);
  s += P('M-40 -20C-56 0 -50 30 -34 44C-30 20 -30 0 -40 -20Z') + P('M40 -20C56 0 50 30 34 44C30 20 30 0 40 -20Z');
  s += C(-16, -30, 15) + C(16, -30, 15) + eye(-16, -30, 9, [0.1, 0.1]) + eye(16, -30, 9, [-0.1, 0.1]);
  s += P('M-6 -18L6 -18L0 -6Z');
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}
function bird(x, y, k, ctx, flip = false) {
  let s = '';
  s += P('M-30 0L-52 -14L-48 4Z');
  s += blob([[-34, 0], [-20, -22], [6, -30], [26, -18], [30, 4], [14, 20], [-14, 20]]);
  s += P('M28 -14L44 -10L28 -4Z') + dotEye(14, -16, 4);
  s += P('M-18 -6C-6 -16 10 -10 10 2C0 10 -12 8 -18 -6Z');
  s += line(-4, 20, -6, 32, ctx.thin) + line(6, 20, 8, 32, ctx.thin);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${flip ? -k : k} ${k})`);
}
function snail(x, y, k, ctx) {
  let s = P('M-60 30C-70 30 -72 18 -60 14L40 14C60 14 66 -10 62 -30L70 -30C80 0 70 30 40 30Z');
  s += curve('M58 -28L50 -60M66 -28L72 -58', ctx.thin) + C(50, -62, 5) + C(72, -60, 5) + dotEye(64, -14, 3.5) + curve('M60 0Q66 4 70 0', ctx.thin);
  s += C(0, -18, 38);
  const sp = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24, a = t * 2.6 * PI, rad = 30 * (1 - t * 0.85); sp.push([Math.cos(a) * rad, -18 + Math.sin(a) * rad]); }
  s += smooth(sp, ctx.thin);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}
function crab(x, y, k, ctx) {
  let s = '';
  for (const sd of [-1, 1]) for (const i of [0, 1, 2]) s += curve(`M${sd * 30} ${4 + i * 8}Q${sd * 50} ${i * 8 - 2} ${sd * 58} ${20 + i * 10}`, ctx.thin);
  s += curve('M-24 -6L-40 -30M24 -6L40 -30');
  s += P('M-40 -30C-60 -36 -66 -56 -52 -64L-44 -48L-34 -60C-24 -52 -28 -36 -40 -30Z') + P('M40 -30C60 -36 66 -56 52 -64L44 -48L34 -60C24 -52 28 -36 40 -30Z');
  s += line(-10, -18, -12, -36, ctx.thin) + line(10, -18, 12, -36, ctx.thin) + C(-12, -40, 7) + C(12, -40, 7) + dark(C(-12, -40, 3.5)) + dark(C(12, -40, 3.5));
  s += E(0, 4, 38, 26) + smile(0, 6, 22, 0.4);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}
/** A palm frond from x,y towards ang, drooping. */
const frond = (x, y, ang, len, ctx, bend = 0.22) => leaf(x, y, len, len * 0.2, ang, ctx, { teeth: 9, veins: 0, bend: (ang > -90 ? 1 : -1) * bend, round: 0.7 });
/** Rocks or tufts for the ground line. */
const tuft = (x, y, ctx) => curve(`M${x - 14} ${y}Q${x - 12} ${y - 16} ${x - 20} ${y - 26}M${x} ${y}Q${x} ${y - 20} ${x + 2} ${y - 34}M${x + 14} ${y}Q${x + 14} ${y - 16} ${x + 22} ${y - 24}`);
const ground = (x0, x1, y = 200) => curve(`M${x0} ${y}L${x1} ${y}`);

/** Leaf shapes for the Leaves subject. Each is drawn with its stalk at x,y, pointing at ang. */
function mapleLeaf(x, y, rr, ang, ctx) {
  // right half of the outline, from the top tip down to the stalk; the left half is its mirror image
  const half = [[0, -200], [14, -166], [36, -176], [30, -136], [20, -104], [56, -124], [66, -152], [84, -128], [122, -142], [106, -108], [134, -96], [96, -76], [76, -56], [112, -44], [94, -34], [96, -14], [56, -26], [16, -10], [0, -14]];
  const k = rr / 200;
  const pts = [...half, ...half.slice(1, -1).reverse().map(([a, b]) => [-a, b])].map(([a, b]) => [a * k, b * k]);
  let s = P(`M-4 ${r1(-14 * k)}L-4 ${r1(60 * k)}L4 ${r1(60 * k)}L4 ${r1(-14 * k)}Z`);
  s += P(pathOf(pts));
  for (const [a, b] of [[0, -175], [108, -128], [-108, -128], [96, -42], [-96, -42]]) s += line(0, -16 * k, a * k * 0.85, b * k * 0.85 - 4 * k, ctx.thin);
  for (const sd of [-1, 1]) s += line(0, -110 * k, sd * 22 * k, -150 * k, ctx.hair) + line(sd * 50 * k, -70 * k, sd * 70 * k, -110 * k, ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang + 90}) translate(0 ${r1(-60 * k)})`);
}
function oakLeaf(x, y, len, ang, ctx) {
  // rounded lobes between sinuses, a round tip, and a short stalk
  const sin = [0.06, 0.26, 0.45, 0.62, 0.77], W = (t) => len * (0.13 + 0.12 * Math.sin(PI * Math.min(1, t * 1.05)));
  let d = `M0 0L${r1(len * sin[0])} ${r1(-W(0) * 0.25)}`;
  for (let i = 0; i < sin.length - 1; i++) {
    const a0 = len * sin[i], a1 = len * sin[i + 1], w = W((sin[i] + sin[i + 1]) / 2);
    d += `C${r1(a0 - len * 0.03)} ${r1(-w * 1.1)} ${r1(a1 + len * 0.02)} ${r1(-w * 1.15)} ${r1(a1)} ${r1(-W(sin[i + 1]) * 0.42)}`;
  }
  d += `C${r1(len * 0.86)} ${r1(-len * 0.2)} ${r1(len * 1.04)} ${r1(-len * 0.08)} ${r1(len)} 0C${r1(len * 1.04)} ${r1(len * 0.08)} ${r1(len * 0.86)} ${r1(len * 0.2)} ${r1(len * sin[sin.length - 1])} ${r1(W(sin[sin.length - 1]) * 0.42)}`;
  for (let i = sin.length - 1; i > 0; i--) {
    const a0 = len * sin[i], a1 = len * sin[i - 1], w = W((sin[i] + sin[i - 1]) / 2);
    d += `C${r1(a0 + len * 0.02)} ${r1(w * 1.15)} ${r1(a1 - len * 0.03)} ${r1(w * 1.1)} ${r1(a1)} ${r1(i === 1 ? W(0) * 0.25 : W(sin[i - 1]) * 0.42)}`;
  }
  let s = P(`M2 -4L${r1(-len * 0.16)} -4L${r1(-len * 0.16)} 4L2 4Z`) + P(d + 'Z');
  s += line(0, 0, len * 0.9, 0, ctx.thin);
  for (let i = 0; i < sin.length - 1; i++) { const m = (sin[i] + sin[i + 1]) / 2, w = W(m); for (const sd of [-1, 1]) s += line(len * (m - 0.05), 0, len * (m + 0.02), sd * w * 0.75, ctx.hair); }
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang})`);
}
function ginkgoLeaf(x, y, len, ang, ctx) {
  const w = len * 0.55;
  let s = P(`M-3 0L-3 ${-len * 0.45}L3 ${-len * 0.45}L3 0Z`);
  s += P(`M0 ${-len * 0.42}C${-w * 0.5} ${-len * 0.55} ${-w} ${-len * 0.8} ${-w * 0.9} ${-len * 0.98}Q${-w * 0.5} ${-len * 1.1} ${-w * 0.08} ${-len * 1.0}L0 ${-len * 0.86}L${w * 0.08} ${-len * 1.0}Q${w * 0.5} ${-len * 1.1} ${w * 0.9} ${-len * 0.98}C${w} ${-len * 0.8} ${w * 0.5} ${-len * 0.55} 0 ${-len * 0.42}Z`);
  for (const f of [-0.6, -0.3, 0.3, 0.6]) s += line(0, -len * 0.46, w * f, -len * 0.96, ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang + 90})`);
}
function heartLeaf(x, y, len, ang, ctx) {
  let s = P(`M-3 0L-3 ${-len * 0.3}L3 ${-len * 0.3}L3 0Z`);
  s += P(`M0 ${-len * 0.3}C${-len * 0.2} ${-len * 0.18} ${-len * 0.5} ${-len * 0.3} ${-len * 0.45} ${-len * 0.62}C${-len * 0.4} ${-len * 0.9} ${-len * 0.1} ${-len * 1.0} 0 ${-len * 1.2}C${len * 0.1} ${-len * 1.0} ${len * 0.4} ${-len * 0.9} ${len * 0.45} ${-len * 0.62}C${len * 0.5} ${-len * 0.3} ${len * 0.2} ${-len * 0.18} 0 ${-len * 0.3}Z`);
  s += line(0, -len * 0.32, 0, -len * 1.05, ctx.thin);
  for (const t of [0.5, 0.72]) s += line(0, -len * t, -len * 0.28, -len * (t + 0.15), ctx.hair) + line(0, -len * t, len * 0.28, -len * (t + 0.15), ctx.hair);
  return g(s, `translate(${r1(x)} ${r1(y)}) rotate(${ang + 90})`);
}
const ovalLeaf = (x, y, len, ang, ctx, teeth = 0) => P(`M${r1(x)} ${r1(y)}L${r1(x - Math.cos(ang * D) * len * 0.2)} ${r1(y - Math.sin(ang * D) * len * 0.2)}`, 'fill="none"') + leaf(x, y, len, len * 0.3, ang, ctx, { teeth, veins: 3 });
function caterpillar(x, y, k, ctx) {
  let s = '';
  for (let i = 4; i >= 0; i--) s += C(-i * 22, -Math.abs(Math.sin(i * 1.1)) * 12, 15) + line(-i * 22 - 4, 12, -i * 22 - 6, 20, ctx.thin) + line(-i * 22 + 4, 12, -i * 22 + 6, 20, ctx.thin);
  s += C(20, -14, 19) + dotEye(15, -18, 3.5) + dotEye(27, -18, 3.5) + smile(21, -8, 12, 0.5);
  s += curve('M14 -30Q10 -44 4 -48M26 -30Q30 -44 36 -48', ctx.thin) + C(4, -48, 4) + C(36, -48, 4);
  return g(s, `translate(${r1(x)} ${r1(y)}) scale(${k})`);
}

// ---------------------------------------------------------------- the tree and plant subjects
const appleTree = {
  id: 'apple-tree', name: 'Apple tree', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    const apples = (list, r) => list.map(([x, y]) => apple(x, y, r, ctx, false)).join('');
    if (style === 0) {
      s += trunk(0, 200, -20, 44, 62, ctx);
      s += curve('M-6 40Q-40 10 -70 -10M8 20Q40 0 64 -20', '');
      s += bumpy(0, -70, 185, 125, 13, 0.12, -90, rand);
      s += apples([[-110, -100], [-40, -150], [50, -130], [120, -80], [-70, -30], [20, -60], [110, 0], [-140, -20], [-10, 10]], 20);
      s += apple(-100, 180, 20, ctx) + apple(90, 185, 16, ctx, false) + tuft(-160, 200, ctx) + tuft(160, 200, ctx);
      return s;
    }
    if (style === 1) {
      // with a basket of picked apples and a bird
      s += trunk(-30, 200, -10, 40, 58, ctx);
      s += bumpy(-30, -90, 160, 105, 12, 0.13, -90, rand) + bumpy(80, -40, 90, 70, 7, 0.14, -60, rand);
      s += apples([[-120, -110], [-50, -150], [30, -130], [-80, -60], [0, -70], [80, -30], [120, -60], [-140, -40]], 18);
      s += bird(-10, -175, 0.8, ctx);
      // basket
      s += P('M70 150C70 80 170 80 170 150L160 150C160 95 80 95 80 150Z');
      s += apples([[95, 140], [125, 132], [150, 142]], 18);
      s += P('M60 140L180 140L166 200L74 200Z') + curve('M66 160L174 160M70 180L170 180', ctx.thin);
      s += tuft(-140, 200, ctx);
      return s;
    }
    if (style === 2) {
      // a swing hanging from a branch
      s += trunk(-60, 200, -30, 46, 64, ctx);
      s += tube([[-50, -10], [20, -40], [120, -50]], 22, 14);
      s += bumpy(-10, -110, 190, 95, 13, 0.12, -90, rand);
      s += apples([[-140, -110], [-80, -160], [0, -150], [80, -130], [150, -90], [-30, -90], [50, -80], [-120, -60]], 18);
      s += curve('M60 -40L60 130M130 -45L130 130', '') + R(40, 128, 110, 18, 6);
      s += apple(-150, 186, 14, ctx, false) + tuft(170, 200, ctx);
      return s;
    }
    // a friendly apple tree with a face, apples and fallen apples
    s += trunk(0, 200, -10, 70, 90, ctx, false);
    s += C(-24, 90, 12) + C(24, 90, 12) + dark(C(-24, 92, 6)) + dark(C(24, 92, 6)) + smile(0, 120, 36, 0.45);
    s += bumpy(0, -80, 165, 125, 11, 0.16, -90, rand);
    s += apples([[-90, -120], [0, -160], [90, -120], [-110, -40], [110, -40], [-40, -60], [40, -60], [0, 0]], 22);
    s += apple(-120, 182, 18, ctx) + apple(130, 182, 18, ctx);
    return s;
  },
};

const pineTree = {
  id: 'pine-tree', name: 'Pine tree', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'snow', 'forest', 'hills', 'night', 'meadow'],
  pairScenes: ['snow', 'forest'],
  draw(style, rand, ctx) {
    let s = '';
    // one tier: a triangle with a scalloped (drooping) lower edge
    const tier = (cx, top, bot, w, n = 5) => {
      let d = `M${r1(cx)} ${r1(top)}L${r1(cx + w)} ${r1(bot)}`;
      for (let i = 0; i < n; i++) { const x0 = cx + w - (i * 2 * w) / n, x1 = x0 - (2 * w) / n; d += `Q${r1((x0 + x1) / 2)} ${r1(bot + w * 0.14)} ${r1(x1)} ${r1(bot)}`; }
      return P(d + 'Z');
    };
    const pine = (cx, yb, h, w, tiers, snowy = false) => {
      let t = R(cx - w * 0.12, yb - h * 0.16, w * 0.24, h * 0.16, 3);
      for (let i = 0; i < tiers; i++) {
        const f = i / tiers;
        const bot = yb - h * 0.12 - (h * 0.88 * i) / (tiers + 0.4);
        const top = bot - h * 0.88 * 0.55;
        const ww = w * (1 - f * 0.62);
        t += tier(cx, Math.max(top, yb - h), bot, ww, Math.max(3, 6 - i));
        if (snowy) {
          let d = `M${r1(cx - ww * 0.55)} ${r1(bot - (bot - top) * 0.45)}`;
          d += `Q${r1(cx)} ${r1(bot - (bot - top) * 0.6)} ${r1(cx + ww * 0.55)} ${r1(bot - (bot - top) * 0.45)}`;
          d += `Q${r1(cx + ww * 0.3)} ${r1(bot - (bot - top) * 0.25)} ${r1(cx + ww * 0.15)} ${r1(bot - (bot - top) * 0.36)}Q${r1(cx)} ${r1(bot - (bot - top) * 0.2)} ${r1(cx - ww * 0.15)} ${r1(bot - (bot - top) * 0.36)}Q${r1(cx - ww * 0.3)} ${r1(bot - (bot - top) * 0.25)} ${r1(cx - ww * 0.55)} ${r1(bot - (bot - top) * 0.45)}Z`;
          t += P(d);
        }
      }
      return t;
    };
    if (style === 0) {
      s += pine(0, 200, 400, 170, 4);
      s += pinecone(-130, 175, 20, -30, ctx) + tuft(150, 200, ctx);
      return s;
    }
    if (style === 1) {
      s += pine(0, 180, 380, 170, 4, true);
      s += P('M-200 200Q-120 160 -40 175Q40 160 120 172Q170 178 200 200Z');
      return s;
    }
    if (style === 2) {
      s += pine(-110, 190, 250, 100, 3) + pine(110, 200, 290, 110, 3) + pine(0, 200, 380, 140, 4);
      s += tuft(-180, 200, ctx) + tuft(180, 200, ctx);
      return s;
    }
    // with pinecones and a little bird
    s += pine(0, 200, 400, 175, 4);
    s += pinecone(-70, 40, 18, 10, ctx) + pinecone(60, -40, 16, -10, ctx) + pinecone(40, 130, 18, 5, ctx);
    s += pinecone(-150, 176, 20, -60, ctx) + pinecone(155, 180, 19, 70, ctx);
    s += bird(-60, -100, 0.7, ctx);
    return s;
  },
};

const palmTree = {
  id: 'palm-tree', name: 'Palm tree', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'hills', 'meadow', 'night', 'rain', 'water'],
  pairScenes: ['hills'],
  draw(style, rand, ctx) {
    let s = '';
    const palm = (bx, by, tx, ty, bendX, w, size) => {
      const line_ = [[bx, by], [bx + bendX * 0.3, (by * 2 + ty) / 3], [tx - bendX * 0.2, (by + ty * 2) / 3], [tx, ty]];
      let t = tube(line_, w, w * 0.7);
      // trunk rings
      const sm = cr(line_, 12);
      for (let i = 4; i < sm.length - 3; i += 4) {
        const p = sm[i], q = sm[i + 1], m = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
        const nx = -(q[1] - p[1]) / m, ny = (q[0] - p[0]) / m, ww = (w - (w * 0.3 * i) / sm.length) / 2;
        t += curve(`M${r1(p[0] - nx * ww)} ${r1(p[1] - ny * ww)}Q${r1(p[0] + (q[0] - p[0]) * 3)} ${r1(p[1] + (q[1] - p[1]) * 3)} ${r1(p[0] + nx * ww)} ${r1(p[1] + ny * ww)}`, ctx.thin);
      }
      for (const a of [-170, -10, -140, -40]) t += frond(tx, ty, a, size * (a === -140 || a === -40 ? 0.85 : 1), ctx, 0.3);
      t += frond(tx, ty, -95, size * 0.7, ctx, 0.15) + frond(tx, ty, 160, size * 0.8, ctx, 0.25) + frond(tx, ty, 20, size * 0.8, ctx, 0.25);
      t += C(tx - size * 0.1, ty + size * 0.1, size * 0.1) + C(tx + size * 0.1, ty + size * 0.12, size * 0.1) + C(tx, ty + size * 0.2, size * 0.1);
      return t;
    };
    if (style === 0) {
      s += palm(-10, 200, 30, -110, 70, 40, 170);
      s += P('M-120 200Q-60 175 0 180Q60 172 120 200Z') + C(80, 186, 12) + C(100, 190, 11);
      return s;
    }
    if (style === 1) {
      // two palms with a hammock
      s += palm(-130, 200, -95, -70, 40, 30, 110) + palm(130, 200, 100, -40, -40, 30, 110);
      s += P('M-110 30Q0 130 110 40L110 56Q0 150 -110 46Z') + curve('M-60 74Q0 110 60 80', ctx.thin);
      s += ground(-200, 200);
      return s;
    }
    if (style === 2) {
      // a little island with the sea round it
      s += palm(-30, 150, 10, -130, 60, 34, 150);
      s += P('M-170 160Q-100 110 0 112Q100 108 170 160Z');
      s += curve('M-200 175Q-170 160 -140 175T-80 175T-20 175T40 175T100 175T160 175T220 175', '') + curve('M-180 196Q-150 182 -120 196T-60 196T0 196T60 196T120 196T180 196', ctx.thin);
      s += crab(90, 135, 0.5, ctx);
      return s;
    }
    // beach palm with a crab and a shell
    s += palm(40, 200, 10, -110, -60, 40, 160);
    s += P('M-200 200Q-120 165 -20 172Q100 160 200 200Z');
    s += crab(-110, 165, 0.75, ctx);
    s += P('M120 188C110 170 130 156 140 150C150 156 170 170 160 188Z') + curve('M140 150L132 186M140 150L140 188M140 150L148 186', ctx.hair);
    return s;
  },
};

const oakTree = {
  id: 'oak-tree', name: 'Oak tree', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    // a broad, lumpy oak crown with a few leaf-cluster lines inside
    const oakCrown = (cx, cy, w, h, avoid = []) => {
      let t = bumpy(cx, cy, w, h, 12, 0.2, -90, rand), made = 0;
      // little scalloped marks for clumps of leaves, kept away from the acorns
      for (const [fx, fy] of [[-0.55, 0.25], [0.3, -0.35], [-0.25, -0.5], [0.55, 0.3], [0, 0.4], [-0.7, -0.15], [0.7, -0.15], [0.1, -0.1]]) {
        const x0 = cx + fx * w - 22, y0 = cy + fy * h;
        if (made >= 4 || avoid.some(([ax, ay]) => Math.hypot(ax - x0 - 22, ay - y0) < 50)) continue;
        made++;
        t += curve(`M${r1(x0)} ${r1(y0)}Q${r1(x0 + 11)} ${r1(y0 - 14)} ${r1(x0 + 22)} ${r1(y0)}Q${r1(x0 + 33)} ${r1(y0 - 14)} ${r1(x0 + 44)} ${r1(y0)}`, ctx.thin);
      }
      return t;
    };
    const limbs = (x, y, w) => tube([[x, y + 40], [x - w * 0.3, y], [x - w * 0.7, y - 30]], 26, 14) + tube([[x, y + 30], [x + w * 0.35, y - 6], [x + w * 0.7, y - 34]], 24, 14);
    if (style === 0) {
      s += limbs(0, 10, 140) + trunk(0, 200, -40, 64, 90, ctx);
      const ac = [[-120, -100, 10], [-45, -150, -10], [45, -150, 15], [120, -95, -5], [-60, -40, 0], [60, -45, 8], [0, -80, -6]];
      s += oakCrown(0, -95, 168, 100, ac);
      for (const [x, y, a] of ac) s += acorn(x, y, 19, a, ctx);
      s += acorn(-120, 178, 15, 70, ctx) + acorn(115, 182, 14, -80, ctx) + tuft(165, 200, ctx);
      return s;
    }
    if (style === 1) {
      // with a hole and an owl looking out
      s += limbs(0, -10, 130) + trunk(0, 200, -60, 100, 120, ctx, false);
      s += E(0, 70, 34, 46) + owl(0, 82, 0.62, ctx);
      s += curve('M-34 140Q-28 160 -34 180M34 130Q40 150 34 168', ctx.thin);
      const ac = [[-110, -95, 10], [-40, -150, -10], [55, -140, 15], [115, -80, -5], [5, -80, 0]];
      s += oakCrown(0, -115, 165, 88, ac);
      for (const [x, y, a] of ac) s += acorn(x, y, 19, a, ctx);
      return s;
    }
    if (style === 2) {
      // autumn: leaves falling and acorns on the ground
      s += limbs(-20, 0, 120) + trunk(-20, 200, -40, 58, 84, ctx);
      const ac = [[-110, -110, 10], [-20, -150, -10], [60, -100, 15], [-60, -50, 0]];
      s += oakCrown(-25, -105, 150, 92, ac);
      for (const [x, y, a] of ac) s += acorn(x, y, 18, a, ctx);
      s += oakLeaf(140, -10, 95, 50, ctx) + oakLeaf(120, 90, 90, -20, ctx) + oakLeaf(-185, 20, 85, 110, ctx);
      s += acorn(60, 180, 15, 80, ctx) + acorn(100, 184, 14, 100, ctx) + acorn(-110, 182, 14, -70, ctx);
      return s;
    }
    // two cute acorns in front of a young oak
    s += limbs(0, -30, 110) + trunk(0, 160, -60, 50, 64, ctx, false);
    const ac = [[-80, -110, 10], [0, -150, -6], [80, -100, -10], [20, -60, 6]];
    s += oakCrown(0, -105, 150, 85, ac);
    for (const [x, y, a] of ac) s += acorn(x, y, 16, a, ctx);
    s += P('M-200 200Q-100 140 0 152Q100 140 200 200Z');
    s += acorn(-70, 110, 36, -8, ctx, true) + acorn(70, 116, 32, 10, ctx, true);
    return s;
  },
};

const cactus = {
  id: 'cactus', name: 'Cactus', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'hills', 'night', 'meadow', 'garden', 'rain'],
  pairScenes: ['hills'],
  draw(style, rand, ctx) {
    let s = '';
    const spines = (pts) => pts.map(([x, y, a]) => { const f = (o) => [x + Math.cos((a + o) * D) * 13, y + Math.sin((a + o) * D) * 13]; const [p1, p2, p3] = [f(-30), f(0), f(30)]; return curve(`M${r1(p1[0])} ${r1(p1[1])}L${x} ${y}L${r1(p3[0])} ${r1(p3[1])}M${x} ${y}L${r1(p2[0])} ${r1(p2[1])}`, ctx.hair); }).join('');
    const ribs = (x, y0, y1, w) => curve(`M${x - w * 0.35} ${y0}Q${x - w * 0.42} ${(y0 + y1) / 2} ${x - w * 0.3} ${y1}M${x + w * 0.35} ${y0}Q${x + w * 0.42} ${(y0 + y1) / 2} ${x + w * 0.3} ${y1}`, ctx.thin);
    const bloom = (x, y, r) => { let t = ''; for (let i = 0; i < 5; i++) { const a = -90 + (i - 2) * 32; t += g(E(0, -r * 0.55, r * 0.32, r * 0.6), `translate(${r1(x)} ${r1(y)}) rotate(${a + 90})`); } return t + C(x, y, r * 0.3); };
    if (style === 0) {
      // saguaro in the desert
      s += P('M-120 40C-130 40 -138 30 -138 10L-138 -70C-138 -94 -98 -94 -98 -70L-98 0C-98 6 -94 10 -88 10L-50 10L-50 60L-110 60C-130 60 -138 50 -138 30Z');
      s += P('M120 70C130 70 138 60 138 40L138 -30C138 -54 98 -54 98 -30L98 30C98 36 94 40 88 40L50 40L50 90L110 90C130 90 138 80 138 60Z');
      s += P('M-50 200L-50 -120C-50 -180 50 -180 50 -120L50 200Z');
      s += ribs(0, -150, 196, 100) + curve('M-120 -70L-120 20M120 -30L120 60', ctx.thin);
      s += spines([[-50, -100, 200], [50, -60, -20], [-50, 40, 190], [50, 130, -10], [-138, -40, 190], [138, 0, -10], [-20, -30, -100], [20, 60, -80]]);
      s += bloom(0, -168, 28);
      s += P('M-200 200Q-180 176 -150 180Q-130 176 -120 200Z') + P('M120 200Q140 170 170 176Q196 182 200 200Z');
      return s;
    }
    if (style === 1) {
      // round barrel cactus in a pot, with a flower
      s += P('M-90 50C-110 -40 -70 -110 0 -110C70 -110 110 -40 90 50Z');
      s += curve('M-40 -100Q-70 -30 -55 50M0 -110L0 50M40 -100Q70 -30 55 50', ctx.thin);
      s += spines([[-70, -40, 200], [70, -40, -20], [-30, -70, -120], [30, -70, -60], [-85, 20, 190], [85, 20, -10], [-27, 0, 180], [27, 0, 0]]);
      s += bloom(0, -112, 34);
      s += pot(0, 200, 210, 150, ctx, 'heart');
      return s;
    }
    if (style === 2) {
      // prickly pear: flat round pads with fruits
      s += E(0, 120, 60, 80) + g(E(0, 0, 50, 70), 'translate(-80 0) rotate(-25)') + g(E(0, 0, 52, 72), 'translate(80 -10) rotate(22)');
      s += g(E(0, 0, 42, 58), 'translate(-120 -110) rotate(-15)') + g(E(0, 0, 44, 60), 'translate(10 -110) rotate(8)') + g(E(0, 0, 38, 52), 'translate(120 -120) rotate(25)');
      s += spines([[-20, 90, -90], [20, 140, -90], [-90, -20, -90], [-60, 30, -90], [70, -30, -90], [100, 20, -90], [-120, -120, -90], [0, -130, -90], [30, -80, -90], [110, -130, -90], [-15, 160, -90], [-110, 20, -90]]);
      s += E(-130, -178, 14, 18) + E(0, -178, 14, 18) + E(130, -180, 13, 17) + E(-40, -160, 12, 16);
      s += P('M-160 200Q-60 180 0 186Q80 180 160 200Z');
      return s;
    }
    // three cacti in little pots, one smiling
    s += P('M-170 100L-170 0C-170 -30 -110 -30 -110 0L-110 100Z') + ribs(-140, -10, 96, 40);
    s += P('M-50 100L-50 -120C-50 -170 50 -170 50 -120L50 100Z');
    s += P('M-50 -20L-80 -20C-96 -20 -100 -30 -100 -50L-100 -70C-100 -86 -80 -86 -80 -70L-80 -45L-50 -45Z');
    s += dotEye(-18, -90, 7) + dotEye(18, -90, 7) + smile(0, -70, 30, 0.5) + C(-30, -72, 7, ctx.hair) + C(30, -72, 7, ctx.hair);
    s += blob([[100, 100], [86, 40], [100, 4], [135, -6], [170, 4], [184, 40], [170, 100]]) + curve('M135 -4Q118 40 124 100M135 -4Q154 40 148 100', ctx.thin) + spines([[95, 40, 200], [178, 40, -20], [135, -6, -90]]);
    s += bloom(0, -150, 24);
    s += pot(-140, 200, 90, 100, ctx, 'dots') + pot(0, 200, 120, 100, ctx, 'heart') + pot(135, 200, 100, 100, ctx, 'star');
    return s;
  },
};

const mushroom = {
  id: 'mushroom', name: 'Mushroom', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'rain', 'garden', 'night'],
  pairScenes: ['forest', 'meadow'],
  draw(style, rand, ctx) {
    let s = '';
    const shroom = (x, yb, h, capW, capH, o = {}) => {
      const sw = o.sw || capW * 0.32;
      let t = P(`M${r1(x - sw / 2)} ${r1(yb)}C${r1(x - sw * 0.6)} ${r1(yb - h * 0.4)} ${r1(x - sw * 0.4)} ${r1(yb - h * 0.8)} ${r1(x - sw * 0.38)} ${r1(yb - h)}L${r1(x + sw * 0.38)} ${r1(yb - h)}C${r1(x + sw * 0.4)} ${r1(yb - h * 0.8)} ${r1(x + sw * 0.6)} ${r1(yb - h * 0.4)} ${r1(x + sw / 2)} ${r1(yb)}Z`);
      if (o.skirt) t += P(`M${r1(x - sw * 0.45)} ${r1(yb - h * 0.62)}Q${r1(x)} ${r1(yb - h * 0.55)} ${r1(x + sw * 0.45)} ${r1(yb - h * 0.62)}L${r1(x + sw * 0.7)} ${r1(yb - h * 0.45)}Q${r1(x)} ${r1(yb - h * 0.32)} ${r1(x - sw * 0.7)} ${r1(yb - h * 0.45)}Z`);
      const cy = yb - h;
      if (o.shape === 'cone') t += P(`M${r1(x - capW / 2)} ${r1(cy + 4)}C${r1(x - capW * 0.45)} ${r1(cy - capH * 0.6)} ${r1(x - capW * 0.15)} ${r1(cy - capH)} ${r1(x)} ${r1(cy - capH)}C${r1(x + capW * 0.15)} ${r1(cy - capH)} ${r1(x + capW * 0.45)} ${r1(cy - capH * 0.6)} ${r1(x + capW / 2)} ${r1(cy + 4)}Q${r1(x)} ${r1(cy + capH * 0.18)} ${r1(x - capW / 2)} ${r1(cy + 4)}Z`);
      else if (o.shape === 'flat') t += P(`M${r1(x - capW / 2)} ${r1(cy + 2)}C${r1(x - capW / 2)} ${r1(cy - capH)} ${r1(x + capW / 2)} ${r1(cy - capH)} ${r1(x + capW / 2)} ${r1(cy + 2)}Q${r1(x)} ${r1(cy + capH * 0.25)} ${r1(x - capW / 2)} ${r1(cy + 2)}Z`) + curve(`M${r1(x - capW * 0.35)} ${r1(cy + capH * 0.08)}Q${r1(x)} ${r1(cy + capH * 0.2)} ${r1(x + capW * 0.35)} ${r1(cy + capH * 0.08)}`, ctx.thin);
      else t += P(`M${r1(x - capW / 2)} ${r1(cy + capH * 0.1)}C${r1(x - capW * 0.55)} ${r1(cy - capH * 0.9)} ${r1(x + capW * 0.55)} ${r1(cy - capH * 0.9)} ${r1(x + capW / 2)} ${r1(cy + capH * 0.1)}Q${r1(x + capW * 0.3)} ${r1(cy + capH * 0.28)} ${r1(x)} ${r1(cy + capH * 0.2)}Q${r1(x - capW * 0.3)} ${r1(cy + capH * 0.28)} ${r1(x - capW / 2)} ${r1(cy + capH * 0.1)}Z`);
      const top = o.shape === 'cone' ? 0.95 : o.shape === 'flat' ? 0.7 : 0.66;
      for (const [dx, dy, r] of o.spots || []) t += E(x + dx * capW, cy - dy * capH * top, r * capW, r * capW * 0.8);
      return t;
    };
    if (style === 0) {
      s += shroom(0, 200, 170, 340, 230, { sw: 100, skirt: true, spots: [[0, 0.5, 0.08], [-0.28, 0.3, 0.06], [0.28, 0.32, 0.065], [-0.14, 0.62, 0.04], [0.18, 0.62, 0.045], [-0.4, 0.05, 0.04], [0.4, 0.06, 0.04]] });
      s += tuft(-110, 200, ctx) + tuft(110, 200, ctx) + littleFlower(-160, 200, 60) ;
      return s;
    }
    if (style === 1) {
      // a family of three different mushrooms
      s += shroom(-110, 200, 110, 150, 110, { shape: 'cone', sw: 50, spots: [[0, 0.6, 0.07], [-0.2, 0.3, 0.06], [0.22, 0.3, 0.05]] });
      s += shroom(105, 200, 70, 160, 80, { shape: 'flat', sw: 50 });
      s += shroom(0, 200, 160, 220, 150, { skirt: true, sw: 70, spots: [[0, 0.5, 0.08], [-0.28, 0.25, 0.06], [0.28, 0.28, 0.06]] });
      s += tuft(-185, 200, ctx) + tuft(180, 200, ctx);
      return s;
    }
    if (style === 2) {
      // a mushroom house
      s += P('M-90 200L-80 -10L80 -10L90 200Z');
      s += P('M-30 200L-30 120C-30 80 30 80 30 120L30 200Z') + C(18, 150, 4);
      s += C(-50, 40, 22) + line(-72, 40, -28, 40, ctx.thin) + line(-50, 18, -50, 62, ctx.thin);
      s += C(52, 50, 18) + line(34, 50, 70, 50, ctx.thin);
      s += P('M-190 10C-190 -150 190 -150 190 10Q100 40 0 30Q-100 40 -190 10Z');
      for (const [x, y, r] of [[0, -100, 26], [-100, -50, 22], [100, -50, 22], [-50, -10, 14], [50, -8, 14], [-150, 0, 12], [150, 2, 12]]) s += E(x, y, r, r * 0.8);
      s += littleFlower(-130, 200, 60) + littleFlower(130, 200, 70);
      return s;
    }
    // a mushroom with a snail friend
    s += shroom(30, 200, 150, 280, 180, { sw: 80, skirt: false, spots: [[0, 0.5, 0.07], [-0.27, 0.28, 0.055], [0.3, 0.3, 0.06], [-0.1, 0.18, 0.04], [0.15, 0.7, 0.04]] });
    s += shroom(150, 200, 60, 80, 60, { sw: 26, spots: [[0, 0.5, 0.1]] });
    s += snail(-110, 160, 1.15, ctx);
    return s;
  },
};

const leaves = {
  id: 'leaves', name: 'Leaves', styles: 4, kind: 'float',
  scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'rain', 'sky', 'hills'],
  pairScenes: ['sky'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return mapleLeaf(0, 190, 290, -90, ctx) + ladybug(-50, -40, 0.8, -30, ctx);
    if (style === 1) return oakLeaf(-10, 175, 330, -80, ctx) + ladybug(40, -60, 0.9, 30, ctx);
    if (style === 2) {
      // a collection of different leaf shapes
      s += mapleLeaf(-95, 10, 160, -100, ctx) + oakLeaf(40, -40, 170, -60, ctx);
      s += ginkgoLeaf(-120, 150, 120, -70, ctx) + heartLeaf(15, 175, 110, -95, ctx) + ovalLeaf(100, 180, 150, -70, ctx, 7);
      return s;
    }
    // a twig with leaves and a caterpillar
    s += tube([[-180, 170], [-80, 80], [30, 10], [150, -80]], 16, 8);
    for (const [t, sd, l] of [[0.16, -1, 105], [0.3, 1, 105], [0.46, -1, 100], [0.6, 1, 95], [0.76, -1, 85], [0.9, 1, 70]]) {
      const p = along([[-180, 170], [-80, 80], [30, 10], [150, -80]], t);
      s += leaf(p[0], p[1], l, l * 0.34, -36 + sd * 62, ctx, { veins: 3 });
    }
    s += leaf(148, -78, 70, 24, -36, ctx, { veins: 2 });
    s += caterpillar(-30, 30, 0.8, ctx);
    return s;
  },
};

export default [
  {
    id: 'flowers', name: 'Flowers', order: 20,
    scenes: ['plain', 'hearts', 'stars', 'garden', 'meadow', 'hills', 'rain', 'night'],
    pairScenes: ['garden', 'meadow'],
    icon: 'sunflower', kind: 'ground',
    subjects: [rose, sunflower, tulip, daisy, lotus, hibiscus, lily, bouquet],
  },
  {
    id: 'plants', name: 'Trees and plants', order: 21,
    scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'forest', 'garden', 'rain'],
    pairScenes: ['meadow', 'hills'],
    icon: 'apple-tree', kind: 'ground',
    subjects: [appleTree, pineTree, palmTree, oakTree, cactus, mushroom, leaves],
  },
];
