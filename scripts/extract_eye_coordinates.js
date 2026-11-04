const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function findEyes() {
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 300, top: 100, width: 460, height: 380 })
    .toFile('public/character/debug_eyes_full.png');

  console.log('Saved debug_eyes_full.png at left: 300, top: 100, width: 460, height: 380');
}

findEyes().catch(console.error);
