// cinematic_scroll_debug.js — adds console logs for diagnosing dead zone
gsap.registerPlugin(ScrollTrigger);

(function () {
  const rand = (min, max) => Math.random() * (max - min) + min;
  const items = gsap.utils.toArray(".collage-item");
  if (!items.length) return;

  const appearDur = 0.8;
  const holdDur = 1.0;
  const moveDur = 1.4;
  const itemSpacing = 0.7;
  const scrollLength = 10000;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cols = vw > 1400 ? 5 : vw > 1100 ? 4 : vw > 800 ? 3 : 2;
  const gap = Math.round(Math.max(10, vw * 0.01));

  // --- Masonry Helper ---
  function packMasonry(list, cols, gap, W, H) {
    const colHeights = Array(cols).fill(0);
    const layout = [];
    const colWidth = (W - (cols - 1) * gap) / cols;

    list.forEach((el, i) => {
      const aspect = parseFloat(el.dataset.aspect || rand(0.8, 1.6));
      const span = i % 6 === 0 && cols > 2 ? 2 : 1;
      const minCol = colHeights.indexOf(Math.min(...colHeights));
      const width = colWidth * span + gap * (span - 1);
      const height = width / aspect;
      const x = minCol * (colWidth + gap);
      const y = colHeights[minCol];
      for (let c = minCol; c < minCol + span; c++)
        colHeights[c] = y + height + gap;
      layout.push({ el, x, y, width, height });
    });

    return { layout, height: Math.max(...colHeights) };
  }

  const { layout, height: gridHeight } = packMasonry(
    items,
    cols,
    gap,
    vw,
    vh * 1.6
  );

  layout.forEach((l) => {
    gsap.set(l.el, {
      position: "absolute",
      width: l.width,
      height: l.height,
      left: vw / 2 - l.width / 2,
      top: vh / 2 - l.height / 2,
      opacity: 0,
      scale: 1.3,
    });
  });

  const overlay = document.createElement("div");
  overlay.className = "fade-overlay";
  document.body.appendChild(overlay);
  gsap.set(overlay, { opacity: 0 });
  gsap.set(".collage-outro", { opacity: 0, y: 60 });

  // === DEBUG INFO ===
  console.log(
    "%c[DEBUG] Collage grid calculated height:",
    "color: limegreen",
    gridHeight
  );
  console.log("%c[DEBUG] Viewport height:", "color: cyan", vh);
  console.log(
    "%c[DEBUG] Expected dead zone (approx):",
    "color: orange",
    gridHeight - vh
  );

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: ".collage-section",
      start: "top top",
      end: `+=${scrollLength}`,
      scrub: 1.3,
      pin: true,
      anticipatePin: 1,

      // 🧩 Scroll update logger
      onUpdate: (self) => {
        const progress = self.progress.toFixed(3);
        const scrollPos = self.scroll();
        const cont = document.querySelector(".collage-container");
        const rect = cont?.getBoundingClientRect();
        if (rect) {
          console.log(
            `[Scroll] pos=${scrollPos} | progress=${progress} | container.top=${rect.top.toFixed(
              1
            )} | container.bottom=${rect.bottom.toFixed(1)}`
          );
        }
      },
      onLeave: () => console.log("%c[DEBUG] Outro triggered!", "color: yellow"),
    },
  });

  // STEP 1: Appear → Hold → Move
  layout.forEach((l, i) => {
    const delay = i * itemSpacing;
    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 300;
    const randomZ = -100 * (i % 5);

    master.to(
      l.el,
      {
        opacity: 1,
        scale: 1,
        x: randomX,
        y: randomY,
        z: randomZ,
        duration: appearDur,
        ease: "power2.out",
      },
      delay
    );

    master.to(l.el, { duration: holdDur }, delay + appearDur);

    master.to(
      l.el,
      {
        x: l.x - (vw / 2 - l.width / 2),
        y: l.y - (vh / 2 - l.height / 2),
        z: 0,
        scale: 1,
        duration: moveDur,
        ease: "power3.inOut",
      },
      delay + appearDur + holdDur
    );
  });

  // STEP 2: Zoom-out
  master.to(
    ".collage-container",
    { scale: 0.9, duration: 2.2, ease: "power2.inOut" },
    "+=1.0"
  );
  // STEP 3: Smooth camera pan to reveal full collage without overshoot
  const extraScroll = Math.max(gridHeight - vh, 0);
  const moveDown = extraScroll > 0 ? -extraScroll / 3.5 : 0; // slightly lighter pan

  master.to(
    ".collage-container",
    {
      y: moveDown,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const rect = document
          .querySelector(".collage-container")
          .getBoundingClientRect();
        console.log(
          `%c[Reveal] container.top=${rect.top.toFixed(
            1
          )} bottom=${rect.bottom.toFixed(1)}`,
          "color: orange"
        );
      },
    },
    "-=0.8"
  );

  // STEP 4: Fade overlay + outro a bit earlier for perfect sync
  master
    .to(
      overlay,
      {
        opacity: 1,
        duration: 1.3,
        ease: "power2.inOut",
      },
      "-=1.0"
    ) // start sooner
    .to(
      overlay,
      {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "+=0.5"
    )
    .to(
      ".collage-outro",
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: "power2.out",
        onStart: () =>
          console.log(
            "%c[DEBUG] Outro triggered (final tuned)",
            "color: yellow"
          ),
      },
      "-=1.0"
    );

  // STEP 5: Smooth release
  master.to({}, { duration: 0.2 });

  // DEBUG refresh + size check on resize
  window.addEventListener("resize", () => {
    console.log(
      "%c[DEBUG] Window resized — recomputing grid",
      "color: skyblue"
    );
    ScrollTrigger.refresh();
  });
})();
