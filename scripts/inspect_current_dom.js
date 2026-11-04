const { spawn } = require('child_process');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9555;
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=1920,950'
  ]);
  await sleep(2000);
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const list = await res.json();
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1e6);
    const cb = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === id) {
        ws.removeEventListener('message', cb);
        resolve(d.result);
      }
    };
    ws.addEventListener('message', cb);
    ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await sleep(3500);

  const evalCode = (code) =>
    send('Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  // 1. Aara Dims
  const aaraDims = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-aara');
    if (!sec) return 'not found';
    sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    const arch = sec.querySelector('.ritual-stage');
    const header = sec.querySelector('#ritual-title')?.parentElement;
    const tabs = sec.querySelector('.ritual-options');
    const desc = sec.querySelector('.ritual-description');
    const btn = sec.querySelector('.ritual-start');
    const footer = sec.querySelector('footer');
    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      viewportH: window.innerHeight,
      section: getR(sec),
      arch: getR(arch),
      header: getR(header),
      tabs: getR(tabs),
      desc: getR(desc),
      btn: getR(btn),
      footer: getR(footer)
    };
  })()`);
  console.log('AARA DIMS:', JSON.stringify(aaraDims, null, 2));

  // 2. CareConnect Dims (when scrolled to settled interactive stage)
  const ccDims = await evalCode(`(() => {
    const wrap = document.querySelector('#intro-uiux');
    if (!wrap) return 'not found';
    const top = wrap.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, top + (wrap.offsetHeight * 0.96));
    const stage = wrap.querySelector('.uiux-stage');
    const card = wrap.querySelector('.uiux-stage .bg-\\\\[\\\\#FAF8FC\\\\]') || wrap.querySelector('.shadow-xl.border');
    const phone = wrap.querySelector('.care-phone');
    const caption = wrap.querySelector('.care-phone-caption');
    const footer = wrap.querySelector('footer');
    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      viewportH: window.innerHeight,
      stage: getR(stage),
      card: getR(card),
      phone: getR(phone),
      caption: getR(caption),
      footer: getR(footer)
    };
  })()`);
  console.log('CARECONNECT DIMS:', JSON.stringify(ccDims, null, 2));

  // 3. Social Media Dims
  const socialDims = await evalCode(`(() => {
    const sec = document.querySelector('#chapter-social');
    if (!sec) return 'not found';
    sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    const stage = sec.querySelector('.lg\\\\:h-screen') || sec.firstElementChild;
    const firstArticle = sec.querySelector('article');
    const imgWrap = firstArticle?.querySelector('.aspect-square');
    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      viewportH: window.innerHeight,
      stage: getR(stage),
      firstArticle: getR(firstArticle),
      imgWrap: getR(imgWrap)
    };
  })()`);
  console.log('SOCIAL MEDIA DIMS:', JSON.stringify(socialDims, null, 2));

  // 4. Nexa Dims
  const nexaDims = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-nexa');
    if (!sec) return 'not found';
    sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    const imgWrap = sec.querySelector('.aspect-\\\\[2\\\\/3\\\\]') || sec.querySelector('img')?.parentElement;
    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      viewportH: window.innerHeight,
      card: getR(sec),
      imgWrap: getR(imgWrap)
    };
  })()`);
  console.log('NEXA DIMS:', JSON.stringify(nexaDims, null, 2));

  // 5. Glow Bite Dims
  const glowDims = await evalCode(`(() => {
    const sec = document.querySelector('#showcase-glowbite');
    if (!sec) return 'not found';
    sec.scrollIntoView({ behavior: 'instant', block: 'center' });
    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      viewportH: window.innerHeight,
      card: getR(sec)
    };
  })()`);
  console.log('GLOW BITE DIMS:', JSON.stringify(glowDims, null, 2));

  chrome.kill();
  process.exit(0);
})();
