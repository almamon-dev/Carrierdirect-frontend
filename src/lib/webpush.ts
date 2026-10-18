import apiClient from "./axios";

// Helper to convert base64 url-safe string to Uint8Array for applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser supports W3C Service Worker & Web Push
 */
export function isWebPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current browser notification permission
 */
export function getPushPermissionState(): NotificationPermission | 'unsupported' {
  if (!isWebPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Register Service Worker (/sw.js)
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isWebPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Retrieve current active push subscription from browser PushManager
 */
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.warn('Failed to retrieve push subscription:', err);
    return null;
  }
}

/**
 * Subscribe user to Web Push and save subscription credentials to backend
 */
export async function subscribeToWebPush(): Promise<{ success: boolean; message?: string }> {
  if (!isWebPushSupported()) {
    return { success: false, message: 'Web Push is not supported in this browser.' };
  }

  try {
    // 1. Request user permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        message: 'Notification permission was denied. Please allow notifications in your browser settings.',
      };
    }

    // 2. Ensure Service Worker is registered and ready
    await registerServiceWorker();
    const registration = await navigator.serviceWorker.ready;

    // 3. Obtain VAPID Public Key
    let vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      const res = await apiClient.get('/push-subscriptions/vapid-key');
      vapidKey = res.data?.public_key || res.public_key;
    }

    if (!vapidKey) {
      return { success: false, message: 'VAPID public key not configured on server.' };
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidKey);

    // 4. Subscribe via PushManager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as unknown as BufferSource,
    });

    const subJson = subscription.toJSON();

    if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
      return { success: false, message: 'Failed to generate browser push keys.' };
    }

    // 5. Save subscription to backend
    await apiClient.post('/push-subscriptions', {
      endpoint: subJson.endpoint,
      keys: {
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
      },
      contentEncoding: (subJson as any).contentEncoding || 'aesgcm',
    });

    return { success: true, message: 'Web Push notifications successfully enabled!' };
  } catch (error: any) {
    console.error('Error subscribing to web push:', error);
    const msg = error?.data?.message || error?.message || 'Failed to enable Web Push notifications.';
    return { success: false, message: msg };
  }
}

/**
 * Unsubscribe user from Web Push and notify backend
 */
export async function unsubscribeFromWebPush(): Promise<{ success: boolean; message?: string }> {
  if (!isWebPushSupported()) {
    return { success: false, message: 'Web Push is not supported in this browser.' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      // Notify backend to remove subscription
      try {
        await apiClient.delete('/push-subscriptions', {
          body: { endpoint },
        });
      } catch (e) {
        console.warn('Backend subscription cleanup warning:', e);
      }
    }

    return { success: true, message: 'Web Push notifications disabled.' };
  } catch (error: any) {
    console.error('Error unsubscribing from web push:', error);
    return { success: false, message: error?.message || 'Failed to disable Web Push notifications.' };
  }
}
