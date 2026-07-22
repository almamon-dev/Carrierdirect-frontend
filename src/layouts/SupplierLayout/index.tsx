import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronDown, CheckCircle2, Package, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import NegotiationChatWidget from '@/components/NegotiationChatWidget';

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

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
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
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
                    <div className="flex items-center gap-6">
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
                                {location.pathname.split('/')[1] || 'Dashboard'}
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full w-[280px] border border-gray-200 hover:border-[#ff4a1f] hover:bg-white transition-colors text-left group cursor-pointer"
                        >
                            <Search size={16} className="text-gray-400 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                            <span className="text-[13px] text-gray-400 w-full group-hover:text-gray-600">Search loads, jobs...</span>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded ml-auto border border-gray-300">⌘K</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        
                        {/* Notification Bell Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                            >
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 bg-[#ff4a1f] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {mockNotifications.length}
                                </span>
                            </button>

                            {/* Notification Popover Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fade-in">
                                    <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                        <span className="text-[11px] font-bold text-[#ff4a1f] bg-orange-50 px-2 py-0.5 rounded-full">
                                            {mockNotifications.length} new
                                        </span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                        {mockNotifications.map((notif) => (
                                            <div key={notif.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex gap-3 cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                                    <notif.icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{notif.desc}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 text-center">
                                        <button 
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="text-xs font-bold text-[#ff4a1f] hover:underline py-1"
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
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                                    Supplier 2
                                </span>
                                <ChevronDown size={14} className="text-slate-500" />
                            </button>

                            {/* User Profile Dropdown Modal */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in text-sm font-medium">
                                    <Link
                                        to="/supplier/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <User size={16} className="text-slate-400" />
                                        My Account
                                    </Link>
                                    <Link
                                        to="/supplier/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <Settings size={16} className="text-slate-400" />
                                        Settings
                                    </Link>
                                    <div className="border-t border-slate-100 my-1" />
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left font-bold cursor-pointer"
                                    >
                                        <LogOut size={16} />
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
                        <Outlet />
                    </React.Suspense>
                </main>
            </div>
            
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            
            {/* Floating Negotiation Chat Widget */}
            <NegotiationChatWidget />
        </div>
    );
}
