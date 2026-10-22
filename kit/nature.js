// kit/nature.js — reusable nature props for the flat-vector look (y up). Units are the caller's (screen-like px at h = 1080).
// Nature.fish, Nature.school, Nature.whale, Nature.jelly, Nature.bubbles (screen), Nature.cloud (one soft shape),
// Nature.bird (a gull, flapping), Nature.palm, Nature.tree (round crown), Nature.rain (screen streaks), Nature.waves.
const Nature = {};
// a small fish facing +x (dir -1 flips); profile face
Nature.fish = (t, x, y, s, col, seed = 0, dir = 1) => {
  const w = Math.sin(t * 9 + seed) * 0.25;
  P.at(x, y, 0, s * dir, s, () => {
    P.poly([[-40, 0], [-64, 18 + w * 20], [-64, -18 + w * 20]], P.mixc(col, '#000000', 0.18));
    P.lit(P.blobPts(0, 0, 46, 24, 12, 0.02, seed + 3), col, { d: 0.2, rim: 'rgba(255,255,255,0.35)' });
    P.smooth([[-6, 18], [14, 30], [20, 14]], P.mixc(col, '#000000', 0.12));
    Cast.profileFace(t, 22, 6, 9, { mood: 'smile', seed, mouth: [1.6, -0.9], nose: false });
  });
};
// a school crossing from x0 to x1 between t0 and t1 around height y
Nature.school = (t, t0, t1, x0, x1, y, n = 14, cols = ['#ffb25a', '#ff7f6e'], s = 0.6, seed = 1) => {
  const u = K.clamp((t - t0) / (t1 - t0)); if (u <= 0 || u >= 1) return;
  const dir = x1 > x0 ? 1 : -1;
  for (let i = 0; i < n; i++) Nature.fish(t, K.lerp(x0, x1, u) + (K.hash(i, seed) * 2 - 1) * 220 + Math.sin(t * 2 + i) * 14, y + (K.hash(i, seed + 1) * 2 - 1) * 90, s * (0.8 + 0.4 * K.hash(i, seed + 2)), cols[i % cols.length], i + seed, dir);
};
// the whale's head is at +x; dir -1 faces it left (always set dir to the way it travels)
Nature.whale = (t, x, y, s, col = '#2d5580', dir = 1) => P.at(x, y, Math.sin(t * 0.6) * 0.04, s * dir, s, () => {
  const tail = Math.sin(t * 1.6) * 30, dark = P.mixc(col, '#0a1a30', 0.4);
  P.smooth([[-380, 10], [-200, 70], [120, 90], [340, 40], [400, -10], [300, -60], [0, -70], [-260, -30], [-420, 30 + tail * 0.3]], P.lin(0, 90, 0, -70, P.mixc(col, '#ffffff', 0.15), dark));
  P.poly([[-400, 20 + tail * 0.4], [-520, 90 + tail], [-470, 10 + tail * 0.5], [-520, -60 + tail]], dark);
  P.smooth([[60, -40], [140, -40], [120, -110 + Math.sin(t * 1.2) * 10], [70, -80]], dark);
  P.circle(300, 10, 9, '#0c1c30');
});
Nature.jelly = (t, x, y, s, seed = 0, col = '255,170,225') => {
  const p = Math.sin(t * 2.4 + seed);
  P.at(x, y, 0, s * (1 + p * 0.06), s * (1 - p * 0.06), () => {
    P.glow(0, 10, 90, col, 0.35);
    for (let i = 0; i < 5; i++) P.ribbon([[-24 + i * 12, -6], [-24 + i * 12 + Math.sin(t * 3 + i) * 8, -60], [-24 + i * 12 + Math.sin(t * 3 + i + 1) * 12, -110]], [5, 4, 1], `rgba(${col},0.6)`);
    P.smooth([[-40, -4], [-34, 26], [0, 42], [34, 26], [40, -4], [0, 2]], `rgba(${col},0.78)`);
  });
};
// bubbles rising across the whole screen (screen space); box [x0, x1, yTop, yBottom] limits them (screen px)
Nature.bubbles = (t, n, seed, a = 1, speed = 120, box = [0, 1920, 0, 1080]) => P.screen((ctx) => {
  const [x0, x1, yt, yb] = box, hgt = yb - yt + 100;
  for (let i = 0; i < n; i++) {
    const x = x0 + K.hash(i, seed) * (x1 - x0) + Math.sin(t * 1.5 + i) * 18, y = yb + 50 - ((K.hash(i, seed + 1) * hgt + t * speed * (0.6 + K.hash(i, seed + 2))) % hgt), r = 3 + 10 * K.hash(i, seed + 3);
    ctx.globalAlpha = a * 0.55; ctx.strokeStyle = '#d8f6ff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke();
    ctx.globalAlpha = a * 0.5; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, 6.3); ctx.fill();
  }
});
// a fluffy cloud as one soft shape: darker underside layer, body, soft highlights (no per-blob outlines)
Nature.cloud = (x, y, s, seed, col = '#ffffff') => {
  const pts = [[-120, 0, 70], [-50, 30, 90], [40, 40, 100], [120, 10, 75], [0, -10, 110]], dark = P.mixc(col, '#3a3470', 0.28);
  P.at(x, y, 0, s, s, () => {
    P.blob(0, -36, 200, 52, dark, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy - 16, r, r * 0.8, dark, { seed: seed + cx, n: 10, w: 0.08 });
    P.blob(0, -22, 196, 50, col, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy + 2, r * 0.95, r * 0.76, col, { seed: seed + cx, n: 10, w: 0.08 });
    for (const [cx, cy, r] of pts) P.blob(cx - r * 0.2, cy + r * 0.38, r * 0.5, r * 0.22, 'rgba(255,255,255,0.16)', { seed: seed + cx + 1, n: 8, w: 0.15 });
  });
};
// a gull, flapping, flying toward dir
Nature.bird = (t, x, y, s, seed = 0, dir = 1, col = '#ffffff') => {
  const f = Math.sin(t * 11 + seed);
  P.at(x, y, 0, s * dir, s, () => {
    P.ribbon([[-34, 6 + f * 22], [-12, 2], [0, 0]], [10, 8, 6], col); P.ribbon([[0, 0], [14, 2], [36, 8 + f * 22]], [6, 8, 10], P.mixc(col, '#8a9ab0', 0.2));
    P.blob(2, 0, 16, 8, col, { seed }); P.circle(16, 3, 6, col); P.poly([[20, 4], [30, 1], [20, 0]], '#ffb03a'); P.circle(18, 5, 1.6, '#222');
  });
};
// a palm tree on the ground at (x, y), height h (units), swaying
Nature.palm = (t, x, y, h, seed = 0) => {
  const lean = Math.sin(seed * 3) * 0.25, sway = Math.sin(t * 1.4 + seed) * 0.04, tx = x + Math.sin(lean) * h, ty = y + Math.cos(lean) * h;
  P.ribbon([[x, y], [x + Math.sin(lean) * h * 0.5, y + h * 0.5], [tx, ty]], [h * 0.09, h * 0.075, h * 0.06], P.lin(x - 10, 0, x + 10, 0, '#b07a46', '#7a5030'));
  for (let k = 0; k < 7; k++) { const a = -2.6 + k * 0.85 + sway * 3 + Math.sin(t * 2 + k + seed) * 0.05, L = h * (0.55 + 0.1 * (k % 2)); P.ribbon([[tx, ty], [tx + Math.cos(a) * L * 0.5, ty + Math.sin(a) * L * 0.5 + L * 0.18], [tx + Math.cos(a) * L, ty + Math.sin(a) * L - L * 0.12]], [h * 0.09, h * 0.07, 2], k % 2 ? '#3f9f55' : '#2f8a48'); }
  P.circle(tx, ty - h * 0.03, h * 0.05, '#6e4a26');
};
// a round-crowned tree (forest filler)
Nature.tree = (t, x, y, h, col = '#3f8f45', seed = 0) => {
  P.ribbon([[x, y], [x, y + h * 0.5]], [h * 0.08, h * 0.06], '#6e4a2a');
  P.lit(P.blobPts(x + Math.sin(t + seed) * h * 0.01, y + h * 0.66, h * 0.36, h * 0.32, 10, 0.12, seed), P.lin(x, y + h, x, y + h * 0.35, P.mixc(col, '#ffffff', 0.2), col), { d: 0.25, shade: 'rgba(10,40,20,0.3)', rim: 'rgba(230,255,190,0.3)' });
};
// rain streaks across a screen rectangle
Nature.rain = (t, a, box = [0, 1920, 0, 1080], seed = 5) => { if (a <= 0) return; P.screen((ctx) => { const [x0, x1, y0, y1] = box; ctx.strokeStyle = `rgba(220,235,255,${0.45 * a})`; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; for (let i = 0; i < 70; i++) { const x = x0 + ((K.hash(i, seed) * (x1 - x0) + t * 120) % (x1 - x0)), y = y0 + ((K.hash(i, seed + 1) * (y1 - y0) + t * 900) % (y1 - y0)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 40); ctx.stroke(); } }); };
