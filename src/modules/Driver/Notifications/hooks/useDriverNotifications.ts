import { useState, useEffect, useMemo } from 'react';
import { driverApi } from '../../services/driverApi';
import { DriverNotification } from '../../types';

export function useDriverNotifications() {
    const [notifications, setNotifications] = useState<DriverNotification[]>([]);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trips' | 'alerts'>('all');
    const [isLoading, setIsLoading] = useState(true);

    const loadNotifs = async () => {
        try {
            const list = await driverApi.getNotifications();
            setNotifications(list);
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNotifs();
    }, []);

    const markAsRead = async (id: string) => {
        const updated = await driverApi.markNotificationAsRead(id);
        setNotifications(updated);
    };

    const markAllAsRead = async () => {
        const updated = await driverApi.markAllNotificationsRead();
        setNotifications(updated);
    };

    const filtered = useMemo(() => {
        return notifications.filter((n) => {
            if (activeFilter === 'unread') return !n.isRead;
            if (activeFilter === 'trips') return n.type === 'trip_assigned' || n.type === 'payout';
            if (activeFilter === 'alerts') return n.type === 'route_update' || n.type === 'safety_alert';
            return true;
        });
    }, [notifications, activeFilter]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications: filtered,
        unreadCount,
        activeFilter,
        setActiveFilter,
        markAsRead,
        markAllAsRead,
        isLoading,
    };
}
