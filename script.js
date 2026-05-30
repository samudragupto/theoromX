/* ============================================================
   THEOREMX 2026 — Premium Apple-Inspired JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     NAVBAR — SCROLL GLASSMORPHISM
     ========================================================= */
  const navbar = document.getElementById('navbar');

  const navScrollHandler = () => {
    if (window.scrollY > 24) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', navScrollHandler, { passive: true });
  navScrollHandler();


  /* =========================================================
     MOBILE NAV
     ========================================================= */
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const navClose    = document.getElementById('mobileNavClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    hamburger?.classList.add('open');
    mobileNav?.classList.add('open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMobileNav);
  navClose?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });


  /* =========================================================
     COUNTDOWN TIMER — to 24 June 2026 09:00 IST
     ========================================================= */
  const eventDate = new Date('2026-06-24T09:00:00+05:30').getTime();

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      if (cdDays)  cdDays.textContent  = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins)  cdMins.textContent  = '00';
      if (cdSecs)  cdSecs.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdDays)  cdDays.textContent  = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins)  cdMins.textContent  = pad(mins);
    if (cdSecs)  cdSecs.textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================================================
     SCROLL REVEAL — IntersectionObserver
     ========================================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.07
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


  /* =========================================================
     ACTIVE NAV LINK HIGHLIGHT
     ========================================================= */
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.style.color = isActive ? 'var(--accent)' : '';
          link.style.fontWeight = isActive ? '600' : '';
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => navObserver.observe(s));


  /* =========================================================
     SMOOTH ANCHOR SCROLL
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar?.offsetHeight || 68;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH,
          behavior: 'smooth'
        });
      }
    });
  });


  /* =========================================================
     SCHEDULE FILTER — Session filter pills
     ========================================================= */
  const filterBtns      = document.querySelectorAll('.filter-pill');
  const timelineSessions = document.querySelectorAll('.timeline-session');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      timelineSessions.forEach(session => {
        if (filter === 'all' || session.dataset.session === filter) {
          session.classList.remove('hidden');
          session.style.display = '';
        } else {
          session.classList.add('hidden');
          session.style.display = 'none';
        }
      });
    });
  });


  /* =========================================================
     FAQ ACCORDION
     ========================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(i => {
        const b = i.querySelector('.faq-question');
        const a = i.querySelector('.faq-answer');
        if (b && a) {
          b.setAttribute('aria-expanded', 'false');
          a.style.maxHeight = '0';
        }
      });

      // Open clicked if was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* =========================================================
     MICRO INTERACTION — Card glow on mouse move
     ========================================================= */
  const glowCards = document.querySelectorAll('.stall-card, .award-card, .theme-card, .feature-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });


  /* =========================================================
     THEME CARD — stagger reveal
     ========================================================= */
  document.querySelectorAll('.theme-card').forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 40}ms`);
  });

  document.querySelectorAll('.stall-card').forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 60}ms`);
  });

  document.querySelectorAll('.award-card').forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 55}ms`);
  });

  document.querySelectorAll('.timeline-card').forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 50}ms`);
    card.classList.add('scroll-reveal');
    revealObserver.observe(card);
  });

});
