// Things that go: vehicles for the Yaanstep Sprouts coloring pages. Every shape is drawn by this code.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, cloud, mirrorX, r1 } from '../lib.mjs';

// ---------- small helpers (local to this file) ----------

/** A wheel standing on the ground (bottom at y = 200 unless y is given): tyre, hub and cap. */
const wheel = (x, r, y = 200 - r) => C(x, y, r) + C(x, y, r * 0.55) + C(x, y, r * 0.2);
/** A wheel arch behind a wheel: a half disc on the body's bottom edge. */
const arch = (x, by, r) => P(`M${r1(x - r)} ${r1(by)}A${r1(r)} ${r1(r)} 0 0 1 ${r1(x + r)} ${r1(by)}Z`);
/** A thick rod with round ends, as a closed shape (frames, arms, ladders). */
function tube(x1, y1, x2, y2, w, a = '') {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, h = w / 2;
  const nx = (-(y2 - y1) / L) * h, ny = ((x2 - x1) / L) * h;
  return P(`M${r1(x1 + nx)} ${r1(y1 + ny)}L${r1(x2 + nx)} ${r1(y2 + ny)}A${r1(h)} ${r1(h)} 0 0 0 ${r1(x2 - nx)} ${r1(y2 - ny)}L${r1(x1 - nx)} ${r1(y1 - ny)}A${r1(h)} ${r1(h)} 0 0 0 ${r1(x1 + nx)} ${r1(y1 + ny)}Z`, a);
}
/** A rotated copy of a point. */
const rp = (x, y, deg, cx, cy) => {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
/** A wave in front of the bottom of a boat (a closed ribbon a child can color), with a small wave line below it. */
function waterBand(y0 = 150, ctx) {
  let d = `M-190 ${y0}`;
  for (let i = 0; i < 4; i++) d += 'q23.75 -14 47.5 0q23.75 14 47.5 0';
  d += `L202 ${y0 + 14}L190 ${y0 + 28}`;
  for (let i = 0; i < 4; i++) d += 'q-23.75 -12 -47.5 0q-23.75 12 -47.5 0';
  d += `L-202 ${y0 + 14}Z`;
  return P(d) + curve(`M-150 ${y0 + 46}q20 -10 40 0t40 0M40 ${y0 + 46}q20 -10 40 0t40 0t40 0`, ctx.thin);
}
/** Puffs of smoke or steam rising up and to the left from x,y. */
const puffs = (x, y, w) => cloud(x - w * 0.3, y - w * 0.35, w) + cloud(x - w * 0.95, y - w * 0.85, w * 0.75);
/** A friendly face: two eyes and a smile. */
const face = (x, y, r, gap) => eye(x - gap, y, r) + eye(x + gap, y, r) + smile(x, y + r * 1.9, gap * 1.3, 0.45);

/** A child's head with one of several hair styles. hat: 'helmet' | 'hard' | null. */
function kid(x, y, r, hair, ctx, hat = null) {
  let s = '';
  if (!hat) {
    if (hair === 1) {
      const pts = [];
      for (let i = 0; i < 14; i++) {
        const t = (i / 14) * Math.PI * 2, k = i % 2 ? 1.22 : 1.36;
        pts.push([x + Math.cos(t) * r * k, y - r * 0.12 + Math.sin(t) * r * k * 0.95]);
      }
      s += blob(pts);
    }
    if (hair === 2) s += C(x + r * 0.78, y - r * 0.85, r * 0.42);
    if (hair === 3) s += P(`M${r1(x - r * 1.08)} ${r1(y)}Q${r1(x - r * 1.15)} ${r1(y + r * 1.05)} ${r1(x - r * 0.7)} ${r1(y + r * 1.15)}L${r1(x + r * 0.7)} ${r1(y + r * 1.15)}Q${r1(x + r * 1.15)} ${r1(y + r * 1.05)} ${r1(x + r * 1.08)} ${r1(y)}Z`);
    if (hair === 4) s += C(x - r * 1.0, y - r * 0.55, r * 0.42) + C(x + r * 1.0, y - r * 0.55, r * 0.42);
  }
  s += C(x, y, r);
  s += dotEye(x - r * 0.36, y + r * 0.02, r * 0.12) + dotEye(x + r * 0.36, y + r * 0.02, r * 0.12) + smile(x, y + r * 0.36, r * 0.5, 0.45);
  if (hat === 'helmet') {
    s += P(`M${r1(x - r * 1.12)} ${r1(y - r * 0.15)}Q${r1(x - r * 1.1)} ${r1(y - r * 1.3)} ${r1(x)} ${r1(y - r * 1.3)}Q${r1(x + r * 1.15)} ${r1(y - r * 1.3)} ${r1(x + r * 1.2)} ${r1(y - r * 0.25)}Z`);
    s += curve(`M${r1(x - r * 0.4)} ${r1(y - r * 1.25)}L${r1(x - r * 0.3)} ${r1(y - r * 0.3)}M${r1(x + r * 0.3)} ${r1(y - r * 1.25)}L${r1(x + r * 0.35)} ${r1(y - r * 0.28)}`, ctx.thin);
  } else if (hat === 'hard') {
    s += P(`M${r1(x - r * 0.95)} ${r1(y - r * 0.35)}Q${r1(x - r * 0.95)} ${r1(y - r * 1.35)} ${r1(x)} ${r1(y - r * 1.35)}Q${r1(x + r * 0.95)} ${r1(y - r * 1.35)} ${r1(x + r * 0.95)} ${r1(y - r * 0.35)}Z`);
    s += R(x - r * 1.25, y - r * 0.5, r * 2.5, r * 0.3, r * 0.15);
  } else {
    // hair cap with a soft fringe
    s += P(`M${r1(x - r * 1.04)} ${r1(y + r * 0.05)}A${r1(r * 1.04)} ${r1(r * 1.04)} 0 0 1 ${r1(x + r * 1.04)} ${r1(y + r * 0.05)}Q${r1(x + r * 0.75)} ${r1(y - r * 0.5)} ${r1(x + r * 0.1)} ${r1(y - r * 0.45)}Q${r1(x - r * 0.5)} ${r1(y - r * 0.62)} ${r1(x - r * 1.04)} ${r1(y + r * 0.05)}Z`);
  }
  return s;
}

/** Shoulders for a person seen in a window, sitting on a window's bottom edge at y. */
const shoulders = (x, y, w) => P(`M${r1(x - w)} ${r1(y)}Q${r1(x - w)} ${r1(y - w * 0.75)} ${r1(x)} ${r1(y - w * 0.75)}Q${r1(x + w)} ${r1(y - w * 0.75)} ${r1(x + w)} ${r1(y)}Z`);

/** Train track along the ground: sleepers under one long rail (rail top at y 184). */
function track() {
  let s = '';
  for (let x = -190; x < 200; x += 48) s += R(x, 188, 30, 12, 3);
  return s + R(-202, 182, 404, 12, 5);
}

// ---------- subjects ----------

const car = {
  id: 'car', name: 'Car', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    if (style === 0) {
      // family car, side view
      s += P('M-132 60L-96 -46Q-88 -60 -70 -60L52 -60Q70 -60 80 -46L140 60Z');
      s += P('M-108 58L-80 -40L-12 -40L-12 58Z') + P('M4 58L4 -40L56 -40Q64 -40 70 -32L116 58Z');
      s += curve('M-70 -28L-82 10M30 -30L20 0', T);
      s += P('M-194 140L-194 84Q-192 56 -160 54L118 54Q170 58 190 92L196 140Q196 158 178 158L-178 158Q-194 158 -194 140Z');
      s += arch(-114, 158, 58) + arch(114, 158, 58);
      s += wheel(-114, 46) + wheel(114, 46);
      s += curve('M-4 58L-4 120M-112 70L-112 96', T);
      s += R(-60, 74, 30, 10, 5) + R(46, 74, 30, 10, 5);
      s += E(180, 94, 11, 15) + R(-198, 72, 14, 28, 5);
      s += R(160, 126, 42, 20, 10) + R(-202, 126, 42, 20, 10);
      s += P('M108 52L122 36L132 40L124 56Z');
    } else if (style === 1) {
      // race car, low and long, with a big wing at the back
      s += R(-166, 36, 16, 60, 4) + R(-200, 14, 80, 26, 9) + R(-204, 4, 14, 46, 6);
      s += P('M-60 70Q-60 30 -30 30L-10 30Q4 30 8 50L8 70Z');
      s += C(30, 40, 30) + P('M34 30L58 30Q62 44 56 54L34 54Z');
      s += R(150, 128, 52, 26, 8);
      s += P('M-176 150L-176 92Q-176 74 -156 72L-10 66Q20 64 40 70L150 102Q198 114 198 136L198 150Z');
      s += P('M-110 92L20 92Q44 94 44 114L44 136L-110 136Z');
      s += C(-36, 114, 22) + star(-36, 116, 16, 7);
      s += curve('M70 96L190 128', T);
      s += wheel(-122, 56) + wheel(124, 46);
    } else {
      // little round car seen from the front, headlights for eyes
      s += R(-158, 132, 62, 68, 20) + R(96, 132, 62, 68, 20);
      s += E(-186, 22, 20, 13) + E(186, 22, 20, 13);
      s += P('M-170 150Q-182 60 -142 30Q-128 -112 0 -116Q128 -112 142 30Q182 60 170 150Q170 166 150 166L-150 166Q-170 166 -170 150Z');
      s += P('M-102 22Q-96 -82 0 -84Q96 -82 102 22Z') + curve('M-60 -50Q-40 -68 -10 -70', T);
      s += curve('M-140 34Q0 50 140 34', T);
      s += C(-102, 76, 40) + eye(-102, 76, 28, [0.2, 0]) + C(102, 76, 40) + eye(102, 76, 28, [-0.2, 0]);
      s += P('M-44 82Q0 126 44 82Q0 96 -44 82Z');
      s += R(-164, 132, 328, 30, 15) + R(-36, 136, 72, 22, 5);
    }
    return s;
  },
};

const schoolBus = {
  id: 'school-bus', name: 'School bus', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    if (style === 0) {
      // long bus, side view, with a rounded nose
      s += P('M100 30L168 36Q194 42 194 74L194 150L100 150Z') + curve('M110 60L180 64M110 80L184 84', T);
      s += R(-196, -110, 306, 260, 22);
      s += R(-196, 4, 306, 22) + R(-196, 40, 306, 10);
      for (let i = 0; i < 4; i++) s += R(-180 + i * 56, -88, 44, 62, 8);
      s += R(48, -88, 50, 214, 6) + line(73, -88, 73, 126, T) + R(54, -78, 14, 70, 4) + R(78, -78, 14, 70, 4);
      s += R(-176, -126, 22, 16, 6) + R(-146, -126, 22, 16, 6) + R(60, -126, 22, 16, 6) + R(86, -126, 22, 16, 6);
      s += arch(-120, 150, 56) + arch(140, 150, 52) + wheel(-120, 46) + wheel(140, 44);
      s += R(176, 126, 26, 22, 8) + R(-200, 126, 22, 22, 8) + E(186, 60, 8, 12);
      s += line(150, 30, 150, 4) + R(140, -20, 20, 26, 6);
      s += poly([[-14, 52], [8, 52], [22, 66], [22, 88], [8, 102], [-14, 102], [-28, 88], [-28, 66]]);
    } else if (style === 1) {
      // front view with the driver
      s += R(-166, 126, 64, 74, 18) + R(102, 126, 64, 74, 18);
      s += line(-160, -70, -196, -60) + line(160, -70, 196, -60) + E(-196, -30, 16, 32) + E(196, -30, 16, 32);
      s += R(-160, -176, 320, 320, 30);
      s += R(-110, -164, 220, 34, 10) + E(-138, -150, 12, 10) + E(138, -150, 12, 10);
      s += R(-138, -118, 134, 112, 12) + R(4, -118, 134, 112, 12);
      s += shoulders(-70, -6, 46) + kid(-70, -56, 30, 3, ctx);
      s += curve('M60 -100L100 -60M80 -104L120 -64', T);
      s += R(-160, 10, 320, 16) + R(-60, 36, 120, 66, 10) + curve('M-50 54L50 54M-50 70L50 70M-50 86L50 86', T);
      s += C(-112, 64, 26) + C(112, 64, 26) + R(-136, 104, 34, 18, 6) + R(102, 104, 34, 18, 6);
      s += R(-172, 122, 344, 28, 14);
    } else {
      // short bus with children waving from the windows
      s += R(-188, -120, 376, 260, 44);
      for (let i = 0; i < 4; i++) {
        const x = -150 + i * 72;
        s += R(x - 30, -94, 60, 82, 10);
        s += shoulders(x, -12, 28) + kid(x, -50, 21, [0, 1, 2, 4][i], ctx);
      }
      s += C(-150 + 72 * 2 + 30, -88, 9) + curve('M-14 -66L22 -84', ''); // a waving hand
      s += P('M150 -94L176 -94Q182 -94 182 -84L182 -12L150 -12Z');
      s += R(-188, 10, 376, 20) + R(-188, 46, 376, 8);
      s += R(118, 64, 56, 62, 6) + line(146, 64, 146, 126, T);
      s += arch(-112, 140, 52) + arch(100, 140, 52) + wheel(-112, 44) + wheel(100, 44);
      s += R(170, 116, 28, 22, 8) + R(-198, 116, 28, 22, 8) + E(182, 80, 7, 11);
    }
    return s;
  },
};

const dumpTruck = {
  id: 'dump-truck', name: 'Dump truck', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    const cab = () => P('M64 112L64 -44Q64 -60 80 -60L132 -60Q142 -60 148 -50L176 -4L192 4Q196 8 196 20L196 112Z') +
      P('M80 -44L130 -44L158 -2L80 -2Z') + curve('M70 10L70 100', T) + R(84, 14, 24, 8, 4) +
      E(188, 40, 7, 12) + curve('M176 60L196 60M176 74L196 74M176 88L196 88', T) + R(176, 104, 26, 22, 8);
    if (style === 0) {
      // tipping its load out of the back
      s += R(42, -110, 14, 80, 6);
      const hx = -136, hy = 104, a = -24;
      const bed = [[-138, 104], [-148, -24], [56, -24], [56, 104]].map(([x, y]) => rp(x, y, a, hx, hy));
      // falling stones and a pile on the ground
      s += blob([[-200, 200], [-198, 160], [-176, 148], [-150, 164], [-138, 200]]);
      s += C(-178, 120, 14) + C(-188, 86, 11) + blob([[-170, 60], [-156, 52], [-150, 70], [-164, 74]]);
      s += tube(-40, 110, ...rp(-30, 104, a, hx, hy), 18);
      s += poly(bed) + g(curve('M-96 -20L-94 100M-50 -20L-50 100M-4 -20L-4 100M30 -20L30 100', T) + R(-152, -34, 214, 14, 6), `rotate(${a} ${hx} ${hy})`);
      s += R(-146, 100, 342, 26, 6) + cab();
      s += wheel(-104, 44) + wheel(-14, 44) + wheel(140, 44);
    } else if (style === 1) {
      // full of dirt and stones, driving along
      s += R(40, -96, 14, 60, 6);
      s += P('M-186 -26Q-150 -96 -90 -88Q-50 -130 0 -100Q30 -110 50 -26Z');
      s += blob([[-120, -88], [-100, -100], [-84, -86], [-100, -74]]) + blob([[-30, -108], [-8, -116], [6, -100], [-14, -92]]) + C(20, -74, 12) + C(-150, -52, 11);
      s += P('M-190 100L-196 -30L56 -30L56 100Z') + R(-200, -40, 260, 16, 6) + P('M44 -40L62 -70L84 -66L62 -30Z');
      s += curve('M-140 -24L-138 94M-80 -24L-80 94M-20 -24L-20 94', T);
      s += R(-196, 98, 392, 24, 6) + cab();
      s += wheel(-136, 44) + wheel(-46, 44) + wheel(140, 44);
    } else {
      // seen from the front, with a big smile
      s += R(-180, 96, 74, 104, 26) + R(106, 96, 74, 104, 26) + curve('M-176 130L-110 130M-176 160L-110 160M110 130L176 130M110 160L176 160', T);
      s += P('M-180 -100Q-120 -186 -40 -160Q20 -200 80 -160Q150 -180 180 -100Z');
      s += C(-60, -158, 16) + C(40, -176, 14) + C(120, -150, 15);
      s += R(-190, -110, 380, 60, 12);
      s += R(-150, -72, 300, 210, 28);
      s += R(-124, -52, 248, 92, 16) + curve('M-90 -36L-60 -6M60 -40L92 -8', T);
      s += C(-96, 82, 34) + eye(-96, 82, 24, [0.15, 0]) + C(96, 82, 34) + eye(96, 82, 24, [-0.15, 0]);
      s += P('M-44 74Q0 132 44 74Z');
      s += R(-168, 124, 336, 30, 15) + R(-160, -98, 30, 16, 6) + R(130, -98, 30, 16, 6);
    }
    return s;
  },
};

const fireEngine = {
  id: 'fire-engine', name: 'Fire engine', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    const ladder = (x, y, len, w, n) => {
      let l = R(x, y, len, w, 4);
      for (let i = 1; i < n; i++) l += line(x + (len * i) / n, y, x + (len * i) / n, y + w, T);
      return l;
    };
    if (style === 0) {
      // side view with the ladder on top
      s += R(-150, -66, 12, 14) + R(40, -66, 12, 14);
      s += R(-196, -56, 288, 178, 12);
      s += P('M84 122L84 -86Q84 -100 98 -100L148 -100Q160 -100 168 -86L190 -14Q196 -4 196 12L196 122Z');
      s += P('M100 -84L148 -84L172 -18L100 -18Z');
      s += R(102, -122, 52, 22, 9);
      s += ladder(-194, -92, 320, 28, 10);
      s += R(-182, -36, 82, 96, 8) + R(-92, -36, 82, 96, 8) + R(-2, -36, 80, 96, 8);
      s += C(-141, 12, 30) + C(-141, 12, 12) + R(-62, 18, 22, 8, 4) + R(28, 18, 22, 8, 4);
      s += R(-196, 72, 288, 16) + R(84, 72, 112, 16);
      s += R(-200, 118, 400, 24, 6);
      s += E(188, 40, 8, 12) + R(176, 104, 26, 22, 8) + curve('M96 10L96 100', T) + R(104, 20, 22, 8, 4);
      s += wheel(-120, 44) + wheel(136, 44);
    } else if (style === 1) {
      // ladder raised high, with a firefighter waving from the basket
      const bx = -40, by = 38, ang = -120, len = 196;
      s += g(ladder(0, -16, len, 32, 7), `translate(${bx} ${by}) rotate(${ang})`);
      const [tx, ty] = [bx + Math.cos((ang * Math.PI) / 180) * len, by + Math.sin((ang * Math.PI) / 180) * len];
      s += kid(tx - 4, ty - 36, 22, 0, ctx, 'helmet') + line(tx + 14, ty - 18, tx + 30, ty - 50) + C(tx + 32, ty - 56, 9);
      s += R(tx - 44, ty - 18, 88, 42, 8) + curve(`M${r1(tx - 44)} ${r1(ty + 2)}L${r1(tx + 44)} ${r1(ty + 2)}`, T);
      s += R(-196, 40, 270, 82, 12);
      s += R(-182, 54, 80, 52, 8) + R(-90, 54, 80, 52, 8) + R(2, 54, 60, 52, 8);
      s += E(-40, 40, 46, 16) + C(-40, 38, 13);
      s += P('M70 122L70 -20Q70 -34 84 -34L140 -34Q152 -34 160 -20L190 30Q196 40 196 54L196 122Z');
      s += P('M86 -18L140 -18L168 30L86 30Z') + R(92, -54, 52, 20, 8);
      s += R(-200, 118, 400, 24, 6) + E(188, 72, 8, 12) + R(176, 110, 26, 20, 8) + curve('M80 46L80 110', T);
      s += wheel(-120, 42) + wheel(130, 42);
    } else {
      // seen from the front with a friendly face
      s += R(-170, 110, 62, 90, 20) + R(108, 110, 62, 90, 20);
      s += R(-150, -178, 300, 36, 6);
      for (let i = 1; i < 6; i++) s += line(-150 + i * 50, -178, -150 + i * 50, -142, T);
      s += line(-176, -40, -196, -40) + line(176, -40, 196, -40) + R(-200, -76, 22, 52, 8) + R(178, -76, 22, 52, 8);
      s += R(-166, -136, 332, 286, 26);
      s += E(-110, -146, 30, 16) + E(110, -146, 30, 16) + R(-40, -158, 80, 22, 10);
      s += R(-136, -112, 272, 100, 14) + curve('M-100 -96L-70 -40M60 -100L92 -50', T);
      s += R(-166, 2, 332, 18);
      s += C(-104, 70, 36) + eye(-104, 70, 25, [0.15, 0]) + C(104, 70, 36) + eye(104, 70, 25, [-0.15, 0]);
      s += P('M-46 56Q0 120 46 56Z');
      s += P('M-14 28Q-14 12 0 12Q14 12 14 28L18 40L-18 40Z') + C(0, 44, 5);
      s += R(-178, 120, 356, 30, 15);
    }
    return s;
  },
};

const train = {
  id: 'train', name: 'Train', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = track();
    if (style === 0) {
      // steam engine
      s += cloud(40, -150, 120) + cloud(-70, -174, 90);
      s += P('M108 -20L96 -86L156 -86L144 -20Z') + R(90, -102, 72, 18, 7);
      s += P('M14 -20Q14 -60 44 -60Q74 -60 74 -20Z');
      s += P('M-70 -24L150 -24Q176 -24 176 38Q176 100 150 100L-70 100Z');
      s += curve('M-10 -22L-10 98M60 -22L60 98M120 -22L120 98', T);
      s += R(-182, -110, 136, 22, 8) + R(-172, -90, 116, 196, 8) + R(-150, -66, 70, 58, 10);
      s += R(-188, 98, 380, 20, 6);
      s += R(158, -6, 24, 26, 6);
      s += poly([[150, 116], [178, 116], [204, 178], [150, 178]]) + curve('M164 118L164 176M178 120L182 176M190 146L194 176', T);
      s += wheel(-120, 46, 136) + wheel(-14, 46, 136) + wheel(110, 30, 152);
      s += tube(-120, 136, -14, 136, 14);
    } else if (style === 1) {
      // little engine pulling two wagons
      s += cloud(116, -122, 90) + cloud(30, -150, 70);
      s += R(150, -50, 24, 46, 4) + R(142, -60, 40, 14, 6);
      s += R(76, -50, 66, 172, 8) + R(66, -66, 86, 20, 8) + R(88, -30, 42, 40, 8);
      s += P('M142 4L178 4Q196 4 196 30L196 122L142 122Z') + C(184, 40, 9);
      s += poly([[186, 122], [204, 170], [170, 170]]);
      s += R(-62, 56, 6, 6) + R(64, 74, 14, 10, 4) + R(-80, 74, 22, 10, 4);
      // toy wagon with blocks and a ball
      s += R(-58, 0, 42, 42, 4) + R(-12, 10, 34, 32, 4) + C(42, 14, 30) + curve('M14 2Q42 30 70 4', T);
      s += R(-62, 40, 126, 82, 10);
      // passenger carriage with friends in the windows
      s += R(-196, -36, 134, 22, 10) + R(-190, -16, 122, 138, 10);
      s += R(-178, 4, 46, 50, 8) + R(-124, 4, 46, 50, 8);
      s += kid(-155, 34, 15, 2, ctx) + kid(-101, 34, 15, 4, ctx);
      s += R(-190, 70, 122, 14);
      s += wheel(-164, 20, 164) + wheel(-96, 20, 164) + wheel(-34, 20, 164) + wheel(38, 20, 164) + wheel(100, 26, 158) + wheel(166, 20, 164);
    } else {
      // modern fast train
      s += curve('M-80 -44L-50 -80L-20 -44M-62 -80L-36 -80', '');
      s += P('M-196 -44L30 -44Q140 -44 196 110L196 140L-196 140Z');
      for (let i = 0; i < 5; i++) s += R(-180 + i * 46, -24, 34, 40, 10);
      s += P('M70 -36Q126 -34 158 20L84 20Q70 20 70 6Z');
      s += P('M-196 50L176 50Q184 66 190 90L-196 90Z');
      s += R(42, -26, 22, 70, 6);
      s += E(174, 108, 10, 8);
      s += R(-174, 136, 96, 22, 8) + R(74, 136, 96, 22, 8);
      s += wheel(-152, 18, 166) + wheel(-100, 18, 166) + wheel(96, 18, 166) + wheel(148, 18, 166);
    }
    return s;
  },
};

const airplane = {
  id: 'airplane', name: 'Airplane', styles: 3, kind: 'float',
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    if (style === 0) {
      // passenger plane, side view
      s += P('M-170 -18L-196 -120L-160 -120L-100 -26Z') + star(-170, -84, 16, 7);
      s += P('M-10 -26L-58 -86L-34 -86L44 -28Z');
      s += P('M-192 6Q-184 -28 -140 -32L130 -32Q182 -32 198 4Q190 34 136 34L-150 34Q-186 30 -192 6Z');
      s += P('M-176 10L-200 34L-140 30Z');
      for (let i = 0; i < 8; i++) s += C(-120 + i * 30, -10, 9);
      s += R(122, -22, 20, 40, 7) + P('M152 -24Q172 -22 184 -10L154 -8Z');
      s += curve('M-176 18L120 18', T);
      s += P('M-20 10L-92 104L-58 104L64 16Z');
      s += P('M-70 44L10 44Q24 60 10 76L-70 76Q-80 60 -70 44Z') + curve('M-58 48L-58 72', T);
    } else if (style === 1) {
      // little biplane with a smiling pilot
      s += R(-60, -128, 186, 28, 14);
      s += E(152, -46, 9, 40) + E(152, 46, 9, 40);
      s += P('M-170 -10L-192 -82L-150 -76L-118 -20Z');
      s += curve('M-60 -50Q-110 -70 -140 -50Q-120 -40 -100 -46', '') + P('M-40 -50Q-90 -70 -112 -46Q-80 -40 -40 -40Z');
      s += kid(2, -66, 26, 0, ctx, 'helmet') + R(-28, -78, 24, 14, 6) + R(8, -78, 24, 14, 6);
      s += P('M-176 -6Q-110 -42 60 -42Q124 -42 136 0Q124 42 60 42Q-110 32 -176 -6Z');
      s += E(-160, 6, 34, 10) + heart(-56, 6, 40);
      s += line(-30, -100, -24, 22) + line(96, -100, 96, 22);
      s += line(30, 40, 22, 96) + line(60, 40, 64, 96) + C(22, 104, 22) + C(22, 104, 8) + C(66, 104, 22) + C(66, 104, 8);
      s += R(-64, 20, 196, 28, 14);
      s += C(142, 0, 18);
    } else {
      // seen from above, flying up and to the right
      let p = P('M0 -196Q26 -176 26 -112L26 120L10 176L-10 176L-26 120L-26 -112Q-26 -176 0 -196Z');
      let half = P('M-24 -30L-198 44L-198 74L-24 30Z') + R(-120, -24, 26, 56, 12) + R(-64, -44, 24, 50, 11) + P('M-10 124L-82 164L-82 182L-10 166Z');
      p = half + mirrorX(half) + p;
      p += P('M-16 -150Q0 -166 16 -150L16 -134Q0 -142 -16 -134Z') + curve('M0 -120L0 150', T) + star(0, 60, 18, 8);
      s += g(p, 'rotate(38)');
    }
    return s;
  },
};

const helicopter = {
  id: 'helicopter', name: 'Helicopter', styles: 3, kind: 'float',
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    if (style === 0) {
      // small bubble helicopter
      s += R(-8, -130, 16, 50);
      s += P('M-50 -36L-170 -50L-170 -26L-50 0Z');
      s += C(-172, -40, 30) + E(-172, -40, 7, 30) + C(-172, -40, 7);
      s += line(-10, 60, -26, 104) + line(80, 60, 92, 104) + P('M-70 98L150 98Q176 98 180 80L184 80Q184 110 150 110L-70 110Z');
      s += P('M-60 -20Q-50 -96 40 -100Q140 -100 138 -10Q136 70 40 72Q-56 72 -60 -20Z');
      s += P('M30 -90Q126 -90 128 -4L30 -4Z');
      s += shoulders(80, -4, 34) + kid(80, -38, 26, 2, ctx);
      s += P('M30 -90Q126 -90 128 -4L30 -4Z', 'fill="none"');
      s += curve('M0 -88L0 66', T) + R(10, 0, 20, 8, 4);
      s += R(-196, -146, 392, 16, 8) + C(0, -138, 14);
    } else if (style === 1) {
      // big rescue helicopter with wheels
      s += R(-10, -126, 20, 46);
      s += P('M-70 -30L-176 -40L-176 -10L-70 20Z') + P('M-176 -40L-196 -100L-170 -100L-150 -38Z');
      s += C(-180, -64, 22) + C(-180, -64, 6);
      s += line(-20, 60, -30, 92) + line(110, 60, 116, 92) + wheel(-30, 18, 100) + wheel(116, 18, 100);
      s += P('M-80 -30Q-70 -86 0 -88L110 -88Q176 -84 192 -10Q198 50 150 62L-50 62Q-90 50 -80 -30Z');
      s += P('M120 -76Q170 -70 184 -16L120 -16Z');
      s += R(-56, -64, 56, 106, 10) + line(-28, -64, -28, 42, T);
      s += R(20, -64, 40, 40, 10) + R(70, -64, 40, 40, 10);
      s += R(-80, 10, 270, 22) + C(70, 22, 28) + heart(70, 26, 34);
      s += R(-196, -142, 392, 16, 8) + C(0, -134, 14);
    } else {
      // round little helicopter seen from the front, with a face
      s += R(-10, -150, 20, 50);
      s += line(-60, 100, -110, 160) + line(60, 100, 110, 160) + R(-150, 156, 90, 20, 10) + R(60, 156, 90, 20, 10);
      s += E(-130, 20, 30, 18) + E(130, 20, 30, 18);
      s += C(0, 10, 120);
      s += P('M-96 -60Q-60 -104 0 -106Q60 -104 96 -60Z') + curve('M-50 -84Q-30 -96 -10 -98', T);
      s += face(0, 10, 22, 44);
      s += C(-74, 50, 12) + C(74, 50, 12);
      s += E(0, -158, 196, 12) + C(0, -158, 16);
    }
    return s;
  },
};

const tugboat = {
  id: 'tugboat', name: 'Tugboat', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    const tyre = (x, y, r) => C(x, y, r) + C(x, y, r * 0.45);
    if (style === 0) {
      s += puffs(-84, -116, 80);
      s += P('M-110 -10L-102 -100L-58 -100L-58 -10Z') + R(-108, -76, 50, 14);
      s += R(-130, -20, 92, 70, 8) + C(-108, 14, 12) + C(-68, 14, 12);
      s += line(30, -90, 30, -124) + C(30, -130, 8);
      s += R(-38, -76, 116, 126, 10) + R(-48, -92, 136, 20, 8);
      s += R(-24, -56, 38, 44, 6) + R(26, -56, 38, 44, 6);
      s += C(20, 20, 18) + C(20, 20, 9);
      s += P('M-188 50L176 40Q200 40 196 70Q186 136 140 160L-150 160Q-182 140 -188 50Z');
      s += P('M-186 74L192 70L188 92L-180 96Z');
      for (const x of [-130, -70, -10, 50]) s += tyre(x, 122, 16);
      s += tyre(170, 112, 18);
      s += waterBand(150, ctx);
    } else if (style === 1) {
      // towing a barge with crates
      s += puffs(36, -104, 56);
      s += R(14, -84, 28, 90, 4) + R(10, -92, 36, 14, 6);
      s += R(44, -10, 120, 52, 8) + C(70, 16, 10) + C(104, 16, 10);
      s += R(64, -84, 84, 78, 8) + R(56, -98, 100, 18, 8) + R(76, -70, 26, 32, 6) + R(110, -70, 26, 32, 6);
      s += P('M0 40L176 34Q200 34 196 60Q186 118 150 150L24 150Q4 120 0 40Z') + curve('M6 64L194 60', T);
      for (const x of [40, 90, 140]) s += C(x, 100, 15) + C(x, 100, 6);
      s += curve('M4 56Q-18 84 -40 60', '');
      s += R(-184, -10, 54, 50, 4) + R(-124, -10, 54, 50, 4) + R(-154, -60, 54, 50, 4) + R(-64, 0, 40, 40, 4);
      s += curve('M-184 15L-130 15M-157 -10L-157 40M-124 15L-70 15M-97 -10L-97 40M-154 -35L-100 -35M-127 -60L-127 -10', T);
      s += P('M-196 40L-30 40L-44 140L-182 140Z');
      s += waterBand(140, ctx);
    } else {
      // chubby tug seen from the front, with a face
      s += puffs(14, -152, 80);
      s += R(-24, -170, 48, 90, 6) + R(-30, -176, 60, 16, 6);
      s += R(-96, -110, 192, 136, 16) + R(-112, -126, 224, 24, 12);
      s += R(-80, -90, 46, 52, 8) + R(-23, -90, 46, 52, 8) + R(34, -90, 46, 52, 8);
      s += C(0, -2, 18) + C(0, -2, 8);
      s += P('M-160 30L160 30Q160 150 0 172Q-160 150 -160 30Z');
      s += R(-172, 14, 344, 34, 17);
      s += face(0, 80, 22, 56);
      s += waterBand(150, ctx);
    }
    return s;
  },
};

const sailboat = {
  id: 'sailboat', name: 'Sailboat', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    if (style === 0) {
      s += R(-6, -186, 12, 262) + P('M6 -186L54 -172L6 -158Z');
      s += P('M-12 -170L-12 52L-160 52Q-100 -40 -12 -170Z') + curve('M-50 -80Q-90 -20 -110 30', T);
      s += P('M14 -150L14 52L150 52Q100 -30 14 -150Z');
      s += R(-166, 50, 172, 10, 5);
      s += P('M-176 68L176 68Q160 136 110 152L-120 152Q-164 134 -176 68Z');
      s += P('M-170 86L170 86L164 102L-164 102Z');
      s += C(-60, 124, 10) + C(0, 124, 10) + C(60, 124, 10);
      s += waterBand(150, ctx);
    } else if (style === 1) {
      // little dinghy with a striped sail and a child at the back
      s += R(24, -186, 10, 270);
      const top = [28, -180], bl = [-150, 70], br = [28, 70];
      const at = (y) => top[0] + ((bl[0] - top[0]) * (y - top[1])) / (bl[1] - top[1]);
      const ys = [-180, -110, -40, 20, 70];
      for (let i = 0; i < 4; i++) {
        const y0 = ys[i], y1 = ys[i + 1];
        s += i === 0 ? poly([[top[0], y0], [at(y1), y1], [br[0], y1]]) : poly([[at(y0), y0], [br[0], y0], [br[0], y1], [at(y1), y1]]);
      }
      s += P('M34 -176L80 -164L34 -150Z');
      s += kid(110, 40, 30, 1, ctx) + P('M80 112Q80 70 110 70Q140 70 140 112Z');
      s += P('M-150 84L176 84Q164 140 120 154L-110 154Q-144 140 -150 84Z');
      s += curve('M-140 104L170 104', T);
      s += waterBand(150, ctx);
    } else {
      // tall ship with square sails
      const sail = (x, y, w, h) => P(`M${x - w * 0.44} ${y}Q${x} ${y + 16} ${x + w * 0.44} ${y}L${x + w / 2} ${y + h}Q${x} ${y + h + 20} ${x - w / 2} ${y + h}Z`) + R(x - w / 2 - 10, y - 8, w + 20, 10, 5);
      s += R(-76, -190, 10, 240) + R(54, -176, 10, 226);
      s += tube(140, 34, 198, -4, 10) + poly([[66, -150], [194, -6], [76, 20]]);
      s += P('M-66 -196L-30 -186L-66 -176Z') + P('M64 -182L100 -172L64 -162Z');
      s += sail(-71, -160, 110, 70) + sail(-71, -70, 130, 80);
      s += sail(59, -146, 100, 64) + sail(59, -64, 120, 74);
      s += R(-90, -186, 38, 14, 4);
      s += P('M-196 26L-120 26L-120 36L150 36L196 20Q186 120 136 154L-150 154Q-190 120 -196 26Z');
      s += R(-196, 10, 76, 20, 4);
      s += curve('M-190 60L188 56', T);
      for (let i = 0; i < 6; i++) s += C(-130 + i * 52, 92, 11);
      s += waterBand(150, ctx);
    }
    return s;
  },
};

const bicycle = {
  id: 'bicycle', name: 'Bicycle', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin, H = ctx.hair;
    const bigWheel = (x, y, r) => {
      let w = C(x, y, r) + C(x, y, r - 12);
      for (let i = 0; i < 8; i++) {
        const t = (i / 8) * Math.PI;
        w += line(x - Math.cos(t) * (r - 12), y - Math.sin(t) * (r - 12), x + Math.cos(t) * (r - 12), y + Math.sin(t) * (r - 12), H);
      }
      return w + C(x, y, 10);
    };
    let s = '';
    if (style === 0) {
      // town bike with a basket of flowers
      const rw = 74, ry = 200 - rw;
      s += bigWheel(-112, ry, rw) + bigWheel(112, ry, rw);
      s += curve(`M-112 ${ry - 6}L0 ${ry - 20}M-112 ${ry + 6}L0 ${ry + 18}`, T);
      s += tube(-112, ry, -36, 0, 14) + tube(0, ry, -36, 0, 14) + tube(-112, ry, 0, ry, 12);
      s += tube(0, ry, 86, 10, 14) + tube(-30, 30, 82, 30, 12);
      s += tube(112, ry, 82, -10, 14);
      s += tube(82, -10, 72, -50, 10) + P('M50 -60Q72 -64 96 -52L92 -42Q72 -50 50 -50Z') + C(60, -66, 8);
      s += tube(-36, 0, -40, -24, 10) + P('M-82 -40Q-40 -50 -10 -36Q-20 -22 -50 -22Q-80 -22 -82 -40Z');
      s += C(0, ry, 24) + tube(0, ry, 22, ry + 32, 9) + R(8, ry + 30, 32, 10, 5);
      // flowers in the basket
      s += tube(80, -24, 120, -24, 8) + tube(104, 50, 130, 0, 8);
      for (const [x, h] of [[116, -84], [140, -100], [162, -80]]) s += line(x, h, x + 2, -60, T) + C(x, h, 13) + C(x, h, 5);
      s += P('M98 -64L184 -64L174 0L108 0Z') + curve('M103 -40L180 -40M106 -18L177 -18', T);
    } else if (style === 1) {
      // a child riding, with a helmet
      const rw = 64, ry = 200 - rw;
      s += tube(-26, 2, 10, 50, 28) + tube(10, 50, -18, 112, 24) + E(-14, 120, 22, 11);
      s += bigWheel(-116, ry, rw) + bigWheel(116, ry, rw);
      s += tube(-116, ry, -40, 20, 13) + tube(0, ry + 4, -40, 20, 13) + tube(-116, ry, 0, ry + 4, 11);
      s += tube(0, ry + 4, 80, 20, 13) + tube(-34, 40, 76, 40, 11) + tube(116, ry, 78, -6, 13);
      s += tube(78, -6, 70, -34, 10) + P('M54 -42Q72 -46 92 -36L88 -26Q72 -34 54 -32Z');
      s += C(0, ry + 4, 20);
      s += P('M-80 -8Q-40 -18 -12 -6Q-20 6 -48 6Q-78 6 -80 -8Z');
      s += tube(-30, 0, 36, 44, 30) + tube(36, 44, 22, 150, 26) + E(30, 158, 24, 12);
      s += P('M-58 10L-54 -62Q-50 -100 -14 -102Q18 -102 18 -76L12 10Z') + curve('M-56 -14L14 -14', T);
      s += tube(0, -82, 34, -54, 28) + tube(34, -54, 62, -38, 18) + C(66, -36, 12);
      s += kid(20, -138, 40, 3, ctx, 'helmet') + P('M-24 -122Q-50 -118 -58 -96Q-36 -100 -20 -110Z');
    } else {
      // small bike with training wheels, a flag and streamers
      const rw = 60, ry = 200 - rw;
      s += line(-110, ry, -110, -150) + P('M-108 -152L-50 -134L-108 -116Z');
      s += tube(-110, ry, -150, 170, 8) + C(-150, 180, 20) + C(-150, 180, 7);
      s += bigWheel(-100, ry, rw) + bigWheel(100, ry, rw);
      s += tube(-100, ry, -30, 20, 14) + tube(0, ry, -30, 20, 14) + tube(-100, ry, 0, ry, 12) + tube(-24, 40, 72, 30, 14) + tube(0, ry, 72, 30, 14);
      s += tube(100, ry, 66, -20, 14) + tube(66, -20, 56, -60, 10) + P('M30 -70Q56 -76 84 -62L80 -52Q56 -60 30 -60Z');
      s += P('M84 -60L120 -40L108 -28Z') + P('M84 -60L112 -22L98 -14Z');
      s += C(40, -78, 11) + line(40, -67, 46, -60);
      s += tube(-30, 20, -34, -6, 10) + P('M-80 -16Q-34 -28 -4 -12Q-14 4 -44 4Q-78 4 -80 -16Z');
      s += C(0, ry, 22) + tube(0, ry, -18, ry + 28, 9) + R(-36, ry + 26, 30, 10, 5);
      s += P('M70 -16L130 -16Q136 12 124 36L80 36Q66 12 70 -16Z') + curve('M74 4L130 4', T);
    }
    return s;
  },
};

const tractor = {
  id: 'tractor', name: 'Tractor', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    const lugTyre = (x, y, r) => {
      let w = C(x, y, r) + C(x, y, r * 0.62) + C(x, y, r * 0.22);
      for (let i = 0; i < 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        w += line(x + Math.cos(t) * r * 0.66, y + Math.sin(t) * r * 0.66, x + Math.cos(t + 0.18) * r * 0.97, y + Math.sin(t + 0.18) * r * 0.97, T);
      }
      return w;
    };
    let s = '';
    if (style === 0) {
      s += puffs(118, -100, 70);
      s += R(104, -92, 14, 86, 5) + R(100, -100, 22, 12, 5);
      s += P('M-20 110L-20 -14L150 -14Q178 -14 184 16L190 110Z');
      s += curve('M168 6L168 100M150 -10L150 104', T) + curve('M-10 30L140 30', T);
      s += E(184, 24, 7, 12);
      s += P('M-174 -14L-162 -158L-8 -158L0 -14Z') + R(-190, -176, 204, 24, 12);
      s += P('M-150 -138L-24 -138L-20 -40L-158 -40Z') + curve('M-60 -40L-46 -86M-70 -86L-24 -86', T);
      s += R(-190, -14, 196, 30, 8);
      s += lugTyre(-90, 108, 92) + P('M-196 108A106 106 0 0 1 16 108L-4 108A86 86 0 0 0 -176 108Z');
      s += wheel(128, 54);
    } else if (style === 1) {
      // pulling a trailer full of hay bales
      s += line(-10, 120, 30, 120) + R(-194, 92, 190, 26, 6);
      s += R(-186, 30, 82, 62, 12) + R(-98, 30, 82, 62, 12) + R(-144, -32, 82, 62, 12);
      s += curve('M-160 34L-160 88M-130 34L-130 88M-72 34L-72 88M-42 34L-42 88M-118 -28L-118 26M-88 -28L-88 26', T);
      s += wheel(-150, 32, 168) + wheel(-56, 32, 168);
      s += R(150, -64, 12, 62, 5) + cloud(150, -96, 50);
      s += P('M70 100L70 0L170 0Q192 0 194 24L196 100Z') + E(190, 30, 6, 10);
      s += P('M18 0L26 -100L118 -100L124 0Z') + R(8, -114, 126, 20, 10) + P('M36 -84L106 -84L108 -20L32 -20Z');
      s += R(10, 0, 120, 24, 6);
      s += lugTyre(64, 136, 64) + P('M-10 136A74 74 0 0 1 138 136L124 136A60 60 0 0 0 4 136Z') + wheel(168, 34);
    } else {
      // seen from the front with a face on the bonnet
      s += R(-110, -176, 220, 22, 11);
      s += R(-104, -160, 14, 176) + R(90, -160, 14, 176) + R(-90, -150, 180, 120, 8);
      s += curve('M-40 -60Q0 -80 40 -60', T) + line(0, -66, 0, -30, T);
      s += R(70, -120, 12, 90, 5) + C(76, -146, 12) + C(96, -170, 9);
      const tyreF = (x) => {
        let t = R(x - 36, 20, 72, 180, 30);
        for (let y = 50; y < 190; y += 26) t += curve(`M${x - 30} ${y}L${x} ${y - 12}L${x + 30} ${y}`, T);
        return t;
      };
      s += tyreF(-158) + tyreF(158);
      s += P('M-196 30Q-196 -24 -158 -24Q-120 -24 -120 30Z') + P('M120 30Q120 -24 158 -24Q196 -24 196 30Z');
      s += R(-110, 12, 220, 30, 8);
      s += R(-100, 140, 40, 60, 14) + R(60, 140, 40, 60, 14);
      s += R(-62, -24, 124, 172, 18);
      s += face(0, 22, 18, 30) + R(-44, 92, 88, 40, 8) + curve('M-44 105L44 105M-44 118L44 118', T);
    }
    return s;
  },
};

const digger = {
  id: 'digger', name: 'Digger', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    const tracks = (x0, x1) => {
      let t = R(x0, 140, x1 - x0, 60, 30);
      const n = 4;
      for (let i = 0; i < n; i++) t += C(x0 + 30 + ((x1 - x0 - 60) * i) / (n - 1), 170, 18);
      return t + R(x0 + 30, 145, x1 - x0 - 60, 6, 3, 'fill="none"');
    };
    const joint = (x, y) => C(x, y, 10);
    if (style === 0) {
      // excavator digging a heap of earth
      s += blob([[80, 200], [96, 150], [140, 124], [184, 140], [200, 200]]) + C(120, 170, 10) + C(160, 186, 8);
      s += tube(20, 70, 112, -140, 40) + tube(40, 20, 100, -100, 12) + tube(112, -140, 166, 80, 30) + tube(116, -110, 150, 30, 10);
      s += P('M140 76L198 64L196 126Q170 150 142 124Z') + poly([[150, 126], [160, 140], [170, 130]]) + poly([[176, 134], [186, 144], [194, 128]]);
      s += joint(112, -140) + joint(166, 80) + joint(20, 70);
      s += tracks(-190, 70);
      s += R(-150, 114, 180, 26, 6);
      s += P('M-186 114L-186 16Q-186 -4 -166 -4L-30 -4L-30 114Z') + curve('M-170 30L-50 30M-170 50L-50 50', T);
      s += R(-48, -18, 34, 12, 4);
      s += R(-30, -100, 90, 214, 10) + P('M-16 -86L46 -86L46 -6L-16 -6Z');
      s += kid(14, -44, 22, 4, ctx, 'hard');
    } else if (style === 1) {
      // backhoe loader: bucket in front, digging arm at the back
      s += tube(-150, 60, -176, 184, 16) + R(-198, 180, 48, 18, 5);
      s += tube(-136, 50, -172, -116, 32) + tube(-148, 0, -166, -80, 10) + tube(-172, -116, -188, 6, 24) + joint(-172, -116);
      s += P('M-200 -6L-164 4Q-160 50 -184 62Q-204 50 -200 -6Z') + poly([[-184, 62], [-168, 72], [-174, 56]]) + joint(-188, 6);
      s += tube(-10, 50, 150, 110, 24);
      s += P('M198 196L146 196Q120 150 142 96L184 94Q176 150 198 196Z') + joint(150, 110);
      s += P('M-170 120L-170 30L-110 30L-110 -110L-10 -110L-6 0L120 0Q140 0 140 24L140 120Z');
      s += P('M-96 -94L-24 -94L-22 -10L-96 -10Z') + kid(-60, -48, 22, 0, ctx, 'hard');
      s += R(-120, -126, 124, 20, 10) + curve('M-6 30L130 30', T) + E(136, 44, 6, 10);
      s += R(30, -40, 12, 40, 5);
      s += P('M-170 140A70 70 0 0 1 -30 140Z') + wheel(-100, 62) + P('M56 150A56 56 0 0 1 168 150Z', 'fill="none"') + wheel(92, 46);
    } else {
      // little digger lifting a bucket of rocks high
      s += tube(46, 70, 100, -130, 42) + tube(70, 20, 96, -90, 12) + tube(100, -130, 158, -92, 28) + joint(100, -130);
      s += C(146, -136, 15) + C(176, -140, 13) + C(160, -164, 12);
      s += P('M124 -126L198 -130L188 -80Q164 -58 134 -84Z') + joint(158, -92);
      s += tracks(-170, 130);
      s += R(-140, 114, 220, 26, 6);
      s += P('M-170 114L-170 20Q-170 0 -150 0L-60 0L-60 114Z') + curve('M-156 40L-74 40M-156 62L-74 62M-156 84L-74 84', T);
      s += R(-60, -120, 120, 234, 14) + R(-46, -104, 92, 96, 10);
      s += kid(0, -54, 30, 3, ctx, 'hard');
      s += R(-74, -134, 148, 20, 10) + R(20, 30, 24, 10, 5) + curve('M-46 14L-46 104', T);
    }
    return s;
  },
};

const ambulance = {
  id: 'ambulance', name: 'Ambulance', styles: 3,
  draw(style, rand, ctx) {
    const T = ctx.thin;
    let s = '';
    const badge = (x, y, r) => C(x, y, r) + heart(x, y + r * 0.08, r * 1.15);
    if (style === 0) {
      s += R(-180, -132, 40, 18, 8) + R(20, -132, 40, 18, 8);
      s += R(-196, -116, 264, 250, 16);
      s += P('M66 134L66 -60Q66 -76 82 -76L122 -76Q132 -76 138 -66L170 -14Q194 -6 196 22L196 134Z');
      s += P('M82 -60L120 -60L152 -16L82 -16Z');
      s += R(-196, 16, 262, 26) + R(66, 16, 130, 26);
      s += badge(-82, -46, 46);
      s += R(-180, -96, 40, 44, 6) + curve('M-130 -106L-130 120M-34 -106L-34 120', T) + R(-26, -70, 50, 44, 6);
      s += E(188, 64, 7, 12) + R(176, 116, 26, 22, 8) + R(-200, 116, 22, 22, 8) + curve('M78 50L78 120', T);
      s += arch(-118, 134, 54) + arch(130, 134, 54) + wheel(-118, 46) + wheel(130, 46);
    } else if (style === 1) {
      // seen from the front
      s += R(-166, 120, 62, 80, 18) + R(104, 120, 62, 80, 18);
      s += R(-150, -186, 300, 120, 16) + E(-120, -190, 22, 12) + E(120, -190, 22, 12) + R(-44, -200, 88, 22, 10);
      s += badge(0, -128, 38);
      s += line(-160, -20, -192, -10) + line(160, -20, 192, -10) + E(-192, 14, 12, 26) + E(192, 14, 12, 26);
      s += R(-160, -70, 320, 216, 24);
      s += R(-138, -54, 276, 92, 14) + curve('M-100 -40L-70 10M60 -44L92 2', T);
      s += R(-160, 52, 320, 18);
      s += C(-108, 98, 24) + C(108, 98, 24) + R(-48, 82, 96, 34, 8) + curve('M-40 94L40 94M-40 104L40 104', T);
      s += R(-172, 128, 344, 28, 14);
    } else {
      // back doors open with a teddy resting inside
      s += R(-134, 160, 52, 40, 12) + R(82, 160, 52, 40, 12);
      s += P('M-140 -150L-196 -126L-196 126L-140 132Z') + R(-186, -104, 34, 70, 6) + heart(-169, 20, 34);
      s += P('M140 -150L196 -126L196 126L140 132Z') + R(152, -104, 34, 70, 6) + heart(169, 20, 34);
      s += R(-140, -170, 280, 312, 18);
      s += E(-110, -176, 18, 10) + E(110, -176, 18, 10);
      s += R(-116, -146, 232, 254, 8);
      s += P('M-116 -146L-80 -110L80 -110L116 -146') + P('M-116 108L-80 72L80 72L116 108', 'fill="none"') + curve('M-80 -110L-80 72M80 -110L80 72', T);
      s += curve('M-110 -70L-84 -60M-110 -20L-84 -14M84 -60L110 -70M84 -14L110 -20', T);
      // stretcher with a teddy under a blanket
      s += line(-70, 80, -70, 100) + line(70, 80, 70, 100);
      s += P('M-90 30L90 30L96 80L-96 80Z');
      s += E(0, 24, 42, 14);
      s += C(-26, -26, 14) + C(26, -26, 14) + C(-26, -26, 6) + C(26, -26, 6);
      s += C(0, 0, 34) + E(0, 12, 16, 11) + dark(E(0, 6, 6, 4)) + dotEye(-12, -8, 4) + dotEye(12, -8, 4) + curve('M-6 16Q0 20 6 16', T);
      s += P('M-80 26Q0 10 80 26L84 66L-84 66Z') + curve('M-80 40Q0 26 80 40', T);
      s += R(-150, 136, 300, 24, 8);
    }
    return s;
  },
};

// ---------- hot air balloons ----------

/** Half-width of the balloon envelope at fraction u (0 top, 1 bottom). */
const envW = (u, W, bw) => (u <= 0.5 ? W * Math.sqrt(Math.max(0, 1 - Math.pow(1 - u / 0.5, 2))) : W - (W - bw) * Math.pow((u - 0.5) / 0.5, 1.4));
/**
 * A hot air balloon centred at cx, with envelope from top to bot (y), max half-width W.
 * pattern: 'gores' (vertical panels), 'bands' (stripes with a zigzag), 'mixed'. basket: draw a basket below.
 */
function balloon(cx, top, bot, W, pattern, ctx, opts = {}) {
  const bw = W * 0.3, N = 36;
  const Y = (u) => top + (bot - top) * u;
  const edge = (k, from = 0, to = 1) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const u = from + ((to - from) * i) / N;
      pts.push([cx + k * envW(u, W, bw), Y(u)]);
    }
    return pts;
  };
  const toD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join('');
  let s = '';
  const skirtTop = bot, skirtBot = bot + (bot - top) * 0.09;
  const basketTop = skirtBot + (bot - top) * (opts.gap ?? 0.17);
  const bwid = opts.basketW ?? W * 0.42, bh = opts.basketH ?? (bot - top) * 0.22;
  if (opts.basket !== false) {
    // ropes, then people, then the basket
    s += line(cx - bw * 0.85, skirtBot, cx - bwid * 0.5, basketTop) + line(cx + bw * 0.85, skirtBot, cx + bwid * 0.5, basketTop);
    if (opts.people) s += opts.people(cx, basketTop);
    s += R(cx - bwid * 0.5, basketTop + 12, bwid, bh - 12, 10) + R(cx - bwid * 0.56, basketTop, bwid * 1.12, 18, 8);
    s += curve(`M${r1(cx - bwid * 0.5)} ${r1(basketTop + bh * 0.55)}L${r1(cx + bwid * 0.5)} ${r1(basketTop + bh * 0.55)}M${r1(cx - bwid * 0.17)} ${r1(basketTop + 18)}L${r1(cx - bwid * 0.17)} ${r1(basketTop + bh)}M${r1(cx + bwid * 0.17)} ${r1(basketTop + 18)}L${r1(cx + bwid * 0.17)} ${r1(basketTop + bh)}`, ctx.thin);
    s += P(`M${r1(cx - 10)} ${r1(skirtBot + 4)}Q${r1(cx)} ${r1(skirtBot + 30)} ${r1(cx + 10)} ${r1(skirtBot + 4)}Q${r1(cx + 4)} ${r1(skirtBot + 14)} ${r1(cx)} ${r1(skirtBot + 2)}Q${r1(cx - 4)} ${r1(skirtBot + 14)} ${r1(cx - 10)} ${r1(skirtBot + 4)}Z`);
  }
  s += P(`M${r1(cx - bw)} ${r1(skirtTop)}L${r1(cx + bw)} ${r1(skirtTop)}L${r1(cx + bw * 0.82)} ${r1(skirtBot)}L${r1(cx - bw * 0.82)} ${r1(skirtBot)}Z`);
  if (pattern === 'gores') {
    const ks = [-1, -0.87, -0.5, 0, 0.5, 0.87, 1];
    for (let i = 0; i < ks.length - 1; i++) s += P(toD([...edge(ks[i]), ...edge(ks[i + 1]).reverse()]) + 'Z');
  } else {
    s += P(toD([...edge(-1), ...edge(1).reverse()]) + 'Z');
    const cut = pattern === 'bands' ? [0.2, 0.42, 0.62, 0.8] : [0.3, 0.55];
    // band boundaries (zigzag for the second one in 'bands')
    cut.forEach((u, j) => {
      const w = envW(u, W, bw), y = Y(u);
      if (pattern === 'bands' && j === 1) {
        const n = 8;
        let d = `M${r1(cx - w)} ${r1(y)}`;
        for (let i = 1; i <= n; i++) d += `L${r1(cx - w + (2 * w * i) / n)} ${r1(y + (i % 2 ? -14 : 0) * ((bot - top) / 300))}`;
        s += curve(d);
      } else s += curve(`M${r1(cx - w)} ${r1(y)}Q${r1(cx)} ${r1(y + (bot - top) * 0.05)} ${r1(cx + w)} ${r1(y)}`);
    });
    if (pattern === 'bands') {
      const yh = Y(0.52), sz = (bot - top) * 0.16;
      for (const k of [-0.6, 0, 0.6]) s += heart(cx + k * W * 0.95, yh + sz * 0.1, sz);
    } else {
      const ys = Y(0.43), sz = (bot - top) * 0.08;
      for (const k of [-0.62, 0, 0.62]) s += star(cx + k * W * 0.95, ys, sz, sz * 0.45);
      s += curve(`M${r1(cx)} ${r1(top)}L${r1(cx)} ${r1(Y(0.3))}`) ;
    }
  }
  return s;
}

const hotAirBalloon = {
  id: 'hot-air-balloon', name: 'Hot air balloon', styles: 3, kind: 'float',
  draw(style, rand, ctx) {
    if (style === 0) return balloon(0, -196, 64, 156, 'gores', ctx, { basketW: 92, basketH: 66 });
    if (style === 1) {
      const people = (cx, bt) => kid(cx - 26, bt - 14, 22, 2, ctx) + kid(cx + 28, bt - 18, 25, 1, ctx) + C(cx + 66, bt - 46, 9) + line(cx + 50, bt - 4, cx + 62, bt - 38);
      return balloon(0, -196, 30, 158, 'bands', ctx, { basketW: 130, basketH: 70, gap: 0.27, people });
    }
    // three balloons sailing together
    let s = balloon(118, -196, -70, 62, 'mixed', ctx, { basketW: 40, basketH: 32 });
    s += balloon(-120, 20, 132, 56, 'gores', ctx, { basketW: 36, basketH: 28 });
    s += balloon(10, -150, 56, 122, 'mixed', ctx, { basketW: 74, basketH: 54 });
    return s;
  },
};

export default [{
  id: 'vehicles', name: 'Things that go', order: 30,
  scenes: ['plain', 'hearts', 'stars', 'road', 'meadow', 'hills', 'snow', 'rain', 'night', 'forest'],
  pairScenes: ['road', 'meadow', 'sky', 'water'],
  icon: 'car',
  kind: 'ground',
  subjects: [
    car, schoolBus, dumpTruck, fireEngine,
    { ...train, pairs: false, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'snow', 'night', 'forest', 'rain'] },
    { ...airplane, scenes: ['plain', 'hearts', 'stars', 'sky', 'night', 'hills', 'meadow'] },
    { ...helicopter, scenes: ['plain', 'hearts', 'stars', 'sky', 'hills', 'meadow', 'night'] },
    { ...tugboat, scenes: ['plain', 'hearts', 'stars', 'water'] },
    { ...sailboat, scenes: ['plain', 'hearts', 'stars', 'water'] },
    bicycle,
    { ...tractor, scenes: ['plain', 'hearts', 'stars', 'meadow', 'hills', 'garden', 'snow', 'rain', 'road'] },
    { ...digger, scenes: ['plain', 'hearts', 'stars', 'road', 'hills', 'meadow', 'snow', 'rain'] },
    ambulance,
    { ...hotAirBalloon, scenes: ['plain', 'hearts', 'stars', 'sky', 'hills', 'meadow', 'night'] },
  ],
}];
