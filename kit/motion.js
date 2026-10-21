// kit/motion.js — time, easing and keyframe tracks. Everything is a pure function of t (seconds), so any frame can be
// rendered in any order (HyperFrames seeks). No clocks, no Math.random: use rng(seed).
const K = {};
K.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
K.lerp = (a, b, u) => a + (b - a) * u;
K.inv = (a, b, v) => K.clamp((v - a) / (b - a));
K.mix = (a, b, u) => a.map((x, i) => K.lerp(x, b[i], u));
// eases: GSAP-like names. back/elastic give overshoot (anticipation and settle are the two halves of acting)
K.ease = {
  linear: (u) => u,
  in: (u) => u * u * u, out: (u) => 1 - Math.pow(1 - u, 3), inOut: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  in2: (u) => u * u, out2: (u) => 1 - (1 - u) * (1 - u), inOut2: (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
  expoIn: (u) => (u === 0 ? 0 : Math.pow(2, 10 * u - 10)), expoOut: (u) => (u === 1 ? 1 : 1 - Math.pow(2, -10 * u)),
  expoInOut: (u) => (u === 0 ? 0 : u === 1 ? 1 : u < 0.5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2),
  backOut: (u, s = 1.70158) => 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2),
  backIn: (u, s = 1.70158) => (s + 1) * u * u * u - s * u * u,
  elasticOut: (u) => (u === 0 || u === 1 ? u : Math.pow(2, -10 * u) * Math.sin((u * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
};
// a tween value: 0 before t0, eased 0..1 between t0 and t1, 1 after
K.tw = (t, t0, t1, e = 'inOut') => K.ease[e](K.inv(t0, t1, t));
// keyframe track: [[t, value, ease-into-this-key], ...]; values may be numbers or arrays
K.track = (keys) => (t) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e = 'inOut'] = keys[i];
    if (t <= t1) { const [t0, v0] = keys[i - 1]; const u = K.ease[e](K.inv(t0, t1, t)); return Array.isArray(v0) ? K.mix(v0, v1, u) : K.lerp(v0, v1, u); }
  }
  return keys[keys.length - 1][1];
};
// log-space track (for zoom: equal ratios feel like equal speed)
K.logTrack = (keys) => { const tr = K.track(keys.map(([t, v, e]) => [t, Math.log(v), e])); return (t) => Math.exp(tr(t)); };
// a damped spring settle from 1 to 0 after t0 (wobbles, landings)
K.settle = (t, t0, freq = 6, damp = 5) => (t < t0 ? 0 : Math.exp(-damp * (t - t0)) * Math.cos(freq * 2 * Math.PI * (t - t0)));
// squash/stretch pair for a hit at t0: returns [sx, sy]
K.squash = (t, t0, amt = 0.25, dur = 0.35) => { const s = K.settle(t, t0, 1 / dur, 6) * amt; return [1 + s, 1 - s]; };
// deterministic random
K.rng = (seed) => { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) | 0; s = s >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
K.hash = (a, b = 0) => { let n = (a * 374761393 + b * 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
// smooth 1D value noise
K.noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return K.lerp(K.hash(i, seed), K.hash(i + 1, seed), u) * 2 - 1; };
