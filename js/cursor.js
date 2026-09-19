/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — CUSTOM CURSOR
 * Uses GSAP quickTo() for high-performance physics-based follower movement.
 * ============================================================================
 */

export function initCursor() {
  // Disable on mobile/tablet or touch screens
  if (window.innerWidth < 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }

  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorText = cursorFollower?.querySelector('.cursor-text');

  if (!cursorDot || !cursorFollower || !window.gsap) {
    return;
  }

  // Create fast GSAP quickTo setters
  const xDotTo = window.gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power3' });
  const yDotTo = window.gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power3' });

  const xFollowerTo = window.gsap.quickTo(cursorFollower, 'x', { duration: 0.35, ease: 'power3' });
  const yFollowerTo = window.gsap.quickTo(cursorFollower, 'y', { duration: 0.35, ease: 'power3' });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Set initial position
  window.gsap.set([cursorDot, cursorFollower], {
    x: mouseX,
    y: mouseY,
    opacity: 0,
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    window.gsap.to([cursorDot, cursorFollower], {
      opacity: 1,
      duration: 0.3,
      overwrite: 'auto',
    });

    xDotTo(mouseX);
    yDotTo(mouseY);
    xFollowerTo(mouseX);
    yFollowerTo(mouseY);
  });

  window.addEventListener('mouseleave', () => {
    window.gsap.to([cursorDot, cursorFollower], {
      opacity: 0,
      duration: 0.3,
    });
  });

  // Attach hover triggers for interactive elements
  function attachCursorHover() {
    // Links and buttons
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, .nav-cta-btn, .hamburger-btn, .service-item, .article-row-item, .vaccine-category-item, .lightbox-btn, .lightbox-nav-btn'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('is-hovering-link');
        window.gsap.to(cursorDot, { scale: 0, duration: 0.2 });
      });

      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('is-hovering-link');
        window.gsap.to(cursorDot, { scale: 1, duration: 0.2 });
      });
    });

    // Image/Media elements with 'VIEW' or 'EXPLORE'
    const viewMediaElements = document.querySelectorAll(
      '.hero-image-frame, .about-image-frame, .team-photo-frame, .pricing-image-wrap, [data-cursor="view"], [data-cursor="explore"], .lightbox-img-frame, [data-lightbox-bound]'
    );

    viewMediaElements.forEach((el) => {
      const customLabel = el.getAttribute('data-cursor-text') || 'EXPAND';

      el.addEventListener('mouseenter', () => {
        if (cursorText) {
          cursorText.textContent = customLabel;
        }
        cursorFollower.classList.add('is-hovering-image');
        window.gsap.to(cursorDot, { scale: 0, duration: 0.2 });
      });

      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('is-hovering-image');
        window.gsap.to(cursorDot, { scale: 1, duration: 0.2 });
      });
    });
  }

  attachCursorHover();

  // Re-attach if DOM changes
  window.addEventListener('cursorRefresh', attachCursorHover);
}
