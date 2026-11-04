const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9250;

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

async function captureScreenshot(ws, filename) {
  const result = await sendCDP(ws, "Page.captureScreenshot", { format: "png", quality: 90 });
  const filepath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`Saved screenshot: ${filename}`);
}

async function main() {
  console.log("=== Comprehensive Verification: Aara Mobile Overflow & Layout ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-extensions",
    "--window-size=390,844"
  ]);

  await sleep(1500);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  console.log("Navigating to http://localhost:3000 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(4000);

  const viewports = [
    { width: 320, height: 568, name: "320" },
    { width: 360, height: 740, name: "360" },
    { width: 390, height: 844, name: "390" }
  ];

  // -------------------------------------------------------------------------
  // TEST 1: VERIFY AT 320px, 360px, 390px WITH "A PERSONAL NOTE" SELECTED
  // -------------------------------------------------------------------------
  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport ${vp.name} (${vp.width}x${vp.height}) with "A personal note" ---`);
    await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(600);

    // Scroll to Aara showcase
    await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const aara = document.querySelector('#showcase-aara');
        if (aara) aara.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await sleep(600);

    // Click "A personal note" (index 4)
    await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
        const noteTab = tabs.find(t => t.innerText && t.innerText.includes('A personal note'));
        if (noteTab) noteTab.click();
      })()`
    });
    await sleep(600);

    // Inspect overflow and bounds
    const metrics = await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const hasDocOverflow = scrollWidth > docWidth;

        const showcase = document.querySelector('#showcase-aara');
        const ritual = document.querySelector('.aara-ritual');
        const h2 = document.querySelector('#ritual-title');
        const stage = document.querySelector('.ritual-stage');
        const tabs = document.querySelector('.ritual-options');
        const caption = document.querySelector('.ritual-note');
        const activeTab = document.querySelector('.ritual-options button[aria-pressed="true"]');
        const desc = document.querySelector('.ritual-description p');
        const archiveLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Explore Aara archive'));
        const pauseBtn = document.querySelector('.motion-control');

        // Function to check element bounds against viewport
        function checkBounds(el, name) {
          if (!el) return { name, exists: false };
          const rect = el.getBoundingClientRect();
          return {
            name,
            exists: true,
            width: Math.round(rect.width * 10) / 10,
            left: Math.round(rect.left * 10) / 10,
            right: Math.round(rect.right * 10) / 10,
            fitsInViewport: rect.right <= docWidth + 1
          };
        }

        const elements = [
          checkBounds(h2, 'title'),
          checkBounds(stage, 'archedArtworkFrame'),
          checkBounds(tabs, 'tabsContainer'),
          checkBounds(caption, 'caption'),
          checkBounds(desc, 'detailText'),
          checkBounds(archiveLink, 'archiveLink')
        ];

        // All tabs check
        const allButtons = Array.from(tabs.querySelectorAll('button')).map(b => ({
          text: b.innerText.trim(),
          height: b.getBoundingClientRect().height,
          right: Math.round(b.getBoundingClientRect().right * 10) / 10,
          fits: b.getBoundingClientRect().right <= docWidth + 1
        }));

        // Pause button clearance
        let pauseClearance = null;
        if (archiveLink && pauseBtn) {
          const aRect = archiveLink.getBoundingClientRect();
          const pRect = pauseBtn.getBoundingClientRect();
          pauseClearance = {
            archiveBottom: aRect.bottom,
            pauseTop: pRect.top,
            hasOverlap: !(aRect.bottom < pRect.top || aRect.top > pRect.bottom || aRect.right < pRect.left || aRect.left > pRect.right)
          };
        }

        return {
          viewport: docWidth,
          scrollWidth,
          hasDocOverflow,
          activeTab: activeTab?.innerText.trim(),
          elements,
          allTabsFit: allButtons.every(b => b.fits),
          allTabsMin44: allButtons.every(b => b.height >= 43.5),
          pauseClearance
        };
      })()`,
      returnByValue: true
    });

    console.log(`Viewport ${vp.name} metrics:`, JSON.stringify(metrics.result.value, null, 2));
    await captureScreenshot(ws, `mobile-${vp.name}-personal-note.png`);
  }

  // -------------------------------------------------------------------------
  // TEST 2: TEST THE OTHER FOUR TABS AT 390px
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 2: Testing the other four tabs at 390px ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  const otherTabs = [0, 1, 2, 3]; // "The collection", "Botanical carton", "Forest carton", "The tea tin"
  for (const idx of otherTabs) {
    await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
        if (tabs[${idx}]) tabs[${idx}].click();
      })()`
    });
    await sleep(500);

    const tabCheck = await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const activeTab = document.querySelector('.ritual-options button[aria-pressed="true"]');
        const descH3 = document.querySelector('.ritual-description h3');
        const img = document.querySelector('.ritual-image img');
        return {
          tabIndex: ${idx},
          activeTab: activeTab?.innerText.trim(),
          descTitle: descH3?.innerText.trim(),
          imgSrc: img?.getAttribute('src'),
          hasDocOverflow: scrollWidth > docWidth,
          scrollWidth,
          docWidth
        };
      })()`,
      returnByValue: true
    });

    console.log(`Tab ${idx} check:`, tabCheck.result.value);
  }
  await captureScreenshot(ws, "mobile-390-tab-switching.png");

  // -------------------------------------------------------------------------
  // TEST 3: CHECK SCROLL ANIMATION AT START, MIDDLE, AND END
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 3: Mobile Scroll Animation at Start, Middle, and End ---");
  const aaraOffset = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const a = document.querySelector('#showcase-aara');
      return a ? a.getBoundingClientRect().top + window.scrollY : 0;
    })()`,
    returnByValue: true
  });
  const aaraY = aaraOffset.result.value;

  // 3A: Animation Start (Aara enters top 85%)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraY - 600}, behavior: 'instant' })` });
  await sleep(600);
  const animStart = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const h2 = document.querySelector('#ritual-title');
      const artwork = document.querySelector('.ritual-image');
      const stage = document.querySelector('.ritual-stage');
      return {
        scrollY: window.scrollY,
        headingOpacity: h2 ? window.getComputedStyle(h2).opacity : null,
        headingTransform: h2 ? window.getComputedStyle(h2).transform : null,
        artworkTransform: artwork ? window.getComputedStyle(artwork).transform : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Animation Start:", animStart.result.value);
  await captureScreenshot(ws, "mobile-390-entrance-start.png");

  // 3B: Animation Middle
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraY - 200}, behavior: 'instant' })` });
  await sleep(600);
  const animMid = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const h2 = document.querySelector('#ritual-title');
      const artwork = document.querySelector('.ritual-image');
      return {
        scrollY: window.scrollY,
        headingOpacity: h2 ? window.getComputedStyle(h2).opacity : null,
        headingTransform: h2 ? window.getComputedStyle(h2).transform : null,
        artworkTransform: artwork ? window.getComputedStyle(artwork).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Animation Middle:", animMid.result.value);
  await captureScreenshot(ws, "mobile-390-entrance-mid.png");

  // 3C: Animation End / Settled
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraY + 150}, behavior: 'instant' })` });
  await sleep(600);
  const animEnd = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const h2 = document.querySelector('#ritual-title');
      const artwork = document.querySelector('.ritual-image');
      const stage = document.querySelector('.ritual-stage');
      return {
        scrollY: window.scrollY,
        headingOpacity: h2 ? window.getComputedStyle(h2).opacity : null,
        headingTransform: h2 ? window.getComputedStyle(h2).transform : null,
        artworkTransform: artwork ? window.getComputedStyle(artwork).transform : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Animation End / Settled:", animEnd.result.value);
  await captureScreenshot(ws, "mobile-390-entrance-end.png");

  // -------------------------------------------------------------------------
  // TEST 4: PAUSE MOTION & REDUCED MOTION VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 4: Pause Motion Toggle Check ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = document.querySelector('.motion-control');
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  const pauseCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const h2 = document.querySelector('#ritual-title');
      const artwork = document.querySelector('.ritual-image');
      const stage = document.querySelector('.ritual-stage');
      return {
        motion: document.documentElement.dataset.motion,
        headingTransform: h2 ? window.getComputedStyle(h2).transform : null,
        artworkTransform: artwork ? window.getComputedStyle(artwork).transform : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Pause Motion Active Check:", pauseCheck.result.value);
  await captureScreenshot(ws, "mobile-390-pause-motion-cleared.png");

  // Resume motion
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = document.querySelector('.motion-control');
      if (btn) btn.click();
    })()`
  });
  await sleep(600);

  ws.close();
  chromeProc.kill();
  console.log("\n=== All Tests Completed Successfully ===");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});

