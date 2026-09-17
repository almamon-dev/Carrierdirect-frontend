import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, ChevronRight, X } from 'lucide-react';
import LogoBlack from '@/assets/Images/LogoBlack.png';
import LogoWhite from '@/assets/Images/Logo.png';
import LogoIcon from '@/assets/Images/LogoIcon.png';
import { navigationMap } from '@/constants/navigation';
import { TOKEN_CONFIG } from '@/config/auth';
import { hasPermission } from '@/components/common/PermissionGuard';
import { getRoleDashboardUrl } from '@/utils/roleDashboard';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

const getSidebarItemBadge = (_path: string) => null;

const isSubItemActive = (subPath: string, currentPath: string, currentHash?: string) => {
    const fullPath = currentHash ? `${currentPath}${currentHash}` : currentPath;
    if (fullPath === subPath || currentPath === subPath) return true;
    if (subPath !== '/' && (fullPath.startsWith(subPath) || currentPath.startsWith(subPath))) return true;

    // Supplier Order details & tracking belong to Active Jobs
    if (subPath === '/supplier/orders/active-jobs') {
        if (
            currentPath.startsWith('/supplier/orders/details') ||
            currentPath.startsWith('/supplier/orders/track') ||
            currentPath.startsWith('/supplier/quotes/processing/track')
        ) {
            return true;
        }
    }

    // Supplier Quote submission belongs to Quote Requests
    if (subPath === '/supplier/quotes/requests') {
        if (currentPath.startsWith('/supplier/quotes/submit')) {
            return true;
        }
    }

    return false;
};

const NavGroup = ({ item, location, isOpen, onClose }: { item: any; location: any; isOpen: boolean; onClose?: () => void }) => {
    const isActiveGroup = Array.isArray(item.items) && item.items.some((subItem: any) => 
        isSubItemActive(subItem.path, location.pathname, location.hash)
    );

    // Initially off by default unless current route belongs to this group
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
                        <item.icon 
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
                                            {/* Top vertical connector (top-0 to 50%) */}
                                            <div 
                                                className={`absolute left-0 top-0 h-1/2 w-[1.5px] transition-colors ${
                                                    isBeforeActive || isCurrentActive 
                                                        ? 'bg-[#ff4a1f] dark:bg-orange-500' 
                                                        : 'bg-slate-300 dark:bg-slate-700'
                                                }`} 
                                            />
                                            
                                            {/* Bottom vertical connector (50% to bottom-0, only if not last item) */}
                                            {!isLast && (
                                                <div 
                                                    className={`absolute left-0 top-1/2 h-1/2 w-[1.5px] transition-colors ${
                                                        isBeforeActive 
                                                            ? 'bg-[#ff4a1f] dark:bg-orange-500' 
                                                            : 'bg-slate-300 dark:bg-slate-700'
                                                    }`} 
                                                />
                                            )}
                                            
                                            {/* Horizontal connector branch (X-axis) */}
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
                                                {/* Dot Indicator */}
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
                                        <span className="ml-auto shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-[#ff4a1f] rounded-full leading-none text-center shadow-xs">
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

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentModule = location.pathname.split('/')[1] || 'dashboard';
    
    const rawNavItems = navigationMap[currentModule] || [
        { name: 'Dashboard', path: `/${currentModule}/dashboard`, icon: LayoutDashboard },
        { name: 'Settings', path: `/${currentModule}/settings`, icon: Settings },
    ];

    const userStr =
        localStorage.getItem(TOKEN_CONFIG.userKey) ||
        localStorage.getItem('carrierdirect_user_data') ||
        localStorage.getItem('user');

    let currentUser: any = null;
    if (userStr) {
        try {
            currentUser = JSON.parse(userStr);
        } catch {
            currentUser = null;
        }
    }

    // Filter sidebar navigation items based on current user role & permissions
    const navItems = useMemo(() => {
        if (!currentUser) return rawNavItems;

        // Account owners and super admins have full access to all items
        if (currentUser.user_type === 'supplier' || currentUser.user_type === 'admin') {
            return rawNavItems;
        }

        const filtered: any[] = [];

        rawNavItems.forEach((item: any) => {
            // Check ownerOnly items (e.g. subscription)
            if (item.ownerOnly) {
                return;
            }

            // Group item
            if (item.group && Array.isArray(item.items)) {
                // Filter sub items
                const visibleSubItems = item.items.filter((sub: any) => {
                    return hasPermission(currentUser, sub.permission, undefined, sub.ownerOnly);
                });

                if (visibleSubItems.length > 0) {
                    filtered.push({
                        ...item,
                        items: visibleSubItems,
                    });
                }
                return;
            }

            // Single item permission check
            if (hasPermission(currentUser, item.permission, undefined, item.ownerOnly)) {
                if (item.name === 'Dashboard' && currentModule === 'supplier') {
                    filtered.push({
                        ...item,
                        path: getRoleDashboardUrl(currentUser),
                    });
                } else {
                    filtered.push(item);
                }
            }
        });

        return filtered;
    }, [rawNavItems, currentUser]);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.userKey);
        localStorage.removeItem('carrierdirect_access_token');
        localStorage.removeItem('carrierdirect_user_data');
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_user_data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white dark:bg-[#12161c] shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:w-[72px] lg:translate-x-0'}`}>
            <div className="h-16 flex items-center justify-between lg:justify-start px-4 sm:px-5 border-b border-gray-100 dark:border-slate-800 shrink-0 whitespace-nowrap">
                <Link to="/" onClick={() => { if (window.innerWidth < 1024) onClose?.(); }}>
                    {isOpen ? (
                        <>
                            <img src={LogoBlack} alt="Get It Moving" className="h-10 max-w-[170px] object-contain transition-opacity duration-300 cursor-pointer dark:hidden" />
                            <img src={LogoWhite} alt="Get It Moving" className="h-10 max-w-[170px] object-contain transition-opacity duration-300 cursor-pointer hidden dark:block" />
                        </>
                    ) : (
                        <img src={LogoIcon} alt="Icon" className="w-10 h-10 object-contain shrink-0 cursor-pointer" />
                    )}
                </Link>
                {isOpen && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Close menu"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar">
                {navItems.map((item, idx) => {
                    const prevCategory = idx > 0 ? navItems[idx - 1].category : null;
                    const showCategory = item.category && item.category !== prevCategory;

                    return (
                        <React.Fragment key={idx}>
                            {showCategory && (
                                isOpen ? (
                                    <div className="px-3 mb-2 mt-4 text-[12px] font-semibold text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">
                                        {item.category}
                                    </div>
                                ) : (
                                    <div className="mb-2 mt-4 border-t border-slate-100 dark:border-slate-800 mx-2" />
                                )
                            )}
                            
                            {item.group ? (
                                <NavGroup item={item} location={location} isOpen={isOpen} onClose={onClose} />
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            onClose?.();
                                        }
                                    }}
                                    title={!isOpen ? item.name : undefined}
                                    className={`flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group mb-0.5 ${
                                        (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)))
                                            ? 'text-[#ff4a1f] dark:text-orange-400 font-semibold bg-orange-50/70 dark:bg-slate-800/80' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                                        <item.icon 
                                            size={20} 
                                            strokeWidth={1.5}
                                            className={(location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) ? 'text-[#ff4a1f] dark:text-orange-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} 
                                        />
                                        {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                                    </div>
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 shrink-0 space-y-2">
                <button 
                    onClick={handleLogout}
                    title={!isOpen ? "Logout" : undefined}
                    className={`flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} py-2 w-full rounded-lg text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer`}
                >
                    <LogOut size={20} />
                    {isOpen && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
