// Hero: typing animation + Search → About 섹션으로 스크롤 (+ 페이드 아웃)
(function(){
  const ghost = document.getElementById('typingGhost');
  const input = document.getElementById('q');
  const form  = document.getElementById('searchForm');
  const phrase = 'Enter my world.'; // ← 원하면 여기 문장 교체
  let i = 0, dir = 1, stop = false;

  // 타자 애니메이션 루프
  function tick(){
    if(stop) return;
    if(document.activeElement === input || input.value.length){
      ghost.classList.add('hidden');
    } else {
      ghost.classList.remove('hidden');
      ghost.textContent = phrase.slice(0, i);
      i += dir;
      if(i > phrase.length + 4) dir = -1;
      if(i <= 0) dir = 1;
    }
    setTimeout(tick, 80);
  }
  tick();

  input.addEventListener('focus', ()=> ghost.classList.add('hidden'));
  input.addEventListener('blur', ()=> { if(!input.value.length) ghost.classList.remove('hidden'); });

  // ✅ Search → 페이드아웃 후 #about로 스크롤
  form.addEventListener('submit', function(e){
    e.preventDefault();

    const target = document.getElementById('about');
    const hero   = document.querySelector('.hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 포커스 정리(모바일 키보드 등)
    input.blur();

    if (!reduceMotion && hero) {
      hero.classList.add('hero--leaving');
      // 살짝 기다렸다가 스크롤 (트랜지션과 타이밍 매칭)
      setTimeout(()=>{
        target?.scrollIntoView({ behavior:'smooth', block:'start' });
        // 스크롤이 시작되면 조금 뒤에 복구 (다음 방문 시 깜빡임 방지)
        setTimeout(()=> hero.classList.remove('hero--leaving'), 600);
      }, 280);
    } else {
      // 모션 최소화 설정 사용자는 즉시 스크롤
      target?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });

  // 탭 숨김 시 타이핑 일시정지
  document.addEventListener('visibilitychange', ()=>{
    stop = document.hidden;
    if(!stop) tick();
  });
})();
