const { spawn } = require('child_process');
const PORT = 9234;

async function main() {
  const cp = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--window-size=1440,900'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const [target] = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(res => ws.onopen = res);

  const evalCdp = (expr) => new Promise(res => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === id) {
        ws.removeEventListener('message', handler);
        res(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  });

  await evalCdp(`location.href = 'http://localhost:3000'`);
  await new Promise(res => setTimeout(res, 3500));

  const link = await evalCdp(`(() => {
    const l = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('03B · AARA'));
    return l ? { href: l.getAttribute('href'), text: l.innerText } : null;
  })()`);
  console.log('Aara link info:', link.result.value);

  // Click it
  await evalCdp(`(() => {
    const l = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('03B · AARA'));
    if (l) l.click();
  })()`);

  await new Promise(res => setTimeout(res, 3000));

  const after = await evalCdp(`(() => {
    const aara = document.querySelector('#showcase-aara');
    return {
      scrollY: window.scrollY,
      aaraOffsetTop: aara ? aara.offsetTop : null,
      aaraBoundingTop: aara ? aara.getBoundingClientRect().top : null
    };
  })()`);

  console.log('After clicking link:', after.result.value);

  ws.close();
  cp.kill();
}

main().catch(console.error);

