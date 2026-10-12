#!/usr/bin/env node
// The dashboard's outputs record for a finished video: renders/outputs.json, sent with ArtifactData to outputs/<slug>.
// Upload renders/<slug>-web-720p.mp4 and youtube/thumbnail.png to the dashboard first (Artifact tool, asset: true)
// and pass the two asset ids it returns.
//   usage: node studio/tools/outputs.mjs <slug> <videoAssetId> <thumbAssetId>
import fs from 'node:fs';
import path from 'node:path';
import { vdir } from './lib.mjs';
const [slug, vid, tid] = process.argv.slice(2);
if (!tid) { console.error('usage: node studio/tools/outputs.mjs <slug> <videoAssetId> <thumbAssetId>'); process.exit(2); }
const V = vdir(slug), rd = (f) => fs.readFileSync(path.join(V, f), 'utf8');
const piece = JSON.parse(rd('piece.json')), metadata = rd('youtube/metadata.md'), script = rd('voice/script.md');
const sec = (name) => (metadata.split(`\n## ${name}\n`)[1] || '').split('\n## ')[0].trim();
const doc = { title: piece.title, ytTitle: sec('Title').split('\n')[0], description: sec('Description'),
  video: { id: vid }, thumb: { id: tid }, script, metadata, updated: Date.now() };
const out = path.join(V, 'renders', 'outputs.json');
fs.writeFileSync(out, JSON.stringify(doc));
console.log('wrote', path.relative(process.cwd(), out), `(${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
