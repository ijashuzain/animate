// =====================================================================
//  styles/flat/kit.js — FLAT: bright flat colours, clean dark outlines, one-step cel shading, no texture, no boil.
//  Made from the user's notes on kids' science channels (studio/references/peekaboo.md) and their rules: no grain or
//  halftone, no wobbling lines, calm flat backgrounds behind words. Things get faces; a lens zooms into the inside of
//  things; labels point at what they name; everything pops with a bounce instead of jittering.
//  Built on kit/core.js. Helpers are prefixed f (fShape, fCirc, fFace ...) so no core name is redeclared.
// =====================================================================
const FL = {
  ink: '#232634', paper: '#fff8ec', white: '#ffffff', cream: '#fff2d2',
  sky: '#bfe8f7', skyL: '#e3f5fb', sea: '#2fa0d6', seaD: '#1d78ad', deep: '#164a78', deepD: '#0f3157',
  sand: '#f6d58c', sandD: '#e0b562', grass: '#6cc56a', grassD: '#4ba552', rock: '#b48d6c', rockD: '#8f6a4d',
  sun: '#ffcd3c', sunD: '#f5a524', orange: '#ff8c42', orangeD: '#e46a1f', pink: '#ff5f8f', pinkL: '#ffc0d2',
  red: '#ee4b4b', purple: '#8a6cf0', purpleD: '#6a4fd0', blue: '#3f7cf0', mint: '#7fe0c4', yellow: '#ffe066', night: '#1b2140', nightL: '#2c3560',
};
const FLAT_FONT = '"Inter Display", Inter, "Liberation Sans", Arial, sans-serif';
// straight-edged path (core trace() rounds every corner); dense point lists (ellipses) still read as curves
function fPath(P, closed = true) { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); if (closed) ctx.closePath(); }
const fSh = (c, k = 0.82) => { const h = c.replace('#', ''), n = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return '#' + n.map((v) => Math.round(v * k).toString(16).padStart(2, '0')).join(''); };   // a darker tone of c for cel shading

// a flat shape: points P, fill c. o: line (false | colour), lw, shade (cel shadow: true or [dx, dy]), shc, drop ([dx, dy] flat drop shadow), alpha
function fShape(P, c, o = {}) {
  const tr = (Q) => (o.round ? trace(Q, true) : fPath(Q, true));
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.drop) { ctx.save(); ctx.translate(o.drop[0], o.drop[1]); tr(P); ctx.fillStyle = o.dropc ?? 'rgba(20,30,60,0.16)'; ctx.fill(); ctx.restore(); }
  tr(P); ctx.fillStyle = c; ctx.fill();
  if (o.shade) {   // one-step cel shading: a darker crescent on the lower right
    const [dx, dy] = Array.isArray(o.shade) ? o.shade : [-10, -12];
    ctx.save(); tr(P); ctx.clip(); ctx.fillStyle = o.shc ?? fSh(c); ctx.fill(); ctx.translate(dx, dy); tr(P); ctx.fillStyle = c; ctx.fill(); ctx.restore();
  }
  if (o.hi) { const b = bbox(P, 0); ctx.save(); tr(P); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(b.x0 + (b.x1 - b.x0) * 0.3, b.y0 + (b.y1 - b.y0) * 0.25, (b.x1 - b.x0) * 0.12, (b.y1 - b.y0) * 0.07, -0.5, 0, TAU); ctx.fill(); ctx.restore(); }
  if (o.line !== false) { ctx.lineWidth = o.lw ?? 5; ctx.strokeStyle = o.line ?? FL.ink; ctx.lineJoin = 'round'; tr(P); ctx.stroke(); }
  ctx.restore();
}
const fCirc = (x, y, r, c, o = {}) => fShape(ellipsePts(x, y, Math.max(0.5, r), Math.max(0.5, o.ry ?? r), o.rot ?? 0, 48), c, o);
const fRect = (x, y, w, h, r, c, o = {}) => fShape(rrectPts(x, y, w, h, r), c, o);
function fLine(P, c = FL.ink, w = 5, o = {}) { ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.lineWidth = w; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash); if (o.smooth) trace(P, false); else fPath(P, false); ctx.stroke(); ctx.restore(); }
function fArrow(x0, y0, x1, y1, c = FL.ink, w = 7) { const a = Math.atan2(y1 - y0, x1 - x0), h = w * 3.4; fLine([[x0, y0], [x1, y1]], c, w); fLine([[x1 - h * Math.cos(a - 0.55), y1 - h * Math.sin(a - 0.55)], [x1, y1], [x1 - h * Math.cos(a + 0.55), y1 - h * Math.sin(a + 0.55)]], c, w); }
// text in the style's type; o: align, weight, frac (write-on), outline (white edge so it reads on anything)
function fText(str, x, y, size, color = FL.ink, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 800} ${size}px ${FLAT_FONT}`; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac < 1) { ctx.beginPath(); ctx.rect(x - (o.align === 'center' ? w / 2 : o.align === 'right' ? w : 0) - 6, y - size * 1.2, w * frac + 6, size * 1.8); ctx.clip(); }
  if (o.outline !== false) { ctx.lineWidth = size * 0.16; ctx.strokeStyle = o.outline ?? FL.white; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
  ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore(); return w;
}
const fTextW = (str, size, weight = 800) => { ctx.save(); ctx.font = `${weight} ${size}px ${FLAT_FONT}`; const w = ctx.measureText(str).width; ctx.restore(); return w; };
// a face for anything (Peekaboo: things have faces). s = scale (1 = for a ~60 px wide thing). mood: smile, happy, wow, sad, focus, sleep, ouch
function fFace(x, y, s = 1, mood = 'smile', key = 'f', o = {}) {
  const blink = mood !== 'sleep' && (B + key.length * 7) % 47 < 2, ex = 13 * s, ey = -4 * s, lx = (o.look ?? [0, 0])[0] * 3 * s, ly = (o.look ?? [0, 0])[1] * 3 * s;
  for (const sg of [-1, 1]) {
    const cx = x + sg * ex, cy = y + ey;
    if (blink || mood === 'sleep' || mood === 'happy') { fLine(arcPts(cx, cy + (mood === 'happy' ? 3 * s : 0), 6 * s, mood === 'happy' ? Math.PI * 1.1 : 0.15, mood === 'happy' ? Math.PI * 1.9 : Math.PI - 0.15, 8), FL.ink, Math.max(2, 3 * s)); continue; }
    if (mood === 'ouch') { fLine([[cx - 6 * s, cy - 5 * s], [cx + 6 * s, cy], [cx - 6 * s, cy + 5 * s]].map(([px, py]) => [cx + (px - cx) * sg, py]), FL.ink, Math.max(2, 3 * s)); continue; }
    const r = (mood === 'wow' ? 8 : 7) * s;
    fCirc(cx, cy, r, FL.white, { lw: Math.max(1.5, 2.2 * s) });
    fCirc(cx + lx, cy + ly + 1 * s, r * 0.55, FL.ink, { line: false }); fCirc(cx + lx + r * 0.2, cy + ly - r * 0.15, r * 0.18, FL.white, { line: false });
  }
  if (o.blush !== false && mood !== 'sad') for (const sg of [-1, 1]) fCirc(x + sg * 22 * s, y + 9 * s, 5 * s, 'rgba(255,110,140,0.45)', { ry: 3.2 * s, line: false });
  const my = y + 10 * s;
  if (mood === 'wow' || mood === 'ouch') fCirc(x, my + 2 * s, 5 * s, FL.ink, { ry: 6 * s, line: false });
  else if (mood === 'sad') fLine(arcPts(x, my + 8 * s, 8 * s, Math.PI * 1.2, Math.PI * 1.8, 8), FL.ink, Math.max(2, 3 * s));
  else if (mood === 'focus' || mood === 'sleep') fLine([[x - 6 * s, my + 2 * s], [x + 6 * s, my + 2 * s]], FL.ink, Math.max(2, 3 * s));
  else fLine(arcPts(x, my - 3 * s, (mood === 'happy' ? 10 : 8) * s, 0.25, Math.PI - 0.25, 10), FL.ink, Math.max(2, 3 * s));
}
// the hero: a round flat buddy with stubby arms and feet. o: color, mood, arms ([l, r] angles in rad from down; 'up' | 'wave'), hop, look, s
function fHero(x, y, r, o = {}) {
  const key = o.key ?? 'hero', c = o.color ?? FL.purple, hop = o.hop ? Math.max(0, Math.sin(clamp((TT - o.hop) / 0.5) * Math.PI)) * r * 0.5 : 0;
  y -= hop; SPARK_AT = toScreen(x, y);
  fCirc(x, y + r * 1.12 + hop, r * 0.7, 'rgba(20,30,60,0.14)', { ry: r * 0.12, line: false });
  for (const s of [-1, 1]) fCirc(x + s * r * 0.38, y + r * 0.98, r * 0.24, fSh(c, 0.7), { ry: r * 0.14, lw: 4 });
  const A = o.arms === 'up' ? [2.6, 2.6] : o.arms === 'wave' ? [0.4, 2.4 + Math.sin(TT * 8) * 0.35] : (o.arms ?? [0.5, 0.5]);
  for (const [i, s] of [[0, -1], [1, 1]]) { const sx = x + s * r * 0.8, sy = y + r * 0.15, hx = sx + s * Math.sin(A[i]) * r * 0.6, hy = sy + Math.cos(A[i]) * r * 0.6; fLine([[sx, sy], [hx, hy]], FL.ink, r * 0.2); fLine([[sx, sy], [hx, hy]], c, r * 0.12); fCirc(hx, hy, r * 0.14, c, { lw: 3.5 }); }
  fCirc(x, y, r, c, { shade: [-r * 0.14, -r * 0.16], hi: true, lw: Math.max(4, r * 0.07) });
  fFace(x, y - r * 0.08, r / 45, o.mood ?? 'smile', key, { look: o.look });
}
// a lens (Peekaboo zoom): a ring with a handle; inner() draws what it shows, clipped to the glass. k 0..1 pops it in
function fLens(x, y, r, k, inner, o = {}) {
  if (k <= 0) return; const R = r * k;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fillStyle = o.glass ?? FL.skyL; ctx.fill(); ctx.clip(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); inner(); ctx.restore();
  const hx = x + R * 0.72, hy = y + R * 0.72; fLine([[hx, hy], [hx + R * 0.45, hy + R * 0.45]], FL.ink, R * 0.2); fLine([[hx, hy], [hx + R * 0.45, hy + R * 0.45]], o.handle ?? FL.orange, R * 0.12);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.lineWidth = R * 0.08 + 4; ctx.strokeStyle = FL.ink; ctx.stroke(); ctx.lineWidth = R * 0.06; ctx.strokeStyle = o.rim ?? FL.white; ctx.stroke(); ctx.restore();
}
// a pointing label (Peekaboo): a rounded pill with a word, a leader line and a dot on the thing it names; pops at t
function fLabel(str, x, y, tx, ty, t, o = {}) {
  const k = popS(t); if (k <= 0) return; const size = o.size ?? 34, w = fTextW(str, size) + size * 1.1, h = size * 1.6;
  fLine([[x, y], [lerp(x, tx, Math.min(1, k)), lerp(y, ty, Math.min(1, k))]], FL.ink, 4); fCirc(tx, ty, 8 * k, o.color ?? FL.pink, { lw: 3 });
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); fRect(-w / 2, -h / 2, w, h, h / 2, o.fill ?? FL.white, { lw: 4, drop: [0, 5] }); fText(str, 0, size * 0.36, size, o.color ?? FL.ink, { align: 'center', outline: false }); ctx.restore();
}
// backgrounds: calm, flat or a soft two-colour gradient (never texture)
function fSky(top, bottom = top) { ctx.save(); screen(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function fBand(y0, c, o = {}) { const P = [[-200, y0]]; for (let x = -200; x <= W + 200; x += 60) P.push([x, y0 + Math.sin(x * (o.f ?? 0.006) + (o.ph ?? 0)) * (o.amp ?? 0)]); P.push([W + 200, H + 200], [-200, H + 200]); fShape(P, c, { lw: o.lw ?? 5, line: o.line }); }
function fCloud(x, y, s = 1, c = FL.white) { fShape([...ellipsePts(x - 50 * s, y + 6 * s, 46 * s, 34 * s, 0, 20, Math.PI * 0.5, Math.PI * 1.5), ...ellipsePts(x, y - 14 * s, 54 * s, 46 * s, 0, 20, Math.PI, TAU), ...ellipsePts(x + 52 * s, y + 6 * s, 44 * s, 34 * s, 0, 20, Math.PI * 1.5, Math.PI * 2.5)], c, { lw: 5 }); }
function fSun(x, y, r, o = {}) { for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + TT * (o.spin ?? 0.25); fLine([[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], FL.sunD, 9); } fCirc(x, y, r, FL.sun, { shade: [-r * 0.12, -r * 0.12], shc: FL.sunD, lw: 6 }); if (o.face !== false) fFace(x, y, r / 40, o.mood ?? 'happy', 'sun'); }
function fDrop(x, y, r, c = FL.sea, o = {}) { const P = [[x, y - r * 1.6], ...ellipsePts(x, y, r, r, 0, 24, -0.25 * Math.PI, 1.25 * Math.PI).reverse()]; fShape(P, c, { lw: o.lw ?? 4, shade: o.shade ?? [-r * 0.15, -r * 0.18], hi: true, ...o }); if (o.face) fFace(x, y + r * 0.1, r / 34, o.mood ?? 'smile', o.key ?? 'drop'); }
// a pop with overshoot for anything: draws fn() scaled about (x, y)
function fPop(t, x, y, fn) { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }

// =====================================================================
//  STYLE — the renderer's hooks
// =====================================================================
const STYLE = {
  name: 'flat',
  paper: '#fff8ec',
  backdrop(c) { fillAll(c); },
  window(P, key, src) {
    ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
    ctx.save(); trace(P, true); ctx.lineWidth = 8; ctx.strokeStyle = FL.ink; ctx.stroke(); ctx.restore();
  },
  blob(P, c, key) { fShape(P, c, { lw: 6 }); },
  hero(x, y, r, o) { fHero(x, y, r * 0.6, o); },
  heroColor: FL.purple,
  post() {},
  ones: false,
};
