
const container = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    animation-duration: ${8 + Math.random() * 12}s;
    animation-delay: ${Math.random() * 10}s;
    width: ${1 + Math.random() * 2}px;
    height: ${1 + Math.random() * 2}px;
    background: ${Math.random() > 0.5 ? '#00f5ff' : '#ff00e5'};
    box-shadow: 0 0 4px currentColor;
  `;
  container.appendChild(p);
}

// ── MENU MOBILE ───────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── SCROLL REVEAL ──────────────────────
const revealEls = document.querySelectorAll('.reveal');

// pequeno delay escalonado para elementos vizinhos (cards na mesma grade)
revealEls.forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter((s) =>
    s.classList.contains('reveal')
  );
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${Math.min(idx * 0.08, 0.32)}s`;
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // fallback: navegadores sem suporte simplesmente mostram tudo
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
