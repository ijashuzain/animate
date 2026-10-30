// Look test (before the build): 0-4 s our cell in the bloodstream; 4-8 s the sugar tags on its surface, an enzyme adding
// the group-A sugar. Built from the user's references (refs/ref-grid.webp).
const FONT = '"Baloo 2", sans-serif';
const FILM = {
  draw(t) {
    const ctx = P.ctx;
    if (t < 4) {
      const cz = t * 420, vp = [1180 + Math.sin(t * 0.4) * 30, 430];
      CELL.vessel(ctx, t, cz, vp);
      const hero = { z: 330, x: 760 + Math.sin(t * 0.7) * 20, y: 560 + Math.sin(t * 1.1) * 12, r: 165, ang: -0.35 + Math.sin(t * 0.5) * 0.1, k: 0.62 + 0.1 * Math.sin(t * 0.6), glow: 0.9 };
      CELL.flow(ctx, t, cz, 220, vp, hero);
      // a few big near cells drifting past the frame edges (out of focus): depth
      for (const [x0, y0, r0, a0, sp] of [[-60, 980, 260, 0.4, 1], [1980, 160, 300, -0.6, -1], [1820, 1040, 220, 0.9, 1]]) CELL.rbc(ctx, x0 + sp * t * 40, y0 - t * 25, r0, a0 + t * 0.1, 0.75, { blur: 9, fog: 0.1, bg: '#d84a6a' });
      CELL.vesselEdge(ctx, vp);
      P.pill('about 8 thousandths of a millimetre', 760, 820, { u: K.tw(t, 0.6, 1.1), size: 34, font: FONT });
    } else {
      CELL.deep(ctx, t);
      // close on the surface: the membrane crosses the frame as a slope (left high, right low)
      const edge = (u) => [-80 + u * 2100, 330 + u * 520 + 60 * Math.sin(u * 3.2)];
      CELL.membrane(ctx, t, edge);
      const at = (u) => { const p = edge(u), q = edge(u + 0.004), nx = q[1] - p[1], ny = -(q[0] - p[0]), d = Math.hypot(nx, ny); return [p, [nx / d, ny / d]]; };
      const add = K.tw(t, 5.6, 6.3, 'backOut');
      const chains = [[0.08, 4, null], [0.2, 5, null], [0.33, 3, null], [0.47, 5, 'hero'], [0.62, 4, null], [0.76, 6, null], [0.9, 4, null]];
      let heroTip = null;
      chains.forEach(([u, len, tag], i) => { const [p, n] = at(u); const tip = tag ? { col: CELL.SUGAR.A, u: add, glow: K.tw(t, 6.0, 6.4) * (1 - K.tw(t, 7, 8)) } : { col: CELL.SUGAR.A, u: 1 };
        const tp = CELL.chain(ctx, t, [p[0] - n[0] * 4, p[1] - n[1] * 4], n, len, tip, i * 3 + 1, 26); if (tag) heroTip = tp; });
      // the enzyme comes down from the top-right, places the sugar on the tip, and backs off
      const inn = K.tw(t, 4.2, 5.6, 'inOut'), out = K.tw(t, 6.5, 7.8, 'inOut'), off = 340 * (1 - inn) + 160 * out;
      const ex = heroTip[0] + 36 + off * 0.8, ey = heroTip[1] - 30 - off * 0.6;
      CELL.enzyme(ctx, t, ex, ey, 170, -0.62, '#3a8aff');
      if (add < 0.05) CELL.bead(ctx, ex - 6, ey + 4, 27, CELL.SUGAR.A);
      P.pill('group A: one extra sugar on the tip of every chain', 1260, 980, { u: K.tw(t, 6.4, 6.9), size: 34, font: FONT });
    }
    P.vignette(0.3);
  },
};
