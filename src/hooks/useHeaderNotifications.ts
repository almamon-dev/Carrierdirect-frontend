/**
 * useHeaderNotifications Hook
 * 100% Dynamic Notification State Management connected to backend API & live polling.
 * Accurately parses Laravel notifications for Customer and Supplier roles.
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { encryptId } from '@/lib/encryption';

export interface HeaderNotification {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    timestamp: number;
    createdAt?: string; // raw ISO string from server for live re-computation
    amount?: string;    // formatted amount string e.g. "€ 4,682.00"
    type: 'quote' | 'order' | 'message' | 'system' | 'finance';
    unread: boolean;
    link?: string;
}

export const normalizeNotifLink = (link?: string, role: 'supplier' | 'customer' = 'supplier'): string => {
    if (!link) {
        return role === 'supplier' ? '/supplier/notifications' : '/customer/notifications';
    }

    const trimmed = String(link).trim();

    // Fix legacy customer routes
    if (trimmed === '/customer/quotes' || trimmed === '/customer/quotes/') return '/customer/quotes/received';
    if (trimmed === '/customer/finance' || trimmed === '/customer/finance/') return '/customer/finance/invoices';
    if (trimmed === '/customer/settings' || trimmed === '/customer/settings/') return '/customer/settings';

    // Fix legacy supplier routes
    if (trimmed === '/supplier/quotes' || trimmed === '/supplier/quotes/') return '/supplier/quotes/requests';
    if (trimmed === '/supplier/orders' || trimmed === '/supplier/orders/') return '/supplier/orders/active-jobs';
    if (trimmed === '/supplier/finance' || trimmed === '/supplier/finance/') return '/supplier/finance/withdrawal';
    if (trimmed === '/supplier/availability' || trimmed === '/supplier/availability/') return '/supplier/availability/dashboard';

    return trimmed;
};

const mapNotificationType = (typeStr?: string): HeaderNotification['type'] => {
    const lower = String(typeStr || '').toLowerCase();
    if (lower.includes('quote') || lower.includes('bid') || lower.includes('counter') || lower.includes('rfq') || lower.includes('request')) return 'quote';
    if (lower.includes('order') || lower.includes('job') || lower.includes('delivery') || lower.includes('pod') || lower.includes('transit')) return 'order';
    if (lower.includes('message') || lower.includes('chat') || lower.includes('negotiat')) return 'message';
    if (lower.includes('finance') || lower.includes('payout') || lower.includes('invoice') || lower.includes('pay') || lower.includes('stripe')) return 'finance';
    return 'system';
};

const formatTimeAgo = (dateStr: string | number | Date): string => {
    try {
        const timeMs = new Date(dateStr).getTime();
        if (isNaN(timeMs)) return 'Recently';
        const diff = Date.now() - timeMs;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } catch {
        return 'Recently';
    }
};

export const useHeaderNotifications = (role: 'supplier' | 'customer' = 'supplier') => {
    // Real-time local notifications added this session (from addNotification)
    const [localNotifs, setLocalNotifs] = useState<HeaderNotification[]>([]);
    // API-fetched notifications (always fresh from database)
    const [apiNotifs, setApiNotifs] = useState<HeaderNotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Combined: local real-time first, then API
    const notifications = [
        ...localNotifs,
        ...apiNotifs.filter(a => !localNotifs.some(l => l.id === a.id))
    ];

    // Fetch live notifications dynamically from backend API
    const fetchNotifications = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const endpoint = role === 'supplier' ? '/supplier/notifications' : '/customer/notifications';
            const res: any = await apiClient.get(endpoint);
            
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
            
            if (Array.isArray(rawList)) {
                const mapped: HeaderNotification[] = rawList.map((item: any, idx: number) => {
                    const dataObj = (item.data && typeof item.data === 'object') ? item.data : {};
                    const notifId = item.id || dataObj.id || `api-notif-${idx}`;
                    const typeRaw = item.type || dataObj.type || item.category || dataObj.category || 'system';
                    const notifType = mapNotificationType(typeRaw);

                    // Extract price amount / budget
                    const amountRaw = dataObj.amount || item.amount || dataObj.budget || item.budget || dataObj.target_price || item.target_price || dataObj.price || item.price || dataObj.proposed_amount || dataObj.total_amount;
                    const formattedAmount = amountRaw 
                        ? (typeof amountRaw === 'number' ? `€ ${amountRaw.toLocaleString('de-DE')}` : (String(amountRaw).includes('€') ? amountRaw : `€ ${amountRaw}`))
                        : '';

                    // Extract route (origin -> destination)
                    const pickupCity = dataObj.pickup_city || dataObj.from_city || dataObj.origin || item.origin || dataObj.pickup || item.pickup || dataObj.pickup_address;
                    const deliveryCity = dataObj.delivery_city || dataObj.to_city || dataObj.destination || item.destination || dataObj.delivery || item.delivery || dataObj.delivery_address;
                    const routeStr = (pickupCity && deliveryCity) ? `${pickupCity} → ${deliveryCity}` : (dataObj.route || item.route || '');

                    // Extract cargo specs & customer/carrier
                    const cargoStr = dataObj.cargo_type || item.cargo_type || dataObj.weight || item.weight || dataObj.cargo || item.cargo;
                    const supplierName = dataObj.supplier_name || item.supplier_name || dataObj.carrier_name || item.carrier_name || dataObj.carrier || item.carrier || dataObj.sender_name;
                    const customerName = dataObj.customer || item.customer || dataObj.customer_name || item.customer_name || dataObj.shipper || item.shipper || dataObj.client_name;
                    const reqSlug = dataObj.slug || item.slug || dataObj.request_id || item.request_id || dataObj.quote_request_id;
                    const quoteId = dataObj.quote_id || item.quote_id;

                    // Extract Title dynamically (role-aware)
                    let title = item.title || dataObj.title || item.subject || dataObj.subject || item.heading || dataObj.heading;
                    if (!title) {
                        const typeName = String(typeRaw).toLowerCase();
                        if (typeName.includes('newquote') || (notifType === 'quote' && role === 'customer')) {
                            title = supplierName ? `New Quote from ${supplierName}` : (formattedAmount ? `New Quote: ${formattedAmount}` : 'New Quote Received');
                        } else if (typeName.includes('quoteaccepted') || typeName.includes('accept')) {
                            title = role === 'supplier' ? 'Quote Accepted by Customer!' : 'Quote Accepted & Confirmed!';
                        } else if (typeName.includes('quoterejected') || typeName.includes('reject') || typeName.includes('decline')) {
                            title = 'Quote Declined';
                        } else if (typeName.includes('revised') || typeName.includes('counter')) {
                            title = 'Counter Offer Received';
                        } else if (typeName.includes('quotesubmitted') || typeName.includes('rfq') || (notifType === 'quote' && role === 'supplier')) {
                            title = routeStr ? `New RFQ: ${routeStr}` : (formattedAmount ? `New RFQ: ${formattedAmount}` : 'New Quote Request Available');
                        } else if (notifType === 'order') {
                            title = routeStr ? `Order Update: ${routeStr}` : 'Order Status Update';
                        } else if (notifType === 'message') {
                            title = 'New Message Received';
                        } else if (notifType === 'finance') {
                            title = formattedAmount ? `Payout: ${formattedAmount}` : 'Payout & Invoice Update';
                        } else {
                            title = 'System Notification';
                        }
                    }

                    // Extract Details / Description dynamically
                    let desc = item.desc || dataObj.desc || item.details || dataObj.details || item.description || dataObj.description || item.message || dataObj.message || item.body || dataObj.body || item.text || dataObj.text || item.content || dataObj.content;
                    if (!desc || desc.length < 3) {
                        if (title.includes('Accepted')) {
                            desc = formattedAmount ? `Quote offer of ${formattedAmount} was accepted. An active order has been created.` : 'Quote offer was accepted. An active order has been created.';
                        } else if (title.includes('Declined')) {
                            desc = dataObj.reason ? `Offer was declined: "${dataObj.reason}"` : 'Quote offer was declined.';
                        } else if (formattedAmount && routeStr) {
                            desc = `${routeStr} • ${formattedAmount}`;
                        } else if (routeStr) {
                            desc = `Route: ${routeStr}`;
                        } else if (cargoStr) {
                            desc = `Cargo: ${cargoStr}`;
                        } else {
                            desc = role === 'supplier' ? 'New update on your quotes and orders.' : 'New freight quote update received.';
                        }
                    }

                    // Extract Link with fallback
                    let rawLink = item.link || dataObj.link || item.action_url || dataObj.action_url || item.url || dataObj.url;
                    if (!rawLink) {
                        const typeName = String(typeRaw).toLowerCase();
                        if (role === 'supplier') {
                            if (typeName.includes('quoteaccepted') || notifType === 'order') {
                                rawLink = '/supplier/orders/active-jobs';
                            } else if (typeName.includes('revised') || typeName.includes('counter') || notifType === 'message') {
                                rawLink = quoteId ? `/supplier/quotes/negotiation/conversation/${encryptId(quoteId)}` : '/supplier/quotes/negotiation';
                            } else if (notifType === 'quote') {
                                rawLink = reqSlug ? `/supplier/quotes/requests/${encryptId(reqSlug)}` : '/supplier/quotes/requests';
                            } else if (notifType === 'finance') {
                                rawLink = '/supplier/finance/withdrawal';
                            } else {
                                rawLink = '/supplier/notifications';
                            }
                        } else {
                            if (typeName.includes('quoteaccepted') || notifType === 'order') {
                                rawLink = '/customer/orders';
                            } else if (typeName.includes('revised') || typeName.includes('counter') || notifType === 'message') {
                                rawLink = quoteId ? `/customer/quotes/negotiation/conversation/${encryptId(quoteId)}` : '/customer/quotes/negotiation';
                            } else if (notifType === 'quote') {
                                rawLink = '/customer/quotes/received';
                            } else if (notifType === 'finance') {
                                rawLink = '/customer/finance/invoices';
                            } else {
                                rawLink = '/customer/notifications';
                            }
                        }
                    }

                    const timestamp = item.created_at ? new Date(item.created_at).getTime() : Date.now();
                    
                    return {
                        id: notifId,
                        title,
                        desc,
                        time: item.created_at ? formatTimeAgo(item.created_at) : (item.time_ago || dataObj.time_ago || 'Recently'),
                        timestamp,
                        createdAt: item.created_at || undefined,
                        amount: formattedAmount || undefined,
                        type: notifType,
                        unread: Boolean(!item.read_at && !item.is_read && item.status !== 'read'),
                        link: normalizeNotifLink(rawLink, role)
                    };
                });
                
                setApiNotifs(mapped);
            }
        } catch (err) {
            console.error(`Failed to fetch ${role} notifications from API:`, err);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [role]);

    // Initial fetch + Live auto-polling every 15 seconds silently
    useEffect(() => {
        fetchNotifications(false);
        const pollTimer = setInterval(() => {
            fetchNotifications(true);
        }, 15000);
        return () => clearInterval(pollTimer);
    }, [fetchNotifications]);

    // Live-tick: recompute relative time every 60 seconds ("Just now" -> "1m ago" etc.)
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

    // Listen to real-time events from other components (e.g. quote accepted, new quote submitted)
    useEffect(() => {
        const handleSync = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.role === role || !customEvent.detail?.role) {
                fetchNotifications();
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

    const markAllAsRead = useCallback(async () => {
        setLocalNotifs(prev => prev.map(n => ({ ...n, unread: false })));
        setApiNotifs(prev => prev.map(n => ({ ...n, unread: false })));
        try {
            await apiClient.post(`/${role}/notifications/mark-all-read`).catch(() => {});
        } catch {}
    }, [role]);

    const deleteNotification = useCallback(async (id: string | number) => {
        setLocalNotifs(prev => prev.filter(n => n.id !== id));
        setApiNotifs(prev => prev.filter(n => n.id !== id));
        try {
            await apiClient.delete(`/${role}/notifications/${id}`).catch(() => {});
        } catch {}
    }, [role]);

    const clearAll = useCallback(async () => {
        setLocalNotifs([]);
        setApiNotifs([]);
        try {
            await apiClient.post(`/${role}/notifications/clear-all`).catch(() => {});
        } catch {}
    }, [role]);

    // addNotification: instantly prepend to local real-time list
    const addNotification = useCallback((notif: Omit<HeaderNotification, 'id' | 'timestamp' | 'unread'>) => {
        const newNotif: HeaderNotification = {
            ...notif,
            id: `dyn-notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: Date.now(),
            unread: true,
            link: normalizeNotifLink(notif.link, role)
        };
        setLocalNotifs(prev => [newNotif, ...prev]);
    }, [role]);

    const unreadCount = notifications.filter(n => n.unread).length;

    return {
        notifications,
        unreadCount,
        isLoading,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
    };
};
