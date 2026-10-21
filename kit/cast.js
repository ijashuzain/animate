// kit/cast.js — reusable faces and people for the flat-vector look (y up, like the camera).
// Cast.face(x, y, s, o): eyes with lids and highlights, brows, mouth and blush; s = face width in world units.
//   o: mood 'smile' | 'happy' | 'wow' | 'sleep' | 'worried' | 'sly', look [-1..1, -1..1], blink seed, ink colour
// Cast.person(t, x, s, o): a rounded kid/adult rig standing at (x, 0), s = height in world units.
//   o: pose 'stand' | 'wave' | 'point' | 'cheer' | 'walk', look [wx, wy] (a world point the head turns to), mood,
//   skin, hair, shirt, pants, shoes, dir (1 faces right, -1 left), kid (bigger head) , seed
const Cast = {};
Cast.blink = (t, seed = 0) => { const u = (t * 0.31 + K.hash(seed, 77)) % 1; return u < 0.035 ? 1 - Math.abs(u / 0.0175 - 1) : 0; };
Cast.face = (t, x, y, s, o = {}) => {
  const mood = o.mood ?? 'smile', look = o.look ?? [0, 0], ink = o.ink ?? '#26160f', k = s / 40, bl = Cast.blink(t, o.seed ?? 0);
  P.at(x, y, 0, k, k, () => {
    const open = mood === 'sleep' ? 0 : Math.max(0, (mood === 'wow' ? 1.15 : mood === 'happy' ? 0.75 : 1) - bl);
    for (const ex of [-10, 10]) {
      if (open < 0.12) { P.ribbon([[ex - 5, 1], [ex, mood === 'happy' ? 3.5 : -1.5], [ex + 5, 1]], 1.8, ink); continue; }
      const r = 6.2 * (mood === 'wow' ? 1.15 : 1);
      P.clip(() => { P.ctx.beginPath(); P.ctx.ellipse(ex, 0, r, r * 1.2 * open, 0, 0, Math.PI * 2); }, () => {
        P.circle(ex, 0, r, '#fffdf6', { ry: r * 1.25 });
        const px = ex + look[0] * r * 0.4, py = look[1] * r * 0.45; P.circle(px, py, r * 0.56, ink); P.circle(px - r * 0.2, py + r * 0.24, r * 0.2, '#fff'); P.circle(px + r * 0.18, py - r * 0.2, r * 0.08, 'rgba(255,255,255,0.7)');
        P.rect(ex - r, r * 0.6 * open, r * 2, r, 'rgba(0,0,0,0.08)');
      });
    }
    // brows
    const by = mood === 'wow' ? 13 : mood === 'worried' ? 10 : 10.5, tilt = mood === 'worried' ? 2.2 : mood === 'sly' ? -2 : mood === 'wow' ? -0.5 : 0;
    if (mood !== 'sleep') for (const s2 of [-1, 1]) P.ribbon([[s2 * 14.5, by - tilt * (s2 > 0 ? 1 : 1) * 0.5], [s2 * 6, by + tilt * 0.6]], 1.9, ink);
    // mouth
    if (mood === 'wow') { P.circle(0, -12, 3.6, '#5a1f1f', { ry: 4.6 }); P.circle(0, -14.2, 2.2, '#d9696b', { ry: 1.4 }); }
    else if (mood === 'sleep') P.ribbon([[-2.5, -11], [0, -12.2], [2.5, -11]], 1.5, ink);
    else if (mood === 'worried') P.ribbon([[-4, -13], [0, -11.4], [4, -13]], 1.7, ink);
    else { const w = mood === 'happy' ? 6.5 : 5; P.clip(() => { P.ctx.beginPath(); P.ctx.ellipse(0, -9.5, w, w * 0.8, 0, Math.PI, Math.PI * 2); }, () => { P.rect(-w, -18, w * 2, 9, '#6b2228'); P.circle(0, -15.5, w * 0.55, '#e0767a', { ry: 2.6 }); }); }
    // blush
    for (const s2 of [-1, 1]) P.circle(s2 * 15, -6, 3.6, 'rgba(255,110,120,0.28)', { ry: 2.2 });
  });
};
Cast.person = (t, x, s, o = {}) => {
  const k = s / 100, pose = o.pose ?? 'stand', dir = o.dir ?? 1, kid = o.kid ?? true, seed = o.seed ?? 0;
  const skin = o.skin ?? '#f2c29b', hair = o.hair ?? '#3a2a22', shirt = o.shirt ?? '#ff7b54', pants = o.pants ?? '#34427e', shoes = o.shoes ?? '#2a2a3a';
  const headY = kid ? 80 : 86, headR = kid ? 17 : 13, hip = kid ? 36 : 46, sh = kid ? 62 : 72;
  const walk = pose === 'walk' ? Math.sin(t * 9 + seed) : 0, bob = pose === 'walk' ? Math.abs(Math.cos(t * 9 + seed)) * 2 : Math.sin(t * 2 + seed) * 0.6;
  P.at(x, 0, 0, k * dir, k, () => {
    P.circle(0, 0.5, 22, 'rgba(0,0,0,0.16)', { ry: 3.5 });
    // legs and shoes
    for (const sgn of [-1, 1]) { const sw = walk * sgn * 9; P.ribbon([[sgn * 7, hip + bob], [sgn * 7 + sw * 0.5, hip * 0.5 + bob], [sgn * 7 + sw, 5]], [11, 10, 9.5], pants); P.lit(P.blobPts(sgn * 7 + sw + 3, 4, 8, 4.4, 10, 0.05, sgn + 3), shoes, { d: 0.25, rim: 'rgba(255,255,255,0.2)' }); }
    // torso
    const tp = [[-15, hip - 2 + bob], [15, hip - 2 + bob], [16, sh + bob], [9, sh + 4 + bob], [-9, sh + 4 + bob], [-16, sh + bob]];
    P.lit(tp, P.lin(0, hip, 0, sh, P.mixc(shirt, '#000000', 0.12), shirt), { d: 0.18, rim: 'rgba(255,255,255,0.25)' });
    // arms: angles per pose (shoulder, elbow), front arm drawn last
    const wave = Math.sin(t * 10 + seed) * 0.45, A = {
      stand: [[0.2, -0.15], [0.2, -0.15]], wave: [[0.2, -0.15], [2.35, -0.35 + wave * 0.7]], point: [[0.2, -0.15], [1.45, 0.05]],
      cheer: [[2.6 + wave * 0.3, 0.4], [2.6 + wave * 0.3, 0.4]], walk: [[0.2 + walk * 0.35, -0.1], [0.2 - walk * 0.35, -0.1]],
    }[pose] ?? [[0.2, -0.15], [0.2, -0.15]];
    for (const [i, sgn] of [[0, -1], [1, 1]]) {
      // y is up: -PI/2 points down; a1 swings the upper arm outward, a2 bends the forearm further
      const [a1, a2] = A[i], len = kid ? 16 : 20, s0 = [sgn * 14, sh + bob];
      const th1 = -Math.PI / 2 + sgn * a1, th2 = th1 + sgn * a2;
      const e = [s0[0] + Math.cos(th1) * len, s0[1] + Math.sin(th1) * len], h = [e[0] + Math.cos(th2) * len, e[1] + Math.sin(th2) * len];
      P.ribbon([s0, e, h], [9, 8, 7.5], P.mixc(shirt, '#000000', i ? 0 : 0.1)); P.circle(h[0], h[1], 5, skin);
    }
    // head turns toward the look point
    let tilt = 0; if (o.look) { const a = Math.atan2(o.look[1] - (headY * k), (o.look[0] - x) * dir); tilt = K.clamp((a - Math.PI / 2) * -0.45, -0.5, 0.5) * -1; }
    P.at(0, headY + bob, tilt, 1, 1, () => {
      P.circle(-headR * 0.98, -1, headR * 0.26, skin); P.circle(headR * 0.98, -1, headR * 0.26, skin);
      P.lit(P.blobPts(0, 0, headR, headR * 1.04, 12, 0.02, 5), skin, { d: 0.14, shade: 'rgba(120,50,30,0.16)', rim: 'rgba(255,240,220,0.4)' });
      P.smooth([[-headR * 1.04, headR * 0.15], [-headR * 0.9, headR * 0.8], [0, headR * 1.2], [headR * 0.9, headR * 0.8], [headR * 1.04, headR * 0.15], [headR * 0.5, headR * 0.55], [-headR * 0.2, headR * 0.45]], hair);
      P.smooth([[-headR * 0.2, headR * 1.05], [headR * 0.15, headR * 1.45], [headR * 0.3, headR * 1.0]], hair);
      const lk = o.look ? [K.clamp((o.look[0] - x) * dir, -1, 1) * 0.6, K.clamp(o.look[1] - headY * k, -1, 1) * 0.8] : [0.2, 0];
      Cast.face(t, headR * 0.08, -headR * 0.12, headR * 1.15, { mood: o.mood ?? 'happy', look: lk, seed });
    });
  });
};
// Cast.profileFace(t, x, y, s, o): a side-view face for animals (the flat "cute dino" look): one eye with a highlight
// (blinks), a thin smile toward the snout, a nostril, a little blush. Faces +x; s = eye diameter in world units.
//   o: mood 'smile' | 'happy' (eye closes to an arc) | 'wow' (bigger eye, round mouth) | 'sleep'; mouth [x, y] (relative, in eye
//   units) where the smile sits; nose [x, y]; look -1..1 (pupil forward/back); ink, blush
Cast.profileFace = (t, x, y, s, o = {}) => {
  const mood = o.mood ?? 'smile', ink = o.ink ?? '#1e1a14', k = s / 20, bl = Cast.blink(t, o.seed ?? 0), m = o.mouth ?? [3.2, -1.6], nz = o.nose ?? [4.6, 0.6];
  P.at(x, y, 0, k, k, () => {
    const r = mood === 'wow' ? 11.5 : 10, open = mood === 'sleep' || mood === 'happy' ? 0 : 1 - bl;
    if (open > 0.15) {
      P.circle(0, 0, r, '#fffdf6', { ry: r * open });
      P.circle(2.5 + (o.look ?? 0.6) * 2.5, -0.5, r * 0.55, ink, { ry: r * 0.6 * open });
      P.circle(1.2 + (o.look ?? 0.6) * 2.5, 2.5, r * 0.2, '#ffffff');
    } else P.ribbon([[-r * 0.8, mood === 'happy' ? -1 : 1], [0, mood === 'happy' ? 3 : -1.5], [r * 0.8, mood === 'happy' ? -1 : 1]], 2.2, ink);
    if (mood === 'wow') P.circle(m[0] * 20 + 6, m[1] * 20, 4.5, '#5a2424', { ry: 5.5 });
    else P.ribbon([[m[0] * 20 - 12, m[1] * 20 + 2], [m[0] * 20 - 2, m[1] * 20 - 2.5], [m[0] * 20 + 8, m[1] * 20 + 1.5]], 2.2, ink);
    P.circle(nz[0] * 20, nz[1] * 20, 2.6, ink, { ry: 1.8 });
    P.circle(m[0] * 20 - 16, m[1] * 20 + 8, 6, o.blush ?? 'rgba(255,120,120,0.3)', { ry: 4 });
  });
};
