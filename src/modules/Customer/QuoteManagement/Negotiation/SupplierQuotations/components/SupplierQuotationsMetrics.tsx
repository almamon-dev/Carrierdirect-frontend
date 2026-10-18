import React from 'react';
import { FileText, CheckCircle2, Clock, Activity, Radio } from 'lucide-react';
import MetricCard from "@/components/cards/metric-card";

export interface SupplierQuotationsMetricsProps {
    supplierInfo: {
        totalQuotes: number;
        acceptedQuotes: number;
        pendingQuotes: number;
        lastSeenHuman: string;
        isOnline: boolean;
    };
    isLoading: boolean;
}

export const SupplierQuotationsMetrics: React.FC<SupplierQuotationsMetricsProps> = ({
    supplierInfo,
    isLoading,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
                title="Total Quotations"
                value={supplierInfo.totalQuotes}
                description="All submitted quotes & offers"
                icon={FileText}
                colorClass="bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F]"
                isLoading={isLoading}
            />
            <MetricCard
                title="Accepted Quotes"
                value={supplierInfo.acceptedQuotes}
                description="Confirmed & booked agreements"
                icon={CheckCircle2}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                isLoading={isLoading}
            />
            <MetricCard
                title="Pending / Counter"
                value={supplierInfo.pendingQuotes}
                description="Quotes awaiting decision or counter"
                icon={Clock}
                colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                isLoading={isLoading}
            />
            <MetricCard
                title="Partner Status"
                value={supplierInfo.lastSeenHuman}
                description={supplierInfo.isOnline ? "Carrier is currently online & responsive" : "Carrier is currently offline"}
                icon={supplierInfo.isOnline ? Radio : Activity}
                colorClass={
                    supplierInfo.isOnline
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }
                valueClassName={
                    supplierInfo.isOnline
                        ? "text-[16px] sm:text-[18px] font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-[16px] sm:text-[18px] font-bold text-slate-500 dark:text-slate-400"
                }
                badge={
                    <span className="flex items-center gap-1 text-[11px] font-medium">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                supplierInfo.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600"
                            }`}
                        />
                        <span className={supplierInfo.isOnline ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                            {supplierInfo.isOnline ? "Online" : "Offline"}
                        </span>
                    </span>
                }
                isLoading={isLoading}
            />
        </div>
    );
};
