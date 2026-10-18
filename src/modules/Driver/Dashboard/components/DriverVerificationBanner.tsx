import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DriverVerificationBannerProps {
    isVerified: boolean;
    verificationStatus: string;
    rejectionReason?: string;
    isCheckingStatus: boolean;
    onRefreshStatus: () => void;
    onOpenVerificationModal: () => void;
}

export const DriverVerificationBanner: React.FC<DriverVerificationBannerProps> = ({
    isVerified,
    verificationStatus,
    rejectionReason,
    isCheckingStatus,
    onRefreshStatus,
    onOpenVerificationModal,
}) => {
    if (isVerified) return null;

    if (verificationStatus === 'under_review') {
        return (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-700/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Driver Verification Under Review (Admin Approval in Progress)
                            </h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10.5px] font-bold rounded">
                                ~ 24-48 Hours
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            Your commercial credentials and DOT medical documents have been submitted to carrier dispatch compliance team. Verification takes up to <strong>48 hours</strong>. Once approved by the administrator, active dispatch assignments will be unlocked.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                        type="button"
                        onClick={onRefreshStatus}
                        disabled={isCheckingStatus}
                        className="px-3 py-1.5 bg-white dark:bg-[#1e2329] hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <Clock size={13} className={isCheckingStatus ? 'animate-spin text-[#ff4a1f]' : 'text-slate-500'} />
                        <span>{isCheckingStatus ? 'Checking...' : 'Refresh Status'}</span>
                    </button>
                </div>
            </div>
        );
    }

    if (verificationStatus === 'rejected') {
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Verification Review Notice - Document Action Required
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Administrator Note:{' '}
                            <span className="font-semibold text-red-600 dark:text-red-300">
                                &quot;{rejectionReason || 'Please review and re-upload submitted document photos.'}&quot;
                            </span>
                        </p>
                    </div>
                </div>
                <Link
                    to="/driver/profile"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shrink-0 self-end sm:self-auto cursor-pointer"
                >
                    Fix Documents & Resubmit
                </Link>
            </div>
        );
    }

    if (verificationStatus === 'pending_setup') {
        return (
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ff4a1f] flex items-center justify-center shrink-0">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Complete Your Driver Profile & Verification
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Submit your commercial CDL license and DOT medical certificate to start accepting dispatches.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenVerificationModal}
                    className="px-4 py-1.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white rounded text-xs font-bold shrink-0 self-end sm:self-auto cursor-pointer"
                >
                    Start Verification (3 Steps)
                </button>
            </div>
        );
    }

    return null;
};
