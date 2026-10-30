// The rest of the blood film's world, after the user's reference grid (refs/NOTES.md): the bone marrow (tile 2), the
// antibodies and the clump (tile 4), the capillary (tile 5), the gut (tile 6), the gibbon (tile 7), malaria and cholera
// (tile 8), the blood bank (tile 9), plus the people, the body loop, the family tree and the world map.
// Screen space (px), deterministic.
const M = {};
const mx = (a, b, u) => P.mixc(a, b, K.clamp(u));
const ell = (ctx, x, y, rx, ry, col, rot = 0) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, 7); ctx.fill(); };
const blobPath = (ctx, x, y, r, n, w, seed, t = 0, sy = 1) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * 6.283, rr = r * (1 + w * Math.sin(a * 3 + seed + t) + w * 0.6 * Math.sin(a * 5 + seed * 2)); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * sy; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); };
M.ell = ell; M.blobPath = blobPath;

// a soft round cell (stem cell, young cell, macrophage): a shaded body, an optional nucleus
M.cell = (ctx, x, y, r, col, o = {}) => {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.05);
  g.addColorStop(0, mx(col, '#ffffff', 0.45)); g.addColorStop(0.6, col); g.addColorStop(1, mx(col, '#200a30', 0.35));
  ctx.fillStyle = g; blobPath(ctx, x, y, r, 40, o.wob ?? 0.03, o.seed ?? 1, o.t ?? 0); ctx.fill();
  if (o.nuc) { const [nx, ny, nr] = o.nuc; const gn = ctx.createRadialGradient(nx - nr * 0.3, ny - nr * 0.3, nr * 0.1, nx, ny, nr); gn.addColorStop(0, '#c89aff'); gn.addColorStop(1, '#5a2aa8'); ctx.fillStyle = gn; blobPath(ctx, nx, ny, nr, 30, 0.05, (o.seed ?? 1) + 3, o.t ?? 0); ctx.fill(); }
  if (o.dots) for (let i = 0; i < o.dots; i++) { const a = K.hash(i, o.seed ?? 1) * 6.28, d = Math.sqrt(K.hash(i, (o.seed ?? 1) + 1)) * r * 0.75; ell(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.06, r * 0.06, 'rgba(255,255,255,0.35)'); }
};

// ---------- the bone marrow (tile 2): spongy bone on the left, marrow, a vessel leaving to the right ----------
M.marrow = (ctx, t) => {
  const bg = ctx.createLinearGradient(0, 0, 1920, 1080); bg.addColorStop(0, '#1a2a7a'); bg.addColorStop(1, '#3a1a6a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  // the bone: cream with a honeycomb of holes (spongy bone), thick on the left, curving round the cavity
  const bone = (ctx2) => { ctx2.beginPath(); ctx2.moveTo(-20, -20); ctx2.lineTo(720, -20); ctx2.bezierCurveTo(560, 160, 520, 360, 600, 520); ctx2.bezierCurveTo(680, 700, 600, 900, 760, 1100); ctx2.lineTo(-20, 1100); ctx2.closePath(); };
  const gb = ctx.createLinearGradient(0, 0, 700, 0); gb.addColorStop(0, '#f2d79a'); gb.addColorStop(1, '#ffe9b8'); ctx.fillStyle = gb; bone(ctx); ctx.fill();
  ctx.save(); bone(ctx); ctx.clip();
  for (let i = 0; i < 120; i++) { const x = K.hash(i, 1) * 640, y = K.hash(i, 2) * 1080, r = 14 + K.hash(i, 3) * 26; ell(ctx, x, y + 3, r, r * 0.85, '#d8a868'); ell(ctx, x, y, r * 0.86, r * 0.72, '#c87850'); ell(ctx, x - r * 0.2, y - r * 0.2, r * 0.4, r * 0.3, 'rgba(255,230,190,0.25)'); }
  ctx.restore();
  // the marrow cavity: a warm red-purple space with fat cells and the cell nursery; the vessel sweeps out to the right
  ctx.save(); ctx.beginPath(); ctx.moveTo(720, -20); ctx.bezierCurveTo(560, 160, 520, 360, 600, 520); ctx.bezierCurveTo(680, 700, 600, 900, 760, 1100); ctx.lineTo(1940, 1100); ctx.lineTo(1940, -20); ctx.closePath(); ctx.clip();
  const gm = ctx.createRadialGradient(900, 520, 50, 900, 520, 900); gm.addColorStop(0, '#d8506a'); gm.addColorStop(1, '#6a1a4a'); ctx.fillStyle = gm; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 22; i++) { const x = 650 + K.hash(i, 5) * 600, y = K.hash(i, 6) * 1080, r = 30 + K.hash(i, 7) * 30; ell(ctx, x, y, r, r * 0.9, 'rgba(255,220,150,0.35)'); ell(ctx, x - r * 0.25, y - r * 0.25, r * 0.4, r * 0.3, 'rgba(255,245,210,0.3)'); }
  // the vessel: a red tube from the middle sweeping to the right edge, its wall lighter
  ctx.lineCap = 'round'; ctx.strokeStyle = '#ff8a8a'; ctx.lineWidth = 260; ctx.beginPath(); ctx.moveTo(1100, 700); ctx.bezierCurveTo(1350, 640, 1550, 420, 2000, 380); ctx.stroke();
  ctx.strokeStyle = '#c0203a'; ctx.lineWidth = 220; ctx.stroke();
  ctx.restore();
};
// the cell nursery: stem cells dividing, young cells maturing purple -> red, new red cells streaming into the vessel
M.nursery = (ctx, t, u) => {
  // stem cells (purple with a big nucleus), splitting on a slow cycle
  for (let i = 0; i < 4; i++) { const x = 780 + (i % 2) * 180 + K.hash(i, 9) * 40, y = 260 + i * 170, ph = (t * 0.35 + K.hash(i, 10)) % 1, sp = K.ease.inOut(K.clamp((ph - 0.6) / 0.35)) * 42, r = 50;
    for (const sg of sp > 0 ? [-1, 1] : [0]) M.cell(ctx, x + sg * sp, y, r * (sp > 0 ? 0.82 : 1), '#9a6ae8', { nuc: [x + sg * sp, y, r * 0.55 * (sp > 0 ? 0.82 : 1)], seed: i + sg, t: t * 0.5 }); }
  // young cells drifting toward the vessel, ripening from purple to red
  for (let i = 0; i < 14; i++) { const ph = (u * 0.09 + K.hash(i, 12)) % 1, x = 980 + ph * 220 + K.hash(i, 13) * 60, y = 300 + K.hash(i, 14) * 520 + (700 - (300 + K.hash(i, 14) * 520)) * ph * 0.7, r = 34;
    M.cell(ctx, x, y, r, mx('#b070e0', '#ff4a4a', ph * 1.4), { nuc: ph < 0.55 ? [x + r * 0.15, y - r * 0.1, r * 0.42 * (1 - ph)] : null, seed: i, t }); }
  // finished red cells in the vessel, flowing out to the right
  for (let i = 0; i < 26; i++) { const ph = (u * 0.22 + K.hash(i, 15)) % 1, bx = 1120 + ph * 900, by = 700 - ph * 320 + (K.hash(i, 16) - 0.5) * 140 * (1 - ph * 0.3);
    CELL.rbc(ctx, bx, by, 40 + K.hash(i, 17) * 8, K.hash(i, 18) * 6 + t * 0.6, 0.55 + 0.4 * K.hash(i, 19), { fog: 0, bg: '#c0203a' }); }
};

// ---------- antibodies ----------
// a Y-shaped antibody (IgG): two arms and a stem, rounded, glossy; s = size (arm length px)
M.antibody = (ctx, x, y, s, ang, col = '#3aa0ff') => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.lineCap = 'round';
  const seg = (x0, y0, x1, y1) => { ctx.strokeStyle = mx(col, '#101040', 0.35); ctx.lineWidth = s * 0.34; ctx.beginPath(); ctx.moveTo(x0, y0 + s * 0.04); ctx.lineTo(x1, y1 + s * 0.04); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = mx(col, '#ffffff', 0.5); ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.moveTo(x0 - s * 0.05, y0 - s * 0.04); ctx.lineTo(x0 + (x1 - x0) * 0.7 - s * 0.05, y0 + (y1 - y0) * 0.7 - s * 0.04); ctx.stroke(); };
  seg(0, 0, 0, s); seg(0, 0, -s * 0.72, -s * 0.72); seg(0, 0, s * 0.72, -s * 0.72);
  ctx.restore();
};
// the big five-armed antibody (IgM): five Ys joined at a centre
M.igm = (ctx, x, y, s, ang, col = '#ffc23a') => { for (let i = 0; i < 5; i++) { const a = ang + i / 5 * 6.283, d = s * 0.75; M.antibody(ctx, x + Math.cos(a) * d * 0.5, y + Math.sin(a) * d * 0.5, s * 0.55, a + Math.PI / 2, col); } ell(ctx, x, y, s * 0.3, s * 0.3, mx(col, '#8a5a00', 0.3)); };
// a red cell carrying its group tags as little beads round the rim (green = A, blue = B)
M.taggedCell = (ctx, t, x, y, r, ang, k, tags, o = {}) => {
  CELL.rbc(ctx, x, y, r, ang, k, o);
  if (!tags) return; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + (o.spin ?? 0), col = tags === 'AB' ? (i % 2 ? CELL.SUGAR.A : CELL.SUGAR.B) : CELL.SUGAR[tags];
    const ca = Math.cos(ang), sa = Math.sin(ang), px = Math.cos(a) * r * 1.08, py = Math.sin(a) * r * k * 1.08 + r * 0.04; CELL.bead(ctx, x + px * ca - py * sa, y + px * sa + py * ca, r * 0.09, col); }
};

// ---------- the capillary (tile 5): a translucent pink tube, the cell folding to squeeze through ----------
M.capillary = (ctx, t, u) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#4a1a5a'); bg.addColorStop(1, '#2a0a3a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 10; i++) CELL.rbc(ctx, K.hash(i, 1) * 1920, K.hash(i, 2) * 1080, 90 + K.hash(i, 3) * 60, K.hash(i, 4) * 6, 0.7, { blur: 10, fog: 0.55, bg: '#4a1a5a' });
  const path = (x) => 560 + Math.sin(x * 0.003 + 0.6) * 90, w = 130;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const tube = (lw, col) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); for (let x = -40; x <= 1960; x += 20) x < 0 ? ctx.moveTo(x, path(x)) : ctx.lineTo(x, path(x)); ctx.stroke(); };
  tube(w + 40, 'rgba(255,150,190,0.35)'); tube(w, 'rgba(255,190,210,0.25)');
  // the cell: a squeezed, bent disc (capsule) sliding through
  const cx = -200 + u * 260 * 1.0, cy = path(cx), slope = Math.atan(0.27 * Math.cos(cx * 0.003 + 0.6));
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(slope);
  const g = ctx.createLinearGradient(0, -60, 0, 60); g.addColorStop(0, '#ff7a50'); g.addColorStop(0.5, '#ec2a1e'); g.addColorStop(1, '#9a0c1e');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-170, 0); ctx.bezierCurveTo(-170, -70, -40, -52, 40, -56); ctx.bezierCurveTo(150, -60, 175, -30, 175, 0); ctx.bezierCurveTo(175, 40, 120, 58, 30, 52); ctx.bezierCurveTo(-60, 46, -170, 60, -170, 0); ctx.fill();
  ctx.strokeStyle = 'rgba(255,190,160,0.5)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-130, -40); ctx.bezierCurveTo(-60, -50, 40, -46, 120, -44); ctx.stroke();
  ctx.restore();
  // tube wall highlight in front
  ctx.strokeStyle = 'rgba(255,220,235,0.45)'; ctx.lineWidth = 6; for (const sg of [-1, 1]) { ctx.beginPath(); for (let x = -40; x <= 1960; x += 20) { const y = path(x) + sg * w / 2; x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
};

// ---------- people ----------
// a simple body silhouette (for the circulation loop): head, torso, arms, legs as soft shapes
// the main vessels drawn on the body: arteries (red) and veins (blue) branching from the heart to the head, arms and legs
M.vessels = (ctx, t, x, y, s) => { ctx.lineCap = 'round'; const H = [x + s * 0.05, y - s * 0.57];
  const runs = [[[0, -0.86], [0.02, -0.72]], [[-0.25, -0.35], [-0.29, -0.12], [-0.16, -0.6]], [[0.25, -0.35], [0.29, -0.12], [0.16, -0.6]], [[-0.11, 0.42], [-0.09, -0.15], [-0.02, -0.4]], [[0.11, 0.42], [0.09, -0.15], [0.02, -0.4]]];
  for (const [col, dx, w] of [['rgba(80,140,255,0.7)', -0.012, 0.012], ['rgba(255,70,70,0.85)', 0.012, 0.014]]) { ctx.strokeStyle = col; ctx.lineWidth = s * w;
    for (const run of runs) { ctx.beginPath(); ctx.moveTo(H[0] + dx * s, H[1]); for (let i = run.length - 1; i >= 0; i--) { const [px, py] = run[i]; ctx.lineTo(x + (px + dx) * s, y + py * s); } ctx.stroke(); } } };
M.body = (ctx, x, y, s, col) => {
  const gb = ctx.createLinearGradient(x - s * 0.3, 0, x + s * 0.3, 0); gb.addColorStop(0, mx(col, '#ffffff', 0.2)); gb.addColorStop(1, mx(col, '#000020', 0.25)); col = gb; ctx.fillStyle = col; ell(ctx, x, y - s * 0.86, s * 0.11, s * 0.13, col);
  ctx.beginPath(); ctx.roundRect(x - s * 0.17, y - s * 0.7, s * 0.34, s * 0.58, s * 0.1); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = s * 0.1;
  for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sg * s * 0.17, y - s * 0.62); ctx.lineTo(x + sg * s * 0.28, y - s * 0.3); ctx.lineTo(x + sg * s * 0.3, y - s * 0.1); ctx.stroke(); ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(x + sg * s * 0.09, y - s * 0.16); ctx.lineTo(x + sg * s * 0.11, y + s * 0.45); ctx.stroke(); ctx.lineWidth = s * 0.1; }
};
// a person drawn with the kit rig at screen (x, y feet), height h px
M.person = (t, x, y, h, o) => P.screen(() => P.at(x, y, 0, h / 110, -h / 110, () => Cast.person(t, 0, 100, o)));
// a baby in a cot blanket: a big head with the kit face, a swaddled body
M.baby = (t, ctx, x, y, s) => {
  ell(ctx, x + s * 0.3, y + s * 0.42, s * 0.9, s * 0.42, '#f6d8e8'); ell(ctx, x + s * 0.3, y + s * 0.36, s * 0.86, s * 0.36, '#ffc2dc');
  for (let i = 0; i < 4; i++) ell(ctx, x - s * 0.2 + i * s * 0.32, y + s * 0.3, s * 0.06, s * 0.06, '#ffffff');
  P.screen(() => P.at(x - s * 0.45, y - s * 0.05, 0, s / 40, -s / 40, () => { P.circle(0, 0, 22, '#f6caa4'); P.circle(-21, -2, 5, '#f6caa4'); P.circle(21, -2, 5, '#f6caa4'); P.circle(-4, 19, 7, '#6a4a3a', { ry: 4 }); Cast.face(t, 0, -3, 24, { mood: 'happy', seed: 3 }); }));
};

// ---------- the gut (tile 6): orange villi, colourful bacteria wearing sugar beads ----------
M.gut = (ctx, t, u) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#5a1a6a'); bg.addColorStop(1, '#8a2a5a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  // villi: finger-like folds rising from the bottom, lit tips, pore dots
  for (let i = 0; i < 9; i++) { const x = 60 + i * 230 + Math.sin(t * 0.6 + i) * 6, h = 420 + K.hash(i, 3) * 120, w = 170, y0 = 1100;
    const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#ffb070'); g.addColorStop(0.5, '#ff8a5a'); g.addColorStop(1, '#d0504a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, y0); ctx.bezierCurveTo(x - w / 2, y0 - h * 0.5, x - w / 2, y0 - h, x, y0 - h); ctx.bezierCurveTo(x + w / 2, y0 - h, x + w / 2, y0 - h * 0.5, x + w / 2 + 20, y0); ctx.fill();
    for (let k = 0; k < 26; k++) ell(ctx, x + (K.hash(k, i) - 0.5) * w * 0.8, y0 - K.hash(k, i + 1) * h * 0.95, 4, 4, 'rgba(255,230,190,0.45)'); }
  // bacteria: rods with flagella, each wearing a few sugar beads (some like A, some like B)
  for (let i = 0; i < 16; i++) { const x = (K.hash(i, 5) * 2100 + u * 30 * (K.hash(i, 6) - 0.4)) % 2100 - 90, y = 120 + K.hash(i, 7) * 520 + Math.sin(t + i) * 10, a = K.hash(i, 8) * 3 + Math.sin(t * 0.7 + i) * 0.2, col = ['#5ad86a', '#3ab0ff', '#ffd03a', '#c06aff', '#ff6a8a'][i % 5];
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.strokeStyle = mx(col, '#202040', 0.3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, 0); for (let k = 1; k < 8; k++) ctx.lineTo(-50 - k * 10, Math.sin(t * 8 + k + i) * 6); ctx.stroke();
    const g = ctx.createLinearGradient(0, -20, 0, 20); g.addColorStop(0, mx(col, '#ffffff', 0.4)); g.addColorStop(1, mx(col, '#202040', 0.3)); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-50, -20, 100, 40, 20); ctx.fill();
    for (let k = 0; k < 4; k++) CELL.bead(ctx, -30 + k * 20, -24, 7, i % 2 ? CELL.SUGAR.A : CELL.SUGAR.B);
    ctx.restore(); }
};

// ---------- the blood bank (tile 9) ----------
M.bag = (ctx, x, y, w, label, o = {}) => {
  const h = w * 1.3; ctx.fillStyle = 'rgba(230,240,255,0.55)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, w * 0.12); ctx.fill();
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#d8202a'); g.addColorStop(1, '#8a0a1a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w * 0.44, y - h * 0.3, w * 0.88, h * 0.76, w * 0.1); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x - w * 0.36, y - h * 0.26, w * 0.08, h * 0.6);
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(x - w * 0.3, y - h * 0.08, w * 0.6, h * 0.3, 6); ctx.fill();
  ctx.fillStyle = o.ink ?? '#a01020'; ctx.font = `800 ${w * 0.22}px "Baloo 2", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y + h * 0.07);
  ctx.fillStyle = '#c8d4e8'; ctx.fillRect(x - w * 0.06, y - h * 0.62, w * 0.12, h * 0.14);
  if (o.glow) { const gg = ctx.createRadialGradient(x, y, w * 0.3, x, y, w * 1.3); gg.addColorStop(0, `rgba(255,240,180,${0.45 * o.glow})`); gg.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = gg; ctx.fillRect(x - w * 1.3, y - w * 1.3, w * 2.6, w * 2.6); }
};
M.bank = (ctx, t, u, glowO) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#2a5aa8'); bg.addColorStop(1, '#1a3a7a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = 'rgba(200,225,255,0.12)'; for (let i = 0; i < 6; i++) ctx.fillRect(140 + i * 300, 0, 16, 1080);
  const rows = [['A+', 'B+', 'AB+', 'O+', 'A-', 'B-'], ['AB-', 'O-', 'A+', 'O+', 'B+', 'O+']];
  rows.forEach((row, r) => { ctx.fillStyle = '#c8daf2'; ctx.fillRect(80, 300 + r * 380 + 120, 1760, 18); ctx.fillStyle = 'rgba(0,0,40,0.25)'; ctx.fillRect(80, 300 + r * 380 + 138, 1760, 10);
    row.forEach((lab, i) => { const pick = r === 1 && i === 1, lift = pick ? K.tw(u, 6.5, 8.5, 'inOut') : 0; M.bag(ctx, 230 + i * 290 + lift * 500, 300 + r * 380 - lift * 380, 160 * (1 + lift * 0.5), lab, { glow: pick ? glowO : 0 }); }); });
};

// ---------- the family tree back through time ----------
// generations of people receding into a sepia distance, linked by lines; d = depth 0 (now) .. 1 (far)
M.lineage = (t, ctx, u) => {
  const bg = ctx.createLinearGradient(0, 0, 1920, 0); bg.addColorStop(0, '#fbe8c8'); bg.addColorStop(0.6, '#d8a878'); bg.addColorStop(1, '#5a3a5a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = 'rgba(120,70,40,0.18)'; ctx.beginPath(); ctx.moveTo(0, 1080); ctx.lineTo(0, 860); ctx.lineTo(1920, 520); ctx.lineTo(1920, 1080); ctx.fill();
  const gens = 9, shift = u * 3.2;
  for (let gi = gens - 1; gi >= 0; gi--) { const g = gi - shift; if (g < -0.6) continue; const z = 1 + g * 0.55, x = 360 + g * 230, y = 800 - g * 40, h = 330 / z, a = K.clamp(1.4 - g * 0.18);
    for (let k = 0; k < 2; k++) { const px = x + (k ? 1 : -1) * 70 / z; P.alpha(a, () => M.person(t, px, y, h, { kid: false, shirt: mx(['#e35d4f', '#4f7fc4', '#5aa86a', '#e0a040', '#a86ac8', '#d86a8a'][(gi * 2 + k) % 6], '#8a6a4a', K.clamp(g / 6)), pants: mx('#34427e', '#5a4a3a', K.clamp(g / 6)), skin: ['#f2c29b', '#c88a5a', '#8a5a3a', '#e0b080'][(gi + k) % 4], hair: '#2a1a14', seed: gi * 2 + k, mood: 'happy', look: [x + 400, 200] })); }
    if (gi > 0) { const nx = 360 + (g - 1) * 230; ctx.strokeStyle = `rgba(120,80,60,${0.5 * a})`; ctx.lineWidth = 4 / z; ctx.beginPath(); ctx.moveTo(x, y - h * 1.05); ctx.quadraticCurveTo((x + nx) / 2, y - h * 1.35, nx, y + 40 - (330 / (1 + (g - 1) * 0.55)) * 1.05); ctx.stroke(); } }
};

// ---------- the gibbon (tile 7): dark fur, a pale face ring, long arms, hanging from a branch ----------
M.gibbon = (t, ctx, x, y, s, swing) => {
  // hangs from the branch by its right hand at (x, y); dark fur, white hands and feet, a white ring round the face
  ctx.save(); ctx.translate(x, y); ctx.rotate(swing); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const fur = '#2e221e', furL = '#4e3c32', white = '#f2ead8';
  const limb = (pts, w0, w1, col) => { for (let i = 0; i < pts.length - 1; i++) { ctx.strokeStyle = col; ctx.lineWidth = K.lerp(w0, w1, i / (pts.length - 1)); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); } };
  const sh = [s * 0.02, s * 0.5], reach = [s * 0.46, s * 0.28 + Math.sin(t * 2) * s * 0.03];
  // far leg and the reaching arm behind the body
  limb([[sh[0] + s * 0.02, sh[1] + s * 0.02], [s * 0.26, s * 0.5], reach], s * 0.075, s * 0.05, fur); ell(ctx, reach[0], reach[1], s * 0.04, s * 0.03, white);
  limb([[0, s * 0.86], [s * 0.12, s * 0.98], [s * 0.06, s * 1.1]], s * 0.08, s * 0.06, fur); ell(ctx, s * 0.06, s * 1.12, s * 0.045, s * 0.025, white);
  // the hanging arm, from the hand on the branch down to the shoulder
  limb([[0, 0], [-s * 0.03, s * 0.25], sh], s * 0.06, s * 0.085, furL); ell(ctx, 0, -s * 0.01, s * 0.045, s * 0.035, white);
  // body (pear), shaded
  const g = ctx.createLinearGradient(-s * 0.15, 0, s * 0.15, 0); g.addColorStop(0, furL); g.addColorStop(1, fur);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-s * 0.01, s * 0.72, s * 0.13, s * 0.22, 0.08, 0, 7); ctx.fill();
  limb([[-s * 0.06, s * 0.88], [-s * 0.16, s * 1.0], [-s * 0.1, s * 1.13]], s * 0.085, s * 0.065, furL); ell(ctx, -s * 0.1, s * 1.15, s * 0.05, s * 0.026, white);
  // head beside the shoulder, looking at us: dark, a white ring, a dark face, eyes with highlights
  const hx = -s * 0.1, hy = s * 0.47; ell(ctx, hx, hy, s * 0.105, s * 0.1, fur); ell(ctx, hx, hy + s * 0.01, s * 0.08, s * 0.08, white); ell(ctx, hx, hy + s * 0.015, s * 0.062, s * 0.066, '#3a2a24');
  for (const sg of [-1, 1]) { ell(ctx, hx + sg * s * 0.024, hy, s * 0.016, s * 0.017, '#ffffff'); ell(ctx, hx + sg * s * 0.024, hy + s * 0.003, s * 0.01, s * 0.012, '#120a08'); ell(ctx, hx + sg * s * 0.024 - s * 0.004, hy - s * 0.005, s * 0.004, s * 0.004, '#ffffff'); }
  ell(ctx, hx, hy + s * 0.032, s * 0.016, s * 0.008, '#1a1010'); ctx.strokeStyle = '#1a1010'; ctx.lineWidth = s * 0.006; ctx.beginPath(); ctx.arc(hx, hy + s * 0.038, s * 0.02, 0.4, 2.7); ctx.stroke();
  ctx.restore();
};
M.savanna = (ctx, t) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#ffcf8a'); bg.addColorStop(0.6, '#f6a868'); bg.addColorStop(1, '#e88a50'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  const sg = ctx.createRadialGradient(1500, 330, 0, 1500, 330, 300); sg.addColorStop(0, 'rgba(255,250,220,0.95)'); sg.addColorStop(0.3, 'rgba(255,240,200,0.6)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(1100, 0, 820, 700);
  for (const [yb, col, amp] of [[640, '#e0986a', 50], [700, '#c8784a', 30]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 40) ctx.lineTo(x, yb - amp * (0.5 + 0.5 * Math.sin(x * 0.004 + yb))); ctx.lineTo(1920, 1080); ctx.fill(); }
  ctx.fillStyle = '#b8683a'; ctx.fillRect(0, 760, 1920, 320); ctx.fillStyle = 'rgba(255,220,160,0.2)'; for (let i = 0; i < 40; i++) ctx.fillRect(K.hash(i, 1) * 1920, 780 + K.hash(i, 2) * 280, 60, 4);
  // acacias: a thin trunk and a flat-topped crown
  for (const [ax, ay, sc] of [[220, 700, 1], [1250, 660, 0.7], [1700, 690, 0.9]]) { ctx.strokeStyle = '#5a3424'; ctx.lineWidth = 14 * sc; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax, ay + 60 * sc); ctx.lineTo(ax + 10 * sc, ay - 120 * sc); ctx.lineTo(ax - 60 * sc, ay - 190 * sc); ctx.moveTo(ax + 10 * sc, ay - 120 * sc); ctx.lineTo(ax + 80 * sc, ay - 185 * sc); ctx.stroke();
    ctx.fillStyle = '#4a6a3a'; ctx.beginPath(); ctx.ellipse(ax + 10 * sc, ay - 200 * sc, 200 * sc, 42 * sc, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#6a8a4a'; ctx.beginPath(); ctx.ellipse(ax - 10 * sc, ay - 212 * sc, 160 * sc, 26 * sc, 0, 0, 7); ctx.fill(); }
};
M.jungle = (ctx, t) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#d8f0b8'); bg.addColorStop(0.45, '#7ab88a'); bg.addColorStop(1, '#14462e'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  // far misty trunks, then leaf clusters in four depths (each cluster: a dark underside, leaves, sunlit tips)
  for (let i = 0; i < 10; i++) { const x = K.hash(i, 21) * 1920; ctx.fillStyle = 'rgba(70,110,80,0.35)'; ctx.fillRect(x, 200, 26 + K.hash(i, 22) * 30, 900); }
  for (let layer = 0; layer < 4; layer++) { const base = ['#9ccc94', '#6aa874', '#3f8a54', '#25693c'][layer], n = 9 + layer * 2;
    for (let i = 0; i < n; i++) { const cx = K.hash(i, layer + 30) * 2100 - 90, cy = 380 + layer * 170 + K.hash(i, layer + 34) * 100, R = 110 + layer * 35;
      ell(ctx, cx, cy + R * 0.2, R * 1.05, R * 0.7, mx(base, '#06200e', 0.35));
      for (let k = 0; k < 22; k++) { const a = K.hash(k, i + layer * 50) * 6.283, d = Math.sqrt(K.hash(k, i + layer * 50 + 1)) * R, lx = cx + Math.cos(a) * d, ly = cy + Math.sin(a) * d * 0.62, sway = Math.sin(t * 1.2 + k + i) * 0.08;
        ell(ctx, lx, ly, R * 0.2, R * 0.085, mx(base, ly < cy ? '#e8ffc8' : '#0a3018', ly < cy ? 0.18 : 0.15), a + sway); } } }
  ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x = 300 + i * 360 + Math.sin(t * 0.3 + i) * 30, g = ctx.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, 'rgba(255,255,200,0.16)'); g.addColorStop(1, 'rgba(255,255,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + 260, 1080); ctx.lineTo(x + 120, 1080); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#4a2e1c'; ctx.lineWidth = 36; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, 200); ctx.quadraticCurveTo(700, 140, 1960, 230); ctx.stroke();
  ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-40, 188); ctx.quadraticCurveTo(700, 128, 1960, 218); ctx.stroke();
  for (let i = 0; i < 14; i++) { const x = i * 140 + 40, y = 196 + Math.sin(i) * 8; ctx.strokeStyle = '#3a7a3e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 14, y + 120, x + Math.sin(t + i) * 12, y + 160 + K.hash(i, 9) * 160); ctx.stroke(); ell(ctx, x + Math.sin(t + i) * 12, y + 160 + K.hash(i, 9) * 160, 12, 6, '#5aa05a', 0.8); }
};
// ---------- germs (tile 8) ----------
M.mosquito = (t, ctx, x, y, s, dir = 1) => {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  ctx.strokeStyle = '#2a2020'; ctx.lineWidth = s * 0.015; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.05 + i * s * 0.06, s * 0.04); ctx.lineTo(-s * 0.2 + i * s * 0.12, s * 0.3); ctx.lineTo(-s * 0.3 + i * s * 0.2, s * 0.55); ctx.stroke(); }
  for (const w of [0, 1]) { ctx.fillStyle = 'rgba(220,235,255,0.45)'; ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.12, s * 0.28, s * 0.07, -0.5 + Math.sin(t * 60 + w) * 0.4, 0, 7); ctx.fill(); }
  ell(ctx, -s * 0.28, s * 0.02, s * 0.25, s * 0.06, '#5a3a3a', 0.15); ell(ctx, -s * 0.28, s * 0.0, s * 0.22, s * 0.035, '#8a5a50', 0.15);
  ell(ctx, 0, 0, s * 0.08, s * 0.07, '#4a3030'); ell(ctx, s * 0.1, -s * 0.01, s * 0.05, s * 0.05, '#3a2424');
  ctx.strokeStyle = '#2a1a1a'; ctx.lineWidth = s * 0.012; ctx.beginPath(); ctx.moveTo(s * 0.14, 0); ctx.lineTo(s * 0.36, s * 0.08); ctx.stroke();
  ell(ctx, s * 0.12, -s * 0.03, s * 0.022, s * 0.022, '#a01a1a');
  ctx.restore();
};
// a red cell with a malaria parasite inside (purple rings and spots)
M.infected = (ctx, t, x, y, r, ang, k) => { CELL.rbc(ctx, x, y, r, ang, k, { fog: 0, bg: '#2a1a6a' }); for (let i = 0; i < 3; i++) { const a = i * 2.1 + t * 0.3, d = r * 0.35; ell(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * k, r * 0.17, r * 0.12 * Math.max(k, 0.5), '#9a5ae8'); ell(ctx, x + Math.cos(a) * d + r * 0.05, y + Math.sin(a) * d * k - r * 0.03, r * 0.06, r * 0.05, '#e0c8ff'); } };
// a comma-shaped cholera bacterium with a whip
M.vibrio = (ctx, t, x, y, s, ang) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.lineCap = 'round';
  ctx.strokeStyle = '#2a5ab8'; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(s * 0.5, 0); for (let k = 1; k < 8; k++) ctx.lineTo(s * 0.5 + k * s * 0.12, Math.sin(t * 9 + k) * s * 0.08); ctx.stroke();
  ctx.strokeStyle = '#3a8aff'; ctx.lineWidth = s * 0.34; ctx.beginPath(); ctx.arc(0, s * 0.4, s * 0.55, -2.4, -0.7); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,230,255,0.6)'; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.arc(0, s * 0.4, s * 0.6, -2.2, -1.0); ctx.stroke(); ctx.restore(); };
// a balance scale: tilt -1..1
M.scale = (ctx, x, y, s, tilt, left, right) => {
  ctx.strokeStyle = '#f0e0c0'; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(x, y + s * 0.9); ctx.lineTo(x, y); ctx.stroke();
  ell(ctx, x, y + s * 0.92, s * 0.3, s * 0.06, '#f0e0c0');
  const a = tilt * 0.3, dx = Math.cos(a) * s, dy = Math.sin(a) * s; ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke(); ell(ctx, x, y, s * 0.06, s * 0.06, '#ffd070');
  for (const [sg, fn] of [[-1, left], [1, right]]) { const px = x + sg * dx, py = y + sg * dy; ctx.lineWidth = s * 0.015; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - s * 0.25, py + s * 0.45); ctx.moveTo(px, py); ctx.lineTo(px + s * 0.25, py + s * 0.45); ctx.stroke(); ell(ctx, px, py + s * 0.47, s * 0.3, s * 0.06, '#f0e0c0'); if (fn) fn(px, py + s * 0.4); }
};

// ---------- the world: simplified continents, each tinted by a mix of groups ----------
M.CONT = [
  [[300, 280], [520, 230], [640, 300], [600, 420], [480, 520], [420, 600], [360, 520], [260, 400]],              // N. America
  [[480, 640], [580, 620], [640, 700], [600, 860], [540, 960], [500, 860], [470, 740]],                           // S. America
  [[880, 260], [1040, 230], [1080, 320], [980, 380], [900, 360]],                                                  // Europe
  [[900, 420], [1080, 400], [1160, 520], [1100, 700], [1020, 820], [960, 700], [880, 540]],                       // Africa
  [[1080, 240], [1400, 200], [1640, 280], [1600, 420], [1440, 520], [1300, 480], [1180, 420], [1100, 340]],      // Asia
  [[1460, 720], [1620, 700], [1680, 800], [1580, 860], [1480, 820]],                                              // Australia
];
M.world = (ctx, t, u) => {
  const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#1a3a7a'); bg.addColorStop(1, '#0a2050'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  M.CONT.forEach((pts, i) => { ctx.save(); ctx.beginPath(); const n = pts.length, mid = (k) => [(pts[k % n][0] + pts[(k + 1) % n][0]) / 2, (pts[k % n][1] + pts[(k + 1) % n][1]) / 2 + 40]; ctx.moveTo(...mid(0)); for (let k = 1; k <= n; k++) { const [px, py] = pts[k % n], [qx, qy] = mid(k); ctx.quadraticCurveTo(px, py + 40, qx, qy); } ctx.closePath(); ctx.fillStyle = '#e8dcc0'; ctx.fill(); ctx.clip();
    // patches of group colours shifting over time: O (cream), A (green), B (blue)
    for (let k = 0; k < 40; k++) { const px = 200 + K.hash(k, i) * 1600, py = 200 + K.hash(k, i + 7) * 800, r = 40 + K.hash(k, i + 3) * 70, w = K.hash(k + Math.floor(u * 2), i + 11); ell(ctx, px + Math.sin(t * 0.4 + k) * 10, py, r, r * 0.8, w < 0.45 ? 'rgba(255,240,210,0.6)' : w < 0.75 ? 'rgba(90,216,106,0.45)' : 'rgba(74,106,255,0.45)'); }
    ctx.restore(); });
};
