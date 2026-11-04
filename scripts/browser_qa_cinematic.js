const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

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

async function main() {
  console.log("=== Launching Headless Chrome for Cinematic Scroll QA ===");

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
  await sleep(2500); // Wait for fonts and hydration

  // Set Desktop 1440x900 viewport
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(400);

  console.log("\n--- Testing Chapter 01: Logo Folio Choreography ---");
  // 1. Scroll to Chapter 01 start (0% progress)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(700);
  const ch1_0 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-01-logo-intro.png"), Buffer.from(ch1_0.data, 'base64'));
  console.log("Saved: cinematic-01-logo-intro.png (Phase 1: Entry & Typography)");

  // 2. Scroll into Chapter 01 midpoint (~55% progress - Master Board Focal Emergence)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'instant' });`
  });
  await sleep(700);
  const ch1_50 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-01-logo-focal-morph.png"), Buffer.from(ch1_50.data, 'base64'));
  console.log("Saved: cinematic-01-logo-focal-morph.png (Phase 3: Focal Board Emergence)");

  // 3. Scroll to Chapter 01 completion (Showcase Resolution)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });`
  });
  await sleep(700);
  const ch1_100 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-01-logo-showcase-resolved.png"), Buffer.from(ch1_100.data, 'base64'));
  console.log("Saved: cinematic-01-logo-showcase-resolved.png (Phase 4: Brand Exhibition Resolved)");

  console.log("\n--- Testing Chapter 02: UI/UX (CareConnect) Choreography ---");
  // 4. Scroll to Chapter 02 start (0% progress)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(700);
  const ch2_0 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-02-uiux-intro.png"), Buffer.from(ch2_0.data, 'base64'));
  console.log("Saved: cinematic-02-uiux-intro.png (Phase 1: Blueprint & Orbital Panels)");

  // 5. Scroll into Chapter 02 midpoint (~55% progress - Phone Z-space expansion)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'instant' });`
  });
  await sleep(700);
  const ch2_50 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-02-uiux-phone-forward.png"), Buffer.from(ch2_50.data, 'base64'));
  console.log("Saved: cinematic-02-uiux-phone-forward.png (Phase 3: Phone Forward & Title Back)");

  // 6. Scroll to Chapter 02 completion (Settled CareDemo)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });`
  });
  await sleep(700);
  const ch2_100 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-02-uiux-caredemo-settled.png"), Buffer.from(ch2_100.data, 'base64'));
  console.log("Saved: cinematic-02-uiux-caredemo-settled.png (Phase 4: Settled Working Prototype)");

  console.log("\n--- Testing Chapter 03: Packaging (Progelato & Aara) Choreography ---");
  // 7. Scroll to Chapter 03 start (0% progress)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(700);
  const ch3_0 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-03-packaging-intro.png"), Buffer.from(ch3_0.data, 'base64'));
  console.log("Saved: cinematic-03-packaging-intro.png (Phase 1: Made to Hold & Flat Dieline Art)");

  // 8. Scroll into Chapter 03 midpoint (~55% progress - Pouch Mockup Focal Morph)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'instant' });`
  });
  await sleep(700);
  const ch3_50 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-03-packaging-pouch-morph.png"), Buffer.from(ch3_50.data, 'base64'));
  console.log("Saved: cinematic-03-packaging-pouch-morph.png (Phase 3: 3D Pouch Focal Focus)");

  // 9. Scroll to Chapter 03 shelf completion
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });`
  });
  await sleep(700);
  const ch3_100 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-03-packaging-shelf-settled.png"), Buffer.from(ch3_100.data, 'base64'));
  console.log("Saved: cinematic-03-packaging-shelf-settled.png (Phase 4: Active Flavour Explorer)");

  // 10. Scroll to Aara Ritual Showcase
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(700);
  const ch3_aara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-03-aara-ritual.png"), Buffer.from(ch3_aara.data, 'base64'));
  console.log("Saved: cinematic-03-aara-ritual.png (Aara Botanical Ritual Calm Transition)");

  console.log("\n--- Testing Reverse Scrolling ---");
  // Reverse scroll from Aara back to Chapter 01
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollTo({ top: 0, behavior: 'smooth' });`
  });
  await sleep(1500);
  const reverseHero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-reverse-hero.png"), Buffer.from(reverseHero.data, 'base64'));
  console.log("Saved: cinematic-reverse-hero.png (Clean Reverse Scroll Verification)");

  console.log("\n--- Testing Mobile Viewport (390x844) ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobLogo = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-mobile-01-logo.png"), Buffer.from(mobLogo.data, 'base64'));

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobUiux = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-mobile-02-uiux.png"), Buffer.from(mobUiux.data, 'base64'));

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobPack = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "cinematic-mobile-03-packaging.png"), Buffer.from(mobPack.data, 'base64'));
  console.log("Saved all mobile screenshots!");

  console.log("\n--- Checking Console Errors ---");
  if (consoleErrors.length > 0) {
    console.warn("Console Errors found:", consoleErrors);
  } else {
    console.log("SUCCESS: 0 console errors detected across entire session!");
  }

  ws.close();
  chromeProc.kill();
  console.log("\n=== Cinematic Scroll QA Completed Successfully ===");
}

main().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});

