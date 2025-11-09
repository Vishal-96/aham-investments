gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".collage-item");

// Scroll timeline
const master = gsap.timeline({
  scrollTrigger: {
    trigger: ".collage-section",
    start: "top top",
    end: "+=6000",
    scrub: true,
    pin: ".collage-container",
    anticipatePin: 1,
  },
});

// STEP 1: Sequential floating entry
items.forEach((item, i) => {
  const randomX = (Math.random() - 0.5) * 400;
  const randomY = (Math.random() - 0.5) * 300;
  const randomZ = -100 * i;

  master.to(
    item,
    {
      opacity: 1,
      scale: 1,
      x: randomX,
      y: randomY,
      z: randomZ,
      duration: 1.2,
      ease: "power2.out",
    },
    i * 0.6
  );
});

// STEP 2: Collage formation (fills viewport)
const rows = 3;
const cols = 4;
const spacingX = window.innerWidth / cols;
const spacingY = window.innerHeight / rows;

// Move all items into full-screen collage grid
master.to(
  items,
  {
    x: (i) => (i % cols) * spacingX - window.innerWidth / 2 + spacingX / 2,
    y: (i) =>
      Math.floor(i / cols) * spacingY - window.innerHeight / 2 + spacingY / 2,
    z: 0,
    scale: 1,
    opacity: 1,
    duration: 2.5,
    ease: "power3.inOut",
  },
  "+=1"
);

// STEP 3: Subtle camera zoom-out effect
master.to(
  ".collage-container",
  {
    scale: 0.85,
    duration: 2.5,
    ease: "power2.inOut",
  },
  "-=1.2"
);

// STEP 4: Pause for effect
master.to({}, { duration: 0.8 });

// STEP 5: Fade collage out smoothly
master.to(
  ".collage-container",
  {
    opacity: 0,
    scale: 1,
    duration: 1.5,
    ease: "power1.out",
  },
  "+=0.2"
);
