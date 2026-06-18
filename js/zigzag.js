// js/zigzag.js
(function () {
  // 로드 타이밍 보장
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    const thumbsWrap = document.getElementById("zzThumbs");
    const stageImg = document.getElementById("zzStageImg");
    if (!thumbsWrap || !stageImg) return;

    // 1) 초기 동기화: .is-active 버튼의 data-mock을 스테이지에 반영 (파일명 대/소문자 불일치 방지)
    const activeBtn = thumbsWrap.querySelector(".zz-thumb.is-active") || thumbsWrap.querySelector(".zz-thumb");
    if (activeBtn) {
      const firstSrc = activeBtn.getAttribute("data-mock");
      if (firstSrc && stageImg.getAttribute("src") !== firstSrc) {
        preloadAndSwap(stageImg, firstSrc, activeBtn);
      } else {
        stageImg.dataset.src = stageImg.getAttribute("src") || "";
      }
    }

    // 2) 이벤트 위임: 썸네일 클릭 시 스왑
    thumbsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".zz-thumb");
      if (!btn) return;
      const nextSrc = btn.getAttribute("data-mock");
      if (!nextSrc) return;
      if (stageImg.dataset.src === nextSrc) return; // 동일 이미지면 무시
      setActive(thumbsWrap, btn);
      preloadAndSwap(stageImg, nextSrc, btn);
    });

    // 3) 키보드 접근성: 엔터/스페이스로 동작
    thumbsWrap.querySelectorAll(".zz-thumb").forEach((btn) => {
      btn.setAttribute("type", "button");
      btn.setAttribute("tabindex", "0");
      btn.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          btn.click();
        }
      });
    });

    // 4) 유틸: active 표시
    function setActive(scope, btn) {
      scope.querySelectorAll(".zz-thumb.is-active").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    }

    // 5) 유틸: 프리로드 후 교체(+ 페이드)
    function preloadAndSwap(imgEl, nextSrc, fromBtn) {
      // 사용자 설정: 모션 최소화
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) imgEl.classList.add("is-fading");

      const loader = new Image();
      loader.onload = () => {
        imgEl.src = nextSrc;
        imgEl.dataset.src = nextSrc;
        // alt 동기화(썸네일 img alt 따르기)
        const thumbImg = fromBtn && fromBtn.querySelector("img");
        if (thumbImg && thumbImg.getAttribute("alt") !== null) {
          imgEl.alt = thumbImg.getAttribute("alt") || "";
        }
        if (!reduce) requestAnimationFrame(() => imgEl.classList.remove("is-fading"));
      };
      loader.onerror = () => {
        // 로드 실패 시 콘솔 경고 (경로/대소문자 검사 힌트)
        console.warn("[zigzag] 이미지 로드 실패:", nextSrc, "파일명(대소문자)과 경로를 확인하세요.");
        if (!reduce) imgEl.classList.remove("is-fading");
      };
      loader.src = nextSrc;
    }
  }
})();
