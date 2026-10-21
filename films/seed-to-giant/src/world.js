// Seed to Giant: the props and characters (drawn in local units; the film places and scales them).
// Look: Kurzgesagt-inspired flat vector, no outlines, gradients, rim light, glows. Colours in C.
const C = {
  seedBody: '#7a4a2a', seedWing: '#d9b483', rice: '#f4efe2',
  coneGreen: '#5f8f3a', coneBrown: '#8a5631', coneInside: '#3a2416',
  bark: '#a24f2c', barkDark: '#6e2f1b', barkLight: '#c9673a', char: '#2a1b1a',
  leaf: '#3b7a3c', leafLight: '#62a454', leafDark: '#24522f',
  ash: '#8d8a8f', ashLight: '#b7b3b6', soil: '#5a3a26', soilDeep: '#3a2418', stone: '#7a6a5e',
  skin: '#f2c29b', shirt: '#ff7b54', pants: '#3b4a8a', hair: '#3a2a22',
  wall: '#f6e7c8', roof: '#d9534f', window: '#ffd66b', whale: '#4f6fa8', whaleBelly: '#a9c2e6',
  glass: '#5b8fc9', glassLight: '#9cc6ee',
};
// the winged seed, ~5 x 4 units (mm), centred; spin (radians) fakes the helicopter turn by squashing x
function drawSeed(x, y, s = 1, spin = 0, rot = 0) {
  const sx = Math.cos(spin) * 0.85 + 0.15 * Math.sign(Math.cos(spin) || 1);
  P.at(x, y, rot, s * sx, s, () => {
    P.lit(P.blobPts(0, 0, 2.6, 2.0, 10, 0.08, 4), C.seedWing, { d: 0.12, rim: 'rgba(255,255,255,0.35)' });
    P.circle(0, 0, 2.3, 'rgba(255,250,230,0.18)', { ry: 1.7 });
    P.lit(P.blobPts(0, 0.1, 1.05, 1.5, 9, 0.06, 7), C.seedBody, { d: 0.25, rim: 'rgba(255,220,180,0.45)' });
  });
}
function drawRice(x, y, s = 1, rot = 0) {
  P.at(x, y, rot, s, s, () => { P.lit(P.blobPts(0, 0, 3.3, 1.35, 12, 0.04, 2), C.rice, { d: 0.18, shade: 'rgba(120,100,70,0.22)', rim: 'rgba(255,255,255,0.6)' }); P.circle(-1.2, 0.5, 0.9, 'rgba(255,255,255,0.5)', { ry: 0.25, rot: 0.1 }); });
}
// the cone (units mm, ~44 x 64), hanging from a twig. open 0..1 spreads the scales; burn 0..1 browns them;
// eyes: 0 asleep, 1 wide awake; look [x, y] pupils; heat 0..1 adds an orange underlight
function drawCone(t, o = {}) {
  const open = o.open ?? 0, burn = o.burn ?? 0, heat = o.heat ?? 0;
  // twig and needles (sequoia foliage: short awl-shaped scales along the twig)
  P.ribbon([[0, 28], [-3, 46], [-14, 70], [-40, 96], [-90, 118]], [5, 4.6, 4.2, 3.8, 3.2], '#6b4a2e');
  for (let i = 0; i < 26; i++) { const u = i / 25, x = K.lerp(-2, -90, u * u * 0.9 + u * 0.1), y = K.lerp(40, 118, u) - u * u * 8, a = (i % 2 ? 1 : -1) * (0.9 + 0.3 * K.hash(i, 3)); P.at(x, y, a, 1, 1, () => P.smooth([[0, 0], [3.5, 9], [0, 15], [-3.5, 9]], i % 3 ? C.leaf : C.leafLight)); }
  const rx = 22 + open * 7, ry = 32 + open * 4;
  P.circle(0, 0, rx * 0.92, C.coneInside, { ry: ry * 0.95 });
  const col = P.mixc(C.coneGreen, C.coneBrown, burn);
  for (let i = 0; i < 9; i++) {
    const v = -0.86 + i * 0.215, y = v * ry, w = rx * Math.sqrt(Math.max(0, 1 - v * v));
    for (let j = -4; j <= 4; j++) {
      const th = j * 0.38 + (i % 2) * 0.19, c = Math.cos(th); if (c < 0.12) continue;
      const x = w * Math.sin(th), sw = 7.2 * c * (1 - open * 0.25), sh = 5.6 * (1 - open * 0.2), ox = Math.sin(th) * open * 6, oy = v * open * 5;
      const pts = [[x + ox, y + oy + sh], [x + ox + sw, y + oy], [x + ox, y + oy - sh], [x + ox - sw, y + oy]];
      P.lit(pts.map(([px, py]) => [px, py]), P.mixc(col, '#2c4a1c', (1 - c) * 0.45), { d: 0.2, rim: 'rgba(255,255,220,0.22)', light: [-0.5, 0.85] });
      P.circle(x + ox, y + oy, 1.1 * c, 'rgba(30,20,10,0.45)', { ry: 0.5 });
    }
  }
  if (heat > 0) P.clip(() => { P.ctx.beginPath(); P.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); }, () => P.rect(-40, -40, 80, 40, P.lin(0, -ry, 0, 0, `rgba(255,140,40,${0.55 * heat})`, 'rgba(255,140,40,0)')));
  // face (kit/cast.js): asleep, then wide awake
  const eyes = o.eyes ?? 0;
  Cast.face(t, 0, 2, 30, { mood: eyes < 0.5 ? 'sleep' : 'wow', look: o.look ?? [0, 0], seed: 3, ink: '#24160c' });
}
// a young-to-ancient giant sequoia of height ht (m), standing at (x0, 0). Young: a narrow spire of drooping tiers.
// Old: the lower trunk is bare and red, the crown breaks into clumps. o.fade/o.haze: mix toward a haze colour (distance)
function drawTree(t, ht, o = {}) {
  if (ht <= 0) return;
  const hz = (c) => (o.fade ? P.mixc(c, o.haze, o.fade) : c), x0 = o.x ?? 0, seed = o.seed ?? 0;
  const age = K.clamp((ht - 8) / 60), wb = 0.004 + 0.085 * ht * (1 + 0.25 * K.clamp((ht - 40) / 44)), sway = (u) => x0 + Math.sin(t * 1.1 + u * 3 + seed) * 0.01 * ht * u * u;
  const n = 14, trunk = [], widths = [];
  for (let i = 0; i <= n; i++) { const u = i / n; trunk.push([sway(u), u * ht]); widths.push(wb * Math.pow(1 - u, 0.85) * (1 + 0.7 * Math.pow(1 - u, 8) * age) + 0.002); }
  const crown0 = K.lerp(0.06, 0.45, age), tiers = Math.round(K.lerp(6, 12, K.clamp(ht / 20)));
  const prof = (u) => { const v = K.clamp((u - crown0) / (1 - crown0)); return ht * (K.lerp(0.34, 0.2, age) * (1 - v) + age * 0.27 * Math.sin(Math.PI * Math.min(1, v * 1.1))); };
  P.ribbon(trunk, widths, P.lin(x0 - wb / 2, 0, x0 + wb / 2, 0, hz(C.barkLight), hz(C.bark), hz(C.barkDark)));
  if (ht > 1.5) for (let f = 0; f < 5; f++) { const fx = x0 + (f - 2) * wb * 0.17; P.ribbon([[fx, 0], [fx - x0 + sway(0.3), ht * 0.3], [fx - x0 + sway(0.6), ht * 0.62]], [wb * 0.04, wb * 0.028, 0.001], 'rgba(70,25,15,0.4)'); }
  for (let i = 0; i < tiers; i++) {
    const u = K.lerp(crown0, 0.93, i / (tiers - 1)), y = u * ht, w = prof(u) + ht * 0.03, cx = sway(u) + (K.hash(i, seed + 5) - 0.5) * w * 0.25 * age, droop = w * K.lerp(0.42, 0.18, age);
    const top = hz(C.leafLight), mid = hz(C.leaf), bot = hz(C.leafDark);
    if (age < 0.85) P.alpha(1 - age * 0.6, () => {
      const pts = [[cx - w, y - droop], [cx - w * 0.5, y + w * 0.12], [cx, y + w * 0.3], [cx + w * 0.5, y + w * 0.12], [cx + w, y - droop], [cx + w * 0.4, y - droop * 0.55], [cx, y - droop * 0.3], [cx - w * 0.4, y - droop * 0.55]];
      P.lit(pts, P.lin(cx, y + w * 0.3, cx, y - droop, top, mid, bot), { light: [-0.4, 0.9], shade: 'rgba(10,40,30,0.25)', rim: 'rgba(230,255,190,0.3)', d: 0.16 });
    });
    if (age > 0) for (let k = 0; k < 3; k++) { const kx = cx + (k - 1) * w * 0.62, ky = y + (k === 1 ? w * 0.18 : -droop * 0.2), r = w * (k === 1 ? 0.55 : 0.45); P.alpha(age, () => P.lit(P.blobPts(kx, ky, r, r * 0.62, 10, 0.22, i * 3 + k + seed), P.lin(kx, ky + r * 0.6, kx, ky - r * 0.6, top, mid, bot), { light: [-0.45, 0.9], shade: 'rgba(10,40,30,0.3)', rim: 'rgba(230,255,190,0.28)', d: 0.25 })); }
  }
  P.poly([[sway(1) - ht * 0.025, ht * 0.95], [sway(1), ht * 1.03], [sway(1) + ht * 0.025, ht * 0.95]], hz(C.leafLight));
}
// a kid (1.3 m tall) at (x, 0): waves; looks at a point (lx, ly)
function drawKid(t, x, look) { Cast.person(t, x, 1.3, { pose: 'wave', look, mood: 'happy', kid: true, seed: 2 }); }
function drawHouse(t, x) {
  P.at(x, 0, 0, 1, 1, () => {
    P.rect(-4, 0, 8, 5.6, P.lin(-4, 0, 4, 0, '#fff3dc', C.wall, '#e6d2ad'));
    P.poly([[-4.6, 5.4], [4.6, 5.4], [0, 8.6]], P.lin(0, 5.4, 0, 8.6, '#b8403c', C.roof));
    P.rect(2, 6.2, 0.9, 2, '#8a4a3a'); for (let i = 0; i < 4; i++) { const u = ((t * 0.4 + i / 4) % 1); P.circle(2.45 + Math.sin(u * 6 + i) * 0.3 * u, 8.4 + u * 3, 0.3 + u * 0.7, `rgba(235,235,240,${0.5 * (1 - u)})`); }
    for (const [wx, wy] of [[-2.6, 1], [1.4, 1], [-2.6, 3.4], [1.4, 3.4]]) { P.rect(wx, wy, 1.4, 1.3, C.window, { r: 0.1 }); P.glow(wx + 0.7, wy + 0.65, 1.3, '255,220,120', 0.4); }
    P.rect(-0.6, 0, 1.2, 2.2, '#7a4a35', { r: 0.1 });
    // the cat on the ridge, watching the tree go by
    P.at(-1.2, 8.0, 0, 1, 1, () => { P.blob(0, 0.3, 0.45, 0.32, '#2d2a33', { seed: 3 }); P.circle(0.35, 0.72, 0.24, '#2d2a33'); P.poly([[0.2, 0.9], [0.28, 1.1], [0.38, 0.92]], '#2d2a33'); P.poly([[0.42, 0.92], [0.52, 1.1], [0.58, 0.88]], '#2d2a33'); P.circle(0.42, 0.78, 0.05, '#ffd66b'); P.ribbon([[-0.4, 0.2], [-0.75, 0.4 + Math.sin(t * 3) * 0.15], [-0.7, 0.8]], 0.08, '#2d2a33'); });
  });
}
// a blue whale balancing on its tail (25 m), wobbling
function drawWhale(t, x, t0) {
  const wob = Math.sin(t * 2.4) * 0.05 + K.settle(t, t0, 0.8, 1.2) * 0.08;
  P.at(x, 0, wob, 1, 1, () => {
    P.poly([[-3.2, 0], [0, 2.4], [3.2, 0], [0, 0.8]], P.lin(-3, 0, 3, 0, '#3d5a91', C.whale));
    const body = [[0, 1.6], [1.8, 6], [2.5, 13], [2.4, 20], [1.6, 24.2], [0, 25.3], [-1.6, 24.2], [-2.4, 20], [-2.5, 13], [-1.8, 6]];
    P.lit(body, P.lin(-2.5, 0, 2.5, 0, '#6f8fc6', C.whale, '#38558c'), { d: 0.12, rim: 'rgba(220,240,255,0.25)' });
    P.clip(() => P.trace(body), () => { P.smooth([[0.4, 4], [2.6, 10], [2.6, 21], [0.9, 23.5]], C.whaleBelly, { closed: false }); for (let i = 0; i < 6; i++) P.ribbon([[1.0 + i * 0.25, 14], [1.1 + i * 0.25, 22.5]], 0.07, 'rgba(60,90,140,0.35)'); });
    for (const s of [-1, 1]) P.at(s * 2.2, 17, s * (0.6 + Math.sin(t * 5 + s) * 0.25), 1, 1, () => P.blob(s * 1.4, 0, 1.8, 0.55, '#3f5e98', { seed: 5 }));
    P.circle(-0.9, 21.2, 0.28, '#13213d'); P.circle(-0.98, 21.3, 0.09, '#fff');
    const sp = K.tw(t, t0 + 0.6, t0 + 1.6, 'out'), fade = 1 - K.tw(t, t0 + 1.6, t0 + 2.6);
    if (sp > 0 && fade > 0) for (let i = 0; i < 9; i++) { const a = (i / 8 - 0.5) * 1.2; P.circle(Math.sin(a) * 3 * sp, 25.5 + Math.cos(a) * 5 * sp, 0.6 + sp * 0.5, `rgba(220,240,255,${0.6 * fade})`); }
  });
}
// an 84 m tower with a window grid
function drawTower(t, x) {
  P.at(x, 0, 0, 1, 1, () => {
    P.rect(-7, 0, 14, 84, P.lin(-7, 0, 7, 0, C.glassLight, C.glass, '#3b6aa0'));
    for (let f = 0; f < 27; f++) for (let w = 0; w < 6; w++) P.rect(-6 + w * 2.05, 1 + f * 3.1, 1.5, 1.9, K.hash(f, w) > 0.7 ? 'rgba(255,230,150,0.55)' : 'rgba(255,255,255,0.12)');
    P.rect(-7.6, 83, 15.2, 1.6, '#2f557f'); P.rect(-0.2, 84.6, 0.4, 5, '#2f557f'); P.circle(0, 89.8, 0.5, '#ff5a5a'); P.glow(0, 89.8, 3, '255,90,90', 0.5 + 0.5 * Math.sin(t * 6));
  });
}
