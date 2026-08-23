const CACHE_NAME = 'shoshin-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(cls => {
      if(cls.length > 0) return cls[0].focus();
      return clients.openWindow('/shoshin');
    })
  );
});

// Handle scheduled alarms sent from the app
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SCHEDULE_NOTIFICATION'){
    const { title, body, delay, tag } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/shoshin/icon.png',
        badge: '/shoshin/icon.png',
        tag: tag || 'shoshin',
        requireInteraction: false,
        vibrate: [200, 100, 200],
      });
    }, delay);
  }

  if(e.data && e.data.type === 'SCHEDULE_REPEATING'){
    const { title, body, intervalMs, tag } = e.data;
    setInterval(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/shoshin/icon.png',
        tag: tag || 'shoshin-repeat',
        vibrate: [200, 100, 200],
      });
    }, intervalMs);
  }
});
