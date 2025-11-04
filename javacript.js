document.getElementById("myButton").addEventListener("click", function() {
  alert("Button clicked!");
});
document.getElementById("toggle").addEventListener("click", function() {
  const content = document.getElementById("content");
  content.style.display = content.style.display === "none" ? "block" : "none";
});
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".content").forEach(c => c.style.display = "none");
    document.getElementById(tab.dataset.target).style.display = "block";
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Lightbox functionality
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.querySelector('.lightbox-close');

  // Add click handlers to all images in club-info sections
  document.querySelectorAll('.club-info img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Close lightbox when clicking close button or outside the image
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    setTimeout(() => {
      lightboxImg.src = ''; // Clear source after animation
    }, 300);
  }

  // Contact form handling (client-side validation + simulated submit)
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      let valid = true;
      // Clear previous errors
      document.querySelectorAll('.contact-form .error').forEach(el => el.textContent = '');

      if (!name.value.trim()) {
        document.getElementById('error-name').textContent = 'Please enter your name.';
        valid = false;
      }
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
        document.getElementById('error-email').textContent = 'Please enter a valid email.';
        valid = false;
      }
      if (!subject.value.trim()) {
        document.getElementById('error-subject').textContent = 'Please add a subject.';
        valid = false;
      }
      if (!message.value.trim()) {
        document.getElementById('error-message').textContent = 'Please write a short message.';
        valid = false;
      }

      if (!valid) {
        // focus first invalid field
        const firstError = contactForm.querySelector('.error:not(:empty)');
        if (firstError) {
          const inputEl = firstError.previousElementSibling || firstError.previousSibling;
          if (inputEl && inputEl.focus) inputEl.focus();
        }
        return;
      }

      // Simulate submit: disable button, show spinner, then show success
      submitBtn.disabled = true;
      const oldText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';

      setTimeout(() => {
        // Success
        submitBtn.disabled = false;
        submitBtn.textContent = oldText;
        formStatus.textContent = 'Thanks — your message has been sent!';
        formStatus.classList.add('show');

        // Clear form fields
        contactForm.reset();

        // Hide status after a few seconds
        setTimeout(() => {
          formStatus.classList.remove('show');
          formStatus.textContent = '';
        }, 4000);

      }, 1200);
    });
  }

  // Set initial content visibility (show first .content)
  const contents = Array.from(document.querySelectorAll('.content'));
  if (contents.length) {
    contents.forEach((c, i) => c.style.display = i === 0 ? 'block' : 'none');
  }

  // Mark the first tab as active
  const tabs = Array.from(document.querySelectorAll('.tab'));
  if (tabs.length) {
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');
  }

  // Support linking to a tab via URL hash (#targetId)
  const applyHash = () => {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) {
      contents.forEach(c => (c.style.display = 'none'));
      target.style.display = 'block';
      tabs.forEach(t => t.classList.remove('active'));
      const tab = document.querySelector(`.tab[data-target="${hash}"]`);
      if (tab) tab.classList.add('active');
    }
  };
  applyHash();

  // Update hash when tabs are clicked (keeps existing click handler behavior)
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab && tab.dataset && tab.dataset.target) {
      history.replaceState(null, '', '#' + tab.dataset.target);
    }
  });

  // Make .tab elements keyboard accessible (Enter / Space)
  tabs.forEach(tab => {
    if (!tab.hasAttribute('tabindex')) tab.setAttribute('tabindex', '0');
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });
});

// Optional: gracefully handle missing elements to avoid runtime errors when script loads early
window.addEventListener('error', (ev) => {
  // Suppress errors coming from missing DOM elements if needed (no-op)
  // Remove or customize this handler if you want to surface real JS errors.
});