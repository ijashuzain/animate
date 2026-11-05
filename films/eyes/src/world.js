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
