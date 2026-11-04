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
  console.log("=== Starting Chrome Headless QA Session ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--mute-audio"
  ]);

  // Wait for remote debugging endpoint
  let pageTarget = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      if (list && list.length > 0) {
        pageTarget = list.find((t) => t.type === "page") || list[0];
        break;
      }
    } catch (e) {
      // Chrome still starting up
    }
  }

  if (!pageTarget) {
    console.error("Failed to connect to Chrome debugging endpoint!");
    chromeProc.kill();
    process.exit(1);
  }

  console.log("Connected to Chrome. WebSocket:", pageTarget.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.addEventListener('open', resolve));

  // Enable Page, Runtime, DOM
  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "DOM.enable");

  // Track console errors
  const consoleErrors = [];
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === "Runtime.consoleAPICalled" && data.params.type === "error") {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(" "));
    }
  });

  // Navigate to localhost:3000
  console.log("Navigating to http://localhost:3000 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(2500); // Wait for fonts, WebGL canvas, and Next.js hydration

  // 1. Verify DOM Requirements
  console.log("\n--- Checking DOM Requirements ---");
  const evalResult = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const hasWorkSection = !!document.querySelector('#work');
      const hasProjectIndex = !!document.querySelector('.project-index') || document.body.innerText.includes('FOUR WORLDS. ONE CURIOUS MIND.');
      const introLogo = !!document.querySelector('#intro-logo');
      const introUiux = !!document.querySelector('#intro-uiux');
      const introPackaging = !!document.querySelector('#intro-packaging');
      const showcaseLogo = !!document.querySelector('#showcase-logo');
      const showcaseUiux = !!document.querySelector('#showcase-uiux');
      const showcasePackaging = !!document.querySelector('#showcase-packaging');
      const cubaoFonts = document.fonts ? document.fonts.check('16px "Cubao Free"') : 'unsupported';
      const poppinsFonts = document.fonts ? document.fonts.check('16px "Poppins"') : 'unsupported';

      // Check order of sections in DOM
      const mainChildren = Array.from(document.querySelector('main')?.children || []).map(el => el.id || el.tagName);

      return {
        hasWorkSection,
        hasProjectIndex,
        introLogo,
        introUiux,
        introPackaging,
        showcaseLogo,
        showcaseUiux,
        showcasePackaging,
        cubaoFonts,
        poppinsFonts,
        mainChildren,
      };
    })()`,
    returnByValue: true
  });

  const domReport = evalResult.result.value;
  console.log("DOM Verification Report:", JSON.stringify(domReport, null, 2));

  if (domReport.hasProjectIndex) {
    console.error("ERROR: ProjectIndex or 'FOUR WORLDS. ONE CURIOUS MIND.' is still present in DOM!");
  } else {
    console.log("SUCCESS: Duplicate work overview (.project-index) is completely removed!");
  }

  // 2. Desktop Screenshots (1440x900)
  console.log("\n--- Capturing Desktop 1440x900 Screenshots ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(500);

  // A. Hero Screen
  const heroShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-chapter-00-hero-desktop.png"), Buffer.from(heroShot.data, 'base64'));
  console.log("Saved: qa-chapter-00-hero-desktop.png");

  // B. Scroll to Chapter 01 (Logo Folio)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const logoIntroShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-chapter-01-logo-intro.png"), Buffer.from(logoIntroShot.data, 'base64'));
  console.log("Saved: qa-chapter-01-logo-intro.png");

  // C. Scroll to Logo Showcase
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const logoShowcaseShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-showcase-01-logo.png"), Buffer.from(logoShowcaseShot.data, 'base64'));
  console.log("Saved: qa-showcase-01-logo.png");

  // D. Scroll to Chapter 02 (UI/UX)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const uiuxIntroShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-chapter-02-uiux-intro.png"), Buffer.from(uiuxIntroShot.data, 'base64'));
  console.log("Saved: qa-chapter-02-uiux-intro.png");

  // E. Scroll to CareConnect Showcase
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const uiuxShowcaseShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-showcase-02-careconnect.png"), Buffer.from(uiuxShowcaseShot.data, 'base64'));
  console.log("Saved: qa-showcase-02-careconnect.png");

  // F. Scroll to Chapter 03 (Packaging)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const packagingIntroShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-chapter-03-packaging-intro.png"), Buffer.from(packagingIntroShot.data, 'base64'));
  console.log("Saved: qa-chapter-03-packaging-intro.png");

  // G. Scroll to Packaging Showcase (Gelato Shelf)
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#showcase-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(800);
  const packagingShowcaseShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-showcase-03-packaging.png"), Buffer.from(packagingShowcaseShot.data, 'base64'));
  console.log("Saved: qa-showcase-03-packaging.png");

  // 3. Mobile Screenshots (390x844)
  console.log("\n--- Capturing Mobile 390x844 Screenshots ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);

  // A. Mobile Hero
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `window.scrollTo(0, 0);`
  });
  await sleep(600);
  const mobileHeroShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-mobile-00-hero.png"), Buffer.from(mobileHeroShot.data, 'base64'));
  console.log("Saved: qa-mobile-00-hero.png");

  // B. Mobile Chapter 01
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-logo').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobileLogoShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-mobile-01-logo.png"), Buffer.from(mobileLogoShot.data, 'base64'));
  console.log("Saved: qa-mobile-01-logo.png");

  // C. Mobile Chapter 02
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-uiux').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobileUiuxShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-mobile-02-uiux.png"), Buffer.from(mobileUiuxShot.data, 'base64'));
  console.log("Saved: qa-mobile-02-uiux.png");

  // D. Mobile Chapter 03
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `document.querySelector('#intro-packaging').scrollIntoView({ behavior: 'instant' });`
  });
  await sleep(600);
  const mobilePackShot = await sendCDP(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "qa-mobile-03-packaging.png"), Buffer.from(mobilePackShot.data, 'base64'));
  console.log("Saved: qa-mobile-03-packaging.png");

  console.log("\n--- Checking Console Errors ---");
  if (consoleErrors.length > 0) {
    console.warn("Console Errors found:", consoleErrors);
  } else {
    console.log("SUCCESS: 0 console errors detected!");
  }

  // Cleanup
  ws.close();
  chromeProc.kill();
  console.log("\n=== Browser QA Completed Successfully ===");
}

main().catch((err) => {
  console.error("QA Error:", err);
  process.exit(1);
});

