const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9320;

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
        // ignore parse
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
    console.warn(`Screenshot ${filename} warning:`, err.message);
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
  console.log("Starting Chrome on port", PORT);
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

    // DESKTOP TEST 1920x900
    console.log("\n>>> TESTING DESKTOP 1920x900...");
    await setViewport(ws, 1920, 900, false);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // 1. CareConnect: inspect bounding boxes and positions
    console.log("\n--- CARECONNECT AUDIT ---");
    const careInfo = await evaluate(ws, `(() => {
      const el = document.querySelector("#intro-uiux");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const stage = el.querySelector(".uiux-stage");
      const phone = el.querySelector(".care-phone-wrap");
      const card = el.querySelector(".uiux-stage [class*='bg-[#FAF8FC]']");
      const header = document.querySelector("header.sticky, nav.sticky, header");
      const footer = el.querySelector("footer");
      const titleBg = el.querySelector(".uiux-stage [class*='font-cubao text-6xl']");
      
      const phoneRect = phone ? phone.getBoundingClientRect() : null;
      const cardRect = card ? card.getBoundingClientRect() : null;
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      const footerRect = footer ? footer.getBoundingClientRect() : null;
      
      return {
        found: true,
        phoneRect,
        cardRect,
        stageRect,
        footerRect,
        gapBetweenCardAndPhone: phoneRect && cardRect ? (phoneRect.left - cardRect.right) : null,
        phoneExtendsPastFooter: (phoneRect && footerRect) ? (phoneRect.bottom > footerRect.top) : null,
        phoneClippedTop: phoneRect ? (phoneRect.top < 64) : null,
      };
    })()`);
    console.log("CareConnect layout metrics:", careInfo);
    await sleep(600);
    await captureScreenshot(ws, "debug-careconnect-1920.jpg");

    // 2. Aara: inspect bounding boxes and layout
    console.log("\n--- AARA AUDIT ---");
    const aaraInfo = await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-aara");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const stage = el.querySelector(".ritual-stage");
      const details = el.querySelector(".ritual-details");
      const title = el.querySelector("#ritual-title");
      const footer = el.querySelector("footer");
      
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      const detailsRect = details ? details.getBoundingClientRect() : null;
      const containerRect = el.getBoundingClientRect();
      
      return {
        found: true,
        containerRect,
        stageRect,
        detailsRect,
        stageWidthPercent: stageRect ? (stageRect.width / containerRect.width * 100).toFixed(1) : null,
        fitsInViewport: containerRect.height <= 900,
      };
    })()`);
    console.log("Aara layout metrics:", aaraInfo);
    await sleep(600);
    await captureScreenshot(ws, "debug-aara-1920.jpg");

    // 3. GlowBite: inspect background and layout
    console.log("\n--- GLOW BITE AUDIT ---");
    const glowInfo = await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-glowbite");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const img = el.querySelector("img");
      return {
        found: true,
        imgSrc: img ? img.src : null,
        heading: el.querySelector("h3") ? el.querySelector("h3").innerText : null,
      };
    })()`);
    console.log("GlowBite metrics:", glowInfo);
    await sleep(600);
    await captureScreenshot(ws, "debug-glowbite-1920.jpg");

    // 4. Nexa: check where Nexa is located
    console.log("\n--- NEXA AUDIT ---");
    const nexaInfo = await evaluate(ws, `(() => {
      const brandNexa = document.querySelector("#chapter-identity #showcase-nexa");
      const packNexa = document.querySelector("#packaging #showcase-nexa");
      return {
        inBrandIdentity: !!brandNexa,
        inPackaging: !!packNexa,
        badgeText: brandNexa ? brandNexa.querySelector("[class*='font-mono text-xs']")?.innerText : null,
      };
    })()`);
    console.log("Nexa metrics:", nexaInfo);

    // 5. Social Media: check horizontal gallery and tabs
    console.log("\n--- SOCIAL MEDIA AUDIT ---");
    const socialInfo = await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-social");
      if (!el) return { found: false };
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const smallTabs = el.querySelectorAll("[role='tablist']");
      const track = el.querySelector(".social-track");
      return {
        found: true,
        hasSmallTabs: smallTabs.length > 0,
        hasHorizontalTrack: !!track,
        trackChildrenCount: track ? track.children.length : 0,
      };
    })()`);
    console.log("Social Media metrics:", socialInfo);
    await sleep(600);
    await captureScreenshot(ws, "debug-social-media-1920.jpg");

    // 6. Mobile 390x844 overflow test
    console.log("\n>>> TESTING MOBILE 390x844...");
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const mobileAudit = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalScroll = bodyWidth > windowWidth;
      
      // Check Aara on mobile
      const aara = document.querySelector("#showcase-aara");
      let aaraOverflow = false;
      if (aara) {
        aara.scrollIntoView({ behavior: 'instant', block: 'start' });
        aaraOverflow = aara.scrollWidth > windowWidth;
      }
      
      return {
        bodyWidth,
        windowWidth,
        hasHorizontalScroll,
        aaraOverflow,
      };
    })()`);
    console.log("Mobile overflow audit:", mobileAudit);
    await sleep(600);
    await captureScreenshot(ws, "debug-mobile-390-aara.jpg");

    ws.close();
  } catch (err) {
    console.error("Inspection error:", err);
  } finally {
    chromeProc.kill();
  }
}

main();

