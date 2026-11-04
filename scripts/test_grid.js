const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function testGrid() {
  // Let's extract 4 vertical stripes between y=260 and y=420 around x=450-570
  // 1. y: 260-310 (below nose / upper lip)
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 450, top: 260, width: 120, height: 60 })
    .toFile('public/character/test_nose_lip.png');

  // 2. y: 300-350 (smile / mouth area)
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 460, top: 300, width: 120, height: 60 })
    .toFile('public/character/test_mouth_smile.png');

  // 3. y: 340-390 (chin)
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 460, top: 340, width: 120, height: 60 })
    .toFile('public/character/test_chin.png');

  console.log('Saved test crops');
}

testGrid().catch(console.error);

