/**
 * Portfolio Modern JavaScript
 * ES6+ Features, Modular Architecture, Performance Optimized
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 50
  },
  observer: {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  },
  typing: {
    speed: 100,
    deleteSpeed: 50,
    pause: 2000
  }
};

const TEXTS = {
  en: ['Full-Stack Developer', 'Web Designer', 'Problem Solver', 'Freelancer'],
  fr: ['Développeur Full-Stack', 'Designer Web', 'Résolveur de Problèmes', 'Freelance'],
  ar: ['مطور ويب متكامل', 'مصمم ويب', 'حل المشكلات', 'مستقل']
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
  constructor() {
    this.themeToggle = $('#themeToggle');
    this.html = document.documentElement;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  applyTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update toggle button icon
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggle());
    }
  }
}

// ============================================
// COLOR MANAGER
// ============================================
class ColorManager {
  constructor() {
    this.colorButtons = $$('.color-btn');
    this.currentColor = localStorage.getItem('accent-color') || '#6366f1';
    
    this.init();
  }

  init() {
    this.applyColor(this.currentColor);
    this.bindEvents();
  }

  applyColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accent-color', color);
    
    // Update active state
    this.colorButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
  }

  bindEvents() {
    this.colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyColor(btn.dataset.color);
      });
    });
  }
}

// ============================================
// NAVIGATION MANAGER
// ============================================
class NavigationManager {
  constructor() {
    this.navbar = $('#navbar');
    this.navToggle = $('#navToggle');
    this.navMenu = $('#navMenu');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupScrollSpy();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(link.getAttribute('href'));
        if (target) {
          this.closeMenu();
          this.smoothScroll(target);
        }
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.navMenu?.classList.contains('active') && 
          !this.navMenu.contains(e.target) && 
          !this.navToggle?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Scroll handler
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
  }

  toggleMenu() {
    this.navMenu?.classList.toggle('active');
    this.navToggle?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  closeMenu() {
    this.navMenu?.classList.remove('active');
    this.navToggle?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  smoothScroll(target) {
    const offset = this.navbar?.offsetHeight || 0;
    const targetPosition = target.offsetTop - offset - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background
    if (this.navbar) {
      this.navbar.classList.toggle('scrolled', scrollY > 100);
    }

    // Back to top button
    const backToTop = $('#backToTop');
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }
  }

  setupScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    this.sections.forEach(section => observer.observe(section));
  }
}

// ============================================
// TYPING ANIMATION
// ============================================
class TypeWriter {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = { ...CONFIG.typing, ...options };
    
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.options.pause;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ============================================
// ANIMATION OBSERVER
// ============================================
class AnimationObserver {
  constructor() {
    this.elements = $$('[data-animate]');
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Handle stagger animations
          const stagger = entry.target.querySelectorAll('[data-stagger]');
          stagger.forEach((el, i) => {
            setTimeout(() => el.classList.add('animated'), i * CONFIG.animations.stagger);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, CONFIG.observer);

    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================
// SKILLS ANIMATION
// ============================================
class SkillsAnimation {
  constructor() {
    this.skillBars = $$('.skill-progress');
    this.init();
  }

  init() {
    if (!this.skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkills();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const skillsSection = $('#skills');
    if (skillsSection) observer.observe(skillsSection);
  }

  animateSkills() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.dataset.width;
        if (width) {
          bar.style.width = width;
          bar.classList.add('animated');
        }
      }, index * 100);
    });
  }
}

// ============================================
// PORTFOLIO FILTER
// ============================================
class PortfolioFilter {
  constructor() {
    this.filterButtons = $$('.filter-btn');
    this.portfolioItems = $$('.portfolio-item');
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filter(filter);
        
        // Update active state
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  filter(category) {
    this.portfolioItems.forEach(item => {
      const itemCategory = item.dataset.category;
      const shouldShow = category === 'all' || itemCategory === category;
      
      if (shouldShow) {
        item.style.display = 'block';
        item.classList.add('fade-in');
        setTimeout(() => item.classList.remove('fade-in'), 300);
      } else {
        item.style.display = 'none';
      }
    });
  }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
  constructor() {
    this.form = $('#contactForm');
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.bindEvents();
    this.setupFloatingLabels();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  setupFloatingLabels() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('focused');
        if (input.value) {
          input.parentElement?.classList.add('has-value');
        } else {
          input.parentElement?.classList.remove('has-value');
        }
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    this.setLoading(true);
    
    // Send to Formspree
    try {
      const formData = new FormData(this.form);
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
        this.form.reset();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send');
      }
    } catch (error) {
      console.error('Form error:', error);
      this.showNotification('Failed to send message. Please email me directly at safwanboumoula0@gmail.com', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  validateForm() {
    const required = this.form.querySelectorAll('[required]');
    let isValid = true;
    
    required.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    return isValid;
  }

  setLoading(loading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = loading;
      this.submitBtn.innerHTML = loading 
        ? '<span class="spinner"></span> Sending...'
        : '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    }
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => notification.classList.add('show'));
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ============================================
// COOKIE CONSENT
// ============================================
class CookieConsent {
  constructor() {
    this.consent = $('#cookieConsent');
    this.acceptBtn = $('#acceptCookies');
    this.declineBtn = $('#declineCookies');
    
    this.init();
  }

  init() {
    if (!this.consent) return;
    
    // Check if already accepted
    if (localStorage.getItem('cookies-accepted')) {
      this.consent.style.display = 'none';
      return;
    }
    
    this.bindEvents();
    
    // Show after delay
    setTimeout(() => this.consent.classList.add('show'), 2000);
  }

  bindEvents() {
    this.acceptBtn?.addEventListener('click', () => this.accept());
    this.declineBtn?.addEventListener('click', () => this.decline());
  }

  accept() {
    localStorage.setItem('cookies-accepted', 'true');
    this.hide();
  }

  decline() {
    localStorage.setItem('cookies-accepted', 'false');
    this.hide();
  }

  hide() {
    this.consent?.classList.remove('show');
    setTimeout(() => {
      if (this.consent) this.consent.style.display = 'none';
    }, 300);
  }
}

// ============================================
// PRELOADER
// ============================================
class Preloader {
  constructor() {
    this.preloader = $('#preloader');
    this.init();
  }

  init() {
    if (!this.preloader) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.preloader.classList.add('fade-out');
        setTimeout(() => {
          this.preloader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 500);
      }, 1000);
    });
  }
}

// ============================================
// BACK TO TOP
// ============================================
class BackToTop {
  constructor() {
    this.button = $('#backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;
    
    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================
// SETTINGS PANEL
// ============================================
class SettingsPanel {
  constructor() {
    this.settings = $('#themeSettings');
    this.toggle = $('#settingsToggle');
    this.panel = $('#settingsPanel');
    
    this.init();
  }

  init() {
    if (!this.settings) return;
    
    this.bindEvents();
  }

  bindEvents() {
    this.toggle?.addEventListener('click', () => {
      this.panel?.classList.toggle('open');
      this.toggle?.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.panel?.classList.contains('open') && 
          !this.settings.contains(e.target)) {
        this.panel.classList.remove('open');
        this.toggle?.classList.remove('active');
      }
    });
  }
}

// ============================================
// LANGUAGE MANAGER
// ============================================
class LanguageManager {
  constructor() {
    this.select = $('#languageSelect');
    this.currentLang = localStorage.getItem('language') || 'en';
    
    this.init();
  }

  init() {
    if (this.select) {
      this.select.value = this.currentLang;
      this.bindEvents();
    }
  }

  bindEvents() {
    this.select?.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  }

  changeLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update typing animation texts
    const dynamicText = $('#dynamicText');
    if (dynamicText && window.typeWriter) {
      window.typeWriter.texts = TEXTS[lang] || TEXTS.en;
      window.typeWriter.textIndex = 0;
      window.typeWriter.charIndex = 0;
      window.typeWriter.isDeleting = false;
    }
    
    // RTL support for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
}

// ============================================
// CURSOR EFFECT
// ============================================
class CustomCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursorDot = document.createElement('div');
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    
    this.init();
  }

  init() {
    if (this.isTouch) return; // Disable on touch devices
    
    this.cursor.className = 'custom-cursor';
    this.cursorDot.className = 'cursor-dot';
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorDot);
    
    this.bindEvents();
  }

  bindEvents() {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      this.cursorDot.style.left = `${mouseX}px`;
      this.cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth cursor follow
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      this.cursor.style.left = `${cursorX}px`;
      this.cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animate);
    };
    animate();

    // Hover effects
    const interactiveElements = $$('a, button, .service-card, .portfolio-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
    });
  }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class ParallaxEffect {
  constructor() {
    this.elements = $$('[data-parallax]');
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    
    this.init();
  }

  init() {
    if (this.isTouch || !this.elements.length) return;
    
    window.addEventListener('scroll', throttle(() => this.update(), 16));
  }

  update() {
    const scrolled = window.scrollY;
    
    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
class MagneticButtons {
  constructor() {
    this.buttons = $$('.btn-magnetic');
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    
    this.init();
  }

  init() {
    if (this.isTouch) return;
    
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
      btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
    });
  }

  handleMove(e, btn) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  }

  handleLeave(e, btn) {
    btn.style.transform = 'translate(0, 0)';
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new Preloader();
  new ThemeManager();
  new ColorManager();
  new NavigationManager();
  new SettingsPanel();
  new LanguageManager();
  new CookieConsent();
  new BackToTop();
  
  // Animations
  new AnimationObserver();
  new SkillsAnimation();
  new PortfolioFilter();
  
  // Forms
  new ContactForm();
  
  // Effects
  new ParallaxEffect();
  new MagneticButtons();
  new CustomCursor();
  
  // Initialize TypeWriter
  const dynamicText = $('#dynamicText');
  if (dynamicText) {
    const lang = localStorage.getItem('language') || 'en';
    window.typeWriter = new TypeWriter(dynamicText, TEXTS[lang] || TEXTS.en);
  }
  
  // Initialize AOS-like animations
  $$('[data-aos]').forEach(el => {
    el.classList.add('aos-init');
  });
  
  // Performance: Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    $$('img[data-src]').forEach(img => imageObserver.observe(img));
  }
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Prefetch visible links
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target;
        if (link.href && !link.href.includes('#')) {
          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = link.href;
          document.head.appendChild(prefetch);
        }
        observer.unobserve(link);
      }
    });
  });
  
  $$('a[href^="http"]').forEach(link => observer.observe(link));
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    NavigationManager,
    TypeWriter,
    ContactForm
  };
}
