const { spawn } = require('child_process');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

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
    "--window-size=1440,900"
  ]);

  let pageTarget = null;
  for (let i = 0; i < 20; i++) {
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

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(2500);

  // Click 'Explore Selected Work' button
  const clickResult = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const btn = document.querySelector('a[href="#work"]');
      if (!btn) return { error: "Button not found" };
      btn.click();
      return { clicked: true, href: btn.getAttribute('href') };
    })()`,
    returnByValue: true
  });
  console.log("Click result:", clickResult.result.value);

  await sleep(1000);

  // Check scroll position
  const scrollCheck = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const intro = document.querySelector('#intro-logo');
      const rect = intro.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        introTopInViewport: Math.round(rect.top),
        introBottomInViewport: Math.round(rect.bottom),
        isVisible: rect.top < window.innerHeight && rect.bottom > 0
      };
    })()`,
    returnByValue: true
  });
  console.log("Scroll check after clicking Explore Selected Work:", scrollCheck.result.value);

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);

