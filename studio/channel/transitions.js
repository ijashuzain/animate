// =====================================================================
//  TRANSITIONS — scene changes beyond the shape morph, chosen per scene to match the topic and what is on screen.
//  A scene sets  tr: { kind, ...options }  (the transition INTO it); a piece may set CHANNEL.tr as a default
//  (an object, or a function (i) => object for scene i). No tr = the classic morph through paper (kind 'morph').
//  Each kind is fx(u, A, B, o): u 0..1 over [tc-d, tc+d], A/B = canvases with the outgoing/incoming scene,
//  o = the scene's tr options. Draw into ctx (screen space). Points like o.p are screen pixels (1920x1080).
//
//  kinds (see studio/transitions.md for when to use which):
//    fade, dip (to o.color), wipe (o.dir deg, o.edge), push (o.dir), whip (o.dir), slideOver (o.dir), zoom (into o.p),
//    shape (o.shape at o.p: circle|hex|drop|star|heart|diamond|leaf|cloud|square|gear|cell|shield), tiles (o.tile, o.order),
//    blinds (o.n, o.vertical), clock (o.p), doors (o.vertical), pageTurn, pixel, ink (noise bleed), shutter (o.p),
//    scatter (pieces fall away), flash (hard cut through white), spin
//  Edges are drawn in the piece's style: CHANNEL.trEdge(P, closed) if set; else sketchbook pencil, isometric hairline,
//  or a torn white paper strip with a soft shadow (cut-paper and the rest).
// =====================================================================
const TRS = {};
const trE = (u) => EZ.io(clamp(u));
function trTmp(i) { return layer(4 + i); }   // scratch canvases (morph.js owns layer(0) and layer(1))
function trEdge(P, closed = false, o = {}) {
  if (typeof CHANNEL !== 'undefined' && CHANNEL.trEdge) return CHANNEL.trEdge(P, closed, o);
  if (typeof gline === 'function' && typeof SK !== 'undefined') { gline(closed ? [...P, P[0]] : P, { w: 6, key: 'tredge' + (o.key ?? ''), second: true, amp: 1 }); return; }
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (typeof STYLE !== 'undefined' && STYLE.name === 'isometric') { trace(P, closed); ctx.strokeStyle = PAL.edge; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); return; }
  ctx.shadowColor = 'rgba(35,20,10,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
  trace(P, closed); ctx.strokeStyle = o.color ?? '#fffaf0'; ctx.lineWidth = o.w ?? 16; ctx.stroke();
  ctx.restore();
}
function trClip(P) { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.clip(); }
// ---- topic shapes (screen points around x, y with radius r)
function trShape(name, x, y, r, n = 64) {
  const P = [];
  const polar = (f) => { for (let i = 0; i < n; i++) { const a = i / n * TAU - Math.PI / 2, k = f(a); P.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]); } return P; };
  switch (name) {
    case 'hex': return Array.from({ length: 6 }, (_, i) => [x + Math.cos(i / 6 * TAU) * r, y + Math.sin(i / 6 * TAU) * r]);
    case 'square': return [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]];
    case 'diamond': return [[x, y - r], [x + r, y], [x, y + r], [x - r, y]];
    case 'star': return polar((a) => (Math.round((a + Math.PI / 2) / TAU * 10) % 2 ? 0.45 : 1) * 0.9 + 0.1 * Math.cos(5 * (a + Math.PI / 2)));
    case 'drop': for (let i = 0; i < n; i++) { const t = i / n * TAU; P.push([x + r * 0.8 * Math.sin(t) * Math.sin(t / 2) ** 1.2, y + r * (0.3 - Math.cos(t) * 0.95)]); } return P;
    case 'heart': for (let i = 0; i < n; i++) { const t = i / n * TAU; P.push([x + r * 16 * Math.sin(t) ** 3 / 17, y - r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17]); } return P;
    case 'leaf': for (let i = 0; i < n; i++) { const t = i / n * TAU; P.push([x + r * 0.55 * Math.sin(t) * (1 - 0.25 * Math.cos(t)), y - r * Math.cos(t)]); } return P.map(([px, py]) => [x + (px - x) * Math.cos(0.5) - (py - y) * Math.sin(0.5), y + (px - x) * Math.sin(0.5) + (py - y) * Math.cos(0.5)]);
    case 'cloud': return polar((a) => 0.82 + 0.18 * Math.abs(Math.sin(a * 3.5)));
    case 'gear': return polar((a) => (Math.cos(a * 10) > 0.2 ? 1 : 0.8));
    case 'cell': return polar((a) => 1 + 0.08 * Math.sin(a * 3 + 1) + 0.05 * Math.sin(a * 5));
    case 'shield': for (let i = 0; i < n; i++) { const t = i / n; const q = t < 0.5 ? t * 2 : (1 - t) * 2, s = t < 0.5 ? 1 : -1; P.push([x + s * r * 0.8 * Math.sin(q * Math.PI * 0.5 + 0.2) * (q < 0.7 ? 1 : (1 - q) / 0.3), y - r + q * r * 2]); } return P;
    default: return polar(() => 1);
  }
}
const coverR = (x, y) => Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y));
const shapeFit = (name) => ({ hex: 1.16, square: 1.0, diamond: 1.45, star: 2.3, drop: 1.6, heart: 1.5, leaf: 1.9, cloud: 1.25, gear: 1.25, cell: 1.05, shield: 1.6 }[name] ?? 1.02);

TRS.fade = (u, A, B) => { ctx.drawImage(A, 0, 0); ctx.globalAlpha = trE(u); ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1; };
TRS.dip = (u, A, B, o) => { const c = o.color ?? '#141c40'; ctx.drawImage(u < 0.5 ? A : B, 0, 0); ctx.globalAlpha = 1 - Math.abs(u - 0.5) * 2; ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; };
TRS.flash = (u, A, B, o) => { ctx.drawImage(u < 0.5 ? A : B, 0, 0); const k = Math.max(0, 1 - Math.abs(u - 0.5) * 5); if (k > 0) { ctx.globalAlpha = k; ctx.fillStyle = o.color ?? '#fffdf5'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } };
// a straight/torn/wavy edge sweeping across at angle dir (0 = left to right)
TRS.wipe = (u, A, B, o) => {
  const a = (o.dir ?? 0) * DEG, ca = Math.cos(a), sa = Math.sin(a), L = Math.abs(W * ca) + Math.abs(H * sa) + 200, cx = W / 2, cy = H / 2;
  const d = lerp(-L / 2, L / 2, trE(u)), R = RNG('trw', o.edge ?? 'torn'), edge = [];
  for (let i = 0; i <= 40; i++) { const s = lerp(-L, L, i / 40); let off = 0; if (o.edge === 'wave') off = Math.sin(i * 0.9 + u * 6) * 28; else if (o.edge === 'zigzag') off = i % 2 ? 26 : -26; else if (o.edge !== 'straight') off = R.n(16); edge.push([cx + ca * (d + off) - sa * s, cy + sa * (d + off) + ca * s]); }
  ctx.drawImage(A, 0, 0);
  ctx.save(); trClip([...edge, [edge[40][0] - ca * L * 2, edge[40][1] - sa * L * 2], [edge[0][0] - ca * L * 2, edge[0][1] - sa * L * 2]]); ctx.drawImage(B, 0, 0); ctx.restore();
  if (u > 0.01 && u < 0.99) trEdge(edge, false, { key: 'wipe' });
};
// the old scene slides out while the new one slides in behind it, as one move
TRS.push = (u, A, B, o) => { const a = (o.dir ?? 0) * DEG, k = trE(u), dx = Math.cos(a) * W, dy = Math.sin(a) * H; ctx.drawImage(A, k * dx, k * dy); ctx.drawImage(B, (k - 1) * dx, (k - 1) * dy); };
// a whip pan: the same as push, but fast in the middle with motion-blur copies
TRS.whip = (u, A, B, o) => {
  const a = (o.dir ?? 0) * DEG, k = u < 0.5 ? 0.5 * EZ.i3(u * 2) : 0.5 + 0.5 * EZ.o3(u * 2 - 1), dx = Math.cos(a) * W, dy = Math.sin(a) * H, blur = Math.sin(u * Math.PI) * 0.12;
  for (let j = 4; j >= 0; j--) { const kk = k - blur * j / 4; ctx.globalAlpha = j ? 0.18 : 1; ctx.drawImage(A, kk * dx, kk * dy); ctx.drawImage(B, (kk - 1) * dx, (kk - 1) * dy); }
  ctx.globalAlpha = 1;
};
// the new scene slides over the old one like a sheet of paper, with a shadow
TRS.slideOver = (u, A, B, o) => { const a = (o.dir ?? 180) * DEG, k = 1 - trE(u), dx = -Math.cos(a) * W * k, dy = -Math.sin(a) * H * k; ctx.drawImage(A, 0, 0); ctx.save(); ctx.shadowColor = 'rgba(30,20,10,0.4)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = -Math.cos(a) * 12; ctx.drawImage(B, dx, dy); ctx.restore(); };
// zoom into a point of the old scene (an object: a cell, a window, the hive door), coming out in the new one
TRS.zoom = (u, A, B, o) => {
  const [x, y] = o.p ?? [W / 2, H / 2], [bx, by] = o.pb ?? [W / 2, H / 2];
  if (u < 0.55) { const z = Math.exp(EZ.i3(u / 0.55) * Math.log(o.z ?? 9)); ctx.save(); ctx.translate(x, y); ctx.scale(z, z); ctx.translate(-x, -y); ctx.drawImage(A, 0, 0); ctx.restore(); if (u > 0.4) { ctx.globalAlpha = (u - 0.4) / 0.15; ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1; } }
  else { const z = lerp(0.6, 1, EZ.o3((u - 0.55) / 0.45)); ctx.drawImage(A, 0, 0); ctx.save(); ctx.translate(bx, by); ctx.scale(z, z); ctx.translate(-bx, -by); ctx.drawImage(B, 0, 0); ctx.restore(); }
};
// the new scene opens inside a growing topic shape placed on an object in the old scene
TRS.shape = (u, A, B, o) => {
  const name = o.shape ?? 'circle', [x, y] = o.p ?? [W / 2, H / 2], r = coverR(x, y) * shapeFit(name) * EZ.i2(clamp(u)), rot = (o.spin ?? 0.4) * u;
  ctx.drawImage(A, 0, 0); if (r < 1) return;
  const P = trShape(name, 0, 0, r).map(([px, py]) => [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]);
  ctx.save(); trClip(P); ctx.drawImage(B, 0, 0); ctx.restore();
  if (u < 0.97) trEdge(P, true, { key: 'shape' });
};
// a grid of tiles (hex for honeycomb, squares for pixels/tiles, triangles, circles) that pop open in order
TRS.tiles = (u, A, B, o) => {
  const tile = o.tile ?? 'hex', s = o.size ?? 110, order = o.order ?? 'diag', [px, py] = o.p ?? [0, 0];
  const cells = []; const R = RNG('trt', tile);
  if (tile === 'hex') { for (let i = -1; i * s * 1.5 < W + s * 2; i++) for (let j = -1; j * s * Math.sqrt(3) < H + s * 2; j++) cells.push([i * s * 1.5, j * s * Math.sqrt(3) + (i % 2 ? s * Math.sqrt(3) / 2 : 0)]); }
  else for (let x = s / 2; x < W + s; x += s) for (let y = s / 2; y < H + s; y += s) cells.push([x, y]);
  const keyOf = ([x, y]) => order === 'radial' ? Math.hypot(x - px, y - py) / coverR(px, py) : order === 'random' ? R.f() : order === 'row' ? (y / H) * 0.8 + (x / W) * 0.2 : (x / W + y / H) / 2;
  ctx.drawImage(A, 0, 0); ctx.save(); ctx.beginPath();
  for (const c of cells) {
    const k = clamp((u - keyOf(c) * 0.62) / 0.38); if (k <= 0) continue; const r = (tile === 'hex' ? s * 1.02 : s * 0.72) * EZ.back(k);
    const P = tile === 'hex' ? trShape('hex', c[0], c[1], r) : tile === 'circle' ? trShape('circle', c[0], c[1], r, 24) : tile === 'triangle' ? [[c[0], c[1] - r], [c[0] + r, c[1] + r * 0.8], [c[0] - r, c[1] + r * 0.8]] : trShape('square', c[0], c[1], r);
    ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath();
  }
  ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
};
// venetian blinds: n stripes that each open from their centre
TRS.blinds = (u, A, B, o) => { const n = o.n ?? 9, v = !!o.vertical, L = v ? W : H; ctx.drawImage(A, 0, 0); ctx.save(); ctx.beginPath(); for (let i = 0; i < n; i++) { const k = trE(clamp(u * 1.4 - i / n * 0.4)), c = (i + 0.5) * L / n, h = L / n * k / 2 + 0.5; if (v) ctx.rect(c - h, 0, h * 2, H); else ctx.rect(0, c - h, W, h * 2); } ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore(); };
// a clock-hand sweep around a point (time, history, cycles)
TRS.clock = (u, A, B, o) => {
  const [x, y] = o.p ?? [W / 2, H / 2], a0 = -Math.PI / 2, a1 = a0 + TAU * trE(u), R = coverR(x, y) + 20;
  ctx.drawImage(A, 0, 0); ctx.save(); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, R, a0, a1); ctx.closePath(); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
  if (u > 0.01 && u < 0.99) trEdge([[x, y], [x + Math.cos(a1) * R, y + Math.sin(a1) * R]], false, { key: 'clock' });
};
// two doors part from the middle (a reveal, an opening)
TRS.doors = (u, A, B, o) => {
  const k = trE(u), v = !!o.vertical; ctx.drawImage(B, 0, 0);
  ctx.save(); ctx.shadowColor = 'rgba(30,20,10,0.4)'; ctx.shadowBlur = 30;
  if (!v) { ctx.save(); ctx.beginPath(); ctx.rect(-k * W / 2, 0, W / 2, H); ctx.clip(); ctx.drawImage(A, -k * W / 2, 0); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + k * W / 2, 0, W / 2, H); ctx.clip(); ctx.drawImage(A, k * W / 2, 0); ctx.restore(); }
  else { ctx.save(); ctx.beginPath(); ctx.rect(0, -k * H / 2, W, H / 2); ctx.clip(); ctx.drawImage(A, 0, -k * H / 2); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + k * H / 2, W, H / 2); ctx.clip(); ctx.drawImage(A, 0, k * H / 2); ctx.restore(); }
  ctx.restore();
};
// a page turn: the old page folds back from the right edge (books, notebooks, diaries, history)
TRS.pageTurn = (u, A, B, o) => {
  const k = trE(u), fx = lerp(W + 40, -W * 0.35, k), flap = Math.min(W - fx, (W + 40 - fx) * 0.5);
  ctx.drawImage(B, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Math.max(0, fx), H); ctx.clip(); ctx.drawImage(A, 0, 0); ctx.restore();
  if (fx > -W * 0.3 && flap > 2) {
    ctx.save(); ctx.shadowColor = 'rgba(30,20,10,0.45)'; ctx.shadowBlur = 36; ctx.shadowOffsetX = -14;
    const g = ctx.createLinearGradient(fx - flap, 0, fx, 0); g.addColorStop(0, o.paper ?? '#e9dfc8'); g.addColorStop(1, '#fbf6ea');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(fx, 0); ctx.lineTo(fx - flap, 0 + 30); ctx.lineTo(fx - flap * 0.92, H - 10); ctx.lineTo(fx, H); ctx.closePath(); ctx.fill(); ctx.restore();
  }
};
// pixelate out, pixelate in (computing, games, data, screens)
TRS.pixel = (u, A, B, o) => {
  const src = u < 0.5 ? A : B, k = u < 0.5 ? u * 2 : (1 - u) * 2, bs = Math.max(1, Math.round(lerp(1, o.block ?? 64, EZ.i2(k))));
  if (bs <= 1) { ctx.drawImage(src, 0, 0); return; }
  const t = trTmp(0), tc = t.getContext('2d'), w = Math.ceil(W / bs), h = Math.ceil(H / bs);
  tc.imageSmoothingEnabled = true; tc.clearRect(0, 0, w, h); tc.drawImage(src, 0, 0, w, h);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(t, 0, 0, w, h, 0, 0, w * bs, h * bs); ctx.restore();
};
// an ink/paint bleed: the new scene seeps in through soft blotches (watercolour, ink, chemistry, smoke)
const TR_NOISE = {};
function trNoise(key) {
  if (TR_NOISE[key]) return TR_NOISE[key];
  const w = 192, h = 108, R = RNG('trn', key), v = new Float32Array(w * h);
  const oct = [[6, 0.5], [12, 0.3], [24, 0.2]];
  for (const [g, amp] of oct) { const gw = g + 1, gh = Math.ceil(g * h / w) + 1, grid = Array.from({ length: gw * gh }, () => R.f()); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const fx = x / w * g, fy = y / h * g * h / w, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, s = (t) => t * t * (3 - 2 * t); const a = grid[iy * gw + ix], b = grid[iy * gw + ix + 1], c = grid[(iy + 1) * gw + ix], d = grid[(iy + 1) * gw + ix + 1]; v[y * w + x] += amp * lerp(lerp(a, b, s(tx)), lerp(c, d, s(tx)), s(ty)); } }
  return (TR_NOISE[key] = { w, h, v });
}
TRS.ink = (u, A, B, o) => {
  const N = trNoise(o.key ?? 'ink'), m = trTmp(1), mc = m.getContext('2d'), img = mc.createImageData(N.w, N.h), th = lerp(-0.1, 1.1, trE(u)), soft = 0.06;
  for (let i = 0; i < N.v.length; i++) { const a = clamp((th - N.v[i]) / soft); img.data[i * 4 + 3] = a * 255; }
  mc.clearRect(0, 0, W, H); mc.putImageData(img, 0, 0);
  const t = trTmp(0), tc = t.getContext('2d'); tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, W, H); tc.drawImage(B, 0, 0);
  tc.globalCompositeOperation = 'destination-in'; tc.imageSmoothingEnabled = true; tc.drawImage(m, 0, 0, N.w, N.h, 0, 0, W, H); tc.globalCompositeOperation = 'source-over';
  ctx.drawImage(A, 0, 0); ctx.drawImage(t, 0, 0);
};
// a camera shutter closing on a point and opening on the next scene (photos, eyes, light, space telescopes)
TRS.shutter = (u, A, B, o) => {
  const [x, y] = o.p ?? [W / 2, H / 2], k = u < 0.5 ? 1 - EZ.i2(u * 2) : EZ.o2(u * 2 - 1), r = coverR(x, y) * 1.2 * k, rot = u * 2.2;
  ctx.fillStyle = o.color ?? '#1c1a22'; ctx.fillRect(0, 0, W, H);
  if (r > 1) { const P = trShape('hex', 0, 0, r).map(([px, py]) => [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]); ctx.save(); trClip(P); ctx.drawImage(u < 0.5 ? A : B, 0, 0); ctx.restore(); ctx.save(); ctx.strokeStyle = '#3a3640'; ctx.lineWidth = 6; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); const q = P[(i + 1) % 6]; ctx.lineTo(q[0] + (q[0] - x) * 4, q[1] + (q[1] - y) * 4); ctx.stroke(); } ctx.restore(); }
};
// the old scene breaks into pieces that fall away (breaking, endings, explosions, cracking an idea open)
TRS.scatter = (u, A, B, o) => {
  ctx.drawImage(B, 0, 0); const n = o.n ?? 12, m = Math.round(n * H / W), s = W / n, R = RNG('trs', n), k = EZ.i2(clamp(u * 1.15));
  for (let i = 0; i < n; i++) for (let j = 0; j < m + 1; j++) {
    const delay = R.f() * 0.35 + (j / m) * 0.2, q = clamp((k - delay) / (1 - delay)); if (q >= 1) continue;
    const x = i * s, y = j * s, dx = R.n(240) * q, dy = q * q * 1300, rot = R.n(2.5) * q;
    ctx.save(); ctx.translate(x + s / 2 + dx, y + s / 2 + dy); ctx.rotate(rot); ctx.drawImage(A, x, y, s, s, -s / 2, -s / 2, s, s); ctx.restore();
  }
};
// spin out, spin in (a turn of events, a cycle, a planet turning)
TRS.spin = (u, A, B, o) => { const src = u < 0.5 ? A : B, k = u < 0.5 ? 1 - EZ.i3(u * 2) : EZ.o3(u * 2 - 1), a = (u < 0.5 ? u * 2 : u * 2 - 2) * (o.turns ?? 0.5) * TAU; ctx.fillStyle = o.color ?? STYLE.paper; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(a); ctx.scale(Math.max(0.001, k), Math.max(0.001, k)); ctx.translate(-W / 2, -H / 2); ctx.drawImage(src, 0, 0); ctx.restore(); };
const TRANSITIONS = TRS;
