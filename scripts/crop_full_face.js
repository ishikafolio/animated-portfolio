const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function drawBoundingBoxes() {
  const masterBuf = await sharp('public/character/ishika-cinematic-anime.png')
    .extract({ left: 350, top: 120, width: 380, height: 360 })
    .toBuffer();

  // Overlay an SVG with labeled boxes for:
  // - Eye Left (Character Right)
  // - Eye Right (Character Left)
  // - Brow Left
  // - Brow Right
  // - Mouth
  const svgOverlay = `
    <svg width="380" height="360" xmlns="http://www.w3.org/2000/svg">
      <!-- Relative to left: 350, top: 120 -->
      <!-- Eyebrow R (Viewer Left): x: 410-520, y: 135-185 -> Rel: 60, 15, 110, 50 -->
      <rect x="60" y="15" width="110" height="50" fill="none" stroke="#FF0055" stroke-width="2" />
      <text x="65" y="32" fill="#FF0055" font-size="12" font-family="sans-serif" font-weight="bold">Eyebrow_R</text>

      <!-- Eyebrow L (Viewer Right): x: 585-680, y: 205-260 -> Rel: 235, 85, 95, 55 -->
      <rect x="235" y="85" width="95" height="55" fill="none" stroke="#FF0055" stroke-width="2" />
      <text x="240" y="102" fill="#FF0055" font-size="12" font-family="sans-serif" font-weight="bold">Eyebrow_L</text>

      <!-- Eye R (Viewer Left): x: 420-525, y: 165-245 -> Rel: 70, 45, 105, 80 -->
      <rect x="70" y="45" width="105" height="80" fill="none" stroke="#00FFCC" stroke-width="2" />
      <text x="75" y="62" fill="#00FFCC" font-size="12" font-family="sans-serif" font-weight="bold">Eye_R</text>

      <!-- Eye L (Viewer Right): x: 570-670, y: 230-315 -> Rel: 220, 110, 100, 85 -->
      <rect x="220" y="110" width="100" height="85" fill="none" stroke="#00FFCC" stroke-width="2" />
      <text x="225" y="127" fill="#00FFCC" font-size="12" font-family="sans-serif" font-weight="bold">Eye_L</text>

      <!-- Mouth: x: 470-565, y: 295-355 -> Rel: 120, 175, 95, 60 -->
      <rect x="120" y="175" width="95" height="60" fill="none" stroke="#FFFF00" stroke-width="2" />
      <text x="125" y="192" fill="#FFFF00" font-size="12" font-family="sans-serif" font-weight="bold">Mouth</text>
    </svg>
  `;

  await sharp(masterBuf)
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .png()
    .toFile('public/character/debug_face_features_labeled.png');

  console.log('Saved debug_face_features_labeled.png');
}

drawBoundingBoxes().catch(console.error);

