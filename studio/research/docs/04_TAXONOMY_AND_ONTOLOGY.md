# 04 — Comprehensive design taxonomy and ontology

The graph's ontology must be expandable. These categories describe **research targets**, not verified findings from 397 videos.

## 16 top-level design domains with leaf examples

1. **Characters/humanoids:** infants/adults/elderly, stylized proportions, eyes/brows/mouths, skin shading, clothing, hands, poses, interaction, crowds, crowd cycling, facial rigs.
2. **Animals/organisms:** birds (wings, feathers, claws, tails), mammals (fur, quadruped gait), dinosaurs/reptiles (scales, claws, locomotion), insects (exoskeleton, wings), marine animals (fins, swimming), microbes/viruses/cells, fungi and plants.
3. **Shape grammar:** primitive forms, Bézier curves, shape families, symmetry/asymmetry, modular silhouettes, negative spaces, attachments, contour complexity, local deformation, construction constraints.
4. **Colors/materials:** role palettes, OKLCH/sRGB, value separation, local light, gradient orientation, highlight shape, occlusion shadow, roughness illusion, texture and dithering.
5. **Environments:** prehistoric landscape, forest, desert, ocean, mountains, villages, cities, interiors, underground, underground cutaways, underwater, atmospheres, space, stylized planets.
6. **Objects/props:** household, laboratory, medical, chemistry, machinery, tools, spacecraft, cars, aircraft, buildings, bones, equipment, diagrams, devices, weapons-as-historical-facts where relevant.
7. **Composition:** visual hierarchy, rule of thirds, contrast direction, scale, negative space, hero subject separation, foreground framing, depth, information density, caption safe area.
8. **Animation:** rigs, FK/IK, joint pivots, shape morphs, cycles, squash/stretch, ease curves, anticipation, follow-through, wave dynamics, cloth/fur/feather secondary motion.
9. **Cinematography:** camera transform, framing, pan, tilt, dolly-like parallax, zoom, rotation, depth layers, match cuts, reveal, focus staging.
10. **Effects:** fire, water, smoke, dust, splashes, clouds, sparks, particles, glow, atmospheric haze, impact, energy, motion streak, stars.
11. **Visual metaphors:** personification, scale changes, cutaways, analogy maps, process diagrams, probability metaphor, time compression, uncertainty depiction.
12. **Story & pacing:** hook, reveal, tension, payoff, information beats, visual callback, emotional beats, storyboard sequencing, scene timing.
13. **Audio sync:** beats, narration alignment, lip/flap/click synchronization, score transition cues, SFX timing, attention shifts, accessibility.
14. **Typography:** title, labels, annotations, charts, numeric information, uncertainty notation, high contrast, localization, sans-serif/geometry (use appropriately licensed fonts only).
15. **Production:** storyboard, vectors, reusable component libraries, rig modules, shot breakdown, renders, color management, versioning, source control and QA.
16. **Procedural generation:** parameter dictionaries, random seeds, constraints, rule graphs, geometry factories, motion presets, shader/material presets, consistency propagation, auto-layout.

## Cross-domain links (examples)

`BirdWing --HAS_COMPONENT--> PrimaryFeather`  
`PrimaryFeather --USES_SHAPE_GRAMMAR--> TaperedBezier`  
`FeatherLayering --AFFECTS--> SilhouetteReadability`  
`FlightCycle --ACTUATES--> WingJoint`  
`ForegroundFoliage --CREATES_DEPTH_CUE--> ParallaxOcclusion`  
`VisualMetaphor --EXPLAINS--> ScientificConcept`  
`ContrastRule --VALIDATED_BY--> BirdBenchmarkExperiment`

## Node type candidates

`Video`, `Scene`, `Evidence`, `Observation`, `Pattern`, `DesignRule`, `AssetClass`, `AssetInstance`, `Component`, `Primitive`, `PaletteRole`, `Material`, `Rig`, `MotionCurve`, `Transition`, `Environment`, `NarrativeFunction`, `Generator`, `Benchmark`, `Experiment`, `Failure`, `License`, `Source`, `ResearchTask`.

## Relationship types

`PART_OF`, `CONTAINS`, `OBSERVED_IN`, `SUPPORTED_BY`, `CONTRADICTED_BY`, `INFERRED_FROM`, `ABSTRACTS`, `IMPLEMENTS`, `DEPENDS_ON`, `HAS_COMPONENT`, `USES_SHAPE`, `USES_MATERIAL`, `USES_RIG`, `HAS_MOTION`, `OCCURS_IN`, `EXPLAINS`, `TESTED_BY`, `IMPROVES`, `REGRESSES`, `VERSION_OF`, `DERIVED_AS_ORIGINAL_IMPLEMENTATION_OF_RULE`.

Never use `COPIED_FROM` as a production asset dependency. Preserve evidence links separately from output source code; avoid importing copyrightable visual expression.

## Vocabulary and extensibility

Every taxonomy addition needs a stable code, human-readable name, description, exclusion notes, synonyms, parent/child links, and one hypothetical or sourced example. Merge synonymous terms; avoid simultaneously treating `bird wing`, `avian wing`, and `wing of bird` as distinct class IDs without mapping. Support multiple classification labels rather than forcing an asset into one leaf.

Taxonomy depth can exceed six levels where useful but should be driven by research and generator needs, not arbitrary node-count targets.
