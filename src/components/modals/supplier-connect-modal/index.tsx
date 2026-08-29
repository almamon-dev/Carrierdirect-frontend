/**
 * SupplierAccountConnectModal Component
 * Premium, compact 2-column modal with click-outside and Escape key closing.
 * Alerts unverified or unconnected carriers that an active Stripe Connected Account /
 * Bank payout setup is required before placing legally binding freight bids.
 */

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
    ArrowRight,
    Building2,
    FileText,
    ShieldAlert,
    ShieldCheck,
    X,
    Zap
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
    description = "To submit competitive bids and receive customer escrow payments, you must connect your Stripe / Bank payout account.",
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

    const benefits = [
        {
            icon: ShieldCheck,
            title: "Escrow Secured Payouts",
            desc: "Direct payout clearance upon customer Proof of Delivery (POD) approval."
        },
        {
            icon: Building2,
            title: "Direct SEPA & IBAN",
            desc: "Automated European bank transfers directly to your corporate account."
        },
        {
            icon: Zap,
            title: "Instant Verification Badge",
            desc: "Boost your quote win rate by 40% with verified carrier status."
        },
        {
            icon: FileText,
            title: "Automated Tax Invoices",
            desc: "Download instant VAT-compliant credit notes and settlement receipts."
        }
    ];

    return createPortal(
        <div
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-fade-in font-sans"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2329] rounded-[4px] max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/60 dark:bg-[#181d24]">
                    <div className="flex items-center gap-3">

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {title}
                                </h3>
                                <Badge className="bg-[#ff4a1f] text-white border-none text-[10px] font-black px-1.5 py-0.2 rounded-[3px]">
                                    Required
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-relaxed max-w-md">
                                {description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-[3px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-4">
                    {/* Compact Alert Strip */}
                    <div className="p-3 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-500/30 rounded-[3px] flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2.5">
                            <ShieldAlert size={16} className="text-[#ff4a1f] shrink-0" />
                            <div>
                                <span className="text-slate-600 dark:text-slate-300 font-medium text-[11.5px] block">
                                    {requestId ? `Quote Request: ${requestId}` : 'Action Blocked'}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-[12px] block">
                                    Stripe Express Payout Setup Pending
                                </span>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#ff4a1f] whitespace-nowrap hidden sm:inline">
                            ~ 2 mins setup
                        </span>
                    </div>

                    {/* 2-Column Benefits Grid */}
                    <div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                            Why connect your payout account before bidding?
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {benefits.map((b, idx) => {
                                const Icon = b.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-[3px] bg-slate-50/70 dark:bg-[#181d24] border border-slate-100 dark:border-slate-800/80 flex items-start gap-2.5"
                                    >
                                        <div className="w-6 h-6 rounded-[3px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon size={13} strokeWidth={2.2} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[12px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                                {b.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                {b.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-1/2 h-9 text-xs font-semibold rounded-[3px] cursor-pointer"
                            onClick={() => {
                                onClose();
                                navigate('/supplier/quotes/requests');
                            }}
                        >
                            Back to Quote Requests
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-1/2 h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
