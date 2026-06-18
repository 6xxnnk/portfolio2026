(function(){
  const el = document.querySelector('.collabs'); // 존재 안 할 수 있음
  if(!el) return; // 안전가드

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const t = entry.target;
      if (!t) return; // 더블 안전가드
      t.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -20%',
    threshold: 0.2
  });

  io.observe(el);
})();