self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Frite's Fast Food";
  const options = {
    body: data.body || "Your order is on its way! 🛵",
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'order-update'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
