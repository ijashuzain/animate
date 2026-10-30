# Master Agent Manual — Animation Research & Procedural Studio

**Created as a proposed engineering plan, not an accomplished 397-video study.**

This consolidated manual contains the agent contract, research methodology, original-code animation architecture, evidence requirements, 397-video coverage plan, quality evaluation procedures and practical execution steps. The modular files in the repository are authoritative for updates.

## Contents

1. AGENTS.md
2. docs/00_MISSION_AND_ACCEPTANCE.md
3. docs/01_RIGHTS_AND_PROVENANCE.md
4. docs/02_CATALOG_AND_COVERAGE.md
5. docs/03_VISUAL_MOTION_ANALYSIS.md
6. docs/04_TAXONOMY_AND_ONTOLOGY.md
7. docs/05_KNOWLEDGE_GRAPH.md
8. docs/06_PROCEDURAL_GENERATION.md
9. docs/07_EVALUATION_BENCHMARKS.md
10. docs/08_AGENT_ORCHESTRATION.md
11. docs/09_QA_AND_AUDIT.md
12. docs/10_BIRD_BENCHMARK.md
13. docs/11_ROADMAP_AND_BUDGET.md
14. docs/12_OFFICIAL_SOURCES.md
15. docs/13_GETTING_STARTED.md
16. docs/14_AUTHORIZED_MEDIA_ANALYSIS.md
17. docs/15_PROCEDURAL_RECIPES.md
18. docs/16_VIDEO_STUDY_WORKSHEET.md
19. docs/17_AGENT_TASK_BOARD.md

---



---

# FILE: `AGENTS.md`

# AGENTS.md — Mandatory Instructions for All Agents

## Identity and objective

You are a research engineer, graphics programmer, information architect, and technical reviewer working on an **original code-first educational animation studio**. Investigate the public Kurzgesagt channel as a reference corpus **within the law, platform rules, and access rights**, extract transferable craft principles with evidence, and improve generator quality through experiments.

## Priority order

1. Rights, permissions, data security and source integrity.
2. Accurate evidence, falsifiable claims and provenance.
3. Reproducible coded construction and objective quality assessment.
4. High visual quality, maintainability, and cost efficiency.
5. Breadth of catalog coverage.

If breadth conflicts with evidence quality, preserve evidence quality. Never claim complete analysis when it did not occur.

## Mandatory protocol on every run

1. Read README, mission, rights, methodology, schema, and most recent run log.
2. Check tool and filesystem capabilities. Report missing credentials, permissions, source files, or executable dependencies; use documented fallback paths.
3. Determine `snapshot_id`, exact scope, current batch, spend/resource limits, outputs expected and whether lawful visual media are provided.
4. Pick the next **bounded** task from the queue and create a task manifest. Never launch a runaway 397-video job.
5. Ingest metadata using authorized API paths and retention rules; never bypass protections, scrape the YouTube player, or download/store YouTube AV material without required authorizations.
6. Analyze only material actually accessible. For public embedded playback, human-assisted annotation of visible moments may be appropriate; mark the method. For automated frame extraction, require rights-cleared local files and record the permission.
7. Write evidence records **before** asserting pattern rules. Pattern hypotheses need at least two independently sourced instances unless explicitly labeled `single_example`.
8. Test generated original SVG/rig/video outputs; report numeric measurements and human review separately.
9. Run schema, lineage, licensing, QA and deterministic-build checks.
10. Produce a batch summary with completed/blocked work, false leads, uncertainty, hashes, file paths, and next prioritized tasks.

## Strong prohibitions

- Do not invent frame timestamps, inspect inaccessible frames, fabricate observations, or present estimates as measurements.
- Do not infer original source code, rig, path count, layer names, animation curves, or software settings from rendered frames as known facts.
- Do not copy distinctive characters, exact bird designs, composition layouts, narration, or audio; generate independent assets from general methods.
- Do not auto-publish copyrighted reference stills, transcripts, audio, thumbnails, proprietary font files or raw metadata violating retention policies.
- Do not commit secrets, API keys, user credentials, absolute personal paths, or large footage to Git.
- Do not optimize for pixel-for-pixel imitation of a reference work. Measure craftsmanship and functional motion independently.
- Do not silently mark unviewed videos as analyzed; inaccessible videos remain `blocked`/`metadata_only`.
- Do not claim to train or fine-tune a model unless a training pipeline, dataset rights and proof of execution exist.
- Do not run costly cloud APIs or compute-intensive jobs without configured budgets and review gates.

## Research recording rules

Every observation MUST identify:
- A stable video identifier or other permitted reference identifier;
- accessible source URL and when it was inspected;
- method (`official_production_notes`, `human_viewing`, `licensed_frame_sequence`, `licensed_video`, etc.);
- time range and frame numbers when applicable, otherwise null;
- what was actually seen (`observation`), what was deduced (`inference`), and confidence with rationale;
- source permission/retention class, reviewer and status.

All rules and measurements must report sampling limits. Do not claim prevalence across all videos until sampling is representative and denominators are explicit.

## Generator contract

Generate original designs with parameterized geometry, explicit rig pivots, layered scene graph, frame-based deterministic animation, fixed seed, and independent visual polish. Every asset: specs, source code, preview, minimal animated test, provenance of abstract design principles, version, automated tests, evaluation record. Use sensible original palettes, not literal tracing of reference palettes or branded characters.

## Stop and escalate when

- Rights are unclear for proposed media extraction/storage; no circumvention workaround.
- Source differs from cached snapshot or a video has been removed/private.
- Data lacks provenance, may have a mistaken timestamp, or contradicts other evidence.
- A cost limit, runtime limit or dataset publishing restriction is reached.
- Quality regression affects benchmark scenes.

## Standard end-of-batch report

```text
Batch ID | snapshot ID | agent version | commit hash
Planned / processed / validated / blocked / metadata-only
Evidence access and rights summary
New observations / patterns / assets / experiments (counts)
Significant findings (with evidence IDs)
Uncertainties, contradictory cases, failed experiments
QA metrics and benchmark changes (with baselines)
Costs (tokens, API calls, CPU/GPU minutes, storage)
Next 3 actionable tasks and their gating requirements
```

**Agent work should run in a real coding environment with approved access. These documents alone do not cause autonomous background execution.**


---

# FILE: `docs/00_MISSION_AND_ACCEPTANCE.md`

# 00 — Mission, success criteria and research questions

## Goal

Build a traceable knowledge system that helps a solo creator synthesize original, professionally polished educational animation using code. The reference corpus is used to study effective *general craft principles* in visual explanatory animation. The deliverable is not a Kurzgesagt asset dump or exact stylistic replica.

## Three independent outcomes

**Research outcome:** coverage-tracked, source-backed observations of shapes, illustration, composition, narrative visual metaphors, typography, effects, motion, scene transitions, camera and 2D/3D integration.

**Engineering outcome:** maintainable procedural generators for people, birds, animals, cells, machinery, plants, landscapes, astronomy, infographic objects, and effects; frame-deterministic scene and timeline engine.

**Production outcome:** an original 30–60-second science sequence with synchronized narration, technically verified facts, coherent animation, consistent character assets, exportable 1080p MP4 and source code.

## Research questions

1. Which properties recur across the corpus, and in which historical periods, topics, or scene types?
2. How are complex organic silhouettes compressed into geometric/Bezier systems while retaining recognizability?
3. What layer groups, masked gradients, highlight patches and decorative elements contribute most to perceived detail?
4. How does the visual language distinguish background, midground, hero subject, scientific inset and callout?
5. What temporal patterns recur for wing flaps, walk cycles, breathing, anticipation, overlap, transition, reveals and diagram transformations?
6. Which findings generalize across mammals, birds, insects, cells, vehicles, planets, landscapes and infographics?
7. Which properties are reproducible with SVG and 2D rigs; which need mesh-based deformation, 3D, particles or hand-keyed animation?
8. Which abstractions measurably improve generated content versus the project's own baseline?

## Definitions

- `cataloged`: ID and source URL verified.
- `metadata_reviewed`: topic/category/date/duration collected with allowed API or manually checked.
- `visually_reviewed`: one or more specific visual moments actually viewed, with evidence method.
- `motion_reviewed`: a sufficiently dense *authorized* time sequence viewed or analyzed; fps and duration recorded.
- `deep_analyzed`: multiple scenes annotated across 6 visual dimensions and motion + QA reviewed.
- `reconstruction_tested`: original code-based reconstruction tested against design requirements; not literal pixel imitation.
- `validated_pattern`: evidence provenance, multiple examples and code benchmark demonstrate utility.

Coverage is a multidimensional vector, never one ambiguous percentage.

## Acceptance gates

**Gate A (inventory):** reproducible channel discovery, immutable snapshot identifier, exact denominators, pagination completeness, duplicates and inaccessible items documented, no unjustified '397 verified' claim.

**Gate B (pilot):** five diverse video selections, at least three with authorized visual evidence, 30+ distinct grounded observations (or explain lower count), 10+ rules with confidence, five source-backed code tests. These are **targets**, not observed achievements.

**Gate C (asset):** original bird contains hierarchical anatomy, editable feather groupings, gradient/mask materials, pose/wing rig, idle/blink/fly actions, 360-degree-orientation feasibility decision, and benchmark scorecard.

**Gate D (system):** manifests, JSON Schema, provenance integrity, deterministic code rendering, batch resume, failed task recovery and CI tests.

**Gate E (production):** ≥30-second completed original science explainer, 1080p/30fps, stable 2D scene graph, coherent motion, no copied audio or protected footage, human-reviewed scientific and visual quality.

Do not equate a high node count with project success. Prioritize validated rules and reproducible quality improvements.


---

# FILE: `docs/01_RIGHTS_AND_PROVENANCE.md`

# 01 — Access, copyright, licensing, attribution and retention

**This is an operational policy, not legal advice. Review actual permissions and current platform rules before running ingestion.**

## Allowed default workflow

1. Use the **official YouTube Data API** for channel ID, upload playlist, video IDs, metadata and links, subject to its policies and data retention limits.
2. View videos through YouTube's officially provided interfaces/embedded player according to applicable terms; take structured **notes about what is visibly observed**, not copies of the video.
3. Use Kurzgesagt's own publicly available explanations of their methods as attributed references. Cite URL, access date and quote only minimally.
4. Analyze local audio/video/image files automatically **only if you have rights and access permitting extraction, analysis, storage, and publication of derivative analytical artifacts**. Record permission and access grant in `rights` records.
5. Store original, independently authored assets, generic design abstractions, mathematical curves, code and self-generated renders in Git.

## Disallowed default workflow

- Bulk YouTube video downloading, importing, caching, backing up or storing through the API without prior written approval; downloading through unofficial tools, bypassing protections, automating unauthorized capture or scraping to circumvent access rules.
- Publishing a collection of source frames, copyrighted artwork, audio, transcripts, thumbnails or scene-matched recreations without rights.
- Redistributing a reference-derived character design or image as an original asset.
- Assuming a publicly viewable video is public domain or usable to train an AI model.

YouTube's current API developer policy specifically restricts download/import/backup/cache/store copies of YouTube AV content without YouTube's prior written approval; the Terms also regulate automated access and reproduction. Consult the official policies linked below and obtain needed permissions. A rights holder's permission does not necessarily waive separate platform requirements.

## Rights states

- `url_only`: may store source URL, non-infringing facts and compliant metadata, no downloaded AV.
- `public_viewing_notes`: manually reviewed via authorized viewing; store typed observations and timestamps, no AV copies in repo.
- `licensed_local_analysis`: files and transformations authorized for local automated analysis; follow license scope and retention.
- `licensed_redistribution`: explicit permission to redistribute permitted frames/assets, with license and attribution rules.
- `blocked`: rights/access unclear; prohibit automated processing until resolved.

For any automated analysis, `rights_manifest` must include owner, grant evidence location, permitted operations, storage/publishing allowed, expiry, jurisdiction/terms note and reviewers.

## API metadata retention

YouTube API developer policies include restrictions around storing/refreshing non-authorized data, commonly a maximum 30-day temporary cache for many fields. Implement refresh/deletion and per-field retention; do not make a permanent public dump of cached API responses. Store IDs, derived annotations and source URLs only to the extent authorized and necessary. Avoid storing counters or ephemeral fields indefinitely. Verify current details at run time.

## Git vs local research storage

**Public Git:** original code, design principles, citations, URLs/IDs, consented records, tests, schema and safe diagrams.  
**Private / temporary:** authorized local source media, frame crops if license permits, permission documents, private notes and API credentials. Keep separate from Git; auto-expire as required.  
**Never in Git:** API keys, scraped copyrighted audiovisual files, downloaded audio/transcripts, proprietary stills without redistribution permission, original artist/source assets not specifically licensed.

## Similarity guard

Judge original output for craftsmanship, biological readability, geometry quality, coherence and animation physics. Do **not** optimize a generated asset toward pixel-level correspondence with identifiable copyrighted frames or copy one distinctive branded character. Require an originality reviewer and explain differences in concept, shapes, layout, palette or ornamentation when references were involved.

## Provenance record minimum

- `source_url`, `retrieved_at`, `source_type`, `license_state`, `permissions_ref` (or null), `access_method`, `evidence_id`, `reviewer`, `content_hash` for authorized local file when present, `retention_until` if applicable.
- Every research claim should link back to 1+ evidence IDs and distinguish `observed`, `inferred`, `hypothesized`, `validated`.

## Primary sources

- [YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- [YouTube Terms of Service](https://www.youtube.com/t/terms)
- [YouTube API Services Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)


---

# FILE: `docs/02_CATALOG_AND_COVERAGE.md`

# 02 — Channel catalog and coverage strategy

## Inventory (do NOT use HTML scraping as a fallback)

1. Snapshot time in ISO 8601; choose stable ID e.g. `kurzgesagt-2026-10-31`.
2. Get the channel via YouTube Data API `channels.list(part=contentDetails,snippet; forHandle=@kurzgesagt)`. Save authoritative channel ID and `contentDetails.relatedPlaylists.uploads`; record API/terms version and user consent configuration as relevant.
3. Enumerate `playlistItems.list(part=snippet,contentDetails; playlistId=<uploads>; maxResults=50; pageToken=...)` to exhaustion. Track pagination and expected count; never stop at first page. For 397 uploads, **about eight 50-item pages** is a planning illustration, not a verified result.
4. Use `videos.list` in batches for duration/public stats where permitted; distinguish `unavailable`, `deleted`, `private`, `short`, `live`, `regular`, `unknown`; do not infer complete inventory from `videos` tab thumbnails.
5. Deduplicate by video ID while keeping upload order and playlist position.
6. Persist allowed canonical identifiers and observations; comply with API metadata refresh/retention restrictions (see 01).
7. Freeze a **manifest** of IDs and catalog scope as a research planning snapshot; rerun discovery for changes and reconcile additions/deletions without pretending the catalog is static.

## Scope rules

- All public uploads in uploads playlist at snapshot = `N_uploads_visible`. Separately track Shorts, livestreams, collaborations, multilingual/reissued versions and unavailable videos.
- The requester's '397' is an initial target only. Report real `N` and exclusions explicitly.
- If a video lacks authorized visual media, record `metadata_only` and link to manual watch queue; never invent frames.

## Topic stratification

Classify broad categories (multi-label): biology, medicine, evolution, chemistry, physics, astronomy, technology, society, ecology, disasters, future scenarios, philosophy, other. Additional visual strata: animals, cells, humans, vehicles, interiors, landscapes, space, explainer diagrams, typographic-heavy, 3D-heavy, high-action sequences.

Sample across **publication eras**: early, middle, recent by actual year percentiles or release batches (not pre-assumed aesthetic evolution); sample across topic/visual strata and complexity.

## Two-level analysis

**Pass 1 — coverage:** Verify metadata for each accessible upload; document permitted thumbnail-linked context only as allowed. Manually inspect broad narrative/visual traits where access allows, capturing timestamps and notes. Record whether each item was actually visually inspected. **No frame extraction from online streams.**

**Pass 2 — deep dive:** Select diverse high-value videos with authorized reference sequences. Segment shots/scenes; sample each distinct scene and densely sample motion events (if local media is licensed). Annotate components, parameters, performance and uncertainty. Make original-coded tests from design rules.

**Pass 3 — active-learning:** Choose next deep dives using uncovered asset classes, high conflict/uncertainty in patterns, new techniques, sparse eras or topics, and benchmark failure modes. Avoid choosing solely popular videos.

## Scene sampling from authorized local files

For licensed files only: extract resolution/fps/timebase; detect scene cuts; create a contact sheet and list of key moments; extract representative keyframes plus motion windows. Use adaptive density:
- slow/sustained scene: keyframe around each major visual change (e.g. approximately 1–2 s as a starting heuristic);
- fast animated scene: more densely around transitions, joint poses, explosions, camera moves (e.g. 4–12 fps or native fps for brief high-motion tests);
- never use fixed 1 fps as proof of frame-by-frame inspection or to derive precise easing.

Store exact sampled frames/count, allowed retention policy, sampling algorithm/version, and `coverage_gap` list. Never store unauthorized AV in the repo.

## Coverage dashboard fields

- `catalog_count`, `excluded_count`, `unavailable_count`, `unknown_count`
- `metadata_only_count`, `human_viewed_count`, `licensed_stills_count`, `motion_reviewed_count`, `deep_analyzed_count`, `reconstruction_tested_count`
- seconds of authorized source material actually inspected; scenes labeled; percent with evidence IDs
- mean confidence and distribution (not only average); unique visual families covered; unresolved claims
- per-topic and per-era breakdown; sampling and access biases

A target claim such as `397/397 analyzed` must carry definition, actual snapshot denominator and evidence-level breakdown.


---

# FILE: `docs/03_VISUAL_MOTION_ANALYSIS.md`

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


---

# FILE: `docs/04_TAXONOMY_AND_ONTOLOGY.md`

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


---

# FILE: `docs/05_KNOWLEDGE_GRAPH.md`

# 05 — Knowledge graph schema and evidence lineage

## Source of truth and indexing

Use immutable, reviewable JSON records in Git as source-of-truth for original analytical statements. Prefer JSONL by entity type when the dataset grows; SQLite is a generated index, not the only copy. A Neo4j server is unnecessary at pilot scale and adds operational overhead. Use content-addressed IDs for evidence where possible and semantic IDs for patterns (`shape.feather_taper.v1`).

## Graph model

Nodes represent original observations, abstract rules, asset specifications, experiments and source references. Edges may be stored as JSONL `{subject, predicate, object, status, evidence_ids, created_at}`. **All evidence-dependent edges must link to evidence records.** Generated assets link to *general design rules*, not to copied frame resources.

Example graph path:

`Source(video URL) → Observation('wing contains visible overlapping feather groups') → Pattern('layered taper groups improve wing readability') → DesignRule('vary scale/angle and occlusion') → Generator('feather_fan') → Asset('original_bird_v1') → Experiment('bird_bench_v1') → Evaluation('passes 3 of 5 quality criteria')`

## Evidence and hypotheses

- Observed fact: directly documented event or visible characteristic with timestamp/method.
- Inference: proposed underlying construction from a rendered visual; always labeled.
- Hypothesis: generalizable idea to test, not a finding yet.
- Validated rule: implemented and tested against multiple relevant independent cases, with baseline comparison and reviewer evidence.
- Contradiction: alternative finding retained, not silently discarded.

Do not collapse these states into a generic 'truth' field. Confidence numeric 0..1 is a *reviewer estimate*, not a calibrated probability; always provide rationale and uncertainty boundaries.

## Example records

See `data/examples/` for **synthetic** records designed solely for schema testing. They are not observations of actual Kurzgesagt videos.

A `Pattern` has: identifier, category, statement, parameterization, scope and exclusions, evidence IDs, contradictions, confidence/status, associated generator IDs, version, created/reviewed timestamps and review history.

An `Asset` has: unique ID, version, asset class, original IP status, source code path, param schema, rig definition, preview and animation paths, quality tests and benchmark scores.

An `Experiment` has: hypothesis, baseline, changed variables, test dataset IDs, metrics, results (if run), failure modes, reviewer, and reproducibility hashes.

## Query patterns

1. “What documented rules improve feather detail?” → query patterns in `anatomy/feathers` with `validated` status; sort by independent supporting evidence and original test success.
2. “How to animate a bird taking off?” → union `flight_cycle`, `anticipation`, `pivot`, `tail_lag`, `camera_follow` rules; exclude low-confidence guesses.
3. “Which recent scene types have been under-sampled?” → cross join actual catalog topic/era counts with visual evidence coverage; do not infer content from title alone.
4. “How did bird quality improve?” → join assets, experiments, scored videos/renders and baselines across versions.

## Deduplication and versioning

- Stable ID for a video is YouTube `videoId`; stable source time location uses ID and start/end milliseconds.
- Two observations may refer to same moment but disagree; preserve both until reviewed.
- Do not silently edit published evidence; append `supersedes` and audit notes for substantive corrections.
- Associate code experiments with Git commit, environment manifest, random seed, render fps/resolution and dependency lockfile.
- Report coverage without double counting references or duplicate scenes.

## Integrity checks

- Every `evidence_id` referenced by observation/pattern exists.
- A `validated` pattern has at least one completed experiment and independent review, plus appropriate source evidence; targets may require multiple references.
- Every `motion_reviewed` scene identifies authorized method and temporal sampling.
- Every `asset` has an originality statement and a generator file under your own source tree.
- No API secret or unauthorized binary source frame in tracked paths.

## Optional graph export

Generate an index in SQLite for FTS and recursive traversal or GraphML for viewing. The derived export may be discarded/rebuilt from JSON. Avoid building a complex graph database before 100 well-grounded observations exist.


---

# FILE: `docs/06_PROCEDURAL_GENERATION.md`

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


---

# FILE: `docs/07_EVALUATION_BENCHMARKS.md`

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


---

# FILE: `docs/08_AGENT_ORCHESTRATION.md`

# 08 — Multi-agent orchestration and resumable execution

## Proposed roles

**Coordinator:** assigns bounded tasks, protects quotas and rights, checkpoints work and handles escalation.  
**Cataloger:** retrieves compliant metadata, reconciles uploads/deletions and coverage counts.  
**Evidence analyst:** performs accessible manual observation or licensed-media analysis; produces cited notes.  
**Design analyst:** maps observations to measurable geometry/material/composition/motion abstractions and alternatives.  
**Ontology editor:** deduplicates graph nodes and evidence edges.  
**Graphics engineer:** implements original SVG components, geometry and rigs.  
**Animation engineer:** builds deterministic motions, camera, transitions and compositing.  
**Evaluator:** checks renders blind against baseline, originality, visual quality and technical tests.  
**Auditor:** validates rights, evidence integrity, schemas, status and release readiness.

In a low-budget project, **one coding agent can perform these roles sequentially**, preserving the same interfaces and independent review checkpoints. Don't deploy eight paid agents unless throughput justifies cost.

## Task lifecycle

`queued -> rights_checked -> source_available -> in_progress -> evidence_review -> validated -> merged`  
Alternate: `blocked` (source/rights missing), `needs_review`, `failed_retryable`, `failed_final`, `superseded`.

Tasks are idempotent. Each writes a separate output directory, checkpoint manifest, audit log, hash and status. On restart, recompute only stale/failed outputs. Avoid simultaneous writers to one JSONL or SQLite database: use merge-on-review or transactional writes.

## Recommended batching

- Batch 0: rights and repo bootstrapping.
- Batch 1: metadata discovery for entire channel in compliant pages, 1 catalog reconciliation report.
- Batch 2: sample 5 videos across visual/era strata; **do not** deep-analyze 397 at once.
- Batch 3: evidence-supported observations → graph → first code experiments.
- Batch 4: bird benchmark rig and 4–8s animation, 2 visual review iterations.
- Batch 5: broaden 20-video stratified subset; then prioritize via information gain and benchmark gaps.
- Later: progress through catalog in controlled batches; deliberately track coverage disparity across topics/eras.

Each batch has a task budget (`max_wall_minutes`, `max_api_calls`, `max_tokens`, `max_storage_mb`, `max_cost_usd`); these are configurable caps, not estimates of completion time.

## Evidence-first state machine

1. Source discovered? If no → `blocked`.
2. Media access authorized? If no → metadata + manual linked viewing only; no automated frame extraction.
3. Literal observation documented and reviewer approved? If no → do not create validated rule.
4. Pattern claim supported and conflicts checked? If no → `hypothesis`.
5. Code experiment passes original-quality and rights QA? If no → record failure and revise.
6. New evidence suggests contradiction? → mark old pattern `needs_review` rather than erasing it.

## Analysis prompt contracts

See `prompts/` for cataloger, visual analyst, graph curator and generator agent prompts. They force separation of observations, inferences, code decisions, evidence and permissions.

## Batch logs

Every run creates a manifest and readable report. The agent should never silently consume a large batch or claim successful completion before testing. Sample ledger:

```json
{
  "batch_id": "pilot-001",
  "snapshot_id": "to-be-generated",
  "stage": "planning",
  "video_ids": [],
  "completed": 0,
  "blocked": 0,
  "rights_state": "not_checked",
  "cost_usd": 0,
  "next_action": "verify source permissions and initialize catalog"
}
```

## Human gates

Require owner review before making the repository public, ingesting rights-sensitive media, selecting paid models/services, changing retention policy, and approving release-quality assets. Scientific and originality review are required before publishing a video.


---

# FILE: `docs/09_QA_AND_AUDIT.md`

# 09 — QA, validation, governance and reproducibility

## Source QA

- Source is correctly identified by stable ID and URL.
- Timecodes actually correspond to observed moments; if manual, mark approximate and playback method.
- Snapshot date exists, category is not title-only inference, coverage state is correct.
- Media analysis has rights manifest; no unauthorized local AV or reference frames tracked in Git.
- Confidence never expressed as certain when derived from one ambiguous still.

## Schema QA

- JSON validates against schemas; references resolve.
- No duplicate IDs in the same namespace; no orphaned edges.
- No generated asset claims `is_original=true` when it contains traced protected expression.
- Date and unit formats normalized; bbox includes reference resolution; opacity 0..1.
- Key terminology is in ontology vocabulary and synonyms mapping.

## Engineering QA

- Supported runtime and pinned dependencies; setup commands in docs.
- Reproducible deterministic render; fixed seed; no hidden remote assets.
- Frame-sampling and analysis tools run **only** against rights-cleared files.
- Licensed fonts and code dependencies verified; check Remotion licensing before commercial deployment.
- Per-shot 1080p output, FPS, alpha, color profile, A/V synchronization, overflow, and asset visibility tested.

## Human inspection QA

- Contact sheet covers initial, quarter, mid, three-quarter, end frames and all major pose transition events.
- Check poses in motion rather than only attractive stills.
- Verify anatomy, vector craft, gradation, environment cohesion, storyboard clarity and novelty relative to references.
- Critical scientific claims checked against primary scientific sources, which are separate from animation-style references.

## CI suggested jobs

1. Schema lint (`python scripts/validate_records.py`)
2. Link integrity and provenance graph checks
3. Restricted-file scan (no source AV, thumbnails, credentials, unauthorized frames)
4. SVG parse/render smoke tests
5. Deterministic frame and render tests
6. License/attribution manifests complete
7. Benchmark score regression dashboard from confirmed experiment data

## Auditing incorrect claims

A reviewer who finds a false claim should append a correction with new evidence and set the old record to `superseded` or `rejected`; never delete historical uncertainty silently. Report corrected coverage statistics and release a change log when a significant research interpretation changes.

## Publishing policy

Publish original coded assets, user-authored animated output, methods, graph abstractions and properly permissioned evidence. Hide/source-link rights-restricted materials in private local storage rather than exposing them in GitHub. Do not upload source-video-derived copyrighted thumbnails or sequences absent permission.


---

# FILE: `docs/10_BIRD_BENCHMARK.md`

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


---

# FILE: `docs/11_ROADMAP_AND_BUDGET.md`

# 11 — Roadmap, cost controls and scaling to the full catalog

## Phases (milestones, not promised durations)

**0 — Governance:** repository rules, rights policy, schemas, local environment, API quota and storage decisions. Exit when a sample validates cleanly and rights handling is proven.

**1 — Catalog:** retrieve channel uploads via official API, record snapshot denominator, classify availability and scope; no blanket assertion that 397 exist.

**2 — Pilot deep study:** select five diverse eligible sources, collect evidence and observations, construct first graph. Exit when five independent technical design rules lead to successful original-code experiments.

**3 — Core procedural engine:** build SVG shape grammar, rig architecture, scene graph, deterministic motion and render tests. Exit with bird benchmark at defined quality gate.

**4 — Focused expansion:** sample the next ~20 videos with particular attention to missing asset and animation families; new tested generators for human/plant/planet/cell/diagram. Avoid shallow bulk collection.

**5 — Catalog-wide coverage:** process remaining entries to appropriate legal/evidence depth in resumable batches. Some will remain `metadata_only` or `blocked` unless source access becomes authorized. Track uneven coverage.

**6 — Explainer pipeline:** given an original script, produce storyboard, scene list, assets, animation, narration sync, sound mix and complete 30–60s video; extend as quality permits.

## Cost controls

Configurable per-run caps: token usage, API calls, external inference costs, GPU/CPU minutes, local storage and media retention. No silent paid service, oversized model or cloud GPU. Low-budget priority: scripts and metadata first, local SVG render QA, targeted human reviews, expensive visual reasoning only for diverse hard scenes.

## Prioritization function

Rank candidate next task by:

`priority = (expected_information_gain × benchmark_relevance × uncovered_topic_factor × evidence_access_factor) / estimated_compute_cost`

This is a conceptual function; choose and calibrate coefficients after pilot. Rights-access factor is a hard gate for automated frame analysis, not a score that can override it.

## Concrete output after each milestone

- 0: audit-compliant starter with working validation.
- 1: catalog snapshot and coverage dashboard.
- 2: cited observations, contradiction notes, graph nodes/edges, technical briefs.
- 3: editable bird and rig, reproducible animation, benchmark report.
- 4: first mini library of distinct original asset families and verified reusable design rules.
- 5: transparent full-catalog coverage report and searchable graph; honest evidence gaps.
- 6: publishable original explainer built from code and scientific/rights review.

## Risks and mitigations

- **Insufficient media access:** do metadata/manual viewing, acquire explicit permission where possible, and use rights-cleared footage/your own generated scenes for engineering benchmarks.
- **Hallucinated analysis:** evidence IDs, timecodes, reviewer checkpoint, ban fabricated source observations.
- **Reference overfitting:** choose original design constraints and diverse educational sources; originality QA.
- **Shallow breadth:** representative deep samples and required code experiments before expanding.
- **Cost blowout:** capped batches, checkpoint/resume, deduplication and cheap prefilters.
- **Unmaintainable graph:** JSON Schema, ontology governance, code tests and clear IDs.
- **Overpromising automation:** require human creative/art-director and scientific-review gates.

## Exit definition

The project succeeds when the owner can reliably transform an original educational script into polished original animation *with code*, with traceable and continually improving craftsmanship. A 397-item catalog alone does not equal success.


---

# FILE: `docs/12_OFFICIAL_SOURCES.md`

# 12 — External primary documentation (checked 2026-10-31)

Check official sources again before implementation; current documentation and licenses may change.

- [Kurzgesagt — How we work](https://kurzgesagt.org/what-we-do?visit=videos) — reports vector/pixel illustration, infographics, 2D and 3D animation, and voiceover-led timing.
- [YouTube API Implementation: retrieve uploads](https://developers.google.com/youtube/data/guides/implementation/videos) — two-step uploads playlist discovery and retrieval.
- [channels.list reference](https://developers.google.com/youtube/data/reference/rest/v3/channels/list) — supports `forHandle`.
- [playlistItems.list reference](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list) — paginated uploads retrieval with max 50 results/request.
- [YouTube API developer policies](https://developers.google.com/youtube/terms/developer-policies) — restrictions on download/storage and API-data retention.
- [YouTube Terms](https://www.youtube.com/t/terms) — service access and permissions.
- [Remotion Docs](https://www.remotion.dev/docs) — React-based coded video rendering.
- [Remotion License](https://www.remotion.dev/docs/license) — free license eligibility; use current terms for a solo creator and future expansion.
- [Manim](https://docs.manim.community/en/stable/) — Python-based technical/math animation.
- [Blender Python API](https://docs.blender.org/api/current/) — scripting and 3D animation capabilities.
- [Python JSON Schema library](https://python-jsonschema.readthedocs.io/en/stable/) — schema validation.

**Unverified:** Exact list and total of videos currently available at the channel, exact visual methods in specific frames, and the amount of reference media one may legally use. Do not fabricate these.


---

# FILE: `docs/13_GETTING_STARTED.md`

# 13 — Hands-on agent onboarding (first session)

## You need

- Git and a local coding agent (Codex, Claude Code, or similar) with filesystem/terminal access.
- Python 3.11+; Node.js and a supported browser if/when developing Remotion scenes.
- Optional YouTube Data API key for **metadata only**. A public video URL alone does NOT authorize extracting frames or AV.
- Either manually authored notes with video IDs/timecodes from permitted viewing, or explicitly rights-cleared local reference media for automated frame analysis.

## First setup

```bash
# In the extracted starter folder
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
python -m pip install -r requirements-dev.txt
python scripts/validate_records.py
```

For the catalog, review current YouTube policy, get an API key and only then run:

```bash
export YOUTUBE_API_KEY='your-own-key-here'
python scripts/catalog_youtube.py --acknowledge-youtube-policy
python scripts/validate_records.py sources/*.jsonl
```

The catalog tool collects only IDs and URLs, paginates and makes **no** audiovisual download. Comply with API data-retention and refresh requirements. The video count printed is factual only when the API run succeeds.

## Paste to your coding agent

> Read `AGENTS.md` and all `docs/` files. Treat them as binding workflow rules. Do not claim the reference corpus has already been analyzed. First validate schemas and audit source rights. Then make an exact, idempotent 5-video pilot plan with accessible source list, evidence availability, metadata statuses, graph records, and original SVG/Remotion bird benchmark. No unauthorized downloads, frames, transcripts or protected assets. If the source media is unavailable for legal automated analysis, do not fake frames: provide a manual annotation template and work on original code-only render prototypes. After the batch, show files and validation results, uncertainties, permissions and next steps. Do not open a GitHub repo or spend money without explicit approval.

## Next developer steps

- Implement a real original bird with source files in `assets/bird/`, original forest environment in `assets/environment/`, Remotion components in `scenes/`, deterministic render CLI, and scored output in `reports/`.
- Replace synthetic examples with separate real, provenance-backed observations only after rights and source access are confirmed.
- Start with 3–5 diverse authorized examples before scaling; preferentially target patterns that measurably improve current benchmark defects.

## What has NOT been done by this package

- It has not accessed/verified all 397 video IDs.
- It has not downloaded or analyzed YouTube frames or full videos.
- It has not created a production-quality SVG bird or an end-to-end animation renderer.
- It has not trained/fine-tuned a generative model.

It is a carefully scoped set of **instructions, schemas, prompts and metadata tooling** to get there.


---

# FILE: `docs/14_AUTHORIZED_MEDIA_ANALYSIS.md`

# 14 — Authorized local video analysis procedure

**Default policy: never download or extract YouTube audiovisual content without applicable permissions.** This workflow only processes already-local media for which the operator has a documented license/permission that covers the intended use.

## Preflight

- `source_id` is stable and matches rights manifest.
- Media file is already present locally through authorized means.
- Rights manifest declares `licensed_local_analysis` or `licensed_redistribution`, provides non-synthetic `grant_reference`, `storage_allowed: true`, and includes `frame_extraction` in permitted operations.
- Media/output will stay in private Git-ignored folders and be deleted per specified terms. Do not treat a publicly watchable reference as sufficient permission.

## Safe local sampler

```bash
python scripts/sample_authorized_media.py \
 --local-video /path/to/authorized-local-video.mp4 \
 --rights-manifest /path/to/rights-record.json \
 --source-id OWN_VIDEO_001 \
 --start 0 --duration 8 --fps 3 --max-frames 24 \
 --acknowledge-media-rights
```

This creates 24 or fewer PNG files under ignored `source_frames/OWN_VIDEO_001/` plus a sampling report with ffprobe info. It performs no network access, refuses unapproved synthetic manifests, requires a rights grant reference, and refuses to overwrite existing output. Frames are sampling aids, not automatically legal to publish.

## Scene/motion sampling expansion

The provided sampler is only a **basic fixed-rate test**, not a finished frame-accurate motion pipeline. An engineer should add:

1. Authorized scene-cut detection with logged threshold, frame/PTS values and false-positive audit.
2. Adaptive shot sampling: coarse key moments + densely sampled wing/walk/transition windows.
3. Coordinate tracking, optical-flow verification, parallax vs subject movement separation, occlusion labels and confidence.
4. Temporal curves with error bars and explicit motion-fit model; avoid claiming native keyframe timing from a handful of rendered frames.
5. Storage retention job honoring `retention_until` and grant restrictions; publish only your own analytical facts and independent generator code.

## Manual-viewing alternative

When licensed local AV is unavailable, ask a human operator to view the embedded/publicly provided player where permitted and write a scene-note log: video ID, timecode range, visible subject/pose/colors/shot, approximate duration, evidence method `human_viewing`, uncertainty, and coding hypotheses. Do not label such work `licensed_video` or `frame_by_frame`.


---

# FILE: `docs/15_PROCEDURAL_RECIPES.md`

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


---

# FILE: `docs/16_VIDEO_STUDY_WORKSHEET.md`

# 16 — Per-video and per-scene research worksheet

Use this template for **each real video actually examined**. Empty/unavailable fields should be explicitly `unknown` / `not_accessible`; never fill from assumptions. It can be represented in JSON and split into records later.

## A. Source and access

- Snapshot ID; channel ID; video ID and canonical URL; title/date/duration only when reliably obtained.
- Public/private/deleted/unknown; regular/Short/live; topic/visual categories and basis of classification.
- Rights state; permission record ID; allowed processing operations; source version/hash if a licensed file exists; legal retention/deletion deadline.
- Observation access: official production notes vs permitted human viewing vs licensed images vs licensed motion sequence. Reviewer, date and notes.

## B. Global visual grammar

- 3–7 representative original descriptive phrases for recurring **observable** shape rules, not a style-label-only description.
- Perceived geometric complexity ranges, curve smoothness, hard vs soft boundaries, negative space practices.
- Color palette roles with qualitative descriptors or measurements from authorized frames; highlight and shadow strategy.
- Background depth logic and diagram aesthetic, typography, transition families.
- Differences from other examined works and evidence for historical change; do not assume constancy over 13+ years.

## C. Sequence/story segmentation

For each actual scene:
- Scene ID; source timecodes; subject(s); narrative purpose; shot/camera; foreground/midground/background; transition into/out of scene; technical/art questions.
- Whether scene is fully observed, sampled, human-viewed or inaccessible; sample frame count and temporal coverage.
- What action begins, accelerates, changes and ends; duration estimates vs measured values clearly separated.

## D. Asset and component annotations

For each prominent asset:
- Entity class and task (hero, atmosphere, diagram, crowd, prop, etc.).
- Viewpoint and silhouette; normalized bbox and known measurement resolution; local vs world coordinate description.
- Component tree from observed features (not original source hierarchy), occlusion order and movable parts.
- Geometry primitive candidates and proposed generalized parameterization.
- Primary/secondary/tertiary detail groups; shading, material, light direction, color roles; identifiable perspective constraints.
- Animation states, joints/pivots and possible motion curves only at evidence-supported confidence.
- Link to related patterns, contradictions, original generator target and allowed evidence.

## E. Motion event table

For permitted footage:

| field | description |
|---|---|
| start/end | exact source timestamp and capture method |
| measured fps | native source fps if established |
| sampling | samples/time interval and scene-cut/selection method |
| key poses | time-indexed joint/scale/position descriptors |
| curves | measured or fitted curve with error |
| camera | independent transform estimate and background evidence |
| secondary | delay, follow-through and oscillation evidence |
| uncertainty | missed poses, occlusion or compression artifacts |

If only manual watching notes exist, mark all numerical curves as `not_measured`.

## F. Inference separation

For each claim, answer: 1) What precisely was seen? 2) What does that suggest? 3) What other construction could produce the same rendered result? 4) What new evidence would disambiguate? 5) Can we implement the useful principle with **original** geometry without knowing their actual technique?

## G. Transfer to generative code

Propose an *original* asset recipe, parameters with plausible ranges, component/rig graph, test scenes, expected failure cases, quality metrics and origin of all technical assumptions. Implement only after source review and originality check.

## H. Review and promotion

Reviewer signs off literal observations. Graph curator resolves contradictory claims and marks hypothesis/support/validated appropriately. Graphics engineer runs repeatable test. Evaluator signs off geometry/motion/clarity/originality. Only then promote the generalized rule to the reusable design library.

## Per-video completion statuses

- `cataloged`: video identity verified, no visual inspection implied.
- `metadata_only`: metadata understood without visual claims.
- `human_viewed`: specific timestamps and human observations recorded.
- `licensed_stills`: authorized still samples with limited temporal inference.
- `motion_reviewed`: authorized time series reviewed with timing method.
- `deep_analyzed`: multiple scenes scored across visual/motion/story aspects; gaps stated.
- `reconstruction_tested`: code-based **original** generator test completed.
- `blocked`: a permission/access/technical dependency prevents next stage.

Do not confuse `reconstruction_tested` with literal replication of a reference shot.


---

# FILE: `docs/17_AGENT_TASK_BOARD.md`

# 17 — Initial task board and concrete acceptance criteria

This is a **proposed** task backlog. No task here is marked done unless an actual run records evidence.

| ID | Task | Dependencies | Evidence of done |
|---|---|---|---|
| T00 | Confirm repo owner, license/private-public decision | none | Owner-approved settings, no restricted files |
| T01 | Verify rights and API terms | T00 | Rights audit and exact allowed methods |
| T02 | Discover current channel ID and uploads playlist | T01, key | API result checked, timestamped |
| T03 | Page through complete uploads playlist | T02 | Exact unique video ID count and pagination log |
| T04 | Group all accessible videos by topic/era/form | T03 | Classification method and unknowns explicitly reported |
| T05 | Select 5 representative videos | T04 | Diversity and access rationale, no cherry picking |
| T06 | Obtain authorized source sequences or manual view notes | T05 | Rights manifest or human-viewed log |
| T07 | Annotate samples and 30+ observations (target) | T06 | Schema-validated evidence records with time ranges |
| T08 | Cluster shapes/materials/motion and contradictions | T07 | Ontology nodes and reviewed, attributed patterns |
| T09 | Implement 2–5 original geometry factories | T08 | Executable source + still/contact sheet |
| T10 | Build articulated bird rig | T09 | Pose extremes + deterministic 4–8s test |
| T11 | Score quality and originality | T10 | Independent evaluation records |
| T12 | Revise bird from measured failure modes | T11 | A/B experiment with baseline and new results |
| T13 | Expand to ~20 videos selected by graph gaps | T08, T11 | Coverage, gap and provenance reports |
| T14 | Implement extra asset families and scene composer | T13 | Original character/landscape/diagram benchmarks |
| T15 | Scale catalog study to full target where accessible | T03, T13 | Per-video coverage states, no false completeness |
| T16 | Render original 30–60s science explainer | T10, T14 | Source, MP4, licensed audio, fact and rights review |

## Batch planning decision tree

- If API key absent, stop API discovery and produce manual ID/URL queue template. Do not scrape as a workaround.
- If source video accessible via URL only, produce compliant human-annotation instructions, no automatic extraction.
- If authorized local video available, run rights-preflight, then source sampling, measurement, archive policy.
- If graph has hypotheses but no verified reusable rules, prioritize original-code A/B experiments before adding many new nodes.
- If asset lacks polish, prioritize geometry/detail/rig tests over bulk corpus ingestion.
- If visual evaluation degrades, preserve baseline and revert failing algorithm.

## Required handoff summary to next agent

`current_snapshot`, `rights_state`, `counts_by_coverage`, `files_changed`, `validated_claim_ids`, `untested_hypotheses`, `current_asset_quality_scores`, `blocked_tasks`, `next_task_id`, `compute/API spend`. Any absent value must be explicitly `unknown`.
