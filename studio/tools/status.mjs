#!/usr/bin/env node
// Record a video's stage in studio/status.json (the dashboard mirrors it).
//   usage: node studio/tools/status.mjs <slug> <stage> "<what is happening>" "<why>" [progress 0..1]
//          node studio/tools/status.mjs --batch "<batch name>"            (start a batch)
//          node studio/tools/status.mjs --show
// Stages: topics, researching, scripting, styling, building, rendering, reviewing, packaging, done, failed
import { setStatus, readStatus } from './lib.mjs';
import fs from 'node:fs';
import { STATUS } from './lib.mjs';
const a = process.argv.slice(2);
if (a[0] === '--show') { console.log(JSON.stringify(readStatus(), null, 2)); process.exit(0); }
if (a[0] === '--batch') { const s = readStatus(); s.batch = { name: a[1], started: new Date().toISOString() }; s.videos = {}; fs.writeFileSync(STATUS, JSON.stringify(s, null, 2) + '\n'); setStatus(null, {}, `batch started: ${a[1]}`); process.exit(0); }
const [slug, stage, detail, why, progress] = a;
if (!slug || !stage) { console.error('usage: status.mjs <slug> <stage> "<detail>" "<why>" [progress]'); process.exit(2); }
const ORDER = ['topics', 'researching', 'scripting', 'styling', 'building', 'rendering', 'reviewing', 'packaging', 'done'];
const p = progress != null ? Number(progress) : Math.max(0, ORDER.indexOf(stage)) / (ORDER.length - 1);
setStatus(slug, { stage, detail, why, progress: p }, `${slug}: ${stage}${detail ? ' (' + detail + ')' : ''}`);
console.log(`${slug}: ${stage} ${Math.round(p * 100)}%`);
