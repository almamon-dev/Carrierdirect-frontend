import { Lock, Shield, X } from 'lucide-react';
import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onStartVerification: () => void;
    featureName?: string;
}

export const DriverVerificationRequiredModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onStartVerification,
    featureName = 'Dispatch Notifications & Shipments',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300 p-0">
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* 100% Full-Width Bottom Sheet Container */}
            <div className="bg-white dark:bg-[#1e2329] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out text-center pt-4 pb-10 px-6 sm:px-12 relative z-10">
                {/* Top Drag Handle Bar (Centered) */}
                <div className="pb-3 flex justify-center">
                    <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* Close X placed at Top-Right Corner of Full Width Screen */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 sm:right-8 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
                    title="Close"
                >
                    <X size={22} />
                </button>

                {/* Inner Content Centered */}
                <div className="max-w-xl mx-auto mt-2">
                    {/* Golden / Amber Lock Badge */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                        <div className="relative">
                            <Lock size={36} className="text-amber-500 stroke-[2.2]" />
                            <div className="absolute -bottom-1 -right-2 bg-amber-500 text-white rounded-full p-1 border-2 border-white dark:border-[#1e2329] shadow-xs">
                                <Shield size={12} className="stroke-[3]" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Driver Verification Required
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                        You must complete your mandatory compliance verification (Govt ID, CDL License & Medical Card) to access {featureName}.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-7 space-y-3 max-w-md mx-auto">
                        <button
                            type="button"
                            onClick={onStartVerification}
                            className="w-full py-3.5 px-6 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] cursor-pointer"
                        >
                            <Shield size={18} />
                            <span>Complete Verification (3 Steps)</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold transition-all active:scale-[0.99] cursor-pointer"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
