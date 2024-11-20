const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/styles.css',
    '/cat.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching all assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request).then((response) => {
                return response || caches.match('/offline.html');
            }))
    );
});

self.addEventListener('push', (event) => {
    event.waitUntil(
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(response => response.json())
            .then(data => {
                console.log('Cat image URL:', data.message); 
                const options = {
                    body: event.data ? event.data.text() : 'Tienes una nueva notificación!',
                    icon: '/cat.png',
                    badge: '/cat.png',
                    image: data.message, 
                    data: {
                        url: data.message 
                    }
                };
                self.registration.showNotification('Mi Notificación PWA', options);
            })
            .catch(error => {
                console.error('Error al mandar foto de gato:', error);
                const options = {
                    body: event.data ? event.data.text() : 'Tienes una nueva notificación!',
                    icon: '/cat.png',
                    badge: '/cat.png'
                };
                self.registration.showNotification('Mi Notificación PWA', options);
            })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});