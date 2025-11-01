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

const mapContainer = document.querySelector(".map-container");
const mapImage = document.querySelector(".map-image");
let scale = 1;
let isDragging = false;
let startX,
  startY,
  translateX = 0,
  translateY = 0;

mapContainer?.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomIntensity = 0.1;
  scale += e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
  scale = Math.min(Math.max(1, scale), 3);
  mapImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
});

mapContainer?.addEventListener("mousedown", (e) => {
  if (scale === 1) return;
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  mapContainer.classList.add("zoomed");
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  mapContainer?.classList.remove("zoomed");
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  mapImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
});

const globalModal = document.getElementById("globalMapModal");
globalModal?.addEventListener("hidden.bs.modal", () => {
  scale = 1;
  translateX = 0;
  translateY = 0;
  mapImage.style.transform = "scale(1) translate(0, 0)";
});

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
