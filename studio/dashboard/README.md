# Studio dashboard

The live status page: https://claude.ai/artifact/N1dKeyKqmYkGV63YzWXZLw (source: studio.html; publish updates to the same URL).
It reads a shared database that Claude writes with the ArtifactData tool (schema in CLAUDE.md -> Dashboard).
The page can't read the repo directly; studio/status.json is the local mirror the tools keep.

Outputs: each finished video gets a 720p web copy and its thumbnail uploaded as artifact assets, plus an `outputs/<slug>` doc
(studio/tools/outputs.mjs) with the script and metadata. The page plays the video and offers downloads (the `downloads`
capability) and copy buttons. Capabilities: db, user, sample, assets, downloads. Clear old assets and outputs docs at cleanup.
