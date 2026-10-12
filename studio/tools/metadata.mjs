#!/usr/bin/env node
// YouTube metadata from the video's META (src/script.js) and its scenes: youtube/metadata.md with title options,
// a description with chapters (YouTube needs 0:00 first, >= 3 chapters, each >= 10 s), sources, hashtags and tags.
//   usage: node studio/tools/metadata.mjs <slug>
import fs from 'node:fs';
import path from 'node:path';
import { build, timeline, vdir, fmt } from './lib.mjs';
const slug = process.argv[2];
if (!slug) { console.error('usage: node studio/tools/metadata.mjs <slug>'); process.exit(2); }
if (!build(slug)) process.exit(1);
const T = await timeline(slug), M = T.meta;
if (!M) { console.error('no META in src/script.js'); process.exit(1); }
// chapters: one per scene with a tag; silences fold into the scene before; anything under 10 s folds into its neighbour
let ch = [];
for (const s of T.scenes) { if (s.mood === 'silence' || !ch.length) { if (!ch.length) ch.push({ t0: 0, name: s.chapter ?? s.tag ?? s.key }); continue; } ch.push({ t0: s.t0, name: s.chapter ?? s.tag ?? s.key }); }
if (M.chapters) ch = M.chapters.map(([t, name]) => ({ t0: t, name }));
ch = ch.filter((c, i) => i === 0 || c.t0 - ch[i - 1].t0 >= 10);
const o = [`# ${M.title}\n`, '## Title', M.title, ...(M.alt?.length ? ['', '*Alternatives:* ' + M.alt.map((a) => `"${a}"`).join(' · ')] : []),
  '', '## Description', '', M.hook, '', M.about, '', '⏱️ Chapters', ...ch.map((c) => `${fmt(c.t0)} ${c.name}`),
  ...(M.sources?.length ? ['', '📚 Sources', ...M.sources.map((s) => `- ${s}`)] : []), '', '🎨 Animated entirely in code.', '', (M.hashtags || []).join(' '),
  '', '## Tags', (M.tags || []).join(', '), '', `## Thumbnail\nyoutube/thumbnail.png (1280×720)`];
const out = path.join(vdir(slug), 'youtube', 'metadata.md');
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, o.join('\n') + '\n');
console.log('wrote', path.relative(process.cwd(), out), `(${ch.length} chapters)`);
