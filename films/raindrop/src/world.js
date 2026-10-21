// The Raindrop: characters and props. Units are screen-like (a camera of h = 1080 shows 1 unit = 1 px).
const FONT = '"Baloo 2", sans-serif';
const C = {
  drip: '#4fb3ff', dripDeep: '#2a7fd4', ear: '#eaf6ff', mol: '#7cc4f2', molDeep: '#4f97cc',
  sea0: '#0b2a4a', sea1: '#13507a', sea2: '#1f86a8', foam: '#e9fbff', sand: '#e8cf9a',
  sky0: '#ffb38a', sky1: '#ffe2c2', cold0: '#5b4a9e', cold1: '#d9a6d6', storm0: '#2c2d5c', storm1: '#6a6aa6',
  grass: '#6fbf5a', grassDark: '#3f8f45', rock: '#8e8aa6', rockDark: '#5f5b7d', snow: '#f5f8ff',
  river: '#3ec4d6', riverDeep: '#1f8fb3', wood: '#a8683c', woodDark: '#6e4024', roof: '#e35d4f', wall: '#fff0d4',
  sepia0: '#3d2a1c', sepia1: '#c9a46c', paper: '#f6e6c4', passport: '#1f3a6e', gold: '#f2c14e', ink: '#d6453d',
};
// Drip: an oxygen ball with a face, hydrogen-atom ears (104.5 degrees apart), optional little arms.
// o: mood, look, ghost 0..1 (vapour: see-through), wave (ear wiggle 0..1), shiver, arms ('wave' | 'hold' | 'up' | null), sq [sx, sy]
function drawDrip(t, x, y, s, o = {}) {
  const ghost = o.ghost ?? 0, [sx, sy] = o.sq ?? [1, 1], shv = o.shiver ? Math.sin(t * 70) * 3 * o.shiver : 0;
  P.at(x + shv, y, o.rot ?? 0, s * sx, s * sy, () => {
    const body = (fn) => (ghost > 0 ? P.alpha(1 - ghost * 0.82, fn) : fn());
    // ears: hydrogens on stalks, wiggling when waving
    for (const side of [-1, 1]) {
      const a = Math.PI / 2 + side * 0.91 + (o.wave ? Math.sin(t * 14 + side) * 0.18 * o.wave : 0), ex = Math.cos(a) * 62, ey = Math.sin(a) * 62;
      body(() => { P.ribbon([[Math.cos(a) * 30, Math.sin(a) * 30], [ex, ey]], [12, 8], C.dripDeep); P.lit(P.blobPts(ex, ey, 22, 22, 12, 0.02, side + 4), P.rad(ex - 6, ey + 6, 26, '#ffffff', C.ear), { d: 0.18, shade: 'rgba(40,90,160,0.25)' }); });
    }
    body(() => P.lit(P.blobPts(0, 0, 50, 48, 14, 0.02, 7), P.rad(-14, 16, 70, '#8fd2ff', C.drip, C.dripDeep), { d: 0.16, shade: 'rgba(10,40,110,0.22)', rim: 'rgba(255,255,255,0.45)' }));
    if (ghost > 0) { P.ctx.save(); P.ctx.setLineDash([10, 8]); P.ctx.lineWidth = 4; P.ctx.strokeStyle = `rgba(255,255,255,${0.9 * ghost})`; P.ctx.beginPath(); P.ctx.arc(0, 0, 50, 0, Math.PI * 2); P.ctx.stroke(); P.ctx.restore(); }
    P.circle(-18, 26, 12, 'rgba(255,255,255,0.55)', { ry: 7, rot: 0.5 });
    // arms
    if (o.arms) {
      const w = Math.sin(t * 12) * 0.5, L = o.arms === 'wave' ? [[-40, -8], [-62, -20], [-70, -38]] : o.arms === 'up' ? [[-40, 0], [-58, 30], [-60, 58]] : [[-40, -10], [-56, -26], [-46, -40]];
      const R = o.arms === 'wave' ? [[40, -4], [62, 18 + w * 10], [70 + w * 14, 46 + w * 8]] : o.arms === 'up' ? [[40, 0], [58, 30], [60, 58]] : [[40, -10], [60, -18], [74, -14]];
      for (const A of [L, R]) { P.ribbon(A, [9, 8, 7], C.dripDeep); P.circle(A[2][0], A[2][1], 7, C.drip); }
    }
    if (ghost < 0.95) P.alpha(1 - ghost * 0.6, () => Cast.face(t, 2, 4, 46, { mood: o.mood ?? 'happy', look: o.look ?? [0.2, 0], seed: 11, ink: '#13315a' }));
  });
}
// another water molecule (the crowd): simpler, paler, with its own little face
function drawMol(t, x, y, s, seed, o = {}) {
  const j = o.jiggle ?? 1, jx = K.noise(t * 6 * j + seed, seed) * 8 * j, jy = K.noise(t * 6 * j + seed + 50, seed) * 8 * j, rot = K.noise(t * 2 + seed, 3) * 0.5;
  const sz = 0.85 + 0.35 * K.hash(seed, 13), tint = ['#7cc4f2', '#8fd0f5', '#6fb8ec', '#9ad6f0'][seed % 4], kind = seed % 9;
  const mood = o.mood ?? (seed % 5 === 1 ? 'sleep' : seed % 7 === 2 ? 'wow' : seed % 3 ? 'smile' : 'happy');
  P.at(x + jx, y + jy, rot, s * sz, s * sz, () => {
    for (const side of [-1, 1]) { const a = Math.PI / 2 + side * 0.91, ex = Math.cos(a) * 58, ey = Math.sin(a) * 58; P.ribbon([[Math.cos(a) * 28, Math.sin(a) * 28], [ex, ey]], [10, 7], C.molDeep); P.circle(ex, ey, 20, o.ear ?? '#dceefb'); }
    P.lit(P.blobPts(0, 0, 46, 45, 12, 0.03, seed), P.rad(-12, 14, 64, '#a8dcff', o.col ?? tint, C.molDeep), { d: 0.15, rim: 'rgba(255,255,255,0.4)' });
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
// sea life
function drawFish(t, x, y, s, col, seed) { const w = Math.sin(t * 9 + seed) * 0.25; P.at(x, y, 0, s, s, () => { P.poly([[-40, 0], [-62, 16 + w * 20], [-62, -16 + w * 20]], P.mixc(col, '#000000', 0.15)); P.lit(P.blobPts(0, 0, 44, 22, 12, 0.02, seed), col, { d: 0.2, rim: 'rgba(255,255,255,0.35)' }); P.circle(26, 5, 5, '#fff'); P.circle(27, 5, 2.6, '#123'); }); }
function drawJelly(t, x, y, s, seed) { const p = Math.sin(t * 2.4 + seed); P.at(x, y, 0, s * (1 + p * 0.06), s * (1 - p * 0.06), () => { P.glow(0, 10, 90, '255,170,230', 0.35); for (let i = 0; i < 5; i++) P.ribbon([[-24 + i * 12, -6], [-24 + i * 12 + Math.sin(t * 3 + i) * 8, -60], [-24 + i * 12 + Math.sin(t * 3 + i + 1) * 12, -110]], [5, 4, 1], 'rgba(255,190,235,0.6)'); P.smooth([[-40, -4], [-34, 26], [0, 42], [34, 26], [40, -4], [0, 2]], 'rgba(255,170,225,0.75)'); }); }
function drawWhale(t, x, y, s) { P.at(x, y, Math.sin(t * 0.6) * 0.04, s, s, () => { const tail = Math.sin(t * 1.6) * 30; P.smooth([[-380, 10], [-200, 70], [120, 90], [340, 40], [400, -10], [300, -60], [0, -70], [-260, -30], [-420, 30 + tail * 0.3]], P.lin(0, 90, 0, -70, '#3c6f9e', '#1d3f66')); P.poly([[-400, 20 + tail * 0.4], [-520, 90 + tail], [-470, 10 + tail * 0.5], [-520, -60 + tail]], '#1d3f66'); P.smooth([[60, -40], [140, -40], [120, -110 + Math.sin(t * 1.2) * 10], [70, -80]], '#173658'); P.circle(300, 10, 9, '#0c1c30'); for (let i = 0; i < 6; i++) P.ribbon([[120 + i * 30, -50], [150 + i * 30, -66]], 4, 'rgba(160,200,230,0.3)'); }); }
// bubbles rising across the screen (screen space), seeded
function bubbles(t, n, seed, a = 1, speed = 120) { P.screen((ctx) => { for (let i = 0; i < n; i++) { const x = K.hash(i, seed) * 1920 + Math.sin(t * 1.5 + i) * 18, y = 1150 - ((K.hash(i, seed + 1) * 1300 + t * speed * (0.6 + K.hash(i, seed + 2))) % 1300), r = 4 + 14 * K.hash(i, seed + 3); ctx.globalAlpha = a * 0.55; ctx.strokeStyle = '#d8f6ff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke(); ctx.globalAlpha = a * 0.5; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, 6.3); ctx.fill(); } }); }
// a fluffy cloud of lit blobs
function drawCloud(x, y, s, seed, col = '#ffffff') {
  // one soft shape: a darker underside layer, the body on top, highlights on the tops (no per-blob outlines)
  const pts = [[-120, 0, 70], [-50, 30, 90], [40, 40, 100], [120, 10, 75], [0, -10, 110]], dark = P.mixc(col, '#3a3470', 0.3);
  P.at(x, y, 0, s, s, () => {
    P.blob(0, -36, 200, 52, dark, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy - 16, r, r * 0.8, dark, { seed: seed + cx, n: 10, w: 0.08 });
    P.blob(0, -22, 196, 50, col, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy + 2, r * 0.95, r * 0.76, col, { seed: seed + cx, n: 10, w: 0.08 });
    for (const [cx, cy, r] of pts) P.blob(cx - r * 0.2, cy + r * 0.38, r * 0.5, r * 0.22, 'rgba(255,255,255,0.16)', { seed: seed + cx + 1, n: 8, w: 0.15 });
  });
}
// the salt crystal: a little isometric cube
function drawSalt(x, y, s, rot = 0) { P.at(x, y, rot, s, s, () => { P.poly([[0, 40], [40, 20], [0, 0], [-40, 20]], '#ffffff'); P.poly([[-40, 20], [0, 0], [0, -46], [-40, -26]], '#dfe8f3'); P.poly([[0, 0], [40, 20], [40, -26], [0, -46]], '#c4d2e4'); }); }
// the raindrop: sphere -> bun (flat bottom) as k goes 0..1; seeds 0..1 show sesame seeds
function drawRaindrop(t, x, y, s, k = 0, seeds = 0) {
  P.at(x, y, 0, s, s, () => {
    const pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a); let ry = sn < 0 ? K.lerp(1, 0.45, k) : K.lerp(1, 0.85, k); pts.push([c * K.lerp(1, 1.18, k) * 100, sn * ry * 100 + (sn < 0 ? 0 : 0)]); }
    P.lit(pts, P.rad(-30, 40, 160, '#bfe9ff', '#58b8f0', '#2a86c8'), { d: 0.14, shade: 'rgba(10,60,130,0.25)', rim: 'rgba(255,255,255,0.55)' });
    P.circle(-38, 46, 22, 'rgba(255,255,255,0.6)', { ry: 12, rot: 0.6 });
    if (seeds > 0) P.alpha(seeds, () => { for (let i = 0; i < 9; i++) { const sx2 = (K.hash(i, 5) * 2 - 1) * 80, sy2 = 30 + K.hash(i, 6) * 40; P.circle(sx2, sy2, 7, '#fff3c8', { ry: 4, rot: K.hash(i, 7) * 3 }); } });
  });
}
// a stylised mountain range piece, the signpost, the river things
function drawSign(t, x, y, s, u = [1, 1, 1]) {
  P.at(x, y, 0, s, s, () => {
    P.rect(-10, 0, 20, 320, P.lin(-10, 0, 10, 0, C.wood, C.woodDark), { r: 4 });
    const arms = [['UNDERGROUND', 'centuries', -1, 270, '#8a6a4a'], ['GLACIER', 'decades', 1, 190, '#7fb4e0'], ['RIVER', 'about 2 weeks', -1, 110, '#3ec4d6']];
    arms.forEach(([a, b, dir, ay, col], i) => {
      const k = K.ease.backOut(K.clamp(u[i])); if (k <= 0) return;
      P.at(0, ay, Math.sin(t * 2 + i) * 0.02, k, k, () => {
        const w = 300, pts = dir > 0 ? [[0, -34], [w, -34], [w + 40, 0], [w, 34], [0, 34]] : [[0, -34], [-w, -34], [-w - 40, 0], [-w, 34], [0, 34]];
        P.lit(pts, P.lin(0, 34, 0, -34, P.mixc(C.wood, '#ffffff', 0.15), C.wood), { d: 0.1, rim: 'rgba(255,230,190,0.35)' });
        P.circle(dir * 30, 0, 14, col);
        P.at(dir * (w / 2 + 20), 0, 0, 1, -1, () => { const ctx = P.ctx; ctx.fillStyle = '#3a2210'; ctx.textAlign = 'center'; ctx.font = `800 30px ${FONT}`; ctx.fillText(a, 0, -2); ctx.font = `600 22px ${FONT}`; ctx.fillText(b, 0, 24); });
      });
    });
  });
}
function drawHouse(x, y, s, col, seed) { P.at(x, y, 0, s, s, () => { P.rect(-50, 0, 100, 80, P.lin(-50, 0, 50, 0, '#fff7e6', col ?? C.wall)); P.poly([[-62, 76], [62, 76], [0, 130]], K.hash(seed, 1) > 0.5 ? C.roof : '#4f7fc4'); P.rect(-30, 30, 22, 22, '#ffd36b', { r: 3 }); P.rect(10, 0, 22, 40, '#8a5a3a', { r: 3 }); }); }
function drawWheel(t, x, y, s) { P.at(x, y, 0, s, s, () => { P.ctx.save(); P.ctx.rotate(-t * 1.6); for (let i = 0; i < 10; i++) { P.ctx.save(); P.ctx.rotate(i * Math.PI / 5); P.rect(-6, 0, 12, 120, C.woodDark); P.rect(-26, 110, 52, 18, C.wood, { r: 3 }); P.ctx.restore(); } P.ctx.restore(); P.circle(0, 0, 22, C.woodDark); P.circle(0, 0, 10, C.wood); }); }
// a long-necked dinosaur (a friendly sauropod). n: neck 0 (head high) .. 1 (drinking at the water); local units, ground y = 0,
// facing right. dinoRig gives the neck curve and the head position so the film can aim the camera at the head.
function dinoRig(n) {
  const e = K.ease.inOut(K.clamp(n)), p0 = [190, 250], p1 = [K.lerp(320, 470, e), K.lerp(470, 330, e)], p2 = [K.lerp(400, 640, e), K.lerp(640, 60, e)];
  const q = (u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const d = [p2[0] - p1[0], p2[1] - p1[1]], ang = Math.atan2(d[1], d[0]);
  return { q, head: p2, ang };
}
const dinoHeadRot = (n) => { const R = dinoRig(n); return R.ang * 0.4 - (n > 0.5 ? 0.15 : 0); };
// the mouth in the dino's local units (for placing things in it)
function dinoMouth(n) { const R = dinoRig(n), r = dinoHeadRot(n), lx = 80 * 1.35, ly = -2 * 1.35; return [R.head[0] + Math.cos(r) * lx - Math.sin(r) * ly, R.head[1] + Math.sin(r) * lx + Math.cos(r) * ly]; }
function drawDino(t, x, y, s, n = 0, col = '#8fa86a', o = {}) {
  const dark = P.mixc(col, '#1e2a14', 0.35), belly = P.mixc(col, '#f3e6b0', 0.6), spot = P.mixc(col, '#2e3f1c', 0.25), R = dinoRig(n);
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
    P.at(R.head[0], R.head[1], dinoHeadRot(n), 1.35, 1.35, () => {
      const open = 0;
      const head = [[-34, 26], [-6, 44], [26, 46], [58, 38], [84, 24], [94, 6], [86, -10], [60, -14 - open * 4], [20, -20], [-20, -24], [-40, -10]];
      P.lit(head, P.lin(0, 46, 0, -24, P.mixc(col, '#ffffff', 0.12), col), { d: 0.12, shade: 'rgba(30,20,5,0.2)', rim: 'rgba(255,240,200,0.35)', light: [-0.3, 1] });
      P.clip(() => P.trace(head), () => P.smooth([[-40, -24], [90, -16], [92, -6], [40, -6], [-40, -8]], belly, { a: 0.9 }));
      // the face is clipped to the head, so the eye, smile and nostril can never sit outside it (no open mouth: a closed smile)
      P.clip(() => P.trace(head), () => Cast.profileFace(t, 34, 16, 15, { mood: o.mood === 'wow' ? 'smile' : (o.mood ?? 'smile'), look: (o.look ?? [0.7, 0])[0], seed: 21, ink: '#1e1a14', mouth: [2.5, -0.85], nose: [3.0, 0.25] }));
    });
  });
}
