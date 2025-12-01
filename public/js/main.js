const faders = document.querySelectorAll(".fade-in-element");
const appearOptions = {
  root: null,                     // viewport
  rootMargin: "0px 0px -10% 0px", // trigger a bit before element fully in view
  threshold: 0.12                 // 12% visible triggers
};

if (faders && faders.length) {
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // add visible class
        entry.target.classList.add("fade-in-visible");

        // wait until CSS transition likely finished before unobserving (optional)
        // this avoids flicker if something reflows quickly on mobile
        const timeout = parseFloat(getComputedStyle(entry.target).getPropertyValue('--fade-duration')) || 700;
        setTimeout(() => observer.unobserve(entry.target), timeout + 100);
      }
    });
  }, appearOptions);

  faders.forEach(f => appearOnScroll.observe(f));
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
