const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function inspectCapture() {
  const file = path.join(ARTIFACT_DIR, 'webgl-track-01-neutral.png');
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  console.log(`Image info: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Inspect character chest / head region (x: 1400-1800, y: 600-1100 in 2880x1800 retina coords)
  // Check if non-background pixels exist (background is warm ivory #F3F3E7: r~243, g~243, b~231)
  let nonBgCount = 0;
  for (let y = 300; y < 1400; y += 10) {
    for (let x = 1200; x < 2600; x += 10) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Check if it's dark hair (r<60), skin (r~210, g~150), or berry magenta
      if (r < 100 || (r > 180 && g < 180)) {
        nonBgCount++;
      }
    }
  }

  console.log(`Sampled character pixels count: ${nonBgCount}`);
}

inspectCapture().catch(console.error);

