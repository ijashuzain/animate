// =====================================================================
//  SCENES — How do fireflies glow? FLAT style at night: a meadow in three depths (far hills + moon, mid pine silhouettes,
//  near grass that sways), stars, and fireflies whose lanterns glow. The glow is light (a soft radial), not texture.
//  Colour means one thing: yellow-green = firefly light, red = heat, blue = oxygen / cool, pink = the enzyme.
//  Fonts: Baloo 2 (headings: round and warm), Patrick Hand (field-notes labels), Quicksand (reading lines).
// =====================================================================
const CHANNEL = { font: '"Quicksand", sans-serif', weight: 700, titleFont: '"Baloo 2", sans-serif', titleWeight: 800, labelFont: '"Patrick Hand", sans-serif',
  halo: 'rgba(255,248,236,0.8)', haloDark: 'rgba(15,20,48,0.7)', inkDark: '#f4f1ff',
  colors: { ink: '#2b2347', accent: '#ffd23f', green: '#b6f36a', blue: '#8ec5ff' },
  tag: (str, k) => { const w = fTextW(str, 40, 800, { font: '"Baloo 2", sans-serif' }) + 48; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.scale(k, k); fRect(-w / 2, -30, w, 60, 30, '#ffd23f', { lw: 4, drop: [0, 5] }); fText(str, 0, 14, 40, FL.ink, { align: 'center', outline: false, font: '"Baloo 2", sans-serif' }); ctx.restore(); } };
const GLOW = '#e9ff6a', GLOWD = '#b6e33a', BUG = '#3b2e2a', SHIELD = '#e8574a', WING = '#5a4a40', HEAT = '#ff5a3c', O2 = '#5ab6f0';
// a soft glow (light, not texture): a radial falloff
function glow(x, y, r, a = 1, c = '233,255,106') { if (a <= 0) return; ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${c},${0.85 * a})`); g.addColorStop(0.35, `rgba(${c},${0.35 * a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
// a firefly (a beetle): wings, red head shield, antennae, and a lantern at the tail; lit 0..1; s = scale (1 = ~120 px long)
function firefly(x, y, s = 1, o = {}) {
  const lit = o.lit ?? 1, dir = o.dir ?? 1, flap = o.fly ? Math.sin(TT * 30 + x) * 0.5 : 0, key = o.key ?? 'ff';
  glow(x - dir * 46 * s, y + 6 * s, 120 * s, lit);
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.rotate(o.rot ?? 0);
  if (o.fly) for (const k of [-1, 1]) fCirc(-6, -26, 40, 'rgba(220,235,255,0.55)', { ry: 14, rot: -0.6 * k - flap * k, lw: 3 });
  fCirc(-46, 6, 26, lit > 0.2 ? GLOW : '#c9c79a', { ry: 20, lw: 4, shade: [6, -6], shc: GLOWD });           // the lantern
  fCirc(-8, 0, 46, BUG, { ry: 24, lw: 4 });                                                                   // body
  for (const k of [-1, 1]) fShape([[-50, -4 * k], [10, -18 * k], [26, -6 * k], [-34, 4 * k]].map(([a, b]) => [a, b - 4]), WING, { lw: 3.5, shade: false });
  fCirc(30, -2, 22, SHIELD, { ry: 18, lw: 4, shade: [-4, -4] });                                               // head shield
  fCirc(46, 2, 12, BUG, { lw: 3.5 });
  for (const k of [-1, 1]) fLine([[52, -4], [70, -24 + k * 6], [82, -28 + k * 10]], FL.ink, 3.5, { smooth: true });
  for (let i = 0; i < 3; i++) fLine([[-20 + i * 18, 18], [-26 + i * 18, 34]], FL.ink, 3.5);
  ctx.restore();
  if (o.face !== false && s >= 0.6) fFace(x + dir * 44 * s, y - 2 * s, s * 0.5, o.mood ?? 'smile', key, { blush: false, look: [dir, 0] });
}
// the night meadow in three depths
function night(o = {}) {
  fSky(o.top ?? '#141a3a', o.bot ?? '#2c3566');
  fLayer(0.04, () => { for (let i = 0; i < 40; i++) { const R = RNG('st', i), x = R.r(0, 1000), y = R.r(20, 520), k = 0.6 + 0.4 * Math.sin(TT * R.r(0.6, 1.6) + i); fCirc(x, y, R.r(1.5, 3.2) * k, '#fffbe6', { line: false }); } if (o.moon !== false) { fCirc(820, 170, 62, '#fff6cf', { lw: 4, shade: [-14, -14], shc: '#f2e3a6' }); fCirc(800, 150, 10, '#f2e3a6', { line: false }); fCirc(840, 190, 7, '#f2e3a6', { line: false }); } });
  fLayer(0.12, () => fShape([[-200, 700], [150, 560], [420, 640], [700, 540], [1000, 640], [2200, 620], [2200, 1100], [-200, 1100]], o.hill ?? '#2a3a63', { lw: 4, line: '#1a2240' }));
  fLayer(0.3, () => { for (const [x, sc] of [[70, 1.4], [200, 1.1], [760, 1.3], [900, 1.0]]) fPine(x, 760, sc, { c: o.pine ?? '#22524a' }); fShape([[-200, 760], [400, 730], [1000, 760], [2200, 750], [2200, 1100], [-200, 1100]], o.mid ?? '#244a46', { lw: 4, line: '#16302d' }); });
  if (o.swarm !== false) for (let i = 0; i < 14; i++) { const R = RNG('sw', i), x = R.r(40, 960) + Math.sin(TT * 0.4 + i) * 30, y = R.r(380, 760) + Math.cos(TT * 0.5 + i * 2) * 20, on = Math.max(0, Math.sin(TT * R.r(1.2, 2.4) + i * 2.1)); glow(x, y, 36, on); fCirc(x, y, 4, '#f6ffb0', { line: false, alpha: 0.4 + 0.6 * on }); }
}
// near grass: blades that sway, in front of everything
function grass(y = 880, c = '#2f6b4f', n = 26) { fBand(y, '#1f4a39', { lw: 4, line: '#153328' }); for (let i = 0; i < n; i++) { const x = (i + 0.5) / n * 1000, h = 70 + (i * 37 % 50), a = Math.sin(TT * 1.3 + i * 0.7) * 10; fShape([[x - 9, y + 6], [x + a, y - h], [x + 9, y + 6]], c, { lw: 3, line: '#153328' }); } }
// a thermometer (heat 0..1)
function thermo(x, y, heat, c = HEAT) { fRect(x - 18, y - 200, 36, 200, 18, FL.white, { lw: 5 }); fRect(x - 9, y - 10 - 170 * heat, 18, 170 * heat + 10, 9, c, { line: false }); fCirc(x, y + 10, 30, c, { lw: 5 }); }
function bulb(x, y, s = 1, on = 1) { glow(x, y - 20 * s, 200 * s, on, '255,200,120'); fCirc(x, y - 30 * s, 70 * s, '#fff1b8', { lw: 5, shade: [-10, -10], shc: '#ffe08a' }); fRect(x - 32 * s, y + 30 * s, 64 * s, 50 * s, 8, '#b9c3cf', { lw: 5 }); fLine([[x - 20 * s, y - 30 * s], [x - 8 * s, y - 60 * s], [x + 8 * s, y - 30 * s], [x + 20 * s, y - 60 * s]], '#ff8c42', 5); for (let i = 0; i < 3; i++) { const u = mod(TT * 0.6 + i / 3, 1); fLine([[x - 60 * s + i * 60 * s, y - 120 * s - u * 80], [x - 50 * s + i * 60 * s, y - 140 * s - u * 80], [x - 60 * s + i * 60 * s, y - 160 * s - u * 80]], HEAT, 6, { alpha: 1 - u, smooth: true }); } }

// ---- 1. 8:30 pm: a firefly glows, cool; a light bulb glows, hot
function sHook() {
  night({ swarm: true });
  firefly(320, 540, 2.3, { lit: 0.6 + 0.4 * Math.max(0, Math.sin(TT * 2)), key: 'hero', mood: TT > at(4.6) ? 'happy' : 'smile' });
  fPop(at(4.6), 780, 520, () => { bulb(780, 520, 1.35); });
  fPop(at(6.6), 260, 860, () => thermo(260, 860, 0.15, O2)); fPop(at(7.4), 900, 860, () => thermo(900, 860, 0.9));
  grass(940);
  fLabel('cool', 120, 760, 230, 720, at(7.0), { color: FL.blue, size: 44 }); fLabel('hot!', 700, 800, 870, 720, at(7.8), { color: HEAT, size: 44 });
}
function cHook(at) {
  title('Light without heat?', at(0.8));
  write("you've never felt one get hot", CL, 420, 46, at(1.8));
  bigNum('~90%', "of an old bulb's power becomes heat", CCX, 640, at(8.0), CH.accent, 110);
  write('so how does a firefly do it?', CL, 880, 44, at(9.6), { color: CH.green, weight: 700 });
}

// ---- 2. 8:45 pm: dusk; it climbs a blade of grass. Not a fly: a beetle
function sWake() {
  night({ top: '#3a2f6b', bot: '#e98a6a', hill: '#3c3f73', mid: '#2e4f55', swarm: false });
  const climb = sm(TT, at(0.6), at(5.0)), bx = 420;
  fShape([[bx - 26, 960], [bx + 30 + Math.sin(TT * 1.2) * 10, 300], [bx + 26, 960]], '#3f8a5c', { lw: 4, line: '#1c3d2b' });
  firefly(bx + 10, lerp(860, 380, climb), 1.5, { rot: -1.45, lit: 0.3 + 0.7 * sm(TT, at(6.0), at(7.0)), key: 'wake', face: false });
  grass(960);
  fLens(760, 460, 150, popS(at(6.4)), () => { fSky('#1b2140'); firefly(820, 470, 2.6, { lit: 1, key: 'lens' }); }, { glass: '#1b2140', handle: FL.yellow });
  fLabel('a beetle!', 760, 250, 600, 420, at(2.6), { color: SHIELD });
  fLabel('the lantern', 760, 700, 700, 520, at(9.4), { color: GLOWD });
}
function cWake(at) {
  title('Not a fly at all', at(0.6));
  write('fireflies are beetles', CL, 430, 52, at(2.4), { color: CH.green, weight: 700 });
  write('the light comes from a special organ', CL, 620, 40, at(6.6));
  write('at the tip of the belly', CL, 690, 40, at(7.8));
}

// ---- 3. 9:00 pm: inside the lantern: luciferin + luciferase + oxygen + energy = light, little heat
function sChem() {
  fSky('#141a3a', '#1f2754');
  for (let i = 0; i < 24; i++) { const R = RNG('cb', i); fCirc(R.r(0, 1000), R.r(0, 1080), R.r(30, 70), 'rgba(233,255,106,0.06)', { line: false }); }
  const mx = 480, my = 520, k = sm(TT, at(4.4), at(7.6));
  const items = [[at(1.4), -320, -120, () => { fCirc(0, 0, 54, '#ffd34d', { lw: 5, shade: [-8, -9], shc: '#f5b82e' }); fFace(0, 0, 0.9, 'smile', 'lu'); }, 'luciferin'],
    [at(2.0), 320, -120, () => { fShape([[0, 0], ...ellipsePts(0, 0, 56, 56, 0, 30, 0.5 + 0.3 * Math.sin(TT * 4), TAU - 0.5 - 0.3 * Math.sin(TT * 4))].map(([x, y]) => [-x, y]), FL.pink, { lw: 5 }); fCirc(-8, -26, 7, FL.ink, { line: false }); }, 'luciferase'],
    [at(4.4), -320, 200, () => { fCirc(-22, 0, 30, O2, { lw: 4 }); fCirc(22, 0, 30, O2, { lw: 4 }); fText('O₂', 0, 14, 40, FL.white, { align: 'center', outline: FL.ink }); }, 'oxygen'],
    [at(4.4), 320, 200, () => { fShape([[-10, -60], [26, -60], [6, -6], [30, -6], [-20, 64], [-4, 10], [-28, 10]], '#ffd34d', { lw: 5 }); }, 'energy']];
  for (const [t, dx, dy, fn, name] of items) { if (TT < t) continue; const p = popS(t), x = mx + dx * (1 - k), y = my + dy * (1 - k); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); fn(); ctx.restore(); if (k < 0.3) fText(name, x, y + 110, 40, '#f4f1ff', { align: 'center', outline: '#141a3a' }); }
  if (TT > at(7.6)) { const b = popS(at(7.6)); glow(mx, my, 420 * b, 1); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + TT * 0.3; fLine([[mx + Math.cos(a) * 90 * b, my + Math.sin(a) * 90 * b], [mx + Math.cos(a) * 190 * b, my + Math.sin(a) * 190 * b]], GLOW, 12); } fCirc(mx, my, 70 * b, GLOW, { lw: 5 }); fFace(mx, my, b, 'happy', 'light'); fPop(at(9.0), 860, 820, () => thermo(860, 820, 0.12, O2)); }
}
function cChem(at) {
  title('Inside the lantern', at(0.6));
  write('luciferin + luciferase', CL, 420, 48, at(2.0), { weight: 700 });
  write('+ oxygen + a little energy', CL, 500, 44, at(4.4));
  write('= light', CL, 680, 72, at(7.6), { color: CH.green, weight: 700 });
  write('and very little heat', CL, 780, 46, at(9.0), { color: CH.blue });
}

// ---- 4. 9:10 pm: the switch: oxygen through breathing tubes, on and off
function sSwitch() {
  night({ swarm: false });
  const on = Math.sin((TT - at(0)) * Math.PI / 2) > 0 ? 1 : 0, f = (TT - at(0)) % 4;
  firefly(560, 520, 3.0, { lit: on ? 1 : 0.1, key: 'sw', mood: on ? 'happy' : 'focus' });
  // breathing tubes into the lantern (drawn over the body), oxygen bubbles flowing while it's on
  const T = [[440, 400], [410, 470], [430, 520]];
  for (const [sx, sy] of [[520, 380], [500, 430]]) fLine([[sx, sy], [470, 470], [430, 520]], O2, 8, { smooth: true });
  if (on) for (let i = 0; i < 5; i++) { const u = mod(TT * 1.5 + i / 5, 1); fCirc(lerp(520, 430, u), lerp(380, 520, u), 9, O2, { lw: 3 }); }
  fRect(780, 760, 120, 70, 35, on ? FL.yellow : '#55607a', { lw: 5 }); fCirc(on ? 865 : 815, 795, 28, FL.white, { lw: 4 });
  grass(940);
  fLabel('breathing tubes', 260, 260, 480, 420, at(1.6), { color: O2 });
}
function cSwitch(at) {
  title('A switch made of air', at(0.6));
  write('tiny breathing tubes bring air', CL, 420, 44, at(1.6));
  write('oxygen in = glow', CL, 560, 52, at(4.0), { color: CH.green, weight: 700 });
  write('oxygen cut off = dark', CL, 660, 52, at(8.0), { weight: 700 });
}

// ---- 5. 9:30 pm: the flash code; males fly and flash, a female answers
function sCode() {
  night({ swarm: false });
  const t = TT - at(0), code = (p) => { const c = mod(p, 4); return (c < 0.25 || (c > 0.5 && c < 0.75) || (c > 1.0 && c < 1.25)) ? 1 : 0; };
  for (let i = 0; i < 3; i++) { const x = mod(120 + i * 280 + t * 40, 1100) - 60, y = 300 + i * 70 + Math.sin(t + i) * 30; firefly(x, y, 0.8, { fly: true, lit: code(t + i * 0.2), key: 'm' + i }); }
  const ans = mod(t, 4) > 2.0 && mod(t, 4) < 2.3 ? 1 : 0;
  fShape([[560, 960], [600 + Math.sin(TT * 1.2) * 8, 700], [620, 960]], '#3f8a5c', { lw: 4, line: '#1c3d2b' });
  firefly(610, 720, 0.9, { rot: -1.4, lit: ans, key: 'fem', face: false });
  grass(960);
  // the code as a little strip: three short flashes ... the answer
  const bar = (x0, y0, on, w) => fRect(x0, y0, w, 26, 13, on ? GLOW : '#3b4570', { lw: 3 });
  [0, 1, 2].forEach((i) => bar(100 + i * 70, 1000, code(t) && Math.floor(mod(t, 4) * 2) === i * 1, 50)); bar(400, 1000, ans, 90);
  fLabel('males: flash, flash, flash', 300, 180, 200, 290, at(2.0), { color: GLOWD });
  fLabel('female answers', 840, 620, 640, 710, at(7.6), { color: FL.pink });
}
function cCode(at) {
  title('A secret flash code', at(0.6));
  write('every species has its own:', CL, 420, 44, at(1.6));
  write('how many, how long, how far apart', CL, 500, 40, at(3.0));
  write('the males fly and flash', CL, 640, 46, at(4.4));
  write('a female answers, right on time', CL, 740, 46, at(7.6), { color: CH.green, weight: 700 });
}

// ---- 6. 10:00 pm: how efficient? 4 in 10 (2008, not "almost all"); still far cooler than a bulb
function sCold() {
  night({ swarm: false, moon: true });
  for (let i = 0; i < 10; i++) { const lit = i < 4 && TT > at(4.4) + i * 0.25, x = 120 + (i % 5) * 150, y = 420 + Math.floor(i / 5) * 160; fPop(at(1.4) + i * 0.08, x, y, () => { if (lit) glow(x, y, 80, 1); fCirc(x, y, 40, lit ? GLOW : '#3b4570', { lw: 4 }); if (lit) fFace(x, y, 0.55, 'happy', 'ph' + i, { blush: false }); }); }
  fPop(at(8.6), 780, 860, () => { thermo(260, 900, 0.15, O2); thermo(780, 900, 0.9); });
  fLabel('4 in 10 make a flash', 500, 240, 270, 380, at(4.8), { color: GLOWD });
}
function cCold(at) {
  title('How good is the light?', at(0.6));
  write('old textbooks: almost every reaction', CL, 420, 40, at(1.6));
  bigNum('~4 in 10', 'measured in 2008', CCX, 590, at(4.4), CH.green, 100);
  write("still far cooler than a bulb", CL, 820, 46, at(8.6), { weight: 700 });
}

// ---- 7. 10:30 pm: danger: bats, frogs, spiders; many fireflies taste bitter
function sDanger() {
  night({ swarm: false });
  const bx = lerp(1100, -200, mod((TT - at(0)) * 0.12, 1)), by = 260 + Math.sin(TT * 2) * 40, w = Math.sin(TT * 10) * 30;
  fShape([[bx, by], [bx - 70, by - 30 - w], [bx - 120, by + 10 - w * 0.5], [bx - 80, by + 10], [bx - 40, by + 30], [bx, by + 20], [bx + 40, by + 30], [bx + 80, by + 10], [bx + 120, by + 10 - w * 0.5], [bx + 70, by - 30 - w]], '#2a1f3a', { lw: 4, line: '#110b1c' }); fFace(bx, by + 8, 0.6, 'focus', 'bat', { blush: false });
  for (let k = 0; k < 6; k++) fLine([[960, 80], [960 - 260 * Math.cos(k * 0.3), 80 + 260 * Math.sin(k * 0.3)]], 'rgba(230,235,255,0.6)', 2.5);
  for (let r = 1; r <= 4; r++) fLine(arcPts(960, 80, r * 60, Math.PI * 0.5, Math.PI, 10), 'rgba(230,235,255,0.6)', 2.5);
  fCirc(820, 300, 24, '#2a1f3a', { lw: 3 }); fFace(820, 300, 0.4, 'focus', 'spider', { blush: false });
  fCirc(330, 860, 140, '#3f8a5c', { ry: 40, lw: 4 });
  const spit = TT > at(9.0); fCirc(330, 790, 80, '#6cc56a', { ry: 60, lw: 5, shade: [-10, -10] }); for (const k of [-1, 1]) fCirc(330 + k * 40, 740, 24, '#6cc56a', { lw: 4 }); fFace(330, 770, 1.1, spit ? 'ouch' : 'focus', 'frog');
  const fx = spit ? 420 + sm(TT, at(9.0), at(10.0)) * 200 : 460, fy = spit ? 700 - sm(TT, at(9.0), at(10.0)) * 200 : 700;
  if (!spit) fLine([[350, 790], [lerp(350, fx, sm(TT, at(7.6), at(8.6))), lerp(790, fy, sm(TT, at(7.6), at(8.6)))]], FL.pink, 12);
  firefly(fx, fy, 0.9, { lit: 1, key: 'dg', mood: spit ? 'happy' : 'wow', fly: spit });
  grass(960);
  if (spit) fLabel('yuck, bitter!', 160, 560, 300, 720, at(9.2), { color: FL.pink });
}
function cDanger(at) {
  title('Glowing is risky', at(0.6));
  write('bats, frogs and spiders hunt at night', CL, 420, 40, at(1.6));
  write('but many fireflies taste bitter', CL, 600, 44, at(4.4), { weight: 700 });
  write('the light means: "don\'t eat me"', CL, 720, 46, at(9.0), { color: CH.green, weight: 700 });
}

// ---- 8. the hush
function sHush() { night({ swarm: false }); glow(480, 640, 70, 0.6 + 0.4 * Math.sin(TT * 2)); grass(940); }

// ---- 9. 11:00 pm: the twist: a femme fatale fakes the answer
function sTwist() {
  night({ swarm: false, top: '#1a1036', bot: '#3a2a66' });
  const t = TT - HIT, fake = mod(t, 2) < 0.3 ? 1 : 0, down = sm(TT, HIT + 4.0, HIT + 8.0);
  fShape([[300, 960], [360 + Math.sin(TT * 1.2) * 8, 660], [380, 960]], '#3f8a5c', { lw: 4, line: '#1c3d2b' });
  firefly(380, 690, 1.6, { lit: fake, key: 'ff2', mood: 'focus', dir: 1, rot: -0.2 });
  fShape([[350, 655], [372, 640], [394, 655]], FL.ink, { lw: 3 });   // a sly brow
  if (down < 1) firefly(lerp(860, 520, down), lerp(240, 640, down), 1.0, { fly: true, lit: mod(t, 1.2) < 0.25 ? 1 : 0, key: 'male', mood: 'happy', dir: -1 });
  else fPop(HIT + 8.0, 500, 640, () => { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; fLine([[500 + Math.cos(a) * 30, 640 + Math.sin(a) * 30], [500 + Math.cos(a) * 70, 640 + Math.sin(a) * 70]], FL.pink, 8); } fText('GULP', 500, 560, 64, FL.pink, { align: 'center', font: '"Baloo 2", sans-serif' }); });
  grass(960);
  fLabel('a fake answer', 700, 860, 330, 690, at(4.0), { color: FL.pink });
}
function cTwist(at) {
  stamp('FAKE', CCX, 300, at(0.4));
  write('some females fake another', CL, 480, 44, at(1.6));
  write("species' answer...", CL, 550, 44, at(2.6));
  write('the male flies in: dinner', CL, 680, 50, at(6.0), { color: CH.accent, weight: 700 });
  write('"femme fatale" fireflies', CL, 840, 50, at(8.4), { color: CH.green, weight: 700 });
}

// ---- 10. 6:00 am: dawn; the lanterns go dark
function sEnd() {
  fSky('#ffb88a', '#ffe7c2');
  fLayer(0.05, () => { fSun(480, 720, 110, { mood: 'happy' }); });
  fLayer(0.12, () => fShape([[-200, 700], [150, 560], [420, 640], [700, 540], [1000, 640], [2200, 620], [2200, 1100], [-200, 1100]], '#9a8fc4', { lw: 4 }));
  fLayer(0.3, () => { for (const [x, sc] of [[70, 1.4], [200, 1.1], [760, 1.3], [900, 1.0]]) fPine(x, 760, sc); fShape([[-200, 760], [400, 730], [1000, 760], [2200, 750], [2200, 1100], [-200, 1100]], '#6cb07a', { lw: 4 }); });
  fShape([[540, 960], [610 + Math.sin(TT * 1.2) * 8, 640], [640, 960]], '#4ba552', { lw: 4 });
  firefly(615, 690, 1.2, { lit: 0.15, key: 'end', mood: 'sleep', rot: -1.3, face: false });
  fBirds(150, 260, 3, { speed: 40 });
  grass(960, '#4ba552');
}
function cEnd(at) {
  title('By dawn...', at(0.6));
  write('the lanterns go dark', CL, 420, 52, at(1.6), { weight: 700 });
  write('a little beetle rests', CL, 600, 46, at(4.4));
  write('ready to glow again tonight,', CL, 760, 44, at(8.6));
  write('with light that hardly gets warm', CL, 830, 44, at(9.4), { color: CH.accent, weight: 700 });
}
