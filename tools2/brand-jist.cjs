const { chromium } = require('playwright');
(async () => {
  const html = (bg, fg, size) => `<html><head><style>
  @font-face { font-family: 'Inter Display'; font-weight: 900; src: url(file:///usr/share/fonts/opentype/inter/InterDisplay-Black.otf); }
  html,body { margin:0; width:${size}px; height:${size}px; background:${bg}; }
  .f { position:absolute; left:50%; top:50%; width:${size*0.465}px; height:${size*0.465}px; transform:translate(-50%,-50%); box-sizing:border-box; border:${size*0.02}px solid ${fg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${size*0.03}px; }
  .r { font-family: 'Inter Display'; font-weight: 900; font-size:${size*0.2}px; line-height:${size*0.155}px; color:${fg}; letter-spacing:${size*0.012}px; display:flex; justify-content:center; }
  .r span { display:inline-block; text-align:center; }
  </style></head><body><div class="f"><div class="r"><span>JI</span></div><div class="r"><span>ST</span></div></div></body></html>`;
  const b = await chromium.launch(), out = '/home/user/animate/studio/brand/';
  for (const [name, bg, fg, size] of [['jist-logo-black', '#000', '#fff', 1200], ['jist-avatar-800', '#000', '#fff', 800], ['jist-logo-white', '#fff', '#000', 1200], ['jist-logo-transparent', 'transparent', '#fff', 1200]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(html(bg, fg, size)); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: out + name + '.png', omitBackground: bg === 'transparent' });
    await p.close();
  }
  await b.close();
})();
