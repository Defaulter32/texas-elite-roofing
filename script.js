document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const header = document.querySelector('[data-site-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const desktopNavLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navTargets = desktopNavLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const setActiveNav = (id) => {
  desktopNavLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};
setActiveNav('top');
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActiveNav(visible.target.id);
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .5, .75, 1] });
navTargets.forEach((target) => navObserver.observe(target));
desktopNavLinks.forEach((link) => link.addEventListener('click', () => setActiveNav(link.getAttribute('href').slice(1))));

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const setMenu = (open) => {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
};
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      entry.target.addEventListener('transitionend', () => {
        entry.target.style.transitionDelay = '';
      }, { once: true });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealItems.forEach((item) => revealObserver.observe(item));

const hero = document.querySelector('.hero');
if (hero) {
  requestAnimationFrame(() => hero.classList.add('is-visible'));
}

const servicesMotion = document.querySelector('.services-motion');
const marqueeTrack = document.querySelector('.marquee-track');
const aboutImage = document.querySelector('.about-image-wrap');
let scrollFrame = 0;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const updateScrollMotion = () => {
  scrollFrame = 0;
  if (prefersReducedMotion.matches) return;

  if (servicesMotion && marqueeTrack) {
    const rect = servicesMotion.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    const travel = Math.max(0, marqueeTrack.scrollWidth / 2 - window.innerWidth * 0.2);
    marqueeTrack.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
  }

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height));
    const heroImage = hero.querySelector('.hero-image');
    const heroDetail = hero.querySelector('.hero-detail');
    const heroTitle = hero.querySelector('h1');
    if (heroImage) heroImage.style.transform = `translate3d(0, ${progress * 2.5}%, 0)`;
    if (heroDetail) heroDetail.style.transform = `translate3d(0, ${progress * -3}%, 0)`;
    if (heroTitle) heroTitle.style.setProperty('--hero-type-y', `${progress * -18}px`);
  }

  if (aboutImage) {
    const rect = aboutImage.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    aboutImage.style.transform = `translate3d(0, ${(progress - .5) * -22}px, 0)`;
  }
};
const scheduleScrollMotion = () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollMotion);
};
window.addEventListener('scroll', scheduleScrollMotion, { passive: true });
window.addEventListener('resize', scheduleScrollMotion, { passive: true });
scheduleScrollMotion();

const projectData = [
  { src: 'assets/roofing-generated/project-cottage.png', title: 'Cottage in Texas', alt: 'Cottage in Texas with a charcoal metal roof' },
  { src: 'assets/roofing-generated/service-installation.png', title: 'Roof Installation', alt: 'Roof installation in progress' },
  { src: 'assets/roofing-generated/project-modern-home.png', title: 'Residential House in Texas', alt: 'Modern residential house in Texas' },
  { src: 'assets/roofing-generated/project-mountain-home.png', title: 'Roof Restoration', alt: 'Modern home with restored metal roof' }
];
const projectImage = document.querySelector('[data-project-image]');
const projectTitle = document.querySelector('[data-project-title]');
const projectCaption = document.querySelector('[data-project-caption]');
const projectCount = document.querySelector('[data-project-count]');
const projectMedia = document.querySelector('.project-media');
document.querySelector('.project-overlay')?.classList.add('is-visible');
let projectIndex = 0;

const renderProject = (nextIndex) => {
  projectIndex = (nextIndex + projectData.length) % projectData.length;
  const project = projectData[projectIndex];
  projectMedia?.classList.add('is-changing');
  window.setTimeout(() => {
    if (projectImage) {
      projectImage.src = project.src;
      projectImage.alt = project.alt;
    }
    if (projectTitle) projectTitle.textContent = project.title;
    if (projectCaption) projectCaption.textContent = project.title;
    if (projectCount) projectCount.textContent = `${projectIndex + 1} — ${projectData.length}`;
    projectMedia?.classList.remove('is-changing');
  }, 160);
};

document.querySelector('[data-project-prev]')?.addEventListener('click', () => renderProject(projectIndex - 1));
document.querySelector('[data-project-next]')?.addEventListener('click', () => renderProject(projectIndex + 1));
document.querySelector('.project-card-featured')?.addEventListener('mouseenter', () => window.clearInterval(projectTimer));
document.querySelector('.project-card-featured')?.addEventListener('mouseleave', () => startProjectTimer());
document.querySelector('.project-card-featured')?.addEventListener('focusin', () => window.clearInterval(projectTimer));
document.querySelector('.project-card-featured')?.addEventListener('focusout', () => startProjectTimer());

let projectTimer;
const startProjectTimer = () => {
  window.clearInterval(projectTimer);
  if (!prefersReducedMotion.matches) projectTimer = window.setInterval(() => renderProject(projectIndex + 1), 3500);
};
startProjectTimer();

const reviewSlides = [
  {
    quote: '“Robert did a good job handling all the details of getting a new roof. He was a good advocate in dealing with the insurance company and knew the best way to get the best results for a new roof. Solid job!”',
    name: 'Bryan S',
    location: 'Texas, 1234 Elm Street,\nAustin, TX 78701, USA'
  },
  {
    quote: '“The team showed up prepared, explained every step, and left the property cleaner than they found it. The finished roof looks exceptional.”',
    name: 'Megan R',
    location: 'Fort Worth, TX'
  },
  {
    quote: '“From inspection to installation, the process was clear and professional. We always knew what was happening and why.”',
    name: 'Chris T',
    location: 'Burleson, TX'
  },
  {
    quote: '“A thoughtful crew, precise work, and a roof that feels built for the next twenty years. We would recommend them without hesitation.”',
    name: 'Lauren M',
    location: 'Arlington, TX'
  }
];
const quote = document.querySelector('[data-review-quote]');
const count = document.querySelector('[data-review-count]');
const personName = document.querySelector('.review-person h2');
const personLocation = document.querySelector('.review-person p');
const reviewThumbs = [...document.querySelectorAll('[data-review-index]')];
let reviewIndex = 0;

const renderReview = (nextIndex) => {
  reviewIndex = (nextIndex + reviewSlides.length) % reviewSlides.length;
  const slide = reviewSlides[reviewIndex];
  if (quote) {
    quote.style.opacity = '0';
    window.setTimeout(() => {
      quote.textContent = slide.quote;
      quote.style.opacity = '1';
    }, 130);
  }
  if (count) count.textContent = `${reviewIndex + 1} — ${reviewSlides.length}`;
  if (personName) personName.textContent = slide.name;
  if (personLocation) personLocation.innerHTML = slide.location.replace('\n', '<br />');
  reviewThumbs.forEach((thumb, index) => {
    const active = index === reviewIndex;
    thumb.classList.toggle('is-active', active);
    thumb.setAttribute('aria-selected', String(active));
  });
};

document.querySelector('[data-review-prev]')?.addEventListener('click', () => renderReview(reviewIndex - 1));
document.querySelector('[data-review-next]')?.addEventListener('click', () => renderReview(reviewIndex + 1));
reviewThumbs.forEach((thumb) => thumb.addEventListener('click', () => renderReview(Number(thumb.dataset.reviewIndex))));

const reviewSection = document.querySelector('.reviews');
let reviewTimer;
const startReviewTimer = () => {
  window.clearInterval(reviewTimer);
  if (!prefersReducedMotion.matches) reviewTimer = window.setInterval(() => renderReview(reviewIndex + 1), 6200);
};
reviewSection?.addEventListener('mouseenter', () => window.clearInterval(reviewTimer));
reviewSection?.addEventListener('mouseleave', () => startReviewTimer());
startReviewTimer();

prefersReducedMotion.addEventListener?.('change', () => {
  startProjectTimer();
  startReviewTimer();
});
