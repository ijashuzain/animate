// =====================================================================
//  MACHINE KIT DEMO — a water pump from studio/library/machines.js, in the isometric style's palette.
//  Parts: a bevelled base, a turned tank (lathe), a pressure gauge with a moving needle, a pipe (tube), a pump housing,
//  a piston that strokes, a spoked flywheel that turns, a coil spring that squeezes. Everything moves from TT.
// =====================================================================
const CHANNEL = { font: SANS, halo: false, colors: { ink: '#4a4a52', accent: PAL.accent, blue: '#6a6a74', green: PAL.accent } };
const MPAL = anPal('#ffffff', '#5a5a64', { depth: 0.2, edge: '#3a3a42', lw: 2.2 });
const MACC = anPal('#e9eef7', '#2c3e66', { depth: 0.28, edge: '#2c3e66', lw: 2.2 });
function sPump() {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  const cam = anCam(500, 660, 5.2);
  const w = TT * 2.4, stroke = (1 + Math.sin(w)) / 2;
  const tankF = anAxis([-24, 2, 6], [0, 0, 1]);
  const wheelF = anAxis([20, -18, 46], [0, 1, 0]);
  const gauge = AN.add3([-24, 2, 30], AN.mul3(AN.unit3([1, 1, 0]), 15.4));
  const gaugeF = anAxis(gauge, AN.unit3([1, 1, 0]));
  anDraw(cam, [
    { at: [-46, -30, 0], draw: () => anPaint(AN.slabOf({ x: -46, y: -30, w: 92, d: 62, r: 5 }, 0, 6, cam, 8, 1.2), MPAL) },
    { at: [20, -20, 30], draw: () => {   // the flywheel and its turning spokes
      anPaint(AN.ringBand(0, 3, 13, 17, wheelF, cam), MPAL);
      anLine(AN.spokesOf(wheelF, 1.5, 3, 13, 6, cam, { phase: w }), MPAL, { w: 3 });
      anPaint(AN.disc(-1, 4, 3.2, wheelF, cam), MACC);
      const pin = AN.pointOf(wheelF, 1.5, 9, w);
      anLine(AN.pathOf([anPt(pin, cam), anPt([20, 8, 34 + stroke * 8], cam)]), MPAL, { w: 3.2, color: '#3a3a42' });
    } },
    { at: [-24, 2, 6], draw: () => {   // the tank, turned on a lathe, with its gauge
      anPaint(AN.solidOf([[0, 16], [30, 16], [36, 12], [40, 5], [43, 5]], tankF, cam), MPAL);
      anLine(AN.ribsOf(tankF, 4, 26, 16, 10, cam), MPAL, { w: 1.2, color: '#c4c4cc' });
      anPaint(AN.disc(0, 1.6, 6.5, gaugeF, cam), MACC);
      anLine(AN.spokesOf(gaugeF, 1.7, 4.8, 6, 9, cam, { from: -2.2, to: 2.2 }), MPAL, { w: 1.4 });
      const needle = -2.0 + 3.4 * (0.5 + 0.5 * Math.sin(w - 0.6));
      anLine(AN.pathOf([anPt(AN.pointOf(gaugeF, 1.7, 0, 0), cam), anPt(AN.pointOf(gaugeF, 1.7, 5, needle), cam)]), MPAL, { w: 2.6, color: '#d4483c' });
    } },
    { at: [20, -26, 6], draw: () => anPaint(AN.slabOf({ x: 16, y: -26, w: 8, d: 5, r: 1 }, 6, 40, cam, 4, 0.6), MPAL) },
    { at: [44, 24, 6], draw: () => { anPaint(AN.slabOf({ x: 42, y: 18, w: 3, d: 10, r: 0.6 }, 6, 12, cam, 4), MPAL); const c = AN.coil(28 + stroke * 5, 42, [23, 12], 3.4, 7, 'x', cam); anLine(c.back, MPAL, { w: 1.4, color: '#9a9aa2' }); anLine(c.front, MPAL, { w: 2, color: '#2c3e66' }); anPaint(AN.disc(0, 1.4, 4.6, anAxis([26.6 + stroke * 5, 23, 12], [1, 0, 0]), cam), MACC); } },
    { at: [0, 14, 12], draw: () => anTube(AN.tubePieces([[-10, 12, 12], [2, 14, 12], [12, 14, 12]], 2.6, cam), MPAL) },
    { at: [24, 10, 6], draw: () => {   // the housing, the coil and the piston
      anPaint(AN.cylinder(20, 8, 9, 6, 24, cam, 40, 0.8), MPAL);
      anPaint(AN.cylinder(20, 8, 2.6, 30, 4 + stroke * 8, cam, 24), MACC);
    } },
  ]);
}
function cPump(at) {
  title('A pump, in parts', at(0.6));
  write('turned tank (lathe)', CL, 360, 40, at(1.4));
  write('pipe (tube)', CL, 430, 40, at(2.0));
  write('spoked flywheel', CL, 500, 40, at(2.6));
  write('all of it moves with time', CL, 570, 40, at(3.2), { color: CH.accent, weight: 700 });
}
