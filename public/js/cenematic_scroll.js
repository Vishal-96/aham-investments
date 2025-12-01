gsap.registerPlugin(ScrollTrigger);

(function () {
  const rand = (min, max) => Math.random() * (max - min) + min;
  const items = gsap.utils.toArray(".collage-item");
  if (!items.length) return;

  // ---- Tuning constants ----
  const appearDur = 0.8;
  const holdDur = 1.0;
  const moveDur = 1.4;
  const itemSpacing = 0.7; // stagger between items

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const cols = vw > 1400 ? 5 : vw > 1100 ? 4 : vw > 800 ? 3 : 2;
  const gap = Math.round(Math.max(10, vw * 0.01));

  // ---- Masonry helper ----
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

      for (let c = minCol; c < minCol + span; c++) {
        colHeights[c] = y + height + gap;
      }

      layout.push({ el, x, y, width, height });
    });

    return { layout, height: Math.max(...colHeights) };
  }

  const { layout, height: gridHeight } = packMasonry(
    items,
    cols,
    gap,
    vw,
    vh * 1.8 // a bit taller so we get a stronger masonry look
  );

  // ---- Initial placement (centered & invisible) ----
  layout.forEach((l) => {
    gsap.set(l.el, {
      position: "absolute",
      width: l.width,
      height: l.height,
      left: vw / 2 - l.width / 2,
      top: vh / 2 - l.height / 2,
      opacity: 0,
      scale: 1.3
    });
  });

  // ---- Overlay for fade-to-black moment ----
  const overlay = document.createElement("div");
  overlay.className = "fade-overlay";
  document.body.appendChild(overlay);
  gsap.set(overlay, { opacity: 0 });

  // ---- Master timeline (no ScrollTrigger yet) ----
  const master = gsap.timeline();

  // STEP 1: each image – appear → hold → move into grid
  layout.forEach((l, i) => {
    const base = i * itemSpacing; // absolute time position for this item

    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 300;

    // appear & float
    master.to(
      l.el,
      {
        opacity: 1,
        scale: 1,
        x: randomX,
        y: randomY,
        duration: appearDur,
        ease: "power2.out"
      },
      base
    );

    // hold on screen
    master.to(
      l.el,
      {
        duration: holdDur
      },
      base + appearDur
    );

    // move into its masonry slot
    master.to(
      l.el,
      {
        x: l.x - (vw / 2 - l.width / 2),
        y: l.y - (vh / 2 - l.height / 2),
        scale: 1,
        duration: moveDur,
        ease: "power3.inOut"
      },
      base + appearDur + holdDur
    );
  });

  // Time when the last item has completely finished moving into the grid
  const lastIndex = layout.length - 1;
  const lastEndTime =
    lastIndex * itemSpacing + appearDur + holdDur + moveDur;

  let t = lastEndTime + 0.5; // start next phase after everything is fully in place

  // STEP 2: zoom out a bit (camera pull-back)
  master.to(
    ".collage-container",
    {
      scale: 0.9,
      duration: 2.0,
      ease: "power2.inOut"
    },
    t
  );
  t += 2.0;

  // STEP 3: gentle vertical pan to reveal more of the grid
  const extraScroll = Math.max(gridHeight - vh, 0);
  const moveDown = extraScroll > 0 ? -extraScroll / 3.5 : 0;

  master.to(
    ".collage-container",
    {
      y: moveDown,
      duration: 3.0,
      ease: "power2.inOut"
    },
    t
  );
  t += 3.0;

  // STEP 4: fade-to-black moment + soften collage, then clear overlay
  master.to(
    overlay,
    {
      opacity: 1,
      duration: 1.2,
      ease: "power2.inOut"
    },
    t
  );
  t += 1.2;

  // dim & fade out the collage items under the overlay
  master.to(
    ".collage-item",
    {
      opacity: 0,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      duration: 0.8,
      ease: "power1.out"
    },
    t - 0.6 // overlaps slightly with overlay peak
  );

  master.to(
    ".collage-container",
    {
      opacity: 0,
      duration: 0.8,
      ease: "power1.out"
    },
    t - 0.6
  );

  t += 0.6;

  // fade overlay away to reveal the normal page below (outro + footer)
  master.to(
    overlay,
    {
      opacity: 0,
      duration: 0.9,
      ease: "power2.out"
    },
    t
  );
  t += 0.9;

  // small tail so scrub at the end feels smooth
  master.to({}, { duration: 0.3 }, t);

  // ---- Now wire this entire timeline to ScrollTrigger ----
  const totalDuration = master.duration();

  ScrollTrigger.create({
    animation: master,
    trigger: ".collage-section",
    start: "top top",
    end: "+=" + totalDuration * 200, // scale factor = scroll “length”
    scrub: 1.2,
    pin: ".collage-container",
    pinSpacing: false,
    anticipatePin: 1
  });

  // Refresh on resize to keep sticky + trigger correct
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
})();
