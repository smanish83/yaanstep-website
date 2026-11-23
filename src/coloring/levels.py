"""Gives every coloring page a level: 1 Easy, 2 Medium, 3 Hard (SCRUM-515 follow-up, 23 Nov 2026).

The level comes from how much there is to color: each page is drawn small, and the white spaces inside the frame
are counted. Tiny spaces (hard to color with a crayon) count three times. Patterns and mandalas are never Easy.
Writes one digit per page into coloring/index.json as each subject's "lv". Run from the site root after
node src/coloring/build.mjs (the build runs it for you when Python 3 with cairosvg, numpy and scipy is there).
"""
import io, json
from concurrent.futures import ProcessPoolExecutor

import cairosvg
import numpy as np
from PIL import Image
from scipy import ndimage

S = 0.4                 # draw at 40% size
EASY_MAX, MEDIUM_MAX = 55, 115


def score(path):
    png = cairosvg.svg2png(url=path, output_width=int(850 * S), output_height=int(1100 * S))
    a = np.array(Image.open(io.BytesIO(png)).convert('L'))
    a = a[int(34 * S) + 3:int(1000 * S) - 3, int(34 * S) + 3:int(816 * S) - 3]   # inside the frame, above the name
    lab, _ = ndimage.label(a > 200)
    sizes = np.bincount(lab.ravel())[1:]
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    spaces = [s for i, s in enumerate(sizes, 1) if s >= 12 and i not in edge]
    return len(spaces) + 2 * sum(1 for s in spaces if s < 150)


def level(cat, sc):
    lv = 1 if sc <= EASY_MAX else 2 if sc <= MEDIUM_MAX else 3
    return max(lv, 2) if cat == 'patterns' else lv


def main():
    ix = json.load(open('coloring/index.json'))
    jobs = [(c['id'], s, n) for c in ix['categories'] for s in c['subjects'] for n in range(1, s['n'] + 1)]
    with ProcessPoolExecutor() as ex:
        scores = list(ex.map(score, [f"coloring/{c}/{s['id']}-{n}.svg" for c, s, n in jobs], chunksize=20))
    for s in (s for c in ix['categories'] for s in c['subjects']):
        s['lv'] = ''
        s.pop('easy', None)
    for (c, s, n), sc in zip(jobs, scores):
        s['lv'] += str(level(c, sc))
    json.dump(ix, open('coloring/index.json', 'w'), separators=(',', ':'))
    counts = [sum(s['lv'].count(d) for c in ix['categories'] for s in c['subjects']) for d in '123']
    print(f'levels: {counts[0]} easy, {counts[1]} medium, {counts[2]} hard')


if __name__ == '__main__':
    main()
