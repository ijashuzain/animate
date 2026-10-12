// =====================================================================
//  SCENES — How do bees make honey? Everything is drawn on one sketchbook page: the scene on the left, the
//  explanation hand-lettered straight onto the page on the right (no card). Pencil first, then ink, then colour.
//  Colour means one thing: yellow = Bea and her sisters, amber = nectar turning into honey, pink = flowers.
// =====================================================================
const AMB = '#e9a23b', AMBD = '#c47f1e', BEEY = SK.yellow;
const CHANNEL = { halo: 'rgba(242,234,216,0.85)', colors: { ink: SK.ink, accent: SK.terraD, green: SK.green, blue: SK.blue },
  tag: (str, k) => { const size = 58, w = letterW(str, size, 'marker'), x = CL, y = 122; tapeStrip(x + w / 2, y - size * 0.3, w + 60, -0.03, 'ttape' + str, size * 1.1); handLetter(str, x, y, size, { face: 'marker', align: 'left', reveal: clamp(k), key: 'tg' + str, jit: 0.7 }); } };

// ---- Bea (and her sisters): a round striped bee with graphite wings that flap on 2s
function bee(x, y, r, o = {}) {
  const key = o.key ?? 'bea', fl = (B + key.length) % 2 === 0, flap = o.flap !== false;
  y += Math.sin(TT * 3 + key.length) * r * 0.08;
  ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1); ctx.rotate(o.rot ?? 0);
  for (const [wx, wy, k] of [[-r * 0.3, -r * 0.8, 'w1'], [r * 0.15, -r * 0.88, 'w2']]) {
    const ry = flap && fl ? r * 0.42 : r * 0.62, P = loopPts(wx, wy - (flap && fl ? r * 0.12 : 0), r * 0.36, ry, 0, 0, 22);
    gfill(P, SK.sheet, { a: 0.85, off: [0, 0], key: key + k + 'f' }); gpencil(closeP(P), { key: key + k, w: Math.max(2, r * 0.04), a: 0.8 });
  }
  const body = loopPts(0, 0, r * 1.15, r * 0.88, 0, 0, 36);
  gfill(body, BEEY, { off: [r * 0.05, r * 0.04], key: key + 'bf' });
  ctx.save(); gclip(body); for (const sx of [-0.62, -0.18]) gline([[r * sx, -r], [r * (sx - 0.08), r]], { w: r * 0.2, col: SK.ink, key: key + 'st' + sx, second: false, amp: 0.6 }); ctx.restore();
  gline([[-r * 1.1, -r * 0.05], [-r * 1.42, r * 0.04], [-r * 1.1, r * 0.13]], { w: Math.max(2.5, r * 0.05), key: key + 'sting', second: false });
  gline(loopPts(0, 0, r * 1.15, r * 0.88, 0.07), { w: Math.max(3, r * 0.06), key: key + 'o' });
  for (const s of [0, 1]) { const bx = r * (0.55 + s * 0.12); gline([[bx, -r * 0.7], [bx + r * 0.2, -r * 1.2]], { w: Math.max(2.5, r * 0.045), key: key + 'an' + s, second: false, amp: 0.5 }); chDot(bx + r * 0.2, -r * 1.22, r * 0.07, SK.ink); }
  for (let i = 0; i < 3; i++) gline([[r * (-0.4 + i * 0.35), r * 0.82], [r * (-0.48 + i * 0.35), r * 1.08]], { w: Math.max(2, r * 0.04), key: key + 'lg' + i, second: false, amp: 0.4 });
  const mood = o.mood ?? 'calm', blink = mood !== 'wow' && (B + key.length * 5) % 41 === 0;
  for (const ex of [r * 0.5, r * 0.82]) {
    if (blink) gline([[ex - r * 0.07, -r * 0.12], [ex + r * 0.07, -r * 0.12]], { w: r * 0.05, key: key + 'bl' + ex, second: false });
    else if (mood === 'happy') gline([[ex - r * 0.07, -r * 0.08], [ex, -r * 0.18], [ex + r * 0.07, -r * 0.08]], { w: r * 0.05, key: key + 'hp' + ex, second: false });
    else { ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.ellipse(ex, -r * 0.12, r * 0.07, r * (mood === 'wow' ? 0.13 : 0.1), 0, 0, TAU); ctx.fill(); ctx.fillStyle = SK.cream; ctx.beginPath(); ctx.arc(ex - r * 0.02, -r * 0.16, r * 0.025, 0, TAU); ctx.fill(); }
  }
  if (mood === 'wow') { ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.ellipse(r * 0.68, r * 0.22, r * 0.07, r * 0.09, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'puzzled') gline([[r * 0.55, r * 0.24], [r * 0.66, r * 0.2], [r * 0.78, r * 0.26]], { w: r * 0.045, key: key + 'pm', second: false });
  else gline(arcPts(r * 0.68, r * 0.08, r * 0.14, Math.PI * 0.2, Math.PI * 0.8, 8), { w: r * 0.05, key: key + 'm', second: false, amp: 0.3 });
  ctx.restore();
  SPARK_AT = toScreen(x, y);
}
// a flower: a pencil stem and leaf, inked petals with a pink colour pass, an amber centre
function flower(x, y, s, key, o = {}) {
  const part = o.part ?? 1;
  gpencil([[x, y], [x + 6 * s, y + 120 * s], [x - 4 * s, y + 260 * s]], { key: key + 'stem', w: 3.2, a: 0.85, part });
  gpencil(closeP(loopPts(x + 34 * s, y + 150 * s, 32 * s, 13 * s, 0, -0.4, 16)), { key: key + 'leaf', w: 2.6, a: 0.75, part });
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU + 0.2, P = loopPts(x + Math.cos(a) * 46 * s, y + Math.sin(a) * 46 * s, 30 * s, 22 * s, 0.05, 0, 18).map(([px, py]) => { const dx = px - (x + Math.cos(a) * 46 * s), dy = py - (y + Math.sin(a) * 46 * s); return [x + Math.cos(a) * 46 * s + dx * Math.cos(a) - dy * Math.sin(a), y + Math.sin(a) * 46 * s + dx * Math.sin(a) + dy * Math.cos(a)]; });
    if (part > 0.6) gfill(P, o.col ?? SK.pink, { a: 0.9, key: key + 'pf' + i });
    gline(P, { key: key + 'p' + i, w: 3.4 * Math.max(0.6, s), part: clamp((part - 0.2) * 2) });
  }
  const C = loopPts(x, y, 30 * s, 30 * s, 0.05, 0, 20);
  if (part > 0.8) { gfill(C, AMB, { key: key + 'cf' }); }
  gline(C, { key: key + 'c', w: 3.4 * Math.max(0.6, s), part: clamp((part - 0.5) * 2) });
}
// a honeycomb cell (flat-top hexagon) and a comb of them: state 'empty' | 'nectar' | 'honey' | 'capped'
const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => [cx + Math.cos(i / 6 * TAU) * r, cy + Math.sin(i / 6 * TAU) * r]);
const combXY = (x0, y0, r, i, j) => [x0 + i * r * 1.5, y0 + j * r * Math.sqrt(3) + (i % 2) * r * Math.sqrt(3) / 2];
function cell(cx, cy, r, state, key, k = 1) {
  const P = hexPts(cx, cy, r * 0.94);
  if (state === 'nectar') scribbleFill(P, SK.glass, { key: key + 'n', gap: 10, w: 3, a: 0.6, base: 0.25, part: k });
  else if (state === 'honey') scribbleFill(P, AMB, { key: key + 'h', gap: 9, w: 3.4, a: 0.9, base: 0.45, part: k });
  else if (state === 'capped') { gfill(P, '#f3e2b0', { key: key + 'c', off: [2, 2] }); litHatch(P, { key: key + 'ch', gap: 9, col: SK.graphL, w: 1.6, a: 0.5 }); }
  gline(closeP(P), { key: key + 'o', w: 3, col: state === 'empty' ? SK.graph : SK.ink, second: false, amp: 0.6 });
}
function drop(x, y, s, col, key) {
  const P = [[0, -1], [0.45, -0.15], [0.55, 0.3], [0.32, 0.72], [0, 0.82], [-0.32, 0.72], [-0.55, 0.3], [-0.45, -0.15]].map(([a, b]) => [x + a * 40 * s, y + b * 40 * s]);
  gfill(P, col, { key: key + 'f', off: [1, 1] }); gline(closeP(P), { key: key + 'o', w: 3, second: false, amp: 0.4 });
}
// a honey jar (bottom centre x, y): glass outline, amber honey (fill 0..1 writes the scribble on), a wooden lid, a label
function jar(x, y, s, o = {}) {
  const w = 220 * s, h = 270 * s, P = sketchBox(x - w / 2, y - h, w, h, 40 * s, 0.03), part = o.part ?? 1;
  const Hp = sketchBox(x - w / 2 + 12 * s, y - h * 0.82, w - 24 * s, h * 0.82 - 12 * s, 30 * s, 0);
  if ((o.honey ?? 1) > 0) scribbleFill(Hp, AMB, { key: 'jarh' + (o.key ?? ''), gap: 12, w: 4.5, a: 0.92, base: 0.45, part: o.honey ?? 1 });
  gpencil(P, { key: 'jarp' + (o.key ?? ''), w: 2.6, a: 0.7, part: clamp(part * 2) });
  gline(P, { key: 'jar' + (o.key ?? ''), w: 5, part: clamp(part * 2 - 1) });
  const L = sketchBox(x - w / 2 - 10 * s, y - h - 46 * s, w + 20 * s, 50 * s, 10 * s, 0.03);
  if (part > 0.7) { gfill(L, SK.wood, { key: 'jarlf' + (o.key ?? '') }); gline(L, { key: 'jarl' + (o.key ?? ''), w: 4 }); }
  if (part > 0.9) { const C = sketchBox(x - 70 * s, y - h * 0.55, 140 * s, 70 * s, 6 * s, 0.03); gfill(C, SK.sheet, { key: 'jarc' + (o.key ?? ''), off: [0, 0] }); gline(C, { key: 'jarco' + (o.key ?? ''), w: 3 }); handLetter('HONEY', x, y - h * 0.55 + 48 * s, 34 * s, { face: 'marker', key: 'jart' + (o.key ?? ''), jit: 0.5 }); }
}
const pageLife = (key) => { [[60, 980, 0], [940, 120, 1]].forEach(([x, y, i]) => doodleStar(x, y, 18 + 5 * ((B + i) % 3 === 0), key + 'ms' + i, { w: 2.6 })); for (let i = 0; i < 2; i++) doodleBird(mod(900 - 70 * TT + i * 60, 1100) - 60, 170 + i * 26, 1.0 - i * 0.2, (B + i) % 2, key + 'bd' + i); };
const beeFly = (t, P) => { const n = P.length - 1, u = clamp(t) * n, i = Math.min(n - 1, Math.floor(u)), f = EZ.io(u - i); return [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]; };

// ---- 1. the hook: a jar, drawn on; flowers; Bea arrives
function sHook(o = {}) {
  sketchPage({ grid: 'dots' }); pageLife('hk');
  gpencil([[60, 940], [500, 932], [960, 942]], { key: 'hkground', w: 3, a: 0.7 });
  const part = o.done ? 1 : ev(at(0.4), 1.6), honey = o.done ? 1 : ev(at(2.0), 1.4);
  jar(330, 930, 1.25, { part, honey });
  if (!o.done && TT > at(0.4) && TT < at(3.6)) { const P = sketchBox(330 - 137, 930 - 337, 275, 337, 50, 0.03), tip = TT < at(2.0) ? writeEnd(closeP(P), part) : [330 + 90 * Math.sin(B * 2.1), 700 + 160 * ev(at(2.0), 1.4)]; pencilTool(tip[0], tip[1], -0.75, 1); }
  flower(720, 700, 0.9, 'f1', { part: o.done ? 1 : ev(at(4.4), 1.2) }); flower(860, 760, 0.7, 'f2', { part: o.done ? 1 : ev(at(5.0), 1.2), col: SK.sheet });
  if (o.done || TT > at(8.4)) { const [bx, by] = o.done ? [600, 420] : beeFly(clamp((TT - at(8.4)) / 1.8), [[1050, 200], [820, 330], [620, 430]]); bee(bx, by, 62, { mood: o.mood ?? (TT > at(10.2) ? 'wow' : 'calm'), flip: false }); }
  if (!o.done && TT > at(10.6)) handLetter('?', 700, 360, 96, { col: SK.graph, key: 'hkq', jit: 1.5 });
}
function cHook(at) {
  title('Who makes honey?', at(0.8));
  write('hundreds of bees', CL, 380, 52, at(3.8));
  write('millions of flowers', CL, 470, 52, at(4.9));
  write('tens of thousands of km of flying', CL, 560, 42, at(6.2));
  write("flowers don't make it...", CL, 720, 50, at(8.8));
  write('bees do. but how?', CL, 830, 58, at(10.2), { color: CH.accent, weight: 700 });
}

// ---- 2. nectar: Bea lands, sips with her long tongue, her honey stomach fills
function sNectar() {
  sketchPage({ grid: 'dots' }); pageLife('nc');
  flower(160, 800, 0.7, 'nf2', { col: SK.sheet });
  flower(420, 640, 1.7, 'nf1');
  const land = clamp((TT - at(0.8)) / 2.2), [bx, by] = beeFly(land, [[1050, 260], [800, 300], [640, 470]]);
  bee(bx, by, 78, { key: 'beaN', flip: true, mood: TT > at(4.0) ? 'happy' : 'calm' });
  if (TT > at(3.4)) {   // the tongue, and nectar drops climbing it
    const f = ev(at(3.4), 0.6), tip = [lerp(bx - 70, 440, f), lerp(by + 30, 640, f)];
    gline([[bx - 70, by + 30], tip], { w: 5, key: 'tongue', second: false, col: SK.lead });
    if (TT > at(4.0) && TT < at(10.6)) for (let i = 0; i < 3; i++) { const u = mod((TT - at(4.0)) * 0.9 + i / 3, 1); chDot(lerp(440, bx - 70, u), lerp(640, by + 30, u), 7, AMB); }
  }
  // the honey stomach, shown in a pencil circle with an arrow to Bea
  if (TT > at(6.2)) {
    const k = ev(at(6.2), 0.4), cx = 820, cy = 700, R = 110;
    gpencil(closeP(loopPts(cx, cy, R, R, 0.06)), { key: 'hsc', w: 3, a: 0.8, part: k });
    const lvl = sm(TT, at(6.8), at(11.4)), C = loopPts(cx, cy, R * 0.62, R * 0.7, 0, 0, 30);
    gline(closeP(C), { key: 'hso', w: 4, part: k });
    if (lvl > 0) { ctx.save(); ctx.beginPath(); ctx.rect(cx - R, cy + R * 0.7 - lvl * R * 1.3, 2 * R, 2 * R); ctx.clip(); scribbleFill(C, AMB, { key: 'hsf', gap: 9, base: 0.5 }); ctx.restore(); }
    arrowPencil([[cx - 90, cy - 90], [bx + 10, by + 70]], ev(at(6.6), 0.4));
    handLetter('honey stomach', cx, cy + R + 60, 40, { reveal: ev(at(8.8), 0.5), key: 'hsl' });
  }
}
function cNectar(at) {
  title('Sip, sip, sip', at(0.8));
  write('a forager bee', CL, 380, 52, at(1.6));
  write('sips sugary nectar', CL, 480, 52, at(3.8));
  write('into a second stomach:', CL, 600, 48, at(6.4));
  write('the "honey stomach"', CL, 700, 56, at(8.8), { color: CH.accent, weight: 700 });
}

// ---- 3. enzymes: mouth to mouth along the house bees
function sEnzymes() {
  sketchPage({ grid: 'dots' });
  for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) { const [x, y] = combXY(720, 640, 58, i, j); if (y < 1060) cell(x, y, 58, 'empty', 'ec' + i + j); }
  const B3 = [[170, 620, 72, 'beaE'], [400, 660, 56, 'hb1'], [610, 620, 56, 'hb2']];
  B3.forEach(([x, y, r, k], i) => bee(x, y, r, { key: k, mood: TT > at(2.6 + i * 1.4) ? 'happy' : 'calm', flap: i === 0 }));
  const legs = [[at(2.0), at(3.0), 0, 1], [at(3.6), at(4.6), 1, 2], [at(5.2), at(6.2), 2, 3]];
  const ends = [[240, 640], [455, 670], [665, 630], [760, 760]];
  let dp = ends[0], dc = SK.glass;
  for (const [t0, t1, a, b] of legs) { if (TT >= t0) { const u = EZ.io(clamp((TT - t0) / (t1 - t0))); dp = [lerp(ends[a][0], ends[b][0], u), lerp(ends[a][1], ends[b][1], u) - Math.sin(u * Math.PI) * 60]; dc = mixHex(SK.glass, AMB, clamp((b - 1 + u) / 2.5)); } }
  drop(dp[0], dp[1], 0.6, dc, 'ed');
  for (let i = 0; i < 3; i++) if (TT > at(2.6 + i * 1.4) && TT < at(3.6 + i * 1.4)) sparkle(ends[i + 1][0], ends[i + 1][1] - 50, 22, ev(at(2.6 + i * 1.4), 0.5), 'esp' + i);
  // the sugar: one big sugar splits into two simpler ones
  const sx = 420, sy = 260, split = sm(TT, at(8.0), at(8.8)) * 70;
  gline(closeP(hexPts(sx - 50 - split, sy, 44)), { key: 'gl', w: 4, part: ev(at(7.0), 0.5) });
  gline(closeP(Array.from({ length: 5 }, (_, i) => [sx + 46 + split + Math.cos(i / 5 * TAU - Math.PI / 2) * 42, sy + Math.sin(i / 5 * TAU - Math.PI / 2) * 42])), { key: 'fr', w: 4, part: ev(at(7.2), 0.5) });
  if (split < 10 && TT > at(7.2)) gline([[sx - 6, sy], [sx + 4, sy]], { w: 4, key: 'bond', second: false });
  if (TT > at(8.4)) { handLetter('glucose', sx - 60 - split, sy + 90, 32, { reveal: ev(at(8.6), 0.4), key: 'glt', col: SK.graph }); handLetter('fructose', sx + 56 + split, sy + 90, 32, { reveal: ev(at(8.8), 0.4), key: 'frt', col: SK.graph }); }
}
function cEnzymes(at) {
  title('Pass it on', at(0.8));
  write('mouth to mouth', CL, 380, 54, at(2.6));
  write('each bee adds enzymes', CL, 480, 50, at(6.0));
  write('sucrose → glucose + fructose', CL, 600, 40, at(8.0));
  write('step one to honey', CL, 760, 56, at(10.6), { color: CH.accent, weight: 700 });
}

// ---- 4. cells: nectar into wax cells; but it's mostly water
function sCells() {
  sketchPage({ grid: 'dots' });
  const ORD = []; for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) ORD.push([i, j]);
  ORD.forEach(([i, j], n) => { const [x, y] = combXY(110, 220, 60, i, j); if (y > 1040) return; const t = at(0.8) + n * 0.08; cell(x, y, 60, TT > t ? 'nectar' : 'empty', 'cc' + i + j, ev(t, 0.3)); });
  // a measuring glass: 80% water, and the line where honey must be
  const gx = 800, gy = 280, gw = 130, gh = 560, G = sketchBox(gx, gy, gw, gh, 20, 0.02);
  const lvl = sm(TT, at(4.4), at(5.6)) * 0.8;
  if (lvl > 0) { ctx.save(); ctx.beginPath(); ctx.rect(gx - 10, gy + gh * (1 - lvl), gw + 20, gh * lvl + 10); ctx.clip(); scribbleFill(G, SK.glass, { key: 'gw', gap: 12, base: 0.4, a: 0.7 }); ctx.restore(); }
  gline(G, { key: 'glass', w: 4.5 });
  for (let k = 1; k < 10; k++) gpencil([[gx, gy + gh * k / 10], [gx + 26, gy + gh * k / 10]], { key: 'gt' + k, w: 2.4, a: 0.7, passes: 1 });
  if (TT > at(5.0)) handLetter('80% water', gx + gw / 2, gy - 30, 38, { reveal: ev(at(5.0), 0.4), key: 'g80' });
  if (TT > at(7.4)) { const y = gy + gh * 0.8; ctx.save(); ctx.setLineDash([12, 10]); gline([[gx - 30, y], [gx + gw + 30, y]], { w: 4, col: SK.terraD, key: 'g20', second: false }); ctx.restore(); handLetter('honey: under 20%', gx + gw / 2, y + 60, 32, { reveal: ev(at(7.6), 0.4), key: 'g20t', col: SK.terraD }); }
  const puzz = TT > at(9.0);
  bee(560, 200, 56, { key: 'beaC', mood: puzz ? 'puzzled' : 'calm' });
  if (puzz) sweat(610, 150, (TT * 1.2) % 1, 'cs');
}
function cCells(at) {
  title('Too watery', at(0.8));
  bigNum('70-80%', 'water in nectar', CCX, 440, at(4.8), CH.ink, 110);
  bigNum('< 20%', 'water in honey', CCX, 680, at(7.6), CH.accent, 110);
  write('the water has to go!', CL, 900, 52, at(9.4), { weight: 700 });
}

// ---- 5. fanning: wings beat, warm air, the water leaves
function sFan() {
  sketchPage({ grid: 'dots' });
  const toHoney = sm(TT, at(9.0), at(10.4));
  for (let j = 0; j < 3; j++) for (let i = 0; i < 7; i++) { const [x, y] = combXY(90, 720, 58, i, j); if (y > 1060) continue; cell(x, y, 58, toHoney > 0.5 ? 'honey' : 'nectar', 'fc' + i + j); }
  for (let i = 0; i < 5; i++) bee(130 + i * 175, 560 + (i % 2) * 30, 50, { key: 'fan' + i, mood: TT > at(9.6) ? 'happy' : 'calm' });
  for (let n = 0; n < 5; n++) { const u = mod(TT * 0.5 + n / 5, 1), x = lerp(40, 980, u), y = 360 + Math.sin(n * 2 + TT) * 40; gpencil(arcPts(x, y, 30, 0, Math.PI * 1.6, 10), { key: 'wind' + n, w: 2.6, a: 0.7 * (1 - Math.abs(u - 0.5) * 2) }); }
  if (toHoney < 1) for (let n = 0; n < 6; n++) { const u = mod(TT * 0.4 + n / 6, 1), x = 120 + n * 150 + Math.sin(u * 6 + n) * 16; gpencil([[x, 690 - u * 200], [x + 10, 670 - u * 200], [x - 6, 650 - u * 200]], { key: 'vap' + n, w: 2.4, a: 0.6 * (1 - u) * (1 - toHoney) }); }
  const pct = Math.round(lerp(80, 18, sm(TT, at(1.4), at(10.0))));
  handLetter(pct + '% water', 500, 230, 92, { face: 'marker', key: 'pct' + pct, col: pct <= 18 ? SK.terraD : SK.ink });
}
function cFan(at) {
  title('Fan it dry', at(0.8));
  write('thousands of beating wings', CL, 380, 48, at(1.8));
  write('warm air through the hive', CL, 480, 48, at(5.6));
  bigNum('~18%', 'water: now it is honey', CCX, 700, at(9.6), CH.accent, 120);
}

// ---- 6. capping: a wax lid on every cell
function sCap() {
  sketchPage({ grid: 'dots' });
  const C = []; for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) { const [x, y] = combXY(110, 260, 64, i, j); if (y < 1040) C.push([x, y, i, j]); }
  let cur = C[0];
  C.forEach(([x, y, i, j], n) => { const t = at(2.8) + n * 0.24, capped = TT > t; cell(x, y, 64, capped ? 'capped' : 'honey', 'kc' + i + j); if (TT > t - 0.24 && TT <= t) cur = [x, y]; if (TT > at(2.8) + C.length * 0.24) cur = C[C.length - 1]; });
  const bx = TT < at(2.8) ? 860 : cur[0] + 40, by = TT < at(2.8) ? 240 : cur[1] - 70;
  bee(bx, by, 50, { key: 'beaK', mood: TT > at(9.6) ? 'happy' : 'calm' });
  for (let n = 0; n < 3; n++) { const u = mod(TT * 1.2 + n / 3, 1); if (TT > at(2.8) && TT < at(10)) gfill(sketchBox(bx - 10 + n * 8, by + 50 + u * 60, 10, 6, 1, 0), '#f3e2b0', { key: 'wx' + n, off: [0, 0] }); }
  if (TT > at(9.6)) [[820, 200], [880, 300], [760, 330]].forEach(([x, y], i) => sparkle(x, y, 24, ev(at(9.6) + i * 0.2, 0.5), 'ksp' + i));
}
function cCap(at) {
  title('Seal it', at(0.8));
  write('a tiny lid of fresh beeswax', CL, 390, 48, at(3.4));
  write("made by the bees' own bodies", CL, 490, 46, at(5.8));
  write('sealed and dry, it keeps', CL, 680, 50, at(8.2));
  write('for years', CL, 780, 60, at(9.6), { color: CH.accent, weight: 700 });
}

// ---- 7. why: food for winter, and the extra we eat
function sWinter() {
  sketchPage({ grid: 'dots' });
  const w = sm(TT, at(2.6), at(4.0));
  gline([[240, 940], [250, 700], [236, 560]], { w: 10, key: 'trunk' }); gline([[244, 700], [170, 600]], { w: 6, key: 'br1' }); gline([[246, 650], [320, 560]], { w: 6, key: 'br2' });
  const crown = loopPts(240, 470, 170, 130, 0.06);
  if (w < 1) scribbleFill(crown, SK.green, { key: 'crown', gap: 12, a: 0.8 * (1 - w), base: 0.3 * (1 - w) });
  if (w < 0.5) gpencil(crown, { key: 'crownp', w: 2.6, a: 0.7 });
  if (TT > at(2.6)) for (let i = 0; i < 18; i++) { const R = RNG('snow', i), x = R.r(40, 960), y = mod(R.r(0, 1000) + (TT - at(2.6)) * R.r(40, 90), 1020) + 40; gline([[x - 8, y], [x + 8, y]], { w: 2.4, key: 'sn' + i + 'a', second: false, col: SK.graph }); gline([[x, y - 8], [x, y + 8]], { w: 2.4, key: 'sn' + i + 'b', second: false, col: SK.graph }); }
  // the hive: a box, cut open to show a cluster of bees around the honey
  const H = sketchBox(470, 520, 400, 420, 12, 0.02);
  gfill(H, SK.wood, { key: 'hivef' }); gline(H, { key: 'hive', w: 5 });
  for (let k = 1; k < 4; k++) gpencil([[470, 520 + k * 105], [870, 520 + k * 105]], { key: 'hl' + k, w: 2.6, a: 0.7 });
  const Wn = sketchBox(520, 600, 300, 240, 10, 0.02); gfill(Wn, SK.sheet, { key: 'hwin' }); gline(Wn, { key: 'hwino', w: 4 });
  for (let i = 0; i < 4; i++) cell(580 + i * 60, 720 + (i % 2) * 30, 34, 'honey', 'wc' + i);
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + TT * 0.6; bee(670 + Math.cos(a) * 95, 720 + Math.sin(a) * 60, 18, { key: 'cl' + i, flap: false }); }
  if (TT > at(10.6)) jar(940, 960, 0.5, { key: 'x' });
  if (TT > at(11.2)) handLetter('extra!', 935, 760, 40, { face: 'marker', reveal: ev(at(11.2), 0.4), key: 'xt', col: SK.terraD });
}
function cWinter(at) {
  title('Why bother?', at(0.8));
  write('food for winter', CL, 390, 56, at(3.4));
  write('(no flowers then)', CL, 480, 44, at(5.4), { color: '#6f6a63' });
  write('a strong hive makes extra', CL, 640, 48, at(8.2));
  write('the extra is what we eat', CL, 760, 52, at(11.2), { color: CH.accent, weight: 700 });
}

// ---- 8. the hush: one tiny drop on the page
function sHush() { sketchPage({ grid: 'dots' }); drop(495, 520, 0.5, AMB, 'hd'); pencilTool(560, 560, -0.75, 1); }

// ---- 9. the payoff: a teaspoon in twelve slices; one slice is a whole life
function sSpoon() {
  sketchPage({ grid: 'dots' });
  const cx = 430, cy = 520, rx = 250, ry = 170, bowl = loopPts(cx, cy, rx, ry, 0.05);
  gline(closeP([[cx + rx - 20, cy + 40], [900, 860], [940, 830], [cx + rx, cy - 10]]), { key: 'handle', w: 6 });
  gfill(bowl, SK.sheet, { key: 'bowlf', off: [0, 0] });
  if (TT > at(7.8)) { const k = ev(at(7.8), 0.4), S = [[cx, cy], ...Array.from({ length: 6 }, (_, i) => [cx + Math.cos(-Math.PI / 2 + i / 5 * TAU / 12) * rx * 0.98, cy + Math.sin(-Math.PI / 2 + i / 5 * TAU / 12) * ry * 0.98])]; scribbleFill(S, AMB, { key: 'slice', gap: 8, base: 0.6, part: k }); }
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i / 12 * TAU; gpencil([[cx, cy], [cx + Math.cos(a) * rx * 0.98, cy + Math.sin(a) * ry * 0.98]], { key: 'sl' + i, w: 2.4, a: 0.75, part: ev(at(6.0) + i * 0.05, 0.3), passes: 1 }); }
  gline(bowl, { key: 'bowl', w: 6 });
  // a life line: weeks 1 to 6, Bea walking along it
  const y = 930, x0 = 120, x1 = 860, wk = ev(at(3.4), 1.6);
  gline([[x0, y], [lerp(x0, x1, wk), y]], { key: 'life', w: 4, second: false });
  for (let k = 0; k <= 6; k++) if (wk >= k / 6) { const x = lerp(x0, x1, k / 6); gline([[x, y - 12], [x, y + 12]], { key: 'lt' + k, w: 3, second: false }); if (k) handLetter('wk ' + k, x, y + 52, 26, { key: 'lw' + k, col: SK.graph }); }
  const bx = lerp(x0, x1, Math.min(wk, 1));
  bee(bx, y - 70, 40, { key: 'beaS', mood: TT > at(11.4) ? 'happy' : TT > at(7.8) ? 'wow' : 'calm' });
  if (TT < at(3.0)) inkStamp('!', 760, 300, 1.2 * popS(at(0.05)), -0.1);
}
function cSpoon(at) {
  title('One whole life', at(0.3));
  bigNum('5-6 weeks', "a summer worker's life", CCX, 390, at(3.4), CH.ink, 100);
  bigNum('1/12', 'of a teaspoon of honey', CCX, 650, at(7.8), CH.accent, 150);
  write('one tiny drop. one whole life.', CL, 890, 46, at(11.4), { weight: 700 });
}

// ---- 10. the end: the jar again, with hundreds of bees behind it
function sEnd() {
  sHook({ done: true, mood: 'happy' });
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + TT * 0.5; bee(330 + Math.cos(a) * 230, 560 + Math.sin(a) * 120, 16, { key: 'swarm' + i }); }
  const T = sketchBox(560, 900, 220, 120, 26, 0.03); gfill(T, SK.wood, { key: 'toastf' }); scribbleFill(sketchBox(580, 915, 180, 80, 20, 0), AMB, { key: 'toasth', gap: 10, part: ev(at(5.6), 1.0) }); gline(T, { key: 'toast', w: 4.5 });
  if (TT > at(8.4)) { const h = (u) => [600 + 16 * Math.sin(u) ** 3, 330 - (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u))]; const P = Array.from({ length: 30 }, (_, i) => { const p = h(i / 30 * TAU); return [600 + (p[0] - 600) * 3, 330 + (p[1] - 330) * 3]; }); gline(closeP(P), { key: 'heart', w: 5, col: SK.red, part: ev(at(8.4), 0.6) }); }
}
function cEnd(at) {
  title('So...', at(0.8));
  write("every jar = hundreds of bees' lives", CL, 400, 42, at(1.6));
  write('stirred together', CL, 480, 46, at(4.0));
  write('next time, on your toast...', CL, 640, 48, at(5.6));
  write('say thank you to the bees', CL, 760, 54, at(8.4), { color: CH.accent, weight: 700 });
}
