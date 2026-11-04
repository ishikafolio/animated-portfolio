const sharp = require('sharp');

async function markCoordinates() {
  const width = 1376;
  const height = 768;

  // Let's draw vertical lines every 100px and horizontal lines every 100px with labels
  let lines = '';
  for (let x = 100; x < width; x += 100) {
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(255,255,255,0.4)" stroke-width="1" />`;
    lines += `<text x="${x+2}" y="30" fill="white" font-size="16" font-family="sans-serif">${x}</text>`;
  }
  for (let y = 100; y < height; y += 100) {
    lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(255,255,255,0.4)" stroke-width="1" />`;
    lines += `<text x="10" y="${y+18}" fill="white" font-size="16" font-family="sans-serif">${y}</text>`;
  }

  const gridSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${lines}
    </svg>
  `);

  await sharp('C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce/packaging_dual_podium_stage_v2_1793683495707.jpg')
    .composite([{ input: gridSvg, blend: 'over' }])
    .png()
    .toFile('e:/animated-portfolio/public/projects/packaging/stage_grid_reference.png');

  console.log('Saved stage_grid_reference.png');
}

markCoordinates().catch(console.error);

