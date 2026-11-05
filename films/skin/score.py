"""Why Do Humans Have Different Skin Colours? The music travels with the walk: a warm hand-drum and kalimba theme in Africa;
glassy bells inside the skin; a flute-like line on the coasts and across the globe; cold low pads and wind in the north;
a crackling fire and a low hum at the ice-age camp and in the Arctic; bright plucks in South Asia; all strands together at
the end. One sound per action. Music sits well under the voice (the voice comes later; the score is re-fitted then).
    python3 films/skin/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys, json
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

def drum(t0, t1, gain=1.0, rate=0.5):
    at, i = t0, 0
    while at < t1:
        mus.add(kick(0.3), at, 0.13 * gain);
        if i % 2: mus.add(sfx_tick(900), at + rate * 0.5, 0.05 * gain)
        at += rate; i += 1

def kalimba(t0, t1, gain=1.0, key=('D', 'F#', 'A', 'B', 'E')):
    at, i = t0, 0
    while at < t1 - 0.1:
        n = key[(i * 3 + (i // 4)) % len(key)] + ('5' if i % 3 else '4')
        mus.add(pluck(N(n), 0.6, 0.7), at, 0.09 * gain, 0.35 * (-1) ** i); at += 0.25 * (2 if i % 4 == 3 else 1); i += 1

def pads(t0, dur, notes, gain=0.1, warm=0.5):
    for k, n in enumerate(notes): mus.add(pad(N(n), dur, a=1.5, r=2, warm=warm), t0 + k * 0.3, gain)

# 0-32: Africa: drum + kalimba, warm pads
pads(0, 12, ['D3', 'A3', 'F#4'], 0.1); drum(0.5, 32, 0.9); kalimba(0.5, 32, 1.0)
# 32-86: inside the skin: glassy bells over a soft pad, a slow pulse
pads(32, 54, ['B2', 'F#3', 'D4'], 0.09, 0.3)
for i in range(40): mus.add(bell(N(['F#5', 'B5', 'D6', 'A5', 'E6'][i % 5]), 2.2), 32.5 + i * 1.32, 0.06, 0.4 * (-1) ** i)
for at in [i * 2.0 + 32 for i in range(27)]: mus.add(kick(0.4), at, 0.07)
# 86-110: leaving Africa + the globe: the drum returns, a flute-like line (strings, high) over it
drum(86, 110, 0.8, 0.45); kalimba(86, 98, 0.7)
for i, n in enumerate(['A4', 'B4', 'D5', 'E5', 'F#5', 'E5', 'D5', 'B4', 'A4', 'D5', 'E5', 'A5']): mus.add(string(N(n), 2.2, a=0.4), 92 + i * 1.5, 0.08)
# 110-156: the north: cold low pads, sparse bells, wind
pads(110, 46, ['D2', 'A2', 'E3'], 0.14, 0.15)
for i in range(18): mus.add(bell(N(['E5', 'B4', 'D5', 'A4'][i % 4]), 3.5), 111 + i * 2.5, 0.05, 0.5 * (-1) ** i)
# 156-180: ice-age camp and the Arctic: a low hum, a gentle pluck motif
pads(156, 24, ['A1', 'E2'], 0.12, 0.6)
for i in range(20): mus.add(pluck(N(['A3', 'C4', 'E4', 'D4'][i % 4]), 0.9, 0.4), 157 + i * 1.15, 0.06)
# 180-202: Africa's range and South Asia: brighter plucks and the drum, a little faster
drum(180, 202, 0.8, 0.42); kalimba(180, 192, 0.9); kalimba(192, 202, 0.9, ('E', 'G#', 'B', 'C#', 'F#'))
# 202-240: all strands together: drum, kalimba, strings, bells, resolving on D
drum(202, 238, 0.7, 0.5); kalimba(202, 238, 0.8)
for i, n in enumerate(['D5', 'E5', 'F#5', 'A5', 'B5', 'A5', 'F#5', 'E5', 'D5', 'F#5', 'A5', 'D6']): mus.add(string(N(n), 2.6, a=0.5), 204 + i * 2.6, 0.08)
pads(236, 4, ['D3', 'A3', 'D4', 'F#4'], 0.1)

# ---------- effects ----------
for i in range(9): fx.add(sfx_pop(600 + i * 50), 0.5 + i * 0.25, 0.15)                # the crowd appears
fx.add(sfx_whoosh(1.2, up=False), 4.4, 0.2); fx.add(sfx_sparkle(6, 1600), 8.4, 0.12)
for i in range(10): fx.add(sfx_tick(800), 12.3 + i * 0.55, 0.06)                     # footsteps on dry grass
fx.add(sfx_sparkle(8, 2400), 19, 0.1)                                                # sweat glints
fx.add(sfx_whoosh(0.8), 24, 0.2); [fx.add(sfx_tick(2000 + i * 200), 24.4 + i * 0.3, 0.08) for i in range(8)]   # the gauge climbs
fx.add(sfx_whoosh(1.0), 32, 0.25)                                                    # into the skin
for i in range(14): fx.add(sfx_bubble(500 + (i % 4) * 80), 38.5 + i * 0.5, 0.08)       # parcels handed out
for i in range(8): fx.add(sfx_pop(700 + i * 40), 46.5 + i * 0.4, 0.12)               # caps settle
for i in range(5): fx.add(sfx_fwip(), 50 + i * 0.7, 0.08)                            # UV bounces
fx.add(sfx_crunch(0.3), 56.6, 0.25)                                                  # DNA damage
for i in range(3): fx.add(sfx_crackle(0.4), 61.6 + i * 0.6, 0.15)                    # folate breaks
fx.add(sfx_sparkle(8, 1800), 67.4, 0.2)                                              # vitamin D forms
fx.add(sfx_boing(200, 0.5), 77, 0.12); fx.add(sfx_boing(180, 0.5), 79, 0.1)          # the scale rocks
for i in range(10): fx.add(sfx_tick(900), 86.3 + i * 0.55, 0.06)                     # walking out
fx.add(sfx_whoosh(1.4), 92, 0.2); fx.add(sfx_whoosh(1.4), 104, 0.2)                  # routes on the globe
fx.add(sfx_wind(10), 111, 0.12); fx.add(sfx_wind(6), 116, 0.15)                      # the cold north
for i in range(10): fx.add(lowpass(noise(0.18), 1500) * 0.5, 116.4 + i * 0.55, 0.12)  # footsteps in snow
fx.add(sfx_wind(6), 138, 0.12)
for i in range(6): fx.add(sfx_pop(500 + i * 90), 132.4 + i * 0.6, 0.12)              # faces, one by one
fx.add(sfx_sparkle(6, 1500), 145.5, 0.12)
fx.add(sfx_crackle(12), 156, 0.18)                                                   # the campfire
fx.add(sfx_wind(5), 168, 0.08); fx.add(sfx_splash(), 171.5, 0.12)                    # the Arctic shore
for i in range(5): fx.add(sfx_bubble(300 + i * 60), 174.5 + i * 1.0, 0.1)            # fish
for i in range(6): fx.add(sfx_pop(560 + i * 60), 180.4 + i * 0.5, 0.12)
fx.add(sfx_chatter(0.6), 192.6, 0.06); fx.add(sfx_rain(3, 12), 193, 0.05)            # the valley, water
for i in range(8): fx.add(sfx_tick(2000 + i * 200), 197.3 + i * 0.3, 0.08)           # the gauge rises
fx.add(sfx_whoosh(1.4), 206, 0.2); fx.add(sfx_sparkle(8, 1700), 210, 0.15)           # the maps meet
for i in range(3): fx.add(sfx_pop(900 + i * 150), 217 + i * 1.2, 0.15)               # highlighted genes
for i in range(9): fx.add(sfx_pop(600 + i * 50), 223.4 + i * 0.2, 0.12)
fx.add(sfx_sparkle(10, 1500), 230.5, 0.15); fx.add(sfx_whoosh(2.0, up=False), 237, 0.15)

mus.reverb(0.3).write(os.path.join(here, 'audio', 'music.wav'), gain=0.45)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.6)
