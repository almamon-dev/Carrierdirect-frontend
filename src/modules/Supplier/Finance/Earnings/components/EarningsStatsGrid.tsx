import React from "react";
import { Euro, Calendar, Clock, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import MetricCard from "@/components/cards/metric-card";

interface EarningsStatsGridProps {
    stats: any;
}

export function EarningsStatsGrid({ stats }: EarningsStatsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <MetricCard
                title="Earned This Month"
                description="Total gross revenue earned in current month"
                value={stats?.this_month || stats?.earned_this_month || "€0.00"}
                icon={Euro}
                colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                badge={<StatusBadge status="Current" category="in_progress" />}
            />
            <MetricCard
                title="Last Month"
                description="Finalized earnings from prior billing cycle"
                value={stats?.last_month || "€0.00"}
                icon={Calendar}
                colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                badge={<StatusBadge status="Prior" category="neutral" />}
            />
            <MetricCard
                title="Pending Clearance"
                description="Funds in escrow awaiting delivery confirmation"
                value={stats?.pending_clearance || stats?.escrow_balance || "€0.00"}
                icon={Clock}
                colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                badge={<StatusBadge status="In Escrow" category="financial_hold" />}
            />
            <MetricCard
                title="Lifetime Earnings"
                description="Total gross historical earnings across all jobs"
                value={stats?.lifetime_earnings || stats?.total_earnings || "€0.00"}
                icon={TrendingUp}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                badge={<StatusBadge status="Total" category="neutral" />}
            />
        </div>
    );
}
