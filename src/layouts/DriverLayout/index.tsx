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
                {/* Clean Flat Header */}
                <header
                    className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 transition-all duration-200 ${
                        isScrolled
                            ? 'bg-white dark:bg-[#12161c] border-b border-slate-200/80 dark:border-slate-800'
                            : 'bg-white dark:bg-[#12161c] border-b border-slate-100 dark:border-slate-800/80'
                    }`}
                >
                    {/* Left: Sidebar Toggle & Section Title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 rounded-[4px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Toggle Navigation"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                {currentModuleLabel}
                            </span>
                            {/* Verification Chip Status in Header */}
                            <span
                                className={`hidden sm:inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
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
                    </div>

                    {/* Right: Actions, Notifications & Profile */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                        {/* Global Search Trigger */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors cursor-pointer"
                            title="Quick Search (Ctrl+K)"
                        >
                            <Search size={18} />
                        </button>

                        {/* Direct Notification Popovers */}
                        <HeaderNotifications role="driver" />
                        <HeaderMessages role="driver" />

                        {/* Driver Profile Dropdown */}
                        <div className="relative ml-1" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                <div className="w-8 h-8 rounded-[4px] bg-[#FF4A1F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {authUser?.profile_picture ? (
                                        <img
                                            src={authUser.profile_picture}
                                            alt={authUser?.name || 'Driver'}
                                            className="w-full h-full object-cover rounded-[4px]"
                                        />
                                    ) : (
                                        initials(authUser?.name)
                                    )}
                                </div>
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                        {String(authUser?.name || 'Commercial Driver')}
                                    </span>
                                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 capitalize">
                                        {isVerified ? 'FMCSA Verified' : verificationStatus === 'under_review' ? 'Under Review' : 'Action Needed'}
                                    </span>
                                </div>
                                <ChevronDown size={14} className="text-slate-400 ml-0.5" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs z-50 animate-in fade-in-50 duration-100">
                                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-[4px] bg-[#FF4A1F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                            {authUser?.profile_picture ? (
                                                <img
                                                    src={authUser.profile_picture}
                                                    alt={authUser?.name}
                                                    className="w-full h-full object-cover rounded-[4px]"
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

                                    <div className="p-2 space-y-1">
                                        {/* Compliance Status Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setIsVerificationModalOpen(true);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-left border border-slate-200/60 dark:border-slate-700/60"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Shield size={15} className={isVerified ? "text-emerald-500" : verificationStatus === "under_review" ? "text-amber-500" : "text-[#FF4A1F]"} />
                                                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">Compliance Status</span>
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                                    isVerified
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                                                        : verificationStatus === 'under_review'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                                                        : verificationStatus === 'rejected'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                                                        : 'bg-orange-100 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60'
                                                }`}
                                            >
                                                {isVerified ? 'Verified' : verificationStatus === 'under_review' ? 'Under Review' : verificationStatus === 'rejected' ? 'Revision Needed' : 'Action Needed'}
                                            </span>
                                        </button>

                                        {/* Driver Profile Link (Never blocked) */}
                                        <Link
                                            to="/driver/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                                            className="flex items-center justify-between px-3 py-2 rounded-[4px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left font-bold cursor-pointer"
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
