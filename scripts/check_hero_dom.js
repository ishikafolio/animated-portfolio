const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9398;

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
  const chrome = spawn(CHROME_PATH, ['--headless=new', '--remote-debugging-port=' + PORT, '--no-sandbox', '--window-size=1920,1080']);
  try {
    await sleep(2000);
    const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
    const list = await res.json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    await sendCDP(ws, 'Page.enable');
    await sendCDP(ws, 'Runtime.enable');
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(5500); // Wait for full GSAP entrance completion

    const info = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const items = Array.from(document.querySelectorAll(".hero-detail-item"));
        return items.map(el => ({
          text: el.innerText.slice(0, 50).replace(/\\n/g, ' '),
          opacity: window.getComputedStyle(el).opacity,
          fontSize: window.getComputedStyle(el).fontSize,
          fontWeight: window.getComputedStyle(el).fontWeight,
          color: window.getComputedStyle(el).color,
        }));
      })()`,
      returnByValue: true
    });
    console.log('Hero Items Opacity & Styles at 5.5s:\n', JSON.stringify(info.result?.value, null, 2));

    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verified-hero-specialties-desktop.jpg'), Buffer.from(snap.data, 'base64'));
    console.log('Saved verified-hero-specialties-desktop.jpg at 5.5s');

    // Also capture About section
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'document.querySelector("#about")?.scrollIntoView({ behavior: "instant", block: "start" })',
      returnByValue: true
    });
    await sleep(800);
    const snapAbout = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verified-about-tools-desktop.jpg'), Buffer.from(snapAbout.data, 'base64'));
    console.log('Saved verified-about-tools-desktop.jpg');

    // Mobile 390
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, hasTouch: true });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(5500);

    const mobileInfo = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const item = document.querySelector(".hero-detail-item.pt-3");
        const links = item ? Array.from(item.querySelectorAll("a")) : [];
        return links.map(a => ({
          text: a.innerText,
          fontSize: window.getComputedStyle(a).fontSize,
          fontWeight: window.getComputedStyle(a).fontWeight,
          color: window.getComputedStyle(a).color,
        }));
      })()`,
      returnByValue: true
    });
    console.log('Mobile 390 Styles:\n', JSON.stringify(mobileInfo.result?.value, null, 2));

    const snapMobileHero = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verified-hero-specialties-mobile.jpg'), Buffer.from(snapMobileHero.data, 'base64'));
    console.log('Saved verified-hero-specialties-mobile.jpg');

    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'document.querySelector("#about")?.scrollIntoView({ behavior: "instant", block: "start" })',
      returnByValue: true
    });
    await sleep(800);
    const snapMobileAbout = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verified-about-tools-mobile.jpg'), Buffer.from(snapMobileAbout.data, 'base64'));
    console.log('Saved verified-about-tools-mobile.jpg');

    ws.close();
  } finally {
    chrome.kill();
  }
}
run();
