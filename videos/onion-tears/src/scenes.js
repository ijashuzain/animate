// =====================================================================
//  SCENES — Why do onions make you cry? FLAT style (styles/flat), a warm kitchen. Depth: the garden seen through the
//  window drifts slower than the room; shelves sit between. Peekaboo moves: an onion with a face, a zoom into its cells,
//  chemicals with faces, an assembly line for the two enzymes, labels that point, a pop for each new thing.
//  Colour means one thing: gold/brown = the onion, yellow blobs = sulfur chemicals, pink = enzymes, green wisps = the gas,
//  blue = tears. Fonts: Lilita One (headings, chunky like a food label), Chewy (kitchen labels), Nunito (reading lines).
// =====================================================================
const CHANNEL = { font: '"Nunito", sans-serif', weight: 700, titleFont: '"Lilita One", sans-serif', titleWeight: 400, labelFont: '"Chewy", sans-serif',
  halo: 'rgba(255,248,236,0.8)', colors: { ink: '#3a2a20', accent: '#d9541e', green: '#3c9a52', blue: '#2a7fc0' },
  tag: (str, k) => { const w = fTextW(str, 40, 400) + 48; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.rotate(-0.03); ctx.scale(k, k); fRect(-w / 2, -30, w, 60, 12, '#ffd34d', { lw: 4, drop: [0, 5] }); fText(str, 0, 14, 40, FL.ink, { align: 'center', outline: false, weight: 400 }); ctx.restore(); } };
const SKIN = '#e0a14a', SKIND = '#b97a2c', FLESH = '#fff3d9', RING = '#f3dcae', GAS = '#9bd46a', TEAR = '#5ab6f0', WOOD = '#c98b55', BOARD = '#ecbf82';

// ---- props
function kitchen(o = {}) {
  fSky('#ffeccc', '#ffd9a8');
  // the window: the garden outside sits far back, so it drifts slowly
  const wx = 560, wy = 150, ww = 380, wh = 300;
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  fLayer(0.15, () => { fSky(FL.sky, FL.skyL); fCloud2(700, 230, 0.8, { speed: 10, span: 1300 }); fShape([[400, 420], [650, 360], [900, 400], [1100, 360], [1100, 520], [400, 520]], '#7fcf86', { lw: 4 }); fTree(820, 430, 0.7); fBirds(600, 210, 2, { speed: 30, span: 1300 }); });
  ctx.restore();
  fRect(wx - 14, wy - 14, ww + 28, wh + 28, 10, 'rgba(0,0,0,0)', { lw: 14, line: '#fff8ec' }); fRect(wx - 14, wy - 14, ww + 28, wh + 28, 10, 'rgba(0,0,0,0)', { lw: 5 });
  fLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#fff8ec', 12); fLine([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], '#fff8ec', 12);
  // a shelf with jars (mid depth)
  fLayer(0.35, () => { fRect(60, 300, 380, 22, 6, WOOD, { lw: 4 }); [[100, '#ff8c8c'], [190, '#ffd34d'], [280, '#9bd46a'], [370, '#8ec5ff']].forEach(([x, c], i) => { fRect(x - 32, 210 - (i % 2) * 14, 64, 90 + (i % 2) * 14, 10, c, { lw: 4, shade: [10, 0] }); fRect(x - 36, 196 - (i % 2) * 14, 72, 18, 4, '#fff8ec', { lw: 4 }); }); }, { sway: 10 });
  // the counter
  fRect(-100, 760, 2200, 400, 0, WOOD, { lw: 6, shade: [0, -20] }); fRect(-100, 740, 2200, 40, 8, '#e3a56e', { lw: 6 });
  if (o.pot) { fRect(760, 610, 170, 130, 20, '#8a96a8', { lw: 5, shade: [16, 0] }); fRect(740, 600, 210, 26, 10, '#6f7c8f', { lw: 5 }); for (let i = 0; i < 4; i++) { const u = mod(TT * 0.35 + i / 4, 1); fCirc(845 + Math.sin(u * 6 + i) * 20, 580 - u * 220, 16 + u * 26, 'rgba(255,255,255,0.7)', { lw: 3, line: '#ffffff', alpha: 1 - u }); } }
}
function board(x, y, w = 420) { fRect(x - w / 2, y - 30, w, 60, 18, BOARD, { lw: 5, shade: [0, -10] }); fCirc(x + w / 2 - 26, y, 9, '#c98b55', { lw: 3 }); }
// a whole onion with a face; mood; s = scale (1 = ~150 px wide)
function onion(x, y, s = 1, o = {}) {
  const r = 70 * s, P = [[x, y - r * 1.55], ...ellipsePts(x, y, r, r * 0.92, 0, 40, -Math.PI * 0.38, Math.PI * 1.38)];
  fShape(P, o.c ?? SKIN, { lw: 5, shade: [r * 0.22, -r * 0.1], shc: o.cd ?? SKIND, hi: true });
  for (const k of [-0.5, 0, 0.5]) fLine(arcPts(x + k * r * 0.35, y - r * 0.05, r * 0.85, Math.PI * (1.25 - k * 0.1), Math.PI * (1.75 - k * 0.1), 10).map(([px, py]) => [px, py]), o.cd ?? SKIND, 3, { alpha: 0.6, smooth: true });
  for (let i = -2; i <= 2; i++) fLine([[x + i * 6 * s, y + r * 0.9], [x + i * 10 * s, y + r * 1.15]], '#a8875e', 3);
  if (o.face !== false) fFace(x, y + r * 0.12, s * 1.15, o.mood ?? 'smile', o.key ?? 'on');
}
// half an onion, cut side up: rings
function halfOnion(x, y, s = 1) { const r = 80 * s; fCirc(x, y, r, FLESH, { ry: r * 0.62, lw: 5, shade: [0, -8], shc: RING }); for (let k = 1; k <= 4; k++) fCirc(x, y, r * (1 - k * 0.19), 'rgba(0,0,0,0)', { ry: r * 0.62 * (1 - k * 0.19), line: RING, lw: 4 }); fLine(arcPts(x, y, r, 0, Math.PI, 20, 0.62), SKIN, 9, { smooth: true }); }
// a knife; chop 0..1 lifts the blade
function knife(x, y, a = 0, lift = 0) {
  ctx.save(); ctx.translate(x, y - lift * 60); ctx.rotate(a);
  fShape([[-10, 0], [200, 0], [200, -16], [150, -52], [-10, -52]], '#dfe5ec', { lw: 5, shade: [0, 12], shc: '#c3ccd6' });
  fRect(-110, -44, 110, 36, 12, '#5a3a28', { lw: 5 }); for (const dx of [-80, -40]) fCirc(dx, -26, 5, '#e3d2b8', { lw: 2 });
  fLine([[30, -40], [70, -40]], FL.white, 4, { alpha: 0.8 });
  ctx.restore();
}
// the cook: the hero in a chef's hat, crying (tears 0..1)
function cook(x, y, r, o = {}) {
  fHero(x, y, r, { color: o.color ?? FL.purple, mood: o.mood ?? 'smile', arms: o.arms ?? [0.6, 2.0], look: o.look, hop: o.hop });
  fShape([[x - r * 0.55, y - r * 0.85], [x - r * 0.62, y - r * 1.25], ...ellipsePts(x - r * 0.3, y - r * 1.35, r * 0.34, r * 0.3, 0, 12, Math.PI * 0.8, Math.PI * 1.9), ...ellipsePts(x + r * 0.15, y - r * 1.5, r * 0.38, r * 0.32, 0, 12, Math.PI * 1.05, Math.PI * 1.95), ...ellipsePts(x + r * 0.48, y - r * 1.3, r * 0.3, r * 0.28, 0, 12, Math.PI * 1.2, Math.PI * 2.2), [x + r * 0.6, y - r * 0.85]], FL.white, { lw: 5, shade: [r * 0.08, 0], shc: '#e8eef4' });
  const t = o.tears ?? 0; if (t > 0) for (const sg of [-1, 1]) for (let i = 0; i < 2; i++) { const u = mod(TT * 1.1 + i * 0.5 + (sg > 0 ? 0.25 : 0), 1); fDrop(x + sg * r * 0.3, y - r * 0.05 + u * r * 1.0, r * 0.1 * t, TEAR, { lw: 2.5, shade: false, hi: false, alpha: 1 - u * 0.6 }); }
}
// a wisp of the gas, with a cheeky face; drifts along a wavy path
function wisp(x, y, s = 1, key = 'w', mood = 'wow') { const P = []; for (let i = 0; i <= 10; i++) { const u = i / 10; P.push([x + Math.sin(u * 6 + TT * 2 + key.length) * 12 * s, y + 40 * s - u * 80 * s]); } fLine(P, FL.ink, 30 * s, { smooth: true }); fLine(P, GAS, 22 * s, { smooth: true }); if (s >= 0.6) fFace(x + Math.sin(TT * 2 + 3 + key.length) * 10 * s, y, s * 0.42, mood, key, { blush: false }); }
// a sulfur blob (yellow) and an enzyme (pink, a little pac-man)
const sulfur = (x, y, s, key, mood = 'smile') => { fCirc(x, y, 26 * s, '#ffd34d', { lw: 4, shade: [-5 * s, -6 * s], shc: '#f5b82e' }); fFace(x, y, s * 0.5, mood, key, { blush: false }); };
function enzyme(x, y, s, key, open = 0.5, dir = 1) { const m = 0.15 + open * 0.55; fShape([[x, y], ...ellipsePts(x, y, 26 * s, 26 * s, 0, 24, m, TAU - m).map(([px, py]) => [x + (px - x) * dir, py])], FL.pink, { lw: 4 }); fCirc(x + dir * 4 * s, y - 12 * s, 4 * s, FL.ink, { line: false }); }

// ---- 1. why? the cook is chopping and crying
function sHook(o = {}) {
  kitchen({ pot: true }); board(300, 760);
  const chop = Math.max(0, Math.sin(TT * 7)) * (o.end ? 0 : 1);
  if (o.end) onion(240, 690, 0.8, { mood: 'happy', key: 'onE' }); else { halfOnion(220, 735, 0.75); onion(330, 680, 0.75, { mood: TT > at(4.6) ? 'focus' : 'smile', key: 'onH' }); knife(390, 740 - 34, -0.25 - chop * 0.2, chop); }
  cook(560, 600, 80, { mood: o.end ? 'happy' : TT > at(2.4) ? 'sad' : 'smile', tears: o.end ? 0 : sm(TT, at(2.0), at(3.4)), arms: o.end ? [0.8, 2.6] : [2.4, 0.8] });
  if (o.end) { fRect(640, 690, 120, 70, 10, '#8ec5ff', { lw: 5 }); fShape([[680, 690], [700, 650], [720, 690]], FL.white, { lw: 4 }); }
  if (!o.end) { for (let i = 0; i < 3; i++) { const u = mod(TT * 0.4 + i / 3, 1); wisp(330 + i * 40 + u * 120, 640 - u * 160, 0.55, 'hw' + i); } fLabel('your eyes!', 380, 420, 540, 585, at(4.6), { color: FL.pink }); }
}
function cHook(at) {
  title('Why do onions make you cry?', at(0.8));
  write("you're not sad...", CL, 420, 50, at(3.0));
  write('your eyes are under attack', CL, 520, 50, at(5.0), { color: CH.accent, weight: 800 });
  bigNum('?', 'and how do you stop it?', CCX, 780, at(8.6), CH.accent, 150);
}

// ---- 2. but why? inside the cells: two things kept apart, until the knife
const CELLS = (() => { const L = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) L.push([120 + c * 215 + (r % 2) * 40, 170 + r * 200]); return L; })();
function sCells() {
  fSky('#fff3d9', '#ffe6b5');
  const kx = lerp(-200, 1100, sm(TT, at(6.4), at(9.4)));
  CELLS.forEach(([x, y], i) => {
    const broken = kx > x + 60, f = broken ? sm(TT, at(6.4) + (x + 200) / 1300 * 3, at(6.4) + (x + 200) / 1300 * 3 + 1.2) : 0;
    fRect(x - 90, y - 80, 180, 160, 30, i % 3 ? '#fff8e6' : '#fdf0d2', { lw: 6, shade: [0, -12], shc: RING });
    if (!broken) fLine([[x, y - 66], [x, y + 66]], RING, 6);
    else for (let k = 0; k < 4; k++) fLine([[x - 10 + k * 7, y - 70 + k * 30], [x + 10 - k * 5, y - 50 + k * 30]], SKIN, 4, { alpha: 1 - f });
    sulfur(x - 44 + f * 20, y, 0.9, 'su' + i, broken && f > 0.8 ? 'wow' : 'smile'); enzyme(x + 44 - f * 22, y, 0.9, 'en' + i, f > 0.5 ? 0.9 : 0.3 + 0.2 * Math.sin(TT * 3 + i), -1);
  });
  knife(kx, 760, 0, 0);
  fLabel('sulfur chemicals', 200, 900, 116, 580, at(2.0), { color: '#c98a00', size: 40 });
  fLabel('enzymes', 560, 900, 456, 580, at(2.6), { color: FL.pink, size: 40 });
}
function cCells(at) {
  title('Millions of tiny cells', at(0.6));
  write('each keeps two things apart:', CL, 420, 44, at(1.8));
  write('sulfur chemicals + enzymes', CL, 510, 46, at(4.4), { weight: 800 });
  write('the knife breaks the walls...', CL, 700, 46, at(8.6));
  write('...and they meet', CL, 790, 52, at(10.8), { color: CH.accent, weight: 800 });
}

// ---- 3. and then? an assembly line: enzyme 1 (alliinase), enzyme 2 (found in 2002), out comes the gas
function sEnzymes() {
  fSky('#fff3d9', '#ffe6b5');
  const by = 700; fRect(-60, by, 1120, 70, 20, '#6f7c8f', { lw: 6 }); for (let i = 0; i < 14; i++) { const x = mod(i * 90 + TT * 80, 1260) - 100; fLine([[x, by + 12], [x + 30, by + 58]], '#56627a', 6); }
  for (const [mx, name, c, t] of [[300, 'alliinase', FL.pink, at(1.4)], [660, 'enzyme #2', '#c86cf0', at(6.0)]]) fPop(t, mx, by - 150, () => { fRect(mx - 100, by - 250, 200, 190, 24, c, { lw: 6, shade: [18, 0] }); fFace(mx, by - 170, 1.3, TT % 2 < 1 ? 'focus' : 'happy', name); fText(name, mx, by - 270, 36, FL.ink, { align: 'center' }); if (mx > 500) { fRect(mx + 40, by - 300, 120, 50, 25, '#ffd34d', { lw: 4 }); fText('2002', mx + 100, by - 264, 32, FL.ink, { align: 'center', outline: false }); } });
  for (let i = 0; i < 4; i++) {
    const x = mod(i * 300 + TT * 80, 1200) - 100, y = by - 34; if (x > 950) continue;
    if (x < 300) sulfur(x, y - 14, 1.5, 'as' + i); else if (x < 660) { fCirc(x, y - 14, 42, '#b8e07a', { lw: 5, shade: [-7, -9] }); fFace(x, y - 14, 0.8, 'wow', 'ac' + i, { blush: false }); } else wisp(x, y - 30 - (x - 660) * 0.6, 1.2, 'aw' + i, 'happy');
  }
  if (TT > at(9.6)) fPop(at(9.6), 480, 230, () => { const str = 'syn-propanethial-S-oxide'; const w = fTextW(str, 44) + 60; fRect(480 - w / 2, 190, w, 80, 40, FL.white, { lw: 5, drop: [0, 6] }); fText(str, 480, 246, 44, '#3c9a52', { align: 'center', outline: false }); });
}
function cEnzymes(at) {
  title('Two enzymes, one gas', at(0.6));
  write('1. alliinase: sulfur → an acid', CL, 420, 44, at(2.4));
  write('2. a second enzyme (found 2002):', CL, 520, 44, at(6.4));
  write('acid → a gas', CL, 600, 50, at(7.4), { color: CH.green, weight: 800 });
  write('try saying its name with watery eyes', CL, 800, 36, at(10.4));
}

// ---- 4. but why my face? the gas is light and drifts up to the cook
function sGas() {
  kitchen(); board(330, 760);
  halfOnion(260, 735, 0.8); halfOnion(400, 740, 0.6);
  const lean = sm(TT, at(8.4), at(9.6)), cx = 640 - lean * 120, cy = 520 + lean * 60;
  for (let i = 0; i < 6 + Math.round(lean * 4); i++) { const u = mod(TT * 0.3 + i / 6, 1), sx = 300 + (i % 3) * 50, x = lerp(sx, cx - 20, u), y = lerp(700, cy - 20, u) - Math.sin(u * Math.PI) * 60; wisp(x, y, 0.5 + 0.2 * (i % 2), 'gw' + i, u > 0.8 ? 'happy' : 'wow'); }
  cook(cx, cy, 80, { mood: TT > at(5.0) ? 'sad' : 'wow', tears: sm(TT, at(5.0), at(6.0)), arms: [0.6, 1.0] });
  fLabel('light gas floats up', 820, 320, 470, 560, at(1.6), { color: '#3c9a52' });
}
function cGas(at) {
  title('Up it goes', at(0.6));
  write('the gas is light', CL, 420, 50, at(1.6));
  write('it drifts up off the board...', CL, 510, 46, at(3.4));
  write('...toward your face', CL, 600, 50, at(5.2), { color: CH.accent, weight: 800 });
  write('lean in = more gas', CL, 800, 46, at(8.8));
}

// ---- 5. and why tears? a big eye: the gas irritates nerves, the tear gland washes it away
function sEyes() {
  fSky('#e8f5fb', '#cfeaf7');
  const ex = 470, ey = 520, open = 1 - 0.25 * sm(TT, at(3.0), at(4.0));
  fCirc(ex, ey, 400, '#ffd9c2', { ry: 330, lw: 6 });   // skin around the eye
  fShape([...ellipsePts(ex, ey, 330, 170 * open, 0, 60)], FL.white, { lw: 7 });
  fCirc(ex + 10, ey + 5, 120 * Math.min(1, open + 0.1), '#7a4a2c', { lw: 6 }); fCirc(ex + 10, ey + 5, 60, FL.ink, { line: false }); fCirc(ex + 45, ey - 30, 22, FL.white, { line: false });
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.12 + i * 0.095); fLine([[ex + Math.cos(a) * 330, ey + Math.sin(a) * 170 * open], [ex + Math.cos(a) * 370, ey + Math.sin(a) * 215 * open - 20]], FL.ink, 7); }
  const gx = ex - 260, gy = ey - 250, pump = 1 + 0.08 * Math.sin(TT * 6) * sm(TT, at(6.0), at(6.6));   // the tear gland, up and out
  fCirc(gx, gy, 70 * pump, FL.pinkL, { ry: 46 * pump, lw: 5 }); fFace(gx, gy, 0.6, TT > at(6.0) ? 'focus' : 'smile', 'gland');
  for (let i = 0; i < 4; i++) { const u = mod(TT * 0.25 + i / 4, 1); wisp(ex + 380 - u * 300, ey - 200 + u * 120, 0.55, 'ew' + i, 'happy'); }
  if (TT > at(3.0)) for (let i = 0; i < 3; i++) { const x0 = ex - 120 + i * 120, k = Math.sin(TT * 18 + i) > 0 ? 1 : 0.6; fLine([[x0, ey - 140], [x0 + 18, ey - 110], [x0 - 10, ey - 90], [x0 + 12, ey - 60]], '#ffd34d', 9 * k); }
  if (TT > at(6.6)) for (let i = 0; i < 6; i++) { const u = mod(TT * 0.5 + i / 6, 1); fDrop(ex - 300 + (i % 3) * 30, ey + 40 + u * 420, 18, TEAR, { lw: 3, alpha: 1 - u * 0.5 }); }
  fLabel('tear gland', 160, 120, gx, gy - 40, at(6.4), { color: FL.pink });
  fLabel('nerves', 820, 200, ex, ey - 120, at(3.2), { color: '#c98a00' });
}
function cEyes(at) {
  title('Why the tears?', at(0.6));
  write('the gas irritates nerves in your eyes', CL, 420, 40, at(3.0));
  write('your brain: "attack!"', CL, 520, 50, at(5.0), { color: CH.accent, weight: 800 });
  write('tear glands wash it away', CL, 700, 46, at(6.8));
  write("tears = your eyes' rinse", CL, 800, 50, at(9.6), { color: CH.blue, weight: 800 });
}

// ---- 6. but why would an onion do that? underground, a hungry vole takes a bite
function vole(x, y, s, mood) { fCirc(x, y, 70 * s, '#9b7a5c', { ry: 52 * s, lw: 5, shade: [-10 * s, -10 * s] }); fCirc(x - 62 * s, y - 8 * s, 30 * s, '#9b7a5c', { lw: 5 }); fCirc(x - 92 * s, y - 6 * s, 9 * s, FL.pink, { lw: 3 }); for (const d of [-1, 1]) fCirc(x - 30 * s + d * 22 * s, y - 50 * s, 16 * s, '#b8957a', { lw: 4 }); fFace(x - 50 * s, y - 14 * s, s * 0.8, mood, 'vole', { look: [-1, 0] }); }
function sDefence() {
  fSky(FL.sky, FL.skyL);
  fLayer(0.12, () => { fMountain(300, 420, 500, 220, { c: '#a9bfd6', snow: 0.3, lw: 4 }); fMountain(760, 420, 520, 260, { c: '#b7c9de', snow: 0.3, lw: 4 }); });
  fLayer(0.2, () => { fCloud2(300, 120, 1.0, { speed: 10 }); fBirds(500, 180, 3, { speed: 30 }); });
  fLayer(0.4, () => { fShape([[-200, 430], [300, 380], [700, 410], [2200, 400], [2200, 600], [-200, 600]], '#7fcf86', { lw: 5 }); fPine(120, 420, 0.8); fPine(820, 410, 0.9); });
  fBand(440, '#a8744c', { lw: 6 }); for (let i = 0; i < 9; i++) { const R = RNG('peb', i); fCirc(R.r(40, 960), R.r(760, 1040), R.r(10, 22), '#8f6240', { ry: R.r(7, 14), lw: 3 }); }
  fRect(-100, 420, 2200, 30, 8, FL.grass, { lw: 5 }); fTufts(40, 960, 430, 10);
  for (let i = 0; i < 3; i++) fLine([[390 + i * 20, 470], [380 + i * 30, 260 - i * 20]], '#4ba552', 14);
  onion(400, 600, 1.2, { mood: TT > at(6.8) ? 'focus' : 'sleep', key: 'onD' });
  const vx = lerp(1000, 560, sm(TT, at(1.4), at(6.6))) + (TT > at(7.2) ? sm(TT, at(7.2), at(8.4)) * 260 : 0);
  fShape([[1000, 650], [vx + 40, 605], [vx + 40, 680]], '#7d5536', { line: false });
  vole(vx, 640, 1.0, TT > at(7.2) ? 'ouch' : 'happy');
  if (TT > at(7.0)) for (let i = 0; i < 5; i++) { const u = clamp((TT - at(7.0)) / 1.6), a = i / 5 * TAU; wisp(470 + Math.cos(a) * 140 * u, 600 + Math.sin(a) * 90 * u, 0.6, 'dw' + i, 'wow'); }
  fLabel('a hungry vole', 820, 860, vx, 640, at(2.4), { color: '#6b4a30' });
}
function cDefence(at) {
  title('A built-in defence', at(0.6));
  write('scientists think...', CL, 560, 44, at(1.6));
  write('onions grow in the ground', CL, 640, 46, at(3.0));
  write('hungry animals dig and bite', CL, 720, 46, at(4.6));
  write('one bite = a face full of gas', CL, 880, 50, at(7.2), { color: CH.accent, weight: 800 });
}

// ---- 7. so what helps? chill it, a sharp knife, a fan
function sTips() {
  kitchen(); board(330, 760); halfOnion(300, 735, 0.7);
  fPop(at(1.6), 170, 420, () => { fRect(70, 240, 200, 300, 20, '#e9f4fb', { lw: 6, shade: [18, 0] }); fLine([[70, 340], [270, 340]], FL.ink, 5); fRect(240, 270, 12, 50, 6, '#b8c4d0', { lw: 3 }); onion(170, 460, 0.45, { mood: 'sleep', key: 'onC' }); for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; fLine([[170 - Math.cos(a) * 30, 290 - Math.sin(a) * 30], [170 + Math.cos(a) * 30, 290 + Math.sin(a) * 30]], '#5ab6f0', 6); } });
  fPop(at(5.2), 480, 520, () => { knife(420, 560, -0.15, 0); const k = Math.max(0, Math.sin(TT * 3)); fLine([[560, 470 - 20 * k], [560, 470 + 20 * k]], FL.white, 6); fLine([[540 - 20 * k, 490], [580 + 20 * k, 490]], FL.white, 6); });
  fPop(at(9.2), 800, 520, () => { fRect(780, 560, 40, 180, 10, '#8a96a8', { lw: 5 }); fCirc(800, 500, 90, '#cfe8f7', { lw: 6 }); for (let i = 0; i < 3; i++) { const a = TT * 9 + i * TAU / 3; fShape([[800, 500], [800 + Math.cos(a - 0.35) * 80, 500 + Math.sin(a - 0.35) * 80], [800 + Math.cos(a + 0.35) * 80, 500 + Math.sin(a + 0.35) * 80]], '#5ab6f0', { lw: 4 }); } fCirc(800, 500, 14, FL.ink, { line: false }); for (let i = 0; i < 3; i++) { const u = mod(TT * 0.8 + i / 3, 1); wisp(680 - u * 300, 420 + i * 40, 0.45, 'tw' + i, 'happy'); } });
  cook(620, 660 - 60, 60, { mood: 'happy', tears: 0, arms: [0.6, 2.4] });
}
function cTips(at) {
  title('So what helps?', at(0.6));
  write('1. chill the onion first', CL, 420, 46, at(1.6), { weight: 800 });
  write('cold slows the enzymes', CL, 490, 40, at(3.0));
  write('2. use a sharp knife', CL, 600, 46, at(5.2), { weight: 800 });
  write('it breaks fewer cells', CL, 670, 40, at(6.4));
  write('3. a fan or an open window', CL, 780, 46, at(9.2), { weight: 800 });
}

// ---- 8. the hush: one onion on the board
function sHush() { kitchen(); board(400, 760); onion(400, 690, 0.8, { mood: 'focus', key: 'onQ' }); }

// ---- 9. the twist: a tearless onion exists (the Sunion, 2018, ~30 years of breeding)
function sTwist() {
  fSky('#ffe27a', '#fff3c4');
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + TT * 0.2; fShape([[440, 520], [440 + Math.cos(a - 0.08) * 900, 520 + Math.sin(a - 0.08) * 900], [440 + Math.cos(a + 0.08) * 900, 520 + Math.sin(a + 0.08) * 900]], 'rgba(255,255,255,0.35)', { line: false }); }
  for (let i = 0; i < 20; i++) { const R = RNG('cf', i), x = R.r(0, 980), y = mod(R.r(0, 1080) + (TT - HIT) * R.r(90, 170), 1120) - 20; fRect(x, y, 18, 10, 3, [FL.pink, FL.sea, FL.grass, FL.purple][i % 4], { lw: 2 }); }
  onion(440, 560, 1.9, { c: '#f7c948', cd: '#e0a92c', mood: 'happy', key: 'sun' });
  fShape([[360, 290], [385, 230], [415, 275], [440, 215], [465, 275], [495, 230], [520, 290]], '#ffd34d', { lw: 5, shade: [0, 8] });
  fPop(at(5.0), 790, 280, () => { fRect(700, 240, 180, 90, 20, FL.white, { lw: 5, drop: [0, 6] }); fText('2018', 790, 302, 54, FL.ink, { align: 'center', outline: false, weight: 400 }); });
  fPop(at(9.0), 780, 760, () => { fRect(690, 680, 180, 170, 16, FL.white, { lw: 5, drop: [0, 6] }); fRect(690, 680, 180, 46, 16, FL.red, { lw: 5 }); fText(String(Math.min(30, Math.floor(1 + 29 * sm(TT, at(9.0), at(11.0))))), 780, 815, 74, FL.ink, { align: 'center', outline: false, weight: 400 }); fText('years', 780, 712, 30, FL.white, { align: 'center', outline: false, weight: 400 }); });
  cook(200, 800, 56, { mood: 'happy', arms: 'up', hop: HIT + 0.3 });
}
function cTwist(at) {
  stamp('NO TEARS', CCX, 300, at(0.4));
  write('a tearless onion exists:', CL, 480, 46, at(1.6));
  write('the Sunion, on sale in 2018', CL, 570, 50, at(5.0), { color: CH.accent, weight: 800 });
  write('about 30 years of ordinary breeding,', CL, 740, 40, at(9.0));
  write('picking the mildest onions', CL, 810, 40, at(10.4));
}

// ---- 10. the end: the kitchen again, no hard feelings
function sEnd() { sHook({ end: true }); }
function cEnd(at) {
  title('So...', at(0.6));
  write("don't take it personally", CL, 420, 52, at(1.6), { weight: 800 });
  write("it's a plant protecting itself,", CL, 600, 44, at(4.4));
  write('one tiny cell at a time', CL, 680, 44, at(6.0));
  write('pass the tissues', CL, 860, 52, at(8.4), { color: CH.accent, weight: 800 });
}
