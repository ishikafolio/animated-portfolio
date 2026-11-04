"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * ArticulatedCanvasCharacter (Option A — Interactive Canvas/WebGL Rig)
 * 
 * Production-Polished 2.5D Anime Character Engine:
 * - 26 discrete anatomical layers rendered natively in WebGL via PixiJS.
 * - Hardware Sclera Stencil Masking (pupils cannot leave eye boundary).
 * - Real-time gaze follow that locks onto cursor position and STAYS fixed when stationary.
 * - Subtle head-follow perspective delay (~500ms lag behind eyes).
 * - Coordinated dual-flap eyelid blinking (upper downstroke, lower upward lift) with double blinks.
 * - Secondary pendulum physics on front bangs and side curls.
 * - Subdued, natural thoracic breathing.
 * - Clean editorial presentation (zero intrusive diagnostic badges on public UI).
 */

const LAYER_PATHS = {
  hairBack: "/character/live2d_layers/00_Hair_Back_Mass.png",
  neckTorso: "/character/live2d_layers/01_Neck_Torso_Clothing.png",
  faceBase: "/character/live2d_layers/02_Face_Base.png",
  mouthSmile: "/character/live2d_layers/02A_Mouth_Smile.png",
  eyebrowR: "/character/live2d_layers/03A_Eyebrow_R.png",
  eyebrowL: "/character/live2d_layers/03B_Eyebrow_L.png",
  scleraR: "/character/live2d_layers/04_Eye_R_Sclera_Inpainted.png",
  irisR: "/character/live2d_layers/05_Eye_R_Iris_Pupil.png",
  eyelashesLowerR: "/character/live2d_layers/06_Eye_R_Eyelashes_Lower.png",
  eyelidLowerR: "/character/live2d_layers/06B_Eye_R_Eyelid_Lower.png",
  eyelidUpperR: "/character/live2d_layers/07_Eye_R_Eyelid_Upper.png",
  eyelashesUpperR: "/character/live2d_layers/08_Eye_R_Eyelashes_Upper.png",
  scleraL: "/character/live2d_layers/09_Eye_L_Sclera_Inpainted.png",
  irisL: "/character/live2d_layers/10_Eye_L_Iris_Pupil.png",
  eyelashesLowerL: "/character/live2d_layers/11_Eye_L_Eyelashes_Lower.png",
  eyelidLowerL: "/character/live2d_layers/11B_Eye_L_Eyelid_Lower.png",
  eyelidUpperL: "/character/live2d_layers/12_Eye_L_Eyelid_Upper.png",
  eyelashesUpperL: "/character/live2d_layers/13_Eye_L_Eyelashes_Upper.png",
  hairSideR: "/character/live2d_layers/14_Hair_Side_Right.png",
  hairSideL: "/character/live2d_layers/15_Hair_Side_Left.png",
  hairBangs: "/character/live2d_layers/16_Hair_Front_Bangs.png",
  glassesFrame: "/character/live2d_layers/17_Glasses_Frame.png",
  glassesHighlight: "/character/live2d_layers/18_Glasses_Highlight.png",
};

export function ArticulatedCanvasCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let app: any = null;
    let cleanupListeners: (() => void) | null = null;

    async function initPixiEngine() {
      if (!canvasRef.current || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

      // Dynamic PixiJS import
      const PIXI = await import("pixi.js");

      if (!isMounted || !canvasRef.current) return;

      const W = 1024;
      const H = 1536;

      app = new PIXI.Application();
      await app.init({
        canvas: canvasRef.current,
        width: W,
        height: H,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        backgroundAlpha: 0,
        antialias: true,
      });

      if (!isMounted) {
        app.destroy(true, { children: true });
        return;
      }

      // Load artwork textures asynchronously
      const assetKeys = Object.keys(LAYER_PATHS) as Array<keyof typeof LAYER_PATHS>;
      const loadPromises = assetKeys.map(async (key) => {
        const tex = await PIXI.Assets.load(LAYER_PATHS[key]);
        return { key, tex };
      });

      const loadedAssets = await Promise.all(loadPromises);
      if (!isMounted) return;

      const textures: Record<string, any> = {};
      loadedAssets.forEach(({ key, tex }) => {
        textures[key] = tex;
      });

      // -----------------------------------------------------------------
      // Hierarchical Scene Graph Setup
      // -----------------------------------------------------------------
      const rootStage = app.stage;

      // 1. Body Container (Thoracic Breathing)
      const bodyContainer = new PIXI.Container();
      rootStage.addChild(bodyContainer);

      // Layer 01: Neck, Torso & Clothing
      const neckTorsoSprite = new PIXI.Sprite(textures.neckTorso);
      bodyContainer.addChild(neckTorsoSprite);

      // 2. Head Container (Pivot at neck base: X: 512, Y: 430)
      const headContainer = new PIXI.Container();
      headContainer.pivot.set(512, 430);
      headContainer.position.set(512, 430);
      bodyContainer.addChild(headContainer);

      // Layer 00: Hair Back Mass (Counter-parallax depth)
      const hairBackSprite = new PIXI.Sprite(textures.hairBack);
      headContainer.addChild(hairBackSprite);

      // Layer 02: Face Skin Base
      const faceBaseSprite = new PIXI.Sprite(textures.faceBase);
      headContainer.addChild(faceBaseSprite);

      // Layer 02A: Mouth & Smile Contour
      const mouthSprite = new PIXI.Sprite(textures.mouthSmile);
      headContainer.addChild(mouthSprite);

      // 3. Eye Right Group (Viewer's Left Eye: Character Right)
      const eyeRContainer = new PIXI.Container();
      headContainer.addChild(eyeRContainer);

      const scleraBaseR = new PIXI.Sprite(textures.scleraR);
      eyeRContainer.addChild(scleraBaseR);

      const scleraMaskR = new PIXI.Sprite(textures.scleraR);
      eyeRContainer.addChild(scleraMaskR);

      const irisR = new PIXI.Sprite(textures.irisR);
      irisR.mask = scleraMaskR; // Hardware stencil mask clamps pupil to eye white
      eyeRContainer.addChild(irisR);

      const eyelidUpperR = new PIXI.Sprite(textures.eyelidUpperR);
      eyelidUpperR.alpha = 0;
      eyeRContainer.addChild(eyelidUpperR);

      const eyelidLowerR = new PIXI.Sprite(textures.eyelidLowerR);
      eyelidLowerR.alpha = 0;
      eyeRContainer.addChild(eyelidLowerR);

      const lashLowerR = new PIXI.Sprite(textures.eyelashesLowerR);
      eyeRContainer.addChild(lashLowerR);

      const lashUpperR = new PIXI.Sprite(textures.eyelashesUpperR);
      eyeRContainer.addChild(lashUpperR);

      // 4. Eye Left Group (Viewer's Right Eye: Character Left)
      const eyeLContainer = new PIXI.Container();
      headContainer.addChild(eyeLContainer);

      const scleraBaseL = new PIXI.Sprite(textures.scleraL);
      eyeLContainer.addChild(scleraBaseL);

      const scleraMaskL = new PIXI.Sprite(textures.scleraL);
      eyeLContainer.addChild(scleraMaskL);

      const irisL = new PIXI.Sprite(textures.irisL);
      irisL.mask = scleraMaskL; // Hardware stencil mask clamps pupil to eye white
      eyeLContainer.addChild(irisL);

      const eyelidUpperL = new PIXI.Sprite(textures.eyelidUpperL);
      eyelidUpperL.alpha = 0;
      eyeLContainer.addChild(eyelidUpperL);

      const eyelidLowerL = new PIXI.Sprite(textures.eyelidLowerL);
      eyelidLowerL.alpha = 0;
      eyeLContainer.addChild(eyelidLowerL);

      const lashLowerL = new PIXI.Sprite(textures.eyelashesLowerL);
      eyeLContainer.addChild(lashLowerL);

      const lashUpperL = new PIXI.Sprite(textures.eyelashesUpperL);
      eyeLContainer.addChild(lashUpperL);

      // 5. Eyebrows Group (Separated R & L)
      const eyebrowsContainer = new PIXI.Container();
      headContainer.addChild(eyebrowsContainer);

      const browR = new PIXI.Sprite(textures.eyebrowR);
      const browL = new PIXI.Sprite(textures.eyebrowL);
      eyebrowsContainer.addChild(browR);
      eyebrowsContainer.addChild(browL);

      // 6. Hair Front Group (Secondary Pendulum Dynamics)
      const hairFrontContainer = new PIXI.Container();
      headContainer.addChild(hairFrontContainer);

      const hairBangs = new PIXI.Sprite(textures.hairBangs);
      hairBangs.pivot.set(512, 120);
      hairBangs.position.set(512, 120);

      const hairSideL = new PIXI.Sprite(textures.hairSideL);
      const hairSideR = new PIXI.Sprite(textures.hairSideR);

      hairFrontContainer.addChild(hairSideL);
      hairFrontContainer.addChild(hairSideR);
      hairFrontContainer.addChild(hairBangs);

      // 7. Transparent Acetate Glasses (Positioned ABOVE eyes)
      const glassesContainer = new PIXI.Container();
      headContainer.addChild(glassesContainer);

      const glassesFrame = new PIXI.Sprite(textures.glassesFrame);
      const glassesHighlight = new PIXI.Sprite(textures.glassesHighlight);
      glassesContainer.addChild(glassesFrame);
      glassesContainer.addChild(glassesHighlight);

      setIsLoaded(true);

      // -----------------------------------------------------------------
      // Accurate Pointer Tracking & Refined Physics
      // -----------------------------------------------------------------
      let targetGazeX = 0;
      let targetGazeY = 0;
      let currentGazeX = 0;
      let currentGazeY = 0;

      let currentHeadX = 0;
      let currentHeadY = 0;
      let hairSwingAngle = 0;

      let breathTime = 0;
      let pointerInside = false;

      // Natural Blinking State Machine
      let blinkState: "idle" | "closing" | "hold" | "opening" = "idle";
      let blinkProgress = 0; // 0 = open, 1 = fully closed
      let blinkTimer = 0;
      let nextBlinkTime = 2.8 + Math.random() * 2.6;
      let isDoubleBlink = false;

      const handlePointerMove = (e: PointerEvent) => {
        if (!canvasRef.current || prefersReducedMotion) return;
        pointerInside = true;

        const rect = canvasRef.current.getBoundingClientRect();
        // Eye position in screen space (character right column anchor)
        const eyeCenterScreenX = rect.left + rect.width * 0.52;
        const eyeCenterScreenY = rect.top + rect.height * 0.22;

        const reachX = Math.max(window.innerWidth * 0.4, 400);
        const reachY = Math.max(window.innerHeight * 0.45, 360);

        // Normalize cursor displacement strictly to [-1.0, 1.0]
        targetGazeX = Math.max(-1, Math.min(1, (e.clientX - eyeCenterScreenX) / reachX));
        targetGazeY = Math.max(-1, Math.min(1, (e.clientY - eyeCenterScreenY) / reachY));
      };

      const handlePointerLeave = () => {
        // Return to neutral pose ONLY when cursor exits the viewport
        pointerInside = false;
        targetGazeX = 0;
        targetGazeY = 0;
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

      // Frame Rate & Render Tick
      const tickerCallback = (ticker: any) => {
        if (!isMounted) return;

        const dt = Math.min(ticker.deltaTime / 60, 0.1);

        // 1. Gaze Interpolation:
        // Responsive spring (~15.0 Hz) leading the head with smooth acceleration/deceleration
        const eyeSpeed = prefersReducedMotion ? 0 : 15.0;
        currentGazeX += (targetGazeX - currentGazeX) * (1 - Math.exp(-dt * eyeSpeed));
        currentGazeY += (targetGazeY - currentGazeY) * (1 - Math.exp(-dt * eyeSpeed));

        // Eye displacement with slight 3/4 perspective differentiation:
        // Right eye (nearer): ±13.0px X, ±8.5px Y
        // Left eye (foreshortened): ±11.8px X, ±7.8px Y
        irisR.position.set(currentGazeX * 13.0, currentGazeY * 8.5);
        irisL.position.set(currentGazeX * 11.8, currentGazeY * 7.8);

        // 2. Damped Head Follow:
        // Subtle, restrained movement following after ~500ms lag (speed ~3.8 Hz)
        const headSpeed = prefersReducedMotion ? 0 : 3.8;
        currentHeadX += (targetGazeX - currentHeadX) * (1 - Math.exp(-dt * headSpeed));
        currentHeadY += (targetGazeY - currentHeadY) * (1 - Math.exp(-dt * headSpeed));

        // Head tilt, yaw, and pitch (restrained and natural)
        headContainer.rotation = currentHeadX * 0.04; // max ~2.3 deg tilt
        headContainer.x = 512 + currentHeadX * 5.5; // max ±5.5px horizontal yaw
        headContainer.y = 430 + currentHeadY * 3.5; // max ±3.5px vertical pitch

        // Back hair counter-parallax
        hairBackSprite.x = -currentHeadX * 3.0;

        // Eyebrows Expressive Lift on Upward Gaze
        const browLift = currentGazeY < -0.1 ? currentGazeY * 3.5 : 0;
        eyebrowsContainer.y = browLift;

        // 3. Secondary Hair Pendulum Dynamics
        const headDelta = (targetGazeX - currentHeadX);
        const targetBangsRotation = -headDelta * 0.045;
        hairSwingAngle += (targetBangsRotation - hairSwingAngle) * (1 - Math.exp(-dt * 6.5));
        hairBangs.rotation = hairSwingAngle;
        hairSideL.x = -headDelta * 3.0;
        hairSideR.x = -headDelta * 3.0;

        // 4. Subdued Thoracic Breathing (Gentle ±1.8px over 3.4s)
        breathTime += dt * 1.85;
        bodyContainer.y = Math.sin(breathTime) * 1.8;

        // 5. Natural Dual-Flap Blinking State Machine
        blinkTimer += dt;
        if (blinkState === "idle") {
          if (blinkTimer >= nextBlinkTime) {
            blinkState = "closing";
            blinkTimer = 0;
            isDoubleBlink = Math.random() < 0.16; // 16% double blink chance
          }
        } else if (blinkState === "closing") {
          blinkProgress += dt / 0.07; // 70ms downstroke
          if (blinkProgress >= 1.0) {
            blinkProgress = 1.0;
            blinkState = "hold";
            blinkTimer = 0;
          }
        } else if (blinkState === "hold") {
          if (blinkTimer >= 0.025) { // 25ms hold
            blinkState = "opening";
          }
        } else if (blinkState === "opening") {
          blinkProgress -= dt / 0.11; // 110ms upstroke
          if (blinkProgress <= 0.0) {
            blinkProgress = 0.0;
            blinkState = "idle";
            blinkTimer = 0;
            nextBlinkTime = isDoubleBlink ? 0.13 : 2.8 + Math.random() * 2.8;
            isDoubleBlink = false;
          }
        }

        // Dual-flap eyelid & eyelash displacement
        const upperEyelidDrop = blinkProgress * 15.0;
        const lowerEyelidRaise = -blinkProgress * 5.0;

        eyelidUpperR.y = upperEyelidDrop;
        eyelidUpperR.alpha = blinkProgress > 0.04 ? 1.0 : 0.0;
        lashUpperR.y = upperEyelidDrop;

        eyelidLowerR.y = lowerEyelidRaise;
        eyelidLowerR.alpha = blinkProgress > 0.04 ? 1.0 : 0.0;
        lashLowerR.y = lowerEyelidRaise;

        eyelidUpperL.y = upperEyelidDrop;
        eyelidUpperL.alpha = blinkProgress > 0.04 ? 1.0 : 0.0;
        lashUpperL.y = upperEyelidDrop;

        eyelidLowerL.y = lowerEyelidRaise;
        eyelidLowerL.alpha = blinkProgress > 0.04 ? 1.0 : 0.0;
        lashLowerL.y = lowerEyelidRaise;
      };

      app.ticker.add(tickerCallback);

      cleanupListeners = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        if (app && app.ticker) {
          app.ticker.remove(tickerCallback);
        }
      };
    }

    initPixiEngine();

    return () => {
      isMounted = false;
      if (cleanupListeners) cleanupListeners();
      if (app) {
        try {
          app.destroy(true, { children: true });
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
      aria-label="Interactive 2.5D Cel-Shaded Anime Character"
    >
      {/* Volumetric Radial Ambient Glow */}
      <div className="absolute w-[110%] h-[110%] -top-[5%] -left-[5%] rounded-full bg-gradient-to-tr from-[#890149]/25 via-[#890149]/10 to-transparent blur-3xl pointer-events-none -z-10 transform-gpu" />

      {/* Primary High-DPI WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain object-bottom drop-shadow-2xl transform-gpu transition-opacity duration-500 pointer-events-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ touchAction: "none" }}
      />

      {/* Subtle Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-[#890149] border-t-transparent animate-spin opacity-60" />
        </div>
      )}
    </div>
  );
}

export default ArticulatedCanvasCharacter;
