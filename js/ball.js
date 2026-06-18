
  (function(){
    const bg = document.querySelector('.footer-bg');
    if (!bg) return;

    const MAX = 16;     // 커서로 끌리는 최대 거리(px)
    const EASE = 0.18;  // 부드럽게 따라가는 정도

    let active = null;  // 현재 호버 중인 dot
    let raf = null;

    function loop(){
      if (!active) return;
      const rect = active.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top  + rect.height/2;
      const dx = (mouse.x - cx);
      const dy = (mouse.y - cy);
      const mag = Math.hypot(dx, dy) || 1;
      const nx = (dx / mag) * Math.min(MAX, Math.abs(dx));
      const ny = (dy / mag) * Math.min(MAX, Math.abs(dy));

      // 현재 오프셋을 읽고 보간
      const cur = active._offset || {x:0, y:0};
      cur.x += (nx - cur.x) * EASE;
      cur.y += (ny - cur.y) * EASE;
      active._offset = cur;

      active.style.transform =
        `translate(-50%,-50%) translate(${cur.x}px,${cur.y}px) scale(1.06)`;

      raf = requestAnimationFrame(loop);
    }

    const mouse = {x:0, y:0};
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    bg.addEventListener('pointerover', e => {
      const dot = e.target.closest('.sun-dot');
      if (!dot) return;
      active = dot;
      // CSS 애니메이션은 hover로 이미 pause됨
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    });

    bg.addEventListener('pointerout', e => {
      const dot = e.target.closest('.sun-dot');
      if (!dot || dot !== active) return;
      // 원상복귀 애니메이션
      const back = () => {
        const cur = active._offset || {x:0, y:0};
        cur.x *= (1 - EASE*1.2);
        cur.y *= (1 - EASE*1.2);
        active._offset = cur;
        active.style.transform = `translate(-50%,-50%) translate(${cur.x}px,${cur.y}px)`;
        if (Math.abs(cur.x) + Math.abs(cur.y) < 0.5){
          active.style.transform = 'translate(-50%,-50%)';
          active = null;
          return;
        }
        requestAnimationFrame(back);
      };
      back();
    });
  })();
