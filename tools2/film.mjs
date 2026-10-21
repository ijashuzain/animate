#!/usr/bin/env node
// Build a film into a HyperFrames project and look at it.
//   node tools2/film.mjs <slug>                         build films/<slug>/hf/ (index.html + gsap + fonts + audio)
//   node tools2/film.mjs <slug> still 1.5,9,20 [scale]  build, then render those seconds side by side -> films/<slug>/stills/
//   node tools2/film.mjs <slug> sheet [every=1] [scale] one frame every N seconds in a grid -> stills/sheet.png
//   node tools2/film.mjs <slug> draft|looks|final       build, then HyperFrames render at that quality -> renders/
// films/<slug>/film.json: { title, duration, fps, fonts: [{ family, file }], src: [files], audio: [{ id, src, start, volume }] }
// A film's scripts define FILM = { draw(t) } on a 1920x1080 canvas, using kit/motion.js (K) and kit/paint.js (P).
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const [slug, mode = 'build', arg, arg2] = process.argv.slice(2);
if (!slug) { console.error('usage: node tools2/film.mjs <slug> [build|still <t,t>|sheet|draft|looks|final]'); process.exit(2); }
const FD = path.join(ROOT, 'films', slug), HF = path.join(FD, 'hf');
const F = JSON.parse(fs.readFileSync(path.join(FD, 'film.json'), 'utf8'));
const fps = F.fps ?? 30, dur = F.duration;

function build() {
  fs.mkdirSync(HF, { recursive: true });
  fs.copyFileSync(require.resolve('gsap/dist/gsap.min.js'), path.join(HF, 'gsap.min.js'));
  const faces = (F.fonts ?? []).map((f) => { const b = path.basename(f.file); fs.copyFileSync(path.join(ROOT, f.file), path.join(HF, b)); return `@font-face { font-family: '${f.family}'; src: url('${b}'); font-weight: 100 900; }`; }).join('\n');
  const audio = (F.audio ?? []).filter((a) => fs.existsSync(path.join(FD, a.src))).map((a, i) => {
    const b = path.basename(a.src); fs.copyFileSync(path.join(FD, a.src), path.join(HF, b));
    return `<audio id="${a.id}" src="${b}" data-start="${a.start ?? 0}" data-duration="${a.duration ?? dur}" data-track-index="${10 + i}" data-volume="${a.volume ?? 1}"></audio>`;
  }).join('\n');
  const js = ['kit/motion.js', 'kit/paint.js', ...(F.kit ?? [])].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n')
    + '\n' + F.src.map((f) => fs.readFileSync(path.join(FD, f), 'utf8')).join('\n');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<title>${F.title}</title>
<script src="gsap.min.js"></script>
<style>
${faces}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
#root { position: relative; width: 100%; height: 100%; }
#c { position: absolute; inset: 0; width: 100%; height: 100%; }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${dur}" data-width="1920" data-height="1080">
<canvas id="c" class="clip" width="1920" height="1080" data-start="0" data-duration="${dur}" data-track-index="0"></canvas>
${audio}
</div>
<script>
${js}
const ctx = document.getElementById('c').getContext('2d');
window.drawAt = (t) => { P.begin(ctx); FILM.draw(t); };
const tl = gsap.timeline({ paused: true });
const proxy = { t: 0 };
tl.to(proxy, { t: ${dur}, duration: ${dur}, ease: 'none', onUpdate: () => window.drawAt(proxy.t) }, 0);
const start = () => { window.drawAt(0); (window.__timelines = window.__timelines || {})['main'] = tl; };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
</script>
</body></html>
`;
  fs.writeFileSync(path.join(HF, 'index.html'), html);
  if (!fs.existsSync(path.join(HF, 'hyperframes.json'))) fs.writeFileSync(path.join(HF, 'hyperframes.json'), JSON.stringify({ name: slug }, null, 2));
  if (!fs.existsSync(path.join(HF, 'meta.json'))) fs.writeFileSync(path.join(HF, 'meta.json'), JSON.stringify({ id: slug, name: F.title }, null, 2));
}

async function stills(times, scale, out, cols) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(path.join(HF, 'index.html')).href);
  await page.waitForFunction(() => window.drawAt && document.fonts.status === 'loaded');
  const url = await page.evaluate(([ts, k, cols]) => {
    const c = document.getElementById('c'), w = Math.round(1920 * k), h = Math.round(1080 * k), n = ts.length, cc = Math.min(cols, n), rr = Math.ceil(n / cc);
    const s = document.createElement('canvas'); s.width = cc * w; s.height = rr * h; const g = s.getContext('2d');
    ts.forEach((t, i) => { window.drawAt(t); g.drawImage(c, (i % cc) * w, Math.floor(i / cc) * h, w, h); g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect((i % cc) * w, Math.floor(i / cc) * h, 70, 22); g.fillStyle = '#fff'; g.font = '14px monospace'; g.fillText(t.toFixed(1) + 's', (i % cc) * w + 6, Math.floor(i / cc) * h + 16); });
    return s.toDataURL('image/png');
  }, [times, scale, cols]);
  await browser.close();
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', path.relative(ROOT, out), errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors');
  if (errs.length) process.exitCode = 1;
}

build();
if (mode === 'still') await stills(String(arg).split(',').map(Number), Number(arg2 ?? 0.5), path.join(FD, 'stills', `still-${String(arg).replace(/,/g, '_')}.png`), 4);
else if (mode === 'sheet') { const every = Number(arg ?? 1), ts = []; for (let t = every / 2; t < dur; t += every) ts.push(Math.round(t * 100) / 100); await stills(ts, Number(arg2 ?? 0.2), path.join(FD, 'stills', 'sheet.png'), 6); }
else if (['draft', 'looks', 'final'].includes(mode)) {
  const q = { draft: 'draft', looks: 'looks', final: 'delivery' }[mode];
  fs.mkdirSync(path.join(FD, 'renders'), { recursive: true });
  const out = path.join(FD, 'renders', `${slug}-${mode}.mp4`);
  const env = { ...process.env, HYPERFRAMES_BROWSER_PATH: process.env.HYPERFRAMES_BROWSER_PATH || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', HYPERFRAMES_SKIP_SKILLS: '1' };
  const r = spawnSync(path.join(ROOT, 'node_modules/.bin/hyperframes'), ['render', '--quality', q, '--fps', String(fps), '-o', out], { cwd: HF, env, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1 << 28 });
  const log = (r.stdout + r.stderr).split('\n').filter((l) => !l.startsWith('@hf-progress') && !l.includes('[Render:trace]') && !/█|░/.test(l)).slice(-12).join('\n');
  console.log(log); if (r.status !== 0) process.exit(r.status ?? 1);
}
else if (mode !== 'build') { console.error('unknown mode', mode); process.exit(2); }
