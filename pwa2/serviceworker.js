const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/styles.css',
    '/cotorro.png'
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
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                console.log('Dog image URL:', data.message); // Log para verificar la URL de la imagen
                const options = {
                    body: event.data ? event.data.text() : 'Tienes una nueva notificación!',
                    icon: '/cotorro.png',
                    badge: '/cotorro.png',
                    image: data.message, // Imagen obtenida de la API de Dog
                    data: {
                        url: data.message // URL de la imagen para abrir al hacer clic
                    }
                };
                self.registration.showNotification('Mi Notificación PWA', options);
            })
            .catch(error => {
                console.error('Error fetching dog image:', error);
                const options = {
                    body: event.data ? event.data.text() : 'Tienes una nueva notificación!',
                    icon: '/cotorro.png',
                    badge: '/cotorro.png'
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