// The Island: one locked camera on the sea floor while a million years pass; it moves only at the twist (pull back).
const { lerp, clamp, tw, track, logTrack, hash, noise } = K;
const T = { set: 4.5, view: 10.6, plume: 13.0, crack: 18.0, ooze: 22.0, paste: 27.6, crab: 31.0, grow: 37.0, whale: 44.0, boil: 50.0, blast: 53.0, breach: 63.0, sun: 66.0, face: 68.0, life: 75.0, rain: 88.0, canoe: 95.5, hush: 100.0, pull: 102.5, next: 115.0, end: 128.0 };
const H = track([[T.ooze, 0], [T.grow, 150, 'out'], [T.boil, 560, 'inOut'], [62, 640, 'inOut'], [72, 790, 'out']]);
const cycles = track([[0, 0.35], [37, 0.45], [62, 12.0, 'linear'], [68, 12.5, 'out'], [75, 13.5], [88, 16.5, 'linear'], [100, 18.0], [102.5, 18.0], [115, 18.4, 'inOut'], [128, 18.5]]);
let DAY; // set per frame while the hook overrides the day/night cycle
const daylight = (t) => (DAY !== undefined ? DAY : 0.5 - 0.5 * Math.cos(cycles(t) * Math.PI * 2));
const years = logTrack([[T.view, 0.003], [25, 40, 'in'], [T.grow, 2000, 'in'], [T.boil, 300000, 'inOut'], [62, 450000], [75, 520000], [88, 700000], [T.hush, 1000000]]);
const fmtYears = (y) => (y < 0.02 ? 'day 1' : y < 1 ? `${Math.round(y * 365)} days` : y < 1.5 ? '1 year' : y >= 999000 ? '1 million years' : `${Math.round(y).toLocaleString('en-US', { maximumSignificantDigits: y < 1000 ? 3 : 2 })} years`);
const CLOCK = (ctx, r) => { ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, 6.3); ctx.stroke(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.55); ctx.moveTo(0, 0); ctx.lineTo(r * 0.4, r * 0.1); ctx.stroke(); };

// the hook: 0-4.5 s the finished island (story time 95-97), 4.5-9.8 s a rewind to the empty sea floor, then real time
const REW = [4.5, 9.8];
const viewTime = (t) => (t < REW[0] ? 95 + t * 0.5 : t < REW[1] ? lerp(97.25, 9.8, K.ease.inOut(K.inv(REW[0], REW[1], t))) : t);
// the camera: close on the sub at first, then the locked view; one move at the twist (pull back, pan to the next island)
function camera(t) {
  const v = 1, pull = tw(t, T.pull, 113.5, 'inOut'), next = tw(t, T.next, 121.0, 'inOut');
  const h = Math.exp(lerp(Math.log(lerp(520, 1080, v)), Math.log(lerp(4200, 1150, next)), pull));
  const x = lerp(lerp(-180, 0, v), lerp(-1300, 1880, next), pull), y = lerp(lerp(-330, 0, v), lerp(-80, -170, next), pull);
  return { x, y, h };
}
function sky(t, real = t) {
  const d = real < REW[0] ? 0.95 : real < REW[1] ? lerp(0.95, daylight(REW[1]), K.ease.inOut(K.inv(REW[0], REW[1], real))) : daylight(t), gold = Math.max(0, 1 - Math.abs(d - 0.5) * 2.6) * 0.6;
  P.sky(P.mixc(P.mixc('#0d1230', '#5aa8e0', d), '#f29a5a', gold * 0.6), P.mixc(P.mixc('#2a2a5a', '#cfeaff', d), '#ffd2a0', gold));
  if (d < 0.35) P.screen((ctx) => { ctx.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { ctx.globalAlpha = (0.35 - d) * 2 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.arc(hash(i, 1) * 1920, hash(i, 2) * 500, 1.5 + hash(i, 3) * 1.5, 0, 6.3); ctx.fill(); } });
}
function seaAndFloor(t, c, dOverride) {
  // the water body from the surface to the floor, darker with depth; light rays near the top
  const d = dOverride ?? daylight(t);
  P.rect(-9000, FLOOR, 18000, SEA - FLOOR, { lin: [0, SEA, 0, FLOOR], stops: [[0, P.mixc('#0f3a66', '#2f9cc4', d * 0.7)], [0.35, P.mixc('#0b2a52', '#14608c', d * 0.5)], [1, C.deep]] });
  P.clip(() => { P.ctx.beginPath(); P.ctx.rect(-9000, FLOOR, 18000, SEA - FLOOR); }, () => { for (let i = 0; i < 7; i++) { const x = -800 + i * 260 + Math.sin(t * 0.2 + i) * 40; P.poly([[x - 30, SEA], [x + 30, SEA], [x + 160, SEA - 420], [x + 60, SEA - 420]], `rgba(160,230,255,${0.07 * d})`); } });
  // marine snow
  P.screen((ctx) => { ctx.fillStyle = 'rgba(220,240,255,0.35)'; for (let i = 0; i < 60; i++) { const [sx, sy] = P.toScreen(-900 + hash(i, 51) * 1800 + Math.sin(t + i) * 10, SEA - 40 - ((hash(i, 52) * 560 + t * 6) % 560)); ctx.fillRect(sx, sy, 2.5, 2.5); } });
  // the floor: sediment, rocks, sponges, tube worms (no flat slab), and the crust cut-away below it
  P.rect(-9000, FLOOR - 4000, 18000, 4000, P.lin(0, FLOOR, 0, FLOOR - 1400, C.crust2, '#2a1e1e'));
  for (let L = 0; L < 4; L++) { const pts = [[-9000, FLOOR - 400]]; for (let x = -3000; x <= 3000; x += 80) pts.push([x, FLOOR - 40 - L * 70 + Math.sin(x * 0.004 + L) * 10]); pts.push([3000, FLOOR - 400], [9000, FLOOR - 400]); P.poly(pts, `rgba(0,0,0,${0.06 + L * 0.03})`); }
  P.rect(-9000, FLOOR - 14, 18000, 18, '#5a5a6e');
  for (let i = 0; i < 30; i++) { const x = -1700 + i * 118 + hash(i, 61) * 40; if (Math.abs(x) < 520) continue; const k = i % 4; if (k === 0) P.lit(P.blobPts(x, FLOOR + 6, 26, 14, 8, 0.2, i), '#4a4a5c', { d: 0.3 }); else if (k === 1) { for (let j = 0; j < 3; j++) P.ribbon([[x + j * 8, FLOOR], [x + j * 8 + Math.sin(t + j) * 3, FLOOR + 30 + j * 8]], 5, '#e8e0d0'); for (let j = 0; j < 3; j++) P.circle(x + j * 8 + Math.sin(t + j) * 3, FLOOR + 34 + j * 8, 5, '#ff6b8a'); } else if (k === 2) P.smooth([[x - 14, FLOOR], [x - 10, FLOOR + 40], [x + 10, FLOOR + 46], [x + 14, FLOOR]], '#d9a050'); }
}
const REWIND = (ctx, r) => { ctx.fillStyle = '#1a2a4a'; for (const dx of [-r * 0.45, r * 0.35]) { ctx.beginPath(); ctx.moveTo(dx + r * 0.4, -r * 0.6); ctx.lineTo(dx - r * 0.5, 0); ctx.lineTo(dx + r * 0.4, r * 0.6); ctx.fill(); } };
function clock(t, tv) {
  const rw = t >= REW[0] && t < REW[1];
  P.pill(t < REW[0] ? 'today' : fmtYears(years(Math.max(tv, 10.6))), 300, 110, { u: tw(t, 0.3, 0.7) * (1 - tw(t, T.pull, T.pull + 0.8)), font: FONT, size: 44, weight: 800, icon: rw ? REWIND : CLOCK });
  if (rw) { const a = Math.sin(K.inv(REW[0], REW[1], t) * Math.PI); P.screen((ctx) => { ctx.globalAlpha = 0.25 * a; ctx.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const y = (hash(i, 3) * 1080 + t * 900 * (i % 2 ? 1 : -1)) % 1080; ctx.fillRect(0, (y + 1080) % 1080, 1920, 3); } }); P.pill('rewind', 960, 110, { u: tw(t, REW[0], REW[0] + 0.3) * (1 - tw(t, REW[1] - 0.3, REW[1])), font: FONT, size: 44, weight: 800, icon: REWIND }); }
}
function events(t) {
  const h = H(t), top = FLOOR + h;
  // the anglerfish swims in once we reach the empty floor, then backs away from the crack
  const ax = t < 12.5 ? lerp(900, -460, tw(t, 9.4, 12.5, 'out')) : t < 22 ? lerp(-460, -740, tw(t, T.crack, 21, 'inOut')) : -740;
  const ay = -260;
  if (t > 9 && t < 37) drawAngler(t, ax, ay, 0.6, t < 12.5 ? -1 : 1, t > T.crack && t < 23 ? 'wow' : 'smile');
  // early life in the open water (12-37): jellies drift, a turtle swims past, plankton glows
  if (t > 11 && t < 40) { Nature.jelly(t, 520 + Math.sin(t * 0.3) * 60, lerp(-80, 120, tw(t, 12, 40, 'linear')), 0.9, 1, '170,220,255'); Nature.jelly(t, -520, lerp(60, -60, tw(t, 12, 40, 'linear')) + Math.sin(t * 0.5) * 30, 0.7, 2); }
  const tu = tw(t, 24.0, 33.0, 'linear'); if (tu > 0 && tu < 1) P.at(lerp(1150, -1150, tu), 40 + Math.sin(tu * 6) * 30, 0, -1, 1, () => { for (const k of [-1, 1]) P.smooth([[10, 0], [-30, k * 60 + Math.sin(t * 3) * k * 14], [-60, k * 50]], '#5a9a6a'); P.lit(P.blobPts(0, 0, 70, 44, 12, 0.04, 8), P.lin(0, 44, 0, -44, '#8ab86a', '#4a7a4a'), { d: 0.2 }); for (let i = 0; i < 5; i++) P.blob(-30 + i * 16, 10 - (i % 2) * 14, 12, 9, 'rgba(40,70,40,0.4)', { seed: i }); P.circle(80, 6, 22, '#7aa86a'); Cast.profileFace(t, 84, 10, 9, { mood: 'smile', seed: 6, mouth: [1.3, -1.0], nose: false }); });
  if (t > 11 && t < 50) P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const [sx, sy] = P.toScreen(-900 + hash(i, 81) * 1800 + Math.sin(t * 0.4 + i) * 30, -380 + hash(i, 82) * 480 + Math.cos(t * 0.3 + i) * 20); ctx.fillStyle = `rgba(120,255,220,${0.35 * (0.5 + 0.5 * Math.sin(t * 3 + i))})`; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 6.3); ctx.fill(); } });
  // the plume and the crack
  drawPlume(t, lerp(-700, FLOOR - 10, tw(t, T.plume, T.crack, 'inOut')), tw(t, T.plume - 0.5, T.plume + 0.5) * (1 - tw(t, 40, 44) * 0.4) * (1 - tw(t, T.pull - 0.2, T.pull + 1.4)));
  const cr = tw(t, T.crack, T.ooze); if (cr > 0 && h < 30) { P.ribbon([[-80 * cr, FLOOR + 2], [-20, FLOOR + 4], [30, FLOOR + 1], [90 * cr, FLOOR + 3]], 10, '#ff7a2a'); P.glow(0, FLOOR, 200 * cr, '255,120,40', 0.9); }
  // the mountain, with lava glowing at the vent and down the flanks while it grows
  drawMountain(t, h, { veg: tw(t, 84, 96), valleys: tw(t, 89, 95), beach: tw(t, 76, 80) });
  const active = tw(t, T.ooze, T.ooze + 1) * (1 - tw(t, 76, 80));
  if (active > 0 && h > 0) { P.glow(0, top, 160 + h * 0.2, '255,120,40', 0.6 * active); for (let i = 0; i < 4; i++) { const s = i % 2 ? 1 : -1, x1 = s * (60 + i * 50); P.ribbon([[0, top - 6], [x1 * 0.6, mountainY(x1 * 0.6, h) - 4], [x1, mountainY(x1, h) - 4]], [16, 12, 6], `rgba(255,${120 + 40 * Math.sin(t * 3 + i)},40,${0.85 * active})`); } }
  // lava veins glowing down the dark flanks while the mountain grows (draft note: the dome was one dark shape)
  const vein = tw(t, 34, 37) * (1 - tw(t, 74, 78));
  if (vein > 0 && h > 120) { const W = 420 + 0.95 * h; for (let k = 0; k < 6; k++) { const s = k % 2 ? 1 : -1, x0 = s * (20 + k * 18), x1 = s * W * (0.45 + 0.07 * k), pts = []; for (let j = 0; j <= 8; j++) { const x = K.lerp(x0, x1, j / 8), y = mountainY(x, h) - 18 - 30 * Math.sin(j / 8 * Math.PI) + Math.sin(j * 1.7 + k) * 10; if (y > SEA - 6) continue; pts.push([x, y]); } if (pts.length > 2) { const pulse = 0.6 + 0.4 * Math.sin(t * 2.4 + k); P.ribbon(pts, 7, `rgba(255,${110 + 40 * pulse},40,${0.85 * vein})`); for (const [px, py] of pts.filter((_, j) => j % 3 === 1)) P.glow(px, py, 46, '255,120,40', 0.35 * vein * pulse); } } }
  if (t > 42 && h > 300) { const W = 420 + 0.95 * h, life = tw(t, 42, 48); for (let i = 0; i < 16; i++) { const s = i % 2 ? 1 : -1, x = s * W * (0.55 + 0.4 * hash(i, 91)), y = mountainY(x, h) - 4; if (y > SEA - 120) continue; const g = life * (0.6 + 0.4 * hash(i, 92)); if (i % 3 === 0) P.smooth([[x - 12 * g, y], [x - 8 * g, y + 44 * g], [x + 10 * g, y + 50 * g], [x + 14 * g, y]], i % 2 ? '#e8a050' : '#d96a8a'); else if (i % 3 === 1) for (let j = 0; j < 3; j++) { P.ribbon([[x + j * 9, y], [x + j * 9 + Math.sin(t + j) * 4, y + 34 * g + j * 8]], 5, '#efe6d6'); P.circle(x + j * 9 + Math.sin(t + j) * 4, y + 38 * g + j * 8, 6 * g, '#ff6b8a'); } else P.blob(x, y + 10 * g, 22 * g, 12 * g, '#7a5a9a', { seed: i }); }
    for (let i = 0; i < 6; i++) { const a = t * 0.35 + i * 1.05, rx = 380 + h * 0.4, x = Math.cos(a) * rx, y = FLOOR + h * 0.45 + Math.sin(a * 2) * 40 + i * 18; if (y > SEA - 40) continue; Nature.fish(t, x, y, 0.45, ['#ffd36b', '#7fd0ff', '#ff9a7a'][i % 3], 40 + i, -Math.sign(Math.sin(a)) || 1); } }
  // pillows oozing out while small (22-37)
  if (t > T.ooze && t < T.grow + 2) for (let i = 0; i < 8; i++) { const tt = T.ooze + i * 1.6, u = tw(t, tt, tt + 1.2, 'out'); if (u <= 0) continue; const a = -2.6 + i * 0.75, x = Math.cos(a) * 60 * (1 + i * 0.15), y = mountainY(x, h) - 6; P.lit(P.blobPts(x + Math.cos(a) * 20 * u, y + 6, 26 * u + 4, 18 * u + 3, 9, 0.1, i), P.rad(x, y, 30, i === 7 ? '#ff9a4a' : '#3a3448', '#1e1a28'), { d: 0.25, rim: 'rgba(170,200,240,0.45)' }); }
  // the toothpaste inset (27.6-32)
  const pa = tw(t, T.paste, T.paste + 0.4, 'backOut') * (1 - tw(t, 31.6, 32.2)); if (pa > 0) P.screen((ctx) => { ctx.save(); ctx.translate(1500, 700); ctx.scale(pa, pa); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 6.3); ctx.fill(); ctx.fillStyle = '#7fd0f0'; ctx.beginPath(); ctx.arc(0, 0, 158, 0, 6.3); ctx.fill(); ctx.save(); ctx.rotate(-0.5); ctx.fillStyle = '#e8eef8'; ctx.beginPath(); ctx.roundRect(-150, -36, 150, 72, 14); ctx.fill(); ctx.fillStyle = '#e35d4f'; ctx.fillRect(-120, -36, 30, 72); ctx.fillStyle = '#c8d0dc'; ctx.fillRect(0, -16, 22, 32); ctx.restore(); const sq = tw(t, 28.2, 31.0, 'out'); ctx.fillStyle = '#2a2733'; for (let i = 0; i < 6; i++) { const u = clamp(sq * 6 - i); if (u <= 0) continue; ctx.beginPath(); ctx.ellipse(30 + i * 18, 20 + i * 6 + Math.sin(i) * 8, 16 * u + 2, 11 * u + 2, i * 0.3, 0, 6.3); ctx.fill(); ctx.strokeStyle = 'rgba(170,200,240,0.6)'; ctx.lineWidth = 3; ctx.stroke(); } ctx.restore(); });
  // the crab in a nightcap: walks in, sleeps on top of the mound, rides it up, wakes when the water boils, runs off
  const crabWalk = tw(t, T.crab, T.crab + 2.0, 'out'), run = tw(t, 51.0, 53.0, 'in');
  if (t > T.crab && t < 53.5) { const cx = lerp(-460, 20, crabWalk) + run * 900, cy = (t < T.crab + 2 ? FLOOR + 4 + crabWalk * (top - FLOOR) : top - 2) + run * 30; drawCrab(t, cx, cy, 1.5, t < 50.6); if (t > T.crab + 2.2 && t < 50.6) for (let i = 0; i < 3; i++) { const u = ((t - T.crab) * 0.5 + i / 3) % 1; P.at(cx + 30 + u * 60, cy + 70 + u * 80, 0, 1, -1, () => { P.ctx.fillStyle = `rgba(255,255,255,${1 - u})`; P.ctx.font = `800 ${24 + u * 20}px ${FONT}`; P.ctx.fillText('z', 0, 0); }); } }
  // generations of fish, a whale, a ruler (37-50)
  Nature.school(t, 37.5, 42.5, -1300, 1300, 40, 14, ['#ffb25a', '#ff7f6e'], 1.0, 3);
  Nature.school(t, 42.0, 47.5, 1300, -1300, -40, 14, ['#7fd0ff', '#a0e8c0'], 1.0, 9);
  if (t > T.whale - 1 && t < 51) P.alpha(0.8, () => Nature.whale(t, lerp(1400, -1500, tw(t, T.whale - 1, 51, 'linear')), 60, 0.55, '#2d5580', -1));
  const ra = tw(t, 38.5, 39) * (1 - tw(t, 49.6, 50.2)); if (ra > 0) { const [sx, sy0] = P.toScreen(560, FLOOR), [, sy1] = P.toScreen(560, top); P.screen((ctx) => { ctx.globalAlpha = ra; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, sy0); ctx.lineTo(sx, sy1); ctx.stroke(); for (let k = 0; k <= 5; k++) { const y = lerp(sy0, sy1, k / 5); ctx.beginPath(); ctx.moveTo(sx - 12, y); ctx.lineTo(sx + 12, y); ctx.stroke(); } }); P.pill(`${(h / 560 * 5).toFixed(1)} km tall`, sx + 140, sy1, { u: ra, font: FONT, size: 34, weight: 800 }); }
  // near the surface: the sea boils, steam and ash blast up, rocks fly, birds scatter (50-63)
  const boil = tw(t, T.boil, 51.5) * (1 - tw(t, 64, 70)); if (boil > 0) Nature.bubbles(t, 50, 77, boil, 260, [700, 1220, 300, 560]);
  // the blasts: a flash at the surface, a tall column of steam and ash, a spray ring, flying rocks (bigger: draft note)
  for (const [tt, sx] of [[53.0, -20], [55.4, 60], [57.8, -80], [60.2, 30], [62.4, -40]]) {
    const u = tw(t, tt, tt + 2.8, 'out'); if (u <= 0 || u >= 1) continue;
    if (u < 0.2) P.glow(sx, SEA, 520, '255,200,140', (0.2 - u) * 5);
    P.layer(1 - u * 0.55, () => P.clip(() => { P.ctx.beginPath(); P.ctx.rect(-9000, SEA - 4, 18000, 6000); }, () => { for (let k = 0; k < 4; k++) Nature.cloud(sx + Math.sin(k * 2 + tt) * 40 * u, SEA + 40 + k * 150 * u, (0.9 + u * 2.1) * (1 - k * 0.15), Math.round(tt) + k, P.mixc(k % 2 ? '#d8d6e0' : '#a8a4b4', '#5a5662', u * 0.8)); }));
    P.ctx.save(); P.ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; P.ctx.lineWidth = 8; P.ctx.beginPath(); P.ctx.ellipse(sx, SEA, 120 + u * 520, 30 + u * 60, 0, Math.PI, 2 * Math.PI, true); P.ctx.stroke(); P.ctx.restore();
    for (let i = 0; i < 12; i++) { const a = 0.35 + i * 0.2, d = u * 760, x = sx + Math.cos(a) * d * 0.8, y = SEA + Math.sin(a) * d - u * u * 620; P.lit(P.blobPts(x, y, 14, 11, 7, 0.2, i), '#2a2428', { d: 0.3, rim: 'rgba(255,140,60,0.5)' }); P.glow(x, y, 34, '255,120,40', 0.7 * (1 - u)); }
  }
  for (let i = 0; i < 6; i++) { const u = tw(t, 53.4 + i * 0.25, 57.4 + i * 0.25, 'in'); if (u > 0 && u < 1) Nature.bird(t, 300 + i * 40 + u * 900, SEA + 160 + i * 25 + u * 200, 1.0, i, 1); }
  // the breach: steam where the lava meets the sea; the sun; the island's face (63-75)
  if (h > 640 && t < 80) for (const s of [-1, 1]) { const xs = s * (lerp(80, 300, tw(t, T.breach, 72))), u = (t * 0.6) % 1; for (let i = 0; i < 4; i++) { const v = (u + i / 4) % 1; P.circle(xs + Math.sin(i + t) * 20, SEA + 10 + v * 160, 26 + v * 50, `rgba(240,240,245,${0.5 * (1 - v) * (1 - tw(t, 76, 80))})`); } }
  const sunU = tw(t, T.sun, 70.5, 'out'), dl = daylight(t); if (sunU > 0 && dl > 0.05) P.alpha(clamp(dl * 2), () => { const sy = lerp(SEA - 40, SEA + 280, sunU) - (1 - dl) * 160; P.glow(640, sy, 360, '255,220,140', 0.9 * dl); P.circle(640, sy, 70, P.rad(630, sy + 10, 80, '#fff6d8', '#ffd36b')); });
  if (t > 99.5 && t < 104) P.alpha(tw(t, 99.6, 100.4) * (1 - tw(t, 103, 104)), () => { P.circle(-620, SEA + 300, 46, '#f4f1e0'); P.circle(-602, SEA + 312, 40, P.mixc('#0d1230', '#2a2a5a', 0.5)); });
  const fa = tw(t, T.face, T.face + 0.6) * (1 - tw(t, 77, 79)); if (fa > 0) P.alpha(fa, () => Cast.face(t, 0, SEA + 82, 190, { mood: t < 70.2 ? 'wow' : 'happy', look: [0.6, 0.3], seed: 31, ink: '#141018' }));
  // life arrives (75-88): a coconut on the waves, a spider ballooning in, a bird drops a seed
  const coco = tw(t, 75.4, 78.6, 'out'); if (coco > 0 && t < 82) P.at(lerp(900, 420, coco), SEA + 4 + Math.sin(t * 3) * 6, t * 0.6, 1, 1, () => { P.lit(P.blobPts(0, 0, 26, 22, 10, 0.08, 2), '#7a4a26', { d: 0.25 }); P.circle(-6, 6, 3, '#3a2010'); P.circle(4, 8, 3, '#3a2010'); });
  if (t > 78.6) Nature.palm(t, 420, SEA + 10, lerp(10, 170, tw(t, 78.8, 82.5, 'out')), 3);
  if (t > 86) { Nature.palm(t, -430, SEA + 10, lerp(10, 150, tw(t, 86, 89, 'out')), 5); Nature.palm(t, 470, SEA + 6, lerp(10, 120, tw(t, 88, 91, 'out')), 7); }
  const sp = tw(t, 79.4, 82.6, 'inOut'); if (sp > 0 && sp < 1) { const x = lerp(-1100, -260, sp), y = lerp(SEA + 380, mountainY(-260, h) + 6, sp) + Math.sin(sp * 9) * 30; P.ribbon([[x, y], [x - 160, y + 120 + Math.sin(t * 2) * 20]], 1.5, 'rgba(255,255,255,0.8)'); P.blob(x, y, 9, 7, '#2a2a2a', { seed: 4 }); for (let i = 0; i < 4; i++) P.ribbon([[x - 6 + i * 4, y], [x - 12 + i * 8, y - 10]], 1.5, '#2a2a2a'); }
  const bu = tw(t, 82.2, 85.4, 'linear'); if (bu > 0 && bu < 1) Nature.bird(t, lerp(-1100, 1100, bu), SEA + 330, 1.2, 7, 1);
  const seedU = tw(t, 83.6, 84.6, 'in'); if (seedU > 0 && seedU < 1) P.circle(lerp(-10, 40, seedU), lerp(SEA + 320, mountainY(40, h) + 6, seedU), 7, '#6a4a2a');
  for (let i = 0; i < 9; i++) { const g = tw(t, 84.6 + i * 0.4, 86 + i * 0.4, 'backOut'); if (g <= 0 || t > 96) continue; const x = -280 + i * 70, y = mountainY(x, h); P.blob(x, y + 4, 34 * g, 14 * g, i % 2 ? C.green : '#6fbf5a', { seed: i + 40 }); }
  // rain, waterfalls, forest, the canoe (88-100)
  const rc = tw(t, T.rain, T.rain + 1) * (1 - tw(t, 94, 95.5)); if (rc > 0) { P.alpha(rc, () => { Nature.cloud(-120, SEA + 420, 1.3, 8, '#8a90a8'); Nature.cloud(160, SEA + 460, 1.1, 9, '#9aa0b8'); }); const [x0] = P.toScreen(-360, 0), [x1] = P.toScreen(360, 0), [, y0] = P.toScreen(0, SEA + 400), [, y1] = P.toScreen(0, SEA + 40); Nature.rain(t, rc, [x0, x1, y0, y1]); }
  const wf = tw(t, 90, 92); if (wf > 0 && t < 101) for (const vx of [-140, 80]) { const x = vx * 1.25, y0 = mountainY(vx, h) - 20; P.alpha(wf, () => { P.ribbon([[vx, y0], [x, SEA + 40], [vx * 1.45, SEA + 6]], [10, 12, 14], 'rgba(170,230,255,0.85)'); for (let i = 0; i < 4; i++) { const u = (t * 1.5 + i / 4) % 1; P.circle(lerp(vx, vx * 1.45, u), lerp(y0, SEA + 6, u), 4, '#ffffff'); } }); }
  const forest = tw(t, 92, 97); if (forest > 0) for (let i = 0; i < 26; i++) { const x = -360 + hash(i, 71) * 720, y = mountainY(x, h); if (y < SEA + 30) continue; const g = tw(t, 92 + hash(i, 72) * 4, 93.5 + hash(i, 72) * 4, 'backOut'); if (g > 0) Nature.tree(t, x, y - 4, 70 * g * (0.7 + 0.5 * hash(i, 73)), i % 3 ? '#3f8f45' : '#5aa85a', i); }
  const cu = tw(t, T.canoe, 99.4, 'out'); if (cu > 0) drawCanoe(t, lerp(1300, 640, cu), SEA - 6, 0.55);
  // night: the camp fire on the beach and the glow at the summit (100-102.5)
  const nf = tw(t, 99.6, 100.4) * (1 - tw(t, 106, 108)); if (nf > 0) { P.glow(560, SEA + 16, 90, '255,170,80', nf * (0.8 + 0.2 * Math.sin(t * 9))); P.circle(560, SEA + 12, 8, '#ffb347'); P.glow(0, top, 200, '255,100,40', nf * 0.5); }
}
// the twist: the chain riding the plate away from the hot spot, and the next island growing
function chain(t) {
  const a = tw(t, T.pull - 0.2, T.pull + 1.4); if (a <= 0) return;
  P.alpha(a, () => {
    // older islands to the northwest (left): lower, greener, eroded, with reef rings; then a drowned atoll
    for (const [cx, hh, seed] of [[-1500, 700, 2], [-2700, 560, 4], [-3800, 420, 6]]) { drawMountain(t, hh, { cx, seed, veg: 1, valleys: 1, beach: 1 }); if (FLOOR + hh > SEA) for (const s of [-1, 1]) P.blob(cx + s * (420 + 0.95 * hh) * 0.55, SEA - 10, 60, 10, 'rgba(120,230,220,0.7)', { seed }); else P.blob(cx, SEA - 12, 120, 12, 'rgba(120,230,220,0.8)', { seed }); }
    // the plate slides left (northwest): chevrons along the floor; the plume stays under the young island
    for (let i = 0; i < 14; i++) { const x = ((-i * 500 - t * 120) % 7000) + 3500; P.poly([[x, FLOOR - 120], [x - 60, FLOOR - 90], [x, FLOOR - 60], [x - 20, FLOOR - 90]], 'rgba(255,255,255,0.35)'); }
    drawPlume(t, FLOOR - 10, 1, 900);
    // the next island, growing on the right, with its own little camera
    drawMountain(t, lerp(200, 430, tw(t, T.next, 124)), { cx: 1900, seed: 9 }); P.glow(1900, FLOOR + lerp(200, 430, tw(t, T.next, 124)), 220, '255,120,40', 0.5 + 0.2 * Math.sin(t * 2));
    drawAngler(t, lerp(2700, 1500, tw(t, T.next, 127.5, 'linear')), FLOOR + 380, 2.0, -1, 'happy');
  });
  P.pill('older islands drift away and sink', 600, 200, { u: tw(t, 106, 106.4) * (1 - tw(t, 114.4, 114.9)), font: FONT, size: 52, weight: 800 });
  P.pill('the next island, already growing', 960, 200, { u: tw(t, 117.5, 117.9) * (1 - tw(t, 127, 127.5)), font: FONT, size: 52, weight: 800 });
}
const FILM = {
  draw(t) {
    const c = camera(t), tv = viewTime(t);
    DAY = undefined; sky(tv, t); P.cam(c);
    const dl = t < REW[0] ? 0.95 : t < REW[1] ? lerp(0.95, daylight(REW[1]), K.ease.inOut(K.inv(REW[0], REW[1], t))) : undefined; DAY = dl;
    seaAndFloor(tv, c, dl);
    chain(t);
    events(tv);
    // the water's surface on top of everything underwater: waves, foam
    const pts = []; for (let x = -9000; x <= 9000; x += 60) pts.push([x, SEA + Math.sin(x * 0.012 + t * 1.6) * 6]); P.ribbon(pts, 5, 'rgba(255,255,255,0.55)');
    clock(t, tv);
    P.vignette(0.35);
  },
};
