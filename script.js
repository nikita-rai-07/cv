/**
 * Nikita Portfolio - JavaScript
 * Features: theme toggle, smooth scroll, fade-in on scroll, active nav link, form validation, mobile menu
 */

(function () {
  'use strict';

  // ---------- DOM Elements ----------
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');

  // ---------- Dark / Light mode ----------
  const THEME_KEY = 'nikita-portfolio-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    localStorage.setItem(THEME_KEY, theme || 'light');
  }

  function initTheme() {
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // ---------- Smooth Scrolling ----------
  // Enhance anchor links: scroll to section with offset for fixed header
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: top, behavior: 'smooth' });
          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // ---------- Header scroll effect ----------
  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ---------- Active Navbar Link Highlight ----------
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const headerHeight = header ? header.offsetHeight : 0;

    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---------- Fade-in on Scroll ----------
  const fadeElements = document.querySelectorAll('.fade-in');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px', // trigger when element is 60px from viewport bottom
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // ---------- Mobile Menu Toggle ----------
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Contact Form Validation ----------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateForm() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    clearError('name', 'nameError');
    clearError('email', 'emailError');
    clearError('message', 'messageError');

    if (!name || !name.value.trim()) {
      showError('name', 'nameError', 'Name is required.');
      valid = false;
    }

    if (!email || !email.value.trim()) {
      showError('email', 'emailError', 'Email is required.');
      valid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message || !message.value.trim()) {
      showError('message', 'messageError', 'Message is required.');
      valid = false;
    }

    return valid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        // Form is valid - in a real site you would send to a server here
        alert('Thank you! Your message has been sent. (This is a demo – no email is sent.)');
        contactForm.reset();
        clearError('name', 'nameError');
        clearError('email', 'emailError');
        clearError('message', 'messageError');
      }
    });

    // Clear errors on input
    ['name', 'email', 'message'].forEach(function (id) {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', function () {
          clearError(id, id + 'Error');
        });
      }
    });
  }

  // ---------- Footer Year ----------
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
