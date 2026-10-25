// The canyon as a landscape in perspective (the user's references view-*.webp): a faceted terrain mesh, drawn far to near,
// each facet lit by its own slope (sunlit faces, violet shade faces, light flat tops), rock bands by height in the real
// layer colours, buttes jutting in and out, a winding river, haze with distance. World units are metres: X across the
// canyon, Y up (the rim at RIM), Z away from the viewer.
const V3 = {};
// the canyon's centre line winds, and the walls jut in and out (spurs and side bays) along it
V3.center = (Z) => 900 * Math.sin(Z / 5200 + 0.6) + 420 * Math.sin(Z / 1900 + 2.1);
V3.jut = (Z, side) => 1 + 0.34 * Math.sin(Z / 1300 + side * 1.7) + 0.16 * Math.sin(Z / 470 + side * 3.1);
// the wall profile across the canyon (right side, from the river outward) for the carving state
V3.profile = (cut, widen) => {
  const bottom = lerp(RIM, RIVER, cut), out = [];
  for (const [x, y] of WALL) { if (y < bottom) continue; out.push([lerp(40 + (y - bottom) * 0.32, x, widen), y]); }
  out.unshift([lerp(10, 110, widen), bottom]);
  return out;
};
// the colour of rock at height y (the layers; the basement below 0), as base / light / shade
V3.rockAt = (y) => {
  if (y < 0) return '#5e4a76';
  for (let i = 0; i < LAYERS.length; i++) if (y <= LTOP[i][1]) return LAYERS[i][2];
  return '#e2c8a0';
};
// project a world point with the camera { x, y, z, yaw, pitch, f }
V3.proj = (c, X, Y, Z) => {
  let dx = X - c.x, dz = Z - c.z; const cy = Math.cos(c.yaw ?? 0), sy = Math.sin(c.yaw ?? 0);
  const rx = dx * cy - dz * sy, rz = dx * sy + dz * cy, dy = Y - c.y;
  const cp = Math.cos(c.pitch ?? 0), sp = Math.sin(c.pitch ?? 0), ry = dy * cp - rz * sp, rz2 = dy * sp + rz * cp;   // pitch < 0 looks down
  if (rz2 < 1) return null;
  return [960 + c.f * rx / rz2, 540 - c.f * ry / rz2, rz2];
};
// draw the terrain. o: { cut, widen, haze (rgb hex), sun: [lx, ly, lz] light direction, warm 0..1, zFar, slices, plants }
V3.draw = (t, c, o) => {
  const prof = V3.profile(o.cut, o.widen), zN = Math.max(60, c.z + 60), zF = o.zFar ?? 42000, N = o.slices ?? 70;
  const L = o.sun ?? [0.62, 0.5, -0.6], Ln = Math.hypot(...L), haze = o.haze ?? '#e8b8b0';
  const sideX = 14000;
  // cross-section points for one slice at depth Z (both walls, the river between, the plateau out to sideX)
  const zj = (Z, j, s) => (K.hash(Math.round(Z), j * 7 + s) - 0.5);
  const slice = (Z) => { const cx = V3.center(Z), bot = lerp(RIM, RIVER, o.cut) + 1, R = prof.map(([x, y], j) => [cx + x * V3.jut(Z, 1) * (1 + zj(Z, j, 1) * 0.08), y + (y > bot && y < RIM - 5 ? zj(Z, j, 2) * 30 : 0)]), Lw = prof.map(([x, y], j) => [cx - x * V3.jut(Z, -1) * (1 + zj(Z, j, 3) * 0.08), y + (y > bot && y < RIM - 5 ? zj(Z, j, 4) * 30 : 0)]);
    return [[cx - sideX, RIM], ...Lw.slice().reverse(), ...R, [cx + sideX, RIM]].map(([x, y]) => [x, y, Z]); };
  const zs = []; for (let i = 0; i <= N; i++) zs.push(c.z + 60 * Math.pow((zF - c.z) / 60, i / N));
  let far = slice(zs[N]);
  P.screen((ctx) => {
    for (let i = N - 1; i >= 0; i--) {
      const near = slice(zs[i]), fog = Math.pow(i / N, 0.75);
      for (let j = 0; j < near.length - 1; j++) {
        const a = far[j], b = far[j + 1], cc = near[j + 1], d = near[j];
        const pa = V3.proj(c, ...a), pb = V3.proj(c, ...b), pc = V3.proj(c, ...cc), pd = V3.proj(c, ...d);
        if (!pa || !pb || !pc || !pd) continue;
        // facet normal and light
        const u = [b[0] - d[0], b[1] - d[1], b[2] - d[2]], v = [a[0] - cc[0], a[1] - cc[1], a[2] - cc[2]];
        let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const nl = Math.hypot(...n) || 1; n = n.map((q) => q / nl); if (n[1] < 0) n = n.map((q) => -q);
        const lit = (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / Ln, flat = n[1] > 0.93, ym = (a[1] + b[1] + cc[1] + d[1]) / 4;
        const water = Math.abs(a[1] - b[1]) < 1 && ym <= lerp(RIM, RIVER, o.cut) + 1 && o.cut > 0.02 && j > 1 && j < near.length - 3;
        let col;
        if (water) col = P.mixc('#3fc6c8', '#a8f0e0', 0.3 + 0.2 * Math.sin(t * 2 + i));
        else if (flat) col = P.mixc(ym > RIM - 5 ? '#e8956a' : P.mixc(V3.rockAt(ym), '#f2b890', 0.4), '#ffe0c0', 0.1 + 0.1 * K.hash(i, j));
        else { const base = V3.rockAt(ym), k = clamp(0.5 + lit * 1.05 + (K.hash(i * 7, j) - 0.5) * 0.16); col = k > 0.5 ? P.mixc(base, '#ffd09a', (k - 0.5) * 0.9) : P.mixc(base, '#3a1e58', (0.5 - k) * 1.4); }
        col = P.mixc(col, haze, fog * 0.5);
        ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.lineTo(pc[0], pc[1]); ctx.lineTo(pd[0], pd[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
        // cliff detail: vertical cracks on steep lit faces close by; ledge lines at the top of each layer
        if (!flat && !water && fog < 0.45 && Math.abs(n[1]) < 0.4 && K.hash(i, j * 3) > 0.55) { ctx.strokeStyle = P.mixc(col, '#2a1020', 0.35); ctx.lineWidth = Math.max(1, 3 - fog * 5); ctx.beginPath(); const s1 = K.hash(i, j + 50); ctx.moveTo(lerp(pd[0], pc[0], s1), lerp(pd[1], pc[1], s1)); ctx.lineTo(lerp(pa[0], pb[0], s1), lerp(pa[1], pb[1], s1)); ctx.stroke(); }
      }
      // shrubs on the plateau and the river banks, a few per slice nearby (one soft shape each)
      if (o.plants && i < N * 0.5 && i % 2 === 0) for (let k = 0; k < 5; k++) { const side = k % 2 ? 1 : -1, X = V3.center(zs[i]) + side * (1500 + K.hash(i, k + 9) * 4000), p = V3.proj(c, X, RIM, zs[i]); if (!p) continue; const r = Math.max(1.5, 26000 / p[2]) * (0.6 + 0.6 * K.hash(i, k)); ctx.globalAlpha = o.plants * (1 - fog); ctx.fillStyle = '#4a6a3a'; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * 0.4, r, r * 0.6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#6a8a4a'; ctx.beginPath(); ctx.ellipse(p[0] - r * 0.2, p[1] - r * 0.6, r * 0.55, r * 0.3, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      far = near;
    }
  });
};
// the sky with a sun, soft flat clouds and far blue mesas on the horizon (refs view-mesas, view-aerial)
V3.sky = (t, c, o) => {
  const day = o.day ?? 1, gold = o.gold ?? 0, hz = V3.proj(c, c.x, c.y, 60000) ?? [960, 300];
  P.sky(P.mixc(P.mixc('#101238', '#3fb0d8', day), '#e88850', gold * 0.55), P.mixc(P.mixc('#2a2050', '#c8eef0', day), '#ffc890', gold), P.mixc(P.mixc('#1a1a48', '#8ad0e8', day), '#f8a870', gold * 0.8));
  P.screen((ctx) => {
    if (day < 0.4) { ctx.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { ctx.globalAlpha = (0.4 - day) * 2.2 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.arc(K.hash(i, 1) * 1920, K.hash(i, 2) * hz[1], 1.4, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
    const sx = o.sunX ?? 1500, sy = hz[1] - (o.sunH ?? 160), g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 300); g.addColorStop(0, `rgba(255,236,190,${0.7 * day})`); g.addColorStop(1, 'rgba(255,220,170,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalAlpha = Math.min(1, day * 1.4); ctx.fillStyle = '#fff4d0'; ctx.beginPath(); ctx.arc(sx, sy, 62, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i++) { const x = ((K.hash(i, 5) * 2600 + t * 10) % 2600) - 340, y = 90 + K.hash(i, 6) * Math.max(60, hz[1] - 260); ctx.globalAlpha = 0.85 * day; ctx.fillStyle = P.mixc('#ffffff', '#ffd8b0', gold); ctx.beginPath(); ctx.ellipse(x, y, 190, 20, 0, 0, 7); ctx.ellipse(x - 40, y - 22, 70, 36, 0, 0, 7); ctx.ellipse(x + 40, y - 30, 90, 46, 0, 0, 7); ctx.ellipse(x + 120, y - 14, 60, 26, 0, 0, 7); ctx.fill(); ctx.fillStyle = P.mixc('#c8e0f0', '#f0b8a0', gold); ctx.beginPath(); ctx.ellipse(x + 10, y + 4, 200, 10, 0, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    // far mesas: two bands of flat-topped blue-violet silhouettes on the horizon
    for (const [k, col] of [[0, P.mixc(P.mixc('#9ab8e0', '#c8a0c8', gold), '#1a1a40', 1 - day)], [1, P.mixc(P.mixc('#7a9ad0', '#b088b8', gold), '#141436', 1 - day)]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hz[1] + 40); let x = 0; while (x < 1920) { const w = 120 + K.hash(x, k + 3) * 260, h = 18 + K.hash(x, k + 4) * (k ? 42 : 60) + (K.hash(x, k + 7) > 0.8 ? 60 : 0); ctx.lineTo(x + 20, hz[1] - h); ctx.lineTo(x + w - 20, hz[1] - h); ctx.lineTo(x + w, hz[1] - h * 0.3); x += w; } ctx.lineTo(1920, hz[1] + 40); ctx.fill(); }
  });
};
