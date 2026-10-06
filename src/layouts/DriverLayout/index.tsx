import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Truck, LogOut, ChevronDown, Shield } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '@/components/GlobalSearch';
import HeaderNotifications from '@/components/HeaderNotifications';
import HeaderMessages from '@/components/HeaderMessages';
import { useUserHeartbeat } from '@/hooks/useUserHeartbeat';
import { TOKEN_CONFIG } from '@/config/auth';
import {
    useDriverCompliance,
    DriverComplianceModal,
    DriverVerificationRequiredModal,
} from '@/modules/Driver/Compliance';

function getAuthUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (!raw) return { name: 'Commercial Driver', email: '', user_type: 'driver' };
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
            return { name: 'Commercial Driver', email: '', user_type: 'driver' };
        }
        return parsed;
    } catch {
        return { name: 'Commercial Driver', email: '', user_type: 'driver' };
    }
}

function initials(name?: any): string {
    if (!name || typeof name !== 'string') return 'D';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('');
}

const RouteLoadingFallback = () => {
    return (
        <div className="p-3 sm:p-4 md:p-5 w-full mx-auto space-y-4 animate-in fade-in duration-150">
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
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-none">
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

export default function DriverLayout() {
    useUserHeartbeat(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [authUser, setAuthUser] = useState(getAuthUser);
    const [isScrolled, setIsScrolled] = useState(false);

    const {
        isVerified,
        verificationStatus,
        complianceData,
        isLoading,
        reloadCompliance,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLockPromptOpen,
        setIsLockPromptOpen,
        completeCompliance,
    } = useDriverCompliance();

    const location = useLocation();
    const isChatRoute = location.pathname.includes('/chat') || location.pathname.includes('/messages');
    const navigate = useNavigate();

    const profileRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    const [lockFeature, setLockFeature] = useState<string>('Dispatch Notifications & Load Actions');

    // Calculate current route label for Header Title
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentModuleLabel = pathParts[1] ? pathParts[1].replace(/-/g, ' ') : 'Dashboard';

    // Global listener for opening compliance or lock modal from anywhere
    useEffect(() => {
        const handleOpenCompliance = () => setIsVerificationModalOpen(true);
        const handleOpenLock = (e: any) => {
            if (e.detail?.featureName) {
                setLockFeature(e.detail.featureName);
            }
            setIsLockPromptOpen(true);
        };

        window.addEventListener('open-driver-compliance', handleOpenCompliance);
        window.addEventListener('open-driver-lock-prompt', handleOpenLock as EventListener);
        return () => {
            window.removeEventListener('open-driver-compliance', handleOpenCompliance);
            window.removeEventListener('open-driver-lock-prompt', handleOpenLock as EventListener);
        };
    }, [setIsVerificationModalOpen, setIsLockPromptOpen]);

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

    // Sync auth user on storage change
    useEffect(() => {
        const sync = () => setAuthUser(getAuthUser());
        window.addEventListener('storage', sync);
        window.addEventListener('user-profile-updated', sync);
        window.addEventListener('driver-profile-updated', sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('user-profile-updated', sync);
            window.removeEventListener('driver-profile-updated', sync);
        };
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

    const isUnverifiedBlocked = !isLoading && !isVerified && location.pathname !== '/driver/profile';
    const showLockModal = isUnverifiedBlocked || isLockPromptOpen;

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#12161c] overflow-hidden">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Navigation Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header
                    className={`h-16 bg-white dark:bg-[#12161c] flex items-center justify-between px-4 sm:px-6 z-40 relative shrink-0 transition-all duration-300 ${
                        isScrolled
                            ? 'border-b border-slate-200 dark:border-slate-800 shadow-sm'
                            : 'border-b border-transparent shadow-none'
                    }`}
                >
                    {/* Left: Sidebar Toggle, Section Title & Search */}
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-600 dark:text-slate-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors cursor-pointer"
                            aria-label="Toggle Navigation"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                        </button>

                        {/* Module Title */}
                        <div className="hidden lg:flex items-center gap-2.5">
                            <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 capitalize tracking-wide">
                                {currentModuleLabel}
                            </h1>
                            {/* Verification Chip Status in Header */}
                            <span
                                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                                    isVerified
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60'
                                        : verificationStatus === 'under_review'
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60'
                                        : verificationStatus === 'rejected'
                                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60'
                                        : 'bg-orange-50 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/60'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : verificationStatus === 'under_review' ? 'bg-amber-500 animate-pulse' : 'bg-[#FF4A1F]'}`} />
                                {isVerified ? 'Verified' : verificationStatus === 'under_review' ? 'Under Review' : verificationStatus === 'rejected' ? 'Revision Needed' : 'Unverified'}
                            </span>
                        </div>

                        {/* Search Bar matching Supplier layout */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center bg-gray-50 dark:bg-[#1e2329] px-4 py-2 rounded-full w-[280px] border border-gray-200 dark:border-slate-700/80 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:bg-white dark:hover:bg-[#252b33] transition-colors text-left group cursor-pointer"
                        >
                            <Search size={16} className="text-gray-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                            <span className="text-[13px] text-gray-400 dark:text-slate-400 w-full group-hover:text-gray-600 dark:group-hover:text-slate-200 truncate">Search loads, jobs...</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-auto border border-gray-300 dark:border-slate-700">⌘K</span>
                        </button>
                    </div>

                    {/* Right: Actions, Notifications & Profile */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Direct Notification Popovers */}
                        <HeaderNotifications role="driver" />
                        <HeaderMessages role="driver" />

                        {/* Driver Profile Dropdown Pill matching Supplier */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-xs overflow-hidden">
                                    {authUser?.profile_picture ? (
                                        <img
                                            src={authUser.profile_picture}
                                            alt={authUser?.name || 'Driver'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : authUser?.name ? (
                                        initials(authUser.name)
                                    ) : (
                                        <User size={14} />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] sm:max-w-[160px] truncate">
                                    {authUser?.name || 'Commercial Driver'}
                                </span>
                                <ChevronDown size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                            </button>

                            {/* Dropdown Menu matching Supplier Layout */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e2329] rounded-[4px] shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[999] overflow-hidden text-xs font-medium animate-in fade-in-50 duration-100">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-[#181a20]/50">
                                        <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-[#ff4a1f] text-white flex items-center justify-center text-sm font-black shrink-0 overflow-hidden">
                                            {authUser?.profile_picture ? (
                                                <img
                                                    src={authUser.profile_picture}
                                                    alt={authUser?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                initials(authUser?.name)
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">{String(authUser?.name || 'Commercial Driver')}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{String(authUser?.email || '')}</p>
                                            <span className="inline-block mt-1 text-[10px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-[#ff4a1f]/15 border border-orange-200/60 dark:border-orange-800/60 px-2 py-0.5 rounded-[3px]">
                                                {complianceData?.licenseClass ? `CDL Driver (${complianceData.licenseClass})` : (authUser?.role_name || 'Commercial Fleet Driver')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        {/* Compliance Status Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setIsVerificationModalOpen(true);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-[3px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-left border border-slate-200/60 dark:border-slate-700/60 mb-1"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className={isVerified ? "text-emerald-500" : verificationStatus === "under_review" ? "text-amber-500" : "text-[#FF4A1F]"} />
                                                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">Compliance Status</span>
                                            </div>
                                            <span
                                                className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap ${
                                                    isVerified
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                        : verificationStatus === 'under_review'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                                        : verificationStatus === 'rejected'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                                        : 'bg-orange-100 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400'
                                                }`}
                                            >
                                                {isVerified ? 'Verified' : verificationStatus === 'under_review' ? 'Under Review' : verificationStatus === 'rejected' ? 'Action Needed' : 'Action Needed'}
                                            </span>
                                        </button>

                                        {/* Driver Profile Link */}
                                        <Link
                                            to="/driver/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            <User size={15} className="text-slate-400 dark:text-slate-400" />
                                            <span>Driver Profile</span>
                                        </Link>

                                        {/* Assigned Shipments */}
                                        <Link
                                            to={isVerified ? "/driver/shipments" : "#"}
                                            onClick={(e) => {
                                                setIsProfileOpen(false);
                                                if (!isVerified) {
                                                    e.preventDefault();
                                                    setLockFeature("Assigned Shipments");
                                                    setIsLockPromptOpen(true);
                                                }
                                            }}
                                            className="flex items-center justify-between px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Truck size={15} className="text-slate-400 dark:text-slate-400" />
                                                <span>Assigned Shipments</span>
                                            </div>
                                            {!isVerified && <Shield size={12} className="text-amber-500" />}
                                        </Link>

                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                        {/* Logout */}
                                        <button
                                            type="button"
                                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left font-bold cursor-pointer"
                                        >
                                            <LogOut size={15} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main
                    ref={mainRef}
                    className={`flex-1 ${
                        isChatRoute ? 'overflow-hidden h-[calc(100vh-64px)]' : 'overflow-y-auto overflow-x-hidden'
                    } bg-[#f8fafc] dark:bg-[#12161c] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
                >
                    <React.Suspense fallback={<RouteLoadingFallback />}>
                        <div className={`w-full ${isChatRoute ? 'h-full pb-0' : 'pb-16'}`}>
                            <Outlet />
                        </div>
                    </React.Suspense>
                </main>
            </div>

            {/* Lock Prompt Bottom Sheet */}
            <DriverVerificationRequiredModal
                isOpen={showLockModal}
                status={verificationStatus}
                rejectionReason={complianceData?.rejectionReason}
                featureName={lockFeature}
                canDismiss={!isUnverifiedBlocked}
                onClose={() => setIsLockPromptOpen(false)}
                onStartVerification={() => {
                    setIsLockPromptOpen(false);
                    setIsVerificationModalOpen(true);
                }}
                onReloadStatus={reloadCompliance}
            />

            {/* 3-Step Driver Compliance Bottom Sheet */}
            <DriverComplianceModal
                isOpen={isVerificationModalOpen}
                initialData={complianceData}
                onClose={() => setIsVerificationModalOpen(false)}
                onComplete={completeCompliance}
            />

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
