// Builds the Yaanstep Sprouts coloring pages into coloring/ (SCRUM-515). Run from the site root: node src/coloring/build.mjs
// Each subject is drawn in a few styles; each page puts one style (or two together) into a scene.
import { writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { page, rng, makeCtx } from './lib.mjs';
import { SCENES } from './scenes.mjs';

const EASY = new Set(['plain', 'hearts', 'stars']);
const only = process.argv[2]; // optional: build one category (for previews)
const files = readdirSync(new URL('./subjects/', import.meta.url)).filter((f) => f.endsWith('.mjs')).sort();
const cats = [];
for (const f of files) {
  let m;
  try { m = await import(`./subjects/${f}`); } catch (e) {
    if (only) continue; // another file being written at the same time must not stop a one-category build
    throw e;
  }
  for (const c of [].concat(m.default)) if (!only || c.id === only) cats.push(c);
}
cats.sort((a, b) => (a.order ?? 50) - (b.order ?? 50));

/** The list of pages for one subject: easy single pictures first, then scenes, then pairs. */
export function variantsFor(cat, sub) {
  const S = sub.styles;
  const scenes = (sub.scenes || cat.scenes).filter((s) => s !== 'plain');
  const want = sub.count || cat.perSubject || 16;
  const out = [], seen = new Set();
  const add = (v) => { const k = `${v.style}|${v.scene}|${v.n}|${v.style2 ?? ''}`; if (!seen.has(k)) { seen.add(k); out.push(v); } };
  for (let s = 0; s < S; s++) add({ style: s, scene: 'plain', n: 1 });
  const pairs = sub.pairs === false ? [] : (cat.pairScenes || []).filter((s) => scenes.includes(s) || s === 'plain');
  for (let round = 0; round < S && out.length < want * 2; round++) {
    scenes.forEach((sc, i) => (round === 0 || !EASY.has(sc)) && add({ style: (i + round) % S, scene: sc, n: 1 }));
    pairs.forEach((sc, i) => S > 1 && add({ style: (i + round) % S, style2: (i + round + 1) % S, scene: sc, n: 2 }));
  }
  // keep easy ones first, then alternate scenes so that neighbours look different
  const easy = out.filter((v) => EASY.has(v.scene) && v.n === 1);
  const rest = out.filter((v) => !(EASY.has(v.scene) && v.n === 1));
  return [...easy, ...rest].slice(0, want);
}

export function render(cat, sub, v, k) {
  const rand = rng(`${cat.id}/${sub.id}/${k}`);
  const kind = sub.kind || cat.kind || 'ground';
  const sc = SCENES[v.scene](rand, kind, v.n);
  const items = sc.slots.slice(0, v.n).map((slot, i) => {
    const s = slot.s * (sub.scale || 1);
    const style = i === 0 ? v.style : v.style2 ?? v.style;
    const y = kind === 'ground' ? slot.y + 200 * (slot.s - s) : slot.y; // keep feet on the ground when scaled
    return { svg: sub.draw(style, rng(`${cat.id}/${sub.id}/${k}/${i}`), makeCtx(s)), x: slot.x, y, s, flip: slot.flip && sub.flip !== false };
  });
  return page({ back: sc.back, items, front: sc.front || '', name: sub.label || sub.name });
}

/** Draw a subject from any category at x,y with scale s (for letter and number pages). Empty if it does not exist. */
const every = [];
for (const f of files) { try { const m = await import(`./subjects/${f}`); every.push(...[].concat(m.default)); } catch (e) { /* half-written file */ } }
export function pic(catId, subId, style, x, y, s, flip = false) {
  const cat = every.find((c) => c.id === catId), sub = cat && cat.subjects.find((x) => x.id === subId);
  if (!sub || sub.pages) return '';
  const k = s * (sub.scale || 1);
  return `<g transform="translate(${x} ${y}) scale(${flip ? -k : k} ${k})" stroke-width="${(6 / k).toFixed(1)}">${sub.draw(style % sub.styles, rng(`${catId}/${subId}/pic/${style}`), makeCtx(k))}</g>`;
}

if (process.argv[1] && process.argv[1].endsWith('build.mjs')) {
  const outDir = new URL('../../coloring/', import.meta.url);
  if (!only) rmSync(outDir, { recursive: true, force: true });
  const index = { made: 'Drawn by Yaanstep code, 2026. Free to print and color.', categories: [] };
  let total = 0, bytes = 0;
  for (const cat of cats) {
    mkdirSync(new URL(`${cat.id}/`, outDir), { recursive: true });
    const entry = { id: cat.id, name: cat.name, icon: '', subjects: [] };
    for (const sub of cat.subjects) {
      if (sub.pages) { // a subject that lays out its own pages (letters, numbers)
        const list = sub.pages(pic);
        list.forEach((svg, i) => { writeFileSync(new URL(`${cat.id}/${sub.id}-${i + 1}.svg`, outDir), svg); bytes += svg.length; });
        entry.subjects.push({ id: sub.id, name: sub.name, n: list.length, easy: sub.easy ?? list.length });
        total += list.length;
        continue;
      }
      const vs = variantsFor(cat, sub);
      vs.forEach((v, i) => {
        const svg = render(cat, sub, v, i + 1);
        writeFileSync(new URL(`${cat.id}/${sub.id}-${i + 1}.svg`, outDir), svg);
        bytes += svg.length;
      });
      entry.subjects.push({ id: sub.id, name: sub.name, n: vs.length, easy: vs.filter((v) => EASY.has(v.scene) && v.n === 1).length });
      total += vs.length;
    }
    entry.icon = `${cat.icon || cat.subjects[0].id}-1.svg`;
    index.categories.push(entry);
  }
  index.total = total;
  if (!only || process.env.WRITE_INDEX) writeFileSync(new URL('index.json', outDir), JSON.stringify(index));
  console.log(`${total} pages in ${cats.length} categories, ${(bytes / 1e6).toFixed(1)} MB`);
}
