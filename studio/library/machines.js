// =====================================================================
//  MACHINES — detailed isometric solids for "how it works" scenes, built on the vendored anatomy geometry kit
//  (studio/vendor/anatomy/anatomy.js, MIT, github.com/wheresryan22/anatomy). The kit only does maths: every solid comes
//  back as SVG path strings { fill, shades[4], top, crease, outline, bevel }; here they are painted on our canvas with
//  Path2D in the piece's own palette, so a machine belongs to the style instead of looking pasted in.
//  Include in piece.json "build" after "style": "../../studio/vendor/anatomy/anatomy.js", "../../studio/library/machines.js".
//  Animate by recomputing from TT each frame (a piston's z, a dial's angle, ribsOf/spokesOf `phase`), never from the pointer.
//
//    const cam = anCam(480, 600, 6);                                // screen origin + scale (px per unit)
//    const pal = anPal('#ffffff', '#232327');                       // paper + ink -> 4 side shades, lit top, crease, edge
//    anPaint(AN.cylinder(0, 0, 20, 0, 30, cam), pal);              // any SolidPaths: slabOf, cylinder, extrude, lathe, sphereOf, prismOf...
//    anPaint(AN.solidOf([[0, 10], [12, 14], [24, 6]], anAxis([0, 40, 0], [1, 0, 0]), cam), pal);   // a turned part on any axis
//    anTube(AN.tubePieces([[0,0,5], [40,0,5], [40,30,20]], 3, cam), pal);                           // a pipe or cable
//    anDraw(cam, [{ at: [0, 0, 0], draw: () => ... }, ...]);         // painter's order: far to near
// =====================================================================
const AN = Object.assign({}, AN_ISO, AN_LATHE, { tubePieces: AN_TUBE.tubePieces, tubeRuns: AN_TUBE.runsOf });
function anCam(x, y, scale, o = {}) { return { origin: [x, y], scale, azimuth: o.azimuth ?? AN.AZIMUTH, elevation: o.elevation ?? AN.ELEVATION }; }
const anAxis = (origin, direction) => AN.frameAlong(origin, direction);   // a frame for lathe parts: origin + axis
const anPt = (p, cam) => AN.iso(p, cam);                                   // project one 3D point to the screen
function anHex(c) { const h = c.replace('#', ''); const f = h.length === 3 ? h.split('').map((x) => x + x).join('') : h; return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)); }
function anMix(a, b, k) { const A = anHex(a), B = anHex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
// a palette from the paper (face) colour and the ink; o: { lw (screen px), depth (how dark the shadow side gets), top, crease }
function anPal(paper = '#ffffff', ink = '#232327', o = {}) {
  const k = o.depth ?? 0.22;
  return { paper, ink, shades: [k, k * 0.65, k * 0.36, k * 0.12].map((q) => anMix(paper, ink, q)), top: o.top ?? anMix(paper, '#ffffff', 0.35),
    crease: o.crease ?? anMix(paper, ink, 0.45), edge: o.edge ?? ink, lw: o.lw ?? 2.2 };
}
function anZoom() { const m = ctx.getTransform(); return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1; }
const anPath = (d) => (d ? new Path2D(d) : null);
// paint one solid; o: { flat (no shading), alpha, tex(path2d) (style texture clipped to the solid: hatching, grain), edge, lw }
function anPaint(S, pal, o = {}) {
  if (!S || !S.fill) return;
  const z = anZoom(), lw = (o.lw ?? pal.lw) / z, body = anPath(S.fill);
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.fillStyle = o.fill ?? pal.paper; ctx.fill(body);
  if (!o.flat) {
    S.shades.forEach((d, i) => { const p = anPath(d); if (!p) return; ctx.fillStyle = pal.shades[i]; ctx.fill(p); if (S.seamless) { ctx.strokeStyle = pal.shades[i]; ctx.lineWidth = 0.8 / z; ctx.stroke(p); } });
    const top = anPath(S.top); if (top) { ctx.fillStyle = o.top ?? pal.top; ctx.fill(top); if (S.seamless) { ctx.strokeStyle = o.top ?? pal.top; ctx.lineWidth = 0.8 / z; ctx.stroke(top); } }
  }
  if (o.tex) { ctx.save(); ctx.clip(body); o.tex(body); ctx.restore(); }
  ctx.strokeStyle = pal.crease; ctx.lineWidth = lw * 0.55;
  for (const d of [S.crease, S.bevel]) { const p = anPath(d); if (p) ctx.stroke(p); }
  const edge = anPath(S.outline); if (edge) { ctx.strokeStyle = o.edge ?? pal.edge; ctx.lineWidth = lw; ctx.stroke(edge); }
  ctx.restore();
}
// paint tube pieces (AN.tubePieces): body, shine and shade bands, rings, edges
function anTube(pieces, pal, o = {}) {
  const z = anZoom();
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const pc of pieces) {
    ctx.fillStyle = o.fill ?? pal.paper; ctx.fill(anPath(pc.body));
    if (pc.wide) { ctx.fillStyle = pal.top; ctx.fill(anPath(pc.shine)); ctx.fillStyle = pal.shades[0]; ctx.fill(anPath(pc.shade)); }
    ctx.strokeStyle = pal.crease; ctx.lineWidth = (pal.lw * 0.55) / z;
    for (const r of pc.rings || []) { if (r.alpha <= 0) continue; ctx.globalAlpha = (o.alpha ?? 1) * Math.min(1, r.alpha); ctx.stroke(anPath(r.d)); }
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.strokeStyle = o.edge ?? pal.edge; ctx.lineWidth = (o.lw ?? pal.lw) / z; ctx.stroke(anPath(pc.edges));
  }
  ctx.restore();
}
// stroke a path string (ticks, seams, coils, arcs): o: { color, w (screen px), dash, alpha }
function anLine(d, pal, o = {}) {
  const p = anPath(d); if (!p) return;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.strokeStyle = o.color ?? pal.edge; ctx.lineWidth = (o.w ?? pal.lw) / anZoom();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; if (o.dash) ctx.setLineDash(o.dash.map((v) => v / anZoom())); ctx.stroke(p); ctx.restore();
}
// fill a path string flat (a face decal, a glow, a liquid level)
function anFill(d, color, alpha = 1) { const p = anPath(d); if (!p) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.fill(p); ctx.restore(); }
// painter's order: draw parts far to near by the depth of an anchor point (choose the part's nearest-to-viewer corner)
function anDraw(cam, parts) { parts.map((p) => ({ p, d: AN.depthOf(p.at, cam) })).sort((a, b) => a.d - b.d).forEach(({ p }) => p.draw()); }
