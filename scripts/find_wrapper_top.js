const sharp = require('sharp');

async function main() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const sample = (x, y) => {
    const i = (y * width + x) * 3;
    return [data[i], data[i+1], data[i+2]];
  };

  // Inspect the top serrated seal of the wrapper:
  const prev = await sharp('public/projects/packaging/glow-bite-clean-cutout.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('Inspecting alpha of previous cutout at wrapper top:');
  for (let y = 165; y <= 210; y += 5) {
    let row = [];
    for (let x = 800; x <= 880; x += 10) {
      const a = prev.data[(y * width + x) * 4 + 3];
      row.push(`(${x}):a=${a}`);
    }
    console.log(`y=${y}: ${row.join(' ')}`);
  }
}

main();
