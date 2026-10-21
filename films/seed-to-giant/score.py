"""Seed to Giant: the score (D major, 120 bpm feel) and the sound effects, one cue per action on screen.
    python3 films/seed-to-giant/score.py   ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

D = 30.0
here = os.path.dirname(os.path.abspath(__file__))
mus, fx = Mix(D), Mix(D)
N = note

# 0-4.6: curious, sparse plucks over a soft pad
mus.add(pad(N('D3'), 4.8, a=1.5), 0, 0.35); mus.add(pad(N('A3'), 4.8, a=1.5), 0, 0.25)
for i, (n, at) in enumerate([('D5', 0.3), ('F#5', 0.9), ('A5', 1.5), ('E5', 2.1), ('F#5', 2.6), ('D5', 3.4), ('A4', 3.9)]):
    mus.add(pluck(N(n), 1.0), at, 0.5, pan=(-0.3 if i % 2 else 0.3))
# 4.6-7.3: twenty years whipping by: fast arpeggios and a clock
arp = ['D5', 'A5', 'F#5', 'A5', 'B4', 'G5', 'D5', 'G5', 'G4', 'D5', 'B4', 'D5', 'A4', 'E5', 'C#5', 'E5']
for i in range(22):
    mus.add(pluck(N(arp[i % len(arp)]), 0.4, 0.8), 4.7 + i * 0.12, 0.32, pan=0.4 * (-1) ** i)
mus.add(pad(N('G3'), 2.8, a=0.6), 4.6, 0.25)
# 7.3-9.6: fire: a low drone and rising strings
mus.add(string(N('D2'), 2.6, a=0.8), 7.3, 0.6); mus.add(string(N('A2'), 2.3, a=1.2), 7.6, 0.4)
for i, n in enumerate(['D4', 'E4', 'F#4', 'G4', 'A4']): mus.add(string(N(n), 0.6, a=0.15), 7.5 + i * 0.4, 0.25)
# 9.6: the flash hit, then the fall: a gentle descending line
mus.add(bell(N('D6'), 2.5), 9.6, 0.35); mus.add(bell(N('A5'), 2.5), 9.6, 0.25); mus.add(kick(), 9.6, 0.5)
for i, n in enumerate(['A5', 'F#5', 'E5', 'D5', 'B4', 'A4', 'F#4', 'E4', 'D4']):
    mus.add(pluck(N(n), 1.2, 0.4), 10.0 + i * 0.32, 0.4, pan=0.5 * (-1) ** i)
mus.add(pad(N('B2'), 3.6, a=1.0), 9.6, 0.3); mus.add(pad(N('F#3'), 3.6, a=1.0), 9.6, 0.2)
# 14.0 "Then it climbs": pulse and bass, the arpeggio rises an octave every two bars
prog = [('D', ['D', 'F#', 'A']), ('B', ['B', 'D', 'F#']), ('G', ['G', 'B', 'D']), ('A', ['A', 'C#', 'E'])]
beat = 0.5
for b in range(int((25.8 - 14.0) / beat)):
    at = 14.0 + b * beat; root, ch = prog[(b // 4) % 4]; lift = min(2, b // 8)
    mus.add(kick(0.3), at, 0.35 if b % 2 == 0 else 0.18)
    mus.add(bass(N(root + '2'), beat * 0.9), at, 0.45)
    for k in range(2):
        nn = ch[(b * 2 + k) % 3] + str(4 + lift + (1 if ch[(b * 2 + k) % 3] in ('C#',) and lift == 2 else 0))
        mus.add(pluck(N(nn), 0.5, 0.7), at + k * beat / 2, 0.22 + 0.04 * lift, pan=0.35 * (-1) ** k)
    if b % 4 == 0: mus.add(pad(N(root + '3'), beat * 4.2, a=0.4), at, 0.18 + 0.03 * lift)
# 23-25.8: the swell to the top
for n in ('D3', 'A3', 'D4', 'F#4'): mus.add(string(N(n), 3.0, a=2.0), 22.9, 0.35)
sw = noise(2.9); mus.add(lowpass(sw, 2500) * np.linspace(0, 1, len(sw)) ** 3 * 0.25, 22.9, 1.0)
# 25.8: the top: a big D chord, then calm; the opening motif returns with the seed at 28
mus.add(kick(), 25.8, 0.8)
for n, g in (('D3', 0.5), ('A3', 0.4), ('D4', 0.4), ('F#4', 0.35), ('A4', 0.3), ('E5', 0.2)): mus.add(pad(N(n), 4.4, a=0.05, r=2.0), 25.8, g)
for n in ('D6', 'A5', 'F#5'): mus.add(bell(N(n), 3.0), 25.8, 0.3)
for i, (n, at) in enumerate([('D5', 28.0), ('F#5', 28.5), ('A5', 29.0)]): mus.add(bell(N(n), 1.8), at, 0.35)
mus.add(pad(N('D2'), 4.0, a=1.0, r=2.5), 26.0, 0.3)

# ---------- effects ----------
fx.add(sfx_fwip(), 0.55, 0.5)                      # the rice slides in
fx.add(sfx_pop(1300), 1.35, 0.4); fx.add(sfx_pop(1500), 1.55, 0.4)   # labels
fx.add(sfx_tick(), 1.85, 0.5); fx.add(sfx_pop(1800), 2.2, 0.3)       # the 5 mm bar
fx.add(sfx_whoosh(0.7), 2.85, 0.6)                 # rice flicked away, camera pulls out
fx.add(sfx_fwip(), 3.7, 0.5); fx.add(sfx_pop(700), 4.15, 0.5)        # the seed tucks in, the cone closes
for i in range(20): fx.add(sfx_tick(2600 if i % 2 else 2000), 4.8 + i * 0.12, 0.35)   # the years
fx.add(sfx_crackle(4.2), 7.2, 0.7)                 # fire
fx.add(sfx_pop(500), 7.9, 0.6)                     # the cone wakes
fx.add(sfx_pop(320), 8.4, 0.9); fx.add(sfx_thud(), 8.4, 0.5); fx.add(sfx_sparkle(8, 1600), 8.5, 0.5)   # it pops open
fx.add(sfx_whoosh(1.0, up=False), 9.3, 0.9)        # the flash
fx.add(sfx_wind(3.2), 9.7, 0.6)                    # the fall
for i in range(5): fx.add(sfx_fwip(False), 10.2 + i * 0.5, 0.15)
fx.add(sfx_thud(), 12.9, 0.7)                      # landing on the ash
fx.add(sfx_crunch(0.9), 13.2, 0.6)                 # the root
fx.add(sfx_fwip(), 14.5, 0.7)                      # the sprout
fx.add(sfx_pop(1100), 15.3, 0.5)                   # the seed coat pops off
fx.add(sfx_whoosh(0.6), 16.4, 0.4); fx.add(sfx_pop(1400), 16.8, 0.3)   # past the kid
fx.add(sfx_whoosh(0.7), 18.0, 0.45); fx.add(sfx_meow(), 18.6, 0.6)     # past the house (the cat)
fx.add(sfx_whoosh(0.8), 20.0, 0.5); fx.add(sfx_whale(), 20.5, 0.8); fx.add(sfx_splash(), 21.0, 0.6)   # the whale
fx.add(sfx_whoosh(1.2), 24.2, 0.8); fx.add(sfx_wind(2.5), 24.6, 0.5)   # through the clouds
fx.add(sfx_sparkle(6, 2400), 25.9, 0.4)            # 84 m
fx.add(sfx_pop(1200), 28.0, 0.4); fx.add(sfx_sparkle(5, 3000), 28.2, 0.3)   # the seed again

mus.reverb(0.28).write(os.path.join(here, 'audio', 'music.wav'), gain=0.55)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.9)
