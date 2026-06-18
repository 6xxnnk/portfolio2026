document.addEventListener("DOMContentLoaded", () => {
  const wraps = document.querySelectorAll(".phone-embed-wrap");

  const fit = () => {
    wraps.forEach(wrap => {
      const iframe = wrap.querySelector(".phone-embed");
      if (!iframe) return;

      // 실제 디자인 사이즈
      const DW = 390;
      const DH = 844;

      const PW = wrap.clientWidth;
      const PH = wrap.clientHeight;

      // contain 방식 (세로 절대 넘지 않음)
      const scale = Math.min(PW / DW, PH / DH);

      // 중앙 정렬 (세로도 딱 맞게)
      const x = (PW - DW * scale) / 2;
      const y = (PH - DH * scale) / 2;

      iframe.style.width = `${DW}px`;
      iframe.style.height = `${DH}px`;
      iframe.style.transformOrigin = "top left";
      iframe.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    });
  };

  fit();
  window.addEventListener("resize", fit);
});
