
// =====================================================================
//  CARDS — the 16:9 layout. tableau(e) draws the original 9:16 scene on the left (its time warped to the era);
//  card(e) draws the explainer card on the right in screen space (camera pushes on the tableau leave it still).
// =====================================================================
function tableau(e) {
  const T = TT, E = E0;
  TT = oldT(e, TT); E0 = OLD[e][0];
  ctx.save(); ctx.transform(TK, 0, 0, TK, TX, TY);
  SCENE[e]();
  ctx.restore();
  TT = T; E0 = E;
}
// ---- card helpers (screen coords; the card spans x 1010..1870, y 60..1020)
const CARD_X = 1010, CARD_Y = 60, CARD_W = 860, CARD_H = 960, CL = CARD_X + 60, CR = CARD_X + CARD_W - 60;
function cardBase(e, c = PAL.paper) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(CARD_X + CARD_W / 2, CARD_Y + CARD_H / 2); ctx.rotate(e % 2 ? 0.006 : -0.006); ctx.translate(-(CARD_X + CARD_W / 2), -(CARD_Y + CARD_H / 2));
  cut(rect(CARD_X, CARD_Y, CARD_W, CARD_H, 6), c, { key: 'card' + e, sb: 22, sy: 10, tear: 1.6, pat: pat.lines('rgba(90,130,190,0.16)', 56, 150) });
  cut(rect(CARD_X + CARD_W / 2 - 60, CARD_Y - 18, 120, 40, 2), 'rgba(240,230,190,0.8)', { key: 'cardtape' + e, shadow: false, grain: 0.3, shade: false });
}
const cardEnd = () => ctx.restore();
const write = (str, x, y, size, t, o = {}) => handText(str, x, y, size, o.color ?? PAL.ink, { key: o.key ?? str + x + y, frac: ev(t, o.d ?? Math.min(1.2, 0.04 * str.length + 0.3)), weight: o.weight });
function popAt(t, x, y, fn) { const k = popS(t); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); fn(); ctx.restore(); }
function title(str, t) { write(str, CL, CARD_Y + 120, 64, t, { weight: 700 }); ink([[CL, CARD_Y + 150], [CL + Math.min(720, handW(str, 64, 700)), CARD_Y + 146]], { w: 5, color: PAL.orangeD, frac: ev(t + 0.4, 0.5), key: 'ul' + str }); }
function bigNum(str, sub, x, y, t, color = PAL.orangeD) { popAt(t, x, y, () => { handText(str, -handW(str, 96, 700) / 2, 0, 96, color, { key: 'bn' + str, weight: 700 }); if (sub) handText(sub, -handW(sub, 40) / 2, 56, 40, PAL.ink, { key: 'bs' + sub }); }); }
function arrow(x1, y1, x2, y2, t, color = PAL.ink, key = 'ar') {
  const f = ev(t, 0.5); if (f <= 0) return;
  const ex = lerp(x1, x2, f), ey = lerp(y1, y2, f), a = Math.atan2(y2 - y1, x2 - x1);
  ink([[x1, y1], [ex, ey]], { w: 6, color, key: key + 'l' });
  if (f > 0.9) ink([[ex - Math.cos(a - 0.5) * 24, ey - Math.sin(a - 0.5) * 24], [ex, ey], [ex - Math.cos(a + 0.5) * 24, ey - Math.sin(a + 0.5) * 24]], { w: 6, color, key: key + 'h' });
}
function bubble(str, x, y, size, t, fill, o = {}) {
  popAt(t, x, y, () => { const w = handW(str, size) + size * 1.1, h = size * 1.7; cut(rect(-w / 2, -h / 2, w, h, h / 2), fill, { key: 'bb' + str, sb: 6 }); cut([[o.left ? -w / 2 + 30 : w / 2 - 50, h / 2 - 6], [o.left ? -w / 2 + 10 : w / 2 - 20, h / 2 + 26], [o.left ? -w / 2 + 60 : w / 2 - 80, h / 2 - 6]], fill, { key: 'bt' + str, sb: 3 }); handText(str, -w / 2 + size * 0.55, size * 0.36, size, o.color ?? PAL.ink, { key: 'bx' + str }); });
}
const check = (x, y, t, key) => { const f = ev(t, 0.3); if (f > 0) ink([[x, y], [x + 16, y + 18], [x + 44, y - 20]], { w: 8, color: PAL.green, frac: f, key }); };

// ---- one card per era
function card(e) {
  const A = NEW[e][0], c = (d) => A + d, cx = CARD_X + CARD_W / 2;
  if (e === 11) return;                   // the hush: the empty chat box fills the moment; no card
  cardBase(e);
  if (e === 0 || e === 14) {
    if (e === 0) {
      title('The Imitation Game', c(0.8));
      // a judge types to two hidden players: a person and a machine
      popAt(c(2.0), CL + 120, 520, () => { person(0, 80, 0.75, { mood: 'focus', shirt: PAL.teal, skin: PAL.skin1 }); });
      popAt(c(2.6), cx + 30, 470, () => { cut(rect(-26, -240, 52, 480, 4), PAL.purple, { key: 'curtain', pat: pat.stripes('rgba(255,255,255,0.2)', 8, 26, Math.PI / 2) }); });
      popAt(c(3.2), CR - 120, 360, () => { person(0, 60, 0.55, { mood: 'smile', shirt: PAL.blue, skin: PAL.skin2 }); });
      popAt(c(3.6), CR - 120, 620, () => { spark(0, 0, 70, { rays: 5, mood: 'smile', key: 'cardspark' }); });
      bubble('which one is the machine?', cx, 830, 40, c(5.0), '#fff3c8');
    } else {
      title('75 years', c(0.6));
      const xs = [CL + 20, CL + 160, CL + 300, CL + 440, CL + 580, CL + 720], ys = ['1950', '1958', '1986', '2012', '2017', '2025'];
      ink([[CL, 520], [CR, 520]], { w: 6, color: PAL.ink, frac: ev(c(1.0), 1.0), key: 'tl' });
      xs.forEach((x, i) => popAt(c(1.2 + i * 0.25), x, 520, () => { dot(0, 0, 14, i === 5 ? PAL.orange : PAL.ink); handText(ys[i], -44, i % 2 ? 70 : -36, 36, PAL.ink, { key: 'ty' + i }); }));
      write('from a question', CL, 720, 54, c(2.8));
      write('to a colleague.', CL, 800, 54, c(3.6), { color: PAL.orangeD });
    }
    return cardEnd();
  }
  if (e === 1) {
    title('Dartmouth, summer 1956', c(0.8));
    write('a two-month workshop', CL, 320, 48, c(2.0));
    write('ten researchers', CL, 400, 48, c(2.8));
    popAt(c(4.0), cx, 600, () => { cut(rect(-330, -70, 660, 140, 6), '#2d463b', { key: 'chalk' }); handText('ARTIFICIAL', -260, -6, 52, '#ecefe4', { key: 'ai1', weight: 700 }); handText('INTELLIGENCE', -260, 50, 52, '#ecefe4', { key: 'ai2', weight: 700 }); });
    write('the field gets its name', CL, 820, 48, c(5.2), { color: PAL.orangeD });
  } else if (e === 2) {
    title('The Perceptron', c(0.8));
    // inputs -> weighted dials -> a sum -> yes / no
    const ins = [[CL + 40, 330], [CL + 40, 470], [CL + 40, 610]];
    ins.forEach(([x, y], i) => popAt(c(1.8 + i * 0.2), x, y, () => { cut(ellipsePts(0, 0, 34, 34, 0, 20), PAL.sky, { key: 'in' + i }); }));
    ins.forEach(([x, y], i) => { ink([[x + 34, y], [cx + 20, 470]], { w: 4 + i * 3, color: PAL.ink, frac: ev(c(2.6), 0.6), key: 'w' + i }); popAt(c(3.0 + i * 0.2), lerp(x, cx + 20, 0.45), lerp(y, 470, 0.45), () => { cut(ellipsePts(0, 0, 26, 26, 0, 18), PAL.mustard, { key: 'dial' + i }); ink([[0, 0], [Math.cos(TT * 2 + i) * 20, Math.sin(TT * 2 + i) * 20]], { w: 4, color: PAL.ink, key: 'dh' + i }); }); });
    popAt(c(3.8), cx + 70, 470, () => { cut(ellipsePts(0, 0, 60, 60, 0, 24), PAL.paper, { key: 'sum', line: PAL.ink, lw: 4 }); handText('+', -16, 18, 56, PAL.ink, { key: 'plus' }); });
    arrow(cx + 140, 470, CR - 110, 470, c(4.2), PAL.ink, 'out');
    popAt(c(4.6), CR - 60, 470, () => { cut(ellipsePts(0, 0, 48, 48, 0, 20), '#79c27a', { key: 'yes' }); });
    write('wrong? turn the dials', CL, 760, 50, c(5.4));
    write('a little. try again.', CL, 840, 50, c(6.2), { color: PAL.orangeD });
  } else if (e === 3) {
    title('ELIZA', c(0.8));
    bubble('I feel sad.', CL + 200, 360, 48, c(1.8), '#e7f4ff', { left: true });
    bubble('Why do you feel sad?', CR - 260, 520, 48, c(3.0), PAL.paper);
    write('no understanding:', CL, 740, 48, c(4.4));
    write('it just flips your words', CL, 820, 48, c(5.2), { color: PAL.orangeD });
  } else if (e === 4) {
    title('The first AI winter', c(0.8));
    write('funding', CL, 280, 40, c(1.6));
    const hs = [380, 420, 450, 140, 90, 80];
    hs.forEach((h, i) => { const k = EZ.o3(ev(c(2.0 + i * 0.35), 0.4)); if (k > 0) cut(rect(CL + 40 + i * 120, 760 - h * k, 80, h * k, 4), i < 3 ? PAL.teal : PAL.sky, { key: 'bar' + i, pat: pat.stripes('rgba(255,255,255,0.25)', 6, 24, 0.6) }); });
    ink([[CL + 20, 760], [CR, 760]], { w: 5, color: PAL.ink, key: 'axis', frac: ev(c(1.8), 0.5) });
    write('promises > results', CL, 870, 52, c(5.0), { color: PAL.orangeD });
  } else if (e === 5) {
    title('Backpropagation', c(0.8));
    const L = [[CL + 60, [360, 500, 640]], [cx, [300, 430, 570, 700]], [CR - 60, [500]]];
    const flow = (t, back) => { for (let l = 0; l < 2; l++) for (const ya of L[l][1]) for (const yb of L[l + 1][1]) ink([[L[l][0], ya], [L[l + 1][0], yb]], { w: 3, color: back ? 'rgba(216,74,67,0.75)' : 'rgba(42,29,24,0.35)', frac: ev(t + (back ? (1 - l) * 0.4 : l * 0.4), 0.4), key: (back ? 'b' : 'f') + l + ya + yb }); };
    flow(c(1.6), false);
    L.forEach(([x, ys], l) => ys.forEach((y, i) => popAt(c(1.4 + l * 0.2), x, y, () => cut(ellipsePts(0, 0, 30, 30, 0, 18), l === 2 ? PAL.orange : PAL.sky, { key: 'n' + l + i }))));
    write('1 guess', CL, 830, 44, c(2.6)); write('2 measure the error', CL + 240, 830, 44, c(3.4));
    flow(c(4.2), true);
    write('3 send the blame back', CL, 900, 44, c(4.4), { color: '#b8463c' }); write('4 repeat', CL + 520, 900, 44, c(5.6));
  } else if (e === 6) {
    title('Deep Blue vs Kasparov', c(0.8));
    bigNum('200,000,000', 'positions every second', cx, 420, c(2.4));
    write('brute force search,', CL, 680, 50, c(4.0));
    write('not learning', CL, 760, 50, c(4.8), { color: PAL.orangeD });
  } else if (e === 7) {
    title('AlexNet', c(0.8));
    const lab = ['cat', 'dog', 'car', 'cup', 'cat', 'tree'];
    lab.forEach((s, i) => popAt(c(1.6 + i * 0.25), CL + 80 + (i % 3) * 250, 330 + Math.floor(i / 3) * 170, () => { cut(rect(-90, -60, 180, 120, 4), ['#cfe2ee', '#f3d6b8', '#cfdccf'][i % 3], { key: 'im' + i }); cut(rect(-60, 40, 120, 40, 3), PAL.paper, { key: 'imt' + i, shadow: false }); handText(s, -30, 72, 32, PAL.ink, { key: 'iml' + i }); }));
    write('mistakes: 26% -> 15%', CL, 700, 52, c(3.8));
    popAt(c(5.0), CL + 90, 830, () => { cut(rect(-70, -45, 140, 90, 6), '#3a3f4a', { key: 'gpu' }); for (let i = 0; i < 5; i++) cut(rect(-60 + i * 26, 46, 12, 20, 2), '#c9a24a', { key: 'pinb' + i, shadow: false }); });
    write('trained on gaming chips', CL + 200, 845, 46, c(5.2), { color: PAL.orangeD });
  } else if (e === 8) {
    title('AlphaGo', c(0.8));
    write('Go has more positions', CL, 330, 48, c(1.8));
    write('than atoms in the universe', CL, 400, 48, c(2.6));
    popAt(c(3.8), cx, 560, () => { cut(rect(-150, -80, 300, 160, 6), '#e2b878', { key: 'gob' }); for (let i = 0; i < 6; i++) dot(-110 + i * 44, (i % 2) * 40 - 20, 16, i % 2 ? '#f6f1e6' : '#2b2a2e'); });
    write('move 37: "a mistake?"', CL, 760, 50, c(5.2));
    write('no. a new idea.', CL, 840, 50, c(6.2), { color: PAL.orangeD });
  } else if (e === 9) {
    title('The Transformer', c(0.8));
    const words = ['the', 'animal', 'was', 'tired,', 'so', 'it', 'slept'], xs = []; let x = CL;
    words.forEach((w) => { xs.push(x + handW(w, 44) / 2); x += handW(w, 44) + 22; });
    words.forEach((w, i) => write(w, xs[i] - handW(w, 44) / 2, 560, 44, c(1.6 + i * 0.15)));
    // "it" attends to every word, most to "animal"
    words.forEach((w, i) => { if (i === 5) return; const f = ev(c(3.0 + i * 0.12), 0.5); if (f <= 0) return; const P = []; for (let k = 0; k <= 16; k++) { const u = k / 16; P.push([lerp(xs[5], xs[i], u), 510 - Math.sin(u * Math.PI) * (60 + Math.abs(5 - i) * 30)]); } ink(P, { w: i === 1 ? 9 : 3, color: i === 1 ? PAL.orange : 'rgba(42,29,24,0.4)', frac: f, key: 'att' + i }); });
    write('every word looks at', CL, 760, 50, c(4.6));
    write('every other word', CL, 840, 50, c(5.4), { color: PAL.orangeD });
  } else if (e === 10) {
    title('GPT-3', c(0.6));
    bigNum('175 billion', 'parameters', cx, 380, c(1.6));
    write('The cat sat on the ___', CL, 640, 50, c(3.0));
    popAt(c(4.4), CR - 120, 720, () => { cut(rect(-90, -40, 180, 80, 20), PAL.mint, { key: 'mat' }); handText('mat', -40, 16, 46, PAL.ink, { key: 'matt' }); });
    write('just predict the next word', CL, 870, 46, c(4.8), { color: PAL.orangeD });
  } else if (e === 12) {
    title('ChatGPT', c(0.6));
    bigNum('1,000,000', 'people in 5 days', cx, 420, c(1.8));
    bubble('hi!', CL + 120, 700, 60, c(3.2), '#e7f4ff', { left: true });
    bubble('Hello! How can I help?', CR - 260, 840, 44, c(4.2), PAL.paper);
  } else if (e === 13) {
    title('AI agents', c(0.8));
    write("they don't just answer:", CL, 320, 50, c(1.8));
    [['reads the code', 3.0], ['makes the changes', 4.0], ['runs the tests', 5.0]].forEach(([s, d], i) => { popAt(c(d), CL + 30, 470 + i * 130, () => cut(rect(-26, -26, 52, 52, 6), PAL.paper, { key: 'cb' + i, line: PAL.ink, lw: 4 })); write(s, CL + 100, 488 + i * 130, 52, c(d + 0.2)); check(CL + 12, 466 + i * 130, c(d + 0.8), 'ck' + i); });
    write('12 passed', CL, 900, 56, c(6.4), { color: PAL.green, weight: 700 });
  }
  cardEnd();
}
