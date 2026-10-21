"""The Island: a deep ambient score that rises with the mountain; brass-like swells at the blasts; a warm theme in the
sunlight; island plucks as life arrives; silence; a big swell for the pull-back. One sound per action.
    python3 films/island/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

D = 128.0
here = os.path.dirname(os.path.abspath(__file__))
mus, fx = Mix(D), Mix(D)
N = note
# 0-37: the deep: low drones and glassy bells (D minor)
mus.add(pad(N('D2'), 38, a=4, warm=0.3), 0, 0.35); mus.add(pad(N('A2'), 38, a=6, warm=0.3), 2, 0.22)
for i, n in enumerate(['A5', 'F5', 'D6', 'E5', 'C6', 'A5', 'G5', 'F5', 'D5', 'A5', 'E5', 'D6']): mus.add(bell(N(n), 3.0), 1.5 + i * 2.9, 0.12, 0.5 * (-1) ** i)
mus.add(string(N('D3'), 16, a=6), 21.0, 0.25)
# 37-50: growth: a slow pulse and rising strings
for b in range(26): at = 37 + b * 0.5; mus.add(kick(0.4), at, 0.18 if b % 2 == 0 else 0.08); mus.add(bass(N(['D2', 'D2', 'Bb1', 'C2'][(b // 4) % 4]), 0.45), at, 0.3)
for i, n in enumerate(['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5']): mus.add(string(N(n), 2.2, a=0.6), 37.5 + i * 1.8, 0.2)
# 50-63: the blasts: big low swells
for at in (53.0, 55.4, 57.8, 60.2, 62.4): mus.add(string(N('D2'), 2.4, a=0.1), at, 0.45); mus.add(string(N('A2'), 2.4, a=0.1), at, 0.3); mus.add(kick(0.8), at, 0.7)
# 63-75: first sunlight: a warm major theme
for n in ('D3', 'F#3', 'A3', 'D4'): mus.add(pad(N(n), 12.5, a=2.5, warm=0.6), 63.5, 0.15)
for i, n in enumerate(['A4', 'D5', 'F#5', 'E5', 'D5', 'A5', 'F#5', 'D5']): mus.add(bell(N(n), 2.4), 66.0 + i * 1.1, 0.25, 0.3 * (-1) ** i)
# 75-100: life: island plucks, a gentle groove
prog = [('D', ['D', 'F#', 'A']), ('G', ['G', 'B', 'D']), ('B', ['B', 'D', 'F#']), ('A', ['A', 'C#', 'E'])]
for b in range(int((99.8 - 75) / 0.5)):
    at = 75 + b * 0.5; root, ch = prog[(b // 4) % 4]
    mus.add(bass(N(root + '2'), 0.45), at, 0.3 if b % 2 == 0 else 0.18)
    for k in range(2): mus.add(pluck(N(ch[(b * 2 + k) % 3] + '5'), 0.5, 0.7), at + k * 0.25, 0.16, 0.3 * (-1) ** k)
    if b % 4 == 0: mus.add(pad(N(root + '3'), 2.2, a=0.4), at, 0.12)
# 100-102.5: silence. 102.5-115: the pull-back swell; 115-128: calm, the deep bells return
for n, g in (('D2', 0.4), ('A2', 0.3), ('D3', 0.3), ('F#3', 0.25), ('A3', 0.2), ('D4', 0.18)): mus.add(string(N(n), 12.5, a=4), 102.6, g)
for n in ('D3', 'A3', 'F#4'): mus.add(pad(N(n), 13, a=2, r=4), 115, 0.15)
for i, n in enumerate(['A5', 'F#5', 'D6', 'A5', 'E5', 'D5']): mus.add(bell(N(n), 3.0), 116 + i * 1.8, 0.16, 0.4 * (-1) ** i)

# ---------- effects ----------
fx.add(lowpass(noise(11), 300) * 0.3, 0.2, 0.6)                         # sub motor hum
fx.add(sfx_fwip(), 3.7, 0.3); fx.add(sfx_thud(), 6.0, 0.5)             # the arm, the tripod lands
fx.add(sfx_tick(3000), 6.3, 0.4); fx.add(bell(N('A6'), 0.4), 6.35, 0.2)   # REC beep
for i in range(6): fx.add(sfx_bubble(300 + 40 * i), 7.0 + i * 0.4, 0.2)
fx.add(sfx_whoosh(1.2), 10.4, 0.4)                                      # into the viewfinder
fx.add(lowpass(noise(6), 120) * 0.6, 13.0, 0.7)                         # the plume rumble
fx.add(sfx_crunch(1.2), 18.0, 0.7); fx.add(sfx_thud(), 18.3, 0.6)      # the floor cracks
for i in range(8): fx.add(sfx_splat(), 22.0 + i * 1.6, 0.25); fx.add(lowpass(noise(0.8), 900) * 0.3, 22.2 + i * 1.6, 0.4)   # pillows ooze and hiss
fx.add(sfx_fwip(False), 28.4, 0.4); fx.add(sfx_splat(), 29.2, 0.3)     # toothpaste squish
for i in range(6): fx.add(sfx_tick(900 + 200 * (i % 2)), 31.0 + i * 0.3, 0.25)   # the crab's steps
for i in range(5): fx.add(sfx_whoosh(0.9, up=False), 34.0 + i * 3.2, 0.12)      # snores
fx.add(sfx_whale(2.4), 45.0, 0.5)
fx.add(sfx_rain(3.0, 120), 50.0, 0.4)                                   # boiling
fx.add(sfx_pop(500), 50.6, 0.5)
for i in range(6): fx.add(sfx_tick(1400), 51.0 + i * 0.25, 0.3)          # the crab runs
for at in (53.0, 55.4, 57.8, 60.2, 62.4): fx.add(sfx_thud(), at, 0.9); fx.add(sfx_whoosh(1.6), at, 0.7); fx.add(lowpass(noise(1.4), 500) * 0.6, at + 0.1, 0.6)
for i in range(6): fx.add(sfx_whoosh(0.4), 53.6 + i * 0.3, 0.15)         # birds scatter
fx.add(sfx_whoosh(2.0), 63.0, 0.5)
for i in range(10): fx.add(lowpass(noise(0.9), 1500) * np.linspace(1, 0, int(0.9 * SR)) * 0.5, 64 + i * 1.2, 0.25)   # steam hiss
fx.add(sfx_sparkle(6, 2400), 66.2, 0.3); fx.add(sfx_pop(900), 68.0, 0.4); fx.add(sfx_boing(300, 0.4), 70.2, 0.3)   # sun, the face
for i in range(14): fx.add(lowpass(noise(1.2), 700) * np.sin(np.linspace(0, np.pi, int(1.2 * SR))) * 0.3, 75 + i * 1.6, 0.3)   # waves
fx.add(sfx_splash(), 78.4, 0.3); fx.add(sfx_fwip(), 79.0, 0.5)          # coconut lands, sprouts
fx.add(sfx_wind(3.2), 79.4, 0.3)                                         # the spider on the wind
fx.add(sfx_whoosh(0.6), 82.4, 0.25); fx.add(sfx_pop(1500), 84.6, 0.4)   # the bird, the plop
for i in range(9): fx.add(sfx_fwip(), 84.6 + i * 0.4, 0.15)               # green spreads
fx.add(sfx_rain(6.5), 88.0, 0.5); fx.add(lowpass(noise(8), 2500) * 0.15, 90.0, 0.5)   # rain, waterfalls
for i in range(8): fx.add(sfx_splash(), 95.8 + i * 0.45, 0.12)            # paddles
for i in range(24): fx.add(sfx_tick(4200), 99.8 + i * 0.12, 0.08)         # crickets
fx.add(sfx_whoosh(3.0, up=False), 102.6, 0.5)
fx.add(sfx_tick(3000), 117.0, 0.4); fx.add(bell(N('A6'), 0.4), 117.05, 0.2); fx.add(sfx_bubble(500), 118.0, 0.3)
fx.add(sfx_tick(3000), 125.6, 0.4); fx.add(bell(N('A6'), 0.4), 125.65, 0.2)

mus.reverb(0.3).write(os.path.join(here, 'audio', 'music.wav'), gain=0.5)
fx.reverb(0.14).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.9)
