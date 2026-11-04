const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9224;

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

async function runEditorialQA() {
  console.log("=== Launching Chrome for Editorial Packaging Hero QA ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--mute-audio"
  ]);

  let pageTarget = null;
  for (let i = 0; i < 20; i++) {
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
  await sleep(3500); // Wait for fonts and hydration

  // =========================================================================
  // 1. Desktop 1440x900 First Visible Frame (Static Editorial Exhibition)
  // =========================================================================
  console.log("\n--- 1. Testing Desktop 1440x900 Static Frame ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const shot1440 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-static-hero.png"), Buffer.from(shot1440.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-static-hero.png");

  // =========================================================================
  // 2. Tablet 1024x768 First Visible Frame
  // =========================================================================
  console.log("\n--- 2. Testing Tablet 1024x768 Static Frame ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1024,
    height: 768,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const shot1024 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1024-static-hero.png"), Buffer.from(shot1024.data, 'base64'));
  console.log("✓ Saved packaging-qa-1024-static-hero.png");

  // =========================================================================
  // 3. Mobile 390x844 First Visible Frame (Stacked Layout)
  // =========================================================================
  console.log("\n--- 3. Testing Mobile 390x844 Stacked Layout ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const shot390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-390-static-hero.png"), Buffer.from(shot390.data, 'base64'));
  console.log("✓ Saved packaging-qa-390-static-hero.png");

  // Check mobile overflow
  const overflowCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("Mobile overflow check:", overflowCheck.result.value);

  // =========================================================================
  // 4. Desktop Scroll Transition & Explorer
  // =========================================================================
  console.log("\n--- 4. Testing Desktop Scroll Transition & Interactivity ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  // Scroll to #packaging start
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  // Push scroll forward into Phase 2 (camera push toward Progelato)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'instant' });`
  });
  await sleep(1000);

  const pushShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-push-transition.png"), Buffer.from(pushShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-push-transition.png");

  // Scroll into Phase 3 (Progelato explorer settled)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });`
  });
  await sleep(1000);

  const settledShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-progelato-settled.png"), Buffer.from(settledShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-progelato-settled.png");

  // Test Flavour Swap: Click Mastana Mango
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Mastana Mango'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(600);
  const flavourShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-flavour-swap.png"), Buffer.from(flavourShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-flavour-swap.png");

  // Test Flat Artwork Toggle
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('View Flat Artwork'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(600);
  const flatShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-flat-dieline.png"), Buffer.from(flatShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-flat-dieline.png");

  // Toggle back to Mockup
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('View Mockup'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(400);

  // =========================================================================
  // 5. Scroll to 03B Aara Tea Packaging
  // =========================================================================
  console.log("\n--- 5. Testing Transition to 03B Aara ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const aaraShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-aara-settled.png"), Buffer.from(aaraShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-aara-settled.png");

  // =========================================================================
  // 6. Test Pause Motion Toggle
  // =========================================================================
  console.log("\n--- 6. Testing Pause Motion Button ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Pause motion'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(500);

  const pauseMotionShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-pause-motion.png"), Buffer.from(pauseMotionShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-pause-motion.png");

  console.log("\nConsole errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  } else {
    console.log("✓ Zero console errors across all tested interactions!");
  }

  // Close Chrome
  ws.close();
  chromeProc.kill();
  console.log("Editorial QA test complete!");
}

runEditorialQA().catch((err) => {
  console.error(err);
  process.exit(1);
});

