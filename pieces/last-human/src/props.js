
// =====================================================================
//  PROPS — the cast and things of "The Last Human" (cut paper, 1920x1080)
//  Colour means one thing: deep red = the dying Sun (and only what it touches). Teal = you. Blue = Earth as it was (memory).
//  Amber = tea, warmth, the habit that holds you together.
// =====================================================================
const COL = {
  you: '#3f9f9a', youD: '#2d7773', skin: '#c68a62', hair: '#2b211d', grey: '#b9b4ae',
  steel: '#5a6577', steelD: '#3e4655', steelL: '#7d8797', floor: '#2f3542', panel: '#6b7586', glass: '#1b2333',
  haze: '#d98a3d', hazeL: '#eaa95c', hazeD: '#9a5426', dusk: '#c9772f',
  sun: '#c8322b', sunL: '#e0503a', sunG: '#f08a4b', sunY: '#f6cf55', sunW: '#fff2c8',
  space: '#141a33', spaceD: '#0c1124', star: '#fff6dc',
  ocean: '#3b78d6', land: '#5aa05a', cloud: '#f4f6fa', burnt: '#3a2a26', lava: '#ff7b2e', dry: '#b98f5e',
  tea: '#c9822f', cup: '#f3ead6', screen: '#0f2a2e', screenL: '#7be3c8', alert: '#f05a5a',
  ship: '#d8d4cc', shipD: '#9a958c', engine: '#ffd27a',
};

// ---- small helpers
const lin = (t, a, b) => clamp((t - a) / (b - a));
const sm = (t, a, b) => EZ.io(lin(t, a, b));
const blink = (key, every = 41) => (B + key.length * 7) % every < 2;
function glow(x, y, r, color, al = 0.35) {   // soft light, drawn as stacked translucent paper discs
  for (let i = 4; i >= 1; i--) { ctx.fillStyle = color; ctx.globalAlpha = al * 0.22 * (5 - i) / 4; ctx.beginPath(); ctx.arc(x, y, r * (1 + i * 0.22), 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function stars(key, n = 160, o = {}) {
  const R = RNG('st', key), x0 = o.x0 ?? 0, x1 = o.x1 ?? W, y0 = o.y0 ?? 0, y1 = o.y1 ?? H;
  for (let i = 0; i < n; i++) {
    const x = R.r(x0, x1), y = R.r(y0, y1), s = R.r(1.2, 3.6), tw = 0.55 + 0.45 * Math.sin(TT * R.r(0.8, 2.5) + i);
    if (s > 3.0) sparkle(x, y, s * 2.4 * tw, COL.star); else { ctx.fillStyle = `rgba(255,246,220,${0.35 + 0.6 * tw})`; ctx.fillRect(x, y, s, s); }
  }
}
function spaceWall(key, c = COL.space) {
  cut(rect(-30, -30, W + 60, H + 60, 0), c, { key: key + 'sp', shadow: false, tear: 0, shade: false, grain: 0.5, pat: pat.dots('rgba(255,255,255,0.025)', 30, 160) });
  stars(key);
}
function wallFill(c, key, p) { cut(rect(-30, -30, W + 60, H + 60, 0), c, { key, shadow: false, tear: 0, shade: false, pat: p }); }
function label(str, x, y, size, t, o = {}) {   // a paper tag that pops at t (screen space)
  const f = () => { const k = popS(t); if (k > 0) tag(str, x, y, size, { s: k, rot: o.rot ?? -0.02, fill: o.fill, color: o.color, tape: o.tape, frac: o.write ? ev(t + 0.1, 0.6) : 1 }); };
  if (DEFER) DEFER.push(f); else f();
}

// ---- YOU. (x, y) = the point on the ground under you. o: s, pose ('stand' | 'walk' | 'sit' | 'chair' | 'lie' | 'kneel'),
//      arms ('down' | 'cup' | 'reach' | 'face' | 'palm' | 'up' | 'console' | 'wave'), mood, suit, grey, flip, key
function you(x, y, o = {}) {
  const s = o.s ?? 1, key = o.key ?? 'you', pose = o.pose ?? 'stand', arms = o.arms ?? 'down', suit = !!o.suit;
  const body = o.body ?? (suit ? '#e6e2da' : COL.you), bodyD = o.bodyD ?? (suit ? '#b7b2a8' : COL.youD), hairC = o.grey ? COL.grey : COL.hair;
  ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1); ctx.scale(s, s);
  if (o.rot) ctx.rotate(o.rot);
  const br = Math.sin(TT * TAU * 0.25) * 2;   // breathing
  let hip, sh, head, kneeL, kneeR, footL, footR;
  if (pose === 'sit') { hip = [0, -40]; kneeL = [80, -150]; kneeR = [96, -140]; footL = [130, 0]; footR = [150, 0]; sh = [-14, -215 + br]; head = [-14, -290 + br]; }
  else if (pose === 'chair') { hip = [0, -190]; kneeL = [96, -190]; kneeR = [110, -186]; footL = [100, 0]; footR = [116, 0]; sh = [-4, -350 + br]; head = [-4, -425 + br]; }
  else if (pose === 'lie') { hip = [0, -36]; kneeL = [120, -40]; kneeR = [120, -34]; footL = [230, -40]; footR = [232, -30]; sh = [-160, -40]; head = [-240, -46]; }
  else if (pose === 'kneel') { hip = [0, -130]; kneeL = [40, -40]; kneeR = [-30, -30]; footL = [-60, 0]; footR = [-110, -6]; sh = [10, -290 + br]; head = [14, -365 + br]; }
  else {
    const g = pose === 'walk' ? Math.sin(TT * 5.2) : 0;
    hip = [0, -200]; kneeL = [g * 30, -100]; kneeR = [-g * 30, -100]; footL = [g * 50, 0]; footR = [-g * 50, 0]; sh = [0, -360 + br]; head = [0, -435 + br];
  }
  const legW = suit ? 52 : 44;
  for (const [k, f, n] of [[kneeR, footR, 'r'], [kneeL, footL, 'l']]) {
    cut(capsulePts(hip[0], hip[1], k[0], k[1], legW, 6), n === 'r' ? bodyD : body, { key: key + 'th' + n, sb: 5, sy: 4, grain: 0.5 });
    cut(capsulePts(k[0], k[1], f[0], f[1], legW * 0.9, 6), n === 'r' ? bodyD : body, { key: key + 'sh' + n, sb: 5, sy: 4, grain: 0.5 });
    cut(ellipsePts(f[0] + (pose === 'lie' ? 0 : 14), f[1] - 6, 30, 14, 0, 14), '#2a2a30', { key: key + 'ft' + n, sb: 3, sy: 2, grain: false });
  }
  // torso
  const tw = suit ? 70 : 60;
  if (suit) cut(capsulePts(hip[0] - 40, hip[1] - 20, sh[0] - 46, sh[1] + 30, 70, 6), '#9a958c', { key: key + 'pack', sb: 6 });
  cut(capsulePts(hip[0], hip[1], sh[0], sh[1] + 20, tw * 2, 8), body, { key: key + 'tor', crayon: bodyD, crAl: 0.3, crPer: 40, pat: suit ? null : pat.stripes('rgba(255,255,255,0.10)', 6, 60) });
  if (!suit) cut(rect(sh[0] - 18, sh[1] + 40, 36, 24, 4), '#f6cf55', { key: key + 'badge', sb: 2, sy: 1, grain: false });
  // arms
  const shL = [sh[0] + 46, sh[1] + 24], shR = [sh[0] - 46, sh[1] + 24];
  let hL, hR, eL, eR;
  if (arms === 'cup') { hL = [sh[0] + 46, sh[1] + 120]; hR = [sh[0] + 20, sh[1] + 128]; }
  else if (arms === 'reach') { const r = o.reach ?? [180, -380]; hL = r; hR = [shR[0] - 10, shR[1] + 150]; }
  else if (arms === 'console') { hL = [shL[0] + 110, shL[1] + 60]; hR = [shL[0] + 80, shL[1] + 70]; }
  else if (arms === 'face') { hL = [head[0] + 30, head[1] + 30]; hR = [head[0] - 30, head[1] + 30]; }
  else if (arms === 'palm') { hL = [hip[0] + 60, 0]; hR = [shR[0] - 30, shR[1] + 150]; }
  else if (arms === 'up') { hL = [shL[0] + 70, shL[1] - 150]; hR = [shR[0] - 70, shR[1] - 150]; }
  else if (arms === 'wave') { hL = [shL[0] + 60 + Math.sin(TT * 8) * 20, shL[1] - 160]; hR = [shR[0] - 10, shR[1] + 150]; }
  else if (arms === 'knees') { hL = [kneeL[0] - 6, kneeL[1] + 20]; hR = [kneeR[0] - 20, kneeR[1] + 30]; }
  else { hL = [shL[0] + 10, shL[1] + 150]; hR = [shR[0] - 10, shR[1] + 150]; }
  if (pose === 'lie') { hL = [sh[0] + 40, sh[1] - 120]; hR = [sh[0] + 90, sh[1] + 10]; }
  const shake = o.shake ? Math.sin(TT * 40) * 3 : 0;
  hL = [hL[0] + shake, hL[1]]; hR = [hR[0], hR[1] + shake];
  eL = [(shL[0] + hL[0]) / 2 + 12, (shL[1] + hL[1]) / 2 + 10]; eR = [(shR[0] + hR[0]) / 2 - 12, (shR[1] + hR[1]) / 2 + 10];
  for (const [a, e, h, n] of [[shR, eR, hR, 'r'], [shL, eL, hL, 'l']]) {
    cut(capsulePts(a[0], a[1], e[0], e[1], 38, 6), n === 'r' ? bodyD : body, { key: key + 'ua' + n, sb: 5, sy: 4, grain: 0.4 });
    cut(capsulePts(e[0], e[1], h[0], h[1], 34, 6), n === 'r' ? bodyD : body, { key: key + 'la' + n, sb: 5, sy: 4, grain: 0.4 });
    cut(ellipsePts(h[0], h[1], 20, 18, 0, 14), suit ? '#e6e2da' : COL.skin, { key: key + 'hd' + n, sb: 3, sy: 2, grain: 0.3 });
  }
  if (arms === 'cup') { ctx.save(); ctx.translate(hL[0] - 14, hL[1] - 56); mug(0, 0, 0.62, COL.cup, key + 'mug', o.steam !== false); ctx.restore(); }
  // head
  cut(rect(head[0] - 18, head[1] + 40, 36, 40, 8), COL.skin, { key: key + 'nk', shadow: false, grain: false });
  cut(ellipsePts(head[0], head[1], 62, 70, 0, 30), COL.skin, { key: key + 'hd', crayon: '#a86d4a', crAl: 0.25, crPer: 50 });
  cut([[head[0] - 64, head[1] - 4], [head[0] - 60, head[1] - 52], [head[0] - 20, head[1] - 80], [head[0] + 34, head[1] - 78], [head[0] + 66, head[1] - 40], [head[0] + 64, head[1] - 10], [head[0] + 40, head[1] - 44], [head[0] - 30, head[1] - 46]], hairC, { key: key + 'hr', sb: 4, sy: 3 });
  let mood = o.mood ?? 'focus';
  if (mood !== 'happy' && mood !== 'focus' && blink(key)) mood = 'focus';
  face(head[0] + 4, head[1] + 8, 1.15, mood);
  if (o.tear) { const k = mod(TT * 0.6, 1); cut(ellipsePts(head[0] + 24, head[1] + 20 + k * 40, 5, 8, 0, 10), '#cfe6ff', { key: key + 'tear', sb: 2, grain: false }); }
  if (suit) {   // the helmet: a glass bubble
    ctx.fillStyle = 'rgba(200,225,240,0.22)'; ctx.beginPath(); ctx.arc(head[0], head[1] + 4, 104, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#e6e2da'; ctx.lineWidth = 12; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(head[0] - 52, head[1] - 46, 14, 30, 0.6, 0, TAU); ctx.fill();
  }
  ctx.restore();
  SPARK_AT = toScreen(x, y - 300 * s);
}

// ---- the Sun in its stages. kind: 'calm' (yellow-white) | 'giant' (deep red, boiling) | 'white' (a white dwarf)
function sun(x, y, r, kind = 'giant', key = 'sun') {
  if (kind === 'calm') {
    glow(x, y, r * 1.05, COL.sunY, 0.5);
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + TT * 0.05, L = r * (1.25 + 0.08 * Math.sin(TT * 2 + i)); cut(capsulePts(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, x + Math.cos(a) * L, y + Math.sin(a) * L, r * 0.12), COL.sunY, { key: key + 'r' + i, sb: 6, grain: 0.4 }); }
    cut(ellipsePts(x, y, r, r, 0, 48), COL.sunY, { key: key + 'b', crayon: '#e6a92e', crAl: 0.4, grain: 0.6 });
    cut(ellipsePts(x - r * 0.2, y - r * 0.2, r * 0.55, r * 0.55, 0, 36), '#fbe08a', { key: key + 'h', shadow: false, grain: 0.4 });
    return;
  }
  if (kind === 'white') {
    glow(x, y, r * 1.3, '#cfe0ff', 0.55);
    cut(ellipsePts(x, y, r, r, 0, 36), '#f4f8ff', { key: key + 'w', sb: 18, shc: 'rgba(160,190,255,0.6)', sy: 0, grain: 0.3 });
    return;
  }
  glow(x, y, r * 1.02, COL.sunG, 0.45);
  cut(ellipsePts(x, y, r, r, 0, 72), COL.sun, { key: key + 'g', crayon: '#9a1f1a', crAl: 0.35, crPer: 60, grain: 0.7, sb: 30, shc: 'rgba(240,90,50,0.55)', sy: 0 });
  // boiling granules
  const R = RNG('gran', key), n = Math.min(60, Math.floor(r / 9));
  for (let i = 0; i < n; i++) {
    const a = R.r(0, TAU), d = Math.sqrt(R.f()) * r * 0.85, gx = x + Math.cos(a) * d, gy = y + Math.sin(a) * d, gr = r * R.r(0.05, 0.14) * (0.75 + 0.25 * Math.sin(TT * R.r(0.3, 0.9) + i));
    cut(ellipsePts(gx, gy, gr, gr * 0.8, R.r(0, 3), 14), i % 3 ? COL.sunL : '#a82620', { key: key + 'gr' + i, shadow: false, grain: false, shade: false, tear: 1 });
  }
}

// ---- planets. kind: earth | dry | burnt | molten | mercury | venus | mars | jupiter | saturn | titan | europa
function planet(x, y, r, kind, key = kind, o = {}) {
  const P = ellipsePts(x, y, r, r, 0, 40);
  const base = { earth: COL.ocean, dry: COL.dry, burnt: COL.burnt, molten: '#5a1a12', mercury: '#9a948c', venus: '#e8d39a', mars: '#c0704a', jupiter: '#d9b48a', saturn: '#e6cf98', titan: COL.haze, europa: '#eef0f2', ice: '#cfe2ee' }[kind];
  const ring = (a0, a1) => { ctx.save(); ctx.lineCap = 'butt'; for (const [w, c] of [[r * 0.34, 'rgba(214,190,140,0.9)'], [r * 0.12, 'rgba(246,230,190,0.9)']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(x, y, r * 1.85, r * 0.42, -0.25, a0, a1); ctx.stroke(); } ctx.restore(); };
  if (kind === 'saturn') ring(Math.PI, TAU);
  cut(P, base, { key: key + 'b', crayon: kind === 'earth' ? '#2a58a6' : undefined, crAl: 0.3, grain: 0.5, sb: o.sb ?? 10 });
  ctx.save(); trace(P, true); ctx.clip();
  const R = RNG('pl', key);
  if (kind === 'earth') { for (let i = 0; i < 5; i++) cut(ellipsePts(x + R.n(r * 0.6), y + R.n(r * 0.6), r * R.r(0.2, 0.4), r * R.r(0.12, 0.3), R.r(0, 3), 16), COL.land, { key: key + 'l' + i, shadow: false, grain: 0.4 }); for (let i = 0; i < 4; i++) cut(ellipsePts(x + R.n(r * 0.7) + Math.sin(TT * 0.3 + i) * r * 0.05, y + R.n(r * 0.7), r * 0.35, r * 0.06, R.n(0.4), 12), 'rgba(244,246,250,0.8)', { key: key + 'c' + i, shadow: false, grain: false }); }
  if (kind === 'dry') for (let i = 0; i < 5; i++) cut(ellipsePts(x + R.n(r * 0.6), y + R.n(r * 0.6), r * R.r(0.2, 0.4), r * R.r(0.12, 0.3), R.r(0, 3), 16), '#a07848', { key: key + 'l' + i, shadow: false, grain: 0.4 });
  if (kind === 'burnt' || kind === 'molten') {
    for (let i = 0; i < 9; i++) { const Q = []; let px = x + R.n(r), py = y + R.n(r); for (let k = 0; k < 6; k++) { Q.push([px, py]); px += R.n(r * 0.3); py += R.n(r * 0.3); } ink(Q, { w: Math.max(2, r * (kind === 'molten' ? 0.05 : 0.025)), color: kind === 'molten' ? COL.lava : '#c4542e', key: key + 'k' + i }); }
    if (kind === 'molten') { ctx.fillStyle = 'rgba(255,123,46,0.35)'; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  }
  if (kind === 'jupiter') for (let i = -3; i <= 3; i++) cut(rect(x - r, y + i * r * 0.26 - r * 0.06, r * 2, r * 0.12, 4), i % 2 ? '#b88a5e' : '#efd5b0', { key: key + 'band' + i, shadow: false, grain: false });
  if (kind === 'europa') for (let i = 0; i < 6; i++) ink([[x + R.n(r), y + R.n(r)], [x + R.n(r), y + R.n(r)]], { w: 3, color: '#b9785a', key: key + 'cr' + i });
  if (kind === 'titan') ctx.fillStyle = 'rgba(255,220,160,0.25)', ctx.fillRect(x - r, y - r, r * 2, r * 0.5);
  // the night side
  if (o.shade !== false) { const g = ctx.createLinearGradient(x - r, y, x + r, y); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,8,20,0.45)'); if (o.lit === 'right') { g.addColorStop(0, 'rgba(10,8,20,0.45)'); } ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  ctx.restore();
  if (kind === 'saturn') ring(0, Math.PI);
  if (kind === 'titan') glow(x, y, r * 1.02, COL.hazeL, 0.25);
}

// ---- ships
function seedShip(x, y, s, key = 'ss', o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  if (o.engine !== false) { const fl = 1 + 0.15 * Math.sin(TT * 30); glow(-250, 0, 50 * fl, COL.engine, 0.6); cut([[-220, -30], [-330 * fl, 0], [-220, 30]], COL.engine, { key: key + 'fl', shadow: false, grain: false }); }
  cut(capsulePts(-220, 0, 230, 0, 110, 10), COL.ship, { key: key + 'h', pat: pat.lines('rgba(0,0,0,0.08)', 22), crayon: COL.shipD, crAl: 0.25 });
  for (let i = 0; i < 4; i++) cut(ellipsePts(-120 + i * 80, 0, 26, 78, 0, 20), COL.shipD, { key: key + 'r' + i, sb: 5 });
  cut(ellipsePts(240, 0, 60, 46, 0, 22), '#c9c4ba', { key: key + 'n' });
  for (let i = 0; i < 6; i++) dot(-160 + i * 60, -36, 5, '#ffe7a6');
  ctx.restore();
}
function probe(x, y, s, key = 'pr', o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  cut([[60, -110], [130, 0], [60, 110], [80, 0]], '#e6e2da', { key: key + 'shield', pat: pat.stripes('rgba(0,0,0,0.08)', 4, 16) });
  cut(rect(-80, -40, 140, 80, 10), '#c9a24a', { key: key + 'b', pat: pat.gingham('rgba(255,255,255,0.18)', 10) });
  cut(capsulePts(-80, 0, -170, -70, 10), COL.shipD, { key: key + 'arm' });
  cut(ellipsePts(-180, -80, 40, 14, -0.7, 18), '#d8d4cc', { key: key + 'dish' });
  cut(rect(-60, 40, 100, 70, 4), '#3a5aa0', { key: key + 'sol', pat: pat.gingham('rgba(255,255,255,0.25)', 12) });
  ctx.restore();
}

// ---- screens: a console monitor; fn draws its content in screen coords inside (x, y, w, h)
function monitorFrame(x, y, w, h, key, fn, o = {}) {
  cut(rect(x - 26, y - 26, w + 52, h + 52, 18), o.frame ?? '#2a2f3a', { key: key + 'f', sb: 16, sy: 10 });
  cut(rect(x, y, w, h, 10), o.bg ?? COL.screen, { key: key + 's', shadow: false, grain: 0.3, shade: false });
  ctx.save(); trace(rect(x, y, w, h, 10), true); ctx.clip(); fn();
  ctx.fillStyle = 'rgba(255,255,255,0.035)'; for (let yy = y; yy < y + h; yy += 6) ctx.fillRect(x, yy, w, 2);   // scanlines
  ctx.restore();
}
const typed = (str, t, cps = 22) => Math.floor(clamp((TT - t) * cps / str.length) * str.length);

// ---- interior things
function kettle(x, y, s, key, on) {
  cut([[x - 80 * s, y], [x - 64 * s, y - 120 * s], [x + 64 * s, y - 120 * s], [x + 80 * s, y]], '#b9bfc8', { key: key + 'b', pat: pat.stripes('rgba(255,255,255,0.18)', 10, 60) });
  cut(capsulePts(x + 70 * s, y - 80 * s, x + 130 * s, y - 130 * s, 22 * s), '#b9bfc8', { key: key + 'sp' });
  cut(rect(x - 40 * s, y - 150 * s, 80 * s, 26 * s, 8), '#2a2f3a', { key: key + 'h' });
  dot(x + 50 * s, y - 30 * s, 8 * s, on ? '#f05a5a' : '#555');
  if (on) for (let i = 0; i < 3; i++) { const Q = []; for (let k = 0; k <= 10; k++) Q.push([x + 130 * s + Math.sin(k * 0.8 + i + TT * 4) * 12 * s + k * 4 * s, y - 140 * s - k * 12 * s]); ink(Q, { w: 6 * s, color: 'rgba(255,255,255,0.7)', key: key + 'st' + i }); }
}
function alarmLamp(x, y, on, key) {
  cut(rect(x - 40, y - 20, 80, 40, 8), '#2a2f3a', { key: key + 'b' });
  const k = on ? 0.5 + 0.5 * Math.sin(TT * TAU * 1.0) : 0;
  cut(ellipsePts(x, y + 30, 46, 34, 0, 20), on ? (k > 0.5 ? '#ff4a3a' : '#8a1f1a') : '#5a2a2e', { key: key + 'l', grain: 0.3 });
  if (on && k > 0.5) glow(x, y + 30, 70, '#ff4a3a', 0.6);
}
function photo(x, y, w, h, key, draw, o = {}) {   // a pinned photograph
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  cut(rect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 40, 3), '#fbf6ea', { key: key + 'p', tear: 0.6 });
  ctx.save(); trace(rect(-w / 2, -h / 2, w, h, 2), true); ctx.clip(); ctx.translate(-w / 2, -h / 2); draw(w, h); ctx.restore();
  dot(0, -h / 2 - 4, 9, o.pin ?? '#d84a43');
  ctx.restore();
}
function chair(x, y, s, key, c = '#7d8797') {
  cut(rect(x - 70 * s, y - 210 * s, 140 * s, 24 * s, 8), c, { key: key + 's' });
  cut(rect(x - 70 * s, y - 380 * s, 26 * s, 190 * s, 8), c, { key: key + 'b' });
  cut(capsulePts(x, y - 190 * s, x, y - 20 * s, 18 * s), '#2a2f3a', { key: key + 'p', sb: 4 });
  cut(ellipsePts(x, y - 10 * s, 70 * s, 14 * s, 0, 16), '#2a2f3a', { key: key + 'f', sb: 3 });
}
function beaconRings(x, y, key, t0 = 0, o = {}) {   // the archive's broadcast: rings going out
  const every = o.every ?? 2.0, n = o.n ?? 4, R = o.r ?? 600;
  for (let i = 0; i < n; i++) { const k = mod(TT - t0 + i * every / n, every) / every; if (TT < t0) continue; ctx.strokeStyle = `rgba(123,227,200,${0.55 * (1 - k)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 30 + k * R, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 30 + k * R, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke(); }
}

// draw something translucent: the paper textures reset globalAlpha, so draw it on its own layer, then lay that down faded
function ghostly(al, fn) {
  const L = layer(7), saved = ctx, m = saved.getTransform();
  ctx = L.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.setTransform(m);
  fn();
  ctx = saved; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = al; ctx.drawImage(L, 0, 0); ctx.restore();
}
