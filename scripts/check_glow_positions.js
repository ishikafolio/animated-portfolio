const { spawn } = require('child_process');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9559;
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=1920,950'
  ]);
  await sleep(2000);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const ws = new WebSocket((await res.json())[0].webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  const send = (m, p = {}) =>
    new Promise((resolve) => {
      const id = Math.floor(Math.random() * 1e6);
      const cb = e => {
        const d = JSON.parse(e.data);
        if (d.id === id) {
          ws.removeEventListener('message', cb);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', cb);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3500);

  const pos = await send('Runtime.evaluate', {
    expression: `(() => {
      const gb = document.querySelector('#showcase-glowbite');
      gb.scrollIntoView({ behavior: 'instant', block: 'start' });
      const nav = document.querySelector('header');
      const navH = nav ? nav.getBoundingClientRect().height : 64;
      const gbR = gb.getBoundingClientRect();
      const aaraFooter = document.querySelector('#showcase-aara footer');
      const aaraR = aaraFooter ? aaraFooter.getBoundingClientRect() : null;
      return {
        navH,
        gbTop: Math.round(gbR.top),
        aaraFooterTop: aaraR ? Math.round(aaraR.top) : null,
        aaraFooterBottom: aaraR ? Math.round(aaraR.bottom) : null,
        isAaraFooterVisibleBelowNav: aaraR ? (aaraR.bottom > navH && aaraR.top < window.innerHeight) : false
      };
    })()`,
    returnByValue: true
  });
  console.log('POS:', JSON.stringify(pos.result?.value, null, 2));
  chrome.kill();
  process.exit(0);
})();

