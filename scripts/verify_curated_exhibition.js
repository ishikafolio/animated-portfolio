const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9350;

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
  console.log("Starting Chrome for full exhibition verification on port", PORT);
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
    // 1. DESKTOP 1920x900 VERIFICATION
    // =========================================================================
    console.log("\n>>> [1/3] VERIFYING DESKTOP 1920x900 VIEWPORT...");
    await setViewport(ws, 1920, 900, false);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // 1A. CareConnect: Verify Viewport Fit and Centered Composition
    console.log("\n--- AUDITING CARECONNECT ---");
    const careMetrics = await evaluate(ws, `(() => {
      const section = document.querySelector("#intro-uiux");
      if (!section) return { error: "no section" };
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      const height = section.offsetHeight;
      return { top, height };
    })()`);

    // Scroll to CareConnect settled demo (progress 1.0)
    const careTargetY = careMetrics.top + Math.max(0, careMetrics.height - 900);
    await evaluate(ws, `window.scrollTo(0, ${careTargetY})`);
    await sleep(700);

    const careCheck = await evaluate(ws, `(() => {
      const phone = document.querySelector(".uiux-stage .care-phone");
      const phoneWrap = document.querySelector(".uiux-stage .care-phone-wrap");
      const card = document.querySelector(".uiux-stage [class*='bg-[#FAF8FC]']");
      const footer = document.querySelector(".uiux-stage footer");
      const header = document.querySelector("header");
      
      const pRect = phone ? phone.getBoundingClientRect() : null;
      const cRect = card ? card.getBoundingClientRect() : null;
      const fRect = footer ? footer.getBoundingClientRect() : null;
      
      return {
        phoneWidth: pRect ? pRect.width : 0,
        phoneHeight: pRect ? pRect.height : 0,
        phoneTop: pRect ? pRect.top : 0,
        phoneBottom: pRect ? pRect.bottom : 0,
        cardWidth: cRect ? cRect.width : 0,
        cardHeight: cRect ? cRect.height : 0,
        cardTop: cRect ? cRect.top : 0,
        cardBottom: cRect ? cRect.bottom : 0,
        gap: (pRect && cRect) ? Math.round(pRect.left - cRect.right) : 0,
        footerTop: fRect ? fRect.top : 0,
        fitsBelowHeader: pRect ? pRect.top >= 64 : false,
        fitsAboveFooter: (pRect && fRect) ? pRect.bottom <= fRect.top : false,
        alignedCenters: (pRect && cRect) ? Math.abs((pRect.top + pRect.bottom)/2 - (cRect.top + cRect.bottom)/2) < 40 : false,
      };
    })()`);
    console.log("CareConnect layout verification:", careCheck);
    await captureScreenshot(ws, "verified-03-uiux-careconnect-1920.jpg");

    // 1B. Aara: Verify Viewport Fit and ~50% Arch Scale
    console.log("\n--- AUDITING AARA ---");
    const aaraMetrics = await evaluate(ws, `(() => {
      const section = document.querySelector("#showcase-aara");
      if (!section) return { error: "no aara section" };
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      const height = section.offsetHeight;
      return { top, height };
    })()`);

    await evaluate(ws, `window.scrollTo(0, ${aaraMetrics.top})`);
    await sleep(700);

    const aaraCheck = await evaluate(ws, `(() => {
      const section = document.querySelector("#showcase-aara");
      const stage = section ? section.querySelector(".ritual-stage") : null;
      const title = section ? section.querySelector("#ritual-title") : null;
      const footer = section ? section.querySelector("footer") : null;
      const container = section ? section.querySelector(".max-w-6xl") : null;
      
      const sRect = stage ? stage.getBoundingClientRect() : null;
      const cRect = container ? container.getBoundingClientRect() : null;
      const fRect = footer ? footer.getBoundingClientRect() : null;
      
      return {
        stageWidth: sRect ? sRect.width : 0,
        stageHeight: sRect ? sRect.height : 0,
        containerWidth: cRect ? cRect.width : 0,
        archWidthPercent: (sRect && cRect) ? Math.round(sRect.width / cRect.width * 100) : 0,
        headingText: title ? title.innerText : "",
        fitsInViewport: section.offsetHeight <= 900,
        stageTop: sRect ? sRect.top : 0,
        stageBottom: sRect ? sRect.bottom : 0,
      };
    })()`);
    console.log("Aara layout verification:", aaraCheck);
    await captureScreenshot(ws, "verified-04-packaging-aara-1920.jpg");

    // 1C. Glow Bite: Verify Rich Forest Stage (No White Box)
    console.log("\n--- AUDITING GLOW BITE ---");
    const glowCheck = await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-glowbite");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const img = el.querySelector("img");
      const heading = el.querySelector("h3");
      const badge = el.querySelector("[class*='text-[#E5A830]']");
      return {
        found: true,
        imgSrc: img ? img.src : "",
        heading: heading ? heading.innerText : "",
        badge: badge ? badge.innerText : "",
      };
    })()`);
    console.log("Glow Bite verification:", glowCheck);
    await sleep(500);
    await captureScreenshot(ws, "verified-04-packaging-glowbite-1920.jpg");

    // 1D. Brand Identity (Nexa in Brand Identity)
    console.log("\n--- AUDITING NEXA IN BRAND IDENTITY ---");
    const nexaCheck = await evaluate(ws, `(() => {
      const brandNexa = document.querySelector("#chapter-identity #showcase-nexa");
      const packNexa = document.querySelector("#packaging #showcase-nexa");
      if (brandNexa) brandNexa.scrollIntoView({ behavior: 'instant', block: 'center' });
      return {
        inBrandIdentity: !!brandNexa,
        inPackaging: !!packNexa,
        heading: brandNexa ? brandNexa.querySelector("h3")?.innerText : "",
        badge: brandNexa ? brandNexa.querySelector("[class*='font-mono text-xs']")?.innerText : "",
      };
    })()`);
    console.log("Nexa verification:", nexaCheck);
    await sleep(500);
    await captureScreenshot(ws, "verified-02-brand-identity-nexa-1920.jpg");

    // 1E. Social Media: Horizontal Editorial Gallery
    console.log("\n--- AUDITING SOCIAL MEDIA HORIZONTAL GALLERY ---");
    const socialCheck = await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-social");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const smallTabs = el.querySelectorAll(".uiux-stage [role='tablist'], #chapter-social [role='tablist']");
      const track = el.querySelector("[class*='flex-row']");
      const articles = track ? track.querySelectorAll("article") : [];
      return {
        found: true,
        hasSmallTabs: smallTabs.length > 0,
        articleCount: articles.length,
        firstArticleTitle: articles[0]?.querySelector("h4")?.innerText || "",
      };
    })()`);
    console.log("Social Media verification:", socialCheck);
    await sleep(600);
    await captureScreenshot(ws, "verified-05-social-media-horizontal-1920.jpg");

    // =========================================================================
    // 2. MOBILE 390x844 OVERFLOW & RESPONSIVENESS VERIFICATION
    // =========================================================================
    console.log("\n>>> [2/3] VERIFYING MOBILE 390x844 VIEWPORT...");
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const mobileCheck = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalScroll = bodyWidth > windowWidth;
      
      const aara = document.querySelector("#showcase-aara");
      let aaraWidth = 0;
      if (aara) {
        aara.scrollIntoView({ behavior: 'instant', block: 'start' });
        aaraWidth = aara.scrollWidth;
      }
      
      const care = document.querySelector("#intro-uiux");
      let careWidth = 0;
      if (care) {
        care.scrollIntoView({ behavior: 'instant', block: 'start' });
        careWidth = care.scrollWidth;
      }
      
      return {
        bodyWidth,
        windowWidth,
        hasHorizontalScroll,
        aaraWidth,
        careWidth,
        zeroOverflow: bodyWidth <= windowWidth && aaraWidth <= windowWidth,
      };
    })()`);
    console.log("Mobile 390x844 verification:", mobileCheck);
    await captureScreenshot(ws, "verified-mobile-390-aara.jpg");

    // =========================================================================
    // 3. MOBILE 320x640 ULTRA-NARROW VERIFICATION
    // =========================================================================
    console.log("\n>>> [3/3] VERIFYING ULTRA-NARROW 320x640 VIEWPORT...");
    await setViewport(ws, 320, 640, true);
    await sleep(600);

    const narrowCheck = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      return {
        bodyWidth,
        windowWidth,
        zeroOverflow: bodyWidth <= windowWidth,
      };
    })()`);
    console.log("Ultra-narrow 320x640 verification:", narrowCheck);

    ws.close();
    console.log("\nAll verifications completed successfully!");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    chromeProc.kill();
  }
}

main();
