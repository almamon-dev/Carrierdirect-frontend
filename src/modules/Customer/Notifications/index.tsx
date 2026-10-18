import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, X } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import { useHeaderNotifications } from "@/hooks/useHeaderNotifications";
import { getNotificationColumns } from "@/modules/Supplier/Notifications/components/columns";
import { NotificationRowActions } from "@/modules/Supplier/Notifications/components/NotificationRowActions";
import { FilterTabs, NotificationFilterTab } from "@/modules/Supplier/Notifications/components/FilterTabs";
import { TableFilterContent } from "@/modules/Supplier/Notifications/components/TableFilterContent";
import { CustomerNotificationsHeader } from "./components/CustomerNotificationsHeader";

export default function CustomerNotifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    refresh,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteBulkNotifications,
    clearAll,
  } = useHeaderNotifications("customer");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} notification${selectedIds.length === 1 ? "" : "s"}?`)) {
      deleteBulkNotifications(selectedIds);
      showToast(`${selectedIds.length} notification${selectedIds.length === 1 ? "" : "s"} deleted`);
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
      if (activeTab === "unread" && !notif.unread) return false;
      if (activeTab !== "all" && activeTab !== "unread" && notif.type !== activeTab) return false;
      if (categoryFilter !== "all" && notif.type !== categoryFilter) return false;
      if (statusFilter === "unread" && !notif.unread) return false;
      if (statusFilter === "read" && notif.unread) return false;
      return true;
    });
  }, [notifications, activeTab, categoryFilter, statusFilter]);

  const columns = useMemo(() => getNotificationColumns(), []);

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
      <CustomerNotificationsHeader
        unreadCount={unreadCount}
        hasNotifications={notifications.length > 0}
        isRefreshing={isRefreshing}
        onClearAll={handleClearAll}
        onMarkAllRead={handleMarkAllRead}
        onRefresh={handleRefresh}
      />

      <DataTable
        data={filteredNotifications}
        columns={columns}
        onDeleteSelected={handleBulkDelete}
        actions={(row) => (
          <NotificationRowActions
            row={row}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
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
        disableHorizontalScroll={true}
        tableClassName="w-full table-fixed"
        actionsColumnClassName="w-[45px] min-w-[45px] max-w-[45px] text-right"
        emptyState={
          <EmptyState
            icon={Bell}
            title="No Notifications Found"
            description={
              activeTab === "all"
                ? "You have no active notifications. New quote updates, shipping alerts, and invoices will appear here."
                : `No notifications currently match the '${activeTab}' filter.`
            }
            actionLabel="View Active Quotes"
            onAction={() => navigate("/customer/quotes")}
          />
        }
      />

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
