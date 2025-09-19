// Application data and configuration
const portfolioData = {
  typingTexts: [
    "Software Engineer",
    "Python Developer", 
    "ML Enthusiast",
    "DRDO Intern",
    "Problem Solver"
  ],
  stats: {
    projectAccuracy: 95,
    yearsExperience: 2,
    certifications: 8
  },
  skills: {
    python: 95,
    java: 85,
    cpp: 80,
    javascript: 75,
    pythonML: 90,
    nlp: 75,
    computerVision: 80,
    matlab: 60
  }
};

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Typing animation for hero section
class TypingAnimation {
  constructor(element, texts, speed = 100) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.start();
  }
  
  start() {
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
    
    let typeSpeed = this.speed;
    
    if (this.isDeleting) {
      typeSpeed /= 2;
    }
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// Smooth scrolling functionality
class SmoothScroller {
  constructor() {
    this.init();
  }
  
  init() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-buttons a, .cta-buttons a');
    navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', this.handleClick.bind(this));
      }
    });
  }
  
  handleClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Navigation active state handler
class NavigationHandler {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.navbar = document.querySelector('.navbar');
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', debounce(this.handleScroll.bind(this), 10));
    this.handleScroll(); // Initial call
  }
  
  handleScroll() {
    this.updateActiveNavigation();
    this.updateNavbarStyle();
  }
  
  updateActiveNavigation() {
    const scrollPos = window.pageYOffset + 150;
    
    let current = '';
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  
  updateNavbarStyle() {
    if (window.pageYOffset > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
}

// Mobile menu toggle
class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.nav-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    this.toggle.addEventListener('click', this.toggleMenu.bind(this));
    
    // Close menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.closeMenu.bind(this));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }
  
  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }
}

// Intersection Observer for animations
class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );
    
    this.init();
  }
  
  init() {
    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      this.observer.observe(section);
    });
    
    // Observe individual elements
    const animatedElements = document.querySelectorAll(
      '.highlight-item, .timeline-item, .skill-item, .project-card, .cert-item, .contact-item'
    );
    animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Handle counter animations
        this.animateCounters(entry.target);
        
        // Handle skill bar animations
        this.animateSkillBars(entry.target);
        
        // Stop observing once animated
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  animateCounters(target) {
    const counters = target.querySelectorAll('[data-target]');
    counters.forEach(counter => {
      if (!counter.classList.contains('counted')) {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, targetValue);
        counter.classList.add('counted');
      }
    });
  }
  
  animateSkillBars(target) {
    const skillBars = target.querySelectorAll('.skill-progress[data-progress]');
    skillBars.forEach(bar => {
      if (!bar.classList.contains('animated')) {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
          bar.style.width = progress + '%';
        }, 300);
        bar.classList.add('animated');
      }
    });
  }
}

// Parallax effect for hero section
class ParallaxEffect {
  constructor() {
    this.heroSection = document.querySelector('.hero');
    this.heroContent = document.querySelector('.hero-content');
    
    if (this.heroSection) {
      this.init();
    }
  }
  
  init() {
    window.addEventListener('scroll', debounce(this.handleScroll.bind(this), 10));
  }
  
  handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (this.heroContent && scrolled < window.innerHeight) {
      this.heroContent.style.transform = `translateY(${rate}px)`;
    }
  }
}

// Interactive elements handler
class InteractiveElements {
  constructor() {
    this.init();
  }
  
  init() {
    this.addHoverEffects();
    this.addClickEffects();
  }
  
  addHoverEffects() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Add hover effects to timeline items
    const timelineItems = document.querySelectorAll('.timeline-content');
    timelineItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-6px)';
        item.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = '';
      });
    });
  }
  
  addClickEffects() {
    // Add click effects to social links
    const socialLinks = document.querySelectorAll('.social-link, .footer-social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        link.style.position = 'relative';
        link.style.overflow = 'hidden';
        link.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  optimizeAnimations() {
    // Reduce animations on slower devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-motion');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('paused-animations');
      } else {
        document.body.classList.remove('paused-animations');
      }
    });
  }
}

// Skills data initialization
function initializeSkillsData() {
  const skillProgressBars = document.querySelectorAll('.skill-progress');
  skillProgressBars.forEach(bar => {
    const skillName = bar.closest('.skill-item').querySelector('.skill-name').textContent.toLowerCase();
    const progress = portfolioData.skills[skillName.replace(/[^a-z]/g, '')] || 70;
    bar.setAttribute('data-progress', progress);
  });
}

// Statistics data initialization  
function initializeStatsData() {
  const statElements = document.querySelectorAll('[data-target]');
  statElements.forEach(element => {
    const parent = element.closest('.highlight-item');
    if (parent) {
      const label = parent.querySelector('.highlight-label').textContent.toLowerCase();
      if (label.includes('accuracy')) {
        element.setAttribute('data-target', portfolioData.stats.projectAccuracy);
      } else if (label.includes('experience')) {
        element.setAttribute('data-target', portfolioData.stats.yearsExperience);
      } else if (label.includes('certification')) {
        element.setAttribute('data-target', portfolioData.stats.certifications);
      }
    }
  });
}

// Add CSS animations for ripple effect
function addRippleCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .paused-animations * {
      animation-play-state: paused !important;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(var(--color-slate-900-rgb), 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: var(--space-20);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all var(--duration-normal) var(--ease-standard);
      }
      
      .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .nav-toggle.active span:nth-child(2) {
        opacity: 0;
      }
      
      .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  `;
  document.head.appendChild(style);
}

// Error handling
function handleErrors() {
  window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// Main initialization function
function initializePortfolio() {
  try {
    // Add necessary CSS
    addRippleCSS();
    
    // Initialize data
    initializeSkillsData();
    initializeStatsData();
    
    // Initialize all components
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
      new TypingAnimation(typingElement, portfolioData.typingTexts, 120);
    }
    
    new SmoothScroller();
    new NavigationHandler();
    new MobileMenu();
    new AnimationObserver();
    new ParallaxEffect();
    new InteractiveElements();
    new PerformanceOptimizer();
    
    // Setup error handling
    handleErrors();
    
    console.log('Portfolio initialized successfully');
    
  } catch (error) {
    console.error('Error initializing portfolio:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}

// Additional utility functions for external use
window.portfolioUtils = {
  scrollToSection: (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      const headerHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = section.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  },
  
  updateTypingTexts: (newTexts) => {
    portfolioData.typingTexts = newTexts;
  },
  
  animateElement: (element) => {
    if (element) {
      element.classList.add('fade-in');
    }
  }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { portfolioData, initializePortfolio };
}