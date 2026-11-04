const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function extractPreciseMouth() {
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 470, top: 280, width: 90, height: 60 })
    .toFile('public/character/crop_mouth_precise.png');
  console.log('Saved crop_mouth_precise.png (left: 470, top: 280, width: 90, height: 60)');
}

extractPreciseMouth().catch(console.error);

