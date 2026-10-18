// =====================================================================
//  SCENES — How do fireflies glow? The SOFT look (styles/flat with CHANNEL.look = 'soft'), from the user's references:
//  no outlines, one harmonious palette per scene (tone-on-tone indigo at night, peach and amber at dawn), background
//  trees and hills as tints of the ground, Headspace-style blob characters with noodle limbs, layered hills in depth.
//  The glow is light (a soft radial), never texture. Fonts: Baloo 2 (headings), Patrick Hand (labels), Quicksand (lines).
// =====================================================================
const CHANNEL = { look: 'soft', font: '"Quicksand", sans-serif', weight: 700, titleFont: '"Baloo 2", sans-serif', titleWeight: 800, labelFont: '"Patrick Hand", sans-serif',
  halo: 'rgba(255,248,236,0.8)', haloDark: 'rgba(24,22,60,0.6)', inkDark: '#f4f1ff',
  colors: { ink: '#2b2347', accent: '#ffcf5a', green: '#c6f27a', blue: '#9ec8ff' },
  tag: (str, k) => { const w = fTextW(str, 40, 800, { font: '"Baloo 2", sans-serif' }) + 48; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.scale(k, k); fRect(-w / 2, -30, w, 60, 30, '#ffcf5a', { line: false }); fText(str, 0, 14, 40, '#2b2347', { align: 'center', outline: false, font: '"Baloo 2", sans-serif' }); ctx.restore(); } };
// palettes: one hue family per scene
const NIGHT = { sky0: '#1d1b47', sky1: '#3b3878', far: '#36347000'.slice(0, 7), hill1: '#34326c', hill2: '#2c2a60', hill3: '#252355', tree: '#403e82', tree2: '#2f2d68', grass: '#1f1d4c' };
const DUSK = { sky0: '#4b3a86', sky1: '#f0a27c', hill1: '#7a5a9a', hill2: '#5e4688', hill3: '#4a3876', tree: '#8c64a8', tree2: '#6a4c92', grass: '#3d2f68' };
const DAWN = { sky0: '#ffd2a6', sky1: '#fff0d8', hill1: '#f3b26b', hill2: '#e98f4a', hill3: '#d9733a', tree: '#e2553b', tree2: '#c98a2f', grass: '#c9622f' };
const GLOW = '#ffe680', BUGC = '#ff8f5e', WINGC = 'rgba(230,236,255,0.6)';
// the meadow in depth: sky, stars, moon, three hill layers, round-tree and cypress silhouettes as tints, soft grass
function meadow(P = NIGHT, o = {}) {
  fSky(P.sky0, P.sky1);
  if (o.stars !== false) fLayer(0.03, () => { for (let i = 0; i < 46; i++) { const R = RNG('st', i), k = 0.55 + 0.45 * Math.sin(TT * R.r(0.5, 1.5) + i); fCirc(R.r(0, 1000), R.r(20, 520), R.r(1.6, 3.4) * k, '#fff6d8', { line: false }); } });
  if (o.moon !== false) fLayer(0.05, () => { fGlow(790, 180, 170, 0.5, '255,240,200'); fCirc(790, 180, 62, '#fff2c8', { line: false }); fCirc(812, 166, 50, P.sky0, { line: false, alpha: 0.0 }); fCirc(770, 165, 9, '#f3e2a6', { line: false }); fCirc(805, 205, 7, '#f3e2a6', { line: false }); });
  fHills([{ y: 640, c: P.hill1, amp: 50, f: 0.005, ph: 1, d: 0.1 }]);
  fLayer(0.18, () => { for (const [x, s] of [[110, 1.0], [700, 1.2]]) fTreeRound(x, 650, s, { c: P.tree, leaves: 0 }); fCone(260, 660, 1.0, P.tree); fCone(880, 650, 0.9, P.tree); });
  fHills([{ y: 760, c: P.hill2, amp: 40, f: 0.006, ph: 3, d: 0.3 }]);
  fLayer(0.35, () => { fTreeRound(560, 770, 0.8, { c: P.tree2, leaves: 0 }); fBush(140, 790, 0.9, P.tree2); fBush(930, 780, 0.8, P.tree2); });
  if (o.swarm !== false) for (let i = 0; i < 14; i++) { const R = RNG('sw', i), x = R.r(40, 960) + Math.sin(TT * 0.4 + i) * 30, y = R.r(380, 780) + Math.cos(TT * 0.5 + i * 2) * 20, on = Math.max(0, Math.sin(TT * R.r(1.2, 2.4) + i * 2.1)); fGlow(x, y, 38, on); fCirc(x, y, 4, '#fff7c2', { line: false, alpha: 0.35 + 0.65 * on }); }
}
// near grass: a flat band with rounded tufts that sway
function grassSoft(y = 900, c = NIGHT.grass) { fBand(y, c, { line: false, amp: 6, f: 0.01 }); for (let i = 0; i < 16; i++) { const x = (i + 0.5) / 16 * 1000, a = Math.sin(TT * 1.3 + i * 0.7) * 8, h = 46 + (i * 29 % 30); for (const k of [-1, 0, 1]) fNoodle([x + k * 12, y + 10], [x + k * 18 + a, y - h + Math.abs(k) * 14], 9, c); } }
// our firefly: a blob character (bean body), wings behind, antennae, and a glowing tail; lit 0..1; fly = wings buzz and it bobs
function bug(x, y, s = 1, o = {}) {
  const lit = o.lit ?? 1, dir = o.dir ?? 1, fly = o.fly ?? false, key = o.key ?? 'bug', flap = fly ? Math.sin(TT * 36 + x) : 0, yy = y + (fly ? Math.sin(TT * 3 + x * 0.01) * 10 : 0);
  ctx.save(); ctx.translate(x, yy); ctx.scale(s, s); ctx.translate(-x, -yy);
  for (const k of [-1, 1]) fCirc(x - dir * 18 + k * 34, yy - 140 + flap * 6, 38, WINGC, { ry: 58 + flap * 8, rot: k * (0.5 + flap * 0.15), line: false });
  fGlow(x - dir * 44, yy - 40, 150, lit); fCirc(x - dir * 44, yy - 40, 34, lit > 0.2 ? GLOW : '#a99fc8', { line: false });
  fBlob(x, yy, { key, w: 116, h: 160, body: 'bean', c: o.c ?? BUGC, limb: '#2a2350', mood: o.mood ?? 'smile', pose: o.pose ?? (fly ? 'cheer' : 'stand'), walk: o.walk ?? 0, dir, hop: o.hop, look: o.look,
    extra: ({ x: bx, top }) => { for (const k of [-1, 1]) { fNoodle([bx + k * 18, top + 10], [bx + k * 40 + Math.sin(TT * 3 + k) * 4, top - 42], 7, '#2a2350', k * 10); fCirc(bx + k * 40 + Math.sin(TT * 3 + k) * 4, top - 46, 9, '#2a2350', { line: false }); } } });
  ctx.restore();
}
// a light bulb, warm and hot
function bulbSoft(x, y, s = 1) { fGlow(x, y - 40 * s, 220 * s, 1, '255,200,130'); fCirc(x, y - 40 * s, 76 * s, '#fff0c0', { line: false }); fCirc(x - 20 * s, y - 64 * s, 18 * s, '#ffffff', { line: false, alpha: 0.7 }); fRect(x - 34 * s, y + 26 * s, 68 * s, 54 * s, 12 * s, '#b9b5d6', { line: false }); for (let i = 0; i < 3; i++) { const u = mod(TT * 0.6 + i / 3, 1); fNoodle([x - 60 * s + i * 60 * s, y - 140 * s - u * 80], [x - 54 * s + i * 60 * s, y - 180 * s - u * 80], 8, `rgba(255,110,80,${1 - u})`, 10); } }
function thermoSoft(x, y, heat, c = '#ff6b4a') { fRect(x - 20, y - 210, 40, 210, 20, '#f4f1ff', { line: false }); fRect(x - 10, y - 14 - 180 * heat, 20, 180 * heat + 14, 10, c, { line: false }); fCirc(x, y + 10, 32, c, { line: false }); }

// ---- 1. 8:30 pm: a firefly glows cool; a light bulb glows hot
function sHook() {
  meadow(NIGHT);
  bug(330, 760, 1.25, { lit: 0.6 + 0.4 * Math.max(0, Math.sin(TT * 2)), key: 'hero', mood: TT > at(4.6) ? 'happy' : 'smile', pose: TT > at(4.6) ? 'wave' : 'stand' });
  fPop(at(4.6), 780, 600, () => bulbSoft(780, 600, 1.2));
  fPop(at(6.6), 120, 860, () => thermoSoft(120, 860, 0.15, '#7fb6ff')); fPop(at(7.4), 920, 880, () => thermoSoft(920, 880, 0.9));
  grassSoft(920);
  fLabel('cool', 130, 560, 125, 650, at(7.0), { color: '#5a7fd6', size: 44, fill: '#f4f1ff' }); fLabel('hot!', 700, 860, 900, 760, at(7.8), { color: '#e2553b', size: 44, fill: '#f4f1ff' });
}
// ---- 2. 8:45 pm: dusk; it walks up a leaf. Not a fly: a beetle
function sWake() {
  meadow(DUSK, { stars: false, moon: false, swarm: false });
  const climb = sm(TT, at(0.6), at(5.0));
  fShape([[330, 960], [380 + Math.sin(TT * 1.2) * 8, 520], [470, 470], [430, 560], [390, 960]], '#5e4688', { line: false });
  bug(lerp(220, 400, climb), lerp(940, 560, climb), 0.9, { walk: climb < 1 ? 1 : 0, lit: 0.25 + 0.75 * sm(TT, at(6.0), at(7.0)), key: 'wake', mood: TT > at(6.0) ? 'happy' : 'smile' });
  grassSoft(940, DUSK.grass);
  fLens(760, 430, 160, popS(at(6.4)), () => { fSky('#2a2660'); bug(800, 560, 1.6, { lit: 1, key: 'lens', mood: 'happy' }); }, { glass: '#2a2660', handle: '#ffcf5a', rim: '#f4f1ff' });
  fLabel('a beetle!', 760, 220, 470, 520, at(2.6), { color: '#e2553b', fill: '#f4f1ff' });
}
// ---- 3. 9:00 pm: inside the lantern: luciferin + luciferase + oxygen + energy = light
function sChem() {
  fSky('#221f52', '#35326e');
  for (let i = 0; i < 18; i++) { const R = RNG('cb', i); fCirc(R.r(0, 1000), R.r(0, 1080), R.r(30, 80), '#2c2963', { line: false }); }
  const mx = 480, my = 540, k = sm(TT, at(4.4), at(7.6));
  const items = [[at(1.4), -300, -150, 'luciferin', () => fBlob(0, 70, { key: 'lu', w: 110, h: 130, body: 'ball', c: '#ffcf5a', mood: 'happy', pose: 'wave' })],
    [at(2.0), 300, -150, 'luciferase', () => fBlob(0, 70, { key: 'la', w: 110, h: 150, body: 'pill', c: '#ff7aa8', mood: 'focus', pose: 'point', dir: -1, hair: 'tuft' })],
    [at(4.4), -300, 210, 'oxygen', () => { fCirc(-26, 0, 34, '#7fb6ff', { line: false }); fCirc(26, 0, 34, '#7fb6ff', { line: false }); fText('O₂', 0, 14, 40, '#ffffff', { align: 'center', outline: false }); }],
    [at(4.4), 300, 210, 'energy', () => fShape([[-10, -60], [26, -60], [6, -6], [30, -6], [-20, 64], [-4, 10], [-28, 10]], '#ffcf5a', { line: false })]];
  for (const [t, dx, dy, name, fn] of items) { if (TT < t) continue; const p = popS(t), x = mx + dx * (1 - k), y = my + dy * (1 - k); ctx.save(); ctx.translate(x, y); ctx.scale(p * (1 - k * 0.6), p * (1 - k * 0.6)); fn(); ctx.restore(); if (k < 0.3) fText(name, x, y + 120, 40, '#f4f1ff', { align: 'center', outline: false }); }
  if (TT > at(7.6)) { const b = popS(at(7.6)); fGlow(mx, my, 460 * b, 1); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + TT * 0.3; fNoodle([mx + Math.cos(a) * 100 * b, my + Math.sin(a) * 100 * b], [mx + Math.cos(a) * 190 * b, my + Math.sin(a) * 190 * b], 14, GLOW); } fCirc(mx, my, 76 * b, GLOW, { line: false }); fFace(mx, my, b * 1.1, 'happy', 'light'); fPop(at(9.0), 860, 840, () => thermoSoft(860, 840, 0.12, '#7fb6ff')); }
}
// ---- 4. 9:10 pm: the switch: oxygen through breathing tubes, on and off
function sSwitch() {
  meadow(NIGHT, { swarm: false });
  const on = Math.sin((TT - at(0)) * Math.PI / 2) > 0 ? 1 : 0;
  bug(520, 820, 2.0, { lit: on ? 1 : 0.08, key: 'sw', mood: on ? 'happy' : 'focus' });
  for (const [sx, sy] of [[470, 520], [450, 580]]) fNoodle([sx, sy], [450, 700], 9, '#7fb6ff', 40);
  if (on) for (let i = 0; i < 5; i++) { const u = mod(TT * 1.5 + i / 5, 1); fCirc(lerp(470, 450, u), lerp(520, 700, u), 10, '#bfe0ff', { line: false }); }
  fRect(780, 780, 130, 74, 37, on ? '#ffcf5a' : '#4a4785', { line: false }); fCirc(on ? 873 : 817, 817, 30, '#f4f1ff', { line: false });
  grassSoft(940);
  fLabel('breathing tubes', 230, 330, 460, 540, at(1.6), { color: '#5a7fd6', fill: '#f4f1ff' });
}
// ---- 5. 9:30 pm: the flash code; males fly and flash, a female answers
function sCode() {
  meadow(NIGHT, { swarm: false });
  const t = TT - at(0), code = (p) => { const c = mod(p, 4); return (c < 0.25 || (c > 0.5 && c < 0.75) || (c > 1.0 && c < 1.25)) ? 1 : 0; };
  for (let i = 0; i < 3; i++) { const x = mod(120 + i * 280 + t * 40, 980) - 60, y = 380 + i * 80 + Math.sin(t + i) * 30; bug(x, y, 0.5, { fly: true, lit: code(t + i * 0.2), key: 'm' + i, mood: 'happy' }); }
  const ans = mod(t, 4) > 2.0 && mod(t, 4) < 2.3 ? 1 : 0;
  fShape([[560, 960], [600 + Math.sin(TT * 1.2) * 8, 760], [690, 720], [640, 790], [620, 960]], '#2f2d68', { line: false });
  bug(640, 780, 0.6, { lit: ans, key: 'fem', hair: 'curl', c: '#8a6cc8', mood: ans ? 'happy' : 'smile', dir: -1 });
  grassSoft(960);
  const bar = (x0, y0, on, w) => fRect(x0, y0, w, 26, 13, on ? GLOW : '#3b3878', { line: false });
  [0, 1, 2].forEach((i) => bar(100 + i * 70, 1010, code(t) && Math.floor(mod(t, 4) * 2) === i, 50)); bar(400, 1010, ans, 90);
  fLabel('flash, flash, flash', 300, 220, 220, 360, at(2.0), { color: '#a07a10', fill: '#f4f1ff' });
  fLabel('she answers', 850, 600, 660, 690, at(7.6), { color: '#d0478a', fill: '#f4f1ff' });
}
// ---- 6. 10:00 pm: 4 in 10, not "almost all"; still far cooler than a bulb
function sCold() {
  meadow(NIGHT, { swarm: false });
  for (let i = 0; i < 10; i++) { const lit = i < 4 && TT > at(4.4) + i * 0.25 && (TT < at(6.0) || Math.floor((TT - at(6.0)) * 2) % 4 === i || Math.floor((TT - at(6.0)) * 2) % 8 >= 4), x = 120 + (i % 5) * 150, y = 420 + Math.floor(i / 5) * 160; fPop(at(1.4) + i * 0.08, x, y, () => { if (lit) fGlow(x, y, 90, 1); fCirc(x, y, 42, lit ? GLOW : '#45428a', { line: false }); if (lit) fFace(x, y, 0.55, 'happy', 'ph' + i, { blush: false }); }); }
  fPop(at(8.6), 520, 900, () => { thermoSoft(260, 900, 0.15, '#7fb6ff'); thermoSoft(780, 900, 0.9); });
  fPop(at(10.4), 640, 780, () => bulbSoft(640, 780, 0.6));
  { const u = mod((TT - at(0)) * 0.09, 1); bug(lerp(-100, 1050, u), 280 + Math.sin(TT * 1.4) * 40, 0.4, { fly: true, lit: Math.sin(TT * 3) > 0 ? 1 : 0.2, key: 'cx', mood: 'happy' }); }
  if (TT > at(2.4)) fPop(at(2.4), 840, 420, () => { fText('88%?', 840, 440, 64, '#b9b5e6', { align: 'center', outline: false }); if (TT > at(4.4)) fNoodle([760, 420], [920, 400], 10, '#ff6b4a'); });
  fLabel('4 in 10 make a flash', 480, 250, 270, 380, at(4.8), { color: '#a07a10', fill: '#f4f1ff' });
}
// ---- 7. 10:30 pm: danger: bats, frogs, spiders; many fireflies taste bitter
function sDanger() {
  meadow(NIGHT, { swarm: false });
  const bx = lerp(1150, -250, mod((TT - at(0)) * 0.22, 1)), by = 260 + Math.sin(TT * 2) * 60, w = Math.sin(TT * 10) * 30;
  fShape([[bx, by], [bx - 70, by - 30 - w], [bx - 130, by + 10 - w * 0.5], [bx - 80, by + 10], [bx - 40, by + 30], [bx, by + 20], [bx + 40, by + 30], [bx + 80, by + 10], [bx + 130, by + 10 - w * 0.5], [bx + 70, by - 30 - w]], '#4a4785', { line: false });
  fCirc(bx, by + 6, 30, '#4a4785', { line: false }); fFace(bx, by + 8, 0.6, 'focus', 'bat', { blush: false });
  { const d = sm(TT, at(4.0), at(5.6)) * 260 - sm(TT, at(10.0), at(11.4)) * 220; fNoodle([820, 60], [820, 300 + d], 3, 'rgba(230,235,255,0.6)'); fCirc(820, 300 + d, 30, '#4a4785', { line: false }); for (const k of [-1, 1]) for (let j = 0; j < 3; j++) fNoodle([820 + k * 20, 296 + d + j * 10], [820 + k * 50, 284 + d + j * 18], 5, '#4a4785', k * 6); fFace(820, 302 + d, 0.42, 'focus', 'spider', { blush: false }); }
  fCirc(330, 900, 150, '#2f6b5a', { ry: 40, line: false });
  const spit = TT > at(9.0), hop = Math.max(0, Math.sin(clamp((TT - at(3.0)) / 0.6) * Math.PI)) * 40 + Math.max(0, Math.sin(clamp((TT - at(5.6)) / 0.6) * Math.PI)) * 40;
  fBlob(330, 890 - hop, { key: 'frog', w: 190, h: 150, body: 'ball', c: '#6cc56a', mood: spit ? 'ouch' : 'focus', pose: spit ? 'cheer' : 'stand', look: [1, -0.5] });
  const fx = spit ? 420 + sm(TT, at(9.0), at(10.0)) * 200 : 470, fy = spit ? 760 - sm(TT, at(9.0), at(10.0)) * 200 : 760;
  if (!spit) fNoodle([360, 790], [lerp(360, fx, sm(TT, at(7.6), at(8.6))), lerp(790, fy, sm(TT, at(7.6), at(8.6)))], 14, '#ff7aa8');
  bug(fx, fy + 60, 0.45, { lit: 1, key: 'dg', mood: spit ? 'happy' : 'wow', fly: spit });
  for (let i = 0; i < 5; i++) { const R = RNG('df', i), on = Math.sin(TT * 2.6 + i * 1.3) > 0.3 ? 1 : 0; fGlow(R.r(560, 950), R.r(440, 800), 60, on); }
  grassSoft(960);
  if (spit) fLabel('yuck, bitter!', 170, 560, 310, 720, at(9.2), { color: '#d0478a', fill: '#f4f1ff' });
}
// ---- 8. the hush
function sHush() { meadow(NIGHT, { swarm: false }); fGlow(480, 680, 80, 0.6 + 0.4 * Math.sin(TT * 2)); grassSoft(940); }
// ---- 9. 11:00 pm: the twist: a femme fatale fakes the answer
function sTwist() {
  meadow({ ...NIGHT, sky0: '#24164a', sky1: '#4a2f78' }, { swarm: false });
  const t = TT - HIT, fake = mod(t, 2) < 0.3 ? 1 : 0, down = sm(TT, HIT + 4.0, HIT + 8.0);
  fShape([[300, 960], [360 + Math.sin(TT * 1.2) * 8, 700], [460, 660], [400, 740], [380, 960]], '#2f2d68', { line: false });
  bug(400, 740, 0.85, { lit: fake, key: 'ff2', c: '#8a3e7a', mood: 'focus', hair: 'curl', dir: 1 });
  if (down < 1) bug(lerp(860, 540, down), lerp(260, 560, down), 0.55, { fly: true, lit: mod(t, 1.2) < 0.25 ? 1 : 0, key: 'male', mood: 'happy', dir: -1 });
  else fPop(HIT + 8.0, 520, 560, () => { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; fNoodle([520 + Math.cos(a) * 30, 560 + Math.sin(a) * 30], [520 + Math.cos(a) * 74, 560 + Math.sin(a) * 74], 10, '#ff7aa8'); } fText('GULP', 520, 470, 70, '#ff7aa8', { align: 'center', outline: false, font: '"Baloo 2", sans-serif' }); });
  grassSoft(960);
  fLabel('a fake answer', 720, 860, 420, 640, at(4.0), { color: '#d0478a', fill: '#f4f1ff' });
}
// ---- 10. 6:00 am: dawn (the autumn reference): amber hills, round red trees, cypresses, falling leaves
function sEnd() {
  fSky(DAWN.sky0, DAWN.sky1);
  fLayer(0.04, () => { const sy = 760 - sm(TT, at(0.5), at(11.5)) * 220; fGlow(480, sy, 260, 0.8, '255,220,150'); fCirc(480, sy, 100, '#fff2c8', { line: false }); });
  fLayer(0.1, () => { fCloud2(300, 160, 1.0, { speed: 8, c: '#fff6ea' }); });
  fHills([{ y: 660, c: '#e9b48c', amp: 50, f: 0.005, ph: 1, d: 0.1 }]);
  fLayer(0.2, () => { fCone(250, 650, 0.9, DAWN.tree2); fTreeRound(140, 660, 0.8, { c: '#f08a4b' }); fCone(780, 640, 1.0, DAWN.tree2); });
  fHills([{ y: 780, c: DAWN.hill1, amp: 50, f: 0.006, ph: 2.4, d: 0.3 }]);
  fLayer(0.38, () => { fTreeRound(760, 800, 1.1, { c: DAWN.tree }); fBush(90, 820, 0.9, '#d9733a'); });
  fHills([{ y: 900, c: DAWN.hill2, amp: 30, f: 0.008, ph: 4, d: 0.6 }]);
  for (let i = 0; i < 6; i++) { const R = RNG('dg', i), x = R.r(80, 920), y = R.r(600, 860), f = 1 - sm(TT, at(1.0) + i * 1.3, at(2.0) + i * 1.3); fGlow(x, y, 46, f * 0.8); }
  { const u = clamp((TT - at(1.8)) / 5.5); if (u > 0 && u < 1) bug(lerp(-80, 470, u), 600 + Math.sin(u * 9) * 40, 0.45, { fly: true, lit: (1 - u) * 0.8, key: 'home', mood: 'sleep' }); }
  bug(470, 900, 0.8, { lit: 0.12, key: 'end', mood: TT > at(7.4) ? 'sleep' : 'happy', pose: TT > at(7.4) ? 'stand' : 'wave' });
  fLeaves(10, ['#e2553b', '#f08a4b', '#c98a2f'], { x0: 0, x1: 1000, key: 'dawn' });
  fBirds(150, 260, 3, { speed: 40 }); if (TT > at(5.0)) fBirds(-200 + (TT - at(5.0)) * 70, 340, 4, { speed: 0 });
}

// ---- the lettering (unchanged)
function cHook(at) {
  title('Light without heat?', at(0.8));
  write("you've never felt one get hot", CL, 420, 46, at(1.8));
  bigNum('~90%', "of an old bulb's power becomes heat", CCX, 640, at(8.0), CH.accent, 110);
  write('so how does a firefly do it?', CL, 880, 44, at(9.6), { color: CH.green, weight: 700 });
}

function cWake(at) {
  title('Not a fly at all', at(0.6));
  write('fireflies are beetles', CL, 430, 52, at(2.4), { color: CH.green, weight: 700 });
  write('the light comes from a special organ', CL, 620, 40, at(6.6));
  write('at the tip of the belly', CL, 690, 40, at(7.8));
}

function cChem(at) {
  title('Inside the lantern', at(0.6));
  write('luciferin + luciferase', CL, 420, 48, at(2.0), { weight: 700 });
  write('+ oxygen + a little energy', CL, 500, 44, at(4.4));
  write('= light', CL, 680, 72, at(7.6), { color: CH.green, weight: 700 });
  write('and very little heat', CL, 780, 46, at(9.0), { color: CH.blue });
}

function cSwitch(at) {
  title('A switch made of air', at(0.6));
  write('tiny breathing tubes bring air', CL, 420, 44, at(1.6));
  write('oxygen in = glow', CL, 560, 52, at(4.0), { color: CH.green, weight: 700 });
  write('oxygen cut off = dark', CL, 660, 52, at(8.0), { weight: 700 });
}

function cCode(at) {
  title('A secret flash code', at(0.6));
  write('every species has its own:', CL, 420, 44, at(1.6));
  write('how many, how long, how far apart', CL, 500, 40, at(3.0));
  write('the males fly and flash', CL, 640, 46, at(4.4));
  write('a female answers, right on time', CL, 740, 46, at(7.6), { color: CH.green, weight: 700 });
}

function cCold(at) {
  title('How good is the light?', at(0.6));
  write('old textbooks: almost every reaction', CL, 420, 40, at(1.6));
  bigNum('~4 in 10', 'measured in 2008', CCX, 590, at(4.4), CH.green, 100);
  write("still far cooler than a bulb", CL, 820, 46, at(8.6), { weight: 700 });
}

function cDanger(at) {
  title('Glowing is risky', at(0.6));
  write('bats, frogs and spiders hunt at night', CL, 420, 40, at(1.6));
  write('but many fireflies taste bitter', CL, 600, 44, at(4.4), { weight: 700 });
  write('the light means: "don\'t eat me"', CL, 720, 46, at(9.0), { color: CH.green, weight: 700 });
}

function cTwist(at) {
  stamp('FAKE', CCX, 300, at(0.4));
  write('some females fake another', CL, 480, 44, at(1.6));
  write("species' answer...", CL, 550, 44, at(2.6));
  write('the male flies in: dinner', CL, 680, 50, at(6.0), { color: CH.accent, weight: 700 });
  write('"femme fatale" fireflies', CL, 840, 50, at(8.4), { color: CH.green, weight: 700 });
}

function cEnd(at) {
  title('By dawn...', at(0.6));
  write('the lanterns go dark', CL, 420, 52, at(1.6), { weight: 700 });
  write('a little beetle rests', CL, 600, 46, at(4.4));
  write('ready to glow again tonight,', CL, 760, 44, at(8.6));
  write('with light that hardly gets warm', CL, 830, 44, at(9.4), { color: CH.accent, weight: 700 });
}
