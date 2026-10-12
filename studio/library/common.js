
// =====================================================================
//  LIBRARY — style-agnostic characters and helpers (engine core only). Use in any style; restyle by passing colours.
//    chFace(x, y, s, mood)          a face: smile | happy | wow | sad | focus | talk (mouth moves) ; blinks on its own
//    hero(x, y, r, o)               a round mascot with a face, arms, squash on pop; o: color, dark, mood, s, arms ('wave'|'up'|null)
//    personFull(x, y, o)            a full-body person (feet at x, y): pose stand|walk|sit|chair|lie, arms down|wave|up|point|cup,
//                                   mood, skin, body, hair, grey, flip, s, suit
//    squash(t)                      { sx, sy } for a squash-and-stretch pop at t
//  Learned: characters read better with arms and a blink; a tiny bob keeps held shots alive (LEARNINGS.md).
// =====================================================================
function chFace(x, y, s, mood = 'smile', key = 'f') {
  const I = '#2a1d18';
  if (mood !== 'happy' && mood !== 'focus' && (B + key.length * 7) % 47 < 2) mood = 'blink';
  const eye = (ex) => {
    if (mood === 'happy') { ink(arcPts(ex, y + 5 * s, 8 * s, Math.PI * 1.15, Math.PI * 1.85, 8), { w: 3.6 * s, color: I, amt: 0.2, key: key + 'eh' + ex }); return; }
    if (mood === 'focus' || mood === 'blink') { ink([[ex - 7 * s, y], [ex + 7 * s, y]], { w: 3.6 * s, color: I, amt: 0.2, key: key + 'ef' + ex }); return; }
    chDot(ex, y, (mood === 'wow' ? 7.5 : 6) * s, I); chDot(ex + 2 * s, y - 2.4 * s, 2 * s, '#fff');
  };
  eye(x - 16 * s); eye(x + 16 * s);
  ctx.fillStyle = 'rgba(240,110,120,0.45)'; ctx.beginPath(); ctx.ellipse(x - 27 * s, y + 11 * s, 7 * s, 4.5 * s, 0, 0, TAU); ctx.ellipse(x + 27 * s, y + 11 * s, 7 * s, 4.5 * s, 0, 0, TAU); ctx.fill();
  if (mood === 'sad') ink(arcPts(x, y + 22 * s, 8 * s, Math.PI * 1.2, Math.PI * 1.8, 8), { w: 3.2 * s, color: I, amt: 0.2, key: key + 'ms' });
  else if (mood === 'wow') { ctx.fillStyle = I; ctx.beginPath(); ctx.ellipse(x, y + 16 * s, 5 * s, 7 * s, 0, 0, TAU); ctx.fill(); }
  else if (mood === 'happy') { ctx.fillStyle = I; ctx.beginPath(); ctx.arc(x, y + 10 * s, 10 * s, 0, Math.PI); ctx.closePath(); ctx.fill(); }
  else if (mood === 'talk') { const o = 2 + 5 * Math.abs(Math.sin(TT * 11)); ctx.fillStyle = I; ctx.beginPath(); ctx.ellipse(x, y + 14 * s, 7 * s, o * s, 0, 0, TAU); ctx.fill(); }
  else ink(arcPts(x, y + 8 * s, 8 * s, Math.PI * 0.2, Math.PI * 0.8, 8), { w: 3.2 * s, color: I, amt: 0.2, key: key + 'm' });
}
function squash(t, d = 0.35) { const u = clamp((TT - t) / d); if (TT < t || u >= 1) return { sx: 1, sy: 1 }; const k = Math.sin(u * Math.PI) * (1 - u) * 0.35; return { sx: 1 + k, sy: 1 - k }; }
function hero(x, y, r, o = {}) {
  const key = o.key ?? 'hero', sc = o.s ?? 1; if (sc <= 0.01) return; r *= sc;
  const c = o.color ?? '#ec7a4f', cd = o.dark ?? '#c4542e', q = o.pop != null ? squash(o.pop) : { sx: 1, sy: 1 };
  y += Math.sin(TT * TAU * 0.8 + key.length) * r * 0.05;
  ctx.save(); ctx.translate(x, y); ctx.scale(q.sx, q.sy);
  const wv = o.arms === 'wave' ? Math.sin(TT * 9) * 0.5 : 0;
  const armA = o.arms === 'up' || o.arms === 'wave' ? [-2.4, -0.7 + wv] : [2.5, 0.65];
  armA.forEach((a, i) => { const sx = (i ? 1 : -1) * r * 0.8; chShape(capsuleCh(sx, r * 0.15, sx + Math.cos(a) * r * 0.55, r * 0.15 + Math.sin(a) * r * 0.55, r * 0.2), cd, { key: key + 'arm' + i, sb: 4, grain: false }); });
  chShape(ellipsePts(0, 0, r, r * 0.96, 0, 36), c, { key: key + 'b', sb: 10 });
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.42, r * 0.16, r * 0.24, -0.5, 0, TAU); ctx.fill();
  chFace(0, r * 0.08, r / 64, o.mood ?? 'smile', key);
  ctx.restore();
  SPARK_AT = toScreen(x, y);
}
function capsuleCh(x1, y1, x2, y2, w, n = 6) {
  const a = Math.atan2(y2 - y1, x2 - x1), r = w / 2, P = [];
  for (let i = 0; i <= n; i++) { const t = a - Math.PI / 2 + Math.PI * i / n; P.push([x2 + Math.cos(t) * r, y2 + Math.sin(t) * r]); }
  for (let i = 0; i <= n; i++) { const t = a + Math.PI / 2 + Math.PI * i / n; P.push([x1 + Math.cos(t) * r, y1 + Math.sin(t) * r]); }
  return P;
}
// a full-body person (ported from the last-human piece, core-only)
function personFull(x, y, o = {}) {
  const s = o.s ?? 1, key = o.key ?? 'pf', pose = o.pose ?? 'stand', arms = o.arms ?? 'down';
  const body = o.body ?? (o.suit ? '#e6e2da' : '#3f9f9a'), bodyD = o.bodyD ?? (o.suit ? '#b7b2a8' : '#2d7773'), skin = o.skin ?? '#c68a62', hair = o.grey ? '#b9b4ae' : o.hair ?? '#2b211d';
  ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1); ctx.scale(s, s);
  const br = Math.sin(TT * TAU * 0.25) * 2;
  let hip, sh, head, kL, kR, fL, fR;
  if (pose === 'sit') { hip = [0, -40]; kL = [80, -150]; kR = [96, -140]; fL = [130, 0]; fR = [150, 0]; sh = [-14, -215 + br]; head = [-14, -290 + br]; }
  else if (pose === 'chair') { hip = [0, -190]; kL = [96, -190]; kR = [110, -186]; fL = [100, 0]; fR = [116, 0]; sh = [-4, -350 + br]; head = [-4, -425 + br]; }
  else if (pose === 'lie') { hip = [0, -36]; kL = [120, -40]; kR = [120, -34]; fL = [230, -40]; fR = [232, -30]; sh = [-160, -40]; head = [-240, -46]; }
  else { const g = pose === 'walk' ? Math.sin(TT * 5.2) : 0; hip = [0, -200]; kL = [g * 30, -100]; kR = [-g * 30, -100]; fL = [g * 50, 0]; fR = [-g * 50, 0]; sh = [0, -360 + br]; head = [0, -435 + br]; }
  for (const [k, f, n] of [[kR, fR, 'r'], [kL, fL, 'l']]) {
    chShape(capsuleCh(hip[0], hip[1], k[0], k[1], 44), n === 'r' ? bodyD : body, { key: key + 'th' + n, sb: 5, grain: false });
    chShape(capsuleCh(k[0], k[1], f[0], f[1], 40), n === 'r' ? bodyD : body, { key: key + 'sh' + n, sb: 5, grain: false });
    chShape(ellipsePts(f[0] + 12, f[1] - 6, 30, 14, 0, 14), '#2a2a30', { key: key + 'ft' + n, sb: 3, grain: false });
  }
  chShape(capsuleCh(hip[0], hip[1], sh[0], sh[1] + 20, 120), body, { key: key + 'tor', grain: false });
  const sL = [sh[0] + 46, sh[1] + 24], sR = [sh[0] - 46, sh[1] + 24];
  let hL, hR;
  if (arms === 'wave') { hL = [sL[0] + 60 + Math.sin(TT * 8) * 20, sL[1] - 160]; hR = [sR[0] - 10, sR[1] + 150]; }
  else if (arms === 'up') { hL = [sL[0] + 70, sL[1] - 150]; hR = [sR[0] - 70, sR[1] - 150]; }
  else if (arms === 'point') { hL = [sL[0] + 190, sL[1] - 30]; hR = [sR[0] - 10, sR[1] + 150]; }
  else if (arms === 'cup') { hL = [sh[0] + 46, sh[1] + 120]; hR = [sh[0] + 20, sh[1] + 128]; }
  else { hL = [sL[0] + 10, sL[1] + 150]; hR = [sR[0] - 10, sR[1] + 150]; }
  if (pose === 'lie') { hL = [sh[0] + 40, sh[1] - 120]; hR = [sh[0] + 90, sh[1] + 10]; }
  for (const [a, h, n] of [[sR, hR, 'r'], [sL, hL, 'l']]) { const e = [(a[0] + h[0]) / 2 + (n === 'l' ? 12 : -12), (a[1] + h[1]) / 2 + 10]; chShape(capsuleCh(a[0], a[1], e[0], e[1], 36), n === 'r' ? bodyD : body, { key: key + 'ua' + n, sb: 4, grain: false }); chShape(capsuleCh(e[0], e[1], h[0], h[1], 32), n === 'r' ? bodyD : body, { key: key + 'la' + n, sb: 4, grain: false }); chShape(ellipsePts(h[0], h[1], 19, 17, 0, 12), skin, { key: key + 'hd' + n, sb: 3, grain: false }); }
  chShape(ellipsePts(head[0], head[1], 62, 70, 0, 30), skin, { key: key + 'hd', grain: false });
  chShape([[head[0] - 64, head[1] - 4], [head[0] - 60, head[1] - 52], [head[0] - 20, head[1] - 80], [head[0] + 34, head[1] - 78], [head[0] + 66, head[1] - 40], [head[0] + 64, head[1] - 10], [head[0] + 40, head[1] - 44], [head[0] - 30, head[1] - 46]], hair, { key: key + 'hr', sb: 4, grain: false });
  chFace(head[0] + 4, head[1] + 8, 1.15, o.mood ?? 'smile', key);
  if (o.suit) { ctx.fillStyle = 'rgba(200,225,240,0.22)'; ctx.beginPath(); ctx.arc(head[0], head[1] + 4, 104, 0, TAU); ctx.fill(); ctx.strokeStyle = '#e6e2da'; ctx.lineWidth = 12; ctx.stroke(); }
  ctx.restore();
  SPARK_AT = toScreen(x, y - 300 * s);
}
