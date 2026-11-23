// Wild animals and sea life for the Yaanstep Sprouts coloring pages (SCRUM-515).
// Every shape here is drawn by this code. Nothing is traced or downloaded.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring, r1 } from '../lib.mjs';

// ---------------------------------------------------------------- local helpers

const D2R = Math.PI / 180;
/** A point on an ellipse at an angle in degrees (0 = right, 90 = down, 270 = up). */
const onE = (cx, cy, rx, ry, a) => [cx + Math.cos(a * D2R) * rx, cy + Math.sin(a * D2R) * ry];
const pt = (p) => `${r1(p[0])} ${r1(p[1])}`;
/** Shrink a ground drawing by k, keeping its feet on y = 200. */
const fit = (inner, k) => g(inner, `translate(0 ${r1(200 - 200 * k)}) scale(${k})`);
const tr = (x, y, s = 1, extra = '') => `translate(${r1(x)} ${r1(y)}) scale(${s})${extra ? ' ' + extra : ''}`;

/** A scalloped ring (mane, fluffy ears, tree tops): n bumps around an ellipse. */
function bumpy(cx, cy, rx, ry, n, bump = 0.18, start = -90, a = '') {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = start + (i * 360) / n;
    const p = onE(cx, cy, rx, ry, t);
    if (i === 0) { d = `M${pt(p)}`; continue; }
    const m = onE(cx, cy, rx * (1 + bump * 2), ry * (1 + bump * 2), t - 180 / n);
    d += `Q${pt(m)} ${pt(p)}`;
  }
  return P(d + 'Z', a);
}

/** A stripe that starts on the edge of an ellipse (between angles a1 and a2) and tapers inwards. */
function edgeStripe(cx, cy, rx, ry, a1, a2, depth, skew = 0, a = '') {
  const p1 = onE(cx, cy, rx, ry, a1), p2 = onE(cx, cy, rx, ry, a2);
  const am = (a1 + a2) / 2 + skew;
  const tip = onE(cx, cy, rx * (1 - depth), ry * (1 - depth), am);
  const mid = onE(cx, cy, rx * (1 - depth * 0.45), ry * (1 - depth * 0.45), (a1 + a2) / 2 + skew * 0.5);
  const big = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return P(`M${pt(p1)}A${r1(rx)} ${r1(ry)} 0 ${big} 1 ${pt(p2)}Q${pt([mid[0] + (p2[0] - p1[0]) * 0.15, mid[1] + (p2[1] - p1[1]) * 0.15])} ${pt(tip)}Q${pt([mid[0] - (p2[0] - p1[0]) * 0.15, mid[1] - (p2[1] - p1[1]) * 0.15])} ${pt(p1)}Z`, a);
}

/** A band across an ellipse: along the edge from a1 to a2, across, then along the edge from b1 to b2. */
function ellipseBand(cx, cy, rx, ry, a1, a2, b1, b2, a = '') {
  const p = (t) => pt(onE(cx, cy, rx, ry, t));
  return P(`M${p(a1)}A${r1(rx)} ${r1(ry)} 0 0 1 ${p(a2)}L${p(b1)}A${r1(rx)} ${r1(ry)} 0 0 1 ${p(b2)}Z`, a);
}

/** Sample a smooth (Catmull-Rom) line through points. */
function crSample(pts, steps = 8) {
  const out = [], n = pts.length;
  const at = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[n - 1]);
  return out;
}

/** A tube along a smooth line (tails, trunks, tentacles, necks). Width goes from w0 to w1. Round end; start is round too if capStart. */
function tube(pts, w0, w1, opts = {}) {
  const { steps = 8, capStart = true, widths = null } = opts;
  const c = crSample(pts, steps), N = c.length, L = [], Rt = [], dirs = [];
  for (let i = 0; i < N; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(N - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; dirs.push([dx, dy]);
    const t = i / (N - 1);
    const w = (widths ? widths(t) : w0 + (w1 - w0) * t) / 2;
    L.push([c[i][0] + dy * w, c[i][1] - dx * w]);
    Rt.push([c[i][0] - dy * w, c[i][1] + dx * w]);
  }
  const we = (widths ? widths(1) : w1) / 2 * 1.33, ws = (widths ? widths(0) : w0) / 2 * 1.33;
  const [ex, ey] = dirs[N - 1], [sx, sy] = dirs[0];
  let d = `M${pt(Rt[0])}`;
  if (capStart) d = `M${pt(L[0])}C${pt([L[0][0] - sx * ws, L[0][1] - sy * ws])} ${pt([Rt[0][0] - sx * ws, Rt[0][1] - sy * ws])} ${pt(Rt[0])}`;
  for (let i = 1; i < N; i++) d += `L${pt(Rt[i])}`;
  d += `C${pt([Rt[N - 1][0] + ex * we, Rt[N - 1][1] + ey * we])} ${pt([L[N - 1][0] + ex * we, L[N - 1][1] + ey * we])} ${pt(L[N - 1])}`;
  for (let i = N - 2; i >= 0; i--) d += `L${pt(L[i])}`;
  return { d: d + 'Z', L, R: Rt, c, N };
}
const tubeP = (pts, w0, w1, opts, a = '') => P(tube(pts, w0, w1, opts).d, a);
/** A closed band across a tube between sample i0 and i1 (stripes on tails and trunks). */
const tubeBand = (t, i0, i1, a = '') => {
  let d = `M${pt(t.L[i0])}`;
  for (let i = i0 + 1; i <= i1; i++) d += `L${pt(t.L[i])}`;
  for (let i = i1; i >= i0; i--) d += `L${pt(t.R[i])}`;
  return P(d + 'Z', a);
};
/** Thin lines across a tube (wrinkles on a trunk, rings on a tail). */
const tubeLines = (t, idx, a) => idx.map((i) => curve(`M${pt(t.L[i])}Q${pt([(t.L[i][0] + t.R[i][0]) / 2 + (t.c[Math.min(t.N - 1, i + 1)][0] - t.c[i][0]) * 0.8, (t.L[i][1] + t.R[i][1]) / 2 + (t.c[Math.min(t.N - 1, i + 1)][1] - t.c[i][1]) * 0.8])} ${pt(t.R[i])}`, a)).join('');

/** A leg: rounded rectangle with two toe lines at the bottom. */
const leg = (x, top, w, ctx, bottom = 200, toes = true) => R(x, top, w, bottom - top, w / 2) + (toes ? line(x + w * 0.36, bottom - 3, x + w * 0.36, bottom - w * 0.3, ctx.thin) + line(x + w * 0.64, bottom - 3, x + w * 0.64, bottom - w * 0.3, ctx.thin) : '');
/** A band across a leg made with leg(): same left and right edges. */
const legBand = (x, w, y0, y1) => R(x, y0, w, y1 - y0);
/** A rounded nose: wide at the top, pointed at the bottom. */
const nose = (x, y, w, h) => P(`M${r1(x - w)} ${r1(y)}Q${r1(x)} ${r1(y - h * 0.35)} ${r1(x + w)} ${r1(y)}Q${r1(x + w * 0.5)} ${r1(y + h)} ${r1(x)} ${r1(y + h)}Q${r1(x - w * 0.5)} ${r1(y + h)} ${r1(x - w)} ${r1(y)}Z`);
/** A cat-family mouth under a nose: a little 'w'. */
const catMouth = (x, y, s, a = '') => curve(`M${r1(x)} ${r1(y)}L${r1(x)} ${r1(y + s * 0.5)}M${r1(x - s)} ${r1(y + s * 0.6)}Q${r1(x - s * 0.45)} ${r1(y + s * 1.15)} ${r1(x)} ${r1(y + s * 0.5)}Q${r1(x + s * 0.45)} ${r1(y + s * 1.15)} ${r1(x + s)} ${r1(y + s * 0.6)}`, a);
/** Closed sleepy eye. */
const sleepEye = (x, y, w, a = '') => curve(`M${r1(x - w)} ${r1(y)}Q${r1(x)} ${r1(y + w * 0.8)} ${r1(x + w)} ${r1(y)}`, a);
/** A water drop. */
const drop = (x, y, s, ang = 0) => g(P(`M0 ${-s}C${s * 0.5} ${-s * 0.2} ${s * 0.65} ${s * 0.35} 0 ${s * 0.6}C${-s * 0.65} ${s * 0.35} ${-s * 0.5} ${-s * 0.2} 0 ${-s}Z`), `translate(${r1(x)} ${r1(y)}) rotate(${ang})`);
/** A leaf shape pointing along angle ang. */
const leafAt = (x, y, len, ang, ctx, wide = 0.38) => g(P(`M0 0Q${r1(len * 0.5)} ${r1(-len * wide)} ${r1(len)} 0Q${r1(len * 0.5)} ${r1(len * wide)} 0 0Z`) + line(len * 0.1, 0, len * 0.8, 0, ctx.hair), `translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})`);
/** A paw pad: one pad and three toe beans. */
const pawPad = (x, y, s) => E(x, y + s * 0.25, s * 0.42, s * 0.32) + C(x - s * 0.42, y - s * 0.3, s * 0.15) + C(x, y - s * 0.45, s * 0.15) + C(x + s * 0.42, y - s * 0.3, s * 0.15);
/** Soft blob patches inside an area (giraffe patches). */
const patch = (x, y, r, rand) => blob(ring(x, y, r, r * 0.82, 6, rand.range(0, 1), 0.18, rand));

// ---------------------------------------------------------------- WILD ANIMALS

// Lion: a mane and a friendly cat face.
function lionFace(x, y, r, ctx, mane = true) {
  let s = '';
  if (mane) s += bumpy(x, y - r * 0.05, r * 1.55, r * 1.48, 15, 0.13);
  s += C(x - r * 0.78, y - r * 0.8, r * 0.3) + C(x - r * 0.78, y - r * 0.8, r * 0.15) + C(x + r * 0.78, y - r * 0.8, r * 0.3) + C(x + r * 0.78, y - r * 0.8, r * 0.15);
  s += E(x, y, r, r * 0.9);
  s += eye(x - r * 0.38, y - r * 0.2, r * 0.17, [0, 0.2]) + eye(x + r * 0.38, y - r * 0.2, r * 0.17, [0, 0.2]);
  s += E(x - r * 0.24, y + r * 0.38, r * 0.28, r * 0.22) + E(x + r * 0.24, y + r * 0.38, r * 0.28, r * 0.22);
  s += nose(x, y + r * 0.12, r * 0.18, r * 0.2);
  s += curve(`M${r1(x - r * 0.18)} ${r1(y + r * 0.66)}Q${r1(x)} ${r1(y + r * 0.78)} ${r1(x + r * 0.18)} ${r1(y + r * 0.66)}`, ctx.thin);
  for (const [dx, dy] of [[-0.3, 0.36], [-0.2, 0.46], [-0.34, 0.5]]) s += dark(C(x + dx * r, y + dy * r, r * 0.035)) + dark(C(x - dx * r, y + dy * r, r * 0.035));
  return s;
}
const lion = {
  id: 'lion', name: 'Lion', styles: 4,
  draw(style, rand, ctx) {
    const tuft = (x, y, s) => bumpy(x, y, s * 0.8, s, 6, 0.22);
    if (style === 0) { // sitting, front view
      let s = tubeP([[70, 175], [140, 172], [172, 125], [165, 80]], 22, 16) + tuft(165, 66, 22);
      s += blob([[-95, 190], [-115, 110], [-80, 30], [0, 15], [80, 30], [115, 110], [95, 190], [0, 198]]);
      s += E(0, 125, 46, 58);
      s += E(-72, 184, 46, 16) + E(72, 184, 46, 16);
      s += leg(-62, 70, 42, ctx) + leg(20, 70, 42, ctx);
      return s + lionFace(0, -62, 80, ctx);
    }
    if (style === 1) { // walking, side view
      let s = tubeP([[-145, 0], [-178, -30], [-182, -80], [-160, -112]], 18, 13) + tuft(-158, -128, 20);
      s += leg(-118, 30, 40, ctx, 192, false) + leg(64, 30, 40, ctx, 192, false);
      s += E(-25, 28, 140, 70);
      s += curve('M-120 70Q-30 100 70 75', ctx.thin);
      s += leg(-150, 45, 44, ctx) + leg(32, 45, 44, ctx);
      return s + lionFace(98, -52, 56, ctx);
    }
    if (style === 2) { // big face, chin resting on its paws
      let s = E(-120, 150, 70, 50) + E(120, 150, 70, 50);
      s += bumpy(0, -10, 168, 160, 18, 0.1) + bumpy(0, -6, 132, 126, 14, 0.14, -77);
      s += R(-118, 146, 106, 54, 27) + R(12, 146, 106, 54, 27);
      for (const x of [-48, -34, 48, 62]) s += line(x, 197, x, 182, ctx.thin);
      return s + lionFace(0, 0, 98, ctx, false);
    }
    // lying down with a cub
    let s = tubeP([[-150, 170], [-185, 185], [-170, 198], [-120, 196]], 18, 13) + tuft(-110, 193, 16);
    s += blob([[-165, 195], [-170, 140], [-120, 95], [-20, 85], [70, 100], [110, 150], [100, 198]]);
    s += R(30, 160, 120, 38, 19) + line(132, 170, 132, 190, ctx.thin) + line(142, 172, 142, 188, ctx.thin);
    s += E(-120, 160, 50, 38);
    s += lionFace(60, 20, 60, ctx);
    // cub
    s += g(blob([[-40, 200], [-45, 150], [0, 135], [45, 150], [40, 200]]) + leg(-30, 165, 22, ctx) + leg(8, 165, 22, ctx) + lionFace(0, 105, 42, ctx, false) + bumpy(0, 66, 10, 7, 5, 0.3), tr(-55, 0, 1));
    return s;
  },
};

// Elephant: side view, facing right, feet on y = 200.
function elephantSide(trunkUp, ctx) {
  let s = curve('M-150 -5Q-172 20 -168 58') + P('M-168 56Q-182 78 -170 86Q-158 78 -168 56Z');
  s += R(-118, 40, 50, 155, 16) + R(52, 40, 50, 155, 16);
  s += blob([[-160, 10], [-145, -70], [-70, -105], [30, -100], [95, -60], [110, 30], [80, 95], [-130, 95], [-162, 60]]);
  const nails = (x) => [0, 1, 2].map((i) => P(`M${x + 6 + i * 15} 200a7 8 0 0 1 14 0Z`, ctx.thin)).join('');
  s += R(-145, 50, 56, 150, 16) + nails(-144) + R(25, 50, 56, 150, 16) + nails(26);
  const t = trunkUp ? tube([[120, -40], [168, -62], [185, -105], [176, -148]], 46, 26) : tube([[120, -30], [158, 20], [165, 85], [176, 122], [192, 116]], 46, 24);
  s += P(t.d) + tubeLines(t, [8, 12, 15, 18, 21], ctx.thin);
  s += C(110, -55, 68);
  s += blob([[55, -112], [92, -118], [108, -80], [98, -25], [70, 12], [42, 6], [28, -40], [32, -95]]);
  s += curve('M58 -90Q80 -60 62 -10', ctx.thin);
  s += eye(140, -78, 12, [0.3, 0]) + curve('M128 -98Q140 -104 152 -98', ctx.thin);
  s += curve(trunkUp ? 'M120 -12Q132 -2 146 -16' : 'M118 0Q128 8 140 0', ctx.thin);
  return s;
}
const elephant = {
  id: 'elephant', name: 'Elephant', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      let s = elephantSide(true, ctx);
      for (const [x, y, sz, a] of [[150, -182, 12, -30], [178, -192, 13, 0], [198, -168, 11, 30], [128, -168, 10, -50], [192, -138, 9, 40]]) s += drop(x, y, sz, a);
      return s;
    }
    if (style === 1) { // front view
      const nails = (x) => [0, 1, 2].map((i) => P(`M${x + 6 + i * 14} 200a6 8 0 0 1 12 0Z`, ctx.thin)).join('');
      let s = E(-85, 178, 48, 24) + E(85, 178, 48, 24);
      s += blob([[-112, 190], [-128, 100], [-80, 15], [80, 15], [128, 100], [112, 190], [0, 196]]);
      s += R(-72, 70, 54, 130, 18) + nails(-72) + R(18, 70, 54, 130, 18) + nails(18);
      const ear = blob([[-55, -125], [-140, -160], [-196, -95], [-185, 5], [-125, 40], [-70, 5]]) + curve('M-80 -110Q-160 -120 -165 -40Q-160 5 -100 15', ctx.thin);
      s += ear + mirrorPart(ear);
      const t = tube([[0, -45], [0, 20], [4, 80], [26, 112], [48, 100]], 50, 26);
      s += P(t.d) + tubeLines(t, [12, 15, 18, 21, 24], ctx.thin);
      s += E(0, -60, 88, 82);
      s += eye(-36, -82, 15, [0, 0.2]) + eye(36, -82, 15, [0, 0.2]);
      s += curve('M-52 -110Q-36 -118 -22 -110M22 -110Q36 -118 52 -110', ctx.thin);
      s += curve('M-46 -28Q-36 -14 -24 -22M46 -28Q36 -14 24 -22', ctx.thin);
      return s;
    }
    // mother and baby
    return g(elephantSide(false, ctx), tr(45, 44, 0.78)) + g(elephantSide(true, ctx), tr(-128, 110, 0.45));
  },
};
const mirrorPart = (inner) => g(inner, 'scale(-1 1)');

// Giraffe: side view, facing right.
function giraffeSide(rand, ctx) {
  let s = curve('M-140 -15Q-158 25 -152 60') + P('M-152 56Q-166 78 -152 92Q-140 78 -152 56Z');
  const hoof = (x) => R(x, 182, 24, 18, 6);
  s += R(-110, 20, 24, 172, 8) + R(-110, 176, 24, 18, 6) + R(40, 20, 24, 172, 8) + R(40, 176, 24, 18, 6);
  s += E(-40, 0, 108, 58);
  s += R(-130, 25, 26, 165, 8) + hoof(-131) + R(18, 25, 26, 165, 8) + hoof(17);
  s += P('M-14 -26Q22 -100 50 -150L64 -142Q36 -95 2 -24Z');
  s += P('M0 -30Q36 -100 64 -145L104 -128Q82 -55 72 20Q30 25 0 -30Z');
  // patches
  for (const [x, y, r] of [[-118, -8, 17], [-88, 28, 17], [-70, -30, 17], [-38, 12, 18], [-5, -28, 16], [5, 28, 15], [-125, 28, 10], [32, -8, 14], [-100, -40, 11]]) s += patch(x, y, r, rand);
  for (const [x, y, r] of [[48, -40, 13], [62, -82, 12], [78, -118, 10], [40, -5, 10]]) s += patch(x, y, r, rand);
  // head
  s += R(68, -190, 10, 30, 5) + C(73, -190, 9) + R(88, -192, 10, 30, 5) + C(93, -192, 9);
  s += P('M62 -152Q40 -172 26 -170Q36 -150 60 -140Z');
  s += blob([[58, -150], [80, -175], [120, -172], [160, -158], [176, -140], [162, -122], [120, -118], [75, -122]]);
  s += eye(102, -152, 10, [0.4, 0]) + dark(C(160, -146, 4)) + curve('M140 -126Q156 -120 168 -130', ctx.thin);
  return s;
}
const giraffe = {
  id: 'giraffe', name: 'Giraffe', styles: 3, scale: 0.95,
  draw(style, rand, ctx) {
    if (style === 0) return giraffeSide(rand, ctx);
    if (style === 1) { // eating leaves from a tree
      let s = P('M128 200L140 -60L118 -104L136 -110L156 -76L176 -108L194 -100L172 -60L180 200Z');
      s += bumpy(146, -128, 70, 34, 11, 0.16);
      s += g(giraffeSide(rand, ctx), tr(-66, 20, 0.9));
      s += leafAt(92, -118, 30, 80, ctx, 0.35) + leafAt(92, -118, 28, 120, ctx, 0.35);
      return s;
    }
    return g(giraffeSide(rand, ctx), tr(-42, 24, 0.88)) + g(giraffeSide(rand, ctx), tr(108, 104, 0.48));
  },
};

// Monkey
function monkeyHead(x, y, r, ctx) {
  let s = C(x - r * 1.05, y, r * 0.38) + C(x - r * 1.05, y, r * 0.2) + C(x + r * 1.05, y, r * 0.38) + C(x + r * 1.05, y, r * 0.2);
  s += P(`M${r1(x - r * 0.15)} ${r1(y - r * 0.95)}Q${r1(x - r * 0.1)} ${r1(y - r * 1.35)} ${r1(x + r * 0.3)} ${r1(y - r * 1.3)}Q${r1(x + r * 0.05)} ${r1(y - r * 1.2)} ${r1(x + r * 0.2)} ${r1(y - r * 0.95)}Z`);
  s += C(x, y, r);
  s += blob([[-0.76, -0.1], [-0.68, -0.58], [-0.3, -0.68], [0, -0.5], [0.3, -0.68], [0.68, -0.58], [0.76, -0.1], [0.62, 0.45], [0, 0.78], [-0.62, 0.45]].map(([a, b]) => [x + a * r, y + b * r]));
  s += eye(x - r * 0.3, y - r * 0.26, r * 0.17, [0, 0.2]) + eye(x + r * 0.3, y - r * 0.26, r * 0.17, [0, 0.2]);
  s += dark(E(x - r * 0.09, y + r * 0.1, r * 0.04, r * 0.06)) + dark(E(x + r * 0.09, y + r * 0.1, r * 0.04, r * 0.06));
  s += curve(`M${r1(x - r * 0.35)} ${r1(y + r * 0.3)}Q${r1(x)} ${r1(y + r * 0.62)} ${r1(x + r * 0.35)} ${r1(y + r * 0.3)}`);
  return s;
}
const banana = (x, y, s, ang, ctx) => g(P('M-50 -10Q0 40 50 -18Q56 -24 50 -28Q0 18 -46 -18Z') + P('M50 -26L60 -36L64 -30L54 -20Z') + curve('M-40 -12Q0 20 44 -18', ctx.hair), `translate(${x} ${y}) rotate(${ang}) scale(${s})`);
const monkey = {
  id: 'monkey', name: 'Monkey', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // sitting with a banana
      let s = tubeP([[55, 170], [130, 168], [168, 120], [158, 70], [128, 66], [124, 96], [142, 104]], 18, 13);
      s += blob([[-78, 192], [-92, 110], [-62, 45], [62, 45], [92, 110], [78, 192], [0, 198]]);
      s += E(0, 128, 48, 58);
      s += R(-104, 140, 60, 58, 29) + R(44, 140, 60, 58, 29) + E(-72, 190, 42, 13) + E(72, 190, 42, 13);
      s += tubeP([[-72, 62], [-76, 100], [-52, 114]], 28, 26) + tubeP([[72, 62], [76, 100], [52, 110]], 28, 26);
      s += banana(0, 108, 1.15, -4, ctx);
      s += C(-50, 114, 17) + C(52, 108, 17);
      return s + monkeyHead(0, -62, 80, ctx);
    }
    if (style === 1) { // hanging from a branch by one arm
      let s = R(-188, -150, 44, 350, 8) + curve('M-176 40Q-170 80 -178 120M-160 -60Q-154 -20 -162 10', ctx.thin);
      s += P('M-200 200Q-180 182 -166 186Q-150 182 -130 200Z');
      const br = tube([[-150, -150], [-40, -168], [80, -165], [188, -150]], 30, 18, { steps: 10 });
      s += P(br.d);
      s += tubeP([[30, 72], [112, 60], [130, -30], [118, -120], [100, -150], [118, -178], [140, -158]], 18, 12, { steps: 10 });
      s += tubeP([[-22, 70], [-38, 120], [-48, 150]], 26, 24) + E(-55, 160, 22, 14);
      s += tubeP([[16, 70], [28, 120], [40, 148]], 26, 24) + E(46, 158, 22, 14);
      s += blob([[-45, 80], [-50, 20], [-30, -20], [25, -20], [42, 20], [38, 80], [0, 96]]) + E(-4, 40, 26, 34);
      s += tubeP([[-34, 0], [-80, 18], [-112, -12]], 24, 22) + C(-116, -24, 15);
      s += tubeP([[28, -10], [44, -80], [44, -150]], 24, 22);
      s += monkeyHead(-20, -78, 52, ctx);
      s += E(44, -160, 16, 18);
      for (const [x, y, a] of [[-80, -168, -120], [-20, -170, -70], [60, -168, -110], [150, -160, -60], [100, -164, 230], [-120, -150, 120]]) s += leafAt(x, y, 46, a, ctx);
      return s;
    }
    // walking on all fours, tail curled up
    let s = tubeP([[-118, 10], [-160, -20], [-172, -90], [-145, -130], [-118, -112], [-128, -88], [-146, -94]], 18, 12, { steps: 10 });
    s += tubeP([[-92, 60], [-96, 130], [-90, 186]], 36, 30) + E(-80, 190, 26, 11);
    s += tubeP([[30, 40], [36, 120], [42, 186]], 32, 28) + E(54, 190, 26, 11);
    s += g(E(0, 0, 118, 72), 'translate(-35 45) rotate(-8)');
    s += E(-20, 70, 50, 34);
    s += tubeP([[-122, 70], [-128, 130], [-122, 186]], 38, 32) + E(-108, 190, 28, 12);
    s += tubeP([[62, 30], [72, 110], [80, 186]], 34, 30) + E(92, 190, 28, 12);
    return s + monkeyHead(96, -42, 70, ctx);
  },
};

// Zebra: stripes are closed bands that follow the outline.
function zebraBody(ctx, grazing) {
  const B = [-35, 10, 112, 56];
  let s = curve('M-142 -10Q-160 20 -156 55') + P('M-156 50Q-170 72 -156 86Q-144 72 -156 50Z');
  const legAt = (x, top, w, back) => {
    const bottom = back ? 192 : 200;
    let l = R(x, top, w, bottom - top, 10) + R(x, bottom - 16, w, 16, 5);
    for (const y of [top + 50, top + 85, top + 118]) l += legBand(x, w, y, y + 14);
    return l;
  };
  s += legAt(-112, 30, 28, true) + legAt(40, 30, 28, true);
  s += E(...B);
  for (const [a1, a2, d, k] of [[205, 216, 0.55, -6], [228, 240, 0.7, -4], [252, 264, 0.75, 0], [276, 288, 0.75, 4], [300, 312, 0.7, 6], [322, 332, 0.55, 8]]) s += edgeStripe(...B, a1, a2, d, k);
  for (const [a1, a2, d] of [[70, 80, 0.4], [100, 110, 0.4], [124, 134, 0.35]]) s += edgeStripe(...B, a1, a2, d);
  s += legAt(-132, 35, 30, false) + legAt(18, 35, 30, false);
  return s;
}
function zebraNeckHead(ctx, grazing) {
  let s = '';
  // neck as a four-sided shape; stripes are bands between its two edges
  const A = grazing ? [[40, -30], [110, 110]] : [[10, -30], [92, -128]]; // back edge from body to head
  const Bq = grazing ? [[70, 20], [150, 100]] : [[60, 15], [130, -110]]; // front edge
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  // mane along the back edge
  const n = 7;
  let m = `M${pt(A[0])}`;
  for (let i = 1; i <= n; i++) {
    const p = lerp(A[0], A[1], i / n), q = lerp(A[0], A[1], (i - 0.5) / n);
    const dx = A[1][0] - A[0][0], dy = A[1][1] - A[0][1], l = Math.hypot(dx, dy);
    m += `Q${pt([q[0] + (dy / l) * 26, q[1] - (dx / l) * 26])} ${pt(p)}`;
  }
  s += P(m + 'Z');
  s += P(`M${pt(A[0])}L${pt(A[1])}L${pt(Bq[1])}L${pt(Bq[0])}Z`);
  for (const t of [0.1, 0.32, 0.54, 0.76]) {
    const a0 = lerp(A[0], A[1], t), a1 = lerp(A[0], A[1], t + 0.11);
    const tip = lerp(lerp(Bq[0], Bq[1], t + 0.02), lerp(A[0], A[1], t + 0.02), 0.12);
    const mid = lerp(lerp(a0, a1, 0.5), tip, 0.5);
    s += P(`M${pt(a0)}L${pt(a1)}Q${pt([mid[0] + 6, mid[1] - 6])} ${pt(tip)}Q${pt([mid[0] - 6, mid[1] + 6])} ${pt(a0)}Z`);
  }
  // head
  const hx = grazing ? 140 : 118, hy = grazing ? 130 : -140, ang = grazing ? 70 : 20;
  let h = P('M-18 -30L-30 -66L-2 -40Z') + P('M2 -34L4 -72L22 -38Z');
  h += blob([[-30, -20], [0, -38], [50, -30], [75, -10], [80, 15], [55, 30], [10, 26], [-26, 12]]);
  h += P('M48 -24Q66 -20 76 -8Q82 10 74 22Q60 30 44 24Q38 0 48 -24Z');
  h += edgeStripe(0, -4, 34, 30, 225, 245, 0.6) + edgeStripe(0, -4, 34, 30, 255, 275, 0.6) + edgeStripe(0, -4, 34, 30, 285, 305, 0.6);
  h += eye(14, -14, 9, [0.3, 0]) + dark(E(66, -4, 4, 6)) + curve('M58 16Q68 22 76 14', ctx.thin);
  s += g(h, `translate(${hx} ${hy}) rotate(${ang})`);
  return s;
}
const zebra = {
  id: 'zebra', name: 'Zebra', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return zebraBody(ctx, false) + zebraNeckHead(ctx, false);
    if (style === 1) return zebraBody(ctx, true) + zebraNeckHead(ctx, true);
    // mother and foal
    return g(zebraBody(ctx, false) + zebraNeckHead(ctx, false), tr(-36, 40, 0.8)) + g(zebraBody(ctx, false) + zebraNeckHead(ctx, false), tr(104, 100, 0.5));
    return s;
  },
};

// Bear
function bearHead(x, y, r, ctx) {
  let s = C(x - r * 0.72, y - r * 0.72, r * 0.32) + C(x - r * 0.72, y - r * 0.72, r * 0.17) + C(x + r * 0.72, y - r * 0.72, r * 0.32) + C(x + r * 0.72, y - r * 0.72, r * 0.17);
  s += E(x, y, r * 1.04, r);
  s += E(x, y + r * 0.38, r * 0.44, r * 0.33);
  s += E(x, y + r * 0.22, r * 0.17, r * 0.12);
  s += curve(`M${r1(x)} ${r1(y + r * 0.34)}L${r1(x)} ${r1(y + r * 0.46)}M${r1(x - r * 0.2)} ${r1(y + r * 0.44)}Q${r1(x)} ${r1(y + r * 0.62)} ${r1(x + r * 0.2)} ${r1(y + r * 0.44)}`, ctx.thin);
  s += eye(x - r * 0.38, y - r * 0.15, r * 0.14, [0, 0.2]) + eye(x + r * 0.38, y - r * 0.15, r * 0.14, [0, 0.2]);
  return s;
}
const bear = {
  id: 'bear', name: 'Bear', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'forest', 'night', 'pond', 'snow'],
  draw(style, rand, ctx) {
    if (style === 0) { // sitting with a honey pot
      let s = blob([[-105, 190], [-122, 100], [-80, 25], [80, 25], [122, 100], [105, 190], [0, 198]]);
      s += E(-88, 166, 46, 32) + pawPad(-88, 168, 40) + E(88, 166, 46, 32) + pawPad(88, 168, 40);
      s += tubeP([[-92, 48], [-90, 100], [-70, 128]], 36, 32) + tubeP([[92, 48], [90, 100], [70, 128]], 36, 32);
      s += blob([[-52, 92], [-74, 140], [-56, 192], [56, 192], [74, 140], [52, 92]]) + R(-46, 80, 92, 16, 4) + R(-58, 64, 116, 22, 11);
      s += P('M-50 86H50V92Q46 112 40 112Q34 112 34 92H14Q12 128 4 128Q-4 128 -6 92H-24Q-26 108 -32 108Q-38 108 -40 92H-50Z');
      s += C(-70, 136, 20) + C(70, 136, 20);
      return s + bearHead(0, -70, 86, ctx);
    }
    if (style === 1) { // walking on all fours
      let s = C(-163, 0, 15);
      s += leg(-122, 40, 50, ctx, 193, false) + leg(52, 40, 50, ctx, 193, false);
      s += E(-30, 30, 138, 82);
      s += leg(-148, 50, 54, ctx) + leg(25, 50, 54, ctx);
      return s + bearHead(108, -40, 68, ctx);
    }
    // standing and waving
    let s = R(-62, 110, 52, 85, 24) + R(10, 110, 52, 85, 24) + E(-42, 190, 40, 13) + E(42, 190, 40, 13);
    s += blob([[-78, 150], [-88, 60], [-60, -10], [60, -10], [88, 60], [78, 150], [0, 168]]);
    s += E(0, 80, 48, 58);
    s += tubeP([[-68, 20], [-98, 65], [-100, 105]], 38, 34) + C(-100, 110, 22);
    s += tubeP([[66, 20], [110, -20], [124, -80]], 38, 34) + C(126, -92, 24) + pawPad(126, -90, 22);
    return s + bearHead(0, -88, 74, ctx);
  },
};

// Tiger: like the lion but with stripes, and no mane.
function tigerHead(x, y, r, ctx) {
  let s = '';
  // ears
  s += C(x - r * 0.75, y - r * 0.72, r * 0.3) + C(x - r * 0.75, y - r * 0.72, r * 0.15) + C(x + r * 0.75, y - r * 0.72, r * 0.3) + C(x + r * 0.75, y - r * 0.72, r * 0.15);
  // cheek ruffs
  const ruff = `M${r1(x - r * 0.9)} ${r1(y - r * 0.1)}L${r1(x - r * 1.22)} ${r1(y + r * 0.1)}L${r1(x - r * 0.98)} ${r1(y + r * 0.25)}L${r1(x - r * 1.14)} ${r1(y + r * 0.45)}L${r1(x - r * 0.75)} ${r1(y + r * 0.55)}Z`;
  s += P(ruff) + g(P(ruff), `translate(${r1(2 * x)} 0) scale(-1 1)`);
  const H = [x, y, r, r * 0.86];
  s += E(...H);
  for (const [a1, a2, d] of [[170, 178, 0.32], [188, 196, 0.3], [-6, 2, 0.32], [-24, -16, 0.3], [256, 262, 0.28], [267, 273, 0.36], [278, 284, 0.28]]) s += edgeStripe(...H, a1, a2, d);
  s += E(x - r * 0.24, y + r * 0.4, r * 0.28, r * 0.22) + E(x + r * 0.24, y + r * 0.4, r * 0.28, r * 0.22);
  s += eye(x - r * 0.38, y - r * 0.16, r * 0.17, [0, 0.2]) + eye(x + r * 0.38, y - r * 0.16, r * 0.17, [0, 0.2]);
  s += nose(x, y + r * 0.13, r * 0.18, r * 0.2);
  s += curve(`M${r1(x - r * 0.18)} ${r1(y + r * 0.68)}Q${r1(x)} ${r1(y + r * 0.8)} ${r1(x + r * 0.18)} ${r1(y + r * 0.68)}`, ctx.thin);
  for (const [dx, dy] of [[-0.3, 0.38], [-0.2, 0.48], [-0.34, 0.52]]) s += dark(C(x + dx * r, y + dy * r, r * 0.035)) + dark(C(x - dx * r, y + dy * r, r * 0.035));
  return s;
}
function stripedTail(pts, w0, w1, bands) {
  const t = tube(pts, w0, w1, { steps: 10 });
  return P(t.d) + bands.map(([a, b]) => tubeBand(t, Math.round(a * (t.N - 1)), Math.round(b * (t.N - 1)))).join('');
}
function stripedLeg(x, top, w, ctx, bottom = 200, toes = true) {
  let s = leg(x, top, w, ctx, bottom, toes);
  for (const y of [top + 25, top + 62]) if (y + 12 < bottom - w / 2) s += legBand(x, w, y, y + 12);
  return s;
}
const tiger = {
  id: 'tiger', name: 'Tiger', styles: 3,
  draw(style, rand, ctx) {
    const tailBands = [[0.25, 0.32], [0.45, 0.52], [0.65, 0.72], [0.85, 1]];
    if (style === 0) { // sitting, front view
      let s = stripedTail([[70, 178], [140, 175], [175, 125], [168, 70]], 24, 18, tailBands);
      const B = [0, 112, 98, 86];
      s += E(...B);
      for (const [a1, a2] of [[150, 160], [172, 182], [194, 204], [20, 30], [-2, 8], [-24, -14]]) s += edgeStripe(...B, a1, a2, 0.35);
      s += E(0, 128, 44, 56);
      s += E(-74, 186, 44, 14) + E(74, 186, 44, 14);
      s += stripedLeg(-62, 75, 42, ctx) + stripedLeg(20, 75, 42, ctx);
      return s + tigerHead(0, -62, 92, ctx);
    }
    if (style === 1) { // walking
      let s = stripedTail([[-148, 5], [-180, -30], [-185, -85], [-162, -120]], 22, 16, tailBands);
      s += stripedLeg(-118, 30, 40, ctx, 192, false) + stripedLeg(64, 30, 40, ctx, 192, false);
      const B = [-25, 28, 142, 68];
      s += E(...B);
      for (const [a1, a2, d] of [[200, 210, 0.5], [222, 232, 0.6], [244, 254, 0.65], [266, 276, 0.65], [288, 298, 0.6], [310, 320, 0.5], [80, 88, 0.3], [100, 108, 0.3]]) s += edgeStripe(...B, a1, a2, d);
      s += stripedLeg(-150, 45, 44, ctx) + stripedLeg(32, 45, 44, ctx);
      return s + tigerHead(100, -48, 64, ctx);
    }
    // lying down, paws forward, tail curled in front
    const B = [-35, 140, 135, 58];
    let s = E(...B);
    for (const [a1, a2, d] of [[205, 215, 0.55], [228, 238, 0.62], [252, 262, 0.62], [276, 286, 0.6], [300, 310, 0.5]]) s += edgeStripe(...B, a1, a2, d);
    s += E(-120, 150, 52, 44);
    s += edgeStripe(-120, 150, 52, 44, 200, 215, 0.45) + edgeStripe(-120, 150, 52, 44, 230, 245, 0.5) + edgeStripe(-120, 150, 52, 44, 260, 275, 0.45);
    const paw = (x, y) => R(x, y, 120, 30, 15) + line(x + 103, y + 8, x + 103, y + 22, ctx.thin) + line(x + 111, y + 10, x + 111, y + 20, ctx.thin);
    s += paw(48, 148) + paw(30, 170);
    s += stripedTail([[-160, 150], [-190, 185], [-150, 198], [-60, 196]], 22, 16, tailBands);
    return s + tigerHead(70, 50, 70, ctx);
  },
};

// Panda: the black parts are drawn as regions so they can be colored in.
function pandaHead(x, y, r, ctx) {
  let s = C(x - r * 0.78, y - r * 0.72, r * 0.32) + C(x + r * 0.78, y - r * 0.72, r * 0.32);
  s += E(x, y, r * 1.08, r);
  s += g(E(0, 0, r * 0.33, r * 0.23), `translate(${r1(x - r * 0.42)} ${r1(y - r * 0.02)}) rotate(-55)`);
  s += g(E(0, 0, r * 0.33, r * 0.23), `translate(${r1(x + r * 0.42)} ${r1(y - r * 0.02)}) rotate(55)`);
  s += eye(x - r * 0.38, y - r * 0.08, r * 0.12, [0.2, 0.1]) + eye(x + r * 0.38, y - r * 0.08, r * 0.12, [-0.2, 0.1]);
  s += E(x, y + r * 0.42, r * 0.36, r * 0.26);
  s += E(x, y + r * 0.3, r * 0.14, r * 0.1);
  s += curve(`M${r1(x)} ${r1(y + r * 0.4)}L${r1(x)} ${r1(y + r * 0.5)}M${r1(x - r * 0.17)} ${r1(y + r * 0.48)}Q${r1(x)} ${r1(y + r * 0.64)} ${r1(x + r * 0.17)} ${r1(y + r * 0.48)}`, ctx.thin);
  return s;
}
function bamboo(x0, y0, x1, y1, w, ctx, leaves = []) {
  const n = 4, dx = (x1 - x0) / n, dy = (y1 - y0) / n, ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  let s = '';
  for (let i = 0; i < n; i++) s += g(R(0, -w / 2, Math.hypot(dx, dy), w, 6), `translate(${r1(x0 + dx * i)} ${r1(y0 + dy * i)}) rotate(${r1(ang)})`);
  for (const [t, a, len] of leaves) s += leafAt(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, len, a, ctx, 0.28);
  return s;
}
const panda = {
  id: 'panda', name: 'Panda', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'forest', 'night', 'pond', 'snow'],
  draw(style, rand, ctx) {
    if (style === 0) { // sitting, eating bamboo
      let s = blob([[-100, 190], [-118, 100], [-78, 20], [78, 20], [118, 100], [100, 190], [0, 198]]);
      s += E(-88, 162, 50, 38) + E(-88, 166, 22, 16) + E(88, 162, 50, 38) + E(88, 166, 22, 16);
      s += bamboo(66, 190, 86, -180, 28, ctx, [[0.98, -40, 60], [0.9, -150, 55], [0.62, 10, 50]]);
      s += tubeP([[-84, 40], [-70, 100], [-10, 100], [62, 80]], 44, 38) + C(70, 76, 24);
      s += tubeP([[86, 40], [104, 0], [86, -20]], 44, 38) + C(84, -26, 24);
      return s + pandaHead(0, -70, 86, ctx);
    }
    if (style === 1) { // walking on all fours
      let s = C(-164, -5, 14);
      s += leg(-122, 40, 50, ctx, 193, false) + leg(52, 40, 50, ctx, 193, false);
      const B = [-30, 30, 138, 80];
      s += E(...B);
      s += ellipseBand(...B, 290, 325, 30, 55);
      s += leg(-148, 50, 54, ctx) + leg(25, 50, 54, ctx);
      return s + pandaHead(108, -40, 66, ctx);
    }
    // lying on its tummy, chin on its paws
    let s = C(-162, 112, 14);
    const B = [-30, 135, 135, 62];
    s += E(...B) + ellipseBand(...B, 300, 330, 40, 70);
    s += E(-128, 160, 44, 36) + E(-128, 168, 18, 13);
    s += R(30, 166, 140, 32, 16) + R(50, 146, 130, 30, 15);
    s += pandaHead(80, 72, 76, ctx);
    return s;
    return s;
  },
};

// Hippo
function hippoHead(x, y, k, ctx, eyesOpen = true) {
  let s = E(x - 52 * k, y - 62 * k, 13 * k, 18 * k) + E(x + 52 * k, y - 62 * k, 13 * k, 18 * k);
  s += C(x - 30 * k, y - 48 * k, 22 * k) + C(x + 30 * k, y - 48 * k, 22 * k);
  s += E(x, y - 15 * k, 64 * k, 50 * k);
  s += E(x, y + 35 * k, 82 * k, 52 * k);
  s += dark(E(x - 24 * k, y + 14 * k, 8 * k, 6 * k)) + dark(E(x + 24 * k, y + 14 * k, 8 * k, 6 * k));
  s += curve(`M${r1(x - 52 * k)} ${r1(y + 46 * k)}Q${r1(x)} ${r1(y + 74 * k)} ${r1(x + 52 * k)} ${r1(y + 46 * k)}`, ctx.thin);
  s += eyesOpen ? eye(x - 30 * k, y - 50 * k, 11 * k, [0, 0.2]) + eye(x + 30 * k, y - 50 * k, 11 * k, [0, 0.2]) : sleepEye(x - 30 * k, y - 48 * k, 12 * k) + sleepEye(x + 30 * k, y - 48 * k, 12 * k);
  return s;
}
const hippo = {
  id: 'hippo', name: 'Hippo', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // standing, side view
      let s = P('M-170 30Q-196 40 -196 60Q-184 56 -172 48Z');
      const nails = (x) => [0, 1].map((i) => P(`M${x + 10 + i * 20} 200a8 9 0 0 1 16 0Z`, ctx.thin)).join('');
      s += R(-118, 90, 52, 105, 18) + R(44, 90, 52, 105, 18);
      s += E(-30, 55, 150, 98);
      s += R(-142, 100, 58, 100, 20) + nails(-142) + R(20, 100, 58, 100, 20) + nails(20);
      return s + hippoHead(110, -40, 1, ctx);
    }
    if (style === 1) { // sitting, big yawn
      let s = blob([[-115, 192], [-135, 100], [-95, 10], [95, 10], [135, 100], [115, 192], [0, 198]]);
      s += E(0, 120, 70, 62);
      s += E(-88, 182, 46, 18) + E(88, 182, 46, 18) + R(-78, 110, 50, 90, 22) + R(28, 110, 50, 90, 22);
      s += P('M-100 -80Q-106 50 0 54Q106 50 100 -80Z');
      s += P('M-80 -80Q-84 26 0 30Q84 26 80 -80Z');
      s += P('M-50 18Q-40 -18 0 -18Q40 -18 50 18Q0 34 -50 18Z');
      s += R(-66, -36, 22, 28, 7) + R(44, -36, 22, 28, 7);
      s += E(-50, -186, 14, 18) + E(50, -186, 14, 18);
      s += E(0, -148, 66, 46);
      s += sleepEye(-28, -160, 14) + sleepEye(28, -160, 14);
      s += E(0, -100, 96, 42);
      s += dark(E(-30, -112, 9, 6)) + dark(E(30, -112, 9, 6));
      s += R(-62, -66, 18, 22, 6) + R(44, -66, 18, 22, 6);
      return s;
    }
    // bathing in a pool with a little bird on its head
    let s = E(0, 150, 196, 48);
    s += P('M-180 150Q-170 60 -90 45Q-20 40 20 90L30 150Z');
    s += hippoHead(80, 40, 1.15, ctx);
    s += P('M-196 150q24 -14 49 0t49 0t49 0t49 0t49 0t49 0t49 0t49 0A196 48 0 0 1 -196 150Z');
    s += curve('M-150 175q20 -10 40 0M60 180q20 -10 40 0', ctx.thin);
    // bird
    s += g(E(0, 0, 22, 16) + C(18, -14, 12) + P('M28 -16L42 -12L28 -8Z') + dotEye(20, -16, 3) + P('M-20 -4L-38 -12L-34 4Z') + curve('M-8 -2Q2 8 12 0', ctx.thin) + line(-4, 15, -4, 24, ctx.thin) + line(6, 15, 6, 24, ctx.thin), 'translate(70 -50)');
    return s;
  },
};

// Fox
function foxFace(x, y, r, ctx, sleepy = false) {
  let s = '';
  const ear = (sx) => P(`M${r1(x + sx * r * 0.25)} ${r1(y - r * 0.65)}L${r1(x + sx * r * 0.85)} ${r1(y - r * 1.35)}L${r1(x + sx * r * 0.85)} ${r1(y - r * 0.35)}Z`) + P(`M${r1(x + sx * r * 0.42)} ${r1(y - r * 0.62)}L${r1(x + sx * r * 0.78)} ${r1(y - r * 1.1)}L${r1(x + sx * r * 0.78)} ${r1(y - r * 0.5)}Z`, ctx.thin);
  s += ear(-1) + ear(1);
  s += blob([[-0.95, 0], [-0.75, -0.6], [0, -0.78], [0.75, -0.6], [0.95, 0], [1.15, 0.2], [0.5, 0.45], [0, 0.75], [-0.5, 0.45], [-1.15, 0.2]].map(([a, b]) => [x + a * r, y + b * r]));
  s += P(`M${r1(x - r * 1.15)} ${r1(y + r * 0.2)}Q${r1(x - r * 0.4)} ${r1(y - r * 0.05)} ${r1(x)} ${r1(y + r * 0.2)}Q${r1(x + r * 0.4)} ${r1(y - r * 0.05)} ${r1(x + r * 1.15)} ${r1(y + r * 0.2)}Q${r1(x + r * 0.6)} ${r1(y + r * 0.42)} ${r1(x)} ${r1(y + r * 0.75)}Q${r1(x - r * 0.6)} ${r1(y + r * 0.42)} ${r1(x - r * 1.15)} ${r1(y + r * 0.2)}Z`);
  s += sleepy ? sleepEye(x - r * 0.38, y - r * 0.12, r * 0.16) + sleepEye(x + r * 0.38, y - r * 0.12, r * 0.16) : eye(x - r * 0.38, y - r * 0.15, r * 0.15, [0, 0.2]) + eye(x + r * 0.38, y - r * 0.15, r * 0.15, [0, 0.2]);
  s += dark(E(x, y + r * 0.66, r * 0.12, r * 0.09));
  s += curve(`M${r1(x - r * 0.15)} ${r1(y + r * 0.88)}Q${r1(x)} ${r1(y + r * 0.95)} ${r1(x + r * 0.15)} ${r1(y + r * 0.88)}`, ctx.thin);
  return s;
}
const foxTailW = (t) => 18 + 66 * Math.sin(Math.PI * (0.12 + 0.78 * t));
function foxTail(pts, ctx, k = 1) {
  const t = tube(pts, 0, 0, { steps: 10, widths: (u) => foxTailW(u) * k });
  return P(t.d) + tubeBand(t, Math.round(t.N * 0.78), t.N - 1);
}
const fox = {
  id: 'fox', name: 'Fox', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'forest', 'night', 'pond', 'snow'],
  draw(style, rand, ctx) {
    const sock = (x, w, y) => P(`M${x} ${y}H${x + w}V${200 - w / 2}A${w / 2} ${w / 2} 0 0 1 ${x} ${200 - w / 2}Z`);
    if (style === 0) { // sitting with a big bushy tail
      let s = foxTail([[30, 175], [110, 185], [168, 140], [178, 70], [160, 20]], ctx);
      s += blob([[-72, 196], [-82, 110], [-50, 30], [50, 30], [82, 110], [72, 196], [0, 200]]);
      s += blob([[-34, 36], [34, 36], [30, 110], [0, 136], [-30, 110]]);
      s += E(-62, 190, 30, 11) + E(62, 190, 30, 11);
      s += R(-46, 110, 32, 90, 16) + sock(-46, 32, 165) + R(14, 110, 32, 90, 16) + sock(14, 32, 165);
      return s + foxFace(0, -50, 82, ctx);
    }
    if (style === 1) { // curled up asleep, tail over its nose
      let s = blob([[-150, 196], [-170, 110], [-110, 30], [0, 10], [110, 30], [170, 110], [150, 196], [0, 200]]);
      s += curve('M60 60Q110 70 130 120', ctx.thin);
      s += foxFace(-50, 72, 70, ctx, true);
      s += foxTail([[140, 100], [150, 170], [60, 192], [-60, 186], [-150, 160], [-185, 120]], ctx, 0.85);
      return s;
    }
    // trotting, side view
    let s = foxTail([[-112, 60], [-170, 40], [-215, 0]], ctx, 0.9);
    s += R(-102, 90, 26, 102, 13) + sock(-102, 26, 150) + R(52, 90, 26, 102, 13) + sock(52, 26, 150);
    s += E(-20, 70, 112, 52);
    s += R(-128, 95, 28, 105, 14) + sock(-128, 28, 155) + R(30, 95, 28, 105, 14) + sock(30, 28, 155);
    s += P('M88 40Q70 100 10 112Q50 90 52 40Z');
    // head in profile
    s += P('M74 -20L80 -88L112 -38Z') + P('M84 -32L86 -70L100 -36Z', ctx.thin) + P('M110 -30L130 -96L146 -32Z');
    s += blob([[48, 40], [56, -20], [104, -44], [146, -36], [196, -10], [192, 6], [146, 26], [96, 46]]);
    s += P('M58 26Q100 16 146 6Q176 2 192 4Q150 30 100 44Q72 44 58 26Z');
    s += eye(122, -16, 11, [0.4, 0]) + dark(C(194, -2, 7));
    return g(fit(s, 0.88), 'translate(14 0)');
    return s;
  },
};

// Kangaroo
function kangarooSide(ctx) {
  let s = tubeP([[-10, 140], [-90, 172], [-160, 188], [-198, 190]], 62, 22, { steps: 10 });
  s += R(-30, 176, 125, 18, 9);
  s += blob([[-72, 168], [-88, 80], [-58, -10], [-12, -58], [34, -48], [56, 20], [62, 120], [22, 176]]);
  s += curve('M14 40Q48 60 54 110', ctx.thin);
  s += E(-30, 118, 58, 66);
  s += R(-45, 180, 150, 20, 10) + line(84, 183, 84, 197, ctx.thin);
  s += tubeP([[14, -26], [44, 16], [70, 30]], 22, 16) + E(76, 32, 13, 9);
  s += tubeP([[26, -36], [58, 4], [86, 12]], 22, 16) + E(92, 14, 13, 9);
  s += g(P('M0 0Q-16 -46 4 -80Q22 -46 16 0Z') + P('M4 -8Q-6 -40 6 -64Q15 -40 11 -8Z', ctx.thin), 'translate(-8 -120) rotate(-20)');
  s += g(P('M0 0Q-16 -46 4 -80Q22 -46 16 0Z'), 'translate(14 -124) rotate(6)');
  s += blob([[-30, -84], [-10, -124], [40, -138], [86, -124], [122, -100], [120, -82], [84, -70], [30, -64], [-12, -66]]);
  s += eye(40, -106, 12, [0.4, 0]) + dark(E(118, -92, 6, 5)) + curve('M90 -76Q104 -72 114 -80', ctx.thin);
  return s;
}
const kangaroo = {
  id: 'kangaroo', name: 'Kangaroo', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return kangarooSide(ctx);
    if (style === 1) { // hopping
      let s = g(kangarooSide(ctx), 'translate(10 -10) rotate(22 0 100)');
      s += curve('M-170 170q15 -12 30 0M-120 186q15 -12 30 0', ctx.thin);
      return s;
    }
    // front view with a joey in the pouch, waving
    let s = tubeP([[40, 160], [120, 180], [190, 195]], 44, 14);
    s += E(-45, 190, 30, 12) + E(45, 190, 30, 12);
    s += blob([[-82, 185], [-92, 90], [-58, -10], [0, -32], [58, -10], [92, 90], [82, 185], [0, 196]]);
    s += E(-62, 135, 40, 56) + E(62, 135, 40, 56);
    s += E(0, 90, 48, 78);
    // joey
    s += g(P('M0 0Q-8 -26 4 -42Q14 -24 10 0Z'), 'translate(-26 52) rotate(-20)') + g(P('M0 0Q-8 -26 4 -42Q14 -24 10 0Z'), 'translate(16 50) rotate(20)');
    s += C(0, 78, 27) + E(0, 88, 15, 11) + dark(C(0, 82, 4)) + dotEye(-10, 72, 4) + dotEye(10, 72, 4);
    s += P('M-46 92Q0 112 46 92Q46 160 0 165Q-46 160 -46 92Z');
    s += C(-24, 98, 9) + C(24, 98, 9);
    s += tubeP([[-55, 0], [-70, 40], [-48, 62]], 22, 18) + E(-44, 64, 11, 8);
    s += tubeP([[55, 0], [95, -30], [108, -75]], 22, 18) + C(110, -82, 12);
    // head
    s += g(P('M0 0Q-18 -45 0 -80Q18 -45 12 0Z') + P('M3 -10Q-6 -40 3 -62Q11 -40 9 -10Z', ctx.thin), 'translate(-40 -112) rotate(-22)');
    s += g(P('M0 0Q-18 -45 0 -80Q18 -45 12 0Z') + P('M3 -10Q-6 -40 3 -62Q11 -40 9 -10Z', ctx.thin), 'translate(30 -116) rotate(22)');
    s += E(0, -80, 48, 52) + E(0, -48, 30, 26);
    s += eye(-20, -92, 11, [0, 0.2]) + eye(20, -92, 11, [0, 0.2]);
    s += E(0, -60, 10, 7) + curve('M-12 -40Q0 -32 12 -40', ctx.thin);
    return s;
  },
};

// Koala
function koalaHead(x, y, r, ctx, sleepy = false) {
  let s = bumpy(x - r * 0.95, y - r * 0.35, r * 0.42, r * 0.42, 7, 0.12) + C(x - r * 0.95, y - r * 0.33, r * 0.22);
  s += bumpy(x + r * 0.95, y - r * 0.35, r * 0.42, r * 0.42, 7, 0.12) + C(x + r * 0.95, y - r * 0.33, r * 0.22);
  s += E(x, y, r * 1.02, r * 0.9);
  s += E(x, y + r * 0.18, r * 0.2, r * 0.3);
  s += sleepy ? sleepEye(x - r * 0.42, y - r * 0.12, r * 0.13) + sleepEye(x + r * 0.42, y - r * 0.12, r * 0.13) : eye(x - r * 0.42, y - r * 0.12, r * 0.12, [0, 0.2]) + eye(x + r * 0.42, y - r * 0.12, r * 0.12, [0, 0.2]);
  s += curve(`M${r1(x - r * 0.15)} ${r1(y + r * 0.58)}Q${r1(x)} ${r1(y + r * 0.66)} ${r1(x + r * 0.15)} ${r1(y + r * 0.58)}`, ctx.thin);
  return s;
}
const koala = {
  id: 'koala', name: 'Koala', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // hugging a tree
      let s = P('M40 200L52 -200L130 -200L140 200Z') + curve('M80 160Q86 100 78 40M104 -40Q112 -100 100 -160', ctx.thin);
      s += tubeP([[120, -120], [160, -150], [196, -160]], 22, 12);
      for (const [x, y, a] of [[160, -150, -110], [180, -158, -60], [196, -160, 40], [150, -146, 120]]) s += leafAt(x, y, 40, a, ctx, 0.25);
      s += blob([[-110, 150], [-125, 50], [-90, -30], [20, -40], [60, 30], [60, 150], [-20, 175]]);
      s += E(-40, 70, 46, 60);
      s += tubeP([[-60, 130], [10, 150], [72, 140]], 40, 34) + E(78, 138, 18, 22);
      s += tubeP([[-50, -10], [20, 0], [86, -20]], 36, 30) + E(90, -22, 16, 20);
      s += koalaHead(-50, -95, 74, ctx);
      return s;
    }
    if (style === 1) { // sitting, eating a leaf
      let s = blob([[-95, 192], [-112, 100], [-75, 25], [75, 25], [112, 100], [95, 192], [0, 198]]);
      s += E(0, 120, 52, 62);
      s += E(-78, 180, 40, 20) + E(78, 180, 40, 20);
      s += curve('M40 120Q60 40 50 -40', ctx.thin);
      for (const [t, a] of [[0.15, -20], [0.35, 200], [0.55, -30], [0.75, 210]]) s += leafAt(48 + 10 * (1 - t), 120 - 160 * t, 48, a, ctx, 0.25);
      s += tubeP([[-85, 45], [-60, 100], [25, 100]], 36, 32) + C(32, 98, 20);
      s += tubeP([[85, 45], [90, 90], [62, 70]], 36, 32) + C(56, 66, 20);
      s += koalaHead(0, -60, 84, ctx);
      s += leafAt(10, 10, 42, 30, ctx, 0.3);
      return s;
    }
    // asleep, lying along a branch
    let s = P('M-185 200L-168 -40L-118 -40L-104 200Z') + curve('M-150 160Q-144 110 -152 60', ctx.thin);
    for (const [x, y, a] of [[-150, -40, -100], [-135, -40, -60], [-160, -38, -140]]) s += leafAt(x, y, 46, a, ctx, 0.25);
    s += blob([[-80, -40], [-60, -95], [20, -110], [100, -80], [110, -30], [0, -20]]);
    s += tubeP([[-160, 0], [-40, 0], [80, -6], [192, -24]], 40, 26, { steps: 10 });
    for (const [x, y, a] of [[192, -24, -40], [180, -22, 60], [150, -16, 100]]) s += leafAt(x, y, 44, a, ctx, 0.25);
    s += tubeP([[-50, -40], [-58, 20], [-52, 60]], 32, 28) + E(-50, 64, 18, 12);
    s += tubeP([[-20, -40], [-24, 26], [-14, 66]], 32, 28) + E(-12, 70, 18, 12);
    s += tubeP([[60, -40], [64, 30], [58, 66]], 30, 26) + E(58, 70, 17, 11);
    s += koalaHead(105, -75, 66, ctx, true);
    s += tubeP([[90, -20], [104, 30], [96, 76]], 30, 26) + E(96, 80, 17, 11);
    return s;
    return s;
  },
};

const SEA = [];

// ---------------------------------------------------------------- SEA LIFE (float: centred on 0,0)

/** A closed region along one side of a tube (a belly), meeting the outline at both ends. */
function sideBand(t, i0, i1, side = 'R', k = 0.25, a = '') {
  const S = t[side];
  let d = `M${pt(S[i0])}`;
  for (let i = i0 + 1; i <= i1; i++) d += `L${pt(S[i])}`;
  for (let i = i1 - 1; i > i0; i--) {
    const kk = 1 - (1 - k) * Math.sin((Math.PI * (i - i0)) / (i1 - i0));
    d += `L${pt([t.c[i][0] + (S[i][0] - t.c[i][0]) * kk, t.c[i][1] + (S[i][1] - t.c[i][1]) * kk])}`;
  }
  return P(d + 'Z', a);
}
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
/** A fin standing out of one side of a tube at sample i: base along the body, tip out and back. */
function finAt(t, i, side, out, back, half = 4) {
  const S = t[side], n = unit(t.c[i], S[i]), d = unit(t.c[Math.max(0, i - 1)], t.c[Math.min(t.N - 1, i + 1)]);
  const b0 = add(S[Math.max(0, i - half)], n, -12), b1 = add(S[Math.min(t.N - 1, i + half)], n, -12);
  const tip = add(add(S[i], n, out), d, -back);
  const c0 = add(add(S[Math.max(0, i - half)], n, out * 0.6), d, 0);
  return P(`M${pt(b0)}Q${pt(c0)} ${pt(tip)}Q${pt(add(S[i], n, out * 0.25))} ${pt(b1)}Z`);
}
/** A flipper lying on the body near side at sample i, pointing back and out. */
function flipperAt(t, i, side, len, wid) {
  const S = t[side], n = unit(t.c[i], S[i]), d = unit(t.c[Math.max(0, i - 1)], t.c[Math.min(t.N - 1, i + 1)]);
  const base = add(t.c[i], n, Math.hypot(S[i][0] - t.c[i][0], S[i][1] - t.c[i][1]) * 0.45);
  const b0 = add(base, d, -wid * 0.3), b1 = add(base, d, wid * 0.6);
  const tip = add(add(base, n, len * 0.75), d, -len * 0.75);
  return P(`M${pt(b0)}Q${pt(add(add(b0, n, len * 0.5), d, -len * 0.1))} ${pt(tip)}Q${pt(add(add(b1, n, len * 0.6), d, -len * 0.2))} ${pt(b1)}Z`);
}
/** Tail flukes (whale, dolphin) at the start of a tube. */
function flukesAt(t, size) {
  const u = unit(t.c[1], t.c[0]), ang = (Math.atan2(u[1], u[0]) * 180) / Math.PI;
  const k = size / 50;
  return g(P('M14 0Q-8 -8 -24 -46Q-46 -58 -56 -44Q-44 -10 -16 0Q-44 10 -56 44Q-46 58 -24 46Q-8 8 14 0Z'), `translate(${pt(t.c[0])}) rotate(${r1(ang + 180)}) scale(${r1(k)})`);
}
const bubble = (x, y, r, ctx) => C(x, y, r) + curve(`M${r1(x - r * 0.5)} ${r1(y - r * 0.1)}Q${r1(x - r * 0.45)} ${r1(y - r * 0.5)} ${r1(x - r * 0.05)} ${r1(y - r * 0.55)}`, ctx.hair);
const waves = (y, x0, x1, step = 48) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1 - 1; x += step) d += `q${step / 2} -16 ${step} 0`; return d; };

// Fish
const fish = {
  id: 'fish', name: 'Fish', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // classic fish with scales
      let s = P('M-112 0L-192 -78Q-176 -20 -150 0Q-176 20 -192 78Z') + curve('M-150 -40L-125 -10M-150 40L-125 10M-168 -50L-138 -6M-168 50L-138 6', ctx.thin);
      s += P('M-60 -70Q-10 -150 80 -82Z') + P('M-20 72Q20 120 50 78Z');
      s += blob([[-125, 0], [-70, -75], [30, -92], [125, -50], [165, 0], [125, 48], [30, 90], [-70, 75]]);
      s += curve('M70 -70Q40 0 70 70');
      for (const [x, ys] of [[-75, [-45, -5, 35]], [-35, [-65, -25, 15, 55]], [5, [-65, -25, 15, 55]]]) for (const y of ys) s += curve(`M${x} ${y}q16 16 0 36`, ctx.thin);
      s += blob([[50, 10], [10, 30], [-20, 60], [10, 62], [55, 30]]);
      s += eye(112, -20, 22, [0.3, 0]) + curve('M135 22Q150 32 160 18', ctx.thin);
      s += bubble(180, -70, 14, ctx) + bubble(170, -115, 9, ctx);
      return s;
    }
    if (style === 1) { // tall angelfish with stripes
      let s = P('M-60 -55Q-40 -190 70 -175Q40 -120 40 -60Z') + P('M-60 55Q-40 190 70 175Q40 120 40 60Z');
      s += curve('M-30 -90L10 -150M-10 -70L40 -160M-30 90L10 150M-10 70L40 160', ctx.thin);
      s += P('M-80 0L-180 -70Q-160 0 -180 70Z');
      const B = [0, 0, 105, 82];
      s += E(...B);
      s += ellipseBand(...B, 222, 240, 120, 138) + ellipseBand(...B, 256, 272, 88, 104);
      s += eye(58, -18, 17, [0.3, 0]) + curve('M88 20Q98 26 104 16', ctx.thin);
      s += blob([[20, 20], [-10, 40], [-25, 66], [5, 58], [30, 34]]);
      s += bubble(150, -80, 14, ctx) + bubble(140, -125, 9, ctx);
      return s;
    }
    // round puffer fish
    let s = '';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * 360 + 11;
      if (a > 150 && a < 210) continue;
      const p0 = onE(0, 0, 118, 118, a - 7), p1 = onE(0, 0, 150, 150, a), p2 = onE(0, 0, 118, 118, a + 7);
      s += poly([p0, p1, p2]);
    }
    s += P('M-110 0L-185 -60Q-168 0 -185 60Z');
    s += C(0, 0, 125);
    for (const [x, y, r] of [[-60, -70, 12], [-20, -95, 10], [-85, -25, 9], [-40, -40, 8]]) s += C(x, y, r);
    s += P('M-20 20Q-60 10 -70 50Q-60 80 -30 60Q-20 40 -20 20Z') + curve('M-30 30L-58 40M-30 44L-56 60', ctx.hair);
    s += eye(40, -40, 24, [0.3, 0]) + C(98, 18, 13) + C(98, 18, 6);
    s += P('M-35 -118Q-10 -175 40 -150Q20 -130 25 -118Z');
    return s;
  },
};

// Whale
function whaleSide(ctx, spout) {
  const t = tube([[-150, -120], [-140, -60], [-90, -5], [10, 10], [110, 0], [150, -10]], 0, 0, { steps: 10, widths: (u) => (u < 0.55 ? 22 + 140 * Math.sin((Math.PI / 2) * (u / 0.55)) : 162 - 40 * ((u - 0.55) / 0.45) ** 2) });
  let s = flukesAt(t, 80) + P(t.d);
  s += sideBand(t, Math.round(t.N * 0.3), t.N - 6, 'R', 0.45);
  const hi = t.N - 6;
  for (let i = Math.round(t.N * 0.45); i < hi; i += 4) {
    const p = t.R[i], q = add(t.c[i], unit(t.c[i], t.R[i]), Math.hypot(t.R[i][0] - t.c[i][0], t.R[i][1] - t.c[i][1]) * 0.72);
    s += line(...add(p, unit(p, q), 6), ...q, ctx.thin);
  }
  s += flipperAt(t, Math.round(t.N * 0.7), 'R', 70, 40);
  const ep = add(t.c[t.N - 6], unit(t.c[t.N - 6], t.L[t.N - 6]), 4);
  s += eye(ep[0] + 8, ep[1] + 8, 13, [0.3, 0]);
  s += curve(`M${r1(ep[0] - 6)} ${r1(ep[1] + 40)}Q${r1(ep[0] + 40)} ${r1(ep[1] + 52)} ${r1(ep[0] + 70)} ${r1(ep[1] + 28)}`, ctx.thin);
  if (spout) {
    const b = t.L[Math.round(t.N * 0.78)];
    s += g(P('M-8 0Q-14 -40 -40 -58Q-60 -60 -70 -46Q-56 -76 -30 -70Q-10 -66 -2 -40Q-2 -80 0 -96Q6 -80 4 -40Q14 -66 36 -70Q60 -76 72 -46Q60 -60 40 -58Q16 -40 8 0Z') + drop(-74, -32, 10, 200) + drop(76, -30, 10, 160), `translate(${pt(b).replace(' ', ' ')})`);
  }
  return s;
}
const whale = {
  id: 'whale', name: 'Whale', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return g(whaleSide(ctx, true), 'translate(22 50) scale(0.88)');
    if (style === 1) { // tail out of the water
      const half = [[0, -60], [-40, -78], [-110, -120], [-175, -150], [-190, -112], [-150, -60], [-80, -24], [-40, 10], [-30, 70], [-32, 140]];
      const pts = [...half, ...half.slice(1).reverse().map(([x, y]) => [-x, y])];
      let d = `M0 -60`;
      d += 'Q-40 -78 -110 -120Q-160 -158 -186 -136Q-200 -110 -150 -60Q-96 -20 -46 6Q-30 60 -34 150L34 150Q30 60 46 6Q96 -20 150 -60Q200 -110 186 -136Q160 -158 110 -120Q40 -78 0 -60Z';
      void pts;
      let s = P(d) + curve('M-150 -110Q-100 -80 -60 -40M150 -110Q100 -80 60 -40', ctx.thin);
      s += P(`${waves(110, -196, 196)}A196 70 0 0 1 -196 110Z`) + curve(waves(145, -150, 150, 50), ctx.thin);
      for (const [x, y, sz, a] of [[-70, 70, 13, -40], [-100, 40, 10, -60], [70, 66, 13, 40], [104, 36, 10, 60], [-50, 30, 9, -20], [50, 26, 9, 20]]) s += drop(x, y, sz, a);
      return s;
    }
    // mother and baby
    return g(whaleSide(ctx, false), 'translate(10 -40) scale(0.78)') + g(whaleSide(ctx, false), 'translate(70 125) scale(0.42)');
  },
};

// Dolphin
const dolphinW = (u) => (u < 0.45 ? 18 + 96 * Math.sin((Math.PI / 2) * (u / 0.45)) : u < 0.8 ? 114 - 34 * ((u - 0.45) / 0.35) : u < 0.87 ? 80 - 46 * Math.sin((Math.PI / 2) * ((u - 0.8) / 0.07)) : 34 - 6 * ((u - 0.87) / 0.13));
function dolphin(pts, ctx) {
  const t = tube(pts, 0, 0, { steps: 10, widths: dolphinW });
  const N = t.N;
  let s = flukesAt(t, 58) + finAt(t, Math.round(N * 0.48), 'L', 64, 40, 6) + P(t.d);
  s += sideBand(t, Math.round(N * 0.25), Math.round(N * 0.9), 'R', 0.4);
  s += flipperAt(t, Math.round(N * 0.6), 'R', 60, 34);
  const i = Math.round(N * 0.78), ep = add(t.c[i], unit(t.c[i], t.L[i]), 12);
  s += eye(ep[0], ep[1], 11, [0.3, 0]);
  const m = [];
  for (let j = Math.round(N * 0.86); j < N - 1; j++) m.push(add(t.c[j], unit(t.c[j], t.R[j]), 3));
  s += smooth(m, ctx.thin);
  return s;
}
const beachBall = (x, y, r, ctx) => C(x, y, r) + P(`M${x} ${y - r}A${r * 0.42} ${r} 0 0 0 ${x} ${y + r}A${r * 0.42} ${r} 0 0 0 ${x} ${y - r}Z`) + C(x, y - r * 0.6, r * 0.18);
const dolphinSpecies = {
  id: 'dolphin', name: 'Dolphin', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // jumping in an arc
      let s = dolphin([[-170, 120], [-120, -10], [-20, -90], [90, -70], [165, 20]], ctx);
      s += P(`M-196 150q14 -30 30 -10q12 -40 32 0q16 -24 30 4q10 -20 26 0L-60 172L-200 172Z`);
      for (const [x, y, sz, a] of [[-150, 105, 10, -30], [-110, 118, 9, 20], [-185, 110, 8, -50]]) s += drop(x, y, sz, a);
      return g(s, 'translate(14 0) scale(0.86)');
    }
    if (style === 1) { // playing with a ball
      let s = dolphin([[-185, 70], [-110, 50], [-10, 10], [90, -10], [170, -60]], ctx);
      s += beachBall(165, -138, 42, ctx);
      return g(s, 'translate(14 30) scale(0.86)');
    }
    // mother and baby swimming together
    return g(dolphin([[-185, -20], [-110, -30], [-10, -50], [90, -60], [180, -40]], ctx), 'translate(12 -50) scale(0.86)') + g(dolphin([[-185, -20], [-110, -30], [-10, -50], [90, -60], [180, -40]], ctx), 'translate(30 120) scale(0.5)');
  },
};

// Octopus
const tentacle = (pts, w0 = 36, w1 = 12) => tubeP(pts, w0, w1, { steps: 10 });
function octoHead(x, y, k, ctx, wink = false) {
  let s = E(x, y, 108 * k, 100 * k);
  for (const [dx, dy, r] of [[-50, -55, 12], [-20, -75, 9], [55, -50, 10], [30, -78, 7]]) s += C(x + dx * k, y + dy * k, r * k);
  s += eye(x - 38 * k, y + 5 * k, 22 * k, [0, 0.2]);
  s += wink ? sleepEye(x + 38 * k, y + 2 * k, 18 * k) : eye(x + 38 * k, y + 5 * k, 22 * k, [0, 0.2]);
  s += E(x - 66 * k, y + 40 * k, 13 * k, 8 * k) + E(x + 66 * k, y + 40 * k, 13 * k, 8 * k);
  s += curve(`M${r1(x - 22 * k)} ${r1(y + 45 * k)}Q${r1(x)} ${r1(y + 65 * k)} ${r1(x + 22 * k)} ${r1(y + 45 * k)}`);
  return s;
}
const scallop = (x, y, s, ang, ctx) => g(P('M0 30L-36 -10Q-30 -40 0 -44Q30 -40 36 -10Z') + P('M-12 30L12 30L8 42L-8 42Z') + curve('M0 28L0 -40M0 28L-20 -32M0 28L20 -32', ctx.thin), `translate(${x} ${y}) rotate(${ang}) scale(${s})`);
const octopus = {
  id: 'octopus', name: 'Octopus', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // front view, tentacles curling out
      const left = [
        [[-70, 0], [-130, 30], [-175, 80], [-170, 125], [-140, 128], [-145, 105]],
        [[-55, 20], [-90, 80], [-110, 140], [-90, 182], [-62, 172], [-70, 150]],
        [[-30, 25], [-40, 95], [-38, 150], [-20, 190], [5, 180]],
      ];
      let s = '';
      for (const p of left) s += tentacle(p) + tentacle(p.map(([x, y]) => [-x, y]));
      s += tentacle([[-8, 30], [-12, 110], [10, 150], [30, 140]], 34, 12);
      s += octoHead(0, -70, 1, ctx);
      return s;
    }
    if (style === 1) { // swimming, tentacles trailing
      let s = '';
      for (const [x, k] of [[-60, -1], [-30, 1], [0, -1], [30, 1], [60, -1]]) s += tentacle([[x * 0.8, 0], [x * 1.1, 60], [x * 1.3 + 20 * k, 120], [x * 1.5 - 10 * k, 180], [x * 1.6 + 10 * k, 215]], 34, 12);
      s += octoHead(0, -60, 1, ctx);
      s += bubble(130, -150, 14, ctx) + bubble(158, -110, 9, ctx) + bubble(-140, -130, 11, ctx);
      return g(s, 'translate(0 -10) rotate(28) scale(0.88)');
    }
    // holding a starfish and a shell
    let s = '';
    s += tentacle([[-60, 0], [-120, -20], [-165, -80], [-150, -125]]);
    s += tentacle([[60, 0], [120, -10], [165, -60], [160, -100]]);
    s += tentacle([[-55, 25], [-110, 70], [-160, 100], [-175, 140], [-150, 150]]) + tentacle([[55, 25], [110, 70], [160, 100], [175, 140], [150, 150]]);
    s += tentacle([[-30, 30], [-50, 100], [-60, 160], [-35, 185]]) + tentacle([[30, 30], [50, 100], [60, 160], [35, 185]]);
    s += tentacle([[-8, 30], [-10, 110], [10, 160], [28, 150]], 32, 12);
    s += octoHead(0, -40, 0.95, ctx, true);
    s += g(blob(starPts(0, 0, 40, 18, 5)) + C(0, 0, 8), 'translate(-150 -150) rotate(10)');
    s += scallop(160, -130, 0.9, 20, ctx);
    return s;
  },
};
/** Points of a star with rounded tips (for blob). */
function starPts(cx, cy, R, r, n = 5, turn = -90, swirl = 0) {
  const out = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((turn + (i * 180) / n + (i % 2 ? swirl : 0)) * Math.PI) / 180;
    const l = i % 2 ? r : R;
    out.push([cx + Math.cos(a) * l, cy + Math.sin(a) * l]);
  }
  return out;
}

// Crab
function claw(x, y, s, ang, ctx) {
  return g(P('M0 30Q-48 26 -52 -18Q-54 -62 -10 -70Q26 -72 40 -46L6 -30L36 -14Q30 26 0 30Z') + curve('M-30 6Q-36 -20 -24 -40', ctx.thin), `translate(${x} ${y}) rotate(${ang}) scale(${s})`);
}
function crabBody(ctx, holding = false) {
  let s = '';
  for (const k of [-1, 1]) {
    for (const [y, dx] of [[20, 0], [45, 8], [70, 18]]) s += tubeP([[k * 90, y], [k * (150 + dx), y - 10], [k * (175 + dx), y + 40]], 20, 12);
    s += holding ? tubeP([[k * 90, -10], [k * 120, -70], [k * 78, -128]], 24, 20) : tubeP([[k * 90, -10], [k * 125, -50], [k * 120, -95]], 24, 20);
  }
  const ey = holding ? -86 : -110;
  s += tubeP([[-35, -30], [-40, ey]], 14, 14) + tubeP([[35, -30], [40, ey]], 14, 14);
  s += eye(-40, ey - 8, 20, [0, holding ? -0.3 : 0.2]) + eye(40, ey - 8, 20, [0, holding ? -0.3 : 0.2]);
  s += E(0, 20, 125, 78);
  s += curve('M-90 -20Q0 -50 90 -20', ctx.thin);
  s += C(-60, -8, 7) + C(60, -8, 7) + C(-30, -30, 6) + C(30, -30, 6);
  s += curve('M-30 40Q0 64 30 40') + E(-65, 40, 13, 8) + E(65, 40, 13, 8);
  if (holding) {
    s += g(blob(starPts(0, 0, 62, 28, 5), '', 0.8) + C(0, 0, 9), 'translate(0 -170)');
    s += claw(-70, -150, 0.85, 40, ctx) + g(claw(0, 0, 0.85, 40, ctx), 'translate(70 -150) scale(-1 1)');
  } else s += claw(-120, -120, 1, -20, ctx) + g(claw(0, 0, 1, -20, ctx), 'translate(120 -120) scale(-1 1)');
  return s;
}
const crab = {
  id: 'crab', name: 'Crab', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return g(crabBody(ctx), 'translate(0 20)');
    if (style === 1) return g(crabBody(ctx, true), 'translate(0 40) scale(0.95)') + bubble(150, -150, 13, ctx) + bubble(170, -110, 8, ctx);
    // hermit crab in a spiral shell
    let s = '';
    for (const [x, dx] of [[40, 0], [70, 10], [100, 20]]) s += tubeP([[x, 80], [x + 30 + dx, 110], [x + 40 + dx, 150]], 20, 12);
    s += tubeP([[60, 20], [64, -70]], 14, 14) + tubeP([[95, 25], [110, -60]], 14, 14);
    s += E(70, 60, 70, 50);
    s += eye(64, -80, 18, [0.2, 0.2]) + eye(112, -70, 18, [0.2, 0.2]) + curve('M100 50Q115 62 128 50', ctx.thin);
    s += blob([[-170, 100], [-160, -20], [-90, -120], [0, -120], [50, -60], [50, 40], [30, 110], [-60, 140]]);
    s += curve('M-50 120C-140 110 -140 -40 -60 -60C0 -76 30 -10 0 30C-30 70 -90 40 -80 -10C-74 -36 -40 -30 -42 -6', '');
    s += tubeP([[100, 70], [140, 40], [150, 0]], 26, 22) + claw(150, -14, 0.9, 10, ctx);
    return g(s, 'translate(10 0)');
  },
};

// Sea turtle
function turtleTop(ctx) {
  let s = '';
  const flip = (x, y, len, ang, w) => g(P(`M0 ${-w}Q${len * 0.6} ${-w * 1.4} ${len} 0Q${len * 0.6} ${w * 0.8} 0 ${w}Z`), `translate(${x} ${y}) rotate(${ang})`);
  s += flip(-70, -55, 120, 210, 26) + mirrorPart(flip(-70, -55, 120, 210, 26));
  s += flip(-60, 75, 60, 140, 18) + mirrorPart(flip(-60, 75, 60, 140, 18));
  s += P('M-12 120L0 150L12 120Z');
  s += E(0, -140, 36, 44);
  s += eye(-16, -150, 9, [0, -0.3]) + eye(16, -150, 9, [0, -0.3]) + curve('M-12 -118Q0 -110 12 -118', ctx.thin);
  s += E(0, 0, 105, 125) + E(0, 0, 82, 102);
  const hex = poly([[-30, -30], [0, -48], [30, -30], [30, 10], [0, 28], [-30, 10]]);
  s += hex + curve('M0 -48L0 -102M30 -30L66 -60M-30 -30L-66 -60M30 10L74 30M-30 10L-74 30M0 28L0 102', ctx.thin);
  s += curve('M-66 -60Q-82 -10 -74 30M66 -60Q82 -10 74 30', ctx.thin);
  return s;
}
function turtleSide(ctx) {
  let s = '';
  s += P('M-60 30Q-110 50 -150 90Q-110 90 -50 50Z');
  s += P('M90 0Q150 -10 170 -40Q190 -55 195 -30Q190 10 120 30Z');
  s += E(150, -30, 0.1, 0.1);
  s += blob([[95, -10], [130, -40], [170, -42], [190, -20], [175, 0], [130, 10]]);
  s += eye(160, -24, 9, [0.4, 0]) + curve('M172 -6Q182 -4 188 -12', ctx.thin);
  s += P('M-130 20Q-120 -100 0 -105Q120 -100 130 20Z');
  s += P('M-140 20Q0 40 140 20Q130 50 0 55Q-130 50 -140 20Z');
  s += poly([[-40, -60], [0, -75], [40, -60], [30, -20], [-30, -20]]);
  s += curve('M-40 -60L-80 -40M40 -60L80 -40M-30 -20L-50 18M30 -20L50 18M-80 -40L-100 18M80 -40L100 18', ctx.thin);
  s += P('M10 40Q60 60 80 120Q30 100 -10 50Z');
  s += P('M-140 30L-170 40L-140 45Z');
  return s;
}
const seaTurtle = {
  id: 'sea-turtle', name: 'Sea turtle', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return g(turtleTop(ctx), 'translate(0 10) rotate(-20)');
    if (style === 1) return turtleSide(ctx) + bubble(170, -110, 13, ctx) + bubble(140, -150, 9, ctx);
    return g(turtleSide(ctx), 'translate(-30 -40) scale(0.8)') + g(turtleSide(ctx), 'translate(90 110) scale(0.45)');
  },
};

// Starfish
const starfish = {
  id: 'starfish', name: 'Starfish', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) { // smiling star with dots
      let s = blob(starPts(0, 10, 195, 78), '', 0.8);
      for (let i = 0; i < 5; i++) {
        const a = -90 + i * 72;
        for (const l of [110, 150]) { const p = onE(0, 10, l, l, a); s += C(p[0], p[1], l > 130 ? 7 : 9); }
      }
      s += eye(-28, -5, 16, [0, 0.2]) + eye(28, -5, 16, [0, 0.2]) + smile(0, 30, 44, 0.45) + E(-48, 26, 11, 7) + E(48, 26, 11, 7);
      return s;
    }
    if (style === 1) { // dancing starfish with curvy arms
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -90 + i * 36 + (i % 2 ? 0 : 14);
        const l = i % 2 ? 72 : 185;
        pts.push(onE(0, 10, l, l, a));
      }
      let s = blob(pts, '', 0.9);
      for (let i = 0; i < 10; i += 2) { const a = -90 + i * 36 + 14; for (const l of [95, 135]) { const p = onE(0, 10, l, l, a - (l - 90) * 0.08); s += C(p[0], p[1], 8); } }
      s += eye(-26, -2, 16, [0, 0.2]) + sleepEye(28, -2, 14) + P('M-20 28Q0 60 20 28Z') + E(-48, 24, 11, 7) + E(48, 24, 11, 7);
      return s;
    }
    // a big starfish and a little one
    let s = g(blob(starPts(0, 0, 150, 62), '', 0.8), 'translate(-45 -30) rotate(-8)');
    for (let i = 0; i < 5; i++) { const a = -98 + i * 72; for (const l of [88, 118]) { const p = onE(-45, -30, l, l, a); s += C(p[0], p[1], 7); } }
    s += eye(-66, -40, 13, [0, 0.2]) + eye(-24, -40, 13, [0, 0.2]) + smile(-45, -14, 34, 0.45) + E(-82, -16, 9, 6) + E(-8, -16, 9, 6);
    s += g(blob(starPts(0, 0, 82, 34), '', 0.8), 'translate(110 105) rotate(12)');
    s += dotEye(98, 98, 7) + dotEye(122, 102, 7) + smile(108, 118, 20, 0.5);
    s += heart(60, -165, 46);
    return s;
  },
};

// Jellyfish
function jelly(x, y, k, ctx, face = true, frilly = false) {
  let s = '';
  // tentacles behind the bell
  const xs = [-60, -30, 0, 30, 60];
  xs.forEach((dx, i) => {
    const pts = [];
    for (let j = 0; j <= 6; j++) pts.push([dx + Math.sin(j * 1.3 + i) * 12, 10 + j * 30]);
    if (frilly && i % 2 === 0) {
      s += tubeP(pts.map(([a, b]) => [x + a * k, y + b * k]), 22 * k, 8 * k, { widths: (u) => (12 + 12 * Math.abs(Math.sin(u * 14))) * k * (1 - u * 0.5) });
    } else s += tubeP(pts.map(([a, b]) => [x + a * k, y + b * k]), 14 * k, 8 * k);
  });
  // bell
  const h = frilly ? 130 : 105;
  let d = `M${r1(x - 100 * k)} ${r1(y + 10 * k)}C${r1(x - 105 * k)} ${r1(y - h * 1.2 * k)} ${r1(x + 105 * k)} ${r1(y - h * 1.2 * k)} ${r1(x + 100 * k)} ${r1(y + 10 * k)}`;
  for (let i = 0; i < 6; i++) { const x1 = 100 - (i + 1) * (200 / 6); d += `Q${r1(x + (x1 + 200 / 12) * k)} ${r1(y + 32 * k)} ${r1(x + x1 * k)} ${r1(y + 10 * k)}`; }
  s += P(d + 'Z');
  s += curve(`M${r1(x - 80 * k)} ${r1(y - 20 * k)}Q${r1(x)} ${r1(y - 4 * k)} ${r1(x + 80 * k)} ${r1(y - 20 * k)}`, ctx.thin);
  if (face) s += eye(x - 30 * k, y - 50 * k, 15 * k, [0, 0.2]) + eye(x + 30 * k, y - 50 * k, 15 * k, [0, 0.2]) + smile(x, y - 26 * k, 26 * k, 0.45) + E(x - 55 * k, y - 32 * k, 10 * k, 6 * k) + E(x + 55 * k, y - 32 * k, 10 * k, 6 * k);
  else s += C(x - 40 * k, y - 60 * k, 10 * k) + C(x + 20 * k, y - 85 * k, 12 * k) + C(x + 50 * k, y - 45 * k, 8 * k);
  return s;
}
const jellyfish = {
  id: 'jellyfish', name: 'Jellyfish', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return jelly(0, -40, 1.5, ctx);
    if (style === 1) return jelly(0, -30, 1.35, ctx, true, true) + bubble(150, -150, 14, ctx) + bubble(170, -105, 9, ctx);
    return jelly(-80, -60, 0.95, ctx) + jelly(100, -110, 0.65, ctx, true) + jelly(95, 70, 0.6, ctx, false);
  },
};

// Seahorse (faces right)
function seahorseShape(ctx) {
  let s = '';
  s += P('M-48 -40Q-100 -60 -96 0Q-90 30 -46 20Z') + curve('M-50 -30L-86 -30M-50 -10L-90 -5M-50 8L-80 18', ctx.thin);
  const tail = tube([[-10, 50], [-20, 110], [10, 165], [55, 160], [60, 125], [35, 112], [25, 130]], 50, 12, { steps: 10 });
  s += P(tail.d) + tubeLines(tail, [10, 20, 30, 40], ctx.thin);
  s += blob([[-30, -110], [15, -100], [45, -50], [50, 10], [25, 60], [-20, 70], [-50, 20], [-55, -60]]);
  for (const y of [-40, -15, 10, 35]) s += curve(`M${r1(10 + (y > 0 ? 20 - y * 0.4 : 30 + y * 0.3))} ${y}q20 4 ${y > 20 ? 25 : 34} 0`, ctx.thin);
  s += tubeP([[20, -130], [86, -118]], 36, 24);
  s += blob([[-38, -118], [-25, -160], [20, -170], [50, -140], [40, -105], [0, -92]]);
  s += P('M-30 -158Q-30 -182 -14 -170Q-6 -192 8 -170Q20 -180 20 -160Z');
  s += eye(8, -138, 13, [0.4, 0]) + curve('M76 -110Q84 -106 90 -112', ctx.thin);
  return s;
}
const seahorse = {
  id: 'seahorse', name: 'Seahorse', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return g(seahorseShape(ctx), 'translate(-10 0) scale(1.05)') + bubble(140, -150, 14, ctx) + bubble(160, -100, 9, ctx);
    if (style === 1) { // tail round a seaweed stalk
      let s = tubeP([[100, 200], [80, 100], [110, 0], [90, -100], [110, -190]], 34, 22, { steps: 10 });
      for (const [x, y, a] of [[95, 60, -20], [100, -40, 200], [100, -140, -30], [88, 140, 210]]) s += leafAt(x, y, 70, a, ctx, 0.3);
      s += g(seahorseShape(ctx), 'translate(-60 -20) scale(0.95)');
      return s;
    }
    // two seahorses making a heart
    return g(seahorseShape(ctx), 'translate(-85 10) scale(0.72)') + g(seahorseShape(ctx), 'translate(85 10) scale(-0.72 0.72)') + heart(0, -150, 60);
  },
};

// Shark (friendly, no teeth)
function sharkSide(ctx, baby = false) {
  const fat = baby ? 1.45 : 1, line0 = baby ? [[-120, 0], [-60, -4], [10, -8], [80, -4], [118, 6]] : [[-160, 0], [-80, -5], [20, -10], [120, -5], [170, 10]];
  const t = tube(line0, 0, 0, { steps: 10, widths: (u) => fat * (u < 0.6 ? 18 + 112 * Math.sin((Math.PI / 2) * (u / 0.6)) : 130 - 70 * ((u - 0.6) / 0.4) ** 1.5) });
  const N = t.N;
  const u = unit(t.c[1], t.c[0]), ang = (Math.atan2(u[1], u[0]) * 180) / Math.PI;
  let s = g(P('M18 0Q-6 -14 -26 -74Q-40 -82 -46 -70Q-38 -24 -16 0Q-34 18 -42 48Q-36 56 -26 52Q-8 12 18 0Z'), `translate(${pt(t.c[0])}) rotate(${r1(ang + 180)}) scale(1.1)`);
  s += finAt(t, Math.round(N * 0.52), 'L', 80, 50, 6);
  s += P(t.d);
  s += sideBand(t, Math.round(N * 0.2), N - 2, 'R', 0.3);
  s += flipperAt(t, Math.round(N * 0.6), 'R', 70, 36);
  for (const f of [0.66, 0.7, 0.74]) { const i = Math.round(N * f); s += curve(`M${pt(add(t.c[i], unit(t.c[i], t.L[i]), 20))}Q${pt(add(t.c[i + 1], unit(t.c[i], t.R[i]), -2))} ${pt(add(t.c[i], unit(t.c[i], t.R[i]), 22))}`, ctx.thin); }
  const i = Math.round(N * 0.84), ep = add(t.c[i], unit(t.c[i], t.L[i]), 14);
  s += eye(ep[0], ep[1], baby ? 20 : 14, [0.3, 0]);
  const m = add(t.c[N - 4], unit(t.c[N - 4], t.R[N - 4]), 10);
  s += curve(`M${r1(m[0] - 40)} ${r1(m[1] - 2)}Q${r1(m[0] - 10)} ${r1(m[1] + 20)} ${r1(m[0] + 18)} ${r1(m[1] - 8)}`);
  s += E(ep[0] + 4, ep[1] + 30, 10, 6);
  return s;
}
const shark = {
  id: 'shark', name: 'Shark', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return g(sharkSide(ctx), 'translate(10 10) scale(0.92)') + bubble(170, -100, 13, ctx) + bubble(150, -140, 8, ctx);
    if (style === 1) { // swimming towards you
      let s = P('M-20 80Q0 150 -40 190Q0 180 20 150Q40 180 60 190Q30 150 20 80Z');
      s += P('M-20 -90Q10 -190 60 -180Q30 -140 30 -90Z');
      s += P('M-110 20Q-180 60 -195 110Q-140 100 -90 60Z') + mirrorPart(P('M-110 20Q-180 60 -195 110Q-140 100 -90 60Z'));
      s += E(0, 0, 130, 110);
      s += P('M-115 50Q0 140 115 50Q90 110 0 112Q-90 110 -115 50Z');
      s += eye(-60, -25, 20, [0.2, 0.2]) + eye(60, -25, 20, [-0.2, 0.2]);
      s += P('M-55 40Q0 90 55 40Q0 60 -55 40Z');
      s += E(-90, 20, 12, 7) + E(90, 20, 12, 7);
      s += curve('M-128 -10Q-112 0 -116 14M-124 -30Q-106 -20 -110 -6M128 -10Q112 0 116 14M124 -30Q106 -20 110 -6', ctx.thin);
      return s;
    }
    // chubby baby shark and a little fish friend
    let s = g(sharkSide(ctx, true), 'translate(-20 20) rotate(-12)');
    s += g(P('M-20 0L-44 -18L-44 18Z') + E(0, 0, 28, 20) + dotEye(12, -4, 4) + curve('M18 8Q22 10 26 6', ctx.hair), 'translate(150 -140) scale(1.3)');
    s += bubble(110, -170, 10, ctx) + bubble(90, -130, 6, ctx);
    return s;
  },
};

SEA.push(fish, whale, dolphinSpecies, octopus, crab, seaTurtle, starfish, jellyfish, seahorse, shark);


export default [
  {
    id: 'wild', name: 'Wild animals', order: 14,
    scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'forest', 'night', 'pond'],
    pairScenes: ['meadow', 'hills'],
    icon: 'lion', kind: 'ground',
    subjects: [lion, elephant, giraffe, monkey, zebra, bear, tiger, panda, hippo, fox, kangaroo, koala],
  },
  {
    id: 'sea', name: 'Sea life', order: 15,
    scenes: ['plain', 'hearts', 'stars', 'sea'],
    pairScenes: ['sea', 'plain'],
    icon: 'fish', kind: 'float',
    subjects: SEA,
  },
];
