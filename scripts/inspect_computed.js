const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9598;
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

  const evalCode = (expr) => sendCDP(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true }).then(r => r?.result?.value);

  // Disable smooth scroll so instant scroll works
  await evalCode(`document.documentElement.style.scrollBehavior = 'auto'`);

  const tests = [
    {
      name: '1. Logo Folio',
      start: 580,
      end: 1087,
      evalFn: `(() => {
        const el = document.querySelector('#chapter-logofolio [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    },
    {
      name: '2. Brand Identity',
      start: 3216,
      end: 3722,
      evalFn: `(() => {
        const left = document.querySelectorAll('#brand-identity [style*="translate"]')[0]?.style?.transform;
        const right = document.querySelectorAll('#brand-identity [style*="translate"]')[1]?.style?.transform;
        const board = document.querySelector('#brand-identity [style*="scale"]')?.style?.transform;
        return { left, right, board };
      })()`
    },
    {
      name: '3. UI/UX (CareConnect)',
      start: 9514,
      end: 10020,
      evalFn: `(() => {
        const el = document.querySelector('.uiux-stage [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    },
    {
      name: '4. Packaging Design',
      start: 11090,
      end: 11555,
      evalFn: `(() => {
        const el = document.querySelector('#packaging [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    },
    {
      name: '5. Social Media',
      start: 15126,
      end: 15591,
      evalFn: `(() => {
        const el = document.querySelector('#chapter-social [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    },
    {
      name: '6. Flyer Design',
      start: 16424,
      end: 16888,
      evalFn: `(() => {
        const el = document.querySelector('#chapter-flyers [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    },
    {
      name: '7. AI Creatives',
      start: 17867,
      end: 18332,
      evalFn: `(() => {
        const el = document.querySelector('#chapter-ai [style*="clip"]');
        return { clip: el?.style?.clipPath, transform: el?.style?.transform };
      })()`
    }
  ];

  for (const t of tests) {
    console.log(`\n========================================`);
    console.log(`Testing: ${t.name}`);
    console.log(`========================================`);

    const mid = Math.round((t.start + t.end) / 2);
    const points = [
      { label: 'BEFORE START', y: Math.max(0, t.start - 100) },
      { label: 'MIDWAY (50%)', y: mid },
      { label: 'AFTER SETTLE (100%)', y: t.end + 50 }
    ];

    for (const p of points) {
      await evalCode(`window.scrollTo(0, ${p.y})`);
      await sleep(150);
      const res = await evalCode(t.evalFn);
      console.log(`  [${p.label} @ y=${p.y}px]:`, res);
    }
  }

  ws.close();
  chrome.kill();
  console.log('\n=== COMPLETE AUDIT FINISHED ===');
})();
