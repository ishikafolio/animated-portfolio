const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function asciiMapAll() {
  const chars = ' .:-=+*#%@';

  async function printCrop(name, filePath, w_orig, h_orig, x_orig, y_orig) {
    const { data, info } = await sharp(filePath)
      .resize(40, 16)
      .raw()
      .toBuffer({ resolveWithObject: true });
    console.log(`\n--- ${name} (x: ${x_orig}-${x_orig+w_orig}, y: ${y_orig}-${y_orig+h_orig}) ---`);
    for (let y = 0; y < info.height; y++) {
      let line = '';
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        const lum = (0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 255;
        const charIdx = Math.min(chars.length - 1, Math.floor(lum * chars.length));
        line += chars[charIdx];
      }
      console.log(line);
    }
  }

  await printCrop('test_nose_lip', 'public/character/test_nose_lip.png', 120, 60, 450, 260);
  await printCrop('test_chin', 'public/character/test_chin.png', 120, 60, 460, 340);
}

asciiMapAll().catch(console.error);
