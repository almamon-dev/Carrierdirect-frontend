import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useHeaderNotifications, HeaderNotification, normalizeNotifLink } from '@/hooks/useHeaderNotifications';
import { NotificationCategory } from '@/hooks/headerNotificationTypes';
import { NotificationDropdownPanel } from './NotificationDropdownPanel';

interface HeaderNotificationsProps {
    role?: 'supplier' | 'customer' | 'driver';
}

export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({ role = 'supplier' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
    } = useHeaderNotifications(role);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            if (dropdownRef.current && dropdownRef.current.contains(target)) return;

            setIsOpen(false);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
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
    }, [isOpen]);

    const filteredNotifications = notifications.filter(n => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'account') {
            return n.category === 'account' || n.subCategory === 'driver_assigned' || n.subCategory === 'account_verified';
        }
        if (activeCategory === 'compliance') {
            return n.category === 'compliance' || n.subCategory === 'documents_expiring';
        }
        if (activeCategory === 'finance') {
            return n.category === 'finance' || n.subCategory === 'escrow' || n.subCategory === 'funds_released';
        }
        if (activeCategory === 'quote') {
            return n.category === 'quote' || n.subCategory === 'new_quote_request' || n.subCategory === 'quote_accepted';
        }
        if (activeCategory === 'shipment') {
            return n.category === 'shipment' || n.subCategory === 'pod' || n.subCategory === 'transit' || n.subCategory === 'driver_assigned';
        }
        return n.category === activeCategory;
    });

    const handleItemClick = (notif: HeaderNotification) => {
        if (notif.unread) markAsRead(notif.id);
        setIsOpen(false);
        navigate(normalizeNotifLink(notif.link, role));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(prev => !prev);
                }}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors relative shrink-0 cursor-pointer group"
                title="Notifications"
                aria-label="View notifications"
            >
                <Bell size={17} className="group-hover:scale-105 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Top triangular arrow pointer pointing directly to the bell icon */}
                    <div className="absolute top-[37px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white dark:bg-[#1a1f26] border-t border-l border-slate-200/90 dark:border-slate-800 z-[60] pointer-events-none" />

                    <NotificationDropdownPanel
                        unreadCount={unreadCount}
                        totalCount={notifications.length}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        onMarkAllAsRead={markAllAsRead}
                        filteredNotifications={filteredNotifications}
                        onItemClick={handleItemClick}
                        onClearAll={clearAll}
                        onViewAll={() => {
                            setIsOpen(false);
                            navigate(role === 'driver' ? '/driver/notifications' : (role === 'supplier' ? '/supplier/notifications' : '/customer/notifications'));
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default HeaderNotifications;
