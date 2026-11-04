const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9240;

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
    "--window-size=390,844"
  ]);

  await sleep(1500);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  console.log("Navigating to http://localhost:3102 ...");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3102" });
  await sleep(3500);

  const diag = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aara = document.querySelector('#showcase-aara');
      const ritual = document.querySelector('.aara-ritual');
      const tabs = Array.from(document.querySelectorAll('.ritual-options button'));
      const activeTab = tabs.find(t => t.getAttribute('aria-pressed') === 'true');
      const archiveLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Explore Aara archive'));
      return {
        hasAara: !!aara,
        activeTab: activeTab?.innerText.trim(),
        allTabs44: tabs.every(t => t.offsetHeight >= 43.5),
        archiveVisible: !!archiveLink,
        bodyHeight: document.body.scrollHeight,
        docWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    })()`,
    returnByValue: true
  });

  console.log("Port 3102 mobile diagnostics:", diag.result.value);

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

