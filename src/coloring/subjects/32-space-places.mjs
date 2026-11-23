// Space and Houses-and-places coloring subjects for Yaanstep Sprouts (SCRUM-515).
// Every shape here is drawn by this code. Local box -200..200; ground things stand on y = 200.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring, cloud, sun, littleFlower, mirrorX, rot } from '../lib.mjs';

// ---------- small helpers for this file ----------
const f = (n) => Math.round(n * 10) / 10;
const M = (pts, close = true) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + (close ? 'Z' : '');
const shape = (pts, a = '') => P(M(pts), a);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** A capsule between two points (arms, legs, poles), half-width w. */
function limb(x1, y1, x2, y2, w, a = '') {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = (-dy / L) * w, ny = (dx / L) * w;
  return P(`M${f(x1 + nx)} ${f(y1 + ny)}L${f(x2 + nx)} ${f(y2 + ny)}A${w} ${w} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)}L${f(x1 - nx)} ${f(y1 - ny)}A${w} ${w} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)}Z`, a);
}
/** Split a cubic [p0,p1,p2,p3] at t. */
function splitC(c, t) {
  const [p0, p1, p2, p3] = c;
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), d = lerp(p2, p3, t), e = lerp(a, b, t), h = lerp(b, d, t), k = lerp(e, h, t);
  return [[p0, a, e, k], [k, h, d, p3]];
}
/** The part of a cubic between t1 and t2. */
function subC(c, t1, t2) {
  const [first] = splitC(c, t2);
  return splitC(first, t1 / t2)[1];
}
const cD = (c) => `C${f(c[1][0])} ${f(c[1][1])} ${f(c[2][0])} ${f(c[2][1])} ${f(c[3][0])} ${f(c[3][1])}`;
const revC = (c) => [c[3], c[2], c[1], c[0]];
const mirC = (c) => c.map(([x, y]) => [-x, y]);
/** A band across a symmetric body whose right side is the cubic c, between t1 and t2 (lens edges bulge by bow). */
function bodyBand(c, t1, t2, bow = 6, a = '') {
  const s = subC(c, t1, t2), l = revC(mirC(s));
  const top = s[0], bot = s[3];
  return P(`M${f(-top[0])} ${f(top[1])}Q0 ${f(top[1] + bow)} ${f(top[0])} ${f(top[1])}${cD(s)}Q0 ${f(bot[1] + bow)} ${f(-bot[0])} ${f(bot[1])}${cD(l)}Z`, a);
}
/** Arch-topped rectangle path (doors, windows). */
const archD = (x, y, w, h) => `M${f(x)} ${f(y + h)}L${f(x)} ${f(y + w / 2)}A${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(x + w)} ${f(y + w / 2)}L${f(x + w)} ${f(y + h)}Z`;
const arch = (x, y, w, h, a = '') => P(archD(x, y, w, h), a);
const win = (x, y, w, h, ctx, rx = 3) => R(x, y, w, h, rx) + line(x + w / 2, y, x + w / 2, y + h, ctx.thin) + line(x, y + h / 2, x + w, y + h / 2, ctx.thin);
const archWin = (x, y, w, h, ctx) => arch(x, y, w, h) + line(x + w / 2, y + 2, x + w / 2, y + h, ctx.thin) + line(x, y + w / 2 + 4, x + w, y + w / 2 + 4, ctx.thin);
const roundWin = (x, y, r, ctx) => C(x, y, r) + line(x - r, y, x + r, y, ctx.thin) + line(x, y - r, x, y + r, ctx.thin);
const knob = (x, y) => C(x, y, 5);
/** Scalloped shingle line from x0 to x1 at y (bumps hang down). */
function scallopRow(x0, x1, y, step, a = '') {
  const n = Math.max(1, Math.round((x1 - x0) / step)), w = (x1 - x0) / n;
  let d = `M${f(x0)} ${f(y)}`;
  for (let i = 0; i < n; i++) d += `a${f(w / 2)} ${f(w / 2)} 0 0 0 ${f(w)} 0`;
  return curve(d, a);
}
/** A wall with battlements on top: from x0 to x1, top of merlons at y - mh, base at bottom. */
function crenWall(x0, x1, y, bottom, n, mh = 22) {
  const w = (x1 - x0) / (2 * n - 1), pts = [[x0, bottom]];
  for (let i = 0; i < 2 * n - 1; i++) {
    const top = i % 2 ? y : y - mh;
    pts.push([x0 + i * w, top], [x0 + (i + 1) * w, top]);
  }
  pts.push([x1, bottom]);
  return shape(pts);
}
/** A few thin brick marks scattered on a wall. */
function bricks(list, ctx, bw = 30, bh = 16) {
  return list.map(([x, y]) => R(x, y, bw, bh, 2, `fill="none" ${ctx.thin}`)).join('');
}
/** A round leafy bush sitting on y. */
function bush(x, y, w, h, rand, n = 5) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (i / n) * Math.PI, k = i === 0 || i === n ? 1 : 1 + rand.range(-0.06, 0.06); pts.push([x + Math.cos(t) * (w / 2) * k, y + Math.sin(t) * h * k]); }
  let d = `M${f(pts[0][0])} ${f(y)}`;
  for (let i = 1; i <= n; i++) { const r = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * 0.62; d += `A${f(r)} ${f(r)} 0 0 1 ${f(pts[i][0])} ${f(i === n ? y : pts[i][1])}`; }
  return P(d + 'Z');
}
/** A bumpy leafy crown (closed), n bumps around an ellipse. */
function leafy(cx, cy, rx, ry, n, rand) {
  const pts = ring(cx, cy, rx, ry, n, rand.range(0, 1), 0.05, rand);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i <= n; i++) { const a = pts[i - 1], b = pts[i % n], r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.6; d += `A${f(r)} ${f(r)} 0 0 1 ${f(b[0])} ${f(b[1])}`; }
  return P(d + 'Z');
}
/** Little tulip (stem + cup flower). */
function tulip(x, y, h, ctx) {
  return curve(`M${f(x)} ${f(y)}Q${f(x - 3)} ${f(y - h * 0.5)} ${f(x)} ${f(y - h + 14)}`) +
    P(`M${f(x - 8)} ${f(y - h * 0.4)}q-14 -8 -12 -26q10 6 12 22Z`) +
    P(`M${f(x - 14)} ${f(y - h + 18)}L${f(x - 14)} ${f(y - h - 6)}L${f(x - 6)} ${f(y - h + 2)}L${f(x)} ${f(y - h - 10)}L${f(x + 6)} ${f(y - h + 2)}L${f(x + 14)} ${f(y - h - 6)}L${f(x + 14)} ${f(y - h + 18)}Q${f(x)} ${f(y - h + 28)} ${f(x - 14)} ${f(y - h + 18)}Z`);
}
/** A crescent: the circle (cx,cy,Rr) minus the circle offset by (dx,dy) with radius r, as a polygon. */
function crescent(cx, cy, Rr, dx, dy, r, a = '') {
  const d = Math.hypot(dx, dy), phi = Math.atan2(dy, dx);
  const al = Math.acos((Rr * Rr + d * d - r * r) / (2 * Rr * d)), be = Math.acos((r * r + d * d - Rr * Rr) / (2 * r * d));
  const out = [];
  for (let i = 0; i <= 40; i++) { const t = phi + al + (i / 40) * (2 * Math.PI - 2 * al); out.push([cx + Math.cos(t) * Rr, cy + Math.sin(t) * Rr]); }
  let inner = [];
  for (let i = 0; i <= 30; i++) { const t = phi + Math.PI - be + (i / 30) * 2 * be; inner.push([cx + dx + Math.cos(t) * r, cy + dy + Math.sin(t) * r]); }
  const last = out[out.length - 1], dist = (p) => Math.hypot(p[0] - last[0], p[1] - last[1]);
  if (dist(inner[0]) > dist(inner[inner.length - 1])) inner = inner.reverse();
  return shape(out.concat(inner.slice(1, -1)), a);
}
/** Flame pointing down from y (width 2w, height h). */
function flame(cx, y, w, h) {
  return P(`M${f(cx - w)} ${f(y)}C${f(cx - w * 1.3)} ${f(y + h * 0.45)} ${f(cx - w * 0.7)} ${f(y + h * 0.6)} ${f(cx - w * 0.5)} ${f(y + h * 0.72)}C${f(cx - w * 0.35)} ${f(y + h * 0.95)} ${f(cx - w * 0.1)} ${f(y + h * 0.8)} ${f(cx)} ${f(y + h)}C${f(cx + w * 0.1)} ${f(y + h * 0.8)} ${f(cx + w * 0.35)} ${f(y + h * 0.95)} ${f(cx + w * 0.5)} ${f(y + h * 0.72)}C${f(cx + w * 0.7)} ${f(y + h * 0.6)} ${f(cx + w * 1.3)} ${f(y + h * 0.45)} ${f(cx + w)} ${f(y)}Z`) +
    P(`M${f(cx - w * 0.5)} ${f(y)}Q${f(cx - w * 0.65)} ${f(y + h * 0.4)} ${f(cx)} ${f(y + h * 0.68)}Q${f(cx + w * 0.65)} ${f(y + h * 0.4)} ${f(cx + w * 0.5)} ${f(y)}Z`);
}
/** Little stars around a single picture; left out when two pictures share a page, to keep it uncluttered. */
const deco = (ctx, str) => (ctx.s > 1.2 ? str : '');
const cheeks = (x, y, dx, r, ctx) => C(x - dx, y, r, ctx.thin) + C(x + dx, y, r, ctx.thin);
const sparkle = (x, y, r) => P(`M${f(x)} ${f(y - r)}Q${f(x + r * 0.15)} ${f(y - r * 0.15)} ${f(x + r)} ${f(y)}Q${f(x + r * 0.15)} ${f(y + r * 0.15)} ${f(x)} ${f(y + r)}Q${f(x - r * 0.15)} ${f(y + r * 0.15)} ${f(x - r)} ${f(y)}Q${f(x - r * 0.15)} ${f(y - r * 0.15)} ${f(x)} ${f(y - r)}Z`);
/** Curly hair ring of bumps around a head (drawn before the face). */
function curlyHair(cx, cy, r, a0, a1, n, bump) {
  const pt = (a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  let d = `M${f(cx)} ${f(cy)}L${f(pt(a0)[0])} ${f(pt(a0)[1])}`;
  for (let i = 1; i <= n; i++) { const p = pt(a0 + ((a1 - a0) * i) / n); d += `A${bump} ${bump} 0 0 1 ${f(p[0])} ${f(p[1])}`; }
  return P(d + 'Z');
}

// ---------- SPACE ----------

const rocket = {
  id: 'rocket', name: 'Rocket', styles: 4, scenes: ['plain', 'hearts', 'stars', 'space', 'night', 'sky'],
  draw(style, rand, ctx) {
    if (style === 0) {
      // classic tall rocket, straight up
      let s = flame(0, 128, 42, 72);
      s += P('M-36 100L36 100L46 134L-46 134Z');
      s += P('M-58 0C-98 22 -120 70 -118 130L-58 104Z') + P('M58 0C98 22 120 70 118 130L58 104Z');
      s += P('M-60 -112L60 -112L60 104Q0 120 -60 104Z');
      s += R(-60, 46, 120, 28);
      s += C(0, -36, 38) + C(0, -36, 26) + curve('M-14 -50Q-4 -58 8 -56', ctx.thin);
      for (const y of [-92, 20]) s += C(-44, y, 4, ctx.thin) + C(44, y, 4, ctx.thin);
      s += P('M-10 62L10 62L13 138Q0 144 -13 138Z');
      s += P('M-68 -104Q-62 -162 0 -198Q62 -162 68 -104Q0 -90 -68 -104Z');
      return s;
    }
    if (style === 1) {
      // happy rocket zooming up with puffs of smoke
      const rc = [[0, -140], [58, -126], [72, -40], [60, 62]];
      let r = flame(0, 92, 34, 82);
      r += P('M-48 10C-92 30 -104 80 -96 118L-44 90Z') + P('M48 10C92 30 104 80 96 118L44 90Z');
      r += P(`M0 -140${cD(rc)}Q50 104 0 106Q-50 104 -60 62${cD(revC(mirC(rc)))}Z`);
      const cap = splitC(rc, 0.36)[0];
      r += P(`M0 -140${cD(cap)}Q0 ${f(cap[3][1] + 16)} ${f(-cap[3][0])} ${f(cap[3][1])}${cD(revC(mirC(cap)))}Z`);
      r += dotEye(-22, -16, 10) + dotEye(22, -16, 10) + smile(0, 8, 40, 0.45) + cheeks(0, 4, 40, 9, ctx);
      r += star(0, 60, 22, 10);
      let s = C(-122, 138, 38) + C(-170, 168, 24) + C(-80, 168, 22);
      s += g(r, 'translate(28 -28) rotate(40)');
      s += deco(ctx, star(118, 118, 24, 10) + star(-150, -130, 20, 9) + sparkle(160, -10, 16) + sparkle(-60, -170, 14));
      return s;
    }
    if (style === 2) {
      // round retro rocket with a child waving from the big window
      const rc = [[0, -196], [74, -156], [92, -30], [74, 86]];
      let s = flame(0, 96, 34, 76);
      s += P('M60 0C112 30 138 110 140 194L104 194C100 150 88 124 66 106Z');
      s += P('M-60 0C-112 30 -138 110 -140 194L-104 194C-100 150 -88 124 -66 106Z');
      s += P(`M0 -196${cD(rc)}Q0 112 -74 86${cD(revC(mirC(rc)))}Z`);
      s += bodyBand(rc, 0, 0.28, 14);
      s += bodyBand(rc, 0.8, 0.9, 10);
      // window and child
      const wy = -52;
      s += C(0, wy, 60) + C(0, wy, 47);
      s += P(`M-38.6 ${wy + 25}Q0 ${wy + 6} 38.6 ${wy + 25}A47 47 0 0 1 -38.6 ${wy + 25}Z`);
      s += curlyHair(0, wy - 6, 27, Math.PI * 0.95, Math.PI * 2.05, 7, 7);
      s += C(0, wy - 6, 25);
      s += dotEye(-9, wy - 4, 4.5) + dotEye(9, wy - 4, 4.5) + smile(0, wy + 6, 14, 0.5);
      s += curve(`M30 ${wy - 40}Q40 ${wy - 34} 42 ${wy - 22}`, ctx.thin);
      // portholes and middle fin
      s += C(-40, 50, 11) + C(0, 56, 11) + C(40, 50, 11);
      return s;
    }
    // blasting off from the launch pad in big clouds of smoke
    let s = '';
    s += R(-150, -60, 22, 240) + line(-150, -30, -128, -10, ctx.thin) + line(-128, -10, -150, 10, ctx.thin) + line(-150, 30, -128, 50, ctx.thin) + line(-128, 50, -150, 70, ctx.thin) + line(-150, 90, -128, 110, ctx.thin);
    s += R(-128, -40, 50, 12) + R(-128, 40, 50, 12);
    const rc = [[0, -196], [40, -170], [48, -110], [48, -60]];
    s += P('M-40 50C-74 66 -84 100 -82 128L-40 112Z') + P('M40 50C74 66 84 100 82 128L40 112Z');
    s += flame(0, 116, 30, 46);
    s += P(`M0 -196${cD(rc)}L48 112Q0 124 -48 112L-48 -60${cD(revC(mirC(rc)))}Z`);
    s += bodyBand(rc, 0, 0.45, 10);
    s += R(-48, 60, 96, 22) + C(0, -20, 24) + C(0, -20, 15);
    s += cloud(-90, 168, 200) + cloud(100, 172, 210) + cloud(0, 186, 170);
    return s;
  },
};

const planet = {
  id: 'planet', name: 'Planet', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      // ringed planet with a happy face
      const back = P('M-196 0A196 54 0 0 1 196 0L150 0A150 32 0 0 0 -150 0Z');
      const front = P('M-196 0A196 54 0 0 0 196 0L150 0A150 32 0 0 1 -150 0Z');
      let s = g(back, rot(-14));
      s += C(0, 0, 122);
      s += curve('M-104 -64Q0 -40 104 -64', '') + curve('M-118 -32Q0 -10 118 -32', ctx.thin);
      s += eye(-40, 0, 15, [0.1, 0.1]) + eye(40, 0, 15, [0.1, 0.1]) + smile(0, 26, 40, 0.4) + cheeks(0, 22, 66, 10, ctx);
      s += g(front + curve('M-173 0A173 42 0 0 0 173 0', ctx.thin), rot(-14));
      s += deco(ctx, star(-160, -150, 22, 10) + star(155, 150, 20, 9) + sparkle(160, -140, 16) + sparkle(-150, 150, 14));
      return s;
    }
    if (style === 1) {
      // Earth with land and sea, and its little moon
      let s = C(0, 10, 150);
      s += blob([[-112, -70], [-84, -104], [-34, -104], [-14, -76], [-40, -52], [-46, -20], [-72, -20], [-100, -40]]);
      s += blob([[-58, 8], [-26, 14], [-16, 46], [-34, 92], [-50, 112], [-56, 70], [-74, 32]]);
      s += blob([[16, -102], [58, -112], [74, -82], [102, -66], [110, -24], [86, 22], [72, 82], [48, 108], [32, 62], [26, 14], [8, -16], [14, -60]]);
      s += blob([[96, 66], [124, 58], [130, 84], [104, 96]]);
      s += curve('M-120 60q20 -10 40 0', ctx.thin) + curve('M70 -128q16 -8 32 0', ctx.thin) + curve('M-10 130q18 -8 36 0', ctx.thin);
      s += C(150, -150, 32) + C(140, -160, 7, ctx.thin) + C(160, -138, 9, ctx.thin);
      s += deco(ctx, star(-160, -150, 20, 9) + sparkle(-165, 160, 16) + star(160, 160, 16, 7));
      return s;
    }
    // planet with three moons going round it
    let s = E(-10, 10, 196, 70, `fill="none" ${ctx.thin} stroke-dasharray="14 12"`);
    s += C(-10, 10, 112);
    s += P('M-118 -20Q-10 0 98 -20L102 10Q-10 32 -122 10Z');
    s += C(-50, -60, 18) + C(30, 60, 24) + C(50, -55, 11) + C(-60, 64, 12);
    s += C(150, -120, 40) + C(140, -132, 9, ctx.thin) + C(162, -104, 7, ctx.thin);
    s += C(-160, -140, 26) + C(-150, -146, 6, ctx.thin);
    s += C(140, 130, 30) + C(132, 124, 7, ctx.thin);
    s += deco(ctx, star(40, -165, 18, 8) + sparkle(-150, 150, 16));
    return s;
  },
};

/** An astronaut. o.gl / o.gr: glove positions, o.hair: 'curly' | 'cap' | 'buns', o.stand: legs straight down. */
function astronaut(ctx, o) {
  let s = R(-80, -58, 160, 150, 24);
  const legs = o.stand ? [[-34, 100, -38, 158], [34, 100, 38, 158]] : [[-34, 100, -66, 152], [34, 100, 58, 160]];
  for (const [x1, y1, x2, y2] of legs) s += limb(x1, y1, x2, y2, 27);
  for (const [, , x, y] of legs) s += P(`M${x - 34} ${y + 36}Q${x - 36} ${y - 4} ${x} ${y - 6}Q${x + 36} ${y - 4} ${x + 38} ${y + 36}Z`);
  const arm = (gx, gy, side) => limb(side * 58, -14, gx, gy, 23) + C(gx, gy, 25) + E(gx + side * -4, gy, 9, 14, ctx.thin);
  s += arm(o.gl[0], o.gl[1], -1) + arm(o.gr[0], o.gr[1], 1);
  s += R(-70, -44, 140, 152, 50);
  s += R(-70, 82, 140, 20, 0);
  s += R(-38, -4, 76, 50, 10) + C(-18, 14, 8) + C(4, 14, 8) + R(-14, 30, 40, 8, 3, ctx.thin) + C(26, 14, 6, ctx.thin);
  s += E(0, -44, 64, 18);
  s += R(-102, -136, 20, 40, 8) + R(82, -136, 20, 40, 8);
  s += C(0, -118, 88) + C(0, -114, 68);
  const hy = -106;
  if (o.hair === 'curly') s += curlyHair(0, hy, 50, Math.PI * 1.03, Math.PI * 1.97, 7, 12);
  if (o.hair === 'buns') s += C(-36, hy - 36, 15) + C(36, hy - 36, 15);
  s += C(0, hy, 44);
  if (o.hair === 'cap') s += P(`M-44 ${hy}Q-48 ${hy - 50} 0 ${hy - 48}Q48 ${hy - 50} 44 ${hy}Q36 ${hy - 22} 16 ${hy - 24}Q4 ${hy - 14} -10 ${hy - 24}Q-30 ${hy - 26} -44 ${hy}Z`);
  if (o.hair === 'buns') s += P(`M-43 ${hy - 6}Q-44 ${hy - 46} 0 ${hy - 46}Q44 ${hy - 46} 43 ${hy - 6}Q30 ${hy - 28} 0 ${hy - 28}Q-30 ${hy - 28} -43 ${hy - 6}Z`);
  s += dotEye(-16, hy + 2, 7) + dotEye(16, hy + 2, 7) + smile(0, hy + 18, 24, 0.5) + cheeks(0, hy + 14, 28, 6, ctx);
  s += curve('M34 -170Q54 -160 60 -138', ctx.thin);
  return s;
}

const astronautSub = {
  id: 'astronaut', name: 'Astronaut', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      let s = smooth([[80, 40], [130, 70], [140, 130], [175, 150], [196, 120]]);
      s += astronaut(ctx, { gl: [-140, -100], gr: [118, 56], hair: 'curly' });
      s += deco(ctx, star(150, -150, 22, 10) + sparkle(-160, 120, 16) + star(-165, 40, 14, 6));
      return s;
    }
    if (style === 1) {
      // planting a flag on the moon
      let s = P('M-198 200L-198 150Q-120 118 -30 136Q80 154 198 128L198 200Z');
      s += E(-130, 172, 30, 9) + E(100, 176, 38, 10) + E(10, 186, 18, 6);
      s += R(64, -186, 9, 330, 3);
      s += P('M73 -184Q102 -198 130 -184T186 -184L186 -122Q158 -136 130 -122T73 -122Z') + star(130, -154, 20, 8);
      s += g(astronaut(ctx, { gl: [-120, -86], gr: [96, 6], hair: 'cap', stand: true }), 'translate(-40 -14) scale(0.78)');
      return s;
    }
    // big close-up: astronaut's smiling face in the helmet
    let s = P('M-196 200Q-190 106 -110 92L110 92Q190 106 196 200Z');
    s += R(-46, 134, 92, 50, 10) + C(-24, 152, 9) + C(0, 152, 9) + C(24, 152, 9);
    s += C(-140, 160, 24) + star(-140, 160, 15, 6);
    s += E(0, 94, 118, 26);
    s += R(-172, -66, 26, 70, 10) + R(146, -66, 26, 70, 10);
    s += C(0, -32, 152) + E(0, -26, 120, 112);
    s += P('M-90 34Q-100 -104 0 -106Q100 -104 90 34Q70 46 56 20L-56 20Q-70 46 -90 34Z');
    s += C(0, -16, 74);
    s += P('M-73 -26Q-76 -96 0 -94Q76 -96 73 -26Q60 -60 20 -62Q0 -50 -20 -62Q-60 -60 -73 -26Z');
    s += eye(-28, -10, 14, [0, 0.1]) + eye(28, -10, 14, [0, 0.1]) + smile(0, 24, 44, 0.45) + cheeks(0, 18, 50, 10, ctx);
    s += curve('M-96 -96Q-80 -120 -52 -130', ctx.thin) + curve('M-104 -76Q-102 -84 -98 -90', ctx.thin);
    return s;
  },
};

const moon = {
  id: 'moon', name: 'Moon and stars', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      // sleepy crescent moon in a nightcap
      let s = crescent(-20, 10, 165, 80, -40, 140);
      s += curve('M-150 -30Q-136 -18 -120 -30', '') + curve('M-144 -22L-148 -12M-136 -20L-136 -10M-127 -23L-124 -14', ctx.thin);
      s += curve('M-142 34Q-126 48 -110 36', '');
      s += deco(ctx, star(110, 20, 32, 14) + star(150, 120, 20, 9) + star(30, 150, 18, 8) + sparkle(160, -60, 16));
      s += cloud(-10, 172, 200);
      return s;
    }
    if (style === 1) {
      // full moon with craters and a big smile
      let s = C(0, 0, 150);
      s += C(-80, -70, 22) + C(70, -96, 16) + C(96, 60, 26) + C(-60, 96, 18) + C(10, 120, 10) + C(-110, 30, 12);
      s += eye(-44, -14, 16, [0, -0.1]) + eye(44, -14, 16, [0, -0.1]) + smile(0, 30, 70, 0.4) + cheeks(0, 24, 80, 14, ctx);
      s += deco(ctx, star(-160, -160, 22, 10) + star(165, -150, 18, 8) + star(168, 140, 24, 10) + sparkle(-165, 150, 16) + sparkle(170, 10, 12));
      return s;
    }
    // a crescent moon mobile with stars hanging on strings
    let s = line(-135, -55, 0, -196, ctx.thin) + line(135, -55, 0, -196, ctx.thin) + C(0, -196, 5);
    s += line(-90, 80, -90, 128, ctx.thin) + line(0, 110, 0, 150, ctx.thin) + line(90, 80, 90, 112, ctx.thin);
    s += crescent(0, -20, 140, 0, -70, 140);
    s += curve('M-46 66Q-32 78 -18 66M18 66Q32 78 46 66') + smile(0, 90, 30, 0.4) + cheeks(0, 82, 58, 8, ctx);
    s += star(-90, 150, 26, 11) + heart(0, 172, 46) + star(90, 134, 24, 10) + deco(ctx, star(-160, -150, 18, 8) + sparkle(165, -140, 14) + sparkle(-170, 60, 12) + star(166, 40, 14, 6));
    return s;
  },
};

const alien = {
  id: 'alien', name: 'Friendly alien', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      // round alien with one big eye
      let s = line(-40, -96, -66, -160) + line(40, -96, 66, -160) + C(-68, -168, 16) + C(68, -168, 16);
      s += limb(-96, 30, -164, -40, 18) + C(-170, -48, 20) + limb(96, 40, 154, 90, 18) + C(160, 96, 20);
      s += E(-50, 172, 40, 22) + E(50, 172, 40, 22);
      s += blob([[0, -116], [80, -100], [118, -20], [116, 80], [70, 150], [0, 164], [-70, 150], [-116, 80], [-118, -20], [-80, -100]]);
      s += E(0, 86, 58, 50);
      s += C(0, -24, 52) + dark(C(4, -18, 26)) + C(-6, -30, 8, 'fill="#fff" stroke="none"');
      s += curve('M-50 -60Q-30 -94 0 -94', ctx.thin);
      s += P('M-34 34Q0 64 34 34Q0 44 -34 34Z') + R(-8, 40, 16, 12, 2, ctx.thin);
      s += C(-84, -40, 10) + C(86, 0, 12) + C(-80, 70, 8);
      return s;
    }
    if (style === 1) {
      // alien with eyes on stalks and four waving arms
      let s = limb(-30, -50, -56, -120, 10) + limb(30, -50, 56, -120, 10);
      s += eye(-60, -144, 30, [0.3, 0]) + eye(60, -144, 30, [-0.3, 0]);
      s += limb(-50, 70, -60, 150, 20) + limb(50, 70, 60, 150, 20) + E(-70, 170, 34, 20) + E(70, 170, 34, 20);
      s += limb(-70, 0, -160, -40, 14) + C(-166, -44, 16) + limb(-80, 50, -170, 70, 14) + C(-174, 72, 16);
      s += limb(70, 0, 160, -40, 14) + C(166, -44, 16) + limb(80, 50, 170, 70, 14) + C(174, 72, 16);
      s += blob([[0, -70], [70, -50], [96, 30], [80, 100], [0, 124], [-80, 100], [-96, 30], [-70, -50]]);
      s += P('M-44 -6Q0 50 44 -6Z') + P('M-24 18Q0 38 24 18Q0 28 -24 18Z');
      s += star(0, 78, 22, 10) + C(-58, 54, 10) + C(60, 40, 8) + C(-50, -36, 7);
      return s;
    }
    // little alien standing on a tiny ringed planet, waving
    let s = g(P('M-190 0A190 40 0 0 1 190 0L150 0A150 26 0 0 0 -150 0Z'), 'translate(0 110) rotate(-8)');
    s += C(0, 120, 96) + C(-44, 100, 14) + C(36, 150, 18) + C(50, 80, 9);
    s += g(P('M-190 0A190 40 0 0 0 190 0L150 0A150 26 0 0 1 -150 0Z'), 'translate(0 110) rotate(-8)');
    s += limb(-22, -6, -28, 30, 14) + limb(22, -6, 28, 30, 14) + E(-32, 34, 20, 11) + E(32, 34, 20, 11);
    s += limb(-40, -50, -100, -110, 12) + C(-104, -116, 14) + limb(40, -50, 84, -20, 12) + C(90, -16, 14);
    s += R(-46, -80, 92, 86, 36);
    s += line(0, -150, 0, -190) + C(0, -192, 10);
    s += E(0, -112, 80, 56);
    s += eye(-36, -116, 16) + eye(0, -128, 16) + eye(36, -116, 16) + smile(0, -86, 40, 0.4);
    s += C(-20, -40, 8) + C(14, -24, 6);
    s += deco(ctx, star(150, -150, 20, 9) + sparkle(-160, -40, 14));
    return s;
  },
};

const saucer = {
  id: 'flying-saucer', name: 'Flying saucer', styles: 3, scenes: ['plain', 'hearts', 'stars', 'space', 'night', 'sky'],
  draw(style, rand, ctx) {
    const ufo = (alienInside) => {
      let s = E(0, 40, 110, 34);
      for (const x of [-60, 0, 60]) s += C(x, 62, 12);
      s += P('M-120 0A120 120 0 0 1 120 0Z');
      if (alienInside) {
        s += line(-20, -66, -36, -100) + line(20, -66, 36, -100) + C(-38, -104, 9) + C(38, -104, 9);
        s += E(0, -30, 44, 46) + dotEye(-16, -38, 8) + dotEye(16, -38, 8) + smile(0, -18, 24, 0.5);
        s += curve('M62 -80Q86 -60 92 -32', ctx.thin);
      } else s += curve('M50 -86Q84 -62 92 -30', ctx.thin) + curve('M66 -94Q72 -90 76 -84', ctx.thin);
      s += E(0, 14, 196, 46);
      s += curve('M-190 14Q0 40 190 14', ctx.thin);
      for (const x of [-140, -70, 0, 70, 140]) s += C(x, 22, 13);
      return s;
    };
    if (style === 0) {
      let s = g(ufo(true), 'translate(0 10)');
      s += curve('M-196 110L-120 110M-180 140L-90 140M-196 170L-140 170');
      s += deco(ctx, star(150, -150, 20, 9) + sparkle(-150, -150, 16) + star(160, 150, 16, 7));
      return s;
    }
    if (style === 1) {
      // tilted saucer shining a light beam
      let s = P('M-40 -10L40 -10L150 196L-150 196Z');
      s += sparkle(-40, 100, 18) + star(40, 150, 20, 9) + sparkle(30, 60, 12) + C(-70, 170, 8);
      s += g(ufo(false) + line(0, -120, 0, -150) + C(0, -156, 10), 'translate(0 -70) scale(0.8) rotate(-10)');
      return s;
    }
    // landed saucer with a ramp, a small alien comes out to say hello
    let s = limb(-120, 40, -160, 186, 10) + limb(120, 40, 160, 186, 10) + limb(0, 60, 0, 186, 10);
    s += E(-160, 190, 26, 8) + E(160, 190, 26, 8) + E(0, 190, 26, 8);
    s += g(ufo(false), 'translate(0 -30)');
    s += P('M40 40L86 40L140 196L70 196Z') + curve('M58 80L100 80M66 120L114 120M74 160L128 160', ctx.thin);
    // small alien
    let a = limb(-10, 40, -12, 70, 8) + limb(10, 40, 12, 70, 8) + E(-14, 74, 12, 7) + E(14, 74, 12, 7);
    a += limb(-18, 14, -44, -14, 7) + C(-46, -18, 8) + limb(18, 14, 34, 34, 7);
    a += R(-22, 0, 44, 46, 18) + line(0, -46, 0, -64) + C(0, -68, 7) + E(0, -20, 34, 28) + dotEye(-12, -22, 6) + dotEye(12, -22, 6) + smile(0, -8, 16, 0.5);
    s += g(a, 'translate(-132 92) scale(1.4)');
    return s;
  },
};

const satellite = {
  id: 'satellite', name: 'Satellite', styles: 3,
  draw(style, rand, ctx) {
    const panel = (x, y, w, h) => {
      let s = R(x, y, w, h, 4);
      for (let i = 1; i < 4; i++) s += line(x + (w * i) / 4, y, x + (w * i) / 4, y + h, ctx.thin);
      s += line(x, y + h / 2, x + w, y + h / 2, ctx.thin);
      return s;
    };
    if (style === 0) {
      let s = R(-120, -6, 240, 12);
      s += panel(-196, -40, 120, 80) + panel(76, -40, 120, 80);
      s += line(0, -50, 0, -96) + P('M-44 -120Q0 -70 44 -120Q0 -100 -44 -120Z') + line(0, -100, 0, -136) + C(0, -140, 6);
      s += line(-20, 50, -36, 100) + line(20, 50, 36, 100) + C(-38, 104, 7) + C(38, 104, 7);
      s += R(-52, -56, 104, 112, 10) + R(-34, -36, 68, 40, 6) + C(-20, 30, 8) + C(0, 30, 8) + C(20, 30, 8);
      return g(s, rot(-18)) + deco(ctx, star(-150, 130, 20, 9) + sparkle(150, 140, 16) + star(140, -160, 16, 7));
    }
    if (style === 1) {
      // space telescope with solar wings, looking out from above the Earth
      let t = panel(-120, -176, 96, 116) + panel(-120, 60, 96, 116);
      t += R(-80, -62, 12, 124);
      t += R(-170, -50, 280, 100, 18) + R(-120, -50, 34, 100) + R(40, -50, 26, 100);
      t += E(110, 0, 18, 50) + P('M104 -50L150 -120L168 -110L122 -46Z');
      t += C(-140, 0, 12);
      let s = C(130, 150, 52) + blob([[100, 126], [130, 112], [150, 130], [130, 160], [104, 152]]) + blob([[150, 168], [174, 160], [176, 186], [156, 192]]);
      s += g(t, 'translate(-10 -30) rotate(-25) scale(0.9)');
      s += deco(ctx, star(150, -160, 22, 10) + sparkle(-160, 160, 16) + star(-30, 180, 14, 6));
      return s;
    }
    // satellite with a big dish sending signals
    let s = '';
    s += P('M-60 20L-190 -20L-190 50L-60 70Z') + line(-125, 0, -125, 60, ctx.thin) + line(-190, 15, -60, 45, ctx.thin);
    s += P('M60 20L190 -20L190 50L60 70Z') + line(125, 0, 125, 60, ctx.thin) + line(190, 15, 60, 45, ctx.thin);
    s += R(-46, -10, 92, 140, 12) + R(-30, 10, 60, 30, 5) + C(-14, 66, 8) + C(14, 66, 8) + line(-30, 96, 30, 96, ctx.thin);
    s += R(-50, 126, 100, 18, 6);
    s += limb(0, -10, -30, -60, 8);
    s += g(P('M-80 0Q0 80 80 0Q0 24 -80 0Z') + line(0, 14, 0, -40) + C(0, -46, 8), 'translate(-50 -96) rotate(-35)');
    s += curve('M-150 -128Q-146 -158 -116 -168', '') + curve('M-180 -124Q-170 -186 -112 -194', '');
    s += deco(ctx, star(150, -130, 22, 10) + sparkle(130, 160, 14) + star(-160, 140, 16, 7));
    return s;
  },
};

// ---------- HOUSES AND PLACES ----------

const house = {
  id: 'house', name: 'House', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'night', 'snow'],
  draw(style, rand, ctx) {
    if (style === 0) {
      // cosy house with a chimney and flower boxes
      let s = C(98, -176, 12) + C(118, -192, 8);
      s += R(70, -150, 40, 90) + R(62, -160, 56, 16, 4);
      s += R(-142, -20, 284, 220);
      s += poly([[-176, -6], [0, -150], [176, -6]]);
      for (const [y, hw] of [[-60, 64], [-30, 100]]) s += scallopRow(-hw, hw, y, 26, ctx.thin);
      s += roundWin(0, -62, 22, ctx);
      s += arch(-34, 68, 68, 132) + knob(20, 140) + R(-46, 192, 92, 8, 3);
      s += win(-122, 24, 64, 60, ctx) + win(58, 24, 64, 60, ctx);
      s += R(-128, 86, 76, 18, 4) + R(52, 86, 76, 18, 4);
      for (const x of [-112, -90, -68, 68, 90, 112]) s += C(x, 80, 9);
      s += bush(-160, 200, 80, 60, rand) + bush(160, 200, 80, 60, rand);
      return s;
    }
    if (style === 1) {
      // big two-floor house with a porch and steps
      let s = R(110, -170, 36, 70) + R(104, -178, 48, 14, 4);
      s += R(-170, -50, 340, 250);
      s += poly([[-192, -40], [-136, -150], [136, -150], [192, -40]]);
      s += poly([[-80, -60], [-50, -122], [-20, -60]]) + win(-64, -96, 28, 30, ctx);
      s += poly([[20, -60], [50, -122], [80, -60]]) + win(36, -96, 28, 30, ctx);
      s += win(-146, -20, 56, 54, ctx) + win(-28, -20, 56, 54, ctx) + win(90, -20, 56, 54, ctx);
      s += R(-160, -22, 12, 58) + R(-90, -22, 12, 58) + R(78, -22, 12, 58) + R(148, -22, 12, 58);
      s += win(-150, 96, 60, 64, ctx) + win(90, 96, 60, 64, ctx);
      s += R(-28, 98, 56, 96, 4) + knob(18, 150) + R(-16, 110, 32, 30, 3, ctx.thin);
      s += R(-82, 78, 14, 108) + R(68, 78, 14, 108);
      s += poly([[-100, 80], [-80, 50], [80, 50], [100, 80]]);
      s += R(-66, 182, 132, 9) + R(-76, 191, 152, 9);
      return s;
    }
    // storybook cottage with a curvy roof and round door
    let s = curve('M104 -166q-12 -8 0 -16t0 -14', '');
    s += R(86, -160, 36, 70, 4);
    s += P('M-140 200L-130 -10L130 -10L140 200Z');
    s += P('M-180 20Q-190 -10 -160 -50Q-120 -150 0 -164Q120 -150 160 -50Q190 -10 180 20Q150 0 120 24Q90 0 60 24Q30 0 0 24Q-30 0 -60 24Q-90 0 -120 24Q-150 0 -180 20Z');
    s += curve('M-120 -50Q-60 -110 0 -112M40 -120Q100 -110 130 -60', ctx.thin) + curve('M-150 -10Q-120 -60 -80 -70M80 -74Q130 -50 150 -14', ctx.thin);
    s += arch(-40, 74, 80, 126) + line(-13, 88, -13, 200, ctx.thin) + line(13, 82, 13, 200, ctx.thin) + knob(26, 140);
    s += roundWin(-90, 90, 28, ctx) + roundWin(90, 90, 28, ctx);
    s += P('M-30 -84Q0 -116 30 -84Z') + R(-30, -84, 60, 6, 2);
    s += tulip(-120, 200, 50, ctx) + tulip(-60, 200, 40, ctx) + tulip(70, 200, 44, ctx) + tulip(124, 200, 52, ctx);
    return s;
  },
};

const castle = {
  id: 'castle', name: 'Castle', styles: 3, scenes: ['plain', 'hearts', 'stars', 'hills', 'meadow', 'night', 'garden'],
  draw(style, rand, ctx) {
    const flag = (x, y, h = 30, w = 34) => line(x, y, x, y - h) + P(`M${x} ${y - h}L${x + w} ${y - h + 9}L${x} ${y - h + 18}Z`);
    if (style === 0) {
      // fairy-tale castle with pointy towers
      let s = flag(0, -168, 30) + flag(-130, -126, 26, 28) + flag(130, -126, 26, 28);
      s += R(-48, -110, 96, 200);
      s += poly([[-62, -106], [0, -170], [62, -106]]);
      s += archWin(-16, -80, 32, 50, ctx);
      s += crenWall(-110, 110, 20, 200, 6, 20);
      s += R(-170, -40, 76, 240) + R(94, -40, 76, 240);
      s += poly([[-184, -36], [-132, -128], [-80, -36]]) + poly([[80, -36], [132, -128], [184, -36]]);
      s += archWin(-146, 0, 28, 44, ctx) + archWin(118, 0, 28, 44, ctx) + archWin(-146, 90, 28, 44, ctx) + archWin(118, 90, 28, 44, ctx);
      s += arch(-42, 100, 84, 100) + line(0, 100, 0, 200, ctx.thin) + knob(-12, 160) + knob(12, 160);
      s += heart(0, 60, 34) + bricks([[-90, 56], [-82, 140], [56, 96], [60, 166]], ctx);
      return s;
    }
    if (style === 1) {
      // stone castle with battlements and a drawbridge over the moat
      let s = flag(-140, -132, 40, 40) + flag(140, -132, 40, 40);
      s += crenWall(-100, 100, -40, 170, 7, 22);
      s += crenWall(-190, -90, -110, 170, 3, 24) + crenWall(90, 190, -110, 170, 3, 24);
      s += archWin(-152, -70, 26, 40, ctx) + archWin(126, -70, 26, 40, ctx) + archWin(-152, 30, 26, 40, ctx) + archWin(126, 30, 26, 40, ctx);
      s += bricks([[-182, -12], [-122, -2], [-178, 96], [-120, 124], [100, -8], [152, 4], [106, 110], [150, 130], [-88, 2], [-30, -16], [44, 8], [66, 92], [-92, 110]], ctx);
      s += arch(-56, 40, 112, 130);
      for (const x of [-30, 0, 30]) s += line(x, 52, x, 170, ctx.thin);
      for (const y of [80, 110, 140]) s += line(-56, y, 56, y, ctx.thin);
      s += P('M-198 170L198 170L198 200L-198 200Z') + curve('M-190 186q20 -10 40 0t40 0t40 0', ctx.thin) + curve('M70 186q20 -10 40 0t40 0t40 0', ctx.thin);
      s += P('M-56 170L56 170L76 200L-76 200Z') + line(-28, 170, -36, 200, ctx.thin) + line(0, 170, 0, 200, ctx.thin) + line(28, 170, 36, 200, ctx.thin);
      s += line(-46, 62, -70, 196, ctx.thin) + line(46, 62, 70, 196, ctx.thin);
      return s;
    }
    // tall tower castle with climbing roses
    let s = flag(0, -168, 30);
    s += R(60, -40, 56, 240) + poly([[50, -36], [88, -110], [126, -36]]) + archWin(74, 0, 28, 40, ctx);
    s += P('M-70 200L-60 -80L60 -80L70 200Z');
    s += P('M-90 -76Q-60 -96 0 -170Q60 -96 90 -76Z');
    s += R(-76, -86, 152, 16, 6);
    s += archWin(-24, -50, 48, 64, ctx) + R(-34, 14, 68, 14, 4);
    s += archWin(-18, 60, 36, 50, ctx);
    s += arch(-30, 130, 60, 70) + knob(16, 170);
    s += smooth([[-66, 196], [-50, 150], [-62, 100], [-44, 40], [-56, -20]]);
    for (const [x, y] of [[-50, 150], [-62, 100], [-44, 40], [-54, -10]]) s += C(x, y, 11) + P(`M${x + 6} ${y + 10}q14 -2 18 10q-14 2 -18 -10Z`);
    s += bush(-130, 200, 110, 70, rand) + bush(160, 200, 70, 50, rand);
    return s;
  },
};

const school = {
  id: 'school', name: 'School', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) {
      // little schoolhouse with a bell tower
      let s = R(-34, -168, 68, 76) + poly([[-48, -166], [0, -200], [48, -166]]);
      s += arch(-20, -152, 40, 50) + P('M-12 -110Q-12 -136 0 -138Q12 -136 12 -110Z') + C(0, -106, 4);
      s += R(-170, -20, 340, 220);
      s += poly([[-190, -10], [0, -120], [190, -10]]);
      s += C(0, -56, 26) + line(0, -56, 0, -72, ctx.thin) + line(0, -56, 12, -50, ctx.thin);
      s += R(-44, 70, 88, 122, 4) + line(0, 70, 0, 192, ctx.thin) + knob(-10, 134) + knob(10, 134);
      s += R(-58, 54, 116, 16, 4);
      s += R(-56, 192, 112, 8, 3);
      for (const x of [-152, -100, 64, 116]) s += win(x, 20, 36, 70, ctx);
      s += win(-152, 120, 88, 40, ctx) + win(64, 120, 88, 40, ctx);
      return s;
    }
    if (style === 1) {
      // big school building with a clock and a flag
      let s = line(170, 200, 170, -180) + C(170, -184, 6) + P('M170 -176L196 -176L196 -140L170 -140Z') + star(183, -158, 10, 4.5);
      s += R(-190, -40, 340, 240);
      s += R(-196, -54, 352, 18, 4);
      s += R(-60, -120, 120, 70) + R(-66, -132, 132, 16, 4);
      s += C(0, -84, 28) + line(0, -84, 0, -104, ctx.thin) + line(0, -84, 14, -78, ctx.thin);
      for (const x of [-170, -120, 60, 110]) s += win(x, -20, 40, 50, ctx) + win(x, 60, 40, 50, ctx);
      s += win(-50, -20, 40, 50, ctx) + win(10, -20, 40, 50, ctx);
      s += R(-40, 110, 80, 82, 4) + line(0, 110, 0, 192, ctx.thin) + knob(-10, 152) + knob(10, 152);
      s += P('M-60 110L60 110L70 86L-70 86Z');
      s += R(-60, 192, 120, 8, 3);
      s += bush(-150, 200, 80, 50, rand) + bush(110, 200, 70, 46, rand);
      return s;
    }
    // school with the school bus waiting in front
    let s = R(-34, -176, 68, 50) + poly([[-46, -174], [0, -200], [46, -174]]) + arch(-14, -168, 28, 38);
    s += R(-160, -70, 320, 200);
    s += poly([[-180, -60], [0, -150], [180, -60]]);
    s += C(0, -94, 20) + line(0, -94, 0, -106, ctx.thin) + line(0, -94, 9, -90, ctx.thin);
    for (const x of [-140, -90, 54, 104]) s += win(x, -40, 36, 50, ctx);
    s += R(-30, 20, 60, 110, 4) + line(0, 20, 0, 130, ctx.thin);
    // bus
    s += R(-196, 60, 330, 110, 22);
    s += P('M134 90L178 100Q196 104 196 124L196 170L134 170Z');
    for (const x of [-176, -124, -72, -20, 32]) s += R(x, 76, 42, 36, 6);
    s += R(84, 76, 40, 80, 5) + line(104, 76, 104, 156, ctx.thin);
    s += R(140, 108, 44, 26, 5);
    s += R(-196, 126, 330, 10, 0, ctx.thin) + C(188, 150, 7);
    s += C(-120, 172, 26) + C(-120, 172, 10) + C(120, 172, 26) + C(120, 172, 10);
    return s;
  },
};

/** Tapered tower helpers for lighthouses: half-width at y. */
const towerHW = (yt, yb, wt, wb) => (y) => wt + ((wb - wt) * (y - yt)) / (yb - yt);
function stripeBand(hw, ya, yb) {
  return shape([[-hw(ya), ya], [hw(ya), ya], [hw(yb), yb], [-hw(yb), yb]]);
}
function lighthouseTop(cx, yTop, w, ctx, beams) {
  // yTop is the gallery floor; returns gallery, rail, lamp room, dome
  let s = '';
  if (beams) s += shape([[cx - 30, yTop - 50], [cx - 196, yTop - 100], [cx - 196, yTop - 10], [cx - 30, yTop - 32]]) + shape([[cx + 30, yTop - 50], [cx + 196, yTop - 100], [cx + 196, yTop - 10], [cx + 30, yTop - 32]]);
  s += R(cx - w * 0.42, yTop - 64, w * 0.84, 64, 4) + C(cx, yTop - 32, w * 0.2) + line(cx - w * 0.42, yTop - 50, cx + w * 0.42, yTop - 50, ctx.thin);
  s += P(`M${cx - w * 0.52} ${yTop - 62}Q${cx} ${yTop - 64 - w * 0.75} ${cx + w * 0.52} ${yTop - 62}Z`) + C(cx, yTop - 62 - w * 0.4, 8);
  s += R(cx - w * 0.55, yTop - 28, w * 1.1, 6, 0, ctx.thin);
  for (let i = 0; i <= 6; i++) s += line(cx - w * 0.55 + (i * w * 1.1) / 6, yTop - 28, cx - w * 0.55 + (i * w * 1.1) / 6, yTop, ctx.thin);
  s += R(cx - w * 0.62, yTop, w * 1.24, 16, 4);
  return s;
}

const lighthouse = {
  id: 'lighthouse', name: 'Lighthouse', styles: 3, scenes: ['plain', 'hearts', 'stars', 'water', 'night', 'hills'],
  draw(style, rand, ctx) {
    if (style === 0) {
      // striped lighthouse on rocks shining its light
      const hw = towerHW(-90, 160, 46, 74);
      let s = lighthouseTop(0, -106, 110, ctx, ctx.s > 1.2);
      s += shape([[-hw(-90), -90], [hw(-90), -90], [hw(160), 160], [-hw(160), 160]]);
      for (const [a, b] of [[-60, -10], [40, 90]]) s += stripeBand(hw, a, b);
      s += archWin(-14, -70, 28, 34, ctx);
      s += arch(-24, 110, 48, 60);
      s += blob([[-170, 200], [-176, 160], [-130, 136], [-80, 150], [-60, 200]]) + blob([[60, 200], [70, 150], [120, 130], [176, 156], [180, 200]]) + blob([[-90, 200], [-70, 166], [0, 156], [70, 168], [90, 200]]);
      return s;
    }
    if (style === 1) {
      // lighthouse with the keeper's little cottage
      const hw = towerHW(-80, 200, 38, 62), cx = -90;
      let s = g(lighthouseTop(0, -96, 94, ctx, false), `translate(${cx} 0)`);
      s += g(shape([[-hw(-80), -80], [hw(-80), -80], [hw(200), 200], [-hw(200), 200]]) + stripeBand(hw, -40, 10) + stripeBand(hw, 60, 110) + archWin(-12, 20, 24, 30, ctx) + archWin(-12, 130, 24, 30, ctx), `translate(${cx} 0)`);
      s += R(-20, 60, 200, 140);
      s += poly([[-36, 70], [80, -20], [196, 70]]);
      s += R(126, -10, 26, 44);
      s += win(0, 100, 50, 46, ctx) + win(120, 100, 50, 46, ctx) + arch(64, 120, 44, 80) + knob(98, 164);
      s += roundWin(80, 34, 16, ctx);
      return s;
    }
    // spiral-striped lighthouse on a little island with waves and a seagull
    const yt = -80, yb = 150, hw = towerHW(yt, yb, 40, 66);
    let s = lighthouseTop(0, -96, 100, ctx, false);
    s += shape([[-hw(yt), yt], [hw(yt), yt], [hw(yb), yb], [-hw(yb), yb]]);
    const a = 46 + (66 - 46) * 0, k = -0.5; // band lines y = c + k x
    const hwA = 40 - (26 / 230) * yt, hwB = 26 / 230; // hw(y) = hwA + hwB*y
    for (const c of [-50, 30, 110]) {
      const yL = (y0) => (y0 - k * hwA) / (1 + k * hwB), yR = (y0) => (y0 + k * hwA) / (1 - k * hwB);
      const l1 = yL(c), r1y = yR(c), l2 = yL(c + 36), r2y = yR(c + 36);
      if (Math.min(l1, r1y) < yt || Math.max(l2, r2y) > yb) continue;
      s += shape([[-hw(l1), l1], [hw(r1y), r1y], [hw(r2y), r2y], [-hw(l2), l2]]);
    }
    s += arch(-20, 110, 40, 40);
    s += blob([[-170, 200], [-150, 160], [-80, 140], [0, 146], [90, 138], [160, 160], [180, 200]]);
    s += curve('M-196 190q20 -12 40 0t40 0', '') + curve('M120 194q20 -12 40 0t36 0', '');
    s += curve('M120 -150q16 -16 30 0q14 -16 30 0') + curve('M-170 -110q12 -12 24 0q12 -12 24 0');
    return s;
  },
};

const barn = {
  id: 'barn', name: 'Barn', styles: 3,
  draw(style, rand, ctx) {
    const bigBarn = (sx = 1) => {
      let s = shape([[-150, 200], [-150, -20], [-130, -110], [0, -170], [130, -110], [150, -20], [150, 200]]);
      s += P(M([[-170, -14], [-146, -118], [0, -190], [146, -118], [170, -14], [150, -20], [130, -110], [0, -170], [-130, -110], [-150, -20]]));
      s += R(-80, 60, 80, 140) + R(0, 60, 80, 140);
      s += line(-80, 60, 0, 200) + line(-80, 200, 0, 60) + line(0, 60, 80, 200) + line(0, 200, 80, 60);
      s += R(-90, 48, 180, 14, 4);
      s += R(-36, -96, 72, 70) + line(-36, -96, 36, -26, ctx.thin) + line(36, -96, -36, -26, ctx.thin);
      s += curve('M-30 -26q4 -12 10 0M-16 -26q4 -14 10 0M0 -26q4 -12 10 0M14 -26q4 -14 10 0', ctx.thin);
      s += win(-130, 0, 36, 36, ctx) + win(94, 0, 36, 36, ctx);
      return s;
    };
    if (style === 0) return bigBarn();
    if (style === 1) {
      // barn with a tall round silo
      let s = R(100, -140, 90, 340) + P('M100 -140Q145 -210 190 -140Z');
      for (const y of [-90, -30, 30, 90, 150]) s += curve(`M100 ${y}Q145 ${y + 12} 190 ${y}`, ctx.thin);
      s += R(132, 100, 26, 40, 4);
      s += g(bigBarn(), 'translate(-56 0) scale(0.92 1)');
      return s;
    }
    // long barn seen from the side, with a little roof tower and hay bales
    let s = line(0, -150, 0, -198) + R(-24, -185, 40, 6, 0) + poly([[14, -194], [36, -182], [14, -170]]) + poly([[-36, -192], [-22, -192], [-16, -182], [-22, -172], [-36, -172], [-30, -182]]);
    s += R(-26, -150, 52, 40) + poly([[-38, -146], [0, -170], [38, -146]]) + line(0, -144, 0, -114, ctx.thin);
    s += R(-180, -20, 360, 220);
    s += poly([[-196, -10], [-150, -110], [150, -110], [196, -10]]);
    s += R(-60, 50, 120, 150) + line(-60, 50, 60, 200) + line(-60, 200, 60, 50) + R(-70, 38, 140, 14, 4);
    s += win(-160, 30, 60, 50, ctx) + win(100, 30, 60, 50, ctx);
    s += R(-196, 140, 100, 60, 12) + R(-176, 96, 80, 46, 12) + R(110, 144, 86, 56, 12);
    s += curve('M-180 160h70M-180 180h70M-160 112h50M-160 128h50M124 162h60M124 182h60', ctx.thin);
    return s;
  },
};

const tent = {
  id: 'tent', name: 'Tent', styles: 3, scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'night', 'hills'],
  draw(style, rand, ctx) {
    if (style === 0) {
      // A-frame tent with open flaps and a little campfire
      let s = line(-80, -130, -80, -160) + P('M-80 -160L-44 -150L-80 -140Z');
      s += line(-160, 90, -196, 196, ctx.thin) + line(0, 90, 30, 196, ctx.thin);
      s += poly([[-196, 196], [-80, -130], [36, 196]]);
      s += poly([[-130, 196], [-80, 20], [-30, 196]]);
      s += P('M-80 -60Q-110 60 -150 150Q-130 170 -130 196L-80 20Z') + P('M-80 -60Q-50 60 -10 150Q-30 170 -30 196L-80 20Z');
      s += C(-138, 150, 6) + C(-22, 150, 6);
      // campfire
      s += limb(70, 196, 170, 170, 10) + limb(70, 170, 170, 196, 10);
      s += P('M84 172C70 130 100 120 96 90C116 110 120 80 120 60C140 90 160 110 150 172Z') + P('M104 172C96 150 112 140 116 120C126 140 136 150 130 172Z');
      s += sparkle(160, 40, 10) + sparkle(84, 50, 8);
      return s;
    }
    if (style === 1) {
      // round dome tent with a zip door and a backpack
      let s = P('M-190 196C-190 0 -110 -110 -20 -110C70 -110 150 0 150 196Z');
      s += curve('M-150 196C-140 20 -80 -90 -20 -110', ctx.thin) + curve('M110 196C100 20 40 -90 -20 -110', ctx.thin);
      s += P('M-90 196L-90 40Q-90 -30 -20 -30Q50 -30 50 40L50 196Z');
      s += P('M-20 -30Q60 -20 60 60Q30 60 -20 -30Z') + curve('M-20 -26L-20 196', ctx.thin) + C(-20, 20, 6);
      s += R(-154, 40, 40, 30, 8) + R(76, 40, 40, 30, 8);
      s += line(-200, 196, -176, 120, ctx.thin) + line(196, 196, 140, 120, ctx.thin);
      s += R(116, 100, 74, 96, 22) + R(124, 140, 58, 40, 10) + curve('M134 100Q153 70 172 100', '') + line(130, 154, 176, 154, ctx.thin);
      return s;
    }
    // circus big top with stripes and a flag
    let s = line(0, -160, 0, -198) + P('M0 -198L36 -188L0 -178Z');
    s += R(-160, -40, 320, 240);
    for (let i = 0; i < 8; i += 2) s += R(-160 + i * 40, -40, 40, 240);
    s += P('M-30 200L-30 40Q0 10 30 40L30 200Z');
    s += P('M-30 40Q0 10 30 40L30 70Q10 90 6 200L-6 200Q-10 90 -30 70Z');
    let roof = 'M0 -170L-190 -36';
    for (let i = 0; i < 8; i++) roof += `Q${-190 + i * 47.5 + 23.75} -6 ${-190 + (i + 1) * 47.5} -36`;
    s += P(roof + 'Z');
    for (let i = 1; i < 8; i += 2) s += P(`M0 -170L${-190 + i * 47.5} -36L${-190 + (i + 1) * 47.5} -36Z`);
    s += C(0, -170, 10);
    return s;
  },
};

function penguin(x, y, s) {
  let p = E(-18, 0, 16, 8) + E(18, 0, 16, 8);
  p += P('M-36 -60Q-60 -30 -50 -10Q-40 -30 -32 -40Z') + P('M36 -60Q60 -30 50 -10Q40 -30 32 -40Z');
  p += E(0, -60, 40, 58) + E(0, -48, 26, 42);
  p += C(0, -110, 32) + E(0, -104, 22, 20);
  p += dotEye(-9, -110, 5) + dotEye(9, -110, 5) + P('M-8 -98L8 -98L0 -88Z');
  return g(p, `translate(${x} ${y}) scale(${s})`);
}

const igloo = {
  id: 'igloo', name: 'Igloo', styles: 4, scenes: ['plain', 'hearts', 'stars', 'snow', 'night'],
  draw(style, rand, ctx) {
    const dome = (cx, rx, ry, ent) => {
      let s = P(`M${cx - rx} 200A${rx} ${ry} 0 0 1 ${cx + rx} 200Z`);
      const rows = 5;
      for (let i = 1; i < rows; i++) {
        const y = 200 - (ry * i) / rows, hw = rx * Math.sqrt(1 - ((200 - y) / ry) ** 2);
        s += curve(`M${f(cx - hw)} ${f(y)}Q${f(cx)} ${f(y - 14)} ${f(cx + hw)} ${f(y)}`, ctx.thin);
        const yb = 200 - (ry * (i - 1)) / rows, hwb = rx * Math.sqrt(1 - ((200 - yb) / ry) ** 2);
        const n = 4 - (i > 2 ? 1 : 0);
        for (let j = 0; j < n; j++) {
          const t = (j + 0.5 + (i % 2) * 0.5) / (n + 0.5);
          const x = cx - hw + 2 * hw * t;
          if (ent && Math.abs(x - ent) < 70 && y > 80) continue;
          s += line(x, y + 2, x + (x - cx) * 0.04, yb - 4, ctx.thin);
        }
      }
      return s;
    };
    const tunnelFront = (cx, w, h) => P(`M${cx - w / 2} 200L${cx - w / 2} ${200 - h + w / 2}A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${200 - h + w / 2}L${cx + w / 2} 200Z`) +
      P(`M${cx - w / 2 + 24} 200L${cx - w / 2 + 24} ${200 - h + w / 2 + 12}A${w / 2 - 24} ${w / 2 - 24} 0 0 1 ${cx + w / 2 - 24} ${200 - h + w / 2 + 12}L${cx + w / 2 - 24} 200Z`) +
      curve(`M${cx - w / 2} ${200 - h / 2}L${cx - w / 2 + 24} ${200 - h / 2}M${cx + w / 2 - 24} ${200 - h / 2}L${cx + w / 2} ${200 - h / 2}`, ctx.thin);
    if (style === 0) {
      let s = dome(0, 186, 300, 0) + tunnelFront(0, 140, 130);
      s += blob([[-196, 200], [-170, 178], [-120, 186], [-100, 200]]) + blob([[110, 200], [140, 180], [196, 186], [198, 200]]);
      return s;
    }
    if (style === 1) {
      // igloo seen from the side with its tunnel, and a penguin friend
      let s = dome(-30, 150, 240, null);
      s += P('M60 200L60 110Q60 70 110 70L150 70L150 200Z') + curve('M60 150L150 150M100 70L100 110', ctx.thin);
      s += E(150, 135, 30, 65) + E(154, 140, 18, 50);
      s += penguin(-150, 200, 0.85);
      return s;
    }
    if (style === 3) {
      // a child in a warm hooded coat waves hello outside the igloo
      let s = dome(-62, 136, 270, -62) + tunnelFront(-62, 104, 100);
      const cx = 120;
      let k = E(cx - 20, 192, 22, 10) + E(cx + 20, 192, 22, 10) + R(cx - 30, 140, 24, 52, 8) + R(cx + 6, 140, 24, 52, 8);
      k += limb(cx - 34, 62, cx - 58, 122, 14) + C(cx - 60, 128, 15);
      k += limb(cx + 34, 62, cx + 78, 4, 14) + C(cx + 82, -2, 16);
      k += P(`M${cx - 50} 150Q${cx - 56} 62 ${cx - 34} 42L${cx + 34} 42Q${cx + 56} 62 ${cx + 50} 150Z`) + R(cx - 54, 138, 108, 18, 9);
      k += line(cx, 52, cx, 138, ctx.thin) + R(cx + 12, 90, 26, 22, 6, ctx.thin);
      k += C(cx, 2, 54) + leafy(cx, 6, 41, 41, 11, rand) + C(cx, 8, 29);
      k += dotEye(cx - 10, 4, 4.5) + dotEye(cx + 10, 4, 4.5) + smile(cx, 16, 14, 0.5) + cheeks(cx, 14, 18, 4, ctx);
      s += g(k, `translate(${cx} 200) scale(0.8) translate(${-cx} -200)`);
      return s;
    }
    // igloo with a snowman friend and a sled
    let s = dome(-50, 140, 230, -50) + tunnelFront(-50, 110, 100);
    s += C(130, 152, 48) + C(130, 78, 36) + C(130, 22, 26);
    s += R(108, -14, 44, 8, 2) + R(114, -50, 32, 38, 3);
    s += dotEye(121, 16, 4) + dotEye(139, 16, 4) + P('M130 24L156 28L130 32Z') + smile(130, 34, 14, 0.4);
    s += P('M104 48Q130 60 156 48L158 60Q130 72 102 60Z') + P('M144 62L152 92L164 88L154 60Z');
    s += line(96, 78, 66, 56) + line(164, 78, 190, 50);
    s += C(130, 74, 4) + C(130, 92, 4) + C(130, 140, 5) + C(130, 160, 5);
    return s;
  },
};

const treehouse = {
  id: 'treehouse', name: 'Treehouse', styles: 3, scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'garden', 'hills'],
  draw(style, rand, ctx) {
    const crown = (cx, cy, rx, ry) => leafy(cx, cy, rx, ry, Math.round((rx + ry) / 22), rand);
    const trunk = (x, top, w) => P(`M${x - w / 2 - 30} 200Q${x - w / 2} 190 ${x - w / 2} 150L${x - w / 2 + 6} ${top}L${x + w / 2 - 6} ${top}L${x + w / 2} 150Q${x + w / 2} 190 ${x + w / 2 + 30} 200Z`);
    const hut = (cx, by, w, h, ctx) => {
      let s = R(cx - w / 2, by - h, w, h) + poly([[cx - w / 2 - 16, by - h + 8], [cx, by - h - w * 0.5], [cx + w / 2 + 16, by - h + 8]]);
      for (let x = cx - w / 2 + 22; x < cx + w / 2 - 4; x += 22) s += line(x, by - h + 2, x, by, ctx.thin);
      return s;
    };
    if (style === 0) {
      let s = crown(0, -110, 196, 90);
      s += trunk(0, -30, 70);
      s += line(-60, 20, -10, -20) + line(60, 20, 10, -20);
      s += R(-120, -24, 240, 18, 4);
      s += hut(0, -24, 150, 96, ctx) + R(-24, -96, 48, 72, 4) + C(14, -60, 4) + win(-62, -94, 30, 30, ctx) + win(32, -94, 30, 30, ctx);
      s += R(-80, -50, 4, 1, 0) ;
      s += line(-116, -24, -116, -52) + line(116, -24, 116, -52) + line(-116, -46, -60, -46) + line(60, -46, 116, -46);
      // ladder
      s += line(-28, -6, -28, 196) + line(28, -6, 28, 196);
      for (let y = 20; y < 196; y += 34) s += line(-28, y, 28, y);
      return s;
    }
    if (style === 1) {
      // treehouse with a tyre swing
      let s = crown(-50, -120, 150, 76) + crown(110, -120, 90, 60);
      s += trunk(-90, -60, 70) + P('M-60 -40Q40 -50 150 -60L150 -44Q40 -30 -60 -16Z');
      s += line(130, -50, 130, 110, ctx.thin) + line(150, -52, 150, 110, ctx.thin);
      s += E(140, 140, 44, 36) + E(140, 140, 20, 16);
      s += R(-196, -50, 210, 16, 4);
      s += hut(-90, -50, 140, 86, ctx) + arch(-112, -120, 44, 70) + win(-160, -112, 32, 30, ctx);
      s += line(-184, -34, -184, 150, ctx.thin) + line(-156, -34, -156, 150, ctx.thin);
      for (let y = -10; y < 150; y += 28) s += line(-184, y, -156, y);
      return s;
    }
    // treehouse with a slide down to the ground
    let s = crown(-20, -130, 180, 70);
    s += trunk(-40, -40, 76);
    s += R(-150, -44, 240, 18, 4) + line(-140, -26, -90, 20) + line(80, -26, 10, 20);
    s += hut(-50, -44, 140, 84, ctx) + R(-70, -110, 40, 66, 4) + win(-14, -112, 32, 30, ctx) + line(-50, -165, -50, -196) + P('M-50 -196L-20 -188L-50 -180Z');
    s += P('M84 -44L120 -44Q150 -40 160 0L190 180Q192 196 170 196L156 196Q166 160 140 20Q130 -14 84 -18Z');
    s += curve('M98 -32Q132 -26 146 10L176 184', ctx.thin);
    s += line(-108, -26, -108, 196) + line(-142, -26, -142, 196);
    for (let y = 4; y < 196; y += 32) s += line(-142, y, -108, y);
    return s;
  },
};

const windmill = {
  id: 'windmill', name: 'Windmill', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'night'],
  draw(style, rand, ctx) {
    if (style === 0) {
      // classic windmill with four lattice sails and tulips
      let s = shape([[-96, 200], [-62, -50], [62, -50], [96, 200]]);
      s += R(-110, 60, 220, 16, 4) + line(-100, 76, -100, 120, ctx.thin) + line(100, 76, 100, 120, ctx.thin);
      s += arch(-28, 120, 56, 80) + knob(14, 166) + archWin(-18, 0, 36, 46, ctx);
      s += P('M-74 -46Q-70 -120 0 -130Q70 -120 74 -46Z');
      const sail = (a) => {
        let b = R(-4, -176, 8, 160) + R(6, -176, 44, 136);
        for (let y = -40 - 34; y > -176; y -= 34) b += line(6, y, 50, y, ctx.thin);
        b += line(28, -176, 28, -40, ctx.thin);
        return g(b, `translate(0 -64) rotate(${a})`);
      };
      for (const a of [45, 135, 225, 315]) s += sail(a);
      s += C(0, -64, 16);
      s += tulip(-160, 200, 56, ctx) + tulip(-130, 200, 46, ctx) + tulip(140, 200, 50, ctx) + tulip(170, 200, 60, ctx);
      return s;
    }
    if (style === 1) {
      // farm wind pump with a water trough
      let s = '';
      s += line(-80, 200, -16, -60) + line(80, 200, 16, -60) + line(0, 200, 0, -60, ctx.thin);
      for (const [y1, y2] of [[200, 120], [120, 40], [40, -30]]) {
        const hw = (y) => 16 + (64 * (y + 60)) / 260;
        s += line(-hw(y1), y1, hw(y2), y2, ctx.thin) + line(hw(y1), y1, -hw(y2), y2, ctx.thin) + line(-hw(y2), y2, hw(y2), y2);
      }
      s += R(-26, -76, 52, 24, 4) + P('M20 -70L130 -84L150 -120L170 -70L150 -40L130 -60L20 -60Z');
      const cx = -20, cy = -110;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2, b = a + 0.32;
        s += shape([[cx + Math.cos(a) * 30, cy + Math.sin(a) * 30], [cx + Math.cos(a) * 86, cy + Math.sin(a) * 86], [cx + Math.cos(b) * 86, cy + Math.sin(b) * 86], [cx + Math.cos(b) * 30, cy + Math.sin(b) * 30]]);
      }
      s += C(cx, cy, 30) + C(cx, cy, 10);
      s += P('M90 150L196 150L186 200L100 200Z') + curve('M100 164q12 -8 24 0t24 0t24 0t20 0', ctx.thin) + R(70, 120, 10, 34, 2) + line(16, 126, 70, 126);
      return s;
    }
    // modern wind turbines on a grassy hill
    const turbine = (x, hy, L, a0) => {
      let t = shape([[x - 4, hy], [x + 4, hy], [x + 9, 200], [x - 9, 200]]);
      for (let i = 0; i < 3; i++) {
        const a = a0 + i * 120;
        t += g(P(`M-6 0Q-12 ${-L * 0.4} 0 ${-L}Q12 ${-L * 0.3} 7 0Z`), `translate(${x} ${hy}) rotate(${a})`);
      }
      return R(x - 14, hy - 8, 30, 16, 6) + t + C(x, hy, 9);
    };
    let s = turbine(-120, -10, 74, 20) + turbine(130, 20, 66, 70) + turbine(0, -84, 110, 0);
    s += P('M-198 200Q-160 120 -60 140Q40 110 120 150Q170 160 198 140L198 200Z');
    s += tulip(-150, 200, 44, ctx) + tulip(60, 196, 40, ctx);
    return s;
  },
};

export default [
  {
    id: 'space', name: 'Space', order: 32, kind: 'float', icon: 'rocket',
    scenes: ['plain', 'hearts', 'stars', 'space', 'night'],
    pairScenes: ['space', 'night'],
    subjects: [rocket, planet, astronautSub, moon, alien, saucer, satellite],
  },
  {
    id: 'places', name: 'Houses and places', order: 34, kind: 'ground', icon: 'house',
    scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'night'],
    pairScenes: ['meadow', 'hills', 'snow', 'forest', 'water'],
    subjects: [house, castle, school, lighthouse, barn, tent, igloo, treehouse, windmill],
  },
];
