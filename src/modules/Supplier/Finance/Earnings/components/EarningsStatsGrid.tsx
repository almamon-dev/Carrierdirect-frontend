import React from "react";
import { Euro, Calendar, Clock, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/badge";
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
                badge={<Badge variant="secondary" className="bg-orange-50 text-[#ff4a1f] text-[10px] font-semibold border border-orange-200">Current</Badge>}
            />
            <MetricCard
                title="Last Month"
                description="Finalized earnings from prior billing cycle"
                value={stats?.last_month || "€0.00"}
                icon={Calendar}
                colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                badge={<Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">Prior</Badge>}
            />
            <MetricCard
                title="Pending Clearance"
                description="Funds in escrow awaiting delivery confirmation"
                value={stats?.pending_clearance || stats?.escrow_balance || "€0.00"}
                icon={Clock}
                colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                badge={<Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">Escrow</Badge>}
            />
            <MetricCard
                title="Lifetime Earnings"
                description="Total gross historical earnings across all jobs"
                value={stats?.lifetime_earnings || stats?.total_earnings || "€0.00"}
                icon={TrendingUp}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Total</Badge>}
            />
        </div>
    );
}
