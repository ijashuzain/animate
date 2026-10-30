# 10 — Bird reconstruction benchmark: from simple SVG to production-quality rig

**This is an original procedural character benchmark. It must not copy a distinctive Kurzgesagt bird.** The purpose is to convert evidence-backed generic techniques into code and test whether they improve quality.

## Asset specification

- Character: original stylized forest bird, plausible anatomy, 3/4 side view.
- Geometry: body volume, chest/underbelly, head and crown, articulated beak, eyes/lids, crest, shoulders, upper/lower wings, multiple groups of primary and secondary feathers, layered tail fan, legs and toes.
- Detail: controlled feather length and fan distribution; explicit overlap/occlusion ordering; separate color patches, self-shadow shapes, highlights and feather markings; depth hierarchy designed for 1080p *and* thumbnail visibility.
- Environment: separate foreground/midground/background vegetation and ground silhouettes; parallax; original lighting and gradients.
- Animation: idle breathing, blinking, head tilt, anticipation, takeoff, sustained wing cycle, controlled glide, landing; camera move as optional independent track.
- Source: editable vector + deterministic rig code and documentation.

## Six construction subsystems

**Silhouette optimizer:** parameterized Bézier curves and proportions selected for pleasing shape and species identity, not exact traced frames.  
**Feather generator:** individual tapered swept splines, grouped by wing region, local angle/length/width, rachis/vein suggestion only where visually useful.  
**Materials:** directional gradients, subtle shape highlights, masked shadow zones, local hue variation.  
**Rig:** shoulder, elbow/wrist, fan fold, tail root, head/neck, eyes and optional legs.  
**Motion:** phase-aligned but non-identical feather response, easing and follow-through with fixed seed.  
**Scene:** value separation against backgrounds, focal area, realistic stage blocking and environmental motion.

## Implementation order

1. Shape thumbnails for five original silhouettes; rank readability in light/dark environments.
2. Build editable body and layered wing fan with named components; ensure major pose extremes retain outline.
3. Add controlled shading/marking layer and verify anatomy still reads at 256px.
4. Implement parametric pivot rig and five pose states.
5. Blend flight cycle with feather flex and small tail/head counter-movements; plot joint angles/frame.
6. Place in forest scene with multi-plane parallax and gentle camera movement.
7. Render a 1080p/30fps 4–8s clip and inspect contact sheet and complete motion.
8. Run blind quality scoring and A/B test; store benchmarks, report failures, iterate.

## Parametric example (planning values, not reverse-engineered measurements)

```json
{
  "bird_id": "bird.original.forest.v1",
  "seed": 1227,
  "shape": {"body_length": 1.0, "head_radius": 0.24, "beak_length": 0.19, "wing_span": 1.5},
  "feathers": {"primary_count": 10, "secondary_count": 9, "tail_count": 7, "variation_seed": 1227},
  "rig": {"shoulder_pivot": [0.13, -0.12], "wing_elbow_flex": true, "tail_delay_frames": 3},
  "motion": {"cycle_hz": 2.2, "anticipation_frames": 15, "blink_interval_frames": 85}
}
```

Values are placeholders to be tuned by original design tests and biological constraints; do not misreport them as Kurzgesagt measurements.

## Benchmarks and rejection criteria

Reject asset variants with straight/robotic wing rotation, a rigid pasted-on feather fan, inconsistent 3/4 perspective, shading contradictory to light direction, silhouette collapse at flap extremes, excessive ornamental noise, missing pose transitions, or unauthorized visual copying.

Acceptance requires editable parts, visible improvements over baseline, original visual identity, deterministic results and documented quality review.
