// =====================================================================
//  SCENES + CARDS — How do vaccines train your body? Left: cut-paper scenes (x 0..~990). Right: the card.
//  Colour means one thing: green = the germ, yellow knobs = its "face" (antigens), cream = Wes and his friends,
//  purple = B cells and antibodies, blue = killer T cells.
// =====================================================================
const CELL = '#f6f1e7', CELLD = '#d8cdb9', GERM = '#7cb24a', GERMD = '#4f8a32', KNOB = '#3f6f28', AB = '#8c7ad8', TC = '#4c6fb5';
const wes = (x, y, r, o = {}) => hero(x, y, r, { color: CELL, dark: CELLD, key: o.key ?? 'wes', mood: o.mood, arms: o.arms, pop: o.pop, s: o.s });
const bcell = (x, y, r, o = {}) => hero(x, y, r, { color: AB, dark: '#6a58b8', key: o.key ?? 'bc', mood: o.mood, arms: o.arms, pop: o.pop, s: o.s });
const tcell = (x, y, r, o = {}) => hero(x, y, r, { color: TC, dark: '#34508c', key: o.key ?? 'tc', mood: o.mood ?? 'focus', arms: o.arms, pop: o.pop, s: o.s });
// a germ: a green blob with spikes, each ending in a knob (an antigen). o: { lit(i) -> yellow knob, mood, pale, spin, face }
function germ(x, y, r, o = {}) {
  const key = o.key ?? 'g', n = o.n ?? 9, spin = TT * (o.spin ?? 0.35) + key.length, c = o.pale ? '#c9d6b8' : GERM, cd = o.pale ? '#a9b898' : GERMD;
  y += Math.sin(TT * 2.2 + key.length) * r * 0.06;
  for (let i = 0; i < n; i++) {
    const a = spin + i / n * TAU, x2 = x + Math.cos(a) * r * 1.3, y2 = y + Math.sin(a) * r * 1.3;
    cut(capsulePts(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, x2, y2, r * 0.13), cd, { key: key + 's' + i, sb: 4, grain: false });
    const lit = o.lit ? o.lit(i) : false;
    cut(i % 3 ? ellipsePts(x2, y2, r * 0.2, r * 0.2, 0, 10) : rect(x2 - r * 0.18, y2 - r * 0.18, r * 0.36, r * 0.36, 3), lit ? PAL.yellow : (o.pale ? '#b8c4a8' : KNOB), { key: key + 'k' + i, sb: 3, grain: false });
  }
  cut(ellipsePts(x, y, r, r * 0.95, 0, 30), c, { key: key + 'b', pat: pat.dots('rgba(255,255,255,0.16)', r * 0.04, r * 0.24) });
  if (o.face !== false) chFace(x, y + r * 0.05, r / 64, o.mood ?? 'focus', key);
}
// an antibody: a little Y
function yAb(x, y, s, a, key = 'y', c = AB) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
  cut(capsulePts(0, 0, 0, 30, 10), c, { key: key + 'a', sb: 3, grain: false });
  cut(capsulePts(0, 0, -18, -22, 10), c, { key: key + 'b', sb: 3, grain: false });
  cut(capsulePts(0, 0, 18, -22, 10), c, { key: key + 'c', sb: 3, grain: false });
  ctx.restore();
}
// the wanted poster: the germ's face, pinned with tape
function poster(x, y, s, o = {}) {
  const k = o.k ?? 1; if (k <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.04 + Math.sin(TT * 1.3) * 0.01); ctx.scale(s * k, s * k);
  cut(rect(-115, -145, 230, 290, 4), '#f3e3bf', { key: 'pst', sb: 12, pat: pat.lines('rgba(150,110,60,0.08)', 22) });
  handText('WANTED', -handW('WANTED', 46, 700) / 2, -96, 46, PAL.orangeD, { key: 'pw', weight: 700 });
  germ(0, 8, 42, { key: 'pg', spin: 0.05, lit: () => true });
  handText('this face', -handW('this face', 30) / 2, 122, 30, PAL.ink, { key: 'pf' });
  cut(rect(-32, -160, 64, 28, 2), 'rgba(240,230,190,0.9)', { key: 'ptape', shadow: false, grain: false });
  ctx.restore();
}
// a syringe pointing down its local +y axis; push 0..1 moves the plunger in
function syringe(x, y, a, s = 1, push = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
  const py = -60 * push;
  cut(rect(-9, -230 - py, 18, 130, 3), '#9aa3ad', { key: 'sy1', sb: 5, grain: false });
  cut(rect(-44, -244 - py, 88, 16, 4), '#7a8390', { key: 'sy2', sb: 5, grain: false });
  cut(rect(-36, -120, 72, 210, 10), 'rgba(232,242,248,0.92)', { key: 'sy3', sb: 8, grain: false });
  cut(rect(-28, -100 - py * 0 + 60 * push, 56, 180 - 60 * push, 6), '#6fb7d9', { key: 'sy4', shadow: false, grain: false });
  cut(rect(-64, -126, 128, 14, 4), '#9aa3ad', { key: 'sy5', sb: 4, grain: false });
  cut(rect(-3, 90, 6, 100, 2), '#c3cbd1', { key: 'sy6', sb: 3, grain: false });
  ctx.restore();
}
// red blood cells drifting past, and the tissue wall
function rbc(x, y, r, key) { cut(ellipsePts(x, y, r, r * 0.8, 0.3, 20), '#d9534f', { key: 'rbc' + key, sb: 6, grain: 0.3 }); cut(ellipsePts(x + 2, y + 1, r * 0.52, r * 0.36, 0.3, 14), '#bf3e3a', { key: 'rbi' + key, shadow: false, grain: false }); }
function tissue(c, key, n = 7) {
  wallC(c, (bb) => pat.dots('rgba(255,255,255,0.22)', 5, 58)(bb));
  for (let i = 0; i < n; i++) { const R = RNG('rbc', key, i); rbc(mod(R.r(0, 1100) + TT * R.r(18, 40), 1150) - 80, R.r(80, 1000) + Math.sin(TT * 0.8 + i) * 14, R.r(24, 38), key + i); }
}
const bob = (k, a = 8) => Math.sin(TT * 2.4 + k) * a;
const flyIn = (t, a, b) => lerp(a, b, EZ.o3(clamp((TT - t) / 0.8)));

// ---- 1. the hook: Wes has never met this germ; a shot; now he knows its face
function sHook(o = {}) {
  tissue('#f8c3d4', 'hk');
  cut([[-40, 860], [300, 830], [700, 870], [1960, 840], [1960, 1120], [-40, 1120]], '#ec9ab4', { key: 'hkfl', sy: -4 });
  if (!o.end && TT < at(6.2)) { const k = popS(at(0.8)); if (k > 0) { ctx.save(); ctx.translate(760, 400); ctx.scale(k, k); germ(0, 0, 70, { key: 'hkghost', pale: true, face: false }); ctx.restore(); tag('?', 760, 250, 60, { s: popS(at(1.6)) }); } }
  if (!o.end) {
    const inn = clamp((TT - at(3.4)) / 0.8), out = clamp((TT - at(6.0)) / 0.8), push = sm(TT, at(4.4), at(5.6));
    if (inn > 0 && out < 1) syringe(lerp(900, 560, EZ.o3(inn)) + out * 500, lerp(-200, 250, EZ.o3(inn)) - out * 500, 0.75, 0.9, push);
    if (TT >= at(6.2)) poster(740, 430, 1.0, { k: popS(at(6.2)) });
  }
  wes(380, 600 + bob(1), 120, { mood: o.mood ?? (TT > at(6.2) ? 'wow' : TT > at(4.6) ? 'focus' : 'smile'), pop: at(6.2), arms: TT > at(9.0) && !o.end ? 'up' : o.arms });
}
function cHook(at) {
  title('Never met. Ready.', at(0.8));
  write('one small shot...', CL, 400, 54, at(4.2));
  write("...and it knows the germ's face", CL, 500, 46, at(6.6));
  bigNum('?', 'how do you train for that?', CCX, 760, at(9.0), CH.accent, 170);
}

// ---- 2. every germ has a face: antigens
function sFace() {
  wallC('#a9d9c6', pat.dots('rgba(255,255,255,0.25)', 4, 50));
  for (let i = 0; i < 5; i++) { const R = RNG('fb', i); cut(ellipsePts(mod(R.r(0, 1000) + TT * 14, 1080) - 40, R.r(100, 1000), R.r(10, 22), R.r(10, 22), 0, 12), 'rgba(255,255,255,0.5)', { key: 'fb' + i, shadow: false, grain: false }); }
  const lit = (i) => TT > at(3.6) + i * 0.15;
  germ(430, 520, 170, { key: 'big', lit, spin: 0.12, mood: TT > at(10.0) ? 'sad' : 'focus' });
  if (TT > at(3.8)) tag('antigens', 430, 150, 46, { s: popS(at(3.8)) });
  if (TT > at(7.0)) {
    const x = flyIn(at(7.0), 1100, 820);
    wes(x, 840 + bob(2), 80, { key: 'wesF', mood: TT > at(9.6) ? 'happy' : 'focus', arms: TT > at(9.6) ? 'up' : null });
    cut(capsulePts(x - 70, 790, x - 120, 740, 14), '#8a6a4a', { key: 'mgh', sb: 4, grain: false });
    cut(ellipsePts(x - 140, 718, 40, 40, 0, 24), 'rgba(220,240,250,0.65)', { key: 'mgl', sb: 4, grain: false, line: '#8a6a4a', lw: 6 });
  }
}
function cFace(at) {
  title('Every germ has a face', at(0.6));
  popAt(at(2.4), CL + 70, 420, () => germ(0, 0, 44, { key: 'cg', lit: () => TT > at(4.4) }));
  write('antigens:', CL + 170, 410, 52, at(4.4), { weight: 700 });
  write('unique shapes on its skin', CL + 170, 470, 38, at(4.6));
  write('learn the face...', CL, 650, 54, at(7.2));
  write('...hunt anything wearing it', CL, 760, 50, at(10.0), { color: CH.accent, weight: 700 });
}

// ---- 3. the first meeting: slow, and the germ multiplies
const GSPOT = (() => { const R = RNG('gspot'), P = []; for (let i = 0; i < 32; i++) P.push([R.r(470, 940), R.r(140, 900)]); return P; })();
function sFirst() {
  tissue('#e9b9a4', 'fs', 5);
  // a calendar on the wall: the days go by
  cut(rect(90, 140, 210, 230, 6), '#fbf6ea', { key: 'cal', sb: 8 }); cut(rect(90, 140, 210, 56, 6), PAL.orangeD, { key: 'calt', shadow: false, grain: false });
  const day = 1 + Math.floor(clamp((TT - at(4.6)) / 4.4) * 13);
  handText('day', 160, 184, 30, '#fff', { key: 'cald' }); handText(String(day), 195 - handW(String(day), 110, 700) / 2, 330, 110, PAL.ink, { key: 'caln' + day, weight: 700 });
  const n = TT < at(8.8) ? 1 : Math.min(32, 2 ** (1 + Math.floor((TT - at(8.8)) / 0.45)));
  for (let i = 0; i < n; i++) { const [x, y] = i === 0 ? [flyIn(at(0.6), 1100, 700), 480] : GSPOT[i]; const k = i === 0 ? 1 : popS(at(8.8) + Math.floor(Math.log2(i)) * 0.45 + 0.45); if (k > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); germ(0, 0, i === 0 ? 70 : 34, { key: 'gf' + i, mood: 'happy' }); ctx.restore(); } }
  const sick = TT > at(10.6);
  wes(240, 690 + bob(3, sick ? 2 : 8), 100, { key: 'wesS', mood: TT > at(1.6) ? (sick ? 'sad' : 'wow') : 'smile' });
  if (sick) { for (let i = 0; i < 2; i++) { const p = mod(TT * 0.8 + i * 0.5, 1); cut(ellipsePts(300 + i * 30, 600 + p * 60, 8, 12, 0, 10), '#7fc3e6', { key: 'swt' + i, sb: 2, grain: false }); } }
}
function cFirst(at) {
  title('The first meeting', at(0.6));
  write('caught off guard', CL, 390, 54, at(2.0));
  bigNum('1-2 weeks', 'to build the right defence', CCX, 560, at(5.0), CH.accent, 100);
  [1, 2, 4, 8].forEach((m, i) => popAt(at(9.0 + i * 0.4), CL + 60 + i * 175, 760, () => { germ(0, 0, 24, { key: 'cgf' + i, face: false }); chText('×' + m, 40, 14, 40, CH.ink, { key: 'cgx' + i }); }));
  write('...and you get sick', CL, 900, 50, at(11.2), { color: CH.accent, weight: 700 });
}

// ---- 4. a vaccine: the face, without the fight
function sVaccine() {
  wallC('#cfe2ee', pat.lines('rgba(255,255,255,0.4)', 60));
  cut([[-40, 900], [1960, 880], [1960, 1120], [-40, 1120]], '#a9c8dc', { key: 'vfl', sy: -4 });
  const push = sm(TT, at(1.4), at(3.6));
  syringe(560, 170 + Math.sin(TT * 1.2) * 6, 0, 1.0, push);
  for (let n = 0; n < 8; n++) { const t0 = at(1.6) + n * 0.5, u = (TT - t0) / 0.9; if (u > 0 && u < 1) cut(ellipsePts(560 + (n % 3 - 1) * 18 * u, lerp(365, 860, u * u), 10, 14, 0, 10), '#6fb7d9', { key: 'vd' + n, sb: 3, grain: false }); }
  for (let n = 0; n < 5; n++) { const R = RNG('vbub', n); cut(ellipsePts(mod(R.r(0, 1000) + TT * R.r(30, 60), 1100) - 50, R.r(320, 820) + Math.sin(TT + n) * 30, R.r(16, 30), R.r(16, 30), 0, 14), 'rgba(255,255,255,0.55)', { key: 'vbb' + n, shadow: false, grain: false }); }
  const items = [[at(6.2), 420, (k) => germ(0, 0, 54, { key: 'vw', pale: true, mood: 'sad', spin: 0.02 })], [at(8.0), 600, () => { cut(capsulePts(0, 30, 0, -10, 18), KNOB, { key: 'vp1', sb: 4, grain: false }); cut(ellipsePts(0, -24, 30, 30, 0, 16), PAL.yellow, { key: 'vp2', sb: 5, grain: false }); }],
    [at(10.0), 790, () => { cut(rect(-60, -44, 120, 88, 10), '#fbf6ea', { key: 'vr1', sb: 6 }); cut(ellipsePts(-60, 0, 14, 44, 0, 12), '#e8dcc0', { key: 'vr2', sb: 3, grain: false }); for (let l = 0; l < 3; l++) ink([[-34, -20 + l * 20], [40 - l * 10, -20 + l * 20]], { w: 4, color: '#9a8a7a', key: 'vrl' + l }); }]];
  items.forEach(([t, x, fn], i) => { if (TT < t - 0.6) return; const u = clamp((TT - (t - 0.6)) / 0.6), y = u < 1 ? lerp(300, 820, EZ.i2(u)) : 820, q = squash(t); ctx.save(); ctx.translate(x, y); ctx.scale(q.sx, q.sy); fn(); ctx.restore(); });
  wes(180, 700 + bob(4), 96, { key: 'wesV', mood: TT > at(6.2) ? 'wow' : 'smile', arms: TT > at(10.6) ? 'wave' : null });
}
function cVaccine(at) {
  title('A vaccine: the face only', at(0.6));
  write('no real fight', CL, 390, 54, at(2.4));
  [[6.2, 'a weakened or killed germ', 44], [8.0, 'just a harmless piece of it', 44], [10.0, 'the recipe for that piece', 44]].forEach(([t, s, z], i) => { check(CL + 6, 540 + i * 110, at(t), 'vk' + i); write(s, CL + 80, 556 + i * 110, z, at(t)); });
  write('(that is how mRNA vaccines work)', CL + 80, 850, 34, at(11.2), { color: '#7a6a5a' });
}

// ---- 5. the wanted poster goes to the lymph node
function sPoster() {
  wallC('#d9c8ec', pat.dots('rgba(255,255,255,0.25)', 4, 56));
  cut(ellipsePts(720, 560, 250, 360, 0.1, 40), '#b49ad8', { key: 'lymph', sb: 16, pat: pat.dots('rgba(255,255,255,0.15)', 6, 40) });
  handText('lymph node', 640, 210, 40, '#4a3a6a', { key: 'lyl' });
  const match = TT > at(10.6);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { const k = j * 3 + i, x = 625 + i * 100, y = 410 + j * 150 + bob(k, 4), m = match && k === 4; (k % 2 ? bcell : tcell)(x, y, m ? 42 : 28, { key: 'ln' + k, mood: m ? 'wow' : TT > at(6.0) ? (k % 3 ? 'focus' : 'smile') : 'smile', pop: m ? at(10.6) : null }); if (m && TT < at(12.6)) sparkle(x + 40, y - 50, 18 * popS(at(10.7))); }
  // the sentinel (dendritic) cell carries the poster in
  const x = TT < at(5.6) ? lerp(110, 330, EZ.io(clamp((TT - at(0.6)) / 4.6))) : 330, wk = Math.sin(TT * 6) * 6;
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3 + Math.sin(TT * 2 + i) * 0.15; cut(capsulePts(x, 720 + wk, x + Math.cos(a) * 90, 720 + wk + Math.sin(a) * 80, 30), '#e5683f', { key: 'dc' + i, sb: 5, grain: false }); }
  cut(ellipsePts(x, 720 + wk, 70, 66, 0, 28), PAL.orange, { key: 'dcb' }); chFace(x, 726 + wk, 1.0, TT > at(10.6) ? 'happy' : 'smile', 'dc');
  if (TT < at(5.6)) poster(x, 470 + wk, 0.7, { k: popS(at(0.3)) });
  else poster(lerp(x, 470, EZ.io(clamp((TT - at(5.6)) / 0.6))), lerp(470, 300, EZ.io(clamp((TT - at(5.6)) / 0.6))), 0.7);
}
function cPoster(at) {
  title('The wanted poster', at(0.6));
  write('sentinel cells grab the piece', CL, 390, 44, at(1.6));
  write('(dendritic cells)', CL, 450, 34, at(2.4), { color: '#7a6a5a' });
  write('→ off to your lymph nodes', CL, 560, 46, at(4.4));
  bubble('anyone know this face?', CCX, 700, 44, at(7.0));
  write('a perfect match!', CL, 890, 56, at(10.6), { color: CH.accent, weight: 700 });
}

// ---- 6. build an army: B cells fire antibodies, killer T cells clear infected cells
function sArmy() {
  wallC('#fbe6a2', pat.stripes('rgba(255,255,255,0.25)', 6, 40, 0.6));
  for (let i = 0; i < 6; i++) { const k = popS(at(0.8) + i * 0.2); if (k <= 0) continue; const x = 110 + (i % 2) * 190, y = 180 + Math.floor(i / 2) * 190 + (i % 2) * 80; bcell(x, y + bob(i, 5), 46 * k, { key: 'ba' + i, mood: 'focus', arms: TT > at(4.0) ? 'up' : null }); }
  const G = [[760, 260], [840, 500], [700, 700]];
  G.forEach(([gx, gy], g) => { const hit = TT > at(6.6) + g * 0.3; germ(gx, gy, 56, { key: 'ga' + g, mood: hit ? 'sad' : 'focus', spin: hit ? 0.02 : 0.3 }); });
  if (TT > at(4.0)) for (let n = 0; n < 9; n++) { const t0 = at(4.0) + n * 0.25, u = clamp((TT - t0) / 1.2); if (u <= 0) continue; const s0 = [240, 220 + (n % 3) * 170], [gx, gy] = G[n % 3], a = (n / 9) * TAU, tgt = [gx + Math.cos(a) * 74, gy + Math.sin(a) * 74]; yAb(lerp(s0[0], tgt[0], EZ.o3(u)), lerp(s0[1], tgt[1], EZ.o3(u)), 0.9, u < 1 ? TT * 6 : a + Math.PI / 2, 'yb' + n); }
  // the killer T cell and an infected cell
  const pop = TT > at(8.4), k = pop ? 1 - clamp((TT - at(8.4)) / 0.4) : 1;
  if (k > 0) { cut(ellipsePts(560, 900, 70 * k, 60 * k, 0, 24), '#e2d6c8', { key: 'inf', sb: 6 }); if (k > 0.5) germ(560, 900, 24 * k, { key: 'ginf', face: false }); }
  if (pop) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, d = (TT - at(8.4)) * 260; if (d < 220) cut(ellipsePts(560 + Math.cos(a) * d, 900 + Math.sin(a) * d, 10, 10, 0, 8), '#e2d6c8', { key: 'cf' + i, sb: 2, grain: false }); }
  tcell(flyIn(at(6.6), 1100, 760), 900 + bob(5), 64, { key: 'tk', arms: TT > at(8.2) ? 'up' : null, pop: at(8.4) });
  wes(360, 900 + bob(6), 70, { key: 'wesA', mood: TT > at(10.6) ? 'happy' : 'focus', arms: 'up' });
}
function cArmy(at) {
  title('Build an army', at(0.6));
  popAt(at(3.0), CL + 30, 400, () => yAb(0, 0, 1.3, 0, 'cy'));
  write('B cells → antibodies', CL + 90, 420, 48, at(3.0));
  write('Y-shaped tags on the face', CL + 90, 490, 38, at(5.2));
  write('killer T cells', CL, 640, 48, at(7.0), { color: TC });
  write('→ clear infected cells', CL, 710, 44, at(8.4));
  write('an army for ONE enemy', CL, 890, 54, at(10.6), { color: CH.accent, weight: 700 });
}

// ---- 7. memory cells keep the poster up
function sMemory() {
  wallC('#26315f', pat.dots('rgba(255,225,170,0.06)', 4, 70));
  cut(rect(120, 120, 300, 260, 8), '#141c40', { key: 'win', sb: 8 }); ctx.save(); ctx.beginPath(); ctx.rect(130, 130, 280, 240); ctx.clip(); starsC('mw', 40); ctx.restore();
  cut([[-40, 860], [1960, 840], [1960, 1120], [-40, 1120]], '#1d2448', { key: 'mfl', sy: -4 });
  glowC(640, 360, 200, '#fff2c8', 0.35);
  poster(640, 380, 0.85);
  for (let i = 0; i < 6; i++) { const k = 1 - clamp((TT - at(1.6) - i * 0.25) / 0.6); if (k <= 0.01) continue; const x = 160 + i * 140 + (1 - k) * 200; (i % 2 ? bcell : tcell)(x, 900 - (1 - k) * 40, 40 * k, { key: 'rt' + i, mood: 'happy', arms: 'wave' }); }
  const m = popS(at(4.4));
  if (m > 0) { wes(520, 800 + bob(7, 4), 70 * m, { key: 'mem1', mood: 'focus' }); bcell(770, 800 + bob(8, 4), 56 * m, { key: 'mem2', mood: 'focus' }); }
  if (TT > at(6.6)) { const yrs = ['1 year', '5 years', '20 years...'], i = Math.min(2, Math.floor((TT - at(6.6)) / 1.0)); tag(yrs[i], 270, 520, 40, { s: popS(at(6.6) + i * 1.0), tape: true }); }
}
function cMemory(at) {
  title('Memory cells', at(0.6));
  write('most of the army retires', CL, 390, 48, at(2.0));
  write('a few stay: memory cells', CL, 490, 48, at(5.4), { color: CH.accent, weight: 700 });
  bigNum('years', 'sometimes decades', CCX, 680, at(8.4), CH.ink, 110);
  write('the poster stays up', CL, 890, 52, at(10.8));
}

// ---- 8. the rematch: the real germ shows up and is wiped out fast
function sRematch() {
  tissue('#f8c3d4', 'rm', 5);
  poster(170, 300, 0.6);
  const gone = TT > at(10.8);
  for (let g = 0; g < 3; g++) {
    const gx = flyIn(at(0.6) + g * 0.4, 1150, 640 + g * 110), gy = 300 + g * 220;
    if (!gone) { germ(gx, gy, 54, { key: 'gr' + g, mood: TT > at(6.0) ? 'sad' : 'happy' }); if (TT > at(6.0)) for (let n = 0; n < 5; n++) { const u = clamp((TT - at(6.0) - n * 0.15 - g * 0.2) / 1.0); if (u > 0) { const a = n / 5 * TAU + g, tx = gx + Math.cos(a) * 70, ty = gy + Math.sin(a) * 70; yAb(lerp(300, tx, EZ.o3(u)), lerp(700, ty, EZ.o3(u)), 0.8, a + Math.PI / 2, 'yr' + g + n); } } }
    else for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + g, d = (TT - at(10.8)) * 300; if (d < 260) cut(ellipsePts(gx + Math.cos(a) * d, gy + Math.sin(a) * d, 9, 6, a, 8), [PAL.yellow, '#fff', AB, GERM][i % 4], { key: 'rc' + g + i, sb: 2, grain: false }); }
  }
  wes(300, 760 + bob(9), 90, { key: 'wesR', mood: gone ? 'happy' : TT > at(3.6) ? 'wow' : 'smile', arms: gone ? 'up' : null, pop: at(3.6) });
  if (TT > at(3.6) && TT < at(6.6)) tag('!', 300, 600, 70, { s: popS(at(3.6)) });
  for (let i = 0; i < 4; i++) if (TT > at(5.6)) bcell(150 + i * 70, 960 + bob(i + 10, 5), 34 * popS(at(5.6) + i * 0.1), { key: 'rb' + i, arms: 'up', mood: 'focus' });
}
function cRematch(at) {
  title('The rematch', at(0.6));
  const bar = (y, w, c, t, lab, key) => { write(lab, CL, y - 20, 42, t); const f = ev(t + 0.3, 0.8); if (f > 0) cbox(CL + w * f / 2, y + 40, w * f, 50, c, key, { r: 10 }); };
  bar(400, 700, '#bfb3a3', at(5.0), 'first time: 1-2 weeks', 'b1');
  bar(570, 160, CH.accent, at(6.6), 'next time: days', 'b2');
  write('faster and stronger', CL, 760, 48, at(8.0));
  write('often before you feel sick', CL, 890, 48, at(10.8), { color: CH.green, weight: 700 });
}

// ---- 9. the hush: the poster in the dark
function sHush() { wallC('#141c40'); glowC(495, 480, 180, '#fff2c8', 0.18); poster(495, 500, 0.9); }

// ---- 10. the payoff: the planet
function sWorld() {
  wallC('#f6cf55', pat.stripes('rgba(255,255,255,0.22)', 10, 46, -0.5));
  for (let i = 0; i < 34; i++) { const R = RNG('cfw', i); cut(rect(R.r(0, 980), mod(R.r(0, 1080) + (TT - HIT) * R.r(120, 220), 1120) - 20, 16, 9, 2), [PAL.teal, PAL.pink, PAL.purple, '#fff', PAL.orange][i % 5], { key: 'cfw' + i, sb: 2, grain: false }); }
  const cx = 495, cy = 560, R = 260;
  cut(ellipsePts(cx, cy, R, R, 0, 48), '#4c8fd6', { key: 'globe', sb: 18 });
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 4, 0, TAU); ctx.clip();
  [[-120, -80, 110, 80], [60, 40, 140, 100], [-60, 140, 90, 50], [150, -120, 70, 60], [-200, 60, 60, 90]].forEach(([dx, dy, rx, ry], i) => { const x = cx + mod(dx + (TT - HIT) * 30 + 400, 800) - 400; cut(ellipsePts(x, cy + dy, rx, ry, i, 18), '#5aa05a', { key: 'cont' + i, shadow: false, tear: 2 }); });
  ctx.restore();
  chFace(cx, cy + 20, 2.2, TT > at(10.4) ? 'happy' : 'smile', 'globe');
  if (TT > at(3.4)) { const k = popS(at(3.4)); ctx.save(); ctx.translate(cx, 110); ctx.rotate(-0.08); ctx.scale(k, k); tag('smallpox', 0, 0, 56, { fill: '#f3e3bf' }); ink([[-150, -40], [150, 40]], { w: 12, color: '#e0483a', key: 'xs1', frac: ev(at(4.0), 0.4) }); ctx.restore(); }
  if (TT > at(10.4)) for (let i = 0; i < 16; i++) { const a = (i + 0.5) / 16 * TAU - Math.PI / 2, k = popS(at(10.4) + i * 0.08); if (k > 0) { const x = cx + Math.cos(a) * (R + 90), y = cy + Math.sin(a) * (R + 90); hero(x, y + bob(i, 4), 30 * k, { key: 'ppl' + i, color: [PAL.pink, PAL.teal, PAL.orange, PAL.purple][i % 4], dark: '#00000033', mood: 'happy', arms: i % 3 ? null : 'up' }); } }
}
function cWorld(at) {
  title('Planet-wide', at(0.3));
  write('smallpox: gone', CL, 400, 58, at(3.4), { weight: 700 });
  write('declared eradicated, 1980', CL, 480, 42, at(5.6));
  bigNum('154 million', 'lives saved in the last 50 years', CCX, 700, at(10.4), CH.accent, 104);
  write('WHO, 2024', CL, 900, 36, at(12.4), { color: '#7a6a5a' });
}

// ---- 11. the end: the poster is up, and a germ thinks twice
function sEnd() {
  sHook({ end: true, mood: 'happy', arms: 'wave' });
  poster(740, 330, 0.75);
  const x = TT < at(6.0) ? flyIn(at(2.6), 1100, 760) : lerp(760, 1150, EZ.i2(clamp((TT - at(6.0)) / 1.2)));
  germ(x, 930, 46, { key: 'gend', mood: TT > at(4.6) ? 'wow' : 'happy' });
}
function cEnd(at) {
  title('So...', at(0.6));
  write('a vaccine = a wanted poster', CL, 390, 46, at(1.6));
  write('shown before the criminal arrives', CL, 470, 40, at(4.0));
  bigNum('1 small shot', 'ready for an enemy it never met', CCX, 700, at(6.8), CH.accent, 96);
}
