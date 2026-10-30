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
