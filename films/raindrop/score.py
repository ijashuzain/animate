"""The Raindrop: Drip's theme (F major, lo-fi and bubbly) changes instrument at every stop; a sound for every action.
    python3 films/raindrop/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

D = 117.5
here = os.path.dirname(os.path.abspath(__file__))
mus, fx = Mix(D), Mix(D)
N = note
B = 0.625  # one beat at 96 bpm
THEME = [('C5', 0), ('A4', 1), ('F4', 1.5), ('G4', 2), ('A4', 3)]  # Drip's little motif (beats)


def theme(at, inst, octave=0, gain=0.4, pan=0.0):
    for n, b in THEME:
        nn = n[:-1] + str(int(n[-1]) + octave)
        mus.add(inst(N(nn)), at + b * B, gain, pan)


def chords(t0, t1, prog, inst_gain=0.22, bass_gain=0.4, beat_kick=0.0, arp=None, arp_gain=0.18, octave=4):
    """one chord per bar (4 beats) from prog [(root, [notes])]; optional kick and 8th-note arpeggio"""
    b = 0
    while t0 + b * B < t1 - 0.05:
        at = t0 + b * B; root, ch = prog[(b // 4) % len(prog)]
        if b % 4 == 0:
            for n in ch: mus.add(pad(N(n + '3'), B * 4.2, a=0.3), at, inst_gain / len(ch) * 2)
        mus.add(bass(N(root + '2'), B * 0.9), at, bass_gain if b % 2 == 0 else bass_gain * 0.6)
        if beat_kick: mus.add(kick(0.3), at, beat_kick if b % 2 == 0 else beat_kick * 0.5)
        if arp:
            for k in range(2): nn = ch[(b * 2 + k) % len(ch)] + str(octave); mus.add(arp(N(nn)), at + k * B / 2, arp_gain, 0.3 * (-1) ** k)
        b += 1


F, C_, Dm, Bb, Am, Gm = ('F', ['F', 'A', 'C']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F', 'A']), ('Bb', ['Bb', 'D', 'F']), ('A', ['A', 'C', 'E']), ('G', ['G', 'Bb', 'D'])
soft = lambda f: pluck(f, 1.0, 0.3)
bright = lambda f: pluck(f, 0.5, 0.9)
# 0-11: the window: soft motif over a warm pad, rain
for n in ('F3', 'A3', 'C4', 'E4'): mus.add(pad(N(n), 11.5, a=2.0), 0, 0.12)
theme(1.0, soft, 0, 0.35); theme(5.2, soft, 0, 0.3, 0.2)
# 10.2-15.6: inside the drop: the motif, bright, and a bubbly bass
chords(10.2, 15.0, [F, C_], 0.15, 0.3, arp=bright, arp_gain=0.14, octave=5); theme(11.6, bright, 1, 0.3)
# 15-26: the deep: dark pads, slow bass, sparse bells
for at, (n1, n2) in ((15.0, ('D3', 'A3')), (20.0, ('Bb2', 'F3'))): mus.add(pad(N(n1), 5.4, a=1.5), at, 0.3); mus.add(pad(N(n2), 5.4, a=1.5), at, 0.2)
for i, n in enumerate(['A5', 'F5', 'D5', 'C5', 'A4', 'D5']): mus.add(bell(N(n), 2.5), 15.5 + i * 1.6, 0.18, 0.4 * (-1) ** i)
mus.add(pad(N('F3'), 3.0, a=1.0), 24.0, 0.25)
# 26-38: the surface: marimba arps, rising, then the launch
chords(25.8, 37.8, [F, C_, Dm, Bb], 0.16, 0.32, arp=bright, arp_gain=0.16, octave=5); theme(27.5, bright, 1, 0.25); theme(32.5, bright, 1, 0.3)
# 38-51: the cold: high airy bells, sparse, a held chord
for n in ('F4', 'C5', 'G5'): mus.add(pad(N(n), 13.0, a=2.5, warm=0.3), 37.6, 0.1)
for i, n in enumerate(['C6', 'A5', 'F5', 'G5', 'A5', 'C6', 'F6']): mus.add(bell(N(n), 2.0), 38.4 + i * 1.7, 0.15, 0.5 * (-1) ** i)
# 50-64: the storm and the fall: a beat with the rain, bass F/C, the motif low
chords(50.6, 63.4, [Dm, Bb, F, C_], 0.18, 0.4, beat_kick=0.3, arp=soft, arp_gain=0.12, octave=4); theme(56.2, soft, -1, 0.3)
# 63-76: the mountain: bright folk plucks
chords(63.6, 75.2, [F, Bb, F, C_], 0.15, 0.3, arp=bright, arp_gain=0.18, octave=5); theme(66.0, bright, 1, 0.22)
# 75-88: the river slide groove
chords(75.2, 87.6, [F, Am, Bb, C_], 0.15, 0.45, beat_kick=0.32, arp=bright, arp_gain=0.18, octave=5); theme(79.0, bright, 1, 0.25); theme(83.0, bright, 1, 0.25)
# 88-90.6: silence. 90.6-104: the twist: strings swell, sepia
for n, g in (('F2', 0.4), ('C3', 0.3), ('A3', 0.25), ('F4', 0.2)): mus.add(string(N(n), 13.0, a=3.0), 90.8, g)
for n, at in (('A4', 95.5), ('G4', 97.0), ('F4', 98.5), ('C5', 100.5), ('A4', 102.0)): mus.add(string(N(n), 1.8, a=0.3), at, 0.25)
# 104-117.5: the theme returns on bells, a warm end chord
for n in ('F3', 'C4', 'A4'): mus.add(pad(N(n), 13.5, a=1.5, r=3.0), 104.0, 0.18)
theme(104.4, lambda f: bell(f, 2.0), 1, 0.3); theme(108.0, lambda f: bell(f, 2.0), 1, 0.3); theme(112.0, soft, 0, 0.3)
for n in ('F3', 'A3', 'C4', 'F4', 'A4'): mus.add(pad(N(n), 2.5, a=0.05, r=1.5), 115.2, 0.18)
mus.add(bell(N('F6'), 2.2), 115.4, 0.25)

# ---------- effects ----------
fx.add(sfx_rain(11.0), 0, 0.55); fx.add(sfx_rain(3.5), 114.0, 0.5)
for at, f0 in ((2.7, 700), (3.8, 800), (5.0, 900)): fx.add(sfx_pop(f0), at, 0.45)        # thought bubbles
fx.add(sfx_whoosh(1.4), 9.6, 0.5)                                                       # dive into the drop
for i in range(10): fx.add(sfx_bubble(400 + 60 * i), 10.4 + i * 0.13, 0.25)
fx.add(sfx_boing(260, 0.5), 11.5, 0.4)                                                  # Drip turns
fx.add(sfx_pop(1300), 13.0, 0.4); fx.add(sfx_pop(1100), 13.6, 0.4)                     # suitcase, passport
fx.add(sfx_whoosh(1.0, up=False), 14.4, 0.5)                                            # out into the ocean
for i in range(14): fx.add(sfx_bubble(300 + 40 * (i % 5)), 15.5 + i * 0.7, 0.18)
fx.add(sfx_whale(2.4), 17.0, 0.45)
for i in range(4): fx.add(sfx_tick(1800), 16.6 + i * 0.45, 0.25)                         # the 97% ring
fx.add(sfx_whoosh(0.5), 19.5, 0.3)
fx.add(sfx_fwip(False), 21.7, 0.3)                                                      # the yawn
fx.add(sfx_stamp(), 23.6, 0.8); fx.add(sfx_stamp(), 49.2, 0.8); fx.add(sfx_stamp(), 84.6, 0.8)
fx.add(sfx_whoosh(2.2), 24.3, 0.4)                                                      # up to the light
for i in range(22): fx.add(sfx_tick(2200 + 300 * (i % 3)), 26.4 + i * (0.22 - i * 0.006), 0.12 + i * 0.01)   # jiggling, faster
fx.add(sfx_boing(160, 0.7), 31.0, 0.6); fx.add(sfx_boing(140, 0.9), 31.9, 0.7)          # trampoline
fx.add(sfx_fwip(), 33.2, 0.6); fx.add(sfx_whoosh(1.8), 33.4, 0.6); fx.add(sfx_sparkle(6, 2600), 33.9, 0.3)   # launch, vapour
fx.add(sfx_wind(4.0), 36.5, 0.3)
fx.add(sfx_chatter(2.4), 38.4, 0.35)                                                    # brrr
fx.add(bell(N('E7'), 0.8), 41.8, 0.2); fx.add(sfx_pop(1600), 41.9, 0.3)                 # the salt crystal
for i in range(8): fx.add(sfx_bubble(500 + 50 * i), 42.2 + i * 0.25, 0.18)              # huddle
fx.add(sfx_whoosh(2.0, up=False), 45.2, 0.45)                                           # pull out
fx.add(sfx_fwip(False), 47.6, 0.25)                                                     # the feather
for i in range(18): fx.add(sfx_bubble(350 + 30 * (i % 6)), 51.0 + i * 0.26, 0.3)        # merges
fx.add(sfx_whoosh(3.0, up=False), 56.2, 0.6); fx.add(sfx_wind(5.0), 57.0, 0.35)          # the fall
fx.add(sfx_pop(500), 58.9, 0.45); fx.add(sfx_pop(450), 59.3, 0.45)                      # the X
fx.add(sfx_boing(220, 0.4), 60.3, 0.4); fx.add(bell(N('A6'), 0.8), 61.0, 0.3)           # bun, ding
fx.add(sfx_splat(), 63.9, 0.9)
fx.add(sfx_pop(260), 66.0, 0.5); fx.add(sfx_pop(240), 68.2, 0.5); fx.add(sfx_pop(280), 70.6, 0.5)   # sign arms
fx.add(sfx_whoosh(1.5), 71.6, 0.6)                                                      # onto the slide
for i in range(5): fx.add(sfx_splash(), 75.6 + i * 0.4, 0.25)                           # rapids
for i in range(6): fx.add(sfx_thud(), 77.0 + i * 0.55, 0.15)                            # the waterwheel
fx.add(sfx_whoosh(0.6), 82.5, 0.4)                                                      # the hat
fx.add(sfx_splash(), 86.2, 0.3)
fx.add(sfx_pop(500), 91.0, 0.4)
for i in range(6): fx.add(sfx_flip(), 92.3 + i * 0.45, 0.5)                             # old pages
fx.add(sfx_whoosh(1.0, up=False), 95.0, 0.4)
fx.add(sfx_splash(), 98.3, 0.3); fx.add(sfx_gulp(), 98.7, 0.8)                          # the gulp
fx.add(sfx_stamp(), 104.6, 0.6); fx.add(sfx_stamp(), 106.0, 0.6); fx.add(sfx_stamp(), 107.6, 0.6)
fx.add(sfx_fwip(), 109.6, 0.5); fx.add(sfx_whoosh(2.0), 109.8, 0.5); fx.add(sfx_sparkle(6, 2600), 110.4, 0.3)
fx.add(sfx_pop(1200), 115.3, 0.4); fx.add(sfx_sparkle(5, 3000), 115.5, 0.3)              # the drop waves

mus.reverb(0.28).write(os.path.join(here, 'audio', 'music.wav'), gain=0.5)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.9)
