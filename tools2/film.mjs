#!/usr/bin/env node
// Build a film into a HyperFrames project and look at it.
//   node tools2/film.mjs <slug>                         build films/<slug>/hf/ (index.html + gsap + fonts + audio)
//   node tools2/film.mjs <slug> still 1.5,9,20 [scale]  build, then render those seconds side by side -> films/<slug>/stills/
//   node tools2/film.mjs <slug> sheet [every=1] [scale] one frame every N seconds in a grid -> stills/sheet.png
//   node tools2/film.mjs <slug> draft|looks|final       build, then HyperFrames render at that quality -> renders/ (+ a 1080p copy < 30 MB)
//   node tools2/film.mjs <slug> probe [fps] [width]       picture-only copy for film_metrics.py (default 12 fps, 640 px) -> renders/<slug>-probe.mp4
//   node tools2/film.mjs <slug> board                   the storyboard check: film.json board [[t, label], ...] -> stills/board.png
//                                                       (one image of every major scene, numbered, for the user's notes BEFORE the draft)
//   node tools2/film.mjs <slug> clean                   delete the generated files (hf/, renders/, stills/, audio/*.wav) once delivered
//   node tools2/film.mjs <slug> thumb                   film.json thumb (studio/references/thumbs/STYLE.md: title, accent, arrows, labels,
//                                                       t/zoom/shift or FILM.thumb) -> youtube/thumbnail.png 1280x720; style 'old' = the earlier side-text look
// films/<slug>/film.json: { title, duration, fps, fonts: [{ family, file }], src: [files], audio: [{ id, src, start, volume }] }
// A film's scripts define FILM = { draw(t) } on a 1920x1080 canvas, using kit/motion.js (K) and kit/paint.js (P).
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync, spawn } from 'node:child_process';
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

if (mode !== 'clean') build();
if (mode === 'still') await stills(String(arg).split(',').map(Number), Number(arg2 ?? 0.5), path.join(FD, 'stills', `still-${String(arg).replace(/,/g, '_')}.png`), 4);
else if (mode === 'sheet') { const every = Number(arg ?? 1), ts = []; for (let t = every / 2; t < dur; t += every) ts.push(Math.round(t * 100) / 100); await stills(ts, Number(arg2 ?? 0.2), path.join(FD, 'stills', 'sheet.png'), 6); }
else if (mode === 'probe') {
  // a small, fast picture-only copy for measuring (studio/research/scripts/film_metrics.py): frames drawn straight from
  // FILM.draw(t) at <fps> (default 12) and 640 px, piped to ffmpeg. Not a delivery render: no audio, no HyperFrames.
  const pf = Number(arg ?? 12), pw = Number(arg2 ?? 640), ph = Math.round(pw * 9 / 16 / 2) * 2, n = Math.floor(dur * pf);
  const { chromium } = require('playwright');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(path.join(HF, 'index.html')).href);
  await page.waitForFunction(() => window.drawAt && document.fonts.status === 'loaded');
  fs.mkdirSync(path.join(FD, 'renders'), { recursive: true });
  const out = path.join(FD, 'renders', `${slug}-probe.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(pf), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i0 = 0; i0 < n; i0 += 48) {
    const ts = []; for (let i = i0; i < Math.min(n, i0 + 48); i++) ts.push(i / pf);
    const urls = await page.evaluate(([ts, w, h]) => {
      const c = document.getElementById('c'), s = document.createElement('canvas'); s.width = w; s.height = h; const g = s.getContext('2d');
      return ts.map((t) => { window.drawAt(t); g.drawImage(c, 0, 0, w, h); return s.toDataURL('image/jpeg', 0.95); });
    }, [ts, pw, ph]);
    for (const u of urls) if (!ff.stdin.write(Buffer.from(u.split(',')[1], 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await browser.close();
  console.log('wrote', path.relative(ROOT, out), `${n} frames @ ${pf} fps, ${pw}x${ph}`, errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors');
  if (errs.length) process.exitCode = 1;
}
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
else if (mode === 'clean') {
  for (const d of ['hf', 'renders', 'stills']) fs.rmSync(path.join(FD, d), { recursive: true, force: true });
  for (const f of fs.existsSync(path.join(FD, 'audio')) ? fs.readdirSync(path.join(FD, 'audio')) : []) if (f.endsWith('.wav')) fs.rmSync(path.join(FD, 'audio', f));
  for (const f of fs.existsSync(path.join(FD, 'youtube')) ? fs.readdirSync(path.join(FD, 'youtube')) : []) if (f.startsWith('thumb-')) fs.rmSync(path.join(FD, 'youtube', f));
  console.log('cleaned', slug, '(sources kept; re-render any time)');
}
else if (mode === 'thumb') {
  const T = F.thumb; if (!T) { console.error('film.json has no "thumb"'); process.exit(2); }
  const { chromium } = require('playwright');
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pathToFileURL(path.join(HF, 'index.html')).href);
  await page.waitForFunction(() => window.drawAt && document.fonts.status === 'loaded');
  // the thumbnail font (Fredoka, heavy, a little condensed) is loaded from studio/fonts, whatever the film uses
  if ((T.style ?? 'banner') === 'banner') { await page.addStyleTag({ content: `@font-face { font-family: ThumbHead; src: url(${pathToFileURL(path.join(ROOT, 'studio/fonts/Fredoka[wdth,wght].ttf')).href}); font-weight: 300 700; font-stretch: 75% 125%; }` }); await page.evaluate(() => document.fonts.load('700 100px ThumbHead')); }
  const url = await page.evaluate((T) => {
    window.THUMB = true;
    const c = document.getElementById('c'), g = c.getContext('2d');
    if (T.style === 'old') { window.drawAt(T.t); return legacy(T); }
    // 1) the picture: a dedicated FILM.thumb composition, or a frame of the film, reframed
    if (typeof FILM.thumb === 'function') { P.begin(g); FILM.thumb(g, T); } else window.drawAt(T.t);
    g.setTransform(1, 0, 0, 1, 0, 0);
    const tmp = document.createElement('canvas'); tmp.width = 1920; tmp.height = 1080; const tg = tmp.getContext('2d'); tg.drawImage(c, 0, 0);
    const z = Math.max(1, T.zoom ?? 1), mx = 960 * (z - 1), my = 540 * (z - 1), sx = Math.max(-mx, Math.min(mx, (T.shift ?? [0, 0])[0])), sy = Math.max(-my, Math.min(my, (T.shift ?? [0, 0])[1]));
    // 2) the colour push: saturated, contrasty (the reference grid is much more saturated than a film frame)
    const gr = Object.assign({ sat: 1.35, contrast: 1.15, bright: 1.0 }, T.grade ?? {});
    g.fillStyle = '#000'; g.fillRect(0, 0, 1920, 1080); g.save(); g.filter = `saturate(${gr.sat}) contrast(${gr.contrast}) brightness(${gr.bright})`; g.translate(960 + sx, 540 + sy); g.scale(z, z); g.drawImage(tmp, -960, -540); g.restore();
    // focus: darken everything outside a spotlight on the hero (the reference grid's dark backgrounds)
    if (T.focus) { const [fx, fy, fr, fa = 0.7] = T.focus; const f = g.createRadialGradient(fx, fy, fr * 0.55, fx, fy, fr * 1.6); f.addColorStop(0, 'rgba(8,6,28,0)'); f.addColorStop(1, `rgba(8,6,28,${fa})`); g.fillStyle = f; g.fillRect(0, 0, 1920, 1080); }
    // 3) vignette and a dark band at the top behind the headline
    let v = g.createRadialGradient(960, 600, 380, 960, 600, 1250); v.addColorStop(0, 'rgba(5,4,20,0)'); v.addColorStop(1, 'rgba(5,4,20,0.7)'); g.fillStyle = v; g.fillRect(0, 0, 1920, 1080);
    v = g.createLinearGradient(0, 0, 0, 380); v.addColorStop(0, 'rgba(6,5,24,0.75)'); v.addColorStop(1, 'rgba(6,5,24,0)'); g.fillStyle = v; g.fillRect(0, 0, 1920, 380);
    // 4) the red arrows: thick, curved, rounded, a soft shadow
    for (const [x0, y0, x1, y1, bend = 0.3] of T.arrows ?? []) {
      const mxp = (x0 + x1) / 2 - (y1 - y0) * bend, myp = (y0 + y1) / 2 + (x1 - x0) * bend, an = Math.atan2(y1 - myp, x1 - mxp), L = 70, W = 34;
      const ex = x1 - Math.cos(an) * L * 0.8, ey = y1 - Math.sin(an) * L * 0.8;
      const draw = (col, dx, dy) => { g.save(); g.translate(dx, dy); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = W; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(mxp, myp, ex, ey); g.stroke();
        g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - Math.cos(an - 0.55) * L * 1.25, y1 - Math.sin(an - 0.55) * L * 1.25); g.lineTo(x1 - Math.cos(an + 0.55) * L * 1.25, y1 - Math.sin(an + 0.55) * L * 1.25); g.closePath(); g.lineJoin = 'round'; g.lineWidth = 12; g.stroke(); g.fill(); g.restore(); };
      draw('rgba(0,0,0,0.35)', 0, 10); draw(T.arrowColor ?? '#ff2e2e', 0, 0);
    }
    // 5) small labels on the parts
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const [str, x, y, size = 46, col = '#ffffff'] of T.labels ?? []) { g.font = `700 ${size}px ThumbHead`; g.save(); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 14; g.shadowOffsetY = 4; g.fillStyle = col; g.fillText(str, x, y); g.restore(); }
    // 6) the headline: one line, all caps, heavy, as wide as the frame allows, white with one accent word
    const title = String(T.title ?? '').toUpperCase(); if (title) {
      let size = T.titleSize ?? 270; const font = (sz) => `700 ${sz}px ThumbHead`;
      g.font = font(size); try { g.fontStretch = 'condensed'; } catch (e) {}
      let w = g.measureText(title).width; const maxW = T.titleWidth ?? 1780; if (w > maxW) { size *= maxW / w; g.font = font(size); w = g.measureText(title).width; }
      const words = title.split(' '), acc = String(T.accent ?? '').toUpperCase(), y = T.titleY ?? 40 + size * 0.5, align = T.titleAlign ?? 'center';
      let x = align === 'left' ? 60 : 960 - w / 2; g.textAlign = 'left';
      for (const [i, word] of words.entries()) { const piece = word + (i < words.length - 1 ? ' ' : ''), col = acc && word.replace(/[^A-Z0-9]/g, '') === acc.replace(/[^A-Z0-9]/g, '') ? (T.accentColor ?? '#ffd23f') : (T.titleColor ?? '#ffffff');
        g.save(); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 26; g.shadowOffsetY = 10; g.fillStyle = col; g.fillText(piece, x, y); g.restore(); x += g.measureText(piece).width; }
    }
    return c.toDataURL('image/png');
    function legacy(T) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    // optional reframe: zoom about the frame centre and shift (px) so the subject sits clear of the words
    if (T.zoom || T.shift) { const tmp = document.createElement('canvas'); tmp.width = 1920; tmp.height = 1080; tmp.getContext('2d').drawImage(c, 0, 0); const z = Math.max(1, T.zoom ?? 1), mx = 960 * (z - 1), my = 540 * (z - 1), sx = Math.max(-mx, Math.min(mx, (T.shift ?? [0, 0])[0])), sy = Math.max(-my, Math.min(my, (T.shift ?? [0, 0])[1]));   /* clamped: never a black bar */ g.fillStyle = '#000'; g.fillRect(0, 0, 1920, 1080); g.save(); g.translate(960 + sx, 540 + sy); g.scale(z, z); g.drawImage(tmp, -960, -540); g.restore(); }
    // readable on a phone: a dark wash behind the words, the heaviest weight, a thick dark outline (LEARNINGS)
    const side = T.side ?? 'right', x0 = side === 'right' ? 1000 : 0, gr = g.createLinearGradient(side === 'right' ? 900 : 1020, 0, side === 'right' ? 1500 : 420, 0);
    gr.addColorStop(0, 'rgba(10,8,30,0)'); gr.addColorStop(1, 'rgba(10,8,30,0.6)'); g.fillStyle = gr; g.fillRect(side === 'right' ? 900 : 0, 0, 1020, 1080);
    const cx = side === 'right' ? 1440 : 480, total = T.lines.reduce((a, l) => a + l[1] * 1.02, 0); let y = 540 - total / 2;
    for (const [str, size, fill] of T.lines) { y += size * 0.86; let sz = size; g.font = `800 ${sz}px ${T.font ?? 'sans-serif'}`; const w = g.measureText(str).width; if (w > 840) { sz = size * 840 / w; g.font = `800 ${sz}px ${T.font ?? 'sans-serif'}`; } g.textAlign = 'center'; g.lineJoin = 'round'; g.save(); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.lineWidth = sz * 0.22; g.strokeStyle = '#16112e'; g.strokeText(str, cx, y); g.restore(); g.lineWidth = sz * 0.2; g.strokeStyle = '#16112e'; g.strokeText(str, cx, y); g.fillStyle = fill; g.fillText(str, cx, y); y += size * 0.16; }
    void x0; return c.toDataURL('image/png');
    }
  }, T);
  await browser.close();
  const D = path.join(FD, 'youtube'); fs.mkdirSync(D, { recursive: true });
  const big = path.join(D, 'thumb-1920.png'), out = path.join(D, 'thumbnail.png');
  fs.writeFileSync(big, Buffer.from(url.split(',')[1], 'base64')); execSync(`ffmpeg -y -loglevel error -i "${big}" -vf scale=1280:720:flags=lanczos "${out}"`); fs.unlinkSync(big);
  console.log('wrote', path.relative(ROOT, out));
}
else if (mode !== 'build') { console.error('unknown mode', mode); process.exit(2); }
