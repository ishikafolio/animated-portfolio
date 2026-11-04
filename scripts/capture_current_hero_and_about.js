const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9392;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-tools-'));

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
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + tmpDir,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]);

  try {
    await sleep(2500);
    const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
    const list = await res.json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'Runtime.enable');
    
    // Desktop 1920
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3500);

    // Capture Hero current
    let snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'current-hero-specialties-desktop.jpg'), Buffer.from(snap.data, 'base64'));

    // Capture About current
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'document.querySelector("#about")?.scrollIntoView({ behavior: "instant", block: "start" })',
      returnByValue: true
    });
    await sleep(600);
    snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'current-about-tools-desktop.jpg'), Buffer.from(snap.data, 'base64'));

    // Mobile 390
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, hasTouch: true });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3500);

    snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'current-hero-specialties-mobile.jpg'), Buffer.from(snap.data, 'base64'));

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'document.querySelector("#about")?.scrollIntoView({ behavior: "instant", block: "start" })',
      returnByValue: true
    });
    await sleep(600);
    snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'current-about-tools-mobile.jpg'), Buffer.from(snap.data, 'base64'));

    console.log('Current screenshots captured.');
    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
