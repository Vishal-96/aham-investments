const faders = document.querySelectorAll(".fade-in-element");
const appearOptions = {
  root: null, // viewport
  rootMargin: "0px 0px -10% 0px", // trigger a bit before element fully in view
  threshold: 0.12, // 12% visible triggers
};

if (faders && faders.length) {
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // add visible class
        entry.target.classList.add("fade-in-visible");

        // wait until CSS transition likely finished before unobserving (optional)
        // this avoids flicker if something reflows quickly on mobile
        const timeout =
          parseFloat(
            getComputedStyle(entry.target).getPropertyValue("--fade-duration")
          ) || 700;
        setTimeout(() => observer.unobserve(entry.target), timeout + 100);
      }
    });
  }, appearOptions);

  faders.forEach((f) => appearOnScroll.observe(f));
}

document.getElementById("year").textContent = new Date().getFullYear();

const navbar = document.querySelector(".navbar");
const heroSection = document.querySelector(".hero-section");
if (navbar && heroSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          navbar.classList.add("bg-dark", "navbar-dark");
          navbar.classList.remove("bg-transparent", "navbar-light");
        } else {
          navbar.classList.add("bg-transparent", "navbar-light");
          navbar.classList.remove("bg-dark", "navbar-dark");
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(heroSection);
}

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = lightbox.querySelector(".lightbox-img");
  const captionEl = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-nav.prev");
  const nextBtn = lightbox.querySelector(".lightbox-nav.next");

  let images = [];
  let currentIndex = 0;

  function openLightbox(index) {
    const img = images[index];
    if (!img) return;

    imgEl.src = img.src;
    captionEl.textContent = img.dataset.caption || img.alt || "";

    currentIndex = index;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    imgEl.src = "";
  }

  function showNext() {
    openLightbox((currentIndex + 1) % images.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + images.length) % images.length);
  }

  /* ---------- Image Click ---------- */
  document.body.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-lightbox]");
    if (!img) return;

    images = Array.from(document.querySelectorAll("img[data-lightbox]"));

    const index = images.indexOf(img);
    if (index !== -1) openLightbox(index);
  });

  /* ---------- Buttons ---------- */
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);
  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  /* ---------- Swipe Support (Mobile) ---------- */
  let startX = 0;
  let endX = 0;

  imgEl.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  imgEl.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) < 40) return; // ignore tiny swipes
    if (diff > 0) {
      showNext(); // swipe left
    } else {
      showPrev(); // swipe right
    }
  }
});
