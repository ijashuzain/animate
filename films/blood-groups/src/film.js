// Why Do We Have Different Blood Types? One red blood cell's life (the user's pitch B), 4:04.
// Scenes follow script-timed.md line by line; transitions dip to dark (never cross-fade two busy scenes).
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const { tw, clamp, lerp } = K;
const pill = (str, x, y, u, o = {}) => P.pill(str, x, y, Object.assign({ u, font: FONT, size: 36, weight: 700 }, o));
const shows = (t, a, b, f = 0.4) => tw(t, a, a + f) * (1 - tw(t, b - f, b));
const SC = [[0, 10, 'hook'], [10, 16, 'stream'], [16, 30, 'marrow'], [30, 40, 'nucleus'], [40, 56, 'surface'], [56, 74, 'groups'], [74, 86, 'ogroup'], [86, 96, 'rh'],
  [96, 110, 'journey'], [110, 126, 'antibodies'], [126, 140, 'gut'], [140, 160, 'attack'], [160, 172, 'bank'], [172, 184, 'lineage'], [184, 200, 'apes'], [200, 220, 'germs'], [220, 232, 'world'], [232, 244, 'end']];

// ---------- shared pieces ----------
const VP = (t) => [1180 + Math.sin(t * 0.4) * 30, 430];
function stream(ctx, t, o = {}) {
  const cz = t * (o.speed ?? 420), vp = VP(t);
  CELL.vessel(ctx, t, cz, vp);
  const hero = o.hero === false ? null : { z: 330, x: (o.hx ?? 760) + Math.sin(t * 0.7) * 20, y: (o.hy ?? 560) + Math.sin(t * 1.1) * 12, r: o.hr ?? 165, ang: -0.35 + Math.sin(t * 0.5) * 0.1, k: 0.62 + 0.1 * Math.sin(t * 0.6), glow: 0.9 };
  CELL.flow(ctx, t, cz, o.n ?? 200, vp, hero);
  if (o.near !== false) for (const [x0, y0, r0, a0, sp] of [[-60, 980, 260, 0.4, 1], [1980, 160, 300, -0.6, -1], [1820, 1040, 220, 0.9, 1]]) CELL.rbc(ctx, x0 + sp * ((t * 40) % 300), y0 - (t * 25) % 200, r0, a0 + t * 0.1, 0.75, { blur: 9, fog: 0.1, bg: '#d84a6a' });
  CELL.vesselEdge(ctx, vp);
}
// a small membrane panel (for the four groups): clipped to a box, chains with an optional tip colour
function panel(ctx, t, x, w, tips, tipU, seed, dim = 0) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, 250, w, 600, 36); ctx.clip();
  CELL.deep(ctx, t + seed);
  const edge = (u) => [x - 40 + u * (w + 80), 660 + 30 * Math.sin(u * 3 + seed)];
  CELL.membrane(ctx, t, edge, 9);
  [0.22, 0.5, 0.78].forEach((u, i) => { const p = edge(u), q = edge(u + 0.01), nx = q[1] - p[1], ny = -(q[0] - p[0]), d = Math.hypot(nx, ny);
    const col = tips === 'AB' ? (i % 2 ? CELL.SUGAR.B : CELL.SUGAR.A) : tips ? CELL.SUGAR[tips] : null;
    CELL.chain(ctx, t, p, [nx / d, ny / d], 4, col ? { col, u: K.ease.backOut(clamp(tipU * 3 - i * 0.6)) } : null, i + seed * 5, 28); });
  if (dim) { ctx.fillStyle = `rgba(10,10,40,${dim})`; ctx.fillRect(x, 250, w, 600); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, 250, w, 600, 36); ctx.stroke();
}
// a DNA strip of letter tiles across the screen; gap = index of a missing letter (with 0..1 vanish)
function dna(ctx, t, y, scroll, hi, gap, vanish) {
  const L = 'ATGGCCGAGGTGTTGCGGACGCTGGCCGGAAAACCAAAATGCCACGCACTGTTGAC', w = 74;
  ctx.font = `800 40px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const col = { A: '#4ade6a', T: '#ff6a6a', G: '#ffd03a', C: '#4ab0ff' };
  let x = -scroll;
  for (let i = 0; i < L.length; i++) { const isGap = i === gap, s = isGap ? 1 - vanish : 1; if (isGap && s <= 0.01) continue;
    const cx = x + w * s / 2; if (cx > -60 && cx < 1980) { ctx.globalAlpha = (hi && i >= hi[0] && i < hi[1]) || !hi ? 1 : 0.45; ctx.fillStyle = col[L[i]]; ctx.beginPath(); ctx.roundRect(cx - 30 * s, y - 34, 60 * s, 68, 14); ctx.fill(); ctx.fillStyle = '#1a1040'; if (s > 0.5) ctx.fillText(L[i], cx, y + 3); ctx.globalAlpha = 1; }
    x += w * s; }
}
// a face-on red cell with its group beads and (for +) RhD knobs
function groupCell(ctx, t, x, y, r, grp, rh, pop) {
  if (pop <= 0) return; const s = K.ease.backOut(clamp(pop));
  M.taggedCell(ctx, t, x, y, r * s, 0.2, 0.92, grp === 'O' ? null : grp, { fog: 0, bg: '#1a1a5a' });
  if (rh) for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + 0.4, px = x + Math.cos(a) * r * s * 0.7, py = y + Math.sin(a) * r * s * 0.62; M.cell(ctx, px, py, r * s * 0.1, '#b06aff', { seed: i }); }
}


// the hook's hand, after the user's reference (refs/hand.png): flat vector, the palm toward us, the index finger up, the
// other three fingers shorter beside it, the thumb out to the left, soft darker crease strokes; a gentle light from the left.
// Drawn in the reference's own units (553 px box) at k = 1.6, the index fingertip at D.
function hookHand(ctx, t, push, D, dropR) {
  const bg = ctx.createLinearGradient(0, 0, 1920, 1080); bg.addColorStop(0, '#d8eef6'); bg.addColorStop(0.55, '#9cc6dc'); bg.addColorStop(1, '#5a86b0'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 9; i++) { const x = K.hash(i, 1) * 1920, y = K.hash(i, 2) * 700, r = 60 + K.hash(i, 3) * 120, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  ctx.save(); ctx.translate(D[0], D[1]); ctx.scale(push, push); ctx.translate(-D[0], -D[1]);
  const k = 1.6, ox = D[0] - 172 * k, oy = D[1] - 10 * k + Math.sin(t * 1.3) * 3;
  ctx.save(); ctx.translate(ox, oy); ctx.scale(k, k);
  const SK = '#fcc493', CR = '#f6a36e', LT = '#ffdcb8';
  ctx.fillStyle = 'rgba(30,60,100,0.18)'; ctx.beginPath(); ctx.ellipse(300, 560, 200, 18, 0, 0, 7); ctx.fill();
  ctx.fillStyle = SK;
  // fingers: rounded bars, index tallest
  for (const [x0, top] of [[135, 10], [210, 122], [286, 160], [361, 205]]) { ctx.beginPath(); ctx.roundRect(x0, top, 76, 360 - top, [38, 38, 0, 0]); ctx.fill(); }
  // palm with rounded bottom corners, and the thumb sweeping out to the left
  ctx.beginPath(); ctx.moveTo(135, 250); ctx.lineTo(437, 250); ctx.lineTo(437, 400); ctx.quadraticCurveTo(437, 553, 330, 553); ctx.lineTo(240, 553); ctx.quadraticCurveTo(146, 553, 146, 470); ctx.lineTo(146, 440); ctx.fill();
  ctx.beginPath(); ctx.moveTo(146, 440); ctx.bezierCurveTo(110, 400, 75, 330, 15, 262); ctx.bezierCurveTo(-5, 240, 30, 222, 60, 228); ctx.bezierCurveTo(100, 236, 122, 262, 140, 300); ctx.lineTo(160, 330); ctx.lineTo(160, 440); ctx.fill();
  // a soft lit edge down the left of each finger
  ctx.fillStyle = LT; for (const [x0, top] of [[135, 10], [210, 122], [286, 160], [361, 205]]) { ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.roundRect(x0 + 10, top + 22, 12, 220 - (top > 100 ? 60 : 0), 6); ctx.fill(); } ctx.globalAlpha = 1;
  // a fingertip blush where the lancet goes
  const bl = ctx.createRadialGradient(172, 40, 4, 172, 50, 60); bl.addColorStop(0, `rgba(255,120,110,${0.35 * tw(t, 0.8, 1.4)})`); bl.addColorStop(1, 'rgba(255,120,110,0)'); ctx.fillStyle = bl; ctx.fillRect(110, 0, 130, 120);
  // creases (the reference's strokes)
  ctx.strokeStyle = CR; ctx.lineWidth = 18; ctx.lineCap = 'round';
  for (const [x, y0, y1] of [[211, 150, 310], [286, 196, 300], [361, 244, 310]]) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(133, 288); ctx.lineTo(145, 310); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(156, 440); ctx.lineTo(192, 468); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(370, 468); ctx.quadraticCurveTo(405, 462, 418, 440); ctx.stroke();
  ctx.restore();
  // the lancet pen comes straight down onto the fingertip, clicks, lifts away
  const ln = tw(t, 0.2, 0.75, 'out') * (1 - tw(t, 1.0, 1.5, 'in')), ly = K.lerp(-560, D[1] - 70, ln);
  if (ln > 0.01) { ctx.save(); ctx.translate(D[0] + 4, ly); const gl = ctx.createLinearGradient(-40, 0, 40, 0); gl.addColorStop(0, '#ffffff'); gl.addColorStop(1, '#a8c0d8'); ctx.fillStyle = gl; ctx.beginPath(); ctx.roundRect(-40, -480, 80, 420, 40); ctx.fill(); ctx.fillStyle = '#3a8ae8'; ctx.beginPath(); ctx.roundRect(-34, -70, 68, 130, [0, 0, 34, 34]); ctx.fill(); ctx.fillStyle = '#2a5ab0'; ctx.fillRect(-40, -320, 80, 30); ctx.restore(); }
  const fl = tw(t, 0.75, 0.82) * (1 - tw(t, 0.82, 1.05)); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, r = i % 2 ? 14 : 44; ctx.lineTo(D[0] + Math.cos(a) * r, D[1] - 10 + Math.sin(a) * r); } ctx.fill(); }
  // the drop: a dark red dome on the fingertip, a glossy highlight, a soft shadow, a little window reflection
  if (dropR > 1) { const r = dropR, cx = D[0], cy = D[1] + 6 - r * 0.55 + Math.sin(t * 1.3) * 3;
    ctx.fillStyle = 'rgba(150,30,30,0.25)'; ctx.beginPath(); ctx.ellipse(cx + 6, cy + r * 0.8, r * 0.95, r * 0.22, 0, 0, 7); ctx.fill();
    const gd = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r * 1.05); gd.addColorStop(0, '#ff7058'); gd.addColorStop(0.5, '#d4141c'); gd.addColorStop(1, '#6a0410');
    ctx.fillStyle = gd; ctx.beginPath(); ctx.moveTo(cx - r, cy + r * 0.62); ctx.bezierCurveTo(cx - r * 1.08, cy - r * 0.9, cx + r * 1.08, cy - r * 0.9, cx + r, cy + r * 0.62); ctx.quadraticCurveTo(cx, cy + r * 0.92, cx - r, cy + r * 0.62); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.ellipse(cx - r * 0.42, cy - r * 0.2, r * 0.2, r * 0.12, -0.6, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(cx + r * 0.25, cy - r * 0.15, r * 0.18, r * 0.24); ctx.fillRect(cx + r * 0.46, cy - r * 0.15, r * 0.18, r * 0.24); }
  ctx.restore();
}

// ---------- scenes ----------
const SCENE = {
  hook(ctx, t) {
    if (t < 3.6) {
      // a real fingertip test: a clinic blur behind, a hand with the index finger up, a lancet pen clicks, a drop swells
      const push = 1 + 0.45 * tw(t, 0, 2.7, 'inOut'), dropR = 64 * K.ease.backOut(tw(t, 1.0, 2.5)), D = [900, 230];
      hookHand(ctx, t, push, D, dropR);
      const z = tw(t, 2.6, 3.6, 'in'); if (z > 0) { ctx.save(); ctx.beginPath(); ctx.arc(D[0], D[1] - dropR * 0.4 * push, dropR * push + z * 1600, 0, 7); ctx.clip(); stream(ctx, t + 10, { hero: false }); ctx.restore(); }
    } else if (t < 6.4) stream(ctx, t + 10, { hero: false });
    else {
      // the question: four kinds of cell, side by side
      CELL.deep(ctx, t);
      ['A', 'B', 'AB', 'O'].forEach((g, i) => { const pop = tw(t, 6.6 + i * 0.35, 7.1 + i * 0.35); groupCell(ctx, t, 390 + i * 380, 520, 140, g, false, pop); pill(g, 390 + i * 380, 760, pop, { size: 54 }); });
    }
  },
  stream(ctx, t) { stream(ctx, t); pill('our cell', 760, 340, shows(t, 11, 15.6)); },
  marrow(ctx, t) {
    const u = t - 16, z = 1 + u * 0.006; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    M.marrow(ctx, t); M.nursery(ctx, t, u); ctx.restore();
    pill('inside a bone: the red marrow', 1180, 120, shows(t, 17, 23));
    const n = Math.floor(clamp((t - 23) / 6) * 2000000); pill(`${n.toLocaleString('en-US')} new red cells (about one second's worth)`, 1180, 120, shows(t, 23.4, 29.8), { size: 34 });
  },
  nucleus(ctx, t) {
    const u = t - 30; const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#8a2a5a'); bg.addColorStop(1, '#2a0a2a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
    for (let i = 0; i < 8; i++) CELL.rbc(ctx, K.hash(i, 3) * 1920, K.hash(i, 4) * 1080, 70 + K.hash(i, 5) * 40, K.hash(i, 6) * 6 + t * 0.1, 0.7, { blur: 8, fog: 0.6, bg: '#5a1a4a' });
    const out = tw(t, 31, 34.2, 'inOut'), pop = tw(t, 34.2, 35.2, 'out'), flat = tw(t, 35.4, 37.4, 'inOut');
    const nx = 960 + out * 120 + pop * 330, ny = 520 - out * 30 - pop * 60, macro = tw(t, 34.6, 37, 'inOut');
    // the macrophage comes for the nucleus and swallows it
    const mx0 = 2200 - macro * 760, my0 = 420; M.cell(ctx, mx0, my0, 210, '#5ab0e8', { seed: 4, wob: 0.08, t: t * 1.5, dots: 20 });
    if (t < 36.6) M.cell(ctx, nx, ny, 70 * (1 - tw(t, 36.2, 36.6)), '#8a4ad8', { seed: 2, t });
    if (flat < 1) { ctx.globalAlpha = 1 - flat; M.cell(ctx, 960 - out * 20, 540, 220, '#e8404a', { seed: 1, t, wob: 0.02 + out * 0.04 }); ctx.globalAlpha = 1; }
    if (flat > 0) { ctx.globalAlpha = flat; CELL.rbc(ctx, 940, 540, 250, -0.3 + (t - 35) * 0.08, lerp(1, 0.66, flat), { glow: 0.7 }); ctx.globalAlpha = 1; }
    if (t < 35.4 && out > 0) M.cell(ctx, nx, ny, 70, '#8a4ad8', { seed: 2, t });
    // the scale bar
    const sb = tw(t, 37.6, 38.3); if (sb > 0) { ctx.strokeStyle = `rgba(255,255,255,${sb})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(690, 860); ctx.lineTo(690 + 500 * sb, 860); ctx.moveTo(690, 842); ctx.lineTo(690, 878); ctx.moveTo(690 + 500 * sb, 842); ctx.lineTo(690 + 500 * sb, 878); ctx.stroke(); }
    pill('the nucleus is thrown out', 1360, 160, shows(t, 32.4, 35.4));
    pill('about 8 thousandths of a millimetre', 940, 940, shows(t, 38, 40));
  },
  surface(ctx, t) {
    const u = t - 40; CELL.deep(ctx, t);
    const edge = (s) => [-80 + s * 2100, 360 + s * 500 + 60 * Math.sin(s * 3.2)];
    CELL.membrane(ctx, t, edge);
    const at = (s) => { const p = edge(s), q = edge(s + 0.004), nx = q[1] - p[1], ny = -(q[0] - p[0]), d = Math.hypot(nx, ny); return [p, [nx / d, ny / d]]; };
    const add = tw(t, 54.2, 54.9, 'backOut');
    let heroTip = null;
    [[0.08, 4], [0.2, 5], [0.33, 3], [0.47, 5, 1], [0.62, 4], [0.76, 6], [0.9, 4]].forEach(([s, len, h], i) => { const [p, n] = at(s); const tp = CELL.chain(ctx, t, [p[0] - n[0] * 4, p[1] - n[1] * 4], n, len, h ? { col: CELL.SUGAR.A, u: add, glow: tw(t, 54.6, 55) } : null, i * 3 + 1, 26); if (h) heroTip = tp; });
    // the ABO gene in a strip of DNA, the enzyme it makes floating down to a chain tip
    const dn = shows(t, 48, 56, 0.6); if (dn > 0) { ctx.globalAlpha = dn; dna(ctx, t, 90, (t - 48) * 40 + 200, [10, 16]); ctx.globalAlpha = 1; pill('the ABO gene', 860, 180, shows(t, 48.6, 52.6), { size: 32 }); }
    const inn = tw(t, 50.5, 54, 'inOut'), back = tw(t, 55, 56, 'inOut'), off = 600 * (1 - inn) + 200 * back;
    if (t > 50.4) { const ex = heroTip[0] + 36 + off * 0.5, ey = heroTip[1] - 30 - off * 0.8; CELL.enzyme(ctx, t, ex, ey, 170, -0.62); if (add < 0.05) CELL.bead(ctx, ex - 6, ey + 4, 27, CELL.SUGAR.A); }
    pill('chains of sugar on the surface', 1240, 980, shows(t, 41, 45.4));
    pill('the same basic chain in everyone', 1240, 980, shows(t, 45.6, 50.2));
    pill('an enzyme adds one last sugar', 1240, 980, shows(t, 51, 56));
  },
  groups(ctx, t) {
    CELL.deep(ctx, t);
    const tips = [['A', 57], ['B', 62.5], ['AB', 68.5], ['O', 99]];
    tips.forEach(([g, t0], i) => { const x = 60 + i * 460, tu = clamp((t - t0) / 2); panel(ctx, t, x, 420, g === 'O' ? null : g, tu, i, t < t0 - 0.3 ? 0.55 : 0); pill(g === 'O' ? 'O ?' : g, x + 210, 210, tw(t, t0 - 0.6, t0 - 0.1), { size: 52 }); });
    pill('one sugar', 270, 920, shows(t, 58.5, 62.5)); pill('a different sugar', 730, 920, shows(t, 64, 68.5)); pill('both: one gene from each parent', 1190, 920, shows(t, 70, 74), { size: 32 });
  },
  ogroup(ctx, t) {
    CELL.deep(ctx, t);
    dna(ctx, t, 150, 60 + (t - 74) * 30, null, 24, tw(t, 77.6, 78.6, 'inOut'));
    // the broken enzyme: forms, then falls apart into loose beads
    const brk = tw(t, 80.8, 82.4, 'in');
    if (t > 79) { if (brk < 0.05) CELL.enzyme(ctx, t, 560, 520, 150 * tw(t, 79, 80, 'backOut'), -0.3, '#6a8ab8'); else for (let i = 0; i < 16; i++) CELL.bead(ctx, 660 + (K.hash(i, 3) - 0.5) * 340 + (K.hash(i, 5) - 0.5) * brk * 200, 500 + (K.hash(i, 6) - 0.5) * 160 + brk * (180 + K.hash(i, 4) * 320), 26, ['#6a8ab8', '#8aa8d8', '#4a6a98'][i % 3], 1 - brk * 0.7); }
    panel(ctx, t, 1240, 600, null, 0, 7);
    pill('one letter missing', 960, 260, shows(t, 76.8, 80.4)); pill('the enzyme comes out broken', 660, 860, shows(t, 80.6, 84)); pill('O: the bare chain', 1540, 920, shows(t, 82.6, 86));
  },
  rh(ctx, t) {
    CELL.deep(ctx, t);
    const grid = [['A', 1], ['A', 0], ['B', 1], ['B', 0], ['AB', 1], ['AB', 0], ['O', 1], ['O', 0]];
    if (t < 90.4) { groupCell(ctx, t, 960, 520, 300, 'A', t > 87.4, tw(t, 86.2, 87)); pill('RhD protein', 960, 900, shows(t, 87.8, 90.4)); }
    else grid.forEach(([g, rh], i) => { const x = 330 + (i % 4) * 420, y = 360 + Math.floor(i / 4) * 360, p = tw(t, 90.6 + i * 0.25, 91.1 + i * 0.25); groupCell(ctx, t, x, y, 120, g, rh, p); pill(g + (rh ? '+' : '−'), x, y + 160, p, { size: 44 }); });
  },
  journey(ctx, t) {
    if (t < 101) { stream(ctx, t); pill('off into the bloodstream', 760, 340, shows(t, 96.4, 100.6)); }
    else if (t < 106) { M.capillary(ctx, t, (t - 101) / 5 * 9.5); pill('a capillary: narrower than the cell', 960, 160, shows(t, 101.4, 105.8)); }
    else {
      const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#1a2a6a'); bg.addColorStop(1, '#3a1a5a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
      M.body(ctx, 960, 760, 760, '#4a5ab0'); M.vessels(ctx, t, 960, 760, 760);
      const loop = (s) => { const a = s * 6.283; return [1000 + Math.sin(a) * 150 * (1 + 0.6 * Math.sin(a * 2)), 330 + (1 - Math.cos(a)) * 330 - Math.sin(a) * 30]; };
      ctx.strokeStyle = 'rgba(255,90,90,0.55)'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 80; i++) { const [x, y] = loop(i / 80); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      const [hx, hy] = loop(((t - 106) / 3.6) % 1); CELL.rbc(ctx, hx, hy, 26, t, 0.8, { glow: 1 });
      M.cell(ctx, 1000, 330, 40, '#ff4a6a', { seed: 3, t: t * 4, wob: 0.05 + 0.04 * Math.sin(t * 7) });
      pill('round the whole body in about a minute', 960, 980, shows(t, 106.3, 110));
    }
  },
  antibodies(ctx, t) {
    stream(ctx, t, { hero: false, n: 90, near: false });
    ctx.fillStyle = 'rgba(40,0,30,0.25)'; ctx.fillRect(0, 0, 1920, 1080);
    M.taggedCell(ctx, t, 820 + Math.sin(t * 0.5) * 20, 560, 200, -0.3, 0.75, 'A', { glow: 0.9, fog: 0, bg: '#d84a6a', spin: 0 });
    for (let i = 0; i < 9; i++) { const ph = (t * 0.08 + K.hash(i, 1)) % 1, x = 1950 - ph * 2100, y = 140 + K.hash(i, 2) * 800, near = Math.hypot(x - 820, y - 560) < 300; const dy = near ? Math.sign(y - 560 || 1) * 80 : 0;
      M.antibody(ctx, x, y + dy, 46 + K.hash(i, 3) * 20, t * 0.5 + i, '#4a8aff'); }
    if (t > 116) M.igm(ctx, 1500 - (t - 116) * 60, 300 + Math.sin(t) * 20, 90, t * 0.3, '#4a8aff');
    pill('antibodies', 1400, 160, shows(t, 111, 115.4));
    pill('anti-B: they only grab the B tag', 1300, 160, shows(t, 116, 121));
    pill('our A cell is left alone', 820, 900, shows(t, 121.4, 126));
  },
  gut(ctx, t) {
    if (t < 131) { const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#ffe2ec'); bg.addColorStop(1, '#f6c2d8'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080); M.baby(t, ctx, 960, 560, 260); pill('a newborn: no anti-A or anti-B yet', 960, 900, shows(t, 126.6, 131)); }
    else { M.gut(ctx, t, t - 131); for (let i = 0; i < 8; i++) { const p = tw(t, 135 + i * 0.3, 135.6 + i * 0.3, 'backOut'); if (p > 0) M.antibody(ctx, 200 + i * 220, 760 + Math.sin(t + i) * 20, 50 * p, Math.sin(t + i) * 0.4, '#ffd03a'); }
      pill('gut bacteria wear similar sugars', 960, 100, shows(t, 131.4, 135.4)); pill('the body learns to make antibodies: by about 3 to 6 months', 960, 100, shows(t, 135.6, 140), { size: 32 }); }
  },
  attack(ctx, t) {
    if (t < 144) {
      const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#2a6ab8'); bg.addColorStop(1, '#1a3a7a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
      M.bag(ctx, 700, 320, 260, 'A');
      ctx.strokeStyle = '#e8f0ff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(700, 520); ctx.bezierCurveTo(700, 760, 1100, 640, 1270, 770); ctx.stroke();
      ctx.strokeStyle = '#c0101a'; ctx.lineWidth = 5; ctx.setLineDash([24, 20]); ctx.lineDashOffset = -t * 80; ctx.stroke(); ctx.setLineDash([]);
      const ga = ctx.createLinearGradient(0, 690, 0, 880); ga.addColorStop(0, '#f6caa8'); ga.addColorStop(1, '#d8957a'); ctx.fillStyle = ga;
      ctx.beginPath(); ctx.moveTo(1960, 660); ctx.bezierCurveTo(1700, 650, 1400, 700, 1260, 720); ctx.bezierCurveTo(1150, 735, 1150, 860, 1260, 860); ctx.bezierCurveTo(1450, 870, 1700, 880, 1960, 900); ctx.fill();
      for (let i = 0; i < 4; i++) { ctx.strokeStyle = '#e8b090'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1190, 745 + i * 32); ctx.lineTo(1080 - (i === 0 ? -20 : 0), 735 + i * 38); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.roundRect(1225, 735, 110, 70, 10); ctx.fill(); ctx.fillStyle = '#b8c8e0'; ctx.fillRect(1250, 760, 60, 18);
      pill('group A blood, into a group O patient', 960, 960, shows(t, 140.4, 144));
      return;
    }
    const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#a01a3a'); bg.addColorStop(1, '#3a0418'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
    const u = t - 144, clump = tw(t, 148, 153, 'inOut'), burst = tw(t, 154, 157, 'out');
    const cells = []; for (let i = 0; i < 11; i++) { const sx = -300 + K.hash(i, 1) * 2400 + (1 - tw(t, 144, 148, 'out')) * -600, sy = 150 + K.hash(i, 2) * 780, a = i / 11 * 6.283, tx = 960 + Math.cos(a) * (120 + (i % 3) * 90), ty = 540 + Math.sin(a) * (100 + (i % 3) * 70);
      cells.push([lerp(sx, tx, clump), lerp(sy, ty, clump), i]); }
    cells.forEach(([x, y, i]) => { if (burst > 0 && K.hash(i, 9) < 0.7) { const b = burst; ctx.globalAlpha = 1 - b; const gr = ctx.createRadialGradient(x, y, 0, x, y, 200 * b + 60); gr.addColorStop(0, 'rgba(255,40,40,0.6)'); gr.addColorStop(1, 'rgba(255,40,40,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 300, y - 300, 600, 600); ctx.globalAlpha = 1;
      for (let k = 0; k < 8; k++) { const a = k * 0.8 + i, d = b * 120 + 30; CELL.bead(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 34 * (1 - b * 0.4), k % 2 ? '#d0201e' : '#ff5a40', 1 - b * 0.5); } return; }
      M.taggedCell(ctx, t, x, y, 110, i + t * 0.05 * (1 - clump), 0.8, 'A', { fog: 0, bg: '#a01a3a' }); });
    // anti-A antibodies: drifting, then bridging neighbouring cells
    for (let i = 0; i < 22; i++) { const c1 = cells[i % 11], c2 = cells[(i + 3) % 11], fx = (K.hash(i, 4) * 2200 - u * 60) % 2200 - 140, fy = 100 + K.hash(i, 5) * 880;
      const bx = (c1[0] + c2[0]) / 2, by = (c1[1] + c2[1]) / 2, x = lerp(fx, bx, clump), y = lerp(fy, by, clump); if (burst > 0.6) continue; M.antibody(ctx, x, y, 40, Math.atan2(c2[1] - c1[1], c2[0] - c1[0]) + Math.PI / 2 * clump + i, '#ffc23a'); }
    pill('anti-A antibodies', 1500, 140, shows(t, 144.6, 148.4)); pill('the cells clump together', 960, 960, shows(t, 149, 153.8)); pill('and burst', 960, 960, shows(t, 154.2, 160));
  },
  bank(ctx, t) { M.bank(ctx, t, t - 160, tw(t, 164, 165)); pill('O negative: no A, no B, no RhD', 960, 100, shows(t, 164, 168)); pill('in an emergency: for almost anyone', 960, 100, shows(t, 168.2, 172)); },
  lineage(ctx, t) {
    M.lineage(t, ctx, tw(t, 173, 184, 'inOut'));
    const y = Math.round(Math.pow(10, lerp(1.4, 5.5, tw(t, 173.5, 184, 'in')))); pill(`${y.toLocaleString('en-US')} years ago`, 1500, 120, shows(t, 173.4, 184), { size: 40 });
  },
  apes(ctx, t) {
    if (t < 189) {
      const bg = ctx.createLinearGradient(0, 0, 0, 1080); bg.addColorStop(0, '#ffd890'); bg.addColorStop(1, '#e8a060'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
      M.savanna(ctx, t); for (let i = 0; i < 4; i++) M.person(t, 300 + i * 260 + (t - 184) * 60, 820 + (i % 2) * 20, [300, 270, 200, 285][i], { kid: i === 2, pose: 'walk', shirt: ['#8a5a3a', '#7a4a2a', '#8a5a3a', '#6a3a24'][i], pants: '#a87a4a', skin: '#8a5a3a', hair: '#1a100a', shoes: '#5a3a24', seed: i, mood: 'happy' });
      pill('the first humans: about 300,000 years ago', 960, 120, shows(t, 184.4, 189));
      return;
    }
    M.jungle(ctx, t); const sw = Math.sin(t * 1.3) * 0.35; M.gibbon(t, ctx, 820 + Math.sin(t * 0.4) * 10, 170, 520, sw);
    const tr = shows(t, 193.6, 200, 0.6); if (tr > 0) {
      ctx.globalAlpha = tr; ctx.fillStyle = 'rgba(10,20,50,0.75)'; ctx.beginPath(); ctx.roundRect(1180, 520, 660, 420, 30); ctx.fill();
      ctx.strokeStyle = '#ffe0a0'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1510, 900); ctx.lineTo(1510, 780); ctx.lineTo(1330, 640); ctx.moveTo(1510, 780); ctx.lineTo(1690, 640); ctx.stroke();
      for (const [x, lab] of [[1330, 'gibbons'], [1690, 'humans']]) { CELL.bead(ctx, x - 22, 600, 18, CELL.SUGAR.A); CELL.bead(ctx, x + 22, 600, 18, CELL.SUGAR.B); ctx.fillStyle = '#ffffff'; ctx.font = `700 34px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(lab, x, 560); }
      ctx.fillStyle = '#ffe0a0'; ctx.fillText('about 20 million years ago', 1510, 920); ctx.globalAlpha = 1; }
    pill('a gibbon: groups A and B, from the same gene', 760, 980, shows(t, 189.6, 193.6), { size: 32 });
  },
  germs(ctx, t) {
    const bg = ctx.createLinearGradient(0, 0, 1920, 1080); bg.addColorStop(0, '#1a1a6a'); bg.addColorStop(1, '#3a1a5a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
    if (t < 204) { M.mosquito(t, ctx, lerp(2100, 900, tw(t, 200, 203.5, 'out')) + Math.sin(t * 3) * 10, 420 + Math.sin(t * 5) * 14, 700, -1); pill('malaria', 960, 900, shows(t, 200.6, 204)); return; }
    if (t < 212) {
      M.infected(ctx, t, 640, 540, 120, 0.3, 0.85);
      const st = tw(t, 205, 208, 'inOut');
      for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283, far = [640 + Math.cos(a) * 420, 540 + Math.sin(a) * 380], close = [640 + Math.cos(a) * 225, 540 + Math.sin(a) * 210]; M.taggedCell(ctx, t, lerp(far[0], close[0], st), lerp(far[1], close[1], st), 95, a, 0.8, 'A', { fog: 0, bg: '#1a1a6a' }); }
      M.infected(ctx, t, 1460, 540, 110, -0.2, 0.85);
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 + t * 0.2, d = 330 + Math.sin(t + i) * 20; CELL.rbc(ctx, 1460 + Math.cos(a) * d * 0.8, 540 + Math.sin(a) * d * 0.7, 85, a, 0.8, { fog: 0, bg: '#1a1a6a' }); }
      pill('A and B cells stick round an infected cell', 640, 100, shows(t, 205, 212), { size: 32 }); pill('group O: less sticking', 1460, 100, shows(t, 208, 212), { size: 32 });
      return;
    }
    if (t < 217) { for (let i = 0; i < 9; i++) M.vibrio(ctx, t, 200 + i * 200 + Math.sin(t + i) * 30, 300 + K.hash(i, 3) * 500, 120, t * 0.4 + i); pill('cholera: tends to hit group O harder', 960, 960, shows(t, 212.4, 217)); return; }
    const tilt = Math.sin((t - 217) * 3) * (1 - tw(t, 218.5, 220)) * 0.8;
    M.scale(ctx, 960, 400, 420, tilt, (x, y) => groupCell(ctx, t, x, y - 40, 60, 'O', false, 1), (x, y) => { groupCell(ctx, t, x - 50, y - 40, 50, 'A', false, 1); groupCell(ctx, t, x + 50, y - 40, 50, 'B', false, 1); });
    pill('no type wins everywhere', 960, 960, shows(t, 217.4, 220));
  },
  world(ctx, t) {
    const cr = tw(t, 225.6, 226.6, 'inOut'); ctx.fillStyle = '#0e2a60'; ctx.fillRect(0, 0, 1920, 1080); ctx.save(); ctx.translate(960, 150); ctx.scale(1 - 0.3 * cr, 1 - 0.3 * cr); ctx.translate(-960, -150 + 20 * cr); M.world(ctx, t, t - 220); ctx.restore();
    if (t > 226) { ctx.fillStyle = 'rgba(10,20,50,0.5)'; ctx.fillRect(0, 780, 1920, 300); for (let i = 0; i < 9; i++) { const x = 140 + i * 205; M.person(t, x, 1040, 300, { kid: i % 4 === 3, shirt: ['#e35d4f', '#4f7fc4', '#5aa86a', '#e0a040', '#a86ac8', '#d86a8a'][i % 6], skin: ['#f2c29b', '#c88a5a', '#8a5a3a', '#e0b080'][i % 4], hair: '#2a1a14', seed: i, mood: 'happy' }); const g = ['O', 'A', 'B', 'O', 'AB', 'A', 'O', 'B', 'A'][i]; if (g !== 'O') { const cols = g === 'AB' ? [CELL.SUGAR.A, CELL.SUGAR.B] : [CELL.SUGAR[g]]; cols.forEach((c, k) => CELL.bead(ctx, x - (cols.length - 1) * 12 + k * 24, 700, 14, c)); } else M.ell(ctx, x, 700, 12, 12, 'rgba(255,255,255,0.7)'); } }
    pill('the mix of groups differs from place to place', 960, 90, shows(t, 220.6, 226)); pill('the variety itself is the point', 960, 90, shows(t, 226.4, 232));
  },
  end(ctx, t) {
    if (t < 236.5) { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#7a1a3a'); bg.addColorStop(1, '#2a0418'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
      const e = tw(t, 233, 236, 'inOut'); M.cell(ctx, 1200 - e * 160, 520, 260, '#5ab0e8', { seed: 4, wob: 0.08, t: t * 1.5, dots: 20 });
      ctx.globalAlpha = 1 - tw(t, 235.4, 236.2); CELL.rbc(ctx, lerp(560, 1020, e), 540, 150 * (1 - e * 0.3), t * 0.3, 0.7, { fog: 0.35, bg: '#7a3a5a', glow: 0.6 }); ctx.globalAlpha = 1;
      pill('after about 120 days: recycled', 960, 940, shows(t, 232.6, 236.4)); return; }
    if (t < 240) { M.marrow(ctx, t); M.nursery(ctx, t, t - 230); pill('about two million new ones, every second', 1180, 120, shows(t, 236.8, 240)); return; }
    stream(ctx, t, { hero: true }); const fz = tw(t, 242, 244); if (fz > 0) P.haze('#000000', fz);
  },
};

const FILM = {
  draw(t) {
    const ctx = P.ctx; let s = SC.find(([a, b]) => t >= a && t < b) ?? SC[SC.length - 1];
    SCENE[s[2]](ctx, t);
    // dip to dark at each cut
    const d = Math.min(t - s[0], s[1] - t); if (s[0] > 0 && t - s[0] < 0.35) P.haze('#0a0410', 1 - (t - s[0]) / 0.35); else if (s[1] < 244 && s[1] - t < 0.35) P.haze('#0a0410', 1 - (s[1] - t) / 0.35); void d;
    P.vignette(0.28);
  },
};
