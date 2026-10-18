import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Building2,
    Calendar,
    Percent,
    TrendingUp,
    ShieldCheck,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

export interface CorporateNet30DrawerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyCreditLine?: () => void;
    actionButtonText?: string;
}

export const CorporateNet30DrawerModal: React.FC<CorporateNet30DrawerModalProps> = ({
    isOpen,
    onClose,
    onApplyCreditLine,
    actionButtonText = 'Apply for Credit Line',
}) => {
    // Prevent background scrolling when drawer is open
    useEffect(() => {
        if (!isOpen) return;
        const origOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = origOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end font-sans antialiased">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <div className="relative w-full max-w-[480px] sm:max-w-[500px] h-full bg-white dark:bg-[#18202a] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-250">
                {/* Header */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/60 dark:bg-[#141a22]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100/70 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-center text-[#ff4a1f] shrink-0 shadow-2xs">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    Corporate Net-30 Pay Later
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/90 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-900/60 shrink-0">
                                    B2B Credit
                                </span>
                            </div>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Deferred logistics invoicing for verified corporate shippers.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                        aria-label="Close drawer"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 text-slate-800 dark:text-slate-100 text-xs">
                    {/* Section intro */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Why choose Net-30?
                        </h4>
                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Get the flexibility to book now and pay later with a single 30-day invoice.
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-4">
                        {/* 1. 30-Day Invoicing */}
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-500 shrink-0 shadow-2xs mt-0.5">
                                <Calendar size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    30-Day Invoicing
                                </h5>
                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Book orders immediately without upfront card holds. A single invoice is issued with 30 days to settle.
                                </p>
                            </div>
                        </div>

                        {/* 2. 0% Financing Cost */}
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-500 shrink-0 shadow-2xs mt-0.5">
                                <Percent size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    0% Financing Cost
                                </h5>
                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Zero interest fees or financing surcharges when settled on time within the standard 30-day term.
                                </p>
                            </div>
                        </div>

                        {/* 3. Up to €80,000 Credit */}
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-500 shrink-0 shadow-2xs mt-0.5">
                                <TrendingUp size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Up to €80,000 Credit
                                </h5>
                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Revolving credit limits configured to your shipping velocity. Can be adjusted anytime upon request.
                                </p>
                            </div>
                        </div>

                        {/* 4. Fast Underwriting */}
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center text-purple-500 shrink-0 shadow-2xs mt-0.5">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Fast Underwriting
                                </h5>
                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Applications are reviewed within 24 business hours. Approved limits apply instantly to future checkouts.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How to get or expand your Pay Later credit callout box */}
                    <div className="bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#b93815] dark:text-orange-400">
                            <Sparkles size={15} className="text-[#ff4a1f] shrink-0" />
                            <span>How to get or expand your Pay Later credit:</span>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5 text-[11.5px] text-slate-600 dark:text-slate-300">
                                <span className="w-4 h-4 rounded-full bg-[#ff4a1f] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                    1
                                </span>
                                <div className="leading-relaxed">
                                    <strong className="font-bold text-slate-900 dark:text-slate-100">Growth Logistics Subscription:</strong> Requires an active Growth Logistics or Enterprise plan.
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 text-[11.5px] text-slate-600 dark:text-slate-300">
                                <span className="w-4 h-4 rounded-full bg-[#ff4a1f] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                    2
                                </span>
                                <div className="leading-relaxed">
                                    <strong className="font-bold text-slate-900 dark:text-slate-100">Business Verification:</strong> Registered company registration number and Tax / VAT ID.
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 text-[11.5px] text-slate-600 dark:text-slate-300">
                                <span className="w-4 h-4 rounded-full bg-[#ff4a1f] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                    3
                                </span>
                                <div className="leading-relaxed">
                                    <strong className="font-bold text-slate-900 dark:text-slate-100">Backup Payment Card:</strong> Saved corporate card on file for automated off-session compliance.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#18202a] flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 min-h-[40px] px-5 py-2.5 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 shadow-2xs"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            if (onApplyCreditLine) onApplyCreditLine();
                        }}
                        className="h-10 min-h-[40px] px-5 py-2.5 rounded-[4px] bg-[#ff4a1f] hover:bg-[#e03d15] text-xs font-bold text-white inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
                    >
                        <span>{actionButtonText}</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CorporateNet30DrawerModal;
