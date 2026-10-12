// Shared helpers for the studio tools: paths, the engine, playwright, the video's built timeline, the status file.
import { createRequire } from 'node:module';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const ENGINE = path.join(ROOT, 'engine', 'animate');
export const VIDEOS = path.join(ROOT, 'videos');
export const ARCHIVE = path.join(ROOT, 'archive');
export const STATUS = path.join(ROOT, 'studio', 'status.json');
export const vdir = (slug) => path.join(VIDEOS, slug);
export const rel = (p) => path.relative(ROOT, p);

const require = createRequire(import.meta.url);
export function chromium() { try { return require('playwright').chromium; } catch { return require(path.join(execSync('npm root -g').toString().trim(), 'playwright')).chromium; } }

// build a video (engine/animate/tools/build.mjs) and return true when it compiled
export function build(slug) {
  const r = spawnSync(process.execPath, [path.join(ENGINE, 'tools', 'build.mjs'), rel(vdir(slug))], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); return false; }
  return true;
}
// open the built page and run fn(page) with TIMELINE available
export async function withPage(slug, fn, { width = 1920, height = 1080 } = {}) {
  const browser = await chromium().launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(pathToFileURL(path.join(vdir(slug), 'index.html')).href + '?export=1');
  await page.waitForFunction(() => typeof window.renderFrame === 'function' && window.TIMELINE);
  try { return await fn(page, errors); } finally { await browser.close(); }
}
export const timeline = (slug) => withPage(slug, (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.TIMELINE))));

// the studio status file (mirrored to the dashboard by Claude): { batch, updated, videos: { slug: { title, style, stage, detail, why, progress, outputs } }, log: [] }
export function readStatus() { try { return JSON.parse(fs.readFileSync(STATUS, 'utf8')); } catch { return { batch: null, updated: null, videos: {}, log: [] }; } }
export function setStatus(slug, patch, note) {
  const s = readStatus(), now = new Date().toISOString();
  if (slug) s.videos[slug] = { ...(s.videos[slug] || {}), ...patch, updated: now };
  if (note) s.log = [{ t: now, slug, note }, ...(s.log || [])].slice(0, 200);
  s.updated = now; fs.writeFileSync(STATUS, JSON.stringify(s, null, 2) + '\n');
  return s;
}
export const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
export const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;
// how many words a voice window should hold: a calm-but-full narrator pace (ElevenLabs default voices speak ~2.6-2.9 words/s)
export const WPS_TARGET = 2.7, WPS_MIN = 2.35, WPS_MAX = 3.1;
