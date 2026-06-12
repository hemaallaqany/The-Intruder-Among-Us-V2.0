const CACHE_NAME = 'imposter-game-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght=400;600;700;900&display=swap',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

// تثبيت السيرفس وركر وتخزين الملفات الأساسية في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل الوركر وتنظيف الكاش القديم لضمان تحديث التطبيق تلقائياً
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// إدارة جلب البيانات وتشغيل ميزة الأوفلاين
self.addEventListener('fetch', event => {
  // استثناء طلبات الفايربيس السحابية لكي لا تتعطل الغرف الحية (أونلاين) عند وجود شبكة
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('firestore')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
