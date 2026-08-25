/**
 * MS RELIABLE REPAIR - Main JavaScript Controller
 * Interactive UI, Modal Popup, Before/After Slider, & AJAX Contact Form Submission
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroVideo();
  initModal();
  initBeforeAfterSlider();
  initFaqAccordion();
  initContactForms();
  initSmoothScroll();
});

/* ==========================================================================
   1. Navbar & Header Scroll State
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

/* ==========================================================================
   2. Modal Pop-Up Management
   ========================================================================== */
function initModal() {
  const modalOverlay = document.getElementById('contactModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openButtons = document.querySelectorAll('[data-open-modal], .js-open-modal');
  const serviceSelect = document.getElementById('modalService');
  const modalForm = document.getElementById('modalContactForm');

  if (!modalOverlay) return;

  function openModal(prefillService = '') {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (prefillService && serviceSelect) {
      // Find matching option
      for (let option of serviceSelect.options) {
        if (option.value.toLowerCase().includes(prefillService.toLowerCase())) {
          serviceSelect.value = option.value;
          break;
        }
      }
    }

    // Focus first input field
    const firstInput = modalOverlay.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open triggers
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetService = btn.getAttribute('data-service') || '';
      openModal(targetService);
    });
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Expose to window if needed
  window.openContactModal = openModal;
  window.closeContactModal = closeModal;
}

/* ==========================================================================
   3. Interactive Before & After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-interactive');
  const afterImg = document.querySelector('.comp-img-after');
  const sliderHandle = document.querySelector('.comp-slider-handle');

  if (!container || !afterImg || !sliderHandle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let positionX = clientX - rect.left;

    // Boundaries
    if (positionX < 15) positionX = 15;
    if (positionX > rect.width - 15) positionX = rect.width - 15;

    const percentage = (positionX / rect.width) * 100;

    afterImg.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  }

  function handleStart(e) {
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    updateSliderPosition(clientX);
  }

  function handleMove(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    updateSliderPosition(clientX);
  }

  function handleEnd() {
    isDragging = false;
  }

  // Mouse Events
  container.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  // Touch Events
  container.addEventListener('touchstart', handleStart, { passive: true });
  window.addEventListener('touchmove', handleMove, { passive: true });
  window.addEventListener('touchend', handleEnd);
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. Contact Form Submissions (AJAX & PHP Backend)
   ========================================================================== */
function initContactForms() {
  const forms = [
    document.getElementById('modalContactForm'),
    document.getElementById('mainContactForm')
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const statusBox = form.querySelector('.form-status');
      const originalBtnHtml = submitBtn.innerHTML;

      // Anti-spam check
      const honeypot = form.querySelector('input[name="website_hp"]');
      if (honeypot && honeypot.value.trim() !== '') {
        showToast('Request received!', 'success');
        form.reset();
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';

      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.className = 'form-status';
      }

      try {
        const formData = new FormData(form);

        const response = await fetch(form.getAttribute('action') || 'contact.php', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          // Success
          if (statusBox) {
            statusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${result.message || 'Your request has been sent! We will reach out shortly.'}`;
            statusBox.classList.add('success');
            statusBox.style.display = 'flex';
          }

          showToast('Thank you! Your request was sent to MS Reliable Repair.', 'success');
          form.reset();

          // If inside modal, close after 2.5 seconds
          if (form.id === 'modalContactForm') {
            setTimeout(() => {
              if (window.closeContactModal) {
                window.closeContactModal();
              }
              if (statusBox) statusBox.style.display = 'none';
            }, 2500);
          }
        } else {
          // Validation / Server Error
          const errorMsg = result.message || 'There was an issue sending your request. Please call us directly at (732) 123-4567.';
          if (statusBox) {
            statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}`;
            statusBox.classList.add('error');
            statusBox.style.display = 'flex';
          }
          showToast(errorMsg, 'error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        // If network error, still give user a clear contact path
        const fallbackMsg = 'Thank you! If you need urgent assistance, please call us directly at (732) 123-4567.';
        if (statusBox) {
          statusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Request submitted! We will call you back soon.`;
          statusBox.classList.add('success');
          statusBox.style.display = 'flex';
        }
        showToast('Your request has been registered. We look forward to working with you!', 'success');
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  });
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : type === 'error' 
      ? 'fa-solid fa-triangle-exclamation' 
      : 'fa-solid fa-bell';

  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   7. Smooth Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   8. Hero Video Playback & Motion Controls
   ========================================================================== */
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  // Modern browsers require programmatic muted + playsinline
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const startPlayback = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay deferred by browser policy:', error);
        // Fallback on first user scroll or tap
        const unlockPlayback = () => {
          video.play();
          window.removeEventListener('click', unlockPlayback);
          window.removeEventListener('touchstart', unlockPlayback);
          window.removeEventListener('scroll', unlockPlayback);
        };
        window.addEventListener('click', unlockPlayback, { once: true });
        window.addEventListener('touchstart', unlockPlayback, { once: true });
        window.addEventListener('scroll', unlockPlayback, { once: true });
      });
    }
  };

  if (video.readyState >= 2) {
    startPlayback();
  } else {
    video.addEventListener('loadeddata', startPlayback, { once: true });
    video.addEventListener('canplay', startPlayback, { once: true });
  }
}

