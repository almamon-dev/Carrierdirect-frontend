import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Bell, CheckCheck, Check, Trash2, FileText, Package,
    MessageSquare, Euro, AlertTriangle, ExternalLink,
    CheckCircle2, Clock, Sparkles, MoreVertical, Copy
} from 'lucide-react';
import { useHeaderNotifications, HeaderNotification, normalizeNotifLink } from '@/hooks/useHeaderNotifications';

interface HeaderNotificationsProps {
    role?: 'supplier' | 'customer' | 'driver';
}

const getNotificationIcon = (type: HeaderNotification['type']) => {
    switch (type) {
        case 'quote':
            return {
                icon: FileText,
                bg: 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40',
                color: 'text-[#FF4A1F]',
            };
        case 'order':
            return {
                icon: Package,
                bg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40',
                color: 'text-emerald-600 dark:text-emerald-400',
            };
        case 'message':
            return {
                icon: MessageSquare,
                bg: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40',
                color: 'text-blue-600 dark:text-blue-400',
            };
        case 'finance':
            return {
                icon: Euro,
                bg: 'bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-900/40',
                color: 'text-violet-600 dark:text-violet-400',
            };
        case 'system':
        default:
            return {
                icon: CheckCircle2,
                bg: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
                color: 'text-slate-600 dark:text-slate-300',
            };
    }
};

export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({ role = 'supplier' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useHeaderNotifications(role);

    const handleCloseMenu = () => setActiveMenuId(null);

    const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>, notifId: string | number) => {
        e.stopPropagation();
        if (activeMenuId === notifId) {
            setActiveMenuId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuWidth = 140;
            const menuHeight = 115;
            
            // Align right edge of menu with right edge of button
            const left = Math.max(10, Math.min(window.innerWidth - menuWidth - 10, rect.right - menuWidth));
            
            // Flip upwards if overflowing below screen
            const top = (rect.bottom + menuHeight > window.innerHeight - 10)
                ? Math.max(10, rect.top - menuHeight - 4)
                : rect.bottom + 4;

            setMenuPos({ top, left });
            setActiveMenuId(notifId);
        }
    };

    // Close menu on scroll or Escape
    useEffect(() => {
        if (!activeMenuId) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCloseMenu(); };
        const handleScroll = () => handleCloseMenu();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [activeMenuId]);

    // Close on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // If clicked inside the header notification trigger/popover
            if (dropdownRef.current && dropdownRef.current.contains(target)) {
                return;
            }

            // If clicked inside the active 3-dot portal menu
            if (target.closest && target.closest('[data-notif-portal="true"]')) {
                return;
            }

            setIsOpen(false);
            setActiveMenuId(null);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (activeMenuId) {
                    setActiveMenuId(null);
                } else {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, activeMenuId]);

    const filteredNotifications = activeTab === 'unread'
        ? notifications.filter(n => n.unread)
        : notifications;

    const handleItemClick = (notif: HeaderNotification) => {
        if (notif.unread) {
            markAsRead(notif.id);
        }
        setIsOpen(false);
        setActiveMenuId(null);
        const targetLink = normalizeNotifLink(notif.link, role);
        navigate(targetLink);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen(prev => !prev);
                    setActiveMenuId(null);
                }}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors relative shrink-0 cursor-pointer group"
                title="Notifications"
                aria-label="View notifications"
            >
                <Bell size={17} className="group-hover:scale-105 transition-transform" />

                {/* Dynamic Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popover Dropdown (Ultra-Compact, rounded-[3px]) */}
            {isOpen && (
                <div
    className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-xl border border-slate-200/90 dark:border-slate-700/80 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150 flex flex-col font-sans">
                    {/* Compact Header */}
                    <div
    className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-[#181a20]/60">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                            {unreadCount > 0 ? (
                                <span className="text-[9.5px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/15 px-1.5 py-0.2 rounded-[3px] border border-orange-200/60 dark:border-orange-500/20">
                                    {unreadCount} new
                                </span>
                            ) : (
                                <span className="text-[9.5px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded-[3px]">
                                    All read
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="text-[10.5px] font-semibold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                                title="Mark all notifications as read"
                            >
                                <CheckCheck size={12} />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs (Compact) */}
                    <div
    className="px-2.5 pt-1.5 pb-1 flex items-center gap-1 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#1e2329]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                activeTab === 'all'
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('unread')}
                            className={`px-2 py-0.5 rounded-[3px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                activeTab === 'unread'
                                    ? 'bg-orange-50 dark:bg-orange-950/50 text-[#ff4a1f]'
                                    : 'text-slate-500 hover:text-[#ff4a1f]'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Notifications Scroll List (Compact Items) */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100/80 dark:divide-slate-800/60">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif) => {
                                const { icon: Icon, bg, color } = getNotificationIcon(notif.type);

                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleItemClick(notif)}
                                        className={`px-3 py-2 transition-colors flex items-start gap-2.5 cursor-pointer group relative ${
                                            notif.unread
                                                ? 'bg-orange-50/20 dark:bg-orange-950/15 hover:bg-orange-50/40 dark:hover:bg-orange-950/30'
                                                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-7 h-7 rounded-full ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                                            <Icon size={13} strokeWidth={2.2} />
                                        </div>

                                        {/* Content: Title & Full Details */}
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex items-center gap-1.5">
                                                <p className={`text-[12px] leading-snug font-bold ${
                                                    notif.unread
                                                        ? 'text-slate-900 dark:text-slate-100'
                                                        : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {notif.title}
                                                </p>
                                                {notif.unread && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                                )}
                                            </div>
                                            <p className={`text-[11.5px] line-clamp-2 mt-0.5 leading-snug ${
                                                notif.unread
                                                    ? 'text-slate-700 dark:text-slate-300 font-medium'
                                                    : 'text-slate-500 dark:text-slate-400'
                                            }`}>
                                                {notif.desc}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                {notif.amount && (
                                                    <span className="inline-flex items-center gap-0.5 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                                                        {notif.amount}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                                    <Clock size={10} />
                                                    <span>{notif.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Actions: Three Dots Menu */}
                                        <div
                                            className="absolute right-2 top-2 flex items-center"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                type="button"
                                                onClick={(e) => handleToggleMenu(e, notif.id)}
                                                className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                                                    activeMenuId === notif.id
                                                        ? 'opacity-100 bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                                                        : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                                title="More options"
                                            >
                                                <MoreVertical size={13.5} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 px-3 text-center flex flex-col items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-1.5">
                                    <Sparkles size={15} className="text-amber-500" />
                                </div>
                                <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                                </p>
                                <p className="text-[10.5px] text-slate-400 mt-0.5">
                                    You're completely up to date!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Compact Footer */}
                    <div
    className="py-1.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#181a20]/60 flex items-center justify-between px-3">
                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-[10.5px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                                Clear all
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                navigate(role === 'driver' ? '/driver/notifications' : (role === 'supplier' ? '/supplier/notifications' : '/customer/notifications'));
                            }}
                            className="text-[10.5px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                        >
                            <span>View all</span>
                            <ExternalLink size={10} />
                        </button>
                    </div>
                </div>
            )}

            {/* Active 3-Dot Options Dropdown Portal */}
            {isOpen && activeMenuId && (() => {
                const activeNotif = notifications.find(n => n.id === activeMenuId);
                if (!activeNotif) return null;

                return createPortal(
                    <div data-notif-portal="true">
                        <div
                            className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseMenu();
                            }}
                        />
                        <div
    className="fixed w-[140px] bg-white dark:bg-[#1e2329] rounded-[4px] shadow-lg border border-slate-200/90 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans text-xs"
                            style={{ top: menuPos.top, left: menuPos.left }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {/* Toggle Mark as read / Mark as unread */}
                            {activeNotif.unread ? (
                                <button
                                    type="button"
                                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(activeNotif.id);
                                        handleCloseMenu();
                                    }}
                                >
                                    <Check size={12.5} className="text-emerald-500 shrink-0" />
                                    <span>Mark as read</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAsUnread(activeNotif.id);
                                        handleCloseMenu();
                                    }}
                                >
                                    <Clock size={12.5} className="text-[#ff4a1f] shrink-0" />
                                    <span>Mark as unread</span>
                                </button>
                            )}

                            {/* View details / Open link */}
                            <button
                                type="button"
                                className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCloseMenu();
                                    handleItemClick(activeNotif);
                                }}
                            >
                                <ExternalLink size={12.5} className="text-slate-400 shrink-0" />
                                <span>View Details</span>
                            </button>

                            {/* Copy text */}
                            <button
                                type="button"
                                className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`${activeNotif.title}: ${activeNotif.desc}`);
                                    handleCloseMenu();
                                }}
                            >
                                <Copy size={12.5} className="text-slate-400 shrink-0" />
                                <span>Copy Text</span>
                            </button>

                            <div className="border-t border-slate-100 dark:border-slate-800 my-0.5" />

                            {/* Delete Action */}
                            <button
                                type="button"
                                className="w-full text-left px-2.5 py-1.5 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors font-semibold cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(activeNotif.id);
                                    handleCloseMenu();
                                }}
                            >
                                <Trash2 size={12.5} className="shrink-0" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>,
                    document.body
                );
            })()}
        </div>
    );
};

export default HeaderNotifications;
