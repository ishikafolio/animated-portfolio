const sharp = require('sharp');

// Refined Aara collection mask:
// - Left: x = 24 (cleans off the extraneous leaf on the left)
// - Right: Tea tin right edge is at x = 826, curving down to base at y = 735, x = 730
const svgMask = Buffer.from(`
<svg width="900" height="755" xmlns="http://www.w3.org/2000/svg">
  <path d="
    M 24 695
    L 24 72
    L 297 43
    L 390 62
    L 390 18
    L 766 8
    L 818 22
    L 818 545
    C 822 550, 826 558, 826 565
    L 826 718
    C 826 734, 785 740, 730 740
    C 675 740, 615 734, 615 718
    L 615 680
    L 390 680
    L 24 695
    Z
  " fill="white" />
</svg>
`);

async function testCleanAara() {
  const maskPng = await sharp(svgMask).png().toBuffer();

  const masked = await sharp('e:/animated-portfolio/public/projects/aara/test-aara-900.jpg')
    .ensureAlpha()
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const cropped = await sharp(masked)
    .extract({ left: 22, top: 6, width: 808, height: 736 })
    .toBuffer();

  await sharp(cropped).toFile('e:/animated-portfolio/public/projects/packaging/aara-collection-clean.png');
  await sharp(cropped).webp({ quality: 95 }).toFile('e:/animated-portfolio/public/projects/packaging/aara-collection-clean.webp');
  console.log('Saved perfect aara-collection-clean.webp & .png');
}
testCleanAara();
