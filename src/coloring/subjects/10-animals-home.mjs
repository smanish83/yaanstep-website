// Farm animals, pets and birds for the Yaanstep Sprouts coloring pages (SCRUM-515).
// Every shape is drawn by this code. Subjects face right; pairs mirror the second one.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring, littleFlower, mirrorX, makeCtx, r1 } from '../lib.mjs';

// ---------- small helpers of our own ----------

/** Draw fn(ctx) moved to x,y and scaled by k, keeping the line weight the same as the rest of the page. */
const at = (ctx, x, y, k, fn, extra = '') =>
  g(fn(makeCtx(ctx.s * k)), `translate(${r1(x)} ${r1(y)}) scale(${k})${extra ? ' ' + extra : ''}`, `stroke-width="${r1(6 / (ctx.s * k))}"`);

/** A woolly outline: bumps all round an ellipse. */
function fluffD(cx, cy, rx, ry, n, puff = 0.26, start = 0) {
  const pt = (a, k) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  const step = (Math.PI * 2) / n;
  let [x, y] = pt(start, 1);
  let d = `M${r1(x)} ${r1(y)}`;
  for (let i = 0; i < n; i++) {
    const [qx, qy] = pt(start + (i + 0.5) * step, 1 + puff);
    const [ex, ey] = pt(start + (i + 1) * step, 1);
    d += `Q${r1(qx)} ${r1(qy)} ${r1(ex)} ${r1(ey)}`;
  }
  return d + 'Z';
}
const fluff = (cx, cy, rx, ry, n, puff, start, a = '') => P(fluffD(cx, cy, rx, ry, n, puff, start), a);

/** A straight leg from top down to the ground with a hoof. */
function hoofLeg(x, top, w = 34, bottom = 200, hoofH = 22) {
  const h = w / 2;
  return P(`M${x - h} ${top}L${x - h + 2} ${bottom - hoofH}L${x + h - 2} ${bottom - hoofH}L${x + h} ${top}Z`) +
    R(x - h - 2, bottom - hoofH, w + 4, hoofH, 7);
}
/** A leg from (x1,y1) to (x2,y2) with a rounded end, given width. */
function limb(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
  const ex = (dx / L) * w / 2, ey = (dy / L) * w / 2;
  return P(`M${r1(x1 + nx)} ${r1(y1 + ny)}L${r1(x2 + nx)} ${r1(y2 + ny)}Q${r1(x2 + nx + ex)} ${r1(y2 + ny + ey)} ${r1(x2 + ex)} ${r1(y2 + ey)}Q${r1(x2 - nx + ex)} ${r1(y2 - ny + ey)} ${r1(x2 - nx)} ${r1(y2 - ny)}L${r1(x1 - nx)} ${r1(y1 - ny)}Z`);
}
/** A happy closed eye. */
const shut = (x, y, w) => curve(`M${r1(x - w)} ${r1(y)}Q${r1(x)} ${r1(y - w * 0.9)} ${r1(x + w)} ${r1(y)}`);
/** A simple daisy with a centre and n petals. */
function daisy(x, y, r, n = 8) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360;
    s += g(E(0, -r * 0.62, r * 0.3, r * 0.48), `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)})`);
  }
  return s + C(x, y, r * 0.38);
}
/** A cow bell hanging at x,y (top of the strap). */
const bell = (x, y, s = 1) =>
  P(`M${r1(x - 22 * s)} ${r1(y + 44 * s)}Q${r1(x - 24 * s)} ${r1(y + 8 * s)} ${r1(x)} ${r1(y + 6 * s)}Q${r1(x + 24 * s)} ${r1(y + 8 * s)} ${r1(x + 22 * s)} ${r1(y + 44 * s)}Z`) +
  C(x, y + 47 * s, 7 * s);

// ---------- FARM ----------

function cowFace(spot = true) {
  return (ctx) => {
    let s = '';
    s += g(E(0, 0, 34, 15), 'translate(-74 -30) rotate(-22)') + g(E(0, 0, 34, 15), 'translate(74 -30) rotate(22)');
    s += P('M-38 -52Q-52 -78 -40 -98Q-24 -80 -20 -56Z') + P('M38 -52Q52 -78 40 -98Q24 -80 20 -56Z');
    s += P('M-54 -28Q-54 -64 0 -64Q54 -64 54 -28L48 26Q0 36 -48 26Z');
    if (spot) s += P('M8 -63Q44 -64 53 -40L51 -12Q34 2 18 -8Q4 -24 8 -63Z');
    s += P('M-16 -62Q-12 -82 0 -66Q10 -84 16 -62Z');
    s += E(0, 38, 60, 36) + dark(E(-22, 34, 6, 9)) + dark(E(22, 34, 6, 9)) + smile(0, 56, 30, 0.25);
    s += eye(-24, -20, 11, [0.1, 0.2]) + eye(26, -20, 11, [0.1, 0.2]);
    return s;
  };
}

const cow = {
  id: 'cow', name: 'Cow', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += hoofLeg(-128, 60, 36) + hoofLeg(-84, 60, 36) + hoofLeg(20, 60, 36) + hoofLeg(64, 60, 36);
      s += curve('M-170 -20Q-198 30 -188 80') + P('M-188 74Q-204 96 -190 116Q-174 96 -188 74Z');
      s += E(-50, 98, 32, 22);
      s += R(-178, -50, 290, 145, 70);
      s += blob([[-130, -22], [-98, -36], [-66, -22], [-70, 10], [-100, 22], [-130, 6]]);
      s += blob([[-10, 14], [22, 2], [44, 22], [30, 52], [0, 46]]);
      s += blob([[-160, 40], [-140, 28], [-128, 50], [-146, 68]]);
      s += at(ctx, 100, -58, 0.92, cowFace());
      return s;
    }
    if (style === 1) {
      // lying down with a bell
      s += curve('M-172 100Q-200 150 -172 182') + P('M-174 176Q-196 186 -184 198Q-166 196 -174 176Z');
      s += R(-182, 30, 300, 165, 82);
      s += P('M-150 193Q-166 110 -96 104Q-44 110 -44 193Z');
      s += R(-60, 170, 60, 28, 12);
      s += blob([[-110, 50], [-78, 40], [-56, 60], [-74, 84], [-108, 80]]);
      s += blob([[-20, 70], [10, 60], [30, 80], [12, 104], [-16, 98]]);
      s += R(50, 172, 112, 28, 14);
      s += at(ctx, 88, -42, 1.05, cowFace(false));
      s += R(82, 34, 12, 14, 3) + bell(88, 46, 0.9);
      s += littleFlower(176, 200, 70);
      return s;
    }
    // big friendly face with a bell collar
    s += P('M-72 60L-86 200L86 200L72 60Z');
    s += P('M-80 138Q0 160 80 138L83 170Q0 192 -83 170Z');
    s += R(-8, 166, 16, 10, 3) + bell(0, 166, 0.75);
    s += at(ctx, 0, -18, 1.86, cowFace());
    s += daisy(-118, -92, 26, 8);
    return s;
  },
};

function pigFace(happy = false) {
  return (ctx) => {
    let s = P('M-56 -42Q-84 -88 -62 -102Q-30 -88 -18 -58Z') + P('M56 -42Q84 -88 62 -102Q30 -88 18 -58Z');
    s += E(0, 0, 72, 62);
    s += E(0, 20, 32, 22) + dark(E(-11, 20, 5, 8)) + dark(E(11, 20, 5, 8));
    s += happy ? shut(-28, -12, 11) + shut(28, -12, 11) : eye(-28, -14, 10, [0, 0.2]) + eye(28, -14, 10, [0, 0.2]);
    s += smile(0, 46, 30, 0.35);
    return s;
  };
}
/** A short pig leg with a split hoof. */
const pigLeg = (x, top, w = 46, bottom = 200) =>
  P(`M${x - w / 2} ${top}L${x - w / 2} ${bottom - 14}Q${x - w / 2} ${bottom} ${x - w / 2 + 12} ${bottom}L${x + w / 2 - 12} ${bottom}Q${x + w / 2} ${bottom} ${x + w / 2} ${bottom - 14}L${x + w / 2} ${top}Z`) +
  curve(`M${x - w / 2} ${bottom - 16}L${x + w / 2} ${bottom - 16}M${x} ${bottom - 16}L${x} ${bottom}`);

const pig = {
  id: 'pig', name: 'Pig', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      for (const x of [-120, -66, 16, 66]) s += pigLeg(x, 100);
      s += curve('M-174 14q-30 -6 -24 -30q8 -16 22 -4q8 14 -10 18');
      s += E(-30, 40, 150, 104);
      s += at(ctx, 108, -30, 1.02, pigFace());
      return s;
    }
    if (style === 1) {
      // lying happily in a mud puddle
      s += P('M-198 176Q-196 146 -130 150Q-40 136 40 146Q140 132 192 156Q206 182 160 194Q40 204 -80 200Q-190 202 -198 176Z');
      s += curve('M-164 96q-30 -6 -28 -30q6 -16 20 -6q8 12 -8 18');
      s += E(-30, 118, 140, 76);
      s += P('M-150 190Q-160 120 -100 116Q-50 120 -46 190Z', ctx.thin);
      s += blob([[-80, 70], [-50, 60], [-34, 80], [-56, 96], [-84, 90]]) + blob([[0, 130], [30, 120], [46, 140], [22, 156], [-4, 150]]);
      s += E(84, 180, 40, 20) + E(160, 182, 40, 20) + curve('M110 178L122 186M186 180L198 186', ctx.thin);
      s += at(ctx, 122, 92, 1.0, pigFace(true));
      for (const [x, y, r] of [[-180, 120, 10], [-192, 96, 6], [16, 40, 8], [36, 20, 5], [-150, 60, 6]]) s += C(x, y, r);
      return s;
    }
    // piglet sitting, front view, with a flower
    s += blob([[0, -40], [80, -10], [112, 80], [100, 170], [0, 194], [-100, 170], [-112, 80], [-80, -10]]);
    s += E(-82, 176, 50, 24) + E(82, 176, 50, 24) + curve('M-124 172L-112 180M124 172L112 180', ctx.thin);
    s += pigLeg(-40, 80, 40, 194) + pigLeg(40, 80, 40, 194);
    s += at(ctx, 0, -80, 1.12, pigFace());
    s += daisy(58, -168, 22, 7);
    return s;
  },
};

function sheepHead(ctx) {
  let s = g(E(0, 0, 28, 12), 'translate(-46 -6) rotate(18)') + g(E(0, 0, 28, 12), 'translate(46 -6) rotate(-18)');
  s += E(0, 4, 40, 50);
  s += fluff(0, -42, 40, 20, 9, 0.35, Math.PI);
  s += eye(-15, 0, 9, [0, 0.2]) + eye(15, 0, 9, [0, 0.2]);
  s += P('M-8 26Q0 32 8 26Q0 36 -8 26Z') + smile(0, 38, 16, 0.3);
  return s;
}

const sheep = {
  id: 'sheep', name: 'Sheep', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      for (const x of [-110, -70, 30, 70]) s += hoofLeg(x, 60, 26, 200, 20);
      s += fluff(-172, -24, 24, 20, 6, 0.4);
      s += fluff(-20, 10, 160, 100, 16, 0.24);
      s += at(ctx, 128, -58, 1.15, sheepHead);
      return s;
    }
    if (style === 1) {
      // front view
      s += hoofLeg(-92, 120, 26, 196, 18) + hoofLeg(92, 120, 26, 196, 18);
      s += fluff(0, 30, 150, 118, 18, 0.22, 0.1);
      s += hoofLeg(-44, 120, 30, 200, 22) + hoofLeg(44, 120, 30, 200, 22);
      s += at(ctx, 0, -62, 1.45, sheepHead);
      s += daisy(-110, 40, 18, 7) + daisy(100, 90, 15, 7);
      return s;
    }
    // lamb leaping over the grass
    s += limb(-70, 40, -104, 176, 24) + R(-120, 174, 32, 20, 6);
    s += limb(-36, 40, -50, 178, 24) + R(-66, 176, 32, 20, 6);
    s += limb(30, 20, 96, 92, 24) + g(R(-16, -4, 32, 20, 6), 'translate(104 100) rotate(42)');
    s += limb(64, 10, 136, 62, 24) + g(R(-16, -4, 32, 20, 6), 'translate(144 68) rotate(35)');
    s += fluff(-150, 12, 22, 18, 6, 0.4);
    s += g(fluff(-10, 0, 135, 82, 14, 0.25), 'rotate(-12)');
    s += at(ctx, 115, -98, 1.08, sheepHead, 'rotate(10)');
    s += curve('M-190 200q10 -26 24 -30M-160 200q4 -22 -6 -34M150 200q4 -20 20 -28M180 200q-2 -20 8 -30', ctx.thin);
    return s;
  },
};

/** A horse's head seen from the side, facing right. long: donkey ears. */
function horseHeadSide(donkey = false) {
  return (ctx) => {
    let s = '';
    if (donkey) {
      s += P('M-40 -44Q-62 -150 -40 -160Q-18 -120 -18 -50Z') + P('M-14 -54Q-10 -164 14 -164Q28 -120 4 -52Z');
      s += P('M-6 -70Q-2 -140 10 -146Q18 -110 2 -70Z', ctx.thin);
    } else {
      s += P('M-40 -44L-42 -102L-16 -56Z') + P('M-18 -54L-6 -108L8 -56Z');
    }
    s += blob([[-58, -12], [-46, -50], [-10, -64], [30, -40], [64, -8], [80, 22], [68, 46], [34, 50], [0, 38], [-38, 26]]);
    if (donkey) s += P('M40 -24Q26 14 38 50L48 50Q70 46 80 22Q72 -8 40 -24Z');
    else s += curve('M42 -20Q30 14 40 48', ctx.thin) + P('M-30 -58Q-14 -76 6 -60Q-6 -44 -24 -40Z');
    s += dark(E(64, 10, 5, 8)) + eye(-6, -24, 11, [0.4, 0]) + curve('M54 40Q64 42 72 36', ctx.thin);
    return s;
  };
}
function horseSide(ctx, donkey = false) {
  let s = '';
  if (donkey) s += curve('M-150 -16Q-180 30 -176 80') + P('M-176 70Q-194 96 -178 116Q-162 96 -176 70Z');
  else s += P('M-142 -20Q-196 20 -190 110Q-176 76 -168 118Q-160 66 -148 92Q-150 30 -130 10Z');
  s += R(-160, -40, 270, 125, 62);
  s += P('M4 -30Q30 -110 70 -156L140 -116Q118 -40 112 40Z');
  if (donkey) s += P('M72 -160L52 -136L62 -134L42 -108L52 -106L32 -80L42 -78L22 -50L32 -48L10 -24L22 -22Q36 -100 84 -150Z');
  else s += P('M80 -170Q52 -158 56 -134Q36 -118 40 -94Q20 -78 26 -54Q8 -40 14 -16L24 -24Q40 -110 92 -160Z');
  s += at(ctx, 120, -132, 1, horseHeadSide(donkey));
  return s;
}
/** A hoof at the end of a leg, turned to the leg's direction. */
const hoofAt = (x, y, deg, w = 34, h = 22) => g(R(-w / 2, -4, w, h, 7), `translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})`);

const horse = {
  id: 'horse', name: 'Horse', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      for (const x of [-120, -80, 30, 70]) s += hoofLeg(x, 50, 30, 200, 24);
      s += horseSide(ctx);
      return s;
    }
    if (style === 1) {
      // trotting pony with a saddle, one front leg up
      s += limb(-120, 60, -150, 172, 30) + hoofAt(-150, 176, 15);
      s += limb(-78, 60, -70, 172, 30) + hoofAt(-70, 176, -4);
      s += limb(28, 60, 36, 172, 30) + hoofAt(36, 176, -4);
      s += limb(76, 60, 120, 104, 30) + limb(120, 104, 108, 140, 28) + hoofAt(106, 144, 18, 32, 20);
      s += horseSide(ctx);
      s += P('M-70 -36L20 -36L26 30Q-26 40 -76 30Z') + curve('M-66 20Q-24 28 18 20', ctx.thin);
      s += P('M-62 -40Q-66 -64 -46 -60Q-20 -46 4 -60Q22 -64 18 -40Q-22 -30 -62 -40Z');
      s += line(-24, 32, -24, 84, ctx.thin) + P('M-38 84L-10 84L-14 100L-34 100Z');
      return s;
    }
    // looking over the stable door
    s += P('M-196 -110L0 -200L196 -110Z') + R(-180, -110, 360, 310);
    for (const y of [-60, -10, 40, 90, 140]) s += line(-180, y, -110, y, ctx.thin) + line(110, y, 180, y, ctx.thin);
    s += R(-110, -96, 220, 200, 6);
    s += P('M-90 110Q-70 0 -20 -60L50 -20Q20 40 30 110Z');
    s += P('M-6 -84Q-40 -70 -38 -44Q-60 -30 -58 -4Q-78 14 -74 38Q-92 56 -86 84L-74 84Q-60 -10 2 -66Z');
    s += at(ctx, 30, -60, 1.3, horseHeadSide());
    s += R(-122, 96, 244, 104, 4) + R(-130, 88, 260, 20, 6);
    s += line(-110, 112, 110, 186, ctx.thin) + line(-110, 150, 110, 150, ctx.thin);
    s += daisy(-148, 160, 20, 7) + daisy(148, 150, 20, 7);
    return s;
  },
};

function henBody(ctx) {
  let s = '';
  s += P('M-100 10Q-178 -30 -150 -120Q-128 -70 -96 -56Z') + P('M-112 30Q-196 20 -186 -70Q-150 -20 -110 -20Z');
  s += P('M74 -110Q66 -150 92 -140Q100 -168 118 -144Q138 -158 136 -120Z');
  s += blob([[-120, 20], [-80, -30], [0, -24], [48, -50], [60, -100], [104, -128], [146, -100], [146, -56], [130, 0], [124, 50], [70, 116], [-30, 128], [-104, 92]]);
  s += P('M140 -66Q154 -30 134 -30Q122 -48 132 -66Z');
  s += poly([[144, -88], [178, -76], [144, -64]]);
  s += eye(112, -92, 10, [0.4, 0]);
  s += blob([[-50, 8], [30, -6], [84, 22], [50, 74], [-20, 80], [-60, 50]]);
  s += curve('M-30 40Q10 52 50 40M-20 62Q14 70 40 62', ctx.thin);
  return s;
}
const birdFoot = (x, y) => curve(`M${x - 24} ${y}L${x} ${y - 6}L${x + 24} ${y}M${x} ${y - 6}L${x + 8} ${y}`);
/** A fluffy chick (or duckling with flat:true), feet at y = 60. */
function chick(flat = false) {
  return (ctx) => {
    let s = curve('M-8 44L-10 58M14 44L16 58') + birdFoot(-10, 62) + birdFoot(16, 62);
    s += P('M-46 0L-66 -16L-50 14Z');
    s += blob([[-50, 10], [-30, -18], [0, -18], [30, -50], [62, -48], [70, -20], [50, 0], [48, 30], [10, 50], [-36, 40]]);
    s += flat ? P('M64 -34Q90 -36 94 -24Q86 -14 62 -20Z') : poly([[66, -36], [86, -28], [66, -20]]);
    s += dotEye(44, -34, 6);
    s += blob([[-30, 6], [0, -2], [24, 14], [0, 30], [-24, 26]]);
    s += curve('M30 -50Q28 -66 40 -70M36 -50Q42 -62 52 -62', ctx.thin);
    return s;
  };
}

const chicken = {
  id: 'chicken', name: 'Chicken', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += curve('M0 120L-4 194M60 112L64 194');
      s += birdFoot(-4, 200) + birdFoot(64, 200);
      s += at(ctx, 0, 0, 1.02, henBody);
      return s;
    }
    if (style === 1) {
      // hen on her nest, with eggs and a chick
      s += at(ctx, -30, 40, 0.86, henBody);
      s += P('M-196 110Q-180 196 -30 196Q120 196 136 110Q-30 140 -196 110Z');
      for (let i = 0; i < 7; i++) s += curve(`M${-176 + i * 44} ${126 + (i % 2) * 8}l30 ${10 + (i % 3) * 4}`, ctx.thin);
      s += curve('M-150 162l40 6M-70 172l40 -4M10 168l40 4', ctx.thin);
      s += at(ctx, 158, 136, 0.62, chick());
      return s;
    }
    // rooster crowing
    s += P('M-60 0Q-150 -120 -60 -190Q-110 -100 -40 -40Z');
    s += P('M-70 20Q-200 -40 -150 -170Q-150 -70 -60 -20Z');
    s += P('M-70 50Q-200 60 -194 -60Q-160 20 -70 20Z');
    s += P('M-64 70Q-170 130 -196 50Q-130 80 -70 46Z');
    s += curve('M10 120L4 194M64 116L70 194') + birdFoot(4, 200) + birdFoot(70, 200);
    s += P('M60 -150Q48 -196 80 -184Q86 -214 110 -190Q130 -206 136 -180Q160 -186 150 -150Z');
    s += blob([[-80, 30], [-40, -40], [40, -40], [70, -100], [96, -160], [140, -158], [156, -116], [140, -60], [130, 40], [80, 110], [-10, 126], [-74, 90]]);
    s += P('M146 -110Q166 -64 140 -64Q128 -86 136 -110Z');
    s += P('M74 -110Q60 -70 54 -40L68 -28L78 -44L92 -26L104 -44L118 -28L130 -46L142 -40L144 -96Z');
    s += poly([[150, -140], [190, -150], [156, -124]]) + poly([[156, -120], [186, -104], [150, -112]]);
    s += eye(124, -136, 10, [0.4, -0.2]);
    s += blob([[-30, 10], [40, 0], [90, 30], [60, 80], [-10, 84], [-40, 50]]);
    s += curve('M-10 44Q30 54 66 42M0 64Q30 72 54 64', ctx.thin);
    s += curve('M180 -180l12 -12M192 -160l16 -6', ctx.thin);
    return s;
  },
};

function duckBody(ctx) {
  let s = '';
  s += P('M-150 30L-196 -14L-140 -6Z');
  s += blob([[-160, 30], [-120, -18], [-40, -6], [30, 6], [118, 4], [150, 60], [110, 140], [0, 160], [-110, 140], [-158, 90]]);
  s += blob([[-80, 36], [-10, 18], [66, 46], [56, 96], [-20, 104]]) + curve('M-20 56Q12 70 44 64M-10 80Q20 90 46 84', ctx.thin);
  s += blob([[56, 20], [62, -20], [64, -70], [104, -120], [160, -108], [172, -64], [138, -28], [130, 16]]);
  s += P('M164 -82Q210 -86 216 -64Q200 -44 160 -50Z') + curve('M166 -66L210 -65', ctx.thin);
  s += eye(130, -80, 12, [0.4, -0.1]);
  return s;
}
const webFoot = (x, y) => P(`M${x - 6} ${y - 50}L${x - 4} ${y - 18}L${x - 34} ${y}L${x + 30} ${y}L${x + 8} ${y - 18}L${x + 6} ${y - 50}Z`);

const duck = {
  id: 'duck', name: 'Duck', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'pond', 'meadow', 'garden', 'rain', 'hills'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += webFoot(-40, 200) + webFoot(40, 200);
      s += at(ctx, 0, -6, 1.0, duckBody);
      return s;
    }
    if (style === 1) {
      // swimming, with ripples and a duckling
      s += at(ctx, -40, 40, 0.95, duckBody);
      s += at(ctx, 148, 140, 0.62, chick(true));
      s += P('M-200 170Q-150 150 -100 170T0 170T100 170T200 170L200 200L-200 200Z');
      s += curve('M-170 192q25 -12 50 0M-20 194q25 -12 50 0M110 192q25 -12 50 0', ctx.thin);
      return s;
    }
    // walking with two ducklings behind
    s += webFoot(80, 200) + webFoot(140, 200);
    s += at(ctx, 100, 30, 0.68, duckBody);
    s += at(ctx, -40, 160, 0.62, chick(true));
    s += at(ctx, -150, 166, 0.55, chick(true));
    return s;
  },
};

function goatHead(ctx) {
  let s = '';
  s += P('M-24 -58Q-34 -110 -62 -124Q-46 -92 -42 -50Z') + P('M24 -58Q34 -110 62 -124Q46 -92 42 -50Z');
  s += g(E(0, 0, 36, 13), 'translate(-62 -6) rotate(36)') + g(E(0, 0, 36, 13), 'translate(62 -6) rotate(-36)');
  s += P('M-22 56Q-18 130 0 140Q18 130 22 56Z');
  s += blob([[-42, -56], [0, -68], [42, -56], [44, 0], [30, 60], [0, 72], [-30, 60], [-44, 0]]);
  s += P('M-14 -66Q-6 -50 0 -66Q6 -50 14 -66Q0 -76 -14 -66Z', ctx.thin);
  s += E(0, 44, 28, 22) + dark(E(-10, 42, 4, 6)) + dark(E(10, 42, 4, 6)) + smile(0, 58, 14, 0.3);
  s += eye(-19, -18, 10, [0, 0.2]) + eye(19, -18, 10, [0, 0.2]);
  return s;
}
function goatSide(ctx) {
  let s = '';
  for (const x of [-110, -72, 34, 70]) s += hoofLeg(x, 40, 26, 200, 20);
  s += P('M-150 -20L-176 -60L-140 -46Z');
  s += R(-160, -40, 260, 110, 54);
  s += P('M40 -30L82 -120L140 -96L100 30Z');
  s += at(ctx, 120, -100, 0.92, goatHead);
  return s;
}

const goat = {
  id: 'goat', name: 'Goat', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return goatSide(ctx);
    if (style === 1) {
      // standing on a big rock
      s += at(ctx, 6, -40, 0.7, goatSide);
      s += P('M-176 200Q-186 120 -110 86Q-40 74 20 86Q120 76 166 120Q196 160 186 200Z');
      s += curve('M-100 120Q-70 140 -80 176M70 116Q100 140 130 140', ctx.thin);
      s += littleFlower(-186, 200, 46);
      return s;
    }
    // big face munching a flower, with a bell
    s += P('M-60 70L-80 200L80 200L60 70Z');
    s += P('M-70 150Q0 170 70 150L74 178Q0 198 -74 178Z') + R(-8, 174, 16, 8, 3) + bell(0, 172, 0.55);
    s += at(ctx, 0, -30, 1.6, goatHead);
    s += curve('M28 54Q70 60 104 40', ctx.thin) + daisy(118, 34, 26, 8);
    return s;
  },
};

function bunnyHead(ctx) {
  let s = '';
  s += P('M-34 -40Q-60 -150 -28 -170Q4 -150 -6 -44Z') + P('M-26 -56Q-40 -130 -26 -150Q-12 -130 -14 -56Z', ctx.thin);
  s += P('M34 -40Q60 -150 28 -170Q-4 -150 6 -44Z') + P('M26 -56Q40 -130 26 -150Q12 -130 14 -56Z', ctx.thin);
  s += E(0, 0, 58, 50);
  s += eye(-22, -8, 10, [0, 0.2]) + eye(22, -8, 10, [0, 0.2]);
  s += P('M-8 14L8 14L0 22Z') + curve('M0 22L0 30M-12 34Q-6 38 0 30Q6 38 12 34', ctx.thin);
  s += curve('M-24 22L-56 16M-24 28L-56 32M24 22L56 16M24 28L56 32', ctx.hair);
  return s;
}
/** A carrot pointing down from its top at 0,0. */
function carrot(len, w, ctx) {
  let s = P('M-4 0Q-22 -30 -8 -44Q2 -22 0 0Z') + P('M2 0Q4 -36 18 -42Q20 -18 4 0Z') + P('M0 0Q-30 -14 -34 -30Q-10 -24 0 0Z');
  s += P(`M${-w / 2} 0Q${-w / 2} ${len * 0.55} 0 ${len}Q${w / 2} ${len * 0.55} ${w / 2} 0Z`);
  s += curve(`M${-w * 0.45} ${len * 0.25}l${w * 0.3} 2M${w * 0.15} ${len * 0.5}l${w * 0.28} -2`, ctx.thin);
  return s;
}

const rabbit = {
  id: 'rabbit', name: 'Rabbit', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // sitting, side view
      s += fluff(-124, 120, 24, 22, 7, 0.35);
      s += blob([[-116, 140], [-96, 60], [-40, 10], [30, 0], [76, 40], [86, 110], [64, 176], [-10, 196], [-96, 188]]);
      s += E(-56, 136, 46, 44, ctx.thin);
      s += P('M-100 198Q-108 166 -66 168L40 174Q72 180 66 198Z');
      s += R(56, 110, 32, 88, 16);
      s += at(ctx, 56, -30, 1.15, bunnyHead, 'rotate(8)');
      return s;
    }
    if (style === 1) {
      // standing front view, holding a carrot
      s += E(-40, 186, 36, 16) + E(40, 186, 36, 16);
      s += blob([[0, 10], [72, 40], [84, 120], [50, 180], [0, 190], [-50, 180], [-84, 120], [-72, 40]]);
      s += E(0, 124, 46, 54, ctx.thin);
      s += g(carrot(150, 40, ctx), 'translate(70 30) rotate(60)');
      s += E(-30, 96, 22, 18) + E(40, 64, 22, 18);
      s += at(ctx, 0, -40, 1.12, bunnyHead);
      return s;
    }
    // lying down, nibbling a carrot
    s += fluff(-156, 50, 24, 22, 7, 0.35);
    s += blob([[-110, 150], [-150, 176], [-196, 186], [-194, 200], [-120, 200], [-80, 176]]);
    s += blob([[-150, 90], [-120, 40], [-40, 20], [40, 40], [100, 90], [96, 150], [40, 176], [-90, 176], [-140, 140]]);
    s += E(-90, 124, 50, 40, ctx.thin);
    s += g(carrot(110, 42, ctx), 'translate(96 166) rotate(-90)');
    s += E(96, 186, 34, 14) + E(140, 188, 32, 13);
    s += at(ctx, 76, 30, 1.0, bunnyHead, 'rotate(12)');
    return s;
  },
};

function donkeyFace(ctx) {
  let s = '';
  s += P('M-30 -90Q-70 -200 -40 -210Q-10 -170 -10 -96Z') + P('M-30 -110Q-50 -170 -40 -190Q-24 -160 -20 -112Z', ctx.thin);
  s += P('M30 -90Q70 -200 40 -210Q10 -170 10 -96Z') + P('M30 -110Q50 -170 40 -190Q24 -160 20 -112Z', ctx.thin);
  s += blob([[-48, -100], [0, -116], [48, -100], [54, -30], [46, 30], [0, 58], [-46, 30], [-54, -30]]);
  s += P('M-22 -112L-14 -130L-6 -114L0 -134L8 -114L16 -128L22 -110Z');
  s += E(0, 32, 48, 34) + dark(E(-17, 30, 6, 9)) + dark(E(17, 30, 6, 9)) + smile(0, 52, 24, 0.25);
  s += eye(-24, -40, 12, [0, 0.2]) + eye(24, -40, 12, [0, 0.2]);
  return s;
}

const donkey = {
  id: 'donkey', name: 'Donkey', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      for (const x of [-120, -80, 30, 70]) s += hoofLeg(x, 50, 30, 200, 22);
      s += horseSide(ctx, true);
      return s;
    }
    if (style === 1) {
      // carrying a basket of carrots
      for (const x of [-120, -80, 30, 70]) s += hoofLeg(x, 50, 30, 200, 22);
      s += horseSide(ctx, true);
      s += P('M-110 -54Q-40 -74 10 -54L4 -30Q-50 -44 -104 -30Z');
      for (const [x, a] of [[-86, -14], [-50, 4], [-16, 16]]) s += g(carrot(70, 30, ctx), `translate(${x} -72) rotate(${a})`);
      s += P('M-122 -50L12 -50L2 64Q-55 78 -112 64Z');
      for (const y of [-20, 10, 40]) s += curve(`M-116 ${y}Q-55 ${y + 12} 6 ${y}`, ctx.thin);
      for (const x of [-84, -54, -24]) s += line(x, -48, x + 2, 68, ctx.thin);
      return s;
    }
    // big friendly face
    s += P('M-56 40L-70 200L70 200L56 40Z');
    s += at(ctx, 0, 12, 1.6, donkeyFace);
    s += daisy(-130, 60, 24, 8) + daisy(140, 120, 20, 7);
    return s;
  },
};

const farm = {
  id: 'farm', name: 'Farm animals', order: 10,
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'rain', 'snow', 'night'],
  pairScenes: ['meadow', 'hills', 'garden'],
  icon: 'cow', kind: 'ground',
  subjects: [cow, pig, sheep, horse, chicken, duck, goat, rabbit, donkey],
};


// ---------- PETS ----------

function dogHead(tongue = false, patch = true) {
  return (ctx) => {
    let s = P('M-44 -44Q-96 -50 -96 6Q-96 48 -70 52Q-50 30 -46 -10Z') + P('M44 -44Q96 -50 96 6Q96 48 70 52Q50 30 46 -10Z');
    s += E(0, 0, 64, 58);
    if (patch) s += blob([[8, -52], [40, -50], [58, -18], [42, 0], [16, -10]]);
    s += E(0, 28, 36, 26);
    if (tongue) s += P('M-9 40Q-8 66 4 64Q14 60 9 40Z');
    s += dark(P('M-14 12Q0 4 14 12Q12 26 0 28Q-12 26 -14 12Z')) + E(-4, 12, 4, 2.5, 'fill="#fff" stroke="none"');
    s += curve('M0 28L0 36M-16 38Q-8 46 0 36Q8 46 16 38', ctx.thin);
    s += eye(-24, -14, 10, [0, 0.2]) + eye(24, -14, 10, [0, 0.2]);
    return s;
  };
}
const paw = (x, y, w = 40, h = 20) => E(x, y, w / 2, h / 2) + curve(`M${x - w * 0.12} ${y + h / 2}l0 -${h * 0.4}M${x + w * 0.12} ${y + h / 2}l0 -${h * 0.4}`);
function bone(x, y, len, ang = 0) {
  const h = len / 2;
  return g(P(`M${-h} -10L${h} -10A12 12 0 1 1 ${h + 10} 0A12 12 0 1 1 ${h} 10L${-h} 10A12 12 0 1 1 ${-h - 10} 0A12 12 0 1 1 ${-h} -10Z`),
    `translate(${x} ${y}) rotate(${ang})`);
}

const dog = {
  id: 'dog', name: 'Dog', styles: 4,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // puppy sitting, front view
      s += P('M60 150Q130 140 146 76Q154 64 162 80Q156 160 70 178Z') + curve('M170 60q14 6 18 20M176 104q12 4 16 14', ctx.thin);
      s += E(-70, 160, 56, 40) + E(70, 160, 56, 40);
      s += paw(-100, 188, 60, 22) + paw(100, 188, 60, 22);
      s += blob([[0, -10], [64, 10], [86, 100], [70, 176], [0, 192], [-70, 176], [-86, 100], [-64, 10]]);
      s += R(-50, 80, 36, 106, 18) + R(14, 80, 36, 106, 18) + paw(-32, 188, 44, 20) + paw(32, 188, 44, 20);
      s += P('M-60 4Q0 30 60 4L62 22Q0 48 -62 22Z') + C(0, 52, 16) + C(0, 52, 7, ctx.thin);
      s += at(ctx, 0, -76, 1.3, dogHead(true));
      return s;
    }
    if (style === 1) {
      // standing, side view, wagging its tail
      for (const x of [-120, -80, 30, 70]) s += R(x - 16, 40, 32, 150, 16) + paw(x + 6, 190, 44, 20);
      s += P('M-140 0Q-190 -40 -176 -120Q-160 -128 -158 -112Q-168 -60 -126 -20Z') + curve('M-196 -110q-4 18 4 30M-190 -146q8 -6 20 -4', ctx.thin);
      s += R(-160, -40, 260, 110, 55);
      s += blob([[-120, -36], [-70, -40], [-50, -10], [-80, 20], [-120, 10]]);
      s += P('M40 -60Q90 -30 136 -60L136 -36Q90 -6 40 -36Z') + C(90, -10, 13);
      s += at(ctx, 96, -96, 1.0, dogHead(true, false));
      return s;
    }
    if (style === 2) {
      // lying down with a bone
      s += P('M-160 130Q-200 150 -190 190Q-176 196 -170 186Q-176 160 -150 150Z');
      s += E(-30, 136, 150, 62);
      s += E(-110, 150, 50, 40, ctx.thin) + E(-120, 190, 40, 12);
      s += blob([[-70, 100], [-30, 90], [-10, 110], [-34, 128], [-70, 124]]);
      s += R(34, 162, 110, 32, 16) + R(84, 168, 112, 30, 15);
      s += bone(110, 150, 70, -10);
      s += at(ctx, 96, 64, 1.12, dogHead(false));
      return s;
    }
    // peeking out of a dog house
    s += R(-150, -40, 300, 240);
    for (const y of [10, 60, 110, 160]) s += line(-150, y, -90, y, ctx.thin) + line(90, y, 150, y, ctx.thin);
    s += P('M-186 -24L0 -184L186 -24L164 0L0 -142L-164 0Z');
    s += heart(0, -70, 50);
    s += P('M-86 200L-86 50Q-86 -24 0 -24Q86 -24 86 50L86 200Z');
    s += at(ctx, 0, 70, 1.0, dogHead(true));
    s += paw(-36, 186, 50, 22) + paw(36, 186, 50, 22);
    s += bone(150, 186, 56, 0);
    return s;
  },
};

function catHead(asleep = false) {
  return (ctx) => {
    let s = P('M-58 -22L-62 -98L-10 -54Z') + P('M58 -22L62 -98L10 -54Z');
    s += E(0, 0, 66, 56);
    s += curve('M-50 -40L-54 -80L-28 -56M50 -40L54 -80L28 -56', ctx.thin);
    s += curve('M0 -54L0 -38M-12 -52L-10 -40M12 -52L10 -40', ctx.thin);
    s += asleep ? shut(-26, -4, 12).replace('Q', 'Q').replace(/Q([-\d.]+) ([-\d.]+)/, (m, a, b) => `Q${a} ${(+b + 21).toFixed(1)}`) + shut(26, -4, 12).replace(/Q([-\d.]+) ([-\d.]+)/, (m, a, b) => `Q${a} ${(+b + 21).toFixed(1)}`)
      : eye(-24, -8, 12, [0, 0.1]) + eye(24, -8, 12, [0, 0.1]);
    s += P('M-8 14L8 14L0 23Z') + curve('M0 23Q-6 32 -14 27M0 23Q6 32 14 27', ctx.thin);
    s += curve('M-30 18L-74 10M-30 26L-74 30M30 18L74 10M30 26L74 30', ctx.hair);
    return s;
  };
}

const cat = {
  id: 'cat', name: 'Cat', styles: 3,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // sitting with its tail up
      s += P('M-90 150Q-178 140 -178 50Q-178 0 -144 -6Q-158 20 -156 54Q-150 124 -84 126Z');
      s += blob([[-100, 186], [-110, 100], [-60, 10], [10, -6], [62, 24], [84, 120], [70, 192], [-20, 198]]);
      s += E(-50, 148, 50, 44, ctx.thin) + E(-60, 192, 40, 10);
      s += R(4, 96, 32, 102, 16) + R(42, 100, 32, 98, 16) + paw(20, 190, 38, 18) + paw(58, 190, 38, 18);
      s += at(ctx, 20, -66, 1.2, catHead());
      return s;
    }
    if (style === 1) {
      // curled up asleep in a basket
      s += P('M-160 60Q0 -200 160 60L136 60Q0 -160 -136 60Z');
      s += E(-10, 40, 140, 66);
      s += at(ctx, 80, 6, 0.95, catHead(true), 'rotate(-10)');
      s += P('M-176 60L176 60L150 196L-150 196Z');
      for (const y of [100, 140, 176]) s += curve(`M${-170 + (y - 60) * 0.2} ${y}L${170 - (y - 60) * 0.2} ${y}`, ctx.thin);
      for (let x = -130; x <= 130; x += 52) s += line(x, 70, x * 0.9, 190, ctx.thin);
      s += R(-188, 44, 376, 30, 15);
      s += P('M-110 50Q-150 50 -150 90Q-150 130 -120 140Q-128 100 -120 84Q-108 70 -90 70Z');
      s += E(40, 66, 30, 14) + E(100, 64, 28, 13);
      return s;
    }
    // playing with a ball of yarn
    s += curve('M150 160Q110 200 40 196Q-40 190 -80 198', ctx.thin);
    for (const x of [-140, -100, 0]) s += R(x - 15, 40, 30, 150, 15) + paw(x + 4, 190, 40, 18);
    s += P('M-150 10Q-200 -20 -186 -90Q-174 -110 -160 -100Q-176 -60 -136 -20Z');
    s += R(-170, -20, 230, 100, 50);
    s += P('M20 30Q70 50 96 100L72 112Q50 76 10 66Z') + E(92, 112, 22, 16);
    s += at(ctx, 50, -70, 1.05, catHead());
    s += C(150, 160, 42) + curve('M116 140Q150 130 186 150M112 166Q150 150 190 172M130 196Q140 160 170 124', ctx.thin);
    return s;
  },
};

function fishD(fancy = false) {
  return (ctx) => {
    let s = '';
    s += fancy ? P('M-60 0Q-110 -100 -180 -90Q-140 -50 -170 -10Q-140 0 -170 30Q-130 40 -160 100Q-100 80 -60 0Z')
      : P('M-62 0Q-110 -70 -150 -80Q-128 -30 -140 0Q-128 30 -150 80Q-110 70 -62 0Z');
    s += curve(fancy ? 'M-80 -6Q-120 -50 -150 -70M-80 4Q-130 20 -150 50' : 'M-80 -6Q-110 -36 -130 -50M-80 6Q-110 36 -130 50', ctx.thin);
    s += P('M-46 -46Q-14 -112 44 -56Z') + P('M-24 50Q-12 84 22 56Z');
    s += E(0, 0, 82, 58);
    s += curve('M40 -42Q24 0 40 42', ctx.thin);
    s += curve('M-10 -20q10 10 0 20M-34 -10q10 10 0 20M-10 14q10 10 0 20', ctx.thin);
    s += P('M14 18Q-6 40 6 52Q24 44 26 24Z');
    s += eye(52, -14, 12, [0.3, 0]) + curve('M62 20Q70 26 78 18', ctx.thin);
    return s;
  };
}
const bubbles = (pts) => pts.map(([x, y, r]) => C(x, y, r) + C(x - r * 0.35, y - r * 0.35, r * 0.25, 'fill="#fff" stroke="none"')).join('');

const goldfish = {
  id: 'goldfish', name: 'Goldfish', styles: 4, kind: 'float', count: 8,
  scenes: ['plain', 'hearts', 'stars', 'sea'], pairs: false,
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // in a round bowl
      s += R(-70, 168, 140, 26, 10);
      s += P('M-74 -150Q-74 -120 -110 -96Q-186 -40 -176 60Q-158 172 0 180Q158 172 176 60Q186 -40 110 -96Q74 -120 74 -150Z');
      s += E(0, -150, 76, 14);
      s += curve('M-160 -50q20 -12 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0', ctx.thin);
      s += P('M-120 150Q-140 80 -110 30Q-110 90 -96 150Z') + P('M-104 150Q-80 60 -60 70Q-80 110 -84 152Z');
      for (const [x, y, r] of [[-60, 156, 14], [-30, 162, 12], [0, 158, 15], [34, 162, 12], [64, 156, 14], [96, 146, 12]]) s += C(x, y, r);
      s += at(ctx, 30, 50, 0.72, fishD());
      s += bubbles([[100, 10, 10], [116, -20, 7], [104, -46, 5]]);
      return s;
    }
    if (style === 1) {
      // in a fish tank with a castle
      s += R(-190, -130, 380, 300, 8);
      s += curve('M-190 -100q24 -12 48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0', ctx.thin);
      s += P('M-190 140Q-100 120 0 136Q100 120 190 136L190 170L-190 170Z');
      s += R(70, 50, 90, 96) + R(60, 20, 36, 40) + R(134, 20, 36, 40) + R(96, 40, 38, 20);
      s += P('M60 20L60 6L72 6L72 14L84 14L84 6L96 6L96 20Z') + P('M134 20L134 6L146 6L146 14L158 14L158 6L170 6L170 20Z');
      s += P('M100 146L100 112Q115 92 130 112L130 146Z');
      s += P('M-160 140Q-180 60 -150 -20Q-150 60 -136 140Z') + P('M-140 140Q-110 40 -90 50Q-112 100 -120 140Z');
      s += at(ctx, -20, -20, 0.7, fishD());
      s += bubbles([[48, -50, 9], [60, -76, 6]]);
      s += R(-200, -150, 400, 26, 8) + R(-200, 166, 400, 28, 8);
      return s;
    }
    if (style === 2) {
      // swimming, blowing bubbles
      s += at(ctx, -10, 20, 1.2, fishD());
      s += bubbles([[130, -40, 16], [150, -96, 11], [132, -140, 8]]);
      return s;
    }
    // a fancy goldfish and a little friend
    s += at(ctx, -10, 30, 1.0, fishD(true), 'rotate(-12)');
    s += at(ctx, 120, -130, 0.45, fishD());
    s += bubbles([[110, -30, 12], [140, -60, 8]]);
    return s;
  },
};

function hamFront(seed = true) {
  return (ctx) => {
    let s = C(-50, -96, 22) + C(50, -96, 22) + C(-50, -96, 11, ctx.thin) + C(50, -96, 11, ctx.thin);
    s += E(-30, 98, 22, 10) + E(30, 98, 22, 10);
    s += blob([[0, -112], [56, -98], [82, -50], [88, 20], [70, 82], [0, 104], [-70, 82], [-88, 20], [-82, -50], [-56, -98]]);
    s += E(0, 44, 50, 52, ctx.thin);
    s += eye(-26, -60, 10, [0, 0.2]) + eye(26, -60, 10, [0, 0.2]);
    s += dark(E(0, -40, 7, 5)) + curve('M0 -35L0 -30M-8 -26Q-4 -22 0 -30Q4 -22 8 -26', ctx.thin);
    s += curve('M-14 -40L-50 -48M-14 -36L-50 -32M14 -40L50 -48M14 -36L50 -32', ctx.hair);
    if (seed) s += P('M-10 18Q0 -12 10 18Q0 30 -10 18Z') + curve('M0 -4L0 22', ctx.hair);
    s += E(-18, 10, 14, 11) + E(18, 10, 14, 11);
    return s;
  };
}
function hamSide(ctx) {
  let s = E(-40, 40, 16, 8) + E(30, 42, 16, 8);
  s += C(16, -50, 15) + C(16, -50, 7, ctx.thin);
  s += blob([[-76, 20], [-64, -30], [-10, -54], [44, -44], [78, -6], [74, 22], [30, 40], [-50, 40]]);
  s += eye(40, -22, 8, [0.4, 0]) + dark(E(76, -6, 5, 4)) + curve('M58 -2L90 -10M58 4L90 8', ctx.hair);
  return s;
}

const hamster = {
  id: 'hamster', name: 'Hamster', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'room', 'party', 'garden', 'table'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += at(ctx, 0, 34, 1.6, hamFront());
      for (const [x, y, a] of [[130, 190, 80], [160, 186, 100], [146, 172, 60], [-150, 190, 100], [-176, 188, 70]]) s += g(P('M-10 0Q0 -30 10 0Q0 12 -10 0Z'), `translate(${x} ${y}) rotate(${a})`);
      return s;
    }
    if (style === 1) {
      // running in a wheel
      s += poly([[-8, -20], [-90, 186], [-60, 186], [8, -20]]) + poly([[-8, -20], [90, 186], [60, 186], [8, -20]]);
      s += R(-110, 182, 220, 18, 8);
      s += C(0, -20, 170) + C(0, -20, 150);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        s += line(Math.cos(a) * 18, -20 + Math.sin(a) * 18, Math.cos(a) * 150, -20 + Math.sin(a) * 150, ctx.thin);
      }
      s += C(0, -20, 18);
      s += at(ctx, 0, 76, 1.05, hamSide);
      return s;
    }
    // peeking out of a teacup
    s += E(0, 186, 176, 16);
    s += P('M118 60Q196 56 188 116Q180 166 100 160L106 138Q160 140 164 112Q166 82 118 84Z');
    s += E(0, 40, 124, 22);
    s += at(ctx, 0, 30, 1.25, hamFront(false));
    s += P('M-124 40Q-118 180 0 182Q118 180 124 40Q0 70 -124 40Z');
    s += heart(-50, 112, 40) + heart(50, 112, 40) + heart(0, 140, 30);
    s += E(-36, 50, 20, 13) + E(36, 50, 20, 13);
    return s;
  },
};

function turtleSide(ctx) {
  let s = '';
  s += R(-104, 24, 44, 64, 20) + R(52, 24, 44, 64, 20);
  s += poly([[-130, 30], [-170, 50], [-128, 52]]);
  s += blob([[70, 20], [96, -24], [130, -54], [168, -46], [178, -14], [156, 16], [104, 36]]);
  s += eye(148, -26, 10, [0.4, 0]) + curve('M150 2Q162 6 170 -4', ctx.thin);
  s += P('M-130 40Q-130 -110 0 -110Q130 -110 130 40Z');
  s += poly([[-36, -70], [36, -70], [56, -30], [36, 10], [-36, 10], [-56, -30]]);
  s += curve('M-36 -70L-60 -100M36 -70L60 -100M56 -30L108 -30M-56 -30L-108 -30M36 10L50 36M-36 10L-50 36', ctx.thin);
  s += R(-144, 30, 288, 24, 12);
  s += R(-72, 40, 42, 52, 18) + R(84, 40, 42, 52, 18);
  return s;
}

const turtle = {
  id: 'turtle', name: 'Turtle', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'pond', 'garden', 'meadow', 'rain'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return at(ctx, -6, 94, 1.14, turtleSide);
    if (style === 1) {
      // front view, big smile
      s += E(-126, 176, 46, 24) + E(126, 176, 46, 24);
      s += P('M-180 130Q-180 -80 0 -80Q180 -80 180 130Z');
      s += poly([[-40, -50], [40, -50], [62, 0], [40, 44], [-40, 44], [-62, 0]]);
      s += curve('M-40 -50L-70 -70M40 -50L70 -70M62 0L150 0M-62 0L-150 0M40 44L60 120M-40 44L-60 120', ctx.thin);
      s += R(-192, 120, 384, 30, 15);
      s += P('M-50 150L-60 200L60 200L50 150Z');
      s += C(0, 110, 66);
      s += eye(-24, 96, 12, [0, 0.2]) + eye(24, 96, 12, [0, 0.2]) + smile(0, 130, 40, 0.35) + dark(C(-6, 116, 2.5)) + dark(C(6, 116, 2.5));
      s += E(-84, 186, 34, 16) + E(84, 186, 34, 16);
      return s;
    }
    // a baby riding on its mother's back
    s += at(ctx, -10, 110, 1.0, turtleSide);
    s += at(ctx, 0, -34, 0.5, turtleSide);
    return s;
  },
};

function gpSide(ctx) {
  let s = E(-90, 74, 24, 12) + E(-30, 78, 22, 11) + E(70, 76, 22, 11) + E(110, 74, 20, 10);
  s += blob([[-154, 40], [-146, -20], [-90, -70], [0, -78], [80, -64], [128, -36], [154, 0], [152, 40], [120, 70], [-120, 76]]);
  s += blob([[-152, 34], [-144, -20], [-100, -56], [-60, -44], [-50, 20], [-90, 64], [-130, 66]]);
  s += blob([[10, -76], [56, -66], [64, -24], [34, -8], [4, -34]]);
  s += P('M60 -54Q30 -70 40 -30Q50 -16 70 -30Z');
  s += eye(96, -22, 11, [0.4, 0]) + dark(E(148, 4, 6, 5)) + curve('M148 10L146 22M134 26Q140 30 146 22', ctx.thin);
  s += curve('M126 6L160 -2M126 14L160 18', ctx.hair);
  return s;
}
function gpFront(ctx) {
  let s = E(-50, 112, 26, 12) + E(50, 112, 26, 12);
  s += blob([[0, -90], [70, -74], [104, -10], [100, 70], [60, 110], [0, 118], [-60, 110], [-100, 70], [-104, -10], [-70, -74]]);
  s += P('M-60 -80Q-100 -110 -96 -64Q-90 -50 -70 -56Z') + P('M60 -80Q100 -110 96 -64Q90 -50 70 -56Z');
  s += blob([[10, -86], [60, -72], [72, -30], [50, -10], [20, -26]]);
  s += eye(-34, -30, 11, [0, 0.2]) + eye(34, -30, 11, [0, 0.2]);
  s += dark(E(0, -4, 8, 6)) + curve('M0 2L0 10M-10 14Q-5 18 0 10Q5 18 10 14', ctx.thin);
  s += curve('M-16 -2L-46 -8M-16 6L-46 8M16 -2L46 -8M16 6L46 8', ctx.hair);
  return s;
}

const guineaPig = {
  id: 'guinea-pig', name: 'Guinea pig', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'meadow', 'party'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return at(ctx, 0, 108, 1.2, gpSide);
    if (style === 1) {
      // front view, munching a lettuce leaf
      s += at(ctx, 0, 60, 1.18, gpFront);
      s += blob([[-50, 110], [-30, 70], [0, 56], [30, 70], [56, 110], [30, 150], [0, 160], [-30, 150]]);
      s += curve('M0 66L0 154M0 96L-26 80M0 96L26 80M0 124L-34 110M0 124L34 110', ctx.thin);
      s += E(-50, 126, 18, 14) + E(50, 126, 18, 14);
      return s;
    }
    // coming out of its log hideout
    s += P('M-196 200L-196 40Q-196 -60 -80 -60Q36 -60 36 40L36 200Z');
    for (const x of [-160, -120, -40, 0]) s += line(x, -40 + Math.abs(x + 80) * 0.0, x, 200, ctx.thin);
    s += P('M-150 200L-150 60Q-150 0 -80 0Q-10 0 -10 60L-10 200Z');
    s += at(ctx, 30, 120, 0.95, gpSide);
    s += littleFlower(170, 200, 60);
    return s;
  },
};

const pets = {
  id: 'pets', name: 'Pets', order: 12,
  scenes: ['plain', 'hearts', 'stars', 'room', 'garden', 'meadow', 'party', 'rain', 'night'],
  pairScenes: ['room', 'garden', 'meadow'],
  icon: 'dog', kind: 'ground',
  subjects: [dog, cat, goldfish, hamster, turtle, guineaPig],
};

// ---------- BIRDS ----------

/** A smooth tube (neck, worm) along the points, w0 wide at the start and w1 at the end. */
function tube(pts, w0, w1 = w0, a = '') {
  const L = [], Rr = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(n - 1, i + 1)];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2;
    L.push([pts[i][0] - (dy / d) * w, pts[i][1] + (dx / d) * w]);
    Rr.push([pts[i][0] + (dy / d) * w, pts[i][1] - (dx / d) * w]);
  }
  return P(smoothD(L, false).replace(/^M/, 'M') + 'L' + smoothD(Rr.reverse(), false).replace(/^M/, '') + 'Z', a);
}
function smoothD(pts, closed) {
  const n = pts.length, at2 = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at2(i - 1), p1 = at2(i), p2 = at2(i + 1), p3 = at2(i + 2);
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}
/** A leaf from 0,0 pointing along +x, len long, turned by deg. */
const leaf = (x, y, len, deg, ctx, w = 0.4) =>
  g(P(`M0 0Q${r1(len * 0.4)} ${r1(-len * w)} ${len} 0Q${r1(len * 0.4)} ${r1(len * w)} 0 0Z`) + line(4, 0, len * 0.8, 0, ctx.thin), `translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})`);
/** A tree stump whose top is at y = top, standing on y = 200. */
const stump = (w, top, ctx) =>
  P(`M${-w} ${top}L${-w - 8} 186Q${-w - 30} 200 ${-w - 40} 200L${w + 40} 200Q${w + 30} 200 ${w + 8} 186L${w} ${top}Z`) +
  E(0, top, w, w * 0.2) + E(0, top, w * 0.6, w * 0.11, ctx.thin) + E(0, top, w * 0.25, w * 0.05, ctx.thin) +
  curve(`M${-w * 0.5} ${top + 40}L${-w * 0.55} 180M${w * 0.3} ${top + 30}L${w * 0.35} 170M${-w * 0.05} ${top + 60}L${-w * 0.05} 190`, ctx.thin);

function owl(open = false) {
  return (ctx) => {
    let s = P('M-84 -120L-100 -178L-44 -140Z') + P('M84 -120L100 -178L44 -140Z');
    if (open) {
      const wing = 'M-80 -46Q-170 -110 -194 -20Q-198 10 -176 18Q-192 50 -164 60Q-172 92 -140 92Q-136 118 -108 106Q-94 86 -84 60Z';
      s += P(wing) + mirrorX(P(wing)) + curve('M-120 -40Q-150 0 -170 20M-110 -10Q-130 30 -146 56', ctx.thin) + mirrorX(curve('M-120 -40Q-150 0 -170 20M-110 -10Q-130 30 -146 56', ctx.thin));
    }
    for (const x of [-36, 36]) s += C(x - 15, 136, 10) + C(x, 140, 10) + C(x + 15, 136, 10);
    s += blob([[0, -152], [78, -134], [108, -50], [102, 50], [66, 118], [0, 134], [-66, 118], [-102, 50], [-108, -50], [-78, -134]]);
    s += blob([[0, -14], [54, 0], [70, 60], [44, 116], [0, 126], [-44, 116], [-70, 60], [-54, 0]]);
    for (const [x, y] of [[-30, 20], [0, 26], [30, 20], [-40, 56], [-12, 62], [16, 62], [42, 56], [-26, 94], [4, 100], [32, 94]]) s += curve(`M${x - 8} ${y}Q${x} ${y + 10} ${x + 8} ${y}`, ctx.thin);
    s += P('M0 -36Q-22 -128 -62 -122Q-104 -112 -98 -66Q-92 -22 -42 -18Q-14 -18 0 -36Q14 -18 42 -18Q92 -22 98 -66Q104 -112 62 -122Q22 -128 0 -36Z');
    s += eye(-46, -72, 26, [0.1, 0.15]) + eye(46, -72, 26, [-0.1, 0.15]);
    s += P('M-12 -42L12 -42L0 -12Z');
    if (!open) {
      const wing = 'M-98 -40Q-142 40 -92 116Q-72 60 -78 -10Z';
      s += P(wing) + mirrorX(P(wing));
    }
    return s;
  };
}

const owlS = {
  id: 'owl', name: 'Owl', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'forest', 'night', 'snow', 'hills'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return stump(120, 128, ctx) + at(ctx, 0, -12, 1.0, owl());
    if (style === 1) {
      // peeking out of a hole in a tree
      s += P('M-150 -110Q-140 60 -160 170Q-176 196 -196 200L196 200Q176 196 160 170Q140 60 150 -110Z');
      s += curve('M-120 -40Q-110 20 -124 90M126 -20Q116 40 130 120M-100 140Q-90 170 -110 196M90 150Q100 180 84 196', ctx.thin);
      s += fluff(0, -150, 196, 56, 14, 0.22);
      s += E(0, 20, 90, 116);
      s += at(ctx, 0, 34, 0.6, owl());
      s += leaf(-150, -96, 50, 160, ctx) + leaf(150, -96, 50, 20, ctx);
      return s;
    }
    return stump(110, 130, ctx) + at(ctx, 0, -10, 0.98, owl(true));
  },
};

function parrot(wingUp = false) {
  return (ctx) => {
    let s = P('M-30 50Q-90 120 -110 200L-56 204Q-36 140 8 80Z') + P('M-20 60Q-60 140 -70 206L-30 206Q-20 140 10 84Z');
    s += E(0, 104, 14, 8) + E(24, 104, 14, 8);
    if (wingUp) s += P('M-30 -20Q-150 -150 -120 -196Q-100 -170 -80 -176Q-80 -150 -50 -156Q-56 -120 -20 -110Q-20 -70 10 -60Z') + curve('M-110 -170Q-80 -110 -30 -60M-70 -150Q-50 -100 -20 -70', ctx.thin);
    s += blob([[-40, 70], [-56, 0], [-40, -60], [0, -110], [50, -128], [90, -110], [100, -70], [70, -20], [50, 40], [20, 90], [-20, 100]]);
    s += blob([[48, -112], [86, -108], [94, -80], [68, -68], [44, -88]]);
    s += P('M86 -110Q140 -116 132 -62Q126 -46 114 -60Q118 -86 88 -80Z') + P('M88 -80Q112 -78 110 -60Q96 -54 86 -64Z');
    s += eye(66, -92, 9, [0.3, 0]);
    if (!wingUp) s += blob([[-30, -40], [30, -60], [56, 0], [30, 70], [-20, 84], [-44, 30]]) + curve('M-30 30Q10 40 46 20M-30 56Q0 66 30 56', ctx.thin);
    else s += blob([[-30, -40], [30, -60], [56, 0], [30, 70], [-20, 84], [-44, 30]]) + curve('M-30 30Q10 40 46 20', ctx.thin);
    return s;
  };
}

const parrotS = {
  id: 'parrot', name: 'Parrot', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'forest', 'garden', 'room', 'party'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // on a perch stand
      s += R(-90, 184, 180, 16, 8) + R(-12, 40, 24, 146) + R(-140, 26, 280, 22, 11);
      s += at(ctx, 0, -72, 0.94, parrot());
      s += C(-120, 66, 16) + line(-120, 48, -120, 50, ctx.thin);
      return s;
    }
    if (style === 1) {
      // wings up on a leafy branch
      s += P('M-196 200Q-170 80 -184 -60L-136 -60Q-130 80 -120 200Z');
      s += P('M-150 70Q0 50 186 76L182 100Q0 80 -146 104Z');
      s += leaf(186, 86, 60, -30, ctx) + leaf(170, 92, 60, 30, ctx) + leaf(-150, -60, 70, -120, ctx) + leaf(-170, -60, 70, -70, ctx);
      s += C(150, 120, 16) + C(124, 126, 14);
      s += at(ctx, 30, -36, 0.92, parrot(true));
      return s;
    }
    // on a log, holding a nut in its foot
    s += P('M-170 136L170 136L170 200L-170 200Z') + E(170, 168, 18, 32) + E(170, 168, 8, 16, ctx.thin);
    s += curve('M-140 160L-60 160M-20 176L80 176M100 154L150 154', ctx.thin);
    s += at(ctx, -10, 32, 0.98, parrot());
    s += curve('M50 120Q90 110 96 80', ctx.thin) + C(104, 62, 18) + curve('M96 54Q104 62 112 54', ctx.thin) + E(94, 86, 14, 9);
    return s;
  },
};

function penguin(wave = false) {
  return (ctx) => {
    let s = E(-40, 186, 38, 14) + E(40, 186, 38, 14);
    s += P('M-96 -40Q-150 30 -146 84Q-126 70 -98 30Z');
    s += wave ? P('M96 -40Q160 -80 166 -130Q140 -120 98 -80Z') : P('M96 -40Q150 30 146 84Q126 70 98 30Z');
    s += blob([[0, -170], [70, -150], [100, -60], [110, 60], [80, 150], [0, 176], [-80, 150], [-110, 60], [-100, -60], [-70, -150]]);
    s += blob([[0, -104], [40, -136], [72, -110], [72, -60], [82, 40], [60, 140], [0, 160], [-60, 140], [-82, 40], [-72, -60], [-72, -110], [-40, -136]]);
    s += eye(-28, -100, 12, [0, 0.2]) + eye(28, -100, 12, [0, 0.2]);
    s += P('M-18 -80L18 -80L0 -54Z') + E(-50, -66, 12, 7, ctx.thin) + E(50, -66, 12, 7, ctx.thin);
    return s;
  };
}

const penguinS = {
  id: 'penguin', name: 'Penguin', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'snow', 'water', 'night'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += at(ctx, 0, 16, 1.04, penguin(true));
      s += P('M-80 -36Q0 -10 80 -36L84 -12Q0 14 -84 -12Z') + P('M40 -20L70 60L96 50L64 -24Z');
      return s;
    }
    if (style === 1) {
      // waddling along with a fish in its beak
      s += P('M-196 200Q-170 170 -110 176Q-60 166 -20 186L-10 200Z') + P('M90 200Q130 172 196 180L196 200Z');
      s += at(ctx, -20, 0, 1.0, (c) => {
        let t = E(10, 190, 32, 11) + E(56, 194, 32, 11);
        t += blob([[-90, 150], [-100, 40], [-60, -60], [0, -120], [50, -132], [86, -104], [84, -40], [100, 60], [80, 160], [0, 192], [-60, 186]]);
        t += blob([[32, -84], [70, -94], [84, -40], [94, 60], [74, 160], [24, 180], [12, 60], [20, -20]]);
        t += P('M-14 -30Q-70 50 -56 126Q-20 70 10 -10Z');
        t += eye(48, -98, 11, [0.4, 0]) + E(66, -72, 10, 6, c.thin);
        t += poly([[170, -92], [200, -110], [194, -92], [200, -74]]) + E(144, -92, 32, 16) + dotEye(128, -96, 4) + curve('M150 -104Q156 -92 150 -80', c.thin);
        t += P('M80 -110L132 -100L80 -84Z');
        return t;
      });
      return s;
    }
    // a parent with a fluffy chick
    s += at(ctx, -50, 16, 1.0, penguin());
    s += E(90, 192, 22, 9) + E(140, 192, 22, 9);
    s += fluff(116, 130, 64, 62, 14, 0.3);
    s += E(116, 128, 40, 34);
    s += eye(100, 120, 9, [0, 0.2]) + eye(132, 120, 9, [0, 0.2]) + P('M108 136L124 136L116 150Z');
    return s;
  },
};

function flamingo(mode) {
  // mode: 'one' (one leg), 'walk' (wings open), 'drink' (head down)
  return (ctx) => {
    let s = '';
    s += curve('M-10 50L-12 196') + P('M-36 200L-12 188L14 200Z') + C(-11, 120, 6);
    if (mode === 'one') s += curve('M14 50L40 116L-20 104') + C(40, 116, 6);
    else s += curve('M14 50L52 120L60 192') + C(52, 120, 6) + P('M36 200L60 188L86 200Z');
    if (mode === 'walk') s += P('M-50 -30Q-140 -140 -60 -170Q-70 -130 -30 -134Q-50 -100 0 -96Q-10 -66 20 -50Z') + curve('M-60 -130Q-40 -80 -10 -56', ctx.thin);
    let nearWing = mode === 'walk' ? P('M0 -40Q60 -190 140 -150Q104 -136 114 -108Q80 -112 80 -84Q46 -92 40 -50Z') + curve('M30 -60Q70 -120 110 -140', ctx.thin) : '';
    const neck = mode === 'drink' ? [[60, -20], [110, -40], [150, 0], [160, 70], [156, 120]] : [[64, -20], [98, -64], [86, -110], [56, -140], [66, -164]];
    s += poly([[-96, -20], [-170, -44], [-144, -10], [-168, 16], [-96, 14]]);
    s += blob([[-110, 0], [-70, -50], [10, -60], [70, -40], [94, 0], [64, 40], [-10, 56], [-80, 40]]);
    s += blob([[-90, 0], [-20, -34], [50, -20], [40, 26], [-50, 34]]) + curve('M-70 14Q-24 22 20 6M-50 26Q-10 32 26 22', ctx.thin);
    s += nearWing + tube(neck, 34, 28);
    if (mode === 'drink') {
      s += C(156, 130, 28) + P('M146 152Q140 190 166 198Q180 184 176 150Z') + curve('M144 176Q160 180 176 174', ctx.thin) + dotEye(166, 124, 5);
      s += E(160, 196, 40, 6, ctx.thin);
    } else {
      s += C(80, -166, 29) + P('M100 -176Q148 -180 152 -142Q152 -124 136 -128Q134 -152 104 -154Z') + curve('M150 -150L132 -140', ctx.thin) + dotEye(82, -172, 6);
    }
    return s;
  };
}

const flamingoS = {
  id: 'flamingo', name: 'Flamingo', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'pond', 'water', 'hills'],
  draw(style, rand, ctx) {
    if (style === 0) return at(ctx, 10, 0, 1.0, flamingo('one'));
    if (style === 1) return at(ctx, 0, 0, 1.0, flamingo('walk'));
    return at(ctx, -20, 0, 1.0, flamingo('drink'));
  },
};

function robin(singing = false) {
  return (ctx) => {
    let s = curve('M-10 70L-14 110M30 70L32 110') + birdFoot(-14, 114) + birdFoot(32, 114);
    s += P('M-86 0L-170 -50L-150 -14L-176 10L-86 36Z');
    s += blob([[-100, 20], [-80, -40], [-20, -80], [50, -90], [100, -60], [110, 0], [80, 60], [0, 80], [-70, 60]]);
    s += blob([[70, -54], [104, -46], [110, 0], [84, 56], [24, 72], [20, 20], [44, -20]]);
    s += blob([[-70, -20], [0, -40], [36, 0], [0, 40], [-60, 34]]) + curve('M-50 6Q-14 16 20 4M-44 22Q-14 30 10 22', ctx.thin);
    s += singing ? poly([[104, -66], [138, -76], [106, -56]]) + poly([[106, -50], [136, -40], [104, -42]]) : poly([[104, -64], [136, -54], [104, -44]]);
    s += eye(70, -58, 10, [0.4, 0]);
    return s;
  };
}
const note = (x, y, ctx) => g(E(0, 0, 13, 10) + line(12, -2, 12, -48) + P('M12 -48Q30 -40 28 -24Q24 -34 12 -34Z'), `translate(${x} ${y}) rotate(-20)`);

const robinS = {
  id: 'robin', name: 'Robin', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'garden', 'meadow', 'snow', 'forest'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += at(ctx, 20, 60, 1.21, robin());
      s += littleFlower(-170, 200, 70) + littleFlower(176, 200, 56);
      return s;
    }
    if (style === 1) {
      // singing on a fence post
      s += R(-56, 30, 112, 170) + curve('M-30 60L-30 180M20 50L20 120', ctx.thin) + P('M-70 30L0 -4L70 30Z');
      s += at(ctx, 0, -96, 0.92, robin(true));
      s += note(130, -110, ctx) + note(170, -170, ctx);
      return s;
    }
    // pulling a worm out of the ground
    s += P('M60 200Q80 170 140 170Q196 170 200 200Z');
    s += tube([[118, 30], [130, 70], [110, 110], [130, 150], [140, 186]], 16, 18);
    s += curve('M118 92l14 6M124 128l14 2', ctx.thin) + dotEye(120, 50, 3);
    s += at(ctx, -30, 70, 1.12, robin(), 'rotate(18)');
    return s;
  },
};

function eyeSpot(x, y, k, deg) {
  return g(E(0, 0, 18 * k, 27 * k) + E(0, 4 * k, 10 * k, 14 * k) + E(0, 6 * k, 4.5 * k, 6.5 * k), `translate(${r1(x)} ${r1(y)}) rotate(${r1(deg)})`);
}
function peacockHead(ctx) {
  let s = curve('M-6 -20L-16 -54M0 -22L0 -58M6 -20L16 -54', ctx.thin) + C(-16, -58, 6) + C(0, -62, 6) + C(16, -58, 6);
  s += C(0, 0, 24);
  return s;
}

const peacock = {
  id: 'peacock', name: 'Peacock', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'garden', 'meadow', 'hills', 'forest'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      // tail fanned out, front view
      const cx = 0, cy = 60;
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const a = Math.PI * (0.92 + (1.16 * i) / 20);
        pts.push([cx + Math.cos(a) * 196, cy + Math.sin(a) * 236]);
      }
      let d = `M0 120L${r1(pts[0][0])} ${r1(pts[0][1])}`;
      for (let i = 0; i < 20; i += 2) d += `Q${r1(pts[i + 1][0] * 1.06)} ${r1(cy + (pts[i + 1][1] - cy) * 1.06)} ${r1(pts[i + 2][0])} ${r1(pts[i + 2][1])}`;
      s += P(d + 'Z');
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.98 + (1.04 * i) / 8);
        s += line(cx, cy, cx + Math.cos(a) * 150, cy + Math.sin(a) * 180, ctx.hair);
        s += eyeSpot(cx + Math.cos(a) * 160, cy + Math.sin(a) * 192, 1.15, (a * 180) / Math.PI + 90);
      }
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (1.08 + (0.84 * i) / 5);
        s += eyeSpot(cx + Math.cos(a) * 96, cy + Math.sin(a) * 118, 0.9, (a * 180) / Math.PI + 90);
      }
      s += curve('M-14 120L-18 194M14 120L18 194') + birdFoot(-18, 198) + birdFoot(18, 198);
      s += P('M-26 -10Q-80 60 -40 120Q-20 80 -10 0Z') + mirrorX(P('M-26 -10Q-80 60 -40 120Q-20 80 -10 0Z'));
      s += blob([[0, -40], [26, -20], [36, 50], [24, 116], [0, 130], [-24, 116], [-36, 50], [-26, -20]]);
      s += at(ctx, 0, -60, 1.0, peacockHead);
      s += dotEye(-9, -64, 4) + dotEye(9, -64, 4) + P('M-6 -54L6 -54L0 -44Z');
      return s;
    }
    if (style === 1) {
      // walking, with its long tail trailing behind
      s += curve('M20 70L10 194M50 66L64 194') + birdFoot(10, 198) + birdFoot(64, 198);
      s += P('M0 10Q-120 40 -196 150L-190 196Q-100 196 -40 150Q20 110 40 50Z');
      for (const [x, y, a] of [[-150, 172, -40], [-96, 170, -60], [-110, 120, -50], [-50, 130, -60], [-60, 80, -60]]) s += eyeSpot(x, y, 0.9, a);
      s += tube([[50, -10], [70, -60], [70, -100], [84, -130]], 34, 26);
      s += blob([[-40, 40], [-30, -10], [30, -40], [80, -20], [90, 30], [60, 76], [-10, 76]]);
      s += blob([[-30, 10], [30, -10], [60, 30], [30, 60], [-20, 56]]) + curve('M-20 30Q10 40 40 30', ctx.thin);
      s += at(ctx, 88, -140, 1.0, (c) => peacockHead(c) + dotEye(10, -4, 5) + poly([[20, -8], [40, 0], [20, 8]]));
      return s;
    }
    // sitting on a garden wall, tail hanging down
    s += R(-200, 40, 400, 160) + R(-200, 22, 400, 26, 6);
    for (let y = 80; y < 200; y += 40) s += line(-200, y, 200, y, ctx.thin);
    for (let y = 48; y < 200; y += 40) for (let x = -170 + ((y / 40) % 2) * 50; x < 200; x += 100) s += line(x, y, x, y + 32, ctx.thin);
    s += P('M-30 10Q-120 30 -140 120L-150 200L-30 200L-40 120Q-30 60 10 30Z');
    for (const [x, y] of [[-110, 170], [-60, 170], [-90, 110], [-50, 80]]) s += eyeSpot(x, y, 0.9, 0);
    s += tube([[40, -10], [60, -60], [60, -110], [74, -140]], 34, 26);
    s += blob([[-40, 30], [-30, -20], [30, -50], [80, -30], [90, 20], [60, 40], [-20, 44]]);
    s += blob([[-30, 0], [30, -20], [60, 10], [30, 34], [-20, 30]]);
    s += at(ctx, 78, -150, 1.0, (c) => peacockHead(c) + dotEye(10, -4, 5) + poly([[20, -8], [40, 0], [20, 8]]));
    return s;
  },
};

function toucan(ctx) {
  let s = P('M-30 60L-56 176L-16 176L0 80Z');
  s += E(0, 104, 14, 8) + E(24, 104, 14, 8);
  s += blob([[-40, 60], [-50, 0], [-30, -60], [10, -100], [50, -100], [70, -60], [60, 10], [30, 80], [-10, 100]]);
  s += blob([[30, -92], [64, -82], [70, -30], [50, 10], [30, -20], [24, -60]]);
  s += P('M58 -98Q150 -112 196 -60Q140 -66 64 -56Z') + P('M64 -56Q140 -66 196 -60Q150 -36 64 -44Z');
  s += P('M150 -96Q180 -84 196 -60Q170 -62 150 -63Z');
  s += C(42, -76, 15) + eye(42, -76, 8, [0.4, 0]);
  s += blob([[-30, -40], [20, -50], [40, 10], [10, 70], [-30, 60]]) + curve('M-24 20Q0 26 26 14', ctx.thin);
  return s;
}

const toucanS = {
  id: 'toucan', name: 'Toucan', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'forest', 'garden', 'hills'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) {
      s += P('M-196 200Q-170 60 -184 -200L-124 -200Q-130 60 -110 200Z') + curve('M-160 -120Q-150 -60 -162 0M-140 40Q-130 100 -146 160', ctx.thin);
      s += P('M-130 50Q0 36 186 56L182 82Q0 66 -126 84Z');
      s += leaf(186, 68, 60, -30, ctx) + leaf(176, 74, 56, 30, ctx) + leaf(-130, -100, 70, -20, ctx) + leaf(-130, -60, 60, 20, ctx);
      s += at(ctx, -12, -58, 0.92, toucan);
      return s;
    }
    if (style === 1) {
      // on a stump, tossing a berry
      s += stump(80, 120, ctx);
      s += leaf(-90, 196, 110, -150, ctx, 0.3) + leaf(-80, 196, 100, -120, ctx, 0.3) + leaf(90, 196, 110, -30, ctx, 0.3) + leaf(80, 196, 100, -60, ctx, 0.3);
      s += at(ctx, -40, 4, 0.9, toucan, 'rotate(-14)');
      s += C(150, -150, 16) + curve('M150 -166Q154 -176 162 -178', ctx.thin);
      return s;
    }
    // close up with jungle leaves
    s += leaf(-196, 200, 200, -60, ctx, 0.28) + leaf(196, 200, 200, -120, ctx, 0.28) + leaf(-196, 120, 160, -20, ctx, 0.3);
    s += at(ctx, -60, 40, 1.4, toucan);
    return s;
  },
};

function swanBody(ctx, opt = {}) {
  let s = '';
  s += tube([[60, 110], [112, 56], [122, -6], [92, -70], [60, -110], [72, -150]], 42, 32);
  s += P('M-196 70Q-170 70 -140 84Q-60 66 40 78Q120 92 130 150Q120 196 20 198L-110 198Q-180 190 -196 70Z');
  if (opt.wings) {
    s += P('M-150 110Q-190 -20 -120 -70Q-60 -100 0 -40Q40 0 50 90Q30 70 20 90Q0 60 -20 84Q-40 56 -60 84Q-80 60 -100 90Q-120 70 -150 110Z');
    s += curve('M-130 40Q-90 -40 -20 -20M-110 60Q-70 0 0 20', ctx.thin);
  } else {
    s += blob([[-150, 120], [-110, 84], [-20, 80], [60, 110], [40, 160], [-90, 170]]) + curve('M-100 130Q-50 146 0 130M-80 150Q-40 160 10 150', ctx.thin);
  }
  s += C(86, -156, 30) + P('M108 -168L172 -148L110 -134Z') + P('M100 -174Q114 -170 114 -150Q110 -134 98 -138Q104 -154 100 -174Z');
  s += eye(80, -164, 8, [0.3, 0]);
  return s;
}
const ripples = (ctx) => P('M-200 176Q-150 160 -100 176T0 176T100 176T200 176L200 200L-200 200Z') + curve('M-170 194q25 -10 50 0M-20 196q25 -10 50 0M110 194q25 -10 50 0', ctx.thin);

const swan = {
  id: 'swan', name: 'Swan', styles: 3,
  scenes: ['plain', 'hearts', 'stars', 'pond', 'water'],
  draw(style, rand, ctx) {
    let s = '';
    if (style === 0) return at(ctx, 0, 0, 1.0, swanBody) + ripples(ctx);
    if (style === 1) return at(ctx, 0, 0, 1.0, (c) => swanBody(c, { wings: true })) + ripples(ctx);
    // with two fluffy cygnets riding on its back
    s += at(ctx, 0, 0, 1.0, swanBody);
    for (const [x, y] of [[-110, 70], [-30, 62]]) {
      s += fluff(x, y, 34, 30, 10, 0.3) + dotEye(x + 12, y - 8, 4) + poly([[x + 28, y - 4], [x + 46, y], [x + 28, y + 6]]);
    }
    s += ripples(ctx);
    return s;
  },
};

const birds = {
  id: 'birds', name: 'Birds', order: 16,
  scenes: ['plain', 'hearts', 'stars', 'meadow', 'forest', 'garden', 'hills', 'rain'],
  pairScenes: ['meadow', 'forest', 'garden', 'snow', 'pond', 'water'],
  icon: 'owl', kind: 'ground',
  subjects: [owlS, parrotS, penguinS, flamingoS, robinS, peacock, toucanS, swan],
};

export default [farm, pets, birds];
