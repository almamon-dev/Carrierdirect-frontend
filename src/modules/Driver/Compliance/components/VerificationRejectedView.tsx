import React from 'react';
import { AlertTriangle, Shield, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VerificationRejectedViewProps {
    rejectionReason?: string;
    onStartVerification: () => void;
    onClose: () => void;
    handleLogout: () => void;
}

export const VerificationRejectedView: React.FC<VerificationRejectedViewProps> = ({
    rejectionReason,
    onStartVerification,
    onClose,
    handleLogout,
}) => {
    return (
        <div className="w-full max-w-2xl mx-auto text-center py-2">
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

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-xl mx-auto">
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
    );
};
