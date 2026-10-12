// =====================================================================
//  SCENES + CARDS — How does GPS know where you are? Left: isometric hairline scenes (x 0..~990) on white.
//  Right: the channel card. One dark accent per frame: the dot (you), or the satellite that matters right now.
// =====================================================================
// the explanation is written straight onto the white ground: the style's sans, grey ink, the one dark accent,
// and the step as a mono label with a hairline (like the style's own isoTag)
const CHANNEL = { font: SANS, halo: false, colors: { ink: '#4a4a52', accent: PAL.accent, blue: '#6a6a74', green: PAL.accent },
  tag: (str, k) => { ctx.save(); ctx.globalAlpha = clamp(k); polyPath([[CL, 104], [CL + 60 * clamp(k), 104]], false); hair(PAL.edge); ctx.stroke(); ctx.font = `400 32px ${ISOMONO}`; ctx.fillStyle = PAL.text; ctx.textBaseline = 'alphabetic'; ctx.fillText(str, CL + 80, 114); ctx.restore(); } };
// a slow, steady push on every scene: hairlines on white change too few pixels to read as motion otherwise
// (the review flagged 11 dead beats); z stays within the style's limit of a few percent
SCN.forEach((s) => { if (!s.cam) s.cam = (t) => { const u = clamp((t - s.t0) / Math.max(1, s.t1 - s.t0)), f = s.focus; return camOf({ z: 1.0 + 0.065 * EZ.io(u), p: f, to: f }); }; });
const dropZ = (z0, t0, h = 220, k = 170, damp = 0.6) => z0 + (1 - spring(TT, t0, { k, damp })) * h;   // drop in on a spring
function circ2(x, y, r, c = PAL.edge, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } hair(c); ctx.stroke(); }
function ell2(x, y, rx, ry, rot = 0, c = PAL.inner, a0 = 0, a1 = TAU) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, a0, a1); hair(c); ctx.stroke(); }
function dash2(P, c = PAL.edge, gap = 10, off = 0) { const z = zoomNow(); ctx.save(); ctx.setLineDash([gap / z, gap / z]); ctx.lineDashOffset = off / z; polyPath(P, false); hair(c); ctx.stroke(); ctx.restore(); }
function monoT(str, x, y, size, c = PAL.text, align = 'center', count) { ctx.save(); ctx.font = `400 ${size}px ${ISOMONO}`; ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(count == null ? str : str.slice(0, count), x, y); ctx.restore(); }
const tick = (t, per = 60) => Math.floor(t) / per * TAU;   // a second hand that steps once a second (on 1s)

// a satellite centred at screen (x, y), scale s: a rounded body, two gridded solar panels on struts, an antenna.
// o: { clock: hand angle (a clock face on the front), lit: the accent lamp, tilt }
function satG(x, y, s = 1, o = {}) {
  const keep = ISO; setIso({ ox: x, oy: y, u: s });
  const panel = (px) => {
    isoBox(px, -18, -2, 74, 36, 4, { r: 3 });
    const top = faceOf([px, -18, 2], [1, 0, 0], [0, 1, 0]);
    for (const u of [18.5, 37, 55.5]) faceLine(top, [[u, 3], [u, 33]]);
    faceLine(top, [[3, 18], [71, 18]]);
  };
  panel(-124);
  line3([[-50, 0, 0], [-24, 0, 0]], PAL.edge);
  isoBox(-24, -24, -24, 48, 48, 48, { r: 7 });
  isoCyl(0, 0, 24, 9, 7); line3([[0, 0, 31], [0, 0, 46]], PAL.edge);
  const fr = faceOf([-24, 24, 24], [1, 0, 0], [0, 0, -1]);   // the front face (+y), u right, v down
  if (o.clock != null) { faceEll(fr, 24, 24, 15, 15, { stroke: PAL.edge }); faceLine(fr, [[24, 24], [24 + Math.sin(o.clock) * 11, 24 - Math.cos(o.clock) * 11]], PAL.edge); }
  else for (const v of [16, 26, 36]) faceLine(fr, [[10, v], [38, v]]);
  if (o.lit) accentDot(fr, 40, 8, 3.6); else lamp(fr, 40, 8, 3, blinkOn(TT, 1.0, x * 0.01));
  line3([[24, 0, 0], [50, 0, 0]], PAL.edge);
  panel(50);
  ISO = keep;
}
// a phone lying on a surface (back corner x, y, z): its screen shows a little map and, if dot, the dark dot (you)
function phoneG(x, y, z, o = {}) {
  isoBox(x, y, z, 96, 180, 9, { r: 16 });
  const top = faceOf([x, y, z + 9], [1, 0, 0], [0, 1, 0]);
  faceRR(top, 7, 12, 82, 156, 10);
  [[[8, 52], [88, 64]], [[8, 112], [88, 98]], [[32, 13], [40, 167]], [[66, 13], [58, 167]]].forEach((P) => faceLine(top, P, PAL.inner));
  if (o.dot !== false) {
    const [du, dv] = o.at ?? [49, 82], p = mod(TT, 1.5) / 1.5, k = o.k ?? 1;
    if (k > 0.05) { faceEll(top, du, dv, (6 + p * 20) * k, (6 + p * 20) * k, { stroke: mixHex(PAL.edge, PAL.face, p) }); accentDot(top, du, dv, 6 * k); }
  }
  return top;
}
// the Earth, seen side-on: an outline, latitude rings and slowly turning meridians (inner hairlines)
function earthG(cx, cy, R) {
  circ2(cx, cy, R, PAL.edge, PAL.face);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
  for (const lat of [-60, -30, 0, 30, 60]) { const a = lat * DEG; ell2(cx, cy - R * Math.sin(a), R * Math.cos(a), R * Math.cos(a) * 0.2); }
  for (let k = 0; k < 6; k++) { const ph = k * Math.PI / 6 + TT * 0.12; ell2(cx, cy, R * Math.abs(Math.cos(ph)), R); }
  ctx.restore();
}
// a plinth of two plates (back corner x, y), returns its top z
const plinth = (x, y, w, d, t0, h = 220) => isoPlates(x, y, 0, w, d, [{ h: 14, r: 40, dz: dropZ(0, t0, h) }, { h: 10, gap: 5, inset: 12, r: 32, dz: dropZ(0, t0 + 0.08, h) - dropZ(0, t0, h) }]);
// a desk clock lying on its back (centre x, y, z): face up, a hand at angle a
function deskClock(x, y, z, r, a) {
  isoCyl(x, y, z, r, 10);
  const top = faceOf([x, y, z + 10], [1, 0, 0], [0, 1, 0]);
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; faceLine(top, [[Math.cos(q) * r * 0.78, Math.sin(q) * r * 0.78], [Math.cos(q) * r * 0.9, Math.sin(q) * r * 0.9]]); }
  faceLine(top, [[0, 0], [Math.sin(a) * r * 0.7, -Math.cos(a) * r * 0.7]], PAL.edge);
}
// the card's little circles
const ringC = (x, y, r, t, c = CH.ink, key = 'rc') => { const f = ev(t, 0.6); if (f > 0) ink(ellipsePts(x, y, r, r, 0, 40).slice(0, Math.max(2, Math.ceil(41 * f))), { w: 5, color: c, key }); };

// ---- 1. the hook: a phone on a plinth, a dot on its map, the bot wondering
function sHook(o = {}) {
  setIso({ ox: 520, oy: 600, u: 1.3 });
  const t0 = o.t0 ?? S0(), pz = plinth(-190, -210, 360, 400, t0 + 0.1);
  if (TT > t0 + 0.5) phoneG(-110, -150, dropZ(pz, t0 + 0.55), { k: clamp((TT - t0 - 1.4) * 3) });
  if (TT > t0 + 0.8) isoMug(-140, 120, dropZ(pz, t0 + 0.85, 160), 24, 40);
  const look = o.look ?? (TT > at(5.6) && TT < at(9.6) ? Math.sin((TT - at(5.6)) * 3) : -0.4);
  if (TT > t0 + 1.0) cubeBot(90, 80, dropZ(pz, t0 + 1.05, 240, 170, 0.5), 74, { key: 'bot', hop: o.hop ?? at(10.0), look });
  if (!o.end && TT > at(10.0)) { const k = spring(TT, at(10.0), { k: 200, damp: 0.5 }); ctx.save(); ctx.font = `400 ${90 * k}px ${SANS}`; ctx.fillStyle = PAL.text; ctx.textAlign = 'center'; ctx.fillText('?', 760, 330); ctx.restore(); }
}
function cHook(at) {
  title('How does GPS know?', at(0.8));
  write('a dot, right where you are', CL, 400, 50, at(2.4));
  write("it can't see the street", CL, 520, 50, at(6.0));
  write('no one told it your address', CL, 640, 50, at(8.0));
  bigNum('?', null, CCX, 860, at(10.0), CH.accent, 170);
}

// ---- 2. satellites overhead
const ORB = [[720, 600, -0.22, 0.4], [760, 640, 0.18, 2.2], [700, 700, 0.05, 4.1]];   // rx, ry, rotation, phase
function orbitPos(i, t) { const [rx, ry, rot, ph] = ORB[i], a = ph + t * 0.16 + i * 0.7, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [495 + x * Math.cos(rot) - y * Math.sin(rot), 1240 + x * Math.sin(rot) + y * Math.cos(rot)]; }
function sSats() {
  const f = ev(at(0.6), 1.6);
  earthG(495, 1240, 560);
  ORB.forEach(([rx, ry, rot], i) => ell2(495, 1240, rx, ry, rot, PAL.inner, Math.PI, Math.PI + Math.PI * f));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const [x, y] = orbitPos(i, TT + j * 4.6 + i * 1.3); if (y > 1100 || f < 0.3) continue;
    satG(x, y, 0.72);
  }
  if (TT > at(9.6)) {   // you, on top of the world, with lines up to the satellites in view
    const k = spring(TT, at(9.6), { k: 160, damp: 0.6 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const [x, y] = orbitPos(i, TT + j * 4.6 + i * 1.3); if (y < 640) dash2([[495, 640], [x, y]], PAL.inner, 8, -TT * 40); }
    STYLE.hero(495, 668 - 30 * k, 26 * k, { key: 'botE' });
  }
}
function cSats(at) {
  title('Satellites overhead', at(0.6));
  write('20,200 km up', CL, 360, 54, at(1.6));
  bigNum('31', 'working GPS satellites (2023)', CCX, 540, at(3.0), CH.accent, 130);
  write('2 laps of Earth a day', CL, 760, 52, at(7.4));
  write('several always in view', CL, 870, 48, at(10.0), { color: CH.blue });
}

// ---- 3. a clock that shouts the time
function sClocks() {
  const k = spring(TT, at(0.3), { k: 120, damp: 0.7 });
  satG(495, 330 + (1 - k) * -300 + Math.sin(TT * 1.2) * 6, 2.0, { clock: tick(TT * 1), lit: true });
  for (let n = 0; n < 4; n++) {   // signal rings, one a second, rolling down from the antenna side
    const t0 = at(4.6) + n * 1.0; if (TT < t0) continue;
    const p = mod(TT - t0, 4.0) / 4.0; ell2(495, 420, 80 + p * 520, 30 + p * 200, 0, mixHex(PAL.edge, PAL.face, p), 0, Math.PI);
  }
  setIso({ ox: 495, oy: 900, u: 1 });
  isoPlates(-90, -90, 0, 180, 180, [{ h: 12, r: 30 }]);
  cubeBot(0, 0, 12, 64, { key: 'botC', look: 0, hop: at(10.4) });
  const s1 = 't = 10:42:07.000000000', s2 = 'I am at x, y, z';
  if (TT > at(7.4)) monoT(s1, 495, 125, 30, PAL.text, 'center', typed(s1, at(7.4), 18));
  if (TT > at(9.8)) monoT(s2, 495, 170, 30, PAL.textD, 'center', typed(s2, at(9.8), 18));
}
function cClocks(at) {
  title('A message, on repeat', at(0.6));
  write('atomic clocks on board', CL, 380, 52, at(1.6));
  write('...again and again:', CL, 500, 48, at(6.0), { color: CH.accent });
  bubble('this is the exact time', CCX - 30, 650, 46, at(7.6));
  bubble('and this is where I am', CCX + 10, 830, 46, at(10.0), CH.paper, { left: true });
}

// ---- 4. a delay is a distance
function sDelay() {
  satG(220, 220, 0.9, { clock: tick(TT), lit: TT < at(8.0) });
  setIso({ ox: 690, oy: 700, u: 1.0 });
  const pz = isoPlates(-150, -170, 0, 300, 340, [{ h: 12, r: 32 }]);
  const top = phoneG(-80, -130, pz, { dot: TT > at(8.0) });
  cubeBot(80, 90, pz, 60, { key: 'botD', hop: at(8.0), look: -0.5 });
  const target = isoP([-32, -40, pz + 9]), src = [262, 300];
  const f = ev(at(4.4), 0.8);
  if (f > 0) dash2([src, [lerp(src[0], target[0], f), lerp(src[1], target[1], f)]], PAL.inner, 10, -TT * 30);
  const u = clamp((TT - at(4.6)) / 3.4);
  if (u > 0 && u < 1) { const x = lerp(src[0], target[0], u), y = lerp(src[1], target[1], u); circ2(x, y, 9, PAL.accent, PAL.accent); }
  // the stopwatch: runs while the signal travels, then holds
  const sw = [230, 760], el = clamp(TT - at(4.6), 0, 3.4);
  circ2(sw[0], sw[1], 92, PAL.edge, PAL.face); circ2(sw[0], sw[1], 80, PAL.inner);
  polyPath([[sw[0], sw[1] - 92], [sw[0], sw[1] - 112]], false); hair(PAL.edge); ctx.stroke(); polyPath([[sw[0] - 20, sw[1] - 114], [sw[0] + 20, sw[1] - 114]], false); ctx.stroke();
  const a = el / 3.4 * TAU * 0.8; polyPath([[sw[0], sw[1]], [sw[0] + Math.sin(a) * 70, sw[1] - Math.cos(a) * 70]], false); hair(TT > at(8.0) ? PAL.accent : PAL.edge); ctx.stroke();
  monoT((el / 3.4 * 0.07).toFixed(3) + ' s', sw[0], sw[1] + 150, 34, PAL.text);
}
function cDelay(at) {
  title('A delay is a distance', at(0.6));
  write('the phone only listens', CL, 380, 50, at(2.0));
  write('light: 300,000 km a second', CL, 490, 46, at(5.0));
  bigNum('0.07 s', 'for the trip down', CCX, 660, at(8.2), CH.accent, 110);
  write('→ about 20,000 km away', CL, 890, 52, at(10.6), { weight: 700 });
}

// ---- 5. three distances meet in one point (shown on the ground; the card says it in 3D)
const MEET = { p: [40, 60], c: [[-190, -130], [200, -170], [-50, 240]] };
const ccx = (a, ra, b, rb) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), l = (ra * ra - rb * rb + d * d) / (2 * d), h = Math.sqrt(Math.max(0, ra * ra - l * l)), mx = a[0] + dx * l / d, my = a[1] + dy * l / d; return [[mx + h * dy / d, my - h * dx / d], [mx - h * dy / d, my + h * dx / d]]; };
function sMeet() {
  setIso({ ox: 495, oy: 590, u: 0.7 });
  isoPlates(-330, -330, 0, 660, 660, [{ h: 16, r: 44 }]);
  const gf = faceOf([0, 0, 16], [1, 0, 0], [0, 1, 0]), R = MEET.c.map((c) => Math.hypot(c[0] - MEET.p[0], c[1] - MEET.p[1]));
  for (let i = 0; i < 8; i++) { faceLine(gf, [[-310 + i * 88, -310], [-310 + i * 88, 310]]); faceLine(gf, [[-310, -310 + i * 88], [310, -310 + i * 88]]); }
  const T = [at(1.4), at(4.6), at(7.8)];
  MEET.c.forEach((c, i) => { const f = ev(T[i], 1.2); if (f <= 0) return; const P = ellipsePts(c[0], c[1], R[i], R[i], 0, 96); facePath(gf, P.slice(0, Math.ceil(97 * f)).concat(f >= 1 ? [P[0]] : []), false); hair(i === 2 && TT > at(11.2) ? PAL.edge : PAL.edge); ctx.stroke(); });
  const two = ccx(MEET.c[0], R[0], MEET.c[1], R[1]), wrong = Math.hypot(two[0][0] - MEET.p[0], two[0][1] - MEET.p[1]) > 1 ? two[0] : two[1];
  if (TT > at(6.0) && TT < at(11.2)) { faceEll(gf, MEET.p[0], MEET.p[1], 9, 9, { stroke: PAL.edge }); faceEll(gf, wrong[0], wrong[1], 9, 9, { stroke: PAL.edge }); }
  if (TT > at(9.4)) { const k = clamp((TT - at(9.4)) * 2); faceLine(gf, [[wrong[0] - 12 * k, wrong[1] - 12 * k], [wrong[0] + 12 * k, wrong[1] + 12 * k]], PAL.edge); faceLine(gf, [[wrong[0] + 12 * k, wrong[1] - 12 * k], [wrong[0] - 12 * k, wrong[1] + 12 * k]], PAL.edge); }
  // satellites above each centre (painter's order by x + y), and the bot where all three meet
  const items = MEET.c.map((c, i) => ({ s: c[0] + c[1], f: () => { if (TT < T[i] - 0.6) return; const z = dropZ(250, T[i] - 0.6, 300, 120, 0.7); line3([[c[0], c[1], 16], [c[0], c[1], z - 30]], PAL.inner); const p = isoP([c[0], c[1], z]); satG(p[0], p[1], 0.45, { lit: TT > T[i] && TT < T[i] + 1.4 }); } }));
  items.push({ s: MEET.p[0] + MEET.p[1], f: () => { if (TT > at(11.2)) { accentDot(gf, MEET.p[0], MEET.p[1], 9); cubeBot(MEET.p[0] + 30, MEET.p[1] + 30, 16, 46, { key: 'botM', hop: at(11.2) }); } } });
  items.sort((a, b) => a.s - b.s).forEach((it) => it.f());
}
function cMeet(at) {
  title('Three distances, one point', at(0.6));
  ringC(CL + 50, 380, 34, at(2.6), CH.ink, 'm1'); write('1 → you are on a sphere', CL + 120, 398, 46, at(2.6));
  ringC(CL + 36, 530, 30, at(5.8), CH.ink, 'm2a'); ringC(CL + 68, 530, 30, at(5.9), CH.ink, 'm2b'); write('2 → on a circle', CL + 120, 548, 46, at(5.8));
  popAt(at(9.0), CL + 50, 680, () => { chDot(-16, 0, 9, CH.ink); chDot(16, 0, 9, CH.ink); }); write('3 → one of two points', CL + 120, 698, 46, at(9.0));
  check(CL + 30, 840, at(11.4), 'mk'); write('only one is on Earth', CL + 120, 852, 46, at(11.4), { color: CH.accent, weight: 700 });
}

// ---- 6. the catch: the phone's cheap clock, fixed by a fourth satellite
const SKY4 = [[170, 190], [495, 120], [820, 200], [700, 330]];
function sFourth() {
  setIso({ ox: 495, oy: 700, u: 1.0 });
  isoPlates(-250, -250, 0, 500, 500, [{ h: 16, r: 40 }]);
  const gf = faceOf([0, 0, 16], [1, 0, 0], [0, 1, 0]), fix = sm(TT, at(9.4), at(11.0));
  const wob = (1 - fix) * (40 + 30 * Math.sin(TT * 5.3) + 20 * Math.sin(TT * 8.1));
  faceEll(gf, 0, 0, 30 + wob + (1 - fix) * 80, 30 + wob + (1 - fix) * 80, { stroke: PAL.inner });
  deskClock(130, -90, 16, 34, fix > 0.5 ? tick(TT) : tick(TT) + (1 - fix) * Math.sin(TT * 6) * 0.9);
  const head = isoP([0, 0, 16 + 70]);
  SKY4.forEach(([x, y], i) => {
    if (i === 3) { const k = spring(TT, at(8.6), { k: 90, damp: 0.75 }); if (k <= 0.001) return; x = lerp(1150, x, k); y = lerp(80, y, k); }
    dash2([head, [x, y]], i === 3 ? PAL.edge : PAL.inner, 9, -TT * 40);
    satG(x, y, 0.5, { lit: i === 3 });
  });
  cubeBot(0, 0, 16, 64, { key: 'botF', hop: at(10.6), look: fix > 0.5 ? 0 : Math.sin(TT * 2) });
  if (TT > at(4.0) && fix < 0.9) monoT('± 300 m', 495, 1010, 36, PAL.textD);
}
function cFourth(at) {
  title('The catch: its clock', at(0.6));
  write("the phone's clock is cheap", CL, 380, 50, at(2.0));
  bigNum('1 µs', 'one millionth of a second wrong', CCX, 530, at(5.0), CH.ink, 100);
  bigNum('= 300 m off', null, CCX, 760, at(7.8), CH.accent, 90);
  write('a 4th satellite fixes it', CL, 900, 50, at(9.8), { color: CH.green, weight: 700 });
}

// ---- 7. Einstein: speed slows the satellite's clock, weaker gravity speeds it up more
function sEinstein() {
  earthG(495, 1520, 640);
  setIso({ ox: 300, oy: 900, u: 1.1 });
  isoPlates(-90, -90, 0, 180, 180, [{ h: 12, r: 30 }]);
  deskClock(-20, -20, 12, 40, tick(TT));
  monoT('ground clock', 300, 1050, 28, PAL.textD);
  const sx = 640 + Math.sin(TT * 0.6) * 20, sy = 330;
  if (TT > at(3.6)) for (let i = 0; i < 4; i++) { const L = 60 + 40 * ((i * 37) % 3); polyPath([[sx - 140 - i * 6, sy - 40 + i * 26], [sx - 140 - L - i * 6, sy - 40 + i * 26]], false); hair(PAL.inner); ctx.stroke(); }
  satG(sx, sy, 1.6, { clock: tick(TT * (TT > at(9.4) ? 1.0 : 1.0)), lit: true });
  if (TT > at(4.0)) monoT('fast → ticks slower', sx, sy + 175, 30, PAL.text, 'center', typed('fast → ticks slower', at(4.0), 18));
  if (TT > at(7.0)) monoT('weak gravity → faster', sx, sy + 220, 30, PAL.text, 'center', typed('weak gravity → faster', at(7.0), 18));
  if (TT > at(7.0)) { const f = ev(at(7.0), 1.6); for (let i = 0; i < 4; i++) { const y0 = 840 - i * 90; ctx.globalAlpha = 1 - i * 0.22; dash2([[sx, y0], [sx, y0 - 60 * f]], PAL.inner, 6); ctx.globalAlpha = 1; } }
}
function cEinstein(at) {
  title("Einstein's problem", at(0.6));
  write('speed:', CL, 400, 52, at(4.0));
  write('-7 µs a day', CL + 330, 400, 52, at(5.4), { color: CH.blue, weight: 700 });
  write('weaker gravity:', CL, 560, 52, at(7.0));
  write('+45 µs a day', CL + 330, 650, 52, at(9.6), { color: CH.accent, weight: 700 });
  write('special + general relativity', CL, 830, 44, at(11.6));
  write('Einstein, 1905 and 1915', CL, 900, 40, at(12.0), { color: '#7a6a5a' });
}

// ---- 8. the hush: one satellite, far away, its clock ticking in the quiet
function sHush() { satG(495 + (TT - S0()) * 20, 470, 0.7, { clock: tick(TT), lit: true }); }

// ---- 9. the payoff: the dot drifts off across the map, then snaps back when the clocks are tuned
function sDrift() {
  setIso({ ox: 495, oy: 560, u: 0.72 });
  isoPlates(-340, -340, 0, 680, 680, [{ h: 16, r: 44 }]);
  const gf = faceOf([0, 0, 16], [1, 0, 0], [0, 1, 0]);
  for (let i = 0; i < 9; i++) { faceLine(gf, [[-320 + i * 80, -320], [-320 + i * 80, 320]]); faceLine(gf, [[-320, -320 + i * 80], [320, -320 + i * 80]]); }
  const home = [-160, 160], far = [240, -240], out = sm(TT, at(6.0), at(9.6)), back = spring(TT, at(10.4), { k: 140, damp: 0.6 });
  const u = out * (1 - back), dp = [lerp(home[0], far[0], u), lerp(home[1], far[1], u)];
  if (out > 0.02 && back < 0.98) {   // the trail with kilometre marks
    faceLine(gf, [home, dp], PAL.edge);
    for (let km = 1; km <= 10; km++) { const q = km / 10; if (q > u) break; const m = [lerp(home[0], far[0], q), lerp(home[1], far[1], q)]; faceEll(gf, m[0], m[1], 4, 4, { fill: PAL.face, stroke: PAL.edge }); if (km % 5 === 0) isoText(gf, km + ' km', m[0] + 14, m[1] - 10, 22, { color: PAL.textD, font: ISOMONO }); }
  }
  const p = mod(TT, 1.2) / 1.2; faceEll(gf, dp[0], dp[1], 10 + p * 26, 10 + p * 26, { stroke: mixHex(PAL.edge, PAL.face, p) }); accentDot(gf, dp[0], dp[1], 11);
  cubeBot(home[0] - 40, home[1] + 50, 16, 70, { key: 'botP', hop: [at(0.05), at(11.0)], look: u > 0.05 ? 0.8 : 0 });
  const t = Math.min(TT - S0(), 14), us = (t / 14 * 38).toFixed(1);
  monoT('satellite clock  +' + (TT > at(10.4) ? '0.0' : us) + ' µs', 495, 1010, 32, TT > at(10.4) ? PAL.textD : PAL.text);
}
function cDrift(at) {
  bigNum('+38 µs', 'gained by the clocks, every day', CCX, 360, at(0.3), CH.accent, 130);
  arrow(CCX, 470, CCX, 540, at(7.0), CH.ink, 'dr');
  bigNum('≈ 10 km', 'of drift a day, if left alone', CCX, 640, at(7.6), CH.ink, 110);
  write('fix: tune the clocks slow', CL, 830, 48, at(10.6), { color: CH.green, weight: 700 });
  write('10.22999999543 MHz, not 10.23', CL, 900, 36, at(12.0), { color: '#7a6a5a' });
}

// ---- 10. the end: the hook again, now with the satellites it listens to
function sEnd() {
  SKY4.slice(0, 3).forEach(([x, y], i) => { satG(x, y - 40, 0.45, { lit: false }); });
  sHook({ t0: S0() - 3, hop: [at(4.4), at(10.0)], look: 0, end: true });
  const ph = isoP([-62, -68, 29 + 9]); SKY4.slice(0, 3).forEach(([x, y]) => { if (TT > at(1.0)) dash2([[x, y - 20], ph], PAL.inner, 9, -TT * 40); });
}
function cEnd(at) {
  title('So...', at(0.6));
  write('the dot = clocks in space', CL, 380, 52, at(1.6));
  write('+ a little Einstein', CL, 480, 52, at(4.4), { color: CH.accent });
  bigNum('~5 m', 'how close, under open sky', CCX, 680, at(6.6), CH.ink, 120);
  write('and your phone only listens', CL, 900, 48, at(9.6));
}
