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
