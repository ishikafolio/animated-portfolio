const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const FILMSTRIP_OUT = path.join(ARTIFACT_DIR, "option-a-webgl-gaze-filmstrip.png");

async function createFilmstrip() {
  console.log('=== Building Option A WebGL Gaze Filmstrip ===');

  // Eye crop window in 2880x1800 screenshot:
  // Face center around x: 2000, y: 550
  const cropConfig = { left: 1750, top: 400, width: 500, height: 350 };

  const states = [
    { label: "1. GAZE FAR LEFT", file: "webgl-track-02-left.png", sub: "GazeX: -1.0 · Head Yaw: -7.5px" },
    { label: "2. GAZE HIGH UP", file: "webgl-track-04-up.png", sub: "GazeY: -1.0 · Eyebrow Lift: +5.0px" },
    { label: "3. NEUTRAL FORWARD", file: "webgl-track-01-neutral.png", sub: "Gaze: (0, 0) · Resting Center" },
    { label: "4. GAZE LOW DOWN", file: "webgl-track-05-down.png", sub: "GazeY: +1.0 · Head Pitch: +5.0px" },
    { label: "5. GAZE FAR RIGHT", file: "webgl-track-03-right.png", sub: "GazeX: +1.0 · Head Yaw: +7.5px" },
  ];

  const croppedBuffers = [];
  for (const s of states) {
    const filePath = path.join(ARTIFACT_DIR, s.file);
    const buf = await sharp(filePath)
      .extract(cropConfig)
      .resize(240, 168)
      .toBuffer();
    croppedBuffers.push(buf);
  }

  // Create composite SVG canvas
  // Width: 1280, Height: 320
  const svg = `
    <svg width="1280" height="320" xmlns="http://www.w3.org/2000/svg" style="background:#14080F;font-family:sans-serif;">
      <!-- Header -->
      <rect x="0" y="0" width="1280" height="65" fill="#24121B" />
      <text x="35" y="30" font-size="18" fill="#F3F3E7" font-weight="bold">OPTION A: INTERACTIVE WEBGL / CANVAS 2.5D CHARACTER GAZE FILMSTRIP</text>
      <text x="35" y="50" font-size="12" fill="#890149" font-weight="600">60 FPS Real-Time Pointer Tracking · Sclera-Masked Cornea · Spring-Damper Physics · Zero Prerecorded Loops</text>

      <!-- Panel Backgrounds -->
      <rect x="30" y="80" width="230" height="220" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="45" y="105" font-size="12" fill="#F3F3E7" font-weight="bold">${states[0].label}</text>
      <text x="45" y="122" font-size="10" fill="#FFFFFF80">${states[0].sub}</text>

      <rect x="280" y="80" width="230" height="220" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="295" y="105" font-size="12" fill="#F3F3E7" font-weight="bold">${states[1].label}</text>
      <text x="295" y="122" font-size="10" fill="#FFFFFF80">${states[1].sub}</text>

      <rect x="530" y="80" width="230" height="220" rx="10" fill="#1C0D15" stroke="#890149" stroke-width="2" />
      <text x="545" y="105" font-size="12" fill="#F3F3E7" font-weight="bold">${states[2].label}</text>
      <text x="545" y="122" font-size="10" fill="#890149" font-weight="bold">${states[2].sub}</text>

      <rect x="780" y="80" width="230" height="220" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="795" y="105" font-size="12" fill="#F3F3E7" font-weight="bold">${states[3].label}</text>
      <text x="795" y="122" font-size="10" fill="#FFFFFF80">${states[3].sub}</text>

      <rect x="1030" y="80" width="220" height="220" rx="10" fill="#1C0D15" stroke="#FFFFFF20" stroke-width="1.5" />
      <text x="1045" y="105" font-size="12" fill="#F3F3E7" font-weight="bold">${states[4].label}</text>
      <text x="1045" y="122" font-size="10" fill="#FFFFFF80">${states[4].sub}</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .composite([
      { input: croppedBuffers[0], top: 135, left: 35 },
      { input: croppedBuffers[1], top: 135, left: 285 },
      { input: croppedBuffers[2], top: 135, left: 535 },
      { input: croppedBuffers[3], top: 135, left: 785 },
      { input: croppedBuffers[4], top: 135, left: 1035 },
    ])
    .png()
    .toFile(FILMSTRIP_OUT);

  console.log(`Saved filmstrip: ${FILMSTRIP_OUT}`);
}

createFilmstrip().catch(console.error);

