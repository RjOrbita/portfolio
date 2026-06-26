/**
 * main.js — Core portfolio interactions
 * Handles: navbar scroll behavior, active section highlight,
 * theme toggle, AOS scroll animations, project filters,
 * skill bar animations, stat counter, timeline animation,
 * and contact form.
 */
(function () {
  'use strict';

  /* ── Helpers ───────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     1. NAVBAR — scroll glass effect & active link highlight
     ============================================================ */
  const navbar    = $('#navbar');
  const navLinks  = $$('.nav-link');
  const sections  = $$('section[id]');

  window.addEventListener('scroll', () => {
    // Glass effect on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  /* ── Smooth scroll offset for fixed nav ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      // Close mobile nav
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ============================================================
     2. HAMBURGER MENU (mobile)
     ============================================================ */
  const hamburger  = $('#hamburger');
  const navLinksEl = $('#nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  /* ============================================================
     3. THEME TOGGLE — dark/light with localStorage
     ============================================================ */
  const themeToggle = $('#theme-toggle');
  const html        = document.documentElement;

  // Restore saved theme
  const savedTheme = localStorage.getItem('rjo-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('rjo-theme', next);
  });

  /* ============================================================
     4. AOS — Animate On Scroll (IntersectionObserver)
     ============================================================ */
  function initAOS() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay
            ? parseInt(entry.target.dataset.aosDelay)
            : 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    $$('[data-aos]').forEach(el => observer.observe(el));
  }

  /* ============================================================
     5. PROJECT FILTERS
     ============================================================ */
  function initProjectFilters() {
    const filterBtns  = $$('.filter-btn');
    const projectCards = $$('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const category = card.dataset.category;
          const visible  = filter === 'all' || category === filter;

          if (visible) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInCard 0.4s ease forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── Keyframe for filtered cards ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ============================================================
     6. SKILL BAR ANIMATIONS
     ============================================================ */
  function initSkillBars() {
    const skillFills = $$('.skill-fill');
    const observer   = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const width = el.dataset.width || '0';
          el.style.width = width + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(el => observer.observe(el));
  }

  /* ============================================================
     7. STAT COUNTERS
     ============================================================ */
  function initCounters() {
    const statNumbers = $$('.stat-number[data-target]');
    const observer    = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * target);
      el.textContent = value === target && target === 999 ? '999+' : value;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ============================================================
     8. TIMELINE LINE ANIMATION
     ============================================================ */
  function initTimeline() {
    const timelineLine = $('.timeline-line');
    if (!timelineLine) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineLine.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(timelineLine);
  }

  /* ============================================================
     9. CONTACT FORM
     ============================================================ */
  function initContactForm() {
    const form   = $('#contact-form');
    const status = $('#form-status');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = $('#form-submit');
      submitBtn.textContent = 'Sending... ⏳';
      submitBtn.disabled = true;

      // Simulate send (replace with Formspree or EmailJS endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success feedback
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.style.color = '#22d3ee';
      form.reset();
      submitBtn.textContent = 'Send Message 🚀';
      submitBtn.disabled = false;

      // Clear after 5s
      setTimeout(() => { status.textContent = ''; }, 5000);
    });
  }

  /* ============================================================
     10. PARTICLE CANVAS SIZING
     ============================================================ */
  function initCanvas() {
    const canvas = $('#particle-canvas');
    if (!canvas) return;
    const hero   = $('#hero');
    canvas.style.width  = hero.offsetWidth  + 'px';
    canvas.style.height = hero.offsetHeight + 'px';
  }

  /* ============================================================
     11. MODAL & GALLERY
     ============================================================ */
  function initModal() {
    const modal = $('#project-modal');
    if (!modal) return;

    const closeBtn = $('#modal-close');
    const mainImg = $('#gallery-main-img');
    const placeholder = $('#gallery-placeholder');
    const folderHint = $('#gallery-folder-hint');
    const prevBtn = $('#gallery-prev');
    const nextBtn = $('#gallery-next');
    const counter = $('#gallery-counter');
    const dotsContainer = $('#gallery-dots');
    
    const titleEl = $('#modal-title');
    const tagsEl = $('#modal-tags');
    const descEl = $('#modal-desc');
    const githubBtn = $('#modal-github');

    let currentImages = [];
    let currentIndex = 0;

    // Hardcoded project data to populate modal easily
    const projectData = {
      'jobsearch': {
        title: 'Job Search Website',
        tags: ['PHP', 'MySQL', 'HTML & CSS', 'JavaScript'],
        desc: 'A web platform designed to connect job seekers with employers. Features job listings, applicant profiles, and a streamlined application process built with a PHP and MySQL backend.',
        github: 'https://github.com/RjOrbita',
        folder: 'assets/images/projects/jobsearch/',
        images: ['1.jpg', '2.jpg', '3.jpg'] // We assume up to 3 images
      },
      'qroster': {
        title: 'QRoster Mobile App',
        tags: ['React Native', 'Expo', 'Firebase', 'Attendance'],
        desc: 'A co-developed mobile application designed for seamless attendance tracking and roster management using QR code scanning technology.',
        github: 'https://github.com/RjOrbita',
        folder: 'assets/images/projects/qroster/',
        images: ['1.jpg', '2.jpg', '3.jpg']
      },
      'thesis-research': {
        title: 'Image Forgery Detection',
        tags: ['Undergraduate Thesis', 'Research'],
        desc: 'This study explores the detection of digitally manipulated images using a Support Vector Machine (SVM) classifier paired with multi-feature extraction techniques.',
        github: '', // Hidden in research view
        folder: 'assets/images/projects/thesis/',
        images: ['1.jpg', '2.jpg', '3.jpg']
      }
    };

    function openModal(projectId) {
      const data = projectData[projectId];
      if (!data) return;

      // Populate text
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      
      // Populate tags
      tagsEl.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag tag-purple';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });

      // Github button
      if (data.github) {
        githubBtn.style.display = 'inline-flex';
        githubBtn.href = data.github;
      } else {
        githubBtn.style.display = 'none';
      }

      // Prepare images
      currentImages = data.images.map(img => data.folder + img);
      currentIndex = 0;
      updateGallery();

      // Folder hint for the user
      folderHint.textContent = data.folder;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      mainImg.src = '';
    }

    function updateGallery() {
      if (currentImages.length === 0) return;
      
      // We will try to load the image. If it fails, we show placeholder.
      const src = currentImages[currentIndex];
      
      mainImg.classList.remove('active');
      
      // Small timeout to restart animation
      setTimeout(() => {
        mainImg.src = src;
        
        mainImg.onload = () => {
          mainImg.style.display = 'block';
          mainImg.classList.add('active');
          placeholder.style.display = 'none';
        };
        
        mainImg.onerror = () => {
          mainImg.style.display = 'none';
          placeholder.style.display = 'flex';
        };
      }, 50);

      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

      // Update dots
      dotsContainer.innerHTML = '';
      currentImages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `gallery-dot ${i === currentIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateGallery();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function nextImg() {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateGallery();
    }

    function prevImg() {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateGallery();
    }

    // Event Listeners
    $$('.project-card-clickable').forEach(card => {
      card.addEventListener('click', () => {
        openModal(card.dataset.project);
      });
    });

    const researchBtn = $('#research-gallery-btn');
    if (researchBtn) {
      researchBtn.addEventListener('click', () => {
        openModal(researchBtn.dataset.project);
      });
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    prevBtn.addEventListener('click', prevImg);
    nextBtn.addEventListener('click', nextImg);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
      if (e.key === 'ArrowRight' && modal.classList.contains('active')) {
        nextImg();
      }
      if (e.key === 'ArrowLeft' && modal.classList.contains('active')) {
        prevImg();
      }
    });
  }

  /* ============================================================
     INITIALISE ALL
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initProjectFilters();
    initSkillBars();
    initCounters();
    initTimeline();
    initContactForm();
    initCanvas();
    initModal();
  });

})();
