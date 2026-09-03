import React, { useState, useEffect } from 'react';
import { 
    Clock, Shield, User, Globe, CheckCircle2, AlertTriangle, 
    XCircle, Tag, FileText, Truck, DollarSign, Layers 
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { apiClient } from '@/lib/axios';

export interface ActivityLogItem {
    id: number | string;
    logCode: string;
    user: string;
    userRole: string;
    userEmail: string;
    action: string;
    actionType: 'create' | 'update' | 'delete' | 'security' | 'status' | 'system';
    target: string;
    targetType: string;
    category: string;
    ipAddress: string;
    location: string;
    status: 'Success' | 'Warning' | 'Failed';
    time: string;
}

interface ActivityLogsTabProps {
    headerTabs?: React.ReactNode;
}

export default function ActivityLogsTab({ headerTabs }: ActivityLogsTabProps = {}) {
    const [logs, setLogs] = useState<ActivityLogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');

    useEffect(() => {
        let isMounted = true;
        async function fetchLogs() {
            setIsLoading(true);
            try {
                const res = await apiClient.get('/supplier/team/activity-logs');
                const raw = res.data?.data?.logs || res.data?.data || res.data || [];
                const resArray = Array.isArray(raw) ? raw : [];

                const mapped: ActivityLogItem[] = resArray.map((l: any, idx: number) => {
                    const rawId = l.id || idx + 1;
                    const actName = l.action || l.description || 'System event recorded';
                    const lowerAct = actName.toLowerCase();

                    let actType: ActivityLogItem['actionType'] = 'system';
                    if (lowerAct.includes('create') || lowerAct.includes('add') || lowerAct.includes('submit')) actType = 'create';
                    else if (lowerAct.includes('delete') || lowerAct.includes('remove')) actType = 'delete';
                    else if (lowerAct.includes('block') || lowerAct.includes('auth') || lowerAct.includes('login') || lowerAct.includes('permission')) actType = 'security';
                    else if (lowerAct.includes('status') || lowerAct.includes('dispatch') || lowerAct.includes('assign')) actType = 'status';
                    else if (lowerAct.includes('update') || lowerAct.includes('edit')) actType = 'update';

                    return {
                        id: rawId,
                        logCode: l.log_code || `LOG-${String(rawId).padStart(4, '0')}`,
                        user: l.user?.name || l.user_name || l.actor || 'Staff Member',
                        userRole: l.user?.role || l.user_role || l.role || 'Staff Member',
                        userEmail: l.user?.email || l.user_email || 'staff@carrierdirect.com',
                        action: actName,
                        actionType: actType,
                        target: l.target || l.item || l.resource || '—',
                        targetType: l.target_type || l.resource_type || 'Resource',
                        category: l.category || l.type || 'General',
                        ipAddress: l.ip_address || l.ip || '192.168.1.1',
                        location: l.location || l.city || 'Main Depot',
                        status: (l.status === 'failed' ? 'Failed' : l.status === 'warning' ? 'Warning' : 'Success') as any,
                        time: l.created_at ? new Date(l.created_at).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }) : 'Today, ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                    };
                });

                if (isMounted) setLogs(mapped);
            } catch (err) {
                console.error('Failed to fetch activity logs:', err);
                if (isMounted) setLogs([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchLogs();
        return () => { isMounted = false; };
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesCategory = selectedCategoryFilter === 'all' || log.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
        const matchesStatus = selectedStatusFilter === 'all' || log.status.toLowerCase() === selectedStatusFilter.toLowerCase();
        const matchesUser = selectedUserFilter === 'all' || log.user.toLowerCase().includes(selectedUserFilter.toLowerCase());
        return matchesCategory && matchesStatus && matchesUser;
    });

    const columns: Column<ActivityLogItem>[] = [
        { 
            id: 'logCode', 
            label: 'Log ID', 
            render: (row) => (
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700">
                    {row.logCode}
                </span>
            ) 
        },
        { 
            id: 'user', 
            label: 'Staff Member', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center font-bold text-xs shrink-0">
                        {row.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block truncate leading-tight">
                            {row.user}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                            {row.userRole}
                        </span>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'action', 
            label: 'Action Performed', 
            render: (row) => {
                let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (row.actionType === 'create') badgeStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60';
                else if (row.actionType === 'delete') badgeStyle = 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60';
                else if (row.actionType === 'security') badgeStyle = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60';
                else if (row.actionType === 'status') badgeStyle = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60';
                else if (row.actionType === 'update') badgeStyle = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60';

                return (
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[220px]">
                            {row.action}
                        </span>
                        <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle} capitalize`}>
                            {row.actionType}
                        </span>
                    </div>
                );
            } 
        },
        { 
            id: 'target', 
            label: 'Target / Resource', 
            render: (row) => (
                <div className="min-w-0">
                    <span className="font-bold text-[#ff4a1f] text-xs block truncate">
                        {row.target}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                        {row.targetType}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'category', 
            label: 'Category', 
            render: (row) => (
                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10.5px]">
                    {row.category}
                </Badge>
            ) 
        },
        { 
            id: 'ipAddress', 
            label: 'IP & Location', 
            render: (row) => (
                <div className="min-w-0">
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 block">
                        {row.ipAddress}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Globe size={10} className="text-slate-400 shrink-0" />
                        {row.location}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'status', 
            label: 'Outcome', 
            render: (row) => {
                if (row.status === 'Failed') {
                    return (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded border border-red-200/60">
                            <XCircle size={12} className="text-red-600" />
                            Failed
                        </span>
                    );
                }
                if (row.status === 'Warning') {
                    return (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200/60">
                            <AlertTriangle size={12} className="text-amber-600" />
                            Warning
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200/60">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Success
                    </span>
                );
            } 
        },
        { 
            id: 'time', 
            label: 'Timestamp', 
            render: (row) => (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium whitespace-nowrap">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>{row.time}</span>
                </div>
            ) 
        }
    ];

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <Select value={selectedCategoryFilter} onChange={(val) => setSelectedCategoryFilter(val)} showSearch={false} options={[
                        { id: 'all', name: 'All Categories' },
                        { id: 'quotes', name: 'Quotes & Pricing' },
                        { id: 'dispatch', name: 'Dispatch & Orders' },
                        { id: 'fleet', name: 'Fleet & Drivers' },
                        { id: 'security', name: 'Security & Auth' },
                        { id: 'finance', name: 'Finance & Payouts' },
                        { id: 'team', name: 'Team & Roles' }
                    ]} />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Outcome Status</label>
                    <Select value={selectedStatusFilter} onChange={(val) => setSelectedStatusFilter(val)} showSearch={false} options={[
                        { id: 'all', name: 'All Outcomes' },
                        { id: 'success', name: 'Success' },
                        { id: 'warning', name: 'Warning' },
                        { id: 'failed', name: 'Failed' }
                    ]} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans h-auto">
            <DataTable 
                columns={columns} 
                data={filteredLogs} 
                compact={true}
                searchPlaceholder="Search activity logs by staff, action, log ID, target..."
                hideViewToggle={true}
                tableLayout="auto"
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState 
                        title="No Activity Logs Found" 
                        description="No team activity or audit logs match your selected filter criteria." 
                    />
                }
            />
        </div>
    );
}
