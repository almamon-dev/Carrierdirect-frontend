import React from 'react';
import { Link } from 'react-router-dom';
import { User, Truck, LogOut, ChevronDown, Shield } from 'lucide-react';

interface AuthUser {
    name?: string;
    email?: string;
    user_type?: string;
    profile_picture?: string;
    role_name?: string;
}

interface DriverProfileMenuProps {
    authUser: AuthUser | null;
    isProfileOpen: boolean;
    setIsProfileOpen: (open: boolean) => void;
    profileRef: React.RefObject<HTMLDivElement | null>;
    complianceData: any;
    isVerified: boolean;
    verificationStatus: string;
    onOpenVerificationModal: () => void;
    onLockAssignedShipments: () => void;
    onLogout: () => void;
    initials: (name?: any) => string;
}

export const DriverProfileMenu: React.FC<DriverProfileMenuProps> = ({
    authUser,
    isProfileOpen,
    setIsProfileOpen,
    profileRef,
    complianceData,
    isVerified,
    verificationStatus,
    onOpenVerificationModal,
    onLockAssignedShipments,
    onLogout,
    initials
}) => {
    return (
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
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden xs:inline max-w-[80px] sm:max-w-[160px] truncate">
                    {authUser?.name || 'Commercial Driver'}
                </span>
                <ChevronDown size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
            </button>

            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e2329] rounded-[4px] shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[999] overflow-hidden text-xs font-medium animate-in fade-in-50 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-[#181a20]/50">
                        <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-[#ff4a1f] text-white flex items-center justify-center text-sm font-black shrink-0 overflow-hidden">
                            {authUser?.profile_picture ? (
                                <img src={authUser.profile_picture} alt={authUser?.name} className="w-full h-full object-cover" />
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
                        <button
                            type="button"
                            onClick={() => {
                                setIsProfileOpen(false);
                                onOpenVerificationModal();
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
                                        : 'bg-orange-100 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400'
                                }`}
                            >
                                {isVerified ? 'Verified' : verificationStatus === 'under_review' ? 'Under Review' : 'Action Needed'}
                            </span>
                        </button>

                        <Link
                            to="/driver/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <User size={15} className="text-slate-400 dark:text-slate-400" />
                            <span>Driver Profile</span>
                        </Link>

                        <Link
                            to={isVerified ? "/driver/shipments" : "#"}
                            onClick={(e) => {
                                setIsProfileOpen(false);
                                if (!isVerified) {
                                    e.preventDefault();
                                    onLockAssignedShipments();
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

                        <button
                            type="button"
                            onClick={() => { setIsProfileOpen(false); onLogout(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left font-bold cursor-pointer"
                        >
                            <LogOut size={15} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
