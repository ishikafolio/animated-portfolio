const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9445;

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
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 950, deviceScaleFactor: 1, mobile: false });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3500);

  // Measure sections
  const checkSection = async (selector, name, filename, block = 'start') => {
    const info = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: '${block}' });
        const rect = el.getBoundingClientRect();
        return {
          id: el.id,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth
        };
      })()`,
      returnByValue: true
    });
    console.log(name, JSON.stringify(info.result?.value));
    await sleep(600);
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
    console.log('Saved', filename);
  };

  // CareConnect intro & settled
  await checkSection('#intro-uiux', 'CareConnect wrapper', 'current-careconnect-intro.jpg', 'start');
  
  await sendCDP(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#intro-uiux');
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, top + (el.offsetHeight * 0.96));
      }
    })()`
  });
  await sleep(1000);
  const snapCC = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'current-careconnect-settled.jpg'), Buffer.from(snapCC.data, 'base64'));
  console.log('Saved current-careconnect-settled.jpg');

  // Aara
  await checkSection('#showcase-aara', 'Aara showcase', 'current-aara-showcase.jpg', 'start');

  // Nexa
  await checkSection('#showcase-nexa', 'Nexa showcase', 'current-nexa-showcase.jpg', 'center');

  // Social Media
  await checkSection('#chapter-social', 'Social Media chapter', 'current-social-media.jpg', 'start');

  // Glow Bite
  await checkSection('#showcase-glowbite', 'Glow Bite showcase', 'current-glowbite-showcase.jpg', 'center');

  chrome.kill();
  process.exit(0);
})();
