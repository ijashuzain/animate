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
