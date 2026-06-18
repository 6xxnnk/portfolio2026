// figma-imac-1920.js
(function(){
  const READY = document.readyState === "loading"
    ? new Promise(r => document.addEventListener("DOMContentLoaded", r, {once:true}))
    : Promise.resolve();

  READY.then(() => {
    const wraps = Array.from(document.querySelectorAll(".embed-scale-wrap"))
      .filter(w => w.querySelector(".figma-embed"));

    if (!wraps.length) return;

    // 최초 세팅: iframe을 1920x1080으로 고정하고 로드 깜빡임 방지
    wraps.forEach(w => {
      const f = w.querySelector(".figma-embed");
      f.style.width = "1920px";
      f.style.height = "1080px";
      f.setAttribute("width", "1920");
      f.setAttribute("height", "1080");
      f.style.transformOrigin = "top left";
      f.style.visibility = "hidden";
      f.addEventListener("load", () => {
        f.style.visibility = "visible";
        fitOne(w);
      }, {once:true});
    });

    const fitAll = () => wraps.forEach(fitOne);

    function fitOne(wrap){
      const f = wrap.querySelector(".figma-embed");
      if (!f) return;
      const baseW = 1920;
      const pw = wrap.clientWidth;           // 패널 실제 가로폭
      if (pw <= 0) return;
      const scale = pw / baseW;              // 가로 기준 스케일만 적용
      f.style.transform = `scale(${scale})`;
      // 세로 이동은 하지 않음 → 실제 브라우저처럼 '상단부터' 보임
    }

    // 초기/리사이즈/관찰자
    fitAll();
    window.addEventListener("resize", fitAll, {passive:true});
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(fitAll);
      wraps.forEach(w => ro.observe(w));
    }

  });
})();
