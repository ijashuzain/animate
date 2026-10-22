// Why Cats Land on Their Feet: the set (a warm living room at night, side view, units = cm, floor at y = 0), the hero cat
// adapted for this film (warmer plum, a red collar with a bell), the real fall's pose as a function of story time (ms),
// and the cutaway parts (inner ear, nerves, spine) drawn in the cat's own frame.
const FONT = '"Fredoka", sans-serif';
const { lerp, clamp, tw, track, hash, noise } = K;
const C = {
  wall: '#f2d6b3', wall2: '#ecc9a2', skirting: '#c98f62', floor: '#a8693f', floor2: '#95592f', rug: '#c24f4a', rug2: '#e0a24a',
  wood: '#8a4f2c', wood2: '#6e3b20', night: '#1e2a5a', night2: '#3a4f8f', curtain: '#3f7f86', curtain2: '#2f6670',
  lampGlow: '255,214,150', cat: '#4d3c5a', kitten: '#7a6a88', collar: '#d8443a', bell: '#f2c14e',
};
const SHELF = { x0: -60, x1: 60, top: 150 };
const S = 0.6;                       // the hero cat's size (local units -> cm)
const Y0 = SHELF.top - 30 * S;       // the cat's origin while it lies on its back on the shelf
const G = 490.5;                     // half of g, in cm per s^2
const LAND = Math.round(Math.sqrt(Y0 / G) * 1000);   // ms from the edge to the floor (about 520)

// ---------- the room ----------
function room(t, cam) {
  // the wall: warm wallpaper with soft stripes and a picture rail, a skirting board
  P.rect(-2000, 0, 4000, 520, P.lin(0, 520, 0, 0, '#e9c79f', C.wall));
  for (let i = -40; i < 40; i++) P.rect(i * 36, 0, 14, 520, 'rgba(255,240,215,0.22)');
  P.rect(-2000, 228, 4000, 5, '#d9b088'); P.rect(-2000, 0, 4000, 12, C.skirting); P.rect(-2000, 10, 4000, 2.5, '#e2a878');
  // the window: night sky, a moon, stars; curtains that breathe in a draught
  const wx0 = -290, wx1 = -150, wy0 = 95, wy1 = 215;
  P.rect(wx0 - 8, wy0 - 8, wx1 - wx0 + 16, wy1 - wy0 + 16, '#f6ead8', { r: 3 });
  P.rect(wx0, wy0, wx1 - wx0, wy1 - wy0, P.lin(0, wy1, 0, wy0, C.night, C.night2));
  P.clip(() => { P.ctx.beginPath(); P.ctx.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); }, () => {
    P.glow(-185, 185, 40, '200,220,255', 0.35); P.circle(-185, 185, 11, '#f4f1dc'); P.circle(-181, 188, 9, P.mixc(C.night2, '#f4f1dc', 0.15));
    for (let i = 0; i < 18; i++) P.circle(wx0 + hash(i, 4) * 140, wy0 + 20 + hash(i, 5) * 100, 0.7 + hash(i, 6), `rgba(255,255,240,${0.4 + 0.5 * Math.sin(t * 2 + i) ** 2})`);
    P.poly([[wx0, wy0], [wx0 + 40, wy0 + 24], [wx0 + 80, wy0 + 10], [wx0 + 140, wy0 + 30], [wx1, wy0]], '#141c40');   // rooftops
    for (const [x, h] of [[wx0 + 30, 12], [wx0 + 95, 18]]) P.rect(x, wy0 + 6, 6, h, '#141c40');
    P.rect(wx0 + 33, wy0 + 12, 3, 3, '#ffd88a'); P.rect(wx0 + 98, wy0 + 16, 3, 3, '#ffd88a');
  });
  P.rect((wx0 + wx1) / 2 - 1.5, wy0, 3, wy1 - wy0, '#f6ead8'); P.rect(wx0, (wy0 + wy1) / 2 - 1.5, wx1 - wx0, 3, '#f6ead8');
  P.rect(wx0 - 34, wy1 + 12, wx1 - wx0 + 68, 5, '#6e3b20', { r: 2 });
  for (const side of [-1, 1]) {
    const x = side < 0 ? wx0 - 12 : wx1 + 12, sw = Math.sin(t * 0.9 + side) * 3;
    P.lit([[x - 15, wy1 + 14], [x + 15, wy1 + 14], [x + 17 + sw, wy0 - 40], [x - 17 + sw, wy0 - 40]], C.curtain, { d: 0.12 });
    for (let k = -1; k <= 1; k++) P.ribbon([[x + k * 7, wy1 + 12], [x + k * 7.5 + sw * 0.5, (wy0 + wy1) / 2 - 20], [x + k * 8 + sw, wy0 - 38]], 2.2, C.curtain2);
  }
  // a framed picture (a fish) and the wall clock with a swinging pendulum
  P.rect(-250, 262, 54, 40, '#7a4a2a', { r: 2 }); P.rect(-246, 266, 46, 32, '#bfe3e8'); P.poly([[-246, 266], [-228, 284], [-214, 272], [-200, 288], [-200, 266]], '#e8f4f0');
  P.rect(100, 112, 30, 38, '#7a4a2a', { r: 2 }); P.rect(103, 115, 24, 32, '#f6e2c4'); P.circle(115, 131, 7, '#e3a64a'); P.poly([[108, 115], [115, 126], [122, 115]], '#7fae5a');
  const cx = 165, cy = 205;
  P.rect(cx - 13, cy - 70, 26, 70, P.lin(0, cy, 0, cy - 70, C.wood, C.wood2), { r: 3 });
  const sw = Math.sin(t * Math.PI) * 0.28; P.at(cx, cy - 8, sw, 1, 1, () => { P.rect(-0.8, -48, 1.6, 48, '#d9a441'); P.circle(0, -50, 4.5, '#f2c14e'); });
  P.circle(cx, cy + 6, 17, '#7a4a2a'); P.circle(cx, cy + 6, 14, '#fff8ea');
  P.ribbon([[cx, cy + 6], [cx + Math.sin(t * 0.05) * 8, cy + 6 + Math.cos(t * 0.05) * 8]], 1.4, '#3a2a2a');
  P.ribbon([[cx, cy + 6], [cx + Math.sin(t * 0.6) * 11, cy + 6 + Math.cos(t * 0.6) * 11]], 0.9, '#3a2a2a');
  // the floor: planks, a rug
  P.rect(-2000, -400, 4000, 400, P.lin(0, 0, 0, -60, C.floor, C.floor2));
  for (let r = 0; r < 4; r++) { P.rect(-2000, -8 - r * 14, 4000, 1.2, 'rgba(60,25,10,0.25)'); for (let i = -30; i < 30; i++) P.rect(i * 70 + (r % 2) * 35 + hash(i, r) * 10, -8 - r * 14, 1.2, 14, 'rgba(60,25,10,0.18)'); }
  P.rect(-2000, -1.5, 4000, 2, 'rgba(255,220,180,0.25)');
}
// the bookcase: three shelves of books, a plant on top
function bookcase(t) {
  const { x0, x1, top } = SHELF;
  P.rect(x0 - 4, 0, x1 - x0 + 8, top, P.lin(x0, 0, x1, 0, C.wood, C.wood2));
  P.rect(x0, 4, x1 - x0, top - 10, '#4a2a18');
  for (const y of [4, 52, 100]) {
    P.rect(x0, y, x1 - x0, 4, C.wood);
    let x = x0 + 3;
    for (let i = 0; x < x1 - 8; i++) {
      const w = 5 + hash(i, y) * 6, h = 26 + hash(i, y + 1) * 16, col = ['#c94f4a', '#3f7f86', '#e3a64a', '#5a6fb0', '#7fae5a', '#e8dcc0'][Math.floor(hash(i, y + 2) * 6)];
      if (hash(i, y + 3) > 0.86 && x < x1 - 20) { P.at(x + 12, y + 4, -0.35, 1, 1, () => P.rect(0, 0, w, h, col)); x += 18; continue; }
      P.rect(x, y + 4, w, h, col); P.rect(x, y + 4 + h * 0.75, w, 2, 'rgba(255,255,255,0.35)'); x += w + 0.6;
    }
  }
  P.rect(x0 - 6, top - 4, x1 - x0 + 12, 6, P.lin(0, top + 2, 0, top - 4, '#a8653a', C.wood));
  // a plant in a pot on top, left end
  const px = x0 + 12, sw = Math.sin(t * 0.8) * 0.06;
  for (let i = 0; i < 7; i++) { const a = -1.2 + i * 0.4 + sw; P.at(px, top + 14, a, 1, 1, () => P.blob(0, 14, 4, 13, i % 2 ? '#4f9a5a' : '#3f8248', { seed: i })); }
  P.lit([[px - 9, top + 2], [px + 9, top + 2], [px + 10, top + 16], [px - 10, top + 16]], '#d9774a', { d: 0.15 });
}
// the reading lamp (warm light pool), the side table with the fishbowl and a steaming mug
function lampAndTable(t) {
  const lx = 230;
  P.glow(lx, 150, 160, C.lampGlow, 0.32);
  P.rect(lx - 1.5, 0, 3, 150, '#3a3030'); P.circle(lx, 1, 12, '#3a3030', { ry: 3 });
  P.lit([[lx - 22, 145], [lx + 22, 145], [lx + 14, 172], [lx - 14, 172]], '#f2c47a', { d: 0.1 });
  P.glow(lx, 140, 30, C.lampGlow, 0.7);
  const tx = 320;
  P.rect(tx - 34, 60, 68, 5, C.wood); for (const k of [-28, 26]) P.rect(tx + k, 0, 3, 60, C.wood2);
  // the fishbowl: water, a goldfish that swims to and fro (facing its way), bubbles
  const bx = tx - 10;
  P.circle(bx, 82, 18, 'rgba(170,220,240,0.55)'); P.rect(bx - 17, 65, 34, 3, '#e8d7b0');
  const fu = Math.sin(t * 0.7), fx = bx + fu * 9, fdir = Math.cos(t * 0.7) >= 0 ? 1 : -1;
  P.clip(() => { P.ctx.beginPath(); P.ctx.ellipse(bx, 82, 17, 17, 0, 0, 7); }, () => {
    P.rect(bx - 18, 64, 36, 6, '#d8c08a'); Nature.fish(t, fx, 82 + Math.sin(t * 1.3) * 3, 1.0, '#f08a3a', fdir, 7);
    for (let i = 0; i < 3; i++) { const u = (t * 0.4 + i / 3) % 1; P.circle(bx + 5 + i * 2, 70 + u * 26, 1, 'rgba(255,255,255,0.7)'); }
  });
  P.circle(bx - 7, 90, 4, 'rgba(255,255,255,0.35)', { ry: 7 });
  // the mug and its steam
  const mx = tx + 18; P.lit([[mx - 6, 65], [mx + 6, 65], [mx + 6, 78], [mx - 6, 78]], '#e8e2d8', { d: 0.15 }); P.ribbon([[mx + 6, 75], [mx + 10, 72], [mx + 6, 68]], 1.6, '#e8e2d8');
  for (let i = 0; i < 3; i++) { const u = (t * 0.3 + i / 3) % 1; P.alpha(Math.sin(u * Math.PI) * 0.5, () => P.ribbon([[mx - 2 + i * 2, 79 + u * 20], [mx + Math.sin(t + i + u * 4) * 3, 85 + u * 22], [mx + 2 + Math.sin(t * 1.3 + i) * 3, 92 + u * 24]], 1.6, '#ffffff')); }
}
// a moth that circles the lamp (and, in the hook, wanders over to the cat)
function moth(t, x, y, a = 1) {
  if (a <= 0) return; const f = Math.abs(Math.sin(t * 22));
  P.alpha(a, () => { for (const k of [-1, 1]) P.blob(x + k * 1.2, y + 1, 2.4, 1.2 + f * 1.8, '#e9dcc4', { seed: 3, rot: k * 0.5 }); P.circle(x, y, 1, '#8a7a64', { ry: 1.8 }); });
}
// the sofa (for the kitten scene), with a soft cushion on the floor below it
function sofa(t, x) {
  P.lit([[x - 110, 8], [x + 110, 8], [x + 110, 95], [x - 110, 95]], '#5f8fb0', { d: 0.12 });
  P.lit([[x - 120, 8], [x - 92, 8], [x - 92, 70], [x - 120, 70]], '#4f7f9f', { d: 0.2 });
  P.lit([[x + 92, 8], [x + 120, 8], [x + 120, 70], [x + 92, 70]], '#4f7f9f', { d: 0.2 });
  P.lit([[x - 92, 40], [x + 92, 40], [x + 92, 52], [x - 92, 52]], '#7aa8c8', { d: 0.25 });
  for (const k of [-1, 1]) P.rect(x + k * 98 - 3, 0, 6, 9, C.wood2);
}
function cushion(x, y = 0, w = 46) { P.lit(P.blobPts(x, y + 6, w / 2, 8, 12, 0.05, 2), '#e3a64a', { d: 0.2 }); P.ribbon([[x - w * 0.3, y + 6], [x + w * 0.3, y + 7]], 1.2, 'rgba(120,60,20,0.25)'); }

// ---------- the fall: the real righting sequence as a function of story time ms (0 = leaving the shelf) ----------
// head turns first (40-110), front half 90-170 (legs tucked), back half 170-250 (about 80 ms behind), then legs out,
// back arched (250-330) ready for the floor at LAND
function pose(ms) {
  const o = { col: C.cat };
  if (ms < 0) { // on the shelf, on its back, asleep; wakes at the moth; slips over the edge
    const wake = tw(ms, -1700, -1500), slip = tw(ms, -450, 0, 'in');
    Object.assign(o, { front: 0, back: 0, tuckF: 0.4 - wake * 0.3, tuckB: 0.3, tailUp: 0.35, mood: wake > 0.5 ? 'wow' : 'sleep', look: [0.6, -0.5], legsOut: wake * 0.25 * Math.sin(ms * 0.02) });
    return o;
  }
  const hf = tw(ms, 40, 110), front = tw(ms, 90, 170), back = tw(ms, 170, 250);
  Object.assign(o, {
    front, back, headRot: Math.PI * (front - hf),
    bend: tw(ms, 50, 90) * (1 - tw(ms, 210, 270)),
    tuckF: tw(ms, 85, 105) * (1 - tw(ms, 160, 190)), tuckB: 0.15 + tw(ms, 165, 185) * 0.85 * (1 - tw(ms, 240, 270)) - 0.15 * tw(ms, 90, 120),
    arch: tw(ms, 250, 320) * (1 - tw(ms, LAND + 40, LAND + 260)) * 0.9, legsOut: tw(ms, 260, 330) * (1 - tw(ms, LAND, LAND + 120)) * 0.55,
    tailUp: lerp(0.5, 0.05, tw(ms, 60, 220)) + tw(ms, LAND + 100, LAND + 500) * 0.9,
    mood: ms < 200 ? 'wow' : 'happy', look: ms < 40 ? [0.4, 0.2] : ms < 300 ? [0.3, 0.9] : [0.4, -0.4],
  });
  if (ms >= LAND) { const sq = K.settle(ms / 1000, LAND / 1000, 3, 7); o.tuckF += Math.max(0, sq) * 0.35; o.tuckB += Math.max(0, sq) * 0.35; }
  return o;
}
// where the cat is (origin = between its feet when upright) at story time ms; walkFrom = ms when it starts walking off
function place(ms, walkFrom = Infinity) {
  if (ms < 0) { const slip = tw(ms, -450, 0, 'in'); return { x: lerp(28, 74, slip), y: Y0, rot: -0.5 * Math.sin(slip * Math.PI) }; }
  const f = Math.min(ms, LAND) / 1000; let x = 74 + f * 30;
  if (ms > walkFrom) x += (ms - walkFrom) * 0.055;
  return { x, y: Math.max(0, Y0 - G * f * f), rot: 0 };
}
// the hero cat, adapted for this film: warmer plum, a red collar with a little gold bell
function hero(t, x, y, s, o) {
  Animals.cat(t, x, y, s, Object.assign({}, o, { underHead: (F) => {
    // a collar round the neck, just under the head, and its bell hanging toward the ground
    const [hx, hy, hr] = F.head, k = F.kAt(1.2), cs = Math.cos(hr), sn = Math.sin(hr), at = (dx, dy) => [hx + dx * cs - dy * sn, hy + dx * sn + dy * cs];
    P.ribbon([at(-11, -7), at(-3, -12), at(6, -12)], 4.4, C.collar); const b = at(1, -14);
    P.circle(b[0], b[1] - 1.5 * Math.sign(k), 2.8, C.bell); P.circle(b[0] - 0.6, b[1] - 1 * Math.sign(k), 0.9, '#fff6d0');
  } }));
}
// the kitten: the same cat, younger (bigger head, shorter legs, softer grey), smaller
function kitten(t, x, y, o) { Animals.cat(t, x, y, 0.36, Object.assign({ col: C.kitten, headScale: 1.3, legScale: 0.8 }, o)); }
// the cat's body centre in the world (for the camera)
const centre = (p, o, s = S) => { const F = Animals.catFrame(o); return [p.x + 6 * s, p.y + F.by * s]; };
const headAt = (p, o, s = S) => { const F = Animals.catFrame(o); return [p.x + F.head[0] * s, p.y + F.head[1] * s]; };
// the local -> screen transform at a point drawn inside nested frames
const toScr = (x, y) => { const m = P.ctx.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };

// ---------- the cutaways (drawn in the cat's frame) ----------
// the inner ear's balance organ, in the head's frame: three looping canals, the sac with its jelly and crystals; the
// crystals slide toward the real ground (g = the gravity direction in the head's frame), hairs bend, the nerve sparks
function innerEar(t, a, g, spark, labels) {
  if (a <= 0) return;
  P.alpha(a, () => {
    const ox = 11, oy = 12;
    P.circle(ox, oy, 7.2, 'rgba(250,236,226,0.94)');
    P.at(ox, oy, 0, 0.74, 0.74, () => {
      P.ctx.save(); P.ctx.lineCap = 'round';
      for (const [cx, cy, rx, ry, r, col] of [[0.5, 4.2, 4.2, 3.0, 0.2, '#7fc4f0'], [3.6, 1.2, 3.0, 3.6, -0.3, '#8fd0ff'], [-2.6, 1.6, 2.6, 3.4, 0.4, '#6fb4e8']]) {
        P.ctx.strokeStyle = col; P.ctx.lineWidth = 1.5; P.ctx.beginPath(); P.ctx.ellipse(cx, cy, rx, ry, r, 0.4, 5.9); P.ctx.stroke();
        P.ctx.strokeStyle = 'rgba(255,255,255,0.5)'; P.ctx.lineWidth = 0.45; P.ctx.beginPath(); P.ctx.ellipse(cx, cy, rx, ry, r, 0.6, 2.4); P.ctx.stroke();
      }
      P.ctx.restore();
      // the sac (vestibule): jelly layer with crystals riding on it
      P.lit(P.blobPts(0, -1.4, 3.6, 2.6, 12, 0.04, 2), '#d8c6f0', { d: 0.15 });
      const gx = g[0], gy = g[1];
      P.clip(() => P.trace(P.blobPts(0, -1.4, 3.3, 2.3, 12, 0.04, 2)), () => {
        for (let i = 0; i < 9; i++) { const hx = -2.6 + i * 0.65; P.ribbon([[hx, -3.7], [hx + gx * 0.9, -2.6 + gy * 0.4]], 0.25, '#b48ad0'); }
        P.circle(gx * 1.1, -2.2 + gy * 0.5 + 0.2, 3.0, 'rgba(255,255,255,0.55)', { ry: 1.0 });
        for (let i = 0; i < 9; i++) P.poly([[-2.2 + i * 0.55 + gx * 1.3, -1.4 + gy * 0.6 + (i % 2) * 0.35], [-1.95 + i * 0.55 + gx * 1.3, -0.95 + gy * 0.6 + (i % 2) * 0.35], [-1.7 + i * 0.55 + gx * 1.3, -1.4 + gy * 0.6 + (i % 2) * 0.35], [-1.95 + i * 0.55 + gx * 1.3, -1.85 + gy * 0.6 + (i % 2) * 0.35]], i % 3 ? '#ffffff' : '#bfefff');
      });
      // the nerve to the brain
      P.ribbon([[0, -3.8], [2.5, -5.5], [6.5, -6]], [1.1, 0.9, 0.8], '#f2c94a');
      if (spark > 0) { const u = spark % 1; P.glow(lerp(0, 6.5, u), lerp(-3.8, -6, u), 3, '255,220,90', 1); }
    });
    if (labels) labels(toScr(ox, oy), toScr(ox, oy - 1.4));
  });
}
// the nervous system and the spine, in the cat's body frame: brain + cerebellum in the head, the cord down the back,
// nerves to the four legs; sig 0..1 = the signal's journey ear -> brain -> cord -> legs; spineA = vertebrae
function insides(t, F, nerveA, sig, spineA, flex) {
  const path = []; for (let i = 0; i <= 20; i++) path.push(F.pt([1.15 - i * 0.105, 0.22]));
  if (spineA > 0) P.alpha(spineA, () => {
    P.ribbon(path.slice(1, 20), 7, 'rgba(255,240,225,0.28)');
    for (let i = 1; i < 20; i++) { const u = 1.15 - i * 0.105, chest = u > 0.05, [x, y] = path[i]; const k = F.kAt(u);
      P.lit(P.blobPts(x, y, chest ? 2.1 : 2.6, 2.4 * Math.abs(k) + 0.7, 8, 0.02, i), chest ? P.mixc('#f6ead2', '#fff6dc', flex) : '#d9ccb4', { d: 0.2 });
      if (chest && flex > 0) P.glow(x, y, 6, '255,236,180', 0.35 * flex); }
  });
  if (nerveA > 0) P.alpha(nerveA, () => {
    const [hx, hy] = F.head; P.at(hx, hy, F.head[2], F.hs, F.hs, () => { P.alpha(0.85, () => { P.blob(-2, 8, 5.5, 3.4, '#f296aa', { seed: 3 }); P.blob(-8.5, 6, 3, 2.4, '#6ec878', { seed: 4 }); }); });
    P.ribbon(path.slice(0, 20), 2.2, '#f2c94a');
    const legsAt = [[0.66, 1], [0.56, 1], [-0.8, 0], [-0.94, 0]];
    for (const [u] of legsAt) { const a = F.pt([u, 0.22]), b = F.pt([u + 0.04, -0.42]); P.ribbon([a, b], 1.1, '#7fb4e8'); }
    if (sig > 0) {
      const lit = (u0, u1) => clamp((sig - u0) / (u1 - u0));
      // ear -> brain (0..0.2), brain -> down the cord (0.2..0.75), cord -> legs (0.75..1): the muscles flash red
      let gp; if (sig < 0.2) { const [hx2, hy2] = F.head; gp = [hx2 - 4, hy2]; } else if (sig < 0.75) { const i = Math.min(19, Math.floor(lit(0.2, 0.75) * 19)); gp = path[i]; } else gp = null;
      if (gp) P.glow(gp[0], gp[1], 10, '255,220,90', 1);
      const m = lit(0.75, 1); if (m > 0) for (const [u] of legsAt) { const b = F.pt([u + 0.04, -0.45]); P.glow(b[0], b[1], 10 * m, '255,90,80', 0.9 * Math.sin(m * Math.PI) + 0.3 * m); }
    }
  });
}
// a curved arrow around one half of the body (seen from the side: a loop around the body's axis)
function rollArrow(F, u, a, fast) {
  if (a <= 0) return; const [x, y] = F.pt([u, 0]); const sp = fast ? 1 : 0.25;
  P.alpha(a, () => { P.ctx.save(); P.ctx.strokeStyle = fast ? '#ffd36b' : 'rgba(255,255,255,0.75)'; P.ctx.lineWidth = fast ? 2.4 : 1.6; P.ctx.lineCap = 'round';
    P.ctx.beginPath(); P.ctx.ellipse(x, y, 7, 24, 0, -1.2, 1.9); P.ctx.stroke(); P.ctx.restore();
    const e = 1.9, ex = x + Math.cos(e) * 7, ey = y + Math.sin(e) * 24; P.poly([[ex - 4, ey + 1], [ex + 2.5, ey + 4.5], [ex + 1.5, ey - 3]], fast ? '#ffd36b' : 'rgba(255,255,255,0.75)'); });
}
const STOPWATCH = (ctx, r) => { ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.75, 0, 6.3); ctx.stroke(); ctx.fillStyle = '#1a2a4a'; ctx.fillRect(-r * 0.18, -r * 0.95, r * 0.36, r * 0.25); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, r * 0.1); ctx.lineTo(r * 0.35, -r * 0.3); ctx.stroke(); };
