/* LearnBe - Learning Management System JS Scripts */

window.AppJS = {
    init() {
        this.script();
    },
    script: function() {
        setTimeout(() => {
            document.querySelector('.preloader').classList.add('hidden');
        }, 100);

        // Initialize LazyLoad
        window.lazyLoadInstance = new LazyLoad({
            elements_selector: '.lazyload',
            callback_loaded: function(el) {
                el.closest('.lazyload-container').classList.add('loaded');
            }
        });

        const lazyLoadObserver = new MutationObserver(() => {
            window.lazyLoadInstance.update();
        });

        lazyLoadObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-src', 'src']
        });

        // Initialize Main Swipers
        document.querySelectorAll('.main-swiper').forEach(function(el) {
            try {
                let options = el.getAttribute('data-swiper');

                if (! options) {
                    return;
                }

                eval('options=' + options);

                let swiper = new Swiper(el, options);

                el.addEventListener('mouseenter', () => {
                    swiper.autoplay.stop();
                });

                el.addEventListener('mouseleave', () => {
                    swiper.autoplay.start();
                });
            } catch(err) {
                console.error('Check swiper options', err);
            }
        });

        // Unified Navigation Component
        Alpine.data('unifiedNavigation', () => ({
            scrolled: false,
            mobileMenuOpen: false,
            megaMenuOpen: null,
            isMobile: false,
            currentMenu: null,
            breadcrumbs: [],

            init() {
                try {
                    this.handleScroll();
                    this.handleResize();
                    this.checkMobile();

                    window.addEventListener('scroll', () => this.handleScroll());
                    window.addEventListener('resize', () => this.handleResize());
                } catch (error) {
                    // Fallback initialization
                    this.scrolled = false;
                    this.mobileMenuOpen = false;
                    this.isMobile = false;
                }
            },

            checkMobile() {
                this.isMobile = window.innerWidth < 1024;
            },

            handleScroll() {
                this.scrolled = window.scrollY > 20;
            },

            handleResize() {
                this.checkMobile();

                if (window.innerWidth >= 1024) {
                    this.mobileMenuOpen = false;
                    this.closeMegaMenu();
                }
            },

            openMobileMenu() {
                this.mobileMenuOpen = true;
            },

            closeMobileMenu() {
                this.mobileMenuOpen = false;
            },

            toggleMobileMenu() {
                this.mobileMenuOpen = ! this.mobileMenuOpen;

                if (this.mobileMenuOpen) {
                    this.closeMegaMenu();
                }
            },

            openMegaMenu(menu) {
                this.megaMenuOpen = menu;

                this.currentMenu = {
                    el: this.$el,
                    title: this.$el.innerText || this.$el.textContent,
                };
            },

            closeMegaMenu() {
                this.megaMenuOpen = null;

                this.currentMenu = null;
            },

            toggleMegaMenu(menuName) {
                if (this.megaMenuOpen === menuName) {
                    this.closeMegaMenu();
                } else {
                    this.openMegaMenu(menuName);

                    // this.closeMegaMenu();

                    // setTimeout(() => {
                    //     this.openMegaMenu(menuName);
                    // }, 150);
                }
            },

            openMegaMenuOnHover(menuName) {
                if (this.isMobile) {
                    return; // Don't open mega menu on hover on mobile
                }

                this.openMegaMenu(menuName);
            },

            goBack() {
                //
            },
        }));

        // Modal Component
        Alpine.data('modal', () => ({
            isOpen: false,

            open() {
                this.isOpen = true;
                document.body.style.overflow = 'hidden';
            },

            close() {
                this.isOpen = false;
                document.body.style.overflow = '';
            },

            closeOnBackdrop(event) {
                if (event.target === event.currentTarget) {
                    this.close();
                }
            }
        }));

        // Accordion Component
        Alpine.data('accordion', () => ({
            activeItem: null,

            toggle(item) {
                this.activeItem = this.activeItem === item ? null : item;
            },

            isActive(item) {
                return this.activeItem === item;
            }
        }));

        // Counter Component
        Alpine.data('counter', () => ({
            count: 0,
            target: 0,
            duration: 2000,

            init() {
                // Get target and duration from data attributes
                const targetAttr = this.$el.getAttribute('data-target');
                const durationAttr = this.$el.getAttribute('data-duration');

                // Parse values with fallbacks
                this.target = parseInt(targetAttr) || 0;
                this.duration = parseInt(durationAttr) || 2000;

                // Set initial count to 0
                this.count = 0;

                // Start the counter animation after a short delay
                setTimeout(() => {
                    this.startCounter();
                }, 500);
            },

            startCounter() {
                if (this.target <= 0) {
                    this.count = 0;
                    return;
                }

                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / this.duration, 1);

                    this.count = Math.floor(this.target * progress);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        this.count = this.target;
                    }
                };

                animate();
            }
        }));

        // Contact Form Component
        Alpine.data('contactForm', () => ({
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                subject: '',
                category: '',
                message: '',
                priority: 'low'
            },
            errors: {},
            isSubmitting: false,
            showSuccess: false,
            showError: false,
            errorMessage: '',

            init() {
                // Initialize form data from existing form fields if needed
            },

            async submitForm() {
                // Basic validation
                this.errors = {};

                if (!this.formData.firstName) this.errors.firstName = 'First name is required';
                if (!this.formData.lastName) this.errors.lastName = 'Last name is required';
                if (!this.formData.email) {
                    this.errors.email = 'Email is required';
                } else if (!this.isValidEmail(this.formData.email)) {
                    this.errors.email = 'Please enter a valid email';
                }
                if (!this.formData.subject) this.errors.subject = 'Subject is required';
                if (!this.formData.message) this.errors.message = 'Message is required';

                if (Object.keys(this.errors).length > 0) return;

                this.isSubmitting = true;
                this.showSuccess = false;
                this.showError = false;

                try {
                    // Brevo (Sendinblue) API integration
                    // Replace 'YOUR_BREVO_API_KEY' with your actual Brevo API key

                    const brevoApiKey = 'YOUR_BREVO_API_KEY';

                    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': brevoApiKey,
                        },
                        body: JSON.stringify({
                            sender: {
                                name: `${this.formData.firstName} ${this.formData.lastName}`,
                                email: 'hello@learnbe.com' // Replace with your verified sender email
                            },
                            to: [{
                                email: 'support@learnbe.com', // Replace with your receiving email
                                name: 'LearnBe Support Team'
                            }],
                            subject: `[Contact Form] ${this.formData.subject}`,
                            htmlContent: `
                                <!DOCTYPE html>
                                <html>
                                    <head>
                                        <meta charset="utf-8">
                                        <title>New Contact Form Submission</title>
                                    </head>
                                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                        <h2 style="color: #667eea;">New Contact Form Submission</h2>

                                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Name:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.firstName} ${this.formData.lastName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Email:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.email}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Phone:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.phone || 'Not provided'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Subject:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.subject}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Category:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.category || 'Not specified'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Priority:</td>
                                                <td style="padding: 8px; border: 1px solid #ddd;">${this.formData.priority}</td>
                                            </tr>
                                        </table>

                                        <h3 style="color: #667eea;">Message:</h3>
                                        <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #667eea;">
                                            <p>${this.formData.message.replace(/\n/g, '<br>')}</p>
                                        </div>
                                    </body>
                                </html>
                            `
                        })
                    });

                    if (response.ok) {
                        this.showSuccess = true;
                        // Reset form
                        this.formData = {
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            subject: '',
                            category: '',
                            message: '',
                            priority: 'low'
                        };
                        setTimeout(() => this.showSuccess = false, 5000);
                    } else {
                        const data = await response.json();
                        throw new Error(data.message || 'Failed to send message');
                    }
                } catch (error) {
                    console.error('Failed to send message:', error);

                    this.showError = true;
                    this.errorMessage = 'Failed to send message. Please try again.';
                    setTimeout(() => this.showError = false, 5000);
                } finally {
                    this.isSubmitting = false;
                }
            },

            isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
        }));

        // Newsletter Subscription Component
        Alpine.data('newsletter', () => ({
            email: '',
            isSubmitting: false,
            showSuccess: false,
            showError: false,
            errorMessage: '',

            async subscribe() {
                if (!this.isValidEmail(this.email)) {
                    this.showError = true;
                    this.errorMessage = 'Please enter a valid email address';
                    setTimeout(() => {
                        this.showError = false;
                        this.errorMessage = '';
                    }, 3000);
                    return;
                }

                this.isSubmitting = true;
                this.showSuccess = false;
                this.showError = false;

                try {
                    // Brevo (Sendinblue) API integration for newsletter subscription
                    // Replace 'YOUR_BREVO_API_KEY' with your actual Brevo API key

                    const brevoApiKey = 'YOUR_BREVO_API_KEY';

                    const response = await fetch('https://api.brevo.com/v3/contacts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': brevoApiKey,
                        },
                        body: JSON.stringify({
                            email: this.email,
                            attributes: {
                                FIRSTNAME: '',
                                LASTNAME: ''
                            },
                            listIds: [1], // Replace with your actual list ID
                            updateEnabled: true
                        })
                    });

                    if (response.ok) {
                        this.showSuccess = true;
                        this.email = '';
                        setTimeout(() => this.showSuccess = false, 5000);
                    } else {
                        const data = await response.json();
                        throw new Error(data.message || 'Failed to subscribe');
                    }
                } catch (error) {
                    console.error('Failed to subscribe:', error);

                    this.showError = true;
                    this.errorMessage = 'Failed to subscribe. Please try again.';
                    setTimeout(() => {
                        this.showError = false;
                        this.errorMessage = '';
                    }, 3000);
                } finally {
                    this.isSubmitting = false;
                }
            },

            isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
        }));

        // Filter Component
        Alpine.data('filter', (config = {}) => ({
            filters: {
                search: '',
                category: '',
                price: '',
                rating: ''
            },
            items: config.items || [],
            filteredItems: [],
            sortBy: 'default',
            viewMode: 'grid',

            init() {
                // Initialize with the passed items
                if (config.items) {
                    this.items = config.items;
                }

                // Wait a bit for Alpine.js to fully initialize
                setTimeout(() => {
                    this.applyFilters();
                }, 100);
            },

            applyFilters() {
                let filtered = [...this.items];

                // Apply search filter
                if (this.filters.search) {
                    const searchTerm = this.filters.search.toLowerCase();
                    filtered = filtered.filter(item =>
                        item.title.toLowerCase().includes(searchTerm) ||
                        item.description.toLowerCase().includes(searchTerm) ||
                        item.instructor.toLowerCase().includes(searchTerm)
                    );
                }

                // Apply category filter
                if (this.filters.category) {
                    filtered = filtered.filter(item => item.category === this.filters.category);
                }

                // Apply price filter
                if (this.filters.price) {
                    const [min, max] = this.filters.price.split('-').map(Number);
                    filtered = filtered.filter(item => {
                        const price = Number(item.price);
                        if (max === 999) {
                            return price >= min;
                        }
                        return price >= min && price <= max;
                    });
                }

                // Apply rating filter
                if (this.filters.rating) {
                    const minRating = Number(this.filters.rating);
                    filtered = filtered.filter(item => Number(item.rating) >= minRating);
                }

                // Apply sorting
                filtered = this.sortItems(filtered);

                this.filteredItems = filtered;

                // Reinitialize motion animations for dynamically added content
                setTimeout(() => {
                    if (window.MotionPresets && typeof window.MotionPresets.reinit === 'function') {
                        window.MotionPresets.reinit();
                    }
                }, 0);
            },

            sortItems(items) {
                switch (this.sortBy) {
                    case 'price-low':
                        return [...items].sort((a, b) => Number(a.price) - Number(b.price));
                    case 'price-high':
                        return [...items].sort((a, b) => Number(b.price) - Number(a.price));
                    case 'rating':
                        return [...items].sort((a, b) => Number(b.rating) - Number(a.rating));
                    case 'popular':
                        return [...items].sort((a, b) => Number(b.students) - Number(a.students));
                    case 'newest':
                        return [...items].sort((a, b) => b.id - a.id);
                    default:
                        return items;
                }
            },

            updateFilter(key, value) {
                this.filters[key] = value;
                this.applyFilters();
            },

            clearFilters() {
                this.filters = {
                    search: '',
                    category: '',
                    price: '',
                    rating: ''
                };
                this.sortBy = 'default';
                this.applyFilters();
            },

            resetFilters() {
                this.clearFilters();
            }
        }));

        // Testimonials Filter Component
        Alpine.data('testimonialsFilter', () => ({
            selectedRating: null,
            testimonials: [],
            filteredTestimonials: [],

            init() {
                this.applyFilters();
            },

            filterByRating(rating) {
                this.selectedRating = this.selectedRating === rating ? null : rating;
                this.applyFilters();
            },

            applyFilters() {
                if (!this.selectedRating) {
                    this.filteredTestimonials = this.testimonials;
                } else {
                    this.filteredTestimonials = this.testimonials.filter(
                        testimonial => testimonial.rating >= this.selectedRating
                    );
                }

                // Reinitialize motion animations for dynamically added content
                setTimeout(() => {
                    if (window.MotionPresets && typeof window.MotionPresets.reinit === 'function') {
                        window.MotionPresets.reinit();
                    }
                }, 0);
            },

            resetFilters() {
                this.selectedRating = null;
                this.applyFilters();
            }
        }));

        // Cart Component
        Alpine.data('cart', () => ({
            items: [],
            isOpen: false,

            init() {
                try {
                    this.loadFromStorage();
                } catch (error) {
                    // Fallback to empty cart if storage fails
                    this.items = [];
                }
            },

            addItem(item) {
                const existingItem = this.items.find(i => i.id === item.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.items.push({ ...item, quantity: 1 });
                }
                this.saveToStorage();
            },

            removeItem(itemId) {
                this.items = this.items.filter(item => item.id !== itemId);
                this.saveToStorage();
            },

            updateQuantity(itemId, quantity) {
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    item.quantity = Math.max(0, quantity);
                    if (item.quantity === 0) {
                        this.removeItem(itemId);
                    }
                }
                this.saveToStorage();
            },

            getTotal() {
                return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getItemCount() {
                return this.items.reduce((count, item) => count + item.quantity, 0);
            },

            clear() {
                this.items = [];
                this.saveToStorage();
            },

            toggle() {
                this.isOpen = !this.isOpen;
            },

            saveToStorage() {
                try {
                    localStorage.setItem('cart', JSON.stringify(this.items));
                } catch (error) {
                    // Silently fail if storage is not available
                }
            },

            loadFromStorage() {
                try {
                    const saved = localStorage.getItem('cart');
                    if (saved) {
                        this.items = JSON.parse(saved);
                    }
                } catch (error) {
                    // Fallback to empty cart if storage fails
                    this.items = [];
                }
            }
        }));

        // Form Validation Component
        Alpine.data('formValidation', () => ({
            errors: {},
            isSubmitting: false,

            validateField(field, value, rules) {
                const fieldErrors = [];

                if (rules.required && !value) {
                    fieldErrors.push('This field is required');
                }

                if (rules.minLength && value && value.length < rules.minLength) {
                    fieldErrors.push(`Minimum length is ${rules.minLength} characters`);
                }

                if (rules.email && value && !this.isValidEmail(value)) {
                    fieldErrors.push('Please enter a valid email address');
                }

                if (fieldErrors.length > 0) {
                    this.errors[field] = fieldErrors;
                } else {
                    delete this.errors[field];
                }
            },

            isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },

            hasErrors() {
                return Object.keys(this.errors).length > 0;
            },

            getFieldErrors(field) {
                return this.errors[field] || [];
            }
        }));

        // Course Rating Filter Component
        Alpine.data('courseRatingFilter', () => ({
            selectedRating: null,
            courses: [],
            filteredCourses: [],

            init() {
                this.applyFilters();
            },

            filterByRating(rating) {
                this.selectedRating = this.selectedRating === rating ? null : rating;
                this.applyFilters();
            },

            applyFilters() {
                if (!this.selectedRating) {
                    this.filteredCourses = this.courses;
                } else {
                    this.filteredCourses = this.courses.filter(
                        course => course.rating >= this.selectedRating
                    );
                }

                // Reinitialize motion animations for dynamically added content
                setTimeout(() => {
                    if (window.MotionPresets && typeof window.MotionPresets.reinit === 'function') {
                        window.MotionPresets.reinit();
                    }
                }, 0);
            },

            resetFilters() {
                this.selectedRating = null;
                this.applyFilters();
            }
        }));

        // Book Rating Filter Component
        Alpine.data('bookRatingFilter', () => ({
            selectedRating: null,
            books: [],
            filteredBooks: [],

            init() {
                this.applyFilters();
            },

            filterByRating(rating) {
                this.selectedRating = this.selectedRating === rating ? null : rating;
                this.applyFilters();
            },

            applyFilters() {
                if (!this.selectedRating) {
                    this.filteredBooks = this.books;
                } else {
                    this.filteredBooks = this.books.filter(
                        book => book.rating >= this.selectedRating
                    );
                }

                // Reinitialize motion animations for dynamically added content
                setTimeout(() => {
                    if (window.MotionPresets && typeof window.MotionPresets.reinit === 'function') {
                        window.MotionPresets.reinit();
                    }
                }, 0);
            },

            resetFilters() {
                this.selectedRating = null;
                this.applyFilters();
            }
        }));

        // Utility Functions
        window.scrollToEelement = function(optionsOrSelector) {
            if (typeof optionsOrSelector === 'object' && optionsOrSelector !== null) {
                // Handle native scrollTo options
                window.scroll(optionsOrSelector);
            } else {
                // Handle custom element scroll
                const element = document.querySelector(optionsOrSelector);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        };

        window.formatCurrency = function(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };

        window.formatDate = function(date) {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date));
        };

        // Utility Functions
        window.debounce = function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        window.throttle = function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        document.addEventListener('DOMContentLoaded', function() {
            // Initialize motion presets for data-motion animations
            if (window.MotionPresets && typeof window.MotionPresets.init === 'function') {
                window.MotionPresets.init();
            }
        });
    },
};

document.addEventListener('alpine:init', () => {
    AppJS.init();
});
