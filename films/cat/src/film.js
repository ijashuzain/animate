// Why Cats Land on Their Feet: one real fall in a living room at night, replayed in slow motion with a millisecond
// clock; the camera rides the falling cat, and cutaways open over its real body (inner ear, nerves, spine) at each step.
const T = { fall: 3.0, rw0: 6.4, rw1: 9.6, ear: 10, eyes: 24, sig: 28, bend: 34, front: 50, back: 64, replay: 76, hush: 88.5, legs: 90.5, kit: 104, two: 111.5, end: 116.5, D: 125 };
// story time (ms since the cat left the shelf): real speed in the hook, a rewind, then slow motion through the steps
const MS = track([[0, -3000], [T.fall, 0, 'linear'], [T.rw0, 3400, 'linear'], [T.rw1, 0, 'inOut'], [T.ear, 0], [T.eyes, 15, 'linear'], [T.bend, 50, 'linear'], [T.front, 90, 'linear'], [T.back, 170, 'linear'], [T.replay, 250, 'linear']]);
const MS2 = track([[T.replay, 250], [T.replay + 0.6, 0, 'inOut'], [86, 250, 'inOut'], [T.hush, 300, 'out'], [T.legs, 300], [99.5, LAND, 'in'], [T.kit, LAND + 900, 'out']]);
const msOf = (t) => (t < T.replay ? MS(t) : t < T.kit ? MS2(t) : t < T.end ? 0 : (t - T.end - 1.0) * 1000);
// the world's own clock: in slow motion the pendulum, the moth and the goldfish slow down too
const worldT = (t) => (t < T.fall ? t : t < T.kit ? T.fall + msOf(t) / 1000 : t);

// where the moth is: round the lamp, over to the sleeping cat, startled up and away, back to the lamp
function mothAt(w) {
  const lamp = [230 + Math.cos(w * 2.2) * 26, 160 + Math.sin(w * 3.1) * 12];
  const nose = [78 + Math.sin(w * 6) * 4, 208 + Math.cos(w * 5) * 3];
  const away = [122 + Math.sin(w * 3) * 6, 214 + (w - 2.6) * 14];
  if (w < 1.0) return lamp; if (w < 1.9) return K.mix(lamp, nose, K.ease.inOut(K.inv(1.0, 1.9, w)));
  if (w < 2.5) return nose; if (w < 3.4) return K.mix(nose, away, K.ease.out(K.inv(2.5, 3.4, w)));
  if (w < 3.6) return away; return K.mix(away, lamp, K.ease.inOut(K.inv(3.6, 6.0, w)));
}
function catState(t) {
  const ms = msOf(t);
  if (t >= T.end) { const o = pose(ms); if (ms > 1500) Object.assign(o, { walk: 1, tailUp: 1, mood: 'happy', look: [0.5, 0.1], legsOut: 0, arch: 0, tuckF: 0, tuckB: 0 }); return { ms, o, p: place(ms, 1500) }; }
  const o = pose(ms), p = place(ms);
  // the inner-ear beat: the cat rocks a little in the air, so the crystals can be seen to slide toward the ground
  if (t > T.ear && t < T.eyes + 1) p.rot = 0.32 * Math.sin((t - 14.5) * 1.1) * tw(t, 14.5, 16.5) * (1 - tw(t, 22.5, 24.5));
  return { ms, o, p };
}
// rotate the cat about its body centre (its origin is between its feet)
function drawHero(t, st, extra) {
  const { p, o } = st, F = Animals.catFrame(o), c = [p.x, p.y + F.by * S], r = p.rot || 0;
  const ox = c[0] + Math.sin(r) * F.by * S, oy = c[1] - Math.cos(r) * F.by * S;
  const oo = Object.assign({}, o, { rot: r }); hero(t, ox, oy, S, oo);
  if (extra) Animals.catAt(ox, oy, S, oo, (F2) => extra(F2));
  return { ox, oy, oo };
}
function camera(t, st) {
  const c = centre(st.p, st.o), h0 = headAt(st.p, st.o), r = st.p.rot || 0, F0 = Animals.catFrame(st.o), bc = [st.p.x, st.p.y + F0.by * S];
  // the head as drawn (the cat rotates about its body centre); aim a little toward the scan window, which sits over the eyes
  const hv = [h0[0] - bc[0], h0[1] - bc[1]], h = [bc[0] + hv[0] * Math.cos(r) - hv[1] * Math.sin(r), bc[1] + hv[0] * Math.sin(r) + hv[1] * Math.cos(r) - 3];
  const keys = [
    // [t, x, y, h, follow 0..1 (0 = the room, 1 = the cat), aim at the head 0..1]
    [0, 40, 140, 330, 0, 0], [2.6, 50, 122, 250, 0, 0], [T.fall, 60, 118, 250, 0, 0], [T.rw0, 80, 110, 270, 0, 0], [T.rw1, 0, 0, 90, 1, 0],
    [T.ear + 2.6, 0, 0, 21, 1, 1], [T.eyes - 0.3, 0, 0, 20, 1, 1], [T.eyes + 1.6, 30, 40, 230, 0.55, 0], [T.sig - 0.4, 30, 40, 230, 0.55, 0], [T.sig + 1.2, 0, 0, 82, 1, 0],
    [T.bend + 1.5, 0, 0, 70, 1, 0], [T.front, 0, 0, 80, 1, 0], [T.replay, 0, 0, 82, 1, 0], [T.hush, 0, 0, 72, 1, 0], [T.legs + 0.6, 0, 0, 72, 1, 0], [98.5, 0, 0, 140, 1, 0], [103.6, 0, 0, 150, 1, 0],
  ];
  if (t >= T.kit && t < T.two) return { x: lerp(-60, -372, tw(t, T.kit, T.kit + 0.7, 'expoInOut')), y: 70, h: 175 };
  if (t >= T.two && t < T.end) return { x: lerp(-372, -40, tw(t, T.two, T.two + 0.7, 'expoInOut')), y: 100, h: lerp(170, 270, tw(t, T.two, T.two + 0.7)) };
  if (t >= T.end) { const w = tw(t, T.end + 2.2, T.D - 1, 'inOut'); return { x: lerp(60, c[0] + 30, w), y: lerp(120, 90, w), h: lerp(250, 200, w) }; }
  let i = 1; while (i < keys.length - 1 && t > keys[i][0]) i++;
  const a = keys[i - 1], b = keys[i], u = K.ease.inOut(K.inv(a[0], b[0], t));
  const f = lerp(a[4], b[4], u), aim = lerp(a[5], b[5], u), tx = lerp(c[0], h[0], aim), ty = lerp(c[1], h[1], aim);
  const ty2 = t > T.legs ? Math.max(ty + 10, 62) : ty;
  const roll = Math.PI * tw(t, T.ear + 0.4, T.ear + 2.8, 'inOut') * (1 - tw(t, T.eyes - 1.6, T.eyes - 0.1, 'inOut'));
  return { rot: roll, x: lerp(lerp(a[1], b[1], u), tx, f), y: lerp(lerp(a[2], b[2], u), ty2, f), h: Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u)) };
}
// dust motes drifting in the lamp light (on the world clock, so they hang still in slow motion)
function motes(w) {
  for (let i = 0; i < 46; i++) { const x = 20 + hash(i, 1) * 300 + Math.sin(w * 0.3 + i) * 8, y = 30 + ((hash(i, 2) * 220 + w * (2 + hash(i, 3) * 3)) % 220);
    P.circle(x, y, 0.35 + hash(i, 4) * 0.5, `rgba(255,236,190,${0.25 + 0.35 * hash(i, 5)})`); }
}
const pill = (str, sx, sy, u, o = {}) => P.pill(str, sx, sy, Object.assign({ u, font: FONT, size: 38, weight: 600 }, o));
const REWIND = (ctx, r) => { ctx.fillStyle = '#1a2a4a'; for (const dx of [-r * 0.45, r * 0.35]) { ctx.beginPath(); ctx.moveTo(dx + r * 0.4, -r * 0.6); ctx.lineTo(dx - r * 0.5, 0); ctx.lineTo(dx + r * 0.4, r * 0.6); ctx.fill(); } };
const wpt = (p, F, uv) => { const q = F.pt(uv); return P.toScreen(p.x + q[0] * S, p.y + q[1] * S); };

const FILM = {
  draw(t) {
    const st = catState(t), w = worldT(t), cam = camera(t, st);
    P.cam(cam);
    room(w, cam); bookcase(w); lampAndTable(w); motes(w);
    if (t >= T.kit - 0.2 && t < T.two + 0.8) sofa(w, -420);
    if (t < T.kit || t >= T.end) { const m = mothAt(t >= T.end ? t - T.end + 6 : w); moth(w, m[0], m[1]); }
    else moth(w, 230 + Math.cos(w * 2.2) * 26, 160 + Math.sin(w * 3.1) * 12);
    if (t < T.kit || t >= T.end) heroBeats(t, st);
    if (t >= T.kit - 0.2 && t < T.two + 0.8) kittenBeat(t);
    if (t >= T.two - 0.2 && t < T.end) twoFalls(t);
    clockPill(t, st);
    P.vignette(0.3);
    if (t > T.D - 1.2) P.haze('#1a1020', tw(t, T.D - 1.2, T.D));
    if (t < 0.6) P.haze('#1a1020', 1 - tw(t, 0, 0.6));
  },
};
function heroBeats(t, st) {
  const { ms, o, p } = st, F = Animals.catFrame(o);
  // a warm glow behind the cat while it hangs, upright, in the silence
  const hush = tw(t, 86.5, T.hush) * (1 - tw(t, T.legs + 1, T.legs + 3)); if (hush > 0) { const c = centre(p, o); P.glow(c[0], c[1], 70, '255,214,150', 0.35 * hush); }
  // eyes find the floor: a soft line of sight from the eyes to the rug
  const look = tw(t, T.eyes + 0.6, T.eyes + 1.6) * (1 - tw(t, T.sig - 0.2, T.sig + 0.6));
  if (look > 0) { const h = headAt(p, o); P.alpha(look * 0.85, () => P.poly([[h[0] - 1, h[1]], [h[0] + 1, h[1]], [h[0] + 22, 0.5], [h[0] - 14, 0.5]], P.lin(0, h[1], 0, 0, 'rgba(255,240,200,0.1)', 'rgba(255,240,200,0.55)'))); P.alpha(look, () => P.circle(h[0] + 4, 1, 18, 'rgba(255,236,170,0.45)', { ry: 2.4 })); }
  const sig = t > T.sig ? tw(t, T.sig + 0.6, T.bend - 1.0, 'linear') : 0;
  const nerveA = tw(t, T.sig - 0.2, T.sig + 0.8) * (1 - tw(t, T.bend + 0.5, T.bend + 2));
  const spineA = tw(t, T.bend + 0.5, T.bend + 2) * (1 - tw(t, T.front + 1, T.front + 3));
  const flex = tw(t, T.bend + 4, T.bend + 7);
  const earA = tw(t, T.ear + 1.6, T.ear + 3.2) * (1 - tw(t, T.eyes - 0.5, T.eyes + 0.6)) + nerveA * 0.0;
  drawHero(t, st, (F2) => {
    insides(t, F2, nerveA, sig, spineA, flex, o);
    if (earA > 0) {
      const R = F2.head[2] + (st.p.rot || 0), g0 = [-Math.sin(R), -Math.cos(R)];
      const spark = t > T.ear + 8 && t < T.eyes - 0.6 ? (t * 1.4) % 1 : 0;
      P.at(F2.head[0], F2.head[1], F2.head[2], F2.hs, F2.hs, () => innerEar(t, earA, g0, spark, F2, (top, sac) => {
        pill('inner ear: balance organ', top[0] - 520, top[1], tw(t, T.ear + 3, T.ear + 3.6) * (1 - tw(t, T.eyes - 1, T.eyes - 0.5)));
        pill('crystals', sac[0] + 250, sac[1] - 120, tw(t, T.ear + 6.5, T.ear + 7.1) * (1 - tw(t, T.eyes - 1, T.eyes - 0.5)), { size: 34 });
      }));
    }
    rollArrow(F2, 0.62, tw(t, T.front + 1, T.front + 2) * (1 - tw(t, T.back - 0.5, T.back + 0.5)), true);
    rollArrow(F2, -0.62, tw(t, T.front + 2, T.front + 3) * (1 - tw(t, T.back - 0.5, T.back + 0.5)), false);
    rollArrow(F2, -0.62, tw(t, T.back + 1, T.back + 2) * (1 - tw(t, T.replay - 0.6, T.replay)), true);
    rollArrow(F2, 0.62, tw(t, T.back + 2, T.back + 3) * (1 - tw(t, T.replay - 0.6, T.replay)), false);
  });
  // labels beside the action (calm pills, names and numbers only)
  const lab = (str, uv, dx, dy, a, size) => { if (a <= 0) return; const s = wpt(p, F, uv); pill(str, s[0] + dx, s[1] + dy, a, { size: size ?? 34 }); };
  if (nerveA > 0) {
    const on = (u0) => tw(t, T.sig + 0.6 + u0 * (T.bend - 1.6 - T.sig), T.sig + 1.0 + u0 * (T.bend - 1.6 - T.sig)) * (1 - tw(t, T.bend - 0.2, T.bend + 0.5));
    lab('brain', [1.3, 0.3], 0, -190, on(0.12)); lab('spinal cord', [0.0, 0.2], 0, -200, on(0.4)); lab('leg muscles', [-0.4, -0.9], -40, 220, on(0.78));
  }
  lab('eyes find the floor', [1.3, 0.3], 260, 40, look);
  lab('chest spine: bends and twists', [0.55, 0.2], 120, -220, tw(t, T.bend + 3.6, T.bend + 4.2) * (1 - tw(t, T.front - 0.6, T.front)));
  lab('lower back: stiffer', [-0.6, 0.2], -120, -220, tw(t, T.bend + 6.6, T.bend + 7.2) * (1 - tw(t, T.front - 0.6, T.front)));
  lab('legs tucked: turns fast', [0.62, 0.2], 140, -250, tw(t, T.front + 2.5, T.front + 3.1) * (1 - tw(t, T.back - 0.6, T.back)));
  lab('legs out: barely turns', [-0.62, 0.2], -160, -250, tw(t, T.front + 5, T.front + 5.6) * (1 - tw(t, T.back - 0.6, T.back)));
  lab('legs tucked: turns fast', [-0.62, 0.2], -160, -250, tw(t, T.back + 2.5, T.back + 3.1) * (1 - tw(t, T.replay - 0.6, T.replay)));
  lab('about 80 ms later', [-0.62, -0.4], -160, 250, tw(t, T.back + 5.5, T.back + 6.1) * (1 - tw(t, T.replay - 0.6, T.replay)));
  if (t > T.replay + 0.6 && t < T.hush) {
    const a = tw(t, T.replay + 0.8, T.replay + 1.4) * (1 - tw(t, 87.4, 88));
    lab(`front ${Math.round(o.front * 180)}°`, [0.62, 0.2], 140, -250, a, 36); lab(`back ${Math.round(o.back * 180)}°`, [-0.62, 0.2], -160, -250, a, 36);
  }
  lab('legs out, back arched', [0, 0.6], 0, -240, tw(t, T.legs + 1.2, T.legs + 1.8) * (1 - tw(t, 97.5, 98.3)));
  // the landing: dust puffs, a little bounce
  const land = T.legs + 9; if (t > land - 0.1 && t < land + 2 && ms >= LAND) {
    const u = tw(t, land, land + 1.6, 'out');
    for (let i = 0; i < 8; i++) { const a = (i / 7) * Math.PI, r = 6 + u * 26; P.alpha((1 - u) * 0.6, () => P.blob(p.x + 4 + Math.cos(a) * r * 1.6, 2 + Math.sin(a) * r * 0.25, 5 + u * 6, 3 + u * 3, '#e9d2b4', { seed: i })); }
  }
  // the final replay at full speed, and the kitten trotting in to follow its mum
  if (t >= T.end) {
    const kx = lerp(-260, p.x - 60, tw(t, T.end + 3, T.D - 0.5, 'linear'));
    if (t > T.end + 3) kitten(t, kx, 0, { walk: 1, tailUp: 1, mood: 'happy', look: [0.6, 0.2] });
  }
}
function clockPill(t, st) {
  const ms = st.ms;
  if (t > T.fall - 0.2 && t < T.rw0) { const shown = Math.min(Math.max(ms, 0), 300) / 1000; pill(`${shown.toFixed(2)} s`, 300, 110, tw(t, T.fall - 0.2, T.fall) * (1 - tw(t, T.rw0 - 0.3, T.rw0)), { icon: STOPWATCH, size: 46 }); }
  if (t >= T.rw0 && t < T.rw1 + 0.2) pill('rewind', 300, 110, tw(t, T.rw0, T.rw0 + 0.3) * (1 - tw(t, T.rw1, T.rw1 + 0.2)), { icon: REWIND, size: 46 });
  if (t >= T.rw1 && t < T.kit) pill(`${Math.round(Math.max(0, Math.min(ms, LAND)))} ms`, 300, 110, tw(t, T.rw1 + 0.2, T.rw1 + 0.6) * (1 - tw(t, T.kit - 0.6, T.kit - 0.1)), { icon: STOPWATCH, size: 46 });
  if (t >= T.replay + 0.3 && t < 86) pill('replay', 300, 200, tw(t, T.replay + 0.3, T.replay + 0.7) * (1 - tw(t, 85.4, 86)), { size: 34, icon: REWIND });
  if (t >= T.end && t < T.D) { const shown = Math.min(Math.max(ms, 0), 300) / 1000; pill(`${shown.toFixed(2)} s`, 300, 110, tw(t, T.end + 0.6, T.end + 1) * (1 - tw(t, T.D - 2, T.D - 1.5)), { icon: STOPWATCH, size: 46 }); }
}
// the kitten: 3 weeks old it only half turns and flops onto the cushion; at 7 weeks it lands on its feet
function kittenBeat(t) {
  const sx = -440, seat = 52, ky = seat - 30 * 0.36, KL = Math.round(Math.sqrt(ky / G) * 1000);
  hero(t, -268, 0, S, { mood: 'happy', look: [-0.6, 0.3], tailUp: 0.8, dir: -1 });
  cushion(sx + 30, 0, 50);
  const tries = [[T.kit + 1.4, '3 weeks old', 0.5], [T.kit + 4.6, '7 weeks old', 1]];
  for (const [t0, label, skill] of tries) {
    const a = tw(t, t0 - 1.2, t0 - 0.9) * (1 - tw(t, t0 + 2.6, t0 + 2.9)); if (a <= 0 || t > t0 + 2.9 || t < t0 - 1.2) continue;
    pill(label, 960, 150, a, { size: 42 });
    const kms = (t - t0) * 300;                 // slow motion: 3.3 x slower
    let x = sx, y = ky, o;
    if (kms < 0) { const pm = Math.max(-2900, (t - t0) * 1000), sl = tw(pm, -470, 0, 'in'); o = pose(pm); x = lerp(lerp(sx - 34, sx, tw(pm, -1300, -650, 'linear')), sx + 24, sl); y = lerp(seat, ky, sl); }
    else {
      const f = Math.min(kms, KL) / 1000; x = sx + 24 + f * 20; y = Math.max(0, ky - G * f * f) + (skill < 1 && kms >= KL ? 6 : 0);
      o = pose(Math.min(kms * (LAND / KL), skill < 1 ? 150 : 10000));
      if (skill < 1 && kms >= KL) { o.mood = 'wow'; const up = tw(t, t0 + 1.6, t0 + 2.4); o.front = lerp(o.front, 1, up); o.back = lerp(o.back, 1, up); o.tuckF = lerp(o.tuckF, 0, up); o.tuckB = lerp(o.tuckB, 0, up); o.headRot = lerp(o.headRot, 0, up); o.bend = lerp(o.bend, 0, up); y = lerp(y, 0, up); }
      if (skill >= 1 && kms >= KL) { o.mood = 'happy'; }
    }
    kitten(t, x, y, Object.assign(o, { col: C.kitten }));
  }
}
// two falls side by side: from a low footstool the turn isn't finished in time (a cushion catches it); from the shelf it is
function twoFalls(t) {
  const a = tw(t, T.two + 0.4, T.two + 0.9);
  const sx = -170, stool = 30;
  P.rect(sx - 22, 0, 44, stool - 4, P.lin(0, stool, 0, 0, C.wood, C.wood2), { r: 2 }); P.lit([[sx - 26, stool - 5], [sx + 26, stool - 5], [sx + 26, stool], [sx - 26, stool]], '#c94f4a', { d: 0.2 });
  cushion(sx + 40, 0, 56);
  const ms = (t - T.two - 1.6) * 180, ly = stool - 30 * S + 2, LL = Math.round(Math.sqrt(ly / G) * 1000);
  // left: a ginger cat on the stool
  { let o, x, y; if (ms < 0) { const pm = Math.max(-2900, (t - T.two - 1.6) * 1000), sl = tw(pm, -470, 0, 'in'); o = pose(pm); x = lerp(lerp(sx - 16, sx + 2, tw(pm, -1300, -650, 'linear')), sx + 18, sl); y = lerp(stool, ly, sl); } else { const f = Math.min(ms, LL) / 1000; x = sx + 18 + f * 30; y = Math.max(0, ly - G * f * f) + (ms >= LL ? 7 : 0); o = pose(Math.min(ms, LL)); if (ms >= LL) o.mood = 'wow'; }
    Animals.cat(t, x, y, S, Object.assign(o, { col: '#d9874a' })); }
  // right: our cat from the shelf
  { const o = pose(ms), p = place(ms); hero(t, p.x, p.y, S, o); }
  pill('30 cm', 640, 860, a, { size: 40 }); pill('1.5 m', 1250, 230, a, { size: 40 });
  pill('not enough time to turn', 640, 950, tw(t, T.two + 3.3, T.two + 3.8), { size: 34 });
}
