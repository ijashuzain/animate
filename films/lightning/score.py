"""How a Cloud Builds a Lightning Bolt: a dark, patient score. Low drone and soft rain for the porch; a rising, airy pad
while the cloud builds; glassy plucks as water freezes; ticks for the collisions; a pulse that tightens as charge
separates; held tension in slow motion; silence; a white-noise crack for the return stroke; real thunder; then the
quiet porch and a soft resolve.
    python3 films/lightning/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

D = 129.0
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
mus, fx = Mix(D), Mix(D)
N = note

def thunder(d=6.0, close=1.0):
    """a crack (close) then a long low rolling rumble"""
    t = t_(d); x = lowpass(noise(d), 180 + 300 * close) * (np.exp(-t * 0.7) * (0.6 + 0.4 * np.sin(t * 3.1) ** 2)) * 1.4
    if close > 0.3: c = highpass(noise(0.35), 1200) * np.exp(-t_(0.35) * 14) * close; x[:len(c)] += c
    return x

# 0-10.2: the porch: a low drone in A minor, a few distant bells, the first thunder at 9.6
mus.add(pad(N('A1'), 11, a=2, r=2, warm=0.3), 0, 0.3); mus.add(pad(N('E2'), 11, a=3, r=2, warm=0.3), 0.5, 0.18)
for i, n in enumerate(['E5', 'C5', 'A4', 'B4']): mus.add(bell(N(n), 2.6), 1.6 + i * 2.0, 0.08, 0.4 * (-1) ** i)
# 11.4-24: the cloud builds: an airy rising pad
for i, n in enumerate(['A2', 'E3', 'A3', 'C4', 'E4']): mus.add(string(N(n), 13 - i * 1.5, a=4), 11.6 + i * 1.5, 0.12)
# 24-36: inside: glassy plucks as water freezes
for i in range(20): mus.add(pluck(N(['E6', 'B5', 'G5', 'E5', 'D6', 'A5'][i % 6]), 0.6, 0.8), 25.0 + i * 0.55, 0.08, 0.4 * (-1) ** i)
mus.add(pad(N('E3'), 12, a=2, warm=0.4), 24, 0.14)
# 36-50: collisions: a soft pulse
for b in range(28): mus.add(kick(0.3), 36 + b * 0.5, 0.08 if b % 2 else 0.14)
mus.add(string(N('C3'), 14, a=3), 36, 0.13); mus.add(string(N('G3'), 14, a=4), 37, 0.1)
# 50-61.5: charges sort: the pulse tightens, rising strings
for b in range(46): mus.add(kick(0.25), 50 + b * 0.25, 0.06 + 0.06 * (b / 46))
for i, n in enumerate(['A3', 'B3', 'C4', 'D4', 'E4', 'F4']): mus.add(string(N(n), 2.4, a=0.6), 50.5 + i * 1.8, 0.13)
# 61.5-94: slow motion: a held low cluster, very quiet, ticking
mus.add(pad(N('A1'), 33, a=3, r=2, warm=0.2), 61.5, 0.28); mus.add(pad(N('Bb1'), 33, a=8, r=2, warm=0.2), 64, 0.12)
for i in range(30): mus.add(pluck(N('A6'), 0.2, 0.9), 62.5 + i * 1.0, 0.03)
mus.add(string(N('E3'), 10, a=6), 84, 0.14); mus.add(string(N('F3'), 10, a=7), 85, 0.1)
# 94-96.5: silence. 96.5-108: the stroke: a bright major swell; 108-117.5 the rumble bed
for n, g in (('A2', 0.3), ('E3', 0.25), ('A3', 0.2), ('C#4', 0.18), ('E4', 0.14)): mus.add(string(N(n), 11, a=0.4), 96.6, g)
# 117.5-129: the porch again: a calm resolve in A
for n in ('A2', 'E3', 'A3', 'C#4'): mus.add(pad(N(n), 11, a=1.5, r=3), 118, 0.12)
for i, n in enumerate(['E5', 'C#5', 'A4', 'E5', 'A5']): mus.add(bell(N(n), 2.4), 119 + i * 1.6, 0.09, 0.3 * (-1) ** i)

# ---------- effects ----------
fx.add(sfx_rain(10, 40), 0, 0.25); fx.add(sfx_wind(10), 0, 0.12)
for i in range(9): fx.add(sfx_tick(2600), 1.6 + i, 0.08)                        # counting
fx.add(thunder(5.5, 0.4), 9.6, 0.8)                                             # the bang (3 km away: a low roll)
fx.add(sfx_whoosh(1.2), 10.2, 0.3)                                              # out to the field
fx.add(sfx_wind(12), 11.6, 0.15)                                                # rising air
fx.add(sfx_sparkle(6, 2200), 24.2, 0.15)                                        # the cutaway opens
for i in range(8): fx.add(sfx_tick(4200 + 200 * i), 27.2 + i * 0.45, 0.06)      # freezing
for tc in (38.6, 41.6, 44.6): fx.add(sfx_pop(1400), tc, 0.3); fx.add(sfx_sparkle(3, 3000), tc + 0.05, 0.12)   # collisions
for i in range(12): fx.add(sfx_crackle(0.4), 62.5 + i * 0.7, 0.05)              # cloud base crackles
for i in range(18): fx.add(sfx_crackle(0.25), 70.2 + i * 0.78, 0.09 + 0.01 * i) # the leader steps
fx.add(sfx_crackle(1.5), 86.0, 0.15)                                            # streamers fizz
fx.add(highpass(noise(0.5), 900) * np.exp(-t_(0.5) * 9) * 0.9, 96.5, 0.8)       # the return stroke crack
fx.add(sfx_whoosh(1.0), 96.6, 0.4)
for r in (101.5, 103.8, 106.0): fx.add(highpass(noise(0.3), 1500) * np.exp(-t_(0.3) * 12) * 0.7, r, 0.4)
fx.add(thunder(8.5, 1.0), 108.0, 1.0)                                           # thunder up close
fx.add(sfx_rain(11, 70), 118, 0.3)
fx.add(thunder(4.0, 0.3), 127.4, 0.7)                                           # it reaches the house
fx.add(sfx_tick(2600), 127.4, 0.1)

mus.reverb(0.35).write(os.path.join(here, 'audio', 'music.wav'), gain=0.5)
fx.reverb(0.18).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.9)
