const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function cropFace() {
  // Let's crop x: 1700 to 2300, y: 350 to 750 (600x400)
  await sharp(path.join(ARTIFACT_DIR, 'webgl-track-01-neutral.png'))
    .extract({ left: 1700, top: 350, width: 600, height: 400 })
    .toFile('public/character/debug_screen_face_neutral.png');

  await sharp(path.join(ARTIFACT_DIR, 'webgl-track-02-left.png'))
    .extract({ left: 1700, top: 350, width: 600, height: 400 })
    .toFile('public/character/debug_screen_face_left.png');

  await sharp(path.join(ARTIFACT_DIR, 'webgl-track-03-right.png'))
    .extract({ left: 1700, top: 350, width: 600, height: 400 })
    .toFile('public/character/debug_screen_face_right.png');

  console.log('Saved debug face crops for neutral, left, right');
}

cropFace().catch(console.error);

