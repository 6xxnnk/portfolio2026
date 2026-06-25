/* File: js/cm29-unique-motion.js */
/* PC: hover + 3D motion / Mobile: stable soft float */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('cm29');
  if (!section) return;

  const phones = Array.from(section.querySelectorAll('.cm-phone'));
  if (!phones.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* CSS animation 중복 방지 */
  phones.forEach(phone => {
    phone.style.animation = 'none';
    phone.style.willChange = 'transform';
    phone.style.backfaceVisibility = 'hidden';
    phone.style.webkitBackfaceVisibility = 'hidden';
  });

  /* =========================
     Mobile: 떨림 방지용 단순 애니메이션
  ========================= */
  if (isMobile || prefersReduced) {
    phones.forEach((phone, i) => {
      const delay = i * 0.45;
      const baseY = i % 2 === 0 ? -3 : 3;

      phone.style.transition = 'transform 0.4s ease';
      phone.style.transform = `translate3d(0, ${baseY}px, 0)`;
      phone.style.filter = 'drop-shadow(0 18px 32px rgba(255,185,94,.18))';

      let start = performance.now();

      const mobileLoop = now => {
        const t = (now - start) / 1000;
        const y = Math.sin(t * 1.1 + delay) * 4;

        phone.style.transform = `translate3d(0, ${y}px, 0)`;
        requestAnimationFrame(mobileLoop);
      };

      if (!prefersReduced) {
        requestAnimationFrame(mobileLoop);
      }
    });

    return;
  }

  /* =========================
     Desktop: 기존 3D 모션
  ========================= */

  const recipes = [
    { spin: 8, bob: 10, tilt: 4, phase: 0 },
    { spin: -10, bob: 14, tilt: 6, phase: 0.7 },
    { spin: 12, bob: 8, tilt: 3, phase: 1.4 },
    { spin: -8, bob: 12, tilt: 5, phase: 2.1 }
  ];

  const cfgFor = i => recipes[i % recipes.length];

  let mouseTiltX = 0;
  let mouseTiltY = 0;

  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;

    mouseTiltY = dx * 4;
    mouseTiltX = -dy * 3;
  });

  section.addEventListener('mouseleave', () => {
    mouseTiltX = 0;
    mouseTiltY = 0;
  });

  let running = true;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      running = Boolean(entry && entry.isIntersecting);
    }, { threshold: 0.15 });

    io.observe(section);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
  });

  phones.forEach(phone => {
    phone.addEventListener('mouseenter', () => {
      const randomX = (Math.random() * 6 - 3).toFixed(1);
      const randomY = (Math.random() * 6 - 3).toFixed(1);
      const randomZ = (Math.random() * 8 - 4).toFixed(1);
      const randomMove = (Math.random() * 8 - 4).toFixed(1);

      phone.classList.add('hovered');
      phone.style.transition = 'transform 0.35s cubic-bezier(.25,1.5,.5,1)';
      phone.style.transform = `
        translate3d(0, ${randomMove}px, 0)
        rotateX(${randomX}deg)
        rotateY(${randomY}deg)
        rotateZ(${randomZ}deg)
        scale(1.02)
      `;
    });

    phone.addEventListener('mouseleave', () => {
      phone.classList.remove('hovered');
      phone.style.transition = 'transform 0.6s ease';
    });
  });

  const seeds = phones.map((_, i) => Math.sin((i + 1) * 1.2345) * 1000);
  const start = performance.now();

  const loop = now => {
    if (running) {
      const t = (now - start) / 1000;

      phones.forEach((phone, i) => {
        if (phone.classList.contains('hovered')) return;

        const cfg = cfgFor(i);
        const w = seeds[i];

        const spin = Math.sin(t * 0.45 + cfg.phase) * cfg.spin;
        const bob = Math.sin(t * 1.15 + cfg.phase) * cfg.bob;
        const tilt = Math.sin(t * 0.8 + cfg.phase + w) * cfg.tilt;

        const rotY = spin + mouseTiltY;
        const rotX = tilt + mouseTiltX;

        phone.style.transition = 'none';
        phone.style.transform = `
          translate3d(0, ${bob}px, 0)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
        `;
      });
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
});