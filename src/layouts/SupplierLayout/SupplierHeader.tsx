import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import HeaderNotifications from '@/components/HeaderNotifications';
import HeaderMessages from '@/components/HeaderMessages';

interface AuthUser {
    name?: string;
    company_name?: string;
    email?: string;
    user_type?: string;
    profile_picture?: string;
    is_compliance_verified?: boolean;
    is_verified?: boolean;
}

interface SupplierHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    currentModuleLabel: string;
    onOpenSearch: () => void;
    authUser: AuthUser | null;
    isProfileOpen: boolean;
    setIsProfileOpen: (open: boolean) => void;
    profileRef: React.RefObject<HTMLDivElement | null>;
    onLogout: () => void;
    initials: (name?: string) => string;
}

export const SupplierHeader: React.FC<SupplierHeaderProps> = ({
    isSidebarOpen,
    onToggleSidebar,
    currentModuleLabel,
    onOpenSearch,
    authUser,
    isProfileOpen,
    setIsProfileOpen,
    profileRef,
    onLogout,
    initials
}) => {
    return (
        <header className="h-16 bg-white/95 dark:bg-[#12161c]/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-5 z-30 shrink-0 transition-colors">
            <div className="flex items-center gap-3 sm:gap-3.5">
                <button
                    type="button"
                    aria-label="Toggle navigation"
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    onClick={onToggleSidebar}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h10M4 18h16" />
                    </svg>
                </button>

                <div className="hidden sm:flex items-center">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 capitalize tracking-wide leading-none">
                        {currentModuleLabel}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onOpenSearch}
                    aria-label="Open search"
                    className="md:hidden w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                    <Search size={18} />
                </button>

                <button
                    type="button"
                    onClick={onOpenSearch}
                    className="hidden md:flex items-center bg-slate-50 dark:bg-[#1a1f26] px-3.5 h-9 rounded-full w-[220px] lg:w-[260px] border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left group cursor-pointer shrink-0"
                >
                    <Search size={14} className="text-slate-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f] transition-colors" />
                    <span className="text-[12.5px] text-slate-400 dark:text-slate-400 w-full truncate font-normal">Search loads, quotes...</span>
                    <kbd className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 ml-1.5">⌘K</kbd>
                </button>
            </div>

            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5">
                <HeaderNotifications role="supplier" />
                <HeaderMessages role="supplier" />
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

                <div className="relative" ref={profileRef}>
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="h-9 flex items-center gap-1.5 xs:gap-2 pl-1 pr-2 xs:pr-2.5 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-[#ff4a1f] flex items-center justify-center text-[10.5px] font-extrabold shrink-0 shadow-2xs overflow-hidden">
                            {authUser?.profile_picture ? (
                                <img key={authUser.profile_picture} src={authUser.profile_picture} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            ) : (authUser?.name || authUser?.company_name) ? (
                                <span className="w-full h-full bg-[#ff4a1f] text-white flex items-center justify-center text-[10.5px] font-extrabold">
                                    {initials(authUser.name || authUser.company_name)}
                                </span>
                            ) : (
                                <User size={13} />
                            )}
                        </div>
                        <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 hidden xs:inline max-w-[80px] sm:max-w-[140px] truncate">
                            {authUser?.name || authUser?.company_name || 'Account'}
                        </span>
                        <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-700/80 shadow-xl z-[999] overflow-hidden text-xs py-1 animate-fade-in">
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
                                    onClick={() => { setIsProfileOpen(false); onLogout(); }}
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
    );
};
