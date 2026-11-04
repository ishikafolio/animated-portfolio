const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function main() {
  console.log('=== Building Final Character Visual Presentation Artifacts ===');

  // Eye crop window in 2880x1800 screenshot:
  // Face / Eyes centered around left: 1780, top: 430, width: 440, height: 280
  const eyeCropConfig = { left: 1780, top: 430, width: 440, height: 280 };

  const eyePanels = [
    { title: "GAZE LEFT", file: "rec-02-sweep-left.png", note: "Pupil X: -13.0px · Sclera Mask Clamped" },
    { title: "GAZE UP", file: "rec-04-sweep-up.png", note: "Pupil Y: -8.5px · Eyebrows Lift +3.5px" },
    { title: "NEUTRAL FORWARD", file: "rec-01-neutral.png", note: "Resting Center · Direct Eye Contact" },
    { title: "GAZE DOWN", file: "rec-05-sweep-down.png", note: "Pupil Y: +8.5px · Subtle Chin Pitch" },
    { title: "GAZE RIGHT", file: "rec-03-sweep-right.png", note: "Pupil X: +13.0px · Foreshortened Angle" },
    { title: "DIAGONAL TOP-LEFT", file: "rec-06-diagonal-topleft.png", note: "Combined Vector X/Y Clamping" },
  ];

  const croppedEyeBuffers = [];
  for (const p of eyePanels) {
    const filePath = path.join(ARTIFACT_DIR, p.file);
    const buf = await sharp(filePath)
      .extract(eyeCropConfig)
      .resize(360, 230)
      .toBuffer();
    croppedEyeBuffers.push(buf);
  }

  // 1. Build Eye Tracking Matrix (3x2 Grid)
  // Width: 1200, Height: 650
  const matrixSvg = `
    <svg width="1200" height="650" xmlns="http://www.w3.org/2000/svg" style="background:#14080F;font-family:sans-serif;">
      <!-- Title Header -->
      <rect x="0" y="0" width="1200" height="70" fill="#24121B" />
      <text x="35" y="32" font-size="20" fill="#F3F3E7" font-weight="bold">ISHIKA SHRIVASTAV — FINAL POLISHED 2.5D GAZE TRACKING MATRIX</text>
      <text x="35" y="52" font-size="12" fill="#890149" font-weight="600">Sclera Stencil Clamping · Natural Perspective · Rock-Solid Stationary Gaze · High-DPI WebGL</text>

      <!-- Row 1: Left, Up, Neutral -->
      <!-- Panel 1: Left -->
      <rect x="30" y="85" width="370" height="260" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="45" y="112" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[0].title}</text>
      <text x="45" y="128" font-size="11" fill="#FFFFFF80">${eyePanels[0].note}</text>

      <!-- Panel 2: Up -->
      <rect x="415" y="85" width="370" height="260" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="430" y="112" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[1].title}</text>
      <text x="430" y="128" font-size="11" fill="#FFFFFF80">${eyePanels[1].note}</text>

      <!-- Panel 3: Neutral -->
      <rect x="800" y="85" width="370" height="260" rx="10" fill="#1C0D15" stroke="#890149" stroke-width="2" />
      <text x="815" y="112" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[2].title}</text>
      <text x="815" y="128" font-size="11" fill="#890149" font-weight="bold">${eyePanels[2].note}</text>

      <!-- Row 2: Down, Right, Diagonal -->
      <!-- Panel 4: Down -->
      <rect x="30" y="360" width="370" height="260" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="45" y="387" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[3].title}</text>
      <text x="45" y="403" font-size="11" fill="#FFFFFF80">${eyePanels[3].note}</text>

      <!-- Panel 5: Right -->
      <rect x="415" y="360" width="370" height="260" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="430" y="387" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[4].title}</text>
      <text x="430" y="403" font-size="11" fill="#FFFFFF80">${eyePanels[4].note}</text>

      <!-- Panel 6: Diagonal -->
      <rect x="800" y="360" width="370" height="260" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="815" y="387" font-size="13" fill="#F3F3E7" font-weight="bold">${eyePanels[5].title}</text>
      <text x="815" y="403" font-size="11" fill="#FFFFFF80">${eyePanels[5].note}</text>
    </svg>
  `;

  const matrixOutPath = path.join(ARTIFACT_DIR, "final-character-eye-tracking-matrix.png");
  await sharp(Buffer.from(matrixSvg))
    .composite([
      { input: croppedEyeBuffers[0], top: 140, left: 35 },
      { input: croppedEyeBuffers[1], top: 140, left: 420 },
      { input: croppedEyeBuffers[2], top: 140, left: 805 },
      { input: croppedEyeBuffers[3], top: 415, left: 35 },
      { input: croppedEyeBuffers[4], top: 415, left: 420 },
      { input: croppedEyeBuffers[5], top: 415, left: 805 },
    ])
    .png()
    .toFile(matrixOutPath);
  console.log(`Saved eye tracking matrix: ${matrixOutPath}`);

  // 2. Build Before-and-After Comparison Sheet
  const beforeHeroBuf = await sharp(path.join(ARTIFACT_DIR, 'webgl-track-08-specs-modal.png'))
    .resize(560, 350)
    .toBuffer();

  const afterHeroBuf = await sharp(path.join(ARTIFACT_DIR, 'rec-01-neutral.png'))
    .resize(560, 350)
    .toBuffer();

  const beforeAfterSvg = `
    <svg width="1200" height="520" xmlns="http://www.w3.org/2000/svg" style="background:#14080F;font-family:sans-serif;">
      <!-- Title -->
      <rect x="0" y="0" width="1200" height="65" fill="#24121B" />
      <text x="35" y="30" font-size="18" fill="#F3F3E7" font-weight="bold">HERO PRESENTATION &amp; BEHAVIOR: BEFORE VS. AFTER REFINEMENT</text>
      <text x="35" y="48" font-size="12" fill="#890149" font-weight="600">Clean Editorial Portfolio Presentation · Elimination of Autonomous Wandering · Restrained Head Physics</text>

      <!-- Panel Left: Before -->
      <rect x="30" y="80" width="560" height="415" rx="12" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="45" y="108" font-size="14" fill="#FF5577" font-weight="bold">BEFORE: TECHNICAL PROTOTYPE STATE</text>
      <text x="45" y="126" font-size="11" fill="#FFFFFF80">• Visible diagnostic badge &amp; modal drawer on public hero UI</text>
      <text x="45" y="142" font-size="11" fill="#FFFFFF80">• Random saccade wandering started when cursor was stationary</text>
      <text x="45" y="158" font-size="11" fill="#FFFFFF80">• Slightly exaggerated head follow causing minor disalignment</text>

      <!-- Panel Right: After -->
      <rect x="610" y="80" width="560" height="415" rx="12" fill="#1C0D15" stroke="#890149" stroke-width="2" />
      <text x="625" y="108" font-size="14" fill="#F3F3E7" font-weight="bold">AFTER: POLISHED PREMIUM EDITORIAL FINALE</text>
      <text x="625" y="126" font-size="11" fill="#890149" font-weight="bold">✓ 100% clean public UI (zero intrusive badges, pure editorial design)</text>
      <text x="625" y="142" font-size="11" fill="#FFFFFFCC">✓ Rock-solid gaze hold: cursor stops -> character maintains fixed eye contact</text>
      <text x="625" y="158" font-size="11" fill="#FFFFFFCC">✓ Smooth natural head lag (500ms), subdued breathing, organic dual-flap blinking</text>
    </svg>
  `;

  const beforeAfterPath = path.join(ARTIFACT_DIR, "final-character-before-after.png");
  await sharp(Buffer.from(beforeAfterSvg))
    .composite([
      { input: beforeHeroBuf, top: 180, left: 30 },
      { input: afterHeroBuf, top: 180, left: 610 },
    ])
    .png()
    .toFile(beforeAfterPath);
  console.log(`Saved before/after comparison: ${beforeAfterPath}`);

  // Copy both artifacts to public folder for direct browser referencing
  fs.copyFileSync(matrixOutPath, "e:/animated-portfolio/public/character/final-character-eye-tracking-matrix.png");
  fs.copyFileSync(beforeAfterPath, "e:/animated-portfolio/public/character/final-character-before-after.png");
  console.log('Copied all presentation artifacts to public/character/');
}

main().catch(console.error);

