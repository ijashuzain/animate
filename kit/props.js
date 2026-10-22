// kit/props.js — props harvested from finished films (y up, local units; see studio/references/kit-gallery.png).
// Props.volcano(t, H, o)        a volcano cross-section of height H above o.floor (default -440), sea at o.sea (170):
//                               growth layers, pillow lava under water, rock / vegetation (o.veg 0..1), o.valleys, o.beach, o.cx, o.seed.
//                               Props.volcanoY(x, H, cx, seed, floor) is its surface (to stand things on it)
// Props.plume(t, top, a, cx)    a glowing mantle plume rising to y = top (cut-away under the floor)
// Props.eruption(t, u, x, sea, seed)  one blast at the surface, u = 0..1 its life: flash, ash column, spray ring, hot rocks
// Props.canoe(t, x, y, s)       a voyaging canoe with four people;  Props.house(x, y, s, col, seed);  Props.waterwheel(t, x, y, s)
// Props.signpost(t, x, y, s, arms, u, font)  arms: [[title, sub, dir ±1, height, dot colour], ...], u: pop-in 0..1 per arm
// Props.raindrop(t, x, y, s, bun 0..1, seeds 0..1)  sphere -> hamburger-bun raindrop;  Props.saltCrystal(x, y, s, rot)
// Props.conifer(t, height, o)   a conifer from sapling to ancient giant (o.x, o.seed, o.fade + o.haze for distance);
// Props.tower(t, x)             an 84 m glass tower;  Props.wingedSeed(x, y, s, spin, rot)  a winged seed (spins like a helicopter)
const Props = {};
Props.volcanoY = function (x, H, cx = 0, seed = 0, FLOOR = -440) {
  if (H <= 0) return FLOOR;
  const W = 420 + 0.95 * H, u = Math.abs(x - cx) / W; if (u >= 1) return FLOOR;
  const crater = H > 650 ? Math.max(0, 1 - Math.abs(x - cx) / 60) * 26 : 0;
  return FLOOR + H * Math.pow(1 - Math.pow(u, 1.7), 1.25) - crater + K.noise(x * 0.02 + seed, 5 + seed) * 6 * Math.min(1, H / 300);
}
Props.volcanoPts = function (H, cx = 0, seed = 0, step = 24, FLOOR = -440) { const W = 420 + 0.95 * H, pts = [[cx - W - 40, FLOOR - 4]]; for (let x = cx - W; x <= cx + W; x += step) pts.push([x, Props.volcanoY(x, H, cx, seed, FLOOR)]); pts.push([cx + W + 40, FLOOR - 4]); return pts; }
Props.volcano = function (t, H, o = {}) {
  const FLOOR = o.floor ?? -440;
  if (H <= 2) return;
  const cx = o.cx ?? 0, seed = o.seed ?? 0, pts = Props.volcanoPts(H, cx, seed, 24, FLOOR), veg = o.veg ?? 0, sea = o.sea ?? 170;
  P.smooth(pts, P.lin(cx, FLOOR + H, cx, FLOOR, '#35303f', '#2a2733'), { tension: 0.2 });
  P.clip(() => P.trace(pts, true, 0.2), () => {
    // growth layers: each eruption's skin
    for (let k = 1; k <= 9; k++) { const h = H * (1 - k * 0.1); if (h < 20) break; P.smooth(Props.volcanoPts(h, cx, seed + k, 24, FLOOR), k % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)', { tension: 0.2 }); }
    // pillows along the underwater skin
    for (let i = 0; i < 60; i++) { const x = cx + (K.hash(i, seed + 11) * 2 - 1) * (420 + 0.95 * H) * 0.95, y = Props.volcanoY(x, H, cx, seed, FLOOR) - 10 - K.hash(i, seed + 12) * 30; if (y > sea - 20) continue; const r = 14 + 14 * K.hash(i, seed + 13); P.lit(P.blobPts(x, y, r * 1.4, r, 9, 0.12, i + seed), '#262330', { d: 0.25, shade: 'rgba(0,0,0,0.35)', rim: 'rgba(160,190,230,0.35)', light: [-0.3, 0.9] }); }
    // above the sea: rock, then green, valleys
    if (FLOOR + H > sea) {
      P.rect(cx - 2000, sea - 6, 4000, 900, P.lin(cx, sea, cx, FLOOR + H, '#3a3438', '#25212a'));
      if (veg > 0) { P.alpha(K.clamp(veg), () => P.rect(cx - 2000, sea + 10, 4000, 900, P.lin(cx, sea, cx, FLOOR + H, '#4fa356', '#2f7a40'))); }
      if (o.valleys) P.alpha(o.valleys, () => { for (const vx of [-140, -40, 80, 190]) P.ribbon([[cx + vx, Props.volcanoY(cx + vx, H, cx, seed, FLOOR) - 4], [cx + vx * 1.25, sea + 40], [cx + vx * 1.45, sea + 6]], [18, 12, 6], 'rgba(10,30,20,0.35)'); });
    }
  });
  if (o.beach && FLOOR + H > sea) { const W = 420 + 0.95 * H; let xl = cx, xr = cx; for (let x = cx; x > cx - W; x -= 4) if (Props.volcanoY(x, H, cx, seed, FLOOR) < sea) { xl = x; break; } for (let x = cx; x < cx + W; x += 4) if (Props.volcanoY(x, H, cx, seed, FLOOR) < sea) { xr = x; break; } P.alpha(o.beach, () => { P.smooth([[xl - 60, sea - 6], [xl + 30, sea + 14], [xl + 60, sea + 4], [xl + 40, sea - 8]], '#e9cf98'); P.smooth([[xr + 60, sea - 6], [xr - 30, sea + 14], [xr - 60, sea + 4], [xr - 40, sea - 8]], '#e9cf98'); }); }
}
Props.plume = function (t, top, a = 1, cx = 0) {
  if (a <= 0) return;
  P.alpha(a, () => {
    const stem = []; for (let k = 0; k <= 8; k++) { const y = K.lerp(-1800, top - 80, k / 8); stem.push([cx + Math.sin(t * 0.8 + k) * 14, y]); }
    P.ribbon(stem, [260, 230, 200, 180, 170, 160, 160, 170, 190], P.lin(cx, top, cx, -1800, '#ff9a3a', '#b8301a'));
    P.lit(P.blobPts(cx, top - 70, 170, 80, 12, 0.08, 3), P.rad(cx, top - 50, 170, '#ffd36b', '#ff8a3a', '#d2421f'), { d: 0.15, rim: 'rgba(255,240,200,0.4)', shade: 'rgba(120,20,0,0.25)' });
    for (let i = 0; i < 12; i++) { const u = (t * 0.2 + i / 12) % 1; P.circle(cx + Math.sin(i * 2 + t) * 60, K.lerp(-1500, top - 60, u), 12 + 10 * K.hash(i, 3), `rgba(255,230,140,${0.6 * (1 - u)})`); }
    P.glow(cx, top - 40, 300, '255,140,60', 0.6);
  });
}
Props.canoe = function (t, x, y, s) {
  P.at(x, y + Math.sin(t * 1.6) * 4, Math.sin(t * 1.6) * 0.03, s, s, () => {
    P.poly([[-60, 70], [-30, 300], [60, 110]], '#e8d8b0'); P.ribbon([[-30, 30], [-60, 70], [-30, 300]], 6, '#7a5030');
    for (const dy of [0, 14]) P.smooth([[-170, 20 + dy], [170, 20 + dy], [140, -4 + dy], [-150, -4 + dy]], dy ? '#6e4024' : '#8a5a34');
    P.rect(-120, 22, 240, 10, '#6e4024');
    for (const [px, c] of [[-90, '#ff7b54'], [-30, '#4f7fc4'], [40, '#ffd36b'], [100, '#3f9f55']]) P.at(px, 30, 0, 1, 1, () => Cast.person(t, 0, 70, { pose: 'stand', kid: false, shirt: c, skin: '#c98a5a', hair: '#1e1612', mood: 'happy', seed: px }));
  });
}
Props.house = function (x, y, s, col, seed) { P.at(x, y, 0, s, s, () => { P.rect(-50, 0, 100, 80, P.lin(-50, 0, 50, 0, '#fff7e6', col ?? '#fff0d4')); P.poly([[-62, 76], [62, 76], [0, 130]], K.hash(seed, 1) > 0.5 ? '#e35d4f' : '#4f7fc4'); P.rect(-30, 30, 22, 22, '#ffd36b', { r: 3 }); P.rect(10, 0, 22, 40, '#8a5a3a', { r: 3 }); }); }
Props.waterwheel = function (t, x, y, s) { P.at(x, y, 0, s, s, () => { P.ctx.save(); P.ctx.rotate(-t * 1.6); for (let i = 0; i < 10; i++) { P.ctx.save(); P.ctx.rotate(i * Math.PI / 5); P.rect(-6, 0, 12, 120, '#6e4024'); P.rect(-26, 110, 52, 18, '#a8683c', { r: 3 }); P.ctx.restore(); } P.ctx.restore(); P.circle(0, 0, 22, '#6e4024'); P.circle(0, 0, 10, '#a8683c'); }); }
Props.raindrop = function (t, x, y, s, k = 0, seeds = 0) {
  P.at(x, y, 0, s, s, () => {
    const pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a); let ry = sn < 0 ? K.lerp(1, 0.45, k) : K.lerp(1, 0.85, k); pts.push([c * K.lerp(1, 1.18, k) * 100, sn * ry * 100 + (sn < 0 ? 0 : 0)]); }
    P.lit(pts, P.rad(-30, 40, 160, '#bfe9ff', '#58b8f0', '#2a86c8'), { d: 0.14, shade: 'rgba(10,60,130,0.25)', rim: 'rgba(255,255,255,0.55)' });
    P.circle(-38, 46, 22, 'rgba(255,255,255,0.6)', { ry: 12, rot: 0.6 });
    if (seeds > 0) P.alpha(seeds, () => { for (let i = 0; i < 9; i++) { const sx2 = (K.hash(i, 5) * 2 - 1) * 80, sy2 = 30 + K.hash(i, 6) * 40; P.circle(sx2, sy2, 7, '#fff3c8', { ry: 4, rot: K.hash(i, 7) * 3 }); } });
  });
}
Props.saltCrystal = function (x, y, s, rot = 0) { P.at(x, y, rot, s, s, () => { P.poly([[0, 40], [40, 20], [0, 0], [-40, 20]], '#ffffff'); P.poly([[-40, 20], [0, 0], [0, -46], [-40, -26]], '#dfe8f3'); P.poly([[0, 0], [40, 20], [40, -26], [0, -46]], '#c4d2e4'); }); }
Props.tower = function (t, x) {
  P.at(x, 0, 0, 1, 1, () => {
    P.rect(-7, 0, 14, 84, P.lin(-7, 0, 7, 0, '#9cc6ee', '#5b8fc9', '#3b6aa0'));
    for (let f = 0; f < 27; f++) for (let w = 0; w < 6; w++) P.rect(-6 + w * 2.05, 1 + f * 3.1, 1.5, 1.9, K.hash(f, w) > 0.7 ? 'rgba(255,230,150,0.55)' : 'rgba(255,255,255,0.12)');
    P.rect(-7.6, 83, 15.2, 1.6, '#2f557f'); P.rect(-0.2, 84.6, 0.4, 5, '#2f557f'); P.circle(0, 89.8, 0.5, '#ff5a5a'); P.glow(0, 89.8, 3, '255,90,90', 0.5 + 0.5 * Math.sin(t * 6));
  });
}
Props.conifer = function (t, ht, o = {}) {
  if (ht <= 0) return;
  const hz = (c) => (o.fade ? P.mixc(c, o.haze, o.fade) : c), x0 = o.x ?? 0, seed = o.seed ?? 0;
  const age = K.clamp((ht - 8) / 60), wb = 0.004 + 0.085 * ht * (1 + 0.25 * K.clamp((ht - 40) / 44)), sway = (u) => x0 + Math.sin(t * 1.1 + u * 3 + seed) * 0.01 * ht * u * u;
  const n = 14, trunk = [], widths = [];
  for (let i = 0; i <= n; i++) { const u = i / n; trunk.push([sway(u), u * ht]); widths.push(wb * Math.pow(1 - u, 0.85) * (1 + 0.7 * Math.pow(1 - u, 8) * age) + 0.002); }
  const crown0 = K.lerp(0.06, 0.45, age), tiers = Math.round(K.lerp(6, 12, K.clamp(ht / 20)));
  const prof = (u) => { const v = K.clamp((u - crown0) / (1 - crown0)); return ht * (K.lerp(0.34, 0.2, age) * (1 - v) + age * 0.27 * Math.sin(Math.PI * Math.min(1, v * 1.1))); };
  P.ribbon(trunk, widths, P.lin(x0 - wb / 2, 0, x0 + wb / 2, 0, hz('#c9673a'), hz('#a24f2c'), hz('#6e2f1b')));
  if (ht > 1.5) for (let f = 0; f < 5; f++) { const fx = x0 + (f - 2) * wb * 0.17; P.ribbon([[fx, 0], [fx - x0 + sway(0.3), ht * 0.3], [fx - x0 + sway(0.6), ht * 0.62]], [wb * 0.04, wb * 0.028, 0.001], 'rgba(70,25,15,0.4)'); }
  for (let i = 0; i < tiers; i++) {
    const u = K.lerp(crown0, 0.93, i / (tiers - 1)), y = u * ht, w = prof(u) + ht * 0.03, cx = sway(u) + (K.hash(i, seed + 5) - 0.5) * w * 0.25 * age, droop = w * K.lerp(0.42, 0.18, age);
    const top = hz('#62a454'), mid = hz('#3b7a3c'), bot = hz('#24522f');
    if (age < 0.85) P.alpha(1 - age * 0.6, () => {
      const pts = [[cx - w, y - droop], [cx - w * 0.5, y + w * 0.12], [cx, y + w * 0.3], [cx + w * 0.5, y + w * 0.12], [cx + w, y - droop], [cx + w * 0.4, y - droop * 0.55], [cx, y - droop * 0.3], [cx - w * 0.4, y - droop * 0.55]];
      P.lit(pts, P.lin(cx, y + w * 0.3, cx, y - droop, top, mid, bot), { light: [-0.4, 0.9], shade: 'rgba(10,40,30,0.25)', rim: 'rgba(230,255,190,0.3)', d: 0.16 });
    });
    if (age > 0) for (let k = 0; k < 3; k++) { const kx = cx + (k - 1) * w * 0.62, ky = y + (k === 1 ? w * 0.18 : -droop * 0.2), r = w * (k === 1 ? 0.55 : 0.45); P.alpha(age, () => P.lit(P.blobPts(kx, ky, r, r * 0.62, 10, 0.22, i * 3 + k + seed), P.lin(kx, ky + r * 0.6, kx, ky - r * 0.6, top, mid, bot), { light: [-0.45, 0.9], shade: 'rgba(10,40,30,0.3)', rim: 'rgba(230,255,190,0.28)', d: 0.25 })); }
  }
  P.poly([[sway(1) - ht * 0.025, ht * 0.95], [sway(1), ht * 1.03], [sway(1) + ht * 0.025, ht * 0.95]], hz('#62a454'));
}
Props.wingedSeed = function (x, y, s = 1, spin = 0, rot = 0) {
  const sx = Math.cos(spin) * 0.85 + 0.15 * Math.sign(Math.cos(spin) || 1);
  P.at(x, y, rot, s * sx, s, () => {
    P.lit(P.blobPts(0, 0, 2.6, 2.0, 10, 0.08, 4), '#d9b483', { d: 0.12, rim: 'rgba(255,255,255,0.35)' });
    P.circle(0, 0, 2.3, 'rgba(255,250,230,0.18)', { ry: 1.7 });
    P.lit(P.blobPts(0, 0.1, 1.05, 1.5, 9, 0.06, 7), '#7a4a2a', { d: 0.25, rim: 'rgba(255,220,180,0.45)' });
  });
}
Props.eruption = function (t, u, sx, sea = 170, seed = 0) {
  if (u <= 0 || u >= 1) return;
  if (u < 0.2) P.glow(sx, sea, 520, '255,200,140', (0.2 - u) * 5);
  P.layer(1 - u * 0.55, () => P.clip(() => { P.ctx.beginPath(); P.ctx.rect(sx - 9000, sea - 4, 18000, 6000); }, () => { for (let k = 0; k < 4; k++) Nature.cloud(sx + Math.sin(k * 2 + seed) * 40 * u, sea + 40 + k * 150 * u, (0.9 + u * 2.1) * (1 - k * 0.15), seed + k, P.mixc(k % 2 ? '#d8d6e0' : '#a8a4b4', '#5a5662', u * 0.8)); }));
  P.ctx.save(); P.ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; P.ctx.lineWidth = 8; P.ctx.beginPath(); P.ctx.ellipse(sx, sea, 120 + u * 520, 30 + u * 60, 0, Math.PI, 2 * Math.PI, true); P.ctx.stroke(); P.ctx.restore();
  for (let i = 0; i < 12; i++) { const a = 0.35 + i * 0.2, d = u * 760, x = sx + Math.cos(a) * d * 0.8, y = sea + Math.sin(a) * d - u * u * 620; P.lit(P.blobPts(x, y, 14, 11, 7, 0.2, i), '#2a2428', { d: 0.3, rim: 'rgba(255,140,60,0.5)' }); P.glow(x, y, 34, '255,120,40', 0.7 * (1 - u)); }
};
Props.signpost = function (t, x, y, s, arms, u = [], font = 'sans-serif') {
  const wood = '#a8683c', woodDark = '#6e4024';
  P.at(x, y, 0, s, s, () => {
    P.rect(-10, 0, 20, 40 + Math.max(...arms.map((a) => a[3])), P.lin(-10, 0, 10, 0, wood, woodDark), { r: 4 });
    arms.forEach(([a, b, dir, ay, col], i) => {
      const k = K.ease.backOut(K.clamp(u[i] ?? 1)); if (k <= 0) return;
      P.at(0, ay, Math.sin(t * 2 + i) * 0.02, k, k, () => {
        const w = 300, pts = dir > 0 ? [[0, -34], [w, -34], [w + 40, 0], [w, 34], [0, 34]] : [[0, -34], [-w, -34], [-w - 40, 0], [-w, 34], [0, 34]];
        P.lit(pts, P.lin(0, 34, 0, -34, P.mixc(wood, '#ffffff', 0.15), wood), { d: 0.1, rim: 'rgba(255,230,190,0.35)' });
        P.circle(dir * 30, 0, 14, col);
        P.at(dir * (w / 2 + 20), 0, 0, 1, -1, () => { const ctx = P.ctx; ctx.fillStyle = '#3a2210'; ctx.textAlign = 'center'; ctx.font = `800 30px ${font}`; ctx.fillText(a, 0, b ? -2 : 10); if (b) { ctx.font = `600 22px ${font}`; ctx.fillText(b, 0, 24); } });
      });
    });
  });
};
