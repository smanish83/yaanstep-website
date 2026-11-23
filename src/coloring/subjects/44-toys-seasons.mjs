// Toys and play (order 44) and Seasons and holidays (order 46) for the Yaanstep Sprouts coloring pages.
// Every shape is drawn by this code.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring, cloud, sun, littleFlower, mirrorX, rot, r1 } from '../lib.mjs';

// ---------- small helpers (local to this file) ----------
/** A path designed at unit scale, placed at x,y and scaled by s. Absolute M L C Q S T Z commands only (numbers come in x,y pairs). */
function sp(d, x = 0, y = 0, s = 1, a = '') {
  let i = 0;
  return P(d.replace(/-?\d*\.?\d+/g, (m) => String(r1((i++ % 2 === 0 ? x : y) + parseFloat(m) * s))), a);
}
function spc(d, x = 0, y = 0, s = 1, a = '') {
  let i = 0;
  return curve(d.replace(/-?\d*\.?\d+/g, (m) => String(r1((i++ % 2 === 0 ? x : y) + parseFloat(m) * s))), a);
}
const pol = (cx, cy, r, deg) => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
const pt = (p) => `${r1(p[0])} ${r1(p[1])}`;

/** A ribbon bow centred at x,y; s = 1 is about 150 wide. */
function bow(x, y, s = 1, tails = true) {
  let o = '';
  if (tails) o += sp('M-6 4L-46 62L-28 56L-22 76L8 8Z', x, y, s) + sp('M6 4L46 62L28 56L22 76L-8 8Z', x, y, s);
  o += sp('M0 0C-24 -46 -78 -50 -76 -12C-74 20 -30 18 0 0Z', x, y, s) + sp('M0 0C24 -46 78 -50 76 -12C74 20 30 18 0 0Z', x, y, s);
  return o + E(x, y, 16 * s, 14 * s);
}
/** A candle flame: a teardrop with an inner flame. */
function flame(x, y, h, inner = true) {
  const w = h * 0.36;
  let o = P(`M${r1(x)} ${r1(y)}C${r1(x - w * 1.3)} ${r1(y - h * 0.15)} ${r1(x - w * 0.6)} ${r1(y - h * 0.65)} ${r1(x + w * 0.1)} ${r1(y - h)}C${r1(x + w * 0.3)} ${r1(y - h * 0.6)} ${r1(x + w * 1.3)} ${r1(y - h * 0.25)} ${r1(x)} ${r1(y)}Z`);
  if (inner) { const k = 0.5; o += P(`M${r1(x)} ${r1(y - h * 0.08)}C${r1(x - w * 1.3 * k)} ${r1(y - h * 0.2)} ${r1(x - w * 0.5 * k)} ${r1(y - h * 0.5)} ${r1(x + w * 0.05)} ${r1(y - h * 0.62)}C${r1(x + w * 0.25 * k)} ${r1(y - h * 0.45)} ${r1(x + w * 1.2 * k)} ${r1(y - h * 0.25)} ${r1(x)} ${r1(y - h * 0.08)}Z`); }
  return o;
}
/** Wheel with hub and spokes. */
function wheel(x, y, r, ctx, spokes = 6) {
  let o = C(x, y, r) + C(x, y, r * 0.72, ctx.thin);
  for (let i = 0; i < spokes; i++) { const a = pol(x, y, r * 0.24, (i * 360) / spokes), b = pol(x, y, r * 0.72, (i * 360) / spokes); o += line(a[0], a[1], b[0], b[1], ctx.thin); }
  return o + C(x, y, r * 0.24);
}
/** A simple shape for decorating faces of blocks and eggs. */
function icon(type, x, y, s) {
  if (type === 'star') return star(x, y, s, s * 0.45);
  if (type === 'heart') return heart(x, y + s * 0.1, s * 1.9);
  if (type === 'circle') return C(x, y, s * 0.8);
  if (type === 'tri') return poly([[x, y - s * 0.85], [x + s * 0.9, y + s * 0.65], [x - s * 0.9, y + s * 0.65]]);
  if (type === 'moon') return P(`M${r1(x + s * 0.2)} ${r1(y - s * 0.9)}A${r1(s * 0.9)} ${r1(s * 0.9)} 0 1 0 ${r1(x + s * 0.2)} ${r1(y + s * 0.9)}A${r1(s * 0.65)} ${r1(s * 0.65)} 0 1 1 ${r1(x + s * 0.2)} ${r1(y - s * 0.9)}Z`);
  if (type === 'flower') { let o = ''; for (let i = 0; i < 5; i++) { const p = pol(x, y, s * 0.5, i * 72 - 90); o += C(p[0], p[1], s * 0.4); } return o + C(x, y, s * 0.32); }
  return R(x - s * 0.7, y - s * 0.7, s * 1.4, s * 1.4, s * 0.15);
}
/** Little motion lines, for things that move. */
const swish = (x, y, ctx, n = 3, len = 40, gap = 22, dir = 1) => {
  let o = '';
  for (let i = 0; i < n; i++) o += curve(`M${r1(x)} ${r1(y + i * gap)}q${r1(dir * len * 0.5)} ${-6} ${r1(dir * len)} 0`, ctx.thin);
  return o;
};

// ======================================================================
// TOYS
// ======================================================================

function teddyHead(cx, cy, r, ctx, big = false) {
  let o = C(cx - 0.78 * r, cy - 0.7 * r, 0.38 * r) + C(cx + 0.78 * r, cy - 0.7 * r, 0.38 * r);
  o += C(cx - 0.78 * r, cy - 0.7 * r, 0.2 * r, ctx.thin) + C(cx + 0.78 * r, cy - 0.7 * r, 0.2 * r, ctx.thin);
  o += C(cx, cy, r) + E(cx, cy + 0.36 * r, 0.44 * r, 0.33 * r);
  o += dark(E(cx, cy + 0.2 * r, 0.16 * r, 0.11 * r));
  o += curve(`M${r1(cx)} ${r1(cy + 0.29 * r)}L${r1(cx)} ${r1(cy + 0.42 * r)}M${r1(cx - 0.2 * r)} ${r1(cy + 0.44 * r)}Q${r1(cx - 0.1 * r)} ${r1(cy + 0.55 * r)} ${r1(cx)} ${r1(cy + 0.42 * r)}Q${r1(cx + 0.1 * r)} ${r1(cy + 0.55 * r)} ${r1(cx + 0.2 * r)} ${r1(cy + 0.44 * r)}`, big ? '' : ctx.thin);
  if (big) o += eye(cx - 0.37 * r, cy - 0.12 * r, 0.13 * r, [0, 0.2]) + eye(cx + 0.37 * r, cy - 0.12 * r, 0.13 * r, [0, 0.2]);
  else o += dotEye(cx - 0.37 * r, cy - 0.12 * r, 0.1 * r) + dotEye(cx + 0.37 * r, cy - 0.12 * r, 0.1 * r);
  o += C(cx - 0.66 * r, cy + 0.28 * r, 0.12 * r, ctx.thin) + C(cx + 0.66 * r, cy + 0.28 * r, 0.12 * r, ctx.thin);
  return o;
}
const bowTie = (x, y, s) => poly([[x, y], [x - 50 * s, y - 24 * s], [x - 50 * s, y + 24 * s]]) + poly([[x, y], [x + 50 * s, y - 24 * s], [x + 50 * s, y + 24 * s]]) + C(x, y, 13 * s);

const teddy = {
  id: 'teddy-bear', name: 'Teddy bear', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // sitting teddy with a bow tie
      let o = g(E(0, 0, 36, 66), 'translate(-108 62) rotate(28)') + g(E(0, 0, 36, 66), 'translate(108 62) rotate(-28)');
      o += E(0, 75, 112, 118) + E(0, 95, 62, 70, T);
      o += curve('M0 30L0 160', 'stroke-dasharray="6 10" ' + T);
      for (const sx of [-1, 1]) o += E(sx * 92, 158, 58, 42) + E(sx * 92, 162, 30, 24, T);
      o += teddyHead(0, -88, 96, ctx);
      o += bowTie(0, 10, 1);
      return o;
    }
    if (style === 1) {
      // standing teddy waving and holding a heart
      let o = R(-78, 95, 62, 105, 30) + R(16, 95, 62, 105, 30);
      o += E(-47, 180, 22, 13, T) + E(47, 180, 22, 13, T);
      o += g(E(0, 0, 30, 62), 'translate(-118 -42) rotate(-42)');
      o += E(0, 50, 96, 104) + E(0, 62, 54, 60, T);
      o += teddyHead(0, -105, 86, ctx);
      o += g(E(0, 0, 30, 58), 'translate(98 62) rotate(-30)');
      o += heart(70, 92, 88);
      o += curve('M-185 -125q12 -20 30 -22M-192 -92q16 -12 34 -6', T);
      return o;
    }
    // big friendly face close up with a patch and a bow tie
    let o = teddyHead(0, 0, 160, ctx, true);
    const px = rand.chance(0.5) ? -1 : 1;
    o += g(R(-22, -22, 44, 44, 6, T) + curve('M-14 -14L14 14M14 -14L-14 14', ctx.hair), `translate(${px * 70} -95) rotate(${px * 12})`);
    o += bowTie(0, 172, 0.95);
    return o;
  },
};

// ---------- ball ----------
const ball = {
  id: 'ball', name: 'Ball', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin, Rr = 168, cx = 0, cy = 200 - Rr;
    if (style === 0) {
      // beach ball: wedges swirl out from a small cap
      const Pp = [cx - 0.22 * Rr, cy - 0.32 * Rr];
      const st = rand.range(-10, 10);
      const rim = (i) => pol(cx, cy, Rr, st + i * 60);
      const ctl = (q) => { const mx = (Pp[0] + q[0]) / 2, my = (Pp[1] + q[1]) / 2, dx = q[0] - Pp[0], dy = q[1] - Pp[1]; return [mx - dy * 0.18, my + dx * 0.18]; };
      let o = C(cx, cy, Rr);
      for (let i = 0; i < 6; i++) {
        const a = rim(i), b = rim(i + 1);
        o += P(`M${pt(Pp)}Q${pt(ctl(a))} ${pt(a)}A${Rr} ${Rr} 0 0 1 ${pt(b)}Q${pt(ctl(b))} ${pt(Pp)}Z`);
      }
      o += C(Pp[0], Pp[1], 0.17 * Rr);
      o += curve(`M${r1(cx + 0.45 * Rr)} ${r1(cy - 0.62 * Rr)}Q${r1(cx + 0.68 * Rr)} ${r1(cy - 0.45 * Rr)} ${r1(cx + 0.74 * Rr)} ${r1(cy - 0.2 * Rr)}`, T);
      return o;
    }
    if (style === 1) {
      // football (soccer ball)
      let o = C(cx, cy, Rr);
      const tw = rand.range(-8, 8);
      const cen = [];
      for (let k = 0; k < 5; k++) cen.push(pol(cx, cy, 0.34 * Rr, -90 + tw + k * 72));
      for (let k = 0; k < 5; k++) {
        const th = -90 + tw + k * 72;
        const rA = pol(cx, cy, Rr, th - 25), sA = pol(cx, cy, 0.8 * Rr, th - 19), tip = pol(cx, cy, 0.62 * Rr, th), sB = pol(cx, cy, 0.8 * Rr, th + 19), rB = pol(cx, cy, Rr, th + 25);
        o += P(`M${pt(rA)}L${pt(sA)}L${pt(tip)}L${pt(sB)}L${pt(rB)}A${Rr} ${Rr} 0 0 0 ${pt(rA)}Z`);
        o += line(cen[k][0], cen[k][1], tip[0], tip[1]);
        const X = pol(cx, cy, 0.88 * Rr, th + 36), nA = pol(cx, cy, 0.8 * Rr, th + 72 - 19), rim = pol(cx, cy, Rr, th + 36);
        o += curve(`M${pt(sB)}L${pt(X)}L${pt(nA)}M${pt(X)}L${pt(rim)}`);
      }
      o += poly(cen);
      return o;
    }
    // basketball
    let o = C(cx, cy, Rr);
    o += curve(`M${cx} ${cy - Rr}Q${cx + 22} ${cy} ${cx} ${cy + Rr}`);
    o += curve(`M${cx - Rr} ${cy}Q${cx} ${cy + 22} ${cx + Rr} ${cy}`);
    o += curve(`M${r1(cx - 0.62 * Rr)} ${r1(cy - 0.78 * Rr)}Q${r1(cx - 0.18 * Rr)} ${cy} ${r1(cx - 0.62 * Rr)} ${r1(cy + 0.78 * Rr)}`);
    o += curve(`M${r1(cx + 0.62 * Rr)} ${r1(cy - 0.78 * Rr)}Q${r1(cx + 0.18 * Rr)} ${cy} ${r1(cx + 0.62 * Rr)} ${r1(cy + 0.78 * Rr)}`);
    o += curve(`M${r1(cx - 0.5 * Rr)} ${r1(cy - 0.62 * Rr)}Q${r1(cx - 0.6 * Rr)} ${r1(cy - 0.4 * Rr)} ${r1(cx - 0.72 * Rr)} ${r1(cy - 0.3 * Rr)}`, T);
    return o;
  },
};

// ---------- kite ----------
function kiteTail(pts, ctx, bows) {
  let o = smooth(pts);
  for (const i of bows) {
    const [x, y] = pts[i];
    o += poly([[x, y], [x - 30, y - 17], [x - 30, y + 17]]) + poly([[x, y], [x + 30, y - 17], [x + 30, y + 17]]) + C(x, y, 9);
  }
  return o;
}
const kite = {
  id: 'kite', name: 'Kite', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'sky', 'meadow', 'hills'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // diamond kite with a bow tail
      let o = smooth([[10, 20], [-60, 110], [-150, 160], [-205, 205]], T);
      o += kiteTail([[23, 108], [0, 138], [28, 165], [0, 190], [30, 205]], ctx, [1, 3]);
      const top = [0, -190], rt = [125, -50], bot = [0, 110], lt = [-125, -50], mid = [0, -50];
      let k = poly([top, mid, lt]) + poly([top, rt, mid]) + poly([mid, rt, bot]) + poly([lt, mid, bot]);
      k += heart(0, -45, 60);
      o += g(k, 'rotate(-12 0 0)');
      return o;
    }
    if (style === 1) {
      // delta kite with fan stripes and a bow tail
      let o = smooth([[0, -20], [-70, 90], [-150, 160], [-205, 200]], T);
      o += kiteTail([[-27, 75], [-8, 108], [-36, 140], [-10, 170], [-32, 205]], ctx, [1, 3]);
      const apex = [0, -185], edge = [[-165, 30], [-110, 42], [-55, 60], [0, 80], [55, 60], [110, 42], [165, 30]];
      let k = '';
      for (let i = 0; i < 6; i++) k += poly([apex, edge[i], edge[i + 1]]);
      k += C(0, -60, 20);
      o += g(k, 'rotate(20 0 0)');
      return o;
    }
    // butterfly kite
    let o = smooth([[0, 60], [-50, 120], [-130, 170], [-205, 200]], T);
    const wing = (sx) => {
      let w = blob([[sx * 12, -60], [sx * 70, -160], [sx * 170, -170], [sx * 190, -95], [sx * 130, -20], [sx * 20, -10]]);
      w += blob([[sx * 14, 0], [sx * 120, 10], [sx * 160, 80], [sx * 110, 140], [sx * 40, 110], [sx * 10, 40]]);
      w += C(sx * 120, -110, 30) + C(sx * 120, -110, 13, T) + C(sx * 90, 70, 24) + E(sx * 70, -50, 16, 12, T) + C(sx * 130, 40, 10, T);
      return w;
    };
    o += wing(-1) + wing(1);
    o += curve('M-8 -95Q-30 -150 -55 -165M8 -95Q30 -150 55 -165') + C(-58, -167, 9) + C(58, -167, 9);
    o += E(0, 10, 18, 120) + C(0, -100, 24) + dotEye(-9, -104, 4.5) + dotEye(9, -104, 4.5) + smile(0, -92, 14);
    for (let y = -40; y < 110; y += 30) o += curve(`M-16 ${y}Q0 ${y + 8} 16 ${y}`, T);
    return o;
  },
};
function smoothPath(pts) { return smooth(pts).match(/d="([^"]+)"/)[1]; }

// ---------- robot ----------
const robot = {
  id: 'robot', name: 'Robot', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // boxy robot waving
      let o = R(-72, 118, 46, 60, 8) + R(26, 118, 46, 60, 8) + R(-92, 168, 82, 32, 14) + R(10, 168, 82, 32, 14);
      // arms: left raised, right down
      o += g(R(-20, -95, 40, 100, 18) + C(0, -110, 26) + C(0, -110, 11, T), 'translate(-118 -10) rotate(-28)');
      o += R(98, -10, 40, 110, 18) + P('M118 96C88 100 88 150 118 152C148 150 148 100 118 96Z') + C(118, 124, 10, T);
      o += R(-104, -24, 208, 150, 22) + R(-64, 6, 128, 92, 14) + heart(-18, 48, 50) + C(32, 32, 11) + C(32, 66, 11);
      o += R(-22, -46, 44, 26);
      o += line(0, -158, 0, -182) + C(0, -188, 13);
      o += R(-106, -126, 18, 44, 6) + R(88, -126, 18, 44, 6);
      o += R(-90, -160, 180, 118, 28);
      o += C(-40, -112, 25) + dotEye(-40, -112, 11) + C(40, -112, 25) + dotEye(40, -112, 11);
      o += R(-40, -78, 80, 22, 10) + line(-20, -78, -20, -56, T) + line(0, -78, 0, -56, T) + line(20, -78, 20, -56, T);
      o += curve('M-185 -170q10 -22 32 -26M-196 -132q18 -14 38 -10', T);
      return o;
    }
    if (style === 1) {
      // round robot on tank treads
      let o = curve('M-35 -150Q-50 -180 -70 -188M35 -150Q50 -180 70 -188') + C(-72, -190, 12) + C(72, -190, 12);
      o += R(-14, -50, 28, 30);
      // left arm up with a flower, right arm out
      o += g(R(-13, -100, 26, 104, 13), 'translate(-92 0) rotate(-30)') + C(-145, -92, 22) + C(-145, -92, 9, T);
      o += g(R(-13, -4, 26, 100, 13), 'translate(92 12) rotate(-55)') + C(172, 66, 22) + C(172, 66, 9, T);
      o += E(0, 50, 108, 96) + C(0, 45, 36) + C(0, 45, 20, T) + line(0, 45, 12, 30, T);
      o += C(-60, 70, 10) + C(60, 70, 10) + R(-30, 98, 60, 16, 8);
      o += R(-130, 128, 260, 72, 36);
      for (const x of [-92, -30, 30, 92]) o += C(x, 164, 22) + C(x, 164, 7, T);
      o += E(0, -95, 92, 70) + E(0, -95, 68, 48);
      o += dotEye(-26, -102, 10) + dotEye(26, -102, 10) + smile(0, -82, 34, 0.45);
      o += C(-55, -78, 8, T) + C(55, -78, 8, T);
      return o;
    }
    // wind-up toy robot with a key and a gear
    let o = '';
    const key = R(96, 52, 52, 16, 6) + C(166, 36, 21) + C(166, 82, 21) + C(166, 36, 8, T) + C(166, 82, 8, T);
    o += key;
    o += R(-58, 130, 40, 40, 6) + R(18, 130, 40, 40, 6) + R(-74, 166, 70, 34, 10) + R(4, 166, 70, 34, 10);
    o += R(-150, -40, 54, 34, 10) + R(96, -40, 54, 34, 10) + C(-160, -23, 24) + C(160, -23, 24) + C(-160, -23, 9, T) + C(160, -23, 9, T);
    o += R(-100, -60, 200, 196, 12);
    // gear
    let gp = [];
    for (let i = 0; i < 16; i++) { const rr = i % 2 ? 36 : 48; gp.push(pol(0, 40, rr, i * 22.5 - 11), pol(0, 40, rr, i * 22.5 + 11)); }
    o += poly(gp) + C(0, 40, 16);
    for (const [x, y] of [[-84, -44], [84, -44], [-84, 120], [84, 120]]) o += C(x, y, 6, T);
    o += R(-20, -78, 40, 20);
    o += R(-84, -190, 168, 114, 12);
    o += P('M-84 -140L-104 -150L-104 -112L-84 -122Z') + P('M84 -140L104 -150L104 -112L84 -122Z');
    o += R(-62, -168, 124, 70, 16);
    o += eye(-30, -140, 15) + eye(30, -140, 15);
    o += R(-26, -118, 52, 12, 6, T);
    return o;
  },
};

// ---------- building blocks ----------
function cube(x, y, s, d, ctx, ic) {
  const dy = d * 0.6;
  let o = poly([[x, y - s], [x + d, y - s - dy], [x + s + d, y - s - dy], [x + s, y - s]]);
  o += poly([[x + s, y - s], [x + s + d, y - s - dy], [x + s + d, y - dy], [x + s, y]]);
  o += R(x, y - s, s, s) + R(x + 9, y - s + 9, s - 18, s - 18, 6, ctx.thin);
  if (ic) o += icon(ic, x + s / 2, y - s / 2, s * 0.26);
  return o;
}
const blocks = {
  id: 'building-blocks', name: 'Building blocks', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    const icons = ['star', 'heart', 'circle', 'tri', 'moon', 'flower'];
    const pick = () => icons.splice(Math.floor(rand() * icons.length), 1)[0] || 'square';
    if (style === 0) {
      // pyramid of six alphabet-style blocks with shapes on them
      const s = 116, d = 34; let o = '';
      const x0 = -190;
      for (let i = 0; i < 3; i++) o += cube(x0 + i * s, 200, s, d, ctx, pick());
      for (let i = 0; i < 2; i++) o += cube(x0 + s / 2 + i * s, 200 - s, s, d, ctx, pick());
      o += cube(x0 + s, 200 - 2 * s, s, d, ctx, pick());
      return o;
    }
    if (style === 1) {
      // a little block castle: arch, pillars, plank and roof
      const d = 28, dy = d * 0.6;
      let o = '';
      // arch block
      o += poly([[-170, 110], [-170 + d, 110 - dy], [170 + d, 110 - dy], [170, 110]]) + poly([[170, 110], [170 + d, 110 - dy], [170 + d, 200 - dy], [170, 200]]);
      o += P('M-170 110L170 110L170 200L60 200A60 60 0 0 0 -60 200L-170 200Z');
      // two cylinders and a cube on top
      const cyl = (cx, w, yb, h) => R(cx - w / 2, yb - h, w, h) + E(cx, yb - h, w / 2, w * 0.18) + curve(`M${cx - w / 2} ${yb}A${w / 2} ${w * 0.18} 0 0 0 ${cx + w / 2} ${yb}`, T);
      o += cyl(-120, 74, 110, 120) + cyl(130, 74, 110, 120);
      o += cube(-55, 110, 110, d, ctx, pick());
      // plank
      o += poly([[-175, -10], [-175 + d, -10 - dy], [175 + d, -10 - dy], [175, -10]]) + poly([[175, -10], [175 + d, -10 - dy], [175 + d, 26 - dy], [175, 26]]);
      o += R(-175, -10, 350, 36);
      // roof prism
      o += poly([[0, -125], [d, -125 - dy], [110 + d, -10 - dy], [110, -10]]) + poly([[-110, -10], [0, -125], [110, -10]]);
      o += icon(pick(), 0, -45, 24);
      // flag
      o += line(0, -125, 0, -185) + poly([[0, -185], [48, -170], [0, -155]]);
      return o;
    }
    // stacked toy bricks with round studs on top
    const d = 26, dy = d * 0.6, h = 70;
    const brick = (x, yb, n) => {
      const w = n * 60;
      let o = poly([[x, yb - h], [x + d, yb - h - dy], [x + w + d, yb - h - dy], [x + w, yb - h]]);
      o += poly([[x + w, yb - h], [x + w + d, yb - h - dy], [x + w + d, yb - dy], [x + w, yb]]);
      o += R(x, yb - h, w, h, 4);
      for (let i = 0; i < n; i++) {
        const cx = x + 30 + i * 60 + d * 0.5, cy = yb - h - dy * 0.5;
        o += R(cx - 19, cy - 14, 38, 14) + E(cx, cy, 19, 7) + E(cx, cy - 14, 19, 7);
      }
      return o;
    };
    let o = brick(-190, 200, 3) + brick(-2, 200, 3) + brick(-140, 130, 4) + brick(-84, 60, 2) + brick(-200 + 160, -10, 1);
    return o;
  },
};

// ---------- toy train ----------
const train = {
  id: 'toy-train', name: 'Toy train', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // steam engine, side view, puffing
      let o = C(140, -130, 22) + C(165, -168, 28) + C(122, -100, 16);
      o += R(66, -64, 44, 72) + P('M56 -64L120 -64L112 -86L64 -86Z');
      o += P('M-10 6A26 26 0 0 1 42 6Z');
      o += R(-50, 6, 190, 92, 8) + E(140, 52, 20, 46);
      for (const x of [-10, 40, 90]) o += line(x, 8, x, 96, T);
      o += R(-185, -58, 140, 160, 10) + R(-160, -32, 86, 62, 10) + line(-117, -32, -117, 30, T);
      o += R(-198, -86, 166, 30, 12);
      o += R(-190, 96, 360, 30, 10);
      o += poly([[170, 96], [196, 126], [150, 126]]);
      o += P('M150 30L172 30L172 66L150 66Z') + C(161, 48, 8, T);
      o += wheel(-110, 148, 52, ctx, 8) + wheel(40, 166, 34, ctx, 6) + wheel(120, 166, 34, ctx, 6);
      o += R(-112, 140, 236, 14, 7);
      return o;
    }
    if (style === 1) {
      // pull-along wooden train: engine and two wagons with cargo
      let o = '';
      // couplers and pull cord
      o += line(-50, 120, -36, 120) + line(64, 120, 80, 120);
      o += smooth([[-195, 115], [-205, 90], [-188, 60]], T) + C(-186, 50, 12);
      // engine (facing left)
      o += R(-178, -30, 28, 70) + P('M-186 -30L-142 -30L-148 -48L-180 -48Z');
      o += R(-120, -50, 66, 140, 8) + R(-108, -36, 42, 40, 8) + R(-132, -66, 90, 20, 8);
      o += R(-192, 20, 80, 56, 14) + C(-145, 6, 14);
      o += R(-195, 76, 150, 64, 10);
      // wagon 1 with blocks
      o += cube(-26, 84, 50, 16, ctx, 'star') + cube(12, 84, 46, 16, ctx, 'heart') + cube(-12, 34, 46, 16, ctx, 'circle');
      o += R(-36, 72, 100, 68, 8) + R(-36, 72, 100, 14, 6);
      // wagon 2 with a ball
      o += C(130, 30, 52) + curve('M80 30Q130 50 182 30M130 -22Q115 30 130 82', T);
      o += R(78, 72, 106, 68, 8) + R(78, 72, 106, 14, 6);
      // wheels
      for (const x of [-160, -84, -10, 40, 104, 158]) o += C(x, 170, 30) + C(x, 170, 10, T);
      return o;
    }
    // engine seen from the front
    let o = C(120, -150, 20) + C(150, -175, 24);
    o += R(-150, -40, 300, 200, 18) + R(-120, -10, 70, 60, 10) + R(50, -10, 70, 60, 10);
    o += R(-170, -70, 340, 36, 14);
    o += R(-30, -165, 60, 110) + P('M-48 -165L48 -165L38 -190L-38 -190Z');
    o += C(0, 40, 92) + C(0, 40, 66, T) + C(0, 40, 14);
    o += R(-30, -110, 60, 22, 8) + C(0, -84, 16);
    o += R(-170, 140, 340, 26, 8) + C(-130, 154, 18) + C(130, 154, 18);
    o += poly([[-90, 166], [90, 166], [60, 200], [-60, 200]]);
    for (const x of [-40, 0, 40]) o += line(x, 166, x * 0.75, 200, T);
    o += R(-150, 166, 34, 34, 8) + R(116, 166, 34, 34, 8);
    return o;
  },
};

// ---------- balloons ----------
function balloonD(cx, cy, rx, ry) {
  return `M${r1(cx)} ${r1(cy - ry)}C${r1(cx + 0.58 * rx)} ${r1(cy - ry)} ${r1(cx + rx)} ${r1(cy - 0.58 * ry)} ${r1(cx + rx)} ${r1(cy - 0.08 * ry)}C${r1(cx + rx)} ${r1(cy + 0.45 * ry)} ${r1(cx + 0.45 * rx)} ${r1(cy + 0.92 * ry)} ${r1(cx)} ${r1(cy + ry)}C${r1(cx - 0.45 * rx)} ${r1(cy + 0.92 * ry)} ${r1(cx - rx)} ${r1(cy + 0.45 * ry)} ${r1(cx - rx)} ${r1(cy - 0.08 * ry)}C${r1(cx - rx)} ${r1(cy - 0.58 * ry)} ${r1(cx - 0.58 * rx)} ${r1(cy - ry)} ${r1(cx)} ${r1(cy - ry)}Z`;
}
function balloon(cx, cy, rx, ry, ctx, a = 0) {
  let o = P(balloonD(cx, cy, rx, ry)) + poly([[cx, cy + ry - 2], [cx - 11, cy + ry + 15], [cx + 11, cy + ry + 15]]);
  o += curve(`M${r1(cx - 0.62 * rx)} ${r1(cy - 0.15 * ry)}Q${r1(cx - 0.6 * rx)} ${r1(cy - 0.62 * ry)} ${r1(cx - 0.18 * rx)} ${r1(cy - 0.74 * ry)}`, ctx.thin);
  return a ? g(o, rot(a, cx, cy + ry + 15)) : o;
}
const balloons = {
  id: 'balloons', name: 'Balloons', styles: 4, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'party', 'sky', 'room', 'meadow'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // a bunch of five tied with a bow
      const bs = [[-115, -85, 62, 74, -14], [0, -125, 66, 78, 0], [115, -85, 62, 74, 14], [-62, 10, 58, 70, -8], [62, 10, 58, 70, 8]];
      let o = '';
      for (const [x, y, rx, ry, a] of bs) {
        const tip = pol(x, y + ry + 15, 0, 0); const k = (a * Math.PI) / 180;
        const ex = x - Math.sin(k) * 0, ey = y + ry + 15;
        o += curve(`M${r1(ex)} ${r1(ey)}Q${r1((ex + 0) / 2 + 10)} ${r1((ey + 140) / 2)} 0 140`, T);
      }
      o += smooth([[0, 140], [-12, 165], [8, 185], [-6, 205]], T) + smooth([[0, 140], [14, 170], [2, 190], [16, 205]], T);
      for (const [x, y, rx, ry, a] of bs.slice(0, 3)) o += balloon(x, y, rx, ry, ctx, a);
      for (const [x, y, rx, ry, a] of bs.slice(3)) o += balloon(x, y, rx, ry, ctx, a);
      o += bow(0, 140, 0.42);
      return o;
    }
    if (style === 1) {
      // one big balloon with polka dots and a curly ribbon
      let o = smooth([[0, 95], [-20, 120], [10, 140], [-20, 155], [10, 175], [-10, 205]], T);
      o += balloon(0, -50, 135, 150, ctx);
      const dots = [[40, -120], [80, -40], [-30, -40], [30, 30], [-85, 30], [-60, -110], [95, 40], [10, -170]];
      for (const [x, y] of dots) o += C(x, y, 17);
      return o;
    }
    if (style === 2) {
      // a balloon dog
      const seg = (x, y, rx, ry, a) => g(E(0, 0, rx, ry), `translate(${x} ${y}) rotate(${a})`);
      let o = seg(110, 85, 22, 62, -18) + seg(-58, 92, 22, 62, 14);
      o += seg(155, -40, 20, 52, 32);
      o += seg(30, 10, 112, 36, 0);
      o += seg(70, 90, 22, 62, 12) + seg(-100, 85, 22, 62, -18);
      o += seg(-95, -70, 26, 66, 20);
      o += seg(-60, -165, 20, 46, 35) + seg(-100, -170, 20, 46, -5);
      o += seg(-140, -125, 62, 32, -8);
      o += C(-200 + 4, -118, 9) + dotEye(-130, -138, 7) + smile(-160, -112, 22, 0.35);
      o += C(-80, -10, 12, T) + C(120, -10, 12, T);
      o += curve('M-30 -10Q0 -22 40 -18', T);
      return o;
    }
    // a heart balloon and a star balloon
    let o = smooth([[-70, 2], [-60, 90], [-20, 160], [5, 205]], T) + smooth([[76, 56], [70, 120], [30, 170], [5, 205]], T);
    o += heart(-70, -80, 230) + curve('M-140 -130Q-150 -80 -120 -50', T);
    o += star(85, -10, 108, 54, 5, '', -80) + poly([[76, 40], [64, 58], [88, 58]]);
    return o;
  },
};

// ---------- rocking horse ----------
const rocker = () => P('M-198 142Q0 262 198 142L186 128Q0 236 -186 128Z');
function horse(ctx, uni, rider) {
  const T = ctx.thin;
  let o = '';
  // splayed legs: far pair, then near pair, then the runner covers their ends
  o += poly([[-62, 30], [-36, 34], [-100, 166], [-126, 160]]) + poly([[58, 30], [84, 26], [138, 160], [112, 166]]);
  o += poly([[-92, 28], [-64, 36], [-136, 160], [-162, 150]]) + poly([[30, 36], [58, 30], [100, 168], [74, 170]]);
  o += rocker();
  // tail
  o += uni ? blob([[108, -12], [160, -50], [196, -20], [170, 10], [190, 60], [150, 70], [125, 25]]) + curve('M140 -20Q165 0 160 40', T)
    : blob([[108, -12], [150, -45], [190, -35], [178, 10], [165, 70], [130, 50], [120, 10]]) + curve('M135 -15Q160 10 152 45', T);
  // body
  o += blob([[-112, 0], [-84, -32], [0, -38], [84, -36], [122, -8], [116, 32], [70, 52], [0, 46], [-80, 50], [-114, 28]]);
  // mane, neck and head
  o += blob([[-118, -186], [-82, -175], [-70, -140], [-45, -125], [-40, -90], [-15, -70], [-10, -35], [10, -20], [-40, 0], [-80, -60]]);
  o += blob([[-78, 20], [-120, -60], [-130, -120], [-118, -168], [-80, -160], [-60, -100], [-30, -20]]);
  o += blob([[-100, -178], [-150, -170], [-190, -118], [-192, -88], [-165, -78], [-120, -100], [-88, -140]]);
  o += P('M-108 -170L-96 -200L-82 -168Z');
  if (uni) o += P('M-128 -176L-150 -228L-108 -184Z') + curve('M-140 -205L-118 -195M-134 -190L-114 -184', T);
  o += dotEye(-140, -135, 8) + dark(E(-178, -100, 5, 4)) + curve('M-182 -86Q-170 -80 -160 -86', T);
  o += curve('M-160 -152L-150 -88M-150 -88L-25 -40', T) + C(-150, -88, 7);
  // saddle and handle
  o += blob([[-40, -40], [10, -46], [62, -40], [58, 10], [10, 22], [-36, 10]]);
  o += uni ? star(10, -12, 22, 10) : C(10, -12, 14, T);
  o += R(-76, -96, 30, 12, 6);
  if (rider) {
    // a teddy bear riding, holding the handle
    o += g(E(0, 0, 22, 44), 'translate(-2 0) rotate(-15)') + E(-10, 40, 24, 16);
    o += E(18, -70, 48, 54);
    o += g(E(0, 0, 18, 40), 'translate(-28 -82) rotate(60)');
    o += teddyHead(26, -140, 46, ctx);
  }
  return o;
}
const rockingHorse = {
  id: 'rocking-horse', name: 'Rocking horse', styles: 3,
  draw(style, rand, ctx) {
    if (style === 0) return horse(ctx, false, false);
    if (style === 1) return g(horse(ctx, true, false) + swish(150, 110, ctx, 3, 40, 20, 1), 'rotate(-6 0 200)');
    return horse(ctx, false, true);
  },
};

// ======================================================================
// SEASONS AND HOLIDAYS
// ======================================================================

// ---------- snowman ----------
function carrot(x, y, len, ctx) { return poly([[x, y - 9], [x + len, y + 2], [x, y + 9]]) + curve(`M${x + len * 0.3} ${y - 5}l6 7M${x + len * 0.55} ${y - 2}l5 5`, ctx.thin); }
function coalSmile(x, y, w, n = 5) { let o = ''; for (let i = 0; i < n; i++) { const t = i / (n - 1) - 0.5; o += dark(C(x + t * w, y + (0.25 - t * t) * w * 0.5, 4.5)); } return o; }
function twigArm(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const tw = (f, deg) => { const a = (deg * Math.PI) / 180, px = x1 + dx * f, py = y1 + dy * f; const ux = dx * 0.24, uy = dy * 0.24; return `M${r1(px)} ${r1(py)}l${r1(ux * Math.cos(a) - uy * Math.sin(a))} ${r1(ux * Math.sin(a) + uy * Math.cos(a))}`; };
  const up = dx > 0 ? -40 : 40;
  return curve(`M${x1} ${y1}L${x2} ${y2}` + tw(0.62, up) + tw(0.8, -up));
}
function mitten(x, y, a) {
  return g(P('M-18 0C-24 -30 -16 -46 0 -46C16 -46 22 -30 18 0Z') + P('M-16 -18C-30 -18 -34 -34 -22 -38Z') + R(-20, -4, 40, 14, 5), `translate(${x} ${y}) rotate(${a})`);
}
const snowman = {
  id: 'snowman', name: 'Snowman', styles: 3, scenes: ['plain', 'hearts', 'stars', 'snow', 'night', 'hills', 'forest'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // three snowballs, top hat, stick arms, scarf
      let o = twigArm(-52, -10, -165, -70) + twigArm(52, -10, 165, -75);
      o += C(0, 122, 78) + C(0, 0, 60);
      for (const y of [-24, 8, 40]) o += C(0, y, 9);
      o += C(0, -104, 54);
      o += dotEye(-19, -122, 7) + dotEye(19, -122, 7) + carrot(2, -104, 50, ctx) + coalSmile(0, -86, 44);
      o += P('M-50 -56Q0 -32 50 -56L52 -36Q0 -10 -52 -36Z') + P('M18 -40L40 46L64 40L44 -44Z') + curve('M44 42l-2 14M56 40l2 14', T);
      o += R(-62, -156, 124, 15, 7) + R(-40, -210, 80, 58, 6) + R(-40, -170, 80, 16, 0);
      return o;
    }
    if (style === 1) {
      // two snowballs, bobble hat, waving with mittens
      let o = twigArm(-80, 40, -150, -40) + twigArm(80, 50, 155, 80);
      o += mitten(-155, -40, -30) + mitten(162, 92, 120);
      o += C(0, 104, 96);
      for (const y of [50, 90, 130]) o += C(0, y, 10);
      o += C(0, -58, 68);
      o += P('M-58 -16Q0 10 58 -16L60 4Q0 32 -60 4Z') + P('M-40 0L-64 92L-40 98L-20 6Z') + curve('M-60 94l-4 14M-46 98l-2 14M-52 30L-30 36M-58 60L-36 66', T);
      o += dotEye(-24, -66, 8) + dotEye(24, -66, 8) + carrot(0, -50, 52, ctx) + coalSmile(0, -32, 48);
      o += P('M-64 -96Q-62 -160 0 -162Q62 -160 64 -96Z') + R(-70, -110, 140, 26, 12) + C(0, -172, 22);
      o += curve('M-30 -110L-26 -150M0 -110L0 -158M30 -110L26 -150', T);
      o += curve('M-178 -70q8 -18 26 -20M-186 -40q14 -10 30 -6', T);
      return o;
    }
    // snowman face close up with earmuffs and a striped scarf
    let o = C(0, -20, 150);
    o += P('M-150 140L-178 205L-118 205L-104 150Z') + curve('M-170 190l-4 14M-150 192l0 14M-130 192l2 14', T);
    o += P('M-140 118Q0 208 140 118L152 170Q0 250 -152 170Z');
    o += curve('M-144 136Q0 222 144 136', T) + curve('M-148 153Q0 236 148 153', T);
    o += P('M-136 -100Q0 -270 136 -100L118 -96Q0 -240 -118 -96Z');
    o += E(-150, -50, 38, 52) + E(150, -50, 38, 52) + E(-150, -50, 22, 32, T) + E(150, -50, 22, 32, T);
    o += eye(-50, -55, 20, [0, 0.2]) + eye(50, -55, 20, [0, 0.2]);
    o += carrot(0, -10, 90, ctx) + coalSmile(-5, 40, 110, 7);
    o += C(-90, 15, 20, T) + C(95, 15, 20, T);
    return o;
  },
};

// ---------- winter tree ----------
function tierPts(apexY, baseY, half, n = 5) {
  // a tree tier as a closed shape with a scalloped bottom edge
  let d = `M0 ${apexY}L${half} ${baseY}`;
  for (let i = 0; i < n; i++) {
    const x0 = half - (2 * half * i) / n, x1 = half - (2 * half * (i + 1)) / n;
    d += `Q${r1((x0 + x1) / 2)} ${r1(baseY + 26)} ${r1(x1)} ${baseY}`;
  }
  return d + 'Z';
}
const winterTree = {
  id: 'winter-tree', name: 'Winter tree', styles: 3, scenes: ['plain', 'hearts', 'stars', 'room', 'snow', 'night', 'party'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    const tiers = [[-40, 120, 150], [-110, 30, 115], [-160, -60, 78]];
    const edgeX = (t, y) => (t[2] * (y - t[0])) / (t[1] - t[0]);
    if (style === 0 || style === 1) {
      let o = '';
      const withGifts = style === 1;
      const lift = withGifts ? 0 : 0;
      if (!withGifts) o += P('M-62 140L62 140L48 200L-48 200Z') + R(-70, 134, 140, 18, 6);
      else o += R(-18, 130, 36, 60);
      const tr = withGifts ? tiers.map(([a, b, h]) => [a + 10, b + 10, h * 0.95]) : tiers;
      tr.forEach((t, i) => {
        o += P(tierPts(t[0], t[1], t[2], 5 - i));
        // garland across the tier
        const y1 = t[1] - (t[1] - t[0]) * 0.55, y2 = t[1] - (t[1] - t[0]) * 0.25;
        const xa = -edgeX(t, y1) + 4, xb = edgeX(t, y2) - 4;
        o += P(`M${r1(xa)} ${r1(y1)}Q0 ${r1((y1 + y2) / 2 + 34)} ${r1(xb)} ${r1(y2)}L${r1(xb - 3)} ${r1(y2 + 13)}Q0 ${r1((y1 + y2) / 2 + 48)} ${r1(xa + 2)} ${r1(y1 + 13)}Z`);
        // baubles
        const spots = [[-0.45, 0.88], [0.5, 0.92], [0.05, 0.55]];
        if (i < 2) spots.push([-0.6, 0.35]);
        for (const [fx, fy] of spots) {
          const y = t[0] + (t[1] - t[0]) * fy, x = fx * edgeX(t, y) * 0.9;
          if (i === 2 && fy < 0.6) continue;
          o += R(x - 5, y - 14 - 8, 10, 8, 2) + C(x, y - 2, 13);
        }
      });
      o += star(0, -170, 36, 15);
      if (withGifts) {
        const gift = (x, w, h, bowS) => R(x, 200 - h, w, h, 4) + R(x + w / 2 - 9, 200 - h, 18, h) + bow(x + w / 2, 200 - h, bowS, false);
        o += gift(-185, 110, 80, 0.4) + gift(-70, 60, 50, 0.3) + gift(90, 100, 95, 0.42);
      }
      return o;
    }
    // snowy pine outside with a little bird
    let o = R(-22, 130, 44, 70);
    for (let i = 0; i < 3; i++) {
      const t = tiers[i];
      o += P(tierPts(t[0], t[1], t[2] * 1.05, 5 - i));
      // snow resting on the tier: a wavy cap along the bottom
      const h = t[2] * 1.05, yb = t[1];
      const pts = [];
      for (let k = 0; k <= 8; k++) { const x = -h * 0.9 + (k / 8) * h * 1.8; pts.push([x, yb - 22 + (k % 2 ? 10 : -4)]); }
      o += P(`M${-h * 0.92} ${yb + 4}` + smoothPath(pts).replace(/^M[^C]+/, 'L' + pt(pts[0])) + `L${h * 0.92} ${yb + 4}Q0 ${yb + 22} ${-h * 0.92} ${yb + 4}Z`);
    }
    o += P('M0 -166Q30 -130 34 -116Q20 -108 10 -120Q0 -106 -10 -120Q-20 -108 -34 -116Q-30 -130 0 -166Z');
    // bird on the middle tier
    o += g(E(0, 0, 26, 20) + C(20, -14, 14) + poly([[32, -16], [44, -12], [32, -8]]) + P('M-10 -4Q-34 -18 -40 -4Q-30 6 -10 6Z') + dotEye(23, -17, 3.5) + line(-4, 18, -6, 28, T) + line(6, 18, 6, 28, T), 'translate(70 0)');
    return o;
  },
};

// ---------- pumpkin ----------
function pumpkin(cx, yb, w, h, ctx, face = false, leaf = true) {
  const cy = yb - h / 2, k = w / 360;
  let o = '';
  o += P(`M${r1(cx - 14 * k)} ${r1(yb - h + 14 * k)}Q${r1(cx - 18 * k)} ${r1(yb - h - 40 * k)} ${r1(cx + 8 * k)} ${r1(yb - h - 66 * k)}L${r1(cx + 30 * k)} ${r1(yb - h - 52 * k)}Q${r1(cx + 12 * k)} ${r1(yb - h - 30 * k)} ${r1(cx + 18 * k)} ${r1(yb - h + 14 * k)}Z`);
  if (leaf) {
    o += blob([[cx + 20 * k, yb - h - 20 * k], [cx + 70 * k, yb - h - 60 * k], [cx + 120 * k, yb - h - 40 * k], [cx + 100 * k, yb - h - 5 * k], [cx + 50 * k, yb - h + 5 * k]]);
    o += curve(`M${r1(cx + 25 * k)} ${r1(yb - h - 18 * k)}Q${r1(cx + 70 * k)} ${r1(yb - h - 35 * k)} ${r1(cx + 110 * k)} ${r1(yb - h - 30 * k)}`, ctx.thin);
    o += curve(`M${r1(cx - 10 * k)} ${r1(yb - h - 30 * k)}c${r1(-40 * k)} ${r1(-10 * k)} ${r1(-50 * k)} ${r1(-50 * k)} ${r1(-25 * k)} ${r1(-55 * k)}s${r1(25 * k)} ${r1(25 * k)} ${r1(5 * k)} ${r1(30 * k)}`, ctx.thin);
  }
  o += E(cx - 0.31 * w, cy, 0.22 * w, 0.46 * h) + E(cx + 0.31 * w, cy, 0.22 * w, 0.46 * h);
  o += E(cx - 0.16 * w, cy, 0.24 * w, 0.49 * h) + E(cx + 0.16 * w, cy, 0.24 * w, 0.49 * h);
  o += E(cx, cy, 0.2 * w, 0.5 * h);
  if (face) {
    const s = w / 360;
    o += sp('M-90 -40C-90 -78 -40 -78 -40 -40Z', cx, cy, s) + sp('M40 -40C40 -78 90 -78 90 -40Z', cx, cy, s);
    o += sp('M0 -18L16 6L-16 6Z', cx, cy, s);
    o += sp('M-110 22Q0 130 110 22Q0 64 -110 22Z', cx, cy, s);
    o += sp('M-20 46L-20 64L6 66L6 48Z', cx, cy, s);
  }
  return o;
}
const pumpkinSub = {
  id: 'pumpkin', name: 'Pumpkin', styles: 3, scenes: ['plain', 'hearts', 'stars', 'garden', 'meadow', 'night', 'table', 'hills'],
  draw(style, rand, ctx) {
    if (style === 0) return pumpkin(0, 200, 380, 270, ctx);
    if (style === 1) return pumpkin(0, 200, 380, 280, ctx, true, false);
    let o = pumpkin(10, 120, 250, 190, ctx, false, true);
    o += pumpkin(-110, 200, 190, 140, ctx, false, false) + pumpkin(110, 200, 170, 120, ctx, false, false);
    return o;
  },
};

// ---------- painted eggs ----------
function eggD(cx, cy, rx, ry) {
  return `M${r1(cx)} ${r1(cy - ry)}C${r1(cx + 0.62 * rx)} ${r1(cy - ry)} ${r1(cx + rx)} ${r1(cy - 0.42 * ry)} ${r1(cx + rx)} ${r1(cy + 0.15 * ry)}C${r1(cx + rx)} ${r1(cy + 0.66 * ry)} ${r1(cx + 0.56 * rx)} ${r1(cy + ry)} ${r1(cx)} ${r1(cy + ry)}C${r1(cx - 0.56 * rx)} ${r1(cy + ry)} ${r1(cx - rx)} ${r1(cy + 0.66 * ry)} ${r1(cx - rx)} ${r1(cy + 0.15 * ry)}C${r1(cx - rx)} ${r1(cy - 0.42 * ry)} ${r1(cx - 0.62 * rx)} ${r1(cy - ry)} ${r1(cx)} ${r1(cy - ry)}Z`;
}
/** Half-width of the egg at height y (sampled from the right-hand curves). */
function eggHW(rx, ry, y) {
  const bez = (p0, p1, p2, p3, t) => (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3;
  const segs = [[[0, -ry], [0.62 * rx, -ry], [rx, -0.42 * ry], [rx, 0.15 * ry]], [[rx, 0.15 * ry], [rx, 0.66 * ry], [0.56 * rx, ry], [0, ry]]];
  let best = 0, bd = 1e9;
  for (const s of segs) for (let i = 0; i <= 60; i++) {
    const t = i / 60, yy = bez(s[0][1], s[1][1], s[2][1], s[3][1], t);
    if (Math.abs(yy - y) < bd) { bd = Math.abs(yy - y); best = bez(s[0][0], s[1][0], s[2][0], s[3][0], t); }
  }
  return best;
}
/** A decorated band across an egg between heights a and b (relative to egg centre). edge: 'zig' | 'wave' | 'flat'. */
function eggBand(cx, cy, rx, ry, a, b, edge) {
  const top = [], bot = [];
  const wa = eggHW(rx, ry, a), wb = eggHW(rx, ry, b);
  const n = 8;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = -wa + 2 * wa * t;
    const off = edge === 'zig' ? (i % 2 ? -10 : 6) : edge === 'wave' ? Math.sin(t * Math.PI * 4) * 8 : 0;
    top.push([x, a + (i === 0 || i === n ? 0 : off)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = wb - 2 * wb * t;
    const off = edge === 'zig' ? (i % 2 ? 10 : -6) : edge === 'wave' ? -Math.sin(t * Math.PI * 4) * 8 : 0;
    bot.push([x, b + (i === 0 || i === n ? 0 : off)]);
  }
  const side = (y0, y1) => { const out = []; for (let i = 1; i < 6; i++) { const y = y0 + ((y1 - y0) * i) / 6; out.push([eggHW(rx, ry, y), y]); } return out; };
  const right = side(a, b), left = side(b, a).map(([x, y]) => [-x, y]);
  const all = [...top, ...right, ...bot, ...left];
  const mv = (p) => `${r1(cx + p[0])} ${r1(cy + p[1])}`;
  if (edge === 'wave') {
    return P(`M${mv(top[0])}` + smoothPath(top.map(([x, y]) => [cx + x, cy + y])).replace(/^M[^C]+/, '') + right.map((p) => 'L' + mv(p)).join('') + `L${mv(bot[0])}` + smoothPath(bot.map(([x, y]) => [cx + x, cy + y])).replace(/^M[^C]+/, '') + left.map((p) => 'L' + mv(p)).join('') + 'Z');
  }
  return P('M' + all.map(mv).join('L') + 'Z');
}
function paintedEgg(cx, cy, rx, ry, ctx, rand, plan) {
  let o = P(eggD(cx, cy, rx, ry));
  const bands = plan || [[-0.55, -0.35, 'zig'], [-0.05, 0.2, 'flat'], [0.45, 0.62, 'wave']];
  for (const [a, b, e] of bands) o += eggBand(cx, cy, rx, ry, a * ry, b * ry, e);
  // dots or little shapes in the middle band and on the top
  const mid = bands[1];
  const ym = cy + ((mid[0] + mid[1]) / 2) * ry, hw = eggHW(rx, ry, ((mid[0] + mid[1]) / 2) * ry);
  const ic = rand ? rand.pick(['circle', 'heart', 'star', 'flower']) : 'circle';
  for (let i = -2; i <= 2; i++) { const x = cx + i * hw * 0.38; if (Math.abs(x - cx) < hw * 0.85) o += icon(ic, x, ym, ry * 0.07); }
  o += C(cx, cy - 0.75 * ry, ry * 0.07) + C(cx - rx * 0.4, cy - 0.68 * ry + 6, ry * 0.05) + C(cx + rx * 0.4, cy - 0.68 * ry + 6, ry * 0.05);
  o += C(cx, cy + 0.82 * ry, ry * 0.06) + C(cx - rx * 0.42, cy + 0.76 * ry, ry * 0.05) + C(cx + rx * 0.42, cy + 0.76 * ry, ry * 0.05);
  return o;
}
const eggs = {
  id: 'painted-eggs', name: 'Painted eggs', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'garden', 'table'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) return paintedEgg(0, 12, 135, 188, ctx, rand);
    if (style === 1) {
      // basket of eggs
      let o = P('M-150 40Q-150 -170 0 -170Q150 -170 150 40L128 40Q128 -146 0 -146Q-128 -146 -128 40Z');
      o += g(paintedEgg(0, 0, 58, 80, ctx, rand, [[-0.5, -0.3, 'zig'], [-0.05, 0.2, 'flat'], [0.4, 0.6, 'wave']]), 'translate(-80 -10) rotate(-15)');
      o += g(paintedEgg(0, 0, 58, 80, ctx, rand, [[-0.6, -0.4, 'wave'], [-0.1, 0.15, 'flat'], [0.4, 0.6, 'zig']]), 'translate(80 -10) rotate(15)');
      o += paintedEgg(0, -40, 62, 86, ctx, rand, [[-0.55, -0.35, 'flat'], [-0.1, 0.15, 'flat'], [0.35, 0.55, 'zig']]);
      for (const x of [-140, -110, 115, 140]) o += P(`M${x} 50L${x - 8} 20L${x + 6} 46L${x + 12} 18L${x + 16} 50Z`);
      o += P('M-170 40L170 40L140 200L-140 200Z') + R(-180, 30, 360, 32, 14);
      for (let y = 90; y < 200; y += 36) o += curve(`M${r1(-170 + (y - 40) * 0.18)} ${y}L${r1(170 - (y - 40) * 0.18)} ${y}`, T);
      for (let x = -120; x <= 120; x += 48) o += line(x, 62, x * 0.86, 200, T);
      return o;
    }
    // three eggs lying in grass with little flowers
    let o = '';
    o += g(paintedEgg(0, 0, 70, 98, ctx, rand, [[-0.6, -0.4, 'wave'], [-0.1, 0.15, 'flat'], [0.4, 0.6, 'zig']]), 'translate(-120 92) rotate(-14)');
    o += g(paintedEgg(0, 0, 70, 98, ctx, rand, [[-0.55, -0.35, 'zig'], [-0.1, 0.15, 'flat'], [0.4, 0.6, 'wave']]), 'translate(120 92) rotate(14)');
    o += paintedEgg(0, 60, 84, 118, ctx, rand, [[-0.6, -0.4, 'flat'], [-0.12, 0.12, 'flat'], [0.4, 0.62, 'zig']]);
    o += P('M-200 200Q-190 168 -160 176Q-130 156 -100 178Q-60 160 -20 182Q20 164 60 180Q100 158 140 178Q175 164 200 200Z');
    o += littleFlower(-175, 200, 80) + littleFlower(178, 200, 70);
    return o;
  },
};

// ---------- gift box ----------
function giftBox(x, yb, w, h, d, ctx, ribbonW = 26) {
  const dy = d * 0.6, yt = yb - h;
  let o = poly([[x, yt], [x + d, yt - dy], [x + w + d, yt - dy], [x + w, yt]]);
  o += poly([[x + w, yt], [x + w + d, yt - dy], [x + w + d, yb - dy], [x + w, yb]]);
  o += R(x, yt, w, h);
  const mx = x + w / 2;
  o += R(mx - ribbonW / 2, yt, ribbonW, h);
  o += poly([[mx - ribbonW / 2, yt], [mx - ribbonW / 2 + d, yt - dy], [mx + ribbonW / 2 + d, yt - dy], [mx + ribbonW / 2, yt]]);
  o += poly([[x + w, yt + h / 2 - ribbonW / 2], [x + w + d, yt + h / 2 - ribbonW / 2 - dy], [x + w + d, yt + h / 2 + ribbonW / 2 - dy], [x + w, yt + h / 2 + ribbonW / 2]]);
  o += poly([[x + d / 2, yt - dy / 2 - ribbonW * 0.3], [x + w + d / 2, yt - dy / 2 - ribbonW * 0.3], [x + w + d / 2, yt - dy / 2 + ribbonW * 0.3], [x + d / 2, yt - dy / 2 + ribbonW * 0.3]]);
  return o;
}
const gift = {
  id: 'gift-box', name: 'Gift box', styles: 3, scenes: ['plain', 'hearts', 'stars', 'party', 'room', 'table', 'snow'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // one big present with a lid and a bow
      let o = R(-140, -40, 280, 240, 6) + R(-26, -40, 52, 240);
      const pat = rand.pick(['star', 'heart', 'circle']);
      for (const [x, y] of [[-90, 30], [-70, 130], [85, 40], [80, 140]]) o += icon(pat, x, y, 20);
      o += R(-160, -96, 320, 64, 10) + R(-26, -96, 52, 64);
      o += bow(0, -100, 1.15);
      return o;
    }
    if (style === 1) {
      // a stack of three presents
      let o = giftBox(-170, 200, 260, 130, 50, ctx, 30);
      o += giftBox(-130, 70, 190, 100, 40, ctx, 26);
      o += giftBox(-85, -30, 120, 80, 30, ctx, 22);
      o += bow(-25 + 15, -119, 0.6);
      return o;
    }
    // an open present with its lid popping off and stars and hearts flying out
    let o = '';
    o += P('M-150 -20L-110 -60L150 -60L110 -20Z') + P('M-110 -60L150 -60L134 -44L-128 -40Z', T);
    o += star(-10, -125, 40, 17, 5, '', -100) + heart(85, -140, 68) + star(30, -190, 22, 10) + C(-60, -80, 11) + C(140, -80, 10) + C(-40, -190, 9);
    o += curve('M-10 -40Q-20 -60 -12 -80M40 -40Q60 -70 70 -100M15 -40Q20 -110 28 -165', T);
    o += P('M-150 -20L110 -20L110 200L-150 200Z') + P('M110 -20L150 -60L150 160L110 200Z');
    o += R(-36, -20, 50, 220) + P('M110 70L150 30L150 70L110 110Z');
    o += g(R(-80, -22, 160, 44, 6) + R(-25, -22, 50, 44), 'translate(-120 -150) rotate(-28)');
    o += curve('M-60 -100l20 -14M-90 -88l14 -16', T);
    return o;
  },
};

// ---------- birthday cake ----------
function candle(x, yTop, h, ctx) {
  let o = R(x - 8, yTop, 16, h, 3);
  for (let y = yTop + 12; y < yTop + h - 6; y += 16) o += line(x - 8, y + 6, x + 8, y - 4, ctx.thin);
  return o + line(x, yTop, x, yTop - 8, ctx.thin) + flame(x, yTop - 6, 34);
}
function cakeLayer(cx, yt, yb, rx, ery, drips, ctx) {
  let o = P(`M${cx - rx} ${yt}L${cx - rx} ${yb}A${rx} ${ery} 0 0 0 ${cx + rx} ${yb}L${cx + rx} ${yt}Z`);
  if (drips) {
    let d = `M${cx - rx} ${yt}L${cx - rx} ${yt + 26}`;
    const n = 7;
    for (let i = 0; i < n; i++) {
      const x0 = cx - rx + (2 * rx * i) / n, x1 = cx - rx + (2 * rx * (i + 1)) / n, dep = i % 2 ? 46 : 30;
      const yy = yt + ery * Math.sin(((i + 0.5) / n) * Math.PI);
      d += `Q${r1(x0 + (x1 - x0) * 0.25)} ${r1(yy + dep)} ${r1((x0 + x1) / 2)} ${r1(yy + dep - 2)}Q${r1(x0 + (x1 - x0) * 0.75)} ${r1(yy + dep)} ${r1(x1)} ${r1(yt + 26 + ery * Math.sin(((i + 1) / n) * Math.PI) * 0.8)}`;
    }
    o += P(d + `L${cx + rx} ${yt}Z`);
  }
  return o + E(cx, yt, rx, ery);
}
const cake = {
  id: 'birthday-cake', name: 'Birthday cake', styles: 3, scenes: ['plain', 'hearts', 'stars', 'party', 'table', 'room'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // two layers on a plate with five candles
      let o = E(0, 182, 192, 18);
      o += cakeLayer(0, 50, 168, 165, 26, false, ctx);
      for (let i = 0; i < 6; i++) o += heart(-125 + i * 50, 120 + Math.sin((i / 5) * Math.PI) * 14, 34);
      o += cakeLayer(0, -50, 52, 118, 20, true, ctx);
      for (let i = 0; i < 5; i++) o += C(-80 + i * 40, 30 + Math.sin((i / 4) * Math.PI) * 8, 8, T);
      for (const [x, y] of [[-70, -56], [-35, -44], [0, -60], [35, -44], [70, -56]]) o += candle(x, y - 64, 64, ctx);
      return o;
    }
    if (style === 1) {
      // a slice of cake on a plate with a strawberry and a candle
      let o = E(0, 178, 196, 22);
      const Tp = [-170, 40], F = [110, 70], Bk = [165, -25], h = 115;
      const dn = (p, v) => [p[0], p[1] + v];
      o += poly([Tp, F, dn(F, h), dn(Tp, h)]) + poly([F, Bk, dn(Bk, h), dn(F, h)]);
      for (const [a, b] of [[44, 60], [84, 100]]) o += poly([dn(Tp, a), dn(F, a), dn(F, b), dn(Tp, b)]) + poly([dn(F, a), dn(Bk, a), dn(Bk, b), dn(F, b)]);
      o += poly([Tp, F, Bk]);
      // frosting dripping over the front edge
      let d = `M${pt(Tp)}`;
      const n = 6;
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, tm = (t0 + t1) / 2;
        const at = (t) => [Tp[0] + (F[0] - Tp[0]) * t, Tp[1] + (F[1] - Tp[1]) * t];
        const m = at(tm), e = at(t1), dep = i % 2 ? 30 : 20;
        d += `Q${r1(m[0] - 12)} ${r1(m[1] + dep)} ${r1(m[0])} ${r1(m[1] + dep)}Q${r1(m[0] + 12)} ${r1(m[1] + dep)} ${r1(e[0])} ${r1(e[1] + 8)}`;
      }
      o += P(d + `L${pt(F)}Z`);
      o += P(`M${pt(F)}Q${r1(F[0] + 20)} ${r1(F[1] + 22)} ${r1(F[0] + 28)} ${r1(F[1] + 6)}Q${r1(F[0] + 40)} ${r1(F[1] + 30)} ${r1(F[0] + 50)} ${r1(F[1] - 6)}L${pt(Bk)}Z`);
      o += P('M-40 -45C-80 -45 -82 5 -40 25C2 5 0 -45 -40 -45Z') + P('M-62 -48L-40 -64L-18 -48L-40 -40Z');
      for (const [x, y] of [[-55, -25], [-25, -25], [-40, -8], [-56, 0], [-24, 0]]) o += E(x, y, 2.5, 4, T);
      o += candle(62, -60, 70, ctx);
      return o;
    }
    // tall three tier cake on a stand with bunting on top
    let o = P('M-40 160L40 160L70 200L-70 200Z') + E(0, 158, 170, 16);
    o += cakeLayer(0, 70, 150, 150, 22, false, ctx);
    for (let i = 0; i < 7; i++) o += C(-120 + i * 40, 112 + Math.sin((i / 6) * Math.PI) * 12, 9);
    o += cakeLayer(0, -10, 72, 112, 18, true, ctx);
    for (let i = 0; i < 4; i++) o += star(-66 + i * 44, 44 + Math.sin((i / 3) * Math.PI) * 8, 13, 6);
    o += cakeLayer(0, -80, -8, 76, 14, false, ctx);
    for (let i = 0; i < 4; i++) o += C(-48 + i * 32, -38 + Math.sin((i / 3) * Math.PI) * 6, 8, T);
    // bunting topper on two sticks
    o += line(-55, -84, -55, -170) + line(55, -84, 55, -170) + curve('M-55 -165Q0 -130 55 -165', T);
    for (const [x, y] of [[-32, -152], [0, -146], [32, -152]]) o += poly([[x - 13, y - 4], [x + 13, y - 4], [x, y + 20]]);
    for (const [x, y] of [[-55, -95], [55, -95]]) o += C(x, y - 82, 7);
    o += C(-20, -82, 12) + C(20, -84, 12) + C(0, -90, 12);
    return o;
  },
};

// ---------- diya lamp ----------
function diya(cx, yb, s, ctx, dots = true) {
  // a clay lamp with a pointed spout, s = 1 is about 360 wide
  let o = '';
  const X = (v) => r1(cx + v * s), Y = (v) => r1(yb + v * s);
  // rays around the flame
  for (const a of [-145, -117, -90, -63, -35]) {
    const p1 = pol(cx + 150 * s, yb - 262 * s, 66 * s, a), p2 = pol(cx + 150 * s, yb - 262 * s, 86 * s, a);
    o += line(p1[0], p1[1], p2[0], p2[1], ctx.thin);
  }
  o += P(`M${X(-60)} ${Y(-48)}L${X(60)} ${Y(-48)}L${X(78)} ${Y(0)}L${X(-78)} ${Y(0)}Z`);
  o += P(`M${X(-175)} ${Y(-160)}C${X(-170)} ${Y(-40)} ${X(80)} ${Y(-20)} ${X(185)} ${Y(-195)}Q${X(0)} ${Y(-112)} ${X(-175)} ${Y(-160)}Z`);
  o += P(`M${X(-175)} ${Y(-160)}Q${X(-20)} ${Y(-225)} ${X(185)} ${Y(-195)}Q${X(0)} ${Y(-112)} ${X(-175)} ${Y(-160)}Z`);
  o += P(`M${X(-140)} ${Y(-162)}Q${X(-20)} ${Y(-200)} ${X(130)} ${Y(-185)}Q${X(0)} ${Y(-140)} ${X(-140)} ${Y(-162)}Z`, ctx.thin);
  if (dots) {
    for (let i = 0; i < 7; i++) { const t = (i + 0.5) / 7; const x = -150 + 300 * t, y = -135 + Math.sin(t * Math.PI) * 70 - t * 30; o += C(cx + x * s, yb + y * s, 9 * s); }
  }
  o += line(cx + 160 * s, yb - 195 * s, cx + 152 * s, yb - 212 * s, ctx.thin);
  o += flame(cx + 150 * s, yb - 205 * s, 110 * s);
  return o;
}
function marigold(x, y, r) {
  let o = '';
  for (let i = 0; i < 10; i++) { const p = pol(x, y, r * 0.62, i * 36); o += C(p[0], p[1], r * 0.42); }
  return o + C(x, y, r * 0.5);
}
const diyaSub = {
  id: 'diya-lamp', name: 'Diya lamp', styles: 3, scenes: ['plain', 'hearts', 'stars', 'night', 'table', 'room'],
  draw(style, rand, ctx) {
    if (style === 0) return diya(-25, 200, 1.02, ctx);
    if (style === 1) {
      // three lamps in a row with marigolds in front
      let o = diya(-118, 150, 0.45, ctx) + diya(112, 150, 0.45, ctx);
      o += diya(0, 200, 0.55, ctx);
      for (const x of [-170, -120, 120, 170]) o += marigold(x, 182, 19);
      return o;
    }
    // a lamp on a flower pattern (rangoli) seen at a slant
    let o = '';
    const cy = 120, k = 0.42;
    const ep = (r, deg) => { const a = (deg * Math.PI) / 180; return [Math.cos(a) * r, cy + Math.sin(a) * r * k]; };
    for (let i = 0; i < 12; i++) { const a = i * 30 + 15; o += blob([ep(120, a - 13), ep(172, a - 11), ep(200, a), ep(172, a + 11), ep(120, a + 13)]); }
    for (let i = 0; i < 12; i++) { const a = i * 30; o += blob([ep(110, a - 11), ep(150, a - 9), ep(168, a), ep(150, a + 9), ep(110, a + 11)]); }
    o += E(0, cy, 132, 132 * k) + E(0, cy, 100, 100 * k, ctx.thin);
    for (let i = 0; i < 8; i++) { const p = ep(116, i * 45 + 22); o += C(p[0], p[1], 7, ctx.thin); }
    o += diya(0, 150, 0.6, ctx, true);
    return o;
  },
};

// ---------- paper lantern ----------
function roundLantern(cx, cy, rx, ry, ctx) {
  let o = R(cx - rx * 0.4, cy - ry - 16, rx * 0.8, 24, 5) + R(cx - rx * 0.4, cy + ry - 8, rx * 0.8, 24, 5);
  o += E(cx, cy, rx, ry) + E(cx, cy, rx * 0.66, ry) + E(cx, cy, rx * 0.3, ry);
  return o;
}
function tassel(cx, y, len) {
  return line(cx, y, cx, y + 14) + C(cx, y + 20, 8) + P(`M${cx - 8} ${y + 26}L${cx + 8} ${y + 26}L${cx + 16} ${y + len}L${cx - 16} ${y + len}Z`);
}
const lantern = {
  id: 'paper-lantern', name: 'Paper lantern', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'night', 'party', 'sky'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // one big round lantern
      let o = line(0, -205, 0, -150) + tassel(0, 132, 72);
      o += roundLantern(0, -10, 150, 128, ctx);
      o += curve('M-150 -10L150 -10', T);
      return o;
    }
    if (style === 1) {
      // three lanterns on a string
      let o = curve('M-205 -170Q0 -90 205 -170', T);
      const yS = (x) => -170 + 80 * (1 - (x / 205) ** 2);
      o += line(-120, yS(-120), -120, -48) + tassel(-120, 70, 52) + roundLantern(-120, 20, 62, 52, ctx);
      o += line(120, yS(120), 120, -48) + tassel(120, 70, 52) + roundLantern(120, 20, 62, 52, ctx);
      // middle: tall lantern
      o += line(0, yS(0), 0, -76) + tassel(0, 150, 56);
      o += R(-44, -76, 88, 18, 5) + R(-44, 140, 88, 18, 5) + P('M-44 -60Q-80 40 -44 142L44 142Q80 40 44 -60Z');
      for (let y = -30; y < 140; y += 34) o += curve(`M${r1(-44 - Math.sin(((y + 60) / 202) * Math.PI) * 26)} ${y}L${r1(44 + Math.sin(((y + 60) / 202) * Math.PI) * 26)} ${y}`, T);
      return o;
    }
    // star lantern with a ring and two ribbon tails
    let o = line(0, -205, 0, -190);
    const tail = (x, y, dir) => {
      const a = [], b = [];
      for (let i = 0; i <= 5; i++) { const yy = y + i * 19, xx = x + dir * i * 8 + Math.sin(i * 1.4) * 10; a.push([xx - 9, yy]); b.push([xx + 9, yy]); }
      return P(smoothPath(a) + 'L' + smoothPath(b.reverse()).slice(1) + 'Z');
    };
    o += tail(-45, 100, -1) + tail(45, 100, 1);
    o += C(0, -40, 152) + C(0, -40, 132);
    o += star(0, -40, 140, 58, 5) + star(0, -40, 78, 33, 5) + C(0, -40, 24);
    for (let i = 0; i < 5; i++) { const p = pol(0, -40, 142, -54 + i * 72); o += C(p[0], p[1], 9); }
    return o;
  },
};

// ---------- autumn leaves ----------
function mapleLeaf(cx, cy, s, ctx, a = 0) {
  // right half outline from tip to stem, mirrored
  const half = [[0, -170], [18, -118], [40, -132], [42, -88], [92, -128], [96, -96], [138, -104], [118, -58], [156, -42], [116, -8], [130, 22], [86, 22], [92, 52], [50, 34], [10, 70]];
  const pts = [...half, ...half.slice(0, -1).reverse().slice(0, -1).map(([x, y]) => [-x, y])];
  let full = [...half, ...half.slice().reverse().slice(1, -1).map(([x, y]) => [-x, y])];
  full = full.map(([x, y]) => [cx + x * s, cy + y * s]);
  let o = poly(full);
  const V = (x, y) => `${r1(cx + x * s)} ${r1(cy + y * s)}`;
  o += curve(`M${V(0, 120)}L${V(0, 60)}`) ;
  o += curve(`M${V(0, 60)}L${V(0, -140)}M${V(0, 30)}L${V(110, -80)}M${V(0, 30)}L${V(-110, -80)}M${V(0, 50)}L${V(100, 10)}M${V(0, 50)}L${V(-100, 10)}`, ctx.thin);
  return a ? g(o, rot(a, cx, cy)) : o;
}
function oakLeaf(cx, cy, s, ctx, a = 0) {
  const half = [[0, -150], [30, -140], [36, -110], [62, -100], [52, -70], [80, -52], [66, -20], [84, 6], [58, 30], [56, 62], [20, 80], [6, 90]];
  const full = [...half, ...half.slice().reverse().slice(1, -1).map(([x, y]) => [-x, y])].map(([x, y]) => [cx + x * s, cy + y * s]);
  let o = blob(full);
  const V = (x, y) => `${r1(cx + x * s)} ${r1(cy + y * s)}`;
  o += curve(`M${V(0, 135)}L${V(0, 88)}`);
  o += curve(`M${V(0, 88)}L${V(0, -130)}M${V(0, -60)}L${V(40, -88)}M${V(0, -60)}L${V(-40, -88)}M${V(0, 0)}L${V(50, -30)}M${V(0, 0)}L${V(-50, -30)}M${V(0, 50)}L${V(36, 30)}M${V(0, 50)}L${V(-36, 30)}`, ctx.thin);
  return a ? g(o, rot(a, cx, cy)) : o;
}
function ginkgo(cx, cy, s, ctx, a = 0) {
  const V = (x, y) => `${r1(cx + x * s)} ${r1(cy + y * s)}`;
  let o = curve(`M${V(0, 110)}L${V(0, 30)}`);
  o += P(`M${V(0, 30)}L${V(-110, -60)}Q${V(-60, -110)} ${V(-8, -82)}L${V(0, -50)}L${V(8, -82)}Q${V(60, -110)} ${V(110, -60)}Z`);
  o += curve(`M${V(0, 26)}L${V(-60, -70)}M${V(0, 26)}L${V(-30, -78)}M${V(0, 26)}L${V(30, -78)}M${V(0, 26)}L${V(60, -70)}`, ctx.hair);
  return a ? g(o, rot(a, cx, cy)) : o;
}
function acorn(x, y, s, a = 0) {
  const V = (vx, vy) => `${r1(x + vx * s)} ${r1(y + vy * s)}`;
  let o = P(`M${V(-34, 0)}C${V(-36, 40)} ${V(-10, 62)} ${V(0, 70)}C${V(10, 62)} ${V(36, 40)} ${V(34, 0)}Z`);
  o += P(`M${V(-42, 4)}C${V(-46, -30)} ${V(46, -30)} ${V(42, 4)}Z`) + R(x - 5 * s, y - 36 * s, 10 * s, 16 * s, 3);
  return a ? g(o, rot(a, x, y)) : o;
}
const leaves = {
  id: 'autumn-leaves', name: 'Autumn leaves', styles: 3, kind: 'float', scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'sky', 'hills'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) return mapleLeaf(0, 10, 1.2, ctx, rand.range(-12, 12));
    if (style === 1) {
      // three different leaves falling
      let o = mapleLeaf(-70, -90, 0.68, ctx, -25) + oakLeaf(95, 30, 0.78, ctx, 30) + ginkgo(-80, 120, 0.72, ctx, -15);
      o += curve('M30 -170q30 -10 50 10M10 -140q30 -10 50 10', T) + curve('M150 -110q20 6 30 26', T) + curve('M20 140q14 -20 40 -18', T);
      return o;
    }
    // oak twig with two acorns and hanging leaves
    let o = '';
    o += line(-151, -108, -151, -134) + line(151, -98, 151, -117);
    o += oakLeaf(-125, -10, 0.75, ctx, 165) + oakLeaf(125, 0, 0.75, ctx, 195);
    o += curve('M-180 -130Q0 -170 180 -110');
    o += curve('M-20 -144Q-14 -136 -20 -126M55 -140Q60 -124 55 -110');
    o += acorn(-20, -80, 1.35, 6) + acorn(55, -62, 1.35, -8);
    o += oakLeaf(0, 110, 0.45, ctx, 100);
    return g(o, 'translate(0 30)');
  },
};

// ---------- umbrella ----------
function canopy(cx, top, half, yb, n, ctx) {
  // panels between ribs from the tip to scallop points
  let o = '';
  const B = [];
  for (let i = 0; i <= n; i++) { const x = cx - half + (2 * half * i) / n; B.push([x, yb + 8 * (1 - ((x - cx) / half) ** 2) * 0]); }
  const ctl = (b) => [cx + (b[0] - cx) * 0.98, top + (yb - top) * 0.12 + Math.abs(b[0] - cx) / half * 0];
  for (let i = 0; i < n; i++) {
    const a = B[i], b = B[i + 1], c1 = ctl(a), c2 = ctl(b);
    o += P(`M${cx} ${top}Q${pt(c1)} ${pt(a)}Q${r1((a[0] + b[0]) / 2)} ${r1(yb - 26)} ${pt(b)}Q${pt(c2)} ${cx} ${top}Z`);
  }
  return o;
}
const hook = (x, y0) => P(`M${x - 8} ${y0}L${x + 8} ${y0}L${x + 8} 165A35 35 0 0 1 ${x - 62} 165L${x - 46} 165A19 19 0 0 0 ${x - 8} 165Z`);
const drop = (x, y, s = 1) => P(`M${r1(x)} ${r1(y - 18 * s)}Q${r1(x + 14 * s)} ${r1(y + 2 * s)} ${r1(x + 10 * s)} ${r1(y + 8 * s)}Q${r1(x)} ${r1(y + 18 * s)} ${r1(x - 10 * s)} ${r1(y + 8 * s)}Q${r1(x - 14 * s)} ${r1(y + 2 * s)} ${r1(x)} ${r1(y - 18 * s)}Z`);
const umbrella = {
  id: 'umbrella', name: 'Umbrella', styles: 3, scenes: ['plain', 'hearts', 'stars', 'rain', 'garden', 'road'],
  draw(style, rand, ctx) {
    const T = ctx.thin;
    if (style === 0) {
      // open umbrella with raindrops
      let o = '';
      for (const [x, y] of [[-150, -175], [-60, -190], [40, -185], [130, -170], [175, -110], [-185, -100]]) o += drop(x, y, 1);
      o += R(-8, -60, 16, 230) + hook(0, 130);
      o += line(0, -150, 0, -175) + C(0, -178, 6);
      o += canopy(0, -150, 190, -20, 6, ctx);
      return o;
    }
    if (style === 1) {
      // a child in a raincoat and boots holding an umbrella
      const hair = rand.int(0, 2);
      let o = '';
      o += P('M-58 140L-58 196L-4 196L-4 178L-20 178L-20 140Z') + P('M58 140L58 196L4 196L4 178L20 178L20 140Z');
      o += R(-62, 132, 46, 14, 4) + R(16, 132, 46, 14, 4);
      // raincoat
      o += P('M-50 -10L50 -10L85 142L-85 142Z');
      o += line(0, -6, 0, 140, T) + C(-14, 30, 6) + C(-14, 70, 6) + C(-14, 110, 6);
      o += R(32, 70, 34, 30, 6, T) + R(-66, 70, 34, 30, 6, T);
      // left arm down, right arm up to the handle
      o += P('M-48 -4Q-80 40 -78 90L-58 92Q-60 50 -36 10Z') + C(-68, 98, 14);
      // umbrella shaft
      o += R(56, -118, 12, 120);
      o += P('M40 -4Q64 -10 70 -32L82 -20Q76 4 46 16Z') + C(66, -28, 14);
      // head with hood
      o += P('M-58 -48Q-58 -110 0 -110Q58 -110 58 -48Q58 -6 0 -6Q-58 -6 -58 -48Z');
      o += C(0, -48, 40);
      if (hair === 0) o += P('M-40 -56Q-40 -88 0 -88Q40 -88 40 -56Q20 -66 0 -62Q-20 -66 -40 -56Z');
      else if (hair === 1) o += P('M-40 -54Q-40 -88 0 -88Q40 -88 40 -54Q30 -66 20 -58Q10 -70 0 -60Q-10 -70 -20 -58Q-30 -66 -40 -54Z');
      else o += P('M-40 -50Q-40 -88 0 -88Q40 -88 40 -60Q10 -60 -16 -74Q-26 -60 -40 -50Z');
      o += dotEye(-14, -46, 5.5) + dotEye(14, -46, 5.5) + smile(0, -30, 20) + C(-26, -32, 6, T) + C(26, -32, 6, T);
      // canopy above
      o += canopy(62, -200, 150, -118, 5, ctx);
      for (const [x, y] of [[-150, -80], [-170, 10], [170, -40], [150, 60], [-140, 100]]) o += drop(x, y, 0.9);
      return o;
    }
    // a frog sheltering under a small umbrella in a puddle
    let o = E(0, 182, 196, 22);
    o += curve('M-120 182q20 -8 40 0M60 186q20 -8 40 0', T);
    o += R(92, -70, 10, 205);
    o += canopy(58, -190, 140, -70, 5, ctx);
    for (const [x, y] of [[-180, -150], [-160, -40], [-120, -100], [-150, 50], [160, 10], [180, 70]]) o += drop(x, y, 0.85);
    // frog
    o += E(-62, 160, 40, 18) + E(62, 160, 40, 18);
    o += E(0, 110, 82, 64);
    o += E(0, 125, 48, 38, T);
    o += C(-44, 40, 26) + C(44, 40, 26) + eye(-44, 38, 16, [0.3, 0]) + eye(44, 38, 16, [0.3, 0]);
    o += smile(0, 76, 64, 0.3) + C(-48, 80, 8, T) + C(48, 80, 8, T);
    o += P('M60 120Q80 110 88 92L104 100Q96 124 66 136Z') + C(97, 90, 14);
    return o;
  },
};

export default [
  {
    id: 'toys', name: 'Toys and play', order: 44,
    scenes: ['plain', 'hearts', 'stars', 'room', 'party', 'meadow', 'garden'],
    pairScenes: ['room', 'party', 'meadow'],
    icon: 'teddy-bear', kind: 'ground',
    subjects: [teddy, ball, kite, robot, blocks, train, balloons, rockingHorse],
  },
  {
    id: 'seasons', name: 'Seasons and holidays', order: 46,
    scenes: ['plain', 'hearts', 'stars', 'snow', 'party', 'room', 'table', 'night', 'rain'],
    pairScenes: ['party', 'table', 'snow', 'night', 'meadow', 'garden', 'sky', 'rain'],
    icon: 'snowman', kind: 'ground',
    subjects: [snowman, winterTree, pumpkinSub, eggs, gift, cake, diyaSub, lantern, leaves, umbrella],
  },
];
