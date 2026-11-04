const http = require('http');
const fs = require('fs');

http.get('http://127.0.0.1:3102/', (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/port_3102_dump.html', html);
    console.log('Saved port_3102_dump.html (length:', html.length, ')');
    
    // Check key strings
    console.log('Includes FOUR WORLDS:', html.includes('FOUR WORLDS'));
    console.log('Includes SELECTED WORK:', html.includes('SELECTED WORK'));
    console.log('Includes FOUR WORLDS. ONE CURIOUS MIND.:', html.includes('FOUR WORLDS. ONE CURIOUS MIND.'));
    console.log('Includes ProjectIndex:', html.includes('ProjectIndex'));
    
    // Find all script tags
    const scriptMatches = html.match(/<script[^>]*src="([^"]+)"[^>]*>/g) || [];
    console.log('Scripts count:', scriptMatches.length);
    scriptMatches.slice(0, 5).forEach(s => console.log(' ', s));
  });
}).on('error', (e) => {
  console.error('Error fetching 3102:', e.message);
});

