import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bell, Search, Calendar } from 'lucide-react';
import Sidebar from './Sidebar';

export default function CustomerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Render External Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <button
                            className="text-slate-600 hover:text-blue-600 transition-colors"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Module Title */}
                        <div className="hidden lg:block">
                            <h1 className="text-[20px] font-bold text-[#0B1E43] capitalize tracking-wide">
                                {location.pathname.split('/')[1] || 'Dashboard'}
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2.5 rounded-full w-[300px] border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-transparent border-none outline-none text-[13px] w-full text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-4 text-gray-500 border-r border-gray-200 pr-5">
                            <button className="hover:text-gray-800 transition-colors">
                                <Bell size={18} />
                            </button>
                            <button className="hover:text-gray-800 transition-colors">
                                <Calendar size={18} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm tracking-wide">
                                SA
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-bold text-gray-900 leading-tight">School Admin</span>
                                <span className="text-[11px] font-medium text-gray-500">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <React.Suspense fallback={<div className="flex h-full items-center justify-center p-8"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
                        <Outlet />
                    </React.Suspense>
                </main>
            </div>
        </div>
    );
}
