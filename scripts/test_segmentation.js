const sharp = require('sharp');
const fs = require('fs');

async function testSegmentation() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's find the exact boundary of the wrapper around x=650-950, y=140-250
  // In this box, the wrapper is everything that is NOT the smooth studio wall.
  // The studio wall above y=160 at x=800 is around [235-245, 220-230, 200-210] with NO variance.
  // Let's compute local variance / gradient in a 5x5 window:
  const variance = Buffer.alloc(width * height);
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      let sum = 0, sumSq = 0, n = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 3;
          const lum = 0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2];
          sum += lum;
          sumSq += lum * lum;
          n++;
        }
      }
      const mean = sum / n;
      const v = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
      variance[y * width + x] = Math.min(255, Math.round(v * 4));
    }
  }

  // Print variance around the wrapper top edge (x=700-900, y=150-180):
  console.log('Local texture variance around wrapper top:');
  for (let y = 150; y <= 180; y += 3) {
    let row = [];
    for (let x = 750; x <= 880; x += 15) {
      row.push(`(${x}):v=${variance[y * width + x]}`);
    }
    console.log(`y=${y}: ${row.join(' ')}`);
  }
}

testSegmentation();

