  // =====================================================================
  //  SCORE — light under the voice (the narration windows duck it); sfx on every visual cue.
  //  arc: a soft pad (the hook) -> a watery arpeggio (blue blood) -> a groove (the race, the hearts) -> fullest (the body heart)
  //  -> the swim: busiest, then the flatline -> dead silence 64.25-66 -> the loudest hit on the landing -> the opening pad, ba-dum
  // =====================================================================
  const T = TIMELINE, c = T.cues, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const heartbeat = (t, v) => { sub(t, v); sub(t + 0.22, v * 0.65); };
  const blooMotif = (t, vel, notes = [['D4', 0], ['A4', E8]]) => notes.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const ARP = ['D4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'E4', 'A4'];

  // ================= MUSIC =================
  to = 'm';
  // 1-2: the hook, a soft pad
  pad(0.0, 13.6, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 800, att: 0.6, rel: 0.3 });
  each(4.0, 13.5, BEAT * 2, (t, k) => pluck(t, nz(['A4', 'Fs4', 'D5', 'E4'][k % 4]), 0.035, Math.sin(k) * 0.3, 0.8, 2000, 0.45));
  // 3: blue blood, a watery arpeggio in 8ths
  pad(13.5, 24.1, ['D3', 'A3', 'E4'], 0.03, { cut: 900, att: 0.4, rel: 0.2, send: 0.4 });
  each(14.0, 24.0, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(ARP[k % 8]), 0.04, Math.sin(k * 0.7) * 0.4, 0.45, 2800, 0.4); });
  blooMotif(c.bloo, 0.18);
  // 4-6: the race and the gill hearts, a groove
  pad(24.0, 34.1, ['D3', 'A3', 'E4'], 0.028, { cut: 1000, att: 0.3, rel: 0.2, send: 0.3 });
  each(24.0, 34.0, E8, (t, k) => {
    const slow = t >= c.goo;
    if (!slow || k % 2 === 0) pluck(t, nz(ARP[k % 8]), 0.045 * (k % 2 ? 0.7 : 1), Math.sin(k * 0.9) * 0.3, slow ? 0.5 : 0.3, slow ? 1800 : 3200, 0.2);
    if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.13);
  });
  drone(34.0, 40.6, nz('A2'), 0.035, { att: 0.5, rel: 0.4 });
  pad(34.0, 40.6, ['A2', 'E3', 'B3'], 0.022, { type: 'triangle', cut: 700, att: 0.6, rel: 0.4 });
  each(35.0, 40.5, BEAT, (t, k) => pluck(t, nz(['E5', 'D5', 'B4', 'A4'][k % 4]), 0.03, 0.3 - (k % 3) * 0.3, 0.7, 1800, 0.5));
  pad(40.5, 49.1, ['D3', 'A3', 'Fs4'], 0.03, { cut: 1100, att: 0.4, rel: 0.2, send: 0.35 });
  each(42.0, 49.0, E8, (t, k) => { pluck(t, nz(ARP[k % 8]), 0.04 * (k % 2 ? 0.7 : 1), Math.sin(k) * 0.3, 0.3, 3000, 0.2); if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.14); });
  // 7: the body heart, the fullest
  pad(49.0, 60.1, ['D3', 'A3', 'D4', 'Fs4'], 0.034, { cut: 1300, att: 0.4, swellTo: 0.042, swellAt: 59.8, rel: 0.1, send: 0.3 });
  each(50.0, 60.0, E16, (t, k) => {
    const fig = ARP[(k >> 1) % 8], acc = k % 4 === 0 ? 1.2 : k % 2 === 0 ? 0.95 : 0.65;
    if (k % 2 === 0 || t > 55) pluck(t, nz(fig), 0.034 * acc, Math.sin(k * 0.9) * 0.35, 0.28, 3600, 0.16);
    if (k % 4 === 0) bass(t, nz(Math.floor(k / 16) % 2 ? 'A2' : 'D2'), 0.15);
  });
  // 8: the swim, busiest; everything stops dry before the silence at 64.25
  each(60.0, 64.0, E16, (t, k) => {
    const dry = t >= 63.5 ? 0.0 : 0.12;
    pluck(t, nz(['D4', 'F4', 'A4', 'D5', 'C5', 'A4', 'F4', 'E4'][k % 8]), 0.05 * (k % 4 === 0 ? 1.25 : 0.85), Math.sin(k * 0.9) * 0.4, 0.2, 4200, dry);
    if (k % 2 === 0) bass(t, nz(k % 16 < 8 ? 'D2' : 'F2'), 0.16);
  });
  pad(60.0, 64.0, ['D3', 'F3', 'A3', 'C4'], 0.032, { cut: 1400, att: 0.2, rel: 0.05, send: 0.05 });
  // 9: the payoff: a stab on the landing, then a flat warm chord, and a playful crawl
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(c.hit + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(c.hit, c.hit + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.5, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });
  pad(66.6, 72.1, ['D3', 'A3', 'D4', 'Fs4'], 0.045, { cut: 1100, att: 0.3, rel: 0.3, send: 0.4 });
  each(67.0, 72.0, E8, (t, k) => { if (k % 3 !== 2) pluck(t, nz(['D5', 'A4', 'B4', 'Fs4', 'A4', 'E4'][k % 6]), 0.04, Math.sin(k) * 0.4, 0.18, 3800, 0.2); if (k % 4 === 0) bass(t, nz('D2'), 0.12); });
  // 10: home: the opening pad, Bloo's motif, the end
  pad(72.0, 81.0, ['D3', 'A3', 'Fs4'], 0.013, { type: 'triangle', cut: 800, att: 0.4, rel: 1.2 });
  each(73.0, 79.0, BEAT * 2, (t, k) => pluck(t, nz(['A4', 'Fs4', 'D5', 'E4'][k % 4]), 0.02, Math.sin(k) * 0.3, 0.8, 2000, 0.45));
  blooMotif(c.wave, 0.1);
  blooMotif(c.title, 0.11, [['D4', 0], ['A4', E8], ['D5', BEAT]]);

  // ================= SFX =================
  to = 's';
  const pop = (t, f = 900, v = 0.05) => blip(t, f, f * 1.6, 0.08, v, R.n(0.3));
  const scribble = (t0, t1, vel = 0.025) => { for (let t = t0; t < t1 - 1e-6; t += E16) noiseHit(t + 0.01, 0.09, 'bandpass', 2800 + R.n(500), 1.4, vel * (0.7 + R.f() * 0.5), 0.2); };
  const swish = (tc) => sweep(tc - 0.35, tc + 0.02, 0.012, 500, 2600, 0);
  T.morphs.forEach(swish);
  // 1 hearts pop with a ba-dum
  [c.pop1, c.pop2, c.pop3].forEach((t, i) => { pop(t, 700 + i * 150); heartbeat(t, 0.16); });
  pop(3.9, 1200);
  // 2 one heart, three hearts, the question
  heartbeat(c.humanHeart, 0.16); pop(c.human, 600); pop(c.humanHeart, 900);
  heartbeat(c.octoHearts, 0.14); [0, 0.25, 0.5].forEach((d, i) => pop(c.octoHearts + d, 900 + i * 200));
  blip(c.ask, 500, 1100, 0.3, 0.05);
  // 3 blue blood: sparkle, the iron clunk and the cross, the copper coin, the word written
  chime(c.bloo, [nz('D6'), nz('A5'), nz('Fs6')], 0.04);
  noiseHit(17.2, 0.18, 'lowpass', 600, 1, 0.12); bass(17.2, nz('D2'), 0.15);
  scribble(17.9, 18.6, 0.03);
  chime(c.pack, [2093, 3136], 0.05, 0.3); noiseHit(c.pack, 0.05, 'highpass', 6000, 1, 0.04, 0.3);
  scribble(c.hemo + 0.1, c.hemo + 0.6, 0.02);
  // 4 the race: the red cell whooshes past; Bloo squelches through the goo
  sweep(c.cell - 0.1, c.cell + 0.45, 0.03, 300, 5000, -0.4);
  noiseHit(c.cell + 0.6, 0.12, 'lowpass', 900, 1, 0.08, 0.4);
  each(c.goo, M[3] - 0.4, 1.0, (t) => noiseHit(t, 0.35, 'lowpass', 380, 4, 0.08, -0.2, 0.1, 160));
  [c.sweat, c.sweat + 0.6, c.sweat + 1.2].forEach((t) => blip(t, 1800, 900, 0.07, 0.03, 0.3));
  // 5 the gills: a squeak, stuck
  each(c.squeeze, c.stuck, 0.25, (t, k) => blip(t, 1400 + k * 120, 1700 + k * 120, 0.1, 0.03, -0.1));
  noiseHit(c.stuck, 0.08, 'bandpass', 2400, 3, 0.07); blip(c.stuck, 900, 600, 0.25, 0.05);
  // 6 the gill hearts pump; Bloo is shoved through and fills with oxygen
  each(c.pumpA, M[5] - 0.6, 1.0, (t) => heartbeat(t, 0.08));
  sweep(c.shove - 0.1, c.shove + 1.0, 0.02, 400, 3000, -0.3);
  each(c.fill + 0.5, c.fill + 2.5, 0.5, (t, k) => blip(t, 700 + k * 180, 1300 + k * 180, 0.09, 0.05, -0.4));
  // 7 the body heart: big pumps; the ride; arms pop; the brain chime
  each(c.bigPump, 59.5, 1.0, (t) => heartbeat(t, 0.1));
  sweep(c.ride - 0.1, c.ride + 1.6, 0.025, 300, 4000, 0.3);
  for (let i = 0; i < 8; i++) pop(c.arms + i * 0.12, 700 + i * 90, 0.04);
  chime(c.brain, [nz('A5'), nz('D6')], 0.045, -0.4);
  [c.arms + 1.2, c.brain + 0.3].forEach((t) => blip(t, 1200, 1800, 0.08, 0.04));
  // 8 the swim: the eel lunges, the jet, the monitor beeps, then the flatline into silence
  noiseHit(c.eel, 0.3, 'lowpass', 700, 1.5, 0.12, 0.5); bass(c.eel, nz('D2'), 0.2);
  sweep(c.jet - 0.05, c.jet + 0.9, 0.05, 200, 5000, -0.3);
  each(60.0, c.stop, 1.0, (t) => blip(t, 1000, 1000, 0.08, 0.03, 0.4));
  { const t = c.stop; for (const f of [1000]) { pluck(t, f, 0.0001); } blip(t, 1000, 1000, 0.7, 0.035, 0.4); }
  // 9 the landing thud (with the stab), the beeps resume, sand puffs
  sub(c.hit, 0.32); noiseHit(c.hit, 0.25, 'lowpass', 900, 0.8, 0.2);
  each(c.hit + 1.0, M[7], 1.0, (t) => blip(t, 1000, 1000, 0.08, 0.025, 0.4));
  // 10 three hearts together; Bloo pops and waves; the title is written
  each(c.sync, 80.0, 1.0, (t) => heartbeat(t, 0.035));
  [74.0, 74.5, 75.5].forEach((t) => pop(t, 1000));
  pop(c.wave, 1300);
  scribble(c.title + 0.1, c.title + 0.6, 0.02);
