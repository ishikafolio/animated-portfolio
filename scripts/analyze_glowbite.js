const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const image = sharp('e:/animated-portfolio/public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  console.log('Image dimensions:', info.width, 'x', info.height);

  // Sample grid of background
  // The podium and bar are in the center/lower-center
  // Let's create an alpha mask or seamless forest/charcoal vignette blend
}
main();

