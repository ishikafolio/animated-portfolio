const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9239;

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
    "--window-size=1440,900"
  ]);

  await sleep(1500);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  // Scroll to packaging hero
  await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const p = document.querySelector('#packaging');
      if (p) p.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await sleep(800);

  console.log("Finding and clicking Aara hero link...");
  const clickRes = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const link = document.querySelector('a[href="#showcase-aara"]');
      if (!link) return { found: false };
      link.click();
      return { found: true, text: link.innerText.trim() };
    })()`,
    returnByValue: true
  });
  console.log("Link found:", clickRes.result.value);

  // Wait 3.5s for smooth scroll to finish
  await sleep(3500);

  const landing = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const aara = document.querySelector('#showcase-aara');
      const rect = aara ? aara.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        aaraTopInViewport: rect ? rect.top : null,
        isAaraVisible: rect ? (rect.top >= -100 && rect.top <= 250) : false
      };
    })()`,
    returnByValue: true
  });

  console.log("Landing after smooth scroll:", landing.result.value);

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);
