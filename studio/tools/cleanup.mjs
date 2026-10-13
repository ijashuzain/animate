#!/usr/bin/env node
// Before a new batch: archive the finished videos' sources and delete everything generated for them.
//   usage: node studio/tools/cleanup.mjs [--dry-run] [--keep <slug,...>]
// For every videos/<slug>/ (except --keep):
//   kept in archive/<slug>/ (small, for learning): piece.json, src/, research.md, voice/script.md, youtube/metadata.md, review.txt
//   deleted: renders/ (videos, audio, stems), frames*/, review/, index.html, youtube/thumbnail.png, everything else
// The repo keeps what makes the next video better (sources, scripts, learnings), not the heavy outputs.
import fs from 'node:fs';
import path from 'node:path';
import { VIDEOS, ARCHIVE, readStatus, setStatus } from './lib.mjs';
const args = process.argv.slice(2), dry = args.includes('--dry-run');
const keep = (args[args.indexOf('--keep') + 1] || '').split(',').filter((s) => args.includes('--keep') && s);
const KEEP = ['piece.json', 'src', 'research.md', 'voice/script.md', 'youtube/metadata.md', 'youtube/package.md', 'review.txt'];
const du = (p) => { if (!fs.existsSync(p)) return 0; const s = fs.statSync(p); return s.isDirectory() ? fs.readdirSync(p).reduce((a, n) => a + du(path.join(p, n)), 0) : s.size; };
let freed = 0;
for (const slug of fs.readdirSync(VIDEOS)) {
  const D = path.join(VIDEOS, slug);
  if (!fs.statSync(D).isDirectory() || keep.includes(slug) || slug.startsWith('.')) continue;
  const size = du(D), A = path.join(ARCHIVE, slug);
  console.log(`${dry ? '[dry] ' : ''}${slug}: archive sources -> archive/${slug}, delete ${(size / 1e6).toFixed(0)} MB of generated files`);
  if (dry) { freed += size; continue; }
  const srt = path.join(D, 'renders', 'narration.srt'); if (fs.existsSync(srt)) { fs.mkdirSync(path.join(A, 'voice'), { recursive: true }); fs.copyFileSync(srt, path.join(A, 'voice', 'narration.srt')); }   // for retention.mjs later
  for (const k of KEEP) { const s = path.join(D, k); if (fs.existsSync(s)) { fs.mkdirSync(path.dirname(path.join(A, k)), { recursive: true }); fs.cpSync(s, path.join(A, k), { recursive: true }); } }
  // archived pieces still point at the shared studio files: keep their build list valid from archive/<slug>/
  fs.rmSync(D, { recursive: true, force: true }); freed += size;
}
const s = readStatus(); s.videos = {}; fs.writeFileSync(path.join(path.dirname(VIDEOS), 'studio', 'status.json'), JSON.stringify(s, null, 2) + '\n');
if (!dry) setStatus(null, {}, `cleanup: freed ${(freed / 1e6).toFixed(0)} MB`);
console.log(`${dry ? 'would free' : 'freed'} ${(freed / 1e6).toFixed(0)} MB`);
