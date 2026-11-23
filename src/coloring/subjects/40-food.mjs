// Fruits and vegetables, and yummy food, for the Yaanstep Sprouts coloring pages (SCRUM-515).
// Every shape is drawn by this code. Each part is drawn once at a fixed size and placed with at(),
// which keeps the line weight even however big or small the part is.
import { C, E, P, R, poly, curve, line, blob, smooth, dotEye, dark, smile, g, star, heart, mirrorX } from '../lib.mjs';

const f = (n) => Math.round(n * 100) / 100;
const rad = (d) => (d * Math.PI) / 180;
let S = 1; // current scale on the page, so thin lines stay thin inside scaled parts
const T = () => `stroke-width="${f(3 / S)}"`;

/** Place a part drawn by fn() at x,y, turned by a degrees and scaled by k, keeping the line weight even. */
function at(x, y, k, fn, a = 0) {
  const old = S;
  S = old * k;
  const inner = fn();
  S = old;
  return `<g transform="translate(${f(x)} ${f(y)})${a ? ` rotate(${f(a)})` : ''}${k !== 1 ? ` scale(${f(k)})` : ''}" stroke-width="${f(6 / (old * k))}">${inner}</g>`;
}
const sub = (id, name, styles, fn, extra = {}) => ({ id, name, styles, ...extra, draw(style, rand, ctx) { S = ctx.s; return fn(style, rand, ctx); } });

// ---------- small shared parts ----------
/** A pointed leaf from x,y, len long, pointing at angle ang (degrees, 0 = right, 90 = down). */
const leaf = (x, y, len, ang, w = 0.42, vein = true) =>
  g(P(`M0 0Q${f(len * 0.45)} ${f(-len * w)} ${f(len)} 0Q${f(len * 0.45)} ${f(len * w)} 0 0Z`) +
    (vein ? curve(`M${f(len * 0.1)} 0Q${f(len * 0.5)} ${f(-len * 0.05)} ${f(len * 0.8)} 0`, T()) : ''), `translate(${f(x)} ${f(y)}) rotate(${f(ang)})`);

/** A friendly face: two dot eyes, a smile and round cheeks. k sizes it (1 = about 90 wide). */
function face(x, y, k = 1, o = {}) {
  let s = dotEye(x - 22 * k, y, 8 * k) + dotEye(x + 22 * k, y, 8 * k);
  if (o.open) s += P(`M${f(x - 13 * k)} ${f(y + 15 * k)}Q${f(x)} ${f(y + 36 * k)} ${f(x + 13 * k)} ${f(y + 15 * k)}Z`);
  else s += smile(x, y + 16 * k, 26 * k, 0.45);
  if (o.cheeks !== false) s += E(x - 43 * k, y + 15 * k, 11 * k, 7 * k, T()) + E(x + 43 * k, y + 15 * k, 11 * k, 7 * k, T());
  return s;
}

/** Cut a straight line through a convex polygon; returns [x1,y1,x2,y2] or null. */
function clipSeg(pts, x0, y0, dx, dy) {
  let lo = -Infinity, hi = Infinity;
  const n = pts.length;
  const cx = pts.reduce((a, p) => a + p[0], 0) / n, cy = pts.reduce((a, p) => a + p[1], 0) / n;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n];
    let nx = -(by - ay), ny = bx - ax;
    if (nx * (cx - ax) + ny * (cy - ay) < 0) { nx = -nx; ny = -ny; }
    const num = nx * (x0 - ax) + ny * (y0 - ay), den = nx * dx + ny * dy;
    if (Math.abs(den) < 1e-9) { if (num < 0) return null; continue; }
    const t = -num / den;
    if (den > 0) lo = Math.max(lo, t); else hi = Math.min(hi, t);
  }
  return lo < hi ? [x0 + dx * lo, y0 + dy * lo, x0 + dx * hi, y0 + dy * hi] : null;
}
/** Parallel thin lines across a convex polygon (waffle cones, pineapple skin). */
function hatch(pts, ang, gap, a = T()) {
  const n = pts.length;
  const cx = pts.reduce((s, p) => s + p[0], 0) / n, cy = pts.reduce((s, p) => s + p[1], 0) / n;
  const d = [Math.cos(rad(ang)), Math.sin(rad(ang))], nr = [-d[1], d[0]];
  const maxR = Math.max(...pts.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
  let s = '';
  for (let k = -Math.floor(maxR / gap) * gap; k < maxR; k += gap) {
    const sg = clipSeg(pts, cx + nr[0] * k, cy + nr[1] * k, d[0], d[1]);
    if (sg && Math.hypot(sg[2] - sg[0], sg[3] - sg[1]) > gap * 0.4) s += line(...sg, a);
  }
  return s;
}
const ellPts = (cx, cy, rx, ry, n = 48) => Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry]);

/** A plate seen a little from above, resting on y = 200. */
const plate = (w = 380) => E(0, 176, w / 2, 24) + E(0, 173, w * 0.34, 12, T());
/** A bowl: back() is the inside rim (drawn first), front() covers the lower part of what is in it. */
const bowlBack = (w, top, ry = 22) => E(0, top, w / 2, ry);
function bowlFront(w, top, ry = 22, o = {}) {
  let s = R(-w * 0.17, 172, w * 0.34, 28, 8);
  s += P(`M${f(-w / 2)} ${top}A${f(w / 2)} ${f(ry)} 0 0 0 ${f(w / 2)} ${top}C${f(w / 2)} ${f(top + (175 - top) * 0.75)} ${f(w * 0.3)} 178 0 178C${f(-w * 0.3)} 178 ${f(-w / 2)} ${f(top + (175 - top) * 0.75)} ${f(-w / 2)} ${top}Z`);
  if (o.band !== false) {
    const y = top + (175 - top) * 0.42;
    let d = `M${f(-w * 0.45)} ${f(y)}`;
    const n = 8;
    for (let i = 0; i < n; i++) d += `q${f(w * 0.9 / n / 2)} ${i % 2 ? 10 : -10} ${f(w * 0.9 / n)} 0`;
    s += curve(d, T());
  }
  return s;
}
/** A woven basket. back() is the handle, front() the basket itself. */
const basketBack = (w, top) => {
  const a = w * 0.42, h = 210;
  return P(`M${f(-a)} ${top}C${f(-a)} ${top - h} ${f(a)} ${top - h} ${f(a)} ${top}L${f(a - 22)} ${top}C${f(a - 22)} ${top - h + 30} ${f(-a + 22)} ${top - h + 30} ${f(-a + 22)} ${top}Z`);
};
function basketFront(w, top) {
  const b = w * 0.38;
  let s = P(`M${f(-w / 2)} ${top}L${f(w / 2)} ${top}Q${f(w * 0.46)} 190 ${f(b)} 200L${f(-b)} 200Q${f(-w * 0.46)} 190 ${f(-w / 2)} ${top}Z`);
  for (let y = top + 34; y < 192; y += 34) {
    const k = (y - top) / (200 - top), hw = w / 2 - (w / 2 - b) * k * k - 6;
    s += curve(`M${f(-hw)} ${f(y)}Q0 ${f(y + 10)} ${f(hw)} ${f(y)}`, T());
  }
  for (let i = -3; i <= 3; i++) {
    const x0 = (i / 3.6) * (w / 2), x1 = (i / 3.6) * b;
    s += line(x0, top + 14, x1, 196, T());
  }
  s += R(-w / 2 - 14, top - 16, w + 28, 34, 17);
  for (let x = -w / 2; x < w / 2; x += 30) s += curve(`M${f(x)} ${top - 12}l14 26`, T());
  return s;
}

// ---------- fruit and vegetable parts (each drawn around 0,0 at about 100 across the middle) ----------
const APPLE = [[0, -0.68], [0.35, -0.92], [0.78, -0.8], [1.0, -0.3], [0.96, 0.3], [0.72, 0.78], [0.32, 0.98], [0, 0.9], [-0.32, 0.98], [-0.72, 0.78], [-0.96, 0.3], [-1.0, -0.3], [-0.78, -0.8], [-0.35, -0.92]];
function apple(o = {}) {
  let s = P('M-6 -60Q-4 -95 10 -115L21 -108Q8 -92 8 -60Z');
  s += blob(APPLE.map(([a, b]) => [a * 100, b * 100]));
  if (o.leaf !== false) s += leaf(8, -92, 58, -28);
  if (o.face) s += face(0, 12, 1.1);
  else s += curve('M-72 -12Q-72 -52 -42 -68', T());
  return s;
}
function appleHalf() {
  let s = P('M-6 -60Q-4 -95 10 -115L21 -108Q8 -92 8 -60Z');
  s += blob(APPLE.map(([a, b]) => [a * 100, b * 100]));
  s += blob(APPLE.map(([a, b]) => [a * 86, b * 84 + 4]), T());
  s += P('M0 -48Q30 -18 24 24Q16 54 0 62Q-16 54 -24 24Q-30 -18 0 -48Z', T());
  s += dark(P('M-10 -2q-8 12 0 22q8 -10 0 -22Z')) + dark(P('M10 -2q-8 12 0 22q8 -10 0 -22Z'));
  s += curve('M0 62L0 84', T()) + leaf(8, -92, 50, -24);
  return s;
}

/** Banana with its stalk end at 0,0 and its tip to the left at (-L, 0); the belly hangs down. */
function banana(L = 300, B = 140, th = 62) {
  let s = P(`M-6 ${f(-th * 0.3)}L32 ${f(-th * 0.4)}Q40 0 32 ${f(th * 0.3)}L-6 ${f(th * 0.3)}Z`) + line(25, -th * 0.36, 25, th * 0.28, T());
  s += P(`M0 ${f(-th / 2)}Q${f(-L / 2)} ${f(B - th)} ${-L} 0Q${f(-L / 2)} ${f(B + th)} 0 ${f(th / 2)}Z`);
  s += curve(`M-14 ${f(th * 0.12)}Q${f(-L / 2)} ${f(B + th * 0.3)} ${f(-L + 34)} 6`, T());
  s += dark(P(`M${-L} 0l16 -7l2 12Z`));
  return s;
}

const STRAW = 'M-95 -45C-100 30 -30 100 0 110C30 100 100 30 95 -45C60 -95 -60 -95 -95 -45Z';
function strawCap() {
  let s = '';
  for (const a of [200, -20, 160, 20, 125, 55]) s += leaf(0, -70, 52, a, 0.38, false);
  return s + P('M-6 -72Q-8 -102 2 -120L13 -113Q4 -100 7 -72Z');
}
function strawberry(o = {}, rand = null) {
  let s = P(STRAW);
  if (o.half) {
    s += P('M-80 -38C-84 24 -26 82 0 92C26 82 84 24 80 -38C50 -72 -50 -72 -80 -38Z', T());
    s += P('M0 -50C26 -40 34 14 0 70C-34 14 -26 -40 0 -50Z', T());
    for (const [x, y] of [[-62, -20], [-56, 18], [-36, 50], [62, -20], [56, 18], [36, 50], [-14, 82], [14, 82]]) s += E(x, y, 4, 6, T());
  } else if (o.seeds !== false) {
    let row = 0;
    for (let y = -36; y < 92; y += 24, row++) {
      const t = (y + 45) / 155, hw = 95 * Math.pow(Math.max(0, 1 - t * t), 0.75) * 0.8;
      for (let x = -hw + ((row % 2) * 16); x <= hw; x += 32) {
        if (o.face && Math.abs(x) < 62 && y > -24 && y < 50) continue;
        s += P(`M${f(x)} ${f(y - 6)}q-5 7 0 13q5 -6 0 -13Z`, T());
      }
    }
  }
  s += strawCap();
  if (o.face) s += face(0, 8, 1.05);
  return s;
}

function orange(o = {}, rand = null) {
  let s = '';
  if (o.leaves !== false) s += leaf(-4, -96, 50, -145) + P('M-6 -96L-4 -114L8 -114L7 -96Z') + leaf(4, -98, 66, -32);
  s += C(0, 0, 100);
  const dots = [[-55, -40], [-30, -65], [40, -55], [62, -10], [55, 45], [-60, 35], [-10, 70], [20, -25]];
  for (const [x, y] of dots) {
    if (o.face && Math.abs(x) < 70 && y > -25 && y < 50) continue;
    s += C(x, y, 3, T());
  }
  if (o.face) s += face(0, 10, 1.2);
  else s += curve('M-74 -20Q-70 -60 -36 -78', T());
  return s;
}
function orangeHalf() {
  let s = C(0, 0, 100) + C(0, 0, 86);
  const n = 10;
  for (let i = 0; i < n; i++) {
    const a0 = rad((i * 360) / n + 3), a1 = rad(((i + 1) * 360) / n - 3), am = (a0 + a1) / 2;
    s += P(`M${f(Math.cos(am) * 14)} ${f(Math.sin(am) * 14)}L${f(Math.cos(a0) * 76)} ${f(Math.sin(a0) * 76)}A76 76 0 0 1 ${f(Math.cos(a1) * 76)} ${f(Math.sin(a1) * 76)}Z`, T());
  }
  return s + C(0, 0, 9, T());
}

const PEAR = [[0, -102], [24, -98], [34, -70], [42, -36], [64, -6], [86, 30], [88, 64], [68, 94], [30, 106], [0, 108], [-30, 106], [-68, 94], [-88, 64], [-86, 30], [-64, -6], [-42, -36], [-34, -70], [-24, -98]];
function pear(o = {}) {
  let s = P('M-6 -96Q-6 -122 6 -140L16 -134Q6 -120 7 -96Z');
  s += blob(PEAR);
  if (!o.half) s += leaf(8, -124, 56, -20);
  if (o.half) {
    s += blob(PEAR.map(([x, y]) => [x * 0.86, y * 0.86 + 6]), T());
    s += P('M0 -10Q34 18 30 52Q22 80 0 84Q-22 80 -30 52Q-34 18 0 -10Z', T()) + curve('M0 -10L0 -86', T());
    s += dark(P('M-11 34q-8 12 0 22q8 -10 0 -22Z')) + dark(P('M11 34q-8 12 0 22q8 -10 0 -22Z'));
    s += leaf(8, -124, 50, -20);
  } else if (o.face) s += face(0, 42, 1.05);
  else s += curve('M-62 30Q-66 0 -46 -18', T());
  return s;
}

/** Carrot: top of the root at 0,0, tip at (0, len); leaves go up. */
function carrot(len = 260, w = 70, o = {}) {
  let s = '';
  if (o.leaves !== false) {
    const L = o.leafLen || 150;
    s += leaf(-8, 0, L * 0.85, -125, 0.24) + leaf(8, 0, L * 0.85, -55, 0.24) + leaf(0, 0, L, -92, 0.22);
  }
  s += P(`M${-w} 4C${-w} ${f(len * 0.35)} ${f(-w * 0.3)} ${f(len * 0.82)} 0 ${len}C${f(w * 0.3)} ${f(len * 0.82)} ${w} ${f(len * 0.35)} ${w} 4Q0 ${f(-w * 0.32)} ${-w} 4Z`);
  for (let i = 0; i < 6; i++) {
    const y = len * (0.14 + i * 0.13), t = y / len, hw = w * (1 - Math.pow(t, 1.5)) * 0.98;
    if (o.face && y > len * 0.12 && y < len * 0.5) continue;
    const sd = i % 2 ? 1 : -1;
    s += curve(`M${f(sd * hw)} ${f(y)}Q${f(sd * hw * 0.65)} ${f(y + 6)} ${f(sd * hw * 0.35)} ${f(y + 1)}`, T());
  }
  if (o.face) s += face(0, len * 0.27, w / 72);
  return s;
}

/** Corn cob from 0,0 (top) to (0,len). */
function cob(len = 300, w = 82, o = {}) {
  const hw = (y) => { const t = y / len; return w * Math.sqrt(Math.max(0, 1 - ((t - 0.55) / 0.55) ** 2)); };
  const side = [];
  for (let i = 0; i <= 16; i++) side.push([hw((i / 16) * len), (i / 16) * len]);
  const pts = [...side.slice(1, 16), ...side.slice(1, 16).reverse().map(([x, y]) => [-x, y]), [0, 0]];
  let s = '';
  if (o.husk) s += P(`M10 ${len + 8}C${f(w * 1.9)} ${f(len * 0.8)} ${f(w * 1.7)} ${f(len * 0.25)} ${f(w * 1.05)} ${f(len * 0.06)}C${f(w * 1.05)} ${f(len * 0.4)} ${f(w * 0.6)} ${f(len * 0.75)} -10 ${len}Z`);
  s += blob(pts);
  const rows = Math.round(len / 25), rh = (len * 0.92) / rows;
  for (let i = 0; i < rows; i++) {
    const y = len * 0.04 + (i + 0.5) * rh, half = hw(y) * 0.92;
    if (half < 16) continue;
    const cols = Math.max(2, Math.min(5, Math.round((2 * half) / 32)));
    const cw = (2 * half) / cols;
    for (let j = 0; j < cols; j++) {
      const x = -half + j * cw;
      if (o.face && Math.hypot((x + cw / 2) / 62, (y - len * 0.52) / 46) < 1) continue;
      s += R(x + 2, y - rh / 2 + 2, cw - 4, rh - 4, Math.min(8, rh / 3), T());
    }
  }
  if (o.face) s += face(0, len * 0.5, 1.05);
  if (o.husk) {
    s += P(`M-14 ${len + 10}C${f(-w * 1.9)} ${f(len * 0.85)} ${f(-w * 1.75)} ${f(len * 0.42)} ${f(-w * 1.15)} ${f(len * 0.22)}C${f(-w * 1.1)} ${f(len * 0.5)} ${f(-w * 0.6)} ${f(len * 0.8)} 18 ${len - 6}Z`);
    s += P(`M14 ${len + 10}C${f(w * 1.9)} ${f(len * 0.88)} ${f(w * 1.75)} ${f(len * 0.55)} ${f(w * 1.2)} ${f(len * 0.4)}C${f(w * 1.05)} ${f(len * 0.62)} ${f(w * 0.6)} ${f(len * 0.85)} -18 ${len - 4}Z`);
    s += curve(`M${f(-w * 0.9)} ${f(len * 0.86)}Q${f(-w * 1.3)} ${f(len * 0.6)} ${f(-w * 1.12)} ${f(len * 0.32)}M${f(w * 0.9)} ${f(len * 0.9)}Q${f(w * 1.3)} ${f(len * 0.7)} ${f(w * 1.2)} ${f(len * 0.5)}`, T());
    s += R(-16, len + 2, 32, 32, 8);
  }
  return s;
}

/** Broccoli head: a scalloped cloud. */
function scallop(cx, cy, rx, ry, n, a = '') {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2, x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (i === 0) { d += `M${f(x)} ${f(y)}`; continue; }
    const tm = t - Math.PI / n;
    d += `Q${f(cx + Math.cos(tm) * rx * 1.22)} ${f(cy + Math.sin(tm) * ry * 1.22)} ${f(x)} ${f(y)}`;
  }
  return P(d + 'Z', a);
}
const bump3 = (x, y, r) => curve(`M${f(x - 1.5 * r)} ${f(y + r * 0.3)}q${f(r * 0.5)} ${f(-r)} ${f(r)} 0q${f(r * 0.5)} ${f(-r)} ${f(r)} 0q${f(r * 0.5)} ${f(-r)} ${f(r)} 0`, T());
function broccoli(o = {}) {
  // a thick short stalk that branches into a dome of bumpy florets (so it never reads as a tree)
  let s = P('M-60 200Q-46 140 -42 104Q-84 76 -118 44L-86 26Q-54 58 -22 72L-22 30L22 30L22 72Q54 58 86 26L118 44Q84 76 42 104Q46 140 60 200Z');
  s += curve('M-18 194Q-14 150 -16 112M18 194Q14 150 16 112', T());
  const fl = [[-112, -66, 58], [0, -118, 66], [112, -66, 58], [-62, -56, 60], [62, -56, 60], [-136, 4, 50], [136, 4, 50], [-70, 18, 54], [70, 18, 54], [0, -14, 66]];
  for (const [x, y, r] of fl) {
    s += scallop(x, y, r, r * 0.92, 9);
    if (o.face && x === 0 && y === -14) continue;
    s += bump3(x - r * 0.1, y - r * 0.15, r * 0.2);
  }
  if (o.face) s += face(0, -18, 0.95);
  return s;
}
const TOMATO = () => {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const t = (i / 28) * Math.PI * 2, k = 1;
    let x = Math.cos(t) * 106 * k, y = Math.sin(t) * 94 * k;
    const dt = Math.atan2(Math.sin(t + Math.PI / 2), Math.cos(t + Math.PI / 2));
    y += 12 * Math.exp(-((dt / 0.35) ** 2));
    pts.push([x, y]);
  }
  return pts;
};
function tomato(o = {}) {
  let s = blob(TOMATO());
  const sep = [];
  for (let i = 0; i < 12; i++) {
    const t = rad(-90 + i * 30), r = i % 2 ? 12 : 50;
    sep.push([Math.cos(t) * r, -78 + Math.sin(t) * r * 0.45]);
  }
  s += P(`M${sep.map((p) => p.map(f).join(' ')).join('L')}Z`);
  s += P('M-6 -80Q-7 -100 2 -112L13 -106Q5 -96 7 -80Z');
  if (o.face) s += face(0, 10, 1.25);
  else s += curve('M-80 -10Q-78 -46 -48 -60', T());
  return s;
}
function tomatoSlice() {
  let s = C(0, 0, 100) + C(0, 0, 88, T());
  for (let i = 0; i < 4; i++) {
    const a = rad(45 + i * 90);
    const pts = [[0.24, 0], [0.5, -0.36], [0.78, -0.2], [0.8, 0.2], [0.5, 0.36]].map(([r, w]) => {
      const rr = r * 100, ww = w * 100;
      return [Math.cos(a) * rr - Math.sin(a) * ww, Math.sin(a) * rr + Math.cos(a) * ww];
    });
    s += blob(pts);
    for (const [r, w] of [[0.46, -0.08], [0.6, 0.12], [0.64, -0.18]]) {
      s += E(Math.cos(a) * r * 100 - Math.sin(a) * w * 100, Math.sin(a) * r * 100 + Math.cos(a) * w * 100, 7, 5, `${T()} transform="rotate(${f(45 + i * 90)} ${f(Math.cos(a) * r * 100 - Math.sin(a) * w * 100)} ${f(Math.sin(a) * r * 100 + Math.cos(a) * w * 100)})"`);
    }
  }
  return s + C(0, 0, 14, T());
}

/** A watermelon wedge, tip up at (0,-100), rind along the bottom. */
function wedge(o = {}) {
  let s = P('M0 -100L-100 50Q0 100 100 50Z') + P('M0 -100L-90 35Q0 75 90 35Z') + curve('M-95 42Q0 88 95 42', T());
  const seeds = o.face ? [[0, -62], [-48, -2], [48, -2], [-62, 28], [62, 28], [0, 46]] : [[0, -58], [-22, -22], [22, -22], [-46, 10], [0, 8], [46, 10], [-24, 38], [24, 38]];
  for (const [x, y] of seeds) s += dark(P(`M${x} ${y - 7}q-6 9 0 14q6 -5 0 -14Z`));
  if (o.face) s += face(0, 0, 0.62, { cheeks: true });
  return s;
}
/** Wavy stripe bands on a melon, between meridians k1 and k2 (-1..1). */
function melonBands(cx, cy, rx, ry, vertical = false) {
  let s = '';
  for (const [k1, k2] of [[-0.8, -0.58], [-0.32, -0.1], [0.14, 0.36], [0.6, 0.82]]) {
    const a = [], b = [];
    for (let i = 0; i <= 14; i++) {
      const u = -0.93 + (i / 14) * 1.86, sq = Math.sqrt(1 - u * u), wig = 6 * Math.sin(i * 1.7) * sq;
      if (!vertical) { a.push([cx + u * rx, cy + k1 * ry * sq + wig]); b.push([cx + u * rx, cy + k2 * ry * sq + wig]); }
      else { a.push([cx + k1 * rx * sq + wig, cy + u * ry]); b.push([cx + k2 * rx * sq + wig, cy + u * ry]); }
    }
    s += blob([...a, ...b.reverse()], T());
  }
  return s;
}

/** Pineapple body around 0,0 (rx 100, ry 115) with a crown of spiky leaves. */
function pineapple(o = {}) {
  let s = '';
  const L = o.crown || 1;
  for (const [a, len, x] of [[-148, 80, -12], [-32, 80, 12], [-122, 104, -8], [-58, 104, 8], [-104, 120, -4], [-76, 120, 4], [-90, 132, 0]]) s += leaf(x, -100, len * L, a, 0.2, false);
  s += E(0, 0, 100, 115);
  if (o.face) {
    for (const [x, y] of [[-50, -75], [0, -88], [50, -75], [-78, -30], [78, -30], [-82, 22], [82, 22], [-60, 70], [0, 92], [60, 70], [-26, 70], [28, 72]])
      s += curve(`M${x - 9} ${y - 5}L${x} ${y + 4}L${x + 9} ${y - 5}`, T());
    s += face(0, 0, 1.15);
  } else {
    const el = ellPts(0, 0, 97, 112);
    s += hatch(el, 52, 40) + hatch(el, 128, 40);
  }
  return s;
}
function pineRing() {
  let s = C(0, 0, 100) + C(0, 0, 84) + C(0, 0, 22);
  for (let i = 0; i < 14; i++) {
    const a = rad(i * (360 / 14));
    s += line(Math.cos(a) * 30, Math.sin(a) * 30, Math.cos(a) * 74, Math.sin(a) * 74, T());
  }
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30 + 15);
    s += curve(`M${f(Math.cos(a) * 92 - 5)} ${f(Math.sin(a) * 92)}l5 -5l5 5`, T());
  }
  return s;
}

const grape = (x, y, r) => C(x, y, r) + curve(`M${f(x - r * 0.55)} ${f(y - r * 0.1)}Q${f(x - r * 0.5)} ${f(y - r * 0.5)} ${f(x - r * 0.12)} ${f(y - r * 0.6)}`, T());
function bunch(r = 36, rows = [5, 4, 4, 3, 2, 1], top = 0, skip = () => false) {
  let s = '';
  rows.forEach((n, j) => {
    const y = top + j * r * 1.5;
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * r * 1.8 + (j % 2 ? 4 : -4);
      if (!skip(x, y)) s += grape(x, y, r);
    }
  });
  return s;
}
/** A grape leaf with its stalk at 0,0, pointing up. */
function grapeLeaf(r = 70) {
  const pts = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * Math.PI * 2, rr = r * (0.8 + 0.2 * Math.cos(5 * t));
    pts.push([Math.sin(t) * rr, -r - Math.cos(t) * rr]);
  }
  let s = blob(pts);
  for (const a of [0, 72, -72, 144, -144]) s += line(0, -r * 0.2, Math.sin(rad(a)) * r * 0.75, -r - Math.cos(rad(a)) * r * 0.75, T());
  return s;
}
const tendril = (x, y, k = 1) => curve(`M${x} ${y}q${-20 * k} ${-6 * k} ${-26 * k} ${-24 * k}q${-4 * k} ${-16 * k} ${10 * k} ${-16 * k}q${10 * k} ${4 * k} ${2 * k} ${12 * k}`, T());

// fruit salad pieces
const bananaSlice = (x, y, r) => C(x, y, r) + C(x, y, r * 0.72, T()) + dark(C(x, y - r * 0.2, r * 0.07)) + dark(C(x - r * 0.18, y + r * 0.12, r * 0.07)) + dark(C(x + r * 0.18, y + r * 0.12, r * 0.07));
function kiwiSlice(x, y, r) {
  let s = C(x, y, r) + C(x, y, r * 0.84, T()) + E(x, y, r * 0.28, r * 0.2, T());
  for (let i = 0; i < 10; i++) {
    const a = rad(i * 36);
    s += dark(E(x + Math.cos(a) * r * 0.46, y + Math.sin(a) * r * 0.46, r * 0.06, r * 0.1, `transform="rotate(${f(i * 36 + 90)} ${f(x + Math.cos(a) * r * 0.46)} ${f(y + Math.sin(a) * r * 0.46)})"`));
  }
  return s;
}
const orangeWedge = (x, y, r, a = 0) => g(P(`M${-r} 0A${r} ${r} 0 0 0 ${r} 0Z`) + P(`M${f(-r * 0.82)} 0A${f(r * 0.82)} ${f(r * 0.82)} 0 0 0 ${f(r * 0.82)} 0Z`, T()) +
  line(0, 0, 0, r * 0.82, T()) + line(0, 0, -r * 0.58, r * 0.58, T()) + line(0, 0, r * 0.58, r * 0.58, T()), `translate(${f(x)} ${f(y)}) rotate(${f(a)})`);
const blueberry = (x, y, r) => C(x, y, r) + curve(`M${f(x - r * 0.3)} ${f(y - r * 0.4)}l${f(r * 0.3)} ${f(r * 0.25)}l${f(r * 0.3)} ${f(-r * 0.25)}`, T());

// ---------- category 1: fruits and vegetables ----------
const appleS = sub('apple', 'Apple', 4, (st) => {
  if (st === 0) return at(0, 24, 1.8, () => apple());
  if (st === 1) return at(0, 37, 1.66, () => apple({ face: true }));
  if (st === 2) return at(-92, 102, 1.0, () => apple(), -10) + at(58, 58, 1.45, appleHalf);
  return basketBack(340, 50) + at(-92, -2, 0.7, () => apple(), -16) + at(94, -4, 0.7, () => apple(), 14) + at(2, -44, 0.76, () => apple()) +
    at(-48, 32, 0.7, () => apple({ leaf: false }), -6) + at(56, 34, 0.7, () => apple({ leaf: false }), 8) + basketFront(340, 50);
});

const bananaS = sub('banana', 'Banana', 3, (st) => {
  if (st === 0) return at(176, -6, 1.0, () => banana(370, 175, 78), -22);
  if (st === 1) {
    let s = '';
    for (const a of [44, 23, 2]) s += at(118, 98, 1, () => banana(300, 130, 60), a);
    return s + P('M100 86L128 8Q134 -6 150 -2L140 104Z') + E(139, 3, 12, 7, 'transform="rotate(16 139 3)"');
  }
  let s = P('M-52 0L-52 -125Q-52 -192 0 -192Q52 -192 52 -125L52 0Z') + curve('M-20 -150Q-28 -120 -24 -90', T());
  const flap = 'M-60 -28Q-118 -18 -126 116Q-104 98 -92 76Q-80 34 -60 26Z';
  s += P(flap) + mirrorX(P(flap));
  s += R(-16, 158, 32, 42, 8);
  s += P('M-68 -22L-45 -42L-22 -18L0 -42L22 -18L45 -42L68 -22Q74 110 18 166L-18 166Q-74 110 -68 -22Z');
  s += face(0, 56, 1.15);
  return s;
}, { scale: 1 });

const strawberryS = sub('strawberry', 'Strawberry', 4, (st, rand) => {
  if (st === 0) return at(0, 7, 1.75, () => strawberry({}, rand));
  if (st === 1) return at(0, 13, 1.7, () => strawberry({ face: true }, rand));
  if (st === 2) return at(-106, 96, 0.95, () => strawberry({}, rand), -12) + at(64, 52, 1.34, () => strawberry({ half: true }));
  let s = bowlBack(380, 70);
  for (const [x, y, a, k] of [[-118, 28, -50, 0.55], [118, 28, 50, 0.55], [-58, -4, -18, 0.6], [58, -8, 16, 0.6], [0, -36, 0, 0.62], [-4, 44, 4, 0.58]]) s += at(x, y, k, () => strawberry({}, rand), a);
  return s + bowlFront(380, 70);
});

const watermelonS = sub('watermelon', 'Watermelon', 4, (st) => {
  if (st === 0) {
    let s = E(36, 86, 160, 112) + melonBands(36, 86, 160, 112) + curve('M196 82q14 -4 14 -18q0 -12 -12 -10', T());
    return s + at(-110, 132, 0.92, () => wedge(), -14);
  }
  if (st === 1) return at(0, 54, 1.94, () => wedge({ face: true }));
  if (st === 2) {
    let s = P('M-190 14A190 186 0 0 0 190 14Z');
    for (const [k1, k2] of [[-0.86, -0.66], [-0.4, -0.18], [0.12, 0.34], [0.6, 0.8]]) {
      const a = [], b = [];
      for (let i = 0; i <= 10; i++) {
        const ph = (i / 10) * Math.PI / 2 * 0.96, c = Math.cos(ph), wig = 6 * Math.sin(i * 1.9) * c;
        a.push([k1 * 190 * c + wig, 14 + 186 * Math.sin(ph)]);
        b.push([k2 * 190 * c + wig, 14 + 186 * Math.sin(ph)]);
      }
      s += P(`M${f(k1 * 190)} 14${smoothTail(a)}L${f(b[b.length - 1][0])} ${f(b[b.length - 1][1])}${smoothTail([...b].reverse())}Z`, T());
    }
    s += E(0, 14, 190, 64) + E(0, 16, 174, 54, T()) + E(0, 18, 160, 46);
    for (const [x, y] of [[-110, 8], [-60, -6], [0, -12], [60, -6], [110, 8], [-80, 34], [-26, 26], [30, 30], [86, 36], [0, 52]]) s += dark(E(x, y, 4, 7));
    s += R(30, -150, 22, 150, 11, 'transform="rotate(20 41 0)"') + E(40, -6, 30, 14, 'transform="rotate(20 40 -6)"');
    return s;
  }
  return plate(400) + at(-102, 100, 0.96, () => wedge(), -22) + at(102, 100, 0.96, () => wedge(), 22) + at(0, 92, 1.06, () => wedge());
});
/** Continue a path smoothly through pts (the first point is where the pen already is). */
function smoothTail(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const pineappleS = sub('pineapple', 'Pineapple', 4, (st) => {
  if (st === 0) return at(0, 68, 1.15, () => pineapple());
  if (st === 1) return at(0, 72, 1.12, () => pineapple({ face: true, crown: 0.9 }));
  if (st === 2) return at(-82, 98, 0.8, () => pineapple(), -6) + at(118, 124, 0.76, pineRing) + at(56, 112, 0.88, pineRing);
  let s = '';
  for (const [a, len] of [[-150, 170], [-30, 170], [-128, 200], [-52, 200]]) s += leaf(0, 196, len, a, 0.13, false);
  s += R(-14, 20, 28, 170, 6) + at(0, -10, 0.74, () => pineapple());
  for (const [a, len] of [[-170, 190], [-10, 190], [-150, 130], [-30, 130], [-110, 110], [-70, 110]]) s += leaf(0, 198, len, a, 0.14, false);
  return s;
});

const grapesS = sub('grapes', 'Grapes', 4, (st) => {
  const stem = (y) => P(`M-6 ${y + 12}Q-10 ${y - 20} 8 ${y - 52}L18 ${y - 46}Q4 ${y - 20} 7 ${y + 12}Z`);
  if (st === 0) return stem(-136) + at(18, -168, 0.95, () => grapeLeaf(70), 62) + tendril(-6, -150, 1.3) + bunch(36, [5, 4, 4, 3, 2, 1], -116);
  if (st === 1) {
    let s = stem(-120) + at(16, -150, 0.85, () => grapeLeaf(70), 58) + tendril(-6, -136, 1.2);
    s += bunch(36, [5, 4, 4, 3, 2, 1], -100, (x, y) => Math.hypot(x, y - 6) < 60);
    return s + C(0, 6, 72) + face(0, 4, 1.15) + curve('M-50 -16Q-48 -44 -22 -54', T());
  }
  if (st === 2) {
    let s = bowlBack(320, 84);
    s += at(-50, -40, 0.66, () => stem(-116) + at(18, -150, 0.95, () => grapeLeaf(70), 62) + bunch(36, [5, 4, 4, 3, 2, 1], -100), -14);
    s += bowlFront(320, 84);
    s += at(120, 30, 0.56, () => stem(-116) + bunch(36, [4, 4, 3, 3, 2, 1], -100), -38);
    return s + grape(-150, 182, 20) + grape(-116, 188, 20);
  }
  let s = R(-176, -150, 26, 350, 6) + R(150, -150, 26, 350, 6);
  s += smooth([[-200, -150], [-120, -170], [-40, -150], [40, -168], [120, -150], [200, -165]]);
  for (const [x, a, k] of [[-150, -30, 0.7], [-80, 30, 0.6], [20, -20, 0.62], [110, 35, 0.66], [175, -40, 0.6]]) s += at(x, -152, k, () => grapeLeaf(70), a);
  s += R(-200, -170, 400, 26, 8);
  s += at(-62, -40, 0.62, () => stem(-116) + bunch(36, [5, 4, 4, 3, 2, 1], -100)) + at(72, -30, 0.58, () => stem(-116) + bunch(36, [4, 4, 3, 3, 2, 1], -100));
  s += tendril(-10, -140, 1) + tendril(160, -140, 0.9);
  return s;
});

const orangeS = sub('orange', 'Orange', 4, (st, rand) => {
  if (st === 0) return at(0, 30, 1.7, () => orange({}, rand));
  if (st === 1) return at(-96, 100, 1.0, () => orange({}, rand), -8) + at(70, 70, 1.3, orangeHalf);
  if (st === 2) return at(0, 36, 1.64, () => orange({ face: true }, rand));
  let s = bowlBack(380, 76) + at(0, -36, 0.64, () => orange({}, rand), 6) + at(-104, 14, 0.6, () => orange({ leaves: false }, rand)) + at(104, 14, 0.6, () => orange({ leaves: false }, rand));
  s += at(0, 48, 0.56, orangeHalf);
  return s + bowlFront(380, 76);
});

const pearS = sub('pear', 'Pear', 4, (st) => {
  if (st === 0) return at(0, 26, 1.62, () => pear());
  if (st === 1) return at(0, 30, 1.58, () => pear({ face: true }));
  if (st === 2) return at(-100, 98, 0.95, () => pear(), -8) + at(64, 54, 1.35, () => pear({ half: true }));
  let s = R(-170, 30, 340, 26, 4);
  s += at(-100, 8, 0.78, () => pear(), -12) + at(104, 10, 0.78, () => pear(), 12) + at(2, -8, 0.82, () => pear());
  s += R(-184, 56, 368, 144, 6) + line(-184, 104, 184, 104, T()) + line(-184, 152, 184, 152, T());
  s += R(-184, 56, 30, 144, 4) + R(154, 56, 30, 144, 4);
  s += E(0, 104, 36, 13);
  return s;
});

const carrotS = sub('carrot', 'Carrot', 4, (st) => {
  if (st === 0) return at(0, -54, 0.97, () => carrot(262, 80, { leafLen: 150 }), 0);
  if (st === 1) {
    let s = '';
    for (const [x, a] of [[-120, -6], [0, 0], [118, 6]]) s += at(x, 74, 0.9, () => carrot(110, 66, { leafLen: 200 }), a);
    s += P('M-200 200L-200 156Q-186 104 -110 100Q-60 90 0 98Q60 90 110 100Q186 104 200 156L200 200Z');
    for (const [x, y] of [[-150, 150], [-60, 170], [40, 146], [140, 168], [-110, 186], [90, 188]]) s += E(x, y, 12, 7, T());
    return s + at(-110, 156, 0.62, () => carrot(220, 60, { leafLen: 110 }), -76);
  }
  if (st === 2) return at(0, -64, 1.0, () => carrot(262, 92, { face: true, leafLen: 140 }));
  let s = '';
  for (const [a, len] of [[20, 230], [-20, 230], [0, 214]]) s += at(0, -16, 1, () => carrot(len, 58, { leafLen: 160, leaves: a === 0 }), a);
  s += leaf(-10, -20, 120, -140, 0.24) + leaf(10, -20, 120, -40, 0.24);
  s += P('M0 4Q-60 -40 -70 4Q-60 40 0 4Z') + P('M0 4Q60 -40 70 4Q60 40 0 4Z') + P('M-6 8L-36 56L-20 60L0 14Z') + P('M6 8L36 56L20 60L0 14Z') + C(0, 4, 13);
  return s;
}, { flip: true });

const cornS = sub('corn', 'Corn', 4, (st) => {
  if (st === 0) return at(0, -192, 1.18, () => cob(300, 82, { husk: true }));
  if (st === 1) return at(0, -196, 1.2, () => cob(300, 90, { husk: true, face: true }));
  if (st === 2) {
    let s = P('M-16 200L-10 -150Q0 -178 10 -150L16 200Z');
    for (const y of [130, 50, -30, -110]) s += line(-12, y, 12, y, T());
    const blade = (y, dir, len, up) => P(`M0 ${y}Q${dir * len * 0.5} ${y - up - 40} ${dir * len} ${y - up + 30}Q${dir * len * 0.5} ${y - up - 4} 0 ${y + 22}Z`) + curve(`M${dir * 10} ${y + 8}Q${dir * len * 0.5} ${y - up - 20} ${dir * len * 0.92} ${y - up + 24}`, T());
    s += blade(140, -1, 190, 40) + blade(70, 1, 190, 60) + blade(-20, -1, 170, 50) + blade(-100, 1, 150, 40);
    s += at(10, -60, 0.5, () => cob(300, 82, { husk: true }), 24);
    for (const a of [-30, -12, 6, 22]) s += curve(`M0 -150q${a * 0.6} -20 ${a} -46`, T());
    s += curve('M-38 -78q-18 -20 -10 -46M-46 -70q-30 -10 -34 -36', T());
    return s;
  }
  return plate(400) + at(-180, 104, 1.0, () => cob(300, 84, { husk: true }), -90);
});

const broccoliS = sub('broccoli', 'Broccoli', 4, (st) => {
  if (st === 0) return broccoli();
  if (st === 1) return at(0, 10, 0.95, () => broccoli({ face: true }));
  if (st === 2) {
    const big = (a, len) => leaf(0, 196, len, a, 0.32);
    let s = big(-124, 230) + big(-56, 230) + big(-150, 190) + big(-30, 190);
    s += at(0, 40, 0.62, () => broccoli());
    s += big(-172, 170) + big(-8, 170);
    return s;
  }
  let s = plate(400);
  s += at(-90, 64, 0.46, () => broccoli(), -10) + at(80, 56, 0.5, () => broccoli(), 12) + at(-6, 84, 0.44, () => broccoli(), 2);
  for (const [x, y] of [[-150, 158], [-100, 168], [110, 160], [156, 168], [40, 172], [-40, 176]]) s += E(x, y, 24, 12) + E(x, y, 12, 6, T());
  return s;
});

const tomatoS = sub('tomato', 'Tomato', 4, (st) => {
  if (st === 0) return at(0, 32, 1.82, () => tomato());
  if (st === 1) return at(-92, 106, 1.0, () => tomato(), -6) + at(76, 74, 1.24, tomatoSlice);
  if (st === 2) {
    let s = R(-7, -196, 14, 300, 5);
    s += curve('M0 96C-24 40 22 -10 -2 -70C-14 -110 8 -140 0 -176');
    s += curve('M-8 40Q-60 30 -96 -6M6 -20Q60 -30 104 -70M-4 -100Q-50 -110 -86 -136M4 -150Q40 -168 70 -180');
    for (const [x, y, a] of [[-40, 30, 160], [-70, 14, 220], [40, -26, -10], [76, -48, -50], [-40, -106, 200], [-68, -124, 160], [40, -158, -30], [24, 60, 10], [-26, -40, 190]]) s += leaf(x, y, 58, a, 0.42);
    s += curve('M-96 -6L-98 20M104 -70L104 -42M-86 -136L-86 -110', '');
    s += at(-98, 64, 0.46, () => tomato()) + at(104, 6, 0.46, () => tomato()) + at(-86, -66, 0.4, () => tomato());
    s += star(56, -116, 18, 8, 5) + C(56, -116, 6, T()) + star(40, 52, 16, 7, 5) + C(40, 52, 5, T());
    s += R(-112, 92, 224, 34, 10) + P('M-96 126L96 126L78 200L-78 200Z');
    return s;
  }
  return at(0, 40, 1.74, () => tomato({ face: true }));
});

// ---------- category 2: yummy food ----------
function pizzaTop(missing = null) {
  // whole pizza seen from the front and a little above, on a round board
  const cx = 0, cy = 70, rx = 178, ry = 92;
  let s = P('M-198 82A198 104 0 0 0 198 82L198 96A198 104 0 0 1 -198 96Z') + E(0, 82, 198, 104);
  const pt = (a, k = 1) => [cx + Math.cos(rad(a)) * rx * k, cy + Math.sin(rad(a)) * ry * k];
  const wedgeP = (k, a1, a2, a = '') => {
    const p1 = pt(a1, k), p2 = pt(a2, k);
    return P(`M${cx} ${cy}L${f(p2[0])} ${f(p2[1])}A${f(rx * k)} ${f(ry * k)} 0 1 1 ${f(p1[0])} ${f(p1[1])}Z`, a);
  };
  if (missing) s += wedgeP(1, missing[0], missing[1]) + wedgeP(0.84, missing[0], missing[1]);
  else s += E(cx, cy, rx, ry) + E(cx, cy, rx * 0.84, ry * 0.84);
  const cuts = missing ? [missing[0], missing[1], missing[1] + 60, missing[1] + 120, missing[1] + 180, missing[1] + 240] : [0, 60, 120, 180, 240, 300];
  for (const a of cuts) { const p = pt(a, 0.84); s += line(cx, cy, p[0], p[1], T()); }
  for (let i = 0; i < 6; i++) {
    const a = (missing ? missing[1] : 0) + 30 + i * 60;
    if (missing && i === 5) continue;
    const p = pt(a, 0.52), q = pt(a + 14, 0.78);
    s += E(p[0], p[1], 24, 15) + C(p[0] - 6, p[1] - 3, 3, T()) + C(p[0] + 7, p[1] + 3, 3, T());
    s += E(q[0], q[1], 11, 8) + E(q[0], q[1], 4, 3, T());
  }
  return s;
}
function pizzaSlice(withFace) {
  let s = P('M-168 -118L0 196L168 -118Q0 -156 -168 -118Z');
  s += P('M-182 -122Q-190 -150 -168 -162Q0 -200 168 -162Q190 -150 182 -122Q0 -162 -182 -122Z');
  for (const [x, y, r] of [[-82, -74, 26], [86, -72, 26], [0, 96, 22]]) s += C(x, y, r) + C(x - 7, y - 5, 4, T()) + C(x + 8, y + 6, 4, T());
  s += leaf(-30, -100, 34, -20, 0.42) + leaf(36, 46, 30, 200, 0.42);
  if (withFace) s += face(0, 8, 1.2);
  return s;
}

/** Shared point tools: a smooth closed outline as many points, cut by a straight line, drawn as a path. */
function splinePts(pts, per = 10) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  return out;
}
function clipHalf(pts, nx, ny, c) {
  const out = [], inside = (p) => nx * p[0] + ny * p[1] <= c;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    if (inside(a)) out.push(a);
    if (inside(a) !== inside(b)) {
      const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c, t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}
const polyPath = (pts, a = '', dx = 0, dy = 0) => P('M' + pts.map((p) => `${f(p[0] + dx)} ${f(p[1] + dy)}`).join('L') + 'Z', a);

function pizzaRound() {
  const r = 186, cy = 6, a1 = 20, a2 = 65, dx = 26, dy = 22;
  const pt = (a, k) => [Math.cos(rad(a)) * r * k, cy + Math.sin(rad(a)) * r * k];
  const pac = (k, from, to, big, ox = 0, oy = 0) => {
    const p = pt(from, k), q = pt(to, k);
    return P(`M${ox} ${cy + oy}L${f(p[0] + ox)} ${f(p[1] + oy)}A${f(r * k)} ${f(r * k)} 0 ${big} 1 ${f(q[0] + ox)} ${f(q[1] + oy)}Z`);
  };
  let s = pac(1, a2, a1 + 360, 1) + pac(0.84, a2, a1 + 360, 1);
  const top = (ox, oy, angs) => {
    let t = '';
    for (const a of angs) {
      const p = pt(a, 0.52), q = pt(a + 12, 0.76);
      t += C(p[0] + ox, p[1] + oy, 28) + C(p[0] + ox - 8, p[1] + oy - 6, 4, T()) + C(p[0] + ox + 9, p[1] + oy + 6, 4, T());
      t += C(q[0] + ox, q[1] + oy, 11) + C(q[0] + ox, q[1] + oy, 4, T());
    }
    return t;
  };
  for (const a of [65, 110, 155, 200, 245, 290, 335]) { const p = pt(a, 0.84); s += line(0, cy, p[0], p[1], T()); }
  s += top(0, 0, [80, 125, 170, 215, 260, 305, 350]);
  s += leaf(-16, cy - 20, 34, -40, 0.42) + leaf(10, cy + 4, 30, 150, 0.42);
  s += curve(`M${f(pt(40, 0.3)[0])} ${f(pt(40, 0.3)[1])}q20 -2 ${dx + 6} ${dy + 10}M${f(pt(50, 0.5)[0] - 10)} ${f(pt(50, 0.5)[1] + 8)}q14 4 ${dx} ${dy + 4}`, T());
  s += pac(1, a1, a2, 0, dx, dy) + pac(0.84, a1, a2, 0, dx, dy) + top(dx, dy, [36]);
  return s;
}
const pizzaS = sub('pizza', 'Pizza', 3, (st) => {
  if (st === 0) return pizzaTop() + curve('M-60 -60q-16 -20 0 -40t0 -40M0 -66q-16 -20 0 -40t0 -40M60 -60q-16 -20 0 -40t0 -40', T());
  if (st === 1) return pizzaSlice(true);
  return pizzaRound();
});

function cupcake(o = {}) {
  let s = P('M-124 40L124 40L94 200L-94 200Z');
  for (let i = 1; i < 8; i++) {
    const xt = -124 + i * 31, xb = -94 + i * 23.5;
    if (o.face && i > 1 && i < 7) continue;
    s += line(xt, 46, xb, 194, T());
  }
  if (o.face) s += face(0, 116, 1.1);
  const tier = (y, hw, h) => P(`M${-hw} ${y}Q${-hw - 22} ${y - h * 0.5} ${-hw + 18} ${y - h}L${hw - 18} ${y - h}Q${hw + 22} ${y - h * 0.5} ${hw} ${y}Q0 ${y + 22} ${-hw} ${y}Z`);
  if (o.dome) {
    let d = 'M-140 50Q-150 -66 0 -72Q150 -66 140 50';
    const drips = [[110, 82], [70, 52], [30, 94], [-10, 54], [-52, 88], [-96, 56], [-140, 50]];
    let px = 140;
    for (const [x, y] of drips) { d += `Q${f((px + x) / 2)} ${y > 70 ? y + 20 : y + 8} ${x} ${y > 70 ? 54 : y}`; px = x; }
    s += P(d + 'Z');
    for (const [x, y, a] of [[-90, -10, 30], [-40, -40, -20], [20, -20, 50], [80, -30, -40], [-70, 20, -60], [50, 20, 10], [110, 10, 70], [-10, 10, 80]]) s += R(x - 10, y - 4, 20, 8, 4, `${T()} transform="rotate(${a} ${x} ${y})"`);
    s += R(-14, -170, 28, 104, 6) + curve('M-14 -150L14 -164M-14 -120L14 -134M-14 -90L14 -104', T()) + line(0, -170, 0, -182, T());
    s += P('M0 -230Q-24 -200 -14 -188Q0 -176 14 -188Q24 -200 0 -230Z');
    return s;
  }
  s += tier(60, 140, 72) + tier(2, 108, 62) + tier(-50, 74, 54);
  s += P('M-40 -96Q-14 -150 18 -164Q12 -126 40 -96Z');
  if (o.cherry !== false) s += curve('M14 -170Q18 -200 40 -212') + C(8, -160, 26) + curve('M-4 -168Q-2 -176 6 -178', T());
  return s;
}
const cupcakeS = sub('cupcake', 'Cupcake', 4, (st) => {
  if (st === 0) return cupcake();
  if (st === 1) return at(0, 26, 0.88, () => cupcake({ dome: true }));
  if (st === 2) return cupcake({ face: true });
  let s = R(-8, -60, 16, 160, 4) + E(0, -60, 90, 14);
  s += at(0, -60 - 200 * 0.34, 0.34, () => cupcake());
  s += E(0, 100, 196, 22) + P('M-24 120L-34 178L34 178L24 120Z') + E(0, 186, 84, 14);
  s += at(-104, 100 - 200 * 0.4, 0.4, () => cupcake()) + at(104, 100 - 200 * 0.4, 0.4, () => cupcake());
  return s;
}, { scale: 0.96 });

function scoop(cx, cy, r, drips = [2, 5]) {
  let d = `M${f(cx - r)} ${f(cy + r * 0.2)}A${r} ${r} 0 1 1 ${f(cx + r)} ${f(cy + r * 0.2)}`;
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const x = cx + r - (2 * r * i) / n, mx = cx + r - (2 * r * (i - 0.5)) / n;
    d += `Q${f(mx)} ${f(cy + r * (drips.includes(i) ? 0.95 : 0.5))} ${f(x)} ${f(cy + r * 0.2)}`;
  }
  return P(d + 'Z');
}
function cone(top, w, tip) {
  const pts = [[-w, top], [w, top], [0, tip]];
  return P(`M${-w} ${top}L${w} ${top}L6 ${tip - 6}Q0 ${tip + 2} -6 ${tip - 6}Z`) + hatch(pts, 62, 30) + hatch(pts, 118, 30) + R(-w - 10, top - 8, 2 * w + 20, 30, 14);
}
const sprinkles = (list) => list.map(([x, y, a]) => R(x - 9, y - 3.5, 18, 7, 3.5, `${T()} transform="rotate(${a} ${x} ${y})"`)).join('');
const iceS = sub('ice-cream', 'Ice cream', 4, (st) => {
  if (st === 0) return cone(40, 86, 200) + scoop(0, 2, 92, [2, 5]) + scoop(0, -90, 76, [3]) + curve('M8 -178Q12 -204 30 -210') + C(4, -170, 22);
  if (st === 1) {
    let s = E(0, 186, 88, 14) + R(-14, 116, 28, 72, 6) + E(0, 40, 140, 20);
    s += R(60, -140, 34, 120, 10, 'transform="rotate(18 77 -80)"') + curve('M62 -128L92 -118M60 -100L90 -90M58 -72L88 -62', 'transform="rotate(18 77 -80)" ' + T());
    s += scoop(-64, 14, 64, [3]) + scoop(64, 14, 64, [4]) + scoop(0, -50, 66, [2, 5]);
    s += curve('M6 -104Q10 -130 30 -138') + C(2, -100, 20);
    s += P('M-140 40Q-130 128 0 128Q130 128 140 40Q0 70 -140 40Z') + curve('M-100 66Q-96 100 -60 112', T());
    return s;
  }
  if (st === 2) {
    let s = cone(62, 92, 200) + scoop(0, 22, 128, [2, 4]);
    s += sprinkles([[-80, -52, 30], [-30, -84, -20], [40, -80, 60], [86, -44, -30], [-100, 0, 80], [100, 4, 20], [-4, -56, 90]]);
    return s + face(0, -14, 1.4);
  }
  let s = R(-17, 80, 34, 120, 16);
  s += P('M-94 110L-94 -110Q-94 -196 0 -196Q94 -196 94 -110L94 110Q94 122 82 122L-82 122Q-94 122 -94 110Z');
  s += P('M-94 -40L-94 -110Q-94 -196 0 -196Q94 -196 94 -110L94 -40Q80 -50 70 -40Q66 0 52 0Q40 0 40 -40Q20 -54 0 -40Q-10 -20 -22 -20Q-34 -20 -36 -42Q-60 -56 -76 -40Q-86 -32 -94 -40Z');
  s += sprinkles([[-50, -130, 30], [10, -160, -30], [52, -110, 70], [-20, -90, 10], [60, -160, 10], [-60, -80, -60]]);
  s += curve('M-60 10L-60 80M60 10L60 80', T());
  return s;
}, { flip: true });

function donut(o = {}, rand = null) {
  let s = C(0, 0, 100);
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    let r = 84 + 5 * Math.sin(t * 9);
    if (Math.sin(t) > 0.3 && i % 5 === 0) r = 94;
    pts.push([Math.cos(t) * r, Math.sin(t) * r]);
  }
  s += blob(pts) + C(0, 0, 36) + C(0, 0, 28);
  const sp = [];
  for (let i = 0; i < 16; i++) {
    const t = rad(i * 22.5 + (i % 2) * 8), r = i % 2 ? 66 : 52;
    const x = Math.cos(t) * r, y = Math.sin(t) * r;
    if (o.face && y > 20) continue;
    sp.push([x, y, (i * 47) % 180]);
  }
  s += sprinkles(sp);
  if (o.face) s += face(0, 56, 0.72);
  return s;
}
function lyingDonut() {
  let s = E(0, 0, 150, 76);
  const pts = [];
  for (let i = 0; i < 36; i++) {
    const t = (i / 36) * Math.PI * 2;
    let ry = 60 + (Math.sin(t) > 0.2 && i % 4 === 1 ? 14 : 3 * Math.sin(t * 8));
    pts.push([Math.cos(t) * 140, -8 + Math.sin(t) * ry]);
  }
  s += blob(pts) + E(0, -12, 42, 17) + curve('M-38 -8Q0 8 38 -8', T());
  s += sprinkles([[-90, -20, 20], [-60, -48, -30], [60, -46, 40], [96, -16, -20], [-40, 22, 80], [44, 24, 10], [0, -54, 90]]);
  return s;
}
const donutS = sub('donut', 'Donut', 3, (st, rand) => {
  if (st === 0) return at(0, 6, 1.94, () => donut({}, rand));
  if (st === 1) return plate(400) + at(0, 112, 1, lyingDonut, 2) + at(-6, 46, 0.96, lyingDonut, -3) + at(6, -20, 0.92, lyingDonut, 2);
  return at(0, 6, 1.94, () => donut({ face: true }, rand));
});

function sandwichStack(o = {}) {
  let s = '';
  if (o.pick) s += R(-5, -110, 10, 140, 4);
  s += R(-172, 148, 344, 50, 22);
  let d = 'M-182 128L182 128';
  for (let x = 182; x > -182; x -= 36.4) d += `Q${f(x - 18)} ${f(176)} ${f(x - 36.4)} 136`;
  s += P(d + 'Z');
  s += R(-166, 104, 110, 30, 14) + R(-56, 104, 112, 30, 14) + R(56, 104, 110, 30, 14);
  s += P('M-180 84L180 84L184 106L162 106L198 136L148 106L-148 106L-198 136L-162 106L-184 106Z');
  let h = 'M-176 62';
  for (let x = -176; x < 176; x += 44) h += `Q${f(x + 22)} 52 ${f(x + 44)} 62`;
  s += P(h + 'L176 90Q0 98 -176 90Z');
  s += P(`M-174 64L-174 ${o.face ? -40 : 0}Q-174 ${o.face ? -62 : -26} -150 ${o.face ? -66 : -30}L150 ${o.face ? -66 : -30}Q174 ${o.face ? -62 : -26} 174 ${o.face ? -40 : 0}L174 64Z`);
  if (o.face) s += face(0, 0, 1.2);
  else s += curve('M-150 -10L150 -10', T());
  if (o.pick) s += R(-5, -110, 10, 90, 4) + E(0, -110, 26, 22) + C(0, -110, 8, T());
  return s;
}
/** A triangle sandwich: the bread on top and the cut side in front showing the layers. Bottom at y = 170. */
function triSandwich(o = {}) {
  let s = '';
  // cut side, bottom layer first
  s += R(-176, 136, 352, 36, 14);
  let d = 'M-190 112';
  for (let x = -190; x < 190; x += 38) d += `Q${x + 19} 150 ${x + 38} 112`;
  s += P(d + 'L190 100L-190 100Z');
  s += R(-170, 92, 112, 26, 12) + R(-56, 92, 112, 26, 12) + R(58, 92, 112, 26, 12);
  s += P('M-178 76L178 76L184 96L170 96L178 118L148 96L-148 96L-178 118L-170 96L-184 96Z');
  s += R(-176, 40, 352, 40, 14);
  // the bread slice on top
  s += P('M-176 52Q-186 40 -178 28L-14 -150Q0 -164 14 -150L178 28Q186 40 176 52Q0 64 -176 52Z');
  s += P('M-138 34L-6 -112Q0 -118 6 -112L138 34Q0 44 -138 34Z', T());
  if (o.face) s += face(0, -10, 1.15);
  return s;
}
const sandwichS = sub('sandwich', 'Sandwich', 3, (st) => {
  if (st === 0) return sandwichStack({ pick: true });
  if (st === 1) return plate(400) + at(70, 4, 0.66, triSandwich, 6) + at(-46, 52, 0.72, triSandwich, -4);
  return at(0, 26, 1.02, () => triSandwich({ face: true }));
});

function stack(n, rx, ry, h, bottomTop, o = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const y = bottomTop - i * h, x = (i % 2 ? 4 : -4), w = rx + (i % 3) * 4;
    s += P(`M${f(x - w)} ${f(y)}A${f(w)} ${ry} 0 0 0 ${f(x + w)} ${f(y)}L${f(x + w)} ${f(y + h)}A${f(w)} ${ry} 0 0 1 ${f(x - w)} ${f(y + h)}Z`);
    if (o.lines) s += curve(`M${f(x - w + 10)} ${f(y + h * 0.5 + ry * 0.5)}Q${f(x)} ${f(y + h * 0.5 + ry * 1.3)} ${f(x + w - 10)} ${f(y + h * 0.5 + ry * 0.5)}`, T());
  }
  const yt = bottomTop - (n - 1) * h, xt = ((n - 1) % 2 ? 4 : -4);
  s += E(xt, yt, rx + ((n - 1) % 3) * 4, ry);
  return [s, xt, yt];
}
function syrup(x, y, rx, ry, drips) {
  let d = `M${f(x - rx * 0.8)} ${f(y)}Q${f(x - rx * 0.8)} ${f(y - ry * 0.7)} ${f(x)} ${f(y - ry * 0.7)}Q${f(x + rx * 0.8)} ${f(y - ry * 0.7)} ${f(x + rx * 0.84)} ${f(y + ry * 0.2)}`;
  for (const [dx, len] of drips) d += `L${f(x + dx + 12)} ${f(y + ry * 0.6)}L${f(x + dx + 12)} ${f(y + ry * 0.6 + len)}Q${f(x + dx)} ${f(y + ry * 0.6 + len + 16)} ${f(x + dx - 12)} ${f(y + ry * 0.6 + len)}L${f(x + dx - 12)} ${f(y + ry * 0.7)}`;
  return P(d + `Q${f(x - rx * 0.6)} ${f(y + ry * 0.8)} ${f(x - rx * 0.8)} ${f(y)}Z`);
}
const butter = (x, y) => P(`M${x - 34} ${y - 10}L${x + 10} ${y - 24}L${x + 40} ${y - 12}L${x - 4} ${y + 2}Z`) + P(`M${x - 34} ${y - 10}L${x - 4} ${y + 2}L${x - 4} ${y + 22}L${x - 34} ${y + 10}Z`) + P(`M${x - 4} ${y + 2}L${x + 40} ${y - 12}L${x + 40} ${y + 8}L${x - 4} ${y + 22}Z`);
const pancakesS = sub('pancakes', 'Pancakes', 3, (st) => {
  if (st === 0) {
    let s = plate(400);
    const [st6, x, y] = stack(6, 150, 42, 30, 96);
    s += st6 + syrup(x, y, 150, 42, [[100, 60], [-60, 90], [20, 40]]) + butter(x, y - 14);
    for (const [bx, by] of [[-150, 172], [-118, 182], [150, 170], [124, 184], [168, 186]]) s += blueberry(bx, by, 15);
    return s;
  }
  if (st === 1) {
    let s = plate(400);
    const [st3, x, y] = stack(3, 160, 46, 56, 70);
    s += st3 + syrup(x, y, 160, 46, [[110, 40], [-90, 60]]) + butter(x, y - 14);
    return s + face(0, 70 + 46 + 4 - 56, 1.0);
  }
  let s = R(-200, 110, 150, 30, 15, 'transform="rotate(-14 -50 125)"');
  s += P('M-90 120L-70 186Q40 206 150 186L170 120Z') + E(40, 120, 130, 30) + E(40, 124, 112, 22, T());
  s += g(P('M-110 0A110 34 0 0 0 110 0L110 18A110 34 0 0 1 -110 18Z') + E(0, 0, 110, 34) + curve('M-60 -6Q0 14 60 -6', T()), 'translate(40 -110) rotate(-16)');
  s += curve('M-110 -40q-20 30 -10 60M-140 -60q-24 40 -10 80M180 -150q20 30 10 60M206 -120q16 26 6 50', T());
  s += star(-60, -170, 14, 6) + star(150, -30, 12, 5);
  return s;
});

function noodleBowl(o = {}) {
  let s = E(0, 10, 190, 46);
  s += curve('M-150 10q20 -16 40 0t40 0t40 0t40 0t40 0t40 0t40 0', T()) + curve('M-130 30q20 -14 40 0t40 0t40 0t40 0t40 0t40 0', T()) + curve('M-160 -6q20 -14 40 0t40 0t40 0t40 0t40 0', T());
  if (o.egg) s += E(-90, 2, 40, 22) + E(-90, 0, 18, 11);
  if (o.veg) for (const [x, y] of [[100, 4], [130, 22], [70, 26]]) s += E(x, y, 16, 9) + E(x, y, 8, 4, T());
  if (o.onion) for (const [x, y] of [[-30, 26], [10, 32], [-10, 14], [40, 14]]) s += E(x, y, 8, 5, T());
  return s;
}
const noodleFront = (withFace) => {
  let s = R(-70, 160, 140, 40, 10);
  s += P('M-190 10A190 46 0 0 0 190 10C190 110 120 168 0 168C-120 168 -190 110 -190 10Z');
  if (withFace) s += face(0, 92, 1.3);
  else s += curve('M-170 80q20 -14 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0', T());
  return s;
};
const steam = (x) => curve(`M${x} -60q-18 -24 0 -48t0 -48`, T());
const noodlesS = sub('noodles', 'Noodles in a bowl', 3, (st) => {
  if (st === 0) {
    let s = noodleBowl({ egg: true, onion: true });
    s += curve('M-14 -78C-30 -40 -4 -10 -20 20M0 -80C-10 -40 16 -10 4 24M14 -82C8 -40 32 -10 24 22M-26 -76C-46 -40 -20 -10 -40 16');
    s += R(-16, -98, 240, 14, 7, 'transform="rotate(-34 -16 -91)"') + R(-36, -86, 240, 14, 7, 'transform="rotate(-26 -36 -79)"');
    s += noodleFront(false) + steam(-140) + steam(-104);
    return s;
  }
  if (st === 1) return noodleBowl({ egg: true, veg: true, onion: true }) + noodleFront(true) + steam(-40) + steam(0) + steam(40);
  // seen from above: a round bowl full of noodles and toppings, chopsticks resting on top
  let s = R(-60, 168, 120, 32, 10) + C(0, 0, 192) + C(0, 0, 164);
  for (let y = -140; y <= 140; y += 24) {
    const hw = Math.sqrt(160 * 160 - y * y) - 10, n = Math.max(2, Math.round((2 * hw) / 34)), st2 = (2 * hw) / n;
    let d = `M${f(-hw)} ${y}`;
    for (let i = 0; i < n; i++) d += `q${f(st2 / 2)} ${i % 2 ? 12 : -12} ${f(st2)} 0`;
    s += curve(d, T());
  }
  s += E(-62, -54, 46, 38) + C(-60, -50, 20) + E(56, 52, 46, 38, 'transform="rotate(30 56 52)"') + C(58, 54, 20);
  s += leaf(-120, 70, 80, -20, 0.45) + leaf(-110, 84, 72, 30, 0.45);
  for (const [x, y] of [[80, -60], [112, -20], [40, -96]]) s += C(x, y, 20) + C(x, y, 9, T());
  for (const [x, y] of [[-10, 10], [10, 100], [-30, 120], [120, 60], [-140, -10]]) s += C(x, y, 9) + C(x, y, 4, T());
  s += R(-200, -150, 400, 16, 8, 'transform="rotate(-14 0 -142)"') + R(-200, -122, 400, 16, 8, 'transform="rotate(-10 0 -114)"');
  return s;
}, { scenes: ['plain', 'hearts', 'stars', 'table', 'room', 'party'] });

function fruitPile(rand) {
  let s = '';
  s += grape(-120, -20, 24) + grape(-96, -40, 24) + grape(-80, -14, 24);
  s += at(70, -60, 0.42, () => strawberry({ half: true }), 18);
  s += kiwiSlice(-30, -60, 38) + orangeWedge(110, 0, 50, -170);
  s += bananaSlice(0, -10, 34) + bananaSlice(-70, 10, 30);
  s += at(-10, -100, 0.36, () => strawberry({}), -10) + blueberry(40, 6, 16) + blueberry(70, 18, 16) + blueberry(-130, 22, 16);
  s += kiwiSlice(130, -50, 30) + bananaSlice(40, -36, 28);
  s += leaf(-14, -132, 34, -60, 0.42) + leaf(-14, -132, 30, -130, 0.42);
  return s;
}
const fruitSaladS = sub('fruit-salad', 'Fruit salad bowl', 3, (st, rand) => {
  if (st === 0) {
    let s = bowlBack(390, 40) + fruitPile(rand);
    s += R(110, -170, 18, 160, 9, 'transform="rotate(24 119 -20)"');
    return s + bowlFront(390, 40);
  }
  if (st === 1) return at(0, 26, 0.88, () => bowlBack(390, 40) + fruitPile(rand) + bowlFront(390, 40, 22, { band: false }) + face(0, 104, 1.25));
  let s = R(-60, 170, 120, 30, 10) + P('M-196 -20A196 100 0 0 0 196 -20C190 90 120 176 0 176C-120 176 -190 90 -196 -20Z') + E(0, -20, 196, 100) + E(0, -20, 178, 86, T());
  s += kiwiSlice(-100, -50, 36) + kiwiSlice(80, 20, 32) + orangeWedge(30, -70, 44, 20) + bananaSlice(-30, -4, 30) + bananaSlice(110, -46, 28) + bananaSlice(-110, 20, 26);
  s += at(-20, -76, 0.38, () => strawberry({ half: true }), -30) + at(140, -10, 0.32, () => strawberry({ half: true }), 40);
  for (const [x, y] of [[-150, -20], [20, 30], [-60, 40], [60, -30], [-40, -40]]) s += blueberry(x, y, 15);
  s += grape(-140, -60, 20) + grape(150, -60, 18);
  return s;
});

export default [
  {
    id: 'fruit', name: 'Fruits and vegetables', order: 40,
    scenes: ['plain', 'hearts', 'stars', 'table', 'garden', 'meadow', 'room'],
    pairScenes: ['table', 'garden'],
    icon: 'apple', kind: 'ground',
    subjects: [appleS, bananaS, strawberryS, watermelonS, pineappleS, grapesS, orangeS, pearS, carrotS, cornS, broccoliS, tomatoS],
  },
  {
    id: 'treats', name: 'Yummy food', order: 41,
    scenes: ['plain', 'hearts', 'stars', 'table', 'party', 'room', 'meadow'],
    pairScenes: ['table', 'party'],
    icon: 'cupcake', kind: 'ground',
    subjects: [pizzaS, cupcakeS, iceS, donutS, sandwichS, pancakesS, noodlesS, fruitSaladS],
  },
];
