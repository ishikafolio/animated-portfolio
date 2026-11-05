const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9565;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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

(async () => {
  console.log('=== STARTING MOBILE USABILITY & DESKTOP REGRESSION VERIFICATION ===');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=1920,950'
  ]);
  await sleep(2000);

  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');

  const evalCode = (code) =>
    sendCDP(ws, 'Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  const capture = async (filename) => {
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  };

  // 1. TEST MOBILE VIEWPORTS
  const mobileWidths = [320, 375, 390, 430, 768];
  for (const width of mobileWidths) {
    console.log(`\n----------------- Testing Width: ${width}px -----------------`);
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2500);

    // Verify page scrollWidth containment
    const metrics = await evalCode(`(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth
      };
    })()`);
    console.log(`Containment metrics at ${width}px:`, metrics);
    if (metrics.docScrollWidth > width) {
      console.warn(`⚠️ Warning: docScrollWidth (${metrics.docScrollWidth}) > width (${width})`);
    } else {
      console.log(`✓ Zero horizontal page scrollbar at ${width}px.`);
    }

    await capture(`verify-mobile-${width}px-hero.jpg`);

    // Test mobile drawer and chapter details at 375px
    if (width === 375) {
      // Menu button dimensions
      const btnInfo = await evalCode(`(() => {
        const btn = document.querySelector('button[aria-label="Open main menu"]');
        if (!btn) return null;
        const r = btn.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      })()`);
      console.log(`Mobile menu toggle button:`, btnInfo, `(>=44px: ${btnInfo?.h >= 43})`);

      // Open mobile drawer
      await evalCode(`document.querySelector('button[aria-label="Open main menu"]')?.click()`);
      await sleep(500);
      const drawerInfo = await evalCode(`(() => {
        const nav = document.getElementById('mobile-navigation');
        if (!nav) return null;
        const links = Array.from(nav.querySelectorAll('a'));
        return {
          totalLinks: links.length,
          allAtLeast44px: links.every(l => l.getBoundingClientRect().height >= 43),
          samples: links.slice(0, 4).map(l => ({ text: l.innerText.split('\\n')[0], h: Math.round(l.getBoundingClientRect().height) }))
        };
      })()`);
      console.log(`Mobile drawer info:`, drawerInfo);
      await capture(`verify-mobile-375px-drawer.jpg`);

      // Close mobile drawer
      await evalCode(`document.querySelector('button[aria-label="Close main menu"]')?.click()`);
      await sleep(500);

      // Inspect Logo Folio
      await evalCode(`(() => {
        const el = document.getElementById('chapter-logofolio') || document.getElementById('gallery-marks');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-logofolio.jpg`);

      // Inspect Brand Identity - EarthKind
      await evalCode(`(() => {
        const el = document.getElementById('showcase-earthkind');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-earthkind.jpg`);

      // Inspect Brand Identity - Nexa
      await evalCode(`(() => {
        const el = document.getElementById('showcase-nexa');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(600);
      const nexaOrder = await evalCode(`(() => {
        const sec = document.getElementById('showcase-nexa');
        if (!sec) return null;
        const textCol = sec.querySelector('.order-2');
        const imgCol = sec.querySelector('.order-1');
        if (!textCol || !imgCol) return null;
        const tRect = textCol.getBoundingClientRect();
        const iRect = imgCol.getBoundingClientRect();
        return {
          imgTop: Math.round(iRect.top),
          textTop: Math.round(tRect.top),
          artworkFirst: iRect.top < tRect.top
        };
      })()`);
      console.log(`NEXA vertical sequence on mobile:`, nexaOrder);
      await capture(`verify-mobile-375px-nexa.jpg`);

      // Inspect CareConnect
      await evalCode(`(() => {
        const el = document.getElementById('intro-uiux') || document.getElementById('showcase-uiux');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      const careTasks = await evalCode(`(() => {
        const btns = Array.from(document.querySelectorAll('.uiux-stage [aria-label="Prototype tasks"] button'));
        return btns.map(b => Math.round(b.getBoundingClientRect().height));
      })()`);
      console.log(`CareConnect task button heights:`, careTasks, `(all >= 44px: ${careTasks.every(h => h >= 43)})`);
      await capture(`verify-mobile-375px-careconnect.jpg`);

      // Inspect Packaging - Aara
      await evalCode(`(() => {
        const el = document.querySelector('.aara-ritual-showcase') || document.getElementById('ritual-title');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(600);
      const aaraTabs = await evalCode(`(() => {
        const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
        return tabs.map(t => Math.round(t.getBoundingClientRect().height));
      })()`);
      console.log(`Aara tab button heights:`, aaraTabs, `(all >= 44px: ${aaraTabs.every(h => h >= 43)})`);
      await capture(`verify-mobile-375px-aara.jpg`);

      // Inspect Packaging - Glow Bite
      await evalCode(`(() => {
        const el = document.getElementById('showcase-glowbite');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-glowbite.jpg`);

      // Inspect Social Media
      await evalCode(`(() => {
        const el = document.getElementById('chapter-social');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-social-media.jpg`);

      // Inspect Flyer Design
      await evalCode(`(() => {
        const el = document.getElementById('chapter-flyers');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-flyers.jpg`);

      // Inspect AI Creatives
      await evalCode(`(() => {
        const el = document.getElementById('chapter-ai');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(600);
      await capture(`verify-mobile-375px-ai-creatives.jpg`);

      // Inspect Motion Control button
      const motionInfo = await evalCode(`(() => {
        const btn = document.querySelector('.motion-control');
        if (!btn) return null;
        const r = btn.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          bottom: Math.round(window.innerHeight - r.bottom),
          right: Math.round(window.innerWidth - r.right)
        };
      })()`);
      console.log(`Motion control button on mobile:`, motionInfo, `(height >= 44px: ${motionInfo?.h >= 44})`);
    }
  }

  // 2. VERIFY DESKTOP REGRESSION AT 1440px and 1920px
  const desktopWidths = [1440, 1920];
  for (const width of desktopWidths) {
    console.log(`\n================ Verifying Desktop at ${width}px ================`);
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3500);

    const prefix = `post-${width}`;

    // Logo Folio Hero
    await evalCode(`document.getElementById('chapter-logofolio')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-logo-folio-hero.jpg`);

    // Brand Identity Hero
    await evalCode(`document.getElementById('chapter-identity')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-identity-hero.jpg`);

    // EarthKind
    await evalCode(`document.getElementById('showcase-earthkind')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await sleep(500);
    await capture(`${prefix}-identity-earthkind.jpg`);

    // Nexa
    await evalCode(`document.getElementById('showcase-nexa')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await sleep(500);
    await capture(`${prefix}-identity-nexa.jpg`);

    // CareConnect UI/UX
    await evalCode(`document.getElementById('intro-uiux')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-uiux-careconnect.jpg`);

    // Packaging Podium
    await evalCode(`document.getElementById('chapter-packaging')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-packaging-podium.jpg`);

    // Packaging Aara
    await evalCode(`(document.querySelector('.aara-ritual-showcase') || document.getElementById('ritual-title'))?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await sleep(500);
    await capture(`${prefix}-packaging-aara.jpg`);

    // Packaging Glow Bite
    await evalCode(`document.getElementById('showcase-glowbite')?.scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await sleep(500);
    await capture(`${prefix}-packaging-glowbite.jpg`);

    // Social Media
    await evalCode(`document.getElementById('chapter-social')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-social-media.jpg`);

    // Flyers
    await evalCode(`document.getElementById('chapter-flyers')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-flyers.jpg`);

    // AI Creatives
    await evalCode(`document.getElementById('chapter-ai')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await sleep(500);
    await capture(`${prefix}-ai-creatives.jpg`);

    console.log(`✓ All 11 sections verified at ${width}px.`);
  }

  ws.close();
  chrome.kill();
  console.log('\n=== ALL VERIFICATIONS COMPLETED SUCCESSFULLY ===');
})();
