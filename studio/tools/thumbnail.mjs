#!/usr/bin/env node
// A YouTube thumbnail from the video itself (THUMB in src/script.js): render frame THUMB.t, optionally zoom the scene,
// hide the on-scene lettering and write the hook lines big, outlined, straight onto the frame (no panel: the user's rule;
// THUMB.card: true brings back the old torn-paper panel). Writes youtube/thumbnail.png (1280x720, < 2 MB).
//   usage: node studio/tools/thumbnail.mjs <slug>
//   THUMB = { t, panel: '#hex', lines: [[text, size, colour], ...], zoom?: 1.2, focus?: [x, y] }
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { build, withPage, vdir } from './lib.mjs';
const slug = process.argv[2];
if (!slug) { console.error('usage: node studio/tools/thumbnail.mjs <slug>'); process.exit(2); }
if (!build(slug)) process.exit(1);
const png = await withPage(slug, (page) => page.evaluate(() => {
  const J = TIMELINE.thumb; if (!J) throw new Error('no THUMB in src/script.js');
  window.NO_LETTERING = true; renderFrame(J.t); window.NO_LETTERING = false;
  const cv = document.getElementById('c'), g = cv.getContext('2d');
  if (J.zoom && J.zoom > 1) { const tmp = document.createElement('canvas'); tmp.width = 1000; tmp.height = 1080; tmp.getContext('2d').drawImage(cv, 0, 0, 1000, 1080, 0, 0, 1000, 1080); const [fx, fy] = J.focus || [500, 540]; g.save(); g.beginPath(); g.rect(0, 0, 1000, 1080); g.clip(); g.translate(fx, fy); g.scale(J.zoom, J.zoom); g.translate(-fx, -fy); g.drawImage(tmp, 0, 0); g.restore(); }
  ctx = g; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(1440, 540); g.rotate(-0.02); g.translate(-1440, -540);
  if (J.card) { chShape(rrectPts(990, 40, 900, 1000, 8), J.panel, { key: 'thumbpanel', sb: 30, sy: 14, tear: 2.2 }); chShape(rrectPts(1380, 20, 140, 46, 2), 'rgba(240,230,190,0.85)', { key: 'thumbtape', shadow: false, grain: false }); }
  const light = J.card ? /^#(f|e)/i.test(J.panel) : true;
  const total = J.lines.reduce((a, [, s]) => a + s * 1.02, 0); let y = 540 - total / 2;
  for (const [str, size, fill] of J.lines) {
    y += size * 0.86; g.font = `700 ${size}px ${HAND}`; g.textAlign = 'center'; g.lineJoin = 'round';
    if (!J.card) { g.save(); g.shadowColor = 'rgba(20,10,5,0.35)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.lineWidth = Math.max(14, size * 0.2); g.strokeStyle = '#fffaf0'; g.strokeText(str, 1440, y); g.restore(); }
    g.lineWidth = Math.max(8, size * (J.card ? 0.09 : 0.2)); g.strokeStyle = light ? '#fffaf0' : 'rgba(10,12,30,0.85)'; g.strokeText(str, 1440, y);
    g.fillStyle = fill; g.fillText(str, 1440, y); y += size * 0.16;
  }
  g.restore();
  return cv.toDataURL('image/png').split(',')[1];
}));
const D = path.join(vdir(slug), 'youtube'); fs.mkdirSync(D, { recursive: true });
const big = path.join(D, 'thumbnail-1920.png'), out = path.join(D, 'thumbnail.png');
fs.writeFileSync(big, Buffer.from(png, 'base64'));
execSync(`ffmpeg -y -loglevel error -i "${big}" -vf scale=1280:720:flags=lanczos "${out}"`); fs.unlinkSync(big);
console.log('wrote', path.relative(process.cwd(), out), (fs.statSync(out).size / 1e6).toFixed(2), 'MB');
