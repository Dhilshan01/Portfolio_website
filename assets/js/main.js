/* ===== MOBILE MENU ===== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    navToggle.innerHTML = navMenu.classList.contains('show')
      ? '<i class="bx bx-x"></i>'
      : '<i class="bx bx-menu"></i>';
  });
}

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.innerHTML = '<i class="bx bx-menu"></i>';
  });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${sectionId}"]`);
    if (link) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}
window.addEventListener('scroll', scrollActive);

/* ===== TYPING ANIMATION ===== */
const roles = [
  'Software Engineer',
  'Full-Stack Developer',
  'Software Developer',
  
  
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing');

function type() {
  if (!typingEl) return;
  const current = roles[roleIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }
  setTimeout(type, speed);
}
type();

/* ===== EXPERIENCE DURATION ===== */
document.querySelectorAll('[data-duration-start]').forEach(durationEl => {
  const start = new Date(`${durationEl.dataset.durationStart}T00:00:00`);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let months = (today.getFullYear() - start.getFullYear()) * 12;
  months += today.getMonth() - start.getMonth();
  if (today.getDate() < start.getDate()) months -= 1;
  months = Math.max(0, months);

  durationEl.textContent = months
    ? `${months} month${months === 1 ? '' : 's'}`
    : 'Less than 1 month';
});

/* ===== SKILL BARS ANIMATION ===== */
function animateBars(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill__bar').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }
  });
}
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  new IntersectionObserver(animateBars, { threshold: 0.2 }).observe(skillsSection);
}

/* ===== CERTIFICATE CAROUSEL ===== */
const certificateTrack = document.querySelector('.certificates__grid');
const certificateCards = document.querySelectorAll('.certificate__card');
const certificatePrev = document.querySelector('[data-certificate-prev]');
const certificateNext = document.querySelector('[data-certificate-next]');
const certificateDots = document.querySelector('.certificates__dots');
const certificateCarousel = document.querySelector('.certificates');
let certificateIndex = 0;
let certificateTimer;

function getVisibleCertificates() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function renderCertificateDots() {
  if (!certificateDots) return;
  const pages = Math.max(1, certificateCards.length - getVisibleCertificates() + 1);
  certificateDots.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'certificates__dot';
    dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
    dot.addEventListener('click', () => {
      certificateIndex = i;
      updateCertificateCarousel();
    });
    certificateDots.appendChild(dot);
  }
}

function updateCertificateCarousel() {
  if (!certificateTrack || !certificateCards.length) return;
  const visible = getVisibleCertificates();
  const maxIndex = Math.max(0, certificateCards.length - visible);
  certificateIndex = Math.min(certificateIndex, maxIndex);
  const cardWidth = certificateCards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(certificateTrack).gap) || 0;
  certificateTrack.style.transform = `translateX(-${certificateIndex * (cardWidth + gap)}px)`;

  certificateDots?.querySelectorAll('.certificates__dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === certificateIndex);
  });
}

function goToNextCertificate() {
  const maxIndex = Math.max(0, certificateCards.length - getVisibleCertificates());
  certificateIndex = certificateIndex === maxIndex ? 0 : certificateIndex + 1;
  updateCertificateCarousel();
}

function startCertificateAutoplay() {
  if (!certificateTrack || certificateCards.length <= getVisibleCertificates()) return;
  stopCertificateAutoplay();
  certificateTimer = setInterval(goToNextCertificate, 2000);
}

function stopCertificateAutoplay() {
  if (certificateTimer) {
    clearInterval(certificateTimer);
    certificateTimer = null;
  }
}

function restartCertificateAutoplay() {
  stopCertificateAutoplay();
  startCertificateAutoplay();
}

if (certificateTrack && certificateCards.length) {
  renderCertificateDots();
  updateCertificateCarousel();
  startCertificateAutoplay();

  certificatePrev?.addEventListener('click', () => {
    const maxIndex = Math.max(0, certificateCards.length - getVisibleCertificates());
    certificateIndex = certificateIndex === 0 ? maxIndex : certificateIndex - 1;
    updateCertificateCarousel();
    restartCertificateAutoplay();
  });

  certificateNext?.addEventListener('click', () => {
    goToNextCertificate();
    restartCertificateAutoplay();
  });

  certificateCarousel?.addEventListener('mouseenter', stopCertificateAutoplay);
  certificateCarousel?.addEventListener('mouseleave', startCertificateAutoplay);
  certificateCarousel?.addEventListener('focusin', stopCertificateAutoplay);
  certificateCarousel?.addEventListener('focusout', startCertificateAutoplay);

  window.addEventListener('resize', () => {
    renderCertificateDots();
    updateCertificateCarousel();
    restartCertificateAutoplay();
  });
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== STICKY HEADER SHADOW ===== */
window.addEventListener('scroll', () => {
  const header = document.querySelector('.l-header');
  if (header) {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.4)'
      : 'none';
  }
});
