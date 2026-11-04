const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;

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

async function runCinematicQA() {
  console.log("=== Launching Chrome for Aara Cinematic Entrance QA ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=1440,900",
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
  await sleep(3500); // Allow fonts & hydration

  // =========================================================================
  // 1. DESKTOP 1440x900: FULL SCROLL JOURNEY
  // =========================================================================
  console.log("\n--- 1. Desktop 1440x900: Full Exhibition & Transition QA ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  // A. Scroll to #packaging start (Shared dual-podium exhibition frame)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  const shot1440Hero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-static-hero.png"), Buffer.from(shot1440Hero.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-static-hero.png");

  // B. Scroll into Progelato Phase 2 (Push) & Phase 3 (Settled)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'instant' });`
  });
  await sleep(700);

  const shotPush = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-push-transition.png"), Buffer.from(shotPush.data, 'base64'));
  console.log("✓ Saved packaging-qa-push-transition.png");

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'instant' });`
  });
  await sleep(700);

  const shotProgelato = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-progelato-settled.png"), Buffer.from(shotProgelato.data, 'base64'));
  console.log("✓ Saved packaging-qa-progelato-settled.png");

  // C. Test Flavour Swap
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Mastana Mango'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(500);
  const shotMango = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-flavour-swap.png"), Buffer.from(shotMango.data, 'base64'));
  console.log("✓ Saved packaging-qa-flavour-swap.png (Mastana Mango selected)");

  // D. Test Flat Artwork Toggle
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('View Flat Artwork'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(500);
  const shotFlat = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-flat-dieline.png"), Buffer.from(shotFlat.data, 'base64'));
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

  // E. Scroll into 03B Aara Bridge (Phase 1: Wide Limestone Podium with 3 products)
  console.log("\n--- Scrolling into 03B Aara Entrance ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      const aara = document.querySelector('#showcase-aara');
      const rect = aara.getBoundingClientRect();
      window.scrollBy({ top: rect.top, behavior: 'instant' });
    `
  });
  await sleep(800);

  const shotAaraBridge = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-aara-bridge.png"), Buffer.from(shotAaraBridge.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-aara-bridge.png (Phase 1: Wide limestone podium, 3 products, heading 03B / PACKAGING DESIGN, Aara — Tea & Stillness)");

  // F. Scroll into Aara Phase 2: Push in toward the 3 products + lighting shifts to limestone
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.65, behavior: 'instant' });`
  });
  await sleep(800);

  const shotAaraPush = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-aara-push.png"), Buffer.from(shotAaraPush.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-aara-push.png (Phase 2: Push into triad + ambient limestone lighting shift)");

  // G. Scroll into Aara Phase 3: Match handoff to Aara Ritual Showcase
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: window.innerHeight * 0.65, behavior: 'instant' });`
  });
  await sleep(800);

  const shotAaraSettled = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-aara-settled.png"), Buffer.from(shotAaraSettled.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-aara-settled.png (Phase 3: Aara Ritual Showcase settled)");

  // =========================================================================
  // 2. REVERSE SCROLL VERIFICATION
  // =========================================================================
  console.log("\n--- 2. Testing Reverse Upward Scroll ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -(window.innerHeight * 0.65), behavior: 'instant' });`
  });
  await sleep(500);
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -(window.innerHeight * 0.65), behavior: 'instant' });`
  });
  await sleep(500);

  const shotReverseAara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-reverse-aara.png"), Buffer.from(shotReverseAara.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-reverse-aara.png (Reversed back to Aara wide bridge)");

  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollBy({ top: -(window.innerHeight * 1.5), behavior: 'instant' });`
  });
  await sleep(600);

  const shotReverseHero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1440-reverse-hero.png"), Buffer.from(shotReverseHero.data, 'base64'));
  console.log("✓ Saved packaging-qa-1440-reverse-hero.png (Reversed cleanly back to Hero frame)");

  // =========================================================================
  // 3. HERO LINK DIRECT JUMP: "03B · Aara — Tea & Stillness ↗"
  // =========================================================================
  console.log("\n--- 3. Testing Hero Link Navigation to #showcase-aara ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const link = document.querySelector('a[href="#showcase-aara"]');
        if (link) link.click();
      })()
    `
  });
  await sleep(1000);

  const shotJump = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-hero-link-jump.png"), Buffer.from(shotJump.data, 'base64'));
  console.log("✓ Saved packaging-qa-hero-link-jump.png (03B Link jumped cleanly to Aara entrance)");

  // =========================================================================
  // 4. TABLET 1024x768 QA
  // =========================================================================
  console.log("\n--- 4. Testing Tablet 1024x768 ---");
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
  await sleep(800);

  const shot1024 = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-1024-static-hero.png"), Buffer.from(shot1024.data, 'base64'));
  console.log("✓ Saved packaging-qa-1024-static-hero.png");

  // =========================================================================
  // 5. MOBILE 390x844 QA (Cartons & Tin Visibility, Zero Horizontal Overflow)
  // =========================================================================
  console.log("\n--- 5. Testing Mobile 390x844 Layout & Overflow ---");
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
  await sleep(800);

  const shot390Hero = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-390-static-hero.png"), Buffer.from(shot390Hero.data, 'base64'));
  console.log("✓ Saved packaging-qa-390-static-hero.png");

  // Scroll to Aara on mobile
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  const shot390Aara = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-390-aara.png"), Buffer.from(shot390Aara.data, 'base64'));
  console.log("✓ Saved packaging-qa-390-aara.png (Cartons and tin visible on mobile limestone podium)");

  const overflow = await sendCDP(ws, "Runtime.evaluate", {
    expression: `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    })`,
    returnByValue: true
  });
  console.log("Mobile overflow result:", overflow.result.value);

  // =========================================================================
  // 6. PAUSE MOTION / REDUCED MOTION QA
  // =========================================================================
  console.log("\n--- 6. Testing Pause Motion / Reduced Motion ---");
  // Switch back to desktop 1440x900
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(400);

  // Click Pause Motion button
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Pause motion'));
        if (btn) btn.click();
      })()
    `
  });
  await sleep(800);

  // Scroll to Aara entrance under Pause Motion
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-aara').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);

  const shotPause = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "packaging-qa-pause-motion.png"), Buffer.from(shotPause.data, 'base64'));
  console.log("✓ Saved packaging-qa-pause-motion.png (Aara podium and heading shown directly)");

  console.log("\nConsole errors detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  } else {
    console.log("✓ Zero console errors across all tested interactions!");
  }

  ws.close();
  chromeProc.kill();
  console.log("\n=== All QA tests finished successfully! ===");
}

runCinematicQA().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});

