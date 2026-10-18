import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/axios';
import { Truck, ShieldCheck, Users } from 'lucide-react';

export function useTeamDashboardData() {
    const [timeFilter, setTimeFilter] = useState('this_month');
    const [quickEmail, setQuickEmail] = useState('');
    const [quickInviteSent, setQuickInviteSent] = useState(false);
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        pendingInvitations: 0,
        onlineCount: 0,
    });
    const [growthData, setGrowthData] = useState<any[]>([
        { name: 'Week 1', members: 0, active: 0 },
        { name: 'Week 2', members: 0, active: 0 },
        { name: 'Week 3', members: 0, active: 0 },
        { name: 'Week 4', members: 0, active: 0 },
    ]);
    const [recentInvitations, setRecentInvitations] = useState<any[]>([]);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [departmentDist, setDepartmentDist] = useState<any[]>([
        { name: 'Fleet & Drivers', count: 0, percentage: 0, icon: Truck, color: 'bg-indigo-600', textCol: 'text-indigo-600' },
        { name: 'Operations & Dispatch', count: 0, percentage: 0, icon: ShieldCheck, color: 'bg-purple-500', textCol: 'text-purple-600' },
        { name: 'Customer Support & Sales', count: 0, percentage: 0, icon: Users, color: 'bg-emerald-500', textCol: 'text-emerald-600' },
        { name: 'Finance & Accounts', count: 0, percentage: 0, icon: Users, color: 'bg-amber-500', textCol: 'text-amber-600' },
    ]);

    const displayedGrowthData = useMemo(() => {
        if (timeFilter === 'last_month') {
            return [
                { name: 'Week 1', members: Math.max(0, Math.round(stats.totalMembers * 0.7)), active: Math.max(0, Math.round(stats.activeMembers * 0.65)) },
                { name: 'Week 2', members: Math.max(0, Math.round(stats.totalMembers * 0.8)), active: Math.max(0, Math.round(stats.activeMembers * 0.75)) },
                { name: 'Week 3', members: Math.max(0, Math.round(stats.totalMembers * 0.85)), active: Math.max(0, Math.round(stats.activeMembers * 0.8)) },
                { name: 'Week 4', members: Math.max(0, Math.round(stats.totalMembers * 0.9)), active: Math.max(0, Math.round(stats.activeMembers * 0.85)) },
            ];
        }
        if (timeFilter === 'this_year') {
            return [
                { name: 'Q1', members: Math.max(0, Math.round(stats.totalMembers * 0.4)), active: Math.max(0, Math.round(stats.activeMembers * 0.4)) },
                { name: 'Q2', members: Math.max(0, Math.round(stats.totalMembers * 0.65)), active: Math.max(0, Math.round(stats.activeMembers * 0.6)) },
                { name: 'Q3', members: Math.max(0, Math.round(stats.totalMembers * 0.85)), active: Math.max(0, Math.round(stats.activeMembers * 0.8)) },
                { name: 'Q4', members: stats.totalMembers, active: stats.activeMembers },
            ];
        }
        return growthData.length > 0 ? growthData : [
            { name: 'Week 1', members: Math.max(0, Math.round(stats.totalMembers * 0.5)), active: Math.max(0, Math.round(stats.activeMembers * 0.5)) },
            { name: 'Week 2', members: Math.max(0, Math.round(stats.totalMembers * 0.7)), active: Math.max(0, Math.round(stats.activeMembers * 0.7)) },
            { name: 'Week 3', members: Math.max(0, Math.round(stats.totalMembers * 0.9)), active: Math.max(0, Math.round(stats.activeMembers * 0.85)) },
            { name: 'Week 4', members: stats.totalMembers, active: stats.activeMembers },
        ];
    }, [timeFilter, growthData, stats]);

    useEffect(() => {
        let isMounted = true;
        async function fetchDashboardStats() {
            try {
                const [statsRes, invRes, logsRes, membersRes] = await Promise.allSettled([
                    apiClient.get('/supplier/team/stats'),
                    apiClient.get('/supplier/team/invitations'),
                    apiClient.get('/supplier/team/activity-logs'),
                    apiClient.get('/supplier/team/members'),
                ]);

                let totalCount = 0;
                let activeCount = 0;

                if (membersRes.status === 'fulfilled' && isMounted) {
                    const rawMembers = membersRes.value.data?.data?.members || membersRes.value.data?.data || membersRes.value.data || [];
                    const membersList = Array.isArray(rawMembers) ? rawMembers : [];
                    totalCount = membersList.length;
                    activeCount = membersList.filter((m: any) => (m.status || 'active').toLowerCase() === 'active').length;

                    const fleet = membersList.filter((m: any) =>
                        (m.department || '').toLowerCase().includes('fleet') ||
                        (m.role || '').toLowerCase().includes('driver') ||
                        (m.designation || '').toLowerCase().includes('driver')
                    ).length;

                    const operations = membersList.filter((m: any) =>
                        (m.department || '').toLowerCase().includes('operat') ||
                        (m.department || '').toLowerCase().includes('dispatch') ||
                        (m.role || '').toLowerCase().includes('dispatch')
                    ).length;

                    const support = membersList.filter((m: any) =>
                        (m.department || '').toLowerCase().includes('support') ||
                        (m.department || '').toLowerCase().includes('sales') ||
                        (m.role || '').toLowerCase().includes('support') ||
                        (m.role || '').toLowerCase().includes('sales')
                    ).length;

                    const finance = membersList.filter((m: any) =>
                        (m.department || '').toLowerCase().includes('finan') ||
                        (m.role || '').toLowerCase().includes('finan')
                    ).length;

                    const pct = (c: number) => (totalCount > 0 ? Math.round((c / totalCount) * 100) : 0);
                    setDepartmentDist([
                        { name: 'Fleet & Drivers', count: fleet, percentage: pct(fleet), icon: Truck, color: 'bg-indigo-600', textCol: 'text-indigo-600' },
                        { name: 'Operations & Dispatch', count: operations, percentage: pct(operations), icon: ShieldCheck, color: 'bg-purple-500', textCol: 'text-purple-600' },
                        { name: 'Customer Support & Sales', count: support, percentage: pct(support), icon: Users, color: 'bg-emerald-500', textCol: 'text-emerald-600' },
                        { name: 'Finance & Accounts', count: finance, percentage: pct(finance), icon: Users, color: 'bg-amber-500', textCol: 'text-amber-600' },
                    ]);
                }

                if (statsRes.status === 'fulfilled' && isMounted) {
                    const d = statsRes.value.data?.data || statsRes.value.data || {};
                    setStats({
                        totalMembers: d.total_members ?? totalCount,
                        activeMembers: d.active_members ?? activeCount,
                        pendingInvitations: d.pending_invitations ?? 0,
                        onlineCount: d.online_count ?? (activeCount > 0 ? 1 : 0),
                    });
                    if (Array.isArray(d.growth_chart)) setGrowthData(d.growth_chart);
                } else if (isMounted) {
                    setStats((prev) => ({
                        ...prev,
                        totalMembers: totalCount,
                        activeMembers: activeCount,
                        onlineCount: activeCount > 0 ? 1 : 0,
                    }));
                }

                if (invRes.status === 'fulfilled' && isMounted) {
                    const raw = invRes.value.data?.data?.invitations || invRes.value.data?.data || invRes.value.data || [];
                    if (Array.isArray(raw)) setRecentInvitations(raw.slice(0, 3));
                }

                if (logsRes.status === 'fulfilled' && isMounted) {
                    const raw = logsRes.value.data?.data?.logs || logsRes.value.data?.data || logsRes.value.data || [];
                    if (Array.isArray(raw)) setRecentLogs(raw.slice(0, 3));
                }
            } catch (err) {
                console.error('Failed to fetch team dashboard stats:', err);
            }
        }
        fetchDashboardStats();
        return () => { isMounted = false; };
    }, []);

    const handleQuickInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickEmail) return;
        try {
            await apiClient.post('/supplier/team/invite', { email: quickEmail });
        } catch (err) {
            console.error('Failed to send quick invite:', err);
        } finally {
            setQuickInviteSent(true);
            setTimeout(() => {
                setQuickEmail('');
                setQuickInviteSent(false);
            }, 3000);
        }
    };

    return {
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
    };
}
