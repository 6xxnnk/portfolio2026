// ig-feed-link.js
// 카드 썸네일 클릭 → data-link로 이동 (+ 가운데 버튼/Shift 등 새탭 배려)
document.addEventListener('DOMContentLoaded', () => {
  // 썸네일 요소들
  const thumbs = document.querySelectorAll('.gallery-item .post-thumb');

  thumbs.forEach(thumb => {
    const article = thumb.closest('.gallery-item');
    if (!article) return;

    const link = article.getAttribute('data-link');
    if (!link) return;

    // 커서 힌트
    thumb.style.cursor = 'pointer';
    thumb.setAttribute('tabindex', '0'); // 키보드 접근성

    const open = (e) => {
      // 수정: Ctrl/Meta 클릭이면 새 탭, 일반 클릭은 같은 탭
      const newTab = e.ctrlKey || e.metaKey || e.button === 1;
      if (newTab) window.open(link, '_blank', 'noopener');
      else window.location.href = link;
    };

    // 마우스 클릭
    thumb.addEventListener('click', open);
    // 휠 클릭(중클릭)
    thumb.addEventListener('auxclick', (e) => { if (e.button === 1) open(e); });
    // 키보드(Enter/Space)
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(e);
      }
    });
  });

  // 탭 언더라인 움직임(디자인 연속성)
  const tabs = document.querySelectorAll('.ig-tab');
  const underline = document.querySelector('.ig-tabs__underline');
  const move = (el) => {
    const p = el.parentElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    underline.style.width = `${Math.round(r.width)}px`;
    underline.style.transform = `translateX(${Math.round(r.left - p.left)}px)`;
  };
  if (tabs.length && underline) {
    move(tabs[0]);
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
      move(t);
    }));
    window.addEventListener('resize', () => {
      const a = document.querySelector('.ig-tab.is-active') || tabs[0];
      move(a);
    });
  }
});
