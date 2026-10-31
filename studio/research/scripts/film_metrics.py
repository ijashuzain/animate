#!/usr/bin/env python3
"""Measure the craft of an animated video from its picture only (no audio): shot rhythm, motion, holds, colour, detail, depth.
Same measurements for our own films and for reference videos studied privately, so the two can be compared.

    python3 film_metrics.py VIDEO.mp4 [VIDEO2.mp4 ...] --out OUTDIR [--sheet] [--exclude ID:a-b[,c-d]] ...

Per video it writes OUTDIR/<name>.json (numbers) and, with --sheet, OUTDIR/<name>-shots.jpg (one small frame per shot,
for private review only: reference frames never go into the repo or into our films). OUTDIR/summary.md compares them.
Requires ffmpeg + numpy. Reads the file locally; no network.

Version 2 (2026-10-31, after the first reference batch):
- streams frames, so hour-long videos fit in memory; file names that start with '-' are safe
- cuts = hard cuts (ffmpeg scene score > 0.32 at full rate) + soft transitions (dissolves, wipes: the colour histogram 0.5 s
  before vs 0.5 s after changes a lot, peaks there, and the picture is steadier on both sides) + dips to dark / flashes to white;
  each cut is labelled hard / soft / dip
- --exclude ID:a-b (seconds, repeatable, comma-separated ranges) drops sponsor segments, end screens, title cards from every
  statistic; shots are clipped at range edges (an edge is not a cut)
- holds: runs of nearly-still in-shot samples; holds longer than 1 s per minute, longest hold, share of time in such holds
- centre/edge sharpness is the median over frames with a floor on the edge term (v1's mean blew up on flat edge bands)

What is measured (frames decoded at 4 fps, 320 px wide):
- shots: cut times and kinds, shot count, cuts per minute, median / p10 / p90 / longest shot
- motion: mean absolute frame difference (0-255) between consecutive samples, inside shots; still share (< 1.5); holds
- colour: mean saturation and value (HSV, 0-1), share of very dark / very bright pixels, colourfulness (Hasler-Suesstrunk),
  number of distinct hues (12-bin histogram bins above 3%)
- detail: edge density (share of pixels with a strong gradient), a proxy for how much drawn structure a frame carries
- depth: luminance spread across the frame's 3 horizontal bands and a sharp-centre vs soft-edge ratio
"""
import argparse, json, os, re, subprocess, sys
import numpy as np

VERSION = 2
W, FPS = 320, 4
HARD_THR, SOFT_THR, STILL = 0.32, 0.30, 1.5
SOFT_HALF = 2          # samples each side of a soft transition (2 = 0.5 s at 4 fps)
MERGE_S = 0.75


def safe(path):
    return os.path.abspath(path)          # never starts with '-', so ffmpeg/ffprobe can't read it as an option


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'json', safe(path)], capture_output=True, text=True, check=True).stdout
    j = json.loads(out); s = j['streams'][0]; n, d = s['r_frame_rate'].split('/')
    return float(j['format']['duration']), int(s['width']), int(s['height']), float(n) / float(d)


def frame_stream(path, w, h, chunk=240):
    hh = int(round(h * W / w / 2) * 2); size = hh * W * 3
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', safe(path), '-an', '-vf', f'fps={FPS},scale={W}:{hh}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    while True:
        buf = p.stdout.read(size * chunk)
        if not buf: break
        k = len(buf) // size
        if k: yield np.frombuffer(buf[:k * size], np.uint8).reshape(k, hh, W, 3)
    p.wait()


def hard_cuts(path, thr=HARD_THR):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', safe(path), '-an', '-vf', f"select='gt(scene,{thr})',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [float(t) for t in re.findall(r'pts_time:([0-9.]+)', log)]


def hsv(rgb):
    x = rgb.astype(np.float32) / 255; mx, mn = x.max(-1), x.min(-1); d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    hdeg = np.where(d == 0, 0, np.where(mx == r, (g - b) / np.maximum(d, 1e-6) % 6, np.where(mx == g, (b - r) / np.maximum(d, 1e-6) + 2, (r - g) / np.maximum(d, 1e-6) + 4))) * 60
    return hdeg, s, mx


def features(F):
    """Per-frame scalars for a chunk of frames (k, h, w, 3); nothing per-pixel is kept."""
    k, hh = F.shape[0], F.shape[1]
    g = F.astype(np.float32).mean(-1)
    H, S, V = hsv(F)
    rg = F[..., 0].astype(np.float32) - F[..., 1]; yb = 0.5 * (F[..., 0].astype(np.float32) + F[..., 1]) - F[..., 2]
    colorful = np.sqrt(rg.std((1, 2)) ** 2 + yb.std((1, 2)) ** 2) + 0.3 * np.sqrt(rg.mean((1, 2)) ** 2 + yb.mean((1, 2)) ** 2)
    hue = np.stack([np.histogram(H[i][S[i] > 0.25], bins=12, range=(0, 360))[0] for i in range(k)])
    q = (F // 64).astype(np.int32); idx = q[..., 0] * 16 + q[..., 1] * 4 + q[..., 2]
    hist = np.stack([np.bincount(idx[i].ravel(), minlength=64) for i in range(k)]).astype(np.float32); hist /= hist.sum(1, keepdims=True)
    gx, gy = np.abs(np.diff(g, axis=2))[:, :-1, :], np.abs(np.diff(g, axis=1))[:, :, :-1]; gm = gx + gy
    third = hh // 3; c0, c1 = hh // 4, W // 4
    return dict(gray=g, luma=g.mean((1, 2)), sat=S.mean((1, 2)), val=V.mean((1, 2)), dark=(V < 0.15).mean((1, 2)), bright=(V > 0.9).mean((1, 2)),
                colorful=colorful, hue=hue, hist=hist, edges=(gm > 40).mean((1, 2)),
                bands=np.stack([g[:, i * third:(i + 1) * third].mean((1, 2)) for i in range(3)], 1),
                sharp_c=gm[:, c0:hh - c0, c1:W - c1].mean((1, 2)),
                sharp_e=np.concatenate([gm[:, :c0].reshape(k, -1), gm[:, hh - c0:].reshape(k, -1)], 1).mean(1))


def parse_ranges(spec):
    out = []
    for part in spec.split(','):
        a, b = part.split('-'); out.append((float(a), float(b)))
    return out


def soft_cuts(hist, diff):
    """Gradual transitions: a big histogram change across +-0.5 s that peaks at i, with steadier picture on both sides."""
    n, k = len(hist), SOFT_HALF; found = []
    if n < 4 * k + 1: return found
    D = np.zeros(n)
    for i in range(k, n - k): D[i] = 0.5 * np.abs(hist[i + k] - hist[i - k]).sum()
    for i in range(2 * k, n - 2 * k):
        if D[i] < SOFT_THR or D[i] < D[max(0, i - 2 * k):i + 2 * k + 1].max(): continue
        before, after = D[i - 2 * k], D[i + 2 * k]
        if before < 0.5 * D[i] and after < 0.5 * D[i]: found.append(i / FPS)
    return found


def measure(path, out, sheet, excl):
    dur, w, h, fps = probe(path)
    acc = {k: [] for k in ('luma', 'sat', 'val', 'dark', 'bright', 'colorful', 'hue', 'hist', 'edges', 'bands', 'sharp_c', 'sharp_e')}
    diff, prev = [], None
    for F in frame_stream(path, w, h):
        f = features(F); g = f.pop('gray')
        if prev is not None: diff.append(np.abs(g[0] - prev).mean())
        diff.extend(np.abs(np.diff(g, axis=0)).mean((1, 2)).tolist()); prev = g[-1]
        for k in acc: acc[k].append(f[k])
    A = {k: np.concatenate(v) for k, v in acc.items()}; n = len(A['luma']); diff = np.array(diff) if diff else np.zeros(1)
    t_of = np.arange(n) / FPS
    inside = lambda t: any(a <= t < b for a, b in excl)
    keep = np.array([not inside(t) for t in t_of]) if excl else np.ones(n, bool)

    # cuts, labelled
    luma = A['luma']
    dips = [i / FPS for i in range(1, n - 1) if (luma[i] < 22 and luma[i] <= luma[i - 1] and luma[i] <= luma[i + 1]) or (luma[i] > 235 and luma[i] >= luma[i - 1] and luma[i] >= luma[i + 1])]
    cand = sorted([(t, 'hard') for t in hard_cuts(path)] + [(t, 'soft') for t in soft_cuts(A['hist'], diff)] + [(t, 'dip') for t in dips])
    merged = []
    for t, kind in cand:
        if merged and t - merged[-1][0] <= MERGE_S:
            if kind == 'hard' and merged[-1][1] != 'hard': merged[-1] = (t, 'hard')   # a hard cut's time is exact
            continue
        merged.append((t, kind))
    cuts = [(t, kd) for t, kd in merged if 0.3 < t < dur - 0.3 and not inside(t)]
    ct = [t for t, _ in cuts]

    # included intervals, then shots = pieces between cuts clipped to them
    edges = sorted(set([0.0, dur] + [x for r in excl for x in r if 0 < x < dur]))
    intervals = [(a, b) for a, b in zip(edges, edges[1:]) if not inside((a + b) / 2) and b - a > 0.3]
    shots = []
    for a, b in intervals:
        pts = [a] + [t for t in ct if a < t < b] + [b]; shots += [y - x for x, y in zip(pts, pts[1:]) if y - x > 0.3]
    shots = np.array(shots) if shots else np.array([dur]); kept_s = sum(b - a for a, b in intervals)

    # motion inside shots, and holds
    cut_idx = {int(round(t * FPS)) for t in ct} | {int(round(t * FPS)) - 1 for t in ct}
    pair_ok = np.array([(i + 1) not in cut_idx and i not in cut_idx and keep[i] and keep[min(i + 1, n - 1)] for i in range(len(diff))])
    inshot = diff[pair_ok] if pair_ok.any() else diff
    still = (diff < STILL) & pair_ok; runs, run = [], 0
    for s in still:
        if s: run += 1
        else:
            if run: runs.append(run / FPS)
            run = 0
    if run: runs.append(run / FPS)
    long_holds = [r for r in runs if r > 1.0]

    K = keep; hue = A['hue'][K].sum(0); hue = hue / max(1, hue.sum())
    ratio = A['sharp_c'][K] / np.maximum(A['sharp_e'][K], 2.0)
    r = lambda v: round(float(v), 3)
    res = {
        'file': os.path.basename(path), 'metrics_version': VERSION, 'duration_s': r(dur), 'measured_s': r(kept_s), 'source': f'{w}x{h} @ {fps:.2f} fps', 'samples': int(K.sum()),
        'excluded_s': [[r(a), r(b)] for a, b in excl],
        'params': {'fps': FPS, 'width': W, 'hard_thr': HARD_THR, 'soft_thr': SOFT_THR, 'soft_half_s': SOFT_HALF / FPS, 'merge_s': MERGE_S, 'still': STILL},
        'shots': {'count': len(shots), 'cuts_per_min': r(len(ct) / max(kept_s, 1e-6) * 60), 'median_s': r(np.median(shots)), 'p10_s': r(np.percentile(shots, 10)), 'p90_s': r(np.percentile(shots, 90)), 'longest_s': r(shots.max()),
                  'kinds': {kd: sum(1 for _, x in cuts if x == kd) for kd in ('hard', 'soft', 'dip')}},
        'motion': {'mean': r(diff[K[:len(diff)]].mean() if len(diff) else 0), 'in_shot_mean': r(inshot.mean() if len(inshot) else 0), 'still_share': r((inshot < STILL).mean() if len(inshot) else 0)},
        'holds': {'over_1s_per_min': r(len(long_holds) / max(kept_s, 1e-6) * 60), 'longest_s': r(max(runs) if runs else 0), 'share_in_holds_over_1s': r(sum(long_holds) / max(kept_s, 1e-6))},
        'colour': {'saturation': r(A['sat'][K].mean()), 'value': r(A['val'][K].mean()), 'dark_share': r(A['dark'][K].mean()), 'bright_share': r(A['bright'][K].mean()), 'colourfulness': r(A['colorful'][K].mean()), 'hues_used_of_12': int((hue > 0.03).sum())},
        'detail': {'edge_density': r(A['edges'][K].mean()), 'edge_density_p90': r(np.percentile(A['edges'][K], 90))},
        'depth': {'band_luma_spread': r(np.abs(A['bands'][K, 0] - A['bands'][K, 2]).mean() / 255), 'centre_vs_edge_sharpness': r(np.median(ratio))},
        'cut_times_s': [r(t) for t in ct], 'cut_kinds': [kd for _, kd in cuts],
    }
    name = os.path.splitext(os.path.basename(path))[0]
    json.dump(res, open(os.path.join(out, name + '.json'), 'w'), indent=1)
    if sheet: contact_sheet(path, w, h, ct, dur, excl, os.path.join(out, name + '-shots.jpg'))
    return res


def contact_sheet(path, w, h, ct, dur, excl, dest, limit=60):
    """One mid-shot frame per shot (first `limit` shots), 6 per row; a second decode pass, nothing held in memory."""
    pts = [0.0] + ct + [dur]; mids = [(a + b) / 2 for a, b in zip(pts, pts[1:]) if not any(x <= (a + b) / 2 < y for x, y in excl)][:limit]
    idx = sorted({min(int(m * FPS), int(dur * FPS) - 1) for m in mids})
    if not idx: return
    hh = int(round(h * W / w / 2) * 2); rows = (len(idx) + 5) // 6
    sel = '+'.join(f'eq(n\\,{i})' for i in idx)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', safe(path), '-an', '-vf', f"fps={FPS},scale={W}:{hh},select='{sel}',tile=6x{rows}", '-frames:v', '1', '-q:v', '5', dest], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('videos', nargs='+'); ap.add_argument('--out', required=True); ap.add_argument('--sheet', action='store_true')
    ap.add_argument('--exclude', action='append', default=[], help='ID:a-b[,c-d] seconds to leave out (sponsor, end screen, title cards); repeatable')
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True); rows = []
    ex = {}
    for e in a.exclude:
        vid, spec = e.split(':', 1); ex.setdefault(vid, []).extend(parse_ranges(spec))
    for v in a.videos:
        name = os.path.splitext(os.path.basename(v))[0]
        print('measuring', v, file=sys.stderr); rows.append(measure(v, a.out, a.sheet, sorted(ex.get(name, []))))
    keys = [('duration_s', lambda x: x['duration_s']), ('measured_s', lambda x: x['measured_s']), ('cuts/min', lambda x: x['shots']['cuts_per_min']),
            ('cuts hard/soft/dip', lambda x: '/'.join(str(x['shots']['kinds'][k]) for k in ('hard', 'soft', 'dip'))),
            ('median shot s', lambda x: x['shots']['median_s']), ('longest shot s', lambda x: x['shots']['longest_s']),
            ('motion', lambda x: x['motion']['in_shot_mean']), ('still share', lambda x: x['motion']['still_share']),
            ('holds >1s /min', lambda x: x['holds']['over_1s_per_min']), ('longest hold s', lambda x: x['holds']['longest_s']),
            ('saturation', lambda x: x['colour']['saturation']), ('value', lambda x: x['colour']['value']),
            ('colourfulness', lambda x: x['colour']['colourfulness']), ('hues /12', lambda x: x['colour']['hues_used_of_12']), ('edge density', lambda x: x['detail']['edge_density']),
            ('band spread', lambda x: x['depth']['band_luma_spread']), ('centre/edge sharp', lambda x: x['depth']['centre_vs_edge_sharpness'])]
    md = [f'film_metrics v{VERSION}', '', '| metric | ' + ' | '.join(r['file'] for r in rows) + ' |', '|---|' + '---|' * len(rows)]
    for k, f in keys: md.append(f'| {k} | ' + ' | '.join(str(f(r)) for r in rows) + ' |')
    open(os.path.join(a.out, 'summary.md'), 'w').write('\n'.join(md) + '\n'); print('\n'.join(md))


if __name__ == '__main__':
    main()
