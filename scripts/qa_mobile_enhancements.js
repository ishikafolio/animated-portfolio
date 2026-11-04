const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9226;

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

async function runMobileQA() {
  console.log("=== Launching Chrome for Mobile Portfolio QA ===");

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
  await sleep(3500); // Wait for fonts and hydration

  // =========================================================================
  // VIEWPORT 1: 390 × 844 px (iPhone 12/13/14 Standard)
  // =========================================================================
  console.log("\n=======================================================");
  console.log("--- 1. Testing Mobile 390x844 (Primary Mobile Viewport) ---");
  console.log("=======================================================");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(500);

  // A. Chapter 01: Logo Folio Mobile Entrance
  console.log("Testing Chapter 01 Logo Folio Mobile Entrance...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shotLogo390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-390-01-logo-folio.png"), Buffer.from(shotLogo390.data, 'base64'));
  console.log("✓ Saved mobile-qa-390-01-logo-folio.png");

  // B. Chapter 02: UI/UX CareConnect Mobile Entrance
  console.log("Testing Chapter 02 UI/UX CareConnect Mobile Entrance...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shotUiux390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-390-02-uiux-careconnect.png"), Buffer.from(shotUiux390.data, 'base64'));
  console.log("✓ Saved mobile-qa-390-02-uiux-careconnect.png");

  // C. Chapter 03: Packaging Design Hero & Links
  console.log("Testing Chapter 03 Packaging Design Hero & Links...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shotPack390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-390-03-packaging-hero.png"), Buffer.from(shotPack390.data, 'base64'));
  console.log("✓ Saved mobile-qa-390-03-packaging-hero.png");

  // D. Check Hero Links Dimensions & Styling (Easy to spot & tap)
  const aaraLinkMetrics = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const link = document.querySelector('a[href="#showcase-aara"]');
      if (!link) return null;
      const rect = link.getBoundingClientRect();
      const style = window.getComputedStyle(link);
      return {
        width: rect.width,
        height: rect.height,
        color: style.color,
        backgroundColor: style.backgroundColor,
        textDecoration: style.textDecorationLine,
        isTappable: rect.height >= 44 && rect.width >= 100
      };
    })()`,
    returnByValue: true
  });
  console.log("Aara Hero Link Metrics (390px):", aaraLinkMetrics.result.value);

  // E. Tap the Aara link to jump to #showcase-aara
  console.log("Tapping '03B · Aara — Tea & Stillness' link...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const link = document.querySelector('a[href="#showcase-aara"]');
      if (link) link.click();
    })()`
  });
  await sleep(800);

  const shotAaraJump390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-390-04-aara-tapped-entrance.png"), Buffer.from(shotAaraJump390.data, 'base64'));
  console.log("✓ Saved mobile-qa-390-04-aara-tapped-entrance.png");

  // F. Check Aara Podium & Contrast
  const aaraBackdropCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const heading = document.querySelector('#showcase-aara h2');
      const bridge = document.querySelector('#showcase-aara .group');
      const img = bridge ? bridge.querySelector('img') : null;
      return {
        headingText: heading ? heading.textContent.trim() : null,
        hasBackdropSpotlight: Boolean(bridge && bridge.querySelector('div[style*="radial-gradient"]')),
        imageSrc: img ? img.src : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Aara Mobile Details (390px):", aaraBackdropCheck.result.value);

  // G. Test Upward Scroll from Aara back to Hero
  console.log("Testing reverse upward scroll on mobile...");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -400, behavior: 'instant' });`
  });
  await sleep(500);
  const shotReverse390 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-390-05-reverse-scroll.png"), Buffer.from(shotReverse390.data, 'base64'));
  console.log("✓ Saved mobile-qa-390-05-reverse-scroll.png");

  // Check 390px overflow
  const overflow390 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("390px Overflow Check:", overflow390.result.value);

  // =========================================================================
  // VIEWPORT 2: 360 × 740 px (Small Android / Compact Mobile)
  // =========================================================================
  console.log("\n=======================================================");
  console.log("--- 2. Testing Compact Mobile 360x740 ---");
  console.log("=======================================================");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 740,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot360Hero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-360-packaging-hero.png"), Buffer.from(shot360Hero.data, 'base64'));
  console.log("✓ Saved mobile-qa-360-packaging-hero.png");

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot360Aara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-360-aara-podium.png"), Buffer.from(shot360Aara.data, 'base64'));
  console.log("✓ Saved mobile-qa-360-aara-podium.png");

  const overflow360 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("360px Overflow Check:", overflow360.result.value);

  // =========================================================================
  // VIEWPORT 3: 430 × 932 px (iPhone 14/15 Pro Max / Large Mobile)
  // =========================================================================
  console.log("\n=======================================================");
  console.log("--- 3. Testing Large Mobile 430x932 ---");
  console.log("=======================================================");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 430,
    height: 932,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot430Hero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-430-packaging-hero.png"), Buffer.from(shot430Hero.data, 'base64'));
  console.log("✓ Saved mobile-qa-430-packaging-hero.png");

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);

  const shot430Aara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-430-aara-podium.png"), Buffer.from(shot430Aara.data, 'base64'));
  console.log("✓ Saved mobile-qa-430-aara-podium.png");

  const overflow430 = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("430px Overflow Check:", overflow430.result.value);

  // =========================================================================
  // 4. PAUSE MOTION / REDUCED MOTION TEST ON MOBILE
  // =========================================================================
  console.log("\n=======================================================");
  console.log("--- 4. Testing Pause Motion on Mobile 390x844 ---");
  console.log("=======================================================");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.0,
    mobile: true,
    hasTouch: true
  });
  await sleep(400);

  // Click Pause Motion button
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Pause motion'));
      if (btn) btn.click();
    })()`
  });
  await sleep(800);

  // Scroll to Aara with pause motion enabled
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  const shotPauseMobile = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "mobile-qa-pause-motion-aara.png"), Buffer.from(shotPauseMobile.data, 'base64'));
  console.log("✓ Saved mobile-qa-pause-motion-aara.png");

  console.log("\nConsole errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  } else {
    console.log("✓ Zero console errors across all tested mobile interactions!");
  }

  ws.close();
  chromeProc.kill();
  console.log("\n=== Mobile QA tests completed successfully! ===");
}

runMobileQA().catch((err) => {
  console.error("Mobile QA Error:", err);
  process.exit(1);
});

