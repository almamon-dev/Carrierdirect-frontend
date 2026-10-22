import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSupplierNewRequestsCount } from '@/hooks/useSupplierNewRequestsCount';
import { isSubItemActive } from './supplierNavUtils';

interface SupplierNavGroupProps {
    item: any;
    location: any;
    isOpen: boolean;
    onClose?: () => void;
}

export const SupplierNavGroup: React.FC<SupplierNavGroupProps> = ({
    item,
    location,
    isOpen,
    onClose
}) => {
    const newRequestsCount = useSupplierNewRequestsCount();

    const getSidebarItemBadge = (path: string) => {
        if (path === '/supplier/quotes/requests') {
            return newRequestsCount > 0 ? newRequestsCount : null;
        }
        return null;
    };

    const isActiveGroup = Array.isArray(item.items) && item.items.some((subItem: any) =>
        isSubItemActive(subItem.path, location.pathname, location.hash, location.state, location.search)
    );

    const [isExpanded, setIsExpanded] = useState(isActiveGroup);

    useEffect(() => {
        if (isActiveGroup) {
            setIsExpanded(true);
        }
    }, [isActiveGroup, location.pathname, location.hash]);

    if (!item.items || item.items.length === 0) return null;

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
                    {item.icon && (
                        <div className="relative">
                            <item.icon
                                size={20}
                                strokeWidth={1.5}
                                className={isActiveGroup ? 'text-[#ff4a1f] dark:text-orange-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
                            />
                            {!isOpen && newRequestsCount > 0 && (item.group === 'Quotes' || item.group === 'Quote Management') && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                                    {newRequestsCount > 99 ? '99+' : newRequestsCount}
                                </span>
                            )}
                        </div>
                    )}
                    {isOpen && <span className="whitespace-nowrap">{String(item.group || '')}</span>}
                </div>
                {isOpen && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        {!isExpanded && newRequestsCount > 0 && (item.group === 'Quotes' || item.group === 'Quote Management') && (
                            <span className="min-w-[18px] h-[18px] px-1 bg-[#ff4a1f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-xs animate-in zoom-in duration-200 leading-none">
                                {newRequestsCount > 99 ? '99+' : newRequestsCount}
                            </span>
                        )}
                        <ChevronRight
                            size={16}
                            strokeWidth={1.5}
                            className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </div>
                )}
            </button>

            {isExpanded && (
                <div className={`${isOpen ? 'relative ml-[22px] pr-2' : 'px-1'} mb-1 mt-0.5`}>
                    {(() => {
                        const activeIdx = Array.isArray(item.items)
                            ? item.items.findIndex((subItem: any) => isSubItemActive(subItem.path, location.pathname, location.hash, location.state, location.search))
                            : -1;

                        return item.items.map((subItem: any, sIdx: number) => {
                            const isActive = isSubItemActive(subItem.path, location.pathname, location.hash, location.state, location.search);
                            const badgeCount = subItem.badge || getSidebarItemBadge(subItem.path);
                            const isLast = sIdx === item.items.length - 1;

                            const isBeforeActive = activeIdx !== -1 && sIdx < activeIdx;
                            const isCurrentActive = activeIdx !== -1 && sIdx === activeIdx;

                            return (
                                <Link
                                    key={subItem.path || subItem.name || sIdx}
                                    to={subItem.path}
                                    onClick={() => {
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
                                                className={`absolute left-0 top-1/2 w-[13px] h-[1.5px] transition-colors ${
                                                    isCurrentActive
                                                        ? 'bg-[#ff4a1f] dark:bg-orange-500'
                                                        : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            />
                                        </>
                                    )}

                                    <div className={`flex items-center ${isOpen ? 'gap-2 relative' : 'justify-center'} whitespace-nowrap min-w-0`}>
                                        {isOpen ? (
                                            <>
                                                <div className={`relative flex items-center justify-center shrink-0 w-3.5 h-3.5 rounded-full ${isActive ? 'bg-orange-100 dark:bg-orange-950/60 ring-2 ring-[#ff4a1f]/25' : 'bg-transparent'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#ff4a1f] dark:bg-orange-500' : 'bg-slate-400 dark:bg-slate-500 group-hover:bg-slate-600 dark:group-hover:bg-slate-300'}`} />
                                                </div>
                                                <span className="truncate">{String(subItem.name || '')}</span>
                                            </>
                                        ) : (
                                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#ff4a1f] dark:bg-orange-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                        )}
                                    </div>
                                    {isOpen && Number(badgeCount) > 0 ? (
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
