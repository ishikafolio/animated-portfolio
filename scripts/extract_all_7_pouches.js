const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = 'e:/animated-portfolio/public/projects/packaging/pouches';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

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

const flavours = [
  { id: 'blueberry-muffin', file: 'blueberry-muffin-mockup.png' },
  { id: 'butterly-crunch', file: 'butterly-crunch-mockup.png' },
  { id: 'chocolicious', file: 'chocolicious-mockup.png' },
  { id: 'cookieej-n-cream', file: 'cookieej-n-cream-mockup.png' },
  { id: 'creamy-strawberry', file: 'creamy-strawberry-mockup.png' },
  { id: 'mastana-mango', file: 'mastana-mango-mockup.png' },
  { id: 'shahi-zaffran-pista', file: 'shahi-zaffran-pista-mockup.png' }
];

async function extractAll() {
  const maskPng = await sharp(svgMask).png().toBuffer();
  console.log('Mask rendered');

  for (const f of flavours) {
    const srcPath = path.join('e:/animated-portfolio/public/projects/progelato', f.file);
    const destWebp = path.join(targetDir, `${f.id}-pouch.webp`);
    const destPng = path.join(targetDir, `${f.id}-pouch.png`);

    console.log(`Extracting ${f.id}...`);

    const cropLeft = 5650;
    const cropTop = 90;
    const cropWidth = 2150;
    const cropHeight = 3200;

    const baseCrop = await sharp(srcPath)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .resize(1000, 1488)
      .ensureAlpha()
      .composite([{ input: maskPng, blend: 'dest-in' }])
      .toBuffer();

    // Export high-res webp
    await sharp(baseCrop)
      .webp({ quality: 95, effort: 6 })
      .toFile(destWebp);

    // Also export png
    await sharp(baseCrop)
      .png({ compressionLevel: 8 })
      .toFile(destPng);

    console.log(`-> Saved ${f.id}-pouch.webp and .png`);
  }
  console.log('All 7 transparent pouches extracted successfully!');
}

extractAll();

