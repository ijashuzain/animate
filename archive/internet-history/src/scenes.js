
// =====================================================================
//  SCENES + CARDS — A short history of the internet. Scenes draw on the left (x 0..~990); cards on the right.
//  Orange = Pip, the message, and only Pip.
// =====================================================================
// ---- Pip: an orange envelope with a face. o: mood, s, carry (a sign above), key, tilt
function pip(x, y, s, o = {}) {
  const key = o.key ?? 'pip', sc = (o.sc ?? 1) * s; if (sc <= 0.01) return;
  y += Math.sin(TT * TAU * 0.9 + key.length) * 5 * sc;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt ?? Math.sin(TT * 1.7 + key.length) * 0.05); ctx.scale(sc, sc);
  for (const d of [-1, 1]) cut(capsulePts(d * 22, 34, d * 30, 70, 12), PAL.orangeD, { key: key + 'lg' + d, sb: 3 });
  cut(rect(-70, -46, 140, 92, 8), PAL.orange, { key: key + 'b', crayon: PAL.orangeD, crAl: 0.35, crPer: 30 });
  cut([[-68, -44], [0, 8], [68, -44]], '#f39a72', { key: key + 'f', sb: 3, sy: 2 });
  cut(rect(34, -36, 24, 28, 2), PAL.yellow, { key: key + 'st', shadow: false, grain: false });
  let mood = o.mood ?? 'smile'; if (mood !== 'happy' && mood !== 'focus' && (B + key.length * 5) % 43 < 2) mood = 'focus';
  face(0, 14, 0.75, mood);
  if (o.num) handText(String(o.num), -12, -10, 34, '#fff', { key: key + 'n', weight: 700 });
  ctx.restore();
  if (o.carry) tag(o.carry, x, y - 90 * sc, 40 * sc, { tape: false, rot: 0.03, fill: PAL.paper });
  SPARK_AT = toScreen(x, y);
}
// ---- props
function cabinet(x, y, s, label, key, o = {}) {   // a 1960s computer: a tall cabinet with tape reels and lights
  cut(rect(x - 110 * s, y - 380 * s, 220 * s, 380 * s, 10), o.c ?? '#b9bfc8', { key: key + 'b', pat: pat.lines('rgba(0,0,0,0.06)', 30) });
  for (const d of [-1, 1]) { const cx = x + d * 50 * s, cy = y - 290 * s; cut(ellipsePts(cx, cy, 40 * s, 40 * s, 0, 24), '#2a2f3a', { key: key + 'r' + d }); const a = TT * (o.crash ? 0 : 3) * d; for (let k = 0; k < 3; k++) ink([[cx, cy], [cx + Math.cos(a + k * 2.1) * 30 * s, cy + Math.sin(a + k * 2.1) * 30 * s]], { w: 4, color: '#8a919e', key: key + 'sp' + d + k }); }
  for (let i = 0; i < 10; i++) { const on = o.crash ? (B % 6 < 3) : (B + i * 3) % 9 < 5; dot(x - 80 * s + (i % 5) * 40 * s, y - 180 * s + Math.floor(i / 5) * 34 * s, 8 * s, o.crash ? (on ? '#f05a5a' : '#5a2a2e') : on ? (i % 3 ? '#7be3a0' : PAL.yellow) : '#4a4f5a'); }
  cut(rect(x - 80 * s, y - 100 * s, 160 * s, 60 * s, 4), '#2a2f3a', { key: key + 'slot' });
  tag(label, x, y - 420 * s, 40 * s, { tape: false, fill: PAL.paper, rot: 0.02 });
}
function plantC(x, y, key) { plant(x, y, 0.8, PAL.teal, key); }
function crashPuff(x, y, t, key) { const k = ev(t, 1.2); if (k <= 0 || k >= 1) return; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4; cut(ellipsePts(x + Math.cos(a) * 80 * k, y + Math.sin(a) * 120 * k, 40 * (1 - k * 0.5), 32 * (1 - k * 0.5), 0, 14), '#8a919e', { key: key + i, shadow: false, grain: false }); } }

// ---- 1969: UCLA -> SRI, "LO", crash
function sLo(o = {}) {
  wallC(PAL.navy, pat.dots('rgba(255,225,170,0.08)', 4, 70));
  clock(500, 160, 70, 10, 30, 'clk69');
  floorC(820, '#3e4655', 'fl69', pat.lines('rgba(255,255,255,0.05)', 30));
  const crash = !o.end && TT >= at(9.2);
  cabinet(210, 820, 1.0, 'UCLA', 'ucla');
  cabinet(790, 820, 1.0, 'SRI', 'sri', { crash });
  const P = []; for (let k = 0; k <= 20; k++) { const u = k / 20; P.push([lerp(320, 680, u), 470 + Math.sin(u * Math.PI) * 90]); }
  ink(P, { w: 6, color: '#1d2229', key: 'wire' });
  mug(380, 790, 0.7, PAL.paper, 'mug69'); plantC(620, 820, 'pl69');
  if (!o.end) {
    // Pip carries L, then O, along the wire; the far machine crashes
    const leg = (t0) => clamp((TT - t0) / 1.6);
    let px = 260, py = 500, carry = null;
    for (const [t0, ch] of [[at(3.0), 'L'], [at(4.7), 'O']]) { const u = leg(t0); if (u > 0 && u < 1) { const p = pointAt(P, u); px = p[0]; py = p[1] - 70; carry = ch; } }
    if (TT >= at(6.3)) { px = lerp(700, 640, ev(at(9.2), 0.6)); py = 380 + ev(at(9.2), 0.6) * 340; }
    pip(px, py, 0.8, { carry, mood: crash ? 'sad' : carry ? 'happy' : 'smile', key: 'pip69', tilt: crash ? 0.6 : undefined });
    if (TT >= at(4.6)) tag('L', 860, 240, 60, { tape: false, rot: -0.05 });
    if (TT >= at(6.3)) tag('O', 940, 250, 60, { tape: false, rot: 0.06 });
    crashPuff(790, 420, at(9.2), 'puff69');
    if (crash) handText('!', 880, 480, 120, '#f05a5a', { key: 'bang69', weight: 700 });
  } else {
    pip(500, 640, 0.9, { mood: TT >= at(6.0) ? 'happy' : 'smile', key: 'pipEnd' });
    if (TT >= at(3.0)) tag('L', 440, 300, 70, { tape: false, rot: -0.05 });
    if (TT >= at(3.4)) tag('O', 560, 310, 70, { tape: false, rot: 0.06 });
    if (TT >= at(6.0)) label69('lo and behold', 500, 420);
  }
}
const label69 = (s, x, y) => tag(s, x, y, 56, { tape: true, rot: -0.02, s: popS(at(6.0)) });
function cLo(at) {
  title('The first message', at(0.8));
  popAt(at(1.8), CL + 120, 380, () => { cbox(0, 0, 200, 110, '#b9bfc8', 'cu'); handText('UCLA', -55, 14, 44, PAL.ink, { key: 'cut1' }); });
  popAt(at(2.2), CR - 120, 380, () => { cbox(0, 0, 200, 110, '#b9bfc8', 'cs'); handText('SRI', -36, 14, 44, PAL.ink, { key: 'cut2' }); });
  arrow(CL + 230, 380, CR - 230, 380, at(2.6), PAL.ink, 'a69');
  write('about 350 miles', CCX - 150, 330, 34, at(2.8));
  write('LOGIN', CL + 120, 600, 110, at(4.0), { weight: 700, d: 0.01 });
  if (TT >= at(9.3)) { ink([[CL + 250, 565], [CL + 470, 565]], { w: 10, color: '#d84a43', frac: ev(at(9.3), 0.4), key: 'strk' }); }
  if (TT < at(4.6)) { ctx.fillStyle = PAL.paper; ctx.fillRect(CL + 110, 500, 420, 130); }
  else if (TT < at(6.3)) { ctx.fillStyle = PAL.paper; ctx.fillRect(CL + 180, 500, 360, 130); }
  write('crashed after "LO"', CL, 820, 54, at(9.6), { color: PAL.orangeD });
}

// ---- 1971: email and the @
function sEmail() {
  wallC('#e7c79a', pat.stripes('rgba(255,255,255,0.18)', 22, 70));
  cut(rect(620, 110, 300, 260, 8), PAL.woodD, { key: 'win71' }); cut(rect(640, 130, 260, 220, 4), '#bfe3f4', { key: 'sky71', shadow: false });
  cut(ellipsePts(720, 200, 50, 22, 0, 16), '#fff', { key: 'cl71', sb: 4 });
  floorC(760, PAL.wood, 'desk71', pat.grainWood('rgba(120,60,20,0.18)'));
  person(330, 600, 1.0, { mood: TT >= at(5.0) ? 'happy' : 'focus', shirt: PAL.blue, skin: PAL.skin1, glasses: true });
  cut(rect(560, 440, 300, 240, 12), '#d8d4cc', { key: 'term' }); cut(rect(585, 465, 250, 170, 6), '#1d2a24', { key: 'termS', shadow: false });
  monoText('QWERTYUIOP', 600, 520, 26, '#7be3a0', { key: 'q71', count: typed('QWERTYUIOP', at(1.0)) });
  if (TT >= at(5.0)) monoText('ray@host', 600, 580, 30, '#7be3a0', { key: 'at71' });
  cut(rect(560, 690, 300, 40, 6), '#b9bfc8', { key: 'kb71' });
  pip(850, 380, 0.75, { mood: 'happy', key: 'pip71', carry: TT >= at(5.0) ? '@' : null });
  mug(160, 740, 0.7, PAL.yellow, 'mug71'); books(470, 760, 0.6, 'bk71');
}
function cEmail(at) {
  title('Email gets its @', at(0.8));
  popAt(at(2.0), CL + 140, 400, () => { cbox(0, 0, 240, 110, PAL.mint, 'e1'); handText('tomlinson', -100, 14, 40, PAL.ink, { key: 'et1' }); });
  popAt(at(3.0), CCX, 400, () => handText('@', -40, 36, 120, PAL.orangeD, { key: 'eat', weight: 700 }));
  popAt(at(2.4), CR - 130, 400, () => { cbox(0, 0, 240, 110, PAL.sky, 'e2'); handText('bbn-tenexa', -104, 14, 38, PAL.ink, { key: 'et2' }); });
  write('who', CL + 100, 520, 44, at(4.0)); write('which computer', CR - 230, 520, 44, at(4.4));
  write('the first network email', CL, 760, 50, at(5.6));
  write('(he says it was gibberish)', CL, 840, 44, at(6.6), { color: PAL.orangeD });
}

// ---- 1983: TCP/IP, packets
const NODES = [[90, 540], [260, 300], [270, 760], [470, 460], [520, 220], [520, 820], [720, 330], [730, 660], [900, 540]];
const LINKS = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 3], [2, 5], [3, 6], [3, 7], [4, 6], [5, 7], [6, 8], [7, 8], [4, 8]];
const ROUTES = [[0, 1, 4, 8], [0, 1, 3, 6, 8], [0, 2, 3, 7, 8], [0, 2, 5, 7, 8]];
function sTcp() {
  wallC('#cfdccf', pat.dots('rgba(255,255,255,0.4)', 4, 50));
  for (const [a, b] of LINKS) ink([NODES[a], NODES[b]], { w: 6, color: 'rgba(42,29,24,0.35)', key: 'lk' + a + b });
  NODES.forEach(([x, y], i) => { cut(ellipsePts(x, y, 34, 34, 0, 20), i === 0 || i === 8 ? PAL.teal : '#b9bfc8', { key: 'nd' + i }); dot(x, y - 6, 6, (B + i * 2) % 8 < 4 ? '#7be3a0' : '#4a4f5a'); });
  const split = at(3.0), join = at(10.5);
  if (TT < split) pip(90, 450, 0.8, { key: 'pipT', mood: 'smile' });
  else if (TT >= join) pip(900, 450, 0.8, { key: 'pipT', mood: 'happy' });
  else ROUTES.forEach((r, i) => { const P = resample(r.map((n) => NODES[n]), false, 8), u = clamp((TT - split - i * 0.4) / (5.5 + i * 0.6)); const [x, y] = pointAt(P, Math.max(0.001, u)); pip(x, y - 60, 0.42, { key: 'pk' + i, num: i + 1, mood: u >= 1 ? 'happy' : 'focus' }); });
}
function cTcp(at) {
  title('TCP/IP: packets', at(0.8));
  [1, 2, 3, 4].forEach((n, i) => popAt(at(2.8 + i * 0.2), CL + 60 + i * 110, 340, () => { cbox(0, 0, 90, 70, PAL.orange, 'pkb' + n); handText(String(n), -12, 16, 44, '#fff', { key: 'pkn' + n, weight: 700 }); }));
  write('1  cut the message into packets', CL, 480, 44, at(3.4));
  write('2  each finds its own way', CL, 580, 44, at(5.4));
  write('3  put back in order at the end', CL, 680, 44, at(9.0));
  write('the internet\'s language', CL, 820, 50, at(10.6), { color: PAL.orangeD });
  write('since 1 January 1983', CL, 890, 40, at(11.4));
}

// ---- 1991: the World Wide Web at CERN
function sWeb() {
  wallC('#c9b9da', pat.stripes('rgba(255,255,255,0.15)', 18, 60));
  floorC(760, PAL.woodL, 'desk91', pat.grainWood('rgba(120,60,20,0.15)'));
  cut(rect(120, 560, 210, 210, 8), '#1d1a22', { key: 'next' });                 // the NeXT cube
  cut(rect(140, 600, 170, 70, 4), PAL.paper, { key: 'note91', shadow: false }); handText('server: do NOT', 148, 628, 22, '#d84a43', { key: 'n91a' }); handText('power it down!', 148, 656, 22, '#d84a43', { key: 'n91b' });
  cut(rect(400, 260, 520, 420, 16), '#2a2a30', { key: 'mon91' });
  const second = TT >= at(6.0);
  cut(rect(425, 285, 470, 340, 6), second ? '#fff7e8' : '#ffffff', { key: 'page91' + second, shadow: false });
  handText(second ? 'Physics at CERN' : 'World Wide Web', 450, 340, 36, PAL.ink, { key: 'pt91' + second, weight: 700 });
  for (let i = 0; i < 5; i++) ink([[450, 390 + i * 40], [450 + 300 + (i * 37) % 120, 390 + i * 40]], { w: 6, color: 'rgba(42,29,24,0.25)', key: 'pl91' + i + second });
  if (!second) { handText('a link', 450, 600, 32, '#2a58c8', { key: 'lnk91' }); ink([[450, 606], [545, 606]], { w: 3, color: '#2a58c8', key: 'lnku91' }); }
  cut(rect(620, 680, 80, 80, 4), '#2a2a30', { key: 'stand91' });
  const jump = clamp((TT - at(5.6)) / 0.8);
  pip(lerp(560, 760, jump), 560 - Math.sin(jump * Math.PI) * 160, 0.6, { key: 'pip91', mood: jump > 0 && jump < 1 ? 'wow' : 'happy' });
  mug(860, 740, 0.6, PAL.mint, 'mug91');
}
function cWeb(at) {
  title('The World Wide Web', at(0.8));
  const pg = (x, y, t, lab, key) => popAt(t, x, y, () => { cbox(0, 0, 180, 220, '#ffffff', key, { line: 'rgba(42,29,24,0.4)', lw: 3 }); handText(lab, -60, -60, 36, PAL.ink, { key: key + 't', weight: 700 }); for (let i = 0; i < 3; i++) ink([[-60, -10 + i * 34], [60, -10 + i * 34]], { w: 5, color: 'rgba(42,29,24,0.25)', key: key + 'l' + i }); ink([[-60, 92], [10, 92]], { w: 4, color: '#2a58c8', key: key + 'u' }); });
  pg(CL + 110, 420, at(2.0), 'page', 'pgA'); arrow(CL + 210, 500, CCX - 100, 420, at(3.0), '#2a58c8', 'wa1');
  pg(CCX, 420, at(3.4), 'page', 'pgB'); arrow(CCX + 100, 500, CR - 210, 420, at(4.2), '#2a58c8', 'wa2');
  pg(CR - 110, 420, at(4.6), 'page', 'pgC');
  write('pages + links = the web', CL, 700, 50, at(6.2));
  write('made free for everyone, 1993', CL, 790, 44, at(8.0), { color: PAL.orangeD });
}

// ---- 1998: search
function sSearch() {
  wallC('#f0cf78', pat.dots('rgba(255,255,255,0.35)', 5, 54));
  floorC(800, PAL.wood, 'desk98', pat.grainWood('rgba(120,60,20,0.18)'));
  const R = RNG('pages98');
  for (let i = 0; i < 26; i++) cut(rot(rect(R.r(40, 900), R.r(80, 760), 110, 140, 3), R.r(0, 900), R.r(0, 800), R.n(0.3)), i % 4 ? PAL.paper : '#e7f4ff', { key: 'pg98' + i, sb: 4, pat: pat.lines('rgba(42,29,24,0.2)', 18, 20) });
  cut(rect(180, 300, 640, 110, 55), '#ffffff', { key: 'bar98', sb: 14 });
  monoText('how does the internet work', 230, 370, 32, PAL.ink, { key: 'q98', count: typed('how does the internet work', at(1.5), 20) });
  cut(ellipsePts(760, 355, 26, 26, 0, 16), '#4c6fb5', { key: 'go98' });
  if (TT >= at(4.0)) for (let i = 0; i < 3; i++) { const k = popS(at(4.0) + i * 0.25); if (k <= 0) continue; ctx.save(); ctx.translate(500, 480 + i * 100); ctx.scale(k, k); cbox(0, 0, 640, 80, i ? '#ffffff' : '#fff3c8', 'res' + i, { line: i ? null : PAL.orangeD, lw: 4 }); handText(i ? 'another page' : 'the best page', -280, 14, 34, '#2a58c8', { key: 'rt' + i }); ctx.restore(); }
  pip(870, 640, 0.75, { key: 'pip98', mood: TT >= at(4.0) ? 'happy' : 'focus' });
}
function cSearch(at) {
  title('Search: rank by links', at(0.8));
  const C = [CCX, 470], around = [[CL + 70, 330], [CR - 70, 330], [CL + 50, 620], [CR - 50, 620], [CCX, 760]];
  around.forEach(([x, y], i) => { popAt(at(1.8 + i * 0.2), x, y, () => cbox(0, 0, 110, 80, '#ffffff', 'sp' + i, { line: 'rgba(42,29,24,0.4)', lw: 3 })); arrow(x, y, lerp(x, C[0], 0.72), lerp(y, C[1], 0.72), at(3.0 + i * 0.2), '#2a58c8', 'sa' + i, 5); });
  popAt(at(2.6), C[0], C[1], () => { cbox(0, 0, 150, 110, '#fff3c8', 'spC', { line: PAL.orangeD, lw: 5 }); handText('#1', -30, 16, 50, PAL.orangeD, { key: 'sp1', weight: 700 }); });
  write('more links in = higher rank', CL, 900, 48, at(5.0), { color: PAL.orangeD });
}

// ---- 2004: social networks
function sSocial() {
  wallC('#a9d9c6', pat.dots('rgba(255,255,255,0.35)', 5, 54));
  const R = RNG('soc'), P = [];
  for (let i = 0; i < 16; i++) P.push([R.r(80, 920), R.r(120, 860)]);
  const n = Math.min(16, 2 + Math.floor(Math.max(0, TT - at(1.5)) * 2.2));
  for (let i = 1; i < n; i++) { const j = Math.floor(R.f() * i); ink([P[i], P[j]], { w: 4, color: 'rgba(42,29,24,0.3)', key: 'sl' + i }); }
  const skins = [PAL.skin1, PAL.skin2, PAL.skin3];
  for (let i = 0; i < n; i++) { const [x, y] = P[i], k = popS(at(1.5) + i / 2.2); if (k <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.scale(k * 0.8, k * 0.8); cut(rect(-60, -70, 120, 150, 4), PAL.paper, { key: 'pc' + i }); cut(ellipsePts(0, -10, 38, 42, 0, 20), skins[i % 3], { key: 'pf' + i, shadow: false }); face(0, -6, 0.55, i % 3 ? 'smile' : 'happy'); cut(rect(-40, 44, 80, 16, 4), [PAL.teal, PAL.pink, PAL.purple, PAL.blue][i % 4], { key: 'pn' + i, shadow: false }); ctx.restore(); }
  const hop = Math.floor(TT * 0.8) % Math.max(2, n), [hx, hy] = P[hop];
  pip(hx + 70, hy - 80, 0.5, { key: 'pip04', mood: 'happy' });
  for (let i = 0; i < 4; i++) { const k = mod(TT * 0.7 + i / 4, 1); cut([[0, -14], [12, -26], [24, -14], [12, 4]].map(([x, y]) => [x + P[(i * 3) % n][0] + 30, y + P[(i * 3) % n][1] - 100 - k * 80]), '#e85d75', { key: 'ht' + i, shadow: false }); }
}
function cSocial(at) {
  title('Social networks', at(0.8));
  write('Facebook  2004', CL, 330, 48, at(1.8)); write('YouTube  2005', CL, 410, 48, at(2.6));
  const ring = (n, r, t, key) => { for (let i = 0; i < n; i++) { const a = i / n * TAU; popAt(t + i * 0.03, CCX + Math.cos(a) * r, 600 + Math.sin(a) * r * 0.7, () => dot(0, 0, 12, [PAL.teal, PAL.pink, PAL.purple][i % 3])); } };
  popAt(at(3.2), CCX, 600, () => dot(0, 0, 18, PAL.orange)); ring(6, 80, at(3.6), 'r1'); ring(14, 160, at(4.4), 'r2'); ring(26, 240, at(5.2), 'r3');
  write('everyone can publish', CL, 900, 50, at(7.0), { color: PAL.orangeD });
}

// ---- 2007: the phone
function sPhone() {
  wallC('#f3a3bf', (bb) => { ctx.fillStyle = PAL.pinkL; for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; ctx.beginPath(); ctx.moveTo(500, 520); ctx.lineTo(500 + Math.cos(a0) * 2400, 520 + Math.sin(a0) * 2400); ctx.lineTo(500 + Math.cos(a1) * 2400, 520 + Math.sin(a1) * 2400); ctx.closePath(); ctx.fill(); } });
  cut(capsulePts(500, 1200, 500, 860, 260, 8), PAL.purple, { key: 'sleeve07' });
  cut(rect(370, 220, 260, 520, 40), '#2b2a33', { key: 'ph07' });
  cut(rect(390, 260, 220, 430, 14), TT >= at(1.5) ? '#e7f4ff' : '#111', { key: 'phs07' + (TT >= at(1.5)), shadow: false });
  if (TT >= at(1.5)) for (let i = 0; i < 12; i++) { const k = popS(at(1.6) + i * 0.08); if (k <= 0) continue; const x = 425 + (i % 3) * 75, y = 300 + Math.floor(i / 3) * 90; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); cut(rect(-26, -26, 52, 52, 12), [PAL.teal, PAL.yellow, PAL.pink, PAL.blue, PAL.green, PAL.purple][i % 6], { key: 'app' + i, shadow: false }); ctx.restore(); }
  cut(ellipsePts(380, 600, 70, 56, 0.3, 22), PAL.skin2, { key: 'thumb07' }); cut(ellipsePts(630, 560, 60, 90, -0.2, 22), PAL.skin2, { key: 'fing07' });
  const out = sm(TT, at(2.5), at(3.5));
  pip(lerp(500, 760, out), lerp(480, 300, out), 0.7, { key: 'pip07', mood: 'happy', sc: out > 0 ? 1 : 0.001 });
  [['pin', 160, 260], ['note', 840, 620], ['cam', 170, 760]].forEach(([k, x, y], i) => { const yy = y + Math.sin(TT * 1.5 + i) * 14; if (k === 'pin') { cut([[x, yy + 50], [x - 34, yy], [x, yy - 40], [x + 34, yy]], '#d84a43', { key: 'ipin' }); dot(x, yy - 4, 12, '#fff'); } else if (k === 'note') { ink([[x, yy + 30], [x, yy - 40], [x + 40, yy - 50], [x + 40, yy + 20]], { w: 8, color: PAL.ink, key: 'inote' }); dot(x - 10, yy + 32, 14); dot(x + 30, yy + 22, 14); } else { cut(rect(x - 50, yy - 34, 100, 68, 10), '#2a2f3a', { key: 'icam' }); dot(x, yy, 22, '#8a919e'); } });
}
function cPhone(at) {
  title('In your pocket', at(0.8));
  bigNum('2007', 'the iPhone', CCX, 380, at(1.8));
  [['maps', 3.0], ['music', 3.5], ['photos', 4.0], ['chat', 4.5]].forEach(([s, d], i) => popAt(at(d), CL + 100 + i * 190, 620, () => { cbox(0, 0, 160, 80, [PAL.mint, PAL.yellow, PAL.pinkL, PAL.sky][i], 'pa' + i); handText(s, -handW(s, 40) / 2, 14, 40, PAL.ink, { key: 'pat' + i }); }));
  write('the internet, everywhere', CL, 860, 50, at(6.0), { color: PAL.orangeD });
}

// ---- the hush and today: Earth, dark, then lit
function earthGlobe(x, y, r, lit, key) {
  cut(ellipsePts(x, y, r, r, 0, 60), lit ? '#2a4f8a' : '#141c40', { key: key + 'o', crayon: '#1d3a6a', crAl: 0.3, sb: 20 });
  ctx.save(); trace(ellipsePts(x, y, r, r, 0, 60), true); ctx.clip();
  const R = RNG('cont', key);
  for (let i = 0; i < 6; i++) cut(ellipsePts(x + R.n(r * 0.6), y + R.n(r * 0.6), r * R.r(0.2, 0.38), r * R.r(0.12, 0.28), R.r(0, 3), 18), lit ? '#3d7c46' : '#1d2448', { key: key + 'c' + i, shadow: false, grain: 0.4 });
  if (lit) { const L = RNG('lights'); for (let i = 0; i < 260; i++) { const a = L.r(0, TAU), d = Math.sqrt(L.f()) * r, k = popS(HIT + L.r(0, 1.2)); if (k > 0) dot(x + Math.cos(a) * d, y + Math.sin(a) * d, 3.5 * k, '#ffd27a'); } }
  ctx.restore();
}
function sHush() { wallC('#0c1124'); starsC('h', 100); earthGlobe(500, 540, 330, false, 'eh'); }
function sToday() {
  wallC('#141a33'); starsC('t', 100);
  glowC(500, 540, 330, '#9fd0ff', 0.25);
  earthGlobe(500, 540, 330, true, 'eh');
  const R = RNG('arcs');
  for (let i = 0; i < 12; i++) { const a = R.r(0, TAU), b = a + R.r(0.8, 2.4), f = ev(HIT + 0.6 + i * 0.15, 0.8); if (f <= 0) continue; const P = []; for (let k = 0; k <= 20; k++) { const u = k / 20, an = lerp(a, b, u), rr = 300 + Math.sin(u * Math.PI) * 120; P.push([500 + Math.cos(an) * rr, 540 + Math.sin(an) * rr]); } ink(P, { w: 3, color: 'rgba(255,210,122,0.7)', frac: f, key: 'arc' + i }); }
  for (let i = 0; i < 5; i++) { const a = TT * 0.5 + i * TAU / 5; pip(500 + Math.cos(a) * 430, 540 + Math.sin(a) * 300, 0.35, { key: 'po' + i, mood: 'happy' }); }
}
function cToday(at) {
  title('Today', at(0.8));
  bigNum('5.5 billion', 'people online (2024)', CCX, 380, at(1.6));
  const f = ev(at(5.0), 1.0);
  popAt(at(4.6), CCX - 200, 680, () => { cut(ellipsePts(0, 0, 120, 120, 0, 40), '#e8e2d4', { key: 'pie0' }); if (f > 0) { ctx.fillStyle = PAL.orange; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 116, -Math.PI / 2, -Math.PI / 2 + TAU * 0.68 * f); ctx.closePath(); ctx.fill(); } });
  write('68% of the world:', CCX - 40, 660, 44, at(6.0));
  write('two in every three', CCX - 40, 730, 44, at(6.8), { color: PAL.orangeD });
  write('source: ITU, 2024', CL, 920, 34, at(8.0));
}

// ---- the end: back to the start
function sEnd() { sLo({ end: true }); }
function cEnd(at) {
  title('From two letters...', at(0.8));
  const ys = ['1969', '1971', '1983', '1991', '1998', '2004', '2007', 'today'];
  ink([[CL, 520], [CR, 520]], { w: 6, color: PAL.ink, frac: ev(at(1.6), 1.0), key: 'tl' });
  ys.forEach((y, i) => popAt(at(1.8 + i * 0.25), CL + i * ((CR - CL) / 7), 520, () => { dot(0, 0, 13, i === 7 ? PAL.orange : PAL.ink); handText(y, -handW(y, 32) / 2, i % 2 ? 64 : -30, 32, PAL.ink, { key: 'ty' + i }); }));
  write('...to everyone.', CL, 760, 60, at(5.0), { color: PAL.orangeD, weight: 700 });
}
