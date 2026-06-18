/* iMac iframe auto-fit (cover) */
document.addEventListener("DOMContentLoaded", () => {
  const wraps = document.querySelectorAll(".embed-scale-wrap");
  if (!wraps.length) return;

  const fit = () => {
    wraps.forEach(wrap => {
      // 디자인 기준 크기 추출 (예: "1440x900")
      const ds = (wrap.getAttribute("data-design") || "1440x900").toLowerCase();
      const [dw, dh] = ds.split("x").map(n => parseInt(n.trim(), 10));
      const iframe = wrap.querySelector(".site-embed");
      if (!iframe || !dw || !dh) return;

      // 패널 실제 크기
      const pw = wrap.clientWidth;
      const ph = wrap.clientHeight;

      // cover 방식 스케일
      const scale = Math.max(pw / dw, ph / dh);

      // 중앙 정렬
      const x = (pw - dw * scale) / 2;
      const y = (ph - dh * scale) / 2;

      iframe.style.width = dw + "px";
      iframe.style.height = dh + "px";
      iframe.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      iframe.style.transformOrigin = "top left";
    });
  };

  fit();
  window.addEventListener("resize", fit);

  // 폰트/이미지 로딩 후 크기 변동 대응
  let ro;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(fit);
    wraps.forEach(w => ro.observe(w));
  }

   (function(){
    const VER = '20251106a'; // 수정마다 갱신
    document.querySelectorAll('iframe.site-embed').forEach($f=>{
      const base = $f.getAttribute('src').split('?')[0];
      $f.setAttribute('src', `${base}?v=${VER}`);
    });
  })();
});

