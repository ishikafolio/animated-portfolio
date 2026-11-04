const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function restoreGlowBite() {
  console.log('--- RESTORING GLOW BITE CUTOUT & FOREST STAGE ---');
  const original = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await original.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const sample = (x, y) => {
    const i = (y * width + x) * 3;
    return [data[i], data[i+1], data[i+2]];
  };

  // Build an accurate foreground mask
  // 1. Identify background pixels from the 4 image borders inward using flood fill
  const isBg = new Uint8Array(width * height);
  const queue = [];

  // Seed borders
  for (let x = 0; x < width; x++) {
    isBg[0 * width + x] = 1;
    queue.push(x, 0);
    isBg[(height - 1) * width + x] = 1;
    queue.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    isBg[y * width + 0] = 1;
    queue.push(0, y);
    isBg[y * width + (width - 1)] = 1;
    queue.push(width - 1, y);
  }

  // Define the bounding safe region for the foreground objects:
  // Any pixel inside the foreground bounding polygon must NEVER be marked as background!
  // The objects are located within:
  // - Chocolate bars: x: 240..660, y: 440..780
  // - Stone podium: x: 280..720, y: 640..920
  // - Energy bar wrapper: x: 620..1120, y: 155..920
  // - Almonds & chocolate chunks: x: 220..1220, y: 740..980
  function isInsideProductZone(x, y) {
    // Top wrapper zone: diagonal serrated seal from (680, 195) to (920, 155)
    // Line equation from (680, 195) to (920, 155):
    // y = 195 + (155 - 195) / (920 - 680) * (x - 680) = 195 - 40/240 * (x - 680) = 195 - (x - 680) / 6
    if (x >= 630 && x <= 1100) {
      const topSealY = 190 - (x - 650) * 0.16;
      if (y >= topSealY && y <= 920) {
        // Right edge of wrapper tilts from (920, 155) to (1100, 880)
        const rightEdgeX = 920 + (y - 155) * 0.25;
        if (x <= rightEdgeX + 25) {
          return true;
        }
      }
    }

    // Chocolate bars & podium zone:
    if (x >= 235 && x <= 660 && y >= 450 && y <= 920) {
      return true;
    }

    // Base podium & almonds & crumbs zone:
    if (x >= 210 && x <= 1220 && y >= 720 && y <= 980) {
      return true;
    }

    return false;
  }

  // Flood fill background
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const cIdx = (cy * width + cx) * 3;
    const cr = data[cIdx], cg = data[cIdx+1], cb = data[cIdx+2];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (isBg[nIndex] === 0) {
          // If this pixel is inside the product zone, do not cross into it!
          if (isInsideProductZone(nx, ny)) {
            continue;
          }

          const nIdx = nIndex * 3;
          const nr = data[nIdx], ng = data[nIdx+1], nb = data[nIdx+2];

          // Check if it looks like the studio background (warm beige/sand wall or floor)
          // Studio background: r in [170, 255], g in [145, 245], b in [120, 230], r >= g >= b
          const diff = Math.abs(nr - cr) + Math.abs(ng - cg) + Math.abs(nb - cb);
          const isStudioBg = (nr >= ng - 5) && (ng >= nb - 10) && (nr >= 160) && (nb <= 235);

          if (diff < 18 && isStudioBg) {
            isBg[nIndex] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Create foreground alpha mask
  const fgAlpha = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    if (isBg[i] === 0) {
      fgAlpha[i] = 255;
    } else {
      fgAlpha[i] = 0;
    }
  }

  // Morphological feathering: slightly soften edges to avoid jagged pixel boundaries
  const featheredAlpha = Buffer.alloc(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += fgAlpha[(y + dy) * width + (x + dx)];
        }
      }
      featheredAlpha[y * width + x] = Math.round(sum / 9);
    }
  }

  // 1. Save refined clean cutout PNG
  const cleanRgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    cleanRgba[i * 4] = data[i * 3];
    cleanRgba[i * 4 + 1] = data[i * 3 + 1];
    cleanRgba[i * 4 + 2] = data[i * 3 + 2];
    cleanRgba[i * 4 + 3] = featheredAlpha[i];
  }

  await sharp(cleanRgba, { raw: { width, height, channels: 4 } })
    .png({ quality: 95 })
    .toFile('public/projects/packaging/glow-bite-clean-cutout.png');
  console.log('Saved restored cutout to glow-bite-clean-cutout.png');

  // 2. Generate composite on dark forest stone stage:
  // Background palette: #101A12 base with warm directional amber lighting from top-left,
  // dark stone floor with soft ground contact shadow beneath the podium and bar.
  const stageRgb = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    const ny = y / height;
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const idx = (y * width + x) * 3;
      const a = featheredAlpha[y * width + x] / 255;

      // Base forest background gradient
      // Top: deep pine #132218 [19, 34, 24]
      // Center: rich forest olive #18281D [24, 40, 29]
      // Bottom: deep charcoal forest #0E1610 [14, 22, 16]
      const distFromCenter = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.55) ** 2);
      const amberRadial = Math.max(0, 1 - Math.sqrt((nx - 0.4) ** 2 + (ny - 0.3) ** 2) * 1.4);

      let bgR = 17 + Math.round(amberRadial * 20);
      let bgG = 26 + Math.round(amberRadial * 18);
      let bgB = 18 + Math.round(amberRadial * 8);

      // Floor plane below y = 720: slightly cooler dark slate
      if (ny > 0.72) {
        const floorBlend = (ny - 0.72) / 0.28;
        bgR = Math.round(bgR * (1 - floorBlend * 0.25));
        bgG = Math.round(bgG * (1 - floorBlend * 0.25));
        bgB = Math.round(bgB * (1 - floorBlend * 0.2));
      }

      // Soft contact shadow beneath the objects
      // Shadow spans from x: 230 to 1250, y: 780 to 980
      if (x >= 220 && x <= 1260 && y >= 770 && y <= 980) {
        const sDistX = Math.min(1, Math.abs(nx - 0.48) / 0.35);
        const sDistY = Math.min(1, Math.abs(ny - 0.88) / 0.12);
        const shadowFactor = Math.max(0, (1 - sDistX) * (1 - sDistY) * 0.55);
        bgR = Math.round(bgR * (1 - shadowFactor));
        bgG = Math.round(bgG * (1 - shadowFactor));
        bgB = Math.round(bgB * (1 - shadowFactor));
      }

      // Composite foreground over background
      const pr = data[idx];
      const pg = data[idx + 1];
      const pb = data[idx + 2];

      stageRgb[idx] = Math.round(pr * a + bgR * (1 - a));
      stageRgb[idx + 1] = Math.round(pg * a + bgG * (1 - a));
      stageRgb[idx + 2] = Math.round(pb * a + bgB * (1 - a));
    }
  }

  await sharp(stageRgb, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile('public/projects/packaging/glow-bite-forest-stage.jpg');

  // Copy to artifact directory
  const artifactDir = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
  fs.copyFileSync('public/projects/packaging/glow-bite-clean-cutout.png', path.join(artifactDir, 'glow-bite-clean-cutout.png'));
  fs.copyFileSync('public/projects/packaging/glow-bite-forest-stage.jpg', path.join(artifactDir, 'glow-bite-forest-stage.jpg'));
  console.log('Restoration completed successfully.');
}

restoreGlowBite();

