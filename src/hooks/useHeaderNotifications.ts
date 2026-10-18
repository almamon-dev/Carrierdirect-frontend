/**
 * useHeaderNotifications Hook
 * 100% Dynamic Notification State Management connected to Laravel Reverb WebSocket & fallback polling.
 * Accurately parses Laravel notifications for Customer, Supplier, and Driver roles.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { echo } from '@/lib/echo';
import { TOKEN_CONFIG } from '@/config/auth';
import { HeaderNotification } from './headerNotificationTypes';
import {
    normalizeNotifLink,
    formatTimeAgo,
    parseRawNotification
} from './headerNotificationParser';

export type { HeaderNotification };
export { normalizeNotifLink };

export const deduplicateNotifications = (list: HeaderNotification[]): HeaderNotification[] => {
    const seenIds = new Set<string>();
    const seenSignatures = new Set<string>();
    const unique: HeaderNotification[] = [];

    for (const item of list) {
        const idKey = String(item.id);
        const titleKey = (item.title || '').trim().toLowerCase();
        const descKey = (item.desc || '').trim().toLowerCase();
        // 10-minute time bucket to collapse duplicate triggers
        const timeBucket = Math.floor((item.timestamp || Date.now()) / (10 * 60 * 1000));
        const sig = `${titleKey}|${descKey}|${item.amount || ''}|${timeBucket}`;

        if (seenIds.has(idKey) || seenSignatures.has(sig)) {
            continue;
        }

        seenIds.add(idKey);
        seenSignatures.add(sig);
        unique.push(item);
    }

    return unique;
};

function getAuthUserId(): number | null {
    try {
        const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.id || parsed?.user?.id || null;
    } catch {
        return null;
    }
}

export const useHeaderNotifications = (role: 'supplier' | 'customer' | 'driver' = 'supplier') => {
    const [localNotifs, setLocalNotifs] = useState<HeaderNotification[]>([]);
    const [apiNotifs, setApiNotifs] = useState<HeaderNotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const notifications = useMemo(() => {
        return deduplicateNotifications([
            ...localNotifs,
            ...apiNotifs.filter(a => !localNotifs.some(l => l.id === a.id))
        ]);
    }, [localNotifs, apiNotifs]);

    const fetchNotifications = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const endpoint = role === 'driver' ? '/driver/notifications' : (role === 'supplier' ? '/supplier/notifications' : '/customer/notifications');
            const res: any = await apiClient.get(endpoint).catch(() => ({ data: { data: [] } }));
            
            const rawList = 
                (Array.isArray(res?.data?.data?.notifications?.data) && res.data.data.notifications.data) ||
                (Array.isArray(res?.data?.data?.notifications) && res.data.data.notifications) ||
                (Array.isArray(res?.data?.notifications?.data) && res.data.notifications.data) ||
                (Array.isArray(res?.data?.notifications) && res.data.notifications) ||
                (Array.isArray(res?.data?.data) && res.data.data) ||
                (Array.isArray(res?.data) && res.data) ||
                (Array.isArray(res?.notifications?.data) && res.notifications.data) ||
                (Array.isArray(res?.notifications) && res.notifications) ||
                (Array.isArray(res) && res) ||
                [];
            
            if (Array.isArray(rawList) && rawList.length > 0) {
                const mapped: HeaderNotification[] = rawList.map((item: any, idx: number) =>
                    parseRawNotification(item, idx, role)
                );
                const deduped = deduplicateNotifications(mapped);
                setApiNotifs(prev => {
                    if (prev.length === deduped.length && prev[0]?.id === deduped[0]?.id) {
                        return prev; // Prevent unnecessary re-render if notifications haven't changed
                    }
                    return deduped;
                });
            } else {
                setApiNotifs(prev => prev.length === 0 ? prev : []);
            }
        } catch (err) {
            console.error(`Failed to fetch ${role} notifications from API:`, err);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchNotifications(false);
        // Fallback polling relaxed to 60s since Reverb pushes real-time updates
        const pollTimer = setInterval(() => {
            fetchNotifications(true);
        }, 60000);
        return () => clearInterval(pollTimer);
    }, [fetchNotifications]);

    // Reverb WebSocket Listener for Instant Real-Time Notifications
    useEffect(() => {
        const userId = getAuthUserId();
        if (!userId) return;

        try {
            const channel = echo.private(`App.Models.User.${userId}`);
            channel.notification((notification: any) => {
                const parsed = parseRawNotification(notification, Date.now(), role);
                setApiNotifs(prev => deduplicateNotifications([parsed, ...prev]));

                window.dispatchEvent(new CustomEvent('driver-shipment-updated', { detail: parsed }));
                window.dispatchEvent(new CustomEvent('order-status-updated', { detail: parsed }));
            });

            channel.listen('.ShipmentStatusUpdated', (event: any) => {
                window.dispatchEvent(new CustomEvent('driver-shipment-updated', { detail: event }));
                window.dispatchEvent(new CustomEvent('order-status-updated', { detail: event }));
                fetchNotifications(true);
            });

            return () => {
                channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
                channel.stopListening('.ShipmentStatusUpdated');
            };
        } catch (err) {
            console.warn('Echo notification subscription skipped:', err);
        }
    }, [role]);

    useEffect(() => {
        const recompute = (n: HeaderNotification): HeaderNotification => ({
            ...n,
            time: n.createdAt
                ? formatTimeAgo(n.createdAt)
                : n.timestamp
                ? formatTimeAgo(new Date(n.timestamp).toISOString())
                : n.time,
        });
        const ticker = setInterval(() => {
            setApiNotifs(prev => prev.map(recompute));
            setLocalNotifs(prev => prev.map(recompute));
        }, 60_000);
        return () => clearInterval(ticker);
    }, []);

    useEffect(() => {
        const handleSync = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.role === role || !customEvent.detail?.role) {
                fetchNotifications(true);
            }
        };

        window.addEventListener('carrierdirect_notif_update', handleSync);
        return () => {
            window.removeEventListener('carrierdirect_notif_update', handleSync);
        };
    }, [role, fetchNotifications]);

    const markAsRead = useCallback(async (id: string | number) => {
        setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        setApiNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        try {
            await apiClient.post(`/${role}/notifications/${id}/read`).catch(() => {});
        } catch {}
    }, [role]);

    const markAsUnread = useCallback(async (id: string | number) => {
        setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: true } : n));
        setApiNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: true } : n));
        try {
            await apiClient.post(`/${role}/notifications/${id}/unread`).catch(() => {});
        } catch {}
    }, [role]);

    const markAllAsRead = useCallback(async () => {
        setLocalNotifs(prev => prev.map(n => ({ ...n, unread: false })));
        setApiNotifs(prev => prev.map(n => ({ ...n, unread: false })));
        try {
            await apiClient.post(`/${role}/notifications/mark-all-read`).catch(() => {});
        } catch {}
    }, [role]);

    const deleteNotification = useCallback(async (id: string | number) => {
        setLocalNotifs(prev => prev.filter(n => String(n.id) !== String(id)));
        setApiNotifs(prev => prev.filter(n => String(n.id) !== String(id)));
        try {
            await apiClient.delete(`/${role}/notifications/${id}`).catch(() => {});
        } catch {}
    }, [role]);

    const deleteBulkNotifications = useCallback(async (ids: (string | number)[]) => {
        const idSet = new Set(ids.map(String));
        setLocalNotifs(prev => prev.filter(n => !idSet.has(String(n.id))));
        setApiNotifs(prev => prev.filter(n => !idSet.has(String(n.id))));
        try {
            await apiClient.post(`/${role}/notifications/bulk-delete`, { ids }).catch(() => {});
        } catch {}
    }, [role]);

    const clearAll = useCallback(async () => {
        setLocalNotifs([]);
        setApiNotifs([]);
        try {
            await apiClient.post(`/${role}/notifications/clear-all`).catch(() => {});
        } catch {}
    }, [role]);

    const addNotification = useCallback((notif: Omit<HeaderNotification, 'id' | 'timestamp' | 'unread'>) => {
        const newNotif: HeaderNotification = {
            ...notif,
            id: `dyn-notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: Date.now(),
            unread: true,
            category: notif.category || (notif.type === 'quote' ? 'quote' : 'shipment'),
            link: normalizeNotifLink(notif.link, role)
        };
        setLocalNotifs(prev => [newNotif, ...prev]);
    }, [role]);

    const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        refresh: fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        deleteBulkNotifications,
        clearAll,
        addNotification,
    };
};
