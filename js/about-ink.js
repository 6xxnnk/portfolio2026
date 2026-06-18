// about-ink.js
document.addEventListener('DOMContentLoaded', () => {
  const ink = document.querySelector('.cv-ink');
  if (!ink) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    ink.classList.add('is-active'); // 애니메이션 건너뛰고 정적 표시
    return;
  }

  // 섹션이 화면에 들어올 때 한 번만 재생
  const section = document.querySelector('.about-cvmap');
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      ink.classList.add('is-active');
      io.disconnect();
    }
  }, { rootMargin: '0px 0px -20% 0px', threshold: 0.15 });

  if (section) io.observe(section);
});
