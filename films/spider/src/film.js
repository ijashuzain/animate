// How a Spider Builds Its Web in One Night: one journal page, dusk to dawn (pitch A). LOOK TEST for now.
const FILM = {
  draw(t) {
    const ctx = P.ctx; Brush.paper(ctx);
    Brush.band(ctx, -60, 430, { color: '#b9aec8', alpha: 0.22, seed: 2, wave: 60 }); Brush.band(ctx, -60, 250, { color: '#e8b89a', alpha: 0.12, seed: 5, wave: 50 });   // dusk: violet-grey over a warm glow, top of the sheet only
    Brush.wash(ctx, Brush.blob(1660, 190, 90, 90, 0, 30, 8, 0.04), { color: '#e9d9a8', alpha: 0.55, seed: 8 });  // the moon, unpainted rim
    for (const tw of W.twigs) W.twig(ctx, tw, 1);
    for (const l of W.leaves) W.leaf(ctx, l, 1);
    W.web(ctx, t, { frame: 1, radii: 1, aux: 1, auxGone: 0.7, sticky: 0.8 });
    Brush.wash(ctx, Brush.blob(W.hub[0], W.hub[1], 30, 30, 0, 22, 4, 0.1), { color: '#c8442a', alpha: 0.35, seed: 4 });
    Brush.note(ctx, 'the hub', 1120, 470, 1, { size: 46 }); Brush.leader(ctx, [1112, 482], [1018, 512], 1);
    Brush.note(ctx, 'sticky spiral: laid from the outside in', 1460, 960, 1, { size: 40, align: 'center' }); Brush.leader(ctx, [1300, 935], [1180, 800], 1);
    Brush.note(ctx, 'spokes: dry silk', 340, 700, 1, { size: 42 }); Brush.leader(ctx, [470, 680], [700, 620], 1);
    ctx.save(); ctx.fillStyle = Brush.rgba('#c8442a', 0.85); ctx.font = '600 52px Caveat'; ctx.fillText('8:15 pm', 90, 110); ctx.restore();
    ctx.save(); ctx.fillStyle = Brush.rgba(Brush.INK, 0.8); ctx.font = 'italic 500 44px "Cormorant Garamond"'; ctx.textAlign = 'center'; ctx.fillText('One night, one page', 960, 1030); ctx.restore();
  },
  // the model sheet (lemo's rule): views, key poses, palette, built from refs/ref-sheet.webp. node tools2/film.mjs spider model
  model(ctx) {
    Brush.paper(ctx);
    const head = (str, x, y, size = 40) => { ctx.save(); ctx.fillStyle = Brush.rgba(Brush.INK, 0.85); ctx.font = `italic 600 ${size}px "Cormorant Garamond"`; ctx.textAlign = 'left'; ctx.fillText(str, x, y); ctx.restore(); };
    head('The garden spider and the moth: model sheet', 60, 70, 48);
    W.spider(ctx, 1, 300, 470, 150, { a: Math.PI / 2 }); Brush.note(ctx, 'top view', 300, 900, 1, { size: 36, align: 'center' });
    W.spiderSide(ctx, 1, 760, 420, 120, { dir: 1 }); Brush.line(ctx, [560, 420], [980, 420], 1, { color: '#6a4a30', w: 3 }); Brush.note(ctx, 'side view', 760, 470, 1, { size: 36, align: 'center' });
    const r = W.spiderSide(ctx, 1, 1230, 420, 110, { dir: 1, lift: 1 }); Brush.line(ctx, [1060, 420], [1300, 420], 1, { color: '#6a4a30', w: 3 });
    Brush.ink(ctx, Brush.curve([r.spinneret, [r.spinneret[0] - 80, r.spinneret[1] - 90], [r.spinneret[0] - 60, r.spinneret[1] - 200], [r.spinneret[0] - 140, r.spinneret[1] - 260]], 8), 1, { color: '#4a4a5a', w: 1.2, alpha: 0.7 });
    Brush.note(ctx, 'releasing the first thread', 1180, 470, 1, { size: 32, align: 'center' });
    Brush.line(ctx, [560, 640], [1000, 640], 1, { color: '#4a4a5a', w: 1.4 }); W.spiderSide(ctx, 1, 780, 640, 100, { dir: 1, hang: true, walk: 0.2 }); Brush.note(ctx, 'walking a thread', 780, 900, 1, { size: 32, align: 'center' });
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; Brush.line(ctx, [1230, 680], [1230 + Math.cos(a) * 190, 680 + Math.sin(a) * 190], 1, { color: '#4a4a5a', w: 1, alpha: 0.5 }); }
    W.spider(ctx, 1, 1230, 650, 80, { a: Math.PI / 2 }); Brush.note(ctx, 'waiting at the hub, head down', 1230, 900, 1, { size: 32, align: 'center' });
    W.moth(ctx, 1, 1660, 300, 130, { a: -Math.PI / 2 }); Brush.note(ctx, 'moth: wings open', 1660, 470, 1, { size: 32, align: 'center' });
    W.moth(ctx, 1, 1660, 640, 120, { a: -Math.PI / 2, open: 0.05 }); Brush.note(ctx, 'wings folded', 1660, 800, 1, { size: 32, align: 'center' });
    [['#d4903e', 'abdomen'], ['#7e5040', 'band'], ['#f7efdc', 'white spots'], ['#a88660', 'head-chest'], ['#e2c38e', 'legs'], ['#6a3e22', 'leg bands'], ['#9a7458', 'forewing'], ['#e8b040', 'hindwing']].forEach(([c, n], i) => {
      const x = 90 + i * 225; Brush.wash(ctx, Brush.blob(x, 990, 34, 26, 0, 16, i, 0.1), { color: c, alpha: 0.95, seed: i }); Brush.note(ctx, n, x + 46, 992, 1, { size: 30 }); });
  },
};
