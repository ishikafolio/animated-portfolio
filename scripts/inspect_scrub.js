const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9330;

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
    console.log(`Saved screenshot: ${filename}`);
  } catch (err) {
    console.warn(`Screenshot error:`, err.message);
  }
}

async function main() {
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

    await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Let's scroll through the CareConnect sequence
    const careMetrics = await evaluate(ws, `(() => {
      const section = document.querySelector("#intro-uiux");
      if (!section) return { error: "no section" };
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      const height = section.offsetHeight;
      return { top, height };
    })()`);
    console.log("CareConnect section coordinates:", careMetrics);

    // Scroll to 25%, 50%, 75%, 95% of CareConnect pinned timeline
    const steps = [0.0, 0.3, 0.6, 0.85, 1.0];
    for (const step of steps) {
      const targetY = careMetrics.top + Math.max(0, careMetrics.height - 900) * step;
      await evaluate(ws, `window.scrollTo(0, ${targetY})`);
      await sleep(600);
      const metrics = await evaluate(ws, `(() => {
        const phone = document.querySelector(".care-phone-wrap");
        const card = document.querySelector(".uiux-stage [class*='bg-[#FAF8FC]']");
        const stage = document.querySelector(".uiux-stage");
        const footer = stage ? stage.querySelector("footer") : null;
        const phoneRect = phone ? phone.getBoundingClientRect() : null;
        const cardRect = card ? card.getBoundingClientRect() : null;
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        return {
          step: ${step},
          phoneTop: phoneRect ? phoneRect.top : null,
          phoneBottom: phoneRect ? phoneRect.bottom : null,
          phoneHeight: phoneRect ? phoneRect.height : null,
          cardTop: cardRect ? cardRect.top : null,
          cardBottom: cardRect ? cardRect.bottom : null,
          cardHeight: cardRect ? cardRect.height : null,
          footerTop: footerRect ? footerRect.top : null,
          gap: (phoneRect && cardRect) ? (phoneRect.left - cardRect.right) : null,
          phoneCenterY: phoneRect ? (phoneRect.top + phoneRect.bottom) / 2 : null,
          cardCenterY: cardRect ? (cardRect.top + cardRect.bottom) / 2 : null,
        };
      })()`);
      console.log(`CareConnect at progress ${step}:`, metrics);
      await captureScreenshot(ws, `careconnect-scrub-${Math.round(step * 100)}.jpg`);
    }

    // Now let's test Aara Showcase
    const aaraMetrics = await evaluate(ws, `(() => {
      const section = document.querySelector("#showcase-aara");
      if (!section) return { error: "no aara section" };
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      const height = section.offsetHeight;
      return { top, height };
    })()`);
    console.log("Aara section coordinates:", aaraMetrics);

    await evaluate(ws, `window.scrollTo(0, ${aaraMetrics.top})`);
    await sleep(600);
    const aaraLayout = await evaluate(ws, `(() => {
      const section = document.querySelector("#showcase-aara");
      const stage = section ? section.querySelector(".ritual-stage") : null;
      const details = section ? section.querySelector(".ritual-details") : null;
      const footer = section ? section.querySelector("footer") : null;
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      const detailsRect = details ? details.getBoundingClientRect() : null;
      const footerRect = footer ? footer.getBoundingClientRect() : null;
      return {
        stageRect: stageRect ? { width: stageRect.width, height: stageRect.height, top: stageRect.top, left: stageRect.left } : null,
        detailsRect: detailsRect ? { width: detailsRect.width, height: detailsRect.height, top: detailsRect.top, left: detailsRect.left } : null,
        footerRect: footerRect ? { width: footerRect.width, height: footerRect.height, top: footerRect.top } : null,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      };
    })()`);
    console.log("Aara desktop layout details:", aaraLayout);
    await captureScreenshot(ws, "aara-settled-1920.jpg");

    ws.close();
  } catch (err) {
    console.error("Scrub error:", err);
  } finally {
    chromeProc.kill();
  }
}

main();
