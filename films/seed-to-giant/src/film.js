// Seed to Giant: one continuous shot. Part 1 (0-9.6 s) is the cone, drawn in millimetres; a fire flash hands over to
// part 2 (9.6-30 s), the forest in metres, where the camera falls with the seed, then rides the growing tip up.
const FONT = '"Fredoka", sans-serif';
const T = { rice: 0.5, flick: 2.9, tuck: 3.9, years: 4.8, yearsEnd: 7.2, fire: 7.3, wake: 7.9, pop: 8.4, flash: 9.6, land: 12.9, sprout: 14.4, coat: 15.3, kid: 16.8, house: 18.4, whale: 20.4, gold: 23.0, cloud: 24.6, top: 25.8, out: 26.4, inset: 28.0, end: 30 };
const { lerp, clamp, tw, track, logTrack, hash, noise } = K;

// ---------- part 1: the cone (mm) ----------
const camA = { h: logTrack([[0, 18], [2.8, 18], [4.4, 230, 'inOut'], [7.3, 200, 'inOut'], [9.6, 190, 'inOut']]), x: track([[0, 0], [2.8, 0], [4.4, -2, 'inOut']]), y: track([[0, -62], [2.8, -62], [4.4, -6, 'inOut'], [9.6, -2]]) };
function skyA(t) {
  // dusk, then 20 years of days and nights whipping by, then fire light
  const p = tw(t, T.years, T.yearsEnd, 'inOut'), day = p > 0 && p < 1 ? 0.5 - 0.5 * Math.cos(p * Math.PI * 2 * 6) : 0;
  const top = P.mixc(P.mixc('#232250', '#1a2a5a', p > 0 ? 1 : 0), '#6fb6e8', day), bot = P.mixc(P.mixc('#e3866a', '#2c3a72', p > 0 && p < 1 ? 1 : 0), '#cfe8f6', day);
  const fire = tw(t, T.fire, T.pop);
  P.sky(P.mixc(top, '#3a1d2a', fire), P.mixc(bot, '#ff8a3d', fire), P.mixc(P.mixc(top, bot, 0.5), '#b0453a', fire));
  // far trunks of the grove, soft and low-contrast, scaled with the zoom
  const z = Math.pow(camA.h(t) / 200, -0.12);
  P.screen((ctx) => { for (let i = 0; i < 7; i++) { const x = 960 + ((hash(i, 2) * 2 - 1) * 1100) * z, w = (60 + hash(i, 3) * 120) * z; ctx.fillStyle = P.rgba(P.mixc(top, '#5a2a2a', 0.5), 0.35 + 0.2 * hash(i, 4)); ctx.fillRect(x - w / 2, 0, w, 1080); } });
  // bokeh
  P.screen(() => {}); for (let i = 0; i < 18; i++) { const [sx, sy] = [hash(i, 11) * 1920, hash(i, 12) * 1080]; P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,${190 + 40 * hash(i, 5)},150,${0.05 + 0.06 * hash(i, 6)})`; ctx.beginPath(); ctx.arc(sx + Math.sin(t * 0.3 + i) * 20, sy, 30 + 60 * hash(i, 7), 0, 6.3); ctx.fill(); }); }
  // snow in two winters
  const snow = Math.max(tw(t, 5.5, 5.7) * (1 - tw(t, 6.0, 6.2)), tw(t, 6.5, 6.7) * (1 - tw(t, 6.9, 7.1)));
  if (snow > 0) P.screen((ctx) => { ctx.fillStyle = `rgba(255,255,255,${0.85 * snow})`; for (let i = 0; i < 90; i++) { const x = (hash(i, 21) * 1920 + Math.sin(t * 2 + i) * 30) % 1920, y = (hash(i, 22) * 1080 + t * 260) % 1080; ctx.beginPath(); ctx.arc(x, y, 3 + 4 * hash(i, 23), 0, 6.3); ctx.fill(); } });
}
function flames(t, k) {
  if (k <= 0) return;
  P.screen((ctx) => {
    const g = ctx.createLinearGradient(0, 1080, 0, 1080 - 700 * k); g.addColorStop(0, `rgba(255,120,30,${0.75 * k})`); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  });
  P.screen(() => {}); const pc = P.c; P.ctx.save(); P.ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < 16; i++) {
    const x = i * 128 + noise(t * 2 + i, 3) * 40, h = (260 + 320 * hash(i, 8)) * k * (0.75 + 0.25 * noise(t * 4 + i * 3, 9)), w = 120 + 60 * hash(i, 9);
    for (const [c, s] of [['#ff5a1f', 1], ['#ff9a2e', 0.72], ['#ffd65a', 0.45]]) P.smooth([[x - w * s, 1100], [x - w * 0.4 * s + noise(t * 5 + i, 1) * 20, 1080 - h * s * 0.55], [x + noise(t * 6 + i, 2) * 30, 1080 - h * s], [x + w * 0.4 * s + noise(t * 5 + i, 4) * 20, 1080 - h * s * 0.5], [x + w * s, 1100]], c, { a: 0.92 });
  }
  P.ctx.restore(); P.c = pc;
  embers(t, k, 0);
}
function embers(t, k, seed) { P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const sp = 120 + 260 * hash(i, seed + 31), y = 1080 - ((hash(i, seed + 32) * 1300 + t * sp) % 1300), x = hash(i, seed + 33) * 1920 + Math.sin(t * 2 + i) * 40, a = k * (0.5 + 0.5 * Math.sin(t * 9 + i)); ctx.fillStyle = `rgba(255,${150 + 80 * hash(i, 34)},60,${a})`; ctx.beginPath(); ctx.arc(x, y, 2 + 3 * hash(i, 35), 0, 6.3); ctx.fill(); } }); }
function partA(t) {
  skyA(t);
  const shake = t > T.pop && t < T.pop + 0.5 ? (1 - (t - T.pop) / 0.5) * 2.2 : 0;
  P.cam({ x: camA.x(t) + noise(t * 30, 1) * shake, y: camA.y(t) + noise(t * 30, 2) * shake, h: camA.h(t) });
  const open = K.ease.backOut(K.inv(T.pop, T.pop + 0.35, t)) * 1, settle = 1 - tw(t, 3.4, T.tuck, 'out') * 1;
  const heat = tw(t, T.fire, T.pop), burn = tw(t, T.fire + 0.3, T.flash);
  const eyes = t < T.wake ? 0 : K.ease.backOut(K.inv(T.wake, T.wake + 0.25, t)), look = t < T.wake + 0.3 ? [0, 0] : [0.2, -1];
  const [sqx, sqy] = K.squash(t, T.wake, 0.12, 0.3);
  P.at(0, 0, Math.sin(t * 0.9) * 0.03, sqx, sqy, () => drawCone(t, { open: Math.max(open, settle * 0.18), burn, heat, eyes, look }));
  // zzz while it waits
  if (t > 4.9 && t < T.wake) P.alpha(1 - tw(t, 7.5, T.wake), () => { for (let i = 0; i < 3; i++) { const u = ((t - 4.9) * 0.6 + i / 3) % 1, [sx, sy] = P.toScreen(18 + u * 30, 26 + u * 40); P.text('z', sx, sy, { font: FONT, size: 30 + u * 40, color: `rgba(255,255,255,${1 - u})`, weight: 600 }); } });
  // the seed and the grain of rice (macro), then the seed tucks into the cone and the rice is flicked away
  const ru = K.ease.backOut(K.inv(T.rice, T.rice + 0.7, t)), fu = tw(t, T.flick, T.flick + 0.6, 'in');
  if (fu < 1) drawRice(lerp(28, 7, ru) + fu * 60, -62 + fu * 25, 1, ru * 0.2 + fu * 9);
  const su = tw(t, 3.0, T.tuck, 'inOut');
  if (su < 1) drawSeed(lerp(-1.5, 3, su) + Math.sin(su * Math.PI) * -14, lerp(-62, -4, su) + Math.sin(t * 2) * 0.3 * (1 - su), lerp(1, 0.6, su), Math.sin(t * 1.5) * 0.4, Math.sin(t) * 0.1);
  // labels: seed / rice and the 5 mm bar
  const la = tw(t, 1.3, 1.7) * (1 - tw(t, 2.7, 2.95));
  if (la > 0) P.alpha(la, () => {
    const [a1, b1] = P.toScreen(-1.5, -66.5), [a2, b2] = P.toScreen(7, -66.5), [r0] = P.toScreen(-4, -58.6), [r1] = P.toScreen(1, -58.6), [, ry] = P.toScreen(0, -58.4);
    P.text('sequoia seed', a1, b1 + 40, { font: FONT, size: 40, weight: 600 }); P.text('rice', a2, b2 + 40, { font: FONT, size: 40, weight: 600 });
    const bu = tw(t, 1.8, 2.2, 'out'); P.screen((ctx) => { ctx.strokeStyle = '#ffd65a'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(r0, ry - 30); ctx.lineTo(lerp(r0, r1, bu), ry - 30); ctx.stroke(); }); if (bu > 0.5) P.text('5 mm', (r0 + r1) / 2, ry - 70, { font: FONT, size: 38, color: '#ffd65a', weight: 600 });
  });
  // the years
  const yu = tw(t, T.years, T.yearsEnd, 'inOut'), ya = tw(t, T.years, T.years + 0.3) * (1 - tw(t, T.fire + 0.2, T.wake));
  if (ya > 0) { const n = Math.max(1, Math.round(yu * 20)); P.text(`${n} year${n > 1 ? 's' : ''}`, 230, 120, { font: FONT, size: 64, weight: 600, alpha: ya, shadow: 'rgba(0,0,0,0.35)' }); }
  // fire, then the seeds burst out
  flames(t, tw(t, T.fire, T.pop + 0.4, 'out'));
  if (t > T.pop) for (let i = 0; i < 11; i++) { const a = (i / 11) * Math.PI * 2 + hash(i, 41), d = (t - T.pop), r = 70 * (1 - Math.exp(-d * 4)), g = 40 * d * d; drawSeed(Math.cos(a) * r, Math.sin(a) * r - g, 1.4, d * 12 + i, a); }
  P.glow(0, -30, 120, '255,170,80', heat * 0.6);
}

// ---------- part 2: the forest (m) ----------
const seedY = track([[9.6, 52], [10.0, 51.7, 'in2'], [12.9, 0.0026, 'inOut2']]);
const seedX = (t) => 0.02 + Math.sin((t - 9.6) * 1.4) * 0.45 * (1 - tw(t, 11.8, 12.9));
const ht = logTrack([[14.4, 0.0001], [15.6, 0.05, 'out'], [16.8, 1.6, 'in2'], [18.4, 10, 'linear'], [21.0, 30, 'linear'], [23.0, 50, 'linear'], [25.8, 84, 'out']]);
const camFallH = logTrack([[9.6, 0.19], [10.6, 7, 'inOut'], [12.1, 7, 'linear'], [12.9, 0.09, 'inOut'], [13.4, 0.13, 'inOut'], [14.2, 0.13], [14.9, 0.12, 'inOut']]);
const camFallY = (t) => { const fy = t < 12.9 ? seedY(t) + (t > 10.4 && t < 12.6 ? -camFallH(t) * 0.12 : 0) : 0.002; return lerp(lerp(fy, -0.035, tw(t, 13.2, 13.7, 'inOut')), 0.03, tw(t, 14.1, 14.6, 'inOut')); };
const climbXf = track([[15.6, 0], [16.8, 0.15], [18.0, -0.1], [19.6, 0.1], [21.2, 0.17], [23.0, 0], [25.0, -0.16], [26.4, -0.16], [28.2, -0.05]]);
const outH = logTrack([[26.4, 1], [28.4, 1.45, 'inOut']]);
function cam2(t) {
  const fall = { x: t < 12.9 ? seedX(t) : 0.002, y: camFallY(t), h: camFallH(t) };
  if (t < 15.4) return fall;
  const h = Math.max(0.12, ht(t) * 1.32) * outH(t), up = { x: climbXf(t) * h, y: Math.max(ht(t) * 0.56, h * 0.36), h };
  const u = tw(t, 15.4, 16.2, 'inOut');
  return { x: lerp(fall.x, up.x, u), y: Math.exp(lerp(Math.log(fall.y + 0.05), Math.log(up.y + 0.05), u)) - 0.05, h: Math.exp(lerp(Math.log(fall.h), Math.log(up.h), u)) };
}
function sky2(t, c) {
  const alt = clamp(Math.log10(1 + Math.max(0, c.y)) / 2), gold = tw(t, T.gold, T.top);
  const smoke = 1 - tw(t, 13.0, 16.5);
  const top = P.mixc(P.mixc(P.mixc('#6aa9dc', '#2f5fa8', alt), '#f2b45a', gold), '#3d2a3a', smoke), bot = P.mixc(P.mixc(P.mixc('#cfe9f6', '#9cc8ec', alt), '#ffe2a6', gold), '#c9703f', smoke);
  P.sky(top, bot);
  // distant ridges of other giants, sinking as we rise
  const sink = clamp(Math.log10(1 + Math.max(0, c.y)) / 2.2);
  P.screen((ctx) => {
    for (let L = 0; L < 3; L++) {
      const base = 640 + L * 120 + sink * (420 + L * 160), col = P.mixc(P.mixc(P.mixc('#8fb7d9', '#3f6f63', L / 2), '#f0c27a', gold * 0.5), '#5a3a3a', smoke * 0.7);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1080);
      for (let x = 0; x <= 1920; x += 40) { const tree = Math.pow(Math.abs(Math.sin((x + L * 300 + c.x * (8 + L * 6)) * 0.011 + L)), 6); ctx.lineTo(x, base - 90 * tree - 30 * noise(x * 0.01 + L * 10, 7)); }
      ctx.lineTo(1920, 1080); ctx.fill();
    }
  });
}
function ground(t, c) {
  // soil cross-section and ash bed (y = 0 is the surface)
  P.rect(-5000, -60, 10000, 60, C.soilDeep);
  // strata: wavy bands from dark humus near the top to clay below
  const bands = [['#4a2f20', 0], ['#5c3b27', -0.018], ['#6b4630', -0.045], ['#7a5236', -0.08], ['#86603f', -0.12]];
  for (const [col, y0] of bands) { const pts = [[-0.4, -60]]; for (let x = -0.4; x <= 0.4; x += 0.02) pts.push([x, y0 + Math.sin(x * 40 + y0 * 90) * 0.003]); pts.push([0.4, -60]); P.poly(pts, col); }
  // stones: shaded, varied
  const stones = ['#9a8a7c', '#7d7f86', '#b3a08a', '#8c7466'];
  for (let i = 0; i < 34; i++) { const x = (hash(i, 51) * 2 - 1) * 0.16, y = -0.014 - hash(i, 52) * 0.12, rx = 0.003 + 0.006 * hash(i, 53); P.lit(P.blobPts(x, y, rx, rx * (0.55 + 0.3 * hash(i, 54)), 9, 0.15, i), stones[i % 4], { d: 0.28, shade: 'rgba(30,15,5,0.35)', rim: 'rgba(255,240,220,0.3)' }); }
  // fine roots of other plants, and a worm going about its day
  for (let i = 0; i < 7; i++) { const x = (hash(i, 55) * 2 - 1) * 0.15; P.ribbon([[x, 0], [x + 0.006, -0.02 - 0.03 * hash(i, 56)], [x - 0.004, -0.04 - 0.05 * hash(i, 57)]], [0.0012, 0.0008, 0.0003], 'rgba(230,205,160,0.55)'); }
  const wx = -0.06 + (t - 12.5) * 0.008, wpts = []; for (let i = 0; i < 9; i++) wpts.push([wx - i * 0.0035, -0.052 + Math.sin(t * 6 - i * 0.9) * 0.0018]);
  if (t > 12.5 && t < 15) { P.ribbon(wpts, [0.0034, 0.0036, 0.0036, 0.0035, 0.0034, 0.0032, 0.003, 0.0027, 0.0022], '#d98a8a'); P.circle(wx + 0.0006, -0.0515 + Math.sin(t * 6) * 0.0018, 0.0006, '#3a1d1d'); }
  P.rect(-5000, -0.004, 10000, 0.004, C.ash);
  for (let i = 0; i < 30; i++) P.blob((hash(i, 61) * 2 - 1) * 0.3, 0.0005, 0.02 + 0.03 * hash(i, 62), 0.004, i % 2 ? C.ashLight : C.ash, { seed: i });
  // bigger world at bigger scales: forest floor, burnt logs, smoke
  P.rect(-5000, -0.01, 10000, 0.01, '#4b3a30');
  P.at(5.5, 0, 0.08, 1, 1, () => { P.ribbon([[-1.5, 0.25], [1.5, 0.35]], 0.5, C.char); for (let i = 0; i < 6; i++) P.glow(-1.2 + i * 0.5, 0.3, 0.3, '255,110,40', (1 - tw(t, 12, 17)) * (0.5 + 0.5 * Math.sin(t * 7 + i))); });
  for (let i = 0; i < 8; i++) { const x = -6 + i * 1.8 + hash(i, 71), s = 0.2 + 0.4 * hash(i, 72); P.blob(x, 0.05, s * 2, s * 0.5, '#3e5a34', { seed: i, a: tw(t, 16, 19) }); }
}
function parent(t, c) {
  // the parent giant on the left: red bark, charred at the base; its branch holds the cone at (0, 52)
  const x0 = -2.2, w = 6;
  P.rect(x0 - w, -1, w, 120, P.lin(x0 - w, 0, x0, 0, C.barkDark, C.bark, C.barkLight));
  for (let i = 0; i < 9; i++) P.ribbon([[x0 - w + 0.5 + i * 0.6, 0], [x0 - w + 0.6 + i * 0.6 + Math.sin(i) * 0.2, 60], [x0 - w + 0.5 + i * 0.6, 120]], 0.12, 'rgba(70,25,15,0.4)');
  P.rect(x0 - w, -1, w, 9, P.lin(0, 9, 0, 0, 'rgba(30,15,15,0)', C.char));
  P.ribbon([[x0, 53.5], [-2.6, 53.0], [-0.4, 52.2], [0, 52.03]], [0.5, 0.3, 0.12, 0.05], '#6b4a2e');
  for (let i = 0; i < 12; i++) P.blob(x0 + 0.4 + i * 0.5, 53.2 + Math.sin(i) * 0.3, 0.5, 0.25, i % 2 ? C.leaf : C.leafDark, { seed: i });
  P.at(0, 52, 0, 0.001, 0.001, () => drawCone(t, { open: 1, burn: 1, eyes: 1, look: [0.2, -1] }));
  // lower branches the falling seed rushes past (they reach across the frame)
  for (const [by, len, s] of [[46, 7, 1], [40.5, 9, 2], [34, 6.5, 3], [27, 8.5, 4], [19.5, 7, 5]]) {
    P.ribbon([[x0, by + 0.4], [x0 + len * 0.45, by + 0.1], [x0 + len, by - 0.5]], [0.55, 0.32, 0.08], '#5e3a24');
    for (let i = 0; i < 7; i++) { const u = (i + 1) / 8, bx = x0 + len * u, byy = by + 0.2 - u * 0.7 + Math.sin(i + s) * 0.25; P.lit(P.blobPts(bx, byy, 0.9 - u * 0.3, 0.42, 9, 0.25, s * 10 + i), P.mixc(C.leaf, '#6a3a1c', 0.2 + 0.25 * (i % 2)), { shade: 'rgba(20,0,0,0.35)', rim: 'rgba(255,150,80,0.35)', light: [0.2, -1], d: 0.3 }); }
  }
}
function smoke(t, c, k) { if (k <= 0) return; for (let i = 0; i < 26; i++) { const y = (hash(i, 81) * 60 + t * 1.5) % 60, x = (hash(i, 82) * 2 - 1) * 8 + Math.sin(t * 0.5 + i) * 0.5, r = 1.5 + 3 * hash(i, 83); P.blob(x, y, r, r * 0.7, `rgba(${90 + 40 * hash(i, 84)},${80 + 30 * hash(i, 84)},${90 + 30 * hash(i, 84)},${0.22 * k})`, { seed: i }); } }
function partB(t) {
  const c = cam2(t);
  sky2(t, c);
  P.cam(c);
  const sun = tw(t, T.gold, T.top); if (sun > 0) { P.glow(10, 120, 90, '255,210,140', sun); P.circle(10, 120, 9, P.rgba('#fff2c8', sun)); }
  const grove = tw(t, 19, 23);
  if (grove > 0) P.alpha(grove, () => { for (const [gx, gh, s] of [[-95, 70, 1], [-150, 78, 2], [70, 74, 3], [125, 66, 4], [-230, 60, 5], [200, 72, 6]]) drawTree(t, gh, { x: gx, seed: s, fade: 0.55, haze: P.mixc('#9cc8ec', '#f0c88a', tw(t, T.gold, T.top)) }); });
  const fade = 1 - tw(t, 15.5, 19);
  if (fade > 0) P.alpha(fade, () => parent(t, c));
  smoke(t, c, 1 - tw(t, 13, 16));
  // glowing needles and ash flakes drifting down around the fall
  if (t < 13.2) for (let i = 0; i < 40; i++) { const y = 54 - ((hash(i, 301) * 56 + t * (1.2 + hash(i, 302))) % 56), x = (hash(i, 303) * 2 - 1) * 5 + Math.sin(t * 2 + i) * 0.4, r = 0.03 + 0.05 * hash(i, 304), hot = i % 3 === 0; P.at(x, y, t * 3 + i, 1, 1, () => P.rect(-r * 2, -r * 0.4, r * 4, r * 0.8, hot ? '#ffb14a' : '#5a5560', { a: 0.85 })); if (hot) P.glow(x, y, r * 8, '255,150,60', 0.5); }
  // the other seeds, spinning down beside ours, and speed streaks while we fall
  if (t < 13) for (let i = 0; i < 9; i++) { const ox = (hash(i, 201) * 2 - 1) * 5, oy = seedY(t) + (hash(i, 202) * 2 - 1) * 4 + (t - 9.6) * (hash(i, 203) - 0.5) * 3; drawSeed(seedX(t) + ox + Math.sin(t * 1.7 + i) * 0.4, oy, (60 + 50 * hash(i, 204)) / P.k / 0.005 * 0.001, t * 13 + i, i); }
  const sp = tw(t, 10.2, 10.8) * (1 - tw(t, 12.2, 12.7));
  if (sp > 0) P.screen((ctx) => { ctx.strokeStyle = `rgba(255,230,200,${0.35 * sp})`; ctx.lineCap = 'round'; for (let i = 0; i < 24; i++) { const x = hash(i, 211) * 1920, y = ((hash(i, 212) * 1400 - t * 2600) % 1400 + 1400) % 1400 - 160, l = 80 + 160 * hash(i, 213); ctx.lineWidth = 2 + 3 * hash(i, 214); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + l); ctx.stroke(); } });
  ground(t, c);
  // the falling seed (screen-size while falling, real size on the ground), then the root and the sprout
  const boost = Math.max(1, (90 / P.k) / 0.005), sx = t < T.land ? seedX(t) : 0.002, sy = t < T.land ? seedY(t) : 0.0026;
  const [qx, qy] = K.squash(t, T.land, 0.3, 0.3);
  const rootU = tw(t, 13.2, 14.1, 'out');
  if (rootU > 0) { P.ribbon([[0.002, 0.001], [0.004, -0.02 * rootU], [0.001, -0.045 * rootU], [0.005, -0.07 * rootU]], [0.0022, 0.0018, 0.0012, 0.0004], '#f1e3c4'); for (let i = 0; i < 6; i++) { const u = (i + 1) / 7; if (u < rootU) P.ribbon([[0.003, -0.07 * u], [0.003 + (i % 2 ? 1 : -1) * 0.008 * tw(t, 13.4 + u, 13.9 + u), -0.07 * u - 0.004]], 0.0005, '#f1e3c4'); } }
  const h0 = t < 15.6 ? 0.05 * K.ease.backOut(K.inv(T.sprout, 15.2, t)) : ht(t);
  if (t > T.sprout) {
    if (h0 < 0.09) { const sw = 0.0018; P.ribbon([[0.002, 0], [0.002 + Math.sin(t * 2) * 0.002, h0 * 0.6], [0.002, h0]], [sw, sw * 0.9, sw * 0.8], '#9bc46b'); const cu = tw(t, 14.9, 15.4, 'backOut'); for (let i = 0; i < 4; i++) { const a = (i - 1.5) * 0.45 * cu; P.at(0.002, h0, a, 1, 1, () => P.ribbon([[0, 0], [0, 0.014 * cu]], [0.0016, 0.0005], C.leafLight)); } }
    if (h0 > 0.05) P.alpha(tw(h0, 0.05, 0.09), () => drawTree(t, h0, { char: 0 }));
  }
  if (t < T.coat || t < T.sprout) {
    const onTip = t > T.sprout ? h0 : sy;
    drawSeed(t > T.sprout ? 0.002 : sx, onTip + (t > T.sprout ? 0.003 : 0), 0.001 * boost * (t < T.land ? 1 : 1), t < T.land ? (t - 9.6) * 14 : 0, t < T.land ? Math.sin(t * 3) * 0.3 : 0);
  } else { const d = t - T.coat; drawSeed(0.002 + d * 0.05, h0 + 0.003 + d * 0.06 - d * d * 0.08, 0.001, d * 20, d * 8); }
  if (t > T.land && t < T.land + 0.6) { const d = (t - T.land) / 0.6; for (let i = 0; i < 12; i++) { const a = Math.PI * (i / 11); P.circle(0.002 + Math.cos(a) * 0.012 * d, 0.001 + Math.sin(a) * 0.008 * d - d * d * 0.004, 0.0012 * (1 - d), `rgba(190,185,190,${1 - d})`); } }
  // scale objects, true size
  const tip = [0, h0];
  if (t > 16.0) drawKid(t, lerp(2.6, 0.85, tw(t, 16.0, 16.7, 'out')), tip);
  if (t > 16.5) drawHouse(t, -7.5);
  if (t > 18) drawWhale(t, 21, T.whale);
  if (t > 21) drawTower(t, -58);
  // birds and the cloud deck
  if (t > 21.5) for (let i = 0; i < 5; i++) { const x = -30 + (t - 21.5) * 9 + i * 2.2, y = 40 + Math.sin(i) * 2, f = Math.sin(t * 12 + i) * 0.6; P.ribbon([[x - 0.9, y + f * 0.6], [x, y], [x + 0.9, y + f * 0.6]], 0.18, '#2a3550'); }
  clouds(t, c);
  embers2(t);
}
function clouds(t, c) { if (t < 19) return; for (let L = 0; L < 2; L++) for (let i = 0; i < 26; i++) { const x = -260 + i * 22 + hash(i, 91 + L) * 10 + t * (0.6 + L * 0.4), y = 52 + L * 3 + hash(i, 93 + L) * 3, r = 6 + 5 * hash(i, 95 + L); P.lit(P.blobPts(x, y, r * 1.6, r * 0.75, 10, 0.2, i + L * 30), L ? '#ffffff' : '#f3e9e6', { light: [0.2, 1], shade: 'rgba(170,150,190,0.35)', rim: 'rgba(255,240,200,0.5)', d: 0.35 }); } }
function embers2(t) { const k = 1 - tw(t, 12.2, 12.9); if (k > 0) embers(t, k * 0.6, 100); }

// the end: the seed again, in a circle, linked to the giant's foot
function inset(t) {
  if (t < T.inset) return; const u = K.ease.backOut(K.inv(T.inset, T.inset + 0.6, t));
  const [bx, by] = P.toScreen(0, 0), cx = 1560, cy = 640, r = 190 * u;
  P.screen((ctx) => { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(cx - r * 0.7, cy + r * 0.7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#2a2350'; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, 6.3); ctx.fillStyle = '#fff'; ctx.fill(); });
  P.ctx.save(); P.ctx.setTransform(1, 0, 0, 1, 0, 0); P.ctx.beginPath(); P.ctx.arc(cx, cy, r, 0, 6.3); P.ctx.clip();
  P.sky('#3a3470', '#e68a6a'); const keep = P.c; P.cam({ x: 3, y: 0, h: 40 });
  // the circle has its own camera centred in the circle
  P.ctx.setTransform(1080 / 40 * u, 0, 0, -1080 / 40 * u, cx - 3 * 1080 / 40 * u, cy);
  drawSeed(-0.5, 0, 1.2, Math.sin(t * 1.5) * 0.4, 0); drawRice(6.2, 0, 1, 0.15);
  P.ctx.restore(); P.c = keep;
  P.text('5 mm', cx, cy + r * 0.62, { font: FONT, size: 40 * u, color: '#ffd65a', weight: 600 });
}
// the years counter of the climb, and the 84 m mark
function hud(t) {
  const a = tw(t, 15.8, 16.2) * (1 - tw(t, 27.6, 28.0)); if (a <= 0) return;
  const u = tw(t, 15.8, 25.8, 'linear'), n = Math.round(Math.exp(lerp(0, Math.log(2000), Math.pow(u, 1.15))));
  P.text(`${n.toLocaleString('en-US')} year${n > 1 ? 's' : ''}`, 260, 120, { font: FONT, size: 64, weight: 600, alpha: a, shadow: 'rgba(0,0,0,0.3)' });
  const m = tw(t, 25.9, 26.4) * (1 - tw(t, 27.6, 28.0));
  if (m > 0) { const [x0, y0] = P.toScreen(-58, 84), [x1, y1] = P.toScreen(0, ht(t)); P.screen((ctx) => { ctx.globalAlpha = m; ctx.strokeStyle = '#ffd65a'; ctx.lineWidth = 5; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }); P.text('84 m', (x0 + x1) / 2, Math.min(y0, y1) - 50, { font: FONT, size: 60, weight: 600, color: '#ffd65a', alpha: m, shadow: 'rgba(0,0,0,0.3)' }); }
}

const FILM = {
  draw(t) {
    if (t < T.flash) partA(t); else { partB(t); hud(t); inset(t); }
    // the fire flash that hides the change of scale
    const f = Math.max(0, 1 - Math.abs(t - T.flash) / 0.3); if (f > 0) P.haze('#ffd9a0', f * 0.95);
    P.vignette(0.32);
  },
};
