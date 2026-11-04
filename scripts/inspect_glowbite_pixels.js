const sharp = require('sharp');

async function main() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const sample = (x, y) => {
    const i = (y * width + x) * 3;
    return [data[i], data[i+1], data[i+2]];
  };

  console.log('Top-left (10, 10):', sample(10, 10));
  console.log('Top-right (1500, 10):', sample(1500, 10));
  console.log('Bottom-left (10, 1000):', sample(10, 1000));
  console.log('Bottom-right (1500, 1000):', sample(1500, 1000));
  console.log('Top center (768, 10):', sample(768, 10));

  // Let's find bounding box of non-background content:
  // Background at corners is around [237, 222, 198]
  console.log('\nScanning horizontal lines to locate wrapper and chocolate stack:');
  for (let y = 100; y < 1000; y += 50) {
    let minX = -1, maxX = -1;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = sample(x, y);
      // Background is warm beige: r ~ 220-250, g ~ 205-240, b ~ 180-220, r > g > b, |r-235| < 25, |g-218| < 25, |b-198| < 25
      const isBg = Math.abs(r - 236) < 22 && Math.abs(g - 220) < 22 && Math.abs(b - 200) < 25;
      if (!isBg) {
        if (minX === -1) minX = x;
        maxX = x;
      }
    }
    if (minX !== -1) {
      console.log(`y=${y}: content from x=${minX} to x=${maxX}`);
    }
  }
}

main();

