import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/axios';
import { ActivityLogItem } from '../components/ActivityLogActions';

export function useActivityLogsData() {
    const [logs, setLogs] = useState<ActivityLogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            let raw: any[] = [];
            try {
                const res = await apiClient.get('/supplier/team/activity-logs');
                const rawPayload = res.data?.data;
                const list = Array.isArray(rawPayload?.data)
                    ? rawPayload.data
                    : Array.isArray(rawPayload?.logs)
                        ? rawPayload.logs
                        : Array.isArray(rawPayload)
                            ? rawPayload
                            : Array.isArray(res.data?.logs)
                                ? res.data.logs
                                : [];
                if (Array.isArray(list)) {
                    raw = list;
                }
            } catch (err) {
                console.error('Failed to fetch activity logs from API:', err);
            }

            if (raw.length > 0) {
                const mapped: ActivityLogItem[] = raw.map((l: any, idx: number) => {
                    const rawId = l.id || idx + 1;
                    const actName = l.action || l.description || 'Activity recorded';
                    const lowerAct = (l.raw_action || actName || '').toLowerCase();
                    const desc = l.description || actName;

                    let actType: ActivityLogItem['actionType'] = 'system';
                    if (lowerAct.includes('invite') || lowerAct.includes('invitation')) actType = 'invite';
                    else if (lowerAct.includes('create') || lowerAct.includes('add') || lowerAct.includes('submit') || lowerAct.includes('join')) actType = 'create';
                    else if (lowerAct.includes('delete') || lowerAct.includes('remove') || lowerAct.includes('cancel')) actType = 'delete';
                    else if (lowerAct.includes('block') || lowerAct.includes('auth') || lowerAct.includes('login') || lowerAct.includes('permission') || lowerAct.includes('security')) actType = 'security';
                    else if (lowerAct.includes('status') || lowerAct.includes('dispatch') || lowerAct.includes('assign')) actType = 'status';
                    else if (lowerAct.includes('update') || lowerAct.includes('edit') || lowerAct.includes('restore') || lowerAct.includes('export')) actType = 'update';

                    const rawCreatedAt = l.created_at || l.rawDate || new Date().toISOString();
                    const dateObj = new Date(rawCreatedAt);
                    const timeFormatted = l.created_at_formatted || l.time || (!isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : 'Recently');

                    const userName = l.user_name || l.user?.name || l.user || l.actor || '-';
                    const avatarStr = l.avatar || userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

                    return {
                        id: rawId,
                        rawId: rawId,
                        logCode: l.log_code || l.logCode || ('LOG-' + String(rawId).padStart(4, '0')),
                        user: userName,
                        userRole: l.user_role || l.user?.role || l.userRole || l.role || '-',
                        userEmail: l.user_email || l.user?.email || l.userEmail || '',
                        avatar: avatarStr,
                        action: actName,
                        rawAction: l.raw_action || lowerAct,
                        actionType: actType,
                        target: l.target || 'Team',
                        targetType: l.target_type || l.targetType || 'Resource',
                        category: l.category || (l.module ? (l.module.charAt(0).toUpperCase() + l.module.slice(1)) : 'Team'),
                        description: desc,
                        ipAddress: l.ip_address || l.ipAddress || '—',
                        location: l.location || 'Web Portal',
                        userAgent: l.user_agent || l.userAgent || 'Web Browser / API',
                        status: (l.status === 'Failed' || l.status === 'failed') ? 'Failed' : (l.status === 'Warning' || l.status === 'warning') ? 'Warning' : 'Success',
                        time: timeFormatted,
                        timeAgo: l.time_ago || l.timeAgo || 'Recently',
                        rawDate: rawCreatedAt,
                    };
                });

                setLogs(mapped);
            } else {
                setLogs([]);
            }
        } catch (err) {
            console.error('Failed to fetch activity logs:', err);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const userOptions = useMemo(() => {
        const set = new Set<string>();
        logs.forEach((l) => { if (l.user) set.add(l.user); });
        return [
            { id: 'all', name: 'All Staff Members' },
            ...Array.from(set).map((u) => ({ id: u, name: u })),
        ];
    }, [logs]);

    const isFiltered = selectedCategoryFilter !== 'all' || selectedActionFilter !== 'all' || selectedUserFilter !== 'all';

    const handleResetFilters = () => {
        setSelectedCategoryFilter('all');
        setSelectedActionFilter('all');
        setSelectedUserFilter('all');
    };

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            if (selectedCategoryFilter !== 'all' && log.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
                return false;
            }
            if (selectedActionFilter !== 'all' && log.actionType !== selectedActionFilter) {
                return false;
            }
            if (selectedUserFilter !== 'all' && log.user.toLowerCase() !== selectedUserFilter.toLowerCase()) {
                return false;
            }
            return true;
        });
    }, [logs, selectedCategoryFilter, selectedActionFilter, selectedUserFilter]);

    return {
        logs,
        filteredLogs,
        isLoading,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedActionFilter,
        setSelectedActionFilter,
        selectedUserFilter,
        setSelectedUserFilter,
        selectedLog,
        setSelectedLog,
        userOptions,
        isFiltered,
        handleResetFilters,
    };
}
