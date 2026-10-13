// =====================================================================
//  SCENES — Who killed the dinosaurs? Crosshatch ink: a sketchy boiling line, hatching and coloured pencil inside
//  shapes, warm paper. A detective (the terracotta dot hero in a deerstalker) works the case; the explanation is
//  written onto the paper on the right (no card); the scene tags are clue cards. Red = the evidence that matters.
// =====================================================================
const CHANNEL = { halo: 'rgba(244,236,217,0.85)', colors: { ink: C.ink, accent: C.red, green: C.green, blue: '#3f6f9a' },
  tag: (str, k) => inkCard(str, CL + (handW(str, 44) + 40) / 2, 82, 44, { rot: -0.03, s: k, color: str.startsWith('clue') || str.startsWith('suspect') ? C.red : C.ink }) };
const ROCK = ['#cbb08a', '#b99a72', '#d8c3a0', '#a7865f'], CLAY = '#7a3b2a';
const tex = (c, k = 'hatch', o = {}) => [{ k, c: c ?? 'rgba(58,36,23,0.55)', al: 0.5, gap: 6, ...o }];
function detective(x, y, r, o = {}) {
  dotHero(x, y, r, { key: 'det', mood: o.mood ?? 'smile' });
  const hat = [[x - r * 0.95, y - r * 0.55], [x - r * 0.6, y - r * 1.15], [x + r * 0.5, y - r * 1.2], [x + r * 0.95, y - r * 0.6], [x + r * 1.25, y - r * 0.45], [x - r * 1.2, y - r * 0.4]];
  paint(hat, { fill: '#8a6a4a', key: 'dethat', w: 3, tex: [{ k: 'cross', c: 'rgba(58,36,23,0.5)', al: 0.6, gap: 6 }] });
  if (o.glass !== false) { const gx = x + r * 1.5, gy = y + r * 0.1 + Math.sin(TT * 2) * 6; ink([[x + r * 0.9, y + r * 0.5], [gx - r * 0.3, gy + r * 0.35]], { w: 8, color: '#6b4a2e', key: 'gh' }); ink(ellipsePts(gx, gy, r * 0.45, r * 0.45, 0, 24), { closed: true, w: 6, key: 'gl' }); }
}
function trex(x, y, s, key, o = {}) {
  const U = [[0, 0.45], [0.15, 0.38], [0.3, 0.35], [0.45, 0.3], [0.55, 0.18], [0.62, 0.08], [0.78, 0.05], [0.92, 0.1], [0.95, 0.2], [0.85, 0.24], [0.9, 0.3], [0.75, 0.3], [0.66, 0.35], [0.7, 0.45], [0.66, 0.48], [0.6, 0.42], [0.56, 0.55], [0.6, 0.9], [0.68, 0.98], [0.52, 0.98], [0.48, 0.7], [0.38, 0.68], [0.4, 0.95], [0.46, 1.0], [0.3, 1.0], [0.28, 0.62], [0.15, 0.55]];
  const P = U.map(([u, v]) => [x + (o.flip ? -1 : 1) * (u - 0.5) * 300 * s, y + (v - 1) * 260 * s + Math.sin(TT * 2 + key.length) * 3]);
  paint(P, { fill: o.fill ?? '#7e9a6a', key, w: 4, tex: [{ k: 'hatch', c: 'rgba(58,36,23,0.5)', al: 0.55, gap: 6, dens: (px, py) => clamp(0.3 + (py - (y - 260 * s)) / (260 * s)) }] });
  const ex = x + (o.flip ? -1 : 1) * 0.28 * 300 * s, ey = y - 0.88 * 260 * s; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(ex, ey, 6 * s + 2, 0, TAU); ctx.fill();
}
function trike(x, y, s, key) {
  paint(ellipsePts(x, y - 80 * s, 150 * s, 80 * s, 0, 30), { fill: '#b98a5a', key: key + 'b', w: 4, tex: tex(null, 'hatch', { dens: (px, py) => clamp((py - y + 120 * s) / (120 * s)) }) });
  paint(ellipsePts(x + 160 * s, y - 120 * s, 70 * s, 90 * s, 0.4, 24), { fill: '#c99a6a', key: key + 'f', w: 4, tex: tex(null, 'cross') });
  paint(ellipsePts(x + 190 * s, y - 70 * s, 50 * s, 34 * s, 0.2, 18), { fill: '#b98a5a', key: key + 'h', w: 4 });
  for (const [dx, dy, L] of [[200, -95, 70], [175, -110, 60], [235, -60, 30]]) ink([[x + dx * s, y + dy * s], [x + (dx + L) * s, y + (dy - L * 0.4) * s]], { w: 7 * s + 2, key: key + 'hn' + dx });
  for (const lx of [-90, -30, 40, 100]) ink([[x + lx * s, y - 40 * s], [x + lx * s, y + 10 * s]], { w: 16 * s, key: key + 'lg' + lx });
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 205 * s, y - 85 * s, 5 * s + 1, 0, TAU); ctx.fill();
}
function bird(x, y, s, key, o = {}) {
  const bob = Math.abs(Math.sin(TT * 3 + key.length)) * 6 * s;
  ink([[x - 10 * s, y + 30 * s], [x - 14 * s, y + 70 * s]], { w: 5, key: key + 'l1' }); ink([[x + 12 * s, y + 30 * s], [x + 16 * s, y + 70 * s]], { w: 5, key: key + 'l2' });
  paint([[x - 70 * s, y - 10 * s], [x - 110 * s, y - 40 * s], [x - 100 * s, y + 5 * s]], { fill: o.tail ?? '#8a8590', key: key + 't', w: 3 });
  paint(ellipsePts(x, y, 70 * s, 45 * s, -0.15, 26), { fill: o.c ?? '#9aa3ad', key: key + 'b', w: 4, tex: [{ k: 'pencil', c: 'rgba(255,255,255,0.5)', al: 0.5, per: 50 }, { k: 'hatch', c: 'rgba(58,36,23,0.4)', al: 0.4, gap: 6, dens: (px, py) => clamp((py - y) / (45 * s)) }] });
  paint(ellipsePts(x + 60 * s, y - 40 * s - bob, 28 * s, 28 * s, 0, 18), { fill: o.c ?? '#9aa3ad', key: key + 'hd', w: 4 });
  paint([[x + 84 * s, y - 44 * s - bob], [x + 110 * s, y - 36 * s - bob], [x + 84 * s, y - 30 * s - bob]], { fill: C.yellow, key: key + 'bk', w: 3 });
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 66 * s, y - 46 * s - bob, 4 * s + 1, 0, TAU); ctx.fill();
  if (o.comb) paint([[x + 46 * s, y - 64 * s - bob], [x + 56 * s, y - 84 * s - bob], [x + 64 * s, y - 68 * s - bob], [x + 74 * s, y - 82 * s - bob], [x + 76 * s, y - 62 * s - bob]], { fill: C.red, key: key + 'cm', w: 3 });
}
// rock layers (strata): bands of colour and hatching; the boundary clay as a thin dark-red band at yc
function strata(x0, y0, x1, y1, yc, key, o = {}) {
  const n = 7, h = (y1 - y0) / n;
  for (let i = 0; i < n; i++) { const P = [[x0, y0 + i * h], [x1, y0 + i * h + Math.sin(i) * 6], [x1, y0 + (i + 1) * h], [x0, y0 + (i + 1) * h]]; paint(P, { fill: ROCK[i % 4], key: key + 'r' + i, w: 2, tex: [{ k: i % 2 ? 'hatch' : 'stipple', c: 'rgba(58,36,23,0.5)', al: 0.5, gap: 7 + i, n: 160 }] }); }
  paint([[x0, yc - 7], [x1, yc - 4], [x1, yc + 7], [x0, yc + 5]], { fill: CLAY, key: key + 'clay', w: 3, tex: [{ k: 'cross', c: 'rgba(30,10,5,0.5)', al: 0.6, gap: 4 }] });
  if (o.fossils) { const R = RNG('fos', key); for (let i = 0; i < 5; i++) { const fx = R.r(x0 + 60, x1 - 60), fy = R.r(yc + 40, y1 - 30); ink([[fx - 40, fy], [fx + 40, fy + R.n(10)]], { w: 6, color: '#efe2c8', key: key + 'bn' + i }); ink(ellipsePts(fx - 44, fy, 10, 10, 0, 10), { closed: true, w: 5, color: '#efe2c8', key: key + 'bk' + i }); ink(ellipsePts(fx + 44, fy, 10, 10, 0, 10), { closed: true, w: 5, color: '#efe2c8', key: key + 'bk2' + i }); } }
}

// ---- 1. the case: a dinosaur skeleton's world, the detective arrives
function sHook(o = {}) {
  paperSheet('hk');
  woodSurface(-40, 860, W + 40, H + 40, 'hkdesk');
  trex(300, 760, 1.1, 'hkt', { fill: '#a8b896' }); trike(560, 830, 0.6, 'hktr');
  if (TT > at(7.2) || o.done) { const k = o.done ? 1 : ev(at(7.2), 0.6); strata(620, 600, 960, 860, 700, 'hks'); ink(ellipsePts(790, 700, 140 * k + 10, 34 * k + 10, 0, 30), { closed: true, w: 6, color: C.red, key: 'hkring' }); }
  detective(820, 420, 70, { mood: o.mood ?? (TT > at(7.2) ? 'wow' : 'smile') });
}
function cHook(at) {
  title('Who killed the dinosaurs?', at(0.4));
  write('no witnesses...', CL, 360, 52, at(1.2));
  bigNum('66 million', 'years later, the clues remain', CCX, 560, at(2.6), CH.accent, 110);
  write('...hidden in a layer of clay', CL, 780, 46, at(7.2), { color: CH.accent, weight: 700 });
}

// ---- 2. the victims and the suspects
function sVictims() {
  paperSheet('vc', { fill: '#e9dcc0' });
  trex(240, 620, 0.9, 'vt', { fill: '#a8b896' }); trike(520, 640, 0.55, 'vtr');
  for (let i = 0; i < 4; i++) { const x = 170 + i * 220, y = 860, k = popS(at(5.0) + i * 0.8); if (k <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); paint(rrectPts(-95, -70, 190, 140, 8), { fill: C.paper, key: 'sus' + i, w: 3, tex: [{ k: 'pencil', c: '#e8d6b0', al: 0.5, per: 80 }] }); handText(['disease', 'climate', 'volcanoes', 'space rock'][i], -80, 10, 34, C.ink, { key: 'sust' + i }); ctx.restore(); }
  ink([[60, 400], [960, 400]], { w: 4, color: C.red, key: 'tape1', frac: ev(at(1.4), 0.8) }); handText('~75% of species', 380, 380, 40, C.red, { key: 'vpct', frac: ev(at(1.6), 0.6) });
}
function cVictims(at) {
  title('The victims', at(0.6));
  bigNum('3 in 4', 'species gone, incl. T. rex', CCX, 420, at(1.4), CH.accent, 110);
  write('the suspects:', CL, 640, 48, at(5.0), { weight: 700 });
  write("let's look at the evidence", CL, 860, 46, at(10.6));
}

// ---- 3. clue 1: the clay layer
function sClay() {
  paperSheet('cl', { fill: '#e9dcc0', ruled: false });
  strata(60, 260, 940, 1000, 620, 'cls', { fossils: true });
  if (TT > at(5.4)) { const k = ev(at(5.4), 0.5); ink([[60, 612], [60 + 880 * k, 612]], { w: 5, color: C.red, key: 'clayline' }); }
  handText('no dinosaur fossils above', 180, 470, 34, C.ink, { key: 'abv', frac: ev(at(8.0), 0.6) });
  handText('dinosaur fossils below', 200, 780, 34, '#efe2c8', { key: 'blw', frac: ev(at(5.4), 0.6) });
  detective(830, 330, 48, { mood: 'wow' });
}
function cClay(at) {
  title('A thin layer of clay', at(0.6));
  write('all over the world', CL, 400, 48, at(1.4));
  write('below: dinosaurs', CL, 520, 48, at(5.4));
  write('above: none, ever again', CL, 620, 48, at(8.0), { color: CH.accent, weight: 700 });
  write('it happened fast', CL, 800, 46, at(10.4));
}

// ---- 4. clue 2: iridium
function sIridium() {
  paperSheet('ir');
  const k = popS(at(1.4)); if (k > 0) { ctx.save(); ctx.translate(260, 380); ctx.scale(k, k); paint(rrectPts(-130, -150, 260, 300, 10), { fill: '#d8dde4', key: 'ir', w: 5, tex: [{ k: 'pencil', c: '#ffffff', al: 0.5, per: 50 }] }); handText('77', -100, -100, 42, C.ink, { key: 'irn' }); handText('Ir', -70, 50, 140, C.ink, { key: 'irs', weight: 700 }); handText('iridium', -80, 115, 34, C.ink, { key: 'irl' }); ctx.restore(); }
  // the bar chart: normal vs the boundary clay
  const bx = 560, by = 860, f = ev(at(4.4), 1.0);
  ink([[bx - 20, by], [bx + 360, by]], { w: 4, key: 'ax' }); ink([[bx - 20, by], [bx - 20, by - 600]], { w: 4, key: 'ay' });
  paint(rrectPts(bx + 30, by - 30, 110, 30, 4), { fill: ROCK[1], key: 'b1', w: 3, tex: tex() }); handText('normal rock', bx + 10, by + 44, 28, C.ink, { key: 'b1l' });
  if (f > 0) { const h = 580 * f; paint(rrectPts(bx + 200, by - h, 110, h, 4), { fill: C.red, key: 'b2', w: 3, tex: tex('rgba(60,10,5,0.5)', 'cross') }); handText('the clay', bx + 200, by + 44, 28, C.red, { key: 'b2l' }); }
  detective(200, 790, 52, { mood: TT > at(8.4) ? 'wow' : 'smile', glass: false });
  if (TT > at(10.4)) { const ax = 760, ay = 200, u = clamp((TT - at(10.4)) / 1.6); paint(ellipsePts(lerp(980, ax, u), lerp(60, ay, u), 46, 40, 0.3, 18), { fill: '#8a7a6a', key: 'ast', w: 4, tex: tex(null, 'stipple', { c: C.ink, n: 60 }) }); }
}
function cIridium(at) {
  title('Iridium', at(0.6));
  write('Luis & Walter Alvarez, 1980', CL, 400, 46, at(1.4));
  bigNum('100s of times', 'more than normal', CCX, 580, at(4.4), CH.accent, 96);
  write('rare on Earth...', CL, 780, 46, at(8.4));
  write('...common in asteroids', CL, 860, 48, at(10.4), { color: CH.accent, weight: 700 });
}

// ---- 5. clue 3: shocked quartz and glass beads
function sQuartz() {
  paperSheet('qz', { ruled: false });
  const cx = 300, cy = 440, X = [[cx, cy - 220], [cx + 110, cy - 120], [cx + 110, cy + 140], [cx, cy + 230], [cx - 110, cy + 140], [cx - 110, cy - 120]];
  paint(X, { fill: '#e6eef2', key: 'qz', w: 5, tex: [{ k: 'pencil', c: '#ffffff', al: 0.6, per: 40 }, { k: 'hatch', c: 'rgba(80,100,130,0.4)', al: 0.4, gap: 9, a: 1.2 }] });
  if (TT > at(2.4)) { ctx.save(); trace(X, true); ctx.clip(); for (let i = 0; i < 9; i++) { const f = ev(at(2.4) + i * 0.08, 0.3); ink([[cx - 150, cy - 160 + i * 42], [cx - 150 + 300 * f, cy - 100 + i * 42]], { w: 3, color: C.red, key: 'lam' + i }); } ctx.restore(); }
  handText('shocked quartz', cx - 120, cy + 300, 36, C.ink, { key: 'qzl' });
  for (let i = 0; i < 7; i++) { const t0 = at(6.4) + i * 0.25, u = clamp((TT - t0) / 0.8); if (u <= 0) continue; const x = 620 + (i % 4) * 90, y = lerp(150, 520 + Math.floor(i / 4) * 90, EZ.i2(u)); paint(ellipsePts(x, y, 30, 30, 0, 18), { fill: '#7fb0a8', key: 'bead' + i, w: 3, tex: [{ k: 'pencil', c: '#ffffff', al: 0.5, per: 30 }] }); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(x - 9, y - 10, 7, 0, TAU); ctx.fill(); }
  if (TT > at(6.4)) handText('glass beads', 640, 720, 36, C.ink, { key: 'bdl' });
  detective(820, 880, 46, { mood: TT > at(10.0) ? 'wow' : 'smile' });
}
function cQuartz(at) {
  title('Shocked quartz', at(0.6));
  write('cracked by sudden pressure', CL, 400, 46, at(3.6));
  write('+ tiny beads of melted rock', CL, 520, 46, at(6.4));
  write('fingerprints of an impact', CL, 720, 52, at(10.0), { color: CH.accent, weight: 700 });
}

// ---- 6. clue 4: the crater
function sCrater() {
  paperSheet('cr', { fill: '#dfe9ee', ruled: false });
  const coast = [[40, 320], [260, 300], [420, 360], [520, 330], [640, 360], [700, 300], [780, 260], [960, 280], [960, 1080], [40, 1080]];
  paint(coast, { fill: '#cdb98d', key: 'land', w: 4, tex: [{ k: 'pencil', c: '#a8925f', al: 0.35, per: 120 }] });
  for (let i = 0; i < 6; i++) { const R = RNG('wv', i); ink([[R.r(60, 900), R.r(80, 240)], [R.r(60, 900) + 30, R.r(80, 240)]], { w: 3, color: '#7da0b8', key: 'wv' + i }); }
  handText('Gulf of Mexico', 360, 160, 34, '#4f7896', { key: 'gulf' }); handText('Yucatán', 600, 600, 38, C.ink, { key: 'yuc' });
  const cx = 470, cy = 340, f = ev(at(4.4), 1.2);
  for (let r = 1; r <= 3; r++) if (f > r / 4) { ctx.save(); ctx.setLineDash([16, 12]); ink(ellipsePts(cx, cy, 90 * r, 60 * r, 0, 48), { closed: true, w: 5, color: C.red, key: 'ring' + r }); ctx.restore(); }
  if (TT > at(8.4)) { ink([[cx - 270, cy + 210], [cx + 270, cy + 210]], { w: 4, color: C.red, key: 'scale' }); handText('~180 km', cx - 70, cy + 255, 40, C.red, { key: 'scl', weight: 700 }); }
  if (TT < at(10.8)) { const u = clamp((TT - at(1.0)) / 9.8), ax = lerp(1000, cx, EZ.i3(u)), ay = lerp(-80, cy, EZ.i3(u)); for (let k = 0; k < 5; k++) ink([[ax + k * 22, ay - k * 26], [ax + 60 + k * 30, ay - 70 - k * 30]], { w: 10 - k, color: k % 2 ? C.orange : C.yellow, key: 'trail' + k }); paint(ellipsePts(ax, ay, 40, 34, 0.4, 18), { fill: '#7a6a5a', key: 'ast2', w: 4, tex: tex(null, 'stipple', { c: C.ink, n: 60 }) }); }
  else { const k = ev(at(10.8), 0.6); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ink([[cx + Math.cos(a) * 60, cy + Math.sin(a) * 40], [cx + Math.cos(a) * (60 + 260 * k), cy + Math.sin(a) * (40 + 170 * k)]], { w: 8, color: i % 2 ? C.orange : C.yellow, key: 'blast' + i }); } }
}
function cCrater(at) {
  title('The weapon', at(0.6));
  write('Chicxulub crater, Mexico', CL, 400, 48, at(1.4));
  bigNum('~180 km', 'wide, buried', CCX, 580, at(4.4), CH.accent, 110);
  write('the same age as the clay', CL, 780, 46, at(8.4));
  write('a rock ~10 km across', CL, 870, 48, at(11.0), { color: CH.accent, weight: 700 });
}

// ---- 7. the second suspect: the Deccan Traps
function sVolcano() {
  paperSheet('vo', { fill: '#e9dcc0', ruled: false });
  for (let i = 0; i < 3; i++) { const x = 180 + i * 300, y = 860, h = 260 + (i % 2) * 80, P = [[x - 170, y], [x - 40, y - h], [x + 40, y - h], [x + 170, y]]; paint(P, { fill: '#6b5a4a', key: 'vol' + i, w: 4, tex: tex('rgba(20,10,5,0.6)', 'cross') }); const erupt = TT > at(3.0 + i * 2.0); if (erupt) { for (let k = 0; k < 5; k++) { const u = mod(TT * 0.6 + k / 5 + i, 1); paint(ellipsePts(x + Math.sin(k * 3 + i) * 60 * u, y - h - u * 380, 40 + u * 70, 30 + u * 50, 0, 16), { fill: '#8a8590', key: 'ash' + i + k, w: 2, tex: tex(null, 'stipple', { c: 'rgba(30,20,10,0.5)', n: 60 }) }); } ink([[x - 30, y - h + 10], [x - 60, y - h + 120], [x - 50, y - h + 200]], { w: 14, color: C.red, key: 'lava' + i }); ink([[x + 20, y - h + 10], [x + 60, y - h + 140]], { w: 12, color: C.orange, key: 'lava2' + i }); } }
  woodSurface(-40, 860, W + 40, H + 40, 'vodesk', { fill: '#8a6a4a' });
  handText('Deccan Traps, India', 260, 960, 40, '#f4ecd9', { key: 'dtl', frac: ev(at(4.0), 0.6) });
}
function cVolcano(at) {
  title('Suspect 2: volcanoes', at(0.6));
  write('the Deccan Traps, India', CL, 400, 48, at(1.4));
  write('lava and gases, for ages', CL, 520, 46, at(4.0));
  write('how much did they help?', CL, 720, 50, at(9.6), { color: CH.accent, weight: 700 });
  write('scientists still debate it', CL, 800, 40, at(10.4));
}

// ---- 8. the hush: one feather in the dark
function sHush() { fillAll('#1b1410'); const P = [[480, 380], [520, 470], [540, 600], [500, 700], [470, 600], [460, 470]]; paint(P, { fill: '#e8dcc4', key: 'feather', w: 3, tex: [{ k: 'hatch', c: 'rgba(58,36,23,0.4)', al: 0.5, gap: 5, a: 0.4 }] }); ink([[500, 360], [495, 720]], { w: 3, key: 'quill' }); }

// ---- 9. the twist: birds are dinosaurs
function sBirds() {
  paperSheet('bd');
  for (let i = 0; i < 20; i++) { const R = RNG('fth', i), x = R.r(0, 980), y = mod(R.r(0, 1080) + (TT - HIT) * R.r(40, 90), 1120) - 20; ink([[x, y], [x + 10, y + 26]], { w: 4, color: '#b8a888', key: 'fl' + i }); }
  trex(330, 800, 1.0, 'bt', { fill: '#cdd8c0' });
  if (TT > at(3.0)) { const k = ev(at(3.0), 0.8); ink([[460, 560], [lerp(460, 640, k), lerp(560, 640, k)]], { w: 6, color: C.red, key: 'arr' }); if (k > 0.9) ink([[612, 616], [640, 640], [608, 650]], { w: 6, color: C.red, key: 'arrh' }); }
  if (TT > at(3.6)) bird(760, 700, 1.2, 'chick', { c: '#f0e2c4', tail: '#c9a46a', comb: true });
  if (TT > at(9.0)) { bird(640, 280, 0.6, 'pig', { c: '#9aa3ad' }); bird(850, 380, 0.5, 'spar', { c: '#b98a5a', tail: '#8a6a4a' }); }
}
function cBirds(at) {
  title('Not every dinosaur died', at(0.4));
  bigNum('birds = dinosaurs', null, CCX, 470, at(3.6), CH.accent, 84);
  write('small ground birds survived', CL, 660, 46, at(5.4));
  write('pigeons, chickens, sparrows...', CL, 820, 44, at(9.0));
}

// ---- 10. the end: the case file is stamped; a bird on the window sill
function sEnd() {
  paperSheet('en');
  woodSurface(-40, 760, W + 40, H + 40, 'endesk');
  paint(rrectPts(120, 360, 520, 400, 8), { fill: '#e8c88a', key: 'folder', w: 4, tex: [{ k: 'pencil', c: '#c9a46a', al: 0.4, per: 120 }] });
  handText('CASE: K-Pg', 160, 440, 46, C.ink, { key: 'ftxt', weight: 700 });
  strata(170, 480, 590, 700, 590, 'ens');
  stamp('CLOSED', 380, 620, at(1.4), C.red, { size: 72, rot: -0.18 });
  paint(rrectPts(700, 160, 260, 300, 6), { fill: '#cfe2ee', key: 'win', w: 5, tex: [{ k: 'pencil', c: '#ffffff', al: 0.5, per: 80 }] }); ink([[830, 160], [830, 460]], { w: 5, key: 'wm1' }); ink([[700, 310], [960, 310]], { w: 5, key: 'wm2' });
  if (TT > at(8.4)) bird(830, 420, 0.7, 'endb', { c: '#9aa3ad' });
  detective(560, 300, 50, { mood: TT > at(8.4) ? 'happy' : 'smile', glass: false });
}
function cEnd(at) {
  title('Case closed', at(0.6));
  write('an asteroid...', CL, 400, 50, at(1.4), { weight: 700 });
  write('...maybe helped by volcanoes', CL, 490, 44, at(4.4));
  write('say hello to a dinosaur', CL, 700, 52, at(8.4), { color: CH.accent, weight: 700 });
}
