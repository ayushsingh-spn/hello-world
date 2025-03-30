// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const backToTopBtn = document.getElementById('back-to-top');
const customCursor = document.getElementById('custom-cursor');
const featureCarousel = document.getElementById('feature-carousel');
const featureTrack = document.querySelector('.feature-track');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const timelineEvents = document.querySelectorAll('.timeline-content');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const revealElements = document.querySelectorAll('.reveal-element');

// Theme Toggle
function initTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

// Custom Cursor
function updateCursor(e) {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
}

// Feature Carousel
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function dragStart(e) {
  if (e.type === 'touchstart') {
    startPos = e.touches[0].clientX;
  } else {
    startPos = e.clientX;
    featureTrack.style.cursor = 'grabbing';
  }
  
  isDragging = true;
  featureCarousel.classList.add('active');
}

function drag(e) {
  if (isDragging) {
    let currentPosition = 0;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }
    
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    
    // Apply boundaries
    const maxTranslate = 0;
    const minTranslate = -(featureTrack.offsetWidth - featureCarousel.offsetWidth);
    
    if (currentTranslate > maxTranslate) {
      currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
      currentTranslate = minTranslate;
    }
    
    featureTrack.style.transform = `translateX(${currentTranslate}px)`;
  }
}

function dragEnd() {
  isDragging = false;
  prevTranslate = currentTranslate;
  featureTrack.style.cursor = 'grab';
  featureCarousel.classList.remove('active');
}

// Portfolio Filter
function filterPortfolio(category) {
  portfolioItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    if (category === 'all' || category === itemCategory) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 10);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

// Timeline Events
function toggleTimelineDetails(event) {
  const isActive = event.classList.contains('active');
  
  // Close all open events
  timelineEvents.forEach(item => {
    item.classList.remove('active');
  });
  
  // Toggle the clicked event
  if (!isActive) {
    event.classList.add('active');
  }
}

// Form Validation
function validateForm(form, fields) {
  let isValid = true;
  
  fields.forEach(field => {
    const input = form.querySelector(`#${field}`);
    const errorElement = form.querySelector(`#${field}-error`);
    
    if (!input.value.trim()) {
      errorElement.textContent = 'This field is required';
      isValid = false;
    } else {
      if (field === 'email' && !isValidEmail(input.value)) {
        errorElement.textContent = 'Please enter a valid email address';
        isValid = false;
      } else if (field === 'phone' && !isValidPhone(input.value)) {
        errorElement.textContent = 'Please enter a valid phone number';
        isValid = false;
      } else {
        errorElement.textContent = '';
      }
    }
  });
  
  return isValid;
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(String(phone));
}

// Scroll Reveal
function checkReveal() {
  const triggerBottom = window.innerHeight * 0.8;
  
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < triggerBottom) {
      element.classList.add('active');
    }
  });
}

// Back to Top Button
function toggleBackToTopButton() {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Custom cursor
  document.addEventListener('mousemove', updateCursor);
  
  // Feature carousel
  featureCarousel.addEventListener('mousedown', dragStart);
  featureCarousel.addEventListener('touchstart', dragStart);
  featureCarousel.addEventListener('mousemove', drag);
  featureCarousel.addEventListener('touchmove', drag);
  featureCarousel.addEventListener('mouseup', dragEnd);
  featureCarousel.addEventListener('touchend', dragEnd);
  featureCarousel.addEventListener('mouseleave', dragEnd);
  
  // Portfolio filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      filterPortfolio(category.toLowerCase());
    });
  });
  
  // Timeline events
  timelineEvents.forEach(event => {
    event.addEventListener('click', () => {
      toggleTimelineDetails(event);
    });
  });
  
  // Contact form
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['name', 'email', 'phone', 'budget', 'message'];
    if (validateForm(contactForm, fields)) {
      const submitBtn = contactForm.querySelector('#submit-btn');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        contactForm.reset();
        alert('Thank you for your message. We\'ll get back to you soon!');
      }, 2000);
    }
  });
  
  // Newsletter form
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['newsletter-email'];
    if (validateForm(newsletterForm, fields)) {
      const submitBtn = newsletterForm.querySelector('#newsletter-btn');
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
        newsletterForm.reset();
        alert('Thank you for subscribing to our newsletter!');
      }, 2000);
    }
  });
  
  // Back to top button
  window.addEventListener('scroll', toggleBackToTopButton);
  backToTopBtn.addEventListener('click', scrollToTop);
  
  // Scroll reveal
  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Check on initial load
});