
// =====================================================================
//  SCENES B — the seed ships, the message, why you stayed, the probe, cold sleep, Earth inside the Sun (paragraphs 27–62)
// =====================================================================

// the observation deck in its moods across the story
function sDeckScene(mode) {
  const late = ['think', 'hours', 'changed', 'chairs', 'end'].includes(mode);
  const o = { photos: late ? 2 : 0, view: mode === 'decision' ? 'sun' : 'titan', warm: late, clock: mode === 'end', saturn: mode === 'hours' || mode === 'end' };
  if (mode === 'chairs') { o.chairs = true; o.dim = sm(TT, P(109), P(109) + 3) * 0.45; }
  if (mode === 'end') { o.dim = 0.5; o.redLight = true; o.sunR = 110; }
  deck('dk' + mode, o);
  const k = 'yd' + mode;
  if (mode === 'alone') you(1000, 1000, { mood: 'sad', key: k });
  else if (mode === 'stayed') you(1000, 1000, { mood: 'focus', key: k });
  else if (mode === 'decision') you(1000, 1000, { mood: TT < P(44) ? 'focus' : 'wow', key: k, flip: TT >= P(44) });
  else if (mode === 'think') { chair(760, 1000, 1, 'chT'); you(760, 1000, { pose: 'chair', mood: 'focus', key: k, grey: true }); }
  else if (mode === 'hours') you(1060, 1000, { mood: 'focus', key: k, grey: true, arms: 'down' });
  else if (mode === 'changed') { chair(760, 1000, 1, 'chC'); you(760, 1000, { pose: 'chair', mood: TT >= P(105) ? 'smile' : 'focus', key: k, grey: true }); }
  else if (mode === 'chairs') you(1300, 1000, { mood: 'sad', key: k, grey: true, flip: TT > PW(108, 'At the empty') });
  else if (mode === 'end') {
    chair(760, 1000, 1, 'chE'); you(760, 1000, { pose: 'chair', arms: 'cup', mood: TT > P(120) ? 'smile' : 'focus', key: k, grey: true });
    beaconRings(1760, 520, 'endbc', 0, { r: 420, every: 2.4 });
    const f = lin(TT, DURATION - 4, DURATION - 0.5); if (f > 0) { ctx.fillStyle = `rgba(8,8,12,${f})`; ctx.fillRect(0, 0, W, H); }
  }
  if (mode === 'chairs') { label('the photographs', 360, 640, 36, PW(108, 'At the photographs')); label('the empty chairs', 470, 1040, 36, PW(108, 'At the empty')); }
}

function sSeedShips() {
  spaceWall('sd');
  planet(220, 900, 120, 'saturn', 'sdSa');
  const n = TT >= P(28) ? 1 : 4;
  for (let i = 0; i < n; i++) { const t0 = P(27) + i * 1.5, u = sm(TT, t0, t0 + 14); seedShip(lerp(500 + i * 120, 1700, u), lerp(760 - i * 120, 250 - i * 40, u), lerp(0.9, 0.35, u), 'sd' + i, { rot: -0.4 }); }
  if (TT >= P(28)) { const u = sm(TT, P(28), P(28) + 6); seedShip(lerp(900, 1500, u), lerp(600, 300, u), lerp(0.8, 0.2, u), 'last', { rot: -0.4 }); label('the last ship', 960, 160, 48, P(28)); }
  label('hundreds of thousands in cold sleep', 960, 1000, 42, PW(27, 'hundreds of thousands'));
  label('journeys of thousands of years', 1300, 140, 40, PW(27, 'Journeys'));
}

function sMessage() {
  wallFill('#2b3240', 'ms', pat.lines('rgba(255,255,255,0.04)', 60));
  monitorFrame(330, 110, 1260, 660, 'msm', () => {
    if (TT < P(31)) {
      const on = B % 24 < 14;
      cut(rect(760, 260, 400, 260, 10), on ? '#f6cf55' : '#b9952f', { key: 'env', shadow: false });
      ink([[760, 260], [960, 410], [1160, 260]], { w: 8, color: '#2a1d18', key: 'envf' });
      monoText('1 UNREAD  -  9 YEARS', 650, 600, 40, COL.screenL, { key: 'unr', jit: 0.3 });
      monoText('FROM: CAPT. MERIDIAN', 650, 670, 36, 'rgba(123,227,200,0.7)', { key: 'frm', jit: 0.3 });
    } else {
      monoText('FROM: MERIDIAN', 400, 200, 40, 'rgba(123,227,200,0.7)', { key: 'frm2', jit: 0.3 });
      const L = ['"Window closes in six hours.', "There's still a berth.", 'Please."'];
      let c = typed(L.join(''), P(32) - 0.2, 14);
      L.forEach((s, i) => { monoText(s, 400, 360 + i * 110, 58, COL.screenL, { count: Math.max(0, c), key: 'ml' + i, jit: 0.3 }); c -= s.length; });
    }
  });
  cut(rect(-40, 880, W + 80, 260, 8), '#3a3f4a', { key: 'msdesk', sy: -6 });
}

function sDeparture() {
  const closed = PW(33, 'Then the window closed');
  deck('dp', { view: 'dark', inView: (vx, vy, vr) => {
    const u = sm(TT, closed, PE(33) + 1);
    if (TT >= closed) { const x = lerp(vx - 60, vx + 220, u), y = lerp(vy + 60, vy - 200, u); glow(x, y, lerp(70, 10, u), COL.engine, 0.8); seedShip(x + 30, y - 10, lerp(0.35, 0.03, u), 'mer', { rot: -0.8 }); }
    else seedShip(vx - 60, vy + 60, 0.35, 'mer', { rot: -0.8, engine: false });
  } });
  you(800, 1000, { mood: 'sad', key: 'ydp' });
  const left = Math.max(0, 6 * 3600 - (TT - P(33)) * 900);
  label(TT < closed ? `T-${String(Math.floor(left / 3600)).padStart(2, '0')}:${String(Math.floor(left / 60) % 60).padStart(2, '0')}` : 'window closed', 360, 300, 50, P(33) + 0.3, { fill: TT < closed ? '#fbf6ea' : '#ffd8d0' });
  label('one more hour', 360, 450, 40, PW(33, 'one more hour'));
}

function sArchive(n) {
  archive('ar' + n, { desk: n > 1, rec: n === 2 ? TT >= PW(91, 'begin to record') : n === 3 ? TT < PW(99, 'You listen back') : false });
  if (n === 1) {
    you(700, 1000, { s: 0.9, pose: TT < P(34) + 4 ? 'walk' : 'stand', mood: 'focus', key: 'ya1' });
    label('every book', 340, 120, 38, PW(34, 'every book')); label('every recording', 1580, 120, 38, PW(34, 'every recording'));
    label('every photograph', 340, 880, 38, PW(34, 'every photograph')); label('we were here', 960, 1000, 50, PW(34, 'we were here'), { fill: '#e6f4f2' });
  } else {
    chair(900, 1000, 0.95, 'arc' + n, '#7a5a3a');
    you(900, 1000, { s: 0.95, pose: 'chair', mood: n === 3 ? 'sad' : 'focus', key: 'ya' + n, grey: true, arms: n === 2 && TT < P(91) ? 'down' : 'console' });
    if (n === 3 && TT >= P(100)) { const u = sm(TT, P(100), P(100) + 3); cut(rect(1180, 380, 500, 40, 8), '#1d2229', { key: 'upb' }); cut(rect(1180, 380, 500 * u, 40, 8), COL.screenL, { key: 'upf', shadow: false, grain: false }); label('added to the archive', 1430, 320, 36, P(100) + 0.3); }
    if (n === 2) label('a constant stream, for centuries', 960, 160, 44, P(90));
  }
}

function sHospital() {
  wallFill('#2d3a40', 'ho', pat.lines('rgba(255,255,255,0.04)', 70));
  cut(rect(160, 140, 360, 260, 12), '#1b2333', { key: 'hoW', sb: 8 });
  cut([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], '#232c31', { key: 'hoF', sy: -4 });
  // the bed, a sleeper, the heart monitor
  cut(rect(560, 640, 760, 60, 10), '#d8d4cc', { key: 'bed' });
  cut(capsulePts(640, 600, 1220, 610, 120), '#cfd6de', { key: 'blk', pat: pat.lines('rgba(0,0,0,0.06)', 20) });
  cut(ellipsePts(600, 580, 60, 50, 0, 20), COL.skin, { key: 'slp' }); face(606, 586, 0.8, 'focus');
  cut(rect(1400, 380, 300, 200, 12), '#1d2229', { key: 'hm' });
  const Q = []; for (let i = 0; i <= 60; i++) { const tt = TT - (60 - i) * 0.02, ph = mod(tt, 1.1), v = ph < 0.08 ? -Math.sin(ph / 0.08 * Math.PI) * 50 : 0; Q.push([1420 + i * 4.3, 500 + v]); }
  ink(Q, { w: 4, color: '#7be3a0', key: 'hmL', raw: true });
  const sit = TT >= PW(37, 'Someone should be there');
  chair(1040, 1000, 0.9, 'hoC');
  if (sit) you(1040, 1000, { s: 0.9, pose: 'chair', mood: 'sad', key: 'yho' });
  else you(lerp(1700, 1500, sm(TT, P(37), P(37) + 3)), 1000, { s: 0.9, mood: 'sad', key: 'yho', pose: 'walk', flip: true });
}

function sDrag() {
  wallFill('#7a1f1a', 'dg', pat.dots('rgba(255,140,90,0.12)', 12, 70));
  for (let i = 0; i < 5; i++) { const y = 200 + i * 180, sh = Math.sin(TT * 0.6 + i) * 40; cut([[-40, y + sh], [W + 40, y - sh], [W + 40, y + 60 - sh], [-40, y + 60 + sh]], 'rgba(224,80,58,0.35)', { key: 'dgb' + i, shadow: false, grain: false }); }
  const u = lin(TT, P(39), PE(39)), ex = lerp(1500, 600, u), ey = lerp(420, 640, u);
  for (let i = 1; i < 14; i++) { ctx.fillStyle = `rgba(255,190,110,${0.5 * (1 - i / 14)})`; ctx.beginPath(); ctx.arc(ex + i * 34, ey - i * 10, 46 - i * 2.5, 0, TAU); ctx.fill(); }
  glow(ex, ey, 70, '#ffb070', 0.5);
  planet(ex, ey, 60, 'burnt', 'dgE', { sb: 0 });
  label('a wake', ex + 260, ey - 140, 40, PW(39, 'a wake'));
  label('almost a vacuum', 400, 180, 40, PW(39, 'almost a vacuum'));
  label('30 km / second', 960, 940, 50, PW(39, 'thirty kilometers'));
  label('every orbit, a little deeper', 1350, 940, 40, PW(39, 'Every orbit'));
}

function sStationVoice(n) {
  wallFill('#2b3240', 'sv' + n, pat.lines('rgba(255,255,255,0.04)', 60));
  monitorFrame(330, 110, 1260, 660, 'svm' + n, () => {
    const t = n === 1 ? P(41) : P(107), speak = TT >= t && TT < (n === 1 ? PE(41) : PE(107));
    for (let i = 0; i < 40; i++) { const h = speak ? 20 + 80 * Math.abs(Math.sin(TT * 9 + i * 0.7) * Math.sin(TT * 3.1 + i)) : 8; cut(rect(420 + i * 27, 300 - h / 2, 14, h, 4), COL.screenL, { key: 'wv' + i, shadow: false, grain: false }); }
    if (n === 1) {
      monoText('ORBITAL DECAY: UNCERTAIN', 420, 520, 50, COL.screenL, { count: typed('ORBITAL DECAY: UNCERTAIN', t), key: 'od', jit: 0.3 });
      monoText('DECADES  ...  SEVERAL CENTURIES', 420, 610, 44, 'rgba(123,227,200,0.75)', { count: typed('DECADES  ...  SEVERAL CENTURIES', PW(41, 'Estimates')), key: 'od2', jit: 0.3 });
    } else {
      monoText('POWER RESERVES', 420, 500, 50, COL.screenL, { key: 'pw', jit: 0.3 });
      const v = Math.round(lerp(100, 31, sm(TT, t, t + 1.5)));
      cut(rect(420, 560, 1000, 60, 8), '#1d4a4a', { key: 'pwb', shadow: false }); cut(rect(420, 560, 10 * v, 60, 8), v > 40 ? COL.screenL : '#f6cf55', { key: 'pwf', shadow: false, grain: false });
      monoText(`${v}%`, 1300, 500, 50, v > 40 ? COL.screenL : '#f6cf55', { key: 'pwv', jit: 0.3 });
    }
  });
  cut(ellipsePts(960, 920, 120, 120, 0, 36), '#2a2f3a', { key: 'spk' + n }); for (let i = 0; i < 4; i++) dot(960, 920, 100 - i * 24, i % 2 ? '#2a2f3a' : '#3a3f4a');
}

function sSinking() {
  wallFill('#3a0f0c', 'sk');
  const u = lin(TT, P(42), PE(42) + 1);
  const bx = 960, by = 560 + u * 160, tilt = 0.12 + u * 0.35;
  for (let i = 0; i < 6; i++) {
    const y = 520 + i * 90, Q = []; for (let x = -40; x <= W + 40; x += 60) Q.push([x, y + Math.sin(x * 0.008 + TT * (0.8 + i * 0.1) + i) * 22]);
    if (i === 2) { ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt); cut([[-170, -40], [170, -40], [110, 50], [-110, 50]], '#e8eef2', { key: 'boat', pat: pat.lines('rgba(0,0,0,0.06)', 14) }); cut([[0, -40], [0, -230], [130, -60]], '#fbf6ea', { key: 'sail' }); planet(-60, -110, 34, 'earth', 'bE', { sb: 0 }); ctx.restore(); }
    cut([...Q, [W + 40, H + 40], [-40, H + 40]], ['#c8322b', '#d84a36', '#b02a24', '#e0603e', '#a82620', '#8a1f1a'][i], { key: 'wave' + i, sb: 10, sy: -4, grain: 0.4 });
  }
  label('inch by inch', 960, 160, 52, PW(42, 'inch by inch'), { write: true });
}

function sBay() {
  wallFill('#3a3f4a', 'by', pat.stripes('rgba(255,255,255,0.04)', 10, 140));
  label('BAY 4', 260, 150, 60, P(45) - 0.4, { fill: '#f6cf55' });
  cut([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], '#2a2f3a', { key: 'byF', sy: -4, pat: pat.stripes('rgba(246,207,85,0.25)', 30, 140, 0.8) });
  cut(rect(820, 760, 400, 100, 8), '#5a6577', { key: 'stand' });
  probe(1020, 620, 1.3, 'byP');
  you(640, 1000, { arms: 'reach', reach: [240, -440], mood: 'focus', key: 'yby' });
  if ((B % 10) < 5 && TT < PW(45, 'You barely sleep')) for (let i = 0; i < 6; i++) { const R = RNG('spark', B, i); sparkle(890 + R.n(30), 560 + R.n(30), R.r(8, 16), '#ffd27a'); }
  label('3 days', 1500, 300, 50, PW(45, 'three days'));
  const d = popS(PW(45, 'dream of oceans'));
  if (d > 0) { ctx.save(); ctx.translate(420, 330); ctx.scale(d, d); cut(ellipsePts(0, 0, 200, 120, 0, 30), '#fbf6ea', { key: 'drm' }); for (let i = 0; i < 3; i++) { const Q = []; for (let x = -150; x <= 150; x += 20) Q.push([x, -30 + i * 34 + Math.sin(x * 0.05 + TT * 3 + i) * 10]); ink(Q, { w: 8, color: COL.ocean, key: 'dw' + i }); } ctx.restore(); dot(560, 470, 16, '#fbf6ea'); dot(600, 530, 10, '#fbf6ea'); }
}

function sLaunch() {
  titanOutside('la', { lit: 1 });
  const u = sm(TT, P(46) + 0.8, PE(46) + 3);
  const x = lerp(1130, 1700, u), y = lerp(560, -40, u);
  if (u > 0) { for (let i = 1; i < 12; i++) { ctx.fillStyle = `rgba(255,210,122,${0.6 * (1 - i / 12)})`; ctx.beginPath(); ctx.arc(x - i * 20 * (570 / 600), y + i * 26, 30 - i * 2, 0, TAU); ctx.fill(); } glow(x, y + 30, 50, COL.engine, 0.7); }
  probe(x, y, 0.5, 'laP', { rot: -1.1 });
  label('day 4', 400, 200, 54, P(46));
}

function sCore() {
  wallFill('#2b3240', 'co', pat.lines('rgba(255,255,255,0.04)', 60));
  const pulse = 0.5 + 0.5 * Math.sin(TT * 2);
  glow(800, 540, 230, '#7be3c8', 0.3 + 0.15 * pulse);
  cut(ellipsePts(800, 540, 300, 300, 0, 60), '#2a2f3a', { key: 'coR' });
  cut(ellipsePts(800, 540, 200, 200, 0, 50), '#3fb8a8', { key: 'coB', crayon: '#7be3c8', crAl: 0.4, sb: 20, shc: 'rgba(123,227,200,0.6)', sy: 0 });
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(800, 540, 250, 80, i * 1.05 + TT * 0.3, 0, TAU); ctx.stroke(); }
  // the math on a board
  cut(rect(1250, 160, 560, 560, 10), '#1d2a24', { key: 'brd' });
  const lines = ['power  -  probe', 'hours left?', 'x 365 x 9', '= less every year'];
  lines.forEach((s, i) => handText(s, 1290, 260 + i * 110, 52, '#e8eee6', { key: 'bl' + i, frac: ev(PW(47, 'You know the math') + i * 0.8, 0.8) }));
  for (let i = 0; i < 9; i++) ink([[1300 + i * 30, 640], [1310 + i * 30, 690]], { w: 5, color: '#e8eee6', key: 'tl' + i, frac: ev(PW(47, 'every night') + i * 0.15, 0.2) });
  label('borrowed against the future', 800, 960, 44, PW(47, 'borrowed'));
  if (TT >= P(48)) label('launched', 1530, 860, 50, P(48), { fill: '#e6f4f2' });
}

function sCorridor(n) {
  corridor('cr' + n, { dark: n === 2 ? 0.45 : 0 });
  if (n === 1) {
    const u = lin(TT, P(49), PE(49));
    you(lerp(960, 1040, u), lerp(620, 1060, u), { s: lerp(0.3, 0.95, u), pose: 'walk', mood: TT >= PW(49, 'Sometimes you talk') ? 'smile' : 'focus', key: 'yc1', arms: TT >= PW(49, 'You read') && TT < PW(49, 'You walk') ? 'cup' : 'down', steam: false });
    if (TT >= PW(49, 'Sometimes you talk') && TT < PW(49, 'You catch yourself')) ghostly(0.35, () => { for (let i = 0; i < 2; i++) you(700 + i * 520, 1040, { s: 0.85, mood: 'smile', key: 'ghost' + i, body: '#cfd6de', bodyD: '#aab2bc' }); });
  } else {
    you(960, 640, { s: 0.32, pose: TT < P(77) ? 'walk' : 'stand', mood: 'focus', key: 'yc2', grey: true, arms: 'cup', steam: false });
    label('walking empty corridors', 1450, 220, 40, PW(76, 'walking empty'));
    label('making tea', 1450, 320, 40, PW(76, 'making tea'));
    label('staring at screens', 1450, 420, 40, PW(76, 'staring'));
  }
}

function sPod(n) {
  if (n === 1) {
    const yrs = Math.round(83 * sm(TT, P(51), PE(51) + 1.5));
    const open = sm(TT, P(52) + 0.5, P(52) + 2.5);
    podBay('pb1', { sleeping: open < 0.7, frost: 0.2 + 0.8 * sm(TT, P(50), P(51) + 2) * (1 - open), open, years: yrs });
    if (open >= 0.7) you(1200, 1000, { s: 0.9, mood: 'focus', key: 'ypb', arms: 'face' });
    label('83 years', 960, 160, 60, P(51), { fill: '#e6f4f2' });
  } else {
    podBay('pb2', { open: 0.9, years: 0 });
    tag('OFF', 960, 560, 60, { rot: -0.1, fill: '#f6cf55' });
    you(1250, 1000, { s: 0.9, mood: TT >= PW(83, 'You would rather') ? 'smile' : 'focus', key: 'ypb2', grey: true });
  }
}

function sProbeView() {
  spaceWall('pv');
  sun(2300, 540, 1250, 'giant', 'pvS');
  const g = TT >= P(55) ? 1 : 0.5;
  glow(1150, 520, 190, '#ff7b2e', 0.35 * g);
  planet(1150, 520, 160, TT >= P(55) ? 'molten' : 'burnt', 'pvE', { lit: 'right' });
  probe(330, 700, 1.4, 'pvP', { rot: 0.1 });
  label('the probe has arrived', 400, 160, 46, P(53) + 0.4);
}

function sMolten() {
  wallFill('#2a0e0a', 'mo');
  const R = RNG('mo');
  for (let i = 0; i < 14; i++) { const Q = []; let x = R.r(-100, W), y = R.r(0, H); for (let k = 0; k < 9; k++) { Q.push([x, y]); x += R.r(60, 200); y += R.n(120); } const fl = 0.75 + 0.25 * Math.sin(TT * 2 + i); ink(Q, { w: R.r(14, 34), color: `rgba(255,${Math.round(110 + 60 * fl)},46,0.95)`, key: 'lv' + i }); }
  const sh = (t, pts, key) => { const f = ev(t, 2.5); if (f > 0) ink(pts, { w: 8, color: 'rgba(255,240,210,0.7)', frac: f, key, closed: true }); };
  sh(PW(56, 'trace the shapes'), ellipsePts(560, 420, 260, 330, 0.3, 30), 'ct1');
  sh(PW(56, 'trace the shapes') + 1, ellipsePts(1350, 380, 330, 200, -0.2, 30), 'ct2');
  label('the old ocean basins', 1350, 700, 40, PW(56, 'dried basins'));
  label('mountain ranges', 560, 860, 40, PW(56, 'ancient ridges'));
  if (TT >= PW(56, 'every city')) for (let i = 0; i < 8; i++) { const h = 80 + (i * 53) % 120, x = 760 + i * 60, melt = sm(TT, PW(56, 'now melting'), PE(56) + 1); cut(rect(x, 960 - h * (1 - melt), 50, h * (1 - melt) + 4, 2), '#1a0806', { key: 'city' + i, shadow: false }); }
}

function sInside() {
  wallFill('#7a1f1a', 'in');
  for (let i = 6; i >= 1; i--) { ctx.fillStyle = `rgba(224,80,58,${0.12 + i * 0.03})`; ctx.beginPath(); ctx.arc(1000, 540, 120 + i * 110 + Math.sin(TT + i) * 10, 0, TAU); ctx.fill(); }
  glow(1000, 540, 120, '#ffb070', 0.4);
  planet(1000, 540, 110, 'molten', 'inE', { sb: 0 });
  label("Earth's own air: long gone", 420, 200, 40, PW(57, 'long gone'));
  label("this is the Sun's atmosphere", 1500, 200, 40, PW(57, "Sun"));
  label('orbiting inside a star', 1000, 900, 50, PW(57, 'orbiting inside'), { write: true });
}

function sWitness() {
  wallFill('#2b3240', 'wt', pat.lines('rgba(255,255,255,0.04)', 60));
  // an eye: the last eyes humanity has, with Earth in its iris
  cut(ellipsePts(960, 520, 560, 260, 0, 60).map(([x, y]) => [x, 520 + (y - 520) * (0.4 + 0.6 * Math.abs(Math.cos((x - 960) / 560 * Math.PI / 2)))]), '#f3ead6', { key: 'eyeW', sb: 18 });
  const blinkK = (B % 60) < 2 ? 0.1 : 1;
  ctx.save(); ctx.translate(960, 520); ctx.scale(1, blinkK);
  cut(ellipsePts(0, 0, 200, 200, 0, 40), '#3f9f9a', { key: 'iris', crayon: '#2d7773', crAl: 0.4 });
  cut(ellipsePts(0, 0, 100, 100, 0, 30), '#141a33', { key: 'pupil', shadow: false });
  glow(0, 0, 40, '#ff7b2e', 0.4); planet(0, 0, 34, 'molten', 'wtE', { sb: 0 });
  ctx.restore();
  const rec = (B % 24) < 14; dot(220, 160, 18, rec ? '#f05a5a' : '#5a2a2e'); label('REC', 300, 160, 34, P(58), { tape: false });
  label('a witness', 960, 900, 56, PW(59, 'You are a witness'), { write: true });
  label('the last eyes humanity has', 960, 1000, 42, PW(59, 'last eyes'));
}

function sWhite() {
  const t = PW(60, 'Its final transmission');
  if (TT < t) {
    spaceWall('wh'); sun(2200, 540, 1400, 'giant', 'whS');
    probe(700, 540, 1.6, 'whP', { rot: 0.05 });
    const heat = sm(TT, P(60), t);
    cut(rect(1300, 200, 460, 60, 8), '#1d2229', { key: 'hb' }); cut(rect(1300, 200, 460 * heat, 60, 8), heat > 0.7 ? '#f05a5a' : '#f6cf55', { key: 'hf', shadow: false, grain: false });
    label('day 11: shielding failing', 1530, 320, 38, P(60) + 0.3);
    return;
  }
  wallFill('#f4f1e8', 'whW');
  const R = RNG('wn', B); ctx.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 400; i++) ctx.fillRect(R.r(0, W), R.r(0, H), R.r(2, 8), 2);
  glow(960, 540, 150, '#ffffff', 0.6);
  cut(ellipsePts(960, 540, 120, 120, 0, 40), '#2a2a30', { key: 'whE', shadow: false, sb: 20 });
}

function sNothing() {
  wallFill('#0c0e14', 'no');
  const R = RNG('nz', B); ctx.fillStyle = 'rgba(200,200,210,0.12)'; for (let i = 0; i < 900; i++) ctx.fillRect(R.r(0, W), R.r(0, H), R.r(2, 6), 2);
  if (TT > P(62) + 0.6) monoText('NO SIGNAL', 800, 560, 54, 'rgba(123,227,200,0.6)', { key: 'nos', jit: 0.4 });
}
