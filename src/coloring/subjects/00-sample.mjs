// Sample subjects that show the conventions. Kept small; real categories live in their own files.
import { C, E, P, R, poly, curve, line, blob, smooth, eye, dotEye, dark, smile, g, star, heart, ring } from '../lib.mjs';

const duck = {
  id: 'duck', name: 'Duck', styles: 3,
  draw(style, rand, ctx) {
    // style 0: standing duck, 1: swimming duck with water lines, 2: duck with an umbrella-free hat and a bow
    let s = '';
    if (style !== 1) s += P('M-40 150L-60 200L-10 200L-25 150Z') + P('M35 150L20 200L70 200L50 150Z');
    // body
    s += blob([[-170, 40], [-140, -20], [-60, -10], [40, 10], [130, 0], [160, 60], [120, 150], [0, 170], [-110, 150], [-165, 100]]);
    // wing
    s += blob([[-80, 40], [-10, 20], [70, 50], [60, 100], [-20, 110]]) + curve('M-20 60Q10 75 40 70M-10 85Q20 95 45 90', ctx.thin);
    // tail
    s += P('M-160 40L-200 -10L-150 10Z');
    // neck and head
    s += blob([[60, 20], [70, -70], [60, -130], [100, -175], [160, -160], [175, -110], [140, -70], [130, 10]]);
    s += P('M168 -128Q215 -130 225 -110Q205 -95 165 -100Z') + curve('M170 -113L215 -112', ctx.thin);
    s += eye(130, -135, 13, [0.4, -0.1]);
    if (style === 1) s += curve('M-190 160q30 -18 60 0t60 0t60 0t60 0t60 0t60 0') + curve('M-150 195q30 -18 60 0t60 0t60 0t60 0t60 0');
    if (style === 2) s += P('M95 -170L100 -215L160 -205L150 -165Z') + E(125, -170, 50, 12) + P('M70 -40L95 -55L95 -25Z') + P('M120 -40L95 -55L95 -25Z') + C(95, -40, 8);
    return s;
  },
};

const rose = {
  id: 'rose', name: 'Rose', styles: 3,
  draw(style, rand, ctx) {
    const bloom = (x, y, r) => {
      let s = blob([[x - r, y - r * 0.2], [x - r * 0.8, y + r * 0.6], [x, y + r], [x + r * 0.8, y + r * 0.6], [x + r, y - r * 0.2], [x + r * 0.5, y - r * 0.4], [x, y - r * 0.2], [x - r * 0.5, y - r * 0.4]]);
      s += blob([[x - r * 0.55, y - r * 0.35], [x - r * 0.4, y - r * 0.85], [x, y - r * 0.6], [x + r * 0.4, y - r * 0.85], [x + r * 0.55, y - r * 0.35], [x, y + r * 0.1]]);
      s += curve(`M${x - r * 0.25} ${y - r * 0.45}Q${x} ${y - r * 0.2} ${x + r * 0.25} ${y - r * 0.45}Q${x + r * 0.05} ${y - r * 0.6} ${x - r * 0.1} ${y - r * 0.5}`, ctx.thin);
      s += curve(`M${x - r * 0.7} ${y + r * 0.1}Q${x} ${y + r * 0.55} ${x + r * 0.7} ${y + r * 0.1}`, ctx.thin);
      return s;
    };
    const leaf = (x, y, a) => g(blob([[0, 0], [30, -18], [62, 0], [30, 18]]) + line(4, 0, 55, 0, ctx.thin), `translate(${x} ${y}) rotate(${a})`);
    if (style === 0) return curve('M0 200C-10 120 15 60 0 -20') + leaf(-2, 100, 200) + leaf(4, 50, -20) + bloom(0, -90, 110);
    if (style === 1) {
      return curve('M-10 200C-30 80 -90 20 -110 -40') + curve('M0 200C5 60 10 0 20 -90') + curve('M10 200C40 100 90 30 115 -20') +
        leaf(-60, 60, 220) + leaf(18, 40, -40) + leaf(70, 80, -30) + bloom(-110, -80, 70) + bloom(115, -60, 70) + bloom(20, -130, 80) +
        P('M-70 190L-60 120L60 120L70 190Z') + P('M-60 120L0 150L60 120') ;
    }
    // in a pot
    return curve('M0 90C-10 40 10 0 0 -40') + leaf(0, 40, 200) + bloom(0, -100, 100) +
      P('M-100 90L100 90L80 200L-80 200Z') + R(-115, 70, 230, 34, 8) + heart(0, 150, 50);
  },
};

export default {
  id: 'sample', name: 'Sample', order: 99,
  scenes: ['plain', 'meadow', 'hills', 'garden', 'night', 'pond', 'hearts', 'stars', 'rain', 'party', 'forest', 'room', 'snow'],
  pairScenes: ['meadow', 'garden'],
  subjects: [duck, rose],
};
