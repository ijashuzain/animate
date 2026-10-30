# 08 — Multi-agent orchestration and resumable execution

## Proposed roles

**Coordinator:** assigns bounded tasks, protects quotas and rights, checkpoints work and handles escalation.  
**Cataloger:** retrieves compliant metadata, reconciles uploads/deletions and coverage counts.  
**Evidence analyst:** performs accessible manual observation or licensed-media analysis; produces cited notes.  
**Design analyst:** maps observations to measurable geometry/material/composition/motion abstractions and alternatives.  
**Ontology editor:** deduplicates graph nodes and evidence edges.  
**Graphics engineer:** implements original SVG components, geometry and rigs.  
**Animation engineer:** builds deterministic motions, camera, transitions and compositing.  
**Evaluator:** checks renders blind against baseline, originality, visual quality and technical tests.  
**Auditor:** validates rights, evidence integrity, schemas, status and release readiness.

In a low-budget project, **one coding agent can perform these roles sequentially**, preserving the same interfaces and independent review checkpoints. Don't deploy eight paid agents unless throughput justifies cost.

## Task lifecycle

`queued -> rights_checked -> source_available -> in_progress -> evidence_review -> validated -> merged`  
Alternate: `blocked` (source/rights missing), `needs_review`, `failed_retryable`, `failed_final`, `superseded`.

Tasks are idempotent. Each writes a separate output directory, checkpoint manifest, audit log, hash and status. On restart, recompute only stale/failed outputs. Avoid simultaneous writers to one JSONL or SQLite database: use merge-on-review or transactional writes.

## Recommended batching

- Batch 0: rights and repo bootstrapping.
- Batch 1: metadata discovery for entire channel in compliant pages, 1 catalog reconciliation report.
- Batch 2: sample 5 videos across visual/era strata; **do not** deep-analyze 397 at once.
- Batch 3: evidence-supported observations → graph → first code experiments.
- Batch 4: bird benchmark rig and 4–8s animation, 2 visual review iterations.
- Batch 5: broaden 20-video stratified subset; then prioritize via information gain and benchmark gaps.
- Later: progress through catalog in controlled batches; deliberately track coverage disparity across topics/eras.

Each batch has a task budget (`max_wall_minutes`, `max_api_calls`, `max_tokens`, `max_storage_mb`, `max_cost_usd`); these are configurable caps, not estimates of completion time.

## Evidence-first state machine

1. Source discovered? If no → `blocked`.
2. Media access authorized? If no → metadata + manual linked viewing only; no automated frame extraction.
3. Literal observation documented and reviewer approved? If no → do not create validated rule.
4. Pattern claim supported and conflicts checked? If no → `hypothesis`.
5. Code experiment passes original-quality and rights QA? If no → record failure and revise.
6. New evidence suggests contradiction? → mark old pattern `needs_review` rather than erasing it.

## Analysis prompt contracts

See `prompts/` for cataloger, visual analyst, graph curator and generator agent prompts. They force separation of observations, inferences, code decisions, evidence and permissions.

## Batch logs

Every run creates a manifest and readable report. The agent should never silently consume a large batch or claim successful completion before testing. Sample ledger:

```json
{
  "batch_id": "pilot-001",
  "snapshot_id": "to-be-generated",
  "stage": "planning",
  "video_ids": [],
  "completed": 0,
  "blocked": 0,
  "rights_state": "not_checked",
  "cost_usd": 0,
  "next_action": "verify source permissions and initialize catalog"
}
```

## Human gates

Require owner review before making the repository public, ingesting rights-sensitive media, selecting paid models/services, changing retention policy, and approving release-quality assets. Scientific and originality review are required before publishing a video.
