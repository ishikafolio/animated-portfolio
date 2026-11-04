const fs = require('fs');
const code = fs.readFileSync('src/components/home/BrandIdentityChapter.tsx', 'utf8');
const matches = [...code.matchAll(/id=["']([^"']+)["']/g)];
matches.forEach(m => console.log(m[1]));

