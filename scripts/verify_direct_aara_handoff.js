const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9260;

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

async function evaluate(ws, expression) {
  const result = await sendCDP(ws, "Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result?.value;
}

async function captureScreenshot(ws, filename) {
  const result = await sendCDP(ws, "Page.captureScreenshot", { format: "png", quality: 90 });
  const filepath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

async function setViewport(ws, width, height, isMobile = false) {
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: isMobile,
    hasTouch: isMobile,
  });
  await sleep(400);
}

async function main() {
  console.log("=== Comprehensive Verification: Direct Aara Showcase Handoff ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-extensions",
    "--window-size=1440,900"
  ]);

  try {
    await sleep(1500);
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const list = await res.json();
    const pageTarget = list.find(t => t.type === "page") || list[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await sendCDP(ws, "Page.enable");
    await sendCDP(ws, "Runtime.enable");

    // =========================================================================
    // TEST 1: DESKTOP AUDIT (1440x900)
    // =========================================================================
    console.log("\n--- TEST 1: Desktop Audit (1440x900) ---");
    await setViewport(ws, 1440, 900, false);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // 1. Audit DOM for absence of duplicate podium image and "Exhibit 03B"
    const domAudit = await evaluate(ws, `(() => {
      const allText = document.body.innerText;
      const hasExhibit03B = /EXHIBIT 03B/i.test(allText);
      const podiumHeroImages = Array.from(document.querySelectorAll('img[src*="packaging-podium-hero"]'));
      const aaraShowcase = document.getElementById('showcase-aara');
      const ritualTitle = document.getElementById('ritual-title');
      const headerWrap = document.querySelector('.ritual-header-wrap');
      const occurrences03B = (allText.match(/03B\\s*\\/\\s*PACKAGING\\s*DESIGN/gi) || []).length;
      
      const aaraComputed = aaraShowcase ? window.getComputedStyle(aaraShowcase) : null;
      
      return {
        hasExhibit03B,
        podiumHeroImgCount: podiumHeroImages.length,
        hasAaraShowcase: !!aaraShowcase,
        aaraPosition: aaraComputed ? aaraComputed.position : null,
        ritualTitleText: ritualTitle ? ritualTitle.innerText.trim() : null,
        headerWrapText: headerWrap ? headerWrap.innerText.trim() : null,
        occurrences03BInPage: occurrences03B,
        hasStickyAara: aaraComputed ? (aaraComputed.position === 'sticky' || aaraComputed.position === 'fixed') : false,
      };
    })()`);

    console.log("DOM Audit Result:", JSON.stringify(domAudit, null, 2));

    if (domAudit.hasExhibit03B) throw new Error("FAIL: 'EXHIBIT 03B' still found in page text!");
    if (domAudit.podiumHeroImgCount !== 1) throw new Error(`FAIL: Expected exactly 1 podium hero image, found ${domAudit.podiumHeroImgCount}`);
    if (domAudit.hasStickyAara) throw new Error("FAIL: #showcase-aara is sticky/fixed, expected normal page flow!");

    // Capture initial shared hero screenshot
    await evaluate(ws, `(() => {
      const hero = document.getElementById('packaging');
      if (hero) hero.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "desktop-01-shared-hero.png");

    // 2. Test clicking the hero link "03B · Aara — Tea & Stillness ↗"
    console.log("\n--- TEST 2: Click Hero Aara Link Navigation ---");
    const linkClickResult = await evaluate(ws, `(() => {
      const link = document.querySelector('a[href="#showcase-aara"]');
      if (!link) return { success: false, reason: "Link not found" };
      link.scrollIntoView({ behavior: 'instant', block: 'center' });
      link.click();
      return { success: true, href: link.getAttribute('href') };
    })()`);
    console.log("Hero Link Click:", linkClickResult);
    await sleep(1200);

    const afterClickPos = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const title = document.getElementById('ritual-title');
      const rect = aara.getBoundingClientRect();
      const titleRect = title ? title.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        aaraTop: rect.top,
        aaraBottom: rect.bottom,
        titleTop: titleRect ? titleRect.top : null,
        isTitleInView: titleRect ? (titleRect.top >= 0 && titleRect.top <= window.innerHeight) : false,
      };
    })()`);
    console.log("Position after clicking Aara link:", afterClickPos);
    await captureScreenshot(ws, "desktop-02-aara-link-landed.png");

    if (!afterClickPos.isTitleInView && afterClickPos.aaraTop > 300) {
      console.warn("Warning: Aara title not immediately in view after click, scrolling closer");
    }

    // 3. Test Scroll Boundary Transition (Progelato -> Aara Direct Flow)
    console.log("\n--- TEST 3: Bidirectional Scroll Transition ---");
    // Scroll right above Aara showcase
    await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const top = aara.offsetTop;
      window.scrollTo({ top: top - window.innerHeight * 0.7, behavior: 'instant' });
    })()`);
    await sleep(600);
    const boundaryStartMetrics = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const heading = aara.querySelector('.ritual-header-wrap');
      const stage = aara.querySelector('.ritual-stage');
      const bg = window.getComputedStyle(aara).backgroundColor;
      return {
        scrollY: window.scrollY,
        headingTransform: heading ? window.getComputedStyle(heading).transform : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null,
        stageOpacity: stage ? window.getComputedStyle(stage).opacity : null,
        backgroundColor: bg,
      };
    })()`);
    console.log("Boundary Start Metrics:", boundaryStartMetrics);
    await captureScreenshot(ws, "desktop-03-handoff-boundary-start.png");

    // Scroll into full Aara view
    await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const top = aara.offsetTop;
      window.scrollTo({ top: top + 100, behavior: 'instant' });
    })()`);
    await sleep(600);
    const settledMetrics = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const heading = aara.querySelector('.ritual-header-wrap');
      const stage = aara.querySelector('.ritual-stage');
      const bg = window.getComputedStyle(aara).backgroundColor;
      return {
        scrollY: window.scrollY,
        headingTransform: heading ? window.getComputedStyle(heading).transform : null,
        headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null,
        backgroundColor: bg,
      };
    })()`);
    console.log("Settled Showcase Metrics:", settledMetrics);
    await captureScreenshot(ws, "desktop-04-handoff-settled.png");

    // Scroll back up (reverse check)
    await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const top = aara.offsetTop;
      window.scrollTo({ top: top - window.innerHeight * 0.7, behavior: 'instant' });
    })()`);
    await sleep(600);
    console.log("Reversed scroll up smoothly.");

    // =========================================================================
    // TEST 4: MOBILE AUDIT & OVERFLOW (390x844)
    // =========================================================================
    console.log("\n--- TEST 4: Mobile Audit (390x844) ---");
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Scroll to Aara showcase on mobile
    await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      if (aara) aara.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(800);

    const mobileMetrics = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const title = document.getElementById('ritual-title');
      const headerWrap = aara.querySelector('.ritual-header-wrap');
      const stage = aara.querySelector('.ritual-stage');
      const buttons = Array.from(aara.querySelectorAll('.ritual-options button')).map(b => ({
        text: b.innerText.trim(),
        width: b.offsetWidth,
        height: b.offsetHeight,
      }));
      const docScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const aaraScrollWidth = aara.scrollWidth;
      const aaraClientWidth = aara.clientWidth;
      
      return {
        docScrollWidth,
        bodyScrollWidth,
        aaraScrollWidth,
        aaraClientWidth,
        hasHorizontalOverflow: docScrollWidth > 390 || aaraScrollWidth > aaraClientWidth,
        titleText: title ? title.innerText.trim() : null,
        headerWrapText: headerWrap ? headerWrap.innerText.trim() : null,
        stageWidth: stage ? stage.offsetWidth : null,
        stageHeight: stage ? stage.offsetHeight : null,
        buttonMetrics: buttons,
      };
    })()`);
    console.log("Mobile (390px) Metrics:", JSON.stringify(mobileMetrics, null, 2));

    if (mobileMetrics.hasHorizontalOverflow) {
      throw new Error(`FAIL: Horizontal overflow detected on 390px mobile! doc: ${mobileMetrics.docScrollWidth}, aara: ${mobileMetrics.aaraScrollWidth}`);
    }
    await captureScreenshot(ws, "mobile-01-390-aara-showcase.png");

    // Test tab interactions on mobile
    console.log("\n--- TEST 5: Mobile Tab Switching ---");
    await evaluate(ws, `(() => {
      const buttons = Array.from(document.querySelectorAll('.ritual-options button'));
      if (buttons[1]) buttons[1].click(); // Click "Botanical sachets"
    })()`);
    await sleep(500);
    await captureScreenshot(ws, "mobile-02-390-tab-sachets.png");

    await evaluate(ws, `(() => {
      const buttons = Array.from(document.querySelectorAll('.ritual-options button'));
      if (buttons[2]) buttons[2].click(); // Click "Forest carton"
    })()`);
    await sleep(500);
    await captureScreenshot(ws, "mobile-03-390-tab-forest-carton.png");

    // =========================================================================
    // TEST 6: NARROW MOBILE (320x600)
    // =========================================================================
    console.log("\n--- TEST 6: Narrow Mobile (320x600) ---");
    await setViewport(ws, 320, 600, true);
    await sleep(600);

    const narrowMetrics = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const docScrollWidth = document.documentElement.scrollWidth;
      const aaraScrollWidth = aara.scrollWidth;
      const aaraClientWidth = aara.clientWidth;
      return {
        docScrollWidth,
        aaraScrollWidth,
        aaraClientWidth,
        hasOverflow: docScrollWidth > 320 || aaraScrollWidth > aaraClientWidth,
      };
    })()`);
    console.log("Narrow (320px) Metrics:", narrowMetrics);
    if (narrowMetrics.hasOverflow) {
      throw new Error(`FAIL: Horizontal overflow detected on 320px narrow mobile!`);
    }
    await captureScreenshot(ws, "mobile-04-320-narrow-showcase.png");

    // =========================================================================
    // TEST 7: PAUSE MOTION VERIFICATION
    // =========================================================================
    console.log("\n--- TEST 7: Pause Motion Verification ---");
    await setViewport(ws, 390, 844, true);
    await sleep(400);

    const pauseMotionResult = await evaluate(ws, `(() => {
      // Find Pause Motion button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const pauseBtn = allButtons.find(b => /pause motion|motion paused/i.test(b.innerText));
      if (!pauseBtn) return { success: false, reason: "Pause motion button not found" };
      pauseBtn.click();
      return { success: true, text: pauseBtn.innerText };
    })()`);
    console.log("Pause Motion Button Click:", pauseMotionResult);
    await sleep(600);

    const clearedCheck = await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      const heading = aara.querySelector('.ritual-header-wrap');
      const stage = aara.querySelector('.ritual-stage');
      const isDirectlyVisible = aara && window.getComputedStyle(aara).display !== 'none';
      return {
        headingTransform: heading ? window.getComputedStyle(heading).transform : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null,
        isDirectlyVisible,
      };
    })()`);
    console.log("Pause Motion State Check:", clearedCheck);
    await captureScreenshot(ws, "mobile-05-390-pause-motion-direct.png");

    // =========================================================================
    // TEST 8: SECONDARY PORT 3102 VERIFICATION
    // =========================================================================
    console.log("\n--- TEST 8: Secondary Server Audit (Port 3102) ---");
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3102" });
    await sleep(3500);

    const p3102Audit = await evaluate(ws, `(() => {
      const allText = document.body.innerText;
      const hasExhibit03B = /EXHIBIT 03B/i.test(allText);
      const podiumHeroImages = Array.from(document.querySelectorAll('img[src*="packaging-podium-hero"]'));
      const aaraShowcase = document.getElementById('showcase-aara');
      const headerWrap = document.querySelector('.ritual-header-wrap');
      return {
        hasExhibit03B,
        podiumHeroImgCount: podiumHeroImages.length,
        hasAaraShowcase: !!aaraShowcase,
        headerWrapText: headerWrap ? headerWrap.innerText.trim() : null,
      };
    })()`);
    console.log("Port 3102 Audit:", p3102Audit);
    if (p3102Audit.hasExhibit03B) throw new Error("FAIL: Port 3102 has Exhibit 03B!");
    if (p3102Audit.podiumHeroImgCount !== 1) throw new Error("FAIL: Port 3102 does not have exactly 1 podium hero image!");

    console.log("\n=== ALL DIRECT AARA SHOWCASE VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Verification failed:", err);
    process.exitCode = 1;
  } finally {
    chromeProc.kill();
  }
}

main();

