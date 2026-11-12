import React from 'react';
import { ShieldCheck, Star, MessageSquare, Building, CheckCircle2, Clock, MapPin, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/button';

interface SupplierCustomerProfileProps {
    customer: {
        id?: number | string;
        name: string;
        companyName: string;
        avatar?: string;
        verified: boolean;
        rating: number;
        reviews: number;
        active: string;
        memberSince: string;
        completedOrders: number;
        location?: string;
        paymentRecord?: string;
        payoutTerms?: string;
    };
    onOpenChat?: () => void;
    compact?: boolean;
}

export const SupplierCustomerProfile: React.FC<SupplierCustomerProfileProps> = ({
    customer,
    onOpenChat,
    compact = true,
}) => {
    const custName = customer?.companyName || customer?.name || 'Customer Co 1';
    const rating = typeof customer?.rating === 'number' && customer.rating > 0 ? customer.rating : 0.0;
    const reviews = typeof customer?.reviews === 'number' ? customer.reviews : 0;
    const completedOrders = customer?.completedOrders !== undefined && customer?.completedOrders !== null ? customer.completedOrders : 0;
    const paymentRecord = customer?.paymentRecord || '100% Reliable';
    const payoutTerms = customer?.payoutTerms || 'Instant upon POD';

    // Compact mode matching the design screenshot
    if (compact) {
        return (
            <div
                onClick={onOpenChat}
                className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all font-sans group"
                title="Shipper Profile & Chat"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {custName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 break-words group-hover:text-[#ff4a1f] transition-colors leading-tight">
                                {custName}
                            </h3>
                            {customer?.verified !== false && (
                                <CheckCircle2 size={16} className="text-white fill-emerald-500 shrink-0" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                            Verified Corporate Shipper
                        </p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs p-3.5 sm:p-4 space-y-3 font-sans">
            {/* Header / Avatar */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-sm font-bold relative shrink-0 shadow-2xs">
                    {customer?.avatar ? (
                        <img src={customer.avatar} alt={custName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span>{custName.charAt(0)}</span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-slate-100 break-words">
                            {custName}
                        </h3>
                        {customer?.verified !== false && (
                            <span title="Verified Business Account" className="inline-flex">
                                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                        <span>Verified Corporate Shipper</span>
                        {customer?.location && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300 font-semibold break-words" title={customer.location}>
                                    <MapPin size={10} className="text-blue-500 shrink-0" />
                                    <span>{customer.location}</span>
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px]">{rating.toFixed(1)}</span>
                        <span className="font-medium text-slate-400 text-[11px]">({reviews} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-2 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Building size={12} className="text-slate-400" />
                        <span>Booked Shipments</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {completedOrders} {completedOrders === 1 ? 'load' : 'loads'}
                    </span>
                </div>

                {customer?.location && (
                    <div className="flex justify-between items-center min-h-[19px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <MapPin size={12} className="text-slate-400" />
                            <span>Based in</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[170px] text-right">
                            {customer.location}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>Payment Release Record</span>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {paymentRecord}
                    </span>
                </div>

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span>Payout Terms</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {payoutTerms}
                    </span>
                </div>
            </div>

            {/* Secure Platform Chat Action */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                    variant="outline"
                    className="w-full h-9 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-2 rounded-[4px] shadow-2xs"
                    onClick={onOpenChat}
                >
                    <MessageSquare size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>Chat with Shipper (Secure)</span>
                </Button>
            </div>
        </div>
    );
};

export default SupplierCustomerProfile;
