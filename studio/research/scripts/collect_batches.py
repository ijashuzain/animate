#!/usr/bin/env python3
"""Collect 'BATCH bNN RESULTS' messages from a saved Mac-session transcript dump and ingest the new ones.

    python3 collect_batches.py DUMP.txt [DUMP2.txt ...] [--dry]

A dump is the JSON that list_events returns (kinds assistant/result). Every assistant or result text that contains
'BATCH bNN RESULTS' and a ```jsonl block is ingested once as batch id 'bNN-<date of the message>' via ingest_batch.py,
unless data/metrics/reference/bNN-* already exists. Prints what it did and the latest event id (to page from next time).
"""
import glob, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')


def texts(dump):
    s = open(dump).read(); d = json.loads(s[s.find('{"ccr"'):s.rfind('}') + 1])
    for e in d['ccr'].get('data', []):
        if 'assistant' in e:
            for c in e['assistant']['internal_anthropic_catchall']['message']['content']:
                if c.get('type') == 'text': yield e['created_at'], c['text']
        elif 'result' in e:
            yield e['created_at'], e['result']['internal_anthropic_catchall'].get('result', '')
    print('last_id', d['ccr'].get('last_id'), 'has_more', d['ccr'].get('has_more'))


def main():
    dry = '--dry' in sys.argv; dumps = [a for a in sys.argv[1:] if a != '--dry']; seen = set()
    for dump in dumps:
        for when, t in texts(dump):
            for m in re.finditer(r'BATCH (b\d+) RESULTS', t):
                b = m.group(1)
                if b in seen or '```jsonl' not in t[m.end():]: continue
                seen.add(b)
                if glob.glob(os.path.join(ROOT, 'data', 'metrics', 'reference', b + '-*')): print(b, 'already ingested'); continue
                nxt = re.search(r'BATCH b\d+ RESULTS', t[m.end():]); chunk = t[m.start(): m.end() + nxt.start()] if nxt else t[m.start():]
                bid = f'{b}-{when[:10]}'
                if dry: print('would ingest', bid, len(chunk), 'chars'); continue
                with tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False) as f: f.write(chunk)
                subprocess.run([sys.executable, '-I', os.path.join(HERE, 'ingest_batch.py'), bid, f.name, '--date', when[:10]], check=True)


if __name__ == '__main__':
    main()
