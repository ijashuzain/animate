// The eye film's world, after the user's reference grid (refs/ref-grid.webp): the eye in cross-section (tile 1), the retina's
// layers with rods and coloured cones (tile 4), and later the cone's discs, neurons, the brain from above. Screen space (px),
// deterministic. Shading kept glossy (the user prefers volume over flat 2D).
const E = {};
const mixc = (a, b, u) => P.mixc(a, b, K.clamp(u));
const eEll = (ctx, x, y, rx, ry, col, rot = 0) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, 7); ctx.fill(); };
const navy = (ctx) => { const g = ctx.createRadialGradient(960, 540, 100, 960, 540, 1200); g.addColorStop(0, '#16206a'); g.addColorStop(1, '#060a2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); };

// a branching blood vessel from (x, y) at angle a, length L, depth d
const vessel = (ctx, x, y, a, L, w, d, seed, col) => { if (d > 4 || L < 12) return; const bend = (K.hash(seed, d) - 0.5) * 0.5, x2 = x + Math.cos(a + bend) * L, y2 = y + Math.sin(a + bend) * L;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + x2) / 2 + Math.sin(seed + d) * L * 0.15, (y + y2) / 2, x2, y2); ctx.stroke();
  for (const k of [-1, 1]) vessel(ctx, x2, y2, a + k * (0.35 + 0.3 * K.hash(seed + k, d + 2)), L * 0.68, w * 0.7, d + 1, seed * 3 + k + 7, col); };

// ---------- the eye in cross-section (tile 1): eye centre (cx, cy), radius R; o.pupil 0..1 (open), o.lens 0..1 (rounder) ----------
E.eye = (ctx, t, cx, cy, R, o = {}) => {
  const pupil = o.pupil ?? 0.5, lensRound = o.lens ?? 0.3;
  // optic nerve leaving to the right, a little below the axis
  const ny = cy + R * 0.05;
  for (const [w, col] of [[R * 0.42, '#9a7ae0'], [R * 0.34, '#d0a8f0'], [R * 0.22, '#ffd040'], [R * 0.12, '#ffe890']]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(cx + R * 0.85, ny); ctx.bezierCurveTo(cx + R * 1.25, ny, cx + R * 1.35, ny + R * 0.12, cx + R * 2.4, ny + R * 0.2); ctx.stroke(); }
  // sclera (outer coat): lavender ring, then a pink and a red layer (choroid), then the yellow retina line
  const ring = (r, col) => eEll(ctx, cx, cy, r, r * 0.97, col);
  ring(R * 1.08, '#a88af0'); ring(R * 1.03, '#e8c0f8'); ring(R * 0.99, '#ff9a8a'); ring(R * 0.96, '#e83a3a'); ring(R * 0.935, '#ffd040');
  // the inside (vitreous) glowing orange-red with vessels from the optic disc
  const vg = ctx.createRadialGradient(cx + R * 0.2, cy, R * 0.1, cx, cy, R * 0.93); vg.addColorStop(0, '#ffb040'); vg.addColorStop(0.6, '#f0602a'); vg.addColorStop(1, '#b02020'); ctx.fillStyle = vg; ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.92, R * 0.9, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.92, R * 0.9, 0, 0, 7); ctx.clip();
  const dx = cx + R * 0.88, dy = ny; for (let i = 0; i < 6; i++) { const a = Math.PI + (i - 2.5) * 0.42; vessel(ctx, dx, dy, a, R * 0.32, R * 0.028, 0, i + 11, i % 2 ? 'rgba(60,70,220,0.8)' : 'rgba(170,20,40,0.85)'); }
  ctx.restore();
  // the front, one piece with the globe: the cornea is a clear dome bulging from the sclera; behind it a soft clear chamber,
  // the iris as two curved blue leaves either side of the pupil, the ciliary body (pink folds) holding the lens
  const fx = cx - R * 0.8, domeX = cx - R * 1.2;
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.08, R * 1.05, 0, Math.PI * 0.62, Math.PI * 1.38); ctx.lineTo(domeX + R * 0.02, cy - R * 0.45); ctx.quadraticCurveTo(domeX - R * 0.12, cy, domeX + R * 0.02, cy + R * 0.45); ctx.closePath();
  const ch = ctx.createLinearGradient(domeX, 0, fx + R * 0.2, 0); ch.addColorStop(0, 'rgba(200,230,255,0.55)'); ch.addColorStop(1, 'rgba(150,190,255,0.35)'); ctx.fillStyle = ch; ctx.fill(); ctx.restore();
  // the dome's bright rim and a long highlight
  ctx.strokeStyle = 'rgba(210,235,255,0.9)'; ctx.lineWidth = R * 0.035; ctx.beginPath(); ctx.moveTo(cx + Math.cos(Math.PI * 0.7) * R * 1.06, cy + Math.sin(Math.PI * 0.7) * R * 1.03); ctx.quadraticCurveTo(domeX - R * 0.2, cy + R * 0.55, domeX - R * 0.08, cy); ctx.quadraticCurveTo(domeX - R * 0.2, cy - R * 0.55, cx + Math.cos(Math.PI * 1.3) * R * 1.06, cy + Math.sin(Math.PI * 1.3) * R * 1.03); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = R * 0.018; ctx.beginPath(); ctx.moveTo(domeX - R * 0.02, cy - R * 0.35); ctx.quadraticCurveTo(domeX - R * 0.12, cy - R * 0.1, domeX - R * 0.1, cy + R * 0.05); ctx.stroke();
  // ciliary body: pink folds above and below, in front of the vitreous
  for (const sg of [-1, 1]) { const y0 = cy + sg * R * 0.56; const g = ctx.createRadialGradient(fx + R * 0.16, y0, 4, fx + R * 0.16, y0, R * 0.2); g.addColorStop(0, '#ffb0d0'); g.addColorStop(1, '#e04a88'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(fx + R * 0.16, y0, R * 0.11, R * 0.2, sg * 0.2, 0, 7); ctx.fill();
    for (let k = 0; k < 6; k++) eEll(ctx, fx + R * 0.26, y0 - sg * R * (0.02 + k * 0.045), R * 0.045, R * 0.016, '#ff6aa0'); }
  // the iris: two curved leaves (thicker near the root), blue with radial fibres; the pupil gap between them
  const gap = R * (0.08 + 0.2 * pupil);
  for (const sg of [-1, 1]) { const y0 = cy + sg * gap, y1 = cy + sg * R * 0.6, g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#1a2a8a'); g.addColorStop(0.35, '#3a8aff'); g.addColorStop(1, '#2a5ad0'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(fx - R * 0.02, y0); ctx.quadraticCurveTo(fx + R * 0.03, (y0 + y1) / 2, fx + R * 0.07, y1); ctx.lineTo(fx - R * 0.07, y1); ctx.quadraticCurveTo(fx - R * 0.06, (y0 + y1) / 2, fx - R * 0.04, y0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(170,225,255,0.55)'; ctx.lineWidth = 2; for (let k = 0; k < 7; k++) { const u = (k + 0.5) / 7, yy = y0 + (y1 - y0) * u; ctx.beginPath(); ctx.moveTo(fx - R * 0.05 * (0.5 + u), yy); ctx.lineTo(fx + R * 0.05 * (0.5 + u), yy + sg * 6); ctx.stroke(); } }
  // lens: a clear biconvex shape, rounder with o.lens
  const lx = fx + R * 0.2, lw = R * (0.11 + 0.06 * lensRound), lh = R * (0.36 - 0.04 * lensRound), lg = ctx.createLinearGradient(lx - lw, 0, lx + lw, 0); lg.addColorStop(0, 'rgba(210,235,255,0.9)'); lg.addColorStop(0.5, 'rgba(245,250,255,0.8)'); lg.addColorStop(1, 'rgba(170,205,255,0.9)');
  ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(lx, cy, lw, lh, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(140,180,255,0.75)'; ctx.lineWidth = 3; ctx.stroke(); eEll(ctx, lx - lw * 0.4, cy - lh * 0.45, lw * 0.22, lh * 0.14, 'rgba(255,255,255,0.75)', -0.3);
  for (const sg of [-1, 1]) { ctx.strokeStyle = 'rgba(255,180,220,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, cy + sg * lh); ctx.lineTo(fx + R * 0.2, cy + sg * R * 0.5); ctx.stroke(); }
  return { front: [domeX - R * 0.08, cy], lens: [lx, cy], focus: [cx + R * 0.9, cy], disc: [dx, dy] };
};
// the ray: a glowing beam from the left edge to the cornea, bent through the lens to a focus point on the retina
E.ray = (ctx, t, geo, w, col = '255,170,50', a = 1) => { if (a <= 0) return; const [fx, fy] = geo.front, [lx, ly] = geo.lens, [px, py] = geo.focus;
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'screen';
  const beam = (pts, w0, w1, alpha) => { const g = ctx.createLinearGradient(pts[0][0], 0, pts[pts.length - 1][0], 0); g.addColorStop(0, `rgba(${col},${alpha})`); g.addColorStop(1, `rgba(${col},${alpha * 0.9})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1] - w0 / 2); for (const [x, y, ww] of pts) ctx.lineTo(x, y - ww / 2); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + pts[i][2] / 2); ctx.fill(); };
  // incoming: a glowing shaft (bright core fading to nothing at its edges), then converging bands inside the eye
  ctx.globalCompositeOperation = 'lighter';
  const sg = ctx.createLinearGradient(0, fy - w * 0.6, 0, fy + w * 0.6); sg.addColorStop(0, `rgba(${col},0)`); sg.addColorStop(0.3, 'rgba(255,215,120,0.3)'); sg.addColorStop(0.5, 'rgba(255,245,200,0.95)'); sg.addColorStop(0.7, 'rgba(255,215,120,0.3)'); sg.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = sg; ctx.fillRect(-20, fy - w * 0.6, fx + 20 + w * 0.1, w * 1.2);
  ctx.globalCompositeOperation = 'screen';
  for (const [k, al] of [[0.55, 0.4], [0.2, 0.85]]) beam([[fx, fy, w * k], [lx, ly, w * 0.9 * k], [px, py, 3 * k]], w * k, 2, al);
  const gl = ctx.createRadialGradient(px, py, 0, px, py, w * 0.8); gl.addColorStop(0, `rgba(255,250,220,0.9)`); gl.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = gl; ctx.fillRect(px - w, py - w, w * 2, w * 2);
  ctx.restore(); };

// ---------- the retina's layers (tile 4): light from the top, ganglion cells and fibres, bipolar network, rods and cones ----------
// o.lit: which cone kinds glow ('L', 'M', 'S' for red, green, blue); o.beam: x of a single ray coming down (or null)
E.retina = (ctx, t, o = {}) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#ff9a3a'); bg.addColorStop(0.3, '#a0402a'); bg.addColorStop(0.55, '#3a1a6a'); bg.addColorStop(1, '#1a0e40'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  // light from above
  ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = 560 + i * 130 + Math.sin(t * 0.4 + i) * 10, g = ctx.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, 'rgba(255,230,140,0.35)'); g.addColorStop(1, 'rgba(255,230,140,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + 100 + (i - 3) * 30, 760); ctx.lineTo(x + 20 + (i - 3) * 30, 760); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
  // nerve fibre layer (wavy orange strands)
  for (let k = 0; k < 6; k++) { ctx.strokeStyle = `rgba(255,${170 + k * 10},${90 + k * 10},0.5)`; ctx.lineWidth = 6; ctx.beginPath(); for (let x = -20; x <= 1940; x += 20) ctx[x < 0 ? 'moveTo' : 'lineTo'](x, 70 + k * 18 + Math.sin(x * 0.006 + k + t * 0.3) * 14); ctx.stroke(); }
  // bipolar network (purple), drawn behind the ganglion cells
  const gy = 260, by = 430;
  ctx.strokeStyle = '#8a5ad8'; ctx.lineCap = 'round';
  for (let i = 0; i < 16; i++) { const x = 60 + i * 120 + K.hash(i, 3) * 30; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, by); ctx.quadraticCurveTo(x + 30, (gy + by) / 2, x + (K.hash(i, 4) - 0.5) * 120, gy + 30); ctx.stroke(); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x - 40, 560); ctx.moveTo(x, by); ctx.lineTo(x + 50, 560); ctx.stroke(); eEll(ctx, x, by, 26, 22, '#9a6ae8'); eEll(ctx, x - 6, by - 6, 8, 6, 'rgba(255,220,255,0.6)'); }
  ctx.fillStyle = 'rgba(120,70,200,0.5)'; ctx.fillRect(0, 330, 1920, 40);
  ctx.strokeStyle = 'rgba(160,110,240,0.7)'; ctx.lineWidth = 6; for (let i = 0; i < 18; i++) { const x = i * 110 + K.hash(i, 9) * 40; ctx.beginPath(); ctx.moveTo(x, 520); ctx.quadraticCurveTo(x + 60, 480 + K.hash(i, 10) * 60, x + 130, 530); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 20, 360); ctx.quadraticCurveTo(x + 70, 400, x + 140, 370); ctx.stroke(); }
  // ganglion cells (yellow) with fibres up into the fibre layer
  for (let i = 0; i < 13; i++) { const x = 90 + i * 145 + K.hash(i, 5) * 30, y = gy + (K.hash(i, 6) - 0.5) * 30, r = 30 + K.hash(i, 7) * 12;
    ctx.strokeStyle = '#ffc840'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y - 80, x + 70, 150); ctx.stroke();
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 3, x, y, r); g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a020'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); eEll(ctx, x, y, r * 0.45, r * 0.45, '#e8701a'); }
  // rods and cones, standing on the pigment layer at the bottom
  const base = 1000, kinds = { L: '#ff2a3a', M: '#4ad83a', S: '#2a7aff' }, order = ['L', 'M', 'S', 'L', 'M', 'S', 'L'];
  for (let i = 0; i < 30; i++) { const x = 30 + i * 64; if (i % 4 === 2) continue;
    const g = ctx.createLinearGradient(x - 20, 0, x + 20, 0); g.addColorStop(0, '#c8a8f8'); g.addColorStop(0.5, '#a07ae8'); g.addColorStop(1, '#7050c0'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - 20, 580 + K.hash(i, 2) * 30, 40, base - 600, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(90,50,170,0.45)'; ctx.lineWidth = 2; for (let k = 0; k < 12; k++) { const y = 640 + k * 22; ctx.beginPath(); ctx.moveTo(x - 16, y); ctx.lineTo(x + 16, y); ctx.stroke(); }
    eEll(ctx, x - 8, 640, 5, 40, 'rgba(255,255,255,0.35)'); }
  for (let i = 0; i < 8; i++) { const x = 30 + (i * 4 + 2) * 64, k = order[i % order.length], col = kinds[k], lit = (o.lit ?? 'LMS').includes(k);
    const c = lit ? col : mixc(col, '#3a2a5a', 0.6), g = ctx.createRadialGradient(x - 14, 820, 4, x, 860, 70); g.addColorStop(0, mixc(c, '#ffffff', 0.5)); g.addColorStop(0.5, c); g.addColorStop(1, mixc(c, '#200a30', 0.4));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 690); ctx.bezierCurveTo(x + 30, 740, x + 60, 840, x + 44, 900); ctx.quadraticCurveTo(x + 18, 940, x + 12, 965); ctx.lineTo(x + 34, base); ctx.lineTo(x - 34, base); ctx.lineTo(x - 12, 965); ctx.quadraticCurveTo(x - 18, 940, x - 44, 900); ctx.bezierCurveTo(x - 60, 840, x - 30, 740, x, 690); ctx.fill();
    eEll(ctx, x - 14, 790, 7, 40, 'rgba(255,255,255,0.55)', -0.15);
    if (lit) { const gl = ctx.createRadialGradient(x, 840, 0, x, 840, 110); gl.addColorStop(0, `rgba(${parseInt(col.slice(1, 3), 16)},${parseInt(col.slice(3, 5), 16)},${parseInt(col.slice(5, 7), 16)},0.35)`); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 110, 730, 220, 220); } }
  // pigment layer
  const pg = ctx.createLinearGradient(0, base, 0, 1080); pg.addColorStop(0, '#ffa040'); pg.addColorStop(1, '#a03a6a'); ctx.fillStyle = pg; ctx.fillRect(0, base, 1920, 80);
  for (let i = 0; i < 12; i++) eEll(ctx, 80 + i * 170, base + 40, 70, 16, 'rgba(160,70,200,0.5)');
  if (o.beam != null) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = o.beam, g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, 'rgba(255,60,60,0.8)'); g.addColorStop(1, 'rgba(255,90,90,0.4)'); ctx.strokeStyle = g; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x, o.beamEnd ?? 820); ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,230,230,0.9)'; ctx.stroke(); ctx.restore(); }
};

// ---------- the kitchen (tile 2): a sunny window, plants, a table; the child in profile looking at the apple ----------
E.apple = (ctx, t, x, y, r, o = {}) => { const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r * 1.1); g.addColorStop(0, '#ff8a7a'); g.addColorStop(0.45, '#e8202a'); g.addColorStop(1, '#8a0a14'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x, y - r * 0.72); ctx.bezierCurveTo(x + r * 0.55, y - r * 1.05, x + r * 1.15, y - r * 0.6, x + r * 1.0, y + r * 0.15); ctx.bezierCurveTo(x + r * 0.9, y + r * 0.85, x + r * 0.35, y + r * 1.0, x, y + r * 0.85); ctx.bezierCurveTo(x - r * 0.35, y + r * 1.0, x - r * 0.9, y + r * 0.85, x - r * 1.0, y + r * 0.15); ctx.bezierCurveTo(x - r * 1.15, y - r * 0.6, x - r * 0.55, y - r * 1.05, x, y - r * 0.72); ctx.fill();
  if (o.bite) { ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.arc(x + r * 0.95, y - r * 0.1, r * 0.38 * o.bite, 0, 7); ctx.fill(); }
  eEll(ctx, x - r * 0.42, y - r * 0.32, r * 0.2, r * 0.13, 'rgba(255,255,255,0.75)', -0.6); eEll(ctx, x - r * 0.15, y - r * 0.5, r * 0.06, r * 0.04, 'rgba(255,255,255,0.8)');
  ctx.strokeStyle = '#5a3a20'; ctx.lineWidth = r * 0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - r * 0.68); ctx.quadraticCurveTo(x + r * 0.05, y - r * 0.95, x + r * 0.12, y - r * 1.1); ctx.stroke();
  ctx.fillStyle = '#4aa83a'; ctx.beginPath(); ctx.moveTo(x + r * 0.08, y - r * 0.95); ctx.quadraticCurveTo(x + r * 0.45, y - r * 1.35, x + r * 0.8, y - r * 1.05); ctx.quadraticCurveTo(x + r * 0.45, y - r * 0.85, x + r * 0.08, y - r * 0.95); ctx.fill(); ctx.strokeStyle = '#2a7a2a'; ctx.lineWidth = r * 0.025; ctx.beginPath(); ctx.moveTo(x + r * 0.1, y - r * 0.95); ctx.lineTo(x + r * 0.7, y - r * 1.06); ctx.stroke(); };
E.kitchen = (ctx, t, o = {}) => {
  const bg = ctx.createLinearGradient(0, 0, 1920, 0); bg.addColorStop(0, '#f2d8b0'); bg.addColorStop(1, '#ffe8c0'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  // window with garden light, frame, a shelf with jars and plants
  const wx = 1150, wy = 60, ww = 700, wh = 600; const sky = ctx.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, '#fff6c0'); sky.addColorStop(1, '#c8e890'); ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh);
  for (let i = 0; i < 18; i++) eEll(ctx, wx + K.hash(i, 1) * ww, wy + 80 + K.hash(i, 2) * (wh - 100), 50 + K.hash(i, 3) * 40, 40 + K.hash(i, 4) * 30, ['#9ad85a', '#7ac04a', '#c8e870'][i % 3]);
  ctx.fillStyle = '#e8c890'; ctx.fillRect(wx - 24, wy - 24, ww + 48, 24); ctx.fillRect(wx - 24, wy + wh, ww + 48, 30); ctx.fillRect(wx - 24, wy, 24, wh); ctx.fillRect(wx + ww, wy, 24, wh); ctx.fillRect(wx + ww / 2 - 10, wy, 20, wh); ctx.fillRect(wx, wy + wh / 2 - 10, ww, 20);
  ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const g = ctx.createLinearGradient(wx, 0, 300, 1080); g.addColorStop(0, 'rgba(255,240,180,0.22)'); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(wx + i * 170, wy); ctx.lineTo(wx + i * 170 + 120, wy); ctx.lineTo(wx + i * 170 - 600, 1080); ctx.lineTo(wx + i * 170 - 800, 1080); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#c89a6a'; ctx.fillRect(80, 220, 520, 18); for (const [jx, jc] of [[140, '#c8e0f0'], [230, '#f0d0a0'], [320, '#e0f0d0']]) { ctx.fillStyle = jc; ctx.beginPath(); ctx.roundRect(jx, 140, 60, 80, 10); ctx.fill(); }
  for (const [px, py] of [[460, 220], [wx + 80, wy + wh + 0], [wx + ww - 120, wy + wh]]) { ctx.fillStyle = '#d0784a'; ctx.beginPath(); ctx.moveTo(px - 36, py - 60); ctx.lineTo(px + 36, py - 60); ctx.lineTo(px + 26, py); ctx.lineTo(px - 26, py); ctx.fill(); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.4 + Math.sin(t + k) * 0.05; ctx.fillStyle = k % 2 ? '#5ab04a' : '#3a903a'; ctx.beginPath(); ctx.ellipse(px + Math.cos(a) * 40, py - 70 + Math.sin(a) * 40, 30, 12, a, 0, 7); ctx.fill(); } }
  // the table
  const tg = ctx.createLinearGradient(0, 760, 0, 1080); tg.addColorStop(0, '#e0a86a'); tg.addColorStop(1, '#a8703a'); ctx.fillStyle = tg; ctx.fillRect(0, 760, 1920, 320); ctx.fillStyle = 'rgba(255,240,210,0.35)'; ctx.fillRect(0, 760, 1920, 12);
  // dust motes in the sunbeams
  for (let i = 0; i < 40; i++) { const x = (K.hash(i, 7) * 1500 + t * 10) % 1500 + 300, y = (K.hash(i, 8) * 700 + t * 6) % 700 + 100; eEll(ctx, x, y, 2.4, 2.4, 'rgba(255,250,220,0.6)'); }
};
// the child at the table, in profile facing right, chin on hands (head radius R at (x, y))
E.kid = (ctx, t, x, y, R, o = {}) => {
  // Built by construction (simple shapes first, then detail), after the user's reference (refs/t2-kid.png):
  // head = a circle (radius R) with a face profile on the right; neck = a short tapered column under the jaw; torso = a
  // bean leaning forward toward the table, cut off by the table edge at TY; shoulder joint behind the jaw; upper arm down
  // to the elbow ON the table line; forearm up to the hands cupped under the chin; the far arm the same, darker, behind.
  // Light comes from the window on the right: a warm rim on right-facing edges.
  const TY = 2.1, skin = '#f6b48a', skinD = '#dd8e66', skinL = '#ffd0ae', rimC = '#ffd08a', hood = '#2a52c8', hoodD = '#1c3a9a', hair = '#2a1838', hairM = '#40285a', hairRim = '#e8a058';
  const bob = Math.sin(t * 1.1) * R * 0.02, bl = Cast.blink(t, 3), X = (px) => x + px * R, Y = (py) => y + py * R + bob;
  const path = (pts) => { const q = pts.map(([px, py]) => [X(px), Y(py)]); ctx.beginPath(); ctx.moveTo((q[0][0] + q[q.length - 1][0]) / 2, (q[0][1] + q[q.length - 1][1]) / 2); for (let i = 0; i < q.length; i++) { const a2 = q[i], b2 = q[(i + 1) % q.length]; ctx.quadraticCurveTo(a2[0], a2[1], (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2); } };
  const fill = (pts, f) => { path(pts); ctx.fillStyle = f; ctx.fill(); };
  const limb = (pts, w0, w1, col) => { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (let i = 0; i < pts.length - 1; i++) { ctx.strokeStyle = col; ctx.lineWidth = K.lerp(w0, w1, i / Math.max(1, pts.length - 2)) * R; ctx.beginPath(); ctx.moveTo(X(pts[i][0]), Y(pts[i][1])); ctx.lineTo(X(pts[i + 1][0]), Y(pts[i + 1][1])); ctx.stroke(); } };
  const oval = (px, py, rx, ry, f, rot = 0) => eEll(ctx, X(px), Y(py), rx * R, ry * R, f, rot);
  const hold = o.hold;   // [px, py] in head units: the near hand holds something there instead of cupping the chin
  // everything behind the table edge is clipped at the table line
  ctx.save(); ctx.beginPath(); ctx.rect(x - R * 6, y - R * 3, R * 12, (TY + 3) * R + bob); ctx.clip();
  // far arm (behind): elbow on the table, forearm up to the chin
  limb([[-0.95, 1.35], [-0.75, TY - 0.05]], 0.55, 0.5, hoodD); limb([[-0.75, TY - 0.05], [0.3, 1.2]], 0.36, 0.3, skinD);
  // torso: a bean leaning forward (hoodie), with the hood bunched behind the neck
  const torso = [[-2.3, TY + 0.5], [-2.35, TY - 0.5], [-1.9, 1.35], [-1.1, 1.0], [-0.35, 1.05], [0.2, 1.5], [0.3, TY + 0.5]];
  fill(torso, hoodD); const tg = ctx.createLinearGradient(X(-2.6), 0, X(0.4), 0); tg.addColorStop(0, '#2244b0'); tg.addColorStop(1, '#3462d8');
  fill(torso.map(([px, py]) => [px + 0.06, py + 0.05]), tg);
  limb([[-1.35, 1.05], [-0.95, 0.88], [-0.5, 0.95]], 0.32, 0.28, hoodD); limb([[-1.3, 1.0], [-0.93, 0.84], [-0.52, 0.9]], 0.2, 0.18, '#3a66de');
  // neck: a short tapered column from under the jaw into the collar
  fill([[-0.42, 0.62], [0.18, 0.66], [0.22, 1.0], [0.1, 1.22], [-0.5, 1.15]], skinD);
  ctx.restore();
  // head: rim pass then the face (a circle cranium with the profile on the right)
  const head = [[-0.98, -0.1], [-0.88, -0.78], [-0.3, -1.08], [0.42, -0.98], [0.8, -0.58], [0.88, -0.28], [0.86, -0.12], [0.96, 0.08], [1.04, 0.2], [0.94, 0.3], [0.9, 0.44], [0.84, 0.66], [0.62, 0.88], [0.2, 0.92], [-0.32, 0.8], [-0.82, 0.42]];
  fill(head.map(([px, py]) => [px + 0.05, py]), rimC);
  const fg = ctx.createRadialGradient(X(0.25), Y(-0.15), R * 0.15, X(0.1), Y(0.05), R * 1.2); fg.addColorStop(0, skinL); fg.addColorStop(0.6, skin); fg.addColorStop(1, skinD); fill(head, fg);
  oval(0.45, 0.42, 0.22, 0.14, 'rgba(255,110,110,0.32)'); for (let i = 0; i < 5; i++) oval(0.36 + (i % 3) * 0.08, 0.36 + Math.floor(i / 3) * 0.07, 0.012, 0.012, 'rgba(190,90,70,0.4)');
  // ear (mid-head, behind the cheek)
  oval(-0.3, 0.12, 0.18, 0.24, skinD); oval(-0.28, 0.12, 0.12, 0.17, skin); oval(-0.26, 0.14, 0.05, 0.09, '#e08a6a');
  // eye: big, glossy, looking down at the apple
  const ex = 0.6, ey = 0.0, look = o.look ?? [0.04, 0.04];
  if (bl < 0.6) { oval(ex, ey, 0.15, 0.19, '#ffffff', -0.1); oval(ex + look[0], ey + look[1], 0.11, 0.15, '#5a3418', -0.1); oval(ex + look[0] + 0.01, ey + look[1] + 0.01, 0.065, 0.095, '#160a06'); oval(ex + look[0] + 0.04, ey + look[1] - 0.06, 0.035, 0.045, '#ffffff'); oval(ex + look[0] - 0.03, ey + look[1] + 0.07, 0.015, 0.018, '#ffffff'); }
  ctx.strokeStyle = '#2a1410'; ctx.lineWidth = R * 0.045; ctx.lineCap = 'round'; ctx.beginPath(); if (bl < 0.6) ctx.ellipse(X(ex), Y(ey), R * 0.16, R * 0.2, -0.1, Math.PI * 1.1, Math.PI * 1.9); else ctx.arc(X(ex), Y(ey - 0.02), R * 0.13, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.lineWidth = R * 0.06; ctx.beginPath(); ctx.moveTo(X(ex - 0.16), Y(ey - 0.3)); ctx.quadraticCurveTo(X(ex), Y(ey - 0.38), X(ex + 0.17), Y(ey - 0.31)); ctx.stroke();
  // nose and smile
  ctx.strokeStyle = skinD; ctx.lineWidth = R * 0.035; ctx.beginPath(); ctx.arc(X(0.95), Y(0.24), R * 0.055, -0.6, 1.5); ctx.stroke();
  ctx.strokeStyle = '#a8402a'; ctx.lineWidth = R * 0.04; ctx.beginPath(); ctx.moveTo(X(0.6), Y(0.56)); ctx.quadraticCurveTo(X(0.74), Y(o.mood === 'happy' ? 0.68 : 0.64), X(0.86), Y(0.5)); ctx.stroke();
  // hair: a soft mass over the back and top (rim, base), clumps a shade lighter, bangs falling over the forehead
  // the outline is a ring of curl bumps over the back and top (each bump a circle), filled in the middle
  const bumps = []; for (let i = 0; i <= 22; i++) { const u = i / 22, a2 = Math.PI * (0.62 + 1.38 * u), rr = 1.02 + 0.06 * Math.sin(i * 2.7); bumps.push([-0.12 + Math.cos(a2) * rr, -0.22 + Math.sin(a2) * rr * 1.02, 0.2 + 0.05 * K.hash(i, 5)]); }
  const core = [[-1.0, 0.45], [-1.05, -0.4], [-0.6, -1.08], [0.2, -1.18], [0.75, -0.75], [0.7, -0.4], [0.3, -0.48], [-0.15, -0.3], [-0.45, 0.05], [-0.6, 0.45]];
  for (const [px, py, r] of bumps) oval(px + 0.045, py, r, r, hairRim); fill(core.map(([px, py]) => [px + 0.045, py]), hairRim);
  for (const [px, py, r] of bumps) oval(px, py, r, r, hair); fill(core, hair);
  for (let i = 1; i < bumps.length - 1; i += 2) { const [px, py, r] = bumps[i]; const g = ctx.createRadialGradient(X(px - r * 0.3), Y(py - r * 0.3), 1, X(px), Y(py), r * R); g.addColorStop(0, '#5a3a76'); g.addColorStop(1, 'rgba(42,24,56,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(px), Y(py), r * R, 0, 7); ctx.fill(); }
  for (const [px, py, r] of [[-0.55, -0.55, 0.22], [-0.15, -0.8, 0.22], [-0.7, -0.05, 0.2]]) { const g = ctx.createRadialGradient(X(px - 0.06), Y(py - 0.06), 1, X(px), Y(py), r * R); g.addColorStop(0, '#4e3268'); g.addColorStop(1, 'rgba(42,24,56,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(px), Y(py), r * R, 0, 7); ctx.fill(); }
  for (const [px, py, r] of [[0.75, -0.52, 0.12], [0.55, -0.6, 0.15], [0.32, -0.62, 0.16]]) { oval(px + 0.03, py, r, r * 1.2, hairRim); oval(px, py, r, r * 1.2, hair); }
  // near arm: shoulder -> elbow on the table -> forearm up to the chin (or to the held thing), cupped hand
  const hand = hold ?? [0.5, 1.05];
  limb([[-0.6, 1.35], [-0.2, TY - 0.05]], 0.6, 0.55, hood);
  limb([[-0.2, TY - 0.05], [hand[0] - 0.05, hand[1] + 0.15]], 0.38, 0.32, skin);
  ctx.strokeStyle = rimC; ctx.lineWidth = R * 0.05; ctx.beginPath(); ctx.moveTo(X(-0.05), Y(TY - 0.15)); ctx.lineTo(X(hand[0] + 0.1), Y(hand[1] + 0.2)); ctx.stroke();
  if (!hold) { oval(hand[0] - 0.02, hand[1] + 0.06, 0.3, 0.22, skinD, -0.35); oval(hand[0] + 0.02, hand[1], 0.28, 0.2, skin, -0.35); oval(hand[0] + 0.12, hand[1] - 0.06, 0.1, 0.06, skinL, -0.35);
    ctx.strokeStyle = skinD; ctx.lineWidth = R * 0.03; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(X(hand[0] - 0.1 + k * 0.1), Y(hand[1] + 0.1), R * 0.055, 0.4, 2.6); ctx.stroke(); } }
};
// white sunlight splitting into coloured beads that fly to the apple; all but red sink in, red bounces (u 0..1)
E.colours = (ctx, t, sx, sy, ax, ay, ar, u) => {
  // white sunlight comes down from the window, fans into seven coloured bands just before the apple; six sink in and fade,
  // the red band reflects off toward the viewer (u 0..1)
  const cols = ['#ff3a3a', '#ff9a2a', '#ffe23a', '#4ade5a', '#3ab0ff', '#5a6aff', '#b05aff'], mx = K.lerp(sx, ax, 0.38), my = K.lerp(sy, ay, 0.38), reach = K.clamp(u * 2.2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const wEnd = [K.lerp(sx, mx, Math.min(1, reach / 0.55)), K.lerp(sy, my, Math.min(1, reach / 0.55))];
  const wg = ctx.createLinearGradient(sx, sy, mx, my); wg.addColorStop(0, 'rgba(255,255,245,0.25)'); wg.addColorStop(1, 'rgba(255,255,245,0.9)'); ctx.strokeStyle = wg; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(...wEnd); ctx.stroke();
  const fan = K.clamp((reach - 0.55) / 0.45), sink = K.clamp(u * 2.2 - 1.1), refl = K.clamp(u * 2.2 - 1.6);
  ctx.globalCompositeOperation = 'source-over';
  if (fan > 0) cols.forEach((c, i) => { const tx = ax + (i - 3) * ar * 0.22, ty = ay - ar * 0.2 + (i - 3) * ar * 0.12, ex = K.lerp(mx, tx, fan), ey = K.lerp(my, ty, fan), alpha = i === 0 ? 0.9 : 0.85 * (1 - sink);
    if (alpha <= 0.02) return; ctx.strokeStyle = c; ctx.globalAlpha = alpha; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
    if (fan >= 1 && i !== 0) { const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 50 * (1 - sink)); g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(tx - 60, ty - 60, 120, 120); } });
  ctx.globalAlpha = 1;
  if (refl > 0) { const tx = ax - 3 * ar * 0.22, ty = ay - ar * 0.2 - 3 * ar * 0.12, rx = K.lerp(tx, tx - 760, refl), ry = K.lerp(ty, ty - 160, refl);
    const rg = ctx.createLinearGradient(tx, ty, rx, ry); rg.addColorStop(0, 'rgba(255,60,60,0.95)'); rg.addColorStop(1, 'rgba(255,90,90,0.6)'); ctx.strokeStyle = rg; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); ctx.stroke(); ctx.strokeStyle = 'rgba(255,230,230,0.9)'; ctx.lineWidth = 6; ctx.stroke(); E.spark(ctx, rx, ry, 18); }
  ctx.restore(); };

// ---------- the iris face-on (tile 3): fibres, a black pupil of radius set by open 0..1 ----------
E.iris = (ctx, t, cx, cy, R, open) => { const pr = R * (0.22 + 0.4 * open);
  ctx.fillStyle = '#f2ece6'; ctx.fillRect(0, 0, 1920, 1080); const sg = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 2.6); sg.addColorStop(0, '#f6f0ea'); sg.addColorStop(1, '#d8c8c0'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 10; i++) { ctx.strokeStyle = 'rgba(200,60,70,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); let x = K.hash(i, 1) > 0.5 ? 1920 : 0, y = K.hash(i, 2) * 1080; ctx.moveTo(x, y); ctx.quadraticCurveTo((x + cx) / 2, y + (K.hash(i, 3) - 0.5) * 300, cx + (x > cx ? R * 1.6 : -R * 1.6), cy + (K.hash(i, 4) - 0.5) * R); ctx.stroke(); }
  const ig = ctx.createRadialGradient(cx, cy, pr, cx, cy, R); ig.addColorStop(0, '#ff9a2a'); ig.addColorStop(0.35, '#e8702a'); ig.addColorStop(0.55, '#3a8aff'); ig.addColorStop(1, '#1a3aa8'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  ctx.lineCap = 'round'; for (let i = 0; i < 160; i++) { const a = i / 160 * 6.283 + K.hash(i, 5) * 0.03, r0 = pr * 1.02, r1 = R * (0.85 + 0.12 * K.hash(i, 6)); ctx.strokeStyle = i % 3 ? 'rgba(120,200,255,0.5)' : 'rgba(255,190,90,0.55)'; ctx.lineWidth = 2 + K.hash(i, 7) * 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.quadraticCurveTo(cx + Math.cos(a + 0.08) * (r0 + r1) / 2, cy + Math.sin(a + 0.08) * (r0 + r1) / 2, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke(); }
  ctx.strokeStyle = '#0a1a5a'; ctx.lineWidth = R * 0.06; ctx.beginPath(); ctx.arc(cx, cy, R * 0.98, 0, 7); ctx.stroke();
  eEll(ctx, cx, cy, pr, pr, '#05060c'); eEll(ctx, cx + R * 0.45, cy - R * 0.5, R * 0.16, R * 0.09, 'rgba(255,255,255,0.85)', -0.6); eEll(ctx, cx + R * 0.2, cy - R * 0.62, R * 0.05, R * 0.03, 'rgba(255,255,255,0.8)'); };

// ---------- inside one cone (tile 5): stacked membrane discs; the retinal molecule (bent -> straight with s 0..1) ----------
E.coneInside = (ctx, t, glow = 0) => { const bg = ctx.createLinearGradient(0, 0, 1920, 0); bg.addColorStop(0, '#2a1a6a'); bg.addColorStop(0.5, '#4a2a9a'); bg.addColorStop(1, '#2a1a6a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  for (const [x, a] of [[240, 0.3], [1680, 0.3]]) { ctx.globalAlpha = a; for (let k = 0; k < 14; k++) eEll(ctx, x, 80 + k * 70, 150, 26, '#a07ae8'); ctx.globalAlpha = 1; }
  ctx.fillStyle = 'rgba(200,150,255,0.25)'; ctx.beginPath(); ctx.moveTo(600, 1080); ctx.quadraticCurveTo(620, 0, 960, -40); ctx.quadraticCurveTo(1300, 0, 1320, 1080); ctx.fill();
  for (let k = 0; k < 9; k++) { const y = 140 + k * 105, w = 300 - Math.abs(k - 4) * 10, g = ctx.createLinearGradient(0, y - 30, 0, y + 30); g.addColorStop(0, '#ff9ad8'); g.addColorStop(1, '#c04a9a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(960, y, w, 44, -0.08, 0, 7); ctx.fill(); ctx.fillStyle = '#e870b8'; ctx.beginPath(); ctx.ellipse(960, y + 10, w, 40, -0.08, 0, Math.PI); ctx.fill();
    for (let m = 0; m < 10; m++) { const a = m / 10 * 6.283 + k, mx = 960 + Math.cos(a) * w * 0.8, my = y + Math.sin(a) * 28; eEll(ctx, mx, my, 8, 6, 'rgba(255,220,255,0.6)'); eEll(ctx, mx + 10, my - 3, 6, 5, 'rgba(255,200,255,0.5)'); } }
  if (glow > 0) { const g = ctx.createRadialGradient(960, 560, 0, 960, 560, 420); g.addColorStop(0, `rgba(255,220,90,${0.5 * glow})`); g.addColorStop(1, 'rgba(255,220,90,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); } };
E.retinal = (ctx, t, cx, cy, s, straight) => { // a chain of 9 beads with a kink at bead 5 that straightens
  const pts = []; let x = cx - s * 4.2, y = cy, a = 0; for (let i = 0; i < 9; i++) { pts.push([x, y]); const kink = i === 4 ? (1 - straight) * 1.4 : 0; a += (i % 2 ? 0.5 : -0.5) * 0.6 + kink; x += Math.cos(a) * s; y += Math.sin(a) * s; }
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 7); glow.addColorStop(0, `rgba(255,230,120,${0.45 + 0.4 * straight})`); glow.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = glow; ctx.fillRect(cx - s * 7, cy - s * 7, s * 14, s * 14);
  ctx.strokeStyle = '#ffe890'; ctx.lineWidth = s * 0.22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
  pts.forEach(([px, py], i) => { const g = ctx.createRadialGradient(px - s * 0.12, py - s * 0.12, 1, px, py, s * 0.36); g.addColorStop(0, '#fffbe0'); g.addColorStop(1, i === 4 || i === 5 ? '#ff9a2a' : '#ffc83a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, s * 0.34, 0, 7); ctx.fill(); }); };

// ---------- neurons and the optic nerve (tile 6) ----------
E.neuron = (ctx, x, y, r, col = '#8a5ad8', seed = 0) => { ctx.strokeStyle = col; ctx.lineCap = 'round';
  for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283 + K.hash(k, seed) * 0.5; let px = x, py = y, aa = a, w = r * 0.35; for (let j = 0; j < 4; j++) { const nx = px + Math.cos(aa) * r * 0.7, ny = py + Math.sin(aa) * r * 0.7; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke(); if (j === 1) { ctx.lineWidth = w * 0.6; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(nx + Math.cos(aa + 0.8) * r * 0.5, ny + Math.sin(aa + 0.8) * r * 0.5); ctx.stroke(); } px = nx; py = ny; aa += (K.hash(j, seed + k) - 0.5) * 0.8; w *= 0.65; } }
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 2, x, y, r * 0.55); g.addColorStop(0, mixc(col, '#ffffff', 0.5)); g.addColorStop(1, col); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, 7); ctx.fill(); eEll(ctx, x, y, r * 0.2, r * 0.2, mixc(col, '#2a1060', 0.4)); };
E.spark = (ctx, x, y, r, a = 1) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, `rgba(255,250,200,${a})`); g.addColorStop(0.3, `rgba(255,210,80,${0.8 * a})`); g.addColorStop(1, 'rgba(255,180,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); };
E.nerveField = (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1200); bg.addColorStop(0, '#2a2a9a'); bg.addColorStop(1, '#0e0e4a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 14; i++) { ctx.globalAlpha = 0.35; E.neuron(ctx, K.hash(i, 1) * 1920, K.hash(i, 2) * 1080, 70 + K.hash(i, 3) * 40, '#6a4ab8', i); ctx.globalAlpha = 1; }
  // the main path: neuron -> axon -> the fibre bundle to the right
  E.neuron(ctx, 360, 520, 150, '#a070f0', 50);
  const path = (x) => 520 + Math.sin(x * 0.006) * 30;
  ctx.strokeStyle = '#9a6ae8'; ctx.lineWidth = 22; ctx.beginPath(); for (let x = 420; x <= 1500; x += 20) ctx[x === 420 ? 'moveTo' : 'lineTo'](x, path(x)); ctx.stroke();
  for (let k = 0; k < 8; k++) { const x = 560 + k * 120; ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.roundRect(x, path(x) - 16, 70, 32, 16); ctx.fill(); }
  for (let f = 0; f < 22; f++) { ctx.strokeStyle = f % 3 ? 'rgba(255,200,90,0.8)' : 'rgba(255,240,180,0.9)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1480, path(1480)); ctx.bezierCurveTo(1600, path(1480) + (f - 11) * 4, 1700, 540 + (f - 11) * 16, 1960, 540 + (f - 11) * 20); ctx.stroke(); }
  for (let k = 0; k < 4; k++) { const ph = (u * 0.5 + k * 0.25) % 1, x = 420 + ph * 1500; E.spark(ctx, x, x < 1480 ? path(x) : 540, 18); } };

// ---------- the brain from above (tile 7): two eyes at the left, nerves crossing at the chiasm, paths to the back ----------
E.brainTop = (ctx, t, u, o = {}) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#1a1a6a'); bg.addColorStop(1, '#070a2a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  const bx = 1060, by = 540, bw = 640, bh = 430;
  for (const sg of [-1, 1]) { const g = ctx.createRadialGradient(bx, by + sg * bh * 0.45, 30, bx, by + sg * bh * 0.45, bw); g.addColorStop(0, '#a070e0'); g.addColorStop(1, '#5a2a9a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, by + sg * bh * 0.47, bw, bh * 0.5, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(bx, by + sg * bh * 0.47, bw, bh * 0.5, 0, 0, 7); ctx.clip();
    // gyri: rows of soft C-shaped folds (a dark crevice under a light ridge), like a cartoon brain
    for (let r = 0; r < 6; r++) for (let c = 0; c < 11; c++) { const px = bx - bw + (c + (r % 2) * 0.5) * bw * 0.19, py = by + sg * bh * (0.1 + r * 0.16), rr = 34 + K.hash(c, r + sg * 7) * 18, a0 = K.hash(c + 3, r + sg * 5) * 6.28;
      for (const [col, w, dy] of [['rgba(50,15,100,0.55)', 12, 4], ['rgba(220,185,255,0.4)', 7, -3]]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(px, py + dy, rr, a0, a0 + Math.PI * (1.0 + 0.5 * K.hash(c, r + 11))); ctx.stroke(); } }
    const sh = ctx.createLinearGradient(0, by + sg * bh * 0.05, 0, by + sg * bh); sh.addColorStop(0, 'rgba(30,5,60,0)'); sh.addColorStop(1, 'rgba(30,5,60,0.35)'); ctx.fillStyle = sh; ctx.fillRect(bx - bw, Math.min(by, by + sg * bh), bw * 2, bh);
    ctx.restore(); }
  for (const sg of [-1, 1]) { const g = ctx.createRadialGradient(bx + bw * 0.95, by + sg * bh * 0.32, 10, bx + bw * 0.95, by + sg * bh * 0.32, bh * 0.4); g.addColorStop(0, '#9a6ad0'); g.addColorStop(1, '#4a2080'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx + bw * 0.93, by + sg * bh * 0.32, bh * 0.22, bh * 0.3, 0, -Math.PI / 2, Math.PI / 2); ctx.fill(); ctx.strokeStyle = 'rgba(40,10,80,0.45)'; ctx.lineWidth = 4; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.ellipse(bx + bw * 0.93, by + sg * bh * 0.32, bh * 0.22 * k / 5, bh * 0.3, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); } }
  ctx.strokeStyle = 'rgba(40,10,80,0.7)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(bx - bw, by); ctx.lineTo(bx + bw, by); ctx.stroke();
  // eyes at the front (left)
  const eyes = [[360, by - 170], [360, by + 170]], chi = [600, by]; for (const [ex, ey] of eyes) { const g = ctx.createRadialGradient(ex - 20, ey - 20, 5, ex, ey, 90); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d0d0e8'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, 90, 0, 7); ctx.fill(); eEll(ctx, ex - 70, ey, 18, 44, '#3a8aff'); eEll(ctx, ex - 80, ey, 8, 20, '#05060c'); }
  // nerves: eye -> chiasm -> two tracts to the back; colour by field (left field = blue, right = orange)
  const back = [[bx + bw * 0.8, by - 180], [bx + bw * 0.8, by + 180]], prog = o.prog ?? 1;
  const route = (pts, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1]); ctx.stroke(); };
  for (const [i, [ex, ey]] of eyes.entries()) { route([[ex + 90, ey], [ex + 200, ey], [chi[0] - 40, chi[1] + (i ? 20 : -20)], chi], 'rgba(255,220,120,0.9)', 26); }
  for (const [j, [tx, ty]] of back.entries()) { route([chi, [chi[0] + 200, chi[1] + (j ? 80 : -80)], [tx - 380, ty], [tx, ty]], 'rgba(255,220,120,0.9)', 26); const g = ctx.createRadialGradient(tx, ty, 10, tx, ty, 220); g.addColorStop(0, `rgba(255,190,80,${0.6 * (o.cortex ?? 0)})`); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(tx - 220, ty - 220, 440, 440); }
  // travelling signals
  if (o.signals) for (let k = 0; k < 6; k++) { const ph = K.clamp((u * 0.4 + k * 0.17) % 1.2), j = k % 2, cr = j ? '120,190,255' : '255,170,80', [ex, ey] = eyes[j], [tx, ty] = back[1 - j];
    const pt = ph < 0.4 ? [K.lerp(ex + 90, chi[0], ph / 0.4), K.lerp(ey, chi[1], ph / 0.4)] : [K.lerp(chi[0], tx, (ph - 0.4) / 0.6), K.lerp(chi[1], ty, (ph - 0.4) / 0.6)]; const g = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 40); g.addColorStop(0, `rgba(${cr},1)`); g.addColorStop(1, `rgba(${cr},0)`); ctx.fillStyle = g; ctx.fillRect(pt[0] - 40, pt[1] - 40, 80, 80); }
  return { eyes, chi, back }; };
// the visual cortex rebuilding the apple as a picture made of glowing tiles (tile 8); u 0..1 builds it
E.cortexApple = (ctx, t, cx, cy, s, u, flip = 0) => { const n = 16; ctx.save(); ctx.translate(cx, cy); ctx.scale(1, 1 - 2 * flip);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = (i - n / 2 + 0.5) / n * 2, y = (j - n / 2 + 0.5) / n * 2, inA = (x * x) / 0.8 + ((y - 0.05) ** 2) / 0.72 < 1 && !(Math.abs(x) < 0.12 && y < -0.7), leaf = x > 0.05 && x < 0.55 && y < -0.65 && y > -0.95;
    const p = K.clamp(u * 2.2 - K.hash(i * n + j, 5) * 1.2); if (p <= 0) continue; const col = leaf ? '#4ad83a' : inA ? mixc('#ff3a3a', '#ff9a7a', y < -0.3 && x < 0 ? 0.4 : 0) : null; if (!col) continue;
    ctx.globalAlpha = p; ctx.fillStyle = col; ctx.fillRect(x * s - s / n * 0.9, y * s - s / n * 0.9, s / n * 1.8, s / n * 1.8); }
  ctx.globalAlpha = 1; ctx.restore(); };

// a child's hand holding something round at (x, y), size r (fingers curl over the front), facing right
E.handHold = (ctx, x, y, r) => { const skin = '#f8b88e', skinD = '#e8946a';
  eEll(ctx, x - r * 0.9, y + r * 0.55, r * 0.55, r * 0.42, skinD, -0.4); eEll(ctx, x - r * 0.8, y + r * 0.5, r * 0.5, r * 0.38, skin, -0.4);
  for (let k = 0; k < 4; k++) { const fx = x - r * 0.55 + k * r * 0.12, fy = y + r * (0.55 - k * 0.18); eEll(ctx, fx, fy, r * 0.17, r * 0.12, skinD, -0.9); eEll(ctx, fx - r * 0.01, fy - r * 0.01, r * 0.15, r * 0.1, skin, -0.9); }
  eEll(ctx, x - r * 0.7, y + r * 0.1, r * 0.13, r * 0.24, skin, 0.4); };
