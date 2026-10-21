#!/usr/bin/env node
// Build a film into a HyperFrames project and look at it.
//   node tools2/film.mjs <slug>                         build films/<slug>/hf/ (index.html + gsap + fonts + audio)
//   node tools2/film.mjs <slug> still 1.5,9,20 [scale]  build, then render those seconds side by side -> films/<slug>/stills/
//   node tools2/film.mjs <slug> sheet [every=1] [scale] one frame every N seconds in a grid -> stills/sheet.png
//   node tools2/film.mjs <slug> draft|looks|final       build, then HyperFrames render at that quality -> renders/ (+ a 1080p copy < 30 MB)
//   node tools2/film.mjs <slug> board                   the storyboard check: film.json board [[t, label], ...] -> stills/board.png
//                                                       (one image of every major scene, numbered, for the user's notes BEFORE the draft)
//   node tools2/film.mjs <slug> thumb                   film.json thumb { t, lines: [[text, size, colour]], font } -> youtube/thumbnail.png 1280x720
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

const writeIf = (file, data) => { if (!fs.existsSync(file) || !fs.readFileSync(file).equals(Buffer.from(data))) fs.writeFileSync(file, data); };
const copyIf = (a, b) => writeIf(b, fs.readFileSync(a));
function build() {
  fs.mkdirSync(HF, { recursive: true });
  copyIf(require.resolve('gsap/dist/gsap.min.js'), path.join(HF, 'gsap.min.js'));
  const faces = (F.fonts ?? []).map((f) => { const b = path.basename(f.file); copyIf(path.join(ROOT, f.file), path.join(HF, b)); return `@font-face { font-family: '${f.family}'; src: url('${b}'); font-weight: 100 900; }`; }).join('\n');
  const audio = (F.audio ?? []).filter((a) => fs.existsSync(path.join(FD, a.src))).map((a, i) => {
    const b = path.basename(a.src); copyIf(path.join(FD, a.src), path.join(HF, b));
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
  writeIf(path.join(HF, 'index.html'), html);
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
  // the user's rule: always deliver 1080p. Make a 1080p copy under the 30 MB send limit (flat art compresses well).
  const share = path.join(FD, 'renders', `${slug}-${mode}-1080p.mp4`);
  for (const crf of [24, 27, 30, 33]) {
    execSync(`ffmpeg -y -loglevel error -i "${out}" -c:v libx264 -crf ${crf} -preset slow -tune animation -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "${share}"`);
    if (fs.statSync(share).size < 29e6) break;
  }
  console.log('1080p copy:', path.relative(ROOT, share), (fs.statSync(share).size / 1e6).toFixed(1), 'MB');
}
else if (mode === 'board') {
  const B = F.board; if (!B) { console.error('film.json has no "board": [[t, label], ...]'); process.exit(2); }
  const { chromium } = require('playwright');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(path.join(HF, 'index.html')).href);
  await page.waitForFunction(() => window.drawAt && document.fonts.status === 'loaded');
  const url = await page.evaluate(([B, title]) => {
    const cols = 4, w = 576, h = 324, cap = 46, pad = 14, head = 90, rows = Math.ceil(B.length / cols);
    const s = document.createElement('canvas'); s.width = cols * (w + pad) + pad; s.height = head + rows * (h + cap + pad) + pad; const g = s.getContext('2d');
    g.fillStyle = '#14122a'; g.fillRect(0, 0, s.width, s.height);
    g.fillStyle = '#ffffff'; g.font = '700 40px sans-serif'; g.textBaseline = 'middle'; g.fillText(title + ': storyboard check', pad + 6, head / 2);
    g.fillStyle = '#9a96c8'; g.font = '400 24px sans-serif'; g.textAlign = 'right'; g.fillText('reply with the number to change', s.width - pad - 6, head / 2); g.textAlign = 'left';
    const c = document.getElementById('c');
    B.forEach(([t, label], i) => {
      window.drawAt(t); const x = pad + (i % cols) * (w + pad), y = head + Math.floor(i / cols) * (h + cap + pad);
      g.drawImage(c, x, y, w, h);
      g.fillStyle = '#26234a'; g.fillRect(x, y + h, w, cap);
      g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(x + 26, y + h + cap / 2, 17, 0, 6.3); g.fill();
      g.fillStyle = '#14122a'; g.font = '800 20px sans-serif'; g.textAlign = 'center'; g.fillText(String(i + 1), x + 26, y + h + cap / 2 + 1);
      const mm = Math.floor(t / 60), ss = (t % 60).toFixed(0).padStart(2, '0');
      g.textAlign = 'left'; g.fillStyle = '#9a96c8'; g.font = '600 20px sans-serif'; g.fillText(`${mm}:${ss}`, x + 52, y + h + cap / 2 + 1);
      g.fillStyle = '#ffffff'; g.font = '600 21px sans-serif'; let lab = label; while (g.measureText(lab).width > w - 120 && lab.length > 4) lab = lab.slice(0, -2); if (lab !== label) lab += '…'; g.fillText(lab, x + 108, y + h + cap / 2 + 1);
    });
    return s.toDataURL('image/png');
  }, [B, F.title]);
  await browser.close();
  const out = path.join(FD, 'stills', 'board.png'); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', path.relative(ROOT, out), `(${B.length} scenes)`, errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors');
}
else if (mode === 'thumb') {
  const T = F.thumb; if (!T) { console.error('film.json has no "thumb"'); process.exit(2); }
  const { chromium } = require('playwright');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pathToFileURL(path.join(HF, 'index.html')).href);
  await page.waitForFunction(() => window.drawAt && document.fonts.status === 'loaded');
  const url = await page.evaluate((T) => {
    window.drawAt(T.t); const c = document.getElementById('c'), g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    // readable on a phone: a dark wash behind the words, the heaviest weight, a thick dark outline (LEARNINGS)
    const side = T.side ?? 'right', x0 = side === 'right' ? 1000 : 0, gr = g.createLinearGradient(side === 'right' ? 900 : 1020, 0, side === 'right' ? 1500 : 420, 0);
    gr.addColorStop(0, 'rgba(10,8,30,0)'); gr.addColorStop(1, 'rgba(10,8,30,0.6)'); g.fillStyle = gr; g.fillRect(side === 'right' ? 900 : 0, 0, 1020, 1080);
    const cx = side === 'right' ? 1440 : 480, total = T.lines.reduce((a, l) => a + l[1] * 1.02, 0); let y = 540 - total / 2;
    for (const [str, size, fill] of T.lines) { y += size * 0.86; let sz = size; g.font = `800 ${sz}px ${T.font ?? 'sans-serif'}`; const w = g.measureText(str).width; if (w > 840) { sz = size * 840 / w; g.font = `800 ${sz}px ${T.font ?? 'sans-serif'}`; } g.textAlign = 'center'; g.lineJoin = 'round'; g.save(); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.lineWidth = sz * 0.22; g.strokeStyle = '#16112e'; g.strokeText(str, cx, y); g.restore(); g.lineWidth = sz * 0.2; g.strokeStyle = '#16112e'; g.strokeText(str, cx, y); g.fillStyle = fill; g.fillText(str, cx, y); y += size * 0.16; }
    void x0; return c.toDataURL('image/png');
  }, T);
  await browser.close();
  const D = path.join(FD, 'youtube'); fs.mkdirSync(D, { recursive: true });
  const big = path.join(D, 'thumb-1920.png'), out = path.join(D, 'thumbnail.png');
  fs.writeFileSync(big, Buffer.from(url.split(',')[1], 'base64')); execSync(`ffmpeg -y -loglevel error -i "${big}" -vf scale=1280:720:flags=lanczos "${out}"`); fs.unlinkSync(big);
  console.log('wrote', path.relative(ROOT, out));
}
else if (mode !== 'build') { console.error('unknown mode', mode); process.exit(2); }
