#!/usr/bin/env python3
"""The engine's scoreboard: reference target ranges vs our films, from film_metrics.py JSON files (numbers only).

    python3 targets.py --ref studio/research/data/metrics/reference --ours studio/research/data/metrics/ours \
        --json studio/research/knowledge/targets.json --md studio/research/knowledge/scoreboard.md

Reference videos are split by format (landscape = long, vertical = short). For each metric the target is the reference
p25-p75 range (the middle half) with n; each of our films is marked below / in / above. Only v2 metrics are used, and a
reference file can opt out of the cut-based metrics with "rhythm_valid": false (set when its cut audit failed).
"""
import argparse, glob, json, os
import numpy as np

METRICS = [  # (key, path, label, higher-is-what) ; the label is what the engine would tune
    ('cuts_per_min', ('shots', 'cuts_per_min'), 'cuts per minute', 'rhythm'),
    ('median_shot_s', ('shots', 'median_s'), 'median shot (s)', 'rhythm'),
    ('in_shot_motion', ('motion', 'in_shot_mean'), 'motion inside shots', 'motion'),
    ('still_share', ('motion', 'still_share'), 'still share', 'motion'),
    ('holds_per_min', ('holds', 'over_1s_per_min'), 'holds > 1 s per minute', 'motion'),
    ('longest_hold_s', ('holds', 'longest_s'), 'longest hold (s)', 'motion'),
    ('saturation', ('colour', 'saturation'), 'saturation', 'colour'),
    ('value', ('colour', 'value'), 'value (brightness)', 'colour'),
    ('colourfulness', ('colour', 'colourfulness'), 'colourfulness', 'colour'),
    ('hues', ('colour', 'hues_used_of_12'), 'hues used of 12', 'colour'),
    ('edge_density', ('detail', 'edge_density'), 'edge density', 'detail'),
    ('band_spread', ('depth', 'band_luma_spread'), 'top-bottom light spread', 'depth'),
    ('centre_edge', ('depth', 'centre_vs_edge_sharpness'), 'centre/edge sharpness', 'depth'),
]
RHYTHM = {'cuts_per_min', 'median_shot_s'}


def load(d):
    out = []
    for f in sorted(glob.glob(os.path.join(d, '**', '*.json'), recursive=True)):
        j = json.load(open(f))
        if j.get('metrics_version', 1) >= 2: out.append(j)
    return out


def get(j, path):
    v = j
    for k in path: v = v[k]
    return float(v)


def fmt(j):
    w, h = map(int, j['source'].split(' ')[0].split('x')); return 'short' if h > w else 'long'


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--ref', required=True); ap.add_argument('--ours', required=True)
    ap.add_argument('--json', required=True); ap.add_argument('--md', required=True); a = ap.parse_args()
    ref, ours = load(a.ref), load(a.ours)
    targets = {}
    for group in ('long', 'short'):
        R = [j for j in ref if fmt(j) == group]; targets[group] = {}
        for key, path, label, area in METRICS:
            vals = [get(j, path) for j in R if not (key in RHYTHM and j.get('rhythm_valid') is False)]
            if not vals: continue
            targets[group][key] = {'label': label, 'area': area, 'n': len(vals), 'p25': round(float(np.percentile(vals, 25)), 3),
                                   'median': round(float(np.median(vals)), 3), 'p75': round(float(np.percentile(vals, 75)), 3),
                                   'min': round(min(vals), 3), 'max': round(max(vals), 3)}
    os.makedirs(os.path.dirname(a.json), exist_ok=True)
    json.dump({'source': 'film_metrics v2 on the reference batches; ranges are p25-p75 of the reference videos', 'n_reference': len(ref), 'targets': targets}, open(a.json, 'w'), indent=1)

    T = targets['long']; names = [j['file'].replace('-probe.mp4', '') for j in ours]
    md = ['# Scoreboard: our films vs the reference (long-form targets)', '',
          f'Reference long-form videos measured: {sum(1 for j in ref if fmt(j) == "long")}; Shorts: {sum(1 for j in ref if fmt(j) == "short")}. '
          'Target = middle half (p25-p75) of the reference. ▼ below, ✓ inside, ▲ above. Numbers, not taste: the user\'s verdict overrules them.', '',
          '| metric | target (n) | ' + ' | '.join(names) + ' |', '|---|---|' + '---|' * len(names)]
    for key, path, label, area in METRICS:
        if key not in T: continue
        t = T[key]; cells = []
        for j in ours:
            v = get(j, path); mark = '▼' if v < t['p25'] else '▲' if v > t['p75'] else '✓'; cells.append(f'{round(v, 3)} {mark}')
        md.append(f"| {label} | {t['p25']}–{t['p75']} ({t['n']}) | " + ' | '.join(cells) + ' |')
    open(a.md, 'w').write('\n'.join(md) + '\n'); print('\n'.join(md))


if __name__ == '__main__':
    main()
