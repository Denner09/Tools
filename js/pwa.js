(function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Determine path to sw.js based on current location
            // If page is in /pages/, go up one level.
            const isSubFolder = window.location.pathname.includes('/pages/');
            const swPath = isSubFolder ? '../sw.js' : './sw.js';

            navigator.serviceWorker.register(swPath)
                .then(registration => {
                    console.log('PWA Service Worker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('PWA Service Worker registration failed:', error);
                });
        });
    }
})();
