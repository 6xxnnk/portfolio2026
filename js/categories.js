
  document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const categorySelect = document.getElementById("cat");
    const searchInput = document.getElementById("q");

    if (!searchForm || !categorySelect) return;

    const keywordMap = {
      "about": "#about",
      "about me": "#about",
      "소개": "#about",
      "자기소개": "#about",

      "wants": "#wonts",
      "원츠": "#wonts",
      "실무": "#wonts",
      "병원": "#wonts",

      "nespresso": "#nespresso",
      "네스프레소": "#nespresso",

      "tamburins": "#tamburins",
      "탬버린즈": "#tamburins",

      "glossier": "#glossier",
      "글로시에": "#glossier",

      "zigzag": "#zigzag",
      "지그재그": "#zigzag",

      "29cm": "#cm29",
      "이십구센티": "#cm29",

      "contact": "#contact",
      "연락": "#contact",
      "이메일": "#contact"
    };

    function moveToSection(targetSelector) {
      const target = document.querySelector(targetSelector);

      if (!target) {
        console.warn("해당 섹션을 찾을 수 없습니다:", targetSelector);
        return;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const selectedValue = categorySelect.value;
      const inputValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

      if (selectedValue) {
        moveToSection(selectedValue);
        return;
      }

      if (inputValue && keywordMap[inputValue]) {
        moveToSection(keywordMap[inputValue]);
        return;
      }

      if (inputValue) {
        const matchedKey = Object.keys(keywordMap).find(function (key) {
          return inputValue.includes(key);
        });

        if (matchedKey) {
          moveToSection(keywordMap[matchedKey]);
          return;
        }
      }

      moveToSection("#projects");
    });
  });
