document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

(function () {
  const carousel = document.querySelector(".vehicle-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const prevBtn = carousel.querySelector(".carousel-nav.prev");
  const nextBtn = carousel.querySelector(".carousel-nav.next");

  let index = 0;
  let autoTimer = null;
  const AUTO_DELAY = 5000; // 5 seconds

  function updateCarousel() {
    // Move track
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update active state
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }

  function next() {
    index = (index + 1) % cards.length;
    updateCarousel();
  }

  function prev() {
    index = (index - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // Button events
  nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });

  // Pause on hover (desktop)
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // Init
  updateCarousel();
  startAuto();
})();
