const sharp = require('sharp');
const fs = require('fs');

async function createRefinedGlowbiteStage() {
  const orig = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await orig.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Seamless blend into the card's inner background:
  // Inside the card frame, the background is #0C140E (12, 20, 14) / #101A12 (16, 26, 18)
  const bgR = 14, bgG = 22, bgB = 16;
  const out = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];

      // Distance to edges
      const edgeDistX = Math.min(x, width - 1 - x);
      const edgeDistY = Math.min(y, height - 1 - y);

      // Smooth cubic hermite transition at the perimeter:
      // Keep center (wrapper, chocolate, podium, almonds, shadow) 100% pristine original photo!
      // Wrapper top is at y=155, so top margin should be small (~80px) to not darken wrapper crimp!
      // Wrapper right is at x=1060, so right margin should be ~160px.
      // Left edge of chocolate is at x=370, so left margin ~180px.
      // Bottom contact shadow and almonds are up to y=960, so bottom margin ~50px.

      const fxLeft = Math.min(1, x / 180);
      const fxRight = Math.min(1, (width - 1 - x) / 180);
      const fyTop = Math.min(1, y / 85);
      const fyBottom = Math.min(1, (height - 1 - y) / 60);

      const smooth = (t) => t * t * (3 - 2 * t);
      const f = smooth(fxLeft) * smooth(fxRight) * smooth(fyTop) * smooth(fyBottom);

      out[idx] = Math.round(r * f + bgR * (1 - f));
      out[idx+1] = Math.round(g * f + bgG * (1 - f));
      out[idx+2] = Math.round(b * f + bgB * (1 - f));
    }
  }

  // Save as high-res JPEG for web
  await sharp(out, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile('public/projects/packaging/glow-bite-forest-stage.jpg');

  // Also save to artifact directory
  await sharp(out, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 94 })
    .toFile('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/glow-bite-forest-stage.jpg');

  console.log('Refined glow-bite-forest-stage.jpg created successfully.');
}

createRefinedGlowbiteStage();

