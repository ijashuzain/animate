// kit/paint.js — a canvas painter with a world camera (y up, any unit: mm, m, km) for a flat-vector look:
// gradients, glows, rim light, smooth blobs. No outlines by default. Screen is W x H (1920 x 1080).
const P = { W: 1920, H: 1080, ctx: null, c: { x: 0, y: 0, h: 10, rot: 0 }, k: 108 };
P.begin = (ctx) => { P.ctx = ctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; };
// camera: centre (x, y), visible height h (world units), rotation (rad). Origin (ox, oy) lets a scene keep small numbers.
P.cam = (c, ox = 0, oy = 0) => {
  P.c = c; P.k = P.H / c.h; const ctx = P.ctx, k = P.k, r = c.rot || 0, cs = Math.cos(r), sn = Math.sin(r);
  // screen = centre + R * (world - cam) * k, with y flipped
  const tx = c.x - ox, ty = c.y - oy;
  ctx.setTransform(k * cs, k * sn, k * sn, -k * cs, P.W / 2 - k * (cs * tx + sn * ty), P.H / 2 - k * (sn * tx - cs * ty));
};
// world -> screen (float64), for labels and effects that must sit on an object
P.toScreen = (x, y) => { const c = P.c, k = P.k, r = c.rot || 0, cs = Math.cos(r), sn = Math.sin(r), dx = x - c.x, dy = y - c.y; return [P.W / 2 + k * (cs * dx + sn * dy), P.H / 2 + k * (sn * dx - cs * dy)]; };
P.screen = (fn) => { const ctx = P.ctx; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(ctx); ctx.restore(); };
P.save = () => P.ctx.save(); P.restore = () => P.ctx.restore();
// draw fn into an offscreen layer and composite it at alpha a (clean cross-fades of whole scenes)
P.layer = (a, fn) => {
  if (a <= 0) return; if (a >= 1) return fn();
  const main = P.ctx; if (!P._off) { P._off = document.createElement('canvas'); P._off.width = P.W; P._off.height = P.H; }
  const o = P._off.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, P.W, P.H);
  // keep the caller's camera transform inside the layer, then composite the layer in screen space
  const keep = P.c, keepK = P.k, m = main.getTransform(); P.begin(o); o.setTransform(m); fn(); P.ctx = main; P.c = keep; P.k = keepK;
  main.save(); main.setTransform(1, 0, 0, 1, 0, 0); main.globalAlpha *= a; main.drawImage(P._off, 0, 0); main.restore();
};
P.alpha = (a, fn) => { const ctx = P.ctx; ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); };
// local transform for an object: translate, rotate, scale (sx, sy), then fn draws in local units
P.at = (x, y, rot, sx, sy, fn) => { const ctx = P.ctx; ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sx !== 1 || sy !== 1) ctx.scale(sx, sy ?? sx); fn(); ctx.restore(); };
// fills: '#hex', 'rgba()', or { lin: [x0, y0, x1, y1], stops: [[0, c], [1, c]] } / { rad: [x, y, r0, r1?], stops }
P.fill = (f) => {
  if (typeof f === 'string') return f; const ctx = P.ctx; let g;
  if (f.lin) g = ctx.createLinearGradient(...f.lin); else { const [x, y, r0, r1] = f.rad; g = r1 == null ? ctx.createRadialGradient(x, y, 0, x, y, r0) : ctx.createRadialGradient(x, y, r0, x, y, r1); }
  for (const [o, c] of f.stops) g.addColorStop(o, c); return g;
};
P.lin = (x0, y0, x1, y1, ...cols) => ({ lin: [x0, y0, x1, y1], stops: cols.map((c, i) => [i / (cols.length - 1), c]) });
P.rad = (x, y, r, ...cols) => ({ rad: [x, y, r], stops: cols.map((c, i) => [i / (cols.length - 1), c]) });
P.doFill = (f, a = 1) => { const ctx = P.ctx; ctx.fillStyle = P.fill(f); if (a !== 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fill(); ctx.restore(); } else ctx.fill(); };
// shapes (all fill; pass o.stroke = [colour, width] for a rare line)
P.poly = (pts, f, o = {}) => { const ctx = P.ctx; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); P.doFill(f, o.a ?? 1); };
P.circle = (x, y, r, f, o = {}) => { const ctx = P.ctx; ctx.beginPath(); ctx.ellipse(x, y, r, o.ry ?? r, o.rot ?? 0, 0, Math.PI * 2); P.doFill(f, o.a ?? 1); };
P.rect = (x, y, w, h, f, o = {}) => { const ctx = P.ctx; ctx.beginPath(); if (o.r) ctx.roundRect(x, y, w, h, o.r); else ctx.rect(x, y, w, h); P.doFill(f, o.a ?? 1); };
// smooth closed (or open) curve through points (Catmull-Rom -> Bezier)
P.trace = (pts, closed = true, tension = 0.5, fresh = true) => {
  const ctx = P.ctx, n = pts.length; if (fresh) ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2), s = tension / 3;
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * s, p1[1] + (p2[1] - p0[1]) * s, p2[0] - (p3[0] - p1[0]) * s, p2[1] - (p3[1] - p1[1]) * s, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
};
P.smooth = (pts, f, o = {}) => { P.trace(pts, o.closed ?? true, o.tension ?? 0.5); P.doFill(f, o.a ?? 1); };
// a soft organic blob: n lobes, wobble w (0..0.4), seeded
P.blobPts = (x, y, rx, ry, n = 9, w = 0.15, seed = 1, rot = 0) => { const pts = []; for (let i = 0; i < n; i++) { const a = rot + (i / n) * Math.PI * 2, j = 1 + (K.hash(i, seed * 7 + 3) * 2 - 1) * w; pts.push([x + Math.cos(a) * rx * j, y + Math.sin(a) * ry * j]); } return pts; };
P.blob = (x, y, rx, ry, f, o = {}) => P.smooth(P.blobPts(x, y, rx, ry, o.n ?? 9, o.w ?? 0.15, o.seed ?? 1, o.rot ?? 0), f, o);
// thick smooth stroke (stems, trunks, roots): a polyline with per-point widths, filled as one shape
P.ribbon = (pts, widths, f, o = {}) => {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = (Array.isArray(widths) ? widths[i] : widths) / 2;
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  P.smooth([...L, ...R.reverse()], f, { tension: o.tension ?? 0.3, a: o.a });
};
// clip to a shape while fn draws (rim light, inner shade, patterns)
P.clip = (shapeFn, fn) => { const ctx = P.ctx; ctx.save(); shapeFn(); ctx.clip(); fn(); ctx.restore(); };
// rim light + core shade for a smooth shape: base fill, a dark crescent away from the light, a light crescent toward it.
// light = direction toward the light (x, y up); d = crescent depth as a fraction of the shape size
P.crescent = (pts, dx, dy, col) => { const b = P.bounds(pts), ctx = P.ctx; P.clip(() => P.trace(pts), () => { ctx.beginPath(); ctx.rect(b.x - b.w, b.y - b.h, b.w * 3, b.h * 3); P.trace(pts.map(([x, y]) => [x + dx, y + dy]), true, 0.5, false); ctx.fillStyle = P.fill(col); ctx.fill('evenodd'); }); };
P.lit = (pts, base, o = {}) => {
  const [lx, ly] = o.light ?? [-0.55, 0.85], b = P.bounds(pts), s = Math.max(b.w, b.h);
  P.smooth(pts, base);
  if (o.shade !== false) P.crescent(pts, lx * s * (o.d ?? 0.22), ly * s * (o.d ?? 0.22), o.shade ?? 'rgba(25,10,50,0.2)');
  if (o.rim !== false) P.crescent(pts, -lx * s * (o.rd ?? 0.06), -ly * s * (o.rd ?? 0.06), o.rim ?? 'rgba(255,255,255,0.3)');
};
P.bounds = (pts) => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
// additive glow (light, fire, magic)
P.glow = (x, y, r, col = '255,200,120', a = 1) => { if (a <= 0) return; const ctx = P.ctx; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${0.55 * a})`); g.addColorStop(0.35, `rgba(${col},${0.22 * a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
// screen-space washes: sky gradient, haze (depth), vignette
P.sky = (top, bottom, mid) => P.screen((ctx) => { const g = ctx.createLinearGradient(0, 0, 0, P.H); g.addColorStop(0, top); if (mid) g.addColorStop(0.55, mid); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, P.W, P.H); });
P.haze = (col, a) => { if (a <= 0) return; P.screen((ctx) => { ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, P.W, P.H); }); };
P.vignette = (a = 0.35) => P.screen((ctx) => { const g = ctx.createRadialGradient(P.W / 2, P.H / 2, P.H * 0.45, P.W / 2, P.H / 2, P.H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,10,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, P.W, P.H); });
// screen text (labels, counters): font family loaded by the film; o: size, weight, color, align, alpha, shadow
P.text = (str, sx, sy, o = {}) => P.screen((ctx) => { ctx.globalAlpha *= o.alpha ?? 1; ctx.font = `${o.weight ?? 700} ${o.size ?? 48}px ${o.font ?? 'sans-serif'}`; ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'middle'; if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = (o.size ?? 48) * 0.4; } ctx.fillStyle = o.color ?? '#fff'; if (o.ls) ctx.letterSpacing = o.ls; ctx.fillText(str, sx, sy); });
// a calm pill label in screen space (numbers, names): pops in with u (0..1); o.icon(ctx, r) draws a small icon at its left
P.pill = (str, sx, sy, o = {}) => {
  const u = o.u ?? 1; if (u <= 0 || (typeof window !== 'undefined' && window.THUMB)) return;   // thumbnails stay clean (no pills)
  P.screen((ctx) => {
    const size = o.size ?? 40; ctx.font = `${o.weight ?? 700} ${size}px ${o.font ?? 'sans-serif'}`;
    const iw = o.icon ? size * 1.3 : 0, w = ctx.measureText(str).width + iw + size * 1.1, h = size * 1.6, k = K.ease.backOut(K.clamp(u));
    ctx.translate(sx, sy); ctx.scale(k, k); ctx.globalAlpha *= K.clamp(u * 2);
    ctx.fillStyle = 'rgba(10,20,50,0.18)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 6, w, h, h / 2); ctx.fill();
    ctx.fillStyle = o.bg ?? 'rgba(255,255,255,0.94)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
    if (o.icon) { ctx.save(); ctx.translate(-w / 2 + size * 0.55 + iw / 2, 0); o.icon(ctx, size * 0.5); ctx.restore(); }
    ctx.fillStyle = o.color ?? '#1a2a4a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, iw / 2, 2);
  });
};
// colour helpers
P.hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
P.mixc = (a, b, u) => { const A = P.hex(a), B = P.hex(b); return '#' + A.map((v, i) => Math.round(K.lerp(v, B[i], K.clamp(u))).toString(16).padStart(2, '0')).join(''); };
P.rgba = (c, a) => { const [r, g, b] = P.hex(c); return `rgba(${r},${g},${b},${a})`; };
