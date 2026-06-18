// =========================================================
// unified-tooltip.js  — 전역 툴팁 매니저 (노랑 글래스 스타일)
//  • 대상: [data-tooltip], [data-tt], .ig-tooltip, .tooltip-ig, .has-tooltip
//  • 마우스/키보드 포커스 모두 지원, title 충돌 방지
//  • 커서 따라다니며 화면 경계 자동보정
// =========================================================
(function () {
  if (window.UnifiedTooltip) return; // 중복 방지

  const TIP_SELECTOR =
    '[data-tooltip], [data-tt], .ig-tooltip, .tooltip-ig, .has-tooltip';

  const tip = document.createElement('div');
  tip.setAttribute('role', 'tooltip');
  Object.assign(tip.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    transform: 'translate(-50%,-60%)',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.02em',
    color: '#111',
    background: 'linear-gradient(180deg,#fffdf4,#fff7cc)',
    border: '1px solid rgba(0,0,0,.12)',
    borderRadius: '10px',
    boxShadow: '0 10px 24px rgba(0,0,0,.12), inset 0 1px 0 #fff',
    pointerEvents: 'none',
    zIndex: '99999',
    opacity: '0',
    transition: 'opacity .15s ease, transform .15s ease',
    whiteSpace: 'nowrap',
  });

  // 꼬리
  const tail = document.createElement('span');



  document.body.appendChild(tip);

  let currentEl = null;
  let savedTitle = null;

  const getText = (el) =>
    el.getAttribute('data-tooltip') ||
    el.getAttribute('data-tt') ||
    el.getAttribute('aria-label') ||
    el.getAttribute('title');

  function show(el, x, y) {
    const txt = getText(el);
    if (!txt) return;
    tip.textContent = txt;
    tip.style.opacity = '1';
    position(x, y);
  }

  function hide() {
    tip.style.opacity = '0';
  }

  function position(x, y) {
    const offY = 14;
    let nx = x, ny = y - offY;

    const r = tip.getBoundingClientRect();
    const m = 8;

    // 뷰포트 경계 보정
    if (nx - r.width / 2 < m) nx = r.width / 2 + m;
    if (nx + r.width / 2 > window.innerWidth - m)
      nx = window.innerWidth - m - r.width / 2;
    if (ny - r.height < m) ny = r.height + m; // 너무 위면 아래쪽으로

    tip.style.left = `${nx}px`;
    tip.style.top = `${ny}px`;
  }

  function onEnter(e) {
    const el = e.currentTarget;
    currentEl = el;
    // 기본 title은 브라우저 기본툴팁을 막기 위해 잠시 보관
    if (el.hasAttribute('title')) {
      savedTitle = el.getAttribute('title');
      el.setAttribute('data-title-backup', savedTitle);
      el.removeAttribute('title');
    }
    const txt = getText(el);
    if (!txt) return;
    show(el, e.clientX, e.clientY);
  }
  function onMove(e) {
    if (!currentEl) return;
    position(e.clientX, e.clientY);
  }
  function onLeave(e) {
    const el = e.currentTarget;
    hide();
    currentEl = null;
    const b = el.getAttribute('data-title-backup');
    if (b != null) {
      el.setAttribute('title', b);
      el.removeAttribute('data-title-backup');
    }
  }
  function onFocus(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    show(el, rect.left + rect.width / 2, rect.top - 6);
  }
  function onBlur() {
    hide();
  }

  function bind(el) {
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onFocus);
    el.addEventListener('focusout', onBlur);
  }

  function scan(root = document) {
    root.querySelectorAll(TIP_SELECTOR).forEach(bind);
  }
  // contact-tooltips-off.js
// Contact 섹션 안의 모든 툴팁을 제거/차단합니다.
document.addEventListener('DOMContentLoaded', () => {
  const scope = document.querySelector('.contact');
  if (!scope) return;

  // 1) title → 제거, data-tooltip/data-tt → 제거
  scope.querySelectorAll('[title], [data-tooltip], [data-tt]').forEach(el => {
    el.removeAttribute('title');
    el.removeAttribute('data-tooltip');
    el.removeAttribute('data-tt');
  });

  // 2) CSS-툴팁 클래스가 남아있더라도 무력화용 클래스 부여
  scope.classList.add('no-float-tt');

  // 3) UnifiedTooltip(전역 JS 툴팁) 있는 경우: Contact 내부는 스킵하도록 마킹
  //  - unified-tooltip.js에 shouldSkip 가드가 없는 경우에도, 아래에서 즉시 숨김 처리
  if (window.UnifiedTooltip && typeof window.UnifiedTooltip.hide === 'function') {
    // 마우스가 contact 안에 있을 땐 항상 숨김
    scope.addEventListener('mouseenter', () => window.UnifiedTooltip.hide(), { passive: true });
    scope.addEventListener('mousemove', () => window.UnifiedTooltip.hide(), { passive: true });
    scope.addEventListener('mouseleave', () => window.UnifiedTooltip.hide(), { passive: true });
    scope.addEventListener('focusin',  () => window.UnifiedTooltip.hide(), { passive: true });
  }
});

  // 초기 바인딩 + DOM 변화 감지
  scan();
  const mo = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches(TIP_SELECTOR)) bind(n);
        scan(n);
      });
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 전역 export
  window.UnifiedTooltip = {
    show,
    hide,
    position,
    bind,
    scan,
    selector: TIP_SELECTOR,
  };

  document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.proj--zigzag-v2 .zz-thumb').forEach(el => {
    el.removeAttribute('title');       // 네이티브 툴팁 차단
  });
});

function bind(el){
  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);

  // 지그재그 섹션에서는 포커스 기반 툴팁 비활성화 → 클릭해도 상단 툴팁 안 뜸
  if (!el.closest('.proj--zigzag-v2')) {
    el.addEventListener('focusin', onFocus);
    el.addEventListener('focusout', onBlur);
  }
}
})();
