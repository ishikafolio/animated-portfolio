const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9386;

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function sendCDP(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const handleMsg = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handleMsg);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      } catch (e) {}
    };
    ws.addEventListener('message', handleMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(ws, expression) {
  const result = await sendCDP(ws, "Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function captureScreenshot(ws, filename) {
  const result = await sendCDP(ws, "Page.captureScreenshot", { format: "jpeg", quality: 85 });
  const filepath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

async function main() {
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=1920,950"
  ]);

  try {
    await sleep(2000);
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const list = await res.json();
    const pageTarget = list.find(t => t.type === "page") || list[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    await sendCDP(ws, "Page.enable");
    await sendCDP(ws, "Runtime.enable");

    await sendCDP(ws, "Emulation.setDeviceMetricsOverride", { width: 1920, height: 950, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Find Logo Folio element position
    const pos = await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-logo-folio");
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      // Scroll to the marks gallery inside logo folio
      window.scrollTo(0, top + 600);
      return { top, height: rect.height };
    })()`);
    console.log("Logo folio pos:", pos);
    await sleep(800);
    await captureScreenshot(ws, "audit-01-logo-folio-marks.jpg");

    // Click on Verda tab/plaque to verify its link
    const verdaLink = await evaluate(ws, `(() => {
      // Find buttons/tabs in logo folio
      const btns = Array.from(document.querySelectorAll("#chapter-logo-folio button, #chapter-logo-folio [role='tab']"));
      const verdaBtn = btns.find(b => b.innerText.includes("Verda") || b.innerText.includes("03"));
      if (verdaBtn) verdaBtn.click();
      
      const link = document.querySelector("#chapter-logo-folio a[href*='brand']");
      return {
        verdaBtnFound: !!verdaBtn,
        linkText: link?.innerText,
        linkHref: link?.getAttribute("href")
      };
    })()`);
    console.log("Verda link check:", verdaLink);
    await sleep(600);
    await captureScreenshot(ws, "audit-01-logo-folio-verda-active.jpg");

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

main();

