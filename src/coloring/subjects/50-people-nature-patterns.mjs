// People, Nature and weather, and Patterns and mandalas for the Yaanstep Sprouts coloring pages (SCRUM-515).
// Every shape here is drawn by this code.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring, cloud, sun, littleFlower, mirrorX, rng, makeCtx, r1 } from '../lib.mjs';

/* ------------------------------------------------------------------------------------------------
 * Shared helpers
 * ---------------------------------------------------------------------------------------------- */
const rad = (d) => (d * Math.PI) / 180;
const fmt = (p) => `${r1(p[0])} ${r1(p[1])}`;

/** Draw some inner svg scaled by k, keeping the line weight the same as everywhere else on the page. */
function scaled(ctx, k, tx, ty, fn) {
  const sub = makeCtx(ctx.s * k);
  return g(fn(sub), `translate(${r1(tx)} ${r1(ty)}) scale(${k})`, `stroke-width="${r1(6 / (ctx.s * k))}"`);
}

/** A thick rounded tube along a polyline (arms, legs, hoses, handles). */
function tube(pts, w, a = '') {
  const h = w / 2, n = pts.length;
  const nr = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], L = Math.hypot(dx, dy) || 1;
    nr.push([-dy / L, dx / L]);
  }
  const off = (i, sd) => {
    let nx, ny;
    if (i === 0) [nx, ny] = nr[0];
    else if (i === n - 1) [nx, ny] = nr[n - 2];
    else {
      nx = nr[i - 1][0] + nr[i][0]; ny = nr[i - 1][1] + nr[i][1];
      const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const k = 1 / Math.max(0.5, nx * nr[i][0] + ny * nr[i][1]);
      nx *= k; ny *= k;
    }
    return [pts[i][0] + sd * nx * h, pts[i][1] + sd * ny * h];
  };
  const L = pts.map((_, i) => off(i, 1)), Rr = pts.map((_, i) => off(i, -1)).reverse();
  return P(`M${fmt(L[0])}${L.slice(1).map((p) => `L${fmt(p)}`).join('')}A${r1(h)} ${r1(h)} 0 0 0 ${fmt(Rr[0])}${Rr.slice(1).map((p) => `L${fmt(p)}`).join('')}A${r1(h)} ${r1(h)} 0 0 0 ${fmt(L[0])}Z`, a);
}

/* ------------------------------------------------------------------------------------------------
 * PEOPLE
 * A front-view cartoon person with a big head. Skin, hair and clothes are all left white to color.
 * ---------------------------------------------------------------------------------------------- */

/** Connect points with outward bumps (curly hair, puffs). Travel clockwise for bumps that point out. */
function bumps(pts, k = 0.62, closed = true) {
  let d = `M${fmt(pts[0])}`;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const rr = Math.hypot(b[0] - a[0], b[1] - a[1]) * k;
    d += `A${r1(rr)} ${r1(rr)} 0 0 1 ${fmt(b)}`;
  }
  return d;
}
const arcPts = (cx, cy, rx, ry, a0, a1, n) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = rad(a0 + ((a1 - a0) * i) / n); out.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); }
  return out;
};

/** Points along a polyline at fractions t0..t1 of its length (for sleeve cuffs and stripes). */
function along(pts, t0, t1) {
  const seg = [];
  let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); tot += l; }
  const at = (t) => {
    let d = t * tot;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const f = Math.min(1, d / seg[i]); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
      d -= seg[i];
    }
  };
  const out = [at(t0)];
  let acc = 0;
  for (let i = 0; i < seg.length - 1; i++) { acc += seg[i]; if (acc / tot > t0 && acc / tot < t1) out.push(pts[i + 1]); }
  out.push(at(t1));
  return out;
}

function shoe(x, y, d, boot = false) {
  const X = (v) => r1(x + v * d), Y = (v) => r1(y + v);
  if (boot) return P(`M${X(-26)} ${Y(18)}L${X(32)} ${Y(18)}C${X(40)} ${Y(18)} ${X(38)} ${Y(-6)} ${X(18)} ${Y(-8)}L${X(20)} ${Y(-40)}L${X(-26)} ${Y(-40)}Z`) + curve(`M${X(-26)} ${Y(-28)}L${X(20)} ${Y(-28)}`);
  return P(`M${X(-26)} ${Y(18)}L${X(30)} ${Y(18)}C${X(40)} ${Y(18)} ${X(36)} ${Y(-8)} ${X(10)} ${Y(-10)}L${X(-18)} ${Y(-10)}C${X(-28)} ${Y(-10)} ${X(-28)} ${Y(6)} ${X(-26)} ${Y(18)}Z`);
}

/** The top outline of a head of hair, from the left side at height y1 over the top to the right side. */
const hairTop = (X, Y, y1, h = 1.2) => `M${r1(X(-1.05))} ${r1(Y(y1))}C${r1(X(-1.14))} ${r1(Y(-0.85))} ${r1(X(-0.55))} ${r1(Y(-h))} 0 ${r1(Y(-h))}C${r1(X(0.55))} ${r1(Y(-h))} ${r1(X(1.14))} ${r1(Y(-0.85))} ${r1(X(1.05))} ${r1(Y(y1))}`;

/** Hair drawn behind the head. */
function hairBack(st, HR, hy) {
  const X = (v) => v * HR, Y = (v) => hy + v * HR;
  switch (st) {
    case 'curly': return P(bumps(arcPts(0, Y(-0.06), X(1.16), X(1.12), 150, 390, 11)) + 'Z');
    case 'afro': return P(bumps(arcPts(0, Y(-0.18), X(1.36), X(1.3), 0, 360, 14).slice(0, 14)) + 'Z');
    case 'long': return P(hairTop(X, Y, 0) + `C${r1(X(1.15))} ${r1(Y(0.6))} ${r1(X(1.3))} ${r1(Y(1.2))} ${r1(X(1.2))} ${r1(Y(1.6))}Q${r1(X(0.6))} ${r1(Y(1.74))} 0 ${r1(Y(1.6))}Q${r1(X(-0.6))} ${r1(Y(1.74))} ${r1(X(-1.2))} ${r1(Y(1.6))}C${r1(X(-1.3))} ${r1(Y(1.2))} ${r1(X(-1.15))} ${r1(Y(0.6))} ${r1(X(-1.05))} ${r1(Y(0))}Z`);
    case 'bob': return P(hairTop(X, Y, 0) + `C${r1(X(1.15))} ${r1(Y(0.4))} ${r1(X(1.22))} ${r1(Y(0.8))} ${r1(X(1.0))} ${r1(Y(0.92))}L${r1(X(-1.0))} ${r1(Y(0.92))}C${r1(X(-1.22))} ${r1(Y(0.8))} ${r1(X(-1.15))} ${r1(Y(0.4))} ${r1(X(-1.05))} ${r1(Y(0))}Z`);
    case 'bun': case 'granny': return C(0, Y(-1.02), X(st === 'granny' ? 0.34 : 0.4)) + (st === 'granny' ? '' : '');
    case 'puffs': return P(bumps(arcPts(X(-0.86), Y(-0.86), X(0.5), X(0.5), 0, 360, 9).slice(0, 9)) + 'Z') + P(bumps(arcPts(X(0.86), Y(-0.86), X(0.5), X(0.5), 0, 360, 9).slice(0, 9)) + 'Z');
    case 'pony': return P(`M${r1(X(0.6))} ${r1(Y(-0.8))}C${r1(X(1.5))} ${r1(Y(-1.1))} ${r1(X(1.7))} ${r1(Y(-0.2))} ${r1(X(1.45))} ${r1(Y(0.55))}C${r1(X(1.35))} ${r1(Y(0.1))} ${r1(X(1.2))} ${r1(Y(-0.3))} ${r1(X(0.85))} ${r1(Y(-0.3))}Z`);
    case 'braids': {
      let s = '';
      for (const sd of [-1, 1]) {
        for (let i = 0; i < 4; i++) s += E(sd * X(1.0), Y(0.42 + i * 0.3), X(0.19), X(0.18));
        s += P(`M${r1(sd * X(1.0))} ${r1(Y(1.55))}l${r1(-X(0.16))} ${r1(X(0.28))}l${r1(X(0.32))} 0Z`);
        s += E(sd * X(1.0), Y(1.47), X(0.13), X(0.07));
      }
      return s;
    }
    default: return '';
  }
}

/** Hair drawn in front of the head (the fringe and the top). */
function hairFront(st, HR, hy, ctx) {
  const X = (v) => v * HR, Y = (v) => hy + v * HR;
  const cap = (fr, y1 = 0.15) => hairTop(X, Y, y1) + fr + 'Z';
  switch (st) {
    case 'short': return P(cap(`Q${r1(X(1.0))} ${r1(Y(-0.25))} ${r1(X(0.74))} ${r1(Y(-0.44))}Q${r1(X(0.62))} ${r1(Y(-0.2))} ${r1(X(0.42))} ${r1(Y(-0.24))}Q${r1(X(0.32))} ${r1(Y(-0.52))} ${r1(X(0.08))} ${r1(Y(-0.52))}Q${r1(X(-0.04))} ${r1(Y(-0.22))} ${r1(X(-0.3))} ${r1(Y(-0.26))}Q${r1(X(-0.46))} ${r1(Y(-0.54))} ${r1(X(-0.72))} ${r1(Y(-0.46))}Q${r1(X(-1.0))} ${r1(Y(-0.3))} ${r1(X(-1.05))} ${r1(Y(0.15))}`));
    case 'spiky': {
      const top = [];
      for (let i = 0; i <= 8; i++) { const t = rad(195 + i * 18.75); const rr = i % 2 ? 1.22 : 1.02; top.push([Math.cos(t) * X(rr), hy + Math.sin(t) * X(rr)]); }
      return P(`M${fmt(top[0])}` + top.slice(1).map((p) => `L${fmt(p)}`).join('') + `L${r1(X(0.95))} ${r1(Y(-0.2))}L${r1(X(0.6))} ${r1(Y(-0.42))}L${r1(X(0.3))} ${r1(Y(-0.3))}L0 ${r1(Y(-0.48))}L${r1(X(-0.3))} ${r1(Y(-0.32))}L${r1(X(-0.62))} ${r1(Y(-0.44))}L${r1(X(-0.95))} ${r1(Y(-0.2))}Z`);
    }
    case 'curly': case 'afro': {
      const top = arcPts(0, Y(0), X(1.06), X(1.06), 192, 348, 7);
      const fr = arcPts(0, Y(-0.3), X(0.92), X(0.22), -12, -168, 5).map(([x, y]) => [x, y + X(0.05)]);
      fr[0] = top[top.length - 1]; fr[fr.length - 1] = top[0];
      return P(bumps(top, 0.62, false) + bumps(fr, 0.6, false).replace(/^M[^A]+/, '') + 'Z');
    }
    case 'long': case 'braids': case 'pony': case 'bob':
      return P(cap(`Q${r1(X(0.98))} ${r1(Y(-0.6))} ${r1(X(0.28))} ${r1(Y(-0.95))}Q${r1(X(0.0))} ${r1(Y(-0.36))} ${r1(X(-0.92))} ${r1(Y(-0.18))}Q${r1(X(-1.04))} ${r1(Y(0.0))} ${r1(X(-1.05))} ${r1(Y(0.25))}`, 0.25)) + (st === 'pony' ? E(X(0.9), Y(-0.62), X(0.1), X(0.15)) : '');
    case 'granny': {
      const hl = arcPts(0, Y(0.2), X(1.05), X(0.78), -2, -178, 6);
      return P(hairTop(X, Y, 0.18) + bumps(hl, 0.62, false).replace(/^M[^A]+/, '') + 'Z');
    }
    case 'bun': case 'puffs':
      return P(cap(`Q${r1(X(0.92))} ${r1(Y(-0.55))} 0 ${r1(Y(-0.62))}Q${r1(X(-0.92))} ${r1(Y(-0.55))} ${r1(X(-1.05))} ${r1(Y(0.1))}`, 0.1)) + curve(`M${r1(X(-0.45))} ${r1(Y(-0.92))}Q0 ${r1(Y(-0.78))} ${r1(X(0.45))} ${r1(Y(-0.92))}`, ctx.thin);
    case 'bald':
      return P(bumps(arcPts(X(-0.98), Y(-0.05), X(0.2), X(0.34), 110, 250, 3), 0.6, false) + 'Z') + P(bumps(arcPts(X(0.98), Y(-0.05), X(0.2), X(0.34), -70, 70, 3), 0.6, false) + 'Z');
    default: return '';
  }
}

/** Face: eyes, brows, cheeks, nose, mouth. */
function face(HR, hy, ctx, o = {}) {
  const X = (v) => v * HR, Y = (v) => hy + v * HR;
  let s = '';
  if (o.glasses) s += C(X(-0.36), Y(0.04), X(0.22)) + C(X(0.36), Y(0.04), X(0.22)) + curve(`M${r1(X(-0.14))} ${r1(Y(0.02))}Q0 ${r1(Y(-0.06))} ${r1(X(0.14))} ${r1(Y(0.02))}`, ctx.thin);
  if (o.closed) s += curve(`M${r1(X(-0.48))} ${r1(Y(0.06))}Q${r1(X(-0.36))} ${r1(Y(-0.06))} ${r1(X(-0.24))} ${r1(Y(0.06))}M${r1(X(0.24))} ${r1(Y(0.06))}Q${r1(X(0.36))} ${r1(Y(-0.06))} ${r1(X(0.48))} ${r1(Y(0.06))}`);
  else s += dotEye(X(-0.36), Y(0.05), X(0.11)) + dotEye(X(0.36), Y(0.05), X(0.11));
  s += curve(`M${r1(X(-0.5))} ${r1(Y(-0.22))}Q${r1(X(-0.36))} ${r1(Y(-0.3))} ${r1(X(-0.22))} ${r1(Y(-0.22))}M${r1(X(0.22))} ${r1(Y(-0.22))}Q${r1(X(0.36))} ${r1(Y(-0.3))} ${r1(X(0.5))} ${r1(Y(-0.22))}`, ctx.thin);
  if (!o.noCheeks) s += C(X(-0.6), Y(0.34), X(0.13), ctx.thin) + C(X(0.6), Y(0.34), X(0.13), ctx.thin);
  s += curve(`M${r1(X(-0.04))} ${r1(Y(0.2))}Q${r1(X(0.06))} ${r1(Y(0.26))} ${r1(X(-0.02))} ${r1(Y(0.3))}`, ctx.thin);
  if (o.mouth === 'grin') s += curve(`M${r1(X(-0.24))} ${r1(Y(0.42))}Q0 ${r1(Y(0.62))} ${r1(X(0.24))} ${r1(Y(0.42))}`);
  else if (o.mouth === 'oh') s += E(0, Y(0.5), X(0.1), X(0.13));
  else s += P(`M${r1(X(-0.24))} ${r1(Y(0.4))}Q0 ${r1(Y(0.76))} ${r1(X(0.24))} ${r1(Y(0.4))}Q0 ${r1(Y(0.46))} ${r1(X(-0.24))} ${r1(Y(0.4))}Z`);
  return s;
}

/** Hats. */
function hat(kind, HR, hy, ctx) {
  const X = (v) => v * HR, Y = (v) => hy + v * HR;
  switch (kind) {
    case 'helmet':
      return P(`M${r1(X(-1.5))} ${r1(Y(-0.2))}Q0 ${r1(Y(-0.02))} ${r1(X(1.5))} ${r1(Y(-0.2))}Q${r1(X(1.4))} ${r1(Y(-0.42))} ${r1(X(1.0))} ${r1(Y(-0.42))}L${r1(X(-1.0))} ${r1(Y(-0.42))}Q${r1(X(-1.4))} ${r1(Y(-0.42))} ${r1(X(-1.5))} ${r1(Y(-0.2))}Z`) +
        P(`M${r1(X(-1.0))} ${r1(Y(-0.36))}C${r1(X(-1.0))} ${r1(Y(-1.42))} ${r1(X(1.0))} ${r1(Y(-1.42))} ${r1(X(1.0))} ${r1(Y(-0.36))}Z`) +
        curve(`M0 ${r1(Y(-1.15))}L0 ${r1(Y(-0.4))}`, ctx.thin) +
        P(`M${r1(X(-0.26))} ${r1(Y(-0.95))}L${r1(X(0.26))} ${r1(Y(-0.95))}L${r1(X(0.26))} ${r1(Y(-0.55))}Q0 ${r1(Y(-0.38))} ${r1(X(-0.26))} ${r1(Y(-0.55))}Z`) + star(0, Y(-0.74), X(0.13), X(0.06), 5);
    case 'toque':
      return P(bumps([[X(-0.78), Y(-0.72)], [X(-1.0), Y(-1.3)], [X(-0.55), Y(-1.78)], [X(0), Y(-1.9)], [X(0.55), Y(-1.78)], [X(1.0), Y(-1.3)], [X(0.78), Y(-0.72)]], 0.62, false) + 'Z') +
        R(X(-0.84), Y(-0.86), X(1.68), X(0.4), X(0.08)) + curve(`M${r1(X(-0.3))} ${r1(Y(-0.95))}L${r1(X(-0.36))} ${r1(Y(-1.4))}M${r1(X(0.3))} ${r1(Y(-0.95))}L${r1(X(0.36))} ${r1(Y(-1.4))}`, ctx.thin);
    case 'straw':
      return P(`M${r1(X(-0.76))} ${r1(Y(-0.5))}C${r1(X(-0.8))} ${r1(Y(-1.42))} ${r1(X(0.8))} ${r1(Y(-1.42))} ${r1(X(0.76))} ${r1(Y(-0.5))}Z`) +
        E(0, Y(-0.5), X(1.6), X(0.26)) + P(`M${r1(X(-0.78))} ${r1(Y(-0.56))}Q0 ${r1(Y(-0.46))} ${r1(X(0.78))} ${r1(Y(-0.56))}L${r1(X(0.78))} ${r1(Y(-0.76))}Q0 ${r1(Y(-0.66))} ${r1(X(-0.78))} ${r1(Y(-0.76))}Z`) +
        curve(`M${r1(X(-1.2))} ${r1(Y(-0.5))}L${r1(X(-1.0))} ${r1(Y(-0.42))}M${r1(X(1.2))} ${r1(Y(-0.5))}L${r1(X(1.0))} ${r1(Y(-0.42))}`, ctx.thin);
    case 'beret':
      return P(`M${r1(X(-1.12))} ${r1(Y(-0.36))}C${r1(X(-1.3))} ${r1(Y(-1.2))} ${r1(X(0.9))} ${r1(Y(-1.4))} ${r1(X(1.08))} ${r1(Y(-0.5))}Q${r1(X(0.2))} ${r1(Y(-0.66))} ${r1(X(-1.12))} ${r1(Y(-0.36))}Z`) + curve(`M${r1(X(0.05))} ${r1(Y(-1.1))}L${r1(X(0.12))} ${r1(Y(-1.3))}`);
    case 'cap':
      return P(`M${r1(X(-1.0))} ${r1(Y(-0.3))}C${r1(X(-1.0))} ${r1(Y(-1.32))} ${r1(X(1.0))} ${r1(Y(-1.32))} ${r1(X(1.0))} ${r1(Y(-0.3))}Z`) + P(`M${r1(X(-0.2))} ${r1(Y(-0.36))}Q${r1(X(0.9))} ${r1(Y(-0.5))} ${r1(X(1.5))} ${r1(Y(-0.24))}Q${r1(X(0.9))} ${r1(Y(-0.14))} ${r1(X(-0.2))} ${r1(Y(-0.3))}Z`) + C(0, Y(-1.06), X(0.08));
    case 'bonnet':
      return P(`M${r1(X(-1.08))} ${r1(Y(0.42))}C${r1(X(-1.25))} ${r1(Y(-1.3))} ${r1(X(1.25))} ${r1(Y(-1.3))} ${r1(X(1.08))} ${r1(Y(0.42))}Q${r1(X(0.9))} ${r1(Y(-0.5))} 0 ${r1(Y(-0.56))}Q${r1(X(-0.9))} ${r1(Y(-0.5))} ${r1(X(-1.08))} ${r1(Y(0.42))}Z`) +
        curve(`M${r1(X(-1.04))} ${r1(Y(0.42))}Q${r1(X(-0.7))} ${r1(Y(0.9))} ${r1(X(-0.4))} ${r1(Y(0.9))}M${r1(X(1.04))} ${r1(Y(0.42))}Q${r1(X(0.7))} ${r1(Y(0.9))} ${r1(X(0.4))} ${r1(Y(0.9))}`, ctx.thin);
    default: return '';
  }
}

/** Shapes for the hijab: a big wrap behind, then the face oval in front. */
function scarfBack(HR, hy) {
  const X = (v) => v * HR, Y = (v) => hy + v * HR;
  return blob([[0, Y(-1.16)], [X(0.95), Y(-0.85)], [X(1.2), Y(0.1)], [X(1.2), Y(0.9)], [X(1.45), Y(1.5)], [X(0.4), Y(1.72)], [X(-0.4), Y(1.72)], [X(-1.45), Y(1.5)], [X(-1.2), Y(0.9)], [X(-1.2), Y(0.1)], [X(-0.95), Y(-0.85)]]);
}

const ADULT = { R: 66, hy: -130, y0: -70, hip: 74, sw: 64, hw: 56, aw: 30, lw: 46, hand: 16, k: 1 };
const KID = { R: 78, hy: -108, y0: -34, hip: 86, sw: 56, hw: 52, aw: 28, lw: 42, hand: 15, k: 0.86 };

/** Arm poses as offsets from the shoulder for the viewer's left arm: [elbow, hand]. */
const POSE = {
  down: [[-26, 56], [-34, 110]],
  hip: [[-46, 50], [-8, 92]],
  wave: [[-40, -40], [-48, -104]],
  up: [[-30, -56], [-34, -116]],
  out: [[-52, -6], [-106, -22]],
  chest: [[-18, 56], [26, 50]],
  hold: [[-24, 56], [8, 86]],
  low: [[-18, 60], [12, 104]],
};
const armFrom = (F, side, p) => {
  const sx = side * (F.sw - 16), sy = F.y0 + 22;
  if (typeof p !== 'string') return [[sx, sy], ...p];
  return [[sx, sy], ...POSE[p].map(([dx, dy]) => [sx + (side < 0 ? dx : -dx) * F.k, sy + dy * F.k])];
};
/** Round the corners of a polyline so elbows and knees bend smoothly. */
function roundPts(pts, rr = 16) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const ra = Math.min(rr, la * 0.45), rc = Math.min(rr, lc * 0.45);
    const p0 = [b[0] + ((a[0] - b[0]) * ra) / la, b[1] + ((a[1] - b[1]) * ra) / la], p2 = [b[0] + ((c[0] - b[0]) * rc) / lc, b[1] + ((c[1] - b[1]) * rc) / lc];
    for (let t = 0; t <= 1.001; t += 0.25) out.push([(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * b[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * b[1] + t * t * p2[1]]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
/**
 * One person. o: { F (ADULT/KID), hair, top, bottom, armL, armR (pose name or [[elbow],[hand]] in final coords),
 * sleeve: 'long'|'short', legs: 'stand'|'apart'|'run'|'kick'|'jump', hat, glasses, mouth, closed, boots,
 * back, mid, front: extra svg, overL/overR: draw that arm after `mid`. }
 */
function person(o, ctx) {
  const F = o.F || ADULT;
  const { R: HR, hy, y0, hip, sw, hw, aw, lw } = F;
  let s = o.back || '';
  if (o.hair === 'scarf') s += scarfBack(HR, hy);
  else s += hairBack(o.hair, HR, hy);
  // legs
  const legSets = {
    stand: [[[-24, hip - 14], [-26, 172]], [[24, hip - 14], [26, 172]]],
    apart: [[[-22, hip - 14], [-44, 172]], [[22, hip - 14], [44, 172]]],
    run: [[[-20, hip - 14], [-50, hip + 50], [-46, 182]], [[20, hip - 14], [44, hip + 46], [84, hip + 64]]],
    kick: [[[-22, hip - 14], [-30, 182]], [[22, hip - 14], [60, hip + 40], [96, hip + 66]]],
    jump: [[[-22, hip - 14], [-44, hip + 44], [-34, 164]], [[22, hip - 14], [44, hip + 44], [34, 164]]],
    sit: [[[-26, hip - 6], [-30, hip + 26], [-32, 182]], [[26, hip - 6], [30, hip + 26], [32, 182]]],
  };
  const legs = legSets[o.legs || 'stand'].map((L) => roundPts(L, 20));
  const feet = legs.map((L, i) => {
    const a = [...L[L.length - 1]], b = L[L.length - 2];
    if (a[1] === 172) a[1] = 182;
    const d = i === 0 ? -1 : 1;
    const dx = a[0] - b[0];
    return { x: a[0], y: a[1], d: Math.abs(dx) > 30 ? Math.sign(dx) : d };
  });
  const bottom = o.bottom || 'pants';
  let legSvg = '';
  legs.forEach((L) => {
    if (bottom === 'pants') legSvg += tube(L, lw);
    else {
      legSvg += tube(L, lw * 0.62);
      if (bottom === 'shorts') legSvg += tube(along(L, 0, 0.42), lw + 2);
    }
    if (o.legStripe) legSvg += tube(along(L, 0.7, 0.8), lw + 3);
  });
  legSvg += feet.map((f) => shoe(f.x, f.y, f.d, o.boots)).join('');
  s += legSvg;
  // body (arms that hang beside the body are drawn behind it)
  const top = o.top || 'tee';
  s += '@@ARMS_BEHIND@@';
  const torso = (y1, extra = 0) => P(`M${-sw + 18} ${y0}Q${-sw} ${y0} ${-sw} ${y0 + 24}Q${-sw - 2} ${(y0 + y1) / 2} ${-hw - extra} ${y1 - 10}Q${-hw - extra} ${y1} ${-hw - extra + 10} ${y1}L${hw + extra - 10} ${y1}Q${hw + extra} ${y1} ${hw + extra} ${y1 - 10}Q${sw + 2} ${(y0 + y1) / 2} ${sw} ${y0 + 24}Q${sw} ${y0} ${sw - 18} ${y0}Z`);
  if (top === 'dress') {
    const hem = hip + 46, wa = (y0 + hip) / 2 + 10;
    s += P(`M${-sw + 18} ${y0}Q${-sw} ${y0} ${-sw} ${y0 + 24}L${-hw + 6} ${wa}L${-hw - 36} ${hem}Q0 ${hem + 14} ${hw + 36} ${hem}L${hw - 6} ${wa}L${sw} ${y0 + 24}Q${sw} ${y0} ${sw - 18} ${y0}Z`);
    s += curve(`M${-hw + 6} ${wa}Q0 ${wa + 8} ${hw - 6} ${wa}`, ctx.thin) + curve(`M-16 ${y0}Q0 ${y0 + 16} 16 ${y0}`, ctx.thin);
    if (o.pattern === 'dots') for (const [x, y] of [[-30, hem - 26], [0, hem - 12], [30, hem - 26], [-14, wa + 26], [16, wa + 26]]) s += C(x, y, 7, ctx.thin);
  } else if (top === 'coat') {
    s += torso(hip + 64, 12) + poly([[-20, y0], [20, y0], [0, y0 + 64]]);
    s += poly([[-20, y0], [-8, y0 + 64], [-34, y0 + 30], [-26, y0 + 6]]) + poly([[20, y0], [8, y0 + 64], [34, y0 + 30], [26, y0 + 6]]);
    s += curve(`M0 ${y0 + 64}L0 ${hip + 64}`) + R(-hw + 2, hip - 6, 30, 30, 4) + R(hw - 32, hip - 6, 30, 30, 4) + R(-hw + 8, y0 + 46, 22, 26, 3);
    s += R(-hw + 12, y0 + 34, 6, 18, 3, ctx.thin);
  } else if (top === 'fire') {
    s += torso(hip + 16, 4) + R(-hw - 3, y0 + 64, 2 * hw + 6, 18) + R(-hw - 3, hip - 18, 2 * hw + 6, 18) + curve(`M0 ${y0 + 4}L0 ${hip + 16}`, ctx.thin);
    s += poly([[-24, y0 - 2], [0, y0 + 14], [24, y0 - 2], [20, y0 - 14], [-20, y0 - 14]]);
  } else if (top === 'chef') {
    s += torso(hip + 8, 4);
    s += P(`M${-hw + 10} ${y0 + 54}L${hw - 10} ${y0 + 54}L${hw + 2} ${hip + 70}Q0 ${hip + 78} ${-hw - 2} ${hip + 70}Z`);
    s += curve(`M${-hw + 10} ${y0 + 54}L${-sw + 10} ${y0 + 8}M${hw - 10} ${y0 + 54}L${sw - 10} ${y0 + 8}`, ctx.thin);
    s += R(-22, hip + 10, 44, 30, 5, ctx.thin);
    for (const yy of [y0 + 22, y0 + 40]) s += C(-14, yy, 5, ctx.thin) + C(14, yy, 5, ctx.thin);
    s += poly([[-22, y0 - 4], [22, y0 - 4], [0, y0 + 20]]) + P(`M-6 ${y0 + 12}L6 ${y0 + 12}L10 ${y0 + 34}L0 ${y0 + 40}L-10 ${y0 + 34}Z`);
  } else if (top === 'smock') {
    s += P(`M${-sw + 18} ${y0}Q${-sw} ${y0} ${-sw} ${y0 + 24}L${-hw - 18} ${hip + 34}Q0 ${hip + 44} ${hw + 18} ${hip + 34}L${sw} ${y0 + 24}Q${sw} ${y0} ${sw - 18} ${y0}Z`);
    s += P(`M-24 ${y0}Q0 ${y0 + 26} 24 ${y0}Q0 ${y0 + 8} -24 ${y0}Z`) + R(-34, hip - 18, 68, 36, 6);
    s += blob([[-30, y0 + 46], [-18, y0 + 40], [-14, y0 + 54], [-26, y0 + 60]]) + C(26, y0 + 70, 8) + blob([[12, hip + 22], [22, hip + 24], [20, hip + 32], [10, hip + 30]], ctx.thin);
  } else if (top === 'cardigan') {
    s += torso(hip + 14, 4) + poly([[-18, y0], [18, y0], [0, y0 + 46]]) + curve(`M-18 ${y0}L-4 ${hip + 14}M18 ${y0}L4 ${hip + 14}`);
    s += C(-12, y0 + 64, 4, ctx.thin) + C(-10, y0 + 92, 4, ctx.thin) + R(-hw + 6, hip - 18, 26, 24, 4) + R(hw - 32, hip - 18, 26, 24, 4);
  } else if (top === 'overalls') {
    s += torso(hip, 0);
    s += P(`M${-hw} ${hip - 34}L${hw} ${hip - 34}L${hw + 2} ${hip + 4}L${-hw - 2} ${hip + 4}Z`) + R(-34, y0 + 30, 68, hip - y0 - 56, 4);
    s += P(`M${-sw + 14} ${y0 + 4}L${-sw + 26} ${y0}L-24 ${y0 + 34}L-34 ${y0 + 34}Z`) + P(`M${sw - 14} ${y0 + 4}L${sw - 26} ${y0}L24 ${y0 + 34}L34 ${y0 + 34}Z`);
    s += C(-26, y0 + 40, 5) + C(26, y0 + 40, 5) + R(-18, y0 + 52, 36, 26, 4, ctx.thin);
  } else if (top === 'stripes' || top === 'tee' || top === 'sweater' || top === 'long') {
    s += torso(hip + 6, 2);
    s += curve(`M-18 ${y0}Q0 ${y0 + 18} 18 ${y0}`, ctx.thin);
    if (top === 'stripes') { const h = (hip + 6 - y0) / 4; s += R(-hw - 1, y0 + h * 1.4, 2 * hw + 2, h * 0.75, 0, '') + R(-hw - 2, y0 + h * 2.8, 2 * hw + 4, h * 0.75, 0, ''); }
    if (top === 'sweater') s += R(-hw - 4, hip - 12, 2 * hw + 8, 18, 6);
    if (o.emblem) s += o.emblem;
  }
  // arms
  const arm = (side) => {
    const p = side < 0 ? o.armL : o.armR;
    const pts = roundPts(armFrom(F, side, p || 'down'), 18);
    let a = '';
    const long = o.sleeve === 'long' || ['coat', 'fire', 'chef', 'cardigan', 'sweater', 'smock', 'long'].includes(top);
    if (long) {
      a += tube(pts, aw + 4);
      if (['fire', 'sweater', 'cardigan', 'chef'].includes(top)) a += tube(along(pts, top === 'fire' ? 0.55 : 0.84, top === 'fire' ? 0.68 : 0.96), aw + 7);
    } else {
      a += tube(pts, aw - 2) + tube(along(pts, 0, 0.36), aw + 6);
    }
    const h = pts[pts.length - 1];
    a += o.mitts ? R(h[0] - 16, h[1] - 16, 32, 32, 12) : C(h[0], h[1], F.hand);
    const behind = side < 0 ? o.backL : o.backR;
    const isBehind = behind ?? (Math.abs(h[0]) >= hw - 6 || h[1] < y0 + 10);
    return { svg: a, behind: isBehind };
  };
  const AL = arm(-1), AR = arm(1);
  s = s.replace('@@ARMS_BEHIND@@', (AL.behind ? AL.svg : '') + (AR.behind ? AR.svg : ''));
  if (!AL.behind && !o.overL) s += AL.svg;
  if (!AR.behind && !o.overR) s += AR.svg;
  s += o.mid || '';
  if (!AL.behind && o.overL) s += AL.svg;
  if (!AR.behind && o.overR) s += AR.svg;
  // head
  if (o.hair === 'scarf') {
    s += E(0, hy + HR * 0.06, HR * 0.84, HR * 0.9) + curve(`M${r1(-HR * 0.84)} ${r1(hy - HR * 0.1)}Q0 ${r1(hy - HR * 1.12)} ${r1(HR * 0.84)} ${r1(hy - HR * 0.1)}`, ctx.thin);
  } else {
    if (!o.noEars) s += C(-HR * 0.98, hy + HR * 0.08, HR * 0.2) + C(HR * 0.98, hy + HR * 0.08, HR * 0.2);
    s += C(0, hy, HR);
    s += hairFront(o.hair, HR, hy, ctx);
  }
  s += face(HR, hy, ctx, o);
  if (o.hat) s += hat(o.hat, HR, hy, ctx);
  s += o.front || '';
  return s;
}

/* ---- People props ---- */
function beachBall(cx, cy, r, ctx) {
  return C(cx, cy, r) + curve(`M${r1(cx)} ${r1(cy - r)}Q${r1(cx - r * 0.95)} ${r1(cy)} ${r1(cx)} ${r1(cy + r)}M${r1(cx)} ${r1(cy - r)}Q${r1(cx + r * 0.95)} ${r1(cy)} ${r1(cx)} ${r1(cy + r)}`) + C(cx, cy - r * 0.72, r * 0.16);
}
const motion = (x, y, dir, ctx) => curve(`M${r1(x)} ${r1(y)}q${r1(dir * 14)} -8 ${r1(dir * 28)} 0M${r1(x + dir * 6)} ${r1(y + 14)}q${r1(dir * 14)} -8 ${r1(dir * 28)} 0`, ctx.thin);
const bow = (x, y, s = 1) => P(`M${r1(x)} ${r1(y)}l${r1(-14 * s)} ${r1(-10 * s)}l0 ${r1(20 * s)}Z`) + P(`M${r1(x)} ${r1(y)}l${r1(14 * s)} ${r1(-10 * s)}l0 ${r1(20 * s)}Z`) + C(x, y, 4 * s);
const note = (x, y, two = false) => (two
  ? E(x, y, 9, 7, 'transform="rotate(-20 ' + x + ' ' + y + ')"') + E(x + 30, y - 6, 9, 7, 'transform="rotate(-20 ' + (x + 30) + ' ' + (y - 6) + ')"') + P(`M${x + 8} ${y - 2}L${x + 8} ${y - 46}L${x + 38} ${y - 52}L${x + 38} ${y - 8}`, 'fill="none"') + P(`M${x + 8} ${y - 46}L${x + 38} ${y - 52}L${x + 38} ${y - 42}L${x + 8} ${y - 36}Z`)
  : E(x, y, 10, 8, 'transform="rotate(-20 ' + x + ' ' + y + ')"') + P(`M${x + 9} ${y - 2}L${x + 9} ${y - 44}Q${x + 22} ${y - 34} ${x + 26} ${y - 22}`, 'fill="none"'));

function teddy(x, y, s, ctx, sad = false) {
  return g(C(-30, -46, 14) + C(30, -46, 14) + E(0, 30, 40, 42) + E(-38, 60, 14, 12) + E(38, 60, 14, 12) + C(0, -20, 40) + E(0, -8, 16, 12) + dark(E(0, -13, 6, 4)) + dotEye(-14, -28, 5) + dotEye(14, -28, 5) + E(0, 34, 20, 22, ctx.thin) + E(-40, 10, 12, 18) + E(40, 10, 12, 18), `translate(${x} ${y}) scale(${s})`);
}
function block(x, y, w, ctx, mark) {
  const d = w * 0.3;
  let s = R(x, y, w, w, 4) + poly([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]]) + poly([[x + w, y], [x + w + d, y - d], [x + w + d, y + w - d], [x + w, y + w]]);
  if (mark === 'star') s += star(x + w / 2, y + w / 2, w * 0.3, w * 0.14);
  else if (mark === 'heart') s += heart(x + w / 2, y + w / 2 + 2, w * 0.55);
  else s += C(x + w / 2, y + w / 2, w * 0.24);
  return s;
}
function flowerHead(x, y, r, n = 6) {
  let s = '';
  for (let i = 0; i < n; i++) { const t = rad((i * 360) / n); s += C(x + Math.cos(t) * r, y + Math.sin(t) * r, r * 0.75); }
  return s + C(x, y, r * 0.7);
}
function kitten(x, y, ctx) {
  return g(P('M30 20Q70 10 62 -20Q58 -30 52 -18Q54 4 26 8Z') + E(0, 18, 40, 30) + poly([[-34, -30], [-30, -68], [-6, -44]]) + poly([[34, -30], [30, -68], [6, -44]]) + E(0, -26, 38, 32) +
    dotEye(-14, -28, 5) + dotEye(14, -28, 5) + P('M-5 -16L5 -16L0 -11Z') + curve('M0 -11Q-4 -4 -10 -6M0 -11Q4 -4 10 -6', ctx.thin) + curve('M-20 -16L-44 -20M-20 -10L-44 -6M20 -16L44 -20M20 -10L44 -6', ctx.thin), `translate(${x} ${y})`);
}
function hen(x, y, ctx) {
  let h = P('M44 -6Q60 -60 40 -78Q74 -66 76 -30Q96 -50 92 -16Q86 18 52 22Z');
  h += E(0, 6, 60, 44);
  h += P('M-62 -70Q-70 -96 -52 -92Q-48 -114 -34 -98Q-24 -114 -14 -90Q-4 -86 -16 -70Z');
  h += C(-40, -46, 30);
  h += poly([[-68, -50], [-92, -42], [-68, -34]]) + P('M-66 -32Q-72 -12 -60 -12Q-54 -18 -58 -32Z');
  h += dotEye(-46, -52, 5);
  h += P('M-12 -2Q18 -26 46 -2Q30 28 -6 22Z') + curve('M4 4Q20 -2 34 6M2 14Q18 10 30 16', ctx.thin);
  return g(h, `translate(${x} ${y})`);
}
function basket(x, y0, ctx) {
  let s = '';
  let y = y0 - 24;
  s += P(`M${x - 70} ${y - 10}Q${x - 50} ${y - 70} ${x - 14} ${y - 30}Z`) + P(`M${x - 50} ${y - 20}L${x - 64} ${y - 60}L${x - 40} ${y - 26}Z`, ctx.thin);
  s += C(x - 30, y - 26, 30) + curve(`M${x - 40} ${y - 46}Q${x - 30} ${y - 54} ${x - 22} ${y - 46}`, ctx.thin);
  s += P(`M${x + 6} ${y - 18}L${x + 52} ${y - 92}L${x + 34} ${y - 14}Z`) + curve(`M${x + 44} ${y - 82}l-8 -22M${x + 46} ${y - 84}l6 -20M${x + 48} ${y - 80}l14 -14`) + curve(`M${x + 30} ${y - 40}l10 4M${x + 24} ${y - 28}l10 4`, ctx.thin);
  s += C(x + 48, y - 18, 28) + curve(`M${x + 44} ${y - 40}Q${x + 50} ${y - 46} ${x + 58} ${y - 40}`, ctx.thin);
  y = y0;
  s += P(`M${x - 84} ${y - 14}L${x + 84} ${y - 14}L${x + 66} ${y + 54}Q${x} ${y + 64} ${x - 66} ${y + 54}Z`) + R(x - 90, y - 24, 180, 20, 8);
  s += curve(`M${x - 76} ${y + 12}Q${x} ${y + 22} ${x + 76} ${y + 12}M${x - 70} ${y + 36}Q${x} ${y + 46} ${x + 70} ${y + 36}`, ctx.thin);
  return s;
}

/* ---- People subjects ---- */
const childPlaying = {
  id: 'child-playing', name: 'Child playing', styles: 4,
  draw(st, rand, ctx) {
    const F = KID;
    if (st === 0) {
      return person({ F, hair: 'short', top: 'stripes', bottom: 'shorts', legs: 'kick', armL: 'out', armR: [[72, 28], [104, 50]], front: beachBall(156, 154, 42, ctx) + motion(112, 104, 1, ctx) }, ctx);
    }
    if (st === 1) {
      const hL = [-112, 56], hR = [112, 56];
      const handles = R(hL[0] - 10, hL[1] - 4, 20, 50, 10) + R(hR[0] - 10, hR[1] - 4, 20, 50, 10);
      return person({ F, hair: 'braids', top: 'dress', pattern: 'dots', bottom: 'none', legs: 'jump', armL: [[-76, 28], hL], armR: [[76, 28], hR], backL: false, backR: false, back: curve('M-112 104C-128 232 128 232 112 104'), mid: handles, overL: true, overR: true, front: motion(-150, 150, -1, ctx) + motion(150, 150, 1, ctx) }, ctx);
    }
    if (st === 2) {
      const cy = 70;
      const ring = (ro, ri, half) => (half
        ? P(`M${-ro} ${cy}A${ro} ${ro * 0.24} 0 0 0 ${ro} ${cy}L${ri} ${cy}A${ri} ${ri * 0.17} 0 0 1 ${-ri} ${cy}Z`)
        : P(`M${-ro} ${cy}A${ro} ${ro * 0.24} 0 1 0 ${ro} ${cy}A${ro} ${ro * 0.24} 0 1 0 ${-ro} ${cy}ZM${-ri} ${cy}A${ri} ${ri * 0.17} 0 1 1 ${ri} ${cy}A${ri} ${ri * 0.17} 0 1 1 ${-ri} ${cy}Z`, 'fill-rule="evenodd"'));
      return person({ F, hair: 'afro', top: 'tee', bottom: 'pants', legs: 'apart', armL: [[-84, -44], [-120, -92]], armR: [[84, -44], [120, -92]], mid: ring(130, 112, true), front: motion(-176, 40, -1, ctx) + motion(148, 40, 1, ctx), back: ring(130, 112, false) }, ctx);
    }
    // bubbles
    let b = '';
    for (const [x, y, r] of [[156, -150, 28], [112, -186, 15], [178, -96, 16], [176, -32, 12], [140, -124, 10]]) b += C(x, y, r) + curve(`M${r1(x - r * 0.55)} ${r1(y - r * 0.15)}Q${r1(x - r * 0.5)} ${r1(y - r * 0.55)} ${r1(x - r * 0.12)} ${r1(y - r * 0.6)}`, ctx.thin);
    const wand = tube([[62, 0], [108, -58]], 10) + P('M122 -76m-24 0a24 24 0 1 0 48 0a24 24 0 1 0 -48 0Zm10 0a14 14 0 1 1 28 0a14 14 0 1 1 -28 0Z', 'fill-rule="evenodd"');
    return person({ F, hair: 'pony', top: 'sweater', bottom: 'pants', armL: 'hip', armR: [[80, 40], [60, 4]], backR: false, mid: wand, overR: true, front: b }, ctx);
  },
};

function kidWithKite(st, ctx) {
  const k = 0.7, tx = 70, ty = 200 - 200 * k;
  const hand = [-104, -112];
  const H = [tx + hand[0] * k, ty + hand[1] * k];
  let s = '';
  let kite, knot;
  if (st === 0) {
    const c = [-105, -112];
    kite = poly([[c[0], c[1] - 84], [c[0] + 58, c[1]], [c[0], c[1] + 96], [c[0] - 58, c[1]]]) + curve(`M${c[0]} ${c[1] - 84}L${c[0]} ${c[1] + 96}M${c[0] - 58} ${c[1]}L${c[0] + 58} ${c[1]}`, ctx.thin);
    knot = [c[0], c[1] + 20];
    const tail = [[c[0], c[1] + 96], [c[0] - 30, c[1] + 140], [c[0] + 4, c[1] + 190], [c[0] - 30, c[1] + 240], [c[0] - 6, c[1] + 290]];
    s += smooth(tail) + bow(c[0] - 20, c[1] + 150) + bow(c[0] - 12, c[1] + 210) + bow(c[0] - 22, c[1] + 266);
    s += kite;
  } else if (st === 1) {
    const c = [-100, -150];
    kite = poly([[c[0], c[1] - 44], [c[0] + 90, c[1] + 70], [c[0], c[1] + 52], [c[0] - 90, c[1] + 70]]) + curve(`M${c[0]} ${c[1] - 44}L${c[0] - 40} ${c[1] + 62}M${c[0]} ${c[1] - 44}L${c[0] + 40} ${c[1] + 62}`, ctx.thin) + curve(`M${c[0]} ${c[1] - 44}L${c[0]} ${c[1] + 52}`);
    knot = [c[0], c[1] + 40];
    s += smooth([[c[0] - 4, c[1] + 54], [c[0] - 40, c[1] + 110], [c[0] - 20, c[1] + 160], [c[0] - 54, c[1] + 210]]) + smooth([[c[0] + 4, c[1] + 54], [c[0] + 4, c[1] + 120], [c[0] + 30, c[1] + 170], [c[0] + 10, c[1] + 220]]);
    s += kite;
  } else {
    const c = [-100, -118];
    s += smooth([[c[0] + 50, c[1] + 10], [c[0] + 70, c[1] + 70], [c[0] + 50, c[1] + 130]]) + smooth([[c[0] + 54, c[1] + 18], [c[0] + 96, c[1] + 64], [c[0] + 86, c[1] + 120]]);
    kite = P(`M${c[0] + 50} ${c[1] - 20}L${c[0] + 92} ${c[1] - 52}L${c[0] + 84} ${c[1]}L${c[0] + 96} ${c[1] + 50}L${c[0] + 50} ${c[1] + 24}Z`) +
      blob([[c[0] - 80, c[1]], [c[0] - 50, c[1] - 46], [c[0], c[1] - 56], [c[0] + 56, c[1] - 26], [c[0] + 60, c[1] + 26], [c[0], c[1] + 52], [c[0] - 50, c[1] + 44]]) +
      eye(c[0] - 44, c[1] - 6, 13) + curve(`M${c[0] - 18} ${c[1] - 44}Q${c[0] - 2} ${c[1]} ${c[0] - 18} ${c[1] + 44}`) +
      curve(`M${c[0] + 4} ${c[1] - 26}q12 12 0 24M${c[0] + 4} ${c[1] + 2}q12 12 0 24M${c[0] + 26} ${c[1] - 14}q12 12 0 24M${c[0] + 26} ${c[1] + 12}q10 10 0 20`, ctx.thin) + smile(c[0] - 62, c[1] + 22, 16, 0.4);
    knot = [c[0], c[1] + 52];
    s += kite;
  }
  s += curve(`M${r1(knot[0])} ${r1(knot[1])}Q${r1((knot[0] + H[0]) / 2 + 30)} ${r1((knot[1] + H[1]) / 2 + 40)} ${r1(H[0])} ${r1(H[1])}`, ctx.thin);
  const kid = [
    { hair: 'long', top: 'dress', bottom: 'none', legs: 'run', armR: 'out' },
    { hair: 'curly', top: 'tee', bottom: 'shorts', legs: 'stand', armR: 'hip' },
    { hair: 'scarf', top: 'long', bottom: 'pants', legs: 'apart', armR: 'down' },
  ][st];
  s += scaled(ctx, k, tx, ty, (c) => person({ F: KID, ...kid, armL: [[-84, -50], hand] }, c));
  return s;
}
const childKite = { id: 'child-kite', name: 'Child with a kite', styles: 3, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden'], pairs: false, draw: (st, rand, ctx) => kidWithKite(st, ctx) };

const baby = {
  id: 'baby', name: 'Baby', styles: 3, flip: true,
  draw(st, rand, ctx) {
    const hy = -64, HR = 92;
    const babyHead = (x, y, r, opt = {}) => {
      let s = '';
      if (!opt.bonnet) s += C(x - r * 0.98, y + r * 0.1, r * 0.18) + C(x + r * 0.98, y + r * 0.1, r * 0.18);
      s += C(x, y, r);
      if (opt.bonnet) s += hat('bonnet', r, y, ctx);
      else s += curve(`M${r1(x - 4)} ${r1(y - r)}Q${r1(x + 18)} ${r1(y - r - 26)} ${r1(x + 24)} ${r1(y - r - 8)}Q${r1(x + 26)} ${r1(y - r + 4)} ${r1(x + 12)} ${r1(y - r - 2)}`);
      if (opt.sleep) s += curve(`M${r1(x - r * 0.5)} ${r1(y + r * 0.08)}Q${r1(x - r * 0.34)} ${r1(y + r * 0.2)} ${r1(x - r * 0.18)} ${r1(y + r * 0.08)}M${r1(x + r * 0.18)} ${r1(y + r * 0.08)}Q${r1(x + r * 0.34)} ${r1(y + r * 0.2)} ${r1(x + r * 0.5)} ${r1(y + r * 0.08)}`);
      else s += eye(x - r * 0.34, y + r * 0.08, r * 0.15, [0, 0.2]) + eye(x + r * 0.34, y + r * 0.08, r * 0.15, [0, 0.2]);
      s += C(x - r * 0.6, y + r * 0.38, r * 0.13, ctx.thin) + C(x + r * 0.6, y + r * 0.38, r * 0.13, ctx.thin) + curve(`M${r1(x - 3)} ${r1(y + r * 0.26)}q4 4 0 8`, ctx.thin);
      s += opt.sleep ? curve(`M${r1(x - 8)} ${r1(y + r * 0.5)}Q${r1(x)} ${r1(y + r * 0.56)} ${r1(x + 8)} ${r1(y + r * 0.5)}`) : smile(x, y + r * 0.46, r * 0.32, 0.5);
      return s;
    };
    if (st === 2) {
      // in a pram (side view)
      let s = curve('M130 -10L170 -90L198 -96') + curve('M-100 168L-60 110M100 168L60 110') + C(-100, 168, 30) + C(-100, 168, 10) + C(100, 168, 30) + C(100, 168, 10);
      s += g(babyHead(0, 0, 56), 'translate(20 -52)');
      s += P('M-160 -10L150 -10Q150 120 30 120L-50 120Q-160 120 -160 -10Z') + R(-156, -18, 304, 26, 12) + curve('M-150 50Q0 70 146 50', ctx.thin);
      for (let x = -120; x <= 120; x += 60) s += heart(x, 82, 26, ctx.thin);
      s += P('M-160 -10C-170 -110 -70 -150 -40 -150L-40 -10Z') + curve('M-150 -60Q-100 -60 -40 -100M-158 -30Q-100 -26 -40 -50', ctx.thin);
      return s;
    }
    let s = '';
    // body
    s += P('M-70 30Q-90 110 -70 160Q0 186 70 160Q90 110 70 30Q0 6 -70 30Z');
    // legs, sticking forward and out, with the soles of the feet showing
    s += tube([[-30, 150], [-92, 168]], 50) + tube([[30, 150], [92, 168]], 50) + E(-118, 160, 20, 28) + E(118, 160, 20, 28);
    // arms
    s += tube([[-60, 50], [-94, 84], [-104, 108]], 34) + tube([[60, 50], [94, 84], [104, 108]], 34) + C(-104, 112, 18) + C(104, 112, 18);
    // bib
    s += P('M-46 22Q0 40 46 22Q50 70 26 84Q0 94 -26 84Q-50 70 -46 22Z') + C(0, 160, 6, ctx.thin) + C(-20, 156, 6, ctx.thin) + C(20, 156, 6, ctx.thin);
    if (st === 0) {
      s += heart(0, 58, 34);
      s += tube([[104, 112], [146, 66]], 12) + C(158, 48, 28) + C(158, 48, 12, ctx.thin) + C(146, 66, 8) + C(104, 112, 18);
      s += babyHead(0, hy, HR);
      return s;
    }
    // with teddy and blocks
    s += star(0, 58, 18, 8);
    s += babyHead(0, hy, HR, { bonnet: true });
    s = teddy(-150, 100, 0.85, ctx) + s;
    s += block(80, 150, 50, ctx, 'star') + block(124, 104, 40, ctx, 'heart');
    return s;
  },
};

const grandparent = {
  id: 'grandparent', name: 'Grandparent', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    if (st === 0) {
      const cane = tube([[100, 196], [98, 44], ...arcPts(118, 44, 20, 20, 180, 360, 8).slice(1)], 14);
      const must = P(`M-30 ${F.hy + 30}Q-15 ${F.hy + 16} 0 ${F.hy + 25}Q15 ${F.hy + 16} 30 ${F.hy + 30}Q15 ${F.hy + 42} 0 ${F.hy + 34}Q-15 ${F.hy + 42} -30 ${F.hy + 30}Z`);
      return person({ F, hair: 'bald', glasses: true, top: 'cardigan', armL: 'hip', armR: [[86, 6], [98, 58]], backR: false, mid: cane, overR: true, front: must, mouth: 'grin' }, ctx);
    }
    if (st === 1) {
      const bq = P('M-40 0L40 0L8 96L-8 96Z') + flowerHead(-28, -16, 14, 5) + flowerHead(28, -16, 14, 5) + flowerHead(0, -38, 15, 6) + P('M-56 -10Q-72 -40 -50 -48Q-48 -24 -40 -8Z') + P('M56 -10Q72 -40 50 -48Q48 -24 40 -8Z') + bow(0, 34, 1.2);
      return person({ F, hair: 'granny', glasses: true, top: 'dress', bottom: 'none', armL: [[-70, 16], [-16, 48]], armR: [[70, 16], [16, 48]], backL: false, backR: false, mid: bq, overL: true, overR: true, pattern: 'dots' }, ctx);
    }
    // reading in an armchair
    const chairBack = P('M-150 -70Q-150 -140 -80 -140L80 -140Q150 -140 150 -70L150 120L-150 120Z');
    const chairFront = P('M-176 20Q-176 -10 -146 -10Q-116 -10 -116 20L-116 170L-176 170Z') + P('M176 20Q176 -10 146 -10Q116 -10 116 20L116 170L176 170Z') + R(-172, 170, 52, 20, 6) + R(120, 170, 52, 20, 6);
    const lap = P(`M-58 ${F.hip - 10}L58 ${F.hip - 10}Q66 ${F.hip + 34} 54 ${F.hip + 40}L-54 ${F.hip + 40}Q-66 ${F.hip + 34} -58 ${F.hip - 10}Z`) + curve(`M0 ${F.hip - 4}L0 ${F.hip + 40}`, ctx.thin);
    const book = P('M-60 -6L0 4L0 64L-60 54Z') + P('M60 -6L0 4L0 64L60 54Z') + curve('M-46 6L-10 12M-46 20L-10 26M10 12L46 6M10 26L46 20', ctx.thin);
    return person({ F, hair: 'curly', glasses: true, top: 'sweater', legs: 'sit', armL: [[-84, 10], [-62, 24]], armR: [[84, 10], [62, 24]], backL: false, backR: false, back: chairBack, mid: lap + book, overL: true, overR: true, front: chairFront, mouth: 'grin' }, ctx);
  },
};

const stetho = (F, ctx) => curve(`M-28 ${F.y0 + 2}Q-40 ${F.y0 + 60} -8 ${F.y0 + 78}`) + curve(`M28 ${F.y0 + 2}Q40 ${F.y0 + 40} 30 ${F.y0 + 54}`) + C(-8, F.y0 + 84, 11) + C(-8, F.y0 + 84, 4, ctx.thin);
const doctor = {
  id: 'doctor', name: 'Doctor', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    if (st === 0) {
      const board = R(-60, -26, 84, 108, 6) + R(-36, -34, 36, 16, 4) + curve('M-46 10L10 10M-46 30L10 30M-46 50L-6 50', ctx.thin);
      return person({ F, hair: 'curly', top: 'coat', armL: [[-80, 10], [-48, 30]], armR: 'wave', backL: false, mid: stetho(F, ctx) + board, overL: true }, ctx);
    }
    if (st === 1) {
      const bear = teddy(0, 10, 0.8, ctx) + g(R(-14, -5, 28, 10, 4) + R(-5, -14, 10, 28, 4), 'translate(16 -18) rotate(30)') + E(-16, 40, 12, 10, ctx.thin);
      return person({ F, hair: 'scarf', top: 'coat', armL: [[-80, 16], [-40, 46]], armR: [[80, 16], [40, 46]], backL: false, backR: false, mid: stetho(F, ctx) + bear, overL: true, overR: true }, ctx);
    }
    const bag = P('M70 70Q70 40 100 40L150 40Q180 40 180 70L180 140L70 140Z') + P('M104 40Q104 16 125 16Q146 16 146 40L136 40Q136 26 125 26Q114 26 114 40Z') + heart(125, 94, 44);
    return person({ F, hair: 'short', glasses: true, top: 'coat', armL: 'wave', armR: [[86, 8], [116, 34]], backR: false, front: stetho(F, ctx), mid: bag, overR: true, legs: 'apart' }, ctx);
  },
};

const firefighter = {
  id: 'firefighter', name: 'Firefighter', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    const base = { F, top: 'fire', hat: 'helmet', boots: true, legStripe: true, mitts: true };
    if (st === 0) {
      const hose = tube(roundPts([[-200, 190], [-150, 150], [-80, 120], [-30, 60], [10, 20], [60, 6]], 30), 22) + P('M56 -8L104 -2L104 18L56 22Z') + R(100, -8, 18, 32, 4);
      let spray = '';
      for (const [x, y, r] of [[146, -20, 9], [170, -40, 11], [150, 18, 8], [184, -2, 9], [180, -70, 8], [158, -60, 6]]) spray += P(`M${x} ${y - r * 1.8}Q${x + r} ${y} ${x} ${y + r}Q${x - r} ${y} ${x} ${y - r * 1.8}Z`);
      spray += curve('M122 2Q160 -10 196 -40M122 10Q160 6 196 -4', ctx.thin);
      return person({ ...base, hair: 'short', legs: 'apart', armL: [[-60, 20], [-2, 22]], armR: [[60, 30], [52, 6]], backL: false, backR: false, mid: hose, overL: true, overR: true, front: spray }, ctx);
    }
    if (st === 1) {
      return person({ ...base, hair: 'long', armL: [[-80, 14], [-44, 36]], armR: [[80, 14], [44, 36]], backL: false, backR: false, mid: kitten(0, 14, ctx), overL: true, overR: true }, ctx);
    }
    const hydrant = R(108, 92, 72, 108, 6) + P('M100 80Q100 40 144 40Q188 40 188 80Z') + R(96, 76, 96, 20, 6) + R(92, 128, 20, 28, 4) + R(176, 128, 20, 28, 4) + C(144, 150, 14) + R(98, 190, 92, 10, 3) + R(136, 26, 16, 16, 4);
    return person({ ...base, hair: 'curly', armL: 'wave', armR: 'hip', back: hydrant }, ctx);
  },
};

const chef = {
  id: 'chef', name: 'Chef', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    if (st === 0) {
      const cake = E(0, 30, 92, 16) + R(-64, -26, 128, 56, 10) + R(-44, -66, 88, 44, 10) + curve('M-64 0Q-48 14 -32 0T0 0T32 0T64 0M-44 -46Q-30 -34 -16 -46T14 -46T44 -46', ctx.thin) + C(0, -76, 11) + curve('M0 -86q4 -10 12 -12', ctx.thin);
      return person({ F, hair: 'bob', top: 'chef', hat: 'toque', armL: [[-80, 20], [-70, 32]], armR: [[80, 20], [70, 32]], backL: false, backR: false, mid: cake, overL: false, overR: false }, ctx);
    }
    if (st === 1) {
      const pot = R(-110, 50, 220, 120, 18) + R(-124, 40, 248, 22, 10) + R(-146, 74, 36, 18, 8) + R(110, 74, 36, 18, 8);
      const spoon = tube([[30, 50], [74, -20]], 12) + E(26, 56, 14, 8);
      return person({ F, hair: 'scarf', top: 'chef', hat: 'toque', armL: 'hip', armR: [[86, 20], [72, -14]], backR: false, mid: spoon, overR: true, front: pot }, ctx);
    }
    const pan = tube([[-60, 6], [-130, -10]], 14) + E(-170, -16, 46, 14) + P('M-216 -16Q-216 6 -170 6Q-124 6 -124 -16Z');
    const pancake = E(-160, -100, 34, 12) + curve('M-200 -60q-8 -20 0 -40M-120 -60q8 -20 0 -40', ctx.thin);
    return person({ F, hair: 'spiky', top: 'chef', hat: 'toque', armL: [[-90, 0], [-64, 4]], armR: 'hip', backL: false, mid: pan, overL: true, front: pancake }, ctx);
  },
};

const farmer = {
  id: 'farmer', name: 'Farmer', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    if (st === 0) {
      return person({ F, hair: 'braids', top: 'overalls', hat: 'straw', boots: true, armL: [[-88, 8], [-92, 44]], armR: [[88, 8], [92, 44]], backL: true, backR: true, front: basket(0, 60, ctx) }, ctx);
    }
    if (st === 1) {
      const can = P('M80 30L150 30L144 110L86 110Z') + P('M144 50L196 0L200 8L148 70Z') + P('M188 -6L206 -14L210 4L198 10Z') + P('M96 30Q96 -14 115 -14Q134 -14 134 30L124 30Q124 -4 115 -4Q106 -4 106 30Z');
      let drops = '';
      for (const [x, y] of [[204, 40], [192, 80], [212, 110]]) drops += P(`M${x} ${y - 10}Q${x + 6} ${y} ${x} ${y + 6}Q${x - 6} ${y} ${x} ${y - 10}Z`);
      return person({ F, hair: 'bun', top: 'overalls', hat: 'straw', boots: true, armL: 'hip', armR: [[90, 16], [110, -4]], backR: false, mid: can, overR: true, front: drops, sleeve: 'long' }, ctx);
    }
    return person({ F, hair: 'short', top: 'overalls', hat: 'cap', boots: true, armL: [[-84, 16], [-70, 40]], armR: [[84, 16], [70, 40]], backL: false, backR: false, front: hen(4, 0, ctx) }, ctx);
  },
};

const painter = {
  id: 'painter', name: 'Painter', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    const palette = (x, y) => P(`M${x - 50} ${y}C${x - 56} ${y - 40} ${x + 30} ${y - 50} ${x + 50} ${y - 16}C${x + 64} ${y + 10} ${x + 30} ${y + 36} ${x} ${y + 30}C${x - 14} ${y + 26} ${x - 6} ${y + 10} ${x - 20} ${y + 12}C${x - 34} ${y + 14} ${x - 46} ${y + 26} ${x - 50} ${y}Z`) +
      C(x - 26, y - 14, 9) + C(x, y - 24, 9) + C(x + 26, y - 18, 9) + C(x + 34, y + 6, 9);
    const brush = (pts) => tube(pts, 8) + P(`M${pts[1][0] - 8} ${pts[1][1]}L${pts[1][0] + 8} ${pts[1][1]}L${pts[1][0]} ${pts[1][1] - 26}Z`);
    if (st === 0) {
      const easel = curve('M118 -10L80 200M166 -10L204 200M142 -10L142 200') + R(64, -130, 156, 130, 4) + R(78, -116, 128, 102, 2, ctx.thin) + R(70, 0, 144, 12, 3);
      const pic = sun(178, -86, 12, 8, ctx.thin) + P('M80 -16Q110 -60 140 -36Q170 -58 204 -16Z', ctx.thin) + R(100, -62, 26, 20, 0, ctx.thin) + poly([[96, -62], [113, -76], [130, -62]], ctx.thin);
      return person({ F, hair: 'pony', top: 'smock', hat: 'beret', armL: 'hip', armR: [[90, -6], [96, -50]], backR: false, back: easel + pic, front: brush([[96, -40], [96, -76]]).replace(/^/, '') }, ctx).replace('', '');
    }
    if (st === 1) {
      let pots = '';
      for (const [x, m] of [[-150, 0], [150, 1]]) pots += R(x - 30, 140, 60, 60, 6) + E(x, 140, 30, 9) + (m ? P(`M${x - 20} 140Q${x - 24} 160 ${x - 14} 162Q${x - 4} 160 ${x - 8} 141Z`) : '');
      return person({ F, hair: 'afro', top: 'smock', hat: 'beret', armL: [[-90, 16], [-70, 30]], armR: 'wave', backL: false, mid: palette(-92, 30), overL: true, back: pots, front: brush([[106, -152], [114, -190]]) }, ctx);
    }
    const frame = R(-96, -34, 192, 140, 6) + R(-80, -18, 160, 108, 3) + flowerHead(-30, 30, 14, 6) + curve('M-30 46L-30 90M30 60L30 90', ctx.thin) + flowerHead(30, 50, 11, 5) + sun(50, 0, 10, 8, ctx.thin);
    return person({ F, hair: 'bob', top: 'smock', hat: 'beret', armL: [[-90, 16], [-96, 12]], armR: [[90, 16], [96, 12]], backL: false, backR: false, mid: frame, overL: true, overR: true }, ctx);
  },
};

const musician = {
  id: 'musician', name: 'Musician', styles: 3,
  draw(st, rand, ctx) {
    const F = ADULT;
    if (st === 0) {
      const guitar = g(tube([[0, 0], [0, -190]], 24) + R(-20, -236, 40, 50, 8) + C(-14, -224, 4) + C(14, -224, 4) + C(-14, -204, 4) + C(14, -204, 4) +
        P('M0 -110C-50 -110 -64 -76 -46 -46C-74 -22 -70 40 0 40C70 40 74 -22 46 -46C64 -76 50 -110 0 -110Z') + C(0, -46, 20) + R(-26, 4, 52, 12, 4) + curve('M-4 -180L-4 10M4 -180L4 10', ctx.hair), 'translate(-6 76) rotate(-58)');
      return person({ F, hair: 'long', top: 'stripes', armL: [[-104, 16], [-150, -20]], armR: [[70, 30], [10, 40]], backL: false, backR: false, mid: guitar, overL: true, overR: true, front: note(120, -150) + note(150, -60, true) }, ctx);
    }
    if (st === 1) {
      const drum = R(-110, 66, 220, 110, 12) + E(0, 66, 110, 26) + R(-118, 160, 236, 22, 8);
      let zz = 'M-104 84';
      for (let i = 0; i < 8; i++) zz += `L${-104 + i * 26 + 13} 158L${-104 + (i + 1) * 26} 84`;
      const sticks = tube([[-74, 10], [-30, 64]], 10) + C(-30, 66, 8) + tube([[74, 10], [30, 64]], 10) + C(30, 66, 8);
      return person({ F, hair: 'bun', top: 'tee', armL: [[-100, 0], [-74, 10]], armR: [[100, 0], [74, 10]], backL: false, backR: false, mid: sticks, overL: true, overR: true, front: drum + curve(zz, ctx.thin) + note(-170, -120) + note(132, -150, true) }, ctx);
    }
    const trumpet = R(22, -114, 120, 16, 6) + R(40, -98, 70, 14, 6) + R(56, -128, 10, 16, 2) + R(74, -128, 10, 16, 2) + R(92, -128, 10, 16, 2) + P('M138 -118L196 -150L196 -64L138 -96Z') + E(196, -107, 12, 43) + R(4, -112, 22, 12, 4);
    return person({ F, hair: 'spiky', top: 'tee', armL: 'hip', armR: [[96, -10], [84, -94]], backR: false, front: trumpet + note(-150, -120) + note(-170, -10, true), sleeve: 'short' }, ctx).replace('', '');
  },
};

const people = {
  id: 'people', name: 'People', order: 50, kind: 'ground', icon: 'child-playing',
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'room', 'party'],
  pairScenes: ['garden', 'party'],
  subjects: [
    childPlaying, childKite,
    { ...baby, scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'party', 'meadow'] },
    { ...grandparent, scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'meadow', 'party'] },
    { ...doctor, scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'meadow'], pairScenes: ['room'] },
    { ...firefighter, scenes: ['plain', 'hearts', 'stars', 'road', 'garden', 'meadow'] },
    { ...chef, scenes: ['plain', 'hearts', 'stars', 'room', 'party', 'garden'] },
    { ...farmer, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden'] },
    { ...painter, scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'meadow', 'hills'] },
    { ...musician, scenes: ['plain', 'hearts', 'stars', 'party', 'room', 'garden', 'meadow'] },
  ],
};

/* ------------------------------------------------------------------------------------------------
 * NATURE AND WEATHER
 * ---------------------------------------------------------------------------------------------- */
const drop = (x, y, s = 1, a = '') => P(`M${r1(x)} ${r1(y - 16 * s)}Q${r1(x + 11 * s)} ${r1(y + 1 * s)} ${r1(x + 9 * s)} ${r1(y + 5 * s)}A${r1(9.5 * s)} ${r1(9.5 * s)} 0 0 1 ${r1(x - 9 * s)} ${r1(y + 5 * s)}Q${r1(x - 11 * s)} ${r1(y + 1 * s)} ${r1(x)} ${r1(y - 16 * s)}Z`, a);
/** A friendly face for clouds, suns and volcanoes. */
function cuteFace(x, y, s, ctx, mood = 'happy') {
  let f = '';
  if (mood === 'sleepy') f += curve(`M${r1(x - 30 * s)} ${r1(y)}q10 ${r1(8 * s)} ${r1(20 * s)} 0M${r1(x + 10 * s)} ${r1(y)}q10 ${r1(8 * s)} ${r1(20 * s)} 0`);
  else f += dotEye(x - 20 * s, y, 8 * s) + dotEye(x + 20 * s, y, 8 * s);
  f += C(x - 38 * s, y + 16 * s, 9 * s, ctx.thin) + C(x + 38 * s, y + 16 * s, 9 * s, ctx.thin);
  f += mood === 'oh' ? E(x, y + 22 * s, 7 * s, 9 * s) : smile(x, y + 16 * s, 26 * s, 0.5);
  return f;
}
/** A big puffy cloud built from bumps, wider and rounder than the scene clouds. */
function puffCloud(cx, cy, w, h) {
  const pts = [];
  const top = [[-0.5, 0.15], [-0.48, -0.25], [-0.25, -0.5], [0.05, -0.62], [0.32, -0.45], [0.5, -0.12], [0.5, 0.2]];
  for (const [u, v] of top) pts.push([cx + u * w, cy + v * h]);
  return P(bumps(pts, 0.62, false) + `Q${r1(cx)} ${r1(cy + 0.32 * h)} ${r1(cx - 0.5 * w)} ${r1(cy + 0.15 * h)}Z`);
}
const bandArc = (cx, cy, ro, ri) => P(`M${r1(cx - ro)} ${r1(cy)}A${r1(ro)} ${r1(ro)} 0 0 1 ${r1(cx + ro)} ${r1(cy)}L${r1(cx + ri)} ${r1(cy)}A${r1(ri)} ${r1(ri)} 0 0 0 ${r1(cx - ri)} ${r1(cy)}Z`);
function rainbowBands(cx, cy, ro, n, w) {
  let s = '';
  for (let i = 0; i < n; i++) s += bandArc(cx, cy, ro - i * w, ro - (i + 1) * w);
  return s;
}
function pine(x, y, h) {
  const w = h * 0.42;
  return R(x - w * 0.14, y - h * 0.2, w * 0.28, h * 0.2) + poly([[x - w, y - h * 0.18], [x, y - h * 0.62], [x + w, y - h * 0.18]]) + poly([[x - w * 0.78, y - h * 0.48], [x, y - h], [x + w * 0.78, y - h * 0.48]]);
}
function roundTree(x, y, h) {
  return R(x - 9, y - h * 0.45, 18, h * 0.45, 3) + blob(ring(x, y - h * 0.66, h * 0.32, h * 0.32, 9, 0, 0)) ;
}
/** Snow on a peak: a cap from the peak down to fraction f of each side, with a wavy lower edge. */
function snowCap(peak, left, right, f) {
  const L = [peak[0] + (left[0] - peak[0]) * f, peak[1] + (left[1] - peak[1]) * f];
  const Rr = [peak[0] + (right[0] - peak[0]) * f, peak[1] + (right[1] - peak[1]) * f];
  const n = 4, pts = [];
  for (let i = 0; i <= n; i++) pts.push([Rr[0] + ((L[0] - Rr[0]) * i) / n, Rr[1] + ((L[1] - Rr[1]) * i) / n + (i % 2 ? 14 : 0)]);
  return P(`M${fmt(peak)}L${fmt(Rr)}` + pts.slice(1).map((p, i) => `Q${r1((pts[i][0] + p[0]) / 2)} ${r1(Math.max(pts[i][1], p[1]) + 12)} ${fmt(p)}`).join('') + 'Z');
}
function palm(x, y, h, lean, ctx) {
  const top = [x + lean, y - h];
  let s = tube(roundPts([[x, y], [x + lean * 0.3, y - h * 0.5], top], 40), 22);
  for (let i = 1; i < 5; i++) { const t = i / 5; const px = x + lean * t * t, py = y - h * t; s += curve(`M${r1(px - 11)} ${r1(py + 4)}Q${r1(px)} ${r1(py - 4)} ${r1(px + 11)} ${r1(py + 4)}`, ctx.thin); }
  const leaf = (a, len) => g(P(`M0 0Q${r1(len * 0.5)} ${r1(-len * 0.32)} ${r1(len)} ${r1(len * 0.1)}Q${r1(len * 0.5)} ${r1(-len * 0.05)} 0 0Z`) + curve(`M4 -2Q${r1(len * 0.5)} ${r1(-len * 0.16)} ${r1(len * 0.9)} ${r1(len * 0.06)}`, ctx.thin), `translate(${r1(top[0])} ${r1(top[1])}) rotate(${a})`);
  s += leaf(-170, 90) + leaf(-130, 80) + leaf(-60, 82) + leaf(-15, 92) + leaf(20, 70) + leaf(160, 70);
  s += C(top[0] - 10, top[1] + 12, 10) + C(top[0] + 8, top[1] + 14, 10);
  return s;
}
function umbrella(x, y, w, ctx) {
  let s = tube([[x, y], [x, y - w * 0.9]], 8);
  const top = y - w * 0.95, n = 4;
  let d = `M${r1(x - w)} ${r1(top + w * 0.35)}C${r1(x - w)} ${r1(top - w * 0.35)} ${r1(x + w)} ${r1(top - w * 0.35)} ${r1(x + w)} ${r1(top + w * 0.35)}`;
  for (let i = n; i > 0; i--) { const x1 = x - w + ((i - 1) * 2 * w) / n; d += `Q${r1(x1 + w / n)} ${r1(top + w * 0.2)} ${r1(x1)} ${r1(top + w * 0.35)}`; }
  s += P(d + 'Z');
  for (let i = 1; i < n; i++) { const xx = x - w + (i * 2 * w) / n; s += curve(`M${r1(x)} ${r1(top - w * 0.17)}Q${r1((x + xx) / 2)} ${r1(top)} ${r1(xx)} ${r1(top + w * 0.27)}`, ctx.thin); }
  return s + C(x, top - w * 0.2, 6);
}
function seaStar(x, y, r, rot = 0) { return star(x, y, r, r * 0.5, 5, '', -90 + rot) + C(x, y, r * 0.18); }
function shell(x, y, s, ctx) {
  return scaled(ctx, s, x, y, (c) => P('M0 20L-30 -10Q-20 -34 0 -36Q20 -34 30 -10Z') + curve('M0 18L-16 -26M0 18L0 -34M0 18L16 -26', c.thin) + R(-10, 16, 20, 10, 4));
}
function crab(x, y, ctx) {
  return g(curve('M-30 6L-50 24M-26 12L-40 30M30 6L50 24M26 12L40 30') + curve('M-12 -24L-14 -40M12 -24L14 -40') + C(-14, -44, 8) + C(14, -44, 8) + dark(C(-14, -44, 3.5)) + dark(C(14, -44, 3.5)) +
    P('M-36 -16Q-60 -40 -52 -60Q-40 -52 -44 -42Q-34 -48 -30 -38Q-40 -30 -30 -16Z') + P('M36 -16Q60 -40 52 -60Q40 -52 44 -42Q34 -48 30 -38Q40 -30 30 -16Z') + E(0, 0, 44, 28) + smile(0, 4, 20, 0.5), `translate(${x} ${y})`);
}
function sandcastle(x, y, s, ctx) {
  const k = s;
  let c = '';
  const crenel = (x0, y0, w) => { let p = `M${x0} ${y0}`; const n = 3, sw = w / (2 * n - 1); for (let i = 0; i < 2 * n - 1; i++) p += `l${sw} 0l0 ${i % 2 ? -sw : sw}`; return p; };
  c += P(`M-90 0L-90 -70L-50 -70L-50 -86L-36 -86L-36 -70L-24 -70L-24 -86L-10 -86L-10 -70L10 -70L10 -86L24 -86L24 -70L36 -70L36 -86L50 -86L50 -70L90 -70L90 0Z`);
  c += P('M-40 -70L-40 -130L-28 -130L-28 -144L-14 -144L-14 -130L14 -130L14 -144L28 -144L28 -130L40 -130L40 -70Z');
  c += P('M-12 0L-12 -28Q0 -42 12 -28L12 0Z') + R(-70, -54, 20, 20, 4) + R(50, -54, 20, 20, 4) + R(-8, -112, 16, 20, 6);
  c += curve('M0 -144L0 -184') + P('M0 -184L30 -174L0 -164Z');
  return scaled(ctx, k, x, y, () => c);
}
function bucketSpade(x, y, ctx) {
  return P(`M${x - 34} ${y - 56}L${x + 34} ${y - 56}L${x + 26} ${y}L${x - 26} ${y}Z`) + E(x, y - 56, 34, 8) + curve(`M${x - 32} ${y - 50}Q${x} ${y - 100} ${x + 32} ${y - 50}`) + R(x - 30, y - 34, 60, 12, 0) +
    tube([[x + 48, y - 70], [x + 60, y - 20]], 8) + P(`M${x + 52} ${y - 22}L${x + 76} ${y - 26}L${x + 74} ${y + 2}Q${x + 66} ${y + 12} ${x + 58} ${y + 4}Z`);
}

function snowflakeArm(w, len, branches, tip) {
  // the right half of one arm pointing up, as a list of points, mirrored for the left half
  const h = w / 2, right = [[h, -h * 1.2]];
  const dir = [Math.sin(rad(55)), -Math.cos(rad(55))], up = [-Math.cos(rad(55)), -Math.sin(rad(55))];
  for (const [b, L] of branches) {
    const p1 = [h, -b];
    const p2 = [p1[0] + dir[0] * L, p1[1] + dir[1] * L];
    const p3 = [p2[0] + up[0] * w * 0.9, p2[1] + up[1] * w * 0.9];
    const p4 = [h, -b - w * 1.25];
    right.push(p1, p2, p3, p4);
  }
  const tipY = -len;
  if (tip === 'diamond') right.push([h, tipY + w * 2.4], [w * 1.25, tipY + w * 1.2], [0, tipY]);
  else if (tip === 'round') right.push([h, tipY + w * 1.6]);
  else right.push([h, tipY + w * 0.5], [0, tipY]);
  const left = right.slice().reverse().map(([x, y]) => [-x, y]);
  if (tip === 'round') return P(`M${right.map(fmt).join('L')}A${r1(w * 0.95)} ${r1(w * 0.95)} 0 1 0 ${fmt(left[0])}L${left.slice(1).map(fmt).join('L')}Z`);
  return poly([...right, ...left.slice(right[right.length - 1][0] === 0 ? 1 : 0)]);
}

const rainbowSub = {
  id: 'rainbow', name: 'Rainbow', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'sky', 'meadow', 'hills', 'garden'],
  draw(st, rand, ctx) {
    if (st === 0) return rainbowBands(0, 70, 196, 5, 26) + puffCloud(-140, 96, 170, 120) + puffCloud(140, 96, 170, 120) + cuteFace(-140, 88, 1, ctx) + cuteFace(140, 88, 1, ctx, 'sleepy');
    if (st === 1) {
      return sun(120, -110, 44, 10) + cuteFace(120, -116, 0.7, ctx) + rainbowBands(0, 90, 170, 6, 22) + puffCloud(-120, 110, 160, 110) + puffCloud(130, 116, 140, 96) + heart(0, -40, 40) + star(-150, -130, 22, 10) + star(40, -150, 16, 7);
    }
    let s = rainbowBands(30, 120, 180, 4, 32);
    s += puffCloud(-110, -40, 200, 130) + cuteFace(-110, -50, 0.9, ctx);
    for (const [x, y] of [[-170, 50], [-130, 90], [-90, 50], [-50, 90], [-150, 140], [-80, 140]]) s += drop(x, y, 1.2);
    return s + curve('M120 -150q12 -12 24 0q12 -12 24 0M70 -110q10 -10 20 0q10 -10 20 0');
  },
};

const sunSub = {
  id: 'sun', name: 'Sun', styles: 4,
  scenes: ['plain', 'hearts', 'stars', 'sky', 'meadow', 'hills', 'garden', 'pond'],
  draw(st, rand, ctx) {
    if (st === 0) return sun(0, 0, 100, 12) + sunFace(100, 0, ctx);
    if (st === 1) return petals({ k: 0 }, 14, 90, 196, { sh: 'flame' }, ctx) + sunFace(112, 3, ctx);
    if (st === 2) {
      return sun(40, -50, 86, 12) + g(sunFace(86, 0, ctx), 'translate(40 -50)') + puffCloud(-50, 90, 300, 190) + cuteFace(-60, 84, 0.9, ctx, 'sleepy');
    }
    let s = petals({ k: 0 }, 12, 110, 196, { sh: 'round', off: 15, detail: 'none' }, ctx) + petals({ k: 0 }, 12, 104, 176, { sh: 'spike', detail: 'none' }, ctx);
    return s + sunFace(110, 1, ctx);
  },
};

const rainCloud = {
  id: 'rain-cloud', name: 'Rain cloud', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'sky', 'meadow', 'hills', 'garden', 'pond'],
  draw(st, rand, ctx) {
    if (st === 0) {
      let s = puffCloud(0, -70, 380, 240) + cuteFace(0, -80, 1.6, ctx);
      for (const [x, y] of [[-120, 70], [-60, 110], [0, 70], [60, 110], [120, 70], [-90, 170], [-30, 170], [30, 170], [90, 170]]) s += drop(x, y, 1.3);
      return s;
    }
    if (st === 1) {
      let s = puffCloud(0, -110, 340, 200) + cuteFace(0, -120, 1.5, ctx, 'oh');
      for (const [x, y] of [[-140, -10], [-90, 30], [90, 30], [140, -10], [-150, 70], [150, 70]]) s += drop(x, y, 1.2);
      return s + umbrella(0, 190, 110, ctx) + curve('M0 190q0 14 -14 14');
    }
    let s = puffCloud(70, -130, 220, 140) + cuteFace(70, -136, 0.8, ctx, 'sleepy') + puffCloud(-60, -30, 300, 200) + cuteFace(-60, -40, 1.3, ctx);
    for (const [x, y] of [[-160, 100], [-110, 140], [-60, 100], [-10, 140], [40, 100], [100, 30], [150, 60], [-130, 190], [-30, 190]]) s += drop(x, y, 1.1);
    return s;
  },
};

const lightningCloud = {
  id: 'lightning-cloud', name: 'Lightning cloud', styles: 3,
  scenes: ['plain', 'stars', 'sky', 'rain', 'hills', 'night'],
  draw(st, rand, ctx) {
    const bolt = (x, y0, s) => { const y = y0 - 50; return poly([[-14, 0], [40, 0], [16, 60], [52, 60], [-22, 170], [-2, 92], [-40, 92]].map(([a, b]) => [x + a * s, y + b * s])); };
    if (st === 0) return bolt(0, 20, 1) + puffCloud(0, -80, 380, 230) + cuteFace(0, -90, 1.6, ctx);
    if (st === 1) {
      let s = bolt(-90, 10, 0.9) + bolt(90, 10, 0.9);
      for (const [x, y] of [[-10, 70], [30, 120], [-30, 160], [140, 190], [-150, 190]]) s += drop(x, y, 1.1);
      return s + puffCloud(0, -90, 380, 220) + cuteFace(0, -100, 1.6, ctx, 'oh');
    }
    let s = bolt(10, 30, 0.95) + puffCloud(0, -90, 360, 220) + cuteFace(0, -100, 1.5, ctx);
    s += star(-140, 90, 26, 11, 4) + star(150, 60, 22, 9, 4) + star(130, 160, 16, 7, 4) + star(-110, 170, 18, 7, 4);
    return s;
  },
};

const SNOW = [
  { w: 22, branches: [[70, 50], [120, 36]], tip: 'diamond', centre: 'hex' },
  { w: 20, branches: [[60, 34], [100, 44], [140, 28]], tip: 'point', centre: 'star' },
  { w: 26, branches: [[90, 56]], tip: 'round', centre: 'face' },
  { w: 18, branches: [[54, 60], [110, 40], [150, 22]], tip: 'diamond', centre: 'flower' },
];
const snowflake = {
  id: 'snowflake', name: 'Snowflake', styles: 4, flip: false,
  scenes: ['plain', 'hearts', 'stars', 'snow', 'night', 'sky'],
  draw(st, rand, ctx) {
    const o = SNOW[st];
    const arm = snowflakeArm(o.w, 192, o.branches, o.tip);
    let s = '';
    for (let i = 0; i < 6; i++) s += g(arm, `rotate(${i * 60})`);
    if (o.centre === 'hex') s += disc({ k: 6, rot: 0 }, 52) + star(0, 0, 30, 14, 6);
    else if (o.centre === 'star') s += C(0, 0, 50) + star(0, 0, 40, 20, 6, '', -60) + C(0, 0, 10);
    else if (o.centre === 'face') s += C(0, 0, 66) + cuteFace(0, -6, 1.15, ctx);
    else s += C(0, 0, 46) + petals({ k: 0 }, 6, 10, 40, { sh: 'round', off: 30 }, ctx) + C(0, 0, 12);
    return s;
  },
};

const mountain = {
  id: 'mountain', name: 'Mountain', styles: 3, kind: 'ground',
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'snow', 'night', 'forest'],
  draw(st, rand, ctx) {
    if (st === 0) {
      const bp = [-90, -40], bl = [-200, 200], br = [30, 200];
      const fp = [50, -180], fl = [-110, 200], fr = [200, 200];
      return poly([bl, bp, br]) + snowCap(bp, bl, br, 0.28) + poly([fl, fp, fr]) + snowCap(fp, fl, fr, 0.3) +
        curve('M50 -80L30 0L60 80', ctx.thin) + pine(-150, 200, 90) + pine(-100, 200, 120) + pine(150, 200, 100);
    }
    if (st === 1) {
      const peaks = [[[-200, 200], [-130, -20], [-30, 200]], [[60, 200], [140, -60], [200, 200]], [[-110, 200], [0, -170], [120, 200]]];
      let s = puffCloud(130, -150, 120, 70);
      for (const [l, p, r] of peaks) s += poly([l, p, r]) + snowCap(p, l, r, 0.32);
      return s + P('M0 -214L32 -204L0 -194Z') + curve('M0 -170L0 -214') + puffCloud(-110, -110, 130, 70);
    }
    const pk = [0, -170], l = [-200, 140], r = [200, 140];
    let s = sun(-130, -140, 30, 10) + poly([l, pk, r]) + snowCap(pk, l, r, 0.3);
    s += P('M-200 120Q0 90 200 120L200 200L-200 200Z') + E(70, 165, 90, 22);
    s += P('M-20 120Q-60 150 -10 170Q30 190 -40 200L-10 200Q60 190 20 166Q-26 150 0 120Z');
    s += R(-150, 120, 70, 50) + poly([[-160, 124], [-115, 86], [-70, 124]]) + R(-128, 140, 24, 30, 3) + R(-96, 132, 14, 14);
    return s + pine(150, 140, 80) + pine(-180, 150, 60);
  },
};

const volcano = {
  id: 'volcano', name: 'Volcano', styles: 3, kind: 'ground',
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'night', 'water', 'hills'],
  draw(st, rand, ctx) {
    const cone = (w, top, cy) => P(`M${-w} 200L-46 ${top + 8}Q0 ${top - 8} 46 ${top + 8}L${w} 200Z`);
    const lava = (top) => P(`M-46 ${top + 8}Q0 ${top - 8} 46 ${top + 8}L56 ${top + 30}Q60 ${top + 60} 48 ${top + 64}Q36 ${top + 60} 38 ${top + 40}Q20 ${top + 34} 14 ${top + 50}Q12 ${top + 86} 0 ${top + 88}Q-12 ${top + 86} -12 ${top + 50}Q-24 ${top + 30} -36 ${top + 44}Q-38 ${top + 70} -48 ${top + 70}Q-60 ${top + 66} -56 ${top + 30}Z`);
    const smoke = (x, y, k) => blob(ring(x, y, 34 * k, 26 * k, 8, 0, 0.08, rng(`smoke${x}${y}`)));
    if (st === 0) {
      const top = -60;
      return smoke(-10, -100, 1) + smoke(30, -150, 1.2) + smoke(-20, -195, 0.9) + cone(190, top) + lava(top) + E(0, top + 4, 46, 9) +
        cuteFace(0, 70, 1.3, ctx) + E(-130, 190, 26, 14) + E(150, 186, 32, 18);
    }
    if (st === 1) {
      const top = -40;
      return smoke(0, -80, 1) + smoke(40, -130, 1.1) + cone(170, top) + lava(top) + E(0, top + 4, 46, 9) + palm(-150, 180, 150, 30, ctx) + palm(160, 186, 120, -24, ctx) +
        P('M-200 180Q-100 160 0 176Q100 160 200 180L200 200L-200 200Z');
    }
    const top = -80;
    let s = smoke(0, -120, 1.1) + smoke(-40, -170, 1) + smoke(20, -205, 0.8) + cone(200, top) + lava(top) + E(0, top + 4, 46, 9);
    s += curve('M-120 120L-90 70M100 110L130 60', ctx.thin) + roundTree(-160, 200, 90) + roundTree(170, 200, 100) + pine(-110, 200, 80) + pine(118, 200, 70);
    return s + curve('M-150 -160q10 -10 20 0q10 -10 20 0M110 -190q10 -10 20 0q10 -10 20 0');
  },
};

const beach = {
  id: 'beach', name: 'Beach', styles: 5, kind: 'ground', flip: true,
  scenes: ['plain', 'hearts', 'stars'],
  draw(st, rand, ctx) {
    let s = '';
    const sea = P('M-200 -40L200 -40L200 70L-200 70Z') + curve('M-170 -10q20 -12 40 0t40 0t40 0M50 -20q20 -12 40 0t40 0t40 0M-60 30q20 -12 40 0t40 0', ctx.thin);
    const sand = P('M-200 50Q-100 30 0 50Q100 70 200 44L200 200L-200 200Z');
    if (st === 0) {
      s += sun(140, -140, 36, 10) + puffCloud(-110, -146, 150, 80) + sea + sand + seaStar(150, 100, 26, 10);
      s += scaled(ctx, 1.4, -60, 160, (c) => umbrella(0, 0, 110, c)) + P('M20 132L176 118L192 182L36 196Z') + curve('M56 130L72 192M146 121L162 186', ctx.thin);
      s += scaled(ctx, 1.25, -160, 194, (c) => bucketSpade(0, 0, c)) + shell(120, 172, 1, ctx);
      return s;
    }
    if (st === 1) {
      s += sea + sand + curve('M100 -10L100 -130') + P('M104 -126L104 -16L170 -16Z') + P('M96 -106L96 -16L44 -16Z') + P('M36 -10L176 -10L156 22L56 22Z') + puffCloud(110, -160, 130, 70);
      s += palm(-120, 186, 300, 50, ctx) + sandcastle(80, 190, 1.05, ctx) + shell(-30, 176, 1.1, ctx) + seaStar(176, 110, 22);
      return s;
    }
    if (st === 3) {
      // a lighthouse on rocks, a little boat and gulls
      const lh = P('M90 -20L114 -150L166 -150L190 -20Z') + P('M100 -78L180 -78L184 -56L96 -56Z') + P('M108 -124L172 -124L170 -104L110 -104Z') +
        R(104, -186, 72, 36, 6) + curve('M128 -186L128 -150M152 -186L152 -150', ctx.thin) + P('M96 -186Q140 -230 184 -186Z') + C(140, -214, 8) + P('M124 -20L124 -44Q140 -60 156 -44L156 -20Z');
      s += sea + puffCloud(-100, -150, 150, 76) + curve('M-40 -110q12 -12 24 0q12 -12 24 0M10 -140q10 -10 20 0q10 -10 20 0', ctx.thin);
      s += blob([[60, 40], [70, -10], [120, -22], [200, -18], [200, 60], [150, 70], [96, 66]]) + blob([[30, 60], [40, 30], [76, 26], [90, 60]]) + lh;
      s += sand.replace('Q100 70 200 44', 'Q100 70 200 64') + P('M-150 -24L-40 -24L-60 6L-130 6Z') + curve('M-96 -24L-96 -110') + P('M-90 -106L-90 -30L-40 -30Z') + P('M-102 -94L-102 -30L-140 -30Z');
      s += scaled(ctx, 1.2, -110, 170, (c) => bucketSpade(0, 0, c)) + seaStar(30, 150, 26, 12) + shell(110, 168, 1.1, ctx);
      return s;
    }
    if (st === 4) {
      // a row of beach huts with a towel and a ball
      const hut = (x, w, h, roof) => {
        let t = P(`M${x - w / 2} 70L${x - w / 2} ${70 - h}L${x + w / 2} ${70 - h}L${x + w / 2} 70Z`);
        t += roof ? P(`M${x - w / 2 - 12} ${70 - h}L${x} ${70 - h - 60}L${x + w / 2 + 12} ${70 - h}Z`) : P(`M${x - w / 2 - 10} ${70 - h}L${x - w / 2 - 10} ${70 - h - 22}L${x + w / 2 + 10} ${70 - h - 22}L${x + w / 2 + 10} ${70 - h}Z`);
        t += R(x - 22, 70 - h * 0.66, 44, h * 0.66, 3) + curve(`M${x - 8} ${70 - h * 0.66}L${x - 8} 70M${x + 8} ${70 - h * 0.66}L${x + 8} 70`, ctx.thin) + C(x, 70 - h * 0.82, 9);
        return t;
      };
      s += sun(150, -150, 32, 10) + puffCloud(-120, -150, 140, 70) + P('M-200 -40L200 -40L200 40L-200 40Z') + curve('M-170 -16q20 -12 40 0t40 0M60 -20q20 -12 40 0t40 0', ctx.thin);
      s += hut(-130, 96, 130, true) + hut(0, 100, 150, false) + hut(130, 96, 130, true);
      s += P('M-200 70Q0 54 200 70L200 200L-200 200Z') + P('M-170 120L-30 108L-20 170L-160 184Z') + curve('M-136 117L-126 181M-70 113L-60 175', ctx.thin) + beachBall(70, 150, 40, ctx) + seaStar(160, 110, 22) + shell(150, 176, 0.9, ctx);
      return s;
    }
    s += sun(-140, -140, 34, 10) + puffCloud(110, -150, 140, 70) + sea + sand + sandcastle(10, 172, 1.3, ctx) + scaled(ctx, 1.2, -146, 170, (c) => crab(0, 0, c)) + beachBall(150, 150, 44, ctx) + seaStar(-150, 80, 20) + shell(150, 70, 0.8, ctx);
    return s;
  },
};

const waterfall = {
  id: 'waterfall', name: 'Waterfall', styles: 3, kind: 'ground',
  scenes: ['plain', 'hearts', 'stars', 'forest', 'meadow', 'hills'],
  draw(st, rand, ctx) {
    const pool = (y) => P(`M-200 ${y}Q0 ${y - 30} 200 ${y}L200 200L-200 200Z`) + curve(`M-140 ${y + 30}q20 -10 40 0t40 0M40 ${y + 40}q20 -10 40 0t40 0`, ctx.thin);
    const fall = (x0, x1, yTop, yBot) => {
      let f = P(`M${x0} ${yTop}Q${(x0 + x1) / 2} ${yTop - 16} ${x1} ${yTop}L${x1 + 10} ${yBot}L${x0 - 10} ${yBot}Z`);
      const n = 4;
      for (let i = 1; i < n; i++) { const x = x0 + ((x1 - x0) * i) / n; f += curve(`M${r1(x)} ${yTop + 20}L${r1(x + (i - n / 2) * 4)} ${yBot - 30}`, ctx.thin); }
      return f;
    };
    const foam = (x0, x1, y) => { const pts = []; for (let i = 0; i <= 6; i++) pts.push([x0 + ((x1 - x0) * i) / 6, y]); return P(bumps([[x1, y + 16], ...pts.reverse().map(([x, yy], i) => [x, yy - (i % 2 ? 14 : 4)]), [x0, y + 16]], 0.6, false) + 'Z'); };
    if (st === 0) {
      let s = pool(130);
      s += poly([[-200, 170], [-200, -130], [-170, -160], [-120, -150], [-90, -168], [-60, -112], [-70, -40], [-56, 40], [-80, 110], [-70, 150], [-130, 168]]) + curve('M-150 -90L-120 -70L-126 -40M-170 30L-130 50L-110 40M-180 110L-140 120', ctx.thin);
      s += poly([[200, 170], [200, -100], [170, -140], [130, -126], [96, -146], [60, -100], [72, -30], [58, 50], [80, 116], [72, 150], [130, 166]]) + curve('M150 -60L120 -40L126 -10M170 50L130 70L110 60M180 120L140 130', ctx.thin);
      s += fall(-60, 60, -110, 140) + foam(-90, 90, 140) + E(-150, 180, 30, 14) + E(140, 184, 36, 14) + pine(-150, -152, 70) + pine(-110, -160, 50) + pine(150, -136, 64);
      return s;
    }
    if (st === 1) {
      let s = P('M-200 -40Q-140 -150 -40 -170L40 -170Q140 -150 200 -60L200 120L-200 120Z') + pool(120);
      s += fall(-40, 40, -170, 130) + foam(-80, 80, 130) + bandArc(0, 130, 190, 166) + bandArc(0, 130, 166, 142);
      s += littleFlower(-160, 196, 50) + littleFlower(-120, 190, 40) + littleFlower(160, 196, 46) + E(-60, 176, 24, 12) + E(80, 186, 30, 12);
      return s;
    }
    let s = P('M-200 -150L-80 -190L80 -190L200 -150L200 120L-200 120Z') + R(-200, -40, 400, 30, 0);
    s += pool(130) + fall(-40, 40, -190, -40) + foam(-70, 70, -30) + fall(-70, 70, -20, 140) + foam(-100, 100, 140);
    s += pine(-160, -150, 60) + pine(-120, -160, 80) + roundTree(150, -150, 70) + E(-140, 170, 30, 14) + E(150, 178, 26, 12);
    return s;
  },
};

const nature = {
  id: 'nature', name: 'Nature and weather', order: 52, kind: 'float', icon: 'rainbow',
  scenes: ['plain', 'hearts', 'stars', 'sky', 'meadow', 'hills'],
  pairScenes: [],
  subjects: [rainbowSub, sunSub, rainCloud, snowflake, mountain, volcano, beach, waterfall, lightningCloud],
};

/* ------------------------------------------------------------------------------------------------
 * PATTERNS AND MANDALAS
 * A design is a list of layers drawn from the outside in. Each layer ends by drawing the disc of its
 * inner edge, which hides the bases of its own petals. Frames can be a circle (k = 0) or a polygon.
 * ---------------------------------------------------------------------------------------------- */
const fK = (fr, ang) => {
  if (!fr.k) return 1;
  const seg = (2 * Math.PI) / fr.k;
  let m = rad(ang - fr.rot) % seg;
  if (m < 0) m += seg;
  return Math.cos(Math.PI / fr.k) / Math.cos(m - Math.PI / fr.k);
};
const ppt = (fr, r, ang) => { const rr = r * fK(fr, ang); return [rr * Math.sin(rad(ang)), -rr * Math.cos(rad(ang))]; };
const disc = (fr, r, a = '') => {
  if (!fr.k) return C(0, 0, r, a);
  const pts = [];
  for (let i = 0; i < fr.k; i++) pts.push(ppt(fr, r, fr.rot + (i * 360) / fr.k));
  return poly(pts, a);
};

// Petal shapes in a local frame: u across (-1..1, the petal's share of the ring), v along (0 base .. 1 tip).
const SH = {
  round: ['M', -1, 0, 'C', -1, 0.55, -0.75, 1, 0, 1, 'C', 0.75, 1, 1, 0.55, 1, 0],
  pointed: ['M', -1, 0, 'C', -1, 0.5, -0.35, 0.8, 0, 1, 'C', 0.35, 0.8, 1, 0.5, 1, 0],
  tear: ['M', -0.35, 0, 'C', -1.3, 0.45, -0.8, 1, 0, 1, 'C', 0.8, 1, 1.3, 0.45, 0.35, 0],
  leaf: ['M', 0, 0, 'C', -1.1, 0.3, -0.8, 0.75, 0, 1, 'C', 0.8, 0.75, 1.1, 0.3, 0, 0],
  spike: ['M', -1, 0, 'L', 0, 1, 'L', 1, 0],
  tulip: ['M', -1, 0, 'C', -1.05, 0.6, -0.85, 1, -0.5, 1, 'L', 0, 0.75, 'L', 0.5, 1, 'C', 0.85, 1, 1.05, 0.6, 1, 0],
  onion: ['M', -1, 0, 'C', -1.15, 0.55, -0.25, 0.6, 0, 1, 'C', 0.25, 0.6, 1.15, 0.55, 1, 0],
  heart: ['M', 0, 0, 'C', -0.5, 0.3, -1.05, 0.5, -1, 0.78, 'C', -0.95, 1.02, -0.35, 1.08, 0, 0.82, 'C', 0.35, 1.08, 0.95, 1.02, 1, 0.78, 'C', 1.05, 0.5, 0.5, 0.3, 0, 0],
  heartOut: ['M', 0, 1, 'C', -0.5, 0.7, -1.05, 0.5, -1, 0.22, 'C', -0.95, -0.02, -0.35, -0.08, 0, 0.18, 'C', 0.35, -0.08, 0.95, -0.02, 1, 0.22, 'C', 1.05, 0.5, 0.5, 0.7, 0, 1],
  diamond: ['M', 0, 0, 'L', -1, 0.5, 'L', 0, 1, 'L', 1, 0.5],
  kite: ['M', 0, 0, 'L', -1, 0.35, 'L', 0, 1, 'L', 1, 0.35],
  flame: ['M', -1, 0, 'C', -1, 0.45, 0.2, 0.55, 0, 1, 'C', 0.7, 0.55, 1, 0.4, 1, 0],
  arch: ['M', -1, 0, 'C', -1, 0.75, 1, 0.75, 1, 0],
  bell: ['M', -0.7, 0, 'C', -0.7, 0.5, -1, 0.8, -1, 1, 'L', 1, 1, 'C', 1, 0.8, 0.7, 0.5, 0.7, 0],
  trident: ['M', -1, 0, 'C', -1, 0.6, -0.9, 0.85, -0.6, 1, 'C', -0.5, 0.7, -0.25, 0.65, 0, 1, 'C', 0.25, 0.65, 0.5, 0.7, 0.6, 1, 'C', 0.9, 0.85, 1, 0.6, 1, 0],
  drop: ['M', 0, 0, 'C', -0.4, 0.2, -1, 0.5, -1, 0.72, 'C', -1, 1.02, 1, 1.02, 1, 0.72, 'C', 1, 0.5, 0.4, 0.2, 0, 0],
  blade: ['M', -1, 0, 'C', -0.6, 0.4, -0.4, 0.7, 0.4, 1, 'C', 0.2, 0.7, 0.6, 0.35, 1, 0],
};

/** Path of one shape, mapped into the ring between rb and rt at angle a (half width hw degrees). */
function shapePath(fr, sh, a, hw, rb, rt, su = 1, v0 = 0, sv = 1, open = false) {
  const m = (u, v) => ppt(fr, rb + (v0 + v * sv) * (rt - rb), a + u * su * hw);
  let d = '';
  for (let i = 0; i < sh.length;) {
    const c = sh[i];
    if (c === 'M' || c === 'L') { d += c + fmt(m(sh[i + 1], sh[i + 2])); i += 3; }
    else { d += 'C' + [m(sh[i + 1], sh[i + 2]), m(sh[i + 3], sh[i + 4]), m(sh[i + 5], sh[i + 6])].map(fmt).join(' '); i += 7; }
  }
  return open ? d : d + 'Z';
}

/** A ring of n shapes. o: { sh, wf (width share), off (degrees), detail: 'inner'|'vein'|'dot'|'none', backing }. */
function petals(fr, n, rb, rt, o, ctx) {
  const sh = SH[o.sh] || SH.round, hw = (180 / n) * (o.wf ?? 1);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (o.off || 0) + (i * 360) / n;
    s += P(shapePath(fr, sh, a, hw, rb, rt));
    const vis = o.vis ?? 0; // share of the petal that is hidden at the base
    if (o.detail === 'inner') s += P(shapePath(fr, sh, a, hw, rb, rt, 0.5, vis + (1 - vis) * 0.22, (1 - vis) * 0.62), ctx.thin);
    else if (o.detail === 'vein') s += curve(`M${fmt(ppt(fr, rb + (vis + (1 - vis) * 0.15) * (rt - rb), a))}L${fmt(ppt(fr, rb + 0.82 * (rt - rb), a))}`, ctx.thin);
    else if (o.detail === 'dot') {
      const rr = rb + (vis + (1 - vis) * 0.5) * (rt - rb);
      const wdt = Math.min(rad(hw) * rr * 0.42, (rt - rb) * (1 - vis) * 0.2);
      s += C(...ppt(fr, rr, a), Math.max(6, wdt), ctx.thin);
    } else if (o.detail === 'double') {
      s += P(shapePath(fr, sh, a, hw, rb, rt, 0.72, vis + (1 - vis) * 0.12, 0.84 - vis * 0.84 + vis * 0.0), ctx.thin);
    }
  }
  return s;
}

/** Decoration inside a band between rIn and rOut. */
function bandDeco(fr, rIn, rOut, deco, n, off, ctx) {
  const rm = (rIn + rOut) / 2, w = rOut - rIn;
  let s = '';
  const step = 360 / n;
  if (deco === 'spokes') {
    for (let i = 0; i < n; i++) { const a = off + i * step; s += curve(`M${fmt(ppt(fr, rIn, a))}L${fmt(ppt(fr, rOut, a))}`); }
  } else if (deco === 'zigzag') {
    const pts = [];
    for (let i = 0; i < n * 2; i++) pts.push(ppt(fr, i % 2 ? rIn : rOut, off + (i * step) / 2));
    s += poly(pts);
  } else if (deco === 'wave') {
    const pts = [];
    const N = n * 8;
    for (let i = 0; i < N; i++) { const a = off + (i * 360) / N; pts.push(ppt(fr, rm + Math.cos(rad((a - off) * n)) * w * 0.32, a)); }
    s += blob(pts);
  } else if (deco === 'dots' || deco === 'stars' || deco === 'hearts' || deco === 'rings') {
    const arc = (rad(step) * rm) / 2;
    const rr = Math.max(6, Math.min(w * (deco === 'dots' || deco === 'rings' ? 0.36 : 0.42), arc * 0.62));
    for (let i = 0; i < n; i++) {
      const a = off + i * step, [x, y] = ppt(fr, rm, a);
      if (deco === 'dots') s += C(x, y, rr);
      else if (deco === 'rings') s += C(x, y, rr) + C(x, y, rr * 0.45, ctx.thin);
      else if (deco === 'stars') s += star(x, y, rr * 1.35, rr * 0.6, 5, '', a - 90);
      else s += g(heart(0, 4, rr * 2.2), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
    }
  } else if (deco === 'arches') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.arch, off + i * step, step / 2, rIn, rOut + w * 0.25));
  } else if (deco === 'scales') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.round, off + i * step, step / 2, rIn, rOut - w * 0.05), ctx.thin);
  } else if (deco === 'diamonds') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.diamond, off + i * step, step * 0.45, rIn + w * 0.1, rOut - w * 0.1));
  } else if (deco === 'leaves') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.leaf, off + i * step, step * 0.42, rIn + w * 0.08, rOut - w * 0.08));
  } else if (deco === 'drops') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.drop, off + i * step, step * 0.36, rIn + w * 0.12, rOut - w * 0.1));
  } else if (deco === 'xcross') {
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      s += curve(`M${fmt(ppt(fr, rIn, a - step / 2))}L${fmt(ppt(fr, rOut, a + step / 2))}M${fmt(ppt(fr, rOut, a - step / 2))}L${fmt(ppt(fr, rIn, a + step / 2))}`);
    }
  } else if (deco === 'braid') {
    for (let i = 0; i < n; i++) s += P(shapePath(fr, SH.blade, off + i * step, step * 0.75, rIn, rOut), ctx.thin);
  } else if (deco === 'checker') {
    for (let i = 0; i < n; i++) {
      const a = off + i * step;
      s += curve(`M${fmt(ppt(fr, rIn, a))}L${fmt(ppt(fr, rOut, a))}`);
    }
    const mid = [];
    for (let i = 0; i < 96; i++) mid.push(ppt(fr, rm, (i * 360) / 96));
    s += fr.k ? disc(fr, rm, 'fill="none"') : C(0, 0, rm, 'fill="none"');
  }
  return s;
}

/** Draw a design: layers from the outside in. */
function drawDesign(fr, layers, ctx) {
  let s = '';
  for (const L of layers) {
    if (L.t === 'frame') s += disc(fr, L.r);
    else if (L.t === 'petals') {
      const rb = L.rb - (L.hide ?? 14);
      const o = { ...L, vis: (L.rb - rb) / (L.rt - rb) };
      if (L.back) s += disc(fr, L.rt + (L.back === true ? 0 : L.back));
      s += petals(L.fr || fr, L.n, rb, L.rt, o, ctx);
      if (L.inner !== false) s += disc(fr, L.rb);
    } else if (L.t === 'band') {
      s += disc(fr, L.rOut) + bandDeco(fr, L.rIn, L.rOut, L.deco, L.n, L.off || 0, ctx) + disc(fr, L.rIn);
    } else if (L.t === 'svg') s += L.svg;
  }
  return s;
}

/** Centre motifs. */
function centre(kind, r, n, off, ctx) {
  const fr = { k: 0 };
  if (kind === 'flower') return petals(fr, n, 0, r, { sh: 'round', off }, ctx) + C(0, 0, r * 0.38);
  if (kind === 'pointflower') return petals(fr, n, 0, r, { sh: 'pointed', off }, ctx) + C(0, 0, r * 0.34);
  if (kind === 'star') return C(0, 0, r) + star(0, 0, r * 0.9, r * 0.45, n, '', off - 90) + (r > 34 ? C(0, 0, r * 0.22) : '');
  if (kind === 'heart') return C(0, 0, r) + heart(0, r * 0.08, r * 1.25);
  if (kind === 'target') return C(0, 0, r) + C(0, 0, r * 0.55);
  if (kind === 'dots') {
    let s = C(0, 0, r) + C(0, 0, r * 0.3);
    for (let i = 0; i < n; i++) s += C(...ppt(fr, r * 0.66, off + (i * 360) / n), r * 0.17);
    return s;
  }
  return C(0, 0, r);
}

/* ---- Composers: one per subject. Each turns a style number into a clearly different design. ---- */

// Cycle choices with the style number so that neighbouring pages differ, with a seeded shuffle for the rest.
const pickBy = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length];

const DETAIL_OK = { round: ['inner', 'dot', 'vein', 'double'], pointed: ['inner', 'vein', 'double', 'dot'], tear: ['inner', 'dot'], onion: ['inner', 'vein', 'dot'], heart: ['inner', 'dot', 'none'], tulip: ['dot', 'vein', 'none'], trident: ['vein', 'none'], spike: ['vein', 'inner', 'none'], leaf: ['vein'], kite: ['vein', 'inner'], diamond: ['inner', 'none'], flame: ['none', 'dot'], drop: ['inner', 'dot'], heartOut: ['inner', 'dot'], bell: ['dot', 'none'], arch: ['none'] };
const detailFor = (r, sh) => r.pick(DETAIL_OK[sh] || ['none']);
const half = (N) => (N % 2 === 0 && N / 2 >= 5 ? N / 2 : N);

function flowerDesign(style) {
  const r = rng(`flower-mandala-${style}`);
  const N = pickBy([8, 6, 10, 12, 8, 16, 6, 10, 12, 8, 5, 9], style);
  const big = N >= 12;
  const outerSh = big ? pickBy(['round', 'pointed', 'onion', 'tear'], style) : pickBy(['round', 'pointed', 'tulip', 'onion', 'tear', 'trident', 'round', 'pointed'], style + Math.floor(style / 8));
  const L = [];
  let rb;
  const outerMode = pickBy(['leaves', 'double', 'single', 'scallop'], Math.floor(style / 2) + style);
  if (outerMode === 'leaves') {
    L.push({ t: 'petals', n: N, rb: 120, rt: 196, sh: 'leaf', off: 180 / N, detail: 'vein', inner: false, wf: 0.9 });
    L.push({ t: 'petals', n: N, rb: 120, rt: 178, sh: outerSh, detail: detailFor(r, outerSh) });
    rb = 120;
  } else if (outerMode === 'double') {
    L.push({ t: 'petals', n: N, rb: 132, rt: 196, sh: 'pointed', off: 180 / N, inner: false, detail: 'vein' });
    L.push({ t: 'petals', n: N, rb: 132, rt: 184, sh: outerSh, detail: detailFor(r, outerSh) });
    rb = 132;
  } else if (outerMode === 'single') {
    L.push({ t: 'petals', n: N, rb: 128, rt: 196, sh: outerSh, detail: detailFor(r, outerSh), back: r.chance(0.5) });
    rb = 128;
  } else {
    const n2 = big ? N : N * 2;
    L.push({ t: 'petals', n: n2, rb: 166, rt: 196, sh: 'round', detail: 'none' });
    L.push({ t: 'band', rOut: 166, rIn: 140, deco: r.pick(['dots', 'leaves', 'drops']), n: n2, off: 180 / n2 });
    const sh = big ? 'pointed' : outerSh;
    L.push({ t: 'petals', n: N, rb: 100, rt: 152, sh, detail: detailFor(r, sh) });
    rb = 100;
  }
  let cur = rb;
  if (cur > 110 && r.chance(0.75)) {
    const w = r.range(22, 28);
    L.push({ t: 'band', rOut: cur, rIn: cur - w, deco: r.pick(['spokes', 'zigzag', 'dots', 'wave', 'scales', 'arches']), n: big ? N : N * 2, off: 0 });
    cur -= w;
  }
  const mN = r.pick([N, half(N)]);
  const mSh = r.pick(['round', 'pointed', 'heart', 'tear', 'onion']);
  const mTop = cur + (r.chance(0.5) ? 12 : 0);
  const mBase = Math.max(48, cur - r.range(38, 50));
  L.push({ t: 'petals', n: mN, rb: mBase, rt: mTop, sh: mSh, off: 180 / mN, detail: detailFor(r, mSh) });
  cur = mBase;
  if (cur > 60) {
    L.push({ t: 'band', rOut: cur, rIn: cur - 18, deco: r.pick(['dots', 'spokes', 'zigzag']), n: N >= 10 ? N : N * 2, off: 0 });
    cur -= 18;
  }
  L.push({ t: 'svg', svg: centre(r.pick(['flower', 'pointflower', 'dots', 'flower']), cur, r.pick([5, 6, 8]), 0) });
  return L;
}

function starDesign(style, ctx) {
  const r = rng(`star-mandala-${style}`);
  const N = pickBy([5, 8, 6, 10, 7, 12, 5, 9, 8, 6, 10, 5], style);
  const L = [];
  const mode = pickBy(['bigstar', 'compass', 'ringed', 'burst', 'double'], style + Math.floor(style / 5));
  let cur;
  if (mode === 'bigstar') {
    if (r.chance(0.6)) L.push({ t: 'petals', n: N, rb: 112, rt: 158, sh: 'spike', off: 180 / N, inner: false, detail: 'none' });
    L.push({ t: 'petals', n: N, rb: 112, rt: 198, sh: 'spike', detail: 'vein' });
    cur = 112;
  } else if (mode === 'compass') {
    L.push({ t: 'petals', n: N, rb: 120, rt: 170, sh: 'kite', off: 180 / N, inner: false, detail: 'vein', wf: 0.8 });
    L.push({ t: 'petals', n: N, rb: 120, rt: 198, sh: 'kite', detail: 'vein', wf: 0.75 });
    cur = 120;
  } else if (mode === 'ringed') {
    L.push({ t: 'frame', r: 196 });
    L.push({ t: 'band', rOut: 196, rIn: 160, deco: 'stars', n: N * 2 > 14 ? N : N * 2, off: 0 });
    L.push({ t: 'petals', n: N, rb: 100, rt: 160, sh: 'spike', detail: 'vein', back: false });
    cur = 100;
  } else if (mode === 'burst') {
    const n2 = N * 2 > 20 ? N : N * 2;
    L.push({ t: 'petals', n: n2, rb: 150, rt: 196, sh: 'spike', detail: 'none' });
    L.push({ t: 'band', rOut: 150, rIn: 118, deco: r.pick(['dots', 'stars', 'zigzag']), n: n2, off: 180 / n2 });
    cur = 118;
  } else {
    L.push({ t: 'petals', n: N, rb: 130, rt: 198, sh: 'spike', detail: 'vein', wf: 1 });
    L.push({ t: 'petals', n: N, rb: 100, rt: 150, sh: 'spike', off: 180 / N, detail: 'vein', wf: 1 });
    cur = 100;
  }
  if (cur > 105) {
    const deco = r.pick(['stars', 'zigzag', 'dots', 'spokes', 'diamonds']);
    const w = deco === 'stars' ? 32 : 24;
    L.push({ t: 'band', rOut: cur, rIn: cur - w, deco, n: deco === 'stars' || N * 2 > 16 ? N : N * 2, off: 0 });
    cur -= w;
  }
  // inner star ring
  const base = Math.max(46, cur - 40);
  L.push({ t: 'petals', n: N, rb: base, rt: cur + (r.chance(0.5) ? 10 : 0), sh: r.pick(['spike', 'kite', 'pointed']), off: mode === 'burst' ? 0 : 180 / N, detail: 'vein' });
  cur = base;
  if (cur > 58) { L.push({ t: 'band', rOut: cur, rIn: cur - 16, deco: r.pick(['dots', 'spokes']), n: N * 2, off: 0 }); cur -= 16; }
  L.push({ t: 'svg', svg: centre('star', cur, N >= 9 ? half(N) : N, 0) });
  return L;
}

function heartDesign(style) {
  const r = rng(`heart-mandala-${style}`);
  const N = pickBy([6, 8, 7, 10, 7, 6, 8, 12, 9, 6], style);
  const hwf = (rb, rt) => Math.min(1, (1.15 * (rt - rb + 14) * N) / (2 * Math.PI * ((rb + rt) / 2)));
  const L = [];
  const mode = pickBy(['hearts', 'heartsOut', 'scallop', 'petalHearts'], style + Math.floor(style / 4));
  let cur;
  if (mode === 'hearts') {
    if (r.chance(0.5)) L.push({ t: 'frame', r: 198 });
    L.push({ t: 'petals', n: N, rb: 110, rt: 196, sh: 'heart', detail: r.pick(['inner', 'dot']), hide: 30, wf: hwf(110, 196) });
    cur = 110;
  } else if (mode === 'heartsOut') {
    L.push({ t: 'petals', n: N, rb: 120, rt: 198, sh: 'heartOut', detail: 'inner', hide: 4, inner: false, wf: hwf(120, 198) });
    L.push({ t: 'frame', r: 126 });
    cur = 126;
  } else if (mode === 'scallop') {
    const n2 = N * 2 > 16 ? N : N * 2;
    L.push({ t: 'petals', n: n2, rb: 166, rt: 196, sh: 'round', detail: 'none' });
    L.push({ t: 'band', rOut: 166, rIn: 126, deco: 'hearts', n: n2, off: 180 / n2 });
    cur = 126;
  } else {
    L.push({ t: 'petals', n: N, rb: 125, rt: 196, sh: r.pick(['round', 'onion']), detail: 'none', off: 180 / N });
    L.push({ t: 'petals', n: N, rb: 125, rt: 182, sh: 'heart', detail: 'inner', hide: 24, wf: hwf(125, 182) });
    cur = 125;
  }
  if (cur > 110) {
    const deco = r.pick(['hearts', 'dots', 'wave', 'scales', 'arches']);
    const w = deco === 'hearts' ? 32 : 24;
    L.push({ t: 'band', rOut: cur, rIn: cur - w, deco, n: N * 2 > 16 ? N : N * 2, off: 0 });
    cur -= w;
  }
  const base = Math.max(50, cur - 42);
  const sh = r.pick(['heart', 'round', 'heart', 'drop']);
  const nn = half(N) === N ? N : r.pick([N, half(N)]);
  L.push({ t: 'petals', n: nn, rb: base, rt: cur + 8, sh, off: 180 / N, detail: detailFor(r, sh), hide: sh === 'heart' ? 22 : 14, wf: sh === 'heart' ? Math.min(1, (1.15 * (cur + 8 - base + 22) * nn) / (2 * Math.PI * ((base + cur) / 2))) : 1 });
  cur = base;
  if (cur > 58) { L.push({ t: 'band', rOut: cur, rIn: cur - 16, deco: r.pick(['dots', 'spokes']), n: N * 2, off: 0 }); cur -= 16; }
  L.push({ t: 'svg', svg: r.chance(0.6) ? centre('heart', cur) : petals({ k: 0 }, 5, 0, cur, { sh: 'heart', off: 0 }, { thin: '' }) });
  return L;
}

function sunFace(rr, variant, ctx) {
  let s = C(0, 0, rr);
  const ex = rr * 0.34, ey = -rr * 0.12, er = rr * 0.12;
  if (variant === 0) s += dotEye(-ex, ey, er) + dotEye(ex, ey, er);
  else if (variant === 1) s += curve(`M${r1(-ex - er)} ${r1(ey)}Q${r1(-ex)} ${r1(ey - er * 1.3)} ${r1(-ex + er)} ${r1(ey)}M${r1(ex - er)} ${r1(ey)}Q${r1(ex)} ${r1(ey - er * 1.3)} ${r1(ex + er)} ${r1(ey)}`);
  else if (variant === 2) s += dotEye(-ex, ey, er) + curve(`M${r1(ex - er)} ${r1(ey)}Q${r1(ex)} ${r1(ey - er * 1.3)} ${r1(ex + er)} ${r1(ey)}`);
  else {
    // sunglasses
    s += P(`M${r1(-ex - rr * 0.24)} ${r1(ey - rr * 0.12)}L${r1(-rr * 0.08)} ${r1(ey - rr * 0.12)}Q${r1(-rr * 0.1)} ${r1(ey + rr * 0.22)} ${r1(-ex)} ${r1(ey + rr * 0.2)}Q${r1(-ex - rr * 0.26)} ${r1(ey + rr * 0.16)} ${r1(-ex - rr * 0.24)} ${r1(ey - rr * 0.12)}Z`);
    s += P(`M${r1(ex + rr * 0.24)} ${r1(ey - rr * 0.12)}L${r1(rr * 0.08)} ${r1(ey - rr * 0.12)}Q${r1(rr * 0.1)} ${r1(ey + rr * 0.22)} ${r1(ex)} ${r1(ey + rr * 0.2)}Q${r1(ex + rr * 0.26)} ${r1(ey + rr * 0.16)} ${r1(ex + rr * 0.24)} ${r1(ey - rr * 0.12)}Z`);
    s += curve(`M${r1(-rr * 0.08)} ${r1(ey - rr * 0.08)}L${r1(rr * 0.08)} ${r1(ey - rr * 0.08)}`);
  }
  s += C(-rr * 0.55, rr * 0.2, rr * 0.13, ctx.thin) + C(rr * 0.55, rr * 0.2, rr * 0.13, ctx.thin);
  s += P(`M${r1(-rr * 0.3)} ${r1(rr * 0.22)}Q0 ${r1(rr * 0.62)} ${r1(rr * 0.3)} ${r1(rr * 0.22)}Q0 ${r1(rr * 0.36)} ${r1(-rr * 0.3)} ${r1(rr * 0.22)}Z`);
  return s;
}

function sunDesign(style, ctx) {
  const r = rng(`sun-mandala-${style}`);
  const N = pickBy([12, 16, 10, 8, 14, 12, 18, 10, 9, 16, 12, 8], style);
  const L = [];
  const mode = pickBy(['alt', 'flame', 'wavy', 'ringed', 'double'], style + Math.floor(style / 5));
  let cur;
  if (mode === 'alt') {
    L.push({ t: 'petals', n: N, rb: 112, rt: 168, sh: 'spike', off: 180 / N, inner: false, detail: 'none' });
    L.push({ t: 'petals', n: N, rb: 112, rt: 198, sh: r.pick(['spike', 'onion']), detail: 'vein' });
    cur = 112;
  } else if (mode === 'flame') {
    L.push({ t: 'petals', n: N, rb: 118, rt: 198, sh: 'flame', detail: 'none', wf: 1 });
    cur = 118;
  } else if (mode === 'wavy') {
    L.push({ t: 'petals', n: N, rb: 120, rt: 198, sh: 'blade', detail: 'none', wf: 1 });
    L.push({ t: 'band', rOut: 120, rIn: 100, deco: 'zigzag', n: N, off: 0 });
    cur = 100;
  } else if (mode === 'ringed') {
    L.push({ t: 'frame', r: 196 });
    L.push({ t: 'band', rOut: 196, rIn: 168, deco: r.pick(['dots', 'rings']), n: N, off: 0 });
    L.push({ t: 'petals', n: N, rb: 112, rt: 168, sh: 'spike', detail: 'vein', off: 180 / N });
    cur = 112;
  } else {
    L.push({ t: 'petals', n: N, rb: 140, rt: 198, sh: 'spike', detail: 'inner' });
    L.push({ t: 'band', rOut: 140, rIn: 116, deco: r.pick(['dots', 'spokes', 'wave']), n: N, off: 180 / N });
    cur = 116;
  }
  const faceR = pickBy([72, 62, 80, 66], style);
  const withFace = style % 3 !== 2;
  if (withFace) {
    if (cur - faceR > 30) {
      const n2 = r.pick([N, N * 2 > 24 ? N : N * 2]);
      L.push({ t: 'petals', n: n2, rb: faceR, rt: cur + 6, sh: r.pick(['spike', 'round', 'pointed']), off: 180 / n2, detail: 'none' });
    } else if (cur - faceR > 14) L.push({ t: 'band', rOut: cur, rIn: faceR, deco: 'dots', n: N, off: 0 });
    L.push({ t: 'svg', svg: sunFace(faceR, Math.floor(style / 3) % 4, ctx) });
  } else {
    L.push({ t: 'band', rOut: cur, rIn: cur - 22, deco: r.pick(['zigzag', 'dots', 'wave']), n: N, off: 0 });
    cur -= 22;
    const base = cur - 34;
    L.push({ t: 'petals', n: half(N), rb: base, rt: cur + 6, sh: 'flame', detail: 'none' });
    L.push({ t: 'svg', svg: centre(r.pick(['target', 'dots', 'flower']), base, 6, 0) });
  }
  return L;
}

/* Simple animals for the middle of an animal mandala, drawn inside a circle of radius about 100. */
const ANIMALS = {
  cat(ctx) {
    let s = mirrorX(poly([[-72, -20], [-64, -96], [-16, -60]]) + poly([[-60, -38], [-58, -78], [-32, -58]], ctx.thin)) + poly([[-72, -20], [-64, -96], [-16, -60]]) + poly([[-60, -38], [-58, -78], [-32, -58]], ctx.thin);
    s += E(0, 8, 80, 66) + eye(-30, -6, 14, [0, 0.2]) + eye(30, -6, 14, [0, 0.2]);
    s += P('M-9 18L9 18L0 28Z') + curve('M0 28Q-6 42 -20 38M0 28Q6 42 20 38', ctx.thin);
    s += curve('M-42 24L-92 12M-42 34L-92 40M42 24L92 12M42 34L92 40', ctx.thin);
    return s;
  },
  owl(ctx) {
    let s = R(-62, 80, 124, 18, 9) + mirrorX(poly([[-48, -50], [-58, -92], [-20, -66]])) + poly([[-48, -50], [-58, -92], [-20, -66]]);
    s += E(0, 12, 64, 80);
    s += mirrorX(blob([[-56, -10], [-80, 30], [-70, 66], [-44, 72], [-40, 24]])) + blob([[-56, -10], [-80, 30], [-70, 66], [-44, 72], [-40, 24]]);
    s += E(0, 42, 36, 36) + curve('M-20 30q10 8 20 0q10 8 20 0M-24 48q12 8 24 0q12 8 24 0', ctx.thin);
    s += C(-27, -22, 25) + C(27, -22, 25) + eye(-27, -22, 12) + eye(27, -22, 12) + poly([[-9, -4], [9, -4], [0, 12]]);
    s += E(-18, 90, 10, 7) + E(18, 90, 10, 7);
    return s;
  },
  turtle(ctx) {
    let s = '';
    for (const [x, y, a] of [[-55, -42, -40], [55, -42, 40], [-55, 58, 40], [55, 58, -40]]) s += g(E(0, 0, 16, 24), `translate(${x} ${y}) rotate(${a})`);
    s += poly([[-8, 76], [8, 76], [0, 96]]) + E(0, -80, 22, 22) + dotEye(-8, -84, 4) + dotEye(8, -84, 4) + smile(0, -74, 12, 0.4);
    s += E(0, 8, 64, 76) + E(0, 8, 50, 62, ctx.thin);
    const hex = []; for (let i = 0; i < 6; i++) hex.push([Math.cos(rad(i * 60 + 30)) * 24, 8 + Math.sin(rad(i * 60 + 30)) * 28]);
    s += poly(hex);
    for (const [x, y] of hex) { const L = Math.hypot(x, y - 8); s += curve(`M${r1(x)} ${r1(y)}L${r1((x / L) * 50 * 1.0 * (Math.abs(x) / L > 0.5 ? 1 : 1))} ${r1(8 + ((y - 8) / L) * 62)}`, ctx.thin); }
    return s;
  },
  butterfly(ctx) {
    const half = blob([[-6, -10], [-36, -74], [-84, -76], [-92, -32], [-50, 2]]) + blob([[-6, 6], [-56, 14], [-78, 54], [-42, 78], [-10, 40]]) + C(-58, -40, 15) + C(-46, 44, 12);
    let s = half + mirrorX(half);
    s += curve('M-4 -58Q-14 -84 -30 -90M4 -58Q14 -84 30 -90') + C(-30, -90, 6) + C(30, -90, 6);
    s += E(0, 4, 10, 56) + C(0, -60, 14) + dotEye(-5, -62, 3) + dotEye(5, -62, 3);
    return s;
  },
  fish(ctx) {
    let s = P('M-20 -44Q10 -88 42 -34Z') + P('M58 0L98 -42Q86 0 98 42Z') + P('M0 42Q20 70 34 34Z');
    s += blob([[-82, 2], [-56, -40], [0, -50], [50, -30], [66, 0], [50, 30], [0, 48], [-56, 38]]);
    s += eye(-46, -10, 13) + smile(-62, 16, 16, 0.4) + curve('M-28 -30Q-14 0 -28 32', ctx.thin);
    s += curve('M0 -20q10 10 0 20M18 -24q10 12 0 24M0 4q10 10 0 20M36 -12q8 10 0 20', ctx.thin);
    s += C(-80, -62, 9) + C(-62, -82, 6);
    return s;
  },
  bunny(ctx) {
    let s = '';
    for (const sd of [-1, 1]) s += g(E(0, 0, 18, 50) + E(0, 6, 9, 36, ctx.thin), `translate(${sd * 28} -50) rotate(${sd * 12})`);
    s += E(0, 34, 70, 58) + dotEye(-26, 22, 8) + dotEye(26, 22, 8);
    s += P('M-9 42Q0 36 9 42Q0 54 -9 42Z') + curve('M0 50Q-6 62 -16 60M0 50Q6 62 16 60', ctx.thin) + R(-8, 60, 16, 12, 2, ctx.thin);
    s += C(-44, 48, 10, ctx.thin) + C(44, 48, 10, ctx.thin);
    return s;
  },
  bear(ctx) {
    let s = C(-56, -46, 24) + C(56, -46, 24) + C(-56, -46, 12, ctx.thin) + C(56, -46, 12, ctx.thin);
    s += E(0, 8, 78, 70) + E(0, 34, 34, 26) + dark(E(0, 22, 12, 8)) + curve('M0 30L0 40M-12 44Q0 52 12 44', ctx.thin);
    s += dotEye(-30, -6, 8) + dotEye(30, -6, 8) + C(-52, 26, 10, ctx.thin) + C(52, 26, 10, ctx.thin);
    return s;
  },
  lion(ctx) {
    let s = petals({ k: 0 }, 14, 50, 98, { sh: 'round', detail: 'vein', vis: 0.3 }, ctx);
    s += C(-42, -40, 15) + C(42, -40, 15) + C(-42, -40, 7, ctx.thin) + C(42, -40, 7, ctx.thin);
    s += C(0, 4, 60) + dotEye(-22, -8, 7) + dotEye(22, -8, 7);
    s += C(-13, 28, 15) + C(13, 28, 15) + P('M-12 10L12 10L0 22Z') + curve('M0 22L0 30', ctx.thin);
    return s;
  },

  fox(ctx) {
    let s = mirrorX(poly([[-74, -24], [-70, -96], [-24, -52]]) + poly([[-64, -40], [-63, -80], [-38, -56]], ctx.thin)) + poly([[-74, -24], [-70, -96], [-24, -52]]) + poly([[-64, -40], [-63, -80], [-38, -56]], ctx.thin);
    s += P('M-86 -20Q-70 40 0 82Q70 40 86 -20Q50 -60 0 -56Q-50 -60 -86 -20Z');
    s += curve('M-84 -16Q-40 6 -18 46Q-8 30 0 30Q8 30 18 46Q40 6 84 -16');
    s += dotEye(-32, -14, 8) + dotEye(32, -14, 8) + dark(E(0, 70, 10, 7));
    return s;
  },
  elephant(ctx) {
    let s = mirrorX(blob([[-40, -40], [-96, -60], [-104, 10], [-80, 50], [-44, 30]])) + blob([[-40, -40], [-96, -60], [-104, 10], [-80, 50], [-44, 30]]);
    s += E(0, -6, 60, 58) + tube([[0, 20], [0, 54], [14, 78], [34, 80]], 28);
    s += dotEye(-24, -12, 8) + dotEye(24, -12, 8) + C(-36, 14, 9, ctx.thin) + C(36, 14, 9, ctx.thin);
    s += curve('M-6 46L6 46M-6 60L8 58', ctx.thin);
    return s;
  },
  bird(ctx) {
    let s = R(-64, 66, 128, 16, 8) + curve('M-14 52L-16 68M14 52L16 68');
    s += P('M46 4L96 -22L88 16L98 36Z');
    s += P('M-30 -56Q-34 -84 -16 -86Q-20 -70 -8 -62Z') + P('M-14 -60Q-4 -88 12 -80Q0 -70 2 -60Z');
    s += C(0, 0, 62) + P('M-46 26Q-20 58 20 50Q-10 40 -46 26Z', ctx.thin);
    s += P('M-4 4Q26 -16 58 6Q48 40 8 38Q-10 26 -4 4Z') + curve('M10 16Q30 12 44 18M14 28Q30 24 40 30', ctx.thin);
    s += eye(-28, -18, 12) + poly([[-58, -8], [-90, 0], [-58, 10]]);
    return s;
  },

  snail(ctx) {
    let s = curve('M-58 0Q-66 -40 -76 -52M-42 0Q-44 -42 -48 -58') + C(-76, -56, 8) + C(-48, -62, 8);
    s += P('M-94 70Q-96 20 -64 -6Q-36 -14 -30 30L60 40Q96 46 94 70Z');
    s += C(22, -6, 60);
    const sp = [];
    for (let t = 0; t <= 2.6 * Math.PI; t += 0.25) { const rr = 50 - t * 5.6; sp.push([22 + Math.cos(t + 1) * rr, -6 + Math.sin(t + 1) * rr]); }
    s += smooth(sp);
    s += dotEye(-62, 12, 7) + smile(-60, 30, 18, 0.4);
    return s;
  },

};
const ANIMAL_LIST = ['cat', 'owl', 'turtle', 'butterfly', 'fish', 'bunny', 'bear', 'lion', 'fox', 'elephant', 'bird', 'snail'];

function animalDesign(style, ctx) {
  const r = rng(`animal-mandala-${style}`);
  const animal = ANIMAL_LIST[style % ANIMAL_LIST.length];
  const set = Math.floor(style / ANIMAL_LIST.length);
  const N = pickBy([12, 10, 16, 8, 12, 14], style + set * 3);
  const L = [];
  const ra = 114;
  if (set === 0) {
    L.push({ t: 'petals', n: N, rb: 150, rt: 196, sh: pickBy(['round', 'onion', 'pointed', 'heart', 'tulip', 'round'], style), detail: 'none', hide: 18 });
    L.push({ t: 'band', rOut: 150, rIn: ra + 8, deco: pickBy(['dots', 'zigzag', 'hearts', 'stars', 'leaves', 'spokes'], style), n: N * 2 > 24 ? N : N * 2, off: 0 });
  } else {
    L.push({ t: 'frame', r: 196 });
    L.push({ t: 'band', rOut: 196, rIn: 168, deco: pickBy(['scales', 'wave', 'dots', 'arches', 'zigzag', 'rings'], style), n: N, off: 0 });
    L.push({ t: 'petals', n: N, rb: ra + 8, rt: 168, sh: pickBy(['pointed', 'round', 'spike', 'tear', 'kite', 'onion'], style), detail: r.pick(['vein', 'none', 'dot']), off: 180 / N });
  }
  L.push({ t: 'frame', r: ra });
  const k = 1.0;
  L.push({ t: 'svg', svg: scaled(ctx, k, 0, 0, (c) => ANIMALS[animal](c)) });
  return L;
}

/* Geometric patterns use polygon frames and straight-edged shapes: six layouts in four frames. */
SH.pin = ['M', -1, 0, 'L', 1, 1, 'L', 1, 0];
SH.chevron = ['M', -1, 0, 'L', 0, 0.4, 'L', 1, 0, 'L', 1, 0.6, 'L', 0, 1, 'L', -1, 0.6];
SH.tri = ['M', -1, 0, 'L', 0, 1, 'L', 1, 0];
function geoDesign(style) {
  const r = rng(`geo-pattern-${style}`);
  const frames = [{ k: 4, rot: 45, R: 262 }, { k: 6, rot: 0, R: 206 }, { k: 8, rot: 22.5, R: 206 }, { k: 0, rot: 0, R: 196, n: 12 }];
  const F = frames[style % 4];
  const layout = Math.floor(style / 4) % 6;
  const fr = { k: F.k, rot: F.rot };
  const n = F.k === 4 ? 8 : F.k || F.n; // symmetry
  const vert = F.rot, mid = F.rot + 180 / n; // angles of the frame's corners and edge middles
  const L = [];
  let cur = F.R;
  const sc = F.R / 206; // radius scale so layouts fit each frame
  const innerStar = (rTop, rBase, off, sh = 'spike') => {
    L.push({ t: 'petals', n, rb: rBase, rt: rTop, sh, detail: 'vein', off, wf: 1 });
  };
  const centrePiece = (rr) => {
    const cf = { k: F.k || 6, rot: (F.k ? F.rot : 0) + 180 / (F.k || 6) };
    L.push({ t: 'svg', svg: disc(cf, rr) + petals(cf, F.k || 6, 0, rr * 0.92, { sh: 'spike' }, { thin: '' }) + C(0, 0, rr * 0.3) });
  };
  if (layout === 0) {
    // nested turned frames, star, centre
    const kk = F.k || 8;
    const f2 = { k: kk, rot: F.k ? vert : 0 }, f3 = { k: kk, rot: f2.rot + 180 / kk };
    let c = cur;
    L.push({ t: 'svg', svg: disc(f2, c) });
    for (let i = 0; i < 2; i++) { c *= Math.cos(Math.PI / kk); L.push({ t: 'svg', svg: disc(i % 2 ? f2 : f3, c) }); }
    const fIn = f2;
    L.push({ t: 'svg', svg: bandDeco(fIn, c * 0.62, c, 'spokes', kk * 2, f2.rot, { thin: '' }) });
    cur = c * 0.62;
    L.push({ t: 'svg', svg: disc(fIn, cur) });
    L.push({ t: 'svg', svg: petals(fIn, kk, cur * 0.5 - 10, cur, { sh: 'kite', detail: 'vein', off: f3.rot, vis: 10 / (cur * 0.5 + 10) }, { thin: '' }) });
    centrePiece(cur * 0.5);
  } else if (layout === 1) {
    // trapezoid bands
    L.push({ t: 'band', rOut: cur, rIn: cur - 40 * sc, deco: 'spokes', n: n * 2, off: vert });
    cur -= 40 * sc;
    L.push({ t: 'band', rOut: cur, rIn: cur - 36 * sc, deco: 'zigzag', n, off: mid });
    cur -= 36 * sc;
    innerStar(cur, cur - 50 * sc, vert);
    cur -= 50 * sc;
    centrePiece(cur);
  } else if (layout === 2) {
    // a big star reaching the corners, with diamonds between the points
    L.push({ t: 'frame', r: cur });
    L.push({ t: 'petals', n, rb: cur * 0.55, rt: cur, sh: 'spike', detail: 'vein', off: vert, inner: false, wf: 1 });
    L.push({ t: 'petals', n, rb: cur * 0.55, rt: cur * 0.86, sh: 'diamond', detail: 'none', off: mid, inner: true, wf: 0.55, hide: 0 });
    cur *= 0.55;
    L.push({ t: 'band', rOut: cur, rIn: cur - 22 * sc, deco: 'spokes', n, off: mid });
    cur -= 22 * sc;
    innerStar(cur, cur * 0.55, mid, 'kite');
    centrePiece(cur * 0.55);
  } else if (layout === 3) {
    // pinwheel (inside a circle when the frame is a square)
    const fP = F.k === 4 ? { k: 0, rot: 0 } : fr;
    let c = F.k === 4 ? cur * Math.cos(Math.PI / 4) : cur;
    let sv = disc(fr, cur) + disc(fP, c);
    if (F.k === 4) for (let i = 0; i < 4; i++) sv += C(...ppt(fr, cur * 0.86, 45 + i * 90), 22);
    sv += petals(fP, n, c * 0.6, c, { sh: 'pin', off: vert }, { thin: '' }) + disc(fP, c * 0.6);
    c *= 0.6;
    sv += disc(fP, c) + bandDeco(fP, c - 24 * sc, c, 'zigzag', n * 2, vert, { thin: '' }) + disc(fP, c - 24 * sc);
    c -= 24 * sc;
    sv += petals(fP, n, c * 0.5, c, { sh: 'pin', off: mid }, { thin: '' });
    L.push({ t: 'svg', svg: sv });
    centrePiece(c * 0.5);
  } else if (layout === 4) {
    // stars made of two turned polygons, one inside the other
    const ns = { 4: 4, 6: 3, 8: 4, 0: 6 }[F.k];
    L.push({ t: 'frame', r: cur });
    let rs = F.k ? cur * Math.cos(Math.PI / F.k) * (F.k === 6 ? 1 : 0.98) : cur * 0.97;
    for (let lev = 0; lev < 2; lev++) {
      const a0 = lev % 2 ? 180 / (2 * ns) : 0;
      L.push({ t: 'svg', svg: disc({ k: ns, rot: a0 }, rs) + disc({ k: ns, rot: a0 + 180 / ns }, rs) });
      const ri = (rs * Math.cos(Math.PI / ns)) / Math.cos(Math.PI / (2 * ns));
      const f2 = { k: 2 * ns, rot: a0 + 180 / (2 * ns) };
      const rIn = ri * (lev ? 0.6 : 0.72);
      L.push({ t: 'svg', svg: disc(f2, ri) + bandDeco(f2, rIn, ri, lev ? 'zigzag' : 'spokes', 2 * ns, f2.rot, { thin: '' }) + disc(f2, rIn) });
      rs = rIn / Math.cos(Math.PI / (2 * ns)) * Math.cos(Math.PI / (2 * ns));
    }
    centrePiece(rs * 0.7);
  } else {
    // zigzag frames with diamonds between
    L.push({ t: 'band', rOut: cur, rIn: cur - 38 * sc, deco: 'zigzag', n, off: mid });
    cur -= 38 * sc;
    L.push({ t: 'band', rOut: cur, rIn: cur - 32 * sc, deco: 'diamonds', n, off: vert });
    cur -= 32 * sc;
    L.push({ t: 'band', rOut: cur, rIn: cur - 32 * sc, deco: 'zigzag', n, off: vert });
    cur -= 32 * sc;
    innerStar(cur, cur * 0.55, mid, 'kite');
    centrePiece(cur * 0.55);
  }
  return { fr, layers: L };
}

const MANDALA_KIND = 'float';
const mandalaSub = (id, name, compose, count = 24) => ({
  id, name, styles: count, count, kind: MANDALA_KIND, scenes: ['plain'], pairs: false, flip: false, scale: 1.04,
  draw(style, rand, ctx) {
    const d = compose(style, ctx);
    return drawDesign(d.fr || { k: 0, rot: 0 }, d.layers || d, ctx);
  },
});

const patterns = {
  id: 'patterns', name: 'Patterns and mandalas', order: 60,
  scenes: ['plain'], pairScenes: [], icon: 'flower-mandala', kind: 'float',
  subjects: [
    mandalaSub('flower-mandala', 'Flower mandala', (s) => flowerDesign(s)),
    mandalaSub('star-mandala', 'Star mandala', (s, c) => starDesign(s, c)),
    mandalaSub('heart-mandala', 'Heart mandala', (s) => heartDesign(s)),
    mandalaSub('sun-mandala', 'Sun mandala', (s, c) => sunDesign(s, c)),
    mandalaSub('animal-mandala', 'Animal mandala', (s, c) => animalDesign(s, c)),
    mandalaSub('geometric-pattern', 'Geometric pattern', (s) => geoDesign(s)),
  ],
};

export default [people, nature, patterns];
