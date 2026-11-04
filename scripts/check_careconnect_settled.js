const { spawn } = require('child_process');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9556;
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

  // Scroll to CareConnect settled
  const evalCode = (code) =>
    send('Runtime.evaluate', { expression: code, returnByValue: true }).then(r => r.result?.value);

  const pos = await evalCode(`(() => {
    const wrap = document.querySelector('#intro-uiux');
    const top = wrap.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, top + (wrap.offsetHeight * 0.98));
    if (window.ScrollTrigger) window.ScrollTrigger.update();
    
    const nav = document.querySelector('header.fixed') || document.querySelector('header');
    const navH = nav ? nav.getBoundingClientRect().height : 64;
    const stage = wrap.querySelector('.uiux-stage');
    const card = wrap.querySelector('#intro-uiux .shadow-xl.border');
    const phone = wrap.querySelector('.care-phone');
    const phoneWrap = wrap.querySelector('.care-phone-wrap');
    const caption = wrap.querySelector('.care-phone-caption');
    const footer = wrap.querySelector('.uiux-stage footer');
    const extraStrip = wrap.querySelector('[aria-label="CareConnect Prototype Tasks"]');

    const getR = el => el ? {
      top: Math.round(el.getBoundingClientRect().top),
      bottom: Math.round(el.getBoundingClientRect().bottom),
      left: Math.round(el.getBoundingClientRect().left),
      right: Math.round(el.getBoundingClientRect().right),
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;

    return {
      windowH: window.innerHeight,
      navH,
      stage: getR(stage),
      card: getR(card),
      phone: getR(phone),
      caption: getR(caption),
      footer: getR(footer),
      hasExtraStrip: !!extraStrip,
      gapBetweenCardAndPhone: (phone && card) ? Math.round(phone.getBoundingClientRect().left - card.getBoundingClientRect().right) : null,
      phoneTransform: phoneWrap ? phoneWrap.style.transform : null,
      cardTransform: card ? card.style.transform : null,
      cardComputed: card ? window.getComputedStyle(card).transform : null,
      phoneComputed: phoneWrap ? window.getComputedStyle(phoneWrap).transform : null,
      phoneClippedTop: phone ? phone.getBoundingClientRect().top < navH : false,
      phoneOverlapsFooter: (phone && footer) ? phone.getBoundingClientRect().bottom > footer.getBoundingClientRect().top : false
    };
  })()`);

  console.log('CARECONNECT SETTLED POSITIONS:', JSON.stringify(pos, null, 2));

  chrome.kill();
  process.exit(0);
})();
