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
