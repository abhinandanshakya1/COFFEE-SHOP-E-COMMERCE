// Enhanced Coffee Website JavaScript with Dynamic Navbar

class DynamicWebsite {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.scrollProgressBar = document.getElementById('scroll-progress-bar');
    this.navLinks = document.querySelectorAll('.nav-link[data-section]');
    this.sections = document.querySelectorAll('section[id]');
    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.theme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.initializeElements();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupScrollProgress();
    this.initializeTheme();
    this.initializeAnimations();
    this.setupCounterAnimations();
    this.initializeMenuFilter();
    this.hideLoadingScreen();
  }

  initializeElements() {
    this.cart = new ShoppingCart();
    this.notification = new NotificationSystem();
  }

  setupEventListeners() {
    // Scroll event for dynamic navbar
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    
    // Mobile menu toggle
    this.setupMobileMenu();
    
    // Theme toggle
    this.setupThemeToggle();
    
    // Contact form
    this.setupContactForm();
    
    // Smooth scrolling for navigation
    this.setupSmoothScrolling();
    
    // Window resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  setupMobileMenu() {
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");
    const navMenu = document.querySelector("#nav-menu");

    menuOpenButton?.addEventListener("click", () => {
      navMenu.classList.add('active');
      document.body.classList.add("show-mobile-menu");
    });

    menuCloseButton?.addEventListener("click", () => {
      navMenu.classList.remove('active');
      document.body.classList.remove("show-mobile-menu");
    });

    // Close menu when nav link is clicked
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove('active');
        document.body.classList.remove("show-mobile-menu");
      });
    });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    this.notification.show(`Switched to ${this.theme} theme`, 'info');
  }

  initializeTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Update scroll progress
    this.updateScrollProgress();
    
    // Handle navbar visibility and styling
    this.updateNavbarState(currentScrollY);
    
    // Handle parallax effects
    this.handleParallaxEffects(currentScrollY);
    
    this.lastScrollY = currentScrollY;
  }

  updateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    
    this.scrollProgressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
  }

  updateNavbarState(currentScrollY) {
    // Add scrolled class when scrolled down
    if (currentScrollY > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Hide/show navbar based on scroll direction
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      // Scrolling down
      this.navbar.classList.add('hidden');
    } else {
      // Scrolling up
      this.navbar.classList.remove('hidden');
    }

    // Add glass effect when scrolled
    if (currentScrollY > 50) {
      this.navbar.classList.add('glass');
    } else {
      this.navbar.classList.remove('glass');
    }
  }

  handleParallaxEffects(scrollY) {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const rate = scrollY * -0.3;
      heroSection.style.transform = `translateY(${rate}px)`;
    }

    // Parallax for hero particles
    const particles = document.querySelectorAll('.hero-particle');
    particles.forEach((particle, index) => {
      const rate = (scrollY * (0.2 + index * 0.1));
      particle.style.transform = `translateY(${rate}px)`;
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-50px 0px -50px 0px'
    };

    // Observer for active navigation highlighting
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe sections for navigation
    this.sections.forEach(section => navObserver.observe(section));

    // Observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animations
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
      animationObserver.observe(el);
    });
  }

  updateActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  setupScrollProgress() {
    // Create scroll indicator dots
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = this.sections.length > 0 ? 
      Array.from(this.sections).map((section, index) => 
        `<div class="scroll-dot" data-section="${section.id}"></div>`
      ).join('') : '';
    
    if (window.innerWidth > 768) {
      document.body.appendChild(scrollIndicator);
    }
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleContactFormSubmit.bind(this));
    }
  }

  handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validate form
    if (!this.validateForm(name, email, message)) {
      return;
    }
    
    // Simulate form submission
    this.submitContactForm(e.target, { name, email, message });
  }

  validateForm(name, email, message) {
    if (!name || !email || !message) {
      this.notification.show('Please fill in all fields', 'error');
      return false;
    }
    
    if (!this.isValidEmail(email)) {
      this.notification.show('Please enter a valid email address', 'error');
      return false;
    }
    
    return true;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  submitContactForm(form, data) {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.notification.show('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });
  }

  handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  initializeAnimations() {
    // Add animation classes to elements
    this.addAnimationClasses();
    
    // Setup stagger animations
    this.setupStaggerAnimations();
  }

  addAnimationClasses() {
    // Add fade-in animation to menu items
    document.querySelectorAll('.menu-item').forEach((item, index) => {
      item.classList.add('fade-in');
      item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add slide-in animations to contact items
    document.querySelectorAll('.contact-item').forEach((item, index) => {
      item.classList.add('slide-in-left');
      item.style.animationDelay = `${index * 0.2}s`;
    });

    // Add scale-in animations to gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.classList.add('scale-in');
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupStaggerAnimations() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.menu-item, .contact-item, .gallery-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('.menu-section, .contact-section, .gallery-section').forEach(section => {
      staggerObserver.observe(section);
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  initializeMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter menu items
        this.filterMenuItems(menuItems, filter);
      });
    });
  }

  filterMenuItems(items, filter) {
    items.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || 
                        (filter === 'food' && ['refreshment', 'special-combo', 'desserts', 'burger-fries'].includes(category)) ||
                        category === filter;

      if (shouldShow) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  hideLoadingScreen() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 1000);
    });
  }

  handleResize() {
    // Handle responsive changes
    this.updateScrollProgress();
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Enhanced Shopping Cart Class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.isOpen = false;
    this.initializeElements();
    this.loadCartFromStorage();
    this.bindEvents();
    this.updateCartDisplay();
  }

  initializeElements() {
    this.cartButton = document.getElementById('cart-button');
    this.cartSidebar = document.getElementById('cart-sidebar');
    this.cartOverlay = document.getElementById('cart-overlay');
    this.closeCartButton = document.getElementById('close-cart');
    this.cartCount = document.getElementById('cart-count');
    this.cartItems = document.getElementById('cart-items');
    this.cartEmpty = document.getElementById('cart-empty');
    this.cartSubtotal = document.getElementById('cart-subtotal');
    this.cartTotal = document.getElementById('cart-total');
    this.checkoutButton = document.getElementById('checkout-btn');
    this.addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  }

  bindEvents() {
    // Cart toggle events
    this.cartButton?.addEventListener('click', () => this.toggleCart());
    this.closeCartButton?.addEventListener('click', () => this.closeCart());
    this.cartOverlay?.addEventListener('click', () => this.closeCart());

    // Add to cart button events
    this.addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleAddToCart(e));
    });

    // Checkout event
    this.checkoutButton?.addEventListener('click', () => this.handleCheckout());

    // Close cart with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeCart();
      }
    });
  }

  handleAddToCart(e) {
    const button = e.currentTarget;
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const category = button.getAttribute('data-category');

    this.addItem({
      id: category,
      name: name,
      price: price,
      category: category
    });

    // Add visual feedback
    this.animateAddToCart(button);
    
    // Show notification
    window.dynamicWebsite?.notification?.show(`${name} added to cart!`, 'success');
  }

  animateAddToCart(button) {
    button.classList.add('pulse');
    this.cartButton.classList.add('animate');
    
    setTimeout(() => {
      button.classList.remove('pulse');
      this.cartButton.classList.remove('animate');
    }, 600);

    // Button animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  addItem(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    
    this.updateCartDisplay();
    this.saveCartToStorage();
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateCartDisplay();
    this.saveCartToStorage();
  }

  updateQuantity(itemId, change) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.updateCartDisplay();
        this.saveCartToStorage();
      }
    }
  }

  updateCartDisplay() {
    // Update cart count with animation
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.textContent = totalItems;
    this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items display
    if (this.items.length === 0) {
      this.cartItems.classList.remove('has-items');
      this.cartEmpty.style.display = 'block';
    } else {
      this.cartItems.classList.add('has-items');
      this.cartEmpty.style.display = 'none';
      this.renderCartItems();
    }

    // Update totals
    this.updateCartTotals();
  }

  renderCartItems() {
    this.cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-icon">
          ${this.getItemIcon(item.category)}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease" onclick="window.dynamicWebsite.cart.updateQuantity('${item.id}', -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn increase" onclick="window.dynamicWebsite.cart.updateQuantity('${item.id}', 1)">
            <i class="fas fa-plus"></i>
          </button>
          <button class="remove-item-btn" onclick="window.dynamicWebsite.cart.removeItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  getItemIcon(category) {
    const icons = {
      'hot-beverages': '<i class="fas fa-mug-hot"></i>',
      'cold-beverages': '<i class="fas fa-glass-water"></i>',
      'refreshment': '<i class="fas fa-leaf"></i>',
      'special-combo': '<i class="fas fa-utensils"></i>',
      'desserts': '<i class="fas fa-birthday-cake"></i>',
      'burger-fries': '<i class="fas fa-hamburger"></i>'
    };
    return icons[category] || '<i class="fas fa-coffee"></i>';
  }

  updateCartTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // Add tax calculation here if needed
    
    this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    this.cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    this.isOpen = true;
    this.cartSidebar.classList.add('active');
    this.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    this.isOpen = false;
    this.cartSidebar.classList.remove('active');
    this.cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleCheckout() {
    if (this.items.length === 0) {
      window.dynamicWebsite?.notification?.show('Your cart is empty!', 'warning');
      return;
    }

    // Simulate checkout process
    window.dynamicWebsite?.notification?.show('Redirecting to checkout...', 'info');
    
    // Here you would typically redirect to a payment processor
    setTimeout(() => {
      alert('Thank you for your order! This is a demo - no actual payment processed.');
      this.items = [];
      this.updateCartDisplay();
      this.saveCartToStorage();
      this.closeCart();
    }, 1500);
  }

  saveCartToStorage() {
    localStorage.setItem('coffee-cart', JSON.stringify(this.items));
  }

  loadCartFromStorage() {
    const savedCart = localStorage.getItem('coffee-cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to load cart from storage:', e);
        this.items = [];
      }
    }
  }
}

// Notification System Class
class NotificationSystem {
  constructor() {
    this.notification = document.getElementById('notification');
    this.notificationText = document.getElementById('notification-text');
    this.notificationIcon = this.notification?.querySelector('.notification-icon i');
    this.closeButton = this.notification?.querySelector('.notification-close');
    
    this.bindEvents();
  }

  bindEvents() {
    this.closeButton?.addEventListener('click', () => {
      this.hide();
    });
  }

  show(message, type = 'success') {
    if (!this.notification) return;
    
    this.notificationText.textContent = message;
    this.notification.className = `notification ${type}`;
    
    // Update icon based on type
    if (this.notificationIcon) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      this.notificationIcon.className = icons[type] || icons.success;
    }
    
    this.notification.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      this.hide();
    }, 4000);
  }

  hide() {
    if (this.notification) {
      this.notification.classList.remove('show');
    }
  }
}

// Initialize Swiper for testimonials
function initializeSwiper() {
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".slider-wrapper", {
      loop: true,
      grabCursor: true,
      spaceBetween: 25,
      
      // Pagination bullets
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      
      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      
      // Autoplay
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      
      // Responsive breakpoints
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic website
  window.dynamicWebsite = new DynamicWebsite();
  
  // Initialize Swiper
  initializeSwiper();
  
  // Setup service worker for PWA features (optional)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
  const navigationTiming = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', navigationTiming.loadEventEnd - navigationTiming.loadEventStart);
});
