const sharp = require('sharp');
const path = require('path');

async function buildPackagingHero() {
  const width = 1920;
  const height = 1080;

  // 1. Base scene: Dual podium exhibition hall (1920 x 1000 with 80px dark top extension)
  // This pushes the podiums and floor down by 80px, creating generous daylight headroom for HTML text!
  const baseScene = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg')
    .resize(width, 1000, { fit: 'cover' })
    .extend({ top: 80, bottom: 0, background: { r: 5, g: 17, b: 10 } })
    .toBuffer();

  // 2. Prepare Mastana Mango (Secondary, recessed on left aubergine podium)
  const mangoPouch = await sharp('e:/animated-portfolio/public/projects/packaging/pouches/mastana-mango-pouch.png')
    .resize(222, 330)
    .modulate({ brightness: 0.93, saturation: 0.96 })
    .toBuffer();

  // 3. Prepare Blueberry Muffin (Lead product in front on left aubergine podium)
  const blueberryPouch = await sharp('e:/animated-portfolio/public/projects/packaging/pouches/blueberry-muffin-pouch.png')
    .resize(256, 380)
    .toBuffer();

  // 4. Prepare Aara Collection (Ivory carton, Forest carton, Olive tea tin on pale limestone)
  const aaraGroup = await sharp('e:/animated-portfolio/public/projects/packaging/aara-collection-clean.png')
    .resize(392, 345)
    .toBuffer();

  // 5. Contact shadows and deep upper dark atmospheric vignette
  const shadowSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blurSoft"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="blurTight"><feGaussianBlur stdDeviation="4" /></filter>
        <linearGradient id="topDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#05110A" stop-opacity="0.95" />
          <stop offset="35%" stop-color="#05110A" stop-opacity="0.6" />
          <stop offset="65%" stop-color="#05110A" stop-opacity="0.1" />
          <stop offset="80%" stop-color="#05110A" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Atmospheric top vignette to keep upper heading area dark, quiet and readable -->
      <rect x="0" y="0" width="${width}" height="550" fill="url(#topDark)" />

      <!-- Left Podium Shadows (Aubergine stone) -->
      <!-- Mango contact shadow (recessed, center ~ 605, y ~ 678) -->
      <ellipse cx="605" cy="678" rx="85" ry="14" fill="#150510" opacity="0.7" filter="url(#blurSoft)" />
      <ellipse cx="605" cy="676" rx="60" ry="7" fill="#080206" opacity="0.85" filter="url(#blurTight)" />

      <!-- Blueberry contact shadow (foreground, center ~ 705, y ~ 694) -->
      <ellipse cx="705" cy="694" rx="110" ry="18" fill="#150510" opacity="0.75" filter="url(#blurSoft)" />
      <ellipse cx="705" cy="692" rx="85" ry="8" fill="#080206" opacity="0.9" filter="url(#blurTight)" />

      <!-- Right Podium Shadows (Pale Limestone stone) -->
      <!-- Aara contact shadows -->
      <ellipse cx="1160" cy="678" rx="85" ry="12" fill="#3A3022" opacity="0.55" filter="url(#blurSoft)" />
      <ellipse cx="1160" cy="676" rx="60" ry="6" fill="#1B1610" opacity="0.75" filter="url(#blurTight)" />
      <ellipse cx="1315" cy="680" rx="85" ry="12" fill="#3A3022" opacity="0.55" filter="url(#blurSoft)" />
      <ellipse cx="1315" cy="678" rx="60" ry="6" fill="#1B1610" opacity="0.75" filter="url(#blurTight)" />
      <ellipse cx="1365" cy="696" rx="55" ry="10" fill="#3A3022" opacity="0.65" filter="url(#blurSoft)" />
      <ellipse cx="1365" cy="694" rx="40" ry="5" fill="#1B1610" opacity="0.85" filter="url(#blurTight)" />
    </svg>
  `);
  const shadowLayer = await sharp(shadowSvg).png().toBuffer();

  // 6. Composite products onto the podiums:
  // Mango: top = 348, left = 495
  // Blueberry: top = 314, left = 575
  // Aara: top = 351, left = 1040
  await sharp(baseScene)
    .composite([
      { input: shadowLayer, blend: 'over' },
      { input: mangoPouch, top: 348, left: 495, blend: 'over' },
      { input: blueberryPouch, top: 314, left: 575, blend: 'over' },
      { input: aaraGroup, top: 351, left: 1040, blend: 'over' }
    ])
    .webp({ quality: 95 })
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.webp');

  console.log('Saved refined packaging-podium-hero.webp');

  await sharp(baseScene)
    .composite([
      { input: shadowLayer, blend: 'over' },
      { input: mangoPouch, top: 348, left: 495, blend: 'over' },
      { input: blueberryPouch, top: 314, left: 575, blend: 'over' },
      { input: aaraGroup, top: 351, left: 1040, blend: 'over' }
    ])
    .png()
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.png');

  console.log('Saved refined packaging-podium-hero.png');
}

buildPackagingHero().catch(console.error);
