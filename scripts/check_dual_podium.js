const sharp = require('sharp');

async function inspectPodiumCoordinates() {
  const { data, info } = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg')
    .resize(1920, 1080)
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('--- Left Podium Center (x=680) ---');
  for (let y = 560; y <= 660; y += 10) {
    const idx = (y * 1920 + 680) * 3;
    console.log('y=' + y + ' RGB:', [data[idx], data[idx+1], data[idx+2]]);
  }

  console.log('--- Right Podium Center (x=1250) ---');
  for (let y = 560; y <= 660; y += 10) {
    const idx = (y * 1920 + 1250) * 3;
    console.log('y=' + y + ' RGB:', [data[idx], data[idx+1], data[idx+2]]);
  }
}
inspectPodiumCoordinates();
