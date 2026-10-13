#!/usr/bin/env node
// Packaging check, before anything is delivered (rules and scorers from youtube-agent-skill, studio/vendor/yt-agent):
//   hooks   META.hooks (5 candidate opening lines) + the real first line, scored by hookscore.py (specificity, address,
//           stakes, curiosity, brevity; the verdict weights the weakest one). The first voice line should open with the winner.
//   titles  META.title + META.alt with the thumbnail words (THUMB.lines), linted by title.py (60/40-char cuts, a number or
//           a name, caps, vague words, and the thumbnail must not repeat the title)
//   search  META.queries (3 searches the video should win): their words must be in the title or the first two description lines
// Writes youtube/package.md; exit 0 always (it informs, the script decides).
//   usage: node studio/tools/package.mjs <slug>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { build, timeline, vdir, ROOT } from './lib.mjs';
const slug = process.argv[2];
if (!slug) { console.error('usage: node studio/tools/package.mjs <slug>'); process.exit(2); }
if (!build(slug)) process.exit(1);
const T = await timeline(slug), M = T.meta ?? {}, V = path.join(ROOT, 'studio', 'vendor', 'yt-agent');
const py = (script, args) => JSON.parse(execFileSync('python3', [path.join(V, script), ...args, '--json'], { encoding: 'utf8' }));
const tmp = path.join(vdir(slug), 'review'); fs.mkdirSync(tmp, { recursive: true });
const o = [`# Packaging check: ${M.title ?? slug}\n`, '_Scorers from youtube-agent-skill (MIT). A low score is a reason to look again, never a verdict._\n'];

// hooks
// the opening the viewer hears: the whole first voice line (the hook scene, ~12 s), scored like the candidates
const firstSentence = (T.narration[0]?.text ?? '').trim();
const hooks = [...(M.hooks ?? []), firstSentence].filter(Boolean);
// voice lines spell numbers out for the narrator; the scorer counts digits, so score a digit version
const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, twenty: 20, thirty: 30, forty: 40, fifty: 50, hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000, twelfth: '12th', half: '50%' };
const digits = (h) => h.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|million|billion|twelfth|half)\b/gi, (w) => String(NUM[w.toLowerCase()]));
const back = new Map(hooks.map((h) => [digits(h), h]));
const hf = path.join(tmp, 'hooks.txt'); fs.writeFileSync(hf, [...back.keys()].join('\n'));
const H = py('hookscore.py', [hf]).map((h) => ({ ...h, hook: back.get(h.hook) ?? h.hook }));
o.push('## Hooks (the first 15 seconds)', '| verdict | band | formula | hook | weakest |', '|---|---|---|---|---|');
for (const h of H) { const low = Object.entries(h.properties).sort((a, b) => a[1] - b[1])[0]; o.push(`| ${h.verdict} | ${h.band} | ${h.formula} | ${h.hook === firstSentence ? '**(in the script)** ' : ''}${h.hook} | ${low[0].toLowerCase()} ${low[1]} |`); }
const inScript = H.find((h) => h.hook === firstSentence), best = H[0];
o.push('', inScript && best.hook !== firstSentence && best.verdict > inScript.verdict + 5 ? `> The script opens weaker (${inScript.verdict}) than the best candidate (${best.verdict}): consider opening with it.` : '> The script opens with its best hook.');
console.log(`hooks: best ${best.verdict} ${best.band} (${best.formula}); script opens at ${inScript?.verdict ?? '?'}`);

// titles + thumbnail
const thumb = (T.thumb?.lines ?? []).map((l) => l[0]).join(' ');
const titles = [M.title, ...(M.alt ?? [])].filter(Boolean), tf = path.join(tmp, 'titles.txt'); fs.writeFileSync(tf, titles.join('\n'));
const R = py('title.py', [tf, '--thumb', thumb]);
o.push('', `## Titles (thumbnail says: "${thumb}")`, '| score | chars | title | issues |', '|---|---|---|---|');
for (const r of R) o.push(`| ${r.score} | ${r.chars} | ${r.title} | ${r.issues.map(([k, m]) => `${k}: ${m}`).join('; ') || 'none'} |`);
const main = R.find((r) => r.title === M.title);
console.log(`title: ${main?.score ?? '?'}/100, ${main?.chars ?? '?'} chars${main?.issues.length ? ' (' + main.issues.map((i) => i[0]).join(', ') + ')' : ''}; best alternative ${R[0].score} "${R[0].title}"`);

// search queries
const STOP = new Set(['the', 'a', 'an', 'of', 'for', 'to', 'in', 'on', 'and', 'or', 'is', 'are', 'do', 'does', 'how', 'what', 'why', 'you', 'your']);
const fold = `${M.title ?? ''} ${M.hook ?? ''} ${(M.about ?? '').split(/(?<=[.?!])\s/)[0]}`.toLowerCase();
const qs = M.queries ?? [];
o.push('', '## Search (the 3 queries this video should win)');
if (!qs.length) o.push('> No META.queries yet: write the three searches a viewer would type.');
for (const q of qs) { const miss = q.toLowerCase().split(/\W+/).filter((w) => w && !STOP.has(w) && !fold.includes(w.replace(/s$/, ''))); o.push(`- "${q}": ${miss.length ? 'missing from title/first lines: ' + miss.join(', ') : 'covered'}`); }
console.log(`search: ${qs.length ? qs.filter((q) => !o.some((l) => l.includes(`"${q}": missing`))).length + '/' + qs.length + ' queries covered' : 'no META.queries'}`);
fs.unlinkSync(hf); fs.unlinkSync(tf);
const out = path.join(vdir(slug), 'youtube', 'package.md'); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, o.join('\n') + '\n');
console.log('wrote', path.relative(process.cwd(), out));
