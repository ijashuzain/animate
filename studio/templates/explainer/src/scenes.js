
// =====================================================================
//  SCENES + LETTERING — the scene fills the frame in the piece's style; the explanation is written straight onto it on the
//  right (x 1070..1810) with the channel helpers. No card or notepad (the user's rule). CHANNEL sets the lettering:
const CHANNEL = { /* font: SANS, colors: { ink, accent, green, blue }, halo: 'rgba(255,255,255,0.72)' | false, tag: (str, k) => {...} */ };
//  Style-agnostic placeholders: replace with the style's own kit (cut-paper: cut/tag/face; riso: risoPrint...; etc.)
// =====================================================================
function sHook() { wallC('#26315f'); starsC('hk', 90); glowC(500, 520, 160, '#fff2c8', 0.4); hero(500, 520, 110, { mood: TT > at(2) ? 'wow' : 'smile', key: 'h1' }); }
function sStep1() { wallC('#cfe2ee'); floorC(820, '#9fb8d0', 'f1'); hero(320 + Math.sin(TT) * 40, 640, 80, { key: 'h2' }); chTag('step one', 700, 300, 50, { s: popS(at(1.5)) }); }
function sHush() { wallC('#0c1124'); starsC('hu', 60); }
function sPayoff() { wallC('#f3a3bf'); for (let i = 0; i < 40; i++) { const R = RNG('cf', i); ctx.fillStyle = ['#3f9f9a', '#f6cf55', '#8c7ad8', '#fff'][i % 4]; ctx.fillRect(R.r(0, 980), mod(R.r(0, 1080) + (TT - HIT) * 180, 1080), 16, 8); } hero(500, 540, 130, { mood: 'happy', key: 'h3' }); }
function cHook(at) { title('The question', at(0.8)); write('one line that sets it up', CL, 400, 50, at(2.0)); }
function cStep1(at) { title('Step one', at(0.8)); bigNum('42', 'a number that sticks', CCX, 420, at(2.0)); arrow(CL, 700, CR, 700, at(4.0), CH.accent, 'a1'); }
function cPayoff(at) { title('The twist', at(0.6)); bigNum('!', 'the payoff', CCX, 450, at(1.0)); }
function cEnd(at) { title('So...', at(0.6)); write('the one-line takeaway', CL, 450, 54, at(1.6), { color: CH.accent, weight: 700 }); }
