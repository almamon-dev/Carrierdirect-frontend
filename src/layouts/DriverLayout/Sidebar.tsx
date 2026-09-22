import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Truck, 
    MessageSquare, 
    Bell, 
    UserCircle, 
    LogOut, 
    X, 
    ChevronRight,
    Lock
} from 'lucide-react';
import LogoWhite from '@/assets/Images/Logo.png';
import LogoBlack from '@/assets/Images/LogoBlack.png';
import LogoIcon from '@/assets/Images/LogoIcon.png';
import { TOKEN_CONFIG } from '@/config/auth';
import { useDriverCompliance } from '@/modules/Driver/Compliance';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

// Map custom navigation structure
const navigationMap: Record<string, any[]> = {
    driver: [
        { category: 'Main Menu', name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
        { category: 'Main Menu', name: 'Shipments', path: '/driver/shipments', icon: Truck },
        { category: 'Main Menu', name: 'Live Chat', path: '/driver/chat', icon: MessageSquare },
        { category: 'Main Menu', name: 'Notifications', path: '/driver/notifications', icon: Bell },
        { category: 'Account & Settings', name: 'Driver Profile', path: '/driver/profile', icon: UserCircle },
    ]
};

const isSubItemActive = (subItemPath: string, currentPath: string, currentHash: string) => {
    if (!subItemPath) return false;
    if (subItemPath.includes('#')) {
        const [p, h] = subItemPath.split('#');
        return currentPath === p && currentHash === `#${h}`;
    }
    return currentPath === subItemPath || (subItemPath !== '/driver/dashboard' && currentPath.startsWith(subItemPath));
};

const getSidebarItemBadge = (path: string) => {
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

const isItemProtected = (path?: string) => {
    if (!path) return false;
    if (path.includes('/profile')) return false;
    return true;
};

const NavGroup = ({ item, location, isOpen, onClose, isVerified }: { item: any; location: any; isOpen: boolean; onClose?: () => void; isVerified: boolean }) => {
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
    const { isVerified } = useDriverCompliance();
    const location = useLocation();
    const navigate = useNavigate();
    const currentModule = 'driver';
    
    const navItems = navigationMap[currentModule] || [
        { category: 'Main Menu', name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
        { category: 'Main Menu', name: 'Shipments', path: '/driver/shipments', icon: Truck },
        { category: 'Main Menu', name: 'Live Chat', path: '/driver/chat', icon: MessageSquare },
        { category: 'Main Menu', name: 'Notifications', path: '/driver/notifications', icon: Bell },
        { category: 'Account & Settings', name: 'Driver Profile', path: '/driver/profile', icon: UserCircle },
    ];

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
        navigate('/web/login');
    };

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white dark:bg-[#12161c] shadow-2xl lg:shadow-none border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:w-[72px] lg:translate-x-0'}`}>
            <div className="h-16 flex items-center justify-between lg:justify-start px-4 sm:px-5 border-b border-gray-100 dark:border-slate-800 shrink-0 whitespace-nowrap">
                <Link to="/driver/dashboard" onClick={() => { if (window.innerWidth < 1024) onClose?.(); }}>
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
                        type="button"
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
                    const prevCategory = idx > 0 ? navItems[idx - 1]?.category : null;
                    const showCategory = Boolean(item?.category && item.category !== prevCategory);
                    const IconComp = item?.icon;
                    const locked = !isVerified && isItemProtected(item?.path);

                    return (
                        <React.Fragment key={item?.path || item?.name || idx}>
                            {showCategory && (
                                isOpen ? (
                                    <div className="px-3 mb-2 mt-4 text-[12px] font-semibold text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">
                                        {String(item.category)}
                                    </div>
                                ) : (
                                    <div className="mb-2 mt-4 border-t border-slate-100 dark:border-slate-800 mx-2" />
                                )
                            )}
                            
                            {item?.group ? (
                                <NavGroup item={item} location={location} isOpen={isOpen} onClose={onClose} isVerified={isVerified} />
                            ) : (
                                <Link
                                    to={locked ? '#' : (item?.path || '/driver/dashboard')}
                                    onClick={(e) => {
                                        if (locked) {
                                            e.preventDefault();
                                            window.dispatchEvent(
                                                new CustomEvent('open-driver-lock-prompt', {
                                                    detail: { featureName: item.name || 'Shipments & Dispatch' },
                                                })
                                            );
                                            return;
                                        }
                                        if (window.innerWidth < 1024) {
                                            onClose?.();
                                        }
                                    }}
                                    title={!isOpen ? String(item?.name || '') : undefined}
                                    className={`flex items-center ${isOpen ? 'justify-between px-3' : 'justify-center'} py-2 rounded-lg text-[14px] font-medium transition-colors group mb-0.5 ${
                                        (location.pathname === item?.path || (item?.path && item.path !== '/' && location.pathname.startsWith(item.path)))
                                            ? 'text-[#ff4a1f] dark:text-orange-400 font-semibold bg-orange-50/70 dark:bg-slate-800/80' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className={`flex items-center ${isOpen ? 'gap-2.5' : 'justify-center'}`}>
                                        {IconComp && (
                                            <IconComp 
                                                size={20} 
                                                strokeWidth={1.5}
                                                className={(location.pathname === item?.path || (item?.path && item.path !== '/' && location.pathname.startsWith(item.path))) ? 'text-[#ff4a1f] dark:text-orange-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} 
                                            />
                                        )}
                                        {isOpen && <span className="whitespace-nowrap">{String(item?.name || '')}</span>}
                                    </div>
                                    {locked && isOpen && (
                                        <Lock size={13} className="text-amber-500 shrink-0" />
                                    )}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-800 shrink-0 space-y-2">
                <button 
                    type="button"
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
