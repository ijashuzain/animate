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
// the farmhouse is in the kit now (Props.farmhouse)
const farmhouse = (t, x, lit, shake, door) => Props.farmhouse(t, x, lit, shake, door);
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
