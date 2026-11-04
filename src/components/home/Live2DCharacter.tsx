"use client";
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CharacterMotion, gazeFromPointer, GazeTarget } from '@/lib/live2d/character-motion';
import { loadCubismCore } from '@/lib/live2d/load-core';

const Fallback = dynamic(() => import('./ArticulatedCanvasCharacter'), { ssr: false });
export type CharacterExpressionName = 'Neutral' | 'Happy' | 'Curious' | 'Surprised' | 'Thoughtful';
type Engine = Awaited<ReturnType<typeof import('@/lib/live2d/cubism-engine')['createCubismEngine']>>;
type Props = { expression?: CharacterExpressionName; debug?: boolean; reducedMotionOverride?: boolean };

export default function Live2DCharacter({ expression = 'Neutral', debug = false, reducedMotionOverride }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const motionRef = useRef<CharacterMotion | null>(null);
  const expressionRef = useRef(expression);
  const motionOverrideRef = useRef(reducedMotionOverride);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  useEffect(() => { motionOverrideRef.current = reducedMotionOverride; }, [reducedMotionOverride]);
  useEffect(() => {
    expressionRef.current = expression;
    const preset = engineRef.current?.expressions[expression];
    if (preset) motionRef.current?.setExpression(preset);
  }, [expression]);

  useEffect(() => {
    const element = wrapper.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const abort = new AbortController();
    const motion = new CharacterMotion();
    motionRef.current = motion;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let target: GazeTarget = { x: 0, y: 0 };
    let engine: Engine | null = null;
    let frame = 0, last = 0, lastDebug = 0;
    let visible = true, disposed = false;
    let expressionTimer: ReturnType<typeof setTimeout> | null = null;
    const loadDeadline = setTimeout(() => {
      if (!disposed && !engine) { abort.abort(); setStatus('fallback'); }
    }, 20000);
    const reset = () => { target = { x: 0, y: 0 }; };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { reset(); return; }
      if (!(motionOverrideRef.current ?? media.matches) && visible)
        target = gazeFromPointer(event.clientX, event.clientY, element.getBoundingClientRect());
    };
    const onPointerOut = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    const showExpression = (name: CharacterExpressionName) => {
      const preset = engine?.expressions[name];
      if (preset) motion.setExpression(preset);
    };
    const onTap = (event: PointerEvent) => {
      const r = element.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) return;
      showExpression('Happy');
      if (expressionTimer) clearTimeout(expressionTimer);
      expressionTimer = setTimeout(() => showExpression(expressionRef.current), 1600);
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !engine || !visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      const reducedMotion = motionOverrideRef.current ?? media.matches;
      last = now;
      try {
        engine.draw(motion.update(dt, target, reducedMotion), dt, reducedMotion);
        if (debug && now - lastDebug > 100) {
          surface.dataset.live2dSnapshot = JSON.stringify(engine.inspect());
          surface.dataset.live2dTarget = JSON.stringify(target);
          surface.dataset.live2dReducedMotion = String(reducedMotion);
          lastDebug = now;
        }
      } catch (error) {
        console.warn('Live2D renderer failed; using the preserved character fallback.', error);
        engine.destroy(); engine = null; engineRef.current = null; setStatus('fallback'); return;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      surface.dataset.live2dPaused = String(!visible || document.hidden);
      if (!disposed && engine && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      if (!engine) return;
      const r = element.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.resize(Math.round(r.width * dpr), Math.round(r.height * dpr));
    };
    const onMotionPreference = reset;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (disposed) return;
      cancelAnimationFrame(frame); frame = 0; engine?.destroy(); engine = null;
      engineRef.current = null; setStatus('fallback');
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) reset();
      sync();
    }, { threshold: 0.01 });
    const observer = new ResizeObserver(resize);
    intersection.observe(element); observer.observe(element);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onTap, { passive: true });
    window.addEventListener('blur', reset);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', onMotionPreference);
    surface.addEventListener('webglcontextlost', onContextLost);
    async function initialize() {
      try {
        await loadCubismCore();
        if (disposed || abort.signal.aborted) return;
        const { createCubismEngine } = await import('@/lib/live2d/cubism-engine');
        if (disposed || abort.signal.aborted) return;
        const loaded = await createCubismEngine(surface, abort.signal, debug);
        if (disposed) { loaded.destroy(); return; }
        engine = loaded; engineRef.current = loaded; clearTimeout(loadDeadline);
        showExpression(expressionRef.current); resize(); setStatus('ready'); sync();
      } catch (error) {
        clearTimeout(loadDeadline);
        if (!disposed && !abort.signal.aborted) {
          console.warn('Live2D could not load; using the preserved character fallback.', error);
          setStatus('fallback');
        }
      }
    }
    void initialize();
    return () => {
      disposed = true; abort.abort(); cancelAnimationFrame(frame); clearTimeout(loadDeadline);
      if (expressionTimer) clearTimeout(expressionTimer);
      intersection.disconnect(); observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onTap);
      window.removeEventListener('blur', reset);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', onMotionPreference);
      surface.removeEventListener('webglcontextlost', onContextLost);
      engine?.destroy(); engineRef.current = null; motionRef.current = null;
    };
  }, [debug]);
  return <div ref={wrapper} className="relative w-full h-full select-none pointer-events-none"
    role="img" aria-label="Interactive illustrated portrait of Ishika"
    data-character-runtime={status === 'fallback' ? 'pixi' : 'cubism'} data-character-status={status}>
    {status === 'fallback' ? <div className="absolute inset-0 overflow-hidden [&_canvas]:!w-full [&_canvas]:!h-full"><Fallback /></div> : <>
      <div className="absolute w-[110%] h-[110%] -top-[5%] -left-[5%] rounded-full bg-gradient-to-tr from-[#890149]/25 via-[#890149]/10 to-transparent blur-3xl pointer-events-none -z-10 transform-gpu" />
      <canvas ref={canvas} width={1024} height={1536} aria-hidden="true"
        className={`w-full h-full object-contain object-bottom drop-shadow-2xl transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`} />
      {status === 'loading' && <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#890149] border-t-transparent motion-safe:animate-spin opacity-60" />
      </div>}
    </>}
  </div>;
}
