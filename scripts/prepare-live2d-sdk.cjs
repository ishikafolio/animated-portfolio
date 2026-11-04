// Run with the path to an official, licensed Cubism SDK for Web archive extraction.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const sdk = path.resolve(process.argv[2] || '');
const project = path.resolve(__dirname, '..');
const core = path.join(sdk, 'Core/live2dcubismcore.min.js');
if (!fs.existsSync(core)) throw Error('Expected an extracted official Cubism SDK for Web');
const destination = path.join(project, 'src/vendor/live2d/cubism');
function transpile(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) { transpile(source); continue; }
    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) continue;
    const target = path.join(destination, path.relative(path.join(sdk, 'Framework/src'), source)).replace(/\.ts$/, '.js');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const output = ts.transpileModule(fs.readFileSync(source, 'utf8'), { compilerOptions: {
      target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, removeComments: false,
    }}).outputText.replace(/^[\t ]*\/\/ eslint-disable-next-line @typescript-eslint\/no-namespace[^\r\n]*$/gm, '');
    fs.writeFileSync(target, output);
  }
}
transpile(path.join(sdk, 'Framework/src'));
const publicRoot = path.join(project, 'public/vendor/live2d');
fs.mkdirSync(publicRoot, { recursive: true });
fs.copyFileSync(core, path.join(publicRoot, 'live2dcubismcore.min.js'));
fs.cpSync(path.join(sdk, 'Framework/Shaders'), path.join(publicRoot, 'Shaders'), { recursive: true });
const notices = path.join(publicRoot, 'licenses');
fs.mkdirSync(notices, { recursive: true });
for (const [source, name] of [
  ['Core/LICENSE.md', 'Core-LICENSE.md'], ['Core/RedistributableFiles.txt', 'RedistributableFiles.txt'],
  ['Framework/LICENSE.md', 'Framework-LICENSE.md'],
]) fs.copyFileSync(path.join(sdk, source), path.join(notices, name));
fs.writeFileSync(path.join(notices, 'SDK-PROVENANCE.json'), JSON.stringify({
  source: 'https://www.live2d.com/en/sdk/download/web/', version: 'Cubism SDK for Web 5 R5',
  archive: 'CubismSdkForWeb-5-r.5.zip',
  coreSha256: crypto.createHash('sha256').update(fs.readFileSync(core)).digest('hex'),
  coreModified: false,
  framework: 'Official Framework TypeScript compiled to ES2020 JavaScript; obsolete TypeScript-only namespace lint directives removed; copyright comments retained',
}, null, 2) + '\n');
console.log('Official SDK Core, compiled Framework, shaders and notices prepared.');
