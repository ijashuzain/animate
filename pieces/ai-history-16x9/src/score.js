  // =====================================================================
  //  SCORE — the original's arc at 2 minutes, under a voice (ducked under TIMELINE.narration):
  //  warm and sparse (1950–66) -> a cold drone (the winter) -> the groove returns (1986) and builds -> fullest (2020)
  //  -> dead silence (92–94.5) -> the enter key: the loudest hit -> warm (2025) -> the opening note
  // =====================================================================
  const R = RNG('score16');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const FIG = [['D4', 'A4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'A4'], ['D4', 'A4', 'B4', 'A4', 'E5', 'A4', 'B4', 'A4'], ['Fs4', 'A4', 'Cs5', 'A4', 'E5', 'A4', 'Cs5', 'A4'], ['D4', 'Fs4', 'A4', 'D5', 'Fs5', 'D5', 'A4', 'Fs4']];
  const sparkMotif = (t, vel, notes = [['D4', 0], ['A4', E8]]) => notes.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const NT = (e, x) => newT(e, x);

  // ================= MUSIC =================
  to = 'm';
  pad(0, 9.1, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 800, att: 0.4, rel: 0.3 });
  sparkMotif(NT(0, 2.25), 0.18);
  pad(9, 34.1, ['D3', 'A3', 'E4'], 0.028, { cut: 900, att: 0.4, rel: 0.3, send: 0.3 });
  each(9, 17, BEAT, (t, k) => pluck(t, nz(FIG[0][(k * 2) % 8]), 0.045, Math.sin(k) * 0.3, 0.4, 2600, 0.25));
  each(17, 34, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(FIG[k < 32 ? 1 : 2][k % 8]), 0.045, Math.sin(k * 0.9) * 0.3, 0.32, 3000, 0.2); if (k % 4 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.13); });
  // the winter
  drone(34, 44.4, nz('D2'), 0.035, { att: 0.8, rel: 0.6 });
  pad(34, 44.4, ['A2', 'D3'], 0.016, { type: 'triangle', cut: 500, att: 1, rel: 0.6 });
  [35, 37.5, 40, 42.5].forEach((t, i) => pluck(t, nz(['A5', 'Fs5', 'E5', 'D5'][i]), 0.03, 0.3 - i * 0.2, 0.9, 1800, 0.6));
  // the comeback: the beat returns at 1986 and builds to 2020
  pad(44, 85.1, ['D3', 'A3', 'E4'], 0.03, { cut: 1000, att: 0.6, swellTo: 0.04, swellAt: 84.9, rel: 0.1, send: 0.25 });
  each(44, 85, E16, (t, k) => {
    const sec = t < 52 ? 0 : t < 60 ? 1 : t < 68 ? 2 : t < 77 ? 3 : 4, fig = FIG[Math.floor(k / 8) % 4], acc = k % 4 === 0 ? 1.25 : k % 2 === 0 ? 1.0 : 0.75;
    const dens = [k % 4 === 0, k % 2 === 0, k % 2 === 0 || k % 8 === 3, k % 2 === 0 || k % 4 === 3, true][sec];
    if (dens) pluck(t, nz(fig[k % 8]), (0.04 + sec * 0.003) * acc, Math.sin(k * 0.9) * 0.35, 0.3, 3200 + sec * 400, 0.16);
    if (k % 4 === 0) bass(t, nz(Math.floor(k / 16) % 2 ? 'A2' : 'D2'), 0.13 + sec * 0.01);
    if (sec >= 2 && k % 8 === 0) sub(t, 0.05 + sec * 0.004);
  });
  // 2020: the library, the fullest; stops dead at 92.0 (dry in the last beat)
  pad(85, 92.0, ['D3', 'A3', 'E4', 'A4'], 0.03, { cut: 1300, att: 0.05, rel: 0.02, send: 0.08 });
  each(85, 92, E16, (t, k) => {
    const fig = FIG[Math.floor(k / 8) % 4], acc = k % 4 === 0 ? 1.3 : 0.9, dry = t >= 91.5 ? 0.02 : 0.1;
    pluck(t, nz(fig[k % 8]), 0.055 * acc, Math.sin(k * 0.9) * 0.4, t >= 91.75 ? 0.18 : 0.28, 5600, dry);
    if (k % 2 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.15);
    if (k % 4 === 0) sub(t, 0.065);
    noiseHit(t, 0.016, 'highpass', 8500, 0.7, k % 2 ? 0.016 : 0.026, k % 2 ? 0.3 : -0.3);
  });
  riser(91.0, 91.95, 0.014);
  // enter: the stab on the hit, then a flat warm chord
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(HIT + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(HIT, HIT + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.5, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });
  pad(95, 103.1, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.04, { cut: 1300, att: 0.25, rel: 0.4, send: 0.5 });
  drone(95, 103.1, nz('D2'), 0.05, { att: 0.12, rel: 0.4 });
  each(96, 103, BEAT, (t, k) => pluck(t, nz(['A4', 'D5', 'Fs5', 'E5', 'D5', 'A4'][k % 6]), 0.034, (k % 3 - 1) * 0.2, 0.6, 3000, 0.4));
  // 2025: warm and quieter; the end: the opening pad and the motif
  pad(103, 112.1, ['D3', 'A3', 'D4', 'Fs4'], 0.035, { cut: 1000, att: 0.3, rel: 0.3, send: 0.4 });
  each(103, 112, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(FIG[3][k % 8]), 0.034, Math.sin(k) * 0.3, 0.35, 2600, 0.25); if (k % 4 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A2' : 'D2'), 0.1); });
  pad(112, 120, ['D3', 'A3', 'Fs4'], 0.024, { type: 'triangle', cut: 800, att: 0.3, rel: 1.5 });
  sparkMotif(116.5, 0.12, [['D4', 0], ['A4', E8], ['D5', BEAT]]);

  // ================= SFX =================
  to = 's';
  const swish = (tc) => sweep(tc - 0.35, tc + 0.02, 0.008, 500, 2600, 0);
  TIMELINE.morphs.forEach(swish);
  const scratch = (t0, t1, vel = 0.022) => { for (let t = t0; t < t1 - 1e-6; t += E16) noiseHit(t + 0.01, 0.09, 'bandpass', 2800 + R.n(500), 1.4, vel * (0.7 + R.f() * 0.5), 0.2); };
  const pop = (t, f = 900, v = 0.025) => blip(t, f, f * 1.5, 0.07, v, 0.4);
  scratch(NT(0, 0.25), NT(0, 2.25));                                   // Turing's pen
  each(NT(1, 4.3), NT(1, 7.5), 0.5, (t) => noiseHit(t, 0.03, 'bandpass', 3200, 3, 0.03, -0.2));   // chalk taps
  each(NT(2, 8.3), NT(2, 10.4), 0.5, (t) => noiseHit(t, 0.02, 'highpass', 4000, 1, 0.025, 0.2));  // knob clicks
  chime(NT(2, 10.5), [nz('A5'), nz('E6')], 0.05);                     // "yes!"
  each(NT(3, 12.2), NT(3, 15.5), 0.11, (t, k) => { if (k % 5 < 3) noiseHit(t, 0.02, 'bandpass', 2400 + R.n(400), 2, 0.02, R.n(0.4)); });   // teletype
  noiseHit(34.2, 9.6, 'bandpass', 700, 0.5, 0.012, 0, 0, 300);       // winter wind
  noiseHit(NT(6, 27.0), 0.2, 'lowpass', 500, 1, 0.12); bass(NT(6, 27.0), nz('D2'), 0.15);   // the king falls
  each(NT(7, 29.5), NT(7, 30.7), 0.3, (t) => noiseHit(t, 0.03, 'highpass', 5000, 1, 0.03, 0.3));  // shutter clicks
  chime(NT(7, 31.0), [nz('D6'), nz('A6')], 0.035);                    // "cat!"
  noiseHit(NT(8, 35.0), 0.06, 'bandpass', 1800, 4, 0.08); sub(NT(8, 35.0), 0.06);   // move 37
  [92.75 + 1.25, 92.75 + 1.5].forEach((t) => noiseHit(t, 0.03, 'highpass', 3000, 1, 0.03, -0.2));   // two soft key clicks in the hush
  sub(HIT, 0.3); noiseHit(HIT, 0.2, 'lowpass', 1200, 0.8, 0.18);     // ENTER
  [NT(13, 52.5), NT(13, 53.0), NT(13, 53.5)].forEach((t, i) => pop(t, 900 + i * 200));
  chime(NT(13, 54.5), [nz('D5'), nz('A5'), nz('D6')], 0.04);          // tests pass
  scratch(NT(14, 56.5), NT(14, 58.0), 0.018);                          // "good question."
  // the card's pops, soft
  NEW.forEach(([a], e) => { if (e !== 11) [1.6, 3.0, 4.4].forEach((d) => pop(a + d, 1200 + e * 30, 0.012)); });
