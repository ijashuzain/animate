// The spider film's world: two twigs, leaves, and the orb web as geometry (hub, frame, radii, spirals) that the film
// paints in thread by thread. Painted with kit/brush.js.
const W = {};
{
  const { lerp, clamp, noise } = K;
  // twigs: [control points], width; leaves along them
  W.twigs = [
    { cp: [[-40, 250], [180, 230], [420, 205], [640, 195], [760, 210]], w: 30, seed: 11 },
    { cp: [[560, 200], [640, 150], [700, 120], [760, 108]], w: 12, seed: 12 },
    { cp: [[1960, 640], [1760, 610], [1560, 560], [1400, 470], [1300, 380], [1260, 300]], w: 34, seed: 13 },
    { cp: [[1560, 560], [1620, 680], [1640, 800], [1610, 900]], w: 14, seed: 14 },
    { cp: [[360, 1130], [400, 960], [450, 800], [510, 660], [560, 560]], w: 16, seed: 15 },   // a stalk from below
  ];
  W.leaves = [[700, 120, 70, 26, -0.5, 21], [760, 220, 80, 30, 0.4, 22], [300, 215, 64, 24, -2.6, 23], [1300, 330, 76, 28, -1.9, 24], [1430, 470, 70, 26, 2.6, 25], [1640, 820, 84, 30, 1.2, 26], [1610, 900, 70, 26, 2.0, 27], [1780, 615, 72, 26, -2.9, 28], [560, 560, 66, 24, -0.8, 29], [430, 880, 70, 24, 3.6, 30]];
  W.twig = (ctx, tw, p = 1) => { const pts = Brush.curve(tw.cp, 10); Brush.stroke(ctx, pts, p, { w: tw.w, color: '#6a4a30', alpha: 0.62, profile: 'trunk', bristles: 7, seed: tw.seed, dry: 0.7 });
    Brush.stroke(ctx, pts.map(([x, y]) => [x, y - tw.w * 0.22]), p, { w: tw.w * 0.35, color: '#a8845a', alpha: 0.35, profile: 'trunk', bristles: 3, seed: tw.seed + 50 }); };
  W.leaf = (ctx, [x, y, l, wd, a, seed], p = 1) => { if (p <= 0) return; const tip = [x + Math.cos(a) * l * 2, y + Math.sin(a) * l * 2];
    Brush.wash(ctx, Brush.blob(lerp(x, tip[0], 0.5), lerp(y, tip[1], 0.5), l, wd, a, 26, seed, 0.06), { color: '#8ea860', alpha: 0.7 * p, seed });
    Brush.wash(ctx, Brush.blob(lerp(x, tip[0], 0.55), lerp(y, tip[1], 0.55) + wd * 0.25, l * 0.8, wd * 0.5, a, 20, seed + 1, 0.1), { color: '#4e6e3c', alpha: 0.45 * p, seed: seed + 1 });
    Brush.ink(ctx, [[x, y], [lerp(x, tip[0], 0.5), lerp(y, tip[1], 0.5) - 3], tip], p, { color: '#3e5a2c', w: 1.6, alpha: 0.6 }); };

  // ---- the web: hub, frame anchors, radii, the temporary spiral, the sticky spiral ----
  const H = [1000, 520];
  W.hub = H;
  W.frame = [[700, 215], [1000, 175], [1280, 330], [1420, 560], [1360, 820], [1040, 900], [720, 840], [580, 560]];   // anchor polygon
  const rayHit = (a) => { const d = [Math.cos(a), Math.sin(a)]; let best = 1e9;
    for (let i = 0; i < W.frame.length; i++) { const p = W.frame[i], q = W.frame[(i + 1) % W.frame.length], e = [q[0] - p[0], q[1] - p[1]], den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-6) continue;
      const t = ((p[0] - H[0]) * e[1] - (p[1] - H[1]) * e[0]) / den, u = ((p[0] - H[0]) * d[1] - (p[1] - H[1]) * d[0]) / den; if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t); }
    return best; };
  W.NR = 30;
  W.radii = []; for (let i = 0; i < W.NR; i++) { const a = -Math.PI / 2 + i / W.NR * Math.PI * 2 + noise(i, 3) * 0.04, r = rayHit(a); W.radii.push({ a, r, end: [H[0] + Math.cos(a) * r, H[1] + Math.sin(a) * r] }); }
  // a spiral as points where it crosses each radius: radius fraction f goes from f0 to f1 over turns
  const spiral = (f0, f1, turns) => { const out = []; const n = Math.round(turns * W.NR); for (let k = 0; k <= n; k++) { const i = k % W.NR, f = lerp(f0, f1, k / n), R = W.radii[i]; out.push([H[0] + Math.cos(R.a) * R.r * f, H[1] + Math.sin(R.a) * R.r * f]); } return out; };
  W.aux = spiral(0.12, 0.8, 5);            // temporary, from the middle outward, wide
  W.sticky = spiral(0.9, 0.3, 24);        // the trap, from the outside in, close
  W.frameLine = [...W.frame, W.frame[0]];
  // every anchor ends on a twig or the stalk
  W.anchors = [[W.frame[0], [690, 200]], [W.frame[1], [762, 110]], [W.frame[2], [1292, 362]], [W.frame[3], [1545, 548]], [W.frame[4], [1626, 780]], [W.frame[6], [446, 830]], [W.frame[7], [535, 610]]];

  // draw the web painted up to stage values (each 0..1): o = { bridge, y, frame, radii, aux, auxGone, sticky, dew, eat }
  W.web = (ctx, t, o = {}) => {
    const silk = { color: '#3a3a4a', w: 1.3, alpha: 0.75, wobble: 0.2 };
    if (o.frame) Brush.ink(ctx, W.frameLine, o.frame, { ...silk, w: 1.6 });
    // anchor lines from frame corners to the twigs
    if (o.frame) for (const [a, b] of W.anchors) Brush.line(ctx, a, b, o.frame, silk);
    const nr = (o.radii ?? 0) * W.NR;
    for (let i = 0; i < W.NR; i++) { const k = clamp(nr - i); if (k > 0) Brush.line(ctx, H, W.radii[i].end, k, silk); }
    if (o.aux && !(o.auxGone >= 1)) Brush.ink(ctx, W.aux, o.aux, { ...silk, alpha: 0.5 * (1 - (o.auxGone ?? 0)) });
    if (o.sticky) { const m = Math.max(2, Math.ceil(W.sticky.length * o.sticky)); Brush.ink(ctx, W.sticky.slice(0, m), 1, { ...silk, w: 1.1, alpha: 0.7 });
      // glue beads (and later dew): dots along the sticky thread
      ctx.save(); for (let i = 0; i < m - 1; i++) { const a = W.sticky[i], b = W.sticky[i + 1], n = 3; for (let k = 1; k <= n; k++) { const x = lerp(a[0], b[0], k / (n + 1)), y = lerp(a[1], b[1], k / (n + 1)), dew = o.dew ?? 0, r = 1.4 + dew * 2.4 * (0.6 + 0.8 * K.hash(i, k));
        ctx.fillStyle = dew > 0 ? `rgba(150,180,200,${0.5 + 0.3 * dew})` : 'rgba(90,90,110,0.55)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); if (dew > 0.3) { ctx.fillStyle = `rgba(255,255,250,${0.8 * dew})`; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.35, 0, 7); ctx.fill(); } } } ctx.restore(); }
  };
}
