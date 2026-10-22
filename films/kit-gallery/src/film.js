// The kit gallery: every reusable character and prop in one frame (studio/references/kit-gallery.png). Re-render it after
// adding to kit/ so the next pitch can see what is ready: node tools2/film.mjs kit-gallery still 1.2 1 -> copy the png.
const FONT = '"Nunito", sans-serif';
// [label, visible height in local units, centre x, centre y, draw(t)]
const CELLS = [
  ['Cast.person (poses, look-at)', 260, 0, 120, (t) => { Cast.person(t, -60, 200, { pose: 'wave', kid: true, look: [200, 300] }); Cast.person(t, 70, 200, { pose: 'point', kid: false, shirt: '#4f7fc4', seed: 3 }); }],
  ['Creatures.water (hero molecule)', 260, 0, 0, (t) => Creatures.water(t, 0, -10, 1.3, { arms: 'wave', wave: 1, mood: 'happy' })],
  ['Creatures.molecule (crowd)', 300, 0, 0, (t) => { for (let i = 0; i < 6; i++) Creatures.molecule(t, -110 + (i % 3) * 110, (i < 3 ? 60 : -60), 0.75, i * 4 + 0); }],
  ['Creatures.dino (neck 0..1)', 1000, 60, 350, (t) => Creatures.dino(t, 0, 0, 1, 0.5 + 0.5 * Math.sin(t), '#8fa86a')],
  ['Creatures.angler', 260, 0, 30, (t) => Creatures.angler(t, -20, 0, 1.2, 1, 'happy')],
  ['Creatures.crab', 160, 0, 30, (t) => Creatures.crab(t, 0, 0, 1.4, false)],
  ['Creatures.turtle', 200, 0, 0, (t) => Creatures.turtle(t, -10, 0, 1.1, 1)],
  ['Nature: fish school, whale, jelly', 700, 0, 0, (t) => { Nature.whale(t, 0, 120, 0.6, '#2d5580', 1); Nature.school(t, 0, 8, -500, 500, -140, 10, ['#ffb25a', '#7fd0ff'], 0.8, 2); Nature.jelly(t, 280, 160, 1.2, 1); }],
  ['Nature: bird, palm, tree, cloud', 600, 0, 200, (t) => { Nature.palm(t, -180, 0, 300, 2); Nature.tree(t, 160, 0, 260, '#3f8f45', 3); Nature.cloud(40, 420, 0.6, 4); Nature.bird(t, -20, 330, 1.4, 1); }],
  ['Props.volcano + plume + eruption', 1300, 0, -80, (t) => { Props.plume(t, -450, 1, 0); Props.volcano(t, 700, { veg: 0.6, beach: 1 }); Props.eruption(t, 0.35, 0, 170, 3); }],
  ['Props.canoe', 360, 0, 120, (t) => Props.canoe(t, 0, 0, 1)],
  ['Props.house + waterwheel', 300, 0, 90, (t) => { Props.house(-90, 0, 1.3, null, 2); Props.waterwheel(t, 120, 60, 0.9); }],
  ['Props.signpost', 420, 0, 190, (t) => Props.signpost(t, 0, 0, 1, [['LEFT', 'a choice', -1, 300, '#e35d4f'], ['RIGHT', 'or this', 1, 200, '#3ec4d6'], ['HERE', '', -1, 100, '#ffd36b']], [], FONT)],
  ['Props.raindrop (sphere -> bun)', 300, 0, 0, (t) => { Props.raindrop(t, -90, 0, 0.6, 0, 0); Props.raindrop(t, 90, 0, 0.6, 1, 1); }],
  ['Props.conifer (sapling -> giant)', 100, 0, 45, (t) => { Props.conifer(t, 30, { x: -30 }); Props.conifer(t, 80, { x: 25, seed: 2 }); }],
  ['Props.tower, wingedSeed, saltCrystal', 120, 0, 50, (t) => { Props.tower(t, -20); Props.at ? 0 : 0; P.at(30, 30, 0, 4, 4, () => Props.wingedSeed(0, 0, 1, 0.4, 0)); P.at(30, 70, 0, 0.3, 0.3, () => Props.saltCrystal(0, 0, 1, 0.2)); }],
];
const FILM = {
  draw(t) {
    const ctx = P.ctx; P.sky('#26244a', '#3a3870');
    const cols = 4, w = 480, h = 270;
    CELLS.forEach(([label, vh, cx, cy, fn], i) => {
      const x0 = (i % cols) * w, y0 = Math.floor(i / cols) * h, k = (h - 40) / vh;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(x0 + 4, y0 + 4, w - 8, h - 8); ctx.clip();
      const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#8fc6ee'); g.addColorStop(1, '#d8eefa'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
      ctx.setTransform(k, 0, 0, -k, x0 + w / 2 - k * cx, y0 + 20 + (h - 40) / 2 + k * cy);
      try { fn(t); } catch (e) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#f00'; ctx.fillText(String(e.message).slice(0, 60), x0 + 10, y0 + 60); }
      ctx.restore();
      P.text(label, x0 + w / 2, y0 + h - 18, { font: FONT, size: 20, weight: 800, color: '#1a2a4a' });
    });
  },
};
