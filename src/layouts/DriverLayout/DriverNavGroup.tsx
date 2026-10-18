import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';

export const isSubItemActive = (subItemPath: string, currentPath: string, currentHash: string) => {
    if (!subItemPath) return false;
    if (subItemPath.includes('#')) {
        const [p, h] = subItemPath.split('#');
        return currentPath === p && currentHash === `#${h}`;
    }
    return currentPath === subItemPath || (subItemPath !== '/driver/dashboard' && currentPath.startsWith(subItemPath));
};

export const getSidebarItemBadge = (path: string) => {
    try {
        if (path === '/driver/chat') {
            const raw = localStorage.getItem('driver_unread_chat_count');
            return raw ? parseInt(raw, 10) : 0;
        }
        if (path === '/driver/notifications') {
            const raw = localStorage.getItem('driver_unread_notifications_count');
            return raw ? parseInt(raw, 10) : 0;
        }
    } catch {
        return 0;
    }
    return 0;
};

export const isItemProtected = (path?: string) => {
    if (!path) return false;
    if (path.includes('/profile')) return false;
    return true;
};

interface DriverNavGroupProps {
    item: any;
    location: any;
    isOpen: boolean;
    onClose?: () => void;
    isVerified: boolean;
}

export const DriverNavGroup: React.FC<DriverNavGroupProps> = ({
    item,
    location,
    isOpen,
    onClose,
    isVerified
}) => {
    const isActiveGroup = item.items?.some((subItem: any) =>
        isSubItemActive(subItem.path, location.pathname, location.hash)
    );
    const [isExpanded, setIsExpanded] = useState(isActiveGroup);

    useEffect(() => {
        if (isActiveGroup) {
            setIsExpanded(true);
        }
    }, [isActiveGroup, location.pathname, location.hash]);

    if (!item.items || item.items.length === 0) return null;

    const IconComp = item.icon;

    return (
        <div className="mb-0.5">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={!isOpen ? String(item.group || '') : undefined}
                className={`w-full flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group cursor-pointer ${
                    isActiveGroup
                        ? 'text-[#ff4a1f] dark:text-orange-400 font-semibold bg-orange-50/70 dark:bg-slate-800/80'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                }`}
            >
                <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                    {IconComp && (
                        <IconComp
                            size={20}
                            strokeWidth={1.5}
                            className={isActiveGroup ? 'text-[#ff4a1f] dark:text-orange-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
                        />
                    )}
                    {isOpen && <span className="whitespace-nowrap">{String(item.group || '')}</span>}
                </div>
                {isOpen && (
                    <ChevronRight
                        size={16}
                        strokeWidth={1.5}
                        className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                )}
            </button>

            {isExpanded && (
                <div className={`${isOpen ? 'relative ml-[22px] pr-2' : 'px-1'} mb-1 mt-0.5`}>
                    {(() => {
                        const activeIdx = Array.isArray(item.items)
                            ? item.items.findIndex((subItem: any) => isSubItemActive(subItem.path, location.pathname, location.hash))
                            : -1;

                        return item.items.map((subItem: any, sIdx: number) => {
                            const isActive = isSubItemActive(subItem.path, location.pathname, location.hash);
                            const badgeCount = subItem.badge || getSidebarItemBadge(subItem.path);
                            const isLast = sIdx === item.items.length - 1;
                            const isBeforeActive = activeIdx !== -1 && sIdx < activeIdx;
                            const isCurrentActive = activeIdx !== -1 && sIdx === activeIdx;
                            const locked = !isVerified && isItemProtected(subItem.path);

                            return (
                                <Link
                                    key={subItem.path || subItem.name || sIdx}
                                    to={locked ? '#' : (subItem.path || '/driver/dashboard')}
                                    onClick={(e) => {
                                        if (locked) {
                                            e.preventDefault();
                                            window.dispatchEvent(
                                                new CustomEvent('open-driver-lock-prompt', {
                                                    detail: { featureName: subItem.name || 'Shipments & Dispatch' },
                                                })
                                            );
                                            return;
                                        }
                                        if (window.innerWidth < 1024) {
                                            onClose?.();
                                        }
                                    }}
                                    className={`relative flex items-center ${isOpen ? 'justify-between py-1.5 pl-[18px] pr-1.5' : 'justify-center py-2'} rounded-md text-[13.5px] transition-colors group ${
                                        isActive
                                            ? 'text-[#ff4a1f] dark:text-orange-400 font-bold'
                                            : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                    title={!isOpen ? String(subItem.name || '') : undefined}
                                >
                                    {isOpen && (
                                        <>
                                            <div
                                                className={`absolute left-0 top-0 h-1/2 w-[1.5px] transition-colors ${
                                                    isBeforeActive || isCurrentActive
                                                        ? 'bg-[#ff4a1f] dark:bg-orange-500'
                                                        : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            />
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-0 top-1/2 h-1/2 w-[1.5px] transition-colors ${
                                                        isBeforeActive
                                                            ? 'bg-[#ff4a1f] dark:bg-orange-500'
                                                            : 'bg-slate-300 dark:bg-slate-700'
                                                    }`}
                                                />
                                            )}
                                            <div
                                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[12px] h-[1.5px] transition-colors ${
                                                    isCurrentActive
                                                        ? 'bg-[#ff4a1f] dark:bg-orange-500'
                                                        : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            />
                                        </>
                                    )}

                                    <div className="flex items-center gap-2 truncate">
                                        <span className="truncate">{String(subItem.name || '')}</span>
                                        {locked && isOpen && (
                                            <Lock size={12} className="text-amber-500 shrink-0" />
                                        )}
                                    </div>

                                    {badgeCount > 0 && isOpen ? (
                                        <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                                            {badgeCount}
                                        </span>
                                    ) : null}
                                </Link>
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    );
};
