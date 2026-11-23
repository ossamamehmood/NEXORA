/**
 * NEXORA Website Interactive Experience
 * Zero-dependency, 60fps physics, 3D tilt, magnetic buttons, and cursor spotlight.
 * Respects prefers-reduced-motion automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Mouse Cursor Spotlight on Cards
  const cards = document.querySelectorAll('.card, .spotlight-card, .tilt-card');
  document.addEventListener('mousemove', (e) => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. 3D Tilt Card Physics
  if (!isReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        const maxTilt = 8; // degrees
        const rotX = -yPct * maxTilt;
        const rotY = xPct * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 3. Magnetic Button Physics
  if (!isReducedMotion) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = e.clientX - rect.left - rect.width / 2;
        const btnY = e.clientY - rect.top - rect.height / 2;
        // Limit pull to +/- 4px
        const pullFactor = 0.2;
        btn.style.transform = `translate(${btnX * pullFactor}px, ${btnY * pullFactor}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 4. Interactive Feature Simulator Tabs
  const tabButtons = document.querySelectorAll('[data-feature-tab]');
  const previewPanels = document.querySelectorAll('[data-feature-preview]');

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-feature-tab');

      tabButtons.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      previewPanels.forEach((panel) => {
        if (panel.getAttribute('data-feature-preview') === target) {
          panel.classList.remove('hidden');
          panel.classList.add('animate-fade-in');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // 5. One-Click Cryptographic SHA-256 Checksum Copier
  const copyButtons = document.querySelectorAll('[data-copy-hash]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const hash = btn.getAttribute('data-copy-hash');
      if (navigator.clipboard && hash) {
        navigator.clipboard.writeText(hash).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = `<span style="color:#02FEDC; font-weight:700;">✓ Copied SHA-256!</span>`;
          btn.style.borderColor = '#02FEDC';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = '';
          }, 2500);
        });
      }
    });
  });

  // 6. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // 7. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });
  }
});
