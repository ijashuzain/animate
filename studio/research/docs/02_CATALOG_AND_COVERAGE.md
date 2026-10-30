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
