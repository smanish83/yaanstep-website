// Shared drawing helpers for the Yaanstep Sprouts coloring pages (SCRUM-515, 23 Nov 2026).
// Every picture is drawn by this code. Nothing is traced or downloaded.
//
// Conventions for subject drawings:
// - A subject draws itself in a local box from -200 to 200 on both axes, centred on 0,0.
//   Things that stand on the ground touch y = 200 with their feet, wheels, pot or trunk.
// - Shapes that a child can color are left with the inherited white fill. Lines that should not be filled
//   (open curves, whiskers, veins) use line() / curve(), which set fill="none".
// - Small dark parts (pupils, nostrils) use dark(), which fills #222 and is never offered for tap-to-fill.
// - Never set stroke-width yourself except through ctx.thin (thin detail lines), so line weight stays even.

export const W = 850, H = 1100;            // US letter at 100 per inch
export const AREA = { x0: 34, y0: 34, x1: 816, y1: 1000 }; // drawing area; the band below holds the name and logo
export const INK = '#222';

export const r1 = (n) => Math.round(n * 10) / 10;
const attrs = (a) => (a ? ' ' + a : '');

export const P = (d, a = '') => `<path d="${d}"${attrs(a)}/>`;
export const C = (cx, cy, r, a = '') => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}"${attrs(a)}/>`;
export const E = (cx, cy, rx, ry, a = '') => `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}"${attrs(a)}/>`;
export const R = (x, y, w, h, rx = 0, a = '') => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"${rx ? ` rx="${r1(rx)}"` : ''}${attrs(a)}/>`;
export const poly = (pts, a = '') => `<polygon points="${pts.map((p) => p.map(r1).join(',')).join(' ')}"${attrs(a)}/>`;
export const line = (x1, y1, x2, y2, a = '') => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" fill="none"${attrs(a)}/>`;
export const curve = (d, a = '') => `<path d="${d}" fill="none"${attrs(a)}/>`;
export const dark = (el) => el.replace(/^<(\w+)/, `<$1 fill="${INK}"`);
export const g = (inner, transform = '', a = '') => `<g${transform ? ` transform="${transform}"` : ''}${attrs(a)}>${inner}</g>`;
export const rot = (deg, cx = 0, cy = 0) => `rotate(${r1(deg)} ${r1(cx)} ${r1(cy)})`;
export const mirrorX = (inner, cx = 0) => g(inner, `translate(${r1(2 * cx)} 0) scale(-1 1)`);

/** A seeded random number generator, so every build makes the same pictures. */
export function rng(seed) {
  let a = typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0), 2166136261);
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  next.int = (lo, hi) => Math.floor(next.range(lo, hi + 1));
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.chance = (p) => next() < p;
  return next;
}

/** A smooth closed shape through the given points (Catmull-Rom turned into curves). */
export function blob(pts, a = '', tension = 1) {
  return P(smoothD(pts, true, tension), a);
}
/** A smooth open line through the given points. */
export function smooth(pts, a = '', tension = 1) {
  return curve(smoothD(pts, false, tension), a);
}
export function smoothD(pts, closed, tension = 1) {
  const n = pts.length;
  const at = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const t = tension / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Points around a circle, handy for blob(). wobble moves each point in or out at random. */
export function ring(cx, cy, rx, ry, n, start = 0, wobble = 0, rand = null) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = start + (i / n) * Math.PI * 2;
    const k = 1 + (wobble && rand ? rand.range(-wobble, wobble) : 0);
    out.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  return out;
}

export function star(cx, cy, R, r, n = 5, a = '', turn = -90) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = ((turn + (i * 180) / n) * Math.PI) / 180;
    const len = i % 2 ? r : R;
    pts.push([cx + Math.cos(rad) * len, cy + Math.sin(rad) * len]);
  }
  return poly(pts, a);
}

export function heart(cx, cy, s, a = '') {
  const k = s / 100;
  const X = (v) => r1(cx + v * k), Y = (v) => r1(cy + v * k);
  return P(`M${X(0)} ${Y(35)}C${X(-10)} ${Y(25)} ${X(-50)} ${Y(0)} ${X(-50)} ${Y(-22)}C${X(-50)} ${Y(-42)} ${X(-32)} ${Y(-52)} ${X(-18)} ${Y(-48)}C${X(-8)} ${Y(-45)} ${X(-2)} ${Y(-38)} ${X(0)} ${Y(-30)}C${X(2)} ${Y(-38)} ${X(8)} ${Y(-45)} ${X(18)} ${Y(-48)}C${X(32)} ${Y(-52)} ${X(50)} ${Y(-42)} ${X(50)} ${Y(-22)}C${X(50)} ${Y(0)} ${X(10)} ${Y(25)} ${X(0)} ${Y(35)}Z`, a);
}

/** A puffy cloud. w is its width. */
export function cloud(cx, cy, w, a = '') {
  const k = w / 200;
  const X = (v) => r1(cx + v * k), Y = (v) => r1(cy + v * k);
  return P(`M${X(-80)} ${Y(30)}C${X(-110)} ${Y(30)} ${X(-110)} ${Y(-10)} ${X(-80)} ${Y(-10)}C${X(-80)} ${Y(-40)} ${X(-40)} ${Y(-50)} ${X(-20)} ${Y(-30)}C${X(-10)} ${Y(-65)} ${X(50)} ${Y(-65)} ${X(55)} ${Y(-25)}C${X(85)} ${Y(-35)} ${X(110)} ${Y(-5)} ${X(90)} ${Y(15)}C${X(105)} ${Y(30)} ${X(90)} ${Y(30)} ${X(80)} ${Y(30)}Z`, a);
}

export function sun(cx, cy, r, rays = 10, a = '') {
  let s = '';
  for (let i = 0; i < rays; i++) {
    const t = (i / rays) * Math.PI * 2;
    const c = Math.cos(t), d = Math.sin(t);
    const w = 0.22;
    s += poly([[cx + Math.cos(t - w) * r * 1.2, cy + Math.sin(t - w) * r * 1.2], [cx + c * r * 1.75, cy + d * r * 1.75], [cx + Math.cos(t + w) * r * 1.2, cy + Math.sin(t + w) * r * 1.2]], a);
  }
  return s + C(cx, cy, r, a);
}

/** An eye: white, a dark pupil and a small shine. look moves the pupil (-1..1). */
export function eye(x, y, r, look = [0, 0]) {
  const px = x + look[0] * r * 0.35, py = y + look[1] * r * 0.35;
  return C(x, y, r) + dark(C(px, py, r * 0.55)) + C(px - r * 0.18, py - r * 0.2, r * 0.17, 'fill="#fff" stroke="none"');
}
/** A simple dot eye for small or cute faces. */
export const dotEye = (x, y, r) => dark(C(x, y, r)) + C(x - r * 0.3, y - r * 0.35, r * 0.3, 'fill="#fff" stroke="none"');
export const smile = (x, y, w, depth = 0.5) => curve(`M${r1(x - w / 2)} ${r1(y)}Q${r1(x)} ${r1(y + w * depth)} ${r1(x + w / 2)} ${r1(y)}`);

/** Grass tufts along a ground line between x0 and x1. */
export function grass(x0, x1, y, rand, every = 70, a = '') {
  let s = '';
  for (let x = x0 + rand.range(10, every); x < x1 - 20; x += rand.range(every * 0.7, every * 1.3)) {
    s += curve(`M${r1(x - 12)} ${r1(y)}Q${r1(x - 10)} ${r1(y - 14)} ${r1(x - 16)} ${r1(y - 24)}M${r1(x)} ${r1(y)}Q${r1(x)} ${r1(y - 18)} ${r1(x + 2)} ${r1(y - 30)}M${r1(x + 12)} ${r1(y)}Q${r1(x + 12)} ${r1(y - 14)} ${r1(x + 18)} ${r1(y - 22)}`, a);
  }
  return s;
}

/** A small simple flower for scenes (stem, five petals, centre). */
export function littleFlower(x, y, h, a = '') {
  const r = h * 0.16;
  let s = curve(`M${r1(x)} ${r1(y)}Q${r1(x - 4)} ${r1(y - h * 0.5)} ${r1(x)} ${r1(y - h + r)}`, a);
  s += P(`M${r1(x)} ${r1(y - h * 0.35)}q${r1(h * 0.22)} ${r1(-h * 0.2)} ${r1(h * 0.3)} ${r1(-h * 0.05)}q${r1(-h * 0.15)} ${r1(h * 0.15)} ${r1(-h * 0.3)} ${r1(h * 0.05)}Z`, a);
  for (let i = 0; i < 5; i++) {
    const t = (i / 5) * Math.PI * 2 - Math.PI / 2;
    s += C(x + Math.cos(t) * r * 1.3, y - h + Math.sin(t) * r * 1.3, r * 0.95, a);
  }
  return s + C(x, y - h, r * 0.8, a);
}

/** The Yaanstep Sprouts badge for the bottom-right corner. Not colorable: it is the mark of where the page came from. */
export function badge() {
  const x = W - 34 - 300, y = 1018;
  return `<g id="ys-badge" aria-label="Yaanstep Sprouts, yaanstep.com">` +
    `<rect x="${x}" y="${y}" width="300" height="64" rx="16" fill="#fff" stroke="#1F7A6D" stroke-width="3"/>` +
    `<rect x="${x + 8}" y="${y + 8}" width="48" height="48" rx="12" fill="#1F7A6D" stroke="none"/>` +
    `<path d="M${x + 17} ${y + 45}h10v-8h10v-8h10v-8" fill="none" stroke="#F7F5F0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<text x="${x + 68}" y="${y + 31}" font-family="Verdana,Arial,sans-serif" font-size="22" font-weight="700" fill="#1F7A6D" stroke="none">Yaanstep Sprouts</text>` +
    `<text x="${x + 68}" y="${y + 53}" font-family="Verdana,Arial,sans-serif" font-size="16" fill="#1F7A6D" stroke="none">yaanstep.com · free to print</text>` +
    `</g>`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Put a whole page together.
 * back: scene drawing in page units (drawn first). items: [{svg, x, y, s, flip}] subject drawings placed with
 * their centre at x,y and scaled by s. front: anything drawn last. name: the word shown bottom left.
 */
export function page({ back = '', items = [], front = '', name = '', line = 6 }) {
  let body = '';
  for (const it of items) {
    const t = `translate(${r1(it.x)} ${r1(it.y)}) scale(${it.flip ? -it.s : it.s} ${it.s})${it.rot ? ` rotate(${it.rot})` : ''}`;
    body += `<g transform="${t}" stroke-width="${r1(line / it.s)}">${it.svg}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(name)} coloring page from Yaanstep Sprouts">` +
    `<title>${esc(name)}: coloring page from Yaanstep Sprouts, yaanstep.com</title>` +
    `<rect id="paper" x="0" y="0" width="${W}" height="${H}" fill="#fff" stroke="none"/>` +
    `<g fill="#fff" stroke="${INK}" stroke-width="${line}" stroke-linecap="round" stroke-linejoin="round">${back}${body}${front}</g>` +
    (name ? `<text x="40" y="1062" font-family="Verdana,Arial,sans-serif" font-size="34" font-weight="700" fill="#fff" stroke="${INK}" stroke-width="2" letter-spacing="1">${esc(name)}</text>` : '') +
    badge() + `</svg>`;
}

/** The context handed to a subject's draw function: ctx.thin is an attribute for a thin detail line at this scale. */
export const makeCtx = (s) => ({ s, thin: `stroke-width="${r1(3 / s)}"`, hair: `stroke-width="${r1(2 / s)}"` });
