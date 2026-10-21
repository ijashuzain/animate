"""tools2/synth.py: a small deterministic synthesizer for film scores and sound effects (numpy only).
Each film writes its own score.py that imports this, places notes and effects on a timeline, and calls write().
    from synth import *
    mix = Mix(30.0)
    mix.add(pluck(note('D4'), 0.6), at=1.0, gain=0.4, pan=-0.2)
    mix.add(sfx_pop(), at=8.4)
    mix.write('audio/music.wav')
"""
import numpy as np, wave

SR = 44100
rng = np.random.default_rng(7)
NOTES = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def note(n):
    """'A4' -> 440 Hz"""
    name, octave = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((NOTES[name] + 12 * (octave + 1) - 69) / 12)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.01, d=0.1, s=0.7, r=0.2):
    """ADSR over n samples (sustain until the release)"""
    e = np.ones(n) * s
    ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
    ai = min(ai, n); e[:ai] = np.linspace(0, 1, ai, endpoint=False) if ai else e[:ai]
    di = min(di, n - ai); e[ai:ai + di] = np.linspace(1, s, di) if di else e[ai:ai + di]
    ri = min(ri, n); e[n - ri:] *= np.linspace(1, 0, ri) if ri else 1
    return e


def lowpass(x, cut):
    """one-pole low-pass; cut in Hz (scalar or per-sample array)"""
    a = np.exp(-2 * np.pi * np.broadcast_to(cut, x.shape) / SR)
    y = np.zeros_like(x); p = 0.0
    for i in range(len(x)):
        p = (1 - a[i]) * x[i] + a[i] * p; y[i] = p
    return y


def highpass(x, cut):
    return x - lowpass(x, cut)


def noise(d):
    return rng.standard_normal(int(d * SR))


# ---------- instruments ----------
def pluck(f, d=0.8, bright=0.6):
    """a soft marimba/kalimba-like pluck"""
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.3 * bright * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 18) + 0.15 * np.sin(2 * np.pi * 4.01 * f * t) * np.exp(-t * 30)
    return x * np.exp(-t * (3.0 + f / 400)) * env(len(t), 0.003, 0.05, 1, 0.05)


def pad(f, d, warm=0.5, a=0.8, r=1.0):
    """a detuned saw-ish pad, filtered"""
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * t + k) / k * (warm ** (k - 1)) for k in range(1, 7) for _ in [0])
    x = x + sum(np.sin(2 * np.pi * f * (1 + det) * t) for det in (-0.004, 0.0035)) * 0.5
    return x * env(len(t), a, 0.3, 0.8, r) * 0.35


def bass(f, d):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)) * env(len(t), 0.01, 0.2, 0.7, 0.15)


def bell(f, d=2.0):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 3) + 0.25 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t * 6)) * np.exp(-t * 1.6) * env(len(t), 0.002, 0.1, 1, 0.1)


def string(f, d, a=0.3):
    t = t_(d)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    return lowpass(x, 2200) * env(len(t), a, 0.2, 0.85, 0.4) * 0.5


def kick(d=0.5):
    t = t_(d)
    return np.sin(2 * np.pi * (45 + 90 * np.exp(-t * 25)) * t) * np.exp(-t * 7)


# ---------- sound effects ----------
def sfx_pop(f=900):
    t = t_(0.15)
    return np.sin(2 * np.pi * f * (1 + 2 * np.exp(-t * 60)) * t) * np.exp(-t * 35)


def sfx_tick(f=2400):
    t = t_(0.05)
    return (np.sin(2 * np.pi * f * t) + 0.5 * noise(0.05)) * np.exp(-t * 120) * 0.6


def sfx_whoosh(d=0.8, up=True):
    n = noise(d); u = np.linspace(0, 1, len(n))
    cut = 300 + 3500 * (u if up else 1 - u) ** 1.5
    return lowpass(n, cut) * np.sin(np.pi * u) ** 1.5 * 0.9


def sfx_thud():
    t = t_(0.35)
    return (np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 30)) * t) + 0.4 * lowpass(noise(0.35), 600)) * np.exp(-t * 14)


def sfx_crackle(d):
    """fire: dense random crackles over a low roar"""
    n = int(d * SR); x = lowpass(noise(d), 400) * 0.35
    for _ in range(int(d * 40)):
        i = rng.integers(0, max(1, n - 800)); L = rng.integers(80, 600)
        x[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.3, 1)
    return x * env(n, 0.4, 0.1, 1, 0.5)


def sfx_crunch(d=0.5):
    """digging, a root pushing through soil"""
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 30)):
        i = rng.integers(0, max(1, n - 1500)); L = rng.integers(300, 1500)
        x[i:i + L] += lowpass(rng.standard_normal(L), 1200) * np.exp(-np.arange(L) / (L / 3))
    return x


def sfx_fwip(up=True):
    t = t_(0.25)
    f = 300 + (1800 if up else -200) * (t / 0.25) ** 2
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.25) * 0.5


def sfx_whale(d=1.8):
    t = t_(d)
    f = 120 + 40 * np.sin(np.pi * t / d) + 10 * np.sin(2 * np.pi * 3 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return lowpass(x, 900) * np.sin(np.pi * t / d) ** 2 * 0.7


def sfx_wind(d):
    n = noise(d); u = np.linspace(0, 1, len(n))
    return lowpass(n, 500 + 700 * np.sin(np.pi * u)) * np.sin(np.pi * u) * 0.8


def sfx_sparkle(n=6, f0=2000):
    out = np.zeros(int(0.9 * SR))
    for i in range(n):
        b = bell(f0 * (1 + 0.25 * i), 0.5) * 0.3; s = int(i * 0.07 * SR); out[s:s + len(b)] += b[:len(out) - s]
    return out


def sfx_splash():
    t = t_(0.9)
    return highpass(noise(0.9), 1500) * np.exp(-t * 4) * 0.5


def sfx_meow():
    t = t_(0.45)
    f = 600 + 250 * np.sin(np.pi * t / 0.45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.45) * 0.35


# ---------- mixing ----------
class Mix:
    def __init__(self, dur):
        self.n = int(dur * SR); self.L = np.zeros(self.n); self.R = np.zeros(self.n)

    def add(self, x, at, gain=1.0, pan=0.0):
        s = int(at * SR)
        if s >= self.n: return
        x = x[:self.n - s] * gain
        self.L[s:s + len(x)] += x * np.sqrt((1 - pan) / 2) * 1.414
        self.R[s:s + len(x)] += x * np.sqrt((1 + pan) / 2) * 1.414

    def reverb(self, wet=0.25):
        """a cheap stereo reverb: a few decaying taps"""
        for ch, taps in ((self.L, (0.031, 0.067, 0.113, 0.171)), (self.R, (0.037, 0.073, 0.127, 0.189))):
            dry = ch.copy()
            for k, d in enumerate(taps):
                i = int(d * SR); g = wet * (0.7 ** k)
                ch[i:] += dry[:-i] * g
        return self

    def write(self, path, peak=0.89, gain=1.0):
        m = max(np.abs(self.L).max(), np.abs(self.R).max(), 1e-9)
        k = peak / m * gain
        data = (np.stack([self.L, self.R], 1) * k * 32767).astype(np.int16)
        with wave.open(path, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
        print('wrote', path, f'{self.n / SR:.1f}s')
