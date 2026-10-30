// The kit gallery: every reusable character and prop in one frame (studio/references/kit-gallery.png). Re-render it after
// adding to kit/ so the next pitch can see what is ready: node tools2/film.mjs kit-gallery still 1.2 1 -> copy the png.
const FONT = '"Nunito", sans-serif';
// [label, visible height in local units, centre x, centre y, draw(t)]
const PAGE0 = [
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
// page 1: mammals (Animals.quad + the hero cat); page 2: birds, reptiles, small creatures, sea; page 3: nature
const Q = (k, vh, extra = {}) => [`Animals.quad '${k}'`, vh, 0, vh * 0.42, (t) => Animals.quad(t, 0, 0, 1, k, extra)];
const PAGE1 = [
  ['Animals.cat (hero, the user\'s ref)', 135, 0, 55, (t) => Animals.cat(t, -10, 0, 1, { look: [0.3, 0] })],
  ['Animals.cat falling rig (mid-twist)', 120, 0, 50, (t) => Animals.cat(t, -10, 10, 1, { front: 0.8, back: 0.25, tuckF: 0.6, bend: 0.4, mood: 'wow' })],
  Q('dog', 110, { walk: 1 }), Q('fox', 100), Q('wolf', 120), Q('deer', 150), Q('bear', 140), Q('elephant', 220),
  Q('lion', 140), Q('tiger', 130), Q('zebra', 160), Q('giraffe', 260), Q('horse', 180), Q('cow', 170), Q('rabbit', 70), Q('mouse', 50),
];
const PAGE2 = [
  ['bird: gull (flying)', 80, 0, 0, (t) => Animals.bird(t, 0, 0, 1, 'gull', { fly: true })],
  ['bird: condor (soaring)', 140, 0, 0, (t) => Animals.bird(t, 0, 0, 1, 'condor', { fly: true })],
  ['bird: raven, sparrow', 80, 0, 30, (t) => { Animals.bird(t, -25, 0, 1, 'raven'); Animals.bird(t, 30, 0, 1.2, 'sparrow'); }],
  ['bird: parrot, owl', 80, 0, 30, (t) => { Animals.bird(t, -25, 0, 1, 'parrot'); Animals.bird(t, 30, 0, 1.2, 'owl'); }],
  ['bird: penguin, flamingo', 110, 0, 45, (t) => { Animals.bird(t, -25, 0, 1.2, 'penguin'); Animals.bird(t, 30, 0, 1, 'flamingo'); }],
  ['bird: eagle (flying)', 110, 0, 0, (t) => Animals.bird(t, 0, 0, 1, 'eagle', { fly: true })],
  ['Animals.lizard (walking)', 50, -5, 12, (t) => Animals.lizard(t, -5, 0, 1, { walk: 1 })],
  ['Animals.snake (rattle)', 50, -20, 10, (t) => Animals.snake(t, 0, 0, 1, { rattle: true })],
  ['Animals.croc', 90, 0, 20, (t) => Animals.croc(t, 0, 0, 1)],
  ['Animals.frog', 40, 0, 15, (t) => Animals.frog(t, 0, 0, 1)],
  ['Animals.trilobite', 40, 5, 10, (t) => Animals.trilobite(t, 0, 0, 1)],
  ['butterfly, bee, ladybug, snail', 60, 0, 15, (t) => { Animals.butterfly(t, -25, 20, 1); Animals.bee(t, 5, 22, 1); Animals.ladybug(t, -10, 0, 1); Animals.snail(t, 25, 0, 1); }],
  ['Animals.octopus', 60, 0, 0, (t) => Animals.octopus(t, 0, 0, 1)],
  ['Animals.starfish, seal', 70, 0, 20, (t) => { Animals.starfish(t, -30, 10, 1); Animals.seal(t, 20, 0, 1); }],
  ['Creatures.crab, turtle (old)', 160, 0, 30, (t) => { Creatures.crab(t, -60, 0, 1, false); Creatures.turtle(t, 60, 30, 0.6, 1); }],
  ['Nature.fish school', 300, 0, 0, (t) => Nature.school(t, 0, 8, -200, 200, 0, 8, ['#ffb25a', '#7fd0ff'], 0.8, 2)],
];
const PAGE3 = [
  ['Nature.rock (faceted)', 120, 0, 40, () => { Nature.rock(-40, 0, 80, 50); Nature.rock(45, 0, 50, 35, { col: '#c46a3a', seed: 3 }); }],
  ['Nature.mesa (canyon wall)', 500, 0, 220, () => Nature.mesa(0, 0, 360, [[120, '#5a3a3a', 'slope'], [110, '#c4543a', 'cliff'], [60, '#a8603a', 'slope'], [70, '#e8c9a0', 'cliff'], [50, '#d9b48a', 'slope']], { side: 1 })],
  ['Nature.peak (faceted)', 300, 0, 120, () => { Nature.peak(-60, 0, 260, 220); Nature.peak(80, 0, 200, 160, { col: '#6a7290' }); }],
  ['Nature.pine (faceted)', 200, 0, 90, (t) => { Nature.pine(t, -40, 0, 180); Nature.pine(t, 50, 0, 130, { col: '#2f7a4a' }); }],
  ['Nature.cactus, shrub', 200, 0, 80, (t) => { Nature.cactus(-40, 0, 160); Nature.shrub(50, 0, 40); }],
  ['Nature.flower (daisy, tulip)', 120, 0, 50, (t) => { Nature.flower(t, -30, 0, 100); Nature.flower(t, 20, 0, 90, { kind: 'tulip', col: '#f2a23a' }); Nature.flower(t, 55, 0, 80, { col: '#8a5ad0' }); }],
  ['Nature.mushroom, grass', 80, 0, 30, (t) => { Nature.mushroom(-20, 0, 50); Nature.grass(t, 25, 0, 40); }],
  ['Nature.stump, log', 80, 0, 25, () => { Nature.stump(-25, 0, 40); Nature.log(30, 0, 60); }],
  ['Nature.palm, tree (old)', 400, 0, 180, (t) => { Nature.palm(t, -80, 0, 300, 2); Nature.tree(t, 90, 0, 260, '#3f8f45', 3); }],
  ['Nature.cloud, rain', 300, 0, 60, (t) => { Nature.cloud(0, 60, 0.8, 4); }],
  ['Props.conifer (old)', 100, 0, 45, (t) => Props.conifer(t, 80, {})],
  ['Props.volcano (old)', 1300, 0, -80, (t) => Props.volcano(t, 700, { veg: 0.6, beach: 1 })],
  ['Nature.stormCloud (cumulonimbus)', 13000, 0, 6000, (t) => Nature.stormCloud(t, 0, 1500, { w: 5500, top: 11000, anvil: 0.6 })],
  ['Nature.boltPath + bolt', 1700, 0, 800, (t) => Nature.bolt(Nature.boltPath(5, [-200, 1600], [100, 0], 80), { px: 3 })],
  ['Nature.oak (lone tree)', 18, 0, 8, (t) => Nature.oak(t, 0, 0, 14)],
  ['Props.barn (lightning rod)', 15, 0, 6.5, (t) => Props.barn(-1, 0, 1, { lit: 0.6 })],
  ['Props.farmhouse (3/4 view, door)', 14, 1.5, 5.5, (t) => Props.farmhouse(t, 0, 1, 0, 0.6)],
];
// page 4: the hero cat's falling rig in the five poses of the user's silhouette reference (+ walk, sleep, look)
const C = (label, o) => [label, 150, 0, 40, (t) => Animals.cat(t, -10, 0, 1, o)];
const PAGE4 = [
  C('1 upside down', { front: 0, back: 0, tuckF: 0.3, tuckB: 0.2, tailUp: 0.8, mood: 'wow' }),
  C('2 front half turns first', { front: 0.72, back: 0.15, tuckF: 0.8, bend: 0.4, mood: 'wow' }),
  C('3 back half follows', { front: 1, back: 0.62, tuckB: 0.8, tuckF: 0.1, bend: 0.3, tailUp: 0.3 }),
  C('4 upright, back arched', { arch: 0.6, legsOut: 0.6, tailUp: 0 }),
  C('5 landing', { arch: 1, legsOut: 0.25, tailUp: 0.1 }),
  C('walk', { walk: 1 }),
  C('sleepy', { mood: 'sleep' }),
  C('looking around', { look: [-0.5, 0.3], tailUp: 0.6 }),
];
// page 5: kit/micro.js (from the blood film): whole screen-space scenes shrunk into the tiles
const S = (label, fn) => [label, 0, 0, 0, fn];
const PAGE5 = [
  S('CELL.vessel + flow + rbc (hero glow)', (t, ctx) => { CELL.vessel(ctx, t, t * 420, [1180, 430]); CELL.flow(ctx, t, t * 420, 160, [1180, 430], { z: 330, x: 760, y: 560, r: 165, ang: -0.35, k: 0.65, glow: 0.9 }); CELL.vesselEdge(ctx, [1180, 430]); }),
  S('CELL.membrane + chain + enzyme', (t, ctx) => { CELL.deep(ctx, t); const e = (u) => [-80 + u * 2100, 360 + u * 500]; CELL.membrane(ctx, t, e); [0.2, 0.45, 0.7].forEach((u, i) => CELL.chain(ctx, t, e(u), [0.24, -0.97], 4, { col: CELL.SUGAR.A, u: 1 }, i, 26)); CELL.enzyme(ctx, t, 1300, 300, 170, -0.6); }),
  S('Micro.marrow + nursery', (t, ctx) => { Micro.marrow(ctx, t); Micro.nursery(ctx, t, t); }),
  S('Micro.antibody, igm, taggedCell', (t, ctx) => { CELL.deep(ctx, t); Micro.taggedCell(ctx, t, 600, 540, 220, -0.3, 0.8, 'A', { fog: 0 }); Micro.taggedCell(ctx, t, 1350, 400, 160, 0.4, 0.8, 'AB', { fog: 0 }); Micro.antibody(ctx, 1000, 800, 90, 0.3, '#ffc23a'); Micro.igm(ctx, 1500, 820, 120, t * 0.3, '#4a8aff'); }),
  S('Micro.capillary (the squeeze)', (t, ctx) => Micro.capillary(ctx, t, 3.5)),
  S('Micro.gut (villi + bacteria)', (t, ctx) => Micro.gut(ctx, t, t)),
  S('Micro.body + vessels', (t, ctx) => { ctx.fillStyle = '#1a2a6a'; ctx.fillRect(0, 0, 1920, 1080); Micro.body(ctx, 960, 760, 760, '#4a5ab0'); Micro.vessels(ctx, t, 960, 760, 760); }),
  S('Micro.bank + bag', (t, ctx) => Micro.bank(ctx, t, 8, 1)),
  S('Micro.jungle + gibbon', (t, ctx) => { Micro.jungle(ctx, t); Micro.gibbon(t, ctx, 820, 170, 520, Math.sin(t) * 0.3); }),
  S('Micro.savanna (acacias)', (t, ctx) => Micro.savanna(ctx, t)),
  S('Micro.mosquito, infected, vibrio', (t, ctx) => { CELL.deep(ctx, t); Micro.mosquito(t, ctx, 1300, 380, 700, -1); Micro.infected(ctx, t, 500, 600, 180, 0.3, 0.85); for (let i = 0; i < 4; i++) Micro.vibrio(ctx, t, 300 + i * 420, 950, 120, i); }),
  S('Micro.world + scale + lineage', (t, ctx) => { Micro.world(ctx, t, 0); Micro.scale(ctx, 960, 760, 260, Math.sin(t) * 0.5); }),
];
PAGE5.screen = true;
const PAGES = [PAGE0, PAGE1, PAGE2, PAGE3, PAGE4, PAGE5];
let CELLS = PAGE0;
const FILM = {
  draw(t) {
    CELLS = PAGES[Math.min(PAGES.length - 1, Math.floor(t))];
    const ctx = P.ctx; P.sky('#26244a', '#3a3870');
    const cols = 4, w = 480, h = 270;
    CELLS.forEach(([label, vh, cx, cy, fn], i) => {
      const x0 = (i % cols) * w, y0 = Math.floor(i / cols) * h, k = (h - 40) / vh;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(x0 + 4, y0 + 4, w - 8, h - 8); ctx.clip();
      const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#8fc6ee'); g.addColorStop(1, '#d8eefa'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
      if (CELLS.screen) ctx.setTransform(w / 1920, 0, 0, w / 1920, x0, y0); else ctx.setTransform(k, 0, 0, -k, x0 + w / 2 - k * cx, y0 + 20 + (h - 40) / 2 + k * cy);
      try { fn(t, ctx); } catch (e) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#f00'; ctx.fillText(String(e.message).slice(0, 60), x0 + 10, y0 + 60); }
      ctx.restore();
      P.text(label, x0 + w / 2, y0 + h - 18, { font: FONT, size: 20, weight: 800, color: CELLS.screen ? '#ffffff' : '#1a2a4a' });
    });
  },
};
