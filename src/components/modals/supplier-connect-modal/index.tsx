/**
 * SupplierAccountConnectModal Component
 * Compact, modern modal with clean typography and click-outside/Escape handling.
 * Alerts suppliers that an active Stripe/Bank payout setup is required before placing bids.
 */

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
    ArrowRight,
    CreditCard,
    ShieldAlert,
    X
} from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export interface SupplierAccountConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    requestId?: string;
}

export default function SupplierAccountConnectModal({
    isOpen,
    onClose,
    title = "Payout Account Connection Required",
    description = "To submit bids and receive escrow payouts, please connect your Stripe payout account.",
    requestId,
}: SupplierAccountConnectModalProps) {
    const navigate = useNavigate();

    // Close on Escape key press
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConnectClick = () => {
        onClose();
        navigate('/supplier/finance/withdrawal');
    };

    const steps = [
        {
            number: 1,
            title: "Connect Stripe / Bank Account",
            desc: "Link your verified IBAN or business bank account via Stripe Express in ~2 mins."
        },
        {
            number: 2,
            title: "Instant Carrier Verification",
            desc: "Unlock verified carrier status and customer escrow payment protection."
        },
        {
            number: 3,
            title: "Submit Quotes & Receive Escrow Payouts",
            desc: "Place binding bids and receive automated payout clearance upon POD delivery."
        }
    ];

    return createPortal(
        <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[99999] animate-fade-in font-sans"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2329] rounded-[5px] max-w-[460px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/60 dark:bg-[#181d24]">
                    <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <CreditCard size={16} strokeWidth={2.2} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-[13.5px] sm:text-[14px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                                    {title}
                                </h3>
                                <Badge className="bg-[#ff4a1f]/10 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] border border-[#ff4a1f]/20 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                                    Required
                                </Badge>
                            </div>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-3.5 sm:p-4 space-y-3">
                    {/* Status Alert Bar */}
                    <div className="px-3 py-2 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-500/30 rounded-[3px] flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <ShieldAlert size={14} className="text-[#ff4a1f] shrink-0" />
                            <div className="truncate">
                                <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-200">
                                    Stripe Express Payout Pending
                                </span>
                                {requestId && (
                                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 ml-1.5 font-normal">
                                        (RFQ: {requestId})
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className="text-[10px] font-semibold text-[#ff4a1f] bg-white/80 dark:bg-[#181d24] px-1.5 py-0.5 rounded-[2px] border border-orange-200/60 dark:border-orange-500/20 whitespace-nowrap shrink-0">
                            ~2 min setup
                        </span>
                    </div>

                    {/* 3-Step Setup Stepper */}
                    <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
                            How it works (3-Step Setup):
                        </span>
                        <div className="space-y-0 relative pl-0.5">
                            {steps.map((step, idx) => (
                                <div key={step.number} className="flex items-start gap-3 relative pb-3.5 last:pb-0">
                                    {/* Connector line between steps */}
                                    {idx < steps.length - 1 && (
                                        <div className="absolute left-[11px] top-6 bottom-0 w-[1.5px] bg-slate-200 dark:bg-slate-700" />
                                    )}
                                    {/* Number Circle (1, 2, 3) */}
                                    <div className="w-[23px] h-[23px] rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#181d24] text-slate-800 dark:text-slate-100 text-[11px] font-bold flex items-center justify-center shrink-0 z-10 shadow-2xs">
                                        {step.number}
                                    </div>
                                    {/* Step Content */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                            {step.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            className="h-10 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 rounded-[5px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                            onClick={() => {
                                onClose();
                                navigate('/supplier/quotes/requests');
                            }}
                        >
                            Back to Requests
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 h-10 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[5px] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                            onClick={handleConnectClick}
                        >
                            <span>Connect Stripe Now</span>
                            <ArrowRight size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
