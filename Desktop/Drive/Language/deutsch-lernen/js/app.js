/* ============================================
   App — Shared Utilities & Navigation
   ============================================ */

const App = (() => {

  // ---- Theme Toggle ----

  function initTheme() {
    const darkMode = Progress.getSetting('darkMode');
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      Progress.setSetting('darkMode', false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      Progress.setSetting('darkMode', true);
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
  }

  // ---- Mobile Nav ----

  function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-links');
    if (hamburger && links) {
      hamburger.addEventListener('click', () => {
        links.classList.toggle('open');
      });
    }
  }

  // ---- Active Nav Link ----

  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ---- Data Loading ----

  async function loadJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.json();
    } catch (e) {
      console.error('Error loading JSON:', e);
      return null;
    }
  }

  // ---- Utility: Shuffle array ----

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---- Utility: Get URL params ----

  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  // ---- Initialize ----

  function init() {
    initTheme();
    initMobileNav();
    setActiveNav();
    Progress.updateStreak();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { loadJSON, shuffle, getParam, toggleTheme };
})();
