const sharp = require('e:/animated-portfolio/node_modules/sharp');

async function diffCheck() {
  const neutral = await sharp('public/character/debug_screen_face_neutral.png').raw().toBuffer({ resolveWithObject: true });
  const left = await sharp('public/character/debug_screen_face_left.png').raw().toBuffer({ resolveWithObject: true });
  const right = await sharp('public/character/debug_screen_face_right.png').raw().toBuffer({ resolveWithObject: true });

  let diffLeftCount = 0, diffRightCount = 0;
  for (let i = 0; i < neutral.data.length; i += 3) {
    if (Math.abs(neutral.data[i] - left.data[i]) > 15) diffLeftCount++;
    if (Math.abs(neutral.data[i] - right.data[i]) > 15) diffRightCount++;
  }

  console.log(`Difference pixels between Neutral and Left: ${diffLeftCount}`);
  console.log(`Difference pixels between Neutral and Right: ${diffRightCount}`);
}

diffCheck().catch(console.error);

