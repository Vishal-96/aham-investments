const faders = document.querySelectorAll(".fade-in-element");
const appearOptions = {
  threshold: 0.4,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fade-in-visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

document.getElementById("year").textContent = new Date().getFullYear();

const navbar = document.querySelector(".navbar");
const heroSection = document.querySelector(".hero-section");
console.log(navbar, heroSection);
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
