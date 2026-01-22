const { createApp } = Vue;

createApp({
    data() {
        return {
            isDark: false,
            isNavOpen: false
        }
    },
    mounted() {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
        }
        this.applyTheme();
    },
    methods: {
        toggleTheme() {
            this.isDark = !this.isDark;
            this.applyTheme();
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        },
        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        },
        toggleNav() {
            this.isNavOpen = !this.isNavOpen;
            if (this.isNavOpen) {
                setTimeout(() => document.addEventListener('click', this.closeNav), 0);
            }
        },
        closeNav() {
            this.isNavOpen = false;
            document.removeEventListener('click', this.closeNav);
        }
    }
}).mount('#app');
