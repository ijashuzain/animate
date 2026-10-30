// The two sea windows, rebuilt from the user's references (refs/sea-crinoids, sea-redwall, sea-cambrian): a real underwater
// view in depth. The camera glides forward along a sandy channel between reef banks; everything is placed on a sea floor
// in perspective and fades into blue water with distance (fog painted in slices, far to near); light comes from the
// surface above (shimmer, rays, caustics on the sand); marine snow drifts past.
// Cambrian sea (~515 Ma): microbial mats, archaeocyathid cups, tube sponges, algae, trilobites, Hallucigenia, Anomalocaris,
// a school of small swimming arthropods. Redwall sea (~340 Ma): a crinoid meadow, bryozoan and coral clumps, horn
// corals, brachiopod beds, straight-shelled nautiloids (orthocones), a school of fish, an early shark.
// World units: metres (cartoon sizes for the small animals). Each species draws standing on (0, 0), y up.
const SEA = { f: 1000, H0: 420, ch: 1.15 };
// many short strokes in one path (pinnules, rings, polyps)
SEA.strokes = (segs, w, col) => { const c = P.ctx; c.beginPath(); for (const [a, b, x, y] of segs) { c.moveTo(a, b); c.lineTo(x, y); } c.lineWidth = w; c.lineCap = 'round'; c.strokeStyle = col; c.stroke(); };

// ---------- species ----------
// a crinoid (sea lily): a ringed stalk, a plated cup, a crown of feathery arms that rise and curl outward (refs/sea-crinoids)
SEA.crinoid = (t, h, col, seed, px) => {
  const sw = Math.sin(t * 0.7 + seed) * 0.05, lean = (K.hash(seed, 2) - 0.5) * 0.3, H = h * 0.72;
  const at = (u) => [Math.sin((lean + sw) * u) * H * u * 0.8, H * u];
  const stalk = []; for (let i = 0; i <= 10; i++) stalk.push(at(i / 10));
  const sc = P.mixc(col, '#4a3a30', 0.5);
  P.circle(0, 0, h * 0.09, 'rgba(10,30,40,0.25)', { ry: h * 0.02 });
  P.ribbon(stalk, stalk.map((_, i) => h * (0.048 - 0.018 * i / 10)), sc);
  if (px > 110) { const segs = []; for (let i = 1; i < 34; i++) { const [x, y] = at(i / 34), w = h * (0.024 - 0.009 * i / 34); segs.push([x - w, y, x + w, y + h * 0.004]); } SEA.strokes(segs, h * 0.006, 'rgba(30,15,10,0.45)'); P.ribbon(stalk.map(([x, y]) => [x - h * 0.01, y]), h * 0.008, 'rgba(255,240,200,0.25)'); }
  const [tx, ty] = at(1), tilt = (lean + sw) * 0.8, n = px > 70 ? 22 : 12;
  const arm = (k, back) => { const sk = n > 1 ? K.lerp(-1, 1, k / (n - 1)) : 0, a0 = tilt + sk * (back ? 0.28 : 0.4), L = h * (0.34 + 0.1 * K.hash(k, seed + 3)) * (back ? 0.9 : 1), pts = [[tx, ty + h * 0.05]]; let x = tx, y = ty + h * 0.05;
    for (let j = 1; j <= 10; j++) { const u = j / 10, a = a0 + sk * 0.75 * u * u + Math.sin(t * 1.1 + seed + k * 0.4) * 0.05 * u; x += Math.sin(a) * L / 10; y += Math.cos(a) * L / 10; pts.push([x, y]); }
    const W = [0.03, 0.055, 0.07, 0.075, 0.074, 0.07, 0.064, 0.055, 0.044, 0.03, 0.012].map((w) => w * h), c = back ? P.mixc(col, '#2a2040', 0.4) : P.mixc(col, '#fff4d0', (k % 3) * 0.08);
    P.ribbon(pts, W, c);
    if (px > 150) { const segs = []; for (let j = 1; j < 10; j++) { const [px0, py0] = pts[j], [qx, qy] = pts[j + 1], dx = qx - px0, dy = qy - py0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = W[j] * 0.5; for (const f of [0, 0.5]) { const mx = px0 + dx * f, my = py0 + dy * f; segs.push([mx + nx * w, my + ny * w, mx + dx * 0.45, my + dy * 0.45], [mx - nx * w, my - ny * w, mx + dx * 0.45, my + dy * 0.45]); } }
      SEA.strokes(segs, h * 0.005, P.mixc(c, '#3a1a10', 0.35)); P.ribbon(pts.slice(0, 9), h * 0.007, back ? 'rgba(0,0,0,0)' : 'rgba(255,245,220,0.4)'); }
  };
  for (let k = 0; k < n; k += 2) arm(k, true);
  P.lit(P.blobPts(tx, ty + h * 0.035, h * 0.06, h * 0.05, 10, 0.06, seed), P.mixc(col, '#6a4020', 0.35), { d: 0.25, light: [-0.2, 1] });
  for (let k = 1; k < n; k += 2) arm(k, false);
};
// a rounded clump of bryozoan / coral: dark underside, the body as knobs, soft top highlights, polyp dots (one soft shape)
SEA.clump = (t, r, col, seed, px) => {
  const knobs = []; for (let i = 0; i < 13; i++) { const bx = (K.hash(i, seed) - 0.5) * 1.7 * r, top = Math.sqrt(Math.max(0, 1 - (bx / r) ** 2 * 0.7)), by = r * (0.15 + 0.55 * top * K.hash(i, seed + 1)), br = r * (0.26 + 0.18 * K.hash(i, seed + 2)); knobs.push([bx, by, br]); }
  knobs.sort((a, b) => a[1] - b[1]);
  P.circle(0, 0, r * 1.15, 'rgba(10,30,40,0.3)', { ry: r * 0.18 });
  const dark = P.mixc(col, '#1a1030', 0.45), light = P.mixc(col, '#fff0e0', 0.3);
  for (const [x, y, rr] of knobs) P.circle(x + rr * 0.1, y - rr * 0.18, rr, dark);
  for (const [x, y, rr] of knobs) P.circle(x, y, rr * 0.9, col);
  for (const [x, y, rr] of knobs) P.circle(x - rr * 0.2, y + rr * 0.3, rr * 0.45, light, { ry: rr * 0.3 });
  if (px > 60) { const segs = []; for (let i = 0; i < 70; i++) { const [x, y, rr] = knobs[i % knobs.length], a = K.hash(i, seed + 7) * 6.28, d = K.hash(i, seed + 8) * rr * 0.8; segs.push([x + Math.cos(a) * d, y + Math.sin(a) * d, x + Math.cos(a) * d + r * 0.01, y + Math.sin(a) * d]); } SEA.strokes(segs, r * 0.045, P.mixc(col, '#3a1a20', 0.3)); }
};
// branching coral / bryozoan: forked rounded branches with lighter tips
SEA.branchy = (t, h, col, seed) => { const sway = Math.sin(t * 0.8 + seed) * 0.03;
  const br = (x, y, a, len, d) => { const ex = x + Math.sin(a + sway) * len, ey = y + Math.cos(a + sway) * len; P.ribbon([[x, y], [ex, ey]], [len * 0.28, len * 0.22], P.mixc(col, '#2a1a30', 0.25 - d * 0.06)); if (d >= 3) { P.circle(ex, ey, len * 0.13, P.mixc(col, '#fff0d8', 0.35)); return; } for (const k of [-1, 1]) br(ex, ey, a + k * (0.35 + 0.25 * K.hash(d * 5 + k, seed)), len * 0.75, d + 1); };
  P.circle(0, 0, h * 0.4, 'rgba(10,30,40,0.25)', { ry: h * 0.06 }); for (let i = 0; i < 3; i++) br((i - 1) * h * 0.12, 0, (i - 1) * 0.35, h * 0.34, 0); };
// tube sponges: a cluster of upright tubes with dark openings, lit on one side (refs/sea-cambrian)
SEA.tubes = (t, h, col, seed) => { const n = 3 + Math.floor(K.hash(seed, 1) * 3);
  P.circle(0, 0, h * 0.3, 'rgba(10,30,40,0.28)', { ry: h * 0.05 });
  for (let i = 0; i < n; i++) { const bx = (i - (n - 1) / 2) * h * 0.13, th = h * (0.5 + 0.5 * K.hash(i, seed + 2)), lean = (K.hash(i, seed + 3) - 0.5) * 0.4 + Math.sin(t * 0.6 + i) * 0.02, w = h * (0.1 + 0.04 * K.hash(i, seed + 4));
    const pts = []; for (let j = 0; j <= 6; j++) { const u = j / 6; pts.push([bx + Math.sin(lean) * th * u * u, th * u]); }
    P.ribbon(pts, w, P.mixc(col, '#0a1a2a', 0.3)); P.ribbon(pts.map(([x, y]) => [x - w * 0.18, y]), w * 0.5, col); P.ribbon(pts.map(([x, y]) => [x - w * 0.3, y]), w * 0.12, P.mixc(col, '#e0fff8', 0.35));
    const [ex, ey] = pts[6]; P.circle(ex, ey, w * 0.55, P.mixc(col, '#e0fff8', 0.25), { ry: w * 0.2 }); P.circle(ex, ey - w * 0.02, w * 0.4, '#0a1a24', { ry: w * 0.13 }); }
};
// archaeocyathids: orange ribbed cups on a porous mound (refs/sea-cambrian)
SEA.cups = (t, h, col, seed, px) => {
  P.lit(P.blobPts(0, h * 0.12, h * 0.45, h * 0.16, 12, 0.12, seed), P.mixc(col, '#c8a040', 0.4), { d: 0.25, light: [-0.2, 1] });
  const n = 3 + Math.floor(K.hash(seed, 5) * 3);
  for (let i = 0; i < n; i++) { const cx = (i - (n - 1) / 2) * h * 0.18 + (K.hash(i, seed) - 0.5) * h * 0.06, ch = h * (0.35 + 0.4 * K.hash(i, seed + 1)), w0 = ch * 0.18, w1 = ch * 0.42, by = h * 0.15;
    P.poly([[cx - w0, by], [cx + w0, by], [cx + w1, by + ch], [cx - w1, by + ch]], P.lin(cx - w1, 0, cx + w1, 0, P.mixc(col, '#fff0c0', 0.3), P.mixc(col, '#6a2a10', 0.35)));
    if (px > 80) { const segs = []; for (let k = 1; k < 6; k++) { const u = k / 6; segs.push([cx - w0 + (w0 * 2) * u, by, cx - w1 + w1 * 2 * u, by + ch]); } SEA.strokes(segs, ch * 0.02, 'rgba(110,40,10,0.3)'); }
    P.circle(cx, by + ch, w1, P.mixc(col, '#fff0c0', 0.35), { ry: w1 * 0.3 }); P.circle(cx, by + ch - w1 * 0.02, w1 * 0.78, P.mixc(col, '#5a1a08', 0.55), { ry: w1 * 0.22 });
    if (px > 80) { const segs = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28; segs.push([cx + Math.cos(a) * w1 * 0.3, by + ch + Math.sin(a) * w1 * 0.09, cx + Math.cos(a) * w1 * 0.76, by + ch + Math.sin(a) * w1 * 0.21]); } SEA.strokes(segs, ch * 0.025, P.mixc(col, '#ffd090', 0.2)); } }
};
// long swaying algae strands
SEA.strands = (t, h, col, seed) => { for (let i = 0; i < 5; i++) { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push([(i - 2) * h * 0.04 + Math.sin(t * 1.1 + seed + i + u * 3) * h * 0.08 * u, h * u * (0.6 + 0.4 * K.hash(i, seed))]); } P.ribbon(pts, [h * 0.03, h * 0.026, h * 0.022, h * 0.02, h * 0.017, h * 0.014, h * 0.011, h * 0.008, h * 0.006, h * 0.004, h * 0.002], P.mixc(col, '#f0f0a0', i * 0.06)); } };
// Hallucigenia: a little worm on stilt legs with paired spines along its back (profile, faces the way it walks)
SEA.hallucigenia = (t, L, dir) => P.at(0, 0, 0, dir, 1, () => { const ph = t * 5, pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([K.lerp(-L / 2, L / 2, u), L * 0.16 + Math.sin(ph * 0.3 + u * 3) * L * 0.01]); }
  const segs = [], spines = []; for (let i = 0; i < 7; i++) { const [x, y] = pts[2 + i], sw = Math.sin(ph + i) * L * 0.02; segs.push([x, y, x + sw, 0]); spines.push([x, y + L * 0.02, x - L * 0.05, y + L * 0.17]); }
  SEA.strokes(segs, L * 0.022, '#8a5a6a'); P.ribbon(pts, [L * 0.03, L * 0.05, L * 0.06, L * 0.06, L * 0.06, L * 0.06, L * 0.055, L * 0.05, L * 0.05, L * 0.06, L * 0.07], '#d89a9a'); SEA.strokes(spines, L * 0.018, '#f6e0c8'); P.circle(L * 0.5, L * 0.17, L * 0.045, '#c88080'); });
// an orthocone (straight-shelled nautiloid): a long banded cone, a head with an eye and trailing arms
SEA.orthocone = (t, L, dir) => P.at(0, 0, 0, dir, 1, () => { const w = L * 0.075;
  P.poly([[0, w], [-L, 0], [0, -w]], P.lin(0, w, 0, -w, '#f0d8b0', '#a87a50')); const segs = []; for (let i = 1; i < 12; i++) { const x = -L * i / 12, ww = w * (1 - i / 12); segs.push([x, ww, x, -ww]); } SEA.strokes(segs, L * 0.012, 'rgba(110,60,30,0.55)');
  P.lit(P.blobPts(L * 0.06, 0, L * 0.08, w * 0.85, 10, 0.04, 3), '#d89878', { d: 0.25 }); P.circle(L * 0.08, w * 0.25, w * 0.28, '#1a1418'); P.circle(L * 0.09, w * 0.33, w * 0.09, '#ffffff');
  for (let k = 0; k < 7; k++) { const pts = []; for (let j = 0; j <= 6; j++) { const u = j / 6; pts.push([L * 0.12 + u * L * 0.28, (k - 3) * w * 0.18 * (1 + u) + Math.sin(t * 3 + k + u * 4) * w * 0.3 * u]); } P.ribbon(pts, [w * 0.16, w * 0.14, w * 0.12, w * 0.1, w * 0.08, w * 0.06, w * 0.03], k % 2 ? '#c88868' : '#e0a888'); } });
// Anomalocaris (refs/sea-cambrian), seen from above and a little to the side: rippling flaps down both sides, a tail fan of
// three blade pairs, big eyes on stalks, two spiny grasping arms curled under the head. Length L, faces +x (dir flips)
SEA.anomalocaris = (t, L, dir) => P.at(0, 0, 0, dir, 1, () => { const col = '#d08050', dark = '#8a4a3a', light = '#f0b890', w = L * 0.11;
  for (let k = 0; k < 3; k++) for (const sd of [-1, 1]) { const a = sd * (0.35 + k * 0.28) + Math.sin(t * 3 + k) * 0.06; P.ribbon([[-L * 0.42, 0], [-L * 0.42 - Math.cos(a) * L * 0.2, Math.sin(a) * L * 0.2]], [w * 0.5, w * 0.35], k === 1 ? light : col); }
  for (let i = 0; i < 11; i++) { const x = L * 0.3 - i * L * 0.068, wav = Math.sin(t * 6 - i * 0.7), fl = w * (1.5 - Math.abs(i - 4) * 0.08); for (const sd of [-1, 1]) P.poly([[x + L * 0.03, sd * w * 0.6], [x - L * 0.02, sd * (fl + wav * w * 0.35 * sd)], [x - L * 0.06, sd * fl * 0.85], [x - L * 0.04, sd * w * 0.5]], sd > 0 ? light : dark); }
  P.lit(P.blobPts(-L * 0.06, 0, L * 0.38, w * 0.75, 18, 0.02, 3), col, { d: 0.25 });
  const segs = []; for (let i = 0; i < 11; i++) { const x = L * 0.28 - i * L * 0.066; segs.push([x, -w * 0.6, x, w * 0.6]); } SEA.strokes(segs, L * 0.008, 'rgba(110,50,30,0.5)');
  P.lit(P.blobPts(L * 0.36, 0, L * 0.09, w * 0.85, 12, 0.03, 5), P.mixc(col, '#fff0d8', 0.15), { d: 0.25 });
  for (const sd of [-1, 1]) { P.ribbon([[L * 0.38, sd * w * 0.4], [L * 0.44, sd * w * 1.3]], L * 0.018, dark); P.circle(L * 0.45, sd * w * 1.4, L * 0.04, '#1a1418'); P.circle(L * 0.46, sd * w * 1.5, L * 0.012, '#ffffff'); }
  for (const sd of [-1, 1]) { const curl = 0.9 + Math.sin(t * 1.8 + sd) * 0.25, pts = []; let x = L * 0.44, y = sd * w * 0.3, a = 0; for (let j = 0; j <= 9; j++) { pts.push([x, y]); a -= sd * curl * 0.32; x += Math.cos(a) * L * 0.035; y += Math.sin(a) * L * 0.035 * -1 * -1; }
    P.ribbon(pts, [w * 0.45, w * 0.42, w * 0.38, w * 0.34, w * 0.3, w * 0.26, w * 0.22, w * 0.18, w * 0.14, w * 0.08], P.mixc(col, '#3a1a10', 0.2)); const sp = []; for (let j = 1; j < 9; j++) { const [px0, py0] = pts[j], [qx, qy] = pts[j + 1], dx = qx - px0, dy = qy - py0, d = Math.hypot(dx, dy) || 1; sp.push([px0, py0, px0 + (-dy / d) * sd * -1 * L * 0.03 + dx * 0.3, py0 + (dx / d) * sd * -1 * L * 0.03 + dy * 0.3]); } SEA.strokes(sp, L * 0.006, '#f6d8b0'); }
});
// a little swimmer for the schools: a fish (Redwall) or a small bivalved arthropod (Cambrian), facing +x
SEA.minnow = (L, col, bug) => { if (bug) { P.circle(0, 0, L * 0.3, col, { ry: L * 0.2 }); P.ribbon([[-L * 0.25, 0], [-L * 0.6, 0]], [L * 0.12, L * 0.04], col); P.ribbon([[L * 0.2, L * 0.08], [L * 0.5, L * 0.18]], L * 0.03, col); return; } P.poly([[L * 0.5, 0], [L * 0.2, L * 0.13], [-L * 0.3, L * 0.06], [-L * 0.5, L * 0.16], [-L * 0.44, 0], [-L * 0.5, -L * 0.16], [-L * 0.3, -L * 0.06], [L * 0.2, -L * 0.12]], col); };

// ---------- the reef layout (deterministic, per sea) ----------
SEA.layout = (red) => { const key = red ? '_red' : '_cam'; if (SEA[key]) return SEA[key]; const out = [];
  const cols = red ? { crinoid: ['#e8b040', '#f07a40', '#b080d0', '#f06a5a', '#e8c070'], clump: ['#b07a8a', '#8a9a5a', '#c06a4a', '#d8c0c0', '#a86a9a'] } : { cups: ['#f0a040', '#e88a3a', '#f2b850'], tubes: ['#2a8a8a', '#3a7aa0', '#6a5aa0'], clump: ['#a060c0', '#e07090', '#c8a040'] };
  for (let i = 0; i < 640; i++) { const z = 1.5 + i * 0.11 + K.hash(i, 1) * 0.2, side = K.hash(i, 2) > 0.5 ? 1 : -1, x = side * (1.05 + Math.pow(K.hash(i, 3), 1.3) * 5), r = K.hash(i, 4), seed = i;
    let type, size, col;
    if (red) { if (r < 0.42) { type = 'crinoid'; size = 0.8 + K.hash(i, 5) * 1.0; col = cols.crinoid[i % 5]; } else if (r < 0.66) { type = 'clump'; size = 0.18 + K.hash(i, 5) * 0.3; col = cols.clump[i % 5]; } else if (r < 0.78) { type = 'branchy'; size = 0.3 + K.hash(i, 5) * 0.3; col = cols.clump[(i + 2) % 5]; } else if (r < 0.88) { type = 'horn'; size = 0.18 + K.hash(i, 5) * 0.12; } else { type = 'brachs'; size = 0.3; } }
    else { if (r < 0.26) { type = 'cups'; size = 0.35 + K.hash(i, 5) * 0.35; col = cols.cups[i % 3]; } else if (r < 0.48) { type = 'tubes'; size = 0.45 + K.hash(i, 5) * 0.6; col = cols.tubes[i % 3]; } else if (r < 0.62) { type = 'strands'; size = 0.6 + K.hash(i, 5) * 0.8; col = ['#8a9a3a', '#a8a040', '#6a8a4a'][i % 3]; } else if (r < 0.74) { type = 'vase'; size = 0.3 + K.hash(i, 5) * 0.3; col = ['#e8b060', '#d8c070'][i % 2]; } else if (r < 0.86) { type = 'clump'; size = 0.15 + K.hash(i, 5) * 0.2; col = cols.clump[i % 3]; } else { type = 'rock'; size = 0.2 + K.hash(i, 5) * 0.25; } }
    out.push({ z, x, type, size, col, seed });
    // floor patches: microbial mats (Cambrian) or shell beds (Redwall), on the banks and sometimes in the channel
    if (i % 3 === 0) out.push({ z: z + 0.15, x: (K.hash(i, 9) - 0.5) * 7, type: red ? 'shells' : 'mat', size: 0.4 + K.hash(i, 10) * 0.7, col: red ? '#d8c8a8' : ['#a060c0', '#f08a50', '#e070a0', '#c070d0'][i % 4], seed });
  }
  // hero pieces the camera approaches (big and cropped by the end: depth)
  if (red) out.push({ z: 5.2, x: -1.45, type: 'crinoid', size: 1.9, col: '#e8b040', seed: 901 }, { z: 6.6, x: 1.6, type: 'crinoid', size: 1.5, col: '#f07a40', seed: 902 }, { z: 4.4, x: 1.3, type: 'clump', size: 0.4, col: '#b07a8a', seed: 903 });
  else out.push({ z: 5.0, x: -1.4, type: 'tubes', size: 1.2, col: '#2a8a8a', seed: 901 }, { z: 6.2, x: 1.5, type: 'cups', size: 0.75, col: '#f0a040', seed: 902 }, { z: 4.2, x: 1.15, type: 'mat', size: 0.7, col: '#a060c0', seed: 903 });
  return (SEA[key] = out);
};

// ---------- the window ----------
function seaLife(t, kind, t0 = 0) {
  const red = kind === 'redwall', u = t - t0, f = SEA.f, H0 = SEA.H0, ch = SEA.ch + Math.sin(u * 0.6) * 0.04, cz = u * 0.5, cx = Math.sin(u * 0.25) * 0.25;
  const W = red ? { top: '#6fd6e6', mid: '#2a92b4', deep: '#16688c', sand: '#e8d6a8', bank: '#7a8a5a' } : { top: '#7ae8e0', mid: '#2aa8b8', deep: '#187890', sand: '#eedcae', bank: '#a89070' };
  const gy = (dz) => H0 + ch * f / dz, sxOf = (x, dz) => 960 + (x - cx) * f / dz;
  const waterGrad = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, H0 + 40); g.addColorStop(0, W.top); g.addColorStop(0.55, W.mid); g.addColorStop(1, W.deep); return g; };
  // open water and the surface seen from below (bright, rippling), the sun's glow through it
  P.screen((ctx) => { ctx.fillStyle = waterGrad(ctx); ctx.fillRect(0, 0, 1920, 1080);
    const s = ctx.createRadialGradient(1150, -60, 0, 1150, -60, 700); s.addColorStop(0, 'rgba(240,255,250,0.7)'); s.addColorStop(1, 'rgba(240,255,250,0)'); ctx.fillStyle = s; ctx.fillRect(0, 0, 1920, 700);
    for (let i = 0; i < 26; i++) { const x = (K.hash(i, 3) * 2200 + u * 30 * (1 + K.hash(i, 5))) % 2200 - 140, y = 10 + K.hash(i, 4) * 90; ctx.fillStyle = `rgba(235,255,250,${0.12 + 0.12 * K.hash(i, 6)})`; ctx.beginPath(); ctx.ellipse(x, y, 60 + K.hash(i, 7) * 90, 6 + y * 0.05, 0, 0, 7); ctx.fill(); } });
  // the sea floor: banks and a sandy channel winding away to the vanishing point, ripples, caustics
  const pathC = (z) => 0.6 * Math.sin(z * 0.09) + 0.3 * Math.sin(z * 0.23 + 1), pathW = (z) => 0.75 + 0.25 * Math.sin(z * 0.13);
  P.screen((ctx) => { ctx.fillStyle = W.bank; ctx.fillRect(0, H0, 1920, 1080 - H0);
    const L = [], R = []; for (let y = H0 + 1.5; y <= 1086; y += y < H0 + 40 ? 1.5 : 8) { const dz = ch * f / (y - H0), z = cz + dz; L.push([sxOf(pathC(z) - pathW(z), dz), y]); R.push([sxOf(pathC(z) + pathW(z), dz), y]); }
    ctx.fillStyle = W.sand; ctx.beginPath(); [...L, ...R.reverse()].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.fill();
    for (let z = Math.ceil(cz / 0.35) * 0.35; z < cz + 30; z += 0.35) { const dz = z - cz; if (dz < 0.6) continue; const y = gy(dz), x0 = sxOf(pathC(z) - pathW(z), dz), x1 = sxOf(pathC(z) + pathW(z), dz); ctx.strokeStyle = `rgba(150,120,80,${0.3 * Math.min(1, 6 / dz)})`; ctx.lineWidth = Math.max(0.6, 10 / dz); ctx.beginPath(); for (let k = 0; k <= 12; k++) { const x = K.lerp(x0, x1, k / 12); ctx[k ? 'lineTo' : 'moveTo'](x, y + Math.sin(k * 1.3 + z * 7) * 6 / dz); } ctx.stroke(); }
    for (let i = 0; i < 700; i++) { const z = Math.floor(cz / 0.05) * 0.05 + (i % 350) * 0.09 + K.hash(i + Math.floor(cz / 0.05) * 0, 61) * 0.09, zz = z + (i >= 350 ? 0.045 : 0), dz = zz - cz; if (dz < 0.7) continue; const zi = Math.round(zz / 0.045), x = (K.hash(zi, 62) - 0.5) * 12; if (Math.abs(x - pathC(zz)) < pathW(zz) + 0.1) continue; const sx = sxOf(x, dz), sy = gy(dz), r = (0.04 + 0.08 * K.hash(zi, 63)) * f / dz; if (sx < -50 || sx > 1970) continue; ctx.fillStyle = ['rgba(60,40,40,0.35)', 'rgba(230,220,190,0.35)', 'rgba(120,90,110,0.4)', 'rgba(90,110,70,0.4)'][zi % 4]; ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.35, 0, 0, 7); ctx.fill(); }
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 3; for (let i = 0; i < 16; i++) { const yb = 600 + i * 32; ctx.strokeStyle = `rgba(200,255,240,${0.03 + 0.004 * i})`; ctx.beginPath(); for (let x = -20; x <= 1940; x += 30) ctx[x < 0 ? 'moveTo' : 'lineTo'](x, yb + Math.sin(x * 0.012 + u * 1.4 + i * 1.7) * 14 + Math.sin(x * 0.031 - u * 1.1 + i) * 8); ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; });
  // gather everything in view: reef pieces, walkers, swimmers
  const items = [];
  for (const o of SEA.layout(red)) { const dz = o.z - cz; if (dz < 0.75 || dz > 62) continue; const sx = sxOf(o.x, dz); if (sx < -900 || sx > 2820) continue; items.push({ dz, sx, sy: gy(dz), s: f / dz, o }); }
  const walk = (x, z, size, dir, kind2, sd) => { const dz = z - cz; if (dz > 0.75) items.push({ dz, sx: sxOf(x, dz), sy: gy(dz), s: f / dz, o: { type: kind2, size, dir, seed: sd } }); };
  const nT = red ? 4 : 8; for (let i = 0; i < nT; i++) { const dir = i % 2 ? -1 : 1, z = 2.6 + i * 1.3 + K.hash(i, 31) * 0.8, x = pathC(z) + dir * (u * 0.06 - 0.4) + (K.hash(i, 32) - 0.5) * 0.6; walk(x, z, 0.26 + K.hash(i, 33) * 0.1, dir, 'trilobite', i); }
  if (!red) for (let i = 0; i < 3; i++) { const dir = i % 2 ? 1 : -1, z = 3.2 + i * 2.1; walk(pathC(z) + 0.5 * -dir + dir * u * 0.03, z, 0.24, dir, 'hallu', i); }
  const swim = (x, y, z, size, dir, kind2, sd) => { const dz = z - cz; if (dz > 0.8) items.push({ dz, sx: sxOf(x, dz), sy: H0 + (ch - y) * f / dz, s: f / dz, o: { type: kind2, size, dir, seed: sd } }); };
  if (red) { swim(K.lerp(3.2, -2.6, u / 8), 1.55 + Math.sin(u) * 0.05, cz + 3.8, 1.1, -1, 'ortho', 1); swim(K.lerp(-6, 4, u / 8), 2.3, cz + 16, 1.1, 1, 'ortho', 2); swim(K.lerp(12, -10, u / 8), 2.6, cz + 30, 2.2, -1, 'shark', 3); swim(K.lerp(-5, 5, u / 8), 1.9, cz + 11, 1, 1, 'school', 4); }
  else { swim(K.lerp(3.4, -3.2, u / 8), 1.5 + Math.sin(u * 0.8) * 0.06, cz + 3.4, 1.0, -1, 'anomalo', 1); swim(K.lerp(-7, 6, u / 8), 2.4, cz + 20, 1.4, 1, 'anomalo', 2); swim(K.lerp(5, -5, u / 8), 1.8, cz + 10, 1, -1, 'school', 4); }
  items.sort((a, b) => b.dz - a.dz);
  // draw far to near; after each slice, wash everything above that slice's ground line with water (fog by distance)
  const drawItem = (it) => { const { o, s } = it; P.screen(() => P.at(it.sx, it.sy, 0, s, -s, () => {
    const px = o.size * s;
    switch (o.type) {
      case 'crinoid': SEA.crinoid(t, o.size, o.col, o.seed, px); break;
      case 'clump': SEA.clump(t, o.size, o.col, o.seed, px); break;
      case 'branchy': SEA.branchy(t, o.size, o.col, o.seed); break;
      case 'tubes': SEA.tubes(t, o.size, o.col, o.seed); break;
      case 'cups': SEA.cups(t, o.size, o.col, o.seed, px); break;
      case 'strands': SEA.strands(t, o.size, o.col, o.seed); break;
      case 'vase': LIFE.sponge(0, 0, o.size, o.col, o.seed); break;
      case 'horn': for (let k = 0; k < 3; k++) LIFE.hornCoral((k - 1) * o.size * 0.5, 0, o.size * (0.7 + 0.3 * K.hash(k, o.seed)), (k - 1) * 0.35); break;
      case 'rock': LIFE.rock(0, 0, o.size, o.seed, '#8a7080'); break;
      case 'brachs': for (let k = 0; k < 6; k++) LIFE.brachiopod((K.hash(k, o.seed) - 0.5) * 0.5, (K.hash(k, o.seed + 1) - 0.5) * 0.05, 0.05 + 0.03 * K.hash(k, o.seed + 2), ['#f2c8a0', '#e8a090', '#f0d4b4', '#c89a80'][k % 4]); break;
      case 'mat': case 'shells': { const pts = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28, rr = o.size * (0.8 + 0.4 * K.hash(k, o.seed)); pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.08]); } P.smooth(pts, o.col, { a: o.type === 'shells' ? 0.35 : 0.75 }); if (o.type === 'shells') for (let k = 0; k < 9; k++) P.circle((K.hash(k, o.seed) - 0.5) * o.size * 1.4, (K.hash(k, o.seed + 1) - 0.5) * o.size * 0.1, o.size * 0.06, ['#f2e0c0', '#c8a080', '#e8c8a0'][k % 3], { ry: o.size * 0.03 }); else { P.smooth(pts.map(([x, y]) => [x * 0.6 - o.size * 0.1, y * 0.6 + o.size * 0.01]), P.mixc(o.col, '#fff0f0', 0.2), { a: 0.7 }); for (let k = 0; k < 24; k++) P.circle((K.hash(k, o.seed + 4) - 0.5) * o.size * 1.6, (K.hash(k, o.seed + 5) - 0.5) * o.size * 0.12, o.size * 0.035, P.mixc(o.col, k % 2 ? '#ffffff' : '#200020', 0.3), { ry: o.size * 0.015 }); } break; }
      case 'trilobite': P.at(0, o.size * 0.08, 0, 1, 1, () => LIFE.trilobite(t, 0, 0, o.size / 75, o.dir, ['#8a6a4a', '#5a5a6a', '#9a7a52', '#7a6a5a'][o.seed % 4], o.seed)); break;
      case 'hallu': SEA.hallucigenia(t, o.size, o.dir); break;
      case 'ortho': SEA.orthocone(t, o.size, o.dir); break;
      case 'anomalo': SEA.anomalocaris(t, o.size, o.dir); break;
      case 'shark': LIFE.shark(t, 0, 0, o.size / 150, o.dir, '#4a6a8a'); break;
      case 'school': for (let k = 0; k < 26; k++) { const a = K.hash(k, 7) * 6.28, d = Math.sqrt(K.hash(k, 8)), fx = Math.cos(a) * d * 0.9 + Math.sin(t * 1.3 + k) * 0.04, fy = Math.sin(a) * d * 0.35; P.at(fx, fy, 0, o.dir, 1, () => SEA.minnow(red ? 0.12 : 0.07, red ? '#b8d8e0' : '#d8b890', !red)); } break;
    }
  })); };
  let k = 0; const step = 2.4, alpha = 1 - Math.exp(-step / 14);
  for (let b = 62; b > 0; b -= step) {
    while (k < items.length && items[k].dz >= b) drawItem(items[k++]);
    const y = Math.min(1080, gy(Math.max(b, 0.5)));
    P.screen((ctx) => { ctx.globalAlpha = alpha; ctx.fillStyle = waterGrad(ctx); ctx.fillRect(0, 0, 1920, y); ctx.globalAlpha = 1; });
  }
  while (k < items.length) drawItem(items[k++]);
  // light from the surface: slow rays fanning down, marine snow, an all-over blue cast and a deep vignette
  P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const x0 = 600 + i * 150 + Math.sin(u * 0.35 + i * 1.7) * 50, spread = (i - 3.5) * 170, w0 = 30 + K.hash(i, 2) * 50, w1 = w0 * 4; const g = ctx.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, `rgba(210,255,245,${0.07 + 0.04 * Math.sin(u * 0.8 + i)})`); g.addColorStop(1, 'rgba(210,255,245,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - w0, -10); ctx.lineTo(x0 + w0, -10); ctx.lineTo(x0 + spread * 1.6 + w1, 1080); ctx.lineTo(x0 + spread * 1.6 - w1, 1080); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 90; i++) { const near = K.hash(i, 33), r = near > 0.93 ? 5 + near * 4 : 1 + near * 2.2, x = (K.hash(i, 30) * 1920 + u * 12 * (0.5 + near)) % 1920, y = ((K.hash(i, 31) * 1080 - u * (6 + 14 * near)) % 1080 + 1080) % 1080; ctx.fillStyle = `rgba(230,255,250,${near > 0.93 ? 0.18 : 0.5})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(10,80,110,0.04)'; ctx.fillRect(0, 0, 1920, 1080);
    const v = ctx.createRadialGradient(960, 460, 380, 960, 540, 1150); v.addColorStop(0, 'rgba(4,30,60,0)'); v.addColorStop(1, 'rgba(4,30,60,0.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, 1920, 1080); });
}
