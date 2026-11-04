const sharp = require('sharp');

async function findCutoutBounds() {
  const { data, info } = await sharp('e:/animated-portfolio/public/projects/packaging/aara-collection-cutout.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Aara cutout true pixel bounds:', { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });
}
findCutoutBounds();

