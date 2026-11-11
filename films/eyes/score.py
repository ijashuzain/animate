"""How Your Eyes Turn Light Into a Picture: the score, on real instruments (lemo-opuscar's sampler: VCSL + VSCO 2 CE, CC0).
The cue map is TREATMENT.md section 6: a marimba motif in the kitchen; it thins into one bowed-vibraphone tone on the ride;
airy bowed-vibraphone pads and harp in the eye; a marimba pulse in the retina; a held breath, SILENCE, then the glockenspiel
snap at the molecule; hard-mallet arpeggios for the signals (J-cut in), rising; SILENCE before the turn; the motif on strings
when the brain rebuilds the apple; the motif back on marimba for the kitchen (J-cut in). Ambience beds + one sound per action.
    sh tools2/lemo/fetch.sh vcsl vsco2ce      (once: the sample libraries, ~700 MB, not in git)
    python3 films/eyes/score.py  ->  audio/music.wav, audio/sfx.wav  (48 kHz)"""
import os, sys, json, subprocess
import numpy as np, soundfile as sf, soxr
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
import synth as Y                                    # our procedural foley (44.1 kHz, resampled here)
from lemo import sampler as S, pluck as PL
from lemo.sfx import SR, add, limit

here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
D = 240.0
# when a voice-over arrives, align.py writes src/timing.js and every cue below moves with the picture
tp = os.path.join(here, 'src', 'timing.js')
if os.path.exists(tp):
    TM = json.loads(open(tp).read().split('const TIMING = ')[1].strip().rstrip(';')); V, PLN, D = TM['VOICE'], TM['PLAN'], TM['D']
    def F(t):
        for i in range(len(PLN) - 1):
            if t < PLN[i + 1] or i == len(PLN) - 2: return V[i] + (V[i + 1] - V[i]) * (t - PLN[i]) / (PLN[i + 1] - PLN[i])
else:
    F = lambda t: t
S.seed(7)
N = int((D + 4) * SR)
EV = []                                              # sampler events in planned time: (t, inst, pitch, dur, vel, pan)
def ev(t, inst, pitch, dur, vel=0.6, pan=0.0, rel=None):
    EV.append((max(0.0, F(t)), inst, pitch, dur, vel, pan) if rel is None else dict(t=max(0.0, F(t)), inst=inst, pitch=pitch, dur=dur, vel=vel, pan=pan, release=rel))
POST = []                                            # events that ignore the silences (the snap, the warm chord)

MOTIF = ['E5', 'G5', 'A5', 'C6', 'B5', 'G5', 'E5', 'G5', 'C6', 'E6', 'D6', 'C6']
down = lambda n, k=1: n[:-1] + str(int(n[-1]) - k)

# ---------- kitchen 0-22 (96 bpm): marimba motif, harp chords, kalimba sparkle, shaker ----------
b = 0.625
for rep, t0 in enumerate([0.6, 8.1, 15.6]):
    for i, n in enumerate(MOTIF):
        if t0 + i * b < 21.8: ev(t0 + i * b, 'marimba', down(n), 0.6, 0.5 + 0.08 * (i % 4 == 0), -0.15)
CH = [['C3', 'G3', 'E4'], ['A2', 'E3', 'C4'], ['F2', 'C3', 'A3'], ['G2', 'D3', 'B3']]
for k in range(9):
    for j, n in enumerate(CH[k % 4]): ev(0.6 + k * 2.5 + j * 0.06, 'harp', n, 2.4, 0.42, 0.25)
kal = ['G4', 'C5', 'E5', 'D5', 'A4', 'C5']
for k in range(16):
    t = 0.6 + k * 1.25 + b
    if t < 21.5:
        x = PL.pluck('kalimba', kal[k % 6], 1.0, 0.35); POST.append(('raw', t, x, 0.22, 0.35 * (-1) ** k))
for k in range(68): ev(0.6 + k * b / 2, 'shaker', 'down' if k % 2 else 'up', None, 0.18 + 0.06 * (k % 4 == 0), 0.3)
ev(18.8, 'glockenspiel', 'C7', 1.5, 0.45, 0.2)                                       # the red bounce

# ---------- the ride 22-32: the motif thins to one glassy tone, rising; a swell into the bloom ----------
ev(22.0, 'vibraphone_bowed', 'E5', 6.0, 0.55, -0.1); ev(25.5, 'vibraphone_bowed', 'B5', 6.2, 0.5, 0.1)
ev(27.0, 'hand_chimes', 'C6', 2.0, 0.45, -0.3); ev(29.5, 'hand_chimes', 'E6', 2.0, 0.45, 0.3)
ev(28.6, 'sus_cymbal', 'cresc', None, 0.35, 0.0)

# ---------- the eye 32-76 (72 bpm): bowed-vibraphone pads, a low cello, slow harp, glockenspiel on the parts ----------
EYE = [(32, 12, ['A3', 'C4', 'E4'], 'A2'), (44, 10, ['A3', 'C4', 'F4'], 'F2'), (54, 12, ['C4', 'E4', 'G4'], 'C3'), (66, 10, ['B3', 'E4', 'G4'], 'E2')]
for t0, d, ch, root in EYE:
    for j, n in enumerate(ch): ev(t0 + 0.2 + j * 0.3, 'vibraphone_bowed', n, d - 0.4, 0.4, (j - 1) * 0.35)
    ev(t0, 'cellos', root, d, 0.32, 0.0)
    for k in range(int(d / 1.667)): ev(t0 + 0.8 + k * 1.667, 'harp', down(ch[k % 3], -1), 2.0, 0.32, 0.4 * (-1) ** k)
for t, n in [(33, 'E7'), (39, 'G6'), (45, 'C7'), (50, 'A6'), (61, 'E7'), (72, 'C7')]: ev(t, 'glockenspiel', n, 1.2, 0.35, 0.3)

# ---------- the retina 76-116 (80 bpm): a marimba ostinato, frame drum, pizzicato bass; cones in glockenspiel ----------
RET = [(76, ['F4', 'A4', 'C5', 'A4'], 'F2'), (88, ['D4', 'F4', 'A4', 'F4'], 'D2'), (100, ['A#3', 'D4', 'F4', 'D4'], 'A#1'), (110, ['C4', 'E4', 'G4', 'E4'], 'C2')]
for (t0, pat, root), t1 in zip(RET, [88, 100, 110, 116]):
    k = 0
    while t0 + k * 0.375 < t1 - 0.1: ev(t0 + k * 0.375, 'marimba', pat[k % 4], 0.4, 0.34 + 0.08 * (k % 8 == 0), -0.25); k += 1
    k = 0
    while t0 + k * 3.0 < t1 - 0.1: ev(t0 + k * 3.0, 'contrabass_pizz', root, 1.5, 0.55, 0.0); ev(t0 + k * 3.0 + 1.5, 'contrabass_pizz', root, 1.0, 0.4, 0.0); k += 1
for k in range(int((116 - 80) / 0.75)): ev(80 + k * 0.75, 'frame_drum', 'small_muted' if k % 2 else 'large_muted', None, 0.3, -0.1)
for t, n in [(104.5, 'C7'), (106.1, 'E7'), (107.7, 'G7'), (112.5, 'C7')]: ev(t, 'glockenspiel', n, 1.2, 0.45, 0.2)

# ---------- the molecule 116-130: a held breath, SILENCE 124.3-125.5, the snap ----------
ev(116.0, 'cellos', 'D3', 8.6, 0.32, -0.1); ev(116.3, 'violas', 'A3', 8.3, 0.28, 0.1); ev(117.0, 'vibraphone_bowed', 'A4', 7.3, 0.36, 0.0)
SNAP = 125.5
for k, n in enumerate(['C6', 'E6', 'G6', 'C7']): POST.append((SNAP + k * 0.04, 'glockenspiel', n, 3.0, 0.7, (k - 1.5) * 0.25))
POST.append((SNAP, 'triangle', 'open', None, 0.55, 0.3)); POST.append((SNAP + 0.02, 'hand_chimes', 'C7', 3.0, 0.5, -0.3))
POST.append((SNAP, 'vibraphone_bowed', 'C5', 4.0, 0.42, 0.0))

# ---------- signals: J-cut in at 129.2 (120 bpm); hard-mallet arpeggios, pizzicato, pulse bass; 16ths from 166; stop 190.8 ----------
SIG = [(129.2, 148, ['D5', 'F5', 'A5', 'D6', 'A5', 'F5'], 'D2', 0.25), (148, 166, ['A#4', 'D5', 'F5', 'A#5', 'F5', 'D5'], 'A#1', 0.25),
       (166, 178, ['E5', 'G#5', 'B5', 'E6', 'B5', 'G#5'], 'E2', 0.125), (178, 190.8, ['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5'], 'A1', 0.125)]
for t0, t1, arp, root, st in SIG:
    k = 0
    while t0 + k * st < t1 - 0.05: ev(t0 + k * st, 'vibraphone_hard', arp[k % 6], 0.35, 0.3 + 0.06 * (k % 4 == 0) + 0.1 * (t0 >= 166) * (k / ((t1 - t0) / st)), 0.4 * (-1) ** k); k += 1
    k = 0
    while t0 + k * 0.5 < t1 - 0.05:
        ev(t0 + k * 0.5, 'contrabass_pizz', root, 0.45, 0.5, 0.0)
        if k % 2: ev(t0 + k * 0.5 + 0.25, 'violins_pizz', down(arp[0], 1), 0.3, 0.35, -0.3)
        if t0 >= 142 - 0.01 or t0 + k * 0.5 >= 142: ev(t0 + k * 0.5 + 0.25, 'hihat', 'closed', None, 0.22, 0.25)
        k += 1
ev(137.0, 'toms', 'low_mallet', None, 0.5, 0.0)                                       # the cone fires
ev(178.0, 'violins_trem', 'A4', 12.6, 0.3, -0.2); ev(178.0, 'violins_trem', 'E5', 12.6, 0.28, 0.2)
ev(186.5, 'gran_cassa', 'roll', None, 0.3, 0.0)

# ---------- the turn: SILENCE 190.8-192.2, then the warm chord; the motif on strings (76 bpm) ----------
TURN = 192.2
for n, inst, v, pn in [('C3', 'cellos', 0.4, -0.2), ('G3', 'violas', 0.36, 0.1), ('E4', 'violas', 0.32, 0.0), ('C5', 'violins', 0.36, 0.25), ('E5', 'violins', 0.32, -0.25)]: POST.append((TURN, inst, n, 6.5, v, pn))
POST.append((TURN, 'timpani', 'drum2', None, 0.35, 0.0))
for j, n in enumerate(['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6']): POST.append((TURN + j * 0.07, 'harp', n, 3.0, 0.4, 0.3))
BR = [['C3', 'G3', 'E4'], ['A2', 'E3', 'C4'], ['F2', 'C3', 'A3'], ['G2', 'D3', 'B3']]
for i, n in enumerate(MOTIF):
    t = 199 + i * 2.6
    ev(t, 'violins', n.replace('6', '5') if n[-1] == '6' and n[0] in 'DE' else n, 2.9, 0.34 + 0.04 * (i >= 8), 0.15)
    if i % 2 == 0 and t < 216: EV.append((F(t), 'horn', down(n, 1), 5.0, 0.3, -0.15, 0.25))   # the horn sample runs ~12 dB hot: gain 0.25
    if i % 3 == 0:
        for j, c in enumerate(BR[(i // 3) % 4]): ev(t, ['cellos', 'violas', 'violas'][j], c, 7.6, 0.22, (j - 1) * 0.3)
    ev(t + 1.3, 'harp', down(n, 1), 2.0, 0.3, 0.35)
ev(213.8, 'sus_cymbal', 'cresc', None, 0.3, 0.0); ev(215.5, 'glockenspiel', 'C7', 2.0, 0.5, 0.0)
for j, c in enumerate(['C3', 'G3', 'E4']): ev(220.0, ['cellos', 'violas', 'violins'][j], c, 4.2, 0.16, (j - 1) * 0.3, rel=1.2)

# ---------- the climb and the kitchen: J-cut in at 225 (the motif on marimba), the bite, the last chord ----------
for i, n in enumerate(MOTIF): ev(225.0 + i * b, 'marimba', down(n), 0.6, 0.48 + 0.08 * (i % 4 == 0), -0.15)
for i, n in enumerate(MOTIF[:6]): ev(232.5 + i * b, 'marimba', down(n), 0.6, 0.42, -0.15)
for k in range(4):
    for j, n in enumerate(CH[k]): ev(225.0 + k * 2.5 + j * 0.06, 'harp', n, 2.4, 0.38, 0.25)
for k in range(8): POST.append(('raw', 226.25 + k * 1.25, PL.pluck('kalimba', kal[k % 6], 1.0, 0.35), 0.2, 0.35 * (-1) ** k))
for j, n in enumerate(['C3', 'G3', 'C4', 'E4', 'G4', 'C5']): ev(236.5 + j * 0.08, 'harp', n, 3.5, 0.45, 0.2)
ev(236.5, 'marimba', 'C4', 2.0, 0.5, -0.2); ev(236.6, 'glockenspiel', 'E7', 2.5, 0.35, 0.3)

# ---------- render the music; the silences; then the events that break them ----------
mus = S.render(EV, dur=N / SR, master=False)[:N]
mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))
tt = np.arange(N) / SR
def hole(a, b, fade=0.7, floor=0.0):      # silence between film times F(a)..F(b), fading out over `fade` s before it
    fa, fb = F(a), F(b); g = np.ones(N)
    m = (tt > fa - fade) & (tt < fb); g[m] = np.clip((fa - tt[m]) / fade, floor, 1); g[(tt >= fa) & (tt < fb)] = floor
    return g
gate = hole(124.3, SNAP) * hole(190.8, TURN)
mus *= gate[:, None]
post = np.zeros((N, 2), np.float32)
for e in POST:
    if e[0] == 'raw': add(post, e[2], F(e[1]), e[3], e[4])
for e in POST:
    if e[0] != 'raw': x = S.note(e[1], e[2], e[3] or 2.0, e[4]) if e[2] not in ('open', 'drum2') else S.hit(e[1], e[2], e[4]); add(post, x, F(e[0]), 1.0, e[5])
mus = mus + post

# duck under the voice when it arrives (an envelope of the voice's loudness, smoothed)
vp = os.path.join(here, 'audio', 'voice-aligned.wav')
if os.path.exists(vp):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vp, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    vx = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768)
    win = int(0.25 * SR); env = np.convolve(vx, np.ones(win) / win, mode='same'); env = np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)
    env = np.convolve(env, np.ones(int(0.4 * SR)) / int(0.4 * SR), mode='same'); env = np.pad(env, (0, max(0, N - len(env))))[:N]
    mus *= (1 - 0.6 * np.clip(env * 1.3, 0, 1))[:, None]
mus = S.room(mus, size=0.5, mix=0.2)

# ---------- effects: ambience beds (three layers: bed, foley, music) and one sound per action ----------
fx = np.zeros((N, 2), np.float32)
rs = lambda x: soxr.resample(np.asarray(x, np.float32), Y.SR, SR)
def fxa(x, t, g, pan=0.0): add(fx, rs(x), F(t), g, pan)
def bed(t0, t1, x, g, fade=1.0):           # a looped bed between planned t0..t1, faded at both ends
    a, b2 = int(F(t0) * SR), int(F(t1) * SR); n = b2 - a; y = np.resize(x, n).astype(np.float32); f = int(fade * SR)
    e = np.ones(n); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f); fx[a:b2] += (y * e * g)[:, None]
rng = np.random.default_rng(3)
from lemo.sfx import bp as S_bp, lp as S_lp
room = S_lp(rng.standard_normal(SR * 8), 400) * 0.5
birds = np.zeros(SR * 8)
for k in range(9):                          # short chirps outside the window
    t0 = rng.uniform(0, 7.5); d = rng.uniform(0.08, 0.16); tc = np.arange(int(d * SR)) / SR; f0 = rng.uniform(2800, 4200)
    birds[int(t0 * SR):int(t0 * SR) + len(tc)] += np.sin(2 * np.pi * (f0 * tc + rng.uniform(-6000, 6000) * tc ** 2)) * np.hanning(len(tc)) * 0.3
bed(0, 23.2, room + birds, 0.08); bed(226, 240, room + birds, 0.08)                   # L-cut: the birds run over the cut at 22
bed(22, 32, S_bp(rng.standard_normal(SR * 6), 300, 3000), 0.05)                       # air rushing past
bed(32, 76, S_lp(rng.standard_normal(SR * 8), 140) * 2.0, 0.09)                       # the eye: a low liquid hum
bed(76, 116, rs(Y.sfx_crackle(8)), 0.05)                                              # the retina: soft cellular crackle
tc = np.arange(SR * 4) / SR; hum = (np.sin(2 * np.pi * 100 * tc) + 0.4 * np.sin(2 * np.pi * 200 * tc) + 0.2 * np.sin(2 * np.pi * 300 * tc)) * 0.3
bed(130, 190.8, hum, 0.05, 0.6); bed(190.8, 192.4, hum, 0.025, 0.3)                    # signals: electric hum (only a low hum in the silence)
bed(192.2, 226, S_lp(rng.standard_normal(SR * 8), 220) * 1.5, 0.06)                   # the brain: a warm low hum
# the turret click at each change of scale (the readout jumps)
for t in [32, 38, 76, 116, 123, 130, 136, 226]: fxa(Y.sfx_tick(4200), t, 0.12); fxa(Y.sfx_tick(2600), t + 0.04, 0.08)
fxa(Y.sfx_sparkle(6, 1800), 0.8, 0.08); fxa(Y.sfx_whoosh(1.2), 6, 0.2)                 # the dive toward the apple
for i in range(7): fxa(Y.sfx_tick(1600 + i * 220), 13 + i * 0.25, 0.08)                # colours fan out
for i in range(6): fxa(Y.sfx_bubble(400 + i * 50), 17.5 + i * 0.2, 0.08)               # colours sink in
fxa(Y.sfx_pop(1200), 18.8, 0.2)                                                        # red bounces
fxa(Y.sfx_whoosh(2.0), 22.3, 0.25); fxa(Y.sfx_whoosh(1.5), 27, 0.2)                    # ride the ray, into the eye
fxa(Y.sfx_tick(3000), 33, 0.15); fxa(Y.sfx_sparkle(5, 2200), 39, 0.1)                  # the cornea bends it
fxa(Y.sfx_whoosh(0.6), 43.7, 0.12); fxa(Y.sfx_whoosh(0.6, up=False), 53.7, 0.12)       # the model turns
fxa(Y.sfx_fwip(False), 45, 0.2); fxa(Y.sfx_fwip(True), 50, 0.2)                        # pupil shrinks, widens
fxa(Y.sfx_boing(260, 0.5), 61, 0.08)                                                   # the lens bulges
fxa(Y.sfx_whoosh(1.0), 66.5, 0.15); fxa(Y.sfx_pop(500), 72, 0.15)                      # across the jelly, the image lands
fxa(Y.sfx_whoosh(1.0, up=False), 76, 0.15)
for i in range(6): fxa(Y.sfx_tick(1200 + i * 100), 84 + i * 0.6, 0.06)                 # threading the wiring
for i in range(3): fxa(Y.sfx_pop(700 + i * 200), 104.5 + i * 1.6, 0.15)                # red, green, blue cones
fxa(Y.sfx_whoosh(1.2), 110.5, 0.15); fxa(Y.sfx_pop(900), 112.5, 0.18)                  # the ray enters the red cone
for i in range(12): fxa(Y.sfx_tick(1800 + (i % 4) * 300), 130.3 + i * 0.2, 0.06)      # the chain reaction
fxa(Y.sfx_fwip(), 137, 0.15)                                                           # the cone fires
for i in range(8): fxa(Y.sfx_tick(2400), 142.5 + i * 0.6, 0.05)                        # signals hop
fxa(Y.sfx_whoosh(1.4), 148.5, 0.15); fxa(Y.sfx_pop(400), 162.2, 0.15)                  # the nerve; the dot vanishes
fxa(Y.sfx_whoosh(1.4), 172.5, 0.15); fxa(Y.sfx_whoosh(1.4, up=False), 174.5, 0.12)    # crossing
for i in range(10): fxa(Y.sfx_tick(2000 + i * 100), 178.5 + i * 0.45, 0.05)           # the ms counter
for i in range(20): fxa(Y.sfx_pop(600 + (i % 6) * 80), 199.8 + i * 0.22, 0.06)        # the tiles build
for i in range(4): fxa(Y.sfx_pop(800 + i * 120), 206.5 + i * 0.8, 0.12)                # four jobs
fxa(Y.sfx_sparkle(8, 1600), 215.5, 0.12); fxa(Y.sfx_whoosh(1.6), 220.5, 0.15)         # put back together; millions of rays
fxa(Y.sfx_whoosh(2.0, up=False), 226, 0.18)                                            # the climb out of the eye
fx *= gate[:, None]                                                                    # the silences hold in the effects too
fxa(Y.sfx_crunch(0.25), SNAP, 0.3); fxa(Y.sfx_sparkle(10, 2600), SNAP + 0.1, 0.15)     # the snap: the first sound after the silence
fxa(Y.sfx_crunch(0.35), 235.1, 0.3)                                                    # the bite
fx = S.room(fx, size=0.25, mix=0.1)

def write(x, name, peak):
    x = x / (np.abs(x).max() + 1e-9) * peak; sf.write(os.path.join(here, 'audio', name), x.astype(np.float32), SR)
write(mus, 'music.wav', 0.28); write(fx, 'sfx.wav', 0.5)   # music ~10 dB under the voice
print('music', len(EV) + len(POST), 'events; wrote audio/music.wav, audio/sfx.wav at', SR, 'Hz')
