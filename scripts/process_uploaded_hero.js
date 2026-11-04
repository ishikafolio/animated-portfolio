const sharp = require('sharp');
const fs = require('fs');

async function processUploadedHero() {
  const src = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/.user_uploaded/media_1793691600710_86739a7b.jpg';
  
  // 1. Export directly to public/projects/packaging/packaging-podium-hero.webp and .jpg
  await sharp(src)
    .webp({ quality: 98, effort: 6 })
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.webp');

  await sharp(src)
    .jpeg({ quality: 98 })
    .toFile('e:/animated-portfolio/public/projects/packaging/packaging-podium-hero.jpg');

  console.log('Saved public/projects/packaging/packaging-podium-hero.webp and .jpg');

  // 2. Also create an annotated grid version for coordinate inspection
  const width = 1024;
  const height = 576;
  let lines = '';
  for (let x = 50; x < width; x += 50) {
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(255,255,255,0.3)" stroke-width="1" />`;
    if (x % 100 === 0) lines += `<text x="${x+2}" y="20" fill="white" font-size="11" font-family="monospace">${x}</text>`;
  }
  for (let y = 50; y < height; y += 50) {
    lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(255,255,255,0.3)" stroke-width="1" />`;
    if (y % 100 === 0) lines += `<text x="5" y="${y+14}" fill="white" font-size="11" font-family="monospace">${y}</text>`;
  }
  const svg = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`);

  await sharp(src)
    .composite([{ input: svg, blend: 'over' }])
    .png()
    .toFile('e:/animated-portfolio/public/projects/packaging/uploaded_annotated.png');

  console.log('Saved uploaded_annotated.png');
}

processUploadedHero().catch(console.error);

