// Service Worker for CarrierDirect Web Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: 'CarrierDirect Alert',
      body: event.data.text() || 'You have a new update.',
    };
  }

  const title = payload.title || 'CarrierDirect Notification';
  const options = {
    body: payload.body || 'You have a new alert regarding your shipment.',
    icon: payload.icon || '/favicon.png',
    badge: payload.badge || '/favicon.png',
    data: payload.data || {},
    actions: payload.actions || [],
    vibrate: payload.vibrate || [100, 50, 100],
    requireInteraction: payload.requireInteraction ?? false,
    tag: payload.tag || 'carrierdirect-alert',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate to targetUrl
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no tab is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
