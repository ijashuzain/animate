// The spider film's world: two twigs, leaves, and the orb web as geometry (hub, frame, radii, spirals) that the film
// paints in thread by thread. Painted with kit/brush.js.
const W = {};
{
  const { lerp, clamp, noise } = K;
  // twigs: [control points], width; leaves along them
  W.twigs = [
    { cp: [[-40, 250], [180, 230], [420, 205], [640, 195], [760, 210]], w: 30, seed: 11 },
    { cp: [[560, 200], [640, 150], [700, 120], [760, 108]], w: 12, seed: 12 },
    { cp: [[1960, 640], [1760, 610], [1560, 560], [1400, 470], [1300, 380], [1260, 300]], w: 34, seed: 13 },
    { cp: [[1560, 560], [1620, 680], [1640, 800], [1610, 900]], w: 14, seed: 14 },
    { cp: [[360, 1130], [400, 960], [450, 800], [510, 660], [560, 560]], w: 16, seed: 15 },   // a stalk from below
  ];
  W.leaves = [[700, 120, 70, 26, -0.5, 21], [760, 220, 80, 30, 0.4, 22], [300, 215, 64, 24, -2.6, 23], [1300, 330, 76, 28, -1.9, 24], [1430, 470, 70, 26, 2.6, 25], [1640, 820, 84, 30, 1.2, 26], [1610, 900, 70, 26, 2.0, 27], [1780, 615, 72, 26, -2.9, 28], [560, 560, 66, 24, -0.8, 29], [430, 880, 70, 24, 3.6, 30]];
  W.twig = (ctx, tw, p = 1) => { const pts = Brush.curve(tw.cp, 10); Brush.stroke(ctx, pts, p, { w: tw.w, color: '#6a4a30', alpha: 0.62, profile: 'trunk', bristles: 7, seed: tw.seed, dry: 0.7 });
    Brush.stroke(ctx, pts.map(([x, y]) => [x, y - tw.w * 0.22]), p, { w: tw.w * 0.35, color: '#a8845a', alpha: 0.35, profile: 'trunk', bristles: 3, seed: tw.seed + 50 }); };
  W.leaf = (ctx, [x, y, l, wd, a, seed], p = 1) => { if (p <= 0) return; const tip = [x + Math.cos(a) * l * 2, y + Math.sin(a) * l * 2];
    Brush.wash(ctx, Brush.blob(lerp(x, tip[0], 0.5), lerp(y, tip[1], 0.5), l, wd, a, 26, seed, 0.06), { color: '#8ea860', alpha: 0.7 * p, seed });
    Brush.wash(ctx, Brush.blob(lerp(x, tip[0], 0.55), lerp(y, tip[1], 0.55) + wd * 0.25, l * 0.8, wd * 0.5, a, 20, seed + 1, 0.1), { color: '#4e6e3c', alpha: 0.45 * p, seed: seed + 1 });
    Brush.ink(ctx, [[x, y], [lerp(x, tip[0], 0.5), lerp(y, tip[1], 0.5) - 3], tip], p, { color: '#3e5a2c', w: 1.6, alpha: 0.6 }); };

  // ---- the web: hub, frame anchors, radii, the temporary spiral, the sticky spiral ----
  const H = [1000, 520];
  W.hub = H;
  W.frame = [[700, 215], [1000, 175], [1280, 330], [1420, 560], [1360, 820], [1040, 900], [720, 840], [580, 560]];   // anchor polygon
  const rayHit = (a) => { const d = [Math.cos(a), Math.sin(a)]; let best = 1e9;
    for (let i = 0; i < W.frame.length; i++) { const p = W.frame[i], q = W.frame[(i + 1) % W.frame.length], e = [q[0] - p[0], q[1] - p[1]], den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-6) continue;
      const t = ((p[0] - H[0]) * e[1] - (p[1] - H[1]) * e[0]) / den, u = ((p[0] - H[0]) * d[1] - (p[1] - H[1]) * d[0]) / den; if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t); }
    return best; };
  W.NR = 30;
  W.radii = []; for (let i = 0; i < W.NR; i++) { const a = -Math.PI / 2 + i / W.NR * Math.PI * 2 + noise(i, 3) * 0.04, r = rayHit(a); W.radii.push({ a, r, end: [H[0] + Math.cos(a) * r, H[1] + Math.sin(a) * r] }); }
  // a spiral as points where it crosses each radius: radius fraction f goes from f0 to f1 over turns
  const spiral = (f0, f1, turns) => { const out = []; const n = Math.round(turns * W.NR); for (let k = 0; k <= n; k++) { const i = k % W.NR, f = lerp(f0, f1, k / n), R = W.radii[i]; out.push([H[0] + Math.cos(R.a) * R.r * f, H[1] + Math.sin(R.a) * R.r * f]); } return out; };
  W.aux = spiral(0.12, 0.8, 5);            // temporary, from the middle outward, wide
  W.sticky = spiral(0.9, 0.3, 24);        // the trap, from the outside in, close
  W.frameLine = [...W.frame, W.frame[0]];
  // every anchor ends on a twig or the stalk
  W.anchors = [[W.frame[0], [690, 200]], [W.frame[1], [762, 110]], [W.frame[2], [1292, 362]], [W.frame[3], [1545, 548]], [W.frame[4], [1626, 780]], [W.frame[6], [446, 830]], [W.frame[7], [535, 610]]];

  // draw the web painted up to stage values (each 0..1): o = { bridge, y, frame, radii, aux, auxGone, sticky, dew, eat }
  W.web = (ctx, t, o = {}) => {
    const silk = { color: '#3a3a4a', w: 1.3, alpha: 0.75, wobble: 0.2 };
    if (o.frame) Brush.ink(ctx, W.frameLine, o.frame, { ...silk, w: 1.6 });
    // anchor lines from frame corners to the twigs
    if (o.frame) for (const [a, b] of W.anchors) Brush.line(ctx, a, b, o.frame, silk);
    const nr = (o.radii ?? 0) * W.NR;
    for (let i = 0; i < W.NR; i++) { const k = clamp(nr - i); if (k > 0) Brush.line(ctx, H, W.radii[i].end, k, silk); }
    if (o.aux && !(o.auxGone >= 1)) Brush.ink(ctx, W.aux, o.aux, { ...silk, alpha: 0.5 * (1 - (o.auxGone ?? 0)) });
    if (o.sticky) { const m = Math.max(2, Math.ceil(W.sticky.length * o.sticky)); Brush.ink(ctx, W.sticky.slice(0, m), 1, { ...silk, w: 1.1, alpha: 0.7 });
      // glue beads (and later dew): dots along the sticky thread
      ctx.save(); for (let i = 0; i < m - 1; i++) { const a = W.sticky[i], b = W.sticky[i + 1], n = 3; for (let k = 1; k <= n; k++) { const x = lerp(a[0], b[0], k / (n + 1)), y = lerp(a[1], b[1], k / (n + 1)), dew = o.dew ?? 0, r = 1.4 + dew * 2.4 * (0.6 + 0.8 * K.hash(i, k));
        ctx.fillStyle = dew > 0 ? `rgba(150,180,200,${0.5 + 0.3 * dew})` : 'rgba(90,90,110,0.55)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); if (dew > 0.3) { ctx.fillStyle = `rgba(255,255,250,${0.8 * dew})`; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.35, 0, 7); ctx.fill(); } } } ctx.restore(); }
  };
}

// ---- the spider (European garden spider), built from the user's reference sheet (refs/ref-sheet.webp) ----
// Construction (L = abdomen length): an egg abdomen, broadest toward the front, ochre with a lobed brown-violet band down
// the middle, a row of white spots and a short white cross bar; a small round hairy head-chest (0.45 L) with eyes and palps
// at the front; legs I and II long and forward, III short and sideways, IV back along the abdomen; legs pale cream with dark
// bands at the joints, spines, dark tips. Painted with washes + bristle strokes, no outlines.
{
  const { lerp, clamp, hash, noise } = K;
  const SP = { body: '#d4903e', mottle: '#9a5a2a', band: '#7e5040', white: '#f7efdc', head: '#a88660', headD: '#6e5038', leg: '#d9b27a', legBand: '#5e3418', ink: '#3a2414' };
  W.SP = SP;
  // two-bone IK: the knee bends to the side `side` (+1/-1) of the hip->foot line
  const ik = (h, f, l1, l2, side) => { let dx = f[0] - h[0], dy = f[1] - h[1], d = Math.hypot(dx, dy); const mx = (l1 + l2) * 0.98; if (d > mx) { f = [h[0] + dx / d * mx, h[1] + dy / d * mx]; dx = f[0] - h[0]; dy = f[1] - h[1]; d = mx; }
    const a = Math.atan2(dy, dx), c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), k = a + side * Math.acos(c); return [[h[0] + Math.cos(k) * l1, h[1] + Math.sin(k) * l1], f]; };
  // one leg as a painted chain: pale stroke tapering to the tip, dark bands at the joints, spines, a dark tip
  W.leg = (ctx, pts, w, seed, alpha = 1) => {
    const R = Brush.resample(pts, 40).pts, L = Brush.resample(pts, 2).len;
    Brush.stroke(ctx, R, 1, { w, color: SP.leg, alpha: 0.97 * alpha, profile: 'tip', rough: 0.12, bristles: 2, seed, dry: 0.2 });
    Brush.ink(ctx, R.map(([x2, y2]) => [x2 + w * 0.22, y2 + w * 0.22]), 0.8, { color: SP.legBand, w: Math.max(0.6, w * 0.16), alpha: 0.35 * alpha, wobble: 0.2 });
    for (const [a, b] of [[0.27, 0.33], [0.43, 0.47], [0.63, 0.69], [0.84, 0.89]]) Brush.stroke(ctx, R.slice(Math.floor(a * 39), Math.ceil(b * 39) + 1), 1, { w: w * (0.95 - a * 0.55), color: SP.legBand, alpha: 0.82 * alpha, profile: 'leaf', bristles: 0, seed: seed + a * 100, rough: 0.1 });
    Brush.stroke(ctx, R.slice(35), 1, { w: w * 0.35, color: SP.legBand, alpha: 0.8 * alpha, profile: 'tip', bristles: 0, seed: seed + 9 });
    ctx.save(); ctx.strokeStyle = Brush.rgba(SP.ink, 0.55 * alpha); ctx.lineWidth = Math.max(0.6, w * 0.09); ctx.lineCap = 'round';
    const n = Math.max(4, Math.round(L / (w * 1.3)));
    for (let k = 1; k < n; k++) { const i = Math.floor(k / n * 38), p = R[i], q = R[i + 1], dx = q[0] - p[0], dy = q[1] - p[1], dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl, sd = k % 2 ? 1 : -1, ww = w * (1 - k / n * 0.6) * 0.5;
      const bx = p[0] - uy * sd * ww, by = p[1] + ux * sd * ww, l = w * (0.5 + 0.3 * hash(k, seed)); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + (ux * 0.8 - uy * sd * 0.6) * l, by + (uy * 0.8 + ux * sd * 0.6) * l); ctx.stroke(); }
    ctx.restore(); };
  const egg = (cx, cy, L, Wd, rot, n = 34) => { const out = []; for (let i = 0; i < n; i++) { const th = i / n * Math.PI * 2, y = Math.sin(th) * L / 2, x = Math.cos(th) * Wd / 2 * (1 + 0.14 * Math.sin(th)); out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return out; };
  const hairs = (ctx, poly, len, alpha, seed) => { ctx.save(); ctx.strokeStyle = Brush.rgba(SP.ink, alpha); ctx.lineWidth = 0.8; ctx.lineCap = 'round'; let cx = 0, cy = 0; for (const [x, y] of poly) { cx += x; cy += y; } cx /= poly.length; cy /= poly.length;
    poly.forEach(([x, y], i) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, l = len * (0.6 + 0.8 * hash(i, seed)); ctx.beginPath(); ctx.moveTo(x - dx / d * l * 0.3, y - dy / d * l * 0.3); ctx.lineTo(x + dx / d * l, y + dy / d * l); ctx.stroke(); }); ctx.restore(); };
  // the abdomen's markings in local coordinates (front = +y), drawn into the current transform
  const abdomenTop = (ctx, L, seed) => {
    const Wd = L * 0.8, poly = egg(0, 0, L, Wd, 0);
    Brush.wash(ctx, poly, { color: SP.body, alpha: 0.95, seed, jitter: L * 0.012 });
    for (let i = 0; i < 26; i++) { const a = hash(i, seed) * 6.28, r = Math.sqrt(hash(i, seed + 1)) * 0.42; Brush.wash(ctx, Brush.blob(Math.cos(a) * r * Wd, Math.sin(a) * r * L * 0.9, L * 0.05, L * 0.035, a, 10, seed + i, 0.2), { color: SP.mottle, alpha: 0.35, seed: seed + i, jitter: 1 }); }
    // the folium: a lobed band down the middle, wider toward the front
    const band = []; for (let k = 0; k <= 12; k++) { const y = lerp(-0.44, 0.42, k / 12) * L, w0 = L * (0.04 + 0.21 * Math.sin(Math.PI * (0.08 + 0.84 * k / 12)) ** 0.8) * (1 + 0.3 * Math.sin(k * 2.3)); band.push([w0, y]); }
    Brush.wash(ctx, [...band, ...band.slice().reverse().map(([x, y]) => [-x, y])], { color: SP.band, alpha: 0.62, seed: seed + 50, jitter: L * 0.01 });
    // white spots: the midline row and the cross bar
    const dot = (x, y, r) => Brush.wash(ctx, Brush.blob(x, y, r, r * 1.15, 0, 12, seed + x * 7 + y, 0.15), { color: SP.white, alpha: 0.95, seed: seed + 3, jitter: 0.6 });
    [[-0.36, 0.035], [-0.24, 0.045], [-0.1, 0.05], [0.04, 0.055], [0.17, 0.045], [0.3, 0.035]].forEach(([y, r]) => dot(0, y * L, r * L));
    for (const s of [-1, 1]) [[0.1, 0.035], [0.19, 0.03], [0.28, 0.025]].forEach(([x, r]) => dot(s * x * L, 0.1 * L, r * L));
    for (let i = 0; i < 10; i++) dot((hash(i, seed + 7) - 0.5) * Wd * 0.8, (hash(i, seed + 8) - 0.5) * L * 0.8, L * 0.014);
    // a soft light from the upper left, a darker rim, short hairs round the edge
    Brush.wash(ctx, Brush.blob(-Wd * 0.12, -L * 0.1, Wd * 0.3, L * 0.3, 0, 18, seed + 9, 0.1), { color: '#fff4dc', alpha: 0.22, seed: seed + 9 });
    hairs(ctx, poly, L * 0.05, 0.3, seed);
  };
  const headTop = (ctx, L, seed) => { const poly = Brush.blob(0, 0, L * 0.2, L * 0.24, 0, 22, seed, 0.06);
    Brush.wash(ctx, poly, { color: SP.head, alpha: 0.95, seed, jitter: 1 }); Brush.wash(ctx, Brush.blob(0, -L * 0.03, L * 0.07, L * 0.15, 0, 14, seed + 1, 0.1), { color: SP.headD, alpha: 0.4, seed: seed + 1 });
    hairs(ctx, poly, L * 0.04, 0.35, seed + 2);
    for (const s of [-1, 1]) { eEllB(ctx, s * L * 0.05, L * 0.2, L * 0.025, '#1a0e08'); eEllB(ctx, s * L * 0.02, L * 0.235, L * 0.016, '#1a0e08'); }
    for (const s of [-1, 1]) Brush.wash(ctx, Brush.blob(s * L * 0.045, L * 0.28, L * 0.035, L * 0.05, 0, 10, seed + 4, 0.1), { color: SP.headD, alpha: 0.85, seed }); };
  const eEllB = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,250,235,0.7)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, 7); ctx.fill(); };
  // rest feet in local coordinates (right side; front = +y), leg lengths (in L), knee side
  const FEET = [[0.62, 1.6], [1.05, 1.08], [0.98, -0.05], [0.66, -1.22]], LEN = [2.05, 1.8, 1.25, 1.8];
  // TOP VIEW. (x, y) = the waist; L = abdomen length; o.a = heading (radians, the way the head points; PI/2 = down);
  // o.walk = gait phase (advances while walking: alternate tetrapod steps), o.feet = optional world foot targets [8]
  W.spider = (ctx, t, x, y, L, o = {}) => {
    const a = o.a ?? Math.PI / 2, seed = o.seed ?? 31, walk = o.walk, rot = a - Math.PI / 2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const legW = L * 0.085, hip = (i, s) => [s * L * 0.12, L * (0.36 - i * 0.075)];
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
      let f = [s * FEET[i][0] * L, FEET[i][1] * L];
      if (walk != null) { const ph = walk * Math.PI * 2 + ((i + (s > 0 ? 1 : 0)) % 2) * Math.PI, st = Math.sin(ph); f = [f[0] + s * Math.max(0, Math.cos(ph)) * L * 0.06, f[1] + st * L * 0.18]; }
      if (o.feet) { const wf = o.feet[i + (s > 0 ? 4 : 0)]; if (wf) { const dx = wf[0] - x, dy = wf[1] - y; f = [dx * Math.cos(-rot) - dy * Math.sin(-rot), dx * Math.sin(-rot) + dy * Math.cos(-rot)]; } }
      const h = hip(i, s), tot = LEN[i] * L, [k, ft] = ik(h, f, tot * 0.45, tot * 0.55, i < 2 ? -s : s);
      const mid = [lerp(k[0], ft[0], 0.5) + s * L * 0.06, lerp(k[1], ft[1], 0.5)];
      W.leg(ctx, Brush.curve([h, k, mid, ft], 6), legW * (i === 2 ? 0.9 : 1), seed + i * 10 + (s > 0 ? 5 : 0), o.alpha ?? 1);
    }
    ctx.save(); ctx.translate(0, -L * 0.48); abdomenTop(ctx, L, seed); ctx.restore();
    ctx.save(); ctx.translate(0, L * 0.2); headTop(ctx, L, seed + 60); ctx.restore();
    ctx.restore();
  };
  // SIDE VIEW. (x, y) = the point under the body on the ground/thread line; o.dir = 1 faces right; o.lift 0..1 raises the
  // abdomen (releasing silk; returns the spinneret point); o.hang = true hangs under the line (walking a thread)
  W.spiderSide = (ctx, t, x, y, L, o = {}) => {
    const dir = o.dir ?? 1, seed = o.seed ?? 41, lift = o.lift ?? 0, walk = o.walk;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, o.hang ? -1 : 1);
    const legW = L * 0.075, hipY = -L * 0.5;
    const FS = [[1.55, 0], [0.8, 0], [-0.35, 0], [-1.25, 0]], KN = [[0.78, -1.2], [0.36, -1.28], [-0.12, -1.12], [-0.55, -1.12]];
    const drawLegs = (far) => { for (let i = 0; i < 4; i++) { let fx = FS[i][0] * L + (far ? L * 0.12 : 0);
        if (walk != null) { const ph = walk * Math.PI * 2 + ((i + (far ? 1 : 0)) % 2) * Math.PI; fx += Math.sin(ph) * L * 0.16; }
        const lifted = walk != null ? Math.max(0, Math.cos(walk * Math.PI * 2 + ((i + (far ? 1 : 0)) % 2) * Math.PI)) * L * 0.08 : 0;
        const h = [L * (0.32 - i * 0.07), hipY], k = [KN[i][0] * L + (far ? L * 0.1 : 0), KN[i][1] * L + (far ? L * 0.05 : 0)], ank = [lerp(k[0], fx, 0.55), lerp(k[1], -lifted, 0.5) - L * 0.05];
        W.leg(ctx, Brush.curve([h, k, ank, [fx, -lifted]], 6), legW * (far ? 0.85 : 1), seed + i * 10 + (far ? 5 : 0), far ? 0.55 : 1); } };
    drawLegs(true);
    // abdomen: a big globe up behind the head-chest; lift rotates it up about the waist
    const ang = 0.62 + lift * 0.75, ax = -Math.cos(ang) * L * 0.55, ay = hipY + Math.sin(ang) * L * 0.55;
    ctx.save(); ctx.translate(0, hipY); ctx.rotate(ang); ctx.translate(-L * 0.62, 0);
    const poly = egg(0, 0, L * 1.05, L * 0.9, Math.PI / 2);
    Brush.wash(ctx, poly, { color: SP.body, alpha: 0.95, seed, jitter: L * 0.012 });
    for (let i = 0; i < 22; i++) { const px = (hash(i, seed) - 0.5) * L * 0.8, py = (hash(i, seed + 1) - 0.5) * L * 0.65; Brush.wash(ctx, Brush.blob(px, py, L * 0.05, L * 0.035, i, 10, seed + i, 0.2), { color: SP.mottle, alpha: 0.35, seed: seed + i, jitter: 1 }); }
    for (let i = 0; i < 9; i++) { const u = i / 8, px = lerp(-L * 0.4, L * 0.38, u), py = -L * 0.33 * Math.sin(Math.PI * (0.15 + 0.7 * u)) - L * 0.04; Brush.wash(ctx, Brush.blob(px, py, L * (0.035 + 0.02 * hash(i, 3)), L * 0.03, 0, 10, seed + 20 + i, 0.2), { color: SP.white, alpha: 0.9, seed: seed + 20 + i, jitter: 0.5 }); }
    Brush.wash(ctx, Brush.blob(-L * 0.05, L * 0.2, L * 0.4, L * 0.16, 0, 18, seed + 9, 0.1), { color: SP.mottle, alpha: 0.3, seed: seed + 9 });
    hairs(ctx, poly, L * 0.05, 0.3, seed);
    // spinnerets at the rear underside
    Brush.wash(ctx, Brush.blob(-L * 0.5, L * 0.12, L * 0.05, L * 0.04, 0, 10, seed + 30, 0.1), { color: SP.headD, alpha: 0.8, seed });
    const m = ctx.getTransform(), sp = new DOMPoint(-L * 0.53, L * 0.13).matrixTransform(m);
    ctx.restore();
    // head-chest, low in front; eyes at the very front top; palps
    const hp = Brush.blob(L * 0.22, hipY + L * 0.02, L * 0.26, L * 0.17, 0.1, 22, seed + 60, 0.06);
    Brush.wash(ctx, hp, { color: SP.head, alpha: 0.95, seed: seed + 60, jitter: 1 }); hairs(ctx, hp, L * 0.04, 0.35, seed + 61);
    eEllB(ctx, L * 0.42, hipY - L * 0.08, L * 0.026, '#1a0e08');
    W.leg(ctx, Brush.curve([[L * 0.44, hipY + L * 0.05], [L * 0.56, hipY + L * 0.1], [L * 0.6, hipY + L * 0.22]], 4), legW * 0.6, seed + 70);
    drawLegs(false);
    ctx.restore();
    return { spinneret: [sp.x, sp.y] };
  };

  // ---- the moth (large yellow underwing), from the reference: mottled brown forewings with a dark kidney spot, yellow
  // hindwings with a dark band near the edge, a furry striped body, thin antennae. TOP VIEW. o.a heading, o.open 0..1
  // (wings spread; folded = a roof over the body), o.flap phase (wing beat: the span foreshortens)
  W.moth = (ctx, t, x, y, s, o = {}) => {
    const a = o.a ?? -Math.PI / 2, seed = o.seed ?? 51, open = o.open ?? 1, flap = o.flap != null ? 0.35 + 0.65 * Math.abs(Math.cos(o.flap * Math.PI)) : 1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);   // local: head = -y
    for (const sd of [-1, 1]) { ctx.save(); ctx.scale(sd * flap, 1);
      const sweep = lerp(1.32, 0.0, open);   // folded wings sweep back over the body like a roof
      ctx.rotate(sweep);
      const closed = (cp) => { const c = Brush.curve([...cp, cp[0], cp[1]], 8); return c.slice(8, c.length - 8).map(([px, py]) => [px * s, py * s]); };
      // hindwing (under): a yellow fan from the body, a dark band near its outer edge
      const hw = closed([[0.06, 0.02], [0.5, 0.06], [0.78, 0.3], [0.72, 0.62], [0.42, 0.86], [0.12, 0.8], [0.05, 0.45]]);
      Brush.wash(ctx, hw, { color: '#e8b040', alpha: 0.92, seed: seed + 1, jitter: 1.2, grainStep: 60 });
      for (let k = 0; k < 7; k++) Brush.ink(ctx, [[0.07 * s, 0.1 * s], [lerp(0.7, 0.18, k / 6) * s, lerp(0.3, 0.78, k / 6) * s]], 1, { color: '#a07020', w: 0.7, alpha: 0.3 });
      Brush.stroke(ctx, Brush.curve([[0.66, 0.22], [0.64, 0.56], [0.4, 0.75], [0.16, 0.7]].map(([px, py]) => [px * s, py * s]), 8), 1, { w: s * 0.08, color: '#3a2618', alpha: 0.72, profile: 'brush', bristles: 3, seed: seed + 2 });
      // forewing (over): leading edge nearly level from the shoulder to a rounded tip, trailing edge back to the body
      const fw = closed([[0.05, -0.16], [0.4, -0.24], [0.82, -0.2], [0.98, -0.06], [0.9, 0.16], [0.55, 0.3], [0.2, 0.32], [0.06, 0.16]]);
      Brush.wash(ctx, fw, { color: '#9a7458', alpha: 0.95, seed: seed + 3, jitter: 1.2, grainStep: 50 });
      for (let k = 0; k < 18; k++) Brush.wash(ctx, Brush.blob(lerp(0.15, 0.85, hash(k, seed)) * s, lerp(-0.14, 0.22, hash(k, seed + 1)) * s, s * 0.06, s * 0.035, hash(k, 4) * 3, 10, seed + k, 0.25), { color: k % 3 ? '#7a5640' : '#c09070', alpha: 0.4, seed: seed + k, jitter: 1, edge: false, grain: false });
      Brush.wash(ctx, Brush.blob(0.56 * s, 0.0, s * 0.075, s * 0.05, 0.5, 12, seed + 30, 0.25), { color: '#3a2618', alpha: 0.7, seed: seed + 30 });
      hairs(ctx, fw, s * 0.03, 0.25, seed + 5);
      ctx.restore(); }
    // body: furry, striped; head with eyes; antennae
    const body = Brush.blob(0, s * 0.26, s * 0.12, s * 0.52, 0, 22, seed + 40, 0.05);
    Brush.wash(ctx, body, { color: '#8a6a4a', alpha: 0.95, seed: seed + 40 });
    for (let k = 0; k < 6; k++) Brush.stroke(ctx, [[-s * 0.1, s * (0.2 + k * 0.1)], [s * 0.1, s * (0.2 + k * 0.1)]], 1, { w: s * 0.025, color: '#5a4030', alpha: 0.5, profile: 'even', bristles: 0, seed: seed + k });
    hairs(ctx, body, s * 0.04, 0.35, seed + 41);
    Brush.wash(ctx, Brush.blob(0, -s * 0.24, s * 0.09, s * 0.08, 0, 14, seed + 42, 0.1), { color: '#7a5a3e', alpha: 0.95, seed: seed + 42 });
    for (const sd of [-1, 1]) { eEllB(ctx, sd * s * 0.07, -s * 0.28, s * 0.03, '#1a0e08'); Brush.ink(ctx, Brush.curve([[sd * s * 0.04, -s * 0.31], [sd * s * 0.15, -s * 0.55], [sd * s * 0.3, -s * 0.72]], 6), 1, { color: '#4a3020', w: 1.2, alpha: 0.8 }); }
    ctx.restore();
  };
}
