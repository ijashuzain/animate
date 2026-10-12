
// =====================================================================
//  SCENES + CARDS — Why is the sky blue? Left: the scene (x 0..~990). Right: the card.
//  Colour means one thing: blue = the scattered light. Ray (the sunbeam) is warm white.
// =====================================================================
const RAINBOW7 = ['#e0503a', '#f08a4b', '#f6cf55', '#5aa05a', '#3b78d6', '#8c5ad8'];
const BLUE = '#3b78d6';
// ---- Ray: a warm-white sunbeam with a face
function ray(x, y, r, o = {}) {
  const key = o.key ?? 'ray', sc = o.s ?? 1; if (sc <= 0.01) return; r *= sc;
  y += Math.sin(TT * TAU * 0.8 + key.length) * r * 0.05;
  glowC(x, y, r * 0.9, '#fff2c8', 0.5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + Math.sin(TT * 1.6) * 0.06; cut(capsulePts(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.26), '#fff6dc', { key: key + 'r' + i, sb: 6, grain: 0.4, crayon: '#f6cf55', crAl: 0.3 }); }
  cut(ellipsePts(x, y, r * 0.55, r * 0.55, 0, 30), '#fffaf0', { key: key + 'b', crayon: '#f6cf55', crAl: 0.25, grain: 0.4 });
  let mood = o.mood ?? 'smile'; if (mood !== 'happy' && mood !== 'focus' && (B + key.length * 3) % 41 < 2) mood = 'focus';
  face(x, y + r * 0.04, r / 64, mood);
  SPARK_AT = toScreen(x, y);
}
// a colour sibling: a little light dot with a face
function kid(x, y, r, c, key, mood = 'smile') { y += Math.sin(TT * 2.6 + key.length * 1.7) * r * 0.25; x += Math.cos(TT * 1.9 + key.length) * r * 0.12; glowC(x, y, r, c, 0.3); cut(ellipsePts(x, y, r, r, 0, 22), c, { key, sb: 5, grain: 0.4 }); face(x, y + r * 0.08, r / 40, mood); }
function skyBands(cols, key) { cols.forEach((c, i) => cut(rect(-30, -30 + i * (1140 / cols.length), W + 60, 1140 / cols.length + 40, 0), c, { key: key + i, shadow: false, tear: 2, shade: false, grain: 0.5 })); }
function meadow(key, c = '#5aa05a') {
  cut([[-40, 800], [300, 760], [650, 790], [1050, 750], [W + 40, 790], [W + 40, H + 40], [-40, H + 40]], c, { key: key + 'g', sy: -4, pat: pat.stripes('rgba(255,255,255,0.1)', 4, 22, 0.3) });
  for (let i = 0; i < 7; i++) { const x = 80 + i * 140, y = 860 + (i % 2) * 60; ink([[x, y], [x, y - 40]], { w: 5, color: '#3d7c46', key: key + 'st' + i }); for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; cut(ellipsePts(x + Math.cos(a) * 12, y - 44 + Math.sin(a) * 12, 10, 7, a, 10), ['#ffffff', PAL.yellow, PAL.pink][i % 3], { key: key + 'pt' + i + p, sb: 2, grain: false }); } }
}
function lyingKid(x, y, key, mood = 'smile') {   // a child lying on the grass, looking up
  cut(capsulePts(x - 40, y, x + 200, y + 10, 64), PAL.teal, { key: key + 'b', pat: pat.stripes('rgba(255,255,255,0.18)', 8, 26) });
  cut(capsulePts(x + 190, y + 10, x + 330, y + 4, 40), PAL.blue, { key: key + 'l' });
  cut(capsulePts(x + 40, y - 20, x + 10, y - 90, 26), PAL.teal, { key: key + 'a' });
  cut(ellipsePts(x - 100, y - 10, 60, 56, 0, 24), PAL.skin2, { key: key + 'h' });
  cut([[x - 160, y - 10], [x - 150, y - 60], [x - 100, y - 70], [x - 60, y - 54], [x - 90, y - 40]], '#2b211d', { key: key + 'hr', sb: 3 });
  face(x - 96, y - 14, 0.9, mood);
}
function cloud(x, y, s, key) { [[0, 0, 70, 34], [50, -16, 56, 34], [-50, -6, 50, 28]].forEach(([dx, dy, rx, ry], i) => cut(ellipsePts(x + dx * s, y + dy * s, rx * s, ry * s, 0, 18), '#ffffff', { key: key + i, sb: 6, grain: 0.3 })); }
function bird(x, y, key) { const f = Math.sin(TT * 8 + key.length) * 10; ink([[x - 20, y + f * 0.4], [x, y + 8], [x + 20, y + f * 0.4]], { w: 4, color: '#2a3a4a', key }); }
function swatch(x, y, w, h, c, t, key, lab) { popAt(t, x, y, () => { cut(rect(-w / 2, -h / 2, w, h, 8), c, { key, sb: 6 }); if (lab) handText(lab, -handW(lab, 34) / 2, h / 2 + 44, 34, PAL.ink, { key: key + 'l' }); }); }

// ---- 1. the hook: a blue sky, then a sunset
function sHook(o = {}) {
  const u = o.blue ? 0 : sm(TT, at(6.0), at(8.0));
  skyBands([mixHex('#7fb3e6', '#3a3a6a', u), mixHex('#9cc6ee', '#c86a5a', u), mixHex('#bcdaf3', '#f08a4b', u), mixHex('#d8eaf8', '#f6cf55', u)], 'hk');
  const sx = 760, sy = lerp(200, 700, u);
  glowC(sx, sy, 60, u > 0.5 ? '#ffb070' : '#fff2c8', 0.6); cut(ellipsePts(sx, sy, 56, 56, 0, 24), u > 0.5 ? '#ffb070' : '#fff6dc', { key: 'hkSun', shadow: false });
  cloud(mod(240 + TT * 22, 1200) - 100, 230, 1, 'hkc1'); cloud(mod(600 + TT * 15, 1200) - 100, 140, 0.7, 'hkc2');
  for (let i = 0; i < 4; i++) bird(mod(TT * 60 + i * 50, 1300) - 150, 320 - i * 18 + Math.sin(TT + i) * 10, 'hkb' + i);
  const bf = [mod(TT * 40, 1100) - 50, 640 + Math.sin(TT * 3) * 40]; cut(ellipsePts(bf[0] - 10, bf[1], 16, 10 * Math.abs(Math.sin(TT * 9)) + 3, 0.4, 10), PAL.yellow, { key: 'bfl', shadow: false }); cut(ellipsePts(bf[0] + 10, bf[1], 16, 10 * Math.abs(Math.sin(TT * 9)) + 3, -0.4, 10), PAL.yellow, { key: 'bfr', shadow: false });
  meadow('hk', mixHex('#5aa05a', '#3a5a3a', u));
  lyingKid(330, 860 + Math.sin(TT * 1.2) * 4, 'hkk', u > 0.3 && u < 1 ? 'wow' : (B % 50 < 3 ? 'focus' : 'smile'));
}
function cHook(at) {
  title('Why is the sky blue?', at(0.8));
  swatch(CL + 170, 420, 300, 200, '#7fb3e6', at(2.0), 'sw1', 'midday');
  swatch(CR - 170, 420, 300, 200, '#e9894b', at(6.4), 'sw2', 'sunset');
  write('same sky. same Sun.', CL, 740, 54, at(8.4));
  popAt(at(9.6), CCX, 870, () => handText('?', -30, 40, 130, PAL.orangeD, { key: 'q', weight: 700 }));
}

// ---- 2. white light is every colour: a prism
function sWhite() {
  wallC('#26315f', pat.dots('rgba(255,225,170,0.06)', 4, 70));
  ray(160, 420, 90, { key: 'rayW', mood: TT >= at(4.0) ? 'wow' : 'smile' });
  const f = ev(at(1.8), 1.2);
  if (f > 0) { ctx.fillStyle = 'rgba(255,250,235,0.85)'; ctx.beginPath(); ctx.moveTo(240, 400); ctx.lineTo(lerp(240, 470, f), lerp(400, 500, f)); ctx.lineTo(lerp(240, 470, f), lerp(440, 520, f)); ctx.lineTo(240, 440); ctx.fill(); }
  cut([[540, 300], [700, 640], [380, 640]], 'rgba(220,235,250,0.75)', { key: 'prism', line: '#ffffff', lw: 5 });
  const g = ev(at(4.0), 1.2);
  if (g > 0) RAINBOW7.forEach((c, i) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(610, 520 + i * 6); ctx.lineTo(610 + 360 * g, 420 + i * 60 * g); ctx.lineTo(610 + 360 * g, 420 + (i + 1) * 60 * g); ctx.lineTo(610, 526 + i * 6); ctx.fill(); ctx.globalAlpha = 1; });
  if (TT >= at(5.5)) RAINBOW7.forEach((c, i) => kid(900 + Math.sin(TT * 2 + i) * 8, 450 + i * 60, 22, c, 'kw' + i, 'happy'));
  floorC(820, '#1d2448', 'flW');
}
function cWhite(at) {
  title('White light = all colours', at(0.8));
  popAt(at(2.0), CL + 90, 450, () => { glowC(0, 0, 60, '#fff2c8', 0.5); dot(0, 0, 50, '#fffaf0'); });
  write('=', CL + 190, 480, 90, at(2.6));
  RAINBOW7.forEach((c, i) => popAt(at(3.0 + i * 0.15), CL + 330 + i * 75, 450, () => dot(0, 0, 32, c)));
  write('a prism splits them apart', CL, 680, 50, at(5.0));
  write('Isaac Newton, 1660s', CL, 770, 46, at(7.0), { color: PAL.orangeD });
}

// ---- 3. colours are waves: red long, blue short
function waveLine(y, len, amp, c, t, key, w = 10) { const f = ev(t, 1.0); if (f <= 0) return; const P = []; for (let x = 60; x <= 940; x += 6) P.push([x, y + Math.sin((x - TT * 220) / len * TAU) * amp]); ink(P, { w, color: c, frac: f, key, raw: true }); }
function sWaves() {
  wallC('#f3ead6', pat.lines('rgba(90,130,190,0.12)', 50));
  waveLine(330, 300, 70, '#e0503a', at(1.8), 'wr');
  waveLine(700, 160, 50, BLUE, at(4.6), 'wb');
  kid(80 + mod((TT - at(1.8)) * 220, 900), 330 + Math.sin((80 + mod((TT - at(1.8)) * 220, 900) - TT * 220) / 300 * TAU) * 70, 30, '#e0503a', 'kr', 'focus');
  if (TT >= at(4.6)) { const x = 80 + mod((TT - at(4.6)) * 220, 900); kid(x, 700 + Math.sin((x - TT * 220) / 160 * TAU) * 50, 30, BLUE, 'kb', 'wow'); }
  label('long, lazy', 260, 200, 44, at(2.6)); label('short, choppy', 260, 560, 44, at(5.4));
}
const label = (s, x, y, sz, t) => { const k = popS(t); if (k > 0) tag(s, x, y, sz, { s: k, tape: false, rot: -0.02 }); };
function cWaves(at) {
  title('Colours are waves', at(0.8));
  const wv = (y, len, c, t, key) => { const f = ev(t, 0.8); if (f <= 0) return; const P = []; for (let x = CL; x <= CR; x += 5) P.push([x, y + Math.sin((x - CL) / len * TAU) * 34]); ink(P, { w: 7, color: c, frac: f, key, raw: true }); };
  wv(360, 170, '#e0503a', at(2.0), 'cr'); write('red: ~700 nanometres', CL, 450, 42, at(2.6));
  wv(600, 110, BLUE, at(4.8), 'cb'); write('blue: ~450 nanometres', CL, 690, 42, at(5.4));
  write('a nanometre = a millionth of a millimetre', CL, 860, 34, at(8.0), { color: PAL.orangeD });
}

// ---- 4. the air scatters blue
const MOLS = (() => { const R = RNG('mols'), M = []; for (let i = 0; i < 26; i++) M.push([R.r(330, 950), R.r(120, 900)]); return M; })();
function molecule(x, y, key, i) { const a = TT * 0.8 + i; for (const d of [-1, 1]) cut(ellipsePts(x + Math.cos(a) * 12 * d, y + Math.sin(a) * 12 * d, 13, 13, 0, 12), i % 4 ? '#9fb8d0' : '#d0a0a0', { key: key + d, sb: 3, grain: false }); }
function sAir() {
  wallC('#cfe2ee', pat.dots('rgba(255,255,255,0.4)', 4, 50));
  MOLS.forEach(([x, y], i) => molecule(x + Math.sin(TT + i) * 8, y + Math.cos(TT * 0.8 + i) * 8, 'm' + i, i));
  ray(120, 520, 80, { key: 'rayA', mood: 'focus' });
  // red goes straight through; blue bounces at random
  const t0 = at(4.0);
  for (let n = 0; n < 3; n++) { const u = mod((TT - t0) * 0.35 + n / 3, 1); if (TT < t0) break; kid(200 + u * 780, 420 + n * 90, 18, '#e0503a', 'ar' + n, 'smile'); }
  if (TT >= at(6.0)) for (let n = 0; n < 6; n++) { const R = RNG('bounce', n, Math.floor((TT - at(6.0)) * 1.2 + n * 0.37)); const p = mod((TT - at(6.0)) * 1.2 + n * 0.37, 1); const x0 = R.r(340, 900), y0 = R.r(150, 850), x1 = R.r(300, 960), y1 = R.r(100, 900); const x = lerp(x0, x1, p), y = lerp(y0, y1, p); ink([[lerp(x0, x1, Math.max(0, p - 0.25)), lerp(y0, y1, Math.max(0, p - 0.25))], [x, y]], { w: 4, color: 'rgba(59,120,214,0.45)', key: 'tr' + n }); kid(x, y, 18, BLUE, 'ab' + n, 'wow'); }
  label('nitrogen + oxygen', 640, 960, 40, at(2.0));
}
function cAir(at) {
  title('The air scatters blue', at(0.8));
  popAt(at(2.0), CCX, 470, () => { for (const d of [-1, 1]) cut(ellipsePts(d * 22, 0, 26, 26, 0, 16), '#9fb8d0', { key: 'cm' + d, sb: 3 }); });
  arrow(CL, 470, CCX - 70, 470, at(3.0), '#e0503a', 'cin'); arrow(CCX + 70, 470, CR, 470, at(4.0), '#e0503a', 'cout');
  [[-1.9], [-1.0], [-0.4], [0.6], [1.3], [2.2]].forEach(([a], i) => arrow(CCX + Math.cos(a) * 60, 470 + Math.sin(a) * 60, CCX + Math.cos(a) * 200, 470 + Math.sin(a) * 200, at(6.0 + i * 0.15), BLUE, 'cs' + i, 5));
  write('blue scatters about 5x', CL, 790, 48, at(8.0));
  write('more than red', CL, 860, 48, at(8.8), { color: PAL.orangeD });
}

// ---- 5. from every direction
function sEverywhere() {
  skyBands(['#5f9be0', '#7fb3e6', '#9cc6ee', '#bcdaf3'], 'ev');
  for (let n = 0; n < 14; n++) { const a = -Math.PI + n / 13 * Math.PI, k = mod(TT * 0.5 + n * 0.13, 1), r = lerp(560, 120, k); kid(330 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.9, 14, BLUE, 'ev' + n, 'happy'); }
  meadow('ev'); lyingKid(330, 860, 'evk', 'happy');
  cloud(700, 200, 0.8, 'evc');
}
function cEverywhere(at) {
  title('Blue from everywhere', at(0.8));
  popAt(at(2.0), CCX, 560, () => { cut(ellipsePts(0, 0, 90, 56, 0, 30), '#ffffff', { key: 'eye', line: PAL.ink, lw: 4 }); dot(0, 0, 32, '#3f9f9a'); dot(0, 0, 14, PAL.ink); });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; arrow(CCX + Math.cos(a) * 300, 560 + Math.sin(a) * 240, CCX + Math.cos(a) * 130, 560 + Math.sin(a) * 100, at(3.0 + i * 0.12), BLUE, 'ea' + i, 5); }
  write('so the whole sky glows', CL, 900, 50, at(5.0), { color: PAL.orangeD });
}

// ---- 6. why not violet?
function sViolet() {
  wallC('#c9b9da', pat.stripes('rgba(255,255,255,0.15)', 18, 60));
  kid(300, 480, 70, '#8c5ad8', 'kv', TT < at(6.0) ? 'smile' : 'sad');
  kid(650, 480, 70, BLUE, 'kbl', TT < at(6.0) ? 'smile' : 'happy');
  label('violet', 300, 340, 44, at(1.0)); label('blue', 650, 340, 44, at(1.0));
  // violet: fewer of them; the eye: less sensitive
  if (TT >= at(6.5)) { for (let i = 0; i < 2; i++) kid(240 + i * 120, 700, 26, '#8c5ad8', 'fv' + i, 'focus'); for (let i = 0; i < 5; i++) kid(560 + (i % 3) * 90, 680 + Math.floor(i / 3) * 80, 26, BLUE, 'fb' + i, 'happy'); }
  floorC(860, '#9a88b8', 'flV');
  for (let i = 0; i < 5; i++) { const k = mod(TT * 0.4 + i / 5, 1); sparkle(100 + i * 180, 860 - k * 700, 12 * (1 - k) + 4, 'rgba(255,255,255,0.8)'); }
}
function cViolet(at) {
  title('Why not violet?', at(0.8));
  write('violet scatters even more...', CL, 320, 46, at(2.0));
  [['the Sun sends less violet', 6.5], ['some is absorbed high up', 8.0], ['our eyes barely see it', 9.5]].forEach(([s, d], i) => { popAt(at(d), CL + 26, 470 + i * 120, () => cut(rect(-24, -24, 48, 48, 6), PAL.paper, { key: 'vb' + i, line: PAL.ink, lw: 4 })); write(s, CL + 80, 488 + i * 120, 46, at(d + 0.2)); check(CL + 10, 466 + i * 120, at(d + 0.6), 'vc' + i); });
  write('so we see blue', CL, 900, 54, at(11.0), { color: PAL.orangeD, weight: 700 });
}

// ---- 7. sunset: the long path
function sSunset() {
  skyBands(['#3a3a6a', '#7a4a7a', '#c86a5a', '#e9894b', '#f6c06b'], 'ss');
  glowC(820, 720, 90, '#ffb070', 0.6); cut(ellipsePts(820, 720, 80, 80, 0, 30), '#ff9a5a', { key: 'ssSun', shadow: false });
  // the light's long trip, losing blue along the way
  const P = [[800, 700], [560, 770], [330, 820]];
  ink(P, { w: 12, color: 'rgba(255,190,110,0.8)', frac: ev(at(3.0), 2.0), key: 'path' });
  for (let i = 0; i < 6; i++) { const t = at(4.0 + i * 0.8); if (TT < t) continue; const k = clamp((TT - t) / 2); kid(700 - i * 70 + k * 30, 740 + i * 12 - k * 400, 14, BLUE, 'lost' + i, 'wow'); }
  if (TT >= at(6.0)) [['#e0503a', 0], ['#f08a4b', 1]].forEach(([c, i]) => kid(lerp(760, 380, clamp((TT - at(6.0) - i * 0.4) / 3)), lerp(720, 800, clamp((TT - at(6.0) - i * 0.4) / 3)), 18, c, 'arr' + i, 'happy'));
  cut([[-40, 860], [300, 820], [700, 870], [W + 40, 840], [W + 40, H + 40], [-40, H + 40]], '#2a2a40', { key: 'ssHill', sy: -4 });
  lyingKid(330, 900, 'ssk', 'wow');
  for (let i = 0; i < 3; i++) bird(mod(TT * 50 + i * 60, 1300) - 150, 420 - i * 20, 'ssb' + i);
}
function cSunset(at) {
  title('Sunset: the long way', at(0.8));
  popAt(at(1.8), CCX, 900, () => { ctx.fillStyle = '#5aa05a'; ctx.beginPath(); ctx.arc(0, 520, 600, Math.PI * 1.25, Math.PI * 1.75); ctx.lineTo(0, 520); ctx.fill(); ctx.strokeStyle = 'rgba(59,120,214,0.5)'; ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(0, 520, 640, Math.PI * 1.22, Math.PI * 1.78); ctx.stroke(); });
  const me = [CCX, 845];
  arrow(CCX, 560, me[0], me[1] - 20, at(2.4), PAL.yellow, 'noon', 8); write('noon: short trip', CCX + 30, 640, 38, at(2.8));
  arrow(CL - 20, 740, me[0] - 20, me[1] - 10, at(3.6), '#e9894b', 'sunset', 8); write('sunset: long trip', CL, 700, 38, at(4.0), { color: PAL.orangeD });
  write('blue gets scattered away', CL, 330, 46, at(5.5));
  write('reds and oranges get through', CL, 400, 46, at(7.0), { color: PAL.orangeD });
}

// ---- 8. the hush: dusk falls; 9. Mars: the other way around
function sHush() { skyBands(['#1d1a33', '#2a2440', '#3a2a3a', '#4a3040'], 'hu'); cut([[-40, 860], [300, 820], [700, 870], [W + 40, 840], [W + 40, H + 40], [-40, H + 40]], '#141420', { key: 'huHill', sy: -4 }); starsC('hu', 60, 600); }
function sMars() {
  const u = sm(TT, at(5.0), at(8.0));
  skyBands([mixHex('#c9905a', '#3a3050', u), mixHex('#d9a26a', '#5a6a9a', u), mixHex('#e2b07a', '#7fa6d6', u), mixHex('#e8c08a', '#bcdaf3', u)], 'ma');
  const sx = 640, sy = lerp(260, 700, u);
  glowC(sx, sy, 50, u > 0.5 ? '#9fd0ff' : '#fff2c8', 0.7); cut(ellipsePts(sx, sy, 36, 36, 0, 20), u > 0.5 ? '#e7f4ff' : '#fff6dc', { key: 'maSun', shadow: false });
  cut([[-40, 780], [200, 720], [460, 760], [760, 700], [W + 40, 760], [W + 40, H + 40], [-40, H + 40]], '#b8623a', { key: 'maG', sy: -4, pat: pat.dots('rgba(80,30,10,0.25)', 4, 26) });
  for (let i = 0; i < 6; i++) cut(ellipsePts(120 + i * 160, 840 + (i % 2) * 60, 40 + (i % 3) * 14, 22, 0, 14), '#8a4a2a', { key: 'rk' + i, sb: 6 });
  // a little rover
  const rx = 320 + Math.sin(TT * 0.3) * 30;
  cut(rect(rx - 90, 700, 180, 60, 8), '#d8d4cc', { key: 'rov' }); [[-60], [0], [60]].forEach(([d], i) => cut(ellipsePts(rx + d, 770, 24, 24, 0, 14), '#2a2f3a', { key: 'wh' + i, sb: 3 }));
  cut(capsulePts(rx + 40, 700, rx + 60, 600, 12), '#8a919e', { key: 'mast' }); cut(rect(rx + 40, 570, 50, 34, 6), '#2a2f3a', { key: 'cam' }); dot(rx + 66, 587, 9, '#9fd0ff');
  ray(860, 200, 46, { key: 'rayM', mood: 'wow', s: 1 - u * 0.4 });
}
function cMars(at) {
  title('On Mars: flipped!', at(0.8));
  swatch(CL + 170, 420, 300, 200, '#d9a26a', at(2.0), 'mw1', 'Mars by day');
  swatch(CR - 170, 420, 300, 200, '#7fa6d6', at(5.4), 'mw2', 'Mars at sunset');
  write('fine dust scatters red,', CL, 740, 46, at(6.8));
  write('and lets blue through near the Sun', CL, 810, 42, at(7.8));
  write('photographed by NASA rovers', CL, 910, 40, at(9.4), { color: PAL.orangeD });
}

// ---- 10. the end
function sEnd() { sHook({ blue: true }); }
function cEnd(at) {
  title('So...', at(0.6));
  popAt(at(1.6), CL + 60, 380, () => dot(0, 0, 34, '#7fb3e6')); write('blue sky = short waves,', CL + 120, 370, 44, at(1.8)); write('scattered by the air', CL + 120, 430, 44, at(2.6));
  popAt(at(4.0), CL + 60, 600, () => dot(0, 0, 34, '#e9894b')); write('red sunset = a long trip,', CL + 120, 590, 44, at(4.2)); write('the blue lost on the way', CL + 120, 650, 44, at(5.0));
  write('sunlight, bouncing off the air', CL, 860, 50, at(7.0), { color: PAL.orangeD, weight: 700 });
}
