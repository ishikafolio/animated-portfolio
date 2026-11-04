const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9390;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-'));

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sendCDP(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const handleMsg = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.id === id) {
          ws.removeEventListener('message', handleMsg);
          if (d.error) reject(d.error); else resolve(d.result);
        }
      } catch (err) {}
    };
    ws.addEventListener('message', handleMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  console.log("Starting Chrome with tmp dir:", tmpDir);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + tmpDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1920,950'
  ]);

  try {
    await sleep(2500);
    const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
    const list = await res.json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'Runtime.enable');
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 950, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3500);

    // Scroll to #gallery-marks
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'document.querySelector("#gallery-marks")?.scrollIntoView({ behavior: "instant", block: "center" })',
      returnByValue: true
    });
    await sleep(700);
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'audit-01-logo-folio-gallery.jpg'), Buffer.from(snap.data, 'base64'));
    console.log('Saved audit-01-logo-folio-gallery.jpg');
    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
