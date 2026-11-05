const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9574;
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
  await sleep(3500);

  const evalCode = async (expr) => {
    const r = await sendCDP(ws, 'Runtime.evaluate', { expression: expr, returnByValue: true });
    return r?.result?.value;
  };

  const chapters = [
    { name: 'Logo Folio', id: '#chapter-logofolio' },
    { name: 'Brand Identity', id: '#chapter-brand' },
    { name: 'UI/UX Design', id: '#chapter-uiux' },
    { name: 'Packaging Design', id: '#chapter-packaging' },
    { name: 'Social Media', id: '#chapter-social' },
    { name: 'Flyer Design', id: '#chapter-flyers' },
    { name: 'AI Creatives', id: '#chapter-ai' }
  ];

  for (const ch of chapters) {
    await evalCode(`(() => {
      const el = document.querySelector('${ch.id}');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await sleep(400);

    const states = await evalCode(`(() => {
      const lf = document.querySelector('#chapter-logofolio [style*="clip"]')?.style?.clipPath;
      const ui = document.querySelector('.uiux-stage [style*="clip"]')?.style?.clipPath;
      const pkg = document.querySelector('#packaging [style*="clip"]')?.style?.clipPath;
      const sm = document.querySelector('#chapter-social [style*="clip"]')?.style?.clipPath;
      const fl = document.querySelector('#chapter-flyers [style*="clip"]')?.style?.clipPath;
      const ai = document.querySelector('#chapter-ai [style*="clip"]')?.style?.clipPath;
      return { scrollY: Math.round(window.scrollY), lf, ui, pkg, sm, fl, ai };
    })()`);
    console.log(`\n=== Scrolled to ${ch.name} (${ch.id}) at scrollY=${states.scrollY} ===`);
    console.log(states);
  }

  // Also test motion controls (Pause Motion button)
  console.log('\n=== Testing Motion Controls ===');
  const pauseClicked = await evalCode(`(() => {
    const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pause motion') || b.textContent.includes('Resume motion'));
    if (pauseBtn) {
      pauseBtn.click();
      return { clicked: true, text: pauseBtn.textContent.trim() };
    }
    return { clicked: false };
  })()`);
  console.log('Pause Button Clicked:', pauseClicked);
  await sleep(400);

  const motionOffCheck = await evalCode(`(() => {
    const htmlMotion = document.documentElement.getAttribute('data-motion');
    const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume motion'));
    return {
      dataMotion: htmlMotion,
      btnNowSays: pauseBtn ? pauseBtn.textContent.trim() : 'N/A'
    };
  })()`);
  console.log('Motion Paused State:', motionOffCheck);

  // Resume motion
  await evalCode(`(() => {
    const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume motion'));
    if (resumeBtn) resumeBtn.click();
  })()`);
  await sleep(400);

  const motionResumedCheck = await evalCode(`(() => {
    const htmlMotion = document.documentElement.getAttribute('data-motion');
    const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pause motion'));
    return {
      dataMotion: htmlMotion,
      btnNowSays: pauseBtn ? pauseBtn.textContent.trim() : 'N/A'
    };
  })()`);
  console.log('Motion Resumed State:', motionResumedCheck);

  ws.close();
  chrome.kill();
  console.log('\n=== Verification complete! ===');
})();
