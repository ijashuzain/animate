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
