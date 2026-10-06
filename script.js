document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const revealItems = document.querySelectorAll(".reveal");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const languageSearch = document.getElementById("language-search");
  const languageRows = document.querySelectorAll(".language-table tbody tr");
  const shareForm = document.getElementById("share-form");
  const contactForm = document.getElementById("contact-form");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      if (navMenu) {
        navMenu.classList.remove("open");
      }
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const galleryArray = [...galleryItems];
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    currentIndex = index;
    const item = galleryArray[index];
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "Cultural image";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function moveLightbox(step) {
    if (!galleryArray.length) return;
    currentIndex = (currentIndex + step + galleryArray.length) % galleryArray.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") moveLightbox(1);
    if (event.key === "ArrowLeft") moveLightbox(-1);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

      galleryItems.forEach((item) => {
        const shouldShow = filter === "all" || item.dataset.category === filter;
        item.style.display = shouldShow ? "block" : "none";
      });
    });
  });

  if (languageSearch) {
    languageSearch.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();

      languageRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  }

  shareForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("share-name").value.trim();
    const message = document.createElement("p");
    message.className = "privacy-note";
    message.textContent = `Thank you, ${name || "community member"}. Your contribution will be reviewed before being published.`;
    shareForm.appendChild(message);
    shareForm.reset();
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const success = document.createElement("p");
    success.className = "privacy-note";
    success.textContent = `Thank you, ${name || "friend"}. Your message has been sent successfully.`;
    contactForm.appendChild(success);
    contactForm.reset();
  });
});

