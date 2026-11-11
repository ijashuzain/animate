// How Your Eyes Turn Light Into a Picture: "follow one ray of light" (the user's pick), about 4:00.
// One journey: sunlight -> a red apple -> one red ray -> cornea, pupil, lens, jelly -> the backwards retina -> a red cone ->
// one retinal molecule -> a signal -> the optic nerve -> the chiasm -> the visual cortex, which builds the scene.
// A new shot about every 5 s (the reference study); lines follow script-timed.md. The redesign (TREATMENT.md, lemo's
// directing method): a scale readout rides along (the signature shot), every change of scale goes 'through the light',
// the cutaway turns into the iris and back, the camera tracks, cranes, trucks, pushes and pulls, and the film climbs back out.
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const { tw, clamp, lerp } = K;
const pill = (str, x, y, u, o = {}) => { const q = Object.assign({ u, font: FONT, size: 36, weight: 700 }, o); q.size *= 1.2; P.pill(str, x, y, q); };
// a pill's window, widened to its whole shot (the voice fit compresses shots, so a label uses all the time its shot has)
let CUR = [0, 1e9];
const shows = (t, a, b, f = 0.3) => { const a2 = Math.max(CUR[0], a - 0.6), b2 = Math.min(CUR[1], b + 0.25); return tw(t, a2, a2 + f) * (1 - tw(t, b2 - f, b2)); };
const zoomAt = (ctx, cx, cy, z, fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
// a moving camera: world point (wx, wy) sits at screen (sx, sy) at zoom z
const follow = (ctx, wx, wy, sx, sy, z, fn) => { ctx.save(); ctx.translate(sx, sy); ctx.scale(z, z); ctx.translate(-wx, -wy); fn(); ctx.restore(); };
const shake = (ctx, t, t0, a = 16) => { const k = 1 - tw(t, t0, t0 + 0.5); if (t < t0 || k <= 0) return; const f = Math.floor(t * 60); ctx.translate((K.hash(f, 1) - 0.5) * a * k, (K.hash(f, 2) - 0.5) * a * k); };
const KR = 165, KY = 760 - 2.1 * KR;   // the kid's head: its table line sits on the kitchen table (y 760)
const kitchenShot = (ctx, t, o = {}) => { E.kitchen(ctx, t); E.kid(ctx, t, o.kx ?? 600, o.ky ?? KY, o.kr ?? KR, o); E.apple(ctx, t, o.ax ?? 1180, o.ay ?? 690, o.ar ?? 95, o); };
const redRay = (ctx, x0, y0, x1, y1, w = 30, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(255,60,60,0)'); g.addColorStop(1, 'rgba(255,70,70,0.9)'); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.lineWidth = w * 0.3; ctx.strokeStyle = 'rgba(255,230,230,0.95)'; ctx.stroke(); E.spark(ctx, x1, y1, w * 0.6); ctx.restore(); };

const SHOTS = [
  // 1. the apple
  [0, 6, (ctx, t, u) => { zoomAt(ctx, 1180, 690, lerp(2.6, 1, tw(u, 0.4, 5.6, 'inOut')), () => kitchenShot(ctx, t, { mood: 'curious' })); pill('just a red apple', 960, 110, shows(t, 0.8, 5.7)); }],
  [6, 12, (ctx, t, u) => { zoomAt(ctx, 1180, 690, 1 + 3 * tw(u, 0, 6, 'in'), () => kitchenShot(ctx, t, { mood: 'curious' })); }],
  // 2. sunlight is every colour; the apple bounces back red
  [12, 17, (ctx, t, u) => { kitchenShot(ctx, t, { ax: 1100, ay: 760, ar: 170, kx: -400 }); E.colours(ctx, t, 1700, 80, 1100, 760, 170, tw(u, 0.3, 4.5)); pill('sunlight: a mix of all colours', 960, 120, shows(t, 12.4, 16.8)); }],
  [17, 22, (ctx, t, u) => { kitchenShot(ctx, t, { ax: 1100, ay: 760, ar: 170, kx: -400 }); E.colours(ctx, t, 1700, 80, 1100, 760, 170, 0.65 + tw(u, 0, 4.5) * 0.35); pill('the apple soaks up the rest, bounces back red', 960, 120, shows(t, 17.2, 21.95), { size: 32 }); }],
  // 3. ride the ray across the room
  [22, 27, (ctx, t, u) => { const p = tw(u, 0, 4.8, 'inOut'), bx = lerp(1110, 699, p), by = lerp(660, 413, p);
    follow(ctx, bx, by, lerp(1250, 980, p), lerp(640, 470, p), 1.45, () => { kitchenShot(ctx, t); redRay(ctx, 1110, 660, bx, by, 26); });
    // the near layer: warm dust very close to the lens, rushing past faster than the room
    for (let i = 0; i < 14; i++) { const x = ((K.hash(i, 1) * 2600 + (1110 - bx) * 3.4) % 2600) - 340, y = K.hash(i, 2) * 1080, r = 30 + K.hash(i, 3) * 50, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,240,200,0.22)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
    pill('0.000 000 003 s', 960, 120, shows(t, 22.6, 26.8)); }],
  [27, 32, (ctx, t, u) => { const q = tw(u, 0, 5, 'inOut'); follow(ctx, 699, 413, lerp(980, 960, q), lerp(470, 540, q), 1.45 * (1 + 5 * tw(u, 0, 5, 'in')), () => { kitchenShot(ctx, t); redRay(ctx, 1110, 660, 699, 413, 26); }); }],
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
  [66, 71, (ctx, t, u) => { navy(ctx); follow(ctx, lerp(880, 1240, tw(u, 0, 5, 'inOut')), 540, 960, 540, 1.6, () => { const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.5, lens: 0.3 }); redRay(ctx, geo.lens[0], geo.lens[1], lerp(geo.lens[0], geo.focus[0], tw(u, 0, 4.5)), geo.lens[1], 22); }); pill('across the clear jelly', 960, 100, shows(t, 66.6, 70.8)); }],
  [71, 76, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 900, 540, 380, { pupil: 0.5 }); E.ray(ctx, t, geo, 200, undefined, 0.5); E.apple(ctx, t, 300, 540, 90); ctx.save(); ctx.translate(geo.focus[0] - 40, 540); ctx.scale(-0.5, -0.5); ctx.globalAlpha = tw(u, 0.5, 2); E.apple(ctx, t, 0, 0, 90); ctx.restore(); pill('upside down', 1300, 760, shows(t, 72, 75.8)); }],
  // 8. the retina is built backwards
  [76, 83, (ctx, t, u) => { zoomAt(ctx, 960, 300, 1 + 0.6 * (1 - tw(u, 0, 6, 'inOut')), () => E.retina(ctx, t, { lit: '', beam: null })); pill('the retina is built backwards', 960, 980, shows(t, 76.6, 82.8)); }],
  [83, 90, (ctx, t, u) => { const be = lerp(0, 790, tw(u, 0, 5.5, 'inOut')); follow(ctx, 30 + 14 * 64, clamp(be, 360, 720), 960, 540, 1.5, () => E.retina(ctx, t, { lit: '', beam: 30 + 14 * 64, beamEnd: be })); pill('light passes the nerve wiring first', 960, 980, shows(t, 83.6, 89.8)); }],
  // 9. rods and cones
  [90, 97, (ctx, t, u) => { follow(ctx, lerp(760, 1160, tw(u, 0, 7, 'inOut')), 540, 960, 540, 1.25, () => E.retina(ctx, t, { lit: 'LMS' })); ctx.fillStyle = 'rgba(0,0,30,0.55)'; ctx.fillRect(0, 0, 1920, 560); pill('about 120 million rods: dim light', 600, 400, shows(t, 90.6, 96.8)); pill('about 6 million cones: colour', 1300, 560, shows(t, 92, 96.8)); }],
  [97, 104, (ctx, t, u) => { const dim = 1 - tw(u, 2.9, 4.1); E.retina(ctx, t, { lit: dim > 0.5 ? '' : 'LMS' }); ctx.fillStyle = `rgba(0,0,40,${0.6 * dim})`; ctx.fillRect(0, 0, 1920, 1080); if (dim > 0.4) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { if (i % 4 === 2) continue; const g = ctx.createRadialGradient(30 + i * 64, 780, 0, 30 + i * 64, 780, 60); g.addColorStop(0, `rgba(190,170,255,${0.5 * dim})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(i * 64 - 30, 720, 120, 120); } ctx.restore(); } pill(dim > 0.5 ? 'night: rods' : 'day: cones', 960, 120, shows(t, 97.6, 103.8)); }],
  // 10. three kinds of cone; the red ray finds a red one
  [104, 110, (ctx, t, u) => { const k = ['L', 'M', 'S'][Math.min(2, Math.floor(u / 1.6))]; E.retina(ctx, t, { lit: u > 4.8 ? 'LMS' : k }); pill('reds, greens and blues', 960, 120, shows(t, 104.6, 109.8)); }],
  [110, 116, (ctx, t, u) => { zoomAt(ctx, 30 + 14 * 64, 840, 1 + 1.6 * tw(u, 1.5, 6, 'in'), () => E.retina(ctx, t, { lit: 'L', beam: 30 + 14 * 64, beamEnd: lerp(0, 830, tw(u, 0, 2)) })); pill('our red ray finds a red cone', 960, 120, shows(t, 110.6, 115.8)); }],
  // 11. one molecule snaps
  [116, 123, (ctx, t, u) => { E.coneInside(ctx, t, 0); zoomAt(ctx, 960, 560, 1 + 0.8 * tw(u, 0, 6, 'inOut'), () => E.retinal(ctx, t, 960, 560, 40, 0)); pill('one molecule: retinal', 960, 980, shows(t, 116.6, 122.8)); }],
  [123, 130, (ctx, t, u) => { const s = tw(u, 2.5, 2.9, 'out'), r = tw(u, 0.3, 2.5, 'out'); ctx.save(); shake(ctx, t, 125.5); E.coneInside(ctx, t, s); E.retinal(ctx, t, 960, 560, 72, s); redRay(ctx, 200, 100, lerp(200, 900, r), lerp(100, 520, r), 20, 1 - tw(u, 2.6, 3.2)); ctx.restore();
    ctx.fillStyle = `rgba(0,0,12,${0.3 * shows(t, 124.2, 125.5, 0.4)})`; ctx.fillRect(0, 0, 1920, 1080); const ring = tw(u, 2.5, 3.2, 'out'); if (ring > 0 && ring < 1) { ctx.strokeStyle = `rgba(255,240,220,${1 - ring})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(960, 560, 60 + ring * 520, 0, 7); ctx.stroke(); } pill('under a trillionth of a second', 960, 980, shows(t, 126, 129.8)); pill('the first step of seeing', 960, 120, shows(t, 126.3, 129.8)); }],
  // 12. the chain reaction, the cone fires
  [130, 136, (ctx, t, u) => { ctx.save(); ctx.translate(960, 560); ctx.scale(lerp(1.35, 1, tw(u, 0, 6, 'out')), lerp(1.35, 1, tw(u, 0, 6, 'out'))); ctx.translate(-960, -560); E.coneInside(ctx, t, 0.4); for (let i = 0; i < 30; i++) { const d = tw(u, i * 0.12, i * 0.12 + 0.4), a = i * 2.4, r = 40 + i * 16; if (d <= 0) continue; E.spark(ctx, 960 + Math.cos(a) * r, 560 + Math.sin(a) * r * 0.6, 10 * d, d); } E.retinal(ctx, t, 960, 560, 40, 1); ctx.restore(); pill('a chain reaction', 960, 120, shows(t, 130.6, 135.8)); }],
  [136, 142, (ctx, t, u) => { E.retina(ctx, t, { lit: 'L' }); const x = 30 + 14 * 64, p = tw(u, 0.5, 5); E.spark(ctx, x, lerp(860, 300, p), 26); pill('the cone fires a signal', 960, 120, shows(t, 136.6, 141.8)); }],
  // 13. relay to the optic nerve
  [142, 148, (ctx, t, u) => { E.nerveField(ctx, t, u); pill('nerve cells pass it on', 960, 120, shows(t, 142.6, 147.8)); }],
  [148, 154, (ctx, t, u) => { navy(ctx); const geo = E.eye(ctx, t, 760, 540, 380); for (let k = 0; k < 8; k++) { const ph = (u * 0.5 + k / 8) % 1, x = lerp(geo.disc[0] - 200, 1920, ph); E.spark(ctx, x, x < geo.disc[0] ? geo.disc[1] - 60 + ph * 80 : geo.disc[1] + (x - geo.disc[0]) * 0.07, 16); } pill('the optic nerve: about a million fibres', 960, 980, shows(t, 148.6, 153.8)); }],
  // 14. the blind spot
  [154, 160, (ctx, t, u) => { E.retina(ctx, t, { lit: 'LMS' }); ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.ellipse(960, 720, 300 * tw(u, 0.3, 2), 380, 0, 0, 7); ctx.fill(); for (let f = 0; f < 18; f++) { ctx.strokeStyle = 'rgba(255,170,60,0.8)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(960 + (f - 9) * 30 * tw(u, 0.3, 2), 1080); ctx.quadraticCurveTo(960 + (f - 9) * 20, 700, 960 + (f - 9) * 6, 360); ctx.stroke(); } pill('no sensors where the cable leaves: the blind spot', 960, 120, shows(t, 154.6, 159.8), { size: 32 }); }],
  [160, 166, (ctx, t, u) => { navy(ctx); ctx.fillStyle = '#f6f2ea'; ctx.beginPath(); ctx.roundRect(140, 180, 1100, 560, 40); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(160, 740, 1060, 16);
    ctx.fillStyle = '#1a1a2a'; ctx.font = `800 120px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', 400, 460); const a = 1 - tw(u, 2, 3.2); ctx.fillStyle = `rgba(232,32,42,${a})`; ctx.beginPath(); ctx.arc(980, 460, 60, 0, 7); ctx.fill();
    zoomAt(ctx, 1560, 470, 0.62, () => { const geo = E.eye(ctx, t, 1560, 470, 400, { pupil: 0.5 }); const hit = tw(u, 2, 3.2); redRay(ctx, geo.front[0] - 200, 470 + 160, geo.disc[0] - 10, geo.disc[1], 22, 0.4 + 0.6 * hit); if (hit > 0.5) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(geo.disc[0], geo.disc[1], 60, 0, 7); ctx.stroke(); } });
    pill('cover your left eye, stare at +, lean in', 960, 100, shows(t, 160.3, 165.95), { size: 30 }); pill('its light lands on the blind spot', 1560, 860, shows(t, 161.9, 165.95), { size: 30 }); pill('your brain fills the gap', 700, 860, shows(t, 162.4, 165.95), { size: 30 }); }],
  // 15. the crossing
  [166, 172, (ctx, t, u) => { zoomAt(ctx, 700, 560, 1 + 0.1 * tw(u, 0, 6, 'inOut'), () => E.brainTop(ctx, t, u, { prog: 1 })); pill('the optic nerves meet at a crossing', 960, 100, shows(t, 166.6, 171.8)); }],
  [172, 178, (ctx, t, u) => { zoomAt(ctx, 960, 540, 1.04 + 0.06 * tw(u, 0, 6), () => E.brainTop(ctx, t, u, { signals: true })); pill('left side of your view → right side of your brain', 960, 100, shows(t, 172.6, 177.8), { size: 32 }); }],
  // 16. to the visual cortex
  [178, 185, (ctx, t, u) => { follow(ctx, lerp(960, 1160, tw(u, 0, 7, 'inOut')), 540, 960, 540, 1.1, () => E.brainTop(ctx, t, u, { signals: true, cortex: tw(u, 3, 6) })); pill(`${Math.round(lerp(0, 90, tw(u, 0, 5)))} ms`, 1700, 540, shows(t, 178.6, 184.8), { size: 40 }); }],
  [185, 192, (ctx, t, u) => { follow(ctx, lerp(1160, 1400, tw(u, 0, 7, 'inOut')), 540, 960, 540, lerp(1.1, 1.35, tw(u, 0, 7, 'inOut')), () => E.brainTop(ctx, t, u, { cortex: 1 })); pill('the visual cortex', 960, 980, shows(t, 185.6, 191.8)); }],
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
  [213, 220, (ctx, t, u) => { const bg = ctx.createRadialGradient(960, 540, 100, 960, 540, 1100); bg.addColorStop(0, '#6a2a8a'); bg.addColorStop(1, '#1a0a3a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080); const m = tw(u, 0, 3, 'inOut'); for (const [x, y] of [[380, 360], [1540, 360], [380, 760], [1540, 760]]) { ctx.globalAlpha = 1 - m; eEll(ctx, lerp(x, 960, m), lerp(y, 560, m), 140, 130, 'rgba(255,120,120,0.6)'); ctx.globalAlpha = 1; } if (m > 0.6) E.apple(ctx, t, 960, 580, 200 * tw(u, 2, 3.5, 'backOut')); pill('put back together into one view', 960, 980, shows(t, 213.6, 219.8)); }],
  // 19. millions of rays, every moment
  // the climb: millions of rays into the eye, then the camera pulls out of the kid's eye into the kitchen (the ride, reversed)
  [220, 226, (ctx, t, u) => { navy(ctx); zoomAt(ctx, 1000, 540, 1.12 - 0.12 * tw(u, 0, 6, 'out'), () => { const geo = E.eye(ctx, t, 1000, 540, 380, { pupil: 0.5 }); for (let i = 0; i < 9; i++) { const col = ['255,90,90', '120,220,120', '120,170,255', '255,220,120'][i % 4], p = clamp(u * 0.6 - i * 0.07); if (p <= 0) continue; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, p * 3); ctx.strokeStyle = `rgba(${col},0.55)`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 540 + (i - 4) * 110); ctx.lineTo(geo.front[0], 540 + (i - 4) * 12); ctx.lineTo(geo.focus[0], 540 - (i - 4) * 40); ctx.stroke(); ctx.restore(); } }); pill('millions of rays', 960, 980, shows(t, 220.6, 225.8)); }],
  [226, 232, (ctx, t, u) => { zoomAt(ctx, 699, 413, lerp(6, 1, tw(u, 0, 5.6, 'inOut')), () => { kitchenShot(ctx, t, { mood: 'curious' }); for (let i = 0; i < 24; i++) { const sx = 950 + K.hash(i, 1) * 970, sy = 80 + K.hash(i, 2) * 900, p = (u * 0.5 + K.hash(i, 3)) % 1; redRay(ctx, sx, sy, lerp(sx, 699, p), lerp(sy, 413, p), 8, 0.5 + 0.5 * K.hash(i, 4)); } }); pill('every moment', 960, 120, shows(t, 227.4, 231.8)); }],
  // 20. you see with your brain
  [232, 240, (ctx, t, u) => { E.kitchen(ctx, t); const kx = 700, R = 175, ky = 760 - 2.1 * R, m = tw(u, 0.5, 2.5, 'inOut'), r = 82;
    // the apple travels from the table up to the mouth; the hand cups it; the forearm ends at the hand's wrist
    const ax = kx + lerp(2.0, 1.32, m) * R, ay = ky + lerp(1.35, 0.5, m) * R, wrist = [ax - r * 0.95, ay + r * 1.15];
    E.kid(ctx, t, kx, ky, R, { mood: u < 3.1 ? 'happy' : u < 5.4 ? 'chew' : 'happy', hold: [(wrist[0] - kx) / R, (wrist[1] - ky) / R], look: [0.06, 0.06] });
    E.apple(ctx, t, ax, ay, r, { bite: tw(u, 3, 3.4) }); E.gripHand(ctx, ax, ay, r);
    pill('you see with your brain', 960, 120, shows(t, 232.6, 239.6)); }],
];
// the scale readout rides along (field of view across the frame, metres; log-interpolated; jumps hide under the bloom)
const FOV = [[22, 2], [27, 2], [31.99, 0.3], [32, 0.06], [37.99, 0.06], [38, 0.032], [44, 0.03], [54, 0.046], [66, 0.038], [71, 0.06], [75.99, 0.06],
  [76, 0.00016], [83, 0.00025], [83.01, 0.00017], [90, 0.00017], [90.01, 0.0002], [110, 0.00025], [115.99, 0.0001], [116, 5e-6], [122.99, 3e-6], [123, 5e-9], [129.99, 5e-9],
  [130, 2e-6], [135.99, 3e-6], [136, 0.00025], [142, 0.00025], [220, 0.06], [225.99, 0.06], [226, 0.5], [232, 3]];
const fovAt = (t) => { for (let i = 0; i < FOV.length - 1; i++) if (t < FOV[i + 1][0]) { const [a, va] = FOV[i], [b, vb] = FOV[i + 1]; return Math.exp(lerp(Math.log(va), Math.log(vb), clamp((t - a) / (b - a)))); } return FOV[FOV.length - 1][1]; };
const fmtM = (m) => { const [v, unit] = m >= 1 ? [m, 'm'] : m >= 0.01 ? [m * 100, 'cm'] : m >= 0.001 ? [m * 1000, 'mm'] : m >= 1e-6 ? [m * 1e6, 'µm'] : [m * 1e9, 'nm']; return `${v >= 10 ? Math.round(v) : v >= 1 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100} ${unit}`; };
const readout = (ctx, t) => {
  const vis = shows(t, 22.4, 141.6, 0.4) + shows(t, 220.4, 231.6, 0.4); if (vis <= 0) return;
  ctx.save(); ctx.globalAlpha = vis; ctx.fillStyle = 'rgba(10,12,34,0.6)'; ctx.beginPath(); ctx.roundRect(36, 948, 330, 96, 26); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(66, 978); ctx.lineTo(336, 978); ctx.moveTo(66, 968); ctx.lineTo(66, 988); ctx.moveTo(336, 968); ctx.lineTo(336, 988); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = `700 34px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`${fmtM(fovAt(t))} across`, 201, 1014); ctx.restore();
};
// "through the light": at each change of scale the camera pushes into the hero's glow and the next scale opens out of it
const BLOOM = [[32, '255,80,80', 699, 413, 600, 540], [76, '255,80,80', 1280, 540, 926, 120], [116, '255,80,80', 926, 840, 960, 560], [142, '90,230,255', 926, 300, 960, 540],
  [166, '90,230,255', 1700, 560, 250, 540], [192, '255,200,90', 1500, 540, 960, 540], [226, '255,80,80', 600, 540, 699, 413]];
const bloom = (ctx, t) => { for (const [b, c, xo, yo, xi, yi] of BLOOM) { const d = t - b; if (d < -0.5 || d >= 0.5) continue;
  const k = d < 0 ? tw(d, -0.5, 0, 'in') : 1 - tw(d, 0, 0.5, 'out'), [x, y] = d < 0 ? [xo, yo] : [xi, yi], r = 30 + k * 2300, g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,250,245,${k})`); g.addColorStop(0.35, `rgba(${c},${k})`); g.addColorStop(0.8, `rgba(${c},${0.9 * k})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); } };
// "turn the model": the cutaway squashes to an edge and opens as the face-on iris (and back)
const TURNS = [44, 54];
const turnAt = (t) => { for (const b of TURNS) if (Math.abs(t - b) < 0.3) return Math.max(0.02, Math.abs(t - b) / 0.3); return 1; };
const D = 240;
const toPlan = (t) => { if (typeof TIMING === 'undefined') return t; const V = TIMING.VOICE, Pl = TIMING.PLAN; for (let i = 0; i < V.length - 1; i++) if (t < V[i + 1] || i === V.length - 2) return Pl[i] + (Pl[i + 1] - Pl[i]) * clamp((t - V[i]) / (V[i + 1] - V[i])); return Pl[Pl.length - 1]; };
const FILM = {
  draw(tf) {
    // film time -> planned picture time: each line's scene stretches or shrinks to the voice (src/timing.js from align.py)
    const t = Math.min(D - 0.001, toPlan(tf));
    const ctx = P.ctx; const s = SHOTS.find(([a, b]) => t >= a && t < b) ?? SHOTS[SHOTS.length - 1], sx = turnAt(t);
    CUR = [s[0], s[1]];
    if (sx < 1) { ctx.fillStyle = '#05061a'; ctx.fillRect(0, 0, 1920, 1080); ctx.save(); ctx.translate(960, 0); ctx.scale(sx, 1); ctx.translate(-960, 0); }
    s[2](ctx, t, t - s[0]); if (sx < 1) ctx.restore();
    bloom(ctx, t); readout(ctx, t);
    if (t < 0.6) P.haze('#05030a', 1 - t / 0.6); if (t > D - 1) P.haze('#05030a', t - (D - 1));
    P.vignette(0.25);
  },
  // the thumbnail (studio/references/thumbs/STYLE.md): the eye cut in half, huge and lit; the apple outside the right way up,
  // its picture on the retina upside down (the red arrow points at it)
  thumb(ctx) {
    const bg = ctx.createRadialGradient(1100, 650, 100, 1100, 650, 1300); bg.addColorStop(0, '#2a2a8a'); bg.addColorStop(1, '#05061a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1920, 1080);
    const geo = E.eye(ctx, 2, 1120, 660, 470, { pupil: 0.5, lens: 0.3 }); E.ray(ctx, 2, geo, 230, undefined, 0.8);
    const g = ctx.createRadialGradient(250, 660, 20, 250, 660, 330); g.addColorStop(0, 'rgba(255,220,150,0.55)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, 300, 600, 720);
    E.apple(ctx, 2, 250, 660, 165);
    ctx.save(); ctx.translate(geo.focus[0] - 70, 660); ctx.scale(-0.62, -0.62); E.apple(ctx, 2, 0, 0, 165); ctx.restore();
  },
  // the model sheet (lemo's rule: before animating a character): key poses, expressions, palette. node tools2/film.mjs eyes model
  model(ctx) {
    ctx.fillStyle = '#f4ecdc'; ctx.fillRect(0, 0, 1920, 1080);
    const label = (str, x, y, size = 26, col = '#3a2a4a', align = 'center') => { ctx.fillStyle = col; ctx.font = `700 ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(str, x, y); };
    const table = (x0, x1, y) => { ctx.fillStyle = '#c98a52'; ctx.fillRect(x0, y, x1 - x0, 24); ctx.fillStyle = '#a86a3a'; ctx.fillRect(x0, y + 24, x1 - x0, 10); };
    label('The kid: model sheet', 60, 56, 46, '#2a1838', 'left');
    label('Profile only (the film never turns the kid). Built by construction: head circle, neck column, torso bean, shoulder > elbow on the table > hand.', 60, 102, 22, '#6a5a7a', 'left');
    const R = 100, ky = 330, t = 1.0;
    [['A  looking: chin on the hand', 330, 0], ['B  holding the apple', 880, 1], ['C  the bite', 1430, 2]].forEach(([lab, kx, k]) => {
      table(kx - 260, kx + 240, ky + 2.1 * R); label(lab, kx, ky + 2.1 * R + 70, 28);
      if (k === 0) { E.kid(ctx, t, kx, ky, R, { mood: 'curious' }); return; }
      const m = k === 1 ? 0 : 1, r = 50, ax = kx + lerp(2.0, 1.32, m) * R, ay = ky + lerp(1.35, 0.5, m) * R, wrist = [ax - r * 0.95, ay + r * 1.15];
      E.kid(ctx, t, kx, ky, R, { mood: k === 1 ? 'happy' : 'chew', hold: [(wrist[0] - kx) / R, (wrist[1] - ky) / R], look: [0.06, 0.06] }); E.apple(ctx, t, ax, ay, r, { bite: k === 2 ? 1 : 0 }); E.gripHand(ctx, ax, ay, r); });
    // expressions (heads, same scale)
    label('Expressions', 60, 700, 30, '#2a1838', 'left');
    ['neutral', 'curious', 'wow', 'happy', 'chew'].forEach((md, i) => { const x = 230 + i * 300, y = 850, r = 70;
      ctx.save(); ctx.beginPath(); ctx.arc(x + 10, y + 5, r * 1.45, 0, 7); ctx.fillStyle = '#ead9be'; ctx.fill(); ctx.clip(); E.kid(ctx, t, x, y, r, { mood: md }); ctx.restore(); label(md, x + 10, y + r * 1.45 + 34, 26); });
    // palette
    label('Palette', 1790, 160, 30, '#2a1838');
    [['#f6b48a', 'skin'], ['#dd8e66', 'skin shade'], ['#ffd08a', 'rim light'], ['#2a52c8', 'hoodie'], ['#1c3a9a', 'hoodie shade'], ['#2a1838', 'hair'], ['#e8a058', 'hair rim'], ['#d8202a', 'apple']].forEach(([c, n], i) => {
      const y = 215 + i * 62; ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(1700, y, 56, 46, 12); ctx.fill(); label(n, 1770, y + 23, 22, '#3a2a4a', 'left'); });
  },
};
