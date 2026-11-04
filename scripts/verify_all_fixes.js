const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9382;

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
  console.log("Starting Chrome on port", PORT);
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-extensions",
    "--window-size=1920,1080"
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
    // 1. DESKTOP 1920x950 AUDIT & SCREENSHOTS
    // =========================================================================
    console.log("\n>>> DESKTOP 1920x950 VERIFICATION...");
    await setViewport(ws, 1920, 950, false);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // AUDIT 1: Logo Folio Link Audit & Mark Index Check
    const logoFolioAudit = await evaluate(ws, `(() => {
      const pageText = document.body.innerText;
      const hasMarkIndexText = pageText.includes("Complete Mark Index") || pageText.includes("MARK INDEX");
      const markIndexEl = document.querySelector("#mark-index") || document.querySelector("[data-section='mark-index']");
      
      const links = Array.from(document.querySelectorAll("#chapter-logo-folio a")).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute("href")
      }));
      
      const verdaLinks = links.filter(l => l.text.toLowerCase().includes("verda") || (l.href && l.href.includes("verda")));
      const veloraLinksInLogoFolio = links.filter(l => l.text.toLowerCase().includes("vélora") || l.text.toLowerCase().includes("velora"));

      return {
        hasMarkIndexText,
        markIndexElementExists: !!markIndexEl,
        linksCount: links.length,
        verdaLinks,
        veloraLinksInLogoFolio,
        allLogoFolioLinks: links
      };
    })()`);
    console.log("Logo Folio Audit:", JSON.stringify(logoFolioAudit, null, 2));

    // Capture Logo Folio
    await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-logo-folio");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-01-logo-folio-desktop.jpg");

    // AUDIT 2: Brand Identity Opening Stage
    console.log("\nCapturing Brand Identity Opening...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-identity");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-02a-brand-identity-opening.jpg");

    // AUDIT 3: Brand Identity Presentation Sheets
    // EarthKind
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-earthkind");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-02b-brand-identity-earthkind.jpg");

    // Vélora Leather
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-velora-leather");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-02c-brand-identity-velora-leather.jpg");

    // Vélora Skincare
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-velora-skincare");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-02d-brand-identity-velora-skincare.jpg");

    // NEXA Performance
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-nexa");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-02e-brand-identity-nexa.jpg");

    const brandIdentityAudit = await evaluate(ws, `(() => {
      const veloraLeatherImg = document.querySelector("#showcase-velora-leather img");
      const veloraSkincareImg = document.querySelector("#showcase-velora-skincare img");
      const nexaImg = document.querySelector("#showcase-nexa img");

      const leatherBox = veloraLeatherImg?.parentElement?.getBoundingClientRect();
      const skincareBox = veloraSkincareImg?.parentElement?.getBoundingClientRect();
      const nexaBox = nexaImg?.parentElement?.getBoundingClientRect();

      return {
        veloraLeather: leatherBox ? { width: Math.round(leatherBox.width), height: Math.round(leatherBox.height), ratio: (leatherBox.width / leatherBox.height).toFixed(2) } : null,
        veloraSkincare: skincareBox ? { width: Math.round(skincareBox.width), height: Math.round(skincareBox.height), ratio: (skincareBox.width / skincareBox.height).toFixed(2) } : null,
        nexa: nexaBox ? { width: Math.round(nexaBox.width), height: Math.round(nexaBox.height), ratio: (nexaBox.width / nexaBox.height).toFixed(2) } : null,
      };
    })()`);
    console.log("Brand Identity Aspect Ratios:", JSON.stringify(brandIdentityAudit, null, 2));

    // AUDIT 4: CareConnect Demo
    console.log("\nCapturing CareConnect Demo...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#intro-uiux");
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, top + 150);
      }
    })()`);
    await sleep(700);
    await captureScreenshot(ws, "audit-03-uiux-careconnect.jpg");

    // AUDIT 5: Packaging Design (Aara & GlowBite)
    console.log("\nCapturing Aara Ritual...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-aara");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-04a-packaging-aara.jpg");

    console.log("\nCapturing Glow Bite...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-glowbite");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-04b-packaging-glowbite.jpg");

    const glowbiteAudit = await evaluate(ws, `(() => {
      const glowbite = document.querySelector("#showcase-glowbite");
      const wrapper = glowbite?.closest(".w-full.bg-\\[\\#101A12\\]");
      const img = glowbite?.querySelector("img");
      return {
        hasFullWidthWrapper: !!wrapper,
        wrapperBg: wrapper ? window.getComputedStyle(wrapper).backgroundColor : null,
        imgSrc: img?.src,
        naturalWidth: img?.naturalWidth,
        naturalHeight: img?.naturalHeight
      };
    })()`);
    console.log("GlowBite Audit:", JSON.stringify(glowbiteAudit, null, 2));

    // AUDIT 6: Social Media Horizontal Grid
    console.log("\nCapturing Social Media Chapter...");
    await evaluate(ws, `(() => {
      const el = document.querySelector("#chapter-social");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-05-social-media.jpg");

    // =========================================================================
    // 2. MOBILE VIEWPORT (390x844) AUDIT
    // =========================================================================
    console.log("\n>>> MOBILE 390x844 AUDIT...");
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const mobileAudit = await evaluate(ws, `(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      
      const sections = ['#chapter-logo-folio', '#chapter-identity', '#intro-uiux', '#chapter-packaging', '#chapter-social'];
      const sectionWidths = sections.map(sel => {
        const el = document.querySelector(sel);
        return { selector: sel, scrollWidth: el ? el.scrollWidth : 0 };
      });

      return {
        bodyWidth,
        windowWidth,
        zeroOverflow: bodyWidth <= windowWidth,
        sectionWidths
      };
    })()`);
    console.log("Mobile 390 Audit:", JSON.stringify(mobileAudit, null, 2));

    // Mobile Brand Identity Nexa
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-nexa");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-mobile-390-nexa.jpg");

    // Mobile GlowBite
    await evaluate(ws, `(() => {
      const el = document.querySelector("#showcase-glowbite");
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(600);
    await captureScreenshot(ws, "audit-mobile-390-glowbite.jpg");

    ws.close();
    console.log("\nAll audits and captures completed successfully.");
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    chromeProc.kill();
  }
}

main();

