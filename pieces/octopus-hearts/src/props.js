
// =====================================================================
//  PROPS — the cast and sets of "Why does an octopus need three hearts?" (cut paper, 1920x1080)
//  Colour means one thing: BLOO blue = the octopus's copper blood (Bloo, the hero). Red = human blood only.
// =====================================================================
const COL = {
  bloo: '#3b78d6', blooD: '#2a58a6', octo: '#d9708a', octoD: '#b9566f', octoL: '#f2a9b8', sucker: '#f9dccf',
  heart: '#e0607e', heartD: '#b8445f', red: '#d84a43', redD: '#a8322d', copper: '#b8733a', copperL: '#dc9a5c',
  sea: '#2f8f8c', seaD: '#1f6b6f', deep: '#174f5a', sand: '#e9cf98', sandD: '#cfae6e', flesh: '#e9a39b', fleshD: '#cf7f7a',
  plasma: '#f6e3da', gill: '#e2808c', gillD: '#c25f6d', brain: '#d9a3d6', eel: '#6f7a3a', eelD: '#4f5a28', weed: '#4f9a52',
};

// ---- time helpers for beating things
const pulse = (t, every, t0 = 0) => (TT < t0 ? 0 : Math.exp(-mod(TT - t0, every) * 9));
const badum = (every, t0 = 0) => (TT < t0 ? 0 : Math.max(Math.exp(-mod(TT - t0, every) * 10), 0.7 * Math.exp(-mod(TT - t0 - 0.22, every) * 10) * (mod(TT - t0, every) >= 0.22 ? 1 : 0)));

// ---- shapes
function heartPts(x, y, s, n = 72) {
  const P = [];
  for (let i = 0; i < n; i++) { const t = i / n * TAU, hx = 16 * Math.sin(t) ** 3, hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); P.push([x + hx * s / 16, y - (hy + 2) * s / 16]); }
  return P;
}
function blooPts(x, y, r, n = 64) {   // a drop, tip up; (x, y) = the drop's middle
  const P = [];
  for (let i = 0; i < n; i++) { const u = i / n * TAU; P.push([x + r * 1.25 * Math.sin(u) * Math.sin(u / 2), y - r * 1.3 * Math.cos(u) + r * 0.15]); }
  return P;
}

// ---- an oxygen bubble
function o2(x, y, r, key = 'o2') {
  cut(ellipsePts(x, y, r, r, 0, 22), '#ffffff', { key, sb: 5, sy: 3, tear: 0.5, grain: 0.4, line: 'rgba(59,120,214,0.45)', lw: 2.5 });
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.38, r * 0.2, r * 0.13, -0.6, 0, TAU); ctx.fill();
  if (r >= 20) handText('O2', x - r * 0.5, y + r * 0.3, r * 0.75, 'rgba(42,88,166,0.85)', { key: key + 't' });
}

// ---- BLOO, the hero: a drop of blue copper blood. o: mood, key, bub (oxygen bubbles carried), pack (0..1 copper backpack),
//      sx/sy (squash), sweat, wave (0..1 waving arm), al (arms up)
function bloo(x, y, r, o = {}) {
  const key = o.key ?? 'bloo', ph = key.length * 1.3, sc = o.s ?? 1; if (sc <= 0.01) return;
  r *= sc;
  y += Math.sin(TT * TAU * 0.8 + ph) * r * 0.05;
  let mood = o.mood ?? 'smile';
  if (mood !== 'happy' && mood !== 'focus' && (B + Math.round(ph * 7)) % 41 < 2) mood = 'focus';
  SPARK_AT = toScreen(x, y);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(o.sx ?? 1, o.sy ?? 1); ctx.translate(-x, -y);
  // the copper backpack (behind)
  const pk = o.pack ?? 0;
  if (pk > 0.01) {
    const px = x + r * 0.95, py = y + r * 0.1, pr = r * 0.48 * pk;
    ink([[x + r * 0.2, y - r * 0.35], [px, py - pr * 0.6]], { w: r * 0.07, color: COL.ink ?? PAL.ink, key: key + 'strap' });
    cut(ellipsePts(px, py, pr, pr, 0, 28), COL.copper, { key: key + 'cu', crayon: COL.copperL, crAl: 0.5, sb: 6 });
    cut(ellipsePts(px, py, pr * 0.72, pr * 0.72, 0, 24), COL.copperL, { key: key + 'cu2', shadow: false, grain: 0.4 });
    if (pr > 12) handText('Cu', px - pr * 0.48, py + pr * 0.3, pr * 0.85, PAL.ink, { key: key + 'cut', weight: 700 });
  }
  // little arms
  const wv = o.wave ?? 0, up = o.al ?? 0;
  const armL = [x - r * 0.75, y + r * 0.45], armR = [x + r * 0.75, y + r * 0.45];
  const aL = lerp(2.5, 3.9, up), aR = wv > 0 ? -1.2 + Math.sin(TT * 14) * 0.45 * wv : lerp(0.65, -0.75, up);
  cut(capsulePts(...armL, armL[0] + Math.cos(aL) * r * 0.5, armL[1] + Math.sin(aL) * r * 0.5, r * 0.22), COL.blooD, { key: key + 'al', sb: 4, sy: 3 });
  cut(capsulePts(...armR, armR[0] + Math.cos(aR) * r * 0.5, armR[1] + Math.sin(aR) * r * 0.5, r * 0.22), COL.blooD, { key: key + 'ar', sb: 4, sy: 3 });
  // the body
  cut(blooPts(x, y, r), COL.bloo, { key: key + 'b', crayon: COL.blooD, crAl: 0.35, crPer: 32, tear: 0.6, grain: 0.6 });
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(x - r * 0.42, y - r * 0.2, r * 0.13, r * 0.26, 0.4, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(x, y + r * 0.35); ctx.scale(1.18, 1.18); ctx.translate(-x, -(y + r * 0.35));
  face(x, y + r * 0.35, r / 70, mood);
  ctx.restore();
  if (o.sweat) for (let i = 0; i < 2; i++) { const k = mod(TT * 1.6 + i * 0.5, 1); cut(blooPts(x + r * (1.0 + i * 0.25), y - r * 0.6 + k * r * 0.8, r * 0.12), '#dff0ff', { key: key + 'sw' + i, sb: 3, grain: false }); }
  ctx.restore();
  // oxygen bubbles carried on top / around
  const nb = o.bub ?? 0;
  for (let i = 0; i < nb; i++) {
    const a = -Math.PI / 2 + (i - (nb - 1) / 2) * 0.62, rr = r * 1.55 + Math.sin(TT * 3 + i) * r * 0.05;
    o2(x + Math.cos(a) * rr, y + r * 0.1 + Math.sin(a) * rr, r * 0.3, key + 'ob' + i);
  }
}

// ---- a heart with a face. o: color, mood, p (pulse 0..1), key, s (pop scale)
function heartChar(x, y, s, o = {}) {
  const sc = (o.s ?? 1) * (1 + 0.13 * (o.p ?? 0)); if (sc <= 0.01) return;
  const key = o.key ?? 'hc', c = o.color ?? COL.heart, cd = o.dark ?? COL.heartD;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc * (1 - 0.04 * (o.p ?? 0)), sc); ctx.translate(-x, -y);
  cut(heartPts(x, y, s), c, { key: key + 'h', crayon: cd, crAl: 0.35, crPer: 34, tear: 0.8 });
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(x - s * 0.5, y - s * 0.52, s * 0.14, s * 0.22, -0.5, 0, TAU); ctx.fill();
  face(x, y - s * 0.12, s / 62, o.mood ?? 'smile');
  ctx.restore();
}

// ---- an arm: a tapered, curling cutout along a centre line; returns the centre line
function armLine(x0, y0, a0, L, curl, n = 18) {
  const C = []; let px = x0, py = y0, h = a0;
  for (let i = 0; i <= n; i++) { C.push([px, py, h]); const u = i / n; h += curl * 3 * u * u / n; px += Math.cos(h) * L / n; py += Math.sin(h) * L / n; }
  return C;
}
function arm(C, w0, color, key, suck = true) {
  const n = C.length - 1, Lf = [], Rt = [];
  C.forEach(([px, py, h], i) => { const w = w0 * (1 - 0.82 * i / n) / 2, nx = -Math.sin(h), ny = Math.cos(h); Lf.push([px + nx * w, py + ny * w]); Rt.push([px - nx * w, py - ny * w]); });
  const [tx, ty, th] = C[n];
  cut([...Lf, [tx + Math.cos(th) * w0 * 0.1, ty + Math.sin(th) * w0 * 0.1], ...Rt.reverse()], color, { key, sb: 6, sy: 4, tear: 0.6, grain: 0.5 });
  if (suck) for (let i = 2; i < n - 1; i += 2) { const [px, py, h] = C[i], w = w0 * (1 - 0.82 * i / n), nx = -Math.sin(h), ny = Math.cos(h); dot(px + nx * w * 0.28, py + ny * w * 0.28, Math.max(2.5, w * 0.14), COL.sucker); }
}

// ---- THE OCTOPUS. (x, y) = where the arms meet. o: s, mood, pose ('sit' | 'jet' | 'crawl'), key, rot, color
function octopus(x, y, o = {}) {
  const s = o.s ?? 1, key = o.key ?? 'oc', c = o.color ?? COL.octo, cd = COL.octoD, pose = o.pose ?? 'sit', ph = o.ph ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.translate(-x, -y);
  const arms = [];
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1, k = i % 4, front = k === 1 || k === 2;
    let a0, L, curl;
    if (pose === 'jet') { a0 = Math.PI / 2 + side * (0.08 + k * 0.07); L = 300 * s; curl = side * 0.25 * Math.sin(TT * 5 + i); }
    else {
      a0 = Math.PI / 2 + side * (0.35 + k * 0.32); L = (220 + (k % 2) * 40) * s;
      curl = -side * (1.6 + 0.35 * Math.sin(TT * 2.2 + i * 1.7 + ph));
      if (pose === 'crawl') { const g = Math.sin(TT * 7 + i * 1.3); a0 += g * 0.18; curl += g * 0.5; }
    }
    arms.push({ C: armLine(x + side * (16 + k * 14) * s, y - 6 * s, a0, L, curl), front, i });
  }
  arms.filter((a) => !a.front).forEach((a) => arm(a.C, 46 * s, cd, key + 'a' + a.i, false));
  // the mantle (the "head")
  cut(ellipsePts(x, y - 30 * s, 112 * s, 62 * s, 0, 36), c, { key: key + 'sk', shadow: false });
  cut(ellipsePts(x, y - 150 * s, 120 * s, 150 * s, 0, 44), c, { key: key + 'm', crayon: COL.octoL, crAl: 0.35, crPer: 40, pat: pat.dots('rgba(255,220,230,0.35)', 7 * s, 46 * s) });
  arms.filter((a) => a.front).forEach((a) => arm(a.C, 50 * s, c, key + 'a' + a.i, true));
  face(x, y - 70 * s, 1.9 * s, o.mood ?? 'smile');
  ctx.restore();
}
const mantlePts = (x, y, s, rot = 0) => xform(ellipsePts(0, -150 * s, 120 * s, 150 * s, 0, 64), x, y, rot);

// ---- sets and background life
function seaWall(c, key, o = {}) {
  cut(rect(-30, -30, W + 60, H + 60, 0), c, { key, shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.06)', 70, 230, 0.35) });
  // light rays from the surface
  for (let i = 0; i < 4; i++) { const x = 300 + i * 430 + Math.sin(TT * 0.6 + i) * 20; cut([[x, -20], [x + 120, -20], [x + 360, 700], [x + 200, 700]], 'rgba(255,255,240,0.07)', { key: key + 'ray' + i, shadow: false, grain: false, shade: false, tear: 0 }); }
}
function sandFloor(y0, key, c = COL.sand) {
  cut([[-40, y0 + 20], [400, y0 - 10], [900, y0 + 15], [1400, y0 - 15], [1960, y0 + 10], [1960, H + 40], [-40, H + 40]], c, { key, sy: -5, pat: pat.dots('rgba(150,110,50,0.25)', 3, 26) });
}
function weed(x, y, h, key, c = COL.weed) {
  const P = []; for (let i = 0; i <= 12; i++) { const u = i / 12; P.push([x + Math.sin(TT * 1.8 + u * 4 + x) * 22 * u, y - u * h]); }
  ink(P, { w: 16, color: c, amt: 0.6, key: key + 's' });
  for (let i = 2; i < 12; i += 3) cut(ellipsePts(P[i][0] + 18, P[i][1], 26, 10, -0.5, 14), c, { key: key + 'l' + i, sb: 4, grain: 0.4 });
}
function fish(x, y, s, c, key, dir = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  const wag = Math.sin(TT * 9 + key.length) * 0.25;
  cut(rot([[-40, 0], [-78, -26], [-72, 0], [-78, 26]], -40, 0, wag), c, { key: key + 't', sb: 4 });
  cut(ellipsePts(0, 0, 50, 28, 0, 24), c, { key: key + 'b', sb: 5, pat: pat.stripes('rgba(255,255,255,0.3)', 8, 26) });
  dot(26, -6, 6.5, PAL.ink); dot(28, -8, 2, '#fff');
  ctx.restore();
}
function bubbles(key, n = 10, x0 = 0, x1 = W) {
  const R = RNG('bub', key);
  for (let i = 0; i < n; i++) { const x = R.r(x0, x1), sp = R.r(60, 140), r = R.r(5, 14), y = H + 40 - mod(TT * sp + R.r(0, H), H + 80); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + Math.sin(TT * 2 + i) * 8, y, r, 0, TAU); ctx.stroke(); }
}
function rock(x, y, w, h, c, key) { cut(ellipsePts(x, y, w, h, 0, 22), c, { key, sy: 6, pat: pat.dots('rgba(0,0,0,0.12)', 4, 22) }); }
function starfish(x, y, s, key) { cut(starPts(x, y, 46 * s, 5, -Math.PI / 2, 60), PAL.mustard, { key, sb: 4, pat: pat.dots('rgba(255,255,255,0.4)', 3, 12) }); }
function crab(x, y, s, key) {
  const step = Math.sin(TT * 6) * 4;
  for (let i = 0; i < 3; i++) { ink([[x - 30 * s, y + 6 * s], [x - (56 + i * 6) * s, y + (22 + step) * s]], { w: 7 * s, color: '#c9764a', key: key + 'll' + i }); ink([[x + 30 * s, y + 6 * s], [x + (56 + i * 6) * s, y + (22 - step) * s]], { w: 7 * s, color: '#c9764a', key: key + 'lr' + i }); }
  cut(ellipsePts(x - 58 * s, y - 34 * s, 18 * s, 14 * s, 0, 14), '#e0915e', { key: key + 'cl', sb: 4 });
  cut(ellipsePts(x + 58 * s, y - 34 * s, 18 * s, 14 * s, 0, 14), '#e0915e', { key: key + 'cr', sb: 4 });
  cut(ellipsePts(x, y, 46 * s, 28 * s, 0, 22), '#e0915e', { key: key + 'b' });
  face(x, y - 4 * s, 0.6 * s, 'smile');
}
// a channel of plasma between two flesh walls (inside a vessel), particles drifting with the flow
function vessel(y0, y1, key, o = {}) {
  cut(rect(-30, -30, W + 60, H + 60, 0), o.wall ?? COL.flesh, { key: key + 'w', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.12)', 9, 60) });
  const edge = (y, k) => { const P = []; for (let x = -40; x <= W + 40; x += 60) P.push([x, y + Math.sin(x * 0.006 + TT * 1.4 + k) * 14]); return P; };
  const top = edge(y0, 0), bot = edge(y1, 2);
  cut([...top, ...bot.slice().reverse()], o.plasma ?? COL.plasma, { key: key + 'p', sb: 16, sy: 0, pat: pat.lines('rgba(200,140,130,0.10)', 46) });
  const R = RNG('flow', key), sp = o.flow ?? 120;
  for (let i = 0; i < 16; i++) { const x = mod(R.r(0, W) + TT * sp * R.r(0.7, 1.3), W + 80) - 40, y = R.r(y0 + 40, y1 - 40); cut(ellipsePts(x, y, R.r(6, 12), R.r(5, 9), 0, 12), 'rgba(207,127,122,0.55)', { key: key + 'pt' + i, shadow: false, grain: false, shade: false }); }
}
function redCell(x, y, r, o = {}) {
  const key = o.key ?? 'rc';
  cut(ellipsePts(x, y, r, r * 0.82, 0, 32), COL.red, { key: key + 'b', crayon: COL.redD, crAl: 0.35 });
  cut(ellipsePts(x, y, r * 0.55, r * 0.42, 0, 26), COL.redD, { key: key + 'd', shadow: false, grain: 0.4 });
  face(x, y - r * 0.08, r / 80, o.mood ?? 'happy');
  const nb = o.bub ?? 0;
  for (let i = 0; i < nb; i++) { const col = i % 3, row = Math.floor(i / 3); o2(x + (col - 1) * r * 0.6 + (row % 2) * r * 0.3, y - r * 1.05 - row * r * 0.52, r * 0.3, key + 'ob' + i); }
}
function eel(hx, hy, open, key) {   // a moray from a hole at the right edge, head at (hx, hy)
  const P = []; for (let i = 0; i <= 14; i++) { const u = i / 14; P.push([lerp(hx, W + 120, u), hy + Math.sin(u * 5 + TT * 4) * 30 * (1 - u * 0.5) + u * 90]); }
  for (let i = 13; i >= 0; i--) cut(ellipsePts(P[i][0], P[i][1], 70, 56, 0, 22), i % 2 ? COL.eel : COL.eelD, { key: key + 's' + i, sb: 6, grain: 0.5, pat: pat.dots('rgba(230,220,120,0.35)', 5, 24) });
  const jaw = open * 0.6;
  cut(rot([[hx - 120, hy + 6], [hx + 40, hy - 40], [hx + 60, hy + 20]], hx + 40, hy, -jaw * 0.5), COL.eel, { key: key + 'up' });
  cut(rot([[hx - 110, hy + 14], [hx + 40, hy + 10], [hx + 50, hy + 60]], hx + 40, hy + 10, jaw * 0.6), COL.eelD, { key: key + 'lo' });
  for (let i = 0; i < 4; i++) { const tx = hx - 90 + i * 30; cut([[tx, hy - 2 - jaw * 30], [tx + 10, hy + 22 - jaw * 30], [tx + 20, hy - 2 - jaw * 30]], '#fbf6ea', { key: key + 't' + i, shadow: false, grain: false }); }
  dot(hx - 10, hy - 30, 13, '#f6cf55'); dot(hx - 10, hy - 30, 6, PAL.ink);
}
function brain(x, y, s, mood, key) {
  cut(ellipsePts(x, y, 130 * s, 92 * s, 0, 36), COL.brain, { key: key + 'b', crayon: '#b87fb4', crAl: 0.35 });
  for (let i = 0; i < 5; i++) { const P = []; for (let k = 0; k <= 10; k++) P.push([x - 100 * s + k * 20 * s, y - 50 * s + i * 22 * s + Math.sin(k * 1.4 + i) * 9 * s]); ink(P, { w: 4 * s, color: 'rgba(120,70,120,0.55)', amt: 0.4, key: key + 'f' + i }); }
  face(x, y + 20 * s, s * 1.1, mood);
}
// a gill: a feathery frond, filaments off a central stem
function gill(x, y, h, key, s = 1) {
  ink([[x, y], [x, y - h]], { w: 16 * s, color: COL.gillD, key: key + 'st' });
  for (let i = 0; i < 12; i++) {
    const u = (i + 0.5) / 12, yy = y - u * h, L = (60 + 50 * Math.sin(u * Math.PI)) * s, sw = Math.sin(TT * 2 + i) * 0.06;
    cut(capsulePts(x, yy, x - L * Math.cos(0.5 + sw), yy - L * Math.sin(0.5 + sw), 20 * s), COL.gill, { key: key + 'l' + i, sb: 4, grain: 0.4 });
    cut(capsulePts(x, yy, x + L * Math.cos(0.5 - sw), yy - L * Math.sin(0.5 - sw), 20 * s), COL.gill, { key: key + 'r' + i, sb: 4, grain: 0.4 });
  }
}
// a hand-lettered paper tag that pops in at t (drawn after the camera, at screen size)
function note(str, x, y, size, t, o = {}) {
  const f = () => { const k = popS(t); if (k > 0) tag(str, x, y, size, { s: k, rot: o.rot ?? -0.03, fill: o.fill, color: o.color, tape: o.tape, frac: o.write ? ev(t + 0.1, 0.5) : 1 }); };
  if (DEFER) DEFER.push(f); else f();
}
// ink "!" / "?" marks
function mark(ch, x, y, size, t, color = PAL.ink) { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); handText(ch, -size * 0.25, size * 0.35, size, color, { key: 'mk' + ch + x, weight: 700 }); ctx.restore(); }

// Bloo is this piece's hero: hero-to-hero bridges draw Bloo
STYLE.hero = (x, y, r, o) => bloo(x, y, r, { mood: 'wow', key: o.key });
STYLE.heroColor = COL.bloo;
STYLE.heroPts = (x, y, r) => blooPts(x, y, r);
