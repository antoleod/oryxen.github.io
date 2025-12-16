// ORYXEN TECH - Interacciones suaves y soporte multidioma

document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');
  const langButtons = document.querySelectorAll('.lang-button');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getFromPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  const applyLanguage = (lang) => {
    const dict = translations[lang] || translations.en;
    document.documentElement.setAttribute('lang', lang);
    const metaDescription = document.querySelector('meta[name="description"]');
    if (dict.metaTitle) document.title = dict.metaTitle;
    if (dict.metaDescription && metaDescription) metaDescription.setAttribute('content', dict.metaDescription);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const attr = el.dataset.i18nAttr;
      const value = getFromPath(dict, key);
      if (!value) return;
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });

    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

    try {
      localStorage.setItem('oryxen-lang', lang);
    } catch (_) {
      /* ignore storage errors */
    }
  };

  const storedLang = (() => {
    try { return localStorage.getItem('oryxen-lang'); } catch (_) { return null; }
  })();
  const defaultLang = translations[storedLang] ? storedLang : 'en';
  applyLanguage(defaultLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const closeMenu = () => navMenu && navMenu.classList.remove('show-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => navMenu && navMenu.classList.add('show-menu'));
  }

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

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
        link.classList.toggle('active-link', link.getAttribute('href').includes(id));
      });
    });
  }, { threshold: 0.45 });

  sections.forEach(section => navObserver.observe(section));

  const revealTargets = document.querySelectorAll('.section[data-reveal]');
  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
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
      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          formStatus.textContent = 'Thanks for your message! I will get back to you soon.';
          form.reset();
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              formStatus.textContent = data["errors"].map(error => error["message"]).join(", ")
            } else {
              formStatus.textContent = 'Oops! There was a problem submitting your form';
            }
          })
        }
      } catch (error) {
        formStatus.textContent = 'Oops! There was a problem submitting your form';
      }
    });
  }
});