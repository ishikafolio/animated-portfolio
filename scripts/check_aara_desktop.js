const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9340;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendCDP(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const handleMsg = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handleMsg);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      } catch (e) {}
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

async function main() {
  const proc = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=1920,900"
  ]);

  await sleep(2000);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const page = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "Emulation.setDeviceMetricsOverride", { width: 1920, height: 900, deviceScaleFactor: 1, mobile: false });
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  const aaraData = await evaluate(ws, `(() => {
    const section = document.querySelector("#showcase-aara");
    section.scrollIntoView({ behavior: 'instant', block: 'start' });
    const stages = Array.from(section.querySelectorAll(".ritual-stage"));
    const visibleStage = stages.find(s => s.offsetParent !== null || s.getBoundingClientRect().width > 0);
    const details = section.querySelector(".ritual-details");
    const container = section.querySelector(".max-w-7xl");
    
    return {
      stagesCount: stages.length,
      visibleStageRect: visibleStage ? visibleStage.getBoundingClientRect() : null,
      detailsRect: details ? details.getBoundingClientRect() : null,
      containerRect: container ? container.getBoundingClientRect() : null,
      sectionHeight: section.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    };
  })()`);
  console.log("AARA DESKTOP METRICS:", JSON.stringify(aaraData, null, 2));

  ws.close();
  proc.kill();
}

main();

