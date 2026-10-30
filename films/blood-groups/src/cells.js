// The microscope world of the blood film, drawn after the user's references (refs/ref-grid.webp, tile1/tile3/tile4):
// glossy biconcave red cells in a glowing vessel, a cell membrane of tiny beads with sugar chains on stalks, a soft blue
// enzyme, Y-shaped antibodies. Everything screen space (px), deterministic. Harvest into kit/ after the film.
const CELL = {
  red: { body: '#ec2a1e', light: '#ff7650', dark: '#a8101e', rim: '#ffb090', pit: '#c81a1a' },
};
const { lerp: L_, clamp: C_ } = K;
const mixA = (c, b, u) => P.mixc(c, b, C_(u));

// one red blood cell: a biconcave disc at (x, y), radius r (px), in-plane angle ang, tilt k (1 = face-on, 0.15 = edge-on),
// fog toward a background colour, an optional glow (our hero) and blur (depth of field)
CELL.rbc = (ctx, x, y, r, ang, k, o = {}) => {
  const fog = o.fog ?? 0, bg = o.bg ?? '#7a1030', c = CELL.red, f = (col) => mixA(col, bg, fog);
  k = C_(k, 0.24, 1);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  if (o.blur) ctx.filter = `blur(${o.blur.toFixed(1)}px)`;
  if (o.glow) { const g = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.9); g.addColorStop(0, `rgba(255,200,170,${0.3 * o.glow})`); g.addColorStop(1, 'rgba(255,200,170,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.9, r * 1.9 * Math.max(k, 0.5), 0, 0, 7); ctx.fill(); }
  // the thick rim: a body ellipse, lit from the top-left, a soft dark underside
  const ry = r * k, th = r * 0.4 * (1 - k * 0.5);            // th: how much of the rim's thickness shows below the face
  let g = ctx.createLinearGradient(-r, -ry, r * 0.6, ry + th);
  g.addColorStop(0, f(c.light)); g.addColorStop(0.45, f(c.body)); g.addColorStop(1, f(c.dark));
  ctx.fillStyle = f(c.dark); ctx.beginPath(); ctx.ellipse(0, th * 0.5, r, ry + th * 0.5, 0, 0, 7); ctx.fill();   // the side wall
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r, ry, 0, 0, 7); ctx.fill();                              // the top face
  // the dimple: a darker hollow, its lower inner wall catching the light
  if (k > 0.3) {
    const dr = r * 0.56, dry = dr * k, dy = r * 0.04 * k;
    const gd = ctx.createLinearGradient(0, -dry, 0, dry);
    gd.addColorStop(0, f(c.dark)); gd.addColorStop(0.55, f(c.pit)); gd.addColorStop(1, f(c.light));
    ctx.globalAlpha = C_((k - 0.3) / 0.25); ctx.fillStyle = gd; ctx.beginPath(); ctx.ellipse(0, dy, dr, dry, 0, 0, 7); ctx.fill();
    ctx.fillStyle = f(c.body); ctx.beginPath(); ctx.ellipse(0, dy - dry * 0.18, dr * 0.86, dry * 0.7, 0, 0, 7); ctx.globalAlpha *= 0.55; ctx.fill(); ctx.globalAlpha = 1;
  } else {
    // edge-on: the waist is thinner than the ends (a soft dark band across the middle)
    const gw = ctx.createLinearGradient(-r, 0, r, 0); gw.addColorStop(0, 'rgba(120,0,20,0)'); gw.addColorStop(0.5, `rgba(120,0,20,${0.45 * (1 - k / 0.3)})`); gw.addColorStop(1, 'rgba(120,0,20,0)');
    ctx.fillStyle = gw; ctx.beginPath(); ctx.ellipse(0, th * 0.25, r * 0.98, ry + th * 0.4, 0, 0, 7); ctx.fill();
  }
  // a glossy highlight along the upper-left rim
  ctx.strokeStyle = f(c.rim); ctx.lineCap = 'round'; ctx.lineWidth = r * 0.12 * (0.6 + 0.4 * k); ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.9, ry * 0.86, 0, Math.PI * 1.08, Math.PI * 1.55); ctx.stroke();
  ctx.globalAlpha = 0.18; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.93, ry * 0.9, 0, Math.PI * 1.62, Math.PI * 1.8); ctx.stroke();
  ctx.restore();
};

// the inside of a blood vessel seen along its length: dark plum walls rushing past, a glowing pink distance, wall texture
// cz = how far the camera has travelled (px of depth units); vp = vanishing point
CELL.vessel = (ctx, t, cz, vp = [1180, 430]) => {
  const bgd = ctx.createRadialGradient(vp[0], vp[1], 0, vp[0], vp[1], 1400);
  bgd.addColorStop(0, '#ffb3c0'); bgd.addColorStop(0.14, '#f06a8a'); bgd.addColorStop(0.38, '#b8264a'); bgd.addColorStop(0.7, '#6a0c2c'); bgd.addColorStop(1, '#3a0418');
  ctx.fillStyle = bgd; ctx.fillRect(0, 0, 1920, 1080);
  // wall rings (folds of the vessel lining) coming toward us; each ring a soft band, darker as it nears the camera
  const ringGap = 260;
  for (let i = 24; i >= 1; i--) {
    const z = i * ringGap - (cz % ringGap); if (z < 60) continue;
    const R = 1350 * 260 / z, a = C_(1 - z / 6000) * 0.18;
    ctx.strokeStyle = `rgba(${Math.round(L_(255, 110, C_(260 / z * 2)))},${Math.round(L_(150, 20, C_(260 / z * 2)))},${Math.round(L_(170, 50, C_(260 / z * 2)))},${a})`;
    ctx.lineWidth = Math.max(2, R * 0.16); ctx.beginPath(); ctx.ellipse(vp[0] + (960 - vp[0]) * (1 - Math.min(1, z / 3000)) * 0.4, vp[1] + (540 - vp[1]) * (1 - Math.min(1, z / 3000)) * 0.4, R, R * 0.9, 0, 0, 7); ctx.stroke();
  }
  // lining texture: soft cell-like spots drifting outward along the wall
  for (let i = 0; i < 160; i++) {
    const a = K.hash(i, 3) * 6.283, z = ((K.hash(i, 4) * 6000 - cz) % 6000 + 6000) % 6000 + 80, R = 1350 * 260 / z;
    if (R > 2200 || R < 30) continue; const x = vp[0] + Math.cos(a) * R, y = vp[1] + Math.sin(a) * R * 0.9, s = R * 0.05;
    ctx.fillStyle = `rgba(255,170,190,${0.16 * C_(R / 300)})`; ctx.beginPath(); ctx.ellipse(x, y, s * 1.4, s, a + 1.57, 0, 7); ctx.fill();
  }
};

CELL.vesselEdge = (ctx, vp) => { const g = ctx.createRadialGradient(vp[0], vp[1], 500, vp[0] - 100, vp[1] + 60, 1350); g.addColorStop(0, 'rgba(60,4,24,0)'); g.addColorStop(1, 'rgba(60,4,24,0.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); };
// the flow of red cells through the vessel: 3D positions around the axis, projected; tumbling as they go; far to near
CELL.flow = (ctx, t, cz, n = 160, vp = [1180, 430], hero) => {
  const cells = [];
  for (let i = 0; i < n; i++) {
    const span = 5200, z = ((K.hash(i, 11) * span - cz * (0.85 + K.hash(i, 12) * 0.3)) % span + span) % span + 150;
    const a = K.hash(i, 13) * 6.283, rr = Math.sqrt(K.hash(i, 14)) * 1250;
    const x = vp[0] + Math.cos(a) * rr * 260 / z * 1.2, y = vp[1] + Math.sin(a) * rr * 260 / z, r = 150 * (0.8 + 0.4 * K.hash(i, 18)) * 260 / z;
    if (r < 3) continue;
    cells.push({ z, x, y, r, ang: K.hash(i, 15) * 6.28 + t * (K.hash(i, 16) - 0.5) * 0.8, k: 0.72 + 0.28 * Math.sin(t * (0.4 + K.hash(i, 17)) + i) - (i % 7 === 0 ? 0.45 : 0) });
  }
  if (hero) cells.push(hero);
  cells.sort((p, q) => q.z - p.z);
  for (const c of cells) CELL.rbc(ctx, c.x, c.y, c.r, c.ang, c.k, { fog: C_((c.z - 500) / 4700) * 0.8, bg: '#d84a6a', blur: c.z < 240 ? 8 : 0, glow: c.glow });
};

// ---------- the surface up close (tile 3) ----------
// a bead with a soft 3D shade (lit top-left)
CELL._sprites = {};
CELL.bead = (ctx, x, y, r, col, a = 1) => {
  // each colour is shaded once into a 64 px sprite and reused (thousands of beads per frame)
  let sp = CELL._sprites[col];
  if (!sp) { sp = document.createElement('canvas'); sp.width = sp.height = 64; const g2 = sp.getContext('2d'), R = 31;
    const g = g2.createRadialGradient(32 - R * 0.35, 32 - R * 0.4, R * 0.1, 32, 32, R);
    g.addColorStop(0, mixA(col, '#ffffff', 0.55)); g.addColorStop(0.55, col); g.addColorStop(1, mixA(col, '#1a0830', 0.35));
    g2.fillStyle = g; g2.beginPath(); g2.arc(32, 32, R, 0, 7); g2.fill(); CELL._sprites[col] = sp; }
  if (r < 0.5) return; const ga = ctx.globalAlpha; ctx.globalAlpha = ga * a; ctx.drawImage(sp, x - r * 64 / 62, y - r * 64 / 62, r * 128 / 62, r * 128 / 62); ctx.globalAlpha = ga;
};
CELL.SUGAR = { base: ['#ffc23a', '#ffd24a', '#4ac0ff', '#ff8ac0'], A: '#5ad86a', B: '#3a7aff' };
// the membrane: a thick band packed with tiny beads (the lipid heads): bright orange-gold at the surface, red deeper,
// magenta at the bottom; edge(u) -> [x, y] is the top surface, the band goes down-left of it
CELL.membrane = (ctx, t, edge, rows = 18) => {
  const pts = []; for (let i = 0; i <= 80; i++) pts.push(edge(i / 80));
  const g = ctx.createLinearGradient(0, 300, 400, 1100); g.addColorStop(0, '#f05a30'); g.addColorStop(0.5, '#c8203a'); g.addColorStop(1, '#6a0a40');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(1960, 1120); ctx.lineTo(-400, 1120); ctx.fill();
  for (let row = rows - 1; row >= 0; row--) { const n = 95, d = row * 21 + 4 + (K.hash(row, 2) - 0.5) * 6, deep = row / (rows - 1);
    for (let i = 0; i < n; i++) { const u = (i + (row % 2) * 0.5) / n, [x, y] = edge(u), r = (15 - deep * 5) * (0.85 + 0.3 * K.hash(i, row + 9));
      const q = (v) => Math.round(v * 6) / 6, col = deep < 0.2 ? mixA('#ffb03a', '#ffe070', q(K.hash(i, row + 20)) * 0.6) : mixA(mixA('#ff7a3a', '#e8303a', q((deep - 0.2) * 2)), '#8a1050', q(C_((deep - 0.55) * 2.2)));
      CELL.bead(ctx, x + (K.hash(i, row + 3) - 0.5) * 16 - d * 0.35 + (K.hash(i, row + 5) - 0.5) * 6, y + d + Math.sin(t * 1.4 + i * 0.6 + row) * 1.3, r, col, 1); } }
};
// a sugar chain (the H chain every group shares): gold and cyan beads on a short stalk, a pink side bead (fucose) near
// the tip; tip = { col, u } adds the group's last sugar (A: green, B: blue) growing in with u 0..1
CELL.SUGAR = { stalk: ['#ffb43a', '#ffd04a', '#3ac0ff', '#ffc040', '#40d0ff', '#ffa83a'], fuc: '#ff6ab0', A: '#4ade6a', B: '#4a6aff' };
CELL.chain = (ctx, t, p, n, len, tip, seed, r = 26) => {
  const out = []; let [x, y] = p; const sw = Math.sin(t * 1.1 + seed) * 0.1, base = Math.atan2(n[1], n[0]);
  for (let i = 0; i < len; i++) { const a = base + sw * (i / len) + (K.hash(i, seed) - 0.5) * 0.35; x += Math.cos(a) * r * 1.72; y += Math.sin(a) * r * 1.72; out.push([x, y, a]); }
  ctx.strokeStyle = 'rgba(255,235,210,0.5)'; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (const [qx, qy] of out) ctx.lineTo(qx, qy); ctx.stroke();
  out.forEach(([qx, qy], i) => CELL.bead(ctx, qx, qy, r * (1 - i * 0.02), CELL.SUGAR.stalk[(i + seed) % 6]));
  const [ex, ey, ea] = out[len - 1], [fx, fy] = out[len - 2] ?? out[len - 1];
  CELL.bead(ctx, fx + Math.cos(ea - 1.4) * r * 1.6, fy + Math.sin(ea - 1.4) * r * 1.6, r * 0.9, CELL.SUGAR.fuc);
  const tipAt = [ex + Math.cos(ea + 0.35) * r * 1.75, ey + Math.sin(ea + 0.35) * r * 1.75];
  if (tip && tip.u > 0) { if (tip.glow) { const gl = ctx.createRadialGradient(tipAt[0], tipAt[1], 0, tipAt[0], tipAt[1], r * 3); gl.addColorStop(0, `rgba(160,255,170,${0.5 * tip.glow})`); gl.addColorStop(1, 'rgba(160,255,170,0)'); ctx.fillStyle = gl; ctx.fillRect(tipAt[0] - r * 3, tipAt[1] - r * 3, r * 6, r * 6); }
    CELL.bead(ctx, tipAt[0], tipAt[1], r * 1.08 * C_(tip.u), tip.col); }
  return tipAt;
};
// the enzyme: a soft translucent blue protein with a lumpy body, holding the next sugar at its tip
CELL.enzyme = (ctx, t, x, y, s, ang, col = '#3a8aff') => {
  // a lumpy soft protein: a big round body and a narrower neck ending in a mouth at (0, 0), pointing along ang
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const lobes = [[s * 0.25, 0, s * 0.28], [s * 0.7, -s * 0.05, s * 0.45], [s * 1.25, s * 0.08, s * 0.62], [s * 1.25, -s * 0.35, s * 0.42], [s * 1.7, -s * 0.1, s * 0.5]];
  const g = ctx.createLinearGradient(0, -s * 0.8, s * 1.4, s * 0.8); g.addColorStop(0, '#9ad8ff'); g.addColorStop(0.45, col); g.addColorStop(1, '#6a3aff');
  ctx.fillStyle = g; ctx.beginPath(); for (const [lx, ly, lr] of lobes) { ctx.moveTo(lx + lr, ly); ctx.arc(lx, ly, lr * (1 + 0.03 * Math.sin(t * 1.3 + lx)), 0, 7); } ctx.fill();
  for (let i = 0; i < 26; i++) { const [lx, ly, lr] = lobes[i % 5], a = K.hash(i, 7) * 6.28, d = K.hash(i, 8) * lr * 0.7; ctx.fillStyle = `rgba(190,230,255,${0.1 + 0.12 * K.hash(i, 9)})`; ctx.beginPath(); ctx.arc(lx + Math.cos(a) * d, ly + Math.sin(a) * d - lr * 0.15, lr * (0.18 + 0.2 * K.hash(i, 10)), 0, 7); ctx.fill(); }
  ctx.restore();
};
// deep-blue background with soft bokeh
CELL.deep = (ctx, t) => {
  const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, '#0a1260'); g.addColorStop(0.6, '#1a1a7a'); g.addColorStop(1, '#4a1a8a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 16; i++) { const x = K.hash(i, 1) * 1920 + Math.sin(t * 0.2 + i) * 20, y = K.hash(i, 2) * 700, r = 40 + K.hash(i, 3) * 70, col = ['90,140,255', '160,90,255', '255,140,120', '90,200,255'][i % 4];
    const b = ctx.createRadialGradient(x, y, 0, x, y, r); b.addColorStop(0, `rgba(${col},0.22)`); b.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = b; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
};
