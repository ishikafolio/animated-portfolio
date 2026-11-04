const { spawn } = require('child_process');

async function test() {
  const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9370',
    '--window-size=1920,900'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9370/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  const send = (m, p={}) => new Promise((resolve, reject) => {
    const id = Math.random();
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === id) {
        ws.removeEventListener('message', h);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 4000));

  const out = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const stage = document.querySelector(".uiux-stage");
      const card = stage ? stage.querySelector("div[class*='bg-[#FAF8FC]']") : null;
      const phone = stage ? stage.querySelector(".care-phone") : null;
      const wrap = stage ? stage.querySelector(".care-phone-wrap") : null;
      
      const aara = document.querySelector("#showcase-aara");
      const aaraStage = aara ? aara.querySelector(".ritual-stage") : null;
      const aaraDetails = aara ? aara.querySelector(".font-cubao") : null;

      return {
        card: card ? { w: card.offsetWidth, h: card.offsetHeight, classes: card.className } : null,
        phone: phone ? { w: phone.offsetWidth, h: phone.offsetHeight, classes: phone.className } : null,
        wrap: wrap ? { w: wrap.offsetWidth, h: wrap.offsetHeight } : null,
        aaraStage: aaraStage ? { w: aaraStage.offsetWidth, h: aaraStage.offsetHeight, classes: aaraStage.className } : null,
        aaraDetails: aaraDetails ? { text: aaraDetails.innerText } : null,
      };
    })()`
  });

  const val = out?.result?.value || out?.value;
  console.log("EXACT SIZES:", JSON.stringify(val, null, 2));

  ws.close();
  proc.kill();
}

test();
