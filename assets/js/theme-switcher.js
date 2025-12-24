// Theme Switcher for LearnBe - Dark Mode and RTL/LTR Support using Tailwind 4
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentDirection = localStorage.getItem('direction') || 'ltr';
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyDirection();
        this.addSystemThemeListener();
    }

    // Theme Management
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    applyTheme() {
        const root = document.documentElement;
        const body = document.body;

        if (this.currentTheme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark');
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', this.currentTheme === 'dark' ? '#0f172a' : '#ffffff');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Direction Management
    setDirection(direction) {
        this.currentDirection = direction;
        localStorage.setItem('direction', direction);
        this.applyDirection();
    }

    applyDirection() {
        const root = document.documentElement;
        const body = document.body;

        // Remove existing direction classes
        root.classList.remove('ltr', 'rtl');
        body.classList.remove('ltr', 'rtl');

        // Add new direction class
        root.classList.add(this.currentDirection);
        body.classList.add(this.currentDirection);

        // Set dir attribute
        root.setAttribute('dir', this.currentDirection);
        body.setAttribute('dir', this.currentDirection);
    }

    toggleDirection() {
        const newDirection = this.currentDirection === 'ltr' ? 'rtl' : 'ltr';
        this.setDirection(newDirection);
    }

    // System Theme Detection
    addSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e) => {
                if (localStorage.getItem('theme') === 'system') {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            };

            mediaQuery.addEventListener('change', handleChange);
        }
    }

    // Utility methods
    isDark() {
        return this.currentTheme === 'dark';
    }

    isRTL() {
        return this.currentDirection === 'rtl';
    }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.themeSwitcher = new ThemeSwitcher();
    } catch (error) {
        console.error('Error initializing ThemeSwitcher:', error);
    }
});
