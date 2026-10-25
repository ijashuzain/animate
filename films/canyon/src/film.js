// How a River Carved the Grand Canyon: one cross-section through northern Arizona, built layer by layer through
// 1.8 billion years (windows open into the seas and the dune desert as each layer forms), lifted, then cut by the river.
const T = { rew: 5, base: 12, seas: 24, red: 38, dune: 50, kai: 62, lift: 72, hush: 84, cut: 86.5, widen: 100, cliffs: 112, today: 122, D: 130 };
const WIN = [[28, 34.5, 'cambrian'], [40.5, 47.5, 'redwall'], [52.3, 60.3, 'dune'], [122.6, 130.5, 'river']];
// the build of each layer (0..1) over time
const BUILD = [[24, 28], [29, 32.5], [33, 37], [38, 47.8], [48, 51.5], [51.5, 52.2], [58.5, 61.5], [62, 64.5], [65, 70]];
const LIFT0 = -900;
function state(t) {
  // the story's own time (the hook shows the canyon today, then a rewind runs everything backwards to the start)
  const st = t < T.rew ? T.D - 2 : t < T.base ? lerp(T.D - 2, 11, K.ease.inOut(K.inv(T.rew, T.base, t))) : t;
  const built = BUILD.map(([a, b]) => tw(st, a, b, 'inOut'));
  const lift = lerp(LIFT0, 0, tw(st, T.lift, T.lift + 10, 'inOut'));
  const cut = tw(st, T.cut + 1, T.widen + 1, 'inOut'), widen = tw(st, T.widen, T.cliffs + 4, 'inOut');
  const mountains = tw(st, 12.5, 16), flat = tw(st, 17.5, 23);
  // the sea: over each marine layer while it forms (not over the dunes), gone after the uplift
  const marine = (st > 24 && st < 48.5) || (st > 62 && st < 71);
  const seaA = marine ? tw(st, 24, 25) * (1 - tw(st, 47.5, 48.5)) + (st > 62 ? tw(st, 62, 63) * (1 - tw(st, 70, 71)) : 0) : 0;
  let topNow = 0; BUILD.forEach((_, i) => { if (built[i] > 0) topNow = LTOP[i][0] + LAYERS[i][1] * built[i]; });
  return { st, built, lift, cut, widen, mountains, flat, seaA, sea: topNow + 140, seaTop: topNow, plants: tw(st, T.lift + 6, T.lift + 10), topNow };
}
function camera(t, s) {
  const st = s.st, follow = s.topNow + s.lift;
  if (st < T.lift) return { x: 0, y: Math.max(LIFT0 + 300, follow + LIFT0 * 0 - 300 + 200), h: 2300 };
  if (st < T.cut) { const u = K.ease.inOut(K.inv(T.lift + 3, T.hush, st)); return { x: 0, y: lerp(LIFT0 + RIM - 100 - 700 + 300, 520, u), h: 2400 }; }
  return { x: 0, y: 520, h: lerp(2400, 2200, tw(st, T.cut, T.today)) };
}
const pill = (str, sx, sy, u, o = {}) => P.pill(str, sx, sy, Object.assign({ u, font: FONT, size: 40, weight: 800 }, o));
const CLOCK = (ctx, r) => { ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, 6.3); ctx.stroke(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.55); ctx.moveTo(0, 0); ctx.lineTo(r * 0.4, 0); ctx.stroke(); };
function ago(st) {
  if (st >= T.today || st < 0) return 'today';
  const keys = [[11, 1800], [24, 525], [38, 340], [50, 300], [52, 275], [62, 270], [71, 70], [84, 6], [T.cut, 6], [T.widen, 3], [T.today - 0.5, 0.01]];
  let my = 1800; for (let i = 1; i < keys.length; i++) if (st <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; my = Math.exp(lerp(Math.log(va), Math.log(vb), K.inv(a, b, st))); break; } else my = keys[i][1];
  return my >= 1000 ? `${(my / 1000).toFixed(1)} billion years ago` : my >= 1 ? `${Math.round(my)} million years ago` : 'today';
}
function crossScene(t) {
  const s = state(t), st = s.st, cam = camera(t, s);
  const day = st > T.hush - 1 && st < T.cut ? 0.1 : st < T.rew || st > T.today - 2 ? 0.8 : 0.9, gold = st < T.rew || st > T.today - 3 ? 1 : 0.25;
  sky(t, day, gold, [1500, 200, 80]);
  P.cam(cam);
  crossSection(t, s);
  // the ancient mountains: a pill while they stand, "worn flat"
  if (st > 12 && st < 24) { pill('about 1.8 billion years: mountains', 960, 300, tw(st, 13, 13.6) * (1 - tw(st, 17.5, 18)), { size: 36 }); pill('worn flat', 960, 300, tw(st, 19, 19.6) * (1 - tw(st, 23, 23.6)), { size: 36 }); }
  // each layer's name and age as it forms (on the right, at the layer's height)
  LAYERS.forEach(([name, th, , , age], i) => { const [a, b] = BUILD[i]; if (st < a || st > b + 3 || (st > T.base && st < T.lift && (st < a))) return; const y = LTOP[i][0] + th * 0.5 + s.lift, sp = P.toScreen(0, y); pill(`${name} · ${age}`, 1450, sp[1], tw(st, a + 0.3, a + 0.9) * (1 - tw(st, b + 2, b + 3)), { size: 30, weight: 700 }); });
  // the uplift: the old sea level stays, the block rises past it
  if (st > T.lift - 0.5 && st < T.cut) { const yS = LIFT0 + RIM + 140; P.alpha(tw(st, T.lift, T.lift + 1) * (1 - tw(st, T.hush - 1, T.hush)), () => { P.ctx.save(); P.ctx.strokeStyle = 'rgba(80,190,230,0.9)'; P.ctx.lineWidth = 5 / P.k; P.ctx.setLineDash([30 / P.k, 20 / P.k]); P.ctx.beginPath(); P.ctx.moveTo(-5000, yS); P.ctx.lineTo(5000, yS); P.ctx.stroke(); P.ctx.restore(); }); const sp = P.toScreen(-1300, yS); pill('old sea level', sp[0], sp[1] - 40, tw(st, T.lift + 0.5, T.lift + 1) * (1 - tw(st, T.hush - 1, T.hush)), { size: 30, weight: 700 }); pill('pushed up about 2 km: the Colorado Plateau', 960, 220, tw(st, T.lift + 4, T.lift + 4.6) * (1 - tw(st, T.hush - 1, T.hush)), { size: 36 }); }
  // the river's work: notch labels, then frost, flash flood, rockfall
  if (st > T.cut + 1 && st < T.widen) pill('a few centimetres per thousand years', 960, 220, tw(st, T.cut + 2, T.cut + 2.6) * (1 - tw(st, T.widen - 1, T.widen - 0.4)), { size: 34 });
  const ev = (a, label) => { const u = tw(st, a, a + 0.5) * (1 - tw(st, a + 3.2, a + 3.8)); pill(label, 960, 220, u, { size: 36 }); return K.inv(a, a + 3.5, st); };
  if (st > T.widen && st < T.cliffs) {
    const f = ev(T.widen + 0.5, 'frost cracks the rock at night'), ff = ev(T.widen + 4.2, 'flash floods drag boulders'), rf = ev(T.widen + 7.9, 'rockfalls widen the walls');
    if (f > 0 && f < 1) { const x = RIMX * 0.8 + s.lift * 0, y = RIM * 0.86; P.alpha(Math.sin(f * Math.PI), () => { P.ribbon([[x, y + 60], [x + 10, y], [x - 6, y - 50], [x + 8, y - 110]], [10, 14, 10, 4].map((w) => w * f * 2 + 2), '#2a1420'); P.glow(x, y, 120, '200,230,255', 0.5); }); }
    if (ff > 0 && ff < 1) { const sp = s.cut; P.alpha(Math.sin(ff * Math.PI), () => P.rect(-120, RIVER - 6, 240, 60, 'rgba(150,100,60,0.85)')); void sp; }
    if (rf > 0 && rf < 1) { const x0 = -WALL[6][0] - 20, y0 = LTOP[3][1] - 40, d = K.ease.in(clamp(rf * 1.4)) * (y0 - RIVER - 20); P.at(x0 + rf * 80, y0 - d, rf * 2, 1, 1, () => P.lit([[-30, -24], [30, -20], [36, 24], [-26, 26]], '#b8442e', { d: 0.2 })); }
  }
  // hard vs soft: cliff and slope labels on the finished walls
  if (st > T.cliffs && st < T.today) { const hardY = P.toScreen(WALL[0][0], LTOP[3][0] + 95), softY = P.toScreen(0, LTOP[4][0] + 130), r = P.toScreen(WALL[6][0] + 60, 0);
    pill('hard rock: cliffs', r[0] + 180, hardY[1], tw(st, T.cliffs + 0.5, T.cliffs + 1) * (1 - tw(st, T.today - 1, T.today - 0.5)), { size: 32 }); pill('soft rock: slopes', r[0] + 330, softY[1], tw(st, T.cliffs + 2, T.cliffs + 2.5) * (1 - tw(st, T.today - 1, T.today - 0.5)), { size: 32 });
    const d = P.toScreen(0, RIVER); pill('about 1.8 km deep', 960, Math.min(980, d[1] + 70) - 60, tw(st, T.cliffs + 4, T.cliffs + 4.6) * (1 - tw(st, T.today - 1, T.today - 0.5)), { size: 32 }); }
  // ravens and a condor over the canyon (they face the way they fly) once it's open
  if (s.cut > 0.3) for (let i = 0; i < 3; i++) { const dir = i % 2 ? -1 : 1, u = (t * 0.03 + hash(i, 40)) % 1, x = dir > 0 ? lerp(-2400, 2400, u) : lerp(2400, -2400, u); Animals.bird(t, x, RIM + 300 + i * 140 + Math.sin(t + i) * 30, 6 - i, i ? 'raven' : 'condor', { fly: true, dir }); }
  // the clock
  pill(t < T.rew ? 'today' : ago(st), 330, 100, tw(t, 0.3, 0.8), { icon: CLOCK, size: 40 });
  if (t > T.rew && t < T.base) { const a = Math.sin(K.inv(T.rew, T.base, t) * Math.PI); P.screen((ctx) => { ctx.globalAlpha = 0.22 * a; ctx.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const y = (hash(i, 3) * 1080 + t * 900 * (i % 2 ? 1 : -1) + 4 * 1080) % 1080; ctx.fillRect(0, y, 1920, 3); } }); }
  P.vignette(0.3);
}
const FILM = {
  draw(t) {
    // the windows into the past (and the river today): dip to dark in and out (LEARNINGS: no cross-fades of two scenes)
    for (const [a, b, kind] of WIN) {
      if (t > a - 0.4 && t < b + 0.4) {
        const inWin = t >= a && t < b;
        if (inWin) { if (kind === 'dune') duneWindow(t, a); else if (kind === 'river') riverWindow(t, a); else seaWindow(t, kind); }
        else crossScene(t);
        const d = t < a ? K.inv(a - 0.4, a, t) : t < a + 0.4 ? 1 - K.inv(a, a + 0.4, t) : t > b ? 1 - K.inv(b, b + 0.4, t) : t > b - 0.4 ? K.inv(b - 0.4, b, t) : 0;
        if (d > 0) P.haze('#120a14', d);
        if (inWin) { const lab = { cambrian: 'a shallow sea, about 515 million years ago', redwall: 'a warm sea, about 340 million years ago', dune: 'a desert of giant dunes, about 275 million years ago', river: 'today' }[kind]; pill(lab, 960, kind === 'river' ? 120 : 980, tw(t, a + 0.5, a + 1) * (1 - tw(t, b - 0.8, b - 0.4)), { size: 34 }); }
        if (kind === 'dune' && inWin) { const sp = [1200, 640]; pill('its footprints are still there, in the stone', sp[0], sp[1], tw(t, a + 4.5, a + 5) * (1 - tw(t, b - 0.8, b - 0.4)), { size: 32, weight: 700 }); }
        if (t > T.D - 1) P.haze('#120a14', tw(t, T.D - 1, T.D));
        return;
      }
    }
    crossScene(t);
    if (t < 0.6) P.haze('#120a14', 1 - tw(t, 0, 0.6));
  },
};
