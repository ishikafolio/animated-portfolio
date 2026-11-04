const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9245;

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
    "--disable-extensions",
    "--window-size=320,568"
  ]);

  await sleep(1500);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });

  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  const overflowAnalysis = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const results = [];
      const ritual = document.querySelector('.aara-ritual');
      const showcase = document.querySelector('#showcase-aara');
      const stage = document.querySelector('.aara-stage');
      const details = document.querySelector('.ritual-details');
      
      let curr = details;
      while (curr && curr !== document.body) {
        const cs = window.getComputedStyle(curr);
        const rect = curr.getBoundingClientRect();
        results.push({
          tag: curr.tagName,
          id: curr.id,
          className: curr.className.slice(0, 40),
          width: rect.width,
          scrollWidth: curr.scrollWidth,
          styleWidth: cs.width,
          maxWidth: cs.maxWidth,
          minWidth: cs.minWidth,
          display: cs.display,
          gridTemplateColumns: cs.gridTemplateColumns,
          flexDirection: cs.flexDirection,
          transform: cs.transform
        });
        curr = curr.parentElement;
      }

      // Check all elements inside showcase that have width > 320
      const wideElements = [];
      const all = showcase.querySelectorAll('*');
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.width > 320 || r.right > 320) {
          const cs = window.getComputedStyle(el);
          wideElements.push({
            tag: el.tagName,
            className: el.className.slice(0, 30),
            text: (el.innerText || '').slice(0, 25).replace(/\\n/g, ' '),
            width: r.width,
            right: r.right,
            styleWidth: cs.width,
            minWidth: cs.minWidth,
            maxWidth: cs.maxWidth,
            whiteSpace: cs.whiteSpace,
            gridTemplateColumns: cs.gridTemplateColumns,
            transform: cs.transform
          });
        }
      }

      return {
        viewportWidth: window.innerWidth,
        documentClientWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        ancestors: results,
        wideElementsCount: wideElements.length,
        wideElements: wideElements.slice(0, 15)
      };
    })()`,
    returnByValue: true
  });

  console.log("Overflow Analysis at 320px:\n", JSON.stringify(overflowAnalysis.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

