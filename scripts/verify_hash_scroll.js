const { spawn } = require('child_process');
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--window-size=1440,900'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/list');
    const [t] = await res.json();
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    ws.addEventListener('message', (e) => {
      const d = JSON.parse(e.data);
      if (d.id === 2) {
        console.log('EVAL RESULT:', d.result.result.value);
        ws.close();
        chromeProc.kill();
      }
    });

    ws.send(JSON.stringify({ id: 1, method: 'Page.navigate', params: { url: 'http://localhost:3000/#work' } }));
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: 'document.querySelector("#intro-logo") ? Math.round(document.querySelector("#intro-logo").getBoundingClientRect().top) : "NOT_FOUND"',
            returnByValue: true
          }
        })
      );
    }, 3000);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
  }
}, 1000);
