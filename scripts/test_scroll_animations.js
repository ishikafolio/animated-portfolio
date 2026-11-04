const { spawn } = require('child_process');
const fs = require('fs');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9229;

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

  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  // Expose ScrollTrigger via client eval if possible
  const initCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      return {
        scrollY: window.scrollY,
        bodyHeight: document.body.scrollHeight,
        packagingOffset: document.querySelector('#packaging')?.getBoundingClientRect().top + window.scrollY,
        aaraOffset: document.querySelector('#showcase-aara')?.getBoundingClientRect().top + window.scrollY
      };
    })()`,
    returnByValue: true
  });
  console.log("Initial page dimensions:", initCheck.result.value);

  const packY = initCheck.result.value.packagingOffset;
  const aaraY = initCheck.result.value.aaraOffset;

  // Let's scroll to packaging start
  console.log("--- Scrolling to Packaging Start ---");
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${packY}, behavior: 'instant' })` });
  await sleep(1000);

  const packStart = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const hero = document.querySelector('.packaging-stage');
      const heading = document.querySelector('.font-cubao');
      const progelato = document.querySelector('#showcase-progelato');
      return {
        scrollY: window.scrollY,
        heroStyle: hero?.getAttribute('style'),
        progelatoOpacity: progelato ? window.getComputedStyle(progelato).opacity : null,
        progelatoTransform: progelato ? window.getComputedStyle(progelato).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Pack Start:", packStart.result.value);

  // Scroll 600px into packaging (middle of progelato pin)
  console.log("--- Scrolling into Packaging Middle ---");
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${packY + 700}, behavior: 'instant' })` });
  await sleep(1000);

  const packMid = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const progelato = document.querySelector('#showcase-progelato');
      return {
        scrollY: window.scrollY,
        progelatoOpacity: progelato ? window.getComputedStyle(progelato).opacity : null,
        progelatoTransform: progelato ? window.getComputedStyle(progelato).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Pack Mid:", packMid.result.value);

  // Scroll to Aara
  console.log("--- Scrolling to Aara ---");
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraY}, behavior: 'instant' })` });
  await sleep(1000);

  const aaraStart = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aaraShowcase = document.querySelector('#showcase-aara .aara-stage');
      const aaraHandoff = document.querySelector('#showcase-aara .aara-ritual');
      return {
        scrollY: window.scrollY,
        stageStyle: aaraShowcase?.getAttribute('style'),
        handoffOpacity: aaraHandoff ? window.getComputedStyle(aaraHandoff.parentElement).opacity : null,
        handoffTransform: aaraHandoff ? window.getComputedStyle(aaraHandoff.parentElement).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Aara Start:", aaraStart.result.value);

  // Scroll into Aara middle
  console.log("--- Scrolling into Aara Middle ---");
  await sendCDP(ws, "Runtime.evaluate", { expression: `window.scrollTo({ top: ${aaraY + 600}, behavior: 'instant' })` });
  await sleep(1000);

  const aaraMid = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aaraHandoff = document.querySelector('#showcase-aara .aara-ritual');
      return {
        scrollY: window.scrollY,
        handoffOpacity: aaraHandoff ? window.getComputedStyle(aaraHandoff.parentElement).opacity : null,
        handoffTransform: aaraHandoff ? window.getComputedStyle(aaraHandoff.parentElement).transform : null
      };
    })()`,
    returnByValue: true
  });
  console.log("Aara Mid:", aaraMid.result.value);

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

