import { NotificationCategory } from '@/hooks/headerNotificationTypes';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';
import { Bell, MoreHorizontal, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem } from './NotificationItem';

interface NotificationDropdownPanelProps {
    unreadCount: number;
    totalCount: number;
    activeCategory: NotificationCategory;
    onCategoryChange: (category: NotificationCategory) => void;
    onMarkAllAsRead: () => void;
    filteredNotifications: HeaderNotification[];
    activeMenuId?: string | number | null;
    onItemClick: (notif: HeaderNotification) => void;
    onToggleMenu?: (e: React.MouseEvent<HTMLButtonElement>, notifId: string | number) => void;
    onClearAll: () => void;
    onViewAll: () => void;
}

const CATEGORIES: { id: NotificationCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'account', label: 'Account' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'finance', label: 'Finance' },
    { id: 'quote', label: 'Quote' },
    { id: 'shipment', label: 'Shipment' },
];

export const NotificationDropdownPanel: React.FC<NotificationDropdownPanelProps> = ({
    unreadCount,
    activeCategory,
    onCategoryChange,
    onMarkAllAsRead,
    filteredNotifications,
    onItemClick,
    onClearAll,
    onViewAll,
}) => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setIsMoreOpen(false);
            }
        };
        if (isMoreOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreOpen]);

    const PRIMARY_COUNT = 4;
    const primaryCategories = CATEGORIES.slice(0, PRIMARY_COUNT);
    const overflowCategories = CATEGORIES.slice(PRIMARY_COUNT);
    const isOverflowActive = overflowCategories.some(cat => cat.id === activeCategory);

    return (
        <div className="fixed sm:absolute top-14 sm:top-[44px] inset-x-2 sm:inset-x-auto sm:right-0 sm:-right-24 md:-right-12 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans flex justify-center sm:block">
            {/* Main Dropdown Panel Card */}
            <div className="w-full sm:w-[460px] md:w-[480px] max-w-[calc(100vw-1rem)] bg-white dark:bg-[#1a1f26] rounded-md shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 overflow-hidden text-xs flex flex-col relative z-20">
                {/* Header: Title, Unread Count Badge, and Mark All As Read */}
                <div className="px-4 sm:px-5 pt-3.5 sm:pt-4 pb-2 sm:pb-2.5 flex items-center justify-between bg-white dark:bg-[#1a1f26] relative z-20">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Notifications
                        </h3>
                        <span className="text-[11.5px] font-semibold text-[#FF4A1F] bg-[#FFF1EB] dark:bg-[#FF4A1F]/15 px-2.5 py-0.5 rounded-[5px] leading-tight">
                            {unreadCount} new
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onMarkAllAsRead}
                        className="text-[13px] font-semibold text-[#FF4A1F] hover:underline cursor-pointer transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                {/* Category Filter Chips: 4 visible tabs + space + three dots button on the right */}
                <div className="px-5 pb-3.5 pt-0.5 flex items-center justify-between gap-2 bg-white dark:bg-[#1a1f26] relative z-20 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {primaryCategories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onCategoryChange(cat.id)}
                                    className={`px-3 py-1.5 rounded-[4px] text-[12.5px] transition-colors whitespace-nowrap cursor-pointer shrink-0 ${isActive
                                        ? 'bg-[#FFECE4] text-[#FF4A1F] font-semibold dark:bg-[#FF4A1F]/20'
                                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-slate-900 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 font-medium'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {overflowCategories.length > 0 && (
                        <div className="relative shrink-0 ml-auto" ref={moreRef}>
                            <button
                                type="button"
                                onClick={() => setIsMoreOpen(prev => !prev)}
                                className={`px-2.5 py-1.5 rounded-[4px] text-[12.5px] transition-colors flex items-center justify-center cursor-pointer ${isOverflowActive
                                    ? 'bg-[#FFECE4] text-[#FF4A1F] font-semibold dark:bg-[#FF4A1F]/20'
                                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-slate-900 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 font-medium'
                                    }`}
                                title="More categories"
                                aria-label="More categories"
                            >
                                <MoreHorizontal size={15} />
                            </button>

                            {isMoreOpen && (
                                <div className="absolute right-0 top-full mt-1.5 w-36 max-h-56 overflow-y-auto hover-scrollbar bg-white dark:bg-[#1a1f26] rounded-md shadow-lg border border-slate-200/90 dark:border-slate-800 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                    {overflowCategories.map((cat) => {
                                        const isActive = activeCategory === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    onCategoryChange(cat.id);
                                                    setIsMoreOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors cursor-pointer ${isActive
                                                    ? 'bg-[#FFECE4] text-[#FF4A1F] font-semibold dark:bg-[#FF4A1F]/20'
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                                                    }`}
                                            >
                                                <span>{cat.label}</span>
                                                {isActive && <Check size={13} className="text-[#FF4A1F] shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[380px] overflow-y-auto hover-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#1a1f26]">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                            <NotificationItem
                                key={notif.id}
                                notif={notif}
                                onClick={onItemClick}
                            />
                        ))
                    ) : (
                        <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
                                <Bell size={18} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {activeCategory === 'all'
                                    ? 'No notifications yet'
                                    : `No notifications in ${CATEGORIES.find(c => c.id === activeCategory)?.label || ''}`}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                You're completely up to date!
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#1a1f26] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        View all notifications
                    </button>
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="text-xs font-semibold text-[#FF4A1F] hover:underline transition-colors cursor-pointer"
                    >
                        Clear all
                    </button>
                </div>
            </div>
        </div>
    );
};
