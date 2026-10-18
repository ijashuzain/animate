#!/usr/bin/env node
// The fast check while building: build, one frame per scene in a contact sheet (with page errors), and the score
// rendered at low sample rate to catch audio errors. Look at the sheet before exporting.
//   usage: node studio/tools/smoke.mjs <slug> [frac=0.6]   -> videos/<slug>/review/sheet.png
import fs from 'node:fs';
import path from 'node:path';
import { build, withPage, vdir } from './lib.mjs';
import { spawnSync } from 'node:child_process';
spawnSync('bash', [new URL('./fonts.sh', import.meta.url).pathname]);   // the studio fonts for the renderer
const [slug, frac = '0.6'] = process.argv.slice(2);
if (!slug) { console.error('usage: node studio/tools/smoke.mjs <slug> [frac]'); process.exit(2); }
if (!build(slug)) process.exit(1);
const out = path.join(vdir(slug), 'review'); fs.mkdirSync(out, { recursive: true });
await withPage(slug, async (page, errors) => {
  const shots = await page.evaluate(() => TIMELINE.shots.map((s) => ({ key: s.key, t0: s.t0, t1: s.t1 })));
  const imgs = [];
  for (const s of shots) { const t = Math.round((s.t0 + (s.t1 - s.t0) * Number(frac)) * 24) / 24; imgs.push({ url: await page.evaluate((t) => { renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', 0.8); }, t), label: `${s.key} ${t.toFixed(1)}s` }); }
  const audio = await page.evaluate(async () => { try { const s = await buildScore(11025, 'mix'); let peak = 0; for (let i = 0; i < s.left.length; i += 7) peak = Math.max(peak, Math.abs(s.left[i])); return `ok, ${(s.left.length / 11025).toFixed(1)}s, peak ${peak.toFixed(2)}`; } catch (e) { return 'ERROR ' + e.message; } });
  const C = 4, tw = 480, th = 270, rows = Math.ceil(imgs.length / C);
  await page.setViewportSize({ width: tw * C, height: th * rows });
  await page.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${C},${tw}px)">${imgs.map((m) => `<div style="position:relative"><img src="${m.url}" style="width:${tw}px;height:${th}px;display:block"><span style="position:absolute;left:4px;top:2px;background:#000c;color:#fff;font:13px monospace;padding:1px 4px">${m.label}</span></div>`).join('')}</body>`);
  await page.waitForTimeout(200); await page.screenshot({ path: path.join(out, 'sheet.png'), fullPage: true });
  console.log(`sheet: ${path.relative(process.cwd(), path.join(out, 'sheet.png'))} (${shots.length} scenes); audio: ${audio}; page errors: ${errors.length ? [...new Set(errors)].join(' | ') : 'none'}`);
  if (errors.length || audio.startsWith('ERROR')) process.exitCode = 1;
});
