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
            <div className="grid grid-cols-[115px_12px_1fr] sm:grid-cols-[125px_14px_1fr] gap-y-2 items-center text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                    <Award size={12} className="text-slate-400 shrink-0" />
                    <span>Completed Loads</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {supplier.completedOrders}
                </span>

                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>On-Time Success</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {supplier.successRate}
                </span>

                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>Response Time</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {supplier.responseTime}
                </span>
            </div>

            {/* Action with full width */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenChat}
                    className="w-full h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                    <MessageSquare size={12} className="text-[#ff4a1f]" />
                    <span>Chat with Carrier</span>
                </Button>
            </div>
        </div>
    );
};

export default CustomerOrderSupplierProfile;
