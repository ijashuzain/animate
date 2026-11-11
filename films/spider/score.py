"""How a Spider Builds Its Web in One Night: the score (lemo-opuscar sampler: VCSL + VSCO 2 CE, CC0; pluck.py models).
Cue map: TREATMENT.md section 6. A fingerpicked nylon-guitar theme at dusk; vibraphone and pizzicato for the silk; a
kalimba ostinato for the build with one rising harp pluck per spoke and a marimba for the spiral; bowed vibraphone at
night, SILENCE before the moth (171.0-172.6), the hit; warm strings and birds at dawn, SILENCE before the eating
(199.4-200.4), then the guitar theme alone (J-cut into the eating). Ambience beds + one sound per action.
    sh tools2/lemo/fetch.sh vcsl vsco2ce      (once)
    python3 films/spider/score.py  ->  audio/music.wav, audio/sfx.wav (48 kHz)"""
import os, sys, json, subprocess
import numpy as np, soundfile as sf, soxr
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
import synth as Y
from lemo import sampler as S, pluck as PL
from lemo.sfx import SR, add, bp, lp

here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
D = 220.0
tp = os.path.join(here, 'src', 'timing.js')
if os.path.exists(tp):
    TM = json.loads(open(tp).read().split('const TIMING = ')[1].strip().rstrip(';')); V, PLN, D = TM['VOICE'], TM['PLAN'], TM['D']
    def F(t):
        for i in range(len(PLN) - 1):
            if t < PLN[i + 1] or i == len(PLN) - 2: return V[i] + (V[i + 1] - V[i]) * (t - PLN[i]) / (PLN[i + 1] - PLN[i])
else:
    F = lambda t: t
S.seed(11)
N = int((D + 4) * SR)
EV, POST = [], []
def ev(t, inst, pitch, dur, vel=0.6, pan=0.0, gain=None):
    EV.append((max(0.0, F(t)), inst, pitch, dur, vel, pan) + ((gain,) if gain else ()))
def raw(t, x, g=1.0, pan=0.0, post=False): (POST if post else EV_RAW).append((t, x, g, pan))
EV_RAW = []
down = lambda n, k=1: n[:-1] + str(int(n[-1]) - k)

# ---------- the guitar theme (D - Bm - G - A), fingerpicked 8ths at 72 bpm ----------
CH = [('D3', ['A3', 'D4', 'F#4']), ('B2', ['F#3', 'B3', 'D4']), ('G2', ['D3', 'G3', 'B3']), ('A2', ['E3', 'A3', 'C#4'])]
MEL = ['F#4', 'A4', 'D5', 'C#5', 'B4', 'D5', 'A4', 'F#4', 'G4', 'B4', 'A4', 'E4']
def guitar(t0, t1, vel=0.42, melody=True, b=60 / 72):
    k = 0; t = t0
    while t < t1 - 0.2:
        bass, up = CH[(k // 8) % 4]
        if k % 8 == 0: raw(t, PL.pluck('nylon_guitar', bass, 2.6, vel + 0.08), 0.9, -0.15)
        if k % 8: raw(t, PL.pluck('nylon_guitar', up[k % 3], 1.4, vel), 0.7, 0.2 * ((-1) ** k))
        if melody and k % 4 == 2 and t > t0 + 4: raw(t, PL.pluck('nylon_guitar', MEL[(k // 4) % len(MEL)], 1.8, vel + 0.06), 0.8, 0.0)
        k += 1; t += b / 2
guitar(0.6, 32.0)
# low cello warmth under the guitar (the roots, an octave down, one per chord)
def cello_roots(t0, t1, b=60 / 72):
    k = 0
    while t0 + k * 4 * b < t1 - 1: ev(t0 + k * 4 * b, 'cellos', down(CH[k % 4][0], 1) if CH[k % 4][0][-1] != '2' else CH[k % 4][0], 4 * b + 0.3, 0.34, 0.0, 1.6); k += 1
cello_roots(0.6, 32.0)
for i, n in enumerate(['A5', 'F#5', 'D5', 'E5', 'F#5', 'A5', 'B5', 'A5']): ev(10.5 + i * 2.5, 'flute', n, 2.3, 0.32, 0.25)
ev(24.0, 'glockenspiel', 'A6', 1.5, 0.45, 0.3)                                             # the bridge snags
for k in range(6): ev(0.6 + k * 5.0, 'harp', ['D3', 'B2', 'G2', 'A2', 'D3', 'B2'][k], 3.0, 0.3, -0.3)

# ---------- silk (32-56): soft vibraphone chords, violin pizzicato; a low cello under "stronger than steel" ----------
SILK = [(32, ['D4', 'F#4', 'A4']), (38, ['B3', 'D4', 'F#4']), (44, ['G3', 'B3', 'D4']), (50, ['A3', 'C#4', 'E4'])]
for t0, ch in SILK:
    for j, n in enumerate(ch): ev(t0 + j * 0.12, 'vibraphone', n, 5.5, 0.38, (j - 1) * 0.3)
    for k in range(8): ev(t0 + 0.4 + k * 0.75, 'violins_pizz', ch[k % 3].replace('3', '4') if k % 2 else ch[k % 3], 0.4, 0.28, 0.3 * (-1) ** k)
ev(46.0, 'cellos', 'D2', 6.0, 0.36, 0.0)
for t0, n in [(32, 'D2'), (38, 'B1'), (50, 'A1')]: ev(t0, 'cellos', n, 5.8, 0.32, 0.0, 1.5)   # warmth under the silk

# ---------- the build (56-146, 88 bpm): kalimba ostinato; a rising harp pluck per spoke; marimba for the spiral ----------
b = 60 / 88
PENT = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'B5']
for k in range(int((146 - 56) / (b / 2))):
    t = 56 + k * b / 2
    if 146 - t > 0.2: raw(t, PL.pluck('kalimba', ['D4', 'A4', 'F#4', 'A4', 'E4', 'A4', 'F#4', 'B4'][k % 8], 0.8, 0.3), 0.32, 0.3 * (-1) ** k)
for k in range(30): ev(85 + 14 * k / 30, 'harp', PENT[k % 10].replace('4', str(4 + k // 10)).replace('5', str(5 + k // 10)) if k < 20 else PENT[k % 10], 1.6, 0.45, -0.4 + 0.8 * k / 29)   # one per spoke
for k in range(int((145 - 127) / (b / 2))): t = 127 + k * b / 2; ev(t, 'marimba', ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4'][k % 6], 0.5, 0.33, -0.2)
for t0, ch in [(56, 'D3'), (70, 'B2'), (84, 'G2'), (100, 'A2'), (114, 'D3'), (126, 'B2')]: ev(t0, 'cellos', ch, 12.5, 0.24, 0.0)

# ---------- the question (146-160): vibraphone + flute ----------
for j, n in enumerate(['G3', 'B3', 'D4', 'F#4']): ev(146.2 + j * 0.15, 'vibraphone', n, 6.5, 0.36, (j - 1.5) * 0.25)
for j, n in enumerate(['A3', 'C#4', 'E4', 'G4']): ev(153.2 + j * 0.15, 'vibraphone', n, 6.5, 0.36, (j - 1.5) * 0.25)
for i, n in enumerate(['B5', 'A5', 'F#5', 'E5', 'D5']): ev(147 + i * 2.6, 'flute', n, 2.4, 0.3, 0.25)

# ---------- night (160-171): bowed vibraphone, fading into SILENCE 171.0-172.6; then the hit and the struggle ----------
for j, n in enumerate(['D4', 'A4', 'E5']): ev(160 + j * 0.4, 'vibraphone_bowed', n, 10.0, 0.32, (j - 1) * 0.3)
HIT = 172.6
POST += [(HIT, 'frame_drum', 'large', None, 0.7, 0.0), (HIT, 'timpani', 'drum1', None, 0.5, 0.0)]
for j, n in enumerate(['A5', 'G5', 'E5', 'D5', 'C5', 'A4']): POST.append((HIT + 0.02 + j * 0.035, 'harp', n, 2.0, 0.45, 0.3))
for n, v, pn in [('A3', 0.3, -0.25), ('E4', 0.28, 0.25), ('C5', 0.26, 0.0)]: POST.append((HIT + 0.1, 'violins_trem', n, 12.8, v, pn))
POST.append((HIT + 0.05, 'vibraphone_bowed', 'E6', 4.0, 0.35, 0.2))                       # the web rings
POST.append((HIT + 0.05, 'vibraphone_bowed', 'B5', 4.0, 0.3, -0.2))

# ---------- dawn (186-199.2): warm strings, harp, a glockenspiel shower for the dew; SILENCE 199.4-200.4 ----------
for n, inst, v, pn in [('D3', 'cellos', 0.34, -0.2), ('A3', 'violas', 0.3, 0.1), ('F#4', 'violins', 0.3, 0.25), ('D5', 'violins', 0.28, -0.25)]: ev(186.0, inst, n, 12.6, v, pn, 0.3)   # strings run hot: gain 0.3
for n, inst, v, pn in [('G2', 'cellos', 0.3, -0.2), ('D3', 'violas', 0.28, 0.1), ('B4', 'violins', 0.28, 0.25)]: ev(192.5, inst, n, 6.4, v, pn, 0.3)
for j in range(14): ev(186.5 + j * 0.22, 'glockenspiel', ['A6', 'F#6', 'D7', 'B6', 'E7', 'A6', 'F#7'][j % 7], 1.4, 0.3 + 0.02 * (j % 3), 0.5 * ((-1) ** j))
for j, n in enumerate(['D3', 'A3', 'D4', 'F#4', 'A4', 'D5']): ev(186.2 + j * 0.08, 'harp', n, 3.0, 0.36, 0.25)
# the guitar theme returns alone after the silence (it leads into the eating at 201: a J-cut), and closes
TURN = 200.4
guitar(TURN, 218.5, vel=0.4, melody=True)
cello_roots(TURN, 218.5)
POST.append((219.0, 'harp', 'D5', 3.0, 0.32, 0.0))

# ---------- render, silences ----------
mus = S.render(EV, dur=N / SR, master=False)[:N]; mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))
for t, x, g, pn in EV_RAW: add(mus, x, F(t), g, pn)
tt = np.arange(N) / SR
def hole(a, b, fade=0.8, floor=0.0):
    fa, fb = F(a), F(b); g = np.ones(N); m = (tt > fa - fade) & (tt < fb); g[m] = np.clip((fa - tt[m]) / fade, floor, 1); g[(tt >= fa) & (tt < fb)] = floor; return g
gate = hole(171.0, HIT) * hole(199.4, TURN)
mus *= gate[:, None]
for e in POST:
    x = S.hit(e[1], e[2], e[4]) if e[3] is None else S.note(e[1], e[2], e[3], e[4]); add(mus, x, F(e[0]), 1.0, e[5])
vp = os.path.join(here, 'audio', 'voice-aligned.wav')
if os.path.exists(vp):
    rawv = subprocess.run(['ffmpeg', '-v', 'error', '-i', vp, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    vx = np.abs(np.frombuffer(rawv, dtype=np.int16).astype(np.float32) / 32768); win = int(0.25 * SR); env = np.convolve(vx, np.ones(win) / win, mode='same'); env = np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)
    env = np.convolve(env, np.ones(int(0.4 * SR)) / int(0.4 * SR), mode='same'); env = np.pad(env, (0, max(0, N - len(env))))[:N]; mus *= (1 - 0.6 * np.clip(env * 1.3, 0, 1))[:, None]
mus = S.room(mus, size=0.55, mix=0.22)

# ---------- effects: beds (dusk garden, crickets, dawn birds) and one sound per action ----------
fx = np.zeros((N, 2), np.float32)
rs = lambda x: soxr.resample(np.asarray(x, np.float32), Y.SR, SR)
def fxa(x, t, g, pan=0.0, resample=True): add(fx, rs(x) if resample else np.asarray(x, np.float32), F(t), g, pan)
def bed(t0, t1, x, g, fade=1.2):
    a, b2 = int(F(t0) * SR), int(F(t1) * SR); n = b2 - a; y = np.resize(x, n).astype(np.float32); f = min(n // 3, int(fade * SR)); e = np.ones(n); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f); fx[a:b2] += (y * e * g)[:, None]
rng = np.random.default_rng(5)
def chirps(n, f0, f1, d0, d1, sweep, dur=8):
    x = np.zeros(SR * dur)
    for k in range(n):
        t0 = rng.uniform(0, dur - 0.3); d = rng.uniform(d0, d1); tc = np.arange(int(d * SR)) / SR; f = rng.uniform(f0, f1)
        x[int(t0 * SR):int(t0 * SR) + len(tc)] += np.sin(2 * np.pi * (f * tc + rng.uniform(-sweep, sweep) * tc ** 2)) * np.hanning(len(tc)) * 0.3
    return x
room = lp(rng.standard_normal(SR * 8), 300) * 0.4
bed(0, 150, room + chirps(6, 2200, 3600, 0.1, 0.22, 4000), 0.06)                          # a garden at dusk, a far blackbird
tc = np.arange(SR * 4) / SR; cricket = np.zeros(SR * 4)
for k in range(16): s0 = int((k * 0.25) * SR); cricket[s0:s0 + int(0.12 * SR)] += np.sin(2 * np.pi * 4400 * tc[:int(0.12 * SR)]) * (np.sin(2 * np.pi * 30 * tc[:int(0.12 * SR)]) > 0) * 0.2
bed(146, 170.6, cricket + room[:SR * 4] * 0.5, 0.05); bed(172.6, 188, cricket + room[:SR * 4] * 0.5, 0.05)  # crickets (out for the silence)
bed(186, 220, room + chirps(16, 2600, 4400, 0.06, 0.18, 6000), 0.07)                     # dawn birds
# painting-in: a paper brush rustle per twig and leaf
brush = lambda d: bp(rng.standard_normal(int(d * SR)), 900, 5000) * np.hanning(int(d * SR)) * 0.4
for i in range(5): fxa(brush(1.4), 0.4 + i * 0.5, 0.18, -0.4 + 0.2 * i, resample=False)
for i in range(10): fxa(brush(0.6), 2.4 + i * 0.25, 0.1, 0.3 * (-1) ** i, resample=False)
# pencil scratch for every note as it writes itself
scratch = lambda d: bp(rng.standard_normal(int(d * SR)), 2500, 7000) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 2 * np.pi * 14)) * np.hanning(int(d * SR)) * 0.25
for t in [8.5, 16, 25.5, 34.5, 36, 38, 45, 47, 50.5, 66, 74, 85.3, 104.5, 116.5, 130, 148, 150, 162.5, 188.5, 202.5]: fxa(scratch(0.9), t, 0.12, 0.3, resample=False)
fxa(Y.sfx_wind(11.5), 12.5, 0.12, 0.3)                                                   # the breeze carries the thread
fxa(Y.sfx_tick(3200), 24.0, 0.15, 0.4)                                                    # the snag
for i in range(12): fxa(Y.sfx_tick(2600 + (i % 3) * 200), 26 + i * 0.45, 0.04, 0.2)      # tiny feet on silk
for k in range(30): fxa(Y.sfx_tick(1800 + k * 40), 85 + 14 * k / 30, 0.03, -0.4 + 0.8 * k / 29)   # each spoke attached
for k in range(45): fxa(Y.sfx_pop(1800 + (k % 5) * 120), 127.2 + k * 0.4, 0.035, 0.3 * (-1) ** k)  # glue plinks along the spiral
for i in range(14): fxa(Y.sfx_fwip(i % 2 == 0), 169.6 + i * 0.21, 0.05, -0.3)          # the moth's wings (in the silence: very soft)
fx_hit = np.zeros((N, 2), np.float32)
add(fx_hit, rs(Y.sfx_thud()), F(HIT), 0.4); add(fx_hit, rs(Y.sfx_boing(140, 1.2)), F(HIT), 0.12)
for i in range(16): fxa(Y.sfx_tick(2400), 175 + i * 0.25, 0.04, -0.2)                   # the spider runs
fxa(Y.sfx_crackle(4), 180, 0.08)                                                          # wrapping
for k in range(20): fxa(Y.sfx_bubble(900 + (k % 6) * 120), 186.5 + k * 0.17, 0.05, 0.4 * (-1) ** k)   # dew drops
for k in range(18): fxa(Y.sfx_crunch(0.08), 201.5 + k * 0.5, 0.05)                       # a slow chew
fx *= gate[:, None]; fx += fx_hit
fx = S.room(fx, size=0.25, mix=0.1)

def write(x, name, peak):
    x = x / (np.abs(x).max() + 1e-9) * peak; sf.write(os.path.join(here, 'audio', name), x.astype(np.float32), SR)
write(mus, 'music.wav', 0.3); write(fx, 'sfx.wav', 0.3)   # quieter (the user's note): the voice sits well on top
print('music', len(EV) + len(POST) + len(EV_RAW), 'events; wrote audio/music.wav, audio/sfx.wav at', SR, 'Hz')
