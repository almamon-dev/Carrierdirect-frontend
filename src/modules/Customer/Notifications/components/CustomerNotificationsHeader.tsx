import React from "react";
import { CheckCheck, RefreshCw, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

interface CustomerNotificationsHeaderProps {
  unreadCount: number;
  hasNotifications: boolean;
  isRefreshing: boolean;
  onClearAll: () => void;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}

export const CustomerNotificationsHeader: React.FC<CustomerNotificationsHeaderProps> = ({
  unreadCount,
  hasNotifications,
  isRefreshing,
  onClearAll,
  onMarkAllRead,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1 flex items-center gap-2">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <StatusBadge status="unread">
              {unreadCount} Unread
            </StatusBadge>
          )}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage real-time alerts for quote counter-offers, shipment milestones, delivery PODs, and invoices.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {hasNotifications && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-red-50/40 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/40 text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-[3px] shadow-2xs transition-colors"
          >
            <Trash2 size={13} className="shrink-0" />
            <span>Clear all</span>
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs rounded-[3px] disabled:opacity-50"
        >
          <CheckCheck size={13} className="text-white shrink-0" />
          <span>Mark all read</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-slate-700 dark:text-slate-200 rounded-[3px] shadow-2xs transition-colors"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f] shrink-0" : "text-slate-500 shrink-0"} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomerNotificationsHeader;
