const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function measurePupil() {
  async function getPupilCenter(file) {
    const { data, info } = await sharp(path.join(ARTIFACT_DIR, file))
      .extract({ left: 1850, top: 480, width: 250, height: 200 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let sumX = 0, sumY = 0, count = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * info.channels;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (lum < 35) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }
    return { x: (sumX / count).toFixed(2), y: (sumY / count).toFixed(2), count };
  }

  const p1 = await getPupilCenter('rec-08-stationary-initial.png');
  const p2 = await getPupilCenter('rec-08-stationary-hold.png');

  console.log(`Initial Pupil Center: (${p1.x}, ${p1.y})`);
  console.log(`Hold 2.0s Pupil Center: (${p2.x}, ${p2.y})`);
  const dx = Math.abs(p1.x - p2.x);
  const dy = Math.abs(p1.y - p2.y);
  console.log(`Pupil Delta after 2.0s: dx=${dx.toFixed(2)}px, dy=${dy.toFixed(2)}px`);
}

measurePupil().catch(console.error);

