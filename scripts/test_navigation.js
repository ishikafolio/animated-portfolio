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
  console.log("=== Testing Anchor Navigation and Link Resolution ===");

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

  if (!pageTarget) {
    chromeProc.kill();
    throw new Error("Could not connect to Chrome");
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCDP(ws, "Page.enable");
  await sendCDP(ws, "Runtime.enable");
  await sendCDP(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(1500);

  const navTestResult = await sendCDP(ws, "Runtime.evaluate", {
    expression: `(() => {
      const results = {};

      const heroExploreBtn = document.querySelector('a[href="#work"]');
      results.heroExploreHref = heroExploreBtn ? heroExploreBtn.getAttribute('href') : null;

      const navWorkLink = document.querySelector('header a[href="/#work"], header a[href="#work"]');
      results.navWorkHref = navWorkLink ? navWorkLink.getAttribute('href') : null;

      results.hasWorkTarget = !!document.querySelector('#work');
      results.hasPortfolioTarget = !!document.querySelector('#portfolio');
      results.hasLogoShowcase = !!document.querySelector('#showcase-logo');
      results.hasUiuxShowcase = !!document.querySelector('#showcase-uiux');
      results.hasPackagingShowcase = !!document.querySelector('#showcase-packaging');

      const workEl = document.querySelector('#work');
      const introLogo = document.querySelector('#intro-logo');
      results.workTopEqualsLogoTop = workEl && introLogo ? Math.abs(workEl.offsetTop - introLogo.offsetTop) < 5 : false;

      // Test Chapter Quick Links
      const ch1Link = document.querySelector('#intro-logo a[href="#showcase-logo"]');
      const ch2Link = document.querySelector('#intro-uiux a[href="#showcase-uiux"]');
      const ch3Link = document.querySelector('#intro-packaging a[href="#showcase-packaging"]');
      results.chapterLinksValid = !!(ch1Link && ch2Link && ch3Link);

      return results;
    })()`,
    returnByValue: true
  });

  console.log("Navigation Test Results:\n", JSON.stringify(navTestResult.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

main().catch(console.error);
