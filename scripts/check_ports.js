const { spawn } = require('child_process');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  const chrome = spawn(CHROME_PATH, ['--headless=new', '--remote-debugging-port=9299', '--no-sandbox']);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9299/json/list');
  const list = await res.json();
  const pageTarget = list.find(t => t.type === "page") || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  function cdp(method, params) {
    const id = Math.floor(Math.random() * 100000);
    return new Promise((resolve) => {
      const handler = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === id) { ws.removeEventListener('message', handler); resolve(d.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await cdp('Page.enable');
  await cdp('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 4000));
  const pageInfo = await cdp('Runtime.evaluate', {
    expression: `(() => ({
      href: window.location.href,
      title: document.title,
      earthkind: !!document.getElementById('showcase-earthkind'),
      velora: !!document.getElementById('velora-identity'),
      progelatoLineup: !!document.getElementById('showcase-progelato-lineup'),
      glowbite: !!document.getElementById('glowbite-bar'),
      nexa: !!document.getElementById('nexa-protein'),
      social: !!document.getElementById('chapter-social'),
      flyers: !!document.getElementById('chapter-flyers'),
      ai: !!document.getElementById('chapter-ai'),
      earthkindColors: document.querySelectorAll('#showcase-earthkind button').length,
      socialTabs: document.querySelectorAll('#chapter-social button').length,
      flyerTabs: document.querySelectorAll('#chapter-flyers button').length,
      aiTabs: document.querySelectorAll('#chapter-ai button').length
    }))()`,
    returnByValue: true
  });
  console.log('Page info 3000:', pageInfo.result?.value);

  // Now check 3102
  await cdp('Page.navigate', { url: 'http://localhost:3102' });
  await new Promise(r => setTimeout(r, 4000));
  const pageInfo3102 = await cdp('Runtime.evaluate', {
    expression: `(() => ({
      href: window.location.href,
      title: document.title,
      earthkind: !!document.getElementById('showcase-earthkind'),
      velora: !!document.getElementById('velora-identity'),
      progelatoLineup: !!document.getElementById('showcase-progelato-lineup'),
      glowbite: !!document.getElementById('glowbite-bar'),
      nexa: !!document.getElementById('nexa-protein'),
      social: !!document.getElementById('chapter-social'),
      flyers: !!document.getElementById('chapter-flyers'),
      ai: !!document.getElementById('chapter-ai'),
      earthkindColors: document.querySelectorAll('#showcase-earthkind button').length,
      socialTabs: document.querySelectorAll('#chapter-social button').length,
      flyerTabs: document.querySelectorAll('#chapter-flyers button').length,
      aiTabs: document.querySelectorAll('#chapter-ai button').length
    }))()`,
    returnByValue: true
  });
  console.log('Page info 3102:', pageInfo3102.result?.value);

  chrome.kill();
  process.exit(0);
}

main();
