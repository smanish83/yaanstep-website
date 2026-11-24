"""Record the library stories with a free, open voice (Kokoro-82M, Apache-2.0, voice af_heart).

Manish, 24 Nov 2026: "Are the recorded voice better choice? I still feel that voice is not appropriain chrome browser",
then "Yes, start with stories".

For each book: one small MP3 file per page, plus index.json with each word's start and end time, so the reader can
highlight the word being read. Usage:
  python tools/record_stories.py SITE_DIR OUT_DIR --ages 3-5 --shard 0 --shards 4 [--limit N]
"""
import argparse, json, os, re, subprocess, sys, tempfile, time

import numpy as np
import soundfile as sf
from kokoro import KPipeline

VOICE = 'af_heart'
SPEED = 0.85          # a little slower than Kokoro's normal pace, for young listeners; the reader's "Gentle" speed
RATE = 24000
BITRATE = '32k'       # MP3 plays everywhere, including iPhones and iPads, which don't play WebM reliably


def norm(s):
    return re.sub(r'[^0-9a-z]', '', s.lower())


def align(words, toks, total):
    """Give each word (as split on spaces) a [start, end] in seconds from Kokoro's token times.
    Falls back to spreading the words over the page by their length when the two don't line up."""
    stream = [(norm(t), s, e) for t, s, e in toks if norm(t)]
    if ''.join(w for w in map(norm, words)) == ''.join(t for t, _, _ in stream) and stream:
        out, k, used = [], 0, 0
        last = 0.0
        for w in words:
            n = len(norm(w))
            if n == 0:
                out.append([last, last]); continue
            start = end = None
            while n > 0 and k < len(stream):
                t, s, e = stream[k]
                take = min(n, len(t) - used)
                if start is None and s is not None: start = s
                if e is not None: end = e
                n -= take; used += take
                if used == len(t): k += 1; used = 0
            start = last if start is None else start
            end = start if end is None else end
            out.append([round(start, 3), round(max(end, start), 3)]); last = out[-1][1]
        return out, True
    weights = [len(w) + 1 for w in words]
    tot = float(sum(weights)) or 1.0
    span = max(total - 0.3, 0.1)
    out, t = [], 0.15
    for wgt in weights:
        d = span * wgt / tot
        out.append([round(t, 3), round(t + d, 3)]); t += d
    return out, False


def speak(pipe, text):
    chunks, toks, off = [], [], 0.0
    for r in pipe(text, voice=VOICE, speed=SPEED, split_pattern=None):
        a = r.audio.detach().cpu().numpy() if hasattr(r.audio, 'detach') else np.asarray(r.audio)
        for t in (r.tokens or []):
            s = None if t.start_ts is None else t.start_ts + off
            e = None if t.end_ts is None else t.end_ts + off
            toks.append((t.text, s, e))
        chunks.append(a); off += len(a) / RATE
    audio = np.concatenate(chunks) if chunks else np.zeros(RATE // 2, dtype=np.float32)
    return audio, toks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('site'); ap.add_argument('out')
    ap.add_argument('--ages', default='3-5'); ap.add_argument('--shard', type=int, default=0)
    ap.add_argument('--shards', type=int, default=1); ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--force', action='store_true', help='record again books that already have a recording')
    a = ap.parse_args()
    ages = set(a.ages.split(','))
    cat = json.load(open(os.path.join(a.site, 'stories', 'catalog.json')))
    books = [c for c in cat if c['ages'] in ages and (a.force or not c.get('audio'))]
    books.sort(key=lambda c: c['id'])
    books = books[a.shard::a.shards]
    if a.limit: books = books[:a.limit]
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    report = {'books': 0, 'pages': 0, 'seconds': 0.0, 'guessed_pages': []}
    t0 = time.time()
    for c in books:
        b = json.load(open(os.path.join(a.site, 'stories', 'books', c['id'] + '.json')))
        d = os.path.join(a.out, c['id']); os.makedirs(d, exist_ok=True)
        pages = []
        for i, p in enumerate(b['pages']):
            text = re.sub(r'\s+', ' ', p['text']).strip()
            words = re.findall(r'\S+', p['text'])
            audio, toks = speak(pipe, text)
            audio = np.concatenate([np.zeros(int(RATE * 0.15), dtype=np.float32), audio.astype(np.float32)])
            toks = [(t, None if s is None else s + 0.15, None if e is None else e + 0.15) for t, s, e in toks]
            dur = len(audio) / RATE
            times, exact = align(words, toks, dur)
            if not exact: report['guessed_pages'].append(f"{c['id']}#{i + 1}")
            name = f'{i + 1:02d}.mp3'
            with tempfile.NamedTemporaryFile(suffix='.wav') as w:
                sf.write(w.name, audio, RATE)
                subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', w.name, '-ac', '1', '-c:a', 'libmp3lame',
                                '-b:a', BITRATE, '-write_xing', '0', os.path.join(d, name)], check=True)
            pages.append({'f': name, 'd': round(dur, 2), 'w': times})
            report['pages'] += 1; report['seconds'] += dur
        json.dump({'voice': 'Kokoro ' + VOICE, 'speed': SPEED, 'pages': pages}, open(os.path.join(d, 'index.json'), 'w'),
                  separators=(',', ':'))
        report['books'] += 1
        print(f"{c['id']}: {len(pages)} pages, {sum(p['d'] for p in pages):.0f}s audio, {time.time() - t0:.0f}s so far", flush=True)
    report['seconds'] = round(report['seconds'])
    json.dump(report, open(os.path.join(a.out, f'report-{a.shard}.json'), 'w'), indent=1)
    print(json.dumps(report)[:2000])


if __name__ == '__main__':
    main()
