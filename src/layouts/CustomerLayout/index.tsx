import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Settings, LogOut, ChevronDown, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import HeaderNotifications from '@/components/HeaderNotifications';
import HeaderMessages from '@/components/HeaderMessages';
import NegotiationChatWidget from '@/components/NegotiationChatWidget';
import ThemeSwitcher from '@/components/common/theme-switcher';
import { TOKEN_CONFIG } from '@/config/auth';

// ── Helper: read auth user from localStorage ─────────────────────────────────
function getAuthUser() {
    try {
        const raw = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!raw) return null;
        return JSON.parse(raw) as { name?: string; email?: string; user_type?: string };
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

export default function CustomerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);
    const [isScrolled, setIsScrolled] = useState(false);

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

    // Re-read auth user if localStorage changes (e.g. after login in another tab)
    useEffect(() => {
        const sync = () => setAuthUser(getAuthUser());
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    // Track scroll position on main container to trigger header border
    useEffect(() => {
        const mainEl = mainRef.current;
        if (!mainEl) return;
        const handleScroll = () => {
            setIsScrolled(mainEl.scrollTop > 5);
        };
        // Check initial scroll state
        handleScroll();
        mainEl.addEventListener('scroll', handleScroll, { passive: true });
        return () => mainEl.removeEventListener('scroll', handleScroll);
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
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative font-sans antialiased">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Navbar */}
                <header className={`h-16 bg-white dark:bg-[#12161c] flex items-center justify-between px-4 sm:px-6 z-40 relative shrink-0 transition-all duration-300 ${isScrolled
                        ? 'border-b border-slate-200 dark:border-slate-800 shadow-sm'
                        : 'border-b border-transparent shadow-none'
                    }`}>
                    <div className="flex items-center gap-5">
                        <button
                            className="text-slate-600 dark:text-slate-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors cursor-pointer"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                        </button>

                        {/* Module Title */}
                        <div className="hidden lg:block">
                            <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 capitalize tracking-wide">
                                {currentModuleLabel}
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-slate-50 dark:bg-[#1e2329] px-4 py-1.5 rounded-full w-[280px] border border-slate-200 dark:border-slate-700/80 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:bg-white dark:hover:bg-[#252b33] transition-colors text-left group cursor-pointer"
                        >
                            <Search size={15} className="text-slate-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                            <span className="text-[13px] text-slate-400 dark:text-slate-400 w-full group-hover:text-slate-600 dark:group-hover:text-slate-200">Search loads, quotes...</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-auto border border-slate-300 dark:border-slate-700">⌘K</span>
                        </button>
                    </div>

                    {/* Right Header Controls */}
                    <div className="flex items-center gap-3">

                        {/* Dynamic Notification Bell Dropdown with Count Badge */}
                        <HeaderNotifications role="customer" />

                        {/* Dynamic General Messages Dropdown with Count Badge */}
                        <HeaderMessages role="customer" />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-[#282f38] transition-colors cursor-pointer"
                            >
                                {/* Avatar: initials or icon */}
                                <div className="w-7 h-7 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-xs">
                                    {authUser?.name ? initials(authUser.name) : <User size={14} />}
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] sm:max-w-[160px] truncate">
                                    {authUser?.name || 'Account'}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1e2329] rounded-[3px] border border-slate-200 dark:border-slate-700/80 shadow-2xl z-[999] overflow-hidden text-xs py-1.5">
                                    {/* User info header */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-[#181a20]/50">
                                        <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-[#ff4a1f] text-white flex items-center justify-center text-sm font-black shrink-0">
                                            {authUser?.name ? initials(authUser.name) : <User size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{authUser?.name || 'Guest User'}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{authUser?.email || ''}</p>
                                            {authUser?.user_type && (
                                                <span className="inline-block mt-0.5 text-[10px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-[#ff4a1f]/15 px-1.5 py-0.5 rounded-[3px] capitalize">
                                                    {authUser.user_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        {/* Theme Switcher Row */}
                                        <div className="flex items-center justify-between px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                                            <div className="flex items-center gap-2.5">
                                                <Sun size={15} className="text-slate-500 dark:text-slate-400" />
                                                <span className="font-medium text-xs">Theme Mode</span>
                                            </div>
                                            <ThemeSwitcher />
                                        </div>

                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                        <Link
                                            to="/customer/settings?tab=profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors"
                                        >
                                            <User size={15} />
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/customer/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors"
                                        >
                                            <Settings size={15} />
                                            Account Settings
                                        </Link>

                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                        <button
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-bold cursor-pointer"
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] dark:bg-[#12161c] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <React.Suspense fallback={<RouteLoadingFallback />}>
                        <div className="w-full pb-16">
                            <Outlet />
                        </div>
                    </React.Suspense>
                </main>
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Floating Negotiation Chat Widget */}
            {!location.pathname.includes('/messages') && <NegotiationChatWidget />}
        </div>
    );
}
