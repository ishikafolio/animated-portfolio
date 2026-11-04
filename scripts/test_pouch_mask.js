const sharp = require('sharp');

const svgMask = Buffer.from(`
<svg width="1000" height="1488" xmlns="http://www.w3.org/2000/svg">
  <path d="
    M 44 38
    C 46 29, 54 26, 68 25
    L 946 22
    C 960 23, 970 29, 972 38
    L 978 180
    C 976 260, 970 350, 963 460
    C 956 560, 950 660, 944 780
    C 939 890, 934 1000, 932 1120
    C 931 1220, 932 1300, 932 1370
    C 931 1395, 915 1425, 870 1442
    C 780 1461, 650 1470, 500 1470
    C 350 1470, 220 1461, 130 1442
    C 85 1425, 71 1395, 72 1370
    C 73 1300, 74 1220, 74 1120
    C 74 1000, 69 890, 64 780
    C 58 660, 52 560, 45 460
    C 38 350, 32 260, 30 180
    L 36 60
    C 38 48, 40 42, 44 38
    Z
  " fill="white" />
</svg>
`);

async function testMask() {
  const maskPng = await sharp(svgMask).png().toBuffer();

  await sharp('e:/animated-portfolio/public/projects/progelato/highres-pouch-crop.jpg')
    .ensureAlpha()
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png()
    .toFile('e:/animated-portfolio/public/projects/progelato/test-svg-pouch.png');

  // re-crop corners
  await sharp('e:/animated-portfolio/public/projects/progelato/test-svg-pouch.png')
    .extract({ left: 0, top: 0, width: 100, height: 100 })
    .toFile('e:/animated-portfolio/public/projects/progelato/corner-tl.png');
  await sharp('e:/animated-portfolio/public/projects/progelato/test-svg-pouch.png')
    .extract({ left: 900, top: 0, width: 100, height: 100 })
    .toFile('e:/animated-portfolio/public/projects/progelato/corner-tr.png');
  await sharp('e:/animated-portfolio/public/projects/progelato/test-svg-pouch.png')
    .extract({ left: 30, top: 1380, width: 100, height: 100 })
    .toFile('e:/animated-portfolio/public/projects/progelato/corner-bl.png');
  await sharp('e:/animated-portfolio/public/projects/progelato/test-svg-pouch.png')
    .extract({ left: 880, top: 1380, width: 100, height: 100 })
    .toFile('e:/animated-portfolio/public/projects/progelato/corner-br.png');

  console.log('Saved refined corners');
}
testMask();
