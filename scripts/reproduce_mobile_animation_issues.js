const { spawn } = require('child_process');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9568;

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
  console.log('=== REPRODUCING MOBILE ANIMATION ISSUES AT 375px ===');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=375,844'
  ]);
  await sleep(2000);

  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
    hasTouch: true
  });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3000);

  const evalCode = (code) =>
    sendCDP(ws, 'Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  // Audit ScrollTriggers registered in GSAP on mobile
  const stAudit = await evalCode(`(() => {
    if (!window.ScrollTrigger) return { error: "No ScrollTrigger found" };
    const triggers = window.ScrollTrigger.getAll();
    return triggers.map(t => {
      const trigEl = t.trigger;
      return {
        id: t.vars.id || '',
        triggerClass: trigEl ? trigEl.className?.slice?.(0, 30) : '',
        triggerTag: trigEl ? trigEl.tagName : '',
        start: t.start,
        end: t.end,
        scrub: !!t.vars.scrub,
        pin: !!t.vars.pin
      };
    });
  })()`);

  console.log(`\nRegistered ScrollTriggers on Mobile (${stAudit.length} total):`);
  stAudit.forEach((t, i) => {
    console.log(`  [${i + 1}] <${t.triggerTag}> class="${t.triggerClass}..." scrub=${t.scrub} pin=${t.pin}`);
  });

  // Check specific chapter elements:
  const chaptersAudit = await evalCode(`(() => {
    const results = {};

    // 1. Logo Folio
    const lfMask = document.querySelector('#chapter-logofolio [style*="clip-path"]') || document.querySelector('#chapter-logofolio [style*="clipPath"]');
    results.logoFolio = {
      hasMaskAperture: !!lfMask,
      maskStyle: lfMask ? lfMask.style.clipPath : 'N/A'
    };

    // 2. Brand Identity
    const biCurtains = document.querySelectorAll('#brand-identity [class*="curtain"], #brand-identity [style*="translate"]');
    results.brandIdentity = {
      curtainsFound: biCurtains.length
    };

    // 3. UI/UX
    const uiConstellation = document.querySelector('.uiux-stage [style*="clipPath"], .uiux-stage [style*="clip-path"]');
    results.uiUx = {
      hasHeroAperture: !!uiConstellation,
      apertureStyle: uiConstellation ? uiConstellation.style.clipPath : 'N/A'
    };

    // 4. Packaging
    const pkgMask = document.querySelector('#packaging [style*="clipPath"], #packaging [style*="clip-path"]');
    results.packaging = {
      hasPodiumMask: !!pkgMask,
      maskStyle: pkgMask ? pkgMask.style.clipPath : 'N/A'
    };

    // 5. Social Media
    const smMask = document.querySelector('#chapter-social [style*="clipPath"], #chapter-social [style*="clip-path"]');
    results.socialMedia = {
      hasPanelMask: !!smMask,
      maskStyle: smMask ? smMask.style.clipPath : 'N/A'
    };

    // 6. Flyer Design
    const flMask = document.querySelector('#chapter-flyers [style*="clipPath"], #chapter-flyers [style*="clip-path"]');
    results.flyerDesign = {
      hasPaperMask: !!flMask,
      maskStyle: flMask ? flMask.style.clipPath : 'N/A'
    };

    // 7. AI Creatives
    const aiMask = document.querySelector('#chapter-ai [style*="clipPath"], #chapter-ai [style*="clip-path"]');
    results.aiCreatives = {
      hasDepthMask: !!aiMask,
      maskStyle: aiMask ? aiMask.style.clipPath : 'N/A'
    };

    return results;
  })()`);

  console.log('\nChapter Masks & Apertures Initial State on Mobile:', JSON.stringify(chaptersAudit, null, 2));

  // Now simulate scrolling down through each chapter and check if any clipPath changes!
  console.log('\n--- Simulating Touch Scroll Down Page ---');
  for (let scrollY = 0; scrollY <= 6000; scrollY += 1000) {
    await evalCode(`window.scrollTo(0, ${scrollY})`);
    await sleep(200);
    const clipStates = await evalCode(`(() => {
      const lf = document.querySelector('#chapter-logofolio [style*="clip"]')?.style?.clipPath;
      const pkg = document.querySelector('#packaging [style*="clip"]')?.style?.clipPath;
      const sm = document.querySelector('#chapter-social [style*="clip"]')?.style?.clipPath;
      const fl = document.querySelector('#chapter-flyers [style*="clip"]')?.style?.clipPath;
      const ai = document.querySelector('#chapter-ai [style*="clip"]')?.style?.clipPath;
      return { scrollY: window.scrollY, lf, pkg, sm, fl, ai };
    })()`);
    console.log(`ScrollY = ${clipStates.scrollY}px:`, {
      LogoFolio: clipStates.lf,
      Packaging: clipStates.pkg,
      SocialMedia: clipStates.sm,
      Flyers: clipStates.fl,
      Ai: clipStates.ai
    });
  }

  ws.close();
  chrome.kill();
  console.log('=== AUDIT FINISHED ===');
})();

