const { Application, Container, Sprite, Texture, Assets } = require('pixi.js');

async function testPixi() {
  console.log('Testing PixiJS exports:');
  console.log('Application:', typeof Application);
  console.log('Container:', typeof Container);
  console.log('Sprite:', typeof Sprite);
  console.log('Assets:', typeof Assets);
}

testPixi().catch(console.error);

