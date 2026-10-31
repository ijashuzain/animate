#!/usr/bin/env python3
"""Ingest one reference batch reply (text from the Mac session) into the repo: numbers and notes only.

    python3 ingest_batch.py BATCH_ID reply.txt [--date 2026-10-31]

reply.txt holds the Mac session's final reply. Its ```jsonl block (one film_metrics v2 JSON per line, plus "rhythm_valid"
and "sha256") becomes data/metrics/reference/<BATCH_ID>/<id>.json; data/status.json gets status licensed_stills, the
batch id and rhythm_valid; the review notes after the block are kept verbatim in data/reviews/<BATCH_ID>.md (the
reviewer's own generic descriptions; no frames, no transcribed text).
"""
import argparse, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('batch'); ap.add_argument('reply'); ap.add_argument('--date', default='')
    a = ap.parse_args(); text = open(a.reply).read()
    m = re.search(r'```jsonl\s*\n(.*?)```', text, re.S)
    if not m: raise SystemExit('no ```jsonl block in the reply')
    rows = [json.loads(l) for l in m.group(1).splitlines() if l.strip()]
    out = os.path.join(ROOT, 'data', 'metrics', 'reference', a.batch); os.makedirs(out, exist_ok=True)
    st_path = os.path.join(ROOT, 'data', 'status.json'); st = json.load(open(st_path)) if os.path.exists(st_path) else {}
    for r in rows:
        vid = os.path.splitext(r['file'])[0]
        if r.get('metrics_version') != 2: raise SystemExit(f'{vid}: not a v2 record')
        json.dump(r, open(os.path.join(out, vid + '.json'), 'w'), indent=1)
        prev = st.get(vid, {})
        st[vid] = {'status': 'licensed_stills', 'batch': a.batch, 'rhythm_valid': bool(r.get('rhythm_valid', True)),
                   'note': f"v2 metrics{' + exclusions' if r.get('excluded_s') else ''}; stills reviewed by agent" + (f"; earlier: {prev['batch']}" if prev.get('batch') and prev.get('batch') != a.batch else '')}
    json.dump(dict(sorted(st.items())), open(st_path, 'w'), indent=1)
    notes = text[m.end():].strip()
    rv = os.path.join(ROOT, 'data', 'reviews'); os.makedirs(rv, exist_ok=True)
    open(os.path.join(rv, a.batch + '.md'), 'w').write(f'# Review notes, {a.batch}{" (" + a.date + ")" if a.date else ""}\n\n'
        'Stills-level notes by the Mac agent from 320 px contact sheets (kept on the Mac). Generic descriptions only; no motion is inferred.\n\n' + notes + '\n')
    print(f'{len(rows)} records -> {os.path.relpath(out)}; status.json updated; notes -> data/reviews/{a.batch}.md')


if __name__ == '__main__':
    main()
