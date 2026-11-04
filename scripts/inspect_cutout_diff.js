const sharp = require('sharp');

async function main() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's inspect what the previous cutout (glow-bite-clean-cutout.png) looked like
  const prev = await sharp('public/projects/packaging/glow-bite-clean-cutout.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Let's find where prev alpha is > 0
  let pMinX = width, pMaxX = 0, pMinY = height, pMaxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = prev.data[(y * width + x) * 4 + 3];
      if (a > 30) {
        if (x < pMinX) pMinX = x;
        if (x > pMaxX) pMaxX = x;
        if (y < pMinY) pMinY = y;
        if (y > pMaxY) pMaxY = y;
      }
    }
  }
  console.log('Previous cutout bounding box:', { pMinX, pMaxX, pMinY, pMaxY });

  // Where is the wrapper in original?
  // Let's check y from 350 to 500 around x=400 to 700:
  // The wrapper is upright leaning, let's look at the colors
  for (let y = pMinY - 40; y <= pMinY + 60; y += 10) {
    let row = [];
    for (let x = 400; x <= 750; x += 30) {
      const i = (y * width + x) * 3;
      const alpha = prev.data[(y * width + x) * 4 + 3];
      row.push(`x=${x}: [${data[i]},${data[i+1]},${data[i+2]}] a=${alpha}`);
    }
    console.log(`y=${y}:`, row.slice(0, 4).join(' | '));
  }
}

main();

