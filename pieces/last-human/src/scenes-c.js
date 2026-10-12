
// =====================================================================
//  SCENES C — before and after, the rules of a dying star, Titan waking, the archive recording, the white dwarf,
//  shutting down, the atoms going home (paragraphs 63–117)
// =====================================================================

function sWall() {
  wallFill('#4a5262', 'wl', pat.lines('rgba(255,255,255,0.05)', 90));
  cut(rect(260, 120, 1400, 760, 14), '#6b7586', { key: 'wlb', pat: pat.dots('rgba(0,0,0,0.08)', 3, 22) });
  photo(560, 420, 460, 330, 'before', (w, h) => { ctx.fillStyle = '#cfe2ee'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = COL.ocean; ctx.fillRect(0, h * 0.5, w, h * 0.5); ctx.fillStyle = COL.land; ctx.beginPath(); ctx.moveTo(0, h * 0.55); ctx.lineTo(w * 0.35, h * 0.3); ctx.lineTo(w * 0.6, h * 0.5); ctx.lineTo(w, h * 0.32); ctx.lineTo(w, h * 0.5); ctx.lineTo(0, h * 0.6); ctx.fill(); }, { rot: -0.04 });
  const k = popS(PW(63, 'You pin it'));
  if (k > 0) { ctx.save(); ctx.translate(1340, 440); ctx.scale(k, k); photo(0, 0, 460, 330, 'after', (w, h) => { ctx.fillStyle = '#fbfbf6'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.arc(w / 2, h / 2, h * 0.17, 0, TAU); ctx.fill(); }, { rot: 0.03, pin: '#3f9f9a' }); ctx.restore(); }
  label('before', 560, 700, 48, P(64)); label('after', 1340, 720, 48, P(64) + 0.7);
  you(960, 1120, { s: 0.75, mood: 'sad', key: 'ywl', arms: TT < PW(63, 'You pin it') + 1 && TT > PW(63, 'You print it') ? 'reach' : 'down', reach: [300, -480] });
}

function sCycles() {
  const awake = Math.floor((TT - P(65)) / 2.2) % 2 === 1;
  podBay('cy', { sleeping: !awake, open: awake ? 0.9 : 0, frost: awake ? 0 : 0.6, years: 83 + Math.floor((TT - P(65)) * 7) });
  if (awake) you(1250, 1000, { s: 0.9, mood: 'focus', key: 'ycy', grey: (TT - P(65)) > 8 });
  // a water ration: drops counted out like time
  for (let i = 0; i < 6; i++) { const on = TT < PE(65) - i * 2; cut(blooDrop(170 + i * 70, 150, 26), on ? '#7be3c8' : '#3a4a52', { key: 'rd' + i, sb: 3 }); }
  label('ration time like water', 380, 260, 40, PW(65, 'You ration time'));
}
const blooDrop = (x, y, r) => { const P = []; for (let i = 0; i < 40; i++) { const u = i / 40 * TAU; P.push([x + r * 1.1 * Math.sin(u) * Math.sin(u / 2), y - r * 1.3 * Math.cos(u)]); } return P; };

function sWind() {
  spaceWall('wn');
  const m = sm(TT, P(67), PE(67));
  sun(500, 540, lerp(420, 380, m), 'giant', 'wnS');
  // the solar wind: streams of material leaving
  for (let i = 0; i < 26; i++) { const R = RNG('wd', i), a = R.r(-0.9, 0.9), sp = R.r(140, 260), k = mod(TT * sp + R.r(0, 900), 1300); const x = 500 + Math.cos(a) * (420 + k), y = 540 + Math.sin(a) * (420 + k) * 0.8; cut(ellipsePts(x, y, 26 + k * 0.03, 9, a, 12), `rgba(240,138,75,${0.7 * (1 - k / 1300)})`, { key: 'wd' + i, shadow: false, grain: false }); }
  label('the rules of a dying star', 960, 120, 56, P(66), { write: true, fill: '#fbf6ea' });
  label('the solar wind: a storm', 1400, 300, 42, PW(67, 'solar wind'));
  // the scales: what the Sun was, what it keeps
  if (TT >= PW(67, 'By the time')) { cut(rect(1250, 760, 400, 16, 4), '#b9bfc8', { key: 'scl' }); cut([[1430, 776], [1470, 776], [1450, 900]], '#8a919e', { key: 'sclb' }); const tilt = -0.2 * sm(TT, PW(67, 'By the time'), PE(67)); ctx.save(); ctx.translate(1450, 768); ctx.rotate(tilt); dot(-180, -40, 60, COL.sun); dot(180, -24, 42 * (1 - 0.3 * m), COL.sunL); ctx.restore(); label('loses almost half', 1450, 980, 40, PW(67, 'close to half')); }
}

function sDrift() {
  const k = lerp(1, 1.35, sm(TT, P(69), PE(70)));
  system('dr', 960, 540, 110, 'giant', [['mars', 300, 1.0, 20], ['jupiter', 470, 2.6, 46], ['saturn', 640, 5.2, 34]], { k, tilt: 0.4, spin: 0.004 });
  label('gravity weakens', 960, 120, 48, PW(69, 'gravity weakens'));
  label('every planet drifts outward', 960, 980, 44, PW(69, 'drifts outward'));
  label('a long, slow exhale', 1500, 220, 44, PW(70, 'slow exhale'), { write: true });
}

function sFlash() {
  spaceWall('fl');
  cut(ellipsePts(960, 540, 470, 470, 0, 72), COL.sun, { key: 'flO', sb: 30, shc: 'rgba(240,90,50,0.6)', sy: 0, crayon: '#9a1f1a', crAl: 0.3 });
  cut(ellipsePts(960, 540, 260, 260, 0, 60), '#a82620', { key: 'flM', shadow: false });
  const heat = sm(TT, PW(72, 'hotter and hotter'), PW(72, 'one hundred million') + 1);
  cut(ellipsePts(960, 540, 90, 90, 0, 40), mixHex('#f08a4b', '#ffffff', heat), { key: 'flC', sb: 14, shc: 'rgba(255,255,255,0.7)', sy: 0 });
  label('helium ash', 960, 400, 36, PW(72, 'helium ash'));
  label('100 million degrees', 1500, 300, 44, PW(72, 'one hundred million'));
  if (TT >= PW(72, 'Helium nuclei')) { handText('He + He + He  ->  C', 760, 760, 48, '#fff2c8', { key: 'he', frac: ev(PW(72, 'Helium nuclei'), 1.2) }); }
  const fl = ev(PW(72, 'all at once'), 0.5) * (1 - ev(PW(72, 'all at once') + 2, 3));
  if (fl > 0) { glow(960, 540, 150 + fl * 150, '#ffffff', 0.9 * fl); burst(960, 540, 100, 100 + 220 * fl, { n: 16, color: '#fff2c8', w: 6, key: 'flb' }); }
  label('as bright as a galaxy, for a moment', 960, 980, 44, PW(72, 'an entire galaxy'));
}

function sOutside() {
  spaceWall('ou');
  sun(960, 540, 420, 'giant', 'ouS');
  const fl = Math.max(0, Math.sin((TT - PW(73, 'almost nothing')) * 3)) * ev(PW(73, 'almost nothing'), 0.2) * (1 - ev(PW(73, 'almost nothing') + 1, 0.5));
  if (fl > 0) glow(960, 540, 430, '#ffb070', 0.08 * fl);
  label('almost nothing', 960, 120, 52, PW(73, 'almost nothing'));
  label('absorbed by the layers above', 960, 1000, 42, PW(74, 'absorbed'));
  label('in silence', 1600, 860, 46, PW(74, 'in silence'), { write: true });
}

function sMedical() {
  wallFill('#2b3240', 'md', pat.lines('rgba(255,255,255,0.04)', 60));
  monitorFrame(860, 140, 900, 560, 'mdm', () => {
    monoText('MEDICAL LOG', 900, 220, 44, COL.screenL, { key: 'ml', jit: 0.3 });
    monoText('COLD SLEEP: SLOWS, DOES NOT STOP', 900, 320, 30, 'rgba(123,227,200,0.75)', { count: typed('COLD SLEEP: SLOWS, DOES NOT STOP', PW(78, 'Cold sleep')), key: 'ml2', jit: 0.3 });
    monoText('YEARS REMAINING:', 900, 460, 40, COL.screenL, { count: typed('YEARS REMAINING:', PW(78, 'Years remaining')), key: 'ml3', jit: 0.3 });
    if (TT >= PW(78, 'Fewer than')) monoText('FEWER THAN EXPECTED', 900, 560, 44, '#f6cf55', { key: 'ml4', jit: 0.3 });
  });
  // your hands, older
  for (const [x, k] of [[260, 'l'], [560, 'r']]) { cut(capsulePts(x, 1120, x + 30, 860, 110, 6), COL.you, { key: 'mha' + k }); cut(ellipsePts(x + 34, 830, 70, 56, 0, 20), '#b88464', { key: 'mhh' + k }); for (let i = 0; i < 3; i++) ink([[x + 4, 818 + i * 12], [x + 64, 812 + i * 12]], { w: 2.5, color: 'rgba(90,50,30,0.5)', key: 'wr' + k + i }); }
}

function sTitanWake() {
  const thaw = sm(TT, P(80), PE(80));
  titanOutside('tw', { warm: true, station: true, hx: 1500, hy: 820, hs: 0.5, lake: true, lakeC: mixHex('#5a3a2a', '#7a8a8a', thaw) });
  // water-ammonia slush seeping up through cracks
  for (let i = 0; i < 6; i++) { const x = 220 + i * 180, f = ev(PW(80, 'seeping up') + i * 0.4, 1.5); if (f > 0) { ink([[x, 1000], [x + 30, 960], [x + 10, 920]], { w: 8, color: '#3a2412', key: 'ck' + i }); cut(ellipsePts(x + 20, 960, 30 * f, 14 * f, 0, 14), '#b9d6d0', { key: 'sl' + i, sb: 4 }); } }
  label('warmer than ever', 400, 150, 46, PW(80, 'warmer now'));
  label('methane lakes thinning', 960, 640, 40, PW(80, 'methane lakes'));
  label('water + ammonia', 600, 860, 40, PW(80, 'Mixtures'));
  label('one of the most interesting places', 960, 260, 44, PW(81, 'most interesting'));
  label('no one here to see it but you', 960, 360, 44, P(82), { write: true });
}

function sJump() {
  titanOutside('jp', { warm: true, station: true, hx: 1500, hy: 820, hs: 0.45 });
  const tj = PW(84, 'But you jump'), u = lin(TT, tj, tj + 7);
  const x = lerp(500, 1200, u), y = 940 - Math.sin(u * Math.PI) * 520;
  you(x, y, { s: 0.75, suit: true, arms: u > 0 && u < 1 ? 'up' : 'down', mood: TT >= PW(84, 'you laugh') ? 'happy' : 'focus', key: 'yjp' });
  label('gravity: about 1/7 of Earth', 420, 160, 40, PW(84, 'one seventh'));
  label('air: about 1.5x the pressure', 420, 260, 40, PW(84, 'one and a half'));
  const wg = popS(PW(84, 'strap on wings')) * (TT < PW(84, "have wings") + 1 ? 1 : 0);
  if (wg > 0) ghostly(0.5, () => { you(1400, 600, { s: 0.6, suit: true, arms: 'up', key: 'yw', mood: 'happy' }); cut([[1400, 400], [1150, 300], [1250, 460]], '#fbf6ea', { key: 'wgl' }); cut([[1400, 400], [1650, 300], [1550, 460]], '#fbf6ea', { key: 'wgr' }); });
  label('the first laugh in years', 960, 120, 48, P(85), { write: true });
}

function sLie() {
  titanSky(-20, -20, W + 40, H + 40, 'lie', { warm: true, saturn: false, sunX: 0.8, sunY: 0.25, sunR: 110 });
  planet(620, 300, 160, 'saturn', 'lieS', { sb: 0 });
  ctx.fillStyle = 'rgba(200,50,43,0.12)'; ctx.fillRect(0, 0, W, H);
  cut([[-40, 760], [W + 40, 740], [W + 40, H + 40], [-40, H + 40]], '#d0782e', { key: 'lieF', sy: -4, pat: pat.dots('rgba(255,220,160,0.3)', 4, 26) });
  you(1000, 900, { s: 0.9, suit: true, pose: 'lie', mood: 'smile', key: 'ylie' });
  drizzle(0, 0, W, H, 'liedz', 60);
  label("Saturn's rings in red light", 620, 560, 40, PW(86, 'its rings'));
}

function sShipsStars() {
  spaceWall('ssx', '#0c1124');
  for (let i = 0; i < 3; i++) { const x = mod(300 + i * 600 + TT * 6, W + 200) - 100, y = 300 + i * 220; seedShip(x, y, 0.22, 'sx' + i, { rot: 0.05 }); }
  label('still alive?', 960, 900, 48, P(88), { write: true });
  label('do they think of you?', 960, 1000, 40, PW(88, 'anyone on board'));
}

function sPhoton() {
  spaceWall('ph');
  sun(500, 540, 380, 'calm', 'phS');
  // the photon's random walk out of the core, then a straight dash to Earth
  const tw = PW(92, 'a single photon'), tr = PW(92, 'before racing');
  const R = RNG('walk'), Q = [[500, 540]]; for (let i = 0; i < 70; i++) { const [x, y] = Q[Q.length - 1], d = Math.hypot(x - 500, y - 540); if (d > 330) break; Q.push([x + R.n(40) + 4, y + R.n(40)]); }
  const f = ev(tw, tr - tw); if (f > 0) ink(Q, { w: 5, color: '#fff2c8', frac: f, key: 'pw', raw: true });
  planet(1650, 540, 60, 'earth', 'phE');
  const g = ev(tr, 1.2); if (g > 0) { const e = Q[Q.length - 1]; ink([e, [lerp(e[0], 1590, g), lerp(e[1], 540, g)]], { w: 6, color: '#fff2c8', key: 'pd' }); }
  label('4.5 billion years old', 500, 120, 44, PW(92, 'four and a half'));
  label('tens of thousands of years to escape', 500, 1000, 40, PW(92, 'tens of thousands'));
  label('8 minutes to Earth', 1300, 400, 44, PW(92, 'eight minutes'));
  if (TT >= PW(92, 'every sunrise')) { cut([[1200, 1100], [1500, 900], [1900, 980], [1900, 1100]], '#1b2333', { key: 'shill', shadow: false }); for (let i = 0; i < 3; i++) you(1500 + i * 90, 930 + i * 15, { s: 0.2, arms: 'up', key: 'anc' + i, body: '#a07848', bodyD: '#7a5a3a', mood: 'happy' }); }
}

function sNebula() {
  spaceWall('nb', '#0c1124');
  const tn = PW(94, 'planetary nebula'), g = sm(TT, PW(94, 'drift away'), PE(94));
  const R0 = lerp(220, 520, g);
  if (TT >= PW(94, 'swell again')) {
    const cols = ['rgba(90,200,200,0.45)', 'rgba(140,122,216,0.45)', 'rgba(243,163,191,0.45)', 'rgba(246,207,85,0.4)'];
    for (let i = 0; i < 4; i++) { const r = R0 * (0.55 + i * 0.18) + Math.sin(TT + i) * 8; cut(ellipsePts(960, 540, r * 1.15, r, i * 0.4 + TT * 0.02, 40), cols[i], { key: 'nbr' + i, shadow: false, grain: 0.3, tear: 3 }); }
  } else sun(960, 540, 260, 'giant', 'nbS');
  if (TT >= PW(94, 'burning helium')) sun(960, 540, TT >= PW(94, 'drift away') ? 20 : 120, TT >= PW(94, 'drift away') ? 'white' : 'giant', 'nbC');
  label('it will not explode', 960, 120, 48, P(94) + 0.3);
  label('100 million years of helium', 400, 960, 38, PW(94, 'about a hundred million'));
  label('a planetary nebula', 960, 960, 50, tn, { write: true });
}

function sDwarf() {
  spaceWall('dw', '#0c1124');
  const cool = sm(TT, PW(97, 'cooling slowly'), P(98) + 4);
  sun(760, 540, 90, 'white', 'dwW');
  if (cool > 0) { ctx.fillStyle = `rgba(12,17,36,${0.45 * cool})`; ctx.beginPath(); ctx.arc(760, 540, 95, 0, TAU); ctx.fill(); }
  if (TT >= P(97)) { planet(1100, 540, 90, 'earth', 'dwE'); label('about the size of Earth', 930, 760, 40, P(97)); }
  label('a white dwarf', 760, 300, 56, P(96), { write: true, fill: '#eef2ff' });
  if (TT >= PW(97, 'teaspoon')) { cut(capsulePts(1420, 720, 1640, 640, 22), '#d8d4cc', { key: 'tsp' }); cut(ellipsePts(1420, 724, 50, 28, -0.35, 20), '#d8d4cc', { key: 'tsb' }); dot(1420, 716, 18, '#eef2ff'); label('several tons', 1530, 820, 40, PW(97, 'several tons')); }
  label('shines longer than everything that ever happened', 960, 980, 40, P(98), { write: true });
}

function sDistant() {
  wallFill('#2a2350', 'ds', pat.dots('rgba(255,255,255,0.03)', 30, 160));
  stars('ds', 120, { y1: 600 });
  glow(1500, 260, 90, '#9fd0ff', 0.5); cut(ellipsePts(1500, 260, 70, 70, 0, 30), '#cfe6ff', { key: 'ds1', sb: 10 });
  glow(1700, 380, 40, '#ffb070', 0.5); cut(ellipsePts(1700, 380, 30, 30, 0, 20), '#ffd0a0', { key: 'ds2', sb: 6 });
  cut([[-40, 820], [500, 760], [1100, 830], [1600, 770], [W + 40, 810], [W + 40, H + 40], [-40, H + 40]], '#3a5a4a', { key: 'dsG', sy: -4, pat: pat.dots('rgba(160,240,200,0.18)', 5, 30) });
  for (let i = 0; i < 6; i++) cut(ellipsePts(140 + i * 300, 830, 40, 90, 0, 16), '#5a8a6a', { key: 'dsp' + i, sb: 4 });
  // a descendant with an antenna, hearing a voice
  cut(capsulePts(1000, 900, 1000, 640, 12), '#8a919e', { key: 'dsa' }); cut(ellipsePts(1000, 630, 70, 24, -0.4, 18), '#d8d4cc', { key: 'dsd' });
  const hear = TT < P(102);
  you(820, 960, { s: 0.85, mood: hear ? 'wow' : 'focus', key: 'ydesc', body: '#8c7ad8', bodyD: '#6c5ab8', arms: hear ? 'face' : 'down' });
  if (hear) for (let i = 0; i < 3; i++) { const k = mod(TT * 0.6 + i / 3, 1); ctx.strokeStyle = `rgba(123,227,200,${1 - k})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(1000, 630, 20 + k * 200, -2.6, -0.5); ctx.stroke(); }
  label('a thousand, or a million years from now', 960, 140, 42, P(101) + 0.3);
  label('maybe not', 960, 240, 50, P(102), { write: true });
}

function sShutdown() {
  spaceWall('sh', '#0c1124');
  // Halcyon as a plan: wings that go dark one by one
  const secs = [[260, 300, 'wing A', 'The lights'], [260, 640, 'wing B', 'The lights'], [660, 220, 'hydroponics', 'hydroponic'], [1260, 220, 'corridors', 'Then the heating'], [1660, 300, 'wing C', 'One by one'], [1660, 640, 'wing D', 'One by one']];
  for (const [x, y, name, cue] of secs) { const off = TT >= PW(110, cue) + (name === 'wing B' || name === 'wing D' ? 1.2 : 0); cut(rect(x - 160, y - 110, 320, 220, 14), off ? '#1d2229' : '#7be3c8', { key: 'sec' + name, sb: 8 }); tag(name, x, y, 30, { tape: false, fill: off ? '#5a6070' : '#fbf6ea' }); }
  cut(rect(660, 400, 600, 420, 20), '#f6cf55', { key: 'secCore', sb: 10 }); tag('core  -  archive  -  you', 960, 610, 40, { tape: false });
  for (const [x, y] of secs) ink([[x, y], [960, 610]], { w: 6, color: 'rgba(255,255,255,0.18)', key: 'pipe' + x + y });
  label('a few rooms around the core', 960, 960, 44, PW(110, 'until the station'));
}

function sNightly() {
  spaceWall('ni');
  sun(960, 520, 360, 'giant', 'niS');
  // Earth's atoms going home
  if (TT >= PW(112, 'Iron from')) [['Fe', 'Iron from'], ['C', 'carbon from'], ['O', 'oxygen from']].forEach(([s, cue], i) => { const u = sm(TT, PW(112, cue), PW(112, cue) + 4); const x = lerp(300 + i * 660, 960, u), y = lerp(960, 520, u); if (u < 1) { cut(ellipsePts(x, y, 46, 46, 0, 20), '#fbf6ea', { key: 'at' + s, sb: 6 }); handText(s, x - 22, y + 16, 44, PAL.ink, { key: 'att' + s, weight: 700 }); } });
  label('it does not rage', 400, 140, 40, PW(112, 'rage'));
  label('slowly letting go of itself', 1450, 140, 40, PW(112, 'letting go'));
  label('returning to where it came from', 960, 1000, 44, PW(112, 'returning'), { write: true });
}

function sNewStars() {
  spaceWall('ns', '#0c1124');
  const u = sm(TT, P(113), PW(113, 'Perhaps new oceans') + 1);
  for (let i = 0; i < 5; i++) cut(ellipsePts(960 + Math.sin(i * 2) * 300 * (1 - u), 540 + Math.cos(i * 2) * 200 * (1 - u), 420 - u * 300, 180 - u * 80, i * 0.6, 30), ['rgba(140,122,216,0.35)', 'rgba(243,163,191,0.3)', 'rgba(90,200,200,0.3)', 'rgba(246,207,85,0.25)', 'rgba(224,80,58,0.25)'][i], { key: 'ncl' + i, shadow: false, grain: 0.3, tear: 3 });
  if (TT >= PW(113, 'New planets') - 1) sun(860, 520, 60 * popS(PW(113, 'collapse into') + 0.5), 'calm', 'nsS');
  if (TT >= PW(113, 'Perhaps new oceans')) { const k = popS(PW(113, 'Perhaps new oceans')); planet(1250, 600, 50 * k, 'earth', 'nsE'); }
  label('new stars', 860, 300, 44, PW(113, 'new stars')); label('perhaps new oceans', 1250, 760, 44, PW(113, 'Perhaps new oceans'));
  label('...that were once you', 960, 960, 46, PW(114, 'once you'), { write: true });
}

function sCup() {
  wallFill('#4a5262', 'cu', pat.gingham('rgba(255,255,255,0.04)', 26));
  cut(rect(-40, 760, W + 80, 360, 6), '#8a919e', { key: 'cuT', pat: pat.lines('rgba(255,255,255,0.12)', 18) });
  // two old hands around a warm cup
  ctx.save(); ctx.translate(960, 560); mug(0, 0, 2.6, COL.cup, 'bigmug', true); ctx.restore();
  for (const [x, k] of [[780, 'l'], [1140, 'r']]) { cut(capsulePts(x + (k === 'l' ? -300 : 300), 1000, x, 780, 140, 6), COL.you, { key: 'cua' + k }); cut(ellipsePts(x, 740, 90, 70, 0, 20), '#b88464', { key: 'cuh' + k }); }
  glow(960, 700, 120, '#ffb070', 0.15);
}
