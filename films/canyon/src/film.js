// How a River Carved the Grand Canyon: one real place seen in perspective (src/view.js). Today's canyon; we read its
// walls from the river up (windows open into the seas and the desert that made each layer); the canyon fills back in
// to a flat plain at sea level; the land rises; the river cuts down and the walls widen into stairs; today again.
const T = { read: 9, win1: 21.5, win2: 29.5, win3: 37.5, back: 46.5, fill: 47, sea: 53, rise: 54.5, hush: 59, cut: 61.5, widen: 79, today: 95, river: 95.5, end: 103.5, D: 110 };
const WIN = [[T.win1, T.win2 - 0.5, 'cambrian'], [T.win2, T.win3 - 0.5, 'redwall'], [T.win3, T.back, 'dune'], [T.river, T.end, 'river']];
const pill = (str, sx, sy, u, o = {}) => P.pill(str, sx, sy, Object.assign({ u, font: FONT, size: 40, weight: 800 }, o));
const CLOCK = (ctx, r) => { ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, 6.3); ctx.stroke(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.55); ctx.moveTo(0, 0); ctx.lineTo(r * 0.4, 0); ctx.stroke(); };
// the carving state
const cutAt = (t) => (t < T.fill ? 1 : t < T.cut ? 1 - tw(t, T.fill, T.fill + 5.5, 'inOut') : tw(t, T.cut + 1, T.widen + 1, 'inOut'));
const widenAt = (t) => (t < T.fill ? 1 : t < T.cut ? 1 - tw(t, T.fill, T.fill + 4, 'inOut') : tw(t, T.widen, T.today - 2, 'inOut'));
function clockText(t) {
  if (t < T.fill || t >= T.today) return 'today';
  if (t < T.sea) return `${Math.max(0.1, 6 * tw(t, T.fill, T.fill + 5.5, 'inOut')).toFixed(1)} million years ago`;
  if (t < T.cut) return t < T.rise ? 'about 70 million years ago' : `${Math.round(lerp(70, 6, tw(t, T.rise, T.hush, 'inOut')))} million years ago`;
  return `${Math.max(0.1, 6 * (1 - tw(t, T.cut, T.today - 1, 'linear'))).toFixed(1)} million years ago`;
}
// the camera through the film (world metres)
function cam(t) {
  const K0 = { x: V3.center(800) + 100, y: 700, z: -400, yaw: -0.05, pitch: 0.1, f: 1100 };       // inside, looking down the canyon
  const KR = { x: V3.center(800) + 150, y: 420, z: 200, yaw: -0.25, pitch: 0.06, f: 1050 };          // low by the river, facing the right wall
  const KA = { x: V3.center(0) - 200, y: RIM + 900, z: -2600, yaw: 0.04, pitch: -0.3, f: 1250 };     // over the rim, looking along it (aerial)
  const mix = (a, b, u) => { const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], u); return o; };
  if (t < T.read) return mix(K0, { ...K0, z: 200 }, tw(t, 0, T.read, 'inOut'));
  if (t < T.win1) return mix({ ...K0, z: 200 }, KR, tw(t, T.read, T.read + 3, 'inOut'));
  if (t < T.fill) return KR;
  if (t < T.today) return mix(mix(KR, KA, tw(t, T.fill, T.fill + 3, 'inOut')), { ...KA, y: RIM + 700, pitch: -0.26, z: -1800 }, tw(t, T.cut, T.today, 'inOut'));
  return mix({ ...KA, y: RIM + 700, pitch: -0.26, z: -1800 }, { ...K0, z: -200 }, tw(t, T.end, T.end + 2.5, 'inOut'));
}
function canyonScene(t) {
  const c = cam(t), cut = cutAt(t), widen = widenAt(t);
  const night = t > T.hush - 1 && t < T.cut + 0.5 ? Math.sin(K.inv(T.hush - 1, T.cut + 0.5, t) * Math.PI) : 0;
  const gold = t < T.read || t > T.end ? 0.75 : 0.2, day = 1 - night * 0.9;
  V3.sky(t, c, { day, gold, sunX: 1450, sunH: t < T.read || t > T.end ? 90 : 260 });
  V3.draw(t, c, { cut, widen, haze: P.mixc(P.mixc('#b8b4d8', '#f0b0a0', gold), '#3a4280', night * 0.8), plants: 1, sun: night > 0.5 ? [0.2, 0.9, -0.3] : [0.62, 0.5, -0.6] });
  if (night > 0) P.haze('#1a2050', night * 0.3);
  // the ancient sea over the flat plain, then the land rising past it (the sea level drops away below the plain)
  if (t > T.fill + 4 && t < T.hush) {
    const seaY = RIM + 40 - 2200 * tw(t, T.rise, T.rise + 4, 'in'), a = tw(t, T.fill + 4, T.sea);
    P.alpha(a, () => P.screen((ctx) => { const pts = [[-20000, 600], [20000, 600], [20000, 60000], [-20000, 60000]].map(([X, Z]) => V3.proj(c, X, seaY, Z)).filter(Boolean); if (pts.length < 4) return; const g = ctx.createLinearGradient(0, pts[2][1], 0, 1080); g.addColorStop(0, '#9ad8e0'); g.addColorStop(1, '#2a8ab0'); ctx.fillStyle = g; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { const Z = 900 * Math.pow(50, i / 12), p0 = V3.proj(c, -20000, seaY, Z), p1 = V3.proj(c, 20000, seaY, Z); if (p0 && p1) { ctx.beginPath(); ctx.moveTo(p0[0], p0[1] + Math.sin(t * 2 + i) * 2); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); } } }));
    pill('a flat plain near sea level', 960, 200, tw(t, T.fill + 4.5, T.fill + 5) * (1 - tw(t, T.rise - 0.4, T.rise)), { size: 36 });
    pill('then the whole region was pushed up about 2 km', 960, 200, tw(t, T.rise + 0.4, T.rise + 0.9) * (1 - tw(t, T.hush - 0.6, T.hush)), { size: 36 });
  }
  // reading the wall: each band named with its age, from the river up
  if (t > T.read + 2.5 && t < T.win1 + 0.4) {
    const bands = [[-250, 'Vishnu Schist · 1.8 billion years'], [40, 'Tapeats Sandstone · 525 million years'], [400, 'Redwall Limestone · 340 million years'], [890, 'Coconino Sandstone · 275 million years'], [1080, 'Kaibab Limestone · 270 million years']];
    bands.forEach(([y, label], i) => { const Z = 2600, pr = V3.profile(1, 1), X = V3.center(Z) + ((pr.find((w) => w[1] >= y) ?? pr[pr.length - 1])[0] + 20) * V3.jut(Z, 1), p = V3.proj(c, X, y, Z); if (!p) return; const a = tw(t, T.read + 3 + i * 1.6, T.read + 3.5 + i * 1.6) * (1 - tw(t, T.win1 - 0.6, T.win1)); P.screen((ctx) => { ctx.globalAlpha = a; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }); P.screen((ctx) => { ctx.globalAlpha = a; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + 90, p[1]); ctx.stroke(); ctx.globalAlpha = 1; }); pill(label, Math.min(p[0] + 90 + 230, 1620), p[1], a, { size: 28, weight: 700 }); });
    pill('every layer is a different world', 960, 120, tw(t, T.read + 11, T.read + 11.5) * (1 - tw(t, T.win1 - 0.6, T.win1)), { size: 36 });
  }
  // the river's work and the widening: frost, flash floods, rockfalls; then cliffs and slopes
  if (t > T.cut + 1.5 && t < T.widen) pill('the river cuts down: a few centimetres per thousand years', 960, 200, tw(t, T.cut + 2, T.cut + 2.6) * (1 - tw(t, T.widen - 1, T.widen - 0.4)), { size: 34 });
  const ev = (a, label) => { pill(label, 960, 200, tw(t, a, a + 0.5) * (1 - tw(t, a + 4, a + 4.6)), { size: 36 }); return K.inv(a, a + 4.2, t); };
  if (t > T.widen && t < T.today) {
    ev(T.widen + 0.3, 'frost cracks the rock at night'); const ff = ev(T.widen + 5, 'flash floods drag boulders down'); const rf = ev(T.widen + 9.7, 'rockfalls widen the walls');
    // a rockfall: a slab tumbling down the left wall
    if (rf > 0 && rf < 1) { const Z = 5200, X0 = V3.center(Z) - 900, y = lerp(RIM - 150, RIVER + 40, K.ease.in(rf)), p = V3.proj(c, X0 + rf * 300, y, Z); if (p) P.screen((ctx) => { ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(rf * 5); const s = 40000 / p[2]; ctx.fillStyle = '#b8503a'; ctx.beginPath(); ctx.moveTo(-s, -s * 0.6); ctx.lineTo(s * 0.9, -s * 0.8); ctx.lineTo(s, s * 0.6); ctx.lineTo(-s * 0.7, s * 0.8); ctx.fill(); ctx.fillStyle = '#7a2a3a'; ctx.beginPath(); ctx.moveTo(s * 0.9, -s * 0.8); ctx.lineTo(s, s * 0.6); ctx.lineTo(s * 0.3, s * 0.7); ctx.fill(); ctx.restore(); for (let i = 0; i < 6; i++) { ctx.globalAlpha = 0.5 * (1 - rf); ctx.fillStyle = '#e8c8a8'; ctx.beginPath(); ctx.arc(p[0] + (i - 3) * 14, p[1] - 30 - i * 12 * rf, 10 + i * 3, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }); }
    // the flash flood: the river turns brown and wide for a moment
    if (ff > 0 && ff < 1) P.alpha(Math.sin(ff * Math.PI) * 0.8, () => P.screen((ctx) => { ctx.fillStyle = '#a8724a'; for (let i = 0; i < 30; i++) { const Z = 2500 * Math.pow(12, i / 30), p0 = V3.proj(c, V3.center(Z) - 120, RIVER + 3, Z), p1 = V3.proj(c, V3.center(Z) + 120, RIVER + 3, Z); if (p0 && p1) ctx.fillRect(Math.min(p0[0], p1[0]), p0[1] - 2, Math.abs(p1[0] - p0[0]), 5 + 1200 / Z); } }));
  }
  if (t > T.today - 2.5 && t < T.today + 0.2) { pill('hard rock stands in cliffs, soft rock crumbles into slopes', 960, 200, tw(t, T.today - 2.4, T.today - 2), { size: 32 }); }
  // the hook and the end: name the place, the depth; birds over the canyon (they face the way they fly)
  pill('the Grand Canyon, Arizona', 960, 160, tw(t, 0.8, 1.3) * (1 - tw(t, T.read - 0.5, T.read)), { size: 46 });
  pill('about 1.8 km deep, carved by this river', 960, 236, tw(t, 2.5, 3) * (1 - tw(t, T.read - 0.5, T.read)), { size: 34 });
  for (let i = 0; i < 3; i++) { const dir = i % 2 ? -1 : 1, u = (t * 0.035 + K.hash(i, 40)) % 1, x = dir > 0 ? lerp(-150, 2070, u) : lerp(2070, -150, u); P.screen(() => P.at(x, 260 + i * 70 + Math.sin(t + i) * 12, 0, 1, -1, () => Animals.bird(t, 0, 0, [1.3, 0.8, 0.6][i], i ? 'raven' : 'condor', { fly: true, dir }))); }
  // foreground: a cactus clump and grass in the near corner (refs/view-river) while we're down in the canyon
  if (t < T.fill) flora(t);
  pill(clockText(t), 330, 90, tw(t, 0.3, 0.8), { icon: CLOCK, size: 38 });
  P.vignette(0.28);
}
const FILM = {
  draw(t) {
    for (const [a, b, kind] of WIN) {
      if (t > a - 0.4 && t < b + 0.4) {
        const inWin = t >= a && t < b;
        if (inWin) { if (kind === 'dune') duneScene(t, a); else if (kind === 'river') raftScene(t, a); else seaLife(t, kind); }
        else canyonScene(t);
        const d = t < a ? K.inv(a - 0.4, a, t) : t < a + 0.4 ? 1 - K.inv(a, a + 0.4, t) : t > b ? 1 - K.inv(b, b + 0.4, t) : t > b - 0.4 ? K.inv(b - 0.4, b, t) : 0;
        if (d > 0) P.haze('#120a14', d);
        if (inWin) {
          const lab = { cambrian: 'the lowest layers: a shallow sea, about 515 million years ago', redwall: 'the red band: a warm sea, about 340 million years ago', dune: 'the pale band: a desert of giant dunes, about 275 million years ago', river: 'today' }[kind];
          pill(lab, 960, kind === 'river' ? 120 : 980, tw(t, a + 0.5, a + 1) * (1 - tw(t, b - 0.8, b - 0.4)), { size: 34 });
          if (kind === 'dune') pill('an early cousin of mammals', 900, 700, tw(t, a + 1.4, a + 1.9) * (1 - tw(t, a + 4.6, a + 5)), { size: 30, weight: 700 });
          if (kind === 'dune') pill('its footprints are still there, in the stone', 1200, 640, tw(t, a + 6.4, a + 6.9) * (1 - tw(t, b - 0.8, b - 0.4)), { size: 32, weight: 700 });
        }
        return;
      }
    }
    canyonScene(t);
    if (t < 0.6) P.haze('#120a14', 1 - tw(t, 0, 0.6));
    if (t > T.D - 1) P.haze('#120a14', tw(t, T.D - 1, T.D));
  },
};
