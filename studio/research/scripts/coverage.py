#!/usr/bin/env python3
"""Per-video coverage tracker and the deterministic batch picker for the reference study.

    python3 coverage.py status                 # writes data/coverage.csv + prints counts by status and stratum
    python3 coverage.py next 20                # the next batch: proportional across strata, never a video already studied

Inputs (all text, in the repo): data/inventory/local-*.txt (the read-only folder inventory) and data/status.json
({id: {status, batch, rhythm_valid?, note?}}). Statuses follow docs/16: cataloged, metadata_only, human_viewed,
licensed_stills, motion_reviewed, deep_analyzed, reconstruction_tested, blocked. Nothing here implies a video was seen
unless its status says so.

Strata: short = vertical; clip = landscape < 300 s; long = landscape 300-1000 s; xlong = landscape > 1000 s.
Order inside a stratum = sha1(id): fixed, reproducible, not alphabetical, not hand-picked.
"""
import glob, hashlib, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
STATUS = os.path.join(ROOT, 'data', 'status.json')


def inventory():
    rows = {}
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'inventory', 'local-*.txt'))):
        for line in open(f):
            if not line.strip() or line.startswith('#'): continue
            vid, dur, res, fps, ext, mb = line.strip().split('|'); w, h = map(int, res.split('x'))
            rows[vid] = dict(id=vid, duration_s=float(dur), res=res, fps=fps, ext=ext, mb=float(mb), stratum=stratum(w, h, float(dur)))
    return rows


def stratum(w, h, dur):
    if h > w: return 'short'
    return 'clip' if dur < 300 else 'long' if dur <= 1000 else 'xlong'


def statuses():
    return json.load(open(STATUS)) if os.path.exists(STATUS) else {}


def order(vid):
    return hashlib.sha1(vid.encode()).hexdigest()


def write_status():
    inv, st = inventory(), statuses(); out = os.path.join(ROOT, 'data', 'coverage.csv')
    with open(out, 'w') as f:
        f.write('id,stratum,duration_s,res,fps,ext,status,batch,rhythm_valid,note\n')
        for vid in sorted(inv):
            r, s = inv[vid], st.get(vid, {})
            f.write(','.join([vid, r['stratum'], str(r['duration_s']), r['res'], r['fps'], r['ext'], s.get('status', 'cataloged'), s.get('batch', ''),
                              '' if 'rhythm_valid' not in s else str(s['rhythm_valid']).lower(), '"' + s.get('note', '').replace('"', "'") + '"']) + '\n')
    counts = {}
    for vid, r in inv.items():
        k = (st.get(vid, {}).get('status', 'cataloged'), r['stratum']); counts[k] = counts.get(k, 0) + 1
    strata = ['short', 'clip', 'long', 'xlong']; stats = sorted({k[0] for k in counts})
    print('status'.ljust(18) + ''.join(s.rjust(8) for s in strata) + 'total'.rjust(8))
    for s in stats: print(s.ljust(18) + ''.join(str(counts.get((s, x), 0)).rjust(8) for x in strata) + str(sum(counts.get((s, x), 0) for x in strata)).rjust(8))
    print('all'.ljust(18) + ''.join(str(sum(1 for r in inv.values() if r['stratum'] == x)).rjust(8) for x in strata) + str(len(inv)).rjust(8))
    print('wrote', os.path.relpath(out))


def next_batch(n):
    inv, st = inventory(), statuses()
    todo = {x: sorted([v for v in inv if inv[v]['stratum'] == x and st.get(v, {}).get('status', 'cataloged') in ('cataloged', 'metadata_only')], key=order) for x in ('short', 'clip', 'long', 'xlong')}
    total = sum(len(v) for v in todo.values()); pick = {x: 0 for x in todo}
    if total == 0: print('nothing left'); return
    for x in todo: pick[x] = min(len(todo[x]), int(n * len(todo[x]) / total))
    while sum(pick.values()) < min(n, total):          # hand out the remainder to the strata furthest below their share
        x = max(todo, key=lambda k: (len(todo[k]) - pick[k] > 0, len(todo[k]) / total * n - pick[k])); pick[x] += 1
    for x in ('long', 'short', 'clip', 'xlong'):
        for vid in todo[x][:pick[x]]: print(vid, x, inv[vid]['duration_s'], inv[vid]['res'], inv[vid]['ext'], sep='\t')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if cmd == 'status': write_status()
    elif cmd == 'next': next_batch(int(sys.argv[2]) if len(sys.argv) > 2 else 20)
    else: print(__doc__)
