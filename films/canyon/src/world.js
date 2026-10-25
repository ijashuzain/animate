// How a River Carved the Grand Canyon: the cross-section (metres, x across the canyon, y up; the top of the basement at
// y = 0 before the uplift) and three windows into the past (the seas, the dune desert, the river today), all after the
// user's references (refs/cross-section, redwall-sea, dunes, rafters).
const FONT = '"Baloo 2", sans-serif';
const { lerp, clamp, tw, track, hash, noise } = K;
// the layers, bottom to top: name, thickness (m, drawn), colour, light/shade, hard (cliff) or soft (slope), age label
const LAYERS = [
  ['Tapeats Sandstone', 80, '#9a6a44', true, '525 million years'],
  ['Bright Angel Shale', 130, '#7c8a6a', false, '510 million years'],
  ['Muav Limestone', 100, '#a08a6a', false, '505 million years'],
  ['Redwall Limestone', 190, '#c4442e', true, '340 million years'],
  ['Supai Group', 260, '#b25a3e', false, '300 million years'],
  ['Hermit Shale', 90, '#9a3a2c', false, '280 million years'],
  ['Coconino Sandstone', 110, '#efe2c4', true, '275 million years'],
  ['Toroweap Formation', 70, '#d8b88a', false, '273 million years'],
  ['Kaibab Limestone', 90, '#e8dcc4', true, '270 million years'],
];
const BASE = -560;                                   // the bottom of the basement drawn
const LTOP = []; { let y = 0; for (const L of LAYERS) { LTOP.push([y, y + L[1]]); y += L[1]; } }
const RIM = LTOP[LTOP.length - 1][1];                // 1120 m of layers on the basement
const RIVER = -420;                                  // the river today, cut into the basement
// the finished canyon's right wall, from the river up to the rim: hard layers stand as cliffs, soft ones as slopes
const WALL = (() => { const pts = [[40, RIVER], [60, RIVER + 20]]; let x = 60; // the inner gorge in the basement: steep
  x += 170; pts.push([x, 0]);
  LAYERS.forEach(([, th, , hard], i) => { const [y0, y1] = LTOP[i]; if (hard) { pts.push([x + 12, y1 - th * 0.08]); x += 18; pts.push([x, y1]); } else { x += th * 1.55; pts.push([x, y1]); } });
  pts.push([x + 40, RIM]); return pts; })();
const RIMX = WALL[WALL.length - 1][0];

// ---------- the cross-section ----------
// s: { built: 0..1 per layer (array), lift (m), cut 0..1 (depth of the notch), widen 0..1 (V -> stepped walls), sea (y of the
//   water surface or null), seaA, mountains 0..1 (the ancient mountains on the basement), flat 0..1 (worn flat) }
function canyonShape(s) {
  // the open canyon (air) as a polygon: left wall mirrored from the right; during cutting a V notch that deepens
  const bottom = lerp(RIM, RIVER, s.cut), pts = [];
  for (const [x, y] of WALL) {
    if (y < bottom) continue;
    const vx = 40 + (y - bottom) * 0.32, fx = lerp(vx, x, s.widen);
    pts.push([fx, y]);
  }
  pts.unshift([40 * s.cut + 2, bottom]);
  const right = pts.map(([x, y]) => [x, y + s.lift]), left = right.slice().reverse().map(([x, y]) => [-x, y]);
  return [...left, ...right, [right[right.length - 1][0], RIM + s.lift + 2000], [-right[right.length - 1][0], RIM + s.lift + 2000]];
}
function crossSection(t, s) {
  const lift = s.lift, open = s.cut > 0.001;
  const shape = open ? canyonShape(s) : null;
  // the rock, clipped to everything outside the open canyon
  const rock = () => {
    // basement: purple schist with pink granite veins and a faceted texture; the ancient mountains on top of it
    const mtn = s.mountains * (1 - s.flat);
    const top = []; for (let x = -9000; x <= 9000; x += 200) top.push([x, lift + mtn * (300 + 260 * Math.sin(x * 0.0011 + 1) + 160 * noise(x * 0.002, 3))]);
    P.poly([[-9000, BASE + lift - 3000], ...top, [9000, BASE + lift - 3000]], P.lin(0, lift, 0, BASE + lift, '#5a4870', '#3a2e50'));
    for (let i = 0; i < 70; i++) { const x = -4200 + hash(i, 1) * 8400, y = BASE + lift + hash(i, 2) * (-BASE + mtn * 300); P.poly([[x, y], [x + 140, y + 60], [x + 90, y - 80]], hash(i, 3) > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.10)'); }
    for (let i = 0; i < 9; i++) { const x0 = -3800 + i * 900 + hash(i, 4) * 300; P.ribbon([[x0, BASE + lift - 200], [x0 + 140, BASE + lift + 160], [x0 + 60, lift - 260], [x0 + 260, lift - 40]], 34, '#d06a9a'); }
    // the layers, each growing up from its base as it is laid down (a wavy top while it is the sea floor)
    LAYERS.forEach(([name, th, col, hard], i) => {
      const b = s.built[i] ?? 0; if (b <= 0) return; const [y0] = LTOP[i], y1 = y0 + th * b;
      const shade = P.mixc(col, '#2a1420', 0.25), light = P.mixc(col, '#fff4e0', 0.18);
      P.rect(-9000, y0 + lift, 18000, y1 - y0 + 0.5, P.lin(0, y1 + lift, 0, y0 + lift, light, col));
      // texture: hard layers get vertical joints and blocks; soft layers fine strata lines
      if (hard) for (let k = -60; k < 60; k++) { const x = k * 70 + hash(k, i) * 30; P.rect(x, y0 + lift, 6, (y1 - y0), 'rgba(40,10,10,0.18)'); if (hash(k, i + 9) > 0.6) P.rect(x + 6, y0 + lift + (y1 - y0) * 0.45, 64, 4, 'rgba(40,10,10,0.12)'); }
      else for (let k = 1; k < 4; k++) P.rect(-9000, y0 + lift + (y1 - y0) * k / 4, 18000, 3, 'rgba(40,20,10,0.12)');
      P.rect(-9000, y1 + lift - 4, 18000, 8, b < 1 ? P.rgba(light, 0.8) : 'rgba(0,0,0,0.10)');
    });
  };
  if (open) P.ctx.save(), (() => { const ctx = P.ctx; ctx.beginPath(); ctx.rect(-9000, BASE + lift - 3000, 18000, 9000); shape.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip('evenodd'); })();
  rock();
  if (open) P.ctx.restore();
  // inside the canyon: the far canyon receding (pink-violet tiers) and its walls in shade, then the river
  if (open) P.clip(() => { P.ctx.beginPath(); shape.forEach(([x, y], i) => (i ? P.ctx.lineTo(x, y) : P.ctx.moveTo(x, y))); P.ctx.closePath(); }, () => {
    const bottom = lerp(RIM, RIVER, s.cut) + lift, rimY = RIM + lift;
    // through the gap: the canyon receding into the distance, tier after tier of hazy pink-violet walls (refs/cross-section)
    // the near gap's half-width at height y (from the right wall), and far walls as narrower copies of it, stepping back
    const R = shape.slice(shape.length / 2, shape.length - 2).filter(([x]) => x > 0).sort((p, q) => p[1] - q[1]);
    const gapHalf = (y) => { for (let i = 1; i < R.length; i++) if (y <= R[i][1]) return lerp(R[i - 1][0], R[i][0], K.inv(R[i - 1][1], R[i][1], y)); return R.length ? R[R.length - 1][0] : 0; };
    for (let k = 0; k < 4; k++) { const sc = 0.82 - k * 0.17, drop = (rimY - bottom) * (0.06 + k * 0.1), col = P.mixc('#e09aa8', '#8a64a8', k / 3.2);
      for (const sd of [-1, 1]) { const pts = [[sd * 3000, bottom - 40], [sd * 3000, rimY - drop]]; for (let i = 0; i <= 24; i++) { const y = lerp(rimY - drop, bottom, i / 24); pts.push([sd * gapHalf(y + drop * 0.6) * sc, y]); } P.poly(pts, col);
        for (let i = 1; i < 5; i++) { const y = lerp(rimY - drop, bottom, i / 6); P.rect(sd > 0 ? gapHalf(y) * sc : -3000, y, 3000 - gapHalf(y) * sc, 6, 'rgba(255,230,230,0.16)'); } } }
    // the near walls' faces: a darker strip along each wall edge (the inner walls in shade)
    P.ribbon(shape.slice(0, shape.length / 2 - 1), 24, 'rgba(60,20,40,0.30)'); P.ribbon(shape.slice(shape.length / 2 - 1, shape.length - 2), 24, 'rgba(255,220,180,0.25)');
    // the river (turquoise) once the cut has begun, with sparkles and moving sand grains
    if (s.cut > 0.05) { const w = 38 * s.cut + 10; P.rect(-w, bottom - 6, w * 2, 22, P.lin(0, bottom + 16, 0, bottom - 6, '#7fe8e0', '#2fb8c8')); for (let i = 0; i < 6; i++) { const u = (t * 0.4 + i / 6) % 1; P.rect(-w + u * w * 2, bottom + 6, 8, 2.5, 'rgba(255,255,255,0.7)'); } }
  });
  // the surface on top: shrubs and cacti on the rim once the land is dry and high
  if (s.plants > 0) P.alpha(s.plants, () => { const top = (LTOP.at(-1)[1]) + lift; for (let i = 0; i < 26; i++) { const x = (i < 13 ? -1 : 1) * (RIMX + 60 + (i % 13) * 230 + hash(i, 8) * 80); if (i % 3 === 0) Nature.cactus(x, top, 46 + hash(i, 9) * 30, { col: '#4a8a6a' }); else Nature.shrub(x, top, 20 + hash(i, 10) * 18, { col: '#4f7a5a', seed: i }); } });
  // the sea over the layers while they form
  if (s.seaA > 0) P.alpha(s.seaA, () => { P.rect(-9000, (s.seaTop ?? 0) + lift, 18000, (s.sea ?? 0) - (s.seaTop ?? 0), P.lin(0, (s.sea ?? 0) + lift, 0, (s.seaTop ?? 0) + lift, 'rgba(60,170,200,0.55)', 'rgba(20,90,140,0.7)')); const pts = []; for (let x = -9000; x <= 9000; x += 120) pts.push([x, (s.sea ?? 0) + lift + Math.sin(x * 0.01 + t * 2) * 8]); P.ribbon(pts, 6, 'rgba(255,255,255,0.6)'); });
}
// the sky (screen space): dawn/day/sunset/night by `day` 0 night .. 1 day, sunset tint by `gold`
function sky(t, day, gold, sun) {
  P.sky(P.mixc(P.mixc('#0e1030', '#5ab0d8', day), '#f2884a', gold * 0.6), P.mixc(P.mixc('#2a2050', '#cfeaf0', day), '#ffc070', gold));
  if (day < 0.4) P.screen((ctx) => { ctx.fillStyle = '#fff'; for (let i = 0; i < 80; i++) { ctx.globalAlpha = (0.4 - day) * 2.2 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.arc(hash(i, 1) * 1920, hash(i, 2) * 600, 1.4, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; });
  if (sun) P.screen((ctx) => { const [x, y, r] = sun; const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, `rgba(255,236,190,${0.6 * day})`); g.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.globalAlpha = Math.min(1, day * 1.5); ctx.fillStyle = '#fff2c8'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
  // soft flat clouds (one shape each)
  P.screen((ctx) => { for (let i = 0; i < 4; i++) { const x = ((hash(i, 5) * 2400 + t * 12) % 2400) - 240, y = 120 + hash(i, 6) * 260; ctx.globalAlpha = 0.5 * day; ctx.fillStyle = P.mixc('#fff4e4', '#ffd0a0', gold); ctx.beginPath(); ctx.ellipse(x, y, 160, 26, 0, 0, 7); ctx.ellipse(x + 60, y - 18, 80, 30, 0, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; });
}
// a crinoid (sea lily): a segmented stalk and a crown of feathery arms that sway (refs/redwall-sea)
function crinoid(t, x, y, h, col, seed) {
  const sw = Math.sin(t * 0.9 + seed) * 0.06, top = [x + Math.sin(sw) * h, y + h];
  const stalk = []; for (let i = 0; i <= 10; i++) { const u = i / 10; stalk.push([x + Math.sin(sw * u) * h * u, y + h * u]); }
  P.ribbon(stalk, h * 0.05, '#e8c8a0'); for (let i = 1; i < 10; i++) P.ribbon([[stalk[i][0] - h * 0.025, stalk[i][1]], [stalk[i][0] + h * 0.025, stalk[i][1]]], h * 0.008, 'rgba(120,80,40,0.4)');
  for (let k = 0; k < 9; k++) { const a = Math.PI * (0.12 + 0.76 * k / 8) + sw * 2, L = h * (0.42 + 0.12 * Math.sin(k * 1.7)), pts = []; for (let j = 0; j <= 8; j++) { const u = j / 8; pts.push([top[0] + Math.cos(a) * L * u, top[1] + Math.sin(a) * L * u - u * u * L * 0.35]); }
    P.ribbon(pts, [h * 0.03, h * 0.035, h * 0.03, h * 0.025, h * 0.02, h * 0.015, h * 0.012, h * 0.01, h * 0.005], P.mixc(col, '#ffe0b0', k % 2 ? 0.25 : 0));
    for (let j = 1; j < 8; j++) { const [px, py] = pts[j], [qx, qy] = pts[j + 1], n = Math.atan2(qy - py, qx - px) + Math.PI / 2, l = h * 0.06 * (1 - j / 9); for (const sg of [-1, 1]) P.ribbon([[px, py], [px + Math.cos(n) * l * sg + (qx - px) * 0.5, py + Math.sin(n) * l * sg + (qy - py) * 0.5]], h * 0.006, P.mixc(col, '#ffffff', 0.15)); } }
}
function hornCoral(x, y, h, tilt) { P.at(x, y, tilt, 1, 1, () => { P.poly([[-h * 0.12, 0], [h * 0.12, 0], [h * 0.26, h], [-h * 0.26, h]], P.lin(-h * 0.26, 0, h * 0.26, 0, '#e8b070', '#b8783a')); for (let i = 1; i < 6; i++) P.ribbon([[-h * 0.12 - i * 0.026 * h, i * h / 6], [h * 0.12 + i * 0.026 * h, i * h / 6]], h * 0.012, 'rgba(90,50,20,0.25)'); P.circle(0, h, h * 0.26, '#f08a3a', { ry: h * 0.07 }); P.circle(0, h - h * 0.01, h * 0.18, '#c85a2a', { ry: h * 0.045 }); }); }
function shell(x, y, r, col) { P.poly([[x, y], [x - r, y + r * 0.5], [x - r * 0.7, y + r * 0.95], [x, y + r * 1.1], [x + r * 0.7, y + r * 0.95], [x + r, y + r * 0.5]], col); for (let i = -2; i <= 2; i++) P.ribbon([[x, y + r * 0.05], [x + i * r * 0.32, y + r]], r * 0.06, 'rgba(255,255,255,0.35)'); }
// the sea floor window: kind 'cambrian' (sand, trilobites) or 'redwall' (crinoids, corals, shells, fish)
function seaWindow(t, kind) {
  P.cam({ x: 0, y: 130, h: 470 });
  P.sky('#7fe0e8', '#1a7a9a', '#3ab0c8');
  P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 300 + i * 260 + Math.sin(t * 0.3 + i) * 40; const g = ctx.createLinearGradient(x, 0, x + 200, 900); g.addColorStop(0, 'rgba(200,255,250,0.18)'); g.addColorStop(1, 'rgba(200,255,250,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 70, 0); ctx.lineTo(x + 330, 1080); ctx.lineTo(x + 180, 1080); ctx.fill(); } ctx.globalCompositeOperation = 'source-over'; });
  // far reef shapes, then the sand with ripples
  for (let k = 0; k < 2; k++) { const pts = [[-700, 80]]; for (let x = -700; x <= 700; x += 40) pts.push([x, 120 + k * -40 + 50 * noise(x * 0.006, k + 2)]); pts.push([700, 80]); P.poly(pts, k ? '#2f8aa0' : '#3a9ab0'); }
  if (kind === 'redwall') for (let i = 0; i < 10; i++) crinoid(t, -640 + i * 140 + hash(i, 3) * 40, 70, 90 + hash(i, 4) * 50, '#a8c8d8', i + 20);
  P.rect(-800, -200, 1600, 280, P.lin(0, 80, 0, -200, '#f6e2b8', '#e8cc98'));
  for (let i = 0; i < 9; i++) P.ribbon([[-800, 40 - i * 26], [-300, 46 - i * 26], [200, 38 - i * 26], [800, 44 - i * 26]], 2.5, 'rgba(200,160,100,0.35)');
  for (let i = 0; i < 12; i++) P.lit(P.blobPts(-640 + i * 120 + hash(i, 5) * 60, 40 - hash(i, 6) * 120, 20 + hash(i, 7) * 26, 12 + hash(i, 8) * 10, 9, 0.2, i), '#7a6a94', { d: 0.25 });
  if (kind === 'redwall') {
    for (let i = 0; i < 6; i++) crinoid(t, -560 + i * 230 + hash(i, 9) * 60, 30 - hash(i, 10) * 30, 200 + hash(i, 11) * 110, ['#f07850', '#f0a050', '#f2c890', '#e86a7a'][i % 4], i);
    for (let i = 0; i < 9; i++) hornCoral(-600 + i * 150 + hash(i, 12) * 60, -10 - hash(i, 13) * 60, 50 + hash(i, 14) * 50, (hash(i, 15) - 0.5) * 0.5);
    for (let i = 0; i < 6; i++) { const dir = i % 2 ? 1 : -1, u = ((t * 0.04 + hash(i, 16)) % 1), x = dir > 0 ? lerp(-750, 750, u) : lerp(750, -750, u); Nature.fish(t, x, 250 + hash(i, 17) * 90, 0.32 + hash(i, 18) * 0.2, '#4a6a7a', i, dir); }
  } else for (let i = 0; i < 6; i++) { const x = -600 + i * 220, sway = Math.sin(t + i) * 4; for (let k = 0; k < 4; k++) P.ribbon([[x + k * 8, 20], [x + k * 8 + sway, 70 + k * 10], [x + k * 8 + sway * 2, 110 + k * 8]], 4, '#6aa86a'); }
  for (let i = 0; i < 10; i++) shell(-620 + i * 135 + hash(i, 19) * 50, -60 - hash(i, 20) * 110, 18 + hash(i, 21) * 12, ['#f2c8a0', '#e88a8a', '#f0d0b0'][i % 3]);
  // trilobites crawling (facing the way they go)
  for (let i = 0; i < (kind === 'cambrian' ? 5 : 3); i++) { const dir = i % 2 ? -1 : 1, x = lerp(-500, 500, ((t * 0.03 + hash(i, 22)) % 1)) * dir; Animals.trilobite(t, x, -40 - i * 25, 3.2 - i * 0.35, { dir, col: ['#7a6a5a', '#5a5a6a', '#8a7058'][i % 3] }); }
  // drifting specks
  P.screen((ctx) => { ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc((hash(i, 30) * 1920 + t * 8) % 1920, (hash(i, 31) * 1080 - t * 14 + 1080 * 4) % 1080, 1.6, 0, 7); ctx.fill(); } });
}
// the dune desert window: dunes with sharp crests (cream lit side, peach shade), a lizard on a crest leaving footprints
function duneWindow(t, t0) {
  const lx0 = lerp(-520, 260, tw(t, t0 + 0.6, t0 + 8.5, 'linear'));
  P.cam({ x: lerp(-200, 120, tw(t, t0, t0 + 8, 'inOut')), y: 150, h: 430 });
  P.sky('#f6c890', '#fbe6c0', '#f8d8a8');
  P.screen((ctx) => { const g = ctx.createRadialGradient(1500, 220, 0, 1500, 220, 300); g.addColorStop(0, 'rgba(255,248,220,0.9)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(1500, 220, 90, 0, 7); ctx.fill(); });
  P.poly([[-800, 330], [-520, 360], [-420, 430], [-330, 420], [-260, 470], [-180, 440], [-60, 455], [20, 380], [800, 360], [800, 330]], '#e8a49a');
  for (let k = 0; k < 4; k++) { const by = 330 - k * 110, sh = k * 0.18; for (let i = -2; i < 4; i++) { const cx = -600 + i * 360 + k * 150 + hash(i, k) * 100, w = 260 + hash(i, k + 4) * 120, hgt = 70 + hash(i, k + 8) * 60;
    P.poly([[cx - w, by - 40], [cx, by + hgt], [cx + w * 0.4, by - 40]], P.mixc('#f6dcb0', '#f0b088', sh)); P.poly([[cx, by + hgt], [cx + w * 0.4, by - 40], [cx + w, by - 40]], P.mixc('#f0a878', '#e08a68', sh)); } }
  // the near dune crest the lizard walks along, footprints appearing behind it
  const crest = (x) => 70 + x * 0.25;
  P.poly([[-800, -320], [-800, crest(-800)], [700, crest(700)], [800, -320]], '#f6d8a8'); P.poly([[700, crest(700)], [800, -320], [-800, -320], [-800, crest(-800) - 200]], '#f0b888');
  const lx = lerp(-520, 260, tw(t, t0 + 0.6, t0 + 8.5, 'linear'));
  for (let x = -520; x < lx - 30; x += 22) { const side = Math.round((x + 520) / 22) % 2 ? 6 : -6; P.circle(x, crest(x) - 10 + side, 4.5, 'rgba(180,110,70,0.55)', { ry: 3 }); }
  P.at(lx, crest(lx) - 4, Math.atan(0.25), 1, 1, () => Animals.lizard(t, 0, 0, 2.1, { walk: 1, col: '#c88a50' })); void lx0;
}
// the river today window (ending): cliffs in shade and sun, turquoise river, a yellow raft with four rafters, a condor
function riverWindow(t, t0) {
  // camera on the river, looking downstream: stepped walls on both sides receding to a hazy pink-violet distance
  P.cam({ x: 0, y: 160, h: 760 });
  P.sky('#3fb8d4', '#c6f0f0');
  P.screen((ctx) => { ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(1460, 140, 64, 0, 7); ctx.fill(); });
  // receding walls: 4 depths, nearer = bigger, redder; each wall a stack of cliff steps with ledges and a green-grey band
  for (let k = 3; k >= 0; k--) { const near = 1 - k / 3, col = P.mixc('#c8483a', '#b890c0', k / 3.2), gap = 70 + near * 260, top = 360 + near * 360;
    for (const sd of [-1, 1]) { const steps = 5, pts = [[sd * gap, -20]]; for (let i = 0; i < steps; i++) { const y0 = -20 + (top + 20) * i / steps, y1 = -20 + (top + 20) * (i + 1) / steps, x0 = sd * (gap + i * (60 + near * 120)); pts.push([x0, y1 - 8], [x0 + sd * (30 + near * 60), y1]); }
      pts.push([sd * 1400, top], [sd * 1400, -20]);
      P.poly(pts, P.lin(0, top, 0, -20, P.mixc(col, '#ffffff', 0.12), col));
      P.clip(() => P.trace(pts, true, 0), () => { for (let i = 1; i < steps; i++) { const y = -20 + (top + 20) * i / steps; P.rect(-1400, y - 8, 2800, 10 + near * 8, i === 1 ? 'rgba(120,140,110,0.6)' : 'rgba(255,230,200,0.18)'); }
        for (let i = 0; i < 9; i++) { const x = sd * (gap + 40 + i * 110); P.rect(x, -20, 3 + near * 4, top, 'rgba(60,15,15,0.14)'); } }); } }
  // the river and the sandy banks with boulders and shrubs
  P.poly([[-1400, -20], [-330, -20], [-260, -400], [-1400, -400]], '#e8b88a'); P.poly([[1400, -20], [330, -20], [260, -400], [1400, -400]], '#e0aa80');
  for (const [x, y, r] of [[-520, -120, 50], [-380, -60, 34], [540, -140, 60], [420, -60, 30]]) P.lit(P.blobPts(x, y, r, r * 0.7, 9, 0.18, x), '#9a5a6a', { d: 0.25 });
  for (const [x, y, r] of [[-700, -40, 50], [-600, -10, 36], [700, -30, 44]]) Nature.shrub(x, y, r, { col: '#6a8a4a', seed: x });
  P.poly([[-330, -20], [330, -20], [260, -400], [-260, -400]], P.lin(0, -20, 0, -400, '#2aa8b8', '#5ad8d8'));
  for (let i = 0; i < 16; i++) { const y = -40 - ((hash(i, 3) * 360 + t * 40) % 360), x = (hash(i, 2) - 0.5) * 420 * (1 + (-y) / 400); P.ribbon([[x, y], [x + 26, y + 4], [x + 52, y]], 3, 'rgba(255,255,255,0.75)'); }
  // the raft (from behind) with four rafters paddling
  const rx = Math.sin(t * 0.5) * 20, ry = -150 + Math.sin(t * 1.6) * 4;
  P.lit(P.blobPts(rx, ry, 120, 30, 16, 0.02, 2), '#f6c83a', { d: 0.25 }); P.rect(rx - 112, ry - 28, 224, 16, '#3a5aa8', { r: 8 });
  ['#e84a3a', '#f0a030', '#3a6ad0', '#e85a5a'].forEach((vest, i) => { const px = rx - 78 + i * 52, py = ry + 18, pad = Math.sin(t * 3 + i * 1.3);
    P.ribbon([[px - 22, py + 14 + pad * 10], [px + 24, py - 30 - pad * 10]], 3, '#5a4a3a'); P.rect(px - 15, py, 30, 38, vest, { r: 9 }); P.circle(px, py + 49, 12, '#5a3a2a'); P.circle(px, py + 52, 12.5, ['#f2d23a', '#e84a3a', '#3a8ad0', '#f2d23a'][i], { ry: 8.5 }); });
  const cu = tw(t, t0 + 1.5, t0 + 7.5, 'linear'); Animals.bird(t, lerp(-1100, 1100, cu), 560 + Math.sin(t) * 16, 2.2, 'condor', { fly: true, dir: 1 });
}
