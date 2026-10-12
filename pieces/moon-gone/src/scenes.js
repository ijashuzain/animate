
// =====================================================================
//  SCENES + CARDS — What if the Moon disappeared? Left: the scene (x 0..~990). Right: the card.
//  Colour: Luna's pale silver-yellow means the Moon, only the Moon.
// =====================================================================
const LUNA = '#efe6c8';
function luna(x, y, r, o = {}) {
  const key = o.key ?? 'luna', sc = o.s ?? 1; if (sc <= 0.01) return; r *= sc;
  y += Math.sin(TT * TAU * 0.6 + key.length) * r * 0.04;
  glowC(x, y, r, '#fff6dc', 0.35);
  cut(ellipsePts(x, y, r, r, 0, 40), LUNA, { key: key + 'b', crayon: '#c9bf9a', crAl: 0.3, sb: 14 });
  const R = RNG('cr', key); for (let i = 0; i < 5; i++) cut(ellipsePts(x + R.n(r * 0.55), y + R.n(r * 0.55), r * R.r(0.08, 0.18), r * R.r(0.08, 0.16), 0, 14), '#d8cfae', { key: key + 'c' + i, shadow: false, grain: 0.3 });
  let mood = o.mood ?? 'smile'; if (mood !== 'happy' && mood !== 'focus' && (B + 7) % 43 < 2) mood = 'focus';
  face(x, y + r * 0.08, r / 62, mood);
}
function earth(x, y, r, o = {}) {
  const key = o.key ?? 'earth';
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  if (o.axis) ink([[0, -r * 1.35], [0, r * 1.35]], { w: 6, color: '#e8e2d4', key: key + 'ax' });
  cut(ellipsePts(0, 0, r, r, 0, 44), '#3b78d6', { key: key + 'o', crayon: '#2a58a6', crAl: 0.3, sb: 16 });
  ctx.save(); trace(ellipsePts(0, 0, r, r, 0, 44), true); ctx.clip();
  const R = RNG('ld', key), sp = TT * (o.spin ?? 0.15);
  for (let i = 0; i < 5; i++) { const lx = mod(R.r(-r, r) + sp * r, 2.4 * r) - 1.2 * r; cut(ellipsePts(lx, R.n(r * 0.6), r * R.r(0.2, 0.36), r * R.r(0.12, 0.26), R.r(0, 3), 16), '#5aa05a', { key: key + 'l' + i, shadow: false, grain: 0.4 }); }
  cut(ellipsePts(0, -r * 0.95, r * 0.6, r * 0.14, 0, 16), '#f4f8fb', { key: key + 'ice', shadow: false, grain: false });
  ctx.restore();
  ctx.restore();
  let mood = o.mood ?? 'smile'; if (mood !== 'happy' && mood !== 'focus' && (B + 3) % 41 < 2) mood = 'focus';
  face(x, y + r * 0.1, r / 60, mood);
  SPARK_AT = toScreen(x, y);
}
function poof(x, y, t, key, c = '#fff6dc') { const k = ev(t, 0.8); if (k <= 0 || k >= 1) return; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; sparkle(x + Math.cos(a) * 120 * k, y + Math.sin(a) * 120 * k, 22 * (1 - k), c); } }
function village(key, dark, o = {}) {
  const sky = dark ? '#0c1124' : '#1d2448';
  wallC(sky, pat.dots('rgba(255,255,255,0.02)', 30, 160));
  starsC(key, dark ? 200 : 70, 700);
  if (!dark) glowC(o.mx ?? 700, o.my ?? 260, 260, '#fff6dc', 0.12);
  cut([[-40, 760], [200, 700], [500, 740], [800, 690], [W + 40, 730], [W + 40, H + 40], [-40, H + 40]], dark ? '#0f1424' : '#1f2d3a', { key: key + 'hill', sy: -4 });
  for (let i = 0; i < 5; i++) { const x = 90 + i * 180, y = 760 + (i % 2) * 20, h = 110 + (i % 3) * 30; cut([[x - 60, y], [x - 60, y - h], [x, y - h - 60], [x + 60, y - h], [x + 60, y]], dark ? '#141a2a' : '#2f3e52', { key: key + 'h' + i }); dot(x, y - h * 0.5, 14, (B + i * 5) % 40 < 34 ? '#ffd27a' : '#2a2f3a'); }
  for (let i = 0; i < 3; i++) { const x = 160 + i * 340; cut([[x, 600], [x + 70, 780], [x - 70, 780]], dark ? '#0f1a1a' : '#1f3a3a', { key: key + 't' + i, sb: 6 }); }
  // an owl on a post, a cat on a roof (small life)
  cut(rect(880, 600, 18, 180, 3), '#3a2a20', { key: key + 'post' });
  cut(ellipsePts(889, 580, 34, 40, 0, 18), '#7a5a3a', { key: key + 'owl' }); dot(877, 572, 9, '#ffd27a'); dot(901, 572, 9, '#ffd27a'); dot(877, 572, 4, PAL.ink); dot(901, 572, 4, PAL.ink);
}

// ---- 1. the Moon vanishes
function sVanish() {
  const gone = TT >= at(6.0);
  village('va', false);
  if (!gone) luna(700, 260, 110, { key: 'lunaV', mood: TT > at(5.0) ? 'wow' : 'smile' });
  poof(700, 260, at(6.0), 'pv');
  if (gone) { ctx.setLineDash([12, 14]); ink(ellipsePts(700, 260, 110, 110, 0, 40), { w: 4, color: 'rgba(255,246,220,0.4)', closed: true, key: 'ghost' }); ctx.setLineDash([]); }
  // someone looking up
  cut(capsulePts(420, 900, 420, 760, 60), PAL.teal, { key: 'pb' }); cut(ellipsePts(420, 720, 40, 44, 0, 20), PAL.skin2, { key: 'ph' }); face(424, 712, 0.65, gone ? 'wow' : 'smile');
}
function cVanish(at) {
  title('What if the Moon vanished?', at(0.8));
  popAt(at(2.0), CL + 150, 470, () => { glowC(0, 0, 90, '#fff6dc', 0.3); cut(ellipsePts(0, 0, 90, 90, 0, 30), LUNA, { key: 'cm' }); });
  arrow(CL + 280, 470, CR - 280, 470, at(5.5), PAL.ink, 'cv');
  if (TT >= at(6.0)) { ctx.setLineDash([10, 12]); ink(ellipsePts(CR - 150, 470, 90, 90, 0, 30), { w: 5, color: 'rgba(42,29,24,0.5)', closed: true, key: 'cghost', frac: ev(at(6.0), 0.6) }); ctx.setLineDash([]); }
  write('no explosion.', CL, 720, 50, at(7.4)); write('just... gone.', CL, 800, 50, at(8.4), { color: PAL.orangeD });
}

// ---- 2. darker nights
function sDark() {
  village('dk', true);
  // a confused owl's eyes and a moth with no light to fly to
  ctx.save(); ctx.translate(Math.sin(TT * 3) * 30, Math.cos(TT * 2.4) * 20); cut(ellipsePts(500, 420, 18, 10, 0.4, 12), '#8a8590', { key: 'moth' }); ctx.restore();
  handText('?', 920, 520, 60, '#ffd27a', { key: 'owlq', weight: 700 });
}
function cDark(at) {
  title('1. Darker nights', at(0.8));
  popAt(at(2.0), CL + 160, 420, () => { cut(rect(-130, -90, 260, 180, 10), '#1d2448', { key: 'n1' }); cut(ellipsePts(60, -40, 34, 34, 0, 20), LUNA, { key: 'n1m' }); for (let i = 0; i < 4; i++) cut(rect(-110 + i * 50, 40, 36, 50, 3), '#3a4a6a', { key: 'n1h' + i, shadow: false }); });
  popAt(at(3.0), CR - 160, 420, () => { cut(rect(-130, -90, 260, 180, 10), '#05070f', { key: 'n2' }); for (let i = 0; i < 9; i++) sparkle(-110 + i * 26, -70 + (i % 3) * 20, 5, '#fff6dc'); });
  write('with Moon', CL + 90, 560, 38, at(2.4)); write('without', CR - 230, 560, 38, at(3.4));
  write('many animals time their lives', CL, 730, 44, at(6.0));
  write('by moonlight, like reef corals', CL, 800, 44, at(7.0), { color: PAL.orangeD });
}

// ---- 3. tides
function sTides(o = {}) {
  const u = sm(TT, at(7.5), at(10.0));
  wallC('#3a6ea5', pat.dots('rgba(255,255,255,0.05)', 6, 60));
  starsC('td', 60, 400);
  cut([[-40, 640], [300, 620], [700, 650], [W + 40, 620], [W + 40, H + 40], [-40, H + 40]], '#e9cf98', { key: 'beach', sy: -4, pat: pat.dots('rgba(150,110,50,0.25)', 3, 26) });
  const lvl = lerp(560, 640, (Math.sin(TT * 0.9) * 0.5 + 0.5) * (1 - u * 0.55)) + u * 30;
  const P = []; for (let x = -40; x <= W + 40; x += 40) P.push([x, lvl + 120 + Math.sin(x * 0.02 + TT * 2) * 10 - x * 0.12]);
  cut([...P, [W + 40, H + 40], [-40, H + 40]], '#2a7ab8', { key: 'sea', sy: -3, pat: pat.lines('rgba(255,255,255,0.15)', 30) });
  if (u < 0.5) luna(820, 160, 70, { key: 'lunaT', mood: 'focus', s: 1 - u * 2 });
  label2('high tide', 220, 420, at(2.0)); if (TT >= at(8.0)) label2('only the Sun: small tides', 400, 340, at(8.0));
}
const label2 = (s, x, y, t) => { const k = popS(t); if (k > 0) tag(s, x, y, 40, { s: k, tape: false, rot: -0.02 }); };
function cTides(at) {
  title('2. Smaller tides', at(0.8));
  popAt(at(2.0), CCX - 120, 480, () => { cut(ellipsePts(0, 0, 170, 120, 0, 40), 'rgba(59,120,214,0.35)', { key: 'bulge', shadow: false }); cut(ellipsePts(0, 0, 100, 100, 0, 30), '#3b78d6', { key: 'ce' }); });
  popAt(at(2.6), CR - 90, 480, () => cut(ellipsePts(0, 0, 44, 44, 0, 20), LUNA, { key: 'cmn' }));
  arrow(CR - 150, 480, CCX + 70, 480, at(3.2), PAL.ink, 'pull');
  write('Moon tides: 100%', CL, 720, 46, at(7.5));
  write('Sun alone: about 46%', CL, 790, 46, at(8.5), { color: PAL.orangeD });
}

// ---- 4. the shore
function sShore() {
  wallC('#8fc4e8', pat.dots('rgba(255,255,255,0.2)', 5, 54));
  cut([[-40, 480], [400, 470], [W + 40, 490], [W + 40, H + 40], [-40, H + 40]], '#2a7ab8', { key: 'sea2', sy: -3 });
  cut([[-40, 600], [300, 580], [700, 610], [W + 40, 590], [W + 40, H + 40], [-40, H + 40]], '#e9cf98', { key: 'sand2', sy: -4, pat: pat.dots('rgba(150,110,50,0.25)', 3, 26) });
  const dry = sm(TT, at(6.0), at(10.0));
  [[220, 760, 140], [620, 820, 170]].forEach(([x, y, r], i) => { cut(ellipsePts(x, y, r, r * 0.4, 0, 30), '#7a6a5a', { key: 'pr' + i, sb: 0, sy: -2 }); cut(ellipsePts(x, y, r * (0.9 - dry * 0.6), r * 0.34 * (1 - dry * 0.6), 0, 30), '#4aa0c8', { key: 'pw' + i, shadow: false, pat: pat.lines('rgba(255,255,255,0.2)', 14) }); });
  starfish(200, 770, 0.9, 'sf'); crab(640, 800, 0.9, dry > 0.5 ? 'sad' : 'smile');
  const gx = 820 + Math.sin(TT * 1.2) * 40; cut(ellipsePts(gx, 640, 40, 26, 0, 16), '#f4f6fa', { key: 'gull' }); dot(gx + 30, 632, 5); cut([[gx + 36, 636], [gx + 56, 640], [gx + 36, 644]], PAL.yellow, { key: 'gbk', shadow: false });
}
function starfish(x, y, s, key) { cut(starPts(x, y, 46 * s, 5, -Math.PI / 2, 60), PAL.mustard, { key, sb: 4, pat: pat.dots('rgba(255,255,255,0.4)', 3, 12) }); face(x, y + 4, 0.5 * s, 'smile'); }
function crab(x, y, s, mood) {
  const st = Math.sin(TT * 6) * 4;
  for (let i = 0; i < 3; i++) { ink([[x - 30 * s, y + 6 * s], [x - (56 + i * 6) * s, y + (22 + st) * s]], { w: 7 * s, color: '#c9764a', key: 'cl' + i }); ink([[x + 30 * s, y + 6 * s], [x + (56 + i * 6) * s, y + (22 - st) * s]], { w: 7 * s, color: '#c9764a', key: 'cr' + i }); }
  cut(ellipsePts(x - 58 * s, y - 34 * s, 18 * s, 14 * s, 0, 14), '#e0915e', { key: 'cc1', sb: 4 }); cut(ellipsePts(x + 58 * s, y - 34 * s, 18 * s, 14 * s, 0, 14), '#e0915e', { key: 'cc2', sb: 4 });
  cut(ellipsePts(x, y, 46 * s, 28 * s, 0, 22), '#e0915e', { key: 'cb' }); face(x, y - 4 * s, 0.6 * s, mood);
}
function cShore(at) {
  title('3. Life on the shore', at(0.8));
  [['tide pools', 2.0], ['mudflats', 2.6], ['crabs, starfish, birds', 3.2]].forEach(([s, d], i) => write('- ' + s, CL, 340 + i * 80, 48, at(d)));
  write('all tuned to the tides', CL, 680, 50, at(5.0));
  write('adapt... or vanish', CL, 780, 56, at(8.0), { color: PAL.orangeD, weight: 700 });
}

// ---- 5. the tilt
function sTilt() {
  wallC('#141a33'); starsC('tl', 160);
  const free = sm(TT, at(6.0), at(8.0)), wob = 0.41 + free * 0.35 * Math.sin(TT * 1.4);
  if (free < 1) luna(820, 300, 60, { key: 'lunaTl', s: 1 - free, mood: 'focus' });
  earth(480, 540, 220, { key: 'eTl', tilt: wob, axis: true, mood: free > 0.5 ? 'wow' : 'smile' });
  if (free > 0) { ctx.strokeStyle = 'rgba(255,210,122,0.5)'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.ellipse(480, 240, 160 * free, 40 * free, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
}
function cTilt(at) {
  title('4. A wobbling tilt', at(0.8));
  popAt(at(2.0), CCX - 160, 520, () => { ctx.rotate(0.41); ink([[0, -150], [0, 150]], { w: 6, color: PAL.ink, key: 'ax' }); dot(0, 0, 90, '#3b78d6'); });
  write('23.4 degrees', CCX - 30, 400, 50, at(2.6));
  write('the tilt makes our seasons', CCX - 30, 470, 40, at(3.4));
  write('without the Moon, it could', CL, 770, 46, at(7.5));
  write('swing far more, over millions of years', CL, 840, 40, at(8.5), { color: PAL.orangeD });
}

// ---- 6. the length of a day
function sDay() {
  wallC('#a9d9c6', pat.dots('rgba(255,255,255,0.35)', 5, 54));
  floorC(820, '#7a9a5a', 'fld', pat.stripes('rgba(255,255,255,0.08)', 4, 22, 0.3));
  // a dinosaur, a clock
  const dx = 260;
  cut(capsulePts(dx - 140, 700, dx + 120, 700, 150), '#5aa05a', { key: 'dino', pat: pat.dots('rgba(255,255,255,0.2)', 6, 30) });
  cut(capsulePts(dx + 100, 680, dx + 200, 480, 60), '#5aa05a', { key: 'dneck' }); cut(ellipsePts(dx + 220, 460, 60, 40, 0, 20), '#5aa05a', { key: 'dhead' }); face(dx + 230, 462, 0.6, 'happy');
  cut(capsulePts(dx - 130, 700, dx - 300, 760, 40), '#5aa05a', { key: 'dtail' });
  [[-80], [-20], [50], [100]].forEach(([d], i) => cut(rect(dx + d - 18, 740, 36, 90, 10), '#4a8a4a', { key: 'dl' + i }));
  cut(ellipsePts(700, 380, 160, 160, 0, 40), '#2a2f3a', { key: 'ck' });
  clock(700, 380, 140, 11, Math.floor((TT * 30) % 60), 'clkD');
  label2(TT < at(6.5) ? 'a day: ~23.5 h' : 'today: 24 h', 700, 600, at(1.0));
}
function cDay(at) {
  title('5. A slowing spin', at(0.8));
  bigNum('23.5 h', 'a day, ~70 million years ago', CCX - 180, 380, at(4.0), '#3d7c46', 80);
  arrow(CCX - 10, 360, CCX + 90, 360, at(5.4), PAL.ink, 'da');
  bigNum('24 h', 'today', CR - 120, 380, at(5.8), PAL.orangeD, 80);
  write('tides drag on the spin:', CL, 690, 46, at(7.0));
  write('about 2 ms longer per century', CL, 760, 44, at(8.0), { color: PAL.orangeD });
}

// ---- 7. eclipses and months
function sEclipse() {
  wallC('#26315f'); starsC('ec', 80);
  const cover = sm(TT, at(1.0), at(3.0)), gone = TT >= at(6.0);
  glowC(500, 420, 200, '#fff2c8', 0.4 + 0.3 * cover);
  cut(ellipsePts(500, 420, 160, 160, 0, 40), '#fff2c8', { key: 'ecS', shadow: false });
  if (!gone) { cut(ellipsePts(lerp(820, 500, cover), 420, 156, 156, 0, 40), '#1d1a22', { key: 'ecM', shadow: false }); }
  else { const k = ev(at(6.0), 0.6); ctx.setLineDash([12, 12]); ink(ellipsePts(500, 420, 156, 156, 0, 40), { w: 4, color: `rgba(255,246,220,${0.5 * (1 - k)})`, closed: true, key: 'ecG' }); ctx.setLineDash([]); }
  cut([[-40, 820], [W + 40, 800], [W + 40, H + 40], [-40, H + 40]], '#141a2a', { key: 'ecF', sy: -4 });
  for (let i = 0; i < 6; i++) { const x = 120 + i * 150; cut(capsulePts(x, 900, x, 790, 40), [PAL.teal, PAL.pink, PAL.purple, PAL.blue, PAL.yellow, PAL.mint][i], { key: 'pp' + i }); cut(ellipsePts(x, 760, 28, 30, 0, 16), [PAL.skin1, PAL.skin2, PAL.skin3][i % 3], { key: 'ph' + i }); face(x, 754, 0.45, gone ? 'sad' : 'wow'); }
}
function cEclipse(at) {
  title('6. No eclipses, no months', at(0.8));
  popAt(at(2.4), CL + 140, 440, () => { glowC(0, 0, 80, '#fff2c8', 0.5); dot(0, 0, 70, '#1d1a22'); });
  if (TT >= at(6.0)) ink([[CL + 50, 350], [CL + 230, 530]], { w: 10, color: '#d84a43', frac: ev(at(6.0), 0.3), key: 'x1' });
  write('MOON', CCX - 20, 420, 64, at(7.0), { weight: 700 }); write('->  MONTH', CCX - 20, 500, 64, at(7.6), { weight: 700, color: PAL.orangeD });
  write('even our calendar', CL, 760, 48, at(8.6)); write('is shaped by it', CL, 830, 48, at(9.2), { color: PAL.orangeD });
}

// ---- 8. the hush; 9. it's back (the hit)
function sHush() { village('hu', true); }
function sBack() {
  village('bk', false);
  luna(700, 260, 110, { key: 'lunaB', mood: 'happy', s: EZ.back(clamp((TT - HIT) / 0.35)) });
  poof(700, 260, HIT, 'pb', '#ffd27a');
  cut(capsulePts(420, 900, 420, 760, 60), PAL.teal, { key: 'pb' }); cut(ellipsePts(420, 720, 40, 44, 0, 20), PAL.skin2, { key: 'ph' }); face(424, 712, 0.65, 'happy');
  if (TT >= at(6.0)) { const k = sm(TT, at(6.0), at(12.0)); ink([[700, 400], [700, 400 - k * 0]], { w: 1, color: 'rgba(0,0,0,0)', key: 'x' }); label2('a little further every year', 700, 430, at(6.5)); }
}
function cBack(at) {
  title('Phew. It\'s back.', at(0.6));
  bigNum('3.8 cm', 'further away every year', CCX, 400, at(6.0), PAL.orangeD, 100);
  write('measured with lasers, bounced', CL, 700, 44, at(8.5));
  write('off mirrors left by Apollo', CL, 770, 44, at(9.5), { color: PAL.orangeD });
}

// ---- 10. thanks, Moon
function sEnd() {
  wallC('#141a33'); starsC('en', 160);
  const a = TT * 0.5;
  earth(480, 540, 170, { key: 'eE', mood: 'happy' });
  luna(480 + Math.cos(a) * 340, 540 + Math.sin(a) * 160, 56, { key: 'lunaE', mood: 'happy' });
}
function cEnd(at) {
  title('Without the Moon:', at(0.6));
  [['darker nights', 1.6], ['smaller tides', 2.4], ['a wobbling tilt', 3.2], ['no eclipses', 4.0]].forEach(([s, d], i) => { write(s, CL + 70, 360 + i * 100, 48, at(d)); popAt(at(d), CL + 26, 344 + i * 100, () => dot(0, 0, 14, '#b9a96a')); });
  write('so... thanks, Moon.', CL, 860, 60, at(6.5), { color: PAL.orangeD, weight: 700 });
}
