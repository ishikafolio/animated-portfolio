const fs = require('fs');
const path = require('path');

const STAGED = "C:/Users/yoges/Documents/Codex/2026-11-02/connection-interrupted-waiting-for-the-complete-3/work/portfolio-final";
const MAIN = "E:/animated-portfolio";

function compareDirs(dirA, dirB, rel = '') {
  const fullA = path.join(dirA, rel);
  const fullB = path.join(dirB, rel);

  if (!fs.existsSync(fullA)) return;

  const entriesA = fs.readdirSync(fullA, { withFileTypes: true });
  for (const ent of entriesA) {
    if (ent.name === '.next' || ent.name === 'node_modules' || ent.name === '.git') continue;
    const relChild = path.join(rel, ent.name);
    const itemA = path.join(dirA, relChild);
    const itemB = path.join(dirB, relChild);

    if (ent.isDirectory()) {
      if (!fs.existsSync(itemB)) {
        console.log(`[DIR ONLY IN STAGED] ${relChild}`);
      }
      compareDirs(dirA, dirB, relChild);
    } else {
      if (!fs.existsSync(itemB)) {
        console.log(`[FILE ONLY IN STAGED] ${relChild}`);
      } else {
        const statA = fs.statSync(itemA);
        const statB = fs.statSync(itemB);
        if (statA.size !== statB.size) {
          console.log(`[SIZE DIFF] ${relChild}: Staged=${statA.size}b, Main=${statB.size}b`);
        }
      }
    }
  }

  // Also check if any file in MAIN is missing in STAGED
  if (fs.existsSync(fullB)) {
    const entriesB = fs.readdirSync(fullB, { withFileTypes: true });
    for (const ent of entriesB) {
      if (ent.name === '.next' || ent.name === 'node_modules' || ent.name === '.git') continue;
      const relChild = path.join(rel, ent.name);
      const itemA = path.join(dirA, relChild);
      if (!fs.existsSync(itemA)) {
        console.log(`[FILE ONLY IN MAIN] ${relChild}`);
      }
    }
  }
}

console.log('--- Comparing STAGED to MAIN ---');
compareDirs(STAGED, MAIN);

