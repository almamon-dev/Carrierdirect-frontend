import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import { apiClient } from '@/lib/axios';

export interface ActivityLogItem {
    id: number | string;
    user: string;
    action: string;
    target: string;
    category: string;
    time: string;
}

export default function ActivityLogsTab() {
    const [logs, setLogs] = useState<ActivityLogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');

    useEffect(() => {
        let isMounted = true;
        async function fetchLogs() {
            try {
                const res = await apiClient.get('/supplier/team/activity-logs');
                const raw = res.data?.data?.logs || res.data?.data || res.data || [];
                const resArray = Array.isArray(raw) ? raw : [];

                const mapped: ActivityLogItem[] = resArray.map((l: any, idx: number) => ({
                    id: l.id || idx + 1,
                    user: l.user?.name || l.actor || 'System',
                    action: l.action || l.description || 'Action performed',
                    target: l.target || l.item || '—',
                    category: l.category || l.type || 'General',
                    time: l.created_at ? new Date(l.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently',
                }));

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
        const matchesUser = selectedUserFilter === 'all' || log.user.toLowerCase().includes(selectedUserFilter.toLowerCase());
        return matchesCategory && matchesUser;
    });

    const columns: Column<ActivityLogItem>[] = [
        { 
            id: 'user', 
            label: 'Staff Member', 
            render: (row) => <span className="font-bold text-slate-900 dark:text-slate-100">{row.user}</span> 
        },
        { 
            id: 'action', 
            label: 'Action Performed', 
            render: (row) => <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.action}</span> 
        },
        { 
            id: 'target', 
            label: 'Target / Item', 
            render: (row) => <span className="font-bold text-[#ff4a1f]">{row.target}</span> 
        },
        { 
            id: 'category', 
            label: 'Category', 
            render: (row) => (
                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {row.category}
                </Badge>
            ) 
        },
        { 
            id: 'time', 
            label: 'Timestamp', 
            render: (row) => <span className="text-[11px] font-semibold text-slate-500">{row.time}</span> 
        }
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Category Filter</label>
                <Select value={selectedCategoryFilter} onChange={(val) => setSelectedCategoryFilter(val)} showSearch={false} options={[
                    { id: 'all', name: 'All Categories' },
                    { id: 'quotes', name: 'Quotes' },
                    { id: 'dispatch', name: 'Dispatch' },
                    { id: 'fleet', name: 'Fleet' },
                    { id: 'security', name: 'Security' },
                    { id: 'finance', name: 'Finance' }
                ]} />
            </div>
        </div>
    );

    return (
        <div className="p-0 space-y-5 font-sans">
            <DataTable 
                columns={columns} 
                data={filteredLogs} 
                compact={true}
                searchPlaceholder="Search activity logs by user, action, target..."
                hideViewToggle={true}
                filterContent={filterContent}
                isLoading={isLoading}
            />
        </div>
    );
}
