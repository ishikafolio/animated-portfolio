const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function measureEyePositions() {
  const files = [
    { name: 'Neutral', file: 'webgl-track-01-neutral.png' },
    { name: 'Gaze Left', file: 'webgl-track-02-left.png' },
    { name: 'Gaze Right', file: 'webgl-track-03-right.png' },
    { name: 'Gaze Up', file: 'webgl-track-04-up.png' },
    { name: 'Gaze Down', file: 'webgl-track-05-down.png' },
    { name: 'Diagonal TR', file: 'webgl-track-06-diagonal-tr.png' },
    { name: 'Diagonal BL', file: 'webgl-track-07-diagonal-bl.png' },
  ];

  console.log('--- Measuring Eye Pupil Shifts Across Captures ---');
  for (const item of files) {
    const filePath = path.join(ARTIFACT_DIR, item.file);
    const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });

    // In 2880x1800 screenshot:
    // Hero character is on the right half: x ~ 1800-2400, y ~ 400-800
    // Let's find darkest pixels in the right eye area:
    let sumX = 0, sumY = 0, count = 0;
    // Eye region search window
    for (let y = 450; y < 750; y++) {
      for (let x = 1850; x < 2150; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Pupil is extremely dark (lum < 40)
        if (lum < 40) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }

    if (count > 0) {
      const avgX = (sumX / count).toFixed(1);
      const avgY = (sumY / count).toFixed(1);
      console.log(`[${item.name.padEnd(12)}] Pupil Center: (${avgX}, ${avgY}) (samples: ${count})`);
    } else {
      console.log(`[${item.name.padEnd(12)}] No dark pupil points detected in window`);
    }
  }
}

measureEyePositions().catch(console.error);

