const sharp = require('sharp');

async function main() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's find bright white / cream regions that might be the wrapper
  // The wrapper has yellow/blue colors, let's find blue ("glow bite" text is blue, yellow accents)
  console.log('Finding blue pixels (GlowBite logo is blue):');
  let blueCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const r = data[i], g = data[i+1], b = data[i+2];
      // blue pixel: b > r + 30 and b > g + 20 and b > 100
      if (b > r + 30 && b > g + 15 && b > 80) {
        blueCount++;
        if (blueCount % 500 === 1) {
          console.log(`Blue at (${x}, ${y}): [${r}, ${g}, ${b}]`);
        }
      }
    }
  }

  // Also yellow pixels:
  console.log('\nFinding yellow pixels:');
  let yellowCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 200 && g > 160 && b < 80) {
        yellowCount++;
        if (yellowCount % 500 === 1) {
          console.log(`Yellow at (${x}, ${y}): [${r}, ${g}, ${b}]`);
        }
      }
    }
  }

  // Dark chocolate pixels:
  console.log('\nFinding dark chocolate pixels:');
  let chocoCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r < 70 && g < 45 && b < 35) {
        chocoCount++;
        if (chocoCount % 1000 === 1) {
          console.log(`Chocolate at (${x}, ${y}): [${r}, ${g}, ${b}]`);
        }
      }
    }
  }
}

main();

