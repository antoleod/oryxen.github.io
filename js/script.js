// ORYXEN TECH — Interactions: navigation, reveal, contact form

document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => navMenu && navMenu.classList.remove('show-menu');

  if (navToggle) navToggle.addEventListener('click', () => navMenu && navMenu.classList.add('show-menu'));
  if (navClose) navClose.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY >= 60) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href').includes(`#${id}`);
        link.classList.toggle('active-link', isActive);
      });
    });
  }, { threshold: 0.45 });
  sections.forEach(section => navObserver.observe(section));

  const revealTargets = document.querySelectorAll('.section[data-reveal]');
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 320) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

  const form = document.querySelector('.contact__form');
  const formStatus = document.querySelector('.form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action') || '';
      const data = new FormData(form);

      if (action.startsWith('mailto:')) {
        const to = action.replace('mailto:', '');
        const name = data.get('name') || 'ORYXEN contact';
        const email = data.get('email') || '';
        const idea = data.get('idea') || '';
        const subject = encodeURIComponent(`Project idea — ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nIdea:\n${idea}`
        );
        formStatus.textContent = 'Opening your email client...';
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        return;
      }

      formStatus.textContent = 'Sending...';
      try {
        const response = await fetch(action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formStatus.textContent = 'Thank you. We will respond within one business day.';
          form.reset();
        } else {
          formStatus.textContent = 'We could not send the form. Please email contact@oryxen.tech.';
        }
      } catch (error) {
        formStatus.textContent = 'Connection issue. Please email contact@oryxen.tech.';
      }
    });
  }
});
