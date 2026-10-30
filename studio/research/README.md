# Animation Research & Procedural Studio — Agent Specification

**Status:** Repository-ready research specification, not a claim that the channel has been analyzed.  
**Reference corpus:** [Kurzgesagt – In a Nutshell](https://www.youtube.com/@kurzgesagt/videos).  
**Scope:** Catalog the channel snapshot (the requester estimates ~397 videos; verify count at run time), analyze accessible material to justified depths, distill general animation-design principles, and implement an **original** code-driven educational-animation studio.

## North star

Given a science script and a storyboard, generate an **editable, deterministic, high-quality animated video from code**: vector assets, rigged characters, original environments, cameras, effects, audio timing, and render files. Study sophisticated references to learn *general design and animation engineering*, not to reproduce proprietary images or a signature look exactly. Quality parity is a long-term aspiration, not an automatic output guarantee.

## Non-negotiable truths

- A public YouTube URL is **not** a licensed local video file. The YouTube Data API supports metadata discovery; it does not license downloading copyrighted audiovisual media. See `docs/01_RIGHTS_AND_PROVENANCE.md`.
- **Do not claim frame-by-frame inspection** unless frame-level evidence exists, is legally accessible, and is timestamped. Never invent observations, motion paths, asset counts, or numeric scores.
- **397 is a target, not a verified inventory.** Record a snapshot date and distinguish uploads, Shorts, removed/private videos, and inaccessible items.
- Keep **observed / inferred / proposed / validated** findings separate and independently inspectable.
- No unauthorized copying of reference frames, characters, distinctive compositions, soundtrack, narration, proprietary rigs, or trademarks. Publish original assets and compact analytical facts only.
- An autonomous agent must run in **bounded batches** with checkpoints, validation and spend limits. It is not a promise of background execution by a chat assistant.

## Where to start

1. Read `AGENTS.md` — mandatory instructions for coding agents.
2. Read `docs/00_MISSION_AND_ACCEPTANCE.md` and `docs/01_RIGHTS_AND_PROVENANCE.md`.
3. Follow `docs/02_CATALOG_AND_COVERAGE.md` to build the **verified** URL/metadata inventory.
4. Use `docs/03_VISUAL_MOTION_ANALYSIS.md` and `docs/04_TAXONOMY_AND_ONTOLOGY.md` to label permitted evidence.
5. Store observations/patterns and source links using `docs/05_KNOWLEDGE_GRAPH.md` and JSON schemas in `schemas/`.
6. Build assets and scenes per `docs/06_PROCEDURAL_GENERATION.md`; score them per `docs/07_EVALUATION_BENCHMARKS.md`.
7. Manage batches and reviews per `docs/08_AGENT_ORCHESTRATION.md`; use `docs/09_QA_AND_AUDIT.md` for release gates.
8. Improve the bird benchmark described in `docs/10_BIRD_BENCHMARK.md` before scaling generation.
9. See `docs/11_ROADMAP_AND_BUDGET.md` for phased milestones and operational limits.
10. Start practical setup using `docs/13_GETTING_STARTED.md`; see `docs/14_AUTHORIZED_MEDIA_ANALYSIS.md` for licensed local video sampling.
11. Use `docs/15_PROCEDURAL_RECIPES.md` and `docs/16_VIDEO_STUDY_WORKSHEET.md` to guide new asset families and consistent video reviews.

## Recommended technology

- **Data:** JSONL + JSON Schema in Git; SQLite for searchable local indexing; optional NetworkX for graph traversal. Preserve normalized source-of-truth JSONL.
- **Asset geometry:** SVG (paths, groups, gradients, masks, transforms), optional Python geometry generation and SVG-to-PNG rasterization.
- **Video:** TypeScript/React with Remotion for time-based composition; integrate SVG components and procedural transforms. Review the current Remotion license for your use case.
- **Advanced 3D:** Blender + Python where 2D parallax cannot deliver the desired effect.
- **Scientific plotting:** Optional Manim for mathematics and exact technical diagrams; not necessarily the master renderer.
- **Testing:** JSON Schema validators, deterministic render tests, contact-sheet visual QA, temporal-coherence checks, audio sync checks, provenance audits.

## Proposed repository layout

```text
AGENTS.md
README.md
config/project.json
schemas/{video,observation,pattern,asset,experiment,rights}.schema.json
data/examples/*.json
sources/                # generated authorized metadata only, when allowed
observations/           # source-backed analytical observations, no copied frames
patterns/               # reusable evidenced design principles
assets/                 # YOUR original coded assets and rigs
scenes/                 # YOUR original scene definitions
renders/                # generated outputs; usually Git-ignored
reports/                # batch reports and QA summaries
docs/                   # methodology and standards
prompts/                # bounded agent prompts
scripts/                # record validation and other utilities
```

## First five deliverables

1. `catalog_snapshot_YYYY-MM-DD.jsonl`: authoritative list of public uploads at snapshot time, including availability state and API data refresh policy.
2. `coverage_report.json`: metadata coverage vs. legally inspected imagery/motion, without inflated percentages.
3. `pilot_observations.jsonl`: high-confidence design findings for 3–5 diverse **authorized** samples, including timestamps and source evidence.
4. `bird_v1.svg` + rig + short scene: original asset with anatomy, layered feathers and frame-accurate movement.
5. `evaluation_report.md`: reproducible results, human reviewer scores, failure modes, next experiments.

## Useful primary references

- [Kurzgesagt's description of its production process](https://kurzgesagt.org/what-we-do?visit=videos)
- [YouTube Data API — channel uploads](https://developers.google.com/youtube/data/guides/implementation/videos)
- [YouTube channels.list](https://developers.google.com/youtube/data/reference/rest/v3/channels/list)
- [YouTube playlistItems.list](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list)
- [YouTube API policies](https://developers.google.com/youtube/terms/developer-policies)
- [YouTube Terms](https://www.youtube.com/t/terms)
- [Remotion](https://www.remotion.dev/docs)
- [Remotion license](https://www.remotion.dev/docs/license)
- [Manim](https://docs.manim.community/en/stable/)

**Do not create a new GitHub repository or publish materials until the repository owner requests that action and approves privacy/licensing settings.**
