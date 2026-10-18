// =====================================================================
//  SCENES — the SOFT look (styles/flat + CHANNEL.look = 'soft'; the user's preferred direction, see LEARNINGS "Soft look").
//  No outlines, one hue family per scene (sky, hills and trees are tints of each other), the hero in a warm colour that
//  contrasts with that family, Headspace-like fBlob characters with noodle limbs, layered hills in parallax.
//  Lettering on the right (x 1070..1810); keep every mover at x < 1000. A visible beat (pop, entrance, hop) every ~3 s.
//  Pick fonts per topic (studio/fonts/README.md); the reference build is videos/firefly-glow (later archive/firefly-glow).
// =====================================================================
const CHANNEL = { look: 'soft', font: '"Quicksand", sans-serif', weight: 700, titleFont: '"Baloo 2", sans-serif', titleWeight: 800, labelFont: '"Patrick Hand", sans-serif',
  halo: 'rgba(255,248,236,0.8)', haloDark: 'rgba(24,22,60,0.6)', inkDark: '#f4f1ff',
  colors: { ink: '#2b2347', accent: '#ffcf5a', green: '#c6f27a', blue: '#9ec8ff' },
  tag: (str, k) => { const w = fTextW(str, 40, 800, { font: '"Baloo 2", sans-serif' }) + 48; ctx.save(); ctx.translate(CL + w / 2, 104); ctx.scale(k, k); fRect(-w / 2, -30, w, 60, 30, '#ffcf5a', { line: false }); fText(str, 0, 14, 40, '#2b2347', { align: 'center', outline: false, font: '"Baloo 2", sans-serif' }); ctx.restore(); } };
// one palette per mood: tints of one hue; HERO is the warm contrast
const NIGHT = { sky0: '#1d1b47', sky1: '#3b3878', hill1: '#34326c', hill2: '#2c2a60', tree: '#403e82', tree2: '#2f2d68' };
const DAY = { sky0: '#bfe3f2', sky1: '#eef8fb', hill1: '#9fd3b0', hill2: '#7fbf98', tree: '#5fa67e', tree2: '#4d8f6c' };
const HERO = '#ff8f5e';
function land(P) {
  fSky(P.sky0, P.sky1);
  fLayer(0.1, () => fCloud2(260, 200, 1, { speed: 8, c: fTint(P.sky1, 0.4) }));
  fHills([{ y: 700, c: P.hill1, amp: 50, f: 0.005, ph: 1, d: 0.12 }]);
  fLayer(0.25, () => { fTreeRound(160, 720, 0.9, { c: P.tree }); fCone(300, 710, 0.9, P.tree2); fTreeRound(820, 700, 1.0, { c: P.tree }); });
  fHills([{ y: 860, c: P.hill2, amp: 30, f: 0.008, ph: 3, d: 0.5 }]);
}
function sHook() { land(NIGHT); fGlow(480, 640, 200, 0.7); fBlob(480, 820, { key: 'h1', w: 150, h: 190, body: 'bean', c: HERO, mood: TT > at(2) ? 'happy' : 'smile', pose: TT > at(2) ? 'wave' : 'stand', hop: at(2) }); }
function sStep1() { land(DAY); const u = sm(TT, at(0.5), at(4)); fBlob(lerp(120, 460, u), 840, { key: 'h2', w: 130, h: 170, body: 'pill', c: HERO, pose: u < 1 ? 'walk' : 'point', walk: u < 1 ? 1 : 0 }); fLabel('a pointing label', 600, 300, 470, 640, at(5)); }
function sHush() { fSky('#0c1124', '#1d1b47'); }
function sPayoff() { land(DAY); fLeaves(18, ['#ff8f5e', '#ffcf5a', '#e2553b'], { key: 'pay' }); fBlob(480, 820, { key: 'h3', w: 160, h: 200, body: 'bean', c: HERO, mood: 'happy', pose: 'cheer', hop: HIT + 0.3 }); }
function cHook(at) { title('The question', at(0.8)); write('one line that sets it up', CL, 400, 50, at(2.0)); }
function cStep1(at) { title('Step one', at(0.8)); bigNum('42', 'a number that sticks', CCX, 420, at(2.0)); arrow(CL, 700, CR, 700, at(4.0), CH.accent, 'a1'); }
function cPayoff(at) { title('The twist', at(0.6)); bigNum('!', 'the payoff', CCX, 450, at(1.0)); }
function cEnd(at) { title('So...', at(0.6)); write('the one-line takeaway', CL, 450, 54, at(1.6), { color: CH.accent, weight: 700 }); }
