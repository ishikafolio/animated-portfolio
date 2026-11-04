const sharp = require('e:/animated-portfolio/node_modules/sharp');
const { writePsd, readPsd } = require('ag-psd');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'public/character/live2d_layers';
const PSD_PATH = 'public/character/Ishika_Live2D_Rigged_Source.psd';
const MASTER_IMAGE = 'public/character/ishika-cinematic-anime.png';

async function main() {
  console.log('=== Building Improved Production Live2D Rig (v2 Quality Assurance) ===');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const masterMeta = await sharp(MASTER_IMAGE).metadata();
  const W = masterMeta.width; // 1024
  const H = masterMeta.height; // 1536
  console.log(`Master Canvas: ${W}x${H}`);

  const masterRaw = await sharp(MASTER_IMAGE).raw().toBuffer({ resolveWithObject: true });
  const rawData = masterRaw.data;

  function createBlankCanvas() {
    return Buffer.alloc(W * H * 4);
  }

  function getPixel(x, y) {
    if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0, 0];
    const idx = (y * W + x) * 4;
    return [rawData[idx], rawData[idx + 1], rawData[idx + 2], rawData[idx + 3]];
  }

  function copyPixel(target, x, y, opacity = 1.0) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = (y * W + x) * 4;
    target[idx] = rawData[idx];
    target[idx + 1] = rawData[idx + 1];
    target[idx + 2] = rawData[idx + 2];
    target[idx + 3] = Math.round(rawData[idx + 3] * opacity);
  }

  function setPixel(target, x, y, r, g, b, a) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = (y * W + x) * 4;
    target[idx] = r;
    target[idx + 1] = g;
    target[idx + 2] = b;
    target[idx + 3] = a;
  }

  // Smooth anti-aliased ellipse distance metric (returns 0 outside, 1 inside, smooth gradient on boundary)
  function smoothEllipse(px, py, cx, cy, rx, ry, angleDeg = 0, featherPx = 2.0) {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = px - cx;
    const dy = py - cy;
    const xRot = cos * dx + sin * dy;
    const yRot = -sin * dx + cos * dy;
    const normDist = Math.sqrt((xRot * xRot) / (rx * rx) + (yRot * yRot) / (ry * ry));
    if (normDist >= 1.0 + (featherPx / Math.min(rx, ry))) return 0;
    if (normDist <= 1.0 - (featherPx / Math.min(rx, ry))) return 1;
    const t = (normDist - (1.0 - featherPx / Math.min(rx, ry))) / ((2 * featherPx) / Math.min(rx, ry));
    return 0.5 * (1 + Math.cos(Math.PI * Math.max(0, Math.min(1, t))));
  }

  // -------------------------------------------------------------
  // 1. INPAINTED SCLERA (Generous coverage for extreme gaze)
  // -------------------------------------------------------------
  console.log('1. Generating Smooth Inpainted Sclera (Expanded for Extreme Eye Movement)...');
  // Right Eye (Viewer's Left): Center ~ 472, 206, rx: 46, ry: 32, angle: 6 deg
  const scleraRBuf = createBlankCanvas();
  for (let y = 155; y <= 255; y++) {
    for (let x = 415; x <= 530; x++) {
      const alpha = smoothEllipse(x, y, 472, 206, 46, 32, 6, 2.5);
      if (alpha > 0) {
        // Natural eye white gradient (soft upper shadow from eyelid crease)
        const shadow = Math.max(0, Math.min(1, (y - 175) / 40));
        const r = Math.round((215 + 35 * shadow) * 0.98);
        const g = Math.round((205 + 40 * shadow) * 0.98);
        const b = Math.round((200 + 45 * shadow) * 0.98);
        setPixel(scleraRBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(scleraRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '04_Eye_R_Sclera_Inpainted.png'));

  // Left Eye (Viewer's Right): Center ~ 620, 275, rx: 44, ry: 30, angle: -4 deg
  const scleraLBuf = createBlankCanvas();
  for (let y = 225; y <= 325; y++) {
    for (let x = 565; x <= 675; x++) {
      const alpha = smoothEllipse(x, y, 620, 275, 44, 30, -4, 2.5);
      if (alpha > 0) {
        const shadow = Math.max(0, Math.min(1, (y - 245) / 40));
        const r = Math.round((215 + 35 * shadow) * 0.98);
        const g = Math.round((205 + 40 * shadow) * 0.98);
        const b = Math.round((200 + 45 * shadow) * 0.98);
        setPixel(scleraLBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(scleraLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '09_Eye_L_Sclera_Inpainted.png'));

  // -------------------------------------------------------------
  // 2. ISOLATED IRISES & PUPILS (Anti-Aliased Gaze Trackers)
  // -------------------------------------------------------------
  console.log('2. Generating Smooth Anti-Aliased Irises & Pupils...');
  const irisRBuf = createBlankCanvas();
  for (let y = 170; y <= 245; y++) {
    for (let x = 445; x <= 505; x++) {
      const alpha = smoothEllipse(x, y, 475, 207, 24, 25, 6, 1.8);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(irisRBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(irisRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '05_Eye_R_Iris_Pupil.png'));

  const irisLBuf = createBlankCanvas();
  for (let y = 240; y <= 315; y++) {
    for (let x = 595; x <= 655; x++) {
      const alpha = smoothEllipse(x, y, 624, 276, 23, 24, -4, 1.8);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(irisLBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(irisLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '10_Eye_L_Iris_Pupil.png'));

  // -------------------------------------------------------------
  // 3. UPPER & LOWER EYELASHES & EYELID ANATOMY (Blinking Pair)
  // -------------------------------------------------------------
  console.log('3. Generating Upper & Lower Eyelash & Eyelid Flaps...');
  // Right Eye Upper Lash & Crease:
  const lashUpperRBuf = createBlankCanvas();
  for (let y = 165; y <= 212; y++) {
    for (let x = 420; x <= 525; x++) {
      const alpha = smoothEllipse(x, y, 472, 192, 45, 18, 6, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(lashUpperRBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(lashUpperRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '08_Eye_R_Eyelashes_Upper.png'));

  // Right Eye Upper Eyelid Skin Flap (Sculpted with skin gradient):
  const eyelidUpperRBuf = createBlankCanvas();
  for (let y = 170; y <= 218; y++) {
    for (let x = 425; x <= 520; x++) {
      const alpha = smoothEllipse(x, y, 472, 196, 43, 19, 6, 2.0);
      if (alpha > 0) {
        const t = (y - 170) / 48;
        const r = Math.round(208 - 18 * t);
        const g = Math.round(152 - 16 * t);
        const b = Math.round(118 - 14 * t);
        setPixel(eyelidUpperRBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(eyelidUpperRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '07_Eye_R_Eyelid_Upper.png'));

  // Right Eye Lower Eyelash:
  const lashLowerRBuf = createBlankCanvas();
  for (let y = 205; y <= 245; y++) {
    for (let x = 435; x <= 520; x++) {
      const alpha = smoothEllipse(x, y, 475, 222, 42, 14, 6, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(lashLowerRBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(lashLowerRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '06_Eye_R_Eyelashes_Lower.png'));

  // Right Eye Lower Eyelid Anatomy (Dedicated lower skin rim):
  const eyelidLowerRBuf = createBlankCanvas();
  for (let y = 212; y <= 248; y++) {
    for (let x = 432; x <= 518; x++) {
      const alpha = smoothEllipse(x, y, 475, 228, 41, 14, 6, 2.0);
      if (alpha > 0) {
        const t = (y - 212) / 36;
        const r = Math.round(214 - 10 * t);
        const g = Math.round(158 - 10 * t);
        const b = Math.round(124 - 10 * t);
        setPixel(eyelidLowerRBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(eyelidLowerRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '06B_Eye_R_Eyelid_Lower.png'));

  // Left Eye Upper Lash & Crease:
  const lashUpperLBuf = createBlankCanvas();
  for (let y = 230; y <= 282; y++) {
    for (let x = 570; x <= 670; x++) {
      const alpha = smoothEllipse(x, y, 620, 260, 42, 18, -4, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(lashUpperLBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(lashUpperLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '13_Eye_L_Eyelashes_Upper.png'));

  // Left Eye Upper Eyelid Skin Flap:
  const eyelidUpperLBuf = createBlankCanvas();
  for (let y = 235; y <= 286; y++) {
    for (let x = 575; x <= 665; x++) {
      const alpha = smoothEllipse(x, y, 620, 264, 40, 18, -4, 2.0);
      if (alpha > 0) {
        const t = (y - 235) / 51;
        const r = Math.round(208 - 18 * t);
        const g = Math.round(152 - 16 * t);
        const b = Math.round(118 - 14 * t);
        setPixel(eyelidUpperLBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(eyelidUpperLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '12_Eye_L_Eyelid_Upper.png'));

  // Left Eye Lower Eyelash:
  const lashLowerLBuf = createBlankCanvas();
  for (let y = 270; y <= 315; y++) {
    for (let x = 575; x <= 665; x++) {
      const alpha = smoothEllipse(x, y, 622, 290, 40, 14, -4, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(lashLowerLBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(lashLowerLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '11_Eye_L_Eyelashes_Lower.png'));

  // Left Eye Lower Eyelid Anatomy:
  const eyelidLowerLBuf = createBlankCanvas();
  for (let y = 280; y <= 318; y++) {
    for (let x = 575; x <= 662; x++) {
      const alpha = smoothEllipse(x, y, 622, 296, 39, 14, -4, 2.0);
      if (alpha > 0) {
        const t = (y - 280) / 38;
        const r = Math.round(214 - 10 * t);
        const g = Math.round(158 - 10 * t);
        const b = Math.round(124 - 10 * t);
        setPixel(eyelidLowerLBuf, x, y, r, g, b, Math.round(255 * alpha));
      }
    }
  }
  await sharp(eyelidLowerLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '11B_Eye_L_Eyelid_Lower.png'));

  // -------------------------------------------------------------
  // 4. SEPARATE LEFT AND RIGHT EYEBROWS
  // -------------------------------------------------------------
  console.log('4. Separating Left and Right Eyebrows...');
  // Eyebrow R (Viewer's Left Eyebrow):
  const browRBuf = createBlankCanvas();
  for (let y = 135; y <= 195; y++) {
    for (let x = 405; x <= 525; x++) {
      const alpha = smoothEllipse(x, y, 460, 165, 48, 20, 12, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(browRBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(browRBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '03A_Eyebrow_R.png'));

  // Eyebrow L (Viewer's Right Eyebrow):
  const browLBuf = createBlankCanvas();
  for (let y = 200; y <= 265; y++) {
    for (let x = 580; x <= 685; x++) {
      const alpha = smoothEllipse(x, y, 630, 228, 44, 20, -6, 2.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(browLBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(browLBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '03B_Eyebrow_L.png'));

  // -------------------------------------------------------------
  // 5. MOUTH & EXPRESSION ARTWORK
  // -------------------------------------------------------------
  console.log('5. Extracting Isolated Mouth & Expression Layers...');
  // Mouth Smile Complete (x: 470-565, y: 295-355):
  const mouthSmileBuf = createBlankCanvas();
  for (let y = 295; y <= 355; y++) {
    for (let x = 470; x <= 565; x++) {
      const alpha = smoothEllipse(x, y, 515, 325, 42, 25, 4, 2.5);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(mouthSmileBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(mouthSmileBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '02A_Mouth_Smile.png'));

  // Mouth Upper Lip:
  const mouthUpperLipBuf = createBlankCanvas();
  for (let y = 295; y <= 330; y++) {
    for (let x = 475; x <= 560; x++) {
      const alpha = smoothEllipse(x, y, 515, 312, 38, 14, 4, 1.8);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(mouthUpperLipBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(mouthUpperLipBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '02B_Mouth_Upper_Lip.png'));

  // Mouth Lower Lip:
  const mouthLowerLipBuf = createBlankCanvas();
  for (let y = 320; y <= 355; y++) {
    for (let x = 480; x <= 555; x++) {
      const alpha = smoothEllipse(x, y, 516, 335, 36, 14, 4, 1.8);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(mouthLowerLipBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(mouthLowerLipBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '02C_Mouth_Lower_Lip.png'));

  // Mouth Interior (Teeth / Cavity):
  const mouthInteriorBuf = createBlankCanvas();
  for (let y = 312; y <= 338; y++) {
    for (let x = 488; x <= 548; x++) {
      const alpha = smoothEllipse(x, y, 516, 324, 28, 10, 4, 1.5);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        setPixel(mouthInteriorBuf, x, y, r, g, b, Math.round(origA * alpha));
      }
    }
  }
  await sharp(mouthInteriorBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '02D_Mouth_Interior.png'));

  // -------------------------------------------------------------
  // 6. TRANSPARENT GLASSES (Clean Eye Holes + Lens Highlights)
  // -------------------------------------------------------------
  console.log('6. Generating Clean Glasses Frame and Glare...');
  const glassesFrameBuf = createBlankCanvas();
  for (let y = 145; y <= 340; y++) {
    for (let x = 390; x <= 720; x++) {
      const inLeftHole = smoothEllipse(x, y, 472, 210, 36, 26, 6, 1.5);
      const inRightHole = smoothEllipse(x, y, 622, 276, 34, 25, -4, 1.5);
      const holeFactor = Math.max(inLeftHole, inRightHole);
      if (holeFactor < 1.0) {
        const [r, g, b, origA] = getPixel(x, y);
        // Alpha is multiplied by (1 - holeFactor) for a soft lens opening
        setPixel(glassesFrameBuf, x, y, r, g, b, Math.round(origA * (1.0 - holeFactor) * 0.96));
      }
    }
  }
  await sharp(glassesFrameBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '17_Glasses_Frame.png'));

  const glassesGlareBuf = createBlankCanvas();
  for (let y = 160; y <= 260; y++) {
    for (let x = 420; x <= 680; x++) {
      const inGlareR = smoothEllipse(x, y, 465, 178, 24, 8, 15, 1.5);
      const inGlareL = smoothEllipse(x, y, 615, 242, 22, 8, 15, 1.5);
      const glareAlpha = Math.max(inGlareR, inGlareL);
      if (glareAlpha > 0) {
        setPixel(glassesGlareBuf, x, y, 255, 255, 255, Math.round(120 * glareAlpha));
      }
    }
  }
  await sharp(glassesGlareBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '18_Glasses_Highlight.png'));

  // -------------------------------------------------------------
  // 7. FACE BASE (Inpainted Behind Eyes and Mouth)
  // -------------------------------------------------------------
  console.log('7. Inpainting Face Base behind Eyes, Mouth, and Bangs...');
  const faceBaseBuf = createBlankCanvas();
  for (let y = 135; y <= 490; y++) {
    for (let x = 350; x <= 750; x++) {
      const alpha = smoothEllipse(x, y, 540, 305, 170, 180, 4, 3.0);
      if (alpha > 0) {
        const [r, g, b, origA] = getPixel(x, y);
        // Inpaint behind the eye sockets and mouth with smooth skin tone
        const isEyeR = smoothEllipse(x, y, 472, 206, 35, 24, 6) > 0.5;
        const isEyeL = smoothEllipse(x, y, 620, 275, 33, 22, -4) > 0.5;
        const isMouth = smoothEllipse(x, y, 516, 325, 28, 14, 4) > 0.5;

        if (isEyeR || isEyeL || isMouth) {
          // Warm skin tone matching cheek
          const skinR = 212, skinG = 154, skinB = 120;
          setPixel(faceBaseBuf, x, y, skinR, skinG, skinB, Math.round(255 * alpha));
        } else {
          setPixel(faceBaseBuf, x, y, r, g, b, Math.round(origA * alpha));
        }
      }
    }
  }
  await sharp(faceBaseBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '02_Face_Base.png'));

  // -------------------------------------------------------------
  // 8. HAIR SECTIONS (Front Bangs, Side Left, Side Right, Back)
  // -------------------------------------------------------------
  console.log('8. Generating Hair Sections (Front, Sides, Back)...');
  const hairFrontBuf = createBlankCanvas();
  for (let y = 0; y <= 285; y++) {
    for (let x = 190; x <= 830; x++) {
      const [r, g, b, origA] = getPixel(x, y);
      if (origA > 0) copyPixel(hairFrontBuf, x, y, 1.0);
    }
  }
  await sharp(hairFrontBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '16_Hair_Front_Bangs.png'));

  const hairSideLeftBuf = createBlankCanvas();
  for (let y = 180; y <= 850; y++) {
    for (let x = 0; x <= 390; x++) {
      copyPixel(hairSideLeftBuf, x, y, 1.0);
    }
  }
  await sharp(hairSideLeftBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '15_Hair_Side_Left.png'));

  const hairSideRightBuf = createBlankCanvas();
  for (let y = 180; y <= 850; y++) {
    for (let x = 700; x < W; x++) {
      copyPixel(hairSideRightBuf, x, y, 1.0);
    }
  }
  await sharp(hairSideRightBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '14_Hair_Side_Right.png'));

  const hairBackBuf = createBlankCanvas();
  for (let y = 100; y <= 920; y++) {
    for (let x = 80; x <= 940; x++) {
      const [r, g, b, a] = getPixel(x, y);
      if (a > 30 && r < 80 && g < 60) {
        setPixel(hairBackBuf, x, y, r, g, b, Math.round(a * 0.95));
      }
    }
  }
  await sharp(hairBackBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '00_Hair_Back_Mass.png'));

  // -------------------------------------------------------------
  // 9. BODY & EXTENDED NECK (Eliminates gaps on head rotation)
  // -------------------------------------------------------------
  console.log('9. Inpainting Extended Neck & Torso behind Jawline...');
  const bodyBuf = createBlankCanvas();
  // Extend neck upwards into the jawline from y=390 to y=440
  for (let y = 390; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [r, g, b, a] = getPixel(x, y);
      if (y < 430) {
        // Extended neck collar area
        if (x >= 440 && x <= 620) {
          const neckAlpha = smoothEllipse(x, y, 530, 420, 80, 35, 0, 3.0);
          if (neckAlpha > 0) {
            setPixel(bodyBuf, x, y, 198, 142, 110, Math.round(255 * neckAlpha));
          }
        }
      } else {
        copyPixel(bodyBuf, x, y, 1.0);
      }
    }
  }
  await sharp(bodyBuf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, '01_Neck_Torso_Clothing.png'));

  // -------------------------------------------------------------
  // 10. ASSEMBLE 26-LAYER ADOBE PHOTOSHOP PSD (Live2D Cubism Standard)
  // -------------------------------------------------------------
  console.log('\n--- 10. Assembling Verified Adobe Photoshop PSD ---');
  function createMockCanvas(buf) {
    return {
      width: W,
      height: H,
      getContext: () => ({
        getImageData: (x, y, w, h) => ({
          width: w,
          height: h,
          data: buf
        })
      })
    };
  }

  const psdStructure = {
    width: W,
    height: H,
    channels: 4,
    bitsPerChannel: 8,
    colorMode: 3, // RGB (8-bit)
    children: [
      {
        name: 'Part01Glasses',
        opened: true,
        children: [
          { name: 'Glasses_Highlight', canvas: createMockCanvas(glassesGlareBuf), opacity: 0.9 },
          { name: 'Glasses_Frame', canvas: createMockCanvas(glassesFrameBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01HairFront',
        opened: true,
        children: [
          { name: 'Hair_Front_Bangs', canvas: createMockCanvas(hairFrontBuf), opacity: 1.0 },
          { name: 'Hair_Side_Left', canvas: createMockCanvas(hairSideLeftBuf), opacity: 1.0 },
          { name: 'Hair_Side_Right', canvas: createMockCanvas(hairSideRightBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01EyeL',
        opened: true,
        children: [
          { name: 'Eye_L_Eyelashes_Upper', canvas: createMockCanvas(lashUpperLBuf), opacity: 1.0 },
          { name: 'Eye_L_Eyelid_Upper', canvas: createMockCanvas(eyelidUpperLBuf), opacity: 1.0 },
          { name: 'Eye_L_Eyelashes_Lower', canvas: createMockCanvas(lashLowerLBuf), opacity: 1.0 },
          { name: 'Eye_L_Eyelid_Lower', canvas: createMockCanvas(eyelidLowerLBuf), opacity: 1.0 },
          { name: 'Eye_L_Iris_Pupil', canvas: createMockCanvas(irisLBuf), opacity: 1.0 },
          { name: 'Eye_L_Sclera_Inpainted', canvas: createMockCanvas(scleraLBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01EyeR',
        opened: true,
        children: [
          { name: 'Eye_R_Eyelashes_Upper', canvas: createMockCanvas(lashUpperRBuf), opacity: 1.0 },
          { name: 'Eye_R_Eyelid_Upper', canvas: createMockCanvas(eyelidUpperRBuf), opacity: 1.0 },
          { name: 'Eye_R_Eyelashes_Lower', canvas: createMockCanvas(lashLowerRBuf), opacity: 1.0 },
          { name: 'Eye_R_Eyelid_Lower', canvas: createMockCanvas(eyelidLowerRBuf), opacity: 1.0 },
          { name: 'Eye_R_Iris_Pupil', canvas: createMockCanvas(irisRBuf), opacity: 1.0 },
          { name: 'Eye_R_Sclera_Inpainted', canvas: createMockCanvas(scleraRBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01Eyebrows',
        opened: true,
        children: [
          { name: 'Eyebrow_L', canvas: createMockCanvas(browLBuf), opacity: 1.0 },
          { name: 'Eyebrow_R', canvas: createMockCanvas(browRBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01Mouth',
        opened: true,
        children: [
          { name: 'Mouth_Upper_Lip', canvas: createMockCanvas(mouthUpperLipBuf), opacity: 1.0 },
          { name: 'Mouth_Lower_Lip', canvas: createMockCanvas(mouthLowerLipBuf), opacity: 1.0 },
          { name: 'Mouth_Interior', canvas: createMockCanvas(mouthInteriorBuf), opacity: 1.0 },
          { name: 'Mouth_Smile', canvas: createMockCanvas(mouthSmileBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01Face',
        opened: true,
        children: [
          { name: 'Face_Base', canvas: createMockCanvas(faceBaseBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01Body',
        opened: true,
        children: [
          { name: 'Neck_Torso_Clothing', canvas: createMockCanvas(bodyBuf), opacity: 1.0 },
        ]
      },
      {
        name: 'Part01HairBack',
        opened: true,
        children: [
          { name: 'Hair_Back_Mass', canvas: createMockCanvas(hairBackBuf), opacity: 0.95 },
        ]
      }
    ]
  };

  const psdBuffer = writePsd(psdStructure);
  fs.writeFileSync(PSD_PATH, Buffer.from(psdBuffer));
  console.log(`Successfully generated verified PSD: ${PSD_PATH} (${psdBuffer.byteLength} bytes)`);

  // Verify structure with readPsd
  const verifiedPsd = readPsd(psdBuffer, { skipCompositeImageData: true, skipLayerImageData: true });
  console.log('\n--- Verification of Generated PSD ---');
  console.log(`Canvas: ${verifiedPsd.width}x${verifiedPsd.height}`);
  console.log(`Top Groups (${verifiedPsd.children.length}): ${verifiedPsd.children.map(c => c.name).join(', ')}`);

  let layerCount = 0;
  const nameSet = new Set();
  let duplicateCount = 0;

  verifiedPsd.children.forEach(group => {
    if (group.children) {
      group.children.forEach(l => {
        layerCount++;
        if (nameSet.has(l.name)) duplicateCount++;
        nameSet.add(l.name);
      });
      console.log(`  [${group.name}] (${group.children.length} layers): ${group.children.map(l => l.name).join(', ')}`);
    } else {
      layerCount++;
      if (nameSet.has(group.name)) duplicateCount++;
      nameSet.add(group.name);
    }
  });

  console.log(`Total Layers in PSD: ${layerCount}`);
  console.log(`Unique Names Check: ${duplicateCount === 0 ? 'PASSED (100% Unique)' : 'FAILED (Duplicates found)'}`);
}

main().catch(console.error);

