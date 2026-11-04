import { CubismFramework, Option, LogLevel } from '../../vendor/live2d/cubism/live2dcubismframework';
import { CubismUserModel } from '../../vendor/live2d/cubism/model/cubismusermodel';
import { CubismMatrix44 } from '../../vendor/live2d/cubism/math/cubismmatrix44';
import { CubismRenderer_WebGL } from '../../vendor/live2d/cubism/rendering/cubismrenderer_webgl';

let frameworkUsers = 0;
const base = '/character/live2d/';

async function getFile(url, signal, json = false) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw Error(`Character asset failed (${response.status}): ${url}`);
  return json ? response.json() : response.arrayBuffer();
}

/** Uses the official Cubism renderer, clipping, model loader and physics evaluator. */
export async function createCubismEngine(canvas, signal, collectDiagnostics = false) {
  if (!CubismFramework.isStarted()) {
    const options = new Option();
    options.logFunction = (message) => console.info(message);
    options.loggingLevel = LogLevel.LogLevel_Warning;
    if (!CubismFramework.startUp(options)) throw Error('Cubism Framework startup failed');
  }
  if (!CubismFramework.isInitialized()) CubismFramework.initialize();
  frameworkUsers++;
  const user = new CubismUserModel();
  const gl = canvas.getContext('webgl', {
    alpha: true, premultipliedAlpha: true, antialias: true, preserveDrawingBuffer: false,
  });
  const textures = [];
  const parameterIds = new Map();
  let destroyed = false;
  let renderer;
  let frames = 0;
  let blinkClosures = 0, previouslyClosed = false;
  const ranges = {};
  let lastParameters = {};
  /** @type {Record<string, import('./character-motion').CharacterExpression>} */
  let expressions = {};
  let model;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    user.release();
    for (const texture of textures) gl?.deleteTexture(texture);
    if (--frameworkUsers === 0) {
      CubismRenderer_WebGL.doStaticRelease();
      CubismFramework.dispose();
    }
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  };
  try {
    if (!gl) throw Error('WebGL unavailable');
    const settings = await getFile(base + 'Ishika.model3.json', signal, true);
    const refs = settings.FileReferences;
    const [moc, physics, presets] = await Promise.all([
      getFile(base + refs.Moc, signal),
      getFile(base + refs.Physics, signal),
      Promise.all(refs.Expressions.map(async (entry) => [entry.Name,
        await getFile(base + entry.File, signal, true)])),
    ]);
    signal.throwIfAborted();
    user.loadModel(moc, true);
    model = user.getModel();
    if (!model) throw Error('Cubism Core could not load the exported MOC3');
    user.loadPhysics(physics, physics.byteLength);
    expressions = Object.fromEntries(presets);
    user.createRenderer(canvas.width, canvas.height);
    renderer = user.getRenderer();
    renderer.startUp(gl);
    renderer.setIsPremultipliedAlpha(true);
    for (let i = 0; i < refs.Textures.length; i++) {
      const bytes = await getFile(base + refs.Textures[i], signal);
      const image = new Image();
      const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
      try {
        image.src = objectUrl;
        await image.decode();
        signal.throwIfAborted();
        const texture = gl.createTexture();
        if (!texture) throw Error('Could not allocate character texture');
        textures.push(texture);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        renderer.bindTexture(i, texture);
      } finally { URL.revokeObjectURL(objectUrl); }
    }
    const idManager = CubismFramework.getIdManager();
    const display = await getFile(base + refs.DisplayInfo, signal, true);
    for (const entry of display.Parameters) parameterIds.set(entry.Id, idManager.getId(entry.Id));
    user._physics?.stabilization(model);
    return {
      expressions,
      resize(width, height) {
        if (canvas.width === Math.max(1, width) && canvas.height === Math.max(1, height)) return;
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        user.setRenderTargetSize(canvas.width, canvas.height);
      },
      draw(parameters, dt, reducedMotion) {
        if (destroyed) return;
        lastParameters = parameters;
        model.loadParameters();
        for (const [id, value] of Object.entries(parameters)) {
          const handle = parameterIds.get(id);
          if (handle) model.setParameterValueById(handle, value);
        }
        if (!reducedMotion) user._physics?.evaluate(model, Math.min(dt, 0.05));
        else for (const id of ['ParamHairFront', 'ParamHairSide', 'ParamHairBack'])
          model.setParameterValueById(parameterIds.get(id), 0);
        model.update();
        if (collectDiagnostics) {
          for (const id of ['ParamEyeBallX', 'ParamEyeBallY', 'ParamEyeLOpen', 'ParamAngleX', 'ParamAngleY',
            'ParamAngleZ', 'ParamBreath', 'ParamHairFront', 'ParamHairSide', 'ParamHairBack']) {
            const value = model.getParameterValueById(parameterIds.get(id));
            if (!ranges[id]) ranges[id] = { min: value, max: value };
            ranges[id].min = Math.min(ranges[id].min, value);
            ranges[id].max = Math.max(ranges[id].max, value);
          }
          const closed = model.getParameterValueById(parameterIds.get('ParamEyeLOpen')) < 0.01;
          if (closed && !previouslyClosed) blinkClosures++;
          previouslyClosed = closed;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const projection = new CubismMatrix44();
        projection.scale(canvas.height / canvas.width, 1);
        projection.multiplyByMatrix(user.getModelMatrix());
        renderer.setMvpMatrix(projection);
        renderer.setRenderState(null, [0, 0, canvas.width, canvas.height]);
        renderer.drawModel('/vendor/live2d/Shaders/WebGL/');
        frames++;
      },
      inspect() { return { frames, blinkClosures, ranges, parameters: Object.fromEntries(
        Array.from(parameterIds, ([id, handle]) => [id, model.getParameterValueById(handle)])),
        drawables: model.getDrawableCount(), textures: textures.length,
        physics: Boolean(user._physics), coreVersion: window.Live2DCubismCore.Version.csmGetVersion() }; },
      destroy,
    };
  } catch (error) { destroy(); throw error; }
}
