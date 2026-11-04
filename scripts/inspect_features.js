const sharp = require('e:/animated-portfolio/node_modules/sharp');
const fs = require('fs');

async function inspectFeatures() {
  // 1. Viewer Left Eye (Character Right Eye)
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 410, top: 160, width: 120, height: 100 })
    .toFile('public/character/crop_eye_left.png');

  // 2. Viewer Right Eye (Character Left Eye)
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 560, top: 220, width: 120, height: 105 })
    .toFile('public/character/crop_eye_right.png');

  // 3. Eyeglasses Complete
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 390, top: 150, width: 330, height: 190 })
    .toFile('public/character/crop_glasses.png');

  // 4. Mouth & Smile
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 440, top: 310, width: 130, height: 95 })
    .toFile('public/character/crop_mouth.png');

  console.log('Saved feature crops: eye_left, eye_right, glasses, mouth');
}

inspectFeatures().catch(console.error);

