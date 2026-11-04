const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function checkPreciseMouth() {
  const { data, info } = await sharp('public/character/crop_mouth_precise.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  console.log(`Precise mouth crop ${w}x${h} (x: 470, y: 280):`);

  // Print a small grid of the center
  for (let y = 10; y < h - 10; y += 2) {
    let row = '';
    for (let x = 10; x < w - 10; x += 2) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      // If it's the dark lip crease
      if (lum < 110) row += '##';
      // If it's teeth/white
      else if (r > 230 && g > 210 && b > 200) row += 'WW';
      // If it's pink/red lip
      else if (r > 180 && r > g * 1.2) row += 'LL';
      // Skin
      else row += '..';
    }
    console.log(`y=${280+y}: ${row}`);
  }
}

checkPreciseMouth().catch(console.error);

