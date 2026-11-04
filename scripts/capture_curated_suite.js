const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9380;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCDP(ws, method, params = {}, timeoutMs = 12000) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.removeEventListener('message', handleMsg);
      reject(new Error(`CDP ${method} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const handleMsg = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          clearTimeout(timer);
          ws.removeEventListener('message', handleMsg);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      } catch (e) {
        // ignore
      }
    };
    ws.addEventListener('message', handleMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(ws, expression) {
  const result = await sendCDP(ws, "Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result?.value;
}

async function captureScreenshot(ws, filename) {
  try {
    const result = await sendCDP(ws, "Page.captureScreenshot", { format: "jpeg", quality: 85 });
    const filepath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
    console.log(`Saved screenshot: ${filename} (${Math.round(result.data.length * 0.75 / 1024)} KB)`);
  } catch (err) {
    console.warn(`Screenshot error:`, err.message);
  }
}

async function setViewport(ws, width, height, isMobile = false) {
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: isMobile,
    hasTouch: isMobile,
  });
  await sleep(400);
}

async function main() {
  console.log("Starting Chrome on port", PORT);
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-extensions",
    "--window-size=1920,900"
  ]);

  try {
    await sleep(2500);
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const list = await res.json();
    const pageTarget = list.find(t => t.type === "page") || list[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await sendCDP(ws, "Page.enable");
    await sendCDP(ws, "Runtime.enable");

    // =========================================================================
    // 1. DESKTOP 1920x900
    // =========================================================================
    console.log("\n>>> DESKTOP 1920x900 VERIFICATION...");
    await setViewport(ws, 1920, 900, false);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Chapter 02: Brand Identity (Nexa)
    console.log("Capturing Chapter 02: Brand Identity (Nexa)...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-identity #showcase-nexa");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-02-brand-identity-nexa-1920.jpg");

    // Chapter 03: UI/UX (CareConnect)
    console.log("Capturing Chapter 03: CareConnect Demo...");
    const careInfo = await evaluate(ws, `(() => {
      const section = document.querySelector("#intro-uiux");
      if (!section) return null;
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      const height = section.offsetHeight;
      const targetY = top + Math.max(0, height - 900);
      window.scrollTo(0, targetY);
      return { top, height, targetY };
    })()`);
    await sleep(700);
    await captureScreenshot(ws, "exhibition-03-uiux-careconnect-1920.jpg");

    // Chapter 04: Packaging (Aara)
    console.log("Capturing Chapter 04B: Aara Ritual...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-aara");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-04-packaging-aara-1920.jpg");

    // Chapter 04: Packaging (Glow Bite)
    console.log("Capturing Chapter 04C: Glow Bite...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-glowbite");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-04-packaging-glowbite-1920.jpg");

    // Chapter 05: Social Media (Horizontal Gallery)
    console.log("Capturing Chapter 05: Social Media...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-social");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-05-social-media-horizontal-1920.jpg");

    // =========================================================================
    // 2. MOBILE 390x844
    // =========================================================================
    console.log("\n>>> MOBILE 390x844 VERIFICATION...");
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const mobileAudit = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      
      const aara = document.querySelector("#showcase-aara");
      if (aara) aara.scrollIntoView({ behavior: 'instant', block: 'start' });
      const aaraWidth = aara ? aara.scrollWidth : 0;
      
      return {
        bodyWidth,
        windowWidth,
        aaraWidth,
        zeroOverflow: bodyWidth <= windowWidth && aaraWidth <= windowWidth,
      };
    })()`);
    console.log("Mobile audit results:", mobileAudit);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-mobile-390-aara.jpg");

    await evaluate(ws, `(() => {
      const care = document.querySelector("#intro-uiux");
      if (care) care.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "exhibition-mobile-390-careconnect.jpg");

    ws.close();
    console.log("\nAll screenshots captured and saved to artifact directory.");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    chromeProc.kill();
  }
}

main();

