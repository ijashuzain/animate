// How a Cloud Builds a Lightning Bolt: two places. The porch (the hook and the ending): a farmhouse at dusk, a family at
// the window, the lone tree tiny on a far hill about 3 km away. The field (everything else, real scale, metres, ground
// y = 0): the lone tree at x = 0, a barn with a lightning rod, a fence, cows, and the storm cloud from 1.5 to 11 km.
// Look: the user's references (refs/cloud-cutaway, strike-tree, storm-cloud-flat, branching-bolt).
const FONT = '"Lilita One", sans-serif';
const { lerp, clamp, tw, track, hash, noise } = K;
const C = {
  skyTop: '#121842', skyMid: '#2a2f6e', dusk: '#e0703a', dusk2: '#b04a6a', hill: '#2a2f5e', hill2: '#363b74', field: '#2f5a3a', field2: '#203f2c',
  cloud: { top: '#8a8fd0', mid: '#5a5ea8', under: '#2c2f66' }, inner: '#4c52a8', drop: '#5aa8ff', graupel: '#cfd3f4', crystal: '#a9b2ff',
  plus: '255,120,170', minus: '90,170,255', bolt: '160,140,255', leader: '170,140,255', warm: '#ffcf7a',
};
const TREE = { x: 0, h: 14 }, BARN = { x: 52 }, CLOUD = { cx: -200, base: 1500, w: 6200, top: 11000 };

// ---------- the sky behind everything (screen space): night blue to an orange dusk band at the horizon ----------
function skyAndHills(t, horizonY, flash) {
  P.screen((ctx) => {
    const hy = clamp(horizonY, 200, 1300), g = ctx.createLinearGradient(0, 0, 0, hy + 40);
    g.addColorStop(0, P.mixc(C.skyTop, '#8f88d8', flash * 0.6)); g.addColorStop(0.62, P.mixc(C.skyMid, '#b4a8f0', flash * 0.6)); g.addColorStop(0.9, P.mixc(C.dusk2, '#ffd0e0', flash * 0.4)); g.addColorStop(1, P.mixc(C.dusk, '#ffe0b0', flash * 0.4));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    for (let i = 0; i < 40; i++) { const y = hash(i, 2) * hy * 0.5; ctx.globalAlpha = 0.5 * (0.4 + 0.6 * Math.sin(t * 1.5 + i) ** 2) * (1 - flash); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hash(i, 1) * 1920, y, 1.2, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    // two layers of far rolling hills sitting on the horizon
    for (const [k, col, amp, sd] of [[0, C.hill2, 70, 1], [1, C.hill, 45, 4]]) { ctx.fillStyle = P.mixc(col, '#8a86d0', flash * 0.35); ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 40) ctx.lineTo(x, hy - amp * (0.5 + 0.5 * noise(x * 0.002 + sd, sd)) - (1 - k) * 25); ctx.lineTo(1920, 1080); ctx.fill(); }
  });
}
// ---------- the field (metres) ----------
function field(t, flash) {
  P.rect(-60000, -400, 120000, 400, P.lin(0, 0, 0, -60, P.mixc(C.field, '#7ab08a', flash * 0.4), C.field2));
  for (let i = -60; i <= 60; i++) { const x = i * 23 + hash(i, 5) * 10; Nature.grass(t, x, 0, 1.2 + hash(i, 6), { col: '#3f7a4a' }); }
  // fence posts with rails, west of the tree
  for (let i = 0; i < 7; i++) { const x = -70 + i * 8; P.rect(x - 0.15, 0, 0.3, 1.4, '#4a3a30'); }
  P.rect(-70, 1.0, 48, 0.12, '#5a483c'); P.rect(-70, 0.5, 48, 0.12, '#5a483c');
}
// the cows by the barn (they huddle, heads down, some looking up at the sky)
function cows(t, look) {
  for (const [x, dir, sd, tint] of [[70, -1, 1, '#f2ede4'], [78, 1, 2, '#e8d8c4'], [86, -1, 3, '#f2ede4']]) Animals.quad(t, x, 0, 0.013, Object.assign({}, Animals.SPEC.cow, { col: tint }), { dir, seed: sd, look: look ? [0, 1] : undefined });
}
// the screen-space storm ceiling (when the camera is low and the cloud base is out of frame)
function ceiling(t, a, flash, baseY = 120) {
  if (a <= 0) return; const by = clamp(baseY, 170, 700);
  P.screen((ctx) => { ctx.globalAlpha = a; ctx.fillStyle = P.mixc('#1c2050', '#9a96e0', flash * 0.6); ctx.fillRect(0, 0, 1920, Math.max(0, by - 60)); for (let row = 0; row < 3; row++) for (let i = -1; i < 14; i++) { const x = i * 160 + ((t * 6 * (row + 1)) % 160) + row * 50, y = by - 120 + row * 60 + hash(i, row) * 30, r = 110 + hash(i, row + 9) * 50; ctx.fillStyle = P.mixc(['#1c2050', '#262a62', '#30357a'][row], '#9a96e0', flash * 0.6); ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; });
}
// ---------- the cloud's inside (the cutaway): drops low, soft hail (graupel) in the middle, ice crystals high ----------
// each particle: [kind, side -1..1, u (height 0..1), seed]
const PARTS = (() => { const out = []; for (let i = 0; i < 150; i++) { const u = hash(i, 31), kind = u < 0.32 ? 'drop' : u < 0.62 ? (hash(i, 32) > 0.35 ? 'graupel' : 'drop') : (hash(i, 33) > 0.25 ? 'crystal' : 'graupel'); out.push([kind, hash(i, 34) * 2 - 1, u, i]); } return out; })();
function particle(kind, x, y, px, charge, a) {
  const r = px / P.k;
  P.alpha(a, () => {
    if (kind === 'drop') { P.poly([[x, y + r * 1.5], [x - r * 0.7, y - r * 0.1], [x + r * 0.7, y - r * 0.1]], C.drop); P.circle(x, y - r * 0.2, r * 0.75, C.drop); }
    else if (kind === 'graupel') { P.circle(x, y, r * 1.1, C.graupel); P.circle(x - r * 0.35, y + r * 0.35, r * 0.35, 'rgba(255,255,255,0.7)'); }
    else if (kind === 'crystal') { const pts = []; for (let k = 0; k < 6; k++) pts.push([x + Math.cos(k * Math.PI / 3 + 0.5) * r * 1.2, y + Math.sin(k * Math.PI / 3 + 0.5) * r * 1.2]); P.poly(pts, 'rgba(169,178,255,0.75)'); P.ribbon([pts[0], pts[3]], r * 0.12, 'rgba(255,255,255,0.6)'); P.ribbon([pts[1], pts[4]], r * 0.12, 'rgba(255,255,255,0.6)'); }
    if (charge) { const pos = charge > 0, gc = pos ? C.plus : C.minus; P.glow(x, y, r * 3, gc, 0.5 * Math.abs(charge)); P.alpha(Math.abs(charge), () => { P.ribbon([[x - r * 0.6, y], [x + r * 0.6, y]], r * 0.28, `rgb(${gc})`); if (pos) P.ribbon([[x, y - r * 0.6], [x, y + r * 0.6]], r * 0.28, `rgb(${gc})`); }); }
  });
}
// an updraft arrow (soft peach) curving up, flowing
function updraft(x0, y0, len, a, t, seed) {
  if (a <= 0) return; const ph = (t * 0.35 + hash(seed, 3)) % 1, y = y0 + ph * len * 0.6, bend = (hash(seed, 4) - 0.5) * len * 0.25;
  const pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([x0 + Math.sin(u * 1.6) * bend, y + u * len * 0.45]); }
  const fade = Math.sin(ph * Math.PI) * a, w = 7 / P.k;
  P.alpha(fade, () => { P.ribbon(pts, [w * 0.3, w, w * 1.2, w * 1.2, w * 1.2, w * 1.2, w * 1.2, w, w, w, w * 0.8], 'rgba(255,170,130,0.75)'); const [ex, ey] = pts[10], [px, py] = pts[8], an = Math.atan2(ey - py, ex - px); P.poly([[ex + Math.cos(an) * w * 3, ey + Math.sin(an) * w * 3], [ex + Math.cos(an + 2.4) * w * 2.6, ey + Math.sin(an + 2.4) * w * 2.6], [ex + Math.cos(an - 2.4) * w * 2.6, ey + Math.sin(an - 2.4) * w * 2.6]], 'rgba(255,170,130,0.85)'); });
}
// a measuring line on the left of the cloud, from the ground to 10 km
function ruler(x, top, a) {
  if (a <= 0) return; const w = 3 / P.k;
  P.alpha(a, () => { P.ribbon([[x, 0], [x, top]], w, 'rgba(255,255,255,0.7)'); for (let km = 0; km <= top / 1000; km += 2) P.ribbon([[x - 6 / P.k, km * 1000], [x + 6 / P.k, km * 1000]], w, 'rgba(255,255,255,0.7)'); });
}
// the farmhouse for the porch view (metres): walls, roof, a porch, a lit window (the family inside), the door
function farmhouse(t, x, lit, shake) {
  // a farmhouse in a three-quarter view (metres): the front gable faces us, the side wall runs back to the right in
  // shade; clapboard siding, a shingled roof with an overhang shadow, stone foundation, chimney, porch with steps,
  // railing and a lamp, trimmed windows; dusk light from the left, warm light from the windows
  const D = [3.4, 0.9];   // the depth direction (back and up, to the right)
  P.at(x + shake, 0, 0, 1, 1, () => {
    const front = '#efe2c8', frontD = '#d6c4a4', side = '#a99a8a', sideD = '#8a7c70', trim = '#f6f0e4', roof = '#4e4262', roofD = '#372d4a', roofL = '#6a5c80';
    // ground shadow and warm spill on the grass
    P.poly([[-6.6, 0], [6 + D[0] + 0.6, D[1] * 0.4], [6 + D[0] + 2.2, -0.6], [-6.2, -1.0]], 'rgba(10,10,30,0.28)');
    P.glow(-3.2, -0.2, 3.2, '255,190,110', 0.18);
    // the side wall (in shade), its siding, a side window glowing
    const sw = [[6, 0], [6 + D[0], D[1]], [6 + D[0], 5.6 + D[1]], [6, 5.6]];
    P.poly(sw, P.lin(6, 0, 6 + D[0], 0, side, sideD));
    for (let i = 1; i < 10; i++) P.ribbon([[6, i * 0.56], [6 + D[0], i * 0.56 + D[1]]], 0.04, 'rgba(0,0,0,0.12)');
    P.poly([[7.2, 2.0 + 0.32], [8.4, 2.0 + 0.64], [8.4, 3.8 + 0.64], [7.2, 3.8 + 0.32]], '#ffcf7a'); P.ribbon([[7.8, 2.48], [7.8, 4.28]], 0.08, trim);
    P.glow(7.8, 3.3, 1.6, '255,200,120', 0.3);
    P.poly([[6, 0], [6 + D[0], D[1]], [6 + D[0], D[1] + 0.5], [6, 0.5]], '#6e6466');                       // foundation, side
    // the side roof plane (going back), shingle rows, the ridge
    const ridge = [0, 9.3], eaveR = [7.1, 5.3];
    P.poly([ridge, [ridge[0] + D[0], ridge[1] + D[1]], [eaveR[0] + D[0], eaveR[1] + D[1]], eaveR], P.lin(0, 9.3, 7, 5.3, roofL, roof));
    for (let k = 1; k < 7; k++) { const u = k / 7, p0 = [lerp(ridge[0], eaveR[0], u), lerp(ridge[1], eaveR[1], u)]; P.ribbon([p0, [p0[0] + D[0], p0[1] + D[1]]], 0.05, 'rgba(0,0,0,0.18)'); }
    P.ribbon([ridge, [ridge[0] + D[0], ridge[1] + D[1]]], 0.14, roofL);
    // the chimney (on the side roof), brick with a cap, a curl of smoke
    P.rect(3.9, 7.6, 0.9, 2.9, P.lin(3.9, 0, 4.8, 0, '#8a4a3a', '#6a3428')); P.rect(3.8, 10.4, 1.1, 0.25, '#5a2e24');
    for (let i = 0; i < 4; i++) P.rect(3.9, 8.0 + i * 0.6, 0.9, 0.05, 'rgba(0,0,0,0.2)');
    for (let i = 0; i < 3; i++) { const u = (t * 0.25 + i / 3) % 1; P.alpha(Math.sin(u * Math.PI) * 0.18, () => P.circle(4.35 + u * 1.2 + Math.sin(t + i) * 0.2, 10.9 + u * 2.0, 0.22 + u * 0.35, '#c8c4d8')); }
    // the front wall: clapboard siding (light on the left), foundation stones
    P.rect(-6, 0, 12, 5.6, P.lin(-6, 0, 6, 0, front, frontD));
    for (let i = 1; i < 10; i++) { P.rect(-6, i * 0.56, 12, 0.045, 'rgba(0,0,0,0.10)'); P.rect(-6, i * 0.56 + 0.045, 12, 0.03, 'rgba(255,255,255,0.18)'); }
    P.rect(-6.1, 0, 12.2, 0.5, '#7a7072'); for (let i = 0; i < 14; i++) P.rect(-6 + i * 0.88 + (i % 2) * 0.2, 0.05, 0.78, 0.4, i % 3 ? '#8a8082' : '#6e6466', { r: 0.08 });
    // corner boards
    P.rect(-6.1, 0.5, 0.25, 5.1, trim); P.rect(5.85, 0.5, 0.25, 5.1, P.mixc(trim, '#000000', 0.12));
    // the gable: wall triangle with siding, a round attic window, the roof's front edge with a deep overhang shadow
    P.poly([[-6, 5.6], [6, 5.6], [0, 9.0]], P.lin(-6, 0, 6, 0, front, frontD));
    P.clip(() => P.trace([[-6, 5.6], [6, 5.6], [0, 9.0]], true, 0), () => { for (let i = 0; i < 6; i++) P.rect(-6, 5.6 + i * 0.56, 12, 0.045, 'rgba(0,0,0,0.10)'); });
    P.poly([[-6, 5.6], [6, 5.6], [5.5, 5.3], [-5.5, 5.3]], 'rgba(0,0,0,0.0)');
    P.poly([[-6.4, 5.6], [0, 9.2], [0, 8.75], [-5.7, 5.55]], 'rgba(20,10,30,0.25)');                         // overhang shadow
    P.circle(0, 7.2, 0.62, trim); P.circle(0, 7.2, 0.48, lit ? '#ffcf7a' : '#3a3450'); P.ribbon([[-0.48, 7.2], [0.48, 7.2]], 0.07, trim);
    P.ribbon([[-7.1, 5.3], [0, 9.4], [7.1, 5.3]], 0.42, roofD); P.ribbon([[-7.1, 5.42], [0, 9.55], [7.1, 5.42]], 0.12, roofL);
    // the porch: a deck, two steps, posts, railing, a shallow roof, a lamp by the door
    P.rect(-2.8, 0.5, 5.6, 0.3, '#8a6a52'); P.rect(-1.0, 0, 2.0, 0.25, '#7a5a44'); P.rect(-1.2, 0.25, 2.4, 0.25, '#8a6a52');
    P.rect(-1.0, 0.8, 2.0, 3.0, '#6a3e2c', { r: 0.1 }); P.rect(-0.8, 2.3, 1.6, 1.2, 'rgba(255,207,122,0.55)', { r: 0.06 }); P.circle(0.65, 1.9, 0.09, '#e8c060');
    P.ribbon([[-1.0, 3.8], [1.0, 3.8]], 0.12, trim);
    for (const k of [-2.6, 2.6]) { P.rect(k - 0.1, 0.8, 0.2, 3.4, trim); P.rect(k - 0.02, 0.8, 0.04, 3.4, 'rgba(0,0,0,0.12)'); }
    for (const side2 of [-1, 1]) { P.rect(side2 > 0 ? 1.0 : -2.6, 1.8, 1.6, 0.1, trim); for (let i = 0; i < 6; i++) P.rect((side2 > 0 ? 1.1 : -2.5) + i * 0.27, 0.8, 0.06, 1.0, trim); }
    P.poly([[-3.2, 4.2], [3.2, 4.2], [2.9, 4.65], [-2.9, 4.65]], roofD); P.rect(-3.2, 4.05, 6.4, 0.15, trim);
    P.poly([[-3.0, 4.05], [3.0, 4.05], [2.6, 3.75], [-2.6, 3.75]], 'rgba(20,10,30,0.25)');
    P.rect(1.25, 2.9, 0.22, 0.34, '#3a3030'); P.circle(1.36, 3.0, 0.11, '#ffe0a0'); P.glow(1.36, 3.0, 1.4, '255,210,140', 0.55);
    // bushes along the front (one soft shape each: dark under, body, light top)
    for (const [bx, br] of [[-5.2, 0.9], [-3.6, 0.7], [3.7, 0.75], [5.3, 0.95]]) { P.circle(bx, br * 0.55, br, '#1f3a2a', { ry: br * 0.7 }); P.circle(bx, br * 0.7, br * 0.92, '#2f5a3a', { ry: br * 0.62 }); P.circle(bx - br * 0.25, br * 0.95, br * 0.45, '#3f7048', { ry: br * 0.28 }); }
  });
}
// the family at the window (drawn into the window's clip): an adult and a kid looking out, warm light behind them
function windowWithFamily(t, x, shake, look) {
  const wx = x - 4.4 + shake, wy = 1.7, ww = 2.4, wh = 2.2;
  P.rect(wx - 0.15, wy - 0.15, ww + 0.3, wh + 0.3, '#f2ece2');
  P.clip(() => { P.ctx.beginPath(); P.ctx.rect(wx, wy, ww, wh); }, () => {
    P.rect(wx, wy, ww, wh, P.lin(0, wy, 0, wy + wh, '#ffb860', '#ffe0a0'));
    P.at(0, 1.35, 0, 1, 1, () => { Cast.person(t, wx + 0.75, 1.5, { kid: false, shirt: '#4f7fc4', pose: 'stand', look, seed: 1 }); Cast.person(t, wx + 1.75, 1.25, { kid: true, shirt: '#e35d4f', pose: 'stand', look, seed: 4 }); });
  });
  P.rect(wx + ww / 2 - 0.05, wy, 0.1, wh, '#f2ece2'); P.rect(wx, wy + wh / 2 - 0.05, ww, 0.1, '#f2ece2');
  P.rect(wx - 0.35, wy - 0.3, ww + 0.7, 0.18, '#e8e0d0'); P.rect(wx - 0.35, wy - 0.12, ww + 0.7, 0.06, 'rgba(0,0,0,0.2)');
  P.rect(wx - 0.25, wy + wh + 0.15, ww + 0.5, 0.2, '#e8e0d0');
  for (const sx of [wx - 0.75, wx + ww + 0.2]) { P.rect(sx, wy - 0.1, 0.55, wh + 0.2, '#3f6a6a'); for (let i = 0; i < 6; i++) P.rect(sx + 0.06, wy + i * 0.38, 0.43, 0.06, 'rgba(0,0,0,0.2)'); }
  P.glow(wx + ww / 2, wy + wh / 2, 3.2, '255,200,120', 0.35);
  return [wx + ww / 2, wy + wh + 0.4];
}
