// The Raindrop (Drip's road trip): 11 scenes joined by camera moves (zoom-throughs, a rise, a fall, a slide).
// Scene windows overlap; the later scene fades in over the earlier one during the overlap.
const { lerp, clamp, tw, track, logTrack, hash, noise } = K;
// small icons for the fact pills (screen space, radius r)
const ICON = {
  sea: (ctx, r) => { ctx.fillStyle = '#2a86c8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#bfeaff'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.moveTo(-r * 0.7, 0); ctx.quadraticCurveTo(-r * 0.35, -r * 0.4, 0, 0); ctx.quadraticCurveTo(r * 0.35, r * 0.4, r * 0.7, 0); ctx.stroke(); },
  cloud: (ctx, r) => { ctx.fillStyle = '#8fb4e8'; for (const [x, y, k] of [[-0.4, 0.15, 0.45], [0.05, -0.15, 0.6], [0.45, 0.15, 0.42]]) { ctx.beginPath(); ctx.arc(x * r, y * r, k * r, 0, 6.3); ctx.fill(); } ctx.fillRect(-0.85 * r, 0.1 * r, 1.7 * r, 0.45 * r); },
  sun: (ctx, r) => { ctx.fillStyle = '#ffb03a'; ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#ffb03a'; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75); ctx.lineTo(Math.cos(a) * r * 1.0, Math.sin(a) * r * 1.0); ctx.stroke(); } },
  river: (ctx, r) => { ctx.strokeStyle = '#1e9aa8'; ctx.lineWidth = r * 0.42; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.6); ctx.quadraticCurveTo(r * 0.8, -r * 0.3, -r * 0.2, r * 0.2); ctx.quadraticCurveTo(-r * 0.9, r * 0.6, r * 0.8, r * 0.7); ctx.stroke(); },
};
const fact = (t, t0, t1, str, sx, sy, icon) => P.pill(str, sx, sy, { u: tw(t, t0, t0 + 0.35) * (1 - tw(t, t1 - 0.3, t1)), font: FONT, size: 42, weight: 700, icon: ICON[icon] });
const hero = (t, fn) => fn();

// 1. 0-11.2: a rainy window; one drop; little thought-bubbles (ocean, cloud, dinosaur); the camera dives into the drop
const dropPos = (t) => [140, 120 - 70 * tw(t, 1.0, 6.8, 'inOut2')];
function sWindow(t, end = false) {
  P.sky('#3c4f78', '#9aaccc', '#6d80a8');
  P.screen((ctx) => { for (let i = 0; i < 26; i++) { const x = hash(i, 1) * 1920, y = 300 + hash(i, 2) * 700, r = 40 + 90 * hash(i, 3); const g = ctx.createRadialGradient(x, y, 0, x, y, r); const c = i % 3 ? '255,200,120' : '160,220,255'; g.addColorStop(0, `rgba(${c},0.35)`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); } ctx.strokeStyle = 'rgba(220,235,255,0.25)'; ctx.lineWidth = 2; for (let i = 0; i < 60; i++) { const x = (hash(i, 9) * 2200 + t * 300) % 2200 - 140, y = (hash(i, 8) * 1300 + t * 1400) % 1300 - 120; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 70); ctx.stroke(); } });
  const zoomIn = end ? 0 : tw(t, 6.6, 11.2, 'expoIn');
  const [dx, dy] = dropPos(end ? 0 : t);
  P.cam({ x: lerp(dx * 0.4, dx, tw(t, 6.0, 9.0, 'inOut')), y: lerp(dy + 120, dy, tw(t, 6.0, 9.0, 'inOut')), h: 640 * Math.pow(0.02, zoomIn) });
  // glass drops and streaks
  for (let i = 0; i < 40; i++) { const x = (hash(i, 21) * 2 - 1) * 900, y0 = (hash(i, 22) * 2 - 1) * 520, sl = i % 4 === 0 ? ((t * 60 * (0.5 + hash(i, 23))) % 1200) : 0, y = ((y0 - sl + 600) % 1200 + 1200) % 1200 - 600, r = 8 + 22 * hash(i, 24); if (sl) P.ribbon([[x, y], [x, y + 140]], [r * 0.5, 1], 'rgba(220,240,255,0.18)'); P.lit(P.blobPts(x, y, r, r * 1.05, 10, 0.08, i), 'rgba(200,230,255,0.35)', { d: 0.2, shade: 'rgba(20,40,80,0.25)', rim: 'rgba(255,255,255,0.6)' }); }
  // the hero drop
  P.at(dx, dy, 0, 1.5, 1.5, () => { P.ribbon([[0, 0], [0, 180]], [36, 2], 'rgba(220,240,255,0.2)'); P.lit(P.blobPts(0, 0, 60, 66, 14, 0.03, 3), P.rad(-14, 18, 80, 'rgba(230,248,255,0.85)', 'rgba(140,200,255,0.55)', 'rgba(60,110,190,0.6)'), { d: 0.2, rim: 'rgba(255,255,255,0.8)' }); P.circle(-20, 24, 12, 'rgba(255,255,255,0.8)', { ry: 7, rot: 0.5 }); for (let i = 0; i < 9; i++) P.circle((hash(i, 31) * 2 - 1) * 30, (hash(i, 32) * 2 - 1) * 30, 5, 'rgba(79,179,255,0.5)'); });
  if (end) { const w = tw(t, 115.2, 115.7, 'backOut'); if (w > 0) drawDrip(t, dx, dy, 0.9 * w, { mood: 'happy', arms: 'wave', wave: 1, look: [0, 0] }); }
  // the thought bubbles above the drop: ocean, cloud, dinosaur
  if (!end) [[2.7, 'ocean', -170, 190], [3.8, 'cloud', 0, 250], [5.0, 'dino', 170, 190]].forEach(([t0, k, bx, by]) => {
    const u = K.ease.backOut(clamp((t - t0) / 0.4)) * (1 - tw(t, 6.6, 7.2)); if (u <= 0) return;
    P.at(dx + bx * 1.2, dy + by * 1.1, 0, u * 1.25, u * 1.25, () => {
      P.circle(0, 0, 70, 'rgba(255,255,255,0.92)'); P.circle(-bx * 0.25, -70 - 10, 12, 'rgba(255,255,255,0.8)');
      if (k === 'ocean') { P.clip(() => { P.ctx.beginPath(); P.ctx.arc(0, 0, 62, 0, 6.3); }, () => { P.rect(-70, -70, 140, 70, '#2a86c8'); P.smooth([[-70, 0], [-35, 14 + Math.sin(t * 4) * 6], [0, 0], [35, 14 + Math.sin(t * 4 + 1) * 6], [70, 0], [70, -10], [-70, -10]], '#58c4f0'); }); }
      if (k === 'cloud') drawCloud(0, -10, 0.32, 3, '#ffffff', 'rgba(140,150,200,0.35)');
      if (k === 'dino') P.at(-20, -42, 0, 0.11, 0.11, () => drawDino(t, 0, 0, 1, 0.2, '#6fa05a'));
    });
  });
}
// 2. 10.2-15.6: inside the drop: a crowd of molecules; Drip turns to us and waves; the passport appears
function sMolecules(t) {
  P.sky('#1f6fb8', '#7fd0ff', '#3b9be0');
  P.cam({ x: 0, y: 0, h: 1080 * logTrack([[10.2, 1.8], [11.4, 0.62, 'out'], [14.0, 0.58], [15.6, 6, 'expoIn']])(t) });
  for (let i = 0; i < 70; i++) { const a = i * 2.39996, r = 120 + 12 * Math.sqrt(i) * 9, x = Math.cos(a) * r * 1.3, y = Math.sin(a) * r * 0.8; drawMol(t, x, y, 0.75 + 0.3 * hash(i, 41), i + 3, { jiggle: 1 }); }
  const turn = tw(t, 11.4, 11.9, 'backOut');
  drawDrip(t, 0, -10, 1.35, { mood: turn > 0.5 ? 'happy' : 'smile', look: [lerp(-0.8, 0, turn), 0], wave: tw(t, 11.8, 12.2), arms: t > 11.9 ? 'wave' : null, sq: K.squash(t, 11.5, 0.12, 0.3) });
  // suitcase
  const sc = K.ease.backOut(clamp((t - 13.0) / 0.4)); if (sc > 0) P.at(130, -150, -0.1, sc, sc, () => { P.rect(-60, -40, 120, 80, P.lin(0, -40, 0, 40, '#c4542f', '#e8774a'), { r: 10 }); P.rect(-22, 40, 44, 16, 'rgba(0,0,0,0)', { r: 6 }); P.ctx.save(); P.ctx.strokeStyle = '#7a2f1a'; P.ctx.lineWidth = 6; P.ctx.beginPath(); P.ctx.roundRect(-22, 38, 44, 24, 8); P.ctx.stroke(); P.ctx.restore(); P.rect(-60, -6, 120, 8, '#7a2f1a'); for (const sx of [-38, 30]) P.circle(sx, 18, 9, ['#ffd36b', '#7fd0ff'][sx > 0 ? 1 : 0]); });
}
// 3. 14.6-26.6: the deep ocean. 97%. The queue. Stamp. Then up toward the light
function sOcean(t) {
  const rise = tw(t, 24.0, 26.6, 'in');
  P.sky(P.mixc(C.sea0, '#1f86a8', rise), P.mixc('#06182c', C.sea1, rise));
  P.screen((ctx) => { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 300 + i * 280 + Math.sin(t * 0.3 + i) * 60; const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, `rgba(120,220,255,${0.12 + rise * 0.15})`); g.addColorStop(1, 'rgba(120,220,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 40, 0); ctx.lineTo(x + 40, 0); ctx.lineTo(x + 220, 1080); ctx.lineTo(x + 40, 1080); ctx.fill(); } ctx.fillStyle = 'rgba(220,240,255,0.5)'; for (let i = 0; i < 70; i++) { const x = hash(i, 51) * 1920 + Math.sin(t + i) * 10, y = (hash(i, 52) * 1080 + t * 12) % 1080; ctx.fillRect(x, y, 3, 3); } });
  P.cam({ x: 0, y: lerp(0, 900, rise), h: 1080 * logTrack([[14.6, 6], [15.8, 1.0, 'out'], [24, 0.95]])(t) });
  // the whale glides behind, the fish school crosses, a jellyfish bobs
  P.alpha(0.55, () => drawWhale(t, lerp(1400, -1500, tw(t, 15.5, 23.5, 'linear')), 380, 1.4));
  for (let i = 0; i < 22; i++) { const fx = lerp(-1400, 1500, tw(t, 15.2, 20.5, 'linear')) + (hash(i, 61) * 2 - 1) * 260 + Math.sin(t * 2 + i) * 20, fy = -330 + (hash(i, 62) * 2 - 1) * 110; drawFish(t, -fx, fy, 0.7 + 0.3 * hash(i, 63), i % 3 ? '#ffb25a' : '#ff7f6e', i); }
  drawJelly(t, -620 + Math.sin(t * 0.4) * 30, 120 + Math.sin(t * 0.7) * 40, 1.2, 1);
  drawJelly(t, 700, -40 + Math.sin(t * 0.6) * 40, 0.8, 2);
  // the queue (19.6-24): molecules holding tickets, Drip last, yawning
  const q = tw(t, 19.4, 20.2, 'out'), qo = 1 - tw(t, 23.9, 24.4);
  if (q > 0) P.alpha(q * qo, () => { for (let i = 0; i < 6; i++) { const x = -760 + i * 130 + (1 - q) * -400; drawMol(t, x, -40, 0.7, 70 + i, { jiggle: 0.3, mood: 'sleep' }); P.at(x + 40, -100, 0.2, 1, 1, () => { P.rect(-26, -14, 52, 28, '#fff3c8', { r: 4 }); P.at(0, 0, 0, 1, -1, () => { P.ctx.fillStyle = '#7a4a10'; P.ctx.font = `700 16px ${FONT}`; P.ctx.textAlign = 'center'; P.ctx.fillText('#' + (1000 + i * 437), 0, 6); }); }); } });
  const yawn = t > 21.6 && t < 22.5, inQueue = q * qo;
  const dx = lerp(0, 120, inQueue), dy = lerp(0, -40, inQueue) + Math.sin(t * 1.4) * 14 + lerp(0, 700, rise);
  drawDrip(t, dx, dy, 1.3, { mood: yawn ? 'wow' : t > 22.5 && t < 23.5 ? 'sleep' : 'happy', arms: inQueue > 0.5 ? 'hold' : rise > 0 ? 'up' : null, look: [0.3, 0.1] });
  if (inQueue > 0.5) P.at(dx + 92, dy - 14, 0.25, 1.2, 1.2, () => { P.rect(-44, -18, 88, 36, '#fff3c8', { r: 5 }); P.at(0, 0, 0, 1, -1, () => { P.ctx.fillStyle = '#7a4a10'; P.ctx.font = `800 18px ${FONT}`; P.ctx.textAlign = 'center'; P.ctx.fillText('3,000 yrs', 0, 6); }); });
  // 97%: a ring fills
  const ru = tw(t, 16.4, 18.4, 'out'), ra = tw(t, 16.2, 16.6) * (1 - tw(t, 19.4, 19.8));
  if (ra > 0) P.screen((ctx) => { ctx.globalAlpha = ra; ctx.lineCap = 'round'; ctx.lineWidth = 34; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(1460, 560, 170, 0, 6.3); ctx.stroke(); ctx.strokeStyle = '#7fe0ff'; ctx.beginPath(); ctx.arc(1460, 560, 170, -Math.PI / 2, -Math.PI / 2 + ru * 0.97 * Math.PI * 2); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.font = `800 96px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(Math.round(ru * 97) + '%', 1460, 548); ctx.font = `600 34px ${FONT}`; ctx.fillText("of Earth's water", 1460, 622); });
  fact(t, 22.6, 25.4, 'about 3,000 years in the sea', 960, 860, 'sea');
  bubbles(t, 30, 71, 0.8, 140);
}
// 4. 25.6-38.2: the sunlit surface; jiggle; trampoline; launch as vapour, the camera rises with Drip
function sSurface(t) {
  const up = tw(t, 33.4, 38.2, 'inOut');
  P.sky(P.mixc('#ffb38a', C.cold0, up), P.mixc('#ffe8c8', C.cold1, up));
  P.cam({ x: 0, y: lerp(-20, 1500, up), h: lerp(780, 1080, up) });
  // the Sun and its rays
  P.at(620, 420, 0, 1, 1, () => { P.glow(0, 0, 460, '255,220,140', 0.9); P.circle(0, 0, 110, P.rad(-20, 20, 130, '#fffbe6', '#ffd66b', '#ffb03a')); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t * 0.2; P.ribbon([[Math.cos(a) * 140, Math.sin(a) * 140], [Math.cos(a) * 200, Math.sin(a) * 200]], [14, 4], 'rgba(255,214,107,0.8)'); } });
  for (let i = 0; i < 4; i++) { const x = -700 + i * 420; P.ribbon([[620, 420], [x + Math.sin(t * 3 + i) * 30, 60]], [6, 2], `rgba(255,200,100,${0.25 + 0.15 * Math.sin(t * 5 + i)})`); }
  drawCloud(-560, 620 + Math.sin(t * 0.4) * 10, 0.9, 5, '#fff4ea', 'rgba(255,150,120,0.25)'); drawCloud(-200, 1350, 1.2, 9, '#f6eaff', 'rgba(150,120,200,0.3)');
  // far island with palms, a sailboat, gulls
  P.at(-760, 30, 0, 1, 1, () => { P.smooth([[-180, -10], [-90, 60], [40, 70], [160, -10]], P.lin(0, 70, 0, -10, '#f2d69a', '#d9b46a')); for (const [px, h2, a] of [[-40, 170, -0.15], [30, 140, 0.12]]) { P.ribbon([[px, 50], [px + Math.sin(a) * h2 * 0.5, 50 + h2 * 0.5], [px + Math.sin(a) * h2, 50 + h2]], [10, 8, 6], '#8a5a3a'); for (let k = 0; k < 5; k++) { const la = -1.2 + k * 0.6 + Math.sin(t * 2 + k) * 0.06; P.ribbon([[px + Math.sin(a) * h2, 50 + h2], [px + Math.sin(a) * h2 + Math.cos(la) * 70, 50 + h2 + Math.sin(la) * 40 - 20]], [14, 2], '#3f9f55'); } } });
  P.at(420 + Math.sin(t * 0.3) * 40, 20 + Math.sin(t * 1.6) * 6, Math.sin(t * 1.6) * 0.06, 1, 1, () => { P.smooth([[-90, 0], [90, 0], [60, -34], [-60, -34]], '#d9534f'); P.rect(-3, 0, 6, 190, '#6e4024'); P.poly([[6, 30], [6, 180], [90, 40]], '#fff6e6'); P.poly([[-6, 40], [-6, 150], [-70, 50]], '#ffe0c0'); });
  for (let i = 0; i < 4; i++) { const gx = ((t * 90 + i * 380) % 2400) - 1200, gy = 300 + i * 60 + Math.sin(t * 2 + i) * 20, fl = Math.sin(t * 10 + i) * 0.7; P.ribbon([[gx - 28, gy + fl * 16], [gx, gy], [gx + 28, gy + fl * 16]], 6, '#ffffff'); }
  const ff = clamp((t - 28.4) / 1.2); if (ff > 0 && ff < 1) P.at(-300 + ff * 520, Math.sin(ff * Math.PI) * 220 - 40, -0.6 + ff * 1.2, 0.9, 0.9, () => { drawFish(t, 0, 0, 1, '#7fd0ff', 9); for (const k of [-1, 1]) P.smooth([[-4, 4], [20, 40 * k], [34, 30 * k]], 'rgba(220,245,255,0.8)'); });
  for (let i = 0; i < 9; i++) { const sx = -900 + i * 230 + Math.sin(i) * 40, u = ((t * 0.35 + hash(i, 85)) % 1); P.ribbon([[sx, 10 + u * 300], [sx + Math.sin(t * 2 + i) * 30, 70 + u * 300], [sx + Math.sin(t * 2 + i + 1) * 40, 130 + u * 300]], [16 * (1 - u), 10 * (1 - u), 2], `rgba(255,255,255,${0.35 * Math.sin(u * Math.PI) * (0.5 + 0.5 * tw(t, 26.2, 29))})`); }
  // the sea below: waves, depth gradient
  const wave = (x) => Math.sin(x * 0.01 + t * 2) * 14 + Math.sin(x * 0.023 - t * 1.4) * 8;
  const top = []; for (let x = -1100; x <= 1100; x += 40) top.push([x, wave(x)]);
  P.poly([...top, [1100, -1600], [-1100, -1600]], P.lin(0, 0, 0, -900, '#3ec4e6', C.sea1));
  for (let i = 0; i < 9; i++) { const x = -900 + i * 220 + Math.sin(t + i) * 20; P.ribbon([[x, wave(x) - 10], [x + 90, wave(x + 90) - 10]], 5, 'rgba(255,255,255,0.45)'); }
  // molecules jiggling at the surface, faster and faster
  const heat = tw(t, 26.2, 31.0, 'in');
  for (let i = 0; i < 12; i++) { const x = -1000 + i * 180; if (Math.abs(x - 0) < 120) continue; drawMol(t, x, -70 + wave(x) * 0.6, 0.55, 90 + i, { jiggle: 0.6 + heat * 2.2, mood: heat > 0.6 ? 'wow' : 'smile' }); }
  // Drip: jiggle, two trampoline bounces, launch, vapour
  const b1 = Math.sin(clamp((t - 31.0) / 0.8) * Math.PI) * 120, b2 = Math.sin(clamp((t - 31.9) / 1.1) * Math.PI) * 260, launch = tw(t, 33.2, 37.8, 'out');
  const dy = -60 + Math.max(b1, b2) + launch * 1500 + K.noise(t * 30, 1) * heat * 12, dx = K.noise(t * 30, 2) * heat * 12 + Math.sin(t * 2) * launch * 60;
  const ghost = tw(t, 33.8, 34.6);
  if (t > 33.3 && t < 34.4) P.screen((ctx) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; const [sx, sy] = P.toScreen(dx, dy); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(sx + i * 30, sy + 90); ctx.lineTo(sx + i * 36, sy + 180); ctx.stroke(); } });
  drawDrip(t, dx, dy, 1.15, { mood: t > 33.2 ? 'happy' : heat > 0.5 ? 'wow' : 'smile', arms: t > 33.2 ? 'up' : null, ghost, sq: t > 31 && t < 33.2 ? K.squash(t, t < 31.9 ? 31.0 : 31.9, 0.22, 0.25) : [1, 1], look: [0, 0.6] });
  // the other vapour molecules rising too
  if (ghost > 0) for (let i = 0; i < 7; i++) { const x = -800 + i * 260, y = -40 + launch * (900 + hash(i, 81) * 500) + Math.sin(t * 2 + i) * 20; P.alpha(0.5 * ghost, () => drawMol(t, x, y, 0.5, 100 + i, { jiggle: 1, face: false })); }
}
// 5. 37.2-50.8: cold; shiver; the salt speck; huddle; pull out: a droplet, a feather, a cloud
function sCold(t) {
  const out = tw(t, 45.2, 50.8, 'inOut');
  P.sky(P.mixc(C.cold0, '#6f8fd8', out), P.mixc(C.cold1, '#f2e8ff', out));
  P.screen((ctx) => { ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 40; i++) { const x = (hash(i, 91) * 1920 + t * 20) % 1920, y = (hash(i, 92) * 1080 + Math.sin(t + i) * 30), s = 2 + 4 * hash(i, 93); ctx.save(); ctx.translate(x, y); ctx.rotate(t + i); ctx.fillRect(-s * 2, -1, s * 4, 2); ctx.fillRect(-1, -s * 2, 2, s * 4); ctx.restore(); } });
  const h = 1080 * logTrack([[37.2, 0.72], [45.2, 0.8], [47.6, 9, 'inOut'], [50.8, 110, 'inOut']])(t);
  P.cam({ x: 0, y: lerp(0, h * 0.05, out), h });
  // the big cloud, seen only from far
  const far = tw(h, 30000, 90000); if (far > 0) P.alpha(far, () => drawCloud(-30000, -8000, 240, 7, '#ffffff', 'rgba(140,130,200,0.35)'));
  // other droplets around ours (visible from mid zoom)
  const mid = tw(h, 2500, 6000) * (1 - tw(h, 60000, 110000)); if (mid > 0) for (let i = 0; i < 60; i++) { const x = (hash(i, 101) * 2 - 1) * 60000, y = (hash(i, 102) * 2 - 1) * 34000; P.alpha(mid, () => { P.circle(x, y, 340, P.rad(x - 100, y + 100, 420, 'rgba(230,248,255,0.9)', 'rgba(120,190,255,0.7)')); P.circle(x - 110, y + 120, 60, 'rgba(255,255,255,0.7)'); }); }
  // the feather: drifts past and falls faster than our droplet (47-50.5)
  const fu = tw(t, 46.8, 50.6, 'linear'); if (fu > 0 && fu < 1) P.at(2400 + Math.sin(fu * 12) * 500, 6000 - fu * 14000, Math.sin(fu * 12) * 0.5, 9, 9, () => { P.ribbon([[0, -90], [0, 90]], [6, 2], '#e7dfd2'); for (let k = -1; k <= 1; k += 2) P.smooth([[0, -70], [k * 50, -30], [k * 44, 40], [0, 90]], 'rgba(255,250,240,0.95)'); });
  // the droplet shell around the huddle
  const shell = tw(t, 44.4, 45.6); if (shell > 0) P.alpha(shell, () => { P.circle(0, 0, 360, P.rad(-100, 120, 460, 'rgba(230,248,255,0.55)', 'rgba(140,200,255,0.35)', 'rgba(80,140,220,0.35)')); P.circle(-130, 150, 70, 'rgba(255,255,255,0.6)', { ry: 40, rot: 0.6 }); });
  // the salt cube drifts in; molecules gather on it
  const salt = tw(t, 40.4, 42.0, 'out'); if (salt > 0) drawSalt(lerp(900, 0, salt), lerp(300, -30, salt), 1.6, Math.sin(t) * 0.2 + (1 - salt) * 3);
  const hud = tw(t, 42.0, 44.6, 'inOut');
  for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.283, fx = Math.cos(a) * (480 + hash(i, 111) * 260) + Math.sin(t * 1.3 + i) * 40, fy = Math.sin(a) * (300 + hash(i, 112) * 120) + Math.cos(t + i) * 20, hx = Math.cos(a) * 230, hy = Math.sin(a) * 200; drawMol(t, lerp(fx, hx, hud), lerp(fy, hy, hud), 0.62, 120 + i, { jiggle: 0.4, mood: hud > 0.8 ? 'happy' : 'worried', face: true }); }
  const shiver = tw(t, 37.8, 38.2) * (1 - tw(t, 43.5, 44.5));
  drawDrip(t, lerp(-260, 60, hud), lerp(80, 80, hud), 1.0, { ghost: 1 - tw(t, 37.4, 38.6), mood: shiver > 0.3 ? 'worried' : 'happy', shiver, arms: shiver > 0.3 ? 'hold' : 'wave', look: [0.6, -0.2] });
  fact(t, 48.0, 50.8, 'about 9 days in the air', 960, 900, 'cloud');
  if (shiver > 0.3) P.screen((ctx) => { const [sx, sy] = P.toScreen(lerp(-260, 60, hud), 80); ctx.fillStyle = '#ffffff'; ctx.font = `800 64px ${FONT}`; ctx.textAlign = 'center'; ctx.globalAlpha = 0.85; ctx.fillText('brrr', sx + 200 + Math.sin(t * 40) * 4, sy - 120); });
}
// 6. 49.8-64: inside the storm cloud: merges, a million; the drop falls; not a tear: a bun
const dropS = (t) => lerp(0.35, 1.0, tw(t, 51.0, 55.8, 'inOut'));
function sRain(t) {
  const fall = tw(t, 56.2, 63.5, 'in');
  P.sky(P.mixc(C.storm0, '#7fb6e8', tw(t, 57.6, 60)), P.mixc(C.storm1, '#cfeaff', tw(t, 57.6, 60)));
  P.cam({ x: 0, y: -fall * 9000, h: 700 });
  // storm cloud body: dark lit blobs around, rushing up as we fall
  for (let i = 0; i < 16; i++) { const x = (hash(i, 131) * 2 - 1) * 1300, y = (hash(i, 132) * 2 - 1) * 900 + 200; drawCloud(x, y, 1.2 + hash(i, 133), i, P.mixc('#5a5a96', '#9a9ad0', hash(i, 134))); }
  for (let i = 0; i < 10; i++) { const x = (hash(i, 141) * 2 - 1) * 1200, y = -1600 - i * 700; drawCloud(x, y, 1.6, i + 30, '#d8dcf2', 'rgba(110,110,170,0.3)'); }
  // landscape far below (appears as we leave the cloud)
  const land = tw(t, 58.0, 61.0); if (land > 0) P.screen((ctx) => { ctx.globalAlpha = land; for (let L = 0; L < 3; L++) { ctx.fillStyle = ['#a7c8b0', '#7fb38a', '#5c9a68'][L]; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 60) ctx.lineTo(x, 760 + L * 90 - 120 * Math.abs(Math.sin(x * 0.004 + L * 2)) - tw(t, 61, 64) * 300 * (L + 1)); ctx.lineTo(1920, 1080); ctx.fill(); } });
  // bumper-car droplets merging into ours
  for (let i = 0; i < 18; i++) { const tm = 51.0 + i * 0.26, a = hash(i, 151) * 6.283, d = 700 * (1 - tw(t, tm - 1.2, tm, 'in')), x = Math.cos(a) * d + Math.sin(t * 3 + i) * 20, y = Math.sin(a) * d; if (t < tm) P.circle(x, y, 26 + 18 * hash(i, 152), P.rad(x - 8, y + 8, 50, '#d8f2ff', '#5ab4ee')); }
  const k = tw(t, 60.2, 61.2, 'backOut'), seeds = tw(t, 61.0, 61.3) * (1 - tw(t, 62.4, 62.8));
  const wob = K.squash(t, 55.8, 0.2, 0.4), sag = t > 55.8 && t < 56.4 ? [1.1, 0.88] : [1, 1];
  drawRaindrop(t, 0, -fall * 9000, dropS(t) * (1 + 0.04 * Math.sin(t * 9)), k, seeds);
  if (t < 56.6) P.alpha(1 - tw(t, 52, 53), () => drawDrip(t, 0, 0, 0.6, { mood: 'happy', look: [0, 0.3] }));
  void wob; void sag;
  // the counter, and the crossed-out teardrop
  const ca = tw(t, 51.2, 51.6) * (1 - tw(t, 56.6, 57.0)); if (ca > 0) { const n = Math.round(Math.pow(10, 6 * tw(t, 51.4, 55.6, 'in'))); P.text(n.toLocaleString('en-US'), 1460, 220, { font: FONT, size: 92, weight: 800, alpha: ca, shadow: 'rgba(0,0,0,0.35)' }); P.text('droplets', 1460, 300, { font: FONT, size: 44, weight: 600, alpha: ca }); }
  const ta = tw(t, 58.2, 58.6) * (1 - tw(t, 60.0, 60.4)); if (ta > 0) P.screen((ctx) => { ctx.globalAlpha = ta; ctx.save(); ctx.translate(1450, 540); ctx.fillStyle = 'rgba(120,200,255,0.8)'; ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(60, -40, 110, 30, 0, 110); ctx.bezierCurveTo(-110, 30, -60, -40, 0, -150); ctx.fill(); const x = tw(t, 58.9, 59.3); ctx.strokeStyle = '#ff4a5a'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-120, -120); ctx.lineTo(-120 + 240 * x, -120 + 240 * x); ctx.stroke(); if (x > 0.99) { ctx.beginPath(); ctx.moveTo(120, -120); ctx.lineTo(120 - 240 * tw(t, 59.3, 59.6), -120 + 240 * tw(t, 59.3, 59.6)); ctx.stroke(); } ctx.restore(); });
  if (fall > 0.05) P.screen((ctx) => { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const x = hash(i, 161) * 1920, y = ((hash(i, 162) * 1400 - t * 3000) % 1400 + 1400) % 1400 - 200; ctx.lineWidth = 2 + 3 * hash(i, 163); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 140); ctx.stroke(); } });
}
// 7. 63.4-76: splat on the mountain; the signpost; Drip takes the river slide
function sMountain(t) {
  P.sky('#7fc4f0', '#e6f6ff');
  const slide = tw(t, 71.6, 76.0, 'in');
  P.cam({ x: lerp(130, 1500, slide), y: lerp(60, -500, slide), h: lerp(820, 1000, slide) });
  // far peaks with snow, a glacier tongue
  for (const [x, hgt, s] of [[-900, 480, 1], [-200, 620, 2], [700, 540, 3], [1500, 450, 4]]) { P.lit([[x - 700, -300], [x, hgt], [x + 700, -300]], P.lin(x, hgt, x, -300, '#b9b6d6', '#7d7aa6'), { light: [-0.7, 0.7], d: 0.25, shade: 'rgba(40,30,90,0.25)', rim: false }); P.poly([[x - 180, hgt - 260], [x, hgt], [x + 180, hgt - 260], [x + 80, hgt - 210], [x, hgt - 280], [x - 90, hgt - 200]], C.snow); }
    // green slope, rocks, the river below
  P.smooth([[-1400, -200], [-600, 40], [200, -60], [1200, -300], [2600, -700], [2600, -1400], [-1400, -1400]], P.lin(0, 0, 0, -800, C.grass, C.grassDark), { tension: 0.4 });
  P.ribbon([[160, -140], [700, -330], [1300, -520], [2200, -760]], [60, 120, 180, 220], P.lin(0, -100, 0, -800, C.river, C.riverDeep));
  for (let i = 0; i < 7; i++) { const x = -900 + i * 300; P.lit(P.blobPts(x, -90 + Math.sin(i) * 40, 60 + 30 * hash(i, 171), 40, 9, 0.2, i), C.rock, { d: 0.25, shade: 'rgba(30,20,60,0.3)' }); }
  // the rock where the drop lands, the splat
  P.lit(P.blobPts(-160, -40, 150, 70, 10, 0.12, 9), P.lin(-160, 30, -160, -100, '#a8a4c4', C.rockDark), { d: 0.25 });
  const sp = (t - 63.8); if (sp > 0 && sp < 0.9) for (let i = 0; i < 12; i++) { const a = Math.PI * (i / 11), d = sp * 420; P.circle(-160 + Math.cos(a) * d, 40 + Math.sin(a) * d * 0.8 - sp * sp * 500, 16 * (1 - sp), 'rgba(120,200,255,0.8)'); }
  if (t < 63.9) drawRaindrop(t, -160, lerp(1400, 60, tw(t, 63.4, 63.9, 'in')), 0.6, 1, 0);
  // the signpost: three arms on their words
  drawSign(t, 420, -180, 1, [tw(t, 66.0, 66.4), tw(t, 68.2, 68.6), tw(t, 70.6, 71.0)]);
  // Drip: dazed, then looks at each arm, then onto the slide
  const dz = tw(t, 64.0, 64.4, 'backOut'), at = t < 71.6 ? [-160, 70 + dz * 30] : [lerp(-160, 1900, slide), lerp(100, -560, slide)];
  const look = t < 66 ? [0, 0.3] : t < 68.2 ? [0.8, 0.5] : t < 70.6 ? [0.8, 0.2] : [0.8, -0.3];
  if (t > 64.0) drawDrip(t, at[0], at[1], 0.85, { mood: t < 65.2 ? 'worried' : t > 71 ? 'happy' : 'smile', look, arms: t > 71.6 ? 'up' : t > 70.8 ? 'wave' : null, rot: slide > 0 ? -0.35 : 0, sq: K.squash(t, 64.0, 0.3, 0.3) });
  if (t > 64.1 && t < 65.3) for (let i = 0; i < 4; i++) { const a = t * 6 + i * 1.57; P.circle(-160 + Math.cos(a) * 80, 180 + Math.sin(a) * 18, 9, '#ffe066'); }
}
// 8. 75.2-88.6: the river ride, sideways: rapids, a waterwheel, a town, a fisherman, then the coast at dusk
function sRiver(t) {
  const u = tw(t, 75.2, 88.6, 'linear'), cx = lerp(0, 9200, u), dusk = tw(t, 85.5, 88.6);
  P.sky(P.mixc('#7fc8f2', '#f08a6a', dusk), P.mixc('#eaf8ff', '#ffd2a0', dusk));
  // far hills (parallax 0.3) and mid trees (0.6)
  P.screen((ctx) => { for (let L = 0; L < 2; L++) { ctx.fillStyle = [P.mixc('#a8d8b4', '#c49aa8', dusk), P.mixc('#78bc84', '#9a7a8a', dusk)][L]; ctx.beginPath(); ctx.moveTo(0, 1080); for (let x = 0; x <= 1920; x += 40) ctx.lineTo(x, 520 + L * 90 - 90 * Math.abs(Math.sin((x + cx * (0.15 + L * 0.2)) * 0.003 + L))); ctx.lineTo(1920, 1080); ctx.fill(); } });
  P.cam({ x: cx, y: -120, h: 860 });
  // banks and river
  P.rect(cx - 1200, -700, 2400, 520, P.lin(0, -180, 0, -700, P.mixc(C.grass, '#8a7a5a', dusk * 0.5), C.grassDark));
  const rv = (x) => -330 + Math.sin(x * 0.004) * 30;
  const pts = []; for (let x = cx - 1100; x <= cx + 1100; x += 40) pts.push([x, rv(x) + 70 + Math.sin(x * 0.03 - t * 6) * 6]); for (let x = cx + 1100; x >= cx - 1100; x -= 40) pts.push([x, rv(x) - 90]);
  P.poly(pts, P.lin(0, -260, 0, -420, P.mixc(C.river, '#e8a080', dusk * 0.6), C.riverDeep));
  for (let i = 0; i < 30; i++) { const x = cx - 1000 + ((i * 97 + t * 600) % 2000); P.ribbon([[x, rv(x) + 20 - (i % 3) * 30], [x + 60, rv(x) + 20 - (i % 3) * 30]], 4, 'rgba(255,255,255,0.5)'); }
  // things along the river (world x)
  for (let x = 400; x < 1800; x += 140) P.lit(P.blobPts(x, rv(x) - 10, 40, 22, 8, 0.2, x), C.rock, { d: 0.3 }), P.circle(x - 20, rv(x) + 14, 26, 'rgba(255,255,255,0.8)', { ry: 10 });
  drawWheel(t, 2500, -120, 1.2); P.rect(2560, -260, 260, 260, P.lin(2560, 0, 2820, 0, '#fff0d4', '#e9d4b0')); P.poly([[2540, -10], [2840, -10], [2690, 110]], C.roof);
  for (let i = 0; i < 9; i++) drawHouse(3400 + i * 150, -180 + (i % 2) * 40, 1.1 + 0.2 * hash(i, 181), null, i);
  P.ribbon([[3700, -230], [3900, -170], [4100, -230]], 30, C.woodDark);
  // fisherman on the bank, his hat blows off as Drip shoots by
  Cast.person(t, 5600, 190, { pose: 'point', look: [cx - 300, rv(cx)], mood: t > 82.4 ? 'wow' : 'happy', kid: false, shirt: '#4f7fc4', pants: '#5a4a3a', seed: 5 });
  P.ribbon([[5640, 140], [5900, 210], [6000, -300]], [5, 2, 1], C.woodDark);
  const hat = tw(t, 82.5, 84.5, 'out'); P.at(5600 + hat * 500, 200 + Math.sin(hat * 3.1) * 160, hat * 6, 1, 1, () => { P.rect(-34, 0, 68, 10, '#c2a15a', { r: 4 }); P.rect(-20, 8, 40, 28, '#d8b86a', { r: 8 }); });
  // the coast
  { const sea = P.mixc('#3ec4e6', '#e8a088', dusk), seaD = P.mixc(C.sea1, '#5a4a7a', dusk);
    P.smooth([[6900, -150], [7400, -175], [8200, -140], [12000, -140], [12000, -250], [7300, -262], [6900, -255]], P.lin(0, -150, 0, -262, P.mixc(C.sand, '#e8b890', dusk), '#c9a46a'), { tension: 0.3 });
    const sp = []; for (let x = 7700; x <= 12000; x += 60) sp.push([x, -230 + Math.sin(x * 0.01 + t * 2) * 10]); sp.push([12000, -760], [7300, -760], [7450, -420]);
    P.poly(sp, P.lin(0, -230, 0, -700, sea, seaD));
    for (let i = 0; i < 12; i++) { const x = 7800 + i * 260, y = -250 - (i % 3) * 90; P.ribbon([[x, y + Math.sin(t * 2 + i) * 8], [x + 120, y + Math.sin(t * 2 + i + 1) * 8]], 5, 'rgba(255,255,255,0.55)'); }
    for (let i = 0; i < 5; i++) { const x = 7300 + i * 140; P.lit(P.blobPts(x, -170, 18, 10, 8, 0.2, i), '#f3d9b0', { d: 0.2 }); }
    P.at(8600, -260 + Math.sin(t * 1.4) * 8, Math.sin(t * 1.4) * 0.05, 1.3, 1.3, () => { P.smooth([[-90, 0], [90, 0], [60, -34], [-60, -34]], '#4f7fc4'); P.rect(-3, 0, 6, 160, '#6e4024'); P.poly([[6, 26], [6, 150], [80, 36]], '#fff6e6'); }); }
  // Drip, riding the river (screen x ~ -320)
  const dx = cx - 320 + Math.sin(t * 1.3) * 40, rap = t > 75.6 && t < 77.4 ? Math.abs(Math.sin(t * 9)) * 60 : 0;
  drawDrip(t, dx, rv(dx) + 40 + rap + Math.sin(t * 3) * 10, 0.95, { mood: rap > 10 ? 'wow' : 'happy', arms: 'up', rot: Math.sin(t * 2) * 0.15, look: [0.8, 0] });
  if (rap > 0) for (let i = 0; i < 6; i++) P.circle(dx - 60 + i * 24, rv(dx) + 30 + rap * hash(i, 191), 10, 'rgba(255,255,255,0.8)');
  fact(t, 83.4, 86.4, 'about 2 weeks in a river', 960, 180, 'river');
}
// 9. 88-91.2: silence: the still sea at dusk
function sHush(t) {
  P.sky('#2b2a5a', '#e0876a', '#7a4f7a');
  P.screen((ctx) => { ctx.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { ctx.globalAlpha = tw(t, 88.5 + hash(i, 201) * 2, 89 + hash(i, 201) * 2) * 0.8; ctx.beginPath(); ctx.arc(hash(i, 202) * 1920, hash(i, 203) * 450, 2, 0, 6.3); ctx.fill(); } });
  P.cam({ x: 0, y: 0, h: 1080 * lerp(1, 1.08, tw(t, 88, 91.2)) });
  P.rect(-1200, -700, 2400, 640, P.lin(0, -60, 0, -700, '#5a4a7a', '#1a1a3a'));
  P.ribbon([[-200, -100], [200, -100]], 8, 'rgba(255,200,150,0.35)');
  drawDrip(t, 0, -40 + Math.sin(t * 1.2) * 6, 0.8, { mood: 'smile', look: [0, 0.5] });
}
// where the dinosaur's head is at time t (the camera zooms there; Drip rides there)
const dinoNeck = (t) => tw(t, 96.4, 98.6, 'inOut') * (1 - tw(t, 99.4, 100.4, 'inOut') * 0.45);
const DINO = { x: -560, y: -340, s: 1.0 };
const dinoHead = (t) => { const h = dinoMouth(dinoNeck(t)); return [DINO.x + DINO.s * (h[0] - 30), DINO.y + DINO.s * (h[1] + 10)]; };
// 10. 90.6-104.4: the twist: the passport's old pages, then a sepia dinosaur gulping Drip
function sTwist(t) {
  const sep = tw(t, 95.0, 96.0);
  P.sky(P.mixc('#2b2a5a', '#f2c98a', sep), P.mixc('#7a4f7a', '#fff0cc', sep));
  const zt = tw(t, 99.2, 101.0, 'inOut'), za = dinoHead(t); P.cam({ x: za[0] * zt, y: za[1] * zt, h: 1080 * logTrack([[95.6, 1], [99.2, 1, 'inOut'], [101.0, 0.3, 'inOut'], [104.4, 0.28]])(t) });
  if (sep > 0) P.alpha(sep, () => {
    P.at(560, 420, 0, 1, 1, () => { P.glow(0, 0, 420, '255,220,150', 0.9); P.circle(0, 0, 90, '#fff2cc'); });
    for (let L = 0; L < 2; L++) { const pts = [[-1300, -200]]; for (let x = -1300; x <= 1300; x += 60) pts.push([x, 60 + L * -120 + 140 * Math.abs(Math.sin(x * 0.003 + L * 2))]); pts.push([1300, -200]); P.poly(pts, ['#e8c690', '#d9b07a'][L]); }
    P.rect(-1300, -700, 2600, 400, P.lin(0, -300, 0, -700, '#c99a5e', '#a87a46')); P.smooth([[-200, -330], [300, -300], [900, -330], [900, -420], [200, -440], [-300, -400]], P.lin(0, -300, 0, -440, '#bfe0d8', '#8ab8b4'));
    for (let i = 0; i < 5; i++) P.ribbon([[-100 + i * 180, -360 - (i % 2) * 30], [0 + i * 180, -360 - (i % 2) * 30]], 4, 'rgba(255,255,255,0.6)');
    for (let i = 0; i < 9; i++) { const x = -900 + i * 220; P.ribbon([[x, -330], [x + 20, -40], [x - 10, 160]], [18, 10, 4], '#8a6a3a'); for (let k = -1; k <= 1; k += 2) P.smooth([[x + 10, 0], [x + k * 140, 60 + Math.sin(t + i) * 8], [x + k * 160, 20], [x + 10, -20]], k > 0 ? '#9aa04a' : '#7f8a3a'); }
    const [hx, hy] = dinoHead(t);
    drawDino(t, DINO.x, DINO.y, DINO.s, dinoNeck(t), '#8fa86a', { mouth: tw(t, 97.8, 98.3) * (1 - tw(t, 98.9, 99.2)) + tw(t, 100.8, 101.2) * 0.6, mood: t > 98.9 && t < 100.6 ? 'happy' : t > 100.6 ? 'wow' : 'smile', look: t > 100.6 ? [0, 0] : [0.7, -0.3] });
    const gulp = tw(t, 98.5, 99.0);
    const pop = K.ease.backOut(clamp((t - 101.0) / 0.4));
    const mo = dinoMouth(dinoNeck(t)), mx = DINO.x + DINO.s * mo[0], my = DINO.y + DINO.s * mo[1];
    if (t > 96.2 && t < 99.0) drawDrip(t, lerp(mx + 40, mx, gulp), lerp(-338 + Math.sin(t * 2) * 4, my, gulp), lerp(0.3, 0.15, gulp), { mood: 'happy', look: [-0.6, 0.3] });
    if (t > 101.0) drawDrip(t, mx + pop * 22, my + pop * 10, 0.24 * pop, { mood: 'happy', arms: 'wave', wave: 1, look: [0, 0] });
  });
  // the loop: sea -> sky -> cloud -> mountain -> sea, Drip lapping it faster and faster as the years spin up
  const la = tw(t, 90.8, 91.6) * (1 - tw(t, 94.8, 95.4));
  if (la > 0) P.screen((ctx) => {
    ctx.save(); ctx.globalAlpha *= la; ctx.translate(960, 560);
    const R = 400, RY = 250;
    ctx.strokeStyle = 'rgba(127,224,255,0.25)'; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(0, 0, R, RY, 0, 0, 6.3); ctx.stroke();
    const laps = Math.pow(tw(t, 91.2, 95.2, 'linear'), 2.2) * 14, ang = laps * Math.PI * 2;
    for (let k = 0; k < 40; k++) { const a = ang - k * 0.05 * (1 + laps * 0.3); ctx.fillStyle = `rgba(160,235,255,${0.5 * (1 - k / 40)})`; ctx.beginPath(); ctx.arc(Math.cos(a - Math.PI / 2) * R, Math.sin(a - Math.PI / 2) * -RY, 14 * (1 - k / 40), 0, 6.3); ctx.fill(); }
    for (const [a, ic] of [[Math.PI / 2, 'sea'], [0, 'sun'], [-Math.PI / 2, 'cloud'], [Math.PI, 'river']]) { ctx.save(); ctx.translate(Math.cos(a) * R * 1.32, Math.sin(a) * RY * 1.4); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.arc(0, 0, 52, 0, 6.3); ctx.fill(); ICON[ic](ctx, 30); ctx.restore(); }
    const yrs = Math.pow(10, 9.6 * tw(t, 91.4, 94.6, 'in'));
    const label = yrs < 1.5 ? '1 year' : yrs < 1e3 ? Math.round(yrs) + ' years' : yrs < 1e6 ? Math.round(yrs / 1e3) + ' thousand years' : yrs < 1e9 ? Math.round(yrs / 1e6) + ' million years' : 'billions of years';
    ctx.fillStyle = '#ffffff'; ctx.font = `800 56px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0);
    ctx.restore();
  });
  if (la > 0) { const ang = Math.pow(tw(t, 91.2, 95.2, 'linear'), 2.2) * 14 * Math.PI * 2, px = 960 + Math.cos(ang - Math.PI / 2) * 400, py = 560 + Math.sin(ang - Math.PI / 2) * -250; P.alpha(la, () => drawDrip(t, px - 960, 540 - py, 0.5, { mood: t > 93.5 ? 'wow' : 'happy', arms: 'up', look: [0.5, 0] })); }

}
// 11. 103.8-117.5: sunset: three stamps line up; Drip jumps again; back to the rainy window: a drop waves
function sEnd(t) {
  const up = tw(t, 110.6, 114.2, 'inOut');
  P.sky(P.mixc('#ff9a5a', '#5a6fa8', up), P.mixc('#ffe0a0', '#b0c0e0', up));
  P.cam({ x: 0, y: lerp(0, 1800, up), h: 1080 });
  P.at(0, 120, 0, 1, 1, () => { P.glow(0, 0, 600, '255,190,110', 1 - up); P.circle(0, 0, 150, P.rad(0, 20, 170, '#fff4d0', '#ffc36b', '#ff8a4a')); });
  P.rect(-1200, -800, 2400, 820, P.lin(0, 0, 0, -800, '#ff9a6a', '#3a3a7a')); for (let i = 0; i < 10; i++) P.ribbon([[-300 + i * 10, -40 - i * 50], [300 - i * 10, -40 - i * 50]], 6, 'rgba(255,220,160,0.4)');
  for (let i = 0; i < 6; i++) drawCloud(-1000 + i * 420, 1600 + (i % 2) * 300, 1.4, i + 50, '#e8ecff', 'rgba(100,110,170,0.35)');
  const jump = tw(t, 109.6, 113.6, 'out');
  drawDrip(t, Math.sin(t) * 40, -60 + jump * 1800, 0.9, { mood: 'happy', arms: t > 109.4 ? 'up' : 'wave', wave: t < 109.4 ? 1 : 0, ghost: tw(t, 110.0, 110.8), look: [0, 0.6] });
  // the three numbers of the trip
  fact(t, 104.6, 109.6, 'about 9 days in the air', 960, 200, 'cloud');
  fact(t, 106.0, 109.6, 'about 2 weeks in a river', 960, 300, 'river');
  fact(t, 107.6, 109.6, 'about 3,000 years in the sea', 960, 400, 'sea');
}
const SC = [[0, 11.2, sWindow], [10.2, 15.6, sMolecules], [14.6, 26.6, sOcean], [25.6, 38.2, sSurface], [37.2, 50.8, sCold], [49.8, 64.0, sRain], [63.4, 76.0, sMountain], [75.2, 88.6, sRiver], [88.0, 91.2, sHush], [90.6, 104.4, sTwist], [103.8, 114.8, sEnd], [114.0, 117.5, (t) => sWindow(t, true)]];
const FILM = {
  draw(t) {
    const on = SC.filter(([a, b]) => t >= a && t < b);
    on.forEach(([a, b, fn], i) => { if (i === 0) fn(t); else P.layer(tw(t, a, on[i - 1][1], 'inOut'), () => fn(t)); P.begin(P.ctx); });
    P.vignette(0.3);
  },
};
