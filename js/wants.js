
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Swiper === "undefined") return;

    new Swiper(".blogSwiperPox", {
      loop: false,
      speed: 450,
      spaceBetween: 0,
      grabCursor: true,
      pagination: {
        el: ".blog-pox-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".blog-pox-next",
        prevEl: ".blog-pox-prev"
      }
    });

    new Swiper(".blogSwiperHeadache", {
      loop: false,
      speed: 450,
      spaceBetween: 0,
      grabCursor: true,
      pagination: {
        el: ".blog-headache-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".blog-headache-next",
        prevEl: ".blog-headache-prev"
      }
    });

    new Swiper(".blogSwiperMeniere", {
      loop: false,
      speed: 450,
      spaceBetween: 0,
      grabCursor: true,
      pagination: {
        el: ".blog-meniere-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".blog-meniere-next",
        prevEl: ".blog-meniere-prev"
      }
    });
  });
