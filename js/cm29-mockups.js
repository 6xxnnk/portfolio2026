/* File: js/cm29-unique-motion.js (Hover Motion Version) */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('cm29');
  if (!section) return;
  const phones = Array.from(section.querySelectorAll('.cm-phone'));
  if (!phones.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  phones.forEach(p => (p.style.animation = 'none'));

  const recipes = [
    { spin: 14, bob: 10, tilt: 4, phase: 0 },
    { spin: -18, bob: 14, tilt: 6, phase: 0.7 },
    { spin: 22, bob: 8, tilt: 3, phase: 1.4 },
    { spin: -12, bob: 12, tilt: 5, phase: 2.1 }
  ];
  const cfgFor = i => recipes[i % recipes.length];

  let mouseTiltX = 0, mouseTiltY = 0;
  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    mouseTiltY = dx * 6;
    mouseTiltX = -dy * 4;
  });

  let running = true;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      running = !!entry?.isIntersecting;
    }, { threshold: 0.15 });
    io.observe(section);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
  });

  // Hover 효과: 랜덤 방향으로 순간 흔들림
  phones.forEach(p => {
    p.addEventListener('mouseenter', () => {
      const randomX = (Math.random() * 10 - 5).toFixed(1);
      const randomY = (Math.random() * 10 - 5).toFixed(1);
      const randomZ = (Math.random() * 15 - 7).toFixed(1);
      const randomTilt = (Math.random() * 6 - 3).toFixed(1);
      const randomMove = (Math.random() * 12 - 6).toFixed(1);

      p.style.transition = 'transform 0.35s cubic-bezier(.25,1.5,.5,1)';
      p.style.transform = `
        translateY(${randomMove}px)
        rotateX(${randomX}deg)
        rotateY(${randomY}deg)
        rotateZ(${randomZ}deg)
        scale(1.02)
      `;
      p.classList.add('hovered');
    });

    p.addEventListener('mouseleave', () => {
      p.classList.remove('hovered');
      p.style.transition = 'transform 0.6s ease';
    });
  });

  if (prefersReduced) {
    phones.forEach((p, i) => {
      const { tilt } = cfgFor(i);
      p.style.transform = `translateY(0) rotateX(${tilt * 0.4}deg) rotateY(${(i - 1.5) * 8}deg)`;
      p.style.filter = 'drop-shadow(0 24px 40px rgba(255,185,94,.22))';
    });
    return;
  }

  const seeds = phones.map((_, i) => Math.sin((i + 1) * 1.2345) * 1000);
  const scrollYaw = () => (window.scrollY % 360) / 360 * 6;

  const start = performance.now();
  const loop = (now) => {
    if (running) {
      const t = (now - start) / 1000;
      const addYaw = scrollYaw();

      phones.forEach((p, i) => {
        if (p.classList.contains('hovered')) return;

        const cfg = cfgFor(i);
        const w = seeds[i];
        const spin = cfg.spin * t;
        const bob  = Math.sin(t * 1.2 + cfg.phase) * cfg.bob;
        const tilt = Math.sin(t * 0.9 + cfg.phase + w) * cfg.tilt;
        const micro = Math.sin(t * 3.4 + w) * 0.6;
        const rotY = spin + mouseTiltY + addYaw + micro;
        const rotX = tilt + mouseTiltX;

        p.style.transform =
          `translateY(${bob}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
