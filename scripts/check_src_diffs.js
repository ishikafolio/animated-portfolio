const fs = require('fs');
const path = require('path');

const STAGED = "C:/Users/yoges/Documents/Codex/2026-11-02/connection-interrupted-waiting-for-the-complete-3/work/portfolio-final";
const MAIN = "E:/animated-portfolio";

function checkDiffs(subdir) {
  const dirA = path.join(STAGED, subdir);
  const dirB = path.join(MAIN, subdir);

  function walk(currentRel) {
    const pA = path.join(dirA, currentRel);
    const pB = path.join(dirB, currentRel);

    if (!fs.existsSync(pA)) return;
    const entries = fs.readdirSync(pA, { withFileTypes: true });
    for (const ent of entries) {
      const rel = path.join(currentRel, ent.name);
      const fA = path.join(dirA, rel);
      const fB = path.join(dirB, rel);

      if (ent.isDirectory()) {
        walk(rel);
      } else {
        if (!fs.existsSync(fB)) {
          console.log(`[STAGED ONLY] ${subdir}/${rel}`);
        } else {
          const bufA = fs.readFileSync(fA);
          const bufB = fs.readFileSync(fB);
          if (!bufA.equals(bufB)) {
            console.log(`[CONTENT DIFF] ${subdir}/${rel} (Staged: ${bufA.length}b, Main: ${bufB.length}b)`);
          }
        }
      }
    }
  }
  walk('');
}

console.log('--- Checking src diffs ---');
checkDiffs('src');
console.log('--- Checking content diffs ---');
checkDiffs('content');
console.log('--- Checking public diffs ---');
checkDiffs('public');

