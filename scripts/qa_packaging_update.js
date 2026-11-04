const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;

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

async function runQA() {
  console.log("=== Launching Chrome for Packaging Chapter QA ===");

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
  await sleep(3000); // Wait for fonts and hydration

  // 1. Set Desktop 1440x900 viewport
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  console.log("\n--- Testing Packaging Chapter 03 ---");

  // Step 1: Scroll to #packaging start (Phase 1: Dual Podium Hero + Typography)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const heroIntro = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-01-hero-intro.png"), Buffer.from(heroIntro.data, 'base64'));
  console.log("✓ Saved packaging-qa-01-hero-intro.png");

  // Step 2: Scroll into Phase 2 (Camera push toward left podium)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'instant' });`
  });
  await sleep(1000);

  const podiumPush = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-02-podium-push.png"), Buffer.from(podiumPush.data, 'base64'));
  console.log("✓ Saved packaging-qa-02-podium-push.png");

  // Step 3: Scroll to Phase 3 (Progelato Explorer Settled on reusable stage)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });`
  });
  await sleep(1000);

  const explorerSettled = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-03-progelato-settled.png"), Buffer.from(explorerSettled.data, 'base64'));
  console.log("✓ Saved packaging-qa-03-progelato-settled.png");

  // Step 4: Test 7 flavour swaps
  console.log("Testing flavour swaps...");
  const flavourButtons = [
    "Butterly Crunch",
    "Chocolicious",
    "Cookieej",
    "Creamy Strawberry",
    "Mastana Mango",
    "Shahi Zaffran",
    "Blueberry Muffin"
  ];

  for (const name of flavourButtons) {
    await sendCDP(ws, "Runtime.evaluate", {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('${name}'));
          if (btn) btn.click();
        })()
      `
    });
    await sleep(400);
  }

  // Click Mastana Mango for screenshot
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
  const mangoShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-04-flavour-mango.png"), Buffer.from(mangoShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-04-flavour-mango.png");

  // Step 5: Test "View Flat Artwork" toggle
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
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-05-flat-dieline.png"), Buffer.from(flatShot.data, 'base64'));
  console.log("✓ Saved packaging-qa-05-flat-dieline.png");

  // Toggle back to mockup
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

  // Step 6: Scroll to Aara (#showcase-aara)
  console.log("Testing transition into 03B Aara Tea Packaging...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(1000);

  const aaraSettled = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-06-aara-settled.png"), Buffer.from(aaraSettled.data, 'base64'));
  console.log("✓ Saved packaging-qa-06-aara-settled.png");

  // Click through Aara ritual objects
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.ritual-options button'));
        if (btns[1]) btns[1].click(); // Botanical carton
      })()
    `
  });
  await sleep(500);

  // Click Take a quiet moment
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector('.ritual-start');
        if (btn) btn.click();
      })()
    `
  });
  await sleep(600);
  const aaraQuiet = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-07-aara-quiet-moment.png"), Buffer.from(aaraQuiet.data, 'base64'));
  console.log("✓ Saved packaging-qa-07-aara-quiet-moment.png");

  // Step 7: Mobile Viewport 390x844
  console.log("\n--- Testing Mobile Viewport (390x844) ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true
  });
  await sleep(500);

  // Scroll to #packaging on mobile
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const mobileHero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-mobile-01-hero.png"), Buffer.from(mobileHero.data, 'base64'));
  console.log("✓ Saved packaging-qa-mobile-01-hero.png");

  // Check horizontal overflow on mobile
  const overflowCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("Mobile overflow check:", overflowCheck.result.value);

  // Scroll to Progelato shelf on mobile
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const mobileShelf = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-mobile-02-shelf.png"), Buffer.from(mobileShelf.data, 'base64'));
  console.log("✓ Saved packaging-qa-mobile-02-shelf.png");

  // Scroll to Aara on mobile
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const mobileAara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-mobile-03-aara.png"), Buffer.from(mobileAara.data, 'base64'));
  console.log("✓ Saved packaging-qa-mobile-03-aara.png");

  console.log("\nConsole errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  } else {
    console.log("✓ Zero console errors across all tested interactions!");
  }

  // Close Chrome
  ws.close();
  chromeProc.kill();
  console.log("QA test complete!");
}

runQA().catch((err) => {
  console.error(err);
  process.exit(1);
});

