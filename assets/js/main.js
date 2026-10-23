/* ================================================
   PAUL LIMO & AIRPORT SERVICES — Main JS (Ultra-Luxury)
   ================================================ */

'use strict';

// ── Init on DOM ready ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero')?.classList.add('loaded');
  initCounters();
  initHeroSlideshow();
});

// ── Navbar scroll ──────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

// ── Active nav link on scroll ──────────────────────────────
(function initActiveLinks() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navh') || '80') + 40;
    sections.forEach(sec => {
      const inView = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
      links.forEach(a => {
        if (a.getAttribute('href') === '#' + sec.id) a.classList.toggle('active', inView);
      });
    });
  }, { passive: true });
})();

// ── Hamburger / Mobile Drawer ──────────────────────────────
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (!btn || !drawer) return;

  function toggle(force) {
    const open = typeof force === 'boolean' ? force : !btn.classList.contains('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => toggle());

  drawer.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => toggle(false)));

  document.addEventListener('click', e => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && e.target !== btn) {
      toggle(false);
    }
  });
})();

// ── Hero Particles ─────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const n = window.innerWidth < 768 ? 14 : 28;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'pt';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 30 + 65}%;
      animation-duration: ${Math.random() * 7 + 7}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

// ── Hero Slideshow ─────────────────────────────────────────
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const bars = document.querySelectorAll('.hero-progress-bar');
  if (!slides.length) return;
  let cur = 0;
  let timer;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    if (bars[cur]) bars[cur].classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (bars[cur]) bars[cur].classList.add('active');
  }

  function start() {
    timer = setInterval(() => goTo(cur + 1), 5500);
  }

  bars.forEach((bar, i) => {
    bar.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      start();
    });
  });

  start();
}

// ── Hero Parallax (scroll) ─────────────────────────────────
(function initHeroParallax() {
  const bg = document.querySelector('.hero-bg');
  if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      bg.style.transform = `scale(1.06) translateY(${y * 0.15}px)`;
    }
  }, { passive: true });
})();

// ── Quick-booking bar → scroll to quote ───────────────────
(function initBookingBar() {
  const btn = document.getElementById('bbCheckBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const quote = document.getElementById('quote');
    if (quote) {
      const navh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navh') || '80');
      window.scrollTo({ top: quote.offsetTop - navh, behavior: 'smooth' });
    }
  });
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ── Counter Animation ──────────────────────────────────────
function initCounters() {
  function countUp(el, target, dur) {
    let start;
    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - prog, 3)) * target);
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.target;
        const dur = target > 100 ? 2200 : 1600;
        countUp(entry.target, target, dur);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(el => obs.observe(el));
}

// ── Service Accordion ─────────────────────────────────────
(function initAccordion() {
  document.querySelectorAll('.acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = btn.nextElementSibling;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (body) body.removeAttribute('hidden');
      } else {
        if (body) body.setAttribute('hidden', '');
      }
    });
  });
})();

// ── Fleet Tab Switcher ────────────────────────────────────
(function initFleet() {
  const tabs = document.querySelectorAll('.fleet-tab');
  const panels = document.querySelectorAll('.fleet-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const panelId = 'panel-' + tab.dataset.panel;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => { p.classList.remove('active'); p.setAttribute('hidden', ''); });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(panelId);
      if (target) { target.classList.add('active'); target.removeAttribute('hidden'); }
    });
  });

  // Fleet "Request This Vehicle" → pre-select in form and scroll
  document.querySelectorAll('.fleet-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vehicle = btn.dataset.vehicle;
      const radio = document.querySelector(`input[name="vehicle"][value="${vehicle}"]`);
      if (radio) radio.checked = true;
      const quote = document.getElementById('quote');
      if (quote) {
        const navh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navh') || '80');
        window.scrollTo({ top: quote.offsetTop - navh, behavior: 'smooth' });
      }
    });
  });
})();

// ── Multi-Step Quote Form ────────────────────────────────
(function initForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const dots = Array.from(document.querySelectorAll('.step-dot'));
  const lines = Array.from(document.querySelectorAll('.step-line'));
  let current = 1;

  function showStep(n) {
    steps.forEach(s => {
      if (+s.dataset.step === n) { s.hidden = false; s.classList.add('active'); }
      else { s.hidden = true; s.classList.remove('active'); }
    });
    dots.forEach((d, i) => {
      const step = i + 1;
      d.classList.toggle('active', step === n);
      d.classList.toggle('done', step < n);
    });
    lines.forEach((l, i) => l.classList.toggle('done', i + 1 < n));
    current = n;
  }

  function validateStep(n) {
    let valid = true;
    if (n === 1) {
      ['f-pickup', 'f-dropoff', 'f-date', 'f-time'].forEach(id => {
        const el = document.getElementById(id);
        const err = el?.nextElementSibling;
        if (el && !el.value.trim()) {
          el.classList.add('error');
          if (err) err.textContent = 'This field is required.';
          valid = false;
        } else if (el) {
          el.classList.remove('error');
          if (err) err.textContent = '';
        }
      });
    }
    if (n === 2) {
      const checked = form.querySelector('input[name="vehicle"]:checked');
      const err = form.querySelector('.vehicle-error');
      if (!checked) {
        if (err) err.textContent = 'Please select a vehicle class.';
        valid = false;
      } else if (err) {
        err.textContent = '';
      }
    }
    if (n === 3) {
      ['f-name', 'f-phone', 'f-email'].forEach(id => {
        const el = document.getElementById(id);
        const err = el?.nextElementSibling;
        if (el && !el.value.trim()) {
          el.classList.add('error');
          if (err) err.textContent = 'This field is required.';
          valid = false;
        } else if (id === 'f-email' && el && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          el.classList.add('error');
          if (err) err.textContent = 'Please enter a valid email.';
          valid = false;
        } else if (el) {
          el.classList.remove('error');
          if (err) err.textContent = '';
        }
      });
    }
    return valid;
  }

  form.addEventListener('click', e => {
    if (e.target.classList.contains('form-next')) {
      const nextStep = +e.target.dataset.next;
      if (validateStep(current)) showStep(nextStep);
    }
    if (e.target.classList.contains('form-prev')) {
      showStep(+e.target.dataset.prev);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateStep(3)) return;
    steps.forEach(s => { s.hidden = true; });
    const success = document.getElementById('formSuccess');
    if (success) success.hidden = false;
    // Check if lottie loaded; if not, show fallback
    const lottieEl = success?.querySelector('.lottie-success');
    const fallback = success?.querySelector('.success-fallback');
    if (lottieEl && typeof lottieEl.load !== 'function') {
      lottieEl.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
    }
  });

  // Clear errors on input
  form.addEventListener('input', e => {
    const el = e.target;
    if (el.classList.contains('error')) {
      el.classList.remove('error');
      const err = el.nextElementSibling;
      if (err?.classList.contains('field-error')) err.textContent = '';
    }
  });
})();

// ── Testimonial Slider ────────────────────────────────────
(function initTestimonials() {
  const slides = Array.from(document.querySelectorAll('.testi-slide'));
  const dots = Array.from(document.querySelectorAll('.t-dot'));
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');
  if (!slides.length) return;

  let cur = 0, timer;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    dots[cur].setAttribute('aria-selected', 'false');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    dots[cur].setAttribute('aria-selected', 'true');
  }

  function startAuto() { timer = setInterval(() => goTo(cur + 1), 5200); }
  function stopAuto()  { clearInterval(timer); }

  startAuto();

  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(cur - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(cur + 1); startAuto(); });
})();

// ── Smooth Anchor Scroll ──────────────────────────────────
(function initSmoothScroll() {
  const navh = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navh') || '80');
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - navh(), behavior: 'smooth' });
      }
    });
  });
})();

// ── Footer Year ───────────────────────────────────────────
(function setFooterYear() {
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// ── Lottie Fallback ───────────────────────────────────────
(function initLottieFallbacks() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const scrollLottie = document.querySelector('.lottie-scroll');
      const scrollFallback = document.querySelector('.scroll-fallback');
      if (scrollLottie && scrollFallback) {
        if (!scrollLottie.shadowRoot && !scrollLottie.loaded) {
          scrollLottie.style.display = 'none';
          scrollFallback.style.display = 'block';
        }
      }
    }, 2500);
  });
})();
