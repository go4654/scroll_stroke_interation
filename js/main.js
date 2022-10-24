(() => {
  let yOffset;
  let prevScrollHeight = 0;
  let currentSec = 0;
  let intoNewSection = false;

  const secInfo = [
    {
      //0
      type: "fix",
      heightNum: 5,
      scrollHeight: 0,
      el: {
        section: document.querySelector(".section_0"),
        svgTitle: document.querySelector(".section_0 .svg_title"),
        mainTitle: document.querySelector(".section_0 .main_title"),
        titleA: document.querySelector(".section_0 .title_2"),
        titleB: document.querySelector(".section_0 .title_3"),
        strokeLine: document.querySelector(".section_0 .stroke_line .st0"),
      },
      values: {
        svgTitle_width: [4000, 50, { start: 0.1, end: 0.3 }],
        svgTitle_translate: [-97.5, -50, { start: 0.3, end: 0.4 }],
        svgTitle_opacity: [1, 0, { start: 0.8, end: 0.9 }],

        titleA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        titleA_opacity_out: [1, 0, { start: 0.2, end: 0.3 }],

        strokeLine_dashoffset_in: [4617, 0, { start: 0.5, end: 0.7 }],
        strokeLine_dashoffset_out: [0, -4617, { start: 0.7, end: 0.8 }],

        titleB_opacity_in: [0, 1, { start: 0.5, end: 0.7 }],
        titleB_opacity_out: [1, 0, { start: 0.7, end: 0.8 }],
      },
    },
    {
      //1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      el: {
        section: document.querySelector(".section_1"),
      },
    },
  ];

  const setLayout = () => {
    for (let i = 0; i < secInfo.length; i++) {
      if (secInfo[i].type === "fix") {
        secInfo[i].scrollHeight = secInfo[i].heightNum * window.innerHeight;
      }

      if (secInfo[i].type === "normal") {
        secInfo[i].scrollHeight = secInfo[i].el.section.offsetHeight;
      }

      secInfo[i].el.section.style.height = `${secInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalHeight = 0;
    for (let i = 0; i < secInfo.length; i++) {
      totalHeight += secInfo[i].scrollHeight;
      if (totalHeight > yOffset) {
        currentSec = i;
        break;
      }
    }

    document.body.setAttribute("id", `show_section_${currentSec}`);
  };

  const calcValues = (values, currentYOffset) => {
    let rv;
    const scrollHeight = secInfo[currentSec].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      const partStart = values[2].start * scrollHeight;
      const partEnd = values[2].end * scrollHeight;
      const partScroll = partEnd - partStart;

      if (currentYOffset >= partStart && currentYOffset < partEnd) {
        rv =
          ((currentYOffset - partStart) / partScroll) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partStart) {
        rv = values[0];
      } else if (currentYOffset > partEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  };

  const aniHandler = () => {
    const el = secInfo[currentSec].el;
    const values = secInfo[currentSec].values;
    const scrollHeight = secInfo[currentSec].scrollHeight;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentSec) {
      case 0:
        if (scrollRatio <= 0.22) {
          el.titleA.style.opacity = calcValues(
            values.titleA_opacity_in,
            currentYOffset
          );
        } else {
          el.titleA.style.opacity = calcValues(
            values.titleA_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio <= 0.32) {
          el.svgTitle.style.width = `${calcValues(
            values.svgTitle_width,
            currentYOffset
          )}vw`;
        }

        if (scrollRatio <= 0.42) {
          el.svgTitle.style.transform = `translate3d(${calcValues(
            values.svgTitle_translate,
            currentYOffset
          )}%,-68%,0)`;
        }

        if (scrollRatio <= 0.72) {
          el.strokeLine.style.strokeDashoffset = calcValues(
            values.strokeLine_dashoffset_in,
            currentYOffset
          );
          el.titleB.style.opacity = calcValues(
            values.titleB_opacity_in,
            currentYOffset
          );
        } else {
          el.strokeLine.style.strokeDashoffset = calcValues(
            values.strokeLine_dashoffset_out,
            currentYOffset
          );
          el.titleB.style.opacity = calcValues(
            values.titleB_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio <= 0.92) {
          el.svgTitle.style.opacity = calcValues(
            values.svgTitle_opacity,
            currentYOffset
          );
        }

        break;

      case 1:
        break;
    }
  };

  const scrollHandler = () => {
    intoNewSection = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentSec; i++) {
      prevScrollHeight += secInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + secInfo[currentSec].scrollHeight) {
      intoNewSection = true;
      currentSec++;
      document.body.setAttribute("id", `show_section_${currentSec}`);
    }

    if (yOffset < prevScrollHeight) {
      intoNewSection = true;
      if (yOffset === 0) return;
      currentSec--;
      document.body.setAttribute("id", `show_section_${currentSec}`);
    }

    if (intoNewSection) return;

    aniHandler();
  };

  window.addEventListener("load", () => {
    setLayout();

    // secInfo[0].el.svgTitle.style.transform = `transform: translate3d(-98%, -68%, 0px);`;

    window.addEventListener("resize", setLayout);

    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollHandler();
    });
  });
})();
