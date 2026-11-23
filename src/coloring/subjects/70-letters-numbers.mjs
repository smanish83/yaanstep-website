// Letters A to Z and numbers 0 to 20 to color (SCRUM-515). Each letter page shows the letter and a picture from the
// other categories ("A is for Apple"); some pages have dotted letters to trace first. Number pages show the numeral and
// that many things to count, in rows of five.
import { page, AREA, W, C, E, P, R, poly, curve, line, star, heart, littleFlower, g } from '../lib.mjs';

const FONT = 'font-family="Arial Rounded MT Bold,Arial Black,Verdana,Arial,sans-serif" font-weight="900" text-anchor="middle"';
const frame = () => R(AREA.x0, AREA.y0, AREA.x1 - AREA.x0, AREA.y1 - AREA.y0, 30, 'fill="none"');
const big = (t, x, y, size, trace = false) => `<text x="${x}" y="${y}" ${FONT} font-size="${size}"${trace ? ' stroke-dasharray="16 14" stroke-width="5"' : ''}>${t}</text>`;

/* Our own small drawings for letters no category covers. Local box -200..200, line width set by the caller. */
const OWN = {
  quilt() {
    let s = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = -160 + c * 80, y = -170 + r * 80;
      s += R(x, y, 80, 80);
      if ((r + c) % 2) s += heart(x + 40, y + 42, 50); else s += star(x + 40, y + 40, 26, 11);
    }
    return s + curve('M-160 150q20 30 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0');
  },
  xylophone() {
    let s = '';
    const cols = 7;
    s += P('M-190 40L190 0L190 40L-190 90Z');
    for (let i = 0; i < cols; i++) {
      const x = -175 + i * 52, h = 190 - i * 18;
      s += R(x, -40 - h / 2 + i * 6, 44, h, 8) + C(x + 22, -40 - h / 2 + i * 6 + 14, 5) + C(x + 22, -40 + h / 2 + i * 6 - 14, 5);
    }
    s += line(-40, 150, 70, 80) + C(80, 72, 16) + line(60, 170, 150, 100) + C(160, 92, 16);
    return s;
  },
  yoyo() {
    return curve('M0 -200C0 -150 20 -120 0 -80') + C(0, 30, 130) + C(0, 30, 90) + C(0, 30, 30) +
      star(0, 30, 22, 9) + curve('M-60 -60Q-110 30 -60 120') + curve('M60 -60Q110 30 60 120');
  },
};
// Other styles of our own drawings add little hearts or stars beside them, so each page is different.
const EXTRA = [() => '', () => heart(-225, -120, 44) + heart(225, 60, 44), () => star(-225, 60, 26, 11) + star(225, -120, 26, 11)];
const own = (name, x, y, s, style = 0) => `<g transform="translate(${x} ${y}) scale(${s})" stroke-width="${(6 / s).toFixed(1)}">${OWN[name]()}${EXTRA[style % 3]()}</g>`;

/* Words for each letter: [word, category, subject] or [word, 'own', drawing]. The first ones that exist are used. */
const WORDS = {
  A: [['Apple', 'fruit', 'apple'], ['Airplane', 'vehicles', 'airplane'], ['Astronaut', 'space', 'astronaut'], ['Ant', 'bugs', 'ant']],
  B: [['Bee', 'bugs', 'bee'], ['Ball', 'toys', 'ball'], ['Banana', 'fruit', 'banana'], ['Bear', 'wild', 'bear'], ['Bicycle', 'vehicles', 'bicycle']],
  C: [['Cat', 'pets', 'cat'], ['Car', 'vehicles', 'car'], ['Cow', 'farm', 'cow'], ['Cupcake', 'treats', 'cupcake'], ['Castle', 'places', 'castle']],
  D: [['Dog', 'pets', 'dog'], ['Duck', 'farm', 'duck'], ['Dolphin', 'sea', 'dolphin'], ['Donut', 'treats', 'donut']],
  E: [['Elephant', 'wild', 'elephant'], ['Eggs', 'seasons', 'painted-eggs'], ['Eggs', 'seasons', 'eggs']],
  F: [['Fish', 'sea', 'fish'], ['Fox', 'wild', 'fox'], ['Flamingo', 'birds', 'flamingo'], ['Fire engine', 'vehicles', 'fire-engine']],
  G: [['Giraffe', 'wild', 'giraffe'], ['Grapes', 'fruit', 'grapes'], ['Goat', 'farm', 'goat'], ['Goldfish', 'pets', 'goldfish']],
  H: [['Horse', 'farm', 'horse'], ['House', 'places', 'house'], ['Helicopter', 'vehicles', 'helicopter'], ['Hippo', 'wild', 'hippo']],
  I: [['Ice cream', 'treats', 'ice-cream'], ['Igloo', 'places', 'igloo']],
  J: [['Jellyfish', 'sea', 'jellyfish']],
  K: [['Kite', 'toys', 'kite'], ['Kangaroo', 'wild', 'kangaroo'], ['Koala', 'wild', 'koala']],
  L: [['Lion', 'wild', 'lion'], ['Ladybug', 'bugs', 'ladybug'], ['Lighthouse', 'places', 'lighthouse'], ['Lily', 'flowers', 'lily']],
  M: [['Monkey', 'wild', 'monkey'], ['Mushroom', 'plants', 'mushroom'], ['Moon', 'space', 'moon']],
  N: [['Noodles', 'treats', 'noodles'], ['Nest', 'birds', 'robin']],
  O: [['Owl', 'birds', 'owl'], ['Octopus', 'sea', 'octopus'], ['Orange', 'fruit', 'orange']],
  P: [['Pig', 'farm', 'pig'], ['Penguin', 'birds', 'penguin'], ['Pizza', 'treats', 'pizza'], ['Pumpkin', 'seasons', 'pumpkin']],
  Q: [['Quilt', 'own', 'quilt']],
  R: [['Rabbit', 'farm', 'rabbit'], ['Rocket', 'space', 'rocket'], ['Robot', 'toys', 'robot'], ['Rainbow', 'nature', 'rainbow'], ['Rose', 'flowers', 'rose']],
  S: [['Sun', 'nature', 'sun'], ['Snail', 'bugs', 'snail'], ['Sheep', 'farm', 'sheep'], ['Starfish', 'sea', 'starfish']],
  T: [['Tiger', 'wild', 'tiger'], ['Train', 'vehicles', 'train'], ['Tractor', 'vehicles', 'tractor'], ['Tulip', 'flowers', 'tulip']],
  U: [['Umbrella', 'seasons', 'umbrella']],
  V: [['Volcano', 'nature', 'volcano']],
  W: [['Whale', 'sea', 'whale'], ['Watermelon', 'fruit', 'watermelon'], ['Windmill', 'places', 'windmill']],
  X: [['Xylophone', 'own', 'xylophone']],
  Y: [['Yo-yo', 'own', 'yoyo']],
  Z: [['Zebra', 'wild', 'zebra']],
};
// "Nest" would need a nest; the robin page is only used if nothing else exists, so drop that guess.
WORDS.N = WORDS.N.slice(0, 1);

function letterPages(L, pic) {
  const draw = (w, style, x, y, s) => (w[1] === 'own' ? own(w[2], x, y, s, style) : pic(w[1], w[2], style, x, y, s));
  const words = WORDS[L].filter((w) => draw(w, 0, 0, 0, 1) !== '');
  if (!words.length) return [];
  const w = (i) => words[i % words.length];
  const st = (i) => Math.floor(i / words.length); // the same word again gets another style
  const lo = L.toLowerCase();
  const name = (x) => `${L} is for ${x[0]}`;
  const out = [];
  // 1. capital letter and a picture
  out.push(page({ back: frame(), front: big(L, 425, 470, 420) + draw(w(0), 0, 425, 760, 0.95), name: name(w(0)) }));
  // 2. small letter and a picture
  out.push(page({ back: frame(), front: big(lo, 425, 450, 420) + draw(w(1), st(1), 425, 760, 0.95), name: name(w(1)) }));
  // 3. both letters and a picture
  out.push(page({ back: frame(), front: big(L + lo, 425, 450, 360) + draw(w(2), st(2), 425, 760, 0.95), name: name(w(2)) }));
  // 4. dotted letters to trace, then color the picture
  out.push(page({ back: frame(), front: big(L, 250, 420, 330, true) + big(lo, 600, 420, 330, true) + draw(w(3), st(3), 425, 760, 0.95), name: `Trace ${L} ${lo}` }));
  // 5. a big letter with two little pictures
  out.push(page({ back: frame(), front: big(L, 425, 560, 560) + draw(w(0), 1, 230, 820, 0.62) + draw(w(1), st(1) + 1, 620, 820, 0.62), name: `${L} ${lo}` }));
  return out;
}

/* ---------- numbers ---------- */
const WORDS_N = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const THINGS = {
  star: (x, y, r) => star(x, y, r, r * 0.45),
  heart: (x, y, r) => heart(x, y + r * 0.1, r * 1.9),
  balloon: (x, y, r) => curve(`M${x} ${y + r * 0.95}q${-r * 0.2} ${r * 0.35} 0 ${r * 0.7}`) + E(x, y - r * 0.1, r * 0.72, r * 0.9) + poly([[x - r * 0.12, y + r * 0.95], [x + r * 0.12, y + r * 0.95], [x, y + r * 0.78]]),
  apple: (x, y, r) => P(`M${x} ${y - r * 0.55}C${x - r * 0.3} ${y - r * 0.8} ${x - r * 0.95} ${y - r * 0.7} ${x - r * 0.9} ${y}C${x - r * 0.85} ${y + r * 0.6} ${x - r * 0.4} ${y + r * 0.9} ${x} ${y + r * 0.75}C${x + r * 0.4} ${y + r * 0.9} ${x + r * 0.85} ${y + r * 0.6} ${x + r * 0.9} ${y}C${x + r * 0.95} ${y - r * 0.7} ${x + r * 0.3} ${y - r * 0.8} ${x} ${y - r * 0.55}Z`) +
    curve(`M${x} ${y - r * 0.55}q${r * 0.05} ${-r * 0.3} ${r * 0.2} ${-r * 0.4}`) + P(`M${x + r * 0.08} ${y - r * 0.7}q${r * 0.35} ${-r * 0.3} ${r * 0.55} ${-r * 0.05}q${-r * 0.3} ${r * 0.2} ${-r * 0.55} ${r * 0.05}Z`),
  fish: (x, y, r) => P(`M${x + r * 0.9} ${y}C${x + r * 0.5} ${y - r * 0.6} ${x - r * 0.4} ${y - r * 0.6} ${x - r * 0.55} ${y}C${x - r * 0.4} ${y + r * 0.6} ${x + r * 0.5} ${y + r * 0.6} ${x + r * 0.9} ${y}Z`) +
    poly([[x - r * 0.5, y], [x - r * 0.95, y - r * 0.4], [x - r * 0.95, y + r * 0.4]]) + C(x + r * 0.5, y - r * 0.1, r * 0.1, 'fill="#222"'),
  flower: (x, y, r) => { let s = ''; for (let i = 0; i < 5; i++) { const t = (i / 5) * Math.PI * 2 - Math.PI / 2; s += C(x + Math.cos(t) * r * 0.5, y + Math.sin(t) * r * 0.5, r * 0.42); } return s + C(x, y, r * 0.35); },
  ball: (x, y, r) => C(x, y, r * 0.85) + curve(`M${x - r * 0.85} ${y}Q${x} ${y - r * 0.45} ${x + r * 0.85} ${y}`) + curve(`M${x} ${y - r * 0.85}Q${x + r * 0.45} ${y} ${x} ${y + r * 0.85}`),
};
const THING_NAMES = { star: 'stars', heart: 'hearts', balloon: 'balloons', apple: 'apples', fish: 'fish', flower: 'flowers', ball: 'balls' };
const ORDER = ['star', 'apple', 'balloon', 'fish', 'heart', 'flower', 'ball'];

function things(n, kind, top = 560, bottom = 975) {
  if (!n) return P('M260 800Q425 900 590 800') + E(425, 790, 175, 40); // an empty plate
  const rows = Math.ceil(n / 5), per = Math.min(n, 5);
  const cell = Math.min(700 / per, (bottom - top) / rows, 170);
  const r = cell * 0.4;
  let s = '';
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 5), col = i % 5, inRow = Math.min(5, n - row * 5);
    const x = 425 + (col - (inRow - 1) / 2) * cell, y = top + (bottom - top - rows * cell) / 2 + (row + 0.5) * cell;
    s += THINGS[kind](x, y, r);
  }
  return s;
}

function numberPages(n) {
  const k1 = ORDER[n % ORDER.length], k2 = ORDER[(n + 3) % ORDER.length];
  const word = WORDS_N[n];
  const size = n >= 10 ? 330 : 380;
  return [
    page({ back: frame(), front: big(String(n), 425, 430, size) + things(n, k1), name: n === 0 ? '0: nothing on the plate' : `${n} ${n === 1 ? k1 : THING_NAMES[k1]}` }),
    page({ back: frame(), front: big(String(n), 425, 360, size * 0.8, true) + `<text x="425" y="500" ${FONT} font-size="${word.length > 7 ? 92 : 110}">${word}</text>` + things(n, k2, 560), name: `Trace ${n}: ${word}` }),
  ];
}

export default [
  {
    id: 'letters', name: 'Letters A to Z', order: 70, icon: 'a',
    subjects: Object.keys(WORDS).map((L) => ({ id: L.toLowerCase(), name: `${L} ${L.toLowerCase()}`, pages: (pic) => letterPages(L, pic) })),
  },
  {
    id: 'numbers', name: 'Numbers 0 to 20', order: 72, icon: 'n3',
    subjects: WORDS_N.map((w, n) => ({ id: `n${n}`, name: String(n), pages: () => numberPages(n) })),
  },
];
