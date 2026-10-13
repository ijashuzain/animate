#!/usr/bin/env node
// Hear every music genre on one piece: renders the piece's score once per genre (score-channel.js GENRES) and writes
// renders/genre-<name>.mp3 (the first <seconds>), plus renders/genres.mp3 with all of them in a row.
//   usage: node studio/tools/sampler.mjs <slug> [seconds=24] [genre,genre,...]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { build, withPage, vdir } from './lib.mjs';
const [slug, secArg, list] = process.argv.slice(2);
if (!slug) { console.error('usage: node studio/tools/sampler.mjs <slug> [seconds] [genres]'); process.exit(2); }
const sec = Number(secArg ?? 24), genres = (list ?? 'paper,lofi,synth,pizzicato,ambient,chiptune,folk,mystery').split(',');
if (!build(slug)) process.exit(1);
const R = path.join(vdir(slug), 'renders'); fs.mkdirSync(R, { recursive: true });
const parts = [];
await withPage(slug, async (page) => {
  for (const g of genres) {
    const b64 = await page.evaluate(async (name) => { window.GENRE = name; return await window.renderAudioWav(); }, g);
    const wav = path.join(R, `genre-${g}.wav`), mp3 = path.join(R, `genre-${g}.mp3`);
    fs.writeFileSync(wav, Buffer.from(b64, 'base64'));
    execSync(`ffmpeg -y -loglevel error -i "${wav}" -t ${sec} -af "afade=t=out:st=${sec - 1.5}:d=1.5" -c:a libmp3lame -b:a 160k "${mp3}"`); fs.unlinkSync(wav);
    parts.push(mp3); console.log('wrote', path.relative(process.cwd(), mp3));
  }
});
const listFile = path.join(R, 'genres.txt'), gap = path.join(R, 'gap.mp3');
execSync(`ffmpeg -y -loglevel error -f lavfi -i anullsrc=r=48000:cl=stereo -t 0.8 -c:a libmp3lame -b:a 160k "${gap}"`);
fs.writeFileSync(listFile, parts.flatMap((p) => [`file '${p}'`, `file '${gap}'`]).join('\n'));
execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -b:a 160k "${path.join(R, 'genres.mp3')}"`);
fs.unlinkSync(listFile); fs.unlinkSync(gap);
console.log('wrote', path.relative(process.cwd(), path.join(R, 'genres.mp3')), `(${genres.join(', ')}; ${sec}s each)`);
