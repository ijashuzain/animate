
// =====================================================================
//  ERAS, CAMERAS, BRIDGES — the original's shape morphs and push-ins, mapped onto the 16:9 frame and the new times.
//  The bridge objects are in the tableau's world: TMP()/TS() put them on screen.
// =====================================================================
const ERA_BG = ['#26315f', '#f0cf78', '#cfdccf', '#c9b9da', '#cfe2ee', '#2f5a5c', '#2b2f45', '#e7c79a', '#e2b878', '#7e9fc8', '#e9dfc7', '#141a33', '#f3a3bf', '#a9d9c6', '#26315f'];
const camT = (cam) => ({ z: cam.z, p: TM(...cam.p), to: TM(...cam.to) });
function pieceCam(era, t) {
  const n = (x) => newT(era, x);
  if (era === 2) return push(t, n(10.5), n(11.0), camT({ z: 1.7, p: [780, 1250], to: [560, 1000] }), n(11.6), n(11.9));
  if (era === 6) return push(t, n(26.5), n(27.0), camT({ z: 1.6, p: [260, 1230], to: [430, 1000] }), n(28.0), n(28.4));
  if (era === 7) return push(t, n(30.75), n(31.25), camT({ z: 1.7, p: [785, 610], to: [500, 760] }), n(32.0), n(32.35));
  if (era === 10 && t >= 88.5) return bump(t, 88.5, TM(470, 880));
  return null;
}
const PAGE = () => rot(rect(210, 1050, 620, 380, 4), 520, 1240, -0.05);
const photosSpark = () => { const T = TT; TT = 29; const mu = EZ.o3(ev(30.75, 0.4)), mgx = lerp(Math.sin(TT * 2.6) * 220 - 160, 65, mu) * 0.6, mgy = lerp(Math.cos(TT * 1.9) * 160 - 120, -240, mu) * 0.6; TT = T; return [560 + mgx, 1000 + mgy]; };
const S = (P, c) => ({ P: TMP(P), c });
const TS = (x, y, r, n) => SP(...TM(x, y), r * TK, n);
const BRIDGES = [
  [1, () => S(PAGE(), PAL.paper), () => S(rect(60, 640, 830, 490, 10), '#2d463b')],
  [2, () => TS(680, 1030, 84, 6), () => TS(420, 760, 80, 6)],
  [3, () => S(ellipsePts(780, 1240, 46, 46, 0, 64), '#79c27a'), () => S([[790, 820], [850, 820], [880, 1200], [760, 1200]], '#b7a0e8')],
  [4, () => S(rot(rect(130, 380, 600, 820, 4), 430, 860, -0.02), PAL.paper), () => S([[-40, 1120], [200, 1090], [500, 1130], [800, 1100], [1120, 1120], [1120, 2000], [-40, 2000]], PAL.snow)],
  [5, () => S([[441, 1094], [454, 1132], [441, 1146], [428, 1132]], PAL.yellow), () => S([[239, 1004], [256, 1040], [239, 1056], [222, 1040]], PAL.yellow)],
  [6, () => S(rot(rect(360, 1140, 400, 180, 4), 560, 1230, 0.05), PAL.paper), () => S(rect(-60, 1040, 1200, 360, 2), '#e9d3a8')],
  [7, () => TS(750, 360, 84, 8), () => TS(...photosSpark(), 96, 9)],
  [8, () => S(rect(50, 250, 860, 860, 8), '#b88a5a'), () => S(rect(0, 330, 1080, 1200, 0), '#e2b878')],
  [9, () => S(ellipsePts(660, 900, 66, 62, 0, 64), '#2b2a2e'), () => TS(430, 1070, 100, 10)],
  [10, () => TS(430, 1070, 100, 10), () => TS(470, 880, 150, 10)],
  [11, () => TS(470, 880, 230, 10), () => S(rect(60, 560, 820, 640, 30), '#f6f1e6')],
  [13, () => TS(470, 920, 150, 11), () => TS(800, 732, 88, 12)],
  [14, () => S(rect(126, 456, 218, 168, 2), PAL.paper), () => S(PAGE(), PAL.paper)],
].map(([e, A, Bf]) => ({ tc: NEW[e][0], A, B: Bf }));
