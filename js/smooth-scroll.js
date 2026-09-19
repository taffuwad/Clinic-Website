/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — SMOOTH SCROLL (LENIS + GSAP INTEGRATION)
 * ============================================================================
 */

let lenisInstance = null;

export function initLenis() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[Lenis] Reduced motion preferred; standard scrolling active.');
    return null;
  }

  // Ensure Lenis constructor is loaded from window or global
  if (typeof window.Lenis === 'undefined') {
    console.warn('[Lenis] Library not detected on window.');
    return null;
  }

  try {
    lenisInstance = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    window.lenis = lenisInstance;

    // Connect Lenis to GSAP ScrollTrigger if GSAP is loaded
    if (window.gsap && window.ScrollTrigger) {
      lenisInstance.on('scroll', window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    console.log('[Lenis] Smooth scrolling initialized.');
    return lenisInstance;
  } catch (err) {
    console.error('[Lenis] Initialization error:', err);
    return null;
  }
}

export function getLenis() {
  return lenisInstance;
}
