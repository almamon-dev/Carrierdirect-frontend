import React from 'react';
import { CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';

interface BillingMetricCardsProps {
    calculatedStats: {
        paidCount: number;
        dueCount: number;
        totalRevenueFormatted: string;
        totalOutstandingFormatted: string;
        totalInvoices: number | string;
    };
    isLoading: boolean;
}

export function BillingMetricCards({ calculatedStats, isLoading }: BillingMetricCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <MetricCard
                title="Total Revenue & Settled"
                description={`${calculatedStats.paidCount} cleared freight invoices`}
                value={calculatedStats.totalRevenueFormatted}
                icon={CheckCircle2}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Cleared</Badge>}
                valueClassName="text-base sm:text-lg"
                className="p-2.5 sm:p-3"
                isLoading={isLoading}
            />
            <MetricCard
                title="In Escrow & Pending"
                description={`${calculatedStats.dueCount} invoices in progress / due`}
                value={calculatedStats.totalOutstandingFormatted}
                icon={AlertCircle}
                colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                badge={<Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">Escrow</Badge>}
                valueClassName="text-base sm:text-lg"
                className="p-2.5 sm:p-3"
                isLoading={isLoading}
            />
            <MetricCard
                title="Total Freight Invoices"
                description="All shipping billing & settlement records"
                value={calculatedStats.totalInvoices}
                icon={Receipt}
                colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Total</Badge>}
                valueClassName="text-base sm:text-lg"
                className="p-2.5 sm:p-3"
                isLoading={isLoading}
            />
        </div>
    );
}
