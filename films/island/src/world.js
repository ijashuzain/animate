// The Island: frame constants, the mountain, props and characters (screen-like units; locked camera h = 1080).
const FONT = '"Nunito", sans-serif';
const SEA = 170, FLOOR = -440;
const C = {
  deep: '#06132a', mid: '#0d3358', shallow: '#1f7fa8', surf: '#5fd0e6', basalt: '#2a2733', basalt2: '#35303f', lava: '#ff7a2a', lavaHot: '#ffd36b',
  sand: '#e9cf98', green: '#4fa356', greenDark: '#2f7a40', crust: '#4a3a3a', crust2: '#5a4842', rock: '#3a3438',
};
// the mountain's surface height at x for a mountain of height H (above the floor), centred at cx
function mountainY(x, H, cx = 0, seed = 0) {
  if (H <= 0) return FLOOR;
  const W = 420 + 0.95 * H, u = Math.abs(x - cx) / W; if (u >= 1) return FLOOR;
  const crater = H > 650 ? Math.max(0, 1 - Math.abs(x - cx) / 60) * 26 : 0;
  return FLOOR + H * Math.pow(1 - Math.pow(u, 1.7), 1.25) - crater + K.noise(x * 0.02 + seed, 5 + seed) * 6 * Math.min(1, H / 300);
}
function mountainPts(H, cx = 0, seed = 0, step = 24) { const W = 420 + 0.95 * H, pts = [[cx - W - 40, FLOOR - 4]]; for (let x = cx - W; x <= cx + W; x += step) pts.push([x, mountainY(x, H, cx, seed)]); pts.push([cx + W + 40, FLOOR - 4]); return pts; }
// draw a volcano: layered basalt, pillow bumps under water; above water: rock, then green (veg 0..1), valleys, beach
function drawMountain(t, H, o = {}) {
  if (H <= 2) return;
  const cx = o.cx ?? 0, seed = o.seed ?? 0, pts = mountainPts(H, cx, seed), veg = o.veg ?? 0, sea = o.sea ?? SEA;
  P.smooth(pts, P.lin(cx, FLOOR + H, cx, FLOOR, C.basalt2, C.basalt), { tension: 0.2 });
  P.clip(() => P.trace(pts, true, 0.2), () => {
    // growth layers: each eruption's skin
    for (let k = 1; k <= 9; k++) { const h = H * (1 - k * 0.1); if (h < 20) break; P.smooth(mountainPts(h, cx, seed + k), k % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)', { tension: 0.2 }); }
    // pillows along the underwater skin
    for (let i = 0; i < 60; i++) { const x = cx + (K.hash(i, seed + 11) * 2 - 1) * (420 + 0.95 * H) * 0.95, y = mountainY(x, H, cx, seed) - 10 - K.hash(i, seed + 12) * 30; if (y > sea - 20) continue; const r = 14 + 14 * K.hash(i, seed + 13); P.lit(P.blobPts(x, y, r * 1.4, r, 9, 0.12, i + seed), '#262330', { d: 0.25, shade: 'rgba(0,0,0,0.35)', rim: 'rgba(160,190,230,0.35)', light: [-0.3, 0.9] }); }
    // above the sea: rock, then green, valleys
    if (FLOOR + H > sea) {
      P.rect(cx - 2000, sea - 6, 4000, 900, P.lin(cx, sea, cx, FLOOR + H, '#3a3438', '#25212a'));
      if (veg > 0) { P.alpha(K.clamp(veg), () => P.rect(cx - 2000, sea + 10, 4000, 900, P.lin(cx, sea, cx, FLOOR + H, C.green, C.greenDark))); }
      if (o.valleys) P.alpha(o.valleys, () => { for (const vx of [-140, -40, 80, 190]) P.ribbon([[cx + vx, mountainY(cx + vx, H, cx, seed) - 4], [cx + vx * 1.25, sea + 40], [cx + vx * 1.45, sea + 6]], [18, 12, 6], 'rgba(10,30,20,0.35)'); });
    }
  });
  if (o.beach && FLOOR + H > sea) { const W = 420 + 0.95 * H; let xl = cx, xr = cx; for (let x = cx; x > cx - W; x -= 4) if (mountainY(x, H, cx, seed) < sea) { xl = x; break; } for (let x = cx; x < cx + W; x += 4) if (mountainY(x, H, cx, seed) < sea) { xr = x; break; } P.alpha(o.beach, () => { P.smooth([[xl - 60, sea - 6], [xl + 30, sea + 14], [xl + 60, sea + 4], [xl + 40, sea - 8]], C.sand); P.smooth([[xr + 60, sea - 6], [xr - 30, sea + 14], [xr - 60, sea + 4], [xr - 40, sea - 8]], C.sand); }); }
}
// the plume of hot rock under the floor (cut-away), rising to `top`
function drawPlume(t, top, a = 1, cx = 0) {
  if (a <= 0) return;
  P.alpha(a, () => {
    const stem = []; for (let k = 0; k <= 8; k++) { const y = K.lerp(-1800, top - 80, k / 8); stem.push([cx + Math.sin(t * 0.8 + k) * 14, y]); }
    P.ribbon(stem, [260, 230, 200, 180, 170, 160, 160, 170, 190], P.lin(cx, top, cx, -1800, '#ff9a3a', '#b8301a'));
    P.lit(P.blobPts(cx, top - 70, 170, 80, 12, 0.08, 3), P.rad(cx, top - 50, 170, '#ffd36b', '#ff8a3a', '#d2421f'), { d: 0.15, rim: 'rgba(255,240,200,0.4)', shade: 'rgba(120,20,0,0.25)' });
    for (let i = 0; i < 12; i++) { const u = (t * 0.2 + i / 12) % 1; P.circle(cx + Math.sin(i * 2 + t) * 60, K.lerp(-1500, top - 60, u), 12 + 10 * K.hash(i, 3), `rgba(255,230,140,${0.6 * (1 - u)})`); }
    P.glow(cx, top - 40, 300, '255,140,60', 0.6);
  });
}
// the little camera on a tripod (REC light blinks)
function drawCam(t, x, y, s, rec = true) {
  P.at(x, y, 0, s, s, () => {
    for (const a of [-0.45, 0, 0.45]) P.ribbon([[0, 60], [Math.sin(a) * 70, 0]], [7, 5], '#8a8f9c');
    P.rect(-46, 60, 92, 56, P.lin(-46, 0, 46, 0, '#5a6070', '#3a3f4c'), { r: 10 });
    P.circle(46, 88, 22, '#22252e'); P.circle(50, 88, 14, P.rad(46, 92, 18, '#7fd0ff', '#1a3a5a')); P.circle(44, 94, 4, 'rgba(255,255,255,0.7)');
    if (rec && Math.sin(t * 5) > -0.2) { P.circle(-30, 104, 6, '#ff3b3b'); P.glow(-30, 104, 30, '255,60,60', 0.6); }
  });
}
// the little yellow submarine with a headlight and a robot arm (arm reach 0..1)
function drawSub(t, x, y, s, arm = 0) {
  P.at(x, y + Math.sin(t * 1.3) * 6, 0, s, s, () => {
    P.ctx.save(); P.ctx.globalCompositeOperation = 'lighter'; const g = P.ctx.createLinearGradient(120, 0, 520, 0); g.addColorStop(0, 'rgba(255,240,180,0.35)'); g.addColorStop(1, 'rgba(255,240,180,0)'); P.ctx.fillStyle = g; P.ctx.beginPath(); P.ctx.moveTo(120, 10); P.ctx.lineTo(560, 140); P.ctx.lineTo(560, -170); P.ctx.closePath(); P.ctx.fill(); P.ctx.restore();
    P.lit(P.blobPts(0, 0, 130, 62, 14, 0.02, 3), P.lin(0, 62, 0, -62, '#ffd84a', '#e8a91c'), { d: 0.15, rim: 'rgba(255,255,255,0.4)' });
    P.rect(-30, 50, 60, 36, '#e8a91c', { r: 8 }); P.circle(40, 6, 26, '#2a3a50'); P.circle(40, 6, 18, P.rad(34, 12, 22, '#bfe8ff', '#4a90c0')); P.circle(-30, 6, 14, '#2a3a50'); P.circle(-30, 6, 9, '#8fd0f0');
    const pr = t * 20; P.at(-134, 0, 0, Math.cos(pr) * 0.9 + 0.1, 1, () => P.rect(-6, -34, 12, 68, '#8a8f9c', { r: 5 }));
    P.circle(126, 4, 10, '#fff6cc'); P.glow(126, 4, 60, '255,240,180', 0.8);
    const e = [70 + arm * 50, -60 - arm * 40], h = [e[0] + 30 + arm * 30, e[1] - 40 - arm * 30];
    P.ribbon([[60, -50], e, h], [12, 10, 8], '#8a8f9c'); for (const k of [-1, 1]) P.ribbon([h, [h[0] + 14, h[1] - 10 + k * 8]], 5, '#6a6f7c');
  });
}
// the anglerfish: a dark round fish with a glowing lure; profile face
function drawAngler(t, x, y, s, dir = 1, mood = 'smile') {
  P.at(x, y + Math.sin(t * 1.7) * 8, Math.sin(t * 1.2) * 0.05, s * dir, s, () => {
    const lx = 70 + Math.sin(t * 2) * 6, ly = 96;
    P.ribbon([[10, 40], [50, 90], [lx, ly]], [5, 4, 3], '#3a3550'); P.glow(lx, ly, 70, '170,255,230', 0.9); P.circle(lx, ly, 8, '#d8fff0');
    P.poly([[-60, 0], [-96, 30 + Math.sin(t * 6) * 8], [-96, -30 + Math.sin(t * 6) * 8]], '#2a2540');
    P.lit(P.blobPts(0, 0, 66, 52, 12, 0.06, 7), P.rad(-10, 10, 80, '#5a5078', '#3a3352', '#241f38'), { d: 0.2, rim: 'rgba(170,255,230,0.35)', light: [0.8, 0.5] });
    for (let i = 0; i < 5; i++) P.poly([[36 + i * 7, -12], [40 + i * 7, -2], [44 + i * 7, -12]], '#f0f0f0');
    Cast.profileFace(t, 26, 16, 18, { mood, seed: 5, ink: '#0e0a18', mouth: [1.4, -1.6], nose: false, blush: 'rgba(255,120,160,0.25)' });
  });
}
// the crab in a nightcap; asleep (z's) or awake and running
function drawCrab(t, x, y, s, asleep = true) {
  P.at(x, y, 0, s, s, () => {
    for (const k of [-1, 1]) for (let i = 0; i < 3; i++) P.ribbon([[k * 20, 6], [k * (40 + i * 6), 14 + (asleep ? 0 : Math.sin(t * 20 + i) * 6)], [k * (50 + i * 8), -2]], [5, 4, 3], '#c43a2a');
    for (const k of [-1, 1]) { P.ribbon([[k * 30, 16], [k * 54, 34]], 6, '#d94a35'); P.blob(k * 62, 38, 16, 11, '#e85a40', { seed: k + 3 }); }
    P.lit(P.blobPts(0, 14, 44, 26, 12, 0.04, 2), P.lin(0, 40, 0, -10, '#ff7a5a', '#d4402c'), { d: 0.2 });
    for (const k of [-1, 1]) { P.ribbon([[k * 10, 34], [k * 14, 52]], 4, '#d4402c'); }
    Cast.face(t, 0, 50, 26, { mood: asleep ? 'sleep' : 'wow', seed: 9, ink: '#2a0a0a' });
  });
}
// a voyaging canoe: two hulls, a crab-claw sail, a few people
function drawCanoe(t, x, y, s) {
  P.at(x, y + Math.sin(t * 1.6) * 4, Math.sin(t * 1.6) * 0.03, s, s, () => {
    P.poly([[-60, 70], [-30, 300], [60, 110]], '#e8d8b0'); P.ribbon([[-30, 30], [-60, 70], [-30, 300]], 6, '#7a5030');
    for (const dy of [0, 14]) P.smooth([[-170, 20 + dy], [170, 20 + dy], [140, -4 + dy], [-150, -4 + dy]], dy ? '#6e4024' : '#8a5a34');
    P.rect(-120, 22, 240, 10, '#6e4024');
    for (const [px, c] of [[-90, '#ff7b54'], [-30, '#4f7fc4'], [40, '#ffd36b'], [100, '#3f9f55']]) P.at(px, 30, 0, 1, 1, () => Cast.person(t, 0, 70, { pose: 'stand', kid: false, shirt: c, skin: '#c98a5a', hair: '#1e1612', mood: 'happy', seed: px }));
  });
}
