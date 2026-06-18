// js/projects-devices.js
(function(){
  const SPEED = 60; // px per second (기본 속도)
  const rafers = new Map();

  function onEnter(pane){
    const img = pane.querySelector('.scrollimg');
    if(!img) return;

    const paneH = pane.clientHeight;
    const imgH  = img.naturalHeight || img.clientHeight;

    if(imgH <= paneH + 8) return; // 스크롤 필요 없음

    const maxShift = imgH - paneH;   // 위로 이동 가능한 최대치
    let start = null;

    function step(ts){
      if(!start) start = ts;
      const dt = (ts - start) / 1000;          // seconds
      const dy = Math.min(maxShift, dt * SPEED);
      img.style.transform = `translateY(-${dy}px)`;
      if(dy < maxShift) {
        const r = requestAnimationFrame(step);
        rafers.set(pane, r);
      }
    }
    const r = requestAnimationFrame(step);
    rafers.set(pane, r);
  }

  function onLeave(pane){
    const img = pane.querySelector('.scrollimg');
    if(!img) return;
    const r = rafers.get(pane);
    if(r) cancelAnimationFrame(r);
    rafers.delete(pane);
    img.style.transform = 'translateY(0)';
  }

  document.querySelectorAll('.scrollpane').forEach(pane=>{
    pane.addEventListener('mouseenter', ()=> onEnter(pane));
    pane.addEventListener('mouseleave', ()=> onLeave(pane));
    // 터치 환경 대비: 탭하면 잠깐 스크롤 시작 후 정지
    pane.addEventListener('touchstart', ()=> onEnter(pane), {passive:true});
    pane.addEventListener('touchend', ()=> onLeave(pane));
  });

  // iMac Exhibit — small, scoped helpers
document.addEventListener('DOMContentLoaded', () => {
  // 1) 캐시버스트: 깃허브 페이지 수정 즉시 반영
  document.querySelectorAll('.imx-site-embed[data-cache-bust="true"]').forEach((ifr) => {
    try {
      const u = new URL(ifr.src);
      u.searchParams.set('_v', Date.now().toString());
      ifr.src = u.toString();
    } catch (e) {}
  });

  // 2) 접근성: iframe 포커스시 내부 하이라이트
  document.addEventListener('focusin', (e) => {
    const p = e.target.closest('.imx-display');
    if (p) p.style.boxShadow = '0 0 0 3px rgba(255,210,74,.65) inset';
  });
  document.addEventListener('focusout', (e) => {
    const p = e.target.closest('.imx-display');
    if (p) p.style.boxShadow = '';
  });
});

})();
