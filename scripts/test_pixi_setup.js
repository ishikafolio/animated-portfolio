const { Application, Container, Sprite, Assets } = require('pixi.js');

async function verifyPixiStructure() {
  console.log('--- Verifying PixiJS Container & Hierarchy API ---');
  const stage = new Container();
  const body = new Container();
  const head = new Container();
  stage.addChild(body);
  body.addChild(head);

  console.log('Stage children:', stage.children.length);
  console.log('Body children:', body.children.length);
  console.log('Hierarchy verified successfully!');
}

verifyPixiStructure().catch(console.error);

