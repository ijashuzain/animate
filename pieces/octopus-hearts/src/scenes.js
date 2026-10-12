
// =====================================================================
//  SCENES — one per world, 1920x1080, animated on TIMELINE.cues (the narration's words)
// =====================================================================
const cu = TIMELINE.cues;
const HEARTS3 = [[1060, 330], [1290, 280], [1520, 330]];   // the opening's three hearts (the middle one is the first bridge)

function seabed(key, o = {}) {
  seaWall(o.wall ?? COL.sea, key + 'w');
  rock(1700, 860, 220, 120, '#5d7f86', key + 'r1');
  rock(140, 880, 160, 90, '#6f8f8a', key + 'r2');
  weed(1810, 900, 330, key + 'wd1'); weed(1860, 910, 250, key + 'wd2', '#3d7c46'); weed(90, 900, 280, key + 'wd3');
  sandFloor(o.floor ?? 900, key + 'sand');
  fish(mod(TT * 70 + 300, W + 300) - 150, 190, 0.8, PAL.yellow, key + 'f1', 1);
  fish(W + 150 - mod(TT * 55 + 900, W + 300), 420, 0.6, PAL.purple, key + 'f2', -1);
  bubbles(key + 'b', 9);
  if (o.star !== false) starfish(1240, 960, 1, key + 'st');
  if (o.crab !== false) crab(1500 + Math.sin(TT * 0.7) * 60, 975, 0.9, key + 'cb');
}

// 1. the octopus on the seabed; three hearts pop above it, beating
function sceneOpen() {
  seabed('o1');
  octopus(620, 820, { s: 1.05, mood: TT < cu.pop1 ? 'smile' : 'wow', key: 'oc1' });
  HEARTS3.forEach(([x, y], i) => {
    const t = [cu.pop1, cu.pop2, cu.pop3][i];
    heartChar(x, y, 95, { s: popS(t), p: badum(1.0, t), mood: 'happy', key: 'h3' + i });
  });
  note('3 hearts!', 1290, 530, 54, 3.9, { rot: 0.03 });
}

// 2. you have one; the octopus has three. why?
function sceneCompare() {
  cut(rect(-30, -30, 1000, H + 60, 0), '#f3d6b8', { key: 'cmpL', shadow: false, tear: 0, shade: false, pat: pat.gingham('rgba(255,255,255,0.22)', 22) });
  cut([[930, -30], [W + 30, -30], [W + 30, H + 30], [990, H + 30]], COL.sea, { key: 'cmpR', tear: 2.2, sx: -6, sy: 0, pat: pat.stripes('rgba(255,255,255,0.06)', 70, 230, 0.35) });
  bubbles('cmpb', 6, 1000, W);
  fish(W + 100 - mod(TT * 60, 1100), 160, 0.55, PAL.yellow, 'cmpf', -1);
  // you: a person with one heart
  plant(150, 940, 1.0, PAL.teal, 'cmpp');
  mug(800, 900, 0.9, PAL.mint, 'cmpm');
  person(480, 760, 1.35, { mood: TT < cu.octoHearts + 0.5 ? 'smile' : 'wow', shirt: PAL.mustard, skin: PAL.skin1, s: popS(cu.human) });
  heartChar(480, 900, 58, { s: popS(cu.humanHeart), p: badum(1.0, cu.humanHeart), color: COL.red, dark: COL.redD, mood: 'smile', key: 'hh' });
  note('you: 1', 480, 150, 60, cu.humanHeart);
  // the octopus: three
  cut([[1000, 960], [1500, 930], [W + 30, 950], [W + 30, H + 30], [1000, H + 30]], COL.sand, { key: 'cmps', sy: -4, pat: pat.dots('rgba(150,110,50,0.25)', 3, 26) });
  octopus(1440, 960, { s: 0.85, mood: 'smile', key: 'oc2' });
  [[1290, 330], [1440, 300], [1590, 330]].forEach(([x, y], i) => heartChar(x, y, i === 1 ? 80 : 62, { s: i === 1 ? 1 : popS(cu.octoHearts + i * 0.25), p: badum(1.0, cu.octoHearts), mood: 'happy', key: 'ch' + i }));
  note('octopus: 3', 1440, 150, 60, cu.octoHearts);
  // the question, in a blue bubble (it becomes Bloo)
  const k = popS(cu.ask);
  if (k > 0) {
    ctx.save(); ctx.translate(960, 560); ctx.scale(k, k); ctx.translate(-960, -560);
    cut(ellipsePts(960, 560, 120, 120, 0, 48), COL.bloo, { key: 'askb', crayon: COL.blooD, crAl: 0.35 });
    handText('?', 922, 618, 160, '#ffffff', { key: 'askq', weight: 700 });
    ctx.restore();
  }
}

// 3. inside a vein: Bloo. its blood is blue; it carries oxygen with copper (hemocyanin), not iron
function sceneBlue() {
  vessel(260, 900, 'v3', { plasma: '#e6eef8' });
  const by = 600, bx = 960;
  // iron: what we use (red), crossed out
  const fe = popS(17.2);
  if (fe > 0) {
    ctx.save(); ctx.translate(430, 520); ctx.scale(fe, fe); ctx.translate(-430, -520);
    cut(ellipsePts(430, 520, 90, 90, 0, 36), COL.red, { key: 'fe', crayon: COL.redD, crAl: 0.4 });
    handText('Fe', 380, 552, 90, '#ffffff', { key: 'fet', weight: 700 });
    ctx.restore();
    note('iron (you)', 430, 700, 46, 17.2);
    const x = ev(17.9, 0.4);
    if (x > 0) { ink(subPath([[320, 410], [540, 630]], x), { w: 16, color: PAL.ink, key: 'x1' }); ink(subPath([[540, 410], [320, 630]], ev(18.2, 0.35)), { w: 16, color: PAL.ink, key: 'x2' }); }
  }
  bloo(bx, by, 120, { mood: TT < cu.bloo ? 'smile' : TT < cu.pack ? 'wow' : 'happy', pack: EZ.back(ev(cu.pack, 0.3)), key: 'hero3', al: ev(cu.bloo, 0.25) * (1 - ev(cu.bloo + 1.2, 0.3)) });
  if (TT >= cu.bloo && TT < cu.bloo + 1.2) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = 170 + ev(cu.bloo, 0.6) * 60; sparkle(bx + Math.cos(a) * r, by + Math.sin(a) * r, 18, '#fff6c8'); }
  note('blue blood', bx, 170, 66, cu.bloo + 0.1, { rot: -0.02 });
  note('copper', 1430, 470, 54, cu.pack + 0.2, { rot: 0.04 });
  note('hemocyanin', 1430, 700, 60, cu.hemo, { write: true, rot: -0.02 });
}

// 4. the race: a red cell zooms past with lots of oxygen; Bloo, with two bubbles, wades through thick blood
function sceneRace() {
  cut(rect(-30, -30, W + 60, H + 60, 0), COL.flesh, { key: 'rw', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,255,255,0.12)', 9, 60) });
  cut(rect(-40, 180, W + 80, 300, 10), COL.plasma, { key: 'lane1', pat: pat.stripes('rgba(200,140,130,0.25)', 6, 120) });
  cut(rect(-40, 560, W + 80, 360, 10), '#e6eef8', { key: 'lane2', pat: pat.stripes('rgba(120,150,200,0.25)', 6, 120) });
  // finish line
  cut(rect(1640, 170, 60, 760, 2), '#ffffff', { key: 'fin', pat: pat.gingham('rgba(42,29,24,0.85)', 30) });
  // thick blood: goo rising in Bloo's lane
  const g = ev(cu.goo, 1.2);
  if (g > 0) { const P = []; for (let x = -40; x <= W + 40; x += 80) P.push([x, 920 - g * 300 + Math.sin(x * 0.01 + TT * 1.2) * 18]); cut([...P, [W + 40, 930], [-40, 930]], 'rgba(59,120,214,0.38)', { key: 'goo', shadow: false, pat: pat.dots('rgba(42,88,166,0.35)', 10, 44) }); }
  // the human red cell: zooms in and waits at the finish
  const rx = springMove(cu.cell, -200, 1500, SPRING.snappy);
  if (TT >= cu.cell) { redCell(rx, 340, 90, { bub: 9, key: 'rc4', mood: 'happy' }); if (TT < cu.cell + 0.6) for (let i = 0; i < 4; i++) ink([[rx - 140 - i * 60, 300 + i * 25], [rx - 260 - i * 60, 300 + i * 25]], { w: 6, color: 'rgba(255,255,255,0.8)', key: 'zl' + i }); }
  note('red blood: iron', 330, 240, 44, cu.cell + 0.3);
  // Bloo: slowed down by the goo
  const bx = TT < cu.goo ? lerp(300, 520, EZ.io(seg(TT, M[2], cu.goo))) : 520 + (TT - cu.goo) * 45;
  const wade = TT >= cu.goo ? Math.sin(TT * 5) * 0.06 : 0;
  bloo(bx, 760, 80, { bub: 2, key: 'hero4', mood: TT < cu.count ? 'smile' : TT < cu.sweat ? 'wow' : TT < cu.pant ? 'sad' : 'focus', sweat: TT >= cu.sweat, sx: 1 + wade, sy: 1 - wade, rot: wade });
  note('blue blood: copper', 330, 990, 44, cu.count, { rot: 0.02 });
  note('thicker!', 1160, 520, 52, cu.goo + 0.6, { rot: 0.05 });
}

// 5. the gills: Bloo has to squeeze through to pick up oxygen, and gets stuck
function sceneGills() {
  seaWall(COL.seaD, 'g5w');
  bubbles('g5b', 8);
  fish(W + 100 - mod(TT * 50 + 400, W + 200), 140, 0.6, PAL.mustard, 'g5f', -1);
  // oxygen waiting in the water beyond the gill
  for (let i = 0; i < 6; i++) o2(1420 + (i % 3) * 120 + Math.sin(TT * 2 + i) * 10, 380 + Math.floor(i / 3) * 170 + Math.cos(TT * 1.7 + i) * 10, 34, 'g5o' + i);
  // the gill filaments: tall pink bars with narrow gaps
  for (let i = 0; i < 5; i++) { const x = 820 + i * 110, sw = Math.sin(TT * 1.5 + i) * 6; cut(capsulePts(x + sw, 150, x - sw, 930, 84), i % 2 ? COL.gill : COL.gillD, { key: 'g5f' + i, sb: 8, pat: pat.lines('rgba(255,255,255,0.18)', 30) }); }
  // Bloo squeezes into the first gap and gets stuck
  const bx = lerp(300, 865, EZ.io(seg(TT, M[3] + 0.6, cu.squeeze)));
  const sq = ev(cu.squeeze, 0.5) * (0.42 + Math.sin(TT * 10) * 0.03 * (TT > cu.stuck ? 1 : 0));
  bloo(bx, 560, 80, { key: 'hero5', mood: TT < cu.squeeze ? 'smile' : TT < cu.stuck ? 'focus' : 'sad', sx: 1 - sq, sy: 1 + sq * 0.5 });
  mark('!', 860, 330, 110, cu.stuck, COL.red);
  note('the gills', 1000, 1000, 56, M[3] + 0.8);
}

// 6. two gill hearts, one beside each gill, pump Bloo through; it fills with oxygen
const SH = [[620, 690], [1300, 690]];   // the two gill hearts
function sceneGillHearts() {
  seaWall(COL.sea, 'gh6w');
  bubbles('gh6b', 7);
  cut(ellipsePts(960, 1040, 760, 230, 0, 48), COL.octo, { key: 'gh6body', pat: pat.dots('rgba(255,220,230,0.35)', 8, 50) });
  gill(390, 760, 560, 'gl6'); gill(1530, 760, 560, 'gr6');
  // vessels from each heart up into its gill
  ink([[SH[0][0], SH[0][1]], [470, 620], [400, 300]], { w: 26, color: 'rgba(59,120,214,0.45)', key: 'v6a' });
  ink([[SH[1][0], SH[1][1]], [1450, 620], [1520, 300]], { w: 26, color: 'rgba(59,120,214,0.45)', key: 'v6b' });
  const p = badum(1.0, cu.pumpA);
  SH.forEach(([x, y], i) => heartChar(x, y, 95, { p, mood: TT < cu.pumpA ? 'smile' : 'focus', key: 'gh' + i }));
  note('gill heart', SH[0][0], 900, 46, cu.pumpA + 0.3);
  note('gill heart', SH[1][0], 900, 46, cu.pumpA + 0.55);
  // Bloo waits beside the left heart, then gets shoved up through the gill, filling with oxygen
  const path = [[790, 640], [620, 560], [470, 480], [400, 330], [420, 200]];
  const u = EZ.o3(seg(TT, cu.shove, cu.shove + 1.2));
  const [bx, by] = TT < cu.shove ? path[0] : pointAt(resample(path, false, 10), Math.max(0.001, u));
  const nb = Math.min(4, Math.floor(Math.max(0, TT - cu.fill) / 0.5));
  bloo(bx, by, 62, { key: 'hero6', bub: nb, mood: TT < cu.shove ? 'smile' : TT < cu.shove + 1.3 ? 'wow' : 'happy' });
  // a second drop through the right gill (the other heart's work)
  const u2 = EZ.o3(seg(TT, cu.shove + 1.0, cu.shove + 2.2));
  if (TT > cu.shove + 1.0) { const [x2, y2] = pointAt(resample([[1130, 640], [1300, 560], [1450, 480], [1520, 330], [1500, 200]], false, 10), Math.max(0.001, u2)); bloo(x2, y2, 46, { key: 'pal6', bub: TT > cu.shove + 2.2 ? 2 : 0, mood: 'happy' }); }
  note('x2', 960, 560, 80, cu.pumpA + 1.5, { rot: -0.05 });
}

// 7. the body heart (the big one) sends the fresh blood around the body: to eight arms and a big brain
function sceneBodyHeart() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#f7d0c4', { key: 'bh7w', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,255,255,0.18)', 26, 90, -0.3) });
  // vessels out of the heart: up to the brain, right to the arms
  ink([[960, 470], [700, 330], [470, 300]], { w: 40, color: 'rgba(59,120,214,0.4)', key: 'v7b' });
  ink([[1090, 560], [1300, 560], [1440, 540]], { w: 40, color: 'rgba(59,120,214,0.4)', key: 'v7a' });
  // background life: other drops drifting in the flow, cells, a second little vessel
  for (let i = 0; i < 5; i++) { const R = RNG('d7', i); bloo(mod(R.r(0, W) + TT * R.r(40, 70), W + 200) - 100, R.r(780, 1010), R.r(20, 28), { key: 'dr7' + i, mood: i % 2 ? 'smile' : 'happy' }); }
  for (let i = 0; i < 12; i++) { const R = RNG('c7', i); cut(ellipsePts(mod(R.r(0, W) + TT * R.r(50, 90), W + 80) - 40, R.r(60, 160), R.r(8, 13), R.r(6, 9), 0, 12), 'rgba(207,127,122,0.5)', { key: 'c7' + i, shadow: false, grain: false, shade: false }); }
  // the eight arms fan out on the right
  for (let i = 0; i < 8; i++) {
    const k = popS(cu.arms + i * 0.12); if (k <= 0) continue;
    const a0 = -1.0 + i * 0.28, C = armLine(1440, 540, a0, 270 * k, 1.4 * Math.sin(TT * 2 + i) + (i < 4 ? -1.2 : 1.2));
    arm(C, 48 * k, i % 2 ? COL.octo : COL.octoD, 'ar7' + i, i % 2 === 1);
  }
  brain(420, 250, 1.0, TT < cu.brain ? 'focus' : 'happy', 'br7');
  if (TT < cu.brain) cut(ellipsePts(420, 250, 150, 110, 0, 30), '#f7d0c4', { key: 'br7hide', shadow: false, grain: false, shade: false });
  heartChar(960, 560, 150, { p: badum(1.0, cu.bigPump), mood: 'focus', color: '#d8506f', key: 'bigh' });
  note('body heart', 960, 870, 56, cu.bigPump + 0.4);
  // Bloo enters, gets pumped out along the vessel to the arms, then a bubble flies to the brain
  const path = [[640, 760], [800, 640], [960, 560], [1200, 560], [1440, 540]];
  const u = TT < cu.ride ? 0.25 * EZ.io(seg(TT, M[5] + 0.6, cu.bigPump)) : 0.25 + 0.75 * EZ.o3(seg(TT, cu.ride, cu.ride + 1.6));
  const [bx, by] = pointAt(resample(path, false, 10), Math.max(0.001, u));
  const give = TT >= cu.arms + 1.2 ? 1 : 0, give2 = TT >= cu.brain + 0.3 ? 1 : 0;
  bloo(bx, by - 40, 62, { key: 'hero7', bub: 4 - give - give2, mood: TT < cu.ride ? 'smile' : TT < cu.ride + 1.6 ? 'wow' : 'happy', wave: TT > cu.brain + 1.2 ? 1 : 0 });
  const fly = (t0, a, b, key) => { const v = EZ.io(seg(TT, t0, t0 + 0.8)); if (v > 0 && v < 1) o2(lerp(a[0], b[0], v), lerp(a[1], b[1], v) - Math.sin(v * Math.PI) * 120, 22, key); };
  fly(cu.arms + 0.4, [1440, 420], [1760, 300], 'f7a');
  fly(cu.brain - 0.5, [1440, 420], [520, 220], 'f7b');
}

// 8. the turn: an eel! the octopus jets away, and its body heart stops (the monitor flatlines)
function monitor(x, y, alive, key) {
  const f = () => {
    cut(rect(x - 280, y - 95, 560, 190, 14), '#20313a', { key: key + 'c' });
    const P = [], t0 = TT, stop = alive === true ? 1e9 : alive;
    for (let i = 0; i <= 110; i++) { const xx = x - 150 + i * 3.8, tt = t0 - (110 - i) * 0.012; const ph = mod(tt, 1.0); const live = tt < stop; const v = live ? (ph < 0.06 ? -Math.sin(ph / 0.06 * Math.PI) * 60 : ph > 0.22 && ph < 0.28 ? -Math.sin((ph - 0.22) / 0.06 * Math.PI) * 34 : 0) : 0; P.push([xx, y + 10 + v]); }
    ink(P, { w: 5, color: TT < stop ? '#7be3a0' : '#f05a5a', amt: 0.3, key: key + 'l' });
    heartChar(x - 205, y + 6, 46, { p: TT < stop ? badum(1.0, 0) : 0, mood: TT < stop ? 'smile' : 'sad', key: key + 'h' });
  };
  if (DEFER) DEFER.push(f); else f();
}
function sceneSwim() {
  seabed('s8', { wall: '#287a7b', crab: false });
  const ee = EZ.o3(seg(TT, cu.eel, cu.eel + 0.6)) * (1 - EZ.io(seg(TT, 63.0, 64.0)) * 0.7);
  eel(lerp(W + 160, 1240, ee), 690, ee * (TT < 62.5 ? 1 : 0.3), 'eel8');
  // ink cloud where the octopus was
  const ik = ev(cu.jet, 0.6);
  if (ik > 0) { const R = RNG('ink8'); for (let i = 0; i < 9; i++) cut(ellipsePts(860 + R.n(140) * ik, 650 + R.n(100) * ik, (60 + R.r(0, 50)) * ik, (50 + R.r(0, 40)) * ik, 0, 20), i % 2 ? '#3a3540' : '#4a4550', { key: 'ink8' + i, sb: 10, grain: 0.4 }); }
  // the octopus: sits, sees the eel, jets up and away to the left, then drifts
  const j = EZ.o3(seg(TT, cu.jet, cu.jet + 1.4)), drift = Math.max(0, TT - (cu.jet + 1.4)) * 18;
  const ox = lerp(900, 330, j) - drift, oy = lerp(820, 470, j) + drift * 0.6;
  octopus(ox, oy, { s: 0.95, pose: TT < cu.jet ? 'sit' : 'jet', rot: TT < cu.jet ? 0 : -1.05 * (1 - ev(cu.silence, 1.5) * 0.4), mood: TT < cu.eel + 0.3 ? 'smile' : TT < cu.stop ? 'wow' : 'sad', key: 'oc8' });
  if (TT >= cu.jet && TT < cu.jet + 1.0) for (let i = 0; i < 3; i++) ink([[ox + 180 + i * 50, oy + 40 + i * 20], [ox + 300 + i * 60, oy + 80 + i * 25]], { w: 7, color: 'rgba(255,255,255,0.8)', key: 'jl' + i });
  mark('!', 1000, 470, 120, cu.eel + 0.3, COL.red);
  monitor(1250, 170, cu.stop, 'mon8');
  note('swimming...', 640, 980, 52, cu.jet + 0.5, { rot: -0.02 });
}

// 9. the payoff: thud, it lands and crawls off along the seabed; the heart beats again
function sceneCrawl() {
  seabed('c9', { wall: '#3aa29b', star: true });
  const lx = 640 + Math.max(0, TT - (HIT + 0.8)) * 120;
  const land = EZ.back(ev(HIT, 0.25));
  octopus(lx, lerp(760, 830, land), { s: 1.0, pose: TT < HIT + 0.8 ? 'sit' : 'crawl', mood: TT < HIT + 0.6 ? 'wow' : 'happy', key: 'oc9' });
  const puff = ev(HIT, 0.7);
  if (puff > 0 && puff < 1) for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI, r = 150 + puff * 180; cut(ellipsePts(640 + Math.cos(a) * r, 870 + Math.sin(a) * r * 0.3, 40 * (1 - puff) + 8, 28 * (1 - puff) + 6, 0, 14), COL.sandD, { key: 'puff' + i, shadow: false, grain: false }); }
  monitor(1250, 170, true, 'mon9');
  note('crawling: much better', 480, 130, 54, HIT + 1.4, { rot: 0.02 });
}

// 10. back to the start, changed: the three hearts beat together, labelled; Bloo waves from the body heart
function sceneEnd() {
  seabed('e10');
  octopus(620, 820, { s: 1.05, mood: 'happy', key: 'oc1' });
  const p = badum(1.0, cu.sync);
  HEARTS3.forEach(([x, y], i) => heartChar(x, y, 95, { p, mood: i === 1 ? 'focus' : 'happy', key: 'h3' + i }));
  note('gill', HEARTS3[0][0], 500, 46, 74.0);
  note('gill', HEARTS3[2][0], 500, 46, 74.5);
  note('body', HEARTS3[1][0], 450, 46, 75.5);
  bloo(1290, 150, 46, { s: popS(cu.wave), key: 'hero10', mood: 'happy', wave: 1, bub: TT > cu.wave + 0.5 ? 2 : 0 });
  note('Why Three Hearts?', 1290, 700, 84, cu.title, { write: true, rot: -0.02, fill: '#fff4d6' });
}
