// js/about-cvmap.js
(function(){
  const aboutSection = document.querySelector('.about-cvmap');
  if(!aboutSection) return;

  /* ========== 1) 타이틀/별 손글씨 드로잉 준비 ========== */
  const svg   = aboutSection.querySelector('.ink-title-svg');
  const text  = svg?.querySelector('.ink-title-stroke');
  const star  = svg?.querySelector('.ink-star-stroke');

  function prepStroke(el){
    if(!el) return;
    const len = (typeof el.getComputedTextLength === 'function')
      ? el.getComputedTextLength()
      : el.getTotalLength?.() ?? 1000;
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.strokeDashoffset = `${len}`;
  }

  function drawTitle(){
    if(!svg) return;
    // 초기화(매번 재진입 때 다시 그릴 수 있게)
    [text, star].forEach(el=>{
      if(!el) return;
      prepStroke(el);
    });
    // 강제리플로우로 초기값 확정
    svg.getBoundingClientRect();
    // 재생
    svg.classList.remove('is-drawn');
    // 다음 프레임에 is-drawn 부여 → 애니메이션 시작
    requestAnimationFrame(()=> svg.classList.add('is-drawn'));
  }

  // 초기 준비
  prepStroke(text); prepStroke(star);

  /* ========== 2) 버블 & 타이틀: 반복 리빌 IO ========== */
  const revealTargets = [
    ...aboutSection.querySelectorAll('[data-reveal]'),
    aboutSection.querySelector('.cv-center')
  ].filter(Boolean);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const el = entry.target;
      if(entry.isIntersecting){
        // 보임: 애니메이션 켜기
        el.classList.add('is-visible');
        if(el === aboutSection.querySelector('.cv-center')){
          drawTitle(); // 타이틀/별 그리기
        }
      }else{
        // 화면에서 벗어났을 때 제거 → 다음에 다시 들어오면 재생
        el.classList.remove('is-visible');
        if(el === aboutSection.querySelector('.cv-center') && svg){
          svg.classList.remove('is-drawn');
          // stroke offset 초기화 (다시 그릴 준비)
          [text, star].forEach(prepStroke);
        }
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

  revealTargets.forEach(el=> io.observe(el));

})();