import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import HeaderNotifications from '@/components/HeaderNotifications';
import HeaderMessages from '@/components/HeaderMessages';
import NegotiationChatWidget from '@/components/NegotiationChatWidget';
import { useUserHeartbeat } from '@/hooks/useUserHeartbeat';
import { TOKEN_CONFIG } from '@/config/auth';

// ── Helper: read auth user from localStorage ─────────────────────────────────
function getAuthUser() {
    try {
        const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!raw) return null;
        return JSON.parse(raw) as { name?: string; email?: string; user_type?: string; profile_picture?: string };
    } catch {
        return null;
    }
}

// Returns up-to-2-char initials for an avatar
function initials(name?: string): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

const RouteLoadingFallback = () => {
    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1.5">
                    <div className="h-6 w-44 bg-slate-200/80 dark:bg-slate-800 rounded-[2px] animate-live-shimmer" />
                    <div className="h-3.5 w-64 bg-slate-200/50 dark:bg-slate-800/60 rounded-[2px] animate-live-shimmer" />
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-20 bg-slate-200/80 dark:bg-slate-800 rounded-[2px] animate-live-shimmer" />
                    <div className="h-8 w-32 bg-slate-200/80 dark:bg-slate-800 rounded-[2px] animate-live-shimmer" />
                </div>
            </div>
            <div className="bg-white dark:bg-[#12161c] rounded-md border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-none">
                <div className="h-8 w-72 bg-slate-100 dark:bg-slate-800/80 rounded-[2px] animate-live-shimmer" />
                <div className="space-y-2.5 pt-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-full bg-slate-100/70 dark:bg-slate-800/50 rounded-[2px] animate-live-shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function SupplierLayout() {
    useUserHeartbeat(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);

    const location = useLocation();
    const navigate = useNavigate();

    const profileRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    // Auto-close sidebar on mobile when route changes
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Re-read auth user if localStorage changes
    useEffect(() => {
        const sync = () => setAuthUser(getAuthUser());
        window.addEventListener('storage', sync);
        window.addEventListener('user-profile-updated', sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('user-profile-updated', sync);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
        localStorage.removeItem(TOKEN_CONFIG.userKey);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/web/login');
    };

    // Calculate current route label for Header Title
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentModuleLabel = pathParts[1] ? pathParts[1].replace(/-/g, ' ') : 'Dashboard';

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#12161c] overflow-hidden relative font-sans antialiased">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Ultra Clean & Minimal Navbar Header */}
                <header className="h-14 bg-white/95 dark:bg-[#12161c]/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-5 z-30 shrink-0 transition-colors">
                    {/* Left: Sidebar Toggle + Title + Search */}
                    <div className="flex items-center gap-3.5">
                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu size={19} />
                        </button>

                        {/* Route Title */}
                        <div className="hidden sm:block">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 capitalize tracking-wide">
                                {currentModuleLabel}
                            </span>
                        </div>

                        {/* Search Pill */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-slate-50 dark:bg-[#1a1f26] px-3 h-8 rounded-full w-[220px] lg:w-[260px] border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left group cursor-pointer"
                        >
                            <Search size={13} className="text-slate-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f] transition-colors" />
                            <span className="text-[12px] text-slate-400 dark:text-slate-400 w-full truncate">Search loads, quotes...</span>
                            <kbd className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">⌘K</kbd>
                        </button>
                    </div>

                    {/* Right: Controls & Profile */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        {/* Dynamic Notification Bell Dropdown */}
                        <HeaderNotifications role="supplier" />

                        {/* Dynamic General Messages Dropdown */}
                        <HeaderMessages role="supplier" />

                        <div className="h-4 w-px bg-slate-200 dark:border-slate-800 mx-0.5 hidden sm:block" />

                        {/* User Profile Pill */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center text-[10.5px] font-extrabold shrink-0 shadow-2xs overflow-hidden">
                                    {authUser?.profile_picture ? (
                                        <img src={authUser.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : authUser?.name ? (
                                        initials(authUser.name)
                                    ) : (
                                        <User size={13} />
                                    )}
                                </div>
                                <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] sm:max-w-[140px] truncate">
                                    {authUser?.name || 'Account'}
                                </span>
                                <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-700/80 shadow-xl z-[999] overflow-hidden text-xs py-1 animate-fade-in">
                                    {/* User info header */}
                                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#181a20]/60">
                                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{authUser?.name || 'Guest User'}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">{authUser?.email || ''}</p>
                                    </div>

                                    <div className="p-1 space-y-0.5">
                                        <Link
                                            to="/supplier/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors"
                                        >
                                            <User size={14} className="text-slate-400" />
                                            <span>My Account</span>
                                        </Link>

                                        <Link
                                            to="/supplier/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors"
                                        >
                                            <Settings size={14} className="text-slate-400" />
                                            <span>Settings</span>
                                        </Link>

                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                        <button
                                            type="button"
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left font-semibold cursor-pointer"
                                        >
                                            <LogOut size={14} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                {(() => {
                    const isFullHeightChat = location.pathname.includes('/messages') ||
                                             location.pathname.includes('/negotiation/conversation') ||
                                             location.pathname.includes('/negotiation/view');
                    return (
                        <main ref={mainRef} className={`flex-1 ${isFullHeightChat ? 'overflow-hidden h-[calc(100vh-56px)]' : 'overflow-y-auto overflow-x-hidden'} bg-[#f8fafc] dark:bg-[#12161c] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
                            <React.Suspense fallback={<RouteLoadingFallback />}>
                                <div className={`w-full ${isFullHeightChat ? 'h-full pb-0' : 'pb-16'}`}>
                                    <Outlet />
                                </div>
                            </React.Suspense>
                        </main>
                    );
                })()}
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Floating Negotiation Chat Widget */}
            {!location.pathname.includes('/messages') && !location.pathname.includes('/negotiation/conversation') && !location.pathname.includes('/negotiation/view') && <NegotiationChatWidget />}
        </div>
    );
}
