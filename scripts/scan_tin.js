const sharp = require('sharp');

async function scanTinContour() {
  const { data, info } = await sharp('e:/animated-portfolio/public/projects/aara/test-aara-900.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('--- Scanning Tea Tin Right Edge ---');
  for (let y = 550; y <= 720; y += 15) {
    let rx = -1;
    // scan leftwards from x = 860 to 750
    for (let x = 860; x >= 750; x--) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Compare with table shadow at x=880
      const sIdx = (y * info.width + 880) * info.channels;
      if (Math.hypot(r - data[sIdx], g - data[sIdx+1], b - data[sIdx+2]) > 18) {
        rx = x;
        break;
      }
    }
    console.log('y=' + y + ': rx=' + rx);
  }
}
scanTinContour();

