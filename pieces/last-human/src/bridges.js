
// =====================================================================
//  ERAS, CAMERAS, BRIDGES. Every scene boundary is a torn-paper iris: the old scene closes onto a disc at its focus,
//  the disc slides to the new scene's focus, the new scene opens out of it. Hard cuts (SCN[5]) on the shocks.
// =====================================================================
const ERA_BG = SCN.map((s) => s[4]);
function pieceCam(era, t) {
  const [a, b] = ERA_LIST[era], f = SCN[era][3], key = SCN[era][0];
  if (key === 'speck') return push(t, P(21) - 0.3, P(21) + 1.6, { z: 2.6, p: [1300, 520], to: [960, 560] }, ERA_LIST[era][1] - 1.6, ERA_LIST[era][1] - 0.7);
  // a slow drift toward the scene's focus, so long held shots breathe (back to rest before the next bridge)
  const u = clamp((t - a) / Math.max(1, b - a)), z = 1 + 0.045 * Math.sin(u * Math.PI);
  return camOf({ z, p: f, to: f });
}
const BRIDGES = SCN.slice(1).map((s, k) => {
  const i = k + 1;
  if (s[5]) return null;
  const A = SCN[i - 1], r = 210;
  return { tc: s[1], A: () => ({ P: ellipsePts(A[3][0], A[3][1], r, r, 0, 64), c: A[4] }), B: () => ({ P: ellipsePts(s[3][0], s[3][1], r, r, 0, 64), c: s[4] }) };
}).filter(Boolean);
