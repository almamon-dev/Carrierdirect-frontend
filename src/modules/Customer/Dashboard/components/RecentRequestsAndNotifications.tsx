import React from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getNotificationConfig, getRequestStatusConfig, timeAgo } from "../utils/dashboardUtils";

interface RecentRequestsAndNotificationsProps {
  loading: boolean;
  quoteRequests: any[];
  notifications: any[];
}

export const RecentRequestsAndNotifications: React.FC<RecentRequestsAndNotificationsProps> = ({
  loading,
  quoteRequests,
  notifications,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-start">
      {/* Recent Requests */}
      <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col h-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
            Recent Requests ({quoteRequests.length})
          </h3>
          <Link
            to="/customer/quotes/create"
            className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
          >
            See All
          </Link>
        </div>
        <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 justify-start">
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading requests...</div>
          ) : quoteRequests.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No quote requests submitted yet.</div>
          ) : (
            quoteRequests.slice(0, 5).map((req, idx) => {
              const reqId = req.request_id || req.quote_number || `REQ-${req.id}`;
              const statusCfg = getRequestStatusConfig(req.status);
              return (
                <div key={req.id || idx} className="flex justify-between items-center py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{reqId}</span>
                    {req.pickup_city && req.delivery_city && (
                      <span className="text-[11px] text-slate-400 truncate">
                        ({req.pickup_city} → {req.delivery_city})
                      </span>
                    )}
                  </div>
                  <StatusBadge status={req.status} label={statusCfg.label} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col h-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
            Notifications ({notifications.length})
          </h3>
          <Link
            to="/customer/notifications"
            className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
          >
            See All
          </Link>
        </div>
        <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 justify-start">
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No notifications to display.</div>
          ) : (
            notifications.slice(0, 5).map((notification, idx) => {
              const cfg = getNotificationConfig(notification);
              const title = notification.data?.title || notification.title;
              const msg = notification.data?.message || notification.message || notification.text || "Notification update";
              const text = title || msg;
              const link = notification.data?.link || "/customer/notifications";
              const timeStr = timeAgo(notification.created_at || notification.date || notification.time);
              const IconComponent = cfg.icon;

              return (
                <Link
                  key={notification.id || idx}
                  to={link}
                  className="flex items-center justify-between gap-2.5 py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded px-1 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${cfg.bg} dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <IconComponent size={13} className={cfg.color} />
                    </div>
                    <span className="truncate text-slate-700 dark:text-slate-300 text-[12px] group-hover:text-brand transition-colors font-medium" title={text}>
                      {text}
                    </span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                    {timeStr}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentRequestsAndNotifications;
