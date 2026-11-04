let loading: Promise<void> | null = null;
export function loadCubismCore(): Promise<void> {
  if ('Live2DCubismCore' in window) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/vendor/live2d/live2dcubismcore.min.js';
    script.async = true;
    script.onload = () => {
      if ('Live2DCubismCore' in window) resolve();
      else { loading = null; script.remove(); reject(Error('Cubism Core did not initialize')); }
    };
    script.onerror = () => {
      loading = null; script.remove(); reject(Error('Cubism Core could not be loaded'));
    };
    document.head.appendChild(script);
  });
  return loading;
}
