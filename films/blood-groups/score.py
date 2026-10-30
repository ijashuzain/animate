"""Why Do We Have Different Blood Types? A warm heartbeat-led score that follows one red cell's life:
a soft pulse (low kick pairs like a heartbeat) under marimba-like plucks in D major for the journey; glassy bells for the
sugar chains and each group's tip; a dark low string drone for the wrong transfusion; an open warm pad for the
ancestors and the jungle; uneasy minor bells for the germs; the opening theme returns at the end.
One sound per action: lancet click, drop, dives, marrow bubbles, the nucleus pop, enzyme clicks (A high, B lower),
the missing letter, antibody boops, the clump crunch and bursts, the bag lift, footsteps, birds, the mosquito, the scale.
    python3 films/blood-groups/score.py  ->  audio/music.wav, audio/sfx.wav"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools2'))
from synth import *

import json, subprocess
here = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
# the picture follows the voice-over (align.py -> src/timing.js): every cue below is written in planned time (0-244 s)
# and placed at the matching moment of the film
TM = json.loads(open(os.path.join(here, 'src', 'timing.js')).read().split('const TIMING = ')[1].strip().rstrip(';'))
V, PL, D = TM['VOICE'], TM['PLAN'], TM['D']
def to_film(tp):
    for i in range(len(PL) - 1):
        if tp < PL[i + 1] or i == len(PL) - 2: return V[i] + (V[i + 1] - V[i]) * (tp - PL[i]) / (PL[i + 1] - PL[i])
class WMix(Mix):
    def add(self, x, at, gain=1.0, pan=0.0): super().add(x, max(0.0, to_film(at)), gain, pan)
mus, fx = WMix(D), WMix(D)
N = note

def heartbeat(t0, t1, gain=1.0, rate=1.05):
    at = t0
    while at < t1: mus.add(kick(0.35), at, 0.12 * gain); mus.add(kick(0.3), at + 0.26, 0.07 * gain); at += rate

def journey(t0, t1, gain=1.0, key='D'):
    """marimba-like plucks over a slow chord cycle, 0.35 s a step"""
    prog = {'D': [('D', ['F#', 'A', 'D']), ('B', ['D', 'F#', 'B']), ('G', ['B', 'D', 'G']), ('A', ['C#', 'E', 'A'])],
            'Dm': [('D', ['F', 'A', 'D']), ('Bb', ['D', 'F', 'Bb']), ('G', ['Bb', 'D', 'G']), ('A', ['C#', 'E', 'A'])]}[key]
    i, at = 0, t0
    while at < t1 - 0.1:
        root, ch = prog[(i // 8) % 4]
        if i % 8 == 0: mus.add(bass(N(root + '2'), 2.6), at, 0.22 * gain); mus.add(pad(N(root + '3'), 2.8, a=0.4, r=1.0), at, 0.05 * gain)
        mus.add(pluck(N(ch[i % 3] + ('5' if i % 4 < 2 else '4')), 0.5, 0.5), at, 0.09 * gain, 0.35 * ((-1) ** i))
        i += 1; at += 0.35

# 0-10 hook: a bright little motif, a hush on the dive, the four cells
for i, n in enumerate(['D5', 'F#5', 'A5', 'F#5']): mus.add(bell(N(n), 1.4), 0.3 + i * 0.45, 0.08)
mus.add(pad(N('D3'), 6, a=1.5, r=2), 2.8, 0.12); mus.add(pad(N('A3'), 6, a=1.8, r=2), 3.0, 0.08)
for i, n in enumerate(['A4', 'C#5', 'E5', 'A5']): mus.add(bell(N(n), 2.0), 6.7 + i * 0.35, 0.09)
# 10-110: the journey theme with a heartbeat, quieter under the dense explanations
heartbeat(10, 110, 0.9)
journey(10, 40, 1.0)
for at in (40, 46, 52): mus.add(pad(N('F#3'), 7, a=2, r=2), at, 0.08); mus.add(pad(N('B3'), 7, a=2, r=2), at + 0.5, 0.06)   # the surface: glassy, open
journey(56, 96, 0.8)
journey(96, 110, 1.0)
# 110-140 antibodies and the baby: lighter, curious
heartbeat(110, 140, 0.7, 1.2)
for i in range(16): mus.add(bell(N(['E5', 'G#5', 'B5', 'E6'][i % 4]), 1.6), 110.5 + i * 0.95, 0.06, 0.4 * (-1) ** i)
mus.add(pad(N('E3'), 14, a=3, r=3), 126, 0.1); mus.add(pad(N('B3'), 14, a=3, r=3), 126.5, 0.07)
# 140-160 the wrong blood: a low string drone, a faster heartbeat, a dark swell at the burst
mus.add(string(N('D2'), 20, a=2), 140, 0.2); mus.add(string(N('Ab2'), 14, a=4), 146, 0.12)
heartbeat(144, 158, 1.3, 0.62)
mus.add(string(N('D3'), 4, a=0.6), 154, 0.16)
# 160-172 the bank: relief
journey(160, 172, 0.8)
# 172-200 ancestors: an open warm pad, slow bells, the jungle
for at, n in ((172, 'D3'), (172.5, 'A3'), (173, 'F#4')): mus.add(pad(N(n), 28, a=4, r=4, warm=0.6), at, 0.1)
for i in range(14): mus.add(bell(N(['A5', 'F#5', 'D5', 'E5', 'B4', 'D5', 'A4'][i % 7]), 3.0), 173 + i * 1.9, 0.07, 0.5 * (-1) ** i)
# 200-220 germs: uneasy minor bells and a low pulse
mus.add(pad(N('D3'), 20, a=2, r=2, warm=0.2), 200, 0.12); mus.add(pad(N('F3'), 20, a=2, r=2, warm=0.2), 200.3, 0.08)
for i in range(20): mus.add(bell(N(['F5', 'D5', 'Bb4', 'C#5'][i % 4]), 1.5), 200.4 + i * 0.95, 0.06, 0.4 * (-1) ** i)
heartbeat(204, 218, 0.8, 0.9)
# 220-244 the variety and the end: the journey theme returns, resolving on D
journey(220, 241, 0.9)
heartbeat(232, 241, 0.7)
for n in ('D3', 'A3', 'D4', 'F#4'): mus.add(pad(N(n), 4, a=0.4, r=2.5), 240.6, 0.1)

# ---------- effects ----------
fx.add(sfx_whoosh(0.5), 0.3, 0.25); fx.add(sfx_tick(3200), 0.78, 0.3); fx.add(sfx_pop(1400), 0.8, 0.2)   # the lancet click
fx.add(sfx_gulp(), 1.2, 0.2); fx.add(sfx_bubble(300), 2.0, 0.2)                                          # the drop swells
fx.add(sfx_whoosh(1.0), 2.6, 0.35)                                                                        # dive into the drop
for i in range(4): fx.add(sfx_pop(500 + i * 120), 6.6 + i * 0.35, 0.22)                                  # the four cells
fx.add(sfx_whoosh(0.8), 10, 0.2)
for i in range(10): fx.add(sfx_bubble(260 + (i % 4) * 60), 16.5 + i * 1.3, 0.12)                        # marrow bubbling
for i in range(16): fx.add(sfx_tick(2600 + (i % 3) * 300), 23.4 + i * 0.37, 0.07)                        # the counter
fx.add(sfx_fwip(), 32.5, 0.2); fx.add(sfx_pop(600), 34.3, 0.35); fx.add(sfx_gulp(), 36.4, 0.3)           # nucleus out, swallowed
fx.add(sfx_whoosh(0.6), 35.6, 0.2); fx.add(sfx_tick(1800), 37.7, 0.2)                                    # flattens; the scale bar
fx.add(sfx_whoosh(0.8), 40, 0.25); fx.add(sfx_sparkle(6, 1800), 41.2, 0.12)                              # onto the surface
fx.add(sfx_fwip(), 48.1, 0.15); fx.add(sfx_whoosh(1.2, up=False), 50.6, 0.15)                            # the gene; the enzyme arrives
fx.add(sfx_pop(1100), 54.3, 0.4); fx.add(sfx_sparkle(5, 2400), 54.5, 0.15)                               # click: the sugar goes on
for at, f in ((57, 1200), (57.6, 1200), (58.2, 1200), (62.5, 800), (63.1, 800), (63.7, 800), (68.5, 1200), (69.1, 800), (69.7, 1200)): fx.add(sfx_pop(f), at, 0.25)
fx.add(sfx_whoosh(0.6), 74, 0.2); fx.add(sfx_boing(140, 0.5), 77.7, 0.25)                                 # the missing letter
fx.add(sfx_crunch(0.5), 80.8, 0.3); fx.add(sfx_crackle(1.2), 81, 0.12)                                    # the enzyme falls apart
fx.add(sfx_pop(700), 86.3, 0.3); fx.add(sfx_sparkle(6, 1600), 87.5, 0.12)
for i in range(8): fx.add(sfx_pop(500 + i * 70), 90.6 + i * 0.25, 0.2)                                   # the 8 groups pop in
fx.add(sfx_whoosh(1.2), 96, 0.25); fx.add(sfx_splat(), 102.5, 0.15); fx.add(sfx_fwip(), 104.5, 0.15)    # into the capillary, the squeeze
fx.add(sfx_whoosh(0.6), 106, 0.2)
for i in range(10): fx.add(sfx_bubble(700 + (i % 3) * 120), 111 + i * 1.4, 0.08)                        # antibodies drifting
fx.add(sfx_boing(260, 0.4), 122, 0.15)
fx.add(sfx_chatter(0.6), 127.5, 0.08)                                                                     # the baby
for i in range(8): fx.add(sfx_pop(900 + i * 50), 135 + i * 0.3, 0.15)                                   # antibodies appear
fx.add(lowpass(noise(3.5), 1200) * 0.15, 140.3, 0.2)                                                      # the drip line
for i in range(5): fx.add(sfx_tick(1500), 140.5 + i * 0.7, 0.12)
fx.add(sfx_whoosh(1.0), 144, 0.25)
for i in range(12): fx.add(sfx_tick(900 + (i % 3) * 200), 148.5 + i * 0.4, 0.15)                         # antibodies latch on
fx.add(sfx_crunch(0.8), 152.5, 0.35)                                                                      # the clump
for i in range(7): fx.add(sfx_splat(), 154 + i * 0.35, 0.22); fx.add(sfx_pop(300 + i * 40), 154.05 + i * 0.35, 0.18)   # bursts
fx.add(sfx_fwip(), 166.5, 0.25); fx.add(sfx_sparkle(6, 2000), 165, 0.12)                                 # O- lifts
fx.add(sfx_whoosh(1.4, up=False), 173, 0.2)
for i in range(12): fx.add(sfx_tick(700), 184.2 + i * 0.4, 0.1)                                          # footsteps
fx.add(sfx_wind(5), 184, 0.1)
for i in range(6): fx.add(sfx_chatter(0.3), 189.5 + i * 1.6, 0.06)                                       # forest birds / gibbon calls
fx.add(sfx_whoosh(0.8), 189.3, 0.15)
fx.add(lowpass(noise(4), 4000) * np.sin(np.linspace(0, 2 * np.pi * 600 * 4, int(4 * SR))) * 0.05, 200, 0.25)   # mosquito whine
for i in range(7): fx.add(sfx_tick(800), 205 + i * 0.4, 0.15)                                            # cells sticking
fx.add(sfx_whoosh(0.6), 212, 0.2)
for i in range(6): fx.add(sfx_flip(), 217.2 + i * 0.5, 0.06)                                            # the scale rocking
fx.add(sfx_whoosh(0.8), 220, 0.2)
for i in range(9): fx.add(sfx_pop(600 + i * 60), 226.2 + i * 0.12, 0.15)                                 # the crowd
fx.add(sfx_gulp(), 235.6, 0.3)
for i in range(8): fx.add(sfx_bubble(320 + i * 30), 236.8 + i * 0.4, 0.12)
fx.add(sfx_whoosh(1.6), 240, 0.2)

# duck the music under the voice: an envelope of the voice's loudness, smoothed, pulls the music down while it speaks
vp = os.path.join(here, 'audio', 'voice-aligned.wav')
if os.path.exists(vp):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vp, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    vx = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768)
    win = int(0.25 * SR); env = np.convolve(vx, np.ones(win) / win, mode='same'); env = np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)
    env = np.convolve(env, np.ones(int(0.4 * SR)) / int(0.4 * SR), mode='same')
    env = np.pad(env, (0, max(0, mus.n - len(env))))[:mus.n]
    duck = 1 - 0.6 * np.clip(env * 1.3, 0, 1)
    mus.L *= duck; mus.R *= duck
mus.reverb(0.3).write(os.path.join(here, 'audio', 'music.wav'), gain=0.32)
fx.reverb(0.12).write(os.path.join(here, 'audio', 'sfx.wav'), gain=0.5)
