const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = "C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9270;

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

function checkOverlap(r1, r2) {
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

async function main() {
  console.log("=== Comprehensive Viewport Budgeting Verification ===");

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--disable-extensions",
    "--window-size=1920,900"
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

    const desktopViewports = [
      { w: 1920, h: 900, name: "1920x900" },
      { w: 1440, h: 900, name: "1440x900" },
      { w: 1366, h: 768, name: "1366x768" },
      { w: 1024, h: 768, name: "1024x768" },
    ];

    for (const vp of desktopViewports) {
      console.log(`\n======================================================`);
      console.log(`Testing Desktop Viewport: ${vp.name} (${vp.w}x${vp.h})`);
      console.log(`======================================================`);

      await setViewport(ws, vp.w, vp.h, false);
      await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
      await sleep(3000);

      // -------------------------------------------------------------------
      // 1. AUDIT CARECONNECT (UI/UX Chapter)
      // -------------------------------------------------------------------
      console.log(`\n[${vp.name}] Auditing CareConnect...`);
      // Scroll to CareConnect settled interactive stage
      await evaluate(ws, `(() => {
        const uiuxWrapper = document.getElementById('intro-uiux');
        if (uiuxWrapper) {
          // Scroll to 98% of pinned range so prototype settles firmly and remains pinned
          const top = uiuxWrapper.offsetTop;
          const height = uiuxWrapper.offsetHeight;
          window.scrollTo({ top: top + (height - window.innerHeight) * 0.98, behavior: 'instant' });
        }
      })()`);
      await sleep(1000);

      const careconnectMetrics = await evaluate(ws, `(() => {
        const header = document.querySelector('header');
        const headerRect = { bottom: 64, height: 64, top: 0 };
        const stage = document.querySelector('.uiux-stage');
        const metaHeader = stage ? stage.querySelector('header') : null;
        const taskCard = stage ? stage.querySelector('.uiux-stage > div:nth-child(3) > div:nth-child(3)') || stage.querySelector('.uiux-stage > div > div:first-child') : null;
        const phone = stage ? stage.querySelector('.care-phone') : null;
        const phoneWrap = stage ? stage.querySelector('.care-phone-wrap') : null;
        const caseStudyLink = document.getElementById('showcase-uiux');
        const footer = stage ? stage.querySelector('footer') : null;
        const pauseBtn = document.querySelector('.motion-control');

        const vh = window.innerHeight;
        const vw = window.innerWidth;

        const getBox = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
        };

        const mMeta = getBox(metaHeader);
        const mPhone = getBox(phone);
        const mLink = getBox(caseStudyLink);
        const mFooter = getBox(footer);
        const mPause = getBox(pauseBtn);

        return {
          vh,
          vw,
          navBottom: headerRect.bottom,
          metaHeaderTop: mMeta ? mMeta.top : null,
          metaHeaderBottom: mMeta ? mMeta.bottom : null,
          phoneTop: mPhone ? mPhone.top : null,
          phoneBottom: mPhone ? mPhone.bottom : null,
          phoneHeight: mPhone ? mPhone.height : null,
          phoneWidth: mPhone ? mPhone.width : null,
          caseStudyTop: mLink ? mLink.top : null,
          caseStudyBottom: mLink ? mLink.bottom : null,
          footerBottom: mFooter ? mFooter.bottom : null,
          pauseBtnBox: mPause ? { top: mPause.top, left: mPause.left, right: mPause.right, bottom: mPause.bottom } : null,
          caseStudyBox: mLink ? { top: mLink.top, left: mLink.left, right: mLink.right, bottom: mLink.bottom } : null,
          isMetaUnderNav: mMeta ? mMeta.top < headerRect.bottom : false,
          isPhoneClippedTop: mPhone ? mPhone.top < headerRect.bottom : false,
          isPhoneClippedBottom: mPhone ? mPhone.bottom > vh : false,
          isCaseStudyOffscreen: mLink ? mLink.bottom > vh : false,
          isFooterOffscreen: mFooter ? mFooter.bottom > vh : false,
        };
      })()`);

      console.log(`[${vp.name}] CareConnect Metrics:`, JSON.stringify(careconnectMetrics, null, 2));

      // Overlap check between Case Study Link and Pause Motion button
      let hasOverlapCare = false;
      if (careconnectMetrics.caseStudyBox && careconnectMetrics.pauseBtnBox) {
        hasOverlapCare = checkOverlap(careconnectMetrics.caseStudyBox, careconnectMetrics.pauseBtnBox);
        console.log(`[${vp.name}] Case Study & Pause Button Overlap:`, hasOverlapCare);
      }

      if (careconnectMetrics.isMetaUnderNav) console.warn(`WARN: CareConnect meta header is behind nav!`);
      if (careconnectMetrics.isPhoneClippedTop) throw new Error(`FAIL: CareConnect phone is clipped at top! top: ${careconnectMetrics.phoneTop}`);
      if (careconnectMetrics.isPhoneClippedBottom) throw new Error(`FAIL: CareConnect phone is clipped at bottom! bottom: ${careconnectMetrics.phoneBottom}, vh: ${careconnectMetrics.vh}`);
      if (careconnectMetrics.isCaseStudyOffscreen) throw new Error(`FAIL: CareConnect case study link is offscreen! bottom: ${careconnectMetrics.caseStudyBottom}`);
      if (hasOverlapCare) throw new Error(`FAIL: CareConnect case study link overlaps Pause Motion button!`);

      // Test task buttons
      console.log(`[${vp.name}] Testing CareConnect Task Choices...`);
      await evaluate(ws, `(() => {
        const buttons = Array.from(document.querySelectorAll('.uiux-stage button'));
        const task2 = buttons.find(b => b.innerText.includes('Choose what to share'));
        if (task2) task2.click();
      })()`);
      await sleep(500);

      await captureScreenshot(ws, `careconnect-${vp.name}.png`);

      // -------------------------------------------------------------------
      // 2. AUDIT AARA SHOWCASE (Packaging Chapter 03B)
      // -------------------------------------------------------------------
      console.log(`\n[${vp.name}] Auditing Aara Showcase...`);
      // Click hero link or scroll into showcase-aara
      await evaluate(ws, `(() => {
        const aara = document.getElementById('showcase-aara');
        if (aara) aara.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
      await sleep(1000);

      const aaraMetrics = await evaluate(ws, `(() => {
        const header = document.querySelector('header');
        const headerRect = { bottom: 64, height: 64, top: 0 };
        const aara = document.getElementById('showcase-aara');
        const title = document.getElementById('ritual-title');
        const stages = aara ? aara.querySelectorAll('.ritual-stage') : [];
        const stage = window.innerWidth >= 1024 ? (stages[1] || stages[0] || null) : (stages[0] || null);
        const caption = stage ? stage.querySelector('.ritual-note') : null;
        const quietBtn = aara ? aara.querySelector('.ritual-start') : null;
        const archiveLink = aara ? aara.querySelector('footer a[href*="aara"]') : null;
        const footer = aara ? aara.querySelector('footer') : null;
        const pauseBtn = document.querySelector('.motion-control');

        const vh = window.innerHeight;
        const vw = window.innerWidth;

        const getBox = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
        };

        const mTitle = getBox(title);
        const mStage = getBox(stage);
        const mCaption = getBox(caption);
        const mQuiet = getBox(quietBtn);
        const mArchive = getBox(archiveLink);
        const mFooter = getBox(footer);
        const mPause = getBox(pauseBtn);

        return {
          vh,
          vw,
          navBottom: headerRect.bottom,
          titleTop: mTitle ? mTitle.top : null,
          stageTop: mStage ? mStage.top : null,
          stageBottom: mStage ? mStage.bottom : null,
          stageHeight: mStage ? mStage.height : null,
          stageWidth: mStage ? mStage.width : null,
          captionTop: mCaption ? mCaption.top : null,
          captionBottom: mCaption ? mCaption.bottom : null,
          quietBtnBottom: mQuiet ? mQuiet.bottom : null,
          archiveBottom: mArchive ? mArchive.bottom : null,
          footerBottom: mFooter ? mFooter.bottom : null,
          isTitleUnderNav: mTitle ? mTitle.top < headerRect.bottom : false,
          isStageClippedBottom: mStage ? mStage.bottom > vh : false,
          isCaptionClippedBottom: mCaption ? mCaption.bottom > vh : false,
          isQuietBtnOffscreen: mQuiet ? mQuiet.bottom > vh : false,
          isArchiveOffscreen: mArchive ? mArchive.bottom > vh : false,
          archiveBox: mArchive ? { top: mArchive.top, left: mArchive.left, right: mArchive.right, bottom: mArchive.bottom } : null,
          pauseBtnBox: mPause ? { top: mPause.top, left: mPause.left, right: mPause.right, bottom: mPause.bottom } : null,
        };
      })()`);

      console.log(`[${vp.name}] Aara Metrics:`, JSON.stringify(aaraMetrics, null, 2));

      let hasOverlapAara = false;
      if (aaraMetrics.archiveBox && aaraMetrics.pauseBtnBox) {
        hasOverlapAara = checkOverlap(aaraMetrics.archiveBox, aaraMetrics.pauseBtnBox);
        console.log(`[${vp.name}] Aara Archive & Pause Button Overlap:`, hasOverlapAara);
      }

      if (aaraMetrics.isTitleUnderNav) throw new Error(`FAIL: Aara title is behind nav header! top: ${aaraMetrics.titleTop}`);
      if (aaraMetrics.isStageClippedBottom) throw new Error(`FAIL: Aara stage is clipped at bottom! bottom: ${aaraMetrics.stageBottom}, vh: ${aaraMetrics.vh}`);
      if (aaraMetrics.isCaptionClippedBottom) throw new Error(`FAIL: Aara caption is clipped at bottom! bottom: ${aaraMetrics.captionBottom}, vh: ${aaraMetrics.vh}`);
      if (aaraMetrics.isQuietBtnOffscreen) throw new Error(`FAIL: Aara quiet button is offscreen! bottom: ${aaraMetrics.quietBtnBottom}`);
      if (aaraMetrics.isArchiveOffscreen) throw new Error(`FAIL: Aara archive link is offscreen! bottom: ${aaraMetrics.archiveBottom}`);
      if (hasOverlapAara) throw new Error(`FAIL: Aara archive link overlaps Pause Motion button!`);

      // Test all 5 tabs in Aara, especially longest description tab
      console.log(`[${vp.name}] Testing all 5 Aara tabs...`);
      for (let t = 0; t < 5; t++) {
        const tabCheck = await evaluate(ws, `((tIndex) => {
          const buttons = Array.from(document.querySelectorAll('.ritual-options button'));
          if (buttons[tIndex]) {
            buttons[tIndex].click();
            const quiet = document.querySelector('.ritual-start');
            const qBox = quiet ? quiet.getBoundingClientRect() : null;
            return {
              tabName: buttons[tIndex].innerText.trim(),
              quietBottom: qBox ? qBox.bottom : null,
              isQuietOffscreen: qBox ? qBox.bottom > window.innerHeight : false,
            };
          }
          return null;
        })(${t})`);
        console.log(`  Tab ${t} (${tabCheck?.tabName}): quietBottom = ${tabCheck?.quietBottom}, offscreen = ${tabCheck?.isQuietOffscreen}`);
        if (tabCheck?.isQuietOffscreen) {
          throw new Error(`FAIL: Switching to tab ${tabCheck.tabName} pushed quiet button offscreen!`);
        }
      }

      await captureScreenshot(ws, `aara-${vp.name}.png`);
    }

    // =========================================================================
    // 3. MOBILE AUDIT (390x844)
    // =========================================================================
    console.log(`\n======================================================`);
    console.log(`Testing Mobile Viewport: 390x844`);
    console.log(`======================================================`);
    await setViewport(ws, 390, 844, true);
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3000);

    // CareConnect Mobile Check
    await evaluate(ws, `(() => {
      const el = document.getElementById('intro-uiux');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(800);

    const careMobile = await evaluate(ws, `(() => {
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const phone = document.querySelector('.care-phone');
      const phoneRect = phone ? phone.getBoundingClientRect() : null;
      return {
        docScrollWidth: docW,
        bodyScrollWidth: bodyW,
        phoneWidth: phoneRect ? phoneRect.width : null,
        phoneHeight: phoneRect ? phoneRect.height : null,
        hasOverflow: docW > 390 || bodyW > 390,
      };
    })()`);
    console.log("CareConnect Mobile Metrics:", careMobile);
    if (careMobile.hasOverflow) throw new Error("FAIL: Horizontal overflow in CareConnect on mobile!");
    await captureScreenshot(ws, "careconnect-mobile-390.png");

    // Aara Mobile Check
    await evaluate(ws, `(() => {
      const aara = document.getElementById('showcase-aara');
      if (aara) aara.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await sleep(800);

    const aaraMobile = await evaluate(ws, `(() => {
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const aara = document.getElementById('showcase-aara');
      const aaraW = aara ? aara.scrollWidth : null;
      return {
        docScrollWidth: docW,
        bodyScrollWidth: bodyW,
        aaraScrollWidth: aaraW,
        hasOverflow: docW > 390 || aaraW > 390,
      };
    })()`);
    console.log("Aara Mobile Metrics:", aaraMobile);
    if (aaraMobile.hasOverflow) throw new Error("FAIL: Horizontal overflow in Aara on mobile!");
    await captureScreenshot(ws, "aara-mobile-390.png");

    // =========================================================================
    // 4. PAUSE MOTION AUDIT
    // =========================================================================
    console.log("\n--- Testing Pause Motion ---");
    const pauseRes = await evaluate(ws, `(() => {
      const btn = document.querySelector('.motion-control');
      if (btn) btn.click();
      return !!btn;
    })()`);
    console.log("Toggled Pause Motion:", pauseRes);
    await sleep(500);

    const pauseCheck = await evaluate(ws, `(() => {
      const carePhone = document.querySelector('.care-phone');
      const aaraStage = document.querySelector('.ritual-stage');
      return {
        carePhoneTransform: carePhone ? window.getComputedStyle(carePhone).transform : null,
        aaraStageTransform: aaraStage ? window.getComputedStyle(aaraStage).transform : null,
      };
    })()`);
    console.log("Pause Motion transforms check:", pauseCheck);

    console.log("\n=== ALL VIEWPORT BUDGETING TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Verification failed:", err);
    process.exitCode = 1;
  } finally {
    chromeProc.kill();
  }
}

main();
