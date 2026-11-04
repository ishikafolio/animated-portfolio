const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function analyzeMouth() {
  const { data, info } = await sharp('public/character/debug_mouth_zoom.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  // Left: 450, Top: 320 in master image
  // Look for darkest lines (lip line), pink/red tones (lips), and white/bright (teeth/highlights)
  console.log(`Analyzing mouth crop ${w}x${h}`);
  
  let minLum = 255, maxLum = 0;
  let lipPixels = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;

      // Check if it's lip colored (higher red compared to green/blue)
      if (r > 160 && r > g * 1.25 && r > b * 1.3) {
        lipPixels++;
      }
    }
  }

  console.log(`Mouth stats: minLum=${minLum}, maxLum=${maxLum}, lipPixels=${lipPixels}`);
}

analyzeMouth().catch(console.error);

