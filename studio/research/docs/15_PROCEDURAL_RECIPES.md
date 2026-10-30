# 15 — Procedural asset families: implementation recipes and constraints

These are **original engineering proposals** to test against evidence. They are not purported discoveries from the entire Kurzgesagt corpus.

## Common asset interface

All generators implement conceptual API `build(params, seed) -> {geometry, materials, rig, anchors, bounds, metadata}`. Geometry is editable and semantically grouped; `pose(frame, fps, params)` returns transforms/deformations without mutating original geometry. In 3D scenes, analogous mesh and rig structures may be used.

Asset metadata: original concept name, author, palette roles, material tokens, component IDs, layering order, anchors for interaction, supported views, safe scale range, expression/action list, test fixtures, explanatory purpose, licensing. Do not hardcode unexplained magic numbers in drawing routines; place them in documented parameter sets.

## 1. Birds and feathered animals

**Geometry:** body spline and ellipse-inspired mass; head and beak anchored to neck; wing skeleton (shoulder/elbow/wrist); primaries and secondaries generated as swept profiles along ordered root positions; alternating overlap and slight tip deformation; tail fan along rotated rays.

**Stylization knobs:** head-body ratio, wing aspect ratio, curvature and taper, feather tip roundness, fan count/spacing, wing-fold extent, tail spread, crest arrangement, beak class, contrast of wing/body.

**Motion:** pose blending across shoulder, elbow/wrist, feather fan controls; asymmetric near/far wing occlusion; flap frequency and asymmetric power/recovery strokes; delayed tail angle; head counter-rotation; extreme pose readability. For biologically credible motion, validate with general anatomy/flight references, not only cartoons.

**Common failure:** flat wing rotated as one rigid plate; fix with joint articulation and feather fan deformation. Do not add feathers everywhere simply to maximize count.

## 2. Quadrupeds and dinosaurs

**Geometry:** torso mass, neck/head, tail spline, hip/shoulder groups, legs with upper/lower segments, claws and localized surface details; near-side/far-side occlusion differentiated.

**Motion:** phase-offset feet, planted-foot IK, body vertical bob, tail counterbalance, head stabilization, slow/fast gait presets; avoid foot sliding and mesh intersections. Distinguish paleontology-informed anatomy from whimsical anthropomorphism.

## 3. Humans and expressive characters

**Geometry:** parametric head/torso/limb proportions, hand simplified to shapes readable at target display size; optional facial feature library, clothing separate from skin, semantic pivot tags.

**Motion:** walk/run/gesture cycles, posture, gaze, brow/eye/mouth state machine, secondary hair/clothing delay, squash/stretch with clear anatomical boundaries. Design independent characters instead of inheriting a recognizable studio character model.

## 4. Flora and ecosystems

**Tree:** trunk as tapered spline; branch graph with bounded recursion; foliage clusters as layered lobes/leaflets; fixed-seed asymmetry to avoid mechanical repetition; trunk/leaf shading and occlusion, tree-scale contextual LOD.

**Forest:** 3–6 parallax groups as a starting design heuristic; lower contrast/desaturation in far distance, stronger contrast in foreground; atmospheric particles and horizon masks where appropriate. Show leaf movement as spatially correlated wind, not independent random flicker.

## 5. Ocean, liquids and weather

**Water:** layered waves with periodic motion and amplitude envelope; mask occlusion of submerged subjects; foam/particles driven by local wave events; underwater caustics as subtle gradients/lines when relevant.

**Smoke/clouds:** nested irregular silhouette primitives with drift, growth and dissipation; avoid hard-edge circles masquerading as volume; use restrained gradients and density bands.

**Fire/particles:** spawned emitters with deterministic seeds, time-to-live, stylized acceleration and color ramps; performance budget and safe fallbacks.

## 6. Space, astronomy and physics

**Planet:** stylized disk with day/night and texture/patch layers, rim atmosphere, orbit and impact diagrams; distinguish graphic illustration from physically accurate light. Add true 3D sphere/rotation for effects impossible to express reliably in flat masks.

**Scale explanation:** use explicit scale map, camera movement and labels; scientific values and distances need checked sources rather than arbitrary sizes. Support animated transitions between logarithmic scale and diagrammatic emphasis without misleading users.

## 7. Biology and microscopic worlds

**Cell:** membrane as shaped boundary, organelles as layered components, receptors/antigens as repeated procedural motifs; show attachment and reaction as state transitions; ensure molecular diagrams are marked illustrative where non-to-scale.

**Blood cell:** biconcave appearance via silhouette and controlled inner shading/contour patches, not a generic flat circle; orientation variants and collective flow while avoiding identical duplicated paths.

**DNA/proteins:** parameterized ribbons, beads, molecular chains or point clouds; distinguish stylized diagrams from precise structural models and maintain scientifically truthful relationships.

## 8. Machines, cities and scientific props

Construct prop libraries from modular panel/rod/gear/connector shapes with perspective-view tags, material tokens and edge shading. Use reusable attachment points and mechanical constraints for opening/closing/rotation/assembly animations. Diagrams need readable internal mechanisms rather than decorative complexity.

## 9. Charts, titles and information

Use semantic chart primitives tied to verified quantities, annotated uncertainties, narration cues and contrast. Avoid reinterpreting mathematical values for aesthetics. Localize units/labels with safe-area and font-licensing tests. Data views should be generated from a numerical data model, not hardcoded pixels.

## 10. Cinematic assembly

For every shot record subject, narrative purpose, hero bounding region, depth layers, start/end camera, key poses, narration cue positions, transitions, target fps/duration and camera-vs-asset movement separation. Test zoom crop and subject recognizability at 256px as well as 1080p.

## Algorithmic strategy for polish

- **Semantic detail:** add only geometries supporting volume, identity or mechanical function.
- **Controlled irregularity:** deterministic low-amplitude parameter variation, not white-noise random positions.
- **Multi-scale structure:** large silhouettes → medium anatomical components → small material accents, with density capped by screen area.
- **Directional light:** consistent global light plus local shadow patches; avoid mismatched shading between assets.
- **Constraint-based animation:** posture and attachment rules constrain all poses; no procedural effect should destroy recognition.
- **Quality-guided iteration:** assess human readability, motion and knowledge transfer with the benchmark protocol before generating thousands of variations.
