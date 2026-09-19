/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — INSTANT & SMOOTH PAGE TRANSITIONS
 * Handles instant in-page anchor scrolling and snappy cross-page navigation.
 * ============================================================================
 */

export function initPageTransitions() {
  const curtain = document.querySelector('.transition-curtain');
  const { gsap } = window;

  // Ensure curtain NEVER blocks user interactions
  if (curtain) {
    curtain.style.pointerEvents = 'none';

    // On page load / show: if curtain is visible, swiftly clear it
    window.addEventListener('pageshow', () => {
      if (gsap) {
        gsap.to(curtain, {
          yPercent: -100,
          duration: 0.24,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(curtain, { yPercent: 100, pointerEvents: 'none' });
          },
        });
      } else {
        curtain.style.transform = 'translateY(-100%)';
      }
    });
  }

  // Smooth scroll helper using Lenis or native scrollTo
  function smoothScrollToTarget(targetSelector) {
    let target = null;

    if (targetSelector === '#top' || targetSelector === '#home') {
      target = document.getElementById('home') || document.getElementById('hero') || document.body;
    } else {
      try {
        target = document.querySelector(targetSelector);
      } catch (err) {
        target = null;
      }
    }

    if (!target) return false;

    // Check if mobile menu is open and close it
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (mobileMenu?.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburgerBtn?.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    if (window.lenis) {
      if (targetSelector === '#top' || targetSelector === '#home') {
        window.lenis.scrollTo(0, { duration: 0.85, immediate: false });
      } else {
        window.lenis.scrollTo(target, { offset: -70, duration: 0.85, immediate: false });
      }
    } else {
      if (targetSelector === '#top' || targetSelector === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const topPos = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }

    return true;
  }

  // Intercept all internal links
  const allLinks = document.querySelectorAll('a[href]');

  allLinks.forEach((link) => {
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    // Skip mailto, tel, javascript, download, or new tab
    if (
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) {
      return;
    }

    link.addEventListener('click', (e) => {
      // Don't intercept if cmd/ctrl key is held
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      const currentUrl = new URL(window.location.href);
      let targetUrl;

      try {
        targetUrl = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      // 1. Check if link points to the SAME page (e.g. #services, /index.html#home on index.html)
      const isSamePath =
        targetUrl.origin === currentUrl.origin &&
        (targetUrl.pathname === currentUrl.pathname ||
          (currentUrl.pathname === '/' && targetUrl.pathname === '/index.html') ||
          (currentUrl.pathname === '/index.html' && targetUrl.pathname === '/'));

      if (isSamePath && targetUrl.hash) {
        // Handle in-page anchor INSTANTLY without page transition curtain or reload
        const scrolled = smoothScrollToTarget(targetUrl.hash);
        if (scrolled) {
          e.preventDefault();
          history.pushState(null, '', targetUrl.hash);

          // Update active navigation state
          document.querySelectorAll('.nav-link').forEach((nl) => nl.classList.remove('active'));
          link.classList.add('active');
          return;
        }
      }

      // If clicking same page with no hash or pointing to #top
      if (isSamePath && (!targetUrl.hash || targetUrl.hash === '#top' || targetUrl.hash === '#home')) {
        e.preventDefault();
        smoothScrollToTarget('#home');
        return;
      }

      // 2. Cross-page navigation: execute snappy, silk-smooth transition
      if (targetUrl.origin === currentUrl.origin) {
        // Internal page link
        e.preventDefault();
        const destination = targetUrl.href;

        if (curtain && gsap) {
          // Swift 0.22s curtain slide up
          gsap.fromTo(
            curtain,
            { yPercent: 100 },
            {
              yPercent: 0,
              duration: 0.22,
              ease: 'power3.inOut',
              onComplete: () => {
                window.location.href = destination;
              },
            }
          );
        } else {
          window.location.href = destination;
        }
      }
    });
  });

  // If page was loaded with a hash (e.g. /index.html#resources), scroll to it after brief layout settle
  if (window.location.hash) {
    setTimeout(() => {
      smoothScrollToTarget(window.location.hash);
    }, 120);
  }
}
