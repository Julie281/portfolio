const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');
const siteHeader = document.querySelector('.site-header');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const setHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', setHeaderState);
window.addEventListener('load', setHeaderState);

const internalLinks = document.querySelectorAll('a[href^="#"]');

const getScrollAnchor = (section) => {
  if (!section) return null;
  return section.querySelector('[data-scroll-anchor]') || section;
};

const scrollToHashTarget = (hash, updateHash = true) => {
  if (!hash || hash === '#') return;
  const section = document.querySelector(hash);
  if (!section) return;

  const anchor = getScrollAnchor(section);
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 82;
  const extraOffset = window.innerWidth <= 560 ? 12 : 20;
  const top = anchor.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;

  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });

  if (updateHash) {
    history.replaceState(null, '', hash);
  }
};

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    scrollToHashTarget(href);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    setTimeout(() => scrollToHashTarget(window.location.hash, false), 40);
  }
});
