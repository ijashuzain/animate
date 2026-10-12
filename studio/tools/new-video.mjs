#!/usr/bin/env node
// Start a video from the explainer template: videos/<slug>/ with piece.json (style) and src/script.js + src/scenes.js.
//   usage: node studio/tools/new-video.mjs <slug> "<Title>" [style=cut-paper]
// Styles: any folder in engine/animate/styles (cut-paper, crosshatch, riso, sketchbook, math, pixel, isometric) or styles/<name> made with new-style.md.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ENGINE, vdir, setStatus } from './lib.mjs';
const [slug, title, style = 'cut-paper'] = process.argv.slice(2);
if (!slug || !title) { console.error('usage: node studio/tools/new-video.mjs <slug> "<Title>" [style]'); process.exit(2); }
const styles = fs.readdirSync(path.join(ENGINE, 'styles')).filter((n) => fs.existsSync(path.join(ENGINE, 'styles', n, 'kit.js')));
if (!styles.includes(style) && !fs.existsSync(path.join(ROOT, 'styles', style, 'kit.js'))) { console.error(`unknown style "${style}"; have: ${styles.join(', ')}`); process.exit(2); }
const D = vdir(slug);
if (fs.existsSync(D)) { console.error(`videos/${slug} already exists`); process.exit(1); }
fs.cpSync(path.join(ROOT, 'studio', 'templates', 'explainer'), D, { recursive: true });
for (const f of ['piece.json', 'src/script.js']) { const p = path.join(D, f); fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replaceAll('__SLUG__', slug).replaceAll('__TITLE__', title).replaceAll('__STYLE__', style)); }
fs.mkdirSync(path.join(D, 'voice'), { recursive: true }); fs.mkdirSync(path.join(D, 'youtube'), { recursive: true });
fs.writeFileSync(path.join(D, 'research.md'), `# ${title}: research\n\n## The one true thing\n\n## Facts (each with a source)\n| claim | source |\n|---|---|\n\n## Visual references / assets\n\n## Style choice and why\n\n`);
setStatus(slug, { title, style, stage: 'researching', detail: 'Folder created from the explainer template', why: 'Every fact on screen gets checked before any drawing', progress: 0 }, `created videos/${slug} (${style})`);
console.log(`videos/${slug} created (style: ${style}). Next: research.md, then src/script.js (SCN, META, THUMB) and src/scenes.js.`);
