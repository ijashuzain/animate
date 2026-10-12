#!/usr/bin/env node
// Voice-over check and script: reads the built timeline, measures every line against its window and writes voice/script.md.
//   usage: node studio/tools/vo.mjs <slug> [--check]   (--check: report only, exit 1 if a line is too sparse or too dense)
// A line should fill its window at about WPS_TARGET words/s (lib.mjs): gaps under the picture read as dead air,
// so each line reports how many words to add or cut.
import fs from 'node:fs';
import path from 'node:path';
import { build, timeline, vdir, fmt, words, WPS_TARGET, WPS_MIN, WPS_MAX } from './lib.mjs';
const [slug, flag] = process.argv.slice(2);
if (!slug) { console.error('usage: node studio/tools/vo.mjs <slug> [--check]'); process.exit(2); }
if (!build(slug)) process.exit(1);
const T = await timeline(slug);
let bad = 0;
const rows = T.narration.map((n, i) => {
  const win = n.t1 - n.t0, w = words(n.text), wps = w / win, target = Math.round(win * WPS_TARGET), delta = target - w;
  const verdict = wps < WPS_MIN ? `SPARSE: add ~${delta} words` : wps > WPS_MAX ? `DENSE: cut ~${-delta} words` : 'ok';
  if (verdict !== 'ok') bad++;
  return { i: i + 1, ...n, win, w, wps, target, verdict };
});
console.log('line  window   words  wps   target  verdict');
rows.forEach((r) => console.log(`${String(r.i).padStart(3)}  ${r.win.toFixed(1).padStart(5)}s  ${String(r.w).padStart(5)}  ${r.wps.toFixed(2)}  ${String(r.target).padStart(5)}   ${r.verdict}`));
const total = rows.reduce((a, r) => a + r.w, 0), cover = rows.reduce((a, r) => a + r.win, 0);
console.log(`total ${total} words over ${cover.toFixed(0)}s of windows (${(total / cover).toFixed(2)} words/s; video ${T.duration}s). ${bad ? bad + ' line(s) to fix' : 'all lines fill their windows'}`);
if (flag === '--check') process.exit(bad ? 1 : 0);
const scene = (t) => T.scenes.find((s) => t >= s.t0 && t < s.t1) || {};
const silence = T.scenes.filter((s) => s.mood === 'silence');
const o = [`# ${T.meta?.title ?? slug}: voice-over script\n`,
  `16:9, ${fmt(T.duration)}. Each line should **start at its Start time** and **end by its End time**; the lines are written to fill their windows at a natural narrator pace (~${WPS_TARGET} words per second), so there are no long gaps under the picture.\n`,
  `**ElevenLabs:** one file per line, placed at its Start time. If a take runs long, raise the speed slightly (0.05–0.1) rather than cutting words. ` +
  (silence.length ? `**Leave ${silence.map((s) => `${fmt(s.t0)}–${fmt(s.t1)}`).join(', ')} silent**: the music cuts out on purpose and the loudest hit lands right after.\n` : '\n'),
  '| # | Start | End | Window | Words | Scene | Line |', '|---|---:|---:|---:|---:|---|---|'];
rows.forEach((r) => o.push(`| ${r.i} | ${fmt(r.t0)}.${String(Math.round((r.t0 % 1) * 10))} | ${fmt(r.t1)}.${String(Math.round((r.t1 % 1) * 10))} | ${r.win.toFixed(1)}s | ${r.w} | ${scene(r.t0).tag ?? scene(r.t0).key ?? ''} | ${r.text} |`));
o.push('\n## Plain lines (paste into ElevenLabs, one file each)\n', ...rows.map((r) => `${r.i}. ${r.text}`));
const out = path.join(vdir(slug), 'voice', 'script.md');
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, o.join('\n') + '\n');
console.log('wrote', path.relative(process.cwd(), out));
