# 06 — Engineering a procedural animation studio

## Core principle

The target is **not a static SVG with animated translation**. It is a hierarchical, editable and renderable *scene program* with geometry factories, material system, articulated anatomy, animation state machines, camera, compositing, physics-inspired secondary motion and deterministic frames.

## Functional architecture

```text
Science script + fact sheet + narration timing
  ↓ narrative planner (topic → acts → scene beats)
Storyboard planner (shot types, duration, reveal, camera)
  ↓
Asset resolver (which procedural characters/environments/props?)
  ↓
Geometry factories (shapes + component tree + mask/gradient)
  ↓
Rig builder (joints, deformers, pivot hierarchy, constraints)
  ↓
Scene graph (foreground, character, midground, background, text)
  ↓
Timeline (named actions, easing curves, transitions, cues)
  ↓
Renderer (SVG/Canvas + Remotion; optional Blender for 3D)
  ↓
MP4, PNG contact sheet, source code, diagnostics, QA report
```

## Coordinate and animation contract

- Author in logical viewBox, render at configurable aspect ratio (default 16:9, 1920×1080), fps (default 30), fixed seed.
- Geometry is in local asset coordinates; all transformations compose as parent × child matrices. Scene scale and camera transforms remain separate.
- Animation functions are pure: `state(frame, fps, seed, params)`; no frame-order dependency, random drift, hidden mutable state or non-deterministic web requests.
- Rig elements expose named controls: `head.angle`, `eye.blink`, `wing.left.shoulder_angle`, `wing.left.primary_fan`, `tail.spread`, `body.bob`.
- Material library exposes base color, shadow colors, highlight shape, gradient stops, masks and clipping; distinct enough for different subjects.
- Original colors and shape proportions are selected by documented constraints and creative goals; no tracing of unique reference characters.

## Detail hierarchy

**Level 0 – silhouette:** recognizable outline, proportion, pose.  
**Level 1 – structure:** meaningful anatomy, component segmentation, joint occlusion.  
**Level 2 – material:** color zones, masks, shaded patches, highlights, occlusion shading.  
**Level 3 – ornamentation:** feather vane markings, varied plume tips, scales, plant leaflets, small parts.  
**Level 4 – performance:** rigged articulation, secondary motion, expressive acting.  
**Level 5 – cinematic integration:** blocking, depth, camera, effects, audio synchronization.

Do not add arbitrary decorative noise to inflate detail. Each detail must clarify volume, identity, material or action. Run a readability test at thumbnail size.

## Rigging patterns

- Two-dimensional articulated skeleton with parent-child pivots, non-uniform transforms and optional mesh/Bezier deformation.
- For bird: pelvis/body anchor, neck/head chain, each wing shoulder → elbow/wrist → feather fan, tail root + feathers, eyes/lids, optional legs/feet.
- Multi-feather fans use parameterized spline centerlines and swept tapered profiles, ordinal overlap, individual gradients and controlled jitter from fixed seed.
- Pose blending: idle, alert, crouch, takeoff, flight, land, blink, look-around. Transition smoothly with physical plausibility and appeal.
- Secondary animation: delayed tail rotation, wing-feather lag, subtle belly movement, wind ripple and leaf motion; use bounded spring/easing functions.

## Production scene system

A scene is a serializable manifest:

```json
{
  "scene_id": "original_forest_bird_intro",
  "duration_frames": 180,
  "fps": 30,
  "camera": {"start": {"x": 0, "y": 0, "zoom": 1}, "end": {"x": 30, "y": -10, "zoom": 1.12}},
  "instances": [
    {"asset_id": "bird.original.v1", "layer": 20, "position": [780, 560], "actions": [{"name": "look", "start": 0, "duration": 35}, {"name": "takeoff", "start": 65, "duration": 95}]},
    {"asset_id": "forest.original.v1", "layer": 0, "position": [0, 0]}
  ],
  "narration_cues": [{"frame": 60, "semantic_event": "bird_takes_flight"}]
}
```

This is a **design spec example**, not an executable engine or claim of source likeness.

## Tools and responsibilities

- Python: research ETL, data schema, geometry calculations, image quality/QA and optional SVG writer.
- SVG + TS: vector asset components, per-frame transforms and editor-friendly inspectability.
- Remotion: scene scheduling, preview, narration, compositing, MP4 export; independently verify current license eligibility and local tool versions.
- Blender Python: advanced camera perspective, 3D planets, controlled volumetric or 3D elements when needed; inspect licenses of models/textures.
- Manim: choose for mathematically accurate plots and scientific transformations, then integrate video as original footage; it is not mandatory for every scene.

## Engineering quality gates

- All rendered frames have identical hashes across repeated renders given same code/config/runtime.
- ViewBox proportions and joint transforms remain valid at 1080p and 4K.
- No geometry self-intersections causing obvious artifacts, out-of-frame leaks, unmasked shadow bleeding or disappearing subject.
- Movement preserves shape continuity unless deliberate squash/stretch or morph.
- Exported SVG still editable; no hidden baked reference frame backgrounds.
- Complete 30–60s demonstration reproducible from one command, with dependencies/lockfiles and media rights manifest.
