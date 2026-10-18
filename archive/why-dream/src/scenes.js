// =====================================================================
//  SCENES — Why do we dream? One sketchbook page; the explanation is hand-lettered on the right (no card).
//  The terracotta doodle is the dreamer (and only the dreamer); yellow highlighter = the dream itself.
// =====================================================================
const CHANNEL = { halo: 'rgba(242,234,216,0.85)', colors: { ink: SK.ink, accent: SK.terraD, green: SK.green, blue: SK.blue },
  tag: (str, k) => { const size = 58, w = letterW(str, size, 'marker'), x = CL, y = 122; tapeStrip(x + w / 2, y - size * 0.3, w + 60, -0.03, 'ttape' + str, size * 1.1); handLetter(str, x, y, size, { face: 'marker', align: 'left', reveal: clamp(k), key: 'tg' + str, jit: 0.7 }); } };
const pageLife = (key) => { [[60, 980, 0], [940, 130, 1]].forEach(([x, y, i]) => doodleStar(x, y, 18 + 5 * ((B + i) % 3 === 0), key + 'ms' + i, { w: 2.6 })); };
// the dreamer asleep in bed, with a nightcap
function bed(x, y, key = 'bed') {
  const F = sketchBox(x - 230, y - 40, 460, 110, 14, 0.02); gfill(F, SK.wood, { key: key + 'ff' }); gline(F, { key: key + 'f', w: 5 });
  gline([[x - 230, y - 40], [x - 230, y - 170]], { w: 6, key: key + 'h1' }); gline([[x + 230, y - 40], [x + 230, y - 110]], { w: 6, key: key + 'h2' });
  const Pl = loopPts(x - 150, y - 70, 70, 34, 0.04); gfill(Pl, SK.sheet, { key: key + 'pf' }); gline(Pl, { key: key + 'p', w: 4 });
  const Bl = sketchBox(x - 90, y - 90, 310, 70, 24, 0.02); gfill(Bl, SK.blue, { key: key + 'bf', a: 0.55 }); ghatchIn(Bl, key); gline(Bl, { key: key + 'b', w: 4.5 });
}
function ghatchIn(P, key) { ctx.save(); gclip(P); const bb = bbox(P); ghatch(bb.x0, bb.y0, bb.x1, bb.y1, { key: key + 'hh', gap: 12, col: SK.graph, a: 0.35, w: 2 }); ctx.restore(); }
function sleeper(x, y, r, o = {}) {
  const br = Math.sin(TT * 1.6) * 0.03;
  doodleHero(x, y, r, { key: o.key ?? 'dreamer', mood: o.mood ?? 'happy', sx: 1 + br, sy: 1 - br, look: o.look, arms: o.arms, legs: o.legs, step: o.step });
  if (o.cap !== false) { const C = [[x - r * 0.75, y - r * 0.55], [x + r * 0.6, y - r * 0.85], [x + r * 1.25, y - r * 0.15]]; gfill([...C, [x + r * 0.2, y - r * 1.2]], SK.blue, { key: 'capf' + (o.key ?? ''), a: 0.8 }); gline([C[0], [x + r * 0.2, y - r * 1.25], C[2]], { key: 'cap' + (o.key ?? ''), w: 4 }); gfill(loopPts(x + r * 1.25, y - r * 0.15, r * 0.14, r * 0.14, 0), SK.sheet, { key: 'capb' }); gline(loopPts(x + r * 1.25, y - r * 0.15, r * 0.14, r * 0.14, 0.1), { key: 'capbo', w: 3 }); }
}
function zzz(x, y, key) { for (let i = 0; i < 3; i++) { const u = mod(TT * 0.5 + i / 3, 1); handLetter('z', x + u * 60 + i * 6, y - u * 120, 30 + u * 30, { key: key + i + Math.floor(TT * 0.5 + i / 3), col: SK.graph, jit: 1 }); } }
// a thought cloud (bumps round an ellipse), drawn on with part; returns its outline
function thought(cx, cy, rx, ry, key, part = 1, o = {}) {
  const P = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU, b = 1 + 0.12 * Math.abs(Math.sin(a * 4.5)); P.push([cx + Math.cos(a) * rx * b, cy + Math.sin(a) * ry * b]); }
  if (part > 0.5) { gfill(P, SK.sheet, { key: key + 'f', off: [0, 0] }); if (o.hi) scribbleFill(P, SK.hilite, { key: key + 'h', gap: 14, a: 0.35, base: 0.18, part: clamp((part - 0.5) * 2) }); }
  gline(closeP(P), { key: key + 'o', w: 4.5, part });
  if (o.tail) for (let i = 0; i < 3; i++) { const [tx, ty] = [lerp(o.tail[0], cx - rx * 0.6, i / 3), lerp(o.tail[1], cy + ry * 0.9, i / 3)], rr = 8 + i * 6; if (part > i * 0.2) { gfill(loopPts(tx, ty, rr, rr, 0), SK.sheet, { key: key + 't' + i, off: [0, 0] }); gline(loopPts(tx, ty, rr, rr, 0.06), { key: key + 'to' + i, w: 3 }); } }
  return P;
}
// little dream doodles that can live inside a cloud
const D2 = {
  fishLegs: (x, y, s, k) => { const B0 = loopPts(x, y, 46 * s, 26 * s, 0.05); gfill(B0, SK.blue, { key: k + 'f', a: 0.6 }); gline(B0, { key: k + 'o', w: 3.5 }); gline([[x + 44 * s, y], [x + 74 * s, y - 20 * s], [x + 74 * s, y + 20 * s], [x + 44 * s, y]], { key: k + 't', w: 3.5 }); const st = Math.sin(TT * 8) * 10 * s; gline([[x - 14 * s, y + 24 * s], [x - 20 * s + st, y + 52 * s]], { key: k + 'l1', w: 3.5, second: false }); gline([[x + 14 * s, y + 24 * s], [x + 20 * s - st, y + 52 * s]], { key: k + 'l2', w: 3.5, second: false }); chDot(x - 26 * s, y - 6 * s, 4 * s, SK.ink); },
  toast: (x, y, s, k) => { const T = sketchBox(x - 36 * s, y - 30 * s, 72 * s, 60 * s, 14 * s, 0.03); gfill(T, SK.wood, { key: k + 'f' }); gline(T, { key: k + 'o', w: 3.5 }); const wf = Math.sin(TT * 10) * 14 * s; gline([[x - 36 * s, y - 10 * s], [x - 70 * s, y - 30 * s + wf], [x - 40 * s, y - 24 * s]], { key: k + 'w1', w: 3 }); gline([[x + 36 * s, y - 10 * s], [x + 70 * s, y - 30 * s + wf], [x + 40 * s, y - 24 * s]], { key: k + 'w2', w: 3 }); },
  card: (x, y, s, k, lab) => { const C = sketchBox(x - 44 * s, y - 30 * s, 88 * s, 60 * s, 6, 0.03); gfill(C, SK.sheet, { key: k + 'f', off: [0, 0] }); gline(C, { key: k + 'o', w: 3 }); if (lab) handLetter(lab, x, y + 10 * s, 24 * s, { key: k + 'l' }); },
  heart: (x, y, s, k, col = SK.red) => { const P = Array.from({ length: 30 }, (_, i) => { const t = i / 30 * TAU; return [x + 16 * Math.sin(t) ** 3 * 2.4 * s, y - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2.4 * s]; }); gfill(P, col, { key: k + 'f', a: 0.8 }); gline(closeP(P), { key: k + 'o', w: 3.5 }); },
  monster: (x, y, s, k) => { graphiteScribble(x, y, 150 * s, 130 * s, k + 'm'); for (const ex of [-22, 22]) { gfill(loopPts(x + ex * s, y - 14 * s, 12 * s, 14 * s, 0), SK.sheet, { key: k + 'e' + ex, off: [0, 0] }); chDot(x + ex * s + 4 * s, y - 12 * s, 5 * s, SK.ink); } gline([[x - 30 * s, y + 24 * s], [x - 10 * s, y + 34 * s], [x + 10 * s, y + 24 * s], [x + 30 * s, y + 34 * s]], { key: k + 'mo', w: 3.5 }); },
};

// ---- 1. the hook: asleep, a dream cloud, a question
function sHook(o = {}) {
  sketchPage({ grid: 'dots' }); pageLife('hk');
  bed(380, 820, 'hkbed'); sleeper(250, 735, 52, { key: 'dreamer' }); zzz(330, 640, 'hkz');
  const part = o.done ? 1 : ev(at(1.0), 1.4), C = thought(700, 300, 220, 150, 'hkcl', part, { hi: true, tail: [360, 640] });
  if (part > 0.9) { D2.fishLegs(640, 270, 0.9, 'hkf'); D2.toast(790, 330, 0.8, 'hkt'); }
  if (!o.done && TT > at(8.6)) handLetter('?', 920, 140, 110, { face: 'marker', col: SK.terraD, key: 'hkq', reveal: ev(at(8.6), 0.3) });
}
function cHook(at) {
  title('Why do we dream?', at(0.8));
  bigNum('~2 hours', 'of dreams, every night', CCX, 420, at(2.4), CH.accent, 110);
  write('...and you forget most of them', CL, 620, 46, at(5.0));
  write('scientists still argue why', CL, 780, 50, at(8.6), { weight: 700 });
}

// ---- 2. REM: eyes dart, the brain lights up, the body is kept still
function sRem() {
  sketchPage({ grid: 'dots' });
  const ex = 300, ey = 300, dart = Math.sin(TT * 9) * 40 + Math.sin(TT * 23) * 14;
  const Lid = [[ex - 180, ey], [ex - 90, ey - 70], [ex + 90, ey - 70], [ex + 180, ey], [ex + 90, ey + 60], [ex - 90, ey + 60]];
  gfill(Lid, SK.sheet, { key: 'eyef', off: [0, 0] }); ctx.save(); gclip(Lid); const Pu = loopPts(ex + dart, ey, 46, 46, 0); gfill(Pu, SK.blue, { key: 'pupf', a: 0.5 }); gline(Pu, { key: 'pup', w: 4 }); ghatch(ex - 180, ey - 70, ex + 180, ey - 10, { key: 'lid', gap: 8, col: SK.graph, a: 0.55 }); ctx.restore();
  gline(closeP(Lid), { key: 'eye', w: 5 }); for (let i = 0; i < 6; i++) gline([[ex - 120 + i * 48, ey - 64], [ex - 130 + i * 50, ey - 92]], { key: 'lash' + i, w: 3, second: false });
  handLetter('REM = rapid eye movement', ex, ey + 130, 32, { key: 'reml', col: SK.graph, reveal: ev(at(1.6), 0.6) });
  // the brain wave: as busy as awake
  if (TT > at(3.4)) { const P = []; for (let i = 0; i <= 80; i++) { const x = 80 + i * 10; P.push([x, 560 + Math.sin(i * 1.3 + TT * 6) * 26 + Math.sin(i * 3.1) * 14]); } gline(P, { key: 'eeg', w: 3.5, part: ev(at(3.4), 1.2), second: false }); handLetter('brain: as busy as awake', 480, 650, 30, { key: 'eegl', col: SK.graph, reveal: ev(at(4.6), 0.6) }); }
  bed(470, 900, 'rembed'); sleeper(340, 815, 46, { key: 'dreamer', mood: 'calm' });
  if (TT > at(9.4)) { const k = ev(at(9.4), 0.4); gline(loopPts(720, 790, 36 * k, 36 * k, 0.1), { key: 'pz', w: 4, col: SK.red }); gline([[708, 776], [708, 806]], { key: 'pz1', w: 5, col: SK.red, second: false }); gline([[732, 776], [732, 806]], { key: 'pz2', w: 5, col: SK.red, second: false }); }
}
function cRem(at) {
  title('REM sleep', at(0.6));
  write('eyes dart under closed lids', CL, 400, 46, at(3.4));
  write('the brain lights up', CL, 500, 46, at(6.2));
  write('the body is kept still', CL, 600, 46, at(9.6), { color: CH.accent, weight: 700 });
}

// ---- 3. idea 1: noise from the brainstem, stitched into a story
function sNoise() {
  sketchPage({ grid: 'dots' }); pageLife('nz');
  const brain = loopPts(450, 330, 230, 160, 0.05); gfill(brain, SK.pink, { key: 'brf', a: 0.55 }); ghatchIn(brain, 'br'); gline(brain, { key: 'br', w: 5 });
  for (let i = 0; i < 5; i++) gline(arcPts(380 + i * 40, 300 + (i % 2) * 40, 60, 0.5, 2.6, 8), { key: 'brc' + i, w: 3, second: false });
  gline([[450, 490], [440, 620], [460, 760]], { key: 'stem', w: 14 });
  for (let n = 0; n < 4; n++) { const u = mod(TT * 0.7 + n / 4, 1), y = lerp(760, 480, u), x = 450 + Math.sin(n * 2 + u * 9) * 30; gline([[x - 12, y + 20], [x + 10, y + 6], [x - 8, y - 6], [x + 12, y - 20]], { key: 'zap' + n, w: 4, col: SK.terraD, second: false }); }
  if (TT > at(4.6)) { const k = ev(at(4.6), 0.8); for (let f = 0; f < 4; f++) { const fx = 120 + f * 210, fy = 880; if (k < f / 4) continue; const Fr = sketchBox(fx, fy - 70, 180, 140, 6, 0.02); gfill(Fr, SK.sheet, { key: 'fr' + f, off: [0, 0] }); gline(Fr, { key: 'fro' + f, w: 3.5 }); [() => D2.fishLegs(fx + 90, fy - 10, 0.7, 'nf'), () => D2.toast(fx + 90, fy, 0.7, 'nt'), () => sleeper(fx + 90, fy + 10, 32, { key: 'nzh', cap: false, mood: 'wow' }), () => handLetter('?!', fx + 90, fy + 20, 60, { key: 'nq', face: 'marker', col: SK.terraD })][f](); } }
}
function cNoise(at) {
  title('Noise', at(0.6));
  write('signals fire up from the brainstem', CL, 400, 42, at(4.2));
  write('the brain stitches a story', CL, 500, 46, at(7.6));
  write('weird plots included', CL, 640, 50, at(10.6), { color: CH.accent, weight: 700 });
}

// ---- 4. idea 2: filing the day away
function sFiling() {
  sketchPage({ grid: 'ruled' });
  const Cab = sketchBox(560, 420, 320, 520, 10, 0.02); gfill(Cab, SK.wood, { key: 'cabf' }); gline(Cab, { key: 'cab', w: 5 });
  for (let d = 0; d < 3; d++) { const y = 450 + d * 165, Dr = sketchBox(580, y, 280, 140, 8, 0.02); gfill(Dr, '#e6c38c', { key: 'drf' + d }); gline(Dr, { key: 'dr' + d, w: 4 }); gline([[680, y + 50], [760, y + 50]], { key: 'drh' + d, w: 6, second: false }); handLetter(['faces', 'skills', 'facts'][d], 720, y + 110, 28, { key: 'drl' + d, col: SK.graph }); }
  const items = ['lunch', 'a song', 'new word', 'a friend', 'maths'];
  items.forEach((lab, i) => { const t0 = at(3.4) + i * 0.6, u = clamp((TT - t0) / 1.1); if (u <= 0) { D2.card(160 + (i % 2) * 140, 320 + i * 110, 1, 'dc' + i, lab); return; } if (u >= 1) return; const x = lerp(160 + (i % 2) * 140, 720, EZ.io(u)), y = lerp(320 + i * 110, 500 + (i % 3) * 165, EZ.io(u)) - Math.sin(u * Math.PI) * 120; D2.card(x, y, 1 - u * 0.4, 'dc' + i, lab); });
  sleeper(220, 900, 40, { key: 'dreamer', mood: TT > at(9.4) ? 'happy' : 'calm', cap: true });
  if (TT > at(9.4)) checkMark(900, 360, 1.4, ev(at(9.4), 0.5));
}
function cFiling(at) {
  title('Filing', at(0.6));
  write('the brain replays the day', CL, 400, 46, at(4.0));
  write('...and files what matters', CL, 500, 46, at(5.6));
  write('strongest support in the lab', CL, 680, 46, at(9.4), { color: CH.green, weight: 700 });
}

// ---- 5. idea 3: overnight therapy
function sFeelings() {
  sketchPage({ grid: 'dots' }); pageLife('fl');
  const shrink = sm(TT, at(4.0), at(10.0)), cx = 470, cy = 330;
  const Cl = []; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU, b = 1 + 0.15 * Math.abs(Math.sin(a * 3.5)); Cl.push([cx + Math.cos(a) * (230 - 120 * shrink) * b, cy + Math.sin(a) * (120 - 50 * shrink) * b]); }
  gfill(Cl, shrink < 0.5 ? '#9a948b' : SK.sheet, { key: 'stormf', a: 0.8 }); gline(closeP(Cl), { key: 'storm', w: 4.5 });
  if (shrink < 0.8) for (let i = 0; i < 6; i++) { const x = cx - 150 + i * 60 * (1 - shrink * 0.5), y0 = cy + 110 + mod(TT * 260 + i * 40, 160); gline([[x, y0], [x - 8, y0 + 26]], { key: 'rain' + i, w: 3, col: SK.blue, second: false }); }
  if (shrink > 0.6) { const sx = cx + 150, sy = cy - 60; gfill(loopPts(sx, sy, 46, 46, 0), SK.hilite, { key: 'sunf' }); gline(loopPts(sx, sy, 46, 46, 0.08), { key: 'sun', w: 4 }); }
  // the stress dial turning down
  const dx = 760, dy = 760, a = lerp(-0.3, -2.8, shrink); gline(arcPts(dx, dy, 120, Math.PI, TAU, 20), { key: 'dial', w: 5 });
  handLetter('stress', dx, dy + 60, 30, { key: 'dl', col: SK.graph }); gline([[dx, dy], [dx + Math.cos(a) * 100, dy + Math.sin(a) * 100]], { key: 'needle' + Math.round(a * 10), w: 6, col: SK.red, second: false });
  sleeper(260, 800, 52, { key: 'dreamer', mood: shrink > 0.6 ? 'happy' : 'calm' });
  if (TT > at(7.6)) D2.heart(420, 690, 0.9, 'flh');
}
function cFeelings(at) {
  title('Feelings', at(0.6));
  write('emotional moments replayed...', CL, 400, 44, at(4.0));
  write('...with the stress turned down', CL, 490, 44, at(5.4));
  write('overnight therapy?', CL, 650, 54, at(7.6), { color: CH.accent, weight: 700 });
  write('a bad day can feel smaller', CL, 800, 42, at(10.0));
}

// ---- 6. idea 4: a survival drill
function sRehearsal() {
  sketchPage({ grid: 'dots' });
  gpencil([[40, 880], [500, 872], [960, 884]], { key: 'gr', w: 3, a: 0.8 });
  const run = TT * 1.2, hx = 640 + Math.sin(run) * 12;
  D2.monster(260 + Math.sin(TT * 2) * 30, 760, 1, 'mon');
  sleeper(hx, 790, 50, { key: 'dreamer', mood: 'wow', cap: false, legs: true, step: Math.sin(TT * 12), arms: [1.2, 1.0], look: [-0.8, 0] });
  for (let i = 0; i < 3; i++) sweat(hx + 60 + i * 10, 720 - i * 12, (TT * 1.5 + i * 0.3) % 1, 'rsw' + i);
  if (TT > at(3.4)) { const Pp = sketchBox(80, 140, 230, 280, 6, 0.03); gfill(Pp, SK.sheet, { key: 'testf', off: [0, 0] }); gline(Pp, { key: 'test', w: 4 }); for (let l = 0; l < 5; l++) gpencil([[110, 210 + l * 40], [280 - (l % 2) * 40, 210 + l * 40]], { key: 'tl' + l, w: 2.5, a: 0.7, passes: 1 }); inkStamp('TEST', 195, 330, 0.9 * popS(at(3.4)), -0.15); }
  if (TT > at(8.4)) { const S = [[820, 200], [900, 240], [900, 340], [820, 400], [740, 340], [740, 240]]; gfill(S, SK.green, { key: 'shf', a: 0.6 }); gline(closeP(S), { key: 'sh', w: 5, part: ev(at(8.4), 0.6) }); checkMark(800, 300, 1.2, ev(at(9.0), 0.5)); }
}
function cRehearsal(at) {
  title('Practice', at(0.6));
  write('chased, falling, a test...', CL, 400, 46, at(1.4));
  write('rehearsing threats safely', CL, 500, 46, at(4.4));
  write('an ancient survival drill', CL, 660, 52, at(8.4), { color: CH.accent, weight: 700 });
}

// ---- 7. so which? the four pieces of the puzzle
function sWhich() {
  sketchPage({ grid: 'dots' }); pageLife('wh');
  const P4 = [[250, 300, () => gline([[230, 330], [250, 300], [240, 280], [262, 254]], { key: 'wz', w: 5, col: SK.terraD, second: false })], [650, 300, () => D2.card(650, 300, 1.1, 'wc', 'file')], [250, 640, () => D2.heart(250, 640, 1, 'whh')], [650, 640, () => D2.monster(650, 640, 0.6, 'wm')]];
  P4.forEach(([x, y, fn], i) => { const k = ev(at(1.0 + i * 0.6), 0.5); if (k <= 0) return; const B0 = sketchBox(x - 140, y - 120, 280, 240, 20, 0.03); gfill(B0, SK.sheet, { key: 'pz' + i, off: [0, 0] }); gline(B0, { key: 'pzo' + i, w: 4, part: k }); fn(); });
  if (TT > at(3.4)) handLetter('?', 450, 500, 140, { face: 'marker', col: SK.graph, key: 'wq', jit: 1.5 });
  if (TT > at(6.0)) { const k = ev(at(6.0), 0.6); gline(loopPts(450, 470, 400 * k + 20, 330 * k + 20, 0.06), { key: 'wall', w: 5, col: SK.red }); }
}
function cWhich(at) {
  title('So which is right?', at(0.6));
  write('nobody knows for certain', CL, 400, 50, at(1.6), { weight: 700 });
  write('maybe several at once', CL, 540, 46, at(3.4));
  write('new studies keep adding pieces', CL, 680, 42, at(6.4));
}

// ---- 8. the hush
function sHush() { sketchPage({ grid: 'dots' }); handLetter('z', 495, 540, 80, { key: 'hz', col: SK.graph }); }

// ---- 9. the clue: babies and their REM
function sBabies() {
  sketchPage({ grid: 'dots' });
  const Cr = sketchBox(130, 640, 380, 200, 20, 0.02); gfill(Cr, SK.wood, { key: 'crf' }); gline(Cr, { key: 'cr', w: 5 });
  for (let i = 0; i < 8; i++) gline([[150 + i * 48, 560], [150 + i * 48, 640]], { key: 'bar' + i, w: 4, second: false }); gline([[130, 560], [510, 560]], { key: 'rail', w: 5 });
  sleeper(320, 600, 40, { key: 'baby', mood: 'happy', cap: false }); zzz(380, 520, 'bz');
  // two pies: a baby's sleep (about half REM) and an adult's (about a fifth)
  const pie = (cx, cy, r, frac, key, lab) => { const k = ev(at(3.0), 0.8); if (k <= 0) return; const P = [[cx, cy], ...Array.from({ length: 25 }, (_, i) => { const a = -Math.PI / 2 + i / 24 * TAU * frac * k; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; })]; scribbleFill(P, SK.hilite, { key: key + 's', gap: 9, base: 0.45 }); gline(loopPts(cx, cy, r, r, 0.04), { key: key + 'o', w: 4.5 }); gline([[cx, cy], [cx, cy - r]], { key: key + 'l', w: 3, second: false }); handLetter(lab, cx, cy + r + 50, 30, { key: key + 't', col: SK.graph }); };
  pie(700, 260, 120, 0.5, 'pb', 'newborn: ~1/2 REM');
  pie(700, 640, 90, 0.22, 'pa', 'adult: ~1/5 REM');
  if (TT > at(9.0)) { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + 0.3, f = ev(at(9.0) + i * 0.08, 0.4); gline([[320, 420], [320 + Math.cos(a) * 120 * f, 420 + Math.sin(a) * 70 * f]], { key: 'syn' + i, w: 2.5, col: SK.terraD, second: false }); } sparkle(320, 420, 30, ev(at(9.0), 0.6), 'bspk'); }
}
function cBabies(at) {
  title('The clue', at(0.4));
  bigNum('~50%', "of a newborn's sleep is REM", CCX, 440, at(3.4), CH.accent, 130);
  write('far more than adults', CL, 640, 46, at(5.6));
  write('maybe dreaming sleep', CL, 790, 48, at(9.0));
  write('helps build the brain', CL, 870, 52, at(9.6), { color: CH.accent, weight: 700 });
}

// ---- 10. the end: back to bed, the cloud holds all four ideas
function sEnd() {
  sHook({ done: true });
  const k = ev(at(4.4), 0.6); if (k > 0) { handLetter('sort', 610, 250, 30, { key: 'e1', col: SK.graph }); handLetter('soothe', 790, 250, 30, { key: 'e2', col: SK.graph }); handLetter('rehearse', 640, 380, 30, { key: 'e3', col: SK.graph }); handLetter('build?', 800, 380, 30, { key: 'e4', col: SK.terraD }); }
}
function cEnd(at) {
  title('So...', at(0.6));
  write('your brain gets busy tonight', CL, 400, 46, at(1.6));
  write('sorting, soothing, rehearsing...', CL, 500, 42, at(4.4));
  write('sweet dreams', CL, 700, 60, at(8.6), { color: CH.accent, weight: 700 });
}
