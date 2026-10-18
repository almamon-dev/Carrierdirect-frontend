import { useState, useMemo } from 'react';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';
import { NotificationFilterTab } from '../components/FilterTabs';

export const useSupplierNotificationsState = () => {
    const { 
        notifications, 
        unreadCount, 
        refresh,
        markAsRead, 
        markAsUnread,
        markAllAsRead, 
        deleteNotification, 
        deleteBulkNotifications,
        clearAll 
    } = useHeaderNotifications('supplier');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refresh();
            showToast("Notifications refreshed");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleMarkAsRead = (id: string | number) => {
        markAsRead(id);
        showToast("Marked as read");
    };

    const handleMarkAsUnread = (id: string | number) => {
        markAsUnread(id);
        showToast("Marked as unread");
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
        showToast("All notifications marked as read");
    };

    const handleDelete = (id: string | number) => {
        deleteNotification(id);
        showToast("Notification deleted");
    };

    const handleBulkDelete = (selectedIds: (number | string)[]) => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} notification${selectedIds.length === 1 ? '' : 's'}?`)) {
            deleteBulkNotifications(selectedIds);
            showToast(`${selectedIds.length} notification${selectedIds.length === 1 ? '' : 's'} deleted`);
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            clearAll();
            showToast("All notifications cleared");
        }
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notif) => {
            if (activeTab === 'unread' && !notif.unread) return false;
            if (activeTab !== 'all' && activeTab !== 'unread' && notif.type !== activeTab) return false;
            if (categoryFilter !== 'all' && notif.type !== categoryFilter) return false;
            if (statusFilter === 'unread' && !notif.unread) return false;
            if (statusFilter === 'read' && notif.unread) return false;
            return true;
        });
    }, [notifications, activeTab, categoryFilter, statusFilter]);

    return {
        notifications,
        unreadCount,
        isRefreshing,
        activeTab,
        setActiveTab,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        toastMessage,
        setToastMessage,
        filteredNotifications,
        handleRefresh,
        handleMarkAsRead,
        handleMarkAsUnread,
        handleMarkAllRead,
        handleDelete,
        handleBulkDelete,
        handleClearAll,
    };
};

export default useSupplierNotificationsState;
