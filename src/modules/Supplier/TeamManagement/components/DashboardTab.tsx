import React from 'react';
import MetricCard from '@/components/cards/metric-card';
import { Users, UserCheck, Clock, MonitorPlay } from 'lucide-react';
import { useTeamDashboardData } from '../hooks/useTeamDashboardData';
import { DashboardHeadcountChart } from './DashboardHeadcountChart';
import { DashboardDepartmentDistribution } from './DashboardDepartmentDistribution';
import { DashboardRecentActivity } from './DashboardRecentActivity';

interface DashboardTabProps {
    headerTabs?: React.ReactNode;
}

export default function DashboardTab({ headerTabs }: DashboardTabProps = {}) {
    const {
        timeFilter,
        setTimeFilter,
        quickEmail,
        setQuickEmail,
        quickInviteSent,
        stats,
        displayedGrowthData,
        recentInvitations,
        recentLogs,
        departmentDist,
        handleQuickInvite,
    } = useTeamDashboardData();

    return (
        <div className="space-y-3.5 font-sans">
            {headerTabs && (
                <div className="bg-white dark:bg-[#181d24] rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-none px-4 pt-2.5">
                    {headerTabs}
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                    title="Total Team Members"
                    description="Registered staff across departments."
                    value={stats.totalMembers}
                    trend={stats.totalMembers > 0 ? "+13% mo/mo" : undefined}
                    icon={Users}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                />
                <MetricCard
                    title="Active Operational Staff"
                    description="Members currently available for duty."
                    value={stats.activeMembers}
                    trend={stats.activeMembers > 0 ? "100% active" : undefined}
                    icon={UserCheck}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                    title="Pending Invitations"
                    description="Invites awaiting team confirmation."
                    value={stats.pendingInvitations || recentInvitations.length}
                    icon={Clock}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                />
                <MetricCard
                    title="Online Session Count"
                    description="Logins recorded in the past hour."
                    value={stats.onlineCount || (stats.activeMembers > 0 ? 1 : 0)}
                    icon={MonitorPlay}
                    colorClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                />
            </div>

            {/* Charts & Quick Invite Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                <DashboardHeadcountChart
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
                    displayedGrowthData={displayedGrowthData}
                />
                <DashboardDepartmentDistribution
                    totalMembers={stats.totalMembers}
                    departmentDist={departmentDist}
                    quickEmail={quickEmail}
                    setQuickEmail={setQuickEmail}
                    quickInviteSent={quickInviteSent}
                    handleQuickInvite={handleQuickInvite}
                />
            </div>

            {/* Bottom Row - Recent Invitations & Audit Logs */}
            <DashboardRecentActivity
                recentInvitations={recentInvitations}
                recentLogs={recentLogs}
            />
        </div>
    );
}
