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
