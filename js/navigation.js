/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — NAVIGATION & BOOKING DRAWER
 * ============================================================================
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const modalOverlay = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('[data-open-modal="booking"], .nav-cta-btn, .open-booking-trigger');
  const closeModalBtns = document.querySelectorAll('.drawer-close-btn, [data-close-modal]');
  const bookingForm = document.getElementById('appointment-form');
  const bookingSuccessMsg = document.getElementById('booking-success');

  // Sticky header transition on scroll
  if (header && window.ScrollTrigger) {
    window.ScrollTrigger.create({
      start: 'top -50',
      onUpdate: (self) => {
        if (self.direction === 1 || window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      },
    });
  } else if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle
  let isMenuOpen = false;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    hamburgerBtn?.classList.toggle('is-active', isMenuOpen);
    mobileMenu?.classList.toggle('open', isMenuOpen);

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (window.gsap) {
        window.gsap.fromTo(
          mobileLinks,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }

  hamburgerBtn?.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a navigation item is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  // Modal / Appointment Drawer interactions
  function openBookingModal(e) {
    if (e) e.preventDefault();
    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    }
  }

  function closeBookingModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', openBookingModal);
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeBookingModal);
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeBookingModal();
    }
  });

  // Handle ESC key to close modal or mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay?.classList.contains('is-active')) {
        closeBookingModal();
      }
      if (isMenuOpen) {
        toggleMobileMenu();
      }
    }
  });

  // Handle appointment form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('.submit-booking-btn');
      if (submitBtn) {
        submitBtn.textContent = 'RESERVING...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        bookingForm.style.display = 'none';
        if (bookingSuccessMsg) {
          bookingSuccessMsg.classList.add('visible');
        }
      }, 250);
    });
  }
}
