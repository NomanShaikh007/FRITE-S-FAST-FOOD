const SUPABASE_URL = "https://tdexruldyykiufopjxit.supabase.co";
const SUPABASE_KEY = "sb_publishable_rou9U1vTN7djX8u5dGkXnQ_cous5jNM";

// Receive order ID from main page after order is placed
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'WATCH_ORDER') {
    watchOrder(event.data.orderId);
  }
});

function watchOrder(orderId) {
  console.log('[SW] Watching order:', orderId);

  const interval = setInterval(async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=status`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const rows = await res.json();
      if (rows && rows[0] && rows[0].status === 'done') {
        clearInterval(interval);
        self.registration.showNotification("🍔 Frite's Fast Food", {
          body: "Your order is on its way! 🛵",
          icon: "/icon.png",
          vibrate: [200, 100, 200],
          requireInteraction: true,
          tag: 'order-' + orderId
        });
      }
    } catch (e) {
      console.error('[SW] Poll error:', e);
    }
  }, 5000); // check every 5 seconds

  // Stop after 2 hours
  setTimeout(() => clearInterval(interval), 2 * 60 * 60 * 1000);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
