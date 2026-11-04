// kit/folk.js: people with natural proportions, drawn in profile walking (after the user's reference, films/skin/refs/t1-walk.png):
// about 7.5 heads tall, a profile face (brow, nose, lips, chin, almond eye with iris and lid, ear), hair masses, beards,
// clothing (hide tunic with a ragged fur-trimmed hem, or a fur parka with a hood), a backpack bundle, a spear, a baby on the
// back. Lit from one side with a warm rim on the lit edge. Screen space (px), deterministic.
//   Folk.walker(ctx, t, x, y, H, o)   x, y = between the feet on the ground; H = height in px; o:
//     dir (1 faces right), skin, hair, hairStyle ('short' | 'long' | 'curly' | 'bun'), beard, cloth ('hide' | 'parka'),
//     clothCol, trim, pack, spear, baby, kid, phase (walk phase offset), speed, walk (0 = standing), light ('left' | 'right'),
//     rim (rim-light colour), mood ('calm' | 'smile')
const Folk = {};
Folk.mix = (a, b, u) => P.mixc(a, b, K.clamp(u));
Folk.SKIN = ['#5a3420', '#6e4128', '#8a5434', '#a86a44', '#c48a5e', '#d8a47a', '#ecc29e', '#f6d6bc'];

// a tapered limb from a to b with widths w0 -> w1, a shaded underside and a rim on the lit side
Folk.limb = (ctx, a, b, w0, w1, col, rim, lightDir) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const pts = [[a[0] + nx * w0 / 2, a[1] + ny * w0 / 2], [b[0] + nx * w1 / 2, b[1] + ny * w1 / 2], [b[0] - nx * w1 / 2, b[1] - ny * w1 / 2], [a[0] - nx * w0 / 2, a[1] - ny * w0 / 2]];
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.arc(b[0], b[1], w1 / 2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), lightDir < 0); ctx.lineTo(...pts[3]); ctx.arc(a[0], a[1], w0 / 2, Math.atan2(-ny, -nx), Math.atan2(ny, nx), lightDir < 0); ctx.fill();
  if (rim) { const s = Math.sign(nx * lightDir || 1); ctx.strokeStyle = rim; ctx.lineWidth = Math.max(1, w0 * 0.14); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0] + s * nx * w0 * 0.36, a[1] + s * ny * w0 * 0.36); ctx.lineTo(b[0] + s * nx * w1 * 0.36, b[1] + s * ny * w1 * 0.36); ctx.stroke(); }
};
// the profile head, facing +x, centre (0, 0), radius R (cranium); returns nothing
Folk.head = (ctx, t, R, o) => {
  const skin = o.skin, shade = Folk.mix(skin, '#2a1010', 0.28), lit = Folk.mix(skin, '#fff0d8', 0.22), hair = o.hair ?? '#1e1410';
  // hair behind the head (long hair / bun back)
  if (o.hairStyle === 'long') { ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-0.2 * R, -0.95 * R); ctx.bezierCurveTo(-1.3 * R, -0.6 * R, -1.25 * R, 1.2 * R, -0.75 * R, 2.3 * R + Math.sin(t * 3) * 0.08 * R); ctx.bezierCurveTo(-0.45 * R, 2.1 * R, -0.35 * R, 1.2 * R, -0.2 * R, 0.6 * R); ctx.fill(); }
  // neck
  ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(-0.32 * R, 0.55 * R); ctx.lineTo(0.3 * R, 0.6 * R); ctx.lineTo(0.28 * R, 1.35 * R); ctx.lineTo(-0.36 * R, 1.35 * R); ctx.fill();
  // cranium + face profile in one shape
  const g = ctx.createLinearGradient(-R, 0, R, 0); g.addColorStop(0, o.light < 0 ? lit : shade); g.addColorStop(0.55, skin); g.addColorStop(1, o.light < 0 ? skin : lit);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-0.05 * R, -0.12 * R, 0.92 * R, Math.PI * 0.62, Math.PI * 1.82);
  const F = [[0.62, -0.78], [0.82, -0.42], [0.86, -0.24], [0.92, -0.12], [1.1, 0.14], [1.06, 0.2], [0.9, 0.24], [0.93, 0.36], [0.87, 0.42], [0.92, 0.5], [0.84, 0.62], [0.78, 0.76], [0.52, 0.86], [0.25, 0.82], [-0.2, 0.6]];
  for (const [fx, fy] of F) ctx.lineTo(fx * R, fy * R); ctx.closePath(); ctx.fill();
  // ear, cheek warmth
  ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(-0.05 * R, 0.1 * R, 0.13 * R, 0.2 * R, 0.1, 0, 7); ctx.fill();
  ctx.fillStyle = Folk.mix(skin, '#ff7a6a', 0.25); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.ellipse(0.55 * R, 0.3 * R, 0.2 * R, 0.13 * R, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  // eye: almond white, iris looking ahead, upper lid; brow
  const ex = 0.62 * R, ey = -0.1 * R, bl = Cast.blink(t, o.seed ?? 0);
  ctx.fillStyle = '#f6efe6'; ctx.beginPath(); ctx.moveTo(ex - 0.15 * R, ey); ctx.quadraticCurveTo(ex, ey - 0.13 * R * (1 - bl), ex + 0.16 * R, ey + 0.01 * R); ctx.quadraticCurveTo(ex, ey + 0.08 * R * (1 - bl), ex - 0.15 * R, ey); ctx.fill();
  if (bl < 0.6) { ctx.fillStyle = '#3a2214'; ctx.beginPath(); ctx.arc(ex + 0.07 * R, ey + 0.005 * R, 0.065 * R, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(ex + 0.09 * R, ey - 0.02 * R, 0.02 * R, 0, 7); ctx.fill(); }
  ctx.strokeStyle = Folk.mix(skin, '#1a0a06', 0.6); ctx.lineWidth = Math.max(1, 0.035 * R); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ex - 0.16 * R, ey - 0.01 * R); ctx.quadraticCurveTo(ex, ey - 0.14 * R * (1 - bl) - 0.01 * R, ex + 0.16 * R, ey); ctx.stroke();
  ctx.strokeStyle = hair; ctx.lineWidth = Math.max(1.5, 0.07 * R); ctx.beginPath(); ctx.moveTo(ex - 0.18 * R, ey - 0.2 * R); ctx.quadraticCurveTo(ex + 0.02 * R, ey - 0.3 * R, ex + 0.2 * R, ey - 0.2 * R); ctx.stroke();
  // mouth line (a slight smile if asked)
  ctx.strokeStyle = Folk.mix(skin, '#5a1a14', 0.55); ctx.lineWidth = Math.max(1, 0.03 * R); ctx.beginPath(); ctx.moveTo(0.78 * R, 0.43 * R); ctx.quadraticCurveTo(0.84 * R, (o.mood === 'smile' ? 0.47 : 0.44) * R, 0.9 * R, 0.42 * R); ctx.stroke();
  // beard
  if (o.beard) { ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-0.15 * R, 0.25 * R); ctx.quadraticCurveTo(0.3 * R, 0.35 * R, 0.62 * R, 0.5 * R); ctx.lineTo(0.95 * R, 0.5 * R); ctx.quadraticCurveTo(1.0 * R, 0.85 * R, 0.7 * R, 1.08 * R); ctx.quadraticCurveTo(0.2 * R, 1.12 * R, -0.25 * R, 0.62 * R); ctx.fill();
    ctx.fillStyle = Folk.mix(skin, '#5a1a14', 0.3); ctx.beginPath(); ctx.ellipse(0.86 * R, 0.43 * R, 0.07 * R, 0.025 * R, 0, 0, 7); ctx.fill(); }
  // hair on top
  ctx.fillStyle = hair; const st = o.hairStyle ?? 'short';
  ctx.beginPath(); ctx.moveTo(0.7 * R, -0.62 * R);
  if (st === 'curly') { for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.85 - i * 0.11), rr = 1.02 * R + Math.sin(i * 2.3) * 0.1 * R; ctx.lineTo(-0.08 * R + Math.cos(a) * rr, -0.15 * R + Math.sin(a) * rr); } ctx.lineTo(-0.5 * R, 0.25 * R); ctx.lineTo(-0.25 * R, 0.15 * R); }
  else { ctx.bezierCurveTo(0.5 * R, -1.2 * R, -0.7 * R, -1.25 * R, -0.95 * R, -0.4 * R); ctx.bezierCurveTo(-1.02 * R, -0.05 * R, -0.85 * R, 0.4 * R, -0.55 * R, 0.5 * R); ctx.lineTo(-0.3 * R, 0.1 * R); ctx.quadraticCurveTo(-0.15 * R, -0.35 * R, 0.25 * R, -0.5 * R); }
  ctx.closePath(); ctx.fill();
  if (st === 'bun') { ctx.beginPath(); ctx.arc(-0.75 * R, -0.75 * R, 0.32 * R, 0, 7); ctx.fill(); }
  ctx.strokeStyle = Folk.mix(hair, '#ffffff', 0.22); ctx.lineWidth = Math.max(1, 0.05 * R); ctx.beginPath(); ctx.arc(-0.05 * R, -0.15 * R, 0.8 * R, Math.PI * 1.25, Math.PI * 1.6); ctx.stroke();
};

// a smooth limb: a polyline stroked thick with round joins; on the lit side a thin warm rim shows round its edge
Folk.stroke = (ctx, pts, w, col, rim, lx) => {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = (dx) => { ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px + dx, py) : ctx.moveTo(px + dx, py))); };
  if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = w; path(lx * w * 0.07); ctx.stroke(); }
  ctx.strokeStyle = col; ctx.lineWidth = w; path(0); ctx.stroke();
  ctx.strokeStyle = 'rgba(30,8,4,0.22)'; ctx.lineWidth = w * 0.42; path(-lx * w * 0.24); ctx.stroke();   // volume: shade on the side away from the light
};
Folk.walker = (ctx, t, x, y, H, o = {}) => {
  const dir = o.dir ?? 1, kid = o.kid ?? false, skin = o.skin ?? Folk.SKIN[2], walk = o.walk ?? 1, sp = o.speed ?? 5.2, p = t * sp + (o.phase ?? 0);
  const lx = o.light === 'left' ? -1 : 1, rim = o.rim ?? 'rgba(255,214,150,0.45)', far = Folk.mix(skin, '#1a0806', 0.3);
  const cloth = o.cloth ?? 'hide', ccol = o.clothCol ?? (cloth === 'parka' ? '#7a5640' : '#8a5a34'), trim = o.trim ?? (cloth === 'parka' ? '#efe6d8' : '#e2d0b0');
  const hu = H / (kid ? 6.0 : 7.3), R = hu * (kid ? 0.56 : 0.5), bob = Math.abs(Math.sin(p)) * hu * 0.07 * walk;
  const hip = [0, -H * 0.49 + bob], shY = -H * (kid ? 0.75 : 0.8) + bob, L1 = H * (kid ? 0.215 : 0.235), L2 = H * (kid ? 0.215 : 0.235), A1 = H * 0.165, A2 = H * 0.155;
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  ctx.fillStyle = 'rgba(40,20,10,0.22)'; ctx.beginPath(); ctx.ellipse(hu * 0.2, 0, H * 0.17, H * 0.022, 0, 0, 7); ctx.fill();
  const parka = cloth === 'parka', coatC = (near) => Folk.mix(ccol, '#120806', near ? 0 : 0.28);
  const leg = (ph, near) => { const th = Math.sin(ph) * 0.42 * walk, kn = Math.max(0, Math.sin(ph + 1.3)) * 0.85 * walk;
    const k = [hip[0] + Math.sin(th) * L1, hip[1] + Math.cos(th) * L1], a = [k[0] + Math.sin(th - kn) * L2, k[1] + Math.cos(th - kn) * L2];
    const col = near ? skin : far, boot = parka ? Folk.mix('#4a3428', '#000', near ? 0 : 0.3) : col;
    Folk.stroke(ctx, [hip, k], hu * (kid ? 0.6 : 0.66), parka ? coatC(near) : col, near ? rim : null, lx);
    Folk.stroke(ctx, [k, a], hu * (kid ? 0.42 : 0.46), parka ? boot : col, near ? rim : null, lx);
    const fa = Math.max(-0.35, Math.min(0.5, (th - kn) * 0.7)), toe = [a[0] + Math.cos(fa) * hu * 0.7, a[1] + Math.sin(fa) * hu * 0.12 + hu * 0.12];
    Folk.stroke(ctx, [[a[0] - hu * 0.12, a[1] + hu * 0.08], toe], hu * (parka ? 0.36 : 0.26), boot, near ? rim : null, lx); };
  const arm = (ph, near, hold) => { const s = [hu * 0.08, shY + hu * 0.32]; let a1, a2;
    if (hold) { a1 = -0.45; a2 = -1.25; } else { a1 = -Math.sin(ph) * 0.42 * walk + 0.04; a2 = -0.18 - Math.max(0, Math.sin(ph)) * 0.45 * walk; }
    const e = [s[0] + Math.sin(-a1) * A1, s[1] + Math.cos(a1) * A1], h = [e[0] + Math.sin(-a2) * A2, e[1] + Math.cos(a2) * A2];
    const col = near ? skin : far;
    Folk.stroke(ctx, [s, e], hu * (parka ? 0.6 : kid ? 0.4 : 0.46), parka ? coatC(near) : col, near ? rim : null, lx);
    Folk.stroke(ctx, [e, h], hu * (parka ? 0.52 : kid ? 0.34 : 0.38), parka ? coatC(near) : col, near ? rim : null, lx);
    ctx.fillStyle = parka ? Folk.mix('#4a3428', '#000', near ? 0 : 0.3) : col; ctx.beginPath(); ctx.ellipse(h[0] + Math.sin(-a2) * hu * 0.12, h[1] + Math.cos(a2) * hu * 0.12, hu * 0.17, hu * 0.22, -a2, 0, 7); ctx.fill(); return h; };
  // far side
  arm(p + Math.PI, false, false); leg(p + Math.PI, false);
  // what is carried on the back
  if (o.pack) { const bx = -hu * 0.72, by = shY + hu * 1.15, g = ctx.createLinearGradient(bx - hu, 0, bx + hu, 0); g.addColorStop(0, '#5a3e28'); g.addColorStop(1, '#7a5638');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, by, hu * 0.7, hu * 1.05, 0.12, 0, 7); ctx.fill();
    ctx.fillStyle = '#ece0cc'; ctx.beginPath(); ctx.ellipse(bx + hu * 0.1, by - hu * 1.05, hu * 0.62, hu * 0.32, 0.12, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(160,130,100,0.6)'; ctx.beginPath(); ctx.ellipse(bx + hu * 0.1, by - hu * 1.05, hu * 0.62, hu * 0.08, 0.12, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3a2416'; ctx.lineWidth = hu * 0.08; ctx.beginPath(); ctx.moveTo(bx - hu * 0.6, by); ctx.quadraticCurveTo(bx, by + hu * 0.15, bx + hu * 0.65, by - hu * 0.1); ctx.stroke(); }
  if (o.baby) { const bx = -hu * 0.62, by = shY + hu * 0.95; ctx.fillStyle = '#e8d8c0'; ctx.beginPath(); ctx.ellipse(bx, by, hu * 0.62, hu * 0.9, 0.15, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(bx + hu * 0.05, by - hu * 0.95); Folk.head(ctx, t, hu * 0.36, { skin, hair: o.hair, hairStyle: 'short', seed: 9, light: lx, mood: 'smile' }); ctx.restore(); }
  // torso: shoulders, chest, waist, hips as one smooth shape
  const tw = hu * (kid ? 0.82 : 1.0), T = (px, py) => [px * tw, py];
  const tor = [T(0.05, shY - hu * 0.15), T(0.5, shY + hu * 0.05), T(0.72, shY + hu * 0.65), T(0.55, hip[1] - hu * 0.9), T(0.62, hip[1] + hu * 0.1), T(-0.62, hip[1] + hu * 0.1), T(-0.5, hip[1] - hu * 0.9), T(-0.68, shY + hu * 0.6), T(-0.42, shY + hu * 0.02)];
  const tg = ctx.createLinearGradient(-tw, 0, tw, 0); tg.addColorStop(0, lx > 0 ? far : Folk.mix(skin, '#fff0d8', 0.12)); tg.addColorStop(0.55, skin); tg.addColorStop(1, lx > 0 ? Folk.mix(skin, '#fff0d8', 0.12) : far);
  const torso = (fill) => { ctx.beginPath(); ctx.moveTo(...tor[0]); for (let i = 1; i <= tor.length; i++) { const a = tor[i % tor.length], b = tor[(i + 1) % tor.length]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } ctx.fillStyle = fill; ctx.fill(); };
  ctx.save(); ctx.translate(lx * hu * 0.06, 0); torso(rim); ctx.restore(); torso(parka ? coatC(true) : tg);
  leg(p, true);   // the near leg goes under the clothing
  if (!parka) {
    // a hide wrap from the waist (or the chest, for women) to mid-thigh, flaring, soft scalloped fur-trimmed hem
    const top = o.hairStyle === 'long' && !kid ? shY + hu * 0.45 : hip[1] - hu * 0.75, hem = hip[1] + hu * (kid ? 1.0 : 1.25), sw = Math.sin(p) * hu * 0.12 * walk;
    const gc = ctx.createLinearGradient(0, top, 0, hem); gc.addColorStop(0, Folk.mix(ccol, '#fff0d8', 0.15)); gc.addColorStop(1, Folk.mix(ccol, '#2a1408', 0.3)); ctx.fillStyle = gc;
    ctx.beginPath(); ctx.moveTo(-tw * 0.62, top); ctx.quadraticCurveTo(0, top - hu * 0.15, tw * 0.66, top + hu * 0.05); ctx.quadraticCurveTo(tw * 0.58, (top + hem) / 2, tw * 0.82 + sw, hem);
    for (let i = 0; i <= 6; i++) { const xx = tw * 0.82 + sw - i * (tw * 1.55) / 6; ctx.quadraticCurveTo(xx + tw * 0.13, hem + hu * 0.2, xx, hem + (i % 2 ? hu * 0.05 : 0)); }
    ctx.quadraticCurveTo(-tw * 0.6, (top + hem) / 2, -tw * 0.62, top); ctx.fill();
    ctx.fillStyle = trim; for (let i = 0; i < 6; i++) { const xx = tw * 0.7 + sw - i * tw * 0.27; ctx.beginPath(); ctx.ellipse(xx, hem + hu * 0.08, hu * 0.16, hu * 0.1, 0.3, 0, 7); ctx.fill(); }
    ctx.strokeStyle = Folk.mix(ccol, '#1a0a04', 0.45); ctx.lineWidth = hu * 0.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-tw * 0.6, hip[1] - hu * 0.55); ctx.quadraticCurveTo(0, hip[1] - hu * 0.45, tw * 0.65, hip[1] - hu * 0.55); ctx.stroke();
    if (!kid && o.hairStyle !== 'long') { ctx.lineWidth = hu * 0.14; ctx.strokeStyle = Folk.mix(ccol, '#1a0a04', 0.3); ctx.beginPath(); ctx.moveTo(-tw * 0.4, shY + hu * 0.05); ctx.lineTo(tw * 0.55, hip[1] - hu * 0.8); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,240,215,0.25)'; ctx.lineWidth = hu * 0.06; ctx.beginPath(); ctx.moveTo(tw * 0.5, top + hu * 0.3); ctx.quadraticCurveTo(tw * 0.62, (top + hem) / 2, tw * 0.7, hem - hu * 0.1); ctx.stroke();
  } else { ctx.fillStyle = trim; ctx.beginPath(); ctx.roundRect(-tw * 0.75, hip[1] + hu * 0.75, tw * 1.55, hu * 0.32, hu * 0.16); ctx.fill(); ctx.fillStyle = coatC(true); ctx.beginPath(); ctx.moveTo(-tw * 0.7, hip[1]); ctx.lineTo(tw * 0.75, hip[1]); ctx.lineTo(tw * 0.8, hip[1] + hu * 0.8); ctx.lineTo(-tw * 0.72, hip[1] + hu * 0.8); ctx.fill(); }
  // near arm (over the clothing)
  const hand = arm(p, true, !!o.spear);
  if (o.spear) { ctx.strokeStyle = '#5a3a20'; ctx.lineWidth = hu * 0.11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hand[0] - hu * 0.5, hand[1] + hu * 3.0); ctx.lineTo(hand[0] + hu * 0.75, hand[1] - hu * 4.4); ctx.stroke();
    ctx.fillStyle = '#9a948a'; ctx.beginPath(); ctx.moveTo(hand[0] + hu * 0.82, hand[1] - hu * 4.3); ctx.lineTo(hand[0] + hu * 1.1, hand[1] - hu * 5.3); ctx.lineTo(hand[0] + hu * 0.6, hand[1] - hu * 4.45); ctx.fill(); }
  // head on a short neck; parkas get a fur ruff framing the face
  ctx.save(); ctx.translate(hu * 0.15, shY - hu * 0.62);
  if (parka) { ctx.fillStyle = coatC(true); ctx.beginPath(); ctx.arc(-R * 0.15, -R * 0.05, R * 1.42, 0, 7); ctx.fill(); }
  Folk.head(ctx, t, R, Object.assign({}, o, { skin, light: lx }));
  if (parka) { ctx.strokeStyle = trim; ctx.lineWidth = R * 0.42; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-R * 0.15, -R * 0.05, R * 1.25, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke(); ctx.beginPath(); ctx.arc(-R * 0.15, -R * 0.05, R * 1.25, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
  ctx.restore();
  ctx.restore();
};
