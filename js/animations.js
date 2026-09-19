/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — CORE ANIMATIONS (GSAP 3 + SCROLLTRIGGER)
 * ============================================================================
 */

/**
 * Robust text splitting helper for editorial line-by-line masked reveals.
 * Splits text by lines and creates overflow-hidden masks.
 */
export function splitTextIntoMaskedLines(element) {
  if (!element) return [];

  // Check if already split
  if (element.getAttribute('data-split-initialized') === 'true') {
    return element.querySelectorAll('.split-line-inner');
  }

  element.setAttribute('data-split-initialized', 'true');
  const rawHtml = element.innerHTML;
  const lines = rawHtml.split(/<br\s*[\/]?>/gi);

  let newHtml = '';
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed) {
      newHtml += `<div class="split-line-wrap" style="overflow: hidden; display: block;">
        <div class="split-line-inner" style="display: block; will-change: transform, opacity;">${trimmed}</div>
      </div>`;
    }
  });

  element.innerHTML = newHtml;
  return element.querySelectorAll('.split-line-inner');
}

/**
 * 01. Preloader Animation
 */
export function initLoader(onComplete) {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.preloader-bar');
  const statusPercent = document.querySelector('.preloader-percent');
  const preloaderInner = document.querySelector('.preloader-inner');

  // If already seen in this session or no preloader/GSAP, skip immediately
  if (!preloader || !window.gsap || sessionStorage.getItem('maison_intro_seen') === 'true') {
    if (preloader) preloader.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  sessionStorage.setItem('maison_intro_seen', 'true');

  let isDismissed = false;
  function finishPreloader() {
    if (isDismissed) return;
    isDismissed = true;
    preloader.style.pointerEvents = 'none';

    window.gsap.to(preloader, {
      yPercent: -100,
      duration: 0.28,
      ease: 'power3.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        if (onComplete) onComplete();
      },
    });
  }

  // Any tap or click immediately skips preloader
  preloader.addEventListener('click', finishPreloader, { once: true });
  preloader.addEventListener('touchstart', finishPreloader, { once: true });

  // Swift progress animation (0.35s)
  const progressObj = { value: 0 };
  const tl = window.gsap.timeline({
    onComplete: finishPreloader,
  });

  tl.to(progressObj, {
    value: 100,
    duration: 0.35,
    ease: 'power2.out',
    onUpdate: () => {
      const p = Math.round(progressObj.value);
      if (progressBar) progressBar.style.width = `${p}%`;
      if (statusPercent) statusPercent.textContent = `${p < 10 ? '0' + p : p}%`;
    },
  });

  tl.to(
    preloaderInner,
    {
      opacity: 0,
      y: -15,
      duration: 0.15,
      ease: 'power2.in',
    },
    '-=0.08'
  );
}

/**
 * 02. Cinematic Hero Entrance Animation
 */
export function initHeroAnimation() {
  if (!window.gsap) return;

  const heroHeading = document.querySelector('.hero-title');
  const heroImageFrame = document.querySelector('.hero-image-frame');
  const heroImage = heroImageFrame?.querySelector('img');
  const heroMeta = document.querySelectorAll('.hero-tag, .hero-subtext-group, .hero-footer-bar');
  const heroBadge = document.querySelector('.rotating-badge-wrap');
  const header = document.querySelector('.site-header');

  const tl = window.gsap.timeline({
    defaults: { ease: 'power4.out' },
    delay: 0.1,
  });

  // Split lines in hero heading
  const headingLines = heroHeading ? splitTextIntoMaskedLines(heroHeading) : [];

  // 1. Navigation fades in
  if (header) {
    tl.fromTo(
      header,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
    );
  }

  // 2. Heading reveals line by line
  if (headingLines.length > 0) {
    tl.fromTo(
      headingLines,
      { yPercent: 105, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.12,
        ease: 'power4.out',
      },
      '-=0.7'
    );
  }

  // 3. Image reveals using clip-path inset(100% 0 0 0) -> inset(0% 0 0 0) with scale
  if (heroImageFrame && heroImage) {
    tl.fromTo(
      heroImageFrame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' },
      '-=1.3'
    );

    tl.fromTo(
      heroImage,
      { scale: 1.18 },
      { scale: 1.05, duration: 1.8, ease: 'power3.out' },
      '-=1.5'
    );
  }

  // 4. Metadata, paragraph, and CTA fade upward
  if (heroMeta.length > 0) {
    tl.fromTo(
      heroMeta,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.14, ease: 'power3.out' },
      '-=1.2'
    );
  }

  // 5. Starburst rotating badge entrance
  if (heroBadge) {
    tl.fromTo(
      heroBadge,
      { scale: 0, opacity: 0, rotate: -45 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.4)' },
      '-=0.8'
    );
  }
}

/**
 * 03. Section Heading Reveals & ScrollTriggers
 */
export function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;

  // Split and reveal section titles
  const revealHeadings = document.querySelectorAll(
    '.section-headline, .about-heading, .health-heading'
  );

  revealHeadings.forEach((heading) => {
    const lines = splitTextIntoMaskedLines(heading);
    if (lines.length > 0) {
      gsap.fromTo(
        lines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });

  // Fade and slide for content blocks
  const contentBlocks = document.querySelectorAll(
    '.about-content-col > *, .pricing-left-headline > *, .health-left-content > *'
  );

  contentBlocks.forEach((block) => {
    gsap.fromTo(
      block,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Philosophy quote reveal
  const quoteSection = document.querySelector('.philosophy-section');
  const quoteText = document.querySelector('.philosophy-quote');
  const quoteAttr = document.querySelector('.philosophy-attribution');

  if (quoteSection && quoteText) {
    gsap.fromTo(
      quoteText,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteSection,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    if (quoteAttr) {
      gsap.fromTo(
        quoteAttr,
        { opacity: 0, letterSpacing: '0.1em' },
        {
          opacity: 1,
          letterSpacing: '0.28em',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: quoteSection,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }

  // Process 3 Columns Reveal
  const processCards = document.querySelectorAll('.process-step-card');
  if (processCards.length > 0) {
    gsap.fromTo(
      processCards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-columns-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Editorial Articles List Reveal
  const articleItems = document.querySelectorAll('.article-row-item');
  if (articleItems.length > 0) {
    gsap.fromTo(
      articleItems,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.articles-editorial-list',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }
}

/**
 * 04. Image Clip-Path Reveals on Scroll
 */
export function initImageReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap } = window;

  const imageFrames = document.querySelectorAll(
    '.about-image-frame, .pricing-image-wrap, .team-photo-frame'
  );

  imageFrames.forEach((frame) => {
    const img = frame.querySelector('img');

    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });
}

/**
 * 05. Parallax Scroll Effect
 */
export function initParallax() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.innerWidth < 1024) return; // Disable parallax on smaller devices

  const { gsap } = window;

  const parallaxImages = document.querySelectorAll('[data-parallax="true"], .about-image-frame img');

  parallaxImages.forEach((img) => {
    gsap.to(img, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement || img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });
}

/**
 * 06. Floating Follower Image on Service Hover
 */
export function initServiceHover() {
  // Only for desktop
  if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

  const serviceItems = document.querySelectorAll('.service-item');
  const floatingContainer = document.querySelector('.floating-service-image');
  const floatingImg = floatingContainer?.querySelector('img');

  if (!serviceItems.length || !floatingContainer || !floatingImg || !window.gsap) return;

  const { gsap } = window;

  // Use gsap.quickTo for ultra-smooth pointer tracking with intentional slight lag
  const setX = gsap.quickTo(floatingContainer, 'x', { duration: 0.45, ease: 'power3' });
  const setY = gsap.quickTo(floatingContainer, 'y', { duration: 0.45, ease: 'power3' });

  // Center the image relative to pointer with offset
  const offsetX = 30;
  const offsetY = -190;

  window.addEventListener('mousemove', (e) => {
    setX(e.clientX + offsetX);
    setY(e.clientY + offsetY);
  });

  serviceItems.forEach((item) => {
    const serviceImgUrl = item.getAttribute('data-image');

    item.addEventListener('mouseenter', () => {
      if (serviceImgUrl) {
        floatingImg.src = serviceImgUrl;
      }
      gsap.to(floatingContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(floatingContainer, {
        opacity: 0,
        scale: 0.85,
        duration: 0.3,
        ease: 'power3.in',
      });
    });
  });
}

/**
 * 07. Team Section Swiper Carousel
 */
export function initTeamSlider() {
  const swiperContainer = document.querySelector('.team-swiper');
  if (!swiperContainer || typeof window.Swiper === 'undefined') return;

  try {
    const teamSwiper = new window.Swiper('.team-swiper', {
      slidesPerView: 1,
      spaceBetween: 40,
      speed: 800,
      loop: true,
      navigation: {
        nextEl: '.team-next-btn',
        prevEl: '.team-prev-btn',
      },
      grabCursor: true,
      keyboard: {
        enabled: true,
      },
    });

    return teamSwiper;
  } catch (err) {
    console.error('[Swiper] Team carousel initialization failed:', err);
  }
}

/**
 * 08. Health / Vaccination Accordion
 */
export function initVaccinationAccordion() {
  const vaccineItems = document.querySelectorAll('.vaccine-category-item');

  vaccineItems.forEach((item) => {
    item.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Close other active items
      vaccineItems.forEach((other) => other.classList.remove('active'));

      if (!wasActive) {
        item.classList.add('active');
      }

      if (window.ScrollTrigger) {
        setTimeout(() => {
          window.ScrollTrigger.refresh();
        }, 400);
      }
    });
  });
}
