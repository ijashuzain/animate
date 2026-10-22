// kit/creatures.js — characters harvested from finished films (y up, local units; see studio/references/kit-gallery.png).
// Creatures.water(t, x, y, s, o)   a water molecule hero with hydrogen ears (raindrop film). o: mood, look, ghost 0..1,
//                                  wave, shiver, arms 'wave'|'hold'|'up', sq [sx, sy], rot
// Creatures.molecule(t, x, y, s, seed, o)  a crowd molecule; varies by seed (size, tint, mood, hats, glasses). o.col tints it
// Creatures.dino(t, x, y, s, neck 0..1, col, o)  a friendly sauropod facing +x (the user's reference look); neck 1 = drinking.
//                                  Creatures.dinoMouth(neck) gives the mouth in local units (aim cameras, place things)
// Creatures.angler(t, x, y, s, dir, mood)  a deep-sea anglerfish with a glowing lure (island film)
// Creatures.crab(t, x, y, s, asleep)   a red crab; asleep shows closed eyes (add your own z's)
// Creatures.turtle(t, x, y, s, dir)    a sea turtle, flippers paddling
// Facing: all face +x at dir 1; set dir from the way they travel (CLAUDE.md quality bar).
const Creatures = {};
Creatures.water = function (t, x, y, s, o = {}) {
  const ghost = o.ghost ?? 0, [sx, sy] = o.sq ?? [1, 1], shv = o.shiver ? Math.sin(t * 70) * 3 * o.shiver : 0;
  P.at(x + shv, y, o.rot ?? 0, s * sx, s * sy, () => {
    const body = (fn) => (ghost > 0 ? P.alpha(1 - ghost * 0.82, fn) : fn());
    // ears: hydrogens on stalks, wiggling when waving
    for (const side of [-1, 1]) {
      const a = Math.PI / 2 + side * 0.91 + (o.wave ? Math.sin(t * 14 + side) * 0.18 * o.wave : 0), ex = Math.cos(a) * 62, ey = Math.sin(a) * 62;
      body(() => { P.ribbon([[Math.cos(a) * 30, Math.sin(a) * 30], [ex, ey]], [12, 8], '#2a7fd4'); P.lit(P.blobPts(ex, ey, 22, 22, 12, 0.02, side + 4), P.rad(ex - 6, ey + 6, 26, '#ffffff', '#eaf6ff'), { d: 0.18, shade: 'rgba(40,90,160,0.25)' }); });
    }
    body(() => P.lit(P.blobPts(0, 0, 50, 48, 14, 0.02, 7), P.rad(-14, 16, 70, '#8fd2ff', '#4fb3ff', '#2a7fd4'), { d: 0.16, shade: 'rgba(10,40,110,0.22)', rim: 'rgba(255,255,255,0.45)' }));
    if (ghost > 0) { P.ctx.save(); P.ctx.setLineDash([10, 8]); P.ctx.lineWidth = 4; P.ctx.strokeStyle = `rgba(255,255,255,${0.9 * ghost})`; P.ctx.beginPath(); P.ctx.arc(0, 0, 50, 0, Math.PI * 2); P.ctx.stroke(); P.ctx.restore(); }
    P.circle(-18, 26, 12, 'rgba(255,255,255,0.55)', { ry: 7, rot: 0.5 });
    // arms
    if (o.arms) {
      const w = Math.sin(t * 12) * 0.5, L = o.arms === 'wave' ? [[-40, -8], [-62, -20], [-70, -38]] : o.arms === 'up' ? [[-40, 0], [-58, 30], [-60, 58]] : [[-40, -10], [-56, -26], [-46, -40]];
      const R = o.arms === 'wave' ? [[40, -4], [62, 18 + w * 10], [70 + w * 14, 46 + w * 8]] : o.arms === 'up' ? [[40, 0], [58, 30], [60, 58]] : [[40, -10], [60, -18], [74, -14]];
      for (const A of [L, R]) { P.ribbon(A, [9, 8, 7], '#2a7fd4'); P.circle(A[2][0], A[2][1], 7, '#4fb3ff'); }
    }
    if (ghost < 0.95) P.alpha(1 - ghost * 0.6, () => Cast.face(t, 2, 4, 46, { mood: o.mood ?? 'happy', look: o.look ?? [0.2, 0], seed: 11, ink: '#13315a' }));
  });
}
Creatures.molecule = function (t, x, y, s, seed, o = {}) {
  const j = o.jiggle ?? 1, jx = K.noise(t * 6 * j + seed, seed) * 8 * j, jy = K.noise(t * 6 * j + seed + 50, seed) * 8 * j, rot = K.noise(t * 2 + seed, 3) * 0.5;
  const sz = 0.85 + 0.35 * K.hash(seed, 13), tint = ['#7cc4f2', '#8fd0f5', '#6fb8ec', '#9ad6f0'][seed % 4], kind = seed % 9;
  const mood = o.mood ?? (seed % 5 === 1 ? 'sleep' : seed % 7 === 2 ? 'wow' : seed % 3 ? 'smile' : 'happy');
  P.at(x + jx, y + jy, rot, s * sz, s * sz, () => {
    for (const side of [-1, 1]) { const a = Math.PI / 2 + side * 0.91, ex = Math.cos(a) * 58, ey = Math.sin(a) * 58; P.ribbon([[Math.cos(a) * 28, Math.sin(a) * 28], [ex, ey]], [10, 7], '#4f97cc'); P.circle(ex, ey, 20, o.ear ?? '#dceefb'); }
    P.lit(P.blobPts(0, 0, 46, 45, 12, 0.03, seed), P.rad(-12, 14, 64, '#a8dcff', o.col ?? tint, '#4f97cc'), { d: 0.15, rim: 'rgba(255,255,255,0.4)' });
    if (o.face !== false) {
      Cast.face(t, 2, 2, 38, { mood, look: [K.noise(t + seed, 9) * 0.8, 0], seed });
      if (seed % 11 === 3) { P.ctx.save(); P.ctx.strokeStyle = '#22314a'; P.ctx.lineWidth = 3.5; for (const gx of [-9, 11]) { P.ctx.beginPath(); P.ctx.arc(gx, 4, 9, 0, 6.3); P.ctx.stroke(); } P.ctx.beginPath(); P.ctx.moveTo(0, 5); P.ctx.lineTo(2, 5); P.ctx.stroke(); P.ctx.restore(); }
    }
    if (o.hats !== false) {
      if (kind === 0) { P.smooth([[-34, 30], [-28, 58], [0, 70], [28, 58], [34, 30]], '#e35d4f'); P.rect(-36, 26, 72, 12, '#f7f0e0', { r: 6 }); P.circle(0, 72, 9, '#f7f0e0'); }
      else if (kind === 4) { P.rect(-30, 36, 60, 10, '#2a2a3a', { r: 3 }); P.rect(-20, 44, 40, 40, '#2a2a3a', { r: 3 }); P.rect(-20, 48, 40, 7, '#e35d4f'); }
      else if (kind === 7) { P.smooth([[-34, 34], [-30, 58], [0, 64], [30, 58], [34, 34]], '#3f8f45'); P.smooth([[20, 34], [62, 30], [58, 40], [20, 42]], '#2f6f35'); }
    }
  });
}
Creatures.dinoRig = function (n) {
  const e = K.ease.inOut(K.clamp(n)), p0 = [190, 250], p1 = [K.lerp(320, 470, e), K.lerp(470, 330, e)], p2 = [K.lerp(400, 640, e), K.lerp(640, 60, e)];
  const q = (u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const d = [p2[0] - p1[0], p2[1] - p1[1]], ang = Math.atan2(d[1], d[0]);
  return { q, head: p2, ang };
}
Creatures.dinoHeadRot = (n) => { const R = Creatures.dinoRig(n); return R.ang * 0.4 - (n > 0.5 ? 0.15 : 0); };
Creatures.dinoMouth = function (n) { const R = Creatures.dinoRig(n), r = Creatures.dinoHeadRot(n), lx = 80 * 1.35, ly = -2 * 1.35; return [R.head[0] + Math.cos(r) * lx - Math.sin(r) * ly, R.head[1] + Math.sin(r) * lx + Math.cos(r) * ly]; }
Creatures.dino = function (t, x, y, s, n = 0, col = '#8fa86a', o = {}) {
  const dark = P.mixc(col, '#1e2a14', 0.35), belly = P.mixc(col, '#f3e6b0', 0.6), spot = P.mixc(col, '#2e3f1c', 0.25), R = Creatures.dinoRig(n);
  P.at(x, y, 0, s, s, () => {
    // shadow on the ground
    P.circle(20, 4, 300, 'rgba(60,40,10,0.22)', { ry: 26 });
    // far legs (darker), tail
    for (const lx of [-150, 120]) { P.ribbon([[lx, 170], [lx - 4, 80], [lx, 6]], [74, 62, 66], dark); P.blob(lx + 6, 12, 42, 16, dark, { seed: lx }); }
    const sw = Math.sin(t * 1.5) * 30;
    P.ribbon([[-200, 210], [-330, 190 + sw * 0.3], [-450, 140 + sw * 0.7], [-560, 90 + sw]], [110, 70, 36, 6], P.lin(-560, 0, -200, 0, dark, col));
    // body with belly and spots
    const body = [[-240, 190], [-190, 300], [-40, 335], [130, 315], [240, 245], [215, 150], [60, 110], [-130, 125]];
    P.lit(body, P.lin(0, 335, 0, 110, P.mixc(col, '#ffffff', 0.12), col), { d: 0.16, shade: 'rgba(30,20,5,0.28)', rim: 'rgba(255,240,200,0.35)', light: [-0.4, 0.9] });
    P.clip(() => P.trace(body), () => { P.circle(10, 120, 230, belly, { ry: 60 }); for (let i = 0; i < 7; i++) P.circle(-170 + i * 55, 290 - (i % 2) * 22, 16 + (i % 3) * 5, spot, { ry: 11 }); });
    // neck: a smooth tapering curve, spots along the top, then the head
    const pts = [], wd = []; for (let k = 0; k <= 10; k++) { pts.push(R.q(k / 10)); wd.push(K.lerp(110, 54, k / 10)); }
    P.ribbon(pts, wd, P.lin(190, 250, R.head[0], R.head[1], col, P.mixc(col, '#ffffff', 0.08)));
    const under = [], uw = []; for (let k = 0; k <= 10; k++) { const [px, py] = R.q(k / 10), [qx, qy] = R.q(Math.min(1, k / 10 + 0.01)), dx = qx - px, dy = qy - py, d = Math.hypot(dx, dy) || 1; under.push([px + dy / d * K.lerp(30, 14, k / 10), py - dx / d * K.lerp(30, 14, k / 10)]); uw.push(K.lerp(40, 18, k / 10)); }
    P.ribbon(under, uw, P.mixc(belly, col, 0.25));
    for (let k = 2; k < 9; k += 2) { const [px, py] = R.q(k / 10); P.circle(px - 8, py + 14, 9, spot, { ry: 6 }); }
    // near legs (lighter) with feet and toenails
    for (const lx of [-90, 175]) { P.ribbon([[lx, 180], [lx + 4, 80], [lx, 6]], [80, 66, 70], P.lin(lx - 40, 0, lx + 40, 0, col, dark)); P.lit(P.blobPts(lx + 8, 14, 46, 18, 10, 0.05, lx), col, { d: 0.2 }); for (const tx of [-22, 0, 22]) P.circle(lx + 26 + tx * 0.9, 8, 7, '#f3ead0', { ry: 5 }); }
    // head (the reference look): a smooth profile that flows out of the neck: forehead bump, round snout, lighter jaw,
    // one eye with a highlight, a thin smile, a nostril (kit/cast.js profileFace); the jaw drops to drink
    P.at(R.head[0], R.head[1], Creatures.dinoHeadRot(n), 1.35, 1.35, () => {
      const open = 0;
      const head = [[-34, 26], [-6, 44], [26, 46], [58, 38], [84, 24], [94, 6], [86, -10], [60, -14 - open * 4], [20, -20], [-20, -24], [-40, -10]];
      P.lit(head, P.lin(0, 46, 0, -24, P.mixc(col, '#ffffff', 0.12), col), { d: 0.12, shade: 'rgba(30,20,5,0.2)', rim: 'rgba(255,240,200,0.35)', light: [-0.3, 1] });
      P.clip(() => P.trace(head), () => P.smooth([[-40, -24], [90, -16], [92, -6], [40, -6], [-40, -8]], belly, { a: 0.9 }));
      // the face is clipped to the head, so the eye, smile and nostril can never sit outside it (no open mouth: a closed smile)
      P.clip(() => P.trace(head), () => Cast.profileFace(t, 34, 16, 15, { mood: o.mood === 'wow' ? 'smile' : (o.mood ?? 'smile'), look: (o.look ?? [0.7, 0])[0], seed: 21, ink: '#1e1a14', mouth: [2.5, -0.85], nose: [3.0, 0.25] }));
    });
  });
}
Creatures.angler = function (t, x, y, s, dir = 1, mood = 'smile') {
  P.at(x, y + Math.sin(t * 1.7) * 8, Math.sin(t * 1.2) * 0.05, s * dir, s, () => {
    const lx = 70 + Math.sin(t * 2) * 6, ly = 96;
    P.ribbon([[10, 40], [50, 90], [lx, ly]], [5, 4, 3], '#3a3550'); P.glow(lx, ly, 70, '170,255,230', 0.9); P.circle(lx, ly, 8, '#d8fff0');
    P.poly([[-60, 0], [-96, 30 + Math.sin(t * 6) * 8], [-96, -30 + Math.sin(t * 6) * 8]], '#2a2540');
    P.lit(P.blobPts(0, 0, 66, 52, 12, 0.06, 7), P.rad(-10, 10, 80, '#5a5078', '#3a3352', '#241f38'), { d: 0.2, rim: 'rgba(170,255,230,0.35)', light: [0.8, 0.5] });
    for (let i = 0; i < 5; i++) P.poly([[36 + i * 7, -12], [40 + i * 7, -2], [44 + i * 7, -12]], '#f0f0f0');
    Cast.profileFace(t, 26, 16, 18, { mood, seed: 5, ink: '#0e0a18', mouth: [1.4, -1.6], nose: false, blush: 'rgba(255,120,160,0.25)' });
  });
}
Creatures.crab = function (t, x, y, s, asleep = true) {
  P.at(x, y, 0, s, s, () => {
    for (const k of [-1, 1]) for (let i = 0; i < 3; i++) P.ribbon([[k * 20, 6], [k * (40 + i * 6), 14 + (asleep ? 0 : Math.sin(t * 20 + i) * 6)], [k * (50 + i * 8), -2]], [5, 4, 3], '#c43a2a');
    for (const k of [-1, 1]) { P.ribbon([[k * 30, 16], [k * 54, 34]], 6, '#d94a35'); P.blob(k * 62, 38, 16, 11, '#e85a40', { seed: k + 3 }); }
    P.lit(P.blobPts(0, 14, 44, 26, 12, 0.04, 2), P.lin(0, 40, 0, -10, '#ff7a5a', '#d4402c'), { d: 0.2 });
    for (const k of [-1, 1]) { P.ribbon([[k * 10, 34], [k * 14, 52]], 4, '#d4402c'); }
    Cast.face(t, 0, 50, 26, { mood: asleep ? 'sleep' : 'wow', seed: 9, ink: '#2a0a0a' });
  });
}
Creatures.turtle = function (t, x, y, s, dir = 1) {
  P.at(x, y, 0, s * dir, s, () => {
    for (const k of [-1, 1]) P.smooth([[10, 0], [-30, k * 60 + Math.sin(t * 3) * k * 14], [-60, k * 50]], '#5a9a6a');
    P.lit(P.blobPts(0, 0, 70, 44, 12, 0.04, 8), P.lin(0, 44, 0, -44, '#8ab86a', '#4a7a4a'), { d: 0.2 });
    for (let i = 0; i < 5; i++) P.blob(-30 + i * 16, 10 - (i % 2) * 14, 12, 9, 'rgba(40,70,40,0.4)', { seed: i });
    P.circle(80, 6, 22, '#7aa86a'); Cast.profileFace(t, 84, 10, 9, { mood: 'smile', seed: 6, mouth: [1.3, -1.0], nose: false });
  });
};
