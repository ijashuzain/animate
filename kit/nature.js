// kit/nature.js — reusable nature props for the flat-vector look (y up). Units are the caller's (screen-like px at h = 1080).
// Nature.fish, Nature.school, Nature.whale, Nature.jelly, Nature.bubbles (screen), Nature.cloud (one soft shape),
// Nature.bird (a gull, flapping), Nature.palm, Nature.tree (round crown), Nature.rain (screen streaks), Nature.waves.
// Storms: Nature.stormPuffs / stormCloud / stormMask (cumulonimbus), Nature.boltPath / bolt (branching lightning),
// Nature.oak (a broad lone tree). See the storm section at the end.
const Nature = {};
// a small fish facing +x (dir -1 flips); profile face
Nature.fish = (t, x, y, s, col, seed = 0, dir = 1) => {
  const w = Math.sin(t * 9 + seed) * 0.25;
  P.at(x, y, 0, s * dir, s, () => {
    P.poly([[-40, 0], [-64, 18 + w * 20], [-64, -18 + w * 20]], P.mixc(col, '#000000', 0.18));
    P.lit(P.blobPts(0, 0, 46, 24, 12, 0.02, seed + 3), col, { d: 0.2, rim: 'rgba(255,255,255,0.35)' });
    P.smooth([[-6, 18], [14, 30], [20, 14]], P.mixc(col, '#000000', 0.12));
    Cast.profileFace(t, 22, 6, 9, { mood: 'smile', seed, mouth: [1.6, -0.9], nose: false });
  });
};
// a school crossing from x0 to x1 between t0 and t1 around height y
Nature.school = (t, t0, t1, x0, x1, y, n = 14, cols = ['#ffb25a', '#ff7f6e'], s = 0.6, seed = 1) => {
  const u = K.clamp((t - t0) / (t1 - t0)); if (u <= 0 || u >= 1) return;
  const dir = x1 > x0 ? 1 : -1;
  for (let i = 0; i < n; i++) Nature.fish(t, K.lerp(x0, x1, u) + (K.hash(i, seed) * 2 - 1) * 220 + Math.sin(t * 2 + i) * 14, y + (K.hash(i, seed + 1) * 2 - 1) * 90, s * (0.8 + 0.4 * K.hash(i, seed + 2)), cols[i % cols.length], i + seed, dir);
};
// the whale's head is at +x; dir -1 faces it left (always set dir to the way it travels)
Nature.whale = (t, x, y, s, col = '#2d5580', dir = 1) => P.at(x, y, Math.sin(t * 0.6) * 0.04, s * dir, s, () => {
  const tail = Math.sin(t * 1.6) * 30, dark = P.mixc(col, '#0a1a30', 0.4);
  P.smooth([[-380, 10], [-200, 70], [120, 90], [340, 40], [400, -10], [300, -60], [0, -70], [-260, -30], [-420, 30 + tail * 0.3]], P.lin(0, 90, 0, -70, P.mixc(col, '#ffffff', 0.15), dark));
  P.poly([[-400, 20 + tail * 0.4], [-520, 90 + tail], [-470, 10 + tail * 0.5], [-520, -60 + tail]], dark);
  P.smooth([[60, -40], [140, -40], [120, -110 + Math.sin(t * 1.2) * 10], [70, -80]], dark);
  P.circle(300, 10, 9, '#0c1c30');
});
Nature.jelly = (t, x, y, s, seed = 0, col = '255,170,225') => {
  const p = Math.sin(t * 2.4 + seed);
  P.at(x, y, 0, s * (1 + p * 0.06), s * (1 - p * 0.06), () => {
    P.glow(0, 10, 90, col, 0.35);
    for (let i = 0; i < 5; i++) P.ribbon([[-24 + i * 12, -6], [-24 + i * 12 + Math.sin(t * 3 + i) * 8, -60], [-24 + i * 12 + Math.sin(t * 3 + i + 1) * 12, -110]], [5, 4, 1], `rgba(${col},0.6)`);
    P.smooth([[-40, -4], [-34, 26], [0, 42], [34, 26], [40, -4], [0, 2]], `rgba(${col},0.78)`);
  });
};
// bubbles rising across the whole screen (screen space); box [x0, x1, yTop, yBottom] limits them (screen px)
Nature.bubbles = (t, n, seed, a = 1, speed = 120, box = [0, 1920, 0, 1080]) => P.screen((ctx) => {
  const [x0, x1, yt, yb] = box, hgt = yb - yt + 100;
  for (let i = 0; i < n; i++) {
    const x = x0 + K.hash(i, seed) * (x1 - x0) + Math.sin(t * 1.5 + i) * 18, y = yb + 50 - ((K.hash(i, seed + 1) * hgt + t * speed * (0.6 + K.hash(i, seed + 2))) % hgt), r = 3 + 10 * K.hash(i, seed + 3);
    ctx.globalAlpha = a * 0.55; ctx.strokeStyle = '#d8f6ff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke();
    ctx.globalAlpha = a * 0.5; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, 6.3); ctx.fill();
  }
});
// a fluffy cloud as one soft shape: darker underside layer, body, soft highlights (no per-blob outlines)
Nature.cloud = (x, y, s, seed, col = '#ffffff') => {
  const pts = [[-120, 0, 70], [-50, 30, 90], [40, 40, 100], [120, 10, 75], [0, -10, 110]], dark = P.mixc(col, '#3a3470', 0.28);
  P.at(x, y, 0, s, s, () => {
    P.blob(0, -36, 200, 52, dark, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy - 16, r, r * 0.8, dark, { seed: seed + cx, n: 10, w: 0.08 });
    P.blob(0, -22, 196, 50, col, { seed, n: 10, w: 0.05 }); for (const [cx, cy, r] of pts) P.blob(cx, cy + 2, r * 0.95, r * 0.76, col, { seed: seed + cx, n: 10, w: 0.08 });
    for (const [cx, cy, r] of pts) P.blob(cx - r * 0.2, cy + r * 0.38, r * 0.5, r * 0.22, 'rgba(255,255,255,0.16)', { seed: seed + cx + 1, n: 8, w: 0.15 });
  });
};
// a gull, flapping, flying toward dir
Nature.bird = (t, x, y, s, seed = 0, dir = 1, col = '#ffffff') => {
  const f = Math.sin(t * 11 + seed);
  P.at(x, y, 0, s * dir, s, () => {
    P.ribbon([[-34, 6 + f * 22], [-12, 2], [0, 0]], [10, 8, 6], col); P.ribbon([[0, 0], [14, 2], [36, 8 + f * 22]], [6, 8, 10], P.mixc(col, '#8a9ab0', 0.2));
    P.blob(2, 0, 16, 8, col, { seed }); P.circle(16, 3, 6, col); P.poly([[20, 4], [30, 1], [20, 0]], '#ffb03a'); P.circle(18, 5, 1.6, '#222');
  });
};
// a palm tree on the ground at (x, y), height h (units), swaying
Nature.palm = (t, x, y, h, seed = 0) => {
  const lean = Math.sin(seed * 3) * 0.25, sway = Math.sin(t * 1.4 + seed) * 0.04, tx = x + Math.sin(lean) * h, ty = y + Math.cos(lean) * h;
  P.ribbon([[x, y], [x + Math.sin(lean) * h * 0.5, y + h * 0.5], [tx, ty]], [h * 0.09, h * 0.075, h * 0.06], P.lin(x - 10, 0, x + 10, 0, '#b07a46', '#7a5030'));
  for (let k = 0; k < 7; k++) { const a = -2.6 + k * 0.85 + sway * 3 + Math.sin(t * 2 + k + seed) * 0.05, L = h * (0.55 + 0.1 * (k % 2)); P.ribbon([[tx, ty], [tx + Math.cos(a) * L * 0.5, ty + Math.sin(a) * L * 0.5 + L * 0.18], [tx + Math.cos(a) * L, ty + Math.sin(a) * L - L * 0.12]], [h * 0.09, h * 0.07, 2], k % 2 ? '#3f9f55' : '#2f8a48'); }
  P.circle(tx, ty - h * 0.03, h * 0.05, '#6e4a26');
};
// a round-crowned tree (forest filler)
Nature.tree = (t, x, y, h, col = '#3f8f45', seed = 0) => {
  P.ribbon([[x, y], [x, y + h * 0.5]], [h * 0.08, h * 0.06], '#6e4a2a');
  P.lit(P.blobPts(x + Math.sin(t + seed) * h * 0.01, y + h * 0.66, h * 0.36, h * 0.32, 10, 0.12, seed), P.lin(x, y + h, x, y + h * 0.35, P.mixc(col, '#ffffff', 0.2), col), { d: 0.25, shade: 'rgba(10,40,20,0.3)', rim: 'rgba(230,255,190,0.3)' });
};
// rain streaks across a screen rectangle
Nature.rain = (t, a, box = [0, 1920, 0, 1080], seed = 5) => { if (a <= 0) return; P.screen((ctx) => { const [x0, x1, y0, y1] = box; ctx.strokeStyle = `rgba(220,235,255,${0.45 * a})`; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; for (let i = 0; i < 70; i++) { const x = x0 + ((K.hash(i, seed) * (x1 - x0) + t * 120) % (x1 - x0)), y = y0 + ((K.hash(i, seed + 1) * (y1 - y0) + t * 900) % (y1 - y0)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 40); ctx.stroke(); } }); };
// ---------- the faceted nature set (after the user's style library: faceted rocks/mountains, flat flowers, teal desert plants) ----------
// a faceted rock: a polygon split into lit / mid / shade planes (light from the upper left); o.col, o.seed, o.n points
Nature.rock = (x, y, w, h, o = {}) => {
  P.circle(x, y + 1, w * 0.58, 'rgba(30,15,10,0.18)', { ry: h * 0.1 });
  const col = o.col ?? '#9a8a7e', seed = o.seed ?? 1, n = o.n ?? 7, lit = P.mixc(col, '#fff4e4', 0.28), shade = P.mixc(col, '#2a1a24', 0.32), pts = [];
  for (let i = 0; i < n; i++) { const a = Math.PI * (i / (n - 1)), r = 0.82 + 0.22 * K.hash(i, seed); pts.push([x - Math.cos(a) * w * 0.5 * r, y + Math.sin(a) * h * r]); }
  P.poly(pts, col); const c = [x - w * 0.08, y + h * 0.45];
  for (let i = 0; i < n - 1; i++) { const tri = [pts[i], pts[i + 1], c], mx = (pts[i][0] + pts[i + 1][0]) / 2; P.poly(tri, mx < x - w * 0.1 ? lit : mx > x + w * 0.15 ? shade : col); }
};
// a canyon wall / mesa block: stacked bands (cliff = hard, slope = soft), faceted lit and shade sides, ledges, cracks.
// bands: [[height, colour, 'cliff'|'slope'], ...] from the bottom up; side: 1 the lit face looks right, -1 left
Nature.mesa = (x, y, w, bands, o = {}) => {
  let yy = y, inset = 0; const side = o.side ?? 1, seed = o.seed ?? 2;
  bands.forEach(([bh, col, kind], i) => {
    const step = kind === 'slope' ? bh * 0.9 : bh * 0.12, x0 = x - w / 2 + inset * (side < 0 ? 1 : 0.4), x1 = x + w / 2 - inset * (side > 0 ? 1 : 0.4);
    const top0 = x0 + (side < 0 ? step : step * 0.3), top1 = x1 - (side > 0 ? step : step * 0.3);
    const lit = P.mixc(col, '#ffe8c8', 0.22), shade = P.mixc(col, '#3a1424', 0.35);
    P.poly([[x0, yy], [x1, yy], [top1, yy + bh], [top0, yy + bh]], col);
    if (side > 0) P.poly([[x1 - w * 0.18, yy], [x1, yy], [top1, yy + bh], [top1 - w * 0.12, yy + bh]], lit); else P.poly([[x0, yy], [x0 + w * 0.18, yy], [top0 + w * 0.12, yy + bh], [top0, yy + bh]], lit);
    P.poly([[x0 + w * 0.2, yy], [x0 + w * 0.42, yy], [top0 + w * 0.3, yy + bh], [top0 + w * 0.16, yy + bh]], shade);
    if (kind === 'cliff') for (let k = 0; k < 3; k++) { const cx = x0 + (x1 - x0) * (0.25 + 0.25 * k) + (K.hash(k, seed + i) - 0.5) * 20; P.ribbon([[cx, yy + bh * 0.05], [cx + 4, yy + bh * 0.5], [cx - 2, yy + bh * 0.95]], 3, shade); }
    P.rect(top0, yy + bh - 3, top1 - top0, 6, lit);
    yy += bh; inset += step;
  });
  return yy;
};
// a faceted mountain with a snow cap
Nature.peak = (x, y, w, h, o = {}) => {
  const col = o.col ?? '#7f86a6', lit = P.mixc(col, '#ffffff', 0.25), shade = P.mixc(col, '#1a1430', 0.3), top = [x + (o.lean ?? 0) * w, y + h];
  P.poly([[x - w / 2, y], [x + w / 2, y], top], col); P.poly([[x - w / 2, y], [x - w * 0.05, y], top], lit); P.poly([[x + w * 0.15, y], [x + w / 2, y], top], shade);
  if (o.snow !== false) { const sh = h * 0.28; P.poly([[top[0] - w * 0.14, top[1] - sh], [top[0] - w * 0.04, top[1] - sh * 0.7], [top[0] + w * 0.03, top[1] - sh * 0.95], [top[0] + w * 0.12, top[1] - sh * 0.8], top], '#f4f6fb'); }
};
// a faceted pine (stacked triangles, lit and shade halves)
Nature.pine = (t, x, y, h, o = {}) => {
  const col = o.col ?? '#3f8f55', lit = P.mixc(col, '#ffffff', 0.2), shade = P.mixc(col, '#0a2a1a', 0.3), sway = Math.sin(t * 1.2 + x * 0.01) * h * 0.01;
  P.rect(x - h * 0.04, y, h * 0.08, h * 0.2, '#7a5032');
  for (let k = 0; k < 3; k++) { const b = y + h * (0.15 + k * 0.24), wd = h * (0.42 - k * 0.1), tp = [x + sway * (k + 1), b + h * 0.38]; P.poly([[x - wd, b], [x, b], tp], lit); P.poly([[x, b], [x + wd, b], tp], shade); }
};
// a saguaro cactus (teal, like the canyon references)
Nature.cactus = (x, y, h, o = {}) => {
  const col = o.col ?? '#3e8a74', shade = P.mixc(col, '#0a2a24', 0.3), w = h * 0.16;
  P.circle(x, y + 1, w * 1.6, 'rgba(30,15,10,0.18)', { ry: w * 0.25 }); P.rect(x - w / 2, y, w, h, P.lin(x - w / 2, 0, x + w / 2, 0, P.mixc(col, '#ffffff', 0.15), col), { r: w / 2 }); P.rect(x + w * 0.05, y, w * 0.45, h - w * 0.3, shade, { r: w / 3 });
  for (let i = 0; i < 3; i++) P.ribbon([[x - w * 0.2 + i * w * 0.2, y + w * 0.3], [x - w * 0.2 + i * w * 0.2, y + h - w * 0.4]], 0.8, 'rgba(10,40,30,0.25)');
  for (const [k, ay, ah] of [[-1, 0.35, 0.35], [1, 0.5, 0.3]]) { const ax = x + k * w * 1.25; P.rect(Math.min(x, ax) + (k > 0 ? w * 0.3 : 0), y + h * ay, w * 1.0, w * 0.6, col, { r: w * 0.3 }); P.rect(ax - w * 0.32, y + h * ay, w * 0.64, h * ah, col, { r: w * 0.32 }); }
};
// a round desert shrub (dark teal, a lighter top)
Nature.shrub = (x, y, r, o = {}) => { const col = o.col ?? '#3a6e66'; P.circle(x, y + 1, r * 1.05, 'rgba(30,15,10,0.18)', { ry: r * 0.12 }); P.lit(P.blobPts(x, y + r * 0.55, r, r * 0.62, 11, 0.12, o.seed ?? 3), P.lin(0, y + r * 1.2, 0, y, P.mixc(col, '#ffffff', 0.12), P.mixc(col, '#0a1a18', 0.15)), { d: 0.25, shade: 'rgba(10,20,20,0.3)', rim: 'rgba(230,255,240,0.3)', light: [-0.45, 0.9] }); P.blob(x - r * 0.2, y + r * 0.8, r * 0.55, r * 0.3, P.mixc(col, '#ffffff', 0.18), { seed: (o.seed ?? 3) + 1 }); };
// a flower: o.kind 'daisy' | 'tulip'; o.col
Nature.flower = (t, x, y, h, o = {}) => {
  const sw = Math.sin(t * 1.6 + x) * h * 0.04, hx = x + sw, hy = y + h, col = o.col ?? '#e8487a';
  P.ribbon([[x, y], [x + sw * 0.5, y + h * 0.5], [hx, hy]], h * 0.04, '#4f9a4a'); P.at(x + sw * 0.3, y + h * 0.4, 0.7, 1, 1, () => P.blob(h * 0.12, 0, h * 0.13, h * 0.05, '#5aa84f', { seed: 2 }));
  if (o.kind === 'tulip') { P.smooth([[hx - h * 0.1, hy], [hx - h * 0.12, hy + h * 0.16], [hx - h * 0.04, hy + h * 0.1], [hx, hy + h * 0.2], [hx + h * 0.04, hy + h * 0.1], [hx + h * 0.12, hy + h * 0.16], [hx + h * 0.1, hy]], col); return; }
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; P.circle(hx + Math.cos(a) * h * 0.1, hy + Math.sin(a) * h * 0.1, h * 0.065, i % 2 ? col : P.mixc(col, '#1a1424', 0.12), { ry: h * 0.04, rot: a }); }
  P.circle(hx, hy, h * 0.06, P.rad(hx - h * 0.02, hy + h * 0.02, h * 0.07, '#ffe27a', '#e8a02a'));
};
Nature.mushroom = (x, y, h, o = {}) => { const col = o.col ?? '#e2483a'; P.circle(x, y + 1, h * 0.4, 'rgba(30,15,10,0.18)', { ry: h * 0.06 }); P.rect(x - h * 0.12, y, h * 0.24, h * 0.55, P.lin(x - h * 0.12, 0, x + h * 0.12, 0, '#fbf4e6', '#ddd0b8'), { r: h * 0.06 }); P.lit([[x - h * 0.45, y + h * 0.5], [x - h * 0.3, y + h * 0.92], [x, y + h], [x + h * 0.3, y + h * 0.92], [x + h * 0.45, y + h * 0.5]], col, { d: 0.22, shade: 'rgba(60,10,10,0.3)', rim: 'rgba(255,230,220,0.4)', light: [-0.45, 0.9] }); for (const [dx, dy] of [[-0.2, 0.72], [0.12, 0.85], [0.25, 0.62]]) P.circle(x + dx * h, y + dy * h, h * 0.06, '#ffffff'); };
Nature.grass = (t, x, y, h, o = {}) => { const col = o.col ?? '#5aa84f'; for (let i = 0; i < 5; i++) { const a = -0.5 + i * 0.25 + Math.sin(t * 2 + x + i) * 0.06; P.ribbon([[x + (i - 2) * h * 0.06, y], [x + Math.sin(a) * h * 0.5 + (i - 2) * h * 0.08, y + h * (0.6 + 0.08 * (i % 2))], [x + Math.sin(a) * h + (i - 2) * h * 0.1, y + h * (0.9 + 0.1 * (i % 3))]], [h * 0.07, h * 0.05, 1], i % 2 ? col : P.mixc(col, '#0a3a1a', 0.2)); } };
Nature.stump = (x, y, w, o = {}) => { P.rect(x - w / 2, y, w, w * 0.6, P.lin(x - w / 2, 0, x + w / 2, 0, '#a8693e', '#7a4a2a')); P.circle(x, y + w * 0.6, w / 2, '#e2b98a', { ry: w * 0.14 }); P.ctx.save(); P.ctx.strokeStyle = '#b8875a'; P.ctx.lineWidth = 1.2; for (const r of [0.15, 0.28, 0.4]) { P.ctx.beginPath(); P.ctx.ellipse(x, y + w * 0.6, w * r, w * r * 0.28, 0, 0, 6.3); P.ctx.stroke(); } P.ctx.restore(); };
Nature.log = (x, y, w, o = {}) => { P.rect(x - w / 2, y, w, w * 0.22, P.lin(0, y, 0, y + w * 0.22, '#7a4a2a', '#a8693e'), { r: w * 0.05 }); P.circle(x + w / 2, y + w * 0.11, w * 0.06, '#e2b98a', { ry: w * 0.11 }); };
// ---------- storms (from the lightning film; the user's references: films/lightning/refs) ----------
// Nature.stormPuffs(cx, base, o) -> the puffs [x, y, r, edge] of a cumulonimbus (flat base, tower, anvil top);
//   o.w half-width of the base, o.top the top height, o.grow 0..1 (the tower builds), o.anvil 0..1, o.seed
// Nature.stormCloud(t, cx, base, o)  draws it as ONE soft shape: dark underside layer + body + soft highlights, crescent
//   shadows tucked under the upper puffs (no outlines). o.col: { top, mid, under } (slate-violet by default), o.puffs to reuse. Wide and mound-like: anvil 0.4-0.6; classic: 1
// Nature.stormMask(puffs)  traces the cloud's outline as one path (for P.clip: cutaways, glows)
Nature.stormPuffs = (cx, base, o = {}) => {
  // a towering cumulus (the user's chosen reference): a broad flat-bottomed base, and several billowing towers of
  // different heights and widths, each a column of round lobes ending in a cauliflower crown; never symmetric
  const w = o.w ?? 3000, grow = o.grow ?? 1, seed = o.seed ?? 3, Hmax = (o.top ?? 10000) - base, H = Hmax * Math.max(0.15, grow);
  const TOW = o.towers ?? [[-0.08, 0.42, 1.0], [0.42, 0.34, 0.74], [-0.52, 0.3, 0.58], [0.8, 0.2, 0.4], [-0.86, 0.18, 0.3]];
  const puffs = [];
  // the base: a row of wide low lobes along the whole width
  for (let i = 0; i <= 8; i++) { const x = cx - w * 0.92 + (i / 8) * w * 1.84, r = w * (0.17 + 0.05 * K.hash(i, seed + 2)); puffs.push([x, base + r * 0.55, r, 1]); }
  TOW.forEach(([dx, tw, th], k) => {
    const x0 = cx + dx * w, wid = tw * w, top = base + H * th * (0.92 + 0.16 * K.hash(k, seed));
    let y = base + wid * 0.5, i = 0;
    while (y < top - wid * 0.35) { const u = (y - base) / Math.max(1, top - base), r = wid * K.lerp(0.62, 0.48, u) * (0.9 + 0.2 * K.hash(i, seed + k * 7));
      const side = i % 2 ? 1 : -1; puffs.push([x0 + side * wid * 0.22 + (K.hash(i, seed + k) - 0.5) * wid * 0.2, y, r * 1.15 * (0.9 + 0.2 * K.hash(i * 3, seed + k)), 1]);
      y += r * 1.0; i++; }
    // filler down the middle of the tower so the shape has no holes between its lobes
    for (let fy = base + wid * 0.4; fy < top - wid * 0.6; fy += wid * 0.4) puffs.push([x0, fy, wid * 0.5, 0]);
    // the crown: three or four rounded heads, the middle one highest
    const cr = wid * 0.42; for (let j = -1; j <= 1; j++) puffs.push([x0 + j * cr * 0.85 + (K.hash(j + 3, seed + k) - 0.5) * cr * 0.3, top - cr * (j === 0 ? 0.55 : 0.95), cr * (j === 0 ? 1.05 : 0.8), 1]);
  });
  // a flat base: a band along the bottom (wound counter-clockwise like the lobes so the mask is their union)
  const poly = [[cx - w * 0.95, base], [cx + w * 0.95, base], [cx + w * 0.95, base + w * 0.2], [cx - w * 0.95, base + w * 0.2]];
  let Htop = base; for (const p of puffs) Htop = Math.max(Htop, p[1] + p[2]);
  const HH = Htop - base;
  // the half-width at height u (for things placed inside the cloud): the widest lobe edge at that height
  const half = (u) => { const y = base + u * HH; let m = 0; for (const [x, py, r] of puffs) { const d = Math.abs(y - py); if (d < r) m = Math.max(m, Math.abs(x - cx) + Math.sqrt(r * r - d * d)); } return m * 0.92; };
  puffs.poly = poly; Object.assign(puffs, { half, base, H: HH, cx });
  puffs.inside = (x, y, margin = 0) => puffs.some(([px, py, r]) => Math.hypot(x - px, y - py) < r - margin);
  return puffs;
};
Nature.stormMask = (puffs) => { const ctx = P.ctx; ctx.beginPath(); if (puffs.poly) { puffs.poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); } for (const [x, y, r] of puffs) { ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.92, 0, 0, Math.PI * 2); } };
Nature.stormCloud = (t, cx, base, o = {}) => {
  // the look of a towering anime cumulus (the user's chosen reference): a bright rim on the upper-left of every lobe,
  // soft white swooshes inside, bright at the top fading to a deeper base; one shape, no outlines
  const puffs = o.puffs ?? Nature.stormPuffs(cx, base, o), col = Object.assign({ top: '#a9b0d8', mid: '#6f76ad', under: '#3f4378' }, o.col ?? {});
  const H = puffs.H, half = puffs.half, top = base + H, seed = o.seed ?? 3, rim = o.rim ?? P.mixc(col.top, '#ffffff', 0.45);
  let rMax = 0; for (const p of puffs) rMax = Math.max(rMax, p[2]);
  // the lobes: the silhouette's puffs plus a few big interior ones, drawn top to bottom (lower lobes are nearer)
  const lobes = puffs.lobes ?? (() => { const out = puffs.map(([x, y, r]) => [x, y, r]);
    for (let row = 0, y = top - rMax * 1.2; o.interior && y > base + rMax * 0.6; row++) { const u = (y - base) / H, hw = half(u) * 0.62, n = Math.max(1, Math.round(hw * 2 / (rMax * 1.5)));
      for (let i = 0; i <= n; i++) { const lx = cx - hw + (i / n) * hw * 2 + (K.hash(i, row + seed) - 0.5) * rMax * 0.6, ly = y + (K.hash(i + 5, row + seed) - 0.5) * rMax * 0.4, lr = rMax * (0.6 + 0.35 * K.hash(i, row * 3 + seed)); if (!puffs.inside || puffs.inside(lx, ly, lr * 0.9)) out.push([lx, ly, lr]); }
      y -= rMax * 1.15; }
    out.sort((p, q) => q[1] - p[1]); puffs.lobes = out; return out; })();
  const body = P.lin(0, base, 0, top, col.under, col.mid, col.top), rimG = P.lin(0, base, 0, top, P.mixc(rim, col.under, 0.5), rim);
  P.clip(() => Nature.stormMask(puffs), () => P.rect(cx - 1e6, base - 1e5, 2e6, H + 2e5, body));
  // each lobe: a bright disc, then the body colour over it moved down-right, so only a crisp crescent rim shows on its
  // upper-left edge; the body is one gradient for all lobes, so they merge into one cloud
  lobes.forEach(([x, y, r], i) => { const lit = K.hash(i, seed + 61) > 0.3 || y > top - H * 0.25; if (lit) P.circle(x, y, r, rimG, { ry: r * 0.92 }); P.circle(x + (lit ? r * 0.09 : 0), y - (lit ? r * 0.12 : 0), r * 0.99, body, { ry: r * 0.91 }); });
  // soft swooshes: a few wide pale arcs inside the body
  lobes.forEach(([x, y, r], i) => { if (y > base + H * 0.3 && K.hash(i, seed + 51) > 0.7) P.crescent(P.blobPts(x, y - r * 0.2, r * 0.8, r * 0.5, 18, 0, 1), r * 0.05, -r * 0.18, 'rgba(255,255,255,0.10)'); });
  P.clip(() => Nature.stormMask(puffs), () => P.rect(cx - 1e6, base - 1e5, 2e6, 1e5 + H * 0.08, P.lin(0, base, 0, base + H * 0.08, P.rgba(col.under, 0.9), P.rgba(col.under, 0))));
  const hw0 = half(0.02); for (let i = 0; i <= 8; i++) { const x = cx - hw0 * 0.92 + (i / 8) * hw0 * 1.84 + (K.hash(i, seed + 30) - 0.5) * rMax * 0.4, r = rMax * (0.5 + 0.45 * K.hash(i, seed + 31)); P.circle(x, base + r * 0.3, r, P.lin(0, base - r * 0.3, 0, base + r, P.mixc(col.under, '#000000', 0.1), P.mixc(col.under, col.mid, 0.45)), { ry: r * 0.62 }); }
  return puffs;
};
// ---------- lightning ----------
// Nature.boltPath(seed, [x0, y0], [x1, y1], step)  a real-looking channel: one main path that jags down in steps of about
//   `step`, with side branches that fork and fade (the user's branching-bolt reference). -> { main: [[x,y]...], branches: [{ at, pts }] }
// Nature.bolt(path, o)  draws it: o.reveal 0..1 (how far down the main path has grown, branches grow with it),
//   o.core / o.glow colours, o.px core width in screen px, o.alpha, o.branchA (branch brightness), o.fade (branches fade to 0)
Nature.boltPath = (seed, a, b, step) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), n = Math.max(4, Math.round(L / step)), nx = -dy / L, ny = dx / L, main = [];
  let off = 0;
  for (let i = 0; i <= n; i++) { const u = i / n; if (i > 0 && i < n) off = off * 0.55 + (K.hash(i, seed) - 0.5) * step * 1.6; else off = 0;
    const pull = 1 - Math.pow(u, 6); main.push([a[0] + dx * u + nx * off * pull, a[1] + dy * u + ny * off * pull]); }
  const branches = [];
  for (let i = 1; i < n - 2; i++) if (K.hash(i, seed + 7) > 0.62) {
    const side = K.hash(i, seed + 8) > 0.5 ? 1 : -1, len = 3 + Math.floor(K.hash(i, seed + 9) * 5), pts = [main[i]];
    let ang = Math.atan2(dy, dx) + side * (0.45 + K.hash(i, seed + 10) * 0.5);
    for (let k = 0; k < len; k++) { ang += (K.hash(k + i * 13, seed + 11) - 0.5) * 0.8; const s = step * (0.85 - k * 0.06); const p = pts[pts.length - 1]; pts.push([p[0] + Math.cos(ang) * s, p[1] + Math.sin(ang) * s]); }
    branches.push({ at: i, pts });
  }
  return { main, branches, n };
};
Nature.bolt = (path, o = {}) => {
  const m = P.ctx.getTransform(), rev = K.clamp(o.reveal ?? 1), core = o.core ?? '#f6f2ff', glow = o.glow ?? '150,140,255', a = o.alpha ?? 1, px = (o.px ?? 3) / Math.hypot(m.a, m.b), ba = o.branchA ?? 0.8;
  if (a <= 0 || rev <= 0) return;
  const upto = (pts, u) => { const f = u * (pts.length - 1), i = Math.floor(f), out = pts.slice(0, i + 1); if (i < pts.length - 1) { const p = pts[i], q = pts[i + 1], k = f - i; out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]); } return out; };
  const draw = (pts, w, al) => { if (pts.length < 2) return; P.alpha(al * a, () => { P.ribbon(pts, w * 6, `rgba(${glow},0.18)`); P.ribbon(pts, w * 2.6, `rgba(${glow},0.45)`); P.ribbon(pts, w, core); }); };
  const mainPts = upto(path.main, rev), head = rev * path.n;
  for (const br of path.branches) if (br.at < head) { const u = K.clamp((head - br.at) / (br.pts.length - 1)); draw(upto(br.pts, u), px * 0.5, ba * (o.fade ?? 1)); }
  draw(mainPts, px, 1);
  return mainPts[mainPts.length - 1];
};
// ---------- the lone tree (the lightning film's strike target; the user's strike reference) ----------
// Nature.oak(t, x, y, h, o)  a broad round tree: short trunk with two limbs, a crown of clustered puffs drawn as one soft
//   shape (dark underside + body + light top puffs); o.col, o.dark, o.light, o.seed, o.sway
Nature.oak = (t, x, y, h, o = {}) => {
  const col = o.col ?? '#3f7a4a', dark = o.dark ?? '#26503a', light = o.light ?? '#5b9a5e', seed = o.seed ?? 4, sw = Math.sin(t * 1.3 + seed) * (o.sway ?? 0.01) * h;
  const cw = h * 0.42, cy = y + h * 0.62, puffs = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = 0.55 + 0.35 * K.hash(i, seed); puffs.push([x + Math.cos(a) * cw * rr * 0.95 + sw * (0.5 + Math.sin(a) * 0.5), cy + Math.sin(a) * h * 0.26 * rr, h * (0.13 + 0.06 * K.hash(i, seed + 1))]); }
  for (let i = 0; i < 6; i++) puffs.push([x + (K.hash(i, seed + 2) - 0.5) * cw + sw, cy + (K.hash(i, seed + 3) - 0.3) * h * 0.2, h * 0.17]);
  P.circle(x, y, h * 0.36, 'rgba(10,15,20,0.25)', { ry: h * 0.04 });
  P.ribbon([[x, y], [x + h * 0.01, y + h * 0.3], [x + sw * 0.5, y + h * 0.5]], [h * 0.11, h * 0.08, h * 0.05], P.lin(x - h * 0.05, 0, x + h * 0.05, 0, '#5a3a2a', '#3a2418'));
  for (const s of [-1, 1]) P.ribbon([[x + s * h * 0.01, y + h * 0.33], [x + s * h * 0.12, y + h * 0.48], [x + s * h * 0.2 + sw, y + h * 0.56]], [h * 0.04, h * 0.03, h * 0.02], '#4a2e20');
  for (const [px, py, r] of puffs) P.circle(px, py - r * 0.25, r, dark);
  for (const [px, py, r] of puffs) P.circle(px, py, r * 0.92, col);
  puffs.forEach(([px, py, r], i) => { if (py > cy - h * 0.02 && K.hash(i, seed + 5) > 0.35) P.circle(px - r * 0.2, py + r * 0.25, r * 0.5, light, { ry: r * 0.38 }); });
  return [x + sw * 0.6, cy + h * 0.33];   // the crown's top (where a streamer starts)
};
