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
  // flat 2D (the user's note): one flat dark shape for the body and arms, a flat lighter inner tone, a flat nucleus;
  // no shadow, no gradient, no highlights
  const DARK = '#4a1e0a', MID = '#6e3416';
  for (const d of dendrites) { ribbon(d.branch, 26, 14, DARK); ribbon(d.main, d.w0, 22, DARK); }
  body(0, 0, 112, 70, DARK);
  for (const d of dendrites) { ribbon(d.branch.slice(1), 12, 6, MID); ribbon(d.main.slice(2), d.w0 * 0.45, 9, MID); }
  body(0, 0, 84, 48, MID);
  wEll(ctx, mx + 6, my + 4, 34, 28, '#2a0a02');
  const armPts = dendrites.flatMap((d) => [d.main, d.branch]);
  // melanin granules: travelling up the arms, then sitting as caps over each nucleus
  for (const [x, y, rx] of cells) { const n = Math.round(26 * dose); for (let k = 0; k < n; k++) { const a = Math.PI * (1.05 + 0.9 * K.hash(k, x)), d = rx * (0.42 + 0.3 * K.hash(k, x + 1)), sx = x + (K.hash(k, x + 2) - 0.5) * rx * 1.6, sy = y + (K.hash(k, x + 3) - 0.5) * 140, tx = x + Math.cos(a) * d * 0.9, ty = y + 10 + Math.sin(a) * d * 0.55;
    const px = K.lerp(sx, tx, cap), py = K.lerp(sy, ty, cap), r = 6 + K.hash(k, x + 4) * 5; wEll(ctx, px, py, r, r, mixc('#3a1a0a', '#7a4020', K.hash(k, x + 5))); wEll(ctx, px - r * 0.3, py - r * 0.3, r * 0.3, r * 0.3, 'rgba(255,200,150,0.5)'); } }
  for (let k = 0; k < 60; k++) { const pts = armPts[k % armPts.length], u = (t * 0.22 + K.hash(k, 3)) % 1, f = u * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(f)), q = f - j, px = K.lerp(pts[j][0], pts[j + 1][0], q), py = K.lerp(pts[j][1], pts[j + 1][1], q); wEll(ctx, px, py, 6, 6, '#24080a'); }
};
