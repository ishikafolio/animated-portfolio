const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9247;

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
      const children = Array.from(details.children).map(c => {
        const cs = window.getComputedStyle(c);
        const r = c.getBoundingClientRect();
        return {
          tag: c.tagName,
          className: c.className.slice(0, 30),
          id: c.id,
          text: (c.innerText || '').slice(0, 30).replace(/\\n/g, ' '),
          width: r.width,
          scrollWidth: c.scrollWidth,
          offsetWidth: c.offsetWidth,
          csWidth: cs.width,
          minWidth: cs.minWidth,
          maxWidth: cs.maxWidth,
          whiteSpace: cs.whiteSpace,
          overflowWrap: cs.overflowWrap,
          wordBreak: cs.wordBreak
        };
      });

      // Also check the arched artwork frame
      const stage = document.querySelector('.ritual-stage');
      const stageCs = stage ? window.getComputedStyle(stage) : null;
      const stageRect = stage ? stage.getBoundingClientRect() : null;

      // Check tabs container
      const tabs = document.querySelector('.ritual-options');
      const tabsCs = tabs ? window.getComputedStyle(tabs) : null;
      const tabsRect = tabs ? tabs.getBoundingClientRect() : null;

      return {
        ritualDisplay: window.getComputedStyle(ritual).display,
        ritualGridCols: window.getComputedStyle(ritual).gridTemplateColumns,
        detailsMinWidth: window.getComputedStyle(details).minWidth,
        detailsWidth: details.getBoundingClientRect().width,
        stage: {
          width: stageRect ? stageRect.width : null,
          minHeight: stageCs ? stageCs.minHeight : null,
          borderRadius: stageCs ? stageCs.borderRadius : null
        },
        tabs: {
          width: tabsRect ? tabsRect.width : null,
          display: tabsCs ? tabsCs.display : null,
          flexWrap: tabsCs ? tabsCs.flexWrap : null
        },
        children
      };
    })()`,
    returnByValue: true
  });

  console.log("Details contents:\n", JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

