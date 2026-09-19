/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — MAIN ENTRY POINT
 * Master Orchestrator for Luxury Healthcare Experience
 * ============================================================================
 */

import { initLenis } from './smooth-scroll.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import {
  initLoader,
  initHeroAnimation,
  initScrollAnimations,
  initImageReveals,
  initParallax,
  initServiceHover,
  initTeamSlider,
  initVaccinationAccordion,
} from './animations.js';
import { initPageTransitions } from './page-transition.js';
import { initLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Maison Medical] Initializing editorial luxury clinic experience.');

  // Register GSAP Plugins if available
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // 1. Initialize Lenis Smooth Scroll
  initLenis();

  // 2. Initialize Custom Cursor (desktop only)
  initCursor();

  // 3. Initialize Sticky Navigation & Mobile Menu & Appointment Drawer
  initNavigation();

  // 4. Initialize Interactive Page Transitions & Instant In-Page Scrolling
  initPageTransitions();

  // 5. Initialize Accordions & Sliders
  initTeamSlider();
  initVaccinationAccordion();

  // 6. Initialize Luxury Image Lightbox
  initLightbox();

  // 7. Initialize Core Page Animations Immediately for Instant Interactivity
  initHeroAnimation();
  initScrollAnimations();
  initImageReveals();
  initParallax();
  initServiceHover();

  // 8. Handle Preloader (non-blocking, fast, dismissable on click)
  const preloader = document.getElementById('preloader');
  const isHomePage = document.body.classList.contains('page-home');

  if (preloader && isHomePage) {
    initLoader();
  } else if (preloader) {
    preloader.style.display = 'none';
  }

  // Refresh ScrollTrigger after assets finish settling
  window.addEventListener('load', () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  });
});
