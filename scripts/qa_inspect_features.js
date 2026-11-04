const sharp = require('e:/animated-portfolio/node_modules/sharp');
const fs = require('fs');
const path = require('path');

async function inspect() {
  const meta = await sharp('public/character/ishika-cinematic-anime.png').metadata();
  console.log('Master dimensions:', meta.width, 'x', meta.height, 'format:', meta.format, 'channels:', meta.channels, 'space:', meta.space);

  // Let's inspect the mouth region more closely
  // Mouth center roughly around x: 505, y: 350
  const mouthCrop = await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 450, top: 320, width: 140, height: 100 })
    .toFile('public/character/debug_mouth_zoom.png');
  console.log('Extracted debug_mouth_zoom.png');

  // Let's inspect the two eyebrows:
  // Right eyebrow (viewer's left): around x: 420-510, y: 140-190
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 410, top: 135, width: 110, height: 60 })
    .toFile('public/character/debug_eyebrow_right.png');
  console.log('Extracted debug_eyebrow_right.png (viewer left)');

  // Left eyebrow (viewer's right): around x: 590-675, y: 200-260
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 585, top: 205, width: 105, height: 60 })
    .toFile('public/character/debug_eyebrow_left.png');
  console.log('Extracted debug_eyebrow_left.png (viewer right)');

  // Let's inspect neck and chin:
  await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 430, top: 370, width: 220, height: 160 })
    .toFile('public/character/debug_neck_chin.png');
  console.log('Extracted debug_neck_chin.png');
}

inspect().catch(console.error);

