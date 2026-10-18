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
// the scene's own lettering (labels, signs): o.font, else CHANNEL.labelFont (the video's pick), else the default
const fFont = (o = {}) => o.font ?? ((typeof CHANNEL !== 'undefined' && CHANNEL.labelFont) || FLAT_FONT);
// straight-edged path (core trace() rounds every corner); dense point lists (ellipses) still read as curves
function fPath(P, closed = true) { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); if (closed) ctx.closePath(); }
// the soft look (CHANNEL.look = 'soft'): no outlines unless a shape asks for one; tone-on-tone, limited palettes
const fSoft = () => typeof CHANNEL !== 'undefined' && CHANNEL.look === 'soft';
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
  if (o.line !== false && !(fSoft() && o.line == null)) { ctx.lineWidth = o.lw ?? 5; ctx.strokeStyle = o.line ?? FL.ink; ctx.lineJoin = 'round'; tr(P); ctx.stroke(); }
  ctx.restore();
}
const fCirc = (x, y, r, c, o = {}) => fShape(ellipsePts(x, y, Math.max(0.5, r), Math.max(0.5, o.ry ?? r), o.rot ?? 0, 48), c, o);
const fRect = (x, y, w, h, r, c, o = {}) => fShape(rrectPts(x, y, w, h, r), c, o);
function fLine(P, c = FL.ink, w = 5, o = {}) { ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.lineWidth = w; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash); if (o.smooth) trace(P, false); else fPath(P, false); ctx.stroke(); ctx.restore(); }
function fArrow(x0, y0, x1, y1, c = FL.ink, w = 7) { const a = Math.atan2(y1 - y0, x1 - x0), h = w * 3.4; fLine([[x0, y0], [x1, y1]], c, w); fLine([[x1 - h * Math.cos(a - 0.55), y1 - h * Math.sin(a - 0.55)], [x1, y1], [x1 - h * Math.cos(a + 0.55), y1 - h * Math.sin(a + 0.55)]], c, w); }
// text in the style's type; o: align, weight, frac (write-on), outline (white edge so it reads on anything)
function fText(str, x, y, size, color = FL.ink, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 800} ${size}px ${fFont(o)}`; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac < 1) { ctx.beginPath(); ctx.rect(x - (o.align === 'center' ? w / 2 : o.align === 'right' ? w : 0) - 6, y - size * 1.2, w * frac + 6, size * 1.8); ctx.clip(); }
  if (o.outline !== false) { ctx.lineWidth = size * 0.16; ctx.strokeStyle = o.outline ?? FL.white; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
  ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore(); return w;
}
const fTextW = (str, size, weight = 800, o = {}) => { ctx.save(); ctx.font = `${weight} ${size}px ${fFont(o)}`; const w = ctx.measureText(str).width; ctx.restore(); return w; };
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
//  DEPTH + LIVING ASSETS (the user's note: a little parallax so scenes feel alive; detailed, gently animated
//  mountains, trees, clouds, sea, fish, volcanoes). Motion is purposeful and slow: drift, sway, swim, puff. No jitter.
// =====================================================================
// parallax: draw fn() on a layer at depth d (0 = far, still; 1 = near, moves most). The whole scene drifts slowly
// sideways, so layers slide past each other. o.drift (px per s at depth 1), o.sway (px), o.y (vertical bob px)
function fLayer(d, fn, o = {}) { const t = TT - E0, dx = -(o.drift ?? 6) * t * d + Math.sin(TT * 0.22) * (o.sway ?? 14) * d, dy = Math.sin(TT * 0.17 + 1) * (o.y ?? 4) * d; ctx.save(); ctx.translate(dx, dy); fn(); ctx.restore(); }
// a mountain with a lit side and a shade side, a jagged snow cap, ridge lines and a few rocks
function fMountain(x, base, w, h, o = {}) {
  const c = o.c ?? FL.rock, cd = o.cd ?? fSh(c, 0.78), top = [x + (o.peak ?? 0) * w, base - h], L = [x - w / 2, base], Rr = [x + w / 2, base];
  fShape([L, [lerp(L[0], top[0], 0.55) - w * 0.04, lerp(L[1], top[1], 0.55)], top, [lerp(Rr[0], top[0], 0.6) + w * 0.03, lerp(Rr[1], top[1], 0.6)], Rr], c, { lw: o.lw ?? 5 });
  fShape([top, [lerp(Rr[0], top[0], 0.6) + w * 0.03, lerp(Rr[1], top[1], 0.6)], Rr, [top[0] + w * 0.06, base]], cd, { line: false });   // shade side
  fLine([top, [top[0] + w * 0.06, base - h * 0.3]], fSh(c, 0.7), 4, { alpha: 0.7 });
  for (let i = 0; i < 3; i++) { const u = 0.35 + i * 0.18, rx = lerp(L[0], top[0], u) + w * 0.08 * (i - 1), ry = lerp(base, top[1], u * 0.8); fLine([[rx, ry], [rx + w * 0.05, ry + h * 0.06]], fSh(c, 0.72), 4, { alpha: 0.6 }); }
  if (o.snow !== false) { const sh = h * (o.snow ?? 0.26), ys = top[1] + sh, xl = lerp(top[0], L[0], sh / h * 1.05), xr = lerp(top[0], Rr[0], sh / h * 1.05);
    fShape([top, [xr, ys], [lerp(xr, top[0], 0.35), ys - sh * 0.18], [top[0] + (xr - top[0]) * 0.1, ys + sh * 0.08], [lerp(xl, top[0], 0.4), ys - sh * 0.15], [xl, ys]], FL.white, { lw: 4, shade: [sh * 0.12, 0], shc: '#dfeaf2' }); }
}
// a leafy tree that sways from the trunk (s = scale, 1 = ~140 px tall)
function fTree(x, y, s = 1, o = {}) {
  const a = Math.sin(TT * 1.1 + x * 0.013) * 0.035 * (o.sway ?? 1), c = o.c ?? FL.grass;
  fRect(x - 9 * s, y - 70 * s, 18 * s, 72 * s, 5 * s, o.trunk ?? FL.rockD, { lw: 4 });
  ctx.save(); ctx.translate(x, y - 60 * s); ctx.rotate(a); ctx.translate(-x, -(y - 60 * s));
  for (const [dx, dy, r] of [[-30, -70, 40], [30, -72, 42], [0, -110, 50]]) fCirc(x + dx * s, y + dy * s, r * s, c, { lw: 4, shade: [-r * s * 0.2, -r * s * 0.25], shc: fSh(c, 0.8) });
  if (o.fruit) for (const [dx, dy] of [[-30, -60], [20, -100], [36, -66]]) fCirc(x + dx * s, y + dy * s, 7 * s, o.fruit, { lw: 2.5 });
  ctx.restore();
}
// a pine: three stacked triangles, swaying
function fPine(x, y, s = 1, o = {}) {
  const a = Math.sin(TT * 0.9 + x * 0.02) * 0.03, c = o.c ?? '#3e9f6a';
  fRect(x - 7 * s, y - 30 * s, 14 * s, 32 * s, 3, FL.rockD, { lw: 3.5 });
  ctx.save(); ctx.translate(x, y - 30 * s); ctx.rotate(a); ctx.translate(-x, -(y - 30 * s));
  for (let i = 0; i < 3; i++) { const w = (70 - i * 14) * s, yb = y - (28 + i * 34) * s; fShape([[x - w / 2, yb], [x, yb - 58 * s], [x + w / 2, yb]], c, { lw: 4, shade: [w * 0.18, 0], shc: fSh(c, 0.8) }); }
  ctx.restore();
}
// a cloud that drifts and wraps across the frame (speed px/s); bottom shading
// o.span: the width it wraps in (from -300); channel scenes keep it to the scene side so nothing drifts under the words
const F_SPAN = () => (typeof CHL !== 'undefined' ? 1350 : W + 600);
function fCloud2(x, y, s = 1, o = {}) { const xx = mod(x + (TT - E0) * (o.speed ?? 10) + 300, o.span ?? F_SPAN()) - 300; const P = [...ellipsePts(xx - 55 * s, y + 8 * s, 48 * s, 34 * s, 0, 20, Math.PI * 0.5, Math.PI * 1.5), ...ellipsePts(xx - 10 * s, y - 22 * s, 50 * s, 46 * s, 0, 20, Math.PI, Math.PI * 1.75), ...ellipsePts(xx + 40 * s, y - 12 * s, 44 * s, 40 * s, 0, 20, Math.PI * 1.25, TAU), ...ellipsePts(xx + 70 * s, y + 10 * s, 36 * s, 30 * s, 0, 20, Math.PI * 1.5, Math.PI * 2.5)];
  fShape(P, o.c ?? FL.white, { lw: 4.5, shade: [0, -14 * s], shc: o.shc ?? '#dbeaf3' }); }
// birds: little V shapes flapping across
function fBirds(x, y, n = 3, o = {}) { for (let i = 0; i < n; i++) { const bx = mod(x + i * 46 + (TT - E0) * (o.speed ?? 40), (o.span ?? F_SPAN()) - 150) - 150, by = y + i * 18 + Math.sin(TT * 1.3 + i) * 8, f = Math.sin(TT * 9 + i * 1.7) * 10; fLine([[bx - 16, by - f * 0.6], [bx, by], [bx + 16, by - f * 0.6]], FL.ink, 4, { smooth: false }); } }
// the sea: a darker back swell, a front surface with moving crests, foam and sparkles; depth gradient below
function fSea2(y0, o = {}) {
  const c = o.c ?? FL.sea, cd = o.cd ?? FL.seaD, t = TT;
  const wave = (yy, amp, f, ph, col, lw) => { const P = [[-200, yy]]; for (let x = -200; x <= W + 200; x += 40) P.push([x, yy + Math.sin(x * f + t * ph) * amp]); P.push([W + 200, H + 300], [-200, H + 300]); fShape(P, col, { lw }); };
  wave(y0 - 14, 9, 0.009, 1.1, cd, 0);
  wave(y0, 11, 0.012, 1.7, c, o.lw ?? 5);
  ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, y0 + 500); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(10,40,90,0.35)'); ctx.fillStyle = g; ctx.fillRect(-200, y0 + 20, W + 400, 700); ctx.restore();
  for (let i = 0; i < 8; i++) { const x = mod(i * 260 + t * 30, W + 300) - 150, yy = y0 + 60 + (i % 3) * 70; fLine(arcPts(x, yy, 26, Math.PI * 1.15, Math.PI * 1.85, 8), FL.white, 5, { alpha: 0.75, smooth: true }); }
  for (let i = 0; i < 6; i++) { const R = RNG('spk', i), x = R.r(0, W), yy = y0 + R.r(30, 260), k = Math.max(0, Math.sin(t * 2.2 + i * 1.9)); if (k > 0.6) { const r = 7 * (k - 0.6) / 0.4; fLine([[x - r, yy], [x + r, yy]], FL.white, 3); fLine([[x, yy - r], [x, yy + r]], FL.white, 3); } }
}
// a fish that swims (tail wags, little fin flaps); dir 1 = right; s = scale (1 = ~150 px long)
function fFish(x, y, s = 1, o = {}) {
  const dir = o.dir ?? 1, c = o.c ?? FL.orange, wag = Math.sin(TT * 7 + x * 0.01) * 0.35;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.save(); ctx.translate(-58, 0); ctx.rotate(wag); fShape([[0, 0], [-46, -34], [-36, 0], [-46, 34]], o.tail ?? fSh(c, 0.85), { lw: 4.5 }); ctx.restore();
  fShape([[-10, -40], [12, -58], [30, -38]], fSh(c, 0.85), { lw: 4 });
  fCirc(0, 0, 66, c, { ry: 42, lw: 5, shade: [0, -12], hi: true });
  for (const sx of [-14, 8]) fLine([[sx, -38], [sx - 6, 38]], o.stripe ?? FL.white, 7, { alpha: 0.85 });
  ctx.save(); ctx.translate(10, 18); ctx.rotate(Math.sin(TT * 5) * 0.3); fShape([[0, 0], [-22, 12], [-6, 20]], fSh(c, 0.85), { lw: 3.5 }); ctx.restore();
  fCirc(34, -10, 10, FL.white, { lw: 3 }); fCirc(37, -10, 5, FL.ink, { line: false }); fLine(arcPts(48, 8, 8, 0.3, 1.6, 6), FL.ink, 3);
  ctx.restore();
  if (o.bubbles !== false) for (let i = 0; i < 3; i++) { const u = mod(TT * 0.8 + i / 3, 1); fCirc(x + dir * (70 * s + 10) + Math.sin(u * 6) * 4, y - 20 * s - u * 90, 4 + u * 5, 'rgba(255,255,255,0.4)', { lw: 2, line: FL.white, alpha: 1 - u }); }
}
// a volcano: a shaded cone, a glowing crater, lava runs, and smoke that puffs up (heat 0..1 = how active)
function fVolcano(x, base, w, h, o = {}) {
  const heat = o.heat ?? 1, c = o.c ?? '#8d6e63', top = base - h, cw = w * 0.16;
  for (let i = 0; i < 7; i++) { const u = mod(TT * 0.18 + i / 7, 1); fCirc(x + Math.sin(u * 5 + i) * 30 * u, top - 30 - u * 360, (24 + u * 60) * (0.6 + 0.4 * heat), u < 0.15 ? '#ffb347' : '#8a8f9c', { lw: 4, alpha: (1 - u) * heat }); }
  fShape([[x - w / 2, base], [x - cw, top], [x + cw, top], [x + w / 2, base]], c, { lw: 5 });
  fShape([[x + cw * 0.2, top], [x + cw, top], [x + w / 2, base], [x + w * 0.1, base]], fSh(c, 0.78), { line: false });
  fCirc(x, top + 4, cw, FL.orange, { ry: cw * 0.28, lw: 4 }); fCirc(x, top + 4, cw * 0.6, FL.yellow, { ry: cw * 0.15, line: false });
  if (heat > 0.3) for (const [dx, len] of [[-0.4, 0.45], [0.35, 0.6]]) { const f = Math.min(1, len * (0.75 + 0.25 * Math.sin(TT * 1.4 + dx * 5))); fLine([[x + dx * cw, top + 6], [x + dx * w * 0.32, top + h * f * 0.9]], FL.ink, 18, { smooth: true }); fLine([[x + dx * cw, top + 6], [x + dx * w * 0.32, top + h * f * 0.9]], FL.orange, 11, { smooth: true }); }
}
// grass tufts along a line (they sway a little)
function fTufts(x0, x1, y, n = 8, c = FL.grassD) { for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + 0.5) / n), a = Math.sin(TT * 1.6 + i) * 4; fLine([[x - 8, y], [x - 12 + a, y - 18]], c, 4); fLine([[x, y], [x + a, y - 24]], c, 4); fLine([[x + 8, y], [x + 12 + a, y - 18]], c, 4); } }

// =====================================================================
//  SOFT LOOK (the user's references: Headspace-style blob characters, tone-on-tone flat vector rooms, layered autumn
//  hills): no outlines, one harmonious palette per scene, background props as tints of the ground colour, characters
//  as rounded blobs with noodle limbs that walk, wave and bounce. Use with CHANNEL.look = 'soft'.
// =====================================================================
const fHex = (c) => { const h = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const fMix = (a, b, k) => { const A = fHex(a), Bc = fHex(b); return '#' + A.map((v, i) => Math.round(v + (Bc[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const fTint = (c, k) => (k >= 0 ? fMix(c, '#ffffff', k) : fMix(c, '#1a1630', -k));   // k > 0 lighter, k < 0 darker (towards a deep plum, not grey)
// a noodle: a thick round-capped curve from a to b, bending by bend (px, sideways)
function fNoodle(a, b, w, c, bend = 0) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend, cy = my + dx / L * bend; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(cx, cy, b[0], b[1]); ctx.stroke(); ctx.restore(); }
// a blob character (Headspace-like). (x, y) = the feet on the ground. o: body 'pill' | 'bean' | 'ball' | 'tall', w, h, c (body),
// limb (limb colour), pose 'stand' | 'walk' | 'wave' | 'cheer' | 'point' | 'sit', walk (speed, 0 = stand), dir 1 | -1,
// mood (face), eyes 'dots' | 'big', look [x, y], hair 'tuft' | 'band' | 'curl' | null, hairc, hop (time), arms [aL, aR] override
function fBlob(x, y, o = {}) {
  const key = o.key ?? 'blob', w = o.w ?? 120, h = o.h ?? 170, c = o.c ?? '#5b8def', lc = o.limb ?? fTint(c, -0.55), dir = o.dir ?? 1, lw = o.lw ?? Math.max(10, w * 0.12);
  const ph = TT * (o.walk ?? 0) * 6 + key.length, walking = (o.walk ?? 0) > 0;
  const hop = o.hop != null ? Math.max(0, Math.sin(clamp((TT - o.hop) / 0.55) * Math.PI)) : 0, sq = o.hop != null ? Math.sin(clamp((TT - o.hop) / 0.55) * Math.PI * 2) * 0.06 : 0;
  const bob = walking ? Math.abs(Math.sin(ph)) * 8 : Math.sin(TT * 2 + key.length) * 2.5;
  const leg = h * 0.32, by = y - leg - bob - hop * 90, sx = 1 + sq, sy = 1 - sq;
  fCirc(x, y + 4, w * 0.55 * (1 - hop * 0.4), 'rgba(30,20,60,0.13)', { ry: 9, line: false });
  if (o.pose !== 'sit') for (const s of [-1, 1]) { const st = walking ? Math.sin(ph + (s > 0 ? Math.PI : 0)) * 26 : s * 6, lift = walking ? Math.max(0, Math.cos(ph + (s > 0 ? Math.PI : 0))) * 12 : 0, fx = x + s * w * 0.18 + st * dir, fy = y - lift - hop * 90; fNoodle([x + s * w * 0.18, by + 4], [fx, fy], lw, lc, -st * 0.25 * dir); fCirc(fx + dir * 8, fy - 2, lw * 0.75, lc, { ry: lw * 0.45, line: false }); }
  // body
  ctx.save(); ctx.translate(x, by); ctx.scale(sx, sy); ctx.translate(-x, -by);
  const bodyP = (o.body ?? 'pill') === 'ball' ? ellipsePts(x, by - h * 0.34, w * 0.55, h * 0.36, 0, 48) : (o.body === 'bean') ? ellipsePts(x, by - h * 0.36, w * 0.5, h * 0.4, dir * 0.12, 48) : rrectPts(x - w / 2, by - h * (o.body === 'tall' ? 0.95 : 0.72), w, h * (o.body === 'tall' ? 0.95 : 0.72), w * 0.48, 10);
  const top = by - h * ((o.body ?? 'pill') === 'tall' ? 0.95 : 0.72), cy = by - h * 0.4;
  // arms (behind for the far arm would need depth; both in front reads fine in this look)
  const A = o.arms ?? ({ wave: [0.5, 2.5 + Math.sin(TT * 7) * 0.35], cheer: [2.6 + Math.sin(TT * 6) * 0.2, 2.6 - Math.sin(TT * 6) * 0.2], point: [0.4, 1.6], sit: [0.6, 0.6] }[o.pose] ?? (walking ? [0.35 + Math.sin(ph) * 0.4, 0.35 - Math.sin(ph) * 0.4] : [0.35, 0.35]));
  const drawArm = (s, a) => { const shx = x + s * w * 0.42, shy = cy + h * 0.02, L = h * 0.42, hx = shx + s * Math.sin(a) * L, hy = shy + Math.cos(a) * L; fNoodle([shx, shy], [hx, hy], lw * 0.9, lc, s * 14 * Math.cos(a)); fCirc(hx, hy, lw * 0.62, lc, { line: false }); };
  fShape(bodyP, c, { line: false });
  if (o.belly !== false) { ctx.save(); trace(bodyP, true); ctx.clip(); fCirc(x - dir * w * 0.25, by + 6, w * 0.7, fTint(c, -0.12), { ry: h * 0.32, line: false }); ctx.restore(); }
  // hair
  if (o.hair === 'tuft') for (let i = -1; i <= 1; i++) fNoodle([x + i * w * 0.12, top + 8], [x + i * w * 0.2 + Math.sin(TT * 2 + i) * 3, top - 22 - (i === 0 ? 10 : 0)], lw * 0.8, o.hairc ?? lc);
  if (o.hair === 'band') { ctx.save(); trace(bodyP, true); ctx.clip(); fRect(x - w, top + h * 0.12, w * 2, h * 0.08, 0, o.hairc ?? FL.pink, { line: false }); ctx.restore(); }
  if (o.hair === 'curl') fCirc(x + dir * w * 0.15, top + 4, w * 0.28, o.hairc ?? fTint(c, -0.35), { line: false });
  // face
  const fx = x + dir * w * 0.08, fy = top + h * (o.body === 'ball' ? 0.2 : 0.2), lk = o.look ?? [dir * 0.6, 0];
  const blink = (B + key.length * 5) % 53 < 2;
  if ((o.eyes ?? 'big') === 'big') for (const s of [-1, 1]) { const ex = fx + s * w * 0.14, ey = fy; if (blink || o.mood === 'sleep' || o.mood === 'happy') { fLine(arcPts(ex, ey + 2, w * 0.07, o.mood === 'happy' ? Math.PI * 1.1 : 0.2, o.mood === 'happy' ? Math.PI * 1.9 : Math.PI - 0.2, 8), FL.ink, Math.max(3, w * 0.035), { smooth: true }); continue; } fCirc(ex, ey, w * 0.1, FL.white, { line: false }); fCirc(ex + lk[0] * w * 0.035, ey + lk[1] * w * 0.035, w * 0.055, FL.ink, { line: false }); }
  else for (const s of [-1, 1]) fCirc(fx + s * w * 0.12, fy, w * 0.04, FL.ink, { ry: blink ? w * 0.01 : w * 0.05, line: false });
  const my = fy + h * 0.11, mood = o.mood ?? 'smile';
  if (mood === 'wow' || mood === 'ouch') fCirc(fx, my + 4, w * 0.06, FL.ink, { ry: w * 0.08, line: false });
  else if (mood === 'sad') fLine(arcPts(fx, my + w * 0.1, w * 0.08, Math.PI * 1.2, Math.PI * 1.8, 8), FL.ink, Math.max(3, w * 0.03), { smooth: true });
  else if (mood === 'focus' || mood === 'sleep') fLine([[fx - w * 0.06, my + 2], [fx + w * 0.06, my + 2]], FL.ink, Math.max(3, w * 0.03));
  else { ctx.save(); ctx.beginPath(); ctx.arc(fx, my - w * 0.02, w * (mood === 'happy' ? 0.1 : 0.08), 0.15, Math.PI - 0.15); ctx.closePath(); ctx.fillStyle = mood === 'happy' ? FL.ink : 'rgba(0,0,0,0)'; ctx.fill(); ctx.lineWidth = Math.max(3, w * 0.03); ctx.strokeStyle = FL.ink; ctx.lineCap = 'round'; if (mood !== 'happy') ctx.stroke(); ctx.restore(); }
  if (o.blush !== false) for (const s of [-1, 1]) fCirc(fx + s * w * 0.27, fy + h * 0.07, w * 0.06, 'rgba(255,120,150,0.4)', { ry: w * 0.035, line: false });
  ctx.restore();
  drawArm(-1, A[0]); drawArm(1, A[1]);
  if (o.extra) o.extra({ x, by, top, w, h, cy });
}
// a round leafy tree (autumn-flat reference): a tapered trunk with branches, a cluster canopy with a darker underside and leaf marks
function fTreeRound(x, y, s = 1, o = {}) {
  const c = o.c ?? '#e2553b', a = Math.sin(TT * 0.9 + x * 0.01) * 0.025, tc = o.trunk ?? fTint(c, -0.55);
  fShape([[x - 12 * s, y], [x - 6 * s, y - 120 * s], [x + 6 * s, y - 120 * s], [x + 12 * s, y]], tc, { line: false });
  fNoodle([x, y - 70 * s], [x - 40 * s, y - 120 * s], 7 * s, tc); fNoodle([x, y - 90 * s], [x + 36 * s, y - 135 * s], 6 * s, tc);
  ctx.save(); ctx.translate(x, y - 100 * s); ctx.rotate(a); ctx.translate(-x, -(y - 100 * s));
  const blobs = [[0, -170, 95], [-70, -130, 70], [70, -125, 72], [-30, -215, 60], [40, -205, 58]];
  for (const [dx, dy, r] of blobs) fCirc(x + dx * s, y + dy * s, r * s, c, { line: false });
  ctx.save(); for (const [dx, dy, r] of blobs) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); } ctx.clip(); fCirc(x + 30 * s, y - 70 * s, 150 * s, fTint(c, -0.15), { ry: 70 * s, line: false }); ctx.restore();
  for (let i = 0; i < (o.leaves ?? 9); i++) { const R = RNG('tl', x, i); fCirc(x + R.r(-110, 110) * s, y + R.r(-240, -100) * s, 8 * s, fTint(c, -0.28), { ry: 14 * s, rot: R.r(-1, 1), line: false }); }
  ctx.restore();
}
// a cone tree (cypress / poplar silhouette) and a bush
function fCone(x, y, s = 1, c = '#c98a2f') { const a = Math.sin(TT * 0.8 + x * 0.02) * 0.02; ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.translate(-x, -y); fShape([[x, y - 230 * s], ...ellipsePts(x, y - 95 * s, 34 * s, 120 * s, 0, 30, -Math.PI * 0.45, Math.PI * 1.45)], c, { line: false }); fShape([[x, y - 230 * s], [x + 30 * s, y - 120 * s], [x + 26 * s, y - 20 * s], [x, y - 10 * s]], fTint(c, -0.14), { line: false }); ctx.restore(); fRect(x - 4 * s, y - 14 * s, 8 * s, 18 * s, 2, fTint(c, -0.5), { line: false }); }
function fBush(x, y, s = 1, c = '#c94a3a') { for (const [dx, dy, r] of [[-40, -30, 42], [0, -46, 52], [42, -28, 40]]) fCirc(x + dx * s, y + dy * s, r * s, c, { line: false }); fRect(x - 82 * s, y - 30 * s, 164 * s, 30 * s, 0, c, { line: false }); fCirc(x + 10 * s, y - 14 * s, 60 * s, fTint(c, -0.15), { ry: 18 * s, line: false }); }
// layered rolling hills: layers = [{ y, c, amp, f, ph, d }] far -> near (d = parallax depth)
function fHills(layers) { for (const L of layers) fLayer(L.d ?? 0.2, () => { const P = [[-300, L.y]]; for (let x = -300; x <= W + 300; x += 40) P.push([x, L.y - Math.sin(x * (L.f ?? 0.004) + (L.ph ?? 0)) * (L.amp ?? 60) - Math.sin(x * (L.f ?? 0.004) * 2.3 + (L.ph ?? 0) * 1.7) * (L.amp ?? 60) * 0.3]); P.push([W + 300, H + 300], [-300, H + 300]); fShape(P, L.c, { line: false }); if (L.shade) { ctx.save(); trace(P, true); ctx.clip(); fCirc(L.shade[0], L.y + 140, 420, fTint(L.c, -0.1), { ry: 120, line: false }); ctx.restore(); } }); }
// falling leaves (or petals / snow): n, colours, the area they fall through
function fLeaves(n, cols, o = {}) { const x0 = o.x0 ?? 0, x1 = o.x1 ?? 1000, y0 = o.y0 ?? -40, y1 = o.y1 ?? 1100; for (let i = 0; i < n; i++) { const R = RNG('lf', o.key ?? 'l', i), u = mod(TT * R.r(0.05, 0.09) + R.f(), 1), x = R.r(x0, x1) + Math.sin(TT * 1.2 + i) * 40, y = lerp(y0, y1, u), rot = TT * R.r(0.8, 2) + i; fCirc(x, y, 10 * (o.s ?? 1), cols[i % cols.length], { ry: 18 * (o.s ?? 1), rot, line: false }); } }
// a soft glow (light): radial falloff, colour as 'r,g,b'
function fGlow(x, y, r, a = 1, c = '255,230,120') { if (a <= 0) return; ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${c},${0.8 * a})`); g.addColorStop(0.4, `rgba(${c},${0.3 * a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }

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
