import React from 'react';
import { ShieldCheck, Star, MessageSquare, Phone, Award, Clock, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderSupplierProfileProps {
    order: NormalizedCustomerOrder;
    onOpenChat: () => void;
}

export const CustomerOrderSupplierProfile: React.FC<CustomerOrderSupplierProfileProps> = ({
    order,
    onOpenChat,
}) => {
    const { supplier } = order;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-3 space-y-2.5 font-sans">
            {/* Header / Avatar & Identity */}
            <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-sm font-bold relative shrink-0 shadow-2xs">
                    {supplier.avatar ? (
                        <img src={supplier.avatar} alt={supplier.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span>{supplier.name.charAt(0)}</span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#1e2329] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">
                            {supplier.name}
                        </h3>
                        {supplier.verified && (
                            <span title="Verified Carrier Direct Partner">
                                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                            </span>
                        )}
                    </div>

                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                        Verified Logistics Operator
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span className="text-[11.5px]">{supplier.rating.toFixed(1)}</span>
                        <span className="font-medium text-slate-400 text-[10.5px]">({supplier.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-1.5 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Award size={12} className="text-slate-400" />
                        <span>Completed Loads</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {supplier.completedOrders}
                    </span>
                </div>

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>On-Time Success</span>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {supplier.successRate}
                    </span>
                </div>

                <div className="flex justify-between items-center min-h-[19px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span>Response Time</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {supplier.responseTime}
                    </span>
                </div>
            </div>

            {/* Actions with standard h-8 height */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-1.5">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenChat}
                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                    <MessageSquare size={12} className="text-[#ff4a1f]" />
                    <span>Chat Carrier</span>
                </Button>

                <a
                    href={`tel:${supplier.phone || '+49892020440'}`}
                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[3px] bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                    <Phone size={12} className="text-emerald-600" />
                    <span>Call Carrier</span>
                </a>
            </div>
        </div>
    );
};

export default CustomerOrderSupplierProfile;
