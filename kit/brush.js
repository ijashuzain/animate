// Brush: a watercolour journal kit (canvas 2D, deterministic). After lemo-opuscar's "Watercolor Brush" style guide
// (grammar only, our own code): warm fibrous paper; every mark a translucent brush stroke (a variable-width ribbon at
// partial opacity + thin bristle tracks that break into dashes = dry-brush flying white); washes in three jittered passes
// so edges pool; things paint themselves in by a progress value p (0..1); ink only for lines, silk and notes.
// Everything is a function of its arguments + a seed (never Math.random).
const Brush = {};
{
  const { lerp, clamp, noise, hash, rng } = K;
  Brush.PAPER = '#f3ead8'; Brush.INK = '#2e221a'; Brush.INK2 = '#7a5a3c';
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  Brush.rgba = rgba;

  // ---- paper: drawn once into an offscreen canvas, then blitted every frame ----
  let paperCache = null;
  Brush.paper = (ctx, o = {}) => {
    const W = ctx.canvas.width, H = ctx.canvas.height, key = `${W}x${H}:${o.tint ?? Brush.PAPER}`;
    if (!paperCache || paperCache.key !== key) {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = rng('paper');
      g.fillStyle = o.tint ?? Brush.PAPER; g.fillRect(0, 0, W, H);
      // three octaves of soft blotches (+-3.5 %)
      for (const [n, s, a] of [[60, 420, 0.035], [220, 160, 0.03], [900, 50, 0.025]]) for (let i = 0; i < n; i++) {
        const x = r() * W, y = r() * H, rr = s * (0.5 + r()), dark = r() < 0.5, gr = g.createRadialGradient(x, y, 0, x, y, rr);
        gr.addColorStop(0, dark ? `rgba(150,110,60,${a * 0.6})` : `rgba(255,252,240,${a * 1.6})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
      // fibres: short curved strands
      g.lineCap = 'round';
      for (let i = 0; i < 2600; i++) { const x = r() * W, y = r() * H, a = r() * 6.3, l = 6 + r() * 22; g.strokeStyle = r() < 0.5 ? 'rgba(150,120,80,0.10)' : 'rgba(255,255,248,0.22)'; g.lineWidth = 0.6 + r() * 0.8;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
      // fine grain
      const id = g.getImageData(0, 0, W, H), d = id.data; for (let i = 0; i < d.length; i += 4) { const v = (r() - 0.5) * 7; d[i] += v; d[i + 1] += v; d[i + 2] += v; } g.putImageData(id, 0, 0);
      // light vignette
      const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(110,75,35,0.10)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,232,190,0.16)'; g.fillRect(0, 0, W, H);   // keep the sheet warm, never grey
      paperCache = { key, c };
    }
    ctx.drawImage(paperCache.c, 0, 0);
  };

  // ---- geometry helpers ----
  // resample a polyline to n points evenly by arc length
  const resample = (pts, n) => {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1] || 1, out = []; let j = 0;
    for (let k = 0; k < n; k++) { const s = tot * k / (n - 1); while (j < L.length - 2 && L[j + 1] < s) j++; const u = (s - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([lerp(pts[j][0], pts[j + 1][0], u), lerp(pts[j][1], pts[j + 1][1], u)]); }
    return { pts: out, len: tot };
  };
  Brush.resample = resample;
  // a smooth curve through control points (Catmull-Rom), as a dense polyline
  Brush.curve = (cp, per = 12) => { if (cp.length < 3) return cp; const out = [], P = [cp[0], ...cp, cp[cp.length - 1]];
    for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < per; k++) { const t = k / per, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(P[i - 1][0], P[i][0], P[i + 1][0], P[i + 2][0]), f(P[i - 1][1], P[i][1], P[i + 1][1], P[i + 2][1])]); }
    out.push(cp[cp.length - 1]); return out; };
  const PROFILE = {
    brush: (s) => Math.sin(Math.PI * clamp(s * 0.92 + 0.04)) ** 0.6,
    leaf: (s) => Math.sin(Math.PI * s) ** 0.9,
    even: (s) => clamp(Math.min(s, 1 - s) * 12),
    tip: (s) => (1 - s) ** 0.7 * clamp(s * 14),
    trunk: (s) => lerp(1, 0.45, s) * clamp(s * 20 + 0.4),
  };

  // ---- a brush stroke: ribbon + bristle tracks, painted up to p ----
  // o: { w, color, alpha=0.58, profile='brush', rough=0.22, bristles=5, seed, dry=0.5 (how broken the bristle tracks are) }
  Brush.stroke = (ctx, pts, p = 1, o = {}) => {
    p = clamp(p); if (p <= 0 || pts.length < 2) return;
    const seed = o.seed ?? 1, w = o.w ?? 12, prof = PROFILE[o.profile ?? 'brush'], rough = o.rough ?? 0.22, col = o.color ?? Brush.INK;
    const n = Math.max(8, Math.min(140, Math.round(resample(pts, 2).len / 6))), R = resample(pts, n), q = R.pts, m = Math.max(2, Math.ceil(n * p));
    const L = [], Rt = [];
    for (let i = 0; i < m; i++) { const a = q[Math.max(0, i - 1)], b = q[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1, nx = -dy / dl, ny = dx / dl, s = i / (n - 1);
      const hw = 0.5 * w * prof(s) * (1 + rough * noise(i * 0.35, seed)), hw2 = 0.5 * w * prof(s) * (1 + rough * noise(i * 0.35, seed + 7));
      L.push([q[i][0] + nx * hw, q[i][1] + ny * hw]); Rt.push([q[i][0] - nx * hw2, q[i][1] - ny * hw2]); }
    // the wet tip: a rounded end where the brush is now
    ctx.save(); ctx.fillStyle = rgba(col, (o.alpha ?? 0.58) * (o.bristles === 0 ? 1.15 : 1)); ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
    for (const v of L) ctx.lineTo(v[0], v[1]); for (let i = Rt.length - 1; i >= 0; i--) ctx.lineTo(Rt[i][0], Rt[i][1]); ctx.closePath(); ctx.fill();
    // bristle tracks: thin lines across the width, broken into dashes, ending early (flying white)
    const nb = o.bristles ?? 5, rr = rng(`b${seed}`);
    for (let k = 0; k < nb; k++) { const off = (rr() - 0.5) * 0.9, end = Math.min(m, Math.ceil(n * (0.55 + 0.45 * rr()))), a0 = 0.3 + rr() * 0.55, lw = w * (0.05 + rr() * 0.1);
      ctx.strokeStyle = rgba(col, a0); ctx.lineWidth = Math.max(0.6, lw); ctx.lineCap = 'round';
      const dash = []; for (let d = 0; d < 6; d++) dash.push(4 + rr() * 30 * (1 - (o.dry ?? 0.5) * 0.6), 1 + rr() * 14 * (o.dry ?? 0.5)); ctx.setLineDash(dash);
      ctx.beginPath(); for (let i = 0; i < end; i++) { const x = lerp(Rt[i][0], L[i][0], 0.5 + off), y = lerp(Rt[i][1], L[i][1], 0.5 + off); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    ctx.restore();
  };

  // ---- a wash: a polygon in three jittered passes (edges pool darker); p paints it in along x or by a radial reveal ----
  Brush.wash = (ctx, poly, o = {}) => {
    const col = o.color ?? '#9fb4c4', a = o.alpha ?? 0.45, seed = o.seed ?? 3, j = o.jitter ?? 6, p = clamp(o.p ?? 1); if (p <= 0) return;
    ctx.save();
    if (p < 1) { // a wavy brush-edge reveal from the left (or o.dir)
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const [x, y] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const ex = lerp(x0 - 40, x1 + 40, p); ctx.beginPath(); ctx.moveTo(x0 - 60, y0 - 60); for (let y = y0 - 60; y <= y1 + 60; y += 20) ctx.lineTo(ex + noise(y * 0.02, seed) * 30, y); ctx.lineTo(x0 - 60, y1 + 60); ctx.closePath(); ctx.clip(); }
    for (let pass = 0; pass < 3; pass++) { ctx.fillStyle = rgba(col, a / 3 * (pass === 0 ? 1.2 : 1)); ctx.beginPath();
      poly.forEach(([x, y], i) => { const dx = noise(i * 0.7 + pass * 13, seed) * j, dy = noise(i * 0.7 + pass * 29, seed + 1) * j; i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy); }); ctx.closePath(); ctx.fill(); }
    // watercolour character: a darker pooled edge and pigment granulation inside the shape
    if (o.edge !== false) { ctx.strokeStyle = rgba(o.edgeColor ?? col, Math.min(0.5, a * 0.32)); ctx.lineWidth = o.edgeW ?? 1.6; ctx.lineJoin = 'round'; ctx.beginPath(); poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); }
    if (o.grain !== false) { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const [x, y] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const area = (x1 - x0) * (y1 - y0), n = Math.min(400, Math.round(area / (o.grainStep ?? 90))); if (n > 2) { ctx.beginPath(); poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.clip(); const r = rng(`g${seed}`);
        for (let i = 0; i < n; i++) { const gx = lerp(x0, x1, r()), gy = lerp(y0, y1, r()), gr = 0.6 + r() * 1.6; ctx.fillStyle = rgba(col, a * (0.25 + r() * 0.35)); ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 7); ctx.fill(); } } }
    ctx.restore();
  };
  // a soft blob wash (ellipse polygon) — leaves, bodies, moons
  Brush.blob = (cx, cy, rx, ry, rot = 0, n = 28, seed = 5, wob = 0.08) => { const out = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 1 + wob * noise(i * 0.9, seed);
    out.push([cx + Math.cos(a) * rx * k * Math.cos(rot) - Math.sin(a) * ry * k * Math.sin(rot), cy + Math.cos(a) * rx * k * Math.sin(rot) + Math.sin(a) * ry * k * Math.cos(rot)]); } return out; };
  // a whole-sheet sky/ground wash strip that runs well past the frame (no seams)
  Brush.band = (ctx, y0, y1, o = {}) => { const W = ctx.canvas.width, poly = []; for (let x = -100; x <= W + 100; x += 60) poly.push([x, y0 + noise(x * 0.004, o.seed ?? 9) * (o.wave ?? 24)]); for (let x = W + 100; x >= -100; x -= 60) poly.push([x, y1 + noise(x * 0.004, (o.seed ?? 9) + 3) * (o.wave ?? 24)]); Brush.wash(ctx, poly, o); };

  // ---- ink: a fine pen/silk line, drawn up to p, with an optional sag ----
  Brush.line = (ctx, a, b, p = 1, o = {}) => { p = clamp(p); if (p <= 0) return; const sag = o.sag ?? 0, n = 16, pts = [];
    for (let i = 0; i <= n; i++) { const s = i / n; pts.push([lerp(a[0], b[0], s), lerp(a[1], b[1], s) + sag * 4 * s * (1 - s)]); }
    Brush.ink(ctx, pts, p, o); };
  Brush.ink = (ctx, pts, p = 1, o = {}) => { p = clamp(p); if (p <= 0 || pts.length < 2) return; const m = Math.max(2, Math.ceil(pts.length * p));
    ctx.save(); ctx.strokeStyle = o.color ?? Brush.INK; ctx.globalAlpha = o.alpha ?? 0.85; ctx.lineWidth = o.w ?? 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); for (let i = 0; i < m; i++) { const j = (o.wobble ?? 0.6) * noise(i * 0.5, o.seed ?? 2); i ? ctx.lineTo(pts[i][0] + j, pts[i][1] + j) : ctx.moveTo(pts[i][0], pts[i][1]); } ctx.stroke(); ctx.restore(); };

  // ---- hand-written note: revealed left to right like writing, drawn twice over a paper halo; a leader line that grows ----
  Brush.note = (ctx, text, x, y, p = 1, o = {}) => { p = clamp(p); if (p <= 0) return;
    const size = o.size ?? 40, font = o.font ?? `500 ${size}px Caveat, "Patrick Hand", cursive`; ctx.save(); ctx.font = font; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    ctx.beginPath(); ctx.rect(x0 - 10, y - size, (w + 20) * p, size * 2); ctx.clip();
    ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(o.halo ?? Brush.PAPER, 0.6); ctx.lineWidth = size * 0.12; ctx.strokeText(text, x0, y);
    ctx.fillStyle = rgba(o.color ?? Brush.INK, 0.55); ctx.fillText(text, x0 + 0.8, y + 0.6); ctx.fillStyle = rgba(o.color ?? Brush.INK, 0.8); ctx.fillText(text, x0, y);
    ctx.restore(); return w; };
  Brush.leader = (ctx, from, to, p = 1, o = {}) => { const mid = o.elbow ?? [lerp(from[0], to[0], 0.6), from[1]]; const pts = resample([from, mid, to], 30).pts; Brush.ink(ctx, pts, p, { w: 1.4, alpha: 0.7, ...o });
    if (p >= 1 && o.dot !== false) { ctx.save(); ctx.fillStyle = rgba(o.color ?? Brush.INK, 0.75); ctx.beginPath(); ctx.arc(to[0], to[1], 3.2, 0, 7); ctx.fill(); ctx.restore(); } };

  // ---- mist: a paper-coloured layer with a wavy rising edge (k 0..1 covers from the bottom up) ----
  Brush.mist = (ctx, k, o = {}) => { if (k <= 0) return; const W = ctx.canvas.width, H = ctx.canvas.height, ey = lerp(H + 80, -80, clamp(k));
    ctx.save(); ctx.fillStyle = rgba(o.tint ?? Brush.PAPER, o.alpha ?? 0.96); ctx.beginPath(); ctx.moveTo(-50, H + 50); for (let x = -50; x <= W + 50; x += 30) ctx.lineTo(x, ey + noise(x * 0.006, o.seed ?? 4) * 40 + noise(x * 0.03, 11) * 8); ctx.lineTo(W + 50, H + 50); ctx.closePath(); ctx.fill(); ctx.restore(); };
}
