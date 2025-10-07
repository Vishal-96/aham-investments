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

// Reset map when modal closes
const globalModal = document.getElementById("globalMapModal");
globalModal?.addEventListener("hidden.bs.modal", () => {
  scale = 1;
  translateX = 0;
  translateY = 0;
  mapImage.style.transform = "scale(1) translate(0, 0)";
});

document.getElementById("year").textContent = new Date().getFullYear();

// Basic client-side validation + demo submit for the contact form
(function () {
  const form = document.getElementById("contactFormPage");
  const alertBox = document.getElementById("contactAlert");
  const spinner = document.getElementById("contactSpinner");
  const submitBtn = document.getElementById("contactSubmit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // simple validity check
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // show spinner & disable
    spinner.classList.remove("d-none");
    submitBtn.setAttribute("disabled", "disabled");

    // demo send (simulate network)
    setTimeout(() => {
      spinner.classList.add("d-none");
      submitBtn.removeAttribute("disabled");

      // show success
      alertBox.className = "alert alert-success mt-3";
      alertBox.innerHTML =
        "<strong>Thanks!</strong> Your message has been received. We will contact you shortly.";
      alertBox.classList.remove("d-none");

      // reset form
      form.reset();
      form.classList.remove("was-validated");

      // auto hide after 6s
      setTimeout(() => {
        alertBox.classList.add("d-none");
      }, 6000);
    }, 1200);
  });

  // small enhancement: move focus to first invalid
  form.addEventListener(
    "invalid",
    function (e) {
      e.preventDefault();
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
    },
    true
  );
})();
