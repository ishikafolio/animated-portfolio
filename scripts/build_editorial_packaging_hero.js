const sharp = require('sharp');
const path = require('path');

async function buildEditorialHero() {
  // Base stage original is 1376 x 768
  // Let's frame tightly around the two podiums:
  // Podiums span x: 250 to 1030.
  // With comfortable breathing room: x from 120 to 1160 (width = 1040)
  // Height from y = 40 to 740 (height = 700)
  const extractBox = { left: 120, top: 40, width: 1040, height: 700 };
  const outWidth = 1600;
  const outHeight = 1050; // Aspect ratio ~ 16:10.5

  // 1. Base stage plate
  const basePlate = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg')
    .extract(extractBox)
    .resize(outWidth, outHeight, { fit: 'fill' })
    .toBuffer();

  // Scale factor from original crop to outWidth/outHeight:
  // scaleX = 1600 / 1040 = 1.5385
  // scaleY = 1050 / 700 = 1.500
  // Left podium in original:
  // Top front edge: x ~ 440, y ~ 440 -> in output: x ~ (440 - 120) * 1.5385 = 492, y ~ (440 - 40) * 1.5 = 600
  // Top back edge: x ~ 340, y ~ 430 -> in output: x ~ (340 - 120) * 1.5385 = 338, y ~ (430 - 40) * 1.5 = 585
  // Right podium in original:
  // Top center: x ~ 885, y ~ 430 -> in output: x ~ (885 - 120) * 1.5385 = 1177, y ~ (430 - 40) * 1.5 = 585

  // 2. Prepare Mastana Mango (Secondary, slightly recessed on left plum podium)
  // Original aspect ratio: 1000 x 1488 (0.672)
  // Height in out: 420px, Width: 282px
  const mangoPouch = await sharp('e:/animated-portfolio/public/projects/packaging/pouches/mastana-mango-pouch.png')
    .resize(282, 420)
    .modulate({ brightness: 0.94, saturation: 0.96 })
    .toBuffer();

  // 3. Prepare Blueberry Muffin (Lead hero product in front on left plum podium)
  // Height in out: 490px, Width: 329px
  // Strongest light and clearest silhouette
  const blueberryPouch = await sharp('e:/animated-portfolio/public/projects/packaging/pouches/blueberry-muffin-pouch.png')
    .resize(329, 490)
    .modulate({ brightness: 1.04, saturation: 1.02 })
    .toBuffer();

  // 4. Prepare Aara Collection (Ivory carton, Forest carton, Olive tea tin on limestone)
  // Aspect ratio is ~ 1.135
  // Width: 520px, Height: 458px
  const aaraGroup = await sharp('e:/animated-portfolio/public/projects/packaging/aara-collection-clean.png')
    .resize(520, 458)
    .modulate({ brightness: 1.02, contrast: 1.05 })
    .toBuffer();

  // 5. Believable Contact Shadows calibrated to the podium surfaces
  // Mango: bottom baseline y ~ 588, center x ~ 350
  // Blueberry: bottom baseline y ~ 618, center x ~ 530
  // Aara: bottom baseline y ~ 600, center x ~ 1180
  const shadowSvg = Buffer.from(`
    <svg width="${outWidth}" height="${outHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="softBlur"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="tightBlur"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="crispBlur"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>

      <!-- Mango Contact Shadows on Plum Podium -->
      <ellipse cx="360" cy="590" rx="110" ry="16" fill="#180414" opacity="0.75" filter="url(#softBlur)" />
      <ellipse cx="360" cy="588" rx="85" ry="8" fill="#0A0108" opacity="0.88" filter="url(#tightBlur)" />
      <ellipse cx="360" cy="587" rx="60" ry="4" fill="#000000" opacity="0.95" filter="url(#crispBlur)" />

      <!-- Blueberry Contact Shadows on Plum Podium (Foreground Lead) -->
      <ellipse cx="535" cy="620" rx="135" ry="22" fill="#180414" opacity="0.82" filter="url(#softBlur)" />
      <ellipse cx="535" cy="617" rx="105" ry="10" fill="#0A0108" opacity="0.92" filter="url(#tightBlur)" />
      <ellipse cx="535" cy="615" rx="75" ry="5" fill="#000000" opacity="0.98" filter="url(#crispBlur)" />

      <!-- Aara Contact Shadows on Limestone Podium -->
      <!-- Ivory carton shadow -->
      <ellipse cx="1060" cy="595" rx="90" ry="15" fill="#3D3220" opacity="0.65" filter="url(#softBlur)" />
      <ellipse cx="1060" cy="593" rx="70" ry="7" fill="#1C160C" opacity="0.85" filter="url(#tightBlur)" />
      <!-- Forest carton shadow -->
      <ellipse cx="1220" cy="595" rx="95" ry="15" fill="#3D3220" opacity="0.65" filter="url(#softBlur)" />
      <ellipse cx="1220" cy="593" rx="75" ry="7" fill="#1C160C" opacity="0.85" filter="url(#tightBlur)" />
      <!-- Olive tin shadow (in front) -->
      <ellipse cx="1295" cy="616" rx="75" ry="13" fill="#3D3220" opacity="0.75" filter="url(#softBlur)" />
      <ellipse cx="1295" cy="614" rx="55" ry="6" fill="#1C160C" opacity="0.92" filter="url(#tightBlur)" />
    </svg>
  `);
  const shadowLayer = await sharp(shadowSvg).png().toBuffer();

  // Composite the final scene:
  // Mango: left = 350 - 141 = 209, top = 588 - 420 = 168
  // Blueberry: left = 535 - 165 = 370, top = 618 - 490 = 128
  // Aara: left = 1180 - 260 = 920, top = 616 - 458 = 158
  const finalImage = await sharp(basePlate)
    .composite([
      { input: shadowLayer, blend: 'over' },
      { input: mangoPouch, left: 215, top: 168, blend: 'over' },
      { input: blueberryPouch, left: 375, top: 128, blend: 'over' },
      { input: aaraGroup, left: 925, top: 158, blend: 'over' }
    ]);

  await finalImage
    .clone()
    .webp({ quality: 95 })
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.webp');

  await finalImage
    .clone()
    .png()
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.png');

  console.log('Saved tightly framed editorial packaging-podium-hero.webp & .png');
}

buildEditorialHero().catch(console.error);

