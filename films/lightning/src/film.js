// How a Cloud Builds a Lightning Bolt: a flash seen from a farmhouse porch, nine seconds to the bang; then we fly out to
// the strike (a lone tree about 3 km away), watch the cloud build and charge in a cutaway, and slow the strike down a
// thousand times; the sound comes back across the 3 km to the house at the end.
const T = { flash: 0.6, bang: 9.6, out: 10.2, in: 11.4, rise: 11.6, cut: 24, cold: 26, zoomC: 36, hits: [38.6, 41.6, 44.6], back: 49.5, sort: 51, ground: 56, low: 61.5,
  lead: 70, near: 84, hush: 94, ret: 96.5, re: [101.5, 103.8, 106.0], thunder: 108, home: 117.5, porch: 118.7, arrive: 127.4, D: 129 };
// story time in the strike (ms): 0 when the leader leaves the cloud; slow motion until the thunder, then real time
const MS = track([[T.lead, 0], [T.near, 15, 'linear'], [T.hush, 18, 'linear'], [T.ret, 18], [99, 18.1, 'linear'], [T.thunder, 120, 'linear'], [T.home, 9520, 'linear']]);
const TREE_TOP = [TREE.x, TREE.h * 0.95];
const LEAD = Nature.boltPath(11, [-260, 1500], TREE_TOP, 60);
const STR = [Nature.boltPath(21, TREE_TOP, [TREE_TOP[0] - 4, TREE_TOP[1] + 22], 3), Nature.boltPath(22, [BARN.x, 11.8], [BARN.x - 2, 21], 2.5), Nature.boltPath(23, [-38, 1.4], [-38.5, 6], 1.2)];
const REV = { main: LEAD.main.slice().reverse(), branches: [], n: LEAD.n };
// the leader's growth: in steps (each jump fast, then a pause), stopping a hand's width above the streamer
const leaderReveal = (t) => {
  const stopAt = 1 - 30 / (1500 - TREE_TOP[1]);
  if (t < T.lead) return 0; if (t >= T.ret) return 1;
  const raw = t < T.near ? 0.92 * K.inv(T.lead, T.near, t) : lerp(0.92, stopAt, K.ease.out(K.inv(T.near, T.hush - 0.6, t)));
  const n = LEAD.n, f = raw * n, i = Math.floor(f), frac = f - i;
  return Math.min(stopAt, (i + clamp(frac * 4)) / n);
};
const tipOf = (path, u) => { const f = u * (path.main.length - 1), i = Math.min(path.main.length - 2, Math.floor(f)), k = f - i, p = path.main[i], q = path.main[i + 1]; return [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]; };
// brightness of the channel after it connects: the return stroke, then the re-strikes (dart leaders), then afterglow
function strokeLight(t) {
  if (t < T.ret) return 0;
  let b = t < T.ret + 2.5 ? 1 : Math.exp(-(t - T.ret - 2.5) * 1.5) * 0.9 + 0.1;
  for (const r of T.re) if (t > r - 0.15) b = Math.max(b, t < r ? 0.5 : Math.exp(-(t - r) * 3));
  return t > T.thunder ? b * Math.exp(-(t - T.thunder) * 0.8) : b;
}
const flashAt = (t) => (t > T.flash && t < T.flash + 0.5 ? Math.exp(-(t - T.flash) * 7) * (0.7 + 0.3 * Math.sin((t - T.flash) * 60)) : 0);
const pill = (str, sx, sy, u, o = {}) => P.pill(str, sx, sy, Object.assign({ u, font: FONT, size: 40, weight: 400 }, o));
const STOPWATCH = (ctx, r) => { ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.75, 0, 6.3); ctx.stroke(); ctx.fillStyle = '#1a2a4a'; ctx.fillRect(-r * 0.18, -r * 0.95, r * 0.36, r * 0.25); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, r * 0.1); ctx.lineTo(r * 0.35, -r * 0.3); ctx.stroke(); };

// ---------- the porch (hook + ending): its own metres, house at x = -4, the far field on the horizon ----------
const FAR = { x: 7.2, y: 1.25, sc: 1 / 1500 };
function porch(t) {
  const end = t > T.home, cam = { x: 2, y: 5.4, h: end ? lerp(15.4, 14.8, tw(t, T.porch, T.D)) : lerp(15.8, 15, tw(t, 0, T.bang)) };
  const shake = (t > T.bang ? Math.exp(-(t - T.bang) * 4) * Math.sin(t * 70) * 0.06 : 0) + (end && t > T.arrive ? Math.exp(-(t - T.arrive) * 4) * Math.sin(t * 70) * 0.05 : 0);
  if (t > T.out && t < T.in) { const z = K.ease.in(K.inv(T.out, T.in, t)); cam.x = lerp(cam.x, FAR.x + CLOUD.cx * FAR.sc, z); cam.y = lerp(cam.y, FAR.y + 3600 * FAR.sc, z); cam.h = Math.exp(lerp(Math.log(cam.h), Math.log(8500 * FAR.sc), z)); }
  cam.x += shake; P.cam(cam);
  const fl = end ? 0 : flashAt(t);
  skyAndHills(t, P.toScreen(0, FAR.y)[1], fl);
  // the far storm and the lone tree on the horizon (about 3 km away)
  P.at(FAR.x, FAR.y, 0, FAR.sc, FAR.sc, () => Nature.stormCloud(t, CLOUD.cx, CLOUD.base, { w: CLOUD.w, top: CLOUD.top, anvil: 0.6, col: { top: P.mixc('#5c5f9e', '#d8d0ff', fl), mid: P.mixc('#383b78', '#b0a8f0', fl), under: '#1e2048' } }));
  Nature.oak(t, FAR.x, FAR.y - 0.05, 0.75, { col: '#24402e', dark: '#18301f', light: '#2f5238', sway: 0 }); Props.barn(FAR.x + 1.1, FAR.y - 0.04, 0.05, { lit: 0.8 });
  if (fl > 0.05) { const path = Nature.boltPath(4, [FAR.x - 0.25, FAR.y + CLOUD.base * FAR.sc], [FAR.x, FAR.y + 0.68], 0.12); Nature.bolt(path, { alpha: Math.min(1, fl * 1.8), px: 5, glow: C.bolt }); P.glow(FAR.x, FAR.y + 0.3, 2, '200,190,255', fl); }
  // the ground plane up to the horizon, the near yard
  P.poly([[-40, -6], [40, -6], [40, FAR.y], [-40, FAR.y]], P.lin(0, FAR.y, 0, -2, P.mixc('#2a4a3a', '#6a8ab0', fl * 0.5), '#1e3a28'));
  for (let i = 0; i < 40; i++) Nature.grass(t, -14 + i * 0.8 + hash(i, 3) * 0.4, -0.1 - hash(i, 4) * 0.6, 0.35 + hash(i, 5) * 0.2, { col: '#2f5a3a' });
  // the sound coming back (ending): rings across the field from the tree to the house, with km marks as it passes
  if (end) {
    const R = (FAR.x + 8) * clamp((t - T.porch - 0.2) / (T.arrive - T.porch - 0.2));
    for (let k = 0; k < 3; k++) { const r = R - k * 0.6; if (r > 0) P.alpha((1 - k * 0.3) * (t < T.arrive + 0.6 ? 1 : 1 - tw(t, T.arrive + 0.6, T.arrive + 1.4)), () => { P.ctx.save(); P.ctx.strokeStyle = 'rgba(255,240,220,0.75)'; P.ctx.lineWidth = 3 / P.k; P.ctx.setLineDash([12 / P.k, 10 / P.k]); P.ctx.beginPath(); P.ctx.ellipse(FAR.x, FAR.y - 0.3, r, r * 0.55, 0, 0, Math.PI); P.ctx.stroke(); P.ctx.restore(); }); }
    for (const [km, u] of [[1, 1 / 3], [2, 2 / 3], [3, 1]]) { const x = FAR.x - (FAR.x + 8) * u, s = P.toScreen(x, -0.35); pill(`${km} km`, s[0], s[1] + 40, tw(t, T.porch + 0.2 + (T.arrive - T.porch) * u - 0.2, T.porch + 0.2 + (T.arrive - T.porch) * u + 0.2), { size: 32 }); }
  }
  // the fence and the cows in their paddock (right); the farmer and the dog hurrying in (hook)
  for (let i = 0; i < 6; i++) P.rect(9.5 + i * 1.8, 0, 0.12, 1.1, '#4a3a30'); P.rect(9.5, 0.85, 9, 0.08, '#5a483c'); P.rect(9.5, 0.45, 9, 0.08, '#5a483c');
  for (const [x, dir, sd, tint, s] of [[11, -1, 1, '#f2ede4', 0.0105], [13.6, 1, 2, '#e8d8c4', 0.011], [16, -1, 3, '#f2ede4', 0.01]]) Animals.quad(t, x, 0.35, s, Object.assign({}, Animals.SPEC.cow, { col: tint }), { dir, seed: sd, look: t > T.flash ? [0, 1] : undefined });
  if (!end && t < 6.4) {
    const u = tw(t, 1.0, 6.0, 'inOut'), fx = lerp(15, -4.8, u), a = 1 - tw(t, 5.6, 6.2);
    P.alpha(a, () => { Animals.quad(t, fx - 1.6, 0, 0.012, 'dog', { dir: -1, walk: 2, seed: 2 }); Cast.person(t, fx, 1.55, { kid: false, shirt: '#7a8a4a', pants: '#3a3a4a', pose: u > 0 && u < 1 ? 'walk' : 'stand', dir: -1, seed: 3, hair: '#5a4a3a' }); });
  }
  // birds leaving ahead of the storm (flying left, facing left)
  for (let i = 0; i < 4; i++) { const u = ((t * 0.08 + i * 0.27) % 1); Nature.bird(t, lerp(18, -14, u), 8.5 + i * 0.6 + Math.sin(t + i) * 0.2, 0.006, i, -1, '#2a2a40'); }
  farmhouse(t, -5, 1, 0);
  const win = windowWithFamily(t, -5, 0, [FAR.x * 100, 300]);
  // counting: one, two, ... nine (the hook), then "about 3 km" (the end)
  if (!end) for (let n = 1; n <= 9; n++) { const t0 = T.flash + n; const s = P.toScreen(win[0], win[1]); pill(`${n}`, s[0], s[1] - 30, tw(t, t0 - 0.05, t0 + 0.1) * (1 - tw(t, t0 + 0.75, t0 + 0.95)), { size: 64 }); }
  if (!end) { const s = P.toScreen(win[0], win[1]); pill('9 seconds', s[0], s[1] - 30, tw(t, T.bang + 0.1, T.bang + 0.3), { size: 48 }); }
  if (end) { const s = P.toScreen(win[0], win[1]); pill('about 1 km every 3 seconds', 960, 140, tw(t, T.porch + 0.6, T.porch + 1.1) * (1 - tw(t, T.arrive - 1.2, T.arrive - 0.6)), { size: 40 }); pill('9 seconds: about 3 km away', s[0] + 140, s[1] - 30, tw(t, T.arrive + 0.2, T.arrive + 0.6), { size: 44 }); }
  Nature.rain(t, end ? 0.9 : tw(t, 3, 9) * 0.7);
  if (fl > 0) P.haze('#e8e4ff', fl * 0.35);
}
// ---------- the field (metres): the cloud, the cutaway, the strike ----------
function fieldCam(t) {
  const tip = tipOf(LEAD, leaderReveal(t));
  if (t < T.lead - 0.01 || t >= T.home) {
    const keys = [[T.out, [-200, 3600], 8500], [T.in, [-200, 3600], 8500], [T.rise + 9.6, [-200, 5600], 14500], [T.zoomC, [-200, 5600], 14500], [T.zoomC + 1.5, [-200, 6300], 1700], [T.back, [-200, 6300], 1700],
      [T.sort, [-200, 5600], 14500], [T.low, [-200, 5600], 14500], [T.low + 2.6, [-150, 900], 2600], [T.lead, [-150, 900], 2600], [T.D, [-150, 900], 2600]];
    let i = 1; while (i < keys.length - 1 && t > keys[i][0]) i++;
    const a = keys[i - 1], b = keys[i], u = K.ease.inOut(K.inv(a[0], b[0], t));
    return { x: lerp(a[1][0], b[1][0], u), y: lerp(a[1][1], b[1][1], u), h: Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), u)) };
  }
  // follow the leader down; then the close-up on the tree; the pull-out with the return stroke; the thunder
  if (t < T.near) { const u = K.inv(T.lead, T.near, t), h = Math.exp(lerp(Math.log(2600), Math.log(420), K.ease.inOut(u))); return { x: lerp(-150, tip[0] * 0.5, u), y: Math.max(tip[1] - h * 0.15, h * 0.42), h }; }
  if (t < T.ret + 0.3) { const u = K.ease.inOut(K.inv(T.near, T.near + 2.2, t)); return { x: lerp(tip[0] * 0.5, 16, u), y: lerp(Math.max(tip[1] - 63, 176), 27, u), h: Math.exp(lerp(Math.log(420), Math.log(58), u)) }; }
  const u = K.ease.inOut(K.inv(T.ret + 0.3, T.ret + 3.3, t)), h = Math.exp(lerp(Math.log(58), Math.log(2300), u));
  return { x: lerp(16, -130, u), y: lerp(27, 980, u), h: t > T.thunder ? h * (1 + 0.15 * tw(t, T.thunder, T.home)) : h };
}
function fieldScene(t) {
  const cam = fieldCam(t); P.cam(cam);
  const L = strokeLight(t), fl = L * (t > T.ret && t < T.ret + 0.6 ? 1 : 0.5);
  skyAndHills(t, P.toScreen(0, 0)[1], fl * 0.6);
  // the cloud: it builds while we rise; the near half opens as a cutaway; charges sort into layers
  const grow = lerp(0.3, 1, tw(t, T.rise, T.rise + 9)), puffs = Nature.stormPuffs(CLOUD.cx, CLOUD.base, { w: CLOUD.w * lerp(0.45, 1, grow), top: CLOUD.top, grow, anvil: 0.6 });
  if (cam.h > 900) {
    // updrafts rising from the warm fields into the cloud while it builds
    for (let i = 0; i < 14; i++) updraft(CLOUD.cx + (hash(i, 1) - 0.5) * CLOUD.w * 0.8 * lerp(0.45, 1, grow), hash(i, 2) * 1200, (puffs.H + 1500) * 0.9, tw(t, T.rise + 0.5, T.rise + 2) * (1 - tw(t, T.cut, T.cut + 1)), t, i);
    Nature.stormCloud(t, CLOUD.cx, CLOUD.base, { puffs, col: { top: P.mixc(C.cloud.top, '#e0d8ff', fl), mid: P.mixc(C.cloud.mid, '#b8b0f0', fl), under: C.cloud.under } });
    cutaway(t, puffs);
    ruler(CLOUD.cx - CLOUD.w * 1.25, 10000, tw(t, T.rise + 6, T.rise + 8) * (1 - tw(t, T.zoomC - 0.5, T.zoomC)));
    if (cam.h > 8000) { const s = P.toScreen(CLOUD.cx - CLOUD.w * 1.25, 10000); pill('10 km', s[0] + 70, s[1], tw(t, T.rise + 7.5, T.rise + 8.1) * (1 - tw(t, T.zoomC - 0.5, T.zoomC)), { size: 34 }); }
    // the ground below the cloud turns positive
    const gp = tw(t, T.ground, T.ground + 2.5) * (1 - tw(t, T.lead + 4, T.lead + 6));
    if (gp > 0) for (let i = 0; i < 34; i++) { const x = CLOUD.cx - 5000 + i * 300; particle('none', x, 12 / P.k, 7, gp, 1); }
  }
  // the field: grass, fence, barn, the lone tree, cows
  field(t, fl);
  const barnTip = Props.barn(BARN.x, 0, 1, { lit: 0.85 });
  Nature.oak(t, TREE.x, 0, TREE.h, { sway: 0.012 });
  cows(t, t > T.near);
  // crackles at the cloud base before the strike
  if (t > T.low + 1 && t < T.lead + 2) for (let i = 0; i < 6; i++) { const ph = (t * 1.3 + hash(i, 1)) % 1; if (ph < 0.18) { const x = CLOUD.cx + (hash(i, 2) - 0.5) * 5000, p = Nature.boltPath(40 + i + Math.floor(t * 1.3), [x, 1500], [x + 120, 1350], 40); Nature.bolt(p, { alpha: 0.6 * (1 - ph / 0.18), px: 1.5, glow: C.leader, core: '#d8ccff', branchA: 0.4 }); } }
  // the strike: the stepped leader (faint violet), the streamers, the return stroke (white, up), re-strikes, afterglow
  const lr = leaderReveal(t);
  if (lr > 0 && t < T.ret) Nature.bolt(LEAD, { reveal: lr, alpha: 0.75, px: 2.2, glow: C.leader, core: '#c8b8ff', branchA: 0.7 });
  if (t > T.near + 0.5 && t < T.ret + 0.2) STR.forEach((p, i) => Nature.bolt(p, { reveal: clamp((t - T.near - 0.5 - i * 0.7) / (T.hush - T.near - 1.5 - i * 0.7)) * [1, 0.8, 0.6][i], alpha: 0.95, px: [2.6, 2, 1.4][i], glow: '150,190,255', core: '#ffffff', branchA: 0.5 }));
  if (t > T.ret && t < T.ret + 0.25) P.glow(TREE_TOP[0], TREE_TOP[1] + 20, 30, '255,255,255', 1 - (t - T.ret) * 4);
  if (L > 0) {
    const front = t < T.ret + 2 ? K.ease.out(K.inv(T.ret, T.ret + 2, t)) : 1;
    Nature.bolt(LEAD, { reveal: 1, alpha: L * (front < 1 ? 0.5 : 1), px: 3.5, glow: C.bolt, core: '#ffffff', branchA: 0.45 * L, fade: front });
    if (front < 1) Nature.bolt(REV, { reveal: front, alpha: 1, px: 6, glow: '220,210,255', core: '#ffffff' });
    for (const r of T.re) if (t > r - 0.15 && t < r) Nature.bolt(LEAD, { reveal: (t - r + 0.15) / 0.15, alpha: 0.9, px: 3, glow: C.leader, core: '#e8e0ff', branchA: 0 });
  }
  // thunder: the air in the channel explodes outward, a pressure wave spreads
  if (t > T.thunder) for (let k = 0; k < 3; k++) { const R = (t - T.thunder - k * 0.35) * 160; if (R <= 0) continue; const a = Math.max(0, 1 - R / 1200);
    P.alpha(a * 0.8, () => { for (const sgn of [-1, 1]) P.ribbon(LEAD.main.map(([x, y]) => [x + sgn * R, y]), 4 / P.k, 'rgba(230,225,255,0.55)'); P.ctx.save(); P.ctx.strokeStyle = 'rgba(230,225,255,0.55)'; P.ctx.lineWidth = 4 / P.k; P.ctx.beginPath(); P.ctx.ellipse(0, 0, R * 1.4, R * 0.35, 0, 0, Math.PI); P.ctx.stroke(); P.ctx.restore(); }); }
  // the storm ceiling and rain when we're low
  ceiling(t, (t > T.low ? tw(t, T.low + 0.5, T.low + 2) : clamp((900 - cam.h) / 500)) * (t < T.home ? 1 : 0), fl, P.toScreen(0, CLOUD.base)[1]);
  Nature.rain(t, clamp((3000 - cam.h) / 2000) * 0.8);
  if (t > T.ret && t < T.ret + 1.2) P.haze('#f0ecff', 0.55 * Math.exp(-(t - T.ret) * 3));
  for (const r of T.re) if (t > r && t < r + 0.5) P.haze('#f0ecff', 0.35 * Math.exp(-(t - r) * 8));
  labels(t, cam);
}
// the cloud's cutaway: the near half opens (a soft lighter inner shape), particles by height, freezing levels, charges
function cutaway(t, puffs) {
  const open = tw(t, T.cut, T.cut + 1.6), a = open * (1 - tw(t, T.low, T.low + 2));
  if (a <= 0) return;
  const cy = puffs.base + puffs.H * 0.45, k = 0.84, inner = puffs.map(([x, y, r]) => [puffs.cx + (x - puffs.cx) * k, cy + (y - cy) * k, r * k]); inner.poly = puffs.poly.map(([x, y]) => [puffs.cx + (x - puffs.cx) * k, cy + (y - cy) * k]);
  const R = Math.max(CLOUD.w, puffs.H) * 1.1 * K.ease.out(open), charged = tw(t, T.hits[0], T.back), sort = tw(t, T.sort, T.sort + 6, 'inOut');
  P.alpha(a, () => P.clip(() => Nature.stormMask(inner), () => P.clip(() => { P.ctx.beginPath(); P.ctx.ellipse(puffs.cx, cy, R, R, 0, 0, 7); }, () => {
    P.rect(puffs.cx - 2e4, 0, 4e4, 2e4, P.lin(0, puffs.base, 0, puffs.base + puffs.H, P.mixc(C.inner, '#2e5ab8', sort * 0.6), P.mixc(C.inner, '#a85aa8', sort * 0.6)));
    if (sort > 0) { P.glow(puffs.cx, puffs.base + puffs.H * 0.86, CLOUD.w * 0.8, C.plus, 0.35 * sort); P.glow(puffs.cx, puffs.base + puffs.H * 0.14, CLOUD.w * 0.9, C.minus, 0.35 * sort); }
    for (let i = 0; i < 9; i++) updraft(puffs.cx + (hash(i, 11) - 0.5) * CLOUD.w * 0.9, puffs.base + hash(i, 12) * 2500, puffs.H * 0.75, tw(t, T.cut + 1, T.cut + 2.5) * clamp((1080 / P.k - 4000) / 4000), t, i + 20);
    // the freezing levels (dashed) across the cutaway
    for (const [y, at] of [[4500, T.cold + 1], [8000, T.cold + 4]]) { const aa = tw(t, at, at + 0.6) * (1 - tw(t, T.zoomC - 0.5, T.zoomC)); if (aa > 0) P.alpha(aa, () => { P.ctx.save(); P.ctx.strokeStyle = 'rgba(255,255,255,0.6)'; P.ctx.lineWidth = 3 / P.k; P.ctx.setLineDash([18 / P.k, 14 / P.k]); P.ctx.beginPath(); P.ctx.moveTo(puffs.cx - CLOUD.w * 1.3, y); P.ctx.lineTo(puffs.cx + CLOUD.w * 1.3, y); P.ctx.stroke(); P.ctx.restore(); }); }
    // the particles: appear by kind, then (charged) sort: light crystals up, heavy graupel down
    for (const [kind, side, u0, sd] of PARTS) {
      const show = tw(t, kind === 'drop' ? T.cold - 1 : kind === 'graupel' ? T.cold + 1.5 : T.cold + 3.5, (kind === 'drop' ? T.cold - 1 : kind === 'graupel' ? T.cold + 1.5 : T.cold + 3.5) + 1.2);
      if (show <= 0) continue;
      const uu = kind === 'crystal' ? lerp(u0, 0.78 + 0.14 * hash(sd, 5), sort) : kind === 'graupel' ? lerp(u0, 0.14 + 0.2 * hash(sd, 6), sort) : u0 * 0.9;
      const u = 0.06 + uu * 0.86, y = puffs.base + u * puffs.H + Math.sin(t * 0.6 + sd) * 60, x = puffs.cx + side * puffs.half(u) * 0.72 + Math.cos(t * 0.4 + sd) * 80;
      const ch = kind === 'crystal' ? charged : kind === 'graupel' ? -charged : 0;
      particle(kind, x, y, kind === 'drop' ? 7 : kind === 'graupel' ? 9 : 10, ch, show);
    }
    // the close-up collisions: a crystal flies up, a graupel pellet falls, they bump: a little charge moves
    if (t > T.zoomC && t < T.back + 1) T.hits.forEach((tc, i) => {
      const m = [CLOUD.cx + (i - 1) * 520, 6300 + (i % 2 ? 160 : -120)], before = K.inv(tc - 1.6, tc, t), after = K.inv(tc, tc + 2.2, t), hit = t >= tc;
      const cp = hit ? [m[0] - 40 - after * 260, m[1] - 50 + after * 380] : [lerp(m[0] - 260, m[0] - 40, before), lerp(m[1] - 360, m[1] - 50, before)];
      const gp = hit ? [m[0] + 50 + after * 200, m[1] + 60 - after * 420] : [lerp(m[0] + 220, m[0] + 50, before), lerp(m[1] + 380, m[1] + 60, before)];
      const vis = tw(t, tc - 1.8, tc - 1.4) * (1 - tw(t, T.back - 0.4, T.back + 0.4));
      particle('crystal', cp[0], cp[1], 80 * P.k, hit ? clamp(after * 3) : 0, vis); particle('graupel', gp[0], gp[1], 115 * P.k, hit ? -clamp(after * 3) : 0, vis);
      if (t > tc && t < tc + 0.4) { P.glow(m[0], m[1], 140, '255,255,255', 1 - (t - tc) / 0.4); }
    });
  })));
}
function labels(t, cam) {
  const at = (x, y) => P.toScreen(x, y);
  if (cam.h > 8000) {
    let s = at(CLOUD.cx + CLOUD.w * 1.25, 4500); pill('0 °C: water freezes', s[0], s[1], tw(t, T.cold + 1.2, T.cold + 1.8) * (1 - tw(t, T.zoomC - 0.5, T.zoomC)), { size: 32 });
    s = at(CLOUD.cx + CLOUD.w * 1.25, 8000); pill('about −20 °C', s[0], s[1], tw(t, T.cold + 4.2, T.cold + 4.8) * (1 - tw(t, T.zoomC - 0.5, T.zoomC)), { size: 32 });
    s = at(CLOUD.cx + CLOUD.w * 1.3, CLOUD.top * 0.85); pill('positive (+) on top', s[0], s[1], tw(t, T.sort + 4, T.sort + 4.6) * (1 - tw(t, T.low, T.low + 0.6)), { size: 32 });
    s = at(CLOUD.cx + CLOUD.w * 1.3, 2600); pill('negative (−) below', s[0], s[1], tw(t, T.sort + 5, T.sort + 5.6) * (1 - tw(t, T.low, T.low + 0.6)), { size: 32 });
  }
  if (t > T.zoomC + 1 && t < T.back) { const m = [CLOUD.cx - 520, 6180]; let s = at(m[0] - 330, m[1] - 420); pill('ice crystal', s[0] - 60, s[1], tw(t, T.hits[0] - 1.4, T.hits[0] - 0.9) * (1 - tw(t, T.hits[0] + 1.2, T.hits[0] + 1.6)), { size: 34 }); s = at(m[0] + 300, m[1] + 460); pill('graupel (soft hail)', s[0] + 80, s[1], tw(t, T.hits[0] - 1.2, T.hits[0] - 0.7) * (1 - tw(t, T.hits[0] + 1.2, T.hits[0] + 1.6)), { size: 34 }); }
  // the slow-motion clock and the names of the parts of the strike
  const ms = MS(t), clockA = tw(t, T.low + 1.5, T.low + 2.2) * (1 - tw(t, T.home - 0.5, T.home));
  if (clockA > 0) pill(ms < 1000 ? `${ms.toFixed(ms < 100 ? 1 : 0)} ms` : `${(ms / 1000).toFixed(1)} s`, 300, 110, clockA, { icon: STOPWATCH, size: 46 });
  pill('earlier that afternoon', 960, 120, tw(t, T.in - 0.2, T.in + 0.3) * (1 - tw(t, T.rise + 3, T.rise + 3.6)), { size: 40 });
  pill('slowed down 1,000 times', 300, 200, tw(t, T.low + 2.6, T.low + 3.2) * (1 - tw(t, T.lead + 3, T.lead + 3.6)), { size: 32 });
  pill('back to normal speed', 300, 200, tw(t, T.thunder + 0.3, T.thunder + 0.8) * (1 - tw(t, T.home - 0.5, T.home)), { size: 32 });
  const tip = tipOf(LEAD, leaderReveal(t)); let s = at(tip[0], tip[1]);
  pill('stepped leader', s[0] + 230, s[1], tw(t, T.lead + 1.5, T.lead + 2) * (1 - tw(t, T.near - 0.5, T.near)), { size: 34 });
  s = at(TREE_TOP[0] - 4, TREE_TOP[1] + 14); pill('streamer', s[0] - 200, s[1], tw(t, T.near + 3, T.near + 3.5) * (1 - tw(t, T.hush - 0.3, T.hush)), { size: 34 });
  pill('return stroke: about 30,000 amperes', 960, 980, tw(t, T.ret + 2.2, T.ret + 2.8) * (1 - tw(t, T.re[1] - 0.4, T.re[1])), { size: 36 });
  pill('the air heats to about 30,000 °C and bursts outward', 960, 980, tw(t, T.thunder + 0.4, T.thunder + 0.9) * (1 - tw(t, T.home - 1.2, T.home - 0.6)), { size: 34 });
}
const FILM = {
  draw(t) {
    if (t < T.out) { porch(t); return; }
    if (t < T.in) { const u = K.inv(T.out, T.in, t); porch(t); P.layer(K.ease.inOut(u), () => fieldScene(t)); return; }
    if (t < T.home) { fieldScene(t); P.vignette(0.35); return; }
    if (t < T.porch) { const u = K.inv(T.home, T.porch, t); fieldScene(t); P.layer(K.ease.inOut(u), () => porch(t)); return; }
    porch(t); P.vignette(0.3);
    if (t > T.D - 1.2) P.haze('#0c0e24', tw(t, T.D - 1.2, T.D));
  },
};
