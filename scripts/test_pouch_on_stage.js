const sharp = require('sharp');
const path = require('path');

async function testPouchOnStage() {
  const stage = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/progelato_podium_stage_1793683454178.jpg')
    .resize(1200, 1500, { fit: 'cover' })
    .toBuffer();

  // Export the clean reusable stage backdrop without any pouch
  await sharp(stage)
    .webp({ quality: 95 })
    .toFile('e:/animated-portfolio/public/projects/packaging/progelato-podium-stage.webp');
  await sharp(stage)
    .png()
    .toFile('e:/animated-portfolio/public/projects/packaging/progelato-podium-stage.png');
  console.log('Saved progelato-podium-stage.webp & .png');

  // Now test placing a pouch onto it
  const pouchResized = await sharp('e:/animated-portfolio/public/projects/packaging/pouches/blueberry-muffin-pouch.png')
    .resize(650, 967)
    .toBuffer();

  const shadowSvg = Buffer.from(`
    <svg width="1200" height="1500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur1"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <ellipse cx="600" cy="1045" rx="240" ry="30" fill="black" opacity="0.6" filter="url(#blur1)" />
      <ellipse cx="600" cy="1042" rx="190" ry="14" fill="black" opacity="0.8" filter="url(#blur2)" />
    </svg>
  `);
  const shadowPng = await sharp(shadowSvg).png().toBuffer();

  await sharp(stage)
    .composite([
      { input: shadowPng, blend: 'over' },
      { input: pouchResized, top: 90, left: 275, blend: 'over' }
    ])
    .webp({ quality: 95 })
    .toFile('e:/animated-portfolio/public/projects/packaging/test-stage-with-pouch.webp');

  console.log('Saved test-stage-with-pouch.webp');
}
testPouchOnStage();

