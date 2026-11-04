const sharp = require('sharp');
const fs = require('fs');

async function checkStage() {
  const meta = await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg').metadata();
  console.log('Original stage dimensions:', meta.width, 'x', meta.height);
}

checkStage();

