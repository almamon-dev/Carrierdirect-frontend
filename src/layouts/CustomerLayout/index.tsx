import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronDown, CheckCircle2, Package, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import NegotiationChatWidget from '@/components/NegotiationChatWidget';

const mockNotifications = [
  { id: 1, title: 'Quote Received', desc: 'FastFreight submitted a quote of £420.', time: '5m ago', icon: Package },
  { id: 2, title: 'Shipment Dispatched', desc: 'Driver John is en route for pickup.', time: '1h ago', icon: Clock },
  { id: 3, title: 'Payment Escrowed', desc: 'Escrow payment verified for Order #1042.', time: '3h ago', icon: CheckCircle2 },
  { id: 4, title: 'System Notice', desc: 'Pay Later limit increased by £1,500.', time: '1d ago', icon: Bell },
];

export default function CustomerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

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

    const handleLogout = () => {
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_user_data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Calculate current route label for Header Title
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentModuleLabel = pathParts[1] ? pathParts[1].replace(/-/g, ' ') : 'Dashboard';

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
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
                <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 z-40 relative shrink-0 shadow-2xs">
                    <div className="flex items-center gap-5">
                        <button
                            className="text-slate-600 hover:text-[#ff4a1f] transition-colors cursor-pointer"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Module Title */}
                        <div className="hidden lg:block">
                            <h1 className="text-[18px] font-bold text-slate-900 capitalize tracking-wide">
                                {currentModuleLabel}
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-slate-50 px-4 py-1.5 rounded-full w-[280px] border border-slate-200 hover:border-[#ff4a1f] hover:bg-white transition-colors text-left group cursor-pointer"
                        >
                            <Search size={15} className="text-slate-400 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                            <span className="text-[13px] text-slate-400 w-full group-hover:text-slate-600">Search loads, quotes...</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded ml-auto border border-slate-300">⌘K</span>
                        </button>
                    </div>

                    {/* Right Header Controls */}
                    <div className="flex items-center gap-3">
                        
                        {/* Notification Bell Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                            >
                                <Bell size={16} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4a1f] rounded-full animate-pulse" />
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-2xl z-[999] overflow-hidden animate-fade-in text-xs">
                                    <div className="px-4 py-3 bg-slate-900 text-white font-bold flex items-center justify-between">
                                        <span>Notifications</span>
                                        <span className="bg-[#ff4a1f] text-white px-1.5 py-0.5 rounded text-[10px]">4 New</span>
                                    </div>
                                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                                        {mockNotifications.map((notif) => (
                                            <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5 items-start">
                                                <notif.icon className="w-4 h-4 text-[#ff4a1f] shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-slate-900">{notif.title}</p>
                                                    <p className="text-slate-500 text-[11px]">{notif.desc}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown Modal */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                                    Alex Morgan
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-2xl z-[999] overflow-hidden animate-fade-in text-xs py-1">
                                    <div className="px-4 py-2.5 border-b border-slate-100">
                                        <p className="font-bold text-slate-900">Alex Morgan</p>
                                        <p className="text-slate-500 text-[11px] truncate">alex.morgan@example.com</p>
                                    </div>

                                    <Link
                                        to="/customer/settings?tab=profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#ff4a1f] transition-colors"
                                    >
                                        <User size={15} />
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/customer/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#ff4a1f] transition-colors"
                                    >
                                        <Settings size={15} />
                                        Account Settings
                                    </Link>

                                    <div className="border-t border-slate-100 my-1" />

                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left font-bold cursor-pointer"
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
