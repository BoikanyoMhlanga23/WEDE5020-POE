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
// Small repair-ticket UI and storage
window.addEventListener("load", () => {
  // Only initialize on enquiry.html or when an element with id="enquiry-root" exists
  if (document.querySelector('.repair-app')) return; // avoid double-init
  const pageName = location.pathname.split('/').pop().toLowerCase();
  const isEnquiryPage = pageName === 'enquiry.html';
  const hasRoot = !!document.getElementById('enquiry-root');
  if (!isEnquiryPage && !hasRoot) return;

  const STORAGE_KEY = "repairTickets_v1";

  // Helpers
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  const loadTickets = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveTickets = tickets => localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));

  // Build UI
  const container = el("div", { class: "repair-app", style: "font-family: Arial, sans-serif; max-width:700px;margin:16px auto;padding:12px;border:1px solid #ddd;border-radius:6px;" });
  const title = el("h2", { text: "Boikanyo's Tech Repairs — Create Ticket" });
  const form = el("form", { id: "repairForm", style: "display:grid;gap:8px;margin-top:8px;" });

  const input = (name, placeholder) => el("input", { name, placeholder, required: "true", style: "padding:8px;border:1px solid #ccc;border-radius:4px;" });
  const textarea = (name, placeholder) => el("textarea", { name, placeholder, rows: 3, required: "true", style: "padding:8px;border:1px solid #ccc;border-radius:4px;resize:vertical;" });

  const nameInput = input("customerName", "Customer name");
  const contactInput = input("contact", "Phone or email");
  const deviceInput = input("device", "Device model (e.g. iPhone X)");
  const issueInput = textarea("issue", "Describe the problem");
  const serviceSelect = el("select", { name: "service", required: "true", style: "padding:8px;border:1px solid #ccc;border-radius:4px;" }, [
    el("option", { value: "", text: "Select service" }),
    el("option", { value: "diagnostic", text: "Diagnostic" }),
    el("option", { value: "screen", text: "Screen repair" }),
    el("option", { value: "battery", text: "Battery replacement" }),
    el("option", { value: "data", text: "Data recovery" }),
    el("option", { value: "other", text: "Other" })
  ]);

  const submitBtn = el("button", { type: "submit", style: "padding:10px 14px;background:#0078d4;color:white;border:none;border-radius:4px;cursor:pointer;" }, ["Create Ticket"]);
  const messages = el("div", { id: "messages", style: "min-height:20px;color:#333;margin-top:8px;" });
  const ticketsList = el("div", { id: "ticketsList", style: "margin-top:12px;" });

  form.appendChild(nameInput);
  form.appendChild(contactInput);
  form.appendChild(deviceInput);
  form.appendChild(serviceSelect);
  form.appendChild(issueInput);
  form.appendChild(submitBtn);

  container.appendChild(title);
  container.appendChild(form);
  container.appendChild(messages);
  container.appendChild(ticketsList);

  // Mount to #enquiry-root if present, otherwise prepend to body (only on enquiry.html)
  const mount = document.getElementById('enquiry-root') || document.body;
  mount.prepend(container);

  // Render tickets
  const renderTickets = () => {
    const tickets = loadTickets();
    ticketsList.innerHTML = "";
    if (!tickets.length) {
      ticketsList.appendChild(el("div", { text: "No tickets yet.", style: "color:#666" }));
      return;
    }
    tickets.slice().reverse().forEach(ticket => {
      const card = el("div", { class: "ticket", style: "padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:8px;background:#fff;" });
      const header = el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;" }, [
        el("strong", { text: `${ticket.customerName} — ${ticket.device}` }),
        el("small", { text: new Date(ticket.createdAt).toLocaleString(), style: "color:#666" })
      ]);
      const body = el("div", {}, [
        el("div", { text: `Service: ${ticket.service}` }),
        el("div", { text: `Contact: ${ticket.contact}` }),
        el("div", { text: `Issue: ${ticket.issue}`, style: "margin-top:6px;color:#333" })
      ]);
      const actions = el("div", { style: "margin-top:8px;text-align:right;" });
      const del = el("button", { style: "padding:6px 8px;border:1px solid #e74c3c;background:#fff;color:#e74c3c;border-radius:4px;cursor:pointer;" }, ["Delete"]);
      del.addEventListener("click", () => {
        const filtered = loadTickets().filter(t => t.id !== ticket.id);
        saveTickets(filtered);
        renderTickets();
      });
      actions.appendChild(del);
      card.appendChild(header);
      card.appendChild(body);
      card.appendChild(actions);
      ticketsList.appendChild(card);
    });
  };

  // Form submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    messages.textContent = "";
    const data = {
      id: Date.now().toString(36),
      customerName: nameInput.value.trim(),
      contact: contactInput.value.trim(),
      device: deviceInput.value.trim(),
      service: serviceSelect.value,
      issue: issueInput.value.trim(),
      createdAt: Date.now()
    };
    if (!data.customerName || !data.contact || !data.device || !data.service || !data.issue) {
      messages.textContent = "Please fill in all fields.";
      messages.style.color = "crimson";
      return;
    }
    const tickets = loadTickets();
    tickets.push(data);
    saveTickets(tickets);
    messages.textContent = "Ticket created.";
    messages.style.color = "green";
    form.reset();
    renderTickets();
  });

  // Initial render
  renderTickets();
});
function enlarge(img) {
  const overlay = document.getElementById("overlay");
  const enlarged = document.getElementById("enlarged");
  enlarged.src = img.src;
  overlay.style.display = "flex";
}
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}