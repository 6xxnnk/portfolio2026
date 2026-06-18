// =========================================================
// Hero: typing animation + Search → 선택한 섹션으로 스크롤
// =========================================================
(function(){
  const ghost = document.getElementById('typingGhost');
  const input = document.getElementById('q');
  const form  = document.getElementById('searchForm');
  const select = document.getElementById('cat');

  const phrase = 'Enter my world.';
  let i = 0;
  let dir = 1;
  let stop = false;

  // 타자 애니메이션 루프
  function tick(){
    if(stop) return;

    if(document.activeElement === input || input.value.length){
      ghost?.classList.add('hidden');
    } else {
      ghost?.classList.remove('hidden');

      if (ghost) {
        ghost.textContent = phrase.slice(0, i);
      }

      i += dir;

      if(i > phrase.length + 4) dir = -1;
      if(i <= 0) dir = 1;
    }

    setTimeout(tick, 80);
  }

  tick();

  if (input && ghost) {
    input.addEventListener('focus', () => {
      ghost.classList.add('hidden');
    });

    input.addEventListener('blur', () => {
      if(!input.value.length) {
        ghost.classList.remove('hidden');
      }
    });
  }

  // 검색어로도 이동할 수 있게 매칭
  const keywordMap = {
    'about': '#about',
    'about me': '#about',
    '소개': '#about',
    '자기소개': '#about',

    'wants': '#wonts',
    '원츠': '#wonts',
    '실무': '#wonts',
    '병원': '#wonts',

    'nespresso': '#nespresso',
    '네스프레소': '#nespresso',

    'tamburins': '#tamburins',
    '탬버린즈': '#tamburins',

    'glossier': '#glossier',
    '글로시에': '#glossier',

    'zigzag': '#zigzag',
    '지그재그': '#zigzag',

    '29cm': '#cm29',
    '이십구센티': '#cm29',

    'contact': '#contact',
    '연락': '#contact',
    '이메일': '#contact'
  };

  function getTargetSelector(){
    const selectedValue = select ? select.value : '';
    const inputValue = input ? input.value.trim().toLowerCase() : '';

    // 1순위: select에서 고른 섹션
    if (selectedValue) {
      return selectedValue;
    }

    // 2순위: 검색어가 정확히 매칭될 때
    if (inputValue && keywordMap[inputValue]) {
      return keywordMap[inputValue];
    }

    // 3순위: 검색어 안에 키워드가 포함될 때
    if (inputValue) {
      const matchedKey = Object.keys(keywordMap).find(function(key){
        return inputValue.includes(key);
      });

      if (matchedKey) {
        return keywordMap[matchedKey];
      }
    }

    // 아무것도 없으면 이동하지 않음
    return null;
  }

  function moveToSection(targetSelector){
    if (!targetSelector) {
      console.warn('선택된 섹션이 없습니다.');
      return;
    }

    const target = document.querySelector(targetSelector);

    if (!target) {
      console.warn('해당 섹션을 찾을 수 없습니다:', targetSelector);
      return;
    }

    const hero = document.querySelector('.hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    input?.blur();

    if (!reduceMotion && hero) {
      hero.classList.add('hero--leaving');

      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        setTimeout(() => {
          hero.classList.remove('hero--leaving');
        }, 600);
      }, 280);
    } else {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // select 선택 시 input에 선택한 이름 넣기
  if (select && input) {
    select.addEventListener('change', function(){
      const selectedText = select.options[select.selectedIndex].text;

      if (select.value) {
        input.value = selectedText;
        ghost?.classList.add('hidden');
      }
    });
  }

  // Search 버튼 클릭 시 선택 섹션으로 이동
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();

      const targetSelector = getTargetSelector();
      moveToSection(targetSelector);
    });
  }

  // 탭 숨김 시 타이핑 일시정지
  document.addEventListener('visibilitychange', () => {
    stop = document.hidden;

    if(!stop) {
      tick();
    }
  });
})();