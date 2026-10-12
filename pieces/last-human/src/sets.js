
// =====================================================================
//  SETS — the places that recur: the observation deck, the galley, Titan outside, the corridor, the cold-sleep bay,
//  the archive, the solar system. Each takes options so the same place can change across the story.
// =====================================================================

// ---- Titan seen through glass: haze bands, a dim red Sun, hills, methane drizzle on the glass
function titanSky(x0, y0, w, h, key, o = {}) {
  const bands = o.warm ? ['#e7a24e', '#df9140', '#d07c34', '#b9662a'] : ['#d98a3d', '#c97a35', '#b4692d', '#985524'];
  bands.forEach((c, i) => cut(rect(x0 - 20, y0 + i * h / 4 - 10, w + 40, h / 4 + 30, 0), c, { key: key + 'bd' + i, shadow: false, tear: 2, shade: false, grain: 0.5 }));
  if (o.sun !== false) { const sx = x0 + w * (o.sunX ?? 0.65), sy = y0 + h * (o.sunY ?? 0.32), sr = o.sunR ?? Math.min(w, h) * 0.13; glow(sx, sy, sr, '#ff6a3a', 0.25); cut(ellipsePts(sx, sy, sr, sr, 0, 36), 'rgba(200,50,43,0.75)', { key: key + 'sun', shadow: false, grain: 0.4 }); }
  if (o.saturn) planet(x0 + w * 0.25, y0 + h * 0.25, Math.min(w, h) * 0.09, 'saturn', key + 'sat', { sb: 0 });
  cut([[x0 - 20, y0 + h * 0.78], [x0 + w * 0.2, y0 + h * 0.7], [x0 + w * 0.45, y0 + h * 0.76], [x0 + w * 0.7, y0 + h * 0.66], [x0 + w + 20, y0 + h * 0.74], [x0 + w + 20, y0 + h + 20], [x0 - 20, y0 + h + 20]], COL.hazeD, { key: key + 'hill', shadow: false, pat: pat.dots('rgba(255,200,140,0.15)', 4, 30) });
  if (o.lake) cut(ellipsePts(x0 + w * 0.55, y0 + h * 0.86, w * 0.22, h * 0.05, 0, 30), o.lakeC ?? '#5a3a2a', { key: key + 'lake', shadow: false, grain: 0.3 });
}
function drizzle(x0, y0, w, h, key, n = 60) {
  const R = RNG('dz', key);
  ctx.strokeStyle = 'rgba(255,230,190,0.45)'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i < n; i++) { const x = x0 + R.r(0, w), sp = R.r(60, 140), y = y0 + mod(R.r(0, h) + TT * sp, h); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 26); }
  ctx.stroke();
}

// ---- the observation deck. o: view ('titan' | 'sun' | 'dark'), photos (0..2: none, the old photos, + the white Earth),
//      chairs, console, dim (0..1: shut-down lights), clock
function deck(key, o = {}) {
  const dim = o.dim ?? 0;
  wallFill(mixHex(COL.steel, '#232833', dim * 0.7), key + 'w', pat.lines('rgba(255,255,255,0.05)', 90));
  // wall panels and pipes
  for (let i = 0; i < 6; i++) cut(rect(40 + i * 310, 90, 270, 660, 12), mixHex(COL.panel, '#2c313b', dim * 0.7), { key: key + 'pn' + i, sb: 6, pat: pat.lines('rgba(255,255,255,0.05)', 40) });
  cut(capsulePts(-40, 70, W + 40, 70, 30), '#4a5262', { key: key + 'pipe', sb: 4 });
  // the viewport
  const vx = o.vx ?? 1220, vy = o.vy ?? 420, vr = o.vr ?? 330;
  cut(ellipsePts(vx, vy, vr + 40, vr + 40, 0, 60), '#2a2f3a', { key: key + 'vr', sb: 16 });
  const V = ellipsePts(vx, vy, vr, vr, 0, 60);
  ctx.save(); trace(V, true); ctx.clip();
  if (o.view === 'sun') { spaceWall(key + 'vs', COL.spaceD); sun(vx + 40, vy + 30, vr * 0.75, 'giant', key + 'vsun'); }
  else if (o.view === 'dark') { spaceWall(key + 'vd', COL.spaceD); }
  else { titanSky(vx - vr, vy - vr, vr * 2, vr * 2, key + 'vt', { warm: o.warm, saturn: o.saturn, lake: true, sunR: o.sunR }); drizzle(vx - vr, vy - vr, vr * 2, vr * 2, key + 'dz'); }
  if (o.inView) o.inView(vx, vy, vr);
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.ellipse(vx - vr * 0.4, vy - vr * 0.45, vr * 0.2, vr * 0.5, 0.6, 0, TAU); ctx.fill();
  ctx.restore();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; dot(vx + Math.cos(a) * (vr + 22), vy + Math.sin(a) * (vr + 22), 7, '#8a919e'); }
  // red light from the window on the wall
  if (o.view === 'sun' || o.redLight) { ctx.fillStyle = `rgba(200,50,43,${0.10 + 0.04 * Math.sin(TT * 0.7)})`; ctx.fillRect(0, 0, W, H); }
  // photos on the wall
  if (o.photos) {
    photo(250, 330, 170, 120, key + 'ph1', (w, h) => { ctx.fillStyle = COL.ocean; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#cfe2ee'; ctx.fillRect(0, 0, w, h * 0.45); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, h * 0.5, w, 4); }, { rot: -0.05 });
    photo(470, 300, 150, 110, key + 'ph2', (w, h) => { ctx.fillStyle = '#cfe2ee'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = COL.land; ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w * 0.3, h * 0.4); ctx.lineTo(w * 0.6, h * 0.7); ctx.lineTo(w, h * 0.35); ctx.lineTo(w, h); ctx.fill(); }, { rot: 0.04 });
    if (o.photos > 1) photo(360, 520, 160, 120, key + 'ph3', (w, h) => { ctx.fillStyle = '#fbfbf6'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.arc(w / 2, h / 2, h * 0.18, 0, TAU); ctx.fill(); }, { rot: -0.02, pin: '#3f9f9a' });
  }
  if (o.clock) { cut(rect(560, 170, 180, 80, 10), '#1d2229', { key: key + 'clk' }); monoText(o.clockStr ?? '06:14', 585, 228, 48, '#7be3c8', { key: key + 'clkt', jit: 0.3 }); }
  // the floor
  cut([[-40, 840], [W + 40, 840], [W + 40, H + 40], [-40, H + 40]], mixHex(COL.floor, '#15181e', dim * 0.6), { key: key + 'fl', sy: -4, pat: pat.lines('rgba(255,255,255,0.05)', 30) });
  // blinking status lights (small life)
  for (let i = 0; i < 8; i++) { const on = (B + i * 5) % (13 + i) < 6 && dim < 0.95; dot(80 + i * 34, 780, 7, on ? (i % 3 ? '#7be3a0' : '#f6cf55') : '#3a3f4a'); }
  if (o.console !== false) {
    cut([[1600, 840], [1640, 640], [1880, 640], [1900, 840]], '#2a2f3a', { key: key + 'cs' });
    cut(rect(1650, 520, 220, 130, 10), COL.screen, { key: key + 'csc', sb: 4 }); for (let i = 0; i < 4; i++) cut(rect(1670, 545 + i * 24, 80 + ((B + i) % 5) * 22, 10, 2), 'rgba(123,227,200,0.6)', { key: key + 'csl' + i, shadow: false, grain: false });
  }
  if (o.chairs) for (let i = 0; i < 3; i++) chair(260 + i * 210, 1000, 0.85, key + 'ch' + i, ['#7d8797', '#6b7586', '#8a919e'][i]);
}

// ---- the galley: counter, kettle, the 6:14 clock, a small window, cups, a hydroponic plant
function galley(key, o = {}) {
  wallFill('#4a5262', key + 'w', pat.gingham('rgba(255,255,255,0.04)', 26));
  cut(rect(160, 120, 420, 300, 16), '#2a2f3a', { key: key + 'win', sb: 10 });
  ctx.save(); trace(rect(180, 140, 380, 260, 10), true); ctx.clip(); titanSky(180, 140, 380, 260, key + 'ts', { sunR: 26 }); drizzle(180, 140, 380, 260, key + 'dz', 30); ctx.restore();
  // the clock: 6:14
  cut(ellipsePts(1210, 250, 120, 120, 0, 40), '#2a2f3a', { key: key + 'co' });
  clock(1210, 250, 104, 6, 14, key + 'clk');
  label('06:14', 1210, 420, 40, o.clockT ?? -1, { rot: 0.02 });
  // shelf with cups
  cut(rect(700, 300, 360, 22, 4), '#7d8797', { key: key + 'sh' });
  for (let i = 0; i < 4; i++) mug(750 + i * 85, 236, 0.5, [COL.cup, '#cfd6de', COL.cup, '#d9cbb4'][i], key + 'cupS' + i, false);
  plant(1560, 640, 1.0, '#5a6577', key + 'pl');
  // counter
  cut(rect(-40, 640, W + 80, 60, 6), '#8a919e', { key: key + 'ct', pat: pat.lines('rgba(255,255,255,0.12)', 18) });
  cut(rect(-40, 690, W + 80, 420, 0), '#3e4655', { key: key + 'cb', sy: -4, pat: pat.stripes('rgba(255,255,255,0.05)', 6, 160) });
  for (let i = 0; i < 5; i++) cut(rect(60 + i * 380, 740, 340, 300, 10), '#4a5262', { key: key + 'cab' + i, sb: 4 });
}

// ---- Titan outside: the station Halcyon on the hydrocarbon dunes. o: lit (windows lit, 0..1), saturn, warm, lake, beacon
function titanOutside(key, o = {}) {
  titanSky(-20, -20, W + 40, H + 40, key, { warm: o.warm, saturn: o.saturn !== false, sunX: 0.78, sunY: 0.2, sunR: 120, lake: o.lake, lakeC: o.lakeC });
  if (o.station !== false) halcyon(o.hx ?? 960, o.hy ?? 760, o.hs ?? 1, key + 'hal', o);
  cut([[-40, 900], [400, 870], [900, 905], [1400, 875], [W + 40, 900], [W + 40, H + 40], [-40, H + 40]], '#7a4420', { key: key + 'gr', sy: -4, pat: pat.dots('rgba(255,190,120,0.18)', 3, 22) });
  drizzle(0, 0, W, H, key + 'dz', 90);
}
function halcyon(x, y, s, key, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(capsulePts(-520, 40, 520, 40, 120, 10), '#8a919e', { key: key + 'base', pat: pat.lines('rgba(0,0,0,0.08)', 24) });
  cut(ellipsePts(0, -60, 260, 190, 0, 40, Math.PI, TAU).concat([[260, -40], [-260, -40]]), '#b9bfc8', { key: key + 'dome', pat: pat.lines('rgba(0,0,0,0.06)', 30) });
  cut(ellipsePts(-380, -10, 130, 100, 0, 30, Math.PI, TAU).concat([[130, 0].map((v, i) => i ? -10 : -250), [-510, -10]]), '#a3aab4', { key: key + 'd2' });
  cut(ellipsePts(390, -10, 120, 90, 0, 30, Math.PI, TAU).concat([[510, -10], [270, -10]]), '#a3aab4', { key: key + 'd3' });
  // the antenna and its beacon
  cut(capsulePts(140, -220, 170, -470, 16), '#5a6577', { key: key + 'ant' });
  cut(ellipsePts(170, -480, 60, 20, -0.3, 18), '#d8d4cc', { key: key + 'dish' });
  if (o.beacon !== false) beaconRings(170, -480, key + 'bc', 0, { r: 500 });
  // windows: three hundred places, now one lit
  const lit = o.lit ?? 1;
  for (let i = 0; i < 30; i++) { const wx = -480 + i * 33, wy = 20; dot(wx, wy, 9, i === 17 ? '#ffd27a' : `rgba(40,45,55,${1 - lit * 0})`); }
  for (let i = 0; i < 12; i++) { const a = Math.PI + (i + 0.5) / 12 * Math.PI; dot(Math.cos(a) * 200, -60 + Math.sin(a) * 130, 8, '#2a2f3a'); }
  if (o.winGlow !== false) glow(-480 + 17 * 33, 20, 26, '#ffd27a', 0.5);
  ctx.restore();
}

// ---- the corridor: one-point perspective, doors with names. o: dark (0..1), walk (you walking)
const CABIN_NAMES = ['A. OKAFOR', 'M. LINDQVIST', 'R. TANAKA', 'S. ABARA', 'J. MORALES', 'L. CHEN', 'K. NAIR', 'D. VOSS'];
function corridor(key, o = {}) {
  const dark = o.dark ?? 0, vp = [960, 470];
  wallFill(mixHex('#3e4655', '#14171d', dark), key + 'w');
  cut([[0, 0], [W, 0], [vp[0] + 160, vp[1] - 110], [vp[0] - 160, vp[1] - 110]], mixHex('#4a5262', '#1a1d24', dark), { key: key + 'ceil', shadow: false });
  cut([[0, H], [W, H], [vp[0] + 160, vp[1] + 110], [vp[0] - 160, vp[1] + 110]], mixHex('#2f3542', '#111318', dark), { key: key + 'flo', shadow: false, pat: pat.lines('rgba(255,255,255,0.05)', 40) });
  cut(rect(vp[0] - 160, vp[1] - 110, 320, 220, 4), mixHex('#232833', '#090a0d', dark), { key: key + 'end', shadow: false });
  // doors along both walls, nearer = bigger
  for (let i = 0; i < 4; i++) {
    const k = 1 - i * 0.22, dxL = lerp(vp[0] - 160, 0, k) + 40 * k, dw = 150 * k, dh = 420 * k, dy = lerp(vp[1], H * 0.5, k) - dh * 0.55;
    for (const side of [-1, 1]) {
      const x = side < 0 ? dxL : W - dxL - dw;
      cut(rect(x, dy, dw, dh, 6), mixHex('#6b7586', '#2a2e36', dark), { key: key + 'd' + i + side, sb: 6 });
      tag(CABIN_NAMES[i * 2 + (side > 0 ? 1 : 0)], x + dw / 2, dy + dh * 0.22, 22 * k + 6, { rot: 0.01 * side, tape: false, fill: '#e8e2d4' });
    }
  }
  // ceiling lights
  for (let i = 0; i < 5; i++) { const k = 1 - i * 0.18, y = lerp(vp[1] - 110, 30, k); const on = dark < 0.5 || i === 0; cut(rect(vp[0] - 120 * k - 60, y, 240 * k + 120, 14 * k + 6, 4), on ? '#fff2c8' : '#3a3f4a', { key: key + 'lt' + i, shadow: false, grain: false }); if (on && dark < 0.5) glow(vp[0], y + 10, 90 * k + 30, '#fff2c8', 0.2); }
}

// ---- the cold-sleep bay: a pod with a glass lid. o: open (0..1), frost (0..1), sleeping (you inside), years (counter)
function podBay(key, o = {}) {
  wallFill('#2d3a48', key + 'w', pat.lines('rgba(255,255,255,0.04)', 70));
  for (let i = 0; i < 3; i++) cut(rect(120 + i * 600, 120, 480, 300, 14), '#34445a', { key: key + 'pn' + i, sb: 6 });
  cut([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], '#1f2732', { key: key + 'fl', sy: -4 });
  // the pod
  cut(rect(460, 660, 1000, 200, 30), '#8a919e', { key: key + 'base', pat: pat.lines('rgba(0,0,0,0.08)', 30) });
  if (o.sleeping) you(700, 640, { s: 0.85, pose: 'lie', mood: 'focus', key: key + 'you', grey: o.grey });
  const op = o.open ?? 0;
  ctx.save(); ctx.translate(460, 660); ctx.rotate(-op * 0.5);
  ctx.fillStyle = `rgba(190,225,240,${0.35 + 0.4 * (o.frost ?? 0)})`; ctx.beginPath(); ctx.ellipse(500, 0, 500, 170, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = '#d8d4cc'; ctx.lineWidth = 12; ctx.stroke();
  if (o.frost) { const R = RNG('fr', key); for (let i = 0; i < 40 * o.frost; i++) sparkle(R.r(80, 920), -R.r(10, 150), R.r(4, 12), 'rgba(255,255,255,0.85)'); }
  ctx.restore();
  // its display
  cut(rect(1520, 520, 280, 170, 12), '#1d2229', { key: key + 'disp' });
  monoText('YEARS', 1550, 575, 34, '#7be3c8', { key: key + 'yl', jit: 0.3 });
  monoText(String(o.years ?? 0).padStart(3, '0'), 1550, 660, 72, '#7be3c8', { key: key + 'yv', jit: 0.3 });
  for (let i = 0; i < 6; i++) dot(520 + i * 40, 790, 7, (B + i * 3) % 12 < 6 ? '#7be3a0' : '#3a3f4a');
}

// ---- the archive: shelves of everything, the transmitter core, a desk and microphone. o: rec (recording), dim
function archive(key, o = {}) {
  wallFill('#33302c', key + 'w', pat.stripes('rgba(255,255,255,0.03)', 8, 120));
  const cols = ['#b85c4a', '#4c6fb5', '#d9a441', '#5aa05a', '#8c7ad8', '#3f9f9a', '#e6cf98'];
  for (let sh = 0; sh < 4; sh++) {
    cut(rect(60, 180 + sh * 170, 560, 18, 3), '#7a5a3a', { key: key + 's' + sh });
    cut(rect(1300, 180 + sh * 170, 560, 18, 3), '#7a5a3a', { key: key + 't' + sh });
    const R = RNG('bk', key, sh);
    for (let i = 0; i < 12; i++) { const w = R.r(26, 40), h = R.r(90, 140); cut(rect(70 + i * 45, 180 + sh * 170 - h, w, h, 3), cols[(i + sh) % 7], { key: key + 'b' + sh + '_' + i, sb: 3, sy: 2, grain: 0.3, pat: pat.stripes('rgba(255,255,255,0.25)', 4, 1000) }); }
    for (let i = 0; i < 6; i++) cut(ellipsePts(1350 + i * 85, 180 + sh * 170 - 45, 38, 38, 0, 20), '#2a2f3a', { key: key + 'r' + sh + i, sb: 3 });
  }
  // the transmitter pillar, its lights running
  cut(rect(820, 80, 280, 820, 20), '#2a2f3a', { key: key + 'pil' });
  for (let i = 0; i < 18; i++) { const on = (B + i) % 9 < 4; cut(rect(860, 120 + i * 40, 200, 16, 4), on ? 'rgba(123,227,200,0.85)' : 'rgba(123,227,200,0.2)', { key: key + 'pl' + i, shadow: false, grain: false }); }
  beaconRings(960, 60, key + 'bc', 0, { r: 500, n: 3 });
  cut([[-40, 900], [W + 40, 900], [W + 40, H + 40], [-40, H + 40]], '#221f1c', { key: key + 'fl', sy: -4 });
  if (o.desk) {
    cut(rect(520, 760, 880, 40, 6), '#7a5a3a', { key: key + 'desk' });
    cut(capsulePts(1180, 760, 1180, 640, 10), '#2a2f3a', { key: key + 'mst' });
    cut(capsulePts(1160, 630, 1200, 590, 40), '#3a3f4a', { key: key + 'mic', pat: pat.gingham('rgba(255,255,255,0.15)', 6) });
    if (o.rec) { const on = (B % 24) < 14; dot(1300, 700, 16, on ? '#f05a5a' : '#5a2a2e'); label('REC', 1360, 700, 30, -1, { tape: false }); }
  }
}

// ---- the solar system: the Sun at (sx, sy) and planets on orbits. list: [[kind, orbitR, angle0, r]]; o.k: orbit scale
function system(key, sx, sy, sunR, sunKind, list, o = {}) {
  spaceWall(key);
  for (const [kind, orb, a0, r, opt] of list) {
    const R = orb * (o.k ?? 1);
    ctx.strokeStyle = 'rgba(255,246,220,0.18)'; ctx.lineWidth = 2; ctx.setLineDash([8, 10]); ctx.beginPath(); ctx.ellipse(sx, sy, R, R * (o.tilt ?? 0.32), 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  }
  if (sunR > 0) sun(sx, sy, sunR, sunKind, key + 'sun');
  for (const [kind, orb, a0, r] of list) { const R = orb * (o.k ?? 1), a = a0 + TT * (o.spin ?? 0.02) * 300 / Math.max(80, orb); planet(sx + Math.cos(a) * R, sy + Math.sin(a) * R * (o.tilt ?? 0.32), r, kind, key + kind); }
}
