document.addEventListener("DOMContentLoaded", function () {
  const hasContentLoaded = sessionStorage.getItem("hasContentLoaded");
  if (hasContentLoaded) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("navbar").style.display = "block";
  } else {
    setTimeout(function () {
      if (document.getElementById("loader")) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("navbar").style.display = "block";
        sessionStorage.setItem("hasContentLoaded", true);
      }
    }, 5000);
  }
});

let progressBar = document.getElementById("progress-bar");
let width = 0;

function updateProgressBar() {
  if (progressBar && width < 100) {
    width += 10;
    progressBar.style.width = width + "%";
    setTimeout(updateProgressBar, 500);
  }
}

updateProgressBar();

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

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
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

const globalModal = document.getElementById("globalMapModal");
globalModal?.addEventListener("hidden.bs.modal", () => {
  scale = 1;
  translateX = 0;
  translateY = 0;
  mapImage.style.transform = "scale(1) translate(0, 0)";
});