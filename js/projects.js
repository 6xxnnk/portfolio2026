// 아이폰 프레임용 임베드 스케일러: 가로 맞춤 + 상단 정렬(레터박스 제거)
document.addEventListener('DOMContentLoaded', () => {
  const wraps = document.querySelectorAll('.phone-embed-wrap');

  const FIT_WIDTH = true;       // 가로 기준(실기기처럼 표시)

  const fit = () => {
    wraps.forEach(wrap => {
      const frame = wrap.querySelector('.phone-embed');
      if (!frame) return;

      // 기준 해상도(아이폰 14 기준)
      const DW = 390;
      const DH = 844;

      const PW = wrap.clientWidth;
      const PH = wrap.clientHeight;

      // 가로 기준 스케일(위쪽 여백 제거)
      const scale = PW / DW;

      // 중앙 정렬했던 y를 0으로 고정 → 상단 밀착
      const x = (PW - DW * scale) / 2;
      const y = 0;

      // 적용
      frame.style.width = DW + 'px';
      frame.style.height = DH + 'px';
      frame.style.transformOrigin = 'top left';
      frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    });
  };

  fit();
  window.addEventListener('resize', fit);

  // 폰트/이미지 로딩 후 레이아웃 변동에도 대응
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(fit);
    wraps.forEach(w => ro.observe(w));
  }
});
