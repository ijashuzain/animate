"""How Your Eyes Turn Light Into a Picture: a bright plucked kitchen theme; it thins into one glassy tone as we ride the
ray; wide airy pads inside the eye; a soft pulse in the retina; a held breath then a crisp chime at the molecule; electric
arpeggios for the signals; a warm full theme when the brain rebuilds the apple; back to the kitchen. One sound per action.
    python3 films/eyes/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys, json, subprocess
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
D = 240.0
# when a voice-over arrives, align.py writes src/timing.js and every cue below moves with the picture
tp = os.path.join(here, 'src', 'timing.js')
if os.path.exists(tp):
    TM = json.loads(open(tp).read().split('const TIMING = ')[1].strip().rstrip(';')); V, PL, D = TM['VOICE'], TM['PLAN'], TM['D']
    def to_film(t):
        for i in range(len(PL) - 1):
            if t < PL[i + 1] or i == len(PL) - 2: return V[i] + (V[i + 1] - V[i]) * (t - PL[i]) / (PL[i + 1] - PL[i])
else:
    to_film = lambda t: t
class WMix(Mix):
    def add(self, x, at, gain=1.0, pan=0.0): super().add(x, max(0.0, to_film(at)), gain, pan)
mus, fx = WMix(D), WMix(D)
N = note

def plucks(t0, t1, notes, step=0.3, gain=1.0, octs=('5', '4')):
    at, i = t0, 0
    while at < t1 - 0.1:
        mus.add(pluck(N(notes[(i * 2 + i // 4) % len(notes)] + octs[i % 2]), 0.5, 0.6), at, 0.09 * gain, 0.35 * (-1) ** i); at += step; i += 1
def pads(t0, dur, notes, gain=0.1, warm=0.5):
    for k, n in enumerate(notes): mus.add(pad(N(n), dur, a=1.5, r=2, warm=warm), t0 + k * 0.3, gain)
def arps(t0, t1, notes, step=0.12, gain=1.0):
    at, i = t0, 0
    while at < t1 - 0.05: mus.add(bell(N(notes[i % len(notes)]), 0.5), at, 0.05 * gain, 0.4 * (-1) ** i); at += step; i += 1

KEY = ['C', 'E', 'G', 'A', 'D']
# 0-22 kitchen: bright plucks over warm pads
pads(0, 22, ['C3', 'G3', 'E4'], 0.09); plucks(0.4, 22, KEY)
for at in range(0, 22, 2): mus.add(kick(0.3), at + 0.5, 0.08)
# 22-32 riding the ray: the plucks thin into one glassy tone rising
plucks(22, 27, KEY, 0.2, 0.7); mus.add(string(N('E5'), 6, a=1.5), 26, 0.1); mus.add(string(N('B5'), 4, a=1), 28, 0.08)
# 32-76 the eye: wide airy pads, slow bells
pads(32, 44, ['A2', 'E3', 'C4'], 0.11, 0.3)
for i in range(22): mus.add(bell(N(['E5', 'A5', 'C6', 'B5', 'G5'][i % 5]), 2.4), 32.5 + i * 2.0, 0.055, 0.4 * (-1) ** i)
# 76-116 the retina: a soft pulse and a rhythmic pluck
pads(76, 40, ['F2', 'C3', 'A3'], 0.1, 0.4)
for at in [76 + i * 0.75 for i in range(53)]: mus.add(kick(0.25), at, 0.06)
plucks(90, 116, ['F', 'A', 'C', 'E', 'G'], 0.375, 0.7)
# 116-130 the molecule: a held breath, then a crisp chime at the snap (planned 125.5)
mus.add(pad(N('D3'), 9, a=3, r=1, warm=0.2), 116, 0.1); mus.add(string(N('A4'), 8, a=4), 117, 0.06)
for k, n in enumerate(['C6', 'E6', 'G6', 'C7']): mus.add(bell(N(n), 3.0), 125.5 + k * 0.05, 0.1)
# 130-192 signals: electric arpeggios over a pulse
pads(130, 62, ['D2', 'A2', 'F3'], 0.09, 0.3)
arps(130, 166, ['D5', 'F5', 'A5', 'D6', 'A5', 'F5'], 0.14, 0.9); arps(166, 192, ['E5', 'G#5', 'B5', 'E6', 'B5', 'G#5'], 0.12, 1.0)
for at in [130 + i * 0.5 for i in range(124)]: mus.add(kick(0.22), at, 0.05)
# 192-232 the brain builds the scene: a warm full theme
pads(192, 40, ['C3', 'G3', 'E4', 'C5'], 0.1, 0.6)
for i, n in enumerate(['E5', 'G5', 'A5', 'C6', 'B5', 'G5', 'E5', 'G5', 'C6', 'E6', 'D6', 'C6']): mus.add(string(N(n), 3.0, a=0.6), 199 + i * 2.6, 0.08)
# 232-240 back to the kitchen
plucks(232, 239, KEY); pads(236.5, 3.5, ['C3', 'G3', 'C4', 'E4'], 0.1)

# ---------- effects ----------
fx.add(sfx_sparkle(6, 1800), 0.8, 0.08); fx.add(sfx_whoosh(1.2), 6, 0.2)                 # the dive toward the apple
for i in range(7): fx.add(sfx_tick(1600 + i * 220), 13 + i * 0.25, 0.08)                  # colours fan out
for i in range(6): fx.add(sfx_bubble(400 + i * 50), 17.5 + i * 0.2, 0.08)                 # colours sink in
fx.add(sfx_pop(1200), 18.8, 0.2)                                                          # red bounces
fx.add(sfx_whoosh(2.0), 22.3, 0.25); fx.add(sfx_whoosh(1.5), 27, 0.2)                    # ride the ray, into the eye
fx.add(sfx_tick(3000), 33, 0.15); fx.add(sfx_sparkle(5, 2200), 39, 0.1)                  # the cornea bends it
fx.add(sfx_fwip(False), 45, 0.2); fx.add(sfx_fwip(True), 50, 0.2)                         # pupil shrinks, widens
fx.add(sfx_boing(260, 0.5), 61, 0.08)                                                     # the lens bulges
fx.add(sfx_whoosh(1.0), 66.5, 0.15); fx.add(sfx_pop(500), 72, 0.15)                       # across the jelly, the image lands
fx.add(sfx_whoosh(1.0, up=False), 76, 0.15)
for i in range(6): fx.add(sfx_tick(1200 + i * 100), 84 + i * 0.6, 0.06)                   # threading the wiring
for i in range(3): fx.add(sfx_pop(700 + i * 200), 104.5 + i * 1.6, 0.15)                 # red, green, blue cones
fx.add(sfx_whoosh(1.2), 110.5, 0.15); fx.add(sfx_pop(900), 112.5, 0.18)                  # the ray enters the red cone
fx.add(sfx_crunch(0.25), 125.5, 0.25); fx.add(sfx_sparkle(10, 2600), 125.6, 0.15)        # the snap
for i in range(12): fx.add(sfx_tick(1800 + (i % 4) * 300), 130.3 + i * 0.2, 0.06)       # the chain reaction
fx.add(sfx_fwip(), 137, 0.15)                                                             # the cone fires
for i in range(8): fx.add(sfx_tick(2400), 142.5 + i * 0.6, 0.05)                         # signals hop
fx.add(sfx_whoosh(1.4), 148.5, 0.15)
fx.add(sfx_pop(400), 162.2, 0.15)                                                         # the dot vanishes
fx.add(sfx_whoosh(1.4), 172.5, 0.15); fx.add(sfx_whoosh(1.4, up=False), 174.5, 0.12)     # crossing
for i in range(10): fx.add(sfx_tick(2000 + i * 100), 178.5 + i * 0.45, 0.05)            # the ms counter
for i in range(20): fx.add(sfx_pop(600 + (i % 6) * 80), 199.8 + i * 0.22, 0.06)         # the tiles build
for i in range(4): fx.add(sfx_pop(800 + i * 120), 206.5 + i * 0.8, 0.12)                 # four jobs
fx.add(sfx_sparkle(8, 1600), 215.5, 0.12)                                                # put back together
fx.add(sfx_whoosh(1.6), 220.5, 0.15)
fx.add(sfx_crunch(0.35), 235.1, 0.3)                                                      # the bite

mus.reverb(0.3).write(os.path.join(here, 'audio', 'music.wav'), gain=0.32)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.45)
