# 07 — Quality evaluation, originality and benchmark protocol

**Never use a single numerical similarity-to-Kurzgesagt score as the goal.** High-quality original explainer animation is the goal. A simple objective metric cannot fully judge aesthetics, learning effectiveness or copyright risk.

## Three layers of measurement

### A. Automated correctness

- Geometry: SVG well-formed, paths parse, clipping valid, finite coordinates, no self intersection where disallowed, components inside bounds.
- Render: dimensions, fps, frame count, video codec/audio stream validity, no black/blank/unintended flash frames, color management consistent.
- Temporal: frame continuity, no unexpected teleporting, camera easing, stable image registration, rig pivot trajectories, joint bounds, no unintended clipping/flicker.
- Determinism: repeated single-frame and full-clip renders hash-identical in fixed environment; random seed recorded.
- Research lineage: benchmark refers to source-backed general rules; no source AV unlawfully embedded.

### B. Blind human review

Score each category **1–5** with written evidence and examples; 2 reviewers preferred for major gates:

1. Silhouette readability (normal and thumbnail scale)
2. Anatomical plausibility under chosen stylization
3. Shape craftsmanship (curves, contour smoothness, proportion)
4. Material/shading quality (light and color logic)
5. Meaningful micro-detail (clarity without clutter)
6. Motion appeal (spacing, easing, overlap, intent)
7. Rig consistency (pose quality in every frame)
8. Composition and environment integration
9. Explanation effectiveness and scene pacing
10. Originality and avoidance of recognizable copying

Show category scores, score distribution, confidence and reviewer comments. Do not only report an overall average.

### C. A/B experiments

Change **one design variable or intentional small set** at a time:
- uniform feathers vs feather-length distributions;
- fixed wing rotation vs articulated elbow/wrist/feather fan;
- one body gradient vs structured shadow patches + feather highlight geometry;
- static environment vs layered parallax;
- linear motion vs authored easing + anticipation + follow-through.

Pre-register hypothesis and baseline. Keep same scene duration, lighting, composition, resolution and reviewers. Record what improved, degraded, or remained inconclusive.

## Benchmark suite

**Bird still:** 3 poses (rest, wings-up, wings-down), 3 sizes (1080p, 720p, 256px thumbnail), background light/dark, different materials; compare readability and detail.

**Bird motion:** 4–8 s with idle → alert → takeoff → flight → landing; 30fps; check continuity, rig stability and silhouette during key poses.

**Environment:** forest with ≥3 original apparent depth groups; camera drift and object parallax with no occlusion errors.

**Diagram:** an original 10-s scientific mechanism explanation, e.g. a red blood cell and markers, evaluating conceptual clarity; do not copy a published diagram.

**Full scene:** 30–60s with narration and correctly timed scene transitions; scientifically reviewed.

## Suggested pilot quality targets (not established facts)

- ≥4/5 median in silhouette, geometry and material for still asset.
- ≥4/5 median in motion/rig for an animated bird test.
- Zero critical frame corruption, copyright violations or false-evidence claims.
- Every major improvement traceable to an experiment ID and versioned code change.

These are **internal acceptance targets**, not a guarantee of professional parity; adjust after reviewer calibration.

## Originality audit

Ask: “Would an ordinary viewer recognize a particular protected character, composition or branded design as a near-copy?” If yes, redesign. Use references for broad principles, while deliberately choosing original silhouettes, palettes, settings, storyboards and characters.

## Evaluation report example

```text
experiment: bird_feather_overlapping_v2
baseline: bird_v1.0
change: hierarchical feathers + controlled shape variation
inputs: own generated rig and scenes only
status: planned / running / completed
scores: not filled until actually reviewed
failures: none claimed until tested
results: do not pre-fill
```
