const fs = require('fs');
const html = fs.readFileSync('scripts/port_3102_dump.html', 'utf-8');

// Find headings, section tags, IDs, titles
const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
const sections = html.match(/<section[^>]*id="([^"]*)"[^>]*>/gi) || [];

console.log('--- Sections in port 3102 ---');
sections.forEach(s => console.log(s));

console.log('\n--- H1s in port 3102 ---');
h1s.forEach(h => console.log(h.replace(/<[^>]+>/g, ' ').trim()));

console.log('\n--- H2s in port 3102 ---');
h2s.forEach(h => console.log(h.replace(/<[^>]+>/g, ' ').trim()));

