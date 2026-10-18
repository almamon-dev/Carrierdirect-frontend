import React from "react";
import { BadgeCheck } from "lucide-react";
import { CustomerContactGroup } from "../types";

interface CustomerChatSidebarContactRowProps {
    group: CustomerContactGroup;
    isContactActive: boolean;
    onClick: () => void;
}

export const CustomerChatSidebarContactRow: React.FC<CustomerChatSidebarContactRowProps> = ({
    group,
    isContactActive,
    onClick,
}) => {
    const isUnread = group.hasUnread;

    return (
        <div
            onClick={onClick}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center transition-all ${
                isContactActive
                    ? "bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs"
                    : isUnread
                        ? "bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80"
            }`}
        >
            <div className="relative shrink-0 w-11 h-11">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs border overflow-hidden ${
                    isContactActive
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]"
                        : "bg-orange-50 dark:bg-orange-950/40 border-orange-200/80 dark:border-orange-900/50 text-[#FF4A1F]"
                }`}>
                    {group.avatar && (group.avatar.startsWith("http") || group.avatar.startsWith("/storage") || group.avatar.startsWith("data:") || group.avatar.includes(".")) ? (
                        <img
                            src={group.avatar}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    ) : (
                        <span>{(group.name || "S").charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#12161c] ${
                        group.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                    title={group.isOnline ? "Active Now" : "Offline"}
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <h4 className={`text-[13px] truncate leading-tight ${
                            isContactActive || isUnread ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-800 dark:text-slate-200"
                        }`}>
                            {group.name}
                        </h4>
                        <BadgeCheck size={13.5} className="text-[#FF4A1F] shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {group.latestActivityTime}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-[11.5px] truncate ${
                        isUnread ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
                    }`}>
                        {group.latestPreview}
                    </p>
                    {!isContactActive && isUnread && group.totalUnreadCount > 0 ? (
                        <span className="min-w-[18px] h-[18px] px-1 bg-[#FF4A1F] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                            {group.totalUnreadCount}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
