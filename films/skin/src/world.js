// The skin film's world (after the user's reference grid, refs/ref-grid.webp): the golden savanna, the UV gauge in the sky,
// and the skin cutaway (stratum corneum, keratinocytes with melanin caps, the melanocyte's branching arms, the dermis).
// Screen space (px), deterministic.
const W = {};
const mixc = (a, b, u) => P.mixc(a, b, K.clamp(u));
const wEll = (ctx, x, y, rx, ry, col, rot = 0) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, 7); ctx.fill(); };

// ---------- the savanna at a low golden sun (tile 1): sky, sun, pink clouds, hazy hills, acacias, golden grass ----------
W.savanna = (ctx, t, pan = 0, o = {}) => {
  const sunX = (o.sunX ?? 1560) - pan * 0.05, sunY = o.sunY ?? 330;
  const sky = ctx.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#8ab4e8'); sky.addColorStop(0.45, '#f6c890'); sky.addColorStop(1, '#ffd890'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1920, 1080);
  const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 520); sg.addColorStop(0, 'rgba(255,250,225,1)'); sg.addColorStop(0.12, 'rgba(255,240,190,0.9)'); sg.addColorStop(0.4, 'rgba(255,210,140,0.35)'); sg.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1920, 1080);
  wEll(ctx, sunX, sunY, 70, 70, '#fffbe8');
  // clouds: soft pink streaks, one shape each (dark underside, body, light top)
  for (let i = 0; i < 7; i++) { const cx = ((K.hash(i, 1) * 2400 - pan * 0.12 + t * 6) % 2400) - 240, cy = 70 + K.hash(i, 2) * 240, w = 180 + K.hash(i, 3) * 260;
    wEll(ctx, cx, cy + 8, w, 22, 'rgba(230,150,150,0.45)'); wEll(ctx, cx - w * 0.2, cy, w * 0.75, 26, 'rgba(255,200,190,0.6)'); wEll(ctx, cx + w * 0.15, cy - 10, w * 0.45, 18, 'rgba(255,235,220,0.55)'); }
  // hills in haze
  for (const [yb, col, amp, par] of [[560, '#e8a8a0', 60, 0.1], [600, '#d89a80', 40, 0.18]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 30) ctx.lineTo(x, yb - amp * (0.5 + 0.5 * Math.sin((x + pan * par) * 0.0045 + yb)) - 30 * Math.sin((x + pan * par) * 0.0011)); ctx.lineTo(1920, 1080); ctx.fill(); }
  // the plain: golden, lighter toward the sun
  const pl = ctx.createLinearGradient(0, 600, 0, 1080); pl.addColorStop(0, '#f0c060'); pl.addColorStop(0.5, '#e0a840'); pl.addColorStop(1, '#c08030'); ctx.fillStyle = pl; ctx.fillRect(0, 600, 1920, 480);
  // acacias at two depths (flat crowns, dark underside layer, a lit top)
  for (const [ax, ay, sc, par] of [[220, 640, 1.0, 0.35], [1350, 625, 0.55, 0.25], [1700, 632, 0.7, 0.3], [900, 615, 0.4, 0.2]]) { const x = ((ax - pan * par) % 2300 + 2300) % 2300 - 190;
    ctx.strokeStyle = mixc('#6a4028', '#e0a080', 0.4 - sc * 0.3); ctx.lineCap = 'round'; ctx.lineWidth = 16 * sc; ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(x + 8 * sc, ay - 130 * sc); ctx.lineTo(x - 70 * sc, ay - 200 * sc); ctx.moveTo(x + 8 * sc, ay - 130 * sc); ctx.lineTo(x + 85 * sc, ay - 195 * sc); ctx.stroke();
    const cc = mixc('#5a8a3a', '#e0b080', 0.45 - sc * 0.35); wEll(ctx, x + 10 * sc, ay - 205 * sc, 190 * sc, 44 * sc, mixc(cc, '#203010', 0.3)); wEll(ctx, x, ay - 215 * sc, 175 * sc, 36 * sc, cc); wEll(ctx, x - 30 * sc, ay - 228 * sc, 110 * sc, 16 * sc, mixc(cc, '#fff0b0', 0.3)); }
  // far herd (tiny silhouettes) for life
  for (let i = 0; i < 6; i++) { const x = ((1100 + i * 40 - pan * 0.22 + t * 8) % 2200 + 2200) % 2200 - 140, y = 640 + (i % 2) * 6; wEll(ctx, x, y, 14, 7, 'rgba(140,80,50,0.55)'); ctx.fillStyle = 'rgba(140,80,50,0.55)'; ctx.fillRect(x - 10, y, 3, 10); ctx.fillRect(x + 8, y, 3, 10); }
  // grass strokes: rows from far (fine) to near (tall, swaying)
  for (let row = 0; row < 14; row++) { const y = 640 + row * row * 2.6, h = 6 + row * 4, n = 70, par = 0.4 + row * 0.08;
    ctx.strokeStyle = mixc('#f8d070', '#a06a20', row / 16); ctx.lineWidth = 1 + row * 0.25;
    ctx.beginPath(); for (let i = 0; i < n; i++) { const gx = ((K.hash(i, row + 30) * 2100 - pan * par) % 2100 + 2100) % 2100 - 90, sw = Math.sin(t * 1.6 + gx * 0.01 + row) * h * 0.25; ctx.moveTo(gx, y); ctx.quadraticCurveTo(gx + sw * 0.5, y - h * 0.5, gx + sw, y - h); } ctx.stroke(); }
};
// near grass in front of the walkers' feet
W.grassFront = (ctx, t, pan = 0) => { for (let i = 0; i < 90; i++) { const gx = ((K.hash(i, 77) * 2200 - pan * 1.4) % 2200 + 2200) % 2200 - 140, y = 1000 + K.hash(i, 78) * 90, h = 60 + K.hash(i, 79) * 90, sw = Math.sin(t * 1.8 + i) * 12;
  ctx.strokeStyle = mixc('#e8b048', '#8a5418', K.hash(i, 80)); ctx.lineWidth = 3 + K.hash(i, 81) * 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, y); ctx.quadraticCurveTo(gx + sw * 0.4, y - h * 0.6, gx + sw, y - h); ctx.stroke(); } };

// ---------- the UV gauge in the sky: an arc from green (low) to violet (extreme), a needle, a calm label ----------
W.uvGauge = (ctx, x, y, r, level, a = 1, font = 'sans-serif') => {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(20,24,60,0.45)'; ctx.beginPath(); ctx.arc(x, y, r * 1.22, Math.PI, 0); ctx.lineTo(x + r * 1.22, y + r * 0.18); ctx.lineTo(x - r * 1.22, y + r * 0.18); ctx.fill();
  const cols = ['#4ade6a', '#c8e83a', '#ffd23a', '#ff8a3a', '#ff3a4a', '#b04aff'];
  cols.forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = r * 0.22; ctx.beginPath(); ctx.arc(x, y, r, Math.PI + i * Math.PI / 6 + 0.02, Math.PI + (i + 1) * Math.PI / 6 - 0.02); ctx.stroke(); });
  const an = Math.PI + K.clamp(level) * Math.PI; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * r * 0.92, y + Math.sin(an) * r * 0.92); ctx.stroke();
  wEll(ctx, x, y, r * 0.1, r * 0.1, '#ffffff');
  ctx.fillStyle = '#ffffff'; ctx.font = `800 ${r * 0.34}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('UV', x, y - r * 0.38);
  ctx.restore();
};

// ---------- the skin cutaway (tile 3) ----------
// melanin: dose 0..1 (how much pigment the cells hold), cap 0..1 (how much of it has gathered over the nuclei)
W.skin = (ctx, t, o = {}) => {
  const dose = o.dose ?? 0.8, cap = o.cap ?? 1, tone = o.tone ?? '#f0a8a0';
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#2a3aa8'); bg.addColorStop(1, '#1a2a7a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  const wave = (x, y0, amp, ph) => y0 + Math.sin(x * 0.006 + ph) * amp + Math.sin(x * 0.017 + ph * 2) * amp * 0.3;
  // stratum corneum: pale peach flattened bands
  for (let k = 0; k < 4; k++) { ctx.fillStyle = mixc('#ffd8c0', '#f0a090', k / 4); ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 20) ctx.lineTo(x, wave(x, 70 + k * 30, 10, k)); ctx.lineTo(1920, 1080); ctx.fill(); }
  // the upper living layer: small flattened cells
  ctx.fillStyle = '#e8807a'; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 20) ctx.lineTo(x, wave(x, 190, 10, 2)); ctx.lineTo(1920, 1080); ctx.fill();
  for (let r = 0; r < 3; r++) for (let i = 0; i < 28; i++) { const x = i * 72 + (r % 2) * 36 + K.hash(i, r) * 10, y = 220 + r * 34; wEll(ctx, x, y, 34, 13, mixc('#f8a8a0', '#ffc8c0', K.hash(i, r + 5) * 0.5)); wEll(ctx, x - 6, y - 4, 16, 4, 'rgba(255,230,220,0.5)'); }
  // a purple band, then the big keratinocytes (two rows) with nuclei and melanin caps
  ctx.fillStyle = '#b05a8a'; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 20) ctx.lineTo(x, wave(x, 320, 12, 3)); ctx.lineTo(1920, 1080); ctx.fill();
  ctx.fillStyle = mixc(tone, '#f8d0b8', 0.3); ctx.fillRect(0, 335, 1920, 420);
  const cells = []; for (let r = 0; r < 2; r++) for (let i = -1; i < 10; i++) cells.push([i * 212 + (r ? 106 : 0) + K.hash(i, r + 9) * 12, 440 + r * 175, 102, 84]);
  ctx.fillStyle = mixc(tone, '#c86a7a', 0.35); ctx.fillRect(0, 335, 1920, 420);
  for (const [x, y, rx, ry] of cells) { const g = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.4, 5, x, y, rx * 1.15); g.addColorStop(0, '#fff0ee'); g.addColorStop(0.6, mixc(tone, '#ffd6d6', 0.45)); g.addColorStop(1, mixc(tone, '#d0708a', 0.35)); ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(x - rx, y - ry, rx * 2, ry * 2, ry * 0.7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - rx + 8, y - ry + 8, rx * 2 - 16, ry * 2 - 16, ry * 0.6); ctx.stroke();
    wEll(ctx, x, y + 14, rx * 0.36, ry * 0.4, '#b04a8a'); wEll(ctx, x, y + 14, rx * 0.22, ry * 0.25, '#8a2a70'); wEll(ctx, x - 10, y + 4, rx * 0.1, ry * 0.1, 'rgba(255,200,235,0.6)'); }
  // the basement membrane (orange) and the dermis with vessels
  ctx.fillStyle = '#ffb060'; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 20) ctx.lineTo(x, wave(x, 740, 14, 4)); ctx.lineTo(1920, 1080); ctx.fill();
  const dg = ctx.createLinearGradient(0, 760, 0, 1080); dg.addColorStop(0, '#c04a8a'); dg.addColorStop(1, '#6a2a7a'); ctx.fillStyle = dg; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 20) ctx.lineTo(x, wave(x, 760, 14, 4)); ctx.lineTo(1920, 1080); ctx.fill();
  for (const [col, ph, yb] of [['#3a6aff', 0, 900], ['#ff3a4a', 1.4, 940], ['#3a6aff', 2.6, 1000], ['#ff3a4a', 3.9, 1040]]) { ctx.strokeStyle = col; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); for (let x = -40; x <= 1960; x += 20) { const y = yb + Math.sin(x * 0.006 + ph + t * 0.3) * 40; x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 8; ctx.stroke(); }
  // the melanocyte (refs/t3-skin.png): a glossy dark cell body on the membrane, five smooth tapering dendrites curving up
  // between the keratinocytes, each with a soft side branch; one continuous organic shape, lit from the upper left
  const mx = o.mx ?? 760, my = 712;
  // each dendrite is a soft curve from the body to the melanin cap of a skin cell above; a side branch reaches a neighbour
  const capOf = ([x, y, rx]) => [x + (K.hash(x, 1) - 0.5) * rx * 0.4, y - 40];
  const near = cells.filter(([x, y]) => y < my - 100 && Math.abs(x - mx) < 430).sort((p, q) => Math.abs(p[0] - mx) - Math.abs(q[0] - mx)).slice(0, 5).sort((p, q) => p[0] - q[0]);
  const bez = (p0, c, p1, n, wig, ph) => { const pts = []; for (let j = 0; j <= n; j++) { const u = j / n, x = (1 - u) * (1 - u) * p0[0] + 2 * u * (1 - u) * c[0] + u * u * p1[0], y = (1 - u) * (1 - u) * p0[1] + 2 * u * (1 - u) * c[1] + u * u * p1[1]; pts.push([x + Math.sin(u * 5 + ph + t * 0.6) * wig * u, y]); } return pts; };
  const dendrites = near.map((cell, i) => { const [tx, ty] = capOf(cell), s0 = [mx + (tx - mx) * 0.12, my - 40], side = tx < mx ? -1 : 1;
    const main = bez(s0, [mx + (tx - mx) * 0.35 - side * 40, (my + ty) / 2 + 30], [tx, ty], 18, 10, i);
    const nb = cells.find(([x, y]) => y > ty + 60 && Math.abs(x - (tx + side * 220)) < 120) ?? cell, bt = capOf(nb), bs = main[10];
    const be = [bs[0] + side * 95, bs[1] - 105]; void bt;
    return { main, w0: 64 - Math.abs(i - 2) * 6, branch: bez(bs, [(bs[0] + be[0]) / 2 + side * 10, (bs[1] + be[1]) / 2 - 25], be, 8, 4, i + 2) }; });
  // a tapered, smooth ribbon with a rounded tip (filled outline, no segment joins)
  const ribbon = (pts, w0, w1, fill) => { const L = [], R = []; pts.forEach(([px, py], j) => { const a = pts[Math.max(0, j - 1)], b = pts[Math.min(pts.length - 1, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * Math.pow(j / (pts.length - 1), 0.7)) / 2; L.push([px - dy / d * w, py + dx / d * w]); R.push([px + dy / d * w, py - dx / d * w]); });
    ctx.beginPath(); ctx.moveTo(...L[0]); for (let j = 1; j < L.length; j++) ctx.lineTo(...L[j]); const tp = pts[pts.length - 1]; ctx.arc(tp[0], tp[1], w1 / 2, Math.atan2(L[L.length - 1][1] - tp[1], L[L.length - 1][0] - tp[0]), Math.atan2(R[R.length - 1][1] - tp[1], R[R.length - 1][0] - tp[0]), true); for (let j = R.length - 2; j >= 0; j--) ctx.lineTo(...R[j]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  const body = (dx, dy, sx, sy, col) => { ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i <= 48; i++) { const a = i / 48 * 6.283, r = 1 + 0.035 * Math.sin(a * 3 + 1); ctx.lineTo(mx + dx + Math.cos(a) * sx * r, my + dy + Math.sin(a) * sy * r); } ctx.fill(); };
  ctx.save(); ctx.filter = 'blur(6px)'; for (const d of dendrites) ribbon(d.main.map(([x, y]) => [x + 8, y + 10]), d.w0, 16, 'rgba(60,10,20,0.35)'); ctx.restore();
  for (const d of dendrites) { ribbon(d.branch, 26, 14, '#3a1608'); ribbon(d.main, d.w0, 22, '#3a1608'); }
  body(0, 0, 112, 74, '#3a1608');
  for (const d of dendrites) { const off = (pts) => pts.map(([x, y]) => [x - 4, y - 2]); ribbon(off(d.branch), 14, 7, '#6a3418'); ribbon(off(d.main), d.w0 * 0.55, 11, '#6a3418'); }
  body(-14, -10, 78, 48, '#6a3418');
  for (const d of dendrites) { const off = (pts) => pts.map(([x, y]) => [x - 9, y - 4]).slice(1, -2); ribbon(off(d.main), d.w0 * 0.14, 3, 'rgba(255,205,160,0.45)'); }
  const ng = ctx.createRadialGradient(mx - 10, my - 8, 4, mx + 4, my + 4, 42); ng.addColorStop(0, '#6a3218'); ng.addColorStop(1, '#1a0602'); ctx.fillStyle = ng; ctx.beginPath(); ctx.ellipse(mx + 8, my + 6, 40, 33, 0.15, 0, 7); ctx.fill();
  wEll(ctx, mx - 4, my - 6, 11, 7, 'rgba(255,215,175,0.55)'); wEll(ctx, mx - 52, my - 34, 22, 9, 'rgba(255,205,160,0.3)', -0.4);
  const armPts = dendrites.flatMap((d) => [d.main, d.branch]);
  // melanin granules: travelling up the arms, then sitting as caps over each nucleus
  for (const [x, y, rx] of cells) { const n = Math.round(26 * dose); for (let k = 0; k < n; k++) { const a = Math.PI * (1.05 + 0.9 * K.hash(k, x)), d = rx * (0.42 + 0.3 * K.hash(k, x + 1)), sx = x + (K.hash(k, x + 2) - 0.5) * rx * 1.6, sy = y + (K.hash(k, x + 3) - 0.5) * 140, tx = x + Math.cos(a) * d * 0.9, ty = y + 10 + Math.sin(a) * d * 0.55;
    const px = K.lerp(sx, tx, cap), py = K.lerp(sy, ty, cap), r = 6 + K.hash(k, x + 4) * 5; wEll(ctx, px, py, r, r, mixc('#3a1a0a', '#7a4020', K.hash(k, x + 5))); wEll(ctx, px - r * 0.3, py - r * 0.3, r * 0.3, r * 0.3, 'rgba(255,200,150,0.5)'); } }
  for (let k = 0; k < 60; k++) { const pts = armPts[k % armPts.length], u = (t * 0.22 + K.hash(k, 3)) % 1, f = u * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(f)), q = f - j, px = K.lerp(pts[j][0], pts[j + 1][0], q), py = K.lerp(pts[j][1], pts[j + 1][1], q); wEll(ctx, px, py, 6, 6, '#24080a'); wEll(ctx, px - 2, py - 2, 2, 2, 'rgba(255,210,170,0.7)'); }
};

// ---------- the world: rough continents in longitude / latitude (no detail, readable shapes) ----------
W.LAND = {
  africa: [[-17, 15], [-10, 30], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [35, -25], [20, -35], [12, -18], [9, 4], [-8, 5]],
  europe: [[-10, 37], [-9, 44], [0, 50], [8, 55], [5, 62], [18, 70], [30, 70], [40, 62], [40, 45], [28, 41], [15, 38], [3, 42]],
  asia: [[40, 45], [40, 62], [60, 70], [100, 77], [140, 72], [180, 68], [160, 60], [140, 50], [130, 35], [122, 25], [108, 12], [100, 2], [95, 15], [80, 8], [72, 20], [60, 25], [50, 28], [44, 12], [35, 31]],
  australia: [[114, -22], [122, -17], [130, -12], [137, -12], [145, -15], [153, -25], [150, -37], [140, -38], [130, -32], [116, -35]],
  namerica: [[-165, 65], [-140, 70], [-100, 72], [-80, 65], [-60, 55], [-65, 45], [-80, 30], [-97, 25], [-105, 20], [-90, 15], [-80, 9], [-100, 18], [-112, 30], [-125, 45], [-130, 55], [-150, 60]],
  samerica: [[-80, 9], [-60, 10], [-50, 0], [-35, -7], [-40, -22], [-55, -35], [-68, -55], [-72, -40], [-75, -15], [-81, -5]],
  greenland: [[-55, 60], [-45, 60], [-20, 70], [-25, 82], [-60, 80], [-70, 76]],
};
// migration stops (lon, lat) and routes (lists of stops)
W.STOP = { eafrica: [37, 3], arabia: [45, 18], levant: [36, 32], india: [78, 20], seasia: [103, 12], australia: [134, -24], europe: [12, 48], casia: [70, 45], easia: [115, 35], beringia: [-170, 66], namerica: [-100, 45], samerica: [-62, -15], arctic: [-60, 72] };
W.ROUTES = [['eafrica', 'arabia', 'india', 'seasia', 'australia'], ['arabia', 'levant', 'europe'], ['levant', 'casia', 'easia', 'beringia', 'namerica', 'samerica'], ['namerica', 'arctic']];
// orthographic projection: returns [x, y, visible]
W.proj = (lon, lat, cx, cy, r, lon0, lat0 = 12) => { const d = Math.PI / 180, l = (lon - lon0) * d, p = lat * d, p0 = lat0 * d, x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l), z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l); return [cx + x * r, cy - y * r, z > 0]; };
// densify a polygon so the projected outline curves with the globe
W.dense = (pts, n = 6) => { const o = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; for (let k = 0; k < n; k++) o.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return o; };
W.globe = (ctx, t, cx, cy, r, lon0, o = {}) => {
  // space, glow, ocean sphere
  const gl = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35); gl.addColorStop(0, 'rgba(90,180,255,0.45)'); gl.addColorStop(1, 'rgba(90,180,255,0)'); ctx.fillStyle = gl; ctx.fillRect(cx - r * 1.4, cy - r * 1.4, r * 2.8, r * 2.8);
  const oc = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r); oc.addColorStop(0, '#3a9aff'); oc.addColorStop(0.7, '#1a5ad0'); oc.addColorStop(1, '#0a2a80'); ctx.fillStyle = oc; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  for (const [name, poly] of Object.entries(W.LAND)) { const pts = W.dense(poly).map(([lo, la]) => W.proj(lo, la, cx, cy, r, lon0)); if (!pts.some((q) => q[2])) continue;
    const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); const tint = o.tint ? o.tint(name) : null; g.addColorStop(0, tint ?? '#8ad86a'); g.addColorStop(1, tint ? mixc(tint, '#000', 0.2) : '#3a9a4a');
    ctx.fillStyle = g; ctx.beginPath(); pts.forEach(([x, y, v], i) => { const [px, py] = v ? [x, y] : [cx + (x - cx) * 1.0, cy + (y - cy) * 1.0]; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.fill(); }
  // night side shade and a rim highlight
  const sh = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.3, cx, cy, r * 1.05); sh.addColorStop(0, 'rgba(255,255,255,0.08)'); sh.addColorStop(0.7, 'rgba(0,0,30,0)'); sh.addColorStop(1, 'rgba(0,0,40,0.45)'); ctx.fillStyle = sh; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
  // routes: glowing arcs drawn up to progress p (0..routes.length), with travelling dots
  const p = o.routes ?? 0; ctx.lineCap = 'round';
  W.ROUTES.forEach((route, ri) => { const rp = K.clamp(p - ri * 0.6); if (rp <= 0) return; const pts = []; for (let s = 0; s < route.length - 1; s++) { const a = W.STOP[route[s]], b = W.STOP[route[s + 1]]; let db = b[0] - a[0]; if (db > 180) db -= 360; if (db < -180) db += 360; for (let k = 0; k <= 12; k++) pts.push([a[0] + db * k / 12, a[1] + (b[1] - a[1]) * k / 12]); }
    const n = Math.max(2, Math.floor(pts.length * rp)), pr = pts.slice(0, n).map(([lo, la]) => W.proj(lo, la, cx, cy, r * 1.01, lon0));
    for (const [col, lw] of [['rgba(255,210,90,0.35)', r * 0.05], ['#ffe08a', r * 0.016]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let pen = false; for (const [x, y, v] of pr) { if (!v) { pen = false; continue; } pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; } ctx.stroke(); }
    const last = pr[pr.length - 1]; if (last[2]) { wEll(ctx, last[0], last[1], r * 0.025, r * 0.025, '#fff6d0'); } });
  for (const k of o.dots ?? []) { const [x, y, v] = W.proj(...W.STOP[k], cx, cy, r, lon0); if (v) { wEll(ctx, x, y, r * 0.03, r * 0.03, '#fff6d0'); } }
};
// a flat world map (equirectangular) in a box; fill(name, lat) chooses a colour per land piece and latitude band
W.flatMap = (ctx, x, y, w, h, fill, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const X = (lo) => x + (lo + 180) / 360 * w, Y = (la) => y + (85 - la) / 145 * h;
  ctx.fillStyle = '#123a7a'; ctx.beginPath(); ctx.roundRect(x - 10, y - 10, w + 20, h + 20, 20); ctx.fill();
  for (const [name, poly] of Object.entries(W.LAND)) { ctx.save(); ctx.beginPath(); W.dense(poly, 4).forEach(([lo, la], i) => (i ? ctx.lineTo(X(lo), Y(la)) : ctx.moveTo(X(lo), Y(la)))); ctx.closePath(); ctx.clip();
    for (let la = 85; la > -60; la -= 5) { ctx.fillStyle = fill(name, la - 2.5); ctx.fillRect(x, Y(la), w, Y(la - 5) - Y(la) + 1); } ctx.restore(); }
  ctx.restore(); };
W.uvCol = (la) => { const u = Math.cos(la * Math.PI / 180) ** 3; return u > 0.8 ? mixc('#ff3a4a', '#b04aff', (u - 0.8) * 5) : u > 0.5 ? mixc('#ffb03a', '#ff3a4a', (u - 0.5) / 0.3) : mixc('#4ade8a', '#ffb03a', u / 0.5); };
W.toneCol = (name, la) => { let u = Math.cos(la * Math.PI / 180) ** 2.4; if (name === 'greenland' || (name === 'namerica' && la > 60)) u = Math.max(u, 0.42); if (name === 'samerica' || name === 'namerica') u *= 0.82; return mixc(Folk.SKIN[7], Folk.SKIN[0], u); };

// ---------- the cold north: a snowy steppe at a low winter sun, mammoths far off ----------
W.mammoth = (ctx, t, x, y, s, dir = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  const fur = '#6a4a3a'; ctx.fillStyle = mixc(fur, '#000', 0.2); for (const lx of [-28, 22]) ctx.fillRect(lx, 0, 14, 34);
  ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(0, -10, 48, 34, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(40, -30, 24, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(28, -46, 14, 14, 0, 0, 7); ctx.fill();
  for (const lx of [-20, 30]) ctx.fillRect(lx, 0, 15, 36);
  ctx.strokeStyle = fur; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(56, -22); ctx.quadraticCurveTo(66 + Math.sin(t) * 3, 4, 58, 22); ctx.stroke();
  ctx.strokeStyle = '#f0e6d0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(52, -18); ctx.quadraticCurveTo(76, -4, 70, -26); ctx.stroke();
  ctx.strokeStyle = mixc(fur, '#000', 0.3); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 14; i++) { const hx = -40 + i * 6; ctx.moveTo(hx, 16); ctx.lineTo(hx - 2, 28); } ctx.stroke();
  ctx.restore(); };
W.steppe = (ctx, t, pan = 0, o = {}) => {
  const sunY = o.sunY ?? 560, sunX = 1500 - pan * 0.04;
  const sky = ctx.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, '#5a6ad8'); sky.addColorStop(0.6, '#b8b0f0'); sky.addColorStop(1, '#ffd0c0'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1920, 1080);
  const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 380); sg.addColorStop(0, 'rgba(255,248,230,1)'); sg.addColorStop(0.15, 'rgba(255,235,210,0.7)'); sg.addColorStop(1, 'rgba(255,220,200,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1920, 1080); wEll(ctx, sunX, sunY, 56, 56, '#fff8ec');
  for (const [yb, col, amp, par] of [[600, '#c8c4ee', 160, 0.1], [640, '#a8a4e0', 90, 0.18]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 24) { const u = (x + pan * par) * 0.003; ctx.lineTo(x, yb - amp * Math.max(0, Math.sin(u) * Math.sin(u * 2.3 + 1))); } ctx.lineTo(1920, 1080); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.55)'; }
  const sn = ctx.createLinearGradient(0, 640, 0, 1080); sn.addColorStop(0, '#e8eaff'); sn.addColorStop(1, '#b8c0f0'); ctx.fillStyle = sn; ctx.fillRect(0, 640, 1920, 440);
  for (let i = 0; i < 26; i++) { const x = ((K.hash(i, 5) * 2200 - pan * 0.6) % 2200 + 2200) % 2200 - 140, y = 680 + K.hash(i, 6) * 360; wEll(ctx, x, y, 60 + K.hash(i, 7) * 80, 8, 'rgba(160,170,230,0.35)'); }
  for (let i = 0; i < 3; i++) W.mammoth(ctx, t, ((1100 + i * 130 - pan * 0.25) % 2300 + 2300) % 2300 - 190, 690 + i * 8, 0.9 - i * 0.12, -1);
  // falling snow
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 80; i++) { const x = (K.hash(i, 1) * 1920 + t * 20 + Math.sin(t + i) * 20) % 1920, y = (K.hash(i, 2) * 1080 + t * (40 + K.hash(i, 3) * 40)) % 1080; ctx.beginPath(); ctx.arc(x, y, 2 + K.hash(i, 4) * 2, 0, 7); ctx.fill(); }
};
// a long shadow for a walker at a low sun (to the left)
W.longShadow = (ctx, x, y, H, len = 2.2) => { ctx.fillStyle = 'rgba(80,90,170,0.35)'; ctx.beginPath(); ctx.ellipse(x - H * len * 0.5, y + 4, H * len * 0.5, H * 0.05, 0, 0, 7); ctx.fill(); };

// ---------- night camp: an ice-age fire under the stars ----------
W.campfire = (ctx, t, fx = 1180, fy = 900) => {
  const sky = ctx.createLinearGradient(0, 0, 0, 1080); sky.addColorStop(0, '#0a0e30'); sky.addColorStop(1, '#2a1a40'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 120; i++) { ctx.fillStyle = `rgba(255,255,240,${0.3 + 0.6 * K.hash(i, 3) * (0.6 + 0.4 * Math.sin(t * 2 + i))})`; ctx.beginPath(); ctx.arc(K.hash(i, 1) * 1920, K.hash(i, 2) * 600, 1 + K.hash(i, 4) * 1.6, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#1a1430'; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 30) ctx.lineTo(x, 640 - 120 * Math.max(0, Math.sin(x * 0.004 + 1))); ctx.lineTo(1920, 1080); ctx.fill();
  ctx.fillStyle = '#2a1e2a'; ctx.fillRect(0, 760, 1920, 320);
  const glow = ctx.createRadialGradient(fx, fy - 60, 20, fx, fy - 60, 700); glow.addColorStop(0, 'rgba(255,160,60,0.55)'); glow.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283; wEll(ctx, fx + Math.cos(a) * 80, fy + Math.sin(a) * 18, 30, 16, '#4a3a3a'); }
  for (let k = 0; k < 3; k++) { const h = 150 - k * 35, w = 70 - k * 18, fl = Math.sin(t * 9 + k) * 8; ctx.fillStyle = ['#ff6a1a', '#ffa83a', '#fff0a0'][k]; ctx.beginPath(); ctx.moveTo(fx - w, fy); ctx.quadraticCurveTo(fx - w * 0.6 + fl, fy - h * 0.6, fx + fl * 1.5, fy - h); ctx.quadraticCurveTo(fx + w * 0.6 - fl, fy - h * 0.6, fx + w, fy); ctx.fill(); }
  for (let i = 0; i < 16; i++) { const u = (t * 0.6 + K.hash(i, 9)) % 1; wEll(ctx, fx + Math.sin(i + t * 2) * 30 * u, fy - 120 - u * 400, 3, 3, `rgba(255,190,90,${1 - u})`); }
};

// ---------- the Arctic coast at twilight: aurora, icebergs, sea, a kayak, a seal, a lamp ----------
W.arctic = (ctx, t) => {
  const sky = ctx.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, '#0e1650'); sky.addColorStop(0.7, '#3a3aa0'); sky.addColorStop(1, '#c86aa0'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1920, 1080);
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(${k === 1 ? '120,255,200' : '80,230,170'},${0.25 - k * 0.05})`; ctx.lineWidth = 60 - k * 14; ctx.beginPath(); for (let x = -40; x <= 1960; x += 30) ctx[x < 0 ? 'moveTo' : 'lineTo'](x, 160 + k * 40 + Math.sin(x * 0.004 + t * 0.4 + k) * 60); ctx.stroke(); }
  ctx.fillStyle = '#4a4aa8'; ctx.beginPath(); ctx.moveTo(0, 640); for (let x = 0; x <= 1920; x += 40) ctx.lineTo(x, 600 - 110 * Math.max(0, Math.sin(x * 0.005))); ctx.lineTo(1920, 640); ctx.fill();
  const sea = ctx.createLinearGradient(0, 620, 0, 1080); sea.addColorStop(0, '#2a4ab0'); sea.addColorStop(1, '#0e1a60'); ctx.fillStyle = sea; ctx.fillRect(0, 620, 1920, 460);
  for (const [bx, bw, bh] of [[1400, 160, 260], [1650, 90, 140], [1180, 60, 80]]) { ctx.fillStyle = '#e8f4ff'; ctx.beginPath(); ctx.moveTo(bx - bw, 640); ctx.lineTo(bx - bw * 0.2, 640 - bh); ctx.lineTo(bx + bw * 0.1, 640 - bh * 0.7); ctx.lineTo(bx + bw, 640); ctx.fill(); ctx.fillStyle = '#9ac0f0'; ctx.beginPath(); ctx.moveTo(bx - bw * 0.2, 640 - bh); ctx.lineTo(bx + bw * 0.1, 640 - bh * 0.7); ctx.lineTo(bx + bw, 640); ctx.lineTo(bx, 640); ctx.fill(); }
  for (let i = 0; i < 30; i++) { const y = 660 + K.hash(i, 3) * 400; wEll(ctx, (K.hash(i, 2) * 1920 + t * 10) % 1920, y, 40 + K.hash(i, 4) * 60, 3, 'rgba(200,220,255,0.3)'); }
  // shore rocks with snow
  ctx.fillStyle = '#3a3a5a'; ctx.beginPath(); ctx.moveTo(0, 1080); ctx.lineTo(0, 820); ctx.quadraticCurveTo(500, 760, 1000, 860); ctx.lineTo(1100, 1080); ctx.fill(); ctx.fillStyle = '#e0e8ff'; ctx.beginPath(); ctx.moveTo(0, 830); ctx.quadraticCurveTo(500, 770, 1000, 868); ctx.quadraticCurveTo(500, 800, 0, 860); ctx.fill();
  // kayak and a seal head in the water
  ctx.fillStyle = '#6a3a24'; ctx.beginPath(); ctx.moveTo(1050, 860); ctx.quadraticCurveTo(1300, 900, 1560, 850); ctx.quadraticCurveTo(1300, 880, 1050, 860); ctx.fill();
  const sx = 1680, sy = 800 + Math.sin(t * 1.5) * 6; wEll(ctx, sx, sy, 34, 26, '#5a5a6a'); wEll(ctx, sx + 22, sy + 4, 14, 10, '#6a6a7a'); wEll(ctx, sx + 6, sy - 6, 4, 4, '#101018'); wEll(ctx, sx, sy + 26, 50, 6, 'rgba(200,220,255,0.4)');
};
W.lamp = (ctx, t, x, y) => { const g = ctx.createRadialGradient(x, y - 20, 5, x, y - 20, 360); g.addColorStop(0, 'rgba(255,190,90,0.7)'); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - 360, y - 380, 720, 720);
  wEll(ctx, x, y, 46, 14, '#8a8478'); wEll(ctx, x, y - 4, 40, 9, '#5a3a20'); const fl = Math.sin(t * 8) * 3; ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.moveTo(x - 14, y - 6); ctx.quadraticCurveTo(x - 6 + fl, y - 30, x + fl, y - 46); ctx.quadraticCurveTo(x + 8 - fl, y - 30, x + 14, y - 6); ctx.fill(); };

// ---------- a South Asian river valley: palms, rice terraces, water, strong sun ----------
W.palm = (ctx, t, x, y, h) => { ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = h * 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.1, y - h * 0.5, x + h * 0.05, y - h); ctx.stroke();
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42 + Math.sin(t + i) * 0.04, L = h * 0.45; ctx.strokeStyle = i % 2 ? '#3a8a3a' : '#4aa84a'; ctx.lineWidth = h * 0.05; ctx.beginPath(); ctx.moveTo(x + h * 0.05, y - h); ctx.quadraticCurveTo(x + h * 0.05 + Math.cos(a) * L * 0.6, y - h + Math.sin(a) * L * 0.6 - h * 0.05, x + h * 0.05 + Math.cos(a) * L, y - h + Math.sin(a) * L + L * 0.35); ctx.stroke(); } };
W.paddy = (ctx, t, pan = 0) => {
  const sky = ctx.createLinearGradient(0, 0, 0, 600); sky.addColorStop(0, '#3ab0f0'); sky.addColorStop(1, '#c8f0ff'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1920, 1080);
  const sg = ctx.createRadialGradient(1500, 150, 0, 1500, 150, 300); sg.addColorStop(0, 'rgba(255,255,230,1)'); sg.addColorStop(0.2, 'rgba(255,250,200,0.6)'); sg.addColorStop(1, 'rgba(255,250,200,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1920, 600); wEll(ctx, 1500, 150, 60, 60, '#fffbe0');
  for (const [yb, col, amp] of [[480, '#7ab0a0', 200], [540, '#4a9a6a', 120]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 30) ctx.lineTo(x, yb - amp * Math.abs(Math.sin((x + pan * 0.1) * 0.0035 + yb))); ctx.lineTo(1920, 1080); ctx.fill(); }
  for (let r = 0; r < 6; r++) { const y = 600 + r * 80, g = ctx.createLinearGradient(0, y, 0, y + 80); g.addColorStop(0, r % 2 ? '#8ad8e8' : '#6ac87a'); g.addColorStop(1, r % 2 ? '#5ab0c8' : '#4aa85a'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, y + 10); for (let x = 0; x <= 1920; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.004 + r) * 14); ctx.lineTo(1920, y + 90); ctx.lineTo(0, y + 90); ctx.fill();
    ctx.strokeStyle = 'rgba(60,140,60,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 60; i++) { const x = ((K.hash(i, r) * 2000 - pan * (0.4 + r * 0.1)) % 2000 + 2000) % 2000 - 40, yy = y + 50 + K.hash(i, r + 7) * 20; ctx.moveTo(x, yy); ctx.lineTo(x + Math.sin(t + i) * 3, yy - 16 - r * 2); } ctx.stroke(); }
  for (const [px, h] of [[120, 420], [300, 330], [1750, 400], [1600, 300]]) W.palm(ctx, t, px - pan * 0.3, 640, h);
};

// ---------- science close-ups ----------
// UV beams from the upper left onto a surface line y0, some stopped (bounce) where blocked(x) is true
W.uvBeams = (ctx, t, y0, blocked, n = 7, a = 1) => { for (let i = 0; i < n; i++) { const ph = (t * 0.7 + i / n) % 1, x1 = 200 + i * 240 + (K.hash(i, 2) - 0.5) * 80, x0 = x1 - 300, y1 = blocked && blocked(x1) ? y0 : y0 + 160, u = Math.min(1, ph * 1.6);
  const hx = K.lerp(x0, x1, u), hy = K.lerp(-40, y1, u); ctx.strokeStyle = `rgba(200,120,255,${0.8 * a})`; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(K.lerp(x0, x1, Math.max(0, u - 0.25)), K.lerp(-40, y1, Math.max(0, u - 0.25))); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.strokeStyle = `rgba(255,240,255,${0.9 * a})`; ctx.lineWidth = 3; ctx.stroke();
  if (blocked && blocked(x1) && ph > 0.62) { const v = (ph - 0.62) / 0.38; ctx.strokeStyle = `rgba(200,120,255,${0.7 * (1 - v) * a})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + 120 * v, y1 - 160 * v); ctx.stroke(); } } };
// a folate molecule (a little chain of three rings), optionally breaking apart (b 0..1)
W.folate = (ctx, x, y, s, b = 0) => { const parts = [[-1, 0, '#ffd23a'], [0, 0, '#ff8a3a'], [1, 0, '#4ad0a0']]; parts.forEach(([dx, dy, c], i) => { const ox = dx * s * (1 + b * 1.2), oy = dy * s + (i - 1) * b * s * 0.6 * (i === 1 ? -1 : 1);
  ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(b * (i - 1) * 1.2); ctx.fillStyle = c; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + Math.PI / 6; ctx.lineTo(Math.cos(a) * s * 0.42, Math.sin(a) * s * 0.42); } ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.12, s * 0.1, 0, 7); ctx.fill(); ctx.restore(); });
  if (b < 0.2) { ctx.strokeStyle = '#ffe8a0'; ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(x - s * 0.6, y); ctx.lineTo(x + s * 0.6, y); ctx.stroke(); } };
// vitamin D forming: a ring molecule that opens (u 0..1) with a golden glow
W.vitaminD = (ctx, t, x, y, s, u) => { const glow = ctx.createRadialGradient(x, y, 0, x, y, s * 2.2); glow.addColorStop(0, `rgba(255,220,90,${0.55 * u})`); glow.addColorStop(1, 'rgba(255,220,90,0)'); ctx.fillStyle = glow; ctx.fillRect(x - s * 2.2, y - s * 2.2, s * 4.4, s * 4.4);
  const rings = [[-1.1, 0.2], [-0.25, -0.25], [0.6, 0.15], [1.3, -0.35]]; rings.forEach(([dx, dy], i) => { const open = i === 1 ? u : 0; ctx.save(); ctx.translate(x + dx * s + (i > 1 ? open * s * 0.4 : 0), y + dy * s - (i > 1 ? open * s * 0.3 : 0)); ctx.strokeStyle = mixc('#c8b0ff', '#ffd23a', u); ctx.lineWidth = s * 0.12; ctx.lineJoin = 'round'; ctx.beginPath(); for (let k = 0; k < 6; k++) { if (open > 0.5 && k === 2) { ctx.moveTo(Math.cos((k + 1) / 6 * 6.283) * s * 0.45, Math.sin((k + 1) / 6 * 6.283) * s * 0.45); continue; } const a = k / 6 * 6.283; ctx.lineTo(Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45); } ctx.closePath(); ctx.stroke(); ctx.restore(); }); };
// a DNA double helix across the screen; marks = [[pos 0..1, colour]] highlighted rungs
W.dna = (ctx, t, y, amp, marks = [], a = 1) => { ctx.save(); ctx.globalAlpha = a; const n = 70;
  for (let i = 0; i < n; i++) { const x = -40 + i * 29, ph = i * 0.42 + t * 0.8, y1 = y + Math.sin(ph) * amp, y2 = y - Math.sin(ph) * amp, m = marks.find(([p]) => Math.abs(p * n - i) < 0.6);
    ctx.strokeStyle = m ? m[1] : 'rgba(180,200,255,0.5)'; ctx.lineWidth = m ? 10 : 5; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke(); if (m) { const g = ctx.createRadialGradient(x, y, 0, x, y, 60); g.addColorStop(0, m[1]); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = a * 0.5; ctx.fillStyle = g; ctx.fillRect(x - 60, y - 60, 120, 120); ctx.globalAlpha = a; } }
  for (const sg of [1, -1]) { ctx.strokeStyle = sg > 0 ? '#5ab0ff' : '#ff6ab0'; ctx.lineWidth = 9; ctx.beginPath(); for (let i = 0; i <= n * 4; i++) { const x = -40 + i * 29 / 4, ph = i / 4 * 0.42 + t * 0.8; ctx[i ? 'lineTo' : 'moveTo'](x, y + sg * Math.sin(ph) * amp); } ctx.stroke(); }
  ctx.restore(); };
