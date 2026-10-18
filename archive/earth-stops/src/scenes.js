// =====================================================================
//  SCENES — What if Earth stopped spinning? A riso print: every colour is plate tones (teal, pink, yellow), each scene
//  = a coarse field layer + a world layer (beginSheet ... endSheet). The explanation is lettered straight onto the print
//  on the right (no card): bold print type, paper halo on light scenes, light ink on the night ones.
//  Colour means one thing: teal = water and air, pink = motion and danger, yellow = sunlight, olive-black = night.
// =====================================================================
const CHANNEL = { font: PRINT, weight: 700, halo: 'rgba(242,236,227,0.82)', haloDark: 'rgba(16,20,36,0.7)', inkDark: '#f2ece3',
  colors: { ink: '#2b2f3a', accent: '#e0509f', green: '#4fae6e', blue: '#6cc0e2' },
  tag: (str, k) => { const w = chTextW(str, 46, 700) + 40; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.rotate(-0.02); ctx.scale(k, k); ctx.fillStyle = '#eede1e'; ctx.fillRect(-w / 2, -32, w, 64); ctx.fillStyle = 'rgba(220,68,160,0.85)'; ctx.fillRect(-w / 2 + 5, -27, w, 64); ctx.fillStyle = '#eede1e'; ctx.fillRect(-w / 2, -32, w, 64); chText(str, -w / 2 + 20, 16, 46, '#2b2f3a', { key: 'tg' + str, weight: 700, halo: false }); ctx.restore(); } };
const NIGHT = { teal: 0.85, pink: 0.6, yellow: 0.42 }, DUSK = { teal: 0.55, pink: 0.45, yellow: 0.2 };
const OCEAN = { teal: 0.85, yellow: 0.12 }, LAND = MIX.green, SAND = { pink: 0.4, yellow: 0.75 };
// continents as blobs on a strip that wraps round the globe (x in radians of longitude, y as -1..1 of the radius)
const CONT = [[-2.6, -0.35, 0.55, 0.35], [-1.6, 0.25, 0.4, 0.45], [-0.2, -0.4, 0.6, 0.3], [0.3, 0.2, 0.35, 0.5], [1.4, -0.3, 0.7, 0.35], [2.3, 0.45, 0.3, 0.2]];
function spaceField(tones = NIGHT) { calmField(tones); }   // flat inks, no dot screen: the lettering sits on it (user: halftone behind text strains the eyes)
function stars(key, n = 60) { const R = RNG('st', key); for (let i = 0; i < n; i++) { const x = R.r(0, 990), y = R.r(0, 1080), s = R.r(1.5, 4) * (0.6 + 0.4 * Math.sin(TT * R.r(1, 3) + i)); fill(circ(x, y, s), {}); } }
function globe(x, y, r, rot, o = {}) {
  fill(circ(x, y, r), o.ocean ?? OCEAN);
  clipTo(circ(x, y, r));
  if (!o.noLand) CONT.forEach(([lx, ly, w, h], i) => { for (const k of [-1, 0, 1]) { const cx = x + (mod(lx + rot + Math.PI, TAU) - Math.PI + k * TAU) * r * 0.62; if (Math.abs(cx - x) > r * 1.3) continue; fill(hand(ellipsePts(cx, y + ly * r, w * r * 0.62, h * r, 0.2 * i, 18), 'ct' + i, 2), LAND); } });
  if (o.inner) o.inner();
  fill(circ(x - r * 0.35, y - r * 0.4, r * 0.9), { yellow: rad(x - r * 0.35, y - r * 0.4, 0, r * 0.9, [[0, 0.25], [1, 0]]) }, { over: true });
  unclip();
  rim(x, y, r, 'grim' + (o.key ?? ''), { tones: MIX.blue, w: 8 });
  line(arcPts(x, y, r * 0.86, Math.PI * 1.1, Math.PI * 1.4, 10), {}, { w: 10, taper: 0.35, knock: true, key: 'ghl' + (o.key ?? '') });
}
const arrowR = (x0, y, x1, tones, key, w = 10) => { line([[x0, y], [x1, y]], tones, { w, key: key + 'a', knock: true }); line([[x1 - 30, y - 22], [x1, y], [x1 - 30, y + 22]], tones, { w, key: key + 'h', knock: true }); };

// ---- 1. right now: the spinning globe, a little hero on top
function sHook(o = {}) {
  beginSheet(); spaceField();
  printed(PITCH.world, { shapes: true }, () => {
    stars('hk'); const rot = TT * 0.35;
    globe(470, 600, 300, rot, { key: 'hk' });
    const f = ev(at(1.0), 1.2); if (f > 0) { const P = arcPts(470, 600, 360, Math.PI * 0.62, Math.PI * (0.62 + 0.7 * f), 24); line(P, { pink: 1 }, { w: 12, key: 'spinar', knock: true }); }
    risoHero(470, 252 + Math.sin(TT * 3) * 4, 42, { key: 'hkh', mood: o.end ? 'happy' : TT > at(9.6) ? 'wow' : 'smile', arms: o.end ? [1.3, 1.3] : [0.3, -0.3] });
    if (o.end) fill(circ(900, 980, 260), { yellow: rad(900, 980, 0, 260, [[0, 0.9], [1, 0]]), pink: rad(900, 980, 0, 260, [[0, 0.4], [1, 0]]) }, { over: true });
  });
  endSheet();
}
function cHook(at) {
  title('What if it stopped?', at(0.8));
  bigNum('1,670 km/h', 'the equator, right now', CCX, 430, at(3.0), CH.accent, 104);
  write("and you don't feel a thing", CL, 640, 48, at(7.2));
  bigNum('?', null, CCX, 860, at(9.8), CH.accent, 150);
}

// ---- 2. one second later: everything keeps going east
function sSecond() {
  beginSheet();
  calmField({ yellow: 0.5, pink: 0.15 }, { yellow: 0.85, pink: 0.4 });
  printed(PITCH.world, { shapes: true }, () => {
    const u = Math.max(0, TT - at(0.2));
    for (let i = 0; i < 14; i++) { const R = RNG('sl', i), y = R.r(80, 760), x = mod(R.r(0, 1100) + u * R.r(900, 1500), 1300) - 200; line([[x, y], [x + R.r(80, 200), y]], { pink: 0.7 }, { w: 5, key: 'sl' + i, knock: true }); }
    fill(rect(-80, 820, W + 160, 300), MIX.dark); specks(0, 830, 990, 1080, 40, 'grd');
    for (let i = 0; i < 5; i++) { const R = RNG('fly', i), x = mod(R.r(-200, 800) + u * R.r(500, 800), 1300) - 200, y = R.r(480, 760) - Math.sin(u + i) * 30, rot = u * R.r(1, 3) + i;
      const rp = (P) => P.map(([px, py]) => [x + (px - x) * Math.cos(rot) - (py - y) * Math.sin(rot), y + (px - x) * Math.sin(rot) + (py - y) * Math.cos(rot)]);
      if (i % 2) { fill(poly(rp([[x - 40, y - 30], [x + 40, y - 30], [x + 40, y + 30], [x - 40, y + 30]])), { pink: 0.5, yellow: 0.8 }); fill(poly(rp([[x - 50, y - 30], [x, y - 70], [x + 50, y - 30]])), MIX.coral); }
      else { fill(poly(rp([[x - 6, y], [x + 6, y], [x + 6, y + 60], [x - 6, y + 60]])), MIX.dark); fill(circ(x, y - 10, 40), LAND); } }
    const hx = 180 + mod(u * 260, 700);
    risoHero(hx, 520 + Math.sin(u * 4) * 20, 60, { key: 'flyh', mood: 'wow', arms: [1.4, 1.4] });
    for (let k = 0; k < 4; k++) line([[hx - 90 - k * 30, 500 + k * 16], [hx - 160 - k * 40, 500 + k * 16]], { teal: 0.8 }, { w: 6, key: 'hs' + k, knock: true });
  });
  endSheet();
}
function cSecond(at) {
  write('everything keeps moving east', CL, 380, 46, at(2.0));
  write('air, oceans, rocks... you', CL, 470, 46, at(5.6));
  write('faster than a jet airliner', CL, 640, 52, at(9.0), { weight: 700 });
  write('only the poles stay calm', CL, 820, 44, at(11.4), { color: CH.green });
}

// ---- 3. one minute later: winds and a wall of water
function sMinute() {
  beginSheet();
  calmField({ teal: 0.7, pink: 0.18, yellow: 0.12 }, { teal: 0.45, pink: 0.18, yellow: 0.12 });
  printed(PITCH.world, { shapes: true }, () => {
    for (let i = 0; i < 18; i++) { const R = RNG('wd', i), y = R.r(60, 600), x = mod(R.r(0, 1100) + TT * R.r(700, 1100), 1300) - 200; line([[x, y], [x + 60, y - 6], [x + 160, y + 4]], {}, { w: 4, key: 'wd' + i, knock: true }); }
    fill(rect(-80, 860, W + 160, 300), MIX.dark);
    const wx = lerp(-300, 760, EZ.io(clamp((TT - at(0.4)) / 10))), P = [];
    for (let i = 0; i <= 30; i++) { const t = i / 30; P.push([wx - 700 + t * 900, 920 - Math.sin(t * Math.PI) ** 2 * 520 * (0.7 + 0.3 * t) - Math.sin(TT * 3 + t * 6) * 10]); }
    P.push([wx + 200, 1100], [wx - 700, 1100]);
    fill(curvy(P), { teal: 1, pink: 0.25 });
    for (let i = 0; i < 16; i++) { const t = (i + 0.5) / 16, x = wx - 700 + t * 900, y = 920 - Math.sin(t * Math.PI) ** 2 * 520 * (0.7 + 0.3 * t) - 4; fill(circ(x + Math.sin(TT * 5 + i) * 6, y, 10 + (i % 3) * 5), {}); }
    for (let i = 0; i < 3; i++) { const x = 620 + i * 110; fill(rect(x, 700 - i * 30, 70, 160 + i * 30), DUSK); }
  });
  endSheet();
}
function cMinute(at) {
  write('winds beyond any hurricane', CL, 380, 46, at(1.8));
  write('the oceans surge east', CL, 470, 46, at(5.0));
  write("that's the sudden version.", CL, 700, 44, at(9.6));
  write('now, a kinder one...', CL, 790, 50, at(11.4), { color: CH.accent, weight: 700 });
}

// ---- 4. day 1 (the gentle stop): one day lasts a year
function sDay() {
  beginSheet();
  const split = sm(TT, at(7.4), at(9.0));
  calmField({ yellow: 0.35, pink: 0.1 }, { yellow: 0.75, pink: 0.4 });
  const nx = 495 + (1 - split) * 500;   // the night half, flat like the sky (no dots next to the lettering)
  if (split > 0) { const c = ctx.getTransform(), sx0 = c.a * nx + c.e; calmField(NIGHT, NIGHT, [sx0, 0, c.a * 990 + c.e, H]); }
  printed(PITCH.world, { shapes: true }, () => {
    if (split > 0.3) { const R = RNG('ns'); for (let i = 0; i < 30; i++) { const x = R.r(520, 990), y = R.r(40, 700); fill(circ(x, y, R.r(1.5, 3.5)), {}); } }
    const sx = lerp(110, 340, clamp((TT - S0()) / 14)), sy = 430 - Math.sin(clamp((TT - S0()) / 14) * 1.2) * 150;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + TT * 0.35; line([[sx + Math.cos(a) * 92, sy + Math.sin(a) * 92], [sx + Math.cos(a) * 128, sy + Math.sin(a) * 128]], MIX.orange, { w: 7, key: 'ray' + i, knock: true }); }
    for (let i = 0; i < 3; i++) { const cx = mod(140 + i * 330 + (TT - S0()) * 26, 1180) - 120, cy = 150 + i * 70; if (split > 0 && cx + 90 > nx) continue; fill(hand(ellipsePts(cx, cy, 90, 26, 0, 18), 'cl' + i, 2), {}); }
    fill(circ(sx, sy, 140), { yellow: rad(sx, sy, 0, 140, [[0, 0.8], [1, 0]]) }, { over: true }); fill(circ(sx, sy, 70), { yellow: 1, pink: 0.25 }); rim(sx, sy, 70, 'sun', { tones: MIX.coral, w: 6 });
    fill(hand([[-80, 800], [300, 770], [700, 800], [1100, 780], [1100, 1100], [-80, 1100]], 'hill', 2), LAND);
    risoHero(330, 760 + Math.sin(TT * 2) * 3, 56, { key: 'dayh', mood: TT > at(5.0) ? 'wow' : 'smile', look: [-0.6, -0.6] });
    // a calendar on a post: the days don't change
    fill(rect(730, 560, 170, 190), {});
    fill(rect(730, 560, 170, 50), { pink: 0.9 }); type('DAY 1', 815, 700, 46, MIX.dark, { align: 'center', key: 'cal' });
    line([[815, 750], [815, 820]], MIX.dark, { w: 8, key: 'calpost', knock: true });
  });
  endSheet();
}
function cDay(at) {
  write('the spin fades slowly...', CL, 380, 46, at(2.0));
  bigNum('1 day = 1 year', null, CCX, 520, at(5.2), CH.ink, 84);
  write('6 months of daylight', CL, 700, 50, at(7.6));
  write('6 months of night', CL, 800, 50, at(9.6), { color: CH.accent, weight: 700 });
}

// ---- 5. year 1: the bulge relaxes and the water runs to the poles
function sBulge() {
  beginSheet(); spaceField();
  printed(PITCH.world, { shapes: true }, () => {
    stars('bg', 40); const k = sm(TT, at(5.5), at(11.5)), x = 470, y = 560, R = 270, rx = R * (1 + 0.14 * (1 - k));
    fill(ell(x, y, rx, R), SAND);
    clipTo(ell(x, y, rx, R));
    fill(ell(x, y, rx + 20, R * 0.42 * (1 - k) + 6), OCEAN);
    for (const s of [-1, 1]) fill(ell(x, y + s * R, rx, R * 0.62 * k + 4), OCEAN);
    for (let i = 0; i < 6; i++) {   // meridians: they sweep while Earth spins and stop as the spin fades
      const th = mod(i / 6 * Math.PI + (TT - at(0)) * 0.5 * (1 - k * 0.9), Math.PI) - Math.PI / 2, sx = Math.sin(th);   // visible longitudes -90..90
      line(ellipsePts(0, y, rx * Math.abs(sx), R, 0, 32, -Math.PI / 2, Math.PI / 2).map(([px, py]) => [x + px * Math.sign(sx || 1), py]), MIX.blue, { w: 4, key: 'mer' + i, knock: true });
    }
    unclip();
    rimLine(ellipsePts(x, y, rx, R, 0, 96), 'bulge', { tones: MIX.blue, w: 8 });
    if (TT > at(8.4)) for (const s of [-1, 1]) { const f = ev(at(8.4), 0.6); line([[x, y + s * 30], [x, y + s * (30 + 150 * f)]], { pink: 1 }, { w: 12, key: 'pa' + s, knock: true }); if (f > 0.9) line([[x - 24, y + s * 150], [x, y + s * 182], [x + 24, y + s * 150]], { pink: 1 }, { w: 12, key: 'ph' + s, knock: true }); }
    if (k < 0.5 && TT > at(4.6)) { line([[x - rx, y], [x - R, y]], { yellow: 1 }, { w: 6, key: 'bl1', knock: true }); type('+21 km', x - rx - 40, y - 26, 34, { yellow: 1 }, { align: 'center', key: 'bl2' }); }
  });
  endSheet();
}
function cBulge(at) {
  write('the spin makes Earth bulge', CL, 380, 46, at(2.0));
  bigNum('21 km', 'wider at the equator (drawn bigger here)', CCX, 560, at(5.0), CH.accent, 110);
  write('the water flows to the poles', CL, 820, 46, at(9.0));
}

// ---- 6. the new map: two polar oceans, one belt of land
function sMap() {
  beginSheet(); spaceField();
  printed(PITCH.world, { shapes: true }, () => {
    stars('mp', 40); const x = 470, y = 560, R = 300;
    globe(x, y, R, 0, { key: 'mp', noLand: true, ocean: SAND, inner: () => { const sw = 0.62 + 0.38 * sm(TT, at(1.6), at(9.0)); fill(hand(ellipsePts(x, y - R * 0.95, R * 1.1, R * 0.55 * sw, 0, 40), 'po1', 3), OCEAN); fill(hand(ellipsePts(x, y + R * 0.95, R * 1.1, R * 0.55 * sw, 0, 40), 'po2', 3), OCEAN); for (let i = 0; i < 5; i++) { const g = 0.15 + 0.85 * sm(TT, at(0.8 + i * 1.7), at(2.8 + i * 1.7)); fill(hand(ellipsePts(x - 220 + i * 110 + Math.sin(TT * 0.4) * 10, y + (i % 2 ? 30 : -40), 50 * g + 6, 30 * g + 4, 0, 16), 'gr' + i, 2), LAND); } } });
    if (TT > at(9.0)) { const k = popS(at(9.0)); type('CANADA', x - 120, y - 300, 30 * k, {}, { align: 'center', key: 'can' }); type('GREENLAND', x + 60, y - 360, 30 * k, {}, { align: 'center', key: 'grl' }); }
    for (let i = 0; i < 8; i++) for (const sgn of [-1, 1]) {   // the water keeps flowing poleward
      const u = mod((TT - at(0)) * 0.35 + i / 8, 1), cx = x - 210 + (i % 4) * 140, cy = y + sgn * (40 + u * 190);
      line([[cx - 26, cy - sgn * 18], [cx, cy], [cx + 26, cy - sgn * 18]], { teal: 1 }, { w: 9, key: 'chev' + i + sgn, knock: true });
    }
    risoHero(x + 40, y - 30 + Math.sin(TT * 3) * 4, 34, { key: 'maph', mood: 'smile', arms: [1.2, 0.2] });
  });
  endSheet();
}
function cMap(at) {
  write('two polar oceans', CL, 400, 52, at(2.4), { color: CH.blue, weight: 700 });
  write('one giant belt of land', CL, 500, 52, at(5.0), { weight: 700 });
  write('Greenland and Canada:', CL, 720, 44, at(9.0));
  write('under water', CL, 800, 52, at(9.4), { color: CH.accent, weight: 700 });
  write('(one computer model, Esri 2010)', CL, 900, 32, at(10.4));
}

// ---- 7. the quiet danger: the magnetic field fades
function sField() {
  beginSheet(); spaceField({ teal: 0.9, pink: 0.65, yellow: 0.5 });
  printed(PITCH.world, { shapes: true }, () => {
    stars('fd', 40); const x = 560, y = 560, R = 190, fade = sm(TT, at(9.6), at(12.0));
    fill(circ(80, 560, 160), { yellow: rad(80, 560, 0, 160, [[0, 1], [1, 0]]) }, { over: true }); fill(circ(40, 560, 90), { yellow: 1, pink: 0.35 });
    for (let k = 1; k <= 4; k++) for (const s of [-1, 1]) { const P = []; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + i / 40 * Math.PI; const rr = R * (1 + k * 0.55) * Math.cos(a) ** 2 + R * 0.2; P.push([x + s * rr * Math.cos(a), y + rr * Math.sin(a)]); } if (fade < 0.98) line(P, { teal: 0.9 * (1 - fade), pink: 0.2 * (1 - fade) }, { w: 6, key: 'fl' + k + s }); }
    for (let n = 0; n < 14; n++) { const R0 = RNG('pt', n), u = mod(TT * 0.35 + n / 14, 1), py = R0.r(300, 820), px = 160 + u * 700; const deflect = (1 - fade) * Math.max(0, 1 - Math.abs(py - y) / 420) * (px > 300 ? (px - 300) * 0.9 : 0) * Math.sign(py - y || 1); fill(circ(px, py + deflect, 6), { yellow: 1, pink: 0.4 }); }
    globe(x, y, R, TT * 0.2, { key: 'fd' });
    clipTo(circ(x, y, R)); fill(circ(x, y, R * 0.45), { pink: 0.85, yellow: 0.9 }); unclip();
  });
  endSheet();
}
function cField(at) {
  write("Earth's magnetic field", CL, 380, 52, at(2.0), { weight: 700 });
  write('made by molten iron swirling inside', CL, 470, 40, at(4.0));
  write('...partly driven by the spin', CL, 550, 40, at(6.0));
  write('it could fade', CL, 760, 62, at(10.0), { color: CH.accent, weight: 700 });
  write('some scientists think', CL, 840, 36, at(10.6));
}

// ---- 8. the hush
function sHush() { beginSheet(); spaceField({ teal: 0.95, pink: 0.75, yellow: 0.6 }); printed(PITCH.world, { shapes: true }, () => { globe(470, 560, 160, 0, { key: 'hu' }); }); endSheet(); }

// ---- 9. the payoff: it IS slowing, very slowly
function sPayoff() {
  beginSheet();
  calmField({ yellow: 0.6, pink: 0.3 });
  printed(PITCH.world, { shapes: true }, () => {
    for (let i = 0; i < 24; i++) { const R = RNG('cf', i), x = R.r(0, 980), y = mod(R.r(0, 1080) + (TT - HIT) * R.r(90, 170), 1120) - 20; fill(rect(x, y, 16, 9), [{ teal: 1 }, { pink: 1 }, MIX.green, {}][i % 4]); }
    globe(330, 560, 220, TT * 0.6, { key: 'po' });
    risoHero(330, 290 + Math.sin(TT * 4) * 8, 50, { key: 'poh', mood: 'happy', arms: [1.4, 1.4], hop: HIT + 0.2 });
    // a 24-hour dial: the hand sweeps from 22 to 24
    const cx = 760, cy = 560, r = 170; fill(circ(cx, cy, r), {}); rim(cx, cy, r, 'dial', { tones: MIX.dark, w: 8 });
    for (let h = 0; h < 24; h++) { const a = h / 24 * TAU - Math.PI / 2; line([[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94]], MIX.dark, { w: h % 6 ? 3 : 7, key: 'dt' + h }); }
    const hh = lerp(22, 24, sm(TT, at(4.0), at(8.0))), a = hh / 24 * TAU - Math.PI / 2;
    line([[cx, cy], [cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75]], { pink: 1 }, { w: 12, key: 'hand', knock: true });
    type(`${hh.toFixed(0)} h`, cx, cy + 70, 44, MIX.dark, { align: 'center', key: 'dlab' + hh.toFixed(0) });
  });
  endSheet();
}
function cPayoff(at) {
  bigNum('+2 ms', 'longer days, every century', CCX, 380, at(0.4), CH.accent, 130);
  write('400 million years ago...', CL, 580, 44, at(5.0));
  bigNum('a day = 22 hours', null, CCX, 700, at(6.8), CH.ink, 76);
  write('nothing to worry about', CL, 900, 52, at(11.0), { color: CH.green, weight: 700 });
}

// ---- 10. the end: the hook again, at sunset
function sEnd() { sHook({ end: true }); }
function cEnd(at) {
  title('So...', at(0.6));
  write('the Sun sets right on time', CL, 400, 48, at(1.6));
  bigNum('1,670 km/h', 'and you never feel it', CCX, 640, at(4.4), CH.accent, 100);
  write('keep spinning, Earth', CL, 880, 52, at(8.4), { weight: 700 });
}
