const sharp = require('sharp');
const fs = require('fs');

async function createPerfectComposite() {
  const img = sharp('public/projects/packaging/glow-bite-energy-bar.jpg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's create an SVG polygon mask covering exactly the object cluster:
  // We can combine an SVG path with blur/feather for anti-aliasing
  // Object boundaries from visual inspection:
  // - Top wrapper crimp: (632, 195) to (928, 155)
  // - Right wrapper edge: down to (1055, 875)
  // - Bottom crumbs & almonds: (1080, 890) -> (1180, 940) -> (780, 960) -> (450, 960) -> (250, 940) -> (230, 850)
  // - Left podium edge: (340, 750) -> (360, 650)
  // - Chocolate bars: (380, 580) -> (375, 420) -> (430, 375) -> (640, 375) -> connects to wrapper at (645, 360) -> up to (632, 195)
  
  // Notice that between the chocolate bars and the wrapper, there is no background - they touch!
  // Behind the wrapper and podium, there is no background - they touch!
  
  const svgMask = `
  <svg width="${width}" height="${height}" viewBox="0 0 1536 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="feather" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>
    <path d="
      M 632 192
      L 930 153
      L 1060 875
      Q 1120 900 1200 935
      Q 1220 965 1100 970
      L 450 975
      Q 250 975 230 940
      Q 220 880 260 850
      L 340 750
      L 360 630
      L 375 560
      L 370 415
      Q 375 372 430 372
      L 638 372
      L 632 192
      Z
    " fill="white" filter="url(#feather)" />
  </svg>
  `;

  // Render SVG mask to buffer
  const maskBuffer = await sharp(Buffer.from(svgMask))
    .raw()
    .toBuffer();

  // Now create composite onto forest background #101A12 (16, 26, 18)
  const bgR = 16, bgG = 26, bgB = 18;
  const compositeData = Buffer.alloc(width * height * 3);

  // Also extract cutout with RGBA
  const cutoutData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx3 = (y * width + x) * 3;
      const idx4 = (y * width + x) * 4;

      const r = data[idx3];
      const g = data[idx3 + 1];
      const b = data[idx3 + 2];

      // Alpha from mask (SVG rendered as RGBA, we take R channel)
      const alpha = maskBuffer[idx4] / 255;

      // Composite onto #101A12
      compositeData[idx3] = Math.round(r * alpha + bgR * (1 - alpha));
      compositeData[idx3 + 1] = Math.round(g * alpha + bgG * (1 - alpha));
      compositeData[idx3 + 2] = Math.round(b * alpha + bgB * (1 - alpha));

      // RGBA cutout
      cutoutData[idx4] = r;
      cutoutData[idx4 + 1] = g;
      cutoutData[idx4 + 2] = b;
      cutoutData[idx4 + 3] = maskBuffer[idx4];
    }
  }

  await sharp(compositeData, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 92 })
    .toFile('public/projects/packaging/test_clean_stage.jpg');

  await sharp(cutoutData, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/projects/packaging/test_clean_cutout.png');

  console.log('Clean stage and cutout created.');
}

createPerfectComposite();

