const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function locateLipLine() {
  const { data, info } = await sharp('public/character/debug_mouth_zoom.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  // Let's find pixels where luminance is lowest (the dark mouth line / parted lips)
  const darkPoints = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (a > 200 && lum < 80) {
        darkPoints.push({ x: 450 + x, y: 320 + y, lum, r, g, b });
      }
    }
  }

  if (darkPoints.length > 0) {
    const xs = darkPoints.map(p => p.x);
    const ys = darkPoints.map(p => p.y);
    console.log(`Dark mouth line points count: ${darkPoints.length}`);
    console.log(`X range: [${Math.min(...xs)}, ${Math.max(...xs)}]`);
    console.log(`Y range: [${Math.min(...ys)}, ${Math.max(...ys)}]`);
    const avgX = xs.reduce((a, b) => a + b) / xs.length;
    const avgY = ys.reduce((a, b) => a + b) / ys.length;
    console.log(`Average center: (${avgX.toFixed(1)}, ${avgY.toFixed(1)})`);
  } else {
    console.log('No dark points < 80 lum found');
  }
}

locateLipLine().catch(console.error);
