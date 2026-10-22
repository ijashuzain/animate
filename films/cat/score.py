"""Why Cats Land on Their Feet: a cosy late-night jazz-ish waltz of plucks for the hook; a tape-rewind sweep; then the
slow-motion world: a held low pad and a slow pulse, glassy bells for the inner ear, a rising zap for the signal, string
swells for each half's turn; silence; a warm resolve at the landing; a playful pizzicato for the kitten; the waltz again.
    python3 films/cat/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

D = 125.0
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
mus, fx = Mix(D), Mix(D)
N = note

def waltz(t0, t1, gain=1.0):
    """a gentle 3/4 of bass + two plucked chords (F major colour), 0.42 s a beat"""
    prog = [('F', ['A', 'C', 'E']), ('D', ['F', 'A', 'C']), ('G', ['F', 'B', 'D']), ('C', ['E', 'G', 'B'])]
    b, at = 0, t0
    while at < t1 - 0.1:
        root, ch = prog[(b // 3) % 4]
        if b % 3 == 0: mus.add(bass(N(root + '2'), 0.5), at, 0.3 * gain)
        else:
            for k, n in enumerate(ch): mus.add(pluck(N(n + '4'), 0.5, 0.55), at + k * 0.01, 0.1 * gain, 0.3 * (-1) ** b)
        if b % 6 == 0: mus.add(bell(N(['C6', 'A5', 'B5', 'G5'][(b // 3) % 4]), 1.6), at, 0.07 * gain, 0.4)
        b += 1; at += 0.42

# 0-3: the hook waltz, cut by the slip; 3.5-6.4 a little resolve after the landing
waltz(0.0, 2.75)
for n in ('F3', 'A3', 'C4', 'E4'): mus.add(pad(N(n), 2.8, a=0.2, r=1.2), 3.55, 0.08)
# 6.4-9.6: the rewind: a falling sweep of plucks
for i in range(18): mus.add(pluck(N(['E6', 'C6', 'A5', 'F5', 'E5', 'C5'][i % 6]), 0.3, 0.6), 6.45 + i * 0.17, 0.12 * (1 - i / 22))
# 9.6-88.5: slow motion: a held low pad (D minor), slow heartbeat pulses, glassy bells
mus.add(pad(N('D2'), 79, a=3, r=3, warm=0.3), 9.6, 0.32); mus.add(pad(N('A2'), 79, a=5, r=3, warm=0.3), 10.0, 0.2)
for at in np.arange(10.5, 88.0, 1.6): mus.add(kick(0.35), at, 0.11); mus.add(kick(0.3), at + 0.28, 0.06)
for i, n in enumerate(['A5', 'D6', 'F5', 'E6', 'A5', 'C6', 'D6', 'A5']): mus.add(bell(N(n), 3.5), 11.0 + i * 1.6, 0.11, 0.5 * (-1) ** i)   # the inner ear
mus.add(string(N('D4'), 6, a=2), 24.0, 0.12); mus.add(string(N('F4'), 6, a=2), 27.0, 0.1)
mus.add(string(N('A3'), 16, a=4), 34.0, 0.14)                     # the bend
for at, n in ((50.0, 'D4'), (52.5, 'F4'), (55.0, 'A4'), (57.5, 'C5')): mus.add(string(N(n), 4.0, a=1.2), at, 0.14)   # front half turns
for at, n in ((64.0, 'E4'), (66.5, 'G4'), (69.0, 'B4'), (71.5, 'D5')): mus.add(string(N(n), 4.0, a=1.2), at, 0.14)   # back half follows
for i in range(14): mus.add(pluck(N(['D5', 'F5', 'A5', 'C6', 'E6', 'A5', 'F5'][i % 7]), 0.5, 0.6), 76.2 + i * 0.7, 0.1)   # replay
mus.add(string(N('D3'), 10, a=3), 77.0, 0.18); mus.add(string(N('A3'), 10, a=3), 78.0, 0.12)
# 88.5-90.5: silence. 90.5-104: legs out: a rising swell to the landing (99.5), then a warm F major resolve
for n, g in (('F2', 0.25), ('C3', 0.2), ('F3', 0.18), ('A3', 0.15)): mus.add(string(N(n), 9.2, a=6), 90.5, g)
for n in ('F3', 'A3', 'C4', 'F4'): mus.add(pad(N(n), 5.0, a=0.3, r=2), 99.5, 0.12)
for i, n in enumerate(['C6', 'A5', 'F5', 'C6', 'F6']): mus.add(bell(N(n), 2.0), 99.6 + i * 0.5, 0.12, 0.3 * (-1) ** i)
# 104-111.5: the kitten: playful pizzicato in C
for b in range(18):
    at = 104.2 + b * 0.38; mus.add(pluck(N(['C5', 'E5', 'G5', 'E5', 'F5', 'A5', 'G5', 'D5'][b % 8]), 0.3, 0.8), at, 0.13, 0.3 * (-1) ** b)
    if b % 2 == 0: mus.add(bass(N(['C2', 'F2', 'G2', 'C2'][(b // 4) % 4]), 0.35), at, 0.2)
# 111.5-116.5: two falls: suspense (a held fifth), the answer
mus.add(string(N('D3'), 5, a=1), 111.6, 0.16); mus.add(string(N('A3'), 5, a=1), 111.6, 0.12)
# 116.5-125: the waltz again, to the end
waltz(116.5, 124.5, 0.9)
mus.add(pad(N('F3'), 3.0, a=0.5, r=2.0), 122.0, 0.1)

# ---------- effects (one per action) ----------
for i in range(5): fx.add(sfx_tick(2200), 0.6 + i * 0.42, 0.06)          # soft paw steps on the shelf
fx.add(sfx_tick(5200), 1.2, 0.04)                                        # the clock
fx.add(sfx_flip(), 2.55, 0.5); fx.add(sfx_meow(), 2.62, 0.35)           # the paw slips, a yowl
fx.add(sfx_whoosh(0.5, up=False), 3.0, 0.45)                             # the fall
fx.add(sfx_thud(), 3.52, 0.6)                                            # lands
for i in range(4): fx.add(sfx_tick(3000), 3.0 + i * 0.1, 0.12)           # the stopwatch
fx.add(sfx_whoosh(3.0, up=True), 6.4, 0.35)                              # rewind
fx.add(sfx_sparkle(6, 2400), 13.0, 0.18)                                 # the scan opens on the ear
for i in range(6): fx.add(sfx_tick(4800 + 300 * i), 16.5 + i * 0.5, 0.05) # crystals slide
for i in range(5): fx.add(sfx_pop(1800 + i * 200), 18.2 + i * 1.0, 0.1)   # nerve sparks
fx.add(sfx_whoosh(0.8), 25.0, 0.15)                                      # eyes to the floor
fx.add(sfx_sparkle(4, 1800), 28.0, 0.15)                                 # the body scan opens
for i in range(8): fx.add(sfx_pop(900 + i * 180), 28.8 + i * 0.6, 0.12)   # the signal races down
fx.add(sfx_boing(140, 0.6), 38.5, 0.15)                                  # the spine bends
fx.add(sfx_whoosh(1.2), 52.0, 0.3)                                       # front half turns
fx.add(sfx_whoosh(1.2), 66.0, 0.3)                                       # back half follows
fx.add(sfx_tick(3000), 69.6, 0.2)                                        # "80 ms later"
fx.add(sfx_whoosh(3.0, up=False), 76.0, 0.2)                             # replay
fx.add(sfx_whoosh(2.0), 91.0, 0.18)                                      # legs out
fx.add(sfx_thud(), 99.5, 0.55); fx.add(lowpass(noise(0.8), 900) * np.exp(-np.linspace(0, 6, int(0.8 * SR))) * 0.4, 99.55, 0.3)   # landing + dust
fx.add(sfx_meow(), 101.5, 0.3)
fx.add(sfx_whoosh(0.5), 104.0, 0.3)                                      # whip to the sofa
fx.add(sfx_flip(), 105.3, 0.3); fx.add(sfx_boing(220, 0.5), 106.4, 0.25) # 3 weeks: the flop
fx.add(sfx_meow(), 107.0, 0.25)
fx.add(sfx_flip(), 108.5, 0.3); fx.add(sfx_pop(700), 109.6, 0.25)       # 7 weeks: on its feet
fx.add(sfx_whoosh(0.5), 111.5, 0.3)
fx.add(sfx_boing(160, 0.5), 114.05, 0.2); fx.add(sfx_thud(), 116.0, 0.35) # cushion / the shelf cat lands
fx.add(sfx_flip(), 117.0, 0.4); fx.add(sfx_whoosh(0.5, up=False), 117.5, 0.4); fx.add(sfx_thud(), 118.0, 0.5)
for i in range(10): fx.add(sfx_tick(2200), 119.0 + i * 0.36, 0.05)        # paws walking off
fx.add(sfx_meow(), 121.5, 0.25)

mus.reverb(0.3).write(os.path.join(here, 'audio', 'music.wav'), gain=0.5)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.9)
