const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9238;

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
  const cp = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-sandbox",
    "--window-size=1440,900"
  ]);

  await sleep(1500);
  const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const [t] = await r.json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(res => ws.onopen = res);

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");

  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(3500);

  const res = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyLen: document.body ? document.body.innerHTML.length : 0,
        bodyText: document.body ? document.body.innerText.slice(0, 200) : null
      };
    })()`,
    returnByValue: true
  });

  console.log("Page info:", JSON.stringify(res.result.value, null, 2));

  ws.close();
  cp.kill();
}

main().catch(console.error);

