// The JIST logo: a square frame with "JI" over "ST", book-like serif (the user's reference: a framed stacked monogram).
//   node tools2/brand-jist.cjs  ->  studio/brand/jist-*.png  (black, white, transparent, 800 px avatar) + a font comparison
const { chromium } = require('playwright');
const FONTS = { charter: ['Bitstream Charter', 400], serif: ['FreeSerif', 400], caladea: ['Caladea', 400] };
const html = (bg, fg, size, [family, weight]) => `<html><head><style>
  html,body { margin:0; width:${size}px; height:${size}px; background:${bg}; }
  .f { position:absolute; left:50%; top:50%; width:${size * 0.465}px; height:${size * 0.465}px; transform:translate(-50%,-50%); box-sizing:border-box;
       border:${size * 0.011}px solid ${fg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${size * 0.028}px; }
  .r { font-family:'${family}'; font-weight:${weight}; font-size:${size * 0.19}px; line-height:${size * 0.15}px; color:${fg}; letter-spacing:${size * 0.045}px; padding-left:${size * 0.045}px; }
  </style></head><body><div class="f"><div class="r">JI</div><div class="r">ST</div></div></body></html>`;
(async () => {
  const b = await chromium.launch(), out = __dirname + '/../studio/brand/', pick = FONTS[process.argv[2] ?? 'serif'];
  const shot = async (name, bg, fg, size, font) => { const p = await b.newPage({ viewport: { width: size, height: size } }); await p.setContent(html(bg, fg, size, font)); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: out + name + '.png', omitBackground: bg === 'transparent' }); await p.close(); };
  for (const [k, f] of Object.entries(FONTS)) await shot('jist-try-' + k, '#000', '#fff', 800, f);
  for (const [name, bg, fg, size] of [['jist-logo-black', '#000', '#fff', 1200], ['jist-avatar-800', '#000', '#fff', 800], ['jist-logo-white', '#fff', '#000', 1200], ['jist-logo-transparent', 'transparent', '#fff', 1200]]) await shot(name, bg, fg, size, pick);
  await b.close();
})();
