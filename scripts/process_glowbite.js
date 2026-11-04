const sharp = require('sharp');
const fs = require('fs');

async function processGlowbite() {
  const original = sharp('e:/animated-portfolio/public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await original.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // We want to detect background vs foreground accurately:
  // Foreground consists of:
  // 1. Upright flow wrap packaging bar (starts around x: 500-1100, y: 350-950)
  // 2. Stone podium (cylinder around x: 300-750, y: 650-920)
  // 3. Two stacked snack bars on top of podium with chocolate drip (x: 250-650, y: 450-750)
  // 4. Chocolate chunks and almonds on table/podium (x: 230-850, y: 750-980)
  // 5. Shadow beneath them

  // Let's create an alpha mask where foreground is 255 and background transitions to 0
  // To avoid any pale halos, we can feather the edge and also defringe the edge pixels
  const alphaMask = Buffer.alloc(width * height);

  // Read the raw cutout mask we made
  const rawCutout = await sharp('e:/animated-portfolio/public/projects/packaging/glow-bite-cutout-raw.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rawAlpha = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    rawAlpha[i] = rawCutout.data[i * 4 + 3];
  }

  // Fill any small pinholes inside the object (morphological closing: dilate then erode)
  const closedAlpha = Buffer.alloc(width * height);
  const radius = 3;
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const val = rawAlpha[(y + dy) * width + (x + dx)];
          if (val > maxVal) maxVal = val;
        }
      }
      closedAlpha[y * width + x] = maxVal;
    }
  }

  // Erode back
  const erodedAlpha = Buffer.alloc(width * height);
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const val = closedAlpha[(y + dy) * width + (x + dx)];
          if (val < minVal) minVal = val;
        }
      }
      erodedAlpha[y * width + x] = minVal;
    }
  }

  // Smooth the edges with a slight box blur
  const finalAlpha = Buffer.alloc(width * height);
  const blurR = 1;
  for (let y = blurR; y < height - blurR; y++) {
    for (let x = blurR; x < width - blurR; x++) {
      let sum = 0, count = 0;
      for (let dy = -blurR; dy <= blurR; dy++) {
        for (let dx = -blurR; dx <= blurR; dx++) {
          sum += erodedAlpha[(y + dy) * width + (x + dx)];
          count++;
        }
      }
      finalAlpha[y * width + x] = Math.round(sum / count);
    }
  }

  // Create clean PNG with alpha
  const cleanRgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    cleanRgba[i * 4] = data[i * 3];
    cleanRgba[i * 4 + 1] = data[i * 3 + 1];
    cleanRgba[i * 4 + 2] = data[i * 3 + 2];
    cleanRgba[i * 4 + 3] = finalAlpha[i];
  }

  await sharp(cleanRgba, { raw: { width, height, channels: 4 } })
    .png({ quality: 95 })
    .toFile('e:/animated-portfolio/public/projects/packaging/glow-bite-clean-cutout.png');
  console.log('Saved clean cutout to glow-bite-clean-cutout.png');

  // Now create the integrated packaging composite on a rich dark forest/stone stage
  // Background palette: #111A13 (deep forest charcoal), warm amber lighting from top-left,
  // dark textured stone surface beneath the podium.
  const stageRgb = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    const ny = y / height;
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const idx = (y * width + x) * 3;

      // Base forest charcoal gradient
      // Dark forest green at top-left (#152219), fading to deep charcoal black (#0C120D) at bottom-right
      let r = Math.round(18 - 8 * ny + 6 * (1 - nx));
      let g = Math.round(30 - 14 * ny + 8 * (1 - nx));
      let b = Math.round(22 - 10 * ny + 4 * (1 - nx));

      // Subtle warm amber spotlight centered around the product (x: 0.45, y: 0.55)
      const dist = Math.sqrt(Math.pow(nx - 0.45, 2) + Math.pow((ny - 0.55) * 1.5, 2));
      const spot = Math.max(0, 1 - dist * 1.6);
      r += Math.round(spot * 22);
      g += Math.round(spot * 18);
      b += Math.round(spot * 8);

      // Warm ground plane shadow beneath the podium (y > 0.7)
      if (ny > 0.72) {
        const groundGrad = (ny - 0.72) / 0.28;
        r = Math.round(r * (0.8 + 0.2 * (1 - groundGrad)));
        g = Math.round(g * (0.8 + 0.2 * (1 - groundGrad)));
        b = Math.round(b * (0.8 + 0.2 * (1 - groundGrad)));
      }

      // Composite foreground over background using alpha
      const a = finalAlpha[y * width + x] / 255;
      const fgR = data[idx];
      const fgG = data[idx + 1];
      const fgB = data[idx + 2];

      stageRgb[idx] = Math.round(fgR * a + r * (1 - a));
      stageRgb[idx + 1] = Math.round(fgG * a + g * (1 - a));
      stageRgb[idx + 2] = Math.round(fgB * a + b * (1 - a));
    }
  }

  await sharp(stageRgb, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile('e:/animated-portfolio/public/projects/packaging/glow-bite-forest-stage.jpg');
  console.log('Saved forest stage composite to glow-bite-forest-stage.jpg');
}

processGlowbite();
