// Backgrounds for the coloring pages. Each scene returns { back, front, slots }.
// slots are where subjects go: { x, y, s } with x,y the centre of the subject's -200..200 box and s its scale.
// kind is 'ground' (stands on the ground) or 'float' (swims, flies, or has no ground).
import { AREA, W, R, C, E, P, poly, curve, line, cloud, sun, star, heart, grass, littleFlower, smooth, blob, g, dark, r1 } from './lib.mjs';

const frame = (rx = 30) => R(AREA.x0, AREA.y0, AREA.x1 - AREA.x0, AREA.y1 - AREA.y0, rx, 'fill="none"');
const CX = W / 2;

/** Slots for n subjects standing on a ground line at gy. */
function onGround(n, gy, big, rand) {
  if (n === 1) return [{ x: CX, y: gy - 200 * big, s: big }];
  if (n === 2) {
    const s = big * 0.62;
    return [{ x: 245, y: gy - 200 * s, s }, { x: 610, y: gy + 25 - 200 * s * 0.92, s: s * 0.92, flip: true }];
  }
  const s = big * 0.48;
  return [{ x: 190, y: gy - 200 * s, s }, { x: 425, y: gy + 30 - 200 * s * 1.08, s: s * 1.08 }, { x: 660, y: gy - 200 * s, s, flip: true }];
}
function floating(n, cy, big) {
  if (n === 1) return [{ x: CX, y: cy, s: big }];
  if (n === 2) return [{ x: 270, y: cy - 150, s: big * 0.6 }, { x: 580, y: cy + 150, s: big * 0.6, flip: true }];
  return [{ x: 230, y: cy - 220, s: big * 0.45 }, { x: 600, y: cy - 20, s: big * 0.5, flip: true }, { x: 280, y: cy + 230, s: big * 0.45 }];
}

/** A wavy horizon line from left to right at about y, closed down to the bottom of the area, so it can be colored. */
function groundShape(y, rand, amp = 14) {
  const pts = [];
  for (let x = AREA.x0; x <= AREA.x1 + 1; x += (AREA.x1 - AREA.x0) / 6) pts.push([x, y + rand.range(-amp, amp)]);
  const top = smooth(pts).match(/d="([^"]+)"/)[1];
  return P(`${top}L${AREA.x1} ${AREA.y1}L${AREA.x0} ${AREA.y1}Z`);
}

export const SCENES = {
  plain(rand, kind, n) {
    return { back: frame(), slots: kind === 'ground' ? onGround(n, 920, n === 1 ? 1.75 : 1.6, rand) : floating(n, 510, n === 1 ? 1.8 : 1.6) };
  },
  hearts(rand, kind, n) {
    let b = frame();
    const hs = [];
    for (let x = 90; x < 800; x += 105) hs.push([x, 85], [x, 950]);
    for (let y = 190; y < 900; y += 105) hs.push([85, y], [765, y]);
    for (const [x, y] of hs) b += heart(x, y, 62);
    return { back: b, slots: kind === 'ground' ? onGround(n, 860, 1.42, rand) : floating(n, 515, 1.45) };
  },
  stars(rand, kind, n) {
    let b = frame();
    const ss = [];
    for (let x = 90; x < 800; x += 105) ss.push([x, 88], [x, 948]);
    for (let y = 192; y < 900; y += 105) ss.push([86, y], [764, y]);
    ss.forEach(([x, y], i) => (b += star(x, y, 36, 16, 5, '', -90 + (i % 3) * 8)));
    return { back: b, slots: kind === 'ground' ? onGround(n, 860, 1.42, rand) : floating(n, 515, 1.45) };
  },
  meadow(rand, kind, n) {
    let b = frame() + sun(140, 150, 50, 10) + cloud(560, 130, 200) + cloud(330, 230, 130);
    b += groundShape(830, rand, 10) + grass(60, 790, 905, rand, 90);
    b += littleFlower(80, 990, 70) + littleFlower(775, 985, 80);
    return { back: b, slots: kind === 'ground' ? onGround(n, 905, n === 1 ? 1.45 : 1.5, rand) : floating(n, 480, 1.25) };
  },
  hills(rand, kind, n) {
    let b = frame() + cloud(200, 140, 170) + cloud(640, 110, 150);
    b += P(`M${AREA.x0} 690Q220 520 430 690Z`) + P(`M330 700Q600 470 ${AREA.x1} 650L${AREA.x1} 760L330 760Z`);
    b += groundShape(760, rand, 12);
    for (let i = 0; i < 6; i++) b += littleFlower(rand.range(60, 790), rand.range(950, 990), rand.range(55, 75));
    return { back: b, slots: kind === 'ground' ? onGround(n, 900, n === 1 ? 1.4 : 1.5, rand) : floating(n, 470, 1.25) };
  },
  garden(rand, kind, n) {
    let b = frame() + sun(700, 140, 46, 10) + cloud(250, 150, 170);
    // picket fence
    for (let x = 50; x < 800; x += 62) b += P(`M${x} 820L${x} 620L${x + 22} 590L${x + 44} 620L${x + 44} 820Z`);
    b += R(AREA.x0, 660, AREA.x1 - AREA.x0, 26) + R(AREA.x0, 760, AREA.x1 - AREA.x0, 26);
    b += groundShape(840, rand, 6);
    for (let i = 0; i < 5; i++) b += littleFlower(80 + i * 170 + rand.range(-20, 20), 990, rand.range(60, 80));
    return { back: b, slots: kind === 'ground' ? onGround(n, 915, n === 1 ? 1.45 : 1.5, rand) : floating(n, 450, 1.2) };
  },
  night(rand, kind, n) {
    let b = frame() + P('M690 90A70 70 0 1 0 760 200A58 58 0 1 1 690 90Z');
    const spots = [[110, 110], [260, 80], [420, 140], [560, 90], [150, 280], [330, 250], [720, 320], [90, 450], [760, 520], [500, 230]];
    for (const [x, y] of spots) b += star(x + rand.range(-15, 15), y + rand.range(-15, 15), rand.range(18, 28), rand.range(8, 11));
    b += groundShape(850, rand, 18);
    return { back: b, slots: kind === 'ground' ? onGround(n, 915, n === 1 ? 1.4 : 1.5, rand) : floating(n, 520, 1.35) };
  },
  room(rand, kind, n) {
    let b = frame();
    b += R(500, 110, 250, 230, 6) + line(625, 110, 625, 340) + line(500, 225, 750, 225);
    b += P('M480 95Q520 220 470 360L470 95Z') + P('M770 95Q730 220 780 360L780 95Z');
    b += R(80, 140, 150, 110, 6) + P('M100 230L140 180L170 210L190 190L215 230Z');
    b += line(AREA.x0, 760, AREA.x1, 760);
    for (let x = 120; x < 800; x += 140) b += line(x, 760, x - 60, AREA.y1);
    b += E(CX, 925, 300, 55);
    return { back: b, slots: kind === 'ground' ? onGround(n, 925, n === 1 ? 1.35 : 1.45, rand) : floating(n, 520, 1.3) };
  },
  table(rand, kind, n) {
    let b = frame() + R(560, 100, 200, 190, 6) + line(660, 100, 660, 290) + line(560, 195, 760, 195);
    // a cup and a vase on the wall shelf
    b += R(90, 260, 280, 16) + P('M120 260L130 200L180 200L190 260Z') + P('M250 260Q230 220 255 180L285 180Q310 220 290 260Z');
    let cloth = `M${AREA.x0} 760L${AREA.x1} 760L${AREA.x1} 860`;
    for (let x = AREA.x1; x > AREA.x0 + 1; x -= 782 / 9) cloth += `Q${r1(x - 43)} 905 ${r1(x - 86.9)} 860`;
    b += P(cloth + 'Z') + R(AREA.x0, 860, AREA.x1 - AREA.x0, AREA.y1 - 860, 0, 'fill="none"');
    for (let x = 80; x < 800; x += 90) b += C(x, 810, 10);
    return { back: b, slots: kind === 'ground' ? onGround(n, 800, n === 1 ? 1.35 : 1.45, rand) : floating(n, 450, 1.2) };
  },
  sea(rand, kind, n) {
    let b = frame();
    for (let y = 120; y < 300; y += 90) b += curve(`M60 ${y}q40 -20 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0`);
    b += groundShape(880, rand, 18);
    for (let i = 0; i < 4; i++) {
      const x = [70, 200, 650, 770][i], h = rand.range(180, 300);
      b += P(`M${x} 900C${x - 40} ${900 - h * 0.3} ${x + 40} ${900 - h * 0.6} ${x} ${900 - h}C${x + 30} ${900 - h * 0.6} ${x - 10} ${900 - h * 0.3} ${x + 22} 900Z`);
    }
    b += P('M420 960Q440 920 470 960Q490 930 510 960Z') + E(330, 955, 40, 22) + E(560, 950, 30, 18);
    for (let i = 0; i < 9; i++) b += C(rand.range(80, 780), rand.range(330, 820), rand.range(8, 18));
    return { back: b, slots: floating(n, 520, n === 1 ? 1.5 : 1.45) };
  },
  sky(rand, kind, n) {
    let b = frame() + sun(130, 140, 48, 10) + cloud(600, 160, 220) + cloud(200, 820, 210) + cloud(650, 880, 180) + cloud(400, 360, 120);
    for (let i = 0; i < 3; i++) {
      const x = 330 + i * 70, y = 120 + (i % 2) * 30;
      b += curve(`M${x - 18} ${y}q9 -10 18 0q9 -10 18 0`);
    }
    return { back: b, slots: floating(n, 530, n === 1 ? 1.45 : 1.45) };
  },
  space(rand, kind, n) {
    let b = frame() + C(140, 160, 70) + curve('M80 150Q140 135 200 175M95 190Q150 180 190 200');
    b += E(700, 840, 120, 26) + C(700, 840, 62) + P('M580 840A120 26 0 0 0 820 840', 'fill="none"');
    b += C(720, 140, 30);
    for (let i = 0; i < 12; i++) b += star(rand.range(70, 780), rand.range(70, 960), rand.range(12, 22), rand.range(5, 8), rand.pick([4, 5]));
    return { back: b, slots: floating(n, 510, n === 1 ? 1.45 : 1.45) };
  },
  road(rand, kind, n) {
    let b = frame() + sun(720, 130, 42, 10) + cloud(250, 140, 170);
    b += P(`M${AREA.x0} 640Q200 540 360 620Q520 520 ${AREA.x1} 610L${AREA.x1} 760L${AREA.x0} 760Z`);
    // houses on the hill
    b += R(110, 520, 100, 90) + poly([[100, 525], [160, 470], [220, 525]]) + R(145, 560, 30, 50);
    b += R(560, 530, 90, 80) + poly([[550, 535], [605, 485], [660, 535]]) + R(590, 560, 26, 26);
    b += R(AREA.x0, 760, AREA.x1 - AREA.x0, 190);
    for (let x = 60; x < 800; x += 120) b += R(x, 850, 70, 14, 4);
    return { back: b, slots: kind === 'ground' ? onGround(n, 905, n === 1 ? 1.4 : 1.55, rand) : floating(n, 420, 1.1) };
  },
  water(rand, kind, n) {
    let b = frame() + sun(700, 150, 48, 10) + cloud(200, 160, 180);
    b += curve('M330 260q15 -15 30 0q15 -15 30 0') + curve('M420 220q12 -12 24 0q12 -12 24 0');
    b += P(`M${AREA.x0} 640L${AREA.x1} 640L${AREA.x1} ${AREA.y1}L${AREA.x0} ${AREA.y1}Z`);
    let f = '';
    for (let y = 860; y < 990; y += 55) f += curve(`M60 ${y}q45 -25 90 0t90 0t90 0t90 0t90 0t90 0t90 0t90 0`);
    return { back: b, front: f, slots: kind === 'ground' ? onGround(n, 870, n === 1 ? 1.4 : 1.55, rand) : floating(n, 500, 1.3) };
  },
  snow(rand, kind, n) {
    let b = frame() + cloud(200, 130, 190) + cloud(620, 150, 200);
    b += P(`M${AREA.x0} 820Q250 760 430 820Q620 770 ${AREA.x1} 810L${AREA.x1} ${AREA.y1}L${AREA.x0} ${AREA.y1}Z`);
    for (let i = 0; i < 14; i++) {
      const x = rand.range(70, 780), y = rand.range(250, 760);
      if (x > 220 && x < 630 && y > 300) continue;
      b += star(x, y, 16, 6, 6);
    }
    // a little pine tree
    b += poly([[100, 830], [150, 700], [200, 830]]) + poly([[115, 740], [150, 650], [185, 740]]) + R(140, 830, 20, 30);
    return { back: b, slots: kind === 'ground' ? onGround(n, 905, n === 1 ? 1.4 : 1.5, rand) : floating(n, 500, 1.3) };
  },
  rain(rand, kind, n) {
    let b = frame() + cloud(210, 150, 260) + cloud(630, 140, 240);
    for (let i = 0; i < 16; i++) {
      const x = rand.range(70, 780), y = rand.range(260, 700);
      b += P(`M${r1(x)} ${r1(y)}q-12 22 0 26q12 -4 0 -26Z`);
    }
    b += groundShape(860, rand, 8) + E(150, 950, 90, 18) + E(680, 960, 110, 20);
    return { back: b, slots: kind === 'ground' ? onGround(n, 915, n === 1 ? 1.4 : 1.5, rand) : floating(n, 520, 1.3) };
  },
  party(rand, kind, n) {
    let b = frame();
    // bunting
    b += curve('M40 90Q425 230 810 90');
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5) / 9, x = 40 + t * 770, y = 90 + 4 * t * (1 - t) * 140 * 0.98;
      b += poly([[x - 32, y - 4], [x + 32, y + 2], [x, y + 60]]);
    }
    b += C(110, 330, 44) + curve('M110 374q-10 40 10 80t-5 80') + C(745, 360, 40) + curve('M745 400q10 40 -10 80t5 80');
    for (let i = 0; i < 12; i++) {
      const x = rand.range(70, 780), y = rand.range(560, 980);
      if (x > 200 && x < 650) continue;
      b += rand.chance(0.5) ? C(x, y, 9) : star(x, y, 14, 6);
    }
    return { back: b, slots: kind === 'ground' ? onGround(n, 920, n === 1 ? 1.45 : 1.55, rand) : floating(n, 560, 1.35) };
  },
  pond(rand, kind, n) {
    let b = frame() + sun(130, 140, 44, 10) + cloud(560, 130, 190);
    b += groundShape(700, rand, 10) + E(CX, 870, 330, 95);
    b += P('M120 700L110 560M150 700L160 540M180 700L175 590', 'fill="none"') + E(110, 548, 10, 26) + E(160, 528, 10, 26);
    b += E(250, 880, 50, 18) + E(620, 860, 46, 16);
    return { back: b, slots: kind === 'ground' ? onGround(n, 900, n === 1 ? 1.4 : 1.5, rand) : floating(n, 480, 1.25) };
  },
  forest(rand, kind, n) {
    let b = frame() + cloud(430, 120, 170);
    for (const [x, h] of [[90, 520], [220, 470], [640, 500], [760, 540]]) {
      b += R(x - 16, 820 - 120, 32, 120) + blob([[x - 90, 720], [x - 100, 640], [x - 60, 580], [x - 20, 820 - h], [x + 40, 580], [x + 95, 630], [x + 90, 720]]);
    }
    b += groundShape(820, rand, 8) + grass(60, 790, 910, rand, 110);
    return { back: b, slots: kind === 'ground' ? onGround(n, 915, n === 1 ? 1.4 : 1.5, rand) : floating(n, 470, 1.25) };
  },
};

export const sceneNames = Object.keys(SCENES);
