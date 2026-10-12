
// =====================================================================
//  CHANNEL KIT — the shared 16:9 explainer layout: a cut-paper scene on the left (x 0..~990), an explainer card on
//  the right (x 1010..1870), the year or step tagged on the card's top edge. Timeline from a scene list; every scene
//  boundary is a torn-paper iris morph unless marked as a hard cut; a gentle drift camera on the scene.
//  A piece defines SCN = [{ key, d (seconds), scene(), card(c), tag, focus: [x, y], bg: '#hex', say: 'narration', cut }]
//  and HIT (the payoff time) before including this file.
// =====================================================================
// ---- the timeline from the scene list
let __t = 0;
SCN.forEach((s) => { s.t0 = __t; __t += s.d; s.t1 = __t; });
const DURATION = __t;
const NFRAMES = Math.round(DURATION * FPS);
const LOOP_T = NFRAMES / FPS;
const NARR = SCN.filter((s) => s.say).map((s) => [s.key, +(s.t0 + (s.sayAt ?? 0.6)).toFixed(2), +(s.t1 - (s.sayEnd ?? 0.6)).toFixed(2), s.say]);
const ERA_LIST = SCN.map((s, i) => [s.t0, s.t1, () => { CUR = i; s.scene(); drawCard(i); }]);
let CUR = 0;
const S0 = () => SCN[CUR].t0;            // the current scene's start: cue times inside a scene are S0() + seconds
const at = (d) => S0() + d;
const TIMELINE = {
  width: W, height: H, fps: FPS, bpm: BPM, duration: DURATION, frames: NFRAMES, loop: LOOP_T, safe: SAFE, aspect: '16:9',
  format: 'morph-chain',
  shots: SCN.map((s, i) => ({ id: i + 1, key: s.key, era: i, t0: s.t0, t1: s.t1, title: s.key })),
  cuts: SCN.filter((s) => s.cut).map((s) => s.t0),
  morphs: SCN.slice(1).filter((s) => !s.cut).map((s) => s.t0),
  cues: { hit: HIT }, acts: ACTS, board: [],
  narration: NARR.map(([id, t0, t1, text]) => ({ id, t0, t1, text })),
};
window.TIMELINE = TIMELINE;

// ---- the card
const CARD_X = 1010, CARD_Y = 60, CARD_W = 860, CARD_H = 960, CL = CARD_X + 60, CR = CARD_X + CARD_W - 60, CCX = CARD_X + CARD_W / 2;
function drawCard(i) {
  const s = SCN[i]; if (!s.card) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(CCX, CARD_Y + CARD_H / 2); ctx.rotate(i % 2 ? 0.006 : -0.006); ctx.translate(-CCX, -(CARD_Y + CARD_H / 2));
  cut(rect(CARD_X, CARD_Y, CARD_W, CARD_H, 6), s.cardFill ?? PAL.paper, { key: 'card' + i, sb: 22, sy: 10, tear: 1.6, pat: pat.lines('rgba(90,130,190,0.16)', 56, 150) });
  cut(rect(CCX - 60, CARD_Y - 18, 120, 40, 2), 'rgba(240,230,190,0.8)', { key: 'cardtape' + i, shadow: false, grain: 0.3, shade: false });
  if (s.tag) { const k = popS(s.t0 + 0.3); if (k > 0) tag(s.tag, CL + (handW(s.tag, 60) + 54) / 2 - 10, CARD_Y + 8, 60, { s: k, rot: -0.03, fill: PAL.yellow, tape: false }); }
  s.card(at);
  ctx.restore();
}
// ---- card helpers (screen coords)
const write = (str, x, y, size, t, o = {}) => handText(str, x, y, size, o.color ?? PAL.ink, { key: o.key ?? str + x + y, frac: ev(t, o.d ?? Math.min(1.2, 0.04 * str.length + 0.3)), weight: o.weight });
function popAt(t, x, y, fn, sc = 1) { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k * sc, k * sc); fn(); ctx.restore(); }
function title(str, t) { write(str, CL, CARD_Y + 130, 62, t, { weight: 700 }); ink([[CL, CARD_Y + 158], [CL + Math.min(740, handW(str, 62, 700)), CARD_Y + 154]], { w: 5, color: PAL.orangeD, frac: ev(t + 0.4, 0.5), key: 'ul' + str }); }
function bigNum(str, sub, x, y, t, color = PAL.orangeD, size = 96) { popAt(t, x, y, () => { handText(str, -handW(str, size, 700) / 2, 0, size, color, { key: 'bn' + str, weight: 700 }); if (sub) handText(sub, -handW(sub, 40) / 2, 58, 40, PAL.ink, { key: 'bs' + sub }); }); }
function arrow(x1, y1, x2, y2, t, color = PAL.ink, key = 'ar', w = 6) {
  const f = ev(t, 0.5); if (f <= 0) return;
  const ex = lerp(x1, x2, f), ey = lerp(y1, y2, f), a = Math.atan2(y2 - y1, x2 - x1);
  ink([[x1, y1], [ex, ey]], { w, color, key: key + 'l' });
  if (f > 0.9) ink([[ex - Math.cos(a - 0.5) * 24, ey - Math.sin(a - 0.5) * 24], [ex, ey], [ex - Math.cos(a + 0.5) * 24, ey - Math.sin(a + 0.5) * 24]], { w, color, key: key + 'h' });
}
function bubble(str, x, y, size, t, fill, o = {}) {
  popAt(t, x, y, () => { const w = handW(str, size) + size * 1.1, h = size * 1.7; cut(rect(-w / 2, -h / 2, w, h, h / 2), fill, { key: 'bb' + str, sb: 6 }); cut([[o.left ? -w / 2 + 30 : w / 2 - 50, h / 2 - 6], [o.left ? -w / 2 + 10 : w / 2 - 20, h / 2 + 26], [o.left ? -w / 2 + 60 : w / 2 - 80, h / 2 - 6]], fill, { key: 'bt' + str, sb: 3 }); handText(str, -w / 2 + size * 0.55, size * 0.36, size, o.color ?? PAL.ink, { key: 'bx' + str }); });
}
const check = (x, y, t, key) => { const f = ev(t, 0.3); if (f > 0) ink([[x, y], [x + 16, y + 18], [x + 44, y - 20]], { w: 8, color: PAL.green, frac: f, key }); };
function box(x, y, w, h, c, key, o = {}) { return cut(rect(x - w / 2, y - h / 2, w, h, o.r ?? 8), c, { key, sb: o.sb ?? 6, pat: o.pat, line: o.line, lw: o.lw }); }
// ---- scene helpers
function wallC(c, p, key = 'wall') { cut(rect(-30, -30, W + 60, H + 60, 0), c, { key: key + c, shadow: false, tear: 0, pat: p, grain: 0.8, shade: false }); }
function floorC(y0, c, key = 'floor', p) { cut([[-40, y0], [W + 40, y0], [W + 40, H + 40], [-40, H + 40]], c, { key, sy: -5, pat: p }); }
function starsC(key, n = 120, y1 = H) { const R = RNG('st', key); for (let i = 0; i < n; i++) { const x = R.r(0, 1000), y = R.r(0, y1), s = R.r(1.2, 3.4), tw = 0.55 + 0.45 * Math.sin(TT * R.r(0.8, 2.5) + i); if (s > 3) sparkle(x, y, s * 2.2 * tw, '#fff6dc'); else { ctx.fillStyle = `rgba(255,246,220,${0.35 + 0.6 * tw})`; ctx.fillRect(x, y, s, s); } } }
function glowC(x, y, r, color, al = 0.35) { for (let i = 4; i >= 1; i--) { ctx.fillStyle = color; ctx.globalAlpha = al * 0.22 * (5 - i) / 4; ctx.beginPath(); ctx.arc(x, y, r * (1 + i * 0.22), 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
const sm = (t, a, b) => EZ.io(clamp((t - a) / (b - a)));

// ---- cameras and bridges: a slow drift on the scene's focus; a torn-paper iris between scenes
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
