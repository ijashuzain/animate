
// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js. One bridge per world boundary except the payoff (HIT, a hard cut).
// =====================================================================
const ERA_BG = [COL.sea, COL.sea, COL.flesh, COL.flesh, COL.seaD, COL.sea, '#f7d0c4', '#287a7b', '#3aa29b', COL.sea];
function pieceCam(era, t) {
  if (era === 6) return push(t, M[5] + 1.0, cu.arms - 0.6, { z: 1.25, p: [1100, 560], to: [960, 560] }, cu.arms - 0.4, cu.arms + 0.6);   // into the body heart, then back for the arms
  if (era === 8) return push(t, HIT + 2.5, M[7] - 2.0, { z: 1.15, p: [900, 700], to: [900, 700] }, M[7] - 1.6, M[7] - 0.8);
  return null;
}
const BRIDGES = [
  { tc: M[0], A: () => ({ P: heartPts(1290, 280, 95), c: COL.heart }), B: () => ({ P: heartPts(1440, 300, 80), c: COL.heart }) },   // the middle heart -> the octopus's heart in the comparison
  { tc: M[1], A: () => ({ P: ellipsePts(960, 560, 120, 120, 0, 64), c: COL.bloo }), B: () => SP(960, 600, 120, 0) },                  // the "?" bubble -> Bloo
  { tc: M[2], A: () => SP(960, 600, 120, 0), B: () => SP(300, 760, 80, 0) },                                                          // Bloo -> Bloo at the start line
  { tc: M[3], A: () => SP(520 + (M[3] - cu.goo) * 45, 760, 80, 0), B: () => SP(300, 560, 80, 0) },                                     // Bloo -> Bloo at the gills
  { tc: M[4], A: () => ({ P: capsulePts(1040, 150, 1040, 930, 84, 12), c: COL.gill }), B: () => ({ P: heartPts(SH[0][0], SH[0][1], 95), c: COL.heart }) },   // a gill filament -> the gill heart
  { tc: M[5], A: () => ({ P: heartPts(SH[0][0], SH[0][1], 95), c: COL.heart }), B: () => ({ P: heartPts(960, 560, 150), c: '#d8506f' }) },                    // a gill heart -> the body heart
  { tc: M[6], A: () => ({ P: heartPts(960, 560, 150), c: '#d8506f' }), B: () => ({ P: mantlePts(900, 820, 0.95), c: COL.octo }) },                           // the body heart -> the octopus
  { tc: M[7], A: () => ({ P: mantlePts(640 + (M[7] - HIT - 0.8) * 120, 830, 1.0), c: COL.octo }), B: () => ({ P: mantlePts(620, 820, 1.05), c: COL.octo }) }, // the octopus -> the opening's octopus
];
