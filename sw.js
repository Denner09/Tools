const CACHE_NAME = 'business-tools-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './js/security.js',
    './assets/logo.png',
    
    // Pages
    './pages/pdf-tools.html',
    './pages/flowchart.html',
    
    // JS Logic
    './js/pdf-logic.js',
    './js/flowchart-logic.js',
    './js/pdf/utils.js',
    './js/pdf/compression.js',
    './js/pdf/conversion.js',
    './js/pdf/manipulation.js',
    './js/pdf/analysis.js',
    './css/flowchart.css',

    // External Libs (Cache specific versions to ensure offline access)
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/vue@3/dist/vue.global.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    
    // PDF Libs
    'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
    
    // BPMN Libs & Fonts
    'https://unpkg.com/bpmn-js@13.2.2/dist/assets/diagram-js.css',
    'https://unpkg.com/bpmn-js@13.2.2/dist/assets/bpmn-font/css/bpmn.css',
    'https://unpkg.com/bpmn-js@13.2.2/dist/bpmn-modeler.development.js',
    // Fonts explicitly
    'https://unpkg.com/bpmn-js@13.2.2/dist/assets/bpmn-font/font/bpmn.woff',
    'https://unpkg.com/bpmn-js@13.2.2/dist/assets/bpmn-font/font/bpmn.woff2',
    'https://unpkg.com/bpmn-js@13.2.2/dist/assets/bpmn-font/font/bpmn.ttf'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Clone request because it's a stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if valid response. 
                        // IMPORTANT: For CDNs (CORS), type will be 'cors', so we must allow it.
                        if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
                            return response;
                        }

                        // Clone response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Only cache GET requests
                                if (event.request.method === 'GET') {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
