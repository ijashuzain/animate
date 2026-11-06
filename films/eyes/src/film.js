// How Your Eyes Turn Light Into a Picture: "follow one ray of light" (the user's pick), about 4:00.
// One journey: sunlight -> a red apple -> one red ray -> cornea, pupil, lens, jelly -> the backwards retina -> a red cone ->
// one retinal molecule -> a signal -> the optic nerve -> the chiasm -> the visual cortex, which builds the scene.
// A new shot about every 5 s (the reference study); hard cuts; lines follow script-timed.md.
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const { tw, clamp, lerp } = K;
const pill = (str, x, y, u, o = {}) => { const q = Object.assign({ u, font: FONT, size: 36, weight: 700 }, o); q.size *= 1.2; P.pill(str, x, y, q); };
const shows = (t, a, b, f = 0.35) => tw(t, a, a + f) * (1 - tw(t, b - f, b));
const zoomAt = (ctx, cx, cy, z, fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
const KR = 165, KY = 760 - 2.1 * KR;   // the kid's head: its table line sits on the kitchen table (y 760)
const kitchenShot = (ctx, t, o = {}) => { E.kitchen(ctx, t); E.kid(ctx, t, o.kx ?? 600, o.ky ?? KY, o.kr ?? KR, o); E.apple(ctx, t, o.ax ?? 1180, o.ay ?? 690, o.ar ?? 95, o); };
const redRay = (ctx, x0, y0, x1, y1, w = 30, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(255,60,60,0)'); g.addColorStop(1, 'rgba(255,70,70,0.9)'); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.lineWidth = w * 0.3; ctx.strokeStyle = 'rgba(255,230,230,0.95)'; ctx.stroke(); E.spark(ctx, x1, y1, w * 0.6); ctx.restore(); };

const SHOTS = [
  // 1. the apple
  [0, 6, (ctx, t, u) => { zoomAt(ctx, 900, 600, 1 + 0.06 * tw(u, 0, 6), () => kitchenShot(ctx, t)); pill('just a red apple', 1180, 900, shows(t, 1, 5.6)); }],
  [6, 12, (ctx, t, u) => { zoomAt(ctx, 1180, 690, 1 + 3 * tw(u, 0, 6, 'in'), () => kitchenShot(ctx, t)); }],
  // 2. sunlight is every colour; the apple bounces back red
  [12, 17, (ctx, t, u) => { kitchenShot(ctx, t, { ax: 1100, ay: 760, ar: 170, kx: -400 }); E.colours(ctx, t, 1700, 80, 1100, 760, 170, tw(u, 0.3, 4.5)); pill('sunlight: a mix of all colours', 960, 120, shows(t, 12.4, 16.8)); }],
  [17, 22, (ctx, t, u) => { kitchenShot(ctx, t, { ax: 1100, ay: 760, ar: 170, kx: -400 }); E.colours(ctx, t, 1700, 80, 1100, 760, 170, 0.65 + tw(u, 0, 4.5) * 0.35); pill('the apple soaks up the rest and bounces back red', 960, 120, shows(t, 17.4, 21.8), { size: 32 }); }],
  // 3. ride the ray across the room
  [22, 27, (ctx, t, u) => { kitchenShot(ctx, t); const p = tw(u, 0, 4.6, 'inOut'); redRay(ctx, 1110, 660, lerp(1110, 720, p), lerp(660, 590, p), 26); pill('0.000 000 003 s', 960, 120, shows(t, 22.6, 26.8)); }],
  [27, 32, (ctx, t, u) => { zoomAt(ctx, 720, 590, 1 + 4 * tw(u, 0, 5, 'in'), () => { kitchenShot(ctx, t); redRay(ctx, 1110, 660, 720, 590, 26); }); }],
  // 4. the cornea
  [32, 38, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: 0.3 }); E.ray(ctx, t, geo, 230, undefined, tw(u, 0, 1)); pill('the eye, cut in half', 960, 100, shows(t, 32.4, 37.8)); }],
  [38, 44, (ctx, t, u) => { navy(ctx); zoomAt(ctx, 600, 540, 1.9, () => { const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: 0.3 }); E.ray(ctx, t, geo, 230); }); pill('cornea: about 2/3 of the focusing', 960, 980, shows(t, 38.6, 43.8)); }],
  // 5. the pupil
  [44, 49, (ctx, t, u) => { E.iris(ctx, t, 960, 540, 400, lerp(0.7, 0.15, tw(u, 0.5, 3))); pill('bright light: the pupil shrinks', 960, 980, shows(t, 44.6, 48.8)); }],
  [49, 54, (ctx, t, u) => { E.iris(ctx, t, 960, 540, 400, lerp(0.15, 0.9, tw(u, 0.5, 3.5))); ctx.fillStyle = `rgba(0,0,20,${0.55 * tw(u, 0, 1)})`; ctx.fillRect(0, 0, 1920, 1080); pill('in the dark: it opens wide', 960, 980, shows(t, 49.6, 53.8)); }],
  // 6. the lens focuses
  [54, 60, (ctx, t, u) => { navy(ctx); zoomAt(ctx, 900, 540, 1.3, () => { const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: 0.2 }); E.ray(ctx, t, geo, 200); }); pill('far away: the lens stays flatter', 960, 980, shows(t, 54.6, 59.8)); }],
  [60, 66, (ctx, t, u) => { navy(ctx); zoomAt(ctx, 900, 540, 1.3, () => { const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: lerp(0.2, 1, tw(u, 0.5, 3)) }); E.ray(ctx, t, geo, 200); }); pill('close up: muscles let it bulge rounder', 960, 980, shows(t, 60.6, 65.8)); }],
  // 7. across the jelly; the image lands upside down
  [66, 71, (ctx, t, u) => { navy(ctx); zoomAt(ctx, 1200, 540, 1.6, () => { const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: 0.3 }); redRay(ctx, geo.lens[0], geo.lens[1], lerp(geo.lens[0], geo.focus[0], tw(u, 0, 4.5)), geo.lens[1], 22); }); pill('across the clear jelly', 960, 100, shows(t, 66.6, 70.8)); }],
  [71, 76, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 900, 540, 380, { pupil: 0.5 }); E.ray(ctx, t, geo, 200, undefined, 0.5); E.apple(ctx, t, 300, 540, 90); ctx.save(); ctx.translate(geo.focus[0] - 40, 540); ctx.scale(-0.5, -0.5); ctx.globalAlpha = tw(u, 0.5, 2); E.apple(ctx, t, 0, 0, 90); ctx.restore(); pill('upside down', 1300, 760, shows(t, 72, 75.8)); }],
  // 8. the retina is built backwards
  [76, 83, (ctx, t, u) => { zoomAt(ctx, 960, 300, 1 + 0.6 * (1 - tw(u, 0, 6, 'inOut')), () => E.retina(ctx, t, { lit: '', beam: null })); pill('the retina is built backwards', 960, 980, shows(t, 76.6, 82.8)); }],
  [83, 90, (ctx, t, u) => { E.retina(ctx, t, { lit: '', beam: 30 + 14 * 64, beamEnd: lerp(0, 790, tw(u, 0, 5)) }); pill('light passes the nerve wiring first', 960, 520, shows(t, 83.6, 89.8)); }],
  // 9. rods and cones
  [90, 97, (ctx, t, u) => { E.retina(ctx, t, { lit: 'LMS' }); ctx.fillStyle = 'rgba(0,0,30,0.55)'; ctx.fillRect(0, 0, 1920, 560); pill('about 120 million rods: dim light', 600, 400, shows(t, 90.6, 96.8)); pill('about 6 million cones: colour and detail', 1300, 560, shows(t, 92, 96.8)); }],
  [97, 104, (ctx, t, u) => { const dim = 1 - tw(u, 3, 4.5); E.retina(ctx, t, { lit: dim > 0.5 ? '' : 'LMS' }); ctx.fillStyle = `rgba(0,0,40,${0.6 * dim})`; ctx.fillRect(0, 0, 1920, 1080); if (dim > 0.4) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { if (i % 4 === 2) continue; const g = ctx.createRadialGradient(30 + i * 64, 780, 0, 30 + i * 64, 780, 60); g.addColorStop(0, `rgba(190,170,255,${0.5 * dim})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(i * 64 - 30, 720, 120, 120); } ctx.restore(); } pill(dim > 0.5 ? 'at night: the rods' : 'in daylight: the cones', 960, 120, shows(t, 97.6, 103.8)); }],
  // 10. three kinds of cone; the red ray finds a red one
  [104, 110, (ctx, t, u) => { const k = ['L', 'M', 'S'][Math.min(2, Math.floor(u / 1.6))]; E.retina(ctx, t, { lit: u > 4.8 ? 'LMS' : k }); pill('reds, greens and blues', 960, 120, shows(t, 104.6, 109.8)); }],
  [110, 116, (ctx, t, u) => { zoomAt(ctx, 30 + 14 * 64, 840, 1 + 1.6 * tw(u, 1.5, 6, 'in'), () => E.retina(ctx, t, { lit: 'L', beam: 30 + 14 * 64, beamEnd: lerp(0, 830, tw(u, 0, 2)) })); pill('our red ray finds a red cone', 960, 120, shows(t, 110.6, 115.8)); }],
  // 11. one molecule snaps
  [116, 123, (ctx, t, u) => { E.coneInside(ctx, t, 0); zoomAt(ctx, 960, 560, 1 + 0.8 * tw(u, 0, 6, 'inOut'), () => E.retinal(ctx, t, 960, 560, 40, 0)); pill('one molecule: retinal', 960, 980, shows(t, 116.6, 122.8)); }],
  [123, 130, (ctx, t, u) => { const s = tw(u, 2.5, 2.9, 'out'); E.coneInside(ctx, t, s); E.retinal(ctx, t, 960, 560, 72, s); redRay(ctx, 200, 100, lerp(200, 900, tw(u, 0.5, 2.5)), lerp(100, 520, tw(u, 0.5, 2.5)), 20, 1 - tw(u, 2.6, 3.2)); pill('less than a trillionth of a second', 960, 980, shows(t, 126, 129.8)); pill('the first step of seeing', 960, 120, shows(t, 126.6, 129.8)); }],
  // 12. the chain reaction, the cone fires
  [130, 136, (ctx, t, u) => { E.coneInside(ctx, t, 0.4); for (let i = 0; i < 30; i++) { const d = tw(u, i * 0.12, i * 0.12 + 0.4), a = i * 2.4, r = 40 + i * 16; if (d <= 0) continue; E.spark(ctx, 960 + Math.cos(a) * r, 560 + Math.sin(a) * r * 0.6, 10 * d, d); } E.retinal(ctx, t, 960, 560, 40, 1); pill('a chain reaction', 960, 120, shows(t, 130.6, 135.8)); }],
  [136, 142, (ctx, t, u) => { E.retina(ctx, t, { lit: 'L' }); const x = 30 + 14 * 64, p = tw(u, 0.5, 5); E.spark(ctx, x, lerp(860, 300, p), 26); pill('the cone fires a signal', 960, 120, shows(t, 136.6, 141.8)); }],
  // 13. relay to the optic nerve
  [142, 148, (ctx, t, u) => { E.nerveField(ctx, t, u); pill('nerve cells pass it on', 960, 120, shows(t, 142.6, 147.8)); }],
  [148, 154, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 760, 540, 380); for (let k = 0; k < 8; k++) { const ph = (u * 0.5 + k / 8) % 1, x = lerp(geo.disc[0] - 200, 1920, ph); E.spark(ctx, x, x < geo.disc[0] ? geo.disc[1] - 60 + ph * 80 : geo.disc[1] + (x - geo.disc[0]) * 0.07, 16); } pill('the optic nerve: about a million fibres', 960, 980, shows(t, 148.6, 153.8)); }],
  // 14. the blind spot
  [154, 160, (ctx, t, u) => { E.retina(ctx, t, { lit: 'LMS' }); ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.ellipse(960, 720, 300 * tw(u, 0.3, 2), 380, 0, 0, 7); ctx.fill(); for (let f = 0; f < 18; f++) { ctx.strokeStyle = 'rgba(255,170,60,0.8)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(960 + (f - 9) * 30 * tw(u, 0.3, 2), 1080); ctx.quadraticCurveTo(960 + (f - 9) * 20, 700, 960 + (f - 9) * 6, 360); ctx.stroke(); } pill('no sensors where the cable leaves: the blind spot', 960, 120, shows(t, 154.6, 159.8), { size: 32 }); }],
  [160, 166, (ctx, t, u) => { navy(ctx); ctx.fillStyle = '#f6f2ea'; ctx.beginPath(); ctx.roundRect(140, 180, 1100, 560, 40); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(160, 740, 1060, 16);
    ctx.fillStyle = '#1a1a2a'; ctx.font = `800 120px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', 400, 460); const a = 1 - tw(u, 2, 3.2); ctx.fillStyle = `rgba(232,32,42,${a})`; ctx.beginPath(); ctx.arc(980, 460, 60, 0, 7); ctx.fill();
    zoomAt(ctx, 1560, 470, 0.62, () => { const geo = E.eye(ctx, t, 1560, 470, 400, { pupil: 0.5 }); const hit = tw(u, 2, 3.2); redRay(ctx, geo.front[0] - 200, 470 + 160, geo.disc[0] - 10, geo.disc[1], 22, 0.4 + 0.6 * hit); if (hit > 0.5) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(geo.disc[0], geo.disc[1], 60, 0, 7); ctx.stroke(); } });
    pill('cover your left eye, stare at the +, lean in: the dot vanishes', 960, 100, shows(t, 160.6, 165.8), { size: 30 }); pill('its light lands on the blind spot', 1560, 860, shows(t, 162.4, 165.8), { size: 30 }); pill('your brain fills the gap', 700, 860, shows(t, 163, 165.8), { size: 30 }); }],
  // 15. the crossing
  [166, 172, (ctx, t, u) => { E.brainTop(ctx, t, u, { prog: 1 }); pill('the optic nerves meet at a crossing', 960, 100, shows(t, 166.6, 171.8)); }],
  [172, 178, (ctx, t, u) => { E.brainTop(ctx, t, u, { signals: true }); pill('left side of your view → right side of your brain', 960, 100, shows(t, 172.6, 177.8), { size: 32 }); }],
  // 16. to the visual cortex
  [178, 185, (ctx, t, u) => { E.brainTop(ctx, t, u, { signals: true, cortex: tw(u, 3, 6) }); pill(`${Math.round(lerp(0, 90, tw(u, 0, 5)))} ms`, 1700, 540, shows(t, 178.6, 184.8), { size: 40 }); }],
  [185, 192, (ctx, t, u) => { E.brainTop(ctx, t, u, { cortex: 1 }); pill('the visual cortex, at the back of your head', 960, 980, shows(t, 185.6, 191.8)); }],
  // 17. no picture to flip: the brain builds the scene
  [192, 199, (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#2a1a6a'); bg.addColorStop(1, '#070a2a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080); const d = tw(u, 1, 5); ctx.save(); ctx.globalAlpha = 1 - d; ctx.translate(960, 540); ctx.scale(1, -1); E.apple(ctx, t, 0, 0, 200); ctx.restore(); for (let i = 0; i < 60; i++) { const p = clamp(d * 1.4 - K.hash(i, 3) * 0.4); if (p <= 0) continue; E.spark(ctx, 960 + (K.hash(i, 1) - 0.5) * 500 * p, 540 + (K.hash(i, 2) - 0.5) * 400 * p, 10, p); } pill('your brain never sees a picture', 960, 120, shows(t, 192.6, 198.8)); }],
  [199, 206, (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#6a2a8a'); bg.addColorStop(1, '#1a0a3a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080); const g = ctx.createRadialGradient(960, 540, 50, 960, 540, 600); g.addColorStop(0, 'rgba(255,190,80,0.6)'); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); E.cortexApple(ctx, t, 960, 560, 300, tw(u, 0.5, 5)); pill('it reads signals and builds the scene, right way up', 960, 980, shows(t, 199.6, 205.8), { size: 32 }); }],
  // 18. separate jobs, put together
  [206, 213, (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#2a1a6a'); bg.addColorStop(1, '#070a2a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
    const cg = ctx.createRadialGradient(960, 560, 20, 960, 560, 200); cg.addColorStop(0, '#ffcf70'); cg.addColorStop(0.4, '#c070e0'); cg.addColorStop(1, 'rgba(90,40,160,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(960, 560, 200, 0, 7); ctx.fill();
    const jobs = [['edges', 420, 330], ['colour', 1500, 330], ['shape', 420, 790], ['movement', 1500, 790]]; jobs.forEach(([lab, x, y], i) => { const p = tw(u, i * 0.8, i * 0.8 + 0.8); if (p <= 0) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,200,110,${0.6 * p})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(960, 560); ctx.lineTo(lerp(960, x, p), lerp(560, y, p)); ctx.stroke(); ctx.restore(); E.spark(ctx, lerp(960, x, (u * 0.6 + i * 0.25) % 1 * p), lerp(560, y, (u * 0.6 + i * 0.25) % 1 * p), 14, p);
      ctx.globalAlpha = p; ctx.fillStyle = 'rgba(30,20,80,0.85)'; ctx.beginPath(); ctx.roundRect(x - 200, y - 170, 400, 340, 40); ctx.fill(); ctx.strokeStyle = 'rgba(255,210,140,0.6)'; ctx.lineWidth = 4; ctx.stroke(); ctx.save(); ctx.translate(x, y - 20);
      if (i === 0) { ctx.strokeStyle = '#ffe890'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 10, 110, 100, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(10, -130); ctx.stroke(); } if (i === 1) { for (const [c, dx] of [['#ff3a3a', -50], ['#ff9a7a', 0], ['#c01a2a', 50]]) eEll(ctx, dx, 10, 60, 60, c); } if (i === 2) { E.apple(ctx, t, 0, 20, 90); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = '#c8b0ff'; ctx.fillRect(-150, -150, 300, 300); ctx.globalCompositeOperation = 'source-over'; } if (i === 3) { for (let k = 0; k < 4; k++) { ctx.globalAlpha = p * (1 - k * 0.22); E.apple(ctx, t, -k * 45 + Math.sin(t * 2) * 10, 20, 70); } ctx.globalAlpha = p; }
      ctx.restore(); ctx.globalAlpha = 1; pill(lab, x, y + 130, p); }); pill('worked out separately', 960, 100, shows(t, 206.6, 212.8)); }],
  [213, 220, (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#6a2a8a'); bg.addColorStop(1, '#1a0a3a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080); const m = tw(u, 0, 3, 'inOut'); for (const [x, y] of [[380, 360], [1540, 360], [380, 760], [1540, 760]]) { ctx.globalAlpha = 1 - m; eEll(ctx, lerp(x, 960, m), lerp(y, 560, m), 140, 130, 'rgba(255,120,120,0.6)'); ctx.globalAlpha = 1; } if (m > 0.6) E.apple(ctx, t, 960, 580, 200 * tw(u, 2, 3.5, 'backOut')); pill('then put back together into one view', 960, 980, shows(t, 213.6, 219.8)); }],
  // 19. millions of rays, every moment
  [220, 226, (ctx, t, u) => { kitchenShot(ctx, t); for (let i = 0; i < 24; i++) { const sx = K.hash(i, 1) * 1920, sy = 120 + K.hash(i, 2) * 900, p = (u * 0.5 + K.hash(i, 3)) % 1; redRay(ctx, sx, sy, lerp(sx, 720, p), lerp(sy, 590, p), 8, 0.5 + 0.5 * K.hash(i, 4)); } pill('millions of rays, every moment', 960, 120, shows(t, 220.6, 225.8)); }],
  [226, 232, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 1000, 540, 380, { pupil: 0.5 }); for (let i = 0; i < 9; i++) { const col = ['255,90,90', '120,220,120', '120,170,255', '255,220,120'][i % 4]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(${col},0.55)`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 540 + (i - 4) * 110); ctx.lineTo(geo.front[0], 540 + (i - 4) * 12); ctx.lineTo(geo.focus[0], 540 - (i - 4) * 40); ctx.stroke(); ctx.restore(); } pill('every moment your eyes are open', 960, 980, shows(t, 226.6, 231.8)); }],
  // 20. you see with your brain
  [232, 240, (ctx, t, u) => { E.kitchen(ctx, t); const kx = 700, R = 175, ky = 760 - 2.1 * R, m = tw(u, 0.5, 2.5, 'inOut');
    const hold = [lerp(1.6, 1.15, m), lerp(1.3, 0.55, m)]; E.kid(ctx, t, kx, ky, R, { mood: 'happy', hold, look: [0.06, 0.06] });
    const ax = kx + (hold[0] + 0.15) * R, ay = ky + (hold[1] - 0.05) * R; E.apple(ctx, t, ax, ay, 85, { bite: tw(u, 3, 3.4) }); E.handHold(ctx, ax + 6, ay + 16, 85);
    pill('you see with your brain', 960, 120, shows(t, 232.6, 239.6)); }],
];
const D = 240;
const FILM = {
  draw(t) {
    const ctx = P.ctx; const s = SHOTS.find(([a, b]) => t >= a && t < b) ?? SHOTS[SHOTS.length - 1];
    s[2](ctx, t, t - s[0]);
    if (t < 0.6) P.haze('#05030a', 1 - t / 0.6); if (t > D - 1) P.haze('#05030a', t - (D - 1));
    P.vignette(0.25);
  },
};
