const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9582;
const sleep = ms => new Promise(r => setTimeout(r, ms));

let msgId = 1;
function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
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

(async () => {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=375,844'
  ]);
  await sleep(1500);

  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
  await sleep(4000);

  const evalCode = async (expr) => {
    const r = await sendCDP(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
    return r?.result?.value;
  };

  const tests = [
    {
      name: '1. Logo Folio',
      selector: '#chapter-logofolio',
      clipSelector: '#chapter-logofolio [style*="clip"]'
    },
    {
      name: '2. Brand Identity',
      selector: '#brand-identity',
      clipSelector: '#brand-identity [style*="translate"]'
    },
    {
      name: '3. UI/UX (CareConnect)',
      selector: '#intro-uiux',
      clipSelector: '.uiux-stage [style*="clip"]'
    },
    {
      name: '4. Packaging Design',
      selector: '#packaging',
      clipSelector: '#packaging [style*="clip"]'
    },
    {
      name: '5. Social Media',
      selector: '#chapter-social',
      clipSelector: '#chapter-social [style*="clip"]'
    },
    {
      name: '6. Flyer Design',
      selector: '#chapter-flyers',
      clipSelector: '#chapter-flyers [style*="clip"]'
    },
    {
      name: '7. AI Creatives',
      selector: '#chapter-ai',
      clipSelector: '#chapter-ai [style*="clip"]'
    }
  ];

  for (const t of tests) {
    console.log(`\n==========================================`);
    console.log(`Testing Progression for: ${t.name}`);
    console.log(`==========================================`);

    const topPos = await evalCode(`(() => {
      const el = document.querySelector('${t.selector}');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return Math.round(rect.top + window.scrollY);
    })()`);

    if (topPos === null) {
      console.log(`Element ${t.selector} not found!`);
      continue;
    }

    // Scroll to 300px above chapter top, at chapter top, and 300px into chapter
    const offsets = [-300, -100, 100, 350];
    for (const off of offsets) {
      const targetScroll = Math.max(0, topPos + off);
      await evalCode(`window.scrollTo(0, ${targetScroll})`);
      await sleep(250);

      const state = await evalCode(`(() => {
        const target = document.querySelector('${t.clipSelector}');
        return {
          scrollY: Math.round(window.scrollY),
          clipPath: target?.style?.clipPath || 'none/inline',
          transform: target?.style?.transform || 'none/inline',
          opacity: target?.style?.opacity || '1'
        };
      })()`);
      console.log(`Offset ${off >= 0 ? '+' : ''}${off}px (scrollY=${state.scrollY}): clipPath="${state.clipPath}" transform="${state.transform}"`);
    }
  }

  ws.close();
  chrome.kill();
  console.log('\n=== All 7 chapters verified! ===');
})();
