// Why Do Humans Have Different Skin Colours? "The great walk" (the user's pick), about 4:00.
// One journey out of Africa with a UV gauge in the sky and cutaways into the skin. Shots change about every 5 s (the reference
// study: 7-10 cuts a minute); a dip to dark only where the place changes. Lines follow script-timed.md.
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const { tw, clamp, lerp } = K;
const pill = (str, x, y, u, o = {}) => { const q = Object.assign({ u, font: FONT, size: 36, weight: 700 }, o); q.size *= 1.2; P.pill(str, x, y, q); };
const shows = (t, a, b, f = 0.35) => tw(t, a, a + f) * (1 - tw(t, b - f, b));
const S = Folk.SKIN;

// people of today (the opening and the ending): many skin tones, styles, ages
const TODAY = [
  { skin: S[1], style: 'afro', hairCol: '#1a100a', shirt: '#e8a030', earrings: true, eyes: 'dark' },
  { skin: S[6], style: 'straight', hairCol: '#1e1a2a', shirt: '#4a8ad0', eyes: 'dark' },
  { skin: S[7], style: 'wavy', hairCol: '#c8501e', shirt: '#4aa86a', freckles: true, eyes: 'green' },
  { skin: S[3], style: 'turban', wrap: '#2a5ab8', hairCol: '#1a100a', beard: true, shirt: '#e88a3a' },
  { skin: S[2], style: 'curly', hairCol: '#1a100a', shirt: '#7a4ad0', eyes: 'brown' },
  { skin: S[5], style: 'hijab', wrap: '#8a3ab8', shirt: '#2a6a8a', eyes: 'brown' },
  { skin: S[0], style: 'buzz', hairCol: '#120a06', beard: true, glasses: true, shirt: '#3a7ad0' },
  { skin: S[7], style: 'straight', hairCol: '#f0d070', shirt: '#2a5ab0', eyes: 'blue' },
  { skin: S[4], style: 'bun', hairCol: '#2a1a12', shirt: '#d84a6a', eyes: 'brown', earrings: true },
];
function crowd(ctx, t, cx, cy, s, n = 9, o = {}) {
  const pos = [[-1.5, -0.55], [-0.5, -0.62], [0.5, -0.6], [1.5, -0.55], [-1.0, 0.35], [0, 0.3], [1.0, 0.35], [-2.0, 0.4], [2.0, 0.42]];
  pos.slice(0, n).map((p, i) => [p, i]).sort((a, b) => a[0][1] - b[0][1]).forEach(([[px, py], i]) => Folk.portrait(ctx, t, cx + px * s * 0.95, cy + py * s * 0.95 + Math.sin(t * 1.2 + i) * 4, s * (py > 0 ? 1.0 : 0.88), Object.assign({ seed: i, look: Math.sin(t * 0.5 + i) * 0.5 }, TODAY[i % TODAY.length], o)));
}
const skyBg = (ctx, c0, c1) => { const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); };
const family = (ctx, t, o = {}) => { const base = o.skin ?? S[1], y = o.y ?? 1010, sc = o.scale ?? 1, x0 = o.x0 ?? 0, cloth = o.cloth ?? 'hide';
  const fam = [{ x: 300, H: 360, kid: true, hairStyle: 'curly', pack: true, spear: true, phase: 0.3 }, { x: 640, H: 640, beard: true, pack: true, spear: true, phase: 1.4 }, { x: 1000, H: 590, hairStyle: 'long', baby: true, phase: 2.2, clothCol: '#9a6a3a' }, { x: 1340, H: 470, kid: true, hairStyle: 'curly', pack: true, spear: true, phase: 3.0 }, { x: 1620, H: 340, kid: true, hairStyle: 'long', phase: 3.7 }];
  for (const f of fam) { const x = x0 + f.x * sc + (o.dx ?? 0); if (o.shadow) W.longShadow(ctx, x, y, f.H * sc, o.shadow); Folk.walker(ctx, t, x + Math.sin(t * 0.7 + f.phase) * 6, y, f.H * sc, Object.assign({ dir: 1, light: o.light ?? 'right', skin: o.skins ? o.skins[fam.indexOf(f)] : base, hair: o.hair ?? '#1a100a', rim: o.rim ?? 'rgba(255,214,140,0.4)', seed: f.phase * 10, cloth, walk: o.walk ?? 1 }, f, o.extra ?? {})); } };

// ---------- shots: [start, end, draw(ctx, t, u = seconds into the shot)] ----------
const SHOTS = [
  // 1. the question
  [0, 4.2, (ctx, t) => { skyBg(ctx, '#2a3aa8', '#5a2a8a'); crowd(ctx, t, 960, 560, 230); pill('every person alive today', 960, 120, shows(t, 0.4, 4.0)); }],
  [4.2, 8.2, (ctx, t, u) => { skyBg(ctx, '#2a3aa8', '#5a2a8a'); const z = 1 - 0.55 * tw(u, 0, 4, 'inOut'); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); crowd(ctx, t, 960, 560, 230); ctx.restore();
    ctx.strokeStyle = `rgba(255,220,140,${0.6 * tw(u, 1, 3)})`; ctx.lineWidth = 4; for (let i = 0; i < 9; i++) { const x = 960 + (i - 4) * 210 * z; ctx.beginPath(); ctx.moveTo(x, 560 + 240 * z); ctx.quadraticCurveTo(x, 940, 960, 1020); ctx.stroke(); } pill('the same ancestors, in Africa', 960, 120, shows(t, 4.6, 8)); }],
  [8.2, 12, (ctx, t, u) => { W.savanna(ctx, t, u * 30, { sunX: 1300, sunY: 260 }); family(ctx, t, { scale: 0.42, x0: 560, y: 760, rim: 'rgba(255,214,140,0.5)' }); W.grassFront(ctx, t, u * 30); W.uvGauge(ctx, 250, 230, 110, tw(u, 0, 3) * 0.95, 1, FONT); pill('written in sunlight', 1300, 120, shows(t, 8.6, 11.8)); }],
  // 2. losing the fur
  [12, 18, (ctx, t, u) => { W.savanna(ctx, t, 600 + u * 60); Folk.walker(ctx, t, 900, 1020, 760, { skin: S[4], hair: '#2a1a10', beard: true, fur: 1, light: 'right', phase: 1, cloth: 'none' === 'x' ? 'hide' : 'hide', clothCol: '#6a4a2a' }); W.grassFront(ctx, t, 600 + u * 60); pill('more than a million years ago', 960, 120, shows(t, 12.4, 17.6)); }],
  [18, 24, (ctx, t, u) => { W.savanna(ctx, t, 960 + u * 60, { sunX: 1400, sunY: 220 }); const f = 1 - tw(u, 0.3, 4.5, 'inOut'); Folk.walker(ctx, t, 900, 1020, 760, { skin: S[4], hair: '#2a1a10', beard: true, fur: f, sweat: 1 - f, light: 'right', phase: 1, clothCol: '#6a4a2a' });
    ctx.globalAlpha = 0.18; for (let i = 0; i < 6; i++) { ctx.strokeStyle = '#fff4d0'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = 0; x <= 1920; x += 30) ctx[x ? 'lineTo' : 'moveTo'](x, 650 + i * 12 + Math.sin(x * 0.02 + t * 4 + i) * 4); ctx.stroke(); } ctx.globalAlpha = 1; W.grassFront(ctx, t, 960 + u * 60); pill('probably to stay cool', 960, 120, shows(t, 18.6, 23.6)); }],
  // 3. the skin darkens
  [24, 28, (ctx, t, u) => { W.savanna(ctx, t, 1300, { sunX: 960, sunY: 200 }); const sg = ctx.createRadialGradient(960, 200, 0, 960, 200, 900); sg.addColorStop(0, `rgba(255,255,230,${0.5 * tw(u, 0, 2)})`); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, 1920, 1080); W.uvGauge(ctx, 960, 560, 200, lerp(0.5, 1, tw(u, 0, 3)), 1, FONT); pill('UV: very high', 960, 700, shows(t, 25, 27.8)); }],
  [28, 32, (ctx, t, u) => { W.savanna(ctx, t, 1400 + u * 50); const sk = mixc(S[4], S[1], tw(u, 0.3, 3, 'inOut')); Folk.walker(ctx, t, 900, 1020, 760, { skin: sk, hair: '#1a100a', beard: true, light: 'right', phase: 1, clothCol: '#7a4a2a' }); W.grassFront(ctx, t, 1400 + u * 50); pill('so their skin became dark', 960, 120, shows(t, 28.4, 31.8)); }],
  // 4. inside the skin
  [32, 38, (ctx, t, u) => { const z = 2.2 - 1.2 * tw(u, 0, 3, 'inOut'); ctx.save(); ctx.translate(760, 600); ctx.scale(z, z); ctx.translate(-760, -600); W.skin(ctx, t, { dose: 0.5, cap: 0 }); ctx.restore(); pill('melanocyte', 760, 960, shows(t, 34, 37.8)); }],
  [38, 46, (ctx, t, u) => { W.skin(ctx, t, { dose: lerp(0.3, 0.9, tw(u, 0, 6)), cap: 0.15 }); pill('it makes melanin and hands it out in tiny parcels', 960, 960, shows(t, 38.6, 45.6), { size: 32 }); }],
  // 5. umbrellas over the DNA
  [46, 54, (ctx, t, u) => { W.skin(ctx, t, { dose: 0.9, cap: tw(u, 0, 4, 'inOut') }); W.uvBeams(ctx, t, 330, () => tw(u, 3, 4) > 0.5, 6, tw(u, 3, 4)); pill('an umbrella over the DNA', 1380, 300, shows(t, 49, 53.8)); }],
  // 6. what UV breaks
  [54, 60, (ctx, t, u) => { ctx.save(); ctx.translate(-600, -260); ctx.scale(1.6, 1.6); W.skin(ctx, t, { dose: 0, cap: 0 }); ctx.restore(); W.uvBeams(ctx, t, 520, null, 5); const hit = tw(u, 2.5, 3); ctx.strokeStyle = `rgba(255,255,255,${hit})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(900, 470); ctx.lineTo(930, 510); ctx.lineTo(912, 540); ctx.lineTo(945, 580); ctx.stroke(); pill('UV can damage DNA', 960, 960, shows(t, 54.6, 59.8)); }],
  [60, 66, (ctx, t, u) => { skyBg(ctx, '#8a2a6a', '#3a1a5a'); for (const [col, ph, yb] of [['#ff3a4a', 0, 560]]) { ctx.strokeStyle = col; ctx.lineWidth = 420; ctx.lineCap = 'butt'; ctx.beginPath(); for (let x = -40; x <= 1960; x += 20) ctx[x < 0 ? 'moveTo' : 'lineTo'](x, yb + Math.sin(x * 0.003 + ph) * 60); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 40; ctx.stroke(); }
    for (let i = 0; i < 6; i++) { const x = ((200 + i * 330 + u * 120) % 2100) - 90, y = 560 + Math.sin(x * 0.003) * 60 + (i % 2 ? -60 : 60); W.folate(ctx, x, y, 70, i < 3 ? tw(u, 1.5 + i * 0.6, 2.2 + i * 0.6) : 0); }
    W.uvBeams(ctx, t, 400, null, 5); pill('and breaks down folate, needed for healthy babies', 960, 960, shows(t, 60.6, 65.8), { size: 32 }); }],
  // 7. vitamin D
  [66, 71, (ctx, t, u) => { ctx.save(); ctx.translate(0, 380); W.skin(ctx, t, { dose: 0.25, cap: 1, tone: '#f8c0b0' }); ctx.restore(); ctx.fillStyle = 'rgba(20,30,110,0.55)'; ctx.fillRect(0, 0, 1920, 1080); W.uvBeams(ctx, t, 470, null, 6); W.vitaminD(ctx, t, 960, 330, 190, tw(u, 1.2, 3, 'inOut')); pill('UV also makes vitamin D', 960, 900, shows(t, 66.6, 70.8)); }],
  [71, 76, (ctx, t, u) => { skyBg(ctx, '#1a2a6a', '#3a1a5a'); const g = tw(u, 0.5, 3); ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.6); const bc = mixc('#d8d0c0', '#fff4c0', g); ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(-380, -48, 760, 96, 48); ctx.fill(); for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 400, -50, 80, 0, 7); ctx.arc(sx * 400, 50, 80, 0, 7); ctx.fill(); } ctx.restore();
    const gl = ctx.createRadialGradient(960, 540, 50, 960, 540, 600); gl.addColorStop(0, `rgba(255,230,120,${0.45 * g})`); gl.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, 1920, 1080); W.vitaminD(ctx, t, 1500, 260, 60, 1); pill('for strong bones', 960, 960, shows(t, 71.6, 75.8)); }],
  // 8. the balance
  [76, 86, (ctx, t, u) => { skyBg(ctx, '#2a3aa8', '#5a2a8a'); const tilt = Math.sin(u * 1.6) * (1 - tw(u, 6, 9)) * 0.6;
    Micro.scale(ctx, 960, 420, 420, tilt, (x, y) => { W.folate(ctx, x, y - 30, 46); }, (x, y) => { W.vitaminD(ctx, t, x, y - 40, 40, 1); });
    pill('folate', 540 - 0, 620, shows(t, 76.6, 85.6)); pill('vitamin D', 1380, 620, shows(t, 76.6, 85.6)); pill('melanin keeps the balance', 960, 960, shows(t, 79, 85.6)); }],
  // 9. leaving Africa
  [86, 92, (ctx, t, u) => { W.savanna(ctx, t, 2000 + u * 70, { sunX: 1700, sunY: 360 }); ctx.fillStyle = '#4ab0d0'; ctx.beginPath(); ctx.moveTo(1300, 610); ctx.quadraticCurveTo(1650, 590, 1920, 600); ctx.lineTo(1920, 640); ctx.lineTo(1300, 640); ctx.fill(); family(ctx, t, { scale: 0.55, x0: 300 + u * 40, y: 900 }); W.grassFront(ctx, t, 2000 + u * 70); pill('about 60,000 years ago', 960, 120, shows(t, 86.6, 91.8)); }],
  [92, 98, (ctx, t, u) => { skyBg(ctx, '#050a2a', '#10164a'); W.globe(ctx, t, 960, 560, 400, 40 + u * 2, { routes: tw(u, 1, 5) * 0.9, dots: ['eafrica'] }); pill('out of Africa', 960, 100, shows(t, 92.6, 97.8)); }],
  // 10. generations
  [98, 104, (ctx, t, u) => { W.savanna(ctx, t, 2600 + u * 80, { sunX: 1600, sunY: 420 }); const g = Math.floor(u / 1.5); for (let k = 0; k < 4; k++) { const a = clamp(1 - Math.abs(u / 1.5 - k - 0.5) * 1.2); if (a <= 0) continue; ctx.globalAlpha = a; Folk.walker(ctx, t, 760 + k * 120, 1010, [360, 520, 640, 620][k], { kid: k < 2, skin: S[1], hair: '#1a100a', beard: k === 2, hairStyle: k === 3 ? 'long' : k === 1 ? 'curly' : 'short', light: 'right', phase: k, clothCol: '#7a4a2a', pack: k > 1 }); ctx.globalAlpha = 1; } void g; W.grassFront(ctx, t, 2600 + u * 80); pill('over thousands of generations', 960, 120, shows(t, 98.6, 103.8)); }],
  [104, 110, (ctx, t, u) => { skyBg(ctx, '#050a2a', '#10164a'); W.globe(ctx, t, 960, 560, 400, 60 + u * 8, { routes: 0.9 + tw(u, 0, 5.5) * 2.2 }); pill('along coasts, over mountains, into new lands', 960, 100, shows(t, 104.6, 109.8), { size: 32 }); }],
  // 11. lower sun
  [110, 116, (ctx, t, u) => { skyBg(ctx, '#3a5ad8', '#ffd8b0'); const lat = tw(u, 0.5, 5); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.setLineDash([12, 12]); ctx.beginPath(); ctx.arc(960, 900, 700, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
    const a = Math.PI * (1.5 - 0.0) - lat * 0.9, sx = 960 + Math.cos(a) * 700, sy = 900 + Math.sin(a) * 700, sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 160); sg.addColorStop(0, 'rgba(255,250,220,1)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 160, sy - 160, 320, 320); wEll(ctx, sx, sy, 50, 50, '#fffbe8');
    const gr = ctx.createLinearGradient(0, 880, 0, 1080); gr.addColorStop(0, mixc('#e0a840', '#e8eaff', lat)); gr.addColorStop(1, mixc('#c08030', '#b8c0f0', lat)); ctx.fillStyle = gr; ctx.fillRect(0, 880, 1920, 200); family(ctx, t, { scale: 0.32, x0: 560, y: 1000, cloth: lat > 0.5 ? 'parka' : 'hide', shadow: lerp(0.3, 2.4, lat) }); W.uvGauge(ctx, 250, 230, 110, lerp(0.95, 0.25, lat), 1, FONT); pill(lat < 0.5 ? 'near the equator: the sun high' : 'further north: lower, weaker, especially in winter', 1160, 120, shows(t, 110.6, 115.8), { size: 32 }); }],
  [116, 122, (ctx, t, u) => { W.steppe(ctx, t, u * 50, { sunY: 600 }); family(ctx, t, { scale: 0.62, x0: 200 + u * 30, y: 980, cloth: 'parka', skin: S[2], shadow: 2.4, light: 'right', rim: 'rgba(255,220,200,0.35)' }); W.uvGauge(ctx, 250, 230, 110, 0.22, 1, FONT); pill('UV: low', 250, 330, shows(t, 116.6, 121.8)); }],
  // 12. little vitamin D
  [122, 132, (ctx, t, u) => { W.skin(ctx, t, { dose: 0.95, cap: 1 }); W.uvBeams(ctx, t, 330, () => true, 3, 1); W.vitaminD(ctx, t, 1500, 900, 50, 0.15 + 0.1 * Math.sin(t * 2)); pill('dark skin blocks most of the little UV left', 960, 960, shows(t, 122.6, 127.4), { size: 32 }); pill('so less vitamin D', 1500, 780, shows(t, 127.6, 131.8)); }],
  // 13. slowly lighter
  [132, 138, (ctx, t, u) => { skyBg(ctx, '#3a4ab0', '#a0a0e0'); for (let i = 0; i < 6; i++) { const p = tw(u, i * 0.6, i * 0.6 + 0.6); if (p <= 0) continue; Folk.portrait(ctx, t, 240 + i * 290, 540, 220 * (0.6 + 0.4 * p), { skin: mixc(S[1], S[6], i / 5), style: i % 2 ? 'straight' : 'short', hairCol: '#2a1a12', shirt: ['#8a5a3a', '#7a6a4a', '#6a5a7a', '#4a6a9a', '#3a7aa8', '#2a7ac0'][i], seed: i }); } pill('generation after generation', 960, 900, shows(t, 132.6, 137.8)); }],
  [138, 144, (ctx, t, u) => { W.steppe(ctx, t, 400 + u * 50, { sunY: 620 }); family(ctx, t, { scale: 0.62, x0: 200 + u * 30, y: 980, cloth: 'parka', skins: [S[4], S[4], S[5], S[4], S[5]], shadow: 2.4, rim: 'rgba(255,220,200,0.35)' }); pill('lighter skin: a small advantage, passed on', 960, 120, shows(t, 138.6, 143.8), { size: 32 }); }],
  // 14. two separate paths
  [144, 150, (ctx, t, u) => { skyBg(ctx, '#050a2a', '#10164a'); W.globe(ctx, t, 960, 560, 400, 70, { routes: 3.2, dots: ['europe', 'easia'] }); const p = tw(u, 1, 3); for (const [k, col, lab, lx] of [['europe', '#ff8a3a', 'Europe', -1], ['easia', '#4ad0ff', 'East Asia', 1]]) { const [x, y, v] = W.proj(...W.STOP[k], 960, 560, 400, 70); if (!v) continue; ctx.globalAlpha = p; wEll(ctx, x, y, 30, 30, col); ctx.globalAlpha = 1; pill(lab, x + lx * 160, y - 70, p * shows(t, 145, 149.8)); } pill('lighter skin evolved separately', 960, 100, shows(t, 144.6, 149.8)); }],
  [150, 156, (ctx, t, u) => { skyBg(ctx, '#0a1040', '#1a2a6a'); W.dna(ctx, t, 400, 70, [[0.3, '#ff8a3a'], [0.36, '#ff8a3a']], 1); W.dna(ctx, t + 3, 780, 70, [[0.62, '#4ad0ff'], [0.7, '#4ad0ff']], 1); pill('Europe: changes in some genes', 960, 230, shows(t, 150.6, 155.8)); pill('East Asia: changes in different genes', 960, 960, shows(t, 151.2, 155.8)); }],
  // 15. later than you think
  [156, 162, (ctx, t, u) => { const z = 1 + 0.08 * tw(u, 0, 6, 'inOut'); ctx.save(); ctx.translate(1000, 700); ctx.scale(z, z); ctx.translate(-1000, -700); W.campfire(ctx, t); Folk.walker(ctx, t, 820 + Math.sin(t * 0.8) * 6, 1100, 900, { walk: 0.12, speed: 1.5, skin: S[2], hair: '#3a2416', beard: true, hairStyle: 'long', cloth: 'parka', hood: false, clothCol: '#5a3e2e', light: 'right', rim: 'rgba(255,170,80,0.55)', seed: 4, irisCol: '#5aa0e0' }); ctx.restore(); pill('dark skin, often with light eyes', 960, 120, shows(t, 156.6, 161.8)); }],
  [162, 168, (ctx, t, u) => { W.campfire(ctx, t, 1500, 940); W.dna(ctx, t, 420, 60, [[0.5, '#ffd23a']], 0.9); pill('ancient DNA: until roughly 8,000 to 10,000 years ago', 960, 120, shows(t, 162.6, 167.8), { size: 32 }); }],
  // 16. the Arctic
  [168, 174, (ctx, t, u) => { const z = 1 + 0.07 * tw(u, 0, 6, 'inOut'); ctx.save(); ctx.translate(700, 800); ctx.scale(z, z); ctx.translate(-700, -800); W.arctic(ctx, t); W.lamp(ctx, t, 560, 900);
    for (const [x, H, sk, dir] of [[360, 560, S[3], 1], [760, 520, S[3], -1]]) Folk.walker(ctx, t, x + Math.sin(t * 0.7 + x) * 5, 960, H, { walk: 0.12, speed: 1.6, skin: sk, hair: '#120a06', cloth: 'parka', clothCol: '#6a4a36', light: 'left', rim: 'rgba(255,190,100,0.5)', dir, seed: x, mood: 'smile' });
    const kx = lerp(1100, 660, tw(u, 0.3, 4.5, 'inOut')), walking = u > 0.3 && u < 4.5; Folk.walker(ctx, t, kx, 970, 360, { walk: walking ? 1 : 0.1, kid: true, skin: S[3], hair: '#120a06', cloth: 'parka', clothCol: '#7a5440', light: 'left', rim: 'rgba(255,190,100,0.5)', dir: -1, seed: 9, mood: 'smile' });
    ctx.restore(); pill('the Arctic: an exception', 960, 120, shows(t, 168.6, 173.8)); }],
  [174, 180, (ctx, t, u) => { const g = ctx.createLinearGradient(0, 0, 0, 1080); g.addColorStop(0, '#2a6ab8'); g.addColorStop(1, '#0a1a4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 200 + i * 320 + Math.sin(t * 0.4 + i) * 40, lg = ctx.createLinearGradient(0, 0, 0, 900); lg.addColorStop(0, 'rgba(180,220,255,0.12)'); lg.addColorStop(1, 'rgba(180,220,255,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x + 200, 1080); ctx.lineTo(x + 100, 1080); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(230,240,255,0.25)'; ctx.fillRect(0, 0, 1920, 50);
    for (let i = 0; i < 7; i++) { const dir = i % 3 === 1 ? -1 : 1, sp = 120 + K.hash(i, 3) * 80, x0 = K.hash(i, 1) * 2200, x = dir > 0 ? ((x0 + u * sp) % 2300) - 190 : 2110 - ((x0 + u * sp) % 2300), y = 300 + K.hash(i, 2) * 560 + Math.sin(t + i) * 20, s2 = 1.2 + K.hash(i, 4) * 0.9;
      W.fish(ctx, t, x, y, s2, dir, ['#7aa8c0', '#c87a5a', '#8ab0a0'][i % 3]); if (i < 4) W.vitaminD(ctx, t, x, y - 60 * s2, 22, 1); }
    W.seal(ctx, t, lerp(-300, 2200, tw(u, 0, 6)), 220 + Math.sin(t * 1.2) * 20, 1.4, 1);
    for (let i = 0; i < 30; i++) { const by = (K.hash(i, 8) * 1080 - u * 60 * (1 + K.hash(i, 9))) % 1080; wEll(ctx, K.hash(i, 7) * 1920, by < 0 ? by + 1080 : by, 3 + K.hash(i, 6) * 5, 3 + K.hash(i, 6) * 5, 'rgba(220,240,255,0.35)'); }
    pill('vitamin D from fish and seal, not sunlight', 960, 980, shows(t, 174.6, 179.8)); }],
  // 17. Africa's range
  [180, 192, (ctx, t, u) => { skyBg(ctx, '#e8a040', '#a04a3a'); const tones = [S[0], S[1], S[2], S[3], S[4], S[5]]; tones.forEach((sk, i) => { const p = tw(u, i * 0.5, i * 0.5 + 0.5); if (p <= 0) return; Folk.portrait(ctx, t, 240 + i * 290, 560, 230 * (0.6 + 0.4 * p), { skin: sk, style: ['afro', 'curly', 'buzz', 'bun', 'short', 'curly'][i], hairCol: '#1a100a', shirt: ['#e8a030', '#3a8ad0', '#4aa86a', '#d84a6a', '#7a4ad0', '#2a7ac0'][i], seed: i + 20, earrings: i % 2 === 0 }); }); pill('Africa: one of the widest ranges of skin colour', 960, 120, shows(t, 180.6, 191.8), { size: 32 }); }],
  // 18. South Asia
  [192, 197, (ctx, t, u) => { W.paddy(ctx, t, u * 40); for (const [x, H, sk] of [[700, 520, S[2]], [1100, 480, S[2]], [1350, 380, S[3]]]) Folk.walker(ctx, t, x, 960, H, { walk: 0.3, skin: sk, hair: '#120a06', hairStyle: 'long', clothCol: ['#c84a8a', '#e8a030', '#3a8ad0'][Math.round(x / 300) % 3], trim: ['#c84a8a', '#e8a030', '#3a8ad0'][Math.round(x / 300) % 3], light: 'right', seed: x }); pill('strong sun again: South Asia', 960, 120, shows(t, 192.6, 196.8)); }],
  [197, 202, (ctx, t, u) => { W.paddy(ctx, t, 200 + u * 40); W.uvGauge(ctx, 960, 560, 200, lerp(0.4, 0.95, tw(u, 0, 3)), 1, FONT); pill('darker skin kept or regained', 960, 760, shows(t, 197.6, 201.8)); }],
  // 19. two maps line up
  [202, 216, (ctx, t, u) => { skyBg(ctx, '#0a1240', '#1a2a6a'); const sl = tw(u, 4, 8, 'inOut'), w = lerp(880, 1560, sl), h = w * 0.52, y = lerp(250, 140, sl);
    W.flatMap(ctx, lerp(60, 180, sl), y, w, h, (n, la) => W.uvCol(la), 1); W.flatMap(ctx, lerp(980, 180, sl), y, w, h, (n, la) => W.toneCol(n, la), 1 - sl * 0.45);
    pill('sunlight (UV)', 500, 770, shows(t, 202.6, 206)); pill('skin colour of the people who lived there', 1420, 770, shows(t, 202.6, 206), { size: 30 }); pill('they line up remarkably well', 960, 990, shows(t, 210, 215.8)); }],
  // 20. one family
  [216, 223, (ctx, t, u) => { skyBg(ctx, '#0a1040', '#1a2a6a'); W.dna(ctx, t, 540, 120, [[0.2, '#ffd23a'], [0.45, '#ff8a3a'], [0.72, '#4ad0ff']], 1); pill('a handful of genes: a tiny part of our DNA', 960, 900, shows(t, 216.6, 222.8)); }],
  [223, 230, (ctx, t, u) => { skyBg(ctx, '#2a3aa8', '#5a2a8a'); crowd(ctx, t, 960, 560, 230); pill('underneath, one family', 960, 120, shows(t, 223.6, 229.8)); }],
  // 21. the map of your ancestors
  [230, 240, (ctx, t, u) => { skyBg(ctx, '#050a2a', '#1a1a4a'); W.globe(ctx, t, 1400, 560, 360, 50 + u * 4, { routes: 4 }); Folk.portrait(ctx, t, 560, 520, 420, Object.assign({ light: 1, seed: 3 }, TODAY[4])); pill('your skin is a map of your ancestors’ sun', 960, 980, shows(t, 231, 239.6)); }],
];
const D = 240;
const FILM = {
  draw(t) {
    const ctx = P.ctx; const s = SHOTS.find(([a, b]) => t >= a && t < b) ?? SHOTS[SHOTS.length - 1];
    s[2](ctx, t, t - s[0]);
    // a short dip to dark at the start (0.6 s) and the end (1 s); cuts between shots are hard (the reference rhythm)
    if (t < 0.6) P.haze('#05030a', 1 - t / 0.6); if (t > D - 1) P.haze('#05030a', t - (D - 1));
    P.vignette(0.25);
  },
};
