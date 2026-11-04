const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9246;

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

  const evalRes = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      try {
        const showcase = document.querySelector('#showcase-aara');
        const ritual = document.querySelector('.aara-ritual');
        const details = document.querySelector('.ritual-details');
        const h2 = document.querySelector('#ritual-title');
        
        return {
          windowInnerWidth: window.innerWidth,
          showcaseClientWidth: showcase ? showcase.clientWidth : null,
          showcaseScrollWidth: showcase ? showcase.scrollWidth : null,
          ritualComputedDisplay: ritual ? window.getComputedStyle(ritual).display : null,
          ritualComputedGridCols: ritual ? window.getComputedStyle(ritual).gridTemplateColumns : null,
          ritualWidth: ritual ? ritual.getBoundingClientRect().width : null,
          detailsWidth: details ? details.getBoundingClientRect().width : null,
          h2Width: h2 ? h2.getBoundingClientRect().width : null,
          h2ScrollWidth: h2 ? h2.scrollWidth : null,
          h2Text: h2 ? h2.innerText : null
        };
      } catch (err) {
        return { error: err.message, stack: err.stack };
      }
    })()`,
    returnByValue: true
  });

  console.log("Eval result:", JSON.stringify(evalRes, null, 2));

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

