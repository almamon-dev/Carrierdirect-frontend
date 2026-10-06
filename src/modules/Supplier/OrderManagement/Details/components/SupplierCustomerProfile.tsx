import React from 'react';
import { ShieldCheck, Star, MessageSquare, Building, CheckCircle2, Clock } from 'lucide-react';
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
    };
    onOpenChat?: () => void;
}

export const SupplierCustomerProfile: React.FC<SupplierCustomerProfileProps> = ({
    customer,
    onOpenChat,
}) => {
    const custName = customer?.companyName || customer?.name || 'Premier Logistics Ltd';
    const rating = customer?.rating || 4.9;
    const reviews = customer?.reviews || 128;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs p-3.5 sm:p-4 space-y-3 font-sans">
            {/* Header / Avatar */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-sm font-bold relative shrink-0 shadow-2xs">
                    <span>{custName.charAt(0)}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-slate-100 truncate">
                            {custName}
                        </h3>
                        <span title="Verified Business Account" className="inline-flex">
                            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                        </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Verified Corporate Shipper
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[12px]">{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
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
                        {customer?.completedOrders || '140+'} loads
                    </span>
                </div>

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>Payment Release Record</span>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        100% Reliable
                    </span>
                </div>

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span>Payout Terms</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Instant upon POD
                    </span>
                </div>
            </div>

            {/* Secure Platform Chat Action */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                    variant="outline"
                    className="w-full h-9 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-2 rounded-[6px] shadow-2xs"
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
