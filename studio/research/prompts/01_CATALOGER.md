# Prompt — Channel cataloger

Goal: Build an accurate snapshot of all *accessible* uploads from `@kurzgesagt` using the official YouTube Data API, with current access/retention policy enforced.

1. Use `channels.list(part=contentDetails,snippet, forHandle=@kurzgesagt)` (correct authorized method).
2. Read uploads playlist ID from `contentDetails.relatedPlaylists.uploads`.
3. Page `playlistItems.list` (maxResults=50, pageToken to exhaustion), dedupe video IDs.
4. When authorized, query `videos.list` for duration and classification. Record missing/private/deleted/unavailable results without inference.
5. Distinguish video/Short/live and translated/reissue variants where known; unknown stays unknown.
6. Write per-ID status and snapshot-based coverage report with exact denominators.
7. Comply with metadata caching/refresh restrictions. Store no copyrighted AV media or unauthorized thumbnails.

Do not claim 397 as a verified total until counted. Stop if permissions, API quota or auth fail; report recovery steps.
