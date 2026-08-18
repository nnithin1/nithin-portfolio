// ===== Navigation scroll effect =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 60);
  lastScroll = scrollY;
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navOverlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navOverlay.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Active nav highlighting =====
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ===== Scroll reveal =====
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ===== Stat counter animation =====
const statValues = document.querySelectorAll('.stat__value[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statValues.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = `${prefix}${current}${progress >= 1 ? suffix : ''}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Subtle parallax on hero gradients =====
const heroGradients = document.querySelectorAll('.hero__gradient');

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    heroGradients.forEach((g, i) => {
      const factor = i === 0 ? 1 : -0.7;
      g.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
}
