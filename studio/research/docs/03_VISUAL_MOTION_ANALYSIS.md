# 03 — Detailed visual and motion analysis protocol

Analyze what is visible before interpreting how it might have been produced. Rendered images cannot reveal the original artist's actual vector paths, software, rigs, layer organization or control curves without making an inference.

## Unit of analysis hierarchy

`channel > video > chapter > scene > shot > time sample / motion event > asset instance > component > primitive > property`. Not every layer must exist in every case; use null rather than invented values.

## Observation dimensions and concrete measurements

### A. Silhouette and shape grammar

- Main visual class and viewpoint: side / front / 3-quarter / top / ambiguous.
- Bounding-box ratio, center of mass, body/head/tail ratios and relative limb proportions; coordinate units and source resolution stated.
- Silhouette primitives (ellipse, cuboid, taper, blob, tapered swept curve, polygon, closed cubic Bezier); concavity, tip shape, tangent smoothness, outline/no-outline, negative space.
- Component topology: overlap graph, visibility order, joints, connections, functional parts.
- Ornamentation: count/spacing/size distribution of scales, feathers, markings, leaf clusters, segmented plates; do not confuse visible shapes with actual source paths.

### B. Rendering and materials

- Palette roles: hero base, body shadow, belly, detail, rim highlight, environment, contrast accent; use normalized sRGB/OKLCH when measurable from an authorized image.
- Gradient shape, stop roles, local vs global lighting, opacity, hard shape shadow vs soft gradient, multi-layer highlights, masks, atmospheric effects.
- Detail density (`visible internal elements / silhouette area`, explicitly approximated), visual-frequency distribution, edge contrast and color separation.
- Texture: pure vector, stipple/particles, raster texture, pixel art, unknown.

### C. Character and biological structure

- Anatomical groupings: skeletal approximation, joint graph, hinge orientations and occlusion ordering.
- Distinct elements for bird: head, beak, eye, crest, throat, chest, scapular group, upper wing, lower wing, primaries, secondaries, tail fan, legs, claws.
- Expressions: eyelid, pupil movement, body squash/stretch, head tilt, anticipation; note if inferred.
- Species plausibility vs stylization: describe in neutral terms and cite anatomy references if used.

### D. Environments and shot design

- Foreground/midground/background layer count (observable, not actual source-layer count), perspective cues, depth/atmosphere, vegetation grouping, terrain/architecture structure, fill-to-detail ratio.
- Camera framing: shot size, focal point, trajectory, speed, parallax ratio, cuts, wipes, rotations and zooms. For unlicensed video, record qualitative human-viewing notes and time ranges only.
- Information: callout placement, diagram progression, typography hierarchy, animation-to-voiceover timing.

### E. Motion engineering

For licensed video sequences record timeline, fps, source timecodes, tracked points and confidence. Derive:
- Translation x/y, orientation, scale, bend, wing angle, tail delay and camera transform as functions of time.
- Timing curves: duration, holds, acceleration/deceleration, overshoot, follow-through, ease type; fit a model only if enough temporal samples exist.
- Pose states: anticipation → key pose → breakdown → overshoot → settle; phase within flap/walk/talk cycles.
- Dynamics: apparent gravity, buoyancy, wind, lag, constraints, elastic behavior, occlusion changes.
- Distinguish camera motion from subject motion by tracking stable background or explicit markers.

### F. Storytelling and visual reasoning

- Narrative purpose: set context, build scale, personify, visualize mechanism, foreshadow, create reveal, reinforce takeaway.
- Visual metaphor mapping: source domain → target concept; where analogy is approximate/misleading.
- Transition-to-purpose alignment and scene density relative to narration.

## Observation template

Record video ID and rights class, time range if known, focus asset / scene, literal observations, measurable values (unit/resolution), uncertain inferences, supporting evidence IDs, alternative interpretation, confidence, and candidate procedural reproduction algorithm.

Example **hypothetical, not from the corpus**: "Bird wing appears as 3 overlapping feather bands; wing pivot visually near shoulder; relative lengths could be 1.0, 0.78, 0.57. Need native frame sequence to estimate angular acceleration." Flag measurements `illustrative` until actually measured.

## Evidence confidence anchors

- `high`: direct source with appropriate time/quality, multiple raters agree, measurable feature visible.
- `medium`: feature visible but boundaries/occlusion/low resolution or only limited time sampling.
- `low`: indirect image, artistic inference, one disputed example, unknown provenance.

Only call a pattern `validated` after original code implementation demonstrates a useful result on independent benchmark scenes, not because the idea sounds plausible.

## Output per deep-analyzed scene

`scene_annotation.json` → component hierarchy → palette/motion/shot records → one-page scene technical brief → 3–10 rules / questions → evidence IDs → one original design experiment → scoring and failure log.
