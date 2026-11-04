const fs = require('fs');

const a = fs.readFileSync('C:/Users/yoges/Documents/Codex/2026-11-02/connection-interrupted-waiting-for-the-complete-3/work/portfolio-final/src/app/page.tsx', 'utf-8');
const b = fs.readFileSync('E:/animated-portfolio/src/app/page.tsx', 'utf-8');

console.log('Is page.tsx identical?', a === b);
if (a !== b) {
  console.log('Length A:', a.length, 'Length B:', b.length);
}

