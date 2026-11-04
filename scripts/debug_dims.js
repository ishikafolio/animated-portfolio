const sharp = require('sharp');

async function debugDims() {
  const svgMask = Buffer.from(`
<svg width="900" height="755" viewBox="0 0 900 755" xmlns="http://www.w3.org/2000/svg">
  <path d="M 0 0 L 100 100 Z" fill="white" />
</svg>
`);
  const mask = await sharp(svgMask).png().toBuffer();
  const maskMeta = await sharp(mask).metadata();
  console.log('maskMeta:', maskMeta.width, maskMeta.height);
  const imgMeta = await sharp('e:/animated-portfolio/public/projects/aara/test-aara-900.jpg').metadata();
  console.log('imgMeta:', imgMeta.width, imgMeta.height);
}
debugDims();

