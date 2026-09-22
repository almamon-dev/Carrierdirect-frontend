import { Lock, Shield, X, Clock, AlertTriangle, CheckCircle2, RotateCw, ExternalLink, LogOut, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TOKEN_CONFIG } from "@/config/auth";

interface Props {
    isOpen: boolean;
    status?: string;
    rejectionReason?: string;
    featureName?: string;
    canDismiss?: boolean;
    onClose: () => void;
    onStartVerification: () => void;
    onReloadStatus?: () => Promise<void> | void;
}

export const DriverVerificationRequiredModal: React.FC<Props> = ({
    isOpen,
    status = "pending_setup",
    rejectionReason,
    featureName = "Shipments & Fleet Operations",
    canDismiss = false,
    onClose,
    onStartVerification,
    onReloadStatus,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshSuccess, setRefreshSuccess] = useState(false);
    const navigate = useNavigate();

    if (!isOpen || status === "verified") return null;

    const handleRefresh = async () => {
        if (!onReloadStatus) return;
        setIsRefreshing(true);
        setRefreshSuccess(false);
        try {
            await onReloadStatus();
            setRefreshSuccess(true);
            setTimeout(() => setRefreshSuccess(false), 3000);
        } finally {
            setTimeout(() => setIsRefreshing(false), 600);
        }
    };

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

    const isUnderReview = status === "under_review";
    const isRejected = status === "rejected";

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-300 p-0">
            {/* Backdrop click dismiss only if canDismiss is true */}
            <div
                className="fixed inset-0"
                onClick={canDismiss ? onClose : undefined}
            />

            {/* Bottom Sheet Container */}
            <div className="bg-white dark:bg-[#1e2329] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out text-center pt-4 pb-10 px-6 sm:px-12 relative z-10 h-auto max-h-[92vh] overflow-y-auto">
                {/* Top Drag Handle Bar (Centered) */}
                <div className="pb-3 flex justify-center">
                    <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* Close X (only visible if dismissible) */}
                {canDismiss && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-6 sm:right-8 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
                        title="Close"
                    >
                        <X size={22} />
                    </button>
                )}

                {/* Inner Content Centered */}
                <div className="max-w-xl mx-auto mt-2 text-left sm:text-center">
                    {/* CASE 1: UNDER REVIEW (Awaiting Admin Approval) */}
                    {isUnderReview && (
                        <div>
                            <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                                <Clock size={36} className="text-amber-500 stroke-[2.2] animate-pulse" />
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full mb-2">
                                <Clock size={13} />
                                <span>Verification Under Review (~ 24-48 Hours)</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                                Documents Submitted & Awaiting Admin Approval
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto text-center leading-relaxed">
                                Your CDL license, DOT medical card, and equipment dossier are currently being reviewed by CarrierDirect compliance admins.
                            </p>

                            {/* Status Steps */}
                            <div className="mt-5 bg-slate-50 dark:bg-[#161a22] border border-slate-200/80 dark:border-slate-800 rounded-lg p-3.5 space-y-2.5 text-xs text-left max-w-md mx-auto">
                                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span>1. CDL License & Endorsements</span>
                                    </div>
                                    <span className="text-[11px] font-bold">Submitted</span>
                                </div>
                                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span>2. DOT Medical Card Details</span>
                                    </div>
                                    <span className="text-[11px] font-bold">Submitted</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold border-t border-slate-200/60 dark:border-slate-800 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="animate-spin-slow" />
                                        <span>3. Administrator Compliance Verification</span>
                                    </div>
                                    <span className="text-[11px] bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">In Progress (Up to 48h)</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="w-full sm:w-auto flex-1 py-3 px-5 bg-white dark:bg-[#161a22] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <RotateCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                                    <span>{isRefreshing ? "Checking Status..." : refreshSuccess ? "Checked - Still Under Review" : "Check Live Status"}</span>
                                </button>
                                <Link
                                    to="/driver/profile"
                                    onClick={onClose}
                                    className="w-full sm:w-auto flex-1 py-3 px-5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <User size={14} />
                                    <span>View My Profile</span>
                                </Link>
                            </div>

                            <div className="mt-3 text-center">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-xs text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <LogOut size={12} />
                                    <span>Logout from Account</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CASE 2: REJECTED (Revision Requested) */}
                    {isRejected && (
                        <div>
                            <div className="mx-auto w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
                                <AlertTriangle size={36} className="text-rose-500 stroke-[2.2]" />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight text-center">
                                Document Revision Requested
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 text-center">
                                The administrator requested a revision on your submitted verification documents.
                            </p>

                            {rejectionReason && (
                                <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded text-xs text-rose-800 dark:text-rose-200 text-left">
                                    <strong className="block mb-1 text-rose-900 dark:text-rose-100">Reason / Notes from Admin:</strong>
                                    {rejectionReason}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                                <button
                                    type="button"
                                    onClick={onStartVerification}
                                    className="w-full py-3.5 px-6 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                                >
                                    <Shield size={16} />
                                    <span>Update Documents & Resubmit</span>
                                </button>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                                <Link
                                    to="/driver/profile"
                                    onClick={onClose}
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1"
                                >
                                    <User size={12} />
                                    <span>View My Profile</span>
                                </Link>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <LogOut size={12} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CASE 3: PENDING SETUP (Needs initial 3-step setup) */}
                    {!isUnderReview && !isRejected && (
                        <div>
                            <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                                <div className="relative">
                                    <Lock size={36} className="text-amber-500 stroke-[2.2]" />
                                    <div className="absolute -bottom-1 -right-2 bg-amber-500 text-white rounded-full p-1 border-2 border-white dark:border-[#1e2329] shadow-xs">
                                        <Shield size={12} className="stroke-[3]" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                                Driver Verification Required
                            </h2>

                            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed text-center">
                                You must complete your mandatory compliance verification (Govt ID, CDL License & Medical Card) to access {featureName}.
                            </p>

                            <div className="mt-7 space-y-3 max-w-md mx-auto">
                                <button
                                    type="button"
                                    onClick={onStartVerification}
                                    className="w-full py-3.5 px-6 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] cursor-pointer"
                                >
                                    <Shield size={18} />
                                    <span>Complete Verification (3 Steps)</span>
                                </button>

                                {canDismiss ? (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold transition-all active:scale-[0.99] cursor-pointer"
                                    >
                                        Maybe Later
                                    </button>
                                ) : (
                                    <Link
                                        to="/driver/profile"
                                        onClick={onClose}
                                        className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                    >
                                        <User size={14} />
                                        <span>View My Profile</span>
                                    </Link>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-xs text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <LogOut size={12} />
                                    <span>Logout from Account</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
