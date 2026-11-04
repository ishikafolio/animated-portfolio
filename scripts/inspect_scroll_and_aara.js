const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9228;

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

async function main() {
  console.log("=== Launching Chrome to inspect scroll triggers & Aara layout ===");

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
    console.error("Failed to connect to Chrome!");
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  console.log("Navigating to http://localhost:3000 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(4000);

  // Check reducedMotion dataset and GSAP ScrollTrigger
  const diagnostics = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const htmlDataset = document.documentElement.dataset;
      const motionControlBtn = document.querySelector('.motion-control');
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(t => ({
        id: t.vars.id || 'unnamed',
        trigger: t.trigger ? t.trigger.tagName + '.' + t.trigger.className.slice(0, 30) : null,
        start: t.start,
        end: t.end,
        isActive: t.isActive,
        pin: !!t.pin
      })) : 'ScrollTrigger not global';
      
      const gsapGlobal = typeof window.gsap !== 'undefined';
      const stGlobal = typeof window.ScrollTrigger !== 'undefined';

      // Check hero scene transform
      const heroScene = document.querySelector('.packaging-stage');
      const aaraStage = document.querySelector('.aara-stage');

      return {
        motionDataset: htmlDataset.motion,
        buttonText: motionControlBtn ? motionControlBtn.innerText.trim() : null,
        buttonDisabled: motionControlBtn ? motionControlBtn.disabled : null,
        buttonAriaPressed: motionControlBtn ? motionControlBtn.getAttribute('aria-pressed') : null,
        gsapGlobal,
        stGlobal,
        triggersCount: Array.isArray(triggers) ? triggers.length : triggers,
        triggersList: triggers,
        heroSceneStyle: heroScene ? heroScene.getAttribute('style') : null,
        aaraStageStyle: aaraStage ? aaraStage.getAttribute('style') : null
      };
    })()`,
    returnByValue: true
  });

  console.log("Desktop diagnostics:", JSON.stringify(diagnostics.result.value, null, 2));

  // Now emulate mobile (390x844)
  console.log("\nSwitching to mobile 390x844...");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(1500);

  const mobileDiag = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(t => ({
        id: t.vars.id || 'unnamed',
        trigger: t.trigger ? t.trigger.tagName + '.' + t.trigger.className.slice(0, 30) : null,
        start: t.start,
        end: t.end,
        isActive: t.isActive,
        pin: !!t.pin
      })) : 'ScrollTrigger not global';

      // Inspect Aara elements order
      const ritual = document.querySelector('.aara-ritual');
      const children = ritual ? Array.from(ritual.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        order: window.getComputedStyle(c).order
      })) : [];

      const detailsChildren = document.querySelector('.ritual-details') ? 
        Array.from(document.querySelector('.ritual-details').children).map(c => ({
          tag: c.tagName,
          className: c.className.slice(0, 30),
          text: c.innerText ? c.innerText.slice(0, 30).replace(/\\n/g, ' ') : ''
        })) : [];

      return {
        triggersCount: Array.isArray(triggers) ? triggers.length : triggers,
        triggersList: triggers,
        ritualChildren: children,
        detailsChildren: detailsChildren
      };
    })()`,
    returnByValue: true
  });

  console.log("Mobile diagnostics:", JSON.stringify(mobileDiag.result.value, null, 2));

  ws.close();
  chromeProc.kill();
  console.log("=== Done ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

