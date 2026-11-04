const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9272;

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
    await sendCDP(ws, "Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const info = await sendCDP(ws, "Runtime.evaluate", {
      expression: `(() => {
        const header = document.querySelector('header.fixed');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const aara = document.getElementById('showcase-aara');
        const r = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
        };
        const beforeScrollY = window.scrollY;
        const aaraBeforeTop = aara ? aara.getBoundingClientRect().top : null;
        
        if (aara) {
          aara.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        
        return {
          beforeScrollY,
          aaraBeforeTop,
          afterScrollY: window.scrollY,
          aaraBox: r(aara),
          scrollMarginTop: aara ? window.getComputedStyle(aara).scrollMarginTop : null,
          offsetTop: aara ? aara.offsetTop : null,
        };
      })()`,
      returnByValue: true,
      awaitPromise: true,
    });

    if (info.exceptionDetails) {
      console.error("Evaluation error:", info.exceptionDetails);
    } else {
      console.log("Diagnostic Info:", JSON.stringify(info.result?.value, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    chromeProc.kill();
  }
}

main();
