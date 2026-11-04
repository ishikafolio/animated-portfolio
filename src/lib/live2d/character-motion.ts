export type GazeTarget = { x: number; y: number };
export type CharacterParameters = Record<string, number>;
export type ExpressionParameter = { Id: string; Value: number; Blend?: string };
export type CharacterExpression = { Parameters: ExpressionParameter[]; FadeInTime?: number };

const clamp = (value: number, min = -1, max = 1) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0));
const smooth = (from: number, to: number, seconds: number, rate: number) =>
  from + (to - from) * (1 - Math.exp(-rate * seconds));

/** Frame-rate-independent motion, independent of React and the WebGL renderer. */
export class CharacterMotion {
  private eye = { x: 0, y: 0 };
  private head = { x: 0, y: 0 };
  private elapsed = 0;
  private untilBlink = 4;
  private blinkTime = -1;
  private doubleBlink = false;
  private expression: CharacterParameters = {
    ParamBrowLY: 0, ParamBrowRY: 0, ParamMouthForm: 0, ParamMouthOpenY: 1,
  };
  private desiredExpression = { ...this.expression };
  private expressionRate = 9;

  constructor(private readonly random: () => number = Math.random) {
    this.untilBlink = this.nextBlink();
  }

  private nextBlink() { return 3.2 + this.random() * 4.8; }

  setExpression(expression: CharacterExpression) {
    // Presets affect expression channels only; gaze and blink keep ownership of eyes.
    const allowed = ['ParamBrowLY', 'ParamBrowRY', 'ParamMouthForm', 'ParamMouthOpenY'];
    for (const parameter of expression.Parameters) {
      if (allowed.includes(parameter.Id) && Number.isFinite(parameter.Value)) {
        this.desiredExpression[parameter.Id] = clamp(parameter.Value,
          parameter.Id === 'ParamMouthOpenY' ? 0 : -1, 1);
      }
    }
    this.expressionRate = 4 / Math.max(0.1, expression.FadeInTime ?? 0.45);
  }

  update(deltaSeconds: number, target: GazeTarget, reducedMotion = false): CharacterParameters {
    // Prevent resumed tabs from advancing a large time step through blink/physics.
    const dt = clamp(deltaSeconds, 0, 0.05);
    this.elapsed += reducedMotion ? 0 : dt;
    const x = reducedMotion ? 0 : clamp(target.x);
    const y = reducedMotion ? 0 : clamp(target.y);
    this.eye.x = smooth(this.eye.x, x, dt, 16);
    this.eye.y = smooth(this.eye.y, y, dt, 16);
    this.head.x = smooth(this.head.x, x, dt, 4.2);
    this.head.y = smooth(this.head.y, y, dt, 4.2);

    let eyeOpen = 1;
    if (reducedMotion) {
      this.eye = { x: 0, y: 0 };
      this.head = { x: 0, y: 0 };
      this.blinkTime = -1;
      this.untilBlink = this.nextBlink();
    } else if (this.blinkTime >= 0) {
      this.blinkTime += dt;
      // Fast closure, brief closed hold, slower reopening.
      eyeOpen = this.blinkTime < 0.075 ? 1 - this.blinkTime / 0.075
        : this.blinkTime < 0.11 ? 0
        : Math.min(1, (this.blinkTime - 0.11) / 0.13);
      if (this.blinkTime >= 0.24) {
        this.blinkTime = -1;
        this.untilBlink = this.doubleBlink ? 0.13 : this.nextBlink();
        this.doubleBlink = false;
      }
    } else {
      this.untilBlink -= dt;
      if (this.untilBlink <= 0) {
        this.blinkTime = 0;
        this.doubleBlink = this.random() < 0.15;
      }
    }

    for (const id of Object.keys(this.expression)) {
      this.expression[id] = reducedMotion ? this.desiredExpression[id]
        : smooth(this.expression[id], this.desiredExpression[id], dt, this.expressionRate);
    }
    return {
      ...this.expression,
      ParamEyeBallX: this.eye.x,
      ParamEyeBallY: this.eye.y,
      ParamEyeLOpen: clamp(eyeOpen, 0, 1),
      ParamEyeROpen: clamp(eyeOpen, 0, 1),
      ParamAngleX: this.head.x * 16,
      ParamAngleY: this.head.y * 12,
      ParamAngleZ: this.head.x * -5,
      ParamBodyAngleX: this.head.x * 2,
      ParamBodyAngleZ: this.head.x * -1,
      ParamBreath: reducedMotion ? 0 : (Math.sin(this.elapsed * Math.PI * 2 / 5.4) + 1) / 2,
    };
  }
}

/** A stable face anchor makes a stationary pointer remain a stationary target. */
export function gazeFromPointer(clientX: number, clientY: number, bounds: DOMRect): GazeTarget {
  if (bounds.width <= 0 || bounds.height <= 0) return { x: 0, y: 0 };
  const faceX = bounds.left + bounds.width * 0.53;
  const faceY = bounds.top + bounds.height * 0.2;
  return {
    x: clamp((clientX - faceX) / Math.max(160, bounds.width * 0.65)),
    y: clamp((faceY - clientY) / Math.max(150, bounds.height * 0.45)),
  };
}
