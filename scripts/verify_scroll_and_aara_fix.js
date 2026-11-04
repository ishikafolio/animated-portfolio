const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9230;

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

async function runQA() {
  console.log("=== Starting Comprehensive Browser Verification ===");

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
    chromeProc.kill();
    throw new Error("Could not connect to Chrome");
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "DOM.enable");

  console.log("Navigating to http://localhost:3000 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(4000);

  // -------------------------------------------------------------------------
  // TEST 1: DESKTOP SCROLL CHOREOGRAPHY (START, MIDDLE, END)
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 1: Desktop Pinned Transitions ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(1000);

  const offsets = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const pack = document.querySelector('#packaging');
      const aara = document.querySelector('#showcase-aara');
      return {
        packTop: pack ? pack.getBoundingClientRect().top + window.scrollY : 0,
        aaraTop: aara ? aara.getBoundingClientRect().top + window.scrollY : 0,
      };
    })()`,
    returnByValue: true
  });
  const { packTop, aaraTop } = offsets.result.value;
  console.log(`Packaging Top: ${packTop}, Aara Top: ${aaraTop}`);

  // 1A: Packaging Start (Dual-podium hero)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${packTop}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-01-pack-start.png");

  // 1B: Packaging Middle (Push into left podium)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${packTop + 650}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-02-pack-mid.png");

  // 1C: Packaging End (Progelato Shelf explorer settled)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${packTop + 1400}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-03-progelato-settled.png");

  // 1D: Aara Start (Limestone podium shot)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraTop}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-04-aara-start.png");

  // 1E: Aara Middle (Push into limestone podium triad)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraTop + 650}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-05-aara-mid.png");

  // 1F: Aara End (Match handoff into Aara Ritual showcase)
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraTop + 1400}, behavior: 'instant' })` });
  await sleep(800);
  await captureScreenshot(ws, "desktop-qa-06-aara-settled.png");

  // -------------------------------------------------------------------------
  // TEST 2: MOBILE LAYOUT ORDER & READABILITY (320px, 390px, 430px)
  // -------------------------------------------------------------------------
  const viewports = [
    { width: 320, height: 568, name: "320" },
    { width: 390, height: 844, name: "390" },
    { width: 430, height: 932, name: "430" }
  ];

  for (const vp of viewports) {
    console.log(`\n--- TEST 2: Testing Mobile Viewport ${vp.name} (${vp.width}x${vp.height}) ---`);
    await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(1000);

    // Scroll to Aara showcase
    await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const aara = document.querySelector('#showcase-aara');
        if (aara) aara.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await sleep(1000);

    // Inspect layout order and dimensions
    const inspectResult = await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const aaraSection = document.querySelector('#showcase-aara');
        const ritual = aaraSection ? aaraSection.querySelector('.aara-ritual') : null;
        const details = ritual ? ritual.querySelector('.ritual-details') : null;

        if (!details) return { error: "ritual-details not found" };

        const children = Array.from(details.children).filter(c => {
          const s = window.getComputedStyle(c);
          return s.display !== 'none' && c.offsetHeight > 0;
        });

        const elements = children.map(c => ({
          tag: c.tagName,
          className: c.className.slice(0, 30),
          text: (c.innerText || '').slice(0, 40).replace(/\\n/g, ' '),
          top: c.getBoundingClientRect().top,
          height: c.getBoundingClientRect().height,
          width: c.getBoundingClientRect().width
        }));

        // Check horizontal overflow
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const hasOverflow = scrollWidth > docWidth;

        // Check tabs
        const tabs = Array.from(ritual.querySelectorAll('.ritual-options button'));
        const tabInfo = tabs.map(t => ({
          text: t.innerText.trim(),
          height: t.getBoundingClientRect().height,
          width: t.getBoundingClientRect().width,
          isPressed: t.getAttribute('aria-pressed') === 'true',
          color: window.getComputedStyle(t).color,
          bg: window.getComputedStyle(t).backgroundColor,
          border: window.getComputedStyle(t).borderWidth + ' ' + window.getComputedStyle(t).borderColor
        }));

        // Check archive link
        const archiveLink = Array.from(ritual.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Explore Aara archive'));
        const archiveRect = archiveLink ? archiveLink.getBoundingClientRect() : null;

        // Check floating pause motion button
        const pauseBtn = document.querySelector('.motion-control');
        const pauseRect = pauseBtn ? pauseBtn.getBoundingClientRect() : null;

        // Distance between archive link bottom and pause button top (or screen bottom)
        let archiveClearance = null;
        if (archiveRect && pauseRect) {
          archiveClearance = {
            archiveBottom: archiveRect.bottom,
            pauseTop: pauseRect.top,
            overlap: !(archiveRect.bottom < pauseRect.top || archiveRect.top > pauseRect.bottom || archiveRect.right < pauseRect.left || archiveRect.left > pauseRect.right)
          };
        }

        // Check colors
        const h2 = ritual.querySelector('#ritual-title');
        const h2Style = h2 ? window.getComputedStyle(h2) : null;
        const desc = ritual.querySelector('.ritual-description p');
        const descStyle = desc ? window.getComputedStyle(desc) : null;
        const sectionStyle = aaraSection ? window.getComputedStyle(aaraSection) : null;

        return {
          hasOverflow,
          docWidth,
          scrollWidth,
          elementsCount: elements.length,
          elements,
          tabCount: tabInfo.length,
          allTabsMin44: tabInfo.every(t => t.height >= 43.5),
          tabInfo,
          archiveClearance,
          colors: {
            bg: sectionStyle?.backgroundColor,
            headingColor: h2Style?.color,
            descColor: descStyle?.color
          }
        };
      })()`,
      returnByValue: true
    });

    console.log(`Viewport ${vp.name} evaluation:`, JSON.stringify(inspectResult.result.value, null, 2));

    await captureScreenshot(ws, `mobile-qa-${vp.name}-aara-showcase.png`);
  }

  // -------------------------------------------------------------------------
  // TEST 3: TAB SWITCHING INTERACTION
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 3: Testing Tab Switching Interaction at 390px ---");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(600);

  // Click Tab 1 ("Botanical carton")
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      if (tabs[1]) tabs[1].click();
    })()`
  });
  await sleep(600);

  const tab1Check = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      const active = tabs.find(t => t.getAttribute('aria-pressed') === 'true');
      const descH3 = document.querySelector('.ritual-description h3');
      const img = document.querySelector('.ritual-image img');
      return {
        activeTab: active?.innerText.trim(),
        descTitle: descH3?.innerText.trim(),
        imgSrc: img?.getAttribute('src')
      };
    })()`,
    returnByValue: true
  });
  console.log("After clicking Tab 1:", tab1Check.result.value);
  await captureScreenshot(ws, "mobile-qa-390-tab1-botanical.png");

  // Click Tab 3 ("The tea tin")
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      if (tabs[3]) tabs[3].click();
    })()`
  });
  await sleep(600);

  const tab3Check = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      const active = tabs.find(t => t.getAttribute('aria-pressed') === 'true');
      const descH3 = document.querySelector('.ritual-description h3');
      const img = document.querySelector('.ritual-image img');
      return {
        activeTab: active?.innerText.trim(),
        descTitle: descH3?.innerText.trim(),
        imgSrc: img?.getAttribute('src')
      };
    })()`,
    returnByValue: true
  });
  console.log("After clicking Tab 3:", tab3Check.result.value);
  await captureScreenshot(ws, "mobile-qa-390-tab3-tin.png");

  // -------------------------------------------------------------------------
  // TEST 4: AARA HERO LINK NAVIGATION
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 4: Testing Packaging Hero Link to Aara ---");
  // Scroll to hero links
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const hero = document.querySelector('#packaging');
      if (hero) hero.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await sleep(800);

  // Click 03B Aara link
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('03B · AARA'));
      if (link) link.click();
    })()`
  });
  await sleep(1000);

  const heroLinkScroll = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aara = document.querySelector('#showcase-aara');
      const rect = aara ? aara.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        aaraTopInViewport: rect ? rect.top : null,
        isAaraVisible: rect ? (rect.top >= -200 && rect.top <= 400) : false
      };
    })()`,
    returnByValue: true
  });
  console.log("Hero Link Navigation result:", heroLinkScroll.result.value);

  // -------------------------------------------------------------------------
  // TEST 5: PAUSE MOTION TOGGLE MIDWAY
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 5: Testing Pause Motion Toggle midway ---");
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = document.querySelector('.motion-control');
      if (btn) btn.click();
    })()`
  });
  await sleep(800);

  const pauseCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const docMotion = document.documentElement.dataset.motion;
      const btn = document.querySelector('.motion-control');
      const aaraStage = document.querySelector('.aara-stage');
      const mobileStage = document.querySelector('.ritual-stage');
      return {
        motionDataset: docMotion,
        btnText: btn?.innerText.trim(),
        btnPressed: btn?.getAttribute('aria-pressed'),
        aaraStageTransform: aaraStage ? window.getComputedStyle(aaraStage).transform : null,
        mobileStageTransform: mobileStage ? window.getComputedStyle(mobileStage).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Pause Motion Active:", pauseCheck.result.value);
  await captureScreenshot(ws, "mobile-qa-390-pause-motion-active.png");

  // Unpause
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = document.querySelector('.motion-control');
      if (btn) btn.click();
    })()`
  });
  await sleep(800);

  const unpauseCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      return {
        motionDataset: document.documentElement.dataset.motion,
        btnText: document.querySelector('.motion-control')?.innerText.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log("Motion Resumed:", unpauseCheck.result.value);

  // -------------------------------------------------------------------------
  // TEST 6: FAST SWIPE & REVERSIBLE SCROLL
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 6: Fast Swipe & Reversible Scroll ---");
  // Fast scroll down 1200px
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollBy({ top: 1200, behavior: 'instant' })` });
  await sleep(300);
  // Fast scroll back up 1200px
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollBy({ top: -1200, behavior: 'instant' })` });
  await sleep(500);

  const reverseScrollCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const ritual = document.querySelector('.aara-ritual');
      const title = document.querySelector('#ritual-title');
      return {
        titleVisible: !!title,
        titleOpacity: title ? window.getComputedStyle(title).opacity : null,
        titleTransform: title ? window.getComputedStyle(title).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Reverse Scroll Check:", reverseScrollCheck.result.value);

  ws.close();
  chromeProc.kill();
  console.log("=== All Tests Completed Successfully ===");
}

runQA().catch(err => {
  console.error("QA Error:", err);
  process.exit(1);
});

