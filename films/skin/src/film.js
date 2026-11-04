// Look test (before the build): 0-4 s the ancestors walking the savanna under a UV gauge at maximum; 4-8 s inside the skin,
// melanin parcels travelling up the melanocyte's arms and gathering into caps over each nucleus.
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const FILM = {
  draw(t) {
    const ctx = P.ctx;
    if (t < 4) {
      const pan = t * 60;
      W.savanna(ctx, t, pan);
      // the family, walking right (they face the way they travel): a child, the father (spear, pack), the mother (baby), a boy, a girl
      const fam = [
        { x: 300, H: 360, kid: true, skin: Folk.SKIN[1], hairStyle: 'curly', pack: true, spear: true, phase: 0.3 },
        { x: 640, H: 640, skin: Folk.SKIN[1], beard: true, pack: true, spear: true, phase: 1.4 },
        { x: 1000, H: 590, skin: Folk.SKIN[2], hairStyle: 'long', baby: true, phase: 2.2, clothCol: '#9a6a3a' },
        { x: 1340, H: 470, kid: true, skin: Folk.SKIN[1], hairStyle: 'curly', pack: true, spear: true, phase: 3.0 },
        { x: 1620, H: 340, kid: true, skin: Folk.SKIN[2], hairStyle: 'long', phase: 3.7 },
      ];
      for (const f of fam) Folk.walker(ctx, t, f.x + Math.sin(t * 0.7 + f.phase) * 6, 1010, f.H, Object.assign({ dir: 1, light: 'right', hair: '#1a100a', rim: 'rgba(255,214,140,0.4)', seed: f.phase * 10 }, f));
      W.grassFront(ctx, t, pan);
      W.uvGauge(ctx, 250, 230, 120, 0.95, 1, FONT);
      P.pill('UV: very high', 250, 330, { u: K.tw(t, 0.4, 0.9), size: 34, font: FONT, weight: 700 });
    } else {
      W.skin(ctx, t, { dose: 0.85, cap: K.tw(t, 4.4, 7.2, 'inOut') });
      P.pill('melanocyte', 760, 840, { u: K.tw(t, 4.6, 5.1), size: 34, font: FONT, weight: 700 });
      P.pill('melanin: an umbrella over the DNA', 1380, 300, { u: K.tw(t, 6.4, 6.9), size: 34, font: FONT, weight: 700 });
    }
    P.vignette(0.25);
  },
};
