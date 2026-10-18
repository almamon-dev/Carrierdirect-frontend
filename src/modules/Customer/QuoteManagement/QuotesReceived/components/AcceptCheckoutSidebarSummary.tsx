import React from 'react';
import { Truck, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button';
import { AcceptCheckoutTrustFooter } from './AcceptCheckoutTrustFooter';

export interface AcceptCheckoutSidebarSummaryProps {
    quote: any;
    paymentOption: "pay_now" | "pay_later";
    agreedTerms: boolean;
    setAgreedTerms: (val: boolean) => void;
    isProcessing: boolean;
    handleConfirmBooking: (e: React.FormEvent) => void;
}

export const AcceptCheckoutSidebarSummary: React.FC<AcceptCheckoutSidebarSummaryProps> = ({
    quote,
    paymentOption,
    agreedTerms,
    setAgreedTerms,
    isProcessing,
    handleConfirmBooking,
}) => {
    return (
        <div className="sticky top-20 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-5 shadow-sm space-y-4 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Truck size={15} className="text-[#ff4a1f]" />
                        <span>Booking Summary</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] block mt-0.5">
                        {quote.supplier}
                    </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {quote.pickupCity} ➔ {quote.deliveryCity}
                </span>
            </div>

            {/* Price Breakdown Line Items */}
            <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Base Freight Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        €{Number(quote.baseFreightAmount).toLocaleString()}
                    </span>
                </div>

                {quote.extraCharges && quote.extraCharges.map((charge: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                            {charge.custom_name || charge.type}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            +€{Number(charge.amount).toLocaleString()}
                        </span>
                    </div>
                ))}

                {quote.insuranceAmount > 0 && (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Cargo Insurance</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            +€{quote.insuranceAmount.toLocaleString()}
                        </span>
                    </div>
                )}

                {quote.platformFee > 0 ? (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 truncate max-w-[190px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            Platform Service Fee {quote.platformFeePercent > 0 ? `(${quote.platformFeePercent}%)` : ""}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            +€{Number(quote.platformFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            Platform Escrow Fee
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            €0.00 (Included)
                        </span>
                    </div>
                )}

                {quote.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Discount / Promo</span>
                        <span>-€{quote.discountAmount.toLocaleString()}</span>
                    </div>
                )}

                {/* Total Escrow Amount */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Total Escrow Amount
                        </span>
                        <span className="text-xl font-black text-[#ff4a1f] tracking-tight">
                            €{quote.totalAmount.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        All taxes &amp; platform escrow protection included.
                    </span>
                </div>
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 rounded-[3px] flex items-start gap-2.5">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/60 rounded-[3px] text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                    <ShieldCheck size={14} />
                </div>
                <div className="text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        100% Escrow Protection
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                        Funds are held securely in escrow. Carrier is only paid after proof of delivery approval.
                    </span>
                </div>
            </div>

            {/* Terms Agreement Checkbox & Submit Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2">
                    <input
                        id="checkout-agree-terms"
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-[#ff4a1f] accent-[#ff4a1f] border-slate-300 rounded-[3px] cursor-pointer shrink-0"
                    />
                    <label
                        htmlFor="checkout-agree-terms"
                        className="text-[11.5px] text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
                    >
                        I agree to CarrierDirect{" "}
                        <Link
                            to="/support/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#ff4a1f] hover:underline font-bold"
                        >
                            Terms &amp; Conditions
                        </Link>{" "}
                        &amp; authorize booking.
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!agreedTerms || isProcessing}
                    isLoading={isProcessing}
                    className="w-full h-11 text-xs sm:text-sm font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 rounded-[3px] transition-all disabled:opacity-50"
                >
                    <Lock size={14} />
                    <span>
                        {paymentOption === "pay_later"
                            ? `Confirm Net-30 Booking (€${quote.totalAmount.toLocaleString()})`
                            : `Confirm & Authorize €${quote.totalAmount.toLocaleString()}`}
                    </span>
                </Button>
            </form>

            <AcceptCheckoutTrustFooter />
        </div>
    );
};
