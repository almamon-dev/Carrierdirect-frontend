import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronDown, CheckCircle2, Package, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
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

function initials(name?: string): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

const mockNotifications = [
  { id: 1, title: 'New Job Offer', desc: 'New London to Manchester route available (£580).', time: '2m ago', icon: Package },
  { id: 2, title: 'Quote Accepted', desc: 'Customer accepted your quote for Order #882.', time: '40m ago', icon: CheckCircle2 },
  { id: 3, title: 'Pickup Reminder', desc: 'Pickup scheduled at 14:00 today.', time: '2h ago', icon: Clock },
  { id: 4, title: 'System Notice', desc: 'Vehicle MOT compliance document verified.', time: '1d ago', icon: Bell },
];

export default function SupplierLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync auth user on storage change (e.g. login from another tab)
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

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#181a20] overflow-hidden">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className={`h-16 bg-white dark:bg-[#12161c] flex items-center justify-between px-4 sm:px-6 z-40 relative shrink-0 transition-all duration-300 ${
                    isScrolled
                        ? 'border-b border-slate-200 dark:border-slate-800 shadow-sm'
                        : 'border-b border-transparent shadow-none'
                }`}>
                    <div className="flex items-center gap-6">
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
                                {location.pathname.split('/')[1] || 'Dashboard'}
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-gray-50 dark:bg-[#1e2329] px-4 py-2 rounded-full w-[280px] border border-gray-200 dark:border-slate-700/80 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:bg-white dark:hover:bg-[#252b33] transition-colors text-left group cursor-pointer"
                        >
                            <Search size={16} className="text-gray-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                            <span className="text-[13px] text-gray-400 dark:text-slate-400 w-full group-hover:text-gray-600 dark:group-hover:text-slate-200">Search loads, jobs...</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-auto border border-gray-300 dark:border-slate-700">⌘K</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Theme Switcher */}
                        <ThemeSwitcher />
                        
                        {/* Notification Bell Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors relative cursor-pointer"
                                title="Notifications"
                            >
                                <Bell size={19} />
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#ff4a1f] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#12161c] shadow-sm ring-1 ring-[#ff4a1f]/20">
                                    {mockNotifications.length}
                                </span>
                            </button>

                            {/* Notification Popover Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 py-3 z-50 overflow-hidden text-xs">
                                    <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
                                        <span className="text-[11px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/15 px-2.5 py-0.5 rounded-full border border-orange-200/50 dark:border-orange-500/20">
                                            {mockNotifications.length} new
                                        </span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                                        {mockNotifications.map((notif) => (
                                            <div key={notif.id} className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors flex gap-3 cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                                    <notif.icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{notif.title}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{notif.desc}</p>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-[#181a20]/50">
                                        <button 
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="text-xs font-bold text-[#ff4a1f] hover:underline py-1 cursor-pointer"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-[#282f38] transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-xs">
                                    {authUser?.name ? initials(authUser.name) : <User size={14} />}
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] sm:max-w-[160px] truncate">
                                    {authUser?.name || 'Account'}
                                </span>
                                <ChevronDown size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                            </button>

                            {/* User Profile Dropdown Modal */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[999] overflow-hidden text-xs font-medium">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-[#181a20]/50">
                                        <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-[#ff4a1f] text-white flex items-center justify-center text-sm font-black shrink-0">
                                            {authUser?.name ? initials(authUser.name) : <User size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{authUser?.name || 'Guest User'}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{authUser?.email || ''}</p>
                                            {authUser?.user_type && (
                                                <span className="inline-block mt-0.5 text-[10px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-[#ff4a1f]/15 px-1.5 py-0.5 rounded capitalize">
                                                    {authUser.user_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-1.5 space-y-0.5">
                                        <Link
                                            to="/supplier/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            <User size={16} className="text-slate-400 dark:text-slate-400" />
                                            My Account
                                        </Link>
                                        <Link
                                            to="/supplier/settings"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            <Settings size={16} className="text-slate-400 dark:text-slate-400" />
                                            Settings
                                        </Link>
                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                        <button
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-bold cursor-pointer"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] dark:bg-[#181a20] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <React.Suspense fallback={<div className="flex h-full items-center justify-center p-8"><div className="w-8 h-8 border-4 border-[#ff4a1f] border-t-transparent rounded-full animate-spin"></div></div>}>
                        <div className="w-full">
                            <Outlet />
                        </div>
                    </React.Suspense>
                </main>
            </div>
            
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            
            {/* Floating Negotiation Chat Widget */}
            <NegotiationChatWidget />
        </div>
    );
}
