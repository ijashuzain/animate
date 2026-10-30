// Life in the canyon film, redesigned (the user's note: "change all plants and species underwater and upwater"):
// real species for each time and place, drawn with depth (lit top, shaded underside, far layers hazy).
// Seas: the Cambrian sea (~515 Ma: trilobites, vase sponges, algae, Anomalocaris) and the Redwall sea (~340 Ma: crinoid
// gardens, horn corals, brachiopods, lace bryozoans, early sharks). Land today: prickly pear, agave, yucca, juniper.
const LIFE = {};
// ---------- sea floor creatures (world units, y up, standing on y) ----------
// a trilobite in 3/4 top view: head shield with eyes and genal spines, a segmented body with a raised axial lobe, a tail
LIFE.trilobite = (t, x, y, s, dir = 1, col = '#8a6a4a', seed = 0) => P.at(x, y, 0, s * dir, s * 0.62, () => {
  const walk = Math.sin(t * 10 + seed), dark = P.mixc(col, '#1a1020', 0.35), light = P.mixc(col, '#fff0d8', 0.3);
  P.circle(0, -5, 34, 'rgba(20,30,40,0.25)', { ry: 8 });                                                      // shadow
  for (let i = 0; i < 9; i++) { const lx = -20 + i * 5; P.ribbon([[lx, -3], [lx + 3 + Math.sin(t * 12 + i) * 2, -10]], 1.4, dark); }  // legs
  P.ribbon([[22, 4], [36, 16 + walk * 2], [44, 22]], 1.2, dark); P.ribbon([[22, -4], [36, -14 - walk * 2], [44, -20]], 1.2, dark); // antennae
  P.poly([[18, 12], [-12, 22], [10, 15]], dark); P.poly([[18, -12], [-12, -22], [10, -15]], dark);          // genal spines
  P.lit(P.blobPts(-6, 0, 28, 17, 18, 0.02, 2), col, { d: 0.18 });                                             // body
  for (let i = 0; i < 9; i++) { const bx = -26 + i * 4.6; P.ribbon([[bx, -15 + Math.abs(i - 4) * 0.6], [bx, 15 - Math.abs(i - 4) * 0.6]], 1.3, dark); }
  P.lit(P.blobPts(-6, 0, 26, 5.5, 14, 0.02, 3), light, { d: 0.25 });                                          // axial lobe
  P.lit([[8, 15], [24, 9], [28, 0], [24, -9], [8, -15]], P.mixc(col, '#fff0d8', 0.12), { d: 0.2 });           // head shield
  P.lit(P.blobPts(20, 0, 7, 5, 10, 0.02, 4), light, { d: 0.2 });                                              // glabella
  for (const k of [-1, 1]) { P.circle(14, k * 8, 3, '#2a1a18', { ry: 2.4 }); P.circle(14.6, k * 8.6, 0.9, '#ffffff'); }
});
// a vase sponge: a tall tapering tube with a dark opening, pores, lit on the left
LIFE.sponge = (x, y, h, col = '#e8b060', seed = 0) => { const w = h * 0.28, sw = (K.hash(seed, 3) - 0.5) * 0.3;
  P.at(x, y, sw * 0.4, 1, 1, () => { P.circle(0, 0, w * 1.3, 'rgba(20,30,40,0.22)', { ry: w * 0.25 }); P.poly([[-w * 0.5, 0], [w * 0.5, 0], [w, h], [-w, h]], P.lin(-w, 0, w, 0, P.mixc(col, '#fff0d0', 0.25), P.mixc(col, '#3a1a30', 0.35)));
    for (let i = 0; i < 18; i++) P.circle((K.hash(i, seed) - 0.5) * w * (1 + K.hash(i, seed + 1)), h * (0.1 + 0.8 * K.hash(i, seed + 1)), h * 0.02, 'rgba(80,30,20,0.35)');
    P.circle(0, h, w, P.mixc(col, '#fff0d0', 0.2), { ry: w * 0.28 }); P.circle(0, h - h * 0.01, w * 0.78, '#5a2418', { ry: w * 0.2 }); }); };
// branching algae: olive fronds that sway
LIFE.algae = (t, x, y, h, col = '#8a9a3a', seed = 0) => { const br = (px, py, a, len, d) => { if (d > 3 || len < 2) return; const sw = Math.sin(t * 1.1 + seed + d) * 0.12, ex = px + Math.cos(a + sw) * len, ey = py + Math.sin(a + sw) * len; P.ribbon([[px, py], [ex, ey]], [len * 0.14, len * 0.09], P.mixc(col, '#fff0b0', d * 0.1)); for (const k of [-1, 1]) br(ex, ey, a + k * (0.45 + K.hash(d * 7 + k, seed) * 0.3), len * 0.68, d + 1); }; br(x, y, Math.PI / 2 + (K.hash(seed, 2) - 0.5) * 0.4, h * 0.4, 0); };
// Anomalocaris: the Cambrian's top predator, swimming with rippling side flaps, two curled grasping arms, stalked eyes
LIFE.anomalocaris = (t, x, y, s, dir = 1) => P.at(x, y, 0, s * dir, s, () => {
  const col = '#c86a4a', dark = '#7a3a3a';
  for (let i = 0; i < 11; i++) { const bx = 40 - i * 9, w = Math.sin(t * 6 - i * 0.7) * 6, fl = 15 - Math.abs(i - 4) * 0.8; for (const k of [-1, 1]) P.poly([[bx + 4, 0], [bx - 6, k * (fl + w * k * 0.5)], [bx - 10, k * (fl * 0.6)], [bx - 4, 0]], k > 0 ? P.mixc(col, '#ffd0b0', 0.25) : dark); }
  P.lit(P.blobPts(-6, 0, 52, 9, 16, 0.02, 3), col, { d: 0.2 }); for (let i = 0; i < 10; i++) P.ribbon([[36 - i * 9, -7], [36 - i * 9, 7]], 1.2, dark);
  for (const k of [-1, 1]) P.poly([[-56, 0], [-76, k * 12], [-70, 0]], P.mixc(col, '#ffd0b0', 0.2));
  for (const k of [-1, 1]) { const curl = 0.8 + Math.sin(t * 2) * 0.2, pts = []; for (let j = 0; j <= 8; j++) { const a = -k * curl * j * 0.4; pts.push([48 + Math.cos(a) * (j * 3), k * 4 - Math.sin(a) * j * 3]); } P.ribbon(pts, [5, 4.6, 4.2, 3.8, 3.4, 3, 2.6, 2.2, 1.8], dark); }
  for (const k of [-1, 1]) { P.ribbon([[40, k * 5], [44, k * 12]], 1.4, dark); P.circle(44, k * 13, 4, '#2a1a18'); P.circle(45, k * 14, 1.2, '#ffffff'); }
});
// a crinoid: segmented stalk, a cup, feathery arms (refs/redwall-sea); far ones are flat hazy silhouettes
LIFE.crinoid = (t, x, y, h, col, seed, hazeA = 0) => {
  const sw = Math.sin(t * 0.8 + seed) * 0.07, top = [x + Math.sin(sw) * h, y + h], c2 = hazeA ? P.mixc(col, '#3a9ab8', hazeA) : col;
  const stalk = []; for (let i = 0; i <= 12; i++) { const u = i / 12; stalk.push([x + Math.sin(sw * u) * h * u, y + h * u]); }
  P.ribbon(stalk, h * 0.045, P.mixc('#f0d0a8', '#3a9ab8', hazeA)); if (!hazeA) for (let i = 1; i < 12; i++) P.ribbon([[stalk[i][0] - h * 0.022, stalk[i][1]], [stalk[i][0] + h * 0.022, stalk[i][1]]], h * 0.007, 'rgba(120,70,40,0.4)');
  P.circle(top[0], top[1] - h * 0.01, h * 0.075, P.mixc('#e8a070', '#3a9ab8', hazeA), { ry: h * 0.035 });
  for (let k = 0; k < 10; k++) { const a = Math.PI * (0.22 + 0.56 * k / 9) + sw * 2, L = h * (0.3 + 0.06 * Math.sin(k * 1.7 + seed)), pts = []; for (let j = 0; j <= 8; j++) { const u = j / 8, cu = 1 - 0.45 * u * u; pts.push([top[0] + Math.cos(a) * L * u * cu * 1.15, top[1] + Math.sin(a) * L * u]); }
    P.ribbon(pts, [h * 0.028, h * 0.03, h * 0.026, h * 0.022, h * 0.018, h * 0.014, h * 0.01, h * 0.008, h * 0.004], P.mixc(c2, '#fff0d0', k % 2 ? 0.25 : 0));
    if (!hazeA) for (let j = 1; j < 8; j++) { const [px, py] = pts[j], [qx, qy] = pts[j + 1], n = Math.atan2(qy - py, qx - px) + Math.PI / 2, l = h * 0.07 * (1 - j / 9); for (const sg of [-1, 1]) P.ribbon([[px, py], [px + Math.cos(n) * l * sg + (qx - px) * 0.6, py + Math.sin(n) * l * sg + (qy - py) * 0.6]], h * 0.006, P.mixc(c2, '#ffffff', 0.18)); } }
};
// a horn coral: a ribbed, curved cone with an orange cup, lit on the left
LIFE.hornCoral = (x, y, h, tilt) => P.at(x, y, tilt, 1, 1, () => {
  const pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10, w = h * (0.06 + 0.22 * u), cx = Math.sin(u * 1.4) * h * 0.18; pts.push([cx - w, u * h]); } const rpts = []; for (let i = 10; i >= 0; i--) { const u = i / 10, w = h * (0.06 + 0.22 * u), cx = Math.sin(u * 1.4) * h * 0.18; rpts.push([cx + w, u * h]); }
  P.poly([...pts, ...rpts], P.lin(-h * 0.3, 0, h * 0.4, 0, '#f6c890', '#a86a3a'));
  for (let i = 1; i < 9; i++) { const u = i / 9, w = h * (0.06 + 0.22 * u), cx = Math.sin(u * 1.4) * h * 0.18; P.ribbon([[cx - w, u * h], [cx, u * h - h * 0.02], [cx + w, u * h]], h * 0.012, 'rgba(110,60,20,0.3)'); }
  const cx = Math.sin(1.4) * h * 0.18; P.circle(cx, h, h * 0.28, '#f6a050', { ry: h * 0.08 }); P.circle(cx, h - h * 0.01, h * 0.2, '#b84a24', { ry: h * 0.05 }); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; P.ribbon([[cx, h - h * 0.01], [cx + Math.cos(a) * h * 0.19, h + Math.sin(a) * h * 0.05]], h * 0.008, '#f6c890'); }
});
// a brachiopod: a ribbed two-valve shell with a hinge beak (like a scallop), two-tone
LIFE.brachiopod = (x, y, r, col = '#f0b890') => { P.circle(x, y - r * 0.15, r * 1.1, 'rgba(20,30,40,0.2)', { ry: r * 0.25 }); const pts = [[x, y - r * 0.05]]; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.05 + 0.9 * i / 12); pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.85]); } P.lit(pts, col, { d: 0.18 }); for (let i = 1; i < 12; i++) { const a = Math.PI * (0.05 + 0.9 * i / 12); P.ribbon([[x, y], [x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.8]], r * 0.045, i % 2 ? 'rgba(120,50,40,0.25)' : 'rgba(255,240,220,0.4)'); } P.circle(x, y, r * 0.16, P.mixc(col, '#5a2a20', 0.3)); };
// a lace bryozoan: a fan-shaped colony with a net pattern
LIFE.bryozoan = (t, x, y, h, col = '#e86a7a') => P.at(x, y, Math.sin(t * 0.7 + x) * 0.04, 1, 1, () => { const pts = [[0, 0]]; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.25 + 0.5 * i / 12); pts.push([Math.cos(a) * h * 0.7, h * 0.3 + Math.sin(a) * h * 0.7]); } P.lit(pts, col, { d: 0.15 }); for (let i = 1; i < 6; i++) P.ribbon([[0, 0], [Math.cos(Math.PI * (0.25 + 0.5 * i / 6)) * h * 0.68, h * 0.3 + Math.sin(Math.PI * (0.25 + 0.5 * i / 6)) * h * 0.68]], h * 0.015, 'rgba(255,230,230,0.5)'); for (let k = 1; k < 4; k++) { const arc = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.27 + 0.46 * i / 12); arc.push([Math.cos(a) * h * 0.18 * k, h * 0.3 * k / 3.4 + Math.sin(a) * h * 0.18 * k]); } P.ribbon(arc, h * 0.012, 'rgba(255,230,230,0.45)'); } });
// an early shark (sleek, profile eye, faces the way it swims)
LIFE.shark = (t, x, y, s, dir = 1, col = '#5a6a8a') => P.at(x, y, 0, s * dir, s, () => { const w = Math.sin(t * 5 + x) * 0.15; P.poly([[-60, 0], [-84, 14 + w * 20], [-80, 0], [-86, -12 + w * 20]], P.mixc(col, '#000000', 0.15)); P.lit([[50, 0], [30, 9], [-20, 10], [-62, 2], [-62, -2], [-20, -9], [30, -9]], col, { d: 0.2 }); P.poly([[-20, -9], [30, -9], [10, -4]], '#d8e0e8'); P.poly([[0, 9], [-14, 24], [-18, 10]], P.mixc(col, '#000000', 0.1)); P.poly([[6, -8], [-6, -18], [-10, -8]], P.mixc(col, '#000000', 0.1)); P.circle(34, 2, 2.6, '#101018'); P.circle(34.6, 2.8, 0.8, '#ffffff'); for (let i = 0; i < 4; i++) P.ribbon([[22 - i * 3, -3], [22 - i * 3, 4]], 0.9, 'rgba(20,30,50,0.4)'); });
// a sea-floor rock, faceted: a lit top face and a shaded front
LIFE.rock = (x, y, r, seed = 1, col = '#7a5a8a') => { const pts = P.blobPts(x, y + r * 0.35, r, r * 0.55, 8, 0.25, seed); P.poly(pts, P.mixc(col, '#2a1a3a', 0.25)); P.poly(pts.map(([px, py]) => [px, py + (py > y + r * 0.35 ? r * 0.05 : r * 0.3)]).slice(0, 5), P.mixc(col, '#f0d0e0', 0.15)); };

// the sea windows are in src/sea.js (seaLife)
// ---------- land plants of the canyon today (screen-space foreground, y down; s = size) ----------
LIFE.pricklyPear = (x, y, s, seed = 0, t = 0) => { const pad = (px, py, a, r) => P.at(px, py, a, 1, 1, () => { P.lit(P.blobPts(0, r * 0.9, r * 0.62, r, 14, 0.04, seed + px), '#5aa060', { d: 0.22, light: [-0.6, 0.6] }); for (let i = 0; i < 9; i++) P.circle((K.hash(i, seed + px) - 0.5) * r * 0.9, r * (0.3 + 1.2 * K.hash(i + 3, seed + px)), r * 0.035, '#f0e8b0'); }); P.at(x, y, 0, s, -s, () => { pad(0, 0, 0, 60); pad(-40, 70, -0.5, 46); pad(42, 76, 0.45, 50); pad(-10, 140, 0.1, 40); pad(70, 150, 0.7, 34); for (const [fx, fy, c] of [[-40, 150, '#f2d24a'], [70, 205, '#f06a8a'], [-8, 218, '#c8344a']]) { P.circle(fx, fy, 9, c); P.circle(fx, fy, 4, P.mixc(c, '#ffffff', 0.4)); } }); };
LIFE.agave = (x, y, s, t = 0) => P.at(x, y, 0, s, -s, () => { for (let i = 0; i < 11; i++) { const a = Math.PI * (0.08 + 0.84 * i / 10), L = 110 * (0.65 + 0.35 * Math.sin(i * 1.9) ** 2), tip = [Math.cos(a) * L, Math.sin(a) * L * 0.95], side = Math.cos(a) > 0 ? 1 : -1; P.poly([[-9, 0], [9, 0], tip], P.lin(-L, 0, L, 0, '#8ab8a8', '#4a7a70')); P.ribbon([[0, 2], tip], 1.4, 'rgba(255,255,240,0.35)'); P.circle(tip[0], tip[1], 2.2, '#5a3a2a'); void side; } });
LIFE.yucca = (x, y, s, t = 0) => P.at(x, y, 0, s, -s, () => { P.ribbon([[0, 0], [2, 60]], 10, '#7a5a3a'); for (let i = 0; i < 18; i++) { const a = Math.PI * (i / 17) + Math.sin(t + i) * 0.02, L = 70; P.ribbon([[0, 60], [Math.cos(a) * L, 60 + Math.sin(a) * L * 0.8]], [5, 1], i % 2 ? '#6a9a5a' : '#4a7a4a'); } P.ribbon([[0, 60], [4, 150], [6, 190]], 3, '#8a7a4a'); for (let i = 0; i < 9; i++) P.circle(6 + (i % 2 ? 6 : -4), 150 + i * 5, 6, '#f6f0d8'); });
LIFE.juniper = (x, y, s, seed = 0) => P.at(x, y, 0, s, -s, () => { P.ribbon([[0, 0], [-6, 30], [6, 60]], [12, 9, 6], '#6a4a3a'); for (let i = 0; i < 7; i++) { const cx = (K.hash(i, seed) - 0.5) * 90, cy = 70 + K.hash(i + 2, seed) * 60, r = 30 + K.hash(i + 4, seed) * 18; P.circle(cx, cy - 6, r, '#2a4a3a'); P.circle(cx, cy, r * 0.92, '#3f6a4a'); P.circle(cx - r * 0.2, cy + r * 0.3, r * 0.45, '#5a8a5a', { ry: r * 0.28 }); } });
// the near foreground of the canyon today: a prickly pear and an agave on the left, a yucca and grass on the right
function flora(t) { P.screen(() => { LIFE.pricklyPear(120, 1110, 1.5, 3, t); LIFE.agave(330, 1100, 1.1, t); P.at(0, 1080, 0, 1, -1, () => { for (let i = 0; i < 12; i++) Nature.grass(t, 20 + i * 40, 0, 60 + (i % 3) * 20, { col: '#9aa04a' }); for (let i = 0; i < 8; i++) Nature.grass(t, 1600 + i * 40, 0, 50 + (i % 3) * 20, { col: '#9aa04a' }); }); LIFE.yucca(1780, 1110, 1.4, t); LIFE.agave(1640, 1110, 0.8, t); }); }
// ---------- the river today: the 3D canyon from the water, a raft of four paddling downstream ----------
function raftScene(t, t0) {
  const z = 400 + (t - t0) * 120, yaw = Math.atan2(V3.center(z + 1400) - V3.center(z + 200), 1200), c = { x: V3.center(z + 200) - Math.sin(yaw) * 200, y: RIVER + 170, z, yaw, pitch: 0.02, f: 900 };
  V3.sky(t, c, { day: 1, gold: 0.2, sunX: 1380, sunH: 330 });
  V3.draw(t, c, { cut: 1, widen: 1, gorge: 2.6, haze: '#c0b4d8', plants: 1, slices: 150 });
  // the river in front of us: sparkles and ripples drifting toward the camera
  P.screen((ctx) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const u = (K.hash(i, 3) + (t - t0) * 0.25) % 1, y = 620 + u * u * 460, x = 960 + (K.hash(i, 4) - 0.5) * (60 + u * 520), l = 10 + u * 40; ctx.globalAlpha = 0.3 + 0.6 * u; ctx.beginPath(); ctx.moveTo(x - l, y); ctx.quadraticCurveTo(x, y - 6 - u * 6, x + l, y); ctx.stroke(); } ctx.globalAlpha = 1; });
  // the raft, from behind and a little above: a yellow tube, a blue floor, four rafters in helmets and vests paddling
  P.screen((ctx) => { const bx = 960 + Math.sin(t * 0.6) * 40, by = 930 + Math.sin(t * 1.7) * 6, rot = Math.sin(t * 0.9) * 0.03; ctx.save(); ctx.translate(bx, by); ctx.rotate(rot); ctx.scale(0.72, 0.72);
    ctx.fillStyle = 'rgba(10,60,70,0.35)'; ctx.beginPath(); ctx.ellipse(0, 70, 300, 40, 0, 0, 7); ctx.fill();
    for (let i = 0; i < 6; i++) { const w = (t * 3 + i) % 6; ctx.strokeStyle = `rgba(255,255,255,${0.5 - w * 0.08})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 70 + w * 18, 290 + w * 30, 30 + w * 6, 0, 0.2, Math.PI - 0.2); ctx.stroke(); }
    const tube = (rx, ry, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.fill(); };
    tube(270, 120, '#d89a1a'); tube(262, 112, '#f6c234'); ctx.fillStyle = '#2a4a9a'; ctx.beginPath(); ctx.ellipse(0, -6, 210, 76, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe48a'; ctx.beginPath(); ctx.ellipse(-60, -96, 160, 14, -0.05, 0, 7); ctx.fill();
    ctx.strokeStyle = '#1a2a4a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 240, 100, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
    [[-100, -30, '#e84a3a', '#f2d23a', 0], [100, -30, '#f0a030', '#e84a3a', 1.6], [-100, 40, '#3a6ad0', '#3a8ad0', 3.1], [100, 40, '#e85a5a', '#f2d23a', 4.4]].forEach(([px, py, vest, helm, ph]) => {
      const pad = Math.sin(t * 3 + ph), side = px < 0 ? -1 : 1;
      ctx.strokeStyle = '#5a4030'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(px + side * 30, py - 40 + pad * 20); ctx.lineTo(px + side * 150, py + 70 - pad * 30); ctx.stroke(); ctx.fillStyle = '#f2d23a'; ctx.beginPath(); ctx.ellipse(px + side * 156, py + 78 - pad * 30, 14, 26, side * 0.6, 0, 7); ctx.fill();
      ctx.fillStyle = '#2a2a3a'; ctx.fillRect(px - 26, py - 96, 52, 30); ctx.fillStyle = vest; ctx.beginPath(); ctx.roundRect(px - 34, py - 130, 68, 82, 18); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(px - 34, py - 104, 68, 8);
      ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.arc(px, py - 150, 24, 0, 7); ctx.fill(); ctx.fillStyle = helm; ctx.beginPath(); ctx.arc(px, py - 156, 26, Math.PI, 0); ctx.fill(); ctx.fillRect(px - 26, py - 158, 52, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(px - 8, py - 170, 9, 5, -0.4, 0, 7); ctx.fill(); });
    ctx.restore(); });
  const cu = tw(t, t0 + 1, t0 + 7, 'linear'); P.screen(() => P.at(lerp(-150, 2070, cu), 230 + Math.sin(t) * 12, 0, 1, -1, () => Animals.bird(t, 0, 0, 1.4, 'condor', { fly: true, dir: 1 })));
}

// ---------- the Permian dune sea (~275 Ma, the pale Coconino band) ----------
// Sharp-crested dunes in rows to the horizon (lit windward faces, violet-shaded slip faces, sand smoking off the crests).
// On the near slope the real track-makers of the Coconino: a small sprawling mammal relative (its trackway is the famous
// fossil), a scorpion and a millipede with their own tiny trails. No plants on the dunes. At the end the slope turns to
// stone: the same tracks in pale sandstone, with the dunes' slanted cross-bedding lines.
// a small synapsid (early relative of mammals) in profile: low sprawling body, deep snout, long tail, faint back stripes
LIFE.synapsid = (t, x, y, s, o = {}) => { const col = o.col ?? '#b07448', dark = P.mixc(col, '#2a1420', 0.42), ph = t * 8, walk = o.walk ?? 1;
  P.at(x, y, 0, s * (o.dir ?? 1), s, () => {
    P.circle(2, 0, 40, 'rgba(110,50,40,0.2)', { ry: 3.5 });
    const leg = (lx, p, c) => { const sw = Math.sin(ph + p) * 7 * walk, lift = Math.max(0, Math.cos(ph + p)) * 3 * walk; P.ribbon([[lx, 11], [lx + 6 + sw * 0.5, 5 + lift], [lx + 3 + sw, lift + 0.8]], [4.4, 3.6, 2.6], c); P.ribbon([[lx + sw, lift + 0.6], [lx + 7 + sw, lift + 0.6]], 1.8, c); };
    leg(17, Math.PI, dark); leg(-15, 0, dark);
    const tail = []; for (let i = 0; i <= 10; i++) { const u = i / 10; tail.push([-22 - u * 44, 12 - u * 9 + Math.sin(ph * 0.5 - u * 3) * 2.2 * walk * u]); }
    P.ribbon(tail, [7.5, 6.8, 6, 5.2, 4.4, 3.7, 3, 2.4, 1.8, 1.2, 0.6], col);
    P.lit(P.blobPts(0, 13, 27, 8.5, 18, 0.03, 5), col, { d: 0.24 });
    for (let i = 0; i < 5; i++) P.circle(-14 + i * 7, 17.5, 2.6, P.mixc(col, '#3a1a20', 0.22), { ry: 1.6 });
    P.lit([[20, 17.5], [31, 21], [43, 18], [49, 12.5], [45, 8.5], [28, 7.5], [20, 9.5]], col, { d: 0.22 });
    P.ribbon([[32, 10], [47, 11.2]], 1.1, dark); P.circle(47.5, 14.2, 0.9, dark);
    Cast.profileFace(t, 37, 16, 2.6, { mood: 'smile', seed: 3, mouth: [1.2, -1.0], nose: false });
    leg(15, 0, col); leg(-17, Math.PI, col);
  }); };
// a desert scorpion in profile: segmented body, claws forward, the tail curled over the back
LIFE.scorpion = (t, x, y, s, dir = 1, col = '#5a3a3a') => P.at(x, y, 0, s * dir, s, () => { const ph = t * 12, light = P.mixc(col, '#f0c8a0', 0.3);
  P.circle(0, 0, 18, 'rgba(110,50,40,0.2)', { ry: 2 });
  for (let i = 0; i < 4; i++) { const lx = -6 + i * 4, sw = Math.sin(ph + i * 1.6) * 1.6; P.ribbon([[lx, 4], [lx + 2 + sw, 6], [lx + 3 + sw, 0]], 0.9, col); }
  P.lit(P.blobPts(0, 4, 10, 3.2, 12, 0.02, 2), col, { d: 0.25 });
  const tail = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 - i / 8 * 1.15); tail.push([-9 + Math.cos(a) * 9 - 6, 4 + Math.sin(a) * 11 + Math.sin(t * 2) * 0.4 * i]); }
  P.ribbon(tail, [3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1.6, 1.4], col); const [ex, ey] = tail[8]; P.circle(ex + 1, ey - 1, 2, light); P.ribbon([[ex + 1.6, ey - 2], [ex + 3.4, ey - 3]], 0.8, '#2a1a1a');
  for (const k of [0, 1]) { const cx = 14 + k, cy = 5 + k * 0.6; P.ribbon([[8, 4.5], [cx - 2, cy + 1]], 1.4, k ? col : light); P.lit(P.blobPts(cx, cy, 3, 1.8, 10, 0.02, 3 + k), k ? col : light, { d: 0.2 }); P.ribbon([[cx + 2, cy + 1.2], [cx + 5, cy + 1.8]], 0.9, col); P.ribbon([[cx + 2, cy - 0.4], [cx + 5, cy + 0.6]], 0.9, col); }
  P.circle(9, 6.5, 0.7, '#ffffff');
});
// a millipede: a ribbon of rounded segments with a ripple of legs
LIFE.millipede = (t, x, y, s, dir = 1, col = '#4a2a3a') => P.at(x, y, 0, s * dir, s, () => { const n = 14;
  for (let i = 0; i < n; i++) { const sx = -i * 3, sy = 2.2 + Math.sin(t * 5 - i * 0.6) * 0.5; P.ribbon([[sx, sy], [sx + Math.sin(t * 14 - i * 0.9) * 1.2, 0]], 0.6, P.mixc(col, '#000', 0.2)); P.circle(sx, sy + 1, 2.1, i % 2 ? col : P.mixc(col, '#c88a6a', 0.25)); }
  P.circle(2, 3.4, 2.3, col); P.ribbon([[3.5, 4.5], [6, 6.5]], 0.5, col); P.circle(3, 4, 0.5, '#ffffff');
});
// one footprint (a rounded pad with short toes), seen from above, flattened by the viewing angle
LIFE.print = (x, y, r, col, front) => { P.circle(x, y, r, col, { ry: r * 0.42 }); for (let k = 0; k < (front ? 4 : 5); k++) P.circle(x + r * (0.9 + (k % 2) * 0.2), y + (k - 2) * r * 0.32, r * 0.24, col, { ry: r * 0.14 }); };

function duneScene(t, t0) {
  const u = t - t0, pan = u * 14, stone = tw(t, t0 + 6.2, t0 + 7.6, 'inOut');
  P.cam({ x: 960, y: 540, h: 1080 });
  const sky = '#f8d6b8';
  // sky: a dusty warm haze, a low sun on the left (lights the windward faces), a faint dust devil far off
  P.screen((ctx) => { const g = ctx.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, '#e88a6a'); g.addColorStop(0.55, '#f6b890'); g.addColorStop(1, sky); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    const sx = 360 - pan * 0.05, r = ctx.createRadialGradient(sx, 300, 0, sx, 300, 420); r.addColorStop(0, 'rgba(255,246,214,0.85)'); r.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, 1920, 1080);
    ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(sx, 300, 70, 0, 7); ctx.fill();
    { const dx = 1460 - pan * 0.12, L = [], R = []; for (let i = 0; i <= 12; i++) { const y = 480 - i * 24, w = 6 + i * i * 0.5, x = dx + Math.sin(t * 2.4 + i * 0.5) * (2 + i * 1.6); L.push([x - w, y]); R.unshift([x + w, y]); }
      const g2 = ctx.createLinearGradient(0, 480, 0, 190); g2.addColorStop(0, 'rgba(214,140,104,0.45)'); g2.addColorStop(1, 'rgba(214,140,104,0)'); ctx.fillStyle = g2; ctx.beginPath(); [...L, ...R].forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill(); } });
  // rows of dunes, far to near: [base y, height, wavelength, offset, parallax, haze]
  const rows = [[500, 70, 520, 0.13, 0.12, 0.72], [430, 110, 640, 0.41, 0.25, 0.52], [330, 150, 820, 0.77, 0.45, 0.32], [210, 190, 1050, 0.29, 0.7, 0.14]];
  rows.forEach(([base, amp, lam, off, par, hz], ri) => {
    const sh = -pan * par, lit = P.mixc(P.mixc('#f8cc90', '#f2b07a', ri / 3), sky, hz), shade = P.mixc(P.mixc('#b86a5a', '#9a4a5a', ri / 3), sky, hz * 0.9), crestC = P.mixc('#fff0d0', sky, hz);
    // the profile: a gentle windward rise to a sharp crest, then the steep slip face (the wind blows left to right)
    const H = (x) => { const p = (x - sh) / lam + off, i = Math.floor(p), f = p - i, a = amp * (0.65 + 0.5 * K.hash(i, ri + 11)); return base + a * (f < 0.72 ? Math.pow(Math.sin(f / 0.72 * Math.PI / 2), 1.6) : Math.pow(1 - (f - 0.72) / 0.28, 1.4)); };
    const prof = []; for (let x = -40; x <= 1960; x += 8) prof.push([x, H(x)]);
    P.poly([[-40, -100], ...prof, [1960, -100]], P.lin(0, base + amp, 0, base - 120, lit, P.mixc(lit, shade, 0.25)));
    // slip faces: from each crest, a shaded wedge that curls back under the crest (the dune's horn turning toward us)
    const i0 = Math.floor((-40 - sh) / lam + off) - 1, i1 = Math.floor((1960 - sh) / lam + off) + 1;
    for (let i = i0; i <= i1; i++) { const xc = (i + 0.72 - off) * lam + sh, xt = (i + 1 - off) * lam + sh, yc = H(xc - 0.01), pts = []; for (let k = 0; k <= 12; k++) { const x = lerp(xc, xt, k / 12); pts.push([x, H(x)]); }
      const low = base - 150 - amp * 0.3; pts.push([xt + lam * 0.05, low], [xc - lam * 0.06, low + (yc - low) * 0.3], [xc - lam * 0.015, yc - (yc - low) * 0.12]);
      P.poly(pts, P.lin(xc, yc, xt, low, shade, P.mixc(shade, lit, 0.18)));
      P.ribbon([[xc - lam * 0.3, H(xc - lam * 0.3)], [xc - lam * 0.15, H(xc - lam * 0.15)], [xc - 1, yc]], 2.4 - ri * 0.2 + 0.6, crestC);
      // sand smoking off the crest, blowing right
      if (ri >= 2) for (let k = 0; k < 5; k++) { const ph = (u * 0.9 + K.hash(i, k + 3)) % 1, sx = xc + ph * 90, sy = yc + 6 - ph * 14 + k * 3; P.alpha((1 - ph) * 0.45, () => P.ribbon([[sx, sy], [sx + 26, sy - 2], [sx + 50, sy - 6]], [3, 2, 0.5], crestC)); } }
    // wind ripples on the nearer rows
    if (ri >= 2) for (let j = 1; j < 7; j++) { const pts = []; for (let x = -40; x <= 1960; x += 16) pts.push([x, H(x) - j * (14 + ri * 4) + Math.sin(x * 0.03 + j) * 2]); P.alpha(0.22, () => P.ribbon(pts, 1.6, P.mixc(shade, lit, 0.4))); }
  });
  // the near slope (a third of the frame): sand rising to the right, ripples, the trackway; at the end it turns to stone
  const ns = (x) => 140 + x * 0.1 + Math.sin(x * 0.004) * 16, nsh = -pan * 1.0;
  const sand = P.mixc('#f6c890', '#e8e0d0', stone), sandD = P.mixc('#e0a070', '#c8b8a8', stone);
  const top = []; for (let x = -40; x <= 1960; x += 10) top.push([x, ns(x)]);
  P.poly([[-40, -60], ...top, [1960, -60]], P.lin(0, 330, 0, 0, sand, sandD));
  P.clip(() => P.trace([[-40, -60], ...top, [1960, -60]], true, 0), () => {
    // ripples (sand) fade into slanted cross-bedding lines (stone)
    for (let j = 0; j < 14; j++) { const pts = []; for (let x = -40; x <= 1960; x += 16) pts.push([x, ns(x) - 14 - j * 22 + Math.sin((x - nsh) * 0.025 + j * 1.3) * 3]); P.alpha(0.28 * (1 - stone), () => P.ribbon(pts, 2, '#d08a60')); }
    for (let j = 0; j < 22; j++) { const x0 = -200 + j * 110; P.alpha(0.35 * stone, () => P.ribbon([[x0, 400], [x0 + 260, -40]], 2.2, '#a89888')); }
    for (let j = 0; j < 3; j++) P.alpha(0.5 * stone, () => P.ribbon([[-40, 120 - j * 70], [1960, 300 - j * 70]], 3, '#9a8a7a'));
  });
  // the trackway: one print per step, behind the walker
  const x0 = 260, xw = lerp(x0, 1160, tw(t, t0 + 0.4, t0 + 6.4, 'linear')), step = 30, slope = Math.atan(0.1);
  for (let x = x0, n = 0; x < xw - 46; x += step, n++) { const side = n % 2 ? 1 : -1; LIFE.print(x, ns(x) - 18 + side * 7, 5.5, P.mixc('rgba(150,80,50,0.55)', 'rgba(110,95,85,0.8)', stone), n % 4 < 2); }
  // the scorpion's dotted trail and the millipede's fine ladder trail cross the slope lower down
  const xs = lerp(1500, 900, tw(t, t0, t0 + 6.4, 'linear')), xm = lerp(100, 560, tw(t, t0, t0 + 6.4, 'linear'));
  for (let x = xs + 30; x < 1560; x += 9) for (const d of [-4, 4]) P.circle(x, ns(x) - 70 + d + (Math.round(x / 9) % 2) * 2, 1.4, 'rgba(140,80,60,0.5)');
  for (let x = 60; x < xm - 40; x += 5) P.ribbon([[x, ns(x) - 40 - 3], [x, ns(x) - 40 + 3]], 1, 'rgba(140,80,60,0.4)');
  if (stone < 0.95) P.alpha(1 - stone, () => {
    LIFE.scorpion(t, xs, ns(xs) - 72, 2.3, -1); LIFE.millipede(t, xm, ns(xm) - 40, 2.2, 1);
    P.at(xw, ns(xw) - 14, slope, 1, 1, () => LIFE.synapsid(t, 0, 0, 2.6, { walk: u < 6.4 ? 1 : 0.15 }));
  });
}
