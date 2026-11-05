const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/yoges/.gemini/antigravity/brain/aac49c86-3118-4c80-b174-871ea6c5d0ce';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9561;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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

(async () => {
  console.log('=== AUDITING MOBILE LAYOUT ISSUES (320px, 375px, 390px, 430px, 768px) ===');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=390,844'
  ]);
  await sleep(2000);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');

  const evalCode = (code) =>
    sendCDP(ws, 'Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  const capture = async (filename) => {
    const snap = await sendCDP(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  };

  const testWidths = [320, 375, 390, 430, 768];

  for (const w of testWidths) {
    console.log(`\n----------------- Testing Width: ${w}px -----------------`);
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: w, height: 844, deviceScaleFactor: 2, mobile: true, hasTouch: true });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(3000);

    const overflowAudit = await evalCode(`(() => {
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const winW = window.innerWidth;
      const overflowingElements = [];

      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        // check if element extends past right edge by more than 1px
        if (r.right > winW + 1) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? el.className.toString().slice(0, 80) : '',
            right: Math.round(r.right),
            width: Math.round(r.width),
            diff: Math.round(r.right - winW)
          });
        }
      });

      return {
        viewportWidth: winW,
        docWidth: docW,
        bodyWidth: bodyW,
        hasOverflow: docW > winW || bodyW > winW,
        overflowCount: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 10)
      };
    })()`);

    console.log(`Width ${w}px Audit:`, JSON.stringify(overflowAudit, null, 2));
    await capture(`audit-mobile-${w}px-hero.jpg`);
  }

  // Chapter-specific inspection at 375px
  console.log('\n--- Auditing Chapters at 375px ---');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 375, height: 844, deviceScaleFactor: 2, mobile: true, hasTouch: true });
  await sleep(500);

  const sections = [
    { id: '#intro-logo-folio', name: 'logo-folio' },
    { id: '#chapter-identity', name: 'identity' },
    { id: '#showcase-earthkind', name: 'earthkind' },
    { id: '#showcase-velora-leather', name: 'velora-leather' },
    { id: '#showcase-nexa', name: 'nexa' },
    { id: '#intro-uiux', name: 'uiux-careconnect' },
    { id: '#chapter-packaging', name: 'packaging' },
    { id: '#showcase-aara', name: 'aara' },
    { id: '#showcase-glowbite', name: 'glowbite' },
    { id: '#chapter-social', name: 'social-media' },
    { id: '#chapter-flyers', name: 'flyers' },
    { id: '#chapter-ai-creatives', name: 'ai-creatives' }
  ];

  for (const sec of sections) {
    const info = await evalCode(`(() => {
      const el = document.querySelector('${sec.id}');
      if (!el) return null;
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const r = el.getBoundingClientRect();
      const interactiveButtons = Array.from(el.querySelectorAll('button, a')).map(b => {
        const br = b.getBoundingClientRect();
        return {
          text: b.innerText.trim().slice(0, 30),
          height: Math.round(br.height),
          width: Math.round(br.width),
          isUnder44px: br.height < 44
        };
      }).filter(b => b.isUnder44px);

      return {
        id: sec.id,
        height: Math.round(r.height),
        width: Math.round(r.width),
        under44pxControlsCount: interactiveButtons.length,
        smallControls: interactiveButtons.slice(0, 5)
      };
    })()`);
    console.log(`Chapter ${sec.name}:`, JSON.stringify(info, null, 2));
    await sleep(400);
    await capture(`audit-mobile-375px-${sec.name}.jpg`);
  }

  chrome.kill();
  process.exit(0);
})();

