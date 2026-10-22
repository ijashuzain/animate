// kit/animals.js — the channel's house-style animals, drawn after the user's style library (studio/references/style/NOTES.md):
// no outlines, 2-3 flat tones (body, darker far side, light belly/muzzle), rounded silhouettes, thin legs, one small eye
// with a highlight and a short smile in profile, soft natural colours, detail only where it identifies the animal.
// Everything stands on y = 0, faces +x (dir -1 flips: always face the way you travel), local units ~ cm-like; s scales.
//
// Animals.quad(t, x, y, s, spec, o)   a four-legged mammal rig. spec: see Animals.SPEC (cat, dog, fox, deer, bear,
//                 elephant, lion, tiger, zebra, giraffe, horse, cow, rabbit, mouse, sheep, wolf). o: dir, walk (0 stand,
//                 1 walk, 2 run), mood, look, tail swish, head tilt
// Animals.cat(t, x, y, s, o)          the hero cat (the user's reference: dark plum, amber eyes, 3/4 head) with a falling
//                 rig: o.front, o.back = roll 0 (belly up) .. 1 (upright) for each half, o.tuckF, o.tuckB 0..1, o.arch,
//                 o.bend (folds at the waist), o.legsOut (landing), o.tailUp, o.walk, o.dir, o.mood, o.look, o.headScale,
//                 o.legScale (a kitten: 1.3, 0.8); Animals.catFrame(o) / catAt(x, y, s, o, fn) give its local frame (pt, head, bodyPts, headPts) for attachments and masks
// Animals.bird(t, x, y, s, kind, o)   'gull' | 'raven' | 'condor' | 'eagle' | 'sparrow' | 'parrot' | 'owl' | 'penguin' |
//                 'flamingo'; o.fly (flap) or perched
// Animals.lizard, snake, croc, frog, trilobite, butterfly, bee, ladybug, snail, octopus, starfish, seal (see each)
const Animals = {};
const A_ = {
  // a shape with depth: a top-lit gradient, a soft shade crescent away from the light, a warm rim on the lit edge
  lit: (pts, col, k = 1) => P.lit(pts, P.lin(0, Math.max(...pts.map((q) => q[1])), 0, Math.min(...pts.map((q) => q[1])), P.mixc(col, '#fff6e8', 0.14 * k), P.mixc(col, '#1a1424', 0.06 * k)), { d: 0.2, shade: `rgba(30,15,25,${0.24 * k})`, rim: `rgba(255,246,228,${0.38 * k})`, light: [-0.45, 0.9] }),
  blob: (x, y, rx, ry, col, seed = 1, k = 1) => A_.lit(P.blobPts(x, y, rx, ry, 12, 0.04, seed), col, k),
  dark: (c, k = 0.22) => P.mixc(c, '#1a1424', k), light: (c, k = 0.35) => P.mixc(c, '#fff6e8', k),
};
// ---------- the quadruped rig ----------
Animals.SPEC = {
  cat:      { col: '#4a3d55', len: 60, hgt: 26, leg: 26, legW: 7, neck: 6, head: 15, snout: 4, ear: 'point', tail: 'thin', tailL: 55, belly: null },
  dog:      { col: '#c9925a', len: 64, hgt: 30, leg: 30, legW: 9, neck: 10, head: 17, snout: 12, ear: 'flop', tail: 'short', tailL: 26, belly: '#f2e2c8' },
  fox:      { col: '#e07a3a', len: 58, hgt: 24, leg: 24, legW: 7, neck: 8, head: 15, snout: 13, ear: 'point', tail: 'bushy', tailL: 46, belly: '#fbeee0', tailTip: '#fbeee0', socks: '#3a2a22' },
  wolf:     { col: '#8d8f9e', len: 70, hgt: 30, leg: 32, legW: 9, neck: 10, head: 17, snout: 15, ear: 'point', tail: 'bushy', tailL: 44, belly: '#e4e2ea' },
  deer:     { col: '#b8805a', len: 64, hgt: 30, leg: 46, legW: 6, neck: 26, head: 14, snout: 11, ear: 'long', tail: 'short', tailL: 10, belly: '#f2e2cc', spots: '#f3e6d0', extra: 'antlers' },
  bear:     { col: '#7a5a46', len: 84, hgt: 46, leg: 28, legW: 16, neck: 8, head: 22, snout: 10, ear: 'round', tail: 'none', belly: null },
  elephant: { col: '#8c9bb0', len: 110, hgt: 70, leg: 50, legW: 22, neck: 4, head: 34, snout: 0, ear: 'elephant', tail: 'thin', tailL: 30, extra: 'trunk' },
  lion:     { col: '#e0a24a', len: 80, hgt: 36, leg: 36, legW: 11, neck: 10, head: 20, snout: 10, ear: 'round', tail: 'tuft', tailL: 60, belly: '#f3d79a', extra: 'mane', mane: '#a85a2a' },
  tiger:    { col: '#e6823a', len: 84, hgt: 36, leg: 34, legW: 11, neck: 8, head: 19, snout: 9, ear: 'round', tail: 'thin', tailL: 64, belly: '#f8ecd8', stripes: '#2a1e1a' },
  zebra:    { col: '#f2efe8', len: 80, hgt: 38, leg: 50, legW: 9, neck: 30, head: 18, snout: 18, ear: 'long', tail: 'tuft', tailL: 36, stripes: '#2a2830', extra: 'mane', mane: '#2a2830' },
  giraffe:  { col: '#e8b456', len: 80, hgt: 40, leg: 80, legW: 8, neck: 110, head: 16, snout: 14, ear: 'long', tail: 'tuft', tailL: 40, belly: '#f6e2b4', spots: '#a8642e', extra: 'ossicones' },
  horse:    { col: '#9a6a46', len: 86, hgt: 40, leg: 56, legW: 10, neck: 40, head: 18, snout: 22, ear: 'point', tail: 'long', tailL: 50, extra: 'mane', mane: '#3a2a22' },
  cow:      { col: '#f2ede4', len: 92, hgt: 46, leg: 42, legW: 12, neck: 14, head: 20, snout: 14, ear: 'side', tail: 'tuft', tailL: 50, spots: '#3a3030', extra: 'horns', muzzle: '#f2b8b0' },
  sheep:    { col: '#f4efe6', len: 62, hgt: 36, leg: 26, legW: 7, neck: 8, head: 13, snout: 8, ear: 'side', tail: 'short', tailL: 10, extra: 'wool', face: '#3a3236' },
  rabbit:   { col: '#c9b7a4', len: 40, hgt: 24, leg: 12, legW: 8, neck: 4, head: 13, snout: 5, ear: 'bunny', tail: 'puff', tailL: 8, belly: '#f2e8de' },
  mouse:    { col: '#9aa0aa', len: 26, hgt: 14, leg: 6, legW: 4, neck: 2, head: 9, snout: 7, ear: 'mouse', tail: 'thin', tailL: 34, belly: '#e8e4ea' },
};
Animals.quad = function (t, x, y, s, spec, o = {}) {
  const S = typeof spec === 'string' ? Animals.SPEC[spec] : spec, dir = o.dir ?? 1, col = S.col, far = A_.dark(col, 0.18), seed = o.seed ?? 3;
  const L = S.len, H = S.hgt, leg = S.leg, lw = S.legW, walk = o.walk ?? 0, ph = t * (walk > 1.5 ? 11 : 6.5) + seed;
  const bob = walk ? Math.abs(Math.sin(ph)) * 1.5 * walk : Math.sin(t * 1.6 + seed) * 0.4, by = leg + H / 2 + bob;
  P.at(x, y, 0, s * dir, s, () => {
    P.circle(0, 0.5, L * 0.55, 'rgba(30,20,10,0.16)', { ry: 2.5 });
    const legAt = (lx, phase, c, w) => { const sw = walk ? Math.sin(ph + phase) * 0.45 * Math.min(walk, 1.4) : 0, k = Math.cos(ph + phase) > 0 && walk ? 0.18 : 0, kx = lx + Math.sin(sw) * leg * 0.5, fx = lx + Math.sin(sw) * leg; P.ribbon([[lx, by - H * 0.1], [kx + (phase < 2 ? 1 : -1) * k * 6, by - H * 0.2 - leg * 0.55], [fx, 0 + Math.max(0, -Math.sin(ph + phase)) * walk * 3]], [w * 1.35, w * 0.85, w * 0.72], P.lin(0, by, 0, 0, c, P.mixc(c, '#1a1424', 0.18))); if (S.socks) P.circle(fx, 2, w * 0.45, S.socks, { ry: w * 0.3 }); };
    // far legs and tail, then body
    legAt(L * 0.3, Math.PI, far, lw * 0.95); legAt(-L * 0.3, 0, far, lw * 0.95);
    const tailBase = [-L * 0.48, by + H * 0.15], sw = Math.sin(t * 2.2 + seed) * (o.swish ?? 0.25);
    const tail = { thin: () => P.ribbon([tailBase, [tailBase[0] - S.tailL * 0.5, tailBase[1] + S.tailL * (0.1 + sw)], [tailBase[0] - S.tailL * 0.8, tailBase[1] + S.tailL * (0.55 + sw)], [tailBase[0] - S.tailL * 0.7 + 4, tailBase[1] + S.tailL * (0.75 + sw)]], [lw * 0.7, lw * 0.6, lw * 0.5, lw * 0.4], col),
      bushy: () => { P.ribbon([tailBase, [tailBase[0] - S.tailL * 0.55, tailBase[1] - S.tailL * (0.12 - sw * 0.4)], [tailBase[0] - S.tailL, tailBase[1] - S.tailL * (0.02 - sw * 0.6)]], [lw * 0.9, lw * 2.4, lw * 1.2], col); if (S.tailTip) P.circle(tailBase[0] - S.tailL * 0.98, tailBase[1] - S.tailL * (0.02 - sw * 0.6), lw * 0.9, S.tailTip); },
      tuft: () => { const e = [tailBase[0] - S.tailL * 0.35, tailBase[1] - S.tailL * (0.75 - sw)]; P.ribbon([tailBase, [tailBase[0] - S.tailL * 0.25, tailBase[1] - S.tailL * 0.3], e], [lw * 0.4, lw * 0.35, lw * 0.3], col); P.blob(e[0], e[1] - 3, lw * 0.6, lw * 0.9, S.mane ?? A_.dark(col, 0.5), { seed }); },
      long: () => P.ribbon([tailBase, [tailBase[0] - S.tailL * 0.35, tailBase[1] - S.tailL * 0.3], [tailBase[0] - S.tailL * (0.45 + sw * 0.3), tailBase[1] - S.tailL * 0.85]], [lw * 0.9, lw * 1.4, lw * 0.6], S.mane ?? A_.dark(col, 0.4)),
      short: () => P.ribbon([tailBase, [tailBase[0] - S.tailL * 0.8, tailBase[1] + S.tailL * (0.4 + sw)]], [lw * 0.8, lw * 0.4], col),
      puff: () => P.circle(tailBase[0] - 2, tailBase[1] + 2, lw * 1.0, A_.light(col, 0.6)), none: () => {} };
    (tail[S.tail] ?? tail.none)();
    const body = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), up = sn > 0 ? 1 + 0.12 * Math.abs(Math.sin(a * 2)) : 0.92; body.push([c * L * 0.52, by + sn * H * 0.5 * up + (c > 0.3 && sn > 0 ? H * 0.06 : 0)]); }
    if (S.extra === 'wool') A_.lit(P.blobPts(0, by + 2, L * 0.55, H * 0.62, 14, 0.12, seed), col); else A_.lit(body, col);
    if (S.belly) P.clip(() => P.trace(body), () => P.circle(L * 0.05, by - H * 0.42, L * 0.36, S.belly, { ry: H * 0.32 }));
    if (S.stripes) P.clip(() => P.trace(body), () => { for (let i = 0; i < 8; i++) { const sx = -L * 0.4 + i * L * 0.11; P.ribbon([[sx, by + H * 0.6], [sx + 3, by + H * 0.1], [sx - 2, by - H * 0.25]], [5, 4, 1], S.stripes); } });
    if (S.spots) P.clip(() => P.trace(body), () => { for (let i = 0; i < 12; i++) P.blob(-L * 0.4 + K.hash(i, seed) * L * 0.85, by - H * 0.3 + K.hash(i, seed + 1) * H * 0.75, 3 + 4 * K.hash(i, 2), 2.5 + 3 * K.hash(i, 3), S.spots, { seed: i }); });
    if (S.extra === 'hump') P.blob(-L * 0.05, by + H * 0.55, L * 0.2, H * 0.3, col, { seed });
    // near legs
    legAt(L * 0.34, 0, col, lw); legAt(-L * 0.26, Math.PI, col, lw);
    // neck and head
    const nb = [L * 0.4, by + H * 0.25], ang = S.neck > 30 ? 1.25 : 0.7, hp = [nb[0] + Math.cos(ang) * S.neck + S.head * 0.4, nb[1] + Math.sin(ang) * S.neck + (o.headDown ?? 0) * -S.neck];
    if (S.neck > 2) P.ribbon([nb, [hp[0] - S.head * 0.3, hp[1] - S.head * 0.2]], [H * 0.55, S.head * 1.1], col);
    if (S.extra === 'mane') { if (S.neck > 25) P.ribbon([[nb[0] - 3, nb[1] + H * 0.2], [hp[0] - S.head * 0.8, hp[1] + S.head * 0.3]], [6, 5], S.mane); else P.blob(hp[0] - S.head * 0.2, hp[1], S.head * 1.55, S.head * 1.5, S.mane, { seed, n: 12, w: 0.18 }); }
    P.at(hp[0], hp[1], (o.tilt ?? 0) + (o.headDown ?? 0) * -0.5, 1, 1, () => {
      const hr = S.head, ear = S.ear;
      const earAt = (ex, c) => {
        if (ear === 'point') P.poly([[ex - hr * 0.35, hr * 0.6], [ex + hr * 0.05, hr * 1.35], [ex + hr * 0.3, hr * 0.55]], c);
        else if (ear === 'round') P.circle(ex, hr * 0.85, hr * 0.32, c);
        else if (ear === 'long') P.at(ex, hr * 0.7, -0.6, 1, 1, () => P.blob(-hr * 0.35, 0, hr * 0.5, hr * 0.2, c, { seed: 2 }));
        else if (ear === 'flop') P.at(ex - hr * 0.2, hr * 0.5, 0.5, 1, 1, () => P.blob(0, -hr * 0.35, hr * 0.25, hr * 0.5, A_.dark(col, 0.3), { seed: 2 }));
        else if (ear === 'side') P.blob(ex - hr * 0.5, hr * 0.3, hr * 0.4, hr * 0.18, c, { seed: 3 });
        else if (ear === 'bunny') P.at(ex, hr * 0.8, 0.25 + Math.sin(t * 1.5) * 0.05, 1, 1, () => { P.blob(0, hr * 0.8, hr * 0.28, hr * 0.85, c, { seed: 4 }); P.blob(0, hr * 0.8, hr * 0.14, hr * 0.6, '#f2b8b8', { seed: 4 }); });
        else if (ear === 'mouse') P.circle(ex, hr * 0.8, hr * 0.45, c);
        else if (ear === 'elephant') P.blob(-hr * 0.35, -hr * 0.1, hr * 0.6, hr * 0.75, A_.dark(col, 0.12), { seed: 5 });
      };
      if (ear !== 'elephant' && ear !== 'side') earAt(-hr * 0.15, far);
      if (S.extra === 'antlers') for (const k of [-0.25, 0.1]) { const bx = hr * k; P.ribbon([[bx, hr * 0.8], [bx - 3, hr * 1.6], [bx - 8, hr * 2.2]], 2.5, '#d8c4a0'); P.ribbon([[bx - 2, hr * 1.3], [bx + 7, hr * 1.8]], 2, '#d8c4a0'); P.ribbon([[bx - 6, hr * 1.95], [bx + 2, hr * 2.4]], 2, '#d8c4a0'); }
      if (S.extra === 'ossicones') for (const k of [-0.2, 0.15]) { P.ribbon([[hr * k, hr * 0.7], [hr * k, hr * 1.4]], 3, A_.dark(col, 0.3)); P.circle(hr * k, hr * 1.45, 3, A_.dark(col, 0.45)); }
      if (S.extra === 'horns') for (const k of [-0.25, 0.1]) P.ribbon([[hr * k, hr * 0.7], [hr * k + 5, hr * 1.1], [hr * k + 9, hr * 1.25]], [4, 3, 1], '#efe2c4');
      A_.blob(0, 0, hr, hr * 0.92, S.face ?? col, 6);
      if (S.snout > 0) A_.blob(hr * 0.7 + S.snout * 0.35, -hr * 0.25, S.snout * 0.6 + hr * 0.25, hr * 0.42, S.muzzle ?? S.belly ?? A_.light(S.face ?? col, 0.15), 7, 0.7);
      if (S.extra === 'trunk') { const sw2 = Math.sin(t * 1.4) * 4; P.ribbon([[hr * 0.6, -hr * 0.2], [hr * 1.0, -hr * 0.8], [hr * 1.0 + sw2, -hr * 1.5], [hr * 1.25 + sw2, -hr * 1.8]], [hr * 0.38, hr * 0.3, hr * 0.22, hr * 0.18], col); P.ribbon([[hr * 0.55, -hr * 0.3], [hr * 0.85, -hr * 0.45]], 4, '#f6f0e4'); }
      if (ear === 'elephant' || ear === 'side') earAt(-hr * 0.1, ear === 'elephant' ? col : col);
      else if (ear !== 'flop') earAt(hr * 0.12, col);
      const tip = hr * 0.7 + S.snout * 0.8 + hr * 0.25;
      const fs = hr * 0.42, reach = tip - hr * 0.2;
      Cast.profileFace(t, hr * 0.2, hr * 0.15, fs, { mood: o.mood ?? 'smile', seed, look: o.look ?? 0.6, mouth: [Math.max(1.4, reach * 0.78 / fs), -1.25], nose: S.snout > 0 && !S.extra?.includes?.('trunk') ? [reach * 0.96 / fs, -0.15] : false });
    });
  });
};
// ---------- the hero cat (the user's reference) with a falling rig ----------
// the cat's local frame for a pose (shared by the drawing and by films that attach things to the cat: a collar, a
// cutaway, a label): pt([u, v]) = a point at u along the body (-1 rump .. 1 chest, 1.28 head) and v across it
// (+ back, - belly) in cat-local units; head = [x, y, rot]. Draw inside it with Animals.catAt(x, y, s, o, (F) => ...).
Animals.catFrame = function (o = {}) {
  const front = o.front ?? 1, back = o.back ?? 1, arch = o.arch ?? 0, bend = o.bend ?? 0, ls = o.legScale ?? 1;
  const half = (r) => Math.cos(Math.PI * (1 - r));
  const kb = half(back), kf = half(front), clampK = (k) => Math.sign(k || 1) * Math.max(0.1, Math.abs(k));
  const blend = (u) => { const w = K.clamp((u + 0.3) / 0.6); return K.lerp(kb, kf, w * w * (3 - 2 * w)); };
  const kAt = (u) => clampK(blend(u));
  const by = 48 * ls, H = 27, L = 64;
  // arch: the back bows up (away from the belly); bend: the body folds at the waist, both ends toward the belly
  const off = (u) => (arch * 14 * Math.max(0, 1 - u * u) - bend * 13 * Math.min(1, Math.abs(u))) * kAt(u);
  const pt = ([u, v]) => [u * L * 0.5, by + v * H * kAt(u) + off(u)];
  const hs = o.headScale ?? 1, head = [L * 0.64, by + H * 1.12 * clampK(kf) + off(1.28), (o.headRot ?? 0) + Math.PI * (1 - front) + bend * 0.35 * Math.sign(kf || 1)];
  // the silhouette (a rolled half shows its belly line on top, so it keeps its thickness while it rolls)
  const TOP = [[-1.02, -0.05], [-0.95, 0.42], [-0.76, 0.68], [-0.45, 0.6], [-0.05, 0.44], [0.35, 0.5], [0.62, 0.6], [0.88, 0.86], [1.1, 1.06], [1.3, 1.0], [1.4, 0.75]];
  const BOT = [[-1.02, -0.05], [-0.97, -0.3], [-0.82, -0.5], [-0.6, -0.55], [-0.32, -0.38], [0, -0.46], [0.35, -0.6], [0.7, -0.66], [0.95, -0.52], [1.12, -0.22], [1.3, 0.3], [1.4, 0.75]];
  const prof = (tab, u) => { for (let i = 1; i < tab.length; i++) if (u <= tab[i][0]) { const [u0, v0] = tab[i - 1], [u1, v1] = tab[i]; return K.lerp(v0, v1, (u - u0) / (u1 - u0)); } return tab[tab.length - 1][1]; };
  const edge = (u, top) => { const w = (blend(u) + 1) / 2, vt = prof(TOP, u), vb = prof(BOT, u); const v = top ? K.lerp(-vb, vt, w) : K.lerp(-vt, vb, w); return [u * L * 0.5, by + v * H + off(u)]; };
  const bodyPts = () => { const us = []; for (let i = 0; i <= 34; i++) us.push(-1.02 + i * 2.42 / 34); return [...us.map((u) => edge(u, true)), ...us.slice(1, -1).reverse().map((u) => edge(u, false))]; };
  const hr = 14, headPts = [[-hr * 1.08, 0], [-hr * 1.02, hr * 0.55], [-hr * 0.5, hr * 0.9], [hr * 0.3, hr * 0.95], [hr * 0.95, hr * 0.6], [hr * 1.1, 0.05 * hr], [hr * 1.22, -hr * 0.3], [hr * 0.95, -hr * 0.45], [hr * 0.6, -hr * 0.8], [0, -hr * 0.9], [-hr * 0.6, -hr * 0.78], [-hr * 1.0, -hr * 0.42], [-hr * 1.18, -hr * 0.22]];
  // a leg's joints (hip .. paw) for a leg at x = lx: hind or front, tucked 0..1, swung by angle a, on a half rolled r
  const leg = (lx, hind, tuck, a, r) => {
    const k = clampK(half(r)), len = by - H * 0.12;
    const down = hind ? [[0, 0], [6, -len * 0.42], [-3, -len * 0.8], [-1, -len]] : [[0, 0], [1.5, -len * 0.55], [1, -len]];
    const tuckd = hind ? [[0, 0], [11, -len * 0.42], [1, -len * 0.56], [9, -len * 0.62]] : [[0, 0], [7, -len * 0.42], [15, -len * 0.36]];
    const hip = [lx, by - H * 0.1 * k + off(lx / (L * 0.5))], cs = Math.cos(a), sn = Math.sin(a);
    return down.map(([dx, dy], i) => { const px = K.lerp(dx, tuckd[i][0], tuck), py = K.lerp(dy, tuckd[i][1], tuck); return [hip[0] + px * cs - py * sn, hip[1] + (px * sn + py * cs) * k]; });
  };
  // where the four legs sit (x), as Animals.cat draws them: far front, far hind, near front, near hind
  const legX = [[L * 0.3, false], [-L * 0.26, true], [L * 0.36, false], [-L * 0.33, true]];
  return { front, back, kb, kf, half, clampK, blend, kAt, by, H, L, off, pt, head, hs, ls, arch, bodyPts, headPts, leg, legX };
};
Animals.catAt = function (x, y, s, o, fn) { P.at(x, y, o.rot ?? 0, s * (o.dir ?? 1), s, () => fn(Animals.catFrame(o))); };
Animals.cat = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#4a3d55', far = A_.dark(col, 0.22), eye = '#f2a93b', dir = o.dir ?? 1;
  const front = o.front ?? 1, back = o.back ?? 1, tuckF = o.tuckF ?? 0, tuckB = o.tuckB ?? 0, out = o.legsOut ?? 0, walk = o.walk ?? 0;
  const ph = t * 6.5;
  // each half rolls on its own: r 1 upright, 0 belly up; its vertical scale is cos(pi*(1-r)); the body is ONE shape whose
  // scale blends from the back half's to the front half's across the waist, so the twist never shows a seam
  const F = Animals.catFrame(o), { half, kb, kf, clampK, kAt, by, H, L, off, pt } = F;
  P.at(x, y, o.rot ?? 0, s * dir, s, () => {
    // body profile along u = -1 (rump) .. 1 (chest), offsets of the back line (TOP) and belly line (BOT) from the spine
    // (from the reference: a round haunch, a slight dip behind the shoulders, a deep rounded chest, the neck rising to
    // the head, the belly tucking up toward the hind legs). A rolled half shows its belly line on top: the silhouette keeps
    // its thickness while it rolls, like a real body seen from the side.
    const legs = (lx, hind, r, tuck, c, phase, near) => {
      const k = clampK(half(r)), sw = walk ? Math.sin(ph + phase) * 0.42 : 0, pts = F.leg(lx, hind, tuck, sw + out * 0.55 * (hind ? -1 : 1), r);
      P.ribbon(pts, hind ? [15, 9.5, 6.5, 6] : [11.5, 7.5, 6], c); const f = pts[pts.length - 1]; P.circle(f[0] + 1.5, f[1] + 0.5 * Math.sign(k), 3.8, c, { ry: 2.8 });
    };
    // tail: rises from the rump in a long S (tailUp 1) or streams out behind (tailUp 0)
    { const tk = clampK(kb), up = o.tailUp ?? 1, sw = Math.sin(t * 2) * 0.15, r0 = pt([-0.94, 0.3]);
      const U = [[0, 0], [-8, 10], [-12, 30], [-9, 50], [-3, 60]], O = [[0, 0], [-14, 4], [-30, 6 + F.arch * 4], [-46, 4], [-56, 8]];
      const tp = U.map(([ux, uy], i) => { const ox = O[i][0], oy = O[i][1], s2 = i / 4; return [r0[0] + K.lerp(ox, ux, up) + sw * 14 * s2 * s2, r0[1] + K.lerp(oy, uy, up) * tk]; });
      P.ribbon(tp, [6.5, 5.5, 5, 4.6, 4.2], col); P.circle(tp[4][0], tp[4][1], 2.6, col); }
    // far legs, then near legs (both under the body, so thighs melt into it; the far pair a shade darker)
    const LX = F.legX; legs(LX[0][0], false, front, tuckF, far, Math.PI); legs(LX[1][0], true, back, tuckB, far, 0);
    legs(LX[2][0], false, front, tuckF, col, 0); legs(LX[3][0], true, back, tuckB, col, Math.PI);
    // the body: one smooth silhouette with depth
    const body = F.bodyPts();
    A_.lit(body, A_.dark(col, 0.1), 0.4);
    // head: on a neck above the chest, turned 3/4 toward us, rolling with the front half
    if (o.underHead) o.underHead(F);   // a film's own neck details (a collar, a scarf) go between the body and the head
    P.at(F.head[0], F.head[1], F.head[2], F.hs, F.hs, () => {
      const hr = 14;
      // ears: tall, set wide, pink inside (the far ear a little smaller)
      for (const [ex, es] of [[-0.6, 0.9], [0.5, 1]]) { P.poly([[hr * ex - 6.5 * es, hr * 0.55], [hr * ex - 0.5, hr * 0.55 + 15 * es], [hr * ex + 6 * es, hr * 0.5]], col); P.poly([[hr * ex - 3.8 * es, hr * 0.62], [hr * ex - 0.5, hr * 0.62 + 10 * es], [hr * ex + 3.4 * es, hr * 0.6]], '#f2a0a8'); }
      // head: a little wider than tall, with cheek tufts
      A_.lit(F.headPts, A_.dark(col, 0.08), 0.4);
      const bl = Cast.blink(t, 13), op = o.mood === 'sleep' ? 0 : 1 - bl, look = o.look ?? [0.2, 0];
      for (const [ex, er] of [[-hr * 0.42, 4.6], [hr * 0.36, 5.1]]) { if (op < 0.15) { P.ribbon([[ex - 4, -1], [ex, -2.5], [ex + 4, -1]], 1.5, '#1a1218'); continue; } const r = er * (o.mood === 'wow' ? 1.15 : 1); P.circle(ex, 0, r, eye, { ry: r * op }); P.circle(ex + look[0] * 1.4, look[1] * 1.4, r * 0.58, '#1a1218', { ry: r * 0.66 * op }); P.circle(ex + look[0] * 1.4 - 1.3, 1.5, 1.3, '#ffffff'); }
      P.poly([[-1.8, -4.6], [1.8, -4.6], [0, -6.6]], '#f2a0a8');
      if (o.mood === 'wow') P.circle(0, -10, 2.2, '#2a1820', { ry: 2.8 }); else P.ribbon([[-3.4, -8.6], [-1.7, -9.8], [0, -8.4], [1.7, -9.8], [3.4, -8.6]], 1.1, '#1a1218');
      P.ctx.save(); P.ctx.strokeStyle = 'rgba(240,230,220,0.75)'; P.ctx.lineWidth = 0.7; for (const s2 of [-1, 1]) for (const k of [0, 1]) { P.ctx.beginPath(); P.ctx.moveTo(s2 * 4.5, -6.5 - k * 2); P.ctx.lineTo(s2 * 18, -5 - k * 4.5); P.ctx.stroke(); } P.ctx.restore();
    });
  });
};
// ---------- birds ----------
Animals.BIRD = {
  gull: { col: '#f6f6f2', wing: '#b8c0cc', tip: '#3a3a44', beak: '#f2b23a', len: 30, wingL: 34 },
  raven: { col: '#2c2a36', wing: '#24222c', beak: '#2a2830', len: 30, wingL: 34 },
  condor: { col: '#2a2630', wing: '#22202a', tip: '#f2f0ea', beak: '#e8c4a0', head: '#e89a8a', len: 46, wingL: 70, ruff: '#f2f0ea' },
  eagle: { col: '#6a4a32', wing: '#5a3e2a', head: '#f6f4ee', beak: '#f2b23a', len: 40, wingL: 56 },
  sparrow: { col: '#a8794e', wing: '#7a5636', belly: '#efe0c8', beak: '#4a3a2a', len: 16, wingL: 14 },
  parrot: { col: '#3fae5a', wing: '#2f7fd0', head: '#e8483a', beak: '#f6eee0', len: 30, wingL: 26, tail: '#e8483a' },
  owl: { col: '#a8835c', wing: '#8a6644', belly: '#efdcbc', beak: '#f2b23a', len: 26, wingL: 22, owl: true },
  penguin: { col: '#2a2a34', wing: '#22222c', belly: '#f6f4ef', beak: '#f2a23a', len: 30, wingL: 14, penguin: true },
  flamingo: { col: '#f29aa8', wing: '#e8768c', beak: '#2a2228', len: 26, wingL: 30, flamingo: true },
};
Animals.bird = function (t, x, y, s, kind = 'gull', o = {}) {
  const B = Animals.BIRD[kind] ?? Animals.BIRD.gull, dir = o.dir ?? 1, fly = o.fly ?? false, f = Math.sin(t * (B.wingL > 50 ? 4 : 10) + (o.seed ?? 0)), L = B.len;
  P.at(x, y, 0, s * dir, s, () => {
    if (fly) {
      const W = B.wingL, glide = B.wingL > 50 ? 0.35 : 1;
      P.ribbon([[-L * 0.1, 0], [-W * 0.45, f * W * 0.35 * glide + W * 0.12], [-W * 0.9, f * W * 0.45 * glide + W * 0.05]], [L * 0.32, L * 0.22, 3], B.wing);
      if (B.tip) for (let k = 0; k < 4; k++) P.ribbon([[-W * 0.85, f * W * 0.45 * glide + W * 0.05], [-W * (0.95 + k * 0.04), f * W * 0.45 * glide + W * 0.05 + (k - 1.5) * 4]], 2.5, B.tip);
      A_.blob(0, 0, L * 0.55, L * 0.2, B.col, 3); P.poly([[-L * 0.5, 0], [-L * 0.8, 5], [-L * 0.8, -5]], B.wing);
      P.circle(L * 0.45, 2, L * 0.17, B.head ?? B.col); if (B.ruff) P.blob(L * 0.32, 1, L * 0.14, L * 0.12, B.ruff, { seed: 2 });
      P.poly([[L * 0.58, 3], [L * 0.75, 0.5], [L * 0.58, -0.5]], B.beak); P.circle(L * 0.5, 4, 1.4, '#14121a');
      P.ribbon([[L * 0.1, 0], [W * 0.15, f * W * 0.3 * glide + W * 0.1], [W * 0.05, f * W * 0.4 * glide + W * 0.06]], [L * 0.28, L * 0.18, 3], A_.dark(B.wing, 0.1));
      return;
    }
    // perched / standing
    const legH = B.flamingo ? L * 2.2 : B.penguin ? 2 : L * 0.25;
    if (!B.penguin) for (const k of [-3, 3]) P.ribbon([[k, legH + 2], [k, 0]], B.flamingo ? 2 : 1.8, B.flamingo ? B.col : '#e8a03a');
    const by = legH + (B.penguin ? L * 0.6 : L * 0.35), bob = Math.sin(t * 2 + (o.seed ?? 0)) * 0.6;
    if (B.penguin) { A_.blob(0, by, L * 0.42, L * 0.62, B.col, 4); P.blob(L * 0.08, by - 2, L * 0.28, L * 0.5, B.belly, { seed: 5 }); P.circle(L * 0.1, by + L * 0.5, L * 0.28, B.col); for (const k of [-4, 4]) P.blob(k, 1, 5, 2, B.beak, { seed: 1 }); }
    else if (B.owl) { A_.blob(0, by + 2, L * 0.4, L * 0.55, B.col, 4); P.blob(0, by - 2, L * 0.26, L * 0.38, B.belly, { seed: 5 }); for (const k of [-1, 1]) P.poly([[k * L * 0.3, by + L * 0.42], [k * L * 0.36, by + L * 0.62], [k * L * 0.16, by + L * 0.46]], B.col); for (const k of [-1, 1]) { P.circle(k * L * 0.14, by + L * 0.28, L * 0.13, '#fff6e0'); P.circle(k * L * 0.14, by + L * 0.28, L * 0.07, '#1a1418'); P.circle(k * L * 0.14 - 1, by + L * 0.3, 1, '#ffffff'); } P.poly([[-2, by + L * 0.2], [2, by + L * 0.2], [0, by + L * 0.12]], B.beak); }
    else {
      const nk = B.flamingo ? [[L * 0.2, by + 4], [L * 0.45, by + L * 0.6], [L * 0.2, by + L * 1.1], [L * 0.4, by + L * 1.35]] : null;
      A_.blob(0, by + bob, L * 0.5, L * 0.3, B.col, 4); if (B.belly) P.blob(L * 0.1, by - L * 0.08 + bob, L * 0.32, L * 0.18, B.belly, { seed: 6 });
      P.blob(-L * 0.08, by + L * 0.04 + bob, L * 0.38, L * 0.18, B.wing, { seed: 5 }); P.poly([[-L * 0.4, by + bob], [-L * 0.8, by - 4 + bob], [-L * 0.7, by + 4 + bob]], B.tail ?? B.wing);
      const hd = nk ? nk[3] : [L * 0.42, by + L * 0.3 + bob];
      if (nk) P.ribbon(nk, 3.5, B.col);
      P.circle(hd[0], hd[1], L * (nk ? 0.14 : 0.2), B.head ?? B.col); if (B.ruff) P.blob(hd[0] - 4, hd[1] - 6, L * 0.16, L * 0.1, B.ruff, { seed: 2 });
      P.poly([[hd[0] + L * 0.14, hd[1] + 2], [hd[0] + L * (nk ? 0.36 : 0.36), hd[1] - (nk ? 6 : 1)], [hd[0] + L * 0.14, hd[1] - 2]], B.beak); P.circle(hd[0] + 2, hd[1] + 2, 1.5, '#14121a'); P.circle(hd[0] + 1.6, hd[1] + 2.5, 0.5, '#ffffff');
    }
  });
};
// ---------- reptiles, amphibians, invertebrates, sea ----------
Animals.lizard = function (t, x, y, s, o = {}) {   // a desert lizard (orange, like the style sheet); o.walk, o.dir, o.col
  const col = o.col ?? '#e2853a', far = A_.dark(col, 0.25), walk = o.walk ?? 0, ph = t * 9, dir = o.dir ?? 1;
  P.at(x, y, 0, s * dir, s, () => {
    const wig = (u) => Math.sin(ph * 0.5 + u * 4) * 2 * walk;
    for (const [lx, p, c] of [[10, 0, far], [-8, Math.PI, far]]) { const sw = Math.sin(ph + p) * walk * 4; P.ribbon([[lx, 4], [lx + 4 + sw, 7], [lx + 7 + sw, 0]], 2.4, c); }
    const spine = []; for (let i = 0; i <= 10; i++) { const u = i / 10; spine.push([K.lerp(-40, 18, u), 5 + wig(u) + (u < 0.3 ? -u * 6 : 0)]); }
    P.ribbon(spine, [1, 2, 3, 4.5, 6, 7, 7.5, 7.5, 7, 6, 5], col);
    for (let i = 0; i < 6; i++) P.circle(-10 + i * 5, 7 + wig(0.5), 1.1, A_.light(col, 0.4));
    A_.blob(23, 6 + wig(1), 7.5, 5, col, 2); Cast.profileFace(t, 25, 7.5 + wig(1), 3.4, { mood: 'smile', seed: 4, mouth: [1.2, -1.0], nose: false });
    for (const [lx, p] of [[12, Math.PI], [-6, 0]]) { const sw = Math.sin(ph + p) * walk * 4; P.ribbon([[lx, 4], [lx + 4 + sw, 7], [lx + 7 + sw, 0]], 2.6, col); }
  });
};
Animals.snake = function (t, x, y, s, o = {}) {    // a snake slithering along y = 0; o.col, o.pattern colour, o.rattle
  const col = o.col ?? '#c9a45a', pat = o.pattern ?? '#7a5a2a', dir = o.dir ?? 1, n = 16;
  P.at(x, y, 0, s * dir, s, () => {
    const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([K.lerp(-60, 10, u), 4 + Math.sin(t * 5 - u * 9) * 5 * (1 - u * 0.6)]); }
    const w = pts.map((_, i) => K.lerp(2, 8, Math.min(1, i / n * 1.6)) * (i === n ? 0.9 : 1));
    P.ribbon(pts, w, col);
    for (let i = 3; i < n - 1; i += 2) P.circle(pts[i][0], pts[i][1] + 1, w[i] * 0.4, pat, { ry: w[i] * 0.3 });
    if (o.rattle) for (let i = 0; i < 4; i++) P.circle(-60 - i * 3, 4 + Math.sin(t * 40) * 1.5, 2.4 - i * 0.3, '#e8d4a8');
    const h = pts[n]; A_.blob(h[0] + 5, h[1] + 1, 8, 5, col, 3); Cast.profileFace(t, h[0] + 6, h[1] + 2.5, 3.2, { mood: 'smile', seed: 8, mouth: [1.3, -0.9], nose: false });
    if (Math.sin(t * 3) > 0.6) P.ribbon([[h[0] + 12, h[1]], [h[0] + 17, h[1] - 0.5], [h[0] + 19, h[1] + 1]], 0.8, '#e23a4a');
  });
};
Animals.croc = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#5aa04a', dir = o.dir ?? 1;
  P.at(x, y, 0, s * dir, s, () => {
    P.ribbon([[-90, 6], [-50, 10], [0, 12], [40, 11], [70, 8], [95, 6]], [2, 10, 16, 16, 12, 9], col);
    for (let i = 0; i < 9; i++) P.poly([[-60 + i * 12, 16], [-56 + i * 12, 21], [-52 + i * 12, 16]], A_.dark(col, 0.2));
    for (const lx of [-20, 30]) P.ribbon([[lx, 6], [lx + 6, 0]], 5, A_.dark(col, 0.15));
    P.ribbon([[70, 3], [95, 3]], 1.2, '#f6f4ee'); A_.blob(52, 18, 7, 6, col, 2); Cast.profileFace(t, 53, 18, 4, { mood: 'smile', seed: 3, mouth: [6, -3], nose: false });
  });
};
Animals.frog = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#6fbf4a', hop = o.hop ? Math.max(0, Math.sin(K.clamp((t - o.hop) / 0.6) * Math.PI)) * 30 : 0;
  P.at(x, y + hop, 0, s * (o.dir ?? 1), s, () => {
    P.blob(-6, 6, 12, 7, A_.dark(col, 0.2), { seed: 2 }); A_.blob(0, 12, 16, 12, col, 3); P.blob(3, 9, 10, 6, A_.light(col, 0.5), { seed: 4 });
    for (const k of [-5, 6]) { P.circle(k, 24, 5, col); P.circle(k + 1, 25, 3, '#ffffff'); P.circle(k + 1.5, 25, 1.7, '#1a1a1a'); }
    P.ribbon([[-3, 14], [3, 12.5], [9, 14]], 1, '#2a3a1a'); P.blob(10, 2, 6, 2.2, col, { seed: 6 });
  });
};
Animals.trilobite = function (t, x, y, s, o = {}) {   // a Cambrian trilobite, top-down-ish side view crawling along y = 0
  const col = o.col ?? '#8a7a6a', dir = o.dir ?? 1, walk = o.walk ?? 1;
  P.at(x, y, 0, s * dir, s, () => {
    for (let i = 0; i < 7; i++) { const lx = -14 + i * 4.5; P.ribbon([[lx, 3], [lx + Math.sin(t * 12 + i) * 2 * walk, 0]], 1, A_.dark(col, 0.3)); }
    P.blob(0, 6, 22, 7, A_.dark(col, 0.15), { seed: 2 }); A_.blob(2, 7, 20, 6, col, 3);
    for (let i = 0; i < 8; i++) P.ribbon([[-14 + i * 3.6, 3], [-14 + i * 3.6 + 1, 11.5]], 1, A_.dark(col, 0.25));
    P.blob(16, 7, 8, 5.5, A_.light(col, 0.12), { seed: 4 }); P.ribbon([[22, 10], [30, 15 + Math.sin(t * 3) * 1.5]], 0.8, A_.dark(col, 0.3));
    P.circle(18, 9.5, 1.6, '#1a1612'); P.circle(17.6, 10, 0.5, '#ffffff');
  });
};
Animals.butterfly = function (t, x, y, s, o = {}) {
  const c1 = o.col ?? '#4f9be8', c2 = o.col2 ?? '#2f6fc0', f = Math.abs(Math.sin(t * 10 + (o.seed ?? 0)));
  P.at(x, y, Math.sin(t * 2) * 0.1, s, s, () => {
    for (const k of [-1, 1]) { P.at(0, 0, 0, k * (0.3 + 0.7 * f), 1, () => { P.blob(11, 5, 12, 11, c1, { seed: 2, n: 10, w: 0.08 }); P.blob(8, -7, 8, 7, c2, { seed: 3 }); P.circle(14, 8, 2.8, 'rgba(255,255,255,0.85)'); P.circle(9, -7, 1.8, 'rgba(255,255,255,0.7)'); }); }
    P.blob(0, 0, 2.2, 9, '#2a2228', { seed: 1 }); for (const k of [-1, 1]) P.ribbon([[0, 8], [k * 4, 15], [k * 6, 16]], 0.7, '#2a2228');
  });
};
Animals.bee = function (t, x, y, s, o = {}) {
  const f = Math.sin(t * 40);
  P.at(x, y + Math.sin(t * 6) * 2, 0, s * (o.dir ?? 1), s, () => {
    for (const k of [0, 1]) P.blob(-1 + k * 4, 7 + f * 1.5, 5, 3, 'rgba(230,245,255,0.75)', { seed: k });
    A_.blob(0, 0, 9, 6.5, '#f6c23a', 2); P.clip(() => P.trace(P.blobPts(0, 0, 9, 6.5, 9, 0.15, 2)), () => { for (const sx of [-5, 0]) P.rect(sx - 1.5, -8, 3, 16, '#2a2228'); });
    P.poly([[-9, 0], [-13, -1], [-9, -2]], '#2a2228'); Cast.profileFace(t, 5, 1, 2.5, { mood: 'smile', seed: 3, mouth: [1.2, -1.0], nose: false });
  });
};
Animals.ladybug = function (t, x, y, s, o = {}) {
  P.at(x, y, 0, s * (o.dir ?? 1), s, () => {
    for (let i = 0; i < 3; i++) P.ribbon([[-4 + i * 4, 2], [-5 + i * 4 + Math.sin(t * 14 + i) * 1.5, 0]], 0.8, '#2a2228');
    P.circle(6, 4, 3.6, '#2a2228'); A_.blob(0, 5, 8, 5.5, '#e33a3a', 3);
    for (const [sx, sy] of [[-3, 6], [1, 7.5], [3, 4], [-4, 3]]) P.circle(sx, sy, 1.2, '#2a2228'); P.circle(7.5, 5, 0.8, '#ffffff');
  });
};
Animals.snail = function (t, x, y, s, o = {}) {
  P.at(x, y, 0, s * (o.dir ?? 1), s, () => {
    P.ribbon([[-12, 1.5], [12, 1.5], [16, 6]], [3, 3.5, 3], '#d9b8a0'); for (const k of [0, 1]) P.ribbon([[14 + k * 2, 6], [16 + k * 3, 12 + Math.sin(t * 2 + k)]], 0.8, '#d9b8a0');
    A_.blob(-1, 10, 9, 9, '#e8a050', 2); P.ctx.save(); P.ctx.strokeStyle = '#b8702a'; P.ctx.lineWidth = 1.4; P.ctx.beginPath(); for (let a = 0; a < 12; a += 0.2) { const r = 8 - a * 0.6; P.ctx.lineTo(-1 + Math.cos(a) * r, 10 + Math.sin(a) * r); } P.ctx.stroke(); P.ctx.restore();
  });
};
Animals.octopus = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#f29ab8';
  P.at(x, y, 0, s, s, () => {
    for (let i = 0; i < 6; i++) { const bx = -12 + i * 4.8, w = Math.sin(t * 3 + i) * 5; P.ribbon([[bx, 0], [bx + w, -12], [bx - w * 0.6 + (i - 2.5) * 3, -24], [bx + (i - 2.5) * 5, -28]], [4, 3.4, 2.4, 1.2], A_.dark(col, i % 2 ? 0.08 : 0)); }
    A_.blob(0, 8, 16, 15, col, 3); Cast.face(t, 0, 4, 18, { mood: o.mood ?? 'happy', seed: 6 });
  });
};
Animals.starfish = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#f2a23a'; const pts = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 15; pts.push([x + Math.cos(a) * r * s, y + Math.sin(a) * r * s]); }
  P.smooth(pts, col, { tension: 0.25 }); for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * 2 * Math.PI / 5; P.circle(x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 1.2 * s, A_.light(col, 0.5)); }
};
Animals.seal = function (t, x, y, s, o = {}) {
  const col = o.col ?? '#6a86a8';
  P.at(x, y, 0, s * (o.dir ?? 1), s, () => {
    P.ribbon([[-36, 4], [-18, 8], [0, 12], [16, 18], [24, 28]], [6, 14, 18, 15, 12], col); P.poly([[-36, 4], [-46, 10], [-44, 0]], A_.dark(col, 0.2));
    P.blob(4, 4, 12, 4, A_.light(col, 0.3), { seed: 2 }); P.ribbon([[8, 8], [16, 1]], 5, A_.dark(col, 0.2));
    A_.blob(28, 30, 11, 9, col, 3); Cast.profileFace(t, 30, 32, 5, { mood: 'happy', seed: 5, mouth: [1.6, -1.3], nose: [2.2, -0.3] });
  });
};
