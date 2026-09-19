/**
 * ============================================================================
 * MAISON MEDICAL CLINIC — LUXURY IMAGE LIGHTBOX VIEWER
 * Provides instant, high-definition modal viewing for any clinic photograph.
 * ============================================================================
 */

export function initLightbox() {
  // Ensure lightbox container exists in DOM or create it
  let lightbox = document.getElementById('image-lightbox-modal');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox-modal';
    lightbox.className = 'image-lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image Lightbox Preview');
    lightbox.innerHTML = `
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-container">
        <div class="lightbox-top-bar">
          <div class="lightbox-tag-wrap">
            <span class="lightbox-tag" id="lightbox-category">CLINICAL ARCHITECTURE</span>
            <span class="lightbox-counter" id="lightbox-counter">01 / 04</span>
          </div>
          <div class="lightbox-actions">
            <button class="lightbox-btn zoom-btn" id="lightbox-zoom-toggle" aria-label="Toggle image zoom" title="Toggle zoom">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14" class="zoom-plus-vert"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span class="lightbox-btn-text">ZOOM</span>
            </button>
            <button class="lightbox-btn close-btn" id="lightbox-close-btn" data-lightbox-close aria-label="Close image viewer" title="Close (Esc)">
              <span class="close-symbol">&times;</span>
              <span class="lightbox-btn-text">CLOSE</span>
            </button>
          </div>
        </div>

        <div class="lightbox-viewport">
          <button class="lightbox-nav-btn prev" id="lightbox-prev-btn" aria-label="Previous photograph" title="Previous (&larr;)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <div class="lightbox-figure-wrap" id="lightbox-figure-wrap">
            <div class="lightbox-img-frame" id="lightbox-img-frame">
              <img src="" alt="" id="lightbox-active-img" class="lightbox-active-img" />
            </div>
          </div>

          <button class="lightbox-nav-btn next" id="lightbox-next-btn" aria-label="Next photograph" title="Next (&rarr;)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div class="lightbox-bottom-bar">
          <div class="lightbox-meta">
            <h3 class="lightbox-title" id="lightbox-title">Photograph Title</h3>
            <p class="lightbox-caption" id="lightbox-caption">High-resolution clinical photography.</p>
          </div>
          <div class="lightbox-keyboard-hint">
            <span>&larr; &rarr; TO NAVIGATE &bull; ESC TO CLOSE</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const zoomBtn = document.getElementById('lightbox-zoom-toggle');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const activeImg = document.getElementById('lightbox-active-img');
  const imgFrame = document.getElementById('lightbox-img-frame');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');
  const categoryEl = document.getElementById('lightbox-category');
  const counterEl = document.getElementById('lightbox-counter');

  let currentGallery = [];
  let currentIndex = 0;
  let isZoomed = false;

  // Gather all viewable images on page
  function refreshGallery() {
    const images = Array.from(
      document.querySelectorAll(
        '.hero-image-frame img, .about-image-frame img, .team-photo-frame img, .pricing-image-wrap img, .article-row-item img, [data-lightbox] img, img[data-lightbox], .interactive-image'
      )
    );

    // Filter duplicates and invalid sources
    const uniqueMap = new Map();
    images.forEach((img) => {
      const src = img.getAttribute('data-full') || img.currentSrc || img.src;
      if (src && !uniqueMap.has(src)) {
        // Derive contextual caption and category
        let title = img.getAttribute('data-title') || img.alt || 'Maison Medical Sanctuary';
        let category = img.getAttribute('data-category') || 'CLINICAL ARCHITECTURE';
        let caption = img.getAttribute('data-caption') || '';

        // Check if image belongs to doctor profile
        const doctorCard = img.closest('.team-member-slide, .team-photo-frame');
        if (doctorCard) {
          const docName = doctorCard.querySelector('.doctor-name')?.textContent || img.alt;
          const docRole = doctorCard.querySelector('.doctor-role')?.textContent || 'Attending Physician';
          const docSub = doctorCard.querySelector('.doctor-subspecialty')?.textContent || '';
          title = docName;
          category = 'MEDICAL DIRECTOR & SPECIALIST';
          caption = `${docRole}${docSub ? ' &bull; ' + docSub : ''}`;
        } else if (img.closest('.hero-image-frame')) {
          title = 'Main Consultation Sanctuary';
          category = 'ARCHITECTURAL MEDICINE';
          caption = 'Presidio District Primary Care & Diagnostic Center';
        } else if (img.closest('.about-image-frame')) {
          title = 'Acoustic & Daylight Harmony Suite';
          category = 'THERAPEUTIC INTERIORS';
          caption = 'Private examination environments designed to reduce autonomic stress markers';
        } else if (img.closest('.pricing-image-wrap')) {
          title = 'Clinical Diagnostic Laboratory';
          category = 'DIAGNOSTIC RIGOR';
          caption = 'Rapid on-site biomarkers and metabolic assessment';
        }

        uniqueMap.set(src, {
          src,
          alt: img.alt || title,
          title,
          category,
          caption,
          element: img,
        });
      }
    });

    currentGallery = Array.from(uniqueMap.values());

    // Attach click listeners to all viewable images
    currentGallery.forEach((item, idx) => {
      const el = item.element;
      if (!el.hasAttribute('data-lightbox-bound')) {
        el.setAttribute('data-lightbox-bound', 'true');
        el.style.cursor = 'zoom-in';

        // Also make parent container clickable if applicable
        const parentFrame = el.closest('.hero-image-frame, .about-image-frame, .team-photo-frame, .pricing-image-wrap');
        const trigger = parentFrame || el;

        trigger.style.cursor = 'zoom-in';
        trigger.setAttribute('title', 'Click to view full photograph');

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(idx);
        });
      }
    });
  }

  function displayImage(index) {
    if (!currentGallery.length) return;

    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    currentIndex = index;

    const item = currentGallery[currentIndex];
    isZoomed = false;
    imgFrame.classList.remove('is-zoomed');

    // Instant image swap with smooth micro-fade
    activeImg.style.opacity = '0';
    activeImg.src = item.src;
    activeImg.alt = item.alt;

    titleEl.textContent = item.title;
    captionEl.innerHTML = item.caption || 'High-resolution clinical photography.';
    categoryEl.textContent = item.category || 'CLINICAL ARCHITECTURE';
    counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGallery.length).padStart(2, '0')}`;

    activeImg.onload = () => {
      activeImg.style.opacity = '1';
    };

    if (activeImg.complete) {
      activeImg.style.opacity = '1';
    }
  }

  function openLightbox(index) {
    displayImage(index);
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (window.lenis) {
      window.lenis.stop();
    }

    // Trigger cursor refresh if available
    window.dispatchEvent(new CustomEvent('cursorRefresh'));
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    isZoomed = false;
    imgFrame.classList.remove('is-zoomed');

    if (window.lenis) {
      window.lenis.start();
    }

    window.dispatchEvent(new CustomEvent('cursorRefresh'));
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    imgFrame.classList.toggle('is-zoomed', isZoomed);
    const zoomText = zoomBtn.querySelector('.lightbox-btn-text');
    if (zoomText) {
      zoomText.textContent = isZoomed ? 'RESET' : 'ZOOM';
    }
  }

  // Event Listeners
  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  zoomBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleZoom();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    displayImage(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    displayImage(currentIndex + 1);
  });

  // Clicking image toggles zoom
  imgFrame?.addEventListener('click', (e) => {
    if (e.target === activeImg) {
      toggleZoom();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      displayImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      displayImage(currentIndex + 1);
    }
  });

  // Initial scan and export
  refreshGallery();

  // Re-scan when DOM or dynamic components load
  window.addEventListener('load', refreshGallery);
  window.addEventListener('lightboxRefresh', refreshGallery);

  return {
    open: openLightbox,
    close: closeLightbox,
    refresh: refreshGallery,
  };
}
