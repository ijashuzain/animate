
// =====================================================================
//  SCENES A — the morning, the alarm, the news, the Sun's story, Earth's oceans, the migration (paragraphs 0–26)
// =====================================================================

function sTitle() {
  titanOutside('ti', { lit: 1 });
  label("You're the Last Human Alive", 960, 170, 76, 0.6, { write: true, fill: '#fbf6ea' });
  label('When the Sun Finally Begins to Die', 960, 290, 54, 1.6, { write: true, rot: 0.015, fill: '#fbf6ea' });
}

function sGalley(n) {
  galley('ga' + n, { clockT: n === 2 ? P(116) : -1 });
  const late = n === 2;
  const clicked = late ? false : TT >= PW(3, 'clicks off');
  kettle(520, 640, 1, 'ket' + n, late ? TT > P(117) - 0.2 : !clicked);
  if (!late && TT >= PW(3, 'You reach')) { you(900, 1060, { s: 0.95, arms: 'reach', reach: [-180, -420], mood: 'smile', key: 'yg' + n, flip: true }); mug(690, 572, 0.7, COL.cup, 'cupG', false); }
  else if (late && TT >= P(117)) you(900, 1060, { s: 0.95, arms: 'cup', mood: 'smile', key: 'yg' + n, grey: true });
  else you(900, 1060, { s: 0.95, arms: TT < PW(2, 'There is no morning') || late ? 'console' : 'down', mood: 'focus', key: 'yg' + n, flip: TT >= PW(2, 'There is no morning') && TT < PW(2, 'But you keep') && !late, grey: late });
  if (!late) label('6:14 a.m.', 1210, 420, 40, P(1) + 0.4, { rot: 0.02 });
}

function sAlarm() {
  galley('al');
  kettle(520, 640, 1, 'ketA', false);
  const set = TT >= PW(5, 'You set the cup'), go = TT >= PW(5, 'Your hands');
  if (set) mug(690, 572, 0.7, COL.cup, 'cupA', false);
  const x = go ? lerp(900, 1500, sm(TT, PW(5, 'Your hands'), PW(5, 'Your hands') + 3)) : 900;
  you(x, 1060, { s: 0.95, arms: set ? 'down' : 'cup', mood: 'wow', key: 'ya', pose: go && TT < PW(5, 'Your hands') + 3 ? 'walk' : 'stand', shake: go, steam: false });
  // the alarm light floods the room, pulsing
  const k = 0.5 + 0.5 * Math.sin((TT - P(4)) * TAU * 1.0);
  ctx.fillStyle = `rgba(255,40,30,${0.08 + 0.16 * k})`; ctx.fillRect(0, 0, W, H);
  alarmLamp(960, 40, true, 'alm');
  label('11 years', 1500, 300, 50, PW(5, 'eleven years'), { rot: 0.03 });
}

function sConsole(kind) {
  wallFill('#2b3240', 'cn' + kind, pat.lines('rgba(255,255,255,0.04)', 60));
  monitorFrame(330, 110, 1260, 660, 'mon' + kind, () => {
    if (kind === 'alert') {
      const red = 0.5 + 0.5 * Math.sin(TT * TAU);
      cut(rect(330, 110, 1260, 90, 0), `rgb(${Math.round(120 + 100 * red)},30,30)`, { key: 'hdr', shadow: false, grain: false, shade: false });
      monoText('PRIORITY ALERT', 380, 175, 46, '#ffe0d8', { key: 'pa', jit: 0.3 });
      const msg1 = 'EARTH HAS ENTERED THE', msg2 = 'OUTER ENVELOPE OF THE SUN.', t = P(7) - 0.3;
      monoText(msg1, 400, 420, 60, COL.screenL, { count: typed(msg1 + msg2, t, 16), key: 'm1', jit: 0.4 });
      monoText(msg2, 400, 510, 60, COL.screenL, { count: Math.max(0, typed(msg1 + msg2, t, 16) - msg1.length), key: 'm2', jit: 0.4 });
      if (TT < t && B % 12 < 6) cut(rect(400, 370, 34, 60, 0), COL.screenL, { key: 'cur', shadow: false, grain: false });
    } else {
      monoText('LONG-RANGE FEED', 380, 190, 46, COL.screenL, { key: 'lr', jit: 0.3 });
      const u = lin(TT, P(12), PE(12) + 1.5);
      cut(rect(400, 420, 1100, 40, 6), '#1d4a4a', { key: 'barb', shadow: false });
      cut(rect(400, 420, 1100 * u, 40, 6), COL.screenL, { key: 'barf', shadow: false, grain: false });
      monoText('ACQUIRING SIGNAL...', 400, 560, 40, COL.screenL, { count: typed('ACQUIRING SIGNAL...', P(12) + 0.3), key: 'acq', jit: 0.3 });
      monoText('SATURN / TITAN  ->  INNER SYSTEM', 400, 640, 34, 'rgba(123,227,200,0.7)', { key: 'rt', jit: 0.3 });
    }
  });
  // your hands on the desk, shaking
  cut(rect(-40, 880, W + 80, 260, 8), '#3a3f4a', { key: 'desk' + kind, sy: -6 });
  const sh = kind === 'alert' ? Math.sin(TT * 40) * 4 : 0;
  for (const [x, k] of [[760 + sh, 'l'], [1160 - sh, 'r']]) { cut(capsulePts(x, 1120, x + (k === 'l' ? 40 : -40), 920, 90, 6), COL.you, { key: 'arm' + k + kind }); cut(ellipsePts(x + (k === 'l' ? 44 : -44), 905, 56, 40, 0, 20), COL.skin, { key: 'hand' + k + kind }); }
}

function sFloor() {
  deck('df', { console: true });
  you(760, 1000, { pose: 'sit', arms: 'knees', mood: 'sad', key: 'yf' });
  label('x3', 1600, 420, 60, PW(8, 'three times') + 0.2);
}

function sMemories() {
  spaceWall('me');
  const swallow = sm(TT, PW(9, 'is now inside'), PE(9) + 0.5);
  planet(960, 540, 190, 'earth', 'meE');
  const icon = (t, x, y, draw) => { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); draw(); ctx.restore(); };
  icon(PW(9, 'every war'), 600, 300, () => { cut(capsulePts(-50, 50, 50, -50, 14), '#b9bfc8', { key: 'sw1' }); cut(capsulePts(50, 50, -50, -50, 14), '#b9bfc8', { key: 'sw2' }); label('every war', 0, 110, 34, -1); });
  icon(PW(9, 'every song'), 1320, 300, () => { ink([[-20, 40], [-20, -50], [40, -60], [40, 30]], { w: 10, color: '#f6cf55', key: 'nt' }); dot(-32, 44, 20, '#f6cf55'); dot(28, 34, 20, '#f6cf55'); label('every song', 0, 110, 34, -1); });
  icon(PW(9, 'every first word'), 600, 800, () => { cut(ellipsePts(0, 0, 90, 60, 0, 30).concat([[20, 60], [-10, 100], [-20, 55]]), '#fbf6ea', { key: 'bub' }); handText('ma-ma', -64, 14, 40, PAL.ink, { key: 'mama' }); });
  icon(PW(9, 'every grave'), 1320, 800, () => { cut([[-50, 60], [-50, -30], [0, -70], [50, -30], [50, 60]], '#9a958c', { key: 'grv', pat: pat.dots('rgba(0,0,0,0.1)', 3, 14) }); ink([[0, -40], [0, 20]], { w: 8, color: '#5a5650', key: 'gx1' }); ink([[-22, -18], [22, -18]], { w: 8, color: '#5a5650', key: 'gx2' }); });
  if (swallow > 0) { ctx.fillStyle = `rgba(200,50,43,${0.55 * swallow})`; ctx.fillRect(0, 0, W, H); sun(W + 900 - swallow * 700, 540, 1100, 'giant', 'meS'); }
}

function sTiny() {
  system('ty', 120, 560, 360, 'giant', [['mars', 640, 2.2, 22], ['jupiter', 1000, 0.2, 62], ['saturn', 1340, 0.0, 44]], { tilt: 0.25, spin: 0.002 });
  const sx = 120 + 1340 * Math.cos(TT * 0.002 * 300 / 1340), sy = 560 + 1340 * 0.25 * Math.sin(TT * 0.002 * 300 / 1340);
  dot(sx + 70, sy - 20, 9, COL.you);
  label('you', sx + 70, sy - 90, 40, PW(10, 'the only person'), { fill: '#e6f4f2' });
  label('the only one left', 960, 980, 46, PW(10, 'solar system'), { write: true });
}

function sBreathe() {
  deck('db', {});
  you(760, 1000, { pose: 'sit', arms: 'palm', mood: 'focus', key: 'yb' });
  // the breathing square: in, hold, out
  const t0 = PW(11, 'In for four'), side = (i) => [[[200, 200], [420, 200]], [[420, 200], [420, 420]], [[420, 420], [200, 420]], [[200, 420], [200, 200]]][i];
  const step = 1.3;
  for (let i = 0; i < 4; i++) { const f = ev(t0 + i * step, step); if (f > 0) ink(side(i), { w: 10, color: '#7be3c8', frac: f, key: 'br' + i }); }
  label('in 4', 310, 160, 36, t0, { tape: false }); label('hold 4', 500, 310, 36, t0 + step, { tape: false }); label('out 4', 310, 470, 36, t0 + step * 2, { tape: false });
}

function sHalcyon() {
  titanOutside('ha', { lit: 1 });
  label('HALCYON', 960, 160, 70, PW(11, 'It is called'), { fill: '#fbf6ea' });
  label('built for 300', 520, 300, 44, PW(11, 'three hundred'), { rot: -0.03 });
  label('for nine years: 1', 1400, 300, 44, PW(11, 'For the last nine'), { rot: 0.03 });
}

function sLight() {
  spaceWall('li');
  sun(150, 540, 240, 'giant', 'liS');
  planet(1720, 540, 70, 'saturn', 'liSat'); planet(1720 - 150, 600, 20, 'titan', 'liTi');
  ctx.strokeStyle = 'rgba(255,246,220,0.35)'; ctx.lineWidth = 3; ctx.setLineDash([12, 14]); ctx.beginPath(); ctx.moveTo(400, 540); ctx.lineTo(1540, 590); ctx.stroke(); ctx.setLineDash([]);
  const u = lin(TT, P(13), PE(13));
  glow(lerp(400, 1540, u), lerp(540, 590, u), 26, '#fff2c8', 0.8); dot(lerp(400, 1540, u), lerp(540, 590, u), 12, '#fff2c8');
  label('1.4 billion km', 960, 420, 44, PW(13, 'billion'));
  label(`light: ${String(Math.round(u * 80)).padStart(2, '0')} min`, 960, 720, 44, PW(13, 'eighty minutes'), { tape: false });
  label('you are watching a memory', 960, 900, 46, PW(13, 'watching a memory'), { write: true });
}

function sSunCalm() {
  spaceWall('sc', '#16223f');
  sun(960, 470, 230, 'calm', 'scS');
  planet(1500, 640, 34, 'earth', 'scE');
  // early humans worship on a hill
  if (TT >= PW(15, 'early humans')) {
    cut([[-40, 1100], [300, 900], [700, 960], [1100, 1100]], '#1b2333', { key: 'hill', shadow: false });
    for (let i = 0; i < 5; i++) { const x = 180 + i * 90, y = 960 + i * 12; you(x, y, { s: 0.22, arms: 'up', mood: 'happy', key: 'wor' + i, body: '#a07848', bodyD: '#7a5a3a' }); }
  }
  label('4 million tons / second', 960, 830, 48, PW(15, 'four million'));
  // the image resolves out of static
  const st = 1 - lin(TT, P(14), PE(14) + 0.6);
  if (st > 0) { const R = RNG('static', B); ctx.fillStyle = `rgba(200,200,200,${0.9 * st})`; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(40,40,40,0.9)'; for (let i = 0; i < 2500 * st; i++) ctx.fillRect(R.r(0, W), R.r(0, H), R.r(2, 10), 3); }
}

function sGauge() {
  wallFill('#2b3240', 'gg', pat.lines('rgba(255,255,255,0.04)', 60));
  sun(1500, 300, 110, 'calm', 'ggS');
  cut(rect(560, 180, 420, 720, 40), '#2a2f3a', { key: 'tank' });
  const lvl = 1 - sm(TT, P(16), PW(16, 'ran out') + 0.8);
  cut(rect(600, 220 + 640 * (1 - lvl), 340, 640 * lvl + 2, 20), '#f6cf55', { key: 'fuel', shadow: false, pat: pat.stripes('rgba(255,255,255,0.2)', 10, 40, 0.5) });
  handText('H', 720, 600, 160, lvl > 0.3 ? '#2a1d18' : '#f6cf55', { key: 'H', weight: 700 });
  label('core hydrogen', 770, 980, 44, P(16) + 0.2);
  label('EMPTY', 770, 120, 50, PW(16, 'ran out') + 0.6, { fill: '#ffd8d0' });
}

function sCutaway() {
  spaceWall('cw');
  const grow = sm(TT, PW(17, 'pushed the outer'), PW(17, 'swelled') + 1);
  const R0 = lerp(330, 470, grow);
  cut(ellipsePts(960, 540, R0, R0, 0, 72), mixHex('#f6cf55', '#c8322b', grow), { key: 'cwO', sb: 20, crayon: '#9a1f1a', crAl: 0.25 });
  cut(ellipsePts(960, 540, 200, 200, 0, 60), '#e6a92e', { key: 'cwM', shadow: false });
  const shell = ev(PW(17, 'ignited a shell'), 0.6);
  if (shell > 0) { ctx.strokeStyle = `rgba(255,236,170,${0.6 + 0.4 * Math.sin(TT * 12)})`; ctx.lineWidth = 26 * shell; ctx.beginPath(); ctx.arc(960, 540, 125, 0, TAU); ctx.stroke(); glow(960, 540, 130, '#fff2c8', 0.3 * shell); }
  const col = sm(TT, PW(17, 'core began to collapse'), PW(17, 'hotter and denser') + 1);
  cut(ellipsePts(960, 540, lerp(110, 70, col), lerp(110, 70, col), 0, 40), mixHex('#f08a4b', '#ffffff', col), { key: 'cwC', sb: 12, shc: 'rgba(255,255,255,0.6)', sy: 0 });
  label('core: collapsing, hotter', 360, 300, 40, PW(17, 'core began to collapse'));
  label('hydrogen shell: burning', 1560, 300, 40, PW(17, 'ignited a shell'));
  label('outer layers: swelling', 1560, 860, 40, PW(17, 'pushed the outer'));
}

function sGiant() {
  spaceWall('gi');
  sun(1500, 540, 760, 'giant', 'giS');
  sun(240, 540, 14, 'calm', 'giC');
  label('the Sun you knew', 240, 460, 34, P(18) + 0.4);
  label('200x wider', 760, 220, 52, PW(18, 'two hundred'), { fill: '#fbf6ea' });
  label('~3,000 degrees', 760, 540, 46, PW(18, 'three thousand'));
  label('thousands of times brighter', 760, 860, 46, PW(18, 'thousands of times'));
}

function sSwallow() {
  spaceWall('sw');
  sun(-160, 540, 760, 'giant', 'swS');
  const go = (t, x0, y0, r, kind, key) => { const u = sm(TT, t, t + 1.4); if (u >= 1) return; planet(lerp(x0, 560, u), lerp(y0, 540, u), r * (1 - u * 0.7), kind, key); };
  go(PW(19, 'Mercury is gone'), 820, 360, 26, 'mercury', 'swMe');
  go(PW(19, 'Venus is gone'), 1000, 700, 44, 'venus', 'swVe');
  label('Mercury', 820, 280, 40, P(19) - 0.2); label('Venus', 1000, 800, 40, P(19) - 0.2);
  for (const t of [PW(19, 'Mercury is gone') + 1.4, PW(19, 'Venus is gone') + 1.4]) { const k = ev(t, 0.8); if (k > 0 && k < 1) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; sparkle(560 + Math.cos(a) * 80 * k, 540 + Math.sin(a) * 80 * k, 20 * (1 - k), '#ffd27a'); } }
}

function sSpeck() {
  wallFill('#3a0f0c', 'spk');
  // the edge of the red ocean of plasma
  cut(ellipsePts(-500, 1400, 1900, 1300, 0, 90), COL.sun, { key: 'spS', crayon: '#9a1f1a', crAl: 0.35, sb: 40, shc: 'rgba(240,90,50,0.7)', sy: 0 });
  const R = RNG('spk'); for (let i = 0; i < 30; i++) { const a = R.r(-1.6, -0.3), d = R.r(1100, 1290), gr = R.r(30, 70) * (0.8 + 0.2 * Math.sin(TT + i)); cut(ellipsePts(-500 + Math.cos(a) * d, 1400 + Math.sin(a) * d * 0.68, gr, gr * 0.7, a, 14), COL.sunL, { key: 'spg' + i, shadow: false, grain: false }); }
  glow(1300, 520, 30, '#f08a4b', 0.4);
  planet(1300, 520, 22, 'burnt', 'spE', { sb: 0 });
  label('Earth', 1300, 420, 50, P(21), { fill: '#fbf6ea' });
}

function sOceans() {
  spaceWall('oc');
  const t1 = PW(22, 'brightened'), t2 = PW(22, 'The oceans warmed'), t3 = PW(22, 'hydrogen escaped'), t4 = PW(22, 'The blue planet dried'), t5 = PW(22, 'cracked, glowing');
  const bright = sm(TT, t1, t1 + 2);
  sun(-80, 540, 300 + bright * 40, 'calm', 'ocS'); if (bright > 0) glow(-80, 540, 420, '#fff2c8', 0.25 * bright);
  const kind = TT < t4 ? 'earth' : TT < t5 ? 'dry' : 'burnt';
  planet(1100, 540, 260, kind, 'ocE');
  if (TT >= t2 && TT < t5) for (let i = 0; i < 7; i++) { const Q = []; const x0 = 920 + i * 60; for (let k = 0; k <= 10; k++) Q.push([x0 + Math.sin(k * 0.8 + i + TT * 2) * 14, 330 - k * 22 - mod(TT * 30 + i * 20, 60)]); ink(Q, { w: 7, color: 'rgba(255,255,255,0.55)', key: 'stm' + i }); }
  if (TT >= t3 && TT < t5 + 2) for (let i = 0; i < 8; i++) { const k = mod(TT * 0.4 + i / 8, 1); handText('H', 900 + i * 55 + k * 120, 120 - k * 200 + 160, 44, `rgba(255,246,220,${1 - k})`, { key: 'hh' + i, weight: 700 }); }
  if (kind === 'burnt') glow(1100, 540, 270, '#ff7b2e', 0.15);
  label('+10% brighter', 300, 220, 46, t1);
  label('the oceans boil away', 1100, 900, 44, t2);
  label('hot enough to melt lead', 1100, 900, 44, PW(22, 'melt lead') - 0.4, { fill: '#ffd8d0' });
}

function sMigration() {
  spaceWall('mg');
  const P4 = [[250, 600, 90, 'burnt'], [620, 560, 60, 'mars'], [1060, 540, 140, 'jupiter'], [1560, 560, 100, 'saturn']];
  P4.forEach(([x, y, r, k], i) => planet(x, y, r, k, 'mg' + k));
  planet(1180, 380, 22, TT >= PW(23, 'thawing') ? 'ice' : 'europa', 'mgEu'); planet(1700, 700, 26, 'titan', 'mgTi');
  const hops = [PW(23, 'First to Mars'), PW(23, 'Then to the moons'), PW(23, 'Then here')];
  let x = 250, y = 470;
  hops.forEach((t, i) => { const u = sm(TT, t, t + 1.5); x = lerp(x, [620, 1180, 1700][i], u); y = lerp(y, [470, 330, 640][i], u) - Math.sin(u * Math.PI) * 120 * (u > 0 && u < 1 ? 1 : 0); });
  ctx.save(); ctx.translate(x, y); cut([[-30, 14], [30, 0], [-30, -14]], COL.ship, { key: 'rk', sb: 4 }); dot(-34, 0, 8, COL.engine); ctx.restore();
  label('Mars', 620, 460, 36, hops[0]); label('Europa', 1180, 300, 36, hops[1]); label('Titan', 1700, 790, 36, hops[2]);
  if (TT >= PW(23, 'thawing')) { glow(1180, 380, 30, '#cfe2ee', 0.6); glow(1700, 700, 32, '#ffd27a', 0.6); label('thawing', 1450, 230, 44, PW(23, 'thawing')); }
}

function sGrandma() {
  wallFill('#3a4a6a', 'gm', pat.lines('rgba(255,255,255,0.05)', 80));
  cut(ellipsePts(1350, 380, 360, 300, 0, 50), '#1b2333', { key: 'gmW', sb: 12 });
  ctx.save(); trace(ellipsePts(1350, 380, 340, 280, 0, 50), true); ctx.clip(); spaceWall('gmsp', '#0f1530'); planet(1420, 420, 230, 'jupiter', 'gmJ'); ctx.restore();
  cut([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], '#cfe2ee', { key: 'gmF', sy: -4, pat: pat.dots('rgba(255,255,255,0.4)', 4, 30) });
  you(560, 1000, { s: 0.95, pose: 'chair', arms: 'down', mood: 'smile', key: 'gran', grey: true, body: '#8c7ad8', bodyD: '#6c5ab8' });
  chair(560, 1000, 0.95, 'gmc', '#7a5a3a');
  you(860, 1000, { s: 0.55, pose: 'sit', arms: 'knees', mood: 'smile', key: 'kid' });
  label('Europa: six generations', 520, 160, 48, PW(24, 'six generations'));
  const t = PW(24, 'second chance'); const k = popS(t - 1.2);
  if (k > 0) { ctx.save(); ctx.translate(780, 420); ctx.scale(k, k); cut(ellipsePts(0, 0, 230, 90, 0, 30).concat([[-80, 80], [-160, 150], [-130, 70]]), '#fbf6ea', { key: 'gmb' }); handText("a second chance", -190, 16, 48, PAL.ink, { key: 'gmt' }); ctx.restore(); }
}

function sZone() {
  const g = sm(TT, PW(24, 'For a few hundred'), PE(24));
  system('zn', 960, 560, 90, 'giant', [['mars', 330, 1.0, 18], ['jupiter', 520, 2.4, 40], ['saturn', 760, 5.6, 30]], { tilt: 0.42, spin: 0.004 });
  const R = lerp(250, 760, g);
  ctx.strokeStyle = 'rgba(90,200,120,0.35)'; ctx.lineWidth = 70; ctx.beginPath(); ctx.ellipse(960, 560, R, R * 0.42, 0, 0, TAU); ctx.stroke();
  label('the habitable zone', 960, 120, 50, PW(24, 'the habitable zone'));
  label('past Mars', 1300, 300, 38, PW(24, 'past Mars')); label('past the asteroid belt', 600, 880, 38, PW(24, 'past the asteroid')); label('to the giant planets', 1450, 900, 38, PW(24, 'all the way'));
}

function sCampfire() {
  wallFill('#101a2a', 'cf');
  stars('cf', 120, { y1: 600 });
  const out = sm(TT, PW(26, 'going out'), PW(26, 'going out') + 6);
  if (TT >= PW(26, 'To other stars')) for (let i = 0; i < 12; i++) { const R = RNG('cfs', i); sparkle(R.r(100, 1820), R.r(60, 420), 14 + 6 * Math.sin(TT * 2 + i), '#fff6dc'); }
  // frozen forest
  for (let i = 0; i < 14; i++) { const R = RNG('tree', i), x = i * 145 + R.r(-30, 30), h = R.r(260, 420), y = 880; cut([[x, y - h], [x + 90, y], [x - 90, y]], '#1f3a3a', { key: 'tr' + i, sb: 6 }); cut([[x, y - h], [x + 40, y - h * 0.6], [x - 40, y - h * 0.6]], '#e8eef2', { key: 'sn' + i, shadow: false }); }
  cut([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], '#dfe8ee', { key: 'cfF', sy: -4 });
  // the fire
  const fl = (1 - out * 0.8) * (1 + 0.12 * Math.sin(TT * 9));
  glow(960, 820, 160 * fl, '#ffb04a', 0.45);
  for (let i = 0; i < 3; i++) cut([[960 - (70 - i * 20) * fl, 860], [960 + Math.sin(TT * 6 + i) * 14, 860 - (190 - i * 45) * fl], [960 + (70 - i * 20) * fl, 860]], ['#e0503a', '#f08a4b', '#f6cf55'][i], { key: 'fl' + i, shadow: false, grain: 0.3 });
  for (let i = 0; i < 3; i++) cut(capsulePts(900 + i * 20, 870, 1000 - i * 10, 850, 18), '#5a3a2a', { key: 'lg' + i, sb: 3 });
  // travellers walking toward it, then looking up
  for (let i = 0; i < 5; i++) { const x = lerp(-100 - i * 90, 620 - i * 90, sm(TT, P(25), P(25) + 6)); you(x, 940, { s: 0.36, pose: TT < P(25) + 6 ? 'walk' : 'stand', arms: TT >= PW(26, 'To other stars') ? 'up' : 'down', mood: 'focus', key: 'tv' + i, body: ['#5a6577', '#7a5a3a', '#4c6fb5', '#8a919e', '#6c5ab8'][i] }); }
}
