const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9558;

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
  console.log('=== STARTING 5-SECTION COMPREHENSIVE VERIFICATION ===');
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
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 88 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  };

  // -------------------------------------------------------------
  // DESKTOP VERIFICATION (1920 x 950)
  // -------------------------------------------------------------
  console.log('\n>>> TESTING DESKTOP (1920 x 950)...');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 950, deviceScaleFactor: 1, mobile: false });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3500);

  // 1. CARECONNECT
  console.log('\n--- 1. Testing CareConnect ---');
  const ccResult = await evalCode(`(() => {
    const wrap = document.querySelector('#intro-uiux');
    const top = wrap.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, top + (wrap.offsetHeight * 0.98));
    if (window.ScrollTrigger) window.ScrollTrigger.update();

    const nav = document.querySelector('header');
    const navH = nav ? nav.getBoundingClientRect().height : 64;
    const card = wrap.querySelector('.shadow-xl.border');
    const phone = wrap.querySelector('.care-phone');
    const phoneWrap = wrap.querySelector('.care-phone-wrap');
    const caption = wrap.querySelector('.care-phone-caption');
    const footer = wrap.querySelector('.uiux-stage footer');
    const duplicateStrip = wrap.querySelector('[aria-label="CareConnect Prototype Tasks"]');

    const cardR = card ? card.getBoundingClientRect() : null;
    const phoneR = phone ? phone.getBoundingClientRect() : null;
    const footerR = footer ? footer.getBoundingClientRect() : null;

    return {
      navH,
      cardBounds: cardR ? { left: Math.round(cardR.left), right: Math.round(cardR.right), height: Math.round(cardR.height) } : null,
      phoneBounds: phoneR ? { top: Math.round(phoneR.top), bottom: Math.round(phoneR.bottom), left: Math.round(phoneR.left), right: Math.round(phoneR.right), height: Math.round(phoneR.height), width: Math.round(phoneR.width) } : null,
      gap: (cardR && phoneR) ? Math.round(phoneR.left - cardR.right) : null,
      phoneClippedTop: phoneR ? phoneR.top < navH : true,
      phoneOverlapsFooter: (phoneR && footerR) ? phoneR.bottom > footerR.top : true,
      hasDuplicateStrip: !!duplicateStrip,
      captionExists: !!caption
    };
  })()`);
  console.log('CareConnect Result:', JSON.stringify(ccResult, null, 2));
  await sleep(600);
  await capture('verified-careconnect-desktop.jpg');

  // 2. AARA
  console.log('\n--- 2. Testing Aara ---');
  const aaraResult = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-aara');
    sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    const arch = sec.querySelector('.ritual-stage');
    const heading = sec.querySelector('#ritual-title');
    const tabs = sec.querySelectorAll('.ritual-options button');
    const desc = sec.querySelector('.ritual-description');
    const btn = sec.querySelector('.ritual-start');
    const footer = sec.querySelector('footer');

    const secR = sec.getBoundingClientRect();
    const archR = arch.getBoundingClientRect();
    const footerR = footer.getBoundingClientRect();

    return {
      sectionHeight: Math.round(secR.height),
      sectionFitsViewport: secR.bottom <= window.innerHeight + 2,
      archBounds: { width: Math.round(archR.width), height: Math.round(archR.height), bottom: Math.round(archR.bottom) },
      archFitsAboveFooter: archR.bottom < footerR.top,
      tabsCount: tabs.length,
      headingText: heading?.innerText,
      footerVisible: footerR.bottom <= window.innerHeight
    };
  })()`);
  console.log('Aara Result:', JSON.stringify(aaraResult, null, 2));
  await sleep(600);
  await capture('verified-aara-desktop.jpg');

  // Test all 5 tabs in Aara to ensure none push layout offscreen
  console.log('\nTesting Aara Tab Switching...');
  for (let i = 0; i < 5; i++) {
    const tabName = await evalCode(`(() => {
      const tabs = document.querySelectorAll('.ritual-options button');
      if (tabs[${i}]) {
        tabs[${i}].click();
        return tabs[${i}].innerText.trim();
      }
      return null;
    })()`);
    await sleep(200);
    const checkFits = await evalCode(`(() => {
      const sec = document.querySelector('#showcase-aara');
      const footer = sec.querySelector('footer');
      return footer ? footer.getBoundingClientRect().bottom <= window.innerHeight : false;
    })()`);
    console.log(`Tab [${i}] "${tabName}": Footer visible in viewport = ${checkFits}`);
  }

  // 3. NEXA
  console.log('\n--- 3. Testing Nexa ---');
  const nexaResult = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-nexa');
    sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    const imgWrap = sec.querySelector('.aspect-\\\\[2\\\\/3\\\\]') || sec.querySelector('img')?.parentElement;
    const nutritionTiles = sec.querySelectorAll('[aria-label="NEXA Nutrition Profile"] > div');
    const heading = sec.querySelector('h3');
    const subnav = sec.querySelector('.border-t.border-white\\\\/10');

    const secR = sec.getBoundingClientRect();
    const imgR = imgWrap?.getBoundingClientRect();

    // Check columns: left column should have nutrition tiles, right column should have image
    const leftCol = sec.querySelector('.lg\\\\:col-span-6:first-child');
    const rightCol = sec.querySelector('.lg\\\\:col-span-6:last-child');
    const leftColR = leftCol?.getBoundingClientRect();
    const rightColR = rightCol?.getBoundingClientRect();

    return {
      cardWidth: Math.round(secR.width),
      cardHeight: Math.round(secR.height),
      headingText: heading?.innerText,
      nutritionTilesCount: nutritionTiles.length,
      hasSubnav: !!subnav,
      imgWidth: imgR ? Math.round(imgR.width) : null,
      imgHeight: imgR ? Math.round(imgR.height) : null,
      imgRatio: imgR ? (imgR.width / imgR.height).toFixed(2) : null,
      leftColLeft: leftColR ? Math.round(leftColR.left) : null,
      rightColLeft: rightColR ? Math.round(rightColR.left) : null,
      artworkIsOnRight: (leftColR && rightColR) ? rightColR.left > leftColR.left : false
    };
  })()`);
  console.log('Nexa Result:', JSON.stringify(nexaResult, null, 2));
  await sleep(600);
  await capture('verified-nexa-desktop.jpg');

  // 4. SOCIAL MEDIA
  console.log('\n--- 4. Testing Social Media ---');
  const socialResult = await evalCode(`(() => {
    const sec = document.querySelector('#chapter-social');
    sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    const tabs = sec.querySelectorAll('header [role="tablist"] button');
    const tabNames = Array.from(tabs).map(b => b.innerText.trim());
    const firstArticle = sec.querySelector('article');
    const imgWrap = firstArticle?.querySelector('.aspect-square');
    const img = imgWrap?.querySelector('img');

    const firstArtR = firstArticle?.getBoundingClientRect();
    const imgWrapR = imgWrap?.getBoundingClientRect();

    return {
      tabNames,
      articleBounds: firstArtR ? { width: Math.round(firstArtR.width), height: Math.round(firstArtR.height) } : null,
      imgWrapBounds: imgWrapR ? { width: Math.round(imgWrapR.width), height: Math.round(imgWrapR.height) } : null,
      hasObjectContain: img ? img.className.includes('object-contain') : false
    };
  })()`);
  console.log('Social Media Result:', JSON.stringify(socialResult, null, 2));
  await sleep(600);
  await capture('verified-social-media-desktop.jpg');

  // Click Tab 2: RED BULL
  console.log('\nSwitching to Campaign 02 (Red Bull)...');
  await evalCode(`(() => {
    const tabs = document.querySelectorAll('#chapter-social header [role="tablist"] button');
    if (tabs[1]) tabs[1].click();
  })()`);
  await sleep(700);
  await capture('verified-social-redbull-desktop.jpg');

  // 5. GLOW BITE
  console.log('\n--- 5. Testing Glow Bite ---');
  const glowResult = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-glowbite');
    sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    const secR = sec.getBoundingClientRect();
    const aaraFooter = document.querySelector('#showcase-aara footer');
    const aaraFooterR = aaraFooter ? aaraFooter.getBoundingClientRect() : null;

    return {
      cardWidth: Math.round(secR.width),
      cardHeight: Math.round(secR.height),
      cardTop: Math.round(secR.top),
      cardBottom: Math.round(secR.bottom),
      aaraFooterIsOffscreen: aaraFooterR ? aaraFooterR.bottom < 0 : true
    };
  })()`);
  console.log('Glow Bite Result:', JSON.stringify(glowResult, null, 2));
  await sleep(600);
  await capture('verified-glowbite-desktop.jpg');

  // -------------------------------------------------------------
  // MOBILE AUDIT (390 x 844)
  // -------------------------------------------------------------
  console.log('\n>>> TESTING MOBILE (390 x 844)...');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, hasTouch: true });
  await sleep(1000);

  const mobileOverflow = await evalCode(`(() => {
    const docW = document.documentElement.scrollWidth;
    const bodyW = document.body.scrollWidth;
    const winW = window.innerWidth;
    return {
      docWidth: docW,
      bodyWidth: bodyW,
      viewportWidth: winW,
      hasHorizontalOverflow: docW > winW || bodyW > winW
    };
  })()`);
  console.log('Mobile Overflow Check:', JSON.stringify(mobileOverflow, null, 2));

  // Capture mobile views
  await evalCode(`(() => {
    const el = document.querySelector('#showcase-aara');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await sleep(500);
  await capture('verified-aara-mobile.jpg');

  await evalCode(`(() => {
    const el = document.querySelector('#showcase-nexa');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await sleep(500);
  await capture('verified-nexa-mobile.jpg');

  console.log('\n=== ALL VERIFICATIONS COMPLETED SUCCESSFULLY ===');
  chrome.kill();
  process.exit(0);
})();

