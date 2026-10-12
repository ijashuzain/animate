
// =====================================================================
//  CHANNEL KIT — the shared 16:9 explainer layout, for ANY engine style (it needs only engine/animate/kit/core.js).
//    left  (x 0..~990): the scene, drawn with the piece's style kit (cut-paper, riso, math, pixel, isometric, ...)
//    right (x 1010..1870): the explainer card: a paper sheet, the year/step tag on its top edge, diagrams and numbers
//  The piece's src/script.js defines, before this file:
//    SCN  = [{ key, d, scene(), card(at) | null, tag, focus: [x, y], bg: '#hex', say, sayAt?, sayEnd?, mood, sfx, cut? }]
//    HIT  = the payoff time (a hard cut after a 'silence' scene), ACTS = review acts, SCORE = { motif: [...] } (optional)
//  Card helpers are prefixed or channel-specific so they never collide with a style kit's names.
// =====================================================================
// ---- the timeline from the scene list
let __t = 0;
SCN.forEach((s) => { s.t0 = __t; __t += s.d; s.t1 = __t; });
const DURATION = __t;
const NFRAMES = Math.round(DURATION * FPS);
const LOOP_T = NFRAMES / FPS;
// the voice window: from sayAt (default 0.4s) after the scene starts to sayEnd (default 0.5s) before it ends
const NARR = SCN.filter((s) => s.say).map((s) => [s.key, +(s.t0 + (s.sayAt ?? 0.4)).toFixed(2), +(s.t1 - (s.sayEnd ?? 0.5)).toFixed(2), s.say]);
const ERA_LIST = SCN.map((s, i) => [s.t0, s.t1, () => { CUR = i; s.scene(); drawCard(i); }]);
let CUR = 0;
const S0 = () => SCN[CUR].t0;
const at = (d) => S0() + d;
const TIMELINE = {
  width: W, height: H, fps: FPS, bpm: BPM, duration: DURATION, frames: NFRAMES, loop: LOOP_T, safe: SAFE, aspect: '16:9',
  format: 'morph-chain',
  shots: SCN.map((s, i) => ({ id: i + 1, key: s.key, era: i, t0: s.t0, t1: s.t1, title: s.key })),
  cuts: SCN.filter((s) => s.cut).map((s) => s.t0),
  morphs: SCN.slice(1).filter((s) => !s.cut).map((s) => s.t0),
  cues: { hit: HIT }, acts: typeof ACTS !== 'undefined' ? ACTS : [], board: [],
  narration: NARR.map(([id, t0, t1, text]) => ({ id, t0, t1, text })),
  scenes: SCN.map((s) => ({ key: s.key, t0: s.t0, t1: s.t1, tag: s.tag ?? null, say: s.say ?? null, mood: s.mood ?? null })),
  meta: typeof META !== 'undefined' ? META : null,
  thumb: typeof THUMB !== 'undefined' ? THUMB : null,
};
window.TIMELINE = TIMELINE;

// ---- the channel's own paper primitives (core.js only)
const CH = { paper: '#fbf6ea', ink: '#2a1d18', accent: '#c4542e', accentL: '#ec7a4f', tag: '#f6cf55', green: '#3d7c46', blue: '#2a58c8', line: 'rgba(90,130,190,0.16)', tape: 'rgba(240,230,190,0.85)' };
function chShape(P, fill, o = {}) {   // a paper shape: a slightly wobbly, torn edge, a soft shadow, a little grain
  const key = o.key ?? 'chs', Q0 = wobble(P, true, o.amt ?? 0.8, key, 6), R = RNG('chtorn', key), n = Q0.length, tear = o.tear ?? 1.2;
  const Q = Q0.map((p, i) => { const a = Q0[(i + 1) % n], b = Q0[(i - 1 + n) % n], nx = a[1] - b[1], ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1, j = R.n(tear); return [p[0] + nx / l * j, p[1] + ny / l * j]; });
  ctx.save();
  if (o.shadow !== false) { ctx.shadowColor = 'rgba(35,20,10,0.28)'; ctx.shadowBlur = o.sb ?? 12; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = o.sy ?? 7; }
  trace(Q, true); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
  if (o.lines || o.grain !== false) {
    ctx.save(); trace(Q, true); ctx.clip(); const bb = bbox(Q, 2);
    if (o.lines) { ctx.strokeStyle = o.lines; ctx.lineWidth = 2; ctx.beginPath(); for (let y = bb.y0 + (o.lineY0 ?? 150); y < bb.y1; y += o.lineGap ?? 56) { ctx.moveTo(bb.x0, y); ctx.lineTo(bb.x1, y); } ctx.stroke(); }
    if (o.grain !== false) { const nn = Math.min(2500, Math.floor((bb.x1 - bb.x0) * (bb.y1 - bb.y0) / 260)); stipple(bb, { key: key + 'g1', c: 'rgba(255,255,255,0.28)', n: nn, s: 1.5, jit: 0.3 }); stipple(bb, { key: key + 'g2', c: 'rgba(50,30,15,0.08)', n: nn, s: 1.5, jit: 0.3 }); }
    ctx.restore();
  }
  if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = o.lw ?? 3; ctx.lineJoin = 'round'; trace(Q, true); ctx.stroke(); }
  return Q;
}
function chText(str, x, y, size, color = CH.ink, o = {}) {   // hand lettering, written on with frac
  ctx.save();
  const R = RNG('cht', o.key ?? str, B);
  ctx.translate(x + R.n(0.6), y + R.n(0.6)); ctx.rotate((o.rot ?? 0) + R.n(0.005));
  ctx.font = `${o.weight ?? 400} ${size}px ${HAND}`; ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac > 0) { if (frac < 1) { ctx.beginPath(); ctx.rect(-4, -size * 1.2, w * frac + 4, size * 1.7); ctx.clip(); } ctx.fillText(str, 0, 0); }
  ctx.restore();
  return w;
}
function chTextW(str, size, weight = 400) { ctx.save(); ctx.font = `${weight} ${size}px ${HAND}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }
function chTag(str, x, y, size, o = {}) {   // a torn paper tag with lettering (and tape)
  const s = o.s ?? 1; if (s <= 0.01) return;
  const w = chTextW(str, size, o.weight ?? 400) + size * 0.9, h = size * 1.45;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.03); ctx.scale(s, s);
  chShape(rrectPts(-w / 2, -h / 2, w, h, 3), o.fill ?? CH.paper, { key: 'chtag' + str, tear: 1.5, grain: false });
  if (o.tape) chShape(rrectPts(-34, -h / 2 - 16, 68, 30, 2), CH.tape, { key: 'chtape' + str, shadow: false, grain: false, tear: 0.6 });
  chText(str, -w / 2 + size * 0.45, size * 0.36, size, o.color ?? CH.ink, { key: 'chtagt' + str, frac: o.frac, weight: o.weight });
  ctx.restore();
}
const chDot = (x, y, r, c = CH.ink) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

// ---- the card
const CARD_X = 1010, CARD_Y = 60, CARD_W = 860, CARD_H = 960, CL = CARD_X + 60, CR = CARD_X + CARD_W - 60, CCX = CARD_X + CARD_W / 2;
function drawCard(i) {
  const s = SCN[i]; if (!s.card) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(CCX, CARD_Y + CARD_H / 2); ctx.rotate(i % 2 ? 0.006 : -0.006); ctx.translate(-CCX, -(CARD_Y + CARD_H / 2));
  chShape(rrectPts(CARD_X, CARD_Y, CARD_W, CARD_H, 6), s.cardFill ?? CH.paper, { key: 'card' + i, sb: 22, sy: 10, tear: 1.6, lines: CH.line });
  chShape(rrectPts(CCX - 60, CARD_Y - 18, 120, 40, 2), CH.tape, { key: 'cardtape' + i, shadow: false, grain: false, tear: 0.6 });
  if (s.tag) { const k = popS(s.t0 + 0.3); if (k > 0) chTag(s.tag, CL + (chTextW(s.tag, 60) + 54) / 2 - 10, CARD_Y + 8, 60, { s: k, rot: -0.03, fill: CH.tag }); }
  s.card(at);
  ctx.restore();
}
// ---- card helpers (screen coords)
const write = (str, x, y, size, t, o = {}) => chText(str, x, y, size, o.color ?? CH.ink, { key: o.key ?? str + x + y, frac: ev(t, o.d ?? Math.min(1.2, 0.04 * str.length + 0.3)), weight: o.weight });
function popAt(t, x, y, fn, sc = 1) { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k * sc, k * sc); fn(); ctx.restore(); }
function title(str, t) { write(str, CL, CARD_Y + 130, 62, t, { weight: 700 }); ink([[CL, CARD_Y + 158], [CL + Math.min(740, chTextW(str, 62, 700)), CARD_Y + 154]], { w: 5, color: CH.accent, frac: ev(t + 0.4, 0.5), key: 'ul' + str }); }
function bigNum(str, sub, x, y, t, color = CH.accent, size = 96) { popAt(t, x, y, () => { chText(str, -chTextW(str, size, 700) / 2, 0, size, color, { key: 'bn' + str, weight: 700 }); if (sub) chText(sub, -chTextW(sub, 40) / 2, 58, 40, CH.ink, { key: 'bs' + sub }); }); }
function arrow(x1, y1, x2, y2, t, color = CH.ink, key = 'ar', w = 6) {
  const f = ev(t, 0.5); if (f <= 0) return;
  const ex = lerp(x1, x2, f), ey = lerp(y1, y2, f), a = Math.atan2(y2 - y1, x2 - x1);
  ink([[x1, y1], [ex, ey]], { w, color, key: key + 'l' });
  if (f > 0.9) ink([[ex - Math.cos(a - 0.5) * 24, ey - Math.sin(a - 0.5) * 24], [ex, ey], [ex - Math.cos(a + 0.5) * 24, ey - Math.sin(a + 0.5) * 24]], { w, color, key: key + 'h' });
}
function bubble(str, x, y, size, t, fill = CH.paper, o = {}) {
  popAt(t, x, y, () => { const w = chTextW(str, size) + size * 1.1, h = size * 1.7; chShape(rrectPts(-w / 2, -h / 2, w, h, h / 2), fill, { key: 'bb' + str, sb: 6, grain: false }); chShape([[o.left ? -w / 2 + 30 : w / 2 - 50, h / 2 - 6], [o.left ? -w / 2 + 10 : w / 2 - 20, h / 2 + 26], [o.left ? -w / 2 + 60 : w / 2 - 80, h / 2 - 6]], fill, { key: 'bt' + str, sb: 3, grain: false }); chText(str, -w / 2 + size * 0.55, size * 0.36, size, o.color ?? CH.ink, { key: 'bx' + str }); });
}
const check = (x, y, t, key) => { const f = ev(t, 0.3); if (f > 0) ink([[x, y], [x + 16, y + 18], [x + 44, y - 20]], { w: 8, color: CH.green, frac: f, key }); };
function cbox(x, y, w, h, c, key, o = {}) { return chShape(rrectPts(x - w / 2, y - h / 2, w, h, o.r ?? 8), c, { key, sb: o.sb ?? 6, grain: false, line: o.line, lw: o.lw }); }
// ---- scene helpers that work in any style (styles may of course use their own kit instead)
function wallC(c, p, key = 'wall') { ctx.save(); ctx.setTransform(ctx.getTransform()); ctx.fillStyle = c; ctx.fillRect(-60, -60, W + 120, H + 120); if (p) p({ x0: -30, y0: -30, x1: W + 30, y1: H + 30 }); ctx.restore(); }
function floorC(y0, c, key = 'floor', p) { chShape([[-40, y0], [W + 40, y0], [W + 40, H + 40], [-40, H + 40]], c, { key, sy: -5, tear: 1.2 }); if (p) { ctx.save(); ctx.beginPath(); ctx.rect(-40, y0, W + 80, H - y0 + 40); ctx.clip(); p({ x0: -40, y0, x1: W + 40, y1: H + 40 }); ctx.restore(); } }
function starsC(key, n = 120, y1 = H) { const R = RNG('st', key); for (let i = 0; i < n; i++) { const x = R.r(0, 1000), y = R.r(0, y1), s = R.r(1.2, 3.4), tw = 0.55 + 0.45 * Math.sin(TT * R.r(0.8, 2.5) + i); if (s > 3) star4(x, y, s * 2.2 * tw, '#fff6dc'); else { ctx.fillStyle = `rgba(255,246,220,${0.35 + 0.6 * tw})`; ctx.fillRect(x, y, s, s); } } }
function glowC(x, y, r, color, al = 0.35) { for (let i = 4; i >= 1; i--) { ctx.fillStyle = color; ctx.globalAlpha = al * 0.22 * (5 - i) / 4; ctx.beginPath(); ctx.arc(x, y, r * (1 + i * 0.22), 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
const sm = (t, a, b) => EZ.io(clamp((t - a) / (b - a)));
const typed = (str, t, cps = 14) => Math.floor(clamp((TT - t) * cps / str.length) * str.length);

// ---- cameras and bridges: a slow drift on the scene's focus; a torn-paper iris (the style's STYLE.window) between scenes
const ERA_BG = SCN.map((s) => s.bg);
function pieceCam(era, t) {
  const s = SCN[era]; if (s.cam) { const c = s.cam(t); if (c) return c; }
  const u = clamp((t - s.t0) / Math.max(1, s.t1 - s.t0)), z = 1 + 0.035 * Math.sin(u * Math.PI), f = s.focus ?? [500, 540];
  return camOf({ z, p: f, to: f });
}
const BRIDGES = SCN.slice(1).map((s, k) => {
  if (s.cut) return null;
  const A = SCN[k], r = 200;
  return { tc: s.t0, A: () => (A.bridgeA ? A.bridgeA() : { P: ellipsePts(A.focus[0], A.focus[1], r, r, 0, 64), c: A.bg }), B: () => (s.bridgeB ? s.bridgeB() : { P: ellipsePts(s.focus[0], s.focus[1], r, r, 0, 64), c: s.bg }) };
}).filter(Boolean);
