// Look test (before the build): 0-4 s the eye in cross-section with a ray of light focused onto the retina (tile 1);
// 4-8 s the retina's layers: light from above passing the nerve wiring to the rods and coloured cones (tile 4).
const FONT = '"Baloo 2", sans-serif';
if (typeof document !== 'undefined' && document.fonts) document.fonts.load(`700 40px ${FONT}`);
const FILM = {
  draw(t) {
    const ctx = P.ctx;
    if (t < 4) {
      navy(ctx); const geo = E.eye(ctx, t, 1000, 540, 400, { pupil: 0.55 + 0.1 * Math.sin(t), lens: 0.3 }); E.ray(ctx, t, geo, 230, '255,200,90', 1);
      P.pill('cornea', 560, 210, { u: K.tw(t, 0.4, 0.9), size: 34, font: FONT, weight: 700 }); P.pill('lens', 830, 900, { u: K.tw(t, 0.8, 1.3), size: 34, font: FONT, weight: 700 }); P.pill('retina', 1380, 140, { u: K.tw(t, 1.2, 1.7), size: 34, font: FONT, weight: 700 });
    } else {
      E.retina(ctx, t, { lit: 'L', beam: 30 + 14 * 64, beamEnd: 790 });
      P.pill('the light passes the wiring first', 960, 520, { u: K.tw(t, 4.4, 4.9), size: 34, font: FONT, weight: 700 });
    }
    P.vignette(0.25);
  },
};
