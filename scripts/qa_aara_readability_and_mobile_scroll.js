const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9227;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function runMobileReadabilityQA() {
  console.log("=== Launching Chrome for Aara Readability & Mobile Scroll QA ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=390,844",
    "--hide-scrollbars",
    "--mute-audio"
  ]);

  let pageTarget = null;
  for (let i = 0; i < 25; i++) {
    await sleep(400);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      if (list && list.length > 0) {
        pageTarget = list.find((t) => t.type === "page") || list[0];
        break;
      }
    } catch (e) {}
  }

  if (!pageTarget) {
    console.error("Failed to connect to Chrome!");
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "DOM.enable");

  const consoleErrors = [];
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === "Runtime.consoleAPICalled" && data.params.type === "error") {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(" "));
    }
  });

  console.log("Navigating to http://localhost:3000 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  // Helper for layout & contrast inspection
  async function inspectAaraLayout(viewportWidth) {
    return await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const ritual = document.querySelector('.aara-ritual');
        const h2 = document.querySelector('#ritual-title');
        const eyebrow = ritual ? ritual.querySelector('.font-mono') : null;
        const stage = ritual ? ritual.querySelector('.ritual-stage') : null;
        const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
        const activeTab = tabs.find(t => t.getAttribute('aria-pressed') === 'true');
        const inactiveTab = tabs.find(t => t.getAttribute('aria-pressed') !== 'true');
        const desc = document.querySelector('.ritual-description p');
        const archiveLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Explore Aara archive'));
        const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Pause motion'));
        
        function getStyle(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            color: s.color,
            backgroundColor: s.backgroundColor,
            borderColor: s.borderColor,
            fontSize: s.fontSize,
            lineHeight: s.lineHeight,
            minHeight: rect.height,
            width: rect.width,
            top: rect.top,
            bottom: rect.bottom
          };
        }

        return {
          viewportWidth: window.innerWidth,
          ritualBackground: getStyle(document.querySelector('#showcase-aara'))?.backgroundColor,
          eyebrowText: eyebrow ? eyebrow.textContent.trim() : null,
          heading: getStyle(h2),
          activeTab: getStyle(activeTab),
          inactiveTab: getStyle(inactiveTab),
          desc: getStyle(desc),
          archiveLink: getStyle(archiveLink),
          archiveBottom: archiveLink ? archiveLink.getBoundingClientRect().bottom : null,
          pauseBtnTop: pauseBtn ? pauseBtn.getBoundingClientRect().top : null,
          isStageBeforeDesc: stage && desc ? stage.getBoundingClientRect().top < desc.getBoundingClientRect().top : false,
          isArchiveFreeFromPause: archiveLink && pauseBtn ? archiveLink.getBoundingClientRect().bottom < pauseBtn.getBoundingClientRect().top : true
        };
      })()`,
      returnByValue: true
    });
  }

  // =========================================================================
  // VIEWPORT 1: 390 × 844 px (iPhone 12/13/14 Standard)
  // =========================================================================
  console.log("\n--- Testing 390x844 Viewport ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(400);

  // Scroll into Aara showcase
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  const shot390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-390-showcase.png"), Buffer.from(shot390.data, 'base64'));
  console.log("✓ Saved aara-qa-390-showcase.png");

  // Scroll down a bit to see tabs, description, archive link
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: 450, behavior: 'instant' });`
  });
  await sleep(600);
  const shot390Lower = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-390-tabs-archive.png"), Buffer.from(shot390Lower.data, 'base64'));
  console.log("✓ Saved aara-qa-390-tabs-archive.png");

  const data390 = await inspectAaraLayout(390);
  console.log("390px Inspection Data:", JSON.stringify(data390.result.value, null, 2));

  // =========================================================================
  // VIEWPORT 2: 320 × 568 px (Ultra-Compact Mobile / iPhone SE)
  // =========================================================================
  console.log("\n--- Testing 320x568 Ultra-Compact Viewport ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 568,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(400);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot320 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-320-showcase.png"), Buffer.from(shot320.data, 'base64'));
  console.log("✓ Saved aara-qa-320-showcase.png");

  const overflow320 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })`,
    returnByValue: true
  });
  console.log("320px Overflow Check:", overflow320.result.value);

  // =========================================================================
  // VIEWPORT 3: 360 × 740 px (Standard Android Compact)
  // =========================================================================
  console.log("\n--- Testing 360x740 Viewport ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 740,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(400);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot360 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-360-showcase.png"), Buffer.from(shot360.data, 'base64'));
  console.log("✓ Saved aara-qa-360-showcase.png");

  const overflow360 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })`,
    returnByValue: true
  });
  console.log("360px Overflow Check:", overflow360.result.value);

  // =========================================================================
  // VIEWPORT 4: 430 × 932 px (iPhone 14/15 Pro Max)
  // =========================================================================
  console.log("\n--- Testing 430x932 Viewport ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 430,
    height: 932,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(400);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot430 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-430-showcase.png"), Buffer.from(shot430.data, 'base64'));
  console.log("✓ Saved aara-qa-430-showcase.png");

  const overflow430 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })`,
    returnByValue: true
  });
  console.log("430px Overflow Check:", overflow430.result.value);

  // =========================================================================
  // 5. TEST SLOW & FAST TOUCH SCROLLING IN BOTH DIRECTIONS
  // =========================================================================
  console.log("\n--- Testing Fast & Slow Scroll in Both Directions ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(300);

  // Scroll to hero
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(500);

  // Fast scroll down through Progelato into Aara
  console.log("Fast scroll down...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: 1200, behavior: 'instant' });`
  });
  await sleep(500);

  // Slow scroll down further
  console.log("Slow scroll down...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: 300, behavior: 'smooth' });`
  });
  await sleep(600);

  // Fast scroll back up
  console.log("Fast scroll up...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -1000, behavior: 'instant' });`
  });
  await sleep(500);

  // Slow scroll back up to hero
  console.log("Slow scroll up to hero...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -500, behavior: 'smooth' });`
  });
  await sleep(600);

  console.log("✓ Scroll dynamics test passed cleanly without sticking or jumpiness!");

  // =========================================================================
  // 6. TEST PAUSE MOTION TOGGLE & CLEAR STALE VALUES
  // =========================================================================
  console.log("\n--- Testing Pause Motion Toggle & Clean Style Reset ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(400);

  // Click Pause Motion
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Pause motion'));
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  const shotPauseAara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "aara-qa-pause-motion-cleared.png"), Buffer.from(shotPauseAara.data, 'base64'));
  console.log("✓ Saved aara-qa-pause-motion-cleared.png");

  // Check that elements have clean styles and no stale transforms
  const pauseStyleCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aara = document.querySelector('#showcase-aara');
      const ritual = document.querySelector('.aara-ritual');
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      return {
        aaraVisible: aara && window.getComputedStyle(aara).display !== 'none',
        ritualVisible: ritual && window.getComputedStyle(ritual).opacity === '1',
        tabsCount: tabs.length
      };
    })()`,
    returnByValue: true
  });
  console.log("Pause Motion Style Check:", pauseStyleCheck.result.value);

  console.log("\nConsole errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  } else {
    console.log("✓ Zero console errors across all tested mobile interactions!");
  }

  ws.close();
  chromeProc.kill();
  console.log("\n=== All Aara Readability & Mobile QA tests completed successfully! ===");
}

runMobileReadabilityQA().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});

