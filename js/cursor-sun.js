// cursor-sun.js
(() => {
  // 사용자 모션 선호 감지
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 커서 엘리먼트 생성
  const sun = document.createElement('div');
  sun.id = 'cursorSun';
  sun.textContent = '🌞';
  document.body.appendChild(sun);

  // 위치 보간용 변수
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  const ease = reduce ? 1 : 0.18; // 모션 최소화면 즉시 이동

  // 마우스 이동
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  // 클릭 피드백
  window.addEventListener('mousedown', () => sun.classList.add('is-down'));
  window.addEventListener('mouseup', () => sun.classList.remove('is-down'));

  // 입력 필드/버튼 안에서는 시스템 커서가 좋아서 body 커서만 숨기고,
  // 커스텀 커서는 그대로 따라다니게 둔다(시각적 일관).
  // 필요하면 focusin/out에 따라 숨김 토글 가능:
  // document.addEventListener('focusin', () => { /* sun.style.opacity = .6; */ });
  // document.addEventListener('focusout', () => { /* sun.style.opacity = 1; */ });

  // 애니메이션 루프
  function raf(){
    // 선형 보간
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    sun.style.transform = `translate(${x - 16}px, ${y - 16}px)`; // 32px 기준 중심 정렬
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 터치 디바이스에서는 기본 커서 유지(모바일에서 방해 X)
  function isTouch(){
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  if (isTouch()){
    sun.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
    document.body.style.cursor = 'auto';
  }
})();
