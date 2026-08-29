/**
 * Customer Notifications Main Page
 * Dual Grid View & Table View with three-dot action menu, filter tabs,
 * search, and live synchronization with Customer header notifications.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, CheckCheck, RefreshCw, Trash2, CheckCircle2, X
} from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';
import { getNotificationColumns } from '@/modules/Supplier/Notifications/components/columns';
import { NotificationRowActions } from '@/modules/Supplier/Notifications/components/NotificationRowActions';
import { FilterTabs, NotificationFilterTab } from '@/modules/Supplier/Notifications/components/FilterTabs';
import { TableFilterContent } from '@/modules/Supplier/Notifications/components/TableFilterContent';

export default function CustomerNotifications() {
    const navigate = useNavigate();
    const { 
        notifications, 
        unreadCount, 
        refresh,
        markAsRead, 
        markAllAsRead, 
        deleteNotification, 
        clearAll 
    } = useHeaderNotifications('customer');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
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

    const handleMarkAllRead = () => {
        markAllAsRead();
        showToast("All notifications marked as read");
    };

    const handleDelete = (id: string | number) => {
        deleteNotification(id);
        showToast("Notification deleted");
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            clearAll();
            showToast("All notifications cleared");
        }
    };

    // Filter notifications based on tab and advanced dropdown filters
    const filteredNotifications = useMemo(() => {
        return notifications.filter((notif) => {
            // Tab filter
            if (activeTab === 'unread' && !notif.unread) return false;
            if (activeTab !== 'all' && activeTab !== 'unread' && notif.type !== activeTab) return false;

            // Advanced dropdown filters
            if (categoryFilter !== 'all' && notif.type !== categoryFilter) return false;
            if (statusFilter === 'unread' && !notif.unread) return false;
            if (statusFilter === 'read' && notif.unread) return false;

            return true;
        });
    }, [notifications, activeTab, categoryFilter, statusFilter]);

    const columns = useMemo(() => getNotificationColumns(), []);

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header Title & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1 flex items-center gap-2">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <span className="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-500/20 text-[11px] font-bold px-2 py-0.5 rounded-[3px]">
                                {unreadCount} Unread
                            </span>
                        )}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage real-time alerts for quote counter-offers, shipment milestones, delivery PODs, and invoices.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearAll}
                            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-[3px]"
                        >
                            <Trash2 size={13} />
                            <span>Clear all</span>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px]"
                    >
                        <CheckCheck size={13} className="text-[#ff4a1f]" />
                        <span>Mark all read</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px]"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Main Data Table with Grid View & Table View */}
            <DataTable
                data={filteredNotifications}
                columns={columns}
                actions={(row) => (
                    <NotificationRowActions 
                        row={row} 
                        onMarkAsRead={handleMarkAsRead} 
                        onDelete={handleDelete} 
                    />
                )}
                headerTabs={
                    <FilterTabs
                        notifications={notifications}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search customer alerts, quotes, delivery PODs..."
                compact={true}
                hideViewToggle={false}
                isLoading={isRefreshing}
                tableLayout="fixed"
                tableClassName="min-w-[950px]"
                emptyState={
                    <EmptyState
                        icon={Bell}
                        title="No Notifications Found"
                        description={activeTab === 'all'
                            ? "You have no active notifications. New quote updates, shipping alerts, and invoices will appear here."
                            : `No notifications currently match the '${activeTab}' filter.`
                        }
                        actionLabel="View Active Quotes"
                        onAction={() => navigate('/customer/quotes')}
                    />
                }
            />

            {/* Toast Floating Alert */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-[3px] shadow-xl border border-slate-800 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                    <button 
                        onClick={() => setToastMessage(null)} 
                        className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={13} />
                    </button>
                </div>
            )}
        </div>
    );
}
