// =====================================================================
//  SCENES — the lab reel: one big paper object per scene (the transition grows out of it), the kind lettered on the right.
// =====================================================================
const CHANNEL = {};
function labObject(shape, x, y, r, c, key) {
  const P = trShape(shape, x, y + Math.sin(TT * 2 + key.length) * 8, r);
  cut(P, c, { key, sb: 14 });
  chFace(x, y + 10 + Math.sin(TT * 2 + key.length) * 8, r / 90, TT % 3 < 0.4 ? 'wow' : 'smile', key);
}
function sTitle() { wallC('#26315f', pat.dots('rgba(255,225,170,0.06)', 4, 70)); starsC('lab', 80); hero(495, 560, 120, { mood: 'happy', arms: 'wave', key: 'labh' }); }
function cTitle(at) { title('Studio Lab', at(0.4)); write('every scene change, one by one', CL, 400, 48, at(1.0)); }
function sLab(i) {
  const [kind, tr, shape, bg] = LAB[i];
  wallC(bg, pat.dots('rgba(255,255,255,0.18)', 5, 58));
  for (let k = 0; k < 5; k++) { const R = RNG('lb', i, k); cut(ellipsePts(mod(R.r(0, 1000) + TT * R.r(20, 50), 1080) - 40, R.r(80, 1000), R.r(14, 30), R.r(14, 30), 0, 12), 'rgba(255,255,255,0.4)', { key: 'lbb' + i + k, shadow: false, grain: false }); }
  labObject(shape, 495, 540, 190, ['#fbf6ea', '#ec7a4f', '#f6cf55', '#3f9f9a', '#f3a3bf'][i % 5], 'lo' + i);
}
function cLab(at, i) {
  const [kind, , , , use] = LAB[i];
  bigNum(kind, null, CCX, 470, at(0.3), CH.accent, 120);
  write(use, CL, 650, 48, at(0.6));
  write(`${i + 1} / ${LAB.length}`, CL, 900, 36, at(0.6), { color: CH.ink });
}
function sHush() { wallC('#141c40'); }
function sCut() { wallC('#f3a3bf', pat.stripes('rgba(255,255,255,0.2)', 10, 46, -0.5)); hero(495, 540, 140, { mood: 'happy', arms: 'up', key: 'labc' }); }
function cCut(at) { bigNum('hard cut', 'the payoff, after the silence', CCX, 500, at(0.2), CH.accent, 110); }
