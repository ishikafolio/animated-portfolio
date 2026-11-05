const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9592;
const sleep = ms => new Promise(r => setTimeout(r, ms));

let msgId = 1;
function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const handleMsg = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handleMsg);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handleMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

(async () => {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=375,844'
  ]);
  await sleep(1500);

  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
  await sleep(4000);

  const evalCode = (expr) => sendCDP(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true }).then(r => r?.result?.value);

  // Check UI/UX trigger progress as we scroll from 9000 to 11000
  for (let y = 9200; y <= 10400; y += 200) {
    await evalCode(`window.scrollTo(0, ${y})`);
    await sleep(200);
    const p = await evalCode(`(() => {
      const st = window.ScrollTrigger.getAll().find(t => t.trigger?.classList?.contains('uiux-world-wrapper'));
      const clip = document.querySelector('.uiux-stage [style*="clip"]')?.style?.clipPath;
      return { y: window.scrollY, start: st?.start, end: st?.end, progress: st?.progress, clip };
    })()`);
    console.log(`ScrollY=${y}:`, p);
  }

  ws.close();
  chrome.kill();
})();

