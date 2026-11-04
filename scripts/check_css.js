const http = require('http');

http.get('http://localhost:3000', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const cssMatches = [...d.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)];
    console.log('CSS links in HTML count:', cssMatches.length);
    if (cssMatches.length === 0) {
      console.log('No CSS links found in HTML! Checking head:');
      console.log(d.slice(0, 1500));
    }
    cssMatches.forEach(m => {
      http.get('http://localhost:3000' + m[1], (cres) => {
        console.log(m[1], 'status:', cres.statusCode);
      });
    });
  });
});
