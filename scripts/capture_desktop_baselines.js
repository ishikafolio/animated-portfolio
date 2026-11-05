const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9560;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sendCDP(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
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
  console.log('=== CAPTURING DESKTOP BASELINES (1920px & 1440px) ===');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=1920,950'
  ]);
  await sleep(2000);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');

  const evalCode = (code) =>
    sendCDP(ws, 'Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  const capture = async (filename) => {
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
    console.log(`Saved baseline: ${filename}`);
  };

  const captureSectionsAtWidth = async (width, prefix) => {
    console.log(`\nCapturing at ${width}px...`);
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3500);

    const sections = [
      { id: '#intro-logo-folio', name: 'logo-folio-hero' },
      { id: '#chapter-identity', name: 'identity-hero' },
      { id: '#showcase-earthkind', name: 'identity-earthkind' },
      { id: '#showcase-nexa', name: 'identity-nexa' },
      { id: '#intro-uiux', name: 'uiux-careconnect' },
      { id: '#chapter-packaging', name: 'packaging-podium' },
      { id: '#showcase-aara', name: 'packaging-aara' },
      { id: '#showcase-glowbite', name: 'packaging-glowbite' },
      { id: '#chapter-social', name: 'social-media' },
      { id: '#chapter-flyers', name: 'flyers' },
      { id: '#chapter-ai-creatives', name: 'ai-creatives' }
    ];

    for (const sec of sections) {
      await evalCode(`(() => {
        const el = document.querySelector('${sec.id}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      await capture(`${prefix}-${sec.name}.jpg`);
    }
  };

  await captureSectionsAtWidth(1920, 'baseline-1920');
  await captureSectionsAtWidth(1440, 'baseline-1440');

  console.log('\n=== BASELINES SAVED SUCCESSFULLY ===');
  chrome.kill();
  process.exit(0);
})();

