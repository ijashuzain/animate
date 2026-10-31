"""film_metrics.py v2 against a synthetic video with known transitions (no reference media needed).

    python3 studio/research/tests/test_film_metrics.py      (or: python3 -m pytest studio/research/tests)

Scenes (6 s each, 640x360): flat field + moving shape, test pattern, bars, a continuous zoom (mandelbrot),
flat field + moving shape, animated gradients. Transitions: hard cut, dissolve 1 s, wipe 0.75 s, fade through black 1 s,
circle-open 1 s. The zoom and the gradients change all the time and must not produce cuts.
"""
import json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, '..', 'scripts', 'film_metrics.py')
TRUTH = [6.0, 11.5, 16.375, 21.75, 26.75]
TOL = 0.75


def make_video(path):
    S = 's=640x360:r=30:d=6'
    src = [f"color=c=0x2b1b5a:{S},drawbox=x='40+t*60':y=120:w=140:h=140:color=0xff8a3d:t=fill",
           f'testsrc2={S}', f'smptehdbars={S}', 'mandelbrot=s=640x360:r=30,trim=duration=6',
           f"color=c=0x0f6b6b:{S},drawbox=x=300:y='40+t*30':w=90:h=90:color=0xffd23d:t=fill", f'gradients={S}:speed=0.05']
    args = ['ffmpeg', '-v', 'error', '-y']
    for s in src: args += ['-f', 'lavfi', '-i', s]
    fc = ('[0][1]concat=n=2:v=1:a=0,format=yuv420p,settb=1/30[a];[2]format=yuv420p,settb=1/30[c];[3]format=yuv420p,settb=1/30[d];'
          '[4]format=yuv420p,settb=1/30[e];[5]format=yuv420p,settb=1/30[f];'
          '[a][c]xfade=transition=dissolve:duration=1:offset=11[x1];[x1][d]xfade=transition=wipeleft:duration=0.75:offset=16[x2];'
          '[x2][e]xfade=transition=fadeblack:duration=1:offset=21.25[x3];[x3][f]xfade=transition=circleopen:duration=1:offset=26.25[v]')
    subprocess.run(args + ['-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-crf', '18', path], check=True)


def run(tmp, extra=()):
    vid = os.path.join(tmp, '-synthetic.mp4')            # leading '-' on purpose: v1 broke on such names
    if not os.path.exists(vid): make_video(vid)
    out = os.path.join(tmp, 'out'); subprocess.run([sys.executable, '-I', SCRIPT, vid, '--out', out, *extra], check=True, capture_output=True)
    return json.load(open(os.path.join(out, '-synthetic.json')))


def score(cuts):
    hit = [any(abs(c - t) <= TOL for c in cuts) for t in TRUTH]
    false = [c for c in cuts if not any(abs(c - t) <= TOL for t in TRUTH)]
    return sum(hit), false


def test_transitions_found_and_no_false_cuts():
    with tempfile.TemporaryDirectory() as tmp:
        r = run(tmp); hits, false = score(r['cut_times_s'])
        print('cuts', list(zip(r['cut_times_s'], r['cut_kinds'])), 'hits', hits, '/', len(TRUTH), 'false', false)
        assert hits == len(TRUTH), 'missed a transition'
        assert len(false) == 0, 'false cuts inside continuous motion'
        assert r['shots']['count'] == 6


def test_exclude_drops_ranges():
    with tempfile.TemporaryDirectory() as tmp:
        r = run(tmp, ['--exclude=-synthetic:24-33'])          # '=' form: the ID starts with '-'
        assert all(t < 24 for t in r['cut_times_s']) and r['measured_s'] < 25 and r['shots']['count'] == 5


if __name__ == '__main__':
    test_transitions_found_and_no_false_cuts(); test_exclude_drops_ranges(); print('ok')
