const sharp = require('e:/animated-portfolio/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";

async function createGif() {
  const frameFiles = [
    'rec-01-neutral.png',
    'rec-02-sweep-left.png',
    'rec-06-diagonal-topleft.png',
    'rec-04-sweep-up.png',
    'rec-03-sweep-right.png',
    'rec-07-diagonal-bottomright.png',
    'rec-05-sweep-down.png',
    'rec-08-stationary-initial.png',
    'rec-08-stationary-hold.png',
    'rec-09-cursor-exit-neutral.png',
  ];

  console.log('Testing GIF assembly from frames...');
  // Resize all frames to 720x450
  const resizedBuffers = [];
  for (const f of frameFiles) {
    const b = await sharp(path.join(ARTIFACT_DIR, f))
      .resize(720, 450)
      .toBuffer();
    resizedBuffers.push(b);
  }

  // Check if sharp can create animated gif
  try {
    // In sharp, animated images can be created from stitched vertical strip with pageHeight
    const stitched = await sharp({
      create: {
        width: 720,
        height: 450 * resizedBuffers.length,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite(resizedBuffers.map((input, idx) => ({ input, top: idx * 450, left: 0 })))
    .png()
    .toBuffer();

    // Now convert vertical strip to animated GIF
    const gifOut = path.join(ARTIFACT_DIR, 'final-character-screen-recording.gif');
    await sharp(stitched, { animated: true, pageHeight: 450 })
      .gif({ loop: 0, delay: [600, 600, 600, 600, 600, 600, 600, 1000, 1000, 800] })
      .toFile(gifOut);

    console.log(`Successfully generated animated screen recording GIF: ${gifOut}`);
    fs.copyFileSync(gifOut, 'e:/animated-portfolio/public/character/final-character-screen-recording.gif');
  } catch (err) {
    console.log('GIF creation via sharp note:', err.message);
  }
}

createGif().catch(console.error);

