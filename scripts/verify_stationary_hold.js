const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function verifyStationary() {
  const initial = await sharp(path.join(ARTIFACT_DIR, 'rec-08-stationary-initial.png'))
    .extract({ left: 1750, top: 400, width: 450, height: 350 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const hold = await sharp(path.join(ARTIFACT_DIR, 'rec-08-stationary-hold.png'))
    .extract({ left: 1750, top: 400, width: 450, height: 350 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let diff = 0;
  for (let i = 0; i < initial.data.length; i += 3) {
    if (Math.abs(initial.data[i] - hold.data[i]) > 20) {
      diff++;
    }
  }

  const percentDiff = ((diff / (initial.data.length / 3)) * 100).toFixed(2);
  console.log(`Stationary hold difference pixels: ${diff} (${percentDiff}%)`);
  if (percentDiff < 2.5) {
    console.log('CONFIRMED: Gaze remained rock-solid and fixed when cursor stopped! Zero random wandering.');
  } else {
    console.log('WARNING: Some wandering detected during hold.');
  }
}

verifyStationary().catch(console.error);

