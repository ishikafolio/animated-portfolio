const sharp = require('sharp');

async function main() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const sample = (x, y) => {
    const i = (y * width + x) * 3;
    return [data[i], data[i+1], data[i+2]];
  };

  // The background is a studio wall with a floor.
  // Let's trace the boundary from the top, left, right, bottom.
  // Notice the background is smooth gradient.
  // The objects have high contrast edges, textures, shadows.
  console.log('Sampling background along y=100 from left to right:');
  for (let x = 100; x < width; x += 200) {
    console.log(`x=${x}, y=100: [${sample(x, 100).join(',')}]`);
  }
  console.log('\nSampling background along y=500 from left to right (outside objects):');
  console.log(`x=100, y=500: [${sample(100, 500).join(',')}]`);
  console.log(`x=250, y=500: [${sample(250, 500).join(',')}]`);
  console.log(`x=1200, y=500: [${sample(1200, 500).join(',')}]`);
  console.log(`x=1400, y=500: [${sample(1400, 500).join(',')}]`);

  console.log('\nSampling background along y=800 outside objects:');
  console.log(`x=100, y=800: [${sample(100, 800).join(',')}]`);
  console.log(`x=200, y=800: [${sample(200, 800).join(',')}]`);
  console.log(`x=1200, y=800: [${sample(1200, 800).join(',')}]`);
  console.log(`x=1400, y=800: [${sample(1400, 800).join(',')}]`);
}

main();

