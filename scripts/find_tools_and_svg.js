const fs = require('fs');
const path = require('path');

function searchAll(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === '.git' || f === 'scripts') continue;
    if (fs.statSync(full).isDirectory()) {
      searchAll(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('>svg<') || l.includes('>SVG<') || l.includes('svg ') || l.includes('tool') || l.includes('Tool')) {
          if (l.includes('>svg<') || l.includes('>SVG<') || l.toLowerCase().includes('next.js') || l.toLowerCase().includes('tailwind')) {
            console.log(`${full}:${i+1}: ${l.trim()}`);
          }
        }
      });
    }
  }
}

searchAll('src');
