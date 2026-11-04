const { spawn } = require('child_process');

async function main() {
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9360',
    '--window-size=1920,900'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9360/json/list');
  const list = await res.json();
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  const send = (m, p={}) => new Promise(r => {
    const id = Math.random();
    ws.addEventListener('message', function h(e){
      const d = JSON.parse(e.data);
      if (d.id === id) {
        ws.removeEventListener('message', h);
        r(d.result);
      }
    });
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3500));

  const result = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const phones = Array.from(document.querySelectorAll(".care-phone")).map(p => ({
        w: p.offsetWidth,
        h: p.offsetHeight,
        rect: p.getBoundingClientRect(),
        computedWidth: window.getComputedStyle(p).width,
        computedHeight: window.getComputedStyle(p).height,
        parentClass: p.parentElement?.className,
      }));
      const stages = Array.from(document.querySelectorAll(".ritual-stage")).map(s => ({
        w: s.offsetWidth,
        h: s.offsetHeight,
        rect: s.getBoundingClientRect(),
        computedWidth: window.getComputedStyle(s).width,
        computedHeight: window.getComputedStyle(s).height,
        parentClass: s.parentElement?.className,
      }));
      return { phones, stages };
    })()`
  });

  console.log("PHONES & STAGES:", JSON.stringify(result.result.value, null, 2));

  ws.close();
  proc.kill();
}

main();

