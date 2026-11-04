const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9396;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit2-'));

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

async function evaluate(ws, expression) {
  const result = await sendCDP(ws, "Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function captureScreenshot(ws, filename) {
  const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

async function waitForPageReady(ws) {
  for (let i = 0; i < 30; i++) {
    const ready = await evaluate(ws, `(() => {
      const links = document.querySelectorAll("link[rel='stylesheet']");
      const sheets = document.styleSheets;
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      return sheets.length > 0 && bodyBg !== "rgba(0, 0, 0, 0)" && bodyBg !== "transparent";
    })()`);
    if (ready) return;
    await sleep(400);
  }
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

    // =========================================================================
    // 1. DESKTOP 1920x950
    // =========================================================================
    console.log("\n>>> DESKTOP 1920x950 AUDIT...");
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 950, deviceScaleFactor: 1, mobile: false });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);
    await waitForPageReady(ws);
    await sleep(1500);

    const desktopAudit = await evaluate(ws, `(() => {
      // Specialty items audit
      const specialtyContainer = document.querySelector(".hero-detail-item.text-\\[16px\\]") || document.querySelector(".hero-detail-item.pt-3");
      const links = specialtyContainer ? Array.from(specialtyContainer.querySelectorAll("a")) : [];
      const specialties = links.map(a => {
        const style = window.getComputedStyle(a);
        const dot = a.previousElementSibling;
        const dotStyle = dot ? window.getComputedStyle(dot) : null;
        return {
          text: a.innerText,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          dotWidth: dotStyle ? dotStyle.width : null,
          dotHeight: dotStyle ? dotStyle.height : null,
          dotBg: dotStyle ? dotStyle.backgroundColor : null,
        };
      });

      // Tools audit in About section
      const aboutText = document.querySelector("#about")?.innerText || "";
      const hasNextReact = aboutText.includes("Next.js") || aboutText.includes("React");
      const hasTailwind = aboutText.includes("Tailwind");
      
      const toolChips = Array.from(document.querySelectorAll("#about .flex.flex-wrap span.inline-flex")).map(chip => {
        const label = chip.querySelector("span:last-child")?.innerText || chip.innerText;
        const svg = chip.querySelector("svg");
        const hasSvgText = chip.innerText.toLowerCase().includes("svg");
        return {
          label: label.trim(),
          hasIcon: !!svg,
          hasStraySvgText: hasSvgText
        };
      });

      return {
        specialties,
        toolsAudit: {
          hasNextReact,
          hasTailwind,
          toolChips
        }
      };
    })()`);

    console.log("Desktop Audit Results:", JSON.stringify(desktopAudit, null, 2));

    await captureScreenshot(ws, "verified-hero-specialties-desktop.jpg");

    await evaluate(ws, `(() => {
      document.querySelector("#about")?.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(800);
    await captureScreenshot(ws, "verified-about-tools-desktop.jpg");

    // =========================================================================
    // 2. MOBILE 390x844
    // =========================================================================
    console.log("\n>>> MOBILE 390x844 AUDIT...");
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, hasTouch: true });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);
    await waitForPageReady(ws);
    await sleep(1500);

    const mobileAudit = await evaluate(ws, `(() => {
      const specialtyContainer = document.querySelector(".hero-detail-item.text-\\[16px\\]") || document.querySelector(".hero-detail-item.pt-3");
      const links = specialtyContainer ? Array.from(specialtyContainer.querySelectorAll("a")) : [];
      const specialties = links.map(a => {
        const style = window.getComputedStyle(a);
        const rect = a.getBoundingClientRect();
        return {
          text: a.innerText,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width)
        };
      });

      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;

      return {
        bodyWidth,
        windowWidth,
        zeroOverflow: bodyWidth <= windowWidth,
        specialties
      };
    })()`);

    console.log("Mobile 390 Audit Results:", JSON.stringify(mobileAudit, null, 2));

    await evaluate(ws, `(() => {
      const el = document.querySelector(".hero-detail-item.pt-3");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(800);
    await captureScreenshot(ws, "verified-hero-specialties-mobile.jpg");

    await evaluate(ws, `(() => {
      document.querySelector("#about")?.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(800);
    await captureScreenshot(ws, "verified-about-tools-mobile.jpg");

    // =========================================================================
    // 3. NARROW MOBILE 320x568
    // =========================================================================
    console.log("\n>>> NARROW MOBILE 320x568 AUDIT...");
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 568, deviceScaleFactor: 1, mobile: true, hasTouch: true });
    await sleep(500);

    const narrowAudit = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      return {
        bodyWidth,
        windowWidth,
        zeroOverflow: bodyWidth <= windowWidth,
      };
    })()`);
    console.log("Narrow 320 Overflow Audit:", narrowAudit);

    await evaluate(ws, `(() => {
      const el = document.querySelector(".hero-detail-item.pt-3");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(800);
    await captureScreenshot(ws, "verified-hero-specialties-narrow.jpg");

    ws.close();
    console.log("\nAll verifications completed successfully.");
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
