const sharp = require('sharp');

async function findBlockTops() {
  const { data } = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg')
    .resize(1920, 1080)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // For left block:
  // Find where y = 550 to 650 has the aubergine top surface (lightness > 100, warm tone)
  let minLx = 1920, maxLx = 0, minLy = 1080, maxLy = 0;
  for (let y = 550; y < 700; y++) {
    for (let x = 350; x < 950; x++) {
      const idx = (y * 1920 + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Top surface of aubergine block is warm highlight: r > 120, g > 100, b > 100
      if (r > 120 && g > 100 && b > 100) {
        if (x < minLx) minLx = x;
        if (x > maxLx) maxLx = x;
        if (y < minLy) minLy = y;
        if (y > maxLy) maxLy = y;
      }
    }
  }
  console.log('Left block top surface bounds:', { minLx, maxLx, minLy, maxLy, width: maxLx - minLx, height: maxLy - minLy });

  // For right block:
  // Top surface is pale limestone (r > 210, g > 200, b > 180)
  let minRx = 1920, maxRx = 0, minRy = 1080, maxRy = 0;
  for (let y = 550; y < 700; y++) {
    for (let x = 950; x < 1550; x++) {
      const idx = (y * 1920 + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 210 && g > 200 && b > 180) {
        if (x < minRx) minRx = x;
        if (x > maxRx) maxRx = x;
        if (y < minRy) minRy = y;
        if (y > maxRy) maxRy = y;
      }
    }
  }
  console.log('Right block top surface bounds:', { minRx, maxRx, minRy, maxRy, width: maxRx - minRx, height: maxRy - minRy });
}
findBlockTops();

