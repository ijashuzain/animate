// =====================================================================
//  SCENES — Where does the sea get its salt? FLAT style (styles/flat): bright flat colours, clean outlines, one-step
//  cel shading, no texture, no boil. Calm flat backgrounds behind the words on the right. Peekaboo moves: salt grains
//  with faces, a lens into the river water, labels that point, a pop (and a sound) for each new thing.
//  Colour means one thing: blue = water, white cubes with faces = salt, yellow = the Sun, pink = the clue / the answer.
// =====================================================================
const CHANNEL = { font: FLAT_FONT, weight: 800, halo: 'rgba(255,255,255,0.75)', haloDark: 'rgba(15,49,87,0.65)', inkDark: '#ffffff',
  colors: { ink: '#232634', accent: '#e8427a', green: '#3c9a52', blue: '#1d78ad' },
  tag: (str, k) => { const w = fTextW(str, 40) + 48; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.scale(k, k); fRect(-w / 2, -30, w, 60, 30, FL.sun, { lw: 4, drop: [0, 5] }); fText(str, 0, 14, 40, FL.ink, { align: 'center', outline: false }); ctx.restore(); } };
// a salt grain: a little white cube with a face. Grains stay still unless something carries them (no idle jitter)
function grain(x, y, s, key, o = {}) {
  s *= 1.5; const r = 16 * s; fRect(x - r, y - r, r * 2, r * 2, r * 0.35, o.c ?? FL.white, { lw: Math.max(2.5, 4 * s), shade: [-r * 0.25, -r * 0.25], shc: '#dfe6ee' });
  if (s >= 0.7) fFace(x, y, s * 0.42, o.mood ?? 'smile', key, { blush: false });
}
const along = (P, u) => { const k = Math.min(P.length - 2, Math.floor(u * (P.length - 1))), f = u * (P.length - 1) - k; return [lerp(P[k][0], P[k + 1][0], f), lerp(P[k][1], P[k + 1][1], f)]; };
function mountains(o = {}) {
  fShape([[-60, 780], [90, 430], [200, 540], [330, 300], [470, 560], [600, 760], [700, 900], [720, 1150], [-60, 1150]], FL.rock, { shade: [24, -10], shc: FL.rockD, lw: 6 });
  fShape([[255, 400], [330, 300], [400, 405], [365, 385], [330, 420], [295, 390]], FL.white, { lw: 5 });   // snow cap
  if (o.grass !== false) fShape([[-60, 860], [300, 820], [560, 830], [700, 900], [720, 1150], [-60, 1150]], FL.grass, { shade: [0, -12], shc: FL.grassD, lw: 6 });
}
const RIVER = [[330, 330], [345, 430], [310, 520], [380, 640], [500, 760], [640, 850]];
function river(P, w = 30, c = FL.sea) { fLine(P, FL.ink, w + 10, { smooth: true }); fLine(P, c, w, { smooth: true }); for (let i = 0; i < 6; i++) { const [x, y] = along(P, mod(TT * 0.16 + i / 6, 1)); fLine([[x - 8, y], [x + 8, y]], FL.white, 5); } }
function sea(y0, o = {}) { fBand(y0, o.c ?? FL.sea, { amp: 10, f: 0.012, ph: TT * 1.6, lw: 6 }); for (let i = 0; i < 6; i++) { const x = mod(i * 330 + TT * 40, 2100) - 100; fLine(arcPts(x, y0 + 70 + (i % 2) * 60, 30, Math.PI * 1.15, Math.PI * 1.85, 8), FL.white, 5, { alpha: 0.8 }); } }

// ---- 1. the case: a river runs into the sea; fresh on one side, salty on the other
function sHook(o = {}) {
  fSky(o.end ? '#ffcf8a' : FL.sky, o.end ? '#ffe7c2' : FL.skyL);
  if (o.end) fSun(820, 300, 90, { mood: 'happy' }); else { fCloud(700, 200, 1.0); fCloud(180, 140, 0.7); }
  sea(820); mountains(); river(RIVER);
  fHero(470, 780, 54, { color: FL.purple, mood: o.end ? 'happy' : TT > at(4.8) ? 'wow' : 'smile', arms: o.end ? 'up' : [0.4, 2.2], hop: o.end ? null : at(4.8) });
  if (!o.end) { fLabel('fresh', 170, 600, 330, 560, at(1.6), { color: FL.seaD }); fLabel('salty!', 860, 960, 840, 900, at(4.8), { color: FL.pink }); }
  if (!o.end && TT > at(8.0)) fPop(at(8.0), 860, 640, () => fText('?', 860, 700, 180, FL.pink, { align: 'center' }));
}
function cHook(at) {
  title('The salty sea case', at(0.8));
  bigNum('35 g', 'of salt in every litre of sea', CCX, 470, at(3.0), CH.accent, 110);
  write('but the rivers are fresh...', CL, 700, 50, at(6.6));
  write('the case is open', CL, 760, 50, at(9.4), { color: CH.accent, weight: 800 });
}

// ---- 2. the evidence: a glass of seawater, then the sea's salt piled over the land beside a 40-storey tower
function sEvidence() {
  fSky(FL.sky, FL.skyL); fBand(900, FL.grass, { lw: 6 });
  const gx = 230, gy = 560, f = ev(at(2.6), 2.0);
  fShape([[gx - 110, gy - 200], [gx + 110, gy - 200], [gx + 90, gy + 200], [gx - 90, gy + 200]], 'rgba(255,255,255,0.7)', { lw: 6 });
  fShape([[gx - 104, gy - 150], [gx + 104, gy - 150], [gx + 91, gy + 194], [gx - 91, gy + 194]], FL.sea, { line: false, shade: [14, 0], shc: FL.seaD });
  for (let i = 0; i < 7; i++) { const R = RNG('ev', i), x = gx - 60 + R.r(0, 120), y = lerp(gy - 120, gy + 160 - (i % 3) * 30, EZ.o3(f)); grain(x, y, 0.55, 'eg' + i); }
  fLabel('3.5% salt', gx, gy - 260, gx, gy - 160, at(1.6), { color: FL.pink });
  const lx0 = 430, base = 900, k = ev(at(8.6), 2.2), hgt = 380 * k, bx = 790;
  fRect(bx, base - 400, 130, 400, 6, FL.blue, { shade: [16, 0], lw: 6 }); for (let r = 0; r < 12; r++) for (let c = 0; c < 3; c++) fRect(bx + 16 + c * 38, base - 382 + r * 32, 22, 18, 3, FL.yellow, { lw: 2.5 });
  if (k > 0) { fShape([[lx0, base - hgt + 10], [lx0 + 300, base - hgt - 6], [lx0 + 540, base - hgt + 8], [lx0 + 540, base], [lx0, base]], FL.white, { lw: 6, shade: [0, -14], shc: '#dfe6ee' }); for (let i = 0; i < 4; i++) grain(lx0 + 70 + i * 120, base - hgt * 0.5, 0.75, 'lg' + i); }
  if (k > 0.6) fLabel('166 m of salt', 600, base - hgt - 70, 600, base - hgt + 10, at(10.4), { color: FL.pink });
}
function cEvidence(at) {
  write('about 3.5% of every glass', CL, 380, 50, at(1.6));
  write('spread over all the land:', CL, 580, 46, at(7.0));
  bigNum('166 m', 'deep, as tall as a 40-storey building', CCX, 700, at(8.8), CH.accent, 120);
  write('(NOAA estimate)', CL, 900, 32, at(10.6));
}

// ---- 3. clue 1: slightly acidic rain slowly dissolves rock
function sRain() {
  fSky('#a9c7da', FL.skyL); fBand(900, FL.grass, { lw: 6 });
  fCloud(330, 170, 1.6, '#e8eef4'); fCloud(600, 140, 1.2, '#e8eef4');
  for (let i = 0; i < 22; i++) { const R = RNG('rd', i), x = R.r(140, 760), y = mod(R.r(0, 700) + TT * R.r(380, 480), 620) + 230; fDrop(x, y, 9, FL.sea, { lw: 2.5, shade: false, hi: false }); }
  mountains({ grass: false });
  for (let i = 0; i < 5; i++) { const t0 = at(4.6) + i * 1.3, u = clamp((TT - t0) / 3.2); if (u <= 0) continue; const x = lerp(300 + i * 18, 640 + i * 30, u), y = lerp(330 + i * 26, 870, EZ.i2(u)); grain(x, y, 0.7, 'rg' + i, { c: '#f7e3c4', mood: u < 1 ? 'wow' : 'smile' }); }
  fLabel('a weak acid', 160, 300, 230, 380, at(3.6), { color: FL.pink });
  fHero(800, 830, 52, { mood: TT > at(8.0) ? 'wow' : 'smile', look: [-0.8, -0.3] });
}
function cRain(at) {
  title('The rain', at(0.6));
  write('rain + CO₂ = a weak acid', CL, 470, 46, at(2.6));
  write('it slowly dissolves rock', CL, 570, 46, at(5.0));
  bigNum('1000s of years', null, CCX, 760, at(8.2), CH.accent, 84);
}

// ---- 4. clue 2: rivers carry the minerals; a lens zooms into the water
function sRivers() {
  fSky(FL.sky, FL.skyL); fBand(690, FL.grass, { lw: 6 });
  const P = [[-60, 820], [160, 850], [320, 800], [500, 870], [700, 830], [1000, 880], [1300, 860], [2000, 900]];
  river(P, 70);
  for (let i = 0; i < 5; i++) { const [x, y] = along(P.slice(0, 6), mod(TT * 0.06 + i / 5, 1)); grain(x, y - 6, 0.5, 'rvg' + i); }
  fLens(420, 400, 175, popS(at(1.6)), () => {
    fRect(240, 220, 360, 360, 0, FL.sea, { line: false });
    [['Na', 0], ['Cl', 1], ['Ca', 2], ['Cl', 3]].forEach(([sym, i]) => { const x = 330 + (i % 2) * 170 + Math.sin(TT * 0.9 + i) * 10, y = 330 + Math.floor(i / 2) * 150 + Math.cos(TT * 0.8 + i) * 8; grain(x, y, 1.1, 'ion' + i, { c: i % 2 ? FL.pinkL : FL.white }); fText(sym, x, y + 52, 28, FL.ink, { align: 'center' }); });
  }, { glass: FL.sea });
  fLabel('a pinch of salt', 760, 600, 640, 830, at(8.0), { color: FL.pink });
}
function cRivers(at) {
  title('The rivers', at(0.6));
  write('they carry the minerals to the sea', CL, 470, 42, at(2.4));
  write('sodium, chloride...', CL, 560, 42, at(4.2), { color: CH.blue });
  write('river water IS a little salty', CL, 740, 46, at(8.0), { weight: 800 });
  write('just too little to taste', CL, 830, 44, at(10.4), { color: CH.accent });
}

// ---- 5. clue 3: hot vents on the sea floor
function sVents() {
  fSky(FL.seaD, FL.deepD); fBand(900, FL.rockD, { lw: 6, amp: 12, f: 0.01 });
  for (const [cx, h, key] of [[380, 300, 'v1'], [640, 210, 'v2']]) {
    for (let i = 0; i < 9; i++) { const u = mod(TT * 0.3 + i / 9, 1), x = cx + Math.sin(u * 6 + i) * 26 * u, y = 900 - h - u * 520; fCirc(x, y, 20 + u * 36, '#4a5670', { alpha: 1 - u * 0.7, lw: 4 }); }
    fShape([[cx - 62, 905], [cx - 30, 900 - h], [cx + 30, 900 - h], [cx + 62, 905]], '#3a3f4f', { shade: [14, 0], lw: 6 });
    fShape([[cx - 34, 900 - h + 4], [cx - 30, 900 - h - 14], [cx + 30, 900 - h - 14], [cx + 34, 900 - h + 4]], FL.orange, { lw: 5 });
    for (let i = 0; i < 2; i++) { const u = mod(TT * 0.2 + i / 2 + (cx > 500 ? 0.3 : 0), 1); grain(cx + Math.sin(u * 5 + i) * 70, 900 - h - 40 - u * 440, 0.65, key + 'g' + i, { c: FL.yellow }); }
  }
  for (let i = 0; i < 8; i++) { const R = RNG('bb', i), x = R.r(60, 940), y = mod(R.r(0, 900) - TT * R.r(60, 110), 920); fCirc(x, y, R.r(6, 11), 'rgba(255,255,255,0.35)', { lw: 2.5, line: FL.white }); }
  fLabel('hot water + minerals', 230, 380, 380, 560, at(4.8), { color: FL.orangeD });
}
function cVents(at) {
  title('The sea floor', at(0.6));
  write('hot vents leak dissolved rock', CL, 470, 44, at(2.6));
  write('the whole ocean passes through', CL, 650, 42, at(6.4));
  bigNum('every 10-20 million years', null, CCX, 770, at(8.6), CH.accent, 64);
}

// ---- 6. clue 4: the Sun lifts the water, the salt stays
function sSun() {
  fSky('#ffe9b0', FL.skyL); fSun(170, 190, 70, { mood: 'happy' }); fCloud(780, 170, 1.3);
  sea(820);
  for (let i = 0; i < 8; i++) { const u = mod(TT * 0.2 + i / 8, 1), x = 130 + i * 100 + Math.sin(u * 8 + i) * 14, y = 800 - u * 520; fDrop(x, y, 12, FL.skyL, { lw: 3, alpha: 1 - u * 0.6, shade: false, hi: false }); }
  const n = Math.floor(3 + 7 * clamp((TT - at(6.0)) / 6)); for (let i = 0; i < n; i++) { const R = RNG('sg', i); grain(R.r(80, 920), R.r(900, 1030), 0.7, 'sg' + i, { mood: i % 3 ? 'smile' : 'focus' }); }
  if (TT > at(8.4)) for (let i = 0; i < 7; i++) { const R = RNG('fr', i), x = R.r(680, 900), y = mod(R.r(0, 300) + TT * 360, 240) + 240; fDrop(x, y, 8, FL.sea, { lw: 2.5, shade: false, hi: false }); }
  fLabel('water leaves', 520, 300, 520, 390, at(2.6), { color: FL.seaD });
  fLabel('salt stays', 300, 760, 360, 930, at(5.2), { color: FL.pink });
}
function cSun(at) {
  title('The Sun', at(0.6));
  write('water evaporates...', CL, 470, 46, at(2.4));
  write("salt can't", CL, 560, 52, at(4.4), { color: CH.accent, weight: 800 });
  write('it falls again as fresh rain', CL, 660, 44, at(8.4), { color: CH.blue });
  write('the salt stays, trapped', CL, 750, 48, at(11.0), { weight: 800 });
}

// ---- 7. the turn: salt in = salt out (mud and sea life take some)
function sTurn() {
  fSky(FL.sea, FL.deep); fBand(860, '#c9a27a', { lw: 6, amp: 8, f: 0.01 });
  for (let i = 0; i < 7; i++) { const u = mod(TT * 0.15 + i / 7, 1), x = lerp(-30, 470 + (i % 4) * 110, Math.min(1, u * 1.6)), y = lerp(260 + (i % 3) * 70, 880, EZ.i2(clamp((u - 0.4) / 0.6))); grain(x, y, 0.6, 'tg' + i); }
  const fx = 300 + Math.sin(TT * 0.7) * 170, fy = 440 + Math.sin(TT * 1.4) * 20, dir = Math.cos(TT * 0.7) >= 0 ? 1 : -1;
  fShape([[fx - dir * 70, fy], [fx - dir * 130, fy - 42], [fx - dir * 130, fy + 42]], FL.orangeD, { lw: 5 }); fCirc(fx, fy, 80, FL.orange, { ry: 46, shade: [0, -8], lw: 5 }); fFace(fx + dir * 30, fy - 6, 0.75, 'smile', 'fish', { blush: false });
  fCirc(760, 850, 70, '#f7c6d2', { ry: 34, lw: 5 }); fLine(arcPts(760, 850, 70, Math.PI, TAU, 14, 0.5), FL.ink, 5); fFace(760, 846, 0.45, 'happy', 'clam');
  fPop(at(9.0), 640, 300, () => { fLine([[490, 300], [790, 300]], FL.ink, 12); fLine([[640, 300], [640, 420]], FL.ink, 12); fText('IN', 520, 280, 42, FL.pink, { align: 'center' }); fText('OUT', 760, 280, 42, FL.pink, { align: 'center' }); });
  fLabel('into the mud', 220, 980, 330, 890, at(5.0), { color: FL.rockD });
}
function cTurn(at) {
  title("Why isn't it getting saltier?", at(0.6));
  write('because salt leaves too:', CL, 420, 46, at(4.6));
  write('it sinks into sea-floor mud', CL, 510, 42, at(5.4));
  write('sea life uses some', CL, 590, 42, at(7.4));
  write('in = out, so it stays about the same', CL, 780, 42, at(9.4), { color: CH.accent, weight: 800 });
}

// ---- 8. the hush: a still sea
function sHush() { fSky(FL.sky, FL.skyL); fBand(560, FL.sea, { lw: 6 }); }

// ---- 9. the answer: the rivers were salty all along
function sAnswer() {
  fSky('#ffd77a', '#ffefc2');
  for (let i = 0; i < 20; i++) { const R = RNG('cf', i), x = R.r(0, 980), y = mod(R.r(0, 1080) + (TT - HIT) * R.r(90, 170), 1120) - 20; fRect(x, y, 18, 10, 3, [FL.pink, FL.sea, FL.grass, FL.purple][i % 4], { lw: 2 }); }
  sea(820); mountains(); river(RIVER, 34, FL.pinkL);
  for (let i = 0; i < 5; i++) { const [x, y] = along(RIVER, mod(TT * 0.18 + i / 5, 1)); grain(x, y, 0.6, 'ang' + i, { mood: 'happy' }); }
  fLabel('salty all along', 170, 560, 330, 500, at(3.4), { color: FL.pink, size: 38 });
  fHero(470, 780, 60, { mood: 'happy', arms: 'up', hop: HIT + 0.2 });
}
function cAnswer(at) {
  stamp('SOLVED', CCX, 300, at(0.4));
  write('the rivers were never truly fresh', CL, 470, 44, at(3.4), { weight: 800 });
  write('a pinch of salt, for hundreds', CL, 570, 42, at(6.0));
  write('of millions of years', CL, 630, 42, at(6.6));
  write('water leaves, salt stays', CL, 750, 54, at(9.0), { color: CH.accent, weight: 800 });
}

// ---- 10. the end: the beach again, at sunset
function sEnd() { sHook({ end: true }); }
function cEnd(at) {
  title('So...', at(0.6));
  write('next time you swallow a wave,', CL, 400, 44, at(1.6));
  write("you're tasting mountains", CL, 500, 56, at(4.4), { color: CH.accent, weight: 800 });
  write('dissolved by rain, carried by rivers,', CL, 680, 38, at(6.6));
  write('left behind by the Sun', CL, 750, 38, at(8.0));
}
