#!/usr/bin/env python3
"""Measure the craft of an animated video from its picture only (no audio): shot rhythm, motion, colour, detail, depth.
Same measurements for our own films and for reference videos studied privately, so the two can be compared.

    python3 film_metrics.py VIDEO.mp4 [VIDEO2.mp4 ...] --out OUTDIR [--sheet]

Per video it writes OUTDIR/<name>.json (numbers) and, with --sheet, OUTDIR/<name>-shots.jpg (one small frame per shot,
for private review only: reference frames never go into the repo or into our films). OUTDIR/summary.md compares them.
Requires ffmpeg + numpy. Reads the file locally; no network.

What is measured (all from frames decoded at 4 fps, 320 px wide, plus ffmpeg's scene-change score at full rate):
- shots: cut times (scene score > 0.32, plus dips to dark and flashes to white), shot count, cuts per minute, median / p10 / p90 shot length
- motion: mean absolute frame difference (0-255) between consecutive 4 fps samples; share of time that is nearly still
  (< 1.5), the 'never stops' check; motion inside shots (cuts excluded)
- colour: mean saturation and value (HSV, 0-1), share of very dark and very bright pixels, colourfulness (Hasler-Suesstrunk),
  number of distinct hues (12-bin histogram bins above 3%)
- detail: edge density (share of pixels with a strong gradient), a proxy for how much drawn structure a frame carries
- depth: luminance spread across the frame's 3 horizontal bands and a blur-contrast ratio (sharp centre vs soft edges)
"""
import argparse, json, os, re, subprocess, sys
import numpy as np

W, FPS = 320, 4


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'json', path], capture_output=True, text=True, check=True).stdout
    j = json.loads(out); s = j['streams'][0]; n, d = s['r_frame_rate'].split('/')
    return float(j['format']['duration']), int(s['width']), int(s['height']), float(n) / float(d)


def frames(path, w, h):
    hh = int(round(h * W / w / 2) * 2)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-an', '-vf', f'fps={FPS},scale={W}:{hh}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, hh, W, 3), hh


def cuts(path, thr=0.32):
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-an', '-vf', f"select='gt(scene,{thr})',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [float(t) for t in re.findall(r'pts_time:([0-9.]+)', log)]


def hsv(rgb):
    x = rgb.astype(np.float32) / 255; mx, mn = x.max(-1), x.min(-1); d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    hdeg = np.where(d == 0, 0, np.where(mx == r, (g - b) / np.maximum(d, 1e-6) % 6, np.where(mx == g, (b - r) / np.maximum(d, 1e-6) + 2, (r - g) / np.maximum(d, 1e-6) + 4))) * 60
    return hdeg, s, mx


def measure(path, out, sheet):
    dur, w, h, fps = probe(path); F, hh = frames(path, w, h); n = len(F)
    g = F.astype(np.float32).mean(-1)
    # cuts: hard cuts (ffmpeg scene score) + dips to dark / flashes to white (fades, the dip-to-dark transition)
    luma = g.mean((1, 2)); dips = [i / FPS for i in range(1, n - 1) if (luma[i] < 22 and luma[i] <= luma[i - 1] and luma[i] <= luma[i + 1]) or (luma[i] > 235 and luma[i] >= luma[i - 1] and luma[i] >= luma[i + 1])]
    ct = sorted(cuts(path) + dips); merged = []
    for t in ct:
        if not merged or t - merged[-1] > 0.75: merged.append(t)
    ct = [t for t in merged if 0.3 < t < dur - 0.3]; shots = np.diff([0.0] + ct + [dur])
    diff = np.abs(np.diff(g, axis=0)).mean((1, 2)) if n > 1 else np.zeros(1)
    cut_idx = {int(round(t * FPS)) for t in ct} | {int(round(t * FPS)) - 1 for t in ct}
    inshot = np.array([d for i, d in enumerate(diff) if i + 1 not in cut_idx and i not in cut_idx]) if n > 1 else diff
    H, S, V = hsv(F)
    rg = F[..., 0].astype(np.float32) - F[..., 1]; yb = 0.5 * (F[..., 0].astype(np.float32) + F[..., 1]) - F[..., 2]
    colorful = (np.sqrt(rg.std((1, 2)) ** 2 + yb.std((1, 2)) ** 2) + 0.3 * np.sqrt(rg.mean((1, 2)) ** 2 + yb.mean((1, 2)) ** 2))
    hue_hist = np.histogram(H[S > 0.25], bins=12, range=(0, 360))[0]; hue_hist = hue_hist / max(1, hue_hist.sum())
    gx, gy = np.abs(np.diff(g, axis=2))[:, :-1, :], np.abs(np.diff(g, axis=1))[:, :, :-1]
    edges = ((gx + gy) > 40).mean((1, 2))
    third = hh // 3; bands = np.stack([g[:, i * third:(i + 1) * third].mean((1, 2)) for i in range(3)], 1)
    c0, c1 = hh // 4, W // 4
    sharp_c = (gx + gy)[:, c0:hh - c0, c1:W - c1].mean((1, 2)); sharp_e = np.concatenate([(gx + gy)[:, :c0].reshape(n, -1), (gx + gy)[:, hh - c0:].reshape(n, -1)], 1).mean(1)
    r = lambda v: round(float(v), 3)
    res = {
        'file': os.path.basename(path), 'duration_s': r(dur), 'source': f'{w}x{h} @ {fps:.2f} fps', 'samples': n,
        'shots': {'count': len(shots), 'cuts_per_min': r(len(ct) / dur * 60), 'median_s': r(np.median(shots)), 'p10_s': r(np.percentile(shots, 10)), 'p90_s': r(np.percentile(shots, 90)), 'longest_s': r(shots.max())},
        'motion': {'mean': r(diff.mean()), 'in_shot_mean': r(inshot.mean() if len(inshot) else 0), 'still_share': r((inshot < 1.5).mean() if len(inshot) else 0)},
        'colour': {'saturation': r(S.mean()), 'value': r(V.mean()), 'dark_share': r((V < 0.15).mean()), 'bright_share': r((V > 0.9).mean()), 'colourfulness': r(colorful.mean()), 'hues_used_of_12': int((hue_hist > 0.03).sum())},
        'detail': {'edge_density': r(edges.mean()), 'edge_density_p90': r(np.percentile(edges, 90))},
        'depth': {'band_luma_spread': r(np.abs(bands[:, 0] - bands[:, 2]).mean() / 255), 'centre_vs_edge_sharpness': r((sharp_c / np.maximum(sharp_e, 1e-3)).mean())},
        'cut_times_s': [r(t) for t in ct],
    }
    name = os.path.splitext(os.path.basename(path))[0]
    json.dump(res, open(os.path.join(out, name + '.json'), 'w'), indent=1)
    if sheet:
        mids = [min(n - 1, int(((a + b) / 2) * FPS)) for a, b in zip([0.0] + ct, ct + [dur])][:60]
        tiles = [F[i] for i in mids]; cols = 6; rows = (len(tiles) + cols - 1) // cols
        canvas = np.zeros((rows * hh, cols * W, 3), np.uint8)
        for k, t in enumerate(tiles): canvas[(k // cols) * hh:(k // cols + 1) * hh, (k % cols) * W:(k % cols + 1) * W] = t
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{canvas.shape[1]}x{canvas.shape[0]}', '-i', '-', '-q:v', '5', os.path.join(out, name + '-shots.jpg')], input=canvas.tobytes(), check=True)
    return res


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('videos', nargs='+'); ap.add_argument('--out', required=True); ap.add_argument('--sheet', action='store_true')
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True); rows = []
    for v in a.videos:
        print('measuring', v, file=sys.stderr); rows.append(measure(v, a.out, a.sheet))
    keys = [('duration_s', lambda x: x['duration_s']), ('cuts/min', lambda x: x['shots']['cuts_per_min']), ('median shot s', lambda x: x['shots']['median_s']), ('longest shot s', lambda x: x['shots']['longest_s']),
            ('motion', lambda x: x['motion']['in_shot_mean']), ('still share', lambda x: x['motion']['still_share']), ('saturation', lambda x: x['colour']['saturation']), ('value', lambda x: x['colour']['value']),
            ('colourfulness', lambda x: x['colour']['colourfulness']), ('hues /12', lambda x: x['colour']['hues_used_of_12']), ('edge density', lambda x: x['detail']['edge_density']), ('centre/edge sharp', lambda x: x['depth']['centre_vs_edge_sharpness'])]
    md = ['| metric | ' + ' | '.join(r['file'] for r in rows) + ' |', '|---|' + '---|' * len(rows)]
    for k, f in keys: md.append(f'| {k} | ' + ' | '.join(str(f(r)) for r in rows) + ' |')
    open(os.path.join(a.out, 'summary.md'), 'w').write('\n'.join(md) + '\n'); print('\n'.join(md))


if __name__ == '__main__':
    main()
