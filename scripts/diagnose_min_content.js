const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9248;

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
      const details = document.querySelector('.ritual-details');
      const ritual = document.querySelector('.aara-ritual');
      
      // Let's test what happens if we set .aara-ritual to min-width: 0 or grid-template-columns: 1fr or width: 100%
      // And test the intrinsic width of each child in isolation
      const childMinContent = Array.from(details.children).map(c => {
        const clone = c.cloneNode(true);
        clone.style.width = 'max-content';
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        document.body.appendChild(clone);
        const maxContentWidth = clone.getBoundingClientRect().width;
        clone.style.width = 'min-content';
        const minContentWidth = clone.getBoundingClientRect().width;
        document.body.removeChild(clone);

        return {
          tag: c.tagName,
          id: c.id,
          text: (c.innerText || '').slice(0, 30).replace(/\\n/g, ' '),
          maxContentWidth,
          minContentWidth
        };
      });

      // Also check .aara-ritual parents and packaging parents!
      let ancestors = [];
      let el = ritual;
      while (el && el !== document.documentElement) {
        ancestors.push({
          tag: el.tagName,
          id: el.id,
          className: el.className.slice(0, 35),
          rectWidth: el.getBoundingClientRect().width,
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          offsetWidth: el.offsetWidth,
          style: el.getAttribute('style')
        });
        el = el.parentElement;
      }

      return {
        childMinContent,
        ancestors
      };
    })()`,
    returnByValue: true
  });

  console.log("Analysis:\n", JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

