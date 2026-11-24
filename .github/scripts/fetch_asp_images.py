"""Fetch the pictures for African Storybook books listed in asp-images.json and save them as WebP.

Runs in GitHub Actions (the pictures are on africanstorybook.org). For each book id, the first file is the cover
(01.webp) and the rest are the pages (02.webp, 03.webp, ...), resized to at most 800 pixels wide.
"""
import io, json, os, sys, urllib.request
from PIL import Image

BASES = ['https://www.africanstorybook.org/', 'https://africanstorybook.org/', 'http://africanstorybook.org/']


def get(path):
    last = None
    for b in BASES:
        try:
            req = urllib.request.Request(b + path, headers={'User-Agent': 'Mozilla/5.0 (compatible; story-library-builder)'})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            Image.open(io.BytesIO(data)).verify()
            return data
        except Exception as e:  # try the next address form
            last = e
    raise RuntimeError(f'{path}: {last}')


def main():
    man = json.load(open('.github/scripts/asp-images.json'))
    report = {'ok': [], 'failed': {}}
    for pid, paths in man.items():
        out = os.path.join('stories', 'img', pid)
        try:
            files = []
            for i, p in enumerate(paths):
                im = Image.open(io.BytesIO(get(p)))
                if im.mode in ('RGBA', 'LA', 'P'):
                    im = im.convert('RGBA'); bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.split()[-1]); im = bg
                else:
                    im = im.convert('RGB')
                if im.width > 800:
                    im = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
                files.append((f'{i + 1:02d}.webp', im))
            os.makedirs(out, exist_ok=True)
            for name, im in files:
                im.save(os.path.join(out, name), 'WEBP', quality=70, method=4)
            report['ok'].append(pid)
        except Exception as e:
            report['failed'][pid] = str(e)[:300]
        print(pid, 'ok' if pid in report['ok'] else report['failed'][pid], flush=True)
    json.dump(report, open('.github/scripts/asp-images-report.json', 'w'), indent=1)
    print(json.dumps(report)[:3000])


if __name__ == '__main__':
    sys.exit(main())
