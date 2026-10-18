import React from 'react';
import { Search } from 'lucide-react';
import HeaderNotifications from '@/components/HeaderNotifications';
import HeaderMessages from '@/components/HeaderMessages';
import { DriverProfileMenu } from './DriverProfileMenu';

interface AuthUser {
    name?: string;
    email?: string;
    user_type?: string;
    profile_picture?: string;
    role_name?: string;
}

interface DriverHeaderProps {
    isScrolled: boolean;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    currentModuleLabel: string;
    isVerified: boolean;
    verificationStatus: string;
    onOpenSearch: () => void;
    authUser: AuthUser | null;
    isProfileOpen: boolean;
    setIsProfileOpen: (open: boolean) => void;
    profileRef: React.RefObject<HTMLDivElement | null>;
    complianceData: any;
    onOpenVerificationModal: () => void;
    onLockAssignedShipments: () => void;
    onLogout: () => void;
    initials: (name?: any) => string;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
    isScrolled,
    isSidebarOpen,
    onToggleSidebar,
    currentModuleLabel,
    isVerified,
    verificationStatus,
    onOpenSearch,
    authUser,
    isProfileOpen,
    setIsProfileOpen,
    profileRef,
    complianceData,
    onOpenVerificationModal,
    onLockAssignedShipments,
    onLogout,
    initials
}) => {
    return (
        <header
            className={`h-16 bg-white dark:bg-[#12161c] flex items-center justify-between px-4 sm:px-6 z-40 relative shrink-0 transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'border-b border-transparent shadow-none'
            }`}
        >
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle Navigation"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h10M4 18h16" />
                    </svg>
                </button>

                <div className="hidden lg:flex items-center gap-2.5">
                    <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 capitalize tracking-wide">
                        {currentModuleLabel}
                    </h1>
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

                <button
                    type="button"
                    onClick={onOpenSearch}
                    aria-label="Open search"
                    className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <Search size={18} />
                </button>

                <button
                    type="button"
                    onClick={onOpenSearch}
                    className="hidden md:flex items-center bg-gray-50 dark:bg-[#1e2329] px-4 py-2 rounded-full w-[280px] border border-gray-200 dark:border-slate-700/80 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:bg-white dark:hover:bg-[#252b33] transition-colors text-left group cursor-pointer"
                >
                    <Search size={16} className="text-gray-400 dark:text-slate-500 mr-2 shrink-0 group-hover:text-[#ff4a1f]" />
                    <span className="text-[13px] text-gray-400 dark:text-slate-400 w-full group-hover:text-gray-600 dark:group-hover:text-slate-200 truncate">Search loads, jobs...</span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 bg-gray-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-auto border border-gray-300 dark:border-slate-700">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-4">
                <HeaderNotifications role="driver" />
                <HeaderMessages role="driver" />

                <DriverProfileMenu
                    authUser={authUser}
                    isProfileOpen={isProfileOpen}
                    setIsProfileOpen={setIsProfileOpen}
                    profileRef={profileRef}
                    complianceData={complianceData}
                    isVerified={isVerified}
                    verificationStatus={verificationStatus}
                    onOpenVerificationModal={onOpenVerificationModal}
                    onLockAssignedShipments={onLockAssignedShipments}
                    onLogout={onLogout}
                    initials={initials}
                />
            </div>
        </header>
    );
};
