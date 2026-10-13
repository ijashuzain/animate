#!/usr/bin/env node
// Learn from real viewers: read a YouTube Studio audience-retention export (Analytics -> Engagement -> the retention chart
// -> download -> "Audience retention") with retention.py (studio/vendor/yt-agent): the hook leak (first 30 s), cliffs
// (with what the narration was saying there) and the slide. Writes retention.md next to the video's sources.
// Then turn the single biggest leak into a rule in studio/LEARNINGS.md (and the code, if it's general).
//   usage: node studio/tools/retention.mjs <slug> <export.csv>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './lib.mjs';
const [slug, csv] = process.argv.slice(2);
if (!slug || !csv) { console.error('usage: node studio/tools/retention.mjs <slug> <export.csv>'); process.exit(2); }
const dir = ['videos', 'archive'].map((d) => path.join(ROOT, d, slug)).find((d) => fs.existsSync(d));
if (!dir) { console.error(`no videos/${slug} or archive/${slug}`); process.exit(1); }
const srt = [path.join(dir, 'renders', 'narration.srt'), path.join(dir, 'voice', 'narration.srt')].find((f) => fs.existsSync(f));
// the video length (for a percentage axis): the last narration cue's end, a little under the true length
const dur = srt ? Math.max(...[...fs.readFileSync(srt, 'utf8').matchAll(/--> (\d+):(\d+):(\d+)[,.](\d+)/g)].map((m) => +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000)) + 0.5 : null;
const args = [path.join(ROOT, 'studio', 'vendor', 'yt-agent', 'retention.py'), csv, ...(srt ? ['--transcript', srt] : []), ...(dur ? ['--duration', String(dur.toFixed(1))] : [])];
const outTxt = execFileSync('python3', args, { encoding: 'utf8' });
const out = path.join(dir, 'retention.md');
fs.writeFileSync(out, `# Retention: ${slug}\n\nFrom ${path.basename(csv)}${srt ? ' with the narration transcript' : ' (no transcript found)'}.\n\n\`\`\`\n${outTxt.trim()}\n\`\`\`\n`);
console.log(outTxt.trim()); console.log('\nwrote', path.relative(process.cwd(), out));
