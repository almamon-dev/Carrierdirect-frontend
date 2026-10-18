import { TOKEN_CONFIG } from '@/config/auth';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerificationRejectedView } from './components/VerificationRejectedView';
import { VerificationUnderReviewView } from './components/VerificationUnderReviewView';
import { DriverComplianceModal } from './DriverComplianceModal';
import { DriverComplianceData } from './types';

interface Props {
    isOpen: boolean;
    status?: string;
    rejectionReason?: string;
    featureName?: string;
    canDismiss?: boolean;
    complianceData?: DriverComplianceData;
    onClose: () => void;
    onStartVerification?: () => void;
    onReloadStatus?: () => Promise<void> | void;
    onComplete?: (data?: any) => Promise<void> | void;
}

export const DriverVerificationRequiredModal: React.FC<Props> = ({
    isOpen,
    status = 'pending_setup',
    rejectionReason,
    canDismiss = false,
    complianceData,
    onClose,
    onStartVerification,
    onReloadStatus,
    onComplete,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshSuccess, setRefreshSuccess] = useState(false);
    const navigate = useNavigate();

    if (!isOpen || status === 'verified') return null;

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

    // ── IF UNDER REVIEW: Render Step 4 Admin Review layout ──
    if (status === 'under_review') {
        return (
            <VerificationUnderReviewView
                canDismiss={canDismiss}
                onClose={onClose}
                complianceData={complianceData}
                isRefreshing={isRefreshing}
                refreshSuccess={refreshSuccess}
                handleRefresh={handleRefresh}
                handleLogout={handleLogout}
            />
        );
    }

    // ── IF REJECTED: Render revision requested view ──
    if (status === 'rejected') {
        return (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs p-0 animate-in fade-in duration-300">
                <div className="fixed inset-0" onClick={canDismiss ? onClose : undefined} />
                <div className="bg-white dark:bg-[#181a20] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full max-w-[1360px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col h-auto max-h-[92vh] md:max-h-[88vh] relative z-10 font-sans mx-auto">
                    <button
                        type="button"
                        onClick={canDismiss ? onClose : undefined}
                        disabled={!canDismiss}
                        className="w-full pt-2.5 pb-2 flex items-center justify-center bg-white dark:bg-[#181a20] shrink-0 cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#1a1f26] transition-colors focus:outline-hidden"
                    >
                        <div className="w-14 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-[#FF4A1F] transition-all group-hover:w-20" />
                    </button>

                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#181a20] shrink-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60">
                                <AlertTriangle size={11} />
                                Action Required
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                Document Revision Requested by Admin
                            </span>
                        </div>
                        {canDismiss && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                                title="Close"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <div className="p-6 sm:p-8 overflow-y-auto">
                        <VerificationRejectedView
                            rejectionReason={rejectionReason}
                            onStartVerification={() => onStartVerification?.()}
                            onClose={onClose}
                            handleLogout={handleLogout}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ── OTHERWISE: directly render 3-step setup modal ──
    return (
        <DriverComplianceModal
            isOpen={isOpen}
            initialData={complianceData}
            canDismiss={canDismiss}
            onClose={onClose}
            onComplete={onComplete}
        />
    );
};
