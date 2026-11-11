// How a Spider Builds Its Web in One Night: one journal page, dusk to dawn (pitch A; TREATMENT.md).
// The page is the web's plane seen face-on: on the twigs the spider is seen from the side, on the web from above.
// One camera over the page (push, pan, pull); details open as painted specimen insets on the same sheet and close in mist.
const { tw, clamp, lerp } = K;
const NOTE_INK = '#8a3a1e';   // the annotation pen: red-brown, so notes and pointers never read as silk
const NOTE = (str, x, y, a, b, o = {}) => Brush.note(P.ctx, str, x, y, tw(T, a, a + 0.9, 'out') * (1 - tw(T, b - 0.35, b)), { color: NOTE_INK, ...o });
const POINT = (ctx, from, to, p, o = {}) => Brush.leader(ctx, from, to, p, { color: NOTE_INK, dash: [7, 6], w: 1.8, ...o });   // writes itself in, fades out
let T = 0;
// ---- the camera: [t, cx, cy, z] eased between keys
const CAM = [[0, 960, 540, 1], [9, 960, 540, 1], [14, 690, 225, 2.4], [21.5, 700, 230, 2.5], [26.5, 880, 290, 1.6], [31.5, 1060, 460, 1.0], [56, 1060, 470, 1.0],
  [58.5, 1000, 420, 1.6], [69, 1000, 600, 1.6], [72, 900, 320, 1.5], [82, 1000, 500, 1.45], [85, 1000, 540, 1.35], [99.5, 1000, 540, 1.3], [103, 1000, 520, 2.0], [112, 1010, 520, 2.0],
  [116, 1000, 540, 1.45], [145, 1000, 540, 1.5], [147, 1060, 540, 1.0], [159.5, 1060, 540, 1.0], [163, 1000, 525, 1.9], [170, 1000, 525, 1.9], [171.5, 1000, 540, 1.0],
  [173.4, 860, 625, 1.7], [184.5, 880, 610, 1.6], [189, 1000, 540, 1.0], [199, 1000, 540, 1.05], [202, 1000, 525, 1.8], [210.5, 1000, 525, 1.8], [213, 940, 400, 1.45],
  [217.5, 820, 300, 1.45], [220, 960, 540, 0.95]];
// how much the camera follows the spider (0 = the keyed framing, 1 = the spider centred)
const FOL = [[0, 0], [71.5, 0], [73, 0.7], [82, 0.7], [84, 0.4], [99, 0.4], [100.5, 0], [114, 0], [116, 0.6], [145, 0.6], [146.5, 0], [211, 0], [212.5, 0.8], [217.5, 0.8], [219.5, 0]];
const folAt = (t) => { for (let i = 0; i < FOL.length - 1; i++) if (t < FOL[i + 1][0]) return lerp(FOL[i][1], FOL[i + 1][1], tw(t, FOL[i][0], FOL[i + 1][0], 'inOut')); return 0; };
const camFollow = (t, S) => { const c = camAt(t), f = folAt(t); return [lerp(c[0], S.x, f), lerp(c[1], S.y, f), c[2]]; };
const camAt = (t) => { for (let i = 0; i < CAM.length - 1; i++) if (t < CAM[i + 1][0]) { const [a, ...A] = CAM[i], [b, ...B] = CAM[i + 1], u = tw(t, a, b, 'inOut'); return A.map((v, k) => lerp(v, B[k], u)); } return CAM[CAM.length - 1].slice(1); };
const toScreen = (c, [x, y]) => [(x - c[0]) * c[2] + 960, (y - c[1]) * c[2] + 540];
// ---- the night: sky wash colour and the clock note
const SKY = [[0, '#b9aec8', 0.22], [90, '#a4a8c8', 0.26], [150, '#5a6a9a', 0.32], [168, '#3e4e80', 0.4], [184, '#3e4e80', 0.38], [190, '#f0c890', 0.3], [220, '#f2d6a0', 0.24]];
const mix = (h1, h2, u) => { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16), c = (s2) => Math.round(lerp((a >> s2) & 255, (b >> s2) & 255, u)); return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, '0')}`; };
const skyAt = (t) => { for (let i = 0; i < SKY.length - 1; i++) if (t < SKY[i + 1][0]) { const u = tw(t, SKY[i][0], SKY[i + 1][0], 'inOut'); return [mix(SKY[i][1], SKY[i + 1][1], u), lerp(SKY[i][2], SKY[i + 1][2], u)]; } return SKY[SKY.length - 1].slice(1); };
const CLOCK = [[0, '7:40 pm'], [32, '7:48 pm'], [56, '7:55 pm'], [84, '8:05 pm'], [114, '8:20 pm'], [146, '8:38 pm'], [160, '8:45 pm'], [171, '11:20 pm'], [186, '6:10 am'], [200, '6:40 am']];
// ---- stage values for the web, from the script
const ST = (t) => ({ frame: tw(t, 72, 82), radii: tw(t, 85, 99, 'linear'), aux: tw(t, 115, 125, 'linear'), auxGone: tw(t, 128, 145, 'linear'),
  sticky: tw(t, 127, 145, 'linear') - 0 , stickyFrom: tw(t, 201, 209, 'linear'), radiiGone: tw(t, 205, 211, 'linear'), frameGone: tw(t, 208, 212), dew: tw(t, 186.5, 190) });
const Y = { mid: [995, 281], down: [1040, 900] };   // the Y: from the bridge's middle down to the hub, and on to the bottom
const IMPACT = [820, 650];
// ---- insets: a paper disc that blooms open (k 0..1), its content clipped inside, a leader to its place on the page
const inset = (ctx, cx, cy, r, k, target, fn) => { if (k <= 0) return; const rr = r * (0.3 + 0.7 * k);
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.5); ctx.fillStyle = Brush.PAPER; ctx.beginPath(); ctx.arc(cx, cy, rr * 1.03, 0, 7); ctx.fill(); ctx.restore();   // solid paper: nothing shows through
  Brush.wash(ctx, Brush.blob(cx, cy, rr, rr, 0, 40, 78, 0.03), { color: '#e8dcc4', alpha: 0.3 * k, seed: 78, grain: false, edgeColor: NOTE_INK });
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(cx, cy, rr * 0.98, 0, 7); ctx.clip(); fn(ctx, cx, cy, rr); ctx.restore();
  if (target && k > 0.6) { const dx = target[0] - cx, dy = target[1] - cy, d = Math.hypot(dx, dy); POINT(ctx, [cx + dx / d * rr, cy + dy / d * rr], target, tw(k, 0.6, 1), { elbow: [lerp(cx + dx / d * rr, target[0], 0.5), target[1]] }); } };

// ---- the spider: where it is and how it is seen. It only ever moves along silk.
const SL = 52;
const ANCHOR = [905, 200 + (905 - 690) / (1292 - 690) * 162];   // a point on the bridge it drops from at the end
const spiderState = (t, st) => {
  if (t < 26) return { mode: 'side', x: 650, y: 184, lift: tw(t, 11, 12.5) * (1 - tw(t, 24.5, 25.5)), alpha: tw(t, 4, 6.5) };
  if (t < 56.6) { const u = tw(t, 26, 31.5, 'linear'); return { mode: 'hang', x: lerp(690, Y.mid[0], u), y: lerp(200, Y.mid[1], u), walk: u < 1 ? u * 9 : null }; }
  const top = (x, y, a, walk = null, extra = {}) => ({ mode: 'top', x, y, a, walk, ...extra });
  const half = [lerp(W.hub[0], Y.down[0], 0.5), lerp(W.hub[1], Y.down[1], 0.5)], bridgeL = [705, 204];
  if (t < 62) { const u = tw(t, 57, 62); return top(lerp(Y.mid[0], W.hub[0], u), lerp(Y.mid[1], W.hub[1], u), Math.PI / 2, u * 4); }   // rides the new line down
  if (t < 64) return top(W.hub[0], W.hub[1], Math.PI / 2);
  if (t < 69) { const u = tw(t, 64, 69); return top(lerp(W.hub[0], half[0], u), lerp(W.hub[1], half[1], u), Math.atan2(half[1] - W.hub[1], half[0] - W.hub[0]), u * 5); }
  if (t < 72) { const q = W.at([half, W.hub, Y.mid, bridgeL], tw(t, 69, 72, 'linear')); return top(q.x, q.y, q.a, t * 3); }       // back along its own lines to the frame's start
  if (t < 82) { const q = W.at(W.frameLine, tw(t, 72, 82, 'linear')); return top(q.x, q.y, q.a, t * 3); }
  if (t < 84.5) { const q = W.at([W.frame[0], bridgeL, Y.mid, W.hub], tw(t, 82, 84.5, 'linear')); return top(q.x, q.y, q.a, t * 3); }
  if (t < 100) { // each spoke: out along it as it is laid, back along it to the hub
    const nr = clamp(st.radii) * W.NR, k = Math.min(W.NR - 1, Math.floor(nr)), fr = nr - k, out = fr < 0.5, f = out ? fr * 2 : 2 - fr * 2, R = W.radii[k];
    const drawn = (k + Math.min(1, fr * 2)) / W.NR;
    return top(W.hub[0] + Math.cos(R.a) * R.r * Math.max(0.06, f), W.hub[1] + Math.sin(R.a) * R.r * Math.max(0.06, f), out ? R.a : R.a + Math.PI, t * 4, { radiiDraw: st.radii >= 1 ? 1 : drawn }); }
  if (t < 114) { const R = W.radii[7], f = 0.1 + 0.55 * tw(t, 102, 108, 'inOut') * (1 - tw(t, 110, 114, 'inOut')); return top(W.hub[0] + Math.cos(R.a) * R.r * f, W.hub[1] + Math.sin(R.a) * R.r * f, t < 109 ? R.a : R.a + Math.PI, (t > 102 && t < 108) || t > 110 ? t * 2 : null); }
  if (t < 126.5) { const q = W.at(W.aux, Math.max(0.001, st.aux)); return top(q.x, q.y, q.a, t * 3); }
  if (t < 145.5) { const q = W.at(W.sticky, Math.max(0.001, st.sticky)); return top(q.x, q.y, q.a, t * 3); }
  if (t < 147.5) { const e = W.sticky[W.sticky.length - 1], u = tw(t, 145.5, 147.5); return top(lerp(e[0], W.hub[0], u), lerp(e[1], W.hub[1], u), Math.atan2(W.hub[1] - e[1], W.hub[0] - e[0]), u * 4); }   // in along spoke 0
  if (t < 175) return top(W.hub[0], W.hub[1], Math.PI / 2);
  const toM = Math.atan2(IMPACT[1] - W.hub[1], IMPACT[0] - W.hub[0]);
  if (t < 179) { const u = tw(t, 175, 179); return top(lerp(W.hub[0], IMPACT[0] + 34, u), lerp(W.hub[1], IMPACT[1] - 34, u), toM, u * 7); }
  if (t < 192) return top(IMPACT[0] + 34, IMPACT[1] - 34, toM);
  if (t < 198) { const u = tw(t, 192, 198); return top(lerp(IMPACT[0] + 34, W.hub[0], u), lerp(IMPACT[1] - 34, W.hub[1], u), toM + Math.PI, u * 6); }
  if (t < 211) return top(W.hub[0], W.hub[1], Math.PI / 2 + Math.sin(t * 0.8) * 0.4, t > 201 ? t * 1.5 : null);
  if (t < 217) { // the web is gone: it hangs on a dragline from the bridge and swings home, climbing as it goes
    const dx = W.hub[0] - ANCHOR[0], dy = W.hub[1] - ANCHOR[1], th0 = Math.atan2(dx, dy), u = (t - 211), len = lerp(Math.hypot(dx, dy), 40, tw(t, 211.5, 217, 'inOut'));
    const th = lerp(th0, -0.6, 1 - Math.exp(-u * 0.9)) + 0.32 * Math.sin(u * 2.4) * Math.exp(-u * 0.45);
    const x = ANCHOR[0] + Math.sin(th) * len, y = ANCHOR[1] + Math.cos(th) * len; return top(x, y, Math.atan2(ANCHOR[1] - y, ANCHOR[0] - x), t * 2, { drag: true }); }
  const u = tw(t, 217, 219.5); return { mode: 'hang', x: lerp(ANCHOR[0], 700, u), y: lerp(ANCHOR[1], 202, u), walk: u < 1 ? u * 6 : null, back: true };   // along the bridge to the twig
};
const drawSpider = (ctx, t, S, deform) => {
  if (S.mode === 'side') { W.spiderSide(ctx, t, S.x, S.y, SL, { dir: 1, lift: S.lift, alpha: S.alpha }); return; }
  if (S.mode === 'hang') { const ang = Math.atan2(W.bridge[1][1] - W.bridge[0][1], W.bridge[1][0] - W.bridge[0][0]); ctx.save(); ctx.translate(S.x, S.y); ctx.rotate(ang); W.spiderSide(ctx, t, 0, 0, SL, { dir: S.back ? -1 : 1, hang: true, walk: S.walk }); ctx.restore(); return; }
  let x = S.x, y = S.y; if (deform) [x, y] = deform([x, y]);
  if (S.drag) Brush.ink(ctx, [ANCHOR, [x, y]], 1, { color: '#3a3a4a', w: 1.4, alpha: 0.8 });
  W.spider(ctx, t, x, y, SL, { a: S.a, walk: S.walk });
};

const FILM = {
  draw(t) {
    T = t; const ctx = P.ctx, st = ST(t), S = spiderState(t, st), c = camFollow(t, S);
    Brush.paper(ctx);
    const [skyC, skyA] = skyAt(t);
    { const g = ctx.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, Brush.rgba(skyC, Math.min(0.8, skyA * 1.5))); g.addColorStop(0.55, Brush.rgba(skyC, skyA * 0.55)); g.addColorStop(1, Brush.rgba(skyC, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 760); }   // a smooth graded sky
    Brush.band(ctx, -60, 260, { color: t < 186 ? '#e8b89a' : '#f6d0a0', alpha: t < 150 ? 0.08 : t < 186 ? 0.03 : 0.07, seed: 5, wave: 40, edge: false });
    if (t > 150 && t < 192) Brush.band(ctx, -60, 1140, { color: '#2e3a66', alpha: 0.12 * tw(t, 150, 166) * (1 - tw(t, 185, 191)), seed: 6, wave: 30 });   // night over the page
    // ---- the world, through the camera
    ctx.save(); ctx.translate(960, 540); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]);
    const mx = 1660, my = 190 - tw(t, 150, 175) * 60; Brush.wash(ctx, Brush.blob(mx, my, 90, 90, 0, 30, 8, 0.04), { color: t < 186 ? '#ece0b4' : '#f6e2b0', alpha: 0.55 * (1 - tw(t, 188, 196)), seed: 8 });
    W.twigs.forEach((tw2, i) => W.twig(ctx, tw2, tw(t, 0.4 + i * 0.5, 2.6 + i * 0.5)));
    W.leaves.forEach((l, i) => W.leaf(ctx, l, tw(t, 2.4 + i * 0.25, 3.6 + i * 0.25)));
    // the moth's hit stretches the web, ringing and dying away
    const hit = t - 172.6, amp = hit > 0 ? 34 * Math.exp(-hit * 1.6) * Math.cos(hit * 11) : 0;
    const deform = amp ? (q) => { const dx = q[0] - IMPACT[0], dy = q[1] - IMPACT[1], f = Math.exp(-(dx * dx + dy * dy) / (2 * 160 * 160)); return [q[0] - 0.55 * amp * f, q[1] + amp * f]; } : null;
    // the bridge: drifting on the breeze (12.5-24), snagging, pulled tight; it stays all night (and in the morning)
    let sp0 = [640, 160];
    if (t < 26) { const lf = tw(t, 11, 12.5) * (1 - tw(t, 24.5, 25.5)); sp0 = W.spinneret(650, 184, 42, 1, lf); }
    if (t > 12.5) { const grow = tw(t, 12.5, 24, 'linear'), slack = 1 - tw(t, 24, 25.6), pts = [];
      for (let i = 0; i <= 40; i++) { const u = i / 40 * grow, x = lerp(sp0[0], W.bridge[1][0], u), y = lerp(sp0[1], W.bridge[1][1], u) + slack * (Math.sin(u * 9 - t * 3.5) * 24 * u - 50 * Math.sin(Math.PI * u) * u); pts.push(deform ? deform([x, y]) : [x, y]); }
      Brush.ink(ctx, pts, 1, { color: '#3a3a4a', w: 1.5, alpha: 0.78, wobble: 0.2 }); }
    // the Y and the line down to the hub (57-69); the frame, spokes, scaffold and sticky spiral
    if (t > 57 && t < 212) { const yp = (deform ?? ((q) => q)), lineA = { color: '#3a3a4a', w: 1.4, alpha: 0.75 * (1 - st.frameGone), wobble: 0.2 };
      Brush.ink(ctx, [Y.mid, W.hub].map(yp), tw(t, 57, 62), lineA); Brush.ink(ctx, [W.hub, Y.down].map(yp), tw(t, 64, 69), lineA); }
    if (t < 212) W.web(ctx, t, { ...st, radii: S.radiiDraw ?? st.radii, frame: st.frame * (1 - st.frameGone), deform });
    if (t > 64 && t < 84) Brush.wash(ctx, Brush.blob(W.hub[0], W.hub[1], 28, 28, 0, 22, 4, 0.1), { color: '#c8442a', alpha: 0.4 * tw(t, 64, 66) * (1 - tw(t, 82, 84)), seed: 4 });
    // ---- the spider (its state was worked out before the camera, which follows it)
    drawSpider(ctx, t, S, deform);
    // ---- the moth: flies in during the silence, hits at 172.6, struggles, is wrapped by dawn
    if (t > 169.5) { const u = tw(t, 169.5, 172.6, 'in'), wrapped = tw(t, 180, 184), gone = tw(t, 205, 210);
      const x = lerp(260, IMPACT[0], u), y = lerp(980, IMPACT[1], u) - Math.sin(u * 9) * 30 * (1 - u);
      if (gone < 1) { ctx.save(); ctx.globalAlpha = 1 - gone; const dp = deform ? deform([x, y]) : [x, y];
        if (wrapped < 1) W.moth(ctx, t, dp[0], dp[1], 52, { a: t < 172.6 ? Math.atan2(IMPACT[1] - 980, IMPACT[0] - 260) : -2.2, flap: t < 172.6 ? t * 7 : t < 180 ? t * 3 * (1 - tw(t, 174, 180)) : 0, open: t < 180 ? 1 : 1 - wrapped });
        if (wrapped > 0) { Brush.wash(ctx, Brush.blob(dp[0], dp[1], 26 + 6 * (1 - wrapped), 44, -0.6, 22, 61, 0.1), { color: '#efe8da', alpha: 0.9 * wrapped, seed: 61 }); for (let k = 0; k < 7; k++) Brush.ink(ctx, [[dp[0] - 30, dp[1] - 40 + k * 12], [dp[0] + 30, dp[1] - 30 + k * 12]], wrapped, { color: '#9a9aa8', w: 1, alpha: 0.6 }); }
        ctx.restore(); } }
    ctx.restore();
    // ---- notes on the page (screen space, beside what they name; positions follow the camera)
    const sc = (q) => toScreen(c, q);
    { const k = CLOCK.filter(([a]) => t >= a).pop(); const age = t - k[0]; ctx.save(); ctx.fillStyle = Brush.rgba('#c8442a', 0.85 * clamp(age / 0.8)); ctx.font = '600 54px Caveat'; ctx.textAlign = 'left'; ctx.fillText(k[1], 80, 100); ctx.restore(); }
    if (t > 8 && t < 21) { const q = sc([650, 150]); NOTE('a garden spider', q[0] - 60, q[1] - 150, 8.5, 20.5, { size: 46, align: 'center' }); }
    if (t > 16 && t < 23) NOTE('silk, out on the breeze', 1150, 330, 16, 22.8, { size: 46 });
    if (t > 25 && t < 33) { const q = sc([1000, 282]); NOTE('the bridge line', q[0] + 120, q[1] - 70, 25.5, 32.5, { size: 48 }); }
    if (t > 66 && t < 72) { const q = sc(W.hub); NOTE('the hub', q[0] + 70, q[1] - 40, 66, 71.8, { size: 48 }); }
    if (t > 74 && t < 84) NOTE('the frame', 1440, 900, 74, 83.8, { size: 48 });
    if (t > 85 && t < 100) { ctx.save(); const n = Math.min(30, Math.floor(st.radii * 30 + 0.5)); ctx.restore(); NOTE(`spokes: ${n}`, 1450, 200, 85.3, 99.8, { size: 52 }); }
    if (t > 104 && t < 114) { const q = sc([W.hub[0] + Math.cos(W.radii[7].a) * W.radii[7].r * 0.4, W.hub[1] + Math.sin(W.radii[7].a) * W.radii[7].r * 0.4]); NOTE('dry silk: not sticky', 1180, 240, 104.5, 113.8, { size: 50 }); POINT(ctx, [1260, 265], q, tw(t, 105, 106.5)); }
    if (t > 116 && t < 126) NOTE('scaffolding', 1460, 880, 116.5, 125.8, { size: 50 });
    if (t > 130 && t < 146) NOTE('the sticky spiral: beads of glue', 1240, 960, 130, 145.8, { size: 46 });
    if (t > 162 && t < 171) NOTE('waiting, feeling the threads', 1260, 300, 162.5, 170.8, { size: 46 });
    if (t > 188 && t < 199) NOTE('dew on every sticky thread', 1220, 960, 188.5, 199, { size: 46 });
    if (t > 202 && t < 211) NOTE('eaten, and recycled', 1300, 300, 202.5, 211, { size: 50 });
    // ---- insets
    const spinTarget = sc([Y.mid[0] - 30, Y.mid[1] + 30]);
    inset(ctx, 1480, 560, 340, tw(t, 32.3, 33.5, 'out') * (1 - tw(t, 43.4, 44)), spinTarget, (g, cx, cy, r) => {   // inside: silk glands and spinnerets
      const ab = Brush.blob(cx + 10, cy - 10, r * 0.62, r * 0.5, -0.15, 34, 90, 0.04); Brush.wash(g, ab, { color: W.SP.body, alpha: 0.55, seed: 90 });
      [['#e8d070', -0.25, -0.15], ['#d8a8c8', 0.05, -0.25], ['#a8c8e0', 0.25, -0.05], ['#c0d8a0', -0.05, 0.12], ['#e8b8a0', 0.2, 0.2]].forEach(([col, gx, gy], i) => {
        const gp = [cx + gx * r, cy + gy * r], sp = [cx - r * 0.5, cy + r * 0.28]; Brush.wash(g, Brush.blob(gp[0], gp[1], r * 0.13, r * 0.08, i, 16, 91 + i, 0.15), { color: col, alpha: 0.85 * tw(t, 33 + i * 0.4, 34 + i * 0.4), seed: 91 + i });
        Brush.ink(g, Brush.curve([gp, [lerp(gp[0], sp[0], 0.5), gp[1] + r * 0.12], sp], 8), tw(t, 34 + i * 0.4, 36 + i * 0.4), { color: '#8a6a4a', w: 1.6, alpha: 0.6 }); });
      Brush.wash(g, Brush.blob(cx - r * 0.52, cy + r * 0.3, r * 0.07, r * 0.05, 0, 12, 99, 0.1), { color: W.SP.headD, alpha: 0.85, seed: 99 });
      Brush.ink(g, Brush.curve([[cx - r * 0.56, cy + r * 0.32], [cx - r * 0.75, cy + r * 0.45], [cx - r * 0.95, cy + r * 0.4]], 8), tw(t, 37, 39), { color: '#3a3a4a', w: 1.6 });
      NOTE('silk glands', cx + r * 0.05, cy - r * 0.62, 34.5, 43.2, { size: 50, align: 'center' }); NOTE('liquid protein', cx + r * 0.2, cy + r * 0.62, 36, 43.2, { size: 48, align: 'center' }); NOTE('spinnerets', cx - r * 0.55, cy + r * 0.62 - 50, 38, 43.2, { size: 46, align: 'center' }); });
    inset(ctx, 1480, 560, 340, tw(t, 44, 45.2, 'out') * (1 - tw(t, 55.4, 56)), spinTarget, (g, cx, cy, r) => {   // silk vs steel; seven silks
      Brush.stroke(g, [[cx - r * 0.85, cy - r * 0.42], [cx + r * 0.85, cy - r * 0.38]], tw(t, 44.6, 46), { w: 16, color: '#8a9098', alpha: 0.75, profile: 'even', bristles: 4, seed: 120 });
      Brush.ink(g, [[cx - r * 0.85, cy - r * 0.05], [cx + r * 0.85, cy - r * 0.02]], tw(t, 46, 47.4), { color: '#5a5a6a', w: 2.2 });
      NOTE('steel wire', cx, cy - r * 0.6, 45, 55.2, { size: 48, align: 'center' }); NOTE('silk: stronger, weight for weight', cx, cy + r * 0.16, 47, 55.2, { size: 42, align: 'center' });
      ['#e8d070', '#d8a8c8', '#a8c8e0', '#c0d8a0', '#e8b8a0', '#b8a0d8', '#d0c0a0'].forEach((col, i) => Brush.wash(g, Brush.blob(cx - r * 0.6 + i * r * 0.2, cy + r * 0.45, r * 0.06, r * 0.06, 0, 14, 130 + i, 0.15), { color: col, alpha: 0.9 * tw(t, 50 + i * 0.25, 50.8 + i * 0.25), seed: 130 + i }));
      NOTE('up to 7 kinds of silk', cx, cy + r * 0.68, 50.5, 55.2, { size: 46, align: 'center' }); });
    inset(ctx, 1500, 600, 340, tw(t, 146.3, 147.5, 'out') * (1 - tw(t, 159.4, 160)), sc([W.hub[0] + 40, W.hub[1] + 40]), (g, cx, cy, r) => {   // a leg: branching hairs, a non-stick foot
      Brush.ink(g, [[cx - r, cy + r * 0.5], [cx + r, cy + r * 0.5]], 1, { color: '#3a3a4a', w: 2 });   // a dry spoke
      const sp2 = [[cx - r, cy + r * 0.05], [cx + r, cy - r * 0.15]]; Brush.ink(g, sp2, 1, { color: '#3a3a4a', w: 1.6 }); for (let i = 1; i < 12; i++) { const q = [lerp(sp2[0][0], sp2[1][0], i / 12), lerp(sp2[0][1], sp2[1][1], i / 12)]; g.fillStyle = 'rgba(90,90,110,0.6)'; g.beginPath(); g.arc(q[0], q[1], 4, 0, 7); g.fill(); }
      const legPts = Brush.curve([[cx - r * 0.2, cy - r * 0.95], [cx + r * 0.05, cy - r * 0.3], [cx + r * 0.18, cy + r * 0.48]], 10); W.leg(g, legPts, 34, 140);
      for (let i = 2; i < legPts.length - 2; i += 2) { const [x, y] = legPts[i]; for (const sd of [-1, 1]) { const b = [x + sd * 22, y - 8]; Brush.ink(g, [[x + sd * 10, y], b], tw(t, 147.5, 149), { color: '#3a2414', w: 1.2, alpha: 0.7 }); Brush.ink(g, [b, [b[0] + sd * 8, b[1] - 9]], tw(t, 148, 149.5), { color: '#3a2414', w: 1, alpha: 0.6 }); Brush.ink(g, [b, [b[0] + sd * 10, b[1] + 4]], tw(t, 148, 149.5), { color: '#3a2414', w: 1, alpha: 0.6 }); } }
      NOTE('branching hairs', cx - r * 0.3, cy - r * 0.72, 148, 159.2, { size: 48, align: 'center' }); NOTE('a non-stick coating', cx + r * 0.1, cy + r * 0.75, 150, 159.2, { size: 48, align: 'center' }); });
    // ---- the shake on the moth's hit; the end title
    if (t > 216.5) { ctx.save(); ctx.fillStyle = Brush.rgba(Brush.INK, 0.8 * tw(t, 216.5, 218.5)); ctx.font = 'italic 500 60px "Cormorant Garamond"'; ctx.textAlign = 'center'; ctx.fillText('One night, one page', 960, 960); ctx.restore(); }
    if (t < 0.6) P.haze('#f3ead8', 1 - t / 0.6); if (t > 219) P.haze('#f3ead8', t - 219);
  },
  // the model sheet (lemo's rule): views, key poses, palette, built from refs/ref-sheet.webp. node tools2/film.mjs spider model
  model(ctx) {
    Brush.paper(ctx);
    const head = (str, x, y, size = 40) => { ctx.save(); ctx.fillStyle = Brush.rgba(Brush.INK, 0.85); ctx.font = `italic 600 ${size}px "Cormorant Garamond"`; ctx.textAlign = 'left'; ctx.fillText(str, x, y); ctx.restore(); };
    head('The garden spider and the moth: model sheet', 60, 70, 48);
    W.spider(ctx, 1, 300, 470, 150, { a: Math.PI / 2 }); Brush.note(ctx, 'top view', 300, 900, 1, { size: 46, align: 'center' });
    W.spiderSide(ctx, 1, 760, 420, 120, { dir: 1 }); Brush.line(ctx, [560, 420], [980, 420], 1, { color: '#6a4a30', w: 3 }); Brush.note(ctx, 'side view', 760, 470, 1, { size: 46, align: 'center' });
    const r = W.spiderSide(ctx, 1, 1230, 420, 110, { dir: 1, lift: 1 }); Brush.line(ctx, [1060, 420], [1300, 420], 1, { color: '#6a4a30', w: 3 });
    Brush.ink(ctx, Brush.curve([r.spinneret, [r.spinneret[0] - 80, r.spinneret[1] - 90], [r.spinneret[0] - 60, r.spinneret[1] - 200], [r.spinneret[0] - 140, r.spinneret[1] - 260]], 8), 1, { color: '#4a4a5a', w: 1.2, alpha: 0.7 });
    Brush.note(ctx, 'releasing the first thread', 1180, 470, 1, { size: 32, align: 'center' });
    Brush.line(ctx, [560, 640], [1000, 640], 1, { color: '#4a4a5a', w: 1.4 }); W.spiderSide(ctx, 1, 780, 640, 100, { dir: 1, hang: true, walk: 0.2 }); Brush.note(ctx, 'walking a thread', 780, 900, 1, { size: 32, align: 'center' });
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; Brush.line(ctx, [1230, 680], [1230 + Math.cos(a) * 190, 680 + Math.sin(a) * 190], 1, { color: '#4a4a5a', w: 1, alpha: 0.5 }); }
    W.spider(ctx, 1, 1230, 650, 80, { a: Math.PI / 2 }); Brush.note(ctx, 'waiting at the hub, head down', 1230, 900, 1, { size: 32, align: 'center' });
    W.moth(ctx, 1, 1660, 300, 130, { a: -Math.PI / 2 }); Brush.note(ctx, 'moth: wings open', 1660, 470, 1, { size: 32, align: 'center' });
    W.moth(ctx, 1, 1660, 640, 120, { a: -Math.PI / 2, open: 0.05 }); Brush.note(ctx, 'wings folded', 1660, 800, 1, { size: 32, align: 'center' });
    [['#d4903e', 'abdomen'], ['#7e5040', 'band'], ['#f7efdc', 'white spots'], ['#a88660', 'head-chest'], ['#e2c38e', 'legs'], ['#6a3e22', 'leg bands'], ['#9a7458', 'forewing'], ['#e8b040', 'hindwing']].forEach(([c, n], i) => {
      const x = 90 + i * 225; Brush.wash(ctx, Brush.blob(x, 990, 34, 26, 0, 16, i, 0.1), { color: c, alpha: 0.95, seed: i }); Brush.note(ctx, n, x + 46, 992, 1, { size: 30 }); });
  },
};
