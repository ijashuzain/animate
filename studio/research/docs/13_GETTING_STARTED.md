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
